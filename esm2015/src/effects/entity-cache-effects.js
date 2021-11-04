import { Inject, Injectable, Optional } from '@angular/core';
import { ofType, createEffect } from '@ngrx/effects';
import { asyncScheduler, of, merge, race, } from 'rxjs';
import { concatMap, catchError, delay, filter, map, mergeMap, } from 'rxjs/operators';
import { DataServiceError } from '../dataservices/data-service-error';
import { excludeEmptyChangeSetItems, } from '../actions/entity-cache-change-set';
import { EntityOp } from '../actions/entity-op';
import { EntityCacheAction, SaveEntitiesCanceled, SaveEntitiesError, SaveEntitiesSuccess, } from '../actions/entity-cache-action';
import { ENTITY_EFFECTS_SCHEDULER } from './entity-effects-scheduler';
import * as i0 from "@angular/core";
import * as i1 from "@ngrx/effects";
import * as i2 from "../dataservices/entity-cache-data.service";
import * as i3 from "../actions/entity-action-factory";
import * as i4 from "../utils/interfaces";
export class EntityCacheEffects {
    constructor(actions, dataService, entityActionFactory, logger, 
    /**
     * Injecting an optional Scheduler that will be undefined
     * in normal application usage, but its injected here so that you can mock out
     * during testing using the RxJS TestScheduler for simulating passages of time.
     */
    scheduler) {
        this.actions = actions;
        this.dataService = dataService;
        this.entityActionFactory = entityActionFactory;
        this.logger = logger;
        this.scheduler = scheduler;
        // See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
        /** Delay for error and skip observables. Must be multiple of 10 for marble testing. */
        this.responseDelay = 10;
        /**
         * Observable of SAVE_ENTITIES_CANCEL actions with non-null correlation ids
         */
        this.saveEntitiesCancel$ = createEffect(() => this.actions.pipe(ofType(EntityCacheAction.SAVE_ENTITIES_CANCEL), filter((a) => a.payload.correlationId != null)), { dispatch: false });
        // Concurrent persistence requests considered unsafe.
        // `mergeMap` allows for concurrent requests which may return in any order
        this.saveEntities$ = createEffect(() => this.actions.pipe(ofType(EntityCacheAction.SAVE_ENTITIES), mergeMap((action) => this.saveEntities(action))));
    }
    /**
     * Perform the requested SaveEntities actions and return a scalar Observable<Action>
     * that the effect should dispatch to the store after the server responds.
     * @param action The SaveEntities action
     */
    saveEntities(action) {
        const error = action.payload.error;
        if (error) {
            return this.handleSaveEntitiesError$(action)(error);
        }
        try {
            const changeSet = excludeEmptyChangeSetItems(action.payload.changeSet);
            const { correlationId, mergeStrategy, tag, url } = action.payload;
            const options = { correlationId, mergeStrategy, tag };
            if (changeSet.changes.length === 0) {
                // nothing to save
                return of(new SaveEntitiesSuccess(changeSet, url, options));
            }
            // Cancellation: returns Observable<SaveEntitiesCanceled> for a saveEntities action
            // whose correlationId matches the cancellation correlationId
            const c = this.saveEntitiesCancel$.pipe(filter((a) => correlationId === a.payload.correlationId), map((a) => new SaveEntitiesCanceled(correlationId, a.payload.reason, a.payload.tag)));
            // Data: SaveEntities result as a SaveEntitiesSuccess action
            const d = this.dataService.saveEntities(changeSet, url).pipe(concatMap((result) => this.handleSaveEntitiesSuccess$(action, this.entityActionFactory)(result)), catchError(this.handleSaveEntitiesError$(action)));
            // Emit which ever gets there first; the other observable is terminated.
            return race(c, d);
        }
        catch (err) {
            return this.handleSaveEntitiesError$(action)(err);
        }
    }
    /** return handler of error result of saveEntities, returning a scalar observable of error action */
    handleSaveEntitiesError$(action) {
        // Although error may return immediately,
        // ensure observable takes some time,
        // as app likely assumes asynchronous response.
        return (err) => {
            const error = err instanceof DataServiceError ? err : new DataServiceError(err, null);
            return of(new SaveEntitiesError(error, action)).pipe(delay(this.responseDelay, this.scheduler || asyncScheduler));
        };
    }
    /** return handler of the ChangeSet result of successful saveEntities() */
    handleSaveEntitiesSuccess$(action, entityActionFactory) {
        const { url, correlationId, mergeStrategy, tag } = action.payload;
        const options = { correlationId, mergeStrategy, tag };
        return (changeSet) => {
            // DataService returned a ChangeSet with possible updates to the saved entities
            if (changeSet) {
                return of(new SaveEntitiesSuccess(changeSet, url, options));
            }
            // No ChangeSet = Server probably responded '204 - No Content' because
            // it made no changes to the inserted/updated entities.
            // Respond with success action best on the ChangeSet in the request.
            changeSet = action.payload.changeSet;
            // If pessimistic save, return success action with the original ChangeSet
            if (!action.payload.isOptimistic) {
                return of(new SaveEntitiesSuccess(changeSet, url, options));
            }
            // If optimistic save, avoid cache grinding by just turning off the loading flags
            // for all collections in the original ChangeSet
            const entityNames = changeSet.changes.reduce((acc, item) => acc.indexOf(item.entityName) === -1
                ? acc.concat(item.entityName)
                : acc, []);
            return merge(entityNames.map((name) => entityActionFactory.create(name, EntityOp.SET_LOADING, false)));
        };
    }
}
/** @nocollapse */ EntityCacheEffects.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.6", ngImport: i0, type: EntityCacheEffects, deps: [{ token: i1.Actions }, { token: i2.EntityCacheDataService }, { token: i3.EntityActionFactory }, { token: i4.Logger }, { token: ENTITY_EFFECTS_SCHEDULER, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ EntityCacheEffects.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.6", ngImport: i0, type: EntityCacheEffects });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.6", ngImport: i0, type: EntityCacheEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Actions }, { type: i2.EntityCacheDataService }, { type: i3.EntityActionFactory }, { type: i4.Logger }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ENTITY_EFFECTS_SCHEDULER]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWVmZmVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VmZmVjdHMvZW50aXR5LWNhY2hlLWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdELE9BQU8sRUFBVyxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTlELE9BQU8sRUFDTCxjQUFjLEVBRWQsRUFBRSxFQUNGLEtBQUssRUFDTCxJQUFJLEdBRUwsTUFBTSxNQUFNLENBQUM7QUFDZCxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixLQUFLLEVBQ0wsTUFBTSxFQUNOLEdBQUcsRUFDSCxRQUFRLEdBQ1QsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN0RSxPQUFPLEVBRUwsMEJBQTBCLEdBQzNCLE1BQU0sb0NBQW9DLENBQUM7QUFFNUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRWhELE9BQU8sRUFDTCxpQkFBaUIsRUFHakIsb0JBQW9CLEVBQ3BCLGlCQUFpQixFQUNqQixtQkFBbUIsR0FDcEIsTUFBTSxnQ0FBZ0MsQ0FBQztBQUV4QyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQzs7Ozs7O0FBSXRFLE1BQU0sT0FBTyxrQkFBa0I7SUFLN0IsWUFDVSxPQUFnQixFQUNoQixXQUFtQyxFQUNuQyxtQkFBd0MsRUFDeEMsTUFBYztJQUN0Qjs7OztPQUlHO0lBR0ssU0FBd0I7UUFYeEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixnQkFBVyxHQUFYLFdBQVcsQ0FBd0I7UUFDbkMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4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O1lBQ3pFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTtnQkFDaEMsT0FBTyxFQUFFLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDN0Q7WUFFRCxpRkFBaUY7WUFDakYsZ0RBQWdEO1lBQ2hELE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUMxQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUNaLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDakMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFDN0IsQ0FBQyxDQUFDLEdBQUcsRUFDVCxFQUFjLENBQ2YsQ0FBQztZQUNGLE9BQU8sS0FBSyxDQUNWLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUN2QixtQkFBbUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQzlELENBQ0YsQ0FBQztRQUNKLENBQUMsQ0FBQztJQUNKLENBQUM7O2tJQXBKVSxrQkFBa0Isd0lBZ0JuQix3QkFBd0I7c0lBaEJ2QixrQkFBa0I7MkZBQWxCLGtCQUFrQjtrQkFEOUIsVUFBVTs7MEJBZ0JOLFFBQVE7OzBCQUNSLE1BQU07MkJBQUMsd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgQWN0aW9ucywgb2ZUeXBlLCBjcmVhdGVFZmZlY3QgfSBmcm9tICdAbmdyeC9lZmZlY3RzJztcblxuaW1wb3J0IHtcbiAgYXN5bmNTY2hlZHVsZXIsXG4gIE9ic2VydmFibGUsXG4gIG9mLFxuICBtZXJnZSxcbiAgcmFjZSxcbiAgU2NoZWR1bGVyTGlrZSxcbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBjb25jYXRNYXAsXG4gIGNhdGNoRXJyb3IsXG4gIGRlbGF5LFxuICBmaWx0ZXIsXG4gIG1hcCxcbiAgbWVyZ2VNYXAsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgRGF0YVNlcnZpY2VFcnJvciB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9kYXRhLXNlcnZpY2UtZXJyb3InO1xuaW1wb3J0IHtcbiAgQ2hhbmdlU2V0LFxuICBleGNsdWRlRW1wdHlDaGFuZ2VTZXRJdGVtcyxcbn0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktY2FjaGUtY2hhbmdlLXNldCc7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25GYWN0b3J5IH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5T3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5cbmltcG9ydCB7XG4gIEVudGl0eUNhY2hlQWN0aW9uLFxuICBTYXZlRW50aXRpZXMsXG4gIFNhdmVFbnRpdGllc0NhbmNlbCxcbiAgU2F2ZUVudGl0aWVzQ2FuY2VsZWQsXG4gIFNhdmVFbnRpdGllc0Vycm9yLFxuICBTYXZlRW50aXRpZXNTdWNjZXNzLFxufSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1jYWNoZS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGVEYXRhU2VydmljZSB9IGZyb20gJy4uL2RhdGFzZXJ2aWNlcy9lbnRpdHktY2FjaGUtZGF0YS5zZXJ2aWNlJztcbmltcG9ydCB7IEVOVElUWV9FRkZFQ1RTX1NDSEVEVUxFUiB9IGZyb20gJy4vZW50aXR5LWVmZmVjdHMtc2NoZWR1bGVyJztcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4uL3V0aWxzL2ludGVyZmFjZXMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q2FjaGVFZmZlY3RzIHtcbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9SZWFjdGl2ZVgvcnhqcy9ibG9iL21hc3Rlci9kb2MvbWFyYmxlLXRlc3RpbmcubWRcbiAgLyoqIERlbGF5IGZvciBlcnJvciBhbmQgc2tpcCBvYnNlcnZhYmxlcy4gTXVzdCBiZSBtdWx0aXBsZSBvZiAxMCBmb3IgbWFyYmxlIHRlc3RpbmcuICovXG4gIHByaXZhdGUgcmVzcG9uc2VEZWxheSA9IDEwO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgYWN0aW9uczogQWN0aW9ucyxcbiAgICBwcml2YXRlIGRhdGFTZXJ2aWNlOiBFbnRpdHlDYWNoZURhdGFTZXJ2aWNlLFxuICAgIHByaXZhdGUgZW50aXR5QWN0aW9uRmFjdG9yeTogRW50aXR5QWN0aW9uRmFjdG9yeSxcbiAgICBwcml2YXRlIGxvZ2dlcjogTG9nZ2VyLFxuICAgIC8qKlxuICAgICAqIEluamVjdGluZyBhbiBvcHRpb25hbCBTY2hlZHVsZXIgdGhhdCB3aWxsIGJlIHVuZGVmaW5lZFxuICAgICAqIGluIG5vcm1hbCBhcHBsaWNhdGlvbiB1c2FnZSwgYnV0IGl0cyBpbmplY3RlZCBoZXJlIHNvIHRoYXQgeW91IGNhbiBtb2NrIG91dFxuICAgICAqIGR1cmluZyB0ZXN0aW5nIHVzaW5nIHRoZSBSeEpTIFRlc3RTY2hlZHVsZXIgZm9yIHNpbXVsYXRpbmcgcGFzc2FnZXMgb2YgdGltZS5cbiAgICAgKi9cbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoRU5USVRZX0VGRkVDVFNfU0NIRURVTEVSKVxuICAgIHByaXZhdGUgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlXG4gICkge31cblxuICAvKipcbiAgICogT2JzZXJ2YWJsZSBvZiBTQVZFX0VOVElUSUVTX0NBTkNFTCBhY3Rpb25zIHdpdGggbm9uLW51bGwgY29ycmVsYXRpb24gaWRzXG4gICAqL1xuICBzYXZlRW50aXRpZXNDYW5jZWwkOiBPYnNlcnZhYmxlPFNhdmVFbnRpdGllc0NhbmNlbD4gPSBjcmVhdGVFZmZlY3QoXG4gICAgKCkgPT5cbiAgICAgIHRoaXMuYWN0aW9ucy5waXBlKFxuICAgICAgICBvZlR5cGUoRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFU19DQU5DRUwpLFxuICAgICAgICBmaWx0ZXIoKGE6IFNhdmVFbnRpdGllc0NhbmNlbCkgPT4gYS5wYXlsb2FkLmNvcnJlbGF0aW9uSWQgIT0gbnVsbClcbiAgICAgICksXG4gICAgeyBkaXNwYXRjaDogZmFsc2UgfVxuICApO1xuXG4gIC8vIENvbmN1cnJlbnQgcGVyc2lzdGVuY2UgcmVxdWVzdHMgY29uc2lkZXJlZCB1bnNhZmUuXG4gIC8vIGBtZXJnZU1hcGAgYWxsb3dzIGZvciBjb25jdXJyZW50IHJlcXVlc3RzIHdoaWNoIG1heSByZXR1cm4gaW4gYW55IG9yZGVyXG4gIHNhdmVFbnRpdGllcyQ6IE9ic2VydmFibGU8QWN0aW9uPiA9IGNyZWF0ZUVmZmVjdCgoKSA9PlxuICAgIHRoaXMuYWN0aW9ucy5waXBlKFxuICAgICAgb2ZUeXBlKEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVMpLFxuICAgICAgbWVyZ2VNYXAoKGFjdGlvbjogU2F2ZUVudGl0aWVzKSA9PiB0aGlzLnNhdmVFbnRpdGllcyhhY3Rpb24pKVxuICAgIClcbiAgKTtcblxuICAvKipcbiAgICogUGVyZm9ybSB0aGUgcmVxdWVzdGVkIFNhdmVFbnRpdGllcyBhY3Rpb25zIGFuZCByZXR1cm4gYSBzY2FsYXIgT2JzZXJ2YWJsZTxBY3Rpb24+XG4gICAqIHRoYXQgdGhlIGVmZmVjdCBzaG91bGQgZGlzcGF0Y2ggdG8gdGhlIHN0b3JlIGFmdGVyIHRoZSBzZXJ2ZXIgcmVzcG9uZHMuXG4gICAqIEBwYXJhbSBhY3Rpb24gVGhlIFNhdmVFbnRpdGllcyBhY3Rpb25cbiAgICovXG4gIHNhdmVFbnRpdGllcyhhY3Rpb246IFNhdmVFbnRpdGllcyk6IE9ic2VydmFibGU8QWN0aW9uPiB7XG4gICAgY29uc3QgZXJyb3IgPSBhY3Rpb24ucGF5bG9hZC5lcnJvcjtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZVNhdmVFbnRpdGllc0Vycm9yJChhY3Rpb24pKGVycm9yKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNoYW5nZVNldCA9IGV4Y2x1ZGVFbXB0eUNoYW5nZVNldEl0ZW1zKGFjdGlvbi5wYXlsb2FkLmNoYW5nZVNldCk7XG4gICAgICBjb25zdCB7IGNvcnJlbGF0aW9uSWQsIG1lcmdlU3RyYXRlZ3ksIHRhZywgdXJsIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7IGNvcnJlbGF0aW9uSWQsIG1lcmdlU3RyYXRlZ3ksIHRhZyB9O1xuXG4gICAgICBpZiAoY2hhbmdlU2V0LmNoYW5nZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIG5vdGhpbmcgdG8gc2F2ZVxuICAgICAgICByZXR1cm4gb2YobmV3IFNhdmVFbnRpdGllc1N1Y2Nlc3MoY2hhbmdlU2V0LCB1cmwsIG9wdGlvbnMpKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2FuY2VsbGF0aW9uOiByZXR1cm5zIE9ic2VydmFibGU8U2F2ZUVudGl0aWVzQ2FuY2VsZWQ+IGZvciBhIHNhdmVFbnRpdGllcyBhY3Rpb25cbiAgICAgIC8vIHdob3NlIGNvcnJlbGF0aW9uSWQgbWF0Y2hlcyB0aGUgY2FuY2VsbGF0aW9uIGNvcnJlbGF0aW9uSWRcbiAgICAgIGNvbnN0IGMgPSB0aGlzLnNhdmVFbnRpdGllc0NhbmNlbCQucGlwZShcbiAgICAgICAgZmlsdGVyKChhKSA9PiBjb3JyZWxhdGlvbklkID09PSBhLnBheWxvYWQuY29ycmVsYXRpb25JZCksXG4gICAgICAgIG1hcChcbiAgICAgICAgICAoYSkgPT5cbiAgICAgICAgICAgIG5ldyBTYXZlRW50aXRpZXNDYW5jZWxlZChcbiAgICAgICAgICAgICAgY29ycmVsYXRpb25JZCxcbiAgICAgICAgICAgICAgYS5wYXlsb2FkLnJlYXNvbixcbiAgICAgICAgICAgICAgYS5wYXlsb2FkLnRhZ1xuICAgICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApO1xuXG4gICAgICAvLyBEYXRhOiBTYXZlRW50aXRpZXMgcmVzdWx0IGFzIGEgU2F2ZUVudGl0aWVzU3VjY2VzcyBhY3Rpb25cbiAgICAgIGNvbnN0IGQgPSB0aGlzLmRhdGFTZXJ2aWNlLnNhdmVFbnRpdGllcyhjaGFuZ2VTZXQsIHVybCkucGlwZShcbiAgICAgICAgY29uY2F0TWFwKChyZXN1bHQpID0+XG4gICAgICAgICAgdGhpcy5oYW5kbGVTYXZlRW50aXRpZXNTdWNjZXNzJChcbiAgICAgICAgICAgIGFjdGlvbixcbiAgICAgICAgICAgIHRoaXMuZW50aXR5QWN0aW9uRmFjdG9yeVxuICAgICAgICAgICkocmVzdWx0KVxuICAgICAgICApLFxuICAgICAgICBjYXRjaEVycm9yKHRoaXMuaGFuZGxlU2F2ZUVudGl0aWVzRXJyb3IkKGFjdGlvbikpXG4gICAgICApO1xuXG4gICAgICAvLyBFbWl0IHdoaWNoIGV2ZXIgZ2V0cyB0aGVyZSBmaXJzdDsgdGhlIG90aGVyIG9ic2VydmFibGUgaXMgdGVybWluYXRlZC5cbiAgICAgIHJldHVybiByYWNlKGMsIGQpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlU2F2ZUVudGl0aWVzRXJyb3IkKGFjdGlvbikoZXJyKTtcbiAgICB9XG4gIH1cblxuICAvKiogcmV0dXJuIGhhbmRsZXIgb2YgZXJyb3IgcmVzdWx0IG9mIHNhdmVFbnRpdGllcywgcmV0dXJuaW5nIGEgc2NhbGFyIG9ic2VydmFibGUgb2YgZXJyb3IgYWN0aW9uICovXG4gIHByaXZhdGUgaGFuZGxlU2F2ZUVudGl0aWVzRXJyb3IkKFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzXG4gICk6IChlcnI6IERhdGFTZXJ2aWNlRXJyb3IgfCBFcnJvcikgPT4gT2JzZXJ2YWJsZTxBY3Rpb24+IHtcbiAgICAvLyBBbHRob3VnaCBlcnJvciBtYXkgcmV0dXJuIGltbWVkaWF0ZWx5LFxuICAgIC8vIGVuc3VyZSBvYnNlcnZhYmxlIHRha2VzIHNvbWUgdGltZSxcbiAgICAvLyBhcyBhcHAgbGlrZWx5IGFzc3VtZXMgYXN5bmNocm9ub3VzIHJlc3BvbnNlLlxuICAgIHJldHVybiAoZXJyOiBEYXRhU2VydmljZUVycm9yIHwgRXJyb3IpID0+IHtcbiAgICAgIGNvbnN0IGVycm9yID1cbiAgICAgICAgZXJyIGluc3RhbmNlb2YgRGF0YVNlcnZpY2VFcnJvciA/IGVyciA6IG5ldyBEYXRhU2VydmljZUVycm9yKGVyciwgbnVsbCk7XG4gICAgICByZXR1cm4gb2YobmV3IFNhdmVFbnRpdGllc0Vycm9yKGVycm9yLCBhY3Rpb24pKS5waXBlKFxuICAgICAgICBkZWxheSh0aGlzLnJlc3BvbnNlRGVsYXksIHRoaXMuc2NoZWR1bGVyIHx8IGFzeW5jU2NoZWR1bGVyKVxuICAgICAgKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqIHJldHVybiBoYW5kbGVyIG9mIHRoZSBDaGFuZ2VTZXQgcmVzdWx0IG9mIHN1Y2Nlc3NmdWwgc2F2ZUVudGl0aWVzKCkgKi9cbiAgcHJpdmF0ZSBoYW5kbGVTYXZlRW50aXRpZXNTdWNjZXNzJChcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllcyxcbiAgICBlbnRpdHlBY3Rpb25GYWN0b3J5OiBFbnRpdHlBY3Rpb25GYWN0b3J5XG4gICk6IChjaGFuZ2VTZXQ6IENoYW5nZVNldCkgPT4gT2JzZXJ2YWJsZTxBY3Rpb24+IHtcbiAgICBjb25zdCB7IHVybCwgY29ycmVsYXRpb25JZCwgbWVyZ2VTdHJhdGVneSwgdGFnIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBjb25zdCBvcHRpb25zID0geyBjb3JyZWxhdGlvbklkLCBtZXJnZVN0cmF0ZWd5LCB0YWcgfTtcblxuICAgIHJldHVybiAoY2hhbmdlU2V0KSA9PiB7XG4gICAgICAvLyBEYXRhU2VydmljZSByZXR1cm5lZCBhIENoYW5nZVNldCB3aXRoIHBvc3NpYmxlIHVwZGF0ZXMgdG8gdGhlIHNhdmVkIGVudGl0aWVzXG4gICAgICBpZiAoY2hhbmdlU2V0KSB7XG4gICAgICAgIHJldHVybiBvZihuZXcgU2F2ZUVudGl0aWVzU3VjY2VzcyhjaGFuZ2VTZXQsIHVybCwgb3B0aW9ucykpO1xuICAgICAgfVxuXG4gICAgICAvLyBObyBDaGFuZ2VTZXQgPSBTZXJ2ZXIgcHJvYmFibHkgcmVzcG9uZGVkICcyMDQgLSBObyBDb250ZW50JyBiZWNhdXNlXG4gICAgICAvLyBpdCBtYWRlIG5vIGNoYW5nZXMgdG8gdGhlIGluc2VydGVkL3VwZGF0ZWQgZW50aXRpZXMuXG4gICAgICAvLyBSZXNwb25kIHdpdGggc3VjY2VzcyBhY3Rpb24gYmVzdCBvbiB0aGUgQ2hhbmdlU2V0IGluIHRoZSByZXF1ZXN0LlxuICAgICAgY2hhbmdlU2V0ID0gYWN0aW9uLnBheWxvYWQuY2hhbmdlU2V0O1xuXG4gICAgICAvLyBJZiBwZXNzaW1pc3RpYyBzYXZlLCByZXR1cm4gc3VjY2VzcyBhY3Rpb24gd2l0aCB0aGUgb3JpZ2luYWwgQ2hhbmdlU2V0XG4gICAgICBpZiAoIWFjdGlvbi5wYXlsb2FkLmlzT3B0aW1pc3RpYykge1xuICAgICAgICByZXR1cm4gb2YobmV3IFNhdmVFbnRpdGllc1N1Y2Nlc3MoY2hhbmdlU2V0LCB1cmwsIG9wdGlvbnMpKTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgb3B0aW1pc3RpYyBzYXZlLCBhdm9pZCBjYWNoZSBncmluZGluZyBieSBqdXN0IHR1cm5pbmcgb2ZmIHRoZSBsb2FkaW5nIGZsYWdzXG4gICAgICAvLyBmb3IgYWxsIGNvbGxlY3Rpb25zIGluIHRoZSBvcmlnaW5hbCBDaGFuZ2VTZXRcbiAgICAgIGNvbnN0IGVudGl0eU5hbWVzID0gY2hhbmdlU2V0LmNoYW5nZXMucmVkdWNlKFxuICAgICAgICAoYWNjLCBpdGVtKSA9PlxuICAgICAgICAgIGFjYy5pbmRleE9mKGl0ZW0uZW50aXR5TmFtZSkgPT09IC0xXG4gICAgICAgICAgICA/IGFjYy5jb25jYXQoaXRlbS5lbnRpdHlOYW1lKVxuICAgICAgICAgICAgOiBhY2MsXG4gICAgICAgIFtdIGFzIHN0cmluZ1tdXG4gICAgICApO1xuICAgICAgcmV0dXJuIG1lcmdlKFxuICAgICAgICBlbnRpdHlOYW1lcy5tYXAoKG5hbWUpID0+XG4gICAgICAgICAgZW50aXR5QWN0aW9uRmFjdG9yeS5jcmVhdGUobmFtZSwgRW50aXR5T3AuU0VUX0xPQURJTkcsIGZhbHNlKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH07XG4gIH1cbn1cbiJdfQ==