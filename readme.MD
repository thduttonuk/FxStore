## Creating a command

```javascript

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

```

## Dispatch a command example

```javascript

  const store1Command = new Store1Command();
  store1Command.Dispatch();
  
```
