import { ModuleWithProviders, Injector, InjectionToken, OnDestroy } from '@angular/core';
import { Action, MetaReducer, ReducerManager } from '@ngrx/store';
import { EntityAction } from './actions/entity-action';
import { EntityCache } from './reducers/entity-cache';
import { EntityCollection } from './reducers/entity-collection';
import { EntityMetadataMap } from './entity-metadata/entity-metadata';
import { EntityCacheReducerFactory } from './reducers/entity-cache-reducer';
import * as i0 from "@angular/core";
import * as i1 from "@ngrx/store";
export interface EntityDataModuleConfig {
    entityMetadata?: EntityMetadataMap;
    entityCacheMetaReducers?: (MetaReducer<EntityCache, Action> | InjectionToken<MetaReducer<EntityCache, Action>>)[];
    entityCollectionMetaReducers?: MetaReducer<EntityCollection, EntityAction>[];
    initialEntityCacheState?: EntityCache | (() => EntityCache);
    pluralNames?: {
        [name: string]: string;
    };
}
/**
 * Module without effects or dataservices which means no HTTP calls
 * This module helpful for internal testing.
 * Also helpful for apps that handle server access on their own and
 * therefore opt-out of @ngrx/effects for entities
 */
export declare class EntityDataModuleWithoutEffects implements OnDestroy {
    private reducerManager;
    private injector;
    private entityCacheName;
    private initialState;
    private metaReducers;
    private entityCacheFeature;
    static forRoot(config: EntityDataModuleConfig): ModuleWithProviders<EntityDataModuleWithoutEffects>;
    constructor(reducerManager: ReducerManager, entityCacheReducerFactory: EntityCacheReducerFactory, injector: Injector, entityCacheName: string, initialState: any, metaReducers: (MetaReducer<EntityCache, Action> | InjectionToken<MetaReducer<EntityCache, Action>>)[]);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntityDataModuleWithoutEffects, [null, null, null, { optional: true; }, { optional: true; }, { optional: true; }]>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<EntityDataModuleWithoutEffects, never, [typeof i1.StoreModule], never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<EntityDataModuleWithoutEffects>;
}
