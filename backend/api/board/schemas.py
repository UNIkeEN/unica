PROPERTY_SCHEMA = {
    "type": "object",
    "properties": {
        "label": {
            "type": "object",
            "properties": {
                "type": {"type": "string", "enum": ["label"]},
                "name": {"type": "string"},
                "options": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "integer"},
                            "name": {"type": "string"},
                            "color": {
                                "type": "string",
                                "enum": ["gray", "red", "orange", "yellow", "green", "teal", "blue", "cyan", "purple", "pink"]
                            }
                        },
                        "required": ["id", "name", "color"]
                    }
                }
            },
            "required": ["type", "name", "options"]
        },
        "number": {
            "type": "object",
            "properties": {
                "type": {"type": "string", "enum": ["number"]},
                "name": {"type": "string"}
            },
            "required": ["type", "name"]
        }
    },
    "additionalProperties": False
}
