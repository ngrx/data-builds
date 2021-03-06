import { Inject, Injectable, Optional } from '@angular/core';
import { PLURAL_NAMES_TOKEN } from './interfaces';
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
}
DefaultPluralizer.decorators = [
    { type: Injectable }
];
/** @nocollapse */
DefaultPluralizer.ctorParameters = () => [
    { type: Array, decorators: [{ type: Optional }, { type: Inject, args: [PLURAL_NAMES_TOKEN,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1wbHVyYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy91dGlscy9kZWZhdWx0LXBsdXJhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdELE9BQU8sRUFBcUIsa0JBQWtCLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFckUsTUFBTSxXQUFXLEdBQUc7SUFDbEIsV0FBVztJQUNYLFVBQVU7SUFDVixVQUFVO0lBQ1YsV0FBVztJQUNYLFVBQVU7SUFDVixhQUFhO0lBQ2IsV0FBVztJQUNYLGFBQWE7SUFDYixPQUFPO0lBQ1AsUUFBUTtDQUNULENBQUM7QUFHRixNQUFNLE9BQU8saUJBQWlCO0lBRzVCLFlBR0UsV0FBZ0M7UUFMbEMsZ0JBQVcsR0FBc0IsRUFBRSxDQUFDO1FBT2xDLGlDQUFpQztRQUNqQyxJQUFJLFdBQVcsRUFBRTtZQUNmLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzNEO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNILFNBQVMsQ0FBQyxJQUFZO1FBQ3BCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEMsSUFBSSxNQUFNLEVBQUU7WUFDVixPQUFPLE1BQU0sQ0FBQztTQUNmO1FBQ0QsbUNBQW1DO1FBQ25DLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDaEQsT0FBTyxJQUFJLENBQUM7WUFDWixZQUFZO1NBQ2I7YUFBTSxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDakMsT0FBTyxJQUFJLEdBQUcsR0FBRyxDQUFDO1lBQ2xCLGdCQUFnQjtTQUNqQjthQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUM3QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQy9DLHlDQUF5QztTQUMxQzthQUFNLElBQUksbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3pDLE9BQU8sSUFBSSxHQUFHLElBQUksQ0FBQztTQUNwQjthQUFNO1lBQ0wsT0FBTyxJQUFJLEdBQUcsR0FBRyxDQUFDO1NBQ25CO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNILG1CQUFtQixDQUFDLFdBQThCO1FBQ2hELElBQUksQ0FBQyxXQUFXLG1DQUFRLElBQUksQ0FBQyxXQUFXLEdBQUssQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDLENBQUUsQ0FBQztJQUNyRSxDQUFDOzs7WUEvQ0YsVUFBVTs7Ozt3Q0FLTixRQUFRLFlBQ1IsTUFBTSxTQUFDLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVudGl0eVBsdXJhbE5hbWVzLCBQTFVSQUxfTkFNRVNfVE9LRU4gfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG5jb25zdCB1bmNvdW50YWJsZSA9IFtcbiAgLy8gJ3NoZWVwJyxcbiAgLy8gJ2Zpc2gnLFxuICAvLyAnZGVlcicsXG4gIC8vICdtb29zZScsXG4gIC8vICdyaWNlJyxcbiAgLy8gJ3NwZWNpZXMnLFxuICAnZXF1aXBtZW50JyxcbiAgJ2luZm9ybWF0aW9uJyxcbiAgJ21vbmV5JyxcbiAgJ3NlcmllcycsXG5dO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGVmYXVsdFBsdXJhbGl6ZXIge1xuICBwbHVyYWxOYW1lczogRW50aXR5UGx1cmFsTmFtZXMgPSB7fTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoUExVUkFMX05BTUVTX1RPS0VOKVxuICAgIHBsdXJhbE5hbWVzOiBFbnRpdHlQbHVyYWxOYW1lc1tdXG4gICkge1xuICAgIC8vIG1lcmdlIGVhY2ggcGx1cmFsIG5hbWVzIG9iamVjdFxuICAgIGlmIChwbHVyYWxOYW1lcykge1xuICAgICAgcGx1cmFsTmFtZXMuZm9yRWFjaCgocG4pID0+IHRoaXMucmVnaXN0ZXJQbHVyYWxOYW1lcyhwbikpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQbHVyYWxpemUgYSBzaW5ndWxhciBuYW1lIHVzaW5nIGNvbW1vbiBFbmdsaXNoIGxhbmd1YWdlIHBsdXJhbGl6YXRpb24gcnVsZXNcbiAgICogRXhhbXBsZXM6IFwiY29tcGFueVwiIC0+IFwiY29tcGFuaWVzXCIsIFwiZW1wbG95ZWVcIiAtPiBcImVtcGxveWVlc1wiLCBcInRheFwiIC0+IFwidGF4ZXNcIlxuICAgKi9cbiAgcGx1cmFsaXplKG5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IHBsdXJhbCA9IHRoaXMucGx1cmFsTmFtZXNbbmFtZV07XG4gICAgaWYgKHBsdXJhbCkge1xuICAgICAgcmV0dXJuIHBsdXJhbDtcbiAgICB9XG4gICAgLy8gc2luZ3VsYXIgYW5kIHBsdXJhbCBhcmUgdGhlIHNhbWVcbiAgICBpZiAodW5jb3VudGFibGUuaW5kZXhPZihuYW1lLnRvTG93ZXJDYXNlKCkpID49IDApIHtcbiAgICAgIHJldHVybiBuYW1lO1xuICAgICAgLy8gdm93ZWwgKyB5XG4gICAgfSBlbHNlIGlmICgvW2FlaW91XXkkLy50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gbmFtZSArICdzJztcbiAgICAgIC8vIGNvbnNvbmFudCArIHlcbiAgICB9IGVsc2UgaWYgKG5hbWUuZW5kc1dpdGgoJ3knKSkge1xuICAgICAgcmV0dXJuIG5hbWUuc3Vic3RyKDAsIG5hbWUubGVuZ3RoIC0gMSkgKyAnaWVzJztcbiAgICAgIC8vIGVuZGluZ3MgdHlwaWNhbGx5IHBsdXJhbGl6ZWQgd2l0aCAnZXMnXG4gICAgfSBlbHNlIGlmICgvW3N8c3N8c2h8Y2h8eHx6XSQvLnRlc3QobmFtZSkpIHtcbiAgICAgIHJldHVybiBuYW1lICsgJ2VzJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5hbWUgKyAncyc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgbWFwcGluZyBvZiBlbnRpdHkgdHlwZSBuYW1lIHRvIHRoZSBlbnRpdHkgbmFtZSdzIHBsdXJhbFxuICAgKiBAcGFyYW0gcGx1cmFsTmFtZXMge0VudGl0eVBsdXJhbE5hbWVzfSBwbHVyYWwgbmFtZXMgZm9yIGVudGl0eSB0eXBlc1xuICAgKi9cbiAgcmVnaXN0ZXJQbHVyYWxOYW1lcyhwbHVyYWxOYW1lczogRW50aXR5UGx1cmFsTmFtZXMpOiB2b2lkIHtcbiAgICB0aGlzLnBsdXJhbE5hbWVzID0geyAuLi50aGlzLnBsdXJhbE5hbWVzLCAuLi4ocGx1cmFsTmFtZXMgfHwge30pIH07XG4gIH1cbn1cbiJdfQ==