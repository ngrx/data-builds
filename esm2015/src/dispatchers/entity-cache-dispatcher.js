/**
 * @fileoverview added by tsickle
 * Generated from: src/dispatchers/entity-cache-dispatcher.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable, Inject } from '@angular/core';
import { ScannedActionsSubject, Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { filter, mergeMap, shareReplay, take } from 'rxjs/operators';
import { CorrelationIdGenerator } from '../utils/correlation-id-generator';
import { EntityDispatcherDefaultOptions } from './entity-dispatcher-default-options';
import { PersistanceCanceled } from './entity-dispatcher';
import { ClearCollections, EntityCacheAction, LoadCollections, MergeQuerySet, SetEntityCache, SaveEntities, SaveEntitiesCancel, } from '../actions/entity-cache-action';
/**
 * Dispatches Entity Cache actions to the EntityCache reducer
 */
export class EntityCacheDispatcher {
    /**
     * @param {?} correlationIdGenerator
     * @param {?} defaultDispatcherOptions
     * @param {?} scannedActions$
     * @param {?} store
     */
    constructor(correlationIdGenerator, defaultDispatcherOptions, 
    /** Actions scanned by the store after it processed them with reducers. */
    scannedActions$, store) {
        this.correlationIdGenerator = correlationIdGenerator;
        this.defaultDispatcherOptions = defaultDispatcherOptions;
        this.store = store;
        // Replay because sometimes in tests will fake data service with synchronous observable
        // which makes subscriber miss the dispatched actions.
        // Of course that's a testing mistake. But easy to forget, leading to painful debugging.
        this.reducedActions$ = scannedActions$.pipe(shareReplay(1));
        // Start listening so late subscriber won't miss the most recent action.
        this.raSubscription = this.reducedActions$.subscribe();
    }
    /**
     * Dispatch an Action to the store.
     * @param {?} action the Action
     * @return {?} the dispatched Action
     */
    dispatch(action) {
        this.store.dispatch(action);
        return action;
    }
    /**
     * Dispatch action to cancel the saveEntities request with matching correlation id.
     * @param {?} correlationId The correlation id for the corresponding action
     * @param {?=} reason
     * @param {?=} entityNames
     * @param {?=} tag
     * @return {?}
     */
    cancelSaveEntities(correlationId, reason, entityNames, tag) {
        if (!correlationId) {
            throw new Error('Missing correlationId');
        }
        /** @type {?} */
        const action = new SaveEntitiesCancel(correlationId, reason, entityNames, tag);
        this.dispatch(action);
    }
    /**
     * Clear the named entity collections in cache
     * @param {?=} collections
     * @param {?=} tag
     * @return {?}
     */
    clearCollections(collections, tag) {
        this.dispatch(new ClearCollections(collections, tag));
    }
    /**
     * Load multiple entity collections at the same time.
     * before any selectors$ observables emit.
     * @param {?} collections The collections to load, typically the result of a query.
     * @param {?=} tag
     * @return {?}
     */
    loadCollections(collections, tag) {
        this.dispatch(new LoadCollections(collections, tag));
    }
    /**
     * Merges entities from a query result
     * that returned entities from multiple collections.
     * Corresponding entity cache reducer should add and update all collections
     * at the same time, before any selectors$ observables emit.
     * @param {?} querySet The result of the query in the form of a map of entity collections.
     * These are the entity data to merge into the respective collections.
     * @param {?=} mergeStrategy How to merge a queried entity when it is already in the collection.
     * The default is MergeStrategy.PreserveChanges
     * @param {?=} tag
     * @return {?}
     */
    mergeQuerySet(querySet, mergeStrategy, tag) {
        this.dispatch(new MergeQuerySet(querySet, mergeStrategy, tag));
    }
    /**
     * Create entity cache action for replacing the entire entity cache.
     * Dangerous because brute force but useful as when re-hydrating an EntityCache
     * from local browser storage when the application launches.
     * @param {?} cache New state of the entity cache
     * @param {?=} tag
     * @return {?}
     */
    setEntityCache(cache, tag) {
        this.dispatch(new SetEntityCache(cache, tag));
    }
    /**
     * Dispatch action to save multiple entity changes to remote storage.
     * Relies on an Ngrx Effect such as EntityEffects.saveEntities$.
     * Important: only call if your server supports the SaveEntities protocol
     * through your EntityDataService.saveEntities method.
     * @param {?} changes Either the entities to save, as an array of {ChangeSetItem}, or
     * a ChangeSet that holds such changes.
     * @param {?} url The server url which receives the save request
     * @param {?=} options
     * @return {?} A terminating Observable<ChangeSet> with data returned from the server
     * after server reports successful save OR the save error.
     * TODO: should return the matching entities from cache rather than the raw server data.
     */
    saveEntities(changes, url, options) {
        /** @type {?} */
        const changeSet = Array.isArray(changes) ? { changes } : changes;
        options = options || {};
        /** @type {?} */
        const correlationId = options.correlationId == null
            ? this.correlationIdGenerator.next()
            : options.correlationId;
        /** @type {?} */
        const isOptimistic = options.isOptimistic == null
            ? this.defaultDispatcherOptions.optimisticSaveEntities || false
            : options.isOptimistic === true;
        /** @type {?} */
        const tag = options.tag || 'Save Entities';
        options = Object.assign(Object.assign({}, options), { correlationId, isOptimistic, tag });
        /** @type {?} */
        const action = new SaveEntities(changeSet, url, options);
        this.dispatch(action);
        return this.getSaveEntitiesResponseData$(options.correlationId).pipe(shareReplay(1));
    }
    /**
     * Return Observable of data from the server-success SaveEntities action with
     * the given Correlation Id, after that action was processed by the ngrx store.
     * or else put the server error on the Observable error channel.
     * @private
     * @param {?} crid The correlationId for both the save and response actions.
     * @return {?}
     */
    getSaveEntitiesResponseData$(crid) {
        /**
         * reducedActions$ must be replay observable of the most recent action reduced by the store.
         * because the response action might have been dispatched to the store
         * before caller had a chance to subscribe.
         */
        return this.reducedActions$.pipe(filter((/**
         * @param {?} act
         * @return {?}
         */
        (act) => act.type === EntityCacheAction.SAVE_ENTITIES_SUCCESS ||
            act.type === EntityCacheAction.SAVE_ENTITIES_ERROR ||
            act.type === EntityCacheAction.SAVE_ENTITIES_CANCEL)), filter((/**
         * @param {?} act
         * @return {?}
         */
        (act) => crid === ((/** @type {?} */ (act))).payload.correlationId)), take(1), mergeMap((/**
         * @param {?} act
         * @return {?}
         */
        act => {
            return act.type === EntityCacheAction.SAVE_ENTITIES_CANCEL
                ? throwError(new PersistanceCanceled(((/** @type {?} */ (act))).payload.reason))
                : act.type === EntityCacheAction.SAVE_ENTITIES_SUCCESS
                    ? of(((/** @type {?} */ (act))).payload.changeSet)
                    : throwError(((/** @type {?} */ (act))).payload);
        })));
    }
}
EntityCacheDispatcher.decorators = [
    { type: Injectable },
];
/** @nocollapse */
EntityCacheDispatcher.ctorParameters = () => [
    { type: CorrelationIdGenerator },
    { type: EntityDispatcherDefaultOptions },
    { type: Observable, decorators: [{ type: Inject, args: [ScannedActionsSubject,] }] },
    { type: Store }
];
if (false) {
    /**
     * Actions scanned by the store after it processed them with reducers.
     * A replay observable of the most recent action reduced by the store.
     * @type {?}
     */
    EntityCacheDispatcher.prototype.reducedActions$;
    /**
     * @type {?}
     * @private
     */
    EntityCacheDispatcher.prototype.raSubscription;
    /**
     * Generates correlation ids for query and save methods
     * @type {?}
     * @private
     */
    EntityCacheDispatcher.prototype.correlationIdGenerator;
    /**
     * Dispatcher options configure dispatcher behavior such as
     * whether add is optimistic or pessimistic by default.
     * @type {?}
     * @private
     */
    EntityCacheDispatcher.prototype.defaultDispatcherOptions;
    /**
     * The store, scoped to the EntityCache
     * @type {?}
     * @private
     */
    EntityCacheDispatcher.prototype.store;
}
//# sourceMappingURL=entity-cache-dispatcher.js.map