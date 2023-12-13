grammar Robot

entry Robot:
	functions+=Fonction*;

Fonction:
    'def' name=ID '(' (args+=DeclaredParameter (',' args+=DeclaredParameter)*)? ')'
        functionBody=Body;

Body:
 '{' (statements+=Statement)* '}';

DeclaredParameter:
    vartype=("int" | "string" | "bool") paramName=ID;

Statement:
	ControlStructure | ((Deplacement | VariableDeclaration | UpdateVariable | CallFunction | Print | Return) ';');

Return:
	'return' return=Expression;

Print:
	'print(' print=Expression ')';

Deplacement:
	Forward | Backward | StrafeLeft | StrafeRight | SpeedCommand | Rotate;

ControlStructure:
	Condition | Loop ;

Loop:
	'while' loop=Expression loopBody=Body;

Condition:
	'if' ifCondition=Expression ifBody=Body ('else' 'if' elseifCondition+=Expression elseifBody+=Body)* ('else' elseBody=Body)? ;

VariableDeclaration:
	vartype=("int" | "string" | "bool") name=ID '=' varValue=Expression;

UpdateVariable:
	varName=[VariableDeclaration:ID] '=' newValue=Expression;

CallVariable:
    varName=[VariableDeclaration:ID] | param=[DeclaredParameter:ID];

CallFunction:
	functionName=[Fonction:ID] '(' (args+=Expression (',' args+=Expression)*)? ')';

ArithmeticExpression:
	PlusMinus;

Unit returns string:
	'mm'|'cm'|'m';

Expression : Or;

Or infers Or:
	left=And ( '||' right+=And )*;

And infers And:
	left=Equality ( '&&' right+=Equality )*;

Equality infers Equality:
	left=Comparison (op+=( '==' | '!=' ) right+=Comparison)*;

Comparison infers Comparison:
	left=PlusMinus (op+=( '<' | '<=' | '>=' | '>' ) right+=PlusMinus )*;

PlusMinus infers PlusMinus:
	left=MultDiv (op+=( '+' | '-' ) right+=MultDiv )*;

MultDiv infers MultDiv:
	left=Term ( op+=( '*' | '/' ) right+=Term)*;

Term infers Term:
	'(' Expression ')' | "not" expression=Term | param=DeclaredParameter | atom=Atomic;

Atomic infers Atomic:
	{infer INT_const} value=INT |{infer INT_neg_const}'-' value=INT |
	{infer STRING_const} value=STRING |
	{infer BOOL_const} value=('true' | 'false') |
	callVar=CallVariable |
	callFunction=CallFunction |
	sensor=GetSensor;

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

Rotate:
    'rotate' angle=ArithmeticExpression;

SpeedCommand:
	'setspeed' speed=ArithmeticExpression;


hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;