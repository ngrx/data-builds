/**
 * @fileoverview added by tsickle
 * Generated from: src/reducers/entity-collection.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
var ChangeType = {
    /** The entity has not changed from its last known server state. */
    Unchanged: 0,
    /** The entity was added to the collection */
    Added: 1,
    /** The entity is scheduled for delete and was removed from the collection */
    Deleted: 2,
    /** The entity in the collection was updated */
    Updated: 3,
};
export { ChangeType };
ChangeType[ChangeType.Unchanged] = 'Unchanged';
ChangeType[ChangeType.Added] = 'Added';
ChangeType[ChangeType.Deleted] = 'Deleted';
ChangeType[ChangeType.Updated] = 'Updated';
/**
 * Change state for an entity with unsaved changes;
 * an entry in an EntityCollection.changeState map
 * @record
 * @template T
 */
export function ChangeState() { }
if (false) {
    /** @type {?} */
    ChangeState.prototype.changeType;
    /** @type {?|undefined} */
    ChangeState.prototype.originalValue;
}
/**
 * Data and information about a collection of entities of a single type.
 * EntityCollections are maintained in the EntityCache within the ngrx store.
 * @record
 * @template T
 */
export function EntityCollection() { }
if (false) {
    /**
     * Name of the entity type for this collection
     * @type {?}
     */
    EntityCollection.prototype.entityName;
    /**
     * A map of ChangeStates, keyed by id, for entities with unsaved changes
     * @type {?}
     */
    EntityCollection.prototype.changeState;
    /**
     * The user's current collection filter pattern
     * @type {?|undefined}
     */
    EntityCollection.prototype.filter;
    /**
     * true if collection was ever filled by QueryAll; forced false if cleared
     * @type {?}
     */
    EntityCollection.prototype.loaded;
    /**
     * true when a query or save operation is in progress
     * @type {?}
     */
    EntityCollection.prototype.loading;
}
//# sourceMappingURL=entity-collection.js.map