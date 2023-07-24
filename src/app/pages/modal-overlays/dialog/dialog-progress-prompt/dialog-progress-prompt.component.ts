


import { ProjectStatusService } from 'app/@core/mock/project-status.service';
import { NbDialogRef } from '@nebular/theme';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { first } from 'rxjs/operators';


@Component({
  selector: 'dialog-progress-prompt',
  templateUrl: 'dialog-progress-prompt.component.html',
  styleUrls: ['dialog-progress-prompt.component.scss'],

})

export class DialogProgressPromptComponent implements OnInit {
  value = 0;

  mainProjectForm: FormGroup;
  submitted = false;
  columnsName: any;
  fileArry = [];
   uploadData= [];
  @Input() title: string;
  constructor(protected ref: NbDialogRef<DialogProgressPromptComponent>,
    private projectStatusService: ProjectStatusService,
    private formBuilder: FormBuilder) {

  }
  ngOnInit() {
    console.log(this.title)
    this.defaultSetup()
  }
  defaultSetup() {
    const _getColumns = JSON.parse(localStorage.getItem('projectInfo'))[0].filter(dt => dt.type == 'File');
    this.mainProjectForm = this.formBuilder.group({
      columnsFields: new FormArray([])
    })

    if (_getColumns) {
      this.fileArry = _getColumns
      _getColumns.forEach((par, index) => {
        this.getColumnControls.push(this.formBuilder.group({
          fileName: [''],
          columns: [''],
          file: [''],
          type: [''],
          columnsName: [par.columnName],
        }))


      })
    }

  }
  get formData() {
    return this.mainProjectForm.controls;
  }

  get getColumnControls() {
    return this.formData.columnsFields as FormArray;
  }
  get getValue() {
    setTimeout(() => {
      if (this.value != 100) {
        this.value = this.value + 10;
      } else {
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

  submit(value = false) {

    this.ref.close(value);
  }


  getLabel(row) {
    const _findColumn = this.fileArry.find(f => f.columnName == row.columnsName.value)
    if (_findColumn) {
      return _findColumn.columnName;
    }
    return
  }
  get formArrayValue() {
    return this.mainProjectForm.get('columnsFields') as FormArray;
  }
  uploadFile(event, columnName, index) {
    const fileEvnet = event.target.files[0];
    // const _columnName = columnName.replace(/\s+/g, "_");
    //this.fileUpladerGroup.controls['fileName'].setValue(fileEvnet.name);
    // this.formArrayValue.patchValue([
    //     {fileName:fileEvnet.name , columnsName:columnName.controls.columnsName.value ,type:fileEvnet.type}
    // ])

    // this.formArrayValue.at(index).patchValue({fileName:fileEvnet.name ,
    //    columnsName:columnName.controls.columnsName.value ,type:fileEvnet.type})
    console.log(columnName.controls.columnsName.value)

    let fildOb = {
      columneName: columnName.controls.columnsName.value,
      file: fileEvnet,
      orginalName: fileEvnet.name,
      type: fileEvnet.type,
    }
    if(this.uploadData.length>0){
      var _findIndex =this.uploadData.indexOf(o=>o ==fildOb);
      if (_findIndex > -1) {
        this.uploadData.splice(_findIndex, 1);
      }
      // this.uploadData.slice(_findIndex, 0)
    }
    this.uploadData.push(fildOb);
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      //   this.cd.markForCheck();
    }
  }



  onSubmit() {
    this.submitted = true;
    let objectData = []
    let _apiArray = [];
    var retrievedObject = localStorage.getItem('collection');
    const uniqueId = this.getUniqueId
    const arrayValue = this.getColumnControls.value;
    if (this.uploadData.length > 0) {
      this.uploadData.forEach((parameter, index) => {
        let _newProject = {
          "id": uniqueId,
          "columnName": parameter.columneName,
          "folderName": retrievedObject.replace(/\s+/g, "_") + this.getUniqueId,
          "fileType": parameter.type,
          "orginalName": parameter.orginalName
        };
        console.log(_newProject)
        objectData.push(_newProject);
        const formData = new FormData();
        formData.append('file', parameter.file);
        _apiArray.push(this.projectStatusService.ProjectFileUpload(formData, _newProject.folderName));


      });
    //  const _collectn = localStorage.getItem('')
      if (_apiArray.length == this.uploadData.length) {
        forkJoin(_apiArray).pipe(first()).subscribe(res => {
          if(res.length == _apiArray.length){
            let _newObject = {
              "id":this.title,
              "filInfo":objectData,
              "filecat":true,
              "collectionName":retrievedObject,

          };
          this.projectStatusService.addFilesUpdateproject(_newObject)
          .pipe(first()).subscribe(
            final=>{
              console.log(final);

              this.mainProjectForm.reset();

              this.submit(true)
            }
          )
          }
        })
      }
    }
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
