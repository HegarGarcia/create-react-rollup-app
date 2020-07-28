import { spawn } from "child_process";
import { relative, join } from "path";
import { promises as fsp } from "fs";
import ts from "typescript";

const extRe = /\.tsx?$/;

function loadConfig(path) {
  const filename = ts.findConfigFile(path, ts.sys.fileExists);

  if (!filename) {
    throw new Error("No config file found!");
  }

  const text = ts.sys.readFile(filename);
  const loadedConfig = ts.parseConfigFileTextToJson(filename, text).config;
  const parsedConfig = ts.parseJsonConfigFileContent(
    loadedConfig,
    ts.sys,
    process.cwd(),
    undefined,
    filename
  );

  return parsedConfig;
}

export default function simpleTs({ path, watch } = {}) {
  const config = loadConfig(path);
  const args = ["-b", path];

  let done = Promise.resolve();

  if (!watch) {
    done = new Promise((resolve) => {
      const proc = spawn("tsc", args, {
        stdio: "inherit",
      });

      proc.on("exit", (code) => {
        if (code !== 0) {
          throw Error("Typescript failed");
        }

        resolve();
      });
    });
  }

  if (watch) {
    done.then(() => {
      spawn("tsc", [...args, "--watch", "--preserveWatchOutput"], {
        stdio: "inherit",
      });
    });
  }

  return {
    name: "simple-ts",
    buildStart: () => done,
    resolveId(id, importer) {
      if (!importer) {
        return null;
      }

      const tsResolve = ts.resolveModuleName(
        id,
        importer,
        config.options,
        ts.sys
      );

      if (
        !tsResolve.resolvedModule ||
        tsResolve.resolvedModule.extension === ".d.ts"
      ) {
        return null;
      }

      return tsResolve.resolvedModule.resolvedFileName;
    },
    load(id) {
      if (!extRe.test(id)) {
        return null;
      }

      const newId = join(
        config.options.outDir,
        relative(process.cwd(), id)
      ).replace(extRe, ".js");

      return fsp.readFile(newId, { encoding: "utf8" });
    },
  };
}
