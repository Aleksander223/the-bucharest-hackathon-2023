import execa from "execa";
import { exitWithError } from "../util";
import ora from "ora";
import * as path from "path";
import inquirer from 'inquirer';
import * as fs from "fs";

/**
 * Initializes docs folder and customizes docs with user input
 * @param initPath (optional): path of the project to initialize. Default: './docs'
 */
export async function doInit(initPath?: string) {
    // Create spinner object
    const spinner = ora({
        color: 'cyan'
    }).start();
    try {
        // Set projectPath to provided initPath or './docs'
        const projectPath = initPath ?? './docs';

        // Install docsify
        {
            spinner.text = 'Installing docsify-cli';
            const { exitCode } = await execa('npm', ['install', '-g', 'docsify-cli']);

            if (exitCode) {
                // Exit if installation fails
                exitWithError(new Error(`Could not install docsify. Exit code ${exitCode}`));
            }
        }

        // Initialize docs folder
        {
            spinner.text = 'Initializing docs folder';

            const alreadyExists = fs.existsSync(projectPath);

            if (alreadyExists) {
                // Exit if folder already exists
                exitWithError(new Error(`${projectPath} folder already exists`));
            }

            const { exitCode } = await execa('docsify', ['init', projectPath]);

            if (exitCode) {
                // Exit if initialization fails
                exitWithError(new Error(`Could not initialize docs folder. Exit code ${exitCode}`));
            }
        }

        // Customize docs
        {
            spinner.stop();

            // Prompt user for project name and github repo
            const { projectName, github } = await inquirer.prompt([{
                message: 'Project name',
                type: 'input',
                name: 'projectName'
            }, {
                message: 'Github repo (@user/project)',
                type: 'input',
                name: 'github'
            }], {});

            // Configure project name and github repo in index.html file
            spinner.start();
            spinner.text = 'Configuring';

            const indexFilePath = path.join(projectPath, 'index.html');

            const indexFile = (await fs.promises.readFile(indexFilePath)).toString();

            // Update index.html file with user input
            const updatedFile = indexFile.replace(/window.\$docsify = {\s*name: '',\s*repo: ''\s*}/g, `
                window.$docsify = {
                    name: '${projectName}',
                    repo: '${github}',
                    loadSidebar: true
                }
            `);

            await fs.promises.writeFile(indexFilePath, updatedFile);
        }
    } catch (error) {
        if (error instanceof Error) {
            // Exit if an error occurred
            exitWithError(error);
        } else {
            exitWithError(new Error('Unknown error'));
        }
    } finally {
        // Stop spinner
        spinner.stop();
    }
}