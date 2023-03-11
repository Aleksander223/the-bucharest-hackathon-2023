import dotenv from 'dotenv';
dotenv.config();

import { Configuration, OpenAIApi } from "openai";

export class CodeCommenter {
    private readonly configuration: Configuration;

    constructor() {
        this.configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        console.log("Constructor called!");
    }

    /**
     * Method that returns a comment for a snippet of code.
     */
    async comment() {
        const openai = new OpenAIApi(this.configuration);

        const result = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: "Give me 5 fun party ideas",
                },
            ],
        });

        const returnedMsg = result.data.choices[0].message;

        console.log(returnedMsg);

        return returnedMsg;
    }

    /**
     * Method that returns a markdown documentation for a snippet of code
     */
    document() {
        return "Hello world!";
    }
}
