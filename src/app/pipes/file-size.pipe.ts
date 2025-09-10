import { Pipe, PipeTransform } from '@angular/core';
import { humanFileSize } from "../utils/utils";

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

  transform(sizeInBytes: number, ...args: unknown[]): string | undefined {
    if(Number.isInteger(sizeInBytes)) {
      return humanFileSize(sizeInBytes);
    }
    return '0';
  }

}
