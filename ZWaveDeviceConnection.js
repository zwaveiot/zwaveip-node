/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

let DtlsSocket = require('securedgram-psk-aes');

let CryptoUtils = require('./CryptoUtils.js');

let ZWaveIP = require('./index.js');

/*** OBJECT INITIALIZATION FUNCTIONS ***/

function ZWaveDeviceConnection(ipAddressFamily, ipAddress, pskIdentity, pskPassword) {
    // verify that crypto is available; if not, return an error
    if (!CryptoUtils.verifyCrypto()) {
        console.log('CRITICAL ERROR: crypto not available.');
        return;
    }

    // store our connection parameters
    this.ipAddressFamily = ipAddressFamily;
    this.ipAddress = ipAddress;
    this.pskIdentity = pskIdentity;
    this.pskPassword = pskPassword;
    // create a variable to hold our socket reference (once we send a message)
    this.dtlsSocket = null;
    // randomize the initial sequenceNumber
    // NOTE: this will throw an exception if the crypto library is not available.
    this.sequenceNumber = CryptoUtils.crypto.randomBytes(1)[0];
    // create a hash to hold a record of all outstanding messages which are waiting for an acknowledgment
    this.messagesWaitingForAck = {};
    // create an array to hold all outstanding commands which are waiting for responses
    this.pendingCommandCallbacks = [];
}
exports.ZWaveDeviceConnection = ZWaveDeviceConnection;

exports.create = function(ipAddress, pskIdentity, pskPassword) {
    // validate inputs
    //
    // ipAddress
    if (typeof ipAddress !== "string") {
        throw TypeError();
    }
    // pskIdentity
    if (typeof pskIdentity !== "string") {
        throw TypeError();
    }
    // pskPassword
    if ((typeof pskPassword === "undefined") || pskPassword === null) {
        throw TypeError();
    } else if (Object.prototype.toString.call(pskPassword) != "[object Uint8Array]") {
        throw TypeError();
    }

    let ipAddressFamily = isIpv6Address(ipAddress) ? 'udp6' : 'udp4';

    // convert pskIdentity to UTF8 octets
    let pskIdentityAsBuffer = Buffer.from(pskIdentity, 'utf8');

    // create and initialize the new ZWaveDeviceConnection object
    let result = new ZWaveDeviceConnection(ipAddressFamily, ipAddress, pskIdentityAsBuffer, pskPassword);
    result.dtlsSocket = DtlsSocket.createDtlsSocket(ipAddressFamily, result, onMessage);

    // return the new ZWaveDeviceConnection record object
    return result;
}

ZWaveDeviceConnection.prototype.close = function(callback) {
    this.dtlsSocket.close(callback);
}

ZWaveDeviceConnection.prototype.ref = function() {
    this.dtlsSocket.ref();

    return this;
}

ZWaveDeviceConnection.prototype.unref = function() {
    this.dtlsSocket.unref();

    return this;
}

function isIpv6Address(ipAddress) {
    return (ipAddress.indexOf(":") >= 0);
}

/*** MESSAGE TRANSMISSION FUNCTIONS ***/

// NOTE: this function sends a Z-Wave command, waits for an ACK, and then waits for a response to the command
ZWaveDeviceConnection.prototype.sendMessageAndWaitForResponse = function(commandClass, requestCommand, data, responseCommand, responseMatchingId) {
    let thisObject = this;

    if (typeof responseMatchingId === "undefined") {
        // default
        responseMatchingId = null;
    }

    return new Promise(function(resolve, reject) {
        // register our response callback (so that we are listening for the response)
        let commandCallbackObject = thisObject.registerResponseCallback(commandClass, responseCommand, responseMatchingId, INTERNAL_ZWAVE_RESPONSE_TIMEOUT_MS, 
          true /* response is wrapped in Z/IP frame */, function(response, timeoutOccurred) {
            if (timeoutOccurred) { // timeout
                reject(new TimeoutError());
            } else { // response received
                resolve(response);
            }
        });

        thisObject.sendMessage(commandClass, requestCommand, data, commandCallbackObject)
        .then( // ACK/NAK
            function() { // fulfilled
                // update the response callback timer (to make sure we leave enough time for a response)
                thisObject.updateCommandCallbackTimeout(commandClass, responseCommand, INTERNAL_ZWAVE_RESPONSE_TIMEOUT_MS);
            },
            function(err) { // rejected
                // clear the response callback
                thisObject.getAndRemoveCommandCallback(commandClass, responseCommand);
                // forward the rejection to the caller
                reject(err);
            }
        )
    });
}

