'use strict';
const expect = require('chai').expect;

const Entity = require('../entity');
const AComponent = require('../acomponent');
const ASystem = require('../asystem');
const SystemComponent = require('../system_component');

class ExampleSystem extends ASystem
{
    constructor(parent, payload)
    {
        super(parent, []);
        this.payload = payload;
    }
}

describe('Integration between components and systems', function()
{
    describe('SystemComponent', function()
    {
        describe('#add', function()
        {
            it('should add the system and pass arguments to constructor', function()
            {
                const e = Entity.createWorld([SystemComponent]);
                e.systems.add(ExampleSystem, 42);
                expect(e.systems._systems[0] instanceof ExampleSystem).to.be.true;
                expect(e.systems._systems[0].payload).to.equal(42);
                expect(e.systems._systems[0].parent).to.equal(e);
            });

            it('should throw if we first arg is not a system', function()
            {
                const e = Entity.createWorld([SystemComponent]);

                expect(() =>
                {
                    e.systems.add(42);
                }).to.throw();
            });
        });

        describe('#delete', function()
        {
            it('should delete the system', function()
            {
                const e = Entity.createWorld([SystemComponent]);
                e.systems.add(ExampleSystem, 42);
                expect(e.systems._systems[0] instanceof ExampleSystem).to.be.true;

                e.systems.delete(ExampleSystem);
                expect(e.systems._systems[0] instanceof ExampleSystem).to.be.false;
            });

            it('should throw if system is not found', function()
            {
                const e = Entity.createWorld([SystemComponent]);

                expect(() =>
                {
                    e.systems.delete(ExampleSystem);
                }).to.throw();
            });

            it('should throw if first arg is not a system class', function()
            {
                const e = Entity.createWorld([SystemComponent]);

                expect(() =>
                {
                    e.systems.delete(42);
                }).to.throw();
            });
        });

        describe('#update', function()
        {
            it('should call update on the system', function()
            {
                let called = false;
                class ExampleSystem2 extends ASystem
                {
                    constructor(parent)
                    {
                        super(parent, []);
                    }

                    update()
                    {
                        called = true;
                    }
                }

                const e = Entity.createWorld([SystemComponent]);
                e.systems.add(ExampleSystem2);
                e.update();
                expect(called).to.be.true;
            });
        });
    });

    describe('ASystem', function()
    {
        describe('#constructor', function()
        {
            it('should disallow constructing without inheritting', function()
            {
                const e = Entity.createWorld([SystemComponent]);
                expect(() =>
                {
                    e.systems.add(ASystem);
                }).to.throw();
            });

            it('should disallow constructing without parent entity', function()
            {
                expect(() =>
                {
                    new ExampleSystem()
                }).to.throw();

                expect(() =>
                {
                    new ExampleSystem(42)
                }).to.throw();
            });

            it('should disallow constructing with wrong requirements', function()
            {
                class ExampleSystem2 extends ASystem
                {
                    constructor(parent, payload)
                    {
                        super(parent, 42);
                        this.payload = payload;
                    }
                }

                const e = Entity.createWorld([SystemComponent]);
                expect(() =>
                {
                    e.systems.add(ExampleSystem2);
                }).to.throw();
            });
        });
    });

    describe('Integration', function()
    {
        it('should pass to update() proper entities', function()
        {
            const e = Entity.createWorld([SystemComponent]);

            let called = false;

            class ExampleComponent extends AComponent
            {
                get identity()
                {
                    return ExampleComponent.identity;
                }

                static get identity()
                {
                    return 'example';
                }
            }

            class ExampleSystem2 extends ASystem
            {
                constructor(parent, payload)
                {
                    super(parent, [ExampleComponent]);
                    this.payload = payload;
                }

                update(entities)
                {
                    expect(entities.length).to.equal(1);
                    expect(entities[0]).to.equal(e.getChild('1'));
                    called = true;
                }
            }

            e.systems.add(ExampleSystem2);
            const child1 = e.createChild('1', [ExampleComponent]);
            const child2 = e.createChild('2');
            e.update();
            expect(called).to.be.true;
        });
    });
});