## Creating a reducer example

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
