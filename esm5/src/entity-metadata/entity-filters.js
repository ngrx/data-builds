/**
 * @fileoverview added by tsickle
 * Generated from: src/entity-metadata/entity-filters.ts
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
export function PropsFilterFnFactory(props) {
    if (props === void 0) { props = []; }
    if (props.length === 0) {
        // No properties -> nothing could match -> return unfiltered
        return (/**
         * @param {?} entities
         * @param {?} pattern
         * @return {?}
         */
        function (entities, pattern) { return entities; });
    }
    return (/**
     * @param {?} entities
     * @param {?} pattern
     * @return {?}
     */
    function (entities, pattern) {
        if (!entities) {
            return [];
        }
        /** @type {?} */
        var regExp = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
        if (regExp) {
            /** @type {?} */
            var predicate = (/**
             * @param {?} e
             * @return {?}
             */
            function (e) { return props.some((/**
             * @param {?} prop
             * @return {?}
             */
            function (prop) { return regExp.test(e[prop]); })); });
            return entities.filter(predicate);
        }
        return entities;
    });
}
//# sourceMappingURL=entity-filters.js.map