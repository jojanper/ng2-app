export class FormModel {

    constructor(private _types: any, private _order: Array<string>) {}

    getInputNames(): Array<string> {
        return <Array<string>>Object.keys(this._types);
    }

    getValidators(input: string): Array<string> {
        return <Array<string>>this._types[input].validators || [];
    }

    getInputs(): Array<any> {
        let result = [];
        this._order.forEach(name => {
            result.push({
                name: name,
                type: this._types[name].type || 'text',
                label: this._types[name].label,
                placeholder: this._types[name].placeholder || ''
            });
        });

        return result;
    }
}
