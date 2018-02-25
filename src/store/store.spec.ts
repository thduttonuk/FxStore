import { Command, ReducerCommand, store } from './command';

interface State {
  IsLoading: boolean;
  IsBusy: boolean;
  Value: string
}

const initialStore1State: State = {
  IsLoading: false,
  IsBusy: false,
  Value: ''
}

@Command('store1', initialStore1State)
class Store1Command extends ReducerCommand<State> {
  public Handle() {
    this.State.IsLoading = true;
  }
}

@Command('store1', initialStore1State)
class Store2Command extends ReducerCommand<State> {
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

  expect(initialStore1State.IsLoading).toBeTruthy();
});

test('should change is busy', () => {
  const store2Command = new Store2Command();
  store2Command.Dispatch();

  expect(initialStore1State.IsBusy).toBeTruthy();
});

test('should be immuteable', () => {
  initialStore1State.Value = '123';

  const store2Command = new Store2Command();
  store2Command.Dispatch();

  expect(store.get('store1').Value).toBe('');
});

test('should contain store', () => {
  expect(store.size).toBe(1);
  expect(store.get('store1')).toBeTruthy();
});

test('should not set store twice', () => {
  expect(store.size).toBe(1);
  expect(store.get('store1')).toBeTruthy();
});






