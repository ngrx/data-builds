(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/src/effects/entity-effects.ngsummary", ["require", "exports", "@ngrx/data/src/effects/entity-effects", "@ngrx/effects/src/actions", "@ngrx/data/src/dataservices/entity-data.service", "@ngrx/data/src/actions/entity-action-factory", "@ngrx/data/src/dataservices/persistence-result-handler.service", "@ngrx/data/src/effects/entity-effects-scheduler"], factory);
    }
})(function (require, exports) {
    "use strict";
    /**
     * @fileoverview This file was generated by the Angular template compiler. Do not edit.
     *
     * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
     * tslint:disable
     */ 
    Object.defineProperty(exports, "__esModule", { value: true });
    const i0 = require("@ngrx/data/src/effects/entity-effects");
    const i1 = require("@ngrx/effects/src/actions");
    const i2 = require("@ngrx/data/src/dataservices/entity-data.service");
    const i3 = require("@ngrx/data/src/actions/entity-action-factory");
    const i4 = require("@ngrx/data/src/dataservices/persistence-result-handler.service");
    const i5 = require("@ngrx/data/src/effects/entity-effects-scheduler");
    function EntityEffectsNgSummary() { return [{ summaryKind: 3, type: { reference: i0.EntityEffects, diDeps: [{ isAttribute: false, isHost: false, isSelf: false, isSkipSelf: false, isOptional: false, token: { identifier: { reference: i1.Actions } } }, { isAttribute: false, isHost: false, isSelf: false, isSkipSelf: false, isOptional: false, token: { identifier: { reference: i2.EntityDataService } } }, { isAttribute: false, isHost: false, isSelf: false, isSkipSelf: false, isOptional: false, token: { identifier: { reference: i3.EntityActionFactory } } }, { isAttribute: false, isHost: false, isSelf: false, isSkipSelf: false, isOptional: false, token: { identifier: { reference: i4.PersistenceResultHandler } } }, { isAttribute: false, isHost: false, isSelf: false, isSkipSelf: false, isOptional: true, token: { identifier: { reference: i5.ENTITY_EFFECTS_SCHEDULER } } }], lifecycleHooks: [] } }]; }
    exports.EntityEffectsNgSummary = EntityEffectsNgSummary;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWVmZmVjdHMubmdzdW1tYXJ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lZmZlY3RzL2VudGl0eS1lZmZlY3RzLm5nc3VtbWFyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaTAgZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pMC5Db21wb25lbnRGYWN0b3J5O1xuIl19