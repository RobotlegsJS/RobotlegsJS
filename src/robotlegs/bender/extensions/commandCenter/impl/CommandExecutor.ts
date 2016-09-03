// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { ICommandExecutor } from "../api/ICommandExecutor";
import { ICommandMapping } from "../api/ICommandMapping";
import { CommandPayload } from "../api/CommandPayload";

import { IInjector } from "../../../framework/api/IInjector";

import { applyHooks } from "../../../framework/impl/applyHooks";
import { guardsApprove } from "../../../framework/impl/guardsApprove";

/**
 * @private
 */
export class CommandExecutor implements ICommandExecutor {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _injector: IInjector;

    private _removeMapping: Function;

    private _handleResult: Function;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * Creates a Command Executor
     * @param injector The Injector to use. A child injector will be created from it.
     * @param removeMapping Remove mapping handler (optional)
     * @param handleResult Result handler (optional)
     */
    constructor(injector: IInjector, removeMapping?: Function, handleResult?: Function) {
        this._injector = injector.createChild();
        this._removeMapping = removeMapping;
        this._handleResult = handleResult;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @inheritDoc
     */
    public executeCommands(mappings: ICommandMapping[], payload?: CommandPayload): void {
        let length: number = mappings.length;
        for (let i: number = 0; i < length; i++) {
            this.executeCommand(mappings[i], payload);
        }
    }

    /**
     * @inheritDoc
     */
    public executeCommand(mapping: ICommandMapping, payload?: CommandPayload): void {
        let hasPayload: boolean = payload && payload.hasPayload();
        let injectionEnabled: boolean = hasPayload && mapping.payloadInjectionEnabled;
        let command: any = null;

        if (injectionEnabled) {
            this.mapPayload(payload);
        }

        if (mapping.guards.length === 0 || guardsApprove(mapping.guards, this._injector)) {
            let commandClass: Object = mapping.commandClass;

            if (mapping.fireOnce && this._removeMapping) {
                this._removeMapping(mapping);
            }

            command = this._injector.instantiateUnmapped<any>(<any>commandClass);

            if (mapping.hooks.length > 0) {
                this._injector.bind(commandClass).toConstantValue(command);
                applyHooks(mapping.hooks, this._injector);
                this._injector.unbind(commandClass);
            }
        }

        if (injectionEnabled) {
            this.unmapPayload(payload);
        }

        if (command && mapping.executeMethod) {
            let executeMethod: Function = command[mapping.executeMethod].bind(command);
            let result: any = (hasPayload && executeMethod.length > 0)
                ? executeMethod.apply(command, payload.values)
                : executeMethod();
            if (this._handleResult) {
                this._handleResult(result, command, mapping);
            }
        }
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private mapPayload(payload: CommandPayload): void {
        let i: number = payload.length;
        while (i--) {
            this._injector.bind(payload.classes[i]).toConstantValue(payload.values[i]);
        }
    }

    private unmapPayload(payload: CommandPayload): void {
        let i: number = payload.length;
        while (i--) {
            this._injector.unbind(payload.classes[i]);
        }
    }
}
