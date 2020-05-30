/**
 * @fileoverview added by tsickle
 * Generated from: src/selectors/entity-selectors$.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { filter, shareReplay } from 'rxjs/operators';
import { OP_ERROR } from '../actions/entity-op';
import { ofEntityType } from '../actions/entity-action-operators';
import { ENTITY_CACHE_SELECTOR_TOKEN, } from './entity-cache-selector';
/**
 * The selector observable functions for entity collection members.
 * @record
 * @template T
 */
export function EntitySelectors$() { }
if (false) {
    /**
     * Name of the entity collection for these selectors$
     * @type {?}
     */
    EntitySelectors$.prototype.entityName;
    /**
     * Observable of the collection as a whole
     * @type {?}
     */
    EntitySelectors$.prototype.collection$;
    /**
     * Observable of count of entities in the cached collection.
     * @type {?}
     */
    EntitySelectors$.prototype.count$;
    /**
     * Observable of all entities in the cached collection.
     * @type {?}
     */
    EntitySelectors$.prototype.entities$;
    /**
     * Observable of actions related to this entity type.
     * @type {?}
     */
    EntitySelectors$.prototype.entityActions$;
    /**
     * Observable of the map of entity keys to entities
     * @type {?}
     */
    EntitySelectors$.prototype.entityMap$;
    /**
     * Observable of error actions related to this entity type.
     * @type {?}
     */
    EntitySelectors$.prototype.errors$;
    /**
     * Observable of the filter pattern applied by the entity collection's filter function
     * @type {?}
     */
    EntitySelectors$.prototype.filter$;
    /**
     * Observable of entities in the cached collection that pass the filter function
     * @type {?}
     */
    EntitySelectors$.prototype.filteredEntities$;
    /**
     * Observable of the keys of the cached collection, in the collection's native sort order
     * @type {?}
     */
    EntitySelectors$.prototype.keys$;
    /**
     * Observable true when the collection has been loaded
     * @type {?}
     */
    EntitySelectors$.prototype.loaded$;
    /**
     * Observable true when a multi-entity query command is in progress.
     * @type {?}
     */
    EntitySelectors$.prototype.loading$;
    /**
     * ChangeState (including original values) of entities with unsaved changes
     * @type {?}
     */
    EntitySelectors$.prototype.changeState$;
    /* Skipping unhandled member: readonly [name: string]: Observable<any> | Store<any> | any;*/
}
/**
 * Creates observable EntitySelectors$ for entity collections.
 */
var EntitySelectors$Factory = /** @class */ (function () {
    function EntitySelectors$Factory(store, actions, selectEntityCache) {
        this.store = store;
        this.actions = actions;
        this.selectEntityCache = selectEntityCache;
        // This service applies to the cache in ngrx/store named `cacheName`
        this.entityCache$ = this.store.select(this.selectEntityCache);
        this.entityActionErrors$ = actions.pipe(filter((/**
         * @param {?} ea
         * @return {?}
         */
        function (ea) {
            return ea.payload &&
                ea.payload.entityOp &&
                ea.payload.entityOp.endsWith(OP_ERROR);
        })), shareReplay(1));
    }
    /**
     * Creates an entity collection's selectors$ observables for this factory's store.
     * `selectors$` are observable selectors of the cached entity collection.
     * @param entityName - is also the name of the collection.
     * @param selectors - selector functions for this collection.
     **/
    /**
     * Creates an entity collection's selectors$ observables for this factory's store.
     * `selectors$` are observable selectors of the cached entity collection.
     * @template T, S$
     * @param {?} entityName - is also the name of the collection.
     * @param {?} selectors - selector functions for this collection.
     *
     * @return {?}
     */
    EntitySelectors$Factory.prototype.create = /**
     * Creates an entity collection's selectors$ observables for this factory's store.
     * `selectors$` are observable selectors of the cached entity collection.
     * @template T, S$
     * @param {?} entityName - is also the name of the collection.
     * @param {?} selectors - selector functions for this collection.
     *
     * @return {?}
     */
    function (entityName, selectors) {
        var _this = this;
        /** @type {?} */
        var selectors$ = {
            entityName: entityName,
        };
        Object.keys(selectors).forEach((/**
         * @param {?} name
         * @return {?}
         */
        function (name) {
            if (name.startsWith('select')) {
                // strip 'select' prefix from the selector fn name and append `$`
                // Ex: 'selectEntities' => 'entities$'
                /** @type {?} */
                var name$ = name[6].toLowerCase() + name.substr(7) + '$';
                selectors$[name$] = _this.store.select(((/** @type {?} */ (selectors)))[name]);
            }
        }));
        selectors$.entityActions$ = this.actions.pipe(ofEntityType(entityName));
        selectors$.errors$ = this.entityActionErrors$.pipe(ofEntityType(entityName));
        return (/** @type {?} */ (selectors$));
    };
    EntitySelectors$Factory.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    EntitySelectors$Factory.ctorParameters = function () { return [
        { type: Store },
        { type: Actions },
        { type: undefined, decorators: [{ type: Inject, args: [ENTITY_CACHE_SELECTOR_TOKEN,] }] }
    ]; };
    return EntitySelectors$Factory;
}());
export { EntitySelectors$Factory };
if (false) {
    /**
     * Observable of the EntityCache
     * @type {?}
     */
    EntitySelectors$Factory.prototype.entityCache$;
    /**
     * Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types
     * @type {?}
     */
    EntitySelectors$Factory.prototype.entityActionErrors$;
    /**
     * @type {?}
     * @private
     */
    EntitySelectors$Factory.prototype.store;
    /**
     * @type {?}
     * @private
     */
    EntitySelectors$Factory.prototype.actions;
    /**
     * @type {?}
     * @private
     */
    EntitySelectors$Factory.prototype.selectEntityCache;
}
//# sourceMappingURL=entity-selectors$.js.map