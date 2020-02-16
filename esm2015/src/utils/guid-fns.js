/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/utils/guid-fns.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/*
Client-side id-generators

These GUID utility functions are not used by @ngrx/data itself at this time.
They are included as candidates for generating persistable correlation ids if that becomes desirable.
They are also safe for generating unique entity ids on the client.

Note they produce 32-character hexadecimal UUID strings,
not the 128-bit representation found in server-side languages and databases.

These utilities are experimental and may be withdrawn or replaced in future.
*/
/**
 * Creates a Universally Unique Identifier (AKA GUID)
 * @return {?}
 */
export function getUuid() {
    // The original implementation is based on this SO answer:
    // http://stackoverflow.com/a/2117523/200253
    return 'xxxxxxxxxx4xxyxxxxxxxxxxxxxx'.replace(/[xy]/g, (/**
     * @param {?} c
     * @return {?}
     */
    function (c) {
        // tslint:disable-next-line:no-bitwise
        /** @type {?} */
        const r = (Math.random() * 16) | 0;
        /** @type {?} */
        const 
        // tslint:disable-next-line:no-bitwise
        v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    }));
}
/**
 * Alias for getUuid(). Compare with getGuidComb().
 * @return {?}
 */
export function getGuid() {
    return getUuid();
}
/**
 * Creates a sortable, pseudo-GUID (globally unique identifier)
 * whose trailing 6 bytes (12 hex digits) are time-based
 * Start either with the given getTime() value, seedTime,
 * or get the current time in ms.
 *
 * @param {?=} seed {number} - optional seed for reproducible time-part
 * @return {?}
 */
export function getGuidComb(seed) {
    // Each new Guid is greater than next if more than 1ms passes
    // See http://thatextramile.be/blog/2009/05/using-the-guidcomb-identifier-strategy
    // Based on breeze.core.getUuid which is based on this StackOverflow answer
    // http://stackoverflow.com/a/2117523/200253
    //
    // Convert time value to hex: n.toString(16)
    // Make sure it is 6 bytes long: ('00'+ ...).slice(-12) ... from the rear
    // Replace LAST 6 bytes (12 hex digits) of regular Guid (that's where they sort in a Db)
    //
    // Play with this in jsFiddle: http://jsfiddle.net/wardbell/qS8aN/
    /** @type {?} */
    const timePart = ('00' + (seed || new Date().getTime()).toString(16)).slice(-12);
    return ('xxxxxxxxxx4xxyxxx'.replace(/[xy]/g, (/**
     * @param {?} c
     * @return {?}
     */
    function (c) {
        // tslint:disable:no-bitwise
        /** @type {?} */
        const r = (Math.random() * 16) | 0;
        /** @type {?} */
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    })) + timePart);
}
// Sort comparison value that's good enough
/**
 * @param {?} l
 * @param {?} r
 * @return {?}
 */
