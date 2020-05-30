/**
 * @fileoverview added by tsickle
 * Generated from: src/selectors/entity-cache-selector.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { InjectionToken, Optional } from '@angular/core';
import { createFeatureSelector } from '@ngrx/store';
import { ENTITY_CACHE_NAME, ENTITY_CACHE_NAME_TOKEN, } from '../reducers/constants';
/** @type {?} */
export const ENTITY_CACHE_SELECTOR_TOKEN = new InjectionToken('@ngrx/data/entity-cache-selector');
/** @type {?} */
export const entityCacheSelectorProvider = {
    provide: ENTITY_CACHE_SELECTOR_TOKEN,
    useFactory: createEntityCacheSelector,
    deps: [[new Optional(), ENTITY_CACHE_NAME_TOKEN]],
};
/**
 * @param {?=} entityCacheName
 * @return {?}
 */
export function createEntityCacheSelector(entityCacheName) {
    entityCacheName = entityCacheName || ENTITY_CACHE_NAME;
    return createFeatureSelector(entityCacheName);
}
//# sourceMappingURL=entity-cache-selector.js.map