import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { DataServiceError, } from './data-service-error';
import { EntityActionFactory } from '../actions/entity-action-factory';
import { makeErrorOp, makeSuccessOp } from '../actions/entity-op';
import { Logger } from '../utils/interfaces';
/**
 * Handling of responses from persistence operation
 */
var PersistenceResultHandler = /** @class */ (function () {
    function PersistenceResultHandler() {
    }
    return PersistenceResultHandler;
}());
export { PersistenceResultHandler };
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
    DefaultPersistenceResultHandler.prototype.handleSuccess = function (originalAction) {
        var _this = this;
        var successOp = makeSuccessOp(originalAction.payload.entityOp);
        return function (data) {
            return _this.entityActionFactory.createFromAction(originalAction, {
                entityOp: successOp,
                data: data,
            });
        };
    };
    /** Handle error result of persistence operation on an EntityAction */
    DefaultPersistenceResultHandler.prototype.handleError = function (originalAction) {
        var _this = this;
        var errorOp = makeErrorOp(originalAction.payload.entityOp);
        return function (err) {
            var error = err instanceof DataServiceError ? err : new DataServiceError(err, null);
            var errorData = { error: error, originalAction: originalAction };
            _this.logger.error(errorData);
            var action = _this.entityActionFactory.createFromAction(originalAction, {
                entityOp: errorOp,
                data: errorData,
            });
            return action;
        };
    };
    DefaultPersistenceResultHandler = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Logger,
            EntityActionFactory])
    ], DefaultPersistenceResultHandler);
    return DefaultPersistenceResultHandler;
}());
export { DefaultPersistenceResultHandler };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyc2lzdGVuY2UtcmVzdWx0LWhhbmRsZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGF0YXNlcnZpY2VzL3BlcnNpc3RlbmNlLXJlc3VsdC1oYW5kbGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFLM0MsT0FBTyxFQUNMLGdCQUFnQixHQUVqQixNQUFNLHNCQUFzQixDQUFDO0FBRTlCLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBWSxXQUFXLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDNUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRTdDOztHQUVHO0FBQ0g7SUFBQTtJQVVBLENBQUM7SUFBRCwrQkFBQztBQUFELENBQUMsQUFWRCxJQVVDOztBQUVEOzs7R0FHRztBQUVIO0lBRUUseUNBQ1UsTUFBYyxFQUNkLG1CQUF3QztRQUR4QyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2Qsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtJQUMvQyxDQUFDO0lBRUosMkVBQTJFO0lBQzNFLHVEQUFhLEdBQWIsVUFBYyxjQUE0QjtRQUExQyxpQkFPQztRQU5DLElBQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pFLE9BQU8sVUFBQyxJQUFTO1lBQ2YsT0FBQSxLQUFJLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFFO2dCQUN4RCxRQUFRLEVBQUUsU0FBUztnQkFDbkIsSUFBSSxNQUFBO2FBQ0wsQ0FBQztRQUhGLENBR0UsQ0FBQztJQUNQLENBQUM7SUFFRCxzRUFBc0U7SUFDdEUscURBQVcsR0FBWCxVQUNFLGNBQTRCO1FBRDlCLGlCQW9CQztRQWZDLElBQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTdELE9BQU8sVUFBQyxHQUE2QjtZQUNuQyxJQUFNLEtBQUssR0FDVCxHQUFHLFlBQVksZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUUsSUFBTSxTQUFTLEdBQWlDLEVBQUUsS0FBSyxPQUFBLEVBQUUsY0FBYyxnQkFBQSxFQUFFLENBQUM7WUFDMUUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDN0IsSUFBTSxNQUFNLEdBQUcsS0FBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUV0RCxjQUFjLEVBQUU7Z0JBQ2hCLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixJQUFJLEVBQUUsU0FBUzthQUNoQixDQUFDLENBQUM7WUFDSCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDLENBQUM7SUFDSixDQUFDO0lBdENVLCtCQUErQjtRQUQzQyxVQUFVLEVBQUU7aURBSU8sTUFBTTtZQUNPLG1CQUFtQjtPQUp2QywrQkFBK0IsQ0F1QzNDO0lBQUQsc0NBQUM7Q0FBQSxBQXZDRCxJQXVDQztTQXZDWSwrQkFBK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbmltcG9ydCB7IE9ic2VydmFibGUsIG9mIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7XG4gIERhdGFTZXJ2aWNlRXJyb3IsXG4gIEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3IsXG59IGZyb20gJy4vZGF0YS1zZXJ2aWNlLWVycm9yJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25GYWN0b3J5IH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5T3AsIG1ha2VFcnJvck9wLCBtYWtlU3VjY2Vzc09wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi4vdXRpbHMvaW50ZXJmYWNlcyc7XG5cbi8qKlxuICogSGFuZGxpbmcgb2YgcmVzcG9uc2VzIGZyb20gcGVyc2lzdGVuY2Ugb3BlcmF0aW9uXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIge1xuICAvKiogSGFuZGxlIHN1Y2Nlc3NmdWwgcmVzdWx0IG9mIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBmb3IgYW4gYWN0aW9uICovXG4gIGFic3RyYWN0IGhhbmRsZVN1Y2Nlc3Mob3JpZ2luYWxBY3Rpb246IEVudGl0eUFjdGlvbik6IChkYXRhOiBhbnkpID0+IEFjdGlvbjtcblxuICAvKiogSGFuZGxlIGVycm9yIHJlc3VsdCBvZiBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gZm9yIGFuIGFjdGlvbiAqL1xuICBhYnN0cmFjdCBoYW5kbGVFcnJvcihcbiAgICBvcmlnaW5hbEFjdGlvbjogRW50aXR5QWN0aW9uXG4gICk6IChcbiAgICBlcnJvcjogRGF0YVNlcnZpY2VFcnJvciB8IEVycm9yXG4gICkgPT4gRW50aXR5QWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+O1xufVxuXG4vKipcbiAqIERlZmF1bHQgaGFuZGxpbmcgb2YgcmVzcG9uc2VzIGZyb20gcGVyc2lzdGVuY2Ugb3BlcmF0aW9uLFxuICogc3BlY2lmaWNhbGx5IGFuIEVudGl0eURhdGFTZXJ2aWNlXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEZWZhdWx0UGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyXG4gIGltcGxlbWVudHMgUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlcixcbiAgICBwcml2YXRlIGVudGl0eUFjdGlvbkZhY3Rvcnk6IEVudGl0eUFjdGlvbkZhY3RvcnlcbiAgKSB7fVxuXG4gIC8qKiBIYW5kbGUgc3VjY2Vzc2Z1bCByZXN1bHQgb2YgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIG9uIGFuIEVudGl0eUFjdGlvbiAqL1xuICBoYW5kbGVTdWNjZXNzKG9yaWdpbmFsQWN0aW9uOiBFbnRpdHlBY3Rpb24pOiAoZGF0YTogYW55KSA9PiBBY3Rpb24ge1xuICAgIGNvbnN0IHN1Y2Nlc3NPcCA9IG1ha2VTdWNjZXNzT3Aob3JpZ2luYWxBY3Rpb24ucGF5bG9hZC5lbnRpdHlPcCk7XG4gICAgcmV0dXJuIChkYXRhOiBhbnkpID0+XG4gICAgICB0aGlzLmVudGl0eUFjdGlvbkZhY3RvcnkuY3JlYXRlRnJvbUFjdGlvbihvcmlnaW5hbEFjdGlvbiwge1xuICAgICAgICBlbnRpdHlPcDogc3VjY2Vzc09wLFxuICAgICAgICBkYXRhLFxuICAgICAgfSk7XG4gIH1cblxuICAvKiogSGFuZGxlIGVycm9yIHJlc3VsdCBvZiBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gb24gYW4gRW50aXR5QWN0aW9uICovXG4gIGhhbmRsZUVycm9yKFxuICAgIG9yaWdpbmFsQWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgKTogKFxuICAgIGVycm9yOiBEYXRhU2VydmljZUVycm9yIHwgRXJyb3JcbiAgKSA9PiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj4ge1xuICAgIGNvbnN0IGVycm9yT3AgPSBtYWtlRXJyb3JPcChvcmlnaW5hbEFjdGlvbi5wYXlsb2FkLmVudGl0eU9wKTtcblxuICAgIHJldHVybiAoZXJyOiBEYXRhU2VydmljZUVycm9yIHwgRXJyb3IpID0+IHtcbiAgICAgIGNvbnN0IGVycm9yID1cbiAgICAgICAgZXJyIGluc3RhbmNlb2YgRGF0YVNlcnZpY2VFcnJvciA/IGVyciA6IG5ldyBEYXRhU2VydmljZUVycm9yKGVyciwgbnVsbCk7XG4gICAgICBjb25zdCBlcnJvckRhdGE6IEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3IgPSB7IGVycm9yLCBvcmlnaW5hbEFjdGlvbiB9O1xuICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoZXJyb3JEYXRhKTtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuZW50aXR5QWN0aW9uRmFjdG9yeS5jcmVhdGVGcm9tQWN0aW9uPFxuICAgICAgICBFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yXG4gICAgICA+KG9yaWdpbmFsQWN0aW9uLCB7XG4gICAgICAgIGVudGl0eU9wOiBlcnJvck9wLFxuICAgICAgICBkYXRhOiBlcnJvckRhdGEsXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfTtcbiAgfVxufVxuIl19