#! /usr/bin/env node

import { Command } from "commander";
import { doGenerate } from "./commands/generate";
import { doInit } from "./commands/init";


const program = new Command();

program
    .version('1.0.0')
    .description('CLI for ChatGPT Docs Assistant');

program.command('init')
    .description('Initializes markdown documentation at path')
    .argument('[path]', 'Path where to initialize docs', './docs')
    .action((projectPath) => {
        doInit(projectPath);
    });

program.command('generate')
    .description('Generates markdown documentation for codebase')
    .argument('<projectPath>', 'Path of the project')
    .argument('<docsPath>', 'Path of the docs')
    .action((projectPath, docsPath) => {
        doGenerate(projectPath, docsPath);
    })

program.parse();