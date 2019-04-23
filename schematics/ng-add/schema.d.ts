/// <amd-module name="@ngrx/data/schematics/ng-add/schema" />
export interface Schema {
    path?: string;
    effects?: boolean;
    skipPackageJson?: boolean;
    project?: string;
    module?: string;
    migrateNgrxData?: boolean;
}
