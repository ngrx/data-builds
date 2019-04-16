/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            pn => this.registerPluralNames(pn)));
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
        this.pluralNames = Object.assign({}, this.pluralNames, (pluralNames || {}));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1wbHVyYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy91dGlscy9kZWZhdWx0LXBsdXJhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQXFCLGtCQUFrQixFQUFFLE1BQU0sY0FBYyxDQUFDOztNQUUvRCxXQUFXLEdBQUc7SUFDbEIsV0FBVztJQUNYLFVBQVU7SUFDVixVQUFVO0lBQ1YsV0FBVztJQUNYLFVBQVU7SUFDVixhQUFhO0lBQ2IsV0FBVztJQUNYLGFBQWE7SUFDYixPQUFPO0lBQ1AsUUFBUTtDQUNUO0FBR0QsTUFBTSxPQUFPLGlCQUFpQjs7OztJQUc1QixZQUdFLFdBQWdDO1FBTGxDLGdCQUFXLEdBQXNCLEVBQUUsQ0FBQztRQU9sQyxpQ0FBaUM7UUFDakMsSUFBSSxXQUFXLEVBQUU7WUFDZixXQUFXLENBQUMsT0FBTzs7OztZQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUM7U0FDekQ7SUFDSCxDQUFDOzs7Ozs7O0lBTUQsU0FBUyxDQUFDLElBQVk7O2NBQ2QsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1FBQ3JDLElBQUksTUFBTSxFQUFFO1lBQ1YsT0FBTyxNQUFNLENBQUM7U0FDZjtRQUNELG1DQUFtQztRQUNuQyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2hELE9BQU8sSUFBSSxDQUFDO1lBQ1osWUFBWTtTQUNiO2FBQU0sSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2pDLE9BQU8sSUFBSSxHQUFHLEdBQUcsQ0FBQztZQUNsQixnQkFBZ0I7U0FDakI7YUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDN0IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUMvQyx5Q0FBeUM7U0FDMUM7YUFBTSxJQUFJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN6QyxPQUFPLElBQUksR0FBRyxJQUFJLENBQUM7U0FDcEI7YUFBTTtZQUNMLE9BQU8sSUFBSSxHQUFHLEdBQUcsQ0FBQztTQUNuQjtJQUNILENBQUM7Ozs7OztJQU1ELG1CQUFtQixDQUFDLFdBQThCO1FBQ2hELElBQUksQ0FBQyxXQUFXLHFCQUFRLElBQUksQ0FBQyxXQUFXLEVBQUssQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDLENBQUUsQ0FBQztJQUNyRSxDQUFDOzs7WUEvQ0YsVUFBVTs7Ozt3Q0FLTixRQUFRLFlBQ1IsTUFBTSxTQUFDLGtCQUFrQjs7OztJQUo1Qix3Q0FBb0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFbnRpdHlQbHVyYWxOYW1lcywgUExVUkFMX05BTUVTX1RPS0VOIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuY29uc3QgdW5jb3VudGFibGUgPSBbXG4gIC8vICdzaGVlcCcsXG4gIC8vICdmaXNoJyxcbiAgLy8gJ2RlZXInLFxuICAvLyAnbW9vc2UnLFxuICAvLyAncmljZScsXG4gIC8vICdzcGVjaWVzJyxcbiAgJ2VxdWlwbWVudCcsXG4gICdpbmZvcm1hdGlvbicsXG4gICdtb25leScsXG4gICdzZXJpZXMnLFxuXTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERlZmF1bHRQbHVyYWxpemVyIHtcbiAgcGx1cmFsTmFtZXM6IEVudGl0eVBsdXJhbE5hbWVzID0ge307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KFBMVVJBTF9OQU1FU19UT0tFTilcbiAgICBwbHVyYWxOYW1lczogRW50aXR5UGx1cmFsTmFtZXNbXVxuICApIHtcbiAgICAvLyBtZXJnZSBlYWNoIHBsdXJhbCBuYW1lcyBvYmplY3RcbiAgICBpZiAocGx1cmFsTmFtZXMpIHtcbiAgICAgIHBsdXJhbE5hbWVzLmZvckVhY2gocG4gPT4gdGhpcy5yZWdpc3RlclBsdXJhbE5hbWVzKHBuKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFBsdXJhbGl6ZSBhIHNpbmd1bGFyIG5hbWUgdXNpbmcgY29tbW9uIEVuZ2xpc2ggbGFuZ3VhZ2UgcGx1cmFsaXphdGlvbiBydWxlc1xuICAgKiBFeGFtcGxlczogXCJjb21wYW55XCIgLT4gXCJjb21wYW5pZXNcIiwgXCJlbXBsb3llZVwiIC0+IFwiZW1wbG95ZWVzXCIsIFwidGF4XCIgLT4gXCJ0YXhlc1wiXG4gICAqL1xuICBwbHVyYWxpemUobmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgcGx1cmFsID0gdGhpcy5wbHVyYWxOYW1lc1tuYW1lXTtcbiAgICBpZiAocGx1cmFsKSB7XG4gICAgICByZXR1cm4gcGx1cmFsO1xuICAgIH1cbiAgICAvLyBzaW5ndWxhciBhbmQgcGx1cmFsIGFyZSB0aGUgc2FtZVxuICAgIGlmICh1bmNvdW50YWJsZS5pbmRleE9mKG5hbWUudG9Mb3dlckNhc2UoKSkgPj0gMCkge1xuICAgICAgcmV0dXJuIG5hbWU7XG4gICAgICAvLyB2b3dlbCArIHlcbiAgICB9IGVsc2UgaWYgKC9bYWVpb3VdeSQvLnRlc3QobmFtZSkpIHtcbiAgICAgIHJldHVybiBuYW1lICsgJ3MnO1xuICAgICAgLy8gY29uc29uYW50ICsgeVxuICAgIH0gZWxzZSBpZiAobmFtZS5lbmRzV2l0aCgneScpKSB7XG4gICAgICByZXR1cm4gbmFtZS5zdWJzdHIoMCwgbmFtZS5sZW5ndGggLSAxKSArICdpZXMnO1xuICAgICAgLy8gZW5kaW5ncyB0eXBpY2FsbHkgcGx1cmFsaXplZCB3aXRoICdlcydcbiAgICB9IGVsc2UgaWYgKC9bc3xzc3xzaHxjaHx4fHpdJC8udGVzdChuYW1lKSkge1xuICAgICAgcmV0dXJuIG5hbWUgKyAnZXMnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmFtZSArICdzJztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBtYXBwaW5nIG9mIGVudGl0eSB0eXBlIG5hbWUgdG8gdGhlIGVudGl0eSBuYW1lJ3MgcGx1cmFsXG4gICAqIEBwYXJhbSBwbHVyYWxOYW1lcyB7RW50aXR5UGx1cmFsTmFtZXN9IHBsdXJhbCBuYW1lcyBmb3IgZW50aXR5IHR5cGVzXG4gICAqL1xuICByZWdpc3RlclBsdXJhbE5hbWVzKHBsdXJhbE5hbWVzOiBFbnRpdHlQbHVyYWxOYW1lcyk6IHZvaWQge1xuICAgIHRoaXMucGx1cmFsTmFtZXMgPSB7IC4uLnRoaXMucGx1cmFsTmFtZXMsIC4uLihwbHVyYWxOYW1lcyB8fCB7fSkgfTtcbiAgfVxufVxuIl19