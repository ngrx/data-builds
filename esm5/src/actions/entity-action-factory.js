var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * @fileoverview added by tsickle
 * Generated from: src/actions/entity-action-factory.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
var EntityActionFactory = /** @class */ (function () {
    function EntityActionFactory() {
    }
    // polymorphic create for the two signatures
    // polymorphic create for the two signatures
    /**
     * @template P
     * @param {?} nameOrPayload
     * @param {?=} entityOp
     * @param {?=} data
     * @param {?=} options
     * @return {?}
     */
    EntityActionFactory.prototype.create = 
    // polymorphic create for the two signatures
    /**
     * @template P
     * @param {?} nameOrPayload
     * @param {?=} entityOp
     * @param {?=} data
     * @param {?=} options
     * @return {?}
     */
    function (nameOrPayload, entityOp, data, options) {
        /** @type {?} */
        var payload = typeof nameOrPayload === 'string'
            ? ((/** @type {?} */ (__assign(__assign({}, (options || {})), { entityName: nameOrPayload, entityOp: entityOp,
                data: data }))))
            : nameOrPayload;
        return this.createCore(payload);
    };
    /**
     * Create an EntityAction to perform an operation (op) for a particular entity type
     * (entityName) with optional data and other optional flags
     * @param payload Defines the EntityAction and its options
     */
    /**
     * Create an EntityAction to perform an operation (op) for a particular entity type
     * (entityName) with optional data and other optional flags
     * @protected
     * @template P
     * @param {?} payload Defines the EntityAction and its options
     * @return {?}
     */
    EntityActionFactory.prototype.createCore = /**
     * Create an EntityAction to perform an operation (op) for a particular entity type
     * (entityName) with optional data and other optional flags
     * @protected
     * @template P
     * @param {?} payload Defines the EntityAction and its options
     * @return {?}
     */
    function (payload) {
        var entityName = payload.entityName, entityOp = payload.entityOp, tag = payload.tag;
        if (!entityName) {
            throw new Error('Missing entity name for new action');
        }
        if (entityOp == null) {
            throw new Error('Missing EntityOp for new action');
        }
        /** @type {?} */
        var type = this.formatActionType(entityOp, tag || entityName);
        return { type: type, payload: payload };
    };
    /**
     * Create an EntityAction from another EntityAction, replacing properties with those from newPayload;
     * @param from Source action that is the base for the new action
     * @param newProperties New EntityAction properties that replace the source action properties
     */
    /**
     * Create an EntityAction from another EntityAction, replacing properties with those from newPayload;
     * @template P
     * @param {?} from Source action that is the base for the new action
     * @param {?} newProperties New EntityAction properties that replace the source action properties
     * @return {?}
     */
    EntityActionFactory.prototype.createFromAction = /**
     * Create an EntityAction from another EntityAction, replacing properties with those from newPayload;
     * @template P
     * @param {?} from Source action that is the base for the new action
     * @param {?} newProperties New EntityAction properties that replace the source action properties
     * @return {?}
     */
    function (from, newProperties) {
        return this.create(__assign(__assign({}, from.payload), newProperties));
    };
    /**
     * @param {?} op
     * @param {?} tag
     * @return {?}
     */
    EntityActionFactory.prototype.formatActionType = /**
     * @param {?} op
     * @param {?} tag
     * @return {?}
     */
    function (op, tag) {
        return "[" + tag + "] " + op;
        // return `${op} [${tag}]`.toUpperCase(); // example of an alternative
    };
    EntityActionFactory.decorators = [
        { type: Injectable }
    ];
    return EntityActionFactory;
}());
export { EntityActionFactory };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWFjdGlvbi1mYWN0b3J5LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5ncngvZGF0YS8iLCJzb3VyY2VzIjpbInNyYy9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQVEzQztJQUFBO0lBNEVBLENBQUM7SUFwREMsNENBQTRDOzs7Ozs7Ozs7O0lBQzVDLG9DQUFNOzs7Ozs7Ozs7O0lBQU4sVUFDRSxhQUE4QyxFQUM5QyxRQUFtQixFQUNuQixJQUFRLEVBQ1IsT0FBNkI7O1lBRXZCLE9BQU8sR0FDWCxPQUFPLGFBQWEsS0FBSyxRQUFRO1lBQy9CLENBQUMsQ0FBQyxDQUFDLHlDQUNJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxLQUNsQixVQUFVLEVBQUUsYUFBYSxFQUN6QixRQUFRLFVBQUE7Z0JBQ1IsSUFBSSxNQUFBLEtBQ3FCLENBQUM7WUFDOUIsQ0FBQyxDQUFDLGFBQWE7UUFDbkIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7OztPQUlHOzs7Ozs7Ozs7SUFDTyx3Q0FBVTs7Ozs7Ozs7SUFBcEIsVUFBOEIsT0FBK0I7UUFDbkQsSUFBQSwrQkFBVSxFQUFFLDJCQUFRLEVBQUUsaUJBQUc7UUFDakMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQztTQUN2RDtRQUNELElBQUksUUFBUSxJQUFJLElBQUksRUFBRTtZQUNwQixNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7U0FDcEQ7O1lBQ0ssSUFBSSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLFVBQVUsQ0FBQztRQUMvRCxPQUFPLEVBQUUsSUFBSSxNQUFBLEVBQUUsT0FBTyxTQUFBLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQ7Ozs7T0FJRzs7Ozs7Ozs7SUFDSCw4Q0FBZ0I7Ozs7Ozs7SUFBaEIsVUFDRSxJQUFrQixFQUNsQixhQUE4QztRQUU5QyxPQUFPLElBQUksQ0FBQyxNQUFNLHVCQUFNLElBQUksQ0FBQyxPQUFPLEdBQUssYUFBYSxFQUFHLENBQUM7SUFDNUQsQ0FBQzs7Ozs7O0lBRUQsOENBQWdCOzs7OztJQUFoQixVQUFpQixFQUFVLEVBQUUsR0FBVztRQUN0QyxPQUFPLE1BQUksR0FBRyxVQUFLLEVBQUksQ0FBQztRQUN4QixzRUFBc0U7SUFDeEUsQ0FBQzs7Z0JBM0VGLFVBQVU7O0lBNEVYLDBCQUFDO0NBQUEsQUE1RUQsSUE0RUM7U0EzRVksbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBFbnRpdHlPcCB9IGZyb20gJy4vZW50aXR5LW9wJztcbmltcG9ydCB7XG4gIEVudGl0eUFjdGlvbixcbiAgRW50aXR5QWN0aW9uT3B0aW9ucyxcbiAgRW50aXR5QWN0aW9uUGF5bG9hZCxcbn0gZnJvbSAnLi9lbnRpdHktYWN0aW9uJztcbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlBY3Rpb25GYWN0b3J5IHtcbiAgLyoqXG4gICAqIENyZWF0ZSBhbiBFbnRpdHlBY3Rpb24gdG8gcGVyZm9ybSBhbiBvcGVyYXRpb24gKG9wKSBmb3IgYSBwYXJ0aWN1bGFyIGVudGl0eSB0eXBlXG4gICAqIChlbnRpdHlOYW1lKSB3aXRoIG9wdGlvbmFsIGRhdGEgYW5kIG90aGVyIG9wdGlvbmFsIGZsYWdzXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBlbnRpdHlPcCBPcGVyYXRpb24gdG8gcGVyZm9ybSAoRW50aXR5T3ApXG4gICAqIEBwYXJhbSBbZGF0YV0gZGF0YSBmb3IgdGhlIG9wZXJhdGlvblxuICAgKiBAcGFyYW0gW29wdGlvbnNdIGFkZGl0aW9uYWwgb3B0aW9uc1xuICAgKi9cbiAgY3JlYXRlPFAgPSBhbnk+KFxuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICBlbnRpdHlPcDogRW50aXR5T3AsXG4gICAgZGF0YT86IFAsXG4gICAgb3B0aW9ucz86IEVudGl0eUFjdGlvbk9wdGlvbnNcbiAgKTogRW50aXR5QWN0aW9uPFA+O1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gRW50aXR5QWN0aW9uIHRvIHBlcmZvcm0gYW4gb3BlcmF0aW9uIChvcCkgZm9yIGEgcGFydGljdWxhciBlbnRpdHkgdHlwZVxuICAgKiAoZW50aXR5TmFtZSkgd2l0aCBvcHRpb25hbCBkYXRhIGFuZCBvdGhlciBvcHRpb25hbCBmbGFnc1xuICAgKiBAcGFyYW0gcGF5bG9hZCBEZWZpbmVzIHRoZSBFbnRpdHlBY3Rpb24gYW5kIGl0cyBvcHRpb25zXG4gICAqL1xuICBjcmVhdGU8UCA9IGFueT4ocGF5bG9hZDogRW50aXR5QWN0aW9uUGF5bG9hZDxQPik6IEVudGl0eUFjdGlvbjxQPjtcblxuICAvLyBwb2x5bW9ycGhpYyBjcmVhdGUgZm9yIHRoZSB0d28gc2lnbmF0dXJlc1xuICBjcmVhdGU8UCA9IGFueT4oXG4gICAgbmFtZU9yUGF5bG9hZDogRW50aXR5QWN0aW9uUGF5bG9hZDxQPiB8IHN0cmluZyxcbiAgICBlbnRpdHlPcD86IEVudGl0eU9wLFxuICAgIGRhdGE/OiBQLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IEVudGl0eUFjdGlvbjxQPiB7XG4gICAgY29uc3QgcGF5bG9hZDogRW50aXR5QWN0aW9uUGF5bG9hZDxQPiA9XG4gICAgICB0eXBlb2YgbmFtZU9yUGF5bG9hZCA9PT0gJ3N0cmluZydcbiAgICAgICAgPyAoe1xuICAgICAgICAgICAgLi4uKG9wdGlvbnMgfHwge30pLFxuICAgICAgICAgICAgZW50aXR5TmFtZTogbmFtZU9yUGF5bG9hZCxcbiAgICAgICAgICAgIGVudGl0eU9wLFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICB9IGFzIEVudGl0eUFjdGlvblBheWxvYWQ8UD4pXG4gICAgICAgIDogbmFtZU9yUGF5bG9hZDtcbiAgICByZXR1cm4gdGhpcy5jcmVhdGVDb3JlKHBheWxvYWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiBFbnRpdHlBY3Rpb24gdG8gcGVyZm9ybSBhbiBvcGVyYXRpb24gKG9wKSBmb3IgYSBwYXJ0aWN1bGFyIGVudGl0eSB0eXBlXG4gICAqIChlbnRpdHlOYW1lKSB3aXRoIG9wdGlvbmFsIGRhdGEgYW5kIG90aGVyIG9wdGlvbmFsIGZsYWdzXG4gICAqIEBwYXJhbSBwYXlsb2FkIERlZmluZXMgdGhlIEVudGl0eUFjdGlvbiBhbmQgaXRzIG9wdGlvbnNcbiAgICovXG4gIHByb3RlY3RlZCBjcmVhdGVDb3JlPFAgPSBhbnk+KHBheWxvYWQ6IEVudGl0eUFjdGlvblBheWxvYWQ8UD4pIHtcbiAgICBjb25zdCB7IGVudGl0eU5hbWUsIGVudGl0eU9wLCB0YWcgfSA9IHBheWxvYWQ7XG4gICAgaWYgKCFlbnRpdHlOYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgZW50aXR5IG5hbWUgZm9yIG5ldyBhY3Rpb24nKTtcbiAgICB9XG4gICAgaWYgKGVudGl0eU9wID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBFbnRpdHlPcCBmb3IgbmV3IGFjdGlvbicpO1xuICAgIH1cbiAgICBjb25zdCB0eXBlID0gdGhpcy5mb3JtYXRBY3Rpb25UeXBlKGVudGl0eU9wLCB0YWcgfHwgZW50aXR5TmFtZSk7XG4gICAgcmV0dXJuIHsgdHlwZSwgcGF5bG9hZCB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiBFbnRpdHlBY3Rpb24gZnJvbSBhbm90aGVyIEVudGl0eUFjdGlvbiwgcmVwbGFjaW5nIHByb3BlcnRpZXMgd2l0aCB0aG9zZSBmcm9tIG5ld1BheWxvYWQ7XG4gICAqIEBwYXJhbSBmcm9tIFNvdXJjZSBhY3Rpb24gdGhhdCBpcyB0aGUgYmFzZSBmb3IgdGhlIG5ldyBhY3Rpb25cbiAgICogQHBhcmFtIG5ld1Byb3BlcnRpZXMgTmV3IEVudGl0eUFjdGlvbiBwcm9wZXJ0aWVzIHRoYXQgcmVwbGFjZSB0aGUgc291cmNlIGFjdGlvbiBwcm9wZXJ0aWVzXG4gICAqL1xuICBjcmVhdGVGcm9tQWN0aW9uPFAgPSBhbnk+KFxuICAgIGZyb206IEVudGl0eUFjdGlvbixcbiAgICBuZXdQcm9wZXJ0aWVzOiBQYXJ0aWFsPEVudGl0eUFjdGlvblBheWxvYWQ8UD4+XG4gICk6IEVudGl0eUFjdGlvbjxQPiB7XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlKHsgLi4uZnJvbS5wYXlsb2FkLCAuLi5uZXdQcm9wZXJ0aWVzIH0pO1xuICB9XG5cbiAgZm9ybWF0QWN0aW9uVHlwZShvcDogc3RyaW5nLCB0YWc6IHN0cmluZykge1xuICAgIHJldHVybiBgWyR7dGFnfV0gJHtvcH1gO1xuICAgIC8vIHJldHVybiBgJHtvcH0gWyR7dGFnfV1gLnRvVXBwZXJDYXNlKCk7IC8vIGV4YW1wbGUgb2YgYW4gYWx0ZXJuYXRpdmVcbiAgfVxufVxuIl19