// NOTE: this function sends a Z-Wave command and waits for an ACK
ZWaveDeviceConnection.prototype.sendMessage = function(commandClass, command, data, responseCallback /* optional response callback; only used if command has registered (is waiting for) a response */) {
    if (typeof data === "undefined") {
        // default
        data = Buffer.alloc(0);
    }

    // convert data into a buffer
    data = new Buffer(data);

    let HEADER_SIZE = 10;
    let offset = 0;

    let thisObject = this;

    return new Promise(function(resolve, reject) {
        // register our outgoing message (so that we are listening for an ACK) and obtain a sequence number
        // NOTE: this also registers our callback which watches for ACK/NAK
        let sequenceNumber = thisObject.registerMessageForAckAndReserveSequenceNumber(INTERNAL_ZWAVE_ACK_TIMEOUT_MS, responseCallback, function(ackReceived, timeoutOccurred) {
            if (ackReceived) {
                resolve();
            } else if (timeoutOccurred) {
                reject(new TimeoutError());
            } else {
                reject(new NakError());
            }
        });

        // create z/ip packet
        let packet = Buffer.alloc(HEADER_SIZE + 2 + data.length);
        packet[offset] = PrivateCommandClass.Zip;
        offset += 1;
        packet[offset] = ZipCommand.ZipPacket;
        offset += 1;
        packet[offset] = ZIP_PACKET_FLAGS0.ACK_REQ;
        offset += 1;
        packet[offset] = ZIP_PACKET_FLAGS1.HDR_EXT_INCL | ZIP_PACKET_FLAGS1.ZW_CMD_INCL | ZIP_PACKET_FLAGS1.SECURE_ORIGIN;
        offset += 1;
        packet[offset] = sequenceNumber;
        offset += 1;
        packet[offset] = 0x00; // bit 7: RES; bits 0-6: Source Endpoint
        offset += 1;
        packet[offset] = 0x00; // bit 7: Bit address; bits 0-6: Destination Endpoint
        offset += 1;
        packet[offset] = 0x03; // size of complete Z/IP header extension (including this byte)
        offset += 1;
        packet[offset] = ZIP_OPTION.MAINTENANCE_GET;
        offset += 1;
        packet[offset] = 0x00; // length of option MAINTENANCE_GET (0 = no additional option fields for this option)
        offset += 1;
        packet[offset] = commandClass;
        offset += 1;
        packet[offset] = command;
        offset += 1;
        data.copy(packet, offset, 0, data.length);
        offset += data.length;

        // save a copy of our message in the "waiting for ACK response" record in case we need to automatically resend it
        let packetData = {
            msg: packet, 
            offset: 0, 
            length: packet.length, 
            port: 41230, 
            host: thisObject.ipAddress,
            pskIdentity: thisObject.pskIdentity, 
            pskPassword: thisObject.pskPassword,
            callback: null,
        };
        thisObject.addPacketToAckReservation(sequenceNumber, packetData);

        // send our message
        thisObject.dtlsSocket.send(packetData.msg, packetData.offset, packetData.length, packetData.port, packetData.host, packetData.pskIdentity, packetData.pskPassword);
    });
}

/*** NODE ID TO IP ADDRESS TRANSLATION FUNCTIONS ***/

ZWaveDeviceConnection.prototype.getIpAddressForNodeId = function(nodeId) {
    let thisObject = this;
    return new Promise(function(resolve, reject) {
        sendRawMessageAndWaitForResponse(thisObject, PrivateCommandClass.ZipNd, ZipNdCommand.InvNodeSolicitation, [0, nodeId], ZipNdCommand.NodeAdvertisement, nodeId)
        .then(
            function(data) {
                let ipv6AddressBuffer = null;
                let ipv4AddressBuffer = null;
                let homeIdBuffer = null;

                if (typeof data !== "undefined" && data !== null && data.data.length >= 22 && data.data[1] === nodeId) {
                    // retrieve the ipv6Address and homeId
                    ipv6AddressBuffer = Buffer.alloc(16);
                    data.data.copy(ipv6AddressBuffer, 0, 2, 2 + ipv6AddressBuffer.length);
                    homeIdBuffer = Buffer.alloc(4);
                    data.data.copy(homeIdBuffer, 0, 18, 18 + homeIdBuffer.length);
                    // check for an IPv4-mapped IPv6 address
                    if (bufferContainsIpv6Address) {
                        ipv4AddressBuffer = Buffer.alloc(4);
                        ipv6AddressBuffer.copy(ipv4AddressBuffer, 0, 12, 12 + ipv4AddressBuffer.length);
                    }
                } else {
                    // if the packet was malformatted or mismatched, return an error (this should never happen)
                    throw Error;
                }

                let ipv4Address = null;
                let ipv6Address = null;
                // format the IPv4 address as a string
                if (ipv4AddressBuffer !== null) {
                    ipv4Address = formatIpv4Address(ipv4AddressBuffer);
                }
                if (ipv6AddressBuffer !== null) {
                    ipv6Address = formatIpv6Address(ipv6AddressBuffer);
                }

                resolve({'ipv4Address': ipv4Address, 'ipv6Address': ipv6Address, 'homeId': homeIdBuffer});
            },
            function(err) {
                reject(err);
            }
        );
    });
}

