import dotenv from "dotenv";
dotenv.config();

import { Configuration, OpenAIApi } from "openai";

interface HTTPRequest {
    http: {
        method: string;
        path: string;
    };
    body: Record<string, any>;
}

export class HttpServer {
    private readonly configuration: Configuration;
    private readonly startingPromptSnippet: string;
    private readonly startingPromptDocumentation: string;

    constructor() {
        this.configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        // this.startingPrompt = "Your task is to comment typescript code. You will receive just the snipper of code from now on, and you will place inline comments only where necessary to document the function. Do not add a comment on every line, only add comments where necessary, and make them inline. If the snippet of code is a function or a class definition, then you will also prepend the function with a JSDOC comment of the code.";
        
        this.startingPromptSnippet = `You are now an exceptional code documentation tool created by the best programmers around the world. You are specialized in typescript and can understand even the context of the code provided. From now on, your task is to comment on incoming code snippets. 
        You will receive just the snippet of code and place inline comments only where necessary to document the function. Make sure your comments are readable and consider the whole snippet context, not just the explicit line, so just by reading your comments anyone can understand what the code is doing. Ignore console logs and try to be succinct but don’t miss important details.
        Do not comment on every line, only add comments where necessary, and make them inline. 
        Remember, do not comment on every line, only add comments where necessary! Otherwise, you will make me sad. 
        Try to use as little comments as possible but when neccesary provide enough details.
        Very important, if the code snippet is a function or a class definition, then you will also prepend the function with a JSDOC comment of the code!
        `

        this.startingPromptDocumentation = `
        You are now an exceptional code documentation tool created by the best programmers around the world. You are specialized in typescript and can understand even the context of the code provided. From now on, your task is to generate markdown documentation for the following typescript snippet of code.  
        Please note that the markdown should have the title of the function or class and should only have the following sections:
        signature, arguments, description, and notes.
        Headers should each have a capital letter, it should say if it's a function or class in the title.
        `
        
        console.log("Constructor called!");
    }

    async handleCodeSnippet(request: HTTPRequest) {
        const openai = new OpenAIApi(this.configuration);

        const startingPrompt = this.startingPromptSnippet;

        const codeSnippet = request.body.content;

        const result = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: startingPrompt,
                },
                {
                    role: "user",
                    content: codeSnippet,
                },
            ],
        });

        const returnedMsg = result.data.choices[0].message;

        return {
            body: {
              content: returnedMsg?.content ?? 'ERROR'
            },
            headers: { "content-type": "application/json" },
            statusCode: 200,
        };
    }

    async handleDocumentation(request: HTTPRequest) {
      const openai = new OpenAIApi(this.configuration);

      const startingPrompt = this.startingPromptDocumentation;

      const codeSnippet = request.body.content;

      const result = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
              {
                  role: "user",
                  content: startingPrompt,
              },
              {
                  role: "user",
                  content: codeSnippet,
              },
          ],
      });

      const returnedMsg = result.data.choices[0].message;

      return {
          body: {
            content: returnedMsg?.content ?? 'ERROR'
          },
          headers: { "content-type": "application/json" },
          statusCode: 200,
      };
  }
}
