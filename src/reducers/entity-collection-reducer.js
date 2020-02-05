(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/reducers/entity-collection-reducer", ["require", "exports", "tslib", "@angular/core", "@ngrx/data/src/reducers/entity-collection-reducer-methods"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@angular/core");
    const entity_collection_reducer_methods_1 = require("@ngrx/data/src/reducers/entity-collection-reducer-methods");
    /** Create a default reducer for a specific entity collection */
    let EntityCollectionReducerFactory = class EntityCollectionReducerFactory {
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
    };
    EntityCollectionReducerFactory = tslib_1.__decorate([
        core_1.Injectable(),
        tslib_1.__metadata("design:paramtypes", [entity_collection_reducer_methods_1.EntityCollectionReducerMethodsFactory])
    ], EntityCollectionReducerFactory);
    exports.EntityCollectionReducerFactory = EntityCollectionReducerFactory;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQSx3Q0FBMkM7SUFJM0MsaUhBQTRGO0lBTzVGLGdFQUFnRTtJQUVoRSxJQUFhLDhCQUE4QixHQUEzQyxNQUFhLDhCQUE4QjtRQUN6QyxZQUFvQixjQUFxRDtZQUFyRCxtQkFBYyxHQUFkLGNBQWMsQ0FBdUM7UUFBRyxDQUFDO1FBRTdFLGlFQUFpRTtRQUNqRSxNQUFNLENBQVUsVUFBa0I7WUFDaEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUksVUFBVSxDQUFDLENBQUM7WUFFMUQsZ0ZBQWdGO1lBQ2hGLE9BQU8sU0FBUyx1QkFBdUIsQ0FDckMsVUFBK0IsRUFDL0IsTUFBb0I7Z0JBRXBCLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN2RCxPQUFPLGFBQWEsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1lBQ3hFLENBQUMsQ0FBQztRQUNKLENBQUM7S0FDRixDQUFBO0lBaEJZLDhCQUE4QjtRQUQxQyxpQkFBVSxFQUFFO2lEQUV5Qix5RUFBcUM7T0FEOUQsOEJBQThCLENBZ0IxQztJQWhCWSx3RUFBOEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlck1ldGhvZHNGYWN0b3J5IH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1yZWR1Y2VyLW1ldGhvZHMnO1xuXG5leHBvcnQgdHlwZSBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcjxUID0gYW55PiA9IChcbiAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgYWN0aW9uOiBFbnRpdHlBY3Rpb25cbikgPT4gRW50aXR5Q29sbGVjdGlvbjxUPjtcblxuLyoqIENyZWF0ZSBhIGRlZmF1bHQgcmVkdWNlciBmb3IgYSBzcGVjaWZpYyBlbnRpdHkgY29sbGVjdGlvbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyRmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbWV0aG9kc0ZhY3Rvcnk6IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kc0ZhY3RvcnkpIHt9XG5cbiAgLyoqIENyZWF0ZSBhIGRlZmF1bHQgcmVkdWNlciBmb3IgYSBjb2xsZWN0aW9uIG9mIGVudGl0aWVzIG9mIFQgKi9cbiAgY3JlYXRlPFQgPSBhbnk+KGVudGl0eU5hbWU6IHN0cmluZyk6IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyPFQ+IHtcbiAgICBjb25zdCBtZXRob2RzID0gdGhpcy5tZXRob2RzRmFjdG9yeS5jcmVhdGU8VD4oZW50aXR5TmFtZSk7XG5cbiAgICAvKiogUGVyZm9ybSBBY3Rpb25zIGFnYWluc3QgYSBwYXJ0aWN1bGFyIGVudGl0eSBjb2xsZWN0aW9uIGluIHRoZSBFbnRpdHlDYWNoZSAqL1xuICAgIHJldHVybiBmdW5jdGlvbiBlbnRpdHlDb2xsZWN0aW9uUmVkdWNlcihcbiAgICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgICBhY3Rpb246IEVudGl0eUFjdGlvblxuICAgICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgICAgY29uc3QgcmVkdWNlck1ldGhvZCA9IG1ldGhvZHNbYWN0aW9uLnBheWxvYWQuZW50aXR5T3BdO1xuICAgICAgcmV0dXJuIHJlZHVjZXJNZXRob2QgPyByZWR1Y2VyTWV0aG9kKGNvbGxlY3Rpb24sIGFjdGlvbikgOiBjb2xsZWN0aW9uO1xuICAgIH07XG4gIH1cbn1cbiJdfQ==