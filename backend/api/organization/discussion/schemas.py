# schemas.py
CATEGORIES_SCHEMA = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": {"type": "integer"},
            "name": {"type": "string"},
            "color": {
                "type": "string",
                "enum": ["gray", "red", "orange", "yellow", "green", "teal", "blue", "cyan", "purple", "pink"]
            },
            "emoji": {"type": "string"}  # Added emoji field
        },
        "required": ["id", "name", "color"],  # emoji is not required
        "additionalProperties": False
    },
    "uniqueItems": True
}
