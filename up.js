import { exec } from 'child_process'

const username = 'Rifza123';
const password = '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';
const repo = 'Experimental-Bell'
const repoUrl = `github.com/${username}/${repo}.git`

const execute = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.warn(`Stderr: ${stderr}`);
      }
      resolve(stdout);
    });
  });
};

const push = async () => {
  try {
    await execute('git add .');
    console.log(await execute('git commit -m "zh"'));
    console.log(await execute('git branch -M master'));
    console.log(await execute(`git push https://${username}:${password}@${repoUrl} master --force`));
    console.log('Commands executed successfully');
  } catch (error) {
    console.error(`Failed to execute commands: ${error}`);
  }
};

push();