let formatIpv4Address = function(ipv4AddressBuffer) {
    return ipv4AddressBuffer[0] + "." + ipv4AddressBuffer[1] + "." + ipv4AddressBuffer[2] + "." + ipv4AddressBuffer[3];
}

let bufferContainsIpv6Address = function(ipv6AddressBuffer) {
    if (ipv6AddressBuffer === null || ipv6AddressBuffer.length != 16) {
        return false;
    }

    return ((ipv6AddressBuffer[0] === 0x00) &&
      (ipv6AddressBuffer[1] === 0x00) &&
      (ipv6AddressBuffer[2] === 0x00) &&
      (ipv6AddressBuffer[3] === 0x00) &&
      (ipv6AddressBuffer[4] === 0x00) &&
      (ipv6AddressBuffer[5] === 0x00) &&
      (ipv6AddressBuffer[6] === 0x00) &&
      (ipv6AddressBuffer[7] === 0x00) &&
      (ipv6AddressBuffer[8] === 0x00) &&
      (ipv6AddressBuffer[9] === 0x00) &&
      (ipv6AddressBuffer[10] === 0xFF) &&
      (ipv6AddressBuffer[11] === 0xFF));
}

let formatIpv6Address = function(ipv6AddressBuffer) {
    // special case: write out IPv4-mapped IPv6 addresses in dotted notation
    if (bufferContainsIpv6Address(ipv6AddressBuffer)) {
        return "::ffff:" + ipv6AddressBuffer[12] + "." + ipv6AddressBuffer[13] + "." + ipv6AddressBuffer[14] + "." + ipv6AddressBuffer[15];
    }

    // first, find the longest range of zeros in the address buffer
    let longestStartPosition = null;
    let longestZeroOctetPairRepetition = 1; // default to one so that we don't consider sequences of just one zero octet pair to be a "string of zeros" (because just one zero octet pair is not "::"'d)
    for (let iStart = 0; iStart < ipv6AddressBuffer.length; iStart += 2) {
        if (ipv6AddressBuffer[iStart] === 0 && ipv6AddressBuffer[iStart + 1] === 0) {
            for (let iCurrent = iStart + 2; iCurrent < ipv6AddressBuffer.length; iCurrent += 2) {
                if (ipv6AddressBuffer[iCurrent] === 0 && ipv6AddressBuffer[iCurrent + 1] === 0) {
                    if ((iCurrent - iStart + 2) / 2 > longestZeroOctetPairRepetition) {
                        longestStartPosition = iStart;
                        longestZeroOctetPairRepetition = (iCurrent - iStart + 2) / 2;
                    }
                }
            }
        }
    }

    let result = null;

    // if there is a range of zeros, omit it; otherwise, write out the full sequence
    if (longestStartPosition !== null) {
        result = "";
        // write out the leading double-octet sequences
        for (let i = 0; i < longestStartPosition; i += 2) {
            result += removeLeadingZeroesFromNonZeroHexChars(ipv6AddressBuffer[i].toString(16) + ipv6AddressBuffer[i + 1].toString(16));
            if (i < ipv6AddressBuffer.length - 2) result += ":";
        }
        // if the longestStartPosition was zero, add a starter ":"
        if (longestStartPosition === 0) result += ":";
        // write out the middle "::" by adding a ":" to skip this part of the range
        result += ":";
        // write out the trailing octet pair sequences 
        for (let i = longestStartPosition + (longestZeroOctetPairRepetition * 2); i < ipv6AddressBuffer.length; i += 2) {
            result += removeLeadingZeroesFromNonZeroHexChars(ipv6AddressBuffer[i].toString(16) + ipv6AddressBuffer[i + 1].toString(16));
            if (i < ipv6AddressBuffer.length - 2) result += ":";            
        }
    } else {
        result = "";
        for (let i = 0; i < ipv6AddressBuffer.length; i++) {
            result += removeLeadingZeroesFromNonZeroHexChars(ipv6AddressBuffer[i].toString(16) + ipv6AddressBuffer[i + 1].toString(16));
            if (i < ipv6AddressBuffer.length - 2) result += ":";            
        }
    }

    return result;
}

let removeLeadingZeroesFromNonZeroHexChars = function(hexChars) {
    // return single-character sequences no matter what
    if (hexChars.length <= 1) {
        return hexChars;
    }

    // otherwise, remove any leading zeros which are not the final character
    for (let i = 0; i < hexChars.length -1; i++) {
        if (hexChars.substring(0, 1) === '0') {
            // remove leading zero
            hexChars = hexChars.substring(1, hexChars.length);
        }
    }

    return hexChars;
}

