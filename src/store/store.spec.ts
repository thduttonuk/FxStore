import { Store } from '.';
import { Command, ReducerCommand } from './command_metadata';

interface State {
  IsLoading: boolean;
  IsBusy: boolean;
}

const initialStore1State: State = {
  IsLoading: false,
  IsBusy: false
}

@Command(initialStore1State)
class Store1Command {
  public Handle(state: State) {
    state.IsLoading = true;
  }
}

@Command(initialStore1State)
class Store2Command {
  public Handle(state: State) {
    state.IsBusy = true;
  }
}

test('should create', () => {
  const store = new Store<any>();
  expect(store).toBeTruthy();
});

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
  const store1Command: any = new Store1Command();
  store1Command.Dispatch();

  expect(initialStore1State.IsLoading).toBeTruthy();
});

test('should change is busy', () => {
  const store2Command: any = new Store2Command();
  store2Command.Dispatch();

  expect(initialStore1State.IsBusy).toBeTruthy();
});



