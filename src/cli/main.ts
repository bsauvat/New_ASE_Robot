import type { ProgRobot } from '../language/generated/ast.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { RobotLanguageMetaData } from '../language/generated/module.js';
import { createRobotServices } from '../language/robot-module.js';
import { extractAstNode } from './cli-util.js';
import { generateCommands } from '../generator/generator.js';
import { NodeFileSystem } from 'langium/node';
import { createDocumentFromString } from '../web/websocket/utils.js';
import { wsServer } from '../web/app.js';
import { extractDestinationAndName } from './cli-util.js';
import path from 'path';
import fs from 'fs';

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createRobotServices(NodeFileSystem).Robot;
    const model = await extractAstNode<ProgRobot>(fileName, services);

    // invoke generator to get commands
    const cmds = generateCommands(model);

    // handle file related functionality here now
    const data = extractDestinationAndName(fileName, opts.destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.json`;
    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, JSON.stringify(cmds, undefined, 2));

    console.log(chalk.green(`MiniLogo commands generated successfully: ${generatedFilePath}`));
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
