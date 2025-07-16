import { inject, Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FileDbVO } from 'src/app/model/inge';
import { ControlType, FormBuilderService } from 'src/app/components/item-edit/services/form-builder.service';

@Pipe({
  name: 'filterFiles',
  standalone: true
})
export class FilterFilesPipe implements PipeTransform {

  fbs = inject(FormBuilderService);

  transform(fileList: any, filterValue: string): any {
    console.log("transformer", (fileList as []).length, filterValue);
    let filteredList : FormGroup<ControlType<FileDbVO>>[] = [] as FormGroup<ControlType<FileDbVO>>[];
    console.log("FileList", fileList);
    console.log("FilteredList before", (filteredList as []).length, filteredList);
    fileList.forEach((file: any)  => {console.log(JSON.stringify(file.get('storage').value))});
    fileList.forEach((file: any)  => {console.log(file.get('storage').value == filterValue) });
    fileList.forEach((file: any) => {if (file.get('storage').value == filterValue) {console.log('add file', file.value); filteredList.push(this.fbs.file_FG(file.value))}});
    //filteredList.push(null));
    console.log("FilteredList", (filteredList as []).length, filteredList);
    return filteredList;
  }

}
