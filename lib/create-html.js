import { readFileSync } from "fs";
import ejs from "ejs";
import { findChunkWithName } from "./bundle-utils";

function generateHTML(bundle, templatePath) {
  const template = readFileSync(templatePath, { encoding: "utf8" });

  return ejs.render(template, {
    title: "React Rollup App",
    mainFile: findChunkWithName(bundle, "src/main/bootstrap.tsx").fileName,
  });
}

export default function createHTMLPlugin(templatePath) {
  return {
    name: "create-html-plugin",
    buildStart() {
      this.addWatchFile(templatePath);
    },
    generateBundle(_, bundle) {
      this.emitFile({
        type: "asset",
        fileName: "index.html",
        source: generateHTML(bundle, templatePath),
      });
    },
  };
}
