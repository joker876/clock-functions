import { Stopwatch, Timer } from "./index";
import clockConstants from "./index";

import delay from 'delay';


describe('The constants', () => {
    it('to be correct', () => {
        expect(clockConstants.SECOND).toBe(1e3);
        expect(clockConstants.MINUTE).toBe(60e3);
        expect(clockConstants.HOUR).toBe(3.6e6);
        expect(clockConstants.DAY).toBe(86.4e6);
        expect(clockConstants.WEEK).toBe(604.8e6);
        expect(clockConstants.MONTH).toBe(2.592e9);
        expect(clockConstants.YEAR).toBe(31.536e9);
    });
});

describe('Stopwatch', () => {
    let stpwtc: Stopwatch;

    beforeEach(() => {
        stpwtc = new Stopwatch();
    });

    it('should create a new instance', () => {
        expect(stpwtc).toBeInstanceOf(Stopwatch);
    });
    it('should not be active', () => {
        expect(stpwtc.isActive()).toBeFalse();
    });
    it('should have a time of 0', () => {
        expect(stpwtc.time()).toBe(0);
    });
    it('- Stopwatch.time and Stopwatch.valueOf should return the same thing', () => {
        expect(stpwtc.time() == stpwtc.valueOf()).toBeTrue();
    });
    it('should create the correct string', () => {
        expect(stpwtc.toString()).toBe('0ms');
    });
    it('should start', () => {
        expect(stpwtc.start()).toBeTrue();
    });
    it('should not be able to stop', () => {
        expect(stpwtc.stop()).toBeFalse();
    });
    it('should not be able to start', () => {
        stpwtc.start();
        expect(stpwtc.start()).toBeFalse();
    });
    it('should stop', () => {
        stpwtc.start();
        expect(stpwtc.stop()).toBeTrue();
    });
    it('should toggle on and off', () => {
        expect(stpwtc.toggle()).toBeTrue();
        expect(stpwtc.toggle()).toBeFalse();
    });
    it('should be active after start', () => {
        stpwtc.start();
        expect(stpwtc.isActive()).toBeTrue();
    });
    it('should not be active after start & stop', () => {
        stpwtc.start();
        stpwtc.stop();
        expect(stpwtc.isActive()).toBeFalse();
    });
    it('should be active after toggle', () => {
        stpwtc.toggle();
        expect(stpwtc.isActive()).toBeTrue();
    });
    it('should not be active after double toggle', () => {
        stpwtc.toggle();
        stpwtc.toggle();
        expect(stpwtc.isActive()).toBeFalse();
    });
    it('should increase the time', async () => {
        stpwtc.start();
        await delay(100);
        stpwtc.stop();
        expect(stpwtc.time()).toBeCloseTo(100, -2);
    });
    it('should tell the correct sinceStart time', async () => {
        stpwtc.start();
        await delay(100);
        expect(stpwtc.sinceStart()).toBeCloseTo(100, -2);
    });
    it('should reset the time', async () => {
        stpwtc.start();
        await delay(100);
        stpwtc.stop();
        stpwtc.reset();
        expect(stpwtc.time()).toBe(0);
    });
    it('should cancel the start correctly', async () => {
        stpwtc.start();
        await delay(100);
        stpwtc.cancelStart();
        expect(stpwtc.isActive()).toBeFalse();
        expect(stpwtc.time()).toBe(0);
    });
    it('should cancel the stop correctly', async () => {
        stpwtc.start();
        await delay(100);
        stpwtc.stop();
        await delay(100);
        stpwtc.cancelStop();
        expect(stpwtc.isActive()).toBeTrue();
        expect(stpwtc.time()).toBeCloseTo(200, -2);
    });
});

describe('Stopwatch (events)', () => {
    let stpwtc: Stopwatch;

    let eventTestValue = false;
    function eventHandler() {
        eventTestValue = true;
    }

    beforeEach(() => {
        stpwtc = new Stopwatch();
        eventTestValue = false;
    });

    it('should have event function properties', () => {
        expect(stpwtc.onstart).toBeTruthy();
        expect(stpwtc.onstop).toBeTruthy();
        expect(stpwtc.onreset).toBeTruthy();
        expect(stpwtc.ontime).toBeTruthy();
    });
    it('should have event function properties of function types', () => {
        expect(stpwtc.onstart).toBeInstanceOf(Function);
        expect(stpwtc.onstop).toBeInstanceOf(Function);
        expect(stpwtc.onreset).toBeInstanceOf(Function);
        expect(stpwtc.ontime).toBeInstanceOf(Function);
    });
    it('should be able to assign an event handler to each event', () => {
        stpwtc.onstart = eventHandler;
        stpwtc.onstop = eventHandler;
        stpwtc.onreset = eventHandler;
        stpwtc.ontime = eventHandler;
        expect(stpwtc.onstart).toBeInstanceOf(Function);
        expect(stpwtc.onstop).toBeInstanceOf(Function);
        expect(stpwtc.onreset).toBeInstanceOf(Function);
        expect(stpwtc.ontime).toBeInstanceOf(Function);
        expect(stpwtc.onstart).toBe(eventHandler);
        expect(stpwtc.onstop).toBe(eventHandler);
        expect(stpwtc.onreset).toBe(eventHandler);
        expect(stpwtc.ontime).toBe(eventHandler);
    });
    it('should fire the onstart event', () => {
        stpwtc.onstart = eventHandler;
        stpwtc.start();
        expect(eventTestValue).toBeTrue();
    });
    it('should fire the onstop event', () => {
        stpwtc.onstop = eventHandler;
        stpwtc.start();
        stpwtc.stop();
        expect(eventTestValue).toBeTrue();
    });
    it('should fire the onreset event', () => {
        stpwtc.onreset = eventHandler;
        stpwtc.start();
        stpwtc.stop();
        stpwtc.reset();
        expect(eventTestValue).toBeTrue();
    });
    it('should fire the ontime event', () => {
        stpwtc.ontime = eventHandler;
        stpwtc.start();
        stpwtc.stop();
        stpwtc.time();
        expect(eventTestValue).toBeTrue();
    });
});

