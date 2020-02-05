(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/actions/entity-action-factory", ["require", "exports", "tslib", "@angular/core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@angular/core");
    let EntityActionFactory = class EntityActionFactory {
        // polymorphic create for the two signatures
        create(nameOrPayload, entityOp, data, options) {
            const payload = typeof nameOrPayload === 'string'
                ? Object.assign(Object.assign({}, (options || {})), { entityName: nameOrPayload, entityOp,
                    data })
                : nameOrPayload;
            return this.createCore(payload);
        }
        /**
         * Create an EntityAction to perform an operation (op) for a particular entity type
         * (entityName) with optional data and other optional flags
         * @param payload Defines the EntityAction and its options
         */
        createCore(payload) {
            const { entityName, entityOp, tag } = payload;
            if (!entityName) {
                throw new Error('Missing entity name for new action');
            }
            if (entityOp == null) {
                throw new Error('Missing EntityOp for new action');
            }
            const type = this.formatActionType(entityOp, tag || entityName);
            return { type, payload };
        }
        /**
         * Create an EntityAction from another EntityAction, replacing properties with those from newPayload;
         * @param from Source action that is the base for the new action
         * @param newProperties New EntityAction properties that replace the source action properties
         */
        createFromAction(from, newProperties) {
            return this.create(Object.assign(Object.assign({}, from.payload), newProperties));
        }
        formatActionType(op, tag) {
            return `[${tag}] ${op}`;
            // return `${op} [${tag}]`.toUpperCase(); // example of an alternative
        }
    };
    EntityActionFactory = tslib_1.__decorate([
        core_1.Injectable()
    ], EntityActionFactory);
    exports.EntityActionFactory = EntityActionFactory;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWFjdGlvbi1mYWN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQSx3Q0FBMkM7SUFTM0MsSUFBYSxtQkFBbUIsR0FBaEMsTUFBYSxtQkFBbUI7UUF1QjlCLDRDQUE0QztRQUM1QyxNQUFNLENBQ0osYUFBOEMsRUFDOUMsUUFBbUIsRUFDbkIsSUFBUSxFQUNSLE9BQTZCO1lBRTdCLE1BQU0sT0FBTyxHQUNYLE9BQU8sYUFBYSxLQUFLLFFBQVE7Z0JBQy9CLENBQUMsQ0FBRSxnQ0FDSSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsS0FDbEIsVUFBVSxFQUFFLGFBQWEsRUFDekIsUUFBUTtvQkFDUixJQUFJLEdBQ3NCO2dCQUM5QixDQUFDLENBQUMsYUFBYSxDQUFDO1lBQ3BCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQ7Ozs7V0FJRztRQUNPLFVBQVUsQ0FBVSxPQUErQjtZQUMzRCxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsR0FBRyxPQUFPLENBQUM7WUFDOUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDZixNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7YUFDdkQ7WUFDRCxJQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUU7Z0JBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQzthQUNwRDtZQUNELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDO1lBQ2hFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUM7UUFDM0IsQ0FBQztRQUVEOzs7O1dBSUc7UUFDSCxnQkFBZ0IsQ0FDZCxJQUFrQixFQUNsQixhQUE4QztZQUU5QyxPQUFPLElBQUksQ0FBQyxNQUFNLGlDQUFNLElBQUksQ0FBQyxPQUFPLEdBQUssYUFBYSxFQUFHLENBQUM7UUFDNUQsQ0FBQztRQUVELGdCQUFnQixDQUFDLEVBQVUsRUFBRSxHQUFXO1lBQ3RDLE9BQU8sSUFBSSxHQUFHLEtBQUssRUFBRSxFQUFFLENBQUM7WUFDeEIsc0VBQXNFO1FBQ3hFLENBQUM7S0FDRixDQUFBO0lBM0VZLG1CQUFtQjtRQUQvQixpQkFBVSxFQUFFO09BQ0EsbUJBQW1CLENBMkUvQjtJQTNFWSxrREFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEVudGl0eU9wIH0gZnJvbSAnLi9lbnRpdHktb3AnO1xuaW1wb3J0IHtcbiAgRW50aXR5QWN0aW9uLFxuICBFbnRpdHlBY3Rpb25PcHRpb25zLFxuICBFbnRpdHlBY3Rpb25QYXlsb2FkLFxufSBmcm9tICcuL2VudGl0eS1hY3Rpb24nO1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUFjdGlvbkZhY3Rvcnkge1xuICAvKipcbiAgICogQ3JlYXRlIGFuIEVudGl0eUFjdGlvbiB0byBwZXJmb3JtIGFuIG9wZXJhdGlvbiAob3ApIGZvciBhIHBhcnRpY3VsYXIgZW50aXR5IHR5cGVcbiAgICogKGVudGl0eU5hbWUpIHdpdGggb3B0aW9uYWwgZGF0YSBhbmQgb3RoZXIgb3B0aW9uYWwgZmxhZ3NcbiAgICogQHBhcmFtIGVudGl0eU5hbWUgTmFtZSBvZiB0aGUgZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGVudGl0eU9wIE9wZXJhdGlvbiB0byBwZXJmb3JtIChFbnRpdHlPcClcbiAgICogQHBhcmFtIFtkYXRhXSBkYXRhIGZvciB0aGUgb3BlcmF0aW9uXG4gICAqIEBwYXJhbSBbb3B0aW9uc10gYWRkaXRpb25hbCBvcHRpb25zXG4gICAqL1xuICBjcmVhdGU8UCA9IGFueT4oXG4gICAgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIGVudGl0eU9wOiBFbnRpdHlPcCxcbiAgICBkYXRhPzogUCxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBFbnRpdHlBY3Rpb248UD47XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiBFbnRpdHlBY3Rpb24gdG8gcGVyZm9ybSBhbiBvcGVyYXRpb24gKG9wKSBmb3IgYSBwYXJ0aWN1bGFyIGVudGl0eSB0eXBlXG4gICAqIChlbnRpdHlOYW1lKSB3aXRoIG9wdGlvbmFsIGRhdGEgYW5kIG90aGVyIG9wdGlvbmFsIGZsYWdzXG4gICAqIEBwYXJhbSBwYXlsb2FkIERlZmluZXMgdGhlIEVudGl0eUFjdGlvbiBhbmQgaXRzIG9wdGlvbnNcbiAgICovXG4gIGNyZWF0ZTxQID0gYW55PihwYXlsb2FkOiBFbnRpdHlBY3Rpb25QYXlsb2FkPFA+KTogRW50aXR5QWN0aW9uPFA+O1xuXG4gIC8vIHBvbHltb3JwaGljIGNyZWF0ZSBmb3IgdGhlIHR3byBzaWduYXR1cmVzXG4gIGNyZWF0ZTxQID0gYW55PihcbiAgICBuYW1lT3JQYXlsb2FkOiBFbnRpdHlBY3Rpb25QYXlsb2FkPFA+IHwgc3RyaW5nLFxuICAgIGVudGl0eU9wPzogRW50aXR5T3AsXG4gICAgZGF0YT86IFAsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogRW50aXR5QWN0aW9uPFA+IHtcbiAgICBjb25zdCBwYXlsb2FkOiBFbnRpdHlBY3Rpb25QYXlsb2FkPFA+ID1cbiAgICAgIHR5cGVvZiBuYW1lT3JQYXlsb2FkID09PSAnc3RyaW5nJ1xuICAgICAgICA/ICh7XG4gICAgICAgICAgICAuLi4ob3B0aW9ucyB8fCB7fSksXG4gICAgICAgICAgICBlbnRpdHlOYW1lOiBuYW1lT3JQYXlsb2FkLFxuICAgICAgICAgICAgZW50aXR5T3AsXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgIH0gYXMgRW50aXR5QWN0aW9uUGF5bG9hZDxQPilcbiAgICAgICAgOiBuYW1lT3JQYXlsb2FkO1xuICAgIHJldHVybiB0aGlzLmNyZWF0ZUNvcmUocGF5bG9hZCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIEVudGl0eUFjdGlvbiB0byBwZXJmb3JtIGFuIG9wZXJhdGlvbiAob3ApIGZvciBhIHBhcnRpY3VsYXIgZW50aXR5IHR5cGVcbiAgICogKGVudGl0eU5hbWUpIHdpdGggb3B0aW9uYWwgZGF0YSBhbmQgb3RoZXIgb3B0aW9uYWwgZmxhZ3NcbiAgICogQHBhcmFtIHBheWxvYWQgRGVmaW5lcyB0aGUgRW50aXR5QWN0aW9uIGFuZCBpdHMgb3B0aW9uc1xuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZUNvcmU8UCA9IGFueT4ocGF5bG9hZDogRW50aXR5QWN0aW9uUGF5bG9hZDxQPikge1xuICAgIGNvbnN0IHsgZW50aXR5TmFtZSwgZW50aXR5T3AsIHRhZyB9ID0gcGF5bG9hZDtcbiAgICBpZiAoIWVudGl0eU5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBlbnRpdHkgbmFtZSBmb3IgbmV3IGFjdGlvbicpO1xuICAgIH1cbiAgICBpZiAoZW50aXR5T3AgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIEVudGl0eU9wIGZvciBuZXcgYWN0aW9uJyk7XG4gICAgfVxuICAgIGNvbnN0IHR5cGUgPSB0aGlzLmZvcm1hdEFjdGlvblR5cGUoZW50aXR5T3AsIHRhZyB8fCBlbnRpdHlOYW1lKTtcbiAgICByZXR1cm4geyB0eXBlLCBwYXlsb2FkIH07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIEVudGl0eUFjdGlvbiBmcm9tIGFub3RoZXIgRW50aXR5QWN0aW9uLCByZXBsYWNpbmcgcHJvcGVydGllcyB3aXRoIHRob3NlIGZyb20gbmV3UGF5bG9hZDtcbiAgICogQHBhcmFtIGZyb20gU291cmNlIGFjdGlvbiB0aGF0IGlzIHRoZSBiYXNlIGZvciB0aGUgbmV3IGFjdGlvblxuICAgKiBAcGFyYW0gbmV3UHJvcGVydGllcyBOZXcgRW50aXR5QWN0aW9uIHByb3BlcnRpZXMgdGhhdCByZXBsYWNlIHRoZSBzb3VyY2UgYWN0aW9uIHByb3BlcnRpZXNcbiAgICovXG4gIGNyZWF0ZUZyb21BY3Rpb248UCA9IGFueT4oXG4gICAgZnJvbTogRW50aXR5QWN0aW9uLFxuICAgIG5ld1Byb3BlcnRpZXM6IFBhcnRpYWw8RW50aXR5QWN0aW9uUGF5bG9hZDxQPj5cbiAgKTogRW50aXR5QWN0aW9uPFA+IHtcbiAgICByZXR1cm4gdGhpcy5jcmVhdGUoeyAuLi5mcm9tLnBheWxvYWQsIC4uLm5ld1Byb3BlcnRpZXMgfSk7XG4gIH1cblxuICBmb3JtYXRBY3Rpb25UeXBlKG9wOiBzdHJpbmcsIHRhZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGBbJHt0YWd9XSAke29wfWA7XG4gICAgLy8gcmV0dXJuIGAke29wfSBbJHt0YWd9XWAudG9VcHBlckNhc2UoKTsgLy8gZXhhbXBsZSBvZiBhbiBhbHRlcm5hdGl2ZVxuICB9XG59XG4iXX0=