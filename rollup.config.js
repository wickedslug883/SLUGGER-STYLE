import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';

export default {
  input: 'main.js', // Point this to where you placed main.js
  output: {
    file: 'dist/slugger.min.js',
    format: 'iife', // Immediately Invoked Function Expression format
    sourcemap: true,
  },
  plugins: [
    resolve(),
    terser(), // Minify JS
    postcss({
        extract: 'dist/slugger.min.css', 
        minimize: true,
        plugins: [postcssImport()],
        input: 'slugger.css',
        inject: false,  // Explicitly mention this
     }),
  ],
};
