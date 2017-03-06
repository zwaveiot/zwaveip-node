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

// dgram
let dgram = require('dgram');

let ZWaveIP = require('./index.js');

let CryptoUtils = require('./CryptoUtils.js');

exports.findGatewayControllerIpv4Address = function() {
    // verify that crypto is available; if not, return an error
    if (!CryptoUtils.verifyCrypto()) {
        console.log('CRITICAL ERROR: crypto not available.');
        return;
    }

    let thisObject = this;

    return new Promise(function(resolve, reject) {
        let gatewayFound = false;

        thisObject.commandSequenceNumber = CryptoUtils.crypto.randomBytes(1)[0];
        thisObject.findGatewaySequenceNumber = thisObject.commandSequenceNumber;

        let message = new Buffer([0x23, 0x02, 0x00, 0x40, thisObject.findGatewaySequenceNumber, 0x00, 0x00, 0x52, 0x03, thisObject.findGatewaySequenceNumber, 0xf0, 0x00]);
        let port = 4123;
        let address = "255.255.255.255";

        let socket = dgram.createSocket('udp4', onMessage);
        socket.unref(); // do not let this socket's reference block node.js from exiting

        function onMessage(msg, rinfo) {
            // if the message starts with the bytes "0x23, 0x02" (i.e. a Z/IP packet) then accept this as our gateway
            // TODO: consider checking the sequence number in this packet, to make sure it matches the packet we sent
            if (msg.length >= 15 && msg[0] === 0x23 && msg[1] === 0x02 && msg[14] === thisObject.findGatewaySequenceNumber && rinfo.family === "IPv4") {
                gatewayFound = true;
                resolve(rinfo.address);
            }
        }

        function delay(millisecondsToDelay) {
            return new Promise(function(resolve, reject) {
                setTimeout(resolve, millisecondsToDelay);
            });
        }

        function promiseWhile(conditionFunction, whileBodyFunction) {
            return new Promise(function(resolve, reject) {
                function whileLoop() {
                    Promise.resolve(conditionFunction()).then(function(result) {
                        // if the condition is true, loop again
                        if (result) {
                            Promise.resolve(whileBodyFunction()).then(whileLoop, reject);
                        } else {
                            resolve();
                        }
                    });
                }

                // run our promise-while loop
                whileLoop();
            });
        }

        // send the request via the broadcast adapter
        socket.send(message, 0, message.length, port, address);

        return delay(0).then(function() {
            // find our network interfaces' local, public, non-loopback ipv4 addresses
            let networkInterfaces = require('os').networkInterfaces();
            let ipv4NetworkInterfaceAddresses = [];
            //
            // iterate over all interfaces to find an ipv4 address
            Object.keys(networkInterfaces).forEach(function (interfaceName) {
                // iterate over all IP addresses for this interface
                networkInterfaces[interfaceName].forEach(function (ipAddressInfo) {
                    // if this is an IPv4 address, and if it is not a non-loopback address, add it to our list of IPv4 network interface addresses
                    if (ipAddressInfo.family === "IPv4" && ipAddressInfo.address != "127.0.0.1" && ipAddressInfo.internal === false) {
                        ipv4NetworkInterfaceAddresses.push({'ipv4Address': ipAddressInfo.address, 'netmask': ipAddressInfo.netmask});
                    }
                });
            });

            // send the request via each subnet address on our public subnets
            for (let iAddress = 0; iAddress < ipv4NetworkInterfaceAddresses.length; iAddress++) {
                // parse the IPv4 address
                let ipv4AddressComponents = ipv4NetworkInterfaceAddresses[iAddress].ipv4Address.split(".");
                let netmaskComponents = ipv4NetworkInterfaceAddresses[iAddress].netmask.split(".");
                // calculate the netmask number of bits
                let netmaskBits = 0;
                for (let iNetmaskByte = 0; iNetmaskByte < netmaskComponents.length; iNetmaskByte++) {
                    for (let iNetmaskBit = 7; iNetmaskBit >=0; iNetmaskBit--) {
                    if (netmaskComponents[iNetmaskByte] & (1 << iNetmaskBit) !== 0) {
                            netmaskBits++;
                        }
                    }
                }
                // calculate number of ip addresses that we need to test
                ipv4NetworkInterfaceAddresses[iAddress].subnetAddressCountMinusOne = (1 << (32 - netmaskBits)) - 1;
            }

            return ipv4NetworkInterfaceAddresses;
        })
        .then(function(ipv4NetworkInterfaceAddresses) {
            let iNetworkInterfaceAddress = 0;
            let iSubnetAddress = 0;

            if (ipv4NetworkInterfaceAddresses.length === 0) {
                // no network interfaces
                throw Error;
            }

            if (iSubnetAddress === 0)
            {
                // start of new network interface
                //
                // set a reasonable maximum for subnet addresses (1023 entries is around 10 seconds of searching, with 10ms delay between transmission).
                let MAX_SUBNET_ADDRESS_COUNT = 1023;
                if (ipv4NetworkInterfaceAddresses[iNetworkInterfaceAddress].subnetAddressCountMinusOne > MAX_SUBNET_ADDRESS_COUNT) {
                    ipv4NetworkInterfaceAddresses[iNetworkInterfaceAddress].subnetAddressCountMinusOne = MAX_SUBNET_ADDRESS_COUNT;
                }

                return promiseWhile(function() { return iNetworkInterfaceAddress < ipv4NetworkInterfaceAddresses.length && gatewayFound === false; }, function() {
                    return new Promise(function(resolve, reject) {
                        iSubnetAddress++;
                        if (iSubnetAddress > ipv4NetworkInterfaceAddresses[iNetworkInterfaceAddress].subnetAddressCountMinusOne) {
                            // if we have reached the end of this subnet, skip to the next network interface address
                            iNetworkInterfaceAddress++;
                            iSubnetAddress = 0;
                            resolve();
                            return;
                        }

                        // otherwise, send a message to the current subnet address (by index, masked against the subnet and added to our own network interface address)
                        //
                        // parse the IPv4 address
                        let ipv4AddressComponents = ipv4NetworkInterfaceAddresses[iNetworkInterfaceAddress].ipv4Address.split(".");
                        let netmaskComponents = ipv4NetworkInterfaceAddresses[iNetworkInterfaceAddress].netmask.split(".");
                        //
                        // assemble current address
                        let currentAddressBytes = [((iSubnetAddress >> 24) & 0xff), ((iSubnetAddress >> 16) & 0xff), ((iSubnetAddress >> 8) & 0xff), ((iSubnetAddress >> 0) & 0xff)];
                        let currentAddress = ((ipv4AddressComponents[0] & netmaskComponents[0]) | currentAddressBytes[0]).toString() + "." + 
                            ((ipv4AddressComponents[1] & netmaskComponents[1]) | currentAddressBytes[1]).toString() + "." + 
                            ((ipv4AddressComponents[2] & netmaskComponents[2]) | currentAddressBytes[2]).toString() + "." + 
                            ((ipv4AddressComponents[3] & netmaskComponents[3]) | currentAddressBytes[3]).toString();
                        //
                        socket.send(message, 0, message.length, port, currentAddress);

                        // wait 10ms before sending next unicast message
                        setTimeout(resolve, 10);
                    });
                })
            }
        })
        .then(function() {
            // wait 1 second for final messages to be returned under any circumstance
            return delay(1000);
        })
        .then(function() {
            // if we haven't recieved a response by now, return an error
            if (!gatewayFound) {
                reject(Error);
            }
        });
    });
}

