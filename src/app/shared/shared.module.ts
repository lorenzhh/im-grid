import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImGridModule } from 'im-grid';
import { NgZorroAntdModule } from 'ng-zorro-antd';

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
    ],
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
        };
    }
}
