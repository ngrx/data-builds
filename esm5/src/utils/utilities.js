import { __read, __spread } from "tslib";
/**
 * Default function that returns the entity's primary key (pkey).
 * Assumes that the entity has an `id` pkey property.
 * Returns `undefined` if no entity or `id`.
 * Every selectId fn must return `undefined` when it cannot produce a full pkey.
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
 * */
export function flattenArgs(args) {
    if (args == null) {
        return [];
    }
    if (Array.isArray(args[0])) {
        var _a = __read(args), head_1 = _a[0], tail_1 = _a.slice(1);
        args = __spread(head_1, tail_1);
    }
    return args;
}
/**
 * Return a function that converts an entity (or partial entity) into the `Update<T>`
 * whose `id` is the primary key and
 * `changes` is the entity (or partial entity of changes).
 */
export function toUpdateFactory(selectId) {
    selectId = selectId || defaultSelectId;
    /**
     * Convert an entity (or partial entity) into the `Update<T>`
     * whose `id` is the primary key and
     * `changes` is the entity (or partial entity of changes).
     * @param selectId function that returns the entity's primary key (id)
     */
    return function toUpdate(entity) {
        var id = selectId(entity);
        if (id == null) {
            throw new Error('Primary key may not be null/undefined.');
        }
        return entity && { id: id, changes: entity };
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbGl0aWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy91dGlscy91dGlsaXRpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLGVBQWUsQ0FBQyxNQUFXO0lBQ3pDLE9BQU8sTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO0FBQ2hELENBQUM7QUFFRDs7Ozs7Ozs7OztLQVVLO0FBQ0wsTUFBTSxVQUFVLFdBQVcsQ0FBSSxJQUFZO0lBQ3pDLElBQUksSUFBSSxJQUFJLElBQUksRUFBRTtRQUNoQixPQUFPLEVBQUUsQ0FBQztLQUNYO0lBQ0QsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ3BCLElBQUEsaUJBQXNCLEVBQXJCLGNBQUksRUFBRSxvQkFBZSxDQUFDO1FBQzdCLElBQUksWUFBTyxNQUFJLEVBQUssTUFBSSxDQUFDLENBQUM7S0FDM0I7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLGVBQWUsQ0FBSSxRQUF3QjtJQUN6RCxRQUFRLEdBQUcsUUFBUSxJQUFLLGVBQWlDLENBQUM7SUFDMUQ7Ozs7O09BS0c7SUFDSCxPQUFPLFNBQVMsUUFBUSxDQUFDLE1BQWtCO1FBQ3pDLElBQU0sRUFBRSxHQUFRLFFBQVMsQ0FBQyxNQUFXLENBQUMsQ0FBQztRQUN2QyxJQUFJLEVBQUUsSUFBSSxJQUFJLEVBQUU7WUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7U0FDM0Q7UUFDRCxPQUFPLE1BQU0sSUFBSSxFQUFFLEVBQUUsSUFBQSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQztJQUMzQyxDQUFDLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSWRTZWxlY3RvciwgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuLyoqXG4gKiBEZWZhdWx0IGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgZW50aXR5J3MgcHJpbWFyeSBrZXkgKHBrZXkpLlxuICogQXNzdW1lcyB0aGF0IHRoZSBlbnRpdHkgaGFzIGFuIGBpZGAgcGtleSBwcm9wZXJ0eS5cbiAqIFJldHVybnMgYHVuZGVmaW5lZGAgaWYgbm8gZW50aXR5IG9yIGBpZGAuXG4gKiBFdmVyeSBzZWxlY3RJZCBmbiBtdXN0IHJldHVybiBgdW5kZWZpbmVkYCB3aGVuIGl0IGNhbm5vdCBwcm9kdWNlIGEgZnVsbCBwa2V5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdFNlbGVjdElkKGVudGl0eTogYW55KSB7XG4gIHJldHVybiBlbnRpdHkgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IGVudGl0eS5pZDtcbn1cblxuLyoqXG4gKiBGbGF0dGVuIGZpcnN0IGFyZyBpZiBpdCBpcyBhbiBhcnJheVxuICogQWxsb3dzIGZuIHdpdGggLi4ucmVzdCBzaWduYXR1cmUgdG8gYmUgY2FsbGVkIHdpdGggYW4gYXJyYXkgaW5zdGVhZCBvZiBzcHJlYWRcbiAqIEV4YW1wbGU6XG4gKiBgYGBcbiAqIC8vIFNlZSBlbnRpdHktYWN0aW9uLW9wZXJhdG9ycy50c1xuICogY29uc3QgcGVyc2lzdE9wcyA9IFtFbnRpdHlPcC5RVUVSWV9BTEwsIEVudGl0eU9wLkFERCwgLi4uXTtcbiAqIGFjdGlvbnMucGlwZShvZkVudGl0eU9wKC4uLnBlcnNpc3RPcHMpKSAvLyB3b3Jrc1xuICogYWN0aW9ucy5waXBlKG9mRW50aXR5T3AocGVyc2lzdE9wcykpIC8vIGFsc28gd29ya3NcbiAqIGBgYFxuICogKi9cbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuQXJnczxUPihhcmdzPzogYW55W10pOiBUW10ge1xuICBpZiAoYXJncyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KGFyZ3NbMF0pKSB7XG4gICAgY29uc3QgW2hlYWQsIC4uLnRhaWxdID0gYXJncztcbiAgICBhcmdzID0gWy4uLmhlYWQsIC4uLnRhaWxdO1xuICB9XG4gIHJldHVybiBhcmdzO1xufVxuXG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgY29udmVydHMgYW4gZW50aXR5IChvciBwYXJ0aWFsIGVudGl0eSkgaW50byB0aGUgYFVwZGF0ZTxUPmBcbiAqIHdob3NlIGBpZGAgaXMgdGhlIHByaW1hcnkga2V5IGFuZFxuICogYGNoYW5nZXNgIGlzIHRoZSBlbnRpdHkgKG9yIHBhcnRpYWwgZW50aXR5IG9mIGNoYW5nZXMpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9VcGRhdGVGYWN0b3J5PFQ+KHNlbGVjdElkPzogSWRTZWxlY3RvcjxUPikge1xuICBzZWxlY3RJZCA9IHNlbGVjdElkIHx8IChkZWZhdWx0U2VsZWN0SWQgYXMgSWRTZWxlY3RvcjxUPik7XG4gIC8qKlxuICAgKiBDb252ZXJ0IGFuIGVudGl0eSAob3IgcGFydGlhbCBlbnRpdHkpIGludG8gdGhlIGBVcGRhdGU8VD5gXG4gICAqIHdob3NlIGBpZGAgaXMgdGhlIHByaW1hcnkga2V5IGFuZFxuICAgKiBgY2hhbmdlc2AgaXMgdGhlIGVudGl0eSAob3IgcGFydGlhbCBlbnRpdHkgb2YgY2hhbmdlcykuXG4gICAqIEBwYXJhbSBzZWxlY3RJZCBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGVudGl0eSdzIHByaW1hcnkga2V5IChpZClcbiAgICovXG4gIHJldHVybiBmdW5jdGlvbiB0b1VwZGF0ZShlbnRpdHk6IFBhcnRpYWw8VD4pOiBVcGRhdGU8VD4ge1xuICAgIGNvbnN0IGlkOiBhbnkgPSBzZWxlY3RJZCEoZW50aXR5IGFzIFQpO1xuICAgIGlmIChpZCA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ByaW1hcnkga2V5IG1heSBub3QgYmUgbnVsbC91bmRlZmluZWQuJyk7XG4gICAgfVxuICAgIHJldHVybiBlbnRpdHkgJiYgeyBpZCwgY2hhbmdlczogZW50aXR5IH07XG4gIH07XG59XG4iXX0=