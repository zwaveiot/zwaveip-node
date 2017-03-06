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

/*** Z-WAVE DEVICE FUNCTIONS ***/

exports.connectToZWaveDevice = function(ipAddress, pskIdentity, pskPassword) {
    return require('./ZWaveDeviceConnection.js').create(ipAddress, pskIdentity, pskPassword);
}

/*** Z/IP GATEWAY UTILITY FUNCTIONS ***/

exports.findGatewayControllerIpv4Address = function() {
    return require('./ZipGatewayUtils.js').findGatewayControllerIpv4Address();
}

exports.requestNodeListFromGatewayController = function(ipAddress, pskIdentity, pskPassword) {
    return require('./ZipGatewayUtils').requestNodeListFromGatewayController(ipAddress, pskIdentity, pskPassword);
}

/*** Z-WAVE COMMAND CLASS ENUMERATIONS ***/

/* Z-Wave command classes */
let CommandClass = Object.freeze({
    Alarm: 0x71,
    Antitheft: 0x5d,
    ApplicationCapability: 0x57,
    ApplicationStatus: 0x22,
    Association: 0x85,
    AssociationCommandConfiguration: 0x9b,
    AssociationGrpInfo: 0x59,
    AvContentDirectoryMd: 0x95,
    AvContentSearchMd: 0x97,
    AvRendererStatus: 0x96,
    AvTaggingMd: 0x99,
    BarrierOperator: 0x66,
    Basic: 0x20,
    BasicTariffInfo: 0x36,
    BasicWindowCovering: 0x50,
    Battery: 0x80,
    CentralScene: 0x5b,
    ChimneyFan: 0x2a,
    ClimateControlSchedule: 0x46,
    Clock: 0x81,
    Configuration: 0x70,
    ControllerReplication: 0x21,
    Crc16Encap: 0x56,
    DcpConfig: 0x3a,
    DcpMonitor: 0x3b,
    DeviceResetLocally: 0x5a,
    Dmx: 0x65,
    DoorLock: 0x62,
    DoorLockLogging: 0x4c,
    EnergyProduction: 0x90,
    EntryControl: 0x6f,
    FirmwareUpdateMd: 0x7a,
    GeographicLocation: 0x8c,
    GroupingName: 0x7b,
    Hail: 0x82,
    HrvControl: 0x39,
    HrvStatus: 0x37,
    HumidityControlMode: 0x6d,
    HumidityControlOperatingState: 0x6e,
    HumidityControlSetpoint: 0x64,
    InclusionController: 0x74,
    Indicator: 0x87,
    IpAssociation: 0x5c,
    IpConfiguration: 0x9a,
    Irrigation: 0x6b,
    Language: 0x89,
    Lock: 0x76,
    Mailbox: 0x69,
    ManufacturerProprietary: 0x91,
    ManufacturerSpecific: 0x72,
    Mark: 0xef,
    Meter: 0x32,
    MeterPulse: 0x35,
    MeterTblConfig: 0x3c,
    MeterTblMonitor: 0x3d,
    MeterTblPush: 0x3e,
    MtpWindowCovering: 0x51,
    MultiChannel: 0x60,
    MultiChannelAssociation: 0x8e,
    MultiCmd: 0x8f,
    MultiInstance: 0x60,
    MultiInstanceAssociation: 0x8e,
    NetworkManagementBasic: 0x4d,
    NetworkManagementInclusion: 0x34,
    NetworkManagementInstallationMaintenance: 0x67,
    NetworkManagementPrimary: 0x54,
    NetworkManagementProxy: 0x52,
    NodeNaming: 0x77,
    NonInteroperable: 0xf0,
    NoOperation: 0x00,
    Notification: 0x71,
    Powerlevel: 0x73,
    Prepayment: 0x3f,
    PrepaymentEncapsulation: 0x41,
    Proprietary: 0x88,
    Protection: 0x75,
    RateTblConfig: 0x48,
    RateTblMonitor: 0x49,
    RemoteAssociation: 0x7d,
    RemoteAssociationActivate: 0x7c,
    SceneActivation: 0x2b,
    SceneActuatorConf: 0x2c,
    SceneControllerConf: 0x2d,
    Schedule: 0x53,
    ScheduleEntryLock: 0x4e,
    ScreenAttributes: 0x93,
    ScreenMd: 0x92,
    Security: 0x98,
    Security2: 0x9f,
    SecurityPanelMode: 0x24,
    SecurityPanelZone: 0x2e,
    SecurityPanelZoneSensor: 0x2f,
    SensorAlarm: 0x9c,
    SensorBinary: 0x30,
    SensorConfiguration: 0x9e,
    SensorMultilevel: 0x31,
    SilenceAlarm: 0x9d,
    SimpleAvControl: 0x94,
    Supervision: 0x6c,
    SwitchAll: 0x27,
    SwitchBinary: 0x25,
    SwitchColor: 0x33,
    SwitchMultilevel: 0x26,
    SwitchToggleBinary: 0x28,
    SwitchToggleMultilevel: 0x29,
    TariffConfig: 0x4a,
    TariffTblMonitor: 0x4b,
    ThermostatFanMode: 0x44,
    ThermostatFanState: 0x45,
    ThermostatHeating: 0x38,
    ThermostatMode: 0x40,
    ThermostatOperatingState: 0x42,
    ThermostatSetback: 0x47,
    ThermostatSetpoint: 0x43,
    Time: 0x8a,
    TimeParameters: 0x8b,
    TransportService: 0x55,
    UserCode: 0x63,
    Version: 0x86,
    WakeUp: 0x84,
    WindowCovering: 0x6a,
    ZensorNet: 0x02,
    Zip: 0x23,
    Zip6lowpan: 0x4f,
    ZipGateway: 0x5f,
    ZipNaming: 0x68,
    ZipNd: 0x58,
    ZipPortal: 0x61,
    ZwaveplusInfo: 0x5e,
    properties: {
        0x71: {name: "Alarm"},
        0x5d: {name: "Antitheft"},
        0x57: {name: "ApplicationCapability"},
        0x22: {name: "ApplicationStatus"},
        0x85: {name: "Association"},
        0x9b: {name: "AssociationCommandConfiguration"},
        0x59: {name: "AssociationGrpInfo"},
        0x95: {name: "AvContentDirectoryMd"},
        0x97: {name: "AvContentSearchMd"},
        0x96: {name: "AvRendererStatus"},
        0x99: {name: "AvTaggingMd"},
        0x66: {name: "BarrierOperator"},
        0x20: {name: "Basic"},
        0x36: {name: "BasicTariffInfo"},
        0x50: {name: "BasicWindowCovering"},
        0x80: {name: "Battery"},
        0x5b: {name: "CentralScene"},
        0x2a: {name: "ChimneyFan"},
        0x46: {name: "ClimateControlSchedule"},
        0x81: {name: "Clock"},
        0x70: {name: "Configuration"},
        0x21: {name: "ControllerReplication"},
        0x56: {name: "Crc16Encap"},
        0x3a: {name: "DcpConfig"},
        0x3b: {name: "DcpMonitor"},
        0x5a: {name: "DeviceResetLocally"},
        0x65: {name: "Dmx"},
        0x62: {name: "DoorLock"},
        0x4c: {name: "DoorLockLogging"},
        0x90: {name: "EnergyProduction"},
        0x6f: {name: "EntryControl"},
        0x7a: {name: "FirmwareUpdateMd"},
        0x8c: {name: "GeographicLocation"},
        0x7b: {name: "GroupingName"},
        0x82: {name: "Hail"},
        0x39: {name: "HrvControl"},
        0x37: {name: "HrvStatus"},
        0x6d: {name: "HumidityControlMode"},
        0x6e: {name: "HumidityControlOperatingState"},
        0x64: {name: "HumidityControlSetpoint"},
        0x74: {name: "InclusionController"},
        0x87: {name: "Indicator"},
        0x5c: {name: "IpAssociation"},
        0x9a: {name: "IpConfiguration"},
        0x6b: {name: "Irrigation"},
        0x89: {name: "Language"},
        0x76: {name: "Lock"},
        0x69: {name: "Mailbox"},
        0x91: {name: "ManufacturerProprietary"},
        0x72: {name: "ManufacturerSpecific"},
        0xef: {name: "Mark"},
        0x32: {name: "Meter"},
        0x35: {name: "MeterPulse"},
        0x3c: {name: "MeterTblConfig"},
        0x3d: {name: "MeterTblMonitor"},
        0x3e: {name: "MeterTblPush"},
        0x51: {name: "MtpWindowCovering"},
        0x60: {name: "MultiChannel"},
        0x8e: {name: "MultiChannelAssociation"},
        0x8f: {name: "MultiCmd"},
        0x60: {name: "MultiInstance"},
        0x8e: {name: "MultiInstanceAssociation"},
        0x4d: {name: "NetworkManagementBasic"},
        0x34: {name: "NetworkManagementInclusion"},
        0x67: {name: "NetworkManagementInstallationMaintenance"},
        0x54: {name: "NetworkManagementPrimary"},
        0x52: {name: "NetworkManagementProxy"},
        0x77: {name: "NodeNaming"},
        0xf0: {name: "NonInteroperable"},
        0x00: {name: "NoOperation"},
        0x71: {name: "Notification"},
        0x73: {name: "Powerlevel"},
        0x3f: {name: "Prepayment"},
        0x41: {name: "PrepaymentEncapsulation"},
        0x88: {name: "Proprietary"},
        0x75: {name: "Protection"},
        0x48: {name: "RateTblConfig"},
        0x49: {name: "RateTblMonitor"},
        0x7d: {name: "RemoteAssociation"},
        0x7c: {name: "RemoteAssociationActivate"},
        0x2b: {name: "SceneActivation"},
        0x2c: {name: "SceneActuatorConf"},
        0x2d: {name: "SceneControllerConf"},
        0x53: {name: "Schedule"},
        0x4e: {name: "ScheduleEntryLock"},
        0x93: {name: "ScreenAttributes"},
        0x92: {name: "ScreenMd"},
        0x98: {name: "Security"},
        0x9f: {name: "Security2"},
        0x24: {name: "SecurityPanelMode"},
        0x2e: {name: "SecurityPanelZone"},
        0x2f: {name: "SecurityPanelZoneSensor"},
        0x9c: {name: "SensorAlarm"},
        0x30: {name: "SensorBinary"},
        0x9e: {name: "SensorConfiguration"},
        0x31: {name: "SensorMultilevel"},
        0x9d: {name: "SilenceAlarm"},
        0x94: {name: "SimpleAvControl"},
        0x6c: {name: "Supervision"},
        0x27: {name: "SwitchAll"},
        0x25: {name: "SwitchBinary"},
        0x33: {name: "SwitchColor"},
        0x26: {name: "SwitchMultilevel"},
        0x28: {name: "SwitchToggleBinary"},
        0x29: {name: "SwitchToggleMultilevel"},
        0x4a: {name: "TariffConfig"},
        0x4b: {name: "TariffTblMonitor"},
        0x44: {name: "ThermostatFanMode"},
        0x45: {name: "ThermostatFanState"},
        0x38: {name: "ThermostatHeating"},
        0x40: {name: "ThermostatMode"},
        0x42: {name: "ThermostatOperatingState"},
        0x47: {name: "ThermostatSetback"},
        0x43: {name: "ThermostatSetpoint"},
        0x8a: {name: "Time"},
        0x8b: {name: "TimeParameters"},
        0x55: {name: "TransportService"},
        0x63: {name: "UserCode"},
        0x86: {name: "Version"},
        0x84: {name: "WakeUp"},
        0x6a: {name: "WindowCovering"},
        0x02: {name: "ZensorNet"},
        0x23: {name: "Zip"},
        0x4f: {name: "Zip6lowpan"},
        0x5f: {name: "ZipGateway"},
        0x68: {name: "ZipNaming"},
        0x58: {name: "ZipNd"},
        0x61: {name: "ZipPortal"},
        0x5e: {name: "ZwaveplusInfo"},
    }
});
exports.CommandClass = CommandClass;
let isCommandClassValid = function(commandClass) {
    return (this.CommandClass.properties[commandClass] !== undefined);
}

/* Alarm commands (version 2) */
let AlarmCommand = Object.freeze({
    Get: 0x04,
    Report: 0x05,
    Set: 0x06,
    TypeSupportedGet: 0x07,
    TypeSupportedReport: 0x08,
    properties: {
        0x04: {name: "Get"},
        0x05: {name: "Report"},
        0x06: {name: "Set"},
        0x07: {name: "TypeSupportedGet"},
        0x08: {name: "TypeSupportedReport"},
    }
});
exports.AlarmCommand = AlarmCommand;
let isAlarmCommandValid = function(command) {
    return (this.AlarmCommand.properties[command] !== undefined);
}

