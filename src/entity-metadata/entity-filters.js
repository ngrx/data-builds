(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/entity-metadata/entity-filters", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Creates an {EntityFilterFn} that matches RegExp or RegExp string pattern
     * anywhere in any of the given props of an entity.
     * If pattern is a string, spaces are significant and ignores case.
     */
    function PropsFilterFnFactory(props = []) {
        if (props.length === 0) {
            // No properties -> nothing could match -> return unfiltered
            return (entities, pattern) => entities;
        }
        return (entities, pattern) => {
            if (!entities) {
                return [];
            }
            const regExp = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
            if (regExp) {
                const predicate = (e) => props.some(prop => regExp.test(e[prop]));
                return entities.filter(predicate);
            }
            return entities;
        };
    }
    exports.PropsFilterFnFactory = PropsFilterFnFactory;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWZpbHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktZmlsdGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQU9BOzs7O09BSUc7SUFDSCxTQUFnQixvQkFBb0IsQ0FDbEMsUUFBcUIsRUFBRTtRQUV2QixJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3RCLDREQUE0RDtZQUM1RCxPQUFPLENBQUMsUUFBYSxFQUFFLE9BQWUsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDO1NBQ3JEO1FBRUQsT0FBTyxDQUFDLFFBQWEsRUFBRSxPQUF3QixFQUFFLEVBQUU7WUFDakQsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDYixPQUFPLEVBQUUsQ0FBQzthQUNYO1lBRUQsTUFBTSxNQUFNLEdBQ1YsT0FBTyxPQUFPLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNuRSxJQUFJLE1BQU0sRUFBRTtnQkFDVixNQUFNLFNBQVMsR0FBRyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkUsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ25DO1lBQ0QsT0FBTyxRQUFRLENBQUM7UUFDbEIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQXJCRCxvREFxQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEZpbHRlcnMgdGhlIGBlbnRpdGllc2AgYXJyYXkgYXJndW1lbnQgYW5kIHJldHVybnMgdGhlIG9yaWdpbmFsIGBlbnRpdGllc2AsXG4gKiBvciBhIG5ldyBmaWx0ZXJlZCBhcnJheSBvZiBlbnRpdGllcy5cbiAqIE5FVkVSIG11dGF0ZSB0aGUgb3JpZ2luYWwgYGVudGl0aWVzYCBhcnJheSBpdHNlbGYuXG4gKiovXG5leHBvcnQgdHlwZSBFbnRpdHlGaWx0ZXJGbjxUPiA9IChlbnRpdGllczogVFtdLCBwYXR0ZXJuPzogYW55KSA9PiBUW107XG5cbi8qKlxuICogQ3JlYXRlcyBhbiB7RW50aXR5RmlsdGVyRm59IHRoYXQgbWF0Y2hlcyBSZWdFeHAgb3IgUmVnRXhwIHN0cmluZyBwYXR0ZXJuXG4gKiBhbnl3aGVyZSBpbiBhbnkgb2YgdGhlIGdpdmVuIHByb3BzIG9mIGFuIGVudGl0eS5cbiAqIElmIHBhdHRlcm4gaXMgYSBzdHJpbmcsIHNwYWNlcyBhcmUgc2lnbmlmaWNhbnQgYW5kIGlnbm9yZXMgY2FzZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFByb3BzRmlsdGVyRm5GYWN0b3J5PFQgPSBhbnk+KFxuICBwcm9wczogKGtleW9mIFQpW10gPSBbXVxuKTogRW50aXR5RmlsdGVyRm48VD4ge1xuICBpZiAocHJvcHMubGVuZ3RoID09PSAwKSB7XG4gICAgLy8gTm8gcHJvcGVydGllcyAtPiBub3RoaW5nIGNvdWxkIG1hdGNoIC0+IHJldHVybiB1bmZpbHRlcmVkXG4gICAgcmV0dXJuIChlbnRpdGllczogVFtdLCBwYXR0ZXJuOiBzdHJpbmcpID0+IGVudGl0aWVzO1xuICB9XG5cbiAgcmV0dXJuIChlbnRpdGllczogVFtdLCBwYXR0ZXJuOiBzdHJpbmcgfCBSZWdFeHApID0+IHtcbiAgICBpZiAoIWVudGl0aWVzKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgcmVnRXhwID1cbiAgICAgIHR5cGVvZiBwYXR0ZXJuID09PSAnc3RyaW5nJyA/IG5ldyBSZWdFeHAocGF0dGVybiwgJ2knKSA6IHBhdHRlcm47XG4gICAgaWYgKHJlZ0V4cCkge1xuICAgICAgY29uc3QgcHJlZGljYXRlID0gKGU6IGFueSkgPT4gcHJvcHMuc29tZShwcm9wID0+IHJlZ0V4cC50ZXN0KGVbcHJvcF0pKTtcbiAgICAgIHJldHVybiBlbnRpdGllcy5maWx0ZXIocHJlZGljYXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIGVudGl0aWVzO1xuICB9O1xufVxuIl19