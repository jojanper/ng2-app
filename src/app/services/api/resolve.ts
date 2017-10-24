export declare type ResolveCache = {
    [key: string]: string;
};

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

    constructor(data: Array<any>, private cache: CacheData) {
        this.data = data;
    }

    getUrl(name: string): string {
        const data = this.cache.getData(name);
        if (data) {
            return data;
        }

        for (let item of this.data) {
            if (item.name === name) {
                if (this.cache) {
                    this.cache.setData(name, item.url);
                }

                return item.url;
            }
        }

        return '';
    }
};