// NOTE: this function sends a raw Z-Wave command, does not wait for an ACK, but does wait for a (raw) response
let sendRawMessageAndWaitForResponse = function(thisObject, commandClass, requestCommand, data, responseCommand, responseMatchingId) {
    if (typeof responseMatchingId === "undefined") {
        // default
        responseMatchingId = null;
    }

    return new Promise(function(resolve, reject) {
        // register our response callback (so that we are listening for the response)
        let commandCallbackObject = thisObject.registerResponseCallback(commandClass, responseCommand, responseMatchingId, INTERNAL_ZWAVE_RESPONSE_TIMEOUT_MS, 
          false /* response is not wrapped in Z/IP frame */, function(response, timeoutOccurred) {
            if (timeoutOccurred) { // timeout
                reject(new TimeoutError());
            } else { // response received
                resolve(response);
            }
        });

        sendRawMessage(thisObject, commandClass, requestCommand, data);
    });
}

// NOTE: this function sends a raw Z-Wave command without wrapping it inside a Z/IP frame and without waiting for an acknowledgment
let sendRawMessage = function(thisObject, commandClass, command, data) {
    if (typeof data === "undefined") {
        // default
        data = Buffer.alloc(0);
    }

    // convert data into a buffer
    data = new Buffer(data);

    let offset = 0;

    // create z/ip packet
    let packet = Buffer.alloc(2 + data.length);
    packet[offset] = commandClass;
    offset += 1;
    packet[offset] = command;
    offset += 1;
    data.copy(packet, offset, 0, data.length);
    offset += data.length;

    // send our message
    thisObject.dtlsSocket.send(packet, 0, packet.length, 41230, thisObject.ipAddress, thisObject.pskIdentity, thisObject.pskPassword);
}

/*** OUTGOING MESSAGE HELPER FUNCTIONS ***/

ZWaveDeviceConnection.prototype.incrementSequenceNumber = function() {
    /* NOTE: for details on sequence numbers, see section 3.58.1 (Z/IP Packet Command) of the Z-Wave command class document 
     *       (the sequence number can be shared globally, is 8-bit, and we initialized it to a random value) */
    this.sequenceNumber = (this.sequenceNumber + 1) % 256;
}

ZWaveDeviceConnection.prototype.addPacketToAckReservation = function(sequenceNumber, data) {
    if (typeof this.messagesWaitingForAck[this.sequenceNumber.toString()] !== "undefined") {
        this.messagesWaitingForAck[this.sequenceNumber.toString()].originalData = data;
    }
}

ZWaveDeviceConnection.prototype.registerMessageForAckAndReserveSequenceNumber = function(timeoutInMilliseconds, responseCallbackObject, callback) {
    let timeoutTimestamp = createTimestampByOffset(timeoutInMilliseconds);

    // try to generate a unique sequence number up to 256 times
    for (let i = 0; i < 256; i++)
    {
        this.incrementSequenceNumber();

        if (typeof this.messagesWaitingForAck[this.sequenceNumber.toString()] !== "undefined") {
            // as a safety against lost messages, delete expired waitingForAck records
            if (this.checkTimeoutHasOccured(this.messagesWaitingForAck[this.sequenceNumber.toString()].timeoutTimestamp)) {
                delete this.messagesWaitingForAck[this.sequenceNumber.toString()];
            } else {
                // this sequence number is still active; try another slot.
                continue;
            }
        }

        let thisObject = this;
        let timeoutObject = setTimeout(ackTimeoutCallback, timeoutInMilliseconds, thisObject, this.sequenceNumber);

        this.messagesWaitingForAck[this.sequenceNumber.toString()] = new MessageWaitingForAck(callback, timeoutTimestamp, timeoutObject, responseCallbackObject);
        return this.sequenceNumber;
    }

    // if no message slots (sequence numbers) are available, fail.
    return null;
}

let ackTimeoutCallback = function(thisObject, sequenceNumber) {
    let remainingMilliseconds = thisObject.getRemainingAckTimeoutInMilliseconds(sequenceNumber);
    // if the ACK no longer has a record, throw the TimeoutError
    if (typeof remainingMilliseconds === "undefined" || remainingMilliseconds === null) {
        let ackRegistration = thisObject.getAndRemoveAckRegistration(sequenceNumber);
        if (typeof ackRegistration !== "undefined") {
            ackRegistration.callback(false /* ack received */, true /* timeoutOccurred */);
        }
    }
    // if the ACK has a record, check if it has indeed already timed out
    if (remainingMilliseconds > 0) {
        // retrigger this timeout
        setTimeout(ackTimeoutCallback, remainingMilliseconds, thisObject, sequenceNumber);
    } else {
        // timeout; throw TimeoutError
        let ackRegistration = thisObject.getAndRemoveAckRegistration(sequenceNumber);
        if (typeof ackRegistration !== "undefined") {
            ackRegistration.callback(false /* ack received */, true /* timeoutOccurred */);
        }
    }
}

