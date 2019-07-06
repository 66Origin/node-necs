'use strict';
const expect = require('chai').expect;

const Entity = require('../src/entity');
const AComponent = require('../src/acomponent');

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

        it('should throw if adding the same component twice', function()
        {
            const e = Entity.createWorld();
            e.add(PositionComponent);
            expect(() =>
            {
                e.add(PositionComponent);
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

        it('should throw on passing non-array', function()
        {
            const e = Entity.createWorld();
            expect(() =>
            {
                e.deleteMany(42);
            }).to.throw();;
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
});