/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Action concerning an entity collection.
 * @record
 * @template P
 */
export function EntityAction() { }
if (false) {
    /** @type {?} */
    EntityAction.prototype.type;
    /** @type {?} */
    EntityAction.prototype.payload;
}
/**
 * Options of an EntityAction
 * @record
 */
export function EntityActionOptions() { }
if (false) {
    /**
     * Correlate related EntityActions, particularly related saves. Must be serializable.
     * @type {?|undefined}
     */
    EntityActionOptions.prototype.correlationId;
    /**
     * True if should perform action optimistically (before server responds)
     * @type {?|undefined}
     */
    EntityActionOptions.prototype.isOptimistic;
    /** @type {?|undefined} */
    EntityActionOptions.prototype.mergeStrategy;
    /**
     * The tag to use in the action's type. The entityName if no tag specified.
     * @type {?|undefined}
     */
    EntityActionOptions.prototype.tag;
    /**
     * The action was determined (usually by a reducer) to be in error.
     * Downstream effects should not process but rather treat it as an error.
     * @type {?|undefined}
     */
    EntityActionOptions.prototype.error;
    /**
     * Downstream effects should skip processing this action but should return
     * an innocuous Observable<Action> of success.
     * @type {?|undefined}
     */
    EntityActionOptions.prototype.skip;
}
/**
 * Payload of an EntityAction
 * @record
 * @template P
 */
export function EntityActionPayload() { }
if (false) {
    /** @type {?} */
    EntityActionPayload.prototype.entityName;
    /** @type {?} */
    EntityActionPayload.prototype.entityOp;
    /** @type {?|undefined} */
    EntityActionPayload.prototype.data;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvYWN0aW9ucy9lbnRpdHktYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQU9BLGtDQUdDOzs7SUFGQyw0QkFBc0I7O0lBQ3RCLCtCQUF5Qzs7Ozs7O0FBSTNDLHlDQXdCQzs7Ozs7O0lBdEJDLDRDQUE2Qjs7Ozs7SUFFN0IsMkNBQWdDOztJQUNoQyw0Q0FBdUM7Ozs7O0lBRXZDLGtDQUFzQjs7Ozs7O0lBVXRCLG9DQUFjOzs7Ozs7SUFNZCxtQ0FBZTs7Ozs7OztBQUlqQix5Q0FJQzs7O0lBSEMseUNBQTRCOztJQUM1Qix1Q0FBNEI7O0lBQzVCLG1DQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuaW1wb3J0IHsgRW50aXR5T3AgfSBmcm9tICcuL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBNZXJnZVN0cmF0ZWd5IH0gZnJvbSAnLi9tZXJnZS1zdHJhdGVneSc7XG5cbi8qKiBBY3Rpb24gY29uY2VybmluZyBhbiBlbnRpdHkgY29sbGVjdGlvbi4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5QWN0aW9uPFAgPSBhbnk+IGV4dGVuZHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuICByZWFkb25seSBwYXlsb2FkOiBFbnRpdHlBY3Rpb25QYXlsb2FkPFA+O1xufVxuXG4vKiogT3B0aW9ucyBvZiBhbiBFbnRpdHlBY3Rpb24gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5QWN0aW9uT3B0aW9ucyB7XG4gIC8qKiBDb3JyZWxhdGUgcmVsYXRlZCBFbnRpdHlBY3Rpb25zLCBwYXJ0aWN1bGFybHkgcmVsYXRlZCBzYXZlcy4gTXVzdCBiZSBzZXJpYWxpemFibGUuICovXG4gIHJlYWRvbmx5IGNvcnJlbGF0aW9uSWQ/OiBhbnk7XG4gIC8qKiBUcnVlIGlmIHNob3VsZCBwZXJmb3JtIGFjdGlvbiBvcHRpbWlzdGljYWxseSAoYmVmb3JlIHNlcnZlciByZXNwb25kcykgKi9cbiAgcmVhZG9ubHkgaXNPcHRpbWlzdGljPzogYm9vbGVhbjtcbiAgcmVhZG9ubHkgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3k7XG4gIC8qKiBUaGUgdGFnIHRvIHVzZSBpbiB0aGUgYWN0aW9uJ3MgdHlwZS4gVGhlIGVudGl0eU5hbWUgaWYgbm8gdGFnIHNwZWNpZmllZC4gKi9cbiAgcmVhZG9ubHkgdGFnPzogc3RyaW5nO1xuXG4gIC8vIE11dGFibGUgYWN0aW9ucyBhcmUgQkFELlxuICAvLyBVbmZvcnR1bmF0ZWx5LCB0aGVzZSBtdXRhdGlvbnMgYXJlIHRoZSBvbmx5IHdheSB0byBzdG9wIEBuZ3J4L2VmZmVjdHNcbiAgLy8gZnJvbSBwcm9jZXNzaW5nIHRoZXNlIGFjdGlvbnMuXG5cbiAgLyoqXG4gICAqIFRoZSBhY3Rpb24gd2FzIGRldGVybWluZWQgKHVzdWFsbHkgYnkgYSByZWR1Y2VyKSB0byBiZSBpbiBlcnJvci5cbiAgICogRG93bnN0cmVhbSBlZmZlY3RzIHNob3VsZCBub3QgcHJvY2VzcyBidXQgcmF0aGVyIHRyZWF0IGl0IGFzIGFuIGVycm9yLlxuICAgKi9cbiAgZXJyb3I/OiBFcnJvcjtcblxuICAvKipcbiAgICogRG93bnN0cmVhbSBlZmZlY3RzIHNob3VsZCBza2lwIHByb2Nlc3NpbmcgdGhpcyBhY3Rpb24gYnV0IHNob3VsZCByZXR1cm5cbiAgICogYW4gaW5ub2N1b3VzIE9ic2VydmFibGU8QWN0aW9uPiBvZiBzdWNjZXNzLlxuICAgKi9cbiAgc2tpcD86IGJvb2xlYW47XG59XG5cbi8qKiBQYXlsb2FkIG9mIGFuIEVudGl0eUFjdGlvbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlBY3Rpb25QYXlsb2FkPFAgPSBhbnk+IGV4dGVuZHMgRW50aXR5QWN0aW9uT3B0aW9ucyB7XG4gIHJlYWRvbmx5IGVudGl0eU5hbWU6IHN0cmluZztcbiAgcmVhZG9ubHkgZW50aXR5T3A6IEVudGl0eU9wO1xuICByZWFkb25seSBkYXRhPzogUDtcbn1cbiJdfQ==