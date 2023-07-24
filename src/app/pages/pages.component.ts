import { ProjectStatusService } from './../@core/mock/project-status.service';
import { Component, OnInit } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit{

  menu = MENU_ITEMS;


  constructor(private projectStatusService : ProjectStatusService) {

    this.projectStatusService.getAllFolderNames()
    .subscribe(
      result=>{
        console.log(result);
        if(result){
          result.forEach((f ,i)=>{
            if(f){
              let routeObject = {
                title:f.name,
                icon:'attach-2-outline',
                link: '/pages/layout/folder-creation/'+f.name,
              }
              var _findChil = MENU_ITEMS.find(c=>c.title== 'Document Folder');
              if(_findChil){
                _findChil.children.push(routeObject);
              }
            }




          })


        }





      }
    )





  }

  ngOnInit(){

  }
}
