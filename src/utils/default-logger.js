(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/utils/default-logger", ["require", "exports", "tslib", "@angular/core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@angular/core");
    let DefaultLogger = class DefaultLogger {
        error(message, extra) {
            if (message) {
                extra ? console.error(message, extra) : console.error(message);
            }
        }
        log(message, extra) {
            if (message) {
                extra ? console.log(message, extra) : console.log(message);
            }
        }
        warn(message, extra) {
            if (message) {
                extra ? console.warn(message, extra) : console.warn(message);
            }
        }
    };
    DefaultLogger = tslib_1.__decorate([
        core_1.Injectable()
    ], DefaultLogger);
    exports.DefaultLogger = DefaultLogger;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1sb2dnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3V0aWxzL2RlZmF1bHQtbG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUFBLHdDQUEyQztJQUkzQyxJQUFhLGFBQWEsR0FBMUIsTUFBYSxhQUFhO1FBQ3hCLEtBQUssQ0FBQyxPQUFhLEVBQUUsS0FBVztZQUM5QixJQUFJLE9BQU8sRUFBRTtnQkFDWCxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ2hFO1FBQ0gsQ0FBQztRQUVELEdBQUcsQ0FBQyxPQUFhLEVBQUUsS0FBVztZQUM1QixJQUFJLE9BQU8sRUFBRTtnQkFDWCxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzVEO1FBQ0gsQ0FBQztRQUVELElBQUksQ0FBQyxPQUFhLEVBQUUsS0FBVztZQUM3QixJQUFJLE9BQU8sRUFBRTtnQkFDWCxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzlEO1FBQ0gsQ0FBQztLQUNGLENBQUE7SUFsQlksYUFBYTtRQUR6QixpQkFBVSxFQUFFO09BQ0EsYUFBYSxDQWtCekI7SUFsQlksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGVmYXVsdExvZ2dlciBpbXBsZW1lbnRzIExvZ2dlciB7XG4gIGVycm9yKG1lc3NhZ2U/OiBhbnksIGV4dHJhPzogYW55KSB7XG4gICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgIGV4dHJhID8gY29uc29sZS5lcnJvcihtZXNzYWdlLCBleHRyYSkgOiBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIGxvZyhtZXNzYWdlPzogYW55LCBleHRyYT86IGFueSkge1xuICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICBleHRyYSA/IGNvbnNvbGUubG9nKG1lc3NhZ2UsIGV4dHJhKSA6IGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIHdhcm4obWVzc2FnZT86IGFueSwgZXh0cmE/OiBhbnkpIHtcbiAgICBpZiAobWVzc2FnZSkge1xuICAgICAgZXh0cmEgPyBjb25zb2xlLndhcm4obWVzc2FnZSwgZXh0cmEpIDogY29uc29sZS53YXJuKG1lc3NhZ2UpO1xuICAgIH1cbiAgfVxufVxuIl19