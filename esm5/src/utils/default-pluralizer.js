var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * @fileoverview added by tsickle
 * Generated from: src/utils/default-pluralizer.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, Injectable, Optional } from '@angular/core';
import { PLURAL_NAMES_TOKEN } from './interfaces';
/** @type {?} */
var uncountable = [
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
var DefaultPluralizer = /** @class */ (function () {
    function DefaultPluralizer(pluralNames) {
        var _this = this;
        this.pluralNames = {};
        // merge each plural names object
        if (pluralNames) {
            pluralNames.forEach((/**
             * @param {?} pn
             * @return {?}
             */
            function (pn) { return _this.registerPluralNames(pn); }));
        }
    }
    /**
     * Pluralize a singular name using common English language pluralization rules
     * Examples: "company" -> "companies", "employee" -> "employees", "tax" -> "taxes"
     */
    /**
     * Pluralize a singular name using common English language pluralization rules
     * Examples: "company" -> "companies", "employee" -> "employees", "tax" -> "taxes"
     * @param {?} name
     * @return {?}
     */
    DefaultPluralizer.prototype.pluralize = /**
     * Pluralize a singular name using common English language pluralization rules
     * Examples: "company" -> "companies", "employee" -> "employees", "tax" -> "taxes"
     * @param {?} name
     * @return {?}
     */
    function (name) {
        /** @type {?} */
        var plural = this.pluralNames[name];
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
    };
    /**
     * Register a mapping of entity type name to the entity name's plural
     * @param pluralNames {EntityPluralNames} plural names for entity types
     */
    /**
     * Register a mapping of entity type name to the entity name's plural
     * @param {?} pluralNames {EntityPluralNames} plural names for entity types
     * @return {?}
     */
    DefaultPluralizer.prototype.registerPluralNames = /**
     * Register a mapping of entity type name to the entity name's plural
     * @param {?} pluralNames {EntityPluralNames} plural names for entity types
     * @return {?}
     */
    function (pluralNames) {
        this.pluralNames = __assign(__assign({}, this.pluralNames), (pluralNames || {}));
    };
    DefaultPluralizer.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    DefaultPluralizer.ctorParameters = function () { return [
        { type: Array, decorators: [{ type: Optional }, { type: Inject, args: [PLURAL_NAMES_TOKEN,] }] }
    ]; };
    return DefaultPluralizer;
}());
export { DefaultPluralizer };
if (false) {
    /** @type {?} */
    DefaultPluralizer.prototype.pluralNames;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1wbHVyYWxpemVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5ncngvZGF0YS8iLCJzb3VyY2VzIjpbInNyYy91dGlscy9kZWZhdWx0LXBsdXJhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQXFCLGtCQUFrQixFQUFFLE1BQU0sY0FBYyxDQUFDOztJQUUvRCxXQUFXLEdBQUc7SUFDbEIsV0FBVztJQUNYLFVBQVU7SUFDVixVQUFVO0lBQ1YsV0FBVztJQUNYLFVBQVU7SUFDVixhQUFhO0lBQ2IsV0FBVztJQUNYLGFBQWE7SUFDYixPQUFPO0lBQ1AsUUFBUTtDQUNUO0FBRUQ7SUFJRSwyQkFHRSxXQUFnQztRQUhsQyxpQkFTQztRQVhELGdCQUFXLEdBQXNCLEVBQUUsQ0FBQztRQU9sQyxpQ0FBaUM7UUFDakMsSUFBSSxXQUFXLEVBQUU7WUFDZixXQUFXLENBQUMsT0FBTzs7OztZQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsS0FBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxFQUE1QixDQUE0QixFQUFDLENBQUM7U0FDekQ7SUFDSCxDQUFDO0lBRUQ7OztPQUdHOzs7Ozs7O0lBQ0gscUNBQVM7Ozs7OztJQUFULFVBQVUsSUFBWTs7WUFDZCxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7UUFDckMsSUFBSSxNQUFNLEVBQUU7WUFDVixPQUFPLE1BQU0sQ0FBQztTQUNmO1FBQ0QsbUNBQW1DO1FBQ25DLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDaEQsT0FBTyxJQUFJLENBQUM7WUFDWixZQUFZO1NBQ2I7YUFBTSxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDakMsT0FBTyxJQUFJLEdBQUcsR0FBRyxDQUFDO1lBQ2xCLGdCQUFnQjtTQUNqQjthQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUM3QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQy9DLHlDQUF5QztTQUMxQzthQUFNLElBQUksbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3pDLE9BQU8sSUFBSSxHQUFHLElBQUksQ0FBQztTQUNwQjthQUFNO1lBQ0wsT0FBTyxJQUFJLEdBQUcsR0FBRyxDQUFDO1NBQ25CO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRzs7Ozs7O0lBQ0gsK0NBQW1COzs7OztJQUFuQixVQUFvQixXQUE4QjtRQUNoRCxJQUFJLENBQUMsV0FBVyx5QkFBUSxJQUFJLENBQUMsV0FBVyxHQUFLLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQyxDQUFFLENBQUM7SUFDckUsQ0FBQzs7Z0JBL0NGLFVBQVU7Ozs7NENBS04sUUFBUSxZQUNSLE1BQU0sU0FBQyxrQkFBa0I7O0lBMEM5Qix3QkFBQztDQUFBLEFBaERELElBZ0RDO1NBL0NZLGlCQUFpQjs7O0lBQzVCLHdDQUFvQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVudGl0eVBsdXJhbE5hbWVzLCBQTFVSQUxfTkFNRVNfVE9LRU4gfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG5jb25zdCB1bmNvdW50YWJsZSA9IFtcbiAgLy8gJ3NoZWVwJyxcbiAgLy8gJ2Zpc2gnLFxuICAvLyAnZGVlcicsXG4gIC8vICdtb29zZScsXG4gIC8vICdyaWNlJyxcbiAgLy8gJ3NwZWNpZXMnLFxuICAnZXF1aXBtZW50JyxcbiAgJ2luZm9ybWF0aW9uJyxcbiAgJ21vbmV5JyxcbiAgJ3NlcmllcycsXG5dO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGVmYXVsdFBsdXJhbGl6ZXIge1xuICBwbHVyYWxOYW1lczogRW50aXR5UGx1cmFsTmFtZXMgPSB7fTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoUExVUkFMX05BTUVTX1RPS0VOKVxuICAgIHBsdXJhbE5hbWVzOiBFbnRpdHlQbHVyYWxOYW1lc1tdXG4gICkge1xuICAgIC8vIG1lcmdlIGVhY2ggcGx1cmFsIG5hbWVzIG9iamVjdFxuICAgIGlmIChwbHVyYWxOYW1lcykge1xuICAgICAgcGx1cmFsTmFtZXMuZm9yRWFjaChwbiA9PiB0aGlzLnJlZ2lzdGVyUGx1cmFsTmFtZXMocG4pKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUGx1cmFsaXplIGEgc2luZ3VsYXIgbmFtZSB1c2luZyBjb21tb24gRW5nbGlzaCBsYW5ndWFnZSBwbHVyYWxpemF0aW9uIHJ1bGVzXG4gICAqIEV4YW1wbGVzOiBcImNvbXBhbnlcIiAtPiBcImNvbXBhbmllc1wiLCBcImVtcGxveWVlXCIgLT4gXCJlbXBsb3llZXNcIiwgXCJ0YXhcIiAtPiBcInRheGVzXCJcbiAgICovXG4gIHBsdXJhbGl6ZShuYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwbHVyYWwgPSB0aGlzLnBsdXJhbE5hbWVzW25hbWVdO1xuICAgIGlmIChwbHVyYWwpIHtcbiAgICAgIHJldHVybiBwbHVyYWw7XG4gICAgfVxuICAgIC8vIHNpbmd1bGFyIGFuZCBwbHVyYWwgYXJlIHRoZSBzYW1lXG4gICAgaWYgKHVuY291bnRhYmxlLmluZGV4T2YobmFtZS50b0xvd2VyQ2FzZSgpKSA+PSAwKSB7XG4gICAgICByZXR1cm4gbmFtZTtcbiAgICAgIC8vIHZvd2VsICsgeVxuICAgIH0gZWxzZSBpZiAoL1thZWlvdV15JC8udGVzdChuYW1lKSkge1xuICAgICAgcmV0dXJuIG5hbWUgKyAncyc7XG4gICAgICAvLyBjb25zb25hbnQgKyB5XG4gICAgfSBlbHNlIGlmIChuYW1lLmVuZHNXaXRoKCd5JykpIHtcbiAgICAgIHJldHVybiBuYW1lLnN1YnN0cigwLCBuYW1lLmxlbmd0aCAtIDEpICsgJ2llcyc7XG4gICAgICAvLyBlbmRpbmdzIHR5cGljYWxseSBwbHVyYWxpemVkIHdpdGggJ2VzJ1xuICAgIH0gZWxzZSBpZiAoL1tzfHNzfHNofGNofHh8el0kLy50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gbmFtZSArICdlcyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuYW1lICsgJ3MnO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIG1hcHBpbmcgb2YgZW50aXR5IHR5cGUgbmFtZSB0byB0aGUgZW50aXR5IG5hbWUncyBwbHVyYWxcbiAgICogQHBhcmFtIHBsdXJhbE5hbWVzIHtFbnRpdHlQbHVyYWxOYW1lc30gcGx1cmFsIG5hbWVzIGZvciBlbnRpdHkgdHlwZXNcbiAgICovXG4gIHJlZ2lzdGVyUGx1cmFsTmFtZXMocGx1cmFsTmFtZXM6IEVudGl0eVBsdXJhbE5hbWVzKTogdm9pZCB7XG4gICAgdGhpcy5wbHVyYWxOYW1lcyA9IHsgLi4udGhpcy5wbHVyYWxOYW1lcywgLi4uKHBsdXJhbE5hbWVzIHx8IHt9KSB9O1xuICB9XG59XG4iXX0=