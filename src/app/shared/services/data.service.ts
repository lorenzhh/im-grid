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

  public getAll<T>(section: string): Observable<T[]> {
    this.updateLoading(true);

    return this.http.get<T[]>(`${this.getName(section)}`)
      .pipe(finalize(() => this.updateLoading(false)));
  }

  public getOne<T>(section: string, uniqueValue: string): Observable<T> {
    this.updateLoading(true);

    return this.http.get<T>(`${this.getName(section)}/${uniqueValue}`)
      .pipe(finalize(() => this.updateLoading(false)));
  }

  public post<T>(section: string, body: T): Observable<T> {
    this.updateLoading(true);

    return this.http.post<T>(`${this.getName(section)}`, body)
      .pipe(finalize(() => this.updateLoading(false)));
  }

  public put<T>(section: string, body: T, uniqueKey: string): Observable<T> {
    this.updateLoading(true);

    return this.http.put<T>(`${this.getName(section)}/${body[uniqueKey]}`, body)
      .pipe(finalize(() => this.updateLoading(false)));
  }

  public delete<T>(section: string, uniqueValue: string): Observable<T> {
    this.updateLoading(true);

    return this.http.delete<T>(`${this.getName(section)}/${uniqueValue}`)
      .pipe(finalize(() => this.updateLoading(false)));
  }

  private getName(sectionName: string) {
    return sectionName.split('-').join('');
  }

  public updateLoading(value: boolean) {
    this.loadingSubject.next(value);
  }
}
