'use strict';

const { ASystemSymbol } = require('./internal/symbols');

/**
 * `ASystem` mean Abstract System. You must inherit this class to create systems.
 *
 * A system is a 'module' on which `update()` will run on each `update()` call from the world entity.
 * It perform predictable actions on a set of entities.
 *
 * On inheriting ASystem, you must set a constructor which call `super()`. First argument is the parent which will be
 * given to your constructor. The second argument must be specified from your constructor. It must be an array with all
 * the components the system can work on.
 *
 * When `update(entities)` is called, first argument is an array of entities, which comply to your components requirements.
 * All entities that have all the required components will be in the given array.
 *
 * See examples to understand how systems work. Also take a look to `system_component.js` file. It is a component that
 * let you add systems to any entities.
 */
class ASystem
{
    /**
     * On inheriting `ASystem`, parent will be given to your constructor as first argument. You just have to pass
     * `parent` to `super()`.
     *
     * `requiredComponents` must be specified by yourself: all the components you want in the entities that will be passed
     * to `update()`.
     *
     * @param {Entity} parent The entity which own the system.
     * @param {Array.<AComponent>} requiredComponents Components that are required for the entities passed to your update function.
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

    get parent()
    {
        return this._parent;
    }

    get requiredComponents()
    {
        return this._requiredComponents;
    }

    /**
     * This function will be called on each `update()` call from the parent entity or an entity which own the parent.
     *
     * You must override this function, it is all the behaviors of your system.
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