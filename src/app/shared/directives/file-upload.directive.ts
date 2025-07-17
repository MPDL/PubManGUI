import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileDbVO } from 'src/app/model/inge';

enum DropColor {
  Default = "none",
  Over = "#8898ac"
}

@Directive({
  selector: '[pureFileUpload]',
  standalone: true,
})
export class FileUploadDirective {
  @Output() dropFiles: EventEmitter<FileDbVO[]> = new EventEmitter();
  @HostBinding("style.background") backgroundColor = "none";

  constructor(private sanitizer: DomSanitizer) {//, private el: ElementRef) {
    //this.el.nativeElement.style.backgroundColor = 'yellow';
    console.log("Directive included");
  }

  /*
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight('yellow');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
*/
  @HostListener("dragover", ["$event"]) public dragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.backgroundColor = DropColor.Over;
  }

  @HostListener("dragleave", ["$event"]) public dragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.backgroundColor = DropColor.Default;
  }

  @HostListener("drop", ["$event"]) public drop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.backgroundColor = DropColor.Default;

    let fileList = event.dataTransfer?.files;
    let files: FileDbVO[] = [];

    if(fileList) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const url = this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        );
        files.push({ name : file.name, content: url } as FileDbVO);
      }
    }
    event
    console.log(files)
    if (files.length > 0) {
      this.dropFiles.emit(files);
    }
  }

}
