(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/effects/entity-effects", ["require", "exports", "tslib", "@angular/core", "@ngrx/effects", "rxjs", "rxjs/operators", "@ngrx/data/src/actions/entity-action-factory", "@ngrx/data/src/effects/entity-effects-scheduler", "@ngrx/data/src/actions/entity-op", "@ngrx/data/src/actions/entity-action-operators", "@ngrx/data/src/dataservices/entity-data.service", "@ngrx/data/src/dataservices/persistence-result-handler.service"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@angular/core");
    const effects_1 = require("@ngrx/effects");
    const rxjs_1 = require("rxjs");
    const operators_1 = require("rxjs/operators");
    const entity_action_factory_1 = require("@ngrx/data/src/actions/entity-action-factory");
    const entity_effects_scheduler_1 = require("@ngrx/data/src/effects/entity-effects-scheduler");
    const entity_op_1 = require("@ngrx/data/src/actions/entity-op");
    const entity_action_operators_1 = require("@ngrx/data/src/actions/entity-action-operators");
    const entity_data_service_1 = require("@ngrx/data/src/dataservices/entity-data.service");
    const persistence_result_handler_service_1 = require("@ngrx/data/src/dataservices/persistence-result-handler.service");
    exports.persistOps = [
        entity_op_1.EntityOp.QUERY_ALL,
        entity_op_1.EntityOp.QUERY_LOAD,
        entity_op_1.EntityOp.QUERY_BY_KEY,
        entity_op_1.EntityOp.QUERY_MANY,
        entity_op_1.EntityOp.SAVE_ADD_ONE,
        entity_op_1.EntityOp.SAVE_DELETE_ONE,
        entity_op_1.EntityOp.SAVE_UPDATE_ONE,
        entity_op_1.EntityOp.SAVE_UPSERT_ONE,
    ];
    let EntityEffects = class EntityEffects {
        constructor(actions, dataService, entityActionFactory, resultHandler, 
        /**
         * Injecting an optional Scheduler that will be undefined
         * in normal application usage, but its injected here so that you can mock out
         * during testing using the RxJS TestScheduler for simulating passages of time.
         */
        scheduler) {
            this.actions = actions;
            this.dataService = dataService;
            this.entityActionFactory = entityActionFactory;
            this.resultHandler = resultHandler;
            this.scheduler = scheduler;
            // See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
            /** Delay for error and skip observables. Must be multiple of 10 for marble testing. */
            this.responseDelay = 10;
            /**
             * Observable of non-null cancellation correlation ids from CANCEL_PERSIST actions
             */
            this.cancel$ = effects_1.createEffect(() => this.actions.pipe(entity_action_operators_1.ofEntityOp(entity_op_1.EntityOp.CANCEL_PERSIST), operators_1.map((action) => action.payload.correlationId), operators_1.filter(id => id != null)), { dispatch: false });
            // `mergeMap` allows for concurrent requests which may return in any order
            this.persist$ = effects_1.createEffect(() => this.actions.pipe(entity_action_operators_1.ofEntityOp(exports.persistOps), operators_1.mergeMap(action => this.persist(action))));
        }
        /**
         * Perform the requested persistence operation and return a scalar Observable<Action>
         * that the effect should dispatch to the store after the server responds.
         * @param action A persistence operation EntityAction
         */
        persist(action) {
            if (action.payload.skip) {
                // Should not persist. Pretend it succeeded.
                return this.handleSkipSuccess$(action);
            }
            if (action.payload.error) {
                return this.handleError$(action)(action.payload.error);
            }
            try {
                // Cancellation: returns Observable of CANCELED_PERSIST for a persistence EntityAction
                // whose correlationId matches cancellation correlationId
                const c = this.cancel$.pipe(operators_1.filter(id => action.payload.correlationId === id), operators_1.map(id => this.entityActionFactory.createFromAction(action, {
                    entityOp: entity_op_1.EntityOp.CANCELED_PERSIST,
                })));
                // Data: entity collection DataService result as a successful persistence EntityAction
                const d = this.callDataService(action).pipe(operators_1.map(this.resultHandler.handleSuccess(action)), operators_1.catchError(this.handleError$(action)));
                // Emit which ever gets there first; the other observable is terminated.
                return rxjs_1.race(c, d);
            }
            catch (err) {
                return this.handleError$(action)(err);
            }
        }
        callDataService(action) {
            const { entityName, entityOp, data } = action.payload;
            const service = this.dataService.getService(entityName);
            switch (entityOp) {
                case entity_op_1.EntityOp.QUERY_ALL:
                case entity_op_1.EntityOp.QUERY_LOAD:
                    return service.getAll();
                case entity_op_1.EntityOp.QUERY_BY_KEY:
                    return service.getById(data);
                case entity_op_1.EntityOp.QUERY_MANY:
                    return service.getWithQuery(data);
                case entity_op_1.EntityOp.SAVE_ADD_ONE:
                    return service.add(data);
                case entity_op_1.EntityOp.SAVE_DELETE_ONE:
                    return service.delete(data);
                case entity_op_1.EntityOp.SAVE_UPDATE_ONE:
                    const { id, changes } = data; // data must be Update<T>
                    return service.update(data).pipe(operators_1.map((updatedEntity) => {
                        // Return an Update<T> with updated entity data.
                        // If server returned entity data, merge with the changes that were sent
                        // and set the 'changed' flag to true.
                        // If server did not return entity data,
                        // assume it made no additional changes of its own, return the original changes,
                        // and set the `changed` flag to `false`.
                        const hasData = updatedEntity && Object.keys(updatedEntity).length > 0;
                        const responseData = hasData
                            ? { id, changes: Object.assign(Object.assign({}, changes), updatedEntity), changed: true }
                            : { id, changes, changed: false };
                        return responseData;
                    }));
                case entity_op_1.EntityOp.SAVE_UPSERT_ONE:
                    return service.upsert(data).pipe(operators_1.map((upsertedEntity) => {
                        const hasData = upsertedEntity && Object.keys(upsertedEntity).length > 0;
                        return hasData ? upsertedEntity : data; // ensure a returned entity value.
                    }));
                default:
                    throw new Error(`Persistence action "${entityOp}" is not implemented.`);
            }
        }
        /**
         * Handle error result of persistence operation on an EntityAction,
         * returning a scalar observable of error action
         */
        handleError$(action) {
            // Although error may return immediately,
            // ensure observable takes some time,
            // as app likely assumes asynchronous response.
            return (error) => rxjs_1.of(this.resultHandler.handleError(action)(error)).pipe(operators_1.delay(this.responseDelay, this.scheduler || rxjs_1.asyncScheduler));
        }
        /**
         * Because EntityAction.payload.skip is true, skip the persistence step and
         * return a scalar success action that looks like the operation succeeded.
         */
        handleSkipSuccess$(originalAction) {
            const successOp = entity_op_1.makeSuccessOp(originalAction.payload.entityOp);
            const successAction = this.entityActionFactory.createFromAction(originalAction, {
                entityOp: successOp,
            });
            // Although returns immediately,
            // ensure observable takes one tick (by using a promise),
            // as app likely assumes asynchronous response.
            return rxjs_1.of(successAction).pipe(operators_1.delay(this.responseDelay, this.scheduler || rxjs_1.asyncScheduler));
        }
    };
    EntityEffects = tslib_1.__decorate([
        core_1.Injectable(),
        tslib_1.__param(4, core_1.Optional()),
        tslib_1.__param(4, core_1.Inject(entity_effects_scheduler_1.ENTITY_EFFECTS_SCHEDULER)),
        tslib_1.__metadata("design:paramtypes", [effects_1.Actions,
            entity_data_service_1.EntityDataService,
            entity_action_factory_1.EntityActionFactory,
            persistence_result_handler_service_1.PersistenceResultHandler, Object])
    ], EntityEffects);
    exports.EntityEffects = EntityEffects;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWVmZmVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VmZmVjdHMvZW50aXR5LWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUEsd0NBQTZEO0lBRTdELDJDQUFzRDtJQUd0RCwrQkFBMkU7SUFDM0UsOENBQTBFO0lBRzFFLHdGQUF1RTtJQUN2RSw4RkFBc0U7SUFDdEUsZ0VBQStEO0lBQy9ELDRGQUFnRTtJQUdoRSx5RkFBd0U7SUFDeEUsdUhBQThGO0lBRWpGLFFBQUEsVUFBVSxHQUFlO1FBQ3BDLG9CQUFRLENBQUMsU0FBUztRQUNsQixvQkFBUSxDQUFDLFVBQVU7UUFDbkIsb0JBQVEsQ0FBQyxZQUFZO1FBQ3JCLG9CQUFRLENBQUMsVUFBVTtRQUNuQixvQkFBUSxDQUFDLFlBQVk7UUFDckIsb0JBQVEsQ0FBQyxlQUFlO1FBQ3hCLG9CQUFRLENBQUMsZUFBZTtRQUN4QixvQkFBUSxDQUFDLGVBQWU7S0FDekIsQ0FBQztJQUdGLElBQWEsYUFBYSxHQUExQixNQUFhLGFBQWE7UUEwQnhCLFlBQ1UsT0FBOEIsRUFDOUIsV0FBOEIsRUFDOUIsbUJBQXdDLEVBQ3hDLGFBQXVDO1FBQy9DOzs7O1dBSUc7UUFHSyxTQUF3QjtZQVh4QixZQUFPLEdBQVAsT0FBTyxDQUF1QjtZQUM5QixnQkFBVyxHQUFYLFdBQVcsQ0FBbUI7WUFDOUIsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtZQUN4QyxrQkFBYSxHQUFiLGFBQWEsQ0FBMEI7WUFRdkMsY0FBUyxHQUFULFNBQVMsQ0FBZTtZQXJDbEMsMEVBQTBFO1lBQzFFLHVGQUF1RjtZQUMvRSxrQkFBYSxHQUFHLEVBQUUsQ0FBQztZQUUzQjs7ZUFFRztZQUNILFlBQU8sR0FBb0Isc0JBQVksQ0FDckMsR0FBRyxFQUFFLENBQ0gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQ2Ysb0NBQVUsQ0FBQyxvQkFBUSxDQUFDLGNBQWMsQ0FBQyxFQUNuQyxlQUFHLENBQUMsQ0FBQyxNQUFvQixFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUMzRCxrQkFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxDQUN6QixFQUNILEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUNwQixDQUFDO1lBRUYsMEVBQTBFO1lBQzFFLGFBQVEsR0FBdUIsc0JBQVksQ0FBQyxHQUFHLEVBQUUsQ0FDL0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQ2Ysb0NBQVUsQ0FBQyxrQkFBVSxDQUFDLEVBQ3RCLG9CQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQ3pDLENBQ0YsQ0FBQztRQWVDLENBQUM7UUFFSjs7OztXQUlHO1FBQ0gsT0FBTyxDQUFDLE1BQW9CO1lBQzFCLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUU7Z0JBQ3ZCLDRDQUE0QztnQkFDNUMsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDeEM7WUFDRCxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO2dCQUN4QixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN4RDtZQUNELElBQUk7Z0JBQ0Ysc0ZBQXNGO2dCQUN0Rix5REFBeUQ7Z0JBQ3pELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUN6QixrQkFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEtBQUssRUFBRSxDQUFDLEVBQ2pELGVBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUNQLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUU7b0JBQ2hELFFBQVEsRUFBRSxvQkFBUSxDQUFDLGdCQUFnQjtpQkFDcEMsQ0FBQyxDQUNILENBQ0YsQ0FBQztnQkFFRixzRkFBc0Y7Z0JBQ3RGLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUN6QyxlQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsRUFDN0Msc0JBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQ3RDLENBQUM7Z0JBRUYsd0VBQXdFO2dCQUN4RSxPQUFPLFdBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDbkI7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDWixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDdkM7UUFDSCxDQUFDO1FBRU8sZUFBZSxDQUFDLE1BQW9CO1lBQzFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDdEQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEQsUUFBUSxRQUFRLEVBQUU7Z0JBQ2hCLEtBQUssb0JBQVEsQ0FBQyxTQUFTLENBQUM7Z0JBQ3hCLEtBQUssb0JBQVEsQ0FBQyxVQUFVO29CQUN0QixPQUFPLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFFMUIsS0FBSyxvQkFBUSxDQUFDLFlBQVk7b0JBQ3hCLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFL0IsS0FBSyxvQkFBUSxDQUFDLFVBQVU7b0JBQ3RCLE9BQU8sT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFcEMsS0FBSyxvQkFBUSxDQUFDLFlBQVk7b0JBQ3hCLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFM0IsS0FBSyxvQkFBUSxDQUFDLGVBQWU7b0JBQzNCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFOUIsS0FBSyxvQkFBUSxDQUFDLGVBQWU7b0JBQzNCLE1BQU0sRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBbUIsQ0FBQyxDQUFDLHlCQUF5QjtvQkFDdEUsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FDOUIsZUFBRyxDQUFDLENBQUMsYUFBa0IsRUFBRSxFQUFFO3dCQUN6QixnREFBZ0Q7d0JBQ2hELHdFQUF3RTt3QkFDeEUsc0NBQXNDO3dCQUN0Qyx3Q0FBd0M7d0JBQ3hDLGdGQUFnRjt3QkFDaEYseUNBQXlDO3dCQUN6QyxNQUFNLE9BQU8sR0FDWCxhQUFhLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO3dCQUN6RCxNQUFNLFlBQVksR0FBNEIsT0FBTzs0QkFDbkQsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLE9BQU8sa0NBQU8sT0FBTyxHQUFLLGFBQWEsQ0FBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUU7NEJBQ2xFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO3dCQUNwQyxPQUFPLFlBQVksQ0FBQztvQkFDdEIsQ0FBQyxDQUFDLENBQ0gsQ0FBQztnQkFFSixLQUFLLG9CQUFRLENBQUMsZUFBZTtvQkFDM0IsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FDOUIsZUFBRyxDQUFDLENBQUMsY0FBbUIsRUFBRSxFQUFFO3dCQUMxQixNQUFNLE9BQU8sR0FDWCxjQUFjLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO3dCQUMzRCxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxrQ0FBa0M7b0JBQzVFLENBQUMsQ0FBQyxDQUNILENBQUM7Z0JBQ0o7b0JBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsUUFBUSx1QkFBdUIsQ0FBQyxDQUFDO2FBQzNFO1FBQ0gsQ0FBQztRQUVEOzs7V0FHRztRQUNLLFlBQVksQ0FDbEIsTUFBb0I7WUFFcEIseUNBQXlDO1lBQ3pDLHFDQUFxQztZQUNyQywrQ0FBK0M7WUFDL0MsT0FBTyxDQUFDLEtBQVksRUFBRSxFQUFFLENBQ3RCLFNBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDcEQsaUJBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxTQUFTLElBQUkscUJBQWMsQ0FBQyxDQUM1RCxDQUFDO1FBQ04sQ0FBQztRQUVEOzs7V0FHRztRQUNLLGtCQUFrQixDQUN4QixjQUE0QjtZQUU1QixNQUFNLFNBQVMsR0FBRyx5QkFBYSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDakUsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUM3RCxjQUFjLEVBQ2Q7Z0JBQ0UsUUFBUSxFQUFFLFNBQVM7YUFDcEIsQ0FDRixDQUFDO1lBQ0YsZ0NBQWdDO1lBQ2hDLHlEQUF5RDtZQUN6RCwrQ0FBK0M7WUFDL0MsT0FBTyxTQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUMzQixpQkFBSyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFNBQVMsSUFBSSxxQkFBYyxDQUFDLENBQzVELENBQUM7UUFDSixDQUFDO0tBQ0YsQ0FBQTtJQXhLWSxhQUFhO1FBRHpCLGlCQUFVLEVBQUU7UUFxQ1IsbUJBQUEsZUFBUSxFQUFFLENBQUE7UUFDVixtQkFBQSxhQUFNLENBQUMsbURBQXdCLENBQUMsQ0FBQTtpREFWaEIsaUJBQU87WUFDSCx1Q0FBaUI7WUFDVCwyQ0FBbUI7WUFDekIsNkRBQXdCO09BOUJ0QyxhQUFhLENBd0t6QjtJQXhLWSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IEFjdGlvbnMsIGNyZWF0ZUVmZmVjdCB9IGZyb20gJ0BuZ3J4L2VmZmVjdHMnO1xuaW1wb3J0IHsgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgYXN5bmNTY2hlZHVsZXIsIE9ic2VydmFibGUsIG9mLCByYWNlLCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBjYXRjaEVycm9yLCBkZWxheSwgZmlsdGVyLCBtYXAsIG1lcmdlTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uRmFjdG9yeSB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1mYWN0b3J5JztcbmltcG9ydCB7IEVOVElUWV9FRkZFQ1RTX1NDSEVEVUxFUiB9IGZyb20gJy4vZW50aXR5LWVmZmVjdHMtc2NoZWR1bGVyJztcbmltcG9ydCB7IEVudGl0eU9wLCBtYWtlU3VjY2Vzc09wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuaW1wb3J0IHsgb2ZFbnRpdHlPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1vcGVyYXRvcnMnO1xuaW1wb3J0IHsgVXBkYXRlUmVzcG9uc2VEYXRhIH0gZnJvbSAnLi4vYWN0aW9ucy91cGRhdGUtcmVzcG9uc2UtZGF0YSc7XG5cbmltcG9ydCB7IEVudGl0eURhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL2VudGl0eS1kYXRhLnNlcnZpY2UnO1xuaW1wb3J0IHsgUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL3BlcnNpc3RlbmNlLXJlc3VsdC1oYW5kbGVyLnNlcnZpY2UnO1xuXG5leHBvcnQgY29uc3QgcGVyc2lzdE9wczogRW50aXR5T3BbXSA9IFtcbiAgRW50aXR5T3AuUVVFUllfQUxMLFxuICBFbnRpdHlPcC5RVUVSWV9MT0FELFxuICBFbnRpdHlPcC5RVUVSWV9CWV9LRVksXG4gIEVudGl0eU9wLlFVRVJZX01BTlksXG4gIEVudGl0eU9wLlNBVkVfQUREX09ORSxcbiAgRW50aXR5T3AuU0FWRV9ERUxFVEVfT05FLFxuICBFbnRpdHlPcC5TQVZFX1VQREFURV9PTkUsXG4gIEVudGl0eU9wLlNBVkVfVVBTRVJUX09ORSxcbl07XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlFZmZlY3RzIHtcbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9SZWFjdGl2ZVgvcnhqcy9ibG9iL21hc3Rlci9kb2MvbWFyYmxlLXRlc3RpbmcubWRcbiAgLyoqIERlbGF5IGZvciBlcnJvciBhbmQgc2tpcCBvYnNlcnZhYmxlcy4gTXVzdCBiZSBtdWx0aXBsZSBvZiAxMCBmb3IgbWFyYmxlIHRlc3RpbmcuICovXG4gIHByaXZhdGUgcmVzcG9uc2VEZWxheSA9IDEwO1xuXG4gIC8qKlxuICAgKiBPYnNlcnZhYmxlIG9mIG5vbi1udWxsIGNhbmNlbGxhdGlvbiBjb3JyZWxhdGlvbiBpZHMgZnJvbSBDQU5DRUxfUEVSU0lTVCBhY3Rpb25zXG4gICAqL1xuICBjYW5jZWwkOiBPYnNlcnZhYmxlPGFueT4gPSBjcmVhdGVFZmZlY3QoXG4gICAgKCkgPT5cbiAgICAgIHRoaXMuYWN0aW9ucy5waXBlKFxuICAgICAgICBvZkVudGl0eU9wKEVudGl0eU9wLkNBTkNFTF9QRVJTSVNUKSxcbiAgICAgICAgbWFwKChhY3Rpb246IEVudGl0eUFjdGlvbikgPT4gYWN0aW9uLnBheWxvYWQuY29ycmVsYXRpb25JZCksXG4gICAgICAgIGZpbHRlcihpZCA9PiBpZCAhPSBudWxsKVxuICAgICAgKSxcbiAgICB7IGRpc3BhdGNoOiBmYWxzZSB9XG4gICk7XG5cbiAgLy8gYG1lcmdlTWFwYCBhbGxvd3MgZm9yIGNvbmN1cnJlbnQgcmVxdWVzdHMgd2hpY2ggbWF5IHJldHVybiBpbiBhbnkgb3JkZXJcbiAgcGVyc2lzdCQ6IE9ic2VydmFibGU8QWN0aW9uPiA9IGNyZWF0ZUVmZmVjdCgoKSA9PlxuICAgIHRoaXMuYWN0aW9ucy5waXBlKFxuICAgICAgb2ZFbnRpdHlPcChwZXJzaXN0T3BzKSxcbiAgICAgIG1lcmdlTWFwKGFjdGlvbiA9PiB0aGlzLnBlcnNpc3QoYWN0aW9uKSlcbiAgICApXG4gICk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBhY3Rpb25zOiBBY3Rpb25zPEVudGl0eUFjdGlvbj4sXG4gICAgcHJpdmF0ZSBkYXRhU2VydmljZTogRW50aXR5RGF0YVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbnRpdHlBY3Rpb25GYWN0b3J5OiBFbnRpdHlBY3Rpb25GYWN0b3J5LFxuICAgIHByaXZhdGUgcmVzdWx0SGFuZGxlcjogUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyLFxuICAgIC8qKlxuICAgICAqIEluamVjdGluZyBhbiBvcHRpb25hbCBTY2hlZHVsZXIgdGhhdCB3aWxsIGJlIHVuZGVmaW5lZFxuICAgICAqIGluIG5vcm1hbCBhcHBsaWNhdGlvbiB1c2FnZSwgYnV0IGl0cyBpbmplY3RlZCBoZXJlIHNvIHRoYXQgeW91IGNhbiBtb2NrIG91dFxuICAgICAqIGR1cmluZyB0ZXN0aW5nIHVzaW5nIHRoZSBSeEpTIFRlc3RTY2hlZHVsZXIgZm9yIHNpbXVsYXRpbmcgcGFzc2FnZXMgb2YgdGltZS5cbiAgICAgKi9cbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoRU5USVRZX0VGRkVDVFNfU0NIRURVTEVSKVxuICAgIHByaXZhdGUgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlXG4gICkge31cblxuICAvKipcbiAgICogUGVyZm9ybSB0aGUgcmVxdWVzdGVkIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBhbmQgcmV0dXJuIGEgc2NhbGFyIE9ic2VydmFibGU8QWN0aW9uPlxuICAgKiB0aGF0IHRoZSBlZmZlY3Qgc2hvdWxkIGRpc3BhdGNoIHRvIHRoZSBzdG9yZSBhZnRlciB0aGUgc2VydmVyIHJlc3BvbmRzLlxuICAgKiBAcGFyYW0gYWN0aW9uIEEgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIEVudGl0eUFjdGlvblxuICAgKi9cbiAgcGVyc2lzdChhY3Rpb246IEVudGl0eUFjdGlvbik6IE9ic2VydmFibGU8QWN0aW9uPiB7XG4gICAgaWYgKGFjdGlvbi5wYXlsb2FkLnNraXApIHtcbiAgICAgIC8vIFNob3VsZCBub3QgcGVyc2lzdC4gUHJldGVuZCBpdCBzdWNjZWVkZWQuXG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVTa2lwU3VjY2VzcyQoYWN0aW9uKTtcbiAgICB9XG4gICAgaWYgKGFjdGlvbi5wYXlsb2FkLmVycm9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVFcnJvciQoYWN0aW9uKShhY3Rpb24ucGF5bG9hZC5lcnJvcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyBDYW5jZWxsYXRpb246IHJldHVybnMgT2JzZXJ2YWJsZSBvZiBDQU5DRUxFRF9QRVJTSVNUIGZvciBhIHBlcnNpc3RlbmNlIEVudGl0eUFjdGlvblxuICAgICAgLy8gd2hvc2UgY29ycmVsYXRpb25JZCBtYXRjaGVzIGNhbmNlbGxhdGlvbiBjb3JyZWxhdGlvbklkXG4gICAgICBjb25zdCBjID0gdGhpcy5jYW5jZWwkLnBpcGUoXG4gICAgICAgIGZpbHRlcihpZCA9PiBhY3Rpb24ucGF5bG9hZC5jb3JyZWxhdGlvbklkID09PSBpZCksXG4gICAgICAgIG1hcChpZCA9PlxuICAgICAgICAgIHRoaXMuZW50aXR5QWN0aW9uRmFjdG9yeS5jcmVhdGVGcm9tQWN0aW9uKGFjdGlvbiwge1xuICAgICAgICAgICAgZW50aXR5T3A6IEVudGl0eU9wLkNBTkNFTEVEX1BFUlNJU1QsXG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgKTtcblxuICAgICAgLy8gRGF0YTogZW50aXR5IGNvbGxlY3Rpb24gRGF0YVNlcnZpY2UgcmVzdWx0IGFzIGEgc3VjY2Vzc2Z1bCBwZXJzaXN0ZW5jZSBFbnRpdHlBY3Rpb25cbiAgICAgIGNvbnN0IGQgPSB0aGlzLmNhbGxEYXRhU2VydmljZShhY3Rpb24pLnBpcGUoXG4gICAgICAgIG1hcCh0aGlzLnJlc3VsdEhhbmRsZXIuaGFuZGxlU3VjY2VzcyhhY3Rpb24pKSxcbiAgICAgICAgY2F0Y2hFcnJvcih0aGlzLmhhbmRsZUVycm9yJChhY3Rpb24pKVxuICAgICAgKTtcblxuICAgICAgLy8gRW1pdCB3aGljaCBldmVyIGdldHMgdGhlcmUgZmlyc3Q7IHRoZSBvdGhlciBvYnNlcnZhYmxlIGlzIHRlcm1pbmF0ZWQuXG4gICAgICByZXR1cm4gcmFjZShjLCBkKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZUVycm9yJChhY3Rpb24pKGVycik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjYWxsRGF0YVNlcnZpY2UoYWN0aW9uOiBFbnRpdHlBY3Rpb24pIHtcbiAgICBjb25zdCB7IGVudGl0eU5hbWUsIGVudGl0eU9wLCBkYXRhIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBjb25zdCBzZXJ2aWNlID0gdGhpcy5kYXRhU2VydmljZS5nZXRTZXJ2aWNlKGVudGl0eU5hbWUpO1xuICAgIHN3aXRjaCAoZW50aXR5T3ApIHtcbiAgICAgIGNhc2UgRW50aXR5T3AuUVVFUllfQUxMOlxuICAgICAgY2FzZSBFbnRpdHlPcC5RVUVSWV9MT0FEOlxuICAgICAgICByZXR1cm4gc2VydmljZS5nZXRBbGwoKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5RVUVSWV9CWV9LRVk6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLmdldEJ5SWQoZGF0YSk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuUVVFUllfTUFOWTpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuZ2V0V2l0aFF1ZXJ5KGRhdGEpO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlNBVkVfQUREX09ORTpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuYWRkKGRhdGEpO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlNBVkVfREVMRVRFX09ORTpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuZGVsZXRlKGRhdGEpO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlNBVkVfVVBEQVRFX09ORTpcbiAgICAgICAgY29uc3QgeyBpZCwgY2hhbmdlcyB9ID0gZGF0YSBhcyBVcGRhdGU8YW55PjsgLy8gZGF0YSBtdXN0IGJlIFVwZGF0ZTxUPlxuICAgICAgICByZXR1cm4gc2VydmljZS51cGRhdGUoZGF0YSkucGlwZShcbiAgICAgICAgICBtYXAoKHVwZGF0ZWRFbnRpdHk6IGFueSkgPT4ge1xuICAgICAgICAgICAgLy8gUmV0dXJuIGFuIFVwZGF0ZTxUPiB3aXRoIHVwZGF0ZWQgZW50aXR5IGRhdGEuXG4gICAgICAgICAgICAvLyBJZiBzZXJ2ZXIgcmV0dXJuZWQgZW50aXR5IGRhdGEsIG1lcmdlIHdpdGggdGhlIGNoYW5nZXMgdGhhdCB3ZXJlIHNlbnRcbiAgICAgICAgICAgIC8vIGFuZCBzZXQgdGhlICdjaGFuZ2VkJyBmbGFnIHRvIHRydWUuXG4gICAgICAgICAgICAvLyBJZiBzZXJ2ZXIgZGlkIG5vdCByZXR1cm4gZW50aXR5IGRhdGEsXG4gICAgICAgICAgICAvLyBhc3N1bWUgaXQgbWFkZSBubyBhZGRpdGlvbmFsIGNoYW5nZXMgb2YgaXRzIG93biwgcmV0dXJuIHRoZSBvcmlnaW5hbCBjaGFuZ2VzLFxuICAgICAgICAgICAgLy8gYW5kIHNldCB0aGUgYGNoYW5nZWRgIGZsYWcgdG8gYGZhbHNlYC5cbiAgICAgICAgICAgIGNvbnN0IGhhc0RhdGEgPVxuICAgICAgICAgICAgICB1cGRhdGVkRW50aXR5ICYmIE9iamVjdC5rZXlzKHVwZGF0ZWRFbnRpdHkpLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZURhdGE6IFVwZGF0ZVJlc3BvbnNlRGF0YTxhbnk+ID0gaGFzRGF0YVxuICAgICAgICAgICAgICA/IHsgaWQsIGNoYW5nZXM6IHsgLi4uY2hhbmdlcywgLi4udXBkYXRlZEVudGl0eSB9LCBjaGFuZ2VkOiB0cnVlIH1cbiAgICAgICAgICAgICAgOiB7IGlkLCBjaGFuZ2VzLCBjaGFuZ2VkOiBmYWxzZSB9O1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlRGF0YTtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlNBVkVfVVBTRVJUX09ORTpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UudXBzZXJ0KGRhdGEpLnBpcGUoXG4gICAgICAgICAgbWFwKCh1cHNlcnRlZEVudGl0eTogYW55KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBoYXNEYXRhID1cbiAgICAgICAgICAgICAgdXBzZXJ0ZWRFbnRpdHkgJiYgT2JqZWN0LmtleXModXBzZXJ0ZWRFbnRpdHkpLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICByZXR1cm4gaGFzRGF0YSA/IHVwc2VydGVkRW50aXR5IDogZGF0YTsgLy8gZW5zdXJlIGEgcmV0dXJuZWQgZW50aXR5IHZhbHVlLlxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFBlcnNpc3RlbmNlIGFjdGlvbiBcIiR7ZW50aXR5T3B9XCIgaXMgbm90IGltcGxlbWVudGVkLmApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgZXJyb3IgcmVzdWx0IG9mIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBvbiBhbiBFbnRpdHlBY3Rpb24sXG4gICAqIHJldHVybmluZyBhIHNjYWxhciBvYnNlcnZhYmxlIG9mIGVycm9yIGFjdGlvblxuICAgKi9cbiAgcHJpdmF0ZSBoYW5kbGVFcnJvciQoXG4gICAgYWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgKTogKGVycm9yOiBFcnJvcikgPT4gT2JzZXJ2YWJsZTxFbnRpdHlBY3Rpb24+IHtcbiAgICAvLyBBbHRob3VnaCBlcnJvciBtYXkgcmV0dXJuIGltbWVkaWF0ZWx5LFxuICAgIC8vIGVuc3VyZSBvYnNlcnZhYmxlIHRha2VzIHNvbWUgdGltZSxcbiAgICAvLyBhcyBhcHAgbGlrZWx5IGFzc3VtZXMgYXN5bmNocm9ub3VzIHJlc3BvbnNlLlxuICAgIHJldHVybiAoZXJyb3I6IEVycm9yKSA9PlxuICAgICAgb2YodGhpcy5yZXN1bHRIYW5kbGVyLmhhbmRsZUVycm9yKGFjdGlvbikoZXJyb3IpKS5waXBlKFxuICAgICAgICBkZWxheSh0aGlzLnJlc3BvbnNlRGVsYXksIHRoaXMuc2NoZWR1bGVyIHx8IGFzeW5jU2NoZWR1bGVyKVxuICAgICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCZWNhdXNlIEVudGl0eUFjdGlvbi5wYXlsb2FkLnNraXAgaXMgdHJ1ZSwgc2tpcCB0aGUgcGVyc2lzdGVuY2Ugc3RlcCBhbmRcbiAgICogcmV0dXJuIGEgc2NhbGFyIHN1Y2Nlc3MgYWN0aW9uIHRoYXQgbG9va3MgbGlrZSB0aGUgb3BlcmF0aW9uIHN1Y2NlZWRlZC5cbiAgICovXG4gIHByaXZhdGUgaGFuZGxlU2tpcFN1Y2Nlc3MkKFxuICAgIG9yaWdpbmFsQWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgKTogT2JzZXJ2YWJsZTxFbnRpdHlBY3Rpb24+IHtcbiAgICBjb25zdCBzdWNjZXNzT3AgPSBtYWtlU3VjY2Vzc09wKG9yaWdpbmFsQWN0aW9uLnBheWxvYWQuZW50aXR5T3ApO1xuICAgIGNvbnN0IHN1Y2Nlc3NBY3Rpb24gPSB0aGlzLmVudGl0eUFjdGlvbkZhY3RvcnkuY3JlYXRlRnJvbUFjdGlvbihcbiAgICAgIG9yaWdpbmFsQWN0aW9uLFxuICAgICAge1xuICAgICAgICBlbnRpdHlPcDogc3VjY2Vzc09wLFxuICAgICAgfVxuICAgICk7XG4gICAgLy8gQWx0aG91Z2ggcmV0dXJucyBpbW1lZGlhdGVseSxcbiAgICAvLyBlbnN1cmUgb2JzZXJ2YWJsZSB0YWtlcyBvbmUgdGljayAoYnkgdXNpbmcgYSBwcm9taXNlKSxcbiAgICAvLyBhcyBhcHAgbGlrZWx5IGFzc3VtZXMgYXN5bmNocm9ub3VzIHJlc3BvbnNlLlxuICAgIHJldHVybiBvZihzdWNjZXNzQWN0aW9uKS5waXBlKFxuICAgICAgZGVsYXkodGhpcy5yZXNwb25zZURlbGF5LCB0aGlzLnNjaGVkdWxlciB8fCBhc3luY1NjaGVkdWxlcilcbiAgICApO1xuICB9XG59XG4iXX0=