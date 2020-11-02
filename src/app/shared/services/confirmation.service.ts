import { Injectable } from '@angular/core';
import { ModalOptions, NzModalService } from 'ng-zorro-antd/modal';
import { Observable, Subject } from 'rxjs';

export type modalType = 'confirm' | 'info' | 'success' | 'warning' | 'create' | 'error';

@Injectable({
    providedIn: 'root',
})
export class ConfirmationService {
    constructor(private modalService: NzModalService) {}

    confirm = (message: string): Observable<boolean> => {
        return this.openModal('confirm', message);
    };

    warning = (message: string): Observable<boolean> => {
        return this.openModal('warning', message);
    };

    info = (message: string): Observable<boolean> => {
        return this.openModal('info', message);
    };

    success = (message: string): Observable<boolean> => {
        return this.openModal('success', message);
    };

    create = (message: string): Observable<boolean> => {
        return this.openModal('create', message);
    };

    error = (message: string): Observable<boolean> => {
        return this.openModal('error', message);
    };

    private openModal(type: modalType, message: string) {
        const confirmed: Subject<boolean> = new Subject<boolean>();

        this.modalService[type as any]({
            ...this.options(confirmed, message),
        });

        return confirmed.asObservable();
    }

    private options(confirmed: Subject<boolean>, message: string): ModalOptions {
        return {
            nzWidth: 'fit-content',
            nzClosable: true,
            nzOkText: 'Yes',
            nzCancelText: 'Cancel',
            nzContent: message,
            nzOnOk: () => confirmed.next(true),
            nzOnCancel: () => confirmed.next(false),
        };
    }
}
