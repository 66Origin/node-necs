'use strict';
const expect = require('chai').expect;

const Entity = require('../entity');

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

        it('should throw if name have points in it', function()
        {
            const e = Entity.createWorld();

            expect(() =>
            {
                e.createChild('hello.hello');
            }).to.throw();
        });

        it('should throw if name have points in it', function()
        {
            const e = Entity.createWorld();

            expect(() =>
            {
                e.createChild('.hello');
            }).to.throw();
        });

        it('should throw if name have points in it', function()
        {
            const e = Entity.createWorld();

            expect(() =>
            {
                e.createChild('hello.');
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

        it('should return the child', function()
        {
            const parent = Entity.createWorld();
            const a = parent.createChild('a');
            const b = a.createChild('b');

            expect(parent._('a.b')).to.equal(b);
        });

        it('should return the child', function()
        {
            const parent = Entity.createWorld();
            const a = parent.createChild('a');
            const b = a.createChild('b');
            const c = b.createChild('c');

            expect(parent._('a.b.c')).to.equal(c);
        });

        it('should return null if not found', function()
        {
            const parent = Entity.createWorld();
            const a = parent.createChild('a');
            const b = parent.createChild('b');

            expect(parent.getChild('c')).to.be.null;
            expect(parent.getChild('c')).to.equal(parent._('c'));
        });

        it('should return null if not found', function()
        {
            const parent = Entity.createWorld();

            expect(parent.getChild('c')).to.be.null;
        });

        it('should return null if not found', function()
        {
            const parent = Entity.createWorld();

            expect(parent.getChild('a.a')).to.be.null;
        });

        it('should return null if not found', function()
        {
            const parent = Entity.createWorld();

            expect(parent.getChild('a.a.a')).to.be.null;
        });

        it('should return null if not found', function()
        {
            const parent = Entity.createWorld();
            const a = parent.createChild('a');

            expect(parent.getChild('a.a')).to.be.null;
        });

        it('should return null if not found', function()
        {
            const parent = Entity.createWorld();
            const a = parent.createChild('a');

            expect(parent.getChild('a.a.a')).to.be.null;
        });

        it('should throw if name is not a string', function()
        {
            const parent = Entity.createWorld();
            expect(() =>
            {
                parent._(42);
            }).to.throw();
        });

        it('should throw an error if name is empty', function()
        {
            const e = Entity.createWorld();
            expect(() =>
            {
                e.getChild('');
            }).to.throw();
        });

        it('should throw an error if parts delimited by points are empty', function()
        {
            const e = Entity.createWorld();
            expect(() =>
            {
                e.getChild('hello.');
            }).to.throw();
        });

        it('should throw an error if parts delimited by points are empty', function()
        {
            const e = Entity.createWorld();
            expect(() =>
            {
                e.getChild('.hello');
            }).to.throw();
        });

        it('should throw an error if parts delimited by points are empty', function()
        {
            const e = Entity.createWorld();
            expect(() =>
            {
                e.getChild('...hello');
            }).to.throw();
        });

        it('should throw an error if parts delimited by points are empty', function()
        {
            const e = Entity.createWorld();
            expect(() =>
            {
                e.getChild('hel..lo');
            }).to.throw();
        });
    });

    describe('#get childs', function()
    {
        it('should return all childs', function()
        {
            const world = Entity.createWorld();
            const a = world.createChild('a');
            const b = world.createChild('b');

            const childs = world.childs;
            expect(childs.a).to.equal(a);
            expect(childs.b).to.equal(b);
        });

        it('should be frozen', function()
        {
            const world = Entity.createWorld();
            const a = world.createChild('a');
            const b = world.createChild('b');

            const childs = world.childs;

            expect(() =>
            {
                childs.a = null;
            }).to.throw();
        });

        it('should not be kept up to date with later adding', function()
        {
            const world = Entity.createWorld();

            const childs = world.childs;

            const a = world.createChild('a');

            expect(childs.a).to.be.undefined;

            const childs2 = world.childs;
            expect(childs2.a).to.equal(a);
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

        it('should delete listeners', function()
        {
            const parent = Entity.createWorld();
            const a = parent.createChild('a');

            a.on('hello', () => {});
            expect(a.listenerCount('hello')).to.equal(1);

            parent.deleteChild('a');
            expect(a.listenerCount('hello')).to.equal(0);
        });

        it('should delete recursively (eg. delete childs of the child)', function()
        {
            const parent = Entity.createWorld();
            const a = parent.createChild('a');
            const b = a.createChild('b');

            b.on('hello', () => {});
            expect(b.listenerCount('hello')).to.equal(1);

            parent.deleteChild('a');
            expect(parent.getChild('a')).to.be.null;
            expect(a.getChild('b')).to.be.null;
            expect(b.listenerCount('hello')).to.equal(0);
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

    describe('#deleteChildIfExist', function()
    {
        it('should delete the child', function()
        {
            const parent = Entity.createWorld();
            const a = parent.createChild('a');
            const b = parent.createChild('b');

            parent.deleteChildIfExist('a');
            expect(parent.getChild('a')).to.be.null;
            expect(parent.getChild('b')).to.equal(b);
        });

        it('should delete listeners', function()
        {
            const parent = Entity.createWorld();
            const a = parent.createChild('a');

            a.on('hello', () => {});
            expect(a.listenerCount('hello')).to.equal(1);

            parent.deleteChildIfExist('a');
            expect(a.listenerCount('hello')).to.equal(0);
        });

        it('should delete recursively (eg. delete childs of the child)', function()
        {
            const parent = Entity.createWorld();
            const a = parent.createChild('a');
            const b = a.createChild('b');

            b.on('hello', () => {});
            expect(b.listenerCount('hello')).to.equal(1);

            parent.deleteChildIfExist('a');
            expect(parent.getChild('a')).to.be.null;
            expect(a.getChild('b')).to.be.null;
            expect(b.listenerCount('hello')).to.equal(0);
        });

        it('should not throw on deleting unknown child', function()
        {
            const parent = Entity.createWorld();

            parent.deleteChildIfExist('42');
        });

        it('should throw on passing something else than a string', function()
        {
            const parent = Entity.createWorld();

            expect(() =>
            {
                parent.deleteChildIfExist(42);
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

        it('should delete listeners', function()
        {
            const parent = Entity.createWorld();
            const a = parent.createChild('a');

            a.on('hello', () => {});
            expect(a.listenerCount('hello')).to.equal(1);

            a.deleteThis();
            expect(a.listenerCount('hello')).to.equal(0);
        });

        it('should delete recursively (eg. delete childs of the child)', function()
        {
            const parent = Entity.createWorld();
            const a = parent.createChild('a');
            const b = a.createChild('b');

            b.on('hello', () => {});
            expect(b.listenerCount('hello')).to.equal(1);

            a.deleteThis();
            expect(parent.getChild('a')).to.be.null;
            expect(a.getChild('b')).to.be.null;
            expect(b.listenerCount('hello')).to.equal(0);
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

    describe('#deleteChilds', function()
    {
        it('should delete every child', function()
        {
            const parent = Entity.createWorld();
            const a = parent.createChild('a');
            const b = parent.createChild('b');

            parent.deleteChilds();
            expect(parent.getChild('a')).to.be.null;
            expect(parent.getChild('b')).to.be.null;
        });

        it('should delete listeners', function()
        {
            const parent = Entity.createWorld();
            const a = parent.createChild('a');

            a.on('hello', () => {});
            expect(a.listenerCount('hello')).to.equal(1);

            parent.deleteChilds();
            expect(a.listenerCount('hello')).to.equal(0);
        });

        it('should delete recursively (eg. delete childs of the child)', function()
        {
            const parent = Entity.createWorld();
            const a = parent.createChild('a');
            const b = a.createChild('b');

            b.on('hello', () => {});
            expect(b.listenerCount('hello')).to.equal(1);

            parent.deleteChilds();
            expect(parent.getChild('a')).to.be.null;
            expect(a.getChild('b')).to.be.null;
            expect(b.listenerCount('hello')).to.equal(0);
        });
    });
});
