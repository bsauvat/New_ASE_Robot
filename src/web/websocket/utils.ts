import { AstNode, LangiumDocument, URI } from "langium";
import { createRobotServices } from "../../language/robot-module.js";
import { NodeFileSystem } from "langium/node";

export async function createAstFromString<T extends AstNode>(content: string): Promise<T> {
    const services = createRobotServices(NodeFileSystem).Robot;
    const document = services.shared.workspace.LangiumDocumentFactory.fromString(content, URI.from({scheme:""}));
    await services.shared.workspace.DocumentBuilder.build([document], { validation: true });

    return document.parseResult.value as T;
}

export async function createDocumentFromString(content: string): Promise<LangiumDocument> {
    const services = createRobotServices(NodeFileSystem).Robot;
    const document = services.shared.workspace.LangiumDocumentFactory.fromString(content, URI.from({scheme:""}));
    await services.shared.workspace.DocumentBuilder.build([document], { validation: true });

    return document;
}