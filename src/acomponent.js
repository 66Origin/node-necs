'use strict';

const { AComponentSymbol } = require('./internal/symbols');

class AComponent
{
    /**
     * @override
     * @returns {null}
     */
    get name()
    {
        return null;
    }

    /**
     * @override
     * @returns {null}
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