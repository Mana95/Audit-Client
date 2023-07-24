import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectStatusService } from 'app/@core/mock/project-status.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbSortDirection, NbSortRequest, NbToastrService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { DialogNamePromptComponent } from 'app/pages/modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component';
import { ProgressCustomComponent } from 'app/pages/modal-overlays/dialog/progress-custom/progress-custom.component';


@Component({
    selector:'project-file',
    templateUrl:'./project-file.component.html'
})

export class ProjectFileComponent implements OnInit{
   private urlId:string;
   private collectioName:string;
  // defaultColumns = [ "File Id" ,'Column Type', 'File Name' , 'file Type', 'Action' ];
   defaultColumns = ['Column Type', 'File Name' , 'file Type', 'Action' ];
   allColumns = [];
   data=[];
   dataSource: NbTreeGridDataSource<any>;
   sortColumn: string;
   sortDirection: NbSortDirection = NbSortDirection.NONE;
   columns:any;
   ArrayData = []
   destroyByClick = true;
hasIcon = true;
position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_LEFT;
index = 1;
preventDuplicates = false;
    constructor(
        private router: Router, private toastrService: NbToastrService, private projectStatusService: ProjectStatusService,
        private route: ActivatedRoute,   private dialogService: NbDialogService,
        private formbuilder: FormBuilder,
        private dataSourceBuilder: NbTreeGridDataSourceBuilder<any>,) {
            this.urlId = this.route.snapshot.params['id'];
            this.collectioName =localStorage.getItem('collection')
            this.columns = JSON.parse(localStorage.getItem('projectInfo'))
            this.dataSource = this.dataSourceBuilder.create(this.data)
    }

    ngOnInit(){
        this.loadDefaultData();
    }
    updateSort(sortRequest: NbSortRequest): void {
        this.sortColumn = sortRequest.column;
        this.sortDirection = sortRequest.direction;
      }
      getSortDirection(column: string): NbSortDirection {
        if (this.sortColumn === column) {
          return this.sortDirection;
        }
        return NbSortDirection.NONE;
      }
    loadDefaultData() {
      //  this.data=[];
        let response;
        var setUpArray = []
        let checkararya= []
        this.allColumns = [  ...this.defaultColumns];
        this.projectStatusService.loagSubprojectById({id:this.urlId ,collection: this.collectioName })
        .pipe(first()).subscribe(
            result=>{
              response = result;
              const filterArray = this.columns[0].filter(b=>b.type == 'File');
              if(filterArray.length > 0){
                  for(const param of this.columns[0]){
                        if(param.type == 'File'){
                          const _fileField = response[param.dbName]
                          if(_fileField  && _fileField.length>0){
                              if(_fileField.length>0){
                                for(const v of _fileField){
                                  let subArray = {data:{}};
                                  checkararya.push(v)
                                  subArray.data['File Id'] = v.id;
                                  subArray.data['file Type'] = v.type;
                                  subArray.data['File Name'] =v.fileName;
                                  subArray.data['Column Type'] =param.columnName;
                                  subArray.data['folderName'] =v.folderName;
                                  setUpArray.push(subArray);
                              };
                              }

                          }
                        }

                  }
                  console.log(setUpArray)
                  this.data =setUpArray
                  this.dataSource = this.dataSourceBuilder.create(this.data)

              }
            }
        );



    }
    RoutePage() {
      this.router.navigate(['/page/dashboard'])
    }

    onClickDelete(row) {
            let _delOb = {
                mainid:this.urlId,
                fileName:row.data['File Name'],
                collectionName : this.collectioName,
                subId : row.data['File Id'],
                folderName:row.data.folderName,
                columns:row.data['Column Type'],
                type:row.data['file Type'],
            }
            this.dialogService.open(DialogNamePromptComponent , {context:{
                dialogObjectData: {
                    titileHead: 'Are You Sure',
                    titleBody: 'You wont be able to revert this!',
                    buttonText:'Delete'
                }
              }}).onClose.subscribe(result=>{
                  if(result == 1){

                    this.projectStatusService.deleteProjectFile(_delOb)
                    .subscribe(res=>{
                    //  console.log(res);
                      this.loadDefaultData();
                      this.showToast("success", null, 'File deleted Successfully!');

                    },error=>{
                      this.showToast("danger", null, 'File deleted Failed!');
                    });
                  }
              })



    }
    private showToast(type: NbComponentStatus, title: string, body: string) {
        const config = {
          status: type,
          destroyByClick: this.destroyByClick,
          duration: 3000,
          hasIcon: true,
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
    downloadFile(row) {

        let _downloadFile = {
            "Uploaded folder name":row.data.folderName,
            "originalName":row.data['File Name']
        }
        this.dialogService.open(ProgressCustomComponent, {


        }).onClose.pipe(first()).subscribe(res=>{
          this.projectStatusService.downloadFile(_downloadFile).pipe(first())
          .subscribe(
            response=>{
             let myBlob: Blob = new Blob([response], {type: `${row.data['file Type']}`});
             var fileURL = URL.createObjectURL(myBlob);
             window.open(fileURL);
            }
          )
        })

    }
}
