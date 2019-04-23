(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/data/schematics/ng-add/index", ["require", "exports", "typescript", "@angular-devkit/schematics", "@angular-devkit/schematics/tasks", "@ngrx/data/schematics-core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const ts = require("typescript");
    const schematics_1 = require("@angular-devkit/schematics");
    const tasks_1 = require("@angular-devkit/schematics/tasks");
    const schematics_core_1 = require("@ngrx/data/schematics-core");
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
            const [dateEntityNgModuleImport] = schematics_core_1.addImportToModule(source, modulePath, moduleToImport, '');
            const changes = [effectsModuleImport, dateEntityNgModuleImport];
            const recorder = host.beginUpdate(modulePath);
            for (const change of changes) {
                if (change instanceof schematics_core_1.InsertChange) {
                    recorder.insertLeft(change.pos, change.toAdd);
                }
            }
            host.commitUpdate(recorder);
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
                if (json['dependencies'] && json['dependencies']['angular-ngrx-data']) {
                    delete json['dependencies']['angular-ngrx-data'];
                }
                host.overwrite('package.json', JSON.stringify(json, null, 2));
            }
            return host;
        };
    }
    function renameNgrxDataModule(options) {
        return (host, context) => {
            host.visit(path => {
                if (!path.endsWith('.ts')) {
                    return;
                }
                const sourceFile = ts.createSourceFile(path, host.read(path).toString(), ts.ScriptTarget.Latest);
                if (sourceFile.isDeclarationFile) {
                    return;
                }
                const ngrxDataImports = sourceFile.statements
                    .filter(ts.isImportDeclaration)
                    .filter(({ moduleSpecifier }) => moduleSpecifier.getText(sourceFile) === "'ngrx-data'");
                if (ngrxDataImports.length === 0) {
                    return;
                }
                const changes = [
                    ...findNgrxDataImports(sourceFile, path, ngrxDataImports),
                    ...findNgrxDataImportDeclarations(sourceFile, path, ngrxDataImports),
                    ...findNgrxDataReplacements(sourceFile, path),
                ];
                if (changes.length === 0) {
                    return;
                }
                const recorder = schematics_core_1.createChangeRecorder(host, path, changes);
                host.commitUpdate(recorder);
            });
        };
    }
    function findNgrxDataImports(sourceFile, path, imports) {
        const changes = imports.map(specifier => schematics_core_1.createReplaceChange(sourceFile, path, specifier.moduleSpecifier, "'ngrx-data'", "'@ngrx/data'"));
        return changes;
    }
    function findNgrxDataImportDeclarations(sourceFile, path, imports) {
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
            .map(({ specifier, text }) => schematics_core_1.createReplaceChange(sourceFile, path, specifier, text, renames[text]));
        return changes;
    }
    function findNgrxDataReplacements(sourceFile, path) {
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
                changes.push(schematics_core_1.createReplaceChange(sourceFile, path, change.node, change.text, renames[change.text]));
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
                        renameNgrxDataModule(options),
                    ])
                    : addEntityDataToNgModule(options),
            ])(host, context);
        };
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc2NoZW1hdGljcy9uZy1hZGQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSxpQ0FBaUM7SUFDakMsMkRBT29DO0lBQ3BDLDREQUEwRTtJQUMxRSxnRUFZb0M7SUFJcEMsU0FBUyx3QkFBd0I7UUFDL0IsT0FBTyxDQUFDLElBQVUsRUFBRSxPQUF5QixFQUFFLEVBQUU7WUFDL0MseUNBQXVCLENBQ3JCLElBQUksRUFDSixjQUFjLEVBQ2QsWUFBWSxFQUNaLGlDQUFlLENBQ2hCLENBQUM7WUFDRixPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksOEJBQXNCLEVBQUUsQ0FBQyxDQUFDO1lBQzlDLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELFNBQVMsdUJBQXVCLENBQUMsT0FBMEI7UUFDekQsT0FBTyxDQUFDLElBQVUsRUFBRSxFQUFFO1lBQ3BCLHlCQUF5QixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFaEQsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU8sQ0FBQztZQUNuQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRS9DLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FDaEMsVUFBVSxFQUNWLElBQUksRUFDSixFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFDdEIsSUFBSSxDQUNMLENBQUM7WUFFRixNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsT0FBTztnQkFDcEMsQ0FBQyxDQUFDLGtCQUFrQjtnQkFDcEIsQ0FBQyxDQUFDLGdDQUFnQyxDQUFDO1lBQ3JDLE1BQU0sbUJBQW1CLEdBQUcsOEJBQVksQ0FDdEMsTUFBTSxFQUNOLFVB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O1lBQ3pFLE9BQU8sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU07Z0JBQzdCLENBQUMsQ0FBQyx1Q0FBcUIsQ0FBQyxJQUFJLEVBQUUsT0FBYyxDQUFDO2dCQUM3QyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztZQUVuQixNQUFNLFVBQVUsR0FBRywyQkFBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDL0MsT0FBTyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDO1lBRS9CLE9BQU8sa0JBQUssQ0FBQztnQkFDWCxPQUFPLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsaUJBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsRUFBRTtnQkFDeEUsT0FBTyxDQUFDLGVBQWU7b0JBQ3JCLENBQUMsQ0FBQyxrQkFBSyxDQUFDO3dCQUNKLG9DQUFvQyxFQUFFO3dCQUN0QyxvQkFBb0IsQ0FBQyxPQUFPLENBQUM7cUJBQzlCLENBQUM7b0JBQ0osQ0FBQyxDQUFDLHVCQUF1QixDQUFDLE9BQU8sQ0FBQzthQUNyQyxDQUFDLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQztJQUNKLENBQUM7SUF0QkQsNEJBc0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge1xuICBSdWxlLFxuICBTY2hlbWF0aWNDb250ZXh0LFxuICBUcmVlLFxuICBjaGFpbixcbiAgbm9vcCxcbiAgU2NoZW1hdGljc0V4Y2VwdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHsgTm9kZVBhY2thZ2VJbnN0YWxsVGFzayB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzL3Rhc2tzJztcbmltcG9ydCB7XG4gIGFkZFBhY2thZ2VUb1BhY2thZ2VKc29uLFxuICBwbGF0Zm9ybVZlcnNpb24sXG4gIGZpbmRNb2R1bGVGcm9tT3B0aW9ucyxcbiAgaW5zZXJ0SW1wb3J0LFxuICBJbnNlcnRDaGFuZ2UsXG4gIGdldFByb2plY3RQYXRoLFxuICBwYXJzZU5hbWUsXG4gIGFkZEltcG9ydFRvTW9kdWxlLFxuICBjcmVhdGVSZXBsYWNlQ2hhbmdlLFxuICBSZXBsYWNlQ2hhbmdlLFxuICBjcmVhdGVDaGFuZ2VSZWNvcmRlcixcbn0gZnJvbSAnQG5ncngvZGF0YS9zY2hlbWF0aWNzLWNvcmUnO1xuaW1wb3J0IHsgU2NoZW1hIGFzIEVudGl0eURhdGFPcHRpb25zIH0gZnJvbSAnLi9zY2hlbWEnO1xuaW1wb3J0IHsgUGF0aCB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcblxuZnVuY3Rpb24gYWRkTmdSeERhdGFUb1BhY2thZ2VKc29uKCkge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBhZGRQYWNrYWdlVG9QYWNrYWdlSnNvbihcbiAgICAgIGhvc3QsXG4gICAgICAnZGVwZW5kZW5jaWVzJyxcbiAgICAgICdAbmdyeC9kYXRhJyxcbiAgICAgIHBsYXRmb3JtVmVyc2lvblxuICAgICk7XG4gICAgY29udGV4dC5hZGRUYXNrKG5ldyBOb2RlUGFja2FnZUluc3RhbGxUYXNrKCkpO1xuICAgIHJldHVybiBob3N0O1xuICB9O1xufVxuXG5mdW5jdGlvbiBhZGRFbnRpdHlEYXRhVG9OZ01vZHVsZShvcHRpb25zOiBFbnRpdHlEYXRhT3B0aW9ucyk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUpID0+IHtcbiAgICB0aHJvd0lmTW9kdWxlTm90U3BlY2lmaWVkKGhvc3QsIG9wdGlvbnMubW9kdWxlKTtcblxuICAgIGNvbnN0IG1vZHVsZVBhdGggPSBvcHRpb25zLm1vZHVsZSE7XG4gICAgY29uc3QgdGV4dCA9IGhvc3QucmVhZChtb2R1bGVQYXRoKSEudG9TdHJpbmcoKTtcblxuICAgIGNvbnN0IHNvdXJjZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoXG4gICAgICBtb2R1bGVQYXRoLFxuICAgICAgdGV4dCxcbiAgICAgIHRzLlNjcmlwdFRhcmdldC5MYXRlc3QsXG4gICAgICB0cnVlXG4gICAgKTtcblxuICAgIGNvbnN0IG1vZHVsZVRvSW1wb3J0ID0gb3B0aW9ucy5lZmZlY3RzXG4gICAgICA/ICdFbnRpdHlEYXRhTW9kdWxlJ1xuICAgICAgOiAnRW50aXR5RGF0YU1vZHVsZVdpdGhvdXRFZmZlY3RzJztcbiAgICBjb25zdCBlZmZlY3RzTW9kdWxlSW1wb3J0ID0gaW5zZXJ0SW1wb3J0KFxuICAgICAgc291cmNlLFxuICAgICAgbW9kdWxlUGF0aCxcbiAgICAgIG1vZHVsZVRvSW1wb3J0LFxuICAgICAgJ0BuZ3J4L2RhdGEnXG4gICAgKTtcblxuICAgIGNvbnN0IFtkYXRlRW50aXR5TmdNb2R1bGVJbXBvcnRdID0gYWRkSW1wb3J0VG9Nb2R1bGUoXG4gICAgICBzb3VyY2UsXG4gICAgICBtb2R1bGVQYXRoLFxuICAgICAgbW9kdWxlVG9JbXBvcnQsXG4gICAgICAnJ1xuICAgICk7XG5cbiAgICBjb25zdCBjaGFuZ2VzID0gW2VmZmVjdHNNb2R1bGVJbXBvcnQsIGRhdGVFbnRpdHlOZ01vZHVsZUltcG9ydF07XG4gICAgY29uc3QgcmVjb3JkZXIgPSBob3N0LmJlZ2luVXBkYXRlKG1vZHVsZVBhdGgpO1xuICAgIGZvciAoY29uc3QgY2hhbmdlIG9mIGNoYW5nZXMpIHtcbiAgICAgIGlmIChjaGFuZ2UgaW5zdGFuY2VvZiBJbnNlcnRDaGFuZ2UpIHtcbiAgICAgICAgcmVjb3JkZXIuaW5zZXJ0TGVmdChjaGFuZ2UucG9zLCBjaGFuZ2UudG9BZGQpO1xuICAgICAgfVxuICAgIH1cbiAgICBob3N0LmNvbW1pdFVwZGF0ZShyZWNvcmRlcik7XG5cbiAgICByZXR1cm4gaG9zdDtcbiAgfTtcbn1cblxuY29uc3QgcmVuYW1lcyA9IHtcbiAgTmdyeERhdGFNb2R1bGU6ICdFbnRpdHlEYXRhTW9kdWxlJyxcbiAgTmdyeERhdGFNb2R1bGVXaXRob3V0RWZmZWN0czogJ0VudGl0eURhdGFNb2R1bGVXaXRob3V0RWZmZWN0cycsXG4gIE5ncnhEYXRhTW9kdWxlQ29uZmlnOiAnRW50aXR5RGF0YU1vZHVsZUNvbmZpZycsXG59O1xuXG5mdW5jdGlvbiByZW1vdmVBbmd1bGFyTmdSeERhdGFGcm9tUGFja2FnZUpzb24oKSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGlmIChob3N0LmV4aXN0cygncGFja2FnZS5qc29uJykpIHtcbiAgICAgIGNvbnN0IHNvdXJjZVRleHQgPSBob3N0LnJlYWQoJ3BhY2thZ2UuanNvbicpIS50b1N0cmluZygndXRmLTgnKTtcbiAgICAgIGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKHNvdXJjZVRleHQpO1xuXG4gICAgICBpZiAoanNvblsnZGVwZW5kZW5jaWVzJ10gJiYganNvblsnZGVwZW5kZW5jaWVzJ11bJ2FuZ3VsYXItbmdyeC1kYXRhJ10pIHtcbiAgICAgICAgZGVsZXRlIGpzb25bJ2RlcGVuZGVuY2llcyddWydhbmd1bGFyLW5ncngtZGF0YSddO1xuICAgICAgfVxuXG4gICAgICBob3N0Lm92ZXJ3cml0ZSgncGFja2FnZS5qc29uJywgSlNPTi5zdHJpbmdpZnkoanNvbiwgbnVsbCwgMikpO1xuICAgIH1cblxuICAgIHJldHVybiBob3N0O1xuICB9O1xufVxuXG5mdW5jdGlvbiByZW5hbWVOZ3J4RGF0YU1vZHVsZShvcHRpb25zOiBFbnRpdHlEYXRhT3B0aW9ucykge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBob3N0LnZpc2l0KHBhdGggPT4ge1xuICAgICAgaWYgKCFwYXRoLmVuZHNXaXRoKCcudHMnKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNvdXJjZUZpbGUgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKFxuICAgICAgICBwYXRoLFxuICAgICAgICBob3N0LnJlYWQocGF0aCkhLnRvU3RyaW5nKCksXG4gICAgICAgIHRzLlNjcmlwdFRhcmdldC5MYXRlc3RcbiAgICAgICk7XG5cbiAgICAgIGlmIChzb3VyY2VGaWxlLmlzRGVjbGFyYXRpb25GaWxlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbmdyeERhdGFJbXBvcnRzID0gc291cmNlRmlsZS5zdGF0ZW1lbnRzXG4gICAgICAgIC5maWx0ZXIodHMuaXNJbXBvcnREZWNsYXJhdGlvbilcbiAgICAgICAgLmZpbHRlcihcbiAgICAgICAgICAoeyBtb2R1bGVTcGVjaWZpZXIgfSkgPT5cbiAgICAgICAgICAgIG1vZHVsZVNwZWNpZmllci5nZXRUZXh0KHNvdXJjZUZpbGUpID09PSBcIiduZ3J4LWRhdGEnXCJcbiAgICAgICAgKTtcblxuICAgICAgaWYgKG5ncnhEYXRhSW1wb3J0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjaGFuZ2VzID0gW1xuICAgICAgICAuLi5maW5kTmdyeERhdGFJbXBvcnRzKHNvdXJjZUZpbGUsIHBhdGgsIG5ncnhEYXRhSW1wb3J0cyksXG4gICAgICAgIC4uLmZpbmROZ3J4RGF0YUltcG9ydERlY2xhcmF0aW9ucyhzb3VyY2VGaWxlLCBwYXRoLCBuZ3J4RGF0YUltcG9ydHMpLFxuICAgICAgICAuLi5maW5kTmdyeERhdGFSZXBsYWNlbWVudHMoc291cmNlRmlsZSwgcGF0aCksXG4gICAgICBdO1xuXG4gICAgICBpZiAoY2hhbmdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZWNvcmRlciA9IGNyZWF0ZUNoYW5nZVJlY29yZGVyKGhvc3QsIHBhdGgsIGNoYW5nZXMpO1xuICAgICAgaG9zdC5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xuICAgIH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBmaW5kTmdyeERhdGFJbXBvcnRzKFxuICBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLFxuICBwYXRoOiBQYXRoLFxuICBpbXBvcnRzOiB0cy5JbXBvcnREZWNsYXJhdGlvbltdXG4pIHtcbiAgY29uc3QgY2hhbmdlcyA9IGltcG9ydHMubWFwKHNwZWNpZmllciA9PlxuICAgIGNyZWF0ZVJlcGxhY2VDaGFuZ2UoXG4gICAgICBzb3VyY2VGaWxlLFxuICAgICAgcGF0aCxcbiAgICAgIHNwZWNpZmllci5tb2R1bGVTcGVjaWZpZXIsXG4gICAgICBcIiduZ3J4LWRhdGEnXCIsXG4gICAgICBcIidAbmdyeC9kYXRhJ1wiXG4gICAgKVxuICApO1xuXG4gIHJldHVybiBjaGFuZ2VzO1xufVxuXG5mdW5jdGlvbiBmaW5kTmdyeERhdGFJbXBvcnREZWNsYXJhdGlvbnMoXG4gIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsXG4gIHBhdGg6IFBhdGgsXG4gIGltcG9ydHM6IHRzLkltcG9ydERlY2xhcmF0aW9uW11cbikge1xuICBjb25zdCBjaGFuZ2VzID0gaW1wb3J0c1xuICAgIC5tYXAocCA9PiAocC5pbXBvcnRDbGF1c2UhLm5hbWVkQmluZGluZ3MhIGFzIHRzLk5hbWVkSW1wb3J0cykuZWxlbWVudHMpXG4gICAgLnJlZHVjZSgoaW1wb3J0cywgY3VycikgPT4gaW1wb3J0cy5jb25jYXQoY3VyciksIFtdIGFzIHRzLkltcG9ydFNwZWNpZmllcltdKVxuICAgIC5tYXAoc3BlY2lmaWVyID0+IHtcbiAgICAgIGlmICghdHMuaXNJbXBvcnRTcGVjaWZpZXIoc3BlY2lmaWVyKSkge1xuICAgICAgICByZXR1cm4geyBoaXQ6IGZhbHNlIH07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5ncnhEYXRhSW1wb3J0cyA9IE9iamVjdC5rZXlzKHJlbmFtZXMpO1xuICAgICAgaWYgKG5ncnhEYXRhSW1wb3J0cy5pbmNsdWRlcyhzcGVjaWZpZXIubmFtZS50ZXh0KSkge1xuICAgICAgICByZXR1cm4geyBoaXQ6IHRydWUsIHNwZWNpZmllciwgdGV4dDogc3BlY2lmaWVyLm5hbWUudGV4dCB9O1xuICAgICAgfVxuXG4gICAgICAvLyBpZiBpbXBvcnQgaXMgcmVuYW1lZFxuICAgICAgaWYgKFxuICAgICAgICBzcGVjaWZpZXIucHJvcGVydHlOYW1lICYmXG4gICAgICAgIG5ncnhEYXRhSW1wb3J0cy5pbmNsdWRlcyhzcGVjaWZpZXIucHJvcGVydHlOYW1lLnRleHQpXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIHsgaGl0OiB0cnVlLCBzcGVjaWZpZXIsIHRleHQ6IHNwZWNpZmllci5wcm9wZXJ0eU5hbWUudGV4dCB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4geyBoaXQ6IGZhbHNlIH07XG4gICAgfSlcbiAgICAuZmlsdGVyKCh7IGhpdCB9KSA9PiBoaXQpXG4gICAgLm1hcCgoeyBzcGVjaWZpZXIsIHRleHQgfSkgPT5cbiAgICAgIGNyZWF0ZVJlcGxhY2VDaGFuZ2UoXG4gICAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAgIHBhdGgsXG4gICAgICAgIHNwZWNpZmllciEsXG4gICAgICAgIHRleHQhLFxuICAgICAgICAocmVuYW1lcyBhcyBhbnkpW3RleHQhXVxuICAgICAgKVxuICAgICk7XG5cbiAgcmV0dXJuIGNoYW5nZXM7XG59XG5cbmZ1bmN0aW9uIGZpbmROZ3J4RGF0YVJlcGxhY2VtZW50cyhzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLCBwYXRoOiBQYXRoKSB7XG4gIGNvbnN0IHJlbmFtZUtleXMgPSBPYmplY3Qua2V5cyhyZW5hbWVzKTtcbiAgbGV0IGNoYW5nZXM6IFJlcGxhY2VDaGFuZ2VbXSA9IFtdO1xuICB0cy5mb3JFYWNoQ2hpbGQoc291cmNlRmlsZSwgbm9kZSA9PiBmaW5kKG5vZGUsIGNoYW5nZXMpKTtcbiAgcmV0dXJuIGNoYW5nZXM7XG5cbiAgZnVuY3Rpb24gZmluZChub2RlOiB0cy5Ob2RlLCBjaGFuZ2VzOiBSZXBsYWNlQ2hhbmdlW10pIHtcbiAgICBsZXQgY2hhbmdlID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKFxuICAgICAgdHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQobm9kZSkgJiZcbiAgICAgIHJlbmFtZUtleXMuaW5jbHVkZXMobm9kZS5pbml0aWFsaXplci5nZXRUZXh0KHNvdXJjZUZpbGUpKVxuICAgICkge1xuICAgICAgY2hhbmdlID0ge1xuICAgICAgICBub2RlOiBub2RlLmluaXRpYWxpemVyLFxuICAgICAgICB0ZXh0OiBub2RlLmluaXRpYWxpemVyLmdldFRleHQoc291cmNlRmlsZSksXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUpICYmXG4gICAgICByZW5hbWVLZXlzLmluY2x1ZGVzKG5vZGUuZXhwcmVzc2lvbi5nZXRUZXh0KHNvdXJjZUZpbGUpKVxuICAgICkge1xuICAgICAgY2hhbmdlID0ge1xuICAgICAgICBub2RlOiBub2RlLmV4cHJlc3Npb24sXG4gICAgICAgIHRleHQ6IG5vZGUuZXhwcmVzc2lvbi5nZXRUZXh0KHNvdXJjZUZpbGUpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICB0cy5pc1ZhcmlhYmxlRGVjbGFyYXRpb24obm9kZSkgJiZcbiAgICAgIG5vZGUudHlwZSAmJlxuICAgICAgcmVuYW1lS2V5cy5pbmNsdWRlcyhub2RlLnR5cGUuZ2V0VGV4dChzb3VyY2VGaWxlKSlcbiAgICApIHtcbiAgICAgIGNoYW5nZSA9IHtcbiAgICAgICAgbm9kZTogbm9kZS50eXBlLFxuICAgICAgICB0ZXh0OiBub2RlLnR5cGUuZ2V0VGV4dChzb3VyY2VGaWxlKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZSkge1xuICAgICAgY2hhbmdlcy5wdXNoKFxuICAgICAgICBjcmVhdGVSZXBsYWNlQ2hhbmdlKFxuICAgICAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAgICAgcGF0aCxcbiAgICAgICAgICBjaGFuZ2Uubm9kZSxcbiAgICAgICAgICBjaGFuZ2UudGV4dCxcbiAgICAgICAgICAocmVuYW1lcyBhcyBhbnkpW2NoYW5nZS50ZXh0XVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIHRzLmZvckVhY2hDaGlsZChub2RlLCBjaGlsZE5vZGUgPT4gZmluZChjaGlsZE5vZGUsIGNoYW5nZXMpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB0aHJvd0lmTW9kdWxlTm90U3BlY2lmaWVkKGhvc3Q6IFRyZWUsIG1vZHVsZT86IHN0cmluZykge1xuICBpZiAoIW1vZHVsZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignTW9kdWxlIG5vdCBzcGVjaWZpZWQnKTtcbiAgfVxuXG4gIGlmICghaG9zdC5leGlzdHMobW9kdWxlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignU3BlY2lmaWVkIG1vZHVsZSBkb2VzIG5vdCBleGlzdCcpO1xuICB9XG5cbiAgY29uc3QgdGV4dCA9IGhvc3QucmVhZChtb2R1bGUpO1xuICBpZiAodGV4dCA9PT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBGaWxlICR7bW9kdWxlfSBkb2VzIG5vdCBleGlzdC5gKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvcHRpb25zOiBFbnRpdHlEYXRhT3B0aW9ucyk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICAob3B0aW9ucyBhcyBhbnkpLm5hbWUgPSAnJztcbiAgICBvcHRpb25zLnBhdGggPSBnZXRQcm9qZWN0UGF0aChob3N0LCBvcHRpb25zKTtcbiAgICBvcHRpb25zLmVmZmVjdHMgPSBvcHRpb25zLmVmZmVjdHMgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBvcHRpb25zLmVmZmVjdHM7XG4gICAgb3B0aW9ucy5tb2R1bGUgPSBvcHRpb25zLm1vZHVsZVxuICAgICAgPyBmaW5kTW9kdWxlRnJvbU9wdGlvbnMoaG9zdCwgb3B0aW9ucyBhcyBhbnkpXG4gICAgICA6IG9wdGlvbnMubW9kdWxlO1xuXG4gICAgY29uc3QgcGFyc2VkUGF0aCA9IHBhcnNlTmFtZShvcHRpb25zLnBhdGgsICcnKTtcbiAgICBvcHRpb25zLnBhdGggPSBwYXJzZWRQYXRoLnBhdGg7XG5cbiAgICByZXR1cm4gY2hhaW4oW1xuICAgICAgb3B0aW9ucyAmJiBvcHRpb25zLnNraXBQYWNrYWdlSnNvbiA/IG5vb3AoKSA6IGFkZE5nUnhEYXRhVG9QYWNrYWdlSnNvbigpLFxuICAgICAgb3B0aW9ucy5taWdyYXRlTmdyeERhdGFcbiAgICAgICAgPyBjaGFpbihbXG4gICAgICAgICAgICByZW1vdmVBbmd1bGFyTmdSeERhdGFGcm9tUGFja2FnZUpzb24oKSxcbiAgICAgICAgICAgIHJlbmFtZU5ncnhEYXRhTW9kdWxlKG9wdGlvbnMpLFxuICAgICAgICAgIF0pXG4gICAgICAgIDogYWRkRW50aXR5RGF0YVRvTmdNb2R1bGUob3B0aW9ucyksXG4gICAgXSkoaG9zdCwgY29udGV4dCk7XG4gIH07XG59XG4iXX0=