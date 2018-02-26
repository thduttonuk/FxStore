import { Subject } from 'rxjs/Subject'

export class ReducerCommand<T, U> {
  public State: T;
  public Payload: U;
  public CommandName: string;
  public Dispatch: (payload?: U) => {};
}

export const store = new Map<string, any>();

export function State(): PropertyDecorator {
  return function (target: Function) {
    if (!store.has(target.name)) {
      store.set(target.name, { ...target.prototype.initialize() });
    }
  }
}

/**
 * Pass in the state for the store
 */
export function Command(state: Function): PropertyDecorator {
  return function (target: Function) {
    if (!target.name.endsWith('Command')) {
      throw Error('Class name must end with Command');
    } else {
      target.prototype.CommandName = target.name;
      target.prototype.Dispatch = (payload: any) => {
        target.prototype.Payload = payload;
        target.prototype.State = { ...store.get(state.name) };
        target.prototype.Handle();
        store.set(state.name, target.prototype.State);
      }
    }
  }
}
