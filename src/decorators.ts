import { IConverter } from "./converters";
import { assign } from "./helper";
import { JsonObject } from "./object";

export interface JsonSchemaItem<T> {
    name?: string;
    required?: boolean;
    converter?: IConverter<T, any>;
    parser?: typeof JsonObject;
    defaultValue?: T;
    repeated?: boolean;
}

export interface JsonSchema {
    name: string;
    target: typeof JsonObject;
    items: {
        [key: string]: JsonSchemaItem<any>;
    };
}

export function Json() {
    return <T extends typeof JsonObject>(target: T) => {
        const className = /function ([\w\d\$\_]+)/i.exec(target.toString());
        if (!className) {
            throw new Error(`Cannot get name for object '${target.toString()}'`);
        }
        target._json.name = className[1];
    };
}

export function JsonProperty(params: JsonSchemaItem<any> = { required: false }) {
    return (target: JsonObject, propertyKey: string | symbol) => {
        const t = target.constructor as typeof JsonObject;
        const key = propertyKey as string;

        if (!t._json) {
            t._json = {
                name: "Object",
                target: t,
                items: {},
            };
        }

        if (t._json.target !== t) {
            t._json = assign({}, t._json);
            t._json.items = assign({}, t._json.items);
        }

        t._json.items[propertyKey] = params;
        t._json.items[propertyKey].name = params.name || key;
    };
}
