# Not an ECS

`NECS` is not an `ECS`.

It take some principles from the `ECS` pattern but break some of its rules.

**In short:**

- Entity and Components
- No systems (implementation tied directly to Components)
- There is an entity tree: each entity can have child entities. That means there is one 'super entity' which own all
entities from your world.

It is more like the `GameObject` (entity) and `MonoBehaviour` (components) from Unity.

**Core design principles:**

- Small and easy to read/edit
- It does only one small thing
- As it is not super-evolved, it may not fit your needs.
- Battle tested
- Fail-fast. Every function call is type and error checked and throw errors to avoid silent errors.

**A few notes:**

- We use `lodash` but do require only the functions we need and we do not use chains. It drastically lower the memory footprint.

# Use cases

It may not be as fast as you would need as there is no reactive system and lots of iterations over array: it does not
fit having lots of entities.

It fits cases when you need efficient entity hierarchy for small data set, fast prototyping and easy to maintain production code.

# Quick Start

# Tests

Tests are available in the `test` folder. They are easy to read but boring, take a look if you want
to understand better how it works.