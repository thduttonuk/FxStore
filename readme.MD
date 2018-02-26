## Creating commands and store state example

```javascript

import { Command, ReducerCommand, State } from './command';

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

```

## Dispatch a command example

```javascript

const isLoadingCommand = new IsLoadingCommand();
isLoadingCommand.Dispatch();

const setValueCommand = new SetValueCommand();
setValueCommand.Dispatch('My new value');
  
```

## Create a selector example

```javascript

const o = createSelector<Store1State>(x => x.IsLoading, Store1State.name);

```