import { Subject } from 'rxjs/Subject'

export interface ReducerCommand {
  CommandName: string;
  Dispatch: Function;
}

/**
 * Pass in the state for the store
 */
export function Command(state: any): PropertyDecorator {
  return function (target: Function) {
    if (!target.name.endsWith('Command')) {
      throw Error('Class name must end with Command');
    } else {
      target.prototype.CommandName = target.name;
      target.prototype.Dispatch = () => {
        console.log('dispatch')
        target.prototype.Handle(state);
        state = { ...state }
      }
    }
  }
}
