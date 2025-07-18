import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';

declare const bootstrap: any;

@Directive({
    selector: '[pureTooltip]',
    standalone: true
})
export class TooltipDirective implements AfterViewInit, OnDestroy{

  private tip: any;

  constructor(
    private elem_ref: ElementRef
  ) { }

  ngAfterViewInit() {
    const elem: HTMLElement = this.elem_ref.nativeElement;
    this.tip = new bootstrap.Tooltip(elem);
  }

  ngOnDestroy(): void {
    this.tip.dispose();
  }
}
