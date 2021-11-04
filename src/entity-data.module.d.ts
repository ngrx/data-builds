import { ModuleWithProviders } from '@angular/core';
import { EffectSources } from '@ngrx/effects';
import { EntityCacheEffects } from './effects/entity-cache-effects';
import { EntityEffects } from './effects/entity-effects';
import { EntityDataModuleConfig } from './entity-data-without-effects.module';
import * as i0 from "@angular/core";
import * as i1 from "./entity-data-without-effects.module";
import * as i2 from "@ngrx/effects";
/**
 * entity-data main module includes effects and HTTP data services
 * Configure with `forRoot`.
 * No `forFeature` yet.
 */
export declare class EntityDataModule {
    private effectSources;
    static forRoot(config: EntityDataModuleConfig): ModuleWithProviders<EntityDataModule>;
    constructor(effectSources: EffectSources, entityCacheEffects: EntityCacheEffects, entityEffects: EntityEffects);
    /**
     * Add another class instance that contains effects.
     * @param effectSourceInstance a class instance that implements effects.
     * Warning: undocumented @ngrx/effects API
     */
    addEffects(effectSourceInstance: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntityDataModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<EntityDataModule, never, [typeof i1.EntityDataModuleWithoutEffects, typeof i2.EffectsModule], never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<EntityDataModule>;
}
