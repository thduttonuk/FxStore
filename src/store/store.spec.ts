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

@Command(Store1State)
class IsLoadingCommand extends ReducerCommand<Store1State, any> {
  public Handle() {
    this.State.IsLoading = true;
  }
}

@Command(Store1State)
class IsBusyCommand extends ReducerCommand<Store1State, any> {
  public Handle() {
    this.State.IsBusy = true;
  }
}

@Command(Store1State)
class SetValueCommand extends ReducerCommand<Store1State, string> {
  public Handle() {
    this.State.Value = this.Payload;
  }
}

test('should throw if class is not named Command', () => {
  expect(() => {
    @Command()
    class Store1 {
    }
  }).toThrow();
});

export function getStore(): IsLoadingCommand {
  return { ...store.get(Store1State.name) };
}

test('should add dispatch command name', () => {
  const store1Command = new IsLoadingCommand();
  expect((<any>store1Command).CommandName).toBe('IsLoadingCommand')
});

test('should change is loading', () => {
  const store1Command = new IsLoadingCommand();
  store1Command.Dispatch();

  expect(getStore().IsLoading).toBeTruthy();
});

test('should change is busy', () => {
  const store2Command = new IsBusyCommand();
  store2Command.Dispatch();

  expect(getStore().IsBusy).toBeTruthy();
});

test('should be immuteable', () => {
  getStore().Value = '123';

  const store2Command = new IsBusyCommand();
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

test('should use payload', () => {
  const store3Command = new SetValueCommand();
  store3Command.Dispatch('My string');

  expect(getStore().Value).toBe('My string');
});






