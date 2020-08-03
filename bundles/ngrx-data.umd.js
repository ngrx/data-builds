(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/operators'), require('@angular/common/http'), require('rxjs'), require('@ngrx/entity'), require('@ngrx/store'), require('@ngrx/effects')) :
    typeof define === 'function' && define.amd ? define('@ngrx/data', ['exports', '@angular/core', 'rxjs/operators', '@angular/common/http', 'rxjs', '@ngrx/entity', '@ngrx/store', '@ngrx/effects'], factory) :
    (global = global || self, factory((global.ngrx = global.ngrx || {}, global.ngrx.data = {}), global.ng.core, global.rxjs.operators, global.ng.common.http, global.rxjs, global.entity, global.store, global.effects));
}(this, (function (exports, core, operators, http, rxjs, entity, store, effects) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * Generated from: src/actions/entity-action-factory.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var EntityActionFactory = /** @class */ (function () {
        function EntityActionFactory() {
        }
        // polymorphic create for the two signatures
        /**
         * @template P
         * @param {?} nameOrPayload
         * @param {?=} entityOp
         * @param {?=} data
         * @param {?=} options
         * @return {?}
         */
        EntityActionFactory.prototype.create = function (nameOrPayload, entityOp, data, options) {
            /** @type {?} */
            var payload = typeof nameOrPayload === 'string'
                ? (( /** @type {?} */(Object.assign(Object.assign({}, (options || {})), { entityName: nameOrPayload, entityOp: entityOp,
                    data: data }))))
                : nameOrPayload;
            return this.createCore(payload);
        };
        /**
         * Create an EntityAction to perform an operation (op) for a particular entity type
         * (entityName) with optional data and other optional flags
         * @protected
         * @template P
         * @param {?} payload Defines the EntityAction and its options
         * @return {?}
         */
        EntityActionFactory.prototype.createCore = function (payload) {
            var entityName = payload.entityName, entityOp = payload.entityOp, tag = payload.tag;
            if (!entityName) {
                throw new Error('Missing entity name for new action');
            }
            if (entityOp == null) {
                throw new Error('Missing EntityOp for new action');
            }
            /** @type {?} */
            var type = this.formatActionType(entityOp, tag || entityName);
            return { type: type, payload: payload };
        };
        /**
         * Create an EntityAction from another EntityAction, replacing properties with those from newPayload;
         * @template P
         * @param {?} from Source action that is the base for the new action
         * @param {?} newProperties New EntityAction properties that replace the source action properties
         * @return {?}
         */
        EntityActionFactory.prototype.createFromAction = function (from, newProperties) {
            return this.create(Object.assign(Object.assign({}, from.payload), newProperties));
        };
        /**
         * @param {?} op
         * @param {?} tag
         * @return {?}
         */
        EntityActionFactory.prototype.formatActionType = function (op, tag) {
            return "[" + tag + "] " + op;
            // return `${op} [${tag}]`.toUpperCase(); // example of an alternative
        };
        return EntityActionFactory;
    }());
    EntityActionFactory.decorators = [
        { type: core.Injectable }
    ];

    /**
     * @fileoverview added by tsickle
     * Generated from: src/actions/entity-action-guard.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Guard methods that ensure EntityAction payload is as expected.
     * Each method returns that payload if it passes the guard or
     * throws an error.
     * @template T
     */
    var EntityActionGuard = /** @class */ (function () {
        /**
         * @param {?} entityName
         * @param {?} selectId
         */
        function EntityActionGuard(entityName, selectId) {
            this.entityName = entityName;
            this.selectId = selectId;
        }
        /**
         * Throw if the action payload is not an entity with a valid key
         * @param {?} action
         * @return {?}
         */
        EntityActionGuard.prototype.mustBeEntity = function (action) {
            /** @type {?} */
            var data = this.extractData(action);
            if (!data) {
                return this.throwError(action, "should have a single entity.");
            }
            /** @type {?} */
            var id = this.selectId(data);
            if (this.isNotKeyType(id)) {
                this.throwError(action, "has a missing or invalid entity key (id)");
            }
            return ( /** @type {?} */(data));
        };
        /**
         * Throw if the action payload is not an array of entities with valid keys
         * @param {?} action
         * @return {?}
         */
        EntityActionGuard.prototype.mustBeEntities = function (action) {
            var _this = this;
            /** @type {?} */
            var data = this.extractData(action);
            if (!Array.isArray(data)) {
                return this.throwError(action, "should be an array of entities");
            }
            data.forEach(( /**
             * @param {?} entity
             * @param {?} i
             * @return {?}
             */function (entity, i) {
                /** @type {?} */
                var id = _this.selectId(entity);
                if (_this.isNotKeyType(id)) {
                    /** @type {?} */
                    var msg = ", item " + (i + 1) + ", does not have a valid entity key (id)";
                    _this.throwError(action, msg);
                }
            }));
            return data;
        };
        /**
         * Throw if the action payload is not a single, valid key
         * @param {?} action
         * @return {?}
         */
        EntityActionGuard.prototype.mustBeKey = function (action) {
            /** @type {?} */
            var data = this.extractData(action);
            if (!data) {
                throw new Error("should be a single entity key");
            }
            if (this.isNotKeyType(data)) {
                throw new Error("is not a valid key (id)");
            }
            return data;
        };
        /**
         * Throw if the action payload is not an array of valid keys
         * @param {?} action
         * @return {?}
         */
        EntityActionGuard.prototype.mustBeKeys = function (action) {
            var _this = this;
            /** @type {?} */
            var data = this.extractData(action);
            if (!Array.isArray(data)) {
                return this.throwError(action, "should be an array of entity keys (id)");
            }
            data.forEach(( /**
             * @param {?} id
             * @param {?} i
             * @return {?}
             */function (id, i) {
                if (_this.isNotKeyType(id)) {
                    /** @type {?} */
                    var msg = _this.entityName + " ', item " + (i + 1) + ", is not a valid entity key (id)";
                    _this.throwError(action, msg);
                }
            }));
            return data;
        };
        /**
         * Throw if the action payload is not an update with a valid key (id)
         * @param {?} action
         * @return {?}
         */
        EntityActionGuard.prototype.mustBeUpdate = function (action) {
            /** @type {?} */
            var data = this.extractData(action);
            if (!data) {
                return this.throwError(action, "should be a single entity update");
            }
            var id = data.id, changes = data.changes;
            /** @type {?} */
            var id2 = this.selectId(( /** @type {?} */(changes)));
            if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
                this.throwError(action, "has a missing or invalid entity key (id)");
            }
            return data;
        };
        /**
         * Throw if the action payload is not an array of updates with valid keys (ids)
         * @param {?} action
         * @return {?}
         */
        EntityActionGuard.prototype.mustBeUpdates = function (action) {
            var _this = this;
            /** @type {?} */
            var data = this.extractData(action);
            if (!Array.isArray(data)) {
                return this.throwError(action, "should be an array of entity updates");
            }
            data.forEach(( /**
             * @param {?} item
             * @param {?} i
             * @return {?}
             */function (item, i) {
                var id = item.id, changes = item.changes;
                /** @type {?} */
                var id2 = _this.selectId(( /** @type {?} */(changes)));
                if (_this.isNotKeyType(id) || _this.isNotKeyType(id2)) {
                    _this.throwError(action, ", item " + (i + 1) + ", has a missing or invalid entity key (id)");
                }
            }));
            return data;
        };
        /**
         * Throw if the action payload is not an update response with a valid key (id)
         * @param {?} action
         * @return {?}
         */
        EntityActionGuard.prototype.mustBeUpdateResponse = function (action) {
            /** @type {?} */
            var data = this.extractData(action);
            if (!data) {
                return this.throwError(action, "should be a single entity update");
            }
            var id = data.id, changes = data.changes;
            /** @type {?} */
            var id2 = this.selectId(( /** @type {?} */(changes)));
            if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
                this.throwError(action, "has a missing or invalid entity key (id)");
            }
            return data;
        };
        /**
         * Throw if the action payload is not an array of update responses with valid keys (ids)
         * @param {?} action
         * @return {?}
         */
        EntityActionGuard.prototype.mustBeUpdateResponses = function (action) {
            var _this = this;
            /** @type {?} */
            var data = this.extractData(action);
            if (!Array.isArray(data)) {
                return this.throwError(action, "should be an array of entity updates");
            }
            data.forEach(( /**
             * @param {?} item
             * @param {?} i
             * @return {?}
             */function (item, i) {
                var id = item.id, changes = item.changes;
                /** @type {?} */
                var id2 = _this.selectId(( /** @type {?} */(changes)));
                if (_this.isNotKeyType(id) || _this.isNotKeyType(id2)) {
                    _this.throwError(action, ", item " + (i + 1) + ", has a missing or invalid entity key (id)");
                }
            }));
            return data;
        };
        /**
         * @private
         * @template T
         * @param {?} action
         * @return {?}
         */
        EntityActionGuard.prototype.extractData = function (action) {
            return action.payload && action.payload.data;
        };
        /**
         * Return true if this key (id) is invalid
         * @private
         * @param {?} id
         * @return {?}
         */
        EntityActionGuard.prototype.isNotKeyType = function (id) {
            return typeof id !== 'string' && typeof id !== 'number';
        };
        /**
         * @private
         * @param {?} action
         * @param {?} msg
         * @return {?}
         */
        EntityActionGuard.prototype.throwError = function (action, msg) {
            throw new Error(this.entityName + " EntityAction guard for \"" + action.type + "\": payload " + msg);
        };
        return EntityActionGuard;
    }());
    if (false) {
        /**
         * @type {?}
         * @private
         */
        EntityActionGuard.prototype.entityName;
        /**
         * @type {?}
         * @private
         */
        EntityActionGuard.prototype.selectId;
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, exports) {
        for (var p in m)
            if (p !== "default" && !exports.hasOwnProperty(p))
                __createBinding(exports, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    ;
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (Object.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/utils/utilities.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Default function that returns the entity's primary key (pkey).
     * Assumes that the entity has an `id` pkey property.
     * Returns `undefined` if no entity or `id`.
     * Every selectId fn must return `undefined` when it cannot produce a full pkey.
     * @param {?} entity
     * @return {?}
     */
    function defaultSelectId(entity) {
        return entity == null ? undefined : entity.id;
    }
    /**
     * Flatten first arg if it is an array
     * Allows fn with ...rest signature to be called with an array instead of spread
     * Example:
     * ```
     * // See entity-action-operators.ts
     * const persistOps = [EntityOp.QUERY_ALL, EntityOp.ADD, ...];
     * actions.pipe(ofEntityOp(...persistOps)) // works
     * actions.pipe(ofEntityOp(persistOps)) // also works
     * ```
     *
     * @template T
     * @param {?=} args
     * @return {?}
     */
    function flattenArgs(args) {
        if (args == null) {
            return [];
        }
        if (Array.isArray(args[0])) {
            var _a = __read(args), head = _a[0], tail = _a.slice(1);
            args = __spread(head, tail);
        }
        return args;
    }
    /**
     * Return a function that converts an entity (or partial entity) into the `Update<T>`
     * whose `id` is the primary key and
     * `changes` is the entity (or partial entity of changes).
     * @template T
     * @param {?=} selectId
     * @return {?}
     */
    function toUpdateFactory(selectId) {
        selectId = selectId || (( /** @type {?} */(defaultSelectId)));
        /**
         * Convert an entity (or partial entity) into the `Update<T>`
         * whose `id` is the primary key and
         * `changes` is the entity (or partial entity of changes).
         * @param selectId function that returns the entity's primary key (id)
         */
        return ( /**
         * @param {?} entity
         * @return {?}
         */function toUpdate(entity) {
            /** @type {?} */
            var id = ( /** @type {?} */(selectId))(( /** @type {?} */(entity)));
            if (id == null) {
                throw new Error('Primary key may not be null/undefined.');
            }
            return entity && { id: id, changes: entity };
        });
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/actions/entity-action-operators.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * @template T
     * @param {...?} allowedEntityOps
     * @return {?}
     */
    function ofEntityOp() {
        var allowedEntityOps = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            allowedEntityOps[_i] = arguments[_i];
        }
        /** @type {?} */
        var ops = flattenArgs(allowedEntityOps);
        switch (ops.length) {
            case 0:
                return operators.filter(( /**
                 * @param {?} action
                 * @return {?}
                 */function (action) { return action.payload && action.payload.entityOp != null; }));
            case 1:
                /** @type {?} */
                var op_1 = ops[0];
                return operators.filter(( /**
                 * @param {?} action
                 * @return {?}
                 */function (action) { return action.payload && op_1 === action.payload.entityOp; }));
            default:
                return operators.filter(( /**
                 * @param {?} action
                 * @return {?}
                 */function (action) {
                    /** @type {?} */
                    var entityOp = action.payload && action.payload.entityOp;
                    return entityOp && ops.some(( /**
                     * @param {?} o
                     * @return {?}
                     */function (o) { return o === entityOp; }));
                }));
        }
    }
    /**
     * @template T
     * @param {...?} allowedEntityNames
     * @return {?}
     */
    function ofEntityType() {
        var allowedEntityNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            allowedEntityNames[_i] = arguments[_i];
        }
        /** @type {?} */
        var names = flattenArgs(allowedEntityNames);
        switch (names.length) {
            case 0:
                return operators.filter(( /**
                 * @param {?} action
                 * @return {?}
                 */function (action) { return action.payload && action.payload.entityName != null; }));
            case 1:
                /** @type {?} */
                var name_1 = names[0];
                return operators.filter(( /**
                 * @param {?} action
                 * @return {?}
                 */function (action) { return action.payload && name_1 === action.payload.entityName; }));
            default:
                return operators.filter(( /**
                 * @param {?} action
                 * @return {?}
                 */function (action) {
                    /** @type {?} */
                    var entityName = action.payload && action.payload.entityName;
                    return !!entityName && names.some(( /**
                     * @param {?} n
                     * @return {?}
                     */function (n) { return n === entityName; }));
                }));
        }
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/actions/entity-cache-change-set.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @enum {string} */
    var ChangeSetOperation = {
        Add: "Add",
        Delete: "Delete",
        Update: "Update",
        Upsert: "Upsert",
    };
    /**
     * @record
     * @template T
     */
    function ChangeSetAdd() { }
    if (false) {
        /** @type {?} */
        ChangeSetAdd.prototype.op;
        /** @type {?} */
        ChangeSetAdd.prototype.entityName;
        /** @type {?} */
        ChangeSetAdd.prototype.entities;
    }
    /**
     * @record
     */
    function ChangeSetDelete() { }
    if (false) {
        /** @type {?} */
        ChangeSetDelete.prototype.op;
        /** @type {?} */
        ChangeSetDelete.prototype.entityName;
        /** @type {?} */
        ChangeSetDelete.prototype.entities;
    }
    /**
     * @record
     * @template T
     */
    function ChangeSetUpdate() { }
    if (false) {
        /** @type {?} */
        ChangeSetUpdate.prototype.op;
        /** @type {?} */
        ChangeSetUpdate.prototype.entityName;
        /** @type {?} */
        ChangeSetUpdate.prototype.entities;
    }
    /**
     * @record
     * @template T
     */
    function ChangeSetUpsert() { }
    if (false) {
        /** @type {?} */
        ChangeSetUpsert.prototype.op;
        /** @type {?} */
        ChangeSetUpsert.prototype.entityName;
        /** @type {?} */
        ChangeSetUpsert.prototype.entities;
    }
    /**
     * @record
     * @template T
     */
    function ChangeSet() { }
    if (false) {
        /**
         * An array of ChangeSetItems to be processed in the array order
         * @type {?}
         */
        ChangeSet.prototype.changes;
        /**
         * An arbitrary, serializable object that should travel with the ChangeSet.
         * Meaningful to the ChangeSet producer and consumer. Ignored by \@ngrx/data.
         * @type {?|undefined}
         */
        ChangeSet.prototype.extras;
        /**
         * An arbitrary string, identifying the ChangeSet and perhaps its purpose
         * @type {?|undefined}
         */
        ChangeSet.prototype.tag;
    }
    /**
     * Factory to create a ChangeSetItem for a ChangeSetOperation
     */
    var ChangeSetItemFactory = /** @class */ (function () {
        function ChangeSetItemFactory() {
        }
        /**
         * Create the ChangeSetAdd for new entities of the given entity type
         * @template T
         * @param {?} entityName
         * @param {?} entities
         * @return {?}
         */
        ChangeSetItemFactory.prototype.add = function (entityName, entities) {
            entities = Array.isArray(entities) ? entities : entities ? [entities] : [];
            return { entityName: entityName, op: ChangeSetOperation.Add, entities: entities };
        };
        /**
         * Create the ChangeSetDelete for primary keys of the given entity type
         * @param {?} entityName
         * @param {?} keys
         * @return {?}
         */
        ChangeSetItemFactory.prototype.delete = function (entityName, keys) {
            /** @type {?} */
            var ids = Array.isArray(keys)
                ? keys
                : keys
                    ? (( /** @type {?} */([keys])))
                    : [];
            return { entityName: entityName, op: ChangeSetOperation.Delete, entities: ids };
        };
        /**
         * Create the ChangeSetUpdate for Updates of entities of the given entity type
         * @template T
         * @param {?} entityName
         * @param {?} updates
         * @return {?}
         */
        ChangeSetItemFactory.prototype.update = function (entityName, updates) {
            updates = Array.isArray(updates) ? updates : updates ? [updates] : [];
            return { entityName: entityName, op: ChangeSetOperation.Update, entities: updates };
        };
        /**
         * Create the ChangeSetUpsert for new or existing entities of the given entity type
         * @template T
         * @param {?} entityName
         * @param {?} entities
         * @return {?}
         */
        ChangeSetItemFactory.prototype.upsert = function (entityName, entities) {
            entities = Array.isArray(entities) ? entities : entities ? [entities] : [];
            return { entityName: entityName, op: ChangeSetOperation.Upsert, entities: entities };
        };
        return ChangeSetItemFactory;
    }());
    /**
     * Instance of a factory to create a ChangeSetItem for a ChangeSetOperation
     * @type {?}
     */
    var changeSetItemFactory = new ChangeSetItemFactory();
    /**
     * Return ChangeSet after filtering out null and empty ChangeSetItems.
     * @param {?} changeSet ChangeSet with changes to filter
     * @return {?}
     */
    function excludeEmptyChangeSetItems(changeSet) {
        changeSet = changeSet && changeSet.changes ? changeSet : { changes: [] };
        /** @type {?} */
        var changes = changeSet.changes.filter(( /**
         * @param {?} c
         * @return {?}
         */function (c) { return c != null && c.entities && c.entities.length > 0; }));
        return Object.assign(Object.assign({}, changeSet), { changes: changes });
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/actions/merge-strategy.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @enum {number} */
    var MergeStrategy = {
        /**
         * Update the collection entities and ignore all change tracking for this operation.
         * Each entity's `changeState` is untouched.
         */
        IgnoreChanges: 0,
        /**
         * Updates current values for unchanged entities.
         * For each changed entity it preserves the current value and overwrites the `originalValue` with the merge entity.
         * This is the query-success default.
         */
        PreserveChanges: 1,
        /**
         * Replace the current collection entities.
         * For each merged entity it discards the `changeState` and sets the `changeType` to "unchanged".
         * This is the save-success default.
         */
        OverwriteChanges: 2,
    };
    MergeStrategy[MergeStrategy.IgnoreChanges] = 'IgnoreChanges';
    MergeStrategy[MergeStrategy.PreserveChanges] = 'PreserveChanges';
    MergeStrategy[MergeStrategy.OverwriteChanges] = 'OverwriteChanges';

    /**
     * @fileoverview added by tsickle
     * Generated from: src/actions/entity-cache-action.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @enum {string} */
    var EntityCacheAction = {
        CLEAR_COLLECTIONS: "@ngrx/data/entity-cache/clear-collections",
        LOAD_COLLECTIONS: "@ngrx/data/entity-cache/load-collections",
        MERGE_QUERY_SET: "@ngrx/data/entity-cache/merge-query-set",
        SET_ENTITY_CACHE: "@ngrx/data/entity-cache/set-cache",
        SAVE_ENTITIES: "@ngrx/data/entity-cache/save-entities",
        SAVE_ENTITIES_CANCEL: "@ngrx/data/entity-cache/save-entities-cancel",
        SAVE_ENTITIES_CANCELED: "@ngrx/data/entity-cache/save-entities-canceled",
        SAVE_ENTITIES_ERROR: "@ngrx/data/entity-cache/save-entities-error",
        SAVE_ENTITIES_SUCCESS: "@ngrx/data/entity-cache/save-entities-success",
    };
    /**
     * Hash of entities keyed by EntityCollection name,
     * typically the result of a query that returned results from a multi-collection query
     * that will be merged into an EntityCache via the `MergeQuerySet` action.
     * @record
     */
    function EntityCacheQuerySet() { }
    /**
     * Clear the collections identified in the collectionSet.
     * @param [collections] Array of names of the collections to clear.
     * If empty array, does nothing. If no array, clear all collections.
     * @param [tag] Optional tag to identify the operation from the app perspective.
     */
    var ClearCollections = /** @class */ (function () {
        /**
         * @param {?=} collections
         * @param {?=} tag
         */
        function ClearCollections(collections, tag) {
            this.type = EntityCacheAction.CLEAR_COLLECTIONS;
            this.payload = { collections: collections, tag: tag };
        }
        return ClearCollections;
    }());
    if (false) {
        /** @type {?} */
        ClearCollections.prototype.payload;
        /** @type {?} */
        ClearCollections.prototype.type;
    }
    /**
     * Create entity cache action that loads multiple entity collections at the same time.
     * before any selectors$ observables emit.
     * @param querySet The collections to load, typically the result of a query.
     * @param [tag] Optional tag to identify the operation from the app perspective.
     * in the form of a map of entity collections.
     */
    var LoadCollections = /** @class */ (function () {
        /**
         * @param {?} collections
         * @param {?=} tag
         */
        function LoadCollections(collections, tag) {
            this.type = EntityCacheAction.LOAD_COLLECTIONS;
            this.payload = { collections: collections, tag: tag };
        }
        return LoadCollections;
    }());
    if (false) {
        /** @type {?} */
        LoadCollections.prototype.payload;
        /** @type {?} */
        LoadCollections.prototype.type;
    }
    /**
     * Create entity cache action that merges entities from a query result
     * that returned entities from multiple collections.
     * Corresponding entity cache reducer should add and update all collections
     * at the same time, before any selectors$ observables emit.
     * @param querySet The result of the query in the form of a map of entity collections.
     * These are the entity data to merge into the respective collections.
     * @param mergeStrategy How to merge a queried entity when it is already in the collection.
     * The default is MergeStrategy.PreserveChanges
     * @param [tag] Optional tag to identify the operation from the app perspective.
     */
    var MergeQuerySet = /** @class */ (function () {
        /**
         * @param {?} querySet
         * @param {?=} mergeStrategy
         * @param {?=} tag
         */
        function MergeQuerySet(querySet, mergeStrategy, tag) {
            this.type = EntityCacheAction.MERGE_QUERY_SET;
            this.payload = {
                querySet: querySet,
                mergeStrategy: mergeStrategy === null ? MergeStrategy.PreserveChanges : mergeStrategy,
                tag: tag,
            };
        }
        return MergeQuerySet;
    }());
    if (false) {
        /** @type {?} */
        MergeQuerySet.prototype.payload;
        /** @type {?} */
        MergeQuerySet.prototype.type;
    }
    /**
     * Create entity cache action for replacing the entire entity cache.
     * Dangerous because brute force but useful as when re-hydrating an EntityCache
     * from local browser storage when the application launches.
     * @param cache New state of the entity cache
     * @param [tag] Optional tag to identify the operation from the app perspective.
     */
    var SetEntityCache = /** @class */ (function () {
        /**
         * @param {?} cache
         * @param {?=} tag
         */
        function SetEntityCache(cache, tag) {
            this.cache = cache;
            this.type = EntityCacheAction.SET_ENTITY_CACHE;
            this.payload = { cache: cache, tag: tag };
        }
        return SetEntityCache;
    }());
    if (false) {
        /** @type {?} */
        SetEntityCache.prototype.payload;
        /** @type {?} */
        SetEntityCache.prototype.type;
        /** @type {?} */
        SetEntityCache.prototype.cache;
    }
    // #region SaveEntities
    var SaveEntities = /** @class */ (function () {
        /**
         * @param {?} changeSet
         * @param {?} url
         * @param {?=} options
         */
        function SaveEntities(changeSet, url, options) {
            this.type = EntityCacheAction.SAVE_ENTITIES;
            options = options || {};
            if (changeSet) {
                changeSet.tag = changeSet.tag || options.tag;
            }
            this.payload = Object.assign(Object.assign({ changeSet: changeSet, url: url }, options), { tag: changeSet.tag });
        }
        return SaveEntities;
    }());
    if (false) {
        /** @type {?} */
        SaveEntities.prototype.payload;
        /** @type {?} */
        SaveEntities.prototype.type;
    }
    var SaveEntitiesCancel = /** @class */ (function () {
        /**
         * @param {?} correlationId
         * @param {?=} reason
         * @param {?=} entityNames
         * @param {?=} tag
         */
        function SaveEntitiesCancel(correlationId, reason, entityNames, tag) {
            this.type = EntityCacheAction.SAVE_ENTITIES_CANCEL;
            this.payload = { correlationId: correlationId, reason: reason, entityNames: entityNames, tag: tag };
        }
        return SaveEntitiesCancel;
    }());
    if (false) {
        /** @type {?} */
        SaveEntitiesCancel.prototype.payload;
        /** @type {?} */
        SaveEntitiesCancel.prototype.type;
    }
    var SaveEntitiesCanceled = /** @class */ (function () {
        /**
         * @param {?} correlationId
         * @param {?=} reason
         * @param {?=} tag
         */
        function SaveEntitiesCanceled(correlationId, reason, tag) {
            this.type = EntityCacheAction.SAVE_ENTITIES_CANCEL;
            this.payload = { correlationId: correlationId, reason: reason, tag: tag };
        }
        return SaveEntitiesCanceled;
    }());
    if (false) {
        /** @type {?} */
        SaveEntitiesCanceled.prototype.payload;
        /** @type {?} */
        SaveEntitiesCanceled.prototype.type;
    }
    var SaveEntitiesError = /** @class */ (function () {
        /**
         * @param {?} error
         * @param {?} originalAction
         */
        function SaveEntitiesError(error, originalAction) {
            this.type = EntityCacheAction.SAVE_ENTITIES_ERROR;
            /** @type {?} */
            var correlationId = originalAction.payload.correlationId;
            this.payload = { error: error, originalAction: originalAction, correlationId: correlationId };
        }
        return SaveEntitiesError;
    }());
    if (false) {
        /** @type {?} */
        SaveEntitiesError.prototype.payload;
        /** @type {?} */
        SaveEntitiesError.prototype.type;
    }
    var SaveEntitiesSuccess = /** @class */ (function () {
        /**
         * @param {?} changeSet
         * @param {?} url
         * @param {?=} options
         */
        function SaveEntitiesSuccess(changeSet, url, options) {
            this.type = EntityCacheAction.SAVE_ENTITIES_SUCCESS;
            options = options || {};
            if (changeSet) {
                changeSet.tag = changeSet.tag || options.tag;
            }
            this.payload = Object.assign(Object.assign({ changeSet: changeSet, url: url }, options), { tag: changeSet.tag });
        }
        return SaveEntitiesSuccess;
    }());
    if (false) {
        /** @type {?} */
        SaveEntitiesSuccess.prototype.payload;
        /** @type {?} */
        SaveEntitiesSuccess.prototype.type;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/actions/entity-op.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    // Ensure that these suffix values and the EntityOp suffixes match
    // Cannot do that programmatically.
    /** @enum {string} */
    var EntityOp = {
        // Persistance operations
        CANCEL_PERSIST: "@ngrx/data/cancel-persist",
        CANCELED_PERSIST: "@ngrx/data/canceled-persist",
        QUERY_ALL: "@ngrx/data/query-all",
        QUERY_ALL_SUCCESS: "@ngrx/data/query-all/success",
        QUERY_ALL_ERROR: "@ngrx/data/query-all/error",
        QUERY_LOAD: "@ngrx/data/query-load",
        QUERY_LOAD_SUCCESS: "@ngrx/data/query-load/success",
        QUERY_LOAD_ERROR: "@ngrx/data/query-load/error",
        QUERY_MANY: "@ngrx/data/query-many",
        QUERY_MANY_SUCCESS: "@ngrx/data/query-many/success",
        QUERY_MANY_ERROR: "@ngrx/data/query-many/error",
        QUERY_BY_KEY: "@ngrx/data/query-by-key",
        QUERY_BY_KEY_SUCCESS: "@ngrx/data/query-by-key/success",
        QUERY_BY_KEY_ERROR: "@ngrx/data/query-by-key/error",
        SAVE_ADD_MANY: "@ngrx/data/save/add-many",
        SAVE_ADD_MANY_ERROR: "@ngrx/data/save/add-many/error",
        SAVE_ADD_MANY_SUCCESS: "@ngrx/data/save/add-many/success",
        SAVE_ADD_ONE: "@ngrx/data/save/add-one",
        SAVE_ADD_ONE_ERROR: "@ngrx/data/save/add-one/error",
        SAVE_ADD_ONE_SUCCESS: "@ngrx/data/save/add-one/success",
        SAVE_DELETE_MANY: "@ngrx/data/save/delete-many",
        SAVE_DELETE_MANY_SUCCESS: "@ngrx/data/save/delete-many/success",
        SAVE_DELETE_MANY_ERROR: "@ngrx/data/save/delete-many/error",
        SAVE_DELETE_ONE: "@ngrx/data/save/delete-one",
        SAVE_DELETE_ONE_SUCCESS: "@ngrx/data/save/delete-one/success",
        SAVE_DELETE_ONE_ERROR: "@ngrx/data/save/delete-one/error",
        SAVE_UPDATE_MANY: "@ngrx/data/save/update-many",
        SAVE_UPDATE_MANY_SUCCESS: "@ngrx/data/save/update-many/success",
        SAVE_UPDATE_MANY_ERROR: "@ngrx/data/save/update-many/error",
        SAVE_UPDATE_ONE: "@ngrx/data/save/update-one",
        SAVE_UPDATE_ONE_SUCCESS: "@ngrx/data/save/update-one/success",
        SAVE_UPDATE_ONE_ERROR: "@ngrx/data/save/update-one/error",
        // Use only if the server supports upsert;
        SAVE_UPSERT_MANY: "@ngrx/data/save/upsert-many",
        SAVE_UPSERT_MANY_SUCCESS: "@ngrx/data/save/upsert-many/success",
        SAVE_UPSERT_MANY_ERROR: "@ngrx/data/save/upsert-many/error",
        // Use only if the server supports upsert;
        SAVE_UPSERT_ONE: "@ngrx/data/save/upsert-one",
        SAVE_UPSERT_ONE_SUCCESS: "@ngrx/data/save/upsert-one/success",
        SAVE_UPSERT_ONE_ERROR: "@ngrx/data/save/upsert-one/error",
        // Cache operations
        ADD_ALL: "@ngrx/data/add-all",
        ADD_MANY: "@ngrx/data/add-many",
        ADD_ONE: "@ngrx/data/add-one",
        REMOVE_ALL: "@ngrx/data/remove-all",
        REMOVE_MANY: "@ngrx/data/remove-many",
        REMOVE_ONE: "@ngrx/data/remove-one",
        UPDATE_MANY: "@ngrx/data/update-many",
        UPDATE_ONE: "@ngrx/data/update-one",
        UPSERT_MANY: "@ngrx/data/upsert-many",
        UPSERT_ONE: "@ngrx/data/upsert-one",
        COMMIT_ALL: "@ngrx/data/commit-all",
        COMMIT_MANY: "@ngrx/data/commit-many",
        COMMIT_ONE: "@ngrx/data/commit-one",
        UNDO_ALL: "@ngrx/data/undo-all",
        UNDO_MANY: "@ngrx/data/undo-many",
        UNDO_ONE: "@ngrx/data/undo-one",
        SET_CHANGE_STATE: "@ngrx/data/set-change-state",
        SET_COLLECTION: "@ngrx/data/set-collection",
        SET_FILTER: "@ngrx/data/set-filter",
        SET_LOADED: "@ngrx/data/set-loaded",
        SET_LOADING: "@ngrx/data/set-loading",
    };
    /**
     * "Success" suffix appended to EntityOps that are successful.
     * @type {?}
     */
    var OP_SUCCESS = '/success';
    /**
     * "Error" suffix appended to EntityOps that have failed.
     * @type {?}
     */
    var OP_ERROR = '/error';
    /**
     * Make the error EntityOp corresponding to the given EntityOp
     * @param {?} op
     * @return {?}
     */
    function makeErrorOp(op) {
        return ( /** @type {?} */((op + OP_ERROR)));
    }
    /**
     * Make the success EntityOp corresponding to the given EntityOp
     * @param {?} op
     * @return {?}
     */
    function makeSuccessOp(op) {
        return ( /** @type {?} */((op + OP_SUCCESS)));
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/dataservices/data-service-error.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Error from a DataService
     * The source error either comes from a failed HTTP response or was thrown within the service.
     * @param error the HttpErrorResponse or the error thrown by the service
     * @param requestData the HTTP request information such as the method and the url.
     */
    // If extend from Error, `dse instanceof DataServiceError` returns false
    // in some (all?) unit tests so don't bother trying.
    var DataServiceError = /** @class */ (function () {
        /**
         * @param {?} error
         * @param {?} requestData
         */
        function DataServiceError(error, requestData) {
            this.error = error;
            this.requestData = requestData;
            this.message = typeof error === 'string' ? error : extractMessage(error);
        }
        return DataServiceError;
    }());
    if (false) {
        /** @type {?} */
        DataServiceError.prototype.message;
        /** @type {?} */
        DataServiceError.prototype.error;
        /** @type {?} */
        DataServiceError.prototype.requestData;
    }
    // Many ways the error can be shaped. These are the ways we recognize.
    /**
     * @param {?} sourceError
     * @return {?}
     */
    function extractMessage(sourceError) {
        var error = sourceError.error, body = sourceError.body, message = sourceError.message;
        /** @type {?} */
        var errMessage = null;
        if (error) {
            // prefer HttpErrorResponse.error to its message property
            errMessage = typeof error === 'string' ? error : error.message;
        }
        else if (message) {
            errMessage = message;
        }
        else if (body) {
            // try the body if no error or message property
            errMessage = typeof body === 'string' ? body : body.error;
        }
        return typeof errMessage === 'string'
            ? errMessage
            : errMessage
                ? JSON.stringify(errMessage)
                : null;
    }
    /**
     * Payload for an EntityAction data service error such as QUERY_ALL_ERROR
     * @record
     */
    function EntityActionDataServiceError() { }
    if (false) {
        /** @type {?} */
        EntityActionDataServiceError.prototype.error;
        /** @type {?} */
        EntityActionDataServiceError.prototype.originalAction;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/dataservices/default-data-service-config.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Optional configuration settings for an entity collection data service
     * such as the `DefaultDataService<T>`.
     * @abstract
     */
    var DefaultDataServiceConfig = /** @class */ (function () {
        function DefaultDataServiceConfig() {
        }
        return DefaultDataServiceConfig;
    }());
    if (false) {
        /**
         * root path of the web api.  may also include protocol, domain, and port
         * for remote api, e.g.: `'https://api-domain.com:8000/api/v1'` (default: 'api')
         * @type {?}
         */
        DefaultDataServiceConfig.prototype.root;
        /**
         * Known entity HttpResourceUrls.
         * HttpUrlGenerator will create these URLs for entity types not listed here.
         * @type {?}
         */
        DefaultDataServiceConfig.prototype.entityHttpResourceUrls;
        /**
         * Is a DELETE 404 really OK? (default: true)
         * @type {?}
         */
        DefaultDataServiceConfig.prototype.delete404OK;
        /**
         * Simulate GET latency in a demo (default: 0)
         * @type {?}
         */
        DefaultDataServiceConfig.prototype.getDelay;
        /**
         * Simulate save method (PUT/POST/DELETE) latency in a demo (default: 0)
         * @type {?}
         */
        DefaultDataServiceConfig.prototype.saveDelay;
        /**
         * request timeout in MS (default: 0)
         * @type {?}
         */
        DefaultDataServiceConfig.prototype.timeout;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/utils/interfaces.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * @abstract
     */
    var Logger = /** @class */ (function () {
        function Logger() {
        }
        return Logger;
    }());
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
    function EntityPluralNames() { }
    /** @type {?} */
    var PLURAL_NAMES_TOKEN = new core.InjectionToken('@ngrx/data/plural-names');
    /**
     * @abstract
     */
    var Pluralizer = /** @class */ (function () {
        function Pluralizer() {
        }
        return Pluralizer;
    }());
    if (false) {
        /**
         * @abstract
         * @param {?} name
         * @return {?}
         */
        Pluralizer.prototype.pluralize = function (name) { };
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/dataservices/http-url-generator.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Known resource URLS for specific entity types.
     * Each entity's resource URLS are endpoints that
     * target single entity and multi-entity HTTP operations.
     * Used by the `DefaultHttpUrlGenerator`.
     * @abstract
     */
    var EntityHttpResourceUrls = /** @class */ (function () {
        function EntityHttpResourceUrls() {
        }
        return EntityHttpResourceUrls;
    }());
    /**
     * Resource URLS for HTTP operations that target single entity
     * and multi-entity endpoints.
     * @record
     */
    function HttpResourceUrls() { }
    if (false) {
        /**
         * The URL path for a single entity endpoint, e.g, `some-api-root/hero/`
         * such as you'd use to add a hero.
         * Example: `httpClient.post<Hero>('some-api-root/hero/', addedHero)`.
         * Note trailing slash (/).
         * @type {?}
         */
        HttpResourceUrls.prototype.entityResourceUrl;
        /**
         * The URL path for a multiple-entity endpoint, e.g, `some-api-root/heroes/`
         * such as you'd use when getting all heroes.
         * Example: `httpClient.get<Hero[]>('some-api-root/heroes/')`
         * Note trailing slash (/).
         * @type {?}
         */
        HttpResourceUrls.prototype.collectionResourceUrl;
    }
    /**
     * Generate the base part of an HTTP URL for
     * single entity or entity collection resource
     * @abstract
     */
    var HttpUrlGenerator = /** @class */ (function () {
        function HttpUrlGenerator() {
        }
        return HttpUrlGenerator;
    }());
    if (false) {
        /**
         * Return the base URL for a single entity resource,
         * e.g., the base URL to get a single hero by its id
         * @abstract
         * @param {?} entityName
         * @param {?} root
         * @return {?}
         */
        HttpUrlGenerator.prototype.entityResource = function (entityName, root) { };
        /**
         * Return the base URL for a collection resource,
         * e.g., the base URL to get all heroes
         * @abstract
         * @param {?} entityName
         * @param {?} root
         * @return {?}
         */
        HttpUrlGenerator.prototype.collectionResource = function (entityName, root) { };
        /**
         * Register known single-entity and collection resource URLs for HTTP calls
         * @abstract
         * @param {?=} entityHttpResourceUrls {EntityHttpResourceUrls} resource urls for specific entity type names
         * @return {?}
         */
        HttpUrlGenerator.prototype.registerHttpResourceUrls = function (entityHttpResourceUrls) { };
    }
    var DefaultHttpUrlGenerator = /** @class */ (function () {
        /**
         * @param {?} pluralizer
         */
        function DefaultHttpUrlGenerator(pluralizer) {
            this.pluralizer = pluralizer;
            /**
             * Known single-entity and collection resource URLs for HTTP calls.
             * Generator methods returns these resource URLs for a given entity type name.
             * If the resources for an entity type name are not know, it generates
             * and caches a resource name for future use
             */
            this.knownHttpResourceUrls = {};
        }
        /**
         * Get or generate the entity and collection resource URLs for the given entity type name
         * @protected
         * @param {?} entityName {string} Name of the entity type, e.g, 'Hero'
         * @param {?} root {string} Root path to the resource, e.g., 'some-api`
         * @return {?}
         */
        DefaultHttpUrlGenerator.prototype.getResourceUrls = function (entityName, root) {
            var _a;
            /** @type {?} */
            var resourceUrls = this.knownHttpResourceUrls[entityName];
            if (!resourceUrls) {
                /** @type {?} */
                var nRoot = normalizeRoot(root);
                resourceUrls = {
                    entityResourceUrl: (nRoot + "/" + entityName + "/").toLowerCase(),
                    collectionResourceUrl: (nRoot + "/" + this.pluralizer.pluralize(entityName) + "/").toLowerCase(),
                };
                this.registerHttpResourceUrls((_a = {}, _a[entityName] = resourceUrls, _a));
            }
            return resourceUrls;
        };
        /**
         * Create the path to a single entity resource
         * @param {?} entityName {string} Name of the entity type, e.g, 'Hero'
         * @param {?} root {string} Root path to the resource, e.g., 'some-api`
         * @return {?} complete path to resource, e.g, 'some-api/hero'
         */
        DefaultHttpUrlGenerator.prototype.entityResource = function (entityName, root) {
            return this.getResourceUrls(entityName, root).entityResourceUrl;
        };
        /**
         * Create the path to a multiple entity (collection) resource
         * @param {?} entityName {string} Name of the entity type, e.g, 'Hero'
         * @param {?} root {string} Root path to the resource, e.g., 'some-api`
         * @return {?} complete path to resource, e.g, 'some-api/heroes'
         */
        DefaultHttpUrlGenerator.prototype.collectionResource = function (entityName, root) {
            return this.getResourceUrls(entityName, root).collectionResourceUrl;
        };
        /**
         * Register known single-entity and collection resource URLs for HTTP calls
         * @param {?} entityHttpResourceUrls {EntityHttpResourceUrls} resource urls for specific entity type names
         * Well-formed resource urls end in a '/';
         * Note: this method does not ensure that resource urls are well-formed.
         * @return {?}
         */
        DefaultHttpUrlGenerator.prototype.registerHttpResourceUrls = function (entityHttpResourceUrls) {
            this.knownHttpResourceUrls = Object.assign(Object.assign({}, this.knownHttpResourceUrls), (entityHttpResourceUrls || {}));
        };
        return DefaultHttpUrlGenerator;
    }());
    DefaultHttpUrlGenerator.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    DefaultHttpUrlGenerator.ctorParameters = function () { return [
        { type: Pluralizer }
    ]; };
    if (false) {
        /**
         * Known single-entity and collection resource URLs for HTTP calls.
         * Generator methods returns these resource URLs for a given entity type name.
         * If the resources for an entity type name are not know, it generates
         * and caches a resource name for future use
         * @type {?}
         * @protected
         */
        DefaultHttpUrlGenerator.prototype.knownHttpResourceUrls;
        /**
         * @type {?}
         * @private
         */
        DefaultHttpUrlGenerator.prototype.pluralizer;
    }
    /**
     * Remove leading & trailing spaces or slashes
     * @param {?} root
     * @return {?}
     */
    function normalizeRoot(root) {
        return root.replace(/^[\/\s]+|[\/\s]+$/g, '');
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/dataservices/default-data.service.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * A basic, generic entity data service
     * suitable for persistence of most entities.
     * Assumes a common REST-y web API
     * @template T
     */
    var DefaultDataService = /** @class */ (function () {
        /**
         * @param {?} entityName
         * @param {?} http
         * @param {?} httpUrlGenerator
         * @param {?=} config
         */
        function DefaultDataService(entityName, http, httpUrlGenerator, config) {
            this.http = http;
            this.httpUrlGenerator = httpUrlGenerator;
            this.getDelay = 0;
            this.saveDelay = 0;
            this.timeout = 0;
            this._name = entityName + " DefaultDataService";
            this.entityName = entityName;
            var _a = config || {}, _b = _a.root, root = _b === void 0 ? 'api' : _b, _c = _a.delete404OK, delete404OK = _c === void 0 ? true : _c, _d = _a.getDelay, getDelay = _d === void 0 ? 0 : _d, _e = _a.saveDelay, saveDelay = _e === void 0 ? 0 : _e, _f = _a.timeout, to = _f === void 0 ? 0 : _f;
            this.delete404OK = delete404OK;
            this.entityUrl = httpUrlGenerator.entityResource(entityName, root);
            this.entitiesUrl = httpUrlGenerator.collectionResource(entityName, root);
            this.getDelay = getDelay;
            this.saveDelay = saveDelay;
            this.timeout = to;
        }
        Object.defineProperty(DefaultDataService.prototype, "name", {
            /**
             * @return {?}
             */
            get: function () {
                return this._name;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * @param {?} entity
         * @return {?}
         */
        DefaultDataService.prototype.add = function (entity) {
            /** @type {?} */
            var entityOrError = entity || new Error("No \"" + this.entityName + "\" entity to add");
            return this.execute('POST', this.entityUrl, entityOrError);
        };
        /**
         * @param {?} key
         * @return {?}
         */
        DefaultDataService.prototype.delete = function (key) {
            /** @type {?} */
            var err;
            if (key == null) {
                err = new Error("No \"" + this.entityName + "\" key to delete");
            }
            return this.execute('DELETE', this.entityUrl + key, err).pipe(
            // forward the id of deleted entity as the result of the HTTP DELETE
            operators.map(( /**
             * @param {?} result
             * @return {?}
             */function (result) { return ( /** @type {?} */(key)); })));
        };
        /**
         * @return {?}
         */
        DefaultDataService.prototype.getAll = function () {
            return this.execute('GET', this.entitiesUrl);
        };
        /**
         * @param {?} key
         * @return {?}
         */
        DefaultDataService.prototype.getById = function (key) {
            /** @type {?} */
            var err;
            if (key == null) {
                err = new Error("No \"" + this.entityName + "\" key to get");
            }
            return this.execute('GET', this.entityUrl + key, err);
        };
        /**
         * @param {?} queryParams
         * @return {?}
         */
        DefaultDataService.prototype.getWithQuery = function (queryParams) {
            /** @type {?} */
            var qParams = typeof queryParams === 'string'
                ? { fromString: queryParams }
                : { fromObject: queryParams };
            /** @type {?} */
            var params = new http.HttpParams(qParams);
            return this.execute('GET', this.entitiesUrl, undefined, { params: params });
        };
        /**
         * @param {?} update
         * @return {?}
         */
        DefaultDataService.prototype.update = function (update) {
            /** @type {?} */
            var id = update && update.id;
            /** @type {?} */
            var updateOrError = id == null
                ? new Error("No \"" + this.entityName + "\" update data or id")
                : update.changes;
            return this.execute('PUT', this.entityUrl + id, updateOrError);
        };
        // Important! Only call if the backend service supports upserts as a POST to the target URL
        /**
         * @param {?} entity
         * @return {?}
         */
        DefaultDataService.prototype.upsert = function (entity) {
            /** @type {?} */
            var entityOrError = entity || new Error("No \"" + this.entityName + "\" entity to upsert");
            return this.execute('POST', this.entityUrl, entityOrError);
        };
        /**
         * @protected
         * @param {?} method
         * @param {?} url
         * @param {?=} data
         * @param {?=} options
         * @return {?}
         */
        DefaultDataService.prototype.execute = function (method, url, data, // data, error, or undefined/null
        options) {
            /** @type {?} */
            var req = { method: method, url: url, data: data, options: options };
            if (data instanceof Error) {
                return this.handleError(req)(data);
            }
            /** @type {?} */
            var result$;
            switch (method) {
                case 'DELETE': {
                    result$ = this.http.delete(url, options);
                    if (this.saveDelay) {
                        result$ = result$.pipe(operators.delay(this.saveDelay));
                    }
                    break;
                }
                case 'GET': {
                    result$ = this.http.get(url, options);
                    if (this.getDelay) {
                        result$ = result$.pipe(operators.delay(this.getDelay));
                    }
                    break;
                }
                case 'POST': {
                    result$ = this.http.post(url, data, options);
                    if (this.saveDelay) {
                        result$ = result$.pipe(operators.delay(this.saveDelay));
                    }
                    break;
                }
                // N.B.: It must return an Update<T>
                case 'PUT': {
                    result$ = this.http.put(url, data, options);
                    if (this.saveDelay) {
                        result$ = result$.pipe(operators.delay(this.saveDelay));
                    }
                    break;
                }
                default: {
                    /** @type {?} */
                    var error = new Error('Unimplemented HTTP method, ' + method);
                    result$ = rxjs.throwError(error);
                }
            }
            if (this.timeout) {
                result$ = result$.pipe(operators.timeout(this.timeout + this.saveDelay));
            }
            return result$.pipe(operators.catchError(this.handleError(req)));
        };
        /**
         * @private
         * @param {?} reqData
         * @return {?}
         */
        DefaultDataService.prototype.handleError = function (reqData) {
            var _this = this;
            return ( /**
             * @param {?} err
             * @return {?}
             */function (err) {
                /** @type {?} */
                var ok = _this.handleDelete404(err, reqData);
                if (ok) {
                    return ok;
                }
                /** @type {?} */
                var error = new DataServiceError(err, reqData);
                return rxjs.throwError(error);
            });
        };
        /**
         * @private
         * @param {?} error
         * @param {?} reqData
         * @return {?}
         */
        DefaultDataService.prototype.handleDelete404 = function (error, reqData) {
            if (error.status === 404 &&
                reqData.method === 'DELETE' &&
                this.delete404OK) {
                return rxjs.of({});
            }
            return undefined;
        };
        return DefaultDataService;
    }());
    if (false) {
        /**
         * @type {?}
         * @protected
         */
        DefaultDataService.prototype._name;
        /**
         * @type {?}
         * @protected
         */
        DefaultDataService.prototype.delete404OK;
        /**
         * @type {?}
         * @protected
         */
        DefaultDataService.prototype.entityName;
        /**
         * @type {?}
         * @protected
         */
        DefaultDataService.prototype.entityUrl;
        /**
         * @type {?}
         * @protected
         */
        DefaultDataService.prototype.entitiesUrl;
        /**
         * @type {?}
         * @protected
         */
        DefaultDataService.prototype.getDelay;
        /**
         * @type {?}
         * @protected
         */
        DefaultDataService.prototype.saveDelay;
        /**
         * @type {?}
         * @protected
         */
        DefaultDataService.prototype.timeout;
        /**
         * @type {?}
         * @protected
         */
        DefaultDataService.prototype.http;
        /**
         * @type {?}
         * @protected
         */
        DefaultDataService.prototype.httpUrlGenerator;
    }
    /**
     * Create a basic, generic entity data service
     * suitable for persistence of most entities.
     * Assumes a common REST-y web API
     */
    var DefaultDataServiceFactory = /** @class */ (function () {
        /**
         * @param {?} http
         * @param {?} httpUrlGenerator
         * @param {?=} config
         */
        function DefaultDataServiceFactory(http, httpUrlGenerator, config) {
            this.http = http;
            this.httpUrlGenerator = httpUrlGenerator;
            this.config = config;
            config = config || {};
            httpUrlGenerator.registerHttpResourceUrls(config.entityHttpResourceUrls);
        }
        /**
         * Create a default {EntityCollectionDataService} for the given entity type
         * @template T
         * @param {?} entityName {string} Name of the entity type for this data service
         * @return {?}
         */
        DefaultDataServiceFactory.prototype.create = function (entityName) {
            return new DefaultDataService(entityName, this.http, this.httpUrlGenerator, this.config);
        };
        return DefaultDataServiceFactory;
    }());
    DefaultDataServiceFactory.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    DefaultDataServiceFactory.ctorParameters = function () { return [
        { type: http.HttpClient },
        { type: HttpUrlGenerator },
        { type: DefaultDataServiceConfig, decorators: [{ type: core.Optional }] }
    ]; };
    if (false) {
        /**
         * @type {?}
         * @protected
         */
        DefaultDataServiceFactory.prototype.http;
        /**
         * @type {?}
         * @protected
         */
        DefaultDataServiceFactory.prototype.httpUrlGenerator;
        /**
         * @type {?}
         * @protected
         */
        DefaultDataServiceFactory.prototype.config;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/entity-metadata/entity-definition.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * @record
     * @template T
     */
    function EntityDefinition() { }
    if (false) {
        /** @type {?} */
        EntityDefinition.prototype.entityName;
        /** @type {?} */
        EntityDefinition.prototype.entityAdapter;
        /** @type {?|undefined} */
        EntityDefinition.prototype.entityDispatcherOptions;
        /** @type {?} */
        EntityDefinition.prototype.initialState;
        /** @type {?} */
        EntityDefinition.prototype.metadata;
        /** @type {?} */
        EntityDefinition.prototype.noChangeTracking;
        /** @type {?} */
        EntityDefinition.prototype.selectId;
        /** @type {?} */
        EntityDefinition.prototype.sortComparer;
    }
    /**
     * @template T, S
     * @param {?} metadata
     * @return {?}
     */
    function createEntityDefinition(metadata) {
        /** @type {?} */
        var entityName = metadata.entityName;
        if (!entityName) {
            throw new Error('Missing required entityName');
        }
        metadata.entityName = entityName = entityName.trim();
        /** @type {?} */
        var selectId = metadata.selectId || defaultSelectId;
        /** @type {?} */
        var sortComparer = (metadata.sortComparer = metadata.sortComparer || false);
        /** @type {?} */
        var entityAdapter = entity.createEntityAdapter({ selectId: selectId, sortComparer: sortComparer });
        /** @type {?} */
        var entityDispatcherOptions = metadata.entityDispatcherOptions || {};
        /** @type {?} */
        var initialState = entityAdapter.getInitialState(Object.assign({ entityName: entityName, filter: '', loaded: false, loading: false, changeState: {} }, (metadata.additionalCollectionState || {})));
        /** @type {?} */
        var noChangeTracking = metadata.noChangeTracking === true;
        return {
            entityName: entityName,
            entityAdapter: entityAdapter,
            entityDispatcherOptions: entityDispatcherOptions,
            initialState: initialState,
            metadata: metadata,
            noChangeTracking: noChangeTracking,
            selectId: selectId,
            sortComparer: sortComparer,
        };
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/entity-metadata/entity-metadata.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var ENTITY_METADATA_TOKEN = new core.InjectionToken('@ngrx/data/entity-metadata');
    /**
     * Metadata that describe an entity type and its collection to \@ngrx/data
     * @record
     * @template T, S
     */
    function EntityMetadata() { }
    if (false) {
        /** @type {?} */
        EntityMetadata.prototype.entityName;
        /** @type {?|undefined} */
        EntityMetadata.prototype.entityDispatcherOptions;
        /** @type {?|undefined} */
        EntityMetadata.prototype.filterFn;
        /** @type {?|undefined} */
        EntityMetadata.prototype.noChangeTracking;
        /** @type {?|undefined} */
        EntityMetadata.prototype.selectId;
        /** @type {?|undefined} */
        EntityMetadata.prototype.sortComparer;
        /** @type {?|undefined} */
        EntityMetadata.prototype.additionalCollectionState;
    }
    /**
     * Map entity-type name to its EntityMetadata
     * @record
     */
    function EntityMetadataMap() { }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/entity-metadata/entity-definition.service.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * @record
     */
    function EntityDefinitions() { }
    /**
     * Registry of EntityDefinitions for all cached entity types
     */
    var EntityDefinitionService = /** @class */ (function () {
        /**
         * @param {?} entityMetadataMaps
         */
        function EntityDefinitionService(entityMetadataMaps) {
            var _this = this;
            /**
             * {EntityDefinition} for all cached entity types
             */
            this.definitions = {};
            if (entityMetadataMaps) {
                entityMetadataMaps.forEach(( /**
                 * @param {?} map
                 * @return {?}
                 */function (map) { return _this.registerMetadataMap(map); }));
            }
        }
        /**
         * Get (or create) a data service for entity type
         * @template T
         * @param {?} entityName - the name of the type
         *
         * Examples:
         *   getDefinition('Hero'); // definition for Heroes, untyped
         *   getDefinition<Hero>(`Hero`); // definition for Heroes, typed with Hero interface
         * @param {?=} shouldThrow
         * @return {?}
         */
        EntityDefinitionService.prototype.getDefinition = function (entityName, shouldThrow) {
            if (shouldThrow === void 0) { shouldThrow = true; }
            entityName = entityName.trim();
            /** @type {?} */
            var definition = this.definitions[entityName];
            if (!definition && shouldThrow) {
                throw new Error("No EntityDefinition for entity type \"" + entityName + "\".");
            }
            return definition;
        };
        //////// Registration methods //////////
        /**
         * Create and register the {EntityDefinition} for the {EntityMetadata} of an entity type
         * @param {?} metadata
         * @return {?}
         */
        EntityDefinitionService.prototype.registerMetadata = function (metadata) {
            if (metadata) {
                /** @type {?} */
                var definition = createEntityDefinition(metadata);
                this.registerDefinition(definition);
            }
        };
        /**
         * Register an EntityMetadataMap.
         * @param {?=} metadataMap - a map of entityType names to entity metadata
         *
         * Examples:
         *   registerMetadataMap({
         *     'Hero': myHeroMetadata,
         *     Villain: myVillainMetadata
         *   });
         * @return {?}
         */
        EntityDefinitionService.prototype.registerMetadataMap = function (metadataMap) {
            var _this = this;
            if (metadataMap === void 0) { metadataMap = {}; }
            // The entity type name should be the same as the map key
            Object.keys(metadataMap || {}).forEach(( /**
             * @param {?} entityName
             * @return {?}
             */function (entityName) { return _this.registerMetadata(Object.assign({ entityName: entityName }, metadataMap[entityName])); }));
        };
        /**
         * Register an {EntityDefinition} for an entity type
         * @template T
         * @param {?} definition - EntityDefinition of a collection for that entity type
         *
         * Examples:
         *   registerDefinition('Hero', myHeroEntityDefinition);
         * @return {?}
         */
        EntityDefinitionService.prototype.registerDefinition = function (definition) {
            this.definitions[definition.entityName] = definition;
        };
        /**
         * Register a batch of EntityDefinitions.
         * @param {?} definitions - map of entityType name and associated EntityDefinitions to merge.
         *
         * Examples:
         *   registerDefinitions({
         *     'Hero': myHeroEntityDefinition,
         *     Villain: myVillainEntityDefinition
         *   });
         * @return {?}
         */
        EntityDefinitionService.prototype.registerDefinitions = function (definitions) {
            Object.assign(this.definitions, definitions);
        };
        return EntityDefinitionService;
    }());
    EntityDefinitionService.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    EntityDefinitionService.ctorParameters = function () { return [
        { type: Array, decorators: [{ type: core.Optional }, { type: core.Inject, args: [ENTITY_METADATA_TOKEN,] }] }
    ]; };
    if (false) {
        /**
         * {EntityDefinition} for all cached entity types
         * @type {?}
         * @private
         */
        EntityDefinitionService.prototype.definitions;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/dataservices/entity-cache-data.service.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var updateOp = ChangeSetOperation.Update;
    /**
     * Default data service for making remote service calls targeting the entire EntityCache.
     * See EntityDataService for services that target a single EntityCollection
     */
    var EntityCacheDataService = /** @class */ (function () {
        /**
         * @param {?} entityDefinitionService
         * @param {?} http
         * @param {?=} config
         */
        function EntityCacheDataService(entityDefinitionService, http, config) {
            this.entityDefinitionService = entityDefinitionService;
            this.http = http;
            this.idSelectors = {};
            this.saveDelay = 0;
            this.timeout = 0;
            var _a = config || {}, _b = _a.saveDelay, saveDelay = _b === void 0 ? 0 : _b, _c = _a.timeout, to = _c === void 0 ? 0 : _c;
            this.saveDelay = saveDelay;
            this.timeout = to;
        }
        /**
         * Save changes to multiple entities across one or more entity collections.
         * Server endpoint must understand the essential SaveEntities protocol,
         * in particular the ChangeSet interface (except for Update<T>).
         * This implementation extracts the entity changes from a ChangeSet Update<T>[] and sends those.
         * It then reconstructs Update<T>[] in the returned observable result.
         * @param {?} changeSet  An array of SaveEntityItems.
         * Each SaveEntityItem describe a change operation for one or more entities of a single collection,
         * known by its 'entityName'.
         * @param {?} url The server endpoint that receives this request.
         * @return {?}
         */
        EntityCacheDataService.prototype.saveEntities = function (changeSet, url) {
            var _this = this;
            changeSet = this.filterChangeSet(changeSet);
            // Assume server doesn't understand @ngrx/entity Update<T> structure;
            // Extract the entity changes from the Update<T>[] and restore on the return from server
            changeSet = this.flattenUpdates(changeSet);
            /** @type {?} */
            var result$ = this.http
                .post(url, changeSet)
                .pipe(operators.map(( /**
         * @param {?} result
         * @return {?}
         */function (result) { return _this.restoreUpdates(result); })), operators.catchError(this.handleError({ method: 'POST', url: url, data: changeSet })));
            if (this.timeout) {
                result$ = result$.pipe(operators.timeout(this.timeout));
            }
            if (this.saveDelay) {
                result$ = result$.pipe(operators.delay(this.saveDelay));
            }
            return result$;
        };
        // #region helpers
        /**
         * @protected
         * @param {?} reqData
         * @return {?}
         */
        EntityCacheDataService.prototype.handleError = function (reqData) {
            return ( /**
             * @param {?} err
             * @return {?}
             */function (err) {
                /** @type {?} */
                var error = new DataServiceError(err, reqData);
                return rxjs.throwError(error);
            });
        };
        /**
         * Filter changeSet to remove unwanted ChangeSetItems.
         * This implementation excludes null and empty ChangeSetItems.
         * @protected
         * @param {?} changeSet ChangeSet with changes to filter
         * @return {?}
         */
        EntityCacheDataService.prototype.filterChangeSet = function (changeSet) {
            return excludeEmptyChangeSetItems(changeSet);
        };
        /**
         * Convert the entities in update changes from \@ngrx Update<T> structure to just T.
         * Reverse of restoreUpdates().
         * @protected
         * @param {?} changeSet
         * @return {?}
         */
        EntityCacheDataService.prototype.flattenUpdates = function (changeSet) {
            /** @type {?} */
            var changes = changeSet.changes;
            if (changes.length === 0) {
                return changeSet;
            }
            /** @type {?} */
            var hasMutated = false;
            changes = ( /** @type {?} */(changes.map(( /**
             * @param {?} item
             * @return {?}
             */function (item) {
                if (item.op === updateOp && item.entities.length > 0) {
                    hasMutated = true;
                    return Object.assign(Object.assign({}, item), { entities: (( /** @type {?} */(item))).entities.map(( /**
                             * @param {?} u
                             * @return {?}
                             */function (u) { return u.changes; })) });
                }
                else {
                    return item;
                }
            }))));
            return hasMutated ? Object.assign(Object.assign({}, changeSet), { changes: changes }) : changeSet;
        };
        /**
         * Convert the flattened T entities in update changes back to \@ngrx Update<T> structures.
         * Reverse of flattenUpdates().
         * @protected
         * @param {?} changeSet
         * @return {?}
         */
        EntityCacheDataService.prototype.restoreUpdates = function (changeSet) {
            var _this = this;
            if (changeSet == null) {
                // Nothing? Server probably responded with 204 - No Content because it made no changes to the inserted or updated entities
                return changeSet;
            }
            /** @type {?} */
            var changes = changeSet.changes;
            if (changes.length === 0) {
                return changeSet;
            }
            /** @type {?} */
            var hasMutated = false;
            changes = ( /** @type {?} */(changes.map(( /**
             * @param {?} item
             * @return {?}
             */function (item) {
                if (item.op === updateOp) {
                    // These are entities, not Updates; convert back to Updates
                    hasMutated = true;
                    /** @type {?} */
                    var selectId_1 = _this.getIdSelector(item.entityName);
                    return ( /** @type {?} */(Object.assign(Object.assign({}, item), { entities: item.entities.map(( /**
                             * @param {?} u
                             * @return {?}
                             */function (u) { return ({
                            id: selectId_1(u),
                            changes: u,
                        }); })) })));
                }
                else {
                    return item;
                }
            }))));
            return hasMutated ? Object.assign(Object.assign({}, changeSet), { changes: changes }) : changeSet;
        };
        /**
         * Get the id (primary key) selector function for an entity type
         * @protected
         * @param {?} entityName name of the entity type
         * @return {?}
         */
        EntityCacheDataService.prototype.getIdSelector = function (entityName) {
            /** @type {?} */
            var idSelector = this.idSelectors[entityName];
            if (!idSelector) {
                idSelector = this.entityDefinitionService.getDefinition(entityName)
                    .selectId;
                this.idSelectors[entityName] = idSelector;
            }
            return idSelector;
        };
        return EntityCacheDataService;
    }());
    EntityCacheDataService.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    EntityCacheDataService.ctorParameters = function () { return [
        { type: EntityDefinitionService },
        { type: http.HttpClient },
        { type: DefaultDataServiceConfig, decorators: [{ type: core.Optional }] }
    ]; };
    if (false) {
        /**
         * @type {?}
         * @protected
         */
        EntityCacheDataService.prototype.idSelectors;
        /**
         * @type {?}
         * @protected
         */
        EntityCacheDataService.prototype.saveDelay;
        /**
         * @type {?}
         * @protected
         */
        EntityCacheDataService.prototype.timeout;
        /**
         * @type {?}
         * @protected
         */
        EntityCacheDataService.prototype.entityDefinitionService;
        /**
         * @type {?}
         * @protected
         */
        EntityCacheDataService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/dataservices/entity-data.service.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Registry of EntityCollection data services that make REST-like CRUD calls
     * to entity collection endpoints.
     */
    var EntityDataService = /** @class */ (function () {
        // TODO:  Optionally inject specialized entity data services
        // for those that aren't derived from BaseDataService.
        /**
         * @param {?} defaultDataServiceFactory
         */
        function EntityDataService(defaultDataServiceFactory) {
            this.defaultDataServiceFactory = defaultDataServiceFactory;
            this.services = {};
        }
        /**
         * Get (or create) a data service for entity type
         * @template T
         * @param {?} entityName - the name of the type
         *
         * Examples:
         *   getService('Hero'); // data service for Heroes, untyped
         *   getService<Hero>('Hero'); // data service for Heroes, typed as Hero
         * @return {?}
         */
        EntityDataService.prototype.getService = function (entityName) {
            entityName = entityName.trim();
            /** @type {?} */
            var service = this.services[entityName];
            if (!service) {
                service = this.defaultDataServiceFactory.create(entityName);
                this.services[entityName] = service;
            }
            return service;
        };
        /**
         * Register an EntityCollectionDataService for an entity type
         * @template T
         * @param {?} entityName - the name of the entity type
         * @param {?} service - data service for that entity type
         *
         * Examples:
         *   registerService('Hero', myHeroDataService);
         *   registerService('Villain', myVillainDataService);
         * @return {?}
         */
        EntityDataService.prototype.registerService = function (entityName, service) {
            this.services[entityName.trim()] = service;
        };
        /**
         * Register a batch of data services.
         * @param {?} services - data services to merge into existing services
         *
         * Examples:
         *   registerServices({
         *     Hero: myHeroDataService,
         *     Villain: myVillainDataService
         *   });
         * @return {?}
         */
        EntityDataService.prototype.registerServices = function (services) {
            this.services = Object.assign(Object.assign({}, this.services), services);
        };
        return EntityDataService;
    }());
    EntityDataService.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    EntityDataService.ctorParameters = function () { return [
        { type: DefaultDataServiceFactory }
    ]; };
    if (false) {
        /**
         * @type {?}
         * @protected
         */
        EntityDataService.prototype.services;
        /**
         * @type {?}
         * @protected
         */
        EntityDataService.prototype.defaultDataServiceFactory;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/dataservices/persistence-result-handler.service.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Handling of responses from persistence operation
     * @abstract
     */
    var PersistenceResultHandler = /** @class */ (function () {
        function PersistenceResultHandler() {
        }
        return PersistenceResultHandler;
    }());
    if (false) {
        /**
         * Handle successful result of persistence operation for an action
         * @abstract
         * @param {?} originalAction
         * @return {?}
         */
        PersistenceResultHandler.prototype.handleSuccess = function (originalAction) { };
        /**
         * Handle error result of persistence operation for an action
         * @abstract
         * @param {?} originalAction
         * @return {?}
         */
        PersistenceResultHandler.prototype.handleError = function (originalAction) { };
    }
    /**
     * Default handling of responses from persistence operation,
     * specifically an EntityDataService
     */
    var DefaultPersistenceResultHandler = /** @class */ (function () {
        /**
         * @param {?} logger
         * @param {?} entityActionFactory
         */
        function DefaultPersistenceResultHandler(logger, entityActionFactory) {
            this.logger = logger;
            this.entityActionFactory = entityActionFactory;
        }
        /**
         * Handle successful result of persistence operation on an EntityAction
         * @param {?} originalAction
         * @return {?}
         */
        DefaultPersistenceResultHandler.prototype.handleSuccess = function (originalAction) {
            var _this = this;
            /** @type {?} */
            var successOp = makeSuccessOp(originalAction.payload.entityOp);
            return ( /**
             * @param {?} data
             * @return {?}
             */function (data) { return _this.entityActionFactory.createFromAction(originalAction, {
                entityOp: successOp,
                data: data,
            }); });
        };
        /**
         * Handle error result of persistence operation on an EntityAction
         * @param {?} originalAction
         * @return {?}
         */
        DefaultPersistenceResultHandler.prototype.handleError = function (originalAction) {
            var _this = this;
            /** @type {?} */
            var errorOp = makeErrorOp(originalAction.payload.entityOp);
            return ( /**
             * @param {?} err
             * @return {?}
             */function (err) {
                /** @type {?} */
                var error = err instanceof DataServiceError ? err : new DataServiceError(err, null);
                /** @type {?} */
                var errorData = { error: error, originalAction: originalAction };
                _this.logger.error(errorData);
                /** @type {?} */
                var action = _this.entityActionFactory.createFromAction(originalAction, {
                    entityOp: errorOp,
                    data: errorData,
                });
                return action;
            });
        };
        return DefaultPersistenceResultHandler;
    }());
    DefaultPersistenceResultHandler.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    DefaultPersistenceResultHandler.ctorParameters = function () { return [
        { type: Logger },
        { type: EntityActionFactory }
    ]; };
    if (false) {
        /**
         * @type {?}
         * @private
         */
        DefaultPersistenceResultHandler.prototype.logger;
        /**
         * @type {?}
         * @private
         */
        DefaultPersistenceResultHandler.prototype.entityActionFactory;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/utils/correlation-id-generator.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Generates a string id beginning 'CRID',
     * followed by a monotonically increasing integer for use as a correlation id.
     * As they are produced locally by a singleton service,
     * these ids are guaranteed to be unique only
     * for the duration of a single client browser instance.
     * Ngrx entity dispatcher query and save methods call this service to generate default correlation ids.
     * Do NOT use for entity keys.
     */
    var CorrelationIdGenerator = /** @class */ (function () {
        function CorrelationIdGenerator() {
            /**
             * Seed for the ids
             */
            this.seed = 0;
            /**
             * Prefix of the id, 'CRID;
             */
            this.prefix = 'CRID';
        }
        /**
         * Return the next correlation id
         * @return {?}
         */
        CorrelationIdGenerator.prototype.next = function () {
            this.seed += 1;
            return this.prefix + this.seed;
        };
        return CorrelationIdGenerator;
    }());
    CorrelationIdGenerator.decorators = [
        { type: core.Injectable }
    ];
    if (false) {
        /**
         * Seed for the ids
         * @type {?}
         * @protected
         */
        CorrelationIdGenerator.prototype.seed;
        /**
         * Prefix of the id, 'CRID;
         * @type {?}
         * @protected
         */
        CorrelationIdGenerator.prototype.prefix;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/dispatchers/entity-dispatcher-default-options.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Default options for EntityDispatcher behavior
     * such as whether `add()` is optimistic or pessimistic by default.
     * An optimistic save modifies the collection immediately and before saving to the server.
     * A pessimistic save modifies the collection after the server confirms the save was successful.
     * This class initializes the defaults to the safest values.
     * Provide an alternative to change the defaults for all entity collections.
     */
    var EntityDispatcherDefaultOptions = /** @class */ (function () {
        function EntityDispatcherDefaultOptions() {
            /**
             * True if added entities are saved optimistically; false if saved pessimistically.
             */
            this.optimisticAdd = false;
            /**
             * True if deleted entities are saved optimistically; false if saved pessimistically.
             */
            this.optimisticDelete = true;
            /**
             * True if updated entities are saved optimistically; false if saved pessimistically.
             */
            this.optimisticUpdate = false;
            /**
             * True if upsert entities are saved optimistically; false if saved pessimistically.
             */
            this.optimisticUpsert = false;
            /**
             * True if entities in a cache saveEntities request are saved optimistically; false if saved pessimistically.
             */
            this.optimisticSaveEntities = false;
        }
        return EntityDispatcherDefaultOptions;
    }());
    EntityDispatcherDefaultOptions.decorators = [
        { type: core.Injectable }
    ];
    if (false) {
        /**
         * True if added entities are saved optimistically; false if saved pessimistically.
         * @type {?}
         */
        EntityDispatcherDefaultOptions.prototype.optimisticAdd;
        /**
         * True if deleted entities are saved optimistically; false if saved pessimistically.
         * @type {?}
         */
        EntityDispatcherDefaultOptions.prototype.optimisticDelete;
        /**
         * True if updated entities are saved optimistically; false if saved pessimistically.
         * @type {?}
         */
        EntityDispatcherDefaultOptions.prototype.optimisticUpdate;
        /**
         * True if upsert entities are saved optimistically; false if saved pessimistically.
         * @type {?}
         */
        EntityDispatcherDefaultOptions.prototype.optimisticUpsert;
        /**
         * True if entities in a cache saveEntities request are saved optimistically; false if saved pessimistically.
         * @type {?}
         */
        EntityDispatcherDefaultOptions.prototype.optimisticSaveEntities;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/dispatchers/entity-dispatcher.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Dispatches EntityCollection actions to their reducers and effects.
     * The substance of the interface is in EntityCommands.
     * @record
     * @template T
     */
    function EntityDispatcher() { }
    if (false) {
        /**
         * Name of the entity type
         * @type {?}
         */
        EntityDispatcher.prototype.entityName;
        /**
         * Utility class with methods to validate EntityAction payloads.
         * @type {?}
         */
        EntityDispatcher.prototype.guard;
        /**
         * Returns the primary key (id) of this entity
         * @type {?}
         */
        EntityDispatcher.prototype.selectId;
        /**
         * Returns the store, scoped to the EntityCache
         * @type {?}
         */
        EntityDispatcher.prototype.store;
        /**
         * Create an {EntityAction} for this entity type.
         * @template P
         * @param {?} op {EntityOp} the entity operation
         * @param {?=} data
         * @param {?=} options
         * @return {?} the EntityAction
         */
        EntityDispatcher.prototype.createEntityAction = function (op, data, options) { };
        /**
         * Create an {EntityAction} for this entity type and
         * dispatch it immediately to the store.
         * @template P
         * @param {?} op {EntityOp} the entity operation
         * @param {?=} data
         * @param {?=} options
         * @return {?} the dispatched EntityAction
         */
        EntityDispatcher.prototype.createAndDispatch = function (op, data, options) { };
        /**
         * Dispatch an Action to the store.
         * @param {?} action the Action
         * @return {?} the dispatched Action
         */
        EntityDispatcher.prototype.dispatch = function (action) { };
        /**
         * Convert an entity (or partial entity) into the `Update<T>` object
         * `update...` and `upsert...` methods take `Update<T>` args
         * @param {?} entity
         * @return {?}
         */
        EntityDispatcher.prototype.toUpdate = function (entity) { };
    }
    /**
     * Persistence operation canceled
     */
    var PersistanceCanceled = /** @class */ (function () {
        /**
         * @param {?=} message
         */
        function PersistanceCanceled(message) {
            this.message = message;
            this.message = message || 'Canceled by user';
        }
        return PersistanceCanceled;
    }());
    if (false) {
        /** @type {?} */
        PersistanceCanceled.prototype.message;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/dispatchers/entity-cache-dispatcher.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Dispatches Entity Cache actions to the EntityCache reducer
     */
    var EntityCacheDispatcher = /** @class */ (function () {
        /**
         * @param {?} correlationIdGenerator
         * @param {?} defaultDispatcherOptions
         * @param {?} scannedActions$
         * @param {?} store
         */
        function EntityCacheDispatcher(correlationIdGenerator, defaultDispatcherOptions, 
        /** Actions scanned by the store after it processed them with reducers. */
        scannedActions$, store) {
            this.correlationIdGenerator = correlationIdGenerator;
            this.defaultDispatcherOptions = defaultDispatcherOptions;
            this.store = store;
            // Replay because sometimes in tests will fake data service with synchronous observable
            // which makes subscriber miss the dispatched actions.
            // Of course that's a testing mistake. But easy to forget, leading to painful debugging.
            this.reducedActions$ = scannedActions$.pipe(operators.shareReplay(1));
            // Start listening so late subscriber won't miss the most recent action.
            this.raSubscription = this.reducedActions$.subscribe();
        }
        /**
         * Dispatch an Action to the store.
         * @param {?} action the Action
         * @return {?} the dispatched Action
         */
        EntityCacheDispatcher.prototype.dispatch = function (action) {
            this.store.dispatch(action);
            return action;
        };
        /**
         * Dispatch action to cancel the saveEntities request with matching correlation id.
         * @param {?} correlationId The correlation id for the corresponding action
         * @param {?=} reason
         * @param {?=} entityNames
         * @param {?=} tag
         * @return {?}
         */
        EntityCacheDispatcher.prototype.cancelSaveEntities = function (correlationId, reason, entityNames, tag) {
            if (!correlationId) {
                throw new Error('Missing correlationId');
            }
            /** @type {?} */
            var action = new SaveEntitiesCancel(correlationId, reason, entityNames, tag);
            this.dispatch(action);
        };
        /**
         * Clear the named entity collections in cache
         * @param {?=} collections
         * @param {?=} tag
         * @return {?}
         */
        EntityCacheDispatcher.prototype.clearCollections = function (collections, tag) {
            this.dispatch(new ClearCollections(collections, tag));
        };
        /**
         * Load multiple entity collections at the same time.
         * before any selectors$ observables emit.
         * @param {?} collections The collections to load, typically the result of a query.
         * @param {?=} tag
         * @return {?}
         */
        EntityCacheDispatcher.prototype.loadCollections = function (collections, tag) {
            this.dispatch(new LoadCollections(collections, tag));
        };
        /**
         * Merges entities from a query result
         * that returned entities from multiple collections.
         * Corresponding entity cache reducer should add and update all collections
         * at the same time, before any selectors$ observables emit.
         * @param {?} querySet The result of the query in the form of a map of entity collections.
         * These are the entity data to merge into the respective collections.
         * @param {?=} mergeStrategy How to merge a queried entity when it is already in the collection.
         * The default is MergeStrategy.PreserveChanges
         * @param {?=} tag
         * @return {?}
         */
        EntityCacheDispatcher.prototype.mergeQuerySet = function (querySet, mergeStrategy, tag) {
            this.dispatch(new MergeQuerySet(querySet, mergeStrategy, tag));
        };
        /**
         * Create entity cache action for replacing the entire entity cache.
         * Dangerous because brute force but useful as when re-hydrating an EntityCache
         * from local browser storage when the application launches.
         * @param {?} cache New state of the entity cache
         * @param {?=} tag
         * @return {?}
         */
        EntityCacheDispatcher.prototype.setEntityCache = function (cache, tag) {
            this.dispatch(new SetEntityCache(cache, tag));
        };
        /**
         * Dispatch action to save multiple entity changes to remote storage.
         * Relies on an Ngrx Effect such as EntityEffects.saveEntities$.
         * Important: only call if your server supports the SaveEntities protocol
         * through your EntityDataService.saveEntities method.
         * @param {?} changes Either the entities to save, as an array of {ChangeSetItem}, or
         * a ChangeSet that holds such changes.
         * @param {?} url The server url which receives the save request
         * @param {?=} options
         * @return {?} A terminating Observable<ChangeSet> with data returned from the server
         * after server reports successful save OR the save error.
         * TODO: should return the matching entities from cache rather than the raw server data.
         */
        EntityCacheDispatcher.prototype.saveEntities = function (changes, url, options) {
            /** @type {?} */
            var changeSet = Array.isArray(changes) ? { changes: changes } : changes;
            options = options || {};
            /** @type {?} */
            var correlationId = options.correlationId == null
                ? this.correlationIdGenerator.next()
                : options.correlationId;
            /** @type {?} */
            var isOptimistic = options.isOptimistic == null
                ? this.defaultDispatcherOptions.optimisticSaveEntities || false
                : options.isOptimistic === true;
            /** @type {?} */
            var tag = options.tag || 'Save Entities';
            options = Object.assign(Object.assign({}, options), { correlationId: correlationId, isOptimistic: isOptimistic, tag: tag });
            /** @type {?} */
            var action = new SaveEntities(changeSet, url, options);
            this.dispatch(action);
            return this.getSaveEntitiesResponseData$(options.correlationId).pipe(operators.shareReplay(1));
        };
        /**
         * Return Observable of data from the server-success SaveEntities action with
         * the given Correlation Id, after that action was processed by the ngrx store.
         * or else put the server error on the Observable error channel.
         * @private
         * @param {?} crid The correlationId for both the save and response actions.
         * @return {?}
         */
        EntityCacheDispatcher.prototype.getSaveEntitiesResponseData$ = function (crid) {
            /**
             * reducedActions$ must be replay observable of the most recent action reduced by the store.
             * because the response action might have been dispatched to the store
             * before caller had a chance to subscribe.
             */
            return this.reducedActions$.pipe(operators.filter(( /**
             * @param {?} act
             * @return {?}
             */function (act) { return act.type === EntityCacheAction.SAVE_ENTITIES_SUCCESS ||
                act.type === EntityCacheAction.SAVE_ENTITIES_ERROR ||
                act.type === EntityCacheAction.SAVE_ENTITIES_CANCEL; })), operators.filter(( /**
         * @param {?} act
         * @return {?}
         */function (act) { return crid === (( /** @type {?} */(act))).payload.correlationId; })), operators.take(1), operators.mergeMap(( /**
             * @param {?} act
             * @return {?}
             */function (act) {
                return act.type === EntityCacheAction.SAVE_ENTITIES_CANCEL
                    ? rxjs.throwError(new PersistanceCanceled((( /** @type {?} */(act))).payload.reason))
                    : act.type === EntityCacheAction.SAVE_ENTITIES_SUCCESS
                        ? rxjs.of((( /** @type {?} */(act))).payload.changeSet)
                        : rxjs.throwError((( /** @type {?} */(act))).payload);
            })));
        };
        return EntityCacheDispatcher;
    }());
    EntityCacheDispatcher.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    EntityCacheDispatcher.ctorParameters = function () { return [
        { type: CorrelationIdGenerator },
        { type: EntityDispatcherDefaultOptions },
        { type: rxjs.Observable, decorators: [{ type: core.Inject, args: [store.ScannedActionsSubject,] }] },
        { type: store.Store }
    ]; };
    if (false) {
        /**
         * Actions scanned by the store after it processed them with reducers.
         * A replay observable of the most recent action reduced by the store.
         * @type {?}
         */
        EntityCacheDispatcher.prototype.reducedActions$;
        /**
         * @type {?}
         * @private
         */
        EntityCacheDispatcher.prototype.raSubscription;
        /**
         * Generates correlation ids for query and save methods
         * @type {?}
         * @private
         */
        EntityCacheDispatcher.prototype.correlationIdGenerator;
        /**
         * Dispatcher options configure dispatcher behavior such as
         * whether add is optimistic or pessimistic by default.
         * @type {?}
         * @private
         */
        EntityCacheDispatcher.prototype.defaultDispatcherOptions;
        /**
         * The store, scoped to the EntityCache
         * @type {?}
         * @private
         */
        EntityCacheDispatcher.prototype.store;
    }

    /**
     * Dispatches EntityCollection actions to their reducers and effects (default implementation).
     * All save commands rely on an Ngrx Effect such as `EntityEffects.persist$`.
     * @template T
     */
    var EntityDispatcherBase = /** @class */ (function () {
        /**
         * @param {?} entityName
         * @param {?} entityActionFactory
         * @param {?} store
         * @param {?=} selectId
         * @param {?=} defaultDispatcherOptions
         * @param {?=} reducedActions$
         * @param {?=} entityCacheSelector
         * @param {?=} correlationIdGenerator
         */
        function EntityDispatcherBase(entityName, entityActionFactory, store$1, selectId, defaultDispatcherOptions, reducedActions$, 
        /** Store selector for the EntityCache */
        entityCacheSelector, correlationIdGenerator) {
            if (selectId === void 0) { selectId = defaultSelectId; }
            this.entityName = entityName;
            this.entityActionFactory = entityActionFactory;
            this.store = store$1;
            this.selectId = selectId;
            this.defaultDispatcherOptions = defaultDispatcherOptions;
            this.reducedActions$ = reducedActions$;
            this.correlationIdGenerator = correlationIdGenerator;
            this.guard = new EntityActionGuard(entityName, selectId);
            this.toUpdate = toUpdateFactory(selectId);
            /** @type {?} */
            var collectionSelector = store.createSelector(entityCacheSelector, ( /**
             * @param {?} cache
             * @return {?}
             */function (cache) { return ( /** @type {?} */(cache[entityName])); }));
            this.entityCollection$ = store$1.select(collectionSelector);
        }
        /**
         * Create an {EntityAction} for this entity type.
         * @template P
         * @param {?} entityOp {EntityOp} the entity operation
         * @param {?=} data
         * @param {?=} options
         * @return {?} the EntityAction
         */
        EntityDispatcherBase.prototype.createEntityAction = function (entityOp, data, options) {
            return this.entityActionFactory.create(Object.assign({ entityName: this.entityName, entityOp: entityOp,
                data: data }, options));
        };
        /**
         * Create an {EntityAction} for this entity type and
         * dispatch it immediately to the store.
         * @template P
         * @param {?} op {EntityOp} the entity operation
         * @param {?=} data
         * @param {?=} options
         * @return {?} the dispatched EntityAction
         */
        EntityDispatcherBase.prototype.createAndDispatch = function (op, data, options) {
            /** @type {?} */
            var action = this.createEntityAction(op, data, options);
            this.dispatch(action);
            return action;
        };
        /**
         * Dispatch an Action to the store.
         * @param {?} action the Action
         * @return {?} the dispatched Action
         */
        EntityDispatcherBase.prototype.dispatch = function (action) {
            this.store.dispatch(action);
            return action;
        };
        // #region Query and save operations
        /**
         * Dispatch action to save a new entity to remote storage.
         * @param {?} entity entity to add, which may omit its key if pessimistic and the server creates the key;
         * must have a key if optimistic save.
         * @param {?=} options
         * @return {?} A terminating Observable of the entity
         * after server reports successful save or the save error.
         */
        EntityDispatcherBase.prototype.add = function (entity, options) {
            var _this = this;
            options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticAdd);
            /** @type {?} */
            var action = this.createEntityAction(EntityOp.SAVE_ADD_ONE, entity, options);
            if (options.isOptimistic) {
                this.guard.mustBeEntity(action);
            }
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(
            // Use the returned entity data's id to get the entity from the collection
            // as it might be different from the entity returned from the server.
            operators.withLatestFrom(this.entityCollection$), operators.map(( /**
             * @param {?} __0
             * @return {?}
             */function (_a) {
                var _b = __read(_a, 2), e = _b[0], collection = _b[1];
                return ( /** @type {?} */(collection.entities[_this.selectId(e)]));
            })), operators.shareReplay(1));
        };
        /**
         * Dispatch action to cancel the persistence operation (query or save).
         * Will cause save observable to error with a PersistenceCancel error.
         * Caller is responsible for undoing changes in cache from pending optimistic save
         * @param {?} correlationId The correlation id for the corresponding EntityAction
         * @param {?=} reason
         * @param {?=} options
         * @return {?}
         */
        EntityDispatcherBase.prototype.cancel = function (correlationId, reason, options) {
            if (!correlationId) {
                throw new Error('Missing correlationId');
            }
            this.createAndDispatch(EntityOp.CANCEL_PERSIST, reason, { correlationId: correlationId });
        };
        /**
         * @param {?} arg
         * @param {?=} options
         * @return {?}
         */
        EntityDispatcherBase.prototype.delete = function (arg, options) {
            options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticDelete);
            /** @type {?} */
            var key = this.getKey(arg);
            /** @type {?} */
            var action = this.createEntityAction(EntityOp.SAVE_DELETE_ONE, key, options);
            this.guard.mustBeKey(action);
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(operators.map(( /**
             * @return {?}
             */function () { return key; })), operators.shareReplay(1));
        };
        /**
         * Dispatch action to query remote storage for all entities and
         * merge the queried entities into the cached collection.
         * @see load()
         * @param {?=} options
         * @return {?} A terminating Observable of the queried entities that are in the collection
         * after server reports success query or the query error.
         */
        EntityDispatcherBase.prototype.getAll = function (options) {
            var _this = this;
            options = this.setQueryEntityActionOptions(options);
            /** @type {?} */
            var action = this.createEntityAction(EntityOp.QUERY_ALL, null, options);
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(
            // Use the returned entity ids to get the entities from the collection
            // as they might be different from the entities returned from the server
            // because of unsaved changes (deletes or updates).
            operators.withLatestFrom(this.entityCollection$), operators.map(( /**
             * @param {?} __0
             * @return {?}
             */function (_a) {
                var _b = __read(_a, 2), entities = _b[0], collection = _b[1];
                return entities.reduce(( /**
                 * @param {?} acc
                 * @param {?} e
                 * @return {?}
                 */function (acc, e) {
                    /** @type {?} */
                    var entity = collection.entities[_this.selectId(e)];
                    if (entity) {
                        acc.push(entity); // only return an entity found in the collection
                    }
                    return acc;
                }), ( /** @type {?} */([])));
            })), operators.shareReplay(1));
        };
        /**
         * Dispatch action to query remote storage for the entity with this primary key.
         * If the server returns an entity,
         * merge it into the cached collection.
         * @param {?} key
         * @param {?=} options
         * @return {?} A terminating Observable of the collection
         * after server reports successful query or the query error.
         */
        EntityDispatcherBase.prototype.getByKey = function (key, options) {
            var _this = this;
            options = this.setQueryEntityActionOptions(options);
            /** @type {?} */
            var action = this.createEntityAction(EntityOp.QUERY_BY_KEY, key, options);
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(
            // Use the returned entity data's id to get the entity from the collection
            // as it might be different from the entity returned from the server.
            operators.withLatestFrom(this.entityCollection$), operators.map(( /**
             * @param {?} __0
             * @return {?}
             */function (_a) {
                var _b = __read(_a, 2), entity = _b[0], collection = _b[1];
                return ( /** @type {?} */(collection.entities[_this.selectId(entity)]));
            })), operators.shareReplay(1));
        };
        /**
         * Dispatch action to query remote storage for the entities that satisfy a query expressed
         * with either a query parameter map or an HTTP URL query string,
         * and merge the results into the cached collection.
         * @param {?} queryParams the query in a form understood by the server
         * @param {?=} options
         * @return {?} A terminating Observable of the queried entities
         * after server reports successful query or the query error.
         */
        EntityDispatcherBase.prototype.getWithQuery = function (queryParams, options) {
            var _this = this;
            options = this.setQueryEntityActionOptions(options);
            /** @type {?} */
            var action = this.createEntityAction(EntityOp.QUERY_MANY, queryParams, options);
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(
            // Use the returned entity ids to get the entities from the collection
            // as they might be different from the entities returned from the server
            // because of unsaved changes (deletes or updates).
            operators.withLatestFrom(this.entityCollection$), operators.map(( /**
             * @param {?} __0
             * @return {?}
             */function (_a) {
                var _b = __read(_a, 2), entities = _b[0], collection = _b[1];
                return entities.reduce(( /**
                 * @param {?} acc
                 * @param {?} e
                 * @return {?}
                 */function (acc, e) {
                    /** @type {?} */
                    var entity = collection.entities[_this.selectId(e)];
                    if (entity) {
                        acc.push(entity); // only return an entity found in the collection
                    }
                    return acc;
                }), ( /** @type {?} */([])));
            })), operators.shareReplay(1));
        };
        /**
         * Dispatch action to query remote storage for all entities and
         * completely replace the cached collection with the queried entities.
         * @see getAll
         * @param {?=} options
         * @return {?} A terminating Observable of the entities in the collection
         * after server reports successful query or the query error.
         */
        EntityDispatcherBase.prototype.load = function (options) {
            options = this.setQueryEntityActionOptions(options);
            /** @type {?} */
            var action = this.createEntityAction(EntityOp.QUERY_LOAD, null, options);
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(operators.shareReplay(1));
        };
        /**
         * Dispatch action to save the updated entity (or partial entity) in remote storage.
         * The update entity may be partial (but must have its key)
         * in which case it patches the existing entity.
         * @param {?} entity update entity, which might be a partial of T but must at least have its key.
         * @param {?=} options
         * @return {?} A terminating Observable of the updated entity
         * after server reports successful save or the save error.
         */
        EntityDispatcherBase.prototype.update = function (entity, options) {
            var _this = this;
            // update entity might be a partial of T but must at least have its key.
            // pass the Update<T> structure as the payload
            /** @type {?} */
            var update = this.toUpdate(entity);
            options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticUpdate);
            /** @type {?} */
            var action = this.createEntityAction(EntityOp.SAVE_UPDATE_ONE, update, options);
            if (options.isOptimistic) {
                this.guard.mustBeUpdate(action);
            }
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(
            // Use the update entity data id to get the entity from the collection
            // as might be different from the entity returned from the server
            // because the id changed or there are unsaved changes.
            operators.map(( /**
             * @param {?} updateData
             * @return {?}
             */function (updateData) { return updateData.changes; })), operators.withLatestFrom(this.entityCollection$), operators.map(( /**
             * @param {?} __0
             * @return {?}
             */function (_a) {
                var _b = __read(_a, 2), e = _b[0], collection = _b[1];
                return ( /** @type {?} */(collection.entities[_this.selectId(( /** @type {?} */(e)))]));
            })), operators.shareReplay(1));
        };
        /**
         * Dispatch action to save a new or existing entity to remote storage.
         * Only dispatch this action if your server supports upsert.
         * @param {?} entity entity to add, which may omit its key if pessimistic and the server creates the key;
         * must have a key if optimistic save.
         * @param {?=} options
         * @return {?} A terminating Observable of the entity
         * after server reports successful save or the save error.
         */
        EntityDispatcherBase.prototype.upsert = function (entity, options) {
            var _this = this;
            options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticUpsert);
            /** @type {?} */
            var action = this.createEntityAction(EntityOp.SAVE_UPSERT_ONE, entity, options);
            if (options.isOptimistic) {
                this.guard.mustBeEntity(action);
            }
            this.dispatch(action);
            return this.getResponseData$(options.correlationId).pipe(
            // Use the returned entity data's id to get the entity from the collection
            // as it might be different from the entity returned from the server.
            operators.withLatestFrom(this.entityCollection$), operators.map(( /**
             * @param {?} __0
             * @return {?}
             */function (_a) {
                var _b = __read(_a, 2), e = _b[0], collection = _b[1];
                return ( /** @type {?} */(collection.entities[_this.selectId(e)]));
            })), operators.shareReplay(1));
        };
        // #endregion Query and save operations
        // #region Cache-only operations that do not update remote storage
        // Unguarded for performance.
        // EntityCollectionReducer<T> runs a guard (which throws)
        // Developer should understand cache-only methods well enough
        // to call them with the proper entities.
        // May reconsider and add guards in future.
        /**
         * Replace all entities in the cached collection.
         * Does not save to remote storage.
         * @param {?} entities
         * @param {?=} options
         * @return {?}
         */
        EntityDispatcherBase.prototype.addAllToCache = function (entities, options) {
            this.createAndDispatch(EntityOp.ADD_ALL, entities, options);
        };
        /**
         * Add a new entity directly to the cache.
         * Does not save to remote storage.
         * Ignored if an entity with the same primary key is already in cache.
         * @param {?} entity
         * @param {?=} options
         * @return {?}
         */
        EntityDispatcherBase.prototype.addOneToCache = function (entity, options) {
            this.createAndDispatch(EntityOp.ADD_ONE, entity, options);
        };
        /**
         * Add multiple new entities directly to the cache.
         * Does not save to remote storage.
         * Entities with primary keys already in cache are ignored.
         * @param {?} entities
         * @param {?=} options
         * @return {?}
         */
        EntityDispatcherBase.prototype.addManyToCache = function (entities, options) {
            this.createAndDispatch(EntityOp.ADD_MANY, entities, options);
        };
        /**
         * Clear the cached entity collection
         * @param {?=} options
         * @return {?}
         */
        EntityDispatcherBase.prototype.clearCache = function (options) {
            this.createAndDispatch(EntityOp.REMOVE_ALL, undefined, options);
        };
        /**
         * @param {?} arg
         * @param {?=} options
         * @return {?}
         */
        EntityDispatcherBase.prototype.removeOneFromCache = function (arg, options) {
            this.createAndDispatch(EntityOp.REMOVE_ONE, this.getKey(arg), options);
        };
        /**
         * @param {?} args
         * @param {?=} options
         * @return {?}
         */
        EntityDispatcherBase.prototype.removeManyFromCache = function (args, options) {
            var _this = this;
            if (!args || args.length === 0) {
                return;
            }
            /** @type {?} */
            var keys = typeof args[0] === 'object'
                ? // if array[0] is a key, assume they're all keys
                    (( /** @type {?} */(args))).map(( /**
                     * @param {?} arg
                     * @return {?}
                     */function (arg) { return _this.getKey(arg); }))
                : args;
            this.createAndDispatch(EntityOp.REMOVE_MANY, keys, options);
        };
        /**
         * Update a cached entity directly.
         * Does not update that entity in remote storage.
         * Ignored if an entity with matching primary key is not in cache.
         * The update entity may be partial (but must have its key)
         * in which case it patches the existing entity.
         * @param {?} entity
         * @param {?=} options
         * @return {?}
         */
        EntityDispatcherBase.prototype.updateOneInCache = function (entity, options) {
            // update entity might be a partial of T but must at least have its key.
            // pass the Update<T> structure as the payload
            /** @type {?} */
            var update = this.toUpdate(entity);
            this.createAndDispatch(EntityOp.UPDATE_ONE, update, options);
        };
        /**
         * Update multiple cached entities directly.
         * Does not update these entities in remote storage.
         * Entities whose primary keys are not in cache are ignored.
         * Update entities may be partial but must at least have their keys.
         * such partial entities patch their cached counterparts.
         * @param {?} entities
         * @param {?=} options
         * @return {?}
         */
        EntityDispatcherBase.prototype.updateManyInCache = function (entities, options) {
            var _this = this;
            if (!entities || entities.length === 0) {
                return;
            }
            /** @type {?} */
            var updates = entities.map(( /**
             * @param {?} entity
             * @return {?}
             */function (entity) { return _this.toUpdate(entity); }));
            this.createAndDispatch(EntityOp.UPDATE_MANY, updates, options);
        };
        /**
         * Add or update a new entity directly to the cache.
         * Does not save to remote storage.
         * Upsert entity might be a partial of T but must at least have its key.
         * Pass the Update<T> structure as the payload
         * @param {?} entity
         * @param {?=} options
         * @return {?}
         */
        EntityDispatcherBase.prototype.upsertOneInCache = function (entity, options) {
            this.createAndDispatch(EntityOp.UPSERT_ONE, entity, options);
        };
        /**
         * Add or update multiple cached entities directly.
         * Does not save to remote storage.
         * @param {?} entities
         * @param {?=} options
         * @return {?}
         */
        EntityDispatcherBase.prototype.upsertManyInCache = function (entities, options) {
            if (!entities || entities.length === 0) {
                return;
            }
            this.createAndDispatch(EntityOp.UPSERT_MANY, entities, options);
        };
        /**
         * Set the pattern that the collection's filter applies
         * when using the `filteredEntities` selector.
         * @param {?} pattern
         * @return {?}
         */
        EntityDispatcherBase.prototype.setFilter = function (pattern) {
            this.createAndDispatch(EntityOp.SET_FILTER, pattern);
        };
        /**
         * Set the loaded flag
         * @param {?} isLoaded
         * @return {?}
         */
        EntityDispatcherBase.prototype.setLoaded = function (isLoaded) {
            this.createAndDispatch(EntityOp.SET_LOADED, !!isLoaded);
        };
        /**
         * Set the loading flag
         * @param {?} isLoading
         * @return {?}
         */
        EntityDispatcherBase.prototype.setLoading = function (isLoading) {
            this.createAndDispatch(EntityOp.SET_LOADING, !!isLoading);
        };
        // #endregion Cache-only operations that do not update remote storage
        // #region private helpers
        /**
         * Get key from entity (unless arg is already a key)
         * @private
         * @param {?} arg
         * @return {?}
         */
        EntityDispatcherBase.prototype.getKey = function (arg) {
            return typeof arg === 'object'
                ? this.selectId(arg)
                : (( /** @type {?} */(arg)));
        };
        /**
         * Return Observable of data from the server-success EntityAction with
         * the given Correlation Id, after that action was processed by the ngrx store.
         * or else put the server error on the Observable error channel.
         * @private
         * @template D
         * @param {?} crid The correlationId for both the save and response actions.
         * @return {?}
         */
        EntityDispatcherBase.prototype.getResponseData$ = function (crid) {
            var _this = this;
            /**
             * reducedActions$ must be replay observable of the most recent action reduced by the store.
             * because the response action might have been dispatched to the store
             * before caller had a chance to subscribe.
             */
            return this.reducedActions$.pipe(operators.filter(( /**
             * @param {?} act
             * @return {?}
             */function (act) { return !!act.payload; })), operators.filter(( /**
             * @param {?} act
             * @return {?}
             */function (act) {
                var _a = act.payload, correlationId = _a.correlationId, entityName = _a.entityName, entityOp = _a.entityOp;
                return (entityName === _this.entityName &&
                    correlationId === crid &&
                    (entityOp.endsWith(OP_SUCCESS) ||
                        entityOp.endsWith(OP_ERROR) ||
                        entityOp === EntityOp.CANCEL_PERSIST));
            })), operators.take(1), operators.mergeMap(( /**
             * @param {?} act
             * @return {?}
             */function (act) {
                var entityOp = act.payload.entityOp;
                return entityOp === EntityOp.CANCEL_PERSIST
                    ? rxjs.throwError(new PersistanceCanceled(act.payload.data))
                    : entityOp.endsWith(OP_SUCCESS)
                        ? rxjs.of(( /** @type {?} */(act.payload.data)))
                        : rxjs.throwError(act.payload.data.error);
            })));
        };
        /**
         * @private
         * @param {?=} options
         * @return {?}
         */
        EntityDispatcherBase.prototype.setQueryEntityActionOptions = function (options) {
            options = options || {};
            /** @type {?} */
            var correlationId = options.correlationId == null
                ? this.correlationIdGenerator.next()
                : options.correlationId;
            return Object.assign(Object.assign({}, options), { correlationId: correlationId });
        };
        /**
         * @private
         * @param {?=} options
         * @param {?=} defaultOptimism
         * @return {?}
         */
        EntityDispatcherBase.prototype.setSaveEntityActionOptions = function (options, defaultOptimism) {
            options = options || {};
            /** @type {?} */
            var correlationId = options.correlationId == null
                ? this.correlationIdGenerator.next()
                : options.correlationId;
            /** @type {?} */
            var isOptimistic = options.isOptimistic == null
                ? defaultOptimism || false
                : options.isOptimistic === true;
            return Object.assign(Object.assign({}, options), { correlationId: correlationId, isOptimistic: isOptimistic });
        };
        return EntityDispatcherBase;
    }());
    if (false) {
        /**
         * Utility class with methods to validate EntityAction payloads.
         * @type {?}
         */
        EntityDispatcherBase.prototype.guard;
        /**
         * @type {?}
         * @private
         */
        EntityDispatcherBase.prototype.entityCollection$;
        /**
         * Convert an entity (or partial entity) into the `Update<T>` object
         * `update...` and `upsert...` methods take `Update<T>` args
         * @type {?}
         */
        EntityDispatcherBase.prototype.toUpdate;
        /**
         * Name of the entity type for which entities are dispatched
         * @type {?}
         */
        EntityDispatcherBase.prototype.entityName;
        /**
         * Creates an {EntityAction}
         * @type {?}
         */
        EntityDispatcherBase.prototype.entityActionFactory;
        /**
         * The store, scoped to the EntityCache
         * @type {?}
         */
        EntityDispatcherBase.prototype.store;
        /**
         * Returns the primary key (id) of this entity
         * @type {?}
         */
        EntityDispatcherBase.prototype.selectId;
        /**
         * Dispatcher options configure dispatcher behavior such as
         * whether add is optimistic or pessimistic by default.
         * @type {?}
         * @private
         */
        EntityDispatcherBase.prototype.defaultDispatcherOptions;
        /**
         * Actions scanned by the store after it processed them with reducers.
         * @type {?}
         * @private
         */
        EntityDispatcherBase.prototype.reducedActions$;
        /**
         * Generates correlation ids for query and save methods
         * @type {?}
         * @private
         */
        EntityDispatcherBase.prototype.correlationIdGenerator;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/reducers/constants.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var ENTITY_CACHE_NAME = 'entityCache';
    /** @type {?} */
    var ENTITY_CACHE_NAME_TOKEN = new core.InjectionToken('@ngrx/data/entity-cache-name');
    /** @type {?} */
    var ENTITY_CACHE_META_REDUCERS = new core.InjectionToken('@ngrx/data/entity-cache-meta-reducers');
    /** @type {?} */
    var ENTITY_COLLECTION_META_REDUCERS = new core.InjectionToken('@ngrx/data/entity-collection-meta-reducers');
    /** @type {?} */
    var INITIAL_ENTITY_CACHE_STATE = new core.InjectionToken('@ngrx/data/initial-entity-cache-state');

    /**
     * @fileoverview added by tsickle
     * Generated from: src/selectors/entity-cache-selector.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var ENTITY_CACHE_SELECTOR_TOKEN = new core.InjectionToken('@ngrx/data/entity-cache-selector');
    /** @type {?} */
    var entityCacheSelectorProvider = {
        provide: ENTITY_CACHE_SELECTOR_TOKEN,
        useFactory: createEntityCacheSelector,
        deps: [[new core.Optional(), ENTITY_CACHE_NAME_TOKEN]],
    };
    /**
     * @param {?=} entityCacheName
     * @return {?}
     */
    function createEntityCacheSelector(entityCacheName) {
        entityCacheName = entityCacheName || ENTITY_CACHE_NAME;
        return store.createFeatureSelector(entityCacheName);
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/dispatchers/entity-dispatcher-factory.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Creates EntityDispatchers for entity collections
     */
    var EntityDispatcherFactory = /** @class */ (function () {
        /**
         * @param {?} entityActionFactory
         * @param {?} store
         * @param {?} entityDispatcherDefaultOptions
         * @param {?} scannedActions$
         * @param {?} entityCacheSelector
         * @param {?} correlationIdGenerator
         */
        function EntityDispatcherFactory(entityActionFactory, store, entityDispatcherDefaultOptions, scannedActions$, entityCacheSelector, correlationIdGenerator) {
            this.entityActionFactory = entityActionFactory;
            this.store = store;
            this.entityDispatcherDefaultOptions = entityDispatcherDefaultOptions;
            this.entityCacheSelector = entityCacheSelector;
            this.correlationIdGenerator = correlationIdGenerator;
            // Replay because sometimes in tests will fake data service with synchronous observable
            // which makes subscriber miss the dispatched actions.
            // Of course that's a testing mistake. But easy to forget, leading to painful debugging.
            this.reducedActions$ = scannedActions$.pipe(operators.shareReplay(1));
            // Start listening so late subscriber won't miss the most recent action.
            this.raSubscription = this.reducedActions$.subscribe();
        }
        /**
         * Create an `EntityDispatcher` for an entity type `T` and store.
         * @template T
         * @param {?} entityName
         * @param {?=} selectId
         * @param {?=} defaultOptions
         * @return {?}
         */
        EntityDispatcherFactory.prototype.create = function (
        /** Name of the entity type */
        entityName, 
        /**
         * Function that returns the primary key for an entity `T`.
         * Usually acquired from `EntityDefinition` metadata.
         */
        selectId, 
        /** Defaults for options that influence dispatcher behavior such as whether
         * `add()` is optimistic or pessimistic;
         */
        defaultOptions) {
            if (selectId === void 0) { selectId = defaultSelectId; }
            if (defaultOptions === void 0) { defaultOptions = {}; }
            // merge w/ defaultOptions with injected defaults
            /** @type {?} */
            var options = Object.assign(Object.assign({}, this.entityDispatcherDefaultOptions), defaultOptions);
            return new EntityDispatcherBase(entityName, this.entityActionFactory, this.store, selectId, options, this.reducedActions$, this.entityCacheSelector, this.correlationIdGenerator);
        };
        /**
         * @return {?}
         */
        EntityDispatcherFactory.prototype.ngOnDestroy = function () {
            this.raSubscription.unsubscribe();
        };
        return EntityDispatcherFactory;
    }());
    EntityDispatcherFactory.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    EntityDispatcherFactory.ctorParameters = function () { return [
        { type: EntityActionFactory },
        { type: store.Store },
        { type: EntityDispatcherDefaultOptions },
        { type: rxjs.Observable, decorators: [{ type: core.Inject, args: [store.ScannedActionsSubject,] }] },
        { type: undefined, decorators: [{ type: core.Inject, args: [ENTITY_CACHE_SELECTOR_TOKEN,] }] },
        { type: CorrelationIdGenerator }
    ]; };
    if (false) {
        /**
         * Actions scanned by the store after it processed them with reducers.
         * A replay observable of the most recent action reduced by the store.
         * @type {?}
         */
        EntityDispatcherFactory.prototype.reducedActions$;
        /**
         * @type {?}
         * @private
         */
        EntityDispatcherFactory.prototype.raSubscription;
        /**
         * @type {?}
         * @private
         */
        EntityDispatcherFactory.prototype.entityActionFactory;
        /**
         * @type {?}
         * @private
         */
        EntityDispatcherFactory.prototype.store;
        /**
         * @type {?}
         * @private
         */
        EntityDispatcherFactory.prototype.entityDispatcherDefaultOptions;
        /**
         * @type {?}
         * @private
         */
        EntityDispatcherFactory.prototype.entityCacheSelector;
        /**
         * @type {?}
         * @private
         */
        EntityDispatcherFactory.prototype.correlationIdGenerator;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/effects/entity-effects-scheduler.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    // See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
    /**
     * Token to inject a special RxJS Scheduler during marble tests.
     * @type {?}
     */
    var ENTITY_EFFECTS_SCHEDULER = new core.InjectionToken('EntityEffects Scheduler');

    /**
     * @fileoverview added by tsickle
     * Generated from: src/effects/entity-cache-effects.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var EntityCacheEffects = /** @class */ (function () {
        /**
         * @param {?} actions
         * @param {?} dataService
         * @param {?} entityActionFactory
         * @param {?} logger
         * @param {?} scheduler
         */
        function EntityCacheEffects(actions, dataService, entityActionFactory, logger, scheduler) {
            var _this = this;
            this.actions = actions;
            this.dataService = dataService;
            this.entityActionFactory = entityActionFactory;
            this.logger = logger;
            this.scheduler = scheduler;
            // See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
            /**
             * Delay for error and skip observables. Must be multiple of 10 for marble testing.
             */
            this.responseDelay = 10;
            /**
             * Observable of SAVE_ENTITIES_CANCEL actions with non-null correlation ids
             */
            this.saveEntitiesCancel$ = effects.createEffect(( /**
             * @return {?}
             */function () { return _this.actions.pipe(effects.ofType(EntityCacheAction.SAVE_ENTITIES_CANCEL), operators.filter(( /**
             * @param {?} a
             * @return {?}
             */function (a) { return a.payload.correlationId != null; }))); }), { dispatch: false });
            // Concurrent persistence requests considered unsafe.
            // `mergeMap` allows for concurrent requests which may return in any order
            this.saveEntities$ = effects.createEffect(( /**
             * @return {?}
             */function () { return _this.actions.pipe(effects.ofType(EntityCacheAction.SAVE_ENTITIES), operators.mergeMap(( /**
             * @param {?} action
             * @return {?}
             */function (action) { return _this.saveEntities(action); }))); }));
        }
        /**
         * Perform the requested SaveEntities actions and return a scalar Observable<Action>
         * that the effect should dispatch to the store after the server responds.
         * @param {?} action The SaveEntities action
         * @return {?}
         */
        EntityCacheEffects.prototype.saveEntities = function (action) {
            var _this = this;
            /** @type {?} */
            var error = action.payload.error;
            if (error) {
                return this.handleSaveEntitiesError$(action)(error);
            }
            try {
                /** @type {?} */
                var changeSet = excludeEmptyChangeSetItems(action.payload.changeSet);
                var _a = action.payload, correlationId_1 = _a.correlationId, mergeStrategy = _a.mergeStrategy, tag = _a.tag, url = _a.url;
                /** @type {?} */
                var options = { correlationId: correlationId_1, mergeStrategy: mergeStrategy, tag: tag };
                if (changeSet.changes.length === 0) {
                    // nothing to save
                    return rxjs.of(new SaveEntitiesSuccess(changeSet, url, options));
                }
                // Cancellation: returns Observable<SaveEntitiesCanceled> for a saveEntities action
                // whose correlationId matches the cancellation correlationId
                /** @type {?} */
                var c = this.saveEntitiesCancel$.pipe(operators.filter(( /**
                 * @param {?} a
                 * @return {?}
                 */function (a) { return correlationId_1 === a.payload.correlationId; })), operators.map(( /**
                 * @param {?} a
                 * @return {?}
                 */function (a) { return new SaveEntitiesCanceled(correlationId_1, a.payload.reason, a.payload.tag); })));
                // Data: SaveEntities result as a SaveEntitiesSuccess action
                /** @type {?} */
                var d = this.dataService.saveEntities(changeSet, url).pipe(operators.concatMap(( /**
                 * @param {?} result
                 * @return {?}
                 */function (result) { return _this.handleSaveEntitiesSuccess$(action, _this.entityActionFactory)(result); })), operators.catchError(this.handleSaveEntitiesError$(action)));
                // Emit which ever gets there first; the other observable is terminated.
                return rxjs.race(c, d);
            }
            catch (err) {
                return this.handleSaveEntitiesError$(action)(err);
            }
        };
        /**
         * return handler of error result of saveEntities, returning a scalar observable of error action
         * @private
         * @param {?} action
         * @return {?}
         */
        EntityCacheEffects.prototype.handleSaveEntitiesError$ = function (action) {
            var _this = this;
            // Although error may return immediately,
            // ensure observable takes some time,
            // as app likely assumes asynchronous response.
            return ( /**
             * @param {?} err
             * @return {?}
             */function (err) {
                /** @type {?} */
                var error = err instanceof DataServiceError ? err : new DataServiceError(err, null);
                return rxjs.of(new SaveEntitiesError(error, action)).pipe(operators.delay(_this.responseDelay, _this.scheduler || rxjs.asyncScheduler));
            });
        };
        /**
         * return handler of the ChangeSet result of successful saveEntities()
         * @private
         * @param {?} action
         * @param {?} entityActionFactory
         * @return {?}
         */
        EntityCacheEffects.prototype.handleSaveEntitiesSuccess$ = function (action, entityActionFactory) {
            var _a = action.payload, url = _a.url, correlationId = _a.correlationId, mergeStrategy = _a.mergeStrategy, tag = _a.tag;
            /** @type {?} */
            var options = { correlationId: correlationId, mergeStrategy: mergeStrategy, tag: tag };
            return ( /**
             * @param {?} changeSet
             * @return {?}
             */function (changeSet) {
                // DataService returned a ChangeSet with possible updates to the saved entities
                if (changeSet) {
                    return rxjs.of(new SaveEntitiesSuccess(changeSet, url, options));
                }
                // No ChangeSet = Server probably responded '204 - No Content' because
                // it made no changes to the inserted/updated entities.
                // Respond with success action best on the ChangeSet in the request.
                changeSet = action.payload.changeSet;
                // If pessimistic save, return success action with the original ChangeSet
                if (!action.payload.isOptimistic) {
                    return rxjs.of(new SaveEntitiesSuccess(changeSet, url, options));
                }
                // If optimistic save, avoid cache grinding by just turning off the loading flags
                // for all collections in the original ChangeSet
                /** @type {?} */
                var entityNames = changeSet.changes.reduce(( /**
                 * @param {?} acc
                 * @param {?} item
                 * @return {?}
                 */function (acc, item) { return acc.indexOf(item.entityName) === -1
                    ? acc.concat(item.entityName)
                    : acc; }), ( /** @type {?} */([])));
                return rxjs.merge(entityNames.map(( /**
                 * @param {?} name
                 * @return {?}
                 */function (name) { return entityActionFactory.create(name, EntityOp.SET_LOADING, false); })));
            });
        };
        return EntityCacheEffects;
    }());
    EntityCacheEffects.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    EntityCacheEffects.ctorParameters = function () { return [
        { type: effects.Actions },
        { type: EntityCacheDataService },
        { type: EntityActionFactory },
        { type: Logger },
        { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [ENTITY_EFFECTS_SCHEDULER,] }] }
    ]; };
    if (false) {
        /**
         * Delay for error and skip observables. Must be multiple of 10 for marble testing.
         * @type {?}
         * @private
         */
        EntityCacheEffects.prototype.responseDelay;
        /**
         * Observable of SAVE_ENTITIES_CANCEL actions with non-null correlation ids
         * @type {?}
         */
        EntityCacheEffects.prototype.saveEntitiesCancel$;
        /** @type {?} */
        EntityCacheEffects.prototype.saveEntities$;
        /**
         * @type {?}
         * @private
         */
        EntityCacheEffects.prototype.actions;
        /**
         * @type {?}
         * @private
         */
        EntityCacheEffects.prototype.dataService;
        /**
         * @type {?}
         * @private
         */
        EntityCacheEffects.prototype.entityActionFactory;
        /**
         * @type {?}
         * @private
         */
        EntityCacheEffects.prototype.logger;
        /**
         * Injecting an optional Scheduler that will be undefined
         * in normal application usage, but its injected here so that you can mock out
         * during testing using the RxJS TestScheduler for simulating passages of time.
         * @type {?}
         * @private
         */
        EntityCacheEffects.prototype.scheduler;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/effects/entity-effects.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var persistOps = [
        EntityOp.QUERY_ALL,
        EntityOp.QUERY_LOAD,
        EntityOp.QUERY_BY_KEY,
        EntityOp.QUERY_MANY,
        EntityOp.SAVE_ADD_ONE,
        EntityOp.SAVE_DELETE_ONE,
        EntityOp.SAVE_UPDATE_ONE,
        EntityOp.SAVE_UPSERT_ONE,
    ];
    var EntityEffects = /** @class */ (function () {
        /**
         * @param {?} actions
         * @param {?} dataService
         * @param {?} entityActionFactory
         * @param {?} resultHandler
         * @param {?} scheduler
         */
        function EntityEffects(actions, dataService, entityActionFactory, resultHandler, scheduler) {
            var _this = this;
            this.actions = actions;
            this.dataService = dataService;
            this.entityActionFactory = entityActionFactory;
            this.resultHandler = resultHandler;
            this.scheduler = scheduler;
            // See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
            /**
             * Delay for error and skip observables. Must be multiple of 10 for marble testing.
             */
            this.responseDelay = 10;
            /**
             * Observable of non-null cancellation correlation ids from CANCEL_PERSIST actions
             */
            this.cancel$ = effects.createEffect(( /**
             * @return {?}
             */function () { return _this.actions.pipe(ofEntityOp(EntityOp.CANCEL_PERSIST), operators.map(( /**
             * @param {?} action
             * @return {?}
             */function (action) { return action.payload.correlationId; })), operators.filter(( /**
             * @param {?} id
             * @return {?}
             */function (id) { return id != null; }))); }), { dispatch: false });
            // `mergeMap` allows for concurrent requests which may return in any order
            this.persist$ = effects.createEffect(( /**
             * @return {?}
             */function () { return _this.actions.pipe(ofEntityOp(persistOps), operators.mergeMap(( /**
             * @param {?} action
             * @return {?}
             */function (action) { return _this.persist(action); }))); }));
        }
        /**
         * Perform the requested persistence operation and return a scalar Observable<Action>
         * that the effect should dispatch to the store after the server responds.
         * @param {?} action A persistence operation EntityAction
         * @return {?}
         */
        EntityEffects.prototype.persist = function (action) {
            var _this = this;
            if (action.payload.skip) {
                // Should not persist. Pretend it succeeded.
                return this.handleSkipSuccess$(action);
            }
            if (action.payload.error) {
                return this.handleError$(action)(action.payload.error);
            }
            try {
                // Cancellation: returns Observable of CANCELED_PERSIST for a persistence EntityAction
                // whose correlationId matches cancellation correlationId
                /** @type {?} */
                var c = this.cancel$.pipe(operators.filter(( /**
                 * @param {?} id
                 * @return {?}
                 */function (id) { return action.payload.correlationId === id; })), operators.map(( /**
                 * @param {?} id
                 * @return {?}
                 */function (id) { return _this.entityActionFactory.createFromAction(action, {
                    entityOp: EntityOp.CANCELED_PERSIST,
                }); })));
                // Data: entity collection DataService result as a successful persistence EntityAction
                /** @type {?} */
                var d = this.callDataService(action).pipe(operators.map(this.resultHandler.handleSuccess(action)), operators.catchError(this.handleError$(action)));
                // Emit which ever gets there first; the other observable is terminated.
                return rxjs.race(c, d);
            }
            catch (err) {
                return this.handleError$(action)(err);
            }
        };
        /**
         * @private
         * @param {?} action
         * @return {?}
         */
        EntityEffects.prototype.callDataService = function (action) {
            var _a = action.payload, entityName = _a.entityName, entityOp = _a.entityOp, data = _a.data;
            /** @type {?} */
            var service = this.dataService.getService(entityName);
            switch (entityOp) {
                case EntityOp.QUERY_ALL:
                case EntityOp.QUERY_LOAD:
                    return service.getAll();
                case EntityOp.QUERY_BY_KEY:
                    return service.getById(data);
                case EntityOp.QUERY_MANY:
                    return service.getWithQuery(data);
                case EntityOp.SAVE_ADD_ONE:
                    return service.add(data);
                case EntityOp.SAVE_DELETE_ONE:
                    return service.delete(data);
                case EntityOp.SAVE_UPDATE_ONE:
                    var _b = ( /** @type {?} */(data)), id_1 = _b.id, changes_1 = _b.changes;
                    return service.update(data).pipe(operators.map(( /**
                     * @param {?} updatedEntity
                     * @return {?}
                     */function (updatedEntity) {
                        // Return an Update<T> with updated entity data.
                        // If server returned entity data, merge with the changes that were sent
                        // and set the 'changed' flag to true.
                        // If server did not return entity data,
                        // assume it made no additional changes of its own, return the original changes,
                        // and set the `changed` flag to `false`.
                        /** @type {?} */
                        var hasData = updatedEntity && Object.keys(updatedEntity).length > 0;
                        /** @type {?} */
                        var responseData = hasData
                            ? { id: id_1, changes: Object.assign(Object.assign({}, changes_1), updatedEntity), changed: true }
                            : { id: id_1, changes: changes_1, changed: false };
                        return responseData;
                    })));
                case EntityOp.SAVE_UPSERT_ONE:
                    return service.upsert(data).pipe(operators.map(( /**
                     * @param {?} upsertedEntity
                     * @return {?}
                     */function (upsertedEntity) {
                        /** @type {?} */
                        var hasData = upsertedEntity && Object.keys(upsertedEntity).length > 0;
                        return hasData ? upsertedEntity : data; // ensure a returned entity value.
                    })));
                default:
                    throw new Error("Persistence action \"" + entityOp + "\" is not implemented.");
            }
        };
        /**
         * Handle error result of persistence operation on an EntityAction,
         * returning a scalar observable of error action
         * @private
         * @param {?} action
         * @return {?}
         */
        EntityEffects.prototype.handleError$ = function (action) {
            var _this = this;
            // Although error may return immediately,
            // ensure observable takes some time,
            // as app likely assumes asynchronous response.
            return ( /**
             * @param {?} error
             * @return {?}
             */function (error) { return rxjs.of(_this.resultHandler.handleError(action)(error)).pipe(operators.delay(_this.responseDelay, _this.scheduler || rxjs.asyncScheduler)); });
        };
        /**
         * Because EntityAction.payload.skip is true, skip the persistence step and
         * return a scalar success action that looks like the operation succeeded.
         * @private
         * @param {?} originalAction
         * @return {?}
         */
        EntityEffects.prototype.handleSkipSuccess$ = function (originalAction) {
            /** @type {?} */
            var successOp = makeSuccessOp(originalAction.payload.entityOp);
            /** @type {?} */
            var successAction = this.entityActionFactory.createFromAction(originalAction, {
                entityOp: successOp,
            });
            // Although returns immediately,
            // ensure observable takes one tick (by using a promise),
            // as app likely assumes asynchronous response.
            return rxjs.of(successAction).pipe(operators.delay(this.responseDelay, this.scheduler || rxjs.asyncScheduler));
        };
        return EntityEffects;
    }());
    EntityEffects.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    EntityEffects.ctorParameters = function () { return [
        { type: effects.Actions },
        { type: EntityDataService },
        { type: EntityActionFactory },
        { type: PersistenceResultHandler },
        { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [ENTITY_EFFECTS_SCHEDULER,] }] }
    ]; };
    if (false) {
        /**
         * Delay for error and skip observables. Must be multiple of 10 for marble testing.
         * @type {?}
         * @private
         */
        EntityEffects.prototype.responseDelay;
        /**
         * Observable of non-null cancellation correlation ids from CANCEL_PERSIST actions
         * @type {?}
         */
        EntityEffects.prototype.cancel$;
        /** @type {?} */
        EntityEffects.prototype.persist$;
        /**
         * @type {?}
         * @private
         */
        EntityEffects.prototype.actions;
        /**
         * @type {?}
         * @private
         */
        EntityEffects.prototype.dataService;
        /**
         * @type {?}
         * @private
         */
        EntityEffects.prototype.entityActionFactory;
        /**
         * @type {?}
         * @private
         */
        EntityEffects.prototype.resultHandler;
        /**
         * Injecting an optional Scheduler that will be undefined
         * in normal application usage, but its injected here so that you can mock out
         * during testing using the RxJS TestScheduler for simulating passages of time.
         * @type {?}
         * @private
         */
        EntityEffects.prototype.scheduler;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/entity-metadata/entity-filters.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Creates an {EntityFilterFn} that matches RegExp or RegExp string pattern
     * anywhere in any of the given props of an entity.
     * If pattern is a string, spaces are significant and ignores case.
     * @template T
     * @param {?=} props
     * @return {?}
     */
    function PropsFilterFnFactory(props) {
        if (props === void 0) { props = []; }
        if (props.length === 0) {
            // No properties -> nothing could match -> return unfiltered
            return ( /**
             * @param {?} entities
             * @param {?} pattern
             * @return {?}
             */function (entities, pattern) { return entities; });
        }
        return ( /**
         * @param {?} entities
         * @param {?} pattern
         * @return {?}
         */function (entities, pattern) {
            if (!entities) {
                return [];
            }
            /** @type {?} */
            var regExp = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
            if (regExp) {
                /** @type {?} */
                var predicate = ( /**
                 * @param {?} e
                 * @return {?}
                 */function (e) { return props.some(( /**
                 * @param {?} prop
                 * @return {?}
                 */function (prop) { return regExp.test(e[prop]); })); });
                return entities.filter(predicate);
            }
            return entities;
        });
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/entity-services/entity-collection-service-base.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    // tslint:disable:member-ordering
    /**
     * Base class for a concrete EntityCollectionService<T>.
     * Can be instantiated. Cannot be injected. Use EntityCollectionServiceFactory to create.
     * @param EntityCollectionServiceElements The ingredients for this service
     * as a source of supporting services for creating an EntityCollectionService<T> instance.
     * @template T, S$
     */
    var EntityCollectionServiceBase = /** @class */ (function () {
        /**
         * @param {?} entityName
         * @param {?} serviceElementsFactory
         */
        function EntityCollectionServiceBase(entityName, 
        /** Creates the core elements of the EntityCollectionService for this entity type */
        serviceElementsFactory) {
            this.entityName = entityName;
            entityName = entityName.trim();
            var _a = serviceElementsFactory.create(entityName), dispatcher = _a.dispatcher, selectors = _a.selectors, selectors$ = _a.selectors$;
            this.entityName = entityName;
            this.dispatcher = dispatcher;
            this.guard = dispatcher.guard;
            this.selectId = dispatcher.selectId;
            this.toUpdate = dispatcher.toUpdate;
            this.selectors = selectors;
            this.selectors$ = selectors$;
            this.collection$ = selectors$.collection$;
            this.count$ = selectors$.count$;
            this.entities$ = selectors$.entities$;
            this.entityActions$ = selectors$.entityActions$;
            this.entityMap$ = selectors$.entityMap$;
            this.errors$ = selectors$.errors$;
            this.filter$ = selectors$.filter$;
            this.filteredEntities$ = selectors$.filteredEntities$;
            this.keys$ = selectors$.keys$;
            this.loaded$ = selectors$.loaded$;
            this.loading$ = selectors$.loading$;
            this.changeState$ = selectors$.changeState$;
        }
        /**
         * Create an {EntityAction} for this entity type.
         * @template P
         * @param {?} op {EntityOp} the entity operation
         * @param {?=} data
         * @param {?=} options
         * @return {?} the EntityAction
         */
        EntityCollectionServiceBase.prototype.createEntityAction = function (op, data, options) {
            return this.dispatcher.createEntityAction(op, data, options);
        };
        /**
         * Create an {EntityAction} for this entity type and
         * dispatch it immediately to the store.
         * @template P
         * @param {?} op {EntityOp} the entity operation
         * @param {?=} data
         * @param {?=} options
         * @return {?} the dispatched EntityAction
         */
        EntityCollectionServiceBase.prototype.createAndDispatch = function (op, data, options) {
            return this.dispatcher.createAndDispatch(op, data, options);
        };
        /**
         * Dispatch an action of any type to the ngrx store.
         * @param {?} action the Action
         * @return {?} the dispatched Action
         */
        EntityCollectionServiceBase.prototype.dispatch = function (action) {
            return this.dispatcher.dispatch(action);
        };
        Object.defineProperty(EntityCollectionServiceBase.prototype, "store", {
            /**
             * The NgRx Store for the {EntityCache}
             * @return {?}
             */
            get: function () {
                return this.dispatcher.store;
            },
            enumerable: false,
            configurable: true
        });
        // region Dispatch commands
        /**
         * Dispatch action to save a new entity to remote storage.
         * @param {?} entity entity to add, which may omit its key if pessimistic and the server creates the key;
         * must have a key if optimistic save.
         * @param {?=} options
         * @return {?} Observable of the entity
         * after server reports successful save or the save error.
         */
        EntityCollectionServiceBase.prototype.add = function (entity, options) {
            return this.dispatcher.add(entity, options);
        };
        /**
         * Dispatch action to cancel the persistence operation (query or save) with the given correlationId.
         * @param {?} correlationId The correlation id for the corresponding EntityAction
         * @param {?=} reason
         * @param {?=} options
         * @return {?}
         */
        EntityCollectionServiceBase.prototype.cancel = function (correlationId, reason, options) {
            this.dispatcher.cancel(correlationId, reason, options);
        };
        /**
         * @param {?} arg
         * @param {?=} options
         * @return {?}
         */
        EntityCollectionServiceBase.prototype.delete = function (arg, options) {
            return this.dispatcher.delete(( /** @type {?} */(arg)), options);
        };
        /**
         * Dispatch action to query remote storage for all entities and
         * merge the queried entities into the cached collection.
         * @see load()
         * @param {?=} options
         * @return {?} Observable of the collection
         * after server reports successful query or the query error.
         */
        EntityCollectionServiceBase.prototype.getAll = function (options) {
            return this.dispatcher.getAll(options);
        };
        /**
         * Dispatch action to query remote storage for the entity with this primary key.
         * If the server returns an entity,
         * merge it into the cached collection.
         * @param {?} key The primary key of the entity to get.
         * @param {?=} options
         * @return {?} Observable of the queried entity that is in the collection
         * after server reports success or the query error.
         */
        EntityCollectionServiceBase.prototype.getByKey = function (key, options) {
            return this.dispatcher.getByKey(key, options);
        };
        /**
         * Dispatch action to query remote storage for the entities that satisfy a query expressed
         * with either a query parameter map or an HTTP URL query string,
         * and merge the results into the cached collection.
         * @param {?} queryParams the query in a form understood by the server
         * @param {?=} options
         * @return {?} Observable of the queried entities
         * after server reports successful query or the query error.
         */
        EntityCollectionServiceBase.prototype.getWithQuery = function (queryParams, options) {
            return this.dispatcher.getWithQuery(queryParams, options);
        };
        /**
         * Dispatch action to query remote storage for all entities and
         * completely replace the cached collection with the queried entities.
         * @see getAll
         * @param {?=} options
         * @return {?} Observable of the collection
         * after server reports successful query or the query error.
         */
        EntityCollectionServiceBase.prototype.load = function (options) {
            return this.dispatcher.load(options);
        };
        /**
         * Dispatch action to save the updated entity (or partial entity) in remote storage.
         * The update entity may be partial (but must have its key)
         * in which case it patches the existing entity.
         * @param {?} entity update entity, which might be a partial of T but must at least have its key.
         * @param {?=} options
         * @return {?} Observable of the updated entity
         * after server reports successful save or the save error.
         */
        EntityCollectionServiceBase.prototype.update = function (entity, options) {
            return this.dispatcher.update(entity, options);
        };
        /**
         * Dispatch action to save a new or existing entity to remote storage.
         * Call only if the server supports upsert.
         * @param {?} entity entity to add or upsert.
         * It may omit its key if an add, and is pessimistic, and the server creates the key;
         * must have a key if optimistic save.
         * @param {?=} options
         * @return {?} Observable of the entity
         * after server reports successful save or the save error.
         */
        EntityCollectionServiceBase.prototype.upsert = function (entity, options) {
            return this.dispatcher.upsert(entity, options);
        };
        /*** Cache-only operations that do not update remote storage ***/
        /**
         * Replace all entities in the cached collection.
         * Does not save to remote storage.
         * @param {?} entities to add directly to cache.
         * @param {?=} options
         * @return {?}
         */
        EntityCollectionServiceBase.prototype.addAllToCache = function (entities, options) {
            this.dispatcher.addAllToCache(entities, options);
        };
        /**
         * Add a new entity directly to the cache.
         * Does not save to remote storage.
         * Ignored if an entity with the same primary key is already in cache.
         * @param {?} entity to add directly to cache.
         * @param {?=} options
         * @return {?}
         */
        EntityCollectionServiceBase.prototype.addOneToCache = function (entity, options) {
            this.dispatcher.addOneToCache(entity, options);
        };
        /**
         * Add multiple new entities directly to the cache.
         * Does not save to remote storage.
         * Entities with primary keys already in cache are ignored.
         * @param {?} entities to add directly to cache.
         * @param {?=} options
         * @return {?}
         */
        EntityCollectionServiceBase.prototype.addManyToCache = function (entities, options) {
            this.dispatcher.addManyToCache(entities, options);
        };
        /**
         * Clear the cached entity collection
         * @return {?}
         */
        EntityCollectionServiceBase.prototype.clearCache = function () {
            this.dispatcher.clearCache();
        };
        /**
         * @param {?} arg
         * @param {?=} options
         * @return {?}
         */
        EntityCollectionServiceBase.prototype.removeOneFromCache = function (arg, options) {
            this.dispatcher.removeOneFromCache(( /** @type {?} */(arg)), options);
        };
        /**
         * @param {?} args
         * @param {?=} options
         * @return {?}
         */
        EntityCollectionServiceBase.prototype.removeManyFromCache = function (args, options) {
            this.dispatcher.removeManyFromCache(( /** @type {?} */(args)), options);
        };
        /**
         * Update a cached entity directly.
         * Does not update that entity in remote storage.
         * Ignored if an entity with matching primary key is not in cache.
         * The update entity may be partial (but must have its key)
         * in which case it patches the existing entity.
         * @param {?} entity to update directly in cache.
         * @param {?=} options
         * @return {?}
         */
        EntityCollectionServiceBase.prototype.updateOneInCache = function (entity, options) {
            // update entity might be a partial of T but must at least have its key.
            // pass the Update<T> structure as the payload
            this.dispatcher.updateOneInCache(entity, options);
        };
        /**
         * Update multiple cached entities directly.
         * Does not update these entities in remote storage.
         * Entities whose primary keys are not in cache are ignored.
         * Update entities may be partial but must at least have their keys.
         * such partial entities patch their cached counterparts.
         * @param {?} entities to update directly in cache.
         * @param {?=} options
         * @return {?}
         */
        EntityCollectionServiceBase.prototype.updateManyInCache = function (entities, options) {
            this.dispatcher.updateManyInCache(entities, options);
        };
        /**
         * Insert or update a cached entity directly.
         * Does not save to remote storage.
         * Upsert entity might be a partial of T but must at least have its key.
         * Pass the Update<T> structure as the payload.
         * @param {?} entity to upsert directly in cache.
         * @param {?=} options
         * @return {?}
         */
        EntityCollectionServiceBase.prototype.upsertOneInCache = function (entity, options) {
            this.dispatcher.upsertOneInCache(entity, options);
        };
        /**
         * Insert or update multiple cached entities directly.
         * Does not save to remote storage.
         * Upsert entities might be partial but must at least have their keys.
         * Pass an array of the Update<T> structure as the payload.
         * @param {?} entities to upsert directly in cache.
         * @param {?=} options
         * @return {?}
         */
        EntityCollectionServiceBase.prototype.upsertManyInCache = function (entities, options) {
            this.dispatcher.upsertManyInCache(entities, options);
        };
        /**
         * Set the pattern that the collection's filter applies
         * when using the `filteredEntities` selector.
         * @param {?} pattern
         * @return {?}
         */
        EntityCollectionServiceBase.prototype.setFilter = function (pattern) {
            this.dispatcher.setFilter(pattern);
        };
        /**
         * Set the loaded flag
         * @param {?} isLoaded
         * @return {?}
         */
        EntityCollectionServiceBase.prototype.setLoaded = function (isLoaded) {
            this.dispatcher.setLoaded(!!isLoaded);
        };
        /**
         * Set the loading flag
         * @param {?} isLoading
         * @return {?}
         */
        EntityCollectionServiceBase.prototype.setLoading = function (isLoading) {
            this.dispatcher.setLoading(!!isLoading);
        };
        return EntityCollectionServiceBase;
    }());
    if (false) {
        /**
         * Dispatcher of EntityCommands (EntityActions)
         * @type {?}
         */
        EntityCollectionServiceBase.prototype.dispatcher;
        /**
         * All selectors of entity collection properties
         * @type {?}
         */
        EntityCollectionServiceBase.prototype.selectors;
        /**
         * All selectors$ (observables of entity collection properties)
         * @type {?}
         */
        EntityCollectionServiceBase.prototype.selectors$;
        /**
         * Utility class with methods to validate EntityAction payloads.
         * @type {?}
         */
        EntityCollectionServiceBase.prototype.guard;
        /**
         * Returns the primary key (id) of this entity
         * @type {?}
         */
        EntityCollectionServiceBase.prototype.selectId;
        /**
         * Convert an entity (or partial entity) into the `Update<T>` object
         * `update...` and `upsert...` methods take `Update<T>` args
         * @type {?}
         */
        EntityCollectionServiceBase.prototype.toUpdate;
        /**
         * Observable of the collection as a whole
         * @type {?}
         */
        EntityCollectionServiceBase.prototype.collection$;
        /**
         * Observable of count of entities in the cached collection.
         * @type {?}
         */
        EntityCollectionServiceBase.prototype.count$;
        /**
         * Observable of all entities in the cached collection.
         * @type {?}
         */
        EntityCollectionServiceBase.prototype.entities$;
        /**
         * Observable of actions related to this entity type.
         * @type {?}
         */
        EntityCollectionServiceBase.prototype.entityActions$;
        /**
         * Observable of the map of entity keys to entities
         * @type {?}
         */
        EntityCollectionServiceBase.prototype.entityMap$;
        /**
         * Observable of error actions related to this entity type.
         * @type {?}
         */
        EntityCollectionServiceBase.prototype.errors$;
        /**
         * Observable of the filter pattern applied by the entity collection's filter function
         * @type {?}
         */
        EntityCollectionServiceBase.prototype.filter$;
        /**
         * Observable of entities in the cached collection that pass the filter function
         * @type {?}
         */
        EntityCollectionServiceBase.prototype.filteredEntities$;
        /**
         * Observable of the keys of the cached collection, in the collection's native sort order
         * @type {?}
         */
        EntityCollectionServiceBase.prototype.keys$;
        /**
         * Observable true when the collection has been loaded
         * @type {?}
         */
        EntityCollectionServiceBase.prototype.loaded$;
        /**
         * Observable true when a multi-entity query command is in progress.
         * @type {?}
         */
        EntityCollectionServiceBase.prototype.loading$;
        /**
         * Original entity values for entities with unsaved changes
         * @type {?}
         */
        EntityCollectionServiceBase.prototype.changeState$;
        /**
         * Name of the entity type of this collection service
         * @type {?}
         */
        EntityCollectionServiceBase.prototype.entityName;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/reducers/entity-collection-creator.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var EntityCollectionCreator = /** @class */ (function () {
        /**
         * @param {?=} entityDefinitionService
         */
        function EntityCollectionCreator(entityDefinitionService) {
            this.entityDefinitionService = entityDefinitionService;
        }
        /**
         * Create the default collection for an entity type.
         * @template T, S
         * @param {?} entityName {string} entity type name
         * @return {?}
         */
        EntityCollectionCreator.prototype.create = function (entityName) {
            /** @type {?} */
            var def = this.entityDefinitionService &&
                this.entityDefinitionService.getDefinition(entityName, false /*shouldThrow*/);
            /** @type {?} */
            var initialState = def && def.initialState;
            return ( /** @type {?} */((initialState || createEmptyEntityCollection(entityName))));
        };
        return EntityCollectionCreator;
    }());
    EntityCollectionCreator.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    EntityCollectionCreator.ctorParameters = function () { return [
        { type: EntityDefinitionService, decorators: [{ type: core.Optional }] }
    ]; };
    if (false) {
        /**
         * @type {?}
         * @private
         */
        EntityCollectionCreator.prototype.entityDefinitionService;
    }
    /**
     * @template T
     * @param {?=} entityName
     * @return {?}
     */
    function createEmptyEntityCollection(entityName) {
        return ( /** @type {?} */({
            entityName: entityName,
            ids: [],
            entities: {},
            filter: undefined,
            loaded: false,
            loading: false,
            changeState: {},
        }));
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/selectors/entity-selectors.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * The selector functions for entity collection members,
     * Selects from the entity collection to the collection member
     * Contrast with {EntitySelectors}.
     * @record
     * @template T
     */
    function CollectionSelectors() { }
    if (false) {
        /**
         * Count of entities in the cached collection.
         * @type {?}
         */
        CollectionSelectors.prototype.selectCount;
        /**
         * All entities in the cached collection.
         * @type {?}
         */
        CollectionSelectors.prototype.selectEntities;
        /**
         * Map of entity keys to entities
         * @type {?}
         */
        CollectionSelectors.prototype.selectEntityMap;
        /**
         * Filter pattern applied by the entity collection's filter function
         * @type {?}
         */
        CollectionSelectors.prototype.selectFilter;
        /**
         * Entities in the cached collection that pass the filter function
         * @type {?}
         */
        CollectionSelectors.prototype.selectFilteredEntities;
        /**
         * Keys of the cached collection, in the collection's native sort order
         * @type {?}
         */
        CollectionSelectors.prototype.selectKeys;
        /**
         * True when the collection has been fully loaded.
         * @type {?}
         */
        CollectionSelectors.prototype.selectLoaded;
        /**
         * True when a multi-entity query command is in progress.
         * @type {?}
         */
        CollectionSelectors.prototype.selectLoading;
        /**
         * ChangeState (including original values) of entities with unsaved changes
         * @type {?}
         */
        CollectionSelectors.prototype.selectChangeState;
        /* Skipping unhandled member: readonly [selector: string]: any;*/
    }
    /**
     * The selector functions for entity collection members,
     * Selects from store root, through EntityCache, to the entity collection member
     * Contrast with {CollectionSelectors}.
     * @record
     * @template T
     */
    function EntitySelectors() { }
    if (false) {
        /**
         * Name of the entity collection for these selectors
         * @type {?}
         */
        EntitySelectors.prototype.entityName;
        /**
         * The cached EntityCollection itself
         * @type {?}
         */
        EntitySelectors.prototype.selectCollection;
        /**
         * Count of entities in the cached collection.
         * @type {?}
         */
        EntitySelectors.prototype.selectCount;
        /**
         * All entities in the cached collection.
         * @type {?}
         */
        EntitySelectors.prototype.selectEntities;
        /**
         * The EntityCache
         * @type {?}
         */
        EntitySelectors.prototype.selectEntityCache;
        /**
         * Map of entity keys to entities
         * @type {?}
         */
        EntitySelectors.prototype.selectEntityMap;
        /**
         * Filter pattern applied by the entity collection's filter function
         * @type {?}
         */
        EntitySelectors.prototype.selectFilter;
        /**
         * Entities in the cached collection that pass the filter function
         * @type {?}
         */
        EntitySelectors.prototype.selectFilteredEntities;
        /**
         * Keys of the cached collection, in the collection's native sort order
         * @type {?}
         */
        EntitySelectors.prototype.selectKeys;
        /**
         * True when the collection has been fully loaded.
         * @type {?}
         */
        EntitySelectors.prototype.selectLoaded;
        /**
         * True when a multi-entity query command is in progress.
         * @type {?}
         */
        EntitySelectors.prototype.selectLoading;
        /**
         * ChangeState (including original values) of entities with unsaved changes
         * @type {?}
         */
        EntitySelectors.prototype.selectChangeState;
        /* Skipping unhandled member: readonly [name: string]: MemoizedSelector<EntityCollection<T>, any> | string;*/
    }
    /**
     * Creates EntitySelector functions for entity collections.
     */
    var EntitySelectorsFactory = /** @class */ (function () {
        /**
         * @param {?=} entityCollectionCreator
         * @param {?=} selectEntityCache
         */
        function EntitySelectorsFactory(entityCollectionCreator, selectEntityCache) {
            this.entityCollectionCreator =
                entityCollectionCreator || new EntityCollectionCreator();
            this.selectEntityCache =
                selectEntityCache || createEntityCacheSelector(ENTITY_CACHE_NAME);
        }
        /**
         * Create the NgRx selector from the store root to the named collection,
         * e.g. from Object to Heroes.
         * @template T, C
         * @param {?} entityName the name of the collection
         * @return {?}
         */
        EntitySelectorsFactory.prototype.createCollectionSelector = function (entityName) {
            var _this = this;
            /** @type {?} */
            var getCollection = ( /**
             * @param {?=} cache
             * @return {?}
             */function (cache) {
                if (cache === void 0) { cache = {}; }
                return ( /** @type {?} */(((cache[entityName] ||
                    _this.entityCollectionCreator.create(entityName)))));
            });
            return store.createSelector(this.selectEntityCache, getCollection);
        };
        // createCollectionSelectors implementation
        /**
         * @template T, S
         * @param {?} metadataOrName
         * @return {?}
         */
        EntitySelectorsFactory.prototype.createCollectionSelectors = function (metadataOrName) {
            /** @type {?} */
            var metadata = typeof metadataOrName === 'string'
                ? { entityName: metadataOrName }
                : metadataOrName;
            /** @type {?} */
            var selectKeys = ( /**
             * @param {?} c
             * @return {?}
             */function (c) { return c.ids; });
            /** @type {?} */
            var selectEntityMap = ( /**
             * @param {?} c
             * @return {?}
             */function (c) { return c.entities; });
            /** @type {?} */
            var selectEntities = store.createSelector(selectKeys, selectEntityMap, ( /**
             * @param {?} keys
             * @param {?} entities
             * @return {?}
             */function (keys, entities) { return keys.map(( /**
             * @param {?} key
             * @return {?}
             */function (key) { return ( /** @type {?} */(entities[key])); })); }));
            /** @type {?} */
            var selectCount = store.createSelector(selectKeys, ( /**
             * @param {?} keys
             * @return {?}
             */function (keys) { return keys.length; }));
            // EntityCollection selectors that go beyond the ngrx/entity/EntityState selectors
            /** @type {?} */
            var selectFilter = ( /**
             * @param {?} c
             * @return {?}
             */function (c) { return c.filter; });
            /** @type {?} */
            var filterFn = metadata.filterFn;
            /** @type {?} */
            var selectFilteredEntities = filterFn
                ? store.createSelector(selectEntities, selectFilter, ( /**
                 * @param {?} entities
                 * @param {?} pattern
                 * @return {?}
                 */function (entities, pattern) { return filterFn(entities, pattern); }))
                : selectEntities;
            /** @type {?} */
            var selectLoaded = ( /**
             * @param {?} c
             * @return {?}
             */function (c) { return c.loaded; });
            /** @type {?} */
            var selectLoading = ( /**
             * @param {?} c
             * @return {?}
             */function (c) { return c.loading; });
            /** @type {?} */
            var selectChangeState = ( /**
             * @param {?} c
             * @return {?}
             */function (c) { return c.changeState; });
            // Create collection selectors for each `additionalCollectionState` property.
            // These all extend from `selectCollection`
            /** @type {?} */
            var extra = metadata.additionalCollectionState || {};
            /** @type {?} */
            var extraSelectors = {};
            Object.keys(extra).forEach(( /**
             * @param {?} k
             * @return {?}
             */function (k) {
                extraSelectors['select' + k[0].toUpperCase() + k.slice(1)] = ( /**
                 * @param {?} c
                 * @return {?}
                 */function (c) { return (( /** @type {?} */(c)))[k]; });
            }));
            return ( /** @type {?} */(Object.assign({ selectCount: selectCount,
                selectEntities: selectEntities,
                selectEntityMap: selectEntityMap,
                selectFilter: selectFilter,
                selectFilteredEntities: selectFilteredEntities,
                selectKeys: selectKeys,
                selectLoaded: selectLoaded,
                selectLoading: selectLoading,
                selectChangeState: selectChangeState }, extraSelectors)));
        };
        // createCollectionSelectors implementation
        /**
         * @template T, S
         * @param {?} metadataOrName
         * @return {?}
         */
        EntitySelectorsFactory.prototype.create = function (metadataOrName) {
            /** @type {?} */
            var metadata = typeof metadataOrName === 'string'
                ? { entityName: metadataOrName }
                : metadataOrName;
            /** @type {?} */
            var entityName = metadata.entityName;
            /** @type {?} */
            var selectCollection = this.createCollectionSelector(entityName);
            /** @type {?} */
            var collectionSelectors = this.createCollectionSelectors(metadata);
            /** @type {?} */
            var entitySelectors = {};
            Object.keys(collectionSelectors).forEach(( /**
             * @param {?} k
             * @return {?}
             */function (k) {
                entitySelectors[k] = store.createSelector(selectCollection, collectionSelectors[k]);
            }));
            return ( /** @type {?} */(Object.assign({ entityName: entityName,
                selectCollection: selectCollection, selectEntityCache: this.selectEntityCache }, entitySelectors)));
        };
        return EntitySelectorsFactory;
    }());
    EntitySelectorsFactory.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    EntitySelectorsFactory.ctorParameters = function () { return [
        { type: EntityCollectionCreator, decorators: [{ type: core.Optional }] },
        { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [ENTITY_CACHE_SELECTOR_TOKEN,] }] }
    ]; };
    if (false) {
        /**
         * @type {?}
         * @private
         */
        EntitySelectorsFactory.prototype.entityCollectionCreator;
        /**
         * @type {?}
         * @private
         */
        EntitySelectorsFactory.prototype.selectEntityCache;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/selectors/entity-selectors$.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * The selector observable functions for entity collection members.
     * @record
     * @template T
     */
    function EntitySelectors$() { }
    if (false) {
        /**
         * Name of the entity collection for these selectors$
         * @type {?}
         */
        EntitySelectors$.prototype.entityName;
        /**
         * Observable of the collection as a whole
         * @type {?}
         */
        EntitySelectors$.prototype.collection$;
        /**
         * Observable of count of entities in the cached collection.
         * @type {?}
         */
        EntitySelectors$.prototype.count$;
        /**
         * Observable of all entities in the cached collection.
         * @type {?}
         */
        EntitySelectors$.prototype.entities$;
        /**
         * Observable of actions related to this entity type.
         * @type {?}
         */
        EntitySelectors$.prototype.entityActions$;
        /**
         * Observable of the map of entity keys to entities
         * @type {?}
         */
        EntitySelectors$.prototype.entityMap$;
        /**
         * Observable of error actions related to this entity type.
         * @type {?}
         */
        EntitySelectors$.prototype.errors$;
        /**
         * Observable of the filter pattern applied by the entity collection's filter function
         * @type {?}
         */
        EntitySelectors$.prototype.filter$;
        /**
         * Observable of entities in the cached collection that pass the filter function
         * @type {?}
         */
        EntitySelectors$.prototype.filteredEntities$;
        /**
         * Observable of the keys of the cached collection, in the collection's native sort order
         * @type {?}
         */
        EntitySelectors$.prototype.keys$;
        /**
         * Observable true when the collection has been loaded
         * @type {?}
         */
        EntitySelectors$.prototype.loaded$;
        /**
         * Observable true when a multi-entity query command is in progress.
         * @type {?}
         */
        EntitySelectors$.prototype.loading$;
        /**
         * ChangeState (including original values) of entities with unsaved changes
         * @type {?}
         */
        EntitySelectors$.prototype.changeState$;
        /* Skipping unhandled member: readonly [name: string]: Observable<any> | Store<any> | any;*/
    }
    /**
     * Creates observable EntitySelectors$ for entity collections.
     */
    var EntitySelectors$Factory = /** @class */ (function () {
        /**
         * @param {?} store
         * @param {?} actions
         * @param {?} selectEntityCache
         */
        function EntitySelectors$Factory(store, actions, selectEntityCache) {
            this.store = store;
            this.actions = actions;
            this.selectEntityCache = selectEntityCache;
            // This service applies to the cache in ngrx/store named `cacheName`
            this.entityCache$ = this.store.select(this.selectEntityCache);
            this.entityActionErrors$ = actions.pipe(operators.filter(( /**
             * @param {?} ea
             * @return {?}
             */function (ea) { return ea.payload &&
                ea.payload.entityOp &&
                ea.payload.entityOp.endsWith(OP_ERROR); })), operators.shareReplay(1));
        }
        /**
         * Creates an entity collection's selectors$ observables for this factory's store.
         * `selectors$` are observable selectors of the cached entity collection.
         * @template T, S$
         * @param {?} entityName - is also the name of the collection.
         * @param {?} selectors - selector functions for this collection.
         *
         * @return {?}
         */
        EntitySelectors$Factory.prototype.create = function (entityName, selectors) {
            var _this = this;
            /** @type {?} */
            var selectors$ = {
                entityName: entityName,
            };
            Object.keys(selectors).forEach(( /**
             * @param {?} name
             * @return {?}
             */function (name) {
                if (name.startsWith('select')) {
                    // strip 'select' prefix from the selector fn name and append `$`
                    // Ex: 'selectEntities' => 'entities$'
                    /** @type {?} */
                    var name$ = name[6].toLowerCase() + name.substr(7) + '$';
                    selectors$[name$] = _this.store.select((( /** @type {?} */(selectors)))[name]);
                }
            }));
            selectors$.entityActions$ = this.actions.pipe(ofEntityType(entityName));
            selectors$.errors$ = this.entityActionErrors$.pipe(ofEntityType(entityName));
            return ( /** @type {?} */(selectors$));
        };
        return EntitySelectors$Factory;
    }());
    EntitySelectors$Factory.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    EntitySelectors$Factory.ctorParameters = function () { return [
        { type: store.Store },
        { type: effects.Actions },
        { type: undefined, decorators: [{ type: core.Inject, args: [ENTITY_CACHE_SELECTOR_TOKEN,] }] }
    ]; };
    if (false) {
        /**
         * Observable of the EntityCache
         * @type {?}
         */
        EntitySelectors$Factory.prototype.entityCache$;
        /**
         * Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types
         * @type {?}
         */
        EntitySelectors$Factory.prototype.entityActionErrors$;
        /**
         * @type {?}
         * @private
         */
        EntitySelectors$Factory.prototype.store;
        /**
         * @type {?}
         * @private
         */
        EntitySelectors$Factory.prototype.actions;
        /**
         * @type {?}
         * @private
         */
        EntitySelectors$Factory.prototype.selectEntityCache;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/entity-services/entity-collection-service-elements-factory.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Core ingredients of an EntityCollectionService
     * @record
     * @template T, S$
     */
    function EntityCollectionServiceElements() { }
    if (false) {
        /** @type {?} */
        EntityCollectionServiceElements.prototype.dispatcher;
        /** @type {?} */
        EntityCollectionServiceElements.prototype.entityName;
        /** @type {?} */
        EntityCollectionServiceElements.prototype.selectors;
        /** @type {?} */
        EntityCollectionServiceElements.prototype.selectors$;
    }
    /**
     * Creates the core elements of the EntityCollectionService for an entity type.
     */
    var EntityCollectionServiceElementsFactory = /** @class */ (function () {
        /**
         * @param {?} entityDispatcherFactory
         * @param {?} entityDefinitionService
         * @param {?} entitySelectorsFactory
         * @param {?} entitySelectors$Factory
         */
        function EntityCollectionServiceElementsFactory(entityDispatcherFactory, entityDefinitionService, entitySelectorsFactory, entitySelectors$Factory) {
            this.entityDispatcherFactory = entityDispatcherFactory;
            this.entityDefinitionService = entityDefinitionService;
            this.entitySelectorsFactory = entitySelectorsFactory;
            this.entitySelectors$Factory = entitySelectors$Factory;
        }
        /**
         * Get the ingredients for making an EntityCollectionService for this entity type
         * @template T, S$
         * @param {?} entityName - name of the entity type
         * @return {?}
         */
        EntityCollectionServiceElementsFactory.prototype.create = function (entityName) {
            entityName = entityName.trim();
            /** @type {?} */
            var definition = this.entityDefinitionService.getDefinition(entityName);
            /** @type {?} */
            var dispatcher = this.entityDispatcherFactory.create(entityName, definition.selectId, definition.entityDispatcherOptions);
            /** @type {?} */
            var selectors = this.entitySelectorsFactory.create(definition.metadata);
            /** @type {?} */
            var selectors$ = this.entitySelectors$Factory.create(entityName, selectors);
            return {
                dispatcher: dispatcher,
                entityName: entityName,
                selectors: selectors,
                selectors$: selectors$,
            };
        };
        return EntityCollectionServiceElementsFactory;
    }());
    EntityCollectionServiceElementsFactory.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    EntityCollectionServiceElementsFactory.ctorParameters = function () { return [
        { type: EntityDispatcherFactory },
        { type: EntityDefinitionService },
        { type: EntitySelectorsFactory },
        { type: EntitySelectors$Factory }
    ]; };
    if (false) {
        /**
         * @type {?}
         * @private
         */
        EntityCollectionServiceElementsFactory.prototype.entityDispatcherFactory;
        /**
         * @type {?}
         * @private
         */
        EntityCollectionServiceElementsFactory.prototype.entityDefinitionService;
        /**
         * @type {?}
         * @private
         */
        EntityCollectionServiceElementsFactory.prototype.entitySelectorsFactory;
        /**
         * @type {?}
         * @private
         */
        EntityCollectionServiceElementsFactory.prototype.entitySelectors$Factory;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/entity-services/entity-collection-service-factory.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Creates EntityCollectionService instances for
     * a cached collection of T entities in the ngrx store.
     */
    var EntityCollectionServiceFactory = /** @class */ (function () {
        /**
         * @param {?} entityCollectionServiceElementsFactory
         */
        function EntityCollectionServiceFactory(entityCollectionServiceElementsFactory) {
            this.entityCollectionServiceElementsFactory = entityCollectionServiceElementsFactory;
        }
        /**
         * Create an EntityCollectionService for an entity type
         * @template T, S$
         * @param {?} entityName - name of the entity type
         * @return {?}
         */
        EntityCollectionServiceFactory.prototype.create = function (entityName) {
            return new EntityCollectionServiceBase(entityName, this.entityCollectionServiceElementsFactory);
        };
        return EntityCollectionServiceFactory;
    }());
    EntityCollectionServiceFactory.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    EntityCollectionServiceFactory.ctorParameters = function () { return [
        { type: EntityCollectionServiceElementsFactory }
    ]; };
    if (false) {
        /**
         * Creates the core elements of the EntityCollectionService for an entity type.
         * @type {?}
         */
        EntityCollectionServiceFactory.prototype.entityCollectionServiceElementsFactory;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/entity-services/entity-services-elements.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Core ingredients of an EntityServices class
     */
    var EntityServicesElements = /** @class */ (function () {
        /**
         * @param {?} entityCollectionServiceFactory
         * @param {?} entityDispatcherFactory
         * @param {?} entitySelectors$Factory
         * @param {?} store
         */
        function EntityServicesElements(entityCollectionServiceFactory, 
        /** Creates EntityDispatchers for entity collections */
        entityDispatcherFactory, 
        /** Creates observable EntitySelectors$ for entity collections. */
        entitySelectors$Factory, store) {
            this.entityCollectionServiceFactory = entityCollectionServiceFactory;
            this.store = store;
            this.entityActionErrors$ = entitySelectors$Factory.entityActionErrors$;
            this.entityCache$ = entitySelectors$Factory.entityCache$;
            this.reducedActions$ = entityDispatcherFactory.reducedActions$;
        }
        return EntityServicesElements;
    }());
    EntityServicesElements.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    EntityServicesElements.ctorParameters = function () { return [
        { type: EntityCollectionServiceFactory },
        { type: EntityDispatcherFactory },
        { type: EntitySelectors$Factory },
        { type: store.Store }
    ]; };
    if (false) {
        /**
         * Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types
         * @type {?}
         */
        EntityServicesElements.prototype.entityActionErrors$;
        /**
         * Observable of the entire entity cache
         * @type {?}
         */
        EntityServicesElements.prototype.entityCache$;
        /**
         * Actions scanned by the store after it processed them with reducers.
         * A replay observable of the most recent action reduced by the store.
         * @type {?}
         */
        EntityServicesElements.prototype.reducedActions$;
        /**
         * Creates EntityCollectionService instances for
         * a cached collection of T entities in the ngrx store.
         * @type {?}
         */
        EntityServicesElements.prototype.entityCollectionServiceFactory;
        /**
         * The ngrx store, scoped to the EntityCache
         * @type {?}
         */
        EntityServicesElements.prototype.store;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/entity-services/entity-services-base.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    // tslint:disable:member-ordering
    /**
     * Base/default class of a central registry of EntityCollectionServices for all entity types.
     * Create your own subclass to add app-specific members for an improved developer experience.
     *
     * \@example
     * export class EntityServices extends EntityServicesBase {
     *   constructor(entityServicesElements: EntityServicesElements) {
     *     super(entityServicesElements);
     *   }
     *   // Extend with well-known, app entity collection services
     *   // Convenience property to return a typed custom entity collection service
     *   get companyService() {
     *     return this.getEntityCollectionService<Model.Company>('Company') as CompanyService;
     *   }
     *   // Convenience dispatch methods
     *   clearCompany(companyId: string) {
     *     this.dispatch(new ClearCompanyAction(companyId));
     *   }
     * }
     */
    var EntityServicesBase = /** @class */ (function () {
        // Dear @ngrx/data developer: think hard before changing the constructor.
        // Doing so will break apps that derive from this base class,
        // and many apps will derive from this class.
        //
        // Do not give this constructor an implementation.
        // Doing so makes it hard to mock classes that derive from this class.
        // Use getter properties instead. For example, see entityCache$
        /**
         * @param {?} entityServicesElements
         */
        function EntityServicesBase(entityServicesElements) {
            this.entityServicesElements = entityServicesElements;
            /**
             * Registry of EntityCollectionService instances
             */
            this.EntityCollectionServices = {};
        }
        Object.defineProperty(EntityServicesBase.prototype, "entityActionErrors$", {
            // #region EntityServicesElement-based properties
            /**
             * Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types
             * @return {?}
             */
            get: function () {
                return this.entityServicesElements.entityActionErrors$;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EntityServicesBase.prototype, "entityCache$", {
            /**
             * Observable of the entire entity cache
             * @return {?}
             */
            get: function () {
                return this.entityServicesElements.entityCache$;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EntityServicesBase.prototype, "entityCollectionServiceFactory", {
            /**
             * Factory to create a default instance of an EntityCollectionService
             * @return {?}
             */
            get: function () {
                return this.entityServicesElements.entityCollectionServiceFactory;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EntityServicesBase.prototype, "reducedActions$", {
            /**
             * Actions scanned by the store after it processed them with reducers.
             * A replay observable of the most recent action reduced by the store.
             * @return {?}
             */
            get: function () {
                return this.entityServicesElements.reducedActions$;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EntityServicesBase.prototype, "store", {
            /**
             * The ngrx store, scoped to the EntityCache
             * @protected
             * @return {?}
             */
            get: function () {
                return this.entityServicesElements.store;
            },
            enumerable: false,
            configurable: true
        });
        // #endregion EntityServicesElement-based properties
        /**
         * Dispatch any action to the store
         * @param {?} action
         * @return {?}
         */
        EntityServicesBase.prototype.dispatch = function (action) {
            this.store.dispatch(action);
        };
        /**
         * Create a new default instance of an EntityCollectionService.
         * Prefer getEntityCollectionService() unless you really want a new default instance.
         * This one will NOT be registered with EntityServices!
         * @protected
         * @template T, S$
         * @param {?} entityName {string} Name of the entity type of the service
         * @return {?}
         */
        EntityServicesBase.prototype.createEntityCollectionService = function (entityName) {
            return this.entityCollectionServiceFactory.create(entityName);
        };
        /**
         * Get (or create) the singleton instance of an EntityCollectionService
         * @template T, S$
         * @param {?} entityName {string} Name of the entity type of the service
         * @return {?}
         */
        EntityServicesBase.prototype.getEntityCollectionService = function (entityName) {
            /** @type {?} */
            var service = this.EntityCollectionServices[entityName];
            if (!service) {
                service = this.createEntityCollectionService(entityName);
                this.EntityCollectionServices[entityName] = service;
            }
            return service;
        };
        /**
         * Register an EntityCollectionService under its entity type name.
         * Will replace a pre-existing service for that type.
         * @template T
         * @param {?} service {EntityCollectionService} The entity service
         * @param {?=} serviceName {string} optional service name to use instead of the service's entityName
         * @return {?}
         */
        EntityServicesBase.prototype.registerEntityCollectionService = function (service, serviceName) {
            this.EntityCollectionServices[serviceName || service.entityName] = service;
        };
        /**
         * Register entity services for several entity types at once.
         * Will replace a pre-existing service for that type.
         * @param {?} entityCollectionServices {EntityCollectionServiceMap | EntityCollectionService<any>[]}
         * EntityCollectionServices to register, either as a map or an array
         * @return {?}
         */
        EntityServicesBase.prototype.registerEntityCollectionServices = function (entityCollectionServices) {
            var _this = this;
            if (Array.isArray(entityCollectionServices)) {
                entityCollectionServices.forEach(( /**
                 * @param {?} service
                 * @return {?}
                 */function (service) { return _this.registerEntityCollectionService(service); }));
            }
            else {
                Object.keys(entityCollectionServices || {}).forEach(( /**
                 * @param {?} serviceName
                 * @return {?}
                 */function (serviceName) {
                    _this.registerEntityCollectionService(entityCollectionServices[serviceName], serviceName);
                }));
            }
        };
        return EntityServicesBase;
    }());
    EntityServicesBase.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    EntityServicesBase.ctorParameters = function () { return [
        { type: EntityServicesElements }
    ]; };
    if (false) {
        /**
         * Registry of EntityCollectionService instances
         * @type {?}
         * @private
         */
        EntityServicesBase.prototype.EntityCollectionServices;
        /**
         * @type {?}
         * @private
         */
        EntityServicesBase.prototype.entityServicesElements;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/entity-services/entity-services.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    // tslint:disable:member-ordering
    /**
     * Class-Interface for EntityCache and EntityCollection services.
     * Serves as an Angular provider token for this service class.
     * Includes a registry of EntityCollectionServices for all entity types.
     * Creates a new default EntityCollectionService for any entity type not in the registry.
     * Optionally register specialized EntityCollectionServices for individual types
     * @abstract
     */
    var EntityServices = /** @class */ (function () {
        function EntityServices() {
        }
        return EntityServices;
    }());
    if (false) {
        /**
         * Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types
         * @type {?}
         */
        EntityServices.prototype.entityActionErrors$;
        /**
         * Observable of the entire entity cache
         * @type {?}
         */
        EntityServices.prototype.entityCache$;
        /**
         * Actions scanned by the store after it processed them with reducers.
         * A replay observable of the most recent Action (not just EntityAction) reduced by the store.
         * @type {?}
         */
        EntityServices.prototype.reducedActions$;
        /**
         * Dispatch any action to the store
         * @abstract
         * @param {?} action
         * @return {?}
         */
        EntityServices.prototype.dispatch = function (action) { };
        /**
         * Get (or create) the singleton instance of an EntityCollectionService
         * @abstract
         * @template T
         * @param {?} entityName {string} Name of the entity type of the service
         * @return {?}
         */
        EntityServices.prototype.getEntityCollectionService = function (entityName) { };
        /**
         * Register an EntityCollectionService under its entity type name.
         * Will replace a pre-existing service for that type.
         * @abstract
         * @template T
         * @param {?} service {EntityCollectionService} The entity service
         * @return {?}
         */
        EntityServices.prototype.registerEntityCollectionService = function (service) { };
        /**
         * Register entity services for several entity types at once.
         * Will replace a pre-existing service for that type.
         * @abstract
         * @param {?} entityCollectionServices Array of EntityCollectionServices to register
         * @return {?}
         */
        EntityServices.prototype.registerEntityCollectionServices = function (entityCollectionServices) { };
        /**
         * Register entity services for several entity types at once.
         * Will replace a pre-existing service for that type.
         * @abstract
         * @param {?} entityCollectionServiceMap Map of service-name to entity-collection-service
         * @return {?}
         */
        EntityServices.prototype.registerEntityCollectionServices = function (entityCollectionServiceMap) { };
    }
    /**
     * A map of service or entity names to their corresponding EntityCollectionServices.
     * @record
     */
    function EntityCollectionServiceMap() { }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/reducers/entity-collection.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @enum {number} */
    var ChangeType = {
        /** The entity has not changed from its last known server state. */
        Unchanged: 0,
        /** The entity was added to the collection */
        Added: 1,
        /** The entity is scheduled for delete and was removed from the collection */
        Deleted: 2,
        /** The entity in the collection was updated */
        Updated: 3,
    };
    ChangeType[ChangeType.Unchanged] = 'Unchanged';
    ChangeType[ChangeType.Added] = 'Added';
    ChangeType[ChangeType.Deleted] = 'Deleted';
    ChangeType[ChangeType.Updated] = 'Updated';
    /**
     * Change state for an entity with unsaved changes;
     * an entry in an EntityCollection.changeState map
     * @record
     * @template T
     */
    function ChangeState() { }
    if (false) {
        /** @type {?} */
        ChangeState.prototype.changeType;
        /** @type {?|undefined} */
        ChangeState.prototype.originalValue;
    }
    /**
     * Data and information about a collection of entities of a single type.
     * EntityCollections are maintained in the EntityCache within the ngrx store.
     * @record
     * @template T
     */
    function EntityCollection() { }
    if (false) {
        /**
         * Name of the entity type for this collection
         * @type {?}
         */
        EntityCollection.prototype.entityName;
        /**
         * A map of ChangeStates, keyed by id, for entities with unsaved changes
         * @type {?}
         */
        EntityCollection.prototype.changeState;
        /**
         * The user's current collection filter pattern
         * @type {?|undefined}
         */
        EntityCollection.prototype.filter;
        /**
         * true if collection was ever filled by QueryAll; forced false if cleared
         * @type {?}
         */
        EntityCollection.prototype.loaded;
        /**
         * true when a query or save operation is in progress
         * @type {?}
         */
        EntityCollection.prototype.loading;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/reducers/entity-change-tracker-base.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * The default implementation of EntityChangeTracker with
     * methods for tracking, committing, and reverting/undoing unsaved entity changes.
     * Used by EntityCollectionReducerMethods which should call tracker methods BEFORE modifying the collection.
     * See EntityChangeTracker docs.
     * @template T
     */
    var EntityChangeTrackerBase = /** @class */ (function () {
        /**
         * @param {?} adapter
         * @param {?} selectId
         */
        function EntityChangeTrackerBase(adapter, selectId) {
            this.adapter = adapter;
            this.selectId = selectId;
            /** Extract the primary key (id); default to `id` */
            this.selectId = selectId || defaultSelectId;
        }
        // #region commit methods
        /**
         * Commit all changes as when the collection has been completely reloaded from the server.
         * Harmless when there are no entity changes to commit.
         * @param {?} collection The entity collection
         * @return {?}
         */
        EntityChangeTrackerBase.prototype.commitAll = function (collection) {
            return Object.keys(collection.changeState).length === 0
                ? collection
                : Object.assign(Object.assign({}, collection), { changeState: {} });
        };
        /**
         * Commit changes for the given entities as when they have been refreshed from the server.
         * Harmless when there are no entity changes to commit.
         * @param {?} entityOrIdList The entities to clear tracking or their ids.
         * @param {?} collection The entity collection
         * @return {?}
         */
        EntityChangeTrackerBase.prototype.commitMany = function (entityOrIdList, collection) {
            var _this = this;
            if (entityOrIdList == null || entityOrIdList.length === 0) {
                return collection; // nothing to commit
            }
            /** @type {?} */
            var didMutate = false;
            /** @type {?} */
            var changeState = entityOrIdList.reduce(( /**
             * @param {?} chgState
             * @param {?} entityOrId
             * @return {?}
             */function (chgState, entityOrId) {
                /** @type {?} */
                var id = typeof entityOrId === 'object'
                    ? _this.selectId(entityOrId)
                    : (( /** @type {?} */(entityOrId)));
                if (chgState[id]) {
                    if (!didMutate) {
                        chgState = Object.assign({}, chgState);
                        didMutate = true;
                    }
                    delete chgState[id];
                }
                return chgState;
            }), collection.changeState);
            return didMutate ? Object.assign(Object.assign({}, collection), { changeState: changeState }) : collection;
        };
        /**
         * Commit changes for the given entity as when it have been refreshed from the server.
         * Harmless when no entity changes to commit.
         * @param {?} entityOrId The entity to clear tracking or its id.
         * @param {?} collection The entity collection
         * @return {?}
         */
        EntityChangeTrackerBase.prototype.commitOne = function (entityOrId, collection) {
            return entityOrId == null
                ? collection
                : this.commitMany([entityOrId], collection);
        };
        // #endregion commit methods
        // #region merge query
        /**
         * Merge query results into the collection, adjusting the ChangeState per the mergeStrategy.
         * @param {?} entities Entities returned from querying the server.
         * @param {?} collection The entity collection
         * @param {?=} mergeStrategy
         * @return {?} The merged EntityCollection.
         */
        EntityChangeTrackerBase.prototype.mergeQueryResults = function (entities, collection, mergeStrategy) {
            return this.mergeServerUpserts(entities, collection, MergeStrategy.PreserveChanges, mergeStrategy);
        };
        // #endregion merge query results
        // #region merge save results
        /**
         * Merge result of saving new entities into the collection, adjusting the ChangeState per the mergeStrategy.
         * The default is MergeStrategy.OverwriteChanges.
         * @param {?} entities Entities returned from saving new entities to the server.
         * @param {?} collection The entity collection
         * @param {?=} mergeStrategy
         * @return {?} The merged EntityCollection.
         */
        EntityChangeTrackerBase.prototype.mergeSaveAdds = function (entities, collection, mergeStrategy) {
            return this.mergeServerUpserts(entities, collection, MergeStrategy.OverwriteChanges, mergeStrategy);
        };
        /**
         * Merge successful result of deleting entities on the server that have the given primary keys
         * Clears the entity changeState for those keys unless the MergeStrategy is ignoreChanges.
         * @param {?} keys
         * @param {?} collection The entity collection
         * @param {?=} mergeStrategy
         * @return {?} The merged EntityCollection.
         */
        EntityChangeTrackerBase.prototype.mergeSaveDeletes = function (keys, collection, mergeStrategy) {
            mergeStrategy =
                mergeStrategy == null ? MergeStrategy.OverwriteChanges : mergeStrategy;
            // same logic for all non-ignore merge strategies: always clear (commit) the changes
            /** @type {?} */
            var deleteIds = ( /** @type {?} */(keys));
            collection =
                mergeStrategy === MergeStrategy.IgnoreChanges
                    ? collection
                    : this.commitMany(deleteIds, collection);
            return this.adapter.removeMany(deleteIds, collection);
        };
        /**
         * Merge result of saving updated entities into the collection, adjusting the ChangeState per the mergeStrategy.
         * The default is MergeStrategy.OverwriteChanges.
         * @param {?} updateResponseData Entity response data returned from saving updated entities to the server.
         * @param {?} collection The entity collection
         * @param {?=} mergeStrategy
         * @param {?=} skipUnchanged
         * @return {?} The merged EntityCollection.
         */
        EntityChangeTrackerBase.prototype.mergeSaveUpdates = function (updateResponseData, collection, mergeStrategy, skipUnchanged) {
            var _this = this;
            if (skipUnchanged === void 0) { skipUnchanged = false; }
            if (updateResponseData == null || updateResponseData.length === 0) {
                return collection; // nothing to merge.
            }
            /** @type {?} */
            var didMutate = false;
            /** @type {?} */
            var changeState = collection.changeState;
            mergeStrategy =
                mergeStrategy == null ? MergeStrategy.OverwriteChanges : mergeStrategy;
            /** @type {?} */
            var updates;
            switch (mergeStrategy) {
                case MergeStrategy.IgnoreChanges:
                    updates = filterChanged(updateResponseData);
                    return this.adapter.updateMany(updates, collection);
                case MergeStrategy.OverwriteChanges:
                    changeState = updateResponseData.reduce(( /**
                     * @param {?} chgState
                     * @param {?} update
                     * @return {?}
                     */function (chgState, update) {
                        /** @type {?} */
                        var oldId = update.id;
                        /** @type {?} */
                        var change = chgState[oldId];
                        if (change) {
                            if (!didMutate) {
                                chgState = Object.assign({}, chgState);
                                didMutate = true;
                            }
                            delete chgState[oldId];
                        }
                        return chgState;
                    }), collection.changeState);
                    collection = didMutate ? Object.assign(Object.assign({}, collection), { changeState: changeState }) : collection;
                    updates = filterChanged(updateResponseData);
                    return this.adapter.updateMany(updates, collection);
                case MergeStrategy.PreserveChanges: {
                    /** @type {?} */
                    var updateableEntities_1 = ( /** @type {?} */([]));
                    changeState = updateResponseData.reduce(( /**
                     * @param {?} chgState
                     * @param {?} update
                     * @return {?}
                     */function (chgState, update) {
                        /** @type {?} */
                        var oldId = update.id;
                        /** @type {?} */
                        var change = chgState[oldId];
                        if (change) {
                            // Tracking a change so update original value but not the current value
                            if (!didMutate) {
                                chgState = Object.assign({}, chgState);
                                didMutate = true;
                            }
                            /** @type {?} */
                            var newId = _this.selectId(( /** @type {?} */(update.changes)));
                            /** @type {?} */
                            var oldChangeState = change;
                            // If the server changed the id, register the new "originalValue" under the new id
                            // and remove the change tracked under the old id.
                            if (newId !== oldId) {
                                delete chgState[oldId];
                            }
                            /** @type {?} */
                            var newOrigValue = Object.assign(Object.assign({}, (( /** @type {?} */(( /** @type {?} */(oldChangeState)).originalValue)))), (( /** @type {?} */(update.changes))));
                            (( /** @type {?} */(chgState)))[newId] = Object.assign(Object.assign({}, oldChangeState), { originalValue: newOrigValue });
                        }
                        else {
                            updateableEntities_1.push(update);
                        }
                        return chgState;
                    }), collection.changeState);
                    collection = didMutate ? Object.assign(Object.assign({}, collection), { changeState: changeState }) : collection;
                    updates = filterChanged(updateableEntities_1);
                    return this.adapter.updateMany(updates, collection);
                }
            }
            /**
             * Conditionally keep only those updates that have additional server changes.
             * (e.g., for optimistic saves because they updates are already in the current collection)
             * Strip off the `changed` property.
             * \@responseData Entity response data from server.
             * May be an UpdateResponseData<T>, a subclass of Update<T> with a 'changed' flag.
             * @param {?} responseData
             * @return {?} Update<T> (without the changed flag)
             */
            function filterChanged(responseData) {
                if (skipUnchanged === true) {
                    // keep only those updates that the server changed (knowable if is UpdateResponseData<T>)
                    responseData = responseData.filter(( /**
                     * @param {?} r
                     * @return {?}
                     */function (r) { return r.changed === true; }));
                }
                // Strip unchanged property from responseData, leaving just the pure Update<T>
                // TODO: Remove? probably not necessary as the Update isn't stored and adapter will ignore `changed`.
                return responseData.map(( /**
                 * @param {?} r
                 * @return {?}
                 */function (r) { return ({ id: ( /** @type {?} */(r.id)), changes: r.changes }); }));
            }
        };
        /**
         * Merge result of saving upserted entities into the collection, adjusting the ChangeState per the mergeStrategy.
         * The default is MergeStrategy.OverwriteChanges.
         * @param {?} entities Entities returned from saving upserts to the server.
         * @param {?} collection The entity collection
         * @param {?=} mergeStrategy
         * @return {?} The merged EntityCollection.
         */
        EntityChangeTrackerBase.prototype.mergeSaveUpserts = function (entities, collection, mergeStrategy) {
            return this.mergeServerUpserts(entities, collection, MergeStrategy.OverwriteChanges, mergeStrategy);
        };
        // #endregion merge save results
        // #region query & save helpers
        /**
         *
         * @private
         * @param {?} entities Entities to merge
         * @param {?} collection Collection into which entities are merged
         * @param {?} defaultMergeStrategy How to merge when action's MergeStrategy is unspecified
         * @param {?=} mergeStrategy
         * @return {?}
         */
        EntityChangeTrackerBase.prototype.mergeServerUpserts = function (entities, collection, defaultMergeStrategy, mergeStrategy) {
            var _this = this;
            if (entities == null || entities.length === 0) {
                return collection; // nothing to merge.
            }
            /** @type {?} */
            var didMutate = false;
            /** @type {?} */
            var changeState = collection.changeState;
            mergeStrategy =
                mergeStrategy == null ? defaultMergeStrategy : mergeStrategy;
            switch (mergeStrategy) {
                case MergeStrategy.IgnoreChanges:
                    return this.adapter.upsertMany(entities, collection);
                case MergeStrategy.OverwriteChanges:
                    collection = this.adapter.upsertMany(entities, collection);
                    changeState = entities.reduce(( /**
                     * @param {?} chgState
                     * @param {?} entity
                     * @return {?}
                     */function (chgState, entity) {
                        /** @type {?} */
                        var id = _this.selectId(entity);
                        /** @type {?} */
                        var change = chgState[id];
                        if (change) {
                            if (!didMutate) {
                                chgState = Object.assign({}, chgState);
                                didMutate = true;
                            }
                            delete chgState[id];
                        }
                        return chgState;
                    }), collection.changeState);
                    return didMutate ? Object.assign(Object.assign({}, collection), { changeState: changeState }) : collection;
                case MergeStrategy.PreserveChanges: {
                    /** @type {?} */
                    var upsertEntities_1 = ( /** @type {?} */([]));
                    changeState = entities.reduce(( /**
                     * @param {?} chgState
                     * @param {?} entity
                     * @return {?}
                     */function (chgState, entity) {
                        var _a;
                        /** @type {?} */
                        var id = _this.selectId(entity);
                        /** @type {?} */
                        var change = chgState[id];
                        if (change) {
                            if (!didMutate) {
                                chgState = Object.assign(Object.assign({}, chgState), (_a = {}, _a[id] = Object.assign(Object.assign({}, ( /** @type {?} */(chgState[id]))), { originalValue: entity }), _a));
                                didMutate = true;
                            }
                        }
                        else {
                            upsertEntities_1.push(entity);
                        }
                        return chgState;
                    }), collection.changeState);
                    collection = this.adapter.upsertMany(upsertEntities_1, collection);
                    return didMutate ? Object.assign(Object.assign({}, collection), { changeState: changeState }) : collection;
                }
            }
        };
        // #endregion query & save helpers
        // #region track methods
        /**
         * Track multiple entities before adding them to the collection.
         * Does NOT add to the collection (the reducer's job).
         * @param {?} entities The entities to add. They must all have their ids.
         * @param {?} collection The entity collection
         * @param {?=} mergeStrategy
         * @return {?}
         */
        EntityChangeTrackerBase.prototype.trackAddMany = function (entities, collection, mergeStrategy) {
            var _this = this;
            if (mergeStrategy === MergeStrategy.IgnoreChanges ||
                entities == null ||
                entities.length === 0) {
                return collection; // nothing to track
            }
            /** @type {?} */
            var didMutate = false;
            /** @type {?} */
            var changeState = entities.reduce(( /**
             * @param {?} chgState
             * @param {?} entity
             * @return {?}
             */function (chgState, entity) {
                /** @type {?} */
                var id = _this.selectId(entity);
                if (id == null || id === '') {
                    throw new Error(collection.entityName + " entity add requires a key to be tracked");
                }
                /** @type {?} */
                var trackedChange = chgState[id];
                if (!trackedChange) {
                    if (!didMutate) {
                        didMutate = true;
                        chgState = Object.assign({}, chgState);
                    }
                    chgState[id] = { changeType: ChangeType.Added };
                }
                return chgState;
            }), collection.changeState);
            return didMutate ? Object.assign(Object.assign({}, collection), { changeState: changeState }) : collection;
        };
        /**
         * Track an entity before adding it to the collection.
         * Does NOT add to the collection (the reducer's job).
         * @param {?} entity The entity to add. It must have an id.
         * @param {?} collection The entity collection
         * @param {?=} mergeStrategy
         * @return {?}
         */
        EntityChangeTrackerBase.prototype.trackAddOne = function (entity, collection, mergeStrategy) {
            return entity == null
                ? collection
                : this.trackAddMany([entity], collection, mergeStrategy);
        };
        /**
         * Track multiple entities before removing them with the intention of deleting them on the server.
         * Does NOT remove from the collection (the reducer's job).
         * @param {?} keys The primary keys of the entities to delete.
         * @param {?} collection The entity collection
         * @param {?=} mergeStrategy
         * @return {?}
         */
        EntityChangeTrackerBase.prototype.trackDeleteMany = function (keys, collection, mergeStrategy) {
            if (mergeStrategy === MergeStrategy.IgnoreChanges ||
                keys == null ||
                keys.length === 0) {
                return collection; // nothing to track
            }
            /** @type {?} */
            var didMutate = false;
            /** @type {?} */
            var entityMap = collection.entities;
            /** @type {?} */
            var changeState = keys.reduce(( /**
             * @param {?} chgState
             * @param {?} id
             * @return {?}
             */function (chgState, id) {
                /** @type {?} */
                var originalValue = entityMap[id];
                if (originalValue) {
                    /** @type {?} */
                    var trackedChange = chgState[id];
                    if (trackedChange) {
                        if (trackedChange.changeType === ChangeType.Added) {
                            // Special case: stop tracking an added entity that you delete
                            // The caller must also detect this, remove it immediately from the collection
                            // and skip attempt to delete on the server.
                            cloneChgStateOnce();
                            delete chgState[id];
                        }
                        else if (trackedChange.changeType === ChangeType.Updated) {
                            // Special case: switch change type from Updated to Deleted.
                            cloneChgStateOnce();
                            trackedChange.changeType = ChangeType.Deleted;
                        }
                    }
                    else {
                        // Start tracking this entity
                        cloneChgStateOnce();
                        chgState[id] = { changeType: ChangeType.Deleted, originalValue: originalValue };
                    }
                }
                return chgState;
                /**
                 * @return {?}
                 */
                function cloneChgStateOnce() {
                    if (!didMutate) {
                        didMutate = true;
                        chgState = Object.assign({}, chgState);
                    }
                }
            }), collection.changeState);
            return didMutate ? Object.assign(Object.assign({}, collection), { changeState: changeState }) : collection;
        };
        /**
         * Track an entity before it is removed with the intention of deleting it on the server.
         * Does NOT remove from the collection (the reducer's job).
         * @param {?} key The primary key of the entity to delete.
         * @param {?} collection The entity collection
         * @param {?=} mergeStrategy
         * @return {?}
         */
        EntityChangeTrackerBase.prototype.trackDeleteOne = function (key, collection, mergeStrategy) {
            return key == null
                ? collection
                : this.trackDeleteMany([key], collection, mergeStrategy);
        };
        /**
         * Track multiple entities before updating them in the collection.
         * Does NOT update the collection (the reducer's job).
         * @param {?} updates The entities to update.
         * @param {?} collection The entity collection
         * @param {?=} mergeStrategy
         * @return {?}
         */
        EntityChangeTrackerBase.prototype.trackUpdateMany = function (updates, collection, mergeStrategy) {
            if (mergeStrategy === MergeStrategy.IgnoreChanges ||
                updates == null ||
                updates.length === 0) {
                return collection; // nothing to track
            }
            /** @type {?} */
            var didMutate = false;
            /** @type {?} */
            var entityMap = collection.entities;
            /** @type {?} */
            var changeState = updates.reduce(( /**
             * @param {?} chgState
             * @param {?} update
             * @return {?}
             */function (chgState, update) {
                var id = update.id, entity = update.changes;
                if (id == null || id === '') {
                    throw new Error(collection.entityName + " entity update requires a key to be tracked");
                }
                /** @type {?} */
                var originalValue = entityMap[id];
                // Only track if it is in the collection. Silently ignore if it is not.
                // @ngrx/entity adapter would also silently ignore.
                // Todo: should missing update entity really be reported as an error?
                if (originalValue) {
                    /** @type {?} */
                    var trackedChange = chgState[id];
                    if (!trackedChange) {
                        if (!didMutate) {
                            didMutate = true;
                            chgState = Object.assign({}, chgState);
                        }
                        chgState[id] = { changeType: ChangeType.Updated, originalValue: originalValue };
                    }
                }
                return chgState;
            }), collection.changeState);
            return didMutate ? Object.assign(Object.assign({}, collection), { changeState: changeState }) : collection;
        };
        /**
         * Track an entity before updating it in the collection.
         * Does NOT update the collection (the reducer's job).
         * @param {?} update The entity to update.
         * @param {?} collection The entity collection
         * @param {?=} mergeStrategy
         * @return {?}
         */
        EntityChangeTrackerBase.prototype.trackUpdateOne = function (update, collection, mergeStrategy) {
            return update == null
                ? collection
                : this.trackUpdateMany([update], collection, mergeStrategy);
        };
        /**
         * Track multiple entities before upserting (adding and updating) them to the collection.
         * Does NOT update the collection (the reducer's job).
         * @param {?} entities The entities to add or update. They must be complete entities with ids.
         * @param {?} collection The entity collection
         * @param {?=} mergeStrategy
         * @return {?}
         */
        EntityChangeTrackerBase.prototype.trackUpsertMany = function (entities, collection, mergeStrategy) {
            var _this = this;
            if (mergeStrategy === MergeStrategy.IgnoreChanges ||
                entities == null ||
                entities.length === 0) {
                return collection; // nothing to track
            }
            /** @type {?} */
            var didMutate = false;
            /** @type {?} */
            var entityMap = collection.entities;
            /** @type {?} */
            var changeState = entities.reduce(( /**
             * @param {?} chgState
             * @param {?} entity
             * @return {?}
             */function (chgState, entity) {
                /** @type {?} */
                var id = _this.selectId(entity);
                if (id == null || id === '') {
                    throw new Error(collection.entityName + " entity upsert requires a key to be tracked");
                }
                /** @type {?} */
                var trackedChange = chgState[id];
                if (!trackedChange) {
                    if (!didMutate) {
                        didMutate = true;
                        chgState = Object.assign({}, chgState);
                    }
                    /** @type {?} */
                    var originalValue = entityMap[id];
                    chgState[id] =
                        originalValue == null
                            ? { changeType: ChangeType.Added }
                            : { changeType: ChangeType.Updated, originalValue: originalValue };
                }
                return chgState;
            }), collection.changeState);
            return didMutate ? Object.assign(Object.assign({}, collection), { changeState: changeState }) : collection;
        };
        /**
         * Track an entity before upsert (adding and updating) it to the collection.
         * Does NOT update the collection (the reducer's job).
         * @param {?} entity
         * @param {?} collection The entity collection
         * @param {?=} mergeStrategy
         * @return {?}
         */
        EntityChangeTrackerBase.prototype.trackUpsertOne = function (entity, collection, mergeStrategy) {
            return entity == null
                ? collection
                : this.trackUpsertMany([entity], collection, mergeStrategy);
        };
        // #endregion track methods
        // #region undo methods
        /**
         * Revert the unsaved changes for all collection.
         * Harmless when there are no entity changes to undo.
         * @param {?} collection The entity collection
         * @return {?}
         */
        EntityChangeTrackerBase.prototype.undoAll = function (collection) {
            /** @type {?} */
            var ids = Object.keys(collection.changeState);
            var _a = ids.reduce(( /**
             * @param {?} acc
             * @param {?} id
             * @return {?}
             */function (acc, id) {
                /** @type {?} */
                var changeState = ( /** @type {?} */(acc.chgState[id]));
                switch (changeState.changeType) {
                    case ChangeType.Added:
                        acc.remove.push(id);
                        break;
                    case ChangeType.Deleted:
                        /** @type {?} */
                        var removed = ( /** @type {?} */(changeState)).originalValue;
                        if (removed) {
                            acc.upsert.push(removed);
                        }
                        break;
                    case ChangeType.Updated:
                        acc.upsert.push(( /** @type {?} */(( /** @type {?} */(changeState)).originalValue)));
                        break;
                }
                return acc;
            }), 
            // entitiesToUndo
            {
                remove: ( /** @type {?} */([])),
                upsert: ( /** @type {?} */([])),
                chgState: collection.changeState,
            }), remove = _a.remove, upsert = _a.upsert;
            collection = this.adapter.removeMany(( /** @type {?} */(remove)), collection);
            collection = this.adapter.upsertMany(upsert, collection);
            return Object.assign(Object.assign({}, collection), { changeState: {} });
        };
        /**
         * Revert the unsaved changes for the given entities.
         * Harmless when there are no entity changes to undo.
         * @param {?} entityOrIdList The entities to revert or their ids.
         * @param {?} collection The entity collection
         * @return {?}
         */
        EntityChangeTrackerBase.prototype.undoMany = function (entityOrIdList, collection) {
            var _this = this;
            if (entityOrIdList == null || entityOrIdList.length === 0) {
                return collection; // nothing to undo
            }
            /** @type {?} */
            var didMutate = false;
            var _a = entityOrIdList.reduce(( /**
             * @param {?} acc
             * @param {?} entityOrId
             * @return {?}
             */function (acc, entityOrId) {
                /** @type {?} */
                var chgState = acc.changeState;
                /** @type {?} */
                var id = typeof entityOrId === 'object'
                    ? _this.selectId(entityOrId)
                    : (( /** @type {?} */(entityOrId)));
                /** @type {?} */
                var change = ( /** @type {?} */(chgState[id]));
                if (change) {
                    if (!didMutate) {
                        chgState = Object.assign({}, chgState);
                        didMutate = true;
                    }
                    delete chgState[id]; // clear tracking of this entity
                    acc.changeState = chgState;
                    switch (change.changeType) {
                        case ChangeType.Added:
                            acc.remove.push(id);
                            break;
                        case ChangeType.Deleted:
                            /** @type {?} */
                            var removed = ( /** @type {?} */(change)).originalValue;
                            if (removed) {
                                acc.upsert.push(removed);
                            }
                            break;
                        case ChangeType.Updated:
                            acc.upsert.push(( /** @type {?} */(( /** @type {?} */(change)).originalValue)));
                            break;
                    }
                }
                return acc;
            }), 
            // entitiesToUndo
            {
                remove: ( /** @type {?} */([])),
                upsert: ( /** @type {?} */([])),
                changeState: collection.changeState,
            }), changeState = _a.changeState, remove = _a.remove, upsert = _a.upsert;
            collection = this.adapter.removeMany(( /** @type {?} */(remove)), collection);
            collection = this.adapter.upsertMany(upsert, collection);
            return didMutate ? Object.assign(Object.assign({}, collection), { changeState: changeState }) : collection;
        };
        /**
         * Revert the unsaved changes for the given entity.
         * Harmless when there are no entity changes to undo.
         * @param {?} entityOrId The entity to revert or its id.
         * @param {?} collection The entity collection
         * @return {?}
         */
        EntityChangeTrackerBase.prototype.undoOne = function (entityOrId, collection) {
            return entityOrId == null
                ? collection
                : this.undoMany([entityOrId], collection);
        };
        return EntityChangeTrackerBase;
    }());
    if (false) {
        /**
         * @type {?}
         * @private
         */
        EntityChangeTrackerBase.prototype.adapter;
        /**
         * @type {?}
         * @private
         */
        EntityChangeTrackerBase.prototype.selectId;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/reducers/entity-collection-reducer-methods.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Map of {EntityOp} to reducer method for the operation.
     * If an operation is missing, caller should return the collection for that reducer.
     * @record
     * @template T
     */
    function EntityCollectionReducerMethodMap() { }
    /**
     * Base implementation of reducer methods for an entity collection.
     * @template T
     */
    var EntityCollectionReducerMethods = /** @class */ (function () {
        /**
         * @param {?} entityName
         * @param {?} definition
         * @param {?=} entityChangeTracker
         */
        function EntityCollectionReducerMethods(entityName, definition, 
        /*
         * Track changes to entities since the last query or save
         * Can revert some or all of those changes
         */
        entityChangeTracker) {
            var _a;
            this.entityName = entityName;
            this.definition = definition;
            /**
             * Dictionary of the {EntityCollectionReducerMethods} for this entity type,
             * keyed by the {EntityOp}
             */
            this.methods = (_a = {},
                _a[EntityOp.CANCEL_PERSIST] = this.cancelPersist.bind(this),
                _a[EntityOp.QUERY_ALL] = this.queryAll.bind(this),
                _a[EntityOp.QUERY_ALL_ERROR] = this.queryAllError.bind(this),
                _a[EntityOp.QUERY_ALL_SUCCESS] = this.queryAllSuccess.bind(this),
                _a[EntityOp.QUERY_BY_KEY] = this.queryByKey.bind(this),
                _a[EntityOp.QUERY_BY_KEY_ERROR] = this.queryByKeyError.bind(this),
                _a[EntityOp.QUERY_BY_KEY_SUCCESS] = this.queryByKeySuccess.bind(this),
                _a[EntityOp.QUERY_LOAD] = this.queryLoad.bind(this),
                _a[EntityOp.QUERY_LOAD_ERROR] = this.queryLoadError.bind(this),
                _a[EntityOp.QUERY_LOAD_SUCCESS] = this.queryLoadSuccess.bind(this),
                _a[EntityOp.QUERY_MANY] = this.queryMany.bind(this),
                _a[EntityOp.QUERY_MANY_ERROR] = this.queryManyError.bind(this),
                _a[EntityOp.QUERY_MANY_SUCCESS] = this.queryManySuccess.bind(this),
                _a[EntityOp.SAVE_ADD_MANY] = this.saveAddMany.bind(this),
                _a[EntityOp.SAVE_ADD_MANY_ERROR] = this.saveAddManyError.bind(this),
                _a[EntityOp.SAVE_ADD_MANY_SUCCESS] = this.saveAddManySuccess.bind(this),
                _a[EntityOp.SAVE_ADD_ONE] = this.saveAddOne.bind(this),
                _a[EntityOp.SAVE_ADD_ONE_ERROR] = this.saveAddOneError.bind(this),
                _a[EntityOp.SAVE_ADD_ONE_SUCCESS] = this.saveAddOneSuccess.bind(this),
                _a[EntityOp.SAVE_DELETE_MANY] = this.saveDeleteMany.bind(this),
                _a[EntityOp.SAVE_DELETE_MANY_ERROR] = this.saveDeleteManyError.bind(this),
                _a[EntityOp.SAVE_DELETE_MANY_SUCCESS] = this.saveDeleteManySuccess.bind(this),
                _a[EntityOp.SAVE_DELETE_ONE] = this.saveDeleteOne.bind(this),
                _a[EntityOp.SAVE_DELETE_ONE_ERROR] = this.saveDeleteOneError.bind(this),
                _a[EntityOp.SAVE_DELETE_ONE_SUCCESS] = this.saveDeleteOneSuccess.bind(this),
                _a[EntityOp.SAVE_UPDATE_MANY] = this.saveUpdateMany.bind(this),
                _a[EntityOp.SAVE_UPDATE_MANY_ERROR] = this.saveUpdateManyError.bind(this),
                _a[EntityOp.SAVE_UPDATE_MANY_SUCCESS] = this.saveUpdateManySuccess.bind(this),
                _a[EntityOp.SAVE_UPDATE_ONE] = this.saveUpdateOne.bind(this),
                _a[EntityOp.SAVE_UPDATE_ONE_ERROR] = this.saveUpdateOneError.bind(this),
                _a[EntityOp.SAVE_UPDATE_ONE_SUCCESS] = this.saveUpdateOneSuccess.bind(this),
                _a[EntityOp.SAVE_UPSERT_MANY] = this.saveUpsertMany.bind(this),
                _a[EntityOp.SAVE_UPSERT_MANY_ERROR] = this.saveUpsertManyError.bind(this),
                _a[EntityOp.SAVE_UPSERT_MANY_SUCCESS] = this.saveUpsertManySuccess.bind(this),
                _a[EntityOp.SAVE_UPSERT_ONE] = this.saveUpsertOne.bind(this),
                _a[EntityOp.SAVE_UPSERT_ONE_ERROR] = this.saveUpsertOneError.bind(this),
                _a[EntityOp.SAVE_UPSERT_ONE_SUCCESS] = this.saveUpsertOneSuccess.bind(this),
                // Do nothing on save errors except turn the loading flag off.
                // See the ChangeTrackerMetaReducers
                // Or the app could listen for those errors and do something
                /// cache only operations ///
                _a[EntityOp.ADD_ALL] = this.addAll.bind(this),
                _a[EntityOp.ADD_MANY] = this.addMany.bind(this),
                _a[EntityOp.ADD_ONE] = this.addOne.bind(this),
                _a[EntityOp.REMOVE_ALL] = this.removeAll.bind(this),
                _a[EntityOp.REMOVE_MANY] = this.removeMany.bind(this),
                _a[EntityOp.REMOVE_ONE] = this.removeOne.bind(this),
                _a[EntityOp.UPDATE_MANY] = this.updateMany.bind(this),
                _a[EntityOp.UPDATE_ONE] = this.updateOne.bind(this),
                _a[EntityOp.UPSERT_MANY] = this.upsertMany.bind(this),
                _a[EntityOp.UPSERT_ONE] = this.upsertOne.bind(this),
                _a[EntityOp.COMMIT_ALL] = this.commitAll.bind(this),
                _a[EntityOp.COMMIT_MANY] = this.commitMany.bind(this),
                _a[EntityOp.COMMIT_ONE] = this.commitOne.bind(this),
                _a[EntityOp.UNDO_ALL] = this.undoAll.bind(this),
                _a[EntityOp.UNDO_MANY] = this.undoMany.bind(this),
                _a[EntityOp.UNDO_ONE] = this.undoOne.bind(this),
                _a[EntityOp.SET_CHANGE_STATE] = this.setChangeState.bind(this),
                _a[EntityOp.SET_COLLECTION] = this.setCollection.bind(this),
                _a[EntityOp.SET_FILTER] = this.setFilter.bind(this),
                _a[EntityOp.SET_LOADED] = this.setLoaded.bind(this),
                _a[EntityOp.SET_LOADING] = this.setLoading.bind(this),
                _a);
            this.adapter = definition.entityAdapter;
            this.isChangeTracking = definition.noChangeTracking !== true;
            this.selectId = definition.selectId;
            this.guard = new EntityActionGuard(entityName, this.selectId);
            this.toUpdate = toUpdateFactory(this.selectId);
            this.entityChangeTracker =
                entityChangeTracker ||
                    new EntityChangeTrackerBase(this.adapter, this.selectId);
        }
        /**
         * Cancel a persistence operation
         * @protected
         * @param {?} collection
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.cancelPersist = function (collection) {
            return this.setLoadingFalse(collection);
        };
        // #region query operations
        /**
         * @protected
         * @param {?} collection
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.queryAll = function (collection) {
            return this.setLoadingTrue(collection);
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.queryAllError = function (collection, action) {
            return this.setLoadingFalse(collection);
        };
        /**
         * Merges query results per the MergeStrategy
         * Sets loading flag to false and loaded flag to true.
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.queryAllSuccess = function (collection, action) {
            /** @type {?} */
            var data = this.extractData(action);
            /** @type {?} */
            var mergeStrategy = this.extractMergeStrategy(action);
            return Object.assign(Object.assign({}, this.entityChangeTracker.mergeQueryResults(data, collection, mergeStrategy)), { loaded: true, loading: false });
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.queryByKey = function (collection, action) {
            return this.setLoadingTrue(collection);
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.queryByKeyError = function (collection, action) {
            return this.setLoadingFalse(collection);
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.queryByKeySuccess = function (collection, action) {
            /** @type {?} */
            var data = this.extractData(action);
            /** @type {?} */
            var mergeStrategy = this.extractMergeStrategy(action);
            collection =
                data == null
                    ? collection
                    : this.entityChangeTracker.mergeQueryResults([data], collection, mergeStrategy);
            return this.setLoadingFalse(collection);
        };
        /**
         * @protected
         * @param {?} collection
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.queryLoad = function (collection) {
            return this.setLoadingTrue(collection);
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.queryLoadError = function (collection, action) {
            return this.setLoadingFalse(collection);
        };
        /**
         * Replaces all entities in the collection
         * Sets loaded flag to true, loading flag to false,
         * and clears changeState for the entire collection.
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.queryLoadSuccess = function (collection, action) {
            /** @type {?} */
            var data = this.extractData(action);
            return Object.assign(Object.assign({}, this.adapter.addAll(data, collection)), { loading: false, loaded: true, changeState: {} });
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.queryMany = function (collection, action) {
            return this.setLoadingTrue(collection);
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.queryManyError = function (collection, action) {
            return this.setLoadingFalse(collection);
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.queryManySuccess = function (collection, action) {
            /** @type {?} */
            var data = this.extractData(action);
            /** @type {?} */
            var mergeStrategy = this.extractMergeStrategy(action);
            return Object.assign(Object.assign({}, this.entityChangeTracker.mergeQueryResults(data, collection, mergeStrategy)), { loading: false });
        };
        // #endregion query operations
        // #region save operations
        // #region saveAddMany
        /**
         * Save multiple new entities.
         * If saving pessimistically, delay adding to collection until server acknowledges success.
         * If saving optimistically; add immediately.
         * @protected
         * @param {?} collection The collection to which the entities should be added.
         * @param {?} action The action payload holds options, including whether the save is optimistic,
         * and the data, which must be an array of entities.
         * If saving optimistically, the entities must have their keys.
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveAddMany = function (collection, action) {
            if (this.isOptimistic(action)) {
                /** @type {?} */
                var entities = this.guard.mustBeEntities(action);
                // ensure the entity has a PK
                /** @type {?} */
                var mergeStrategy = this.extractMergeStrategy(action);
                collection = this.entityChangeTracker.trackAddMany(entities, collection, mergeStrategy);
                collection = this.adapter.addMany(entities, collection);
            }
            return this.setLoadingTrue(collection);
        };
        /**
         * Attempt to save new entities failed or timed-out.
         * Action holds the error.
         * If saved pessimistically, new entities are not in the collection and
         * you may not have to compensate for the error.
         * If saved optimistically, the unsaved entities are in the collection and
         * you may need to compensate for the error.
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveAddManyError = function (collection, action) {
            return this.setLoadingFalse(collection);
        };
        // #endregion saveAddMany
        // #region saveAddOne
        /**
         * Successfully saved new entities to the server.
         * If saved pessimistically, add the entities from the server to the collection.
         * If saved optimistically, the added entities are already in the collection.
         * However, the server might have set or modified other fields (e.g, concurrency field),
         * and may even return additional new entities.
         * Therefore, upsert the entities in the collection with the returned values (if any)
         * Caution: in a race, this update could overwrite unsaved user changes.
         * Use pessimistic add to avoid this risk.
         * Note: saveAddManySuccess differs from saveAddOneSuccess when optimistic.
         * saveAddOneSuccess updates (not upserts) with the lone entity from the server.
         * There is no effect if the entity is not already in cache.
         * saveAddManySuccess will add an entity if it is not found in cache.
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveAddManySuccess = function (collection, action) {
            // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
            /** @type {?} */
            var entities = this.guard.mustBeEntities(action);
            /** @type {?} */
            var mergeStrategy = this.extractMergeStrategy(action);
            if (this.isOptimistic(action)) {
                collection = this.entityChangeTracker.mergeSaveUpserts(entities, collection, mergeStrategy);
            }
            else {
                collection = this.entityChangeTracker.mergeSaveAdds(entities, collection, mergeStrategy);
            }
            return this.setLoadingFalse(collection);
        };
        // #endregion saveAddMany
        // #region saveAddOne
        /**
         * Save a new entity.
         * If saving pessimistically, delay adding to collection until server acknowledges success.
         * If saving optimistically; add entity immediately.
         * @protected
         * @param {?} collection The collection to which the entity should be added.
         * @param {?} action The action payload holds options, including whether the save is optimistic,
         * and the data, which must be an entity.
         * If saving optimistically, the entity must have a key.
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveAddOne = function (collection, action) {
            if (this.isOptimistic(action)) {
                /** @type {?} */
                var entity = this.guard.mustBeEntity(action);
                // ensure the entity has a PK
                /** @type {?} */
                var mergeStrategy = this.extractMergeStrategy(action);
                collection = this.entityChangeTracker.trackAddOne(entity, collection, mergeStrategy);
                collection = this.adapter.addOne(entity, collection);
            }
            return this.setLoadingTrue(collection);
        };
        /**
         * Attempt to save a new entity failed or timed-out.
         * Action holds the error.
         * If saved pessimistically, the entity is not in the collection and
         * you may not have to compensate for the error.
         * If saved optimistically, the unsaved entity is in the collection and
         * you may need to compensate for the error.
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveAddOneError = function (collection, action) {
            return this.setLoadingFalse(collection);
        };
        /**
         * Successfully saved a new entity to the server.
         * If saved pessimistically, add the entity from the server to the collection.
         * If saved optimistically, the added entity is already in the collection.
         * However, the server might have set or modified other fields (e.g, concurrency field)
         * Therefore, update the entity in the collection with the returned value (if any)
         * Caution: in a race, this update could overwrite unsaved user changes.
         * Use pessimistic add to avoid this risk.
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveAddOneSuccess = function (collection, action) {
            // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
            /** @type {?} */
            var entity = this.guard.mustBeEntity(action);
            /** @type {?} */
            var mergeStrategy = this.extractMergeStrategy(action);
            if (this.isOptimistic(action)) {
                /** @type {?} */
                var update = this.toUpdate(entity);
                // Always update the cache with added entity returned from server
                collection = this.entityChangeTracker.mergeSaveUpdates([update], collection, mergeStrategy, false /*never skip*/);
            }
            else {
                collection = this.entityChangeTracker.mergeSaveAdds([entity], collection, mergeStrategy);
            }
            return this.setLoadingFalse(collection);
        };
        // #endregion saveAddOne
        // #region saveAddMany
        // TODO MANY
        // #endregion saveAddMany
        // #region saveDeleteOne
        /**
         * Delete an entity from the server by key and remove it from the collection (if present).
         * If the entity is an unsaved new entity, remove it from the collection immediately
         * and skip the server delete request.
         * An optimistic save removes an existing entity from the collection immediately;
         * a pessimistic save removes it after the server confirms successful delete.
         * @protected
         * @param {?} collection Will remove the entity with this key from the collection.
         * @param {?} action The action payload holds options, including whether the save is optimistic,
         * and the data, which must be a primary key or an entity with a key;
         * this reducer extracts the key from the entity.
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveDeleteOne = function (collection, action) {
            /** @type {?} */
            var toDelete = this.extractData(action);
            /** @type {?} */
            var deleteId = typeof toDelete === 'object'
                ? this.selectId(toDelete)
                : (( /** @type {?} */(toDelete)));
            /** @type {?} */
            var change = collection.changeState[deleteId];
            // If entity is already tracked ...
            if (change) {
                if (change.changeType === ChangeType.Added) {
                    // Remove the added entity immediately and forget about its changes (via commit).
                    collection = this.adapter.removeOne(( /** @type {?} */(deleteId)), collection);
                    collection = this.entityChangeTracker.commitOne(deleteId, collection);
                    // Should not waste effort trying to delete on the server because it can't be there.
                    action.payload.skip = true;
                }
                else {
                    // Re-track it as a delete, even if tracking is turned off for this call.
                    collection = this.entityChangeTracker.trackDeleteOne(deleteId, collection);
                }
            }
            // If optimistic delete, track current state and remove immediately.
            if (this.isOptimistic(action)) {
                /** @type {?} */
                var mergeStrategy = this.extractMergeStrategy(action);
                collection = this.entityChangeTracker.trackDeleteOne(deleteId, collection, mergeStrategy);
                collection = this.adapter.removeOne(( /** @type {?} */(deleteId)), collection);
            }
            return this.setLoadingTrue(collection);
        };
        /**
         * Attempt to delete the entity on the server failed or timed-out.
         * Action holds the error.
         * If saved pessimistically, the entity could still be in the collection and
         * you may not have to compensate for the error.
         * If saved optimistically, the entity is not in the collection and
         * you may need to compensate for the error.
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveDeleteOneError = function (collection, action) {
            return this.setLoadingFalse(collection);
        };
        /**
         * Successfully deleted entity on the server. The key of the deleted entity is in the action payload data.
         * If saved pessimistically, if the entity is still in the collection it will be removed.
         * If saved optimistically, the entity has already been removed from the collection.
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveDeleteOneSuccess = function (collection, action) {
            /** @type {?} */
            var deleteId = this.extractData(action);
            if (this.isOptimistic(action)) {
                /** @type {?} */
                var mergeStrategy = this.extractMergeStrategy(action);
                collection = this.entityChangeTracker.mergeSaveDeletes([deleteId], collection, mergeStrategy);
            }
            else {
                // Pessimistic: ignore mergeStrategy. Remove entity from the collection and from change tracking.
                collection = this.adapter.removeOne(( /** @type {?} */(deleteId)), collection);
                collection = this.entityChangeTracker.commitOne(deleteId, collection);
            }
            return this.setLoadingFalse(collection);
        };
        // #endregion saveDeleteOne
        // #region saveDeleteMany
        /**
         * Delete multiple entities from the server by key and remove them from the collection (if present).
         * Removes unsaved new entities from the collection immediately
         * but the id is still sent to the server for deletion even though the server will not find that entity.
         * Therefore, the server must be willing to ignore a delete request for an entity it cannot find.
         * An optimistic save removes existing entities from the collection immediately;
         * a pessimistic save removes them after the server confirms successful delete.
         * @protected
         * @param {?} collection Removes entities from this collection.
         * @param {?} action The action payload holds options, including whether the save is optimistic,
         * and the data, which must be an array of primary keys or entities with a key;
         * this reducer extracts the key from the entity.
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveDeleteMany = function (collection, action) {
            var _this = this;
            /** @type {?} */
            var deleteIds = this.extractData(action).map(( /**
             * @param {?} d
             * @return {?}
             */function (d) { return typeof d === 'object' ? _this.selectId(d) : (( /** @type {?} */(d))); }));
            deleteIds.forEach(( /**
             * @param {?} deleteId
             * @return {?}
             */function (deleteId) {
                /** @type {?} */
                var change = collection.changeState[deleteId];
                // If entity is already tracked ...
                if (change) {
                    if (change.changeType === ChangeType.Added) {
                        // Remove the added entity immediately and forget about its changes (via commit).
                        collection = _this.adapter.removeOne(( /** @type {?} */(deleteId)), collection);
                        collection = _this.entityChangeTracker.commitOne(deleteId, collection);
                        // Should not waste effort trying to delete on the server because it can't be there.
                        action.payload.skip = true;
                    }
                    else {
                        // Re-track it as a delete, even if tracking is turned off for this call.
                        collection = _this.entityChangeTracker.trackDeleteOne(deleteId, collection);
                    }
                }
            }));
            // If optimistic delete, track current state and remove immediately.
            if (this.isOptimistic(action)) {
                /** @type {?} */
                var mergeStrategy = this.extractMergeStrategy(action);
                collection = this.entityChangeTracker.trackDeleteMany(deleteIds, collection, mergeStrategy);
                collection = this.adapter.removeMany(( /** @type {?} */(deleteIds)), collection);
            }
            return this.setLoadingTrue(collection);
        };
        /**
         * Attempt to delete the entities on the server failed or timed-out.
         * Action holds the error.
         * If saved pessimistically, the entities could still be in the collection and
         * you may not have to compensate for the error.
         * If saved optimistically, the entities are not in the collection and
         * you may need to compensate for the error.
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveDeleteManyError = function (collection, action) {
            return this.setLoadingFalse(collection);
        };
        /**
         * Successfully deleted entities on the server. The keys of the deleted entities are in the action payload data.
         * If saved pessimistically, entities that are still in the collection will be removed.
         * If saved optimistically, the entities have already been removed from the collection.
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveDeleteManySuccess = function (collection, action) {
            /** @type {?} */
            var deleteIds = this.extractData(action);
            if (this.isOptimistic(action)) {
                /** @type {?} */
                var mergeStrategy = this.extractMergeStrategy(action);
                collection = this.entityChangeTracker.mergeSaveDeletes(deleteIds, collection, mergeStrategy);
            }
            else {
                // Pessimistic: ignore mergeStrategy. Remove entity from the collection and from change tracking.
                collection = this.adapter.removeMany(( /** @type {?} */(deleteIds)), collection);
                collection = this.entityChangeTracker.commitMany(deleteIds, collection);
            }
            return this.setLoadingFalse(collection);
        };
        // #endregion saveDeleteMany
        // #region saveUpdateOne
        /**
         * Save an update to an existing entity.
         * If saving pessimistically, update the entity in the collection after the server confirms success.
         * If saving optimistically, update the entity immediately, before the save request.
         * @protected
         * @param {?} collection The collection to update
         * @param {?} action The action payload holds options, including if the save is optimistic,
         * and the data which, must be an {Update<T>}
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveUpdateOne = function (collection, action) {
            /** @type {?} */
            var update = this.guard.mustBeUpdate(action);
            if (this.isOptimistic(action)) {
                /** @type {?} */
                var mergeStrategy = this.extractMergeStrategy(action);
                collection = this.entityChangeTracker.trackUpdateOne(update, collection, mergeStrategy);
                collection = this.adapter.updateOne(update, collection);
            }
            return this.setLoadingTrue(collection);
        };
        /**
         * Attempt to update the entity on the server failed or timed-out.
         * Action holds the error.
         * If saved pessimistically, the entity in the collection is in the pre-save state
         * you may not have to compensate for the error.
         * If saved optimistically, the entity in the collection was updated
         * and you may need to compensate for the error.
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveUpdateOneError = function (collection, action) {
            return this.setLoadingFalse(collection);
        };
        /**
         * Successfully saved the updated entity to the server.
         * If saved pessimistically, update the entity in the collection with data from the server.
         * If saved optimistically, the entity was already updated in the collection.
         * However, the server might have set or modified other fields (e.g, concurrency field)
         * Therefore, update the entity in the collection with the returned value (if any)
         * Caution: in a race, this update could overwrite unsaved user changes.
         * Use pessimistic update to avoid this risk.
         * @protected
         * @param {?} collection The collection to update
         * @param {?} action The action payload holds options, including if the save is optimistic, and
         * the update data which, must be an UpdateResponse<T> that corresponds to the Update sent to the server.
         * You must include an UpdateResponse even if the save was optimistic,
         * to ensure that the change tracking is properly reset.
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveUpdateOneSuccess = function (collection, action) {
            /** @type {?} */
            var update = this.guard.mustBeUpdateResponse(action);
            /** @type {?} */
            var isOptimistic = this.isOptimistic(action);
            /** @type {?} */
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.mergeSaveUpdates([update], collection, mergeStrategy, isOptimistic /*skip unchanged if optimistic */);
            return this.setLoadingFalse(collection);
        };
        // #endregion saveUpdateOne
        // #region saveUpdateMany
        /**
         * Save updated entities.
         * If saving pessimistically, update the entities in the collection after the server confirms success.
         * If saving optimistically, update the entities immediately, before the save request.
         * @protected
         * @param {?} collection The collection to update
         * @param {?} action The action payload holds options, including if the save is optimistic,
         * and the data which, must be an array of {Update<T>}.
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveUpdateMany = function (collection, action) {
            /** @type {?} */
            var updates = this.guard.mustBeUpdates(action);
            if (this.isOptimistic(action)) {
                /** @type {?} */
                var mergeStrategy = this.extractMergeStrategy(action);
                collection = this.entityChangeTracker.trackUpdateMany(updates, collection, mergeStrategy);
                collection = this.adapter.updateMany(updates, collection);
            }
            return this.setLoadingTrue(collection);
        };
        /**
         * Attempt to update entities on the server failed or timed-out.
         * Action holds the error.
         * If saved pessimistically, the entities in the collection are in the pre-save state
         * you may not have to compensate for the error.
         * If saved optimistically, the entities in the collection were updated
         * and you may need to compensate for the error.
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveUpdateManyError = function (collection, action) {
            return this.setLoadingFalse(collection);
        };
        /**
         * Successfully saved the updated entities to the server.
         * If saved pessimistically, the entities in the collection will be updated with data from the server.
         * If saved optimistically, the entities in the collection were already updated.
         * However, the server might have set or modified other fields (e.g, concurrency field)
         * Therefore, update the entity in the collection with the returned values (if any)
         * Caution: in a race, this update could overwrite unsaved user changes.
         * Use pessimistic update to avoid this risk.
         * @protected
         * @param {?} collection The collection to update
         * @param {?} action The action payload holds options, including if the save is optimistic,
         * and the data which, must be an array of UpdateResponse<T>.
         * You must include an UpdateResponse for every Update sent to the server,
         * even if the save was optimistic, to ensure that the change tracking is properly reset.
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveUpdateManySuccess = function (collection, action) {
            /** @type {?} */
            var updates = this.guard.mustBeUpdateResponses(action);
            /** @type {?} */
            var isOptimistic = this.isOptimistic(action);
            /** @type {?} */
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.mergeSaveUpdates(updates, collection, mergeStrategy, false /* never skip */);
            return this.setLoadingFalse(collection);
        };
        // #endregion saveUpdateMany
        // #region saveUpsertOne
        /**
         * Save a new or existing entity.
         * If saving pessimistically, delay adding to collection until server acknowledges success.
         * If saving optimistically; add immediately.
         * @protected
         * @param {?} collection The collection to which the entity should be upserted.
         * @param {?} action The action payload holds options, including whether the save is optimistic,
         * and the data, which must be a whole entity.
         * If saving optimistically, the entity must have its key.
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveUpsertOne = function (collection, action) {
            if (this.isOptimistic(action)) {
                /** @type {?} */
                var entity = this.guard.mustBeEntity(action);
                // ensure the entity has a PK
                /** @type {?} */
                var mergeStrategy = this.extractMergeStrategy(action);
                collection = this.entityChangeTracker.trackUpsertOne(entity, collection, mergeStrategy);
                collection = this.adapter.upsertOne(entity, collection);
            }
            return this.setLoadingTrue(collection);
        };
        /**
         * Attempt to save new or existing entity failed or timed-out.
         * Action holds the error.
         * If saved pessimistically, new or updated entity is not in the collection and
         * you may not have to compensate for the error.
         * If saved optimistically, the unsaved entities are in the collection and
         * you may need to compensate for the error.
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveUpsertOneError = function (collection, action) {
            return this.setLoadingFalse(collection);
        };
        /**
         * Successfully saved new or existing entities to the server.
         * If saved pessimistically, add the entities from the server to the collection.
         * If saved optimistically, the added entities are already in the collection.
         * However, the server might have set or modified other fields (e.g, concurrency field)
         * Therefore, update the entities in the collection with the returned values (if any)
         * Caution: in a race, this update could overwrite unsaved user changes.
         * Use pessimistic add to avoid this risk.
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveUpsertOneSuccess = function (collection, action) {
            // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
            /** @type {?} */
            var entity = this.guard.mustBeEntity(action);
            /** @type {?} */
            var mergeStrategy = this.extractMergeStrategy(action);
            // Always update the cache with upserted entities returned from server
            collection = this.entityChangeTracker.mergeSaveUpserts([entity], collection, mergeStrategy);
            return this.setLoadingFalse(collection);
        };
        // #endregion saveUpsertOne
        // #region saveUpsertMany
        /**
         * Save multiple new or existing entities.
         * If saving pessimistically, delay adding to collection until server acknowledges success.
         * If saving optimistically; add immediately.
         * @protected
         * @param {?} collection The collection to which the entities should be upserted.
         * @param {?} action The action payload holds options, including whether the save is optimistic,
         * and the data, which must be an array of whole entities.
         * If saving optimistically, the entities must have their keys.
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveUpsertMany = function (collection, action) {
            if (this.isOptimistic(action)) {
                /** @type {?} */
                var entities = this.guard.mustBeEntities(action);
                // ensure the entity has a PK
                /** @type {?} */
                var mergeStrategy = this.extractMergeStrategy(action);
                collection = this.entityChangeTracker.trackUpsertMany(entities, collection, mergeStrategy);
                collection = this.adapter.upsertMany(entities, collection);
            }
            return this.setLoadingTrue(collection);
        };
        /**
         * Attempt to save new or existing entities failed or timed-out.
         * Action holds the error.
         * If saved pessimistically, new entities are not in the collection and
         * you may not have to compensate for the error.
         * If saved optimistically, the unsaved entities are in the collection and
         * you may need to compensate for the error.
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveUpsertManyError = function (collection, action) {
            return this.setLoadingFalse(collection);
        };
        /**
         * Successfully saved new or existing entities to the server.
         * If saved pessimistically, add the entities from the server to the collection.
         * If saved optimistically, the added entities are already in the collection.
         * However, the server might have set or modified other fields (e.g, concurrency field)
         * Therefore, update the entities in the collection with the returned values (if any)
         * Caution: in a race, this update could overwrite unsaved user changes.
         * Use pessimistic add to avoid this risk.
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.saveUpsertManySuccess = function (collection, action) {
            // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
            /** @type {?} */
            var entities = this.guard.mustBeEntities(action);
            /** @type {?} */
            var mergeStrategy = this.extractMergeStrategy(action);
            // Always update the cache with upserted entities returned from server
            collection = this.entityChangeTracker.mergeSaveUpserts(entities, collection, mergeStrategy);
            return this.setLoadingFalse(collection);
        };
        // #endregion saveUpsertMany
        // #endregion save operations
        // #region cache-only operations
        /**
         * Replaces all entities in the collection
         * Sets loaded flag to true.
         * Merges query results, preserving unsaved changes
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.addAll = function (collection, action) {
            /** @type {?} */
            var entities = this.guard.mustBeEntities(action);
            return Object.assign(Object.assign({}, this.adapter.addAll(entities, collection)), { loading: false, loaded: true, changeState: {} });
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.addMany = function (collection, action) {
            /** @type {?} */
            var entities = this.guard.mustBeEntities(action);
            /** @type {?} */
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackAddMany(entities, collection, mergeStrategy);
            return this.adapter.addMany(entities, collection);
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.addOne = function (collection, action) {
            /** @type {?} */
            var entity = this.guard.mustBeEntity(action);
            /** @type {?} */
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackAddOne(entity, collection, mergeStrategy);
            return this.adapter.addOne(entity, collection);
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.removeMany = function (collection, action) {
            // payload must be entity keys
            /** @type {?} */
            var keys = ( /** @type {?} */(this.guard.mustBeKeys(action)));
            /** @type {?} */
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackDeleteMany(keys, collection, mergeStrategy);
            return this.adapter.removeMany(keys, collection);
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.removeOne = function (collection, action) {
            // payload must be entity key
            /** @type {?} */
            var key = ( /** @type {?} */(this.guard.mustBeKey(action)));
            /** @type {?} */
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackDeleteOne(key, collection, mergeStrategy);
            return this.adapter.removeOne(key, collection);
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.removeAll = function (collection, action) {
            return Object.assign(Object.assign({}, this.adapter.removeAll(collection)), { loaded: false, loading: false, changeState: {} });
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.updateMany = function (collection, action) {
            // payload must be an array of `Updates<T>`, not entities
            /** @type {?} */
            var updates = this.guard.mustBeUpdates(action);
            /** @type {?} */
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackUpdateMany(updates, collection, mergeStrategy);
            return this.adapter.updateMany(updates, collection);
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.updateOne = function (collection, action) {
            // payload must be an `Update<T>`, not an entity
            /** @type {?} */
            var update = this.guard.mustBeUpdate(action);
            /** @type {?} */
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackUpdateOne(update, collection, mergeStrategy);
            return this.adapter.updateOne(update, collection);
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.upsertMany = function (collection, action) {
            // <v6: payload must be an array of `Updates<T>`, not entities
            // v6+: payload must be an array of T
            /** @type {?} */
            var entities = this.guard.mustBeEntities(action);
            /** @type {?} */
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackUpsertMany(entities, collection, mergeStrategy);
            return this.adapter.upsertMany(entities, collection);
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.upsertOne = function (collection, action) {
            // <v6: payload must be an `Update<T>`, not an entity
            // v6+: payload must be a T
            /** @type {?} */
            var entity = this.guard.mustBeEntity(action);
            /** @type {?} */
            var mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackUpsertOne(entity, collection, mergeStrategy);
            return this.adapter.upsertOne(entity, collection);
        };
        /**
         * @protected
         * @param {?} collection
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.commitAll = function (collection) {
            return this.entityChangeTracker.commitAll(collection);
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.commitMany = function (collection, action) {
            return this.entityChangeTracker.commitMany(this.extractData(action), collection);
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.commitOne = function (collection, action) {
            return this.entityChangeTracker.commitOne(this.extractData(action), collection);
        };
        /**
         * @protected
         * @param {?} collection
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.undoAll = function (collection) {
            return this.entityChangeTracker.undoAll(collection);
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.undoMany = function (collection, action) {
            return this.entityChangeTracker.undoMany(this.extractData(action), collection);
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.undoOne = function (collection, action) {
            return this.entityChangeTracker.undoOne(this.extractData(action), collection);
        };
        /**
         * Dangerous: Completely replace the collection's ChangeState. Use rarely and wisely.
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.setChangeState = function (collection, action) {
            /** @type {?} */
            var changeState = this.extractData(action);
            return collection.changeState === changeState
                ? collection
                : Object.assign(Object.assign({}, collection), { changeState: changeState });
        };
        /**
         * Dangerous: Completely replace the collection.
         * Primarily for testing and rehydration from local storage.
         * Use rarely and wisely.
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.setCollection = function (collection, action) {
            /** @type {?} */
            var newCollection = this.extractData(action);
            return collection === newCollection ? collection : newCollection;
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.setFilter = function (collection, action) {
            /** @type {?} */
            var filter = this.extractData(action);
            return collection.filter === filter
                ? collection
                : Object.assign(Object.assign({}, collection), { filter: filter });
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.setLoaded = function (collection, action) {
            /** @type {?} */
            var loaded = this.extractData(action) === true || false;
            return collection.loaded === loaded
                ? collection
                : Object.assign(Object.assign({}, collection), { loaded: loaded });
        };
        /**
         * @protected
         * @param {?} collection
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.setLoading = function (collection, action) {
            return this.setLoadingFlag(collection, this.extractData(action));
        };
        /**
         * @protected
         * @param {?} collection
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.setLoadingFalse = function (collection) {
            return this.setLoadingFlag(collection, false);
        };
        /**
         * @protected
         * @param {?} collection
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.setLoadingTrue = function (collection) {
            return this.setLoadingFlag(collection, true);
        };
        /**
         * Set the collection's loading flag
         * @protected
         * @param {?} collection
         * @param {?} loading
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.setLoadingFlag = function (collection, loading) {
            loading = loading === true ? true : false;
            return collection.loading === loading
                ? collection
                : Object.assign(Object.assign({}, collection), { loading: loading });
        };
        // #endregion Cache-only operations
        // #region helpers
        /**
         * Safely extract data from the EntityAction payload
         * @protected
         * @template D
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.extractData = function (action) {
            return ( /** @type {?} */((action.payload && action.payload.data)));
        };
        /**
         * Safely extract MergeStrategy from EntityAction. Set to IgnoreChanges if collection itself is not tracked.
         * @protected
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.extractMergeStrategy = function (action) {
            // If not tracking this collection, always ignore changes
            return this.isChangeTracking
                ? action.payload && action.payload.mergeStrategy
                : MergeStrategy.IgnoreChanges;
        };
        /**
         * @protected
         * @param {?} action
         * @return {?}
         */
        EntityCollectionReducerMethods.prototype.isOptimistic = function (action) {
            return action.payload && action.payload.isOptimistic === true;
        };
        return EntityCollectionReducerMethods;
    }());
    if (false) {
        /**
         * @type {?}
         * @protected
         */
        EntityCollectionReducerMethods.prototype.adapter;
        /**
         * @type {?}
         * @protected
         */
        EntityCollectionReducerMethods.prototype.guard;
        /**
         * True if this collection tracks unsaved changes
         * @type {?}
         * @protected
         */
        EntityCollectionReducerMethods.prototype.isChangeTracking;
        /**
         * Extract the primary key (id); default to `id`
         * @type {?}
         */
        EntityCollectionReducerMethods.prototype.selectId;
        /**
         * Track changes to entities since the last query or save
         * Can revert some or all of those changes
         * @type {?}
         */
        EntityCollectionReducerMethods.prototype.entityChangeTracker;
        /**
         * Convert an entity (or partial entity) into the `Update<T>` object
         * `id`: the primary key and
         * `changes`: the entity (or partial entity of changes).
         * @type {?}
         * @protected
         */
        EntityCollectionReducerMethods.prototype.toUpdate;
        /**
         * Dictionary of the {EntityCollectionReducerMethods} for this entity type,
         * keyed by the {EntityOp}
         * @type {?}
         */
        EntityCollectionReducerMethods.prototype.methods;
        /** @type {?} */
        EntityCollectionReducerMethods.prototype.entityName;
        /** @type {?} */
        EntityCollectionReducerMethods.prototype.definition;
    }
    /**
     * Creates {EntityCollectionReducerMethods} for a given entity type.
     */
    var EntityCollectionReducerMethodsFactory = /** @class */ (function () {
        /**
         * @param {?} entityDefinitionService
         */
        function EntityCollectionReducerMethodsFactory(entityDefinitionService) {
            this.entityDefinitionService = entityDefinitionService;
        }
        /**
         * Create the  {EntityCollectionReducerMethods} for the named entity type
         * @template T
         * @param {?} entityName
         * @return {?}
         */
        EntityCollectionReducerMethodsFactory.prototype.create = function (entityName) {
            /** @type {?} */
            var definition = this.entityDefinitionService.getDefinition(entityName);
            /** @type {?} */
            var methodsClass = new EntityCollectionReducerMethods(entityName, definition);
            return methodsClass.methods;
        };
        return EntityCollectionReducerMethodsFactory;
    }());
    EntityCollectionReducerMethodsFactory.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    EntityCollectionReducerMethodsFactory.ctorParameters = function () { return [
        { type: EntityDefinitionService }
    ]; };
    if (false) {
        /**
         * @type {?}
         * @private
         */
        EntityCollectionReducerMethodsFactory.prototype.entityDefinitionService;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/reducers/entity-collection-reducer.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Create a default reducer for a specific entity collection
     */
    var EntityCollectionReducerFactory = /** @class */ (function () {
        /**
         * @param {?} methodsFactory
         */
        function EntityCollectionReducerFactory(methodsFactory) {
            this.methodsFactory = methodsFactory;
        }
        /**
         * Create a default reducer for a collection of entities of T
         * @template T
         * @param {?} entityName
         * @return {?}
         */
        EntityCollectionReducerFactory.prototype.create = function (entityName) {
            /** @type {?} */
            var methods = this.methodsFactory.create(entityName);
            /** Perform Actions against a particular entity collection in the EntityCache */
            return ( /**
             * @param {?} collection
             * @param {?} action
             * @return {?}
             */function entityCollectionReducer(collection, action) {
                /** @type {?} */
                var reducerMethod = methods[action.payload.entityOp];
                return reducerMethod ? reducerMethod(collection, action) : collection;
            });
        };
        return EntityCollectionReducerFactory;
    }());
    EntityCollectionReducerFactory.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    EntityCollectionReducerFactory.ctorParameters = function () { return [
        { type: EntityCollectionReducerMethodsFactory }
    ]; };
    if (false) {
        /**
         * @type {?}
         * @private
         */
        EntityCollectionReducerFactory.prototype.methodsFactory;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/reducers/entity-collection-reducer-registry.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * A hash of EntityCollectionReducers
     * @record
     */
    function EntityCollectionReducers() { }
    /**
     * Registry of entity types and their previously-constructed reducers.
     * Can create a new CollectionReducer, which it registers for subsequent use.
     */
    var EntityCollectionReducerRegistry = /** @class */ (function () {
        /**
         * @param {?} entityCollectionReducerFactory
         * @param {?=} entityCollectionMetaReducers
         */
        function EntityCollectionReducerRegistry(entityCollectionReducerFactory, entityCollectionMetaReducers) {
            this.entityCollectionReducerFactory = entityCollectionReducerFactory;
            this.entityCollectionReducers = {};
            this.entityCollectionMetaReducer = ( /** @type {?} */(store.compose.apply(null, entityCollectionMetaReducers || [])));
        }
        /**
         * Get the registered EntityCollectionReducer<T> for this entity type or create one and register it.
         * @template T
         * @param {?} entityName Name of the entity type for this reducer
         * @return {?}
         */
        EntityCollectionReducerRegistry.prototype.getOrCreateReducer = function (entityName) {
            /** @type {?} */
            var reducer = this.entityCollectionReducers[entityName];
            if (!reducer) {
                reducer = this.entityCollectionReducerFactory.create(entityName);
                reducer = this.registerReducer(entityName, reducer);
                this.entityCollectionReducers[entityName] = reducer;
            }
            return reducer;
        };
        /**
         * Register an EntityCollectionReducer for an entity type
         * @template T
         * @param {?} entityName - the name of the entity type
         * @param {?} reducer - reducer for that entity type
         *
         * Examples:
         *   registerReducer('Hero', myHeroReducer);
         *   registerReducer('Villain', myVillainReducer);
         * @return {?}
         */
        EntityCollectionReducerRegistry.prototype.registerReducer = function (entityName, reducer) {
            reducer = this.entityCollectionMetaReducer(( /** @type {?} */(reducer)));
            return (this.entityCollectionReducers[entityName.trim()] = reducer);
        };
        /**
         * Register a batch of EntityCollectionReducers.
         * @param {?} reducers - reducers to merge into existing reducers
         *
         * Examples:
         *   registerReducers({
         *     Hero: myHeroReducer,
         *     Villain: myVillainReducer
         *   });
         * @return {?}
         */
        EntityCollectionReducerRegistry.prototype.registerReducers = function (reducers) {
            var _this = this;
            /** @type {?} */
            var keys = reducers ? Object.keys(reducers) : [];
            keys.forEach(( /**
             * @param {?} key
             * @return {?}
             */function (key) { return _this.registerReducer(key, reducers[key]); }));
        };
        return EntityCollectionReducerRegistry;
    }());
    EntityCollectionReducerRegistry.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    EntityCollectionReducerRegistry.ctorParameters = function () { return [
        { type: EntityCollectionReducerFactory },
        { type: Array, decorators: [{ type: core.Optional }, { type: core.Inject, args: [ENTITY_COLLECTION_META_REDUCERS,] }] }
    ]; };
    if (false) {
        /**
         * @type {?}
         * @protected
         */
        EntityCollectionReducerRegistry.prototype.entityCollectionReducers;
        /**
         * @type {?}
         * @private
         */
        EntityCollectionReducerRegistry.prototype.entityCollectionMetaReducer;
        /**
         * @type {?}
         * @private
         */
        EntityCollectionReducerRegistry.prototype.entityCollectionReducerFactory;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/reducers/entity-cache-reducer.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Creates the EntityCacheReducer via its create() method
     */
    var EntityCacheReducerFactory = /** @class */ (function () {
        /**
         * @param {?} entityCollectionCreator
         * @param {?} entityCollectionReducerRegistry
         * @param {?} logger
         */
        function EntityCacheReducerFactory(entityCollectionCreator, entityCollectionReducerRegistry, logger) {
            this.entityCollectionCreator = entityCollectionCreator;
            this.entityCollectionReducerRegistry = entityCollectionReducerRegistry;
            this.logger = logger;
        }
        /**
         * Create the \@ngrx/data entity cache reducer which either responds to entity cache level actions
         * or (more commonly) delegates to an EntityCollectionReducer based on the action.payload.entityName.
         * @return {?}
         */
        EntityCacheReducerFactory.prototype.create = function () {
            // This technique ensures a named function appears in the debugger
            return entityCacheReducer.bind(this);
            /**
             * @this {?}
             * @param {?=} entityCache
             * @param {?=} action
             * @return {?}
             */
            function entityCacheReducer(entityCache, action) {
                if (entityCache === void 0) { entityCache = {}; }
                // EntityCache actions
                switch (action.type) {
                    case EntityCacheAction.CLEAR_COLLECTIONS: {
                        return this.clearCollectionsReducer(entityCache, ( /** @type {?} */(action)));
                    }
                    case EntityCacheAction.LOAD_COLLECTIONS: {
                        return this.loadCollectionsReducer(entityCache, ( /** @type {?} */(action)));
                    }
                    case EntityCacheAction.MERGE_QUERY_SET: {
                        return this.mergeQuerySetReducer(entityCache, ( /** @type {?} */(action)));
                    }
                    case EntityCacheAction.SAVE_ENTITIES: {
                        return this.saveEntitiesReducer(entityCache, ( /** @type {?} */(action)));
                    }
                    case EntityCacheAction.SAVE_ENTITIES_CANCEL: {
                        return this.saveEntitiesCancelReducer(entityCache, ( /** @type {?} */(action)));
                    }
                    case EntityCacheAction.SAVE_ENTITIES_ERROR: {
                        return this.saveEntitiesErrorReducer(entityCache, ( /** @type {?} */(action)));
                    }
                    case EntityCacheAction.SAVE_ENTITIES_SUCCESS: {
                        return this.saveEntitiesSuccessReducer(entityCache, ( /** @type {?} */(action)));
                    }
                    case EntityCacheAction.SET_ENTITY_CACHE: {
                        // Completely replace the EntityCache. Be careful!
                        return action.payload.cache;
                    }
                }
                // Apply entity collection reducer if this is a valid EntityAction for a collection
                /** @type {?} */
                var payload = action.payload;
                if (payload && payload.entityName && payload.entityOp && !payload.error) {
                    return this.applyCollectionReducer(entityCache, ( /** @type {?} */(action)));
                }
                // Not a valid EntityAction
                return entityCache;
            }
        };
        /**
         * Reducer to clear multiple collections at the same time.
         * @protected
         * @param {?} entityCache the entity cache
         * @param {?} action a ClearCollections action whose payload is an array of collection names.
         * If empty array, does nothing. If no array, clears all the collections.
         * @return {?}
         */
        EntityCacheReducerFactory.prototype.clearCollectionsReducer = function (entityCache, action) {
            var _this = this;
            // tslint:disable-next-line:prefer-const
            var _a = action.payload, collections = _a.collections, tag = _a.tag;
            /** @type {?} */
            var entityOp = EntityOp.REMOVE_ALL;
            if (!collections) {
                // Collections is not defined. Clear all collections.
                collections = Object.keys(entityCache);
            }
            entityCache = collections.reduce(( /**
             * @param {?} newCache
             * @param {?} entityName
             * @return {?}
             */function (newCache, entityName) {
                /** @type {?} */
                var payload = { entityName: entityName, entityOp: entityOp };
                /** @type {?} */
                var act = {
                    type: "[" + entityName + "] " + action.type,
                    payload: payload,
                };
                newCache = _this.applyCollectionReducer(newCache, act);
                return newCache;
            }), entityCache);
            return entityCache;
        };
        /**
         * Reducer to load collection in the form of a hash of entity data for multiple collections.
         * @protected
         * @param {?} entityCache the entity cache
         * @param {?} action a LoadCollections action whose payload is the QuerySet of entity collections to load
         * @return {?}
         */
        EntityCacheReducerFactory.prototype.loadCollectionsReducer = function (entityCache, action) {
            var _this = this;
            var _a = action.payload, collections = _a.collections, tag = _a.tag;
            /** @type {?} */
            var entityOp = EntityOp.ADD_ALL;
            /** @type {?} */
            var entityNames = Object.keys(collections);
            entityCache = entityNames.reduce(( /**
             * @param {?} newCache
             * @param {?} entityName
             * @return {?}
             */function (newCache, entityName) {
                /** @type {?} */
                var payload = {
                    entityName: entityName,
                    entityOp: entityOp,
                    data: collections[entityName],
                };
                /** @type {?} */
                var act = {
                    type: "[" + entityName + "] " + action.type,
                    payload: payload,
                };
                newCache = _this.applyCollectionReducer(newCache, act);
                return newCache;
            }), entityCache);
            return entityCache;
        };
        /**
         * Reducer to merge query sets in the form of a hash of entity data for multiple collections.
         * @protected
         * @param {?} entityCache the entity cache
         * @param {?} action a MergeQuerySet action with the query set and a MergeStrategy
         * @return {?}
         */
        EntityCacheReducerFactory.prototype.mergeQuerySetReducer = function (entityCache, action) {
            var _this = this;
            // tslint:disable-next-line:prefer-const
            var _a = action.payload, mergeStrategy = _a.mergeStrategy, querySet = _a.querySet, tag = _a.tag;
            mergeStrategy =
                mergeStrategy === null ? MergeStrategy.PreserveChanges : mergeStrategy;
            /** @type {?} */
            var entityOp = EntityOp.QUERY_MANY_SUCCESS;
            /** @type {?} */
            var entityNames = Object.keys(querySet);
            entityCache = entityNames.reduce(( /**
             * @param {?} newCache
             * @param {?} entityName
             * @return {?}
             */function (newCache, entityName) {
                /** @type {?} */
                var payload = {
                    entityName: entityName,
                    entityOp: entityOp,
                    data: querySet[entityName],
                    mergeStrategy: mergeStrategy,
                };
                /** @type {?} */
                var act = {
                    type: "[" + entityName + "] " + action.type,
                    payload: payload,
                };
                newCache = _this.applyCollectionReducer(newCache, act);
                return newCache;
            }), entityCache);
            return entityCache;
        };
        // #region saveEntities reducers
        /**
         * @protected
         * @param {?} entityCache
         * @param {?} action
         * @return {?}
         */
        EntityCacheReducerFactory.prototype.saveEntitiesReducer = function (entityCache, action) {
            var _this = this;
            var _a = action.payload, changeSet = _a.changeSet, correlationId = _a.correlationId, isOptimistic = _a.isOptimistic, mergeStrategy = _a.mergeStrategy, tag = _a.tag;
            try {
                changeSet.changes.forEach(( /**
                 * @param {?} item
                 * @return {?}
                 */function (item) {
                    /** @type {?} */
                    var entityName = item.entityName;
                    /** @type {?} */
                    var payload = {
                        entityName: entityName,
                        entityOp: getEntityOp(item),
                        data: item.entities,
                        correlationId: correlationId,
                        isOptimistic: isOptimistic,
                        mergeStrategy: mergeStrategy,
                        tag: tag,
                    };
                    /** @type {?} */
                    var act = {
                        type: "[" + entityName + "] " + action.type,
                        payload: payload,
                    };
                    entityCache = _this.applyCollectionReducer(entityCache, act);
                    if (act.payload.error) {
                        throw act.payload.error;
                    }
                }));
            }
            catch (error) {
                action.payload.error = error;
            }
            return entityCache;
            /**
             * @param {?} item
             * @return {?}
             */
            function getEntityOp(item) {
                switch (item.op) {
                    case ChangeSetOperation.Add:
                        return EntityOp.SAVE_ADD_MANY;
                    case ChangeSetOperation.Delete:
                        return EntityOp.SAVE_DELETE_MANY;
                    case ChangeSetOperation.Update:
                        return EntityOp.SAVE_UPDATE_MANY;
                    case ChangeSetOperation.Upsert:
                        return EntityOp.SAVE_UPSERT_MANY;
                }
            }
        };
        /**
         * @protected
         * @param {?} entityCache
         * @param {?} action
         * @return {?}
         */
        EntityCacheReducerFactory.prototype.saveEntitiesCancelReducer = function (entityCache, action) {
            // This implementation can only clear the loading flag for the collections involved
            // If the save was optimistic, you'll have to compensate to fix the cache as you think necessary
            return this.clearLoadingFlags(entityCache, action.payload.entityNames || []);
        };
        /**
         * @protected
         * @param {?} entityCache
         * @param {?} action
         * @return {?}
         */
        EntityCacheReducerFactory.prototype.saveEntitiesErrorReducer = function (entityCache, action) {
            /** @type {?} */
            var originalAction = action.payload.originalAction;
            /** @type {?} */
            var originalChangeSet = originalAction.payload.changeSet;
            // This implementation can only clear the loading flag for the collections involved
            // If the save was optimistic, you'll have to compensate to fix the cache as you think necessary
            /** @type {?} */
            var entityNames = originalChangeSet.changes.map(( /**
             * @param {?} item
             * @return {?}
             */function (item) { return item.entityName; }));
            return this.clearLoadingFlags(entityCache, entityNames);
        };
        /**
         * @protected
         * @param {?} entityCache
         * @param {?} action
         * @return {?}
         */
        EntityCacheReducerFactory.prototype.saveEntitiesSuccessReducer = function (entityCache, action) {
            var _this = this;
            var _a = action.payload, changeSet = _a.changeSet, correlationId = _a.correlationId, isOptimistic = _a.isOptimistic, mergeStrategy = _a.mergeStrategy, tag = _a.tag;
            changeSet.changes.forEach(( /**
             * @param {?} item
             * @return {?}
             */function (item) {
                /** @type {?} */
                var entityName = item.entityName;
                /** @type {?} */
                var payload = {
                    entityName: entityName,
                    entityOp: getEntityOp(item),
                    data: item.entities,
                    correlationId: correlationId,
                    isOptimistic: isOptimistic,
                    mergeStrategy: mergeStrategy,
                    tag: tag,
                };
                /** @type {?} */
                var act = {
                    type: "[" + entityName + "] " + action.type,
                    payload: payload,
                };
                entityCache = _this.applyCollectionReducer(entityCache, act);
            }));
            return entityCache;
            /**
             * @param {?} item
             * @return {?}
             */
            function getEntityOp(item) {
                switch (item.op) {
                    case ChangeSetOperation.Add:
                        return EntityOp.SAVE_ADD_MANY_SUCCESS;
                    case ChangeSetOperation.Delete:
                        return EntityOp.SAVE_DELETE_MANY_SUCCESS;
                    case ChangeSetOperation.Update:
                        return EntityOp.SAVE_UPDATE_MANY_SUCCESS;
                    case ChangeSetOperation.Upsert:
                        return EntityOp.SAVE_UPSERT_MANY_SUCCESS;
                }
            }
        };
        // #endregion saveEntities reducers
        // #region helpers
        /**
         * Apply reducer for the action's EntityCollection (if the action targets a collection)
         * @private
         * @param {?=} cache
         * @param {?=} action
         * @return {?}
         */
        EntityCacheReducerFactory.prototype.applyCollectionReducer = function (cache, action) {
            var _a;
            if (cache === void 0) { cache = {}; }
            /** @type {?} */
            var entityName = action.payload.entityName;
            /** @type {?} */
            var collection = cache[entityName];
            /** @type {?} */
            var reducer = this.entityCollectionReducerRegistry.getOrCreateReducer(entityName);
            /** @type {?} */
            var newCollection;
            try {
                newCollection = collection
                    ? reducer(collection, action)
                    : reducer(this.entityCollectionCreator.create(entityName), action);
            }
            catch (error) {
                this.logger.error(error);
                action.payload.error = error;
            }
            return action.payload.error || collection === ( /** @type {?} */(newCollection))
                ? cache
                : Object.assign(Object.assign({}, cache), (_a = {}, _a[entityName] = ( /** @type {?} */(newCollection)), _a));
        };
        /**
         * Ensure loading is false for every collection in entityNames
         * @private
         * @param {?} entityCache
         * @param {?} entityNames
         * @return {?}
         */
        EntityCacheReducerFactory.prototype.clearLoadingFlags = function (entityCache, entityNames) {
            /** @type {?} */
            var isMutated = false;
            entityNames.forEach(( /**
             * @param {?} entityName
             * @return {?}
             */function (entityName) {
                /** @type {?} */
                var collection = entityCache[entityName];
                if (collection.loading) {
                    if (!isMutated) {
                        entityCache = Object.assign({}, entityCache);
                        isMutated = true;
                    }
                    entityCache[entityName] = Object.assign(Object.assign({}, collection), { loading: false });
                }
            }));
            return entityCache;
        };
        return EntityCacheReducerFactory;
    }());
    EntityCacheReducerFactory.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    EntityCacheReducerFactory.ctorParameters = function () { return [
        { type: EntityCollectionCreator },
        { type: EntityCollectionReducerRegistry },
        { type: Logger }
    ]; };
    if (false) {
        /**
         * @type {?}
         * @private
         */
        EntityCacheReducerFactory.prototype.entityCollectionCreator;
        /**
         * @type {?}
         * @private
         */
        EntityCacheReducerFactory.prototype.entityCollectionReducerRegistry;
        /**
         * @type {?}
         * @private
         */
        EntityCacheReducerFactory.prototype.logger;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/utils/default-logger.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var DefaultLogger = /** @class */ (function () {
        function DefaultLogger() {
        }
        /**
         * @param {?=} message
         * @param {?=} extra
         * @return {?}
         */
        DefaultLogger.prototype.error = function (message, extra) {
            if (message) {
                extra ? console.error(message, extra) : console.error(message);
            }
        };
        /**
         * @param {?=} message
         * @param {?=} extra
         * @return {?}
         */
        DefaultLogger.prototype.log = function (message, extra) {
            if (message) {
                extra ? console.log(message, extra) : console.log(message);
            }
        };
        /**
         * @param {?=} message
         * @param {?=} extra
         * @return {?}
         */
        DefaultLogger.prototype.warn = function (message, extra) {
            if (message) {
                extra ? console.warn(message, extra) : console.warn(message);
            }
        };
        return DefaultLogger;
    }());
    DefaultLogger.decorators = [
        { type: core.Injectable }
    ];

    /**
     * @fileoverview added by tsickle
     * Generated from: src/utils/default-pluralizer.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
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
        /**
         * @param {?} pluralNames
         */
        function DefaultPluralizer(pluralNames) {
            var _this = this;
            this.pluralNames = {};
            // merge each plural names object
            if (pluralNames) {
                pluralNames.forEach(( /**
                 * @param {?} pn
                 * @return {?}
                 */function (pn) { return _this.registerPluralNames(pn); }));
            }
        }
        /**
         * Pluralize a singular name using common English language pluralization rules
         * Examples: "company" -> "companies", "employee" -> "employees", "tax" -> "taxes"
         * @param {?} name
         * @return {?}
         */
        DefaultPluralizer.prototype.pluralize = function (name) {
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
         * @param {?} pluralNames {EntityPluralNames} plural names for entity types
         * @return {?}
         */
        DefaultPluralizer.prototype.registerPluralNames = function (pluralNames) {
            this.pluralNames = Object.assign(Object.assign({}, this.pluralNames), (pluralNames || {}));
        };
        return DefaultPluralizer;
    }());
    DefaultPluralizer.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    DefaultPluralizer.ctorParameters = function () { return [
        { type: Array, decorators: [{ type: core.Optional }, { type: core.Inject, args: [PLURAL_NAMES_TOKEN,] }] }
    ]; };
    if (false) {
        /** @type {?} */
        DefaultPluralizer.prototype.pluralNames;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/utils/guid-fns.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
      Client-side id-generators

      These GUID utility functions are not used by @ngrx/data itself at this time.
      They are included as candidates for generating persistable correlation ids if that becomes desirable.
      They are also safe for generating unique entity ids on the client.

      Note they produce 32-character hexadecimal UUID strings,
      not the 128-bit representation found in server-side languages and databases.

      These utilities are experimental and may be withdrawn or replaced in future.
    */
    /**
     * Creates a Universally Unique Identifier (AKA GUID)
     * @return {?}
     */
    function getUuid() {
        // The original implementation is based on this SO answer:
        // http://stackoverflow.com/a/2117523/200253
        return 'xxxxxxxxxx4xxyxxxxxxxxxxxxxx'.replace(/[xy]/g, ( /**
         * @param {?} c
         * @return {?}
         */function (c) {
            // tslint:disable-next-line:no-bitwise
            /** @type {?} */
            var r = (Math.random() * 16) | 0;
            /** @type {?} */
            var 
            // tslint:disable-next-line:no-bitwise
            v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }));
    }
    /**
     * Alias for getUuid(). Compare with getGuidComb().
     * @return {?}
     */
    function getGuid() {
        return getUuid();
    }
    /**
     * Creates a sortable, pseudo-GUID (globally unique identifier)
     * whose trailing 6 bytes (12 hex digits) are time-based
     * Start either with the given getTime() value, seedTime,
     * or get the current time in ms.
     *
     * @param {?=} seed {number} - optional seed for reproducible time-part
     * @return {?}
     */
    function getGuidComb(seed) {
        // Each new Guid is greater than next if more than 1ms passes
        // See http://thatextramile.be/blog/2009/05/using-the-guidcomb-identifier-strategy
        // Based on breeze.core.getUuid which is based on this StackOverflow answer
        // http://stackoverflow.com/a/2117523/200253
        //
        // Convert time value to hex: n.toString(16)
        // Make sure it is 6 bytes long: ('00'+ ...).slice(-12) ... from the rear
        // Replace LAST 6 bytes (12 hex digits) of regular Guid (that's where they sort in a Db)
        //
        // Play with this in jsFiddle: http://jsfiddle.net/wardbell/qS8aN/
        /** @type {?} */
        var timePart = ('00' + (seed || new Date().getTime()).toString(16)).slice(-12);
        return ('xxxxxxxxxx4xxyxxx'.replace(/[xy]/g, ( /**
         * @param {?} c
         * @return {?}
         */function (c) {
            // tslint:disable:no-bitwise
            /** @type {?} */
            var r = (Math.random() * 16) | 0;
            /** @type {?} */
            var v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        })) + timePart);
    }
    // Sort comparison value that's good enough
    /**
     * @param {?} l
     * @param {?} r
     * @return {?}
     */
    function guidComparer(l, r) {
        /** @type {?} */
        var l_low = l.slice(-12);
        /** @type {?} */
        var r_low = r.slice(-12);
        return l_low !== r_low
            ? l_low < r_low
                ? -1
                : +(l_low !== r_low)
            : l < r
                ? -1
                : +(l !== r);
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/entity-data-without-effects.module.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * @record
     */
    function EntityDataModuleConfig() { }
    if (false) {
        /** @type {?|undefined} */
        EntityDataModuleConfig.prototype.entityMetadata;
        /** @type {?|undefined} */
        EntityDataModuleConfig.prototype.entityCacheMetaReducers;
        /** @type {?|undefined} */
        EntityDataModuleConfig.prototype.entityCollectionMetaReducers;
        /** @type {?|undefined} */
        EntityDataModuleConfig.prototype.initialEntityCacheState;
        /** @type {?|undefined} */
        EntityDataModuleConfig.prototype.pluralNames;
    }
    var ɵ0 = ENTITY_CACHE_NAME;
    /**
     * Module without effects or dataservices which means no HTTP calls
     * This module helpful for internal testing.
     * Also helpful for apps that handle server access on their own and
     * therefore opt-out of \@ngrx/effects for entities
     */
    var EntityDataModuleWithoutEffects = /** @class */ (function () {
        /**
         * @param {?} reducerManager
         * @param {?} entityCacheReducerFactory
         * @param {?} injector
         * @param {?} entityCacheName
         * @param {?} initialState
         * @param {?} metaReducers
         */
        function EntityDataModuleWithoutEffects(reducerManager, entityCacheReducerFactory, injector, entityCacheName, initialState, metaReducers) {
            this.reducerManager = reducerManager;
            this.injector = injector;
            this.entityCacheName = entityCacheName;
            this.initialState = initialState;
            this.metaReducers = metaReducers;
            // Add the @ngrx/data feature to the Store's features
            // as Store.forFeature does for StoreFeatureModule
            /** @type {?} */
            var key = entityCacheName || ENTITY_CACHE_NAME;
            initialState =
                typeof initialState === 'function' ? initialState() : initialState;
            /** @type {?} */
            var reducers = (metaReducers || []).map(( /**
             * @param {?} mr
             * @return {?}
             */function (mr) {
                return mr instanceof core.InjectionToken ? injector.get(mr) : mr;
            }));
            this.entityCacheFeature = {
                key: key,
                reducers: entityCacheReducerFactory.create(),
                reducerFactory: store.combineReducers,
                initialState: initialState || {},
                metaReducers: reducers,
            };
            reducerManager.addFeature(this.entityCacheFeature);
        }
        /**
         * @param {?} config
         * @return {?}
         */
        EntityDataModuleWithoutEffects.forRoot = function (config) {
            return {
                ngModule: EntityDataModuleWithoutEffects,
                providers: [
                    {
                        provide: ENTITY_CACHE_META_REDUCERS,
                        useValue: config.entityCacheMetaReducers
                            ? config.entityCacheMetaReducers
                            : [],
                    },
                    {
                        provide: ENTITY_COLLECTION_META_REDUCERS,
                        useValue: config.entityCollectionMetaReducers
                            ? config.entityCollectionMetaReducers
                            : [],
                    },
                    {
                        provide: PLURAL_NAMES_TOKEN,
                        multi: true,
                        useValue: config.pluralNames ? config.pluralNames : {},
                    },
                ],
            };
        };
        /**
         * @return {?}
         */
        EntityDataModuleWithoutEffects.prototype.ngOnDestroy = function () {
            this.reducerManager.removeFeature(this.entityCacheFeature);
        };
        return EntityDataModuleWithoutEffects;
    }());
    EntityDataModuleWithoutEffects.decorators = [
        { type: core.NgModule, args: [{
                    imports: [
                        store.StoreModule,
                    ],
                    providers: [
                        CorrelationIdGenerator,
                        EntityDispatcherDefaultOptions,
                        EntityActionFactory,
                        EntityCacheDispatcher,
                        EntityCacheReducerFactory,
                        entityCacheSelectorProvider,
                        EntityCollectionCreator,
                        EntityCollectionReducerFactory,
                        EntityCollectionReducerMethodsFactory,
                        EntityCollectionReducerRegistry,
                        EntityCollectionServiceElementsFactory,
                        EntityCollectionServiceFactory,
                        EntityDefinitionService,
                        EntityDispatcherFactory,
                        EntitySelectorsFactory,
                        EntitySelectors$Factory,
                        EntityServicesElements,
                        { provide: ENTITY_CACHE_NAME_TOKEN, useValue: ɵ0 },
                        { provide: EntityServices, useClass: EntityServicesBase },
                        { provide: Logger, useClass: DefaultLogger },
                    ],
                },] }
    ];
    /** @nocollapse */
    EntityDataModuleWithoutEffects.ctorParameters = function () { return [
        { type: store.ReducerManager },
        { type: EntityCacheReducerFactory },
        { type: core.Injector },
        { type: String, decorators: [{ type: core.Optional }, { type: core.Inject, args: [ENTITY_CACHE_NAME_TOKEN,] }] },
        { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [INITIAL_ENTITY_CACHE_STATE,] }] },
        { type: Array, decorators: [{ type: core.Optional }, { type: core.Inject, args: [ENTITY_CACHE_META_REDUCERS,] }] }
    ]; };
    if (false) {
        /**
         * @type {?}
         * @private
         */
        EntityDataModuleWithoutEffects.prototype.entityCacheFeature;
        /**
         * @type {?}
         * @private
         */
        EntityDataModuleWithoutEffects.prototype.reducerManager;
        /**
         * @type {?}
         * @private
         */
        EntityDataModuleWithoutEffects.prototype.injector;
        /**
         * @type {?}
         * @private
         */
        EntityDataModuleWithoutEffects.prototype.entityCacheName;
        /**
         * @type {?}
         * @private
         */
        EntityDataModuleWithoutEffects.prototype.initialState;
        /**
         * @type {?}
         * @private
         */
        EntityDataModuleWithoutEffects.prototype.metaReducers;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/entity-data.module.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * entity-data main module includes effects and HTTP data services
     * Configure with `forRoot`.
     * No `forFeature` yet.
     */
    var EntityDataModule = /** @class */ (function () {
        /**
         * @param {?} effectSources
         * @param {?} entityCacheEffects
         * @param {?} entityEffects
         */
        function EntityDataModule(effectSources, entityCacheEffects, entityEffects) {
            this.effectSources = effectSources;
            // We can't use `forFeature()` because, if we did, the developer could not
            // replace the entity-data `EntityEffects` with a custom alternative.
            // Replacing that class is an extensibility point we need.
            //
            // The FEATURE_EFFECTS token is not exposed, so can't use that technique.
            // Warning: this alternative approach relies on an undocumented API
            // to add effect directly rather than through `forFeature()`.
            // The danger is that EffectsModule.forFeature evolves and we no longer perform a crucial step.
            this.addEffects(entityCacheEffects);
            this.addEffects(entityEffects);
        }
        /**
         * @param {?} config
         * @return {?}
         */
        EntityDataModule.forRoot = function (config) {
            return {
                ngModule: EntityDataModule,
                providers: [
                    // TODO: Moved these effects classes up to EntityDataModule itself
                    // Remove this comment if that was a mistake.
                    // EntityCacheEffects,
                    // EntityEffects,
                    {
                        provide: ENTITY_METADATA_TOKEN,
                        multi: true,
                        useValue: config.entityMetadata ? config.entityMetadata : [],
                    },
                    {
                        provide: ENTITY_CACHE_META_REDUCERS,
                        useValue: config.entityCacheMetaReducers
                            ? config.entityCacheMetaReducers
                            : [],
                    },
                    {
                        provide: ENTITY_COLLECTION_META_REDUCERS,
                        useValue: config.entityCollectionMetaReducers
                            ? config.entityCollectionMetaReducers
                            : [],
                    },
                    {
                        provide: PLURAL_NAMES_TOKEN,
                        multi: true,
                        useValue: config.pluralNames ? config.pluralNames : {},
                    },
                ],
            };
        };
        /**
         * Add another class instance that contains effects.
         * @param {?} effectSourceInstance a class instance that implements effects.
         * Warning: undocumented \@ngrx/effects API
         * @return {?}
         */
        EntityDataModule.prototype.addEffects = function (effectSourceInstance) {
            this.effectSources.addEffects(effectSourceInstance);
        };
        return EntityDataModule;
    }());
    EntityDataModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [
                        EntityDataModuleWithoutEffects,
                        effects.EffectsModule,
                    ],
                    providers: [
                        DefaultDataServiceFactory,
                        EntityCacheDataService,
                        EntityDataService,
                        EntityCacheEffects,
                        EntityEffects,
                        { provide: HttpUrlGenerator, useClass: DefaultHttpUrlGenerator },
                        {
                            provide: PersistenceResultHandler,
                            useClass: DefaultPersistenceResultHandler,
                        },
                        { provide: Pluralizer, useClass: DefaultPluralizer },
                    ],
                },] }
    ];
    /** @nocollapse */
    EntityDataModule.ctorParameters = function () { return [
        { type: effects.EffectSources },
        { type: EntityCacheEffects },
        { type: EntityEffects }
    ]; };
    if (false) {
        /**
         * @type {?}
         * @private
         */
        EntityDataModule.prototype.effectSources;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/index.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * Generated from: public_api.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * Generated from: index.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * Generated from: ngrx-data.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    exports.ChangeSetItemFactory = ChangeSetItemFactory;
    exports.ChangeSetOperation = ChangeSetOperation;
    exports.ChangeType = ChangeType;
    exports.ClearCollections = ClearCollections;
    exports.CorrelationIdGenerator = CorrelationIdGenerator;
    exports.DataServiceError = DataServiceError;
    exports.DefaultDataService = DefaultDataService;
    exports.DefaultDataServiceConfig = DefaultDataServiceConfig;
    exports.DefaultDataServiceFactory = DefaultDataServiceFactory;
    exports.DefaultHttpUrlGenerator = DefaultHttpUrlGenerator;
    exports.DefaultLogger = DefaultLogger;
    exports.DefaultPersistenceResultHandler = DefaultPersistenceResultHandler;
    exports.DefaultPluralizer = DefaultPluralizer;
    exports.ENTITY_CACHE_META_REDUCERS = ENTITY_CACHE_META_REDUCERS;
    exports.ENTITY_CACHE_NAME = ENTITY_CACHE_NAME;
    exports.ENTITY_CACHE_NAME_TOKEN = ENTITY_CACHE_NAME_TOKEN;
    exports.ENTITY_CACHE_SELECTOR_TOKEN = ENTITY_CACHE_SELECTOR_TOKEN;
    exports.ENTITY_COLLECTION_META_REDUCERS = ENTITY_COLLECTION_META_REDUCERS;
    exports.ENTITY_METADATA_TOKEN = ENTITY_METADATA_TOKEN;
    exports.EntityActionFactory = EntityActionFactory;
    exports.EntityActionGuard = EntityActionGuard;
    exports.EntityCacheAction = EntityCacheAction;
    exports.EntityCacheDataService = EntityCacheDataService;
    exports.EntityCacheDispatcher = EntityCacheDispatcher;
    exports.EntityCacheEffects = EntityCacheEffects;
    exports.EntityCacheReducerFactory = EntityCacheReducerFactory;
    exports.EntityChangeTrackerBase = EntityChangeTrackerBase;
    exports.EntityCollectionCreator = EntityCollectionCreator;
    exports.EntityCollectionReducerFactory = EntityCollectionReducerFactory;
    exports.EntityCollectionReducerMethods = EntityCollectionReducerMethods;
    exports.EntityCollectionReducerMethodsFactory = EntityCollectionReducerMethodsFactory;
    exports.EntityCollectionReducerRegistry = EntityCollectionReducerRegistry;
    exports.EntityCollectionServiceBase = EntityCollectionServiceBase;
    exports.EntityCollectionServiceElementsFactory = EntityCollectionServiceElementsFactory;
    exports.EntityCollectionServiceFactory = EntityCollectionServiceFactory;
    exports.EntityDataModule = EntityDataModule;
    exports.EntityDataModuleWithoutEffects = EntityDataModuleWithoutEffects;
    exports.EntityDataService = EntityDataService;
    exports.EntityDefinitionService = EntityDefinitionService;
    exports.EntityDispatcherBase = EntityDispatcherBase;
    exports.EntityDispatcherDefaultOptions = EntityDispatcherDefaultOptions;
    exports.EntityDispatcherFactory = EntityDispatcherFactory;
    exports.EntityEffects = EntityEffects;
    exports.EntityHttpResourceUrls = EntityHttpResourceUrls;
    exports.EntityOp = EntityOp;
    exports.EntitySelectors$Factory = EntitySelectors$Factory;
    exports.EntitySelectorsFactory = EntitySelectorsFactory;
    exports.EntityServices = EntityServices;
    exports.EntityServicesBase = EntityServicesBase;
    exports.EntityServicesElements = EntityServicesElements;
    exports.HttpUrlGenerator = HttpUrlGenerator;
    exports.INITIAL_ENTITY_CACHE_STATE = INITIAL_ENTITY_CACHE_STATE;
    exports.LoadCollections = LoadCollections;
    exports.Logger = Logger;
    exports.MergeQuerySet = MergeQuerySet;
    exports.MergeStrategy = MergeStrategy;
    exports.OP_ERROR = OP_ERROR;
    exports.OP_SUCCESS = OP_SUCCESS;
    exports.PLURAL_NAMES_TOKEN = PLURAL_NAMES_TOKEN;
    exports.PersistanceCanceled = PersistanceCanceled;
    exports.PersistenceResultHandler = PersistenceResultHandler;
    exports.Pluralizer = Pluralizer;
    exports.PropsFilterFnFactory = PropsFilterFnFactory;
    exports.SaveEntities = SaveEntities;
    exports.SaveEntitiesCancel = SaveEntitiesCancel;
    exports.SaveEntitiesCanceled = SaveEntitiesCanceled;
    exports.SaveEntitiesError = SaveEntitiesError;
    exports.SaveEntitiesSuccess = SaveEntitiesSuccess;
    exports.SetEntityCache = SetEntityCache;
    exports.changeSetItemFactory = changeSetItemFactory;
    exports.createEmptyEntityCollection = createEmptyEntityCollection;
    exports.createEntityCacheSelector = createEntityCacheSelector;
    exports.createEntityDefinition = createEntityDefinition;
    exports.defaultSelectId = defaultSelectId;
    exports.entityCacheSelectorProvider = entityCacheSelectorProvider;
    exports.excludeEmptyChangeSetItems = excludeEmptyChangeSetItems;
    exports.flattenArgs = flattenArgs;
    exports.getGuid = getGuid;
    exports.getGuidComb = getGuidComb;
    exports.guidComparer = guidComparer;
    exports.makeErrorOp = makeErrorOp;
    exports.makeSuccessOp = makeSuccessOp;
    exports.normalizeRoot = normalizeRoot;
    exports.ofEntityOp = ofEntityOp;
    exports.ofEntityType = ofEntityType;
    exports.persistOps = persistOps;
    exports.toUpdateFactory = toUpdateFactory;
    exports.ɵa = ENTITY_EFFECTS_SCHEDULER;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngrx-data.umd.js.map
