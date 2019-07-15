'use strict';
const SafeEventEmitter = require('safe-event-emitter');
const isArray = require('lodash/isArray');
const get = require('lodash/get');
const toPairs = require('lodash/toPairs');

const AComponent = require('./acomponent');
const ASystem = require('./asystem');
const { AComponentSymbol } = require('./internal/symbols');

/**
 * An entity represent 'a thing' into your world.
 * 
 * By default, a component is empty: no behaviours, no meaning, no purpose.
 *
 * - You can create and attach components. As an example, you can create an entity named
 * `wall` which have the following components: `Position`, `Hitbox`, `Sprite`.
 * - You can create child entities.
 * 
 * See `acomponents.js` or the example folder for more details about components.
 *
 * On updating an entity, this procedure apply:
 * - Call `earlyUpdate()` on child entities (which call `earlyUpdate()` on child entities then components)
 * - Call `earlyUpdate()` on entity's components
 * - Call `lateUpdate()` on child entities (which call `lateUpdate()` on child entities then components)
 * - Call `lateUpdate()` on entity's components
 *
 * It may be useful if you have a drawing system:
 * - On your world, a component is drawing sprites on screen
 * - Childs of your world are sprites.
 * - First, sprites get `earlyUpdate()` called
 * - Then, drawing system get `earlyUpdate()` called
 * - Finally, sprites get `lateUpdate()` called
 */
class Entity extends SafeEventEmitter
{
    /**
     * Create an entity which have no parent: it will represent a world. It will
     * be the 'root', and will have many childs.
     * 
     * @param {Array.<AComponent>=} ComponentsType Components to insert to the new entity. These components must be default-constructible.
     * @return {Entity}
     */
    static createWorld(ComponentsType = null)
    {
        const e = new Entity(null, ComponentsType);
        return e;
    }

    /**
     * Create a new entity.
     *
     * You must **NOT** use this function: use `static createWorld()` or `createChild()`.
     * 
     * @param {Entity=} parent The parent of this new entity. `null` mean it is a 'world' entity
     * @param {Array.<AComponent>=} ComponentsType Components to insert to the new entity. These components must be default-constructible.
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
         * @type {Array.<AComponent>}
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
     *
     * @private
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
     * @param {Array.<AComponent>=} ComponentsType Components to add to the new entity. These components must be default-constructible.
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
     * Call `earlyUpdate()` on childs then this entity own components.
     * @private
     */
    _earlyUpdate()
    {
        toPairs(this._childs).forEach(child =>
        {
            child[1]._earlyUpdate();
        });

        this._components.forEach(component =>
        {
                component.earlyUpdate();
        });
    }

    /**
     * Call `lateUpdate()` on childs then this entity own components.
     * @private
     */
    _lateUpdate()
    {
        toPairs(this._childs).forEach(child =>
        {
            child[1]._lateUpdate();
        });

        this._components.forEach(component =>
        {
                component.lateUpdate();
        });
    }

    /**
     * Call `earlyUpdate()` then `lateUpdate()`. See documentation of Entity for more information about
     * the `update()`.
     *
     * You should call this function only on your world Entity.
     */
    update()
    {
        this._earlyUpdate();
        this._lateUpdate();
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
     * Get all childs of this entity. The returned object is a copy of the internal representation and is frozen.
     *
     * So on, it is read-only.
     *
     * The returned object won't be kept up to date with later adding or deleting.
     *
     * @return {Object} An object with child name as key and child as value
     */
    get childs()
    {
        const childs = Object.assign({}, this._childs);
        return Object.freeze(childs);
    }

    /**
     * Delete a child. An error will be thrown if child is not found.
     * 
     * @param {String} name Child name you want to delete
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
     * Delete this entity. It must be have a parent, else an error will
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
     * Get the name of this entity. All entities have a name excepted world entities which have no parent.
     *
     * @returns {?String} Name of this entity
     */
    get name()
    {
        return this._name;
    }

    /**
     * Know if components are present on this entity.
     * If not components are given, it will return `true`.
     *
     * This function will also return `true` if you give a super class of an installed component.
     * You can by example have `ADrawableComponent` which is inherited by `SpriteComponent`,
     * `TextComponent`, ...
     * 
     * @param {Array.<AComponent>} ComponentsType Components that may exist on this entity
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
     * Get a specific component from this entity.
     *
     * If you pass a super class of your component, it will return it.
     *
     * @param {AComponent=} ComponentType Type of your component or a subclass to get. `null` if not found.
     */
    get(ComponentType)
    {
        this._assertAComponentType(ComponentType);
        const componentIndex = this._findComponentIndex(ComponentType);

        if (componentIndex !== -1)
        {
            return this._components[componentIndex];
        }
        return null;
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

        if (this[ComponentType.identity] || this._findComponentIndex(ComponentType) !== -1)
        {
            throw new Error('Can not add twice same component. Note that you can not add multiples components with same super class.');
        }

        const component = new ComponentType(this, ...args);
        this._assertAComponent(component);

        this._components.push(component);
        this[component.identity] = component;
    }

    /**
     * Add many components to this entity. Each component must be default-constructible.
     * @param {Array.<AComponent>} ComponentsType Types of the components to add
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
     * @param {Array.<AComponent>} ComponentsType Type of the components to delete
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
            return component instanceof ComponentType;
        });
    }
}

module.exports = Entity;
