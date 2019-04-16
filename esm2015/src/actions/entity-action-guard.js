/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWFjdGlvbi1ndWFyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvYWN0aW9ucy9lbnRpdHktYWN0aW9uLWd1YXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFVQSxNQUFNLE9BQU8saUJBQWlCOzs7OztJQUM1QixZQUFvQixVQUFrQixFQUFVLFFBQXVCO1FBQW5ELGVBQVUsR0FBVixVQUFVLENBQVE7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFlO0lBQUcsQ0FBQzs7Ozs7O0lBRzNFLFlBQVksQ0FBQyxNQUF1Qjs7Y0FDNUIsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDVCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLDhCQUE4QixDQUFDLENBQUM7U0FDaEU7O2NBQ0ssRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQzlCLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUN6QixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSwwQ0FBMEMsQ0FBQyxDQUFDO1NBQ3JFO1FBQ0QsT0FBTyxtQkFBQSxJQUFJLEVBQUssQ0FBQztJQUNuQixDQUFDOzs7Ozs7SUFHRCxjQUFjLENBQUMsTUFBeUI7O2NBQ2hDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztRQUNyQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN4QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLGdDQUFnQyxDQUFDLENBQUM7U0FDbEU7UUFDRCxJQUFJLENBQUMsT0FBTzs7Ozs7UUFBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs7a0JB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Q3RCLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFBLE9BQU8sRUFBSyxDQUFDO1lBQ3ZDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNuRCxJQUFJLENBQUMsVUFBVSxDQUNiLE1BQU0sRUFDTixVQUFVLENBQUMsR0FBRyxDQUFDLDRDQUE0QyxDQUM1RCxDQUFDO2FBQ0g7UUFDSCxDQUFDLEVBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQzs7Ozs7OztJQUVPLFdBQVcsQ0FBSSxNQUF1QjtRQUM1QyxPQUFPLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDL0MsQ0FBQzs7Ozs7OztJQUdPLFlBQVksQ0FBQyxFQUFPO1FBQzFCLE9BQU8sT0FBTyxFQUFFLEtBQUssUUFBUSxJQUFJLE9BQU8sRUFBRSxLQUFLLFFBQVEsQ0FBQztJQUMxRCxDQUFDOzs7Ozs7O0lBRU8sVUFBVSxDQUFDLE1BQW9CLEVBQUUsR0FBVztRQUNsRCxNQUFNLElBQUksS0FBSyxDQUNiLEdBQUcsSUFBSSxDQUFDLFVBQVUsNEJBQ2hCLE1BQU0sQ0FBQyxJQUNULGNBQWMsR0FBRyxFQUFFLENBQ3BCLENBQUM7SUFDSixDQUFDO0NBQ0Y7Ozs7OztJQWpKYSx1Q0FBMEI7Ozs7O0lBQUUscUNBQStCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSWRTZWxlY3RvciwgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IFVwZGF0ZVJlc3BvbnNlRGF0YSB9IGZyb20gJy4uL2FjdGlvbnMvdXBkYXRlLXJlc3BvbnNlLWRhdGEnO1xuXG4vKipcbiAqIEd1YXJkIG1ldGhvZHMgdGhhdCBlbnN1cmUgRW50aXR5QWN0aW9uIHBheWxvYWQgaXMgYXMgZXhwZWN0ZWQuXG4gKiBFYWNoIG1ldGhvZCByZXR1cm5zIHRoYXQgcGF5bG9hZCBpZiBpdCBwYXNzZXMgdGhlIGd1YXJkIG9yXG4gKiB0aHJvd3MgYW4gZXJyb3IuXG4gKi9cbmV4cG9ydCBjbGFzcyBFbnRpdHlBY3Rpb25HdWFyZDxUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZW50aXR5TmFtZTogc3RyaW5nLCBwcml2YXRlIHNlbGVjdElkOiBJZFNlbGVjdG9yPFQ+KSB7fVxuXG4gIC8qKiBUaHJvdyBpZiB0aGUgYWN0aW9uIHBheWxvYWQgaXMgbm90IGFuIGVudGl0eSB3aXRoIGEgdmFsaWQga2V5ICovXG4gIG11c3RCZUVudGl0eShhY3Rpb246IEVudGl0eUFjdGlvbjxUPik6IFQge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgYHNob3VsZCBoYXZlIGEgc2luZ2xlIGVudGl0eS5gKTtcbiAgICB9XG4gICAgY29uc3QgaWQgPSB0aGlzLnNlbGVjdElkKGRhdGEpO1xuICAgIGlmICh0aGlzLmlzTm90S2V5VHlwZShpZCkpIHtcbiAgICAgIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIGBoYXMgYSBtaXNzaW5nIG9yIGludmFsaWQgZW50aXR5IGtleSAoaWQpYCk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhIGFzIFQ7XG4gIH1cblxuICAvKiogVGhyb3cgaWYgdGhlIGFjdGlvbiBwYXlsb2FkIGlzIG5vdCBhbiBhcnJheSBvZiBlbnRpdGllcyB3aXRoIHZhbGlkIGtleXMgKi9cbiAgbXVzdEJlRW50aXRpZXMoYWN0aW9uOiBFbnRpdHlBY3Rpb248VFtdPik6IFRbXSB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgc2hvdWxkIGJlIGFuIGFycmF5IG9mIGVudGl0aWVzYCk7XG4gICAgfVxuICAgIGRhdGEuZm9yRWFjaCgoZW50aXR5LCBpKSA9PiB7XG4gICAgICBjb25zdCBpZCA9IHRoaXMuc2VsZWN0SWQoZW50aXR5KTtcbiAgICAgIGlmICh0aGlzLmlzTm90S2V5VHlwZShpZCkpIHtcbiAgICAgICAgY29uc3QgbXNnID0gYCwgaXRlbSAke2kgKyAxfSwgZG9lcyBub3QgaGF2ZSBhIHZhbGlkIGVudGl0eSBrZXkgKGlkKWA7XG4gICAgICAgIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIG1zZyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICAvKiogVGhyb3cgaWYgdGhlIGFjdGlvbiBwYXlsb2FkIGlzIG5vdCBhIHNpbmdsZSwgdmFsaWQga2V5ICovXG4gIG11c3RCZUtleShhY3Rpb246IEVudGl0eUFjdGlvbjxzdHJpbmcgfCBudW1iZXI+KTogc3RyaW5nIHwgbnVtYmVyIHwgbmV2ZXIge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHNob3VsZCBiZSBhIHNpbmdsZSBlbnRpdHkga2V5YCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmlzTm90S2V5VHlwZShkYXRhKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBpcyBub3QgYSB2YWxpZCBrZXkgKGlkKWApO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIC8qKiBUaHJvdyBpZiB0aGUgYWN0aW9uIHBheWxvYWQgaXMgbm90IGFuIGFycmF5IG9mIHZhbGlkIGtleXMgKi9cbiAgbXVzdEJlS2V5cyhhY3Rpb246IEVudGl0eUFjdGlvbjwoc3RyaW5nIHwgbnVtYmVyKVtdPik6IChzdHJpbmcgfCBudW1iZXIpW10ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICByZXR1cm4gdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgYHNob3VsZCBiZSBhbiBhcnJheSBvZiBlbnRpdHkga2V5cyAoaWQpYCk7XG4gICAgfVxuICAgIGRhdGEuZm9yRWFjaCgoaWQsIGkpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzTm90S2V5VHlwZShpZCkpIHtcbiAgICAgICAgY29uc3QgbXNnID0gYCR7dGhpcy5lbnRpdHlOYW1lfSAnLCBpdGVtICR7aSArXG4gICAgICAgICAgMX0sIGlzIG5vdCBhIHZhbGlkIGVudGl0eSBrZXkgKGlkKWA7XG4gICAgICAgIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIG1zZyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICAvKiogVGhyb3cgaWYgdGhlIGFjdGlvbiBwYXlsb2FkIGlzIG5vdCBhbiB1cGRhdGUgd2l0aCBhIHZhbGlkIGtleSAoaWQpICovXG4gIG11c3RCZVVwZGF0ZShhY3Rpb246IEVudGl0eUFjdGlvbjxVcGRhdGU8VD4+KTogVXBkYXRlPFQ+IHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGlmICghZGF0YSkge1xuICAgICAgcmV0dXJuIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIGBzaG91bGQgYmUgYSBzaW5nbGUgZW50aXR5IHVwZGF0ZWApO1xuICAgIH1cbiAgICBjb25zdCB7IGlkLCBjaGFuZ2VzIH0gPSBkYXRhO1xuICAgIGNvbnN0IGlkMiA9IHRoaXMuc2VsZWN0SWQoY2hhbmdlcyBhcyBUKTtcbiAgICBpZiAodGhpcy5pc05vdEtleVR5cGUoaWQpIHx8IHRoaXMuaXNOb3RLZXlUeXBlKGlkMikpIHtcbiAgICAgIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIGBoYXMgYSBtaXNzaW5nIG9yIGludmFsaWQgZW50aXR5IGtleSAoaWQpYCk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgLyoqIFRocm93IGlmIHRoZSBhY3Rpb24gcGF5bG9hZCBpcyBub3QgYW4gYXJyYXkgb2YgdXBkYXRlcyB3aXRoIHZhbGlkIGtleXMgKGlkcykgKi9cbiAgbXVzdEJlVXBkYXRlcyhhY3Rpb246IEVudGl0eUFjdGlvbjxVcGRhdGU8VD5bXT4pOiBVcGRhdGU8VD5bXSB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgc2hvdWxkIGJlIGFuIGFycmF5IG9mIGVudGl0eSB1cGRhdGVzYCk7XG4gICAgfVxuICAgIGRhdGEuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuICAgICAgY29uc3QgeyBpZCwgY2hhbmdlcyB9ID0gaXRlbTtcbiAgICAgIGNvbnN0IGlkMiA9IHRoaXMuc2VsZWN0SWQoY2hhbmdlcyBhcyBUKTtcbiAgICAgIGlmICh0aGlzLmlzTm90S2V5VHlwZShpZCkgfHwgdGhpcy5pc05vdEtleVR5cGUoaWQyKSkge1xuICAgICAgICB0aGlzLnRocm93RXJyb3IoXG4gICAgICAgICAgYWN0aW9uLFxuICAgICAgICAgIGAsIGl0ZW0gJHtpICsgMX0sIGhhcyBhIG1pc3Npbmcgb3IgaW52YWxpZCBlbnRpdHkga2V5IChpZClgXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICAvKiogVGhyb3cgaWYgdGhlIGFjdGlvbiBwYXlsb2FkIGlzIG5vdCBhbiB1cGRhdGUgcmVzcG9uc2Ugd2l0aCBhIHZhbGlkIGtleSAoaWQpICovXG4gIG11c3RCZVVwZGF0ZVJlc3BvbnNlKFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFVwZGF0ZVJlc3BvbnNlRGF0YTxUPj5cbiAgKTogVXBkYXRlUmVzcG9uc2VEYXRhPFQ+IHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGlmICghZGF0YSkge1xuICAgICAgcmV0dXJuIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIGBzaG91bGQgYmUgYSBzaW5nbGUgZW50aXR5IHVwZGF0ZWApO1xuICAgIH1cbiAgICBjb25zdCB7IGlkLCBjaGFuZ2VzIH0gPSBkYXRhO1xuICAgIGNvbnN0IGlkMiA9IHRoaXMuc2VsZWN0SWQoY2hhbmdlcyBhcyBUKTtcbiAgICBpZiAodGhpcy5pc05vdEtleVR5cGUoaWQpIHx8IHRoaXMuaXNOb3RLZXlUeXBlKGlkMikpIHtcbiAgICAgIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIGBoYXMgYSBtaXNzaW5nIG9yIGludmFsaWQgZW50aXR5IGtleSAoaWQpYCk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgLyoqIFRocm93IGlmIHRoZSBhY3Rpb24gcGF5bG9hZCBpcyBub3QgYW4gYXJyYXkgb2YgdXBkYXRlIHJlc3BvbnNlcyB3aXRoIHZhbGlkIGtleXMgKGlkcykgKi9cbiAgbXVzdEJlVXBkYXRlUmVzcG9uc2VzKFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uPFVwZGF0ZVJlc3BvbnNlRGF0YTxUPltdPlxuICApOiBVcGRhdGVSZXNwb25zZURhdGE8VD5bXSB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgc2hvdWxkIGJlIGFuIGFycmF5IG9mIGVudGl0eSB1cGRhdGVzYCk7XG4gICAgfVxuICAgIGRhdGEuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuICAgICAgY29uc3QgeyBpZCwgY2hhbmdlcyB9ID0gaXRlbTtcbiAgICAgIGNvbnN0IGlkMiA9IHRoaXMuc2VsZWN0SWQoY2hhbmdlcyBhcyBUKTtcbiAgICAgIGlmICh0aGlzLmlzTm90S2V5VHlwZShpZCkgfHwgdGhpcy5pc05vdEtleVR5cGUoaWQyKSkge1xuICAgICAgICB0aGlzLnRocm93RXJyb3IoXG4gICAgICAgICAgYWN0aW9uLFxuICAgICAgICAgIGAsIGl0ZW0gJHtpICsgMX0sIGhhcyBhIG1pc3Npbmcgb3IgaW52YWxpZCBlbnRpdHkga2V5IChpZClgXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBwcml2YXRlIGV4dHJhY3REYXRhPFQ+KGFjdGlvbjogRW50aXR5QWN0aW9uPFQ+KSB7XG4gICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkICYmIGFjdGlvbi5wYXlsb2FkLmRhdGE7XG4gIH1cblxuICAvKiogUmV0dXJuIHRydWUgaWYgdGhpcyBrZXkgKGlkKSBpcyBpbnZhbGlkICovXG4gIHByaXZhdGUgaXNOb3RLZXlUeXBlKGlkOiBhbnkpIHtcbiAgICByZXR1cm4gdHlwZW9mIGlkICE9PSAnc3RyaW5nJyAmJiB0eXBlb2YgaWQgIT09ICdudW1iZXInO1xuICB9XG5cbiAgcHJpdmF0ZSB0aHJvd0Vycm9yKGFjdGlvbjogRW50aXR5QWN0aW9uLCBtc2c6IHN0cmluZyk6IG5ldmVyIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgJHt0aGlzLmVudGl0eU5hbWV9IEVudGl0eUFjdGlvbiBndWFyZCBmb3IgXCIke1xuICAgICAgICBhY3Rpb24udHlwZVxuICAgICAgfVwiOiBwYXlsb2FkICR7bXNnfWBcbiAgICApO1xuICB9XG59XG4iXX0=