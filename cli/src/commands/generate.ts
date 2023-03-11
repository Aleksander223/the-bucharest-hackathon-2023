import { exitWithError } from "../util";
import ora from "ora";
import glob from 'glob'
import * as fs from 'fs';
import * as path from 'path';
import axios from "axios";

export async function doGenerate(projectPath: string, docsPath: string) {
    const projectFiles = [];
    const mdPaths: {
        title: string;
        path: string;
    }[] = [];

    const pathSegments = path.normalize(projectPath).split(path.sep);

    const spinner = ora({
        color: 'cyan'
    }).start();
    try {
        {
            // Map project files
            spinner.text = 'Mapping project files';
            projectFiles.push(...await glob(`${projectPath}/**/*.ts`));

            // Map files to docs
            for (const file of projectFiles) {
                // Remove base project path from file
                const resolvedFilePath = path.normalize(file).split(path.sep).filter(x => !(pathSegments.includes(x))).join(path.sep).replace('.ts', '.md');
                const filename = path.basename(resolvedFilePath).replace('.md', '');
                const resolvedFolder = path.dirname(resolvedFilePath);

                await fs.promises.mkdir(path.join(docsPath, resolvedFolder), {
                    recursive: true
                });

                await fs.promises.writeFile(path.join(docsPath, resolvedFilePath), `# ${filename}`);

                mdPaths.push({
                    path: resolvedFilePath,
                    title: filename
                });
            }

            mdPaths.sort((a, b) => {
                const aSegments = path.normalize(a.path).split(path.sep).slice(0, -1).length;
                const bSegments = path.normalize(a.path).split(path.sep).slice(0, -1).length;

                if (aSegments > bSegments) {
                    return 1;
                }

                if (aSegments === bSegments) {
                    return -a.path.localeCompare(b.path);
                }

                return -1;
            });
        }
        {
            spinner.text = 'Generating sidebar'
            const sidebarPath = path.join(path.resolve(docsPath, '_sidebar.md'));
            await fs.promises.writeFile(sidebarPath, "* Root\n");

            const didIdentifier = new Set<string>(['Root']);

            for (const md of mdPaths) {
                const mdSegments = path.normalize(md.path).split(path.sep).slice(0, -1);
                const identifier = mdSegments.at(-1) ?? 'Root';

                const tabs = '\t'.repeat(mdSegments.length);

                if (!didIdentifier.has(identifier)) {
                    didIdentifier.add(identifier);

                    await fs.promises.appendFile(sidebarPath, `${tabs}* ${identifier}\n`);
                }

                await fs.promises.appendFile(sidebarPath, `\t${tabs}* [${md.title}](${md.path})\n`);
            }
        }
        {
            // Generate docs
            spinner.text = 'Generating docs (this may take a while, depending on the project size. Please be patient 😄)'

            for (const file of projectFiles) {
                const content = (await fs.promises.readFile(path.resolve(file))).toString();

                const res = await axios.post('https://rqlkvmd5jubx6nzu2txhid3bom0modpq.lambda-url.us-east-1.on.aws/HttpServer/handleDocumentation', {
                    content: content
                });

                const markdownData = res.data.content;
                const resolvedFilePath = path.normalize(file).split(path.sep).filter(x => !(pathSegments.includes(x))).join(path.sep).replace('.ts', '.md');
                const mdPath = path.join(docsPath, resolvedFilePath);

                await fs.promises.appendFile(mdPath, `\n${markdownData}`);
            }     
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