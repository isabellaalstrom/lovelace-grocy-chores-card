import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'grocy-chores-card.js',
  output: {
    dir: 'output',
    format: 'es'
  },
  plugins: [nodeResolve()]
};
