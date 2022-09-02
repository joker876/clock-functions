

export class Stopwatch {
    private _total = 0;
    private _date?: number;
    private _lastStopTime?: number;
    private _active = false;
    
    public onstart = () => {};
    public onstop = () => {};
    public onreset = () => {};
    public ontime = () => {};

    /**
     * Creates a new instance of Stopwatch.
     * @param {boolean} autoStart if the stopwatch should start automatically. Default to `false`.
     */
    constructor(autoStart: boolean = false) {
        if (autoStart) this.start();
    }

    /**
     * Starts the stopwatch.
     * @param {boolean} emit whether the onstart event should be emitted. The event is not emitted if the stopwatch was already started.
     * @returns false if the stopwatch was already started, othrwise true.
     */
    public start(emit = true): boolean {
        if (this._active) return false;
        this._date = Date.now();
        this._active = true;
        if (emit) this.onstart();
        return true;
    }

    /**
     * Stops the stopwatch.
     * @param {boolean} emit whether the onstop event should be emitted. The event is not emitted if the stopwatch was already stopped or was never started.
     * @returns false if the stopwatch was already stopped, othrwise true.
     */
    public stop(emit = true): boolean {
        if (!this._date || !this._active) return false;
        const now = Date.now();
        this._lastStopTime = now - this._date;
        this._total += this._lastStopTime;
        this._active = false;
        if (emit) this.onstop();
        return true;
    }

    /**
     * Toggles the stopwatch, depending on its current state.
     * @param {boolean} emit whether the onstart or onstop events should be emitted. The event is always emitted.
     */
    public toggle(emit = true): boolean {
        if (this._active) {
            this.stop(emit);
            return false;
        }
        this.start(emit);
        return true;
    }

    /**
     * Resets the stopwatch, but keeps its current state.
     * @param {boolean} emit whether the onreset event should be emitted. The event is not emitted if the stopwatch was never started.
     * @returns true if the timer was active, false otherwise.
     */
    public reset(emit = true): boolean {
        if (!this._date) return false;
        if (emit) this.onreset();
        this._date = Date.now();
        this._total = 0;
        return this.isActive();
    }

    /**
     * Cancels the last stopwatch start, and stops the stopwatch without increasing the total time.
     * @returns false if the stopwatch wasn't active, otherwise true
     */
    public cancelStart(): boolean {
        if (!this._active) return false;
        this._active = false;
        return true;
    }

    /**
     * Cancels the last stopwatch stop, subtracts that period of time from the total time, and starts the stopwatch again.
     * @returns false if the stopwatch wasn't active, otherwise true
     */
    public cancelStop(): boolean {
        if (this._active) return false;
        this._active = true;
        this._total -= this._lastStopTime ?? 0;
        return true;
    }

    /**
     * Returns true if the stopwatch is active, false otherwise.
     */
    public isActive(): boolean {
        return this._active;
    }

    /**
     * Returns the total time the stopwatch has been active for.
     * 
     * Alias of valueOf() method. 
     */
    public time(emit = true): number { return this.valueOf(emit) }

    /**
     * Returns the total time the stopwatch has been active for.
     * 
     * Alias of time() method. 
     * 
     * Used by JavaScript when the stopwatch is converted to a primitive value.
     */
    public valueOf(emit = true): number {
        if (emit) this.ontime();
        return this._total + (this.sinceStart() ?? 0);
    }

    /**
     * Returns the time the stopwatch has been active for since the latest start.
     */
    public sinceStart(): number | null {
        if (!this._date || !this._active) return null;
        return Date.now() - this._date;
    }

    /**
     * Returns the total time the stopwatch has been active for as a string, with `ms` added at the end.
     *
     * Used by JavaScript when the stopwatch is converted to a primitive value.
     */
    public toString(): string {
        return this.time() + 'ms';
    }
}

export class Timer {
    public readonly delay!: number;
    private readonly _stopwatch!: Stopwatch;
    private _timeout: any;
    
    public onfinish = () => {};

    /**
     * Creates a new instance of Timer.
     * @param {number} delay the delay until the function will be executed.
     * @param {boolean} autoStart if the timer should start automatically. Default to `true`.
     * @param {function} callback the function to be executed after the timer finishes.
     */
    constructor(delay: number, autoStart: boolean = true, callback?: (() => void)) {
        this.delay = delay;
        
        this._stopwatch = new Stopwatch(autoStart);
        this._stopwatch.onstop = this._canceltimeout;
        this._stopwatch.onstart = () => {
            let newDelay = this.delay - this._stopwatch.time();
            this._settimeout(newDelay);
        }

        this._settimeout();
        if (callback) this.onfinish = callback;
    }

    /**
     * Starts the timer.
     * @returns false if the timer was already started, othrwise true.
     */
    public start(): boolean {
        return this._stopwatch.start();
    }

    /**
     * Stops the timer.
     * @returns false if the timer was already stopped, othrwise true.
     */
    public stop(): boolean {
        return this._stopwatch.stop();
    }

    /**
     * Toggles the timer, depending on its current state.
     */
    public toggle(): boolean {
        return this._stopwatch.toggle();
    }

    /**
     * Resets the timer, but keeps its current state.
     * @returns true if the timer was active, false otherwise.
     */
    public reset(): boolean {
        this._stopwatch.onstop();
        let resetVal = this._stopwatch.reset(false);
        this._stopwatch.onstart();
        return resetVal;
    }

    /**
     * Returns the time the timer has been active for since the latest start.
     */
    public sinceStart(): number | null {
        return this._stopwatch.sinceStart();
    }

    /**
     * Returns true if the timer is active, false otherwise.
     */
    public isActive(): boolean {
        return this._stopwatch.isActive();
    }

    /**
     * Returns the time until the function will be called.
     * 
     * Alias of valueOf() method. 
     */
    public timeRemaining(): number { return this.valueOf() }

    /**
     * Returns the time until the function will be called.
     * 
     * Alias of time() method. 
     * 
     * Used by JavaScript when the timer is converted to a primitive value.
     */
    public valueOf(): number {
        return this.delay - this._stopwatch.time(false);
    }

    /**
     * Returns a string containing the time remaining and total delay in milliseconds.
     *
     * Used by JavaScript when the timer is converted to a primitive value.
     */
    public toString(): string {
        return this.timeRemaining() + '/' + this.delay + 'ms';
    }

    /**
     * **[Private method]**. Do not use manually.
     * 
     * Starts a new timeout with the specified delay.
     * @param delay the new delay to execute the callback after.
     */
    private _settimeout(delay: number = this.delay): void {
        let globalThis = this;
        this._timeout = setTimeout(() => {
            globalThis.onfinish();
        }, delay);
    }
    /**
     * **[Private method]**. Do not use manually.
     * 
     * Stops the previous timeout.
     */
    private _canceltimeout(): void {
        clearTimeout(this._timeout);
    }
}

export default {
    SECOND: 1000,
    MINUTE: 1000 * 60,
    HOUR:   1000 * 60 * 60,
    DAY:    1000 * 60 * 60 * 24,
    WEEK:  1000 * 60 * 60 * 24 * 7,
    MONTH:  1000 * 60 * 60 * 24 * 30,
    YEAR:   1000 * 60 * 60 * 24 * 365,
}