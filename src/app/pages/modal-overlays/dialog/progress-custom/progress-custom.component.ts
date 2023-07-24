import { NbDialogRef } from '@nebular/theme';
import { Component, OnInit, TemplateRef } from '@angular/core';


@Component({
    selector:'dialog-progress-prompt',
    templateUrl:'progress-custom.component.html',
    styleUrls: ['progress-custom.component.scss'],

})

export class ProgressCustomComponent implements OnInit {
    value =0;
    title ='Please wait!'
    constructor(protected ref: NbDialogRef<ProgressCustomComponent>){

    }
    ngOnInit(){
       
    }

get getValue() {
    setTimeout(()=>{ 
        if(this.value != 100){
            this.value=this.value +10;
        }else{
            this.title = 'Get your File'
        }
  
    }, 1000);
    return this.value;
}

    setValue(newValue) {
        this.value = Math.min(Math.max(newValue, 0), 100)
      }
    
      get status() {
        if (this.value <= 25) {
          return 'danger';
        } else if (this.value <= 50) {
          return 'warning';
        } else if (this.value <= 75) {
          return 'info';
        } else {
          return 'success';
        }
      }

      submit() {
        this.ref.close(1);
      }
}