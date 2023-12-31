import { NgModule } from '@angular/core';
import { ExportOutline, MenuFoldOutline } from '@ant-design/icons-angular/icons';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';

const icons = [MenuFoldOutline, ExportOutline];

const modules = [NzModalModule, NzIconModule.forRoot(icons)];
@NgModule({
  imports: [modules],
  exports: [modules],
})
export class NgZorroAntdModule {}
