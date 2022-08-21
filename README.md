# Clock Functions
A JavaScript/TypeScript library containing stopwatch and timer classes.

## Highlights
* Supports TypeScript!
* Supports Node and browser
* Includes full JSX documentation
* Lightweight code (14kb!)

## Installation
```
npm install clock-functions --save
```

## Usage
```js
const clockFn = require('clock-functions');
// or
import clockFn from 'clock-functions';
```

### Stopwatch
Stopwatch is a class used to measure time in milliseconds.

#### Constructor
Stopwatch constructor only has one optional parameter:

* `autoStart: boolean` - if the stopwatch should start automatically. Defaults to `false`.
```typescript
const stopwatch = new Stopwatch();
// or
const stopwatch = new Stopwatch(true); //automatically starts!
```

#### Methods
Stopwatch has the following methods:

##### `start()`
This method starts the stopwatch, if it is not already started.

If the stopwatch is already started, it does nothing.
```typescript
start(emit: boolean): boolean
```

Returns `false` if the stopwatch was already started, otherwise `true`.

If `emit` parameter is set to `true` (default), the `onstart` event will be emitted.

Example:
```typescript
let stopwatch = new Stopwatch();
stopwatch.start(); // -> true - the stopwatch has started
stopwatch.start(); // -> false - the stopwatch was already started
```

##### `stop()`
This method stops the stopwatch, if it is not already stopped.

If the stopwatch is already stopped, it does nothing.
```typescript
stop(emit: boolean): boolean
```

Returns `false` if the stopwatch was already stopped, otherwise `true`.

If `emit` parameter is set to `true` (default), the `onstop` event will be emitted.

Example:
```typescript
let stopwatch = new Stopwatch();
stopwatch.stop(); // -> false - the stopwatch was already stopped
stopwatch.start();
stopwatch.stop(); // -> true - the stopwatch has stopped
```

##### `toggle()`
This method toggles the stopwatch, depending on its current state.
```typescript
toggle(emit: boolean): boolean
```

Returns `true` if the stopwatch has been started, and `false` if it has been stopped.

If `emit` parameter is set to `true` (default), the `onstart` or `onstop` event will be emitted, depending on the action taken.

Example:
```typescript
let stopwatch = new Stopwatch();
stopwatch.toggle(); // -> true
stopwatch.toggle(); // -> false
stopwatch.toggle(); // -> true
stopwatch.stop();
stopwatch.toggle(); // -> true
```

##### `isActive()`
This method checks if the stopwatch is currently active, i.e. if it was started but wasn't recently stopped.
```typescript
isActive(): boolean
```

Example:
```typescript
let stopwatch = new Stopwatch();
stopwatch.isActive(); // -> false - the stopwatch was never started
stopwatch.start();
stopwatch.isActive(); // -> true - the stopwatch is active
```

##### `time()` and `valueOf()`
Those methods return the total time the stopwatch has been active for. They can be used interchangably.

```typescript
time(emit: boolean): number
// or
valueOf(emit: boolean): number
```

If `emit` parameter is set to `true` (default), the `ontime` event will be emitted.

Example:
```typescript
stopwatch = new Stopwatch();
stopwatch.start();
// and almost 4 seconds later...
stopwatch.time(); // -> 3914

stopwatch.stop();
// and after some more time...
stopwatch.time(); // -> 3914 - the value hasn't changed
```

##### `sinceStart()`
This method returns the time since the last time the stopwatch has been started.

If the stopwatch was never started, it returns `null`.
```typescript
sinceStart(): number | null
```

Example:
```typescript
let stopwatch = new Stopwatch();
stopwatch.start();
// and almost 4 seconds later...
stopwatch.stop();
stopwatch.time(); // -> 3914
stopwatch.start();
// some more time later...
stopwatch.time(); // -> 6102
stopwatch.sinceStart(); // -> 2188
```

##### `reset()`
This method resets the stopwatch to 0ms, and keeps its current state.

If the stopwatch was never started, it does nothing.
```typescript
reset(emit: boolean): boolean
```

Returns `false` if the stopwatch was never started, otherwise `true`.

If `emit` parameter is set to `true` (default), the `onreset` event will be emitted.

Example:
```typescript
let stopwatch = new Stopwatch();
stopwatch.start();
// and almost 4 seconds later...
stopwatch.time(); // -> 3914
stopwatch.reset();
stopwatch.time(); // -> 0
stopwatch.isActive(); // -> true
```

##### `cancelStart()`
This method cancels the last start. The stopwatch stops, and the time remains as it was on the last stop.

If the stopwatch is stopped, it does nothing.
```typescript
cancelStart(): boolean
```

Returns `false` if the stopwatch was stopped, otherwise `true`.

Example:
```typescript
let stopwatch = new Stopwatch();
stopwatch.start();
stopwatch.stop();
stopwatch.start();
stopwatch.cancelStart(); // -> true - the last start was cancelled, and the stopwatch is now inactive
stopwatch.cancelStart(); // -> false - the stopwatch was already stopped
```

##### `cancelStop()`
This method cancels the last stop. The stopwatch starts, and the duration between the last stop and current time gets added to the total.

If the stopwatch is started, it does nothing.
```typescript
cancelStop(): boolean
```

Returns `false` if the stopwatch was started, otherwise `true`.

