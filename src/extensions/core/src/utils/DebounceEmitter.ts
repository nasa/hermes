import { EventEmitter, Event } from "vscode";
import { LinkedList } from "./LinkedList";

class PauseableEmitter<T> {

    private _pausableSize = 0;
    private _isPaused = 0;
    protected _eventQueue = new LinkedList<T>();
    private _mergeFn?: (input: T[]) => T;

    private parentEmitter: EventEmitter<T>;

    public get isPaused(): boolean {
        return this._isPaused !== 0;
    }

    event: Event<T>;

    constructor(options?: { merge?: (input: T[]) => T }) {
        this._mergeFn = options?.merge;
        this.parentEmitter = new EventEmitter();
        this.event = (...args) => {
            this._pausableSize++;
            const disp = this.parentEmitter.event(...args);
            return {
                dispose: () => {
                    this._pausableSize--;
                    disp.dispose();
                }
            };
        };
    }

    pause(): void {
        this._isPaused++;
    }

    resume(): void {
        if (this._isPaused !== 0 && --this._isPaused === 0) {
            if (this._mergeFn) {
                // use the merge function to create a single composite
                // event. make a copy in case firing pauses this emitter
                if (this._eventQueue.size > 0) {
                    const events = Array.from(this._eventQueue);
                    this._eventQueue.clear();
                    this.parentEmitter.fire(this._mergeFn(events));
                }

            } else {
                // no merging, fire each event individually and test
                // that this emitter isn't paused halfway through
                while (!this._isPaused && this._eventQueue.size !== 0) {
                    this.parentEmitter.fire(this._eventQueue.shift()!);
                }
            }
        }
    }

    fire(event: T): void {
        if (this._pausableSize) {
            if (this._isPaused !== 0) {
                this._eventQueue.push(event);
            } else {
                this.parentEmitter.fire(event);
            }
        }
    }

    dispose() {
        this.parentEmitter.dispose();
    }
}

export class DebounceEmitter<T> extends PauseableEmitter<T> {

    private readonly _delay: number;
    private _handle: any | undefined;

    constructor(options: { merge: (input: T[]) => T; delay?: number }) {
        super(options);
        this._delay = options.delay ?? 100;
    }

    override fire(event: T): void {
        if (!this._handle) {
            this.pause();
            this._handle = setTimeout(() => {
                this._handle = undefined;
                this.resume();
            }, this._delay);
        }
        super.fire(event);
    }

    dispose(): void {
        clearTimeout(this._handle);
        super.dispose();
    }
}