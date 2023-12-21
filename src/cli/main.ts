import type { ProgRobot } from '../language/generated/ast.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { RobotLanguageMetaData } from '../language/generated/module.js';
import { createRobotServices } from '../language/robot-module.js';
import { extractAstNode } from './cli-util.js';
import { generateJavaScript } from './generator.js';
import { NodeFileSystem } from 'langium/node';
import { createDocumentFromString } from '../web/websocket/utils.js';
import { wsServer } from '../web/app.js';

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createRobotServices(NodeFileSystem).Robot;
    const model = await extractAstNode<ProgRobot>(fileName, services);
    const generatedFilePath = generateJavaScript(model, fileName, opts.destination);
    console.log(chalk.green(`JavaScript code generated successfully: ${generatedFilePath}`));
};

export const parseAndValidate = async (code: string): Promise<void> => {

    

    const contentToParse = await createDocumentFromString(code);

    const parseResult = contentToParse.parseResult;
    // verify no lexer, parser, or general diagnostic errors show up
    if (parseResult.lexerErrors.length === 0 && 
        parseResult.parserErrors.length === 0
    ) {

        console.log(chalk.green(`Parsed and validated successfully!`));
        wsServer.emitParsedAndValidated(true);
    } else {
        console.log(chalk.red(`Failed to parse and validate !`));
        wsServer.emitParsedAndValidated(false);
    }
}

export type GenerateOptions = {
    destination?: string;
}

export default function(): void {
    const program = new Command();

    program
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        .version(require('../../package.json').version);

    const fileExtensions = RobotLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('generates JavaScript code that prints "Hello, {name}!" for each greeting in a source file')
        .action(generateAction);

    program.parse(process.argv);
}
