'use strict';
const EventEmitter = require('events');
const isArray = require('lodash/isArray');
const get = require('lodash/get');
const toPairs = require('lodash/toPairs');

const AComponent = require('./acomponent');
const ASystem = require('./asystem');
const { AComponentSymbol } = require('./internal/symbols');

/**
 * An entity represent 'a thing' into your world.
 * 
 * By default, a component is empty: no behaviour, no meaning in your world. You
 * can create and attach components. As an example, you can create an entity named
 * `wall` which have the following components: `Position`, `Hitbox`, `Sprite`.
 * 
 * See `acomponents.js` or the example folder for more details about components.
 * 
 * Notes:
 * - No tag system available yet as it may involve iterating all over the tree,
 * which may create bad performances. It may be added later with optimisations.
 */
class Entity extends EventEmitter
{
    /**
     * Create an entity which have no parent: it will represent a world. It will
     * be the 'root', and will have many childs.
     * 
     * @param {?[AComponent]} ComponentsType Components to insert to the new entity. These components must be default-constructible.
     * @return {Entity}
     */
    static createWorld(ComponentsType = null)
    {
        const e = new Entity(null, ComponentsType);
        return e;
    }

    /**
     * Create a new entity.
     * You must NOT use this function: use `static createWorld()` or `createChild()`.
     * 
     * @private
     * @param {?Entity} parent The parent of this new entity. `null` mean it is a 'world' entity
     * @param {?[AComponent]} ComponentsType Components to insert to the new entity. These components must be default-constructible.
     */
    constructor(parent, ComponentsType = null)
    {
        super();

        // Enforce explicit typing of `parent`, forbidding `undefined`.
        if (parent !== null && !(parent instanceof Entity))
        {
            throw new TypeError('parent must be an Entity instance or null');
        }

        if (ComponentsType !== null && !isArray(ComponentsType))
        {
            throw new TypeError('Components must be an Array or null');
        }

        /**
         * Component name from parent entity. If this entity is a world,
         * it will remain null. This if for identifying entity from parent.
         * @type {?String}
         * @private
         */
        this._name = null;

        /**
         * All components attached to this entity.
         * @type {[AComponent]}
         * @private
         */
        this._components = [];

        /**
         * Parent of this entity. If this entity represent a world, it will be null.
         * @type {?Entity}
         * @private
         */
        this._parent = parent;
        
        /**
         * All named childs of this entity.
         * @type {Object<Entity>}
         * @private
         */
        this._childs = {};

        if (ComponentsType)
        {
            this.addMany(ComponentsType);
        }
    }

    /**
     * This function is automatically called on destruction. It will call
     * `destructor()` on every components. Do not use an entity after this
     * function being called.
     */
    _destructor()
    {
        this._components.forEach(component =>
        {
            component.destructor();
        });
    }

    /**
     * Create an entity which will be child of this entity.
     * 
     * @param {String} name Name of the child. You can later get the child using `_()` or `getChild()` functions.
     * @param {?[AComponent]} ComponentsType Components to insert to the new entity. These components must be default-constructible.
     * @return {Entity}
     */
    createChild(name, ComponentsType = null)
    {
        if (typeof name !== 'string')
        {
            throw new TypeError('name must be a string');
        }

        if (this._childs[name])
        {
            throw new Error('This child already exist');
        }

        const e = new Entity(this, ComponentsType);
        e._name = name;
        this._childs[name] = e;
        return e;
    }

    /**
     * Update all childs then our own components. This will call `update()` on
     * all child entities and on all components from this entity and childs.
     */
    update()
    {
        toPairs(this._childs).forEach(child =>
        {
            child[1].update();
        });

        this._components.forEach(component =>
        {
            component.update();
        });
    }

    /**
     * Get a child of this entity.
     * 
     * This function is just an alias for quick-access of `getChild(name)`.
     * 
     * @param {String} name Child name you want to get
     * @return {?Entity} The child or null if it does not exist.
     */
    _(name)
    {
        return this.getChild(name);
    }

    /**
     * Get a child of this entity.
     * 
     * @param {String} name Child name you want to get
     * @return {?Entity} The child or null if it does not exist.
     */
    getChild(name)
    {
        if (typeof name !== 'string')
        {
            throw new TypeError('name should be a string');
        }

        return get(this._childs, name, null);
    }

