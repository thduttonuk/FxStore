import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { distinctUntilChanged } from 'rxjs/Operators'
import { skip } from 'rxjs/operators/skip';

export class MemorizedSelector extends BehaviorSubject<any> {

  public func: Function;
  public storeName: string;

  public run() {
    this.next(this.func(store.get(this.storeName)));
  }
}

export class ReducerCommand<T, U> {
  public State: T;
  public Payload: U;
  public CommandName: string;
  public Dispatch: (payload?: U) => {};
}

export const store = new Map<string, any>();

const selectors = new Map<string, Array<MemorizedSelector>>();

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

        dispatchStateChange(state.name);
      }
    }
  }
}

export function createSelector<T>(select: (s: T) => {}, storeName: string): Observable<any> {
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
