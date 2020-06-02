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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWFjdGlvbi1ndWFyZC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3J4L2RhdGEvIiwic291cmNlcyI6WyJzcmMvYWN0aW9ucy9lbnRpdHktYWN0aW9uLWd1YXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7SUFDRSwyQkFBb0IsVUFBa0IsRUFBVSxRQUF1QjtRQUFuRCxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBZTtJQUFHLENBQUM7SUFFM0Usb0VBQW9FOzs7Ozs7SUFDcEUsd0NBQVk7Ozs7O0lBQVosVUFBYSxNQUF1Qjs7WUFDNUIsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDVCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLDhCQUE4QixDQUFDLENBQUM7U0FDaEU7O1lBQ0ssRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQzlCLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUN6QixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSwwQ0FBMEMsQ0FBQyxDQUFDO1NBQ3JFO1FBQ0QsT0FBTyxtQkFBQSxJQUFJLEVBQUssQ0FBQztJQUNuQixDQUFDO0lBRUQsOEVBQThFOzs7Ozs7SUFDOUUsMENBQWM7Ozs7O0lBQWQsVUFBZSxNQUF5QjtRQUF4QyxpQkFhQzs7WUFaTyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDeEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO1NBQ2xFO1FBQ0QsSUFBSSxDQUFDLE9BQU87Ozs7O1FBQUMsVUFBQyxNQUFN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QUM7U0FDeEU7UUFDRCxJQUFJLENBQUMsT0FBTzs7Ozs7UUFBQyxVQUFDLElBQUksRUFBRSxDQUFDO1lBQ1gsSUFBQSxZQUFFLEVBQUUsc0JBQU87O2dCQUNiLEdBQUcsR0FBRyxLQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFBLE9BQU8sRUFBSyxDQUFDO1lBQ3ZDLElBQUksS0FBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNuRCxLQUFJLENBQUMsVUFBVSxDQUNiLE1BQU0sRUFDTixhQUFVLENBQUMsR0FBRyxDQUFDLGdEQUE0QyxDQUM1RCxDQUFDO2FBQ0g7UUFDSCxDQUFDLEVBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQzs7Ozs7OztJQUVPLHVDQUFXOzs7Ozs7SUFBbkIsVUFBdUIsTUFBdUI7UUFDNUMsT0FBTyxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQy9DLENBQUM7SUFFRCw4Q0FBOEM7Ozs7Ozs7SUFDdEMsd0NBQVk7Ozs7OztJQUFwQixVQUFxQixFQUFPO1FBQzFCLE9BQU8sT0FBTyxFQUFFLEtBQUssUUFBUSxJQUFJLE9BQU8sRUFBRSxLQUFLLFFBQVEsQ0FBQztJQUMxRCxDQUFDOzs7Ozs7O0lBRU8sc0NBQVU7Ozs7OztJQUFsQixVQUFtQixNQUFvQixFQUFFLEdBQVc7UUFDbEQsTUFBTSxJQUFJLEtBQUssQ0FDVixJQUFJLENBQUMsVUFBVSxrQ0FDaEIsTUFBTSxDQUFDLElBQUksb0JBQ0MsR0FBSyxDQUNwQixDQUFDO0lBQ0osQ0FBQztJQUNILHdCQUFDO0FBQUQsQ0FBQyxBQWxKRCxJQWtKQzs7Ozs7Ozs7Ozs7OztJQWpKYSx1Q0FBMEI7Ozs7O0lBQUUscUNBQStCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSWRTZWxlY3RvciwgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IFVwZGF0ZVJlc3BvbnNlRGF0YSB9IGZyb20gJy4uL2FjdGlvbnMvdXBkYXRlLXJlc3BvbnNlLWRhdGEnO1xuXG4vKipcbiAqIEd1YXJkIG1ldGhvZHMgdGhhdCBlbnN1cmUgRW50aXR5QWN0aW9uIHBheWxvYWQgaXMgYXMgZXhwZWN0ZWQuXG4gKiBFYWNoIG1ldGhvZCByZXR1cm5zIHRoYXQgcGF5bG9hZCBpZiBpdCBwYXNzZXMgdGhlIGd1YXJkIG9yXG4gKiB0aHJvd3MgYW4gZXJyb3IuXG4gKi9cbmV4cG9ydCBjbGFzcyBFbnRpdHlBY3Rpb25HdWFyZDxUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZW50aXR5TmFtZTogc3RyaW5nLCBwcml2YXRlIHNlbGVjdElkOiBJZFNlbGVjdG9yPFQ+KSB7fVxuXG4gIC8qKiBUaHJvdyBpZiB0aGUgYWN0aW9uIHBheWxvYWQgaXMgbm90IGFuIGVudGl0eSB3aXRoIGEgdmFsaWQga2V5ICovXG4gIG11c3RCZUVudGl0eShhY3Rpb246IEVudGl0eUFjdGlvbjxUPik6IFQge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgYHNob3VsZCBoYXZlIGEgc2luZ2xlIGVudGl0eS5gKTtcbiAgICB9XG4gICAgY29uc3QgaWQgPSB0aGlzLnNlbGVjdElkKGRhdGEpO1xuICAgIGlmICh0aGlzLmlzTm90S2V5VHlwZShpZCkpIHtcbiAgICAgIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIGBoYXMgYSBtaXNzaW5nIG9yIGludmFsaWQgZW50aXR5IGtleSAoaWQpYCk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhIGFzIFQ7XG4gIH1cblxuICAvKiogVGhyb3cgaWYgdGhlIGFjdGlvbiBwYXlsb2FkIGlzIG5vdCBhbiBhcnJheSBvZiBlbnRpdGllcyB3aXRoIHZhbGlkIGtleXMgKi9cbiAgbXVzdEJlRW50aXRpZXMoYWN0aW9uOiBFbnRpdHlBY3Rpb248VFtdPik6IFRbXSB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgc2hvdWxkIGJlIGFuIGFycmF5IG9mIGVudGl0aWVzYCk7XG4gICAgfVxuICAgIGRhdGEuZm9yRWFjaCgoZW50aXR5LCBpKSA9PiB7XG4gICAgICBjb25zdCBpZCA9IHRoaXMuc2VsZWN0SWQoZW50aXR5KTtcbiAgICAgIGlmICh0aGlzLmlzTm90S2V5VHlwZShpZCkpIHtcbiAgICAgICAgY29uc3QgbXNnID0gYCwgaXRlbSAke2kgKyAxfSwgZG9lcyBub3QgaGF2ZSBhIHZhbGlkIGVudGl0eSBrZXkgKGlkKWA7XG4gICAgICAgIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIG1zZyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICAvKiogVGhyb3cgaWYgdGhlIGFjdGlvbiBwYXlsb2FkIGlzIG5vdCBhIHNpbmdsZSwgdmFsaWQga2V5ICovXG4gIG11c3RCZUtleShhY3Rpb246IEVudGl0eUFjdGlvbjxzdHJpbmcgfCBudW1iZXI+KTogc3RyaW5nIHwgbnVtYmVyIHwgbmV2ZXIge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHNob3VsZCBiZSBhIHNpbmdsZSBlbnRpdHkga2V5YCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmlzTm90S2V5VHlwZShkYXRhKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBpcyBub3QgYSB2YWxpZCBrZXkgKGlkKWApO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIC8qKiBUaHJvdyBpZiB0aGUgYWN0aW9uIHBheWxvYWQgaXMgbm90IGFuIGFycmF5IG9mIHZhbGlkIGtleXMgKi9cbiAgbXVzdEJlS2V5cyhhY3Rpb246IEVudGl0eUFjdGlvbjwoc3RyaW5nIHwgbnVtYmVyKVtdPik6IChzdHJpbmcgfCBudW1iZXIpW10ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICByZXR1cm4gdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgYHNob3VsZCBiZSBhbiBhcnJheSBvZiBlbnRpdHkga2V5cyAoaWQpYCk7XG4gICAgfVxuICAgIGRhdGEuZm9yRWFjaCgoaWQsIGkpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzTm90S2V5VHlwZShpZCkpIHtcbiAgICAgICAgY29uc3QgbXNnID0gYCR7dGhpcy5lbnRpdHlOYW1lfSAnLCBpdGVtICR7aSArXG4gICAgICAgICAgMX0sIGlzIG5vdCBhIHZhbGlkIGVudGl0eSBrZXkgKGlkKWA7XG4gICAgICAgIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIG1zZyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICAvKiogVGhyb3cgaWYgdGhlIGFjdGlvbiBwYXlsb2FkIGlzIG5vdCBhbiB1cGRhdGUgd2l0aCBhIHZhbGlkIGtleSAoaWQpICovXG4gIG11c3RCZVVwZGF0ZShhY3Rpb246IEVudGl0eUFjdGlvbjxVcGRhdGU8VD4+KTogVXBkYXRlPFQ+IHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGlmICghZGF0YSkge1xuICAgICAgcmV0dXJuIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIGBzaG91bGQgYmUgYSBzaW5nbGUgZW50aXR5IHVwZGF0ZWApO1xuICAgIH1cbiAgICBjb25zdCB7IGlkLCBjaGFuZ2VzIH0gPSBkYXRhO1xuICAgIGNvbnN0IGlkMiA9IHRoaXMuc2VsZWN0SWQoY2hhbmdlcyBhcyBUKTtcbiAgICBpZiAodGhpcy5pc05vdEtleVR5cGUoaWQpIHx8IHRoaXMuaXNOb3RLZXlUeXBlKGlkMikpIHtcbiAgICAgIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIGBoYXMgYSBtaXNzaW5nIG9yIGludmFsaWQgZW50aXR5IGtleSAoaWQpYCk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgLyoqIFRocm93IGlmIHRoZSBhY3Rpb24gcGF5bG9hZCBpcyBub3QgYW4gYXJyYXkgb2YgdXBkYXRlcyB3aXRoIHZhbGlkIGtleXMgKGlkcykgKi9cbiAgbXVzdEJlVXBkYXRlcyhhY3Rpb246IEVudGl0eUFjdGlvbjxVcGRhdGU8VD5bXT4pOiBVcGRhdGU8VD5bXSB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgc2hvdWxkIGJlIGFuIGFycmF5IG9mIGVudGl0eSB1cGRhdGVzYCk7XG4gICAgfVxuICAgIGRhdGEuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuICAgICAgY29uc3QgeyBpZCwgY2hhbmdlcyB9ID0gaXRlbTtcbiAgICAgIGNvbnN0IGlkMiA9IHRoaXMuc2VsZWN0SWQoY2hhbmdlcyBhcyBUKTtcbiAgICAgIGlmICh0aGlzLmlzTm90S2V5VHlwZShpZCkgfHwgdGhpcy5pc05vdEtleVR5cGUoaWQyKSkge1xuICAgICAgICB0aGlzLnRocm93RXJyb3IoXG4gICAgICAgICAgYWN0aW9uLFxuICAgICAgICAgIGAsIGl0ZW0gJHtpICsgMX0sIGhhcyBhIG1pc3Npbmcgb3IgaW52YWxpZCBlbnRpdHkga2V5IChpZClgXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICAvKiogVGhyb3cgaWYgdGhlIGFjdGlvbiBwYXlsb2FkIGlzIG5vdCBhbiB1cGRhdGUgcmVzcG9uc2Ugd2l0aCBhIHZhbGlkIGtleSAoaWQpICovXG4gIG11c3RCZVVwZGF0ZVJlc3BvbnNlKFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFVwZGF0ZVJlc3BvbnNlRGF0YTxUPj5cbiAgKTogVXBkYXRlUmVzcG9uc2VEYXRhPFQ+IHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGlmICghZGF0YSkge1xuICAgICAgcmV0dXJuIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIGBzaG91bGQgYmUgYSBzaW5nbGUgZW50aXR5IHVwZGF0ZWApO1xuICAgIH1cbiAgICBjb25zdCB7IGlkLCBjaGFuZ2VzIH0gPSBkYXRhO1xuICAgIGNvbnN0IGlkMiA9IHRoaXMuc2VsZWN0SWQoY2hhbmdlcyBhcyBUKTtcbiAgICBpZiAodGhpcy5pc05vdEtleVR5cGUoaWQpIHx8IHRoaXMuaXNOb3RLZXlUeXBlKGlkMikpIHtcbiAgICAgIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIGBoYXMgYSBtaXNzaW5nIG9yIGludmFsaWQgZW50aXR5IGtleSAoaWQpYCk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgLyoqIFRocm93IGlmIHRoZSBhY3Rpb24gcGF5bG9hZCBpcyBub3QgYW4gYXJyYXkgb2YgdXBkYXRlIHJlc3BvbnNlcyB3aXRoIHZhbGlkIGtleXMgKGlkcykgKi9cbiAgbXVzdEJlVXBkYXRlUmVzcG9uc2VzKFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFVwZGF0ZVJlc3BvbnNlRGF0YTxUPltdPlxuICApOiBVcGRhdGVSZXNwb25zZURhdGE8VD5bXSB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgc2hvdWxkIGJlIGFuIGFycmF5IG9mIGVudGl0eSB1cGRhdGVzYCk7XG4gICAgfVxuICAgIGRhdGEuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuICAgICAgY29uc3QgeyBpZCwgY2hhbmdlcyB9ID0gaXRlbTtcbiAgICAgIGNvbnN0IGlkMiA9IHRoaXMuc2VsZWN0SWQoY2hhbmdlcyBhcyBUKTtcbiAgICAgIGlmICh0aGlzLmlzTm90S2V5VHlwZShpZCkgfHwgdGhpcy5pc05vdEtleVR5cGUoaWQyKSkge1xuICAgICAgICB0aGlzLnRocm93RXJyb3IoXG4gICAgICAgICAgYWN0aW9uLFxuICAgICAgICAgIGAsIGl0ZW0gJHtpICsgMX0sIGhhcyBhIG1pc3Npbmcgb3IgaW52YWxpZCBlbnRpdHkga2V5IChpZClgXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBwcml2YXRlIGV4dHJhY3REYXRhPFQ+KGFjdGlvbjogRW50aXR5QWN0aW9uPFQ+KSB7XG4gICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkICYmIGFjdGlvbi5wYXlsb2FkLmRhdGE7XG4gIH1cblxuICAvKiogUmV0dXJuIHRydWUgaWYgdGhpcyBrZXkgKGlkKSBpcyBpbnZhbGlkICovXG4gIHByaXZhdGUgaXNOb3RLZXlUeXBlKGlkOiBhbnkpIHtcbiAgICByZXR1cm4gdHlwZW9mIGlkICE9PSAnc3RyaW5nJyAmJiB0eXBlb2YgaWQgIT09ICdudW1iZXInO1xuICB9XG5cbiAgcHJpdmF0ZSB0aHJvd0Vycm9yKGFjdGlvbjogRW50aXR5QWN0aW9uLCBtc2c6IHN0cmluZyk6IG5ldmVyIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgJHt0aGlzLmVudGl0eU5hbWV9IEVudGl0eUFjdGlvbiBndWFyZCBmb3IgXCIke1xuICAgICAgICBhY3Rpb24udHlwZVxuICAgICAgfVwiOiBwYXlsb2FkICR7bXNnfWBcbiAgICApO1xuICB9XG59XG4iXX0=