import { execSync } from 'child_process';

const args = process.argv.slice(2);
const target = args[0];

let command = 'prettier --write';

if (target) {
  command += ` "${target}"`;
} else {
  command +=
    ' "**/*.{js,jsx,ts,tsx,cjs,mjs,json,md}" --ignore-path .prettierignore';
}

console.log(`Running: ${command}`);
execSync(command, { stdio: 'inherit' });
