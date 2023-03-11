import execa from "execa";
import { exitWithError } from "../util";
import ora from "ora";
import * as path from "path";
import inquirer from 'inquirer';
import * as fs from "fs";

export async function doInit(initPath?: string) {
    const spinner = ora({
        color: 'cyan'
    }).start();
    try {
        const projectPath = initPath ?? './docs';
        {
            // Install docsify
            spinner.text = 'Installing docsify'
            const { exitCode } = await execa('npm', ['install', '-g', 'docsify']);

            if (exitCode) {
                exitWithError(new Error(`Could not install docsify. Exit code ${exitCode}`));
            }
        }

        {
            // docsify init
            spinner.text = 'Initializing docs folder'

            const alreadyExists = fs.existsSync(projectPath);

            if (alreadyExists) {
                exitWithError(new Error(`${projectPath} folder already exists`));
            }

            const { exitCode } = await execa('docsify', ['init', projectPath]);

            if (exitCode) {
                exitWithError(new Error(`Could not initialize docs folder. Exit code ${exitCode}`));
            }
        }

        {
            // Customize docs

            spinner.stop();

            const { projectName, github } = await inquirer.prompt([{
                message: 'Project name',
                type: 'input',
                name: 'projectName'
            }, {
                message: 'Github repo (@user/project)',
                type: 'input',
                name: 'github'
            }], {});

            spinner.start();
            spinner.text = 'Configuring';

            const indexFilePath = path.join(projectPath, 'index.html');

            const indexFile = (await fs.promises.readFile(indexFilePath)).toString();

            const updatedFile = indexFile.replace(/window.\$docsify = {\s*name: '',\s*repo: ''\s*}/g, `
                window.$docsify = {
                    name: '${projectName}',
                    repo: '${github}'
                }
            `);

            await fs.promises.writeFile(indexFilePath, updatedFile);
        }
    } catch (error) {
        if (error instanceof Error) {
            exitWithError(error);
        } else {
            exitWithError(new Error('Unknown error'));
        }
    } finally {
        spinner.stop();
    }
}