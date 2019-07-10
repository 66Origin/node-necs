const Entity = require('../../entity');
const AComponent = require('../../acomponent');
const SystemComponent = require('../../system_component');
const ASystem = require('../../asystem');

// Simple component which only hold `payload`.
class DataComponent extends AComponent
{
  constructor(parent)
  {
    super(parent);
    this.payload = null;
  }

  // Allow easy access: `entity.data` will return the component
  static get identity()
  {
    return 'data';
  }

  get identity()
  {
    return DataComponent.identity;
  }
}

class DataSystem extends ASystem
{
  constructor(parent)
  {
    // This sytem works on entities which have the component DataComponent
    super(parent, [DataComponent]);
  }

  update(entities)
  {
    entities.forEach(entity =>
    {
      console.log(`Payload of entity '${entity.name}' is ${entity.data.payload}`);
    });
  }
}


// Create a new world with the capability of running systems
const world = Entity.createWorld([SystemComponent]);
world.systems.add(DataSystem);

// create a child to world and add DataComponent
const child1 = world.createChild('child1', [DataComponent]);
child1.data.payload = 42;

const child2 = world.createChild('child2');
child2.add(DataComponent); // Also works
child2.data.payload = 43;

// Run the update() procedure which call update() on components and systems
console.log('Update...');
world.update();

child1.data.payload = -1;
console.log('Update...');
world.update();
