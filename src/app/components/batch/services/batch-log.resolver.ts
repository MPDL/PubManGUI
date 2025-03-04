import { ResolveFn } from '@angular/router';
import { EMPTY } from "rxjs";
import { inject } from "@angular/core";
import { BatchService } from 'src/app/components/batch/services/batch.service';
import { BatchProcessLogHeaderDbVO } from '../interfaces/batch-responses';

export const batchLogResolver: ResolveFn<BatchProcessLogHeaderDbVO> = (route, state) => {
  const batchSvc = inject(BatchService);

  try {
    return batchSvc.getBatchProcessLogHeaderId(Number(route.paramMap.get('logId')));
  } catch {
    return EMPTY;
  }
};