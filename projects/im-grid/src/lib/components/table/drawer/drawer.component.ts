import {
  Component, Input, Output, EventEmitter, ViewChild,
  ViewContainerRef, ComponentRef,
  ComponentFactoryResolver,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { DynamicComponentConfig } from '../../../models/column.model';

@Component({
  selector: 'im-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss']
})
export class ImDrawerComponent implements OnChanges {
  @Input() public componentConfig: DynamicComponentConfig;
  @Input() visible: boolean;
  @Input() title: string;
  @Output() closed = new EventEmitter<void>();
  @ViewChild('content', {
    static: true,
    read: ViewContainerRef
  }) public viewport: ViewContainerRef;
  private componentRef: ComponentRef<any> = null;
  id = -1;
  width = 1000;
  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.visible) {
      this.buildComponent();
    }
  }

  buildComponent() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }

    if (this.componentConfig) {
      this.componentRef = this.viewport.createComponent(
        this.componentFactoryResolver.resolveComponentFactory(
          this.componentConfig.componentToPort
        )
      );

      const inputs = this.componentConfig.inputs;
      for (const key in inputs) {
        if (this.componentRef) {
          this.componentRef.instance[key] = inputs[key];
        }
      }

      const outputs = this.componentConfig.outputs;
      for (const key in outputs) {
        if (this.componentRef) {
          this.componentRef.instance[key] = outputs[key];
        }
      }
    }
  }
}
