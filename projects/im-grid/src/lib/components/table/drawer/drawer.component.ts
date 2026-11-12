// tslint:disable:max-line-length
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  computed,
  OnChanges,
  SimpleChanges,
  ViewContainerRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
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
  private directionality = inject(Directionality, { optional: true });

  public readonly componentConfig = input<DynamicComponentConfig>();
  readonly visible = input<boolean>();
  readonly title = input<string>();
  readonly closed = output<void>();
  readonly viewport = viewChild('content', { read: ViewContainerRef });
  private componentRef: ComponentRef<any> = null;
  id = -1;

  /** The drawer opens from the inline-end side; its resize handle sits on the opposite edge. */
  readonly isRtl = computed(() => this.directionality?.valueSignal() === 'rtl');

  /** Initial width: roomy, but never more than 90% of the window. */
  width = Math.min(1000, Math.round(window.innerWidth * 0.9));
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

      // setInput works for signal inputs (input()) as well as @Input() properties;
      // assigning to the instance would overwrite a signal input with a plain value
      const inputs = componentConfig.inputs ?? {};
      for (const key of Object.keys(inputs)) {
        this.componentRef.setInput(key, inputs[key]);
      }

      // forward the component's outputs (output() or @Output() EventEmitter) to the given emitters;
      // subscriptions end when the component is destroyed
      const outputs = componentConfig.outputs ?? {};
      for (const key of Object.keys(outputs)) {
        const source = this.componentRef.instance[key];
        const target = outputs[key];
        if (source && typeof source.subscribe === 'function') {
          source.subscribe((value: unknown) => target.emit(value));
        } else {
          // plain property (no output declared): hand the emitter over directly
          this.componentRef.instance[key] = target;
        }
      }
    }
  }
}
