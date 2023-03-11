import dotenv from "dotenv";
dotenv.config();
import * as fs from "fs";

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

    constructor() {
        this.configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        console.log("Constructor called!");
    }

    async handleCodeSnippet(request: HTTPRequest) {
        console.log(`Request received with simple text ${request.body}!`);

        const openai = new OpenAIApi(this.configuration);

        const startingPrompt =
            "Your task is to comment typescript code. You will receive just the snipper of code from now on, and you will place inline comments only where necessary to document the function. Do not add a comment on every line, only add comments where necessary, and make them inline. If the snippet of code is a function or a class definition, then you will also prepend the function with a JSDOC comment of the code.";

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

        console.log(returnedMsg);

        return {
            body: {
              content: returnedMsg?.content ?? 'ERROR'
            },
            headers: { "content-type": "application/json" },
            statusCode: 200,
        };
    }
}
