import { InjectionToken, FactoryProvider } from '@angular/core';
import { MemoizedSelector } from '@ngrx/store';
import { EntityCache } from '../reducers/entity-cache';
export declare const ENTITY_CACHE_SELECTOR_TOKEN: InjectionToken<MemoizedSelector<Object, EntityCache>>;
export declare const entityCacheSelectorProvider: FactoryProvider;
export declare type EntityCacheSelector = MemoizedSelector<Object, EntityCache>;
export declare function createEntityCacheSelector(entityCacheName?: string): MemoizedSelector<Object, EntityCache>;
