import { RouteDetails } from '../../../router';

/**
 * Routes within Star Wars API pages.
 */
export const CHATROUTES: RouteDetails = {
    url: 'chat',
    name: 'chat-view',
    menuTitle: 'Chat',
    children: {
        users: {
            url: 'public',
            name: 'public-chat-view',
            menuTitle: 'Public room'
        },
        video: {
            url: 'video',
            name: 'public-video-view',
            menuTitle: 'Private video'
        }
    }
};
