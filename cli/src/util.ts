import chalk from "chalk";

export async function exitWithError(error: Error) {
    console.error(chalk.red('\nERR!'), error.message);
    console.trace(error.stack);

    process.exit(1);
}