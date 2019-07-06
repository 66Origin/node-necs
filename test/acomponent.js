'use strict';
const expect = require('chai').expect;

const Entity = require('../src/entity');
const AComponent = require('../src/acomponent');
const Symbols = require('../src/internal/symbols');

class Comp1 extends AComponent
{
    get name()
    {
        return Comp1.name;
    }

    static get name()
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

        describe('AComponent.name', function()
        {
            it('should return null', function()
            {
                expect(AComponent.name).to.be.null;
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