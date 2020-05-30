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
export class EntityActionGuard {
    /**
     * @param {?} entityName
     * @param {?} selectId
     */
    constructor(entityName, selectId) {
        this.entityName = entityName;
        this.selectId = selectId;
    }
    /**
     * Throw if the action payload is not an entity with a valid key
     * @param {?} action
     * @return {?}
     */
    mustBeEntity(action) {
        /** @type {?} */
        const data = this.extractData(action);
        if (!data) {
            return this.throwError(action, `should have a single entity.`);
        }
        /** @type {?} */
        const id = this.selectId(data);
        if (this.isNotKeyType(id)) {
            this.throwError(action, `has a missing or invalid entity key (id)`);
        }
        return (/** @type {?} */ (data));
    }
    /**
     * Throw if the action payload is not an array of entities with valid keys
     * @param {?} action
     * @return {?}
     */
    mustBeEntities(action) {
        /** @type {?} */
        const data = this.extractData(action);
        if (!Array.isArray(data)) {
            return this.throwError(action, `should be an array of entities`);
        }
        data.forEach((/**
         * @param {?} entity
         * @param {?} i
         * @return {?}
         */
        (entity, i) => {
            /** @type {?} */
            const id = this.selectId(entity);
            if (this.isNotKeyType(id)) {
                /** @type {?} */
                const msg = `, item ${i + 1}, does not have a valid entity key (id)`;
                this.throwError(action, msg);
            }
        }));
        return data;
    }
    /**
     * Throw if the action payload is not a single, valid key
     * @param {?} action
     * @return {?}
     */
    mustBeKey(action) {
        /** @type {?} */
        const data = this.extractData(action);
        if (!data) {
            throw new Error(`should be a single entity key`);
        }
        if (this.isNotKeyType(data)) {
            throw new Error(`is not a valid key (id)`);
        }
        return data;
    }
    /**
     * Throw if the action payload is not an array of valid keys
     * @param {?} action
     * @return {?}
     */
    mustBeKeys(action) {
        /** @type {?} */
        const data = this.extractData(action);
        if (!Array.isArray(data)) {
            return this.throwError(action, `should be an array of entity keys (id)`);
        }
        data.forEach((/**
         * @param {?} id
         * @param {?} i
         * @return {?}
         */
        (id, i) => {
            if (this.isNotKeyType(id)) {
                /** @type {?} */
                const msg = `${this.entityName} ', item ${i +
                    1}, is not a valid entity key (id)`;
                this.throwError(action, msg);
            }
        }));
        return data;
    }
    /**
     * Throw if the action payload is not an update with a valid key (id)
     * @param {?} action
     * @return {?}
     */
    mustBeUpdate(action) {
        /** @type {?} */
        const data = this.extractData(action);
        if (!data) {
            return this.throwError(action, `should be a single entity update`);
        }
        const { id, changes } = data;
        /** @type {?} */
        const id2 = this.selectId((/** @type {?} */ (changes)));
        if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
            this.throwError(action, `has a missing or invalid entity key (id)`);
        }
        return data;
    }
    /**
     * Throw if the action payload is not an array of updates with valid keys (ids)
     * @param {?} action
     * @return {?}
     */
    mustBeUpdates(action) {
        /** @type {?} */
        const data = this.extractData(action);
        if (!Array.isArray(data)) {
            return this.throwError(action, `should be an array of entity updates`);
        }
        data.forEach((/**
         * @param {?} item
         * @param {?} i
         * @return {?}
         */
        (item, i) => {
            const { id, changes } = item;
            /** @type {?} */
            const id2 = this.selectId((/** @type {?} */ (changes)));
            if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
                this.throwError(action, `, item ${i + 1}, has a missing or invalid entity key (id)`);
            }
        }));
        return data;
    }
    /**
     * Throw if the action payload is not an update response with a valid key (id)
     * @param {?} action
     * @return {?}
     */
    mustBeUpdateResponse(action) {
        /** @type {?} */
        const data = this.extractData(action);
        if (!data) {
            return this.throwError(action, `should be a single entity update`);
        }
        const { id, changes } = data;
        /** @type {?} */
        const id2 = this.selectId((/** @type {?} */ (changes)));
        if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
            this.throwError(action, `has a missing or invalid entity key (id)`);
        }
        return data;
    }
    /**
     * Throw if the action payload is not an array of update responses with valid keys (ids)
     * @param {?} action
     * @return {?}
     */
    mustBeUpdateResponses(action) {
        /** @type {?} */
        const data = this.extractData(action);
        if (!Array.isArray(data)) {
            return this.throwError(action, `should be an array of entity updates`);
        }
        data.forEach((/**
         * @param {?} item
         * @param {?} i
         * @return {?}
         */
        (item, i) => {
            const { id, changes } = item;
            /** @type {?} */
            const id2 = this.selectId((/** @type {?} */ (changes)));
            if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
                this.throwError(action, `, item ${i + 1}, has a missing or invalid entity key (id)`);
            }
        }));
        return data;
    }
    /**
     * @private
     * @template T
     * @param {?} action
     * @return {?}
     */
    extractData(action) {
        return action.payload && action.payload.data;
    }
    /**
     * Return true if this key (id) is invalid
     * @private
     * @param {?} id
     * @return {?}
     */
    isNotKeyType(id) {
        return typeof id !== 'string' && typeof id !== 'number';
    }
    /**
     * @private
     * @param {?} action
     * @param {?} msg
     * @return {?}
     */
    throwError(action, msg) {
        throw new Error(`${this.entityName} EntityAction guard for "${action.type}": payload ${msg}`);
    }
}
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