(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/utils/default-pluralizer", ["require", "exports", "tslib", "@angular/core", "@ngrx/data/src/utils/interfaces"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@angular/core");
    const interfaces_1 = require("@ngrx/data/src/utils/interfaces");
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
    let DefaultPluralizer = class DefaultPluralizer {
        constructor(pluralNames) {
            this.pluralNames = {};
            // merge each plural names object
            if (pluralNames) {
                pluralNames.forEach(pn => this.registerPluralNames(pn));
            }
        }
        /**
         * Pluralize a singular name using common English language pluralization rules
         * Examples: "company" -> "companies", "employee" -> "employees", "tax" -> "taxes"
         */
        pluralize(name) {
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
         * @param pluralNames {EntityPluralNames} plural names for entity types
         */
        registerPluralNames(pluralNames) {
            this.pluralNames = Object.assign(Object.assign({}, this.pluralNames), (pluralNames || {}));
        }
    };
    DefaultPluralizer = tslib_1.__decorate([
        core_1.Injectable(),
        tslib_1.__param(0, core_1.Optional()),
        tslib_1.__param(0, core_1.Inject(interfaces_1.PLURAL_NAMES_TOKEN)),
        tslib_1.__metadata("design:paramtypes", [Array])
    ], DefaultPluralizer);
    exports.DefaultPluralizer = DefaultPluralizer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1wbHVyYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy91dGlscy9kZWZhdWx0LXBsdXJhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUEsd0NBQTZEO0lBQzdELGdFQUFxRTtJQUVyRSxNQUFNLFdBQVcsR0FBRztRQUNsQixXQUFXO1FBQ1gsVUFBVTtRQUNWLFVBQVU7UUFDVixXQUFXO1FBQ1gsVUFBVTtRQUNWLGFBQWE7UUFDYixXQUFXO1FBQ1gsYUFBYTtRQUNiLE9BQU87UUFDUCxRQUFRO0tBQ1QsQ0FBQztJQUdGLElBQWEsaUJBQWlCLEdBQTlCLE1BQWEsaUJBQWlCO1FBRzVCLFlBR0UsV0FBZ0M7WUFMbEMsZ0JBQVcsR0FBc0IsRUFBRSxDQUFDO1lBT2xDLGlDQUFpQztZQUNqQyxJQUFJLFdBQVcsRUFBRTtnQkFDZixXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDekQ7UUFDSCxDQUFDO1FBRUQ7OztXQUdHO1FBQ0gsU0FBUyxDQUFDLElBQVk7WUFDcEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QyxJQUFJLE1BQU0sRUFBRTtnQkFDVixPQUFPLE1BQU0sQ0FBQzthQUNmO1lBQ0QsbUNBQW1DO1lBQ25DLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2hELE9BQU8sSUFBSSxDQUFDO2dCQUNaLFlBQVk7YUFDYjtpQkFBTSxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2pDLE9BQU8sSUFBSSxHQUFHLEdBQUcsQ0FBQztnQkFDbEIsZ0JBQWdCO2FBQ2pCO2lCQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDN0IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztnQkFDL0MseUNBQXlDO2FBQzFDO2lCQUFNLElBQUksbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN6QyxPQUFPLElBQUksR0FBRyxJQUFJLENBQUM7YUFDcEI7aUJBQU07Z0JBQ0wsT0FBTyxJQUFJLEdBQUcsR0FBRyxDQUFDO2FBQ25CO1FBQ0gsQ0FBQztRQUVEOzs7V0FHRztRQUNILG1CQUFtQixDQUFDLFdBQThCO1lBQ2hELElBQUksQ0FBQyxXQUFXLG1DQUFRLElBQUksQ0FBQyxXQUFXLEdBQUssQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDLENBQUUsQ0FBQztRQUNyRSxDQUFDO0tBQ0YsQ0FBQTtJQS9DWSxpQkFBaUI7UUFEN0IsaUJBQVUsRUFBRTtRQUtSLG1CQUFBLGVBQVEsRUFBRSxDQUFBO1FBQ1YsbUJBQUEsYUFBTSxDQUFDLCtCQUFrQixDQUFDLENBQUE7O09BTGxCLGlCQUFpQixDQStDN0I7SUEvQ1ksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRW50aXR5UGx1cmFsTmFtZXMsIFBMVVJBTF9OQU1FU19UT0tFTiB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbmNvbnN0IHVuY291bnRhYmxlID0gW1xuICAvLyAnc2hlZXAnLFxuICAvLyAnZmlzaCcsXG4gIC8vICdkZWVyJyxcbiAgLy8gJ21vb3NlJyxcbiAgLy8gJ3JpY2UnLFxuICAvLyAnc3BlY2llcycsXG4gICdlcXVpcG1lbnQnLFxuICAnaW5mb3JtYXRpb24nLFxuICAnbW9uZXknLFxuICAnc2VyaWVzJyxcbl07XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEZWZhdWx0UGx1cmFsaXplciB7XG4gIHBsdXJhbE5hbWVzOiBFbnRpdHlQbHVyYWxOYW1lcyA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChQTFVSQUxfTkFNRVNfVE9LRU4pXG4gICAgcGx1cmFsTmFtZXM6IEVudGl0eVBsdXJhbE5hbWVzW11cbiAgKSB7XG4gICAgLy8gbWVyZ2UgZWFjaCBwbHVyYWwgbmFtZXMgb2JqZWN0XG4gICAgaWYgKHBsdXJhbE5hbWVzKSB7XG4gICAgICBwbHVyYWxOYW1lcy5mb3JFYWNoKHBuID0+IHRoaXMucmVnaXN0ZXJQbHVyYWxOYW1lcyhwbikpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQbHVyYWxpemUgYSBzaW5ndWxhciBuYW1lIHVzaW5nIGNvbW1vbiBFbmdsaXNoIGxhbmd1YWdlIHBsdXJhbGl6YXRpb24gcnVsZXNcbiAgICogRXhhbXBsZXM6IFwiY29tcGFueVwiIC0+IFwiY29tcGFuaWVzXCIsIFwiZW1wbG95ZWVcIiAtPiBcImVtcGxveWVlc1wiLCBcInRheFwiIC0+IFwidGF4ZXNcIlxuICAgKi9cbiAgcGx1cmFsaXplKG5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IHBsdXJhbCA9IHRoaXMucGx1cmFsTmFtZXNbbmFtZV07XG4gICAgaWYgKHBsdXJhbCkge1xuICAgICAgcmV0dXJuIHBsdXJhbDtcbiAgICB9XG4gICAgLy8gc2luZ3VsYXIgYW5kIHBsdXJhbCBhcmUgdGhlIHNhbWVcbiAgICBpZiAodW5jb3VudGFibGUuaW5kZXhPZihuYW1lLnRvTG93ZXJDYXNlKCkpID49IDApIHtcbiAgICAgIHJldHVybiBuYW1lO1xuICAgICAgLy8gdm93ZWwgKyB5XG4gICAgfSBlbHNlIGlmICgvW2FlaW91XXkkLy50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gbmFtZSArICdzJztcbiAgICAgIC8vIGNvbnNvbmFudCArIHlcbiAgICB9IGVsc2UgaWYgKG5hbWUuZW5kc1dpdGgoJ3knKSkge1xuICAgICAgcmV0dXJuIG5hbWUuc3Vic3RyKDAsIG5hbWUubGVuZ3RoIC0gMSkgKyAnaWVzJztcbiAgICAgIC8vIGVuZGluZ3MgdHlwaWNhbGx5IHBsdXJhbGl6ZWQgd2l0aCAnZXMnXG4gICAgfSBlbHNlIGlmICgvW3N8c3N8c2h8Y2h8eHx6XSQvLnRlc3QobmFtZSkpIHtcbiAgICAgIHJldHVybiBuYW1lICsgJ2VzJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5hbWUgKyAncyc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgbWFwcGluZyBvZiBlbnRpdHkgdHlwZSBuYW1lIHRvIHRoZSBlbnRpdHkgbmFtZSdzIHBsdXJhbFxuICAgKiBAcGFyYW0gcGx1cmFsTmFtZXMge0VudGl0eVBsdXJhbE5hbWVzfSBwbHVyYWwgbmFtZXMgZm9yIGVudGl0eSB0eXBlc1xuICAgKi9cbiAgcmVnaXN0ZXJQbHVyYWxOYW1lcyhwbHVyYWxOYW1lczogRW50aXR5UGx1cmFsTmFtZXMpOiB2b2lkIHtcbiAgICB0aGlzLnBsdXJhbE5hbWVzID0geyAuLi50aGlzLnBsdXJhbE5hbWVzLCAuLi4ocGx1cmFsTmFtZXMgfHwge30pIH07XG4gIH1cbn1cbiJdfQ==