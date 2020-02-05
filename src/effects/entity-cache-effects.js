(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/effects/entity-cache-effects", ["require", "exports", "tslib", "@angular/core", "@ngrx/effects", "rxjs", "rxjs/operators", "@ngrx/data/src/dataservices/data-service-error", "@ngrx/data/src/actions/entity-cache-change-set", "@ngrx/data/src/actions/entity-action-factory", "@ngrx/data/src/actions/entity-op", "@ngrx/data/src/actions/entity-cache-action", "@ngrx/data/src/dataservices/entity-cache-data.service", "@ngrx/data/src/effects/entity-effects-scheduler", "@ngrx/data/src/utils/interfaces"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@angular/core");
    const effects_1 = require("@ngrx/effects");
    const rxjs_1 = require("rxjs");
    const operators_1 = require("rxjs/operators");
    const data_service_error_1 = require("@ngrx/data/src/dataservices/data-service-error");
    const entity_cache_change_set_1 = require("@ngrx/data/src/actions/entity-cache-change-set");
    const entity_action_factory_1 = require("@ngrx/data/src/actions/entity-action-factory");
    const entity_op_1 = require("@ngrx/data/src/actions/entity-op");
    const entity_cache_action_1 = require("@ngrx/data/src/actions/entity-cache-action");
    const entity_cache_data_service_1 = require("@ngrx/data/src/dataservices/entity-cache-data.service");
    const entity_effects_scheduler_1 = require("@ngrx/data/src/effects/entity-effects-scheduler");
    const interfaces_1 = require("@ngrx/data/src/utils/interfaces");
    let EntityCacheEffects = class EntityCacheEffects {
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
            this.saveEntitiesCancel$ = effects_1.createEffect(() => this.actions.pipe(effects_1.ofType(entity_cache_action_1.EntityCacheAction.SAVE_ENTITIES_CANCEL), operators_1.filter((a) => a.payload.correlationId != null)), { dispatch: false });
            // Concurrent persistence requests considered unsafe.
            // `mergeMap` allows for concurrent requests which may return in any order
            this.saveEntities$ = effects_1.createEffect(() => this.actions.pipe(effects_1.ofType(entity_cache_action_1.EntityCacheAction.SAVE_ENTITIES), operators_1.mergeMap((action) => this.saveEntities(action))));
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
                const changeSet = entity_cache_change_set_1.excludeEmptyChangeSetItems(action.payload.changeSet);
                const { correlationId, mergeStrategy, tag, url } = action.payload;
                const options = { correlationId, mergeStrategy, tag };
                if (changeSet.changes.length === 0) {
                    // nothing to save
                    return rxjs_1.of(new entity_cache_action_1.SaveEntitiesSuccess(changeSet, url, options));
                }
                // Cancellation: returns Observable<SaveEntitiesCanceled> for a saveEntities action
                // whose correlationId matches the cancellation correlationId
                const c = this.saveEntitiesCancel$.pipe(operators_1.filter(a => correlationId === a.payload.correlationId), operators_1.map(a => new entity_cache_action_1.SaveEntitiesCanceled(correlationId, a.payload.reason, a.payload.tag)));
                // Data: SaveEntities result as a SaveEntitiesSuccess action
                const d = this.dataService.saveEntities(changeSet, url).pipe(operators_1.concatMap(result => this.handleSaveEntitiesSuccess$(action, this.entityActionFactory)(result)), operators_1.catchError(this.handleSaveEntitiesError$(action)));
                // Emit which ever gets there first; the other observable is terminated.
                return rxjs_1.race(c, d);
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
                const error = err instanceof data_service_error_1.DataServiceError ? err : new data_service_error_1.DataServiceError(err, null);
                return rxjs_1.of(new entity_cache_action_1.SaveEntitiesError(error, action)).pipe(operators_1.delay(this.responseDelay, this.scheduler || rxjs_1.asyncScheduler));
            };
        }
        /** return handler of the ChangeSet result of successful saveEntities() */
        handleSaveEntitiesSuccess$(action, entityActionFactory) {
            const { url, correlationId, mergeStrategy, tag } = action.payload;
            const options = { correlationId, mergeStrategy, tag };
            return changeSet => {
                // DataService returned a ChangeSet with possible updates to the saved entities
                if (changeSet) {
                    return rxjs_1.of(new entity_cache_action_1.SaveEntitiesSuccess(changeSet, url, options));
                }
                // No ChangeSet = Server probably responded '204 - No Content' because
                // it made no changes to the inserted/updated entities.
                // Respond with success action best on the ChangeSet in the request.
                changeSet = action.payload.changeSet;
                // If pessimistic save, return success action with the original ChangeSet
                if (!action.payload.isOptimistic) {
                    return rxjs_1.of(new entity_cache_action_1.SaveEntitiesSuccess(changeSet, url, options));
                }
                // If optimistic save, avoid cache grinding by just turning off the loading flags
                // for all collections in the original ChangeSet
                const entityNames = changeSet.changes.reduce((acc, item) => acc.indexOf(item.entityName) === -1
                    ? acc.concat(item.entityName)
                    : acc, []);
                return rxjs_1.merge(entityNames.map(name => entityActionFactory.create(name, entity_op_1.EntityOp.SET_LOADING, false)));
            };
        }
    };
    EntityCacheEffects = tslib_1.__decorate([
        core_1.Injectable(),
        tslib_1.__param(4, core_1.Optional()),
        tslib_1.__param(4, core_1.Inject(entity_effects_scheduler_1.ENTITY_EFFECTS_SCHEDULER)),
        tslib_1.__metadata("design:paramtypes", [effects_1.Actions,
            entity_cache_data_service_1.EntityCacheDataService,
            entity_action_factory_1.EntityActionFactory,
            interfaces_1.Logger, Object])
    ], EntityCacheEffects);
    exports.EntityCacheEffects = EntityCacheEffects;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWVmZmVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VmZmVjdHMvZW50aXR5LWNhY2hlLWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUEsd0NBQTZEO0lBRTdELDJDQUE4RDtJQUU5RCwrQkFPYztJQUNkLDhDQU93QjtJQUV4Qix1RkFBc0U7SUFDdEUsNEZBRzRDO0lBQzVDLHdGQUF1RTtJQUN2RSxnRUFBZ0Q7SUFFaEQsb0ZBT3dDO0lBQ3hDLHFHQUFtRjtJQUNuRiw4RkFBc0U7SUFDdEUsZ0VBQTZDO0lBRzdDLElBQWEsa0JBQWtCLEdBQS9CLE1BQWEsa0JBQWtCO1FBSzdCLFlBQ1UsT0FBZ0IsRUFDaEIsV0FBbUMsRUFDbkMsbUJBQXdDLEVBQ3hDLE1BQWM7UUFDdEI7Ozs7V0FJRztRQUdLLFNBQXdCO1lBWHhCLFlBQU8sR0FBUCxPQUFPLENBQVM7WUFDaEIsZ0JBQVcsR0FBWCxXQUFXLENBQXdCO1lBQ25DLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7WUFDeEMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtZQVFkLGNBQVMsR0FBVCxTQUFTLENBQWU7WUFoQmxDLDBFQUEwRTtZQUMxRSx1RkFBdUY7WUFDL0Usa0JBQWEsR0FBRyxFQUFFLENBQUM7WUFpQjNCOztlQUVHO1lBQ0gsd0JBQW1CLEdBQW1DLHNCQUFZLENBQ2hFLEdBQUcsRUFBRSxDQUNILElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUNmLGdCQUFNLENBQUMsdUNBQWlCLENBQUMsb0JBQW9CLENBQUMsRUFDOUMsa0JBQU0sQ0FBQyxDQUFDLENBQXFCLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxDQUNuRSxFQUNILEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUNwQixDQUFDO1lBRUYscURB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QUMsVUFBVSxDQUFDO29CQUM3QixDQUFDLENBQUMsR0FBRyxFQUNULEVBQWMsQ0FDZixDQUFDO2dCQUNGLE9BQU8sWUFBSyxDQUNWLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FDckIsbUJBQW1CLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxvQkFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FDOUQsQ0FDRixDQUFDO1lBQ0osQ0FBQyxDQUFDO1FBQ0osQ0FBQztLQUNGLENBQUE7SUFwSlksa0JBQWtCO1FBRDlCLGlCQUFVLEVBQUU7UUFnQlIsbUJBQUEsZUFBUSxFQUFFLENBQUE7UUFDVixtQkFBQSxhQUFNLENBQUMsbURBQXdCLENBQUMsQ0FBQTtpREFWaEIsaUJBQU87WUFDSCxrREFBc0I7WUFDZCwyQ0FBbUI7WUFDaEMsbUJBQU07T0FUYixrQkFBa0IsQ0FvSjlCO0lBcEpZLGdEQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IEFjdGlvbnMsIG9mVHlwZSwgY3JlYXRlRWZmZWN0IH0gZnJvbSAnQG5ncngvZWZmZWN0cyc7XG5cbmltcG9ydCB7XG4gIGFzeW5jU2NoZWR1bGVyLFxuICBPYnNlcnZhYmxlLFxuICBvZixcbiAgbWVyZ2UsXG4gIHJhY2UsXG4gIFNjaGVkdWxlckxpa2UsXG59IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgY29uY2F0TWFwLFxuICBjYXRjaEVycm9yLFxuICBkZWxheSxcbiAgZmlsdGVyLFxuICBtYXAsXG4gIG1lcmdlTWFwLFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IERhdGFTZXJ2aWNlRXJyb3IgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvZGF0YS1zZXJ2aWNlLWVycm9yJztcbmltcG9ydCB7XG4gIENoYW5nZVNldCxcbiAgZXhjbHVkZUVtcHR5Q2hhbmdlU2V0SXRlbXMsXG59IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQnO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uRmFjdG9yeSB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eU9wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuXG5pbXBvcnQge1xuICBFbnRpdHlDYWNoZUFjdGlvbixcbiAgU2F2ZUVudGl0aWVzLFxuICBTYXZlRW50aXRpZXNDYW5jZWwsXG4gIFNhdmVFbnRpdGllc0NhbmNlbGVkLFxuICBTYXZlRW50aXRpZXNFcnJvcixcbiAgU2F2ZUVudGl0aWVzU3VjY2Vzcyxcbn0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktY2FjaGUtYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNhY2hlRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvZW50aXR5LWNhY2hlLWRhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBFTlRJVFlfRUZGRUNUU19TQ0hFRFVMRVIgfSBmcm9tICcuL2VudGl0eS1lZmZlY3RzLXNjaGVkdWxlcic7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuLi91dGlscy9pbnRlcmZhY2VzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUNhY2hlRWZmZWN0cyB7XG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vUmVhY3RpdmVYL3J4anMvYmxvYi9tYXN0ZXIvZG9jL21hcmJsZS10ZXN0aW5nLm1kXG4gIC8qKiBEZWxheSBmb3IgZXJyb3IgYW5kIHNraXAgb2JzZXJ2YWJsZXMuIE11c3QgYmUgbXVsdGlwbGUgb2YgMTAgZm9yIG1hcmJsZSB0ZXN0aW5nLiAqL1xuICBwcml2YXRlIHJlc3BvbnNlRGVsYXkgPSAxMDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGFjdGlvbnM6IEFjdGlvbnMsXG4gICAgcHJpdmF0ZSBkYXRhU2VydmljZTogRW50aXR5Q2FjaGVEYXRhU2VydmljZSxcbiAgICBwcml2YXRlIGVudGl0eUFjdGlvbkZhY3Rvcnk6IEVudGl0eUFjdGlvbkZhY3RvcnksXG4gICAgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlcixcbiAgICAvKipcbiAgICAgKiBJbmplY3RpbmcgYW4gb3B0aW9uYWwgU2NoZWR1bGVyIHRoYXQgd2lsbCBiZSB1bmRlZmluZWRcbiAgICAgKiBpbiBub3JtYWwgYXBwbGljYXRpb24gdXNhZ2UsIGJ1dCBpdHMgaW5qZWN0ZWQgaGVyZSBzbyB0aGF0IHlvdSBjYW4gbW9jayBvdXRcbiAgICAgKiBkdXJpbmcgdGVzdGluZyB1c2luZyB0aGUgUnhKUyBUZXN0U2NoZWR1bGVyIGZvciBzaW11bGF0aW5nIHBhc3NhZ2VzIG9mIHRpbWUuXG4gICAgICovXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KEVOVElUWV9FRkZFQ1RTX1NDSEVEVUxFUilcbiAgICBwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZVxuICApIHt9XG5cbiAgLyoqXG4gICAqIE9ic2VydmFibGUgb2YgU0FWRV9FTlRJVElFU19DQU5DRUwgYWN0aW9ucyB3aXRoIG5vbi1udWxsIGNvcnJlbGF0aW9uIGlkc1xuICAgKi9cbiAgc2F2ZUVudGl0aWVzQ2FuY2VsJDogT2JzZXJ2YWJsZTxTYXZlRW50aXRpZXNDYW5jZWw+ID0gY3JlYXRlRWZmZWN0KFxuICAgICgpID0+XG4gICAgICB0aGlzLmFjdGlvbnMucGlwZShcbiAgICAgICAgb2ZUeXBlKEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfQ0FOQ0VMKSxcbiAgICAgICAgZmlsdGVyKChhOiBTYXZlRW50aXRpZXNDYW5jZWwpID0+IGEucGF5bG9hZC5jb3JyZWxhdGlvbklkICE9IG51bGwpXG4gICAgICApLFxuICAgIHsgZGlzcGF0Y2g6IGZhbHNlIH1cbiAgKTtcblxuICAvLyBDb25jdXJyZW50IHBlcnNpc3RlbmNlIHJlcXVlc3RzIGNvbnNpZGVyZWQgdW5zYWZlLlxuICAvLyBgbWVyZ2VNYXBgIGFsbG93cyBmb3IgY29uY3VycmVudCByZXF1ZXN0cyB3aGljaCBtYXkgcmV0dXJuIGluIGFueSBvcmRlclxuICBzYXZlRW50aXRpZXMkOiBPYnNlcnZhYmxlPEFjdGlvbj4gPSBjcmVhdGVFZmZlY3QoKCkgPT5cbiAgICB0aGlzLmFjdGlvbnMucGlwZShcbiAgICAgIG9mVHlwZShFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTKSxcbiAgICAgIG1lcmdlTWFwKChhY3Rpb246IFNhdmVFbnRpdGllcykgPT4gdGhpcy5zYXZlRW50aXRpZXMoYWN0aW9uKSlcbiAgICApXG4gICk7XG5cbiAgLyoqXG4gICAqIFBlcmZvcm0gdGhlIHJlcXVlc3RlZCBTYXZlRW50aXRpZXMgYWN0aW9ucyBhbmQgcmV0dXJuIGEgc2NhbGFyIE9ic2VydmFibGU8QWN0aW9uPlxuICAgKiB0aGF0IHRoZSBlZmZlY3Qgc2hvdWxkIGRpc3BhdGNoIHRvIHRoZSBzdG9yZSBhZnRlciB0aGUgc2VydmVyIHJlc3BvbmRzLlxuICAgKiBAcGFyYW0gYWN0aW9uIFRoZSBTYXZlRW50aXRpZXMgYWN0aW9uXG4gICAqL1xuICBzYXZlRW50aXRpZXMoYWN0aW9uOiBTYXZlRW50aXRpZXMpOiBPYnNlcnZhYmxlPEFjdGlvbj4ge1xuICAgIGNvbnN0IGVycm9yID0gYWN0aW9uLnBheWxvYWQuZXJyb3I7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVTYXZlRW50aXRpZXNFcnJvciQoYWN0aW9uKShlcnJvcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCBjaGFuZ2VTZXQgPSBleGNsdWRlRW1wdHlDaGFuZ2VTZXRJdGVtcyhhY3Rpb24ucGF5bG9hZC5jaGFuZ2VTZXQpO1xuICAgICAgY29uc3QgeyBjb3JyZWxhdGlvbklkLCBtZXJnZVN0cmF0ZWd5LCB0YWcsIHVybCB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgICBjb25zdCBvcHRpb25zID0geyBjb3JyZWxhdGlvbklkLCBtZXJnZVN0cmF0ZWd5LCB0YWcgfTtcblxuICAgICAgaWYgKGNoYW5nZVNldC5jaGFuZ2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAvLyBub3RoaW5nIHRvIHNhdmVcbiAgICAgICAgcmV0dXJuIG9mKG5ldyBTYXZlRW50aXRpZXNTdWNjZXNzKGNoYW5nZVNldCwgdXJsLCBvcHRpb25zKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIENhbmNlbGxhdGlvbjogcmV0dXJucyBPYnNlcnZhYmxlPFNhdmVFbnRpdGllc0NhbmNlbGVkPiBmb3IgYSBzYXZlRW50aXRpZXMgYWN0aW9uXG4gICAgICAvLyB3aG9zZSBjb3JyZWxhdGlvbklkIG1hdGNoZXMgdGhlIGNhbmNlbGxhdGlvbiBjb3JyZWxhdGlvbklkXG4gICAgICBjb25zdCBjID0gdGhpcy5zYXZlRW50aXRpZXNDYW5jZWwkLnBpcGUoXG4gICAgICAgIGZpbHRlcihhID0+IGNvcnJlbGF0aW9uSWQgPT09IGEucGF5bG9hZC5jb3JyZWxhdGlvbklkKSxcbiAgICAgICAgbWFwKFxuICAgICAgICAgIGEgPT5cbiAgICAgICAgICAgIG5ldyBTYXZlRW50aXRpZXNDYW5jZWxlZChcbiAgICAgICAgICAgICAgY29ycmVsYXRpb25JZCxcbiAgICAgICAgICAgICAgYS5wYXlsb2FkLnJlYXNvbixcbiAgICAgICAgICAgICAgYS5wYXlsb2FkLnRhZ1xuICAgICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApO1xuXG4gICAgICAvLyBEYXRhOiBTYXZlRW50aXRpZXMgcmVzdWx0IGFzIGEgU2F2ZUVudGl0aWVzU3VjY2VzcyBhY3Rpb25cbiAgICAgIGNvbnN0IGQgPSB0aGlzLmRhdGFTZXJ2aWNlLnNhdmVFbnRpdGllcyhjaGFuZ2VTZXQsIHVybCkucGlwZShcbiAgICAgICAgY29uY2F0TWFwKHJlc3VsdCA9PlxuICAgICAgICAgIHRoaXMuaGFuZGxlU2F2ZUVudGl0aWVzU3VjY2VzcyQoYWN0aW9uLCB0aGlzLmVudGl0eUFjdGlvbkZhY3RvcnkpKFxuICAgICAgICAgICAgcmVzdWx0XG4gICAgICAgICAgKVxuICAgICAgICApLFxuICAgICAgICBjYXRjaEVycm9yKHRoaXMuaGFuZGxlU2F2ZUVudGl0aWVzRXJyb3IkKGFjdGlvbikpXG4gICAgICApO1xuXG4gICAgICAvLyBFbWl0IHdoaWNoIGV2ZXIgZ2V0cyB0aGVyZSBmaXJzdDsgdGhlIG90aGVyIG9ic2VydmFibGUgaXMgdGVybWluYXRlZC5cbiAgICAgIHJldHVybiByYWNlKGMsIGQpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlU2F2ZUVudGl0aWVzRXJyb3IkKGFjdGlvbikoZXJyKTtcbiAgICB9XG4gIH1cblxuICAvKiogcmV0dXJuIGhhbmRsZXIgb2YgZXJyb3IgcmVzdWx0IG9mIHNhdmVFbnRpdGllcywgcmV0dXJuaW5nIGEgc2NhbGFyIG9ic2VydmFibGUgb2YgZXJyb3IgYWN0aW9uICovXG4gIHByaXZhdGUgaGFuZGxlU2F2ZUVudGl0aWVzRXJyb3IkKFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzXG4gICk6IChlcnI6IERhdGFTZXJ2aWNlRXJyb3IgfCBFcnJvcikgPT4gT2JzZXJ2YWJsZTxBY3Rpb24+IHtcbiAgICAvLyBBbHRob3VnaCBlcnJvciBtYXkgcmV0dXJuIGltbWVkaWF0ZWx5LFxuICAgIC8vIGVuc3VyZSBvYnNlcnZhYmxlIHRha2VzIHNvbWUgdGltZSxcbiAgICAvLyBhcyBhcHAgbGlrZWx5IGFzc3VtZXMgYXN5bmNocm9ub3VzIHJlc3BvbnNlLlxuICAgIHJldHVybiAoZXJyOiBEYXRhU2VydmljZUVycm9yIHwgRXJyb3IpID0+IHtcbiAgICAgIGNvbnN0IGVycm9yID1cbiAgICAgICAgZXJyIGluc3RhbmNlb2YgRGF0YVNlcnZpY2VFcnJvciA/IGVyciA6IG5ldyBEYXRhU2VydmljZUVycm9yKGVyciwgbnVsbCk7XG4gICAgICByZXR1cm4gb2YobmV3IFNhdmVFbnRpdGllc0Vycm9yKGVycm9yLCBhY3Rpb24pKS5waXBlKFxuICAgICAgICBkZWxheSh0aGlzLnJlc3BvbnNlRGVsYXksIHRoaXMuc2NoZWR1bGVyIHx8IGFzeW5jU2NoZWR1bGVyKVxuICAgICAgKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqIHJldHVybiBoYW5kbGVyIG9mIHRoZSBDaGFuZ2VTZXQgcmVzdWx0IG9mIHN1Y2Nlc3NmdWwgc2F2ZUVudGl0aWVzKCkgKi9cbiAgcHJpdmF0ZSBoYW5kbGVTYXZlRW50aXRpZXNTdWNjZXNzJChcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllcyxcbiAgICBlbnRpdHlBY3Rpb25GYWN0b3J5OiBFbnRpdHlBY3Rpb25GYWN0b3J5XG4gICk6IChjaGFuZ2VTZXQ6IENoYW5nZVNldCkgPT4gT2JzZXJ2YWJsZTxBY3Rpb24+IHtcbiAgICBjb25zdCB7IHVybCwgY29ycmVsYXRpb25JZCwgbWVyZ2VTdHJhdGVneSwgdGFnIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBjb25zdCBvcHRpb25zID0geyBjb3JyZWxhdGlvbklkLCBtZXJnZVN0cmF0ZWd5LCB0YWcgfTtcblxuICAgIHJldHVybiBjaGFuZ2VTZXQgPT4ge1xuICAgICAgLy8gRGF0YVNlcnZpY2UgcmV0dXJuZWQgYSBDaGFuZ2VTZXQgd2l0aCBwb3NzaWJsZSB1cGRhdGVzIHRvIHRoZSBzYXZlZCBlbnRpdGllc1xuICAgICAgaWYgKGNoYW5nZVNldCkge1xuICAgICAgICByZXR1cm4gb2YobmV3IFNhdmVFbnRpdGllc1N1Y2Nlc3MoY2hhbmdlU2V0LCB1cmwsIG9wdGlvbnMpKTtcbiAgICAgIH1cblxuICAgICAgLy8gTm8gQ2hhbmdlU2V0ID0gU2VydmVyIHByb2JhYmx5IHJlc3BvbmRlZCAnMjA0IC0gTm8gQ29udGVudCcgYmVjYXVzZVxuICAgICAgLy8gaXQgbWFkZSBubyBjaGFuZ2VzIHRvIHRoZSBpbnNlcnRlZC91cGRhdGVkIGVudGl0aWVzLlxuICAgICAgLy8gUmVzcG9uZCB3aXRoIHN1Y2Nlc3MgYWN0aW9uIGJlc3Qgb24gdGhlIENoYW5nZVNldCBpbiB0aGUgcmVxdWVzdC5cbiAgICAgIGNoYW5nZVNldCA9IGFjdGlvbi5wYXlsb2FkLmNoYW5nZVNldDtcblxuICAgICAgLy8gSWYgcGVzc2ltaXN0aWMgc2F2ZSwgcmV0dXJuIHN1Y2Nlc3MgYWN0aW9uIHdpdGggdGhlIG9yaWdpbmFsIENoYW5nZVNldFxuICAgICAgaWYgKCFhY3Rpb24ucGF5bG9hZC5pc09wdGltaXN0aWMpIHtcbiAgICAgICAgcmV0dXJuIG9mKG5ldyBTYXZlRW50aXRpZXNTdWNjZXNzKGNoYW5nZVNldCwgdXJsLCBvcHRpb25zKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIG9wdGltaXN0aWMgc2F2ZSwgYXZvaWQgY2FjaGUgZ3JpbmRpbmcgYnkganVzdCB0dXJuaW5nIG9mZiB0aGUgbG9hZGluZyBmbGFnc1xuICAgICAgLy8gZm9yIGFsbCBjb2xsZWN0aW9ucyBpbiB0aGUgb3JpZ2luYWwgQ2hhbmdlU2V0XG4gICAgICBjb25zdCBlbnRpdHlOYW1lcyA9IGNoYW5nZVNldC5jaGFuZ2VzLnJlZHVjZShcbiAgICAgICAgKGFjYywgaXRlbSkgPT5cbiAgICAgICAgICBhY2MuaW5kZXhPZihpdGVtLmVudGl0eU5hbWUpID09PSAtMVxuICAgICAgICAgICAgPyBhY2MuY29uY2F0KGl0ZW0uZW50aXR5TmFtZSlcbiAgICAgICAgICAgIDogYWNjLFxuICAgICAgICBbXSBhcyBzdHJpbmdbXVxuICAgICAgKTtcbiAgICAgIHJldHVybiBtZXJnZShcbiAgICAgICAgZW50aXR5TmFtZXMubWFwKG5hbWUgPT5cbiAgICAgICAgICBlbnRpdHlBY3Rpb25GYWN0b3J5LmNyZWF0ZShuYW1lLCBFbnRpdHlPcC5TRVRfTE9BRElORywgZmFsc2UpXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfTtcbiAgfVxufVxuIl19