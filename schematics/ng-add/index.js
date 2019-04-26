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
                if (json['dependencies'] && json['dependencies']['ngrx-data']) {
                    delete json['dependencies']['ngrx-data'];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc2NoZW1hdGljcy9uZy1hZGQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSxpQ0FBaUM7SUFDakMsMkRBT29DO0lBQ3BDLDREQUEwRTtJQUMxRSxnRUFZb0M7SUFJcEMsU0FBUyx3QkFBd0I7UUFDL0IsT0FBTyxDQUFDLElBQVUsRUFBRSxPQUF5QixFQUFFLEVBQUU7WUFDL0MseUNBQXVCLENBQ3JCLElBQUksRUFDSixjQUFjLEVBQ2QsWUFBWSxFQUNaLGlDQUFlLENBQ2hCLENBQUM7WUFDRixPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksOEJBQXNCLEVBQUUsQ0FBQyxDQUFDO1lBQzlDLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELFNBQVMsdUJBQXVCLENBQUMsT0FBMEI7UUFDekQsT0FBTyxDQUFDLElBQVUsRUFBRSxFQUFFO1lBQ3BCLHlCQUF5QixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFaEQsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU8sQ0FBQztZQUNuQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRS9DLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FDaEMsVUFBVSxFQUNWLElBQUksRUFDSixFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFDdEIsSUFBSSxDQUNMLENBQUM7WUFFRixNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsT0FBTztnQkFDcEMsQ0FBQyxDQUFDLGtCQUFrQjtnQkFDcEIsQ0FBQyxDQUFDLGdDQUFnQyxDQUFDO1lBQ3JDLE1BQU0sbUJBQW1CLEdBQUcsOEJBQVksQ0FDdEMsTUFBTSxFQUNOLFVB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ekUsT0FBTyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTTtnQkFDN0IsQ0FBQyxDQUFDLHVDQUFxQixDQUFDLElBQUksRUFBRSxPQUFjLENBQUM7Z0JBQzdDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1lBRW5CLE1BQU0sVUFBVSxHQUFHLDJCQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMvQyxPQUFPLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFFL0IsT0FBTyxrQkFBSyxDQUFDO2dCQUNYLE9BQU8sSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxpQkFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixFQUFFO2dCQUN4RSxPQUFPLENBQUMsZUFBZTtvQkFDckIsQ0FBQyxDQUFDLGtCQUFLLENBQUM7d0JBQ0osb0NBQW9DLEVBQUU7d0JBQ3RDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQztxQkFDOUIsQ0FBQztvQkFDSixDQUFDLENBQUMsdUJBQXVCLENBQUMsT0FBTyxDQUFDO2FBQ3JDLENBQUMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDcEIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQXRCRCw0QkFzQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7XG4gIFJ1bGUsXG4gIFNjaGVtYXRpY0NvbnRleHQsXG4gIFRyZWUsXG4gIGNoYWluLFxuICBub29wLFxuICBTY2hlbWF0aWNzRXhjZXB0aW9uLFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQgeyBOb2RlUGFja2FnZUluc3RhbGxUYXNrIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdGFza3MnO1xuaW1wb3J0IHtcbiAgYWRkUGFja2FnZVRvUGFja2FnZUpzb24sXG4gIHBsYXRmb3JtVmVyc2lvbixcbiAgZmluZE1vZHVsZUZyb21PcHRpb25zLFxuICBpbnNlcnRJbXBvcnQsXG4gIEluc2VydENoYW5nZSxcbiAgZ2V0UHJvamVjdFBhdGgsXG4gIHBhcnNlTmFtZSxcbiAgYWRkSW1wb3J0VG9Nb2R1bGUsXG4gIGNyZWF0ZVJlcGxhY2VDaGFuZ2UsXG4gIFJlcGxhY2VDaGFuZ2UsXG4gIGNyZWF0ZUNoYW5nZVJlY29yZGVyLFxufSBmcm9tICdAbmdyeC9kYXRhL3NjaGVtYXRpY3MtY29yZSc7XG5pbXBvcnQgeyBTY2hlbWEgYXMgRW50aXR5RGF0YU9wdGlvbnMgfSBmcm9tICcuL3NjaGVtYSc7XG5pbXBvcnQgeyBQYXRoIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuXG5mdW5jdGlvbiBhZGROZ1J4RGF0YVRvUGFja2FnZUpzb24oKSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIGFkZFBhY2thZ2VUb1BhY2thZ2VKc29uKFxuICAgICAgaG9zdCxcbiAgICAgICdkZXBlbmRlbmNpZXMnLFxuICAgICAgJ0BuZ3J4L2RhdGEnLFxuICAgICAgcGxhdGZvcm1WZXJzaW9uXG4gICAgKTtcbiAgICBjb250ZXh0LmFkZFRhc2sobmV3IE5vZGVQYWNrYWdlSW5zdGFsbFRhc2soKSk7XG4gICAgcmV0dXJuIGhvc3Q7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGFkZEVudGl0eURhdGFUb05nTW9kdWxlKG9wdGlvbnM6IEVudGl0eURhdGFPcHRpb25zKTogUnVsZSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSkgPT4ge1xuICAgIHRocm93SWZNb2R1bGVOb3RTcGVjaWZpZWQoaG9zdCwgb3B0aW9ucy5tb2R1bGUpO1xuXG4gICAgY29uc3QgbW9kdWxlUGF0aCA9IG9wdGlvbnMubW9kdWxlITtcbiAgICBjb25zdCB0ZXh0ID0gaG9zdC5yZWFkKG1vZHVsZVBhdGgpIS50b1N0cmluZygpO1xuXG4gICAgY29uc3Qgc291cmNlID0gdHMuY3JlYXRlU291cmNlRmlsZShcbiAgICAgIG1vZHVsZVBhdGgsXG4gICAgICB0ZXh0LFxuICAgICAgdHMuU2NyaXB0VGFyZ2V0LkxhdGVzdCxcbiAgICAgIHRydWVcbiAgICApO1xuXG4gICAgY29uc3QgbW9kdWxlVG9JbXBvcnQgPSBvcHRpb25zLmVmZmVjdHNcbiAgICAgID8gJ0VudGl0eURhdGFNb2R1bGUnXG4gICAgICA6ICdFbnRpdHlEYXRhTW9kdWxlV2l0aG91dEVmZmVjdHMnO1xuICAgIGNvbnN0IGVmZmVjdHNNb2R1bGVJbXBvcnQgPSBpbnNlcnRJbXBvcnQoXG4gICAgICBzb3VyY2UsXG4gICAgICBtb2R1bGVQYXRoLFxuICAgICAgbW9kdWxlVG9JbXBvcnQsXG4gICAgICAnQG5ncngvZGF0YSdcbiAgICApO1xuXG4gICAgY29uc3QgW2RhdGVFbnRpdHlOZ01vZHVsZUltcG9ydF0gPSBhZGRJbXBvcnRUb01vZHVsZShcbiAgICAgIHNvdXJjZSxcbiAgICAgIG1vZHVsZVBhdGgsXG4gICAgICBtb2R1bGVUb0ltcG9ydCxcbiAgICAgICcnXG4gICAgKTtcblxuICAgIGNvbnN0IGNoYW5nZXMgPSBbZWZmZWN0c01vZHVsZUltcG9ydCwgZGF0ZUVudGl0eU5nTW9kdWxlSW1wb3J0XTtcbiAgICBjb25zdCByZWNvcmRlciA9IGhvc3QuYmVnaW5VcGRhdGUobW9kdWxlUGF0aCk7XG4gICAgZm9yIChjb25zdCBjaGFuZ2Ugb2YgY2hhbmdlcykge1xuICAgICAgaWYgKGNoYW5nZSBpbnN0YW5jZW9mIEluc2VydENoYW5nZSkge1xuICAgICAgICByZWNvcmRlci5pbnNlcnRMZWZ0KGNoYW5nZS5wb3MsIGNoYW5nZS50b0FkZCk7XG4gICAgICB9XG4gICAgfVxuICAgIGhvc3QuY29tbWl0VXBkYXRlKHJlY29yZGVyKTtcblxuICAgIHJldHVybiBob3N0O1xuICB9O1xufVxuXG5jb25zdCByZW5hbWVzID0ge1xuICBOZ3J4RGF0YU1vZHVsZTogJ0VudGl0eURhdGFNb2R1bGUnLFxuICBOZ3J4RGF0YU1vZHVsZVdpdGhvdXRFZmZlY3RzOiAnRW50aXR5RGF0YU1vZHVsZVdpdGhvdXRFZmZlY3RzJyxcbiAgTmdyeERhdGFNb2R1bGVDb25maWc6ICdFbnRpdHlEYXRhTW9kdWxlQ29uZmlnJyxcbn07XG5cbmZ1bmN0aW9uIHJlbW92ZUFuZ3VsYXJOZ1J4RGF0YUZyb21QYWNrYWdlSnNvbigpIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlKSA9PiB7XG4gICAgaWYgKGhvc3QuZXhpc3RzKCdwYWNrYWdlLmpzb24nKSkge1xuICAgICAgY29uc3Qgc291cmNlVGV4dCA9IGhvc3QucmVhZCgncGFja2FnZS5qc29uJykhLnRvU3RyaW5nKCd1dGYtOCcpO1xuICAgICAgY29uc3QganNvbiA9IEpTT04ucGFyc2Uoc291cmNlVGV4dCk7XG5cbiAgICAgIGlmIChqc29uWydkZXBlbmRlbmNpZXMnXSAmJiBqc29uWydkZXBlbmRlbmNpZXMnXVsnbmdyeC1kYXRhJ10pIHtcbiAgICAgICAgZGVsZXRlIGpzb25bJ2RlcGVuZGVuY2llcyddWyduZ3J4LWRhdGEnXTtcbiAgICAgIH1cblxuICAgICAgaG9zdC5vdmVyd3JpdGUoJ3BhY2thZ2UuanNvbicsIEpTT04uc3RyaW5naWZ5KGpzb24sIG51bGwsIDIpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaG9zdDtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVuYW1lTmdyeERhdGFNb2R1bGUob3B0aW9uczogRW50aXR5RGF0YU9wdGlvbnMpIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgaG9zdC52aXNpdChwYXRoID0+IHtcbiAgICAgIGlmICghcGF0aC5lbmRzV2l0aCgnLnRzJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzb3VyY2VGaWxlID0gdHMuY3JlYXRlU291cmNlRmlsZShcbiAgICAgICAgcGF0aCxcbiAgICAgICAgaG9zdC5yZWFkKHBhdGgpIS50b1N0cmluZygpLFxuICAgICAgICB0cy5TY3JpcHRUYXJnZXQuTGF0ZXN0XG4gICAgICApO1xuXG4gICAgICBpZiAoc291cmNlRmlsZS5pc0RlY2xhcmF0aW9uRmlsZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5ncnhEYXRhSW1wb3J0cyA9IHNvdXJjZUZpbGUuc3RhdGVtZW50c1xuICAgICAgICAuZmlsdGVyKHRzLmlzSW1wb3J0RGVjbGFyYXRpb24pXG4gICAgICAgIC5maWx0ZXIoXG4gICAgICAgICAgKHsgbW9kdWxlU3BlY2lmaWVyIH0pID0+XG4gICAgICAgICAgICBtb2R1bGVTcGVjaWZpZXIuZ2V0VGV4dChzb3VyY2VGaWxlKSA9PT0gXCInbmdyeC1kYXRhJ1wiXG4gICAgICAgICk7XG5cbiAgICAgIGlmIChuZ3J4RGF0YUltcG9ydHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY2hhbmdlcyA9IFtcbiAgICAgICAgLi4uZmluZE5ncnhEYXRhSW1wb3J0cyhzb3VyY2VGaWxlLCBwYXRoLCBuZ3J4RGF0YUltcG9ydHMpLFxuICAgICAgICAuLi5maW5kTmdyeERhdGFJbXBvcnREZWNsYXJhdGlvbnMoc291cmNlRmlsZSwgcGF0aCwgbmdyeERhdGFJbXBvcnRzKSxcbiAgICAgICAgLi4uZmluZE5ncnhEYXRhUmVwbGFjZW1lbnRzKHNvdXJjZUZpbGUsIHBhdGgpLFxuICAgICAgXTtcblxuICAgICAgaWYgKGNoYW5nZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVjb3JkZXIgPSBjcmVhdGVDaGFuZ2VSZWNvcmRlcihob3N0LCBwYXRoLCBjaGFuZ2VzKTtcbiAgICAgIGhvc3QuY29tbWl0VXBkYXRlKHJlY29yZGVyKTtcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZmluZE5ncnhEYXRhSW1wb3J0cyhcbiAgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSxcbiAgcGF0aDogUGF0aCxcbiAgaW1wb3J0czogdHMuSW1wb3J0RGVjbGFyYXRpb25bXVxuKSB7XG4gIGNvbnN0IGNoYW5nZXMgPSBpbXBvcnRzLm1hcChzcGVjaWZpZXIgPT5cbiAgICBjcmVhdGVSZXBsYWNlQ2hhbmdlKFxuICAgICAgc291cmNlRmlsZSxcbiAgICAgIHBhdGgsXG4gICAgICBzcGVjaWZpZXIubW9kdWxlU3BlY2lmaWVyLFxuICAgICAgXCInbmdyeC1kYXRhJ1wiLFxuICAgICAgXCInQG5ncngvZGF0YSdcIlxuICAgIClcbiAgKTtcblxuICByZXR1cm4gY2hhbmdlcztcbn1cblxuZnVuY3Rpb24gZmluZE5ncnhEYXRhSW1wb3J0RGVjbGFyYXRpb25zKFxuICBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLFxuICBwYXRoOiBQYXRoLFxuICBpbXBvcnRzOiB0cy5JbXBvcnREZWNsYXJhdGlvbltdXG4pIHtcbiAgY29uc3QgY2hhbmdlcyA9IGltcG9ydHNcbiAgICAubWFwKHAgPT4gKHAuaW1wb3J0Q2xhdXNlIS5uYW1lZEJpbmRpbmdzISBhcyB0cy5OYW1lZEltcG9ydHMpLmVsZW1lbnRzKVxuICAgIC5yZWR1Y2UoKGltcG9ydHMsIGN1cnIpID0+IGltcG9ydHMuY29uY2F0KGN1cnIpLCBbXSBhcyB0cy5JbXBvcnRTcGVjaWZpZXJbXSlcbiAgICAubWFwKHNwZWNpZmllciA9PiB7XG4gICAgICBpZiAoIXRzLmlzSW1wb3J0U3BlY2lmaWVyKHNwZWNpZmllcikpIHtcbiAgICAgICAgcmV0dXJuIHsgaGl0OiBmYWxzZSB9O1xuICAgICAgfVxuXG4gICAgICBjb25zdCBuZ3J4RGF0YUltcG9ydHMgPSBPYmplY3Qua2V5cyhyZW5hbWVzKTtcbiAgICAgIGlmIChuZ3J4RGF0YUltcG9ydHMuaW5jbHVkZXMoc3BlY2lmaWVyLm5hbWUudGV4dCkpIHtcbiAgICAgICAgcmV0dXJuIHsgaGl0OiB0cnVlLCBzcGVjaWZpZXIsIHRleHQ6IHNwZWNpZmllci5uYW1lLnRleHQgfTtcbiAgICAgIH1cblxuICAgICAgLy8gaWYgaW1wb3J0IGlzIHJlbmFtZWRcbiAgICAgIGlmIChcbiAgICAgICAgc3BlY2lmaWVyLnByb3BlcnR5TmFtZSAmJlxuICAgICAgICBuZ3J4RGF0YUltcG9ydHMuaW5jbHVkZXMoc3BlY2lmaWVyLnByb3BlcnR5TmFtZS50ZXh0KVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiB7IGhpdDogdHJ1ZSwgc3BlY2lmaWVyLCB0ZXh0OiBzcGVjaWZpZXIucHJvcGVydHlOYW1lLnRleHQgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHsgaGl0OiBmYWxzZSB9O1xuICAgIH0pXG4gICAgLmZpbHRlcigoeyBoaXQgfSkgPT4gaGl0KVxuICAgIC5tYXAoKHsgc3BlY2lmaWVyLCB0ZXh0IH0pID0+XG4gICAgICBjcmVhdGVSZXBsYWNlQ2hhbmdlKFxuICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICBwYXRoLFxuICAgICAgICBzcGVjaWZpZXIhLFxuICAgICAgICB0ZXh0ISxcbiAgICAgICAgKHJlbmFtZXMgYXMgYW55KVt0ZXh0IV1cbiAgICAgIClcbiAgICApO1xuXG4gIHJldHVybiBjaGFuZ2VzO1xufVxuXG5mdW5jdGlvbiBmaW5kTmdyeERhdGFSZXBsYWNlbWVudHMoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSwgcGF0aDogUGF0aCkge1xuICBjb25zdCByZW5hbWVLZXlzID0gT2JqZWN0LmtleXMocmVuYW1lcyk7XG4gIGxldCBjaGFuZ2VzOiBSZXBsYWNlQ2hhbmdlW10gPSBbXTtcbiAgdHMuZm9yRWFjaENoaWxkKHNvdXJjZUZpbGUsIG5vZGUgPT4gZmluZChub2RlLCBjaGFuZ2VzKSk7XG4gIHJldHVybiBjaGFuZ2VzO1xuXG4gIGZ1bmN0aW9uIGZpbmQobm9kZTogdHMuTm9kZSwgY2hhbmdlczogUmVwbGFjZUNoYW5nZVtdKSB7XG4gICAgbGV0IGNoYW5nZSA9IHVuZGVmaW5lZDtcblxuICAgIGlmIChcbiAgICAgIHRzLmlzUHJvcGVydHlBc3NpZ25tZW50KG5vZGUpICYmXG4gICAgICByZW5hbWVLZXlzLmluY2x1ZGVzKG5vZGUuaW5pdGlhbGl6ZXIuZ2V0VGV4dChzb3VyY2VGaWxlKSlcbiAgICApIHtcbiAgICAgIGNoYW5nZSA9IHtcbiAgICAgICAgbm9kZTogbm9kZS5pbml0aWFsaXplcixcbiAgICAgICAgdGV4dDogbm9kZS5pbml0aWFsaXplci5nZXRUZXh0KHNvdXJjZUZpbGUpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICB0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlKSAmJlxuICAgICAgcmVuYW1lS2V5cy5pbmNsdWRlcyhub2RlLmV4cHJlc3Npb24uZ2V0VGV4dChzb3VyY2VGaWxlKSlcbiAgICApIHtcbiAgICAgIGNoYW5nZSA9IHtcbiAgICAgICAgbm9kZTogbm9kZS5leHByZXNzaW9uLFxuICAgICAgICB0ZXh0OiBub2RlLmV4cHJlc3Npb24uZ2V0VGV4dChzb3VyY2VGaWxlKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgdHMuaXNWYXJpYWJsZURlY2xhcmF0aW9uKG5vZGUpICYmXG4gICAgICBub2RlLnR5cGUgJiZcbiAgICAgIHJlbmFtZUtleXMuaW5jbHVkZXMobm9kZS50eXBlLmdldFRleHQoc291cmNlRmlsZSkpXG4gICAgKSB7XG4gICAgICBjaGFuZ2UgPSB7XG4gICAgICAgIG5vZGU6IG5vZGUudHlwZSxcbiAgICAgICAgdGV4dDogbm9kZS50eXBlLmdldFRleHQoc291cmNlRmlsZSksXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgIGNoYW5nZXMucHVzaChcbiAgICAgICAgY3JlYXRlUmVwbGFjZUNoYW5nZShcbiAgICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgY2hhbmdlLm5vZGUsXG4gICAgICAgICAgY2hhbmdlLnRleHQsXG4gICAgICAgICAgKHJlbmFtZXMgYXMgYW55KVtjaGFuZ2UudGV4dF1cbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0cy5mb3JFYWNoQ2hpbGQobm9kZSwgY2hpbGROb2RlID0+IGZpbmQoY2hpbGROb2RlLCBjaGFuZ2VzKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdGhyb3dJZk1vZHVsZU5vdFNwZWNpZmllZChob3N0OiBUcmVlLCBtb2R1bGU/OiBzdHJpbmcpIHtcbiAgaWYgKCFtb2R1bGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01vZHVsZSBub3Qgc3BlY2lmaWVkJyk7XG4gIH1cblxuICBpZiAoIWhvc3QuZXhpc3RzKG1vZHVsZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NwZWNpZmllZCBtb2R1bGUgZG9lcyBub3QgZXhpc3QnKTtcbiAgfVxuXG4gIGNvbnN0IHRleHQgPSBob3N0LnJlYWQobW9kdWxlKTtcbiAgaWYgKHRleHQgPT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihgRmlsZSAke21vZHVsZX0gZG9lcyBub3QgZXhpc3QuYCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ob3B0aW9uczogRW50aXR5RGF0YU9wdGlvbnMpOiBSdWxlIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgKG9wdGlvbnMgYXMgYW55KS5uYW1lID0gJyc7XG4gICAgb3B0aW9ucy5wYXRoID0gZ2V0UHJvamVjdFBhdGgoaG9zdCwgb3B0aW9ucyk7XG4gICAgb3B0aW9ucy5lZmZlY3RzID0gb3B0aW9ucy5lZmZlY3RzID09PSB1bmRlZmluZWQgPyB0cnVlIDogb3B0aW9ucy5lZmZlY3RzO1xuICAgIG9wdGlvbnMubW9kdWxlID0gb3B0aW9ucy5tb2R1bGVcbiAgICAgID8gZmluZE1vZHVsZUZyb21PcHRpb25zKGhvc3QsIG9wdGlvbnMgYXMgYW55KVxuICAgICAgOiBvcHRpb25zLm1vZHVsZTtcblxuICAgIGNvbnN0IHBhcnNlZFBhdGggPSBwYXJzZU5hbWUob3B0aW9ucy5wYXRoLCAnJyk7XG4gICAgb3B0aW9ucy5wYXRoID0gcGFyc2VkUGF0aC5wYXRoO1xuXG4gICAgcmV0dXJuIGNoYWluKFtcbiAgICAgIG9wdGlvbnMgJiYgb3B0aW9ucy5za2lwUGFja2FnZUpzb24gPyBub29wKCkgOiBhZGROZ1J4RGF0YVRvUGFja2FnZUpzb24oKSxcbiAgICAgIG9wdGlvbnMubWlncmF0ZU5ncnhEYXRhXG4gICAgICAgID8gY2hhaW4oW1xuICAgICAgICAgICAgcmVtb3ZlQW5ndWxhck5nUnhEYXRhRnJvbVBhY2thZ2VKc29uKCksXG4gICAgICAgICAgICByZW5hbWVOZ3J4RGF0YU1vZHVsZShvcHRpb25zKSxcbiAgICAgICAgICBdKVxuICAgICAgICA6IGFkZEVudGl0eURhdGFUb05nTW9kdWxlKG9wdGlvbnMpLFxuICAgIF0pKGhvc3QsIGNvbnRleHQpO1xuICB9O1xufVxuIl19