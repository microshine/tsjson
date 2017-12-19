import { assert } from "chai";
// import { Base64Converter, Base64UrlConverter, DateConverter, Json, JsonObject, JsonProperty } from "../src/index";
const { Base64Converter, Base64UrlConverter, DateConverter, Json, JsonObject, JsonProperty } = require("../build/index");

describe("JSON Object", () => {

    context("to/from", () => {

        it("parse wrong data", () => {
            @Json()
            class Test extends JsonObject {
                @JsonProperty()
                public name: string;
            }

            assert.throw(() => {
                Test.fromJSON(1);
            });
        });

        context("simple types", () => {

            it("string", () => {
                @Json()
                class Test extends JsonObject {
                    @JsonProperty()
                    public name: string;
                }
                const t = new Test();
                t.name = "Name";
                const json = `{"name":"Name"}`;
                assert.equal(JSON.stringify(t), json);

                const t2 = Test.parse(json);
                assert.equal(t2.name, t.name);
            });

            it("number", () => {
                @Json()
                class Test extends JsonObject {
                    @JsonProperty()
                    public code: number;
                }
                const t = new Test();
                t.code = 2;
                const json = `{"code":2}`;
                assert.equal(JSON.stringify(t), json);

                const t2 = Test.parse(json);
                assert.equal(t2.code, t.code);
            });

            it("boolean", () => {
                @Json()
                class Test extends JsonObject {
                    @JsonProperty()
                    public readWrite: boolean;
                }
                const t = new Test();
                t.readWrite = false;
                const json = `{"readWrite":false}`;
                assert.equal(JSON.stringify(t), json);

                const t2 = Test.parse(json);
                assert.equal(t2.readWrite, t.readWrite);
            });

        });

        context("converters", () => {

            it("Date", () => {
                @Json()
                class Test extends JsonObject {
                    @JsonProperty({ converter: DateConverter })
                    public time: Date;
                }

                const t = new Test();
                t.time = new Date();
                const json = JSON.stringify(t);

                const t2 = Test.parse(json);
                assert.equal(t.time.getTime(), t2.time.getTime());
            });

            it("base64", () => {
                @Json()
                class Test extends JsonObject {
                    @JsonProperty({ converter: Base64Converter })
                    public e: ArrayBuffer;
                }

                const t = new Test();
                t.e = new Uint8Array([3]).buffer;
                const json = JSON.stringify(t);
                assert.equal(json, `{"e":"Aw=="}`);

                const t2 = Test.parse(json);
                assert.equal(t.e.byteLength, t2.e.byteLength);
            });

            it("base64url", () => {
                @Json()
                class Test extends JsonObject {
                    @JsonProperty({ converter: Base64UrlConverter })
                    public e: ArrayBuffer;
                }

                const t = new Test();
                t.e = new Uint8Array([3]).buffer;
                const json = JSON.stringify(t);
                assert.equal(json, `{"e":"Aw"}`);

                const t2 = Test.parse(json);
                assert.equal(t.e.byteLength, t2.e.byteLength);
            });

        });

        context("params", () => {

            it("name", () => {
                @Json()
                class Test extends JsonObject {
                    @JsonProperty({ name: "n" })
                    public name: string;
                }
                const t = new Test();
                t.name = "Name";
                const json = `{"n":"Name"}`;
                assert.equal(JSON.stringify(t), json);

                const t2 = Test.parse(json);
                assert.equal(t2.name, t.name);
            });

            it("defaultValue", () => {

                @Json()
                class Test extends JsonObject {
                    @JsonProperty({ defaultValue: 1 })
                    public version: number;

                    @JsonProperty({ defaultValue: 12 })
                    public age = 13;

                    @JsonProperty({ defaultValue: 0 })
                    public code: number;
                }
                const t = new Test();
                t.code = 0;
                const json = `{"age":13}`;
                assert.equal(JSON.stringify(t), json);

                const t2 = Test.parse(json);
                assert.equal(t2.version, 1);
                assert.equal(t2.age, 13);
                assert.equal(t2.code, 0);

            });

            context("required", () => {

                it("error", () => {
                    @Json()
                    class Test extends JsonObject {
                        @JsonProperty({ required: true })
                        public name: string;
                    }
                    const t = new Test();

                    assert.throw(() => {
                        JSON.stringify(t);
                    });

                    assert.throw(() => {
                        Test.parse("{}");
                    });
                });

                it("common", () => {
                    @Json()
                    class Test extends JsonObject {
                        @JsonProperty({ required: true })
                        public name: string;
                    }
                    const t = new Test();
                    t.name = "Name";

                    const json = `{"name":"Name"}`;
                    assert.equal(JSON.stringify(t), json);

                    const t2 = Test.parse(json);
                    assert.equal(t.name, t2.name);
                });

            });

            context("parser", () => {

                it("common", () => {
                    @Json()
                    class Name extends JsonObject {
                        @JsonProperty({ name: "f" })
                        public firstName: string;

                        @JsonProperty({ name: "s" })
                        public surname: string;
                    }
                    @Json()
                    class Person extends JsonObject {
                        @JsonProperty({ parser: Name })
                        public name = new Name();
                    }
                    const t = new Person();
                    t.name.firstName = "fName";
                    t.name.surname = "sName";
                    const json = `{"name":{"f":"fName","s":"sName"}}`;
                    assert.equal(JSON.stringify(t), json);

                    const t2 = Person.parse(json);
                    assert.equal(t2.name.firstName, t.name.firstName);
                    assert.equal(t2.name.surname, t.name.surname);
                });

                it("optional", () => {
                    @Json()
                    class Name extends JsonObject {
                        @JsonProperty({ name: "f" })
                        public firstName: string;

                        @JsonProperty({ name: "s" })
                        public surname: string;
                    }
                    @Json()
                    class Person extends JsonObject {
                        @JsonProperty({ parser: Name })
                        public name: Name;
                    }
                    const t = new Person();
                    const json = `{}`;
                    assert.equal(JSON.stringify(t), json);

                    const t2 = Person.parse(json);
                    assert.equal(t2.name, undefined);
                });

            });

        });

        it("extends", () => {

            @Json()
            class Parent extends JsonObject {
                @JsonProperty()
                public version = 1;
            }

            @Json()
            class Child extends Parent {
                @JsonProperty()
                public name: string;
            }
            const t = new Child();
            t.name = "Name";
            const json = `{"version":1,"name":"Name"}`;
            assert.equal(JSON.stringify(t), json);

            const t2 = (Child as any).parse(json);
            assert.equal(t2.name, t.name);

        });

    });

});
