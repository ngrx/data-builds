import { Action } from '@ngrx/store';
import { DataServiceError, EntityActionDataServiceError } from './data-service-error';
import { EntityAction } from '../actions/entity-action';
import { EntityActionFactory } from '../actions/entity-action-factory';
import { Logger } from '../utils/interfaces';
/**
 * Handling of responses from persistence operation
 */
export declare abstract class PersistenceResultHandler {
    /** Handle successful result of persistence operation for an action */
    abstract handleSuccess(originalAction: EntityAction): (data: any) => Action;
    /** Handle error result of persistence operation for an action */
    abstract handleError(originalAction: EntityAction): (error: DataServiceError | Error) => EntityAction<EntityActionDataServiceError>;
}
/**
 * Default handling of responses from persistence operation,
 * specifically an EntityDataService
 */
export declare class DefaultPersistenceResultHandler implements PersistenceResultHandler {
    private logger;
    private entityActionFactory;
    constructor(logger: Logger, entityActionFactory: EntityActionFactory);
    /** Handle successful result of persistence operation on an EntityAction */
    handleSuccess(originalAction: EntityAction): (data: any) => Action;
    /** Handle error result of persistence operation on an EntityAction */
    handleError(originalAction: EntityAction): (error: DataServiceError | Error) => EntityAction<EntityActionDataServiceError>;
}
