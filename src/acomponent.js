'use strict';

const { AComponentSymbol } = require('./internal/symbols');

/**
 * `AComponent` represent data or behaviors on an `Entity`. As an example, it can
 * represent a position (x,y), a hitbox or a texture.
 * 
 * The `A` in `AComponent` is for Abstract, it means you can not construct but you
 * must inherit it. A non-inherited `AComponent` represent nothing.
 * 
 * So on, you must inherit it, specify your datas and/or behaviour. You can
 * set your behaviors in the `update()` function or in public functions. You can
 * access the parent entity, you can access others components.
 * 
 * If your component require others components, you must check their presence
 * in the constructor and throw if they are missing. Remember, if you want to
 * follow this project design, you must fail-fast. It means you check every error-case
 * and throw as soon as possible. Better see sooner than undefined behaviors in production.
 * 
 * The `update()` function automatically called when your entity tree got its function
 * `update()` called.
 */
class AComponent
{
    /**
     * On inheritting `AComponent`, `parentEntity` will be passed to your constructor among
     * your own arguments. You must keep `parentEntity` first, then your arguments.
     *
     * @param {Entity} parent The entity which own this component
     */
    constructor(parent)
    {
        if (new.target === AComponent)
        {
            throw new Error('AComponent can not be instantiated. You must inherit it.');
        }

        if (parent.constructor.name !== 'Entity')
        {
            throw new TypeError('parent must be an instance of Entity');
        }

        /**
         * The entity which own this component
         * @type {Entity}
         * @private
         */
        this._parent = parent;
    }

    /**
     * This function will be called on destruction.
     * 
     * You can do some cleanup if needed.
     * @override
     */
    destructor()
    {

    }

    get parent()
    {
        return this._parent;
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
     * On inheriting AComponent, you must override this function to return the
     * component name from your class static function name. See below for
     * more informations.
     * 
     * @override
     * @returns {?String}
     */
    get identity()
    {
        return null;
    }

    /**
     * On inheriting AComponent, you must override this function to return the component name.
     * 
     * The component name will be the easy-access key on your entity. If you set
     * `position`, you will be able to access the component using `entity.position`.
     * 
     * It should be unique.
     * 
     * See above for the instance version of this function.
     *
     * @override
     * @returns {?String}
     */
    static get identity()
    {
        return null;
    }

    /**
     * This field is used as type checking.
     * 
     * You will often pass your inherited class directly as a class - not as an instance.
     * This static field return a well-known symbol which will be equality checked to ensure
     * inheritance.
     * @private
     */
    static get _AComponentSymbol()
    {
        return AComponentSymbol;
    }
}

module.exports = AComponent;