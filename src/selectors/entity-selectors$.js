(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/selectors/entity-selectors$", ["require", "exports", "tslib", "@angular/core", "@ngrx/store", "@ngrx/effects", "rxjs/operators", "@ngrx/data/src/actions/entity-op", "@ngrx/data/src/actions/entity-action-operators", "@ngrx/data/src/selectors/entity-cache-selector"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@angular/core");
    const store_1 = require("@ngrx/store");
    const effects_1 = require("@ngrx/effects");
    const operators_1 = require("rxjs/operators");
    const entity_op_1 = require("@ngrx/data/src/actions/entity-op");
    const entity_action_operators_1 = require("@ngrx/data/src/actions/entity-action-operators");
    const entity_cache_selector_1 = require("@ngrx/data/src/selectors/entity-cache-selector");
    /** Creates observable EntitySelectors$ for entity collections. */
    let EntitySelectors$Factory = class EntitySelectors$Factory {
        constructor(store, actions, selectEntityCache) {
            this.store = store;
            this.actions = actions;
            this.selectEntityCache = selectEntityCache;
            // This service applies to the cache in ngrx/store named `cacheName`
            this.entityCache$ = this.store.select(this.selectEntityCache);
            this.entityActionErrors$ = actions.pipe(operators_1.filter((ea) => ea.payload &&
                ea.payload.entityOp &&
                ea.payload.entityOp.endsWith(entity_op_1.OP_ERROR)), operators_1.shareReplay(1));
        }
        /**
         * Creates an entity collection's selectors$ observables for this factory's store.
         * `selectors$` are observable selectors of the cached entity collection.
         * @param entityName - is also the name of the collection.
         * @param selectors - selector functions for this collection.
         **/
        create(entityName, selectors) {
            const selectors$ = {
                entityName,
            };
            Object.keys(selectors).forEach(name => {
                if (name.startsWith('select')) {
                    // strip 'select' prefix from the selector fn name and append `$`
                    // Ex: 'selectEntities' => 'entities$'
                    const name$ = name[6].toLowerCase() + name.substr(7) + '$';
                    selectors$[name$] = this.store.select(selectors[name]);
                }
            });
            selectors$.entityActions$ = this.actions.pipe(entity_action_operators_1.ofEntityType(entityName));
            selectors$.errors$ = this.entityActionErrors$.pipe(entity_action_operators_1.ofEntityType(entityName));
            return selectors$;
        }
    };
    EntitySelectors$Factory = tslib_1.__decorate([
        core_1.Injectable(),
        tslib_1.__param(2, core_1.Inject(entity_cache_selector_1.ENTITY_CACHE_SELECTOR_TOKEN)),
        tslib_1.__metadata("design:paramtypes", [store_1.Store,
            effects_1.Actions, Function])
    ], EntitySelectors$Factory);
    exports.EntitySelectors$Factory = EntitySelectors$Factory;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LXNlbGVjdG9ycyQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQSx3Q0FBbUQ7SUFDbkQsdUNBQW9DO0lBQ3BDLDJDQUF3QztJQUl4Qyw4Q0FBcUQ7SUFHckQsZ0VBQWdEO0lBQ2hELDRGQUFrRTtJQUNsRSwwRkFHaUM7SUF5RGpDLGtFQUFrRTtJQUVsRSxJQUFhLHVCQUF1QixHQUFwQyxNQUFhLHVCQUF1QjtRQU9sQyxZQUNVLEtBQWlCLEVBQ2pCLE9BQThCLEVBRTlCLGlCQUFzQztZQUh0QyxVQUFLLEdBQUwsS0FBSyxDQUFZO1lBQ2pCLFlBQU8sR0FBUCxPQUFPLENBQXVCO1lBRTlCLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBcUI7WUFFOUMsb0VBQW9FO1lBQ3BFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQ3JDLGtCQUFNLENBQ0osQ0FBQyxFQUFnQixFQUFFLEVBQUUsQ0FDbkIsRUFBRSxDQUFDLE9BQU87Z0JBQ1YsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRO2dCQUNuQixFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsb0JBQVEsQ0FBQyxDQUN6QyxFQUNELHVCQUFXLENBQUMsQ0FBQyxDQUFDLENBQ2YsQ0FBQztRQUNKLENBQUM7UUFFRDs7Ozs7WUFLSTtRQUNKLE1BQU0sQ0FDSixVQUFrQixFQUNsQixTQUE2QjtZQUU3QixNQUFNLFVBQVUsR0FBNEI7Z0JBQzFDLFVBQVU7YUFDWCxDQUFDO1lBRUYsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3BDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtvQkFDN0IsaUVBQWlFO29CQUNqRSxzQ0FBc0M7b0JBQ3RDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztvQkFDM0QsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFPLFNBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2lCQUMvRDtZQUNILENBQUMsQ0FBQyxDQUFDO1lBQ0gsVUFBVSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxzQ0FBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDeEUsVUFBVSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUNoRCxzQ0FBWSxDQUFDLFVBQVUsQ0FBQyxDQUN6QixDQUFDO1lBQ0YsT0FBTyxVQUFnQixDQUFDO1FBQzFCLENBQUM7S0FDRixDQUFBO0lBdERZLHVCQUF1QjtRQURuQyxpQkFBVSxFQUFFO1FBV1IsbUJBQUEsYUFBTSxDQUFDLG1EQUEyQixDQUFDLENBQUE7aURBRnJCLGFBQUs7WUFDSCxpQkFBTztPQVRmLHVCQUF1QixDQXNEbkM7SUF0RFksMERBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdG9yZSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IEFjdGlvbnMgfSBmcm9tICdAbmdyeC9lZmZlY3RzJztcbmltcG9ydCB7IERpY3Rpb25hcnkgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIsIHNoYXJlUmVwbGF5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgT1BfRVJST1IgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBvZkVudGl0eVR5cGUgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tb3BlcmF0b3JzJztcbmltcG9ydCB7XG4gIEVOVElUWV9DQUNIRV9TRUxFQ1RPUl9UT0tFTixcbiAgRW50aXR5Q2FjaGVTZWxlY3Rvcixcbn0gZnJvbSAnLi9lbnRpdHktY2FjaGUtc2VsZWN0b3InO1xuaW1wb3J0IHsgRW50aXR5U2VsZWN0b3JzIH0gZnJvbSAnLi9lbnRpdHktc2VsZWN0b3JzJztcbmltcG9ydCB7IEVudGl0eUNhY2hlIH0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNhY2hlJztcbmltcG9ydCB7XG4gIEVudGl0eUNvbGxlY3Rpb24sXG4gIENoYW5nZVN0YXRlTWFwLFxufSBmcm9tICcuLi9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbic7XG5cbi8qKlxuICogVGhlIHNlbGVjdG9yIG9ic2VydmFibGUgZnVuY3Rpb25zIGZvciBlbnRpdHkgY29sbGVjdGlvbiBtZW1iZXJzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eVNlbGVjdG9ycyQ8VD4ge1xuICAvKiogTmFtZSBvZiB0aGUgZW50aXR5IGNvbGxlY3Rpb24gZm9yIHRoZXNlIHNlbGVjdG9ycyQgKi9cbiAgcmVhZG9ubHkgZW50aXR5TmFtZTogc3RyaW5nO1xuXG4gIC8qKiBOYW1lcyBmcm9tIGN1c3RvbSBzZWxlY3RvcnMgZnJvbSBhZGRpdGlvbmFsQ29sbGVjdGlvblN0YXRlIGZpdHMgaGVyZSwgJ2FueScgdG8gYXZvaWQgY29uZmxpY3Qgd2l0aCBlbnRpdHlOYW1lICovXG4gIHJlYWRvbmx5IFtuYW1lOiBzdHJpbmddOiBPYnNlcnZhYmxlPGFueT4gfCBTdG9yZTxhbnk+IHwgYW55O1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIHRoZSBjb2xsZWN0aW9uIGFzIGEgd2hvbGUgKi9cbiAgcmVhZG9ubHkgY29sbGVjdGlvbiQ6IE9ic2VydmFibGU8RW50aXR5Q29sbGVjdGlvbj4gfCBTdG9yZTxFbnRpdHlDb2xsZWN0aW9uPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBjb3VudCBvZiBlbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24uICovXG4gIHJlYWRvbmx5IGNvdW50JDogT2JzZXJ2YWJsZTxudW1iZXI+IHwgU3RvcmU8bnVtYmVyPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBhbGwgZW50aXRpZXMgaW4gdGhlIGNhY2hlZCBjb2xsZWN0aW9uLiAqL1xuICByZWFkb25seSBlbnRpdGllcyQ6IE9ic2VydmFibGU8VFtdPiB8IFN0b3JlPFRbXT47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgYWN0aW9ucyByZWxhdGVkIHRvIHRoaXMgZW50aXR5IHR5cGUuICovXG4gIHJlYWRvbmx5IGVudGl0eUFjdGlvbnMkOiBPYnNlcnZhYmxlPEVudGl0eUFjdGlvbj47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgdGhlIG1hcCBvZiBlbnRpdHkga2V5cyB0byBlbnRpdGllcyAqL1xuICByZWFkb25seSBlbnRpdHlNYXAkOiBPYnNlcnZhYmxlPERpY3Rpb25hcnk8VD4+IHwgU3RvcmU8RGljdGlvbmFyeTxUPj47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgZXJyb3IgYWN0aW9ucyByZWxhdGVkIHRvIHRoaXMgZW50aXR5IHR5cGUuICovXG4gIHJlYWRvbmx5IGVycm9ycyQ6IE9ic2VydmFibGU8RW50aXR5QWN0aW9uPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiB0aGUgZmlsdGVyIHBhdHRlcm4gYXBwbGllZCBieSB0aGUgZW50aXR5IGNvbGxlY3Rpb24ncyBmaWx0ZXIgZnVuY3Rpb24gKi9cbiAgcmVhZG9ubHkgZmlsdGVyJDogT2JzZXJ2YWJsZTxzdHJpbmc+IHwgU3RvcmU8c3RyaW5nPjtcblxuICAvKiogT2JzZXJ2YWJsZSBvZiBlbnRpdGllcyBpbiB0aGUgY2FjaGVkIGNvbGxlY3Rpb24gdGhhdCBwYXNzIHRoZSBmaWx0ZXIgZnVuY3Rpb24gKi9cbiAgcmVhZG9ubHkgZmlsdGVyZWRFbnRpdGllcyQ6IE9ic2VydmFibGU8VFtdPiB8IFN0b3JlPFRbXT47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgdGhlIGtleXMgb2YgdGhlIGNhY2hlZCBjb2xsZWN0aW9uLCBpbiB0aGUgY29sbGVjdGlvbidzIG5hdGl2ZSBzb3J0IG9yZGVyICovXG4gIHJlYWRvbmx5IGtleXMkOiBPYnNlcnZhYmxlPHN0cmluZ1tdIHwgbnVtYmVyW10+IHwgU3RvcmU8c3RyaW5nW10gfCBudW1iZXJbXT47XG5cbiAgLyoqIE9ic2VydmFibGUgdHJ1ZSB3aGVuIHRoZSBjb2xsZWN0aW9uIGhhcyBiZWVuIGxvYWRlZCAqL1xuICByZWFkb25seSBsb2FkZWQkOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHwgU3RvcmU8Ym9vbGVhbj47XG5cbiAgLyoqIE9ic2VydmFibGUgdHJ1ZSB3aGVuIGEgbXVsdGktZW50aXR5IHF1ZXJ5IGNvbW1hbmQgaXMgaW4gcHJvZ3Jlc3MuICovXG4gIHJlYWRvbmx5IGxvYWRpbmckOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHwgU3RvcmU8Ym9vbGVhbj47XG5cbiAgLyoqIENoYW5nZVN0YXRlIChpbmNsdWRpbmcgb3JpZ2luYWwgdmFsdWVzKSBvZiBlbnRpdGllcyB3aXRoIHVuc2F2ZWQgY2hhbmdlcyAqL1xuICByZWFkb25seSBjaGFuZ2VTdGF0ZSQ6XG4gICAgfCBPYnNlcnZhYmxlPENoYW5nZVN0YXRlTWFwPFQ+PlxuICAgIHwgU3RvcmU8Q2hhbmdlU3RhdGVNYXA8VD4+O1xufVxuXG4vKiogQ3JlYXRlcyBvYnNlcnZhYmxlIEVudGl0eVNlbGVjdG9ycyQgZm9yIGVudGl0eSBjb2xsZWN0aW9ucy4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlTZWxlY3RvcnMkRmFjdG9yeSB7XG4gIC8qKiBPYnNlcnZhYmxlIG9mIHRoZSBFbnRpdHlDYWNoZSAqL1xuICBlbnRpdHlDYWNoZSQ6IE9ic2VydmFibGU8RW50aXR5Q2FjaGU+O1xuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIGVycm9yIEVudGl0eUFjdGlvbnMgKGUuZy4gUVVFUllfQUxMX0VSUk9SKSBmb3IgYWxsIGVudGl0eSB0eXBlcyAqL1xuICBlbnRpdHlBY3Rpb25FcnJvcnMkOiBPYnNlcnZhYmxlPEVudGl0eUFjdGlvbj47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8YW55PixcbiAgICBwcml2YXRlIGFjdGlvbnM6IEFjdGlvbnM8RW50aXR5QWN0aW9uPixcbiAgICBASW5qZWN0KEVOVElUWV9DQUNIRV9TRUxFQ1RPUl9UT0tFTilcbiAgICBwcml2YXRlIHNlbGVjdEVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZVNlbGVjdG9yXG4gICkge1xuICAgIC8vIFRoaXMgc2VydmljZSBhcHBsaWVzIHRvIHRoZSBjYWNoZSBpbiBuZ3J4L3N0b3JlIG5hbWVkIGBjYWNoZU5hbWVgXG4gICAgdGhpcy5lbnRpdHlDYWNoZSQgPSB0aGlzLnN0b3JlLnNlbGVjdCh0aGlzLnNlbGVjdEVudGl0eUNhY2hlKTtcbiAgICB0aGlzLmVudGl0eUFjdGlvbkVycm9ycyQgPSBhY3Rpb25zLnBpcGUoXG4gICAgICBmaWx0ZXIoXG4gICAgICAgIChlYTogRW50aXR5QWN0aW9uKSA9PlxuICAgICAgICAgIGVhLnBheWxvYWQgJiZcbiAgICAgICAgICBlYS5wYXlsb2FkLmVudGl0eU9wICYmXG4gICAgICAgICAgZWEucGF5bG9hZC5lbnRpdHlPcC5lbmRzV2l0aChPUF9FUlJPUilcbiAgICAgICksXG4gICAgICBzaGFyZVJlcGxheSgxKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBlbnRpdHkgY29sbGVjdGlvbidzIHNlbGVjdG9ycyQgb2JzZXJ2YWJsZXMgZm9yIHRoaXMgZmFjdG9yeSdzIHN0b3JlLlxuICAgKiBgc2VsZWN0b3JzJGAgYXJlIG9ic2VydmFibGUgc2VsZWN0b3JzIG9mIHRoZSBjYWNoZWQgZW50aXR5IGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIC0gaXMgYWxzbyB0aGUgbmFtZSBvZiB0aGUgY29sbGVjdGlvbi5cbiAgICogQHBhcmFtIHNlbGVjdG9ycyAtIHNlbGVjdG9yIGZ1bmN0aW9ucyBmb3IgdGhpcyBjb2xsZWN0aW9uLlxuICAgKiovXG4gIGNyZWF0ZTxULCBTJCBleHRlbmRzIEVudGl0eVNlbGVjdG9ycyQ8VD4gPSBFbnRpdHlTZWxlY3RvcnMkPFQ+PihcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgc2VsZWN0b3JzOiBFbnRpdHlTZWxlY3RvcnM8VD5cbiAgKTogUyQge1xuICAgIGNvbnN0IHNlbGVjdG9ycyQ6IHsgW3Byb3A6IHN0cmluZ106IGFueSB9ID0ge1xuICAgICAgZW50aXR5TmFtZSxcbiAgICB9O1xuXG4gICAgT2JqZWN0LmtleXMoc2VsZWN0b3JzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgaWYgKG5hbWUuc3RhcnRzV2l0aCgnc2VsZWN0JykpIHtcbiAgICAgICAgLy8gc3RyaXAgJ3NlbGVjdCcgcHJlZml4IGZyb20gdGhlIHNlbGVjdG9yIGZuIG5hbWUgYW5kIGFwcGVuZCBgJGBcbiAgICAgICAgLy8gRXg6ICdzZWxlY3RFbnRpdGllcycgPT4gJ2VudGl0aWVzJCdcbiAgICAgICAgY29uc3QgbmFtZSQgPSBuYW1lWzZdLnRvTG93ZXJDYXNlKCkgKyBuYW1lLnN1YnN0cig3KSArICckJztcbiAgICAgICAgc2VsZWN0b3JzJFtuYW1lJF0gPSB0aGlzLnN0b3JlLnNlbGVjdCgoPGFueT5zZWxlY3RvcnMpW25hbWVdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzZWxlY3RvcnMkLmVudGl0eUFjdGlvbnMkID0gdGhpcy5hY3Rpb25zLnBpcGUob2ZFbnRpdHlUeXBlKGVudGl0eU5hbWUpKTtcbiAgICBzZWxlY3RvcnMkLmVycm9ycyQgPSB0aGlzLmVudGl0eUFjdGlvbkVycm9ycyQucGlwZShcbiAgICAgIG9mRW50aXR5VHlwZShlbnRpdHlOYW1lKVxuICAgICk7XG4gICAgcmV0dXJuIHNlbGVjdG9ycyQgYXMgUyQ7XG4gIH1cbn1cbiJdfQ==