import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ActionType} from '../../../../models/action-type.enum';
import {convertToCesiumObj} from '../dataCovertor/convertToCesiumObject';

@Injectable()
export class TracksDataProvider {
    private _socket;

    constructor() {
        // this._socket = webSocketSupplier.get();
    }

    get() {
        // return Observable.create((observer) => {
        //     this._socket.on('birds', (data) => {
        //         data.forEach(
        //             (acNotification) => {
        //                 let action;
        //                 if (acNotification.action === 'ADD_OR_UPDATE') {
        //                     action = ActionType.ADD_UPDATE;
        //                 }
        //                 else if (acNotification.action === 'DELETE') {
        //                     action = ActionType.DELETE;
        //                 }
        //                 acNotification.actionType = action;
        //                 acNotification.entity = convertToCesiumObj(acNotification.entity);
        //                 observer.next(acNotification);
        //             });
        //     });
        // });
    }
}
