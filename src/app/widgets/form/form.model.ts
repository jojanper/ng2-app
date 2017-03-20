export class FormModel {

    // Model input data
    private data: any;

    // Model input definition
    private types: any;

    // Model input order
    private order: Array<string>;

    constructor() {
        this.data = {};
        this.types = {};
        this.order = [];
    }

    /**
     * Add new input definition to model.
     */
    addInput(name: string, value: any, options: any): boolean {
        this.data[name] = value;
        this.types[name] = options;
        this.order.push(name);
        return true;
    }

    /**
     * Retrieve model's input names.
     */
    getInputs(): Array<string> {
        return this.order;
    }

    /**
     * Retrieve validator definition corresponding specified input name.
     */
    getInputValidators(input: string): Array<string> {
        return <Array<string>>this.types[input].validators || [];
    }

    /**
     * Retrieve validator definition corresponding specified input name.
     */
    getInputData(input: string): any {
        return this.data[input];
    }

    /**
     * Retrieve options for each model input.
     */
    getOptions(): Array<any> {
        let result = [];
        this.order.forEach(ref => {
            result.push({ref: ref, ...this.types[ref]});
        });

        return result;
    }
}
