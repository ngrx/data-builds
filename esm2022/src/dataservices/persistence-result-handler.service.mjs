import { Injectable } from '@angular/core';
import { DataServiceError, } from './data-service-error';
import { makeErrorOp, makeSuccessOp } from '../actions/entity-op';
import * as i0 from "@angular/core";
import * as i1 from "../utils/interfaces";
import * as i2 from "../actions/entity-action-factory";
/**
 * Handling of responses from persistence operation
 */
export class PersistenceResultHandler {
}
/**
 * Default handling of responses from persistence operation,
 * specifically an EntityDataService
 */
class DefaultPersistenceResultHandler {
    constructor(logger, entityActionFactory) {
        this.logger = logger;
        this.entityActionFactory = entityActionFactory;
    }
    /** Handle successful result of persistence operation on an EntityAction */
    handleSuccess(originalAction) {
        const successOp = makeSuccessOp(originalAction.payload.entityOp);
        return (data) => this.entityActionFactory.createFromAction(originalAction, {
            entityOp: successOp,
            data,
        });
    }
    /** Handle error result of persistence operation on an EntityAction */
    handleError(originalAction) {
        const errorOp = makeErrorOp(originalAction.payload.entityOp);
        return (err) => {
            const error = err instanceof DataServiceError ? err : new DataServiceError(err, null);
            const errorData = { error, originalAction };
            this.logger.error(errorData);
            const action = this.entityActionFactory.createFromAction(originalAction, {
                entityOp: errorOp,
                data: errorData,
            });
            return action;
        };
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DefaultPersistenceResultHandler, deps: [{ token: i1.Logger }, { token: i2.EntityActionFactory }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DefaultPersistenceResultHandler }); }
}
export { DefaultPersistenceResultHandler };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DefaultPersistenceResultHandler, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Logger }, { type: i2.EntityActionFactory }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyc2lzdGVuY2UtcmVzdWx0LWhhbmRsZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGF0YXNlcnZpY2VzL3BlcnNpc3RlbmNlLXJlc3VsdC1oYW5kbGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUczQyxPQUFPLEVBQ0wsZ0JBQWdCLEdBRWpCLE1BQU0sc0JBQXNCLENBQUM7QUFHOUIsT0FBTyxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7OztBQUdsRTs7R0FFRztBQUNILE1BQU0sT0FBZ0Isd0JBQXdCO0NBVTdDO0FBRUQ7OztHQUdHO0FBQ0gsTUFDYSwrQkFBK0I7SUFHMUMsWUFDVSxNQUFjLEVBQ2QsbUJBQXdDO1FBRHhDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO0lBQy9DLENBQUM7SUFFSiwyRUFBMkU7SUFDM0UsYUFBYSxDQUFDLGNBQTRCO1FBQ3hDLE1BQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pFLE9BQU8sQ0FBQyxJQUFTLEVBQUUsRUFBRSxDQUNuQixJQUFJLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFFO1lBQ3hELFFBQVEsRUFBRSxTQUFTO1lBQ25CLElBQUk7U0FDTCxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsc0VBQXNFO0lBQ3RFLFdBQVcsQ0FDVCxjQUE0QjtRQUk1QixNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUU3RCxPQUFPLENBQUMsR0FBNkIsRUFBRSxFQUFFO1lBQ3ZDLE1BQU0sS0FBSyxHQUNULEdBQUcsWUFBWSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMxRSxNQUFNLFNBQVMsR0FBaUMsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLENBQUM7WUFDMUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDN0IsTUFBTSxNQUFNLEdBQ1YsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUN2QyxjQUFjLEVBQ2Q7Z0JBQ0UsUUFBUSxFQUFFLE9BQU87Z0JBQ2pCLElBQUksRUFBRSxTQUFTO2FBQ2hCLENBQ0YsQ0FBQztZQUNKLE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUMsQ0FBQztJQUNKLENBQUM7aUlBekNVLCtCQUErQjtxSUFBL0IsK0JBQStCOztTQUEvQiwrQkFBK0I7MkZBQS9CLCtCQUErQjtrQkFEM0MsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuaW1wb3J0IHtcbiAgRGF0YVNlcnZpY2VFcnJvcixcbiAgRW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcixcbn0gZnJvbSAnLi9kYXRhLXNlcnZpY2UtZXJyb3InO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbkZhY3RvcnkgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZmFjdG9yeSc7XG5pbXBvcnQgeyBtYWtlRXJyb3JPcCwgbWFrZVN1Y2Nlc3NPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LW9wJztcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4uL3V0aWxzL2ludGVyZmFjZXMnO1xuXG4vKipcbiAqIEhhbmRsaW5nIG9mIHJlc3BvbnNlcyBmcm9tIHBlcnNpc3RlbmNlIG9wZXJhdGlvblxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyIHtcbiAgLyoqIEhhbmRsZSBzdWNjZXNzZnVsIHJlc3VsdCBvZiBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gZm9yIGFuIGFjdGlvbiAqL1xuICBhYnN0cmFjdCBoYW5kbGVTdWNjZXNzKG9yaWdpbmFsQWN0aW9uOiBFbnRpdHlBY3Rpb24pOiAoZGF0YTogYW55KSA9PiBBY3Rpb247XG5cbiAgLyoqIEhhbmRsZSBlcnJvciByZXN1bHQgb2YgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIGZvciBhbiBhY3Rpb24gKi9cbiAgYWJzdHJhY3QgaGFuZGxlRXJyb3IoXG4gICAgb3JpZ2luYWxBY3Rpb246IEVudGl0eUFjdGlvblxuICApOiAoXG4gICAgZXJyb3I6IERhdGFTZXJ2aWNlRXJyb3IgfCBFcnJvclxuICApID0+IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPjtcbn1cblxuLyoqXG4gKiBEZWZhdWx0IGhhbmRsaW5nIG9mIHJlc3BvbnNlcyBmcm9tIHBlcnNpc3RlbmNlIG9wZXJhdGlvbixcbiAqIHNwZWNpZmljYWxseSBhbiBFbnRpdHlEYXRhU2VydmljZVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGVmYXVsdFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlclxuICBpbXBsZW1lbnRzIFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlclxue1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGxvZ2dlcjogTG9nZ2VyLFxuICAgIHByaXZhdGUgZW50aXR5QWN0aW9uRmFjdG9yeTogRW50aXR5QWN0aW9uRmFjdG9yeVxuICApIHt9XG5cbiAgLyoqIEhhbmRsZSBzdWNjZXNzZnVsIHJlc3VsdCBvZiBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gb24gYW4gRW50aXR5QWN0aW9uICovXG4gIGhhbmRsZVN1Y2Nlc3Mob3JpZ2luYWxBY3Rpb246IEVudGl0eUFjdGlvbik6IChkYXRhOiBhbnkpID0+IEFjdGlvbiB7XG4gICAgY29uc3Qgc3VjY2Vzc09wID0gbWFrZVN1Y2Nlc3NPcChvcmlnaW5hbEFjdGlvbi5wYXlsb2FkLmVudGl0eU9wKTtcbiAgICByZXR1cm4gKGRhdGE6IGFueSkgPT5cbiAgICAgIHRoaXMuZW50aXR5QWN0aW9uRmFjdG9yeS5jcmVhdGVGcm9tQWN0aW9uKG9yaWdpbmFsQWN0aW9uLCB7XG4gICAgICAgIGVudGl0eU9wOiBzdWNjZXNzT3AsXG4gICAgICAgIGRhdGEsXG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKiBIYW5kbGUgZXJyb3IgcmVzdWx0IG9mIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBvbiBhbiBFbnRpdHlBY3Rpb24gKi9cbiAgaGFuZGxlRXJyb3IoXG4gICAgb3JpZ2luYWxBY3Rpb246IEVudGl0eUFjdGlvblxuICApOiAoXG4gICAgZXJyb3I6IERhdGFTZXJ2aWNlRXJyb3IgfCBFcnJvclxuICApID0+IEVudGl0eUFjdGlvbjxFbnRpdHlBY3Rpb25EYXRhU2VydmljZUVycm9yPiB7XG4gICAgY29uc3QgZXJyb3JPcCA9IG1ha2VFcnJvck9wKG9yaWdpbmFsQWN0aW9uLnBheWxvYWQuZW50aXR5T3ApO1xuXG4gICAgcmV0dXJuIChlcnI6IERhdGFTZXJ2aWNlRXJyb3IgfCBFcnJvcikgPT4ge1xuICAgICAgY29uc3QgZXJyb3IgPVxuICAgICAgICBlcnIgaW5zdGFuY2VvZiBEYXRhU2VydmljZUVycm9yID8gZXJyIDogbmV3IERhdGFTZXJ2aWNlRXJyb3IoZXJyLCBudWxsKTtcbiAgICAgIGNvbnN0IGVycm9yRGF0YTogRW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvciA9IHsgZXJyb3IsIG9yaWdpbmFsQWN0aW9uIH07XG4gICAgICB0aGlzLmxvZ2dlci5lcnJvcihlcnJvckRhdGEpO1xuICAgICAgY29uc3QgYWN0aW9uID1cbiAgICAgICAgdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5LmNyZWF0ZUZyb21BY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj4oXG4gICAgICAgICAgb3JpZ2luYWxBY3Rpb24sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZW50aXR5T3A6IGVycm9yT3AsXG4gICAgICAgICAgICBkYXRhOiBlcnJvckRhdGEsXG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9O1xuICB9XG59XG4iXX0=