import { RouteDetails } from '../../../models';

/**
 * Routes within chat pages.
 */
export const CHATROUTES: RouteDetails = {
    url: 'chat',
    name: 'chat-apps-view',
    menuTitle: 'Chat',
    children: {
        users: {
            url: 'public',
            name: 'chat.public-chat-view',
            menuTitle: 'Public room'
        },
        video: {
            url: 'video',
            name: 'chat.public-video-view',
            menuTitle: 'Private video'
        }
    }
};
