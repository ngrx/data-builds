import * as tslib_1 from "tslib";
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
        var _a = tslib_1.__read(args), head = _a[0], tail = _a.slice(1);
        args = tslib_1.__spread(head, tail);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbGl0aWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy91dGlscy91dGlsaXRpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLGVBQWUsQ0FBQyxNQUFXO0lBQ3pDLE9BQU8sTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO0FBQ2hELENBQUM7QUFFRDs7Ozs7Ozs7OztLQVVLO0FBQ0wsTUFBTSxVQUFVLFdBQVcsQ0FBSSxJQUFZO0lBQ3pDLElBQUksSUFBSSxJQUFJLElBQUksRUFBRTtRQUNoQixPQUFPLEVBQUUsQ0FBQztLQUNYO0lBQ0QsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ3BCLElBQUEseUJBQXNCLEVBQXJCLFlBQUksRUFBRSxrQkFBZSxDQUFDO1FBQzdCLElBQUksb0JBQU8sSUFBSSxFQUFLLElBQUksQ0FBQyxDQUFDO0tBQzNCO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxlQUFlLENBQUksUUFBd0I7SUFDekQsUUFBUSxHQUFHLFFBQVEsSUFBSyxlQUFpQyxDQUFDO0lBQzFEOzs7OztPQUtHO0lBQ0gsT0FBTyxTQUFTLFFBQVEsQ0FBQyxNQUFrQjtRQUN6QyxJQUFNLEVBQUUsR0FBUSxRQUFTLENBQUMsTUFBVyxDQUFDLENBQUM7UUFDdkMsSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1NBQzNEO1FBQ0QsT0FBTyxNQUFNLElBQUksRUFBRSxFQUFFLElBQUEsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUM7SUFDM0MsQ0FBQyxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElkU2VsZWN0b3IsIFVwZGF0ZSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbi8qKlxuICogRGVmYXVsdCBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGVudGl0eSdzIHByaW1hcnkga2V5IChwa2V5KS5cbiAqIEFzc3VtZXMgdGhhdCB0aGUgZW50aXR5IGhhcyBhbiBgaWRgIHBrZXkgcHJvcGVydHkuXG4gKiBSZXR1cm5zIGB1bmRlZmluZWRgIGlmIG5vIGVudGl0eSBvciBgaWRgLlxuICogRXZlcnkgc2VsZWN0SWQgZm4gbXVzdCByZXR1cm4gYHVuZGVmaW5lZGAgd2hlbiBpdCBjYW5ub3QgcHJvZHVjZSBhIGZ1bGwgcGtleS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRTZWxlY3RJZChlbnRpdHk6IGFueSkge1xuICByZXR1cm4gZW50aXR5ID09IG51bGwgPyB1bmRlZmluZWQgOiBlbnRpdHkuaWQ7XG59XG5cbi8qKlxuICogRmxhdHRlbiBmaXJzdCBhcmcgaWYgaXQgaXMgYW4gYXJyYXlcbiAqIEFsbG93cyBmbiB3aXRoIC4uLnJlc3Qgc2lnbmF0dXJlIHRvIGJlIGNhbGxlZCB3aXRoIGFuIGFycmF5IGluc3RlYWQgb2Ygc3ByZWFkXG4gKiBFeGFtcGxlOlxuICogYGBgXG4gKiAvLyBTZWUgZW50aXR5LWFjdGlvbi1vcGVyYXRvcnMudHNcbiAqIGNvbnN0IHBlcnNpc3RPcHMgPSBbRW50aXR5T3AuUVVFUllfQUxMLCBFbnRpdHlPcC5BREQsIC4uLl07XG4gKiBhY3Rpb25zLnBpcGUob2ZFbnRpdHlPcCguLi5wZXJzaXN0T3BzKSkgLy8gd29ya3NcbiAqIGFjdGlvbnMucGlwZShvZkVudGl0eU9wKHBlcnNpc3RPcHMpKSAvLyBhbHNvIHdvcmtzXG4gKiBgYGBcbiAqICovXG5leHBvcnQgZnVuY3Rpb24gZmxhdHRlbkFyZ3M8VD4oYXJncz86IGFueVtdKTogVFtdIHtcbiAgaWYgKGFyZ3MgPT0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBpZiAoQXJyYXkuaXNBcnJheShhcmdzWzBdKSkge1xuICAgIGNvbnN0IFtoZWFkLCAuLi50YWlsXSA9IGFyZ3M7XG4gICAgYXJncyA9IFsuLi5oZWFkLCAuLi50YWlsXTtcbiAgfVxuICByZXR1cm4gYXJncztcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBmdW5jdGlvbiB0aGF0IGNvbnZlcnRzIGFuIGVudGl0eSAob3IgcGFydGlhbCBlbnRpdHkpIGludG8gdGhlIGBVcGRhdGU8VD5gXG4gKiB3aG9zZSBgaWRgIGlzIHRoZSBwcmltYXJ5IGtleSBhbmRcbiAqIGBjaGFuZ2VzYCBpcyB0aGUgZW50aXR5IChvciBwYXJ0aWFsIGVudGl0eSBvZiBjaGFuZ2VzKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvVXBkYXRlRmFjdG9yeTxUPihzZWxlY3RJZD86IElkU2VsZWN0b3I8VD4pIHtcbiAgc2VsZWN0SWQgPSBzZWxlY3RJZCB8fCAoZGVmYXVsdFNlbGVjdElkIGFzIElkU2VsZWN0b3I8VD4pO1xuICAvKipcbiAgICogQ29udmVydCBhbiBlbnRpdHkgKG9yIHBhcnRpYWwgZW50aXR5KSBpbnRvIHRoZSBgVXBkYXRlPFQ+YFxuICAgKiB3aG9zZSBgaWRgIGlzIHRoZSBwcmltYXJ5IGtleSBhbmRcbiAgICogYGNoYW5nZXNgIGlzIHRoZSBlbnRpdHkgKG9yIHBhcnRpYWwgZW50aXR5IG9mIGNoYW5nZXMpLlxuICAgKiBAcGFyYW0gc2VsZWN0SWQgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBlbnRpdHkncyBwcmltYXJ5IGtleSAoaWQpXG4gICAqL1xuICByZXR1cm4gZnVuY3Rpb24gdG9VcGRhdGUoZW50aXR5OiBQYXJ0aWFsPFQ+KTogVXBkYXRlPFQ+IHtcbiAgICBjb25zdCBpZDogYW55ID0gc2VsZWN0SWQhKGVudGl0eSBhcyBUKTtcbiAgICBpZiAoaWQgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcmltYXJ5IGtleSBtYXkgbm90IGJlIG51bGwvdW5kZWZpbmVkLicpO1xuICAgIH1cbiAgICByZXR1cm4gZW50aXR5ICYmIHsgaWQsIGNoYW5nZXM6IGVudGl0eSB9O1xuICB9O1xufVxuIl19