/* Antitheft commands (version 2) */
let AntitheftCommand = Object.freeze({
    Set: 0x01,
    Get: 0x02,
    Report: 0x03,
    properties: {
        0x01: {name: "Set"},
        0x02: {name: "Get"},
        0x03: {name: "Report"},
    }
});
exports.AntitheftCommand = AntitheftCommand;
let isAntitheftCommandValid = function(command) {
    return (this.AntitheftCommand.properties[command] !== undefined);
}

/* ApplicationCapability commands (version 1) */
let ApplicationCapabilityCommand = Object.freeze({
    CommandCommandClassNotSupported: 0x01,
    properties: {
        0x01: {name: "CommandCommandClassNotSupported"},
    }
});
exports.ApplicationCapabilityCommand = ApplicationCapabilityCommand;
let isApplicationCapabilityCommandValid = function(command) {
    return (this.ApplicationCapabilityCommand.properties[command] !== undefined);
}

/* ApplicationStatus commands (version 1) */
let ApplicationStatusCommand = Object.freeze({
    ApplicationBusy: 0x01,
    ApplicationRejectedRequest: 0x02,
    properties: {
        0x01: {name: "ApplicationBusy"},
        0x02: {name: "ApplicationRejectedRequest"},
    }
});
exports.ApplicationStatusCommand = ApplicationStatusCommand;
let isApplicationStatusCommandValid = function(command) {
    return (this.ApplicationStatusCommand.properties[command] !== undefined);
}

/* Association commands (version 2) */
let AssociationCommand = Object.freeze({
    Get: 0x02,
    GroupingsGet: 0x05,
    GroupingsReport: 0x06,
    Remove: 0x04,
    Report: 0x03,
    Set: 0x01,
    SpecificGroupGet: 0x0b,
    SpecificGroupReport: 0x0c,
    properties: {
        0x02: {name: "Get"},
        0x05: {name: "GroupingsGet"},
        0x06: {name: "GroupingsReport"},
        0x04: {name: "Remove"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
        0x0b: {name: "SpecificGroupGet"},
        0x0c: {name: "SpecificGroupReport"},
    }
});
exports.AssociationCommand = AssociationCommand;
let isAssociationCommandValid = function(command) {
    return (this.AssociationCommand.properties[command] !== undefined);
}

/* AssociationCommandConfiguration commands (version 1) */
let AssociationCommandConfigurationCommand = Object.freeze({
    CommandConfigurationGet: 0x04,
    CommandConfigurationReport: 0x05,
    CommandConfigurationSet: 0x03,
    CommandRecordsSupportedGet: 0x01,
    CommandRecordsSupportedReport: 0x02,
    properties: {
        0x04: {name: "CommandConfigurationGet"},
        0x05: {name: "CommandConfigurationReport"},
        0x03: {name: "CommandConfigurationSet"},
        0x01: {name: "CommandRecordsSupportedGet"},
        0x02: {name: "CommandRecordsSupportedReport"},
    }
});
exports.AssociationCommandConfigurationCommand = AssociationCommandConfigurationCommand;
let isAssociationCommandConfigurationCommandValid = function(command) {
    return (this.AssociationCommandConfigurationCommand.properties[command] !== undefined);
}

/* AssociationGrpInfo commands (version 3) */
let AssociationGrpInfoCommand = Object.freeze({
    AssociationGroupNameGet: 0x01,
    AssociationGroupNameReport: 0x02,
    AssociationGroupInfoGet: 0x03,
    AssociationGroupInfoReport: 0x04,
    AssociationGroupCommandListGet: 0x05,
    AssociationGroupCommandListReport: 0x06,
    properties: {
        0x01: {name: "AssociationGroupNameGet"},
        0x02: {name: "AssociationGroupNameReport"},
        0x03: {name: "AssociationGroupInfoGet"},
        0x04: {name: "AssociationGroupInfoReport"},
        0x05: {name: "AssociationGroupCommandListGet"},
        0x06: {name: "AssociationGroupCommandListReport"},
    }
});
exports.AssociationGrpInfoCommand = AssociationGrpInfoCommand;
let isAssociationGrpInfoCommandValid = function(command) {
    return (this.AssociationGrpInfoCommand.properties[command] !== undefined);
}

/* AvContentDirectoryMd commands (version 1) */
let AvContentDirectoryMdCommand = Object.freeze({
    AvContentBrowseMdByLetterGet: 0x03,
    AvContentBrowseMdByLetterReport: 0x04,
    AvContentBrowseMdChildCountGet: 0x05,
    AvContentBrowseMdChildCountReport: 0x06,
    AvContentBrowseMdGet: 0x01,
    AvContentBrowseMdReport: 0x02,
    AvMatchItemToRendererMdGet: 0x07,
    AvMatchItemToRendererMdReport: 0x08,
    properties: {
        0x03: {name: "AvContentBrowseMdByLetterGet"},
        0x04: {name: "AvContentBrowseMdByLetterReport"},
        0x05: {name: "AvContentBrowseMdChildCountGet"},
        0x06: {name: "AvContentBrowseMdChildCountReport"},
        0x01: {name: "AvContentBrowseMdGet"},
        0x02: {name: "AvContentBrowseMdReport"},
        0x07: {name: "AvMatchItemToRendererMdGet"},
        0x08: {name: "AvMatchItemToRendererMdReport"},
    }
});
exports.AvContentDirectoryMdCommand = AvContentDirectoryMdCommand;
let isAvContentDirectoryMdCommandValid = function(command) {
    return (this.AvContentDirectoryMdCommand.properties[command] !== undefined);
}

/* AvContentSearchMd commands (version 1) */
let AvContentSearchMdCommand = Object.freeze({
    Get: 0x01,
    Report: 0x02,
    properties: {
        0x01: {name: "Get"},
        0x02: {name: "Report"},
    }
});
exports.AvContentSearchMdCommand = AvContentSearchMdCommand;
let isAvContentSearchMdCommandValid = function(command) {
    return (this.AvContentSearchMdCommand.properties[command] !== undefined);
}

/* AvRendererStatus commands (version 1) */
let AvRendererStatusCommand = Object.freeze({
    Get: 0x01,
    Report: 0x02,
    properties: {
        0x01: {name: "Get"},
        0x02: {name: "Report"},
    }
});
exports.AvRendererStatusCommand = AvRendererStatusCommand;
let isAvRendererStatusCommandValid = function(command) {
    return (this.AvRendererStatusCommand.properties[command] !== undefined);
}

/* AvTaggingMd commands (version 1) */
let AvTaggingMdCommand = Object.freeze({
    Get: 0x01,
    Report: 0x02,
    properties: {
        0x01: {name: "Get"},
        0x02: {name: "Report"},
    }
});
exports.AvTaggingMdCommand = AvTaggingMdCommand;
let isAvTaggingMdCommandValid = function(command) {
    return (this.AvTaggingMdCommand.properties[command] !== undefined);
}

/* BarrierOperator commands (version 1) */
let BarrierOperatorCommand = Object.freeze({
    Set: 0x01,
    Get: 0x02,
    Report: 0x03,
    SignalSupportedGet: 0x04,
    SignalSupportedReport: 0x05,
    SignalSet: 0x06,
    SignalGet: 0x07,
    SignalReport: 0x08,
    properties: {
        0x01: {name: "Set"},
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x04: {name: "SignalSupportedGet"},
        0x05: {name: "SignalSupportedReport"},
        0x06: {name: "SignalSet"},
        0x07: {name: "SignalGet"},
        0x08: {name: "SignalReport"},
    }
});
exports.BarrierOperatorCommand = BarrierOperatorCommand;
let isBarrierOperatorCommandValid = function(command) {
    return (this.BarrierOperatorCommand.properties[command] !== undefined);
}

/* Basic commands (version 2) */
let BasicCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    Set: 0x01,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
    }
});
exports.BasicCommand = BasicCommand;
let isBasicCommandValid = function(command) {
    return (this.BasicCommand.properties[command] !== undefined);
}

/* BasicTariffInfo commands (version 1) */
let BasicTariffInfoCommand = Object.freeze({
    Get: 0x01,
    Report: 0x02,
    properties: {
        0x01: {name: "Get"},
        0x02: {name: "Report"},
    }
});
exports.BasicTariffInfoCommand = BasicTariffInfoCommand;
let isBasicTariffInfoCommandValid = function(command) {
    return (this.BasicTariffInfoCommand.properties[command] !== undefined);
}

/* BasicWindowCovering commands (version 1) */
let BasicWindowCoveringCommand = Object.freeze({
    StartLevelChange: 0x01,
    StopLevelChange: 0x02,
    properties: {
        0x01: {name: "StartLevelChange"},
        0x02: {name: "StopLevelChange"},
    }
});
exports.BasicWindowCoveringCommand = BasicWindowCoveringCommand;
let isBasicWindowCoveringCommandValid = function(command) {
    return (this.BasicWindowCoveringCommand.properties[command] !== undefined);
}

/* Battery commands (version 1) */
let BatteryCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
    }
});
exports.BatteryCommand = BatteryCommand;
let isBatteryCommandValid = function(command) {
    return (this.BatteryCommand.properties[command] !== undefined);
}

/* CentralScene commands (version 3) */
let CentralSceneCommand = Object.freeze({
    SupportedGet: 0x01,
    SupportedReport: 0x02,
    Notification: 0x03,
    ConfigurationSet: 0x04,
    ConfigurationGet: 0x05,
    ConfigurationReport: 0x06,
    properties: {
        0x01: {name: "SupportedGet"},
        0x02: {name: "SupportedReport"},
        0x03: {name: "Notification"},
        0x04: {name: "ConfigurationSet"},
        0x05: {name: "ConfigurationGet"},
        0x06: {name: "ConfigurationReport"},
    }
});
exports.CentralSceneCommand = CentralSceneCommand;
let isCentralSceneCommandValid = function(command) {
    return (this.CentralSceneCommand.properties[command] !== undefined);
}

/* ChimneyFan commands (version 1) */
let ChimneyFanCommand = Object.freeze({
    AlarmLogGet: 0x20,
    AlarmLogReport: 0x21,
    AlarmLogSet: 0x1f,
    AlarmStatusGet: 0x23,
    AlarmStatusReport: 0x24,
    AlarmStatusSet: 0x22,
    AlarmTempGet: 0x0e,
    AlarmTempReport: 0x0f,
    AlarmTempSet: 0x0d,
    BoostTimeGet: 0x11,
    BoostTimeReport: 0x12,
    BoostTimeSet: 0x10,
    DefaultSet: 0x28,
    MinSpeedGet: 0x26,
    MinSpeedReport: 0x27,
    MinSpeedSet: 0x25,
    ModeGet: 0x17,
    ModeReport: 0x18,
    ModeSet: 0x16,
    SetupGet: 0x1a,
    SetupReport: 0x1b,
    SetupSet: 0x19,
    SpeedGet: 0x05,
    SpeedReport: 0x06,
    SpeedSet: 0x04,
    StartTempGet: 0x08,
    StartTempReport: 0x09,
    StartTempSet: 0x07,
    StateGet: 0x02,
    StateReport: 0x03,
    StateSet: 0x01,
    StatusGet: 0x1d,
    StatusReport: 0x1e,
    StopTempGet: 0x0b,
    StopTempReport: 0x0c,
    StopTempSet: 0x0a,
    StopTimeGet: 0x14,
    StopTimeReport: 0x15,
    StopTimeSet: 0x13,
    properties: {
        0x20: {name: "AlarmLogGet"},
        0x21: {name: "AlarmLogReport"},
        0x1f: {name: "AlarmLogSet"},
        0x23: {name: "AlarmStatusGet"},
        0x24: {name: "AlarmStatusReport"},
        0x22: {name: "AlarmStatusSet"},
        0x0e: {name: "AlarmTempGet"},
        0x0f: {name: "AlarmTempReport"},
        0x0d: {name: "AlarmTempSet"},
        0x11: {name: "BoostTimeGet"},
        0x12: {name: "BoostTimeReport"},
        0x10: {name: "BoostTimeSet"},
        0x28: {name: "DefaultSet"},
        0x26: {name: "MinSpeedGet"},
        0x27: {name: "MinSpeedReport"},
        0x25: {name: "MinSpeedSet"},
        0x17: {name: "ModeGet"},
        0x18: {name: "ModeReport"},
        0x16: {name: "ModeSet"},
        0x1a: {name: "SetupGet"},
        0x1b: {name: "SetupReport"},
        0x19: {name: "SetupSet"},
        0x05: {name: "SpeedGet"},
        0x06: {name: "SpeedReport"},
        0x04: {name: "SpeedSet"},
        0x08: {name: "StartTempGet"},
        0x09: {name: "StartTempReport"},
        0x07: {name: "StartTempSet"},
        0x02: {name: "StateGet"},
        0x03: {name: "StateReport"},
        0x01: {name: "StateSet"},
        0x1d: {name: "StatusGet"},
        0x1e: {name: "StatusReport"},
        0x0b: {name: "StopTempGet"},
        0x0c: {name: "StopTempReport"},
        0x0a: {name: "StopTempSet"},
        0x14: {name: "StopTimeGet"},
        0x15: {name: "StopTimeReport"},
        0x13: {name: "StopTimeSet"},
    }
});
exports.ChimneyFanCommand = ChimneyFanCommand;
let isChimneyFanCommandValid = function(command) {
    return (this.ChimneyFanCommand.properties[command] !== undefined);
}

