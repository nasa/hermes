use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;
use std::collections::HashMap;

/// Root FPrime dictionary structure
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FPrimeDictionary {
    pub metadata: Option<Metadata>,
    pub type_definitions: Option<Vec<TypeDefinition>>,
    pub commands: Option<Vec<Command>>,
    pub parameters: Option<Vec<Parameter>>,
    pub events: Option<Vec<Event>>,
    pub telemetry_channels: Option<Vec<TelemetryChannel>>,
    pub records: Option<Vec<Record>>,
    pub containers: Option<Vec<Container>>,
    pub telemetry_packet_sets: Option<Vec<TelemetryPacketSet>>,
    pub constants: Option<Vec<Constant>>,
}

#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Metadata {
    pub deployment_name: Option<String>,
    pub framework_version: Option<String>,
    pub project_version: Option<String>,
    pub library_versions: Option<Vec<String>>,
    pub dictionary_spec_version: Option<String>,
}

#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "kind", rename_all = "lowercase")]
pub enum TypeDefinition {
    Array {
        #[serde(rename = "qualifiedName")]
        qualified_name: String,
        size: f64,
        #[serde(rename = "elementType")]
        element_type: TypeDescriptor,
        default: serde_json::Value,
        annotation: Option<String>,
    },
    Enum {
        #[serde(rename = "qualifiedName")]
        qualified_name: String,
        #[serde(rename = "representationType")]
        representation_type: TypeDescriptor,
        #[serde(rename = "enumeratedConstants")]
        enumerated_constants: Vec<EnumeratedConstant>,
        default: String,
        annotation: Option<String>,
    },
    Struct {
        #[serde(rename = "qualifiedName")]
        qualified_name: String,
        members: HashMap<String, StructMember>,
        default: serde_json::Value,
        annotation: Option<String>,
    },
    Alias {
        #[serde(rename = "qualifiedName")]
        qualified_name: String,
        #[serde(rename = "type")]
        type_: TypeDescriptor,
        #[serde(rename = "underlyingType")]
        underlying_type: TypeDescriptor,
        annotation: Option<String>,
    },
}

#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TypeDescriptor {
    pub name: String,
    pub kind: TypeKind,
    pub size: Option<f64>,
    pub signed: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum TypeKind {
    Integer,
    Float,
    Bool,
    String,
    QualifiedIdentifier,
}

#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EnumeratedConstant {
    pub name: String,
    pub value: f64,
    pub annotation: Option<String>,
}

#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StructMember {
    #[serde(rename = "type")]
    pub type_: TypeDescriptor,
    pub index: i32,
    pub size: Option<u64>,
    pub format: Option<String>,
    pub annotation: Option<String>,
}

#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FormalParameter {
    pub name: String,
    #[serde(rename = "type")]
    pub type_: TypeDescriptor,
    #[serde(rename = "ref")]
    pub ref_: bool,
    pub annotation: Option<String>,
}

#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Command {
    pub name: String,
    pub command_kind: String,
    pub opcode: u64,
    pub formal_params: Vec<FormalParameter>,
    pub annotation: Option<String>,
    pub priority: Option<u64>,
    pub queue_full_behavior: Option<QueueFullBehavior>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum QueueFullBehavior {
    Assert,
    Block,
    Drop,
}

#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Parameter {
    pub name: String,
    #[serde(rename = "type")]
    pub type_: TypeDescriptor,
    pub id: u64,
    pub annotation: Option<String>,
    pub default: Option<serde_json::Value>,
}

#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Event {
    pub name: String,
    pub severity: Severity,
    pub formal_params: Vec<FormalParameter>,
    pub id: u64,
    pub annotation: Option<String>,
    pub format: Option<String>,
    pub throttle: Option<Throttle>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Severity {
    ActivityHi,
    ActivityLo,
    Command,
    Diagnostic,
    Fatal,
    WarningHi,
    WarningLo,
}

#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Throttle {
    pub count: Option<u32>,
    pub interval: Option<ThrottleInterval>,
}

#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ThrottleInterval {
    pub seconds: Option<u32>,
    pub useconds: Option<u32>,
}

#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TelemetryChannel {
    pub name: String,
    #[serde(rename = "type")]
    pub type_: TypeDescriptor,
    pub id: u64,
    pub telemetry_update: TelemetryUpdate,
    pub annotation: Option<String>,
    pub format: Option<String>,
    pub limit: Option<Limit>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum TelemetryUpdate {
    Always,
    #[serde(rename = "on change")]
    OnChange,
}

