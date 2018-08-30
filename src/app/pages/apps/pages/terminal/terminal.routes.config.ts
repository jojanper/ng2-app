import { RouteDetails } from '../../../../models';

/**
 * Routes within chat pages.
 */
export const TERMINALROUTES: RouteDetails = {
    url: 'terminal',
    name: 'terminal-apps-view',
    menuTitle: 'Terminal',
    children: [
        {
            url: 'terminal',
            name: 'terminal.public-terminal-view',
            menuTitle: 'Terminal screen'
        }
    ]
};
