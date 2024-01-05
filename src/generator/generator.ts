import { InterpreterVisitor } from "../language/semantic/interpreter.js";
import { ProgRobot } from "../language/semantic/visitor.js";

/**
 * Generates simple movement commands from a RobotDsl Model
 * @param robot Model to generate commmands from
 * @returns Generated commands that captures the program's intent
 */
export function generateCommands(robot: ProgRobot, sceneWidth?: number, sceneHeight?:number): Object[] {
    const visitor = new InterpreterVisitor(sceneWidth, sceneHeight);
    return robot.accept(visitor)
}

