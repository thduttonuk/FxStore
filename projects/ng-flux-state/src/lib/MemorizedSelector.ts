import { BehaviorSubject } from 'rxjs';
import { store } from './store';

export class MemorizedSelector<T> extends BehaviorSubject<T> {
  public func: (x) => T;
  public storeName: string;
  public run() {
    this.next(this.func(store.get(this.storeName)));
  }
}
