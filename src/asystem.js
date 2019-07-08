'use strict';

const { ASystemSymbol } = require('./internal/symbols');

class ASystem
{
    constructor(parent, requiredComponents)
    {
        if (new.target === ASystem)
        {
            throw new Error('ASystem must not be instantiated. You must inherit it.');
        }

        if (parent.constructor.name !== 'Entity')
        {
            throw new TypeError('parent must be an instance of Entity');
        }
        this._parent = parent;

        if (!Array.isArray(requiredComponents))
        {
            throw new TypeError('requiredComponents must be an Array');
        }

        this._requiredComponents = requiredComponents;
    }

    get parent()
    {
        return this._parent;
    }

    get requiredComponents()
    {
        return this._requiredComponents;
    }

    /**
     * @override
     */
    update(entities)
    {

    }

    static get _ASystemSymbol()
    {
        return ASystemSymbol;
    }
}

module.exports = ASystem;