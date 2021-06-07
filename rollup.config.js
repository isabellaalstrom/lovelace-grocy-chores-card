import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: "src/index.js",
  output: {
    file: "dist/grocy-chores-card.js",
    format: "es",
  },
  plugins: [
    nodeResolve()
  ],
};