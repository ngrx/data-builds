/**
 * @fileoverview added by tsickle
 * Generated from: src/utils/guid-fns.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
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
function getUuid() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZC1mbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3V0aWxzL2d1aWQtZm5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQSxTQUFTLE9BQU87SUFDZCwwREFBMEQ7SUFDMUQsNENBQTRDO0lBQzVDLE9BQU8sOEJBQThCLENBQUMsT0FBTyxDQUFDLE9BQU87Ozs7SUFBRSxVQUFVLENBQUM7OztjQUUxRCxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQzs7O1FBQ2hDLHNDQUFzQztRQUN0QyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHO1FBQ3JDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN4QixDQUFDLEVBQUMsQ0FBQztBQUNMLENBQUM7Ozs7O0FBR0QsTUFBTSxVQUFVLE9BQU87SUFDckIsT0FBTyxPQUFPLEVBQUUsQ0FBQztBQUNuQixDQUFDOzs7Ozs7Ozs7O0FBVUQsTUFBTSxVQUFVLFdBQVcsQ0FBQyxJQUFhOzs7Ozs7Ozs7Ozs7VUFXakMsUUFBUSxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQ3pFLENBQUMsRUFBRSxDQUNKO0lBQ0QsT0FBTyxDQUNMLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxPQUFPOzs7O0lBQUUsVUFBVSxDQUFDOzs7Y0FFeEMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUM7O2NBQ2hDLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUc7UUFDckMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3hCLENBQUMsRUFBQyxHQUFHLFFBQVEsQ0FDZCxDQUFDO0FBQ0osQ0FBQzs7Ozs7OztBQUdELE1BQU0sVUFBVSxZQUFZLENBQUMsQ0FBUyxFQUFFLENBQVM7O1VBQ3pDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDOztVQUNwQixLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUMxQixPQUFPLEtBQUssS0FBSyxLQUFLO1FBQ3BCLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSztZQUNiLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUM7UUFDdEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAgQ2xpZW50LXNpZGUgaWQtZ2VuZXJhdG9yc1xuXG4gIFRoZXNlIEdVSUQgdXRpbGl0eSBmdW5jdGlvbnMgYXJlIG5vdCB1c2VkIGJ5IEBuZ3J4L2RhdGEgaXRzZWxmIGF0IHRoaXMgdGltZS5cbiAgVGhleSBhcmUgaW5jbHVkZWQgYXMgY2FuZGlkYXRlcyBmb3IgZ2VuZXJhdGluZyBwZXJzaXN0YWJsZSBjb3JyZWxhdGlvbiBpZHMgaWYgdGhhdCBiZWNvbWVzIGRlc2lyYWJsZS5cbiAgVGhleSBhcmUgYWxzbyBzYWZlIGZvciBnZW5lcmF0aW5nIHVuaXF1ZSBlbnRpdHkgaWRzIG9uIHRoZSBjbGllbnQuXG5cbiAgTm90ZSB0aGV5IHByb2R1Y2UgMzItY2hhcmFjdGVyIGhleGFkZWNpbWFsIFVVSUQgc3RyaW5ncyxcbiAgbm90IHRoZSAxMjgtYml0IHJlcHJlc2VudGF0aW9uIGZvdW5kIGluIHNlcnZlci1zaWRlIGxhbmd1YWdlcyBhbmQgZGF0YWJhc2VzLlxuXG4gIFRoZXNlIHV0aWxpdGllcyBhcmUgZXhwZXJpbWVudGFsIGFuZCBtYXkgYmUgd2l0aGRyYXduIG9yIHJlcGxhY2VkIGluIGZ1dHVyZS5cbiovXG5cbi8qKlxuICogQ3JlYXRlcyBhIFVuaXZlcnNhbGx5IFVuaXF1ZSBJZGVudGlmaWVyIChBS0EgR1VJRClcbiAqL1xuZnVuY3Rpb24gZ2V0VXVpZCgpIHtcbiAgLy8gVGhlIG9yaWdpbmFsIGltcGxlbWVudGF0aW9uIGlzIGJhc2VkIG9uIHRoaXMgU08gYW5zd2VyOlxuICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMTE3NTIzLzIwMDI1M1xuICByZXR1cm4gJ3h4eHh4eHh4eHg0eHh5eHh4eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24gKGMpIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYml0d2lzZVxuICAgIGNvbnN0IHIgPSAoTWF0aC5yYW5kb20oKSAqIDE2KSB8IDAsXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYml0d2lzZVxuICAgICAgdiA9IGMgPT09ICd4JyA/IHIgOiAociAmIDB4MykgfCAweDg7XG4gICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuICB9KTtcbn1cblxuLyoqIEFsaWFzIGZvciBnZXRVdWlkKCkuIENvbXBhcmUgd2l0aCBnZXRHdWlkQ29tYigpLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEd1aWQoKSB7XG4gIHJldHVybiBnZXRVdWlkKCk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHNvcnRhYmxlLCBwc2V1ZG8tR1VJRCAoZ2xvYmFsbHkgdW5pcXVlIGlkZW50aWZpZXIpXG4gKiB3aG9zZSB0cmFpbGluZyA2IGJ5dGVzICgxMiBoZXggZGlnaXRzKSBhcmUgdGltZS1iYXNlZFxuICogU3RhcnQgZWl0aGVyIHdpdGggdGhlIGdpdmVuIGdldFRpbWUoKSB2YWx1ZSwgc2VlZFRpbWUsXG4gKiBvciBnZXQgdGhlIGN1cnJlbnQgdGltZSBpbiBtcy5cbiAqXG4gKiBAcGFyYW0gc2VlZCB7bnVtYmVyfSAtIG9wdGlvbmFsIHNlZWQgZm9yIHJlcHJvZHVjaWJsZSB0aW1lLXBhcnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEd1aWRDb21iKHNlZWQ/OiBudW1iZXIpIHtcbiAgLy8gRWFjaCBuZXcgR3VpZCBpcyBncmVhdGVyIHRoYW4gbmV4dCBpZiBtb3JlIHRoYW4gMW1zIHBhc3Nlc1xuICAvLyBTZWUgaHR0cDovL3RoYXRleHRyYW1pbGUuYmUvYmxvZy8yMDA5LzA1L3VzaW5nLXRoZS1ndWlkY29tYi1pZGVudGlmaWVyLXN0cmF0ZWd5XG4gIC8vIEJhc2VkIG9uIGJyZWV6ZS5jb3JlLmdldFV1aWQgd2hpY2ggaXMgYmFzZWQgb24gdGhpcyBTdGFja092ZXJmbG93IGFuc3dlclxuICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMTE3NTIzLzIwMDI1M1xuICAvL1xuICAvLyBDb252ZXJ0IHRpbWUgdmFsdWUgdG8gaGV4OiBuLnRvU3RyaW5nKDE2KVxuICAvLyBNYWtlIHN1cmUgaXQgaXMgNiBieXRlcyBsb25nOiAoJzAwJysgLi4uKS5zbGljZSgtMTIpIC4uLiBmcm9tIHRoZSByZWFyXG4gIC8vIFJlcGxhY2UgTEFTVCA2IGJ5dGVzICgxMiBoZXggZGlnaXRzKSBvZiByZWd1bGFyIEd1aWQgKHRoYXQncyB3aGVyZSB0aGV5IHNvcnQgaW4gYSBEYilcbiAgLy9cbiAgLy8gUGxheSB3aXRoIHRoaXMgaW4ganNGaWRkbGU6IGh0dHA6Ly9qc2ZpZGRsZS5uZXQvd2FyZGJlbGwvcVM4YU4vXG4gIGNvbnN0IHRpbWVQYXJ0ID0gKCcwMCcgKyAoc2VlZCB8fCBuZXcgRGF0ZSgpLmdldFRpbWUoKSkudG9TdHJpbmcoMTYpKS5zbGljZShcbiAgICAtMTJcbiAgKTtcbiAgcmV0dXJuIChcbiAgICAneHh4eHh4eHh4eDR4eHl4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24gKGMpIHtcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlOm5vLWJpdHdpc2VcbiAgICAgIGNvbnN0IHIgPSAoTWF0aC5yYW5kb20oKSAqIDE2KSB8IDAsXG4gICAgICAgIHYgPSBjID09PSAneCcgPyByIDogKHIgJiAweDMpIHwgMHg4O1xuICAgICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuICAgIH0pICsgdGltZVBhcnRcbiAgKTtcbn1cblxuLy8gU29ydCBjb21wYXJpc29uIHZhbHVlIHRoYXQncyBnb29kIGVub3VnaFxuZXhwb3J0IGZ1bmN0aW9uIGd1aWRDb21wYXJlcihsOiBzdHJpbmcsIHI6IHN0cmluZykge1xuICBjb25zdCBsX2xvdyA9IGwuc2xpY2UoLTEyKTtcbiAgY29uc3Qgcl9sb3cgPSByLnNsaWNlKC0xMik7XG4gIHJldHVybiBsX2xvdyAhPT0gcl9sb3dcbiAgICA/IGxfbG93IDwgcl9sb3dcbiAgICAgID8gLTFcbiAgICAgIDogKyhsX2xvdyAhPT0gcl9sb3cpXG4gICAgOiBsIDwgclxuICAgID8gLTFcbiAgICA6ICsobCAhPT0gcik7XG59XG4iXX0=