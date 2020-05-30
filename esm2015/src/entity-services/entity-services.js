/**
 * @fileoverview added by tsickle
 * Generated from: src/entity-services/entity-services.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// tslint:disable:member-ordering
/**
 * Class-Interface for EntityCache and EntityCollection services.
 * Serves as an Angular provider token for this service class.
 * Includes a registry of EntityCollectionServices for all entity types.
 * Creates a new default EntityCollectionService for any entity type not in the registry.
 * Optionally register specialized EntityCollectionServices for individual types
 * @abstract
 */
export class EntityServices {
}
if (false) {
    /**
     * Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types
     * @type {?}
     */
    EntityServices.prototype.entityActionErrors$;
    /**
     * Observable of the entire entity cache
     * @type {?}
     */
    EntityServices.prototype.entityCache$;
    /**
     * Actions scanned by the store after it processed them with reducers.
     * A replay observable of the most recent Action (not just EntityAction) reduced by the store.
     * @type {?}
     */
    EntityServices.prototype.reducedActions$;
    /**
     * Dispatch any action to the store
     * @abstract
     * @param {?} action
     * @return {?}
     */
    EntityServices.prototype.dispatch = function (action) { };
    /**
     * Get (or create) the singleton instance of an EntityCollectionService
     * @abstract
     * @template T
     * @param {?} entityName {string} Name of the entity type of the service
     * @return {?}
     */
    EntityServices.prototype.getEntityCollectionService = function (entityName) { };
    /**
     * Register an EntityCollectionService under its entity type name.
     * Will replace a pre-existing service for that type.
     * @abstract
     * @template T
     * @param {?} service {EntityCollectionService} The entity service
     * @return {?}
     */
    EntityServices.prototype.registerEntityCollectionService = function (service) { };
    /**
     * Register entity services for several entity types at once.
     * Will replace a pre-existing service for that type.
     * @abstract
     * @param {?} entityCollectionServices Array of EntityCollectionServices to register
     * @return {?}
     */
    EntityServices.prototype.registerEntityCollectionServices = function (entityCollectionServices) { };
    /**
     * Register entity services for several entity types at once.
     * Will replace a pre-existing service for that type.
     * @abstract
     * @param {?} entityCollectionServiceMap Map of service-name to entity-collection-service
     * @return {?}
     */
    EntityServices.prototype.registerEntityCollectionServices = function (entityCollectionServiceMap) { };
}
/**
 * A map of service or entity names to their corresponding EntityCollectionServices.
 * @record
 */
export function EntityCollectionServiceMap() { }
//# sourceMappingURL=entity-services.js.map