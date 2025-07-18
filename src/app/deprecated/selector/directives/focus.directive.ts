import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, inject, OnDestroy } from '@angular/core';

@Directive({
    selector: '[pureFocus]',
    standalone: true
})
export class FocusDirective implements OnDestroy, AfterViewInit {

  private previousActiveElement: Element | null = null;
  private document = inject(DOCUMENT);

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngOnDestroy(): void {
    if (this.previousActiveElement instanceof HTMLElement) {
      this.previousActiveElement.focus();
    }
  }

  ngAfterViewInit(): void {
    this.previousActiveElement = this.document.activeElement;
    this.elementRef.nativeElement.focus();
  }
}
