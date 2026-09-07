import { spawnSync } from 'child_process';

const args = process.argv.slice(2);
const target = args[0];

const prettierArgs = ['--write'];

if (target) {
  prettierArgs.push(target);
} else {
  prettierArgs.push('**/*.{js,jsx,ts,tsx,cjs,mjs,json,md}', '--ignore-path', '.prettierignore');
}

console.log(`Running: prettier ${prettierArgs.join(' ')}`);
spawnSync('prettier', prettierArgs, { stdio: 'inherit' });
