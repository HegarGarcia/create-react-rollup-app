export function findChunkWithName(bundle, name) {
  return Object.values(bundle).find((desc) =>
    (desc.facadeModuleId || "").endsWith(name)
  );
}
