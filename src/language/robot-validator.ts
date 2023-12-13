//import type { ValidationAcceptor } from 'langium';
import type { ValidationChecks } from 'langium';

import type { RobotAstType } from './generated/ast.js';
//import type { Person } from './generated/ast.js';
import type { RobotServices } from './robot-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: RobotServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.RobotValidator;
    const checks: ValidationChecks<RobotAstType> = {
        //Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class RobotValidator {

    // checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
    //     if (person.name) {
    //         const firstChar = person.name.substring(0, 1);
    //         if (firstChar.toUpperCase() !== firstChar) {
    //             accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
    //         }
    //     }
    // }

}