/* ClimateControlSchedule commands (version 1) */
let ClimateControlScheduleCommand = Object.freeze({
    ScheduleChangedGet: 0x04,
    ScheduleChangedReport: 0x05,
    ScheduleGet: 0x02,
    ScheduleOverrideGet: 0x07,
    ScheduleOverrideReport: 0x08,
    ScheduleOverrideSet: 0x06,
    ScheduleReport: 0x03,
    ScheduleSet: 0x01,
    properties: {
        0x04: {name: "ScheduleChangedGet"},
        0x05: {name: "ScheduleChangedReport"},
        0x02: {name: "ScheduleGet"},
        0x07: {name: "ScheduleOverrideGet"},
        0x08: {name: "ScheduleOverrideReport"},
        0x06: {name: "ScheduleOverrideSet"},
        0x03: {name: "ScheduleReport"},
        0x01: {name: "ScheduleSet"},
    }
});
exports.ClimateControlScheduleCommand = ClimateControlScheduleCommand;
let isClimateControlScheduleCommandValid = function(command) {
    return (this.ClimateControlScheduleCommand.properties[command] !== undefined);
}

/* Clock commands (version 1) */
let ClockCommand = Object.freeze({
    Get: 0x05,
    Report: 0x06,
    Set: 0x04,
    properties: {
        0x05: {name: "Get"},
        0x06: {name: "Report"},
        0x04: {name: "Set"},
    }
});
exports.ClockCommand = ClockCommand;
let isClockCommandValid = function(command) {
    return (this.ClockCommand.properties[command] !== undefined);
}

/* Configuration commands (version 4) */
let ConfigurationCommand = Object.freeze({
    BulkGet: 0x08,
    BulkReport: 0x09,
    BulkSet: 0x07,
    Get: 0x05,
    Report: 0x06,
    Set: 0x04,
    NameGet: 0x0a,
    NameReport: 0x0b,
    InfoGet: 0x0c,
    InfoReport: 0x0d,
    PropertiesGet: 0x0e,
    PropertiesReport: 0x0f,
    DefaultReset: 0x01,
    properties: {
        0x08: {name: "BulkGet"},
        0x09: {name: "BulkReport"},
        0x07: {name: "BulkSet"},
        0x05: {name: "Get"},
        0x06: {name: "Report"},
        0x04: {name: "Set"},
        0x0a: {name: "NameGet"},
        0x0b: {name: "NameReport"},
        0x0c: {name: "InfoGet"},
        0x0d: {name: "InfoReport"},
        0x0e: {name: "PropertiesGet"},
        0x0f: {name: "PropertiesReport"},
        0x01: {name: "DefaultReset"},
    }
});
exports.ConfigurationCommand = ConfigurationCommand;
let isConfigurationCommandValid = function(command) {
    return (this.ConfigurationCommand.properties[command] !== undefined);
}

/* ControllerReplication commands (version 1) */
let ControllerReplicationCommand = Object.freeze({
    CtrlReplicationTransferGroup: 0x31,
    CtrlReplicationTransferGroupName: 0x32,
    CtrlReplicationTransferScene: 0x33,
    CtrlReplicationTransferSceneName: 0x34,
    properties: {
        0x31: {name: "CtrlReplicationTransferGroup"},
        0x32: {name: "CtrlReplicationTransferGroupName"},
        0x33: {name: "CtrlReplicationTransferScene"},
        0x34: {name: "CtrlReplicationTransferSceneName"},
    }
});
exports.ControllerReplicationCommand = ControllerReplicationCommand;
let isControllerReplicationCommandValid = function(command) {
    return (this.ControllerReplicationCommand.properties[command] !== undefined);
}

/* Crc16Encap commands (version 1) */
let Crc16EncapCommand = Object.freeze({
    Crc16Encap: 0x01,
    properties: {
        0x01: {name: "Crc16Encap"},
    }
});
exports.Crc16EncapCommand = Crc16EncapCommand;
let isCrc16EncapCommandValid = function(command) {
    return (this.Crc16EncapCommand.properties[command] !== undefined);
}

/* DcpConfig commands (version 1) */
let DcpConfigCommand = Object.freeze({
    DcpListRemove: 0x04,
    DcpListSet: 0x03,
    DcpListSupportedGet: 0x01,
    DcpListSupportedReport: 0x02,
    properties: {
        0x04: {name: "DcpListRemove"},
        0x03: {name: "DcpListSet"},
        0x01: {name: "DcpListSupportedGet"},
        0x02: {name: "DcpListSupportedReport"},
    }
});
exports.DcpConfigCommand = DcpConfigCommand;
let isDcpConfigCommandValid = function(command) {
    return (this.DcpConfigCommand.properties[command] !== undefined);
}

/* DcpMonitor commands (version 1) */
let DcpMonitorCommand = Object.freeze({
    DcpEventStatusGet: 0x03,
    DcpEventStatusReport: 0x04,
    DcpListGet: 0x01,
    DcpListReport: 0x02,
    properties: {
        0x03: {name: "DcpEventStatusGet"},
        0x04: {name: "DcpEventStatusReport"},
        0x01: {name: "DcpListGet"},
        0x02: {name: "DcpListReport"},
    }
});
exports.DcpMonitorCommand = DcpMonitorCommand;
let isDcpMonitorCommandValid = function(command) {
    return (this.DcpMonitorCommand.properties[command] !== undefined);
}

/* DeviceResetLocally commands (version 1) */
let DeviceResetLocallyCommand = Object.freeze({
    Notification: 0x01,
    properties: {
        0x01: {name: "Notification"},
    }
});
exports.DeviceResetLocallyCommand = DeviceResetLocallyCommand;
let isDeviceResetLocallyCommandValid = function(command) {
    return (this.DeviceResetLocallyCommand.properties[command] !== undefined);
}

/* Dmx commands (version 1) */
let DmxCommand = Object.freeze({
    AddressSet: 0x01,
    AddressGet: 0x02,
    AddressReport: 0x03,
    CapabilityGet: 0x04,
    CapabilityReport: 0x05,
    Data: 0x06,
    properties: {
        0x01: {name: "AddressSet"},
        0x02: {name: "AddressGet"},
        0x03: {name: "AddressReport"},
        0x04: {name: "CapabilityGet"},
        0x05: {name: "CapabilityReport"},
        0x06: {name: "Data"},
    }
});
exports.DmxCommand = DmxCommand;
let isDmxCommandValid = function(command) {
    return (this.DmxCommand.properties[command] !== undefined);
}

/* DoorLock commands (version 3) */
let DoorLockCommand = Object.freeze({
    ConfigurationGet: 0x05,
    ConfigurationReport: 0x06,
    ConfigurationSet: 0x04,
    OperationGet: 0x02,
    OperationReport: 0x03,
    OperationSet: 0x01,
    properties: {
        0x05: {name: "ConfigurationGet"},
        0x06: {name: "ConfigurationReport"},
        0x04: {name: "ConfigurationSet"},
        0x02: {name: "OperationGet"},
        0x03: {name: "OperationReport"},
        0x01: {name: "OperationSet"},
    }
});
exports.DoorLockCommand = DoorLockCommand;
let isDoorLockCommandValid = function(command) {
    return (this.DoorLockCommand.properties[command] !== undefined);
}

/* DoorLockLogging commands (version 1) */
let DoorLockLoggingCommand = Object.freeze({
    RecordsSupportedGet: 0x01,
    RecordsSupportedReport: 0x02,
    RecordGet: 0x03,
    RecordReport: 0x04,
    properties: {
        0x01: {name: "RecordsSupportedGet"},
        0x02: {name: "RecordsSupportedReport"},
        0x03: {name: "RecordGet"},
        0x04: {name: "RecordReport"},
    }
});
exports.DoorLockLoggingCommand = DoorLockLoggingCommand;
let isDoorLockLoggingCommandValid = function(command) {
    return (this.DoorLockLoggingCommand.properties[command] !== undefined);
}

/* EnergyProduction commands (version 1) */
let EnergyProductionCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
    }
});
exports.EnergyProductionCommand = EnergyProductionCommand;
let isEnergyProductionCommandValid = function(command) {
    return (this.EnergyProductionCommand.properties[command] !== undefined);
}

/* EntryControl commands (version 1) */
let EntryControlCommand = Object.freeze({
    Notification: 0x01,
    KeySupportedGet: 0x02,
    KeySupportedReport: 0x03,
    EventSupportedGet: 0x04,
    EventSupportedReport: 0x05,
    ConfigurationSet: 0x06,
    ConfigurationGet: 0x07,
    ConfigurationReport: 0x08,
    properties: {
        0x01: {name: "Notification"},
        0x02: {name: "KeySupportedGet"},
        0x03: {name: "KeySupportedReport"},
        0x04: {name: "EventSupportedGet"},
        0x05: {name: "EventSupportedReport"},
        0x06: {name: "ConfigurationSet"},
        0x07: {name: "ConfigurationGet"},
        0x08: {name: "ConfigurationReport"},
    }
});
exports.EntryControlCommand = EntryControlCommand;
let isEntryControlCommandValid = function(command) {
    return (this.EntryControlCommand.properties[command] !== undefined);
}

/* FirmwareUpdateMd commands (version 5) */
let FirmwareUpdateMdCommand = Object.freeze({
    FirmwareMdGet: 0x01,
    FirmwareMdReport: 0x02,
    Get: 0x05,
    Report: 0x06,
    RequestGet: 0x03,
    RequestReport: 0x04,
    StatusReport: 0x07,
    FirmwareUpdateActivationSet: 0x08,
    FirmwareUpdateActivationStatusReport: 0x09,
    PrepareGet: 0x0a,
    PrepareReport: 0x0b,
    properties: {
        0x01: {name: "FirmwareMdGet"},
        0x02: {name: "FirmwareMdReport"},
        0x05: {name: "Get"},
        0x06: {name: "Report"},
        0x03: {name: "RequestGet"},
        0x04: {name: "RequestReport"},
        0x07: {name: "StatusReport"},
        0x08: {name: "FirmwareUpdateActivationSet"},
        0x09: {name: "FirmwareUpdateActivationStatusReport"},
        0x0a: {name: "PrepareGet"},
        0x0b: {name: "PrepareReport"},
    }
});
exports.FirmwareUpdateMdCommand = FirmwareUpdateMdCommand;
let isFirmwareUpdateMdCommandValid = function(command) {
    return (this.FirmwareUpdateMdCommand.properties[command] !== undefined);
}

/* GeographicLocation commands (version 1) */
let GeographicLocationCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    Set: 0x01,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
    }
});
exports.GeographicLocationCommand = GeographicLocationCommand;
let isGeographicLocationCommandValid = function(command) {
    return (this.GeographicLocationCommand.properties[command] !== undefined);
}

/* GroupingName commands (version 1) */
let GroupingNameCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    Set: 0x01,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
    }
});
exports.GroupingNameCommand = GroupingNameCommand;
let isGroupingNameCommandValid = function(command) {
    return (this.GroupingNameCommand.properties[command] !== undefined);
}

/* Hail commands (version 1) */
let HailCommand = Object.freeze({
    Hail: 0x01,
    properties: {
        0x01: {name: "Hail"},
    }
});
exports.HailCommand = HailCommand;
let isHailCommandValid = function(command) {
    return (this.HailCommand.properties[command] !== undefined);
}

/* HrvControl commands (version 1) */
let HrvControlCommand = Object.freeze({
    BypassGet: 0x05,
    BypassReport: 0x06,
    BypassSet: 0x04,
    ModeGet: 0x02,
    ModeReport: 0x03,
    ModeSet: 0x01,
    ModeSupportedGet: 0x0a,
    ModeSupportedReport: 0x0b,
    VentilationRateGet: 0x08,
    VentilationRateReport: 0x09,
    VentilationRateSet: 0x07,
    properties: {
        0x05: {name: "BypassGet"},
        0x06: {name: "BypassReport"},
        0x04: {name: "BypassSet"},
        0x02: {name: "ModeGet"},
        0x03: {name: "ModeReport"},
        0x01: {name: "ModeSet"},
        0x0a: {name: "ModeSupportedGet"},
        0x0b: {name: "ModeSupportedReport"},
        0x08: {name: "VentilationRateGet"},
        0x09: {name: "VentilationRateReport"},
        0x07: {name: "VentilationRateSet"},
    }
});
exports.HrvControlCommand = HrvControlCommand;
let isHrvControlCommandValid = function(command) {
    return (this.HrvControlCommand.properties[command] !== undefined);
}

