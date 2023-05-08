import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./entity-collection-reducer-methods";
/** Create a default reducer for a specific entity collection */
class EntityCollectionReducerFactory {
    constructor(methodsFactory) {
        this.methodsFactory = methodsFactory;
    }
    /** Create a default reducer for a collection of entities of T */
    create(entityName) {
        const methods = this.methodsFactory.create(entityName);
        /** Perform Actions against a particular entity collection in the EntityCache */
        return function entityCollectionReducer(collection, action) {
            const reducerMethod = methods[action.payload.entityOp];
            return reducerMethod ? reducerMethod(collection, action) : collection;
        };
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityCollectionReducerFactory, deps: [{ token: i1.EntityCollectionReducerMethodsFactory }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityCollectionReducerFactory }); }
}
export { EntityCollectionReducerFactory };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityCollectionReducerFactory, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.EntityCollectionReducerMethodsFactory }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFXM0MsZ0VBQWdFO0FBQ2hFLE1BQ2EsOEJBQThCO0lBQ3pDLFlBQW9CLGNBQXFEO1FBQXJELG1CQUFjLEdBQWQsY0FBYyxDQUF1QztJQUFHLENBQUM7SUFFN0UsaUVBQWlFO0lBQ2pFLE1BQU0sQ0FBVSxVQUFrQjtRQUNoQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBSSxVQUFVLENBQUMsQ0FBQztRQUUxRCxnRkFBZ0Y7UUFDaEYsT0FBTyxTQUFTLHVCQUF1QixDQUNyQyxVQUErQixFQUMvQixNQUFvQjtZQUVwQixNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN2RCxPQUFPLGFBQWEsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1FBQ3hFLENBQUMsQ0FBQztJQUNKLENBQUM7aUlBZlUsOEJBQThCO3FJQUE5Qiw4QkFBOEI7O1NBQTlCLDhCQUE4QjsyRkFBOUIsOEJBQThCO2tCQUQxQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbiB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzRmFjdG9yeSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1tZXRob2RzJztcblxuZXhwb3J0IHR5cGUgRW50aXR5Q29sbGVjdGlvblJlZHVjZXI8VCA9IGFueT4gPSAoXG4gIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gIGFjdGlvbjogRW50aXR5QWN0aW9uXG4pID0+IEVudGl0eUNvbGxlY3Rpb248VD47XG5cbi8qKiBDcmVhdGUgYSBkZWZhdWx0IHJlZHVjZXIgZm9yIGEgc3BlY2lmaWMgZW50aXR5IGNvbGxlY3Rpb24gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlckZhY3Rvcnkge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1ldGhvZHNGYWN0b3J5OiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlck1ldGhvZHNGYWN0b3J5KSB7fVxuXG4gIC8qKiBDcmVhdGUgYSBkZWZhdWx0IHJlZHVjZXIgZm9yIGEgY29sbGVjdGlvbiBvZiBlbnRpdGllcyBvZiBUICovXG4gIGNyZWF0ZTxUID0gYW55PihlbnRpdHlOYW1lOiBzdHJpbmcpOiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcjxUPiB7XG4gICAgY29uc3QgbWV0aG9kcyA9IHRoaXMubWV0aG9kc0ZhY3RvcnkuY3JlYXRlPFQ+KGVudGl0eU5hbWUpO1xuXG4gICAgLyoqIFBlcmZvcm0gQWN0aW9ucyBhZ2FpbnN0IGEgcGFydGljdWxhciBlbnRpdHkgY29sbGVjdGlvbiBpbiB0aGUgRW50aXR5Q2FjaGUgKi9cbiAgICByZXR1cm4gZnVuY3Rpb24gZW50aXR5Q29sbGVjdGlvblJlZHVjZXIoXG4gICAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgICAgYWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICAgIGNvbnN0IHJlZHVjZXJNZXRob2QgPSBtZXRob2RzW2FjdGlvbi5wYXlsb2FkLmVudGl0eU9wXTtcbiAgICAgIHJldHVybiByZWR1Y2VyTWV0aG9kID8gcmVkdWNlck1ldGhvZChjb2xsZWN0aW9uLCBhY3Rpb24pIDogY29sbGVjdGlvbjtcbiAgICB9O1xuICB9XG59XG4iXX0=