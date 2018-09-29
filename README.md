# RobotlegsJS <img src="media/robotlegs.png?raw=true" width="30" height="30" />

[![GitHub license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/RobotlegsJS/RobotlegsJS/blob/master/LICENSE)
[![Gitter chat](https://badges.gitter.im/RobotlegsJS/RobotlegsJS.svg)](https://gitter.im/RobotlegsJS/RobotlegsJS)
[![Build Status](https://secure.travis-ci.org/RobotlegsJS/RobotlegsJS.svg?branch=master)](https://travis-ci.org/RobotlegsJS/RobotlegsJS)
[![codebeat badge](https://codebeat.co/badges/71e222e9-851f-456d-85da-191686af0be5)](https://codebeat.co/projects/github-com-robotlegsjs-robotlegsjs-master)
[![Maintainability](https://api.codeclimate.com/v1/badges/6a6bb3d51f955aef1cd7/maintainability)](https://codeclimate.com/github/RobotlegsJS/RobotlegsJS/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/6a6bb3d51f955aef1cd7/test_coverage)](https://codeclimate.com/github/RobotlegsJS/RobotlegsJS/test_coverage)
[![npm version](https://badge.fury.io/js/%40robotlegsjs%2Fcore.svg)](https://badge.fury.io/js/%40robotlegsjs%2Fcore)
[![Greenkeeper badge](https://badges.greenkeeper.io/RobotlegsJS/RobotlegsJS.svg)](https://greenkeeper.io/)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

RobotlegsJS is a architecture-based IoC framework for JavaScript/TypeScript. This
version is a direct port from the [ActionScript 3.0 codebase](https://github.com/robotlegs/robotlegs-framework).
See the [motivation](#motivation) behind it.

Right now, this framework has extensions for [pixi.js v4](https://github.com/pixijs/pixi.js), [easeljs](https://github.com/CreateJS/EaselJS),
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

## Quickstart

### Creating A Context

To create a Robotlegs application or module you need to instantiate a Context. A
context won't do much without some configuration.

```ts
let renderer = PIXI.autoDetectRenderer(800, 600, {});
let context = new Context()
        .install(MVCSBundle)
        .configure(MyAppConfig, SomeOtherConfig)
        .configure(new ContextView((<any>this.renderer).plugins.interaction));
```

We install the MVCSBundle, which in turn installs a number of commonly used
Extensions. We then add some custom application configurations.

We pass the instance "this" through as the "contextView" which is required by
many of the view related extensions. It must be installed after the bundle or it
won't be processed. Also, it should always be added as the final configuration
as it may trigger context initialization.

Note: You must hold on to the context instance or it will be garbage collected.

[See Framework docs.](docs/robotlegs/framework)

### Context Initialization

If a ContextView is provided the Context is automatically initialized when the
supplied view lands on stage. Be sure to install the ContextView last, as it may
trigger context initialization.

If a ContextView is not supplied then the Context must be manually initialized.

```ts
let context = new Context()
        .install(MyCompanyBundle)
        .configure(MyAppConfig, SomeOtherConfig)
        .initialize();
```

Note: This does not apply to Flex MXML configuration as the ContextView is
automatically determined and initialization will be automatic.

[See ContextView docs.](docs/robotlegs/extensions/contextView)

### Application & Module Configuration

A simple application configuration file might look something like this:

```ts
import {
   IConfig,
   IInjector,
   IMediatorMap,
   IEventCommandMap,
   ContextView,
   inject
} from "@robotlegsjs/core";

public class MyAppConfig implements IConfig
{

    @inject(IInjector)
    injector: IInjector;

    @inject(IMediatorMap)
    mediatorMap: IMediatorMap;

    @inject(IEventCommandMap)
    commandMap: IEventCommandMap;

    @inject(IContextView)
    contextView: IEventCommandMap;

    public function configure(): void
    {
        // Map UserModel as a context enforced singleton
        this.injector.bind(UserModel).toSelf().inSingletonScope();

        // Create a UserProfileMediator for each UserProfileView
        // that lands inside of the Context View
        this.mediatorMap.map(UserProfileView).toMediator(UserProfileMediator);

        // Execute UserSignInCommand when UserEvent.SIGN_IN
        // is dispatched on the context's Event Dispatcher
        this.commandMap.map(UserEvent.SIGN_IN).toCommand(UserSignInCommand);

        // The "view" property is a DisplayObjectContainer reference.
        this.contextView.view.addChild(new MainView());
    }
}
```

The configuration file above implements IConfig. An instance of this class will
be created automatically when the context initializes.

We Inject the utilities that we want to configure, and add our Main View to the
Context View.

[See Framework documentation](docs/robotlegs/framework)

#### An Example Mediator

The mediator we mapped above might look like this:

```ts
import { inject, IEventMap, IEventDispatcher, Mediator } from "@robotlegsjs/core";
import { UserProfileView } from "./UserProfileView";

public class UserProfileMediator extends Mediator<UserProfileView>
{
    public function initialize():void
    {
        // Redispatch an event from the view to the framework
        this.addViewListener(UserEvent.SIGN_IN, dispatch);
    }
}
```

The view that caused this mediator to be created is available for Injection.

[MediatorMap](https://github.com/robotlegs/robotlegs-framework/tree/master/src/robotlegs/bender/extensions/mediatorMap)

#### An Example Command

The command we mapped above might look like this:

```ts
import { Command, inject } from "@robotlegsjs/core";

public class UserSignInCommand extends Command
{
    @inject(UserEvent)
    event: UserEvent;

    @inject(UserModel)
    model: UserModel;

    public function execute(): void
    {
        if (event.username == "bob")
            model.signedIn = true;
    }
}
```

The event that triggered this command is available for Injection.

[See EventCommandMap docs.](docs/robotlegs/extensions/eventCommandMap)

## Motivation

There are many frameworks and patterns out there that helps you to write
DOM-based applications. There is no scalable solution yet to architecture a
canvas-based application though.

[Robotlegs](https://github.com/robotlegs/robotlegs-framework) has proven itself of being a mature solution from the ActionScript
community for interactive experiences.

## License

[MIT](LICENSE)
