'use strict';
const expect = require('chai').expect;

const Entity = require('../entity');
const AComponent = require('../acomponent');

class PositionComponent extends AComponent
{
    constructor(parentEntity, position = null)
    {
        super(parentEntity);

        // to type checking as it is not this test purpose
        this._position = {x: 0, y: 0};
        if (position)
        {
            this._position.x = position.x;
            this._position.y = position.y;
        }
    }

    get x()
    {
        return this._position.x;
    }

    get y()
    {
        return this._position.y;
    }

    get position()
    {
        return Object.assign({}, this._position);
    }

    get identity()
    {
        return PositionComponent.identity;
    }

    static get identity()
    {
        return 'position';
    }
}

class VelocityComponent extends AComponent
{
    constructor(parentEntity, velocity = 0)
    {
        super(parentEntity);
        this._velocity = velocity;
    }

    get velocity()
    {
        return this._velocity;
    }

    get identity()
    {
        return VelocityComponent.identity;
    }

    static get identity()
    {
        return 'velocity';
    }
}

// We can also inherit component by themselves, they can be abstract too if needed
class PositionComponent2 extends AComponent
{
    constructor(parent, position = null)
    {
        super(parent);

        this._position = {x: 0, y: 0};

        if (position && typeof position === 'object' &&
            typeof position.x === 'number' && typeof position.y === 'number')
        {
            this._position = Object.assign({}, position);
        }
    }

    get position()
    {
        return this._position;
    }

    get identity()
    {
        return PositionComponent.identity;
    }

    static get identity()
    {
        return 'position';
    }
}

class DrawableComponent extends PositionComponent2
{
    constructor(parentEntity, texture = null)
    {
        super(parentEntity);

        if (new.target === DrawableComponent)
        {
            throw new Error('Can not instantiate DrawableComponent. You must inherit it.');
        }

        this._texture = texture;
    }

    /**
     * @private
     */
    get texture()
    {
        return this._texture;
    }

    /**
     * @private
     */
    set texture(t)
    {
        this._texture = t;
    }
}

class SpriteComponent extends DrawableComponent
{
    constructor(parent, texture = null)
    {
        super(parent, texture);
        this.iAmASprite = true;
    }

    get identity()
    {
        return SpriteComponent.identity;
    }

    static get identity()
    {
        return 'sprite';
    }
}

class MissingStaticNameComponent extends AComponent
{
    get identity()
    {
        return 'MissingStaticNameComponent';
    }
}

class MissingInstanceNameComponent extends AComponent
{
    static get identity()
    {
        return 'MissingInstanceNameComponent';
    }
}

class IdentitiesDoesNotReturnSameThingComponent extends AComponent
{
    static get identity()
    {
        return 'a';
    }

    get identity()
    {
        return 'b';
    }
}

