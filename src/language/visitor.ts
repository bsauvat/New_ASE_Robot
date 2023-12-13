import * as ASTInterfaces from './generated/ast.js';
import { AstNode, Reference } from 'langium';

export interface RobotVisitor {
    
    visitBody(node: Body): any;

    visitFonction(node: Fonction): any;

    visitCallFunction(node: CallFunction): any;
    
    visitCondition(node: Condition): any;

    visitBackward(node: Backward): any;

    visitForward(node: Forward): any;

    visitLoop(node: Loop): any;

    visitRobot(node: Robot): any;

    visitSpeedCommand(node: SpeedCommand): any;

    visitRotate(node: Rotate): any;

    visitCallVariable(node: CallVariable): any;

    visitVariableDeclaration(node: VariableDeclaration): any;

    visitUpdateVariable(node: UpdateVariable): any;

    visitComparison(node: Comparison): any;

    visitPrint(node: Print): any;

    visitGetSpeed(node: GetSpeed): any;

    visitGetDistance(node: GetDistance): any;

    visitGetTimestamp(node: GetTimestamp): any;

    visitPlusMinus(node: PlusMinus): any;

    visitMultDiv(node: MultDiv): any;

    //visitTerm(node: Term): any;

    visitAtomic(node: Atomic): any;

    visitOr(node: Or): any;

    visitAnd(node: And): any;

    visitEquality(node: Equality): any;

    visitBOOL_const(node: BOOL_const): any;

    visitDeclaredParameter(node: DeclaredParameter): any;

    visitGetDistance(node: GetDistance): any;

    visitINT_const(node: INT_const): any;

    visitINT_neg_const(node: INT_neg_const): any;

    visitReturn(node: Return): any;

    visitSTRING_const(node: STRING_const): any;

    visitStrafeLeft(node: StrafeLeft): any;

    visitStrafeRight(node: StrafeRight): any;

}

export class Body implements ASTInterfaces.Body {
    $container:ASTInterfaces.Fonction;
    $type: 'Body';
    statements: ASTInterfaces.Statement[];

    constructor(
        container: ASTInterfaces.Fonction,
        statements: ASTInterfaces.Statement[],
    ) {
        this.$container = container;
        this.statements = statements;
        this.$type = "Body";
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitBody(this);
    }
}

export class CallFunction implements ASTInterfaces.CallFunction {
    $container: ASTInterfaces.Body;
    $type: 'CallFunction';
    functionName: Reference<ASTInterfaces.Fonction>;
    args: ASTInterfaces.Expression[];

    constructor(
        container: ASTInterfaces.Body,
        functionName:  Reference<ASTInterfaces.Fonction>,
        args: ASTInterfaces.Expression[]
    ) {
        this.$container = container;
        this.$type = "CallFunction";
        this.functionName = functionName;
        this.args = args;
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitCallFunction(this);
    }
}

export class CallVariable implements ASTInterfaces.CallVariable {
    $container: ASTInterfaces.Atomic;
    $type: 'CallVariable';
    name: Reference<VariableDeclaration> | Reference<DeclaredParameter>;
    varvalue: Reference<VariableDeclaration> | Reference<DeclaredParameter>;

    constructor(
        name: Reference<VariableDeclaration> | Reference<DeclaredParameter>, 
        varvalue:  Reference<VariableDeclaration> | Reference<DeclaredParameter>, 
        container: ASTInterfaces.Atomic
    ) {
        this.name = name;
        this.varvalue = varvalue;
        this.$type = "CallVariable";
        this.$container = container;
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitCallVariable(this);
    }
}

export class VariableDeclaration implements ASTInterfaces.VariableDeclaration {
    $container: ASTInterfaces.Body;
    $type: 'VariableDeclaration';
    name: string;
    varValue: ASTInterfaces.Expression;

    constructor(name: string, varValue: ASTInterfaces.Expression, container: ASTInterfaces.Body) {
        this.name = name;
        this.varValue = varValue;
        this.$container = container;
        this.$type = "VariableDeclaration";
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitVariableDeclaration(this);
    }
}

