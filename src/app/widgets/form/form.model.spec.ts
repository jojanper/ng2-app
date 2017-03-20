import { FormModel } from './form.model';


describe('FormModel', () => {
  let data: any;
  let model: FormModel;

  beforeEach(() => {
      data = {
          item1: {
              type: 'text',
              label: 'Item1'
          },
          item2: {
              type: 'text',
              label: 'Item2'
          }
      };

      model = new FormModel();
      model.addInput('item2', 'foo', data.item2);
      model.addInput('item1', 'bar', data.item1);
  });

  it('supports getInputs', () => {
      expect(model.getInputs()).toEqual(['item2', 'item1']);
  });

  it('supports getInputValidators', () => {
      expect(model.getInputValidators('item1')).toEqual([]);
  });

  it('supports getOptions', () => {
      const inputs = model.getOptions();
      expect(inputs.length).toEqual(2);
      expect(inputs[0].ref).toEqual('item2');
      expect(inputs[0].type).toEqual('text');
      expect(inputs[0].label).toEqual(data.item2.label);
      expect(inputs[1].ref).toEqual('item1');
      expect(inputs[1].type).toEqual('text');
      expect(inputs[1].label).toEqual(data.item1.label);
  });

  it('supports getInputData', () => {
      expect(model.getInputData('item1')).toEqual('bar');
      expect(model.getInputData('item2')).toEqual('foo');
  });
});
