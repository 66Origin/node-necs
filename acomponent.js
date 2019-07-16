'use strict';

const { AComponentSymbol } = require('./internal/symbols');

/**
 * `AComponent` represent data or behaviors on an `Entity`. As an example, it can
 * represent a position (x,y), a hitbox or a texture.
 * 
 * The `A` in `AComponent` is for Abstract, it means you can not construct but you
 * must inherit it. A non-inherited `AComponent` represent nothing.
 * 
 * So on, you must inherit it, specify your datas and/or behaviours. You can
 * set your behaviours in the `update()` function or in public functions. You can
 * access the parent entity, and others components.
 * 
 * If your component require others components, you must check their existence
 * in the constructor and throw if they are missing. Remember, if you want to
 * follow this project design, you must fail-fast. It means you check every error-case
 * and throw as soon as possible. Better see sooner than unreproducible undefined behaviors in production.
 * 
 * The `update()` function is automatically called when your entity tree got its function
 * `update()` called.
 */
class AComponent
{
    /**
     * On inheriting `AComponent`, `parent` will be passed to your constructor among
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
     * Emit an event from parent identified as this component.
     *
     * This function works as a regular EventEmitter. Only differences are:
     * - Event will be emitted from the parent entity
     * - Event name will be `identity:name` (ex: 'sprite:visible')
     *
     * So on, it is a shortcut to `this.parent.emit(this.identity + ':' + name, payload)`.
     *
     * @param {String} name Name of this event.
     * @param {*} payload Optional payload to pass to the event.
     */
    emit(name, payload)
    {
        this.parent.emit(`${this.identity}:${name}`, payload);
    }

    /**
     * @returns {Entity} Owner of this component.
     */
    get parent()
    {
        return this._parent;
    }

    /**
     * Early update of this component. See `Entity` documentation for more information.
     * @override
     */
    earlyUpdate()
    {

    }

    /**
     * Late update of this component. See `Entity` documentation for more information.
     * @override
     */
    lateUpdate()
    {

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

    /**
     * On inheriting AComponent, you must override this function to return the
     * component name from your class static function name.
     *
     * See static function `AComponent.identity`.
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
     * It must be unique.
     * 
     * See the instance function `AComponent.identity`.
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