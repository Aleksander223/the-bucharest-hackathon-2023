#! /usr/bin/env node

import { Command } from "commander";
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
    })

program.parse();