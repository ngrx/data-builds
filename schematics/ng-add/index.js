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
                    ...findNgrxDataImports(sourceFile, ngrxDataImports),
                    ...findNgrxDataImportDeclarations(sourceFile, ngrxDataImports),
                    ...findNgrxDataReplacements(sourceFile),
                ];
                if (changes.length === 0) {
                    return;
                }
                const recorder = schematics_core_1.createChangeRecorder(host, path, changes);
                host.commitUpdate(recorder);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc2NoZW1hdGljcy9uZy1hZGQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSxpQ0FBaUM7SUFDakMsMkRBT29DO0lBQ3BDLDREQUEwRTtJQUMxRSxnRUFZb0M7SUFHcEMsU0FBUyx3QkFBd0I7UUFDL0IsT0FBTyxDQUFDLElBQVUsRUFBRSxPQUF5QixFQUFFLEVBQUU7WUFDL0MseUNBQXVCLENBQ3JCLElBQUksRUFDSixjQUFjLEVBQ2QsWUFBWSxFQUNaLGlDQUFlLENBQ2hCLENBQUM7WUFDRixPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksOEJBQXNCLEVBQUUsQ0FBQyxDQUFDO1lBQzlDLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELFNBQVMsdUJBQXVCLENBQUMsT0FBMEI7UUFDekQsT0FBTyxDQUFDLElBQVUsRUFBRSxFQUFFO1lBQ3BCLHlCQUF5QixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFaEQsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU8sQ0FBQztZQUNuQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRS9DLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FDaEMsVUFBVSxFQUNWLElBQUksRUFDSixFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFDdEIsSUFBSSxDQUNMLENBQUM7WUFFRixNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsT0FBTztnQkFDcEMsQ0FBQyxDQUFDLGtCQUFrQjtnQkFDcEIsQ0FBQyxDQUFDLGdDQUFnQyxDQUFDO1lBQ3JDLE1BQU0sbUJBQW1CLEdBQUcsOEJBQVksQ0FDdEMsTUFBTSxFQUNOLFVB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QzdDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1lBRW5CLE1BQU0sVUFBVSxHQUFHLDJCQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMvQyxPQUFPLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFFL0IsT0FBTyxrQkFBSyxDQUFDO2dCQUNYLE9BQU8sSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxpQkFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixFQUFFO2dCQUN4RSxPQUFPLENBQUMsZUFBZTtvQkFDckIsQ0FBQyxDQUFDLGtCQUFLLENBQUM7d0JBQ0osb0NBQW9DLEVBQUU7d0JBQ3RDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQztxQkFDOUIsQ0FBQztvQkFDSixDQUFDLENBQUMsdUJBQXVCLENBQUMsT0FBTyxDQUFDO2FBQ3JDLENBQUMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDcEIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQXRCRCw0QkFzQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7XG4gIFJ1bGUsXG4gIFNjaGVtYXRpY0NvbnRleHQsXG4gIFRyZWUsXG4gIGNoYWluLFxuICBub29wLFxuICBTY2hlbWF0aWNzRXhjZXB0aW9uLFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQgeyBOb2RlUGFja2FnZUluc3RhbGxUYXNrIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdGFza3MnO1xuaW1wb3J0IHtcbiAgYWRkUGFja2FnZVRvUGFja2FnZUpzb24sXG4gIHBsYXRmb3JtVmVyc2lvbixcbiAgZmluZE1vZHVsZUZyb21PcHRpb25zLFxuICBpbnNlcnRJbXBvcnQsXG4gIEluc2VydENoYW5nZSxcbiAgZ2V0UHJvamVjdFBhdGgsXG4gIHBhcnNlTmFtZSxcbiAgYWRkSW1wb3J0VG9Nb2R1bGUsXG4gIGNyZWF0ZVJlcGxhY2VDaGFuZ2UsXG4gIFJlcGxhY2VDaGFuZ2UsXG4gIGNyZWF0ZUNoYW5nZVJlY29yZGVyLFxufSBmcm9tICdAbmdyeC9kYXRhL3NjaGVtYXRpY3MtY29yZSc7XG5pbXBvcnQgeyBTY2hlbWEgYXMgRW50aXR5RGF0YU9wdGlvbnMgfSBmcm9tICcuL3NjaGVtYSc7XG5cbmZ1bmN0aW9uIGFkZE5nUnhEYXRhVG9QYWNrYWdlSnNvbigpIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgYWRkUGFja2FnZVRvUGFja2FnZUpzb24oXG4gICAgICBob3N0LFxuICAgICAgJ2RlcGVuZGVuY2llcycsXG4gICAgICAnQG5ncngvZGF0YScsXG4gICAgICBwbGF0Zm9ybVZlcnNpb25cbiAgICApO1xuICAgIGNvbnRleHQuYWRkVGFzayhuZXcgTm9kZVBhY2thZ2VJbnN0YWxsVGFzaygpKTtcbiAgICByZXR1cm4gaG9zdDtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYWRkRW50aXR5RGF0YVRvTmdNb2R1bGUob3B0aW9uczogRW50aXR5RGF0YU9wdGlvbnMpOiBSdWxlIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlKSA9PiB7XG4gICAgdGhyb3dJZk1vZHVsZU5vdFNwZWNpZmllZChob3N0LCBvcHRpb25zLm1vZHVsZSk7XG5cbiAgICBjb25zdCBtb2R1bGVQYXRoID0gb3B0aW9ucy5tb2R1bGUhO1xuICAgIGNvbnN0IHRleHQgPSBob3N0LnJlYWQobW9kdWxlUGF0aCkhLnRvU3RyaW5nKCk7XG5cbiAgICBjb25zdCBzb3VyY2UgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKFxuICAgICAgbW9kdWxlUGF0aCxcbiAgICAgIHRleHQsXG4gICAgICB0cy5TY3JpcHRUYXJnZXQuTGF0ZXN0LFxuICAgICAgdHJ1ZVxuICAgICk7XG5cbiAgICBjb25zdCBtb2R1bGVUb0ltcG9ydCA9IG9wdGlvbnMuZWZmZWN0c1xuICAgICAgPyAnRW50aXR5RGF0YU1vZHVsZSdcbiAgICAgIDogJ0VudGl0eURhdGFNb2R1bGVXaXRob3V0RWZmZWN0cyc7XG4gICAgY29uc3QgZWZmZWN0c01vZHVsZUltcG9ydCA9IGluc2VydEltcG9ydChcbiAgICAgIHNvdXJjZSxcbiAgICAgIG1vZHVsZVBhdGgsXG4gICAgICBtb2R1bGVUb0ltcG9ydCxcbiAgICAgICdAbmdyeC9kYXRhJ1xuICAgICk7XG5cbiAgICBjb25zdCBbZGF0ZUVudGl0eU5nTW9kdWxlSW1wb3J0XSA9IGFkZEltcG9ydFRvTW9kdWxlKFxuICAgICAgc291cmNlLFxuICAgICAgbW9kdWxlUGF0aCxcbiAgICAgIG1vZHVsZVRvSW1wb3J0LFxuICAgICAgJydcbiAgICApO1xuXG4gICAgY29uc3QgY2hhbmdlcyA9IFtlZmZlY3RzTW9kdWxlSW1wb3J0LCBkYXRlRW50aXR5TmdNb2R1bGVJbXBvcnRdO1xuICAgIGNvbnN0IHJlY29yZGVyID0gaG9zdC5iZWdpblVwZGF0ZShtb2R1bGVQYXRoKTtcbiAgICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBjaGFuZ2VzKSB7XG4gICAgICBpZiAoY2hhbmdlIGluc3RhbmNlb2YgSW5zZXJ0Q2hhbmdlKSB7XG4gICAgICAgIHJlY29yZGVyLmluc2VydExlZnQoY2hhbmdlLnBvcywgY2hhbmdlLnRvQWRkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaG9zdC5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xuXG4gICAgcmV0dXJuIGhvc3Q7XG4gIH07XG59XG5cbmNvbnN0IHJlbmFtZXMgPSB7XG4gIE5ncnhEYXRhTW9kdWxlOiAnRW50aXR5RGF0YU1vZHVsZScsXG4gIE5ncnhEYXRhTW9kdWxlV2l0aG91dEVmZmVjdHM6ICdFbnRpdHlEYXRhTW9kdWxlV2l0aG91dEVmZmVjdHMnLFxuICBOZ3J4RGF0YU1vZHVsZUNvbmZpZzogJ0VudGl0eURhdGFNb2R1bGVDb25maWcnLFxufTtcblxuZnVuY3Rpb24gcmVtb3ZlQW5ndWxhck5nUnhEYXRhRnJvbVBhY2thZ2VKc29uKCkge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUpID0+IHtcbiAgICBpZiAoaG9zdC5leGlzdHMoJ3BhY2thZ2UuanNvbicpKSB7XG4gICAgICBjb25zdCBzb3VyY2VUZXh0ID0gaG9zdC5yZWFkKCdwYWNrYWdlLmpzb24nKSEudG9TdHJpbmcoJ3V0Zi04Jyk7XG4gICAgICBjb25zdCBqc29uID0gSlNPTi5wYXJzZShzb3VyY2VUZXh0KTtcblxuICAgICAgaWYgKGpzb25bJ2RlcGVuZGVuY2llcyddICYmIGpzb25bJ2RlcGVuZGVuY2llcyddWyduZ3J4LWRhdGEnXSkge1xuICAgICAgICBkZWxldGUganNvblsnZGVwZW5kZW5jaWVzJ11bJ25ncngtZGF0YSddO1xuICAgICAgfVxuXG4gICAgICBob3N0Lm92ZXJ3cml0ZSgncGFja2FnZS5qc29uJywgSlNPTi5zdHJpbmdpZnkoanNvbiwgbnVsbCwgMikpO1xuICAgIH1cblxuICAgIHJldHVybiBob3N0O1xuICB9O1xufVxuXG5mdW5jdGlvbiByZW5hbWVOZ3J4RGF0YU1vZHVsZShvcHRpb25zOiBFbnRpdHlEYXRhT3B0aW9ucykge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBob3N0LnZpc2l0KHBhdGggPT4ge1xuICAgICAgaWYgKCFwYXRoLmVuZHNXaXRoKCcudHMnKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNvdXJjZUZpbGUgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKFxuICAgICAgICBwYXRoLFxuICAgICAgICBob3N0LnJlYWQocGF0aCkhLnRvU3RyaW5nKCksXG4gICAgICAgIHRzLlNjcmlwdFRhcmdldC5MYXRlc3RcbiAgICAgICk7XG5cbiAgICAgIGlmIChzb3VyY2VGaWxlLmlzRGVjbGFyYXRpb25GaWxlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbmdyeERhdGFJbXBvcnRzID0gc291cmNlRmlsZS5zdGF0ZW1lbnRzXG4gICAgICAgIC5maWx0ZXIodHMuaXNJbXBvcnREZWNsYXJhdGlvbilcbiAgICAgICAgLmZpbHRlcihcbiAgICAgICAgICAoeyBtb2R1bGVTcGVjaWZpZXIgfSkgPT5cbiAgICAgICAgICAgIG1vZHVsZVNwZWNpZmllci5nZXRUZXh0KHNvdXJjZUZpbGUpID09PSBcIiduZ3J4LWRhdGEnXCJcbiAgICAgICAgKTtcblxuICAgICAgaWYgKG5ncnhEYXRhSW1wb3J0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjaGFuZ2VzID0gW1xuICAgICAgICAuLi5maW5kTmdyeERhdGFJbXBvcnRzKHNvdXJjZUZpbGUsIG5ncnhEYXRhSW1wb3J0cyksXG4gICAgICAgIC4uLmZpbmROZ3J4RGF0YUltcG9ydERlY2xhcmF0aW9ucyhzb3VyY2VGaWxlLCBuZ3J4RGF0YUltcG9ydHMpLFxuICAgICAgICAuLi5maW5kTmdyeERhdGFSZXBsYWNlbWVudHMoc291cmNlRmlsZSksXG4gICAgICBdO1xuXG4gICAgICBpZiAoY2hhbmdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZWNvcmRlciA9IGNyZWF0ZUNoYW5nZVJlY29yZGVyKGhvc3QsIHBhdGgsIGNoYW5nZXMpO1xuICAgICAgaG9zdC5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xuICAgIH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBmaW5kTmdyeERhdGFJbXBvcnRzKFxuICBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLFxuICBpbXBvcnRzOiB0cy5JbXBvcnREZWNsYXJhdGlvbltdXG4pIHtcbiAgY29uc3QgY2hhbmdlcyA9IGltcG9ydHMubWFwKHNwZWNpZmllciA9PlxuICAgIGNyZWF0ZVJlcGxhY2VDaGFuZ2UoXG4gICAgICBzb3VyY2VGaWxlLFxuICAgICAgc3BlY2lmaWVyLm1vZHVsZVNwZWNpZmllcixcbiAgICAgIFwiJ25ncngtZGF0YSdcIixcbiAgICAgIFwiJ0BuZ3J4L2RhdGEnXCJcbiAgICApXG4gICk7XG5cbiAgcmV0dXJuIGNoYW5nZXM7XG59XG5cbmZ1bmN0aW9uIGZpbmROZ3J4RGF0YUltcG9ydERlY2xhcmF0aW9ucyhcbiAgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSxcbiAgaW1wb3J0czogdHMuSW1wb3J0RGVjbGFyYXRpb25bXVxuKSB7XG4gIGNvbnN0IGNoYW5nZXMgPSBpbXBvcnRzXG4gICAgLm1hcChwID0+IChwLmltcG9ydENsYXVzZSEubmFtZWRCaW5kaW5ncyEgYXMgdHMuTmFtZWRJbXBvcnRzKS5lbGVtZW50cylcbiAgICAucmVkdWNlKChpbXBvcnRzLCBjdXJyKSA9PiBpbXBvcnRzLmNvbmNhdChjdXJyKSwgW10gYXMgdHMuSW1wb3J0U3BlY2lmaWVyW10pXG4gICAgLm1hcChzcGVjaWZpZXIgPT4ge1xuICAgICAgaWYgKCF0cy5pc0ltcG9ydFNwZWNpZmllcihzcGVjaWZpZXIpKSB7XG4gICAgICAgIHJldHVybiB7IGhpdDogZmFsc2UgfTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbmdyeERhdGFJbXBvcnRzID0gT2JqZWN0LmtleXMocmVuYW1lcyk7XG4gICAgICBpZiAobmdyeERhdGFJbXBvcnRzLmluY2x1ZGVzKHNwZWNpZmllci5uYW1lLnRleHQpKSB7XG4gICAgICAgIHJldHVybiB7IGhpdDogdHJ1ZSwgc3BlY2lmaWVyLCB0ZXh0OiBzcGVjaWZpZXIubmFtZS50ZXh0IH07XG4gICAgICB9XG5cbiAgICAgIC8vIGlmIGltcG9ydCBpcyByZW5hbWVkXG4gICAgICBpZiAoXG4gICAgICAgIHNwZWNpZmllci5wcm9wZXJ0eU5hbWUgJiZcbiAgICAgICAgbmdyeERhdGFJbXBvcnRzLmluY2x1ZGVzKHNwZWNpZmllci5wcm9wZXJ0eU5hbWUudGV4dClcbiAgICAgICkge1xuICAgICAgICByZXR1cm4geyBoaXQ6IHRydWUsIHNwZWNpZmllciwgdGV4dDogc3BlY2lmaWVyLnByb3BlcnR5TmFtZS50ZXh0IH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7IGhpdDogZmFsc2UgfTtcbiAgICB9KVxuICAgIC5maWx0ZXIoKHsgaGl0IH0pID0+IGhpdClcbiAgICAubWFwKCh7IHNwZWNpZmllciwgdGV4dCB9KSA9PlxuICAgICAgY3JlYXRlUmVwbGFjZUNoYW5nZShcbiAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgc3BlY2lmaWVyISxcbiAgICAgICAgdGV4dCEsXG4gICAgICAgIChyZW5hbWVzIGFzIGFueSlbdGV4dCFdXG4gICAgICApXG4gICAgKTtcblxuICByZXR1cm4gY2hhbmdlcztcbn1cblxuZnVuY3Rpb24gZmluZE5ncnhEYXRhUmVwbGFjZW1lbnRzKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpIHtcbiAgY29uc3QgcmVuYW1lS2V5cyA9IE9iamVjdC5rZXlzKHJlbmFtZXMpO1xuICBsZXQgY2hhbmdlczogUmVwbGFjZUNoYW5nZVtdID0gW107XG4gIHRzLmZvckVhY2hDaGlsZChzb3VyY2VGaWxlLCBub2RlID0+IGZpbmQobm9kZSwgY2hhbmdlcykpO1xuICByZXR1cm4gY2hhbmdlcztcblxuICBmdW5jdGlvbiBmaW5kKG5vZGU6IHRzLk5vZGUsIGNoYW5nZXM6IFJlcGxhY2VDaGFuZ2VbXSkge1xuICAgIGxldCBjaGFuZ2UgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAoXG4gICAgICB0cy5pc1Byb3BlcnR5QXNzaWdubWVudChub2RlKSAmJlxuICAgICAgcmVuYW1lS2V5cy5pbmNsdWRlcyhub2RlLmluaXRpYWxpemVyLmdldFRleHQoc291cmNlRmlsZSkpXG4gICAgKSB7XG4gICAgICBjaGFuZ2UgPSB7XG4gICAgICAgIG5vZGU6IG5vZGUuaW5pdGlhbGl6ZXIsXG4gICAgICAgIHRleHQ6IG5vZGUuaW5pdGlhbGl6ZXIuZ2V0VGV4dChzb3VyY2VGaWxlKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgdHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZSkgJiZcbiAgICAgIHJlbmFtZUtleXMuaW5jbHVkZXMobm9kZS5leHByZXNzaW9uLmdldFRleHQoc291cmNlRmlsZSkpXG4gICAgKSB7XG4gICAgICBjaGFuZ2UgPSB7XG4gICAgICAgIG5vZGU6IG5vZGUuZXhwcmVzc2lvbixcbiAgICAgICAgdGV4dDogbm9kZS5leHByZXNzaW9uLmdldFRleHQoc291cmNlRmlsZSksXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHRzLmlzVmFyaWFibGVEZWNsYXJhdGlvbihub2RlKSAmJlxuICAgICAgbm9kZS50eXBlICYmXG4gICAgICByZW5hbWVLZXlzLmluY2x1ZGVzKG5vZGUudHlwZS5nZXRUZXh0KHNvdXJjZUZpbGUpKVxuICAgICkge1xuICAgICAgY2hhbmdlID0ge1xuICAgICAgICBub2RlOiBub2RlLnR5cGUsXG4gICAgICAgIHRleHQ6IG5vZGUudHlwZS5nZXRUZXh0KHNvdXJjZUZpbGUpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlKSB7XG4gICAgICBjaGFuZ2VzLnB1c2goXG4gICAgICAgIGNyZWF0ZVJlcGxhY2VDaGFuZ2UoXG4gICAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgICBjaGFuZ2Uubm9kZSxcbiAgICAgICAgICBjaGFuZ2UudGV4dCxcbiAgICAgICAgICAocmVuYW1lcyBhcyBhbnkpW2NoYW5nZS50ZXh0XVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIHRzLmZvckVhY2hDaGlsZChub2RlLCBjaGlsZE5vZGUgPT4gZmluZChjaGlsZE5vZGUsIGNoYW5nZXMpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB0aHJvd0lmTW9kdWxlTm90U3BlY2lmaWVkKGhvc3Q6IFRyZWUsIG1vZHVsZT86IHN0cmluZykge1xuICBpZiAoIW1vZHVsZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignTW9kdWxlIG5vdCBzcGVjaWZpZWQnKTtcbiAgfVxuXG4gIGlmICghaG9zdC5leGlzdHMobW9kdWxlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignU3BlY2lmaWVkIG1vZHVsZSBkb2VzIG5vdCBleGlzdCcpO1xuICB9XG5cbiAgY29uc3QgdGV4dCA9IGhvc3QucmVhZChtb2R1bGUpO1xuICBpZiAodGV4dCA9PT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBGaWxlICR7bW9kdWxlfSBkb2VzIG5vdCBleGlzdC5gKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvcHRpb25zOiBFbnRpdHlEYXRhT3B0aW9ucyk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICAob3B0aW9ucyBhcyBhbnkpLm5hbWUgPSAnJztcbiAgICBvcHRpb25zLnBhdGggPSBnZXRQcm9qZWN0UGF0aChob3N0LCBvcHRpb25zKTtcbiAgICBvcHRpb25zLmVmZmVjdHMgPSBvcHRpb25zLmVmZmVjdHMgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBvcHRpb25zLmVmZmVjdHM7XG4gICAgb3B0aW9ucy5tb2R1bGUgPSBvcHRpb25zLm1vZHVsZVxuICAgICAgPyBmaW5kTW9kdWxlRnJvbU9wdGlvbnMoaG9zdCwgb3B0aW9ucyBhcyBhbnkpXG4gICAgICA6IG9wdGlvbnMubW9kdWxlO1xuXG4gICAgY29uc3QgcGFyc2VkUGF0aCA9IHBhcnNlTmFtZShvcHRpb25zLnBhdGgsICcnKTtcbiAgICBvcHRpb25zLnBhdGggPSBwYXJzZWRQYXRoLnBhdGg7XG5cbiAgICByZXR1cm4gY2hhaW4oW1xuICAgICAgb3B0aW9ucyAmJiBvcHRpb25zLnNraXBQYWNrYWdlSnNvbiA/IG5vb3AoKSA6IGFkZE5nUnhEYXRhVG9QYWNrYWdlSnNvbigpLFxuICAgICAgb3B0aW9ucy5taWdyYXRlTmdyeERhdGFcbiAgICAgICAgPyBjaGFpbihbXG4gICAgICAgICAgICByZW1vdmVBbmd1bGFyTmdSeERhdGFGcm9tUGFja2FnZUpzb24oKSxcbiAgICAgICAgICAgIHJlbmFtZU5ncnhEYXRhTW9kdWxlKG9wdGlvbnMpLFxuICAgICAgICAgIF0pXG4gICAgICAgIDogYWRkRW50aXR5RGF0YVRvTmdNb2R1bGUob3B0aW9ucyksXG4gICAgXSkoaG9zdCwgY29udGV4dCk7XG4gIH07XG59XG4iXX0=