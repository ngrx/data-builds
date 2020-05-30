/**
 * @fileoverview added by tsickle
 * Generated from: src/utils/interfaces.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { InjectionToken } from '@angular/core';
/**
 * @abstract
 */
export class Logger {
}
if (false) {
    /**
     * @abstract
     * @param {?=} message
     * @param {...?} optionalParams
     * @return {?}
     */
    Logger.prototype.error = function (message, optionalParams) { };
    /**
     * @abstract
     * @param {?=} message
     * @param {...?} optionalParams
     * @return {?}
     */
    Logger.prototype.log = function (message, optionalParams) { };
    /**
     * @abstract
     * @param {?=} message
     * @param {...?} optionalParams
     * @return {?}
     */
    Logger.prototype.warn = function (message, optionalParams) { };
}
/**
 * Mapping of entity type name to its plural
 * @record
 */
export function EntityPluralNames() { }
/** @type {?} */
export const PLURAL_NAMES_TOKEN = new InjectionToken('@ngrx/data/plural-names');
/**
 * @abstract
 */
export class Pluralizer {
}
if (false) {
    /**
     * @abstract
     * @param {?} name
     * @return {?}
     */
    Pluralizer.prototype.pluralize = function (name) { };
}
//# sourceMappingURL=interfaces.js.map