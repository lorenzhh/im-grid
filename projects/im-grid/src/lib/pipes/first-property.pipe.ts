import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'firstProperty',
})
export class FirstPropertyPipe implements PipeTransform {
  public transform(value: any): any {
    return value[Object.keys(value)[0]];
  }
}
