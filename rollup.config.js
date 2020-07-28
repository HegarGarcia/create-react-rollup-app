import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import rimraf from "rimraf";
import postcss from "rollup-plugin-postcss";
import serve from "rollup-plugin-serve";
import createHTML from "./lib/create-html";
import image from "./lib/image-plugin";
import manifest from "./lib/manifest-plugin";
import simpleTs from "./lib/simple-ts";

rimraf.sync("dist");

export default function ({ watch }) {
  return {
    input: { web: "./src/main/bootstrap.tsx", sw: "./src/sw/index.ts" },
    output: {
      dir: "./build",
      format: "es",
      sourcemap: true,
    },
    plugins: [
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
      resolve({
        extensions: [".js", ".ts", ".tsx"],
      }),
      commonjs(),
      simpleTs({ path: "src/main", watch }),
      manifest("./public/manifest.ejs"),
      createHTML("./public/index.ejs"),
      watch && serve({ contentBase: "build", port: 3000 }),
    ],
  };
}
