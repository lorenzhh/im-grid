// tslint:disable:max-line-length
import {
    ChangeDetectionStrategy,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import { DynamicComponentConfig } from '../../../models/column.model';

@Component({
    selector: 'im-drawer',
    templateUrl: './drawer.component.html',
    styleUrls: ['./drawer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImDrawerComponent implements OnChanges {
    @Input() public componentConfig: DynamicComponentConfig;
    @Input() visible: boolean;
    @Input() title: string;
    @Output() closed = new EventEmitter<void>();
    @ViewChild('content', {
        read: ViewContainerRef,
    })
    public viewport: ViewContainerRef;
    private componentRef: ComponentRef<any> = null;
    id = -1;
    width = 1000;
    constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.visible) {
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
