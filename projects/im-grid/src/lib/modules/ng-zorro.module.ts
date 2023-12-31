import { NgModule } from '@angular/core';
import {
  ArrowRightOutline,
  BookOutline,
  EditFill,
  ExportOutline,
  FileExcelOutline,
  GlobalOutline,
  ImportOutline,
  LineOutline,
  MenuFoldOutline,
  MenuOutline,
  MenuUnfoldOutline,
  MoreOutline,
  PauseOutline,
  PlusCircleOutline,
  RollbackOutline,
  SaveOutline,
  StopOutline,
} from '@ant-design/icons-angular/icons';
import { NzIconModule } from 'ng-zorro-antd/icon';

const icons = [
  SaveOutline,
  RollbackOutline,
  PlusCircleOutline,
  EditFill,
  MoreOutline,
  FileExcelOutline,
  MenuFoldOutline,
  PauseOutline,
  LineOutline,
  ImportOutline,
  ExportOutline,
  BookOutline,
  StopOutline,
  MenuOutline,
  ArrowRightOutline,
  MenuUnfoldOutline,
  GlobalOutline,
];

const modules = [NzIconModule.forRoot(icons)];
@NgModule({
  imports: [modules],
  exports: [modules],
})
export class NgZorroAntdModule {}
