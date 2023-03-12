# CLI

The cli can be accessed by using `cdac` in a terminal.

## Options

```
    -V, --version                      output the version number
    -h, --help                         display help for command
```

## Commands overview

```
    init [path]                        Initializes markdown documentation at path
    generate <projectPath> <docsPath>  Generates markdown documentation for codebase
    help [command]                     display help for command
```

### Init

```
Usage: cdac init [options] [path]

Initializes markdown documentation at path

Arguments:
  path        Path where to initialize docs (default: "./docs")

Options:
  -h, --help  display help for command
```

### Generate

```
Usage: cdac generate [options] <projectPath> <docsPath>

Generates markdown documentation for codebase

Arguments:
  projectPath  Path of the project
  docsPath     Path of the docs

Options:
  -h, --help   display help for command
```