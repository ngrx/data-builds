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
 */
export function getUuid() {
    // The original implementation is based on this SO answer:
    // http://stackoverflow.com/a/2117523/200253
    return 'xxxxxxxxxx4xxyxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        // tslint:disable-next-line:no-bitwise
        var r = (Math.random() * 16) | 0, 
        // tslint:disable-next-line:no-bitwise
        v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
/** Alias for getUuid(). Compare with getGuidComb(). */
export function getGuid() {
    return getUuid();
}
/**
 * Creates a sortable, pseudo-GUID (globally unique identifier)
 * whose trailing 6 bytes (12 hex digits) are time-based
 * Start either with the given getTime() value, seedTime,
 * or get the current time in ms.
 *
 * @param seed {number} - optional seed for reproducible time-part
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
    var timePart = ('00' + (seed || new Date().getTime()).toString(16)).slice(-12);
    return ('xxxxxxxxxx4xxyxxx'.replace(/[xy]/g, function (c) {
        // tslint:disable:no-bitwise
        var r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    }) + timePart);
}
// Sort comparison value that's good enough
export function guidComparer(l, r) {
    var l_low = l.slice(-12);
    var r_low = r.slice(-12);
    return l_low !== r_low
        ? l_low < r_low
            ? -1
            : +(l_low !== r_low)
        : l < r
            ? -1
            : +(l !== r);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZC1mbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3V0aWxzL2d1aWQtZm5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztFQVdFO0FBRUY7O0dBRUc7QUFDSCxNQUFNLFVBQVUsT0FBTztJQUNyQiwwREFBMEQ7SUFDMUQsNENBQTRDO0lBQzVDLE9BQU8sOEJBQThCLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxVQUFTLENBQUM7UUFDL0Qsc0NBQXNDO1FBQ3RDLElBQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUM7UUFDaEMsc0NBQXNDO1FBQ3RDLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUN0QyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDeEIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsdURBQXVEO0FBQ3ZELE1BQU0sVUFBVSxPQUFPO0lBQ3JCLE9BQU8sT0FBTyxFQUFFLENBQUM7QUFDbkIsQ0FBQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLFVBQVUsV0FBVyxDQUFDLElBQWE7SUFDdkMsNkRBQTZEO0lBQzdELGtGQUFrRjtJQUNsRiwyRUFBMkU7SUFDM0UsNENBQTRDO0lBQzVDLEVBQUU7SUFDRiw0Q0FBNEM7SUFDNUMseUVBQXlFO0lBQ3pFLHdGQUF3RjtJQUN4RixFQUFFO0lBQ0Ysa0VBQWtFO0lBQ2xFLElBQU0sUUFBUSxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQ3pFLENBQUMsRUFBRSxDQUNKLENBQUM7SUFDRixPQUFPLENBQ0wsbUJBQW1CLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxVQUFTLENBQUM7UUFDN0MsNEJBQTRCO1FBQzVCLElBQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFDaEMsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ3RDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN4QixDQUFDLENBQUMsR0FBRyxRQUFRLENBQ2QsQ0FBQztBQUNKLENBQUM7QUFFRCwyQ0FBMkM7QUFDM0MsTUFBTSxVQUFVLFlBQVksQ0FBQyxDQUFTLEVBQUUsQ0FBUztJQUMvQyxJQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDM0IsSUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzNCLE9BQU8sS0FBSyxLQUFLLEtBQUs7UUFDcEIsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLO1lBQ2IsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5DbGllbnQtc2lkZSBpZC1nZW5lcmF0b3JzXG5cblRoZXNlIEdVSUQgdXRpbGl0eSBmdW5jdGlvbnMgYXJlIG5vdCB1c2VkIGJ5IEBuZ3J4L2RhdGEgaXRzZWxmIGF0IHRoaXMgdGltZS5cblRoZXkgYXJlIGluY2x1ZGVkIGFzIGNhbmRpZGF0ZXMgZm9yIGdlbmVyYXRpbmcgcGVyc2lzdGFibGUgY29ycmVsYXRpb24gaWRzIGlmIHRoYXQgYmVjb21lcyBkZXNpcmFibGUuXG5UaGV5IGFyZSBhbHNvIHNhZmUgZm9yIGdlbmVyYXRpbmcgdW5pcXVlIGVudGl0eSBpZHMgb24gdGhlIGNsaWVudC5cblxuTm90ZSB0aGV5IHByb2R1Y2UgMzItY2hhcmFjdGVyIGhleGFkZWNpbWFsIFVVSUQgc3RyaW5ncyxcbm5vdCB0aGUgMTI4LWJpdCByZXByZXNlbnRhdGlvbiBmb3VuZCBpbiBzZXJ2ZXItc2lkZSBsYW5ndWFnZXMgYW5kIGRhdGFiYXNlcy5cblxuVGhlc2UgdXRpbGl0aWVzIGFyZSBleHBlcmltZW50YWwgYW5kIG1heSBiZSB3aXRoZHJhd24gb3IgcmVwbGFjZWQgaW4gZnV0dXJlLlxuKi9cblxuLyoqXG4gKiBDcmVhdGVzIGEgVW5pdmVyc2FsbHkgVW5pcXVlIElkZW50aWZpZXIgKEFLQSBHVUlEKVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VXVpZCgpIHtcbiAgLy8gVGhlIG9yaWdpbmFsIGltcGxlbWVudGF0aW9uIGlzIGJhc2VkIG9uIHRoaXMgU08gYW5zd2VyOlxuICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMTE3NTIzLzIwMDI1M1xuICByZXR1cm4gJ3h4eHh4eHh4eHg0eHh5eHh4eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24oYykge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1iaXR3aXNlXG4gICAgY29uc3QgciA9IChNYXRoLnJhbmRvbSgpICogMTYpIHwgMCxcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1iaXR3aXNlXG4gICAgICB2ID0gYyA9PT0gJ3gnID8gciA6IChyICYgMHgzKSB8IDB4ODtcbiAgICByZXR1cm4gdi50b1N0cmluZygxNik7XG4gIH0pO1xufVxuXG4vKiogQWxpYXMgZm9yIGdldFV1aWQoKS4gQ29tcGFyZSB3aXRoIGdldEd1aWRDb21iKCkuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0R3VpZCgpIHtcbiAgcmV0dXJuIGdldFV1aWQoKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgc29ydGFibGUsIHBzZXVkby1HVUlEIChnbG9iYWxseSB1bmlxdWUgaWRlbnRpZmllcilcbiAqIHdob3NlIHRyYWlsaW5nIDYgYnl0ZXMgKDEyIGhleCBkaWdpdHMpIGFyZSB0aW1lLWJhc2VkXG4gKiBTdGFydCBlaXRoZXIgd2l0aCB0aGUgZ2l2ZW4gZ2V0VGltZSgpIHZhbHVlLCBzZWVkVGltZSxcbiAqIG9yIGdldCB0aGUgY3VycmVudCB0aW1lIGluIG1zLlxuICpcbiAqIEBwYXJhbSBzZWVkIHtudW1iZXJ9IC0gb3B0aW9uYWwgc2VlZCBmb3IgcmVwcm9kdWNpYmxlIHRpbWUtcGFydFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0R3VpZENvbWIoc2VlZD86IG51bWJlcikge1xuICAvLyBFYWNoIG5ldyBHdWlkIGlzIGdyZWF0ZXIgdGhhbiBuZXh0IGlmIG1vcmUgdGhhbiAxbXMgcGFzc2VzXG4gIC8vIFNlZSBodHRwOi8vdGhhdGV4dHJhbWlsZS5iZS9ibG9nLzIwMDkvMDUvdXNpbmctdGhlLWd1aWRjb21iLWlkZW50aWZpZXItc3RyYXRlZ3lcbiAgLy8gQmFzZWQgb24gYnJlZXplLmNvcmUuZ2V0VXVpZCB3aGljaCBpcyBiYXNlZCBvbiB0aGlzIFN0YWNrT3ZlcmZsb3cgYW5zd2VyXG4gIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIxMTc1MjMvMjAwMjUzXG4gIC8vXG4gIC8vIENvbnZlcnQgdGltZSB2YWx1ZSB0byBoZXg6IG4udG9TdHJpbmcoMTYpXG4gIC8vIE1ha2Ugc3VyZSBpdCBpcyA2IGJ5dGVzIGxvbmc6ICgnMDAnKyAuLi4pLnNsaWNlKC0xMikgLi4uIGZyb20gdGhlIHJlYXJcbiAgLy8gUmVwbGFjZSBMQVNUIDYgYnl0ZXMgKDEyIGhleCBkaWdpdHMpIG9mIHJlZ3VsYXIgR3VpZCAodGhhdCdzIHdoZXJlIHRoZXkgc29ydCBpbiBhIERiKVxuICAvL1xuICAvLyBQbGF5IHdpdGggdGhpcyBpbiBqc0ZpZGRsZTogaHR0cDovL2pzZmlkZGxlLm5ldC93YXJkYmVsbC9xUzhhTi9cbiAgY29uc3QgdGltZVBhcnQgPSAoJzAwJyArIChzZWVkIHx8IG5ldyBEYXRlKCkuZ2V0VGltZSgpKS50b1N0cmluZygxNikpLnNsaWNlKFxuICAgIC0xMlxuICApO1xuICByZXR1cm4gKFxuICAgICd4eHh4eHh4eHh4NHh4eXh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZTpuby1iaXR3aXNlXG4gICAgICBjb25zdCByID0gKE1hdGgucmFuZG9tKCkgKiAxNikgfCAwLFxuICAgICAgICB2ID0gYyA9PT0gJ3gnID8gciA6IChyICYgMHgzKSB8IDB4ODtcbiAgICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcbiAgICB9KSArIHRpbWVQYXJ0XG4gICk7XG59XG5cbi8vIFNvcnQgY29tcGFyaXNvbiB2YWx1ZSB0aGF0J3MgZ29vZCBlbm91Z2hcbmV4cG9ydCBmdW5jdGlvbiBndWlkQ29tcGFyZXIobDogc3RyaW5nLCByOiBzdHJpbmcpIHtcbiAgY29uc3QgbF9sb3cgPSBsLnNsaWNlKC0xMik7XG4gIGNvbnN0IHJfbG93ID0gci5zbGljZSgtMTIpO1xuICByZXR1cm4gbF9sb3cgIT09IHJfbG93XG4gICAgPyBsX2xvdyA8IHJfbG93XG4gICAgICA/IC0xXG4gICAgICA6ICsobF9sb3cgIT09IHJfbG93KVxuICAgIDogbCA8IHJcbiAgICAgID8gLTFcbiAgICAgIDogKyhsICE9PSByKTtcbn1cbiJdfQ==