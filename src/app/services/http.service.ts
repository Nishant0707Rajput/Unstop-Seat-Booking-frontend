import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(protected http: HttpClient) {}
    acceptedFileType = {
      image:['image/jpeg', 'image/jpg', 'image/png'],
      pdf:['application/pdf']
    }
    
  get(path: string, payload: any, headers?: HttpHeaders, isBlob:boolean=false ): Observable<object> {
    let params = new HttpParams();
    params = params.appendAll(payload);
    return this.http.get(`${environment.API_BASE_URL}${path}`, {
      params: params,
      ...(headers && { headers }),
      responseType : isBlob ? 'blob' as 'json' :'json'
    },);
  }
  post(path: string, payload: object,queryparams?:any): Observable<any> {
    let params = new HttpParams();
    if(queryparams){
      params = params.appendAll(queryparams)
    }
    return this.http.post(`${environment.API_BASE_URL}${path}`, payload,{...(queryparams && {params})});
  }
  put(path: string, data: any,queryparams?:any): Observable<any> {
    let params = new HttpParams();
    if(queryparams){
      params = params.appendAll(queryparams);
    }
    return this.http.put(`${environment.API_BASE_URL}${path}`, data,{...(queryparams && {params})});
  }
  delete(path:string,queryparams?:any):Observable<any> {
    let params = new HttpParams();
    params = params.appendAll(queryparams);
    return this.http.delete(`${environment.API_BASE_URL}${path}`,{...(queryparams && {params})});
  }

}