describe('Integration between Entity and AComponent', function()
{
    describe('Entity.constructor', function()
    {
        it('should add components on construction', function()
        {
            const e1 = Entity.createWorld([PositionComponent]);
            expect(e1.has([PositionComponent])).to.be.true;

            const e2 = Entity.createWorld([PositionComponent, VelocityComponent]);
            expect(e2.has([PositionComponent, VelocityComponent])).to.be.true;
        });

        it('should throw an error if ComponentsType is not an array', function()
        {
            expect(() =>
            {
                const e1 = Entity.createWorld(PositionComponent);
            }).to.throw();
        });

        it('should throw an error if ComponentsType array doest not contain components', function()
        {
            expect(() =>
            {
                const e1 = Entity.createWorld([42]);
            }).to.throw();

            expect(() =>
            {
                const e1 = Entity.createWorld([PositionComponent, 42]);
            }).to.throw();
        });
    });

    describe('Entity.add', function()
    {
        it('should add the component and it should be readable', function()
        {
            const e = Entity.createWorld();
            e.add(PositionComponent);
            expect(e.position.x).equal(0);
            expect(e.position.y).equal(0);
        });

        it('should pass arguments to the component', function()
        {
            const e = Entity.createWorld();
            e.add(PositionComponent, {x:10, y:20});
            expect(e.position.x).equal(10);
            expect(e.position.y).equal(20);
        });

        it('should return this', function()
        {
            const e = Entity.createWorld();
            expect(e.add(SpriteComponent)).to.equal(e);
        });

        it('should throw on missing static name property on component', function()
        {
            const e = Entity.createWorld();
            expect(() =>
            {
                e.add(MissingStaticNameComponent);
            }).to.throw();
        });

        it('should throw on missing instance name property on component', function()
        {
            const e = Entity.createWorld();
            expect(() =>
            {
                e.add(MissingInstanceNameComponent);
            }).to.throw();
        });

        it('should throw if identities properties does not return the same value', function()
        {
            const e = Entity.createWorld();
            expect(() =>
            {
                e.add(IdentitiesDoesNotReturnSameThingComponent);
            }).to.throw();
        });

        it('should throw if adding the same component twice', function()
        {
            const e = Entity.createWorld();
            e.add(PositionComponent);
            expect(() =>
            {
                e.add(PositionComponent);
            }).to.throw();
        });

        it('should throw on adding two different components with same super class 1 (non complete test)', function()
        {
            const e = Entity.createWorld();
            e.add(SpriteComponent);
            expect(() =>
            {
                e.add(PositionComponent2);
            }).to.throw();
        });
    });

    describe('Entity.addMany', function()
    {
        it('should add both components and they should be both readable', function()
        {
            const e = Entity.createWorld();
            e.addMany([PositionComponent, VelocityComponent]);
            expect(e.position.x).to.equal(0);
            expect(e.position.y).to.equal(0);
            expect(e.velocity.velocity).to.equal(0);
        });

        it('should add one component and it should be readable', function()
        {
            const e = Entity.createWorld();
            e.addMany([VelocityComponent]);
            expect(e.velocity.velocity).to.equal(0);
        });

        it('should return this', function()
        {
            const e = Entity.createWorld();
            expect(e.addMany([SpriteComponent])).to.equal(e);
        });

        it('should throw on passing not an array', function()
        {
            const e1 = Entity.createWorld();
            expect(() =>
            {
                e1.addMany(VelocityComponent);
            }).to.throw();

            const e2 = Entity.createWorld();
            expect(() =>
            {
                e2.addMany();
            }).to.throw();
        });

        it('should throw on missing static name property on component', function()
        {
            const e = Entity.createWorld();
            expect(() =>
            {
                e.addMany([MissingStaticNameComponent]);
            }).to.throw();
        });

        it('should throw on missing instance name property on component', function()
        {
            const e = Entity.createWorld();
            expect(() =>
            {
                e.addMany([MissingInstanceNameComponent]);
            }).to.throw();
        });

        it('should not throw on empty-array', function()
        {
            const e = Entity.createWorld();
            e.addMany([]);
        });
    });

    describe('Entity.has', function()
    {
        it('should throw if ComponentsType is not an array', function()
        {
            const e1 = Entity.createWorld();
            expect(() =>
            {
                e1.has();
            }).to.throw();

            const e2 = Entity.createWorld();
            expect(() =>
            {
                e2.has(42);
            }).to.throw();
        });

        it('should return true if empty array is given', function()
        {
            const e = Entity.createWorld();
            expect(e.has([])).to.be.true;
        });

        it('should return true with one component', function()
        {
            const e = Entity.createWorld();
            e.add(PositionComponent);
            expect(e.has([PositionComponent])).to.be.true;
        });

        it('should return false with one component', function()
        {
            const e = Entity.createWorld();
            e.add(PositionComponent);
            expect(e.has([VelocityComponent])).to.be.false;

            const e2 = Entity.createWorld();
            expect(e.has([VelocityComponent])).to.be.false;
        });

        it('should return true with two components', function()
        {
            const e = Entity.createWorld();
            e.addMany([PositionComponent, VelocityComponent]);
            expect(e.has([PositionComponent, VelocityComponent])).to.be.true;
        });

        it('should return false with two components but only one available', function()
        {
            const e = Entity.createWorld();
            e.add(PositionComponent);
            expect(e.has([PositionComponent, VelocityComponent])).to.be.false;
            expect(e.has([VelocityComponent, PositionComponent])).to.be.false;
        });

        it('should return true if entity have a child class of the given class', function()
        {
            const e = Entity.createWorld();
            const child = e.createChild('child');
            child.add(SpriteComponent);
            expect(child.has([SpriteComponent])).to.be.true;
            expect(child.has([DrawableComponent])).to.be.true;
            expect(child.has([PositionComponent2])).to.be.true;
            expect(child.has([PositionComponent2, DrawableComponent, SpriteComponent])).to.be.true;
            expect(child.has([VelocityComponent, PositionComponent2, DrawableComponent, SpriteComponent])).to.be.false;
            expect(child.has([VelocityComponent])).to.be.false;
        });
    });

    describe('Entity.get', function()
    {
        it('should return the component', function()
        {
            const e = Entity.createWorld();
            e.add(PositionComponent);
            expect(e.get(PositionComponent) instanceof PositionComponent).to.be.true
            expect(e.get(PositionComponent)).to.be.equal(e.position);
        });

        it('should return null if not found', function()
        {
            const e = Entity.createWorld();
            expect(e.get(PositionComponent)).to.be.null;
        });

        it('should throw if pass not a component', function()
        {
            const e = Entity.createWorld();
            expect(() =>
            {
                e.get([]);
            }).to.throw();

            expect(() =>
            {
                e.get(null);
            }).to.throw();
        });

        it('should return the component if we pass a super class', function()
        {
            const e = Entity.createWorld();
            e.add(SpriteComponent);
            expect(e.get(DrawableComponent)).to.equal(e.sprite);
        });

    });

    describe('Entity.delete', function()
    {
        it('should delete the component', function()
        {
            const e = Entity.createWorld();
            e.add(PositionComponent);
            expect(e.has([PositionComponent])).to.be.true;
            expect(e.position.x).to.equal(0);

            e.delete(PositionComponent);
            expect(e.has([PositionComponent])).to.be.false;
            expect(e.position).to.be.undefined;
        });

        it('should delete the component but others should still be available', function()
        {
            const e = Entity.createWorld();
            e.addMany([PositionComponent, VelocityComponent]);
            expect(e.has([PositionComponent])).to.be.true;
            expect(e.position.x).to.equal(0);
            expect(e.has([VelocityComponent])).to.be.true;
            expect(e.velocity.velocity).equal(0);

            e.delete(PositionComponent);
            expect(e.has([PositionComponent])).to.be.false;
            expect(e.position).to.be.undefined;
            expect(e.has([VelocityComponent])).to.be.true;
            expect(e.velocity.velocity).equal(0);
        });

        it('should delete the component when given a super class', function()
        {
            const e = Entity.createWorld();
            e.add(SpriteComponent);
            expect(e.has([DrawableComponent])).to.be.true;
            e.delete(DrawableComponent);
            expect(e.has([DrawableComponent])).to.be.false;
        });

        it('should return this', function()
        {
            const e = Entity.createWorld();
            e.add(SpriteComponent);
            expect(e.delete(SpriteComponent)).to.equal(e);
        });

        it('should throw if component is not availble', function()
        {
            const e = Entity.createWorld();

            expect(() =>
            {
                e.delete(PositionComponent);
            }).to.throw();
        });

        it('should throw on double-delete', function()
        {
            const e = Entity.createWorld();
            e.add(PositionComponent);
            e.delete(PositionComponent);

            expect(() =>
            {
                e.delete(PositionComponent);
            }).to.throw();
        });
    });

    describe('Entity.deleteMany', function()
    {
        it('should delete all components', function()
        {
            const e = Entity.createWorld();
            e.addMany([PositionComponent, VelocityComponent]);
            expect(e.has([PositionComponent])).to.be.true;
            expect(e.position.x).to.equal(0);
            expect(e.has([VelocityComponent])).to.be.true;
            expect(e.velocity.velocity).equal(0);

            e.deleteMany([PositionComponent, VelocityComponent]);
            expect(e.has([PositionComponent])).to.be.false;
            expect(e.has([VelocityComponent])).to.be.false;
        });

        it('should do nothing on passing empty-array', function()
        {
            const e = Entity.createWorld();
            e.addMany([PositionComponent, VelocityComponent]);
            expect(e.has([PositionComponent])).to.be.true;
            expect(e.position.x).to.equal(0);
            expect(e.has([VelocityComponent])).to.be.true;
            expect(e.velocity.velocity).equal(0);

            e.deleteMany([]);
            expect(e.has([PositionComponent])).to.be.true;
            expect(e.position.x).to.equal(0);
            expect(e.has([VelocityComponent])).to.be.true;
            expect(e.velocity.velocity).equal(0);
        });

        it('should throw if at least one component is not available', function()
        {
            const e1 = Entity.createWorld();
            e1.add(PositionComponent);
            expect(() =>
            {
                e1.deleteMany([PositionComponent, VelocityComponent]);
            }).to.throw();

            const e2 = Entity.createWorld();
            expect(() =>
            {
                e2.deleteMany([PositionComponent, VelocityComponent]);
            }).to.throw();
        });

        it('should delete the component when given a super class', function()
        {
            const e = Entity.createWorld();
            e.add(SpriteComponent);
            expect(e.has([DrawableComponent])).to.be.true;
            e.deleteMany([DrawableComponent]);
            expect(e.has([DrawableComponent])).to.be.false;
        });

        it('should return this', function()
        {
            const e = Entity.createWorld();
            e.add(SpriteComponent);
            expect(e.deleteMany([SpriteComponent])).to.equal(e);
        });

        it('should throw on passing non-array', function()
        {
            const e = Entity.createWorld();
            expect(() =>
            {
                e.deleteMany(42);
            }).to.throw();
        });

        it('should throw on passing non-components in array', function()
        {
            const e = Entity.createWorld();
            expect(() =>
            {
                e.deleteMany([42]);
            }).to.throw();
        });
    });

    describe('#destructor', function()
    {
        it('should be called on destructing entity with components', function()
        {
            let isDestructorCalled = false;

            class DestructorComponent extends AComponent
            {
                destructor()
                {
                    isDestructorCalled = true;
                }

                get identity()
                {
                    return DestructorComponent.identity;
                }

                static get identity()
                {
                    return 'destructor';
                }
            }

            const e = Entity.createWorld();
            const child = e.createChild('child', [DestructorComponent]);
            child.deleteThis();

            expect(isDestructorCalled).to.be.true;
        });
    });

    describe('#update', function()
    {
        it('should call update on every childs and component', function()
        {
            let updateEarlyCount = 0;
            let updateLateCount = 0;

            class UpdateComponent extends AComponent
            {
                earlyUpdate()
                {
                    ++updateEarlyCount;
                }

                lateUpdate()
                {
                    if (updateEarlyCount === 0)
                    {
                        throw new Error('earlyUpdate should have been called before lateUpdate');
                    }
                    ++updateLateCount;
                }

                get identity()
                {
                    return UpdateComponent.identity;
                }

                static get identity()
                {
                    return 'updater';
                }
            }

            const e = Entity.createWorld();
            const child1 = e.createChild('1', [UpdateComponent]);
            const child2 = e.createChild('2', [UpdateComponent]);

            expect(updateEarlyCount).to.equal(0);
            expect(updateLateCount).to.equal(0);

            e.update();
            expect(updateEarlyCount).to.equal(2);
            expect(updateLateCount).to.equal(2);

            child1.update();
            expect(updateEarlyCount).to.equal(3);
            expect(updateLateCount).to.equal(3);
        });

        it('should emit events on update steps', function()
        {
            const e = Entity.createWorld();

            let earlyCalled = false;
            let lateCalled = false;

            e.on('nextEarlyUpdate', () =>
            {
                expect(lateCalled).to.be.false;
                earlyCalled = true;
            });

            e.on('nextLateUpdate', () =>
            {
                expect(earlyCalled).to.be.true;
                lateCalled = true;
            });

            e.update();
            expect(earlyCalled).to.be.true;
            expect(lateCalled).to.be.true;
        });

        it('should call update through components the same order components are added', function()
        {
            let count = 0;

            class c1Component extends AComponent
            {
                earlyUpdate()
                {
                    expect(count).to.equal(0);
                    ++count;
                }

                lateUpdate()
                {
                    expect(count).to.equal(3);
                    ++count;
                }

                get identity()
                {
                    return c1Component.identity;
                }

                static get identity()
                {
                    return 'c1';
                }
            }

            class c2Component extends AComponent
            {
                earlyUpdate()
                {
                    expect(count).to.equal(1);
                    ++count;
                }

                lateUpdate()
                {
                    expect(count).to.equal(4);
                    ++count;
                }

                get identity()
                {
                    return c2Component.identity;
                }

                static get identity()
                {
                    return 'c2';
                }
            }

            class c3Component extends AComponent
            {
                earlyUpdate()
                {
                    expect(count).to.equal(2);
                    ++count;
                }

                lateUpdate()
                {
                    expect(count).to.equal(5);
                    ++count;
                }

                get identity()
                {
                    return c3Component.identity;
                }

                static get identity()
                {
                    return 'c3';
                }
            }

            const e1 = Entity.createWorld();
            e1.addMany([c1Component, c2Component, c3Component]);

            expect(count).to.equal(0);
            e1.update();
            expect(count).to.equal(6);

            count = 0;
            const e2 = Entity.createWorld();

            e2.add(c1Component);
            e2.add(c2Component);
            e2.add(c3Component);

            expect(count).to.equal(0);
            e2.update();
            expect(count).to.equal(6);
        });
    });
});