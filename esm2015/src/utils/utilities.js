/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
        const [head, ...tail] = args;
        args = [...head, ...tail];
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
        const id = (/** @type {?} */ (selectId))((/** @type {?} */ (entity)));
        if (id == null) {
            throw new Error('Primary key may not be null/undefined.');
        }
        return entity && { id, changes: entity };
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbGl0aWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy91dGlscy91dGlsaXRpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsTUFBTSxVQUFVLGVBQWUsQ0FBQyxNQUFXO0lBQ3pDLE9BQU8sTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO0FBQ2hELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFhRCxNQUFNLFVBQVUsV0FBVyxDQUFJLElBQVk7SUFDekMsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO1FBQ2hCLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFDRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Y0FDcEIsQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJO1FBQzVCLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7S0FDM0I7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7Ozs7Ozs7OztBQU9ELE1BQU0sVUFBVSxlQUFlLENBQUksUUFBd0I7SUFDekQsUUFBUSxHQUFHLFFBQVEsSUFBSSxDQUFDLG1CQUFBLGVBQWUsRUFBaUIsQ0FBQyxDQUFDO0lBQzFEOzs7OztPQUtHO0lBQ0g7Ozs7SUFBTyxTQUFTLFFBQVEsQ0FBQyxNQUFrQjs7Y0FDbkMsRUFBRSxHQUFRLG1CQUFBLFFBQVEsRUFBQyxDQUFDLG1CQUFBLE1BQU0sRUFBSyxDQUFDO1FBQ3RDLElBQUksRUFBRSxJQUFJLElBQUksRUFBRTtZQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztTQUMzRDtRQUNELE9BQU8sTUFBTSxJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQztJQUMzQyxDQUFDLEVBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSWRTZWxlY3RvciwgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuLyoqXG4gKiBEZWZhdWx0IGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgZW50aXR5J3MgcHJpbWFyeSBrZXkgKHBrZXkpLlxuICogQXNzdW1lcyB0aGF0IHRoZSBlbnRpdHkgaGFzIGFuIGBpZGAgcGtleSBwcm9wZXJ0eS5cbiAqIFJldHVybnMgYHVuZGVmaW5lZGAgaWYgbm8gZW50aXR5IG9yIGBpZGAuXG4gKiBFdmVyeSBzZWxlY3RJZCBmbiBtdXN0IHJldHVybiBgdW5kZWZpbmVkYCB3aGVuIGl0IGNhbm5vdCBwcm9kdWNlIGEgZnVsbCBwa2V5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdFNlbGVjdElkKGVudGl0eTogYW55KSB7XG4gIHJldHVybiBlbnRpdHkgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IGVudGl0eS5pZDtcbn1cblxuLyoqXG4gKiBGbGF0dGVuIGZpcnN0IGFyZyBpZiBpdCBpcyBhbiBhcnJheVxuICogQWxsb3dzIGZuIHdpdGggLi4ucmVzdCBzaWduYXR1cmUgdG8gYmUgY2FsbGVkIHdpdGggYW4gYXJyYXkgaW5zdGVhZCBvZiBzcHJlYWRcbiAqIEV4YW1wbGU6XG4gKiBgYGBcbiAqIC8vIFNlZSBlbnRpdHktYWN0aW9uLW9wZXJhdG9ycy50c1xuICogY29uc3QgcGVyc2lzdE9wcyA9IFtFbnRpdHlPcC5RVUVSWV9BTEwsIEVudGl0eU9wLkFERCwgLi4uXTtcbiAqIGFjdGlvbnMucGlwZShvZkVudGl0eU9wKC4uLnBlcnNpc3RPcHMpKSAvLyB3b3Jrc1xuICogYWN0aW9ucy5waXBlKG9mRW50aXR5T3AocGVyc2lzdE9wcykpIC8vIGFsc28gd29ya3NcbiAqIGBgYFxuICogKi9cbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuQXJnczxUPihhcmdzPzogYW55W10pOiBUW10ge1xuICBpZiAoYXJncyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KGFyZ3NbMF0pKSB7XG4gICAgY29uc3QgW2hlYWQsIC4uLnRhaWxdID0gYXJncztcbiAgICBhcmdzID0gWy4uLmhlYWQsIC4uLnRhaWxdO1xuICB9XG4gIHJldHVybiBhcmdzO1xufVxuXG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgY29udmVydHMgYW4gZW50aXR5IChvciBwYXJ0aWFsIGVudGl0eSkgaW50byB0aGUgYFVwZGF0ZTxUPmBcbiAqIHdob3NlIGBpZGAgaXMgdGhlIHByaW1hcnkga2V5IGFuZFxuICogYGNoYW5nZXNgIGlzIHRoZSBlbnRpdHkgKG9yIHBhcnRpYWwgZW50aXR5IG9mIGNoYW5nZXMpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9VcGRhdGVGYWN0b3J5PFQ+KHNlbGVjdElkPzogSWRTZWxlY3RvcjxUPikge1xuICBzZWxlY3RJZCA9IHNlbGVjdElkIHx8IChkZWZhdWx0U2VsZWN0SWQgYXMgSWRTZWxlY3RvcjxUPik7XG4gIC8qKlxuICAgKiBDb252ZXJ0IGFuIGVudGl0eSAob3IgcGFydGlhbCBlbnRpdHkpIGludG8gdGhlIGBVcGRhdGU8VD5gXG4gICAqIHdob3NlIGBpZGAgaXMgdGhlIHByaW1hcnkga2V5IGFuZFxuICAgKiBgY2hhbmdlc2AgaXMgdGhlIGVudGl0eSAob3IgcGFydGlhbCBlbnRpdHkgb2YgY2hhbmdlcykuXG4gICAqIEBwYXJhbSBzZWxlY3RJZCBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGVudGl0eSdzIHByaW1hcnkga2V5IChpZClcbiAgICovXG4gIHJldHVybiBmdW5jdGlvbiB0b1VwZGF0ZShlbnRpdHk6IFBhcnRpYWw8VD4pOiBVcGRhdGU8VD4ge1xuICAgIGNvbnN0IGlkOiBhbnkgPSBzZWxlY3RJZCEoZW50aXR5IGFzIFQpO1xuICAgIGlmIChpZCA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ByaW1hcnkga2V5IG1heSBub3QgYmUgbnVsbC91bmRlZmluZWQuJyk7XG4gICAgfVxuICAgIHJldHVybiBlbnRpdHkgJiYgeyBpZCwgY2hhbmdlczogZW50aXR5IH07XG4gIH07XG59XG4iXX0=