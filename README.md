[![VSCode](https://github.com/Aleksander223/the-bucharest-hackathon-2023/actions/workflows/vsix.yml/badge.svg)](https://github.com/Aleksander223/the-bucharest-hackathon-2023/actions/workflows/main.yml)

[![Cloud functions](https://github.com/Aleksander223/the-bucharest-hackathon-2023/actions/workflows/cloud-functions.yml/badge.svg)](https://github.com/Aleksander223/the-bucharest-hackathon-2023/actions/workflows/cloud-functions.yml)

[Official docs](https://aleksander223.github.io/the-bucharest-hackathon-2023/#/)

# DevDoc

> Simplify your documentation process with DevDoc

## Introduction

DevDoc is a set of developer tools that help you document codebases more efficiently. This repository comes with 2 tools: a **CLI** and a **VSCode Extension**. Both have the same purpose but achieve it in different ways. The extension helps you document snippets of code straight from the VS Code, while the CLI can create a Markdown Documentaiton using [Docsify](https://docsify.js.org/#/).

## How does this work?

DevDoc uses ChatGPT with custom prompts to get the documentation. The CLI uses a custom algorithm that maps the files to corresponding project folder structure, then uses ChatGPT to generate valid Markdown files. For scalability, the endpoints are hosted on server functions provided by [Genezio](https://genez.io/).

## Instalation steps

Here are some minimal installation steps to get you started.

### VSCode extension

As of now, the extension is not published on VScode marketplace, therefore you will have to install it manually.

1. Go to the latest [release page](https://github.com/Aleksander223/the-bucharest-hackathon-2023/releases/tag/v1.0.0) and download the `vsix` file.
2. Extract the vsix if it is zipped.
3. Open VSCode.
4. Go to extensions tab.
5. Click on the dots icon for more options and select `Install from VSIX`.
6. Select the file we have downloaded earlier

In order to use the extension, select a snippet of code and right click and choose `Comment code`. The extension will automatically update the selected code after a short bit. **Please be warned** that, at the moment, you should not change files or select something else, as the extension will not work properly. This is a *known issue* and will be fixed at a later date.

### CLI

As of now, the CLI is not published on npm, therefore you will have to install it manually. You can open a terminal and use the following commands:
```bash
git clone https://github.com/Aleksander223/the-bucharest-hackathon-2023

cd ./the-bucharest-hackathon-2023/cli

npm install

npm run build

npm install -g .
```
After these steps, the CLI will be able to be used globally. In order to test the installation, you can run:
```bash
cdac -v
```

#### Using the CLI

In order to use the CLI, you first have to initialize the docs folder. Please run:
```bash
cdac init [docsFolder]
```

This will initialize the docs folder at `docsFolder`. If no argument is passed it will by default initialize at `./docs`.

Then you have to generate the docs using the following command:

```bash
cdac generate <projectFolder> <docsFolder>
```

After a short while the documentation for `projectFolder` will be generated at `docsFolder`.

### Known Issues
* [VSCode] The code that is to be commented has to be kept highlighted while the command is running and the currently opened file should not be changed
* [CLI] The project folder should be at a separate level from the docs folder. Currently the CLI uses `glob` to get all of the files and it might accidentally include the docs folder as well.
