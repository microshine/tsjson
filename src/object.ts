import { JsonSchema } from "./decorators";

export class JsonObject {
    public static _json: JsonSchema;

    public static parse<T extends JsonObject>(this: { new(): T }, json: string): T {
        const data = JSON.parse(json);
        const res = (this as any).fromJSON(data);
        return res;
    }

    public static fromJSON<T extends JsonObject>(this: { new(): T }, obj: any) {
        const res = new this();
        res.fromJSON(obj);
        return res;
    }

    public fromJSON(obj: any) {
        if (!(obj instanceof Object)) {
            throw new Error("Cannot load Object from incoming data. Data is not an Object type");
        }

        const t = (this.constructor as typeof JsonObject);
        const schema = t._json;
        const that = this as { [key: string]: any };

        for (const key in schema.items) {
            if (!schema.items[key]) {
                continue;
            }
            const item = schema.items[key];
            if (item.required && !obj.hasOwnProperty(item.name)) {
                throw new Error(`Cannot load Object from JSON. Property \`${item.name}\` is required in schema \`${schema.name}\``);
            }
            if (obj.hasOwnProperty(item.name) || item.hasOwnProperty("defaultValue")) {
                const value = obj.hasOwnProperty(item.name!) ? obj[item.name!] : item.defaultValue;

                if (item.converter) {
                    that[key] = item.converter.parse(value);
                } else if (item.parser) {
                    that[key] = item.parser.fromJSON(value);
                } else  {
                    that[key] = value;
                }
            }
        }
    }

    public toJSON(): any {
        const t = (this.constructor as typeof JsonObject);
        const schema = t._json;
        const that = this as { [key: string]: any };
        const json: { [key: string]: any } = {};
        for (const key in schema.items) {
            if (!schema.items[key]) {
                continue;
            }
            const item = schema.items[key];
            if (!item.name) {
                item.name = key;
            }
            if (item.required && !this.hasOwnProperty(key)) {
                throw new Error(`Property \`${key}\` in \`${schema.name}\` schema is required, but this object doesn't have such property`);
            }
            if (
                !this.hasOwnProperty(key) || // undefined property
                item.hasOwnProperty("defaultValue") && item.defaultValue === that[key] // default value
            ) {
                continue;
            }
            if (item.converter) {
                json[item.name] = item.converter.stringify(that[key]);
            } else if (that[key] && that[key].toJSON) {
                json[item.name] = that[key].toJSON();
            } else {
                json[item.name] = that[key];
            }
        }
        return json;
    }

}
