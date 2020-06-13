/**
 * @fileoverview added by tsickle
 * Generated from: src/utils/default-pluralizer.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, Injectable, Optional } from '@angular/core';
import { PLURAL_NAMES_TOKEN } from './interfaces';
/** @type {?} */
const uncountable = [
    // 'sheep',
    // 'fish',
    // 'deer',
    // 'moose',
    // 'rice',
    // 'species',
    'equipment',
    'information',
    'money',
    'series',
];
export class DefaultPluralizer {
    /**
     * @param {?} pluralNames
     */
    constructor(pluralNames) {
        this.pluralNames = {};
        // merge each plural names object
        if (pluralNames) {
            pluralNames.forEach((/**
             * @param {?} pn
             * @return {?}
             */
            (pn) => this.registerPluralNames(pn)));
        }
    }
    /**
     * Pluralize a singular name using common English language pluralization rules
     * Examples: "company" -> "companies", "employee" -> "employees", "tax" -> "taxes"
     * @param {?} name
     * @return {?}
     */
    pluralize(name) {
        /** @type {?} */
        const plural = this.pluralNames[name];
        if (plural) {
            return plural;
        }
        // singular and plural are the same
        if (uncountable.indexOf(name.toLowerCase()) >= 0) {
            return name;
            // vowel + y
        }
        else if (/[aeiou]y$/.test(name)) {
            return name + 's';
            // consonant + y
        }
        else if (name.endsWith('y')) {
            return name.substr(0, name.length - 1) + 'ies';
            // endings typically pluralized with 'es'
        }
        else if (/[s|ss|sh|ch|x|z]$/.test(name)) {
            return name + 'es';
        }
        else {
            return name + 's';
        }
    }
    /**
     * Register a mapping of entity type name to the entity name's plural
     * @param {?} pluralNames {EntityPluralNames} plural names for entity types
     * @return {?}
     */
    registerPluralNames(pluralNames) {
        this.pluralNames = Object.assign(Object.assign({}, this.pluralNames), (pluralNames || {}));
    }
}
DefaultPluralizer.decorators = [
    { type: Injectable }
];
/** @nocollapse */
DefaultPluralizer.ctorParameters = () => [
    { type: Array, decorators: [{ type: Optional }, { type: Inject, args: [PLURAL_NAMES_TOKEN,] }] }
];
if (false) {
    /** @type {?} */
    DefaultPluralizer.prototype.pluralNames;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1wbHVyYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy91dGlscy9kZWZhdWx0LXBsdXJhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0QsT0FBTyxFQUFxQixrQkFBa0IsRUFBRSxNQUFNLGNBQWMsQ0FBQzs7TUFFL0QsV0FBVyxHQUFHO0lBQ2xCLFdBQVc7SUFDWCxVQUFVO0lBQ1YsVUFBVTtJQUNWLFdBQVc7SUFDWCxVQUFVO0lBQ1YsYUFBYTtJQUNiLFdBQVc7SUFDWCxhQUFhO0lBQ2IsT0FBTztJQUNQLFFBQVE7Q0FDVDtBQUdELE1BQU0sT0FBTyxpQkFBaUI7Ozs7SUFHNUIsWUFHRSxXQUFnQztRQUxsQyxnQkFBVyxHQUFzQixFQUFFLENBQUM7UUFPbEMsaUNBQWlDO1FBQ2pDLElBQUksV0FBVyxFQUFFO1lBQ2YsV0FBVyxDQUFDLE9BQU87Ozs7WUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUM7U0FDM0Q7SUFDSCxDQUFDOzs7Ozs7O0lBTUQsU0FBUyxDQUFDLElBQVk7O2NBQ2QsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1FBQ3JDLElBQUksTUFBTSxFQUFFO1lBQ1YsT0FBTyxNQUFNLENBQUM7U0FDZjtRQUNELG1DQUFtQztRQUNuQyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2hELE9BQU8sSUFBSSxDQUFDO1lBQ1osWUFBWTtTQUNiO2FBQU0sSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2pDLE9BQU8sSUFBSSxHQUFHLEdBQUcsQ0FBQztZQUNsQixnQkFBZ0I7U0FDakI7YUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDN0IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUMvQyx5Q0FBeUM7U0FDMUM7YUFBTSxJQUFJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN6QyxPQUFPLElBQUksR0FBRyxJQUFJLENBQUM7U0FDcEI7YUFBTTtZQUNMLE9BQU8sSUFBSSxHQUFHLEdBQUcsQ0FBQztTQUNuQjtJQUNILENBQUM7Ozs7OztJQU1ELG1CQUFtQixDQUFDLFdBQThCO1FBQ2hELElBQUksQ0FBQyxXQUFXLG1DQUFRLElBQUksQ0FBQyxXQUFXLEdBQUssQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDLENBQUUsQ0FBQztJQUNyRSxDQUFDOzs7WUEvQ0YsVUFBVTs7Ozt3Q0FLTixRQUFRLFlBQ1IsTUFBTSxTQUFDLGtCQUFrQjs7OztJQUo1Qix3Q0FBb0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFbnRpdHlQbHVyYWxOYW1lcywgUExVUkFMX05BTUVTX1RPS0VOIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuY29uc3QgdW5jb3VudGFibGUgPSBbXG4gIC8vICdzaGVlcCcsXG4gIC8vICdmaXNoJyxcbiAgLy8gJ2RlZXInLFxuICAvLyAnbW9vc2UnLFxuICAvLyAncmljZScsXG4gIC8vICdzcGVjaWVzJyxcbiAgJ2VxdWlwbWVudCcsXG4gICdpbmZvcm1hdGlvbicsXG4gICdtb25leScsXG4gICdzZXJpZXMnLFxuXTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERlZmF1bHRQbHVyYWxpemVyIHtcbiAgcGx1cmFsTmFtZXM6IEVudGl0eVBsdXJhbE5hbWVzID0ge307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KFBMVVJBTF9OQU1FU19UT0tFTilcbiAgICBwbHVyYWxOYW1lczogRW50aXR5UGx1cmFsTmFtZXNbXVxuICApIHtcbiAgICAvLyBtZXJnZSBlYWNoIHBsdXJhbCBuYW1lcyBvYmplY3RcbiAgICBpZiAocGx1cmFsTmFtZXMpIHtcbiAgICAgIHBsdXJhbE5hbWVzLmZvckVhY2goKHBuKSA9PiB0aGlzLnJlZ2lzdGVyUGx1cmFsTmFtZXMocG4pKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUGx1cmFsaXplIGEgc2luZ3VsYXIgbmFtZSB1c2luZyBjb21tb24gRW5nbGlzaCBsYW5ndWFnZSBwbHVyYWxpemF0aW9uIHJ1bGVzXG4gICAqIEV4YW1wbGVzOiBcImNvbXBhbnlcIiAtPiBcImNvbXBhbmllc1wiLCBcImVtcGxveWVlXCIgLT4gXCJlbXBsb3llZXNcIiwgXCJ0YXhcIiAtPiBcInRheGVzXCJcbiAgICovXG4gIHBsdXJhbGl6ZShuYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwbHVyYWwgPSB0aGlzLnBsdXJhbE5hbWVzW25hbWVdO1xuICAgIGlmIChwbHVyYWwpIHtcbiAgICAgIHJldHVybiBwbHVyYWw7XG4gICAgfVxuICAgIC8vIHNpbmd1bGFyIGFuZCBwbHVyYWwgYXJlIHRoZSBzYW1lXG4gICAgaWYgKHVuY291bnRhYmxlLmluZGV4T2YobmFtZS50b0xvd2VyQ2FzZSgpKSA+PSAwKSB7XG4gICAgICByZXR1cm4gbmFtZTtcbiAgICAgIC8vIHZvd2VsICsgeVxuICAgIH0gZWxzZSBpZiAoL1thZWlvdV15JC8udGVzdChuYW1lKSkge1xuICAgICAgcmV0dXJuIG5hbWUgKyAncyc7XG4gICAgICAvLyBjb25zb25hbnQgKyB5XG4gICAgfSBlbHNlIGlmIChuYW1lLmVuZHNXaXRoKCd5JykpIHtcbiAgICAgIHJldHVybiBuYW1lLnN1YnN0cigwLCBuYW1lLmxlbmd0aCAtIDEpICsgJ2llcyc7XG4gICAgICAvLyBlbmRpbmdzIHR5cGljYWxseSBwbHVyYWxpemVkIHdpdGggJ2VzJ1xuICAgIH0gZWxzZSBpZiAoL1tzfHNzfHNofGNofHh8el0kLy50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gbmFtZSArICdlcyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuYW1lICsgJ3MnO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIG1hcHBpbmcgb2YgZW50aXR5IHR5cGUgbmFtZSB0byB0aGUgZW50aXR5IG5hbWUncyBwbHVyYWxcbiAgICogQHBhcmFtIHBsdXJhbE5hbWVzIHtFbnRpdHlQbHVyYWxOYW1lc30gcGx1cmFsIG5hbWVzIGZvciBlbnRpdHkgdHlwZXNcbiAgICovXG4gIHJlZ2lzdGVyUGx1cmFsTmFtZXMocGx1cmFsTmFtZXM6IEVudGl0eVBsdXJhbE5hbWVzKTogdm9pZCB7XG4gICAgdGhpcy5wbHVyYWxOYW1lcyA9IHsgLi4udGhpcy5wbHVyYWxOYW1lcywgLi4uKHBsdXJhbE5hbWVzIHx8IHt9KSB9O1xuICB9XG59XG4iXX0=