/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// Ensure that these suffix values and the EntityOp suffixes match
// Cannot do that programmatically.
/** @enum {string} */
const EntityOp = {
    // Persistance operations
    CANCEL_PERSIST: '@ngrx/data/cancel-persist',
    CANCELED_PERSIST: '@ngrx/data/canceled-persist',
    QUERY_ALL: '@ngrx/data/query-all',
    QUERY_ALL_SUCCESS: '@ngrx/data/query-all/success',
    QUERY_ALL_ERROR: '@ngrx/data/query-all/error',
    QUERY_LOAD: '@ngrx/data/query-load',
    QUERY_LOAD_SUCCESS: '@ngrx/data/query-load/success',
    QUERY_LOAD_ERROR: '@ngrx/data/query-load/error',
    QUERY_MANY: '@ngrx/data/query-many',
    QUERY_MANY_SUCCESS: '@ngrx/data/query-many/success',
    QUERY_MANY_ERROR: '@ngrx/data/query-many/error',
    QUERY_BY_KEY: '@ngrx/data/query-by-key',
    QUERY_BY_KEY_SUCCESS: '@ngrx/data/query-by-key/success',
    QUERY_BY_KEY_ERROR: '@ngrx/data/query-by-key/error',
    SAVE_ADD_MANY: '@ngrx/data/save/add-many',
    SAVE_ADD_MANY_ERROR: '@ngrx/data/save/add-many/error',
    SAVE_ADD_MANY_SUCCESS: '@ngrx/data/save/add-many/success',
    SAVE_ADD_ONE: '@ngrx/data/save/add-one',
    SAVE_ADD_ONE_ERROR: '@ngrx/data/save/add-one/error',
    SAVE_ADD_ONE_SUCCESS: '@ngrx/data/save/add-one/success',
    SAVE_DELETE_MANY: '@ngrx/data/save/delete-many',
    SAVE_DELETE_MANY_SUCCESS: '@ngrx/data/save/delete-many/success',
    SAVE_DELETE_MANY_ERROR: '@ngrx/data/save/delete-many/error',
    SAVE_DELETE_ONE: '@ngrx/data/save/delete-one',
    SAVE_DELETE_ONE_SUCCESS: '@ngrx/data/save/delete-one/success',
    SAVE_DELETE_ONE_ERROR: '@ngrx/data/save/delete-one/error',
    SAVE_UPDATE_MANY: '@ngrx/data/save/update-many',
    SAVE_UPDATE_MANY_SUCCESS: '@ngrx/data/save/update-many/success',
    SAVE_UPDATE_MANY_ERROR: '@ngrx/data/save/update-many/error',
    SAVE_UPDATE_ONE: '@ngrx/data/save/update-one',
    SAVE_UPDATE_ONE_SUCCESS: '@ngrx/data/save/update-one/success',
    SAVE_UPDATE_ONE_ERROR: '@ngrx/data/save/update-one/error',
    // Use only if the server supports upsert;
    SAVE_UPSERT_MANY: '@ngrx/data/save/upsert-many',
    SAVE_UPSERT_MANY_SUCCESS: '@ngrx/data/save/upsert-many/success',
    SAVE_UPSERT_MANY_ERROR: '@ngrx/data/save/upsert-many/error',
    // Use only if the server supports upsert;
    SAVE_UPSERT_ONE: '@ngrx/data/save/upsert-one',
    SAVE_UPSERT_ONE_SUCCESS: '@ngrx/data/save/upsert-one/success',
    SAVE_UPSERT_ONE_ERROR: '@ngrx/data/save/upsert-one/error',
    // Cache operations
    ADD_ALL: '@ngrx/data/add-all',
    ADD_MANY: '@ngrx/data/add-many',
    ADD_ONE: '@ngrx/data/add-one',
    REMOVE_ALL: '@ngrx/data/remove-all',
    REMOVE_MANY: '@ngrx/data/remove-many',
    REMOVE_ONE: '@ngrx/data/remove-one',
    UPDATE_MANY: '@ngrx/data/update-many',
    UPDATE_ONE: '@ngrx/data/update-one',
    UPSERT_MANY: '@ngrx/data/upsert-many',
    UPSERT_ONE: '@ngrx/data/upsert-one',
    COMMIT_ALL: '@ngrx/data/commit-all',
    COMMIT_MANY: '@ngrx/data/commit-many',
    COMMIT_ONE: '@ngrx/data/commit-one',
    UNDO_ALL: '@ngrx/data/undo-all',
    UNDO_MANY: '@ngrx/data/undo-many',
    UNDO_ONE: '@ngrx/data/undo-one',
    SET_CHANGE_STATE: '@ngrx/data/set-change-state',
    SET_COLLECTION: '@ngrx/data/set-collection',
    SET_FILTER: '@ngrx/data/set-filter',
    SET_LOADED: '@ngrx/data/set-loaded',
    SET_LOADING: '@ngrx/data/set-loading',
};
export { EntityOp };
/**
 * "Success" suffix appended to EntityOps that are successful.
 * @type {?}
 */
