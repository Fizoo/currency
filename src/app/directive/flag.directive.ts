import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[appFlag]'
})
export class FlagDirective {
  @Input('appFlag') currency:string=''

  constructor(private el:ElementRef) { }

  ngOnChanges() {
    this.setFlagImage();
  }
  private setFlagImage() {
    let imagePath:string

    switch (this.currency ) {
      case 'USD':
        imagePath='assets/image/usa.png'
        break
      case 'EUR':
        imagePath='assets/image/eur.png'
        break
      case 'UAH':
        imagePath='assets/image/ua.png'
        break
      default:
        imagePath = ''
        break
    }
    this.el.nativeElement.src = imagePath;
  }
}
