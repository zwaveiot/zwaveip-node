# zwaveip-node
A Z-Wave IP implementation for Node.js. Unofficial library, not supported by Sigma Designs.  

This library enables node.js application to communicate with Z-Wave devices via a Z/IP (Z-Wave IP) Gateway.  

#### To install the library
> npm install zwaveip  

#### To import the library
> let ZWaveIP = require('zwaveip');  

#### To convert the Z-Wave network's PSK (Pre-Shared Key) password from a hex string to the required binary representation
> let convertHexStringToBinaryPsk = function(hexString) {  
> &nbsp;&nbsp;&nbsp;&nbsp;let result = Buffer.alloc(hexString.length / 2);  
>  
> &nbsp;&nbsp;&nbsp;&nbsp;for (let i = 0; i < hexString.length; i += 2) {  
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;result[i / 2] = parseInt("0x" + hexString.substr(i, 2), 16);  
> &nbsp;&nbsp;&nbsp;&nbsp;}  
>  
> &nbsp;&nbsp;&nbsp;&nbsp;return result;  
> }  

#### To connect to a Z-Wave device
> let deviceConnection = ZWaveIP.connectToZWaveDevice(ipAddress, pskIdentity, pskPassword);  

#### To send a message to the connected Z-Wave device (example)
> deviceConnection.sendMessage(ZWaveIP.CommandClass.SwitchBinary, ZWaveIP.SwitchBinaryCommand.Set, [0xFF]);  

#### To send a message and then wait for an acknowledgment using Promises (example)
> deviceConnection.sendMessage(ZWaveIP.CommandClass.SwitchBinary, ZWaveIP.SwitchBinaryCommand.Set, [0xFF])  
> .then(  
> &nbsp;&nbsp;&nbsp;&nbsp;function() {  
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log('Message acknowledged.');  
> &nbsp;&nbsp;&nbsp;&nbsp;},  
> &nbsp;&nbsp;&nbsp;&nbsp;function(err) {  
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log('Message failure: ' + JSON.stringify(err));  
> &nbsp;&nbsp;&nbsp;&nbsp;}  
> );  

#### To request device status from the connected Z-Wave device (example)
> deviceConnection.sendMessageAndWaitForResponse(ZWaveIP.CommandClass.SwitchBinary, ZWaveIP.SwitchBinaryCommand.Get, [], ZWaveIP.SwitchBinaryCommand.Report)  
> .then(  
> &nbsp;&nbsp;&nbsp;&nbsp;function(response) {  
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;let powerStateAsByte = response.data[0];  
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;let powerStateAsBoolean = (powerStateAsByte != 0);  
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log("powerState: " + powerStateAsBoolean + " (" + powerStateAsByte + ")");  
> &nbsp;&nbsp;&nbsp;&nbsp;},  
> &nbsp;&nbsp;&nbsp;&nbsp;function(err) {  
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log('Message failure: ' + JSON.stringify(err));  
> &nbsp;&nbsp;&nbsp;&nbsp;}  
> );  

#### To close a Z-Wave device connection
> deviceConnection.close(callback);  

#### To prevent a Z-Wave device connection from blocking the Node.JS process from exiting (identical to udp socket functionality)
> deviceConnection.unref();  

#### To discover the virtual IPv4 address of a Z-Wave Gateway Controller on your local network
> ZWaveIP.findGatewayControllerIpv4Address()  
> .then(  
> &nbsp;&nbsp;&nbsp;&nbsp;function(ipv4Address) {  
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log(" FOUND: Z/IP Gateway controller IPv4 address is: " + ipv4Address + "\n");  
> &nbsp;&nbsp;&nbsp;&nbsp;},  
> &nbsp;&nbsp;&nbsp;&nbsp;function(err) {  
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log('Could not discover the Z-Wave Gateway Controller's virtual IPv4 address: ' + JSON.stringify(err));  
> &nbsp;&nbsp;&nbsp;&nbsp;}  
> );  

#### To discover all Z-Wave devices in your Z-Wave network
> ZWaveIP.requestNodeListFromGatewayController(gatewayIpAddress, pskIdentity, pskPassword)  
> .then(  
> &nbsp;&nbsp;&nbsp;&nbsp;function(nodeList) {  
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;let ipAddress = nodeList[index].ipv4Address === null ? nodeList[index].ipv6Address : nodeList[index].ipv4Address;  
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log('Z-Wave Node # ' + nodeList[index].nodeId + ' (' + ipAddress + ')');  
> &nbsp;&nbsp;&nbsp;&nbsp;},  
> &nbsp;&nbsp;&nbsp;&nbsp;function(err) {  
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log('Could not request node lsit from the specified Z-Wave Gateway Controller: ' + JSON.stringify(err));  
> &nbsp;&nbsp;&nbsp;&nbsp;}  
> );  

#### Documentation on Z-Wave command classes and Z-Wave commands  
###### For full documentation, see: http://zwavepublic.com/downloads  
###### For JavaScript enumerations, see the 'index.js' within this package's folder  
