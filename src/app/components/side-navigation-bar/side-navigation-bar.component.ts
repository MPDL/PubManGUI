import { Component, ElementRef, Renderer2, ViewChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pure-side-navigation-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './side-navigation-bar.component.html',
  styleUrl: './side-navigation-bar.component.scss'
})

export class SideNavigationBarComponent {
  @ViewChild('sidenav', {read: ElementRef}) nav!: ElementRef;
  renderer = inject(Renderer2);

  ngAfterViewInit(): void {
    this.collapse();
  }

  expand_collapse() {
    const expanded = this.nav.nativeElement.classList.contains('collapsed');
    this.renderer[expanded ? 'removeClass' : 'addClass'](this.nav.nativeElement, 'collapsed');
  }

  expand() {
    this.renderer.removeClass(this.nav.nativeElement, 'collapsed');
  }

  collapse() {
    this.renderer.addClass(this.nav.nativeElement, 'collapsed');
  }

  
}
