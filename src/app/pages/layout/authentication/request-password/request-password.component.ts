import { AuthenticationService } from 'app/@core/mock/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';


@Component({
    selector:'request-password',
    templateUrl:'./request-password.component.html'
})

export class RequestPasswordComponent implements OnInit{
    requestGroup:FormGroup;
    submitted = false;
    showmessgae = false;
    constructor(private formBuilder:FormBuilder,
        private authenticationService:AuthenticationService) {

    }
    get formData() {
        return this.requestGroup.controls;
    }
    ngOnInit(){
        this.requestGroup = this.formBuilder.group({
            email:['', [Validators.required, Validators.email]],
        })
        
    }
    onSubmit() {
        this.submitted = true;
        this.showmessgae = true;
        setTimeout(()=>{
            this.showmessgae = false
        },6000)
        if(this.requestGroup.valid){
            this.authenticationService.requestReset(this.requestGroup.value)
            .subscribe(
                res=>{

                }
            )
        }

    }
}