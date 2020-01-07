(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/schematics/ng-add/index", ["require", "exports", "@angular-devkit/schematics", "@angular-devkit/schematics/tasks", "@ngrx/data/schematics-core", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular-devkit/schematics");
    const tasks_1 = require("@angular-devkit/schematics/tasks");
    const schematics_core_1 = require("@ngrx/data/schematics-core");
    const ts = require("typescript");
    function addNgRxDataToPackageJson() {
        return (host, context) => {
            schematics_core_1.addPackageToPackageJson(host, 'dependencies', '@ngrx/data', schematics_core_1.platformVersion);
            context.addTask(new tasks_1.NodePackageInstallTask());
            return host;
        };
    }
    function addEntityDataToNgModule(options) {
        return (host) => {
            throwIfModuleNotSpecified(host, options.module);
            const modulePath = options.module;
            const text = host.read(modulePath).toString();
            const source = ts.createSourceFile(modulePath, text, ts.ScriptTarget.Latest, true);
            const moduleToImport = options.effects
                ? 'EntityDataModule'
                : 'EntityDataModuleWithoutEffects';
            const effectsModuleImport = schematics_core_1.insertImport(source, modulePath, moduleToImport, '@ngrx/data');
            const [dateEntityNgModuleImport] = schematics_core_1.addImportToModule(source, modulePath, options.entityConfig
                ? [moduleToImport, 'forRoot(entityConfig)'].join('.')
                : moduleToImport, '');
            const changes = [effectsModuleImport, dateEntityNgModuleImport];
            if (options.entityConfig) {
                const entityConfigImport = schematics_core_1.insertImport(source, modulePath, 'entityConfig', './entity-metadata');
                changes.push(entityConfigImport);
            }
            schematics_core_1.commitChanges(host, source.fileName, changes);
            return host;
        };
    }
    const renames = {
        NgrxDataModule: 'EntityDataModule',
        NgrxDataModuleWithoutEffects: 'EntityDataModuleWithoutEffects',
        NgrxDataModuleConfig: 'EntityDataModuleConfig',
    };
    function removeAngularNgRxDataFromPackageJson() {
        return (host) => {
            if (host.exists('package.json')) {
                const sourceText = host.read('package.json').toString('utf-8');
                const json = JSON.parse(sourceText);
                if (json['dependencies'] && json['dependencies']['ngrx-data']) {
                    delete json['dependencies']['ngrx-data'];
                }
                host.overwrite('package.json', JSON.stringify(json, null, 2));
            }
            return host;
        };
    }
    function renameNgrxDataModule() {
        return (host) => {
            schematics_core_1.visitTSSourceFiles(host, sourceFile => {
                const ngrxDataImports = sourceFile.statements
                    .filter(ts.isImportDeclaration)
                    .filter(({ moduleSpecifier }) => moduleSpecifier.getText(sourceFile) === "'ngrx-data'");
                if (ngrxDataImports.length === 0) {
                    return;
                }
                const changes = [
                    ...findNgrxDataImports(sourceFile, ngrxDataImports),
                    ...findNgrxDataImportDeclarations(sourceFile, ngrxDataImports),
                    ...findNgrxDataReplacements(sourceFile),
                ];
                schematics_core_1.commitChanges(host, sourceFile.fileName, changes);
            });
        };
    }
    function findNgrxDataImports(sourceFile, imports) {
        const changes = imports.map(specifier => schematics_core_1.createReplaceChange(sourceFile, specifier.moduleSpecifier, "'ngrx-data'", "'@ngrx/data'"));
        return changes;
    }
    function findNgrxDataImportDeclarations(sourceFile, imports) {
        const changes = imports
            .map(p => p.importClause.namedBindings.elements)
            .reduce((imports, curr) => imports.concat(curr), [])
            .map(specifier => {
            if (!ts.isImportSpecifier(specifier)) {
                return { hit: false };
            }
            const ngrxDataImports = Object.keys(renames);
            if (ngrxDataImports.includes(specifier.name.text)) {
                return { hit: true, specifier, text: specifier.name.text };
            }
            // if import is renamed
            if (specifier.propertyName &&
                ngrxDataImports.includes(specifier.propertyName.text)) {
                return { hit: true, specifier, text: specifier.propertyName.text };
            }
            return { hit: false };
        })
            .filter(({ hit }) => hit)
            .map(({ specifier, text }) => schematics_core_1.createReplaceChange(sourceFile, specifier, text, renames[text]));
        return changes;
    }
    function findNgrxDataReplacements(sourceFile) {
        const renameKeys = Object.keys(renames);
        let changes = [];
        ts.forEachChild(sourceFile, node => find(node, changes));
        return changes;
        function find(node, changes) {
            let change = undefined;
            if (ts.isPropertyAssignment(node) &&
                renameKeys.includes(node.initializer.getText(sourceFile))) {
                change = {
                    node: node.initializer,
                    text: node.initializer.getText(sourceFile),
                };
            }
            if (ts.isPropertyAccessExpression(node) &&
                renameKeys.includes(node.expression.getText(sourceFile))) {
                change = {
                    node: node.expression,
                    text: node.expression.getText(sourceFile),
                };
            }
            if (ts.isVariableDeclaration(node) &&
                node.type &&
                renameKeys.includes(node.type.getText(sourceFile))) {
                change = {
                    node: node.type,
                    text: node.type.getText(sourceFile),
                };
            }
            if (change) {
                changes.push(schematics_core_1.createReplaceChange(sourceFile, change.node, change.text, renames[change.text]));
            }
            ts.forEachChild(node, childNode => find(childNode, changes));
        }
    }
    function throwIfModuleNotSpecified(host, module) {
        if (!module) {
            throw new Error('Module not specified');
        }
        if (!host.exists(module)) {
            throw new Error('Specified module does not exist');
        }
        const text = host.read(module);
        if (text === null) {
            throw new schematics_1.SchematicsException(`File ${module} does not exist.`);
        }
    }
    function createEntityConfigFile(options, path) {
        return schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), [
            schematics_1.applyTemplates(Object.assign(Object.assign({}, schematics_core_1.stringUtils), options)),
            schematics_1.move(path),
        ]));
    }
    function default_1(options) {
        return (host, context) => {
            options.name = '';
            options.path = schematics_core_1.getProjectPath(host, options);
            options.effects = options.effects === undefined ? true : options.effects;
            options.module = options.module
                ? schematics_core_1.findModuleFromOptions(host, options)
                : options.module;
            const parsedPath = schematics_core_1.parseName(options.path, '');
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
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc2NoZW1hdGljcy9uZy1hZGQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFDQSwyREFZb0M7SUFDcEMsNERBQTBFO0lBQzFFLGdFQWFvQztJQUNwQyxpQ0FBaUM7SUFHakMsU0FBUyx3QkFBd0I7UUFDL0IsT0FBTyxDQUFDLElBQVUsRUFBRSxPQUF5QixFQUFFLEVBQUU7WUFDL0MseUNBQXVCLENBQ3JCLElBQUksRUFDSixjQUFjLEVBQ2QsWUFBWSxFQUNaLGlDQUFlLENBQ2hCLENBQUM7WUFDRixPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksOEJBQXNCLEVBQUUsQ0FBQyxDQUFDO1lBQzlDLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELFNBQVMsdUJBQXVCLENBQUMsT0FBMEI7UUFDekQsT0FBTyxDQUFDLElBQVUsRUFBRSxFQUFFO1lBQ3BCLHlCQUF5QixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFaEQsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU8sQ0FBQztZQUNuQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRS9DLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FDaEMsVUFBVSxFQUNWLElBQUksRUFDSixFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFDdEIsSUFBSSxDQUNMLENBQUM7WUFFRixNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsT0FBTztnQkFDcEMsQ0FBQyxDQUFDLGtCQUFrQjtnQkFDcEIsQ0FBQyxDQUFDLGdDQUFnQyxDQUFDO1lBRXJDLE1BQU0sbUJBQW1CLEdBQUcsOEJBQVksQ0FDdEMsTUFBTSxFQUNOLFVB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QUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztZQUUvQixPQUFPLGtCQUFLLENBQUM7Z0JBQ1gsT0FBTyxJQUFJLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGlCQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsd0JBQXdCLEVBQUU7Z0JBQ3hFLE9BQU8sQ0FBQyxlQUFlO29CQUNyQixDQUFDLENBQUMsa0JBQUssQ0FBQzt3QkFDSixvQ0FBb0MsRUFBRTt3QkFDdEMsb0JBQW9CLEVBQUU7cUJBQ3ZCLENBQUM7b0JBQ0osQ0FBQyxDQUFDLHVCQUF1QixDQUFDLE9BQU8sQ0FBQztnQkFDcEMsT0FBTyxDQUFDLFlBQVk7b0JBQ2xCLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQztvQkFDbEQsQ0FBQyxDQUFDLGlCQUFJLEVBQUU7YUFDWCxDQUFDLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQztJQUNKLENBQUM7SUF6QkQsNEJBeUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGF0aCB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7XG4gIGFwcGx5LFxuICBhcHBseVRlbXBsYXRlcyxcbiAgY2hhaW4sXG4gIG1lcmdlV2l0aCxcbiAgbW92ZSxcbiAgbm9vcCxcbiAgUnVsZSxcbiAgU2NoZW1hdGljQ29udGV4dCxcbiAgU2NoZW1hdGljc0V4Y2VwdGlvbixcbiAgVHJlZSxcbiAgdXJsLFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQgeyBOb2RlUGFja2FnZUluc3RhbGxUYXNrIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdGFza3MnO1xuaW1wb3J0IHtcbiAgYWRkSW1wb3J0VG9Nb2R1bGUsXG4gIGFkZFBhY2thZ2VUb1BhY2thZ2VKc29uLFxuICBjb21taXRDaGFuZ2VzLFxuICBjcmVhdGVSZXBsYWNlQ2hhbmdlLFxuICBmaW5kTW9kdWxlRnJvbU9wdGlvbnMsXG4gIGdldFByb2plY3RQYXRoLFxuICBpbnNlcnRJbXBvcnQsXG4gIHBhcnNlTmFtZSxcbiAgcGxhdGZvcm1WZXJzaW9uLFxuICBSZXBsYWNlQ2hhbmdlLFxuICBzdHJpbmdVdGlscyxcbiAgdmlzaXRUU1NvdXJjZUZpbGVzLFxufSBmcm9tICdAbmdyeC9kYXRhL3NjaGVtYXRpY3MtY29yZSc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7IFNjaGVtYSBhcyBFbnRpdHlEYXRhT3B0aW9ucyB9IGZyb20gJy4vc2NoZW1hJztcblxuZnVuY3Rpb24gYWRkTmdSeERhdGFUb1BhY2thZ2VKc29uKCkge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBhZGRQYWNrYWdlVG9QYWNrYWdlSnNvbihcbiAgICAgIGhvc3QsXG4gICAgICAnZGVwZW5kZW5jaWVzJyxcbiAgICAgICdAbmdyeC9kYXRhJyxcbiAgICAgIHBsYXRmb3JtVmVyc2lvblxuICAgICk7XG4gICAgY29udGV4dC5hZGRUYXNrKG5ldyBOb2RlUGFja2FnZUluc3RhbGxUYXNrKCkpO1xuICAgIHJldHVybiBob3N0O1xuICB9O1xufVxuXG5mdW5jdGlvbiBhZGRFbnRpdHlEYXRhVG9OZ01vZHVsZShvcHRpb25zOiBFbnRpdHlEYXRhT3B0aW9ucyk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUpID0+IHtcbiAgICB0aHJvd0lmTW9kdWxlTm90U3BlY2lmaWVkKGhvc3QsIG9wdGlvbnMubW9kdWxlKTtcblxuICAgIGNvbnN0IG1vZHVsZVBhdGggPSBvcHRpb25zLm1vZHVsZSE7XG4gICAgY29uc3QgdGV4dCA9IGhvc3QucmVhZChtb2R1bGVQYXRoKSEudG9TdHJpbmcoKTtcblxuICAgIGNvbnN0IHNvdXJjZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoXG4gICAgICBtb2R1bGVQYXRoLFxuICAgICAgdGV4dCxcbiAgICAgIHRzLlNjcmlwdFRhcmdldC5MYXRlc3QsXG4gICAgICB0cnVlXG4gICAgKTtcblxuICAgIGNvbnN0IG1vZHVsZVRvSW1wb3J0ID0gb3B0aW9ucy5lZmZlY3RzXG4gICAgICA/ICdFbnRpdHlEYXRhTW9kdWxlJ1xuICAgICAgOiAnRW50aXR5RGF0YU1vZHVsZVdpdGhvdXRFZmZlY3RzJztcblxuICAgIGNvbnN0IGVmZmVjdHNNb2R1bGVJbXBvcnQgPSBpbnNlcnRJbXBvcnQoXG4gICAgICBzb3VyY2UsXG4gICAgICBtb2R1bGVQYXRoLFxuICAgICAgbW9kdWxlVG9JbXBvcnQsXG4gICAgICAnQG5ncngvZGF0YSdcbiAgICApO1xuXG4gICAgY29uc3QgW2RhdGVFbnRpdHlOZ01vZHVsZUltcG9ydF0gPSBhZGRJbXBvcnRUb01vZHVsZShcbiAgICAgIHNvdXJjZSxcbiAgICAgIG1vZHVsZVBhdGgsXG4gICAgICBvcHRpb25zLmVudGl0eUNvbmZpZ1xuICAgICAgICA/IFttb2R1bGVUb0ltcG9ydCwgJ2ZvclJvb3QoZW50aXR5Q29uZmlnKSddLmpvaW4oJy4nKVxuICAgICAgICA6IG1vZHVsZVRvSW1wb3J0LFxuICAgICAgJydcbiAgICApO1xuXG4gICAgY29uc3QgY2hhbmdlcyA9IFtlZmZlY3RzTW9kdWxlSW1wb3J0LCBkYXRlRW50aXR5TmdNb2R1bGVJbXBvcnRdO1xuXG4gICAgaWYgKG9wdGlvbnMuZW50aXR5Q29uZmlnKSB7XG4gICAgICBjb25zdCBlbnRpdHlDb25maWdJbXBvcnQgPSBpbnNlcnRJbXBvcnQoXG4gICAgICAgIHNvdXJjZSxcbiAgICAgICAgbW9kdWxlUGF0aCxcbiAgICAgICAgJ2VudGl0eUNvbmZpZycsXG4gICAgICAgICcuL2VudGl0eS1tZXRhZGF0YSdcbiAgICAgICk7XG4gICAgICBjaGFuZ2VzLnB1c2goZW50aXR5Q29uZmlnSW1wb3J0KTtcbiAgICB9XG5cbiAgICBjb21taXRDaGFuZ2VzKGhvc3QsIHNvdXJjZS5maWxlTmFtZSwgY2hhbmdlcyk7XG5cbiAgICByZXR1cm4gaG9zdDtcbiAgfTtcbn1cblxuY29uc3QgcmVuYW1lcyA9IHtcbiAgTmdyeERhdGFNb2R1bGU6ICdFbnRpdHlEYXRhTW9kdWxlJyxcbiAgTmdyeERhdGFNb2R1bGVXaXRob3V0RWZmZWN0czogJ0VudGl0eURhdGFNb2R1bGVXaXRob3V0RWZmZWN0cycsXG4gIE5ncnhEYXRhTW9kdWxlQ29uZmlnOiAnRW50aXR5RGF0YU1vZHVsZUNvbmZpZycsXG59O1xuXG5mdW5jdGlvbiByZW1vdmVBbmd1bGFyTmdSeERhdGFGcm9tUGFja2FnZUpzb24oKSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGlmIChob3N0LmV4aXN0cygncGFja2FnZS5qc29uJykpIHtcbiAgICAgIGNvbnN0IHNvdXJjZVRleHQgPSBob3N0LnJlYWQoJ3BhY2thZ2UuanNvbicpIS50b1N0cmluZygndXRmLTgnKTtcbiAgICAgIGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKHNvdXJjZVRleHQpO1xuXG4gICAgICBpZiAoanNvblsnZGVwZW5kZW5jaWVzJ10gJiYganNvblsnZGVwZW5kZW5jaWVzJ11bJ25ncngtZGF0YSddKSB7XG4gICAgICAgIGRlbGV0ZSBqc29uWydkZXBlbmRlbmNpZXMnXVsnbmdyeC1kYXRhJ107XG4gICAgICB9XG5cbiAgICAgIGhvc3Qub3ZlcndyaXRlKCdwYWNrYWdlLmpzb24nLCBKU09OLnN0cmluZ2lmeShqc29uLCBudWxsLCAyKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhvc3Q7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlbmFtZU5ncnhEYXRhTW9kdWxlKCkge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUpID0+IHtcbiAgICB2aXNpdFRTU291cmNlRmlsZXMoaG9zdCwgc291cmNlRmlsZSA9PiB7XG4gICAgICBjb25zdCBuZ3J4RGF0YUltcG9ydHMgPSBzb3VyY2VGaWxlLnN0YXRlbWVudHNcbiAgICAgICAgLmZpbHRlcih0cy5pc0ltcG9ydERlY2xhcmF0aW9uKVxuICAgICAgICAuZmlsdGVyKFxuICAgICAgICAgICh7IG1vZHVsZVNwZWNpZmllciB9KSA9PlxuICAgICAgICAgICAgbW9kdWxlU3BlY2lmaWVyLmdldFRleHQoc291cmNlRmlsZSkgPT09IFwiJ25ncngtZGF0YSdcIlxuICAgICAgICApO1xuXG4gICAgICBpZiAobmdyeERhdGFJbXBvcnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNoYW5nZXMgPSBbXG4gICAgICAgIC4uLmZpbmROZ3J4RGF0YUltcG9ydHMoc291cmNlRmlsZSwgbmdyeERhdGFJbXBvcnRzKSxcbiAgICAgICAgLi4uZmluZE5ncnhEYXRhSW1wb3J0RGVjbGFyYXRpb25zKHNvdXJjZUZpbGUsIG5ncnhEYXRhSW1wb3J0cyksXG4gICAgICAgIC4uLmZpbmROZ3J4RGF0YVJlcGxhY2VtZW50cyhzb3VyY2VGaWxlKSxcbiAgICAgIF07XG5cbiAgICAgIGNvbW1pdENoYW5nZXMoaG9zdCwgc291cmNlRmlsZS5maWxlTmFtZSwgY2hhbmdlcyk7XG4gICAgfSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGZpbmROZ3J4RGF0YUltcG9ydHMoXG4gIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsXG4gIGltcG9ydHM6IHRzLkltcG9ydERlY2xhcmF0aW9uW11cbikge1xuICBjb25zdCBjaGFuZ2VzID0gaW1wb3J0cy5tYXAoc3BlY2lmaWVyID0+XG4gICAgY3JlYXRlUmVwbGFjZUNoYW5nZShcbiAgICAgIHNvdXJjZUZpbGUsXG4gICAgICBzcGVjaWZpZXIubW9kdWxlU3BlY2lmaWVyLFxuICAgICAgXCInbmdyeC1kYXRhJ1wiLFxuICAgICAgXCInQG5ncngvZGF0YSdcIlxuICAgIClcbiAgKTtcblxuICByZXR1cm4gY2hhbmdlcztcbn1cblxuZnVuY3Rpb24gZmluZE5ncnhEYXRhSW1wb3J0RGVjbGFyYXRpb25zKFxuICBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLFxuICBpbXBvcnRzOiB0cy5JbXBvcnREZWNsYXJhdGlvbltdXG4pIHtcbiAgY29uc3QgY2hhbmdlcyA9IGltcG9ydHNcbiAgICAubWFwKHAgPT4gKHAuaW1wb3J0Q2xhdXNlIS5uYW1lZEJpbmRpbmdzISBhcyB0cy5OYW1lZEltcG9ydHMpLmVsZW1lbnRzKVxuICAgIC5yZWR1Y2UoKGltcG9ydHMsIGN1cnIpID0+IGltcG9ydHMuY29uY2F0KGN1cnIpLCBbXSBhcyB0cy5JbXBvcnRTcGVjaWZpZXJbXSlcbiAgICAubWFwKHNwZWNpZmllciA9PiB7XG4gICAgICBpZiAoIXRzLmlzSW1wb3J0U3BlY2lmaWVyKHNwZWNpZmllcikpIHtcbiAgICAgICAgcmV0dXJuIHsgaGl0OiBmYWxzZSB9O1xuICAgICAgfVxuXG4gICAgICBjb25zdCBuZ3J4RGF0YUltcG9ydHMgPSBPYmplY3Qua2V5cyhyZW5hbWVzKTtcbiAgICAgIGlmIChuZ3J4RGF0YUltcG9ydHMuaW5jbHVkZXMoc3BlY2lmaWVyLm5hbWUudGV4dCkpIHtcbiAgICAgICAgcmV0dXJuIHsgaGl0OiB0cnVlLCBzcGVjaWZpZXIsIHRleHQ6IHNwZWNpZmllci5uYW1lLnRleHQgfTtcbiAgICAgIH1cblxuICAgICAgLy8gaWYgaW1wb3J0IGlzIHJlbmFtZWRcbiAgICAgIGlmIChcbiAgICAgICAgc3BlY2lmaWVyLnByb3BlcnR5TmFtZSAmJlxuICAgICAgICBuZ3J4RGF0YUltcG9ydHMuaW5jbHVkZXMoc3BlY2lmaWVyLnByb3BlcnR5TmFtZS50ZXh0KVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiB7IGhpdDogdHJ1ZSwgc3BlY2lmaWVyLCB0ZXh0OiBzcGVjaWZpZXIucHJvcGVydHlOYW1lLnRleHQgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHsgaGl0OiBmYWxzZSB9O1xuICAgIH0pXG4gICAgLmZpbHRlcigoeyBoaXQgfSkgPT4gaGl0KVxuICAgIC5tYXAoKHsgc3BlY2lmaWVyLCB0ZXh0IH0pID0+XG4gICAgICBjcmVhdGVSZXBsYWNlQ2hhbmdlKFxuICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICBzcGVjaWZpZXIhLFxuICAgICAgICB0ZXh0ISxcbiAgICAgICAgKHJlbmFtZXMgYXMgYW55KVt0ZXh0IV1cbiAgICAgIClcbiAgICApO1xuXG4gIHJldHVybiBjaGFuZ2VzO1xufVxuXG5mdW5jdGlvbiBmaW5kTmdyeERhdGFSZXBsYWNlbWVudHMoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSkge1xuICBjb25zdCByZW5hbWVLZXlzID0gT2JqZWN0LmtleXMocmVuYW1lcyk7XG4gIGxldCBjaGFuZ2VzOiBSZXBsYWNlQ2hhbmdlW10gPSBbXTtcbiAgdHMuZm9yRWFjaENoaWxkKHNvdXJjZUZpbGUsIG5vZGUgPT4gZmluZChub2RlLCBjaGFuZ2VzKSk7XG4gIHJldHVybiBjaGFuZ2VzO1xuXG4gIGZ1bmN0aW9uIGZpbmQobm9kZTogdHMuTm9kZSwgY2hhbmdlczogUmVwbGFjZUNoYW5nZVtdKSB7XG4gICAgbGV0IGNoYW5nZSA9IHVuZGVmaW5lZDtcblxuICAgIGlmIChcbiAgICAgIHRzLmlzUHJvcGVydHlBc3NpZ25tZW50KG5vZGUpICYmXG4gICAgICByZW5hbWVLZXlzLmluY2x1ZGVzKG5vZGUuaW5pdGlhbGl6ZXIuZ2V0VGV4dChzb3VyY2VGaWxlKSlcbiAgICApIHtcbiAgICAgIGNoYW5nZSA9IHtcbiAgICAgICAgbm9kZTogbm9kZS5pbml0aWFsaXplcixcbiAgICAgICAgdGV4dDogbm9kZS5pbml0aWFsaXplci5nZXRUZXh0KHNvdXJjZUZpbGUpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICB0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlKSAmJlxuICAgICAgcmVuYW1lS2V5cy5pbmNsdWRlcyhub2RlLmV4cHJlc3Npb24uZ2V0VGV4dChzb3VyY2VGaWxlKSlcbiAgICApIHtcbiAgICAgIGNoYW5nZSA9IHtcbiAgICAgICAgbm9kZTogbm9kZS5leHByZXNzaW9uLFxuICAgICAgICB0ZXh0OiBub2RlLmV4cHJlc3Npb24uZ2V0VGV4dChzb3VyY2VGaWxlKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgdHMuaXNWYXJpYWJsZURlY2xhcmF0aW9uKG5vZGUpICYmXG4gICAgICBub2RlLnR5cGUgJiZcbiAgICAgIHJlbmFtZUtleXMuaW5jbHVkZXMobm9kZS50eXBlLmdldFRleHQoc291cmNlRmlsZSkpXG4gICAgKSB7XG4gICAgICBjaGFuZ2UgPSB7XG4gICAgICAgIG5vZGU6IG5vZGUudHlwZSxcbiAgICAgICAgdGV4dDogbm9kZS50eXBlLmdldFRleHQoc291cmNlRmlsZSksXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgIGNoYW5nZXMucHVzaChcbiAgICAgICAgY3JlYXRlUmVwbGFjZUNoYW5nZShcbiAgICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICAgIGNoYW5nZS5ub2RlLFxuICAgICAgICAgIGNoYW5nZS50ZXh0LFxuICAgICAgICAgIChyZW5hbWVzIGFzIGFueSlbY2hhbmdlLnRleHRdXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdHMuZm9yRWFjaENoaWxkKG5vZGUsIGNoaWxkTm9kZSA9PiBmaW5kKGNoaWxkTm9kZSwgY2hhbmdlcykpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHRocm93SWZNb2R1bGVOb3RTcGVjaWZpZWQoaG9zdDogVHJlZSwgbW9kdWxlPzogc3RyaW5nKSB7XG4gIGlmICghbW9kdWxlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNb2R1bGUgbm90IHNwZWNpZmllZCcpO1xuICB9XG5cbiAgaWYgKCFob3N0LmV4aXN0cyhtb2R1bGUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdTcGVjaWZpZWQgbW9kdWxlIGRvZXMgbm90IGV4aXN0Jyk7XG4gIH1cblxuICBjb25zdCB0ZXh0ID0gaG9zdC5yZWFkKG1vZHVsZSk7XG4gIGlmICh0ZXh0ID09PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYEZpbGUgJHttb2R1bGV9IGRvZXMgbm90IGV4aXN0LmApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVudGl0eUNvbmZpZ0ZpbGUob3B0aW9uczogRW50aXR5RGF0YU9wdGlvbnMsIHBhdGg6IFBhdGgpIHtcbiAgcmV0dXJuIG1lcmdlV2l0aChcbiAgICBhcHBseSh1cmwoJy4vZmlsZXMnKSwgW1xuICAgICAgYXBwbHlUZW1wbGF0ZXMoe1xuICAgICAgICAuLi5zdHJpbmdVdGlscyxcbiAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIH0pLFxuICAgICAgbW92ZShwYXRoKSxcbiAgICBdKVxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvcHRpb25zOiBFbnRpdHlEYXRhT3B0aW9ucyk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICAob3B0aW9ucyBhcyBhbnkpLm5hbWUgPSAnJztcbiAgICBvcHRpb25zLnBhdGggPSBnZXRQcm9qZWN0UGF0aChob3N0LCBvcHRpb25zKTtcbiAgICBvcHRpb25zLmVmZmVjdHMgPSBvcHRpb25zLmVmZmVjdHMgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBvcHRpb25zLmVmZmVjdHM7XG4gICAgb3B0aW9ucy5tb2R1bGUgPSBvcHRpb25zLm1vZHVsZVxuICAgICAgPyBmaW5kTW9kdWxlRnJvbU9wdGlvbnMoaG9zdCwgb3B0aW9ucyBhcyBhbnkpXG4gICAgICA6IG9wdGlvbnMubW9kdWxlO1xuXG4gICAgY29uc3QgcGFyc2VkUGF0aCA9IHBhcnNlTmFtZShvcHRpb25zLnBhdGgsICcnKTtcbiAgICBvcHRpb25zLnBhdGggPSBwYXJzZWRQYXRoLnBhdGg7XG5cbiAgICByZXR1cm4gY2hhaW4oW1xuICAgICAgb3B0aW9ucyAmJiBvcHRpb25zLnNraXBQYWNrYWdlSnNvbiA/IG5vb3AoKSA6IGFkZE5nUnhEYXRhVG9QYWNrYWdlSnNvbigpLFxuICAgICAgb3B0aW9ucy5taWdyYXRlTmdyeERhdGFcbiAgICAgICAgPyBjaGFpbihbXG4gICAgICAgICAgICByZW1vdmVBbmd1bGFyTmdSeERhdGFGcm9tUGFja2FnZUpzb24oKSxcbiAgICAgICAgICAgIHJlbmFtZU5ncnhEYXRhTW9kdWxlKCksXG4gICAgICAgICAgXSlcbiAgICAgICAgOiBhZGRFbnRpdHlEYXRhVG9OZ01vZHVsZShvcHRpb25zKSxcbiAgICAgIG9wdGlvbnMuZW50aXR5Q29uZmlnXG4gICAgICAgID8gY3JlYXRlRW50aXR5Q29uZmlnRmlsZShvcHRpb25zLCBwYXJzZWRQYXRoLnBhdGgpXG4gICAgICAgIDogbm9vcCgpLFxuICAgIF0pKGhvc3QsIGNvbnRleHQpO1xuICB9O1xufVxuIl19