/**
 * @fileoverview added by tsickle
 * Generated from: src/reducers/entity-collection-reducer-registry.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, Injectable, Optional } from '@angular/core';
import { compose } from '@ngrx/store';
import { ENTITY_COLLECTION_META_REDUCERS } from './constants';
import { EntityCollectionReducerFactory, } from './entity-collection-reducer';
/**
 * A hash of EntityCollectionReducers
 * @record
 */
export function EntityCollectionReducers() { }
/**
 * Registry of entity types and their previously-constructed reducers.
 * Can create a new CollectionReducer, which it registers for subsequent use.
 */
var EntityCollectionReducerRegistry = /** @class */ (function () {
    function EntityCollectionReducerRegistry(entityCollectionReducerFactory, entityCollectionMetaReducers) {
        this.entityCollectionReducerFactory = entityCollectionReducerFactory;
        this.entityCollectionReducers = {};
        this.entityCollectionMetaReducer = (/** @type {?} */ (compose.apply(null, entityCollectionMetaReducers || [])));
    }
    /**
     * Get the registered EntityCollectionReducer<T> for this entity type or create one and register it.
     * @param entityName Name of the entity type for this reducer
     */
    /**
     * Get the registered EntityCollectionReducer<T> for this entity type or create one and register it.
     * @template T
     * @param {?} entityName Name of the entity type for this reducer
     * @return {?}
     */
    EntityCollectionReducerRegistry.prototype.getOrCreateReducer = /**
     * Get the registered EntityCollectionReducer<T> for this entity type or create one and register it.
     * @template T
     * @param {?} entityName Name of the entity type for this reducer
     * @return {?}
     */
    function (entityName) {
        /** @type {?} */
        var reducer = this.entityCollectionReducers[entityName];
        if (!reducer) {
            reducer = this.entityCollectionReducerFactory.create(entityName);
            reducer = this.registerReducer(entityName, reducer);
            this.entityCollectionReducers[entityName] = reducer;
        }
        return reducer;
    };
    /**
     * Register an EntityCollectionReducer for an entity type
     * @param entityName - the name of the entity type
     * @param reducer - reducer for that entity type
     *
     * Examples:
     *   registerReducer('Hero', myHeroReducer);
     *   registerReducer('Villain', myVillainReducer);
     */
    /**
     * Register an EntityCollectionReducer for an entity type
     * @template T
     * @param {?} entityName - the name of the entity type
     * @param {?} reducer - reducer for that entity type
     *
     * Examples:
     *   registerReducer('Hero', myHeroReducer);
     *   registerReducer('Villain', myVillainReducer);
     * @return {?}
     */
    EntityCollectionReducerRegistry.prototype.registerReducer = /**
     * Register an EntityCollectionReducer for an entity type
     * @template T
     * @param {?} entityName - the name of the entity type
     * @param {?} reducer - reducer for that entity type
     *
     * Examples:
     *   registerReducer('Hero', myHeroReducer);
     *   registerReducer('Villain', myVillainReducer);
     * @return {?}
     */
    function (entityName, reducer) {
        reducer = this.entityCollectionMetaReducer((/** @type {?} */ (reducer)));
        return (this.entityCollectionReducers[entityName.trim()] = reducer);
    };
    /**
     * Register a batch of EntityCollectionReducers.
     * @param reducers - reducers to merge into existing reducers
     *
     * Examples:
     *   registerReducers({
     *     Hero: myHeroReducer,
     *     Villain: myVillainReducer
     *   });
     */
    /**
     * Register a batch of EntityCollectionReducers.
     * @param {?} reducers - reducers to merge into existing reducers
     *
     * Examples:
     *   registerReducers({
     *     Hero: myHeroReducer,
     *     Villain: myVillainReducer
     *   });
     * @return {?}
     */
    EntityCollectionReducerRegistry.prototype.registerReducers = /**
     * Register a batch of EntityCollectionReducers.
     * @param {?} reducers - reducers to merge into existing reducers
     *
     * Examples:
     *   registerReducers({
     *     Hero: myHeroReducer,
     *     Villain: myVillainReducer
     *   });
     * @return {?}
     */
    function (reducers) {
        var _this = this;
        /** @type {?} */
        var keys = reducers ? Object.keys(reducers) : [];
        keys.forEach((/**
         * @param {?} key
         * @return {?}
         */
        function (key) { return _this.registerReducer(key, reducers[key]); }));
    };
    EntityCollectionReducerRegistry.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    EntityCollectionReducerRegistry.ctorParameters = function () { return [
        { type: EntityCollectionReducerFactory },
        { type: Array, decorators: [{ type: Optional }, { type: Inject, args: [ENTITY_COLLECTION_META_REDUCERS,] }] }
    ]; };
    return EntityCollectionReducerRegistry;
}());
export { EntityCollectionReducerRegistry };
if (false) {
    /**
     * @type {?}
     * @protected
     */
    EntityCollectionReducerRegistry.prototype.entityCollectionReducers;
    /**
     * @type {?}
     * @private
     */
    EntityCollectionReducerRegistry.prototype.entityCollectionMetaReducer;
    /**
     * @type {?}
     * @private
     */
    EntityCollectionReducerRegistry.prototype.entityCollectionReducerFactory;
}
//# sourceMappingURL=entity-collection-reducer-registry.js.map