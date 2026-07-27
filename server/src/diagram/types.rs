use std::collections::HashMap;

use crate::{price::Service, service::Region};

pub struct Diagram {
    id: String,
    name: String,
    description: Option<String>,
    region: Region,
    nodes: Vec<CloudeNode>,
    connections: Vec<Connection>,
}

#[derive(Default)]
enum Status {
    #[default]
    Active,
    Inactive,
    Error,
}

pub struct CloudeNode {
    id: String,
    service_type: Service,
    name: String,
    x: f64,
    y: f64,
    properties: HashMap<String, String>,
    status: Status,
}

enum FromPort {
    Top,
    Bottom,
}
pub struct Connection {
    id: String,
    from: String, // CloudNode id
    to: String,   // CloudNode id
    from_port: FromPort,
    to_port: FromPort,
}
