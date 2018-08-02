# RobotlegsJS Core Changelog:

## Robotlegs-Core 1.0.0

### v1.0.0 - Planned stable version

- [ ] Rethink **Events** package, in order to avoid confusion between **DOM** event system.

- [ ] Organize **matching** extension, moving **Interfaces** to a **api** folder and **Implementations** to a **impl** folder.

- [ ] Move helper methods to a specific folder.

- [ ] Use [**Function Types**](https://www.typescriptlang.org/docs/handbook/functions.html) for handlers and callbacks instead of generic **Function** type.

- [ ] Update **Prettier** rules:

  - [x] **printWidth** should be around **140** characters per line.

  - [x] Find a way to keep a new line between **@inject** anotation and property declarations.

- [ ] Improve Code Coverage to reach 100%.

- [ ] Migrate [original documentation](https://github.com/robotlegs/robotlegs-framework/blob/master/src/readme.md) and adapt it to TypeScript.

## Robotlegs-Core 0.2.0

### v0.2.0

Major Breaking Changes:
---

- **IEvent** interface changed to remove usage of **IEventInit** interface (see #57).

    - Interface **IEvent** was:
    ```typescript
    export interface IEvent {
        type: string;
        defaultPrevented?: boolean;
        bubbles?: boolean;
        target?: any;
        currentTarget?: any;
        detail?: any;
    }
    ```

    - Interface **IEvent** is now:
    ```typescript
    export interface IEvent {
        type: string;
        bubbles?: boolean;
        cancelable?: boolean;
        isDefaultPrevented?: boolean;
        isPropagationStopped?: boolean;
        isPropagationImmediateStopped?: boolean;
        currentTarget?: any;
        target?: any;
        data?: any;
        preventDefault(): void;
        stopPropagation(): void;
        stopImmediatePropagation(): void;
    }
    ```

- Constructor of **Event** class changed to remove usage of **IEventInit** interface (see #57).

    - Constructor of **Event** class was:
    ```typescript
    export class Event implements IEvent {
        constructor(type: string, eventInit: IEventInit = { bubbles: false }) {
            this.type = type;
            this.defaultPrevented = false;
            this.bubbles = eventInit.bubbles;
            this.detail = eventInit.detail;
        }
    }
    ```

    - Constructor of **Event** is now:
    ```typescript
    export class Event implements IEvent {
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, data?: any) {
            this._type = type;
            this._bubbles = !!bubbles;
            this._cancelable = !!cancelable;
            this._data = data;
        }
    }
    ```

Features Or Improvements:
---

- Update Inversify to version 4.13.0 (see #61).

- Enforce TSLint rules (see #57).

- Update TypeScript Compiler Options to be more strict and to generate inline source maps (see #56, #71).

- Use [tslib](https://github.com/Microsoft/tslib) library to avoid duplicated declarations (see #71).

- Adopts year-agnostic copyright message (see #70).

- Improve public API, exposing more classes on index (see #72).

- Disable **removeComments** flag in **tsconfig.json** file, allowing comments to appear in output (see #73)

- Update README to improve installation instructions and update references for plugins (see #75).

- Update dev dependencies to latest version.

## Robotlegs-Core 0.1.0

### [v0.1.3](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.1.3) - 2018-03-04

- Update Inversify to version 4.11.1 (see #47).

### [v0.1.2](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.1.2) - 2018-03-04

- Use `rimraf` instead of `rm -rf`.

- Update Prettier rules (see #46).

- Update CODEBEAT project UUID (see #44).

- Update codeclimate settings (see #43).

- Update dev dependencies to latest version.

### [v0.1.1](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.1.1) - 2017-11-13

- Strict Type Checking for TypeMatcher class (see #32).

- Update .npmignore (see #31).

- Update dev dependencies to latest version.

### [v0.1.0](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.1.0) - 2017-11-10

Major Breaking Changes:
---

- Remove usage of types **Number**, **String**, **Boolean** and **Object** (see #26).

- Improve **matching** extension (see #26).

- The usage of **ICommand** is mandatory (see #26).

- **EventMap** handles DOM events properly (see #26).

- **InjectorActivityLoggingExtension** extension removed (see #26).

Features Or Improvements:
---

- Add helper method **getQualifiedClassName** (see #26).

- Add helper method **isInstanceOfType** (see #26)

- Add Changelog (see #26).

- Improve Code Coverage and Fix Bugs (see #26).

- Add Code of Conduct (see #27).

- Add Issue Template (see #28).

- Add Pull Request Template (see #29).

- Upgraded **Inversify** to version [4.5.1](https://github.com/inversify/InversifyJS/releases/tag/4.5.1) (see #30)

- Update dev dependencies to latest version.

## Robotlegs-Core 0.0.1

### [v0.0.7](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.0.7) - 2017-10-31

- **Event** class reads **bubbles** parameter passed through constructor (see #20)

- Solve compilers deprecation warning messages from mocha.

- Upgraded **Inversify** to version [4.4.0](https://github.com/inversify/InversifyJS/releases/tag/4.4.0)

- Update dev dependencies to latest version.

### [v0.0.6](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.0.6) - 2017-09-26

- Add reference to [RobotlegsJS-Pixi-SignalMediator](https://github.com/RobotlegsJS/RobotlegsJS-Pixi-SignalMediator) extension.

- Adapt to NPM [v5.0.0](http://blog.npmjs.org/post/161081169345/v500) (see #12).

- Use Map instances properly (see #13).

- Update dev dependencies to latest version.

### [v0.0.5](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.0.5) - 2017-09-15

- Add reference to [RobotlegsJS-Pixi-Palidor](https://github.com/RobotlegsJS/RobotlegsJS-Pixi-Palidor) extension.

- Add support to [Prettier](https://prettier.io) code formatter (see #8).

- Add support to [Istanbul](https://istanbul.js.org) test coverage tool (see #10).

- Add integration with [CodeBeat](https://codebeat.co) (see #9).

- Update TSLint rules (see #7).

- Update logo.

- Update dev dependencies to latest version.

### [v0.0.4](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.0.4) - 2017-08-30

- Enable GreenKeeper (see #5).

- Update dev dependencies to latest version.

### [v0.0.3](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.0.3) - 2017-08-11

- Update contributing guidelines.

### [v0.0.2](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.0.2) - 2017-08-11

- Update README.

- Update dev dependencies to latest version.

### [v0.0.1](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.0.1) - 2017-08-06

- Project moved to it's own organization and renamed to [**@robotlegsjs/core**](https://www.npmjs.com/package/@robotlegsjs/core).

- The version **0.0.1** is compatible to version **1.0.1** of [**robotlegsjs**](https://www.npmjs.com/package/robotlegs) package.

- For the changelog of older versions, check the log of previous [releases](https://github.com/GoodgameStudios/RobotlegsJS/releases).
