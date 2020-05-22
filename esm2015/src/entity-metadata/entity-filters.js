/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/entity-metadata/entity-filters.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Creates an {EntityFilterFn} that matches RegExp or RegExp string pattern
 * anywhere in any of the given props of an entity.
 * If pattern is a string, spaces are significant and ignores case.
 * @template T
 * @param {?=} props
 * @return {?}
 */
export function PropsFilterFnFactory(props = []) {
    if (props.length === 0) {
        // No properties -> nothing could match -> return unfiltered
        return (/**
         * @param {?} entities
         * @param {?} pattern
         * @return {?}
         */
        (entities, pattern) => entities);
    }
    return (/**
     * @param {?} entities
     * @param {?} pattern
     * @return {?}
     */
    (entities, pattern) => {
        if (!entities) {
            return [];
        }
        /** @type {?} */
        const regExp = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
        if (regExp) {
            /** @type {?} */
            const predicate = (/**
             * @param {?} e
             * @return {?}
             */
            (e) => props.some((/**
             * @param {?} prop
             * @return {?}
             */
            prop => regExp.test(e[prop]))));
            return entities.filter(predicate);
        }
        return entities;
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWZpbHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktZmlsdGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBWUEsTUFBTSxVQUFVLG9CQUFvQixDQUNsQyxRQUFxQixFQUFFO0lBRXZCLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDdEIsNERBQTREO1FBQzVEOzs7OztRQUFPLENBQUMsUUFBYSxFQUFFLE9BQWUsRUFBRSxFQUFFLENBQUMsUUFBUSxFQUFDO0tBQ3JEO0lBRUQ7Ozs7O0lBQU8sQ0FBQyxRQUFhLEVBQUUsT0FBd0IsRUFBRSxFQUFFO1FBQ2pELElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDYixPQUFPLEVBQUUsQ0FBQztTQUNYOztjQUVLLE1BQU0sR0FDVixPQUFPLE9BQU8sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTztRQUNsRSxJQUFJLE1BQU0sRUFBRTs7a0JBQ0osU0FBUzs7OztZQUFHLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSTs7OztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFBO1lBQ3RFLE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNuQztRQUNELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUMsRUFBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEZpbHRlcnMgdGhlIGBlbnRpdGllc2AgYXJyYXkgYXJndW1lbnQgYW5kIHJldHVybnMgdGhlIG9yaWdpbmFsIGBlbnRpdGllc2AsXG4gKiBvciBhIG5ldyBmaWx0ZXJlZCBhcnJheSBvZiBlbnRpdGllcy5cbiAqIE5FVkVSIG11dGF0ZSB0aGUgb3JpZ2luYWwgYGVudGl0aWVzYCBhcnJheSBpdHNlbGYuXG4gKiovXG5leHBvcnQgdHlwZSBFbnRpdHlGaWx0ZXJGbjxUPiA9IChlbnRpdGllczogVFtdLCBwYXR0ZXJuPzogYW55KSA9PiBUW107XG5cbi8qKlxuICogQ3JlYXRlcyBhbiB7RW50aXR5RmlsdGVyRm59IHRoYXQgbWF0Y2hlcyBSZWdFeHAgb3IgUmVnRXhwIHN0cmluZyBwYXR0ZXJuXG4gKiBhbnl3aGVyZSBpbiBhbnkgb2YgdGhlIGdpdmVuIHByb3BzIG9mIGFuIGVudGl0eS5cbiAqIElmIHBhdHRlcm4gaXMgYSBzdHJpbmcsIHNwYWNlcyBhcmUgc2lnbmlmaWNhbnQgYW5kIGlnbm9yZXMgY2FzZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFByb3BzRmlsdGVyRm5GYWN0b3J5PFQgPSBhbnk+KFxuICBwcm9wczogKGtleW9mIFQpW10gPSBbXVxuKTogRW50aXR5RmlsdGVyRm48VD4ge1xuICBpZiAocHJvcHMubGVuZ3RoID09PSAwKSB7XG4gICAgLy8gTm8gcHJvcGVydGllcyAtPiBub3RoaW5nIGNvdWxkIG1hdGNoIC0+IHJldHVybiB1bmZpbHRlcmVkXG4gICAgcmV0dXJuIChlbnRpdGllczogVFtdLCBwYXR0ZXJuOiBzdHJpbmcpID0+IGVudGl0aWVzO1xuICB9XG5cbiAgcmV0dXJuIChlbnRpdGllczogVFtdLCBwYXR0ZXJuOiBzdHJpbmcgfCBSZWdFeHApID0+IHtcbiAgICBpZiAoIWVudGl0aWVzKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgcmVnRXhwID1cbiAgICAgIHR5cGVvZiBwYXR0ZXJuID09PSAnc3RyaW5nJyA/IG5ldyBSZWdFeHAocGF0dGVybiwgJ2knKSA6IHBhdHRlcm47XG4gICAgaWYgKHJlZ0V4cCkge1xuICAgICAgY29uc3QgcHJlZGljYXRlID0gKGU6IGFueSkgPT4gcHJvcHMuc29tZShwcm9wID0+IHJlZ0V4cC50ZXN0KGVbcHJvcF0pKTtcbiAgICAgIHJldHVybiBlbnRpdGllcy5maWx0ZXIocHJlZGljYXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIGVudGl0aWVzO1xuICB9O1xufVxuIl19