/* HrvStatus commands (version 1) */
let HrvStatusCommand = Object.freeze({
    Get: 0x01,
    Report: 0x02,
    SupportedGet: 0x03,
    SupportedReport: 0x04,
    properties: {
        0x01: {name: "Get"},
        0x02: {name: "Report"},
        0x03: {name: "SupportedGet"},
        0x04: {name: "SupportedReport"},
    }
});
exports.HrvStatusCommand = HrvStatusCommand;
let isHrvStatusCommandValid = function(command) {
    return (this.HrvStatusCommand.properties[command] !== undefined);
}

/* HumidityControlMode commands (version 1) */
let HumidityControlModeCommand = Object.freeze({
    Set: 0x01,
    Get: 0x02,
    Report: 0x03,
    SupportedGet: 0x04,
    SupportedReport: 0x05,
    properties: {
        0x01: {name: "Set"},
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x04: {name: "SupportedGet"},
        0x05: {name: "SupportedReport"},
    }
});
exports.HumidityControlModeCommand = HumidityControlModeCommand;
let isHumidityControlModeCommandValid = function(command) {
    return (this.HumidityControlModeCommand.properties[command] !== undefined);
}

/* HumidityControlOperatingState commands (version 1) */
let HumidityControlOperatingStateCommand = Object.freeze({
    Get: 0x01,
    Report: 0x02,
    properties: {
        0x01: {name: "Get"},
        0x02: {name: "Report"},
    }
});
exports.HumidityControlOperatingStateCommand = HumidityControlOperatingStateCommand;
let isHumidityControlOperatingStateCommandValid = function(command) {
    return (this.HumidityControlOperatingStateCommand.properties[command] !== undefined);
}

/* HumidityControlSetpoint commands (version 1) */
let HumidityControlSetpointCommand = Object.freeze({
    Set: 0x01,
    Get: 0x02,
    Report: 0x03,
    SupportedGet: 0x04,
    SupportedReport: 0x05,
    ScaleSupportedGet: 0x06,
    ScaleSupportedReport: 0x07,
    CapabilitiesGet: 0x08,
    CapabilitiesReport: 0x09,
    properties: {
        0x01: {name: "Set"},
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x04: {name: "SupportedGet"},
        0x05: {name: "SupportedReport"},
        0x06: {name: "ScaleSupportedGet"},
        0x07: {name: "ScaleSupportedReport"},
        0x08: {name: "CapabilitiesGet"},
        0x09: {name: "CapabilitiesReport"},
    }
});
exports.HumidityControlSetpointCommand = HumidityControlSetpointCommand;
let isHumidityControlSetpointCommandValid = function(command) {
    return (this.HumidityControlSetpointCommand.properties[command] !== undefined);
}

/* InclusionController commands (version 1) */
let InclusionControllerCommand = Object.freeze({
    Initiate: 0x01,
    Complete: 0x02,
    properties: {
        0x01: {name: "Initiate"},
        0x02: {name: "Complete"},
    }
});
exports.InclusionControllerCommand = InclusionControllerCommand;
let isInclusionControllerCommandValid = function(command) {
    return (this.InclusionControllerCommand.properties[command] !== undefined);
}

/* Indicator commands (version 2) */
let IndicatorCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    Set: 0x01,
    SupportedGet: 0x04,
    SupportedReport: 0x05,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
        0x04: {name: "SupportedGet"},
        0x05: {name: "SupportedReport"},
    }
});
exports.IndicatorCommand = IndicatorCommand;
let isIndicatorCommandValid = function(command) {
    return (this.IndicatorCommand.properties[command] !== undefined);
}

/* IpAssociation commands (version 1) */
let IpAssociationCommand = Object.freeze({
    Set: 0x01,
    Get: 0x02,
    Report: 0x03,
    Remove: 0x04,
    properties: {
        0x01: {name: "Set"},
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x04: {name: "Remove"},
    }
});
exports.IpAssociationCommand = IpAssociationCommand;
let isIpAssociationCommandValid = function(command) {
    return (this.IpAssociationCommand.properties[command] !== undefined);
}

/* IpConfiguration commands (version 1) */
let IpConfigurationCommand = Object.freeze({
    Get: 0x02,
    Release: 0x04,
    Renew: 0x05,
    Report: 0x03,
    Set: 0x01,
    properties: {
        0x02: {name: "Get"},
        0x04: {name: "Release"},
        0x05: {name: "Renew"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
    }
});
exports.IpConfigurationCommand = IpConfigurationCommand;
let isIpConfigurationCommandValid = function(command) {
    return (this.IpConfigurationCommand.properties[command] !== undefined);
}

/* Irrigation commands (version 1) */
let IrrigationCommand = Object.freeze({
    SystemInfoGet: 0x01,
    SystemInfoReport: 0x02,
    SystemStatusGet: 0x03,
    SystemStatusReport: 0x04,
    SystemConfigSet: 0x05,
    SystemConfigGet: 0x06,
    SystemConfigReport: 0x07,
    ValveInfoGet: 0x08,
    ValveInfoReport: 0x09,
    ValveConfigSet: 0x0a,
    ValveConfigGet: 0x0b,
    ValveConfigReport: 0x0c,
    ValveRun: 0x0d,
    ValveTableSet: 0x0e,
    ValveTableGet: 0x0f,
    ValveTableReport: 0x10,
    ValveTableRun: 0x11,
    SystemShutoff: 0x12,
    properties: {
        0x01: {name: "SystemInfoGet"},
        0x02: {name: "SystemInfoReport"},
        0x03: {name: "SystemStatusGet"},
        0x04: {name: "SystemStatusReport"},
        0x05: {name: "SystemConfigSet"},
        0x06: {name: "SystemConfigGet"},
        0x07: {name: "SystemConfigReport"},
        0x08: {name: "ValveInfoGet"},
        0x09: {name: "ValveInfoReport"},
        0x0a: {name: "ValveConfigSet"},
        0x0b: {name: "ValveConfigGet"},
        0x0c: {name: "ValveConfigReport"},
        0x0d: {name: "ValveRun"},
        0x0e: {name: "ValveTableSet"},
        0x0f: {name: "ValveTableGet"},
        0x10: {name: "ValveTableReport"},
        0x11: {name: "ValveTableRun"},
        0x12: {name: "SystemShutoff"},
    }
});
exports.IrrigationCommand = IrrigationCommand;
let isIrrigationCommandValid = function(command) {
    return (this.IrrigationCommand.properties[command] !== undefined);
}

/* Language commands (version 1) */
let LanguageCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    Set: 0x01,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
    }
});
exports.LanguageCommand = LanguageCommand;
let isLanguageCommandValid = function(command) {
    return (this.LanguageCommand.properties[command] !== undefined);
}

/* Lock commands (version 1) */
let LockCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    Set: 0x01,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
    }
});
exports.LockCommand = LockCommand;
let isLockCommandValid = function(command) {
    return (this.LockCommand.properties[command] !== undefined);
}

/* Mailbox commands (version 1) */
let MailboxCommand = Object.freeze({
    ConfigurationGet: 0x01,
    ConfigurationSet: 0x02,
    ConfigurationReport: 0x03,
    Queue: 0x04,
    WakeupNotification: 0x05,
    NodeFailing: 0x06,
    properties: {
        0x01: {name: "ConfigurationGet"},
        0x02: {name: "ConfigurationSet"},
        0x03: {name: "ConfigurationReport"},
        0x04: {name: "Queue"},
        0x05: {name: "WakeupNotification"},
        0x06: {name: "NodeFailing"},
    }
});
exports.MailboxCommand = MailboxCommand;
let isMailboxCommandValid = function(command) {
    return (this.MailboxCommand.properties[command] !== undefined);
}

/* ManufacturerProprietary commands (version 1) */
let ManufacturerProprietaryCommand = Object.freeze({
    properties: {
    }
});
exports.ManufacturerProprietaryCommand = ManufacturerProprietaryCommand;
let isManufacturerProprietaryCommandValid = function(command) {
    return (this.ManufacturerProprietaryCommand.properties[command] !== undefined);
}

/* ManufacturerSpecific commands (version 2) */
let ManufacturerSpecificCommand = Object.freeze({
    Get: 0x04,
    Report: 0x05,
    DeviceSpecificGet: 0x06,
    DeviceSpecificReport: 0x07,
    properties: {
        0x04: {name: "Get"},
        0x05: {name: "Report"},
        0x06: {name: "DeviceSpecificGet"},
        0x07: {name: "DeviceSpecificReport"},
    }
});
exports.ManufacturerSpecificCommand = ManufacturerSpecificCommand;
let isManufacturerSpecificCommandValid = function(command) {
    return (this.ManufacturerSpecificCommand.properties[command] !== undefined);
}

/* Mark commands (version 1) */
let MarkCommand = Object.freeze({
    properties: {
    }
});
exports.MarkCommand = MarkCommand;
let isMarkCommandValid = function(command) {
    return (this.MarkCommand.properties[command] !== undefined);
}

/* Meter commands (version 4) */
let MeterCommand = Object.freeze({
    Get: 0x01,
    Report: 0x02,
    Reset: 0x05,
    SupportedGet: 0x03,
    SupportedReport: 0x04,
    properties: {
        0x01: {name: "Get"},
        0x02: {name: "Report"},
        0x05: {name: "Reset"},
        0x03: {name: "SupportedGet"},
        0x04: {name: "SupportedReport"},
    }
});
exports.MeterCommand = MeterCommand;
let isMeterCommandValid = function(command) {
    return (this.MeterCommand.properties[command] !== undefined);
}

/* MeterPulse commands (version 1) */
let MeterPulseCommand = Object.freeze({
    Get: 0x04,
    Report: 0x05,
    properties: {
        0x04: {name: "Get"},
        0x05: {name: "Report"},
    }
});
exports.MeterPulseCommand = MeterPulseCommand;
let isMeterPulseCommandValid = function(command) {
    return (this.MeterPulseCommand.properties[command] !== undefined);
}

/* MeterTblConfig commands (version 1) */
let MeterTblConfigCommand = Object.freeze({
    MeterTblTablePointAdmNoSet: 0x01,
    properties: {
        0x01: {name: "MeterTblTablePointAdmNoSet"},
    }
});
exports.MeterTblConfigCommand = MeterTblConfigCommand;
let isMeterTblConfigCommandValid = function(command) {
    return (this.MeterTblConfigCommand.properties[command] !== undefined);
}

/* MeterTblMonitor commands (version 2) */
let MeterTblMonitorCommand = Object.freeze({
    MeterTblStatusReport: 0x0b,
    MeterTblStatusDateGet: 0x0a,
    MeterTblStatusDepthGet: 0x09,
    MeterTblStatusSupportedGet: 0x07,
    MeterTblStatusSupportedReport: 0x08,
    MeterTblCurrentDataGet: 0x0c,
    MeterTblCurrentDataReport: 0x0d,
    MeterTblHistoricalDataGet: 0x0e,
    MeterTblHistoricalDataReport: 0x0f,
    MeterTblReport: 0x06,
    MeterTblTableCapabilityGet: 0x05,
    MeterTblTableIdGet: 0x03,
    MeterTblTableIdReport: 0x04,
    MeterTblTablePointAdmNoGet: 0x01,
    MeterTblTablePointAdmNoReport: 0x02,
    properties: {
        0x0b: {name: "MeterTblStatusReport"},
        0x0a: {name: "MeterTblStatusDateGet"},
        0x09: {name: "MeterTblStatusDepthGet"},
        0x07: {name: "MeterTblStatusSupportedGet"},
        0x08: {name: "MeterTblStatusSupportedReport"},
        0x0c: {name: "MeterTblCurrentDataGet"},
        0x0d: {name: "MeterTblCurrentDataReport"},
        0x0e: {name: "MeterTblHistoricalDataGet"},
        0x0f: {name: "MeterTblHistoricalDataReport"},
        0x06: {name: "MeterTblReport"},
        0x05: {name: "MeterTblTableCapabilityGet"},
        0x03: {name: "MeterTblTableIdGet"},
        0x04: {name: "MeterTblTableIdReport"},
        0x01: {name: "MeterTblTablePointAdmNoGet"},
        0x02: {name: "MeterTblTablePointAdmNoReport"},
    }
});
exports.MeterTblMonitorCommand = MeterTblMonitorCommand;
let isMeterTblMonitorCommandValid = function(command) {
    return (this.MeterTblMonitorCommand.properties[command] !== undefined);
}

/* MeterTblPush commands (version 1) */
let MeterTblPushCommand = Object.freeze({
    ConfigurationGet: 0x02,
    ConfigurationReport: 0x03,
    ConfigurationSet: 0x01,
    properties: {
        0x02: {name: "ConfigurationGet"},
        0x03: {name: "ConfigurationReport"},
        0x01: {name: "ConfigurationSet"},
    }
});
exports.MeterTblPushCommand = MeterTblPushCommand;
let isMeterTblPushCommandValid = function(command) {
    return (this.MeterTblPushCommand.properties[command] !== undefined);
}

/* MtpWindowCovering commands (version 1) */
let MtpWindowCoveringCommand = Object.freeze({
    MoveToPositionGet: 0x02,
    MoveToPositionReport: 0x03,
    MoveToPositionSet: 0x01,
    properties: {
        0x02: {name: "MoveToPositionGet"},
        0x03: {name: "MoveToPositionReport"},
        0x01: {name: "MoveToPositionSet"},
    }
});
exports.MtpWindowCoveringCommand = MtpWindowCoveringCommand;
let isMtpWindowCoveringCommandValid = function(command) {
    return (this.MtpWindowCoveringCommand.properties[command] !== undefined);
}

/* MultiChannel commands (version 4) */
let MultiChannelCommand = Object.freeze({
    CapabilityGet: 0x09,
    CapabilityReport: 0x0a,
    CmdEncap: 0x0d,
    EndPointFind: 0x0b,
    EndPointFindReport: 0x0c,
    EndPointGet: 0x07,
    EndPointReport: 0x08,
    MultiInstanceCmdEncap: 0x06,
    MultiInstanceGet: 0x04,
    MultiInstanceReport: 0x05,
    AggregatedMembersGet: 0x0e,
    AggregatedMembersReport: 0x0f,
    properties: {
        0x09: {name: "CapabilityGet"},
        0x0a: {name: "CapabilityReport"},
        0x0d: {name: "CmdEncap"},
        0x0b: {name: "EndPointFind"},
        0x0c: {name: "EndPointFindReport"},
        0x07: {name: "EndPointGet"},
        0x08: {name: "EndPointReport"},
        0x06: {name: "MultiInstanceCmdEncap"},
        0x04: {name: "MultiInstanceGet"},
        0x05: {name: "MultiInstanceReport"},
        0x0e: {name: "AggregatedMembersGet"},
        0x0f: {name: "AggregatedMembersReport"},
    }
});
exports.MultiChannelCommand = MultiChannelCommand;
let isMultiChannelCommandValid = function(command) {
    return (this.MultiChannelCommand.properties[command] !== undefined);
}

/* MultiChannelAssociation commands (version 3) */
let MultiChannelAssociationCommand = Object.freeze({
    Get: 0x02,
    GroupingsGet: 0x05,
    GroupingsReport: 0x06,
    Remove: 0x04,
    Report: 0x03,
    Set: 0x01,
    properties: {
        0x02: {name: "Get"},
        0x05: {name: "GroupingsGet"},
        0x06: {name: "GroupingsReport"},
        0x04: {name: "Remove"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
    }
});
exports.MultiChannelAssociationCommand = MultiChannelAssociationCommand;
let isMultiChannelAssociationCommandValid = function(command) {
    return (this.MultiChannelAssociationCommand.properties[command] !== undefined);
}

/* MultiCmd commands (version 1) */
let MultiCmdCommand = Object.freeze({
    Encap: 0x01,
    properties: {
        0x01: {name: "Encap"},
    }
});
exports.MultiCmdCommand = MultiCmdCommand;
let isMultiCmdCommandValid = function(command) {
    return (this.MultiCmdCommand.properties[command] !== undefined);
}

/* MultiInstance commands (version 1) */
let MultiInstanceCommand = Object.freeze({
    CmdEncap: 0x06,
    Get: 0x04,
    Report: 0x05,
    properties: {
        0x06: {name: "CmdEncap"},
        0x04: {name: "Get"},
        0x05: {name: "Report"},
    }
});
exports.MultiInstanceCommand = MultiInstanceCommand;
let isMultiInstanceCommandValid = function(command) {
    return (this.MultiInstanceCommand.properties[command] !== undefined);
}

/* MultiInstanceAssociation commands (version 1) */
let MultiInstanceAssociationCommand = Object.freeze({
    Get: 0x02,
    GroupingsGet: 0x05,
    GroupingsReport: 0x06,
    Remove: 0x04,
    Report: 0x03,
    Set: 0x01,
    properties: {
        0x02: {name: "Get"},
        0x05: {name: "GroupingsGet"},
        0x06: {name: "GroupingsReport"},
        0x04: {name: "Remove"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
    }
});
exports.MultiInstanceAssociationCommand = MultiInstanceAssociationCommand;
let isMultiInstanceAssociationCommandValid = function(command) {
    return (this.MultiInstanceAssociationCommand.properties[command] !== undefined);
}

/* NetworkManagementBasic commands (version 2) */
let NetworkManagementBasicCommand = Object.freeze({
    LearnModeSet: 0x01,
    LearnModeSetStatus: 0x02,
    NodeInformationSend: 0x05,
    NetworkUpdateRequest: 0x03,
    NetworkUpdateRequestStatus: 0x04,
    DefaultSet: 0x06,
    DefaultSetComplete: 0x07,
    DskGet: 0x08,
    DskReport: 0x09,
    properties: {
        0x01: {name: "LearnModeSet"},
        0x02: {name: "LearnModeSetStatus"},
        0x05: {name: "NodeInformationSend"},
        0x03: {name: "NetworkUpdateRequest"},
        0x04: {name: "NetworkUpdateRequestStatus"},
        0x06: {name: "DefaultSet"},
        0x07: {name: "DefaultSetComplete"},
        0x08: {name: "DskGet"},
        0x09: {name: "DskReport"},
    }
});
exports.NetworkManagementBasicCommand = NetworkManagementBasicCommand;
let isNetworkManagementBasicCommandValid = function(command) {
    return (this.NetworkManagementBasicCommand.properties[command] !== undefined);
}

/* NetworkManagementInclusion commands (version 2) */
let NetworkManagementInclusionCommand = Object.freeze({
    FailedNodeRemove: 0x07,
    FailedNodeRemoveStatus: 0x08,
    NodeAdd: 0x01,
    NodeAddStatus: 0x02,
    NodeRemove: 0x03,
    NodeRemoveStatus: 0x04,
    FailedNodeReplace: 0x09,
    FailedNodeReplaceStatus: 0x0a,
    NodeNeighborUpdateRequest: 0x0b,
    NodeNeighborUpdateStatus: 0x0c,
    ReturnRouteAssign: 0x0d,
    ReturnRouteAssignComplete: 0x0e,
    ReturnRouteDelete: 0x0f,
    ReturnRouteDeleteComplete: 0x10,
    NodeAddKeysReport: 0x11,
    NodeAddKeysSet: 0x12,
    NodeAddDskReport: 0x13,
    NodeAddDskSet: 0x14,
    properties: {
        0x07: {name: "FailedNodeRemove"},
        0x08: {name: "FailedNodeRemoveStatus"},
        0x01: {name: "NodeAdd"},
        0x02: {name: "NodeAddStatus"},
        0x03: {name: "NodeRemove"},
        0x04: {name: "NodeRemoveStatus"},
        0x09: {name: "FailedNodeReplace"},
        0x0a: {name: "FailedNodeReplaceStatus"},
        0x0b: {name: "NodeNeighborUpdateRequest"},
        0x0c: {name: "NodeNeighborUpdateStatus"},
        0x0d: {name: "ReturnRouteAssign"},
        0x0e: {name: "ReturnRouteAssignComplete"},
        0x0f: {name: "ReturnRouteDelete"},
        0x10: {name: "ReturnRouteDeleteComplete"},
        0x11: {name: "NodeAddKeysReport"},
        0x12: {name: "NodeAddKeysSet"},
        0x13: {name: "NodeAddDskReport"},
        0x14: {name: "NodeAddDskSet"},
    }
});
exports.NetworkManagementInclusionCommand = NetworkManagementInclusionCommand;
let isNetworkManagementInclusionCommandValid = function(command) {
    return (this.NetworkManagementInclusionCommand.properties[command] !== undefined);
}

/* NetworkManagementInstallationMaintenance commands (version 1) */
let NetworkManagementInstallationMaintenanceCommand = Object.freeze({
    LastWorkingRouteSet: 0x01,
    LastWorkingRouteGet: 0x02,
    LastWorkingRouteReport: 0x03,
    StatisticsGet: 0x04,
    StatisticsReport: 0x05,
    StatisticsClear: 0x06,
    properties: {
        0x01: {name: "LastWorkingRouteSet"},
        0x02: {name: "LastWorkingRouteGet"},
        0x03: {name: "LastWorkingRouteReport"},
        0x04: {name: "StatisticsGet"},
        0x05: {name: "StatisticsReport"},
        0x06: {name: "StatisticsClear"},
    }
});
exports.NetworkManagementInstallationMaintenanceCommand = NetworkManagementInstallationMaintenanceCommand;
let isNetworkManagementInstallationMaintenanceCommandValid = function(command) {
    return (this.NetworkManagementInstallationMaintenanceCommand.properties[command] !== undefined);
}

/* NetworkManagementPrimary commands (version 1) */
let NetworkManagementPrimaryCommand = Object.freeze({
    ControllerChange: 0x01,
    ControllerChangeStatus: 0x02,
    properties: {
        0x01: {name: "ControllerChange"},
        0x02: {name: "ControllerChangeStatus"},
    }
});
exports.NetworkManagementPrimaryCommand = NetworkManagementPrimaryCommand;
let isNetworkManagementPrimaryCommandValid = function(command) {
    return (this.NetworkManagementPrimaryCommand.properties[command] !== undefined);
}

/* NetworkManagementProxy commands (version 2) */
let NetworkManagementProxyCommand = Object.freeze({
    NodeInfoCachedGet: 0x03,
    NodeInfoCachedReport: 0x04,
    NodeListGet: 0x01,
    NodeListReport: 0x02,
    properties: {
        0x03: {name: "NodeInfoCachedGet"},
        0x04: {name: "NodeInfoCachedReport"},
        0x01: {name: "NodeListGet"},
        0x02: {name: "NodeListReport"},
    }
});
exports.NetworkManagementProxyCommand = NetworkManagementProxyCommand;
let isNetworkManagementProxyCommandValid = function(command) {
    return (this.NetworkManagementProxyCommand.properties[command] !== undefined);
}

/* NodeNaming commands (version 1) */
let NodeNamingCommand = Object.freeze({
    NodeLocationReport: 0x06,
    NodeLocationSet: 0x04,
    NodeLocationGet: 0x05,
    NodeNameGet: 0x02,
    NodeNameReport: 0x03,
    NodeNameSet: 0x01,
    properties: {
        0x06: {name: "NodeLocationReport"},
        0x04: {name: "NodeLocationSet"},
        0x05: {name: "NodeLocationGet"},
        0x02: {name: "NodeNameGet"},
        0x03: {name: "NodeNameReport"},
        0x01: {name: "NodeNameSet"},
    }
});
exports.NodeNamingCommand = NodeNamingCommand;
let isNodeNamingCommandValid = function(command) {
    return (this.NodeNamingCommand.properties[command] !== undefined);
}

/* NonInteroperable commands (version 1) */
let NonInteroperableCommand = Object.freeze({
    properties: {
    }
});
exports.NonInteroperableCommand = NonInteroperableCommand;
let isNonInteroperableCommandValid = function(command) {
    return (this.NonInteroperableCommand.properties[command] !== undefined);
}

/* NoOperation commands (version 1) */
let NoOperationCommand = Object.freeze({
    properties: {
    }
});
exports.NoOperationCommand = NoOperationCommand;
let isNoOperationCommandValid = function(command) {
    return (this.NoOperationCommand.properties[command] !== undefined);
}

/* Notification commands (version 8) */
let NotificationCommand = Object.freeze({
    Get: 0x04,
    Report: 0x05,
    Set: 0x06,
    SupportedGet: 0x07,
    SupportedReport: 0x08,
    EventSupportedGet: 0x01,
    EventSupportedReport: 0x02,
    properties: {
        0x04: {name: "Get"},
        0x05: {name: "Report"},
        0x06: {name: "Set"},
        0x07: {name: "SupportedGet"},
        0x08: {name: "SupportedReport"},
        0x01: {name: "EventSupportedGet"},
        0x02: {name: "EventSupportedReport"},
    }
});
exports.NotificationCommand = NotificationCommand;
let isNotificationCommandValid = function(command) {
    return (this.NotificationCommand.properties[command] !== undefined);
}

/* Powerlevel commands (version 1) */
let PowerlevelCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    Set: 0x01,
    TestNodeGet: 0x05,
    TestNodeReport: 0x06,
    TestNodeSet: 0x04,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
        0x05: {name: "TestNodeGet"},
        0x06: {name: "TestNodeReport"},
        0x04: {name: "TestNodeSet"},
    }
});
exports.PowerlevelCommand = PowerlevelCommand;
let isPowerlevelCommandValid = function(command) {
    return (this.PowerlevelCommand.properties[command] !== undefined);
}

