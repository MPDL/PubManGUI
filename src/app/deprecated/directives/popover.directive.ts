import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';

declare const bootstrap: any;

@Directive({
  selector: '[purePopover]',
  standalone: true
})
export class PopoverDirective implements AfterViewInit, OnDestroy {

  private pop: any;
  private opts = {
    container: 'div',
    placement: 'bottom',
    customClass: 'custom-popover',
    trigger: 'focus'
  };

  constructor(
    private elem_ref: ElementRef
  ) { }

  ngAfterViewInit() {
    const elem: HTMLElement = this.elem_ref.nativeElement;
    this.pop = new bootstrap.Popover(elem, this.opts);
  }

  ngOnDestroy(): void {
    this.pop.dispose();
  }

}