#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Limit {
    pub high: Option<LimitValues>,
    pub low: Option<LimitValues>,
}

#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LimitValues {
    pub yellow: Option<f64>,
    pub orange: Option<f64>,
    pub red: Option<f64>,
}

#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Record {
    pub name: String,
    #[serde(rename = "type")]
    pub type_: TypeDescriptor,
    pub id: u64,
    pub annotation: Option<String>,
    pub array: Option<bool>,
}

#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Container {
    pub name: String,
    pub id: u64,
    pub annotation: Option<String>,
    pub default_priority: Option<u64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TelemetryPacketSet {
    pub name: String,
    pub members: Vec<TelemetryPacket>,
    pub omitted: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TelemetryPacket {
    pub name: String,
    pub id: u64,
    pub group: u64,
    pub members: Vec<String>,
}

#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Constant {
    pub kind: String,
    pub qualified_name: String,
    #[serde(rename = "type")]
    pub type_: TypeDescriptor,
    pub value: serde_json::Value,
    pub annotation: Option<String>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_deserialize_dictionary() {
        let json = r#"{
            "metadata": {
                "deploymentName": "TestDeployment",
                "frameworkVersion": "3.0.0"
            },
            "commands": [
                {
                    "name": "TestCommand",
                    "commandKind": "async",
                    "opcode": 1,
                    "formalParams": []
                }
            ]
        }"#;

        let dict: FPrimeDictionary = serde_json::from_str(json).unwrap();
        assert_eq!(
            dict.metadata
                .as_ref()
                .unwrap()
                .deployment_name
                .as_ref()
                .unwrap(),
            "TestDeployment"
        );
    }

    #[test]
    fn test_comprehensive_schema() {
        let json = r#"{
            "metadata": {
                "deploymentName": "Test",
                "frameworkVersion": "3.0",
                "projectVersion": "1.0",
                "libraryVersions": ["lib1"],
                "dictionarySpecVersion": "1.0"
            },
            "typeDefinitions": [
                {
                    "kind": "array",
                    "qualifiedName": "TestArray",
                    "size": 10,
                    "elementType": {
                        "name": "U32",
                        "kind": "integer",
                        "size": 32,
                        "signed": false
                    },
                    "default": [],
                    "annotation": "Test array"
                },
                {
                    "kind": "enum",
                    "qualifiedName": "TestEnum",
                    "representationType": {
                        "name": "U8",
                        "kind": "integer"
                    },
                    "enumeratedConstants": [
                        {
                            "name": "VALUE1",
                            "value": 0,
                            "annotation": "First value"
                        }
                    ],
                    "default": "VALUE1",
                    "annotation": "Test enum"
                },
                {
                    "kind": "struct",
                    "qualifiedName": "TestStruct",
                    "members": {
                        "field1": {
                            "type": {
                                "name": "U32",
                                "kind": "integer"
                            },
                            "index": 0,
                            "size": 4,
                            "format": "%d",
                            "annotation": "Field 1"
                        }
                    },
                    "default": {}
                },
                {
                    "kind": "alias",
                    "qualifiedName": "TestAlias",
                    "type": {
                        "name": "U32",
                        "kind": "integer"
                    },
                    "underlyingType": {
                        "name": "U32",
                        "kind": "integer"
                    }
                }
            ],
            "commands": [
                {
                    "name": "TestCmd",
                    "commandKind": "async",
                    "opcode": 1,
                    "formalParams": [
                        {
                            "name": "param1",
                            "type": {
                                "name": "U32",
                                "kind": "integer"
                            },
                            "ref": false,
                            "annotation": "Parameter 1"
                        }
                    ],
                    "annotation": "Test command",
                    "priority": 10,
                    "queueFullBehavior": "drop"
                }
            ],
            "parameters": [
                {
                    "name": "TestParam",
                    "type": {
                        "name": "U32",
                        "kind": "integer"
                    },
                    "id": 1,
                    "annotation": "Test parameter",
                    "default": 42
                }
            ],
            "events": [
                {
                    "name": "TestEvent",
                    "severity": "WARNING_HI",
                    "formalParams": [],
                    "id": 1,
                    "annotation": "Test event",
                    "format": "Test: %d",
                    "throttle": {
                        "count": 5,
                        "interval": {
                            "seconds": 1,
                            "useconds": 500000
                        }
                    }
                }
            ],
            "telemetryChannels": [
                {
                    "name": "TestChannel",
                    "type": {
                        "name": "F32",
                        "kind": "float"
                    },
                    "id": 1,
                    "telemetryUpdate": "on change",
                    "annotation": "Test channel",
                    "format": "%.2f",
                    "limit": {
                        "high": {
                            "yellow": 75.0,
                            "orange": 85.0,
                            "red": 95.0
                        },
                        "low": {
                            "yellow": 25.0
                        }
                    }
                }
            ],
            "records": [
                {
                    "name": "TestRecord",
                    "type": {
                        "name": "TestStruct",
                        "kind": "qualifiedIdentifier"
                    },
                    "id": 1,
                    "annotation": "Test record",
                    "array": true
                }
            ],
            "containers": [
                {
                    "name": "TestContainer",
                    "id": 1,
                    "annotation": "Test container",
                    "defaultPriority": 50
                }
            ],
            "telemetryPacketSets": [
                {
                    "name": "TestPacketSet",
                    "members": [
                        {
                            "name": "Packet1",
                            "id": 1,
                            "group": 1,
                            "members": ["TestChannel"]
                        }
                    ],
                    "omitted": ["Packet2"]
                }
            ]
        }"#;

        let dict: FPrimeDictionary = serde_json::from_str(json).unwrap();

        // Verify metadata
        let metadata = dict.metadata.as_ref().unwrap();
        assert_eq!(metadata.deployment_name.as_ref().unwrap(), "Test");
        assert_eq!(metadata.framework_version.as_ref().unwrap(), "3.0");
        assert_eq!(metadata.library_versions.as_ref().unwrap().len(), 1);

        // Verify type definitions
        let type_defs = dict.type_definitions.as_ref().unwrap();
        assert_eq!(type_defs.len(), 4);

        // Check array variant
        if let TypeDefinition::Array {
            qualified_name,
            size,
            annotation,
            ..
        } = &type_defs[0]
        {
            assert_eq!(qualified_name, "TestArray");
            assert_eq!(*size, 10.0);
            assert_eq!(annotation.as_ref().unwrap(), "Test array");
        } else {
            panic!("Expected Array variant");
        }

        // Check enum variant
        if let TypeDefinition::Enum {
            qualified_name,
            enumerated_constants,
            ..
        } = &type_defs[1]
        {
            assert_eq!(qualified_name, "TestEnum");
            assert_eq!(enumerated_constants[0].name, "VALUE1");
        } else {
            panic!("Expected Enum variant");
        }

        // Check struct variant
        if let TypeDefinition::Struct {
            qualified_name,
            members,
            ..
        } = &type_defs[2]
        {
            assert_eq!(qualified_name, "TestStruct");
            assert!(members.contains_key("field1"));
        } else {
            panic!("Expected Struct variant");
        }

        // Check alias variant
        if let TypeDefinition::Alias { qualified_name, .. } = &type_defs[3] {
            assert_eq!(qualified_name, "TestAlias");
        } else {
            panic!("Expected Alias variant");
        }

        // Verify commands
        let commands = dict.commands.as_ref().unwrap();
        assert_eq!(commands[0].name, "TestCmd");
        assert_eq!(commands[0].priority.unwrap(), 10);

        // Verify events with throttle
        let events = dict.events.as_ref().unwrap();
        let throttle = events[0].throttle.as_ref().unwrap();
        assert_eq!(throttle.count.unwrap(), 5);
        assert_eq!(throttle.interval.as_ref().unwrap().seconds.unwrap(), 1);

        // Verify telemetry channels with limits
        let channels = dict.telemetry_channels.as_ref().unwrap();
        let limit = channels[0].limit.as_ref().unwrap();
        assert_eq!(limit.high.as_ref().unwrap().yellow.unwrap(), 75.0);
        assert_eq!(limit.low.as_ref().unwrap().yellow.unwrap(), 25.0);

        // Verify telemetry packet sets
        let packet_sets = dict.telemetry_packet_sets.as_ref().unwrap();
        assert_eq!(packet_sets[0].members[0].name, "Packet1");
        assert_eq!(packet_sets[0].omitted[0], "Packet2");
    }
}
