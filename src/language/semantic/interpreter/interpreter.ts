import { wsServer } from "../../../web/app.js";
import { Robot } from "../../../web/simulator/entities.js";
import { BaseScene, Scene } from "../../../web/simulator/scene.js";
import { Vector } from "../../../web/simulator/utils.js";
import { Expression, MultDiv, StrafeRight, Term, Unit } from "../../generated/ast.js";
import { Body, Comparison, Condition, BOOL_const, Fonction, CallFunction, GetDistance, GetSpeed, GetTimestamp, 
    Backward, Forward, Loop, ProgRobot, INT_const, Print, RobotVisitor, SpeedCommand, TurnLeft, TurnRight, CallVariable,
    VariableDeclaration, UpdateVariable, acceptNode, And, Or, Equality, PlusMinus,INT_neg_const, DeclaredParameter, StrafeLeft, Return, STRING_const, Atomic } from "../visitor.js";

export class InterpreterVisitor implements RobotVisitor{

    private scene: Scene;
    private robot: Robot;
    private variables: Map<string,Expression>;
    public wait: boolean;

    constructor(sceneWidth?: number, sceneHeight?:number) {
        if(sceneWidth && sceneHeight) {
            this.scene = new BaseScene(new Vector(sceneWidth*10, sceneHeight*10));
            this.robot = this.scene.robot;
        }
        else {
            this.scene = new BaseScene();
            this.robot = this.scene.robot;
        }
        this.variables = new Map<string, Expression>();
        this.wait = false;
        this.sendSceneToClient(this.scene);
    }


    visitBody(node: Body) {
        for (let statement of node.statements) {
            acceptNode(statement, this);
        }
    }

    visitFonction(node: Fonction) {
        return acceptNode(node.functionBody, this);
    }

    visitCallFunction(node: CallFunction) {
        if (!node.functionName.ref) {
            throw new Error("function ref is undefined");
        }
        return acceptNode(node.functionName.ref, this);
    }

    visitCondition(node: Condition) {
        if (acceptNode(node.ifCondition, this)) {
            return acceptNode(node.ifBody, this);
        } else if (node.elseifCondition){
            for ( let body of node.elseifBody){
                return acceptNode(body,this);
            }
        }
        else if (node.elseBody){
            return acceptNode(node.elseBody,this);
        }
    }

    visitLoop(node: Loop) {
        while (acceptNode(node.loop, this)) {
            acceptNode(node.loopBody, this);
        }
    }

    visitProgRobot(node: ProgRobot) {
        for (let f of node.functions) {
            if (f.name === "entry") {
                return acceptNode(f, this);
            }
        }
    }

    private toMeters(distance: number, unit: Unit): number {
        switch (unit) {
            case "cm":
                distance /= 100;
                break;
            case "mm":
                distance /= 1000;
                break;
            default:
        }
        return distance;
    }

    visitSpeedCommand(node: SpeedCommand) {
        const speed: number = acceptNode(node.speed, this);
        this.robot.speed = speed;
    }

    visitTurnLeft(node: TurnLeft) {
        let angle: number = (node.angle as any) * Math.PI / 180; // degree to radian
        this.robot.turn(-angle);
        this.sendRobotToClient({dist: 0, strafe: 0, angle: -angle});
    }

    visitTurnRight(node: TurnRight) {
        let angle: number = (node.angle as any) * Math.PI / 180; // degree to radian
        this.robot.turn(angle);
        this.sendRobotToClient({dist: 0, strafe: 0, angle: angle});
    }

    visitBackward(node: Backward) {
        const distance: number = this.toMeters(acceptNode(node.distance, this), node.unit);
        this.robot.move(-distance);

        this.sendRobotToClient({dist: -distance, strafe: 0, angle: 0});
    }

    visitForward(node: Forward) {
        const distance: number = this.toMeters(acceptNode(node.distance, this), node.unit);
        this.robot.move(distance);

        this.sendRobotToClient({dist: distance, strafe: 0, angle: 0});
    }

    visitStrafeLeft(node: StrafeLeft) {
        const strafe: number = this.toMeters(acceptNode(node.distance, this), node.unit);
        this.robot.strafe(-strafe);
        this.sendRobotToClient({dist: 0, strafe: -strafe, angle: 0})
    }

    visitStrafeRight(node: StrafeRight) {
        const strafe: number = this.toMeters(acceptNode(node.distance, this), node.unit);
        this.robot.strafe(strafe);
        this.sendRobotToClient({dist: 0, strafe: strafe, angle: 0})
    }

    visitDeclaredParameter(node: DeclaredParameter) {
        return node.name;
    }

