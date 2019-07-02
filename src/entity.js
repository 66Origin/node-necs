'use strict';
const EventEmitter = require('events');

const AComponent = require('./acomponent');

// system which emit events ? as .emit('sprite:played')
class Entity extends EventEmitter
{
    constructor(tag = null)
    {
        super();

        this._components = [];
        this._tag = tag;
    }

    get tag()
    {
        return this._tag;
    }

    has(components)
    {
        return components.every(component =>
        {
            return !!this._components[component];
        })
    }

    add(ComponentType, ...args)
    {
        const component = new ComponentType(...args);
        this._assertComponentValidity(component);

        if (this._components)
        this._components.push(component);
        this[component.name] = component;
    }

    addMany(components)
    {
        components.forEach(ComponentType =>
        {
            this.add(ComponentType);
        });
    }

    delete(ComponentType)
    {
        this._assertComponentTypeValidity(ComponentType);

        const componentIndex = this._find(ComponentType);
        if (componentIndex === -1)
        {
            throw new Error('can not delete component: not found');
        }

        delete this[ComponentType.name];
        this._components.splice(componentIndex, 1);
    }

    deleteMany(components)
    {
        components.forEach(this.delete);
    }

    _assertComponentTypeValidity(ComponentType)
    {
        if (!ComponentType.name)
        {
            throw new TypeError('Component must inherit AComponent');
        }
    }

    _assertComponentValidity(component)
    {
        if (!(component instanceof AComponent) || !component.name)
        {
            throw new TypeError('Component must inherit AComponent');
        }
    }

    _findIndex(ComponentType)
    {
        return this._components.findIndex(component =>
        {
            return ComponentType.name === component.name;
        });
    }
}

module.exports = Entity;
