declare namespace tsjson {

    interface IConverter<T, J> {
        parse(value: J): T;
        stringify(value: T): J;
    }

    export const Base64Converter: IConverter<ArrayBuffer, string>;
    export const Base64UrlConverter: IConverter<ArrayBuffer, string>;
    export const DateConverter: IConverter<Date, number>;

    interface JsonSchemaItem<T> {
        name?: string;
        required?: boolean;
        converter?: IConverter<T, any>;
        parser?: typeof JsonObject;
        defaultValue?: T;
        repeated?: boolean;
    }

    function Json(): <T extends typeof JsonObject>(target: T) => void;
    function JsonProperty(params?: JsonSchemaItem<any>): (target: JsonObject, propertyKey: string | symbol) => void;

    class JsonObject {
        public static parse<T extends JsonObject>(this: { new(): T }, json: string): T;
        public static fromJSON<T extends JsonObject>(this: { new(): T }, obj: any): T;

        public fromJSON(obj: any): void;
        public toJSON(): any;

    }

}

export = tsjson;
export as namespace tsjson;