export function guidComparer(l, r) {
    /** @type {?} */
    const l_low = l.slice(-12);
    /** @type {?} */
    const r_low = r.slice(-12);
    return l_low !== r_low
        ? l_low < r_low
            ? -1
            : +(l_low !== r_low)
        : l < r
            ? -1
            : +(l !== r);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZC1mbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3V0aWxzL2d1aWQtZm5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQSxNQUFNLFVBQVUsT0FBTztJQUNyQiwwREFBMEQ7SUFDMUQsNENBQTRDO0lBQzVDLE9BQU8sOEJBQThCLENBQUMsT0FBTyxDQUFDLE9BQU87Ozs7SUFBRSxVQUFTLENBQUM7OztjQUV6RCxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQzs7O1FBQ2hDLHNDQUFzQztRQUN0QyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHO1FBQ3JDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN4QixDQUFDLEVBQUMsQ0FBQztBQUNMLENBQUM7Ozs7O0FBR0QsTUFBTSxVQUFVLE9BQU87SUFDckIsT0FBTyxPQUFPLEVBQUUsQ0FBQztBQUNuQixDQUFDOzs7Ozs7Ozs7O0FBVUQsTUFBTSxVQUFVLFdBQVcsQ0FBQyxJQUFhOzs7Ozs7Ozs7Ozs7VUFXakMsUUFBUSxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQ3pFLENBQUMsRUFBRSxDQUNKO0lBQ0QsT0FBTyxDQUNMLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxPQUFPOzs7O0lBQUUsVUFBUyxDQUFDOzs7Y0FFdkMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUM7O2NBQ2hDLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUc7UUFDckMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3hCLENBQUMsRUFBQyxHQUFHLFFBQVEsQ0FDZCxDQUFDO0FBQ0osQ0FBQzs7Ozs7OztBQUdELE1BQU0sVUFBVSxZQUFZLENBQUMsQ0FBUyxFQUFFLENBQVM7O1VBQ3pDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDOztVQUNwQixLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUMxQixPQUFPLEtBQUssS0FBSyxLQUFLO1FBQ3BCLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSztZQUNiLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUM7UUFDdEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ25CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuQ2xpZW50LXNpZGUgaWQtZ2VuZXJhdG9yc1xuXG5UaGVzZSBHVUlEIHV0aWxpdHkgZnVuY3Rpb25zIGFyZSBub3QgdXNlZCBieSBAbmdyeC9kYXRhIGl0c2VsZiBhdCB0aGlzIHRpbWUuXG5UaGV5IGFyZSBpbmNsdWRlZCBhcyBjYW5kaWRhdGVzIGZvciBnZW5lcmF0aW5nIHBlcnNpc3RhYmxlIGNvcnJlbGF0aW9uIGlkcyBpZiB0aGF0IGJlY29tZXMgZGVzaXJhYmxlLlxuVGhleSBhcmUgYWxzbyBzYWZlIGZvciBnZW5lcmF0aW5nIHVuaXF1ZSBlbnRpdHkgaWRzIG9uIHRoZSBjbGllbnQuXG5cbk5vdGUgdGhleSBwcm9kdWNlIDMyLWNoYXJhY3RlciBoZXhhZGVjaW1hbCBVVUlEIHN0cmluZ3MsXG5ub3QgdGhlIDEyOC1iaXQgcmVwcmVzZW50YXRpb24gZm91bmQgaW4gc2VydmVyLXNpZGUgbGFuZ3VhZ2VzIGFuZCBkYXRhYmFzZXMuXG5cblRoZXNlIHV0aWxpdGllcyBhcmUgZXhwZXJpbWVudGFsIGFuZCBtYXkgYmUgd2l0aGRyYXduIG9yIHJlcGxhY2VkIGluIGZ1dHVyZS5cbiovXG5cbi8qKlxuICogQ3JlYXRlcyBhIFVuaXZlcnNhbGx5IFVuaXF1ZSBJZGVudGlmaWVyIChBS0EgR1VJRClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFV1aWQoKSB7XG4gIC8vIFRoZSBvcmlnaW5hbCBpbXBsZW1lbnRhdGlvbiBpcyBiYXNlZCBvbiB0aGlzIFNPIGFuc3dlcjpcbiAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjExNzUyMy8yMDAyNTNcbiAgcmV0dXJuICd4eHh4eHh4eHh4NHh4eXh4eHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uKGMpIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYml0d2lzZVxuICAgIGNvbnN0IHIgPSAoTWF0aC5yYW5kb20oKSAqIDE2KSB8IDAsXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYml0d2lzZVxuICAgICAgdiA9IGMgPT09ICd4JyA/IHIgOiAociAmIDB4MykgfCAweDg7XG4gICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuICB9KTtcbn1cblxuLyoqIEFsaWFzIGZvciBnZXRVdWlkKCkuIENvbXBhcmUgd2l0aCBnZXRHdWlkQ29tYigpLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEd1aWQoKSB7XG4gIHJldHVybiBnZXRVdWlkKCk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHNvcnRhYmxlLCBwc2V1ZG8tR1VJRCAoZ2xvYmFsbHkgdW5pcXVlIGlkZW50aWZpZXIpXG4gKiB3aG9zZSB0cmFpbGluZyA2IGJ5dGVzICgxMiBoZXggZGlnaXRzKSBhcmUgdGltZS1iYXNlZFxuICogU3RhcnQgZWl0aGVyIHdpdGggdGhlIGdpdmVuIGdldFRpbWUoKSB2YWx1ZSwgc2VlZFRpbWUsXG4gKiBvciBnZXQgdGhlIGN1cnJlbnQgdGltZSBpbiBtcy5cbiAqXG4gKiBAcGFyYW0gc2VlZCB7bnVtYmVyfSAtIG9wdGlvbmFsIHNlZWQgZm9yIHJlcHJvZHVjaWJsZSB0aW1lLXBhcnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEd1aWRDb21iKHNlZWQ/OiBudW1iZXIpIHtcbiAgLy8gRWFjaCBuZXcgR3VpZCBpcyBncmVhdGVyIHRoYW4gbmV4dCBpZiBtb3JlIHRoYW4gMW1zIHBhc3Nlc1xuICAvLyBTZWUgaHR0cDovL3RoYXRleHRyYW1pbGUuYmUvYmxvZy8yMDA5LzA1L3VzaW5nLXRoZS1ndWlkY29tYi1pZGVudGlmaWVyLXN0cmF0ZWd5XG4gIC8vIEJhc2VkIG9uIGJyZWV6ZS5jb3JlLmdldFV1aWQgd2hpY2ggaXMgYmFzZWQgb24gdGhpcyBTdGFja092ZXJmbG93IGFuc3dlclxuICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMTE3NTIzLzIwMDI1M1xuICAvL1xuICAvLyBDb252ZXJ0IHRpbWUgdmFsdWUgdG8gaGV4OiBuLnRvU3RyaW5nKDE2KVxuICAvLyBNYWtlIHN1cmUgaXQgaXMgNiBieXRlcyBsb25nOiAoJzAwJysgLi4uKS5zbGljZSgtMTIpIC4uLiBmcm9tIHRoZSByZWFyXG4gIC8vIFJlcGxhY2UgTEFTVCA2IGJ5dGVzICgxMiBoZXggZGlnaXRzKSBvZiByZWd1bGFyIEd1aWQgKHRoYXQncyB3aGVyZSB0aGV5IHNvcnQgaW4gYSBEYilcbiAgLy9cbiAgLy8gUGxheSB3aXRoIHRoaXMgaW4ganNGaWRkbGU6IGh0dHA6Ly9qc2ZpZGRsZS5uZXQvd2FyZGJlbGwvcVM4YU4vXG4gIGNvbnN0IHRpbWVQYXJ0ID0gKCcwMCcgKyAoc2VlZCB8fCBuZXcgRGF0ZSgpLmdldFRpbWUoKSkudG9TdHJpbmcoMTYpKS5zbGljZShcbiAgICAtMTJcbiAgKTtcbiAgcmV0dXJuIChcbiAgICAneHh4eHh4eHh4eDR4eHl4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24oYykge1xuICAgICAgLy8gdHNsaW50OmRpc2FibGU6bm8tYml0d2lzZVxuICAgICAgY29uc3QgciA9IChNYXRoLnJhbmRvbSgpICogMTYpIHwgMCxcbiAgICAgICAgdiA9IGMgPT09ICd4JyA/IHIgOiAociAmIDB4MykgfCAweDg7XG4gICAgICByZXR1cm4gdi50b1N0cmluZygxNik7XG4gICAgfSkgKyB0aW1lUGFydFxuICApO1xufVxuXG4vLyBTb3J0IGNvbXBhcmlzb24gdmFsdWUgdGhhdCdzIGdvb2QgZW5vdWdoXG5leHBvcnQgZnVuY3Rpb24gZ3VpZENvbXBhcmVyKGw6IHN0cmluZywgcjogc3RyaW5nKSB7XG4gIGNvbnN0IGxfbG93ID0gbC5zbGljZSgtMTIpO1xuICBjb25zdCByX2xvdyA9IHIuc2xpY2UoLTEyKTtcbiAgcmV0dXJuIGxfbG93ICE9PSByX2xvd1xuICAgID8gbF9sb3cgPCByX2xvd1xuICAgICAgPyAtMVxuICAgICAgOiArKGxfbG93ICE9PSByX2xvdylcbiAgICA6IGwgPCByXG4gICAgICA/IC0xXG4gICAgICA6ICsobCAhPT0gcik7XG59XG4iXX0=