/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/actions/entity-action-guard.ts
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWFjdGlvbi1ndWFyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvYWN0aW9ucy9lbnRpdHktYWN0aW9uLWd1YXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBVUEsTUFBTSxPQUFPLGlCQUFpQjs7Ozs7SUFDNUIsWUFBb0IsVUFBa0IsRUFBVSxRQUF1QjtRQUFuRCxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBZTtJQUFHLENBQUM7Ozs7OztJQUczRSxZQUFZLENBQUMsTUFBdUI7O2NBQzVCLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztRQUNyQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1QsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO1NBQ2hFOztjQUNLLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUM5QixJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDekIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsMENBQTBDLENBQUMsQ0FBQztTQUNyRTtRQUNELE9BQU8sbUJBQUEsSUFBSSxFQUFLLENBQUM7SUFDbkIsQ0FBQzs7Ozs7O0lBR0QsY0FBYyxDQUFDLE1BQXlCOztjQUNoQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDeEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO1NBQ2xFO1FBQ0QsSUFBSSxDQUFDLE9BQU87Ozs7O1FBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O2tC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QUN0QixHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBQSxPQUFPLEVBQUssQ0FBQztZQUN2QyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDbkQsSUFBSSxDQUFDLFVBQVUsQ0FDYixNQUFNLEVBQ04sVUFBVSxDQUFDLEdBQUcsQ0FBQyw0Q0FBNEMsQ0FDNUQsQ0FBQzthQUNIO1FBQ0gsQ0FBQyxFQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Ozs7Ozs7SUFFTyxXQUFXLENBQUksTUFBdUI7UUFDNUMsT0FBTyxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQy9DLENBQUM7Ozs7Ozs7SUFHTyxZQUFZLENBQUMsRUFBTztRQUMxQixPQUFPLE9BQU8sRUFBRSxLQUFLLFFBQVEsSUFBSSxPQUFPLEVBQUUsS0FBSyxRQUFRLENBQUM7SUFDMUQsQ0FBQzs7Ozs7OztJQUVPLFVBQVUsQ0FBQyxNQUFvQixFQUFFLEdBQVc7UUFDbEQsTUFBTSxJQUFJLEtBQUssQ0FDYixHQUFHLElBQUksQ0FBQyxVQUFVLDRCQUNoQixNQUFNLENBQUMsSUFDVCxjQUFjLEdBQUcsRUFBRSxDQUNwQixDQUFDO0lBQ0osQ0FBQztDQUNGOzs7Ozs7SUFqSmEsdUNBQTBCOzs7OztJQUFFLHFDQUErQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElkU2VsZWN0b3IsIFVwZGF0ZSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4vZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBVcGRhdGVSZXNwb25zZURhdGEgfSBmcm9tICcuLi9hY3Rpb25zL3VwZGF0ZS1yZXNwb25zZS1kYXRhJztcblxuLyoqXG4gKiBHdWFyZCBtZXRob2RzIHRoYXQgZW5zdXJlIEVudGl0eUFjdGlvbiBwYXlsb2FkIGlzIGFzIGV4cGVjdGVkLlxuICogRWFjaCBtZXRob2QgcmV0dXJucyB0aGF0IHBheWxvYWQgaWYgaXQgcGFzc2VzIHRoZSBndWFyZCBvclxuICogdGhyb3dzIGFuIGVycm9yLlxuICovXG5leHBvcnQgY2xhc3MgRW50aXR5QWN0aW9uR3VhcmQ8VD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVudGl0eU5hbWU6IHN0cmluZywgcHJpdmF0ZSBzZWxlY3RJZDogSWRTZWxlY3RvcjxUPikge31cblxuICAvKiogVGhyb3cgaWYgdGhlIGFjdGlvbiBwYXlsb2FkIGlzIG5vdCBhbiBlbnRpdHkgd2l0aCBhIHZhbGlkIGtleSAqL1xuICBtdXN0QmVFbnRpdHkoYWN0aW9uOiBFbnRpdHlBY3Rpb248VD4pOiBUIHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGlmICghZGF0YSkge1xuICAgICAgcmV0dXJuIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIGBzaG91bGQgaGF2ZSBhIHNpbmdsZSBlbnRpdHkuYCk7XG4gICAgfVxuICAgIGNvbnN0IGlkID0gdGhpcy5zZWxlY3RJZChkYXRhKTtcbiAgICBpZiAodGhpcy5pc05vdEtleVR5cGUoaWQpKSB7XG4gICAgICB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgaGFzIGEgbWlzc2luZyBvciBpbnZhbGlkIGVudGl0eSBrZXkgKGlkKWApO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YSBhcyBUO1xuICB9XG5cbiAgLyoqIFRocm93IGlmIHRoZSBhY3Rpb24gcGF5bG9hZCBpcyBub3QgYW4gYXJyYXkgb2YgZW50aXRpZXMgd2l0aCB2YWxpZCBrZXlzICovXG4gIG11c3RCZUVudGl0aWVzKGFjdGlvbjogRW50aXR5QWN0aW9uPFRbXT4pOiBUW10ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICByZXR1cm4gdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgYHNob3VsZCBiZSBhbiBhcnJheSBvZiBlbnRpdGllc2ApO1xuICAgIH1cbiAgICBkYXRhLmZvckVhY2goKGVudGl0eSwgaSkgPT4ge1xuICAgICAgY29uc3QgaWQgPSB0aGlzLnNlbGVjdElkKGVudGl0eSk7XG4gICAgICBpZiAodGhpcy5pc05vdEtleVR5cGUoaWQpKSB7XG4gICAgICAgIGNvbnN0IG1zZyA9IGAsIGl0ZW0gJHtpICsgMX0sIGRvZXMgbm90IGhhdmUgYSB2YWxpZCBlbnRpdHkga2V5IChpZClgO1xuICAgICAgICB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBtc2cpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgLyoqIFRocm93IGlmIHRoZSBhY3Rpb24gcGF5bG9hZCBpcyBub3QgYSBzaW5nbGUsIHZhbGlkIGtleSAqL1xuICBtdXN0QmVLZXkoYWN0aW9uOiBFbnRpdHlBY3Rpb248c3RyaW5nIHwgbnVtYmVyPik6IHN0cmluZyB8IG51bWJlciB8IG5ldmVyIHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGlmICghZGF0YSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBzaG91bGQgYmUgYSBzaW5nbGUgZW50aXR5IGtleWApO1xuICAgIH1cbiAgICBpZiAodGhpcy5pc05vdEtleVR5cGUoZGF0YSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgaXMgbm90IGEgdmFsaWQga2V5IChpZClgKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICAvKiogVGhyb3cgaWYgdGhlIGFjdGlvbiBwYXlsb2FkIGlzIG5vdCBhbiBhcnJheSBvZiB2YWxpZCBrZXlzICovXG4gIG11c3RCZUtleXMoYWN0aW9uOiBFbnRpdHlBY3Rpb248KHN0cmluZyB8IG51bWJlcilbXT4pOiAoc3RyaW5nIHwgbnVtYmVyKVtdIHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgcmV0dXJuIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIGBzaG91bGQgYmUgYW4gYXJyYXkgb2YgZW50aXR5IGtleXMgKGlkKWApO1xuICAgIH1cbiAgICBkYXRhLmZvckVhY2goKGlkLCBpKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc05vdEtleVR5cGUoaWQpKSB7XG4gICAgICAgIGNvbnN0IG1zZyA9IGAke3RoaXMuZW50aXR5TmFtZX0gJywgaXRlbSAke2kgK1xuICAgICAgICAgIDF9LCBpcyBub3QgYSB2YWxpZCBlbnRpdHkga2V5IChpZClgO1xuICAgICAgICB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBtc2cpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgLyoqIFRocm93IGlmIHRoZSBhY3Rpb24gcGF5bG9hZCBpcyBub3QgYW4gdXBkYXRlIHdpdGggYSB2YWxpZCBrZXkgKGlkKSAqL1xuICBtdXN0QmVVcGRhdGUoYWN0aW9uOiBFbnRpdHlBY3Rpb248VXBkYXRlPFQ+Pik6IFVwZGF0ZTxUPiB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHJldHVybiB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgc2hvdWxkIGJlIGEgc2luZ2xlIGVudGl0eSB1cGRhdGVgKTtcbiAgICB9XG4gICAgY29uc3QgeyBpZCwgY2hhbmdlcyB9ID0gZGF0YTtcbiAgICBjb25zdCBpZDIgPSB0aGlzLnNlbGVjdElkKGNoYW5nZXMgYXMgVCk7XG4gICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGlkKSB8fCB0aGlzLmlzTm90S2V5VHlwZShpZDIpKSB7XG4gICAgICB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgaGFzIGEgbWlzc2luZyBvciBpbnZhbGlkIGVudGl0eSBrZXkgKGlkKWApO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIC8qKiBUaHJvdyBpZiB0aGUgYWN0aW9uIHBheWxvYWQgaXMgbm90IGFuIGFycmF5IG9mIHVwZGF0ZXMgd2l0aCB2YWxpZCBrZXlzIChpZHMpICovXG4gIG11c3RCZVVwZGF0ZXMoYWN0aW9uOiBFbnRpdHlBY3Rpb248VXBkYXRlPFQ+W10+KTogVXBkYXRlPFQ+W10ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICByZXR1cm4gdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgYHNob3VsZCBiZSBhbiBhcnJheSBvZiBlbnRpdHkgdXBkYXRlc2ApO1xuICAgIH1cbiAgICBkYXRhLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcbiAgICAgIGNvbnN0IHsgaWQsIGNoYW5nZXMgfSA9IGl0ZW07XG4gICAgICBjb25zdCBpZDIgPSB0aGlzLnNlbGVjdElkKGNoYW5nZXMgYXMgVCk7XG4gICAgICBpZiAodGhpcy5pc05vdEtleVR5cGUoaWQpIHx8IHRoaXMuaXNOb3RLZXlUeXBlKGlkMikpIHtcbiAgICAgICAgdGhpcy50aHJvd0Vycm9yKFxuICAgICAgICAgIGFjdGlvbixcbiAgICAgICAgICBgLCBpdGVtICR7aSArIDF9LCBoYXMgYSBtaXNzaW5nIG9yIGludmFsaWQgZW50aXR5IGtleSAoaWQpYFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgLyoqIFRocm93IGlmIHRoZSBhY3Rpb24gcGF5bG9hZCBpcyBub3QgYW4gdXBkYXRlIHJlc3BvbnNlIHdpdGggYSB2YWxpZCBrZXkgKGlkKSAqL1xuICBtdXN0QmVVcGRhdGVSZXNwb25zZShcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxVcGRhdGVSZXNwb25zZURhdGE8VD4+XG4gICk6IFVwZGF0ZVJlc3BvbnNlRGF0YTxUPiB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHJldHVybiB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgc2hvdWxkIGJlIGEgc2luZ2xlIGVudGl0eSB1cGRhdGVgKTtcbiAgICB9XG4gICAgY29uc3QgeyBpZCwgY2hhbmdlcyB9ID0gZGF0YTtcbiAgICBjb25zdCBpZDIgPSB0aGlzLnNlbGVjdElkKGNoYW5nZXMgYXMgVCk7XG4gICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGlkKSB8fCB0aGlzLmlzTm90S2V5VHlwZShpZDIpKSB7XG4gICAgICB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgaGFzIGEgbWlzc2luZyBvciBpbnZhbGlkIGVudGl0eSBrZXkgKGlkKWApO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIC8qKiBUaHJvdyBpZiB0aGUgYWN0aW9uIHBheWxvYWQgaXMgbm90IGFuIGFycmF5IG9mIHVwZGF0ZSByZXNwb25zZXMgd2l0aCB2YWxpZCBrZXlzIChpZHMpICovXG4gIG11c3RCZVVwZGF0ZVJlc3BvbnNlcyhcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxVcGRhdGVSZXNwb25zZURhdGE8VD5bXT5cbiAgKTogVXBkYXRlUmVzcG9uc2VEYXRhPFQ+W10ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICByZXR1cm4gdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgYHNob3VsZCBiZSBhbiBhcnJheSBvZiBlbnRpdHkgdXBkYXRlc2ApO1xuICAgIH1cbiAgICBkYXRhLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcbiAgICAgIGNvbnN0IHsgaWQsIGNoYW5nZXMgfSA9IGl0ZW07XG4gICAgICBjb25zdCBpZDIgPSB0aGlzLnNlbGVjdElkKGNoYW5nZXMgYXMgVCk7XG4gICAgICBpZiAodGhpcy5pc05vdEtleVR5cGUoaWQpIHx8IHRoaXMuaXNOb3RLZXlUeXBlKGlkMikpIHtcbiAgICAgICAgdGhpcy50aHJvd0Vycm9yKFxuICAgICAgICAgIGFjdGlvbixcbiAgICAgICAgICBgLCBpdGVtICR7aSArIDF9LCBoYXMgYSBtaXNzaW5nIG9yIGludmFsaWQgZW50aXR5IGtleSAoaWQpYFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgcHJpdmF0ZSBleHRyYWN0RGF0YTxUPihhY3Rpb246IEVudGl0eUFjdGlvbjxUPikge1xuICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCAmJiBhY3Rpb24ucGF5bG9hZC5kYXRhO1xuICB9XG5cbiAgLyoqIFJldHVybiB0cnVlIGlmIHRoaXMga2V5IChpZCkgaXMgaW52YWxpZCAqL1xuICBwcml2YXRlIGlzTm90S2V5VHlwZShpZDogYW55KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBpZCAhPT0gJ3N0cmluZycgJiYgdHlwZW9mIGlkICE9PSAnbnVtYmVyJztcbiAgfVxuXG4gIHByaXZhdGUgdGhyb3dFcnJvcihhY3Rpb246IEVudGl0eUFjdGlvbiwgbXNnOiBzdHJpbmcpOiBuZXZlciB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYCR7dGhpcy5lbnRpdHlOYW1lfSBFbnRpdHlBY3Rpb24gZ3VhcmQgZm9yIFwiJHtcbiAgICAgICAgYWN0aW9uLnR5cGVcbiAgICAgIH1cIjogcGF5bG9hZCAke21zZ31gXG4gICAgKTtcbiAgfVxufVxuIl19