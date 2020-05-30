"use strict";
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
exports.__esModule = true;
var schematics_1 = require("@angular-devkit/schematics");
var tasks_1 = require("@angular-devkit/schematics/tasks");
var schematics_core_1 = require("@ngrx/data/schematics-core");
var ts = require("typescript");
function addNgRxDataToPackageJson() {
    return function (host, context) {
        schematics_core_1.addPackageToPackageJson(host, 'dependencies', '@ngrx/data', schematics_core_1.platformVersion);
        context.addTask(new tasks_1.NodePackageInstallTask());
        return host;
    };
}
function addEntityDataToNgModule(options) {
    return function (host) {
        throwIfModuleNotSpecified(host, options.module);
        var modulePath = options.module;
        var text = host.read(modulePath).toString();
        var source = ts.createSourceFile(modulePath, text, ts.ScriptTarget.Latest, true);
        var moduleToImport = options.effects
            ? 'EntityDataModule'
            : 'EntityDataModuleWithoutEffects';
        var effectsModuleImport = schematics_core_1.insertImport(source, modulePath, moduleToImport, '@ngrx/data');
        var _a = __read(schematics_core_1.addImportToModule(source, modulePath, options.entityConfig
            ? [moduleToImport, 'forRoot(entityConfig)'].join('.')
            : moduleToImport, ''), 1), dateEntityNgModuleImport = _a[0];
        var changes = [effectsModuleImport, dateEntityNgModuleImport];
        if (options.entityConfig) {
            var entityConfigImport = schematics_core_1.insertImport(source, modulePath, 'entityConfig', './entity-metadata');
            changes.push(entityConfigImport);
        }
        schematics_core_1.commitChanges(host, source.fileName, changes);
        return host;
    };
}
var renames = {
    NgrxDataModule: 'EntityDataModule',
    NgrxDataModuleWithoutEffects: 'EntityDataModuleWithoutEffects',
    NgrxDataModuleConfig: 'EntityDataModuleConfig'
};
function removeAngularNgRxDataFromPackageJson() {
    return function (host) {
        if (host.exists('package.json')) {
            var sourceText = host.read('package.json').toString('utf-8');
            var json = JSON.parse(sourceText);
            if (json['dependencies'] && json['dependencies']['ngrx-data']) {
                delete json['dependencies']['ngrx-data'];
            }
            host.overwrite('package.json', JSON.stringify(json, null, 2));
        }
        return host;
    };
}
function renameNgrxDataModule() {
    return function (host) {
        schematics_core_1.visitTSSourceFiles(host, function (sourceFile) {
            var ngrxDataImports = sourceFile.statements
                .filter(ts.isImportDeclaration)
                .filter(function (_a) {
                var moduleSpecifier = _a.moduleSpecifier;
                return moduleSpecifier.getText(sourceFile) === "'ngrx-data'";
            });
            if (ngrxDataImports.length === 0) {
                return;
            }
            var changes = __spread(findNgrxDataImports(sourceFile, ngrxDataImports), findNgrxDataImportDeclarations(sourceFile, ngrxDataImports), findNgrxDataReplacements(sourceFile));
            schematics_core_1.commitChanges(host, sourceFile.fileName, changes);
        });
    };
}
function findNgrxDataImports(sourceFile, imports) {
    var changes = imports.map(function (specifier) {
        return schematics_core_1.createReplaceChange(sourceFile, specifier.moduleSpecifier, "'ngrx-data'", "'@ngrx/data'");
    });
    return changes;
}
function findNgrxDataImportDeclarations(sourceFile, imports) {
    var changes = imports
        .map(function (p) { return p.importClause.namedBindings.elements; })
        .reduce(function (imports, curr) { return imports.concat(curr); }, [])
        .map(function (specifier) {
        if (!ts.isImportSpecifier(specifier)) {
            return { hit: false };
        }
        var ngrxDataImports = Object.keys(renames);
        if (ngrxDataImports.includes(specifier.name.text)) {
            return { hit: true, specifier: specifier, text: specifier.name.text };
        }
        // if import is renamed
        if (specifier.propertyName &&
            ngrxDataImports.includes(specifier.propertyName.text)) {
            return { hit: true, specifier: specifier, text: specifier.propertyName.text };
        }
        return { hit: false };
    })
        .filter(function (_a) {
        var hit = _a.hit;
        return hit;
    })
        .map(function (_a) {
        var specifier = _a.specifier, text = _a.text;
        return schematics_core_1.createReplaceChange(sourceFile, specifier, text, renames[text]);
    });
    return changes;
}
function findNgrxDataReplacements(sourceFile) {
    var renameKeys = Object.keys(renames);
    var changes = [];
    ts.forEachChild(sourceFile, function (node) { return find(node, changes); });
    return changes;
    function find(node, changes) {
        var change = undefined;
        if (ts.isPropertyAssignment(node) &&
            renameKeys.includes(node.initializer.getText(sourceFile))) {
            change = {
                node: node.initializer,
                text: node.initializer.getText(sourceFile)
            };
        }
        if (ts.isPropertyAccessExpression(node) &&
            renameKeys.includes(node.expression.getText(sourceFile))) {
            change = {
                node: node.expression,
                text: node.expression.getText(sourceFile)
            };
        }
        if (ts.isVariableDeclaration(node) &&
            node.type &&
            renameKeys.includes(node.type.getText(sourceFile))) {
            change = {
                node: node.type,
                text: node.type.getText(sourceFile)
            };
        }
        if (change) {
            changes.push(schematics_core_1.createReplaceChange(sourceFile, change.node, change.text, renames[change.text]));
        }
        ts.forEachChild(node, function (childNode) { return find(childNode, changes); });
    }
}
function throwIfModuleNotSpecified(host, module) {
    if (!module) {
        throw new Error('Module not specified');
    }
    if (!host.exists(module)) {
        throw new Error('Specified module does not exist');
    }
    var text = host.read(module);
    if (text === null) {
        throw new schematics_1.SchematicsException("File " + module + " does not exist.");
    }
}
function createEntityConfigFile(options, path) {
    return schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), [
        schematics_1.applyTemplates(__assign(__assign({}, schematics_core_1.stringUtils), options)),
        schematics_1.move(path),
    ]));
}
function default_1(options) {
    return function (host, context) {
        options.name = '';
        options.path = schematics_core_1.getProjectPath(host, options);
        options.effects = options.effects === undefined ? true : options.effects;
        options.module = options.module
            ? schematics_core_1.findModuleFromOptions(host, options)
            : options.module;
        var parsedPath = schematics_core_1.parseName(options.path, '');
        options.path = parsedPath.path;
        return schematics_1.chain([
            options && options.skipPackageJson ? schematics_1.noop() : addNgRxDataToPackageJson(),
            options.migrateNgrxData
                ? schematics_1.chain([
                    removeAngularNgRxDataFromPackageJson(),
                    renameNgrxDataModule(),
                ])
                : addEntityDataToNgModule(options),
            options.entityConfig
                ? createEntityConfigFile(options, parsedPath.path)
                : schematics_1.noop(),
        ])(host, context);
    };
}
exports["default"] = default_1;
//# sourceMappingURL=index.js.map