/* Prepayment commands (version 1) */
let PrepaymentCommand = Object.freeze({
    BalanceGet: 0x01,
    BalanceReport: 0x02,
    SupportedGet: 0x03,
    SupportedReport: 0x04,
    properties: {
        0x01: {name: "BalanceGet"},
        0x02: {name: "BalanceReport"},
        0x03: {name: "SupportedGet"},
        0x04: {name: "SupportedReport"},
    }
});
exports.PrepaymentCommand = PrepaymentCommand;
let isPrepaymentCommandValid = function(command) {
    return (this.PrepaymentCommand.properties[command] !== undefined);
}

/* PrepaymentEncapsulation commands (version 1) */
let PrepaymentEncapsulationCommand = Object.freeze({
    CmdEncapsulation: 0x01,
    properties: {
        0x01: {name: "CmdEncapsulation"},
    }
});
exports.PrepaymentEncapsulationCommand = PrepaymentEncapsulationCommand;
let isPrepaymentEncapsulationCommandValid = function(command) {
    return (this.PrepaymentEncapsulationCommand.properties[command] !== undefined);
}

/* Proprietary commands (version 1) */
let ProprietaryCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    Set: 0x01,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
    }
});
exports.ProprietaryCommand = ProprietaryCommand;
let isProprietaryCommandValid = function(command) {
    return (this.ProprietaryCommand.properties[command] !== undefined);
}

/* Protection commands (version 2) */
let ProtectionCommand = Object.freeze({
    EcGet: 0x07,
    EcReport: 0x08,
    EcSet: 0x06,
    Get: 0x02,
    Report: 0x03,
    Set: 0x01,
    SupportedGet: 0x04,
    SupportedReport: 0x05,
    TimeoutGet: 0x0a,
    TimeoutReport: 0x0b,
    TimeoutSet: 0x09,
    properties: {
        0x07: {name: "EcGet"},
        0x08: {name: "EcReport"},
        0x06: {name: "EcSet"},
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
        0x04: {name: "SupportedGet"},
        0x05: {name: "SupportedReport"},
        0x0a: {name: "TimeoutGet"},
        0x0b: {name: "TimeoutReport"},
        0x09: {name: "TimeoutSet"},
    }
});
exports.ProtectionCommand = ProtectionCommand;
let isProtectionCommandValid = function(command) {
    return (this.ProtectionCommand.properties[command] !== undefined);
}

/* RateTblConfig commands (version 1) */
let RateTblConfigCommand = Object.freeze({
    RateTblRemove: 0x02,
    RateTblSet: 0x01,
    properties: {
        0x02: {name: "RateTblRemove"},
        0x01: {name: "RateTblSet"},
    }
});
exports.RateTblConfigCommand = RateTblConfigCommand;
let isRateTblConfigCommandValid = function(command) {
    return (this.RateTblConfigCommand.properties[command] !== undefined);
}

/* RateTblMonitor commands (version 1) */
let RateTblMonitorCommand = Object.freeze({
    RateTblActiveRateGet: 0x05,
    RateTblActiveRateReport: 0x06,
    RateTblCurrentDataGet: 0x07,
    RateTblCurrentDataReport: 0x08,
    RateTblGet: 0x03,
    RateTblHistoricalDataGet: 0x09,
    RateTblHistoricalDataReport: 0x0a,
    RateTblReport: 0x04,
    RateTblSupportedGet: 0x01,
    RateTblSupportedReport: 0x02,
    properties: {
        0x05: {name: "RateTblActiveRateGet"},
        0x06: {name: "RateTblActiveRateReport"},
        0x07: {name: "RateTblCurrentDataGet"},
        0x08: {name: "RateTblCurrentDataReport"},
        0x03: {name: "RateTblGet"},
        0x09: {name: "RateTblHistoricalDataGet"},
        0x0a: {name: "RateTblHistoricalDataReport"},
        0x04: {name: "RateTblReport"},
        0x01: {name: "RateTblSupportedGet"},
        0x02: {name: "RateTblSupportedReport"},
    }
});
exports.RateTblMonitorCommand = RateTblMonitorCommand;
let isRateTblMonitorCommandValid = function(command) {
    return (this.RateTblMonitorCommand.properties[command] !== undefined);
}

/* RemoteAssociation commands (version 1) */
let RemoteAssociationCommand = Object.freeze({
    ConfigurationGet: 0x02,
    ConfigurationReport: 0x03,
    ConfigurationSet: 0x01,
    properties: {
        0x02: {name: "ConfigurationGet"},
        0x03: {name: "ConfigurationReport"},
        0x01: {name: "ConfigurationSet"},
    }
});
exports.RemoteAssociationCommand = RemoteAssociationCommand;
let isRemoteAssociationCommandValid = function(command) {
    return (this.RemoteAssociationCommand.properties[command] !== undefined);
}

/* RemoteAssociationActivate commands (version 1) */
let RemoteAssociationActivateCommand = Object.freeze({
    RemoteAssociationActivate: 0x01,
    properties: {
        0x01: {name: "RemoteAssociationActivate"},
    }
});
exports.RemoteAssociationActivateCommand = RemoteAssociationActivateCommand;
let isRemoteAssociationActivateCommandValid = function(command) {
    return (this.RemoteAssociationActivateCommand.properties[command] !== undefined);
}

/* SceneActivation commands (version 1) */
let SceneActivationCommand = Object.freeze({
    Set: 0x01,
    properties: {
        0x01: {name: "Set"},
    }
});
exports.SceneActivationCommand = SceneActivationCommand;
let isSceneActivationCommandValid = function(command) {
    return (this.SceneActivationCommand.properties[command] !== undefined);
}

/* SceneActuatorConf commands (version 1) */
let SceneActuatorConfCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    Set: 0x01,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
    }
});
exports.SceneActuatorConfCommand = SceneActuatorConfCommand;
let isSceneActuatorConfCommandValid = function(command) {
    return (this.SceneActuatorConfCommand.properties[command] !== undefined);
}

/* SceneControllerConf commands (version 1) */
let SceneControllerConfCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    Set: 0x01,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
    }
});
exports.SceneControllerConfCommand = SceneControllerConfCommand;
let isSceneControllerConfCommandValid = function(command) {
    return (this.SceneControllerConfCommand.properties[command] !== undefined);
}

/* Schedule commands (version 3) */
let ScheduleCommand = Object.freeze({
    SupportedGet: 0x01,
    SupportedReport: 0x02,
    CommandScheduleSet: 0x03,
    CommandScheduleGet: 0x04,
    CommandScheduleReport: 0x05,
    Remove: 0x06,
    StateSet: 0x07,
    StateGet: 0x08,
    StateReport: 0x09,
    properties: {
        0x01: {name: "SupportedGet"},
        0x02: {name: "SupportedReport"},
        0x03: {name: "CommandScheduleSet"},
        0x04: {name: "CommandScheduleGet"},
        0x05: {name: "CommandScheduleReport"},
        0x06: {name: "Remove"},
        0x07: {name: "StateSet"},
        0x08: {name: "StateGet"},
        0x09: {name: "StateReport"},
    }
});
exports.ScheduleCommand = ScheduleCommand;
let isScheduleCommandValid = function(command) {
    return (this.ScheduleCommand.properties[command] !== undefined);
}

/* ScheduleEntryLock commands (version 3) */
let ScheduleEntryLockCommand = Object.freeze({
    EnableAllSet: 0x02,
    EnableSet: 0x01,
    TimeOffsetGet: 0x0b,
    TimeOffsetReport: 0x0c,
    TimeOffsetSet: 0x0d,
    WeekDayGet: 0x04,
    WeekDayReport: 0x05,
    WeekDaySet: 0x03,
    YearDayGet: 0x07,
    YearDayReport: 0x08,
    YearDaySet: 0x06,
    ScheduleEntryTypeSupportedGet: 0x09,
    ScheduleEntryTypeSupportedReport: 0x0a,
    DailyRepeatingGet: 0x0e,
    DailyRepeatingReport: 0x0f,
    DailyRepeatingSet: 0x10,
    properties: {
        0x02: {name: "EnableAllSet"},
        0x01: {name: "EnableSet"},
        0x0b: {name: "TimeOffsetGet"},
        0x0c: {name: "TimeOffsetReport"},
        0x0d: {name: "TimeOffsetSet"},
        0x04: {name: "WeekDayGet"},
        0x05: {name: "WeekDayReport"},
        0x03: {name: "WeekDaySet"},
        0x07: {name: "YearDayGet"},
        0x08: {name: "YearDayReport"},
        0x06: {name: "YearDaySet"},
        0x09: {name: "ScheduleEntryTypeSupportedGet"},
        0x0a: {name: "ScheduleEntryTypeSupportedReport"},
        0x0e: {name: "DailyRepeatingGet"},
        0x0f: {name: "DailyRepeatingReport"},
        0x10: {name: "DailyRepeatingSet"},
    }
});
exports.ScheduleEntryLockCommand = ScheduleEntryLockCommand;
let isScheduleEntryLockCommandValid = function(command) {
    return (this.ScheduleEntryLockCommand.properties[command] !== undefined);
}

/* ScreenAttributes commands (version 2) */
let ScreenAttributesCommand = Object.freeze({
    Get: 0x01,
    Report: 0x03,
    properties: {
        0x01: {name: "Get"},
        0x03: {name: "Report"},
    }
});
exports.ScreenAttributesCommand = ScreenAttributesCommand;
let isScreenAttributesCommandValid = function(command) {
    return (this.ScreenAttributesCommand.properties[command] !== undefined);
}

/* ScreenMd commands (version 2) */
let ScreenMdCommand = Object.freeze({
    Get: 0x01,
    Report: 0x03,
    properties: {
        0x01: {name: "Get"},
        0x03: {name: "Report"},
    }
});
exports.ScreenMdCommand = ScreenMdCommand;
let isScreenMdCommandValid = function(command) {
    return (this.ScreenMdCommand.properties[command] !== undefined);
}

/* Security commands (version 1) */
let SecurityCommand = Object.freeze({
    NetworkKeySet: 0x06,
    NetworkKeyVerify: 0x07,
    CommandsSupportedGet: 0x02,
    CommandsSupportedReport: 0x03,
    MessageEncapsulation: 0x81,
    MessageEncapsulationNonceGet: 0xc1,
    NonceGet: 0x40,
    NonceReport: 0x80,
    SchemeGet: 0x04,
    SchemeInherit: 0x08,
    SchemeReport: 0x05,
    properties: {
        0x06: {name: "NetworkKeySet"},
        0x07: {name: "NetworkKeyVerify"},
        0x02: {name: "CommandsSupportedGet"},
        0x03: {name: "CommandsSupportedReport"},
        0x81: {name: "MessageEncapsulation"},
        0xc1: {name: "MessageEncapsulationNonceGet"},
        0x40: {name: "NonceGet"},
        0x80: {name: "NonceReport"},
        0x04: {name: "SchemeGet"},
        0x08: {name: "SchemeInherit"},
        0x05: {name: "SchemeReport"},
    }
});
exports.SecurityCommand = SecurityCommand;
let isSecurityCommandValid = function(command) {
    return (this.SecurityCommand.properties[command] !== undefined);
}

/* Security2 commands (version 1) */
let Security2Command = Object.freeze({
    NonceGet: 0x01,
    NonceReport: 0x02,
    MessageEncapsulation: 0x03,
    KexGet: 0x04,
    KexReport: 0x05,
    KexSet: 0x06,
    KexFail: 0x07,
    PublicKeyReport: 0x08,
    NetworkKeyGet: 0x09,
    NetworkKeyReport: 0x0a,
    NetworkKeyVerify: 0x0b,
    TransferEnd: 0x0c,
    CommandsSupportedGet: 0x0d,
    CommandsSupportedReport: 0x0e,
    CapabilitiesGet: 0x0f,
    CapabilitiesReport: 0x10,
    properties: {
        0x01: {name: "NonceGet"},
        0x02: {name: "NonceReport"},
        0x03: {name: "MessageEncapsulation"},
        0x04: {name: "KexGet"},
        0x05: {name: "KexReport"},
        0x06: {name: "KexSet"},
        0x07: {name: "KexFail"},
        0x08: {name: "PublicKeyReport"},
        0x09: {name: "NetworkKeyGet"},
        0x0a: {name: "NetworkKeyReport"},
        0x0b: {name: "NetworkKeyVerify"},
        0x0c: {name: "TransferEnd"},
        0x0d: {name: "CommandsSupportedGet"},
        0x0e: {name: "CommandsSupportedReport"},
        0x0f: {name: "CapabilitiesGet"},
        0x10: {name: "CapabilitiesReport"},
    }
});
exports.Security2Command = Security2Command;
let isSecurity2CommandValid = function(command) {
    return (this.Security2Command.properties[command] !== undefined);
}

