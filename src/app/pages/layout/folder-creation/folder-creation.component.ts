import { ProjectStatusService } from 'app/@core/mock/project-status.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { DialogProgressPromptComponent } from 'app/pages/modal-overlays/dialog/dialog-progress-prompt/dialog-progress-prompt.component';

@Component({
  selector: 'folder-creation',
  templateUrl: './folder-creation.component.html',
})


export class FolderCreationComponent implements OnInit {
    @Output() outPutEditData = new EventEmitter();
    folderUpload: FormGroup;
    submitted: boolean = false;
    destroyByClick = true;
    displayCard = true;
    hasIcon = true;
    position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_LEFT;
    index = 1;
    preventDuplicates = false;
    duration = 2000;
    dropdownData:any;
    apiReturnData:any;
    showgridList = false
    users: { name: string, title: string ,type:string}[] = []
    showAlert = false;
    selectedDropDown :boolean = false;
    constructor(private formBuilder : FormBuilder ,
        private route:ActivatedRoute,
        private router: Router,
         private projectSatusService :ProjectStatusService,
         private toastrService: NbToastrService,
         private dialogService: NbDialogService) {

    }


    ngOnInit() {

        this.folderUpload = this.formBuilder.group({
            folderName : ['',Validators.required],
        })
        this.loadFolders();
       
    }


    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        console.log('hellow')
    }

    get formData() {
        return this.folderUpload.controls;
    }
    loadFolders() {
        var _uniqueId = ''
        // this.route.params.subscribe(params=>{
        //         console.log(params['id']);
        //         _uniqueId = params['id'];
        //         this.dropdownData = params['id'];
        //         if(_uniqueId == '0'){
        //             this.projectSatusService.getAllFolderNames()
        //             .subscribe(
        //                 response=>{
        //                     this.apiReturnData = response;
        //                 }
        //             )
        //         }else{
        //             this.onChangeDataDisplay()
        //             console.log(_uniqueId);
        //         }
        //     })
        this.projectSatusService.getAllFolderNames()
                    .subscribe(
                        response=>{
                            this.apiReturnData = response;
                        }
                    )
           
     
    }
    onSubmit() {
        this.displayCard = false
        this.submitted = true;
        if(this.folderUpload.valid){

            let _folderCreationData = {
                    name : this.formData.folderName.value
            }



            this.projectSatusService.createFolder(_folderCreationData)
            .subscribe(
                response=>{
                    console.log(response);
                    this.displayCard = true
                    this.outPutEditData.emit(true);
                    this.showToast('success', null, 'Folder created Succesfully');
                    this.submitted = false;
                    this.folderUpload.reset();
                    this.loadFolders();
                }
            )
        }
       

    }
OnclickRouteDashboard() {
    this.router.navigate(['/page/dashboard'])
}




//Move
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

  onChangeDataDisplay() {
    
      this.users = [];
      this.projectSatusService.getByName(this.dropdownData)
      .subscribe(result=>{
          if(result.length == 0){
            this.showAlert = true;
            this.selectedDropDown = false;
          }else{
            this.showAlert = false;
            this.selectedDropDown = true;
          }
          
          result.forEach((u,i)=>{
              let _pushData = {
                name: u.fileName,
                title: u.orginalName,
                type:u.type
              }
              this.users.push(_pushData)
          })
   
    
      })
  }
  downloadFile(fileDetails) {
   
   let downloadObjest = {
    'Uploaded folder name':this.dropdownData,
    'originalName':fileDetails.title
   }

   this.dialogService.open(DialogProgressPromptComponent, {
    
    
}).onClose.subscribe(res=>{
  this.projectSatusService.downloadFile(downloadObjest)
   .subscribe(
     response=>{
      let myBlob: Blob = new Blob([response], {type: `${fileDetails.type}`}); 
      var fileURL = URL.createObjectURL(myBlob);
      window.open(fileURL);
     }
   )
});

//     this.projectSatusService.downloadFile(downloadObjest)
//     .subscribe(
//       response=>{
//        let myBlob: Blob = new Blob([response], {type: `${fileDetails.type}`}); 
//        var fileURL = URL.createObjectURL(myBlob);
//        window.open(fileURL);
//       }
//     )
//   }
}
OnClickViewFolder() {

    this.router.navigate(['/pages/folder-view']);
}
}