    /**
     * Delete a child. An error will be thrown if child is not found.
     * 
     * @param {String} name Child name you want to get
     */
    deleteChild(name)
    {
        if (typeof name !== 'string')
        {
            throw new TypeError('name should be a string');
        }

        if (!this._childs[name])
        {
            throw new Error('can not delete child: not found');
        }
        this._childs[name]._destructor();
        delete this._childs[name];
    }

    /**
     * Delete this entity. It must be a child of another entity, else an error will
     * be thrown.
     */
    deleteThis()
    {
        if (!this._name)
        {
            throw new Error('This entity have no parent. You can not delete it.');
        }

        this.parent.deleteChild(this._name);
    }

    /**
     * Get the entity which own this entity.
     * 
     * If this entity represent the world, it will return `null`.
     * 
     * @return {?Entity} Owner of this entity.
     */
    get parent()
    {
        return this._parent;
    }

    /**
     * Know if components are present on this entity.
     * If not components are given, it will return `true`.
     * 
     * @param {[AComponent]} ComponentsType Components that may exist on this entity
     * @return {Boolean} `true` if all components are present
     */
    has(ComponentsType)
    {
        if (!isArray(ComponentsType))
        {
            throw new TypeError('ComponentsType must be an Array');
        }

        return ComponentsType.every(ComponentType =>
        {
            this._assertAComponentType(ComponentType);

            return this._findComponentIndex(ComponentType) !== -1;
        });
    }

    /**
     * Add a component to this entity.
     * 
     * @param {AComponent} ComponentType The type of the component to add
     * @param  {...any} args Arguments to pass to the component constructor
     */
    add(ComponentType, ...args)
    {
        this._assertAComponentType(ComponentType);
        const component = new ComponentType(this, ...args);
        this._assertAComponent(component);

        if (this[component.identity])
        {
            throw new Error('Can not add twice same component');
        }

        this._components.push(component);
        this[component.identity] = component;
    }

    /**
     * Add many components to this entity. Each component must be default-constructible.
     * @param {[AComponent]} ComponentsType Type of the components to add
     */
    addMany(ComponentsType)
    {
        if (!isArray(ComponentsType))
        {
            throw new TypeError('Components must be an Array');
        }

        ComponentsType.forEach(ComponentType =>
        {
            this.add(ComponentType);
        });
    }

    /**
     * Delete a specific component from this entity. If the Component is not
     * found, an error will be thrown.
     * 
     * @param {AComponent} ComponentType Type of the component to delete
     */
    delete(ComponentType)
    {
        this._assertAComponentType(ComponentType);

        const componentIndex = this._findComponentIndex(ComponentType);
        if (componentIndex === -1)
        {
            throw new Error('Can not delete component: not found');
        }

        this._components[componentIndex].destructor();
        delete this[ComponentType.identity];
        this._components.splice(componentIndex, 1);
    }

    /**
     * Delete specific components from this entity. If a component is not found,
     * an error will be thrown.
     * @param {[AComponent]} ComponentsType Type of the components to delete
     */
    deleteMany(ComponentsType)
    {
        if (!isArray(ComponentsType))
        {
            throw new TypeError('Components must be an Array');
        }

        ComponentsType.forEach(el => this.delete(el));
    }

    /**
     * Assert (eg. throw) that the given component type is valid.
     * 
     * @private
     * @param {AComponent} ComponentType The type of the component to assert
     */
    _assertAComponentType(ComponentType)
    {
        if (ComponentType._AComponentSymbol !== AComponentSymbol || !ComponentType.identity)
        {
            throw new TypeError('ComponentType must be a type which inherit AComponent and implement name properties');
        }
    }

    /**
     * Assert (eg. throw) that the given component instance is valid.
     * 
     * @private
     * @param {AComponent} component Instance of the component to assert
     */
    _assertAComponent(component)
    {
        if (!(component instanceof AComponent) || !component.identity)
        {
            throw new TypeError('component must inherit AComponent and implement name properties');
        }

        if (component.identity !== component.constructor.identity)
        {
            throw new Error('identity and Class.identity do not return the same value');
        }
    }

    /**
     * Find the index of a component type from `this._components`.
     * 
     * @private
     * @param {AComponent} ComponentType The component to find on this entity
     * @return {Number} The index of the component or `-1` if not found.
     */
    _findComponentIndex(ComponentType)
    {
        return this._components.findIndex(component =>
        {
            return ComponentType.identity === component.identity;
        });
    }
}

module.exports = Entity;
