// rollup.config.mjs
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import pkg from './package.json' assert { type: 'json' };

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      sourcemap: true
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx'] // Add .ts and .tsx extensions
    }),
    commonjs(),
    babel({ 
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    })
  ],
  external: Object.keys(pkg.peerDependencies || {})
};
