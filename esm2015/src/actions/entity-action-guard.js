/**
 * Guard methods that ensure EntityAction payload is as expected.
 * Each method returns that payload if it passes the guard or
 * throws an error.
 */
export class EntityActionGuard {
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
                const msg = `${this.entityName} ', item ${i + 1}, is not a valid entity key (id)`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWFjdGlvbi1ndWFyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvYWN0aW9ucy9lbnRpdHktYWN0aW9uLWd1YXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUtBOzs7O0dBSUc7QUFDSCxNQUFNLE9BQU8saUJBQWlCO0lBQzVCLFlBQW9CLFVBQWtCLEVBQVUsUUFBdUI7UUFBbkQsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQWU7SUFBRyxDQUFDO0lBRTNFLG9FQUFvRTtJQUNwRSxZQUFZLENBQUMsTUFBdUI7UUFDbEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1QsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO1NBQ2hFO1FBQ0QsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQixJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDekIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsMENBQTBDLENBQUMsQ0FBQztTQUNyRTtRQUNELE9BQU8sSUFBUyxDQUFDO0lBQ25CLENBQUM7SUFFRCw4RUFBOEU7SUFDOUUsY0FBYyxDQUFDLE1BQXlCO1FBQ3RDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDeEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO1NBQ2xFO1FBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0s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QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLHNDQUFzQyxDQUFDLENBQUM7U0FDeEU7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3ZCLE1BQU0sRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBQzdCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBWSxDQUFDLENBQUM7WUFDeEMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ25ELElBQUksQ0FBQyxVQUFVLENBQ2IsTUFBTSxFQUNOLFVBQVUsQ0FBQyxHQUFHLENBQUMsNENBQTRDLENBQzVELENBQUM7YUFDSDtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU8sV0FBVyxDQUFJLE1BQXVCO1FBQzVDLE9BQU8sTUFBTSxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztJQUMvQyxDQUFDO0lBRUQsOENBQThDO0lBQ3RDLFlBQVksQ0FBQyxFQUFPO1FBQzFCLE9BQU8sT0FBTyxFQUFFLEtBQUssUUFBUSxJQUFJLE9BQU8sRUFBRSxLQUFLLFFBQVEsQ0FBQztJQUMxRCxDQUFDO0lBRU8sVUFBVSxDQUFDLE1BQW9CLEVBQUUsR0FBVztRQUNsRCxNQUFNLElBQUksS0FBSyxDQUNiLEdBQUcsSUFBSSxDQUFDLFVBQVUsNEJBQTRCLE1BQU0sQ0FBQyxJQUFJLGNBQWMsR0FBRyxFQUFFLENBQzdFLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJZFNlbGVjdG9yLCBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgVXBkYXRlUmVzcG9uc2VEYXRhIH0gZnJvbSAnLi4vYWN0aW9ucy91cGRhdGUtcmVzcG9uc2UtZGF0YSc7XG5cbi8qKlxuICogR3VhcmQgbWV0aG9kcyB0aGF0IGVuc3VyZSBFbnRpdHlBY3Rpb24gcGF5bG9hZCBpcyBhcyBleHBlY3RlZC5cbiAqIEVhY2ggbWV0aG9kIHJldHVybnMgdGhhdCBwYXlsb2FkIGlmIGl0IHBhc3NlcyB0aGUgZ3VhcmQgb3JcbiAqIHRocm93cyBhbiBlcnJvci5cbiAqL1xuZXhwb3J0IGNsYXNzIEVudGl0eUFjdGlvbkd1YXJkPFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbnRpdHlOYW1lOiBzdHJpbmcsIHByaXZhdGUgc2VsZWN0SWQ6IElkU2VsZWN0b3I8VD4pIHt9XG5cbiAgLyoqIFRocm93IGlmIHRoZSBhY3Rpb24gcGF5bG9hZCBpcyBub3QgYW4gZW50aXR5IHdpdGggYSB2YWxpZCBrZXkgKi9cbiAgbXVzdEJlRW50aXR5KGFjdGlvbjogRW50aXR5QWN0aW9uPFQ+KTogVCB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHJldHVybiB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgc2hvdWxkIGhhdmUgYSBzaW5nbGUgZW50aXR5LmApO1xuICAgIH1cbiAgICBjb25zdCBpZCA9IHRoaXMuc2VsZWN0SWQoZGF0YSk7XG4gICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGlkKSkge1xuICAgICAgdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgYGhhcyBhIG1pc3Npbmcgb3IgaW52YWxpZCBlbnRpdHkga2V5IChpZClgKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGEgYXMgVDtcbiAgfVxuXG4gIC8qKiBUaHJvdyBpZiB0aGUgYWN0aW9uIHBheWxvYWQgaXMgbm90IGFuIGFycmF5IG9mIGVudGl0aWVzIHdpdGggdmFsaWQga2V5cyAqL1xuICBtdXN0QmVFbnRpdGllcyhhY3Rpb246IEVudGl0eUFjdGlvbjxUW10+KTogVFtdIHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5leHRyYWN0RGF0YShhY3Rpb24pO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgcmV0dXJuIHRoaXMudGhyb3dFcnJvcihhY3Rpb24sIGBzaG91bGQgYmUgYW4gYXJyYXkgb2YgZW50aXRpZXNgKTtcbiAgICB9XG4gICAgZGF0YS5mb3JFYWNoKChlbnRpdHksIGkpID0+IHtcbiAgICAgIGNvbnN0IGlkID0gdGhpcy5zZWxlY3RJZChlbnRpdHkpO1xuICAgICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGlkKSkge1xuICAgICAgICBjb25zdCBtc2cgPSBgLCBpdGVtICR7aSArIDF9LCBkb2VzIG5vdCBoYXZlIGEgdmFsaWQgZW50aXR5IGtleSAoaWQpYDtcbiAgICAgICAgdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgbXNnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIC8qKiBUaHJvdyBpZiB0aGUgYWN0aW9uIHBheWxvYWQgaXMgbm90IGEgc2luZ2xlLCB2YWxpZCBrZXkgKi9cbiAgbXVzdEJlS2V5KGFjdGlvbjogRW50aXR5QWN0aW9uPHN0cmluZyB8IG51bWJlcj4pOiBzdHJpbmcgfCBudW1iZXIgfCBuZXZlciB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgc2hvdWxkIGJlIGEgc2luZ2xlIGVudGl0eSBrZXlgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGRhdGEpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGlzIG5vdCBhIHZhbGlkIGtleSAoaWQpYCk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgLyoqIFRocm93IGlmIHRoZSBhY3Rpb24gcGF5bG9hZCBpcyBub3QgYW4gYXJyYXkgb2YgdmFsaWQga2V5cyAqL1xuICBtdXN0QmVLZXlzKGFjdGlvbjogRW50aXR5QWN0aW9uPChzdHJpbmcgfCBudW1iZXIpW10+KTogKHN0cmluZyB8IG51bWJlcilbXSB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgc2hvdWxkIGJlIGFuIGFycmF5IG9mIGVudGl0eSBrZXlzIChpZClgKTtcbiAgICB9XG4gICAgZGF0YS5mb3JFYWNoKChpZCwgaSkgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGlkKSkge1xuICAgICAgICBjb25zdCBtc2cgPSBgJHt0aGlzLmVudGl0eU5hbWV9ICcsIGl0ZW0gJHtcbiAgICAgICAgICBpICsgMVxuICAgICAgICB9LCBpcyBub3QgYSB2YWxpZCBlbnRpdHkga2V5IChpZClgO1xuICAgICAgICB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBtc2cpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgLyoqIFRocm93IGlmIHRoZSBhY3Rpb24gcGF5bG9hZCBpcyBub3QgYW4gdXBkYXRlIHdpdGggYSB2YWxpZCBrZXkgKGlkKSAqL1xuICBtdXN0QmVVcGRhdGUoYWN0aW9uOiBFbnRpdHlBY3Rpb248VXBkYXRlPFQ+Pik6IFVwZGF0ZTxUPiB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHJldHVybiB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgc2hvdWxkIGJlIGEgc2luZ2xlIGVudGl0eSB1cGRhdGVgKTtcbiAgICB9XG4gICAgY29uc3QgeyBpZCwgY2hhbmdlcyB9ID0gZGF0YTtcbiAgICBjb25zdCBpZDIgPSB0aGlzLnNlbGVjdElkKGNoYW5nZXMgYXMgVCk7XG4gICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGlkKSB8fCB0aGlzLmlzTm90S2V5VHlwZShpZDIpKSB7XG4gICAgICB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgaGFzIGEgbWlzc2luZyBvciBpbnZhbGlkIGVudGl0eSBrZXkgKGlkKWApO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIC8qKiBUaHJvdyBpZiB0aGUgYWN0aW9uIHBheWxvYWQgaXMgbm90IGFuIGFycmF5IG9mIHVwZGF0ZXMgd2l0aCB2YWxpZCBrZXlzIChpZHMpICovXG4gIG11c3RCZVVwZGF0ZXMoYWN0aW9uOiBFbnRpdHlBY3Rpb248VXBkYXRlPFQ+W10+KTogVXBkYXRlPFQ+W10ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICByZXR1cm4gdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgYHNob3VsZCBiZSBhbiBhcnJheSBvZiBlbnRpdHkgdXBkYXRlc2ApO1xuICAgIH1cbiAgICBkYXRhLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcbiAgICAgIGNvbnN0IHsgaWQsIGNoYW5nZXMgfSA9IGl0ZW07XG4gICAgICBjb25zdCBpZDIgPSB0aGlzLnNlbGVjdElkKGNoYW5nZXMgYXMgVCk7XG4gICAgICBpZiAodGhpcy5pc05vdEtleVR5cGUoaWQpIHx8IHRoaXMuaXNOb3RLZXlUeXBlKGlkMikpIHtcbiAgICAgICAgdGhpcy50aHJvd0Vycm9yKFxuICAgICAgICAgIGFjdGlvbixcbiAgICAgICAgICBgLCBpdGVtICR7aSArIDF9LCBoYXMgYSBtaXNzaW5nIG9yIGludmFsaWQgZW50aXR5IGtleSAoaWQpYFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgLyoqIFRocm93IGlmIHRoZSBhY3Rpb24gcGF5bG9hZCBpcyBub3QgYW4gdXBkYXRlIHJlc3BvbnNlIHdpdGggYSB2YWxpZCBrZXkgKGlkKSAqL1xuICBtdXN0QmVVcGRhdGVSZXNwb25zZShcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxVcGRhdGVSZXNwb25zZURhdGE8VD4+XG4gICk6IFVwZGF0ZVJlc3BvbnNlRGF0YTxUPiB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZXh0cmFjdERhdGEoYWN0aW9uKTtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHJldHVybiB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgc2hvdWxkIGJlIGEgc2luZ2xlIGVudGl0eSB1cGRhdGVgKTtcbiAgICB9XG4gICAgY29uc3QgeyBpZCwgY2hhbmdlcyB9ID0gZGF0YTtcbiAgICBjb25zdCBpZDIgPSB0aGlzLnNlbGVjdElkKGNoYW5nZXMgYXMgVCk7XG4gICAgaWYgKHRoaXMuaXNOb3RLZXlUeXBlKGlkKSB8fCB0aGlzLmlzTm90S2V5VHlwZShpZDIpKSB7XG4gICAgICB0aGlzLnRocm93RXJyb3IoYWN0aW9uLCBgaGFzIGEgbWlzc2luZyBvciBpbnZhbGlkIGVudGl0eSBrZXkgKGlkKWApO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIC8qKiBUaHJvdyBpZiB0aGUgYWN0aW9uIHBheWxvYWQgaXMgbm90IGFuIGFycmF5IG9mIHVwZGF0ZSByZXNwb25zZXMgd2l0aCB2YWxpZCBrZXlzIChpZHMpICovXG4gIG11c3RCZVVwZGF0ZVJlc3BvbnNlcyhcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvbjxVcGRhdGVSZXNwb25zZURhdGE8VD5bXT5cbiAgKTogVXBkYXRlUmVzcG9uc2VEYXRhPFQ+W10ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmV4dHJhY3REYXRhKGFjdGlvbik7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICByZXR1cm4gdGhpcy50aHJvd0Vycm9yKGFjdGlvbiwgYHNob3VsZCBiZSBhbiBhcnJheSBvZiBlbnRpdHkgdXBkYXRlc2ApO1xuICAgIH1cbiAgICBkYXRhLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcbiAgICAgIGNvbnN0IHsgaWQsIGNoYW5nZXMgfSA9IGl0ZW07XG4gICAgICBjb25zdCBpZDIgPSB0aGlzLnNlbGVjdElkKGNoYW5nZXMgYXMgVCk7XG4gICAgICBpZiAodGhpcy5pc05vdEtleVR5cGUoaWQpIHx8IHRoaXMuaXNOb3RLZXlUeXBlKGlkMikpIHtcbiAgICAgICAgdGhpcy50aHJvd0Vycm9yKFxuICAgICAgICAgIGFjdGlvbixcbiAgICAgICAgICBgLCBpdGVtICR7aSArIDF9LCBoYXMgYSBtaXNzaW5nIG9yIGludmFsaWQgZW50aXR5IGtleSAoaWQpYFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgcHJpdmF0ZSBleHRyYWN0RGF0YTxUPihhY3Rpb246IEVudGl0eUFjdGlvbjxUPikge1xuICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZCAmJiBhY3Rpb24ucGF5bG9hZC5kYXRhO1xuICB9XG5cbiAgLyoqIFJldHVybiB0cnVlIGlmIHRoaXMga2V5IChpZCkgaXMgaW52YWxpZCAqL1xuICBwcml2YXRlIGlzTm90S2V5VHlwZShpZDogYW55KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBpZCAhPT0gJ3N0cmluZycgJiYgdHlwZW9mIGlkICE9PSAnbnVtYmVyJztcbiAgfVxuXG4gIHByaXZhdGUgdGhyb3dFcnJvcihhY3Rpb246IEVudGl0eUFjdGlvbiwgbXNnOiBzdHJpbmcpOiBuZXZlciB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYCR7dGhpcy5lbnRpdHlOYW1lfSBFbnRpdHlBY3Rpb24gZ3VhcmQgZm9yIFwiJHthY3Rpb24udHlwZX1cIjogcGF5bG9hZCAke21zZ31gXG4gICAgKTtcbiAgfVxufVxuIl19