/* SecurityPanelMode commands (version 1) */
let SecurityPanelModeCommand = Object.freeze({
    Get: 0x03,
    Report: 0x04,
    Set: 0x05,
    SupportedGet: 0x01,
    SupportedReport: 0x02,
    properties: {
        0x03: {name: "Get"},
        0x04: {name: "Report"},
        0x05: {name: "Set"},
        0x01: {name: "SupportedGet"},
        0x02: {name: "SupportedReport"},
    }
});
exports.SecurityPanelModeCommand = SecurityPanelModeCommand;
let isSecurityPanelModeCommandValid = function(command) {
    return (this.SecurityPanelModeCommand.properties[command] !== undefined);
}

/* SecurityPanelZone commands (version 1) */
let SecurityPanelZoneCommand = Object.freeze({
    NumberSupportedGet: 0x01,
    StateGet: 0x05,
    StateReport: 0x06,
    SupportedReport: 0x02,
    TypeGet: 0x03,
    TypeReport: 0x04,
    properties: {
        0x01: {name: "NumberSupportedGet"},
        0x05: {name: "StateGet"},
        0x06: {name: "StateReport"},
        0x02: {name: "SupportedReport"},
        0x03: {name: "TypeGet"},
        0x04: {name: "TypeReport"},
    }
});
exports.SecurityPanelZoneCommand = SecurityPanelZoneCommand;
let isSecurityPanelZoneCommandValid = function(command) {
    return (this.SecurityPanelZoneCommand.properties[command] !== undefined);
}

/* SecurityPanelZoneSensor commands (version 1) */
let SecurityPanelZoneSensorCommand = Object.freeze({
    CommandClassSecurityPanelZoneSensorInstalledReport: 0x02,
    TypeGet: 0x03,
    TypeReport: 0x04,
    InstalledGet: 0x01,
    StateGet: 0x05,
    StateReport: 0x06,
    properties: {
        0x02: {name: "CommandClassSecurityPanelZoneSensorInstalledReport"},
        0x03: {name: "TypeGet"},
        0x04: {name: "TypeReport"},
        0x01: {name: "InstalledGet"},
        0x05: {name: "StateGet"},
        0x06: {name: "StateReport"},
    }
});
exports.SecurityPanelZoneSensorCommand = SecurityPanelZoneSensorCommand;
let isSecurityPanelZoneSensorCommandValid = function(command) {
    return (this.SecurityPanelZoneSensorCommand.properties[command] !== undefined);
}

/* SensorAlarm commands (version 1) */
let SensorAlarmCommand = Object.freeze({
    Get: 0x01,
    Report: 0x02,
    SupportedGet: 0x03,
    SupportedReport: 0x04,
    properties: {
        0x01: {name: "Get"},
        0x02: {name: "Report"},
        0x03: {name: "SupportedGet"},
        0x04: {name: "SupportedReport"},
    }
});
exports.SensorAlarmCommand = SensorAlarmCommand;
let isSensorAlarmCommandValid = function(command) {
    return (this.SensorAlarmCommand.properties[command] !== undefined);
}

/* SensorBinary commands (version 2) */
let SensorBinaryCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    SupportedGetSensor: 0x01,
    SupportedSensorReport: 0x04,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x01: {name: "SupportedGetSensor"},
        0x04: {name: "SupportedSensorReport"},
    }
});
exports.SensorBinaryCommand = SensorBinaryCommand;
let isSensorBinaryCommandValid = function(command) {
    return (this.SensorBinaryCommand.properties[command] !== undefined);
}

/* SensorConfiguration commands (version 1) */
let SensorConfigurationCommand = Object.freeze({
    SensorTriggerLevelGet: 0x02,
    SensorTriggerLevelReport: 0x03,
    SensorTriggerLevelSet: 0x01,
    properties: {
        0x02: {name: "SensorTriggerLevelGet"},
        0x03: {name: "SensorTriggerLevelReport"},
        0x01: {name: "SensorTriggerLevelSet"},
    }
});
exports.SensorConfigurationCommand = SensorConfigurationCommand;
let isSensorConfigurationCommandValid = function(command) {
    return (this.SensorConfigurationCommand.properties[command] !== undefined);
}

/* SensorMultilevel commands (version 10) */
let SensorMultilevelCommand = Object.freeze({
    Get: 0x04,
    Report: 0x05,
    SupportedGetSensor: 0x01,
    SupportedSensorReport: 0x02,
    SupportedGetScale: 0x03,
    SupportedScaleReport: 0x06,
    properties: {
        0x04: {name: "Get"},
        0x05: {name: "Report"},
        0x01: {name: "SupportedGetSensor"},
        0x02: {name: "SupportedSensorReport"},
        0x03: {name: "SupportedGetScale"},
        0x06: {name: "SupportedScaleReport"},
    }
});
exports.SensorMultilevelCommand = SensorMultilevelCommand;
let isSensorMultilevelCommandValid = function(command) {
    return (this.SensorMultilevelCommand.properties[command] !== undefined);
}

/* SilenceAlarm commands (version 1) */
let SilenceAlarmCommand = Object.freeze({
    SensorAlarmSet: 0x01,
    properties: {
        0x01: {name: "SensorAlarmSet"},
    }
});
exports.SilenceAlarmCommand = SilenceAlarmCommand;
let isSilenceAlarmCommandValid = function(command) {
    return (this.SilenceAlarmCommand.properties[command] !== undefined);
}

/* SimpleAvControl commands (version 1) */
let SimpleAvControlCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    Set: 0x01,
    SupportedGet: 0x04,
    SupportedReport: 0x05,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
        0x04: {name: "SupportedGet"},
        0x05: {name: "SupportedReport"},
    }
});
exports.SimpleAvControlCommand = SimpleAvControlCommand;
let isSimpleAvControlCommandValid = function(command) {
    return (this.SimpleAvControlCommand.properties[command] !== undefined);
}

/* Supervision commands (version 1) */
let SupervisionCommand = Object.freeze({
    Get: 0x01,
    Report: 0x02,
    properties: {
        0x01: {name: "Get"},
        0x02: {name: "Report"},
    }
});
exports.SupervisionCommand = SupervisionCommand;
let isSupervisionCommandValid = function(command) {
    return (this.SupervisionCommand.properties[command] !== undefined);
}

/* SwitchAll commands (version 1) */
let SwitchAllCommand = Object.freeze({
    Get: 0x02,
    Off: 0x05,
    On: 0x04,
    Report: 0x03,
    Set: 0x01,
    properties: {
        0x02: {name: "Get"},
        0x05: {name: "Off"},
        0x04: {name: "On"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
    }
});
exports.SwitchAllCommand = SwitchAllCommand;
let isSwitchAllCommandValid = function(command) {
    return (this.SwitchAllCommand.properties[command] !== undefined);
}

/* SwitchBinary commands (version 2) */
let SwitchBinaryCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    Set: 0x01,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
    }
});
exports.SwitchBinaryCommand = SwitchBinaryCommand;
let isSwitchBinaryCommandValid = function(command) {
    return (this.SwitchBinaryCommand.properties[command] !== undefined);
}

/* SwitchColor commands (version 3) */
let SwitchColorCommand = Object.freeze({
    SupportedGet: 0x01,
    SupportedReport: 0x02,
    Get: 0x03,
    Report: 0x04,
    Set: 0x05,
    StartLevelChange: 0x06,
    StopLevelChange: 0x07,
    properties: {
        0x01: {name: "SupportedGet"},
        0x02: {name: "SupportedReport"},
        0x03: {name: "Get"},
        0x04: {name: "Report"},
        0x05: {name: "Set"},
        0x06: {name: "StartLevelChange"},
        0x07: {name: "StopLevelChange"},
    }
});
exports.SwitchColorCommand = SwitchColorCommand;
let isSwitchColorCommandValid = function(command) {
    return (this.SwitchColorCommand.properties[command] !== undefined);
}

/* SwitchMultilevel commands (version 4) */
let SwitchMultilevelCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    Set: 0x01,
    StartLevelChange: 0x04,
    StopLevelChange: 0x05,
    SupportedGet: 0x06,
    SupportedReport: 0x07,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
        0x04: {name: "StartLevelChange"},
        0x05: {name: "StopLevelChange"},
        0x06: {name: "SupportedGet"},
        0x07: {name: "SupportedReport"},
    }
});
exports.SwitchMultilevelCommand = SwitchMultilevelCommand;
let isSwitchMultilevelCommandValid = function(command) {
    return (this.SwitchMultilevelCommand.properties[command] !== undefined);
}

/* SwitchToggleBinary commands (version 1) */
let SwitchToggleBinaryCommand = Object.freeze({
    Set: 0x01,
    Get: 0x02,
    Report: 0x03,
    properties: {
        0x01: {name: "Set"},
        0x02: {name: "Get"},
        0x03: {name: "Report"},
    }
});
exports.SwitchToggleBinaryCommand = SwitchToggleBinaryCommand;
let isSwitchToggleBinaryCommandValid = function(command) {
    return (this.SwitchToggleBinaryCommand.properties[command] !== undefined);
}

/* SwitchToggleMultilevel commands (version 1) */
let SwitchToggleMultilevelCommand = Object.freeze({
    Set: 0x01,
    Get: 0x02,
    Report: 0x03,
    StartLevelChange: 0x04,
    StopLevelChange: 0x05,
    properties: {
        0x01: {name: "Set"},
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x04: {name: "StartLevelChange"},
        0x05: {name: "StopLevelChange"},
    }
});
exports.SwitchToggleMultilevelCommand = SwitchToggleMultilevelCommand;
let isSwitchToggleMultilevelCommandValid = function(command) {
    return (this.SwitchToggleMultilevelCommand.properties[command] !== undefined);
}

/* TariffConfig commands (version 1) */
let TariffConfigCommand = Object.freeze({
    TariffTblRemove: 0x03,
    TariffTblSet: 0x02,
    TariffTblSupplierSet: 0x01,
    properties: {
        0x03: {name: "TariffTblRemove"},
        0x02: {name: "TariffTblSet"},
        0x01: {name: "TariffTblSupplierSet"},
    }
});
exports.TariffConfigCommand = TariffConfigCommand;
let isTariffConfigCommandValid = function(command) {
    return (this.TariffConfigCommand.properties[command] !== undefined);
}

/* TariffTblMonitor commands (version 1) */
let TariffTblMonitorCommand = Object.freeze({
    TariffTblCostGet: 0x05,
    TariffTblCostReport: 0x06,
    TariffTblGet: 0x03,
    TariffTblReport: 0x04,
    TariffTblSupplierGet: 0x01,
    TariffTblSupplierReport: 0x02,
    properties: {
        0x05: {name: "TariffTblCostGet"},
        0x06: {name: "TariffTblCostReport"},
        0x03: {name: "TariffTblGet"},
        0x04: {name: "TariffTblReport"},
        0x01: {name: "TariffTblSupplierGet"},
        0x02: {name: "TariffTblSupplierReport"},
    }
});
exports.TariffTblMonitorCommand = TariffTblMonitorCommand;
let isTariffTblMonitorCommandValid = function(command) {
    return (this.TariffTblMonitorCommand.properties[command] !== undefined);
}

/* ThermostatFanMode commands (version 4) */
let ThermostatFanModeCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    Set: 0x01,
    SupportedGet: 0x04,
    SupportedReport: 0x05,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
        0x04: {name: "SupportedGet"},
        0x05: {name: "SupportedReport"},
    }
});
exports.ThermostatFanModeCommand = ThermostatFanModeCommand;
let isThermostatFanModeCommandValid = function(command) {
    return (this.ThermostatFanModeCommand.properties[command] !== undefined);
}

/* ThermostatFanState commands (version 2) */
let ThermostatFanStateCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
    }
});
exports.ThermostatFanStateCommand = ThermostatFanStateCommand;
let isThermostatFanStateCommandValid = function(command) {
    return (this.ThermostatFanStateCommand.properties[command] !== undefined);
}

/* ThermostatHeating commands (version 1) */
let ThermostatHeatingCommand = Object.freeze({
    StatusReport: 0x0d,
    ModeGet: 0x02,
    ModeReport: 0x03,
    ModeSet: 0x01,
    RelayStatusGet: 0x09,
    RelayStatusReport: 0x0a,
    SetpointGet: 0x05,
    SetpointReport: 0x06,
    SetpointSet: 0x04,
    StatusGet: 0x0c,
    StatusSet: 0x0b,
    TimedOffSet: 0x11,
    properties: {
        0x0d: {name: "StatusReport"},
        0x02: {name: "ModeGet"},
        0x03: {name: "ModeReport"},
        0x01: {name: "ModeSet"},
        0x09: {name: "RelayStatusGet"},
        0x0a: {name: "RelayStatusReport"},
        0x05: {name: "SetpointGet"},
        0x06: {name: "SetpointReport"},
        0x04: {name: "SetpointSet"},
        0x0c: {name: "StatusGet"},
        0x0b: {name: "StatusSet"},
        0x11: {name: "TimedOffSet"},
    }
});
exports.ThermostatHeatingCommand = ThermostatHeatingCommand;
let isThermostatHeatingCommandValid = function(command) {
    return (this.ThermostatHeatingCommand.properties[command] !== undefined);
}

