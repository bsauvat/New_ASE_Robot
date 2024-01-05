import { AstNode, LangiumServices, EmptyFileSystem, LangiumDocument } from "langium";
import { URI } from "vscode-uri";
import { createRobotServices } from "../language/robot-module.js";
import { ProgRobot } from "../language/generated/ast.js";
import { generateCommands } from '../generator/generator.js';
import chalk from "chalk";

/**
 * Extracts an AST node from a virtual document, represented as a string
 * @param content Content to create virtual document from
 * @param services For constructing & building a virtual document
 * @returns A promise for the parsed result of the document
 */
 async function extractAstNodeFromString<T extends AstNode>(content: string, services: LangiumServices): Promise<T> {
    // create a document from a string instead of a file
    const doc = services.shared.workspace.LangiumDocumentFactory.fromString(content, URI.parse('memory://minilogo.document'));
    // proceed with build & validation
    await services.shared.workspace.DocumentBuilder.build([doc], { validation: true });
    // get the parse result (root of our AST)
    return doc.parseResult?.value as T;
}

async function extractDocumentFromString(content: string, services: LangiumServices): Promise<LangiumDocument> {
    const doc = services.shared.workspace.LangiumDocumentFactory.fromString(content, URI.parse('memory://minilogo.document'));
    await services.shared.workspace.DocumentBuilder.build([doc], { validation: true });

    const validationErrors = (doc.diagnostics ?? []).filter(e => e.severity === 1);
    if (validationErrors.length > 0) {
        const errors = validationErrors.map(validationError =>
            `line ${validationError.range.start.line + 1}: ${validationError.message} [${doc.textDocument.getText(validationError.range)}]`
        );

        console.error(chalk.red('There are validation errors:'));
        errors.forEach(error => console.error(chalk.red(error)));

        throw new Error(errors.join('\n'));
    }

    return doc;
}

/**
 * Parses a Robot program & generates output as a list of Objects
 * @param progRobot Robot program to parse
 * @param sceneWidth width of the scene to generate commands for
 * @param sceneHeight height of the scene to generate commands for
 * @returns Generated output from this RobotDsl program
 */
export async function parseAndGenerate (value: any): Promise<Object[]> {
    const progRobot = value[0];
    const sceneWidth = value[1];
    const sceneHeight = value[2];
    const services = createRobotServices(EmptyFileSystem).Robot;
    const model = await extractAstNodeFromString<ProgRobot>(progRobot, services);
    // generate movement commands from the model
    const scene = generateCommands(model, sceneWidth, sceneHeight);
    return Promise.resolve(scene);
}

/**
 * Parse and validate a program written in our language.
 * Verifies that no lexer or parser errors occur.
 * Implicitly also checks for validation errors while extracting the document
 *
 * @param progRobot Robot program to parse
 * @returns A list of errors, if any
 */
export const parseAndValidate = async (progRobot: string): Promise<string[]> => {
    const services = createRobotServices(EmptyFileSystem).Robot;
    
    try {
        await extractDocumentFromString(progRobot, services);
        const document = await extractDocumentFromString(progRobot, services);
        const parseResult = document.parseResult;
        if (parseResult.lexerErrors.length === 0 && 
            parseResult.parserErrors.length === 0
        ) {
            console.log(chalk.green(`Parsed and validated successfully!`));
            return [];
        } else {
            let errors: string[] = [];
            if(parseResult.lexerErrors.length > 0) {
                const lexerMessage = parseResult.lexerErrors.map(lexerError =>
                    `${(lexerError.line) ? "line " + lexerError.line + 1 : ""}: ${lexerError.message}`
                );
                errors = errors.concat(lexerMessage);
            }
            if(parseResult.parserErrors.length > 0) {
                const parserMessage = parseResult.parserErrors.map(parserError =>
                    `${parserError.message}`
                );
                errors = errors.concat(parserMessage);
            }
            console.log(chalk.red(`Failed to parse and validate!`));
            return errors;
        }
    } catch (error: any) {
        console.log(chalk.red(`Failed to parse and validate!`));
        return error.message.split('\n');
    }
};

