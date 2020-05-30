/**
 * @fileoverview added by tsickle
 * Generated from: src/dataservices/persistence-result-handler.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { DataServiceError, } from './data-service-error';
import { EntityActionFactory } from '../actions/entity-action-factory';
import { makeErrorOp, makeSuccessOp } from '../actions/entity-op';
import { Logger } from '../utils/interfaces';
/**
 * Handling of responses from persistence operation
 * @abstract
 */
export class PersistenceResultHandler {
}
if (false) {
    /**
     * Handle successful result of persistence operation for an action
     * @abstract
     * @param {?} originalAction
     * @return {?}
     */
    PersistenceResultHandler.prototype.handleSuccess = function (originalAction) { };
    /**
     * Handle error result of persistence operation for an action
     * @abstract
     * @param {?} originalAction
     * @return {?}
     */
    PersistenceResultHandler.prototype.handleError = function (originalAction) { };
}
/**
 * Default handling of responses from persistence operation,
 * specifically an EntityDataService
 */
export class DefaultPersistenceResultHandler {
    /**
     * @param {?} logger
     * @param {?} entityActionFactory
     */
    constructor(logger, entityActionFactory) {
        this.logger = logger;
        this.entityActionFactory = entityActionFactory;
    }
    /**
     * Handle successful result of persistence operation on an EntityAction
     * @param {?} originalAction
     * @return {?}
     */
    handleSuccess(originalAction) {
        /** @type {?} */
        const successOp = makeSuccessOp(originalAction.payload.entityOp);
        return (/**
         * @param {?} data
         * @return {?}
         */
        (data) => this.entityActionFactory.createFromAction(originalAction, {
            entityOp: successOp,
            data,
        }));
    }
    /**
     * Handle error result of persistence operation on an EntityAction
     * @param {?} originalAction
     * @return {?}
     */
    handleError(originalAction) {
        /** @type {?} */
        const errorOp = makeErrorOp(originalAction.payload.entityOp);
        return (/**
         * @param {?} err
         * @return {?}
         */
        (err) => {
            /** @type {?} */
            const error = err instanceof DataServiceError ? err : new DataServiceError(err, null);
            /** @type {?} */
            const errorData = { error, originalAction };
            this.logger.error(errorData);
            /** @type {?} */
            const action = this.entityActionFactory.createFromAction(originalAction, {
                entityOp: errorOp,
                data: errorData,
            });
            return action;
        });
    }
}
DefaultPersistenceResultHandler.decorators = [
    { type: Injectable },
];
/** @nocollapse */
DefaultPersistenceResultHandler.ctorParameters = () => [
    { type: Logger },
    { type: EntityActionFactory }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    DefaultPersistenceResultHandler.prototype.logger;
    /**
     * @type {?}
     * @private
     */
    DefaultPersistenceResultHandler.prototype.entityActionFactory;
}
//# sourceMappingURL=persistence-result-handler.service.js.map