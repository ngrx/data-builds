import { Inject, Injectable, Optional } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { asyncScheduler, of, race } from 'rxjs';
import { catchError, delay, filter, map, mergeMap } from 'rxjs/operators';
import { EntityActionFactory } from '../actions/entity-action-factory';
import { ENTITY_EFFECTS_SCHEDULER } from './entity-effects-scheduler';
import { EntityOp, makeSuccessOp } from '../actions/entity-op';
import { ofEntityOp } from '../actions/entity-action-operators';
import { EntityDataService } from '../dataservices/entity-data.service';
import { PersistenceResultHandler } from '../dataservices/persistence-result-handler.service';
export const persistOps = [
    EntityOp.QUERY_ALL,
    EntityOp.QUERY_LOAD,
    EntityOp.QUERY_BY_KEY,
    EntityOp.QUERY_MANY,
    EntityOp.SAVE_ADD_ONE,
    EntityOp.SAVE_DELETE_ONE,
    EntityOp.SAVE_UPDATE_ONE,
    EntityOp.SAVE_UPSERT_ONE,
];
export class EntityEffects {
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
        this.cancel$ = createEffect(() => this.actions.pipe(ofEntityOp(EntityOp.CANCEL_PERSIST), map((action) => action.payload.correlationId), filter((id) => id != null)), { dispatch: false });
        // `mergeMap` allows for concurrent requests which may return in any order
        this.persist$ = createEffect(() => this.actions.pipe(ofEntityOp(persistOps), mergeMap((action) => this.persist(action))));
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
            const c = this.cancel$.pipe(filter((id) => action.payload.correlationId === id), map((id) => this.entityActionFactory.createFromAction(action, {
                entityOp: EntityOp.CANCELED_PERSIST,
            })));
            // Data: entity collection DataService result as a successful persistence EntityAction
            const d = this.callDataService(action).pipe(map(this.resultHandler.handleSuccess(action)), catchError(this.handleError$(action)));
            // Emit which ever gets there first; the other observable is terminated.
            return race(c, d);
        }
        catch (err) {
            return this.handleError$(action)(err);
        }
    }
    callDataService(action) {
        const { entityName, entityOp, data } = action.payload;
        const service = this.dataService.getService(entityName);
        switch (entityOp) {
            case EntityOp.QUERY_ALL:
            case EntityOp.QUERY_LOAD:
                return service.getAll();
            case EntityOp.QUERY_BY_KEY:
                return service.getById(data);
            case EntityOp.QUERY_MANY:
                return service.getWithQuery(data);
            case EntityOp.SAVE_ADD_ONE:
                return service.add(data);
            case EntityOp.SAVE_DELETE_ONE:
                return service.delete(data);
            case EntityOp.SAVE_UPDATE_ONE:
                const { id, changes } = data; // data must be Update<T>
                return service.update(data).pipe(map((updatedEntity) => {
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
            case EntityOp.SAVE_UPSERT_ONE:
                return service.upsert(data).pipe(map((upsertedEntity) => {
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
        return (error) => of(this.resultHandler.handleError(action)(error)).pipe(delay(this.responseDelay, this.scheduler || asyncScheduler));
    }
    /**
     * Because EntityAction.payload.skip is true, skip the persistence step and
     * return a scalar success action that looks like the operation succeeded.
     */
    handleSkipSuccess$(originalAction) {
        const successOp = makeSuccessOp(originalAction.payload.entityOp);
        const successAction = this.entityActionFactory.createFromAction(originalAction, {
            entityOp: successOp,
        });
        // Although returns immediately,
        // ensure observable takes one tick (by using a promise),
        // as app likely assumes asynchronous response.
        return of(successAction).pipe(delay(this.responseDelay, this.scheduler || asyncScheduler));
    }
}
/** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
EntityEffects.decorators = [
    { type: Injectable }
];
/**
 * @type {function(): !Array<(null|{
 *   type: ?,
 *   decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>),
 * })>}
 * @nocollapse
 */
EntityEffects.ctorParameters = () => [
    { type: Actions },
    { type: EntityDataService },
    { type: EntityActionFactory },
    { type: PersistenceResultHandler },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [ENTITY_EFFECTS_SCHEDULER,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWVmZmVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VmZmVjdHMvZW50aXR5LWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdELE9BQU8sRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR3RELE9BQU8sRUFBRSxjQUFjLEVBQWMsRUFBRSxFQUFFLElBQUksRUFBaUIsTUFBTSxNQUFNLENBQUM7QUFDM0UsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUcxRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUdoRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN4RSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUU5RixNQUFNLENBQUMsTUFBTSxVQUFVLEdBQWU7SUFDcEMsUUFBUSxDQUFDLFNBQVM7SUFDbEIsUUFBUSxDQUFDLFVBQVU7SUFDbkIsUUFBUSxDQUFDLFlBQVk7SUFDckIsUUFBUSxDQUFDLFVBQVU7SUFDbkIsUUFBUSxDQUFDLFlBQVk7SUFDckIsUUFBUSxDQUFDLGVBQWU7SUFDeEIsUUFBUSxDQUFDLGVBQWU7SUFDeEIsUUFBUSxDQUFDLGVBQWU7Q0FDekIsQ0FBQztBQUdG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QUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRSxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQzdELGNBQWMsRUFDZDtZQUNFLFFBQVEsRUFBRSxTQUFTO1NBQ3BCLENBQ0YsQ0FBQztRQUNGLGdDQUFnQztRQUNoQyx5REFBeUQ7UUFDekQsK0NBQStDO1FBQy9DLE9BQU8sRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FDM0IsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFNBQVMsSUFBSSxjQUFjLENBQUMsQ0FDNUQsQ0FBQztJQUNKLENBQUM7Ozs7WUF4S0YsVUFBVTs7Ozs7Ozs7OztZQTNCRixPQUFPO1lBYVAsaUJBQWlCO1lBTmpCLG1CQUFtQjtZQU9uQix3QkFBd0I7NENBa0Q1QixRQUFRLFlBQ1IsTUFBTSxTQUFDLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IEFjdGlvbnMsIGNyZWF0ZUVmZmVjdCB9IGZyb20gJ0BuZ3J4L2VmZmVjdHMnO1xuaW1wb3J0IHsgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgYXN5bmNTY2hlZHVsZXIsIE9ic2VydmFibGUsIG9mLCByYWNlLCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBjYXRjaEVycm9yLCBkZWxheSwgZmlsdGVyLCBtYXAsIG1lcmdlTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uRmFjdG9yeSB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1mYWN0b3J5JztcbmltcG9ydCB7IEVOVElUWV9FRkZFQ1RTX1NDSEVEVUxFUiB9IGZyb20gJy4vZW50aXR5LWVmZmVjdHMtc2NoZWR1bGVyJztcbmltcG9ydCB7IEVudGl0eU9wLCBtYWtlU3VjY2Vzc09wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuaW1wb3J0IHsgb2ZFbnRpdHlPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1vcGVyYXRvcnMnO1xuaW1wb3J0IHsgVXBkYXRlUmVzcG9uc2VEYXRhIH0gZnJvbSAnLi4vYWN0aW9ucy91cGRhdGUtcmVzcG9uc2UtZGF0YSc7XG5cbmltcG9ydCB7IEVudGl0eURhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL2VudGl0eS1kYXRhLnNlcnZpY2UnO1xuaW1wb3J0IHsgUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL3BlcnNpc3RlbmNlLXJlc3VsdC1oYW5kbGVyLnNlcnZpY2UnO1xuXG5leHBvcnQgY29uc3QgcGVyc2lzdE9wczogRW50aXR5T3BbXSA9IFtcbiAgRW50aXR5T3AuUVVFUllfQUxMLFxuICBFbnRpdHlPcC5RVUVSWV9MT0FELFxuICBFbnRpdHlPcC5RVUVSWV9CWV9LRVksXG4gIEVudGl0eU9wLlFVRVJZX01BTlksXG4gIEVudGl0eU9wLlNBVkVfQUREX09ORSxcbiAgRW50aXR5T3AuU0FWRV9ERUxFVEVfT05FLFxuICBFbnRpdHlPcC5TQVZFX1VQREFURV9PTkUsXG4gIEVudGl0eU9wLlNBVkVfVVBTRVJUX09ORSxcbl07XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlFZmZlY3RzIHtcbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9SZWFjdGl2ZVgvcnhqcy9ibG9iL21hc3Rlci9kb2MvbWFyYmxlLXRlc3RpbmcubWRcbiAgLyoqIERlbGF5IGZvciBlcnJvciBhbmQgc2tpcCBvYnNlcnZhYmxlcy4gTXVzdCBiZSBtdWx0aXBsZSBvZiAxMCBmb3IgbWFyYmxlIHRlc3RpbmcuICovXG4gIHByaXZhdGUgcmVzcG9uc2VEZWxheSA9IDEwO1xuXG4gIC8qKlxuICAgKiBPYnNlcnZhYmxlIG9mIG5vbi1udWxsIGNhbmNlbGxhdGlvbiBjb3JyZWxhdGlvbiBpZHMgZnJvbSBDQU5DRUxfUEVSU0lTVCBhY3Rpb25zXG4gICAqL1xuICBjYW5jZWwkOiBPYnNlcnZhYmxlPGFueT4gPSBjcmVhdGVFZmZlY3QoXG4gICAgKCkgPT5cbiAgICAgIHRoaXMuYWN0aW9ucy5waXBlKFxuICAgICAgICBvZkVudGl0eU9wKEVudGl0eU9wLkNBTkNFTF9QRVJTSVNUKSxcbiAgICAgICAgbWFwKChhY3Rpb246IEVudGl0eUFjdGlvbikgPT4gYWN0aW9uLnBheWxvYWQuY29ycmVsYXRpb25JZCksXG4gICAgICAgIGZpbHRlcigoaWQpID0+IGlkICE9IG51bGwpXG4gICAgICApLFxuICAgIHsgZGlzcGF0Y2g6IGZhbHNlIH1cbiAgKTtcblxuICAvLyBgbWVyZ2VNYXBgIGFsbG93cyBmb3IgY29uY3VycmVudCByZXF1ZXN0cyB3aGljaCBtYXkgcmV0dXJuIGluIGFueSBvcmRlclxuICBwZXJzaXN0JDogT2JzZXJ2YWJsZTxBY3Rpb24+ID0gY3JlYXRlRWZmZWN0KCgpID0+XG4gICAgdGhpcy5hY3Rpb25zLnBpcGUoXG4gICAgICBvZkVudGl0eU9wKHBlcnNpc3RPcHMpLFxuICAgICAgbWVyZ2VNYXAoKGFjdGlvbikgPT4gdGhpcy5wZXJzaXN0KGFjdGlvbikpXG4gICAgKVxuICApO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgYWN0aW9uczogQWN0aW9uczxFbnRpdHlBY3Rpb24+LFxuICAgIHByaXZhdGUgZGF0YVNlcnZpY2U6IEVudGl0eURhdGFTZXJ2aWNlLFxuICAgIHByaXZhdGUgZW50aXR5QWN0aW9uRmFjdG9yeTogRW50aXR5QWN0aW9uRmFjdG9yeSxcbiAgICBwcml2YXRlIHJlc3VsdEhhbmRsZXI6IFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlcixcbiAgICAvKipcbiAgICAgKiBJbmplY3RpbmcgYW4gb3B0aW9uYWwgU2NoZWR1bGVyIHRoYXQgd2lsbCBiZSB1bmRlZmluZWRcbiAgICAgKiBpbiBub3JtYWwgYXBwbGljYXRpb24gdXNhZ2UsIGJ1dCBpdHMgaW5qZWN0ZWQgaGVyZSBzbyB0aGF0IHlvdSBjYW4gbW9jayBvdXRcbiAgICAgKiBkdXJpbmcgdGVzdGluZyB1c2luZyB0aGUgUnhKUyBUZXN0U2NoZWR1bGVyIGZvciBzaW11bGF0aW5nIHBhc3NhZ2VzIG9mIHRpbWUuXG4gICAgICovXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KEVOVElUWV9FRkZFQ1RTX1NDSEVEVUxFUilcbiAgICBwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZVxuICApIHt9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm0gdGhlIHJlcXVlc3RlZCBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gYW5kIHJldHVybiBhIHNjYWxhciBPYnNlcnZhYmxlPEFjdGlvbj5cbiAgICogdGhhdCB0aGUgZWZmZWN0IHNob3VsZCBkaXNwYXRjaCB0byB0aGUgc3RvcmUgYWZ0ZXIgdGhlIHNlcnZlciByZXNwb25kcy5cbiAgICogQHBhcmFtIGFjdGlvbiBBIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBFbnRpdHlBY3Rpb25cbiAgICovXG4gIHBlcnNpc3QoYWN0aW9uOiBFbnRpdHlBY3Rpb24pOiBPYnNlcnZhYmxlPEFjdGlvbj4ge1xuICAgIGlmIChhY3Rpb24ucGF5bG9hZC5za2lwKSB7XG4gICAgICAvLyBTaG91bGQgbm90IHBlcnNpc3QuIFByZXRlbmQgaXQgc3VjY2VlZGVkLlxuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlU2tpcFN1Y2Nlc3MkKGFjdGlvbik7XG4gICAgfVxuICAgIGlmIChhY3Rpb24ucGF5bG9hZC5lcnJvcikge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRXJyb3IkKGFjdGlvbikoYWN0aW9uLnBheWxvYWQuZXJyb3IpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gQ2FuY2VsbGF0aW9uOiByZXR1cm5zIE9ic2VydmFibGUgb2YgQ0FOQ0VMRURfUEVSU0lTVCBmb3IgYSBwZXJzaXN0ZW5jZSBFbnRpdHlBY3Rpb25cbiAgICAgIC8vIHdob3NlIGNvcnJlbGF0aW9uSWQgbWF0Y2hlcyBjYW5jZWxsYXRpb24gY29ycmVsYXRpb25JZFxuICAgICAgY29uc3QgYyA9IHRoaXMuY2FuY2VsJC5waXBlKFxuICAgICAgICBmaWx0ZXIoKGlkKSA9PiBhY3Rpb24ucGF5bG9hZC5jb3JyZWxhdGlvbklkID09PSBpZCksXG4gICAgICAgIG1hcCgoaWQpID0+XG4gICAgICAgICAgdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5LmNyZWF0ZUZyb21BY3Rpb24oYWN0aW9uLCB7XG4gICAgICAgICAgICBlbnRpdHlPcDogRW50aXR5T3AuQ0FOQ0VMRURfUEVSU0lTVCxcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICApO1xuXG4gICAgICAvLyBEYXRhOiBlbnRpdHkgY29sbGVjdGlvbiBEYXRhU2VydmljZSByZXN1bHQgYXMgYSBzdWNjZXNzZnVsIHBlcnNpc3RlbmNlIEVudGl0eUFjdGlvblxuICAgICAgY29uc3QgZCA9IHRoaXMuY2FsbERhdGFTZXJ2aWNlKGFjdGlvbikucGlwZShcbiAgICAgICAgbWFwKHRoaXMucmVzdWx0SGFuZGxlci5oYW5kbGVTdWNjZXNzKGFjdGlvbikpLFxuICAgICAgICBjYXRjaEVycm9yKHRoaXMuaGFuZGxlRXJyb3IkKGFjdGlvbikpXG4gICAgICApO1xuXG4gICAgICAvLyBFbWl0IHdoaWNoIGV2ZXIgZ2V0cyB0aGVyZSBmaXJzdDsgdGhlIG90aGVyIG9ic2VydmFibGUgaXMgdGVybWluYXRlZC5cbiAgICAgIHJldHVybiByYWNlKGMsIGQpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRXJyb3IkKGFjdGlvbikoZXJyKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNhbGxEYXRhU2VydmljZShhY3Rpb246IEVudGl0eUFjdGlvbikge1xuICAgIGNvbnN0IHsgZW50aXR5TmFtZSwgZW50aXR5T3AsIGRhdGEgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIGNvbnN0IHNlcnZpY2UgPSB0aGlzLmRhdGFTZXJ2aWNlLmdldFNlcnZpY2UoZW50aXR5TmFtZSk7XG4gICAgc3dpdGNoIChlbnRpdHlPcCkge1xuICAgICAgY2FzZSBFbnRpdHlPcC5RVUVSWV9BTEw6XG4gICAgICBjYXNlIEVudGl0eU9wLlFVRVJZX0xPQUQ6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLmdldEFsbCgpO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlFVRVJZX0JZX0tFWTpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuZ2V0QnlJZChkYXRhKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5RVUVSWV9NQU5ZOlxuICAgICAgICByZXR1cm4gc2VydmljZS5nZXRXaXRoUXVlcnkoZGF0YSk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuU0FWRV9BRERfT05FOlxuICAgICAgICByZXR1cm4gc2VydmljZS5hZGQoZGF0YSk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuU0FWRV9ERUxFVEVfT05FOlxuICAgICAgICByZXR1cm4gc2VydmljZS5kZWxldGUoZGF0YSk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuU0FWRV9VUERBVEVfT05FOlxuICAgICAgICBjb25zdCB7IGlkLCBjaGFuZ2VzIH0gPSBkYXRhIGFzIFVwZGF0ZTxhbnk+OyAvLyBkYXRhIG11c3QgYmUgVXBkYXRlPFQ+XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLnVwZGF0ZShkYXRhKS5waXBlKFxuICAgICAgICAgIG1hcCgodXBkYXRlZEVudGl0eTogYW55KSA9PiB7XG4gICAgICAgICAgICAvLyBSZXR1cm4gYW4gVXBkYXRlPFQ+IHdpdGggdXBkYXRlZCBlbnRpdHkgZGF0YS5cbiAgICAgICAgICAgIC8vIElmIHNlcnZlciByZXR1cm5lZCBlbnRpdHkgZGF0YSwgbWVyZ2Ugd2l0aCB0aGUgY2hhbmdlcyB0aGF0IHdlcmUgc2VudFxuICAgICAgICAgICAgLy8gYW5kIHNldCB0aGUgJ2NoYW5nZWQnIGZsYWcgdG8gdHJ1ZS5cbiAgICAgICAgICAgIC8vIElmIHNlcnZlciBkaWQgbm90IHJldHVybiBlbnRpdHkgZGF0YSxcbiAgICAgICAgICAgIC8vIGFzc3VtZSBpdCBtYWRlIG5vIGFkZGl0aW9uYWwgY2hhbmdlcyBvZiBpdHMgb3duLCByZXR1cm4gdGhlIG9yaWdpbmFsIGNoYW5nZXMsXG4gICAgICAgICAgICAvLyBhbmQgc2V0IHRoZSBgY2hhbmdlZGAgZmxhZyB0byBgZmFsc2VgLlxuICAgICAgICAgICAgY29uc3QgaGFzRGF0YSA9XG4gICAgICAgICAgICAgIHVwZGF0ZWRFbnRpdHkgJiYgT2JqZWN0LmtleXModXBkYXRlZEVudGl0eSkubGVuZ3RoID4gMDtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YTogVXBkYXRlUmVzcG9uc2VEYXRhPGFueT4gPSBoYXNEYXRhXG4gICAgICAgICAgICAgID8geyBpZCwgY2hhbmdlczogeyAuLi5jaGFuZ2VzLCAuLi51cGRhdGVkRW50aXR5IH0sIGNoYW5nZWQ6IHRydWUgfVxuICAgICAgICAgICAgICA6IHsgaWQsIGNoYW5nZXMsIGNoYW5nZWQ6IGZhbHNlIH07XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VEYXRhO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuU0FWRV9VUFNFUlRfT05FOlxuICAgICAgICByZXR1cm4gc2VydmljZS51cHNlcnQoZGF0YSkucGlwZShcbiAgICAgICAgICBtYXAoKHVwc2VydGVkRW50aXR5OiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGhhc0RhdGEgPVxuICAgICAgICAgICAgICB1cHNlcnRlZEVudGl0eSAmJiBPYmplY3Qua2V5cyh1cHNlcnRlZEVudGl0eSkubGVuZ3RoID4gMDtcbiAgICAgICAgICAgIHJldHVybiBoYXNEYXRhID8gdXBzZXJ0ZWRFbnRpdHkgOiBkYXRhOyAvLyBlbnN1cmUgYSByZXR1cm5lZCBlbnRpdHkgdmFsdWUuXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgUGVyc2lzdGVuY2UgYWN0aW9uIFwiJHtlbnRpdHlPcH1cIiBpcyBub3QgaW1wbGVtZW50ZWQuYCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBlcnJvciByZXN1bHQgb2YgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIG9uIGFuIEVudGl0eUFjdGlvbixcbiAgICogcmV0dXJuaW5nIGEgc2NhbGFyIG9ic2VydmFibGUgb2YgZXJyb3IgYWN0aW9uXG4gICAqL1xuICBwcml2YXRlIGhhbmRsZUVycm9yJChcbiAgICBhY3Rpb246IEVudGl0eUFjdGlvblxuICApOiAoZXJyb3I6IEVycm9yKSA9PiBPYnNlcnZhYmxlPEVudGl0eUFjdGlvbj4ge1xuICAgIC8vIEFsdGhvdWdoIGVycm9yIG1heSByZXR1cm4gaW1tZWRpYXRlbHksXG4gICAgLy8gZW5zdXJlIG9ic2VydmFibGUgdGFrZXMgc29tZSB0aW1lLFxuICAgIC8vIGFzIGFwcCBsaWtlbHkgYXNzdW1lcyBhc3luY2hyb25vdXMgcmVzcG9uc2UuXG4gICAgcmV0dXJuIChlcnJvcjogRXJyb3IpID0+XG4gICAgICBvZih0aGlzLnJlc3VsdEhhbmRsZXIuaGFuZGxlRXJyb3IoYWN0aW9uKShlcnJvcikpLnBpcGUoXG4gICAgICAgIGRlbGF5KHRoaXMucmVzcG9uc2VEZWxheSwgdGhpcy5zY2hlZHVsZXIgfHwgYXN5bmNTY2hlZHVsZXIpXG4gICAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEJlY2F1c2UgRW50aXR5QWN0aW9uLnBheWxvYWQuc2tpcCBpcyB0cnVlLCBza2lwIHRoZSBwZXJzaXN0ZW5jZSBzdGVwIGFuZFxuICAgKiByZXR1cm4gYSBzY2FsYXIgc3VjY2VzcyBhY3Rpb24gdGhhdCBsb29rcyBsaWtlIHRoZSBvcGVyYXRpb24gc3VjY2VlZGVkLlxuICAgKi9cbiAgcHJpdmF0ZSBoYW5kbGVTa2lwU3VjY2VzcyQoXG4gICAgb3JpZ2luYWxBY3Rpb246IEVudGl0eUFjdGlvblxuICApOiBPYnNlcnZhYmxlPEVudGl0eUFjdGlvbj4ge1xuICAgIGNvbnN0IHN1Y2Nlc3NPcCA9IG1ha2VTdWNjZXNzT3Aob3JpZ2luYWxBY3Rpb24ucGF5bG9hZC5lbnRpdHlPcCk7XG4gICAgY29uc3Qgc3VjY2Vzc0FjdGlvbiA9IHRoaXMuZW50aXR5QWN0aW9uRmFjdG9yeS5jcmVhdGVGcm9tQWN0aW9uKFxuICAgICAgb3JpZ2luYWxBY3Rpb24sXG4gICAgICB7XG4gICAgICAgIGVudGl0eU9wOiBzdWNjZXNzT3AsXG4gICAgICB9XG4gICAgKTtcbiAgICAvLyBBbHRob3VnaCByZXR1cm5zIGltbWVkaWF0ZWx5LFxuICAgIC8vIGVuc3VyZSBvYnNlcnZhYmxlIHRha2VzIG9uZSB0aWNrIChieSB1c2luZyBhIHByb21pc2UpLFxuICAgIC8vIGFzIGFwcCBsaWtlbHkgYXNzdW1lcyBhc3luY2hyb25vdXMgcmVzcG9uc2UuXG4gICAgcmV0dXJuIG9mKHN1Y2Nlc3NBY3Rpb24pLnBpcGUoXG4gICAgICBkZWxheSh0aGlzLnJlc3BvbnNlRGVsYXksIHRoaXMuc2NoZWR1bGVyIHx8IGFzeW5jU2NoZWR1bGVyKVxuICAgICk7XG4gIH1cbn1cbiJdfQ==