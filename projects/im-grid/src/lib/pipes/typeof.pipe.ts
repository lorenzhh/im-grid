import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'typeof',
})
export class TypeofPipe implements PipeTransform {
  transform(value: any): string {
    switch (value) {
      case !value:
        return 'null';
      case Array.isArray(value):
        return 'array';
      default:
        return typeof value;
    }
  }
}
