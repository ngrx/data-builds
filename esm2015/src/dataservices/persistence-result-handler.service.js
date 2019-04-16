/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
    { type: Injectable }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyc2lzdGVuY2UtcmVzdWx0LWhhbmRsZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGF0YXNlcnZpY2VzL3BlcnNpc3RlbmNlLXJlc3VsdC1oYW5kbGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFLM0MsT0FBTyxFQUNMLGdCQUFnQixHQUVqQixNQUFNLHNCQUFzQixDQUFDO0FBRTlCLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBWSxXQUFXLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDNUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHFCQUFxQixDQUFDOzs7OztBQUs3QyxNQUFNLE9BQWdCLHdCQUF3QjtDQVU3Qzs7Ozs7Ozs7SUFSQyxpRkFBNEU7Ozs7Ozs7SUFHNUUsK0VBSWdEOzs7Ozs7QUFRbEQsTUFBTSxPQUFPLCtCQUErQjs7Ozs7SUFFMUMsWUFDVSxNQUFjLEVBQ2QsbUJBQXdDO1FBRHhDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO0lBQy9DLENBQUM7Ozs7OztJQUdKLGFBQWEsQ0FBQyxjQUE0Qjs7Y0FDbEMsU0FBUyxHQUFHLGFBQWEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUNoRTs7OztRQUFPLENBQUMsSUFBUyxFQUFFLEVBQUUsQ0FDbkIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRTtZQUN4RCxRQUFRLEVBQUUsU0FBUztZQUNuQixJQUFJO1NBQ0wsQ0FBQyxFQUFDO0lBQ1AsQ0FBQzs7Ozs7O0lBR0QsV0FBVyxDQUNULGNBQTRCOztjQUl0QixPQUFPLEdBQUcsV0FBVyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBRTVEOzs7O1FBQU8sQ0FBQyxHQUE2QixFQUFFLEVBQUU7O2tCQUNqQyxLQUFLLEdBQ1QsR0FBRyxZQUFZLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksZ0JBQWdCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQzs7a0JBQ25FLFNBQVMsR0FBaUMsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFO1lBQ3pFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztrQkFDdkIsTUFBTSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FFdEQsY0FBYyxFQUFFO2dCQUNoQixRQUFRLEVBQUUsT0FBTztnQkFDakIsSUFBSSxFQUFFLFNBQVM7YUFDaEIsQ0FBQztZQUNGLE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUMsRUFBQztJQUNKLENBQUM7OztZQXZDRixVQUFVOzs7O1lBckJGLE1BQU07WUFGTixtQkFBbUI7Ozs7Ozs7SUEyQnhCLGlEQUFzQjs7Ozs7SUFDdEIsOERBQWdEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQge1xuICBEYXRhU2VydmljZUVycm9yLFxuICBFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yLFxufSBmcm9tICcuL2RhdGEtc2VydmljZS1lcnJvcic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uRmFjdG9yeSB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eU9wLCBtYWtlRXJyb3JPcCwgbWFrZVN1Y2Nlc3NPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LW9wJztcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4uL3V0aWxzL2ludGVyZmFjZXMnO1xuXG4vKipcbiAqIEhhbmRsaW5nIG9mIHJlc3BvbnNlcyBmcm9tIHBlcnNpc3RlbmNlIG9wZXJhdGlvblxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyIHtcbiAgLyoqIEhhbmRsZSBzdWNjZXNzZnVsIHJlc3VsdCBvZiBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gZm9yIGFuIGFjdGlvbiAqL1xuICBhYnN0cmFjdCBoYW5kbGVTdWNjZXNzKG9yaWdpbmFsQWN0aW9uOiBFbnRpdHlBY3Rpb24pOiAoZGF0YTogYW55KSA9PiBBY3Rpb247XG5cbiAgLyoqIEhhbmRsZSBlcnJvciByZXN1bHQgb2YgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIGZvciBhbiBhY3Rpb24gKi9cbiAgYWJzdHJhY3QgaGFuZGxlRXJyb3IoXG4gICAgb3JpZ2luYWxBY3Rpb246IEVudGl0eUFjdGlvblxuICApOiAoXG4gICAgZXJyb3I6IERhdGFTZXJ2aWNlRXJyb3IgfCBFcnJvclxuICApID0+IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPjtcbn1cblxuLyoqXG4gKiBEZWZhdWx0IGhhbmRsaW5nIG9mIHJlc3BvbnNlcyBmcm9tIHBlcnNpc3RlbmNlIG9wZXJhdGlvbixcbiAqIHNwZWNpZmljYWxseSBhbiBFbnRpdHlEYXRhU2VydmljZVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGVmYXVsdFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlclxuICBpbXBsZW1lbnRzIFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXIsXG4gICAgcHJpdmF0ZSBlbnRpdHlBY3Rpb25GYWN0b3J5OiBFbnRpdHlBY3Rpb25GYWN0b3J5XG4gICkge31cblxuICAvKiogSGFuZGxlIHN1Y2Nlc3NmdWwgcmVzdWx0IG9mIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBvbiBhbiBFbnRpdHlBY3Rpb24gKi9cbiAgaGFuZGxlU3VjY2VzcyhvcmlnaW5hbEFjdGlvbjogRW50aXR5QWN0aW9uKTogKGRhdGE6IGFueSkgPT4gQWN0aW9uIHtcbiAgICBjb25zdCBzdWNjZXNzT3AgPSBtYWtlU3VjY2Vzc09wKG9yaWdpbmFsQWN0aW9uLnBheWxvYWQuZW50aXR5T3ApO1xuICAgIHJldHVybiAoZGF0YTogYW55KSA9PlxuICAgICAgdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5LmNyZWF0ZUZyb21BY3Rpb24ob3JpZ2luYWxBY3Rpb24sIHtcbiAgICAgICAgZW50aXR5T3A6IHN1Y2Nlc3NPcCxcbiAgICAgICAgZGF0YSxcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqIEhhbmRsZSBlcnJvciByZXN1bHQgb2YgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIG9uIGFuIEVudGl0eUFjdGlvbiAqL1xuICBoYW5kbGVFcnJvcihcbiAgICBvcmlnaW5hbEFjdGlvbjogRW50aXR5QWN0aW9uXG4gICk6IChcbiAgICBlcnJvcjogRGF0YVNlcnZpY2VFcnJvciB8IEVycm9yXG4gICkgPT4gRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+IHtcbiAgICBjb25zdCBlcnJvck9wID0gbWFrZUVycm9yT3Aob3JpZ2luYWxBY3Rpb24ucGF5bG9hZC5lbnRpdHlPcCk7XG5cbiAgICByZXR1cm4gKGVycjogRGF0YVNlcnZpY2VFcnJvciB8IEVycm9yKSA9PiB7XG4gICAgICBjb25zdCBlcnJvciA9XG4gICAgICAgIGVyciBpbnN0YW5jZW9mIERhdGFTZXJ2aWNlRXJyb3IgPyBlcnIgOiBuZXcgRGF0YVNlcnZpY2VFcnJvcihlcnIsIG51bGwpO1xuICAgICAgY29uc3QgZXJyb3JEYXRhOiBFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yID0geyBlcnJvciwgb3JpZ2luYWxBY3Rpb24gfTtcbiAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGVycm9yRGF0YSk7XG4gICAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmVudGl0eUFjdGlvbkZhY3RvcnkuY3JlYXRlRnJvbUFjdGlvbjxcbiAgICAgICAgRW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvclxuICAgICAgPihvcmlnaW5hbEFjdGlvbiwge1xuICAgICAgICBlbnRpdHlPcDogZXJyb3JPcCxcbiAgICAgICAgZGF0YTogZXJyb3JEYXRhLFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH07XG4gIH1cbn1cbiJdfQ==