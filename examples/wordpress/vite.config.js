// dedupe: handy-ds is linked from this repo (file:../..), so without it React would load twice
// (once from here, once from the repo root). A normal registry/tarball install doesn't need it.
export default { resolve: { dedupe: ['react', 'react-dom'] } };
