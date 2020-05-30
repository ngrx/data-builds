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
//# sourceMappingURL=utilities.js.map