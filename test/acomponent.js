'use strict';
const expect = require('chai').expect;

const Entity = require('../entity');
const AComponent = require('../acomponent');
const Symbols = require('../internal/symbols');

class Comp1 extends AComponent
{
    get identity()
    {
        return Comp1.identity;
    }

    static get identity()
    {
        return 'Comp1';
    }
}

describe('AComponent', function()
{
    describe('non-inherited AComponent', function()
    {
        describe('#constructor', function()
        {
            it('should throw on constructing non-inheritted AComponent', function()
            {
                const e = Entity.createWorld();
                expect(() =>
                {
                    new AComponent(); 
                }).to.throw();
            });
        });

        describe('#emit', function()
        {
            it('should emit the event and pass the payload', function()
            {
                const e = Entity.createWorld([Comp1]);

                let called = false;
                e.on('Comp1:event', function(payload)
                {
                    expect(payload).to.equal(42);
                    called = true;
                });

                e.get(Comp1).emit('event', 42);
                expect(called).to.be.true;
            });
        });

        describe('AComponent.identity', function()
        {
            it('should return null', function()
            {
                expect(AComponent.identity).to.be.null;
            });
        });

        describe('#_AComponentSymbol', function()
        {
            it('should return the well known Symbol', function()
            {
                expect(AComponent._AComponentSymbol).to.equal(Symbols.AComponent);
            });
        });
    });

    describe('inherited AComponent', function()
    {
        describe('#constructor', function()
        {
            it('should throw on giving non-Entity parent', function()
            {
                expect(() =>
                {
                    new Comp1();
                }).to.throw();

                expect(() =>
                {
                    new Comp1(42);
                }).to.throw();

                expect(() =>
                {
                    new Comp1({});
                }).to.throw();
            });

            it('should allow constructing with correct arguments', function()
            {
                const e = Entity.createWorld();
                const c = new Comp1(e);
            });
        });

        describe('#parent', function()
        {
            it('should be properly set', function()
            {
                const e = Entity.createWorld();
                const c = new Comp1(e);
                expect(c.parent).to.equal(e);
            });
        });

    });
});