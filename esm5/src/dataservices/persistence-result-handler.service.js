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
var /**
 * Handling of responses from persistence operation
 * @abstract
 */
PersistenceResultHandler = /** @class */ (function () {
    function PersistenceResultHandler() {
    }
    return PersistenceResultHandler;
}());
/**
 * Handling of responses from persistence operation
 * @abstract
 */
export { PersistenceResultHandler };
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
var DefaultPersistenceResultHandler = /** @class */ (function () {
    function DefaultPersistenceResultHandler(logger, entityActionFactory) {
        this.logger = logger;
        this.entityActionFactory = entityActionFactory;
    }
    /** Handle successful result of persistence operation on an EntityAction */
    /**
     * Handle successful result of persistence operation on an EntityAction
     * @param {?} originalAction
     * @return {?}
     */
    DefaultPersistenceResultHandler.prototype.handleSuccess = /**
     * Handle successful result of persistence operation on an EntityAction
     * @param {?} originalAction
     * @return {?}
     */
    function (originalAction) {
        var _this = this;
        /** @type {?} */
        var successOp = makeSuccessOp(originalAction.payload.entityOp);
        return (/**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            return _this.entityActionFactory.createFromAction(originalAction, {
                entityOp: successOp,
                data: data,
            });
        });
    };
    /** Handle error result of persistence operation on an EntityAction */
    /**
     * Handle error result of persistence operation on an EntityAction
     * @param {?} originalAction
     * @return {?}
     */
    DefaultPersistenceResultHandler.prototype.handleError = /**
     * Handle error result of persistence operation on an EntityAction
     * @param {?} originalAction
     * @return {?}
     */
    function (originalAction) {
        var _this = this;
        /** @type {?} */
        var errorOp = makeErrorOp(originalAction.payload.entityOp);
        return (/**
         * @param {?} err
         * @return {?}
         */
        function (err) {
            /** @type {?} */
            var error = err instanceof DataServiceError ? err : new DataServiceError(err, null);
            /** @type {?} */
            var errorData = { error: error, originalAction: originalAction };
            _this.logger.error(errorData);
            /** @type {?} */
            var action = _this.entityActionFactory.createFromAction(originalAction, {
                entityOp: errorOp,
                data: errorData,
            });
            return action;
        });
    };
    DefaultPersistenceResultHandler.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    DefaultPersistenceResultHandler.ctorParameters = function () { return [
        { type: Logger },
        { type: EntityActionFactory }
    ]; };
    return DefaultPersistenceResultHandler;
}());
export { DefaultPersistenceResultHandler };
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