import { environment } from '@common/environment';
import { EnvironmentSchema } from '@common/schemas';

describe('Common', () => {
  test('Should have base environment objects', () => {
    expect(environment).toBeDefined();
    expect(EnvironmentSchema).toBeDefined();
  });
});
