import { Component ,Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-profit-card',
  styleUrls: ['./profit-card.component.scss'],
  templateUrl: './profit-card.component.html',
})
export class ProfitCardComponent implements OnInit  {
@Input() cardObject:any;
  flipped = false;
  
  constructor() {}


ngOnInit() {

}



  toggleView() {
    this.flipped = !this.flipped;
  }

  get status() {
    if (this.cardObject.progressbarValus <= 25) {
      return 'danger';
    } else if (this.cardObject.progressbarValus <= 50) {
      return 'warning';
    } else if (this.cardObject.progressbarValus <= 75) {
      return 'info';
    } else {
      return 'success';
    }
  }
   getStatusColor(cardObject) {
        if(cardObject.status && cardObject.status == 'basic'){
          return true;
        }

        return false;
  }
}
