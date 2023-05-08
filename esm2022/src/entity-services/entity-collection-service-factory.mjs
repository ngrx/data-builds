import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase } from './entity-collection-service-base';
import * as i0 from "@angular/core";
import * as i1 from "./entity-collection-service-elements-factory";
/**
 * Creates EntityCollectionService instances for
 * a cached collection of T entities in the ngrx store.
 */
class EntityCollectionServiceFactory {
    constructor(
    /** Creates the core elements of the EntityCollectionService for an entity type. */
    entityCollectionServiceElementsFactory) {
        this.entityCollectionServiceElementsFactory = entityCollectionServiceElementsFactory;
    }
    /**
     * Create an EntityCollectionService for an entity type
     * @param entityName - name of the entity type
     */
    create(entityName) {
        return new EntityCollectionServiceBase(entityName, this.entityCollectionServiceElementsFactory);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityCollectionServiceFactory, deps: [{ token: i1.EntityCollectionServiceElementsFactory }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityCollectionServiceFactory }); }
}
export { EntityCollectionServiceFactory };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityCollectionServiceFactory, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.EntityCollectionServiceElementsFactory }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1mYWN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktc2VydmljZXMvZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1mYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7OztBQUkvRTs7O0dBR0c7QUFDSCxNQUNhLDhCQUE4QjtJQUN6QztJQUNFLG1GQUFtRjtJQUM1RSxzQ0FBOEU7UUFBOUUsMkNBQXNDLEdBQXRDLHNDQUFzQyxDQUF3QztJQUNwRixDQUFDO0lBRUo7OztPQUdHO0lBQ0gsTUFBTSxDQUNKLFVBQWtCO1FBRWxCLE9BQU8sSUFBSSwyQkFBMkIsQ0FDcEMsVUFBVSxFQUNWLElBQUksQ0FBQyxzQ0FBc0MsQ0FDNUMsQ0FBQztJQUNKLENBQUM7aUlBakJVLDhCQUE4QjtxSUFBOUIsOEJBQThCOztTQUE5Qiw4QkFBOEI7MkZBQTlCLDhCQUE4QjtrQkFEMUMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlQmFzZSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1iYXNlJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRWxlbWVudHNGYWN0b3J5IH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1zZXJ2aWNlLWVsZW1lbnRzLWZhY3RvcnknO1xuaW1wb3J0IHsgRW50aXR5U2VsZWN0b3JzJCB9IGZyb20gJy4uL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJCc7XG5cbi8qKlxuICogQ3JlYXRlcyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSBpbnN0YW5jZXMgZm9yXG4gKiBhIGNhY2hlZCBjb2xsZWN0aW9uIG9mIFQgZW50aXRpZXMgaW4gdGhlIG5ncnggc3RvcmUuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogQ3JlYXRlcyB0aGUgY29yZSBlbGVtZW50cyBvZiB0aGUgRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgZm9yIGFuIGVudGl0eSB0eXBlLiAqL1xuICAgIHB1YmxpYyBlbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzRmFjdG9yeTogRW50aXR5Q29sbGVjdGlvblNlcnZpY2VFbGVtZW50c0ZhY3RvcnlcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgZm9yIGFuIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIC0gbmFtZSBvZiB0aGUgZW50aXR5IHR5cGVcbiAgICovXG4gIGNyZWF0ZTxULCBTJCBleHRlbmRzIEVudGl0eVNlbGVjdG9ycyQ8VD4gPSBFbnRpdHlTZWxlY3RvcnMkPFQ+PihcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmdcbiAgKTogRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VD4ge1xuICAgIHJldHVybiBuZXcgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VCYXNlPFQsIFMkPihcbiAgICAgIGVudGl0eU5hbWUsXG4gICAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRWxlbWVudHNGYWN0b3J5XG4gICAgKTtcbiAgfVxufVxuIl19