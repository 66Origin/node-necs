# Not an ECS

`NECS` is not an `ECS`.

It take some principles from the `ECS` pattern but break some of its rules.

**In short:**

- Entity, Components and Systems.
- Components are not pure data, they can have 'code' and can replace systems in some cases.
- There is an entity tree: each entity can have child entities. That means there is one 'super entity' which own all
entities from your world.
- On calling `update()` to an entity, all its childs and component will have `earlyUpdate()` and `lateUpdate()` called.

It is like the `GameObject` (entity) and `MonoBehaviour` (components) from Unity.

**Core design principles:**

- Small and easy to read/edit.
- It does only one small thing.
- As it is not super-evolved, it may not fit your needs. It will not be efficient for big datasets.
- Battle tested and production tested.
- Fail-fast. Every function call is type and error checked and throw errors: no silent error that will blow somewhere sometime.
- We use `lodash` but do require only the functions we need and we do not use chains. It drastically lower the memory footprint.
- Sub-classing components is supported. One limitation: you must not insert many components sharing a common super class (excepted for AComponent).
This limitation is not strictly checked in code due to limitations from Javascript. Making components as mixins may fix the limitation on a later update.

# Use cases

It fits cases when you need efficient entity hierarchy for small data set, fast prototyping and easy to maintain production code.

# Examples

What you could easily implement:
```javascript
const world = Entity.createWorld();
world.add(SystemComponent); // This entity is now able to run systems
world.systems.add(DrawSystem); // DrawSystem draw each sprites on-screen

const wall = world.createChild('wall'); // Create an entity in your world. It represent nothing yet
wall.add(SpriteComponent, 'wall.png'); // Your entity will now be drawed on-screen using 'wall.png'
wall.sprite.position.x = 10;
wall.sprite.position.y = 10;

const player = world.createChild('player');
player.add(SpriteComponent, 'player.png');

world.update(); // wall and player are now drawn on screen

wall.sprite.visible = false;

world.update(); // only player is now drawn on screen
```

- [Super simple example](examples/simple/index.js)
- [Game of life reimplemented](examples/game_of_life/index.js)

# Documentation

Everything is documented in the code. It is small enough so you can read the documentation there.

[You can also access documentation generated from code in doc/doc.md](doc/doc.md).

# Tests

    npm run test

Tests are available in the `test` folder. They are easy to read but boring, take a look if you want
to understand better how it works.

# License

This work is dual-licensed under Apache 2.0 and GPL 2.0 (or any later version).
You can choose between one of them if you use this work.

`SPDX-License-Identifier: Apache-2.0 OR GPL-2.0-or-later`
