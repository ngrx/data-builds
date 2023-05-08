import { Inject, Injectable, Optional } from '@angular/core';
import { PLURAL_NAMES_TOKEN } from './interfaces';
import * as i0 from "@angular/core";
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
class DefaultPluralizer {
    constructor(pluralNames) {
        this.pluralNames = {};
        // merge each plural names object
        if (pluralNames) {
            pluralNames.forEach((pn) => this.registerPluralNames(pn));
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
            return name.substring(0, name.length - 1) + 'ies';
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
        this.pluralNames = { ...this.pluralNames, ...(pluralNames || {}) };
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DefaultPluralizer, deps: [{ token: PLURAL_NAMES_TOKEN, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DefaultPluralizer }); }
}
export { DefaultPluralizer };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DefaultPluralizer, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [PLURAL_NAMES_TOKEN]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1wbHVyYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy91dGlscy9kZWZhdWx0LXBsdXJhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdELE9BQU8sRUFBcUIsa0JBQWtCLEVBQUUsTUFBTSxjQUFjLENBQUM7O0FBRXJFLE1BQU0sV0FBVyxHQUFHO0lBQ2xCLFdBQVc7SUFDWCxVQUFVO0lBQ1YsVUFBVTtJQUNWLFdBQVc7SUFDWCxVQUFVO0lBQ1YsYUFBYTtJQUNiLFdBQVc7SUFDWCxhQUFhO0lBQ2IsT0FBTztJQUNQLFFBQVE7Q0FDVCxDQUFDO0FBRUYsTUFDYSxpQkFBaUI7SUFHNUIsWUFHRSxXQUFnQztRQUxsQyxnQkFBVyxHQUFzQixFQUFFLENBQUM7UUFPbEMsaUNBQWlDO1FBQ2pDLElBQUksV0FBVyxFQUFFO1lBQ2YsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDM0Q7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsU0FBUyxDQUFDLElBQVk7UUFDcEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxJQUFJLE1BQU0sRUFBRTtZQUNWLE9BQU8sTUFBTSxDQUFDO1NBQ2Y7UUFDRCxtQ0FBbUM7UUFDbkMsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNoRCxPQUFPLElBQUksQ0FBQztZQUNaLFlBQVk7U0FDYjthQUFNLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNqQyxPQUFPLElBQUksR0FBRyxHQUFHLENBQUM7WUFDbEIsZ0JBQWdCO1NBQ2pCO2FBQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzdCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDbEQseUNBQXlDO1NBQzFDO2FBQU0sSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDekMsT0FBTyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ3BCO2FBQU07WUFDTCxPQUFPLElBQUksR0FBRyxHQUFHLENBQUM7U0FDbkI7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsbUJBQW1CLENBQUMsV0FBOEI7UUFDaEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDckUsQ0FBQztpSUE5Q1UsaUJBQWlCLGtCQUtsQixrQkFBa0I7cUlBTGpCLGlCQUFpQjs7U0FBakIsaUJBQWlCOzJGQUFqQixpQkFBaUI7a0JBRDdCLFVBQVU7OzBCQUtOLFFBQVE7OzBCQUNSLE1BQU07MkJBQUMsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRW50aXR5UGx1cmFsTmFtZXMsIFBMVVJBTF9OQU1FU19UT0tFTiB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbmNvbnN0IHVuY291bnRhYmxlID0gW1xuICAvLyAnc2hlZXAnLFxuICAvLyAnZmlzaCcsXG4gIC8vICdkZWVyJyxcbiAgLy8gJ21vb3NlJyxcbiAgLy8gJ3JpY2UnLFxuICAvLyAnc3BlY2llcycsXG4gICdlcXVpcG1lbnQnLFxuICAnaW5mb3JtYXRpb24nLFxuICAnbW9uZXknLFxuICAnc2VyaWVzJyxcbl07XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEZWZhdWx0UGx1cmFsaXplciB7XG4gIHBsdXJhbE5hbWVzOiBFbnRpdHlQbHVyYWxOYW1lcyA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChQTFVSQUxfTkFNRVNfVE9LRU4pXG4gICAgcGx1cmFsTmFtZXM6IEVudGl0eVBsdXJhbE5hbWVzW11cbiAgKSB7XG4gICAgLy8gbWVyZ2UgZWFjaCBwbHVyYWwgbmFtZXMgb2JqZWN0XG4gICAgaWYgKHBsdXJhbE5hbWVzKSB7XG4gICAgICBwbHVyYWxOYW1lcy5mb3JFYWNoKChwbikgPT4gdGhpcy5yZWdpc3RlclBsdXJhbE5hbWVzKHBuKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFBsdXJhbGl6ZSBhIHNpbmd1bGFyIG5hbWUgdXNpbmcgY29tbW9uIEVuZ2xpc2ggbGFuZ3VhZ2UgcGx1cmFsaXphdGlvbiBydWxlc1xuICAgKiBFeGFtcGxlczogXCJjb21wYW55XCIgLT4gXCJjb21wYW5pZXNcIiwgXCJlbXBsb3llZVwiIC0+IFwiZW1wbG95ZWVzXCIsIFwidGF4XCIgLT4gXCJ0YXhlc1wiXG4gICAqL1xuICBwbHVyYWxpemUobmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgcGx1cmFsID0gdGhpcy5wbHVyYWxOYW1lc1tuYW1lXTtcbiAgICBpZiAocGx1cmFsKSB7XG4gICAgICByZXR1cm4gcGx1cmFsO1xuICAgIH1cbiAgICAvLyBzaW5ndWxhciBhbmQgcGx1cmFsIGFyZSB0aGUgc2FtZVxuICAgIGlmICh1bmNvdW50YWJsZS5pbmRleE9mKG5hbWUudG9Mb3dlckNhc2UoKSkgPj0gMCkge1xuICAgICAgcmV0dXJuIG5hbWU7XG4gICAgICAvLyB2b3dlbCArIHlcbiAgICB9IGVsc2UgaWYgKC9bYWVpb3VdeSQvLnRlc3QobmFtZSkpIHtcbiAgICAgIHJldHVybiBuYW1lICsgJ3MnO1xuICAgICAgLy8gY29uc29uYW50ICsgeVxuICAgIH0gZWxzZSBpZiAobmFtZS5lbmRzV2l0aCgneScpKSB7XG4gICAgICByZXR1cm4gbmFtZS5zdWJzdHJpbmcoMCwgbmFtZS5sZW5ndGggLSAxKSArICdpZXMnO1xuICAgICAgLy8gZW5kaW5ncyB0eXBpY2FsbHkgcGx1cmFsaXplZCB3aXRoICdlcydcbiAgICB9IGVsc2UgaWYgKC9bc3xzc3xzaHxjaHx4fHpdJC8udGVzdChuYW1lKSkge1xuICAgICAgcmV0dXJuIG5hbWUgKyAnZXMnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmFtZSArICdzJztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBtYXBwaW5nIG9mIGVudGl0eSB0eXBlIG5hbWUgdG8gdGhlIGVudGl0eSBuYW1lJ3MgcGx1cmFsXG4gICAqIEBwYXJhbSBwbHVyYWxOYW1lcyB7RW50aXR5UGx1cmFsTmFtZXN9IHBsdXJhbCBuYW1lcyBmb3IgZW50aXR5IHR5cGVzXG4gICAqL1xuICByZWdpc3RlclBsdXJhbE5hbWVzKHBsdXJhbE5hbWVzOiBFbnRpdHlQbHVyYWxOYW1lcyk6IHZvaWQge1xuICAgIHRoaXMucGx1cmFsTmFtZXMgPSB7IC4uLnRoaXMucGx1cmFsTmFtZXMsIC4uLihwbHVyYWxOYW1lcyB8fCB7fSkgfTtcbiAgfVxufVxuIl19