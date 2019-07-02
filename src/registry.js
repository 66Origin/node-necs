'use strict';
const Entity = require('./entity');
const System = require('./system');

class Registry
{
    constructor()
    {
        this._entities = [];
        this._systems = [];
    }

    addSystem(SystemType)
    {
        this._systems.push(new SystemType());
    }

    deleteSystem(SystemType)
    {
        const systemIndex = this._systems.findIndex(system =>
        {
            return system instanceof SystemType;
        });

        this._systems[systemIndex].destructor();
        this._systems.splice(systemIndex, 1);
    }

    deleteAllSystems()
    {
        this._systems.forEach(system =>
        {
            system.destructor();
        });
        this._systems = [];
    }

    // todo: construct in place components?
    create(tag = null, components)
    {
        const e = new Entity(tag);
        this._entities.push(e);

        if (components)
        {
            e.addMany(components);
        }

        return e;
    }

    delete(entity)
    {
        this._assertValidEntity(entity);

        const entityIndex = this._findEntityIndex(entity);
        if (entityIndex === -1)
        {
            throw new Error('can not delete component: not found');
        }

        this._entities.splice(entityIndex, 1);
    }

    deleteAllEntities()
    {
        this._entities = [];
    }

    deleteMany(entities)
    {
        entities.forEach(this.delete);
    }

    has(entity)
    {
        const entityIndex = this._findEntityIndex(entity);
        return entityIndex !== -1;
    }

    hasMany(entities)
    {
        entities.every(entity =>
        {
            return this.has(entity);
        });
    }

    searchByComponents(components)
    {
        return this._entities.find(entity =>
        {
            return entity.has(components);
        });
    }

    searchManyByComponents(components)
    {
        return this._entities.filter(entity =>
        {
            return entity.has(components);
        });
    }

    searchByTag(tag)
    {
        return this._entities.find(entity =>
        {
            return entity.tag === tag;
        });
    }

    searchManyByTag(tag)
    {
        return this._entities.filter(entity =>
        {
            return entity.tag === tag;
        });
    }

    _findEntityIndex(entityToFind)
    {
        return this._entities.findIndex(entity =>
        {
            return entity === entityToFind;
        })
    }

    _assertValidEntity(entity)
    {
        if (!(entity instanceof Entity))
        {
            throw new TypeError('entity must be an instanceof Entity');
        }
    }

    // still need systems
}

module.exports = Registry;