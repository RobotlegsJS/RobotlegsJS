# RobotlegsJS Core Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Suggestions or improvements for further versions

- [ ] Rethink **Events** package, in order to avoid confusion between **DOM** event system.

- [ ] Organize **matching** extension, moving **Interfaces** to a **api** folder and **Implementations** to a **impl** folder.

- [ ] Move helper methods to a specific folder.

- [ ] Use [**Function Types**](https://www.typescriptlang.org/docs/handbook/functions.html) for handlers and callbacks instead of generic **Function** type.

- [x] Update **Prettier** rules:

  - [x] **printWidth** should be around **140** characters per line.

  - [x] Find a way to keep a new line between **@inject** anotation and property declarations.

- [ ] Improve Code Coverage to reach 100%.

- [ ] Migrate [original documentation](https://github.com/robotlegs/robotlegs-framework/blob/master/src/readme.md) and adapt it to TypeScript.

## [Unreleased]

<!--
Types of changes:

#### Added
- for new features.

#### Changed
- for changes in existing functionality.

#### Deprecated
- for soon-to-be removed features.

#### Removed
- for now removed features.

#### Fixed
- for any bug fixes.

#### Security
- in case of vulnerabilities.
-->

#### Added

- Add **Tidelift** as funding option (see #133).

- Add **Enterprise Support** information (see #134).

#### Changed

- Update `tslib` to version `1.11.1` (see #137).

#### Security

- Migrate to [terser-webpack-plugin](https://github.com/webpack-contrib/terser-webpack-plugin) to solve security vulnerability (see #132).

## Robotlegs-Core 1.0.0

### [v1.0.3](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/1.0.3) - 2019-10-20

#### Changed

- Update `instanbul` settings (see #124).

- Migrate project to `travis-ci.com`.

- Update `codebeat` Project UUID.

- Update dev dependencies to latest version.

### [v1.0.2](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/1.0.2) - 2019-07-18

#### Changed

- Fix security vulnerabilities related to outdated dependencies (see #117).

- Update dev dependencies to latest version.

### [v1.0.1](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/1.0.1) - 2019-03-20

#### Changed

- Improve `prettier` rules and `autoformat` script (see #109).

- Enable `"editor.formatOnSave"` rule for `VS Code` (see #109).

- Update dev dependencies to latest version.

### [v1.0.0](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/1.0.0) - 2018-11-25

#### Added

- Add reference to [EventEmitter3](https://github.com/RobotlegsJS/RobotlegsJS-EventEmitter3) extension (see #87).

- Add reference to some companies using the `RobotlegsJS` framework (see #99).

#### Changed

- Update [Inversify](https://github.com/inversify/InversifyJS) to version `5.0.1` (see #90, #91).

  - This version of `Inversify` has a breaking change on the `Public API`. The method `guid` was renamed to `id`:

    ```typescript
    let idCounter = 0;

    function id(): number {
        return idCounter++;
    }

    export { id };
    ```

    Since this breaking change was mistakenly released as version `4.14.0` (now deprecated),
    we opted to release a `major` version of our package, even when there are no breaking changes on our side.

- Migrate to headless Chrome (see #96).

- Improve performance of Karma (see #97).

- Prepare package for stable version (see #98).

- Update GitHub Templates (see #102).

- Update dev dependencies to latest version.

#### Fixed

- Solve unit tests triggered by karma (see #95).

## Robotlegs-Core 0.2.0

### [v0.2.1](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.2.1) - 2018-09-12

#### Added

- Add reference to [CreateJS](https://github.com/RobotlegsJS/RobotlegsJS-CreateJS) extension (see #77).

- Add reference to [OpenFL](https://github.com/RobotlegsJS/RobotlegsJS-OpenFL) extension (see #79).

#### Changed

- Update `karma` setup to generate code coverage report only for `src` folder (see #78).

- Expose internal properties of `EventMap`, allowing the class to be extended (see #82).

- Update dev dependencies to latest version.

### [v0.2.0](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.2.0) - 2018-08-02

#### Changed

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

- Update Inversify to version 4.13.0 (see #61).

- Enforce TSLint rules (see #57).

- Update TypeScript Compiler Options to be more strict and to generate inline source maps (see #56, #71).

- Use [tslib](https://github.com/Microsoft/tslib) library to avoid duplicated declarations (see #71).

- Adopts year-agnostic copyright message (see #70).

- Improve public API, exposing more classes on index (see #72).

- Disable **removeComments** flag in **tsconfig.json** file, allowing comments to appear in output (see #73)

- Update README to improve installation instructions and update references for plugins (see #75).

- Update reference to Robotlegs Framework (see #76).

- Update dev dependencies to latest version.

## Robotlegs-Core 0.1.0

### [v0.1.3](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.1.3) - 2018-03-04

#### Changed

- Update Inversify to version 4.11.1 (see #47).

### [v0.1.2](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.1.2) - 2018-03-04

#### Changed

- Use `rimraf` instead of `rm -rf`.

- Update Prettier rules (see #46).

- Update CODEBEAT project UUID (see #44).

- Update codeclimate settings (see #43).

- Update dev dependencies to latest version.

### [v0.1.1](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.1.1) - 2017-11-13

#### Changed

- Strict Type Checking for TypeMatcher class (see #32).

- Update .npmignore (see #31).

- Update dev dependencies to latest version.

### [v0.1.0](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.1.0) - 2017-11-10

#### Added

- Add helper method **getQualifiedClassName** (see #26).

- Add helper method **isInstanceOfType** (see #26)

- Add Changelog (see #26).

- Add Code of Conduct (see #27).

- Add Issue Template (see #28).

- Add Pull Request Template (see #29).

#### Changed

- Remove usage of types **Number**, **String**, **Boolean** and **Object** (see #26).

- Improve **matching** extension (see #26).

- The usage of **ICommand** is mandatory (see #26).

- **EventMap** handles `DOM` events properly (see #26).

- **InjectorActivityLoggingExtension** extension removed (see #26).

- Improve Code Coverage and Fix Bugs (see #26).

- Upgraded **Inversify** to version [4.5.1](https://github.com/inversify/InversifyJS/releases/tag/4.5.1) (see #30)

- Update dev dependencies to latest version.

## Robotlegs-Core 0.0.1

### [v0.0.7](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.0.7) - 2017-10-31

#### Changed

- **Event** class reads **bubbles** parameter passed through constructor (see #20)

- Solve compilers deprecation warning messages from mocha.

- Upgraded **Inversify** to version [4.4.0](https://github.com/inversify/InversifyJS/releases/tag/4.4.0)

- Update dev dependencies to latest version.

### [v0.0.6](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.0.6) - 2017-09-26

#### Added

- Add reference to [RobotlegsJS-Pixi-SignalMediator](https://github.com/RobotlegsJS/RobotlegsJS-Pixi-SignalMediator) extension.

#### Changed

- Adapt to NPM [v5.0.0](http://blog.npmjs.org/post/161081169345/v500) (see #12).

- Use Map instances properly (see #13).

- Update dev dependencies to latest version.

### [v0.0.5](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.0.5) - 2017-09-15

#### Added

- Add reference to [RobotlegsJS-Pixi-Palidor](https://github.com/RobotlegsJS/RobotlegsJS-Pixi-Palidor) extension.

- Add support to [Prettier](https://prettier.io) code formatter (see #8).

- Add support to [Istanbul](https://istanbul.js.org) test coverage tool (see #10).

- Add integration with [CodeBeat](https://codebeat.co) (see #9).

#### Changed

- Update TSLint rules (see #7).

- Update logo.

- Update dev dependencies to latest version.

### [v0.0.4](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.0.4) - 2017-08-30

#### Added

- Enable GreenKeeper (see #5).

#### Changed

- Update dev dependencies to latest version.

### [v0.0.3](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.0.3) - 2017-08-11

#### Changed

- Update contributing guidelines.

### [v0.0.2](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.0.2) - 2017-08-11

#### Changed

- Update README.

- Update dev dependencies to latest version.

### [v0.0.1](https://github.com/RobotlegsJS/RobotlegsJS/releases/tag/0.0.1) - 2017-08-06

- Project moved to it's own organization and renamed to [**@robotlegsjs/core**](https://www.npmjs.com/package/@robotlegsjs/core).

- The version **0.0.1** is compatible to version **1.0.1** of [**robotlegsjs**](https://www.npmjs.com/package/robotlegs) package.

- For the changelog of older versions, check the log of previous [releases](https://github.com/GoodgameStudios/RobotlegsJS/releases).