ZWaveDeviceConnection.prototype.getRemainingAckTimeoutInMilliseconds = function(sequenceNumber) {
    let currentTime = process.hrtime();

    if (typeof this.messagesWaitingForAck[this.sequenceNumber.toString()] !== "undefined") {
        return subtractTimestampsInMilliseconds(this.messagesWaitingForAck[this.sequenceNumber.toString()].timeoutTimestamp, currentTime);
    } else {
        return null;
    }
}

ZWaveDeviceConnection.prototype.updateAckTimeout = function(sequenceNumber, timeoutInMilliseconds) {
    let timeoutTimestamp = createTimestampByOffset(timeoutInMilliseconds);

    if (typeof this.messagesWaitingForAck[this.sequenceNumber.toString()] !== "undefined") {
        this.messagesWaitingForAck[this.sequenceNumber.toString()].timeoutTimestamp = timeoutTimestamp;
        // also update the response callback's timeout, if one exists
        let responseCallbackObject = this.messagesWaitingForAck[this.sequenceNumber.toString()].responseCallbackObject;
        if (typeof responseCallbackObject !== "undefined" && responseCallbackObject !== null) {
            responseCallbackObject.timeoutTimestamp = createTimestampByOffset(timeoutInMilliseconds + INTERNAL_ZWAVE_RESPONSE_TIMEOUT_MS);
        }
        return sequenceNumber;
    } else {
        // if the record is already deleted, return null
        return null;
    }
}

ZWaveDeviceConnection.prototype.getAndRemoveAckRegistration = function(sequenceNumber) {
    let ackRegistration = this.messagesWaitingForAck[sequenceNumber.toString()];
    if (typeof ackRegistration !== "undefined" && ackRegistration !== null)
    {
        delete this.messagesWaitingForAck[sequenceNumber.toString()];
    }

    return ackRegistration;
}

/*** INCOMING RESPONSE HELPER FUNCTIONS ***/

ZWaveDeviceConnection.prototype.registerResponseCallback = function(commandClass, responseCommand, matchIdentiifer, timeoutInMilliseconds, isWrappedInZipFrame, callback) {
    let thisObject = this;
    let timeoutObject = setTimeout(responseTimeoutCallback, timeoutInMilliseconds, thisObject, commandClass, responseCommand);

    let commandCallback = new ZWaveCommandCallback(commandClass, responseCommand, matchIdentiifer, callback, timeoutInMilliseconds, timeoutObject, isWrappedInZipFrame);
    this.pendingCommandCallbacks.push(commandCallback);

    return commandCallback;
}

let responseTimeoutCallback = function(thisObject, commandClass, command) {
    let remainingMilliseconds = thisObject.getRemainingResponseTimeoutInMilliseconds(commandClass, command);
    // if the response no longer has a pending callback record, throw the TimeoutError
    if (typeof remainingMilliseconds === "undefined" || remainingMilliseconds === null) {
        let commandCallback = thisObject.getAndRemoveCommandCallback(commandClass, command);
        if (typeof commandCallback !== "undefined" && commandCallback !== null) {
            commandCallback.callback(false /* response received */, true /* timeoutOccurred */);
        }
    }
    // if the response has a pending callback record, check if it has indeed already timed out
    if (remainingMilliseconds > 0) {
        // retrigger this timeout
        setTimeout(responseTimeoutCallback, remainingMilliseconds, thisObject, commandClass, command);
    } else {
        // timeout; throw TimeoutError
        let commandCallback = thisObject.getAndRemoveCommandCallback(commandClass, command);
        if (typeof commandCallback !== "undefined" && commandCallback !== null) {
            commandCallback.callback(false /* response received */, true /* timeoutOccurred */);
        }
    }
}

ZWaveDeviceConnection.prototype.getRemainingResponseTimeoutInMilliseconds = function(commandClass, command) {
    let currentTime = process.hrtime();

    for (let iCallback = 0; iCallback < this.pendingCommandCallbacks.length; iCallback++)
    {
        let commandCallback = this.pendingCommandCallbacks[iCallback];
        if (commandCallback.commandClass === commandClass && commandCallback.command === command) {
            return subtractTimestampsInMilliseconds(this.pendingCommandCallbacks[iCallback].timeoutTimestamp, currentTime);    
        }
    }

    // if we could not locate a pending command callback, return null
    return null;
}

ZWaveDeviceConnection.prototype.updateCommandCallbackTimeout = function(commandClass, command, timeoutInMilliseconds) {
    let timeoutTimestamp = createTimestampByOffset(timeoutInMilliseconds);

    for (let iCallback = 0; iCallback < this.pendingCommandCallbacks.length; iCallback++)
    {
        let commandCallback = this.pendingCommandCallbacks[iCallback];
        if (commandCallback.commandClass === commandClass && commandCallback.command === command) {
            this.pendingCommandCallbacks[iCallback].timeoutTimestamp = timeoutTimestamp;
            return;
        }
    }
}

ZWaveDeviceConnection.prototype.getAndRemoveCommandCallback = function(commandClass, command) {
    // for data packets: treat this message as a response and check it against the "pending command callbacks" list
    for (let iCallback = 0; iCallback < this.pendingCommandCallbacks.length; iCallback++)
    {
        let commandCallback = this.pendingCommandCallbacks[iCallback];
        if (commandCallback.commandClass === commandClass && commandCallback.command === command) {
            // clear the item's timeoutObject
            clearTimeout(commandCallback.timeoutObject);
            // remove the item
            this.pendingCommandCallbacks.splice(iCallback, 1);
            return commandCallback;
        }
    }

    return null;
}

/*** SHARED TIMEKEEPING FUNCTIONS ***/

let subtractTimestampsInMilliseconds = function(timestamp1, timestamp2)
{
    return Math.floor((((timestamp1[0] - timestamp2[0]) * 1000000000) + (timestamp1[1] - timestamp2[1])) / 1000000);
}

ZWaveDeviceConnection.prototype.checkTimeoutHasOccured = function(timestamp) {
    let currentTime = process.hrtime();
    if ((timestamp[0] < currentTime[0]) || (timestamp[0] == currentTime[0] && timestamp[1] <= currentTime[1]))
    {
        return true;
    }
    else
    {
        return false;
    }
}

let addTime = function(baseTime, millisecondsToAdd)
{
    let result = [baseTime[0], baseTime[1]];
    result[1] += (millisecondsToAdd * 1000000);
    if (result[1] >= 1000000000)
    {
        // rollover
        result[0] += Math.floor(result[1] / 1000000000); // add one second
        result[1] %= 1000000000; // rollover nanoseconds
    }

    return result;
}

let createTimestampByOffset = function(millisecondsToAdd) {
    if (millisecondsToAdd === undefined) {
        millisecondsToAdd = 0;
    }

    let currentTime = process.hrtime();
    return addTime(currentTime, millisecondsToAdd);
}

/*** INCOMING (DECRYPTED) MESSAGE HANDLER ***/

let onMessage = function(thisObject, data, rinfo) {
    if (typeof data === "undefined") {
        // no data; abort.
        return;
    }
    if (Object.prototype.toString.call(data) != "[object Uint8Array]") 
    {
        // no data; abort.
        return;
    }

    let HEADER_MINIMUM_SIZE = 2;
    let ZIP_WRAPPED_HEADER_MINIMUM_SIZE = 7;
    if (data.length < HEADER_MINIMUM_SIZE)
    {
        // not enough data for any packet; abort.
        return;
    }

    let isWrappedInZipFrame = false;

    // get the "initial" command class and command; in case of Z/IP-wrapped packets, these are the "header" (wrapping) command class and command
    let offset = 0;
    // command class
    let initialCommandClass = data[offset];
    offset += 1;
    // command
    let initialCommand = data[offset];
    offset += 1;

    if (initialCommandClass !== PrivateCommandClass.Zip || initialCommand !== ZipCommand.ZipPacket)
    {
        // mesage is not enclosed in a Z/IP packet; handle this special case first
        isWrappedInZipFrame = false;

        if (initialCommandClass === PrivateCommandClass.ZipNd && initialCommand === ZipNdCommand.NodeAdvertisement) {
            // allowed command
        } else {
            // if we do not recognize the command as an allowable "non-wrapped" incoming command/response, abort now
            return;
        }
    }
    else {
        // otherwise, the packet is a Z/IP packet; make sure it is at least large enough for a minimal Z/IP packet
        isWrappedInZipFrame = true;

        if (data.length < ZIP_WRAPPED_HEADER_MINIMUM_SIZE)
        {
            // not enough data for minimal Z/IP packet; abort.
            return;
        }
    }

    // parse message
    let ackResponse = null;
    let nackResponse = null;
    let nackWaiting = null;
    let nackQueueFull = null;
    let headerExtensionsIncluded = null;
    let sequenceNumber = null;
    let headerExtensionsLength = null;
    let commandClass = null;
    let command = null;
    let payload = null;
    if (isWrappedInZipFrame) {
        // AckRequest | AckResponse | NackResponse | NackFlags (Waiting, QueueFull, OptionError) | Reserved
        ackResponse = ((data[offset] & ZIP_PACKET_FLAGS0.ACK_RES) != 0);
        nackResponse = ((data[offset] & ZIP_PACKET_FLAGS0.NACK_RES) != 0);
        nackWaiting = ((data[offset] & ZIP_PACKET_FLAGS0.WAIT_RES) != 0);
        nackQueueFull = ((data[offset] & ZIP_PACKET_FLAGS0.NACK_QF) != 0);
        offset += 1;
        // HeaderExtIncluded | ZWaveCmdIncluded | MoreInformation | SecureOrigin | Reserved
        headerExtensionsIncluded = ((data[offset] & ZIP_PACKET_FLAGS1.HDR_EXT_INCL) != 0);
        offset += 1;
        // SequenceNumber
        sequenceNumber = data[offset];
        offset += 1;
        // Res | SourceEndPoint
        offset += 1;
        // BitAddress | DestinationEndpoint
        offset += 1;
        // Header Extensions (optional)
        headerExtensionsLength = 0;
        if (headerExtensionsIncluded) {
            // first byte of header extensions: total length
            headerExtensionsLength = data[offset];
            // NOTE: we are currently ignoring extensions

            offset += headerExtensionsLength;
        }
        //
        if (data.length >= ZIP_WRAPPED_HEADER_MINIMUM_SIZE + headerExtensionsLength + 2) {
            // command class
            commandClass = data[offset];
            offset += 1;
            // command
            command = data[offset];
            offset += 1;
        }
    } else {
        commandClass = initialCommandClass;
        command = initialCommand;
    }
    //
    // payload data
    payload = Buffer.alloc(data.length - offset);
    data.copy(payload, 0, offset, data.length);
    offset += payload.length;

    if (isWrappedInZipFrame) {
        // if this message is an ACK response, trigger any pending ACK 
        if (ackResponse) {
            let ackRegistration = thisObject.getAndRemoveAckRegistration(sequenceNumber);
            if (typeof ackRegistration !== "undefined") {
                if (typeof ackRegistration.timeoutObject !== "undefined") {
                    clearTimeout(ackRegistration.timeoutObject);
                }
                if (!thisObject.checkTimeoutHasOccured(ackRegistration.timeoutTimestamp)) {
                    ackRegistration.callback(true, false); // true = ACK, false = no Z/IP protocol timeout
                }
            }
        }
        else if (nackResponse) {
            if (nackQueueFull) {
                // queue full: retry sending message in ten seconds
                this.updateAckTimeout(sequenceNumber, 12000); // 10 seconds + 2 seconds wait time
                //
                thisObject.dtlsSocket.send(ackRegistration.data.msg, ackRegistration.data.offset, ackRegistration.data.length, ackRegistration.data.port, ackRegistration.data.host,
                    ackRegistration.data.pskIdentity, ackRegistration.data.pskPassword, ackRegistration.data.callback);            
            } else if (nackWaiting) {
                // add 90 seconds to the ACK timeout timer 
                thisObject.updateAckTimeout(sequenceNumber, 90000);
            } else {
                // message was rejected
                let ackRegistration = thisObject.getAndRemoveAckRegistration(sequenceNumber);
                if (typeof ackRegistration !== "undefined") {
                    if (typeof ackRegistration.timeoutObject !== "undefined") {
                        clearTimeout(ackRegistration.timeoutObject);
                    }
                    if (!thisObject.checkTimeoutHasOccured(ackRegistration.timeoutTimestamp)) {
                        ackRegistration.callback(false, false); // false = NAK, false = no Z/IP protocol timeout
                    }
                }       
            } 
        }
    }

    if (commandClass !== null && command !== null) {
        // for data packets: treat this message as a response and check it against the "pending command callbacks" list
        for (let iCallback = 0; iCallback < thisObject.pendingCommandCallbacks.length; iCallback++)
        {
            let commandCallback = thisObject.pendingCommandCallbacks[iCallback];
            if (commandCallback.commandClass === commandClass && commandCallback.command === command && commandCallback.isWrappedInZipFrame === isWrappedInZipFrame)
            {
                // command class and command matches; check timeout
                if (thisObject.checkTimeoutHasOccured(commandCallback.timeoutTimestamp))
                {
                    // command has timed out; skip this entry as its callback will automatically be removed at timeout
                    continue;
                }

                // command class and command match and timeout has not expired; check match identifier if one exists
                if (commandClass == ZWaveIP.CommandClass.NetworkManagementProxy && command == ZWaveIP.NetworkManagementProxyCommand.NodeListReport) {
                    if (payload.length < 1 || payload[0] != commandCallback.matchIdentifier) {
                        // NOTE: matchIdentifier is the sequenceNumber
                        // match identifier does not match; skip this entry
                        continue;
                    }
                }
                else if(commandClass == PrivateCommandClass.ZipNd && command == ZipNdCommand.NodeAdvertisement) {
                    if (payload.length < 2 || payload[1] != commandCallback.matchIdentifier) {
                        // NOTE: matchIdentifier is the nodeId
                        // match identifier does not match; skip this entry
                        continue;
                    }
                }
                // else...

                // if we reach here, the response matches; deactivate the callback timer, remove the callback entry and then call the callback
                //
                let callback = commandCallback.callback;
                // cancel the callback timeout timer
                clearTimeout(commandCallback.timeoutObject);
                // remove the callback from the pending callbacks list
                thisObject.pendingCommandCallbacks.splice(iCallback, 1);
                // call the callback
                commandCallback.callback({commandClass: commandClass, command: command, data: payload}, false /* did not time out */);
                break;
            }
        }
    }

    // if there was no callback registered, simply discard this packet.
}

/*** CONSTANTS AND ENUMERATIONS ***/

/* ZIP constants for internal use */
let INTERNAL_ZWAVE_ACK_TIMEOUT_MS = 300;
let INTERNAL_ZWAVE_RESPONSE_TIMEOUT_MS = 2000;

/* ZIP enumerations for internal use */
let ZIP_PACKET_FLAGS0 = Object.freeze({
    ACK_REQ: 0x80,
    ACK_RES: 0x40,
    NACK_RES: 0x20,
    WAIT_RES: 0x10,
    NACK_QF: 0x08,
});

let ZIP_PACKET_FLAGS1 = Object.freeze({
    HDR_EXT_INCL: 0x80,
    ZW_CMD_INCL: 0x40,
    MORE_INFORMATION: 0x20,
    SECURE_ORIGIN: 0x10,
});

let ZIP_OPTION = Object.freeze({
    EXPECTED_DELAY: 1,
    MAINTENANCE_GET: 2,
    MAINTENANCE_REPORT: 3,
});

/* internal-use command classes */
let PrivateCommandClass = Object.freeze({
    Zip: 0x23,
    ZipNd: 0x58,
    properties: {
        0x23: {name: "Zip"},
        0x58: {name: "ZipNd"},
    }
});

/* Zip commands */
let ZipCommand = Object.freeze({
    ZipPacket: 0x02,
    properties: {
        0x01: {name: "ZipPacket"},
    }
});
//exports.ZipCommand = ZipCommand;
let isZipCommandValid = function(command) {
    return (this.ZipCommand.properties[command] !== undefined);
}

/* ZipNd commands */
let ZipNdCommand = Object.freeze({
    NodeAdvertisement: 0x01,
    NodeSolicitation: 0x03,
    InvNodeSolicitation: 0x04,
    properties: {
        0x01: {name: "NodeAdvertisement"},
        0x03: {name: "NodeSolicitation"},
        0x04: {name: "InvNodeSolicitation"},
    }
});
//exports.ZipNdCommand = ZipNdCommand;
let isZipNdCommandValid = function(command) {
    return (this.ZipNdCommand.properties[command] !== undefined);
}

/* TimeoutError */
function TimeoutError() {
    this.message = "Timeout";
    var error = new Error(this.message);
    this.stack = error.stack;
}
TimeoutError.prototype = new Error();
TimeoutError.prototype.name = TimeoutError.name;
TimeoutError.prototype.constructor = TimeoutError;

/* NakError */
function NakError() {
    this.message = "NAK";
    var error = new Error(this.message);
    this.stack = error.stack;
}
NakError.prototype = new Error();
NakError.prototype.name = NakError.name;
NakError.prototype.constructor = NakError;

/* MessageWaitingForAck */
function MessageWaitingForAck(callback, timeoutTimestamp, timeoutObject, responseCallbackObject) {
    this.callback = callback;
    this.timeoutTimestamp = timeoutTimestamp;
    this.timeoutObject = timeoutObject;
    this.responseCallbackObject = responseCallbackObject; // optional; used to keep the response timeout in sync when a command is expecting (i.e. has registered) a response
}

/* CommandCallback */
function ZWaveCommandCallback(commandClass, command, matchIdentifier, callback, timeoutInMilliseconds, timeoutObject, isWrappedInZipFrame) {
    this.commandClass = commandClass;
    this.command = command;
    this.matchIdentifier = matchIdentifier;
    this.callback = callback;
    this.timeoutInMilliseconds = timeoutInMilliseconds;
    this.timeoutTimestamp = addTime(process.hrtime(), timeoutInMilliseconds); // initial timeout (NOTE: we ignore ACK timeouts until we get an ACK/NAK)
    this.timeoutObject = timeoutObject;
    this.isWrappedInZipFrame = isWrappedInZipFrame; // true for most responses (wrapped in Z/IP); false for special responses (like Z/IP Node Advertisement)
}
