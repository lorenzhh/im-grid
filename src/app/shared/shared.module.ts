import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
// import { TableModule } from './components/table/table.module';
import { ImGridModule } from 'im-grid';

@NgModule({
    imports: [
        ImGridModule.forRoot(),
        CommonModule,
        NgZorroAntdModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        DragDropModule
    ],
    exports: [
        CommonModule,
        NgZorroAntdModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        DragDropModule,
        ImGridModule,
        // TableModule,
    ],
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
        };
    }
}
