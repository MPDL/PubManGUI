import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'pure-facet',
    templateUrl: './facet.component.html',
    styleUrls: ['./facet.component.scss'],
    standalone: true,
    imports: [NgIf, FormsModule, ReactiveFormsModule, NgFor]
})
export class FacetComponent implements OnInit {

  items: any = [];
  item_list: any[] = [];
  current_list = 0;
  facet_form!: FormGroup;
  facets!: any[];
  view_prev_next = false;
  @Input() list!: boolean;
  @Input() title!: string;
  @Input() chunk_size!: number;
  @Input() item_array!: Observable<any[]>;
  @Input() term_query_field!: string;
  @Output() notice = new EventEmitter<any>();

  constructor(
    private builder: FormBuilder,
  ) { }

  ngOnInit() {
    this.item_array.pipe(
      take(1)
    ).subscribe(result => {
      this.facets = result;
      if (this.facets.length > this.chunk_size) {
        this.item_list = this.facets.slice(0, this.chunk_size);
        this.view_prev_next = true;
      } else {
        this.item_list = this.facets;
      }
    });
    this.facet_form = this.builder.group({
      facets: []
    });
  }

  submit() {
    // not implemented
  }

  nextSlice(current_list: any[]) {
    let pos = this.facets.indexOf(current_list[current_list.length - 1]);
    pos = pos + 1;
    if (pos === this.facets.length) {
      this.item_list = current_list;
    }
    if (pos + this.chunk_size > this.facets.length) {
      this.item_list = this.facets.slice(pos, this.facets.length);
    } else {
      this.item_list = this.facets.slice(pos, pos + this.chunk_size);
    }
  }

  prevSlice(current_list: any[]) {
    const pos = this.facets.indexOf(current_list[0]);
    if (pos - this.chunk_size < 0) {
      this.item_list = this.facets.slice(0, this.chunk_size);
    } else {
      this.item_list = this.facets.slice(pos - this.chunk_size, pos);
    }
  }

  forwardInList() {
    if (this.items.length > this.current_list) {
      this.current_list++;
      this.item_list = this.items[this.current_list];
    } else {
      this.item_list = this.items[0];
      this.current_list = 0;
    }
  }

  backInList() {
    if (this.current_list > 0) {
      this.current_list--;
      this.item_list = this.items[this.current_list];
    } else {
      this.item_list = this.items[0];
      this.current_list = 0;
    }
  }

  filter(item: any) {
    if (this.item_list.length === 1) {
      this.item_list = this.facets.slice(0, this.chunk_size);
    } else {
      const filtered = this.item_list.filter(i => item === i);
      this.item_list = filtered;
    }
    this.notice.emit();
  }
}