Example:
```typescript
let stopwatch = new Stopwatch();
stopwatch.start();
stopwatch.stop();
stopwatch.cancelStop(); // -> true - the last stop was cancelled, and the stopwatch is now active
stopwatch.cancelStop(); // -> false - the stopwatch was already active
```

##### `toString()`
This method returns the same value as the `time()` method, but with `ms` string added at the end.
```typescript
toString(): string
```

Example:
```typescript
let stopwatch = new Stopwatch();
stopwatch.start();
// and almost 4 seconds later...
stopwatch.toString(); // -> "3914ms"
```

#### Properties
Stopwatch has the following public properties:

##### `onstart`
This property should be a function, and can be freely changed.

It gets called if the `onstart` event is emitted.

##### `onstop`
This property should be a function, and can be freely changed.

It gets called if the `onstop` event is emitted.

##### `onreset`
This property should be a function, and can be freely changed.

It gets called if the `onreset` event is emitted.

##### `ontime`
This property should be a function, and can be freely changed.

It gets called if the `ontime` event is emitted.

### Timer
Timer is a class used to delay the execution of a function.

#### Constructor
Timer constructor has three parameters:

* `delay: number` - the amount of time in ms until the function should be called.
* `autoStart: boolean` - if the timer should start automatically. Optional, defaults to `true`.
* `callback: Function` - the function to be called. It can also be specified by setting the object's property `onfinish`.
```typescript
const timer = new Timer(10000);
// or
const timer = new Timer(10000, false, () => console.log('Hello world!'));
// or
const timer = new Timer(10000, false);
timer.onfinish = () => console.log('Hello world!');
```

#### Methods
Timer methods are extremely similar to Stopwatch methods, but there are no events emitted in any of the functions.

##### `start()`
This method starts the timer, if it is not already started.

If the timer is already started, it does nothing.
```typescript
start(): boolean
```

Returns `false` if the timer was already started, otherwise `true`.

Example:
```typescript
let timer = new Timer(10000);
timer.start(); // -> true - the timer has started
timer.start(); // -> false - the timer was already started
```

##### `stop()`
This method stops the timer, if it is not already stopped.

If the timer is already stopped, it does nothing.
```typescript
stop(): boolean
```

Returns `false` if the timer was already stopped, otherwise `true`.

Example:
```typescript
let timer = new Timer(10000);
timer.stop(); // -> false - the timer was already stopped
timer.start();
timer.stop(); // -> true - the timer has stopped
```

##### `toggle()`
This method toggles the timer, depending on its current state.
```typescript
toggle(): boolean
```

Returns `true` if the timer has been started, and `false` if it has been stopped.

Example:
```typescript
let timer = new Timer(10000);
timer.toggle(); // -> true
timer.toggle(); // -> false
timer.toggle(); // -> true
timer.stop();
timer.toggle(); // -> true
```

##### `isActive()`
This method checks if the timer is currently active, i.e. if it was started but wasn't recently stopped.
```typescript
isActive(): boolean
```

Example:
```typescript
let timer = new Timer(10000);
timer.isActive(); // -> false - the timer was never started
timer.start();
timer.isActive(); // -> true - the timer is active
```

##### `timeRemaining()` and `valueOf()`
Those methods return the time left until the function is called. They can be used interchangably.

```typescript
time(): number
// or
valueOf(): number
```

Example:
```typescript
let timer = new Timer(10000);
// and almost 4 seconds later...
timer.timeRemaining(); // -> 6086
```

##### `sinceStart()`
This method returns the time since the last time the timer has been started.

If the stopwatch was never started, it returns `null`.
```typescript
sinceStart(): number | null
```

Example:
```typescript
let timer = new Timer(10000);
timer.start();
// and almost 4 seconds later...
timer.stop();
timer.timeRemaining(); // -> 6086
timer.start();
// some more time later...
timer.timeRemaining(); // -> 3898
timer.sinceStart(); // -> 2188
```

##### `reset()`
This method resets the timer back to full delay, and keeps its current state.

If the stopwatch was never started, it does nothing.
```typescript
reset(): boolean
```

Returns `false` if the stopwatch was never started, otherwise `true`.

Example:
```typescript
let timer = new Timer(10000);
timer.start();
// and almost 4 seconds later...
timer.timeRemaining(); // -> 6086
timer.reset();
timer.timeRemaining(); // -> 10000
timer.isActive(); // -> true
```

##### `toString()`
This method returns the time remaining out of the full delay, with `ms` string added at the end.
```typescript
toString(): string
```

Example:
```typescript
let timer = new Timer(10000);
timer.start();
// and almost 4 seconds later...
timer.toString(); // -> "6086/10000ms"
```

#### Properties
Timer, unline Stopwatch, only has two properties:

##### `onfinish`
This property should be a function, and can be freely changed.

It gets called if the timer `onstart` reaches 0 milliseconds.

##### `delay`
This property is read-only.

It stores the maximum delay in ms after which the callback function should be called.

### Constants
Clock Functions library also provides a few useful time-related constants:

* `SECOND` - equal to 1,000 milliseconds, or 1 second.
* `MINUTE` - equal to 60,000 milliseconds, or 1 minute.
* `HOUR` - equal to 3,600,1000 milliseconds, or 1 hour.
* `DAY` - equal to 86,400,000 milliseconds, or 24 hours.
* `MONTH` - equal to 2,592,000,000 milliseconds, or 30 days.
* `YEAR` - equal to 31,536,000,000 milliseconds, or 365 days.