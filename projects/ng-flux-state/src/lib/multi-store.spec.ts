import { Command, ReducerCommand, State, createSelector } from './command';
import { filter, skip } from 'rxjs/operators';
import { zip } from 'rxjs';

@State
class TodosState {
  public IsLoading = false;
  public IsBusy = false;
  public Todos: Array<any> = [];
}

@State
class TodoState {
  public Todo: {};
}

@Command(TodosState)
class SetIsLoadingCommand extends ReducerCommand<TodosState, boolean> {
  public Handle() {
    this.State.IsLoading = this.Payload;
  }
}

@Command(TodosState)
class SetTodosCommand extends ReducerCommand<TodosState, Array<any>> {
  public Handle() {
    this.State.Todos = this.Payload;
  }
}

@Command(TodoState)
class SetTodoCommand extends ReducerCommand<TodoState, {}> {
  public Handle() {
    this.State.Todo = this.Payload;
  }
}

const setTodosCommand = new SetTodosCommand();
const setIsLoadingCommand = new SetIsLoadingCommand();
const setTodoCommand = new SetTodoCommand();

describe('Multi Store Spec', () => {
  it('should distpatch todos', (done) => {
    const isLoading$ = createSelector<TodosState, boolean>(TodosState.name, x => x.IsLoading);
    const todos$ = createSelector<TodosState, any[]>(TodosState.name, x => x.Todos);
    const todo$ = createSelector<TodoState, any>(TodoState.name, x => x.Todo);

    const sub = zip(isLoading$.pipe(skip(1)), todos$.pipe(filter(x => x.length > 0)))
      .subscribe((results: Array<any>) => {

        expect(results[0]).toBe(true);
        expect(results[1]).toEqual([{ id: 1, name: 'todo 1' }, { id: 2, name: 'todo 2' }]);
        expect(results[1].length).toBe(2);

        // Dispatch a todo, simulating a user click
        setTodoCommand.Dispatch(results[1][0]);
      });

    const sub1 = todo$.pipe(skip(1)).subscribe((todo) => {
      expect(todo).toEqual({ id: 1, name: 'todo 1' });
      sub1.unsubscribe();
      sub.unsubscribe();
      done();
    });

    setIsLoadingCommand.Dispatch(true);
    setTodosCommand.Dispatch([{ id: 1, name: 'todo 1' }, { id: 2, name: 'todo 2' }]);
  });
});
