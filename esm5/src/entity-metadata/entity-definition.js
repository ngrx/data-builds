var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var entityName = metadata.entityName;
    if (!entityName) {
        throw new Error('Missing required entityName');
    }
    metadata.entityName = entityName = entityName.trim();
    /** @type {?} */
    var selectId = metadata.selectId || defaultSelectId;
    /** @type {?} */
    var sortComparer = (metadata.sortComparer = metadata.sortComparer || false);
    /** @type {?} */
    var entityAdapter = createEntityAdapter({ selectId: selectId, sortComparer: sortComparer });
    /** @type {?} */
    var entityDispatcherOptions = metadata.entityDispatcherOptions || {};
    /** @type {?} */
    var initialState = entityAdapter.getInitialState(__assign({ entityName: entityName, filter: '', loaded: false, loading: false, changeState: {} }, (metadata.additionalCollectionState || {})));
    /** @type {?} */
    var noChangeTracking = metadata.noChangeTracking === true;
    return {
        entityName: entityName,
        entityAdapter: entityAdapter,
        entityDispatcherOptions: entityDispatcherOptions,
        initialState: initialState,
        metadata: metadata,
        noChangeTracking: noChangeTracking,
        selectId: selectId,
        sortComparer: sortComparer,
    };
}
//# sourceMappingURL=entity-definition.js.map