/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { EntityCollectionReducerMethodsFactory } from './entity-collection-reducer-methods';
/**
 * Create a default reducer for a specific entity collection
 */
export class EntityCollectionReducerFactory {
    /**
     * @param {?} methodsFactory
     */
    constructor(methodsFactory) {
        this.methodsFactory = methodsFactory;
    }
    /**
     * Create a default reducer for a collection of entities of T
     * @template T
     * @param {?} entityName
     * @return {?}
     */
    create(entityName) {
        /** @type {?} */
        const methods = this.methodsFactory.create(entityName);
        /** Perform Actions against a particular entity collection in the EntityCache */
        return (/**
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        function entityCollectionReducer(collection, action) {
            /** @type {?} */
            const reducerMethod = methods[action.payload.entityOp];
            return reducerMethod ? reducerMethod(collection, action) : collection;
        });
    }
}
EntityCollectionReducerFactory.decorators = [
    { type: Injectable }
];
/** @nocollapse */
EntityCollectionReducerFactory.ctorParameters = () => [
    { type: EntityCollectionReducerMethodsFactory }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    EntityCollectionReducerFactory.prototype.methodsFactory;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUkzQyxPQUFPLEVBQUUscUNBQXFDLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQzs7OztBQVM1RixNQUFNLE9BQU8sOEJBQThCOzs7O0lBQ3pDLFlBQW9CLGNBQXFEO1FBQXJELG1CQUFjLEdBQWQsY0FBYyxDQUF1QztJQUFHLENBQUM7Ozs7Ozs7SUFHN0UsTUFBTSxDQUFVLFVBQWtCOztjQUMxQixPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUksVUFBVSxDQUFDO1FBRXpELGdGQUFnRjtRQUNoRjs7Ozs7UUFBTyxTQUFTLHVCQUF1QixDQUNyQyxVQUErQixFQUMvQixNQUFvQjs7a0JBRWQsYUFBYSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztZQUN0RCxPQUFPLGFBQWEsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1FBQ3hFLENBQUMsRUFBQztJQUNKLENBQUM7OztZQWhCRixVQUFVOzs7O1lBUkYscUNBQXFDOzs7Ozs7O0lBVWhDLHdEQUE2RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb24gfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kc0ZhY3RvcnkgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXJlZHVjZXItbWV0aG9kcyc7XG5cbmV4cG9ydCB0eXBlIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyPFQgPSBhbnk+ID0gKFxuICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICBhY3Rpb246IEVudGl0eUFjdGlvblxuKSA9PiBFbnRpdHlDb2xsZWN0aW9uPFQ+O1xuXG4vKiogQ3JlYXRlIGEgZGVmYXVsdCByZWR1Y2VyIGZvciBhIHNwZWNpZmljIGVudGl0eSBjb2xsZWN0aW9uICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBtZXRob2RzRmFjdG9yeTogRW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzRmFjdG9yeSkge31cblxuICAvKiogQ3JlYXRlIGEgZGVmYXVsdCByZWR1Y2VyIGZvciBhIGNvbGxlY3Rpb24gb2YgZW50aXRpZXMgb2YgVCAqL1xuICBjcmVhdGU8VCA9IGFueT4oZW50aXR5TmFtZTogc3RyaW5nKTogRW50aXR5Q29sbGVjdGlvblJlZHVjZXI8VD4ge1xuICAgIGNvbnN0IG1ldGhvZHMgPSB0aGlzLm1ldGhvZHNGYWN0b3J5LmNyZWF0ZTxUPihlbnRpdHlOYW1lKTtcblxuICAgIC8qKiBQZXJmb3JtIEFjdGlvbnMgYWdhaW5zdCBhIHBhcnRpY3VsYXIgZW50aXR5IGNvbGxlY3Rpb24gaW4gdGhlIEVudGl0eUNhY2hlICovXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyKFxuICAgICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICAgIGFjdGlvbjogRW50aXR5QWN0aW9uXG4gICAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgICBjb25zdCByZWR1Y2VyTWV0aG9kID0gbWV0aG9kc1thY3Rpb24ucGF5bG9hZC5lbnRpdHlPcF07XG4gICAgICByZXR1cm4gcmVkdWNlck1ldGhvZCA/IHJlZHVjZXJNZXRob2QoY29sbGVjdGlvbiwgYWN0aW9uKSA6IGNvbGxlY3Rpb247XG4gICAgfTtcbiAgfVxufVxuIl19