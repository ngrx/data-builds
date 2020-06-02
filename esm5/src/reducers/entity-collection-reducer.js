/**
 * @fileoverview added by tsickle
 * Generated from: src/reducers/entity-collection-reducer.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { EntityCollectionReducerMethodsFactory } from './entity-collection-reducer-methods';
/**
 * Create a default reducer for a specific entity collection
 */
var EntityCollectionReducerFactory = /** @class */ (function () {
    function EntityCollectionReducerFactory(methodsFactory) {
        this.methodsFactory = methodsFactory;
    }
    /** Create a default reducer for a collection of entities of T */
    /**
     * Create a default reducer for a collection of entities of T
     * @template T
     * @param {?} entityName
     * @return {?}
     */
    EntityCollectionReducerFactory.prototype.create = /**
     * Create a default reducer for a collection of entities of T
     * @template T
     * @param {?} entityName
     * @return {?}
     */
    function (entityName) {
        /** @type {?} */
        var methods = this.methodsFactory.create(entityName);
        /** Perform Actions against a particular entity collection in the EntityCache */
        return (/**
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        function entityCollectionReducer(collection, action) {
            /** @type {?} */
            var reducerMethod = methods[action.payload.entityOp];
            return reducerMethod ? reducerMethod(collection, action) : collection;
        });
    };
    EntityCollectionReducerFactory.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    EntityCollectionReducerFactory.ctorParameters = function () { return [
        { type: EntityCollectionReducerMethodsFactory }
    ]; };
    return EntityCollectionReducerFactory;
}());
export { EntityCollectionReducerFactory };
if (false) {
    /**
     * @type {?}
     * @private
     */
    EntityCollectionReducerFactory.prototype.methodsFactory;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3J4L2RhdGEvIiwic291cmNlcyI6WyJzcmMvcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFJM0MsT0FBTyxFQUFFLHFDQUFxQyxFQUFFLE1BQU0scUNBQXFDLENBQUM7Ozs7QUFRNUY7SUFFRSx3Q0FBb0IsY0FBcUQ7UUFBckQsbUJBQWMsR0FBZCxjQUFjLENBQXVDO0lBQUcsQ0FBQztJQUU3RSxpRUFBaUU7Ozs7Ozs7SUFDakUsK0NBQU07Ozs7OztJQUFOLFVBQWdCLFVBQWtCOztZQUMxQixPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUksVUFBVSxDQUFDO1FBRXpELGdGQUFnRjtRQUNoRjs7Ozs7UUFBTyxTQUFTLHVCQUF1QixDQUNyQyxVQUErQixFQUMvQixNQUFvQjs7Z0JBRWQsYUFBYSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztZQUN0RCxPQUFPLGFBQWEsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1FBQ3hFLENBQUMsRUFBQztJQUNKLENBQUM7O2dCQWhCRixVQUFVOzs7O2dCQVJGLHFDQUFxQzs7SUF5QjlDLHFDQUFDO0NBQUEsQUFqQkQsSUFpQkM7U0FoQlksOEJBQThCOzs7Ozs7SUFDN0Isd0RBQTZEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbiB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzRmFjdG9yeSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1tZXRob2RzJztcblxuZXhwb3J0IHR5cGUgRW50aXR5Q29sbGVjdGlvblJlZHVjZXI8VCA9IGFueT4gPSAoXG4gIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gIGFjdGlvbjogRW50aXR5QWN0aW9uXG4pID0+IEVudGl0eUNvbGxlY3Rpb248VD47XG5cbi8qKiBDcmVhdGUgYSBkZWZhdWx0IHJlZHVjZXIgZm9yIGEgc3BlY2lmaWMgZW50aXR5IGNvbGxlY3Rpb24gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlckZhY3Rvcnkge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1ldGhvZHNGYWN0b3J5OiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlck1ldGhvZHNGYWN0b3J5KSB7fVxuXG4gIC8qKiBDcmVhdGUgYSBkZWZhdWx0IHJlZHVjZXIgZm9yIGEgY29sbGVjdGlvbiBvZiBlbnRpdGllcyBvZiBUICovXG4gIGNyZWF0ZTxUID0gYW55PihlbnRpdHlOYW1lOiBzdHJpbmcpOiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcjxUPiB7XG4gICAgY29uc3QgbWV0aG9kcyA9IHRoaXMubWV0aG9kc0ZhY3RvcnkuY3JlYXRlPFQ+KGVudGl0eU5hbWUpO1xuXG4gICAgLyoqIFBlcmZvcm0gQWN0aW9ucyBhZ2FpbnN0IGEgcGFydGljdWxhciBlbnRpdHkgY29sbGVjdGlvbiBpbiB0aGUgRW50aXR5Q2FjaGUgKi9cbiAgICByZXR1cm4gZnVuY3Rpb24gZW50aXR5Q29sbGVjdGlvblJlZHVjZXIoXG4gICAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgICAgYWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICAgIGNvbnN0IHJlZHVjZXJNZXRob2QgPSBtZXRob2RzW2FjdGlvbi5wYXlsb2FkLmVudGl0eU9wXTtcbiAgICAgIHJldHVybiByZWR1Y2VyTWV0aG9kID8gcmVkdWNlck1ldGhvZChjb2xsZWN0aW9uLCBhY3Rpb24pIDogY29sbGVjdGlvbjtcbiAgICB9O1xuICB9XG59XG4iXX0=