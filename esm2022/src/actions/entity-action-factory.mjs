import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
class EntityActionFactory {
    // polymorphic create for the two signatures
    create(nameOrPayload, entityOp, data, options) {
        const payload = typeof nameOrPayload === 'string'
            ? {
                ...(options || {}),
                entityName: nameOrPayload,
                entityOp,
                data,
            }
            : nameOrPayload;
        return this.createCore(payload);
    }
    /**
     * Create an EntityAction to perform an operation (op) for a particular entity type
     * (entityName) with optional data and other optional flags
     * @param payload Defines the EntityAction and its options
     */
    createCore(payload) {
        const { entityName, entityOp, tag } = payload;
        if (!entityName) {
            throw new Error('Missing entity name for new action');
        }
        if (entityOp == null) {
            throw new Error('Missing EntityOp for new action');
        }
        const type = this.formatActionType(entityOp, tag || entityName);
        return { type, payload };
    }
    /**
     * Create an EntityAction from another EntityAction, replacing properties with those from newPayload;
     * @param from Source action that is the base for the new action
     * @param newProperties New EntityAction properties that replace the source action properties
     */
    createFromAction(from, newProperties) {
        return this.create({ ...from.payload, ...newProperties });
    }
    formatActionType(op, tag) {
        return `[${tag}] ${op}`;
        // return `${op} [${tag}]`.toUpperCase(); // example of an alternative
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityActionFactory, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityActionFactory }); }
}
export { EntityActionFactory };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: EntityActionFactory, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWFjdGlvbi1mYWN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9hY3Rpb25zL2VudGl0eS1hY3Rpb24tZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQVEzQyxNQUNhLG1CQUFtQjtJQXVCOUIsNENBQTRDO0lBQzVDLE1BQU0sQ0FDSixhQUE4QyxFQUM5QyxRQUFtQixFQUNuQixJQUFRLEVBQ1IsT0FBNkI7UUFFN0IsTUFBTSxPQUFPLEdBQ1gsT0FBTyxhQUFhLEtBQUssUUFBUTtZQUMvQixDQUFDLENBQUU7Z0JBQ0MsR0FBRyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7Z0JBQ2xCLFVBQVUsRUFBRSxhQUFhO2dCQUN6QixRQUFRO2dCQUNSLElBQUk7YUFDc0I7WUFDOUIsQ0FBQyxDQUFDLGFBQWEsQ0FBQztRQUNwQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDTyxVQUFVLENBQVUsT0FBK0I7UUFDM0QsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBQzlDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDZixNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7U0FDdkQ7UUFDRCxJQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUU7WUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1NBQ3BEO1FBQ0QsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksVUFBVSxDQUFDLENBQUM7UUFDaEUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGdCQUFnQixDQUNkLElBQWtCLEVBQ2xCLGFBQThDO1FBRTlDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLGFBQWEsRUFBRSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVELGdCQUFnQixDQUFDLEVBQVUsRUFBRSxHQUFXO1FBQ3RDLE9BQU8sSUFBSSxHQUFHLEtBQUssRUFBRSxFQUFFLENBQUM7UUFDeEIsc0VBQXNFO0lBQ3hFLENBQUM7aUlBMUVVLG1CQUFtQjtxSUFBbkIsbUJBQW1COztTQUFuQixtQkFBbUI7MkZBQW5CLG1CQUFtQjtrQkFEL0IsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRW50aXR5T3AgfSBmcm9tICcuL2VudGl0eS1vcCc7XG5pbXBvcnQge1xuICBFbnRpdHlBY3Rpb24sXG4gIEVudGl0eUFjdGlvbk9wdGlvbnMsXG4gIEVudGl0eUFjdGlvblBheWxvYWQsXG59IGZyb20gJy4vZW50aXR5LWFjdGlvbic7XG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5QWN0aW9uRmFjdG9yeSB7XG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gRW50aXR5QWN0aW9uIHRvIHBlcmZvcm0gYW4gb3BlcmF0aW9uIChvcCkgZm9yIGEgcGFydGljdWxhciBlbnRpdHkgdHlwZVxuICAgKiAoZW50aXR5TmFtZSkgd2l0aCBvcHRpb25hbCBkYXRhIGFuZCBvdGhlciBvcHRpb25hbCBmbGFnc1xuICAgKiBAcGFyYW0gZW50aXR5TmFtZSBOYW1lIG9mIHRoZSBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gZW50aXR5T3AgT3BlcmF0aW9uIHRvIHBlcmZvcm0gKEVudGl0eU9wKVxuICAgKiBAcGFyYW0gW2RhdGFdIGRhdGEgZm9yIHRoZSBvcGVyYXRpb25cbiAgICogQHBhcmFtIFtvcHRpb25zXSBhZGRpdGlvbmFsIG9wdGlvbnNcbiAgICovXG4gIGNyZWF0ZTxQID0gYW55PihcbiAgICBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgZW50aXR5T3A6IEVudGl0eU9wLFxuICAgIGRhdGE/OiBQLFxuICAgIG9wdGlvbnM/OiBFbnRpdHlBY3Rpb25PcHRpb25zXG4gICk6IEVudGl0eUFjdGlvbjxQPjtcblxuICAvKipcbiAgICogQ3JlYXRlIGFuIEVudGl0eUFjdGlvbiB0byBwZXJmb3JtIGFuIG9wZXJhdGlvbiAob3ApIGZvciBhIHBhcnRpY3VsYXIgZW50aXR5IHR5cGVcbiAgICogKGVudGl0eU5hbWUpIHdpdGggb3B0aW9uYWwgZGF0YSBhbmQgb3RoZXIgb3B0aW9uYWwgZmxhZ3NcbiAgICogQHBhcmFtIHBheWxvYWQgRGVmaW5lcyB0aGUgRW50aXR5QWN0aW9uIGFuZCBpdHMgb3B0aW9uc1xuICAgKi9cbiAgY3JlYXRlPFAgPSBhbnk+KHBheWxvYWQ6IEVudGl0eUFjdGlvblBheWxvYWQ8UD4pOiBFbnRpdHlBY3Rpb248UD47XG5cbiAgLy8gcG9seW1vcnBoaWMgY3JlYXRlIGZvciB0aGUgdHdvIHNpZ25hdHVyZXNcbiAgY3JlYXRlPFAgPSBhbnk+KFxuICAgIG5hbWVPclBheWxvYWQ6IEVudGl0eUFjdGlvblBheWxvYWQ8UD4gfCBzdHJpbmcsXG4gICAgZW50aXR5T3A/OiBFbnRpdHlPcCxcbiAgICBkYXRhPzogUCxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBFbnRpdHlBY3Rpb248UD4ge1xuICAgIGNvbnN0IHBheWxvYWQ6IEVudGl0eUFjdGlvblBheWxvYWQ8UD4gPVxuICAgICAgdHlwZW9mIG5hbWVPclBheWxvYWQgPT09ICdzdHJpbmcnXG4gICAgICAgID8gKHtcbiAgICAgICAgICAgIC4uLihvcHRpb25zIHx8IHt9KSxcbiAgICAgICAgICAgIGVudGl0eU5hbWU6IG5hbWVPclBheWxvYWQsXG4gICAgICAgICAgICBlbnRpdHlPcCxcbiAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgfSBhcyBFbnRpdHlBY3Rpb25QYXlsb2FkPFA+KVxuICAgICAgICA6IG5hbWVPclBheWxvYWQ7XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlQ29yZShwYXlsb2FkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gRW50aXR5QWN0aW9uIHRvIHBlcmZvcm0gYW4gb3BlcmF0aW9uIChvcCkgZm9yIGEgcGFydGljdWxhciBlbnRpdHkgdHlwZVxuICAgKiAoZW50aXR5TmFtZSkgd2l0aCBvcHRpb25hbCBkYXRhIGFuZCBvdGhlciBvcHRpb25hbCBmbGFnc1xuICAgKiBAcGFyYW0gcGF5bG9hZCBEZWZpbmVzIHRoZSBFbnRpdHlBY3Rpb24gYW5kIGl0cyBvcHRpb25zXG4gICAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlQ29yZTxQID0gYW55PihwYXlsb2FkOiBFbnRpdHlBY3Rpb25QYXlsb2FkPFA+KSB7XG4gICAgY29uc3QgeyBlbnRpdHlOYW1lLCBlbnRpdHlPcCwgdGFnIH0gPSBwYXlsb2FkO1xuICAgIGlmICghZW50aXR5TmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGVudGl0eSBuYW1lIGZvciBuZXcgYWN0aW9uJyk7XG4gICAgfVxuICAgIGlmIChlbnRpdHlPcCA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgRW50aXR5T3AgZm9yIG5ldyBhY3Rpb24nKTtcbiAgICB9XG4gICAgY29uc3QgdHlwZSA9IHRoaXMuZm9ybWF0QWN0aW9uVHlwZShlbnRpdHlPcCwgdGFnIHx8IGVudGl0eU5hbWUpO1xuICAgIHJldHVybiB7IHR5cGUsIHBheWxvYWQgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gRW50aXR5QWN0aW9uIGZyb20gYW5vdGhlciBFbnRpdHlBY3Rpb24sIHJlcGxhY2luZyBwcm9wZXJ0aWVzIHdpdGggdGhvc2UgZnJvbSBuZXdQYXlsb2FkO1xuICAgKiBAcGFyYW0gZnJvbSBTb3VyY2UgYWN0aW9uIHRoYXQgaXMgdGhlIGJhc2UgZm9yIHRoZSBuZXcgYWN0aW9uXG4gICAqIEBwYXJhbSBuZXdQcm9wZXJ0aWVzIE5ldyBFbnRpdHlBY3Rpb24gcHJvcGVydGllcyB0aGF0IHJlcGxhY2UgdGhlIHNvdXJjZSBhY3Rpb24gcHJvcGVydGllc1xuICAgKi9cbiAgY3JlYXRlRnJvbUFjdGlvbjxQID0gYW55PihcbiAgICBmcm9tOiBFbnRpdHlBY3Rpb24sXG4gICAgbmV3UHJvcGVydGllczogUGFydGlhbDxFbnRpdHlBY3Rpb25QYXlsb2FkPFA+PlxuICApOiBFbnRpdHlBY3Rpb248UD4ge1xuICAgIHJldHVybiB0aGlzLmNyZWF0ZSh7IC4uLmZyb20ucGF5bG9hZCwgLi4ubmV3UHJvcGVydGllcyB9KTtcbiAgfVxuXG4gIGZvcm1hdEFjdGlvblR5cGUob3A6IHN0cmluZywgdGFnOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYFske3RhZ31dICR7b3B9YDtcbiAgICAvLyByZXR1cm4gYCR7b3B9IFske3RhZ31dYC50b1VwcGVyQ2FzZSgpOyAvLyBleGFtcGxlIG9mIGFuIGFsdGVybmF0aXZlXG4gIH1cbn1cbiJdfQ==