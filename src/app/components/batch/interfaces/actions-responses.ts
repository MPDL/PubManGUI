import { BatchProcessMessages } from 'src/app/model/inge';

export interface actionGenericResponse {
    userAccountObjectId: string,
    state: string,
    numberOfItems: number,
    method: string,
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
        state: string,
        numberOfItems: number,
        method: string,
        startDate: Date,
        endDate: Date,
        batchLogHeaderId: number
}

export interface getBatchProcessLogDetailsResponse {
      batchProcessLogDetailId: number,
      batchProcessLogHeaderDbVO: BatchProcessLogHeaderDbVO,
      itemObjectId: string,
      itemVersionnumber: number,
      state: string,
      message: BatchProcessMessages,
      startDate: Date,
      endDate: Date
}

export interface ipList {
    name: string,
    id: string,
    ipRanges: string[]
}
