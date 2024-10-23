import { BatchProcessMessages, BatchProcessMethod, BatchProcessLogHeaderState, BatchProcessLogDetailState } from 'src/app/model/inge';

export interface importGenericResponse {
    userAccountObjectId: string,
    state: string,
    numberOfItems: number,
    method: BatchProcessMethod,
    startDate: Date,
    endDate: Date,
    batchLogHeaderId: number,
}

export interface getBatchProcessUserLockResponse {
    userAccountObjectId: string,
    lockDate: Date,
}

export interface BatchProcessLogHeaderDbVO {
        userAccountObjectId: string,
        state: BatchProcessLogHeaderState,
        numberOfItems: number,
        percentageOfProcessedItems: number,
        method: BatchProcessMethod,
        startDate: Date,
        endDate: Date,
        batchLogHeaderId: number
}

export interface getBatchProcessLogDetailsResponse {
      batchProcessLogDetailId: number,
      batchProcessLogHeaderDbVO: BatchProcessLogHeaderDbVO,
      itemObjectId: string,
      itemVersionnumber: number,
      state: BatchProcessLogDetailState,
      message: BatchProcessMessages,
      startDate: Date,
      endDate: Date
}

export interface ipList {
    name: string,
    id: string,
    ipRanges: string[]
}
