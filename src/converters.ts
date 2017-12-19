import {Convert} from "pvtsutils";

export interface IConverter<T, J> {
    parse(value: J): T;
    stringify(value: T): J;
}

export const Base64Converter: IConverter<ArrayBuffer, string> = {
    parse: (value: string) =>
        Convert.FromBase64(value),
    stringify: (value: ArrayBuffer) =>
        Convert.ToBase64(value),
};

export const Base64UrlConverter: IConverter<ArrayBuffer, string> = {
    parse: (value: string) =>
        Convert.FromBase64Url(value),
    stringify: (value: ArrayBuffer) =>
        Convert.ToBase64Url(value),
};

export const DateConverter: IConverter<Date, number> = {
    parse: (value: number) =>
        new Date(value),
    stringify: (value: Date) =>
        value.getTime(),
};
