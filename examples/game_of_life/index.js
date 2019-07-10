/**
 * This is an implementation of the Game of Life using NECS.
 * https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
 * 
 * It may be poorly written and unoptimized, it is a quick demonstration for
 * fun purposes. An ECS is not the best paradigm for the Game Of Life.
 */

const TerminalCanvas = require('terminal-canvas');
const Entity = require('../../entity');
const AComponent = require('../../acomponent');
const ASystem = require('../../asystem');
const SystemComponent = require('../../system_component');

const uniqWith = require('lodash/uniqWith');
const isEqual = require('lodash/isEqual');
const uniqueId = require('lodash/uniqueId');

/**
 * Represent a living cell in the world
 * It have a position and we save if on the next state it will still be alive
 */
class CellComponent extends AComponent
{
    constructor(parentEntity, position)
    {
        super(parentEntity);

        if (typeof position !== 'object'
            || typeof position.x !== 'number' || typeof position.y !== 'number')
        {
            throw new TypeError('position is not properly set');
        }
        this._position = Object.assign({}, position);
        this._willBeAlive = true;
    }

    // Both identity() and static identity() are mandatory. Represent the name
    // of the component for easy access (eg. `component.cell`).
    get identity()
    {
        return CellComponent.identity;
    }

    static get identity()
    {
        return 'cell';
    }

    set willBeAlive(v)
    {
        this._willBeAlive = v;
    }

    get willBeAlive()
    {
        return this._willBeAlive;
    }

    get position()
    {
        return this._position;
    }
}

/**
 * A system that enforce Game of Life rules.
 * See https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life for rules
 */
class CellsRulesSystem extends ASystem
{
    constructor(parent)
    {
        super(parent, [CellComponent]);
    }

    update(entities)
    {
        const positionsToCreate = [];

        // forEach on all entities that comply to the requirements (eg. [CellComponent]: which have a CellComponent).
        entities.forEach(entity =>
        {
            const adjacentCount = this._countAdjacentEntity(entity, entities);
            this._findNewCells(entity, entities, positionsToCreate);
            // Mark cells to die according to rules
            if (adjacentCount <= 1)
            {
                entity.cell.willBeAlive = false;
            }
            else if (adjacentCount > 3)
            {
                entity.cell.willBeAlive = false;
            }
        });

        // Create new cells according to rules
        const uniquePositionsToCreate = uniqWith(positionsToCreate, isEqual);
        uniquePositionsToCreate.forEach(position =>
        {
            const child = this.parent.createChild(uniqueId('cell_'));
            child.add(CellComponent, position);
        });
    }

    _findNewCells(entity1, entities, positionsToCreate)
    {
        const positions =
        [
            {x: entity1.cell.position.x - 1, y: entity1.cell.position.y - 1},
            {x: entity1.cell.position.x - 1, y: entity1.cell.position.y + 0},
            {x: entity1.cell.position.x - 1, y: entity1.cell.position.y + 1},
            {x: entity1.cell.position.x + 0, y: entity1.cell.position.y - 1},
            {x: entity1.cell.position.x + 0, y: entity1.cell.position.y + 1},
            {x: entity1.cell.position.x + 1, y: entity1.cell.position.y - 1},
            {x: entity1.cell.position.x + 1, y: entity1.cell.position.y + 0},
            {x: entity1.cell.position.x + 1, y: entity1.cell.position.y + 1},
        ];

        positions.forEach(position =>
        {
            const count = this._countAdjacentPosition(position, entities);
            if (count === 3)
            {
                if (!this._isEntitiesOnPosition(position, entities))
                {
                    positionsToCreate.push(position);
                }
            }
        });
    }

    _isEntitiesOnPosition(position, entities)
    {
        return entities.some(entity =>
        {
            if (position.x === entity.cell.position.x &&
                position.y === entity.cell.position.y)
            {
                return true;
            }
            return false;
        }); 
    }

    _countAdjacentPosition(position1, entities)
    {
        let count = 0;
        entities.forEach(entity2 =>
        {
            if (this._isAdjacent(position1, entity2.cell.position))
            {
                ++count;
            }
        });

        return count;
    }

    _countAdjacentEntity(entity1, entities)
    {
        let count = 0;
        entities.forEach(entity2 =>
        {
            if (entity1 !== entity2
                && this._isAdjacent(entity1.cell.position, entity2.cell.position))
            {
                ++count;
            }
        });

        return count;
    }

    _isAdjacent(position1, position2)
    {
        if (Math.abs(position1.x - position2.x) <= 1
            && Math.abs(position1.y - position2.y) <= 1)
        {
            return true;
        }

        return false;
    }
}

/**
 * System that delete cells marked as dead.
 */
class DeleteDeadCellsSystem extends ASystem
{
    constructor(parent)
    {
        super(parent, [CellComponent]);
    }

    update(entities)
    {
        entities.forEach(entity =>
        {
            if (!entity.cell.willBeAlive)
            {
                entity.deleteThis();
            }
        });
    }
}

/**
 * System that draw cell on the terminal using `TerminalCanvas`.
 */
class DrawSystem extends ASystem
{
    constructor(parent)
    {
        super(parent, [CellComponent]);
        this._canvas = new TerminalCanvas();
        this._BLOCK_CHARACTER = '\u2588';
        this._canvas.reset();
    }

    update(entities)
    {
        this._canvas.eraseScreen();
        entities.forEach(entity =>
        {
            const position = entity.cell.position;
            this._canvas.moveTo(position.x, position.y);
            this._canvas.write(this._BLOCK_CHARACTER);
            this._canvas.flush();
        });
        this._canvas.moveTo(200, 200);
        this._canvas.write(this._BLOCK_CHARACTER);
        this._canvas.flush();
    }
}

// Create the world and add the systems.
// Systems are always executed in order of adding
const world = Entity.createWorld([SystemComponent]);
world.systems.add(CellsRulesSystem);
world.systems.add(DeleteDeadCellsSystem);
world.systems.add(DrawSystem);

// Initial cells
const child1 = world.createChild('child1');
child1.add(CellComponent, {x: 15, y: 15});

const child2 = world.createChild('child2');
child2.add(CellComponent, {x: 16, y: 15});

const child3 = world.createChild('child3');
child3.add(CellComponent, {x: 17, y: 15});

const child4 = world.createChild('child4');
child4.add(CellComponent, {x: 17, y: 14});

const child5 = world.createChild('child5');
child5.add(CellComponent, {x: 16, y: 13});

// Then update every N ms, cells will live and move thanks to systems.
setInterval(() =>
{
    world.update();
}, 50);