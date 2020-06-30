import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChildTableComponent } from './components/child-table/child-table.component';
import { CellComponent } from './components/table/cell/cell.component';
import { ImDrawerComponent } from './components/table/drawer/drawer.component';
import { EditFormComponent } from './components/table/edit-form/edit-form.component';
import { ImFilterCellComponent } from './components/table/filter-cell/filter-cell.component';
import { ImFooterComponent } from './components/table/footer/footer.component';
import { ImGridComponent } from './components/table/table.component';
import { ImToolbarComponent } from './components/table/toolbar/toolbar.component';
import { NgZorroAntdModule } from './modules/ng-zorro.module';
import { FilterPipe } from './pipes/filter.pipe';
import { FormatPipe } from './pipes/format.pipe';
import { MapPipe } from './pipes/map.pipe';
import { TranslatePipe } from './pipes/translate.pipe';
import { TypeofPipe } from './pipes/typeof.pipe';


@NgModule({
  declarations: [
    ImGridComponent,
    ChildTableComponent,
    ImToolbarComponent,
    ImFooterComponent,
    FormatPipe,
    FilterPipe,
    MapPipe,
    TranslatePipe,
    TypeofPipe,
    EditFormComponent,
    ImDrawerComponent,
    ImFilterCellComponent,
    CellComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    NgZorroAntdModule
  ],
  providers: [
    FilterPipe,
    FormatPipe,
    TranslatePipe,
    TypeofPipe,
    DecimalPipe,
    CurrencyPipe,
    DatePipe,
    MapPipe
  ],
  exports: [
    ImGridComponent,
    ChildTableComponent
  ]
})
export class ImGridModule {
  static forRoot(): ModuleWithProviders<ImGridModule> {
    return {
      ngModule: ImGridModule,
    };
  }
}
