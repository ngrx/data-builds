import { __assign, __decorate, __metadata, __param } from "tslib";
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
        this.pluralNames = __assign(__assign({}, this.pluralNames), (pluralNames || {}));
    };
    DefaultPluralizer = __decorate([
        Injectable(),
        __param(0, Optional()),
        __param(0, Inject(PLURAL_NAMES_TOKEN)),
        __metadata("design:paramtypes", [Array])
    ], DefaultPluralizer);
    return DefaultPluralizer;
}());
export { DefaultPluralizer };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1wbHVyYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy91dGlscy9kZWZhdWx0LXBsdXJhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQXFCLGtCQUFrQixFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRXJFLElBQU0sV0FBVyxHQUFHO0lBQ2xCLFdBQVc7SUFDWCxVQUFVO0lBQ1YsVUFBVTtJQUNWLFdBQVc7SUFDWCxVQUFVO0lBQ1YsYUFBYTtJQUNiLFdBQVc7SUFDWCxhQUFhO0lBQ2IsT0FBTztJQUNQLFFBQVE7Q0FDVCxDQUFDO0FBR0Y7SUFHRSwyQkFHRSxXQUFnQztRQUhsQyxpQkFTQztRQVhELGdCQUFXLEdBQXNCLEVBQUUsQ0FBQztRQU9sQyxpQ0FBaUM7UUFDakMsSUFBSSxXQUFXLEVBQUU7WUFDZixXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsS0FBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxFQUE1QixDQUE0QixDQUFDLENBQUM7U0FDekQ7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gscUNBQVMsR0FBVCxVQUFVLElBQVk7UUFDcEIsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxJQUFJLE1BQU0sRUFBRTtZQUNWLE9BQU8sTUFBTSxDQUFDO1NBQ2Y7UUFDRCxtQ0FBbUM7UUFDbkMsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNoRCxPQUFPLElBQUksQ0FBQztZQUNaLFlBQVk7U0FDYjthQUFNLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNqQyxPQUFPLElBQUksR0FBRyxHQUFHLENBQUM7WUFDbEIsZ0JBQWdCO1NBQ2pCO2FBQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzdCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDL0MseUNBQXlDO1NBQzFDO2FBQU0sSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDekMsT0FBTyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ3BCO2FBQU07WUFDTCxPQUFPLElBQUksR0FBRyxHQUFHLENBQUM7U0FDbkI7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsK0NBQW1CLEdBQW5CLFVBQW9CLFdBQThCO1FBQ2hELElBQUksQ0FBQyxXQUFXLHlCQUFRLElBQUksQ0FBQyxXQUFXLEdBQUssQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDLENBQUUsQ0FBQztJQUNyRSxDQUFDO0lBOUNVLGlCQUFpQjtRQUQ3QixVQUFVLEVBQUU7UUFLUixXQUFBLFFBQVEsRUFBRSxDQUFBO1FBQ1YsV0FBQSxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQTs7T0FMbEIsaUJBQWlCLENBK0M3QjtJQUFELHdCQUFDO0NBQUEsQUEvQ0QsSUErQ0M7U0EvQ1ksaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRW50aXR5UGx1cmFsTmFtZXMsIFBMVVJBTF9OQU1FU19UT0tFTiB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbmNvbnN0IHVuY291bnRhYmxlID0gW1xuICAvLyAnc2hlZXAnLFxuICAvLyAnZmlzaCcsXG4gIC8vICdkZWVyJyxcbiAgLy8gJ21vb3NlJyxcbiAgLy8gJ3JpY2UnLFxuICAvLyAnc3BlY2llcycsXG4gICdlcXVpcG1lbnQnLFxuICAnaW5mb3JtYXRpb24nLFxuICAnbW9uZXknLFxuICAnc2VyaWVzJyxcbl07XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEZWZhdWx0UGx1cmFsaXplciB7XG4gIHBsdXJhbE5hbWVzOiBFbnRpdHlQbHVyYWxOYW1lcyA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChQTFVSQUxfTkFNRVNfVE9LRU4pXG4gICAgcGx1cmFsTmFtZXM6IEVudGl0eVBsdXJhbE5hbWVzW11cbiAgKSB7XG4gICAgLy8gbWVyZ2UgZWFjaCBwbHVyYWwgbmFtZXMgb2JqZWN0XG4gICAgaWYgKHBsdXJhbE5hbWVzKSB7XG4gICAgICBwbHVyYWxOYW1lcy5mb3JFYWNoKHBuID0+IHRoaXMucmVnaXN0ZXJQbHVyYWxOYW1lcyhwbikpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQbHVyYWxpemUgYSBzaW5ndWxhciBuYW1lIHVzaW5nIGNvbW1vbiBFbmdsaXNoIGxhbmd1YWdlIHBsdXJhbGl6YXRpb24gcnVsZXNcbiAgICogRXhhbXBsZXM6IFwiY29tcGFueVwiIC0+IFwiY29tcGFuaWVzXCIsIFwiZW1wbG95ZWVcIiAtPiBcImVtcGxveWVlc1wiLCBcInRheFwiIC0+IFwidGF4ZXNcIlxuICAgKi9cbiAgcGx1cmFsaXplKG5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IHBsdXJhbCA9IHRoaXMucGx1cmFsTmFtZXNbbmFtZV07XG4gICAgaWYgKHBsdXJhbCkge1xuICAgICAgcmV0dXJuIHBsdXJhbDtcbiAgICB9XG4gICAgLy8gc2luZ3VsYXIgYW5kIHBsdXJhbCBhcmUgdGhlIHNhbWVcbiAgICBpZiAodW5jb3VudGFibGUuaW5kZXhPZihuYW1lLnRvTG93ZXJDYXNlKCkpID49IDApIHtcbiAgICAgIHJldHVybiBuYW1lO1xuICAgICAgLy8gdm93ZWwgKyB5XG4gICAgfSBlbHNlIGlmICgvW2FlaW91XXkkLy50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gbmFtZSArICdzJztcbiAgICAgIC8vIGNvbnNvbmFudCArIHlcbiAgICB9IGVsc2UgaWYgKG5hbWUuZW5kc1dpdGgoJ3knKSkge1xuICAgICAgcmV0dXJuIG5hbWUuc3Vic3RyKDAsIG5hbWUubGVuZ3RoIC0gMSkgKyAnaWVzJztcbiAgICAgIC8vIGVuZGluZ3MgdHlwaWNhbGx5IHBsdXJhbGl6ZWQgd2l0aCAnZXMnXG4gICAgfSBlbHNlIGlmICgvW3N8c3N8c2h8Y2h8eHx6XSQvLnRlc3QobmFtZSkpIHtcbiAgICAgIHJldHVybiBuYW1lICsgJ2VzJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5hbWUgKyAncyc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgbWFwcGluZyBvZiBlbnRpdHkgdHlwZSBuYW1lIHRvIHRoZSBlbnRpdHkgbmFtZSdzIHBsdXJhbFxuICAgKiBAcGFyYW0gcGx1cmFsTmFtZXMge0VudGl0eVBsdXJhbE5hbWVzfSBwbHVyYWwgbmFtZXMgZm9yIGVudGl0eSB0eXBlc1xuICAgKi9cbiAgcmVnaXN0ZXJQbHVyYWxOYW1lcyhwbHVyYWxOYW1lczogRW50aXR5UGx1cmFsTmFtZXMpOiB2b2lkIHtcbiAgICB0aGlzLnBsdXJhbE5hbWVzID0geyAuLi50aGlzLnBsdXJhbE5hbWVzLCAuLi4ocGx1cmFsTmFtZXMgfHwge30pIH07XG4gIH1cbn1cbiJdfQ==