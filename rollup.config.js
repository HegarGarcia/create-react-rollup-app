import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import babel from "@rollup/plugin-babel";
import rimraf from "rimraf";
import postcss from "rollup-plugin-postcss";
import serve from "rollup-plugin-serve";
import createHTML from "./lib/create-html";
import image from "./lib/image-plugin";
import manifest from "./lib/manifest-plugin";

rimraf.sync("dist");

export default function ({ watch }) {
  return {
    input: { sw: "./src/sw/index.js", bootstrap: "./src/main/bootstrap.jsx" },
    output: {
      dir: "./build",
      format: "es",
      sourcemap: true,
    },
    plugins: [
      resolve({
        browser: true,
        extensions: [".js", ".jsx"],
      }),
      babel({ babelHelpers: "bundled" }),
      postcss({
        minimize: true,
        modules: true,
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify(
          process.env.NODE_ENV || "production"
        ),
      }),
      image(),
      commonjs(),
      manifest("./public/manifest.ejs"),
      createHTML("./public/index.ejs"),
      watch && serve({ contentBase: "build", port: 3000 }),
    ],
  };
}
