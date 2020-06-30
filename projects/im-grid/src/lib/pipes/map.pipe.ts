import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'map'
})
export class MapPipe implements PipeTransform {

    transform(array: [], property: string): any[] {
        return array.map(item => item[property]);
    }
}