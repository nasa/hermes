import type { JSONSchema7 } from 'json-schema';


export function schemaSupportsGrid(schema: JSONSchema7): boolean {
    if (schema.type !== "object") {
        return schema.type !== "array";
    }

    for (const prop of Object.values(schema.properties ?? {})) {
        if (typeof prop === "object") {
            switch (prop.type) {
                case "array":
                case "object":
                    return false;
                case "boolean":
                case "integer":
                case "null":
                case "number":
                case "string":
                    break;
            }
        }
    }

    return true;
}
