import { ProgRobot } from '../language/visitor.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { RobotLanguageMetaData } from '../language/generated/module.js';
import { createRobotServices } from '../language/robot-module.js';
import { extractAstNode/*, extractDocument*/ } from './cli-util.js';
import { NodeFileSystem } from 'langium/node';
import { createDocumentFromString } from '../web/websocket/utils.js';
import { wsServer } from '../web/app.js';
import { writeAst, generateJavaScript } from './generator.js';
import { interpret } from '../semantic/interpreter.js'

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createRobotServices(NodeFileSystem).Robot;
    const model = await extractAstNode<ProgRobot>(fileName, services);
    const generatedFilePath = generateJavaScript(model, fileName, opts.destination);
    console.log(chalk.green(`JavaScript code generated successfully: ${generatedFilePath}`));

};

export const generateAST = async (fileName: string): Promise<void> => {
    const services = createRobotServices(NodeFileSystem).Robot;
    const model = await extractAstNode<ProgRobot>(fileName, services);
    const generatedFilePath = writeAst(model, "output");
    console.log(chalk.green(`JavaScript code generated successfully: ${generatedFilePath}`));
};

export const visitFile = async (fileName: string): Promise<void> => {
    const services = createRobotServices(NodeFileSystem).Robot;
    const model = await extractAstNode<ProgRobot>(fileName, services);
    interpret(model);
}

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
        .command('generateAST')
        .argument('<file>', `Source file ending in ${fileExtensions}`)
        .description('Command to generate the AST of a source file')
        .action(generateAST);

    program
        .command("visitFile")
        .argument('<file>', `Source file ending in ${fileExtensions}`)
        .description('Command to generate the AST of a source file')
        .action(visitFile)

    program.parse(process.argv);
}
