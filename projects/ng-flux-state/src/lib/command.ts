import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { MemorizedSelector } from './MemorizedSelector';

export class ReducerCommand<T, U> {
  public State: T;
  public Payload: U;
  public CommandName: string;
  public Dispatch: (payload?: U) => {};
}

export const store = new Map<string, any>();

const selectors = new Map<string, Array<MemorizedSelector<any>>>();

export function State(): any {
  return function (target: Function) {
    if (!store.has(target.name)) {
      store.set(target.name, { ...target.prototype.initialize() });
    }
  };
}

/**
 * Pass in the state for the store
 */
export function Command(storeName: string) {
  return function (target: Function) {
    target.prototype.CommandName = target.name;
    target.prototype.Dispatch = (payload: any) => {
      target.prototype.Payload = payload;
      target.prototype.State = { ...store.get(storeName) };
      target.prototype.Handle();
      store.set(storeName, target.prototype.State);

      dispatchStateChange(storeName);
    };
  };
}

export function createSelector<T, U>(storeName: string, select: (s: T) => U) {
  const subject = new MemorizedSelector(select(store.get(storeName)));
  subject.func = select;
  subject.storeName = storeName;

  selectors.set(storeName, [...(selectors.get(storeName) || []), subject]);

  return subject.pipe(distinctUntilChanged());
}

function dispatchStateChange(storeName: string) {
  if (selectors.has(storeName)) {
    const subjects = selectors.get(storeName);

    for (const subject of subjects) {
      subject.run();
    }
  }
}
