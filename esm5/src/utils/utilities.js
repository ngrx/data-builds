var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
/**
 * @fileoverview added by tsickle
 * Generated from: src/utils/utilities.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Default function that returns the entity's primary key (pkey).
 * Assumes that the entity has an `id` pkey property.
 * Returns `undefined` if no entity or `id`.
 * Every selectId fn must return `undefined` when it cannot produce a full pkey.
 * @param {?} entity
 * @return {?}
 */
export function defaultSelectId(entity) {
    return entity == null ? undefined : entity.id;
}
/**
 * Flatten first arg if it is an array
 * Allows fn with ...rest signature to be called with an array instead of spread
 * Example:
 * ```
 * // See entity-action-operators.ts
 * const persistOps = [EntityOp.QUERY_ALL, EntityOp.ADD, ...];
 * actions.pipe(ofEntityOp(...persistOps)) // works
 * actions.pipe(ofEntityOp(persistOps)) // also works
 * ```
 *
 * @template T
 * @param {?=} args
 * @return {?}
 */
export function flattenArgs(args) {
    if (args == null) {
        return [];
    }
    if (Array.isArray(args[0])) {
        var _a = __read(args), head = _a[0], tail = _a.slice(1);
        args = __spread(head, tail);
    }
    return args;
}
/**
 * Return a function that converts an entity (or partial entity) into the `Update<T>`
 * whose `id` is the primary key and
 * `changes` is the entity (or partial entity of changes).
 * @template T
 * @param {?=} selectId
 * @return {?}
 */
