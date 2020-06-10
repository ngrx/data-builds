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
                var msg = _this.entityName + " ', item " + (i + 1) + ", is not a valid entity key (id)";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWFjdGlvbi1ndWFyZC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3J4L2RhdGEvIiwic291cmNlcyI6WyJzcmMvYWN0aW9ucy9lbnRpdHktYWN0aW9uLWd1YXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7SUFDRSwyQkFBb0IsVUFBa0IsRUFBVSxRQUF1QjtRQUFuRCxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBZTtJQUFHLENBQUM7SUFFM0Usb0VBQW9FOzs7Ozs7SUFDcEUsd0NBQVk7Ozs7O0lBQVosVUFBYSxNQUF1Qjs7WUFDNUIsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDVCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLDhCQUE4QixDQUFDLENBQUM7U0FDaEU7O1lBQ0ssRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQzlCLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUN6QixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSwwQ0FBMEMsQ0FBQyxDQUFDO1NBQ3JFO1FBQ0QsT0FBTyxtQkFBQSxJQUFJLEVBQUssQ0FBQztJQUNuQixDQUFDO0lBRUQsOEVBQThFOzs7Ozs7SUFDOUUsMENBQWM7Ozs7O0lBQWQsVUFBZSxNQUF5QjtRQUF4QyxpQkFhQzs7WUFaTyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDeEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO1NBQ2xFO1FBQ0QsSUFBSSxDQUFDLE9BQU87Ozs7O1FBQUMsVUFBQyxNQUFN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QztTQUN4RTtRQUNELElBQUksQ0FBQyxPQUFPOzs7OztRQUFDLFVBQUMsSUFBSSxFQUFFLENBQUM7WUFDWCxJQUFBLFlBQUUsRUFBRSxzQkFBTzs7Z0JBQ2IsR0FBRyxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsbUJBQUEsT0FBTyxFQUFLLENBQUM7WUFDdkMsSUFBSSxLQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ25ELEtBQUksQ0FBQyxVQUFVLENBQ2IsTUFBTSxFQUNOLGFBQVUsQ0FBQyxHQUFHLENBQUMsZ0RBQTRDLENBQzVELENBQUM7YUFDSDtRQUNILENBQUMsRUFBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDOzs7Ozs7O0lBRU8sdUNBQVc7Ozs7OztJQUFuQixVQUF1QixNQUF1QjtRQUM1QyxPQUFPLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDL0MsQ0FBQztJQUVELDhDQUE4Qzs7Ozs7OztJQUN0Qyx3Q0FBWTs7Ozs7O0lBQXBCLFVBQXFCLEVBQU87UUFDMUIsT0FBTyxPQUFPLEVBQUUsS0FBSyxRQUFRLElBQUksT0FBTyxFQUFFLEtBQUssUUFBUSxDQUFDO0lBQzFELENBQUM7Ozs7Ozs7SUFFTyxzQ0FBVTs7Ozs7O0lBQWxCLFVBQW1CLE1BQW9CLEVBQUUsR0FBVztRQUNsRCxNQUFNLElBQUksS0FBSyxDQUNWLElBQUksQ0FBQyxVQUFVLGtDQUE0QixNQUFNLENBQUMsSUFBSSxvQkFBYyxHQUFLLENBQzdFLENBQUM7SUFDSixDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBakpELElBaUpDOzs7Ozs7Ozs7Ozs7O0lBaEphLHVDQUEwQjs7Ozs7SUFBRSxxQ0FBK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJZFNlbGVjdG9yLCBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgVXBkYXRlUmVzcG9uc2VEYXRhIH0gZnJvbSAnLi4vYWN0aW9ucy91cGRhdGUtcmVzcG9uc2UtZGF0YSc7XG5cbi8qKlxuICogR3VhcmQgbWV0aG9kcyB0aGF0IGVuc3VyZSBFbnRpdHlBY3Rpb24gcGF5bG9hZCBpcyBhcyBleHBlY3RlZC5cbiAqIEVhY2ggbWV0aG9kIHJldHVybnMgdGhhdCBwYXlsb2FkIGlmIGl0IHBhc3NlcyB0aGUgZ3VhcmQgb3JcbiAqIHRocm93cyBhbiBlcnJvci5cbiAqL1xuZXhwb3J0IGNsYXNzIEVudGl0eUFjdGlvbkd1YXJkPFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbnRpdHlOYW1lOiBzdHJpbmcsIHByaXZhdGUgc2VsZWN0SWQ6IElkU2VsZWN0b3I8VD4pIHt9XG5cbiAgLyoqIFRocm93IGlmIHRoZSBhY3Rpb24gcGF5bG9hZCBpcyBub3QgYW4gZW50aXR5IHdpdGggYSB2YWxpZCBrZXkgKi9cbiAgbXVzdEJlRW50aXR5KGFjdGlvbjogRW50aXR5QWN0aW9uPFQ+KTogVCB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHJldHVybiB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgc2hvdWxkIGhhdmUgYSBzaW5nbGUgZW50aXR5LmApO1xuICAgIH1cbiAgICBjb25zdCBpZCA9IHRoaXMuc2VsZWN0SWQoZGF0YSk7XG4gICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGlkKSkge1xuICAgICAgdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgYGhhcyBhIG1pc3Npbmcgb3IgaW52YWxpZCBlbnRpdHkga2V5IChpZClgKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGEgYXMgVDtcbiAgfVxuXG4gIC8qKiBUaHJvdyBpZiB0aGUgYWN0aW9uIHBheWxvYWQgaXMgbm90IGFuIGFycmF5IG9mIGVudGl0aWVzIHdpdGggdmFsaWQga2V5cyAqL1xuICBtdXN0QmVFbnRpdGllcyhhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+KTogVFtdIHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgcmV0dXJuIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIGBzaG91bGQgYmUgYW4gYXJyYXkgb2YgZW50aXRpZXNgKTtcbiAgICB9XG4gICAgZGF0YS5mb3JFYWNoKChlbnRpdHksIGkpID0+IHtcbiAgICAgIGNvbnN0IGlkID0gdGhpcy5zZWxlY3RJZChlbnRpdHkpO1xuICAgICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGlkKSkge1xuICAgICAgICBjb25zdCBtc2cgPSBgLCBpdGVtICR7aSArIDF9LCBkb2VzIG5vdCBoYXZlIGEgdmFsaWQgZW50aXR5IGtleSAoaWQpYDtcbiAgICAgICAgdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgbXNnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIC8qKiBUaHJvdyBpZiB0aGUgYWN0aW9uIHBheWxvYWQgaXMgbm90IGEgc2luZ2xlLCB2YWxpZCBrZXkgKi9cbiAgbXVzdEJlS2V5KGFjdGlvbjogRW50aXR5QWN0aW9uPHN0cmluZyB8IG51bWJlcj4pOiBzdHJpbmcgfCBudW1iZXIgfCBuZXZlciB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgc2hvdWxkIGJlIGEgc2luZ2xlIGVudGl0eSBrZXlgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGRhdGEpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGlzIG5vdCBhIHZhbGlkIGtleSAoaWQpYCk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgLyoqIFRocm93IGlmIHRoZSBhY3Rpb24gcGF5bG9hZCBpcyBub3QgYW4gYXJyYXkgb2YgdmFsaWQga2V5cyAqL1xuICBtdXN0QmVLZXlzKGFjdGlvbjogRW50aXR5QWN0aW9uPChzdHJpbmcgfCBudW1iZXIpW10+KTogKHN0cmluZyB8IG51bWJlcilbXSB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgc2hvdWxkIGJlIGFuIGFycmF5IG9mIGVudGl0eSBrZXlzIChpZClgKTtcbiAgICB9XG4gICAgZGF0YS5mb3JFYWNoKChpZCwgaSkgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGlkKSkge1xuICAgICAgICBjb25zdCBtc2cgPSBgJHt0aGlzLmVudGl0eU5hbWV9ICcsIGl0ZW0gJHtcbiAgICAgICAgICBpICsgMVxuICAgICAgICB9LCBpcyBub3QgYSB2YWxpZCBlbnRpdHkga2V5IChpZClgO1xuICAgICAgICB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBtc2cpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgLyoqIFRocm93IGlmIHRoZSBhY3Rpb24gcGF5bG9hZCBpcyBub3QgYW4gdXBkYXRlIHdpdGggYSB2YWxpZCBrZXkgKGlkKSAqL1xuICBtdXN0QmVVcGRhdGUoYWN0aW9uOiBFbnRpdHlBY3Rpb248VXBkYXRlPFQ+Pik6IFVwZGF0ZTxUPiB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHJldHVybiB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgc2hvdWxkIGJlIGEgc2luZ2xlIGVudGl0eSB1cGRhdGVgKTtcbiAgICB9XG4gICAgY29uc3QgeyBpZCwgY2hhbmdlcyB9ID0gZGF0YTtcbiAgICBjb25zdCBpZDIgPSB0aGlzLnNlbGVjdElkKGNoYW5nZXMgYXMgVCk7XG4gICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGlkKSB8fCB0aGlzLmlzTm90S2V5VHlwZShpZDIpKSB7XG4gICAgICB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgaGFzIGEgbWlzc2luZyBvciBpbnZhbGlkIGVudGl0eSBrZXkgKGlkKWApO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIC8qKiBUaHJvdyBpZiB0aGUgYWN0aW9uIHBheWxvYWQgaXMgbm90IGFuIGFycmF5IG9mIHVwZGF0ZXMgd2l0aCB2YWxpZCBrZXlzIChpZHMpICovXG4gIG11c3RCZVVwZGF0ZXMoYWN0aW9uOiBFbnRpdHlBY3Rpb248VXBkYXRlPFQ+W10+KTogVXBkYXRlPFQ+W10ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICByZXR1cm4gdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgYHNob3VsZCBiZSBhbiBhcnJheSBvZiBlbnRpdHkgdXBkYXRlc2ApO1xuICAgIH1cbiAgICBkYXRhLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcbiAgICAgIGNvbnN0IHsgaWQsIGNoYW5nZXMgfSA9IGl0ZW07XG4gICAgICBjb25zdCBpZDIgPSB0aGlzLnNlbGVjdElkKGNoYW5nZXMgYXMgVCk7XG4gICAgICBpZiAodGhpcy5pc05vdEtleVR5cGUoaWQpIHx8IHRoaXMuaXNOb3RLZXlUeXBlKGlkMikpIHtcbiAgICAgICAgdGhpcy50aHJvd0Vycm9yKFxuICAgICAgICAgIGFjdGlvbixcbiAgICAgICAgICBgLCBpdGVtICR7aSArIDF9LCBoYXMgYSBtaXNzaW5nIG9yIGludmFsaWQgZW50aXR5IGtleSAoaWQpYFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgLyoqIFRocm93IGlmIHRoZSBhY3Rpb24gcGF5bG9hZCBpcyBub3QgYW4gdXBkYXRlIHJlc3BvbnNlIHdpdGggYSB2YWxpZCBrZXkgKGlkKSAqL1xuICBtdXN0QmVVcGRhdGVSZXNwb25zZShcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxVcGRhdGVSZXNwb25zZURhdGE8VD4+XG4gICk6IFVwZGF0ZVJlc3BvbnNlRGF0YTxUPiB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHJldHVybiB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgc2hvdWxkIGJlIGEgc2luZ2xlIGVudGl0eSB1cGRhdGVgKTtcbiAgICB9XG4gICAgY29uc3QgeyBpZCwgY2hhbmdlcyB9ID0gZGF0YTtcbiAgICBjb25zdCBpZDIgPSB0aGlzLnNlbGVjdElkKGNoYW5nZXMgYXMgVCk7XG4gICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGlkKSB8fCB0aGlzLmlzTm90S2V5VHlwZShpZDIpKSB7XG4gICAgICB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgaGFzIGEgbWlzc2luZyBvciBpbnZhbGlkIGVudGl0eSBrZXkgKGlkKWApO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIC8qKiBUaHJvdyBpZiB0aGUgYWN0aW9uIHBheWxvYWQgaXMgbm90IGFuIGFycmF5IG9mIHVwZGF0ZSByZXNwb25zZXMgd2l0aCB2YWxpZCBrZXlzIChpZHMpICovXG4gIG11c3RCZVVwZGF0ZVJlc3BvbnNlcyhcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxVcGRhdGVSZXNwb25zZURhdGE8VD5bXT5cbiAgKTogVXBkYXRlUmVzcG9uc2VEYXRhPFQ+W10ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICByZXR1cm4gdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgYHNob3VsZCBiZSBhbiBhcnJheSBvZiBlbnRpdHkgdXBkYXRlc2ApO1xuICAgIH1cbiAgICBkYXRhLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcbiAgICAgIGNvbnN0IHsgaWQsIGNoYW5nZXMgfSA9IGl0ZW07XG4gICAgICBjb25zdCBpZDIgPSB0aGlzLnNlbGVjdElkKGNoYW5nZXMgYXMgVCk7XG4gICAgICBpZiAodGhpcy5pc05vdEtleVR5cGUoaWQpIHx8IHRoaXMuaXNOb3RLZXlUeXBlKGlkMikpIHtcbiAgICAgICAgdGhpcy50aHJvd0Vycm9yKFxuICAgICAgICAgIGFjdGlvbixcbiAgICAgICAgICBgLCBpdGVtICR7aSArIDF9LCBoYXMgYSBtaXNzaW5nIG9yIGludmFsaWQgZW50aXR5IGtleSAoaWQpYFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgcHJpdmF0ZSBleHRyYWN0RGF0YTxUPihhY3Rpb246IEVudGl0eUFjdGlvbjxUPikge1xuICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCAmJiBhY3Rpb24ucGF5bG9hZC5kYXRhO1xuICB9XG5cbiAgLyoqIFJldHVybiB0cnVlIGlmIHRoaXMga2V5IChpZCkgaXMgaW52YWxpZCAqL1xuICBwcml2YXRlIGlzTm90S2V5VHlwZShpZDogYW55KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBpZCAhPT0gJ3N0cmluZycgJiYgdHlwZW9mIGlkICE9PSAnbnVtYmVyJztcbiAgfVxuXG4gIHByaXZhdGUgdGhyb3dFcnJvcihhY3Rpb246IEVudGl0eUFjdGlvbiwgbXNnOiBzdHJpbmcpOiBuZXZlciB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYCR7dGhpcy5lbnRpdHlOYW1lfSBFbnRpdHlBY3Rpb24gZ3VhcmQgZm9yIFwiJHthY3Rpb24udHlwZX1cIjogcGF5bG9hZCAke21zZ31gXG4gICAgKTtcbiAgfVxufVxuIl19