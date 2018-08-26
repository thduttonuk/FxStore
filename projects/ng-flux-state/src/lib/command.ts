import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { MemorizedSelector } from './MemorizedSelector';
import { store } from './store';
import { Type } from '@angular/core';

export abstract class ReducerCommand<T, U> {
  public State: T;
  public Payload: U;
  public CommandName: string;
  public Dispatch: (payload?: U) => {};
}

const selectors = new Map<string, Array<MemorizedSelector<any>>>();

export function State(): any {
  return function (target: Function) {
    if (!store.has(target.name)) {
      store.set(target.name, { ...target.prototype.initialize() });
    }
  };
}

/**
 * Decorator that indicates a command class and declares the
 * type of state it handles.
 *
 * @param stateType The type of a state class or the name of the type.
 */
export function Command(stateType: Type<any> | string) {
  return function (target: Function) {
    const stateName: string = stateType['name'] || stateType;
    target.prototype.CommandName = target.name;
    target.prototype.Dispatch = (payload: any) => {
      target.prototype.Payload = payload;
      target.prototype.State = { ...store.get(stateName) };
      target.prototype.Handle();
      store.set(stateName, target.prototype.State);

      dispatchStateChange(stateName);
    };
  };
}

export function createSelector<T, U>(select: (s: T) => U, storeName: string) {
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
