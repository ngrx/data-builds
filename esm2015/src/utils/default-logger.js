/**
 * @fileoverview added by tsickle
 * Generated from: modules/data/src/utils/default-logger.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
export class DefaultLogger {
    /**
     * @param {?=} message
     * @param {?=} extra
     * @return {?}
     */
    error(message, extra) {
        if (message) {
            extra ? console.error(message, extra) : console.error(message);
        }
    }
    /**
     * @param {?=} message
     * @param {?=} extra
     * @return {?}
     */
    log(message, extra) {
        if (message) {
            extra ? console.log(message, extra) : console.log(message);
        }
    }
    /**
     * @param {?=} message
     * @param {?=} extra
     * @return {?}
     */
    warn(message, extra) {
        if (message) {
            extra ? console.warn(message, extra) : console.warn(message);
        }
    }
}
DefaultLogger.decorators = [
    { type: Injectable }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1sb2dnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3V0aWxzL2RlZmF1bHQtbG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUkzQyxNQUFNLE9BQU8sYUFBYTs7Ozs7O0lBQ3hCLEtBQUssQ0FBQyxPQUFhLEVBQUUsS0FBVztRQUM5QixJQUFJLE9BQU8sRUFBRTtZQUNYLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDaEU7SUFDSCxDQUFDOzs7Ozs7SUFFRCxHQUFHLENBQUMsT0FBYSxFQUFFLEtBQVc7UUFDNUIsSUFBSSxPQUFPLEVBQUU7WUFDWCxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzVEO0lBQ0gsQ0FBQzs7Ozs7O0lBRUQsSUFBSSxDQUFDLE9BQWEsRUFBRSxLQUFXO1FBQzdCLElBQUksT0FBTyxFQUFFO1lBQ1gsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM5RDtJQUNILENBQUM7OztZQWxCRixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERlZmF1bHRMb2dnZXIgaW1wbGVtZW50cyBMb2dnZXIge1xuICBlcnJvcihtZXNzYWdlPzogYW55LCBleHRyYT86IGFueSkge1xuICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICBleHRyYSA/IGNvbnNvbGUuZXJyb3IobWVzc2FnZSwgZXh0cmEpIDogY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICBsb2cobWVzc2FnZT86IGFueSwgZXh0cmE/OiBhbnkpIHtcbiAgICBpZiAobWVzc2FnZSkge1xuICAgICAgZXh0cmEgPyBjb25zb2xlLmxvZyhtZXNzYWdlLCBleHRyYSkgOiBjb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICB3YXJuKG1lc3NhZ2U/OiBhbnksIGV4dHJhPzogYW55KSB7XG4gICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgIGV4dHJhID8gY29uc29sZS53YXJuKG1lc3NhZ2UsIGV4dHJhKSA6IGNvbnNvbGUud2FybihtZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==