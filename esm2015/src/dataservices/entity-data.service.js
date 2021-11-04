import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./default-data.service";
/**
 * Registry of EntityCollection data services that make REST-like CRUD calls
 * to entity collection endpoints.
 */
export class EntityDataService {
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
        this.services = Object.assign(Object.assign({}, this.services), services);
    }
}
/** @nocollapse */ EntityDataService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.6", ngImport: i0, type: EntityDataService, deps: [{ token: i1.DefaultDataServiceFactory }], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ EntityDataService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.6", ngImport: i0, type: EntityDataService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.6", ngImport: i0, type: EntityDataService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.DefaultDataServiceFactory }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRhdGEuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGF0YXNlcnZpY2VzL2VudGl0eS1kYXRhLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBSzNDOzs7R0FHRztBQUVILE1BQU0sT0FBTyxpQkFBaUI7SUFHNUIsNERBQTREO0lBQzVELHNEQUFzRDtJQUN0RCxZQUFzQix5QkFBb0Q7UUFBcEQsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEyQjtRQUpoRSxhQUFRLEdBQXlELEVBQUUsQ0FBQztJQUlELENBQUM7SUFFOUU7Ozs7Ozs7T0FPRztJQUNILFVBQVUsQ0FBSSxVQUFrQjtRQUM5QixVQUFVLEdBQUcsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQy9CLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNaLE9BQU8sR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsT0FBTyxDQUFDO1NBQ3JDO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0gsZUFBZSxDQUNiLFVBQWtCLEVBQ2xCLE9BQXVDO1FBRXZDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBQzdDLENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSCxnQkFBZ0IsQ0FBQyxRQUVoQjtRQUNDLElBQUksQ0FBQyxRQUFRLG1DQUFRLElBQUksQ0FBQyxRQUFRLEdBQUssUUFBUSxDQUFFLENBQUM7SUFDcEQsQ0FBQzs7aUlBdkRVLGlCQUFpQjtxSUFBakIsaUJBQWlCOzJGQUFqQixpQkFBaUI7a0JBRDdCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBEZWZhdWx0RGF0YVNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi9kZWZhdWx0LWRhdGEuc2VydmljZSc7XG5cbi8qKlxuICogUmVnaXN0cnkgb2YgRW50aXR5Q29sbGVjdGlvbiBkYXRhIHNlcnZpY2VzIHRoYXQgbWFrZSBSRVNULWxpa2UgQ1JVRCBjYWxsc1xuICogdG8gZW50aXR5IGNvbGxlY3Rpb24gZW5kcG9pbnRzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5RGF0YVNlcnZpY2Uge1xuICBwcm90ZWN0ZWQgc2VydmljZXM6IHsgW25hbWU6IHN0cmluZ106IEVudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZTxhbnk+IH0gPSB7fTtcblxuICAvLyBUT0RPOiAgT3B0aW9uYWxseSBpbmplY3Qgc3BlY2lhbGl6ZWQgZW50aXR5IGRhdGEgc2VydmljZXNcbiAgLy8gZm9yIHRob3NlIHRoYXQgYXJlbid0IGRlcml2ZWQgZnJvbSBCYXNlRGF0YVNlcnZpY2UuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBkZWZhdWx0RGF0YVNlcnZpY2VGYWN0b3J5OiBEZWZhdWx0RGF0YVNlcnZpY2VGYWN0b3J5KSB7fVxuXG4gIC8qKlxuICAgKiBHZXQgKG9yIGNyZWF0ZSkgYSBkYXRhIHNlcnZpY2UgZm9yIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIC0gdGhlIG5hbWUgb2YgdGhlIHR5cGVcbiAgICpcbiAgICogRXhhbXBsZXM6XG4gICAqICAgZ2V0U2VydmljZSgnSGVybycpOyAvLyBkYXRhIHNlcnZpY2UgZm9yIEhlcm9lcywgdW50eXBlZFxuICAgKiAgIGdldFNlcnZpY2U8SGVybz4oJ0hlcm8nKTsgLy8gZGF0YSBzZXJ2aWNlIGZvciBIZXJvZXMsIHR5cGVkIGFzIEhlcm9cbiAgICovXG4gIGdldFNlcnZpY2U8VD4oZW50aXR5TmFtZTogc3RyaW5nKTogRW50aXR5Q29sbGVjdGlvbkRhdGFTZXJ2aWNlPFQ+IHtcbiAgICBlbnRpdHlOYW1lID0gZW50aXR5TmFtZS50cmltKCk7XG4gICAgbGV0IHNlcnZpY2UgPSB0aGlzLnNlcnZpY2VzW2VudGl0eU5hbWVdO1xuICAgIGlmICghc2VydmljZSkge1xuICAgICAgc2VydmljZSA9IHRoaXMuZGVmYXVsdERhdGFTZXJ2aWNlRmFjdG9yeS5jcmVhdGUoZW50aXR5TmFtZSk7XG4gICAgICB0aGlzLnNlcnZpY2VzW2VudGl0eU5hbWVdID0gc2VydmljZTtcbiAgICB9XG4gICAgcmV0dXJuIHNlcnZpY2U7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYW4gRW50aXR5Q29sbGVjdGlvbkRhdGFTZXJ2aWNlIGZvciBhbiBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gc2VydmljZSAtIGRhdGEgc2VydmljZSBmb3IgdGhhdCBlbnRpdHkgdHlwZVxuICAgKlxuICAgKiBFeGFtcGxlczpcbiAgICogICByZWdpc3RlclNlcnZpY2UoJ0hlcm8nLCBteUhlcm9EYXRhU2VydmljZSk7XG4gICAqICAgcmVnaXN0ZXJTZXJ2aWNlKCdWaWxsYWluJywgbXlWaWxsYWluRGF0YVNlcnZpY2UpO1xuICAgKi9cbiAgcmVnaXN0ZXJTZXJ2aWNlPFQ+KFxuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICBzZXJ2aWNlOiBFbnRpdHlDb2xsZWN0aW9uRGF0YVNlcnZpY2U8VD5cbiAgKSB7XG4gICAgdGhpcy5zZXJ2aWNlc1tlbnRpdHlOYW1lLnRyaW0oKV0gPSBzZXJ2aWNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgYmF0Y2ggb2YgZGF0YSBzZXJ2aWNlcy5cbiAgICogQHBhcmFtIHNlcnZpY2VzIC0gZGF0YSBzZXJ2aWNlcyB0byBtZXJnZSBpbnRvIGV4aXN0aW5nIHNlcnZpY2VzXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIHJlZ2lzdGVyU2VydmljZXMoe1xuICAgKiAgICAgSGVybzogbXlIZXJvRGF0YVNlcnZpY2UsXG4gICAqICAgICBWaWxsYWluOiBteVZpbGxhaW5EYXRhU2VydmljZVxuICAgKiAgIH0pO1xuICAgKi9cbiAgcmVnaXN0ZXJTZXJ2aWNlcyhzZXJ2aWNlczoge1xuICAgIFtuYW1lOiBzdHJpbmddOiBFbnRpdHlDb2xsZWN0aW9uRGF0YVNlcnZpY2U8YW55PjtcbiAgfSkge1xuICAgIHRoaXMuc2VydmljZXMgPSB7IC4uLnRoaXMuc2VydmljZXMsIC4uLnNlcnZpY2VzIH07XG4gIH1cbn1cbiJdfQ==