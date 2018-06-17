import { RouteDetails } from '../../models';
import { CHATROUTES } from './chat/chat.routes.config';


export const APPSROUTES: RouteDetails = {
    url: 'apps',
    name: 'apps-view',
    menuTitle: 'Apps',
    children: {
        chat: CHATROUTES
    }
};
