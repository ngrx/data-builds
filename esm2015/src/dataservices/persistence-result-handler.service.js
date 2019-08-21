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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyc2lzdGVuY2UtcmVzdWx0LWhhbmRsZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGF0YXNlcnZpY2VzL3BlcnNpc3RlbmNlLXJlc3VsdC1oYW5kbGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0MsT0FBTyxFQUNMLGdCQUFnQixHQUVqQixNQUFNLHNCQUFzQixDQUFDO0FBRTlCLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbEUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHFCQUFxQixDQUFDOzs7OztBQUs3QyxNQUFNLE9BQWdCLHdCQUF3QjtDQVU3Qzs7Ozs7Ozs7SUFSQyxpRkFBNEU7Ozs7Ozs7SUFHNUUsK0VBSWdEOzs7Ozs7QUFRbEQsTUFBTSxPQUFPLCtCQUErQjs7Ozs7SUFFMUMsWUFDVSxNQUFjLEVBQ2QsbUJBQXdDO1FBRHhDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO0lBQy9DLENBQUM7Ozs7OztJQUdKLGFBQWEsQ0FBQyxjQUE0Qjs7Y0FDbEMsU0FBUyxHQUFHLGFBQWEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUNoRTs7OztRQUFPLENBQUMsSUFBUyxFQUFFLEVBQUUsQ0FDbkIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRTtZQUN4RCxRQUFRLEVBQUUsU0FBUztZQUNuQixJQUFJO1NBQ0wsQ0FBQyxFQUFDO0lBQ1AsQ0FBQzs7Ozs7O0lBR0QsV0FBVyxDQUNULGNBQTRCOztjQUl0QixPQUFPLEdBQUcsV0FBVyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBRTVEOzs7O1FBQU8sQ0FBQyxHQUE2QixFQUFFLEVBQUU7O2tCQUNqQyxLQUFLLEdBQ1QsR0FBRyxZQUFZLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksZ0JBQWdCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQzs7a0JBQ25FLFNBQVMsR0FBaUMsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFO1lBQ3pFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztrQkFDdkIsTUFBTSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FFdEQsY0FBYyxFQUFFO2dCQUNoQixRQUFRLEVBQUUsT0FBTztnQkFDakIsSUFBSSxFQUFFLFNBQVM7YUFDaEIsQ0FBQztZQUNGLE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUMsRUFBQztJQUNKLENBQUM7OztZQXZDRixVQUFVOzs7O1lBckJGLE1BQU07WUFGTixtQkFBbUI7Ozs7Ozs7SUEyQnhCLGlEQUFzQjs7Ozs7SUFDdEIsOERBQWdEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuXG5pbXBvcnQge1xuICBEYXRhU2VydmljZUVycm9yLFxuICBFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yLFxufSBmcm9tICcuL2RhdGEtc2VydmljZS1lcnJvcic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uRmFjdG9yeSB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1mYWN0b3J5JztcbmltcG9ydCB7IG1ha2VFcnJvck9wLCBtYWtlU3VjY2Vzc09wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi4vdXRpbHMvaW50ZXJmYWNlcyc7XG5cbi8qKlxuICogSGFuZGxpbmcgb2YgcmVzcG9uc2VzIGZyb20gcGVyc2lzdGVuY2Ugb3BlcmF0aW9uXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIge1xuICAvKiogSGFuZGxlIHN1Y2Nlc3NmdWwgcmVzdWx0IG9mIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBmb3IgYW4gYWN0aW9uICovXG4gIGFic3RyYWN0IGhhbmRsZVN1Y2Nlc3Mob3JpZ2luYWxBY3Rpb246IEVudGl0eUFjdGlvbik6IChkYXRhOiBhbnkpID0+IEFjdGlvbjtcblxuICAvKiogSGFuZGxlIGVycm9yIHJlc3VsdCBvZiBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gZm9yIGFuIGFjdGlvbiAqL1xuICBhYnN0cmFjdCBoYW5kbGVFcnJvcihcbiAgICBvcmlnaW5hbEFjdGlvbjogRW50aXR5QWN0aW9uXG4gICk6IChcbiAgICBlcnJvcjogRGF0YVNlcnZpY2VFcnJvciB8IEVycm9yXG4gICkgPT4gRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+O1xufVxuXG4vKipcbiAqIERlZmF1bHQgaGFuZGxpbmcgb2YgcmVzcG9uc2VzIGZyb20gcGVyc2lzdGVuY2Ugb3BlcmF0aW9uLFxuICogc3BlY2lmaWNhbGx5IGFuIEVudGl0eURhdGFTZXJ2aWNlXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEZWZhdWx0UGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyXG4gIGltcGxlbWVudHMgUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlcixcbiAgICBwcml2YXRlIGVudGl0eUFjdGlvbkZhY3Rvcnk6IEVudGl0eUFjdGlvbkZhY3RvcnlcbiAgKSB7fVxuXG4gIC8qKiBIYW5kbGUgc3VjY2Vzc2Z1bCByZXN1bHQgb2YgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIG9uIGFuIEVudGl0eUFjdGlvbiAqL1xuICBoYW5kbGVTdWNjZXNzKG9yaWdpbmFsQWN0aW9uOiBFbnRpdHlBY3Rpb24pOiAoZGF0YTogYW55KSA9PiBBY3Rpb24ge1xuICAgIGNvbnN0IHN1Y2Nlc3NPcCA9IG1ha2VTdWNjZXNzT3Aob3JpZ2luYWxBY3Rpb24ucGF5bG9hZC5lbnRpdHlPcCk7XG4gICAgcmV0dXJuIChkYXRhOiBhbnkpID0+XG4gICAgICB0aGlzLmVudGl0eUFjdGlvbkZhY3RvcnkuY3JlYXRlRnJvbUFjdGlvbihvcmlnaW5hbEFjdGlvbiwge1xuICAgICAgICBlbnRpdHlPcDogc3VjY2Vzc09wLFxuICAgICAgICBkYXRhLFxuICAgICAgfSk7XG4gIH1cblxuICAvKiogSGFuZGxlIGVycm9yIHJlc3VsdCBvZiBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gb24gYW4gRW50aXR5QWN0aW9uICovXG4gIGhhbmRsZUVycm9yKFxuICAgIG9yaWdpbmFsQWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgKTogKFxuICAgIGVycm9yOiBEYXRhU2VydmljZUVycm9yIHwgRXJyb3JcbiAgKSA9PiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj4ge1xuICAgIGNvbnN0IGVycm9yT3AgPSBtYWtlRXJyb3JPcChvcmlnaW5hbEFjdGlvbi5wYXlsb2FkLmVudGl0eU9wKTtcblxuICAgIHJldHVybiAoZXJyOiBEYXRhU2VydmljZUVycm9yIHwgRXJyb3IpID0+IHtcbiAgICAgIGNvbnN0IGVycm9yID1cbiAgICAgICAgZXJyIGluc3RhbmNlb2YgRGF0YVNlcnZpY2VFcnJvciA/IGVyciA6IG5ldyBEYXRhU2VydmljZUVycm9yKGVyciwgbnVsbCk7XG4gICAgICBjb25zdCBlcnJvckRhdGE6IEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3IgPSB7IGVycm9yLCBvcmlnaW5hbEFjdGlvbiB9O1xuICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoZXJyb3JEYXRhKTtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuZW50aXR5QWN0aW9uRmFjdG9yeS5jcmVhdGVGcm9tQWN0aW9uPFxuICAgICAgICBFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yXG4gICAgICA+KG9yaWdpbmFsQWN0aW9uLCB7XG4gICAgICAgIGVudGl0eU9wOiBlcnJvck9wLFxuICAgICAgICBkYXRhOiBlcnJvckRhdGEsXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfTtcbiAgfVxufVxuIl19