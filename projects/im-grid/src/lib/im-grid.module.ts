import { NgModule, ModuleWithProviders } from '@angular/core';
import { FilterPipe } from './pipes/filter.pipe';
import { FormatPipe } from './pipes/format.pipe';
import { TranslatePipe } from './pipes/translate.pipe';
import { DecimalPipe, CurrencyPipe, CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ImGridComponent } from './components/table/table.component';
import { ImToolbarComponent } from './components/table/toolbar/toolbar.component';
import { ImFooterComponent } from './components/table/footer/footer.component';
import { EditFormComponent } from './components/table/edit-form/edit-form.component';
import { ImDrawerComponent } from './components/table/drawer/drawer.component';
import { ImFilterCellComponent } from './components/table/filter-cell/filter-cell.component';
import { ChildTableComponent } from './components/child-table/child-table.component';


@NgModule({
  declarations: [
    ImGridComponent,
    ChildTableComponent,
    ImToolbarComponent,
    ImFooterComponent,
    FormatPipe,
    FilterPipe,
    TranslatePipe,
    EditFormComponent,
    ImDrawerComponent,
    ImFilterCellComponent,
    FilterPipe,
    FormatPipe,
    TranslatePipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    DragDropModule,
  ],
  providers: [
    FilterPipe,
    FormatPipe,
    TranslatePipe,
    DecimalPipe,
    CurrencyPipe,
    DatePipe,
  ],
  exports: [
    ImGridComponent,
    ChildTableComponent
  ]
})
export class ImGridModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ImGridModule,
    };
  }
}