describe('Stopwatch with autostart', () => {
    let stpwtc: Stopwatch;

    beforeEach(() => {
        stpwtc = new Stopwatch(true);
    });

    it('should create a new instance', () => {
        expect(stpwtc).toBeInstanceOf(Stopwatch);
    });
    it('should be active', () => {
        expect(stpwtc.isActive()).toBeTrue();
    });
});

const TIMER_DELAY = 200;
describe('Timer', () => {
    let tmr: Timer;

    let eventTestValue = false;
    function eventHandler() {
        eventTestValue = true;
    }

    beforeEach(() => {
        tmr = new Timer(TIMER_DELAY, false);
    });

    it('should create a new instance', () => {
        expect(tmr).toBeInstanceOf(Timer);
    });
    it('should not be active', () => {
        expect(tmr.isActive()).toBeFalse();
    });
    it('should have the correct remaining time', () => {
        expect(tmr.timeRemaining()).toBe(TIMER_DELAY);
    });
    it('- Timer.timeRemaining and Timer.valueOf should return the same thing', () => {
        expect(tmr.timeRemaining() == tmr.valueOf()).toBeTrue();
    });
    it('should create the correct string', () => {
        expect(tmr.toString()).toBe(TIMER_DELAY+'/200ms');
    });
    it('should start', () => {
        expect(tmr.start()).toBeTrue();
    });
    it('should stop', () => {
        tmr.start();
        expect(tmr.stop()).toBeTrue();
    });
    it('should not be able to start', () => {
        tmr.start();
        expect(tmr.start()).toBeFalse();
    });
    it('should not be able to stop', () => {
        expect(tmr.stop()).toBeFalse();
    });
    it('should be active after toggle', () => {
        tmr.toggle();
        expect(tmr.isActive()).toBeTrue();
    });
    it('should not be active after double toggle', () => {
        tmr.toggle();
        tmr.toggle();
        expect(tmr.isActive()).toBeFalse();
    });
    it('should decrease the time', async () => {
        tmr.start();
        await delay(100);
        tmr.stop();
        expect(tmr.timeRemaining()).toBeCloseTo(TIMER_DELAY - 100, -2);
    });
    it('should tell the correct sinceStart time', async () => {
        tmr.start();
        await delay(100);
        expect(tmr.sinceStart()).toBeCloseTo(100, -2);
    });
    it('should reset the time', async () => {
        tmr.start();
        await delay(100);
        tmr.stop();
        tmr.reset();
        expect(tmr.timeRemaining()).toBe(TIMER_DELAY);
    });
    it('should have onfinish event property', () => {
        expect(tmr.onfinish).toBeTruthy();
    });
    it('should have onfinish event property of function type', () => {
        expect(tmr.onfinish).toBeInstanceOf(Function);
    });
    it('should be able to assign the onfinish event', () => {
        tmr.onfinish = eventHandler;
        expect(tmr.onfinish).toBeInstanceOf(Function);
        expect(tmr.onfinish).toBe(eventHandler);
    });
    it('should fire the onfinish event', async () => {
        tmr.onfinish = eventHandler;
        await delay(300);
        expect(eventTestValue).toBeTrue();
    });
    it('should assign the onfinish event function using the constructor', async () => {
        tmr = new Timer(TIMER_DELAY, false, eventHandler);
        expect(tmr.onfinish).toBeInstanceOf(Function);
        expect(tmr.onfinish).toBe(eventHandler);
    });
});

describe('Timer with autostart', () => {
    let tmr: Timer;

    beforeEach(() => {
        tmr = new Timer(TIMER_DELAY);
    });

    it('should create a new instance', () => {
        expect(tmr).toBeInstanceOf(Timer);
    });
    it('should be active', () => {
        expect(tmr.isActive()).toBeTrue();
    });
});