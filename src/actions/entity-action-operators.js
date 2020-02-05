(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/actions/entity-action-operators", ["require", "exports", "rxjs/operators", "@ngrx/data/src/utils/utilities"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const operators_1 = require("rxjs/operators");
    const utilities_1 = require("@ngrx/data/src/utils/utilities");
    function ofEntityOp(...allowedEntityOps) {
        const ops = utilities_1.flattenArgs(allowedEntityOps);
        switch (ops.length) {
            case 0:
                return operators_1.filter((action) => action.payload && action.payload.entityOp != null);
            case 1:
                const op = ops[0];
                return operators_1.filter((action) => action.payload && op === action.payload.entityOp);
            default:
                return operators_1.filter((action) => {
                    const entityOp = action.payload && action.payload.entityOp;
                    return entityOp && ops.some(o => o === entityOp);
                });
        }
    }
    exports.ofEntityOp = ofEntityOp;
    function ofEntityType(...allowedEntityNames) {
        const names = utilities_1.flattenArgs(allowedEntityNames);
        switch (names.length) {
            case 0:
                return operators_1.filter((action) => action.payload && action.payload.entityName != null);
            case 1:
                const name = names[0];
                return operators_1.filter((action) => action.payload && name === action.payload.entityName);
            default:
                return operators_1.filter((action) => {
                    const entityName = action.payload && action.payload.entityName;
                    return !!entityName && names.some(n => n === entityName);
                });
        }
    }
    exports.ofEntityType = ofEntityType;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWFjdGlvbi1vcGVyYXRvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1vcGVyYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFDQSw4Q0FBd0M7SUFJeEMsOERBQWlEO0lBbUJqRCxTQUFnQixVQUFVLENBQ3hCLEdBQUcsZ0JBQXVCO1FBRTFCLE1BQU0sR0FBRyxHQUFhLHVCQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNwRCxRQUFRLEdBQUcsQ0FBQyxNQUFNLEVBQUU7WUFDbEIsS0FBSyxDQUFDO2dCQUNKLE9BQU8sa0JBQU0sQ0FDWCxDQUFDLE1BQW9CLEVBQWUsRUFBRSxDQUNwQyxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUksQ0FDcEQsQ0FBQztZQUNKLEtBQUssQ0FBQztnQkFDSixNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLE9BQU8sa0JBQU0sQ0FDWCxDQUFDLE1BQW9CLEVBQWUsRUFBRSxDQUNwQyxNQUFNLENBQUMsT0FBTyxJQUFJLEVBQUUsS0FBSyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FDbkQsQ0FBQztZQUNKO2dCQUNFLE9BQU8sa0JBQU0sQ0FDWCxDQUFDLE1BQW9CLEVBQWUsRUFBRTtvQkFDcEMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztvQkFDM0QsT0FBTyxRQUFRLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQztnQkFDbkQsQ0FBQyxDQUNGLENBQUM7U0FDTDtJQUNILENBQUM7SUF4QkQsZ0NBd0JDO0lBb0JELFNBQWdCLFlBQVksQ0FDMUIsR0FBRyxrQkFBeUI7UUFFNUIsTUFBTSxLQUFLLEdBQWEsdUJBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3hELFFBQVEsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNwQixLQUFLLENBQUM7Z0JBQ0osT0FBTyxrQkFBTSxDQUNYLENBQUMsTUFBb0IsRUFBZSxFQUFFLENBQ3BDLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksSUFBSSxDQUN0RCxDQUFDO1lBQ0osS0FBSyxDQUFDO2dCQUNKLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsT0FBTyxrQkFBTSxDQUNYLENBQUMsTUFBb0IsRUFBZSxFQUFFLENBQ3BDLE1BQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxLQUFLLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUN2RCxDQUFDO1lBQ0o7Z0JBQ0UsT0FBTyxrQkFBTSxDQUNYLENBQUMsTUFBb0IsRUFBZSxFQUFFO29CQUNwQyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO29CQUMvRCxPQUFPLENBQUMsQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxVQUFVLENBQUMsQ0FBQztnQkFDM0QsQ0FBQyxDQUNGLENBQUM7U0FDTDtJQUNILENBQUM7SUF4QkQsb0NBd0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5T3AgfSBmcm9tICcuL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBmbGF0dGVuQXJncyB9IGZyb20gJy4uL3V0aWxzL3V0aWxpdGllcyc7XG5cbi8qKlxuICogU2VsZWN0IGFjdGlvbnMgY29uY2VybmluZyBvbmUgb2YgdGhlIGFsbG93ZWQgRW50aXR5IG9wZXJhdGlvbnNcbiAqIEBwYXJhbSBhbGxvd2VkRW50aXR5T3BzIEVudGl0eSBvcGVyYXRpb25zIChlLmcsIEVudGl0eU9wLlFVRVJZX0FMTCkgd2hvc2UgYWN0aW9ucyBzaG91bGQgYmUgc2VsZWN0ZWRcbiAqIEV4YW1wbGU6XG4gKiBgYGBcbiAqICB0aGlzLmFjdGlvbnMucGlwZShvZkVudGl0eU9wKEVudGl0eU9wLlFVRVJZX0FMTCwgRW50aXR5T3AuUVVFUllfTUFOWSksIC4uLilcbiAqICB0aGlzLmFjdGlvbnMucGlwZShvZkVudGl0eU9wKC4uLnF1ZXJ5T3BzKSwgLi4uKVxuICogIHRoaXMuYWN0aW9ucy5waXBlKG9mRW50aXR5T3AocXVlcnlPcHMpLCAuLi4pXG4gKiAgdGhpcy5hY3Rpb25zLnBpcGUob2ZFbnRpdHlPcCgpLCAuLi4pIC8vIGFueSBhY3Rpb24gd2l0aCBhIGRlZmluZWQgYGVudGl0eU9wYCBwcm9wZXJ0eVxuICogYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvZkVudGl0eU9wPFQgZXh0ZW5kcyBFbnRpdHlBY3Rpb24+KFxuICBhbGxvd2VkT3BzOiBzdHJpbmdbXSB8IEVudGl0eU9wW11cbik6IE9wZXJhdG9yRnVuY3Rpb248RW50aXR5QWN0aW9uLCBUPjtcbmV4cG9ydCBmdW5jdGlvbiBvZkVudGl0eU9wPFQgZXh0ZW5kcyBFbnRpdHlBY3Rpb24+KFxuICAuLi5hbGxvd2VkT3BzOiAoc3RyaW5nIHwgRW50aXR5T3ApW11cbik6IE9wZXJhdG9yRnVuY3Rpb248RW50aXR5QWN0aW9uLCBUPjtcbmV4cG9ydCBmdW5jdGlvbiBvZkVudGl0eU9wPFQgZXh0ZW5kcyBFbnRpdHlBY3Rpb24+KFxuICAuLi5hbGxvd2VkRW50aXR5T3BzOiBhbnlbXVxuKTogT3BlcmF0b3JGdW5jdGlvbjxFbnRpdHlBY3Rpb24sIFQ+IHtcbiAgY29uc3Qgb3BzOiBzdHJpbmdbXSA9IGZsYXR0ZW5BcmdzKGFsbG93ZWRFbnRpdHlPcHMpO1xuICBzd2l0Y2ggKG9wcy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6XG4gICAgICByZXR1cm4gZmlsdGVyKFxuICAgICAgICAoYWN0aW9uOiBFbnRpdHlBY3Rpb24pOiBhY3Rpb24gaXMgVCA9PlxuICAgICAgICAgIGFjdGlvbi5wYXlsb2FkICYmIGFjdGlvbi5wYXlsb2FkLmVudGl0eU9wICE9IG51bGxcbiAgICAgICk7XG4gICAgY2FzZSAxOlxuICAgICAgY29uc3Qgb3AgPSBvcHNbMF07XG4gICAgICByZXR1cm4gZmlsdGVyKFxuICAgICAgICAoYWN0aW9uOiBFbnRpdHlBY3Rpb24pOiBhY3Rpb24gaXMgVCA9PlxuICAgICAgICAgIGFjdGlvbi5wYXlsb2FkICYmIG9wID09PSBhY3Rpb24ucGF5bG9hZC5lbnRpdHlPcFxuICAgICAgKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZpbHRlcihcbiAgICAgICAgKGFjdGlvbjogRW50aXR5QWN0aW9uKTogYWN0aW9uIGlzIFQgPT4ge1xuICAgICAgICAgIGNvbnN0IGVudGl0eU9wID0gYWN0aW9uLnBheWxvYWQgJiYgYWN0aW9uLnBheWxvYWQuZW50aXR5T3A7XG4gICAgICAgICAgcmV0dXJuIGVudGl0eU9wICYmIG9wcy5zb21lKG8gPT4gbyA9PT0gZW50aXR5T3ApO1xuICAgICAgICB9XG4gICAgICApO1xuICB9XG59XG5cbi8qKlxuICogU2VsZWN0IGFjdGlvbnMgY29uY2VybmluZyBvbmUgb2YgdGhlIGFsbG93ZWQgRW50aXR5IHR5cGVzXG4gKiBAcGFyYW0gYWxsb3dlZEVudGl0eU5hbWVzIEVudGl0eS10eXBlIG5hbWVzIChlLmcsICdIZXJvJykgd2hvc2UgYWN0aW9ucyBzaG91bGQgYmUgc2VsZWN0ZWRcbiAqIEV4YW1wbGU6XG4gKiBgYGBcbiAqICB0aGlzLmFjdGlvbnMucGlwZShvZkVudGl0eVR5cGUoKSwgLi4uKSAvLyBheW4gRW50aXR5QWN0aW9uIHdpdGggYSBkZWZpbmVkIGVudGl0eSB0eXBlIHByb3BlcnR5XG4gKiAgdGhpcy5hY3Rpb25zLnBpcGUob2ZFbnRpdHlUeXBlKCdIZXJvJyksIC4uLikgLy8gRW50aXR5QWN0aW9ucyBmb3IgdGhlIEhlcm8gZW50aXR5XG4gKiAgdGhpcy5hY3Rpb25zLnBpcGUob2ZFbnRpdHlUeXBlKCdIZXJvJywgJ1ZpbGxhaW4nLCAnU2lkZWtpY2snKSwgLi4uKVxuICogIHRoaXMuYWN0aW9ucy5waXBlKG9mRW50aXR5VHlwZSguLi50aGVDaG9zZW4pLCAuLi4pXG4gKiAgdGhpcy5hY3Rpb25zLnBpcGUob2ZFbnRpdHlUeXBlKHRoZUNob3NlbiksIC4uLilcbiAqIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gb2ZFbnRpdHlUeXBlPFQgZXh0ZW5kcyBFbnRpdHlBY3Rpb24+KFxuICBhbGxvd2VkRW50aXR5TmFtZXM/OiBzdHJpbmdbXVxuKTogT3BlcmF0b3JGdW5jdGlvbjxFbnRpdHlBY3Rpb24sIFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mRW50aXR5VHlwZTxUIGV4dGVuZHMgRW50aXR5QWN0aW9uPihcbiAgLi4uYWxsb3dlZEVudGl0eU5hbWVzOiBzdHJpbmdbXVxuKTogT3BlcmF0b3JGdW5jdGlvbjxFbnRpdHlBY3Rpb24sIFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mRW50aXR5VHlwZTxUIGV4dGVuZHMgRW50aXR5QWN0aW9uPihcbiAgLi4uYWxsb3dlZEVudGl0eU5hbWVzOiBhbnlbXVxuKTogT3BlcmF0b3JGdW5jdGlvbjxFbnRpdHlBY3Rpb24sIFQ+IHtcbiAgY29uc3QgbmFtZXM6IHN0cmluZ1tdID0gZmxhdHRlbkFyZ3MoYWxsb3dlZEVudGl0eU5hbWVzKTtcbiAgc3dpdGNoIChuYW1lcy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6XG4gICAgICByZXR1cm4gZmlsdGVyKFxuICAgICAgICAoYWN0aW9uOiBFbnRpdHlBY3Rpb24pOiBhY3Rpb24gaXMgVCA9PlxuICAgICAgICAgIGFjdGlvbi5wYXlsb2FkICYmIGFjdGlvbi5wYXlsb2FkLmVudGl0eU5hbWUgIT0gbnVsbFxuICAgICAgKTtcbiAgICBjYXNlIDE6XG4gICAgICBjb25zdCBuYW1lID0gbmFtZXNbMF07XG4gICAgICByZXR1cm4gZmlsdGVyKFxuICAgICAgICAoYWN0aW9uOiBFbnRpdHlBY3Rpb24pOiBhY3Rpb24gaXMgVCA9PlxuICAgICAgICAgIGFjdGlvbi5wYXlsb2FkICYmIG5hbWUgPT09IGFjdGlvbi5wYXlsb2FkLmVudGl0eU5hbWVcbiAgICAgICk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmaWx0ZXIoXG4gICAgICAgIChhY3Rpb246IEVudGl0eUFjdGlvbik6IGFjdGlvbiBpcyBUID0+IHtcbiAgICAgICAgICBjb25zdCBlbnRpdHlOYW1lID0gYWN0aW9uLnBheWxvYWQgJiYgYWN0aW9uLnBheWxvYWQuZW50aXR5TmFtZTtcbiAgICAgICAgICByZXR1cm4gISFlbnRpdHlOYW1lICYmIG5hbWVzLnNvbWUobiA9PiBuID09PSBlbnRpdHlOYW1lKTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgfVxufVxuIl19