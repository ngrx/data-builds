(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/actions/entity-action-guard", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Guard methods that ensure EntityAction payload is as expected.
     * Each method returns that payload if it passes the guard or
     * throws an error.
     */
    class EntityActionGuard {
        constructor(entityName, selectId) {
            this.entityName = entityName;
            this.selectId = selectId;
        }
        /** Throw if the action payload is not an entity with a valid key */
        mustBeEntity(action) {
            const data = this.extractData(action);
            if (!data) {
                return this.throwError(action, `should have a single entity.`);
            }
            const id = this.selectId(data);
            if (this.isNotKeyType(id)) {
                this.throwError(action, `has a missing or invalid entity key (id)`);
            }
            return data;
        }
        /** Throw if the action payload is not an array of entities with valid keys */
        mustBeEntities(action) {
            const data = this.extractData(action);
            if (!Array.isArray(data)) {
                return this.throwError(action, `should be an array of entities`);
            }
            data.forEach((entity, i) => {
                const id = this.selectId(entity);
                if (this.isNotKeyType(id)) {
                    const msg = `, item ${i + 1}, does not have a valid entity key (id)`;
                    this.throwError(action, msg);
                }
            });
            return data;
        }
        /** Throw if the action payload is not a single, valid key */
        mustBeKey(action) {
            const data = this.extractData(action);
            if (!data) {
                throw new Error(`should be a single entity key`);
            }
            if (this.isNotKeyType(data)) {
                throw new Error(`is not a valid key (id)`);
            }
            return data;
        }
        /** Throw if the action payload is not an array of valid keys */
        mustBeKeys(action) {
            const data = this.extractData(action);
            if (!Array.isArray(data)) {
                return this.throwError(action, `should be an array of entity keys (id)`);
            }
            data.forEach((id, i) => {
                if (this.isNotKeyType(id)) {
                    const msg = `${this.entityName} ', item ${i +
                        1}, is not a valid entity key (id)`;
                    this.throwError(action, msg);
                }
            });
            return data;
        }
        /** Throw if the action payload is not an update with a valid key (id) */
        mustBeUpdate(action) {
            const data = this.extractData(action);
            if (!data) {
                return this.throwError(action, `should be a single entity update`);
            }
            const { id, changes } = data;
            const id2 = this.selectId(changes);
            if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
                this.throwError(action, `has a missing or invalid entity key (id)`);
            }
            return data;
        }
        /** Throw if the action payload is not an array of updates with valid keys (ids) */
        mustBeUpdates(action) {
            const data = this.extractData(action);
            if (!Array.isArray(data)) {
                return this.throwError(action, `should be an array of entity updates`);
            }
            data.forEach((item, i) => {
                const { id, changes } = item;
                const id2 = this.selectId(changes);
                if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
                    this.throwError(action, `, item ${i + 1}, has a missing or invalid entity key (id)`);
                }
            });
            return data;
        }
        /** Throw if the action payload is not an update response with a valid key (id) */
        mustBeUpdateResponse(action) {
            const data = this.extractData(action);
            if (!data) {
                return this.throwError(action, `should be a single entity update`);
            }
            const { id, changes } = data;
            const id2 = this.selectId(changes);
            if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
                this.throwError(action, `has a missing or invalid entity key (id)`);
            }
            return data;
        }
        /** Throw if the action payload is not an array of update responses with valid keys (ids) */
        mustBeUpdateResponses(action) {
            const data = this.extractData(action);
            if (!Array.isArray(data)) {
                return this.throwError(action, `should be an array of entity updates`);
            }
            data.forEach((item, i) => {
                const { id, changes } = item;
                const id2 = this.selectId(changes);
                if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
                    this.throwError(action, `, item ${i + 1}, has a missing or invalid entity key (id)`);
                }
            });
            return data;
        }
        extractData(action) {
            return action.payload && action.payload.data;
        }
        /** Return true if this key (id) is invalid */
        isNotKeyType(id) {
            return typeof id !== 'string' && typeof id !== 'number';
        }
        throwError(action, msg) {
            throw new Error(`${this.entityName} EntityAction guard for "${action.type}": payload ${msg}`);
        }
    }
    exports.EntityActionGuard = EntityActionGuard;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWFjdGlvbi1ndWFyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvYWN0aW9ucy9lbnRpdHktYWN0aW9uLWd1YXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBS0E7Ozs7T0FJRztJQUNILE1BQWEsaUJBQWlCO1FBQzVCLFlBQW9CLFVBQWtCLEVBQVUsUUFBdUI7WUFBbkQsZUFBVSxHQUFWLFVBQVUsQ0FBUTtZQUFVLGFBQVEsR0FBUixRQUFRLENBQWU7UUFBRyxDQUFDO1FBRTNFLG9FQUFvRTtRQUNwRSxZQUFZLENBQUMsTUFBdUI7WUFDbEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNULE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsOEJBQThCLENBQUMsQ0FBQzthQUNoRTtZQUNELE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0IsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUN6QixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSwwQ0FBMEMsQ0FBQyxDQUFDO2FBQ3JFO1lBQ0QsT0FBTyxJQUFTLENBQUM7UUFDbkIsQ0FBQztRQUVELDhFQUE4RTtRQUM5RSxjQUFjLENBQUMsTUFBeUI7WUFDdEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDeEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO2FBQ2xFO1lBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FB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LE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDeEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxzQ0FBc0MsQ0FBQyxDQUFDO2FBQ3hFO1lBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDdkIsTUFBTSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUM7Z0JBQzdCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBWSxDQUFDLENBQUM7Z0JBQ3hDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUNuRCxJQUFJLENBQUMsVUFBVSxDQUNiLE1BQU0sRUFDTixVQUFVLENBQUMsR0FBRyxDQUFDLDRDQUE0QyxDQUM1RCxDQUFDO2lCQUNIO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDSCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFFTyxXQUFXLENBQUksTUFBdUI7WUFDNUMsT0FBTyxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQy9DLENBQUM7UUFFRCw4Q0FBOEM7UUFDdEMsWUFBWSxDQUFDLEVBQU87WUFDMUIsT0FBTyxPQUFPLEVBQUUsS0FBSyxRQUFRLElBQUksT0FBTyxFQUFFLEtBQUssUUFBUSxDQUFDO1FBQzFELENBQUM7UUFFTyxVQUFVLENBQUMsTUFBb0IsRUFBRSxHQUFXO1lBQ2xELE1BQU0sSUFBSSxLQUFLLENBQ2IsR0FBRyxJQUFJLENBQUMsVUFBVSw0QkFDaEIsTUFBTSxDQUFDLElBQ1QsY0FBYyxHQUFHLEVBQUUsQ0FDcEIsQ0FBQztRQUNKLENBQUM7S0FDRjtJQWxKRCw4Q0FrSkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJZFNlbGVjdG9yLCBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgVXBkYXRlUmVzcG9uc2VEYXRhIH0gZnJvbSAnLi4vYWN0aW9ucy91cGRhdGUtcmVzcG9uc2UtZGF0YSc7XG5cbi8qKlxuICogR3VhcmQgbWV0aG9kcyB0aGF0IGVuc3VyZSBFbnRpdHlBY3Rpb24gcGF5bG9hZCBpcyBhcyBleHBlY3RlZC5cbiAqIEVhY2ggbWV0aG9kIHJldHVybnMgdGhhdCBwYXlsb2FkIGlmIGl0IHBhc3NlcyB0aGUgZ3VhcmQgb3JcbiAqIHRocm93cyBhbiBlcnJvci5cbiAqL1xuZXhwb3J0IGNsYXNzIEVudGl0eUFjdGlvbkd1YXJkPFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbnRpdHlOYW1lOiBzdHJpbmcsIHByaXZhdGUgc2VsZWN0SWQ6IElkU2VsZWN0b3I8VD4pIHt9XG5cbiAgLyoqIFRocm93IGlmIHRoZSBhY3Rpb24gcGF5bG9hZCBpcyBub3QgYW4gZW50aXR5IHdpdGggYSB2YWxpZCBrZXkgKi9cbiAgbXVzdEJlRW50aXR5KGFjdGlvbjogRW50aXR5QWN0aW9uPFQ+KTogVCB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHJldHVybiB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgc2hvdWxkIGhhdmUgYSBzaW5nbGUgZW50aXR5LmApO1xuICAgIH1cbiAgICBjb25zdCBpZCA9IHRoaXMuc2VsZWN0SWQoZGF0YSk7XG4gICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGlkKSkge1xuICAgICAgdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgYGhhcyBhIG1pc3Npbmcgb3IgaW52YWxpZCBlbnRpdHkga2V5IChpZClgKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGEgYXMgVDtcbiAgfVxuXG4gIC8qKiBUaHJvdyBpZiB0aGUgYWN0aW9uIHBheWxvYWQgaXMgbm90IGFuIGFycmF5IG9mIGVudGl0aWVzIHdpdGggdmFsaWQga2V5cyAqL1xuICBtdXN0QmVFbnRpdGllcyhhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+KTogVFtdIHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgcmV0dXJuIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIGBzaG91bGQgYmUgYW4gYXJyYXkgb2YgZW50aXRpZXNgKTtcbiAgICB9XG4gICAgZGF0YS5mb3JFYWNoKChlbnRpdHksIGkpID0+IHtcbiAgICAgIGNvbnN0IGlkID0gdGhpcy5zZWxlY3RJZChlbnRpdHkpO1xuICAgICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGlkKSkge1xuICAgICAgICBjb25zdCBtc2cgPSBgLCBpdGVtICR7aSArIDF9LCBkb2VzIG5vdCBoYXZlIGEgdmFsaWQgZW50aXR5IGtleSAoaWQpYDtcbiAgICAgICAgdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgbXNnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIC8qKiBUaHJvdyBpZiB0aGUgYWN0aW9uIHBheWxvYWQgaXMgbm90IGEgc2luZ2xlLCB2YWxpZCBrZXkgKi9cbiAgbXVzdEJlS2V5KGFjdGlvbjogRW50aXR5QWN0aW9uPHN0cmluZyB8IG51bWJlcj4pOiBzdHJpbmcgfCBudW1iZXIgfCBuZXZlciB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgc2hvdWxkIGJlIGEgc2luZ2xlIGVudGl0eSBrZXlgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGRhdGEpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGlzIG5vdCBhIHZhbGlkIGtleSAoaWQpYCk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgLyoqIFRocm93IGlmIHRoZSBhY3Rpb24gcGF5bG9hZCBpcyBub3QgYW4gYXJyYXkgb2YgdmFsaWQga2V5cyAqL1xuICBtdXN0QmVLZXlzKGFjdGlvbjogRW50aXR5QWN0aW9uPChzdHJpbmcgfCBudW1iZXIpW10+KTogKHN0cmluZyB8IG51bWJlcilbXSB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgc2hvdWxkIGJlIGFuIGFycmF5IG9mIGVudGl0eSBrZXlzIChpZClgKTtcbiAgICB9XG4gICAgZGF0YS5mb3JFYWNoKChpZCwgaSkgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGlkKSkge1xuICAgICAgICBjb25zdCBtc2cgPSBgJHt0aGlzLmVudGl0eU5hbWV9ICcsIGl0ZW0gJHtpICtcbiAgICAgICAgICAxfSwgaXMgbm90IGEgdmFsaWQgZW50aXR5IGtleSAoaWQpYDtcbiAgICAgICAgdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgbXNnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIC8qKiBUaHJvdyBpZiB0aGUgYWN0aW9uIHBheWxvYWQgaXMgbm90IGFuIHVwZGF0ZSB3aXRoIGEgdmFsaWQga2V5IChpZCkgKi9cbiAgbXVzdEJlVXBkYXRlKGFjdGlvbjogRW50aXR5QWN0aW9uPFVwZGF0ZTxUPj4pOiBVcGRhdGU8VD4ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgYHNob3VsZCBiZSBhIHNpbmdsZSBlbnRpdHkgdXBkYXRlYCk7XG4gICAgfVxuICAgIGNvbnN0IHsgaWQsIGNoYW5nZXMgfSA9IGRhdGE7XG4gICAgY29uc3QgaWQyID0gdGhpcy5zZWxlY3RJZChjaGFuZ2VzIGFzIFQpO1xuICAgIGlmICh0aGlzLmlzTm90S2V5VHlwZShpZCkgfHwgdGhpcy5pc05vdEtleVR5cGUoaWQyKSkge1xuICAgICAgdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgYGhhcyBhIG1pc3Npbmcgb3IgaW52YWxpZCBlbnRpdHkga2V5IChpZClgKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICAvKiogVGhyb3cgaWYgdGhlIGFjdGlvbiBwYXlsb2FkIGlzIG5vdCBhbiBhcnJheSBvZiB1cGRhdGVzIHdpdGggdmFsaWQga2V5cyAoaWRzKSAqL1xuICBtdXN0QmVVcGRhdGVzKGFjdGlvbjogRW50aXR5QWN0aW9uPFVwZGF0ZTxUPltdPik6IFVwZGF0ZTxUPltdIHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgcmV0dXJuIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIGBzaG91bGQgYmUgYW4gYXJyYXkgb2YgZW50aXR5IHVwZGF0ZXNgKTtcbiAgICB9XG4gICAgZGF0YS5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XG4gICAgICBjb25zdCB7IGlkLCBjaGFuZ2VzIH0gPSBpdGVtO1xuICAgICAgY29uc3QgaWQyID0gdGhpcy5zZWxlY3RJZChjaGFuZ2VzIGFzIFQpO1xuICAgICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGlkKSB8fCB0aGlzLmlzTm90S2V5VHlwZShpZDIpKSB7XG4gICAgICAgIHRoaXMudGhyb3dFcnJvcihcbiAgICAgICAgICBhY3Rpb24sXG4gICAgICAgICAgYCwgaXRlbSAke2kgKyAxfSwgaGFzIGEgbWlzc2luZyBvciBpbnZhbGlkIGVudGl0eSBrZXkgKGlkKWBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIC8qKiBUaHJvdyBpZiB0aGUgYWN0aW9uIHBheWxvYWQgaXMgbm90IGFuIHVwZGF0ZSByZXNwb25zZSB3aXRoIGEgdmFsaWQga2V5IChpZCkgKi9cbiAgbXVzdEJlVXBkYXRlUmVzcG9uc2UoXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VXBkYXRlUmVzcG9uc2VEYXRhPFQ+PlxuICApOiBVcGRhdGVSZXNwb25zZURhdGE8VD4ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgYHNob3VsZCBiZSBhIHNpbmdsZSBlbnRpdHkgdXBkYXRlYCk7XG4gICAgfVxuICAgIGNvbnN0IHsgaWQsIGNoYW5nZXMgfSA9IGRhdGE7XG4gICAgY29uc3QgaWQyID0gdGhpcy5zZWxlY3RJZChjaGFuZ2VzIGFzIFQpO1xuICAgIGlmICh0aGlzLmlzTm90S2V5VHlwZShpZCkgfHwgdGhpcy5pc05vdEtleVR5cGUoaWQyKSkge1xuICAgICAgdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgYGhhcyBhIG1pc3Npbmcgb3IgaW52YWxpZCBlbnRpdHkga2V5IChpZClgKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICAvKiogVGhyb3cgaWYgdGhlIGFjdGlvbiBwYXlsb2FkIGlzIG5vdCBhbiBhcnJheSBvZiB1cGRhdGUgcmVzcG9uc2VzIHdpdGggdmFsaWQga2V5cyAoaWRzKSAqL1xuICBtdXN0QmVVcGRhdGVSZXNwb25zZXMoXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VXBkYXRlUmVzcG9uc2VEYXRhPFQ+W10+XG4gICk6IFVwZGF0ZVJlc3BvbnNlRGF0YTxUPltdIHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgcmV0dXJuIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIGBzaG91bGQgYmUgYW4gYXJyYXkgb2YgZW50aXR5IHVwZGF0ZXNgKTtcbiAgICB9XG4gICAgZGF0YS5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XG4gICAgICBjb25zdCB7IGlkLCBjaGFuZ2VzIH0gPSBpdGVtO1xuICAgICAgY29uc3QgaWQyID0gdGhpcy5zZWxlY3RJZChjaGFuZ2VzIGFzIFQpO1xuICAgICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGlkKSB8fCB0aGlzLmlzTm90S2V5VHlwZShpZDIpKSB7XG4gICAgICAgIHRoaXMudGhyb3dFcnJvcihcbiAgICAgICAgICBhY3Rpb24sXG4gICAgICAgICAgYCwgaXRlbSAke2kgKyAxfSwgaGFzIGEgbWlzc2luZyBvciBpbnZhbGlkIGVudGl0eSBrZXkgKGlkKWBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIHByaXZhdGUgZXh0cmFjdERhdGE8VD4oYWN0aW9uOiBFbnRpdHlBY3Rpb248VD4pIHtcbiAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgJiYgYWN0aW9uLnBheWxvYWQuZGF0YTtcbiAgfVxuXG4gIC8qKiBSZXR1cm4gdHJ1ZSBpZiB0aGlzIGtleSAoaWQpIGlzIGludmFsaWQgKi9cbiAgcHJpdmF0ZSBpc05vdEtleVR5cGUoaWQ6IGFueSkge1xuICAgIHJldHVybiB0eXBlb2YgaWQgIT09ICdzdHJpbmcnICYmIHR5cGVvZiBpZCAhPT0gJ251bWJlcic7XG4gIH1cblxuICBwcml2YXRlIHRocm93RXJyb3IoYWN0aW9uOiBFbnRpdHlBY3Rpb24sIG1zZzogc3RyaW5nKTogbmV2ZXIge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGAke3RoaXMuZW50aXR5TmFtZX0gRW50aXR5QWN0aW9uIGd1YXJkIGZvciBcIiR7XG4gICAgICAgIGFjdGlvbi50eXBlXG4gICAgICB9XCI6IHBheWxvYWQgJHttc2d9YFxuICAgICk7XG4gIH1cbn1cbiJdfQ==