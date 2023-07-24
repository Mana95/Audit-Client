import { first } from 'rxjs/operators';
import { AuthenticationService } from 'app/@core/mock/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { loginUser } from 'app/@core/data/users';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';

@Component({
    selector:'register',
    templateUrl:'./register.component.html'
})


export class RegisterComponent implements OnInit  {
    destroyByClick = true;
    hasIcon = true;
    position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_LEFT;
registerGroup:FormGroup;
submitted:boolean = false;
registerData :loginUser;
index = 1;
preventDuplicates = false;
error:boolean = false;
errorMessage:string = '';
    constructor(private formBuilder:FormBuilder, private toastrService: NbToastrService,
        private authenticationService:AuthenticationService,
        private router: Router,){

    }
    ngOnInit(){
        this.registerGroup = this.formBuilder.group({
            fullName:['', Validators.required],
            email:['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required]
        },
        {
            validator: this.MustMatch('password', 'confirmPassword')
        })

    }
     //Matching the pW

     MustMatch(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];
    
            if (matchingControl.errors && !matchingControl.errors.mustMatch) {
                // return if another validator has already found an error on the matchingControl
                return;
            }
    
            // set error on matchingControl if validation fails
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
            } else {
                matchingControl.setErrors(null);
            }
        }
    }
    get formData() {
        return this.registerGroup.controls;
    }



    onSubmit() {
        this.submitted = true;
        this.error = false;
       // console.log(this.formData.fullname.value)
        if(this.registerGroup.valid){
           let register ={
            fullName:this.formData.fullName.value,
            email:this.formData.email.value,
            password:this.formData.password.value,
            active:true,
            role:'Admin'
           } 
            this.authenticationService.register(register)
            .pipe(first())
            .subscribe(
                res=>{
                    this.submitted = false;
                    this.registerGroup.reset();
                    this.showToast('success', null, 'Register is Successfully');
                    setTimeout(()=>{
                        this.router.navigate(['/login']);
                    },2000)
                    
                },
                error=>{
                    this.error = true;
                    this.errorMessage = error.error.error;
                    this.showToast('danger', null, 'Register is failed please try again!');
                },
                ()=>{
                    console.log('Register done')
                }
            )



        }

    }

    private showToast(type: NbComponentStatus, title: string, body: string) {
        const config = {
          status: type,
          destroyByClick: this.destroyByClick,
          duration: 2000,
          hasIcon: this.hasIcon,
          position: this.position,
          preventDuplicates: this.preventDuplicates,
        };
        const titleContent = title ? `. ${title}` : '';
    
        this.index += 1;
        this.toastrService.show(
          body,
          `Hey`,
          config);
      }
}