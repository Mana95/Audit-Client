import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/@core/mock/authentication.service';



@Component({
    selector: 'res-password',
    templateUrl: './response-reset-password.component.html'
})

export class resonsepasswordComponent implements OnInit {
    submitted = false;
    CurrentState: any;
    formGroup: FormGroup;
    resetToken: null;
    IsResetFormValid = true;
    constructor(private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService , private router: Router,
        private route: ActivatedRoute) {
        this.CurrentState = 'Wait';
        this.route.params.subscribe(params => {
            this.resetToken = params.token;
            console.log(this.resetToken);
            this.VerifyToken();
          });

    }

    ngOnInit() {
        this.formGroup = this.formBuilder.group({
            resettoken: [this.resetToken],
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
        },
        {
            validator: this.MustMatch('newPassword', 'confirmPassword')
        })

    }
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


    VerifyToken() {
        this.authenticationService.ValidPasswordToken({ resettoken: this.resetToken }).subscribe(
            data => {
                console.log(data);
                this.CurrentState = 'Verified';
            },
            err => {
                this.CurrentState = 'NotVerified';
            }
        );
    }

    get formData() {
        return this.formGroup.controls;
    }
    onSubmit() {
        this.submitted = true;
        if (this.formGroup.valid) {
      
          this.authenticationService.newPassword(this.formGroup.value).subscribe(
            data => {
              this.formGroup.reset();
             // this.successMessage = data.message;
              setTimeout(() => {
             //   this.successMessage = null;
                this.router.navigate(['login']);
              }, 2000);
            },
            err => {
              if (err.error.message) {
               // this.errorMessage = err.error.message;
              }
            }
          );
        } else { this.IsResetFormValid = false; }
      }
    

    }

