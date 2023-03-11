// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerTextEditorCommand('chatgpt-documentation-assistant.commentCode', async (editor, edit) => {
		// Get selected code

		if (!editor) {
			// Nothing to do
			return;
		}

		const selection = editor.selection;

		if (!selection || selection.isEmpty) {
			// Nothing to do
			return;
		}
		
		const selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
		const highlighted = editor.document.getText(selectionRange);

		// TODO: implement API endpoint call to replace the code with the commented code

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
