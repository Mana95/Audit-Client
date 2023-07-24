import { ProjectStatusService } from "app/@core/mock/project-status.service";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { CalendarOptions } from "@fullcalendar/angular"; // useful for typechecking
import * as moment from "moment";
import { Router } from "@angular/router";
@Component({
  selector: "project-calander",
  templateUrl: "./project-calendar.coponent.html",
  styleUrls: ["./project-calendar.coponent.scss"],
})
export class CalendarProjectComponent implements OnInit {
  @Output() outPutEditDataCalender = new EventEmitter();
  calendarOptions: CalendarOptions;
  //   calenderHeader:string;
  constructor(private projectStatusService: ProjectStatusService,
    private router: Router) {
    this.loadAllData();
  }

  
  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends; // toggle the boolean!
  }

  ngOnInit() {}

  get calenderHeader() {
    const _collectionName = localStorage.getItem("collection");
    // const _index = localStorage.getItem('mainProjectID');
    // if(_index == undefined){
    //     return _collectionName
    // }
    return `${_collectionName}`;
  }
  loadAllData() {
    var compltedArray = [];
    const _collectionName = localStorage.getItem("collection");
    this.projectStatusService.getAll(_collectionName).subscribe((response) => {
      var result = response;
      var _currentDate = new Date();
      
        if(result && result.length > 0){
          result.forEach((sub , sIndex)=>{
            if(sub){
              const _filterCompleted = sub.objectArray.filter((x) => x.status == "1");
              if (_filterCompleted){
                _filterCompleted.forEach((pr, i) => {
                  const _tableColumnFields = sub.columns[0].columnsFields;
                 // const _findStartDate = this._tableColumnFields
                  for (const property of _tableColumnFields) {
                    
                      if(property.type == 'Date' && property.dbName != 'startDate'){
                        var deadline = new Date(pr[property.dbName]);
                        var _deadlineNumber = Number(property.deadlineNumber);
                        var _setDate = deadline.setDate(deadline.getDate() - _deadlineNumber);
                        var startDate = new Date(pr.startDate);
                        if(startDate > new Date(pr[property.dbName])){
                          let eventObject = {
                            title: `${sub.mainProject}  ${moment(pr[property.dbName]).format(
                              "YYYY-MM-DD"
                            )} `,
                            id: pr._id,
                            groupId :sub.mainProject,
                            // start: moment(pr.startDate).format('YYYY-MM-DD'),
                            date: moment(pr[property.dbName]).format("YYYY-MM-DD"),
                            color: "red",
                          };
                          compltedArray.push(eventObject);
                        }else if(new Date(_setDate) <= _currentDate){
                          let eventObject = {
                            title: `${sub.mainProject} ${moment(pr[property.dbName]).format(
                              "YYYY-MM-DD"
                            )} `,
                            id: pr._id,
                            groupId :sub.mainProject,
                            // start: moment(pr.startDate).format('YYYY-MM-DD'),
                            date: moment(pr[property.dbName]).format("YYYY-MM-DD"),
                            color: "gold", 
                          };
                          compltedArray.push(eventObject);
                        }else {
                          let eventObject = {
                            title: `${sub.mainProject} ${moment(pr[property.dbName]).format(
                              "YYYY-MM-DD"
                            )}`,
                            id: pr._id,
                          groupId :sub.mainProject,
                            // start: moment(pr.startDate).format('YYYY-MM-DD'),
                            date: moment(pr[property.dbName]).format("YYYY-MM-DD"),
                            color: "green",
                          };
                          compltedArray.push(eventObject);
                        }

                      }

                  }  
                });
              }
                var _findOngoing = sub.objectArray.filter((x) => x.status == "2");
                if (_findOngoing) {
                  _findOngoing.forEach((p, pI) => {
                    const _tableColumnFields = sub.columns[0].columnsFields;
                    for (const property of _tableColumnFields){
                  
                      if(property.type == 'Date' && property.columnName != 'startDate'){
                        let eventObject = {
                          title: `${sub.mainProject} ${moment(p[property.dbName]).format("YYYY-MM-DD")}`,
                          id: p._id,
                          groupId :sub.mainProject,
                          // start: moment(p.startDate).format('YYYY-MM-DD'),
                          date: moment(p[property.dbName]).format("YYYY-MM-DD"),
                          color: "info",
                        };
                        compltedArray.push(eventObject);
                      }
                    } 
                  });
                }
              }
            }
          )
        }



      // var _filterCompleted = result.filter((x) => x.status == "1");
      // if (_filterCompleted) {
     
      // }
      
     
     

      var subCalendarOptions = {
        initialView: "dayGridMonth",
        dateClick: this.handleDateClick.bind(this), // bind is important!
        events: compltedArray,
        eventClick:this.handleDateClick.bind(this),
        eventRender:this.handleDateClick.bind(this),
      };
      this.calendarOptions = subCalendarOptions;
      /////////////////
      // this.calendarOptions.events = array
    });
  }

  handleDateClick(arg ,jsEvent) { 
    console.log(jsEvent)
    if(arg.event){
    var value = arg.event.id;
    var projectName = arg.event.groupId;
 if(value){
  this.projectStatusService.getByProjectName(projectName)
  .subscribe(res=>{
    // console.log(res)
    const tableColumns = res._returnArray[0].field.columnsFields;
    var _ProjectArray = new Array(tableColumns);
    localStorage.setItem('projectInfoCalen', JSON.stringify(_ProjectArray));
    localStorage.setItem('calenderClick','true');
    localStorage.setItem('calenderName',projectName);
    let _emitData = {
      projectName:projectName,
      id:value,
      title:arg.event.title
    }
    this.outPutEditDataCalender.emit(_emitData);

  })


 }
}
}




