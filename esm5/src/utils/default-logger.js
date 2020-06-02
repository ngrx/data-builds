/**
 * @fileoverview added by tsickle
 * Generated from: src/utils/default-logger.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
var DefaultLogger = /** @class */ (function () {
    function DefaultLogger() {
    }
    /**
     * @param {?=} message
     * @param {?=} extra
     * @return {?}
     */
    DefaultLogger.prototype.error = /**
     * @param {?=} message
     * @param {?=} extra
     * @return {?}
     */
    function (message, extra) {
        if (message) {
            extra ? console.error(message, extra) : console.error(message);
        }
    };
    /**
     * @param {?=} message
     * @param {?=} extra
     * @return {?}
     */
    DefaultLogger.prototype.log = /**
     * @param {?=} message
     * @param {?=} extra
     * @return {?}
     */
    function (message, extra) {
        if (message) {
            extra ? console.log(message, extra) : console.log(message);
        }
    };
    /**
     * @param {?=} message
     * @param {?=} extra
     * @return {?}
     */
    DefaultLogger.prototype.warn = /**
     * @param {?=} message
     * @param {?=} extra
     * @return {?}
     */
    function (message, extra) {
        if (message) {
            extra ? console.warn(message, extra) : console.warn(message);
        }
    };
    DefaultLogger.decorators = [
        { type: Injectable }
    ];
    return DefaultLogger;
}());
export { DefaultLogger };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1sb2dnZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdyeC9kYXRhLyIsInNvdXJjZXMiOlsic3JjL3V0aWxzL2RlZmF1bHQtbG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUczQztJQUFBO0lBbUJBLENBQUM7Ozs7OztJQWpCQyw2QkFBSzs7Ozs7SUFBTCxVQUFNLE9BQWEsRUFBRSxLQUFXO1FBQzlCLElBQUksT0FBTyxFQUFFO1lBQ1gsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNoRTtJQUNILENBQUM7Ozs7OztJQUVELDJCQUFHOzs7OztJQUFILFVBQUksT0FBYSxFQUFFLEtBQVc7UUFDNUIsSUFBSSxPQUFPLEVBQUU7WUFDWCxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzVEO0lBQ0gsQ0FBQzs7Ozs7O0lBRUQsNEJBQUk7Ozs7O0lBQUosVUFBSyxPQUFhLEVBQUUsS0FBVztRQUM3QixJQUFJLE9BQU8sRUFBRTtZQUNYLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDOUQ7SUFDSCxDQUFDOztnQkFsQkYsVUFBVTs7SUFtQlgsb0JBQUM7Q0FBQSxBQW5CRCxJQW1CQztTQWxCWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERlZmF1bHRMb2dnZXIgaW1wbGVtZW50cyBMb2dnZXIge1xuICBlcnJvcihtZXNzYWdlPzogYW55LCBleHRyYT86IGFueSkge1xuICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICBleHRyYSA/IGNvbnNvbGUuZXJyb3IobWVzc2FnZSwgZXh0cmEpIDogY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICBsb2cobWVzc2FnZT86IGFueSwgZXh0cmE/OiBhbnkpIHtcbiAgICBpZiAobWVzc2FnZSkge1xuICAgICAgZXh0cmEgPyBjb25zb2xlLmxvZyhtZXNzYWdlLCBleHRyYSkgOiBjb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICB3YXJuKG1lc3NhZ2U/OiBhbnksIGV4dHJhPzogYW55KSB7XG4gICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgIGV4dHJhID8gY29uc29sZS53YXJuKG1lc3NhZ2UsIGV4dHJhKSA6IGNvbnNvbGUud2FybihtZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==