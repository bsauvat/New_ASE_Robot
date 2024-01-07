import { ProgRobot } from '../language/semantic/visitor.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { RobotLanguageMetaData } from '../language/generated/module.js';
import { createRobotServices } from '../language/robot-module.js';
import { extractAstNode, extractDocument } from './cli-util.js';
import { generateArduinoCode, generateCommands } from '../generator/generator.js';
import { NodeFileSystem } from 'langium/node';
import * as url from 'node:url';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const packagePath = path.resolve(__dirname, '..', '..', 'package.json');
const packageContent = await fs.readFile(packagePath, 'utf-8');

export const compile = async (fileName: string): Promise<void> => {
    const services = createRobotServices(NodeFileSystem).Robot;
    const model = await extractAstNode<ProgRobot>(fileName, services);

    // Generate the Arduino code using the visitor
    const arduinoCode = generateArduinoCode(model);

    // Output the generated Arduino code
    console.log(arduinoCode);
};

export const parseAndValidate = async (fileName: string): Promise<void> => {
    const services = createRobotServices(NodeFileSystem).Robot;
    const document = await extractDocument(fileName, services);
    const parseResult = document.parseResult;
    if (parseResult.lexerErrors.length === 0 && 
        parseResult.parserErrors.length === 0
    ) {
        console.log(chalk.green(`Parsed and validated ${fileName} successfully!`));
    } else {
        console.log(chalk.red(`Failed to parse and validate ${fileName}!`));
    }
};

export const generateAst = async (fileName: string): Promise<void> => {
    const services = createRobotServices(NodeFileSystem).Robot;
    const model = await extractAstNode<ProgRobot>(fileName, services);
    // serialize & output the model ast
    const serializedAst = services.serializer.JsonSerializer.serialize(model, { sourceText: true, textRegions: true });
    console.log(serializedAst);
};

export const generateCmds = async (fileName: string): Promise<void> => {
    const services = createRobotServices(NodeFileSystem).Robot;
    const model = await extractAstNode<ProgRobot>(fileName, services);
    // directly output these commands to the console
    console.log(JSON.stringify(generateCommands(model)));
};

export type GenerateOptions = {
    destination?: string;
}

export default function(): void {
    const program = new Command();

    program.version(JSON.parse(packageContent).version);

    const fileExtensions = RobotLanguageMetaData.fileExtensions.join(', ');

    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .description('Generates a RobotDsl AST in JSON format')
        .action(generateAst);

    program
        .command('generate-cmds')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .description('Generates RobotDsl movement commands, suitable for consumption by a simple stack-based drawing machine')
        .action(generateCmds);

    program
        .command('parseAndValidate')
        .argument('<file>', 'Source file to parse & validate (ending in ${fileExtensions})')
        .description('Indicates where a program parses & validates successfully, but produces no output code')
        .action(parseAndValidate);

    program
        .command('compile') 
        .argument('<file>', `Source file to compile (ending in ${fileExtensions})`) 
        .description('Compiles the source file to Arduino code')
        .action(compile);

    program.parse(process.argv);

    
}
