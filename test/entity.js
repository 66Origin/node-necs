const expect = require('chai').expect;

const Entity = require('../src/entity');

describe('Entity', function()
{
    describe('#constructor', function()
    {
        it('should throw on no arguments to constructor', function()
        {
            expect(() =>
            {
                new Entity()
            }).to.throw();
        });

        it('should allow constructing with null as parent', function()
        {
            const e = new Entity(null);
        });

        it('should allow constructing with an entity as parent', function()
        {
            const parent = new Entity(null);
            const child = new Entity(parent);
            expect(child._parent).to.equal(parent);
        });

        it('should throw when parent is not null or an entity', function()
        {
            expect(() =>
            {
                new Entity('hello');
            }).to.throw();
        });

        it('should init private properties properly', function()
        {
            const e = new Entity(null);
            expect(e._components).to.deep.equal([]);
            expect(e._parent).to.be.null;
            expect(e._childs).to.deep.equal({});
        });
    });

    describe('#createWorld', function()
    {
        it('should not throw on creating a world', function()
        {
            const e = Entity.createWorld();
        });

        it('should create an entity with no parent', function()
        {
            const e = Entity.createWorld();
            expect(e._parent).to.be.null;
        });
    });
});
