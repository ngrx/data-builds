(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/dataservices/persistence-result-handler.service", ["require", "exports", "tslib", "@angular/core", "@ngrx/data/src/dataservices/data-service-error", "@ngrx/data/src/actions/entity-action-factory", "@ngrx/data/src/actions/entity-op", "@ngrx/data/src/utils/interfaces"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@angular/core");
    const data_service_error_1 = require("@ngrx/data/src/dataservices/data-service-error");
    const entity_action_factory_1 = require("@ngrx/data/src/actions/entity-action-factory");
    const entity_op_1 = require("@ngrx/data/src/actions/entity-op");
    const interfaces_1 = require("@ngrx/data/src/utils/interfaces");
    /**
     * Handling of responses from persistence operation
     */
    class PersistenceResultHandler {
    }
    exports.PersistenceResultHandler = PersistenceResultHandler;
    /**
     * Default handling of responses from persistence operation,
     * specifically an EntityDataService
     */
    let DefaultPersistenceResultHandler = class DefaultPersistenceResultHandler {
        constructor(logger, entityActionFactory) {
            this.logger = logger;
            this.entityActionFactory = entityActionFactory;
        }
        /** Handle successful result of persistence operation on an EntityAction */
        handleSuccess(originalAction) {
            const successOp = entity_op_1.makeSuccessOp(originalAction.payload.entityOp);
            return (data) => this.entityActionFactory.createFromAction(originalAction, {
                entityOp: successOp,
                data,
            });
        }
        /** Handle error result of persistence operation on an EntityAction */
        handleError(originalAction) {
            const errorOp = entity_op_1.makeErrorOp(originalAction.payload.entityOp);
            return (err) => {
                const error = err instanceof data_service_error_1.DataServiceError ? err : new data_service_error_1.DataServiceError(err, null);
                const errorData = { error, originalAction };
                this.logger.error(errorData);
                const action = this.entityActionFactory.createFromAction(originalAction, {
                    entityOp: errorOp,
                    data: errorData,
                });
                return action;
            };
        }
    };
    DefaultPersistenceResultHandler = tslib_1.__decorate([
        core_1.Injectable(),
        tslib_1.__metadata("design:paramtypes", [interfaces_1.Logger,
            entity_action_factory_1.EntityActionFactory])
    ], DefaultPersistenceResultHandler);
    exports.DefaultPersistenceResultHandler = DefaultPersistenceResultHandler;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyc2lzdGVuY2UtcmVzdWx0LWhhbmRsZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGF0YXNlcnZpY2VzL3BlcnNpc3RlbmNlLXJlc3VsdC1oYW5kbGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUEsd0NBQTJDO0lBRzNDLHVGQUc4QjtJQUU5Qix3RkFBdUU7SUFDdkUsZ0VBQWtFO0lBQ2xFLGdFQUE2QztJQUU3Qzs7T0FFRztJQUNILE1BQXNCLHdCQUF3QjtLQVU3QztJQVZELDREQVVDO0lBRUQ7OztPQUdHO0lBRUgsSUFBYSwrQkFBK0IsR0FBNUMsTUFBYSwrQkFBK0I7UUFFMUMsWUFDVSxNQUFjLEVBQ2QsbUJBQXdDO1lBRHhDLFdBQU0sR0FBTixNQUFNLENBQVE7WUFDZCx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQy9DLENBQUM7UUFFSiwyRUFBMkU7UUFDM0UsYUFBYSxDQUFDLGNBQTRCO1lBQ3hDLE1BQU0sU0FBUyxHQUFHLHlCQUFhLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNqRSxPQUFPLENBQUMsSUFBUyxFQUFFLEVBQUUsQ0FDbkIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRTtnQkFDeEQsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLElBQUk7YUFDTCxDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUQsc0VBQXNFO1FBQ3RFLFdBQVcsQ0FDVCxjQUE0QjtZQUk1QixNQUFNLE9BQU8sR0FBRyx1QkFBVyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFN0QsT0FBTyxDQUFDLEdBQTZCLEVBQUUsRUFBRTtnQkFDdkMsTUFBTSxLQUFLLEdBQ1QsR0FBRyxZQUFZLHFDQUFnQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUkscUNBQWdCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUMxRSxNQUFNLFNBQVMsR0FBaUMsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLENBQUM7Z0JBQzFFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUM3QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBRXRELGNBQWMsRUFBRTtvQkFDaEIsUUFBUSxFQUFFLE9BQU87b0JBQ2pCLElBQUksRUFBRSxTQUFTO2lCQUNoQixDQUFDLENBQUM7Z0JBQ0gsT0FBTyxNQUFNLENBQUM7WUFDaEIsQ0FBQyxDQUFDO1FBQ0osQ0FBQztLQUNGLENBQUE7SUF2Q1ksK0JBQStCO1FBRDNDLGlCQUFVLEVBQUU7aURBSU8sbUJBQU07WUFDTywyQ0FBbUI7T0FKdkMsK0JBQStCLENBdUMzQztJQXZDWSwwRUFBK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbmltcG9ydCB7XG4gIERhdGFTZXJ2aWNlRXJyb3IsXG4gIEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3IsXG59IGZyb20gJy4vZGF0YS1zZXJ2aWNlLWVycm9yJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25GYWN0b3J5IH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWZhY3RvcnknO1xuaW1wb3J0IHsgbWFrZUVycm9yT3AsIG1ha2VTdWNjZXNzT3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuLi91dGlscy9pbnRlcmZhY2VzJztcblxuLyoqXG4gKiBIYW5kbGluZyBvZiByZXNwb25zZXMgZnJvbSBwZXJzaXN0ZW5jZSBvcGVyYXRpb25cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlciB7XG4gIC8qKiBIYW5kbGUgc3VjY2Vzc2Z1bCByZXN1bHQgb2YgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIGZvciBhbiBhY3Rpb24gKi9cbiAgYWJzdHJhY3QgaGFuZGxlU3VjY2VzcyhvcmlnaW5hbEFjdGlvbjogRW50aXR5QWN0aW9uKTogKGRhdGE6IGFueSkgPT4gQWN0aW9uO1xuXG4gIC8qKiBIYW5kbGUgZXJyb3IgcmVzdWx0IG9mIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBmb3IgYW4gYWN0aW9uICovXG4gIGFic3RyYWN0IGhhbmRsZUVycm9yKFxuICAgIG9yaWdpbmFsQWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgKTogKFxuICAgIGVycm9yOiBEYXRhU2VydmljZUVycm9yIHwgRXJyb3JcbiAgKSA9PiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj47XG59XG5cbi8qKlxuICogRGVmYXVsdCBoYW5kbGluZyBvZiByZXNwb25zZXMgZnJvbSBwZXJzaXN0ZW5jZSBvcGVyYXRpb24sXG4gKiBzcGVjaWZpY2FsbHkgYW4gRW50aXR5RGF0YVNlcnZpY2VcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERlZmF1bHRQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXJcbiAgaW1wbGVtZW50cyBQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGxvZ2dlcjogTG9nZ2VyLFxuICAgIHByaXZhdGUgZW50aXR5QWN0aW9uRmFjdG9yeTogRW50aXR5QWN0aW9uRmFjdG9yeVxuICApIHt9XG5cbiAgLyoqIEhhbmRsZSBzdWNjZXNzZnVsIHJlc3VsdCBvZiBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gb24gYW4gRW50aXR5QWN0aW9uICovXG4gIGhhbmRsZVN1Y2Nlc3Mob3JpZ2luYWxBY3Rpb246IEVudGl0eUFjdGlvbik6IChkYXRhOiBhbnkpID0+IEFjdGlvbiB7XG4gICAgY29uc3Qgc3VjY2Vzc09wID0gbWFrZVN1Y2Nlc3NPcChvcmlnaW5hbEFjdGlvbi5wYXlsb2FkLmVudGl0eU9wKTtcbiAgICByZXR1cm4gKGRhdGE6IGFueSkgPT5cbiAgICAgIHRoaXMuZW50aXR5QWN0aW9uRmFjdG9yeS5jcmVhdGVGcm9tQWN0aW9uKG9yaWdpbmFsQWN0aW9uLCB7XG4gICAgICAgIGVudGl0eU9wOiBzdWNjZXNzT3AsXG4gICAgICAgIGRhdGEsXG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKiBIYW5kbGUgZXJyb3IgcmVzdWx0IG9mIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBvbiBhbiBFbnRpdHlBY3Rpb24gKi9cbiAgaGFuZGxlRXJyb3IoXG4gICAgb3JpZ2luYWxBY3Rpb246IEVudGl0eUFjdGlvblxuICApOiAoXG4gICAgZXJyb3I6IERhdGFTZXJ2aWNlRXJyb3IgfCBFcnJvclxuICApID0+IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPiB7XG4gICAgY29uc3QgZXJyb3JPcCA9IG1ha2VFcnJvck9wKG9yaWdpbmFsQWN0aW9uLnBheWxvYWQuZW50aXR5T3ApO1xuXG4gICAgcmV0dXJuIChlcnI6IERhdGFTZXJ2aWNlRXJyb3IgfCBFcnJvcikgPT4ge1xuICAgICAgY29uc3QgZXJyb3IgPVxuICAgICAgICBlcnIgaW5zdGFuY2VvZiBEYXRhU2VydmljZUVycm9yID8gZXJyIDogbmV3IERhdGFTZXJ2aWNlRXJyb3IoZXJyLCBudWxsKTtcbiAgICAgIGNvbnN0IGVycm9yRGF0YTogRW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvciA9IHsgZXJyb3IsIG9yaWdpbmFsQWN0aW9uIH07XG4gICAgICB0aGlzLmxvZ2dlci5lcnJvcihlcnJvckRhdGEpO1xuICAgICAgY29uc3QgYWN0aW9uID0gdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5LmNyZWF0ZUZyb21BY3Rpb248XG4gICAgICAgIEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3JcbiAgICAgID4ob3JpZ2luYWxBY3Rpb24sIHtcbiAgICAgICAgZW50aXR5T3A6IGVycm9yT3AsXG4gICAgICAgIGRhdGE6IGVycm9yRGF0YSxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9O1xuICB9XG59XG4iXX0=