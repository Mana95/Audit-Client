import { DialogProgressPromptComponent } from './../modal-overlays/dialog/dialog-progress-prompt/dialog-progress-prompt.component';
import { ProjectStatusService } from 'app/@core/mock/project-status.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbSortDirection, NbSortRequest, NbThemeService, NbToastrService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { map, mergeMap, takeWhile } from 'rxjs/operators' ;
import { SolarData } from '../../@core/data/solar';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';
import { ShowcaseDialogComponent } from '../modal-overlays/dialog/showcase-dialog/showcase-dialog.component';
import { DialogNamePromptComponent } from '../modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component';
import { ProgressCustomComponent } from '../modal-overlays/dialog/progress-custom/progress-custom.component';

interface FSEntry {
  'file Name': string;
  'created date':string;

}


interface CardSettings {
  title: string;
  iconClass: string;
  type: string;


}

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
//  public uploader:FileUploader = new FileUploader({url:'http://localhost:3000/upload'});
customColumn = 'Nume Folder';
defaultColumns = ['Nume Fisier', 'Data adaugare','Delete file' ,'Actiune'];
allColumns = [];
dataSource: NbTreeGridDataSource<FSEntry>;
data  = [];
fileUpladerGroup:FormGroup;
progress: number = 0;

showProjectTable = true;
destroyByClick = true;
hasIcon = true;
position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_LEFT;
index = 1;
preventDuplicates = false;
duration = 2000;
ProjectLabel : string = '';


displayDropDownData : any;

  private alive = true;
  submitted : boolean = false;
  solarValue: number;
  lightCard: CardSettings = {
    title: 'Light',
    iconClass: 'nb-lightbulb',
    type: 'primary',
  };
  rollerShadesCard: CardSettings = {
    title: 'Roller Shades',
    iconClass: 'nb-roller-shades',
    type: 'success',
  };
  wirelessAudioCard: CardSettings = {
    title: 'Wireless Audio',
    iconClass: 'nb-audio',
    type: 'info',
  };
  coffeeMakerCard: CardSettings = {
    title: 'Coffee Maker',
    iconClass: 'nb-coffee-maker',
    type: 'warning',
  };
  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;
  showForm = true;
  statusCards: string;
   uploadData :any
  commonStatusCardsSet: CardSettings[] = [
    this.lightCard,
    this.rollerShadesCard,
    this.wirelessAudioCard,
    this.coffeeMakerCard,
  ];
  filename = 'abc.jpg';
  url = 'http://localhost:3000/abc.jpg'
  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
    dark: CardSettings[];
  } = {
    default: this.commonStatusCardsSet,
    cosmic: this.commonStatusCardsSet,
    corporate: [
      {
        ...this.lightCard,
        type: 'warning',
      },
      {
        ...this.rollerShadesCard,
        type: 'primary',
      },
      {
        ...this.wirelessAudioCard,
        type: 'danger',
      },
      {
        ...this.coffeeMakerCard,
        type: 'info',
      },
    ],
    dark: this.commonStatusCardsSet,
  };

  constructor(private themeService: NbThemeService,
              private solarService: SolarData,
              private formBuilder:FormBuilder,
              private router: Router,
              private projectStatusService:ProjectStatusService,
              private cd: ChangeDetectorRef,
              private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
              private toastrService: NbToastrService,
              private dialogService: NbDialogService
              ) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
    });

    this.solarService.getSolarData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.solarValue = data;
      });
  }


  ngOnInit(): void {

  this.fileUpladerGroup = this.formBuilder.group({
    fileName:['' , Validators.required],
    file:['', Validators.required],
    fileType:[''],
    originalName:[''],
    folderName:['',Validators.required]
  })
  this.allColumns = [this.customColumn, ...this.defaultColumns];
  this.getFolderName()





  this.createArrayObject();

}
getFolderName(){
  this.projectStatusService.getAllFolderNames()
  .subscribe(
    response=>{
      this.displayDropDownData = response;

    }
  )
}
  get formData(){
    return this.fileUpladerGroup.controls;
  }



  RoutePage() {
    this.router.navigate(['/page/dashboard'])
  }

  recviceFolderCreation(event){
    if(event){
        this.getFolderName();
    }
  }
  uploadFile(event){
    const fileEvnet = event.target.files[0];

  //  console.log(fileEvnet);



    this.uploadData = fileEvnet;
   // this.uploadData.append('file', fileEvnet);

    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    this.fileUpladerGroup.controls['fileName'].setValue(file.name);
    this.fileUpladerGroup.controls['fileType'].setValue(file.type);
    this.fileUpladerGroup.controls['originalName'].setValue(file.name);


    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      this.fileUpladerGroup.controls['file'].setValue({
       fileEvnet
      });
      this.cd.markForCheck();
    }
  }

  onSubmit() {
    this.submitted = true;

    if(this.fileUpladerGroup.valid){

     // console.log(this.formData.fileName.value)
      let uploadObject = {
        fileName:this.formData.fileName.value,
        type:this.formData.fileType.value,
        orginalName:this.formData.originalName.value,
        id:this.getUniqueId,
        folderName:this.formData.folderName.value,
      }
      const formData = new FormData();
      formData.append('file',this.uploadData)
  this.projectStatusService.fileUpload(formData ,uploadObject.folderName).pipe(
    map(file=>{
      const result = file
      console.log(file);
      return result;
    }),
    mergeMap(response =>{
      const saveRequest = this.projectStatusService.saveProjectFile(uploadObject);
      return forkJoin([saveRequest]);
    })
  ).subscribe(
    final=>{
      console.log(final);
        this.submitted = false;
      this.fileUpladerGroup.reset();
      this.createArrayObject()
      this.showToast("success", null, 'File uploaded Done');


    }
  )
    }


  }
