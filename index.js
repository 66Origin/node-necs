'use strict';
const Registry = require('./src/registry');
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

const r = new Registry();
const e = r.create();
console.log(r.has(e));
r.delete(e);
console.log(r.has(e));
