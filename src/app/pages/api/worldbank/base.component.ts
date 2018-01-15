import { WorldBankRestApi } from './services/wbrest.service';

export abstract class WorldBankBaseComponent {

    tableOptions = {
        ajax: (data, callback) => {
            this.ajax(data, callback);
        }
    };

    constructor(private api: WorldBankRestApi) {}

    ajax(data, callback) {
        this.api.getData(true, 'countries', data, callback);
    }
}
