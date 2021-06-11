# Archived

**This repository is archived**. Development migrated to https://github.com/RobotlegsJS/RobotlegsJS-Framework/blob/master/packages/core.

# RobotlegsJS <img src="https://raw.githubusercontent.com/RobotlegsJS/RobotlegsJS/master/media/robotlegs.png" width="30" height="30" />

[![GitHub license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/RobotlegsJS/RobotlegsJS/blob/master/LICENSE)
[![Gitter chat](https://badges.gitter.im/RobotlegsJS/RobotlegsJS.svg)](https://gitter.im/RobotlegsJS/RobotlegsJS)
[![npm version](https://badge.fury.io/js/%40robotlegsjs%2Fcore.svg)](https://badge.fury.io/js/%40robotlegsjs%2Fcore)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

RobotlegsJS is a architecture-based IoC framework for JavaScript/TypeScript. This
version is a direct port from the [ActionScript 3.0 codebase](https://github.com/robotlegs/robotlegs-framework).
See the [motivation](#motivation) behind it.

Right now, this framework has extensions for [pixi.js v5](https://github.com/pixijs/pixi.js), [easeljs](https://github.com/CreateJS/EaselJS),
[openfl](https://github.com/openfl/openfl), [phaser-ce v2](https://github.com/photonstorm/phaser-ce) and [phaser v3](https://github.com/photonstorm/phaser).

**Features**

- Dependency injection (through [InversifyJS](https://github.com/inversify/InversifyJS))

- Command management

- View management

**Extensions**

- [RobotlegsJS-Macrobot](https://github.com/RobotlegsJS/RobotlegsJS-Macrobot): extends commands, adding support to async and macro commands.

- [RobotlegsJS-SignalCommandMap](https://github.com/RobotlegsJS/RobotlegsJS-SignalCommandMap): maps [SignalsJS](https://github.com/RobotlegsJS/SignalsJS) to commands.

- [RobotlegsJS-EventEmitter3](https://github.com/RobotlegsJS/RobotlegsJS-EventEmitter3): integrate RobotlegsJS with [EventEmitter3](https://github.com/primus/eventemitter3).

- [RobotlegsJS-Pixi](https://github.com/RobotlegsJS/RobotlegsJS-Pixi): integrate RobotlegsJS with [PixiJS](https://github.com/pixijs/pixi.js).

- [RobotlegsJS-Pixi-Palidor](https://github.com/RobotlegsJS/RobotlegsJS-Pixi-Palidor): a view manager extension for [RobotlegsJS-Pixi](https://github.com/RobotlegsJS/RobotlegsJS-Pixi).

- [RobotlegsJS-Pixi-SignalMediator](https://github.com/RobotlegsJS/RobotlegsJS-Pixi-SignalMediator): a port of [Robotlegs SignalMediator Extension](https://github.com/MrDodson/robotlegs-extensions-SignalMediator) to TypeScript.

- [RobotlegsJS-CreateJS](https://github.com/RobotlegsJS/RobotlegsJS-CreateJS): integrate RobotlegsJS with [EaselJS](https://github.com/CreateJS/EaselJS).

- [RobotlegsJS-OpenFL](https://github.com/RobotlegsJS/RobotlegsJS-OpenFL): integrate RobotlegsJS with [OpenFL](https://github.com/openfl/openfl).

- [RobotlegsJS-Phaser-CE](https://github.com/RobotlegsJS/RobotlegsJS-Phaser-CE): integrate RobotlegsJS with [Phaser-CE](https://github.com/photonstorm/phaser-ce).

- [RobotlegsJS-Phaser-CE-SignalCommandMap](https://github.com/RobotlegsJS/RobotlegsJS-Phaser-CE-SignalCommandMap): maps [Phaser.Signal](https://photonstorm.github.io/phaser-ce/Phaser.Signal.html) to commands.

- [RobotlegsJS-Phaser](https://github.com/RobotlegsJS/RobotlegsJS-Phaser): integrate RobotlegsJS with [Phaser](https://github.com/photonstorm/phaser).

## Installation

You can get the latest release and the type definitions using [NPM](https://www.npmjs.com/):

```bash
npm install @robotlegsjs/core reflect-metadata --save
```

Or using [Yarn](https://yarnpkg.com/en/):

```bash
yarn add @robotlegsjs/core reflect-metadata
````

> :warning: **Important!** RobotlegsJS requires TypeScript >= 2.0 and the `experimentalDecorators`, `emitDecoratorMetadata`, `types` and `lib`
compilation options in your `tsconfig.json` file.

```js
{
    "compilerOptions": {
        "target": "es5",
        "lib": ["es6", "dom"],
        "types": ["reflect-metadata"],
        "module": "commonjs",
        "moduleResolution": "node",
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    }
}
```

RobotlegsJS requires a modern JavaScript engine with support for:

- [Reflect metadata](https://rbuckton.github.io/reflect-metadata/)
- [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

If your environment doesn't support one of these you will need to import a shim or polyfill.

> :warning: **The `reflect-metadata` polyfill should be imported only once in your entire application** because the Reflect object is mean to be a global singleton. More details about this can be found [here](https://github.com/inversify/InversifyJS/issues/262#issuecomment-227593844).

## Motivation

There are many frameworks and patterns out there that helps you to write
DOM-based applications. There is no scalable solution yet to architecture a
canvas-based application though.

[Robotlegs](https://github.com/robotlegs/robotlegs-framework) has proven itself of being a mature solution from the ActionScript
community for interactive experiences.

## RobotlegsJS for enterprise

Available as part of the Tidelift Subscription

The maintainers of [@robotlegsjs/core](https://github.com/RobotlegsJS/RobotlegsJS) and thousands of other packages are working with Tidelift to deliver commercial support and maintenance for the open source dependencies you use to build your applications. Save time, reduce risk, and improve code health, while paying the maintainers of the exact dependencies you use. [Learn more.](https://tidelift.com/subscription/pkg/npm-robotlegsjs-core?utm_source=npm-robotlegsjs-core&utm_medium=referral&utm_campaign=enterprise&utm_term=repo)

## License

[MIT](LICENSE)
