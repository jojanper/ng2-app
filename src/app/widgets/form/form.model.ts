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
        this._order.forEach(ref => {
            result.push({
                ref: ref,
                type: this._types[ref].type || 'text',
                label: this._types[ref].label,
                placeholder: this._types[ref].placeholder || '',
                multiple: this._types[ref].multiple || false,
                selector: this._types[ref].selector || {}
            });
        });

        return result;
    }
}
