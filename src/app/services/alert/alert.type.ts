import { AppEventMessage } from '../../services';


export type AlertMessage = AppEventMessage;


export interface AlertMessageOptions {
    timeout?: number;
}
