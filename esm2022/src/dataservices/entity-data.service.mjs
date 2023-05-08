import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./default-data.service";
/**
 * Registry of EntityCollection data services that make REST-like CRUD calls
 * to entity collection endpoints.
 */
class EntityDataService {
    // TODO:  Optionally inject specialized entity data services
    // for those that aren't derived from BaseDataService.
    constructor(defaultDataServiceFactory) {
        this.defaultDataServiceFactory = defaultDataServiceFactory;
        this.services = {};
    }
    /**
     * Get (or create) a data service for entity type
     * @param entityName - the name of the type
     *
     * Examples:
     *   getService('Hero'); // data service for Heroes, untyped
     *   getService<Hero>('Hero'); // data service for Heroes, typed as Hero
     */
    getService(entityName) {
        entityName = entityName.trim();
        let service = this.services[entityName];
        if (!service) {
            service = this.defaultDataServiceFactory.create(entityName);
            this.services[entityName] = service;
        }
        return service;
    }
    /**
     * Register an EntityCollectionDataService for an entity type
     * @param entityName - the name of the entity type
     * @param service - data service for that entity type
     *
     * Examples:
     *   registerService('Hero', myHeroDataService);
     *   registerService('Villain', myVillainDataService);
     */
    registerService(entityName, service) {
        this.services[entityName.trim()] = service;
    }
    /**
     * Register a batch of data services.
     * @param services - data services to merge into existing services
     *
     * Examples:
     *   registerServices({
     *     Hero: myHeroDataService,
     *     Villain: myVillainDataService
     *   });
     */
    registerServices(services) {
        this.services = { ...this.services, ...services };
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityDataService, deps: [{ token: i1.DefaultDataServiceFactory }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityDataService }); }
}
export { EntityDataService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityDataService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.DefaultDataServiceFactory }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRhdGEuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGF0YXNlcnZpY2VzL2VudGl0eS1kYXRhLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBSzNDOzs7R0FHRztBQUNILE1BQ2EsaUJBQWlCO0lBRzVCLDREQUE0RDtJQUM1RCxzREFBc0Q7SUFDdEQsWUFBc0IseUJBQW9EO1FBQXBELDhCQUF5QixHQUF6Qix5QkFBeUIsQ0FBMkI7UUFKaEUsYUFBUSxHQUF5RCxFQUFFLENBQUM7SUFJRCxDQUFDO0lBRTlFOzs7Ozs7O09BT0c7SUFDSCxVQUFVLENBQUksVUFBa0I7UUFDOUIsVUFBVSxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMvQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxHQUFHLE9BQU8sQ0FBQztTQUNyQztRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNILGVBQWUsQ0FDYixVQUFrQixFQUNsQixPQUF1QztRQUV2QyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQztJQUM3QyxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsZ0JBQWdCLENBQUMsUUFFaEI7UUFDQyxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsUUFBUSxFQUFFLENBQUM7SUFDcEQsQ0FBQztpSUF2RFUsaUJBQWlCO3FJQUFqQixpQkFBaUI7O1NBQWpCLGlCQUFpQjsyRkFBakIsaUJBQWlCO2tCQUQ3QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uRGF0YVNlcnZpY2UgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgRGVmYXVsdERhdGFTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4vZGVmYXVsdC1kYXRhLnNlcnZpY2UnO1xuXG4vKipcbiAqIFJlZ2lzdHJ5IG9mIEVudGl0eUNvbGxlY3Rpb24gZGF0YSBzZXJ2aWNlcyB0aGF0IG1ha2UgUkVTVC1saWtlIENSVUQgY2FsbHNcbiAqIHRvIGVudGl0eSBjb2xsZWN0aW9uIGVuZHBvaW50cy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eURhdGFTZXJ2aWNlIHtcbiAgcHJvdGVjdGVkIHNlcnZpY2VzOiB7IFtuYW1lOiBzdHJpbmddOiBFbnRpdHlDb2xsZWN0aW9uRGF0YVNlcnZpY2U8YW55PiB9ID0ge307XG5cbiAgLy8gVE9ETzogIE9wdGlvbmFsbHkgaW5qZWN0IHNwZWNpYWxpemVkIGVudGl0eSBkYXRhIHNlcnZpY2VzXG4gIC8vIGZvciB0aG9zZSB0aGF0IGFyZW4ndCBkZXJpdmVkIGZyb20gQmFzZURhdGFTZXJ2aWNlLlxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZGVmYXVsdERhdGFTZXJ2aWNlRmFjdG9yeTogRGVmYXVsdERhdGFTZXJ2aWNlRmFjdG9yeSkge31cblxuICAvKipcbiAgICogR2V0IChvciBjcmVhdGUpIGEgZGF0YSBzZXJ2aWNlIGZvciBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSAtIHRoZSBuYW1lIG9mIHRoZSB0eXBlXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIGdldFNlcnZpY2UoJ0hlcm8nKTsgLy8gZGF0YSBzZXJ2aWNlIGZvciBIZXJvZXMsIHVudHlwZWRcbiAgICogICBnZXRTZXJ2aWNlPEhlcm8+KCdIZXJvJyk7IC8vIGRhdGEgc2VydmljZSBmb3IgSGVyb2VzLCB0eXBlZCBhcyBIZXJvXG4gICAqL1xuICBnZXRTZXJ2aWNlPFQ+KGVudGl0eU5hbWU6IHN0cmluZyk6IEVudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZTxUPiB7XG4gICAgZW50aXR5TmFtZSA9IGVudGl0eU5hbWUudHJpbSgpO1xuICAgIGxldCBzZXJ2aWNlID0gdGhpcy5zZXJ2aWNlc1tlbnRpdHlOYW1lXTtcbiAgICBpZiAoIXNlcnZpY2UpIHtcbiAgICAgIHNlcnZpY2UgPSB0aGlzLmRlZmF1bHREYXRhU2VydmljZUZhY3RvcnkuY3JlYXRlKGVudGl0eU5hbWUpO1xuICAgICAgdGhpcy5zZXJ2aWNlc1tlbnRpdHlOYW1lXSA9IHNlcnZpY2U7XG4gICAgfVxuICAgIHJldHVybiBzZXJ2aWNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGFuIEVudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZSBmb3IgYW4gZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGVudGl0eU5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIHNlcnZpY2UgLSBkYXRhIHNlcnZpY2UgZm9yIHRoYXQgZW50aXR5IHR5cGVcbiAgICpcbiAgICogRXhhbXBsZXM6XG4gICAqICAgcmVnaXN0ZXJTZXJ2aWNlKCdIZXJvJywgbXlIZXJvRGF0YVNlcnZpY2UpO1xuICAgKiAgIHJlZ2lzdGVyU2VydmljZSgnVmlsbGFpbicsIG15VmlsbGFpbkRhdGFTZXJ2aWNlKTtcbiAgICovXG4gIHJlZ2lzdGVyU2VydmljZTxUPihcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgc2VydmljZTogRW50aXR5Q29sbGVjdGlvbkRhdGFTZXJ2aWNlPFQ+XG4gICkge1xuICAgIHRoaXMuc2VydmljZXNbZW50aXR5TmFtZS50cmltKCldID0gc2VydmljZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGJhdGNoIG9mIGRhdGEgc2VydmljZXMuXG4gICAqIEBwYXJhbSBzZXJ2aWNlcyAtIGRhdGEgc2VydmljZXMgdG8gbWVyZ2UgaW50byBleGlzdGluZyBzZXJ2aWNlc1xuICAgKlxuICAgKiBFeGFtcGxlczpcbiAgICogICByZWdpc3RlclNlcnZpY2VzKHtcbiAgICogICAgIEhlcm86IG15SGVyb0RhdGFTZXJ2aWNlLFxuICAgKiAgICAgVmlsbGFpbjogbXlWaWxsYWluRGF0YVNlcnZpY2VcbiAgICogICB9KTtcbiAgICovXG4gIHJlZ2lzdGVyU2VydmljZXMoc2VydmljZXM6IHtcbiAgICBbbmFtZTogc3RyaW5nXTogRW50aXR5Q29sbGVjdGlvbkRhdGFTZXJ2aWNlPGFueT47XG4gIH0pIHtcbiAgICB0aGlzLnNlcnZpY2VzID0geyAuLi50aGlzLnNlcnZpY2VzLCAuLi5zZXJ2aWNlcyB9O1xuICB9XG59XG4iXX0=