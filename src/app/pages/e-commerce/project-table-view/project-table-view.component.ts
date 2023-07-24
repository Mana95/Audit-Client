
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, HostListener, ElementRef } from '@angular/core';
import { NbDialogService, NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ProjectStatusService } from 'app/@core/mock/project-status.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import { DialogNamePromptComponent } from 'app/pages/modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component';
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent, PerfectScrollbarDirective
} from 'ngx-perfect-scrollbar';
import { interval } from 'rxjs';
import { takeWhile, filter } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
interface FSEntry {
  'name': string;
  'project Description': string;
  kind: string;
  items?: number;
}


@Component({
  selector: 'project-view',
  styleUrls: ['./project-table-view.component.scss'],
  templateUrl: './project-table-view.component.html'

})


export class ProjectTableViewComponent implements OnInit {







  // @HostListener('mouseup', ['$event']) onClick($event){
  //   console.info('Click event fired', $event);
  //   if($event.which === 2)
  //      console.info('Middle mouse button clicked');
  // }
  @ViewChild('widgetsContent', { read: ElementRef }) public widgetsContent: ElementRef<any>;
  public config: PerfectScrollbarConfigInterface = {};
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;

  @Input() inputTableData: any;
  @Input() completeState: string;
  @Input() tableColumns: any;
  @Input() ColumnData: any;

  @Output() fileUploadEmitter = new EventEmitter();
  @Output() deleteData = new EventEmitter();
  @Output() outPutEditData = new EventEmitter();
  customColumn = 'Nume';
  fileField: boolean = false;
  //  defaultColumns = ['Data Inceperii', 'Deadline' , 'Incarcare','Stare','Acțiune'];
  defaultColumns = [];
  allColumns = [];

