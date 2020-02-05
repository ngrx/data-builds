(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/dispatchers/entity-dispatcher-factory", ["require", "exports", "tslib", "@angular/core", "@ngrx/store", "rxjs", "rxjs/operators", "@ngrx/data/src/utils/correlation-id-generator", "@ngrx/data/src/dispatchers/entity-dispatcher-default-options", "@ngrx/data/src/utils/utilities", "@ngrx/data/src/actions/entity-action-factory", "@ngrx/data/src/selectors/entity-cache-selector", "@ngrx/data/src/dispatchers/entity-dispatcher-base"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@angular/core");
    const store_1 = require("@ngrx/store");
    const rxjs_1 = require("rxjs");
    const operators_1 = require("rxjs/operators");
    const correlation_id_generator_1 = require("@ngrx/data/src/utils/correlation-id-generator");
    const entity_dispatcher_default_options_1 = require("@ngrx/data/src/dispatchers/entity-dispatcher-default-options");
    const utilities_1 = require("@ngrx/data/src/utils/utilities");
    const entity_action_factory_1 = require("@ngrx/data/src/actions/entity-action-factory");
    const entity_cache_selector_1 = require("@ngrx/data/src/selectors/entity-cache-selector");
    const entity_dispatcher_base_1 = require("@ngrx/data/src/dispatchers/entity-dispatcher-base");
    /** Creates EntityDispatchers for entity collections */
    let EntityDispatcherFactory = class EntityDispatcherFactory {
        constructor(entityActionFactory, store, entityDispatcherDefaultOptions, scannedActions$, entityCacheSelector, correlationIdGenerator) {
            this.entityActionFactory = entityActionFactory;
            this.store = store;
            this.entityDispatcherDefaultOptions = entityDispatcherDefaultOptions;
            this.entityCacheSelector = entityCacheSelector;
            this.correlationIdGenerator = correlationIdGenerator;
            // Replay because sometimes in tests will fake data service with synchronous observable
            // which makes subscriber miss the dispatched actions.
            // Of course that's a testing mistake. But easy to forget, leading to painful debugging.
            this.reducedActions$ = scannedActions$.pipe(operators_1.shareReplay(1));
            // Start listening so late subscriber won't miss the most recent action.
            this.raSubscription = this.reducedActions$.subscribe();
        }
        /**
         * Create an `EntityDispatcher` for an entity type `T` and store.
         */
        create(
        /** Name of the entity type */
        entityName, 
        /**
         * Function that returns the primary key for an entity `T`.
         * Usually acquired from `EntityDefinition` metadata.
         */
        selectId = utilities_1.defaultSelectId, 
        /** Defaults for options that influence dispatcher behavior such as whether
         * `add()` is optimistic or pessimistic;
         */
        defaultOptions = {}) {
            // merge w/ defaultOptions with injected defaults
            const options = Object.assign(Object.assign({}, this.entityDispatcherDefaultOptions), defaultOptions);
            return new entity_dispatcher_base_1.EntityDispatcherBase(entityName, this.entityActionFactory, this.store, selectId, options, this.reducedActions$, this.entityCacheSelector, this.correlationIdGenerator);
        }
        ngOnDestroy() {
            this.raSubscription.unsubscribe();
        }
    };
    EntityDispatcherFactory = tslib_1.__decorate([
        core_1.Injectable(),
        tslib_1.__param(3, core_1.Inject(store_1.ScannedActionsSubject)),
        tslib_1.__param(4, core_1.Inject(entity_cache_selector_1.ENTITY_CACHE_SELECTOR_TOKEN)),
        tslib_1.__metadata("design:paramtypes", [entity_action_factory_1.EntityActionFactory,
            store_1.Store,
            entity_dispatcher_default_options_1.EntityDispatcherDefaultOptions,
            rxjs_1.Observable, Function, correlation_id_generator_1.CorrelationIdGenerator])
    ], EntityDispatcherFactory);
    exports.EntityDispatcherFactory = EntityDispatcherFactory;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRpc3BhdGNoZXItZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQSx3Q0FBOEQ7SUFDOUQsdUNBQW1FO0lBRW5FLCtCQUFnRDtJQUNoRCw4Q0FBNkM7SUFFN0MsNEZBQTJFO0lBQzNFLG9IQUFxRjtJQUNyRiw4REFBcUQ7SUFDckQsd0ZBQXVFO0lBRXZFLDBGQUc0QztJQUU1Qyw4RkFBZ0U7SUFFaEUsdURBQXVEO0lBRXZELElBQWEsdUJBQXVCLEdBQXBDLE1BQWEsdUJBQXVCO1FBUWxDLFlBQ1UsbUJBQXdDLEVBQ3hDLEtBQXlCLEVBQ3pCLDhCQUE4RCxFQUN2QyxlQUFtQyxFQUUxRCxtQkFBd0MsRUFDeEMsc0JBQThDO1lBTjlDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7WUFDeEMsVUFBSyxHQUFMLEtBQUssQ0FBb0I7WUFDekIsbUNBQThCLEdBQTlCLDhCQUE4QixDQUFnQztZQUc5RCx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1lBQ3hDLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7WUFFdEQsdUZBQXVGO1lBQ3ZGLHNEQUFzRDtZQUN0RCx3RkFBd0Y7WUFDeEYsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLHVCQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RCx3RUFBd0U7WUFDeEUsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3pELENBQUM7UUFFRDs7V0FFRztRQUNILE1BQU07UUFDSiw4QkFBOEI7UUFDOUIsVUFBa0I7UUFDbEI7OztXQUdHO1FBQ0gsV0FBMEIsMkJBQWU7UUFDekM7O1dBRUc7UUFDSCxpQkFBMEQsRUFBRTtZQUU1RCxpREFBaUQ7WUFDakQsTUFBTSxPQUFPLG1DQUNSLElBQUksQ0FBQyw4QkFBOEIsR0FDbkMsY0FBYyxDQUNsQixDQUFDO1lBQ0YsT0FBTyxJQUFJLDZDQUFvQixDQUM3QixVQUFVLEVBQ1YsSUFBSSxDQUFDLG1CQUFtQixFQUN4QixJQUFJLENBQUMsS0FBSyxFQUNWLFFBQVEsRUFDUixPQUFPLEVBQ1AsSUFBSSxDQUFDLGVBQWUsRUFDcEIsSUFBSSxDQUFDLG1CQUFtQixFQUN4QixJQUFJLENBQUMsc0JBQXNCLENBQzVCLENBQUM7UUFDSixDQUFDO1FBRUQsV0FBVztZQUNULElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDcEMsQ0FBQztLQUNGLENBQUE7SUE3RFksdUJBQXVCO1FBRG5DLGlCQUFVLEVBQUU7UUFhUixtQkFBQSxhQUFNLENBQUMsNkJBQXFCLENBQUMsQ0FBQTtRQUM3QixtQkFBQSxhQUFNLENBQUMsbURBQTJCLENBQUMsQ0FBQTtpREFKUCwyQ0FBbUI7WUFDakMsYUFBSztZQUNvQixrRUFBOEI7WUFDdEIsaUJBQVUsWUFHMUIsaURBQXNCO09BZjdDLHVCQUF1QixDQTZEbkM7SUE3RFksMERBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiwgU3RvcmUsIFNjYW5uZWRBY3Rpb25zU3ViamVjdCB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IElkU2VsZWN0b3IgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBzaGFyZVJlcGxheSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgQ29ycmVsYXRpb25JZEdlbmVyYXRvciB9IGZyb20gJy4uL3V0aWxzL2NvcnJlbGF0aW9uLWlkLWdlbmVyYXRvcic7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMgfSBmcm9tICcuL2VudGl0eS1kaXNwYXRjaGVyLWRlZmF1bHQtb3B0aW9ucyc7XG5pbXBvcnQgeyBkZWZhdWx0U2VsZWN0SWQgfSBmcm9tICcuLi91dGlscy91dGlsaXRpZXMnO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uRmFjdG9yeSB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eUNhY2hlIH0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNhY2hlJztcbmltcG9ydCB7XG4gIEVudGl0eUNhY2hlU2VsZWN0b3IsXG4gIEVOVElUWV9DQUNIRV9TRUxFQ1RPUl9UT0tFTixcbn0gZnJvbSAnLi4vc2VsZWN0b3JzL2VudGl0eS1jYWNoZS1zZWxlY3Rvcic7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyIH0gZnJvbSAnLi9lbnRpdHktZGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyQmFzZSB9IGZyb20gJy4vZW50aXR5LWRpc3BhdGNoZXItYmFzZSc7XG5cbi8qKiBDcmVhdGVzIEVudGl0eURpc3BhdGNoZXJzIGZvciBlbnRpdHkgY29sbGVjdGlvbnMgKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlEaXNwYXRjaGVyRmFjdG9yeSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBBY3Rpb25zIHNjYW5uZWQgYnkgdGhlIHN0b3JlIGFmdGVyIGl0IHByb2Nlc3NlZCB0aGVtIHdpdGggcmVkdWNlcnMuXG4gICAqIEEgcmVwbGF5IG9ic2VydmFibGUgb2YgdGhlIG1vc3QgcmVjZW50IGFjdGlvbiByZWR1Y2VkIGJ5IHRoZSBzdG9yZS5cbiAgICovXG4gIHJlZHVjZWRBY3Rpb25zJDogT2JzZXJ2YWJsZTxBY3Rpb24+O1xuICBwcml2YXRlIHJhU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbnRpdHlBY3Rpb25GYWN0b3J5OiBFbnRpdHlBY3Rpb25GYWN0b3J5LFxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEVudGl0eUNhY2hlPixcbiAgICBwcml2YXRlIGVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9uczogRW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zLFxuICAgIEBJbmplY3QoU2Nhbm5lZEFjdGlvbnNTdWJqZWN0KSBzY2FubmVkQWN0aW9ucyQ6IE9ic2VydmFibGU8QWN0aW9uPixcbiAgICBASW5qZWN0KEVOVElUWV9DQUNIRV9TRUxFQ1RPUl9UT0tFTilcbiAgICBwcml2YXRlIGVudGl0eUNhY2hlU2VsZWN0b3I6IEVudGl0eUNhY2hlU2VsZWN0b3IsXG4gICAgcHJpdmF0ZSBjb3JyZWxhdGlvbklkR2VuZXJhdG9yOiBDb3JyZWxhdGlvbklkR2VuZXJhdG9yXG4gICkge1xuICAgIC8vIFJlcGxheSBiZWNhdXNlIHNvbWV0aW1lcyBpbiB0ZXN0cyB3aWxsIGZha2UgZGF0YSBzZXJ2aWNlIHdpdGggc3luY2hyb25vdXMgb2JzZXJ2YWJsZVxuICAgIC8vIHdoaWNoIG1ha2VzIHN1YnNjcmliZXIgbWlzcyB0aGUgZGlzcGF0Y2hlZCBhY3Rpb25zLlxuICAgIC8vIE9mIGNvdXJzZSB0aGF0J3MgYSB0ZXN0aW5nIG1pc3Rha2UuIEJ1dCBlYXN5IHRvIGZvcmdldCwgbGVhZGluZyB0byBwYWluZnVsIGRlYnVnZ2luZy5cbiAgICB0aGlzLnJlZHVjZWRBY3Rpb25zJCA9IHNjYW5uZWRBY3Rpb25zJC5waXBlKHNoYXJlUmVwbGF5KDEpKTtcbiAgICAvLyBTdGFydCBsaXN0ZW5pbmcgc28gbGF0ZSBzdWJzY3JpYmVyIHdvbid0IG1pc3MgdGhlIG1vc3QgcmVjZW50IGFjdGlvbi5cbiAgICB0aGlzLnJhU3Vic2NyaXB0aW9uID0gdGhpcy5yZWR1Y2VkQWN0aW9ucyQuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIGBFbnRpdHlEaXNwYXRjaGVyYCBmb3IgYW4gZW50aXR5IHR5cGUgYFRgIGFuZCBzdG9yZS5cbiAgICovXG4gIGNyZWF0ZTxUPihcbiAgICAvKiogTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUgKi9cbiAgICBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBwcmltYXJ5IGtleSBmb3IgYW4gZW50aXR5IGBUYC5cbiAgICAgKiBVc3VhbGx5IGFjcXVpcmVkIGZyb20gYEVudGl0eURlZmluaXRpb25gIG1ldGFkYXRhLlxuICAgICAqL1xuICAgIHNlbGVjdElkOiBJZFNlbGVjdG9yPFQ+ID0gZGVmYXVsdFNlbGVjdElkLFxuICAgIC8qKiBEZWZhdWx0cyBmb3Igb3B0aW9ucyB0aGF0IGluZmx1ZW5jZSBkaXNwYXRjaGVyIGJlaGF2aW9yIHN1Y2ggYXMgd2hldGhlclxuICAgICAqIGBhZGQoKWAgaXMgb3B0aW1pc3RpYyBvciBwZXNzaW1pc3RpYztcbiAgICAgKi9cbiAgICBkZWZhdWx0T3B0aW9uczogUGFydGlhbDxFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnM+ID0ge31cbiAgKTogRW50aXR5RGlzcGF0Y2hlcjxUPiB7XG4gICAgLy8gbWVyZ2Ugdy8gZGVmYXVsdE9wdGlvbnMgd2l0aCBpbmplY3RlZCBkZWZhdWx0c1xuICAgIGNvbnN0IG9wdGlvbnM6IEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIC4uLnRoaXMuZW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zLFxuICAgICAgLi4uZGVmYXVsdE9wdGlvbnMsXG4gICAgfTtcbiAgICByZXR1cm4gbmV3IEVudGl0eURpc3BhdGNoZXJCYXNlPFQ+KFxuICAgICAgZW50aXR5TmFtZSxcbiAgICAgIHRoaXMuZW50aXR5QWN0aW9uRmFjdG9yeSxcbiAgICAgIHRoaXMuc3RvcmUsXG4gICAgICBzZWxlY3RJZCxcbiAgICAgIG9wdGlvbnMsXG4gICAgICB0aGlzLnJlZHVjZWRBY3Rpb25zJCxcbiAgICAgIHRoaXMuZW50aXR5Q2FjaGVTZWxlY3RvcixcbiAgICAgIHRoaXMuY29ycmVsYXRpb25JZEdlbmVyYXRvclxuICAgICk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnJhU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cbiJdfQ==