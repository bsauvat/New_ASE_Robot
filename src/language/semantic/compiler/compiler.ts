import { Body, Condition, BOOL_const, Fonction, CallFunction, GetDistance, GetSpeed, GetTimestamp, 
    Backward, Forward, Loop, ProgRobot, INT_const, Print, SpeedCommand, TurnLeft, TurnRight, CallVariable,
    VariableDeclaration, UpdateVariable,INT_neg_const, DeclaredParameter, StrafeRight, StrafeLeft, Return, STRING_const } from '../../generated/ast.js'

import { BinaryArithmeticExpression, BinaryBooleanExpression, RobotVisitor, acceptNode } from '../visitor.js'

export class RobotCompilerImpl implements RobotVisitor {

private arduinoCode = 
        `
        #include <PinChangeInt.h>
        #include <PinChangeIntConfig.h>
        #include <EEPROM.h>
        #define _NAMIKI_MOTOR	 //for Namiki 22CL-103501PG80:1
        #include <fuzzy_table.h>
        #include <PID_Beta6.h>
        #include <MotorWheel.h>
        #include <Omni4WD.h>
        
        //#include <fuzzy_table.h>
        //#include <PID_Beta6.h>
        
        /*
        
                    \                    /
        wheel1   \                    /   wheel4
        Left     \                    /   Right
        
        
                                    power switch
        
                    /                    \
        wheel2   /                    \   wheel3
        Right    /                    \   Left
        
        */
        
        /*
        irqISR(irq1,isr1);
        MotorWheel wheel1(5,4,12,13,&irq1);
        
        irqISR(irq2,isr2);
        MotorWheel wheel2(6,7,14,15,&irq2);
        
        irqISR(irq3,isr3);
        MotorWheel wheel3(9,8,16,17,&irq3);
        
        irqISR(irq4,isr4);
        MotorWheel wheel4(10,11,18,19,&irq4);
        */
        
        irqISR(irq1, isr1);
        MotorWheel wheel1(3, 2, 4, 5, &irq1);
        
        irqISR(irq2, isr2);
        MotorWheel wheel2(11, 12, 14, 15, &irq2);
        
        irqISR(irq3, isr3);
        MotorWheel wheel3(9, 8, 16, 17, &irq3);
        
        irqISR(irq4, isr4);
        MotorWheel wheel4(10, 7, 18, 19, &irq4);
        
        
        Omni4WD Omni(&wheel1, &wheel2, &wheel3, &wheel4);
        
        void setup() {
            //TCCR0B=TCCR0B&0xf8|0x01;    // warning!! it will change millis()
            TCCR1B = TCCR1B & 0xf8 | 0x01; // Pin9,Pin10 PWM 31250Hz
            TCCR2B = TCCR2B & 0xf8 | 0x01; // Pin3,Pin11 PWM 31250Hz
            
            Omni.PIDEnable(0.31, 0.01, 0, 10);
        }

        void _forward(int distance) {
            Omni.setCarAdvance(Omni.getCarSpeedMMPS());
            Omni.delayMS(distance/Omni.getCarSpeedMMPS()*1000);
            Omni.setCarStop();
        }

        void _backward(int distance) {
            Omni.setCarBackoff(Omni.getCarSpeedMMPS());
            Omni.delayMS(distance/Omni.getCarSpeedMMPS()*1000);
            Omni.setCarStop();
        }

        void _left(int distance) {
            Omni.setCarLeft(Omni.getCarSpeedMMPS());
            Omni.delayMS(distance/Omni.getCarSpeedMMPS()*1000);
            Omni.setCarStop();
        }

        void _right(int distance) {
            Omni.setCarRight(Omni.getCarSpeedMMPS());
            Omni.delayMS(distance/Omni.getCarSpeedMMPS()*1000);
            Omni.setCarStop();
        }

        void _rotate(int angle) {
            if (angle > 0) {
                Omni.setCarRotateRight(Omni.getCarSpeedMMPS());
            } else {
                Omni.setCarRotateLeft(Omni.getCarSpeedMMPS());
            }
    
            int circumference = wheel1.getCirMM();
            int distance = (angle / 360.0) * circumference;
            int timeToWait = (distance / Omni.getCarSpeedMMPS()) * 1000;
            Omni.delayMS(timeToWait);
            Omni.setCarStop();
        }
        `;


    visitBinaryArithmeticExpression(node: BinaryArithmeticExpression){
        return `${acceptNode(node.left, this)} ${node.op} ${acceptNode(node, this)}`;
    }

    visitBinaryBooleanExpression(node: BinaryBooleanExpression){
        return `${acceptNode(node.left, this)} ${node.op} ${acceptNode(node, this)}`;
    }
    
    visitBody(node: Body){
        node.statements.forEach(statement => {
            this.arduinoCode += acceptNode(statement, this);
        });
        return this.arduinoCode;
    }

    
    visitFonction(node: Fonction){
        return "visitFonction";
    }

    visitCallFunction(node: CallFunction){
        return "visitCallFunction";
    }
    
    visitCondition(node: Condition){
        return "if (" + acceptNode(node, this) + ") { " + acceptNode(node.ifBody, this) + " }";
    }

    visitBackward(node: Backward){
        return "_backward(" + node.distance + ");";
    }

    visitForward(node: Forward){
        return "_forward(" + node.distance + ");";
    }

    visitLoop(node: Loop){
        return "while (" + acceptNode(node, this) + ") { " + acceptNode(node, this) + " }";
    }

    visitProgRobot(node: ProgRobot){
        return "progrobot()";
    }

    visitSpeedCommand(node: SpeedCommand){
        return "visitSpeedCommand";
    }

    visitCallVariable(node: CallVariable){
        return "visitCallVariable";
    }

    visitVariableDeclaration(node: VariableDeclaration){
        return "visitVariableDeclaration";
    }

    visitUpdateVariable(node: UpdateVariable){
        return "callUpdateVariable";
    }

    visitPrint(node: Print){
        return "visitPrint" + node.print;
    }

    visitGetSpeed(node: GetSpeed){ // Add a comma after the parameter declaration.
        return "getSpeed()";
    }

    visitGetDistance(node: GetDistance){
        return "getDistance()";
    }

    visitGetTimestamp(node: GetTimestamp){
        return "millis()";
    }

    visitBOOL_const(node: BOOL_const){
        return `${node.value}`;
    }

    visitDeclaredParameter(node: DeclaredParameter){
        return `${node.varame}`;
    }

    visitINT_const(node: INT_const){
        return `${node.value}`;
    }

    visitINT_neg_const(node: INT_neg_const){
        return `${node.value}`;
    }

    visitReturn(node: Return){
        return `return ${acceptNode(node, this)};`;
    }

    visitSTRING_const(node: STRING_const){
        return `${node.value}`;
    }

    visitStrafeLeft(node: StrafeLeft){
        return `_left(${node.distance});`;
    }

    visitStrafeRight(node: StrafeRight){
        return `_right(${node.distance});`;
    }

    visitTurnLeft(node: TurnLeft){
        return `_rotate(${node.angle});`;
    }

    visitTurnRight(node: TurnRight){    
        return `_rotate(${node.angle});`;
    }

}

