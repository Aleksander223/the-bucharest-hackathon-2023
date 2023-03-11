# Nume bomba
Understand, comment and documment your code with 0 effort

## Why you should consider us
As engineers working with web development and AI, we stumble quite often over code written by our beloved collages that seem to be closer to hieroglyphs than typescript or python. Let’s not even talk about junior onboarding.

"Cool name" helps you comment your code when you just don't have time for it or want to get the bigger picture. 
You can just select a code snippet and comment it or even add it to a markdown documentation to be overviewed later by fellow team members and help you remember what you commited yesterday.

# Seemless setup
#### VS Code Extension
Just grab the latest patch and add it to your github extensions with drag and drop.

Now you should be able to select a code snipped, right click and select the last option "comment code". After some seconds, your code will be commented without breaking anything.
https://github.com/Aleksander223/the-bucharest-hackathon-2023/actions/runs/4394052391

#### CLI 

## How we buit it

### Genezio 
We start by configuring a Genezio server to host our cloud functions that get the selected snippet, sends it to ChatGPT with some engineered prompts, and return the commented block. We went for a HTTP Server aproach that is fully suported by Genezio.

### CI/CD with Github
In order to automate all our tasks we opted for Github actions, granting us the possibility of having a secured and always ready-to-go application.

### Breakdown of our implementation
#### aici scrie adam imaginea de ansamblu (de aici luam cod, trimitem asa dincolo, ala scoate functiile, etc)

#### Class HttpServer

##### Signature
```typescript
export class HttpServer {
    private readonly configuration: Configuration;
    private readonly startingPromptSnippet: string;
    private readonly startingPromptDocumentation: string;

    constructor();

    async handleCodeSnippet(request: HTTPRequest);

    async handleDocumentation(request: HTTPRequest);
}
```

##### Arguments
- `request`: an HTTP request object with a `body` property that contains the code snippet as a string.

##### Description
The `HttpServer` class is responsible for handling two types of requests, code snippets and documentation. For code snippets, it uses OpenAI's GPT-3.5 Turbo model to generate comments for the code based on a starting prompt. For documentation, it generates a markdown file with the signature, arguments, description and notes sections for the provided code.

##### Notes
- This class requires an API key from OpenAI to use the GPT-3.5 Turbo model.
- The `handleCodeSnippet` method uses the `startingPromptSnippet` property as a starting prompt for the GPT-3.5 Turbo model.
- The `handleDocumentation` method uses the `startingPromptDocumentation` property as a starting prompt for the GPT-3.5 Turbo model.

#### Function: activate

##### Signature:
```typescript
export function activate(context: vscode.ExtensionContext): void
```

##### Arguments:
- `context` _(vscode.ExtensionContext)_: The context of the extension being activated.

##### Description:
This function is called when the VS Code extension is activated for the first time, and registers the `chatgpt-documentation-assistant.commentCode` command with the `vscode` library.

##### Notes:
- The `registerTextEditorCommand` method is used from the `vscode` library to register the `chatgpt-documentation-assistant.commentCode` command, which takes a `TextEditor` object and an `Edit` object as input.
- The `TextEditor` object represents the currently active text editor in VS Code, while the `Edit` object enables the modification of the editor's document.
- The `commands` and `subscriptions` properties of the `context` object are also populated with the newly-registered command. 

#### Function: deactivate

##### Signature:
```typescript
export function deactivate(): void
```

##### Description:
This function is called when the extension is deactivated.

##### Notes:
- The function currently has no implementation beyond its definition.