'use strict';

const { AComponentSymbol } = require('./internal/symbols');

class AComponent
{
    /**
     * @param {Entity} parentEntity The entity which own this component
     */
    constructor(parentEntity)
    {
        if (parentEntity.constructor.name !== 'Entity')
        {
            throw new TypeError('parentEntity must be an instance of Entity');
        }

        /**
         * The entity which own this component
         * @type {Entity}
         * @private
         */
        this._parentEntity = parentEntity;
    }

    get parent()
    {
        return this._parentEntity;
    }

    /**
     * This function will be called on each new frame. You must override it to
     * specify your own behaviors.
     * @override
     */
    update()
    {

    }

    /**
     * On inheriting AComponent, you must override this function to return the component name.
     * @override
     * @returns {?String}
     */
    get name()
    {
        return null;
    }

    /**
     * On inheriting AComponent, you must override this function to return the component name.
     * @override
     * @returns {?String}
     */
    static get name()
    {
        return null;
    }

    /**
     * This field is used as type checking.
     * 
     * You will often pass your inherited class directly as a class - not as an instance.
     * This static field return a well-known symbol which will be equality checked to ensure
     * inheritance.
     */
    static get _AComponentSymbol()
    {
        return AComponentSymbol;
    }
}

module.exports = AComponent;