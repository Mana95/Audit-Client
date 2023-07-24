import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbSortDirection, NbTreeGridDataSource } from '@nebular/theme';
import { ProjectStatusService } from 'app/@core/mock/project-status.service';

@Component({
  selector: 'folder-view',
  templateUrl:'folder-view.component.html'
})
export class FolderViewComponent implements OnInit{
  
    constructor(private projectService:ProjectStatusService){

    }

    ngOnInit(){

    }
}
