import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[pureOption]',
    standalone: true
})
export class OptionDirective<T = unknown> {

  constructor(public template: TemplateRef<{ $implicit: T }>) {}

}
