import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ChildTableComponent } from './components/child-table/child-table.component';
import { ImDrawerComponent } from './components/table/drawer/drawer.component';
import { EditFormComponent } from './components/table/edit-form/edit-form.component';
import { ImFilterCellComponent } from './components/table/filter-cell/filter-cell.component';
import { ImFooterComponent } from './components/table/footer/footer.component';
import { ImGridComponent } from './components/table/table.component';
import { ImToolbarComponent } from './components/table/toolbar/toolbar.component';
import { FilterPipe } from './pipes/filter.pipe';
import { FormatPipe } from './pipes/format.pipe';
import { TranslatePipe } from './pipes/translate.pipe';
import { CellComponent } from './components/table/cell/cell.component';
import { EditingCellComponent } from './components/table/editing-cell/editing-cell.component';


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
    CellComponent,
    EditingCellComponent,
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
