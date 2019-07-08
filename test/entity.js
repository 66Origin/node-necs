'use strict';
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
            expect(child.parent).to.equal(parent);
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
            expect(e.parent).to.be.null;
            expect(e._childs).to.deep.equal({});
        });
    });

    describe('#createWorld', function()
    {
        it('should not throw', function()
        {
            const e = Entity.createWorld();
        });

        it('should create an entity with no parent', function()
        {
            const e = Entity.createWorld();
            expect(e.parent).to.be.null;
        });
    });

    describe('#createChild', function()
    {
        it('should not throw', function()
        {
            const parent = Entity.createWorld();
            const child = parent.createChild('child');
        });

        it('should throw if name is not a string', function()
        {
            const parent1 = Entity.createWorld();
            expect(() =>
            {
                const child = parent1.createChild();
            }).to.throw();

            const parent2 = Entity.createWorld();
            expect(() =>
            {
                const child = parent2.createChild(null);
            }).to.throw();

            const parent3 = Entity.createWorld();
            expect(() =>
            {
                const child = parent3.createChild(42);
            }).to.throw();
        });

        it('should have properly set _childs and parent', function()
        {
            const parent = Entity.createWorld();
            const child = parent.createChild('child');

            expect(child.parent).to.equal(parent);
            expect(parent._childs['child']).to.equal(child);
        });

        it('should throw an error if child already exist', function()
        {
            const parent = Entity.createWorld();
            const child = parent.createChild('child');
            expect(() =>
            {
                parent.createChild('child');
            }).to.throw();
        });
    });

    describe('#getChild and #_', function()
    {
        it('should return the child', function()
        {
            const parent = Entity.createWorld();
            const a = parent.createChild('a');
            const b = parent.createChild('b');

            expect(parent.getChild('a')).to.equal(a);
            expect(parent.getChild('a')).to.equal(parent._('a'));

            expect(parent.getChild('b')).to.equal(b);
            expect(parent.getChild('b')).to.equal(parent._('b'));
        });

        it('should return null on not found', function()
        {
            const parent = Entity.createWorld();
            const a = parent.createChild('a');
            const b = parent.createChild('b');

            expect(parent.getChild('c')).to.be.null;
            expect(parent.getChild('c')).to.equal(parent._('c'));
        });

        it('should throw if name is not a string', function()
        {
            const parent = Entity.createWorld();
            expect(() =>
            {
                parent._(42);
            }).to.throw();
        });
    });

    describe('#deleteChild', function()
    {
        it('should delete the child', function()
        {
            const parent = Entity.createWorld();
            const a = parent.createChild('a');
            const b = parent.createChild('b');

            parent.deleteChild('a');
            expect(parent.getChild('a')).to.be.null;
            expect(parent.getChild('b')).to.equal(b);
        });

        it('should throw on deleting unknown child', function()
        {
            const parent = Entity.createWorld();

            expect(() =>
            {
                parent.deleteChild('42');
            }).to.throw();
        });

        it('should throw on passing something else than a string', function()
        {
            const parent = Entity.createWorld();

            expect(() =>
            {
                parent.deleteChild(42);
            }).to.throw();
        });
    });

    describe('#deleteThis', function()
    {
        it('should delete the child', function()
        {
            const parent = Entity.createWorld();
            const a = parent.createChild('a');
            expect(parent.getChild('a')).to.be.equal(a);

            a.deleteThis();
            expect(parent.getChild('a')).to.be.null;
        });

        it('should throw on deleting a world', function()
        {
            const parent = Entity.createWorld();

            expect(() =>
            {
                parent.deleteThis();
            }).to.throw();
        });
    });
});
