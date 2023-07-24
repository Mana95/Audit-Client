import { ProjectStatusService } from './../../@core/mock/project-status.service';
import { Component, OnInit } from '@angular/core';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbSearchService, NbToastrService, NbTreeGridDataSource } from '@nebular/theme';
import { Router } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { ShowcaseDialogComponent } from '../modal-overlays/dialog/showcase-dialog/showcase-dialog.component';
import { ECommerceService } from './services/e-commerce.service';
import { DialogProgressPromptComponent } from '../modal-overlays/dialog/dialog-progress-prompt/dialog-progress-prompt.component';


interface FSEntry {
  name: string;
  size: string;
  kind: string;
  items?: number;
}
@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent implements OnInit {

  showProjectTable : boolean = false;
  statesCompleted = 'completed';
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_LEFT;
  index = 1;
  preventDuplicates = false;
  //Card status
cardStatusArray = [{
  id:1,
  cardName :'Taskuri active',
  status:'success',
  cardIcon:'loader-outline',
  progressbarValus : 0,
},{
  id:2,
  cardName :'Deadline apropiat',
  status:'warning',
  cardIcon:'alert-circle-outline',
  progressbarValus : 0,
},{
  id:5,
  cardName :'Deadline depasit',
  status:'danger',
  cardIcon:'bar-chart-2-outline',
  progressbarValus : 0,
},{
  id:3,
  cardName :'Taskuri completate',
  status:'info',
  cardIcon:'done-all-outline',
  progressbarValus : 0,
},{
  id:4,
  cardName :'Taskuri totale',
  status:'basic',
  cardIcon:'bar-chart-2-outline',
  progressbarValus : 0,
}
];
//////////
ongoingProjectArray:any;
completedProjectArray:any;
dataSource: NbTreeGridDataSource<FSEntry>;
mainSearchText:string ='';
showSection:boolean = false
ProjectName:string;
tableColumns : any;

private destroy$ = new Subject();
constructor( private router: Router,
  private projectStatusService:ProjectStatusService,
  private dialogService: NbDialogService,
  private searchService: NbSearchService,
  private eCommerceService: ECommerceService,
  private toastrService: NbToastrService,) {
  }


ngOnInit() {


  this.defaultLocalStorage();


  //this.defaultLoadtData();



}

onClickSearch() {
  //this.SearchDone = true;
  this.searchService.onSearchSubmit().pipe(first())
  .subscribe((data: any) => {

    this.showSection = false;
    // if(this.mainSearchText == data.term){
    //     return;
    // }
    this.mainSearchText = data.term;

   this.loadDynamicData();


  },
  err=>{

  },
  ()=>{
    console.log('Done')
  })
}




defaultLocalStorage() {
  const _getViewProject = localStorage.getItem('listView');

  const _collection = localStorage.getItem('collection');
  const _columns = JSON.parse(localStorage.getItem('projectInfo'));

  if((_collection != undefined || _getViewProject) && _columns !=undefined){
    // this.tableColumns = _columns[0]
    // this.ProjectName = _collection;
    const _collectionName = _getViewProject == ''?_collection:_getViewProject;
    this.loadDynamicData(_collectionName);
    //this.showSection = true;
  }
}
//Load main project data
loadDynamicData(search = '') {

  const _searchText = (search == '')?this.mainSearchText:search
  this.projectStatusService.getByProjectName(_searchText)
  .subscribe(
    res=>{
      console.log(res);
      if(res && res._returnArray[0])
      if(!this.showSection){
        this.tableColumns = res._returnArray[0].field.columnsFields;
        this.ProjectName = res._returnArray[0].field.mainProjectName;

      }
      this.ongoingProjectArray = res.docs;
      var _ProjectArray = new Array(this.tableColumns);
      localStorage.setItem('projectInfo', JSON.stringify(_ProjectArray));
      localStorage.setItem('collection',this.ProjectName );
      localStorage.setItem('listView','');
      localStorage.setItem('mainProjectID',res._returnArray[0].field.uniqueIndex );
      this.showSection = true;
      this.defaultLoadtData();

    },
    error=>{
      console.log(error)
    }
  )
}

defaultLoadtData(defaultData = false) {
  //this.ongoingProjectArray = [];
  //this.completedProjectArray =[];
      var onGoingData = 'result[0]';
      var completedDat = 'result[1]';
      let _filterOngoingProject =  this.ongoingProjectArray.filter(pr=>pr.status == '1');
      let _findOngogingProject = this.cardStatusArray.find(crd=>crd.id == 1);
      let _findCompleted = this.cardStatusArray.find(crd=>crd.id == 3);
      let _findTotalProject = this.cardStatusArray.find(crd=>crd.id == 4);
      if(_filterOngoingProject){
        _findOngogingProject.progressbarValus = _filterOngoingProject.length;
      }
      _findCompleted.progressbarValus = (this.ongoingProjectArray.length - _filterOngoingProject.length);
      _findTotalProject.progressbarValus = this.ongoingProjectArray.length;
      this.showProjectTable = true;
      var _currentDate = new Date();
      let _ddlineCount = [];
      let _expiredCount = []


      if(_filterOngoingProject){
        const _OnlyDate = this.tableColumns.filter(p=>p.type == 'Date');




        _filterOngoingProject.forEach((pra , index)=>{
          let _checkDate = [];
          const _findCol =  this.tableColumns.find(tb=>tb.dbName == Object.keys(pra)[index]);

          var startDate = new Date(pra.startDate);
            if(_OnlyDate.length > 1){
              _OnlyDate.forEach((pr ,indexP)=>{
                if(pr.dbName != 'startDate'){
                  if(pra[pr.dbName]){
                    let _chekOb = {
                      deadlineNumber: Number(pr.deadlineNumber),
                      dateDeadline:pra[pr.dbName]
                    }
                    _checkDate.push(_chekOb);
                  }

                }
              })
            }
            var mindate= _checkDate.sort((a,b) => new Date(b.dateDeadline).getTime() - new Date(a.dateDeadline).getTime())[_checkDate.length-1];
            if(mindate){
              var deadlineDate = new Date(mindate.dateDeadline);
              var _setDate = new Date(deadlineDate.setDate(deadlineDate.getDate() -mindate.deadlineNumber));

              if((startDate >  new Date(mindate.dateDeadline)) || (_setDate <=startDate) ){
                const _findDup = _ddlineCount.find(f=>f==pra);
                if(!_findDup)
                _ddlineCount.push(pra)
              // }else if(_setDate <=startDate){
              //   const _findDup = _ddlineCount.find(f=>f==pra);
              //   if(!_findDup)
              //   _ddlineCount.push(pra)
              // }
            }else if (startDate <= new Date(mindate.dateDeadline) ){
              _expiredCount.push(pra)
            }

            }






          // return;
          // var deadlineDate = new Date(pr.Termen_Actiune_Corectiva);
          // var _actiuneCorrectiveDate = new Date(pr.Termen_Corectie);
          // var _setDate = new Date(deadlineDate.setDate(deadlineDate.getDate() -7));
          // var _setactiuneCorrectiveDate = new Date(_actiuneCorrectiveDate.setDate(_actiuneCorrectiveDate.getDate() -7));

          //

          // if( (startDate >  new Date(pr.Termen_Actiune_Corectiva)) || (startDate >  _actiuneCorrectiveDate)){
          //   _ddlineCount.push(pr)
          // }
          //  else if((_setDate <=_currentDate)|| ( _setactiuneCorrectiveDate<= _currentDate)){
          //   _ddlineCount.push(pr)
          //     }


        });

      const _findDedLine = this.cardStatusArray.find(crd=>crd.id == 2);
      if(_findDedLine){
        _findDedLine.progressbarValus = _ddlineCount.length;
      }
      const _findExpired = this.cardStatusArray.find(p=>p.id==5);
      if(_findExpired){
        _findExpired.progressbarValus = _expiredCount.length;
      }
      }
      // var _completd = this.ongoingProjectArray.filter(pr=>pr.status = '2');

      // if(_completd){

      // }
if(_ddlineCount && _ddlineCount.length>0)
 this.open(_ddlineCount.length)



}
open(count) {
  this.dialogService.open(ShowcaseDialogComponent, {

    context: {
      title: `${count} proiect/e au deadline apropiat! Acestea vor fi afisate cu rosu `,
    },
  });
}

reciveopenEditData(event) {

  if(event == 'delete'){

      this.defaultLoadtData(true)
  }else{

   this.router.navigate(['/pages/edit-project',event]);
  }

}
reciveopenCalenderData(event){
  this.eCommerceService.setCalanderItemData(event);
}
navigate(type){
  const _scroll = document.querySelectorAll("."+type);
    const _scrollTo = _scroll[0];
    _scrollTo.scrollIntoView({ block: 'start',  behavior: 'smooth', inline: 'start' })


}
newProject() {
  var eventData = 'new-project'
  this.router.navigate(['/pages/edit-project',eventData]);
}

reciveDelete(data) {
this.showProjectTable = false;
this.showSection = false;
const _collection = localStorage.getItem('collection');
this.loadDynamicData(_collection);

}

reciveFileUpload(data){
   this.dialogService.open(DialogProgressPromptComponent, {

    context: {
      title: `${data.data._id}`,
    }, dialogClass: 'model-full'
  }).onClose.pipe(first()).subscribe(returnedObj => {
  //  console.log(returnedObj);
    if(returnedObj){
      this.showToast('success', 'dsddsd', 'File uploaded succesfully');
    }
  });

}

private showToast(type: NbComponentStatus, title: string, body: string) {
  const config = {
      status: type,
      destroyByClick: true,
      duration: 4000,
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

doubleClicked(element){

}
}