export const OP_SUCCESS = '/success';
/**
 * "Error" suffix appended to EntityOps that have failed.
 * @type {?}
 */
export const OP_ERROR = '/error';
/**
 * Make the error EntityOp corresponding to the given EntityOp
 * @param {?} op
 * @return {?}
 */
export function makeErrorOp(op) {
    return (/** @type {?} */ ((op + OP_ERROR)));
}
/**
 * Make the success EntityOp corresponding to the given EntityOp
 * @param {?} op
 * @return {?}
 */
export function makeSuccessOp(op) {
    return (/** @type {?} */ ((op + OP_SUCCESS)));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LW9wLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9hY3Rpb25zL2VudGl0eS1vcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztJQUtFLHlCQUF5QjtJQUN6QixnQkFBaUIsMkJBQTJCO0lBQzVDLGtCQUFtQiw2QkFBNkI7SUFFaEQsV0FBWSxzQkFBc0I7SUFDbEMsbUJBQW9CLDhCQUE4QjtJQUNsRCxpQkFBa0IsNEJBQTRCO0lBRTlDLFlBQWEsdUJBQXVCO0lBQ3BDLG9CQUFxQiwrQkFBK0I7SUFDcEQsa0JBQW1CLDZCQUE2QjtJQUVoRCxZQUFhLHVCQUF1QjtJQUNwQyxvQkFBcUIsK0JBQStCO0lBQ3BELGtCQUFtQiw2QkFBNkI7SUFFaEQsY0FBZSx5QkFBeUI7SUFDeEMsc0JBQXVCLGlDQUFpQztJQUN4RCxvQkFBcUIsK0JBQStCO0lBRXBELGVBQWdCLDBCQUEwQjtJQUMxQyxxQkFBc0IsZ0NBQWdDO0lBQ3RELHVCQUF3QixrQ0FBa0M7SUFFMUQsY0FBZSx5QkFBeUI7SUFDeEMsb0JBQXFCLCtCQUErQjtJQUNwRCxzQkFBdUIsaUNBQWlDO0lBRXhELGtCQUFtQiw2QkFBNkI7SUFDaEQsMEJBQTJCLHFDQUFxQztJQUNoRSx3QkFBeUIsbUNBQW1DO0lBRTVELGlCQUFrQiw0QkFBNEI7SUFDOUMseUJBQTBCLG9DQUFvQztJQUM5RCx1QkFBd0Isa0NBQWtDO0lBRTFELGtCQUFtQiw2QkFBNkI7SUFDaEQsMEJBQTJCLHFDQUFxQztJQUNoRSx3QkFBeUIsbUNBQW1DO0lBRTVELGlCQUFrQiw0QkFBNEI7SUFDOUMseUJBQTBCLG9DQUFvQztJQUM5RCx1QkFBd0Isa0NBQWtDO0lBRTFELDBDQUEwQztJQUMxQyxrQkFBbUIsNkJBQTZCO0lBQ2hELDBCQUEyQixxQ0FBcUM7SUFDaEUsd0JBQXlCLG1DQUFtQztJQUU1RCwwQ0FBMEM7SUFDMUMsaUJBQWtCLDRCQUE0QjtJQUM5Qyx5QkFBMEIsb0NBQW9DO0lBQzlELHVCQUF3QixrQ0FBa0M7SUFFMUQsbUJBQW1CO0lBQ25CLFNBQVUsb0JBQW9CO0lBQzlCLFVBQVcscUJBQXFCO0lBQ2hDLFNBQVUsb0JBQW9CO0lBQzlCLFlBQWEsdUJBQXVCO0lBQ3BDLGFBQWMsd0JBQXdCO0lBQ3RDLFlBQWEsdUJBQXVCO0lBQ3BDLGFBQWMsd0JBQXdCO0lBQ3RDLFlBQWEsdUJBQXVCO0lBQ3BDLGFBQWMsd0JBQXdCO0lBQ3RDLFlBQWEsdUJBQXVCO0lBRXBDLFlBQWEsdUJBQXVCO0lBQ3BDLGFBQWMsd0JBQXdCO0lBQ3RDLFlBQWEsdUJBQXVCO0lBQ3BDLFVBQVcscUJBQXFCO0lBQ2hDLFdBQVksc0JBQXNCO0lBQ2xDLFVBQVcscUJBQXFCO0lBRWhDLGtCQUFtQiw2QkFBNkI7SUFDaEQsZ0JBQWlCLDJCQUEyQjtJQUM1QyxZQUFhLHVCQUF1QjtJQUNwQyxZQUFhLHVCQUF1QjtJQUNwQyxhQUFjLHdCQUF3Qjs7Ozs7OztBQUl4QyxNQUFNLE9BQU8sVUFBVSxHQUFHLFVBQVU7Ozs7O0FBR3BDLE1BQU0sT0FBTyxRQUFRLEdBQUcsUUFBUTs7Ozs7O0FBR2hDLE1BQU0sVUFBVSxXQUFXLENBQUMsRUFBWTtJQUN0QyxPQUFPLG1CQUFVLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxFQUFBLENBQUM7QUFDbkMsQ0FBQzs7Ozs7O0FBR0QsTUFBTSxVQUFVLGFBQWEsQ0FBQyxFQUFZO0lBQ3hDLE9BQU8sbUJBQVUsQ0FBQyxFQUFFLEdBQUcsVUFBVSxDQUFDLEVBQUEsQ0FBQztBQUNyQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRW5zdXJlIHRoYXQgdGhlc2Ugc3VmZml4IHZhbHVlcyBhbmQgdGhlIEVudGl0eU9wIHN1ZmZpeGVzIG1hdGNoXG4vLyBDYW5ub3QgZG8gdGhhdCBwcm9ncmFtbWF0aWNhbGx5LlxuXG4vKiogR2VuZXJhbCBwdXJwb3NlIGVudGl0eSBhY3Rpb24gb3BlcmF0aW9ucywgZ29vZCBmb3IgYW55IGVudGl0eSB0eXBlICovXG5leHBvcnQgZW51bSBFbnRpdHlPcCB7XG4gIC8vIFBlcnNpc3RhbmNlIG9wZXJhdGlvbnNcbiAgQ0FOQ0VMX1BFUlNJU1QgPSAnQG5ncngvZGF0YS9jYW5jZWwtcGVyc2lzdCcsXG4gIENBTkNFTEVEX1BFUlNJU1QgPSAnQG5ncngvZGF0YS9jYW5jZWxlZC1wZXJzaXN0JyxcblxuICBRVUVSWV9BTEwgPSAnQG5ncngvZGF0YS9xdWVyeS1hbGwnLFxuICBRVUVSWV9BTExfU1VDQ0VTUyA9ICdAbmdyeC9kYXRhL3F1ZXJ5LWFsbC9zdWNjZXNzJyxcbiAgUVVFUllfQUxMX0VSUk9SID0gJ0BuZ3J4L2RhdGEvcXVlcnktYWxsL2Vycm9yJyxcblxuICBRVUVSWV9MT0FEID0gJ0BuZ3J4L2RhdGEvcXVlcnktbG9hZCcsXG4gIFFVRVJZX0xPQURfU1VDQ0VTUyA9ICdAbmdyeC9kYXRhL3F1ZXJ5LWxvYWQvc3VjY2VzcycsXG4gIFFVRVJZX0xPQURfRVJST1IgPSAnQG5ncngvZGF0YS9xdWVyeS1sb2FkL2Vycm9yJyxcblxuICBRVUVSWV9NQU5ZID0gJ0BuZ3J4L2RhdGEvcXVlcnktbWFueScsXG4gIFFVRVJZX01BTllfU1VDQ0VTUyA9ICdAbmdyeC9kYXRhL3F1ZXJ5LW1hbnkvc3VjY2VzcycsXG4gIFFVRVJZX01BTllfRVJST1IgPSAnQG5ncngvZGF0YS9xdWVyeS1tYW55L2Vycm9yJyxcblxuICBRVUVSWV9CWV9LRVkgPSAnQG5ncngvZGF0YS9xdWVyeS1ieS1rZXknLFxuICBRVUVSWV9CWV9LRVlfU1VDQ0VTUyA9ICdAbmdyeC9kYXRhL3F1ZXJ5LWJ5LWtleS9zdWNjZXNzJyxcbiAgUVVFUllfQllfS0VZX0VSUk9SID0gJ0BuZ3J4L2RhdGEvcXVlcnktYnkta2V5L2Vycm9yJyxcblxuICBTQVZFX0FERF9NQU5ZID0gJ0BuZ3J4L2RhdGEvc2F2ZS9hZGQtbWFueScsXG4gIFNBVkVfQUREX01BTllfRVJST1IgPSAnQG5ncngvZGF0YS9zYXZlL2FkZC1tYW55L2Vycm9yJyxcbiAgU0FWRV9BRERfTUFOWV9TVUNDRVNTID0gJ0BuZ3J4L2RhdGEvc2F2ZS9hZGQtbWFueS9zdWNjZXNzJyxcblxuICBTQVZFX0FERF9PTkUgPSAnQG5ncngvZGF0YS9zYXZlL2FkZC1vbmUnLFxuICBTQVZFX0FERF9PTkVfRVJST1IgPSAnQG5ncngvZGF0YS9zYXZlL2FkZC1vbmUvZXJyb3InLFxuICBTQVZFX0FERF9PTkVfU1VDQ0VTUyA9ICdAbmdyeC9kYXRhL3NhdmUvYWRkLW9uZS9zdWNjZXNzJyxcblxuICBTQVZFX0RFTEVURV9NQU5ZID0gJ0BuZ3J4L2RhdGEvc2F2ZS9kZWxldGUtbWFueScsXG4gIFNBVkVfREVMRVRFX01BTllfU1VDQ0VTUyA9ICdAbmdyeC9kYXRhL3NhdmUvZGVsZXRlLW1hbnkvc3VjY2VzcycsXG4gIFNBVkVfREVMRVRFX01BTllfRVJST1IgPSAnQG5ncngvZGF0YS9zYXZlL2RlbGV0ZS1tYW55L2Vycm9yJyxcblxuICBTQVZFX0RFTEVURV9PTkUgPSAnQG5ncngvZGF0YS9zYXZlL2RlbGV0ZS1vbmUnLFxuICBTQVZFX0RFTEVURV9PTkVfU1VDQ0VTUyA9ICdAbmdyeC9kYXRhL3NhdmUvZGVsZXRlLW9uZS9zdWNjZXNzJyxcbiAgU0FWRV9ERUxFVEVfT05FX0VSUk9SID0gJ0BuZ3J4L2RhdGEvc2F2ZS9kZWxldGUtb25lL2Vycm9yJyxcblxuICBTQVZFX1VQREFURV9NQU5ZID0gJ0BuZ3J4L2RhdGEvc2F2ZS91cGRhdGUtbWFueScsXG4gIFNBVkVfVVBEQVRFX01BTllfU1VDQ0VTUyA9ICdAbmdyeC9kYXRhL3NhdmUvdXBkYXRlLW1hbnkvc3VjY2VzcycsXG4gIFNBVkVfVVBEQVRFX01BTllfRVJST1IgPSAnQG5ncngvZGF0YS9zYXZlL3VwZGF0ZS1tYW55L2Vycm9yJyxcblxuICBTQVZFX1VQREFURV9PTkUgPSAnQG5ncngvZGF0YS9zYXZlL3VwZGF0ZS1vbmUnLFxuICBTQVZFX1VQREFURV9PTkVfU1VDQ0VTUyA9ICdAbmdyeC9kYXRhL3NhdmUvdXBkYXRlLW9uZS9zdWNjZXNzJyxcbiAgU0FWRV9VUERBVEVfT05FX0VSUk9SID0gJ0BuZ3J4L2RhdGEvc2F2ZS91cGRhdGUtb25lL2Vycm9yJyxcblxuICAvLyBVc2Ugb25seSBpZiB0aGUgc2VydmVyIHN1cHBvcnRzIHVwc2VydDtcbiAgU0FWRV9VUFNFUlRfTUFOWSA9ICdAbmdyeC9kYXRhL3NhdmUvdXBzZXJ0LW1hbnknLFxuICBTQVZFX1VQU0VSVF9NQU5ZX1NVQ0NFU1MgPSAnQG5ncngvZGF0YS9zYXZlL3Vwc2VydC1tYW55L3N1Y2Nlc3MnLFxuICBTQVZFX1VQU0VSVF9NQU5ZX0VSUk9SID0gJ0BuZ3J4L2RhdGEvc2F2ZS91cHNlcnQtbWFueS9lcnJvcicsXG5cbiAgLy8gVXNlIG9ubHkgaWYgdGhlIHNlcnZlciBzdXBwb3J0cyB1cHNlcnQ7XG4gIFNBVkVfVVBTRVJUX09ORSA9ICdAbmdyeC9kYXRhL3NhdmUvdXBzZXJ0LW9uZScsXG4gIFNBVkVfVVBTRVJUX09ORV9TVUNDRVNTID0gJ0BuZ3J4L2RhdGEvc2F2ZS91cHNlcnQtb25lL3N1Y2Nlc3MnLFxuICBTQVZFX1VQU0VSVF9PTkVfRVJST1IgPSAnQG5ncngvZGF0YS9zYXZlL3Vwc2VydC1vbmUvZXJyb3InLFxuXG4gIC8vIENhY2hlIG9wZXJhdGlvbnNcbiAgQUREX0FMTCA9ICdAbmdyeC9kYXRhL2FkZC1hbGwnLFxuICBBRERfTUFOWSA9ICdAbmdyeC9kYXRhL2FkZC1tYW55JyxcbiAgQUREX09ORSA9ICdAbmdyeC9kYXRhL2FkZC1vbmUnLFxuICBSRU1PVkVfQUxMID0gJ0BuZ3J4L2RhdGEvcmVtb3ZlLWFsbCcsXG4gIFJFTU9WRV9NQU5ZID0gJ0BuZ3J4L2RhdGEvcmVtb3ZlLW1hbnknLFxuICBSRU1PVkVfT05FID0gJ0BuZ3J4L2RhdGEvcmVtb3ZlLW9uZScsXG4gIFVQREFURV9NQU5ZID0gJ0BuZ3J4L2RhdGEvdXBkYXRlLW1hbnknLFxuICBVUERBVEVfT05FID0gJ0BuZ3J4L2RhdGEvdXBkYXRlLW9uZScsXG4gIFVQU0VSVF9NQU5ZID0gJ0BuZ3J4L2RhdGEvdXBzZXJ0LW1hbnknLFxuICBVUFNFUlRfT05FID0gJ0BuZ3J4L2RhdGEvdXBzZXJ0LW9uZScsXG5cbiAgQ09NTUlUX0FMTCA9ICdAbmdyeC9kYXRhL2NvbW1pdC1hbGwnLFxuICBDT01NSVRfTUFOWSA9ICdAbmdyeC9kYXRhL2NvbW1pdC1tYW55JyxcbiAgQ09NTUlUX09ORSA9ICdAbmdyeC9kYXRhL2NvbW1pdC1vbmUnLFxuICBVTkRPX0FMTCA9ICdAbmdyeC9kYXRhL3VuZG8tYWxsJyxcbiAgVU5ET19NQU5ZID0gJ0BuZ3J4L2RhdGEvdW5kby1tYW55JyxcbiAgVU5ET19PTkUgPSAnQG5ncngvZGF0YS91bmRvLW9uZScsXG5cbiAgU0VUX0NIQU5HRV9TVEFURSA9ICdAbmdyeC9kYXRhL3NldC1jaGFuZ2Utc3RhdGUnLFxuICBTRVRfQ09MTEVDVElPTiA9ICdAbmdyeC9kYXRhL3NldC1jb2xsZWN0aW9uJyxcbiAgU0VUX0ZJTFRFUiA9ICdAbmdyeC9kYXRhL3NldC1maWx0ZXInLFxuICBTRVRfTE9BREVEID0gJ0BuZ3J4L2RhdGEvc2V0LWxvYWRlZCcsXG4gIFNFVF9MT0FESU5HID0gJ0BuZ3J4L2RhdGEvc2V0LWxvYWRpbmcnLFxufVxuXG4vKiogXCJTdWNjZXNzXCIgc3VmZml4IGFwcGVuZGVkIHRvIEVudGl0eU9wcyB0aGF0IGFyZSBzdWNjZXNzZnVsLiovXG5leHBvcnQgY29uc3QgT1BfU1VDQ0VTUyA9ICcvc3VjY2Vzcyc7XG5cbi8qKiBcIkVycm9yXCIgc3VmZml4IGFwcGVuZGVkIHRvIEVudGl0eU9wcyB0aGF0IGhhdmUgZmFpbGVkLiovXG5leHBvcnQgY29uc3QgT1BfRVJST1IgPSAnL2Vycm9yJztcblxuLyoqIE1ha2UgdGhlIGVycm9yIEVudGl0eU9wIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuIEVudGl0eU9wICovXG5leHBvcnQgZnVuY3Rpb24gbWFrZUVycm9yT3Aob3A6IEVudGl0eU9wKTogRW50aXR5T3Age1xuICByZXR1cm4gPEVudGl0eU9wPihvcCArIE9QX0VSUk9SKTtcbn1cblxuLyoqIE1ha2UgdGhlIHN1Y2Nlc3MgRW50aXR5T3AgY29ycmVzcG9uZGluZyB0byB0aGUgZ2l2ZW4gRW50aXR5T3AgKi9cbmV4cG9ydCBmdW5jdGlvbiBtYWtlU3VjY2Vzc09wKG9wOiBFbnRpdHlPcCk6IEVudGl0eU9wIHtcbiAgcmV0dXJuIDxFbnRpdHlPcD4ob3AgKyBPUF9TVUNDRVNTKTtcbn1cbiJdfQ==