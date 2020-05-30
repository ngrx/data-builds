/**
 * @fileoverview added by tsickle
 * Generated from: src/entity-metadata/entity-definition.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { createEntityAdapter } from '@ngrx/entity';
import { defaultSelectId } from '../utils/utilities';
/**
 * @record
 * @template T
 */
export function EntityDefinition() { }
if (false) {
    /** @type {?} */
    EntityDefinition.prototype.entityName;
    /** @type {?} */
    EntityDefinition.prototype.entityAdapter;
    /** @type {?|undefined} */
    EntityDefinition.prototype.entityDispatcherOptions;
    /** @type {?} */
    EntityDefinition.prototype.initialState;
    /** @type {?} */
    EntityDefinition.prototype.metadata;
    /** @type {?} */
    EntityDefinition.prototype.noChangeTracking;
    /** @type {?} */
    EntityDefinition.prototype.selectId;
    /** @type {?} */
    EntityDefinition.prototype.sortComparer;
}
/**
 * @template T, S
 * @param {?} metadata
 * @return {?}
 */
export function createEntityDefinition(metadata) {
    /** @type {?} */
    let entityName = metadata.entityName;
    if (!entityName) {
        throw new Error('Missing required entityName');
    }
    metadata.entityName = entityName = entityName.trim();
    /** @type {?} */
    const selectId = metadata.selectId || defaultSelectId;
    /** @type {?} */
    const sortComparer = (metadata.sortComparer = metadata.sortComparer || false);
    /** @type {?} */
    const entityAdapter = createEntityAdapter({ selectId, sortComparer });
    /** @type {?} */
    const entityDispatcherOptions = metadata.entityDispatcherOptions || {};
    /** @type {?} */
    const initialState = entityAdapter.getInitialState(Object.assign({ entityName, filter: '', loaded: false, loading: false, changeState: {} }, (metadata.additionalCollectionState || {})));
    /** @type {?} */
    const noChangeTracking = metadata.noChangeTracking === true;
    return {
        entityName,
        entityAdapter,
        entityDispatcherOptions,
        initialState,
        metadata,
        noChangeTracking,
        selectId,
        sortComparer,
    };
}
//# sourceMappingURL=entity-definition.js.map