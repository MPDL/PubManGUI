import {Component, ElementRef, Input, ViewChild} from '@angular/core';

@Component({
  selector: 'pure-thumbnail-pdf',
  standalone: true,

  templateUrl: './thumbnail-pdf.component.html',
  styleUrl: './thumbnail-pdf.component.css'
})
export class ThumbnailPdfComponent {

  @Input({required: true}) pdfUrl!: string;
  @ViewChild('pdfThumnbnailCanvas') thumbnailCanvas!: ElementRef<HTMLCanvasElement>;
  loading:boolean = true;
  error: boolean = false;

  ngAfterViewInit() {
    if(this.pdfUrl){
      //this.renderPDF();
    }

  }


  /*
  renderPDF() {
    //var url = "https://gui.inge.mpdl.mpg.de/rest/items/item_1042573_8/component/file_3559466/content";

      pdfjsLib.GlobalWorkerOptions.workerSrc = "/assets/pdfjsWorker/pdf.worker.min.mjs";

      pdfjsLib.getDocument({
      url : this.pdfUrl, disableStream : true, disableAutoFetch: true
    }).promise.then(doc => {

        doc.getPage(1).then(page1 => {
          const ctx = this.thumbnailCanvas.nativeElement.getContext("2d");
          if (ctx != null) {
            const vp: PageViewport = page1.getViewport({scale: 1})
            const canvas: HTMLCanvasElement = this.thumbnailCanvas.nativeElement;
            const scale = Math.min(canvas.width / vp.width, canvas.height / vp.height);

            page1.render({canvasContext: ctx, viewport: page1.getViewport({scale: scale})});
            this.loading = false;
            //ctx.putImageData(ctx.getImageData(0,0,1000,1000), 0, 1000)
          }

        })


      }).catch(error => {
        this.loading = false;
        this.error = true;
        console.log("Could not generate thumbnail", error);
      })
    }
*/

}
