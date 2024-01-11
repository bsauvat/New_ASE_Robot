import type { ProgRobot } from '../language/generated/ast.js';
import * as fs from 'node:fs';
import { CompositeGeneratorNode, NL, toString } from 'langium';
import * as path from 'node:path';
import { extractDestinationAndName } from './cli-util.js';
import { RobotCompilerImpl } from '../language/semantic/compiler/compiler.js';

export function generateJavaScript(model: ProgRobot, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.js`;

    const fileNode = new CompositeGeneratorNode();
    fileNode.append('"use strict";', NL, NL);
   // model.greetings.forEach(greeting => fileNode.append(`console.log('Hello, ${greeting.person.ref?.name}!');`, NL));

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, toString(fileNode));
    return generatedFilePath;
}

export function writeAst(model: ProgRobot, fileName: string): string {
    const file = new CompositeGeneratorNode();
    file.append("Generated Ast\n");
    model.functions.forEach(functions => file.append(functions.name + " "));

    const generatedFilePath = "../../examples/" + fileName;
    fs.writeFileSync(generatedFilePath, toString(file));

    return generatedFilePath;
}

/**
 * Generates Arduino code from a RobotDsl Model
 * @param robot Model to generate Arduino code from
 * @returns Generated Arduino code that captures the program's intent
 */
export function generateArduinoCode(robot: ProgRobot): String {
    const visitor = new RobotCompilerImpl();
    return robot.accept(visitor)
}
