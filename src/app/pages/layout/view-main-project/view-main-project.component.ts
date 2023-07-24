import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectStatusService } from 'app/@core/mock/project-status.service';
import * as moment from 'moment';
@Component({
  selector: 'view-main-project',
  templateUrl:'view-main-project.component.html'
})
export class ViewMainProjectComponent implements OnInit{
    formGroup:FormGroup;
    ProjectName:string = '';
    constructor( private route:ActivatedRoute,
        private router: Router, private projectStatusService:ProjectStatusService,
        private formBuilder:FormBuilder){

    }

    ngOnInit(){
        this.formGroup = this.formBuilder.group({
            mainProjectName :['',Validators.required],
            uniqueIndex:[''],
            createdDate:[''],
            columnsFields: new FormArray([])
       });



        const _id = this.route.snapshot.params['id'];
        if(_id)
        this.loadDataForm(_id);
        console.log('View main project'+_id)
    }
    get formData(){
        return this.formGroup.controls;
    }

    get getColumnControls(){
        return this.formData.columnsFields as FormArray;
    }


    loadDataForm(id) {

        this.projectStatusService.getByIdMainProject(id)
        .subscribe(
            result=>{
                const  _resData = result[0];
                this.ProjectName = _resData.mainProjectName;
                this.formGroup.controls['mainProjectName'].setValue(this.ProjectName);
                const _createDate = moment(_resData.createDate).format('YYYY-MM-DD');
                this.formGroup.controls['createdDate'].setValue( _createDate);
                const _formControlColumns = this.formData.columnsFields as FormArray;
                    if(_resData.columnsFields){
                        _resData.columnsFields.forEach((pr , prIndex)=>{
                        if(pr){
                            _formControlColumns.push(
                                this.formBuilder.group({
                                    columnName: [pr.columnName, Validators.required],
                                    type: [pr.type, Validators.required],
                                    deadline:[pr.deadlineNumber, Validators.required]
                                })
                            )
                        }
                        });
                    }
            },
            error=>{
                console.log(error);
            },
            ()=>{
                console.log('Completed')
            }
        );
    }

    onClickNavigate(type = false) {
        if(type){
            this.router.navigate(['/pages/dashboard']);
            return
        }
        
        this.router.navigate(['/pages/project-list']);
    }
    onSubmit(){

    }
}
