import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectStatusService {

  private currentProjectrSubject: BehaviorSubject<any>;
  public currentProject: Observable<any>;

  public ProjectrSubject: BehaviorSubject<any>;
  public collectionName: Observable<any>;

  public CalanderProjectrSubject: BehaviorSubject<any>;
  public CalendercurrentProject: Observable<any>;



  constructor(private http: HttpClient) {

    this.currentProjectrSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('projectInfo')));
    this.currentProject = this.currentProjectrSubject.asObservable();

    this.CalanderProjectrSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('projectInfoCalen')));
    this.CalendercurrentProject = this.CalanderProjectrSubject.asObservable();



    
    this.ProjectrSubject = new BehaviorSubject<any>('collection');
    this.collectionName = this.ProjectrSubject.asObservable();
    this.ProjectrSubject.next(this.collectionName); 
    // this.ProjectrSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('collection')));
    // this.collectionName = this.ProjectrSubject.asObservable();



   }
public get calanderProject() {
  return this.CalanderProjectrSubject.value;
}
   public get projectCollection(){
    
     return this.ProjectrSubject.value;
   }
   public get projectDetails(){
    //onsole.log(this.cartItemsSubject.value)
     return this.currentProjectrSubject.value;
   }

    getprojectTableData(data):Observable<any>{
      return this.http.get(`http://localhost:3000/routes/getProjectStatus/`, {params:data});
    } 
    updateProject(data , id){
      return this.http.patch(`http://localhost:3000/routes/updateProject/${id}`,data);
    }



    addFilesUpdateproject(data) {
      return this.http.post(`http://localhost:3000/routes/addFilesUpdateproject/`,data);
    }



ProjectFileUpload(file , id):Observable<any>{
  return this.http.post(`http://localhost:3000/projectupload/${id}`, file);
}
      fileUpload(file ,id): Observable<any> {
        // var formData: any = new FormData();
        // formData.append("name", name);
        // formData.append("avatar", dataObject.profileImage);
      //  fileUpload
        return this.http.post(`http://localhost:3000/upload/${id}`, file);
        // return this.http.post(`http://localhost:3000/routes/fileUpload/${id}`, file);


      }

      errorMgmt(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // Get client-side error
          errorMessage = error.error.message;
        } else {
          // Get server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(errorMessage);
        return throwError(errorMessage);
      }


      saveProjectFile(objectData): Observable<any> {
        return this.http.post(`http://localhost:3000/routes/savePostProjectFile`, objectData);
      }

      getAllFilesData(): Observable<any> {
        return this.http.get(`http://localhost:3000/routes/getFiles`);
      }
      downloadFile(data): Observable<any>{
        
          return this.http.post('http://localhost:3000/routes/download',data ,{responseType:'blob'});
        
      }
      deletDocument(data) {
        return this.http.put(`http://localhost:3000/routes/deletDocument/`,data);
      }
      getAll(collectionName): Observable<any> {
        return this.http.get(`http://localhost:3000/routes/getAll/${collectionName}`);
      }


      deleteProject(data):Observable<any>{
        return this.http.post(`http://localhost:3000/routes/delete-project/` ,data );
      }

      saveproject(data):Observable<any>{
        return this.http.post(`http://localhost:3000/routes/saveProject`, data);
      }


      createFolder(data) :Observable<any>{
        return this.http.post(`http://localhost:3000/folder-create/dsds`, data);
      }

      getAllFolderNames():Observable<any>{
        return this.http.get(`http://localhost:3000/routes/getAllFolderNames`);
      }


      getByName(name):Observable<any>{
        return this.http.get(`http://localhost:3000/routes/getByName/${name}`);
      }


      updatecorrectiveAction(statusUpdate):Observable<any>{
        return this.http.patch(`http://localhost:3000/routes/updatecorrectiveAction` , statusUpdate);
      }


      deleteProjectFile(data) {
        return this.http.post<any>(`http://localhost:3000/routes/deleteProjectFile`,data);
      }


      //////////////////////////////
      createMainProject(mainObj):Observable<any>{
        return this.http.post(`http://localhost:3000/routes/createMainProject` , mainObj);
      }


      getByProjectName(searhText):Observable<any>{
        return this.http.get(`http://localhost:3000/routes/getByProjectName/${searhText}`);
      }


        getAllMainProject():Observable<any>{
          return this.http.get(`http://localhost:3000/routes/getAllMainProject`);
        }


        deletMainProject(id){
          console.log('dsd')
          return this.http.post<any>(`http://localhost:3000/routes/deletMainProject`,{id});
         // return this.http.delete(`http://localhost:3000/routes/deletMainProject/`+id);
        }

        getByIdMainProject(id):Observable<any>{
          return this.http.get(`http://localhost:3000/routes/getByIdMainProject/${id}`);
        }

        getByIdMainProjectUnique(id):Observable<any>{
          return this.http.get(`http://localhost:3000/routes/getByIdMainProjectUnique/${id}`);
        }

        loagSubprojectById(data) :Observable<any>{
          return this.http.get(`http://localhost:3000/routes/loagSubprojectById/`,{params:data});
        }
}
