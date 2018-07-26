// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../entry";

import { assert } from "chai";

import { guardsApprove } from "../../../../../src/robotlegs/bender/framework/impl/guardsApprove";
import { RobotlegsInjector } from "../../../../../src/robotlegs/bender/framework/impl/RobotlegsInjector";

import { BossGuard } from "./guardSupport/BossGuard";
import { GrumpyGuard } from "./guardSupport/GrumpyGuard";
import { HappyGuard } from "./guardSupport/HappyGuard";
import { JustTheMiddleManGuard } from "./guardSupport/JustTheMiddleManGuard";

describe("guardsApprove", () => {
    function happyFunction(): boolean {
        return true;
    }

    function grumpyFunction(): boolean {
        return false;
    }

    function falseyGuardFunction(): number {
        return 0;
    }

    function guardInstanceWithoutApprove(): void {
        guardsApprove([{}]);
    }

    let falseyGuardObject: object = {
        approve: (): number => {
            return 0;
        }
    };

    it("grumpy function should return false", () => {
        assert.isFalse(guardsApprove([grumpyFunction]));
    });

    it("happy function should return true", () => {
        assert.isTrue(guardsApprove([happyFunction]));
    });

    it("grumpy class should return false", () => {
        assert.isFalse(guardsApprove([GrumpyGuard]));
    });

    it("happy class should return true", () => {
        assert.isTrue(guardsApprove([HappyGuard]));
    });

    it("grumpy instance should return false", () => {
        assert.isFalse(guardsApprove([new GrumpyGuard()]));
    });

    it("happy instance should return true", () => {
        assert.isTrue(guardsApprove([new HappyGuard()]));
    });

    it("guard with injections returns false if injected guard says so", () => {
        let injector: RobotlegsInjector = new RobotlegsInjector();
        injector.bind(BossGuard).toConstantValue(new BossGuard(false));
        assert.isFalse(guardsApprove([JustTheMiddleManGuard], injector));
    });

    it("guard with injections returns true if injected guard says so", () => {
        let injector: RobotlegsInjector = new RobotlegsInjector();
        injector.bind(BossGuard).toConstantValue(new BossGuard(true));
        assert.isTrue(guardsApprove([JustTheMiddleManGuard], injector));
    });

    it("guards with a grumpy class returns false", () => {
        assert.isFalse(guardsApprove([HappyGuard, GrumpyGuard]));
    });

    it("guards with a grumpy instance returns false", () => {
        assert.isFalse(guardsApprove([new HappyGuard(), new GrumpyGuard()]));
    });

    it("guards with a grumpy function returns false", () => {
        assert.isFalse(guardsApprove([happyFunction, grumpyFunction]));
    });

    it("falsey function returns false", () => {
        assert.isFalse(guardsApprove([falseyGuardFunction]));
    });

    it("falsey approve returns false", () => {
        assert.isFalse(guardsApprove([falseyGuardObject]));
    });

    it("guard instance without approve throws error", () => {
        assert.throws(guardInstanceWithoutApprove, TypeError);
    });
});
