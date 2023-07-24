import { AuthenticationService } from './../../../../@core/mock/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'user-login',
    templateUrl: 'login-user.component.html',
})


export class UserLoginComponent implements OnInit{
    submitted:boolean = false;
    loginGroup: FormGroup;
    error = false;
    errorMessage:string = '';
    constructor(private formBuilder:FormBuilder,
        private authenticationService:AuthenticationService,public router: Router,){
      
    }

    ngOnInit(){
        this.loginGroup = this.formBuilder.group({
            email:['', [Validators.required, Validators.email]],
            password:['',Validators.required]
        })

    }

    get formData() {
        return this.loginGroup.controls;
    }
    
    onSubmit() {
        this.submitted = true;
        this.error = false;
        if( this.loginGroup.valid){
            this.authenticationService.login(this.formData.email.value, this.formData.password.value)
            .pipe(first())
            .subscribe(
                res=>{
                  
                    console.log(res)
                    this.router.navigate(['/pages']);
                },
                error=>{
                    this.error = true;
                  
                    this.errorMessage =(error.error.error == undefined)?error.error.message:error.error.error;
                

                }
            )


        }

    }
}