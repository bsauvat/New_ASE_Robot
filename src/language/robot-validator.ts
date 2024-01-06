import type { /*ValidationAcceptor,*/ ValidationChecks } from 'langium';
import type { RobotAstType } from './generated/ast.js';
import type { RobotServices } from './robot-module.js';
//import { ProgRobot } from './visitor.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: RobotServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.RobotValidator;
    const checks: ValidationChecks<RobotAstType> = {
        //ProgRobot: validator.checkUniqueDefs
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class RobotValidator {
    // checkUniqueDefs(robot: ProgRobot, accept: ValidationAcceptor): void {
    //     // create a set of visited functions
    //     // and report an error when we see one we've already seen
    //     const reported = new Set();
    //     robot.functions.forEach(f => {
    //         if (reported.has(f.name)) {
    //             accept('error',  `Function has non-unique name '${f.name}'.`,  {node: f, property: 'name'});
    //         }
    //         reported.add(f.name);
    //     });
    // }
}

