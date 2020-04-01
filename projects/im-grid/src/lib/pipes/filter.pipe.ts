import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  filter = (array: any[], filters: object): any[] => {
    const filterKeys = Object.keys(filters);
    return array.filter(item => {
      return filterKeys.every(key => {
        return filters[key] === item[key];
      });
    });
  }

  transform(items: any[], filters: object): any[] {
    return this.filter(items, filters);
  }
}
