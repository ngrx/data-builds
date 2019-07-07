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
            ])(host, context);
        };
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc2NoZW1hdGljcy9uZy1hZGQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSxpQ0FBaUM7SUFDakMsMkRBT29DO0lBQ3BDLDREQUEwRTtJQUMxRSxnRUFZb0M7SUFHcEMsU0FBUyx3QkFBd0I7UUFDL0IsT0FBTyxDQUFDLElBQVUsRUFBRSxPQUF5QixFQUFFLEVBQUU7WUFDL0MseUNBQXVCLENBQ3JCLElBQUksRUFDSixjQUFjLEVBQ2QsWUFBWSxFQUNaLGlDQUFlLENBQ2hCLENBQUM7WUFDRixPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksOEJBQXNCLEVBQUUsQ0FBQyxDQUFDO1lBQzlDLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELFNBQVMsdUJBQXVCLENBQUMsT0FBMEI7UUFDekQsT0FBTyxDQUFDLElBQVUsRUFBRSxFQUFFO1lBQ3BCLHlCQUF5QixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFaEQsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU8sQ0FBQztZQUNuQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRS9DLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FDaEMsVUFBVSxFQUNWLElBQUksRUFDSixFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFDdEIsSUFBSSxDQUNMLENBQUM7WUFFRixNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsT0FBTztnQkFDcEMsQ0FBQyxDQUFDLGtCQUFrQjtnQkFDcEIsQ0FBQyxDQUFDLGdDQUFnQyxDQUFDO1lBQ3JDLE1BQU0sbUJBQW1CLEdBQUcsOEJBQVksQ0FDdEMsTUFBTSxFQUNOLFVB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QyxJQUFVLEVBQUUsT0FBeUIsRUFBRSxFQUFFO1lBQzlDLE9BQWUsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQzNCLE9BQU8sQ0FBQyxJQUFJLEdBQUcsZ0NBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDN0MsT0FBTyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQ3pFLE9BQU8sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU07Z0JBQzdCLENBQUMsQ0FBQyx1Q0FBcUIsQ0FBQyxJQUFJLEVBQUUsT0FBYyxDQUFDO2dCQUM3QyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztZQUVuQixNQUFNLFVBQVUsR0FBRywyQkFBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDL0MsT0FBTyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDO1lBRS9CLE9BQU8sa0JBQUssQ0FBQztnQkFDWCxPQUFPLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsaUJBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsRUFBRTtnQkFDeEUsT0FBTyxDQUFDLGVBQWU7b0JBQ3JCLENBQUMsQ0FBQyxrQkFBSyxDQUFDO3dCQUNKLG9DQUFvQyxFQUFFO3dCQUN0QyxvQkFBb0IsRUFBRTtxQkFDdkIsQ0FBQztvQkFDSixDQUFDLENBQUMsdUJBQXVCLENBQUMsT0FBTyxDQUFDO2FBQ3JDLENBQUMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDcEIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQXRCRCw0QkFzQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7XG4gIFJ1bGUsXG4gIFNjaGVtYXRpY0NvbnRleHQsXG4gIFRyZWUsXG4gIGNoYWluLFxuICBub29wLFxuICBTY2hlbWF0aWNzRXhjZXB0aW9uLFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQgeyBOb2RlUGFja2FnZUluc3RhbGxUYXNrIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdGFza3MnO1xuaW1wb3J0IHtcbiAgYWRkUGFja2FnZVRvUGFja2FnZUpzb24sXG4gIHBsYXRmb3JtVmVyc2lvbixcbiAgZmluZE1vZHVsZUZyb21PcHRpb25zLFxuICBpbnNlcnRJbXBvcnQsXG4gIGdldFByb2plY3RQYXRoLFxuICBwYXJzZU5hbWUsXG4gIGFkZEltcG9ydFRvTW9kdWxlLFxuICBjcmVhdGVSZXBsYWNlQ2hhbmdlLFxuICBSZXBsYWNlQ2hhbmdlLFxuICB2aXNpdFRTU291cmNlRmlsZXMsXG4gIGNvbW1pdENoYW5nZXMsXG59IGZyb20gJ0BuZ3J4L2RhdGEvc2NoZW1hdGljcy1jb3JlJztcbmltcG9ydCB7IFNjaGVtYSBhcyBFbnRpdHlEYXRhT3B0aW9ucyB9IGZyb20gJy4vc2NoZW1hJztcblxuZnVuY3Rpb24gYWRkTmdSeERhdGFUb1BhY2thZ2VKc29uKCkge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBhZGRQYWNrYWdlVG9QYWNrYWdlSnNvbihcbiAgICAgIGhvc3QsXG4gICAgICAnZGVwZW5kZW5jaWVzJyxcbiAgICAgICdAbmdyeC9kYXRhJyxcbiAgICAgIHBsYXRmb3JtVmVyc2lvblxuICAgICk7XG4gICAgY29udGV4dC5hZGRUYXNrKG5ldyBOb2RlUGFja2FnZUluc3RhbGxUYXNrKCkpO1xuICAgIHJldHVybiBob3N0O1xuICB9O1xufVxuXG5mdW5jdGlvbiBhZGRFbnRpdHlEYXRhVG9OZ01vZHVsZShvcHRpb25zOiBFbnRpdHlEYXRhT3B0aW9ucyk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUpID0+IHtcbiAgICB0aHJvd0lmTW9kdWxlTm90U3BlY2lmaWVkKGhvc3QsIG9wdGlvbnMubW9kdWxlKTtcblxuICAgIGNvbnN0IG1vZHVsZVBhdGggPSBvcHRpb25zLm1vZHVsZSE7XG4gICAgY29uc3QgdGV4dCA9IGhvc3QucmVhZChtb2R1bGVQYXRoKSEudG9TdHJpbmcoKTtcblxuICAgIGNvbnN0IHNvdXJjZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoXG4gICAgICBtb2R1bGVQYXRoLFxuICAgICAgdGV4dCxcbiAgICAgIHRzLlNjcmlwdFRhcmdldC5MYXRlc3QsXG4gICAgICB0cnVlXG4gICAgKTtcblxuICAgIGNvbnN0IG1vZHVsZVRvSW1wb3J0ID0gb3B0aW9ucy5lZmZlY3RzXG4gICAgICA/ICdFbnRpdHlEYXRhTW9kdWxlJ1xuICAgICAgOiAnRW50aXR5RGF0YU1vZHVsZVdpdGhvdXRFZmZlY3RzJztcbiAgICBjb25zdCBlZmZlY3RzTW9kdWxlSW1wb3J0ID0gaW5zZXJ0SW1wb3J0KFxuICAgICAgc291cmNlLFxuICAgICAgbW9kdWxlUGF0aCxcbiAgICAgIG1vZHVsZVRvSW1wb3J0LFxuICAgICAgJ0BuZ3J4L2RhdGEnXG4gICAgKTtcblxuICAgIGNvbnN0IFtkYXRlRW50aXR5TmdNb2R1bGVJbXBvcnRdID0gYWRkSW1wb3J0VG9Nb2R1bGUoXG4gICAgICBzb3VyY2UsXG4gICAgICBtb2R1bGVQYXRoLFxuICAgICAgbW9kdWxlVG9JbXBvcnQsXG4gICAgICAnJ1xuICAgICk7XG5cbiAgICBjb25zdCBjaGFuZ2VzID0gW2VmZmVjdHNNb2R1bGVJbXBvcnQsIGRhdGVFbnRpdHlOZ01vZHVsZUltcG9ydF07XG4gICAgY29tbWl0Q2hhbmdlcyhob3N0LCBzb3VyY2UuZmlsZU5hbWUsIGNoYW5nZXMpO1xuXG4gICAgcmV0dXJuIGhvc3Q7XG4gIH07XG59XG5cbmNvbnN0IHJlbmFtZXMgPSB7XG4gIE5ncnhEYXRhTW9kdWxlOiAnRW50aXR5RGF0YU1vZHVsZScsXG4gIE5ncnhEYXRhTW9kdWxlV2l0aG91dEVmZmVjdHM6ICdFbnRpdHlEYXRhTW9kdWxlV2l0aG91dEVmZmVjdHMnLFxuICBOZ3J4RGF0YU1vZHVsZUNvbmZpZzogJ0VudGl0eURhdGFNb2R1bGVDb25maWcnLFxufTtcblxuZnVuY3Rpb24gcmVtb3ZlQW5ndWxhck5nUnhEYXRhRnJvbVBhY2thZ2VKc29uKCkge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUpID0+IHtcbiAgICBpZiAoaG9zdC5leGlzdHMoJ3BhY2thZ2UuanNvbicpKSB7XG4gICAgICBjb25zdCBzb3VyY2VUZXh0ID0gaG9zdC5yZWFkKCdwYWNrYWdlLmpzb24nKSEudG9TdHJpbmcoJ3V0Zi04Jyk7XG4gICAgICBjb25zdCBqc29uID0gSlNPTi5wYXJzZShzb3VyY2VUZXh0KTtcblxuICAgICAgaWYgKGpzb25bJ2RlcGVuZGVuY2llcyddICYmIGpzb25bJ2RlcGVuZGVuY2llcyddWyduZ3J4LWRhdGEnXSkge1xuICAgICAgICBkZWxldGUganNvblsnZGVwZW5kZW5jaWVzJ11bJ25ncngtZGF0YSddO1xuICAgICAgfVxuXG4gICAgICBob3N0Lm92ZXJ3cml0ZSgncGFja2FnZS5qc29uJywgSlNPTi5zdHJpbmdpZnkoanNvbiwgbnVsbCwgMikpO1xuICAgIH1cblxuICAgIHJldHVybiBob3N0O1xuICB9O1xufVxuXG5mdW5jdGlvbiByZW5hbWVOZ3J4RGF0YU1vZHVsZSgpIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlKSA9PiB7XG4gICAgdmlzaXRUU1NvdXJjZUZpbGVzKGhvc3QsIHNvdXJjZUZpbGUgPT4ge1xuICAgICAgY29uc3QgbmdyeERhdGFJbXBvcnRzID0gc291cmNlRmlsZS5zdGF0ZW1lbnRzXG4gICAgICAgIC5maWx0ZXIodHMuaXNJbXBvcnREZWNsYXJhdGlvbilcbiAgICAgICAgLmZpbHRlcihcbiAgICAgICAgICAoeyBtb2R1bGVTcGVjaWZpZXIgfSkgPT5cbiAgICAgICAgICAgIG1vZHVsZVNwZWNpZmllci5nZXRUZXh0KHNvdXJjZUZpbGUpID09PSBcIiduZ3J4LWRhdGEnXCJcbiAgICAgICAgKTtcblxuICAgICAgaWYgKG5ncnhEYXRhSW1wb3J0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjaGFuZ2VzID0gW1xuICAgICAgICAuLi5maW5kTmdyeERhdGFJbXBvcnRzKHNvdXJjZUZpbGUsIG5ncnhEYXRhSW1wb3J0cyksXG4gICAgICAgIC4uLmZpbmROZ3J4RGF0YUltcG9ydERlY2xhcmF0aW9ucyhzb3VyY2VGaWxlLCBuZ3J4RGF0YUltcG9ydHMpLFxuICAgICAgICAuLi5maW5kTmdyeERhdGFSZXBsYWNlbWVudHMoc291cmNlRmlsZSksXG4gICAgICBdO1xuXG4gICAgICBjb21taXRDaGFuZ2VzKGhvc3QsIHNvdXJjZUZpbGUuZmlsZU5hbWUsIGNoYW5nZXMpO1xuICAgIH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBmaW5kTmdyeERhdGFJbXBvcnRzKFxuICBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLFxuICBpbXBvcnRzOiB0cy5JbXBvcnREZWNsYXJhdGlvbltdXG4pIHtcbiAgY29uc3QgY2hhbmdlcyA9IGltcG9ydHMubWFwKHNwZWNpZmllciA9PlxuICAgIGNyZWF0ZVJlcGxhY2VDaGFuZ2UoXG4gICAgICBzb3VyY2VGaWxlLFxuICAgICAgc3BlY2lmaWVyLm1vZHVsZVNwZWNpZmllcixcbiAgICAgIFwiJ25ncngtZGF0YSdcIixcbiAgICAgIFwiJ0BuZ3J4L2RhdGEnXCJcbiAgICApXG4gICk7XG5cbiAgcmV0dXJuIGNoYW5nZXM7XG59XG5cbmZ1bmN0aW9uIGZpbmROZ3J4RGF0YUltcG9ydERlY2xhcmF0aW9ucyhcbiAgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSxcbiAgaW1wb3J0czogdHMuSW1wb3J0RGVjbGFyYXRpb25bXVxuKSB7XG4gIGNvbnN0IGNoYW5nZXMgPSBpbXBvcnRzXG4gICAgLm1hcChwID0+IChwLmltcG9ydENsYXVzZSEubmFtZWRCaW5kaW5ncyEgYXMgdHMuTmFtZWRJbXBvcnRzKS5lbGVtZW50cylcbiAgICAucmVkdWNlKChpbXBvcnRzLCBjdXJyKSA9PiBpbXBvcnRzLmNvbmNhdChjdXJyKSwgW10gYXMgdHMuSW1wb3J0U3BlY2lmaWVyW10pXG4gICAgLm1hcChzcGVjaWZpZXIgPT4ge1xuICAgICAgaWYgKCF0cy5pc0ltcG9ydFNwZWNpZmllcihzcGVjaWZpZXIpKSB7XG4gICAgICAgIHJldHVybiB7IGhpdDogZmFsc2UgfTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbmdyeERhdGFJbXBvcnRzID0gT2JqZWN0LmtleXMocmVuYW1lcyk7XG4gICAgICBpZiAobmdyeERhdGFJbXBvcnRzLmluY2x1ZGVzKHNwZWNpZmllci5uYW1lLnRleHQpKSB7XG4gICAgICAgIHJldHVybiB7IGhpdDogdHJ1ZSwgc3BlY2lmaWVyLCB0ZXh0OiBzcGVjaWZpZXIubmFtZS50ZXh0IH07XG4gICAgICB9XG5cbiAgICAgIC8vIGlmIGltcG9ydCBpcyByZW5hbWVkXG4gICAgICBpZiAoXG4gICAgICAgIHNwZWNpZmllci5wcm9wZXJ0eU5hbWUgJiZcbiAgICAgICAgbmdyeERhdGFJbXBvcnRzLmluY2x1ZGVzKHNwZWNpZmllci5wcm9wZXJ0eU5hbWUudGV4dClcbiAgICAgICkge1xuICAgICAgICByZXR1cm4geyBoaXQ6IHRydWUsIHNwZWNpZmllciwgdGV4dDogc3BlY2lmaWVyLnByb3BlcnR5TmFtZS50ZXh0IH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7IGhpdDogZmFsc2UgfTtcbiAgICB9KVxuICAgIC5maWx0ZXIoKHsgaGl0IH0pID0+IGhpdClcbiAgICAubWFwKCh7IHNwZWNpZmllciwgdGV4dCB9KSA9PlxuICAgICAgY3JlYXRlUmVwbGFjZUNoYW5nZShcbiAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgc3BlY2lmaWVyISxcbiAgICAgICAgdGV4dCEsXG4gICAgICAgIChyZW5hbWVzIGFzIGFueSlbdGV4dCFdXG4gICAgICApXG4gICAgKTtcblxuICByZXR1cm4gY2hhbmdlcztcbn1cblxuZnVuY3Rpb24gZmluZE5ncnhEYXRhUmVwbGFjZW1lbnRzKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpIHtcbiAgY29uc3QgcmVuYW1lS2V5cyA9IE9iamVjdC5rZXlzKHJlbmFtZXMpO1xuICBsZXQgY2hhbmdlczogUmVwbGFjZUNoYW5nZVtdID0gW107XG4gIHRzLmZvckVhY2hDaGlsZChzb3VyY2VGaWxlLCBub2RlID0+IGZpbmQobm9kZSwgY2hhbmdlcykpO1xuICByZXR1cm4gY2hhbmdlcztcblxuICBmdW5jdGlvbiBmaW5kKG5vZGU6IHRzLk5vZGUsIGNoYW5nZXM6IFJlcGxhY2VDaGFuZ2VbXSkge1xuICAgIGxldCBjaGFuZ2UgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAoXG4gICAgICB0cy5pc1Byb3BlcnR5QXNzaWdubWVudChub2RlKSAmJlxuICAgICAgcmVuYW1lS2V5cy5pbmNsdWRlcyhub2RlLmluaXRpYWxpemVyLmdldFRleHQoc291cmNlRmlsZSkpXG4gICAgKSB7XG4gICAgICBjaGFuZ2UgPSB7XG4gICAgICAgIG5vZGU6IG5vZGUuaW5pdGlhbGl6ZXIsXG4gICAgICAgIHRleHQ6IG5vZGUuaW5pdGlhbGl6ZXIuZ2V0VGV4dChzb3VyY2VGaWxlKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgdHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZSkgJiZcbiAgICAgIHJlbmFtZUtleXMuaW5jbHVkZXMobm9kZS5leHByZXNzaW9uLmdldFRleHQoc291cmNlRmlsZSkpXG4gICAgKSB7XG4gICAgICBjaGFuZ2UgPSB7XG4gICAgICAgIG5vZGU6IG5vZGUuZXhwcmVzc2lvbixcbiAgICAgICAgdGV4dDogbm9kZS5leHByZXNzaW9uLmdldFRleHQoc291cmNlRmlsZSksXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHRzLmlzVmFyaWFibGVEZWNsYXJhdGlvbihub2RlKSAmJlxuICAgICAgbm9kZS50eXBlICYmXG4gICAgICByZW5hbWVLZXlzLmluY2x1ZGVzKG5vZGUudHlwZS5nZXRUZXh0KHNvdXJjZUZpbGUpKVxuICAgICkge1xuICAgICAgY2hhbmdlID0ge1xuICAgICAgICBub2RlOiBub2RlLnR5cGUsXG4gICAgICAgIHRleHQ6IG5vZGUudHlwZS5nZXRUZXh0KHNvdXJjZUZpbGUpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlKSB7XG4gICAgICBjaGFuZ2VzLnB1c2goXG4gICAgICAgIGNyZWF0ZVJlcGxhY2VDaGFuZ2UoXG4gICAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgICBjaGFuZ2Uubm9kZSxcbiAgICAgICAgICBjaGFuZ2UudGV4dCxcbiAgICAgICAgICAocmVuYW1lcyBhcyBhbnkpW2NoYW5nZS50ZXh0XVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIHRzLmZvckVhY2hDaGlsZChub2RlLCBjaGlsZE5vZGUgPT4gZmluZChjaGlsZE5vZGUsIGNoYW5nZXMpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB0aHJvd0lmTW9kdWxlTm90U3BlY2lmaWVkKGhvc3Q6IFRyZWUsIG1vZHVsZT86IHN0cmluZykge1xuICBpZiAoIW1vZHVsZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignTW9kdWxlIG5vdCBzcGVjaWZpZWQnKTtcbiAgfVxuXG4gIGlmICghaG9zdC5leGlzdHMobW9kdWxlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignU3BlY2lmaWVkIG1vZHVsZSBkb2VzIG5vdCBleGlzdCcpO1xuICB9XG5cbiAgY29uc3QgdGV4dCA9IGhvc3QucmVhZChtb2R1bGUpO1xuICBpZiAodGV4dCA9PT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBGaWxlICR7bW9kdWxlfSBkb2VzIG5vdCBleGlzdC5gKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvcHRpb25zOiBFbnRpdHlEYXRhT3B0aW9ucyk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICAob3B0aW9ucyBhcyBhbnkpLm5hbWUgPSAnJztcbiAgICBvcHRpb25zLnBhdGggPSBnZXRQcm9qZWN0UGF0aChob3N0LCBvcHRpb25zKTtcbiAgICBvcHRpb25zLmVmZmVjdHMgPSBvcHRpb25zLmVmZmVjdHMgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBvcHRpb25zLmVmZmVjdHM7XG4gICAgb3B0aW9ucy5tb2R1bGUgPSBvcHRpb25zLm1vZHVsZVxuICAgICAgPyBmaW5kTW9kdWxlRnJvbU9wdGlvbnMoaG9zdCwgb3B0aW9ucyBhcyBhbnkpXG4gICAgICA6IG9wdGlvbnMubW9kdWxlO1xuXG4gICAgY29uc3QgcGFyc2VkUGF0aCA9IHBhcnNlTmFtZShvcHRpb25zLnBhdGgsICcnKTtcbiAgICBvcHRpb25zLnBhdGggPSBwYXJzZWRQYXRoLnBhdGg7XG5cbiAgICByZXR1cm4gY2hhaW4oW1xuICAgICAgb3B0aW9ucyAmJiBvcHRpb25zLnNraXBQYWNrYWdlSnNvbiA/IG5vb3AoKSA6IGFkZE5nUnhEYXRhVG9QYWNrYWdlSnNvbigpLFxuICAgICAgb3B0aW9ucy5taWdyYXRlTmdyeERhdGFcbiAgICAgICAgPyBjaGFpbihbXG4gICAgICAgICAgICByZW1vdmVBbmd1bGFyTmdSeERhdGFGcm9tUGFja2FnZUpzb24oKSxcbiAgICAgICAgICAgIHJlbmFtZU5ncnhEYXRhTW9kdWxlKCksXG4gICAgICAgICAgXSlcbiAgICAgICAgOiBhZGRFbnRpdHlEYXRhVG9OZ01vZHVsZShvcHRpb25zKSxcbiAgICBdKShob3N0LCBjb250ZXh0KTtcbiAgfTtcbn1cbiJdfQ==