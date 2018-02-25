import { Subject } from 'rxjs/Subject'


const store = new Subject();

const commands = [];

export interface ReducerCommand {
  CommandName: string;
  Dispatch: Function;
}

/**
 * Pass in the Store and use inject to get
 */
export function Command(state: any): PropertyDecorator {
  return function (target: Function) {
    if (!target.name.endsWith('Command')) {
      throw Error('Class name must end with Command');
    } else {
      target.prototype.CommandName = target.name;
      target.prototype.Dispatch = () => {
        target.prototype.Handle(state);
        state = { ...state }
      }
    }
  }
}
