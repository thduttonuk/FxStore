import { Subject } from 'rxjs/Subject'

export class ReducerCommand<T> {
  public State: T;
  public CommandName: string;
  public Dispatch: Function;
}

/**
 * Pass in the state for the store
 */
export function Command(state: any): PropertyDecorator {
  return function (target: Function) {
    if (!target.name.endsWith('Command')) {
      throw Error('Class name must end with Command');
    } else {
      target.prototype.State = state;
      target.prototype.CommandName = target.name;
      target.prototype.Dispatch = () => {
        target.prototype.Handle();
        state = { ...state }
      }
    }
  }
}
