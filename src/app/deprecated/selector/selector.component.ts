import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import { AsyncPipe, CommonModule, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { OptionDirective } from './directives/option.directive';
import { HighlightableDirective } from './directives/highlightable.directive';
import { SelectorDatasource } from './services/selector-datasource.service';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { BehaviorSubject, filter, map, shareReplay, timer } from 'rxjs';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { HighLightJsonPipe } from '../pipes/high-light-json.pipe';

@Component({
  selector: 'pure-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    HighlightableDirective,
    NgIf,
    NgTemplateOutlet,
    AsyncPipe,
    HighLightJsonPipe,
  ],
})
export class SelectorComponent implements OnDestroy, AfterViewInit {

  @Input() form!: FormGroup;
  @Input() control_name!: string;
  @Input() placeholder!: string;
  @Input() validationError?: boolean;
  @ViewChild('overlayContainer', { static: true }) overlayTemplate!: TemplateRef<void>;
  @ViewChild('input', { read: ElementRef }) input_field!: ElementRef;
  @ContentChild(OptionDirective, { static: true }) optionTemplateDirective!: OptionDirective;
  @ViewChildren(HighlightableDirective) options!: QueryList<HighlightableDirective>;
  @Output() notice = new EventEmitter<unknown>;

  private selectDataSource = inject(SelectorDatasource);
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);

  protected searchedValue$ = new BehaviorSubject<string>('');
  protected options$ = this.selectDataSource.getOptions(this.searchedValue$).pipe(
    shareReplay(1),
  );
  private overlayRef: OverlayRef | null = null;
  private keyManager!: ActiveDescendantKeyManager<HighlightableDirective>;

  private createOverlay(): OverlayRef {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.input_field)
      .withPositions([{
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
      }, {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
      }]);

    const scrollStrategy = this.overlay.scrollStrategies.reposition();

    return this.overlay.create({
      hasBackdrop: true,
      backdropClass: '',
      positionStrategy,
      scrollStrategy,
      minWidth: this.input_field.nativeElement.clientWidth,
      maxWidth: this.input_field.nativeElement.clientWidth
    });
  }

  /*
  form = this.fb.group({
    name: new FormControl(''),
  });
*/

  constructor(
    private fb: FormBuilder
  ) { }

  ngAfterViewInit(): void {
    this.keyManager = new ActiveDescendantKeyManager(this.options).withHomeAndEnd().withWrap().withPageUpDown();
  }

  openOverlay(): void {
    if (this.overlayRef === null) {
      this.overlayRef = this.createOverlay();

      this.overlayRef.outsidePointerEvents().subscribe(() => {
        this.overlayRef?.detach();
      });

      this.overlayRef
        .keydownEvents()
        .pipe(
          map((e) => e.key),
          filter((key) => key === 'Escape'),
        )
        .subscribe(() => {
          this.overlayRef?.detach();
        });
    }

    const portal = new TemplatePortal(this.overlayTemplate, this.viewContainerRef);
    if (!this.overlayRef.hasAttached()) {
      this.overlayRef.attach(portal);
    }
  }

  selectOption(option: unknown): void {
    const controlValue = this.selectDataSource.getControlValue(option);
    this.form.controls[this.control_name].patchValue(controlValue.selected);
    this.notice.emit(option);
    timer(1).subscribe({
      next: () => {
        this.overlayRef?.detach();
        this.keyManager.setActiveItem(-1);
      },
    });
  }

  handleInput($event: Event): void {
    const target = $event.target as HTMLInputElement;
    const value = target.value;

    if (value === this.searchedValue$.value) {
      return;
    }

    this.openOverlay();

    this.keyManager.setActiveItem(-1);
    this.searchedValue$.next(value);
  }

  onKeydown($event: KeyboardEvent): void {
    const key = $event.code;
    const activeItem = this.keyManager.activeItem;
    if (key === 'Enter' && activeItem !== null) {
      this.selectOption(activeItem.value);
      $event.preventDefault();
    } else {
      this.keyManager.onKeydown($event);
      this.keyManager.activeItem?.scrollIntoElement();
    }
  }

  ngOnDestroy(): void {
    this.overlayRef?.dispose();
    this.searchedValue$.complete();
    this.keyManager.destroy();
  }
}