eventhover(event){
    console.log(event);
  }
}


//        setTimeout(() => {
       
//         $("#calendar").fullCalendar({  
//                         header: {
//                             left   : 'prev,next today',
//                             center : 'title',
//                             right  : 'month,agendaWeek,agendaDay'
//                         },
//                         navLinks   : true,
//                         editable   : true,
//                         eventLimit : true,
//                         eventRender: function(event, element, view) {
//                           element.find('span.fc-title').attr('data-toggle', 'tooltip');  
//                           element.find('span.fc-title').attr('title', event.title);   
//                        },
//                         events: [
//                           {
//                             title: 'All Day Event',
//                             description: 'description for All Day Event',
//                             start: '2019-12-01'
//                           },
//                           {
//                             title: 'Long Event',
//                             description: 'description for Long Event',
//                             start: '2019-12-07',
//                             end: '2019-12-10'
//                           },
//                           {
//                             groupId: '999',
//                             title: 'Repeating Event',
//                             description: 'description for Repeating Event',
//                             start: '2019-12-09T16:00:00'
//                           },
//                           {
//                             groupId: '999',
//                             title: 'Repeating Event',
//                             description: 'description for Repeating Event',
//                             start: '2019-12-16T16:00:00'
//                           },
//                           {
//                             title: 'Conference',
//                             description: 'description for Conference',
//                             start: '2019-12-11',
//                             end: '2019-12-13'
//                           },
//                           {
//                             title: 'Meeting',
//                             description: 'description for Meeting',
//                             start: '2019-12-12T10:30:00',
//                             end: '2019-12-12T12:30:00'
//                           },
//                           {
//                             title: 'Lunch',
//                             description: 'description for Lunch',
//                             start: '2019-12-12T12:00:00'
//                           },
//                           {
//                             title: 'Meeting',
//                             description: 'description for Meeting',
//                             start: '2019-12-12T14:30:00'
//                           },
//                           {
//                             title: 'Birthday Party',
//                             description: 'description for Birthday Party',
//                             start: '2019-12-13T07:00:00'
//                           },
//                           {
//                             title: 'Click for Google',
//                             description: 'description for Click for Google',
//                             url: 'http://google.com/',
//                             start: '2019-12-28'
//                           }
//                         ]  // request to load current events
//                     }).on('click', '.fc-agendaWeek-button, .fc-month-button, .fc-agendaDay-button, .fc-prev-button, .fc-next-button', function() {
//    $('[data-toggle="tooltip"]').tooltip();
// });
//                     $('[data-toggle="tooltip"]').tooltip();
//      }, 100);
