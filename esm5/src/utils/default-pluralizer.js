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
        { type: Injectable },
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
//# sourceMappingURL=default-pluralizer.js.map