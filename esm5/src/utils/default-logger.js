import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
var DefaultLogger = /** @class */ (function () {
    function DefaultLogger() {
    }
    DefaultLogger.prototype.error = function (message, extra) {
        if (message) {
            extra ? console.error(message, extra) : console.error(message);
        }
    };
    DefaultLogger.prototype.log = function (message, extra) {
        if (message) {
            extra ? console.log(message, extra) : console.log(message);
        }
    };
    DefaultLogger.prototype.warn = function (message, extra) {
        if (message) {
            extra ? console.warn(message, extra) : console.warn(message);
        }
    };
    DefaultLogger = tslib_1.__decorate([
        Injectable()
    ], DefaultLogger);
    return DefaultLogger;
}());
export { DefaultLogger };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1sb2dnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3V0aWxzL2RlZmF1bHQtbG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSTNDO0lBQUE7SUFrQkEsQ0FBQztJQWpCQyw2QkFBSyxHQUFMLFVBQU0sT0FBYSxFQUFFLEtBQVc7UUFDOUIsSUFBSSxPQUFPLEVBQUU7WUFDWCxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2hFO0lBQ0gsQ0FBQztJQUVELDJCQUFHLEdBQUgsVUFBSSxPQUFhLEVBQUUsS0FBVztRQUM1QixJQUFJLE9BQU8sRUFBRTtZQUNYLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDNUQ7SUFDSCxDQUFDO0lBRUQsNEJBQUksR0FBSixVQUFLLE9BQWEsRUFBRSxLQUFXO1FBQzdCLElBQUksT0FBTyxFQUFFO1lBQ1gsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM5RDtJQUNILENBQUM7SUFqQlUsYUFBYTtRQUR6QixVQUFVLEVBQUU7T0FDQSxhQUFhLENBa0J6QjtJQUFELG9CQUFDO0NBQUEsQUFsQkQsSUFrQkM7U0FsQlksYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEZWZhdWx0TG9nZ2VyIGltcGxlbWVudHMgTG9nZ2VyIHtcbiAgZXJyb3IobWVzc2FnZT86IGFueSwgZXh0cmE/OiBhbnkpIHtcbiAgICBpZiAobWVzc2FnZSkge1xuICAgICAgZXh0cmEgPyBjb25zb2xlLmVycm9yKG1lc3NhZ2UsIGV4dHJhKSA6IGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgbG9nKG1lc3NhZ2U/OiBhbnksIGV4dHJhPzogYW55KSB7XG4gICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgIGV4dHJhID8gY29uc29sZS5sb2cobWVzc2FnZSwgZXh0cmEpIDogY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgd2FybihtZXNzYWdlPzogYW55LCBleHRyYT86IGFueSkge1xuICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICBleHRyYSA/IGNvbnNvbGUud2FybihtZXNzYWdlLCBleHRyYSkgOiBjb25zb2xlLndhcm4obWVzc2FnZSk7XG4gICAgfVxuICB9XG59XG4iXX0=