import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ProjectStatusService } from 'app/@core/mock/project-status.service';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import * as moment from 'moment';
import { DialogNamePromptComponent } from 'app/pages/modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component';
import { ShowcaseDialogComponent } from 'app/pages/modal-overlays/dialog/showcase-dialog/showcase-dialog.component';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { first, map, mergeMap } from 'rxjs/operators';
@Component({
    selector: 'edit-project',

    templateUrl: './project-edit.component.html',
    styleUrls: ['./project-edit.component.scss']
})

export class EditProjectComponent implements OnInit {
    public ProjectrSubject: BehaviorSubject<any>;
    public collectionName: Observable<any>;
    disabledValue: boolean = false;
    editProjectForm: FormGroup;
    submitted: boolean = false;
    destroyByClick = true;
    hasIcon = true;
    position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_LEFT;
    index = 1;
    preventDuplicates = false;
    duration = 2000;
    ProjectLabel: string = '';
    currentDate = new Date();
    uploadData = [];
    types: NbComponentStatus[] = [
        'primary',
        'success',
        'info',
        'warning',
        'danger',
    ];
    showNewForm: boolean = false;
    formButtonLabel = 'Update'
    quotes = [
        { title: null, body: 'Porject Data was Updated' },
        { title: null, body: 'Please make sure fill field' },
        { title: null, body: 'Toastr rock!' },
    ];
    formEditType : boolean = false;
    newProjectName : string;
    public columnData: any;
    urlId: any;
    displayStatus: boolean = false;
    projectUniqueId: string;

    mainProjectForm: FormGroup;
    clickData: any;
    projectDeadline: Number;
    showForm = false;

    columnfields: any;
    constructor(private router: Router, private projectStatusService: ProjectStatusService,
        private route: ActivatedRoute,
        private formbuilder: FormBuilder,
        private toastrService: NbToastrService,
        private dialogService: NbDialogService,
    ) {
        //JSON.parse(localStorage.getItem('projectInfo'))
        this.clickData = localStorage.getItem('calenderClick');
        this.columnfields = (this.clickData == 'true') ? JSON.parse(localStorage.getItem('projectInfoCalen')) : JSON.parse(localStorage.getItem('projectInfo'));


    }

    ngOnInit() {
        const _collectiond = localStorage.getItem('collection');
        this.newProjectName =_collectiond
        this.urlId = this.route.snapshot.params['id'];
        let group = {}
        this.columnfields[0].forEach(input_template => {
                
            group[input_template.dbName] = (input_template.type != 'File') ? new FormControl('', Validators.required) : new FormControl('');
        })
        this.mainProjectForm = new FormGroup(group);
        
        const _id = this.route.snapshot.params['id'];
        const _collection = (this.clickData == 'true') ? localStorage.getItem('calenderName') : localStorage.getItem('collection');
        if (this.urlId && this.urlId != 'new-project') {
            this.formEditType = true;
            this.projectStatusService.getprojectTableData({ _id, _collection })
                .subscribe(
                    response => {

                        this.columnfields[0].forEach((column, index) => {
                            this.mainProjectForm.controls[column.dbName].setValue(response[0][column.dbName])
                        });
                        this.projectDeadline = response[0].customDeadline;
                        this.disabledValue = (response[0].status == 1) ? false : true;
                        this.ProjectLabel = response[0].name;
                        this.projectUniqueId = response[0]._id;


                    }
                )
            //Tempory Must called as a one API

        } else {
            this.showNewForm = true;
            this.formButtonLabel = 'Submit'
            //Tempory Must called as a one API
            const mainProjectid = localStorage.getItem('mainProjectID');
            this.projectStatusService.getByIdMainProjectUnique(mainProjectid)
                .pipe(first())
                .subscribe(
                    res => {
                        console.log(res)
                        this.projectDeadline = res[0].customDeadline;
                    }
                )
        }

    }

