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
        { type: Injectable }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyc2lzdGVuY2UtcmVzdWx0LWhhbmRsZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3J4L2RhdGEvIiwic291cmNlcyI6WyJzcmMvZGF0YXNlcnZpY2VzL3BlcnNpc3RlbmNlLXJlc3VsdC1oYW5kbGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzNDLE9BQU8sRUFDTCxnQkFBZ0IsR0FFakIsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQzs7Ozs7QUFLN0M7Ozs7O0lBQUE7SUFVQSxDQUFDO0lBQUQsK0JBQUM7QUFBRCxDQUFDLEFBVkQsSUFVQzs7Ozs7Ozs7Ozs7OztJQVJDLGlGQUE0RTs7Ozs7OztJQUc1RSwrRUFJZ0Q7Ozs7OztBQU9sRDtJQUdFLHlDQUNVLE1BQWMsRUFDZCxtQkFBd0M7UUFEeEMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7SUFDL0MsQ0FBQztJQUVKLDJFQUEyRTs7Ozs7O0lBQzNFLHVEQUFhOzs7OztJQUFiLFVBQWMsY0FBNEI7UUFBMUMsaUJBT0M7O1lBTk8sU0FBUyxHQUFHLGFBQWEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUNoRTs7OztRQUFPLFVBQUMsSUFBUztZQUNmLE9BQUEsS0FBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRTtnQkFDeEQsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLElBQUksTUFBQTthQUNMLENBQUM7UUFIRixDQUdFLEVBQUM7SUFDUCxDQUFDO0lBRUQsc0VBQXNFOzs7Ozs7SUFDdEUscURBQVc7Ozs7O0lBQVgsVUFDRSxjQUE0QjtRQUQ5QixpQkFvQkM7O1lBZk8sT0FBTyxHQUFHLFdBQVcsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUU1RDs7OztRQUFPLFVBQUMsR0FBNkI7O2dCQUM3QixLQUFLLEdBQ1QsR0FBRyxZQUFZLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksZ0JBQWdCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQzs7Z0JBQ25FLFNBQVMsR0FBaUMsRUFBRSxLQUFLLE9BQUEsRUFBRSxjQUFjLGdCQUFBLEVBQUU7WUFDekUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7O2dCQUN2QixNQUFNLEdBQUcsS0FBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUV0RCxjQUFjLEVBQUU7Z0JBQ2hCLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixJQUFJLEVBQUUsU0FBUzthQUNoQixDQUFDO1lBQ0YsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQyxFQUFDO0lBQ0osQ0FBQzs7Z0JBdkNGLFVBQVU7Ozs7Z0JBckJGLE1BQU07Z0JBRk4sbUJBQW1COztJQStENUIsc0NBQUM7Q0FBQSxBQXhDRCxJQXdDQztTQXZDWSwrQkFBK0I7Ozs7OztJQUd4QyxpREFBc0I7Ozs7O0lBQ3RCLDhEQUFnRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuaW1wb3J0IHtcbiAgRGF0YVNlcnZpY2VFcnJvcixcbiAgRW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcixcbn0gZnJvbSAnLi9kYXRhLXNlcnZpY2UtZXJyb3InO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkZhY3RvcnkgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZmFjdG9yeSc7XG5pbXBvcnQgeyBtYWtlRXJyb3JPcCwgbWFrZVN1Y2Nlc3NPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LW9wJztcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4uL3V0aWxzL2ludGVyZmFjZXMnO1xuXG4vKipcbiAqIEhhbmRsaW5nIG9mIHJlc3BvbnNlcyBmcm9tIHBlcnNpc3RlbmNlIG9wZXJhdGlvblxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyIHtcbiAgLyoqIEhhbmRsZSBzdWNjZXNzZnVsIHJlc3VsdCBvZiBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gZm9yIGFuIGFjdGlvbiAqL1xuICBhYnN0cmFjdCBoYW5kbGVTdWNjZXNzKG9yaWdpbmFsQWN0aW9uOiBFbnRpdHlBY3Rpb24pOiAoZGF0YTogYW55KSA9PiBBY3Rpb247XG5cbiAgLyoqIEhhbmRsZSBlcnJvciByZXN1bHQgb2YgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIGZvciBhbiBhY3Rpb24gKi9cbiAgYWJzdHJhY3QgaGFuZGxlRXJyb3IoXG4gICAgb3JpZ2luYWxBY3Rpb246IEVudGl0eUFjdGlvblxuICApOiAoXG4gICAgZXJyb3I6IERhdGFTZXJ2aWNlRXJyb3IgfCBFcnJvclxuICApID0+IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPjtcbn1cblxuLyoqXG4gKiBEZWZhdWx0IGhhbmRsaW5nIG9mIHJlc3BvbnNlcyBmcm9tIHBlcnNpc3RlbmNlIG9wZXJhdGlvbixcbiAqIHNwZWNpZmljYWxseSBhbiBFbnRpdHlEYXRhU2VydmljZVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGVmYXVsdFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlclxuICBpbXBsZW1lbnRzIFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXIsXG4gICAgcHJpdmF0ZSBlbnRpdHlBY3Rpb25GYWN0b3J5OiBFbnRpdHlBY3Rpb25GYWN0b3J5XG4gICkge31cblxuICAvKiogSGFuZGxlIHN1Y2Nlc3NmdWwgcmVzdWx0IG9mIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBvbiBhbiBFbnRpdHlBY3Rpb24gKi9cbiAgaGFuZGxlU3VjY2VzcyhvcmlnaW5hbEFjdGlvbjogRW50aXR5QWN0aW9uKTogKGRhdGE6IGFueSkgPT4gQWN0aW9uIHtcbiAgICBjb25zdCBzdWNjZXNzT3AgPSBtYWtlU3VjY2Vzc09wKG9yaWdpbmFsQWN0aW9uLnBheWxvYWQuZW50aXR5T3ApO1xuICAgIHJldHVybiAoZGF0YTogYW55KSA9PlxuICAgICAgdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5LmNyZWF0ZUZyb21BY3Rpb24ob3JpZ2luYWxBY3Rpb24sIHtcbiAgICAgICAgZW50aXR5T3A6IHN1Y2Nlc3NPcCxcbiAgICAgICAgZGF0YSxcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqIEhhbmRsZSBlcnJvciByZXN1bHQgb2YgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIG9uIGFuIEVudGl0eUFjdGlvbiAqL1xuICBoYW5kbGVFcnJvcihcbiAgICBvcmlnaW5hbEFjdGlvbjogRW50aXR5QWN0aW9uXG4gICk6IChcbiAgICBlcnJvcjogRGF0YVNlcnZpY2VFcnJvciB8IEVycm9yXG4gICkgPT4gRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+IHtcbiAgICBjb25zdCBlcnJvck9wID0gbWFrZUVycm9yT3Aob3JpZ2luYWxBY3Rpb24ucGF5bG9hZC5lbnRpdHlPcCk7XG5cbiAgICByZXR1cm4gKGVycjogRGF0YVNlcnZpY2VFcnJvciB8IEVycm9yKSA9PiB7XG4gICAgICBjb25zdCBlcnJvciA9XG4gICAgICAgIGVyciBpbnN0YW5jZW9mIERhdGFTZXJ2aWNlRXJyb3IgPyBlcnIgOiBuZXcgRGF0YVNlcnZpY2VFcnJvcihlcnIsIG51bGwpO1xuICAgICAgY29uc3QgZXJyb3JEYXRhOiBFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yID0geyBlcnJvciwgb3JpZ2luYWxBY3Rpb24gfTtcbiAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGVycm9yRGF0YSk7XG4gICAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmVudGl0eUFjdGlvbkZhY3RvcnkuY3JlYXRlRnJvbUFjdGlvbjxcbiAgICAgICAgRW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvclxuICAgICAgPihvcmlnaW5hbEFjdGlvbiwge1xuICAgICAgICBlbnRpdHlPcDogZXJyb3JPcCxcbiAgICAgICAgZGF0YTogZXJyb3JEYXRhLFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH07XG4gIH1cbn1cbiJdfQ==