export class UpdateVariable implements ASTInterfaces.UpdateVariable {
    $container: ASTInterfaces.Body;
    $type: 'UpdateVariable';
    varName: Reference<VariableDeclaration>;
    newValue: ASTInterfaces.Expression;

    constructor(varName: Reference<VariableDeclaration>, newValue: ASTInterfaces.Expression, container: ASTInterfaces.Body) {
        this.varName = varName;
        this.newValue = newValue;
        this.$container = container;
        this.$type = "UpdateVariable";
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitUpdateVariable(this);
    }
}

export class Or implements ASTInterfaces.Or {
    $container: ASTInterfaces.CallFunction | ASTInterfaces.Condition | ASTInterfaces.Loop | ASTInterfaces.Print | ASTInterfaces.Return | ASTInterfaces.UpdateVariable | ASTInterfaces.VariableDeclaration;
    $type: 'Or';
    left: ASTInterfaces.And;
    right: ASTInterfaces.And[];

    constructor(
        left: ASTInterfaces.And, right: ASTInterfaces.And[],
        container: ASTInterfaces.CallFunction | ASTInterfaces.Condition | ASTInterfaces.Loop | ASTInterfaces.Print | ASTInterfaces.Return | ASTInterfaces.UpdateVariable | ASTInterfaces.VariableDeclaration
    ) {
        this.left = left;
        this.right = right;
        this.$type = 'Or';
        this.$container = container;
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitOr(this);
    }
}


export class And implements ASTInterfaces.And {
    $container: ASTInterfaces.Or;
    $type: 'And';
    left: ASTInterfaces.Equality;
    right: ASTInterfaces.Equality[];

    constructor(left: ASTInterfaces.Equality, right: ASTInterfaces.Equality[], container: ASTInterfaces.Or) {
        this.left = left;
        this.right = right;
        this.$type = 'And';
        this.$container = container;
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitAnd(this);
    }
}

export class Equality implements ASTInterfaces.Equality {
    $container: ASTInterfaces.And;
    $type: 'Equality';
    left: ASTInterfaces.Comparison;
    op: ("==" | "!=")[];
    right: ASTInterfaces.Comparison[];

    constructor(left: ASTInterfaces.Comparison, op: ("==" | "!=")[], right: ASTInterfaces.Comparison[],container: ASTInterfaces.And) {
        this.left = left;
        this.op = op;
        this.right = right;
        this.$type = 'Equality';
        this.$container = container;
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitEquality(this);
    }
}

export class Comparison implements ASTInterfaces.Comparison {
    $container: ASTInterfaces.Equality;
    $type: 'Comparison';
    left: ASTInterfaces.PlusMinus;
    op: ("<" | ">" | "<=" | ">=")[];
    right: ASTInterfaces.PlusMinus[];

    constructor(left: ASTInterfaces.PlusMinus, op: ("<" | ">" | "<=" | ">=")[], right: ASTInterfaces.PlusMinus[], container: ASTInterfaces.Equality) {
        this.left = left;
        this.op = op;
        this.right = right;
        this.$type = 'Comparison';
        this.$container = container;
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitComparison(this);
    }
}

export class PlusMinus implements ASTInterfaces.PlusMinus {
    $container: ASTInterfaces.Backward | ASTInterfaces.Comparison | ASTInterfaces.Forward | ASTInterfaces.Rotate | ASTInterfaces.SpeedCommand | ASTInterfaces.StrafeLeft | ASTInterfaces.StrafeRight;
    $type: 'PlusMinus';
    left: ASTInterfaces.MultDiv;
    op: ("+"|"-")[];
    right: ASTInterfaces.MultDiv[];

    constructor(left: ASTInterfaces.MultDiv, op: ("+"|"-")[], right: ASTInterfaces.MultDiv[],
                container: Backward | ASTInterfaces.Comparison | ASTInterfaces.Forward | ASTInterfaces.Rotate | ASTInterfaces.SpeedCommand | ASTInterfaces.StrafeLeft | ASTInterfaces.StrafeRight
    ) {
        this.left = left;
        this.op = op;
        this.right = right;
        this.$type = 'PlusMinus';
        this.$container = container;
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitPlusMinus(this);
    }
}

