import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  filter = <T>(array: T[], filters: object): T[] => {
    const filterKeys = Object.keys(filters);
    return array.filter((item) => {
      return filterKeys.every((key) => {
        return filters[key] === item[key];
      });
    });
  };

  transform<T>(items: T[], filters: object): T[] {
    return this.filter(items, filters);
  }
}
