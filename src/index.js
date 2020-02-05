(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/index", ["require", "exports", "tslib", "@ngrx/data/src/actions/entity-action-factory", "@ngrx/data/src/actions/entity-action-guard", "@ngrx/data/src/actions/entity-action-operators", "@ngrx/data/src/actions/entity-cache-action", "@ngrx/data/src/actions/entity-cache-change-set", "@ngrx/data/src/actions/entity-op", "@ngrx/data/src/actions/merge-strategy", "@ngrx/data/src/dataservices/data-service-error", "@ngrx/data/src/dataservices/default-data-service-config", "@ngrx/data/src/dataservices/default-data.service", "@ngrx/data/src/dataservices/entity-cache-data.service", "@ngrx/data/src/dataservices/entity-data.service", "@ngrx/data/src/dataservices/http-url-generator", "@ngrx/data/src/dataservices/persistence-result-handler.service", "@ngrx/data/src/dispatchers/entity-cache-dispatcher", "@ngrx/data/src/dispatchers/entity-dispatcher-base", "@ngrx/data/src/dispatchers/entity-dispatcher-default-options", "@ngrx/data/src/dispatchers/entity-dispatcher-factory", "@ngrx/data/src/dispatchers/entity-dispatcher", "@ngrx/data/src/effects/entity-cache-effects", "@ngrx/data/src/effects/entity-effects", "@ngrx/data/src/entity-metadata/entity-definition.service", "@ngrx/data/src/entity-metadata/entity-definition", "@ngrx/data/src/entity-metadata/entity-filters", "@ngrx/data/src/entity-metadata/entity-metadata", "@ngrx/data/src/entity-services/entity-collection-service-base", "@ngrx/data/src/entity-services/entity-collection-service-elements-factory", "@ngrx/data/src/entity-services/entity-collection-service-factory", "@ngrx/data/src/entity-services/entity-services-base", "@ngrx/data/src/entity-services/entity-services-elements", "@ngrx/data/src/entity-services/entity-services", "@ngrx/data/src/reducers/constants", "@ngrx/data/src/reducers/entity-cache-reducer", "@ngrx/data/src/reducers/entity-change-tracker-base", "@ngrx/data/src/reducers/entity-collection-creator", "@ngrx/data/src/reducers/entity-collection-reducer-methods", "@ngrx/data/src/reducers/entity-collection-reducer-registry", "@ngrx/data/src/reducers/entity-collection-reducer", "@ngrx/data/src/reducers/entity-collection", "@ngrx/data/src/selectors/entity-cache-selector", "@ngrx/data/src/selectors/entity-selectors", "@ngrx/data/src/selectors/entity-selectors$", "@ngrx/data/src/utils/correlation-id-generator", "@ngrx/data/src/utils/default-logger", "@ngrx/data/src/utils/default-pluralizer", "@ngrx/data/src/utils/guid-fns", "@ngrx/data/src/utils/interfaces", "@ngrx/data/src/utils/utilities", "@ngrx/data/src/entity-data.module", "@ngrx/data/src/entity-data-without-effects.module"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    // AOT v5 bug:
    // NO BARRELS or else `ng build --aot` of any app using @ngrx/data produces strange errors
    // actions
    tslib_1.__exportStar(require("@ngrx/data/src/actions/entity-action-factory"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/actions/entity-action-guard"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/actions/entity-action-operators"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/actions/entity-cache-action"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/actions/entity-cache-change-set"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/actions/entity-op"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/actions/merge-strategy"), exports);
    // dataservices
    tslib_1.__exportStar(require("@ngrx/data/src/dataservices/data-service-error"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/dataservices/default-data-service-config"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/dataservices/default-data.service"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/dataservices/entity-cache-data.service"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/dataservices/entity-data.service"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/dataservices/http-url-generator"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/dataservices/persistence-result-handler.service"), exports);
    // dispatchers
    tslib_1.__exportStar(require("@ngrx/data/src/dispatchers/entity-cache-dispatcher"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/dispatchers/entity-dispatcher-base"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/dispatchers/entity-dispatcher-default-options"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/dispatchers/entity-dispatcher-factory"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/dispatchers/entity-dispatcher"), exports);
    // effects
    tslib_1.__exportStar(require("@ngrx/data/src/effects/entity-cache-effects"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/effects/entity-effects"), exports);
    // entity-metadata
    tslib_1.__exportStar(require("@ngrx/data/src/entity-metadata/entity-definition.service"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/entity-metadata/entity-definition"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/entity-metadata/entity-filters"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/entity-metadata/entity-metadata"), exports);
    // entity-services
    tslib_1.__exportStar(require("@ngrx/data/src/entity-services/entity-collection-service-base"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/entity-services/entity-collection-service-elements-factory"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/entity-services/entity-collection-service-factory"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/entity-services/entity-services-base"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/entity-services/entity-services-elements"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/entity-services/entity-services"), exports);
    // reducers
    tslib_1.__exportStar(require("@ngrx/data/src/reducers/constants"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/reducers/entity-cache-reducer"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/reducers/entity-change-tracker-base"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/reducers/entity-collection-creator"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/reducers/entity-collection-reducer-methods"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/reducers/entity-collection-reducer-registry"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/reducers/entity-collection-reducer"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/reducers/entity-collection"), exports);
    // selectors
    tslib_1.__exportStar(require("@ngrx/data/src/selectors/entity-cache-selector"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/selectors/entity-selectors"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/selectors/entity-selectors$"), exports);
    // Utils
    tslib_1.__exportStar(require("@ngrx/data/src/utils/correlation-id-generator"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/utils/default-logger"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/utils/default-pluralizer"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/utils/guid-fns"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/utils/interfaces"), exports);
    tslib_1.__exportStar(require("@ngrx/data/src/utils/utilities"), exports);
    // EntityDataModule
    var entity_data_module_1 = require("@ngrx/data/src/entity-data.module");
    exports.EntityDataModule = entity_data_module_1.EntityDataModule;
    var entity_data_without_effects_module_1 = require("@ngrx/data/src/entity-data-without-effects.module");
    exports.EntityDataModuleWithoutEffects = entity_data_without_effects_module_1.EntityDataModuleWithoutEffects;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUFBLGNBQWM7SUFDZCwwRkFBMEY7SUFDMUYsVUFBVTtJQUNWLHVGQUFnRDtJQUNoRCxxRkFBOEM7SUFDOUMseUZBQWtEO0lBRWxELHFGQUE4QztJQUM5Qyx5RkFBa0Q7SUFDbEQsMkVBQW9DO0lBQ3BDLGdGQUF5QztJQUd6QyxlQUFlO0lBQ2YseUZBQWtEO0lBQ2xELGtHQUEyRDtJQUMzRCwyRkFBb0Q7SUFDcEQsZ0dBQXlEO0lBQ3pELDBGQUFtRDtJQUNuRCx5RkFBa0Q7SUFFbEQseUdBQWtFO0lBRWxFLGNBQWM7SUFDZCw2RkFBc0Q7SUFFdEQsNEZBQXFEO0lBQ3JELHVHQUFnRTtJQUNoRSwrRkFBd0Q7SUFDeEQsdUZBQWdEO0lBRWhELFVBQVU7SUFDVixzRkFBK0M7SUFDL0MsZ0ZBQXlDO0lBRXpDLGtCQUFrQjtJQUNsQixtR0FBNEQ7SUFDNUQsMkZBQW9EO0lBQ3BELHdGQUFpRDtJQUNqRCx5RkFBa0Q7SUFFbEQsa0JBQWtCO0lBQ2xCLHdHQUFpRTtJQUNqRSxvSEFBNkU7SUFDN0UsMkdBQW9FO0lBRXBFLDhGQUF1RDtJQUN2RCxrR0FBMkQ7SUFDM0QseUZBQWtEO0lBRWxELFdBQVc7SUFDWCw0RUFBcUM7SUFDckMsdUZBQWdEO0lBRWhELDZGQUFzRDtJQUV0RCw0RkFBcUQ7SUFDckQsb0dBQTZEO0lBQzdELHFHQUE4RDtJQUM5RCw0RkFBcUQ7SUFDckQsb0ZBQTZDO0lBRTdDLFlBQVk7SUFDWix5RkFBa0Q7SUFDbEQsb0ZBQTZDO0lBQzdDLHFGQUE4QztJQUU5QyxRQUFRO0lBQ1Isd0ZBQWlEO0lBQ2pELDhFQUF1QztJQUN2QyxrRkFBMkM7SUFDM0Msd0VBQWlDO0lBQ2pDLDBFQUFtQztJQUNuQyx5RUFBa0M7SUFFbEMsbUJBQW1CO0lBQ25CLHdFQUF3RDtJQUEvQyxnREFBQSxnQkFBZ0IsQ0FBQTtJQUN6Qix3R0FHOEM7SUFGNUMsOEVBQUEsOEJBQThCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBBT1QgdjUgYnVnOlxuLy8gTk8gQkFSUkVMUyBvciBlbHNlIGBuZyBidWlsZCAtLWFvdGAgb2YgYW55IGFwcCB1c2luZyBAbmdyeC9kYXRhIHByb2R1Y2VzIHN0cmFuZ2UgZXJyb3JzXG4vLyBhY3Rpb25zXG5leHBvcnQgKiBmcm9tICcuL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1mYWN0b3J5JztcbmV4cG9ydCAqIGZyb20gJy4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWd1YXJkJztcbmV4cG9ydCAqIGZyb20gJy4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLW9wZXJhdG9ycyc7XG5leHBvcnQgKiBmcm9tICcuL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5leHBvcnQgKiBmcm9tICcuL2FjdGlvbnMvZW50aXR5LWNhY2hlLWFjdGlvbic7XG5leHBvcnQgKiBmcm9tICcuL2FjdGlvbnMvZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQnO1xuZXhwb3J0ICogZnJvbSAnLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5leHBvcnQgKiBmcm9tICcuL2FjdGlvbnMvbWVyZ2Utc3RyYXRlZ3knO1xuZXhwb3J0ICogZnJvbSAnLi9hY3Rpb25zL3VwZGF0ZS1yZXNwb25zZS1kYXRhJztcblxuLy8gZGF0YXNlcnZpY2VzXG5leHBvcnQgKiBmcm9tICcuL2RhdGFzZXJ2aWNlcy9kYXRhLXNlcnZpY2UtZXJyb3InO1xuZXhwb3J0ICogZnJvbSAnLi9kYXRhc2VydmljZXMvZGVmYXVsdC1kYXRhLXNlcnZpY2UtY29uZmlnJztcbmV4cG9ydCAqIGZyb20gJy4vZGF0YXNlcnZpY2VzL2RlZmF1bHQtZGF0YS5zZXJ2aWNlJztcbmV4cG9ydCAqIGZyb20gJy4vZGF0YXNlcnZpY2VzL2VudGl0eS1jYWNoZS1kYXRhLnNlcnZpY2UnO1xuZXhwb3J0ICogZnJvbSAnLi9kYXRhc2VydmljZXMvZW50aXR5LWRhdGEuc2VydmljZSc7XG5leHBvcnQgKiBmcm9tICcuL2RhdGFzZXJ2aWNlcy9odHRwLXVybC1nZW5lcmF0b3InO1xuZXhwb3J0ICogZnJvbSAnLi9kYXRhc2VydmljZXMvaW50ZXJmYWNlcyc7XG5leHBvcnQgKiBmcm9tICcuL2RhdGFzZXJ2aWNlcy9wZXJzaXN0ZW5jZS1yZXN1bHQtaGFuZGxlci5zZXJ2aWNlJztcblxuLy8gZGlzcGF0Y2hlcnNcbmV4cG9ydCAqIGZyb20gJy4vZGlzcGF0Y2hlcnMvZW50aXR5LWNhY2hlLWRpc3BhdGNoZXInO1xuZXhwb3J0ICogZnJvbSAnLi9kaXNwYXRjaGVycy9lbnRpdHktY29tbWFuZHMnO1xuZXhwb3J0ICogZnJvbSAnLi9kaXNwYXRjaGVycy9lbnRpdHktZGlzcGF0Y2hlci1iYXNlJztcbmV4cG9ydCAqIGZyb20gJy4vZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItZGVmYXVsdC1vcHRpb25zJztcbmV4cG9ydCAqIGZyb20gJy4vZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItZmFjdG9yeSc7XG5leHBvcnQgKiBmcm9tICcuL2Rpc3BhdGNoZXJzL2VudGl0eS1kaXNwYXRjaGVyJztcblxuLy8gZWZmZWN0c1xuZXhwb3J0ICogZnJvbSAnLi9lZmZlY3RzL2VudGl0eS1jYWNoZS1lZmZlY3RzJztcbmV4cG9ydCAqIGZyb20gJy4vZWZmZWN0cy9lbnRpdHktZWZmZWN0cyc7XG5cbi8vIGVudGl0eS1tZXRhZGF0YVxuZXhwb3J0ICogZnJvbSAnLi9lbnRpdHktbWV0YWRhdGEvZW50aXR5LWRlZmluaXRpb24uc2VydmljZSc7XG5leHBvcnQgKiBmcm9tICcuL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktZGVmaW5pdGlvbic7XG5leHBvcnQgKiBmcm9tICcuL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktZmlsdGVycyc7XG5leHBvcnQgKiBmcm9tICcuL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktbWV0YWRhdGEnO1xuXG4vLyBlbnRpdHktc2VydmljZXNcbmV4cG9ydCAqIGZyb20gJy4vZW50aXR5LXNlcnZpY2VzL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UtYmFzZSc7XG5leHBvcnQgKiBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcy9lbnRpdHktY29sbGVjdGlvbi1zZXJ2aWNlLWVsZW1lbnRzLWZhY3RvcnknO1xuZXhwb3J0ICogZnJvbSAnLi9lbnRpdHktc2VydmljZXMvZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1mYWN0b3J5JztcbmV4cG9ydCAqIGZyb20gJy4vZW50aXR5LXNlcnZpY2VzL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UnO1xuZXhwb3J0ICogZnJvbSAnLi9lbnRpdHktc2VydmljZXMvZW50aXR5LXNlcnZpY2VzLWJhc2UnO1xuZXhwb3J0ICogZnJvbSAnLi9lbnRpdHktc2VydmljZXMvZW50aXR5LXNlcnZpY2VzLWVsZW1lbnRzJztcbmV4cG9ydCAqIGZyb20gJy4vZW50aXR5LXNlcnZpY2VzL2VudGl0eS1zZXJ2aWNlcyc7XG5cbi8vIHJlZHVjZXJzXG5leHBvcnQgKiBmcm9tICcuL3JlZHVjZXJzL2NvbnN0YW50cyc7XG5leHBvcnQgKiBmcm9tICcuL3JlZHVjZXJzL2VudGl0eS1jYWNoZS1yZWR1Y2VyJztcbmV4cG9ydCAqIGZyb20gJy4vcmVkdWNlcnMvZW50aXR5LWNhY2hlJztcbmV4cG9ydCAqIGZyb20gJy4vcmVkdWNlcnMvZW50aXR5LWNoYW5nZS10cmFja2VyLWJhc2UnO1xuZXhwb3J0ICogZnJvbSAnLi9yZWR1Y2Vycy9lbnRpdHktY2hhbmdlLXRyYWNrZXInO1xuZXhwb3J0ICogZnJvbSAnLi9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbi1jcmVhdG9yJztcbmV4cG9ydCAqIGZyb20gJy4vcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1tZXRob2RzJztcbmV4cG9ydCAqIGZyb20gJy4vcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1yZWdpc3RyeSc7XG5leHBvcnQgKiBmcm9tICcuL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uLXJlZHVjZXInO1xuZXhwb3J0ICogZnJvbSAnLi9yZWR1Y2Vycy9lbnRpdHktY29sbGVjdGlvbic7XG5cbi8vIHNlbGVjdG9yc1xuZXhwb3J0ICogZnJvbSAnLi9zZWxlY3RvcnMvZW50aXR5LWNhY2hlLXNlbGVjdG9yJztcbmV4cG9ydCAqIGZyb20gJy4vc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMnO1xuZXhwb3J0ICogZnJvbSAnLi9zZWxlY3RvcnMvZW50aXR5LXNlbGVjdG9ycyQnO1xuXG4vLyBVdGlsc1xuZXhwb3J0ICogZnJvbSAnLi91dGlscy9jb3JyZWxhdGlvbi1pZC1nZW5lcmF0b3InO1xuZXhwb3J0ICogZnJvbSAnLi91dGlscy9kZWZhdWx0LWxvZ2dlcic7XG5leHBvcnQgKiBmcm9tICcuL3V0aWxzL2RlZmF1bHQtcGx1cmFsaXplcic7XG5leHBvcnQgKiBmcm9tICcuL3V0aWxzL2d1aWQtZm5zJztcbmV4cG9ydCAqIGZyb20gJy4vdXRpbHMvaW50ZXJmYWNlcyc7XG5leHBvcnQgKiBmcm9tICcuL3V0aWxzL3V0aWxpdGllcyc7XG5cbi8vIEVudGl0eURhdGFNb2R1bGVcbmV4cG9ydCB7IEVudGl0eURhdGFNb2R1bGUgfSBmcm9tICcuL2VudGl0eS1kYXRhLm1vZHVsZSc7XG5leHBvcnQge1xuICBFbnRpdHlEYXRhTW9kdWxlV2l0aG91dEVmZmVjdHMsXG4gIEVudGl0eURhdGFNb2R1bGVDb25maWcsXG59IGZyb20gJy4vZW50aXR5LWRhdGEtd2l0aG91dC1lZmZlY3RzLm1vZHVsZSc7XG4iXX0=