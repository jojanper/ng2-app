export class ResolveUrl {
    data: Array<any>;

    constructor(data) {
        this.data = data;
    }

    getUrl(name: string): string {
        for (let item of this.data) {
            if (item.name === name) {
                return item.url;
            }
        }

        return '';
    }
};
