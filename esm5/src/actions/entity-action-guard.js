/**
 * Guard methods that ensure EntityAction payload is as expected.
 * Each method returns that payload if it passes the guard or
 * throws an error.
 */
var EntityActionGuard = /** @class */ (function () {
    function EntityActionGuard(entityName, selectId) {
        this.entityName = entityName;
        this.selectId = selectId;
    }
    /** Throw if the action payload is not an entity with a valid key */
    EntityActionGuard.prototype.mustBeEntity = function (action) {
        var data = this.extractData(action);
        if (!data) {
            return this.throwError(action, "should have a single entity.");
        }
        var id = this.selectId(data);
        if (this.isNotKeyType(id)) {
            this.throwError(action, "has a missing or invalid entity key (id)");
        }
        return data;
    };
    /** Throw if the action payload is not an array of entities with valid keys */
    EntityActionGuard.prototype.mustBeEntities = function (action) {
        var _this = this;
        var data = this.extractData(action);
        if (!Array.isArray(data)) {
            return this.throwError(action, "should be an array of entities");
        }
        data.forEach(function (entity, i) {
            var id = _this.selectId(entity);
            if (_this.isNotKeyType(id)) {
                var msg = ", item " + (i + 1) + ", does not have a valid entity key (id)";
                _this.throwError(action, msg);
            }
        });
        return data;
    };
    /** Throw if the action payload is not a single, valid key */
    EntityActionGuard.prototype.mustBeKey = function (action) {
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
    EntityActionGuard.prototype.mustBeKeys = function (action) {
        var _this = this;
        var data = this.extractData(action);
        if (!Array.isArray(data)) {
            return this.throwError(action, "should be an array of entity keys (id)");
        }
        data.forEach(function (id, i) {
            if (_this.isNotKeyType(id)) {
                var msg = _this.entityName + " ', item " + (i +
                    1) + ", is not a valid entity key (id)";
                _this.throwError(action, msg);
            }
        });
        return data;
    };
    /** Throw if the action payload is not an update with a valid key (id) */
    EntityActionGuard.prototype.mustBeUpdate = function (action) {
        var data = this.extractData(action);
        if (!data) {
            return this.throwError(action, "should be a single entity update");
        }
        var id = data.id, changes = data.changes;
        var id2 = this.selectId(changes);
        if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
            this.throwError(action, "has a missing or invalid entity key (id)");
        }
        return data;
    };
    /** Throw if the action payload is not an array of updates with valid keys (ids) */
    EntityActionGuard.prototype.mustBeUpdates = function (action) {
        var _this = this;
        var data = this.extractData(action);
        if (!Array.isArray(data)) {
            return this.throwError(action, "should be an array of entity updates");
        }
        data.forEach(function (item, i) {
            var id = item.id, changes = item.changes;
            var id2 = _this.selectId(changes);
            if (_this.isNotKeyType(id) || _this.isNotKeyType(id2)) {
                _this.throwError(action, ", item " + (i + 1) + ", has a missing or invalid entity key (id)");
            }
        });
        return data;
    };
    /** Throw if the action payload is not an update response with a valid key (id) */
    EntityActionGuard.prototype.mustBeUpdateResponse = function (action) {
        var data = this.extractData(action);
        if (!data) {
            return this.throwError(action, "should be a single entity update");
        }
        var id = data.id, changes = data.changes;
        var id2 = this.selectId(changes);
        if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
            this.throwError(action, "has a missing or invalid entity key (id)");
        }
        return data;
    };
    /** Throw if the action payload is not an array of update responses with valid keys (ids) */
    EntityActionGuard.prototype.mustBeUpdateResponses = function (action) {
        var _this = this;
        var data = this.extractData(action);
        if (!Array.isArray(data)) {
            return this.throwError(action, "should be an array of entity updates");
        }
        data.forEach(function (item, i) {
            var id = item.id, changes = item.changes;
            var id2 = _this.selectId(changes);
            if (_this.isNotKeyType(id) || _this.isNotKeyType(id2)) {
                _this.throwError(action, ", item " + (i + 1) + ", has a missing or invalid entity key (id)");
            }
        });
        return data;
    };
    EntityActionGuard.prototype.extractData = function (action) {
        return action.payload && action.payload.data;
    };
    /** Return true if this key (id) is invalid */
    EntityActionGuard.prototype.isNotKeyType = function (id) {
        return typeof id !== 'string' && typeof id !== 'number';
    };
    EntityActionGuard.prototype.throwError = function (action, msg) {
        throw new Error(this.entityName + " EntityAction guard for \"" + action.type + "\": payload " + msg);
    };
    return EntityActionGuard;
}());
export { EntityActionGuard };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWFjdGlvbi1ndWFyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvYWN0aW9ucy9lbnRpdHktYWN0aW9uLWd1YXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUtBOzs7O0dBSUc7QUFDSDtJQUNFLDJCQUFvQixVQUFrQixFQUFVLFFBQXVCO1FBQW5ELGVBQVUsR0FBVixVQUFVLENBQVE7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFlO0lBQUcsQ0FBQztJQUUzRSxvRUFBb0U7SUFDcEUsd0NBQVksR0FBWixVQUFhLE1BQXVCO1FBQ2xDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNULE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsOEJBQThCLENBQUMsQ0FBQztTQUNoRTtRQUNELElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLDBDQUEwQyxDQUFDLENBQUM7U0FDckU7UUFDRCxPQUFPLElBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsOEVBQThFO0lBQzlFLDBDQUFjLEdBQWQsVUFBZSxNQUF5QjtRQUF4QyxpQkFhQztRQVpDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDeEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO1NBQ2xFO1FBQ0QsSUFBSSxDQUFDLE9B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QU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsc0NBQXNDLENBQUMsQ0FBQztTQUN4RTtRQUNELElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUUsQ0FBQztZQUNYLElBQUEsWUFBRSxFQUFFLHNCQUFPLENBQVU7WUFDN0IsSUFBTSxHQUFHLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxPQUFZLENBQUMsQ0FBQztZQUN4QyxJQUFJLEtBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDbkQsS0FBSSxDQUFDLFVBQVUsQ0FDYixNQUFNLEVBQ04sYUFBVSxDQUFDLEdBQUcsQ0FBQyxnREFBNEMsQ0FDNUQsQ0FBQzthQUNIO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTyx1Q0FBVyxHQUFuQixVQUF1QixNQUF1QjtRQUM1QyxPQUFPLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDL0MsQ0FBQztJQUVELDhDQUE4QztJQUN0Qyx3Q0FBWSxHQUFwQixVQUFxQixFQUFPO1FBQzFCLE9BQU8sT0FBTyxFQUFFLEtBQUssUUFBUSxJQUFJLE9BQU8sRUFBRSxLQUFLLFFBQVEsQ0FBQztJQUMxRCxDQUFDO0lBRU8sc0NBQVUsR0FBbEIsVUFBbUIsTUFBb0IsRUFBRSxHQUFXO1FBQ2xELE1BQU0sSUFBSSxLQUFLLENBQ1YsSUFBSSxDQUFDLFVBQVUsa0NBQ2hCLE1BQU0sQ0FBQyxJQUFJLG9CQUNDLEdBQUssQ0FDcEIsQ0FBQztJQUNKLENBQUM7SUFDSCx3QkFBQztBQUFELENBQUMsQUFsSkQsSUFrSkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJZFNlbGVjdG9yLCBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgVXBkYXRlUmVzcG9uc2VEYXRhIH0gZnJvbSAnLi4vYWN0aW9ucy91cGRhdGUtcmVzcG9uc2UtZGF0YSc7XG5cbi8qKlxuICogR3VhcmQgbWV0aG9kcyB0aGF0IGVuc3VyZSBFbnRpdHlBY3Rpb24gcGF5bG9hZCBpcyBhcyBleHBlY3RlZC5cbiAqIEVhY2ggbWV0aG9kIHJldHVybnMgdGhhdCBwYXlsb2FkIGlmIGl0IHBhc3NlcyB0aGUgZ3VhcmQgb3JcbiAqIHRocm93cyBhbiBlcnJvci5cbiAqL1xuZXhwb3J0IGNsYXNzIEVudGl0eUFjdGlvbkd1YXJkPFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbnRpdHlOYW1lOiBzdHJpbmcsIHByaXZhdGUgc2VsZWN0SWQ6IElkU2VsZWN0b3I8VD4pIHt9XG5cbiAgLyoqIFRocm93IGlmIHRoZSBhY3Rpb24gcGF5bG9hZCBpcyBub3QgYW4gZW50aXR5IHdpdGggYSB2YWxpZCBrZXkgKi9cbiAgbXVzdEJlRW50aXR5KGFjdGlvbjogRW50aXR5QWN0aW9uPFQ+KTogVCB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHJldHVybiB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgc2hvdWxkIGhhdmUgYSBzaW5nbGUgZW50aXR5LmApO1xuICAgIH1cbiAgICBjb25zdCBpZCA9IHRoaXMuc2VsZWN0SWQoZGF0YSk7XG4gICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGlkKSkge1xuICAgICAgdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgYGhhcyBhIG1pc3Npbmcgb3IgaW52YWxpZCBlbnRpdHkga2V5IChpZClgKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGEgYXMgVDtcbiAgfVxuXG4gIC8qKiBUaHJvdyBpZiB0aGUgYWN0aW9uIHBheWxvYWQgaXMgbm90IGFuIGFycmF5IG9mIGVudGl0aWVzIHdpdGggdmFsaWQga2V5cyAqL1xuICBtdXN0QmVFbnRpdGllcyhhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+KTogVFtdIHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgcmV0dXJuIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIGBzaG91bGQgYmUgYW4gYXJyYXkgb2YgZW50aXRpZXNgKTtcbiAgICB9XG4gICAgZGF0YS5mb3JFYWNoKChlbnRpdHksIGkpID0+IHtcbiAgICAgIGNvbnN0IGlkID0gdGhpcy5zZWxlY3RJZChlbnRpdHkpO1xuICAgICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGlkKSkge1xuICAgICAgICBjb25zdCBtc2cgPSBgLCBpdGVtICR7aSArIDF9LCBkb2VzIG5vdCBoYXZlIGEgdmFsaWQgZW50aXR5IGtleSAoaWQpYDtcbiAgICAgICAgdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgbXNnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIC8qKiBUaHJvdyBpZiB0aGUgYWN0aW9uIHBheWxvYWQgaXMgbm90IGEgc2luZ2xlLCB2YWxpZCBrZXkgKi9cbiAgbXVzdEJlS2V5KGFjdGlvbjogRW50aXR5QWN0aW9uPHN0cmluZyB8IG51bWJlcj4pOiBzdHJpbmcgfCBudW1iZXIgfCBuZXZlciB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgc2hvdWxkIGJlIGEgc2luZ2xlIGVudGl0eSBrZXlgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGRhdGEpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGlzIG5vdCBhIHZhbGlkIGtleSAoaWQpYCk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgLyoqIFRocm93IGlmIHRoZSBhY3Rpb24gcGF5bG9hZCBpcyBub3QgYW4gYXJyYXkgb2YgdmFsaWQga2V5cyAqL1xuICBtdXN0QmVLZXlzKGFjdGlvbjogRW50aXR5QWN0aW9uPChzdHJpbmcgfCBudW1iZXIpW10+KTogKHN0cmluZyB8IG51bWJlcilbXSB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgc2hvdWxkIGJlIGFuIGFycmF5IG9mIGVudGl0eSBrZXlzIChpZClgKTtcbiAgICB9XG4gICAgZGF0YS5mb3JFYWNoKChpZCwgaSkgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGlkKSkge1xuICAgICAgICBjb25zdCBtc2cgPSBgJHt0aGlzLmVudGl0eU5hbWV9ICcsIGl0ZW0gJHtpICtcbiAgICAgICAgICAxfSwgaXMgbm90IGEgdmFsaWQgZW50aXR5IGtleSAoaWQpYDtcbiAgICAgICAgdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgbXNnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIC8qKiBUaHJvdyBpZiB0aGUgYWN0aW9uIHBheWxvYWQgaXMgbm90IGFuIHVwZGF0ZSB3aXRoIGEgdmFsaWQga2V5IChpZCkgKi9cbiAgbXVzdEJlVXBkYXRlKGFjdGlvbjogRW50aXR5QWN0aW9uPFVwZGF0ZTxUPj4pOiBVcGRhdGU8VD4ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgYHNob3VsZCBiZSBhIHNpbmdsZSBlbnRpdHkgdXBkYXRlYCk7XG4gICAgfVxuICAgIGNvbnN0IHsgaWQsIGNoYW5nZXMgfSA9IGRhdGE7XG4gICAgY29uc3QgaWQyID0gdGhpcy5zZWxlY3RJZChjaGFuZ2VzIGFzIFQpO1xuICAgIGlmICh0aGlzLmlzTm90S2V5VHlwZShpZCkgfHwgdGhpcy5pc05vdEtleVR5cGUoaWQyKSkge1xuICAgICAgdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgYGhhcyBhIG1pc3Npbmcgb3IgaW52YWxpZCBlbnRpdHkga2V5IChpZClgKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICAvKiogVGhyb3cgaWYgdGhlIGFjdGlvbiBwYXlsb2FkIGlzIG5vdCBhbiBhcnJheSBvZiB1cGRhdGVzIHdpdGggdmFsaWQga2V5cyAoaWRzKSAqL1xuICBtdXN0QmVVcGRhdGVzKGFjdGlvbjogRW50aXR5QWN0aW9uPFVwZGF0ZTxUPltdPik6IFVwZGF0ZTxUPltdIHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgcmV0dXJuIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIGBzaG91bGQgYmUgYW4gYXJyYXkgb2YgZW50aXR5IHVwZGF0ZXNgKTtcbiAgICB9XG4gICAgZGF0YS5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XG4gICAgICBjb25zdCB7IGlkLCBjaGFuZ2VzIH0gPSBpdGVtO1xuICAgICAgY29uc3QgaWQyID0gdGhpcy5zZWxlY3RJZChjaGFuZ2VzIGFzIFQpO1xuICAgICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGlkKSB8fCB0aGlzLmlzTm90S2V5VHlwZShpZDIpKSB7XG4gICAgICAgIHRoaXMudGhyb3dFcnJvcihcbiAgICAgICAgICBhY3Rpb24sXG4gICAgICAgICAgYCwgaXRlbSAke2kgKyAxfSwgaGFzIGEgbWlzc2luZyBvciBpbnZhbGlkIGVudGl0eSBrZXkgKGlkKWBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIC8qKiBUaHJvdyBpZiB0aGUgYWN0aW9uIHBheWxvYWQgaXMgbm90IGFuIHVwZGF0ZSByZXNwb25zZSB3aXRoIGEgdmFsaWQga2V5IChpZCkgKi9cbiAgbXVzdEJlVXBkYXRlUmVzcG9uc2UoXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VXBkYXRlUmVzcG9uc2VEYXRhPFQ+PlxuICApOiBVcGRhdGVSZXNwb25zZURhdGE8VD4ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgYHNob3VsZCBiZSBhIHNpbmdsZSBlbnRpdHkgdXBkYXRlYCk7XG4gICAgfVxuICAgIGNvbnN0IHsgaWQsIGNoYW5nZXMgfSA9IGRhdGE7XG4gICAgY29uc3QgaWQyID0gdGhpcy5zZWxlY3RJZChjaGFuZ2VzIGFzIFQpO1xuICAgIGlmICh0aGlzLmlzTm90S2V5VHlwZShpZCkgfHwgdGhpcy5pc05vdEtleVR5cGUoaWQyKSkge1xuICAgICAgdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgYGhhcyBhIG1pc3Npbmcgb3IgaW52YWxpZCBlbnRpdHkga2V5IChpZClgKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICAvKiogVGhyb3cgaWYgdGhlIGFjdGlvbiBwYXlsb2FkIGlzIG5vdCBhbiBhcnJheSBvZiB1cGRhdGUgcmVzcG9uc2VzIHdpdGggdmFsaWQga2V5cyAoaWRzKSAqL1xuICBtdXN0QmVVcGRhdGVSZXNwb25zZXMoXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb248VXBkYXRlUmVzcG9uc2VEYXRhPFQ+W10+XG4gICk6IFVwZGF0ZVJlc3BvbnNlRGF0YTxUPltdIHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgcmV0dXJuIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIGBzaG91bGQgYmUgYW4gYXJyYXkgb2YgZW50aXR5IHVwZGF0ZXNgKTtcbiAgICB9XG4gICAgZGF0YS5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XG4gICAgICBjb25zdCB7IGlkLCBjaGFuZ2VzIH0gPSBpdGVtO1xuICAgICAgY29uc3QgaWQyID0gdGhpcy5zZWxlY3RJZChjaGFuZ2VzIGFzIFQpO1xuICAgICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGlkKSB8fCB0aGlzLmlzTm90S2V5VHlwZShpZDIpKSB7XG4gICAgICAgIHRoaXMudGhyb3dFcnJvcihcbiAgICAgICAgICBhY3Rpb24sXG4gICAgICAgICAgYCwgaXRlbSAke2kgKyAxfSwgaGFzIGEgbWlzc2luZyBvciBpbnZhbGlkIGVudGl0eSBrZXkgKGlkKWBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIHByaXZhdGUgZXh0cmFjdERhdGE8VD4oYWN0aW9uOiBFbnRpdHlBY3Rpb248VD4pIHtcbiAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQgJiYgYWN0aW9uLnBheWxvYWQuZGF0YTtcbiAgfVxuXG4gIC8qKiBSZXR1cm4gdHJ1ZSBpZiB0aGlzIGtleSAoaWQpIGlzIGludmFsaWQgKi9cbiAgcHJpdmF0ZSBpc05vdEtleVR5cGUoaWQ6IGFueSkge1xuICAgIHJldHVybiB0eXBlb2YgaWQgIT09ICdzdHJpbmcnICYmIHR5cGVvZiBpZCAhPT0gJ251bWJlcic7XG4gIH1cblxuICBwcml2YXRlIHRocm93RXJyb3IoYWN0aW9uOiBFbnRpdHlBY3Rpb24sIG1zZzogc3RyaW5nKTogbmV2ZXIge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGAke3RoaXMuZW50aXR5TmFtZX0gRW50aXR5QWN0aW9uIGd1YXJkIGZvciBcIiR7XG4gICAgICAgIGFjdGlvbi50eXBlXG4gICAgICB9XCI6IHBheWxvYWQgJHttc2d9YFxuICAgICk7XG4gIH1cbn1cbiJdfQ==