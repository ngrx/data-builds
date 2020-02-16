/**
 * Creates a Universally Unique Identifier (AKA GUID)
 */
export declare function getUuid(): string;
/** Alias for getUuid(). Compare with getGuidComb(). */
export declare function getGuid(): string;
/**
 * Creates a sortable, pseudo-GUID (globally unique identifier)
 * whose trailing 6 bytes (12 hex digits) are time-based
 * Start either with the given getTime() value, seedTime,
 * or get the current time in ms.
 *
 * @param seed {number} - optional seed for reproducible time-part
 */
export declare function getGuidComb(seed?: number): string;
export declare function guidComparer(l: string, r: string): number;