export class MultDiv implements ASTInterfaces.MultDiv {
    $container: ASTInterfaces.PlusMinus;
    $type: 'MultDiv';
    left: ASTInterfaces.Term;
    op: ("*" | "/")[];
    right: ASTInterfaces.Term[];

    constructor(left: ASTInterfaces.Term, op: ("*" | "/")[], right: ASTInterfaces.Term[], container: ASTInterfaces.PlusMinus) {
        this.left = left;
        this.op = op;
        this.right = right;
        this.$type = 'MultDiv';
        this.$container = container;
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitMultDiv(this);
    }
}

/*export class Term implements ASTInterfaces.Term {
    $container: ASTInterfaces.Term | ASTInterfaces.MultDiv;
    $type: 'Term';
    expression?: ASTInterfaces.Expression;
    param?: ASTInterfaces.DeclaredParameter;
    atom?: ASTInterfaces.Atomic;

    constructor(
        container: (ASTInterfaces.Term | ASTInterfaces.MultDiv),
        expression?: ASTInterfaces.Expression,
        param?: ASTInterfaces.DeclaredParameter,
        atom?: ASTInterfaces.Atomic
    ) {
        this.expression = expression;
        this.param = param;
        this.atom = atom;
        this.$type = 'Term';
        this.$container = container;
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitTerm(this);
    }
}*/

export class Atomic implements ASTInterfaces.Atomic {
    $type: 'Atomic';
    value: number | string | boolean | ASTInterfaces.CallVariable | ASTInterfaces.CallFunction ; //ASTInterfaces.GetSensor;

    constructor(value: number | string | boolean | ASTInterfaces.CallVariable | ASTInterfaces.CallFunction) {
        this.value = value;
        this.$type = 'Atomic';
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitAtomic(this);
    }
}

export class Forward implements ASTInterfaces.Forward {
    $container: ASTInterfaces.Body;
    $type: 'Forward';
    distance: ASTInterfaces.ArithmeticExpression;
    unit: 'mm' | 'cm' | 'm';

    constructor(distance: ASTInterfaces.ArithmeticExpression, unit: 'mm' | 'cm' | 'm', container: ASTInterfaces.Body) {
        this.distance = distance;
        this.unit = unit;
        this.$type = 'Forward';
        this.$container = container;
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitForward(this);
    }
}

export class Backward implements ASTInterfaces.Backward {
    $container: ASTInterfaces.Body;
    $type: 'Backward';
    distance: ASTInterfaces.ArithmeticExpression;
    unit: 'mm' | 'cm' | 'm';

    constructor(distance: ASTInterfaces.ArithmeticExpression, unit: 'mm' | 'cm' | 'm',container: ASTInterfaces.Body) {
        this.distance = distance;
        this.unit = unit;
        this.$type = 'Backward';
        this.$container = container;
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitBackward(this);
    }
}

export class StrafeLeft implements ASTInterfaces.StrafeLeft {
    $container: ASTInterfaces.Body;
    $type: 'StrafeLeft';
    distance: ASTInterfaces.ArithmeticExpression;
    unit: 'mm' | 'cm' | 'm';

    constructor(distance: ASTInterfaces.ArithmeticExpression, unit: 'mm' | 'cm' | 'm', container: ASTInterfaces.Body) {
        this.distance = distance;
        this.unit = unit;
        this.$type = 'StrafeLeft';
        this.$container = container;
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitStrafeLeft(this);
    }
}

export class StrafeRight implements ASTInterfaces.StrafeRight {
    $container: ASTInterfaces.Body;
    $type: 'StrafeRight';
    distance: ASTInterfaces.ArithmeticExpression;
    unit: 'mm' | 'cm' | 'm';

    constructor(distance: ASTInterfaces.ArithmeticExpression, unit: 'mm' | 'cm' | 'm', container: ASTInterfaces.Body) {
        this.distance = distance;
        this.unit = unit;
        this.$type = 'StrafeRight';
        this.$container = container;
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitStrafeRight(this);
    }
}

export class Rotate implements ASTInterfaces.Rotate {
    $container: ASTInterfaces.Body;
    $type: 'Rotate';
    angle: ASTInterfaces.ArithmeticExpression;

