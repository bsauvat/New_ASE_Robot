grammar Robot

entry ProgRobot:
	functions+=Fonction*;

Fonction:
    'def' name=ID '(' (args+=DeclaredParameter (',' args+=DeclaredParameter)*)? ')'
        functionBody=Body;

Body:
 '{' (statements+=Statement)* '}';


Statement:
	ControlStructure | ((Deplacement | VariableDeclaration | UpdateVariable | CallFunction | Print | Return) ';');

Return:
	'return' return=Expression;

Print:
	'print(' print=Expression ')';

Deplacement:
	Forward | Backward | StrafeLeft | StrafeRight | SpeedCommand | TurnRight | TurnLeft;

ControlStructure:
	Condition | Loop ;

Loop:
	'while' loop=Expression loopBody=Body;

Condition:
	'if' ifCondition=Expression ifBody=Body ('else' 'if' elseifCondition+=Expression elseifBody+=Body)* ('else' elseBody=Body)? ;

DeclaredParameter:
    vartype=("int" | "string" | "bool") varame=[AbstractType:ID];

VariableDeclaration:
	vartype=("int" | "string" | "bool") name=ID '=' varValue=Expression;

UpdateVariable:
	varName=[VariableDeclaration:ID] '=' newValue=Expression;

CallVariable:
    varName=[AbstractType:ID];

type AbstractType= DeclaredParameter | VariableDeclaration;

CallFunction:
	functionName=[Fonction:ID] '(' (args+=Expression (',' args+=Expression)*)? ')';

ArithmeticExpression:
	PlusMinus;

Unit returns string:
	'mm'|'cm'|'m';

Expression : Or;

Or infers Expression:
	And ({infer BinaryBooleanExpression.left=current} op='||' right=And )*;

And infers Expression:
	Equality ({infer BinaryBooleanExpression.left=current} op='&&' right=Equality )*;

Equality infers Expression:
	Comparison ({infer BinaryBooleanExpression.left=current} op=( '==' | '!=' ) right=Comparison)*;

Comparison infers Expression:
	PlusMinus ({infer BinaryBooleanExpression.left=current} op=( '<' | '<=' | '>=' | '>' ) right=PlusMinus )*;

PlusMinus infers Expression:
	MultDiv ({infer BinaryArithmeticExpression.left=current} op=( '+' | '-' ) right+=MultDiv )*;

MultDiv infers Expression:
	Term ({infer BinaryArithmeticExpression.left=current} op=( '*' | '/' ) right+=Term)*;

Term infers Expression:
	'(' Expression ')'  | Atomic;

Atomic infers Expression:
	{infer INT_const} value=INT |{infer INT_neg_const}'-' value=INT |
	{infer STRING_const} value=STRING |
	{infer BOOL_const} value=('true' | 'false') |
	CallVariable |
	CallFunction |
	GetSensor | 
	DeclaredParameter;

GetSensor:
    {infer GetTimestamp} "get_timestamp()" | {infer GetDistance} "get_distance()" | {infer GetSpeed} "get_speed()";

Forward:
    'forward' distance=ArithmeticExpression unit=Unit;

Backward:
    'backward' distance=ArithmeticExpression unit=Unit;

StrafeLeft:
    'strafeleft' distance=ArithmeticExpression unit=Unit;

StrafeRight:
    'straferight' distance=ArithmeticExpression unit=Unit;

TurnRight:
    'turnright' angle=ArithmeticExpression;

TurnLeft:
    'turnleft' angle=ArithmeticExpression;

SpeedCommand:
	'setspeed' speed=ArithmeticExpression;


hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;