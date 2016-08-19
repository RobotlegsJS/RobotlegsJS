RobotlegsJS
===

Robotlegs is a architecture-based framework for canvas applications. This
version is a direct port from the [ActionScript 3.0
codebase](https://github.com/robotlegs/robotlegs-framework) to
JavaScript/TypeScript. See the [motivation](#motivation) behind it.

**Features**

- Dependency injection (through [InversifyJS](https://github.com/inversify/InversifyJS))
- Command management
- View management

Quickstart
===

## Creating A Context

To create a Robotlegs application or module you need to instantiate a Context. A context won't do much without some configuration.

Plain ActionScript:

```ts
let context = new Context()
        .install(MVCSBundle)
        .configure(MyAppConfig, SomeOtherConfig)
        .configure(new ContextView(this));
```

We install the MVCSBundle, which in turn installs a number of commonly used Extensions. We then add some custom application configurations.

We pass the instance "this" through as the "contextView" which is required by many of the view related extensions. It must be installed after the bundle or it won't be processed. Also, it should always be added as the final configuration as it may trigger context initialization.

Note: You must hold on to the context instance or it will be garbage collected.

[See Framework docs.](docs/robotlegs/framework)

## Context Initialization

If a ContextView is provided the Context is automatically initialized when the supplied view lands on stage. Be sure to install the ContextView last, as it may trigger context initialization.

If a ContextView is not supplied then the Context must be manually initialized.

```ts
let context = new Context()
        .install(MyCompanyBundle)
        .configure(MyAppConfig, SomeOtherConfig)
        .initialize();
```

Note: This does not apply to Flex MXML configuration as the ContextView is automatically determined and initialization will be automatic.

[See ContextView docs.](docs/robotlegs/extensions/contextView)

## Application & Module Configuration

A simple application configuration file might look something like this:

```ts
import {
   IConfig,
   IInjector,
   IMediatorMap,
   IEventCommandMap,
   ContextView,
   inject
} from "robotlegs";

public class MyAppConfig implements IConfig
{

    constructor(
        @inject(IInjector) public injector: IInjector,
        @inject(IMediatorMap) public mediatorMap: IMediatorMap,
        @inject(IEventCommandMap) public commandMap: IEventCommandMap,
        @inject(IContextView) public contextView: IEventCommandMap,
    ) {
    }

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
        // If this was a Flex application we would need to cast it
        // as an IVisualElementContainer and call addElement().
        this.contextView.view.addChild(new MainView());
    }
}
```

The configuration file above implements IConfig. An instance of this class will be created automatically when the context initializes.

We Inject the utilities that we want to configure, and add our Main View to the Context View.

[See Framework documentation](docs/robotlegs/framework)

### An Example Mediator

The mediator we mapped above might look like this:

```ts
public class UserProfileMediator extends Mediator
{
    constructor (
        @inject(UserProfileView) public view
    ) {
    }

    public function initialize():void
    {
        // Redispatch an event from the view to the framework
        this.addViewListener(UserEvent.SIGN_IN, dispatch);
    }
}
```

The view that caused this mediator to be created is available for Injection.

[MediatorMap](https://github.com/robotlegs/robotlegs-framework/tree/master/src/robotlegs/bender/extensions/mediatorMap)

### An Example Command

The command we mapped above might look like this:

```ts
import { Command } fro "robotlegs";

public class UserSignInCommand extends Command
{
    constructor (
        @inject(UserEvent) event: UserEvent,
        @inject(UserModel) model: UserModel
    ) {
    }

    public function execute(): void
    {
        if (event.username == "bob")
            model.signedIn = true;
    }
}
```

The event that triggered this command is available for Injection.

[See EventCommandMap docs.](docs/robotlegs/extensions/eventCommandMap)

Motivation
---

There is plenty of frameworks and patterns out there that helps you to write
DOM-based applications. There is no scalable solution yet to architecture a
canvas-based application though.

Robotlegs has proven itself of being a mature solution from the ActionScript
community for interactive experiences.

License
---

[MIT](LICENSE.md)