    constructor(angle: ASTInterfaces.ArithmeticExpression, container: ASTInterfaces.Body) {
        this.angle = angle;
        this.$type = 'Rotate';
        this.$container = container;
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitRotate(this);
    }
}

export class SpeedCommand implements ASTInterfaces.SpeedCommand {
    $container: ASTInterfaces.Body;
    $type: 'SpeedCommand';
    speed: ASTInterfaces.ArithmeticExpression;

    constructor(speed: ASTInterfaces.ArithmeticExpression, container: ASTInterfaces.Body) {
        this.speed = speed;
        this.$type = 'SpeedCommand';
        this.$container = container;
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitSpeedCommand(this);
    }
}

export class Loop implements ASTInterfaces.Loop {
    $container: ASTInterfaces.Body;
    $type: 'Loop';
    loop: ASTInterfaces.Expression;
    loopBody: ASTInterfaces.Body;

    constructor(loop: ASTInterfaces.Expression, loopBody: ASTInterfaces.Body, container: ASTInterfaces.Body) {
        this.loop = loop;
        this.loopBody = loopBody;
        this.$type = 'Loop';
        this.$container = container;
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitLoop(this);
    }
}

export class Condition implements ASTInterfaces.Condition {
    $container: ASTInterfaces.Body;
    $type: 'Condition';
    ifCondition: ASTInterfaces.Expression;
    ifBody: ASTInterfaces.Body;
    elseifCondition: ASTInterfaces.Expression[];
    elseifBody: ASTInterfaces.Body[];
    elseBody: ASTInterfaces.Body;

    constructor(
        ifCondition: ASTInterfaces.Expression,
        ifBody: ASTInterfaces.Body,
        elseifCondition: ASTInterfaces.Expression[],
        elseifBody: ASTInterfaces.Body[],
        elseBody: ASTInterfaces.Body,
        container: ASTInterfaces.Body
    ) {
        this.ifCondition = ifCondition;
        this.ifBody = ifBody;
        this.elseifCondition = elseifCondition;
        this.elseifBody = elseifBody;
        this.elseBody = elseBody;
        this.$type = 'Condition';
        this.$container = container;
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitCondition(this);
    }
}

export class Print implements ASTInterfaces.Print {
    $container: ASTInterfaces.Body;
    $type: 'Print';
    print: ASTInterfaces.Expression;

    constructor(print: ASTInterfaces.Expression, container: ASTInterfaces.Body) {
        this.print = print;
        this.$type = 'Print';
        this.$container = container;
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitPrint(this);
    }
}

export class Return implements ASTInterfaces.Return {
    $container: ASTInterfaces.Body;
    $type: 'Return';
    return: ASTInterfaces.Expression;

    constructor(returnValue: ASTInterfaces.Expression, container: ASTInterfaces.Body) {
        this.return = returnValue;
        this.$type = 'Return';
        this.$container = container;
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitReturn(this);
    }
}

export class BOOL_const implements ASTInterfaces.BOOL_const {
    $type: 'BOOL_const';
    value: "true" | "false";

    constructor(value: "true" | "false") {
        this.value = value;
        this.$type = 'BOOL_const';
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitBOOL_const(this);
    }
}

export class GetSpeed implements ASTInterfaces.GetSpeed {
    $container: ASTInterfaces.Atomic;
    $type: 'GetSpeed';

    constructor(container : ASTInterfaces.Atomic) {
        this.$type = 'GetSpeed';
        this.$container = container;
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitGetSpeed(this);
    }
}

export class GetDistance implements ASTInterfaces.GetDistance {
    $container: ASTInterfaces.Atomic;
    $type: 'GetDistance';

    constructor(container: ASTInterfaces.Atomic) {
        this.$type = 'GetDistance';
        this.$container = container;
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitGetDistance(this);
    }
}

export class GetTimestamp implements ASTInterfaces.GetTimestamp {
    $container: ASTInterfaces.Atomic;
    $type: 'GetTimestamp';

    constructor(container: ASTInterfaces.Atomic) {
        this.$type = 'GetTimestamp';
        this.$container = container;
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitGetTimestamp(this);
    }
}

