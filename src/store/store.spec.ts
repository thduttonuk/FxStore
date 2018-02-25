import { Command, ReducerCommand, store, State } from './command';

@State()
class Store1State {
  public IsLoading: boolean;
  public IsBusy: boolean;
  public Value: string;

  public initialize() {
    this.IsLoading = false;
    this.IsBusy = false;
    this.Value = '';
    return this;
  }
}

export function getStore(): Store1State {
  return { ...store.get(Store1State.name) };
}

@Command(Store1State)
class Store1Command extends ReducerCommand<Store1State> {
  public Handle() {
    this.State.IsLoading = true;
  }
}

@Command(Store1State)
class Store2Command extends ReducerCommand<Store1State> {
  public Handle() {
    this.State.IsBusy = true;
  }
}

test('should throw if class is not named Command', () => {
  expect(() => {
    @Command()
    class Store1 {
    }
  }).toThrow();
});

test('should add dispatch command name', () => {
  const store1Command = new Store1Command();
  expect((<any>store1Command).CommandName).toBe('Store1Command')
});

test('should change is loading', () => {
  const store1Command = new Store1Command();
  store1Command.Dispatch();

  expect(getStore().IsLoading).toBeTruthy();
});

test('should change is busy', () => {
  const store2Command = new Store2Command();
  store2Command.Dispatch();

  expect(getStore().IsBusy).toBeTruthy();
});

test('should be immuteable', () => {
  getStore().Value = '123';

  const store2Command = new Store2Command();
  store2Command.Dispatch();

  expect(getStore().Value).toBe('');
});

test('should contain store', () => {
  expect(store.size).toBe(1);
  expect(getStore()).toBeTruthy();
});

test('should not set store twice', () => {
  expect(store.size).toBe(1);
  expect(getStore()).toBeTruthy();
});






