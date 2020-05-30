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
 * Generated from: src/dispatchers/entity-dispatcher-factory.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, Injectable } from '@angular/core';
import { Store, ScannedActionsSubject } from '@ngrx/store';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { CorrelationIdGenerator } from '../utils/correlation-id-generator';
import { EntityDispatcherDefaultOptions } from './entity-dispatcher-default-options';
import { defaultSelectId } from '../utils/utilities';
import { EntityActionFactory } from '../actions/entity-action-factory';
import { ENTITY_CACHE_SELECTOR_TOKEN, } from '../selectors/entity-cache-selector';
import { EntityDispatcherBase } from './entity-dispatcher-base';
/**
 * Creates EntityDispatchers for entity collections
 */
var EntityDispatcherFactory = /** @class */ (function () {
    function EntityDispatcherFactory(entityActionFactory, store, entityDispatcherDefaultOptions, scannedActions$, entityCacheSelector, correlationIdGenerator) {
        this.entityActionFactory = entityActionFactory;
        this.store = store;
        this.entityDispatcherDefaultOptions = entityDispatcherDefaultOptions;
        this.entityCacheSelector = entityCacheSelector;
        this.correlationIdGenerator = correlationIdGenerator;
        // Replay because sometimes in tests will fake data service with synchronous observable
        // which makes subscriber miss the dispatched actions.
        // Of course that's a testing mistake. But easy to forget, leading to painful debugging.
        this.reducedActions$ = scannedActions$.pipe(shareReplay(1));
        // Start listening so late subscriber won't miss the most recent action.
        this.raSubscription = this.reducedActions$.subscribe();
    }
    /**
     * Create an `EntityDispatcher` for an entity type `T` and store.
     */
    /**
     * Create an `EntityDispatcher` for an entity type `T` and store.
     * @template T
     * @param {?} entityName
     * @param {?=} selectId
     * @param {?=} defaultOptions
     * @return {?}
     */
    EntityDispatcherFactory.prototype.create = /**
     * Create an `EntityDispatcher` for an entity type `T` and store.
     * @template T
     * @param {?} entityName
     * @param {?=} selectId
     * @param {?=} defaultOptions
     * @return {?}
     */
    function (
    /** Name of the entity type */
    entityName, 
    /**
     * Function that returns the primary key for an entity `T`.
     * Usually acquired from `EntityDefinition` metadata.
     */
    selectId, 
    /** Defaults for options that influence dispatcher behavior such as whether
     * `add()` is optimistic or pessimistic;
     */
    defaultOptions) {
        if (selectId === void 0) { selectId = defaultSelectId; }
        if (defaultOptions === void 0) { defaultOptions = {}; }
        // merge w/ defaultOptions with injected defaults
        /** @type {?} */
        var options = __assign(__assign({}, this.entityDispatcherDefaultOptions), defaultOptions);
        return new EntityDispatcherBase(entityName, this.entityActionFactory, this.store, selectId, options, this.reducedActions$, this.entityCacheSelector, this.correlationIdGenerator);
    };
    /**
     * @return {?}
     */
    EntityDispatcherFactory.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.raSubscription.unsubscribe();
    };
    EntityDispatcherFactory.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    EntityDispatcherFactory.ctorParameters = function () { return [
        { type: EntityActionFactory },
        { type: Store },
        { type: EntityDispatcherDefaultOptions },
        { type: Observable, decorators: [{ type: Inject, args: [ScannedActionsSubject,] }] },
        { type: undefined, decorators: [{ type: Inject, args: [ENTITY_CACHE_SELECTOR_TOKEN,] }] },
        { type: CorrelationIdGenerator }
    ]; };
    return EntityDispatcherFactory;
}());
export { EntityDispatcherFactory };
if (false) {
    /**
     * Actions scanned by the store after it processed them with reducers.
     * A replay observable of the most recent action reduced by the store.
     * @type {?}
     */
    EntityDispatcherFactory.prototype.reducedActions$;
    /**
     * @type {?}
     * @private
     */
    EntityDispatcherFactory.prototype.raSubscription;
    /**
     * @type {?}
     * @private
     */
    EntityDispatcherFactory.prototype.entityActionFactory;
    /**
     * @type {?}
     * @private
     */
    EntityDispatcherFactory.prototype.store;
    /**
     * @type {?}
     * @private
     */
    EntityDispatcherFactory.prototype.entityDispatcherDefaultOptions;
    /**
     * @type {?}
     * @private
     */
    EntityDispatcherFactory.prototype.entityCacheSelector;
    /**
     * @type {?}
     * @private
     */
    EntityDispatcherFactory.prototype.correlationIdGenerator;
}
//# sourceMappingURL=entity-dispatcher-factory.js.map