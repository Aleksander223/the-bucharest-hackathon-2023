# Implementation

## Genezio 
We start by configuring a Genezio server to host our cloud functions that get the selected snippet, sends it to ChatGPT with some engineered prompts, and return the commented block. We went for a HTTP Server aproach that is fully suported by Genezio.

## CI/CD with Github
In order to automate all our tasks we opted for Github actions, granting us the possibility of having a secured and always ready-to-go application.

## VSCode Extension
We have created a simple VSCode extenson that uses the genezio endpoint described above to comment code snippets. It uses the editor API to get the currently selected text and it requests the endpoint using `axios`, then updates the highlighted code with the one commented by ChatGPT.

## CLI
The CLI is written using `commander` and uses `docsify` in order to generate markdown docs. After initializing a documentation repository, the CLI can generate a scoped markdown documentation site by using our genezio endpoint. A custom ChatGPT prompt is used to provide full context of the documented file. The files are then written, and the sidebar is generated.
