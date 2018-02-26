## Creating commands and store state

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

  const store1Command = new IsLoadingCommand();
  store1Command.Dispatch();

  const store1Command = new SetValueCommand();
  store1Command.Dispatch('My new value');
  
```