    localStorageValue() {
        this.ProjectrSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('collection')));
        this.collectionName = this.ProjectrSubject.asObservable();

        console.log()
    }


    get f() { return this.mainProjectForm.controls; }
    get addForm() { return this.f.formField as FormArray; }

    getFormBuilderData() {
        let group = {}


        this.columnfields = (this.clickData == 'true') ? this.projectStatusService.calanderProject : this.projectStatusService.projectDetails;
        if (this.projectStatusService.projectDetails && this.projectStatusService.projectDetails.length > 0) {
            this.projectStatusService.projectDetails.forEach((c, i) => {
                const name = c.columnName;
                group[name] = new FormControl('');
                this.mainProjectForm = new FormGroup(group);
                // if(c.columnName.indexOf(' ') >= 0){
                //     console.log("contains spaces");
                // }
                //let _fieldName = (c.columnName.indexOf(' ') >= 0)?c.columnName.replace(/\s+/g, '_'):c.columnName;
                // const control = new FormGroup({
                //     name: new FormControl(null),

                // });
                //   (<FormArray>this.mainProjectForm.get('surgeries')).push(control);  

            });
            this.mainProjectForm.valueChanges.subscribe(val => {
                console.log(val)
            })
            this.showForm = true;
        }

    }
    GetName(c) {
        return c;
    }
    getFormControlData(data) {
        console.log(data)

        return 'projectName'
    }



    OnclickRouteDashboard() {
        this.router.navigate(['/page/dashboard'])
    }


    private showToast(type: NbComponentStatus, title: string, body: string) {
        const config = {
            status: type,
            destroyByClick: this.destroyByClick,
            duration: this.duration,
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



    onClickComplete() {

        if (!this.disabledValue) {


            //tempory wihtout passing data
            this.dialogService.open(DialogNamePromptComponent, {
                context: {
                    dialogObjectData: {
                        titileHead: 'Doriti sa marcati taskul ca incheiat?',
                        titleBody: 'Daca incheiati taskul, nu il mai puteti modifica',
                        buttonText: 'Yes'
                    }
                }
            })
                .onClose.subscribe(res => {
                    if (res == 1) {
                        this.proceedUpdate();
                    } else {
                        this.disabledValue = false
                    }

                });
        }



    }
    proceedUpdate() {
        const _collectionName = (this.clickData == 'true') ? localStorage.getItem('calenderName') : localStorage.getItem('collection');


        this.projectStatusService.updatecorrectiveAction({ actionStatus: (this.disabledValue) ? 2 : 1, _id: this.projectUniqueId, collection: _collectionName })
            .subscribe(
                response => {
                    this.displayStatus = true;
                    this.disabledValue = true;
                },
                error => {

                },
                () => {

                }
            )


    }

    ngOnDestroy() {
        localStorage.setItem('calenderClick', 'false');
    }

    uploadFile(event, columnName) {
        const fileEvnet = event.target.files[0];
        const _columnName = columnName.replace(/\s+/g, "_");
        this.mainProjectForm.controls[_columnName].setValue(
            _columnName
        );
        // this.fileUpladerGroup.controls['fileName'].setValue(file.name);
                let FileInfo = {
                    columnName:_columnName,
                    fileName:fileEvnet.name,
                    fileType:fileEvnet.type,
                    file:fileEvnet
                }
        this.uploadData.push(FileInfo);
        let reader = new FileReader(); // HTML5 FileReader API
        let file = event.target.files[0];
        if (event.target.files && event.target.files[0]) {
            reader.readAsDataURL(file);
          
            this.mainProjectForm.controls[_columnName].setValue(
                file.name
            );
            //   this.cd.markForCheck();
        }
    }


    onSubmit() {
        this.submitted = true;
        var type = "Success"
        var retrievedObject = (this.clickData == 'true') ? localStorage.getItem('calenderName') : localStorage.getItem('collection');
        console.log(retrievedObject)
        if (this.mainProjectForm.valid) {

            if (this.urlId != 'new-project') {
                let updateProject = {
                    "formGroup": this.mainProjectForm.value,
                    "status": 1,
                    "collection": retrievedObject,
                    "fields": this.columnfields[0]
                }

              

                this.projectStatusService.updateProject(updateProject, this.urlId)
                    .subscribe(
                        response => {
                            this.showToast(this.types[1], this.quotes[0].title, 'Project Data updated Succesfully');
                        },
                        error => {
                            this.showToast(this.types[4], this.quotes[0].title, 'Internal server error occured');
                        },
                        () => {

                        }
                    )
            } else {
                if(this.uploadData.length == 0){
                    let updateProject = {
                        "formGroup": this.mainProjectForm.value,
                        "status": 1,
                        "collection": retrievedObject,
                        "fields": this.columnfields[0],
                        "filecat":false
                    }
                    this.projectStatusService.saveproject(updateProject)
                    .subscribe(
                        response => {
                            this.showToast(this.types[1], this.quotes[0].title, 'Project Data save Succesfully');
                            this.submitted = false;
                            this.mainProjectForm.reset();
                        },
                        error => {
                            this.showToast(this.types[4], this.quotes[0].title, 'Internal server error occured');
                        },
                        () => {

                        }
                    );



                }else{
                        let _apiArray = [];
                        let objectData= [];
                        const uniqueId = this.getUniqueId;
                    if(this.uploadData.length > 0){
                    for(const param of this.uploadData){
                        // let FileInfo = {
                        //     columnName:_columnName,
                        //     fileName:fileEvnet.name,
                        //     fileType:fileEvnet.type,
                        //     file:fileEvnet
                        // }
                        let _newProject = {
                            "id":uniqueId,
                            "columnName":param.columnName,
                            "folderName":retrievedObject.replace(/\s+/g, "_")+this.getUniqueId,
                            "fileType":param.file.type ,
                            "orginalName":param.file.name,
                        };
                        objectData.push(_newProject);
                        const formData = new FormData();
                        formData.append('file',param.file);
                        _apiArray.push(this.projectStatusService.ProjectFileUpload(formData , _newProject.folderName));
                     
                        
                    }
                    if(_apiArray.length == this.uploadData.length){
                        forkJoin(_apiArray).subscribe(result=>{
                            if(result.length == _apiArray.length){
                                let _newObject = {
                                    "formGroup": this.mainProjectForm.value,
                                    "status": 1,
                                    "id":uniqueId,
                                    "deadlineNumber": this.projectDeadline,
                                    "collection": retrievedObject,
                                    "fields": this.columnfields[0],
                                    "fileInfo":objectData,
                                    "filecat":true
                                };
                                this.projectStatusService.saveproject(_newObject)
                                .subscribe(
                                    response => {
                                                    this.showToast(this.types[1], this.quotes[0].title, 'Project Data save Succesfully');
                                                    this.submitted = false;
                                                    this.mainProjectForm.reset();
                                                    this.router.navigate(['/dashboard'])
                                                },
                                                error => {
                                                    this.showToast(this.types[4], this.quotes[0].title, 'Internal server error occured');
                                                },
                                                () => {
                        
                                                }
                                )


                            }

                        })
                    };
                }
            
                }
                   
            }
        } else {
            this.showToast(this.types[4], this.quotes[0].title, this.quotes[1].body);
        }
        /// console.log(this.formData.projectName.value)
    }

    private get getUniqueId() {

        var chars = "ABCDEFGHIJKLMNOPQRSTUFWXYZ1234567890";
        var string_length = 15;
        var id = "F_" + "";
        for (var i = 0; i < string_length; i++) {
          var rnum = Math.floor(Math.random() * chars.length);
          id += chars.substring(rnum, rnum + 1);
        }
      
      return id;
      
      }
}