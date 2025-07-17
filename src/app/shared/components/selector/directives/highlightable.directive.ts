import { Highlightable } from '@angular/cdk/a11y';
import { Directive, ElementRef, HostBinding, inject, Input } from '@angular/core';

@Directive({
    selector: '[pureHighlightableOption]',
    standalone: true
})
export class HighlightableDirective implements Highlightable {

// alias MUST match selector to skip value input !!!
@Input({ required: true, alias: 'pureHighlightableOption' }) value!: unknown;

@HostBinding('class.highlighted') highlight = false;

private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

setActiveStyles(): void {
  this.highlight = true;
}

setInactiveStyles(): void {
  this.highlight = false;
}

disabled?: boolean | undefined;

scrollIntoElement(): void {
  this.elementRef.nativeElement.scrollIntoView({
    block: 'nearest',
    behavior: 'smooth',
  });
}
}
