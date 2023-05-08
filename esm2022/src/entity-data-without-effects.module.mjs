import { NgModule } from '@angular/core';
import { BASE_ENTITY_DATA_PROVIDERS, provideEntityDataConfig, } from './provide-entity-data';
import * as i0 from "@angular/core";
/**
 * Module without effects or dataservices which means no HTTP calls
 * This module helpful for internal testing.
 * Also helpful for apps that handle server access on their own and
 * therefore opt-out of @ngrx/effects for entities
 */
class EntityDataModuleWithoutEffects {
    static forRoot(config) {
        return {
            ngModule: EntityDataModuleWithoutEffects,
            providers: [provideEntityDataConfig(config)],
        };
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityDataModuleWithoutEffects, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: EntityDataModuleWithoutEffects }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityDataModuleWithoutEffects, providers: [BASE_ENTITY_DATA_PROVIDERS] }); }
}
export { EntityDataModuleWithoutEffects };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityDataModuleWithoutEffects, decorators: [{
            type: NgModule,
            args: [{
                    providers: [BASE_ENTITY_DATA_PROVIDERS],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRhdGEtd2l0aG91dC1lZmZlY3RzLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZW50aXR5LWRhdGEtd2l0aG91dC1lZmZlY3RzLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQXVCLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU5RCxPQUFPLEVBQ0wsMEJBQTBCLEVBQzFCLHVCQUF1QixHQUN4QixNQUFNLHVCQUF1QixDQUFDOztBQUUvQjs7Ozs7R0FLRztBQUNILE1BR2EsOEJBQThCO0lBQ3pDLE1BQU0sQ0FBQyxPQUFPLENBQ1osTUFBOEI7UUFFOUIsT0FBTztZQUNMLFFBQVEsRUFBRSw4QkFBOEI7WUFDeEMsU0FBUyxFQUFFLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDN0MsQ0FBQztJQUNKLENBQUM7aUlBUlUsOEJBQThCO2tJQUE5Qiw4QkFBOEI7a0lBQTlCLDhCQUE4QixhQUY5QixDQUFDLDBCQUEwQixDQUFDOztTQUU1Qiw4QkFBOEI7MkZBQTlCLDhCQUE4QjtrQkFIMUMsUUFBUTttQkFBQztvQkFDUixTQUFTLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQztpQkFDeEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRW50aXR5RGF0YU1vZHVsZUNvbmZpZyB9IGZyb20gJy4vZW50aXR5LWRhdGEtY29uZmlnJztcbmltcG9ydCB7XG4gIEJBU0VfRU5USVRZX0RBVEFfUFJPVklERVJTLFxuICBwcm92aWRlRW50aXR5RGF0YUNvbmZpZyxcbn0gZnJvbSAnLi9wcm92aWRlLWVudGl0eS1kYXRhJztcblxuLyoqXG4gKiBNb2R1bGUgd2l0aG91dCBlZmZlY3RzIG9yIGRhdGFzZXJ2aWNlcyB3aGljaCBtZWFucyBubyBIVFRQIGNhbGxzXG4gKiBUaGlzIG1vZHVsZSBoZWxwZnVsIGZvciBpbnRlcm5hbCB0ZXN0aW5nLlxuICogQWxzbyBoZWxwZnVsIGZvciBhcHBzIHRoYXQgaGFuZGxlIHNlcnZlciBhY2Nlc3Mgb24gdGhlaXIgb3duIGFuZFxuICogdGhlcmVmb3JlIG9wdC1vdXQgb2YgQG5ncngvZWZmZWN0cyBmb3IgZW50aXRpZXNcbiAqL1xuQE5nTW9kdWxlKHtcbiAgcHJvdmlkZXJzOiBbQkFTRV9FTlRJVFlfREFUQV9QUk9WSURFUlNdLFxufSlcbmV4cG9ydCBjbGFzcyBFbnRpdHlEYXRhTW9kdWxlV2l0aG91dEVmZmVjdHMge1xuICBzdGF0aWMgZm9yUm9vdChcbiAgICBjb25maWc6IEVudGl0eURhdGFNb2R1bGVDb25maWdcbiAgKTogTW9kdWxlV2l0aFByb3ZpZGVyczxFbnRpdHlEYXRhTW9kdWxlV2l0aG91dEVmZmVjdHM+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IEVudGl0eURhdGFNb2R1bGVXaXRob3V0RWZmZWN0cyxcbiAgICAgIHByb3ZpZGVyczogW3Byb3ZpZGVFbnRpdHlEYXRhQ29uZmlnKGNvbmZpZyldLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==