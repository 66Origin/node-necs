'use strict';

const { ASystemSymbol } = require('./internal/symbols');

/**
 * `ASystem` mean Abstract System. You can create systems by inheriting this class.
 *
 * A system is a 'module' on which `ASystem.update()` will run on each `Entity.update()` call from the world entity.
 * It perform predictable actions on a set of entities.
 *
 * On inheriting ASystem, you must set a constructor which call `super()`. First argument is the parent which will be
 * given to your constructor. The second argument must be specified from your constructor: it must be an array with all
 * the components the system can work on.
 *
 * When `update(entities)` is called, first argument is an array of entities, which comply to your components requirements.
 * All entities that have all the required components will be in the given array.
 *
 * See examples to understand how systems work.
 *
 * To create systems, you must add `SystemComponent` to your world entity.
 */
class ASystem
{
    /**
     * On inheriting `ASystem`, `parent` will be given to your constructor as first argument. You just have to pass
     * `parent` to `super()`.
     *
     * `requiredComponents` must be specified by yourself: all the components you want in the entities that will be passed
     * to `update()`. It is an entity filter by components.
     *
     * @param {Entity} parent The entity which own the system.
     * @param {Array.<AComponent>} requiredComponents Components filter to get complying entities which will be given to `update()` function.
     */
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

    /**
     * @returns {Entity} The Entity which own this system.
     */
    get parent()
    {
        return this._parent;
    }

    /**
     * @returns {Array<AComponent>} The components which will filter entities to be given to `update()`.
     */
    get requiredComponents()
    {
        return this._requiredComponents;
    }

    /**
     * This function will be called on each `update()` call from the parent entity or an entity which own the parent.
     *
     * You must override this function, it represent the behaviours of your system.
     *
     * @override
     * @param {Array.<Entity>} entities All entities available in the tree which comply to the required components.
     */
    update(entities)
    {

    }

    /**
     * This field is used as type checking.
     *
     * You will often pass your inherited class directly as a class - not as an instance.
     * This static field return a well-known symbol which will be equality checked to ensure
     * inheritance.
     * @private
     */
    static get _ASystemSymbol()
    {
        return ASystemSymbol;
    }
}

module.exports = ASystem;