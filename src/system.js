'use strict';

class System
{
    constructor(options)
    {
        if (new.target === System)
        {
            throw new Error('This class must be inherited to be instantiated.')
        }
        this._requiredComponents = options.requiredComponents;
    }

    /**
     * @override
     */
    destructor()
    {

    }

    get name()
    {
        throw new Error('this function must be overrided');
    }

    get requiredComponents()
    {
        return this._requiredComponents;
    }

    update(registry, component)
    {
        throw new Error('this function must be overrided');
    }
}

module.exports = System;