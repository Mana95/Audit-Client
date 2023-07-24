import { ECommerceService } from './../../e-commerce/services/e-commerce.service';
import { Component, Input, OnInit, Output ,EventEmitter  } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ProjectStatusService } from 'app/@core/mock/project-status.service';
import { DialogNamePromptComponent } from 'app/pages/modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component';

import * as moment from 'moment';

interface FSEntry {
  'name': string;
  'project Description':string;
  kind: string;
  items?: number;
}

  
@Component({
    selector:'project-list',
    templateUrl:'./project-list.component.html',
    styleUrls:['./project-list.component.scss'],
})

export class ProjectListComponent implements OnInit {
  data=[];
 
    @Input() kind: string;
    @Input() expanded: boolean;
    // @Output() deleteEmitter = new EventEmitter();
    @Output() deleteEmitter = new EventEmitter();
    // = 'Start Date';
    defaultColumns = [ 'Start Date' ,'Nume Proiect', 'Columns Count', 'Action' ];
    allColumns = [];
 
    dataSource: NbTreeGridDataSource<FSEntry>;
    sortColumn: string;
    sortDirection: NbSortDirection = NbSortDirection.NONE;

    // private data: TreeNode<FSEntry>[] = [
    //   {
    //     data: { 'Start Date': 'Projects', size: '1.8 MB', items: 5, kind: 'dir' },
    //     children: [
    //       { data: { 'Start Date': 'project-1.doc', kind: 'doc', size: '240 KB' } },
       
    //     ],
    //   }
    // ];
    constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
      private projectStatusService:ProjectStatusService,
      private dialogService: NbDialogService,
      private router: Router,
      private eCommerceService :ECommerceService
      ) {   this.dataSource = this.dataSourceBuilder.create(this.data)  
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
    ngOnInit(){
      this.displayTableData();
    }

    displayTableData(){
      this.allColumns = [  ...this.defaultColumns ];
        this.projectStatusService.getAllMainProject()
        .subscribe(
          res=>{
            if(res){
          
              res.forEach((v ,i)=>{
                let subArray = {data:{}};
                // let OnjectData = {
                // 'Start Date':v.createDate,
                //   'Main Project Name': v.mainProjectName,
                //    'Columns Count':   v.columnsFields.length
                // }
                subArray.data['Start Date'] = moment(v.createDate).format('YYYY-MM-DD');
                subArray.data[ 'Nume Proiect'] = v.mainProjectName;
                subArray.data['Columns Count'] =v.columnsFields.length;
                subArray.data['_id'] =v._id;

                this.data.push(subArray);
              })
            };
            this.dataSource = this.dataSourceBuilder.create(this.data)  
         
          
          }
        )
    }

    doubleClicked(event) {
      
      const _ProjectName = event.data['Nume Proiect'];
      localStorage.setItem("listView",_ProjectName);  
  //    this.eCommerceService.setDashBoardData(_ProjectName);
      this.router.navigate(['/dashboard']);
        

    }

    onClickDelete(event) {
      
      this.dialogService.open(DialogNamePromptComponent, {context: {
        dialogObjectData: {
            titileHead: 'Are You Sure',
            titleBody: 'You wont be able to revert this!',
            buttonText:'Delete'
        }
      }})
   .onClose.subscribe(res=>{
        if(res == 1){
          this.data = [];
        this.dataSource = this.dataSourceBuilder.create(this.data) 
          const _uniqueID = event.data._id;
          console.log(_uniqueID);
      
            //this.showListProject = false;
            this.projectStatusService.deletMainProject(_uniqueID)
            .subscribe(
              result=>{
                this.displayTableData();
    //this.showListProject = true;
              })

        }
      })
    }
    onClickView(event){
      const _uniqueId = event.data._id
      this.router.navigate(['/pages/view-main-project/'+_uniqueId]);



    }
    
      getShowOn(index: number) {
        const minWithForMultipleColumns = 400;
        const nextColumnStep = 100;
        return minWithForMultipleColumns + (nextColumnStep * index);
      }
      newProject() {
        this.router.navigate(['/pages/main-project']);
      }

      onClickNavigate(type = false) {
        if(type){
            this.router.navigate(['/pages/dashboard']);
            return
        }
} 
}