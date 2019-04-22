import { ModuleWithProviders } from '@angular/core';
import { EffectSources } from '@ngrx/effects';
import { EntityCacheEffects } from './effects/entity-cache-effects';
import { EntityEffects } from './effects/entity-effects';
import { EntityDataModuleConfig } from './entity-data-without-effects.module';
/**
 * entity-data main module includes effects and HTTP data services
 * Configure with `forRoot`.
 * No `forFeature` yet.
 */
export declare class EntityDataModule {
    private effectSources;
    static forRoot(config: EntityDataModuleConfig): ModuleWithProviders;
    constructor(effectSources: EffectSources, entityCacheEffects: EntityCacheEffects, entityEffects: EntityEffects);
    /**
     * Add another class instance that contains @Effect methods.
     * @param effectSourceInstance a class instance that implements effects.
     * Warning: undocumented @ngrx/effects API
     */
    addEffects(effectSourceInstance: any): void;
}
