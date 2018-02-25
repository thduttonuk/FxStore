## Creating a command

```javascript

interface State {
  IsLoading: boolean;
  IsBusy: boolean;
}

const initialStore1State: State = {
  IsLoading: false,
  IsBusy: false
}

@Command(initialStore1State)
class Store1Command extends ReducerCommand<State> {
  public Handle() {
    this.State.IsLoading = true;
  }
}

```

## Dispatch a command example

```javascript

  const store1Command = new Store1Command();
  store1Command.Dispatch();
  
```
