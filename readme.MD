## Creating a command

```javascript

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

```

## Dispatch a command example

```javascript

  const store1Command: any = new Store1Command();
  store1Command.Dispatch();
  
```