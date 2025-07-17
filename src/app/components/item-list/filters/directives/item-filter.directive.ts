/*
@Directive( {
  standalone: true
})

 */
import { FilterEvent } from "../../item-list.component";

export abstract class ItemFilterDirective {

  abstract getOptions(): { [key: string]: string };

  abstract getFilterEvent(selectedValue: string | undefined): FilterEvent;

}
