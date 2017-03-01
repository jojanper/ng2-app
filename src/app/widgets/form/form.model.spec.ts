import { FormModel } from './form.model';


describe('FormModel', () => {
  let data: any;
  let model: FormModel;

  beforeEach(() => {
      data = {
          item1: {
              label: 'Item1'
          },
          item2: {
              label: 'Item2'
          }
      };

      model = new FormModel(data, ['item2', 'item1']);
  });

  it('supports getInputNames', () => {
      expect(model.getInputNames()).toEqual(['item1', 'item2']);
  });

  it('supports getValidators', () => {
      expect(model.getValidators('item1')).toEqual([]);
  });

  it('supports getInputs', () => {
      const inputs = model.getInputs();
      expect(inputs.length).toEqual(2);
      expect(inputs[0].name).toEqual('item2');
      expect(inputs[0].type).toEqual('text');
      expect(inputs[0].label).toEqual(data.item2.label);
      expect(inputs[1].name).toEqual('item1');
      expect(inputs[1].type).toEqual('text');
      expect(inputs[1].label).toEqual(data.item1.label);
  });
});
