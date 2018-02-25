import { Store } from '.';

test('should create', () => {
  const store = new Store<any>();

  expect(store).toBeTruthy();
});
