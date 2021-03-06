import { Command, ReducerCommand, State, createSelector } from './command';
import { bufferTime, skip, first } from 'rxjs/operators';
import { store } from './store';

@State
class Store1State {
  public IsLoading = false;
  public IsBusy = false;
  public Value = '';
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

describe('Store Spec', () => {

  function getStore(): Store1State {
    return { ...store.get(Store1State.name) };
  }

  it('should add dispatch command name', () => {
    const store1Command = new IsLoadingCommand();
    expect((<any>store1Command).CommandName).toBe('IsLoadingCommand');
  });

  it('should change is loading', () => {
    const store1Command = new IsLoadingCommand();
    store1Command.Dispatch();

    expect(getStore().IsLoading).toBeTruthy();
  });

  it('should change is busy', () => {
    const store2Command = new IsBusyCommand();
    store2Command.Dispatch();

    expect(getStore().IsBusy).toBeTruthy();
  });

  it('should be immuteable', () => {
    getStore().Value = '123';

    const store2Command = new IsBusyCommand();
    store2Command.Dispatch();

    expect(getStore().Value).toBe('');
  });

  it('should be immuteable', (done) => {
    const value$ = createSelector<Store1State, string>(Store1State.name, x => x.Value);
    const sub = value$.pipe(skip(1)).subscribe((v1) => {
      expect(v1).toBe('My new string 123');
      sub.unsubscribe();
      v1 = 'test 123';

      value$.pipe(first()).subscribe((v2) => {
        expect(v2).toBe('My new string 123');
        done();
      });
    });

    const store3Command = new SetValueCommand();
    store3Command.Dispatch('My new string 123');
  });


  it('should use payload', () => {
    const store3Command = new SetValueCommand();
    store3Command.Dispatch('My string');

    expect(getStore().Value).toBe('My string');
  });

  it('should emit an update', (done) => {
    const value$ = createSelector<Store1State, string>(Store1State.name, x => x.Value);
    const sub = value$.pipe(skip(1)).subscribe((value) => {
      expect(value).toBe('My new string 123');
      sub.unsubscribe();
      done();
    });

    const store3Command = new SetValueCommand();
    store3Command.Dispatch('My new string 123');
  });

  it('should emit if two updates', (done) => {
    const value$ = createSelector<Store1State, string>(Store1State.name, x => x.Value);
    const sub = value$.pipe(bufferTime(0)).subscribe((values) => {
      expect(values[0]).toBe('My new string 123');
      expect(values[1]).toBe('My new string 1234');
      sub.unsubscribe();
      done();
    });

    const store3Command = new SetValueCommand();
    store3Command.Dispatch('My new string 123');
    store3Command.Dispatch('My new string 1234');
  });

  it('should not emit three updates if values are the same', (done) => {
    const value$ = createSelector<Store1State, string>(Store1State.name, x => x.Value);
    const sub = value$.pipe(skip(1), bufferTime(0)).subscribe((values) => {
      expect(values[0]).toBe('My new string 123');
      expect(values[1]).toBe('My new string 1234');
      expect(values.length).toBe(2);
      sub.unsubscribe();
      done();
    });

    const store3Command = new SetValueCommand();
    store3Command.Dispatch('My new string 123');
    store3Command.Dispatch('My new string 123');
    store3Command.Dispatch('My new string 1234');
  });

  it('should emit two updates if commands are not the same', (done) => {
    const value$ = createSelector<Store1State, string>(Store1State.name, x => x.Value);
    const sub = value$.pipe(skip(1), bufferTime(0)).subscribe((values) => {
      expect(values[0]).toBe('My new string 123');
      expect(values[1]).toBe('My new string 1234');
      expect(values.length).toBe(2);
      sub.unsubscribe();
      done();
    });

    const store3Command = new SetValueCommand();
    store3Command.Dispatch('My new string 123');
    store3Command.Dispatch('My new string 1234');

    const store2Command = new IsBusyCommand();
    store2Command.Dispatch();
  });

  it('should call 1000 times', (done) => {
    const value$ = createSelector<Store1State, string>(Store1State.name, x => x.Value);
    const sub = value$.pipe(skip(1), bufferTime(0)).subscribe((values) => {
      expect(values.length).toBe(1000);
      sub.unsubscribe();
      done();
    });

    const store3Command = new SetValueCommand();
    for (let i = 0; i < 1000; i++) {
      store3Command.Dispatch(`n ${i}`);
    }
  });
});







