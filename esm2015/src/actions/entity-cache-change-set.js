/**
 * @fileoverview added by tsickle
 * Generated from: src/actions/entity-cache-change-set.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
const ChangeSetOperation = {
    Add: "Add",
    Delete: "Delete",
    Update: "Update",
    Upsert: "Upsert",
};
export { ChangeSetOperation };
/**
 * @record
 * @template T
 */
export function ChangeSetAdd() { }
if (false) {
    /** @type {?} */
    ChangeSetAdd.prototype.op;
    /** @type {?} */
    ChangeSetAdd.prototype.entityName;
    /** @type {?} */
    ChangeSetAdd.prototype.entities;
}
/**
 * @record
 */
export function ChangeSetDelete() { }
if (false) {
    /** @type {?} */
    ChangeSetDelete.prototype.op;
    /** @type {?} */
    ChangeSetDelete.prototype.entityName;
    /** @type {?} */
    ChangeSetDelete.prototype.entities;
}
/**
 * @record
 * @template T
 */
export function ChangeSetUpdate() { }
if (false) {
    /** @type {?} */
    ChangeSetUpdate.prototype.op;
    /** @type {?} */
    ChangeSetUpdate.prototype.entityName;
    /** @type {?} */
    ChangeSetUpdate.prototype.entities;
}
/**
 * @record
 * @template T
 */
export function ChangeSetUpsert() { }
if (false) {
    /** @type {?} */
    ChangeSetUpsert.prototype.op;
    /** @type {?} */
    ChangeSetUpsert.prototype.entityName;
    /** @type {?} */
    ChangeSetUpsert.prototype.entities;
}
/**
 * @record
 * @template T
 */
export function ChangeSet() { }
if (false) {
    /**
     * An array of ChangeSetItems to be processed in the array order
     * @type {?}
     */
    ChangeSet.prototype.changes;
    /**
     * An arbitrary, serializable object that should travel with the ChangeSet.
     * Meaningful to the ChangeSet producer and consumer. Ignored by \@ngrx/data.
     * @type {?|undefined}
     */
    ChangeSet.prototype.extras;
    /**
     * An arbitrary string, identifying the ChangeSet and perhaps its purpose
     * @type {?|undefined}
     */
    ChangeSet.prototype.tag;
}
/**
 * Factory to create a ChangeSetItem for a ChangeSetOperation
 */
export class ChangeSetItemFactory {
    /**
     * Create the ChangeSetAdd for new entities of the given entity type
     * @template T
     * @param {?} entityName
     * @param {?} entities
     * @return {?}
     */
    add(entityName, entities) {
        entities = Array.isArray(entities) ? entities : entities ? [entities] : [];
        return { entityName, op: ChangeSetOperation.Add, entities };
    }
    /**
     * Create the ChangeSetDelete for primary keys of the given entity type
     * @param {?} entityName
     * @param {?} keys
     * @return {?}
     */
    delete(entityName, keys) {
        /** @type {?} */
        const ids = Array.isArray(keys)
            ? keys
            : keys
                ? ((/** @type {?} */ ([keys])))
                : [];
        return { entityName, op: ChangeSetOperation.Delete, entities: ids };
    }
    /**
     * Create the ChangeSetUpdate for Updates of entities of the given entity type
     * @template T
     * @param {?} entityName
     * @param {?} updates
     * @return {?}
     */
    update(entityName, updates) {
        updates = Array.isArray(updates) ? updates : updates ? [updates] : [];
        return { entityName, op: ChangeSetOperation.Update, entities: updates };
    }
    /**
     * Create the ChangeSetUpsert for new or existing entities of the given entity type
     * @template T
     * @param {?} entityName
     * @param {?} entities
     * @return {?}
     */
    upsert(entityName, entities) {
        entities = Array.isArray(entities) ? entities : entities ? [entities] : [];
        return { entityName, op: ChangeSetOperation.Upsert, entities };
    }
}
/**
 * Instance of a factory to create a ChangeSetItem for a ChangeSetOperation
 * @type {?}
 */
export const changeSetItemFactory = new ChangeSetItemFactory();
/**
 * Return ChangeSet after filtering out null and empty ChangeSetItems.
 * @param {?} changeSet ChangeSet with changes to filter
 * @return {?}
 */
export function excludeEmptyChangeSetItems(changeSet) {
    changeSet = changeSet && changeSet.changes ? changeSet : { changes: [] };
    /** @type {?} */
    const changes = changeSet.changes.filter((/**
     * @param {?} c
     * @return {?}
     */
    c => c != null && c.entities && c.entities.length > 0));
    return Object.assign(Object.assign({}, changeSet), { changes });
}
//# sourceMappingURL=entity-cache-change-set.js.map