    visitCallVariable(node: CallVariable) {
        if (!node.varName.ref) {
            throw new Error("variable ref is undefined");
        }
        return this.variables.get(node.varName.ref?.name);
    }

    visitVariableDeclaration(node: VariableDeclaration) {
        this.variables.set(node.name, acceptNode(node.varValue, this));
    }

    visitUpdateVariable(node: UpdateVariable) {
        if (!node.varName.ref) {
            throw new Error("variable ref is undefined");
        }
        this.variables.set(node.varName.ref?.name, acceptNode(node.newValue, this))
    }
    
    visitOr(node: Or) {
        for (let right in node.right){
            return acceptNode(node.left, this) || acceptNode((right as unknown as And), this);}
    }

    visitAnd(node: And) {

        for (let right in node.right){
            return acceptNode(node.left, this) && acceptNode((right as unknown as Equality), this);}
    }

    visitEquality(node: Equality) {

        if (node.op.length == 0){
            return acceptNode(node.left, this);
        }

        for (let i = 0; i < node.op.length; i++){
            switch(node.op[i]){
                case '==':
                    return acceptNode(node.left, this) == acceptNode((node.right[i]), this);
                case '!=':
                    return acceptNode(node.left, this) != acceptNode((node.right[i]), this);
                default:
                    throw new Error("Equality operator not implemented");
            }
        }
        throw new Error("Equality visit failed");     
    }
        
    
    visitComparison(node: Comparison) {

        if (node.op.length == 0){
            return acceptNode(node.left, this);
        }

        for (let i = 0; i < node.op.length; i++){
            switch(node.op[i]){
                case '<':
                    return acceptNode(node.left, this) < acceptNode((node.right[i]), this);
                case '>':
                    return acceptNode(node.left, this) > acceptNode((node.right[i]), this);
                case '<=':
                    return acceptNode(node.left, this) <= acceptNode((node.right[i]), this);
                case '>=':
                    return acceptNode(node.left, this) >= acceptNode((node.right[i]), this);
                default:
                    throw new Error("Comparison operator not implemented");
            }
        }
        throw new Error("Comparison visit failed");     
    }

    visitPlusMinus(node: PlusMinus) {

        if (node.op.length == 0){
            return acceptNode(node.left, this);
        }

        for (let i = 0; i < node.op.length; i++){
            switch(node.op[i]){
                case '+':
                    return acceptNode(node.left, this) + acceptNode((node.right[i]), this);
                case '-':
                    return acceptNode(node.left, this) - acceptNode((node.right[i]), this);
                default:
                    throw new Error("PlusMinus operator not implemented");
            }
        }
        throw new Error("PlusMinus visit failed");     
    }

    visitMultDiv(node: MultDiv) {

        if (node.op.length === 0) return acceptNode(node.left, this);

        for (let i = 0; i < node.op.length; i++){
            switch(node.op[i]){
                case '*':
                    return acceptNode(node.left, this) * acceptNode((node.right[i]), this);
                case '/':
                    return acceptNode(node.left, this) / acceptNode((node.right[i]), this);
                default:
                    throw new Error("MultDiv operator not implemented");
            }
        }
        throw new Error("MultDiv visit failed");
    }

    visitPrint(node: Print) {
        console.log(acceptNode(node.print, this));
    }

    visitReturn(node: Return) {
        return node.return;
    }

    visitGetSpeed(node: GetSpeed) {
        return this.robot.speed;
    }

    visitGetDistance(node: GetDistance) {
        const poi: Vector | undefined = this.robot.getRay().intersect(this.scene.entities);

        if (poi) {
            const dist: number = poi.distanceTo(this.robot.pos);
            return dist;
        }
        return 100000;
    }

    visitTerm(node: Expression | Term | Atomic | DeclaredParameter) {
        
    }

    visitAtomic(node: Atomic) {
        return node.value;
    }

    visitGetTimestamp(node: GetTimestamp) {
        return this.scene.timestamps[0].time;
    }

    visitINT_const(node: INT_const) {
        return node.value;
    }

    visitINT_neg_const(node: INT_neg_const) {
        return node.value;
    }

    visitBOOL_const(node: BOOL_const) {
        return node.value === 'true';
    }

    visitSTRING_const(node: STRING_const) {
        return node.value;
    }

    getScene(): Scene {
        return this.scene;
    }

    private sendRobotToClient({dist, strafe, angle}: {dist: number,strafe: number, angle: number}): void {
        wsServer.emitRobot({dist, strafe, angle});
    }

    private sendSceneToClient(scene: Scene): void {
        wsServer.emitScene(this.scene);
    }
}