module.exports.requestNodeListFromGatewayController = function(ipAddress, pskIdentity, pskPassword) {
    // verify that crypto is available; if not, return an error
    if (!CryptoUtils.verifyCrypto()) {
        console.log('CRITICAL ERROR: crypto not available.');
        return;
    }

    let thisObject = this;

    return new Promise(function(resolve, reject) {
        /*** initialize connection to the Z/IP gateway ***/

        thisObject.commandSequenceNumber = CryptoUtils.crypto.randomBytes(1)[0];

        /*** prepare connection to Z-Wave gateway */
        let zwaveDeviceConnection = ZWaveIP.connectToZWaveDevice(ipAddress, pskIdentity, pskPassword);
        zwaveDeviceConnection.unref(); // do not let this connection's socket reference block node.js from exiting
        // console.log(" CONNECT: Initialized Z/IP gateway controller at IP address: " + ipAddress + "\n");

        let nodeInfoAndIpAddressList = [];

        /*** Request node list mask from Z/IP gateway ***/
        // console.log(" REQUEST: Requesting list of Z-Wave nodes from gateway.");
        zwaveDeviceConnection.sendMessageAndWaitForResponse(
            ZWaveIP.CommandClass.NetworkManagementProxy, ZWaveIP.NetworkManagementProxyCommand.NodeListGet, [thisObject.commandSequenceNumber], 
            ZWaveIP.NetworkManagementProxyCommand.NodeListReport, thisObject.commandSequenceNumber)
        .then(
            function(data) {
                // success
                let status = data.data[1];
                let nodeListControllerId = data.data[2];
                // build our list of nodeIds
                let nodeList = [];
                for (let iMaskByte = 0; iMaskByte < 29; iMaskByte++)
                {
                    for (let iMaskBit = 0; iMaskBit < 8; iMaskBit++)
                    {
                        if ((data.data[3 + iMaskByte] & (1 << iMaskBit)) != 0) {
                            nodeList.push((iMaskByte * 8) + iMaskBit + 1);
                        }
                    }
                }

                // console.log("RESPONSE: Received list of " + nodeList.length + " Z-Wave node" + (nodeList.length > 1 ? "s" : "") + " from gateway: " + JSON.stringify(nodeList) + "\n");

                // define a function which will get the nodeinfo for each node
                function getNodeInfo(nodeIds) {
                    return nodeIds.reduce(function(promise, nodeId) {
                        let basicDeviceClass = null;
                        let genericDeviceClass = null;
                        let specificDeviceClass = null;
                        
                        return promise.then(function() {
                            thisObject.commandSequenceNumber = (thisObject.commandSequenceNumber + 1) % 256;
                            // console.log(" REQUEST: Requesting NODEINFO for node id: " + nodeId);
                            return zwaveDeviceConnection.sendMessageAndWaitForResponse(
                                ZWaveIP.CommandClass.NetworkManagementProxy, ZWaveIP.NetworkManagementProxyCommand.NodeInfoCachedGet, 
                                [thisObject.commandSequenceNumber, 15 /* no cache refresh */, nodeId], 
                                ZWaveIP.NetworkManagementProxyCommand.NodeInfoCachedReport, thisObject.commandSequenceNumber);
                        })
                        .then(
                            function(response) {
                                basicDeviceClass = response.data[5];
                                genericDeviceClass = response.data[6];
                                specificDeviceClass = response.data[7];
                                // console.log("RESPONSE: Received NODEINFO for node id: " + nodeId + " [basic: " + basicDeviceClass + "; generic: " + genericDeviceClass + 
                                //     "; specific: " + specificDeviceClass + "]");

                                // console.log("...");

                                // get ip address for node
                                thisObject.commandSequenceNumber = (thisObject.commandSequenceNumber + 1) % 256;
                                // console.log(" REQUEST: Looking up IP address for node id: " + nodeId);
                                return zwaveDeviceConnection.getIpAddressForNodeId(nodeId);
                            } // ,
                            // function(err) {
                                // console.log("**ERROR** FAILURE RETRIEVING NODEINFO FOR NODE ID: " + nodeId + "\n");
                            // }
                        )
                        .then(
                            function(ipAddressDetails) {
                                nodeInfoAndIpAddressList.push({
                                    nodeId: nodeId,
                                    basicDeviceClass: basicDeviceClass,
                                    genericDeviceClass: genericDeviceClass,
                                    specificDeviceClass: specificDeviceClass,
                                    ipv4Address: ipAddressDetails.ipv4Address,
                                    ipv6Address: ipAddressDetails.ipv6Address,
                                    homeId: ipAddressDetails.homeId
                                });

                                if (ipAddressDetails.ipv4Address != null) {
                                    // console.log("RESPONSE: Received IPv4 address for device: " + ipAddressDetails.ipv4Address + " (IPv4-mapped IPv6 address: " + ipAddressDetails.ipv6Address + ")");
                                }
                                else {
                                    // console.log("RESPONSE: Received IPv6 address for device: " + ipAddressDetails.ipv6Address);
                                }
                                // console.log("          [home id: " + ipAddressDetails.homeId[0].toString(16) + ipAddressDetails.homeId[1].toString(16) + ipAddressDetails.homeId[2].toString(16) + ipAddressDetails.homeId[3].toString(16) + "]\n");
                            },
                            function(err) {
                                // console.log("**ERROR* FAILURE RETRIEVING IP ADDRESS FOR NODE ID: " + nodeId + "\n");
                            }
                        );                    
                    }, Promise.resolve());
                }

                // get the node info for all of our nodeIds 
                getNodeInfo(nodeList)
                .then(
                    function() { // success
                        // console.log("COMPLETE: Request is complete.");
                        resolve(nodeInfoAndIpAddressList);
                    },
                    function(err) { // failure
                        reject(err);
                    }
                );
            },
            function(err) {
                // console.log("**ERROR** FAILURE RETRIEVING LIST OF Z-WAVE DEVICES.");
                reject(err);
            }
        );
    });
}

function isIpv6Address(ipAddress) {
    return (ipAddress.indexOf(":") >= 0);
}
