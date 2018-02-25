import { Subject } from 'rxjs/Subject'

export class ReducerCommand<T> {
  public State: T;
  public CommandName: string;
  public Dispatch: Function;
}

export const store = new Map<string, any>();

/**
 * Pass in the state for the store
 */
export function Command(storeName: string, state: any): PropertyDecorator {
  return function (target: Function) {
    if (!target.name.endsWith('Command')) {
      throw Error('Class name must end with Command');
    } else {
      if (!store.has(storeName)) {
        store.set(storeName, { ...state });
      }

      target.prototype.State = state;
      target.prototype.CommandName = target.name;
      target.prototype.Dispatch = () => {
        target.prototype.Handle();
        state = { ...state }
      }
    }
  }
}