  dataSource: NbTreeGridDataSource<FSEntry>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;
  data = [
    //  {
    //   data: { 'id':1, 'Name': 'Projects', 'Start Date': '2020/10/25', Deadline:  '2020/11/25', Incharge: 'Shawn' }   
    // },
  ];
  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private projectStatusService: ProjectStatusService,
    private dialogService: NbDialogService,
    private cdr: ChangeDetectorRef,
    private ele: ElementRef,
    private router: Router,

  ) {

  }
  ngOnInit() {
    this.setupFolderData()

    this.createArrayObject();


  }

  getDisplayTable(index) {
    if (index == 4) {
      return true
    } else if (this.tableColumns.length == 3 && index == 2) {
      return true;
    }
    return false;
  }
  setupFolderData() {
    if (this.tableColumns) {
      //const _filterType =this.tableColumns.filter(tb=>tb.type == 'File')
      const _withouFile = this.tableColumns.filter(t => t.type != 'File');
      _withouFile.forEach((col, index) => {
        if (index == 0) {
          this.defaultColumns.push('No');
        }
        if (col.type != 'File')
          this.defaultColumns.push(col.columnName);

        if (_withouFile.length - 1 == index) {


          this.fileField = true;
          this.defaultColumns.push('upload file');

        }
        if (_withouFile.length - 1 == index) {
          this.defaultColumns.push('Action');
        }
      });

      // if(_filterType && _filterType.length > 0){
      //   _filterType.forEach((fil , Filindex)=>{
      //     if(fil){
      //       this.defaultColumns.push(fil.columnName);
      //     }
      // })
      // }




    }
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


  onClickEdit(event) {



    localStorage.setItem('calenderClick', 'false');

    this.outPutEditData.emit(event.data._id)
  }



  createArrayObject() {
    this.allColumns = [];
    this.allColumns = [...this.defaultColumns];
    if (this.inputTableData) {
      this.data = [];
      this.inputTableData.forEach((project, pIndex) => {
        let subArray = { data: {} };

        this.tableColumns.forEach((column, cIndex) => {
          subArray.data[column.columnName] = (column.type == 'Date') ? moment(project[column.dbName.replace(/\s+/g, '_')]).format('YYYY-MM-DD') : project[column.dbName.replace(/\s+/g, '_')]
        });
        subArray.data["No"] = (pIndex + 1);
        subArray.data["_id"] = project._id;
        subArray.data["customDeadline"] = project.customDeadline;
        ///status


        //  this.data.push(subArray);
        subArray.data["status"] = project.status;
        this.data.push(subArray);

      });
      this.dataSource = this.dataSourceBuilder.create(this.data);
    }
  }
  setStatus(row) {
    // if()


    if (row) {
      var _currentDate = new Date();
      var deadlineDate = new Date(row.data['Deadline']);
      var deadline = Number(row.data.customDeadline);
      var _setDate = (deadline == undefined) ? deadlineDate.setDate(deadlineDate.getDate() - 7) : deadlineDate.setDate(deadlineDate.getDate() - deadline);

      if (new Date(_setDate) <= _currentDate) {
        return 'danger'
      }

    }


    return 'info';
  }

  getDisplayStatus(row) {

    //first check with deadline and


    if (row) {

      if (row.data['status'] == '2') {
        return { nbTooltip: 'Project is completed', status: 'primary', message: row.data['Termen Actiune Corectiva'] }
      }
      const _findnoDate = this.tableColumns.find(tb => (tb.columnName != "startDate" && tb.type == 'Date') ? true : false);
      if (!_findnoDate) {
        return { nbTooltip: 'No deadline for  the project', status: 'basic' }
      }
      // this.tableColumns;
      //  var _currentDate = new Date();
      var startDate = new Date(row.data['startDate']);
      if (this.tableColumns && this.tableColumns.length > 0) {

        for (const obj of this.defaultColumns) {
          const _findColumn = this.tableColumns.find(tb => (tb.columnName != "startDate" && tb.type == 'Date'));
          if (_findColumn && _findColumn.type == 'Date') {
            let _checkDate = [];
            const _OnlyDate = this.tableColumns.filter(p => p.type == 'Date');
            if (_OnlyDate.length > 1) {
              _OnlyDate.forEach((pr, indexP) => {
                if (pr.columnName != 'startDate') {
                  if (row.data[pr.columnName]) {
                    let _checkOb = {
                      deadline: (pr.deadlineNumber == undefined) ? 7 : pr.deadlineNumber,
                      cDate: row.data[pr.columnName]
                    }
                    // _checkDate.push(row.data[pr.columnName]);
                    _checkDate.push(_checkOb);
                  }

                }
              });
              var mindate = _checkDate.sort((a, b) => new Date(b.cDate).getTime() - new Date(a.cDate).getTime())[_checkDate.length - 1];

              if (mindate) {
                var deadlineDate = new Date(mindate.cDate);
                var deadline = Number(mindate.deadline);
                var _setDate = new Date(deadlineDate.setDate(deadlineDate.getDate() - deadline));
                if (startDate > new Date(mindate.cDate)) {
                  return { nbTooltip: 'Ai ratat termenul limită', status: 'danger', message: mindate.cDate }
                } else if (_setDate <= startDate) {
                  return { nbTooltip: 'Termenul limită vine în curând', status: 'warning', message: mindate.cDate }
                } else {
                  return { nbTooltip: 'Activați proiectul', status: 'success', message: mindate.cDate }
                }
              }

              //   const _findMin = new Date(Math.min(..._checkDate.map(e => new Date(e))));



            }

            // var deadlineDate = new Date(row.data[_findColumn.columnName]);

            // var _setDate = new Date(deadlineDate.setDate(deadlineDate.getDate() -7));


          }
        }
      }
    }

  }


  generatePdf(row) {

    const _collection = localStorage.getItem('collection');

    this.projectStatusService.getByProjectName(_collection)
      .subscribe(
        response => {
          console.log(response);
          const documentDefinition = this.getDocumentTemplate(response)
          pdfMake.createPdf(documentDefinition).open();
        }

      );
  }



  getDocumentTemplate(response) {

    const _collection = localStorage.getItem('collection');
    const mainProjectID = localStorage.getItem('mainProjectID');

    var _tableData = response.docs;
    var _columns = response._returnArray[0].field;

    var createdDate = moment(_columns.createDate).format('YYYY-MM-DD')






    return {
      content: [
        {
          columns: [
            {
              image:
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPwAAADICAMAAAD7nnzuAAABqlBMVEX////3dh/x9fZCQkJNTU33+fpSa4Q3R1fh6/D3dBr3chX8/PxKSkqEhIT5nWL39/e2trb+9O3h4eHw8PCvr6/Q0NC8vLzs7OzU1NRERETDw8P4iDn6p3Dn5+fW4+jS0tKjrLD3bQD4jU+stLj/+Pb+7+Tc3NxVVVU8PDzCyMtfX194eHhvb2/93Mr92cLy+f74fyyfn5/3cgCUlJTfX0/qcB2IiIj7wZ/959ftgkL6tIxxcXG3v8MANFVDV2o8Tl5hdov6rHznh0f5lFT8y7DHrKDXXQDfaxwAK08VPlx5kKDVbiXw1sjrubThbV/nlozmoJkrPU/6s5F8lqflqT5CYHzGurH5nGv3wpn21rbclmnToIDgkl3OrZbannXphlHVy8TzxJTyqmram3v0lU7w49/bgVLltmrmsVjZkWDzyZ3t4MPot6PinirDsKfXeDbluXztzsvwuLDkiX8qU2/jfnGRrLq+g3yQYmiAY2saMEWgiWHTqFrpyIzmrkzt17O8mYdUYW6tXjCJTS1jTUO5WBeGRBihThRhQS9wQSWORhRqT0GWZEXFdT0X5p4KAAAgAElEQVR4nO1dC3fTWJKW7ThgKY4cybIUOcJ2HMtRnIeTNI5JDCQQmiE9NI9uwvBq6OnJwJBtpkMDuzu7Dct29zz28Z+3qq4kS7ZsCyInsIeaM32CLdv6qup+Vbdu6V6O+ySf5JN8kk8yRBGEmS4RhOO+q2HLzESl2Vxc25qazudLbVmp56enttYWm5XKxMxx3+NQZKK5sH1zarq+UirxfCqVinkE/snzoAXQwc3thebEcd9rtFJZvLl1Mb9S4v2gOwV0AG5wcevmYvO47zgqaa7dnq7zYO5+uH0a4Otnbv/u/wH+5no+lhpg8EAFpGL59cpx3/0hZKayfbEU1uABGgASWGt+nAxYWdxKlfj3Re7gr28tfHz2b66Nxw6JnMHnU7fXPq7hX1mfTkUBnYRPTa9/PPArU/V3Zbj+kkrVpz4K5xdmxg9Bcj3h8ysfAfzKWj0yf/cLX1/7sOFPrF2M3uqOpFamtz/gzHcxGobvKXzs9uJxY+whM+vD8ngP/PrWccMMEmExXxqax7cF0p47xw21Syrr/NDNbsNPfWg5/8LF0tFAR1m5+CGN/Jm1vMfsMCXl33ke904CUe+Dme/MbMU8UPn83Xt375/Jx0pYs+ks2kQjqdjWBxL0Kl6zx1J3LVMyNUXX9UsPvvnm/oV6nb2OaohOD/zFDyLdX/QFOP6unrTfEGXVAC1Y1u6De+ALDx+eOQOKiMoZ+NjxD/yZ7bofySWVixdMyVBVOUnlaEGMy4ZhghoeoRa+AzVcAC3wh9VCKrV93NjXvNgBT/6ZwBnFYrFcbrUsS9FMU1XjTAmgBVU1YEg82t19gM5w98KFemwFiSG8eH4tFVs73oHvpbpSbGpqav2RwJlFU0V/b5VRCaAFUoMhso8IQjIpxuMqaeHZpUuXwBfu39+aCif5khf9+nGS/rjHEvw62sHQAHxZdXDGQQugBEtTk8HfIMigBUXJ5XRFgcEiD1y5+daLnj8+9DNT3htZp9cMUxCslhz6O8AN2B+ibEhaAWKEAmNFkuKiKAYr4lsvv5bGj8nzJ7a8mY2dcksmJ1iWGPpLREPTkB7luMigYoyQNE1RCvAGvSOLolcLE3kvS5YuHkuuO+FLbVLTLO6aEie0LDWeTCY7DKea4NxZkAy4uNFWj2y2gBqQF1ANqpp06FEmdjQ1rVBQmIJICRPjvpIBP3UMthd82AE8s4BmcMmydZIk3gaoL6dr83PV6tjk5ORItTq3kV7NSM67IqQDVpseLVCDaahxph9BFGUZhoRpFhQFieHRNxfyKe8E8hjG/ZR/EmeDFxSVE4sMvEtxenquOoYyYgv7R3Uu6+IHS0MUkA2iR1ICSgu1IAvtS0RVNU1Fh1B5wf35Y2A9L+l6wIuazMkE3ja7KDVmE37Y7b8nExt6EDeKccksWBAiUQOYNLQsyJuAA92hZOh3PTF2/YhA27LdmZp5wEvlgmN2WUmDm7tQwd/n5+fJ+W0VjM3O62rPX8EIgCPCQjUwJVimacDo59RLZzzojzTXW8z3AC9rIoR5jeV0nNIYYdDHJsfmG8tZiGOmaep6Lru6MWL7w9hkLTMgMiL3IfkVFMYMxbLFiYU/tsddKnWEeX5zuqtq4wFfsHMcY3mOQQfkWVOSveQPHJdrVBMM/ki6wF6NU5Do+bMCkZ9hFAC8oP3RG2jzRzbHg2DTid0BjwmexWhMmyfTjiUml02MUUIy7gpBFMXs3CyDX80ydHE7TNhX9BC1rHWAj/HjRxXuf1/qwu4BnyQnFpfJrGMjc4jLC7ytAXhDqVXHmO8b9NU2elviJ0kLnWqQyiYnPjrjG3mlraOh/O0A7A5402TpqpyeJZPOZ+U2cvnkqVOYu2nIWQQfYOm1EYI/rwjd6NtqYCOC6cEsG5y46wd/RKTXjAVNwhl4wdTo9qT0JBH8qslxDPpJAM7EPHWqgJGL4AMzytk5Ql/N4SeFk6eC4btKiCeVIsTTBx2cm0odwbCvBAx4F7yo0Hg3NxDO5JwuMuht5F6xoQA7MFXZ6HUdJsAF7VRvJVhFUNmDescd8NPDd/z14OILAy9LaHiJTJmYhzlO3DZ7MPxTNnwgCEKv4w+oGUj/QXIwzdUVTetWglUWOPVeJ3iYUw8b+2K9D3iRYpxcI0M2VC6I5jrUQPBh5GPWY9vesHQ945Ocjum+g/1UqwXgv+u6j1R9yNG+8oce6zIIXjTQ7sI8YV8WuE52dwSYz+MLMo38HLL+2JyGP+J4CkxkdLB/LpPJMslpDLwlcOZ33TfCTw833q2vBGNH8Ek2TyUXTgD2ZDB0RO/SP0Qz5vpCDscKi3iCz8khQhQsC9WQccEDs94NsMJwpzgLPdfjALxKTq+P2Nh72d2Lvi2CQLafbKDzJANYjsUJ+gvCvPDofsCtpOoLQwR/sQ/4PTK8OY8Q0nJf7EFcIHBZiniU6/WI9rYaAHzy0YUg7uHHh2f67d4LsQAeMztxdRITFqkTewf4YPQNJItZp8aDudHJIC1oRYNL7gaCj5XWhoW90jWX84A/81tM7XQibaWb5weDB85nXtPxq1jqjnuVYBUhjlzqcS8rw+rb7xHimVzYgytkvP2R5e5UPhkCfJLTcNizaN8tTAmgBqUsc8muHMcx/ZA6N5rTfcCf/iOOthw5vQpOX3l38ED5y/j5dP/ar4iVcflBj3sZ0uR25maf1ovTl+/hNRiuZnVw+qXHS+/s9uD4BuTFY71M74K3RM540DPmDiXPa/YZ8QAe84tMAhMVSGqX7jx5H/BJLoOc0ehb2RFbAF76ppclUvkhhDthvdQP+5/wGjR8QiHDv5fl45xaQ/RKvxuJl2HmqAXlOExKQ8h0KoEzWQf857+FS/Qq3HhNhNnM0uOnHeAHJTmO6bM4HVzuN+rlIoB/9LDn3Qwj09nqY/jY5cu4bLKKkUrHEL/05E03sMHY0fTgPWNz/fxeLsK0OTjHYbISfcNOL4Jh4O/DFSqy1YZB+c3r/T7ge2MH02OWNGn2uREJwe/2SznqUS9g/a6f4U9//k9wiQ5Gm2QxvvL9XiC0AdARvDIL4Ff7gS/D5OdZj5k1SdQVLaEf1ccuf44ZDk3nyOsBfOeQDysCh4w30udWFAAff9bPFqlYtODv9EiobPB/hkCnptHrJSzeLN35/j2xg+nTmCv0GfSU41zqBz5WirSqIUz17S09/acJNp+DGWmSwH/dG11/v49zOXCgRK7926fK/l6HVguSoXt9KYgfjxJ880w/rz/9+XfAr4UqTUgJ/NPHPaEnhcAivqsYzkj4Bv3JW785u+MNfWUryUn3+hojVY+ypLPWt2XsMvGdAjddzdGQX/rph17Qk4JVNoVg7EK5qMY5EYNdDX/VOGW9ejV69sqVK17TFy3Icf7Uv8s5yhx34nbf37qMKY6QnaQaHIH/4duedi/v7OxogeiTr35zy0omxRpGevhV4cWLW6Nf7Zw9e/ZWu82BSxYLHKf1CfMo/O3oQv1Cv8AC4L/4La5PIXgW5eOPu3Mc2/DiKwDfEgOrGZtnX7TgCoj0Y9W2rXfOjVqee1GLGpBe3+CDCX50lLdW6vtTBF5ugMHmGarKk2YvwxtfAXjLw3qy6oLfOXsFwJMLVds9G5wU994LLtRxet/gg6aPrKITtCrrldN/RvAU6VgJp/nak+McXD1oG14qlsvFV0XVBX9w7dpVRw2bL0Zd8FjFfR7ku7RQp/e3RpRtShN94woWMpod4J+0axlXv/zs5YENXjC/asVlWS0X4zb6vR8/++xL++3iC1rDaFv+5fOAm8HV//juIPDRzW4GeH0X+KX9rydc8IDus+syoROsHYVluK/KNuUdfAlvP6d3yy9M0ginJexa1strATdjQZhXHwwCH12KO8Dru8G/eSLjYN47eP7jl4juy2sHMLJPvnplcGxqI7/aiSfVvecv8e0vX768vqe2brWSpKO25X88CLiZVgvrOAPBR+X3wgCv7xrzS28e7x1cvX7tx2vXD/YOfnx57eD6yx+f5zZfxQV7XieomzsH8P6BvHf9+oEM7//z6Cro6qoa94z5wGpcuQXjvmcdx5VUPpo8pzlIzZ1sv3TnIeC+erAn4/Rm72BvaUk9+JcT/3J1D42uwn/Ug39O/OtVxop4zZJ5fuPaNfCRg3g32/stUYa4Zw7IcVBK0Qz6fvWrNnhPnJe/XQfg/ii3M9o6uP7j9b29q88P9q6CI1ijr3xvG3svifuSQkec90u8rADp9a7jtMF/Gwn43mtUDvh2hqcQ+B/2/TPapDF6ToLX965ee3nt5UtGAdaLV06iJ7y6cjK59JyBdzO8QDHKhcE5Dko0k5uZ/uldDCc2yEy6m9tXnuy3kxgk99aLnSV6ZQlD22fP6e/kqSuv7Mtsor/2EsKCJ7f3SLLwtsgaXsoSJ1oDbykW0drN4qBsKhZzZ3UjNKur/PujU6rMqE21LKt4q+jq4rkb9uPJ1osW/WHdKjPVLC1hFS8RUMrZ/MuNc7QIzJqRBt8S+H0Uqxdrg3/nsn8+3/y30c2dHeoWNYsvfnNl1GqPABUSPqeYJbwabYFnnNr0jP44eZB3Pk+Qb5w4cYMy/EJZ5uRw4H8XAfitwcx6+c8T3krO/r/vWq1WEZL40c0XV66c3fFNY7xVzPJoyyps7pz0vEsVzFl/P660c/78ifNU1bTKIuQ4IbBDpI8AfP/pLMlpt4ZXxRre/utKkjWfnNI2z3aA95dwiy9evBg1PG8LHLXleW9ALm6Ojo6eX04y8EB6ocCnpg+PvTKQ7EFY9bZqV2+bP7nZbbJ168qmGQSekV4ZHOOc5qFHrjCLC1b2j5tFYIOdW4D9xA1axhFbAF66G4LvIilj7ocIKx11e3m/HeSTshkP8vo2+CvnCl7w6PUJe71KGb11q9xC7OdP3CDLiy3KcUJgBzk84/XqPfPJ6cs4+8QVmzG9qynDL/6li1ObV84WPe8KsmfFRtgB2Jvo8+eA7xpYyFOpGSlEjoNy+ILGdpifsdfqcJ2tIfao0HWAt/95qtXyDPkkl/Gs1Sloc8QOhj9xo4iWN7DhOkyCB5I6fEFjLdSGCKfv4rXUTWZgqG82l5j0Qu/5p9fw3lVaAXFv7jDD25EuqOG6J/jDVzFvlkKBp/X5LK7P48xu6Yfvv//6yZNvf9qvyHIQ+h5eweWwISvNvL6FNv9qkxn+xCb1pJtUyggH/vCxbiJEmCf01JmBjxfM0gL9/tOnPz1+8uTr70ELrx//9LRZqVQmJkATQc7gCGfU2p0Zss/wJ8r0YiGo4boX+NuHBh8izJNQT06WenJEWqVGkSv7C2+ePv328eOvQZ68/unpnTf7+83mhBw0Jmg26zf8jt/wnFLkAhque4B/eNjsPlSYj2ErWrsbK+vtRGNKmGg29/ffvPn2hyevQQuvH//w9OmbN/vNiuhlBs6kbiyW2qo7PsMX6UUBc5yAhuvgWzp0K27zYriwkjqzixXmnN0+HDCoEaMsg/c3m3fAF0AJMCCePP7hpzd39mk1X+A20PA1Zi/LNTxif8u8QbRawPjdDdfHDx7zcRm7KJ0OhX4iozTf/ASugLSgIvZV6sBk/u03/I0iuxuZcpyAhuvgWzpsljNgsab9Sw8tFU2mUVNSo6v3Nlhsp6/I1I5Dj2dg7+1Ms6LfcqgeDX/evhu1pfRouA66pUMv24QHr4mUmmRGWJqCqY6haZKED0B2hbsuSdLUANgONdh8/f2/ouG/cgxftu+GcpxHDz848PdN9qCFuIrBflanxmEtk8XnJHSrgM/CS6oc7xnhNeRKbFkGESrPfIYfefp0f4aBl3o1XB8r+Ltw2xk0mwgoxnL00EAybuj2QxLZDNMCqAGUEO/IcwROIexzTgeeP7n7j8evH1MZXiqq3Q+VHT/42D2JE8uUghrV2awdYQG+ZCpWrpz1CHt6SMH9ZGQXO87ix8Yy9q+2bnmTu7fSzAxbtjOL2HMcLsc5Sss/MFhZGURbbRdikk4PlkHbJuUQeVsPGnN5YXmW2pCc4lXcn9y1nC8TCuU4Fw+Z4xyl5Z+pREe01YE3s+ooZODmKJpmWfjkkCUxs0sN9lQh2T0JvFkOSu7wPaslQoIX7oaOEvyuzJbOgfZ8zaPBj9GCEgyDmV3MbUx6sCu6Yu0EZPUoIoIf0Ix0LOAtfHBewv0/HENJzq5AfRqQYIw0RuzHL4ktFRgMOz7DvzVcR4q3rGToHOfowKfqwHVaGZJQ0+kaNthjtRx6Q/CTFfC+tMqesZ9kMY4TDKNg+Ud8WocowUgkXi70bbiOGnzI9DZ1AbjOKsY5UbcfFRAVe7ltvppVhU77I3BB0Gts+4SxEe8ihXnLm9WfIIZkqmEN1yHDfATpbUjw/ENsEypySUO3nVSym4el6lhiMp0z/EwgqkZhtWpvHTCy4WuwZ+CdGJ/FbeV09mGVGq5DVvCObmLDf2NyyVaZUzU7yqm2A8QZkyeqtdUMbX9lUsRbrs0lJu09M+az/iUKdecWFe7Q8Dc2vTqTisAnu+NHBn6if+OpC/4ehPlWSzQl2/C2rTjd2TJkbDIxSZulzM+hL9g7xowl5rJd/eWGRYWMduXOEVyoA/Ahx/zhixkhy1glyHHUlmVoNmbFoXxRSSecfWHY5kDtnXJAH3MZm8tlXVcKkPKxzxedku2mb51eoQpeaPCHLmOFLGCWnsURvOP0sncQq9n5Ed8GSe4WScuu0QVdxa3hMAPM6Yzviep9hqft1tTw4A+/WLcWKqUo5UQYkS3NgdLxkIyRadTm5qojuDXW5Fi1Oje30VjWnHchIxRyjovixkA7tuFPbCi0KZqdMgrUcP0oLPgIStchVqhB6pCWa8sOAjOoo0ZScpnsMkomo5se7dCWUpTW2/uemY7hzxc13AsMd4fDp5QFbLg2w4M//KJFqOWqVB7I3WrYXiwrthLCbYsnyIIdHBCookllx/CbSbY9EkyKMM0RivDFWmjwESxXde8EFQT+oQIT2oztnU56I+GeF30flNLAqIYB5pZojyRRxnlPe8QXZdFJkfE7Rew5VvZCgz/8QmWo2jV/XxGkjM12hj2YRR2m7iyGS8EqEHDrRzbP1SEFYFQvFG/Zyd05RoAQBQQRWcQoYs9xWPCp2OGbcoQwqxb8PUlW7IEuZu1PqnjrWYKtU+QTJcMwaLojdjwzKegKaCGXy+hA9Y7TsxgvypAXAXiBFbE4vcdeNd3g84fGHqotBcCbcIfseredRlBxq1+RsFHXuEwFDHxBoiEuYmmT+YQ9cwGqp5o1K9nS5m/M8YkTNGq4HtQD7t5TFG0pYeh+5ZKm2KNTC2B6UbcRAN+TX5g0xA3cDpOlwTmXG2U3ucvgxo8kGvwFbyktFZKhsOAj2UQhRCtarHTJsh3ZKASMNJmBF4DPVIoIGtGCSeU8uoJxpWKaqjPib2zG7Q0w0YF0/BjlOEpo8FG0ok0MjnWp+jMbvODkeIaHwtqxzxGW/Uq4GyqNEpFUICBBbgZm9RqCp4ZrLTT4SDaQGEz3qfwzjbmv6aRtbCdjnerVQOgG7eHr3o5n60dSj0yflgG8O5XdwcIIhEqDbUCD2ipiwUQKCZ7/QxTYBzNe6vT/ZvUM2kbuevJdENFrFdrJWKF9bTFfdbeBt8UmQK1QdEb8eSzZKlngCN3VFoE3QoKPqPH4Tqnvr5z+4j9//gWy9XTO4AL3MrWVAK5AOxkrQGMZto2n6wqSvQ9k8pVD9TjiOVrxIF9CQpSxMq6oYcFH03I+029qc/nXv/59NgEyO5uYX+7VJe9TAu7maaIadPgfLV0IBTsxdrN6VqvHvJbRA3IC7v7I6WI48JE9VNlrMzBsxfn154Qrs7ON0JtcC/ZunuAMuBsqo0fZNfxbz4WcTYjUcK0PfNaLSWSPV/V8wAiw//UXhD1ZteGnZdyW+J1P2AV6xOpW0U3uVjnfd1COQw3XSkjwkT1gVOn1a6e/+C+GfT49aaOfXy6uZnM5rNax/cnfRRFucvdWx3ks+gJ9BUyHOazjYJgPBz66R8smevj96S/+9jPD3ph3fX8VN7Fjy3EZ3LJfY+dbiCF0IN1yY7xA9FigOW6hYCqU45QxzIcDz9+O6jlqoceeEV/8+jMZfC6drrrjfkMmRkNi9ypBJ0uqqtiHFRzDU3LHfpk2+ZVMmhhTz7EZEvzNiLBz3EJgjnf6i1//jnir6cb8ZJv1bMZHQiNGwyBvK4G0AEkPOEOAJ5jBJVv6Mvg/VsaxRhQGfJQ7QgY2413+4m9/RbRj6UbNNTyAzwR8gcDJhrtC3d7ZUjGdci3KV07Jdidw629quNbCgecvRrhhSlADLjA9gh1Jp9PtEQ/g++10Yh9dwfa2dBbq8SwPSZLdAs75LsOTqNj6UJDDWT7KDbIWumtZl3/9Gzr95EY6XRsJD94WVpnTCkqbHl2q35TEIHo0sOdYCQU+VY9ya7SZLr8Hpv8HDPRJILv03KwX/DIkrv1oza8EgRgN6LHsjPgTqzgRKJgYK73fQw3XBTEMeP5ihNgDuu5tp68C9loi4QNPMzkW4+TQShCL7Rjvo0f6HpwHYcO1HA58xJtB+s9PwdSOOX0tnW5Ufdg3JKpJup1HOKBDKEFyDP8XDd0B6FHX3f4lKn0pRZVTtVDgVyLF3rk9FICnKLfRSDfmfYZ3nwAWRFaZRWJDU2bAiCrr2AlK+tox3vuqKEsS0EKOgQfS04QQ4COazbbFt3sCYP8vym4a4PVjPvANxZ6zO5vzgxIw1hOxAXiDZX322TyuFtzk7oTW4wao4dowQ4BPxSLf+Ni7VG07PQ749JwP+0YOuTuTY5RlGO28FvkdDKgW0Buy9jX22Txi2/A7Pc64Yg3X2PEwEPwQ9vlvtk1vT2RHcMBv+AxfNQWZHdFHAcymPjq+rq0EmtGbdFqXk/u66/Hne26CyBqupcHgh7EZ4IxbzUKn/4WmcmlPUs+YHowJqSvV6sHUBqa2Tu8pgMQt/V3qYzN6Q0JX2HGTu7jQgx6p4VozBoMfxjaQ7RMNIMT/4gx4f4if5zIZl97o8CEyt6gy2rKpD1K6goau4DKf5iR35yws5tPnFfZ59xrscBSxNjwA/FA2AOVm1nkb+6//sJ2+I8SPSaxeqbG92TNs9KMvMHZjZ/JgMZOltjkaEaqngAMjXmx/3j7kS6P1bKrj4OxuAHh+OLv+shzXrt5M1hpdTp/hxPbIZicyKva8Fgc/9lsTvaG3G3gQF0ttM0U3q285dhbtM8vYJVjGM7HhGhe/+oMf2kbntN0zOP3f0cMBe8Pv9DUZC+3d9KYarHjt0htL/pLOmTxKu4CTY9P+zs/T9ulFkY4IGgB+SIZnG31f/oLy2jEwe6PmZ3ogao2ZmSWmHfRGBm9nfzlcdCwgPWruPL6s6BmXHUGLbSVgw7XIVn76gy8N7fS63/EA/q+TLK3tcPrEsn2RSIdOurP2LFAf0JvvQCKsV5oyJ1ICnGlP5+hN+9BKz7Qf13+p4VrFDKgv+OFt8c5x+dOU3rAo50tv0OnhxsX2bBQHtqa51Je1s3zvJUSPmXbJFu3NJnMCo0f2eVwAhhwnybo6+4Ef6nEudz7/2z+c1M7v9JOUnRA5a5I3s+Mc6nJm7m5VU2bXtLN6xoB2jCiYDjuKeORXnE7xGAB+qOeZJKW7mNOPBTA9GZ7z5a5O8mp/mOoXqAa9nf0BvVlOVn9eY8s5Dsm3vwb7FGVsuKZu9j7gV4Z4oIcgF5b/205vGn6nnytSwdWtWhYYrznUp3nTNrrEbjnMZt3KXc300JsoxmW77MdW69hJZf3B89PDO8FJEM1MDdhuBO1e80a5xNhyuetqQUiqBtow63IXW8rwXSS6ffWrdImdGfp+lrZMKEp2m1cfyw+R7URDX8USNTG9j+gT2VYXeN8ngdcK7aIlS/tUkahvx6a7Bi1S6O3pPyuCOPNebLgWqPWlJ/ihhXgO+4uUImQ1s3PdTJ+WWsEV1w4diOywRS+vmW8Z+LdO/5roJn8OPRbQ3ljEYl2tvcDz+SEeUCubuRqxHdaqJ73gq4ocCrwjLvXhmHh7nvZCWbWPH3babCkFxgexdHrGRKCGa+pT6AV+ZYgH+KDTV1mI70jtIL2hpfN3FqRH823ixPkT51ZteqTpv3fNQmBpAWu4pnDaA/zKEM8sE9RCcd4J8f4oV3UeKnsfKVSvnLhSlejAXcPOfQO+K9my4pxBbwSDL90eotPHgekT9kS26mN6XJ8yyxKdmPvuDVAWjnd/Q0fQikWypdg5TjB4fpjncdtOn5jHcq0f+//o2BvJTsx1anLhtdAa+Uuj96m8riSp4Zo6VALPRh1KBcMWQdWy6PQjOOB9ZJf4+2krycnIXnhirq0Eq+Cjrz5S/MtqCOx2w3Vv8MM8nTNu5rD3Ynajka7553KTv5YesDEqJOngYNPE05Px2GDnQPG+axbFvieXuMIarik/CgA/zLkcOL2yjAQ/11Wqnv0ZXG5XU70FZ0jtgKJx6m4rAdVAR2kHKCHeq1TtF2q4Zg263eBLW8M6rYsjps/SQK/5V6PJ6XEu9d2z3V2nq6yD9ajViAYEO1Ec9KCZvuplKClQwzX92QWe//0wzycUJX25ygzvL9OD01NFl18p1R/uYbFKYZM5U5X9KzKcEMfKpn2guEuPnQs3PcWihmv6sxN8aqgnMQuQ2zXGaCbbQXazP7vLl7z94KpbedRIpHbLvP1lIj5DRs7A6LGsWzT3NeR+9NiCHMdgCxoT/l7gIZ9CDVSfQfBz/i4EkF88N1H3Ea7gVi6p45RN7b1KSMKcFd/XnFPViR6paSlICWVLdB5fqfi6wIca4Al8AcFDYusn+sTs/3ps0KPlkdZl4qpk13LAIQwj7vUEZMc4Td0demwhPWITnmdTfzzIwn5gbd13+vgwZzN0f6qWWx1LjMx32H12eSbvQ1/hhGDhnDewuEnVHpzTSmq866dQCw47Upiw2IbI9X0AAAKxSURBVMIN6zaHr5nxbT4daeNRMHjZ1Jf9EY6wzxvczJTnLDN+JR9eLtz97t6lSxAlHiE6ds6Jx9vjuLUG8gKjxyI2XFv34XMrHuyp2NTwT52HMJ+tdYHHOj03s+49yS31DsLzfGmlnr9w4e7dew8eXNp99Mg0sVUz7lUCo0c8lBdc3qrzKV9/yHDP4LUlCX6/XO0Ev0r3OLHW7xy7QcK0sBKr589ceHgXnOHBA3AFNkPwMQNwpbrbEeJKa8P2efrpuKRk0h1RzjlTTtheOQR6vxZSqIUzDx/eB2fY3bWov0G1lRC3/Lvd8kPN573oZUnJ+vtPZttdBM162Oc7Q2qBOXcdxsT9b8AVsPwLLHnXdx0/zHlcAHpP29Xs2LLn3crUYVy/nx6AF0BioIX7Pg2nUpF1VYdBHzdg3Neqk7MoYzX/LuQTa1EaP0gNvN/lY0cy3NsiylJBX27UarXVrN41BV+cLg0TvV9K+SMa7h4RaL6uqoFPUFWmSsNw/QBJ8VvDW5h5T5nZjg3V9R3hY9tHEN3fWYD3hg6fj0V2KFXUsj3ND9X3U6mLwyxYHVIqa/mQ+7W9j5Tya0cY4N5DmuvD8n2+tN4cYq0uEplp/qEUPfwUX7q48CESXZcsjMeiHfspvj5+ZNnsoWVxKx/FdIcJz+dvD7HXZgiyeHOaj8T7+ZXpmx+P1R1pbo+vHNb7U/zK+PYHl8+FkonKVr30/viB5OpbCx9qThNChIWteiz17grAj9THP66RHiiLW+P5d/EAmMXH8uPrRz9zG47MLGzfHM+nVvhBGsDqBQHf/yhiemipLCxub13Mr5RKfEcRllBT0WYlf3Fre3Hhw85h31cmKpXmwtrvx7H87pOV/PTU1tpis1L5iPktlAjCDEpl0ZYK/fM9+nk+ySf5JJ/kk4ST/wMTgC282c1X5wAAAABJRU5ErkJggg==',
              width: 150,
            },
            [
              {
                text: 'Fly Audit',
                color: '#333333',
                width: '*',
                fontSize: 28,
                bold: true,
                alignment: 'right',
                margin: [0, 0, 0, 15],
              },
              {
                stack: [
                  {
                    columns: [
                      {
                        text: 'Main Porject Name',
                        color: '#aaaaab',
                        bold: true,
                        width: '*',
                        fontSize: 12,
                        alignment: 'right',
                      },
                      {
                        text: _collection,
                        bold: true,
                        color: '#333333',
                        fontSize: 12,
                        alignment: 'right',
                        width: 100,
                      },
                    ],
                  },
                  // {
                  //   columns: [
                  //     {
                  //       text: 'Main project Index',
                  //       color: '#aaaaab',
                  //       bold: true,
                  //       width: '*',
                  //       fontSize: 12,
                  //       alignment: 'right',
                  //     },
                  //     {
                  //       text: mainProjectID,
                  //       bold: true,
                  //       color: '#333333',
                  //       fontSize: 12,
                  //       alignment: 'right',
                  //       width: 100,
                  //     },
                  //   ],
                  // },
                  {
                    columns: [
                      {
                        text: 'Main project Created Date',
                        color: '#aaaaab',
                        bold: true,
                        width: '*',
                        fontSize: 12,
                        alignment: 'right',
                      },
                      {
                        text: createdDate,
                        bold: true,
                        color: '#333333',
                        fontSize: 12,
                        alignment: 'right',
                        width: 100,
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: 'Sub Project Count',
                        color: '#aaaaab',
                        bold: true,
                        width: '*',
                        fontSize: 12,
                        alignment: 'right',
                      },
                      {
                        text: _tableData.length,
                        bold: true,
                        color: '#333333',
                        fontSize: 12,
                        alignment: 'right',
                        width: 100,
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },

        '\n\n',
        ..._tableData.map((data, index) => {
          return [
            {
              width: '100%',
              alignment: 'center',
              text: `Sub projects - ${(index + 1)}`,
              bold: true,
              margin: [0, 10, 0, 10],
              fontSize: 15,
            },
            {
              table: {
                widths: ['*', '*'],
                headerRows: 1,
                body: this.getReportInfo(data, _columns)

              }
            }


          ]
        }),


        '\n',
        '\n\n',



      ],
      styles: {
        notesTitle: {
          fontSize: 10,
          bold: true,
          margin: [0, 50, 0, 3],
        },
        notesText: {
          fontSize: 10,
        },
      },
      defaultStyle: {
        columnGap: 20,
        //font: 'Quicksand',
      },
    };
  };


  onClickDelete(row) {
    const _collection = localStorage.getItem('collection')
    this.dialogService.open(DialogNamePromptComponent, {
      context: {
        dialogObjectData: {
          titileHead: 'Are You Sure',
          titleBody: 'You wont be able to revert this!',
          buttonText: 'Delete'
        }
      }
    })
      .onClose.subscribe(name => {
        const _id = row.data._id;



        let updateData = {
          _id: row.data._id,
          _collection: _collection
        }
        // console.log(_id);
        // console.log(_collection);

        if (name == 1) {
          this.projectStatusService.deleteProject(updateData)
            .subscribe(
              result => {
                if (result)
                  this.deleteData.emit(true);
              },
              error => {
                console.log(error);
              },
              () => {

              }
            )

        }







      });


  }


  getReportInfo(data, column) {
    let _returnData = [];
    if (column) {
      column.columnsFields.forEach((col, index) => {
        let colmns = {
          text: col.columnName,
          bold: true,
          fontSize: 9
        }
        let dataObject = {

          text: (col.type == 'Date') ? moment(data[col.dbName]).format('YYYY-MM-DD') : data[col.dbName],
          bold: true,
          fontSize: 9

        };
        _returnData.push([colmns, dataObject]);

      })
    }
    return _returnData;



  }
  availbity(data) {
    const _filter = this.defaultColumns.filter(d => d.type == 'File');
    if (_filter.length > 0) {
      return true
    }
    return false
  }
  checkValidationDisplay(index, type) {

    if (this.defaultColumns.length - 1 == index && type == 'button') {
      //  this.defaultColumns.push('Action');
      return true;
    } else if (0 != index && this.defaultColumns.length - 1 != index && type == 'text') {
      if (this.fileField) {
        if (this.defaultColumns.length - 2 != index) {
          return true
        }
      } else {
        // if(this.defaultColumns.length - 2 == index){
        //   return false;
        // }
        return true
      }


    } else if (0 == index && type == 'NO') {
      return true
    } else if (this.defaultColumns.length - 2 == index && type == "file") {
      return true;
    }

    return false




  }
  onClickTableNavigate(type) {

    //  const _scroll = document.querySelectorAll(".nb-tree-grid-header-cell");

    if (type == 'right') {
      this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft + 150), behavior: 'smooth' });

      //const _scrollTo = _scroll[_scroll.length-1];
      //  _scrollTo.scrollIntoView({behavior: "smooth" ,block: "center", inline: "nearest"})
    } else {
      this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft - 150), behavior: 'smooth' });


      //const _scrollTo = _scroll[0];
      ///_scrollTo.scrollTo({ left: 150, behavior: 'smooth' })
      //  this.renderer.invokeElementMethod(this.el.nativeElement, 'focus', []);
      //      _scrollTo.focus();
    }


  }

  checkStatus(obj, column) {

    if (column == "No") {
      return 'red'
    }

  }
  displayText(text) {
    if (text.length > 10) {
      return text.substring(0, 10) + '...';
    }
    return text


  }
  displayToolTipe() {

  }

  popToolTip(row) {
    if (row) {
      return 'hint'
    }
    return 'noop'
  }
  onclickPop(row) {
    if (row) {
      this.fileUploadEmitter.emit(row);

    }
  }

  navigateFile(row) {
    this.router.navigate(['/pages/project-files', row.data._id]);
  }
  addFile(row) {

  }
}


