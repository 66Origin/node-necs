'use strict';
const toPairs = require('lodash/toPairs');

const { ASystemSymbol } = require('./internal/symbols')
const AComponent = require('./acomponent');

/**
 * `SystemComponent` allow you to add systems to an entity. We recommand to add it
 * only to root entities to keep simple and predictable behaviours.
 */
class SystemComponent extends AComponent
{
    constructor(parent)
    {
        super(parent);

        /**
         * All systems attached to this entity.
         * @type {Object.<ASystem>}
         * @private
         */
        this._systems = [];
    }

    /**
     * Add a system.
     * 
     * See ASystem documentation for more informations. 
     * 
     * @param {ASystem} SystemType System to add.
     * @param {*} ...args Arguments to pass to system constructor
     */
    add(SystemType, ...args)
    {
        this._assertASystemType(SystemType);
        this._systems.push(new SystemType(this.parent, ...args));
    }

    /**
     * Delete a system. If system is not found, an error will be thrown.
     * 
     * @param {ASystem} SystemType System to remove.
     */
    delete(SystemType)
    {
        this._assertASystemType(SystemType);
        const systemIndex = this._findSystemIndex(SystemType);
        if (systemIndex === -1)
        {
            throw new Error('Can not delete system: not found');
        }

        this._systems.splice(systemIndex, 1);
    }

    update()
    {
        // Get all entities which comply to required components.
        const rootEntity = this.parent;

        this._systems.forEach(system =>
        {
            const complyingEntities = [];
            this._findComplyingEntities(rootEntity, system, complyingEntities);
            system.update(complyingEntities);
        });
    }

    _findSystemIndex(SystemType)
    {
        return this._systems.findIndex(system =>
        {
            return system.constructor === SystemType;
        });
    }

    _findComplyingEntities(entity, system, complyingEntities)
    {
        if (entity.has(system.requiredComponents))
        {
            complyingEntities.push(entity);
        }

        toPairs(entity._childs).forEach(child =>
        {
            this._findComplyingEntities(child[1], system, complyingEntities);
        });
    }

    _assertASystemType(SystemType)
    {
        if (SystemType._ASystemSymbol !== ASystemSymbol)
        {
            throw new TypeError('SystemType must be a type which inherit ASystem');
        }
    }

    get identity()
    {
        return SystemComponent.identity;
    }

    static get identity()
    {
        return 'systems';
    }
}

module.exports = SystemComponent;