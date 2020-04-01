import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export abstract class DataService {
  public loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) { }

  public getAll(section: string): Observable<any[]> {
    this.updateLoading(true);

    return this.http.get<any[]>(`${this.getName(section)}`)
      .pipe(finalize(() => this.updateLoading(false)));
  }

  public getOne(section: string, uniqueValue: any): Observable<any[]> {
    this.updateLoading(true);

    return this.http.get<any>(`${this.getName(section)}/${uniqueValue}`)
      .pipe(finalize(() => this.updateLoading(false)));
  }

  public post(section: any, body: any): Observable<any> {
    this.updateLoading(true);

    return this.http.post<any>(`${this.getName(section)}`, body)
      .pipe(finalize(() => this.updateLoading(false)));
  }

  public put(section: any, body: any, uniqueKey: string): Observable<any> {
    this.updateLoading(true);

    return this.http.put<any>(`${this.getName(section)}/${body[uniqueKey]}`, body)
      .pipe(finalize(() => this.updateLoading(false)));
  }

  public delete(section: string, uniqueValue: string): Observable<any> {
    this.updateLoading(true);

    return this.http.delete<any>(`${this.getName(section)}/${uniqueValue}`)
      .pipe(finalize(() => this.updateLoading(false)));
  }

  private getName(sectionName: string) {
    return sectionName.split('-').join('');
  }

  private updateLoading(value: boolean) {
    this.loadingSubject.next(value);
  }
}
