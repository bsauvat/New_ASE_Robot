import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { RobotAstType } from './generated/ast.js';
import * as InterfaceAST from './generated/ast.js';
import * as ClassAST from './visitor.js';
import { RobotVisitor } from './visitor.js';
import type { RobotServices } from './robot-module.js';

/**
 * Register custom validation checks.
 * TODO : Call this function in the language module.ts file (see registerValidationChecks(...);)
 */
export function weaveAcceptMethods(services: RobotServices) {
    const registry = services.validation.ValidationRegistry;
    const weaver = services.validation.RobotAcceptWeaver
    registry.register(weaver.checks, weaver);
}

/**
 * TODO :
 * You must implement a weaving function for each concrete concept of the language.
 * you will also need to fill the check data structure to map the weaving function to the Type of node
 */
export class RobotAcceptWeaver {
    weaveFonction(node: InterfaceAST.Fonction, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitFonction(node as unknown as ClassAST.Fonction)};
    }
    weaveBody(node: InterfaceAST.Body, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitBody(node as unknown as ClassAST.Body)};
    }
    weaveDeclaredParameter(node: InterfaceAST.DeclaredParameter, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitDeclaredParameter(node as unknown as ClassAST.DeclaredParameter)};
    }
    weaveReturn(node: InterfaceAST.Return, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitReturn(node as unknown as ClassAST.Return)};
    }
    weavePrint(node: InterfaceAST.Print, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitPrint(node as unknown as ClassAST.Print)};
    }
    weaveLoop(node: InterfaceAST.Loop, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitLoop(node as unknown as ClassAST.Loop)};
    }
    weaveCondition(node: InterfaceAST.Condition, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitCondition(node as unknown as ClassAST.Condition)};
    }
    weaveVariableDeclaration(node: InterfaceAST.VariableDeclaration, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitVariableDeclaration(node as unknown as ClassAST.VariableDeclaration)};
    }
    weaveUpdateVariable(node: InterfaceAST.UpdateVariable, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitUpdateVariable(node as unknown as ClassAST.UpdateVariable)};
    }
    weaveCallVariable(node: InterfaceAST.CallVariable, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitCallVariable(node as unknown as ClassAST.CallVariable)};
    }
    weaveCallFunction(node: InterfaceAST.CallFunction, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitCallFunction(node as unknown as ClassAST.CallFunction)};
    }
    weaveOr(node: InterfaceAST.Or, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitOr(node as unknown as ClassAST.Or)};
    }
    weaveAnd(node: InterfaceAST.And, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitAnd(node as unknown as ClassAST.And)};
    }
    weaveEquality(node: InterfaceAST.Equality, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitEquality(node as unknown as ClassAST.Equality)};
    }
    weaveComparison(node: InterfaceAST.Comparison, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitComparison(node as unknown as ClassAST.Comparison)};
    }
    weavePlusMinus(node: InterfaceAST.PlusMinus, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitPlusMinus(node as unknown as ClassAST.PlusMinus)};
    }
    weaveMultDiv(node: InterfaceAST.MultDiv, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitMultDiv(node as unknown as ClassAST.MultDiv)};
    }
    weaveAtomic(node: InterfaceAST.Atomic, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitAtomic(node as unknown as ClassAST.Atomic)};
    }
    weaveForward(node: InterfaceAST.Forward, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitForward(node as unknown as ClassAST.Forward)};
    }
    weaveBackward(node: InterfaceAST.Backward, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitBackward(node as unknown as ClassAST.Backward)};
    }
    weaveStrafeLeft(node: InterfaceAST.StrafeLeft, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitStrafeLeft(node as unknown as ClassAST.StrafeLeft)};
    }
    weaveStrafeRight(node: InterfaceAST.StrafeRight, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitStrafeRight(node as unknown as ClassAST.StrafeRight)};
    }
    weaveRotate(node: InterfaceAST.Rotate, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitRotate(node as unknown as ClassAST.Rotate)};
    }
    weaveSpeedCommand(node: InterfaceAST.SpeedCommand, accept: ValidationAcceptor): void {
        (<any>node).accept = (visitor: RobotVisitor) => {return visitor.visitSpeedCommand(node as unknown as ClassAST.SpeedCommand)};
    }

    checks: ValidationChecks<RobotAstType> = {
        Body: this.weaveBody,
        Fonction: this.weaveFonction,
        DeclaredParameter: this.weaveDeclaredParameter,
        Return: this.weaveReturn,
        Print: this.weavePrint,
        Loop: this.weaveLoop,
        Condition: this.weaveCondition,
        VariableDeclaration: this.weaveVariableDeclaration,
        UpdateVariable: this.weaveUpdateVariable,
        CallVariable: this.weaveCallVariable,
        CallFunction: this.weaveCallFunction,
        Or: this.weaveOr,
        And: this.weaveAnd,
        Equality: this.weaveEquality,
        Comparison: this.weaveComparison,
        PlusMinus: this.weavePlusMinus,
        MultDiv: this.weaveMultDiv,
        Atomic: this.weaveAtomic,
        Forward: this.weaveForward,
        Backward: this.weaveBackward,
        StrafeLeft: this.weaveStrafeLeft,
        StrafeRight: this.weaveStrafeRight,
        Rotate: this.weaveRotate,
        SpeedCommand: this.weaveSpeedCommand,
        
    };
}