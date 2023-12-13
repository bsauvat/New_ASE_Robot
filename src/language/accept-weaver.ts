// import type { ValidationAcceptor, ValidationChecks } from 'langium';
// import type { RobotAstType } from '../../out/language/generated/ast.js';
// import * as InterfaceAST from '../../out/language/generated/ast.js';
// import * as ClassAST from './visitor.js';
// import { RobotVisitor } from './visitor.js';
// import type { RoboMlServices } from '../robo-ml-module.js';

// /**
//  * Register custom validation checks.
//  * TODO : Call this function in the language module.ts file (see registerValidationChecks(...);)
//  */
// export function weaveAcceptMethods(services: RoboMlServices) {
//     const registry = services.validation.ValidationRegistry;
//     const weaver = services.validation.RoboMlAcceptWeaver
//     registry.register(weaver.checks, weaver);
// }

// /**
//  * TODO :
//  * You must implement a weaving function for each concrete concept of the language.
//  * you will also need to fill the check data structure to map the weaving function to the Type of node
//  */
// export class RoboMlAcceptWeaver {
//     weaveConcept(node : InterfaceAST.Concept, accept : ValidationAcceptor) : void{
//         (<any> node).accept = (visitor: RoboMLVisitor) => {return visitor.visitConcept(node as unknown as ClassAST.Concept);}
//     }

//     checks: ValidationChecks<RoboMlAstType> = {
//         Concept : this.weaveConcept
//     };

// }