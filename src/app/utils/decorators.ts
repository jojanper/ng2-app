/**
 * Utility decorator for unsubscribing from observable(s). The key idea is that takeUntil() is used
 * when subscribing to an observable. The input to takeUntil() is another observable and values are
 * returned from the source observable sequence until the other observable sequence produces a value.
 * Typical usage would be as follows:
 *
 * @AutoUnsubscribe(['unsubscribe'])
 * export class CoolComponent implements OnDestroy {
 *   unsubscribe: Subject<void> = new Subject();
 *
 *   constructor() {
 *     const observable = <Observable>;
 *     observable.pipe(takeUntil(unsubscribe)).subscribe(...);
 *   }
 *
 *   ngDestroy() {}
 *
 *   ...
 * }
 *
 * When Angular calls ngOnDestroy() method, the other observable produces value and source observable
 * terminates.
 *
 * For more information regarding the unsubscription flow see:
 * https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription
 *
 * @param subjects
 */
export function AutoUnsubscribe(subjects = []) {
    return function (constructor) {
        const original = constructor.prototype.ngOnDestroy;

        constructor.prototype.ngOnDestroy = function () {
            subjects.forEach((subject) => {
                this[subject].next();
                this[subject].complete();
            });

            if (original && typeof original === 'function') {
                original.apply(this, arguments);
            }
        };
    }
}
