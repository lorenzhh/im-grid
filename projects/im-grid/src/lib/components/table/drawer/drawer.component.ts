// tslint:disable:max-line-length
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  OnChanges,
  SimpleChanges,
  ViewContainerRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { NzResizableModule, NzResizeEvent } from 'ng-zorro-antd/resizable';
import { DynamicComponentConfig } from '../../../models/column.model';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';

@Component({
  imports: [NzDrawerModule, NzResizableModule],
  selector: 'im-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImDrawerComponent implements OnChanges {
  private cd = inject(ChangeDetectorRef);

  public readonly componentConfig = input<DynamicComponentConfig>();
  readonly visible = input<boolean>();
  readonly title = input<string>();
  readonly closed = output<void>();
  readonly viewport = viewChild('content', { read: ViewContainerRef });
  private componentRef: ComponentRef<any> = null;
  id = -1;
  width = 1000;
  ngOnChanges(changes: SimpleChanges) {
    if (changes.visible) {
      this.cd.detectChanges();
      this.buildComponent();
    }
  }

  onResize({ width }: NzResizeEvent): void {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.width = width;
    });
  }

  buildComponent() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }

    const componentConfig = this.componentConfig();
    if (componentConfig) {
      this.componentRef = this.viewport().createComponent(
        componentConfig.componentToPort
      );

      const inputs = componentConfig.inputs;
      for (const key in inputs) {
        if (this.componentRef) {
          this.componentRef.instance[key] = inputs[key];
        }
      }

      const outputs = componentConfig.outputs;
      for (const key in outputs) {
        if (this.componentRef) {
          this.componentRef.instance[key] = outputs[key];
        }
      }
    }
  }
}
