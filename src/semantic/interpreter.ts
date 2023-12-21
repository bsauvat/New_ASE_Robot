import { ProgRobot } from "../language/generated/ast.js";
import { ProgRobot as VisitorModel }  from "../language/visitor.js";
import { InterpreterVisitor } from "../language/interpreter/interpreter.js";

export function interpret(model: ProgRobot): void {
    const visitor = new InterpreterVisitor();
    const visitorModel: VisitorModel = new VisitorModel(model.functions);
    visitorModel.accept(visitor);
}