/* ThermostatMode commands (version 3) */
let ThermostatModeCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    Set: 0x01,
    SupportedGet: 0x04,
    SupportedReport: 0x05,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
        0x04: {name: "SupportedGet"},
        0x05: {name: "SupportedReport"},
    }
});
exports.ThermostatModeCommand = ThermostatModeCommand;
let isThermostatModeCommandValid = function(command) {
    return (this.ThermostatModeCommand.properties[command] !== undefined);
}

/* ThermostatOperatingState commands (version 2) */
let ThermostatOperatingStateCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    LoggingSupportedGet: 0x01,
    ThermostatOperatingLoggingSupportedReport: 0x04,
    LoggingGet: 0x05,
    LoggingReport: 0x06,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x01: {name: "LoggingSupportedGet"},
        0x04: {name: "ThermostatOperatingLoggingSupportedReport"},
        0x05: {name: "LoggingGet"},
        0x06: {name: "LoggingReport"},
    }
});
exports.ThermostatOperatingStateCommand = ThermostatOperatingStateCommand;
let isThermostatOperatingStateCommandValid = function(command) {
    return (this.ThermostatOperatingStateCommand.properties[command] !== undefined);
}

/* ThermostatSetback commands (version 1) */
let ThermostatSetbackCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    Set: 0x01,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
    }
});
exports.ThermostatSetbackCommand = ThermostatSetbackCommand;
let isThermostatSetbackCommandValid = function(command) {
    return (this.ThermostatSetbackCommand.properties[command] !== undefined);
}

/* ThermostatSetpoint commands (version 3) */
let ThermostatSetpointCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    Set: 0x01,
    SupportedGet: 0x04,
    SupportedReport: 0x05,
    CapabilitiesGet: 0x09,
    CapabilitiesReport: 0x0a,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
        0x04: {name: "SupportedGet"},
        0x05: {name: "SupportedReport"},
        0x09: {name: "CapabilitiesGet"},
        0x0a: {name: "CapabilitiesReport"},
    }
});
exports.ThermostatSetpointCommand = ThermostatSetpointCommand;
let isThermostatSetpointCommandValid = function(command) {
    return (this.ThermostatSetpointCommand.properties[command] !== undefined);
}

/* Time commands (version 2) */
let TimeCommand = Object.freeze({
    DateGet: 0x03,
    DateReport: 0x04,
    Get: 0x01,
    OffsetGet: 0x06,
    OffsetReport: 0x07,
    OffsetSet: 0x05,
    Report: 0x02,
    properties: {
        0x03: {name: "DateGet"},
        0x04: {name: "DateReport"},
        0x01: {name: "Get"},
        0x06: {name: "OffsetGet"},
        0x07: {name: "OffsetReport"},
        0x05: {name: "OffsetSet"},
        0x02: {name: "Report"},
    }
});
exports.TimeCommand = TimeCommand;
let isTimeCommandValid = function(command) {
    return (this.TimeCommand.properties[command] !== undefined);
}

/* TimeParameters commands (version 1) */
let TimeParametersCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    Set: 0x01,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
    }
});
exports.TimeParametersCommand = TimeParametersCommand;
let isTimeParametersCommandValid = function(command) {
    return (this.TimeParametersCommand.properties[command] !== undefined);
}

/* TransportService commands (version 2) */
let TransportServiceCommand = Object.freeze({
    CommandFirstSegment: 0xc0,
    CommandSegmentComplete: 0xe8,
    CommandSegmentRequest: 0xc8,
    CommandSegmentWait: 0xf0,
    CommandSubsequentSegment: 0xe0,
    properties: {
        0xc0: {name: "CommandFirstSegment"},
        0xe8: {name: "CommandSegmentComplete"},
        0xc8: {name: "CommandSegmentRequest"},
        0xf0: {name: "CommandSegmentWait"},
        0xe0: {name: "CommandSubsequentSegment"},
    }
});
exports.TransportServiceCommand = TransportServiceCommand;
let isTransportServiceCommandValid = function(command) {
    return (this.TransportServiceCommand.properties[command] !== undefined);
}

/* UserCode commands (version 1) */
let UserCodeCommand = Object.freeze({
    Get: 0x02,
    Report: 0x03,
    Set: 0x01,
    UsersNumberGet: 0x04,
    UsersNumberReport: 0x05,
    properties: {
        0x02: {name: "Get"},
        0x03: {name: "Report"},
        0x01: {name: "Set"},
        0x04: {name: "UsersNumberGet"},
        0x05: {name: "UsersNumberReport"},
    }
});
exports.UserCodeCommand = UserCodeCommand;
let isUserCodeCommandValid = function(command) {
    return (this.UserCodeCommand.properties[command] !== undefined);
}

/* Version commands (version 2) */
let VersionCommand = Object.freeze({
    CommandClassGet: 0x13,
    CommandClassReport: 0x14,
    Get: 0x11,
    Report: 0x12,
    properties: {
        0x13: {name: "CommandClassGet"},
        0x14: {name: "CommandClassReport"},
        0x11: {name: "Get"},
        0x12: {name: "Report"},
    }
});
exports.VersionCommand = VersionCommand;
let isVersionCommandValid = function(command) {
    return (this.VersionCommand.properties[command] !== undefined);
}

/* WakeUp commands (version 2) */
let WakeUpCommand = Object.freeze({
    IntervalCapabilitiesGet: 0x09,
    IntervalCapabilitiesReport: 0x0a,
    IntervalGet: 0x05,
    IntervalReport: 0x06,
    IntervalSet: 0x04,
    NoMoreInformation: 0x08,
    Notification: 0x07,
    properties: {
        0x09: {name: "IntervalCapabilitiesGet"},
        0x0a: {name: "IntervalCapabilitiesReport"},
        0x05: {name: "IntervalGet"},
        0x06: {name: "IntervalReport"},
        0x04: {name: "IntervalSet"},
        0x08: {name: "NoMoreInformation"},
        0x07: {name: "Notification"},
    }
});
exports.WakeUpCommand = WakeUpCommand;
let isWakeUpCommandValid = function(command) {
    return (this.WakeUpCommand.properties[command] !== undefined);
}

/* WindowCovering commands (version 1) */
let WindowCoveringCommand = Object.freeze({
    SupportedGet: 0x01,
    SupportedReport: 0x02,
    Get: 0x03,
    Report: 0x04,
    Set: 0x05,
    StartLevelChange: 0x06,
    StopLevelChange: 0x07,
    properties: {
        0x01: {name: "SupportedGet"},
        0x02: {name: "SupportedReport"},
        0x03: {name: "Get"},
        0x04: {name: "Report"},
        0x05: {name: "Set"},
        0x06: {name: "StartLevelChange"},
        0x07: {name: "StopLevelChange"},
    }
});
exports.WindowCoveringCommand = WindowCoveringCommand;
let isWindowCoveringCommandValid = function(command) {
    return (this.WindowCoveringCommand.properties[command] !== undefined);
}

/* ZensorNet commands (version 1) */
let ZensorNetCommand = Object.freeze({
    BindAccept: 0x02,
    BindComplete: 0x03,
    BindRequest: 0x01,
    properties: {
        0x02: {name: "BindAccept"},
        0x03: {name: "BindComplete"},
        0x01: {name: "BindRequest"},
    }
});
exports.ZensorNetCommand = ZensorNetCommand;
let isZensorNetCommandValid = function(command) {
    return (this.ZensorNetCommand.properties[command] !== undefined);
}

/* Zip commands (version 3) */
let ZipCommand = Object.freeze({
    CommandZipPacket: 0x02,
    properties: {
        0x02: {name: "CommandZipPacket"},
    }
});
exports.ZipCommand = ZipCommand;
let isZipCommandValid = function(command) {
    return (this.ZipCommand.properties[command] !== undefined);
}

/* Zip6lowpan commands (version 1) */
let Zip6lowpanCommand = Object.freeze({
    LowpanFirstFragment: 0xc0,
    LowpanSubsequentFragment: 0xe0,
    properties: {
        0xc0: {name: "LowpanFirstFragment"},
        0xe0: {name: "LowpanSubsequentFragment"},
    }
});
exports.Zip6lowpanCommand = Zip6lowpanCommand;
let isZip6lowpanCommandValid = function(command) {
    return (this.Zip6lowpanCommand.properties[command] !== undefined);
}

/* ZipGateway commands (version 1) */
let ZipGatewayCommand = Object.freeze({
    GatewayModeSet: 0x01,
    GatewayModeGet: 0x02,
    GatewayModeReport: 0x03,
    GatewayPeerSet: 0x04,
    GatewayPeerGet: 0x05,
    GatewayPeerReport: 0x06,
    GatewayLockSet: 0x07,
    UnsolicitedDestinationSet: 0x08,
    UnsolicitedDestinationGet: 0x09,
    UnsolicitedDestinationReport: 0x0a,
    CommandApplicationNodeInfoSet: 0x0b,
    CommandApplicationNodeInfoGet: 0x0c,
    CommandApplicationNodeInfoReport: 0x0d,
    properties: {
        0x01: {name: "GatewayModeSet"},
        0x02: {name: "GatewayModeGet"},
        0x03: {name: "GatewayModeReport"},
        0x04: {name: "GatewayPeerSet"},
        0x05: {name: "GatewayPeerGet"},
        0x06: {name: "GatewayPeerReport"},
        0x07: {name: "GatewayLockSet"},
        0x08: {name: "UnsolicitedDestinationSet"},
        0x09: {name: "UnsolicitedDestinationGet"},
        0x0a: {name: "UnsolicitedDestinationReport"},
        0x0b: {name: "CommandApplicationNodeInfoSet"},
        0x0c: {name: "CommandApplicationNodeInfoGet"},
        0x0d: {name: "CommandApplicationNodeInfoReport"},
    }
});
exports.ZipGatewayCommand = ZipGatewayCommand;
let isZipGatewayCommandValid = function(command) {
    return (this.ZipGatewayCommand.properties[command] !== undefined);
}

/* ZipNaming commands (version 1) */
let ZipNamingCommand = Object.freeze({
    NameSet: 0x01,
    NameGet: 0x02,
    NameReport: 0x03,
    LocationSet: 0x04,
    LocationGet: 0x05,
    LocationReport: 0x06,
    properties: {
        0x01: {name: "NameSet"},
        0x02: {name: "NameGet"},
        0x03: {name: "NameReport"},
        0x04: {name: "LocationSet"},
        0x05: {name: "LocationGet"},
        0x06: {name: "LocationReport"},
    }
});
exports.ZipNamingCommand = ZipNamingCommand;
let isZipNamingCommandValid = function(command) {
    return (this.ZipNamingCommand.properties[command] !== undefined);
}

/* ZipNd commands (version 1) */
let ZipNdCommand = Object.freeze({
    ZipNodeSolicitation: 0x03,
    ZipInvNodeSolicitation: 0x04,
    ZipNodeAdvertisement: 0x01,
    properties: {
        0x03: {name: "ZipNodeSolicitation"},
        0x04: {name: "ZipInvNodeSolicitation"},
        0x01: {name: "ZipNodeAdvertisement"},
    }
});
exports.ZipNdCommand = ZipNdCommand;
let isZipNdCommandValid = function(command) {
    return (this.ZipNdCommand.properties[command] !== undefined);
}

/* ZipPortal commands (version 1) */
let ZipPortalCommand = Object.freeze({
    GatewayConfigurationSet: 0x01,
    GatewayConfigurationStatus: 0x02,
    GatewayConfigurationGet: 0x03,
    GatewayConfigurationReport: 0x04,
    properties: {
        0x01: {name: "GatewayConfigurationSet"},
        0x02: {name: "GatewayConfigurationStatus"},
        0x03: {name: "GatewayConfigurationGet"},
        0x04: {name: "GatewayConfigurationReport"},
    }
});
exports.ZipPortalCommand = ZipPortalCommand;
let isZipPortalCommandValid = function(command) {
    return (this.ZipPortalCommand.properties[command] !== undefined);
}

/* ZwaveplusInfo commands (version 2) */
let ZwaveplusInfoCommand = Object.freeze({
    Get: 0x01,
    Report: 0x02,
    properties: {
        0x01: {name: "Get"},
        0x02: {name: "Report"},
    }
});
exports.ZwaveplusInfoCommand = ZwaveplusInfoCommand;
let isZwaveplusInfoCommandValid = function(command) {
    return (this.ZwaveplusInfoCommand.properties[command] !== undefined);
}

