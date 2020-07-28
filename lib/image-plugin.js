import { readFileSync } from "fs";
import { basename } from "path";

const imageRegexp = /\.(?:jpg|gif|png|jpeg|svg)/g;

export default function image() {
  return {
    name: "image-plugin",
    resolveId(id) {
      if (!imageRegexp.test(id)) {
        return null;
      }

      return id;
    },
    load(id) {
      if (!imageRegexp.test(id)) {
        return;
      }

      const image = readFileSync(id);

      const asset = this.emitFile({
        type: "asset",
        name: basename(id),
        source: image,
      });

      return `export default import.meta.ROLLUP_FILE_URL_${asset}`;
    },
  };
}
