## Creating a command

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

export function getStore(): Store1State {
  return { ...store.get(Store1State.name) };
}

@Command(Store1State)
class Store1Command extends ReducerCommand<State> {
  public Handle() {
    this.State.IsLoading = true;
  }
}

@Command(Store1State)
class Store2Command extends ReducerCommand<State> {
  public Handle() {
    this.State.IsBusy = true;
  }
}

```

## Dispatch a command example

```javascript

  const store1Command = new Store1Command();
  store1Command.Dispatch();
  
```
