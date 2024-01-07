import { InterpreterVisitor } from "../language/semantic/interpreter.js";
import { ProgRobot } from "../language/semantic/visitor.js";

/**
 * Generates simple movement commands from a Robot Model
 * @param ProgRobot Model to generate commmands from
 * @returns Generated commands that captures the program's intent
 */
export function generateCommands(robot: ProgRobot, sceneWidth?: number, sceneHeight?:number): Object[] {
    const visitor = new InterpreterVisitor(sceneWidth, sceneHeight);
    return robot.accept(visitor)
}

/**
 * Generates Arduino code from a Robot Model
 * @param ProgRobot Model to generate Arduino code from
 * @returns Generated Arduino code that captures the program's intent
 */
export function generateArduinoCode(robot: ProgRobot): String {
    const visitor = new RobotCompilerImpl();
    return robot.accept(visitor)
}
