import nodeResolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript";

const includeDeps = !!process.env.INCLUDE_DEPS;
const pkg = require("./package.json");
const external = includeDeps ? [] : Object.keys(pkg.dependencies);

export default {
    input: "src/index.ts",
    plugins: [
        typescript({ typescript: require("typescript"), target: "es5" }),
        nodeResolve({ jsnext: true, main: true }),
    ],
    output: [
        {
            file: `build/${includeDeps ? "tsjson" : "index"}.js`,
            format: includeDeps ? "umd" : "cjs",
            name: "tsjson",
        }
    ],
    external
};