# Contributing to RobotlegsJS

## Setup

1 - Clone your fork of the repository:
```
$ git clone https://github.com/YOUR_USERNAME/RobotlegsJS.git
```

2 - Install npm dependencies using yarn:
```
$ yarn install
```

3 - Run start process
```
$ yarn start
```

4 - Run test process
```
$ yarn test
```

## Guidelines

- Please try to [combine multiple commits before
pushing](http://stackoverflow.com/questions/6934752/combining-multiple-commits-before-pushing-in-git).

- Please use `TDD` when fixing bugs. This means that you should write a unit
test that fails because it reproduces the issue, then fix the issue and finally run
the test to ensure that the issue has been resolved. This helps us to prevent
fixed bugs from happening again in the future.

- Always format your code using `yarn run autoformat`.

- Please keep the test coverage at 100%. Write additional unit test if
necessary.

-  Please create an issue before sending a PR if your commit is going to change the
public interface of RobotlegsJS or it includes significant architecture
changes.

- Feel free to ask for help from other members of the RobotlegsJS team via the
[gitter chat]((https://gitter.im/RobotlegsJS/RobotlegsJS)) or
[github issues](https://github.com/RobotlegsJS/RobotlegsJS/issues).