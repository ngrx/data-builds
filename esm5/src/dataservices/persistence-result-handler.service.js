import { __decorate, __metadata } from "tslib";
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
    DefaultPersistenceResultHandler = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Logger,
            EntityActionFactory])
    ], DefaultPersistenceResultHandler);
    return DefaultPersistenceResultHandler;
}());
export { DefaultPersistenceResultHandler };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyc2lzdGVuY2UtcmVzdWx0LWhhbmRsZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGF0YXNlcnZpY2VzL3BlcnNpc3RlbmNlLXJlc3VsdC1oYW5kbGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0MsT0FBTyxFQUNMLGdCQUFnQixHQUVqQixNQUFNLHNCQUFzQixDQUFDO0FBRTlCLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbEUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRTdDOztHQUVHO0FBQ0g7SUFBQTtJQVVBLENBQUM7SUFBRCwrQkFBQztBQUFELENBQUMsQUFWRCxJQVVDOztBQUVEOzs7R0FHRztBQUVIO0lBRUUseUNBQ1UsTUFBYyxFQUNkLG1CQUF3QztRQUR4QyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2Qsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtJQUMvQyxDQUFDO0lBRUosMkVBQTJFO0lBQzNFLHVEQUFhLEdBQWIsVUFBYyxjQUE0QjtRQUExQyxpQkFPQztRQU5DLElBQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pFLE9BQU8sVUFBQyxJQUFTO1lBQ2YsT0FBQSxLQUFJLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFFO2dCQUN4RCxRQUFRLEVBQUUsU0FBUztnQkFDbkIsSUFBSSxNQUFBO2FBQ0wsQ0FBQztRQUhGLENBR0UsQ0FBQztJQUNQLENBQUM7SUFFRCxzRUFBc0U7SUFDdEUscURBQVcsR0FBWCxVQUNFLGNBQTRCO1FBRDlCLGlCQW9CQztRQWZDLElBQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTdELE9BQU8sVUFBQyxHQUE2QjtZQUNuQyxJQUFNLEtBQUssR0FDVCxHQUFHLFlBQVksZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUUsSUFBTSxTQUFTLEdBQWlDLEVBQUUsS0FBSyxPQUFBLEVBQUUsY0FBYyxnQkFBQSxFQUFFLENBQUM7WUFDMUUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDN0IsSUFBTSxNQUFNLEdBQUcsS0FBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUV0RCxjQUFjLEVBQUU7Z0JBQ2hCLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixJQUFJLEVBQUUsU0FBUzthQUNoQixDQUFDLENBQUM7WUFDSCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDLENBQUM7SUFDSixDQUFDO0lBdENVLCtCQUErQjtRQUQzQyxVQUFVLEVBQUU7eUNBSU8sTUFBTTtZQUNPLG1CQUFtQjtPQUp2QywrQkFBK0IsQ0F1QzNDO0lBQUQsc0NBQUM7Q0FBQSxBQXZDRCxJQXVDQztTQXZDWSwrQkFBK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbmltcG9ydCB7XG4gIERhdGFTZXJ2aWNlRXJyb3IsXG4gIEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3IsXG59IGZyb20gJy4vZGF0YS1zZXJ2aWNlLWVycm9yJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25GYWN0b3J5IH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWZhY3RvcnknO1xuaW1wb3J0IHsgbWFrZUVycm9yT3AsIG1ha2VTdWNjZXNzT3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuLi91dGlscy9pbnRlcmZhY2VzJztcblxuLyoqXG4gKiBIYW5kbGluZyBvZiByZXNwb25zZXMgZnJvbSBwZXJzaXN0ZW5jZSBvcGVyYXRpb25cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlciB7XG4gIC8qKiBIYW5kbGUgc3VjY2Vzc2Z1bCByZXN1bHQgb2YgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIGZvciBhbiBhY3Rpb24gKi9cbiAgYWJzdHJhY3QgaGFuZGxlU3VjY2VzcyhvcmlnaW5hbEFjdGlvbjogRW50aXR5QWN0aW9uKTogKGRhdGE6IGFueSkgPT4gQWN0aW9uO1xuXG4gIC8qKiBIYW5kbGUgZXJyb3IgcmVzdWx0IG9mIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBmb3IgYW4gYWN0aW9uICovXG4gIGFic3RyYWN0IGhhbmRsZUVycm9yKFxuICAgIG9yaWdpbmFsQWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgKTogKFxuICAgIGVycm9yOiBEYXRhU2VydmljZUVycm9yIHwgRXJyb3JcbiAgKSA9PiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj47XG59XG5cbi8qKlxuICogRGVmYXVsdCBoYW5kbGluZyBvZiByZXNwb25zZXMgZnJvbSBwZXJzaXN0ZW5jZSBvcGVyYXRpb24sXG4gKiBzcGVjaWZpY2FsbHkgYW4gRW50aXR5RGF0YVNlcnZpY2VcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERlZmF1bHRQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXJcbiAgaW1wbGVtZW50cyBQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGxvZ2dlcjogTG9nZ2VyLFxuICAgIHByaXZhdGUgZW50aXR5QWN0aW9uRmFjdG9yeTogRW50aXR5QWN0aW9uRmFjdG9yeVxuICApIHt9XG5cbiAgLyoqIEhhbmRsZSBzdWNjZXNzZnVsIHJlc3VsdCBvZiBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gb24gYW4gRW50aXR5QWN0aW9uICovXG4gIGhhbmRsZVN1Y2Nlc3Mob3JpZ2luYWxBY3Rpb246IEVudGl0eUFjdGlvbik6IChkYXRhOiBhbnkpID0+IEFjdGlvbiB7XG4gICAgY29uc3Qgc3VjY2Vzc09wID0gbWFrZVN1Y2Nlc3NPcChvcmlnaW5hbEFjdGlvbi5wYXlsb2FkLmVudGl0eU9wKTtcbiAgICByZXR1cm4gKGRhdGE6IGFueSkgPT5cbiAgICAgIHRoaXMuZW50aXR5QWN0aW9uRmFjdG9yeS5jcmVhdGVGcm9tQWN0aW9uKG9yaWdpbmFsQWN0aW9uLCB7XG4gICAgICAgIGVudGl0eU9wOiBzdWNjZXNzT3AsXG4gICAgICAgIGRhdGEsXG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKiBIYW5kbGUgZXJyb3IgcmVzdWx0IG9mIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBvbiBhbiBFbnRpdHlBY3Rpb24gKi9cbiAgaGFuZGxlRXJyb3IoXG4gICAgb3JpZ2luYWxBY3Rpb246IEVudGl0eUFjdGlvblxuICApOiAoXG4gICAgZXJyb3I6IERhdGFTZXJ2aWNlRXJyb3IgfCBFcnJvclxuICApID0+IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPiB7XG4gICAgY29uc3QgZXJyb3JPcCA9IG1ha2VFcnJvck9wKG9yaWdpbmFsQWN0aW9uLnBheWxvYWQuZW50aXR5T3ApO1xuXG4gICAgcmV0dXJuIChlcnI6IERhdGFTZXJ2aWNlRXJyb3IgfCBFcnJvcikgPT4ge1xuICAgICAgY29uc3QgZXJyb3IgPVxuICAgICAgICBlcnIgaW5zdGFuY2VvZiBEYXRhU2VydmljZUVycm9yID8gZXJyIDogbmV3IERhdGFTZXJ2aWNlRXJyb3IoZXJyLCBudWxsKTtcbiAgICAgIGNvbnN0IGVycm9yRGF0YTogRW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvciA9IHsgZXJyb3IsIG9yaWdpbmFsQWN0aW9uIH07XG4gICAgICB0aGlzLmxvZ2dlci5lcnJvcihlcnJvckRhdGEpO1xuICAgICAgY29uc3QgYWN0aW9uID0gdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5LmNyZWF0ZUZyb21BY3Rpb248XG4gICAgICAgIEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3JcbiAgICAgID4ob3JpZ2luYWxBY3Rpb24sIHtcbiAgICAgICAgZW50aXR5T3A6IGVycm9yT3AsXG4gICAgICAgIGRhdGE6IGVycm9yRGF0YSxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9O1xuICB9XG59XG4iXX0=