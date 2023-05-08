import { NgModule } from '@angular/core';
import { EntityDataModuleWithoutEffects } from './entity-data-without-effects.module';
import { ENTITY_DATA_EFFECTS_PROVIDERS, provideEntityDataConfig, } from './provide-entity-data';
import * as i0 from "@angular/core";
/**
 * entity-data main module includes effects and HTTP data services
 * Configure with `forRoot`.
 * No `forFeature` yet.
 */
class EntityDataModule {
    static forRoot(config) {
        return {
            ngModule: EntityDataModule,
            providers: [provideEntityDataConfig(config)],
        };
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityDataModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: EntityDataModule, imports: [EntityDataModuleWithoutEffects] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityDataModule, providers: [ENTITY_DATA_EFFECTS_PROVIDERS], imports: [EntityDataModuleWithoutEffects] }); }
}
export { EntityDataModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityDataModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [EntityDataModuleWithoutEffects],
                    providers: [ENTITY_DATA_EFFECTS_PROVIDERS],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRhdGEubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktZGF0YS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF1QixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFOUQsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDdEYsT0FBTyxFQUNMLDZCQUE2QixFQUM3Qix1QkFBdUIsR0FDeEIsTUFBTSx1QkFBdUIsQ0FBQzs7QUFFL0I7Ozs7R0FJRztBQUNILE1BSWEsZ0JBQWdCO0lBQzNCLE1BQU0sQ0FBQyxPQUFPLENBQ1osTUFBOEI7UUFFOUIsT0FBTztZQUNMLFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsU0FBUyxFQUFFLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDN0MsQ0FBQztJQUNKLENBQUM7aUlBUlUsZ0JBQWdCO2tJQUFoQixnQkFBZ0IsWUFIakIsOEJBQThCO2tJQUc3QixnQkFBZ0IsYUFGaEIsQ0FBQyw2QkFBNkIsQ0FBQyxZQURoQyw4QkFBOEI7O1NBRzdCLGdCQUFnQjsyRkFBaEIsZ0JBQWdCO2tCQUo1QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLDhCQUE4QixDQUFDO29CQUN6QyxTQUFTLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQztpQkFDM0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRW50aXR5RGF0YU1vZHVsZUNvbmZpZyB9IGZyb20gJy4vZW50aXR5LWRhdGEtY29uZmlnJztcbmltcG9ydCB7IEVudGl0eURhdGFNb2R1bGVXaXRob3V0RWZmZWN0cyB9IGZyb20gJy4vZW50aXR5LWRhdGEtd2l0aG91dC1lZmZlY3RzLm1vZHVsZSc7XG5pbXBvcnQge1xuICBFTlRJVFlfREFUQV9FRkZFQ1RTX1BST1ZJREVSUyxcbiAgcHJvdmlkZUVudGl0eURhdGFDb25maWcsXG59IGZyb20gJy4vcHJvdmlkZS1lbnRpdHktZGF0YSc7XG5cbi8qKlxuICogZW50aXR5LWRhdGEgbWFpbiBtb2R1bGUgaW5jbHVkZXMgZWZmZWN0cyBhbmQgSFRUUCBkYXRhIHNlcnZpY2VzXG4gKiBDb25maWd1cmUgd2l0aCBgZm9yUm9vdGAuXG4gKiBObyBgZm9yRmVhdHVyZWAgeWV0LlxuICovXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbRW50aXR5RGF0YU1vZHVsZVdpdGhvdXRFZmZlY3RzXSxcbiAgcHJvdmlkZXJzOiBbRU5USVRZX0RBVEFfRUZGRUNUU19QUk9WSURFUlNdLFxufSlcbmV4cG9ydCBjbGFzcyBFbnRpdHlEYXRhTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3QoXG4gICAgY29uZmlnOiBFbnRpdHlEYXRhTW9kdWxlQ29uZmlnXG4gICk6IE1vZHVsZVdpdGhQcm92aWRlcnM8RW50aXR5RGF0YU1vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogRW50aXR5RGF0YU1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW3Byb3ZpZGVFbnRpdHlEYXRhQ29uZmlnKGNvbmZpZyldLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==