get getUniqueId() {

  var chars = "ABCDEFGHIJKLMNOPQRSTUFWXYZ1234567890";
  var string_length = 15;
  var id = "F_" + "";
  for (var i = 0; i < string_length; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    id += chars.substring(rnum, rnum + 1);
  }

return id;

}
  ngOnDestroy() {
    this.alive = false;
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
  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }

  createArrayObject() {
    this.data = [];
    this.projectStatusService.getAllFilesData()
    .subscribe(
      responses=>{
        console.log(responses);
      responses.forEach((response , index)=>{
        var _projectRow = {
          data :{
           id:  response.id,
           'Nume Fisier':response.fileName,
          'Data adaugare':moment(response.createDate).format('YYYY-MM-DD'),
          'type':response.type,
          'originalName':response.orginalName,
          'Nume Folder':response.folderName
          }
        }
        this.data.push(_projectRow);
        }
        )

        this.dataSource = this.dataSourceBuilder.create(this.data);
      }
    )


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
  deleteFile(row){
    this.dialogService.open(DialogNamePromptComponent , {context:{
      dialogObjectData: {
          titileHead: 'Are You Sure',
          titleBody: 'You wont be able to revert this!',
          buttonText:'Delete'
      }
    }}).onClose.subscribe(result=>{
        if(result == 1){
          this.projectStatusService.deletDocument(row)
          .subscribe(res=>{
            console.log(res)
            this.showToast("success", null, 'File deleted Successfully!');
            this.createArrayObject();






          },error=>{
            this.showToast("danger", null, 'File deleted Failed!');
          });
        }
    })

  }

  downloadFile(event) {

    let _downloadFile = {
        "Uploaded folder name":event.data['Nume Folder'],
        "originalName": event.data.originalName
    }


    this.dialogService.open(ProgressCustomComponent, {


    }).onClose.subscribe(res=>{
      this.projectStatusService.downloadFile(_downloadFile)
       .subscribe(
         response=>{
          let myBlob: Blob = new Blob([response], {type: `${event.data.type}`});
          var fileURL = URL.createObjectURL(myBlob);
          window.open(fileURL);
         }
       )
    });







  }

}
