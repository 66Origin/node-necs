'use strict';
// const Registry = require('./src/registry');
const Entity = require('./src/entity');
const AComponent = require('./src/acomponent');

class PositionComponent extends AComponent
{
    constructor()
    {
        super();
        this._x = 0;
        this._y = 0;
    }

    static get name()
    {
        return 'position';
    }

    get name()
    {
        return PositionComponent.name;
    }

    get x()
    {
        return x;
    }

    set x(v)
    {
        this._x = Math.floor(v);
    }

    get y()
    {
        return y;
    }

    set y(v)
    {
        this._y = Math.floor(v);
    }
}

const rootEntity = Entity.createWorld();
const child1 = rootEntity.createChild('child1');
console.log(rootEntity);