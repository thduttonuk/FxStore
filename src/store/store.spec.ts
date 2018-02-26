import { Command, ReducerCommand, store, State, createSelector } from './command';
import { take, bufferTime } from 'rxjs/operators'

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

export function getStore(): Store1State {
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

test('should emit an update', (done) => {
  const o = createSelector<Store1State>(x => x.Value, Store1State.name);
  o.subscribe((value) => {
    expect(value).toBe('My new string 123');
    done();
  })

  const store3Command = new SetValueCommand();
  store3Command.Dispatch('My new string 123');
});

test('should emit if two updates', (done) => {
  const o = createSelector<Store1State>(x => x.Value, Store1State.name);
  o.pipe(bufferTime(100)).subscribe((values) => {
    expect(values[0]).toBe('My new string 123');
    expect(values[1]).toBe('My new string 1234');
    done();
  })

  const store3Command = new SetValueCommand();
  store3Command.Dispatch('My new string 123');
  store3Command.Dispatch('My new string 1234');
});

xtest('should not emit if three updates if values are the same', (done) => {
  const o = createSelector<Store1State>(x => x.Value, Store1State.name);
  o.pipe(bufferTime(100)).subscribe((values) => {
    expect(values[0]).toBe('My new string 123');
    expect(values[1]).toBe('My new string 1234');
    expect(values.length).toBe(2);
    done();
  })

  const store3Command = new SetValueCommand();
  store3Command.Dispatch('My new string 123');
  store3Command.Dispatch('My new string 123');
  store3Command.Dispatch('My new string 1234');
});