export class Fonction implements ASTInterfaces.Fonction {
    $container: ASTInterfaces.Robot;
    $type: 'Fonction';
    name: string;
    args: ASTInterfaces.DeclaredParameter[];
    functionBody: ASTInterfaces.Body;

    constructor(
        name: string,
        args: ASTInterfaces.DeclaredParameter[],
        functionBody: ASTInterfaces.Body,
        container: ASTInterfaces.Robot
    ) {
        this.name = name;
        this.args = args;
        this.functionBody = functionBody;
        this.$type = 'Fonction';
        this.$container = container
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitFonction(this);
    }
}

export class Robot implements ASTInterfaces.Robot {
    $type: 'Robot';
    functions: ASTInterfaces.Fonction[];

    constructor(functions: ASTInterfaces.Fonction[]) {
        this.functions = functions;
        this.$type = 'Robot';
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitRobot(this);
    }
}

export class DeclaredParameter implements ASTInterfaces.DeclaredParameter {
    $container: ASTInterfaces.Fonction | ASTInterfaces.Term;
    $type: 'DeclaredParameter';
    paramName: string;

    constructor(paramName: string, container: ASTInterfaces.Fonction | ASTInterfaces.Term) {
        this.paramName = paramName;
        this.$type = 'DeclaredParameter';
        this.$container = container;
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitDeclaredParameter(this);
    }
}

export class INT_const implements ASTInterfaces.INT_const {
    $type: 'INT_const';
    value: number;

    constructor(value: number) {
        this.value = value;
        this.$type = 'INT_const';
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitINT_const(this);
    }
}

export class INT_neg_const implements ASTInterfaces.INT_neg_const {
    $type: 'INT_neg_const';
    value: number;

    constructor(value: number) {
        this.value = value;
        this.$type = 'INT_neg_const';
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitINT_neg_const(this);
    }
}

export class STRING_const implements ASTInterfaces.STRING_const {
    $type: 'STRING_const';
    value: string;

    constructor(value: string) {
        this.value = value;
        this.$type = 'STRING_const';
    }

    accept(visitor: RobotVisitor): any {
        return visitor.visitSTRING_const(this);
    }
}

export function acceptNode(node: AstNode, visitor: RobotVisitor): any {
    switch (node.$type) {
        case 'Body':
            return (node as Body).accept(visitor);
        case 'VariableDeclaration':
            return (node as VariableDeclaration).accept(visitor);
        case 'UpdateVariable':
            return (node as UpdateVariable).accept(visitor);
        case 'CallVariable':
            return (node as CallVariable).accept(visitor);
        case 'Fonction':
            return (node as Fonction).accept(visitor);
        case 'CallFunction':
            return (node as CallFunction).accept(visitor);
        case 'Condition':
            return (node as Condition).accept(visitor);
        case 'Loop':
            return (node as Loop).accept(visitor);
        case 'Forward':
            return (node as Forward).accept(visitor);
        case 'Backward':
            return (node as Backward).accept(visitor);
        case 'StrafeLeft':
            return (node as StrafeLeft).accept(visitor);
        case 'StrafeRight':
            return (node as StrafeRight).accept(visitor);
        case 'SpeedCommand':
            return (node as SpeedCommand).accept(visitor);
        case 'Comparison':
            return (node as Comparison).accept(visitor);
        case 'Print':
            return (node as Print).accept(visitor);
        case 'BOOL_const':
            return (node as BOOL_const).accept(visitor);
        case 'GetDistance':
            return (node as GetDistance).accept(visitor);
        case 'GetSpeed':
            return (node as GetSpeed).accept(visitor);
        case 'GetTimestamp':
            return (node as GetTimestamp).accept(visitor);
        case 'And':
            return (node as And).accept(visitor);
        case 'Equality':
            return (node as Equality).accept(visitor);
        case 'Comparison':
            return (node as Comparison).accept(visitor);
        case 'PlusMinus':
            return (node as PlusMinus).accept(visitor);
        case 'MultDiv':
            return (node as MultDiv).accept(visitor);
        //case 'Term':
            //return (node as Term).accept(visitor);
        case 'Atomic':
            return (node as Atomic).accept(visitor);
        default:
            throw new Error("node not implemented");
    }
}
