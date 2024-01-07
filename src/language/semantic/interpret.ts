import { ProgRobot } from "../generated/ast.js";
import { ProgRobot as VisitorModel }  from "./visitor.js";
import { InterpreterVisitor } from "./interpreter/interpreter.js";

export function interpret(model: ProgRobot): void {
    const visitor = new InterpreterVisitor();
    const visitorModel: VisitorModel = new VisitorModel(model.functions);
    visitorModel.accept(visitor);
}