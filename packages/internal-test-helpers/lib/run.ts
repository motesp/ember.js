import {
  // @ts-ignore
  next,
  run,
  _getCurrentRunLoop,
  // @ts-ignore
  _hasScheduledTimers,
} from '@ember/runloop';
import { destroy } from '@glimmer/destroyable';

import { Promise } from 'rsvp';

export function runAppend(view: any): void {
  run(view, 'appendTo', document.getElementById('qunit-fixture'));
}

export function runDestroy(toDestroy: any): void {
  if (toDestroy) {
    run(destroy, toDestroy);
  }
}

export function runTask(callback: Function): Function {
  return run(callback);
}

export function runTaskNext(): Promise<void> {
  return new Promise((resolve: Function) => {
    return next(resolve);
  });
}

// TODO: Find a better name 😎
export function runLoopSettled(event?: any): Promise<void> {
  return new Promise(function (resolve: Function) {
    // Every 5ms, poll for the async thing to have finished
    let watcher = setInterval(() => {
      // If there are scheduled timers or we are inside of a run loop, keep polling
      if (_hasScheduledTimers() || _getCurrentRunLoop()) {
        return;
      }

      // Stop polling
      clearInterval(watcher);

      // Synchronously resolve the promise
      resolve(event);
    }, 5);
  });
}
