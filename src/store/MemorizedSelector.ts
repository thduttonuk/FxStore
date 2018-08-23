import { BehaviorSubject } from 'rxjs';
import { store } from './command';

export class MemorizedSelector extends BehaviorSubject<any> {
  public func: Function;
  public storeName: string;
  public run() {
    this.next(this.func(store.get(this.storeName)));
  }
}