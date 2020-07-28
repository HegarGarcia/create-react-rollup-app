import ejs from "ejs";
import { readFileSync } from "fs";

function renderAsset(templatePath) {
  const template = readFileSync(templatePath, { encoding: "utf8" });
  return ejs.render(template, { name: "React Rollup App" });
}

export default function manifestPlugin(input) {
  const output = "manifest.json";

  return {
    name: "manifest-plugin",
    buildStart() {
      this.addWatchFile(input);
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: output,
        source: renderAsset(input),
      });
    },
  };
}
