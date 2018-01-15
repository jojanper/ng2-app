import { Injectable } from '@angular/core';

import { NetworkService, ConnectionOptions } from '../../../../services';


const baseUrl = 'https://api.worldbank.org/v2/';

@Injectable()
export class WorldBankRestApi {

    private connectionOptions: ConnectionOptions;

    constructor(private network: NetworkService) {
        this.connectionOptions = new ConnectionOptions();
        this.connectionOptions.cors = true;
    }

    getData(paging: boolean, apiTarget: string, requestData: any, callback: Function) {
        const params = {};

        if (paging) {
            params['page'] = Math.floor(requestData.start / requestData.length) + 1;
            params['per_page'] = requestData.length;
        }

        this.connectionOptions.params = Object.assign({}, params, {format: 'json'});

        const url = `${baseUrl}${apiTarget}`;
        this.network.get(url, this.connectionOptions).subscribe((response) => {
            const dtData = {
                data: response[1]
            };

            if (paging) {
                dtData['draw'] = requestData.draw;
                dtData['recordsTotal'] = response[0].total;
                dtData['recordsFiltered'] = response[0].total;
            }

            callback(dtData);
        });
    }
}
