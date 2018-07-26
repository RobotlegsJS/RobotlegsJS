// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import "../../../../../entry";

import { assert } from "chai";

import { LogMessageParser } from "../../../../../../src/robotlegs/bender/extensions/enhancedLogging/impl/LogMessageParser";

describe("LogMessageParser", () => {
    let logMessageParser: LogMessageParser;

    beforeEach(() => {
        logMessageParser = new LogMessageParser();
    });

    afterEach(() => {
        logMessageParser = null;
    });

    it("LogMessageParser_is_created", () => {
        assert.instanceOf(logMessageParser, LogMessageParser);
    });

    it("parseMessage_parse_empty_message", () => {
        const expected: string = "";
        let actual: string = logMessageParser.parseMessage("", []);

        assert.equal(actual, expected);
    });

    it("parseMessage_parse_message_without_parameters", () => {
        const expected: string = "Please do not change me!";
        let actual: string = logMessageParser.parseMessage("Please do not change me!", null);

        assert.equal(actual, expected);
    });

    it("parseMessage_parse_message_with_one_parameter", () => {
        const expected: string = "=> Hello World! <=";
        let actual: string = logMessageParser.parseMessage("=> {0} <=", ["Hello World!"]);

        assert.equal(actual, expected);
    });

    it("parseMessage_parse_message_with_parameters", () => {
        const expected: string = "Lets count to ten: 1, 2, 3, 4, 5, 6, 7, 8, 9 and 10!!!";
        let actual: string = logMessageParser.parseMessage("Lets count to ten: {0}, {1}, {2}, {3}, {4}, {5}, {6}, {7}, {8} and {9}!!!", [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10
        ]);

        assert.equal(actual, expected);
    });
});
