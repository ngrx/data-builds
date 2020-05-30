/**
 * @fileoverview added by tsickle
 * Generated from: src/actions/entity-action-guard.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Guard methods that ensure EntityAction payload is as expected.
 * Each method returns that payload if it passes the guard or
 * throws an error.
 * @template T
 */
var /**
 * Guard methods that ensure EntityAction payload is as expected.
 * Each method returns that payload if it passes the guard or
 * throws an error.
 * @template T
 */
EntityActionGuard = /** @class */ (function () {
    function EntityActionGuard(entityName, selectId) {
        this.entityName = entityName;
        this.selectId = selectId;
    }
    /** Throw if the action payload is not an entity with a valid key */
    /**
     * Throw if the action payload is not an entity with a valid key
     * @param {?} action
     * @return {?}
     */
    EntityActionGuard.prototype.mustBeEntity = /**
     * Throw if the action payload is not an entity with a valid key
     * @param {?} action
     * @return {?}
     */
    function (action) {
        /** @type {?} */
        var data = this.extractData(action);
        if (!data) {
            return this.throwError(action, "should have a single entity.");
        }
        /** @type {?} */
        var id = this.selectId(data);
        if (this.isNotKeyType(id)) {
            this.throwError(action, "has a missing or invalid entity key (id)");
        }
        return (/** @type {?} */ (data));
    };
    /** Throw if the action payload is not an array of entities with valid keys */
    /**
     * Throw if the action payload is not an array of entities with valid keys
     * @param {?} action
     * @return {?}
     */
    EntityActionGuard.prototype.mustBeEntities = /**
     * Throw if the action payload is not an array of entities with valid keys
     * @param {?} action
     * @return {?}
     */
    function (action) {
        var _this = this;
        /** @type {?} */
        var data = this.extractData(action);
        if (!Array.isArray(data)) {
            return this.throwError(action, "should be an array of entities");
        }
        data.forEach((/**
         * @param {?} entity
         * @param {?} i
         * @return {?}
         */
        function (entity, i) {
            /** @type {?} */
            var id = _this.selectId(entity);
            if (_this.isNotKeyType(id)) {
                /** @type {?} */
                var msg = ", item " + (i + 1) + ", does not have a valid entity key (id)";
                _this.throwError(action, msg);
            }
        }));
        return data;
    };
    /** Throw if the action payload is not a single, valid key */
    /**
     * Throw if the action payload is not a single, valid key
     * @param {?} action
     * @return {?}
     */
    EntityActionGuard.prototype.mustBeKey = /**
     * Throw if the action payload is not a single, valid key
     * @param {?} action
     * @return {?}
     */
    function (action) {
        /** @type {?} */
        var data = this.extractData(action);
        if (!data) {
            throw new Error("should be a single entity key");
        }
        if (this.isNotKeyType(data)) {
            throw new Error("is not a valid key (id)");
        }
        return data;
    };
    /** Throw if the action payload is not an array of valid keys */
    /**
     * Throw if the action payload is not an array of valid keys
     * @param {?} action
     * @return {?}
     */
    EntityActionGuard.prototype.mustBeKeys = /**
     * Throw if the action payload is not an array of valid keys
     * @param {?} action
     * @return {?}
     */
    function (action) {
        var _this = this;
        /** @type {?} */
        var data = this.extractData(action);
        if (!Array.isArray(data)) {
            return this.throwError(action, "should be an array of entity keys (id)");
        }
        data.forEach((/**
         * @param {?} id
         * @param {?} i
         * @return {?}
         */
        function (id, i) {
            if (_this.isNotKeyType(id)) {
                /** @type {?} */
                var msg = _this.entityName + " ', item " + (i +
                    1) + ", is not a valid entity key (id)";
                _this.throwError(action, msg);
            }
        }));
        return data;
    };
    /** Throw if the action payload is not an update with a valid key (id) */
    /**
     * Throw if the action payload is not an update with a valid key (id)
     * @param {?} action
     * @return {?}
     */
    EntityActionGuard.prototype.mustBeUpdate = /**
     * Throw if the action payload is not an update with a valid key (id)
     * @param {?} action
     * @return {?}
     */
    function (action) {
        /** @type {?} */
        var data = this.extractData(action);
        if (!data) {
            return this.throwError(action, "should be a single entity update");
        }
        var id = data.id, changes = data.changes;
        /** @type {?} */
        var id2 = this.selectId((/** @type {?} */ (changes)));
        if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
            this.throwError(action, "has a missing or invalid entity key (id)");
        }
        return data;
    };
    /** Throw if the action payload is not an array of updates with valid keys (ids) */
    /**
     * Throw if the action payload is not an array of updates with valid keys (ids)
     * @param {?} action
     * @return {?}
     */
    EntityActionGuard.prototype.mustBeUpdates = /**
     * Throw if the action payload is not an array of updates with valid keys (ids)
     * @param {?} action
     * @return {?}
     */
    function (action) {
        var _this = this;
        /** @type {?} */
        var data = this.extractData(action);
        if (!Array.isArray(data)) {
            return this.throwError(action, "should be an array of entity updates");
        }
        data.forEach((/**
         * @param {?} item
         * @param {?} i
         * @return {?}
         */
        function (item, i) {
            var id = item.id, changes = item.changes;
            /** @type {?} */
            var id2 = _this.selectId((/** @type {?} */ (changes)));
            if (_this.isNotKeyType(id) || _this.isNotKeyType(id2)) {
                _this.throwError(action, ", item " + (i + 1) + ", has a missing or invalid entity key (id)");
            }
        }));
        return data;
    };
    /** Throw if the action payload is not an update response with a valid key (id) */
    /**
     * Throw if the action payload is not an update response with a valid key (id)
     * @param {?} action
     * @return {?}
     */
    EntityActionGuard.prototype.mustBeUpdateResponse = /**
     * Throw if the action payload is not an update response with a valid key (id)
     * @param {?} action
     * @return {?}
     */
    function (action) {
        /** @type {?} */
        var data = this.extractData(action);
        if (!data) {
            return this.throwError(action, "should be a single entity update");
        }
        var id = data.id, changes = data.changes;
        /** @type {?} */
        var id2 = this.selectId((/** @type {?} */ (changes)));
        if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
            this.throwError(action, "has a missing or invalid entity key (id)");
        }
        return data;
    };
    /** Throw if the action payload is not an array of update responses with valid keys (ids) */
    /**
     * Throw if the action payload is not an array of update responses with valid keys (ids)
     * @param {?} action
     * @return {?}
     */
    EntityActionGuard.prototype.mustBeUpdateResponses = /**
     * Throw if the action payload is not an array of update responses with valid keys (ids)
     * @param {?} action
     * @return {?}
     */
    function (action) {
        var _this = this;
        /** @type {?} */
        var data = this.extractData(action);
        if (!Array.isArray(data)) {
            return this.throwError(action, "should be an array of entity updates");
        }
        data.forEach((/**
         * @param {?} item
         * @param {?} i
         * @return {?}
         */
        function (item, i) {
            var id = item.id, changes = item.changes;
            /** @type {?} */
            var id2 = _this.selectId((/** @type {?} */ (changes)));
            if (_this.isNotKeyType(id) || _this.isNotKeyType(id2)) {
                _this.throwError(action, ", item " + (i + 1) + ", has a missing or invalid entity key (id)");
            }
        }));
        return data;
    };
    /**
     * @private
     * @template T
     * @param {?} action
     * @return {?}
     */
    EntityActionGuard.prototype.extractData = /**
     * @private
     * @template T
     * @param {?} action
     * @return {?}
     */
    function (action) {
        return action.payload && action.payload.data;
    };
    /** Return true if this key (id) is invalid */
    /**
     * Return true if this key (id) is invalid
     * @private
     * @param {?} id
     * @return {?}
     */
    EntityActionGuard.prototype.isNotKeyType = /**
     * Return true if this key (id) is invalid
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return typeof id !== 'string' && typeof id !== 'number';
    };
    /**
     * @private
     * @param {?} action
     * @param {?} msg
     * @return {?}
     */
    EntityActionGuard.prototype.throwError = /**
     * @private
     * @param {?} action
     * @param {?} msg
     * @return {?}
     */
    function (action, msg) {
        throw new Error(this.entityName + " EntityAction guard for \"" + action.type + "\": payload " + msg);
    };
    return EntityActionGuard;
}());
/**
 * Guard methods that ensure EntityAction payload is as expected.
 * Each method returns that payload if it passes the guard or
 * throws an error.
 * @template T
 */
export { EntityActionGuard };
if (false) {
    /**
     * @type {?}
     * @private
     */
    EntityActionGuard.prototype.entityName;
    /**
     * @type {?}
     * @private
     */
    EntityActionGuard.prototype.selectId;
}
//# sourceMappingURL=entity-action-guard.js.map