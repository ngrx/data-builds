import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class DefaultLogger {
    error(message, extra) {
        if (message) {
            if (extra) {
                console.error(message, extra);
            }
            else {
                console.error(message);
            }
        }
    }
    log(message, extra) {
        if (message) {
            if (extra) {
                console.log(message, extra);
            }
            else {
                console.log(message);
            }
        }
    }
    warn(message, extra) {
        if (message) {
            if (extra) {
                console.warn(message, extra);
            }
            else {
                console.warn(message);
            }
        }
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: DefaultLogger, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: DefaultLogger }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: DefaultLogger, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1sb2dnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3V0aWxzL2RlZmF1bHQtbG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBSTNDLE1BQU0sT0FBTyxhQUFhO0lBQ3hCLEtBQUssQ0FBQyxPQUFhLEVBQUUsS0FBVztRQUM5QixJQUFJLE9BQU8sRUFBRSxDQUFDO1lBQ1osSUFBSSxLQUFLLEVBQUUsQ0FBQztnQkFDVixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNoQyxDQUFDO2lCQUFNLENBQUM7Z0JBQ04sT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFRCxHQUFHLENBQUMsT0FBYSxFQUFFLEtBQVc7UUFDNUIsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUNaLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDOUIsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdkIsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRUQsSUFBSSxDQUFDLE9BQWEsRUFBRSxLQUFXO1FBQzdCLElBQUksT0FBTyxFQUFFLENBQUM7WUFDWixJQUFJLEtBQUssRUFBRSxDQUFDO2dCQUNWLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQy9CLENBQUM7aUJBQU0sQ0FBQztnQkFDTixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3hCLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztpSUE3QlUsYUFBYTtxSUFBYixhQUFhOzsyRkFBYixhQUFhO2tCQUR6QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERlZmF1bHRMb2dnZXIgaW1wbGVtZW50cyBMb2dnZXIge1xuICBlcnJvcihtZXNzYWdlPzogYW55LCBleHRyYT86IGFueSkge1xuICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICBpZiAoZXh0cmEpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlLCBleHRyYSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGxvZyhtZXNzYWdlPzogYW55LCBleHRyYT86IGFueSkge1xuICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICBpZiAoZXh0cmEpIHtcbiAgICAgICAgY29uc29sZS5sb2cobWVzc2FnZSwgZXh0cmEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgd2FybihtZXNzYWdlPzogYW55LCBleHRyYT86IGFueSkge1xuICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICBpZiAoZXh0cmEpIHtcbiAgICAgICAgY29uc29sZS53YXJuKG1lc3NhZ2UsIGV4dHJhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybihtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==