import { Store } from '.';
import { Command, ReducerCommand } from './command_metadata';

interface State {
  IsLoading: boolean;
  IsBusy: boolean;
}

const initialStore1State: State = {
  IsLoading: false,
  IsBusy: true
}

@Command(initialStore1State)
class Store1Command {
  public Handle(state: State) {
    state.IsLoading = true;
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
  console.log(store1Command)
  expect((<any>store1Command).CommandName).toBe('Store1Command')
});

test('should change state', () => {
  const store1Command: any = new Store1Command();
  store1Command.Dispatch();

  expect(initialStore1State.IsLoading).toBeTruthy();
  expect(initialStore1State.IsBusy).toBeTruthy();
});

test('should change state', () => {
  const store1Command1: any = new Store1Command();
  const store1Command2: any = new Store1Command();
  const store1Command3: any = new Store1Command();
  store1Command1.Dispatch();

  expect(initialStore1State.IsLoading).toBeTruthy();
  expect(initialStore1State.IsBusy).toBeTruthy();
});



