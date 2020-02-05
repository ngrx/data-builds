(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/entity-metadata/entity-definition", ["require", "exports", "@ngrx/entity", "@ngrx/data/src/utils/utilities"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const entity_1 = require("@ngrx/entity");
    const utilities_1 = require("@ngrx/data/src/utils/utilities");
    function createEntityDefinition(metadata) {
        let entityName = metadata.entityName;
        if (!entityName) {
            throw new Error('Missing required entityName');
        }
        metadata.entityName = entityName = entityName.trim();
        const selectId = metadata.selectId || utilities_1.defaultSelectId;
        const sortComparer = (metadata.sortComparer = metadata.sortComparer || false);
        const entityAdapter = entity_1.createEntityAdapter({ selectId, sortComparer });
        const entityDispatcherOptions = metadata.entityDispatcherOptions || {};
        const initialState = entityAdapter.getInitialState(Object.assign({ entityName, filter: '', loaded: false, loading: false, changeState: {} }, (metadata.additionalCollectionState || {})));
        const noChangeTracking = metadata.noChangeTracking === true; // false by default
        return {
            entityName,
            entityAdapter,
            entityDispatcherOptions,
            initialState,
            metadata,
            noChangeTracking,
            selectId,
            sortComparer,
        };
    }
    exports.createEntityDefinition = createEntityDefinition;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRlZmluaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktZGVmaW5pdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBLHlDQUFrRTtJQUlsRSw4REFBcUQ7SUFlckQsU0FBZ0Isc0JBQXNCLENBQ3BDLFFBQThCO1FBRTlCLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUM7UUFDckMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztTQUNoRDtRQUNELFFBQVEsQ0FBQyxVQUFVLEdBQUcsVUFBVSxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNyRCxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxJQUFJLDJCQUFlLENBQUM7UUFDdEQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxRQUFRLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLElBQUksS0FBSyxDQUFDLENBQUM7UUFFOUUsTUFBTSxhQUFhLEdBQUcsNEJBQW1CLENBQUksRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztRQUV6RSxNQUFNLHVCQUF1QixHQUMzQixRQUFRLENBQUMsdUJBQXVCLElBQUksRUFBRSxDQUFDO1FBRXpDLE1BQU0sWUFBWSxHQUF3QixhQUFhLENBQUMsZUFBZSxpQkFDckUsVUFBVSxFQUNWLE1BQU0sRUFBRSxFQUFFLEVBQ1YsTUFBTSxFQUFFLEtBQUssRUFDYixPQUFPLEVBQUUsS0FBSyxFQUNkLFdBQVcsRUFBRSxFQUFFLElBQ1osQ0FBQyxRQUFRLENBQUMseUJBQXlCLElBQUksRUFBRSxDQUFDLEVBQzdDLENBQUM7UUFFSCxNQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsS0FBSyxJQUFJLENBQUMsQ0FBQyxtQkFBbUI7UUFFaEYsT0FBTztZQUNMLFVBQVU7WUFDVixhQUFhO1lBQ2IsdUJBQXVCO1lBQ3ZCLFlBQVk7WUFDWixRQUFRO1lBQ1IsZ0JBQWdCO1lBQ2hCLFFBQVE7WUFDUixZQUFZO1NBQ2IsQ0FBQztJQUNKLENBQUM7SUFyQ0Qsd0RBcUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRW50aXR5QWRhcHRlciwgY3JlYXRlRW50aXR5QWRhcHRlciB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5pbXBvcnQgeyBDb21wYXJlciwgSWRTZWxlY3RvciB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyB9IGZyb20gJy4uL2Rpc3BhdGNoZXJzL2VudGl0eS1kaXNwYXRjaGVyLWRlZmF1bHQtb3B0aW9ucyc7XG5pbXBvcnQgeyBkZWZhdWx0U2VsZWN0SWQgfSBmcm9tICcuLi91dGlscy91dGlsaXRpZXMnO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbiB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVudGl0eU1ldGFkYXRhIH0gZnJvbSAnLi9lbnRpdHktbWV0YWRhdGEnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eURlZmluaXRpb248VCA9IGFueT4ge1xuICBlbnRpdHlOYW1lOiBzdHJpbmc7XG4gIGVudGl0eUFkYXB0ZXI6IEVudGl0eUFkYXB0ZXI8VD47XG4gIGVudGl0eURpc3BhdGNoZXJPcHRpb25zPzogUGFydGlhbDxFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnM+O1xuICBpbml0aWFsU3RhdGU6IEVudGl0eUNvbGxlY3Rpb248VD47XG4gIG1ldGFkYXRhOiBFbnRpdHlNZXRhZGF0YTxUPjtcbiAgbm9DaGFuZ2VUcmFja2luZzogYm9vbGVhbjtcbiAgc2VsZWN0SWQ6IElkU2VsZWN0b3I8VD47XG4gIHNvcnRDb21wYXJlcjogZmFsc2UgfCBDb21wYXJlcjxUPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVudGl0eURlZmluaXRpb248VCwgUyBleHRlbmRzIG9iamVjdD4oXG4gIG1ldGFkYXRhOiBFbnRpdHlNZXRhZGF0YTxULCBTPlxuKTogRW50aXR5RGVmaW5pdGlvbjxUPiB7XG4gIGxldCBlbnRpdHlOYW1lID0gbWV0YWRhdGEuZW50aXR5TmFtZTtcbiAgaWYgKCFlbnRpdHlOYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHJlcXVpcmVkIGVudGl0eU5hbWUnKTtcbiAgfVxuICBtZXRhZGF0YS5lbnRpdHlOYW1lID0gZW50aXR5TmFtZSA9IGVudGl0eU5hbWUudHJpbSgpO1xuICBjb25zdCBzZWxlY3RJZCA9IG1ldGFkYXRhLnNlbGVjdElkIHx8IGRlZmF1bHRTZWxlY3RJZDtcbiAgY29uc3Qgc29ydENvbXBhcmVyID0gKG1ldGFkYXRhLnNvcnRDb21wYXJlciA9IG1ldGFkYXRhLnNvcnRDb21wYXJlciB8fCBmYWxzZSk7XG5cbiAgY29uc3QgZW50aXR5QWRhcHRlciA9IGNyZWF0ZUVudGl0eUFkYXB0ZXI8VD4oeyBzZWxlY3RJZCwgc29ydENvbXBhcmVyIH0pO1xuXG4gIGNvbnN0IGVudGl0eURpc3BhdGNoZXJPcHRpb25zOiBQYXJ0aWFsPEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucz4gPVxuICAgIG1ldGFkYXRhLmVudGl0eURpc3BhdGNoZXJPcHRpb25zIHx8IHt9O1xuXG4gIGNvbnN0IGluaXRpYWxTdGF0ZTogRW50aXR5Q29sbGVjdGlvbjxUPiA9IGVudGl0eUFkYXB0ZXIuZ2V0SW5pdGlhbFN0YXRlKHtcbiAgICBlbnRpdHlOYW1lLFxuICAgIGZpbHRlcjogJycsXG4gICAgbG9hZGVkOiBmYWxzZSxcbiAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICBjaGFuZ2VTdGF0ZToge30sXG4gICAgLi4uKG1ldGFkYXRhLmFkZGl0aW9uYWxDb2xsZWN0aW9uU3RhdGUgfHwge30pLFxuICB9KTtcblxuICBjb25zdCBub0NoYW5nZVRyYWNraW5nID0gbWV0YWRhdGEubm9DaGFuZ2VUcmFja2luZyA9PT0gdHJ1ZTsgLy8gZmFsc2UgYnkgZGVmYXVsdFxuXG4gIHJldHVybiB7XG4gICAgZW50aXR5TmFtZSxcbiAgICBlbnRpdHlBZGFwdGVyLFxuICAgIGVudGl0eURpc3BhdGNoZXJPcHRpb25zLFxuICAgIGluaXRpYWxTdGF0ZSxcbiAgICBtZXRhZGF0YSxcbiAgICBub0NoYW5nZVRyYWNraW5nLFxuICAgIHNlbGVjdElkLFxuICAgIHNvcnRDb21wYXJlcixcbiAgfTtcbn1cbiJdfQ==