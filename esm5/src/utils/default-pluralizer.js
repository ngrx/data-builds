import * as tslib_1 from "tslib";
import { Inject, Injectable, Optional } from '@angular/core';
import { PLURAL_NAMES_TOKEN } from './interfaces';
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
            pluralNames.forEach(function (pn) { return _this.registerPluralNames(pn); });
        }
    }
    /**
     * Pluralize a singular name using common English language pluralization rules
     * Examples: "company" -> "companies", "employee" -> "employees", "tax" -> "taxes"
     */
    DefaultPluralizer.prototype.pluralize = function (name) {
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
    DefaultPluralizer.prototype.registerPluralNames = function (pluralNames) {
        this.pluralNames = tslib_1.__assign({}, this.pluralNames, (pluralNames || {}));
    };
    DefaultPluralizer = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Optional()),
        tslib_1.__param(0, Inject(PLURAL_NAMES_TOKEN)),
        tslib_1.__metadata("design:paramtypes", [Array])
    ], DefaultPluralizer);
    return DefaultPluralizer;
}());
export { DefaultPluralizer };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1wbHVyYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy91dGlscy9kZWZhdWx0LXBsdXJhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQXFCLGtCQUFrQixFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRXJFLElBQU0sV0FBVyxHQUFHO0lBQ2xCLFdBQVc7SUFDWCxVQUFVO0lBQ1YsVUFBVTtJQUNWLFdBQVc7SUFDWCxVQUFVO0lBQ1YsYUFBYTtJQUNiLFdBQVc7SUFDWCxhQUFhO0lBQ2IsT0FBTztJQUNQLFFBQVE7Q0FDVCxDQUFDO0FBR0Y7SUFHRSwyQkFHRSxXQUFnQztRQUhsQyxpQkFTQztRQVhELGdCQUFXLEdBQXNCLEVBQUUsQ0FBQztRQU9sQyxpQ0FBaUM7UUFDakMsSUFBSSxXQUFXLEVBQUU7WUFDZixXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsS0FBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxFQUE1QixDQUE0QixDQUFDLENBQUM7U0FDekQ7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gscUNBQVMsR0FBVCxVQUFVLElBQVk7UUFDcEIsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxJQUFJLE1BQU0sRUFBRTtZQUNWLE9BQU8sTUFBTSxDQUFDO1NBQ2Y7UUFDRCxtQ0FBbUM7UUFDbkMsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNoRCxPQUFPLElBQUksQ0FBQztZQUNaLFlBQVk7U0FDYjthQUFNLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNqQyxPQUFPLElBQUksR0FBRyxHQUFHLENBQUM7WUFDbEIsZ0JBQWdCO1NBQ2pCO2FBQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzdCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDL0MseUNBQXlDO1NBQzFDO2FBQU0sSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDekMsT0FBTyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ3BCO2FBQU07WUFDTCxPQUFPLElBQUksR0FBRyxHQUFHLENBQUM7U0FDbkI7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsK0NBQW1CLEdBQW5CLFVBQW9CLFdBQThCO1FBQ2hELElBQUksQ0FBQyxXQUFXLHdCQUFRLElBQUksQ0FBQyxXQUFXLEVBQUssQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDLENBQUUsQ0FBQztJQUNyRSxDQUFDO0lBOUNVLGlCQUFpQjtRQUQ3QixVQUFVLEVBQUU7UUFLUixtQkFBQSxRQUFRLEVBQUUsQ0FBQTtRQUNWLG1CQUFBLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBOztPQUxsQixpQkFBaUIsQ0ErQzdCO0lBQUQsd0JBQUM7Q0FBQSxBQS9DRCxJQStDQztTQS9DWSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFbnRpdHlQbHVyYWxOYW1lcywgUExVUkFMX05BTUVTX1RPS0VOIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuY29uc3QgdW5jb3VudGFibGUgPSBbXG4gIC8vICdzaGVlcCcsXG4gIC8vICdmaXNoJyxcbiAgLy8gJ2RlZXInLFxuICAvLyAnbW9vc2UnLFxuICAvLyAncmljZScsXG4gIC8vICdzcGVjaWVzJyxcbiAgJ2VxdWlwbWVudCcsXG4gICdpbmZvcm1hdGlvbicsXG4gICdtb25leScsXG4gICdzZXJpZXMnLFxuXTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERlZmF1bHRQbHVyYWxpemVyIHtcbiAgcGx1cmFsTmFtZXM6IEVudGl0eVBsdXJhbE5hbWVzID0ge307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KFBMVVJBTF9OQU1FU19UT0tFTilcbiAgICBwbHVyYWxOYW1lczogRW50aXR5UGx1cmFsTmFtZXNbXVxuICApIHtcbiAgICAvLyBtZXJnZSBlYWNoIHBsdXJhbCBuYW1lcyBvYmplY3RcbiAgICBpZiAocGx1cmFsTmFtZXMpIHtcbiAgICAgIHBsdXJhbE5hbWVzLmZvckVhY2gocG4gPT4gdGhpcy5yZWdpc3RlclBsdXJhbE5hbWVzKHBuKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFBsdXJhbGl6ZSBhIHNpbmd1bGFyIG5hbWUgdXNpbmcgY29tbW9uIEVuZ2xpc2ggbGFuZ3VhZ2UgcGx1cmFsaXphdGlvbiBydWxlc1xuICAgKiBFeGFtcGxlczogXCJjb21wYW55XCIgLT4gXCJjb21wYW5pZXNcIiwgXCJlbXBsb3llZVwiIC0+IFwiZW1wbG95ZWVzXCIsIFwidGF4XCIgLT4gXCJ0YXhlc1wiXG4gICAqL1xuICBwbHVyYWxpemUobmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgcGx1cmFsID0gdGhpcy5wbHVyYWxOYW1lc1tuYW1lXTtcbiAgICBpZiAocGx1cmFsKSB7XG4gICAgICByZXR1cm4gcGx1cmFsO1xuICAgIH1cbiAgICAvLyBzaW5ndWxhciBhbmQgcGx1cmFsIGFyZSB0aGUgc2FtZVxuICAgIGlmICh1bmNvdW50YWJsZS5pbmRleE9mKG5hbWUudG9Mb3dlckNhc2UoKSkgPj0gMCkge1xuICAgICAgcmV0dXJuIG5hbWU7XG4gICAgICAvLyB2b3dlbCArIHlcbiAgICB9IGVsc2UgaWYgKC9bYWVpb3VdeSQvLnRlc3QobmFtZSkpIHtcbiAgICAgIHJldHVybiBuYW1lICsgJ3MnO1xuICAgICAgLy8gY29uc29uYW50ICsgeVxuICAgIH0gZWxzZSBpZiAobmFtZS5lbmRzV2l0aCgneScpKSB7XG4gICAgICByZXR1cm4gbmFtZS5zdWJzdHIoMCwgbmFtZS5sZW5ndGggLSAxKSArICdpZXMnO1xuICAgICAgLy8gZW5kaW5ncyB0eXBpY2FsbHkgcGx1cmFsaXplZCB3aXRoICdlcydcbiAgICB9IGVsc2UgaWYgKC9bc3xzc3xzaHxjaHx4fHpdJC8udGVzdChuYW1lKSkge1xuICAgICAgcmV0dXJuIG5hbWUgKyAnZXMnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmFtZSArICdzJztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBtYXBwaW5nIG9mIGVudGl0eSB0eXBlIG5hbWUgdG8gdGhlIGVudGl0eSBuYW1lJ3MgcGx1cmFsXG4gICAqIEBwYXJhbSBwbHVyYWxOYW1lcyB7RW50aXR5UGx1cmFsTmFtZXN9IHBsdXJhbCBuYW1lcyBmb3IgZW50aXR5IHR5cGVzXG4gICAqL1xuICByZWdpc3RlclBsdXJhbE5hbWVzKHBsdXJhbE5hbWVzOiBFbnRpdHlQbHVyYWxOYW1lcyk6IHZvaWQge1xuICAgIHRoaXMucGx1cmFsTmFtZXMgPSB7IC4uLnRoaXMucGx1cmFsTmFtZXMsIC4uLihwbHVyYWxOYW1lcyB8fCB7fSkgfTtcbiAgfVxufVxuIl19