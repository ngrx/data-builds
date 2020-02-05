/// <amd-module name="@ngrx/data/src/reducers/entity-cache" />
import { EntityCollection } from './entity-collection';
export interface EntityCache {
    [name: string]: EntityCollection<any>;
}
