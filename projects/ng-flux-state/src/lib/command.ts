import { distinctUntilChanged } from 'rxjs/operators';
import { MemorizedSelector } from './MemorizedSelector';
import { store } from './store';
import { Type } from '@angular/core';
import { Observable } from 'rxjs';

export abstract class ReducerCommand<T, U> {
  public State: T;
  public Payload: U;
  public CommandName: string;
  public Dispatch: (payload?: U) => {};
}

const selectors = new Map<string, Array<MemorizedSelector<any>>>();

export function State<T extends { new(...args: any[]): {} }>(constructor: T) {
  if (!store.has(constructor.name)) {
    store.set(constructor.name, new constructor());
  }
}

/**
 * Decorator that indicates a command class and declares the
 * type of state it handles.
 *
 * @param stateType The type of a state class or the name of the type.
 */
export function Command(stateType: Type<any> | string) {
  return function (target: Function) {
    const storeName: string = stateType['name'] || stateType;
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

export function createSelector<T, U>(storeName: string, select: (s: T) => U): Observable<U> {
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
