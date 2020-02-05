/// <amd-module name="@ngrx/data/src/effects/entity-effects-scheduler" />
import { InjectionToken } from '@angular/core';
import { SchedulerLike } from 'rxjs';
/** Token to inject a special RxJS Scheduler during marble tests. */
export declare const ENTITY_EFFECTS_SCHEDULER: InjectionToken<SchedulerLike>;
