import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AaService } from '../../../services/aa.service';

@Component({
  selector: 'pure-top-info-banner',
  standalone: true,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './top-info-banner.component.html'
})
export class TopInfoBannerComponent implements AfterViewInit, OnDestroy {
  protected aaService = inject(AaService);

  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.updateHeight();
    this.resizeObserver = new ResizeObserver(() => this.updateHeight());
    this.resizeObserver.observe(this.host.nativeElement);
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    this.document.documentElement.style.removeProperty('--top-info-banner-offset');
  }

  /**
   * The banner sticks to the top of the viewport. The fixed header is offset by its height, so it
   * stays directly below the banner.
   */
  private updateHeight() {
    const height = this.aaService.principal.value.readOnlyMode ? this.host.nativeElement.offsetHeight : 0;
    this.document.documentElement.style.setProperty('--top-info-banner-offset', `${height}px`);
  }
}
