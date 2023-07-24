import { ProjectStatusService } from './../../../@core/mock/project-status.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';

@Component({
    selector: 'main-project',
    templateUrl: 'main-project.component.html'

})

export class MainProjectComponent implements OnInit {
    types: NbComponentStatus[] = [
        'primary',
        'success',
        'info',
        'warning',
        'danger',
    ];
    position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_LEFT;
    index = 1;
    mainFormGroup: FormGroup;
    submitted: boolean = false;
    showListProject = false;
    quotes = [
        { title: null, body: 'Main project successfully created' },
        { title: null, body: 'Main project create failed' },
        { title: null, body: 'Toastr rock!' },
    ];
  increasArray = ['Constatare', 'Cauza', 'Corectie', 'Termen Corectie', 'Actiune Corectiva'
            , 'Termen Actiune Corectiva', 'Responsabil Corectie', 'Stadiu de Implementare Corectie', 'Stadiu de Implementare Actiune Corectiva',
            'Auditor'
        ]
    constructor(private formBuilder: FormBuilder,
        private projectStatusService: ProjectStatusService,
        private router: Router,
        private toastrService: NbToastrService,) {

    }

    ngOnInit() {
        this.mainFormGroup = this.formBuilder.group({
            mainProjectName: ['', Validators.required],
            uniqueIndex: [''],
            customDeadline:[7],
            columnsFields: new FormArray([])
        });

        this.showListProject = true;
        this.createDeafultField();
    }
    createDeafultField() {
        var chars = "ABCDEFGHIJKLMNOPQRSTUFWXYZ1234567890";
        var string_length = 8;
        var id = "MP_" + "";
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            id += chars.substring(rnum, rnum + 1);
            this.mainFormGroup.controls["uniqueIndex"].setValue(id);
        }


        
        // ,'Deadline',
        this.increasArray.forEach((Array, index) => {
            this.getColumnControls.push(this.formBuilder.group({
                columnName: [Array, Validators.required],
                type: [(Array == 'Termen Corectie' || Array == 'Termen Actiune Corectiva') ? 'Date' : 'text', Validators.required],
                index: [index],
                deadlineNumber:['7', Validators.required],
                oldValue: [Array]
            }))
        });
    }
    get formData() {
        return this.mainFormGroup.controls;
    }

    get getColumnControls() {
        return this.formData.columnsFields as FormArray;
    }


    OnclickAddField() {
        this.submitted = false;
        const _lengthArray = this.formData.columnsFields.value.length
        this.getColumnControls.push(this.formBuilder.group({
            columnName: ['', Validators.required],
            type: ['text', Validators.required],
            deadlineNumber:[7, Validators.required],
            index: [''],
            oldValue: ['']
        }))

    }

    onClickRemoveFields(index = -1) {
        if (index != -1) {
            this.getColumnControls.removeAt(index);
            return;
        }


        while (this.formData.columnsFields.value.length !== 0) {
            var _columnVal = this.getColumnControls.value[index];

            //  

            this.getColumnControls.removeAt(0);


        }
            // if(index == -1){
                
            // this.increasArray.forEach((Arrayv, index) => {
            //     if(Arrayv == 'Termen Corectie' || Arrayv == 'Termen Actiune Corectiva' || Arrayv == 'Auditor'){
            //         this.getColumnControls.push(this.formBuilder.group({
            //             columnName: [Arrayv, Validators.required],
            //             type: [(Arrayv == 'Termen Corectie' || Arrayv == 'Termen Actiune Corectiva') ? 'Date' : 'text', Validators.required],
            //             index: [index],
            //             oldValue: [Arrayv]
            //         }))
            //     }
            // });
            // }

    }


    onSubmit() {
        this.showListProject = false;
        this.submitted = true;

        if (this.mainFormGroup.valid) {
            let _mainprOb = {
                mainProjectName: this.formData.mainProjectName.value.toLowerCase(),
                columnsFields: this.formData.columnsFields.value,
                uniqueIndex: this.formData.uniqueIndex.value,
                customDeadline:this.formData.customDeadline.value,
            }

            this.projectStatusService.createMainProject(_mainprOb)
                .subscribe(
                    res => {
                        this.showToast(this.types[1], this.quotes[0].title, 'Main project created Succesfully');

                        this.submitted = false
                        this.mainFormGroup.reset();
                        this.onClickRemoveFields();
                        this.createDeafultField();
                        this.showListProject = true;
                    },
                    error => {
                        console.log(error)
                        this.showToast('danger', this.quotes[0].title, 'Main project not created');
                    },
                    () => {
                        console.log('Done')
                    }
                )




        } else {
            this.showToast('danger', this.quotes[0].title, 'Please make sure to fill the fields');
        }

    }

    getDisablity(data) {
        if (data.value == 'Start date' || data.value == 'Termen Corectie' || data.value == 'Termen Actiune Corectiva' || data.value == 'Auditor') {
            return false;
        }
        return false;
    }

    ngToolTip(data) {
        if (data.value == 'Auditor') {
            return 'Can not change this Auditor.It is mandotory for calander displaying'
        }
        return 'Can not change this field is mandotory for calander displaying'
    }






    private showToast(type: NbComponentStatus, title: string, body: string) {
        const config = {
            status: type,
            destroyByClick: true,
            duration: 2000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
        };
        const titleContent = title ? `. ${title}` : '';

        this.index += 1;
        this.toastrService.show(
            body,
            `Hey`,
            config);
    }


    deleteRecive(event) {

        if (event) {
            this.showListProject = false;
            this.projectStatusService.deletMainProject(event)
                .subscribe(
                    result => {

                        this.showListProject = true;


                    })
        }

    }


    navigate(type) {
        const _scroll = document.querySelectorAll("." + type);
        const _scrollTo = _scroll[0];
        _scrollTo.scrollIntoView({ block: 'start', behavior: 'smooth', inline: 'start' })
    }


    newProject() {

    }
    onClickNavigate(type = false) {
        if (type) {
            this.router.navigate(['/pages/dashboard']);
            return
        }
    }
}