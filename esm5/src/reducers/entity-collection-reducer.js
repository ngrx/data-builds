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
        { type: Injectable },
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
//# sourceMappingURL=entity-collection-reducer.js.map