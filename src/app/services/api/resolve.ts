import { urlParser, urlMapper } from '../../utils';


export declare type ResolveCache = {
    [key: string]: string;
};

export interface BackendUrlData {
    url: string;
    data?: any
}

export class CacheData {
    private cache: ResolveCache;

    constructor() {
        this.clear();
    }

    getData(key: string): string {
        return this.cache[key];
    }

    setData(key: string, data: string): void {
        this.cache[key] = data;
    }

    clear(): void {
        this.cache = {};
    }
}

export class ResolveUrl {
    data: Array<any>;
    resolver: Array<any>;

    constructor(data: Array<any>, private cache: CacheData) {
        this.data = data;

        this.resolver = this.data.map((item) => {
            return urlParser(item.url);
        });
    }

    getUrl(name: string, data?: any): BackendUrlData {
        const response: BackendUrlData = {
            url: this.cache.getData(name),
            data
        };

        if (response.url) {
            return response;
        }

        let index = 0;
        for (let item of this.data) {
            if (item.name === name) {
                // Check if resolved URL can be fetched from cache.
                // Fetching should not be done when backend URL depends on input parameters
                if (this.cache && !Object.keys(this.resolver[index]).length) {
                    this.cache.setData(name, item.url);
                }

                // Resolve the URL using specified input data, if any
                const resolveMap = this.resolver[index];
                response.url = urlMapper(item.url, resolveMap, data);

                // Remove the input data fields that were used for resolving the URL
                response.data = Object.assign({}, data);
                Object.keys(resolveMap).forEach((key) => {
                    delete response.data[resolveMap[key]];
                });

                return response;
            }

            index++;
        }

        return response;
    }
};
