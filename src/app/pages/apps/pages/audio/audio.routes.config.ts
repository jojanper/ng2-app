import { RouteDetails } from '../../../../models';

/**
 * Routes within audio pages.
 */
export const AUDIOROUTES: RouteDetails = {
    url: 'audio',
    name: 'audio-apps-view',
    menuTitle: 'Audio',
    children: [
        {
            url: 'player',
            name: 'audio.public-player-view',
            menuTitle: 'Player'
        },
        {
            url: 'events',
            name: 'audio.public-audio-view',
            menuTitle: 'Events'
        }
    ]
};
