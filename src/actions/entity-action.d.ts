import { Action } from '@ngrx/store';
import { EntityOp } from './entity-op';
import { MergeStrategy } from './merge-strategy';
import { HttpOptions } from '../dataservices/interfaces';
/** Action concerning an entity collection. */
export interface EntityAction<P = any> extends Action {
    readonly type: string;
    readonly payload: EntityActionPayload<P>;
}
/** Options of an EntityAction */
export interface EntityActionOptions {
    /** Correlate related EntityActions, particularly related saves. Must be serializable. */
    readonly correlationId?: any;
    /** True if should perform action optimistically (before server responds) */
    readonly isOptimistic?: boolean;
    readonly mergeStrategy?: MergeStrategy;
    /** The tag to use in the action's type. The entityName if no tag specified. */
    readonly tag?: string;
    /** Options that will be passed to the dataService http request. Allows setting of Query Parameters and Headers */
    readonly httpOptions?: HttpOptions;
    /**
     * The action was determined (usually by a reducer) to be in error.
     * Downstream effects should not process but rather treat it as an error.
     */
    error?: Error;
    /**
     * Downstream effects should skip processing this action but should return
     * an innocuous Observable<Action> of success.
     */
    skip?: boolean;
}
/** Payload of an EntityAction */
export interface EntityActionPayload<P = any> extends EntityActionOptions {
    readonly entityName: string;
    readonly entityOp: EntityOp;
    readonly data?: P;
}
