const typescript = require('@rollup/plugin-typescript');
const copy = require('rollup-plugin-copy');
const sourceMaps = require('rollup-plugin-sourcemaps');

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    sourcemap: true,
    format: 'iife',
    globals: {
      'pixi.js': 'PIXI',
    },
  },
  external: ['pixi.js'],
  plugins: [
    typescript({ sourceMap: false }),
    copy({ targets: [{ src: 'src/index.html', dest: 'dist' }] }),
    sourceMaps(),
  ],
  watch: {
    include: 'src/**',
  },
};