export function toUpdateFactory(selectId) {
    selectId = selectId || ((/** @type {?} */ (defaultSelectId)));
    /**
     * Convert an entity (or partial entity) into the `Update<T>`
     * whose `id` is the primary key and
     * `changes` is the entity (or partial entity of changes).
     * @param selectId function that returns the entity's primary key (id)
     */
    return (/**
     * @param {?} entity
     * @return {?}
     */
    function toUpdate(entity) {
        /** @type {?} */
        var id = (/** @type {?} */ (selectId))((/** @type {?} */ (entity)));
        if (id == null) {
            throw new Error('Primary key may not be null/undefined.');
        }
        return entity && { id: id, changes: entity };
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbGl0aWVzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5ncngvZGF0YS8iLCJzb3VyY2VzIjpbInNyYy91dGlscy91dGlsaXRpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUUEsTUFBTSxVQUFVLGVBQWUsQ0FBQyxNQUFXO0lBQ3pDLE9BQU8sTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO0FBQ2hELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFhRCxNQUFNLFVBQVUsV0FBVyxDQUFJLElBQVk7SUFDekMsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO1FBQ2hCLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFDRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDcEIsSUFBQSxpQkFBc0IsRUFBckIsWUFBSSxFQUFFLGtCQUFlO1FBQzVCLElBQUksWUFBTyxJQUFJLEVBQUssSUFBSSxDQUFDLENBQUM7S0FDM0I7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7Ozs7Ozs7OztBQU9ELE1BQU0sVUFBVSxlQUFlLENBQUksUUFBd0I7SUFDekQsUUFBUSxHQUFHLFFBQVEsSUFBSSxDQUFDLG1CQUFBLGVBQWUsRUFBaUIsQ0FBQyxDQUFDO0lBQzFEOzs7OztPQUtHO0lBQ0g7Ozs7SUFBTyxTQUFTLFFBQVEsQ0FBQyxNQUFrQjs7WUFDbkMsRUFBRSxHQUFRLG1CQUFBLFFBQVEsRUFBQyxDQUFDLG1CQUFBLE1BQU0sRUFBSyxDQUFDO1FBQ3RDLElBQUksRUFBRSxJQUFJLElBQUksRUFBRTtZQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztTQUMzRDtRQUNELE9BQU8sTUFBTSxJQUFJLEVBQUUsRUFBRSxJQUFBLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDO0lBQzNDLENBQUMsRUFBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJZFNlbGVjdG9yLCBVcGRhdGUgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuXG4vKipcbiAqIERlZmF1bHQgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBlbnRpdHkncyBwcmltYXJ5IGtleSAocGtleSkuXG4gKiBBc3N1bWVzIHRoYXQgdGhlIGVudGl0eSBoYXMgYW4gYGlkYCBwa2V5IHByb3BlcnR5LlxuICogUmV0dXJucyBgdW5kZWZpbmVkYCBpZiBubyBlbnRpdHkgb3IgYGlkYC5cbiAqIEV2ZXJ5IHNlbGVjdElkIGZuIG11c3QgcmV0dXJuIGB1bmRlZmluZWRgIHdoZW4gaXQgY2Fubm90IHByb2R1Y2UgYSBmdWxsIHBrZXkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0U2VsZWN0SWQoZW50aXR5OiBhbnkpIHtcbiAgcmV0dXJuIGVudGl0eSA9PSBudWxsID8gdW5kZWZpbmVkIDogZW50aXR5LmlkO1xufVxuXG4vKipcbiAqIEZsYXR0ZW4gZmlyc3QgYXJnIGlmIGl0IGlzIGFuIGFycmF5XG4gKiBBbGxvd3MgZm4gd2l0aCAuLi5yZXN0IHNpZ25hdHVyZSB0byBiZSBjYWxsZWQgd2l0aCBhbiBhcnJheSBpbnN0ZWFkIG9mIHNwcmVhZFxuICogRXhhbXBsZTpcbiAqIGBgYFxuICogLy8gU2VlIGVudGl0eS1hY3Rpb24tb3BlcmF0b3JzLnRzXG4gKiBjb25zdCBwZXJzaXN0T3BzID0gW0VudGl0eU9wLlFVRVJZX0FMTCwgRW50aXR5T3AuQURELCAuLi5dO1xuICogYWN0aW9ucy5waXBlKG9mRW50aXR5T3AoLi4ucGVyc2lzdE9wcykpIC8vIHdvcmtzXG4gKiBhY3Rpb25zLnBpcGUob2ZFbnRpdHlPcChwZXJzaXN0T3BzKSkgLy8gYWxzbyB3b3Jrc1xuICogYGBgXG4gKiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZsYXR0ZW5BcmdzPFQ+KGFyZ3M/OiBhbnlbXSk6IFRbXSB7XG4gIGlmIChhcmdzID09IG51bGwpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJnc1swXSkpIHtcbiAgICBjb25zdCBbaGVhZCwgLi4udGFpbF0gPSBhcmdzO1xuICAgIGFyZ3MgPSBbLi4uaGVhZCwgLi4udGFpbF07XG4gIH1cbiAgcmV0dXJuIGFyZ3M7XG59XG5cbi8qKlxuICogUmV0dXJuIGEgZnVuY3Rpb24gdGhhdCBjb252ZXJ0cyBhbiBlbnRpdHkgKG9yIHBhcnRpYWwgZW50aXR5KSBpbnRvIHRoZSBgVXBkYXRlPFQ+YFxuICogd2hvc2UgYGlkYCBpcyB0aGUgcHJpbWFyeSBrZXkgYW5kXG4gKiBgY2hhbmdlc2AgaXMgdGhlIGVudGl0eSAob3IgcGFydGlhbCBlbnRpdHkgb2YgY2hhbmdlcykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b1VwZGF0ZUZhY3Rvcnk8VD4oc2VsZWN0SWQ/OiBJZFNlbGVjdG9yPFQ+KSB7XG4gIHNlbGVjdElkID0gc2VsZWN0SWQgfHwgKGRlZmF1bHRTZWxlY3RJZCBhcyBJZFNlbGVjdG9yPFQ+KTtcbiAgLyoqXG4gICAqIENvbnZlcnQgYW4gZW50aXR5IChvciBwYXJ0aWFsIGVudGl0eSkgaW50byB0aGUgYFVwZGF0ZTxUPmBcbiAgICogd2hvc2UgYGlkYCBpcyB0aGUgcHJpbWFyeSBrZXkgYW5kXG4gICAqIGBjaGFuZ2VzYCBpcyB0aGUgZW50aXR5IChvciBwYXJ0aWFsIGVudGl0eSBvZiBjaGFuZ2VzKS5cbiAgICogQHBhcmFtIHNlbGVjdElkIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgZW50aXR5J3MgcHJpbWFyeSBrZXkgKGlkKVxuICAgKi9cbiAgcmV0dXJuIGZ1bmN0aW9uIHRvVXBkYXRlKGVudGl0eTogUGFydGlhbDxUPik6IFVwZGF0ZTxUPiB7XG4gICAgY29uc3QgaWQ6IGFueSA9IHNlbGVjdElkIShlbnRpdHkgYXMgVCk7XG4gICAgaWYgKGlkID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUHJpbWFyeSBrZXkgbWF5IG5vdCBiZSBudWxsL3VuZGVmaW5lZC4nKTtcbiAgICB9XG4gICAgcmV0dXJuIGVudGl0eSAmJiB7IGlkLCBjaGFuZ2VzOiBlbnRpdHkgfTtcbiAgfTtcbn1cbiJdfQ==