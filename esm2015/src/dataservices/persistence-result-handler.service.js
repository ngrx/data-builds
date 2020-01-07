/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/dataservices/persistence-result-handler.service.ts
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyc2lzdGVuY2UtcmVzdWx0LWhhbmRsZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGF0YXNlcnZpY2VzL3BlcnNpc3RlbmNlLXJlc3VsdC1oYW5kbGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzNDLE9BQU8sRUFDTCxnQkFBZ0IsR0FFakIsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQzs7Ozs7QUFLN0MsTUFBTSxPQUFnQix3QkFBd0I7Q0FVN0M7Ozs7Ozs7O0lBUkMsaUZBQTRFOzs7Ozs7O0lBRzVFLCtFQUlnRDs7Ozs7O0FBUWxELE1BQU0sT0FBTywrQkFBK0I7Ozs7O0lBRTFDLFlBQ1UsTUFBYyxFQUNkLG1CQUF3QztRQUR4QyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2Qsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtJQUMvQyxDQUFDOzs7Ozs7SUFHSixhQUFhLENBQUMsY0FBNEI7O2NBQ2xDLFNBQVMsR0FBRyxhQUFhLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7UUFDaEU7Ozs7UUFBTyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQ25CLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUU7WUFDeEQsUUFBUSxFQUFFLFNBQVM7WUFDbkIsSUFBSTtTQUNMLENBQUMsRUFBQztJQUNQLENBQUM7Ozs7OztJQUdELFdBQVcsQ0FDVCxjQUE0Qjs7Y0FJdEIsT0FBTyxHQUFHLFdBQVcsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUU1RDs7OztRQUFPLENBQUMsR0FBNkIsRUFBRSxFQUFFOztrQkFDakMsS0FBSyxHQUNULEdBQUcsWUFBWSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7O2tCQUNuRSxTQUFTLEdBQWlDLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRTtZQUN6RSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQzs7a0JBQ3ZCLE1BQU0sR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBRXRELGNBQWMsRUFBRTtnQkFDaEIsUUFBUSxFQUFFLE9BQU87Z0JBQ2pCLElBQUksRUFBRSxTQUFTO2FBQ2hCLENBQUM7WUFDRixPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDLEVBQUM7SUFDSixDQUFDOzs7WUF2Q0YsVUFBVTs7OztZQXJCRixNQUFNO1lBRk4sbUJBQW1COzs7Ozs7O0lBMkJ4QixpREFBc0I7Ozs7O0lBQ3RCLDhEQUFnRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuaW1wb3J0IHtcbiAgRGF0YVNlcnZpY2VFcnJvcixcbiAgRW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcixcbn0gZnJvbSAnLi9kYXRhLXNlcnZpY2UtZXJyb3InO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkZhY3RvcnkgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZmFjdG9yeSc7XG5pbXBvcnQgeyBtYWtlRXJyb3JPcCwgbWFrZVN1Y2Nlc3NPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LW9wJztcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4uL3V0aWxzL2ludGVyZmFjZXMnO1xuXG4vKipcbiAqIEhhbmRsaW5nIG9mIHJlc3BvbnNlcyBmcm9tIHBlcnNpc3RlbmNlIG9wZXJhdGlvblxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyIHtcbiAgLyoqIEhhbmRsZSBzdWNjZXNzZnVsIHJlc3VsdCBvZiBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gZm9yIGFuIGFjdGlvbiAqL1xuICBhYnN0cmFjdCBoYW5kbGVTdWNjZXNzKG9yaWdpbmFsQWN0aW9uOiBFbnRpdHlBY3Rpb24pOiAoZGF0YTogYW55KSA9PiBBY3Rpb247XG5cbiAgLyoqIEhhbmRsZSBlcnJvciByZXN1bHQgb2YgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIGZvciBhbiBhY3Rpb24gKi9cbiAgYWJzdHJhY3QgaGFuZGxlRXJyb3IoXG4gICAgb3JpZ2luYWxBY3Rpb246IEVudGl0eUFjdGlvblxuICApOiAoXG4gICAgZXJyb3I6IERhdGFTZXJ2aWNlRXJyb3IgfCBFcnJvclxuICApID0+IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPjtcbn1cblxuLyoqXG4gKiBEZWZhdWx0IGhhbmRsaW5nIG9mIHJlc3BvbnNlcyBmcm9tIHBlcnNpc3RlbmNlIG9wZXJhdGlvbixcbiAqIHNwZWNpZmljYWxseSBhbiBFbnRpdHlEYXRhU2VydmljZVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGVmYXVsdFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlclxuICBpbXBsZW1lbnRzIFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXIsXG4gICAgcHJpdmF0ZSBlbnRpdHlBY3Rpb25GYWN0b3J5OiBFbnRpdHlBY3Rpb25GYWN0b3J5XG4gICkge31cblxuICAvKiogSGFuZGxlIHN1Y2Nlc3NmdWwgcmVzdWx0IG9mIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBvbiBhbiBFbnRpdHlBY3Rpb24gKi9cbiAgaGFuZGxlU3VjY2VzcyhvcmlnaW5hbEFjdGlvbjogRW50aXR5QWN0aW9uKTogKGRhdGE6IGFueSkgPT4gQWN0aW9uIHtcbiAgICBjb25zdCBzdWNjZXNzT3AgPSBtYWtlU3VjY2Vzc09wKG9yaWdpbmFsQWN0aW9uLnBheWxvYWQuZW50aXR5T3ApO1xuICAgIHJldHVybiAoZGF0YTogYW55KSA9PlxuICAgICAgdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5LmNyZWF0ZUZyb21BY3Rpb24ob3JpZ2luYWxBY3Rpb24sIHtcbiAgICAgICAgZW50aXR5T3A6IHN1Y2Nlc3NPcCxcbiAgICAgICAgZGF0YSxcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqIEhhbmRsZSBlcnJvciByZXN1bHQgb2YgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIG9uIGFuIEVudGl0eUFjdGlvbiAqL1xuICBoYW5kbGVFcnJvcihcbiAgICBvcmlnaW5hbEFjdGlvbjogRW50aXR5QWN0aW9uXG4gICk6IChcbiAgICBlcnJvcjogRGF0YVNlcnZpY2VFcnJvciB8IEVycm9yXG4gICkgPT4gRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+IHtcbiAgICBjb25zdCBlcnJvck9wID0gbWFrZUVycm9yT3Aob3JpZ2luYWxBY3Rpb24ucGF5bG9hZC5lbnRpdHlPcCk7XG5cbiAgICByZXR1cm4gKGVycjogRGF0YVNlcnZpY2VFcnJvciB8IEVycm9yKSA9PiB7XG4gICAgICBjb25zdCBlcnJvciA9XG4gICAgICAgIGVyciBpbnN0YW5jZW9mIERhdGFTZXJ2aWNlRXJyb3IgPyBlcnIgOiBuZXcgRGF0YVNlcnZpY2VFcnJvcihlcnIsIG51bGwpO1xuICAgICAgY29uc3QgZXJyb3JEYXRhOiBFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yID0geyBlcnJvciwgb3JpZ2luYWxBY3Rpb24gfTtcbiAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGVycm9yRGF0YSk7XG4gICAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmVudGl0eUFjdGlvbkZhY3RvcnkuY3JlYXRlRnJvbUFjdGlvbjxcbiAgICAgICAgRW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvclxuICAgICAgPihvcmlnaW5hbEFjdGlvbiwge1xuICAgICAgICBlbnRpdHlPcDogZXJyb3JPcCxcbiAgICAgICAgZGF0YTogZXJyb3JEYXRhLFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH07XG4gIH1cbn1cbiJdfQ==