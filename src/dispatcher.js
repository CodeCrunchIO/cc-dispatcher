;(function() {
    'use strict';

    var Dispatcher = function() {
        // Shorthand initialization
        if(!(this instanceof Dispatcher)) {
            // return the instance
            return new Dispatcher();
        }

        return this;
    }, e = Dispatcher.prototype;

    // Object uuid
    e.guid          = 1;
    // List of observers
    e.observers     = {};
    // Noop function
    e.noop          = function() {};

    e.on = function() {
        // get the arguments
        var args = Array.prototype.slice.apply(arguments);

        // priority event
        var priority = false;
        // get the event name
        var event    = args.shift();
        // get the event handler
        var fn       = args.shift(); 
        // get the success handler
        var s        = args.shift();
        // get the fail handler
        var f        = args.shift();

        // check if event handler is set
        fn = typeof fn === 'function' ? fn : this.noop;

        // valid event name?
        if(!event || typeof event !== 'string') {
            return this;
        }

        // if priority is set
        if(typeof s === 'boolean') {
            // get the priority
            priority = s;
            // set the success callback
            s        = f;
            // set the fail callback
            f        = args.shift();
        }

        // create a uid for the fn signature
        fn = createFnUid(fn);

        // get the function uuid
        var guid = fn._guid;

        // if event does not exists
        if(!(event in this.observers)) {
            // set the event
            this.observers[event] = [];
        }

        // build out the template
        var handler = {
            fn : fn,
            s  : typeof s !== 'undefined' ? s : e.noop,
            f  : typeof f !== 'undefined' ? f : e.noop
        };

        // if priority
        if(priority) {
            // push it on top
            this.observers[event].unshift(handler);

            return this;
        }

        // set the event observer
        this.observers[event].push(handler);

        return this;
    };

    e.off = function(event, fn) {
        // valid evnet name?
        if(!event || typeof event !== 'string') {
            return this;
        }

        // event exists in observers?
        if(!(event in this.observers)) {
            return this;
        }

        // is valid function signature and
        // does have guid property?
        if(typeof fn !== 'undefined'
        && typeof fn._guid !== 'undefined') {
            // get the handlers
            var handlers = getHandlers(event, fn._guid);

            // handlers not empty?
            if(handlers.length === 0) {
                return this;
            }

            // iterate on each handlers
            for(var i in handlers) {
                delete this.observers[event][i];
            }

            return this;
        }

        // delete the entire handler
        delete this.observers[event];

        return this;
    };

    e.dispatch = function() {
        // get the arguments
        var args  = Array.prototype.slice.apply(arguments);
        // get the event name
        var event = args.shift();

        // check event name validity
        if(!event || typeof event !== 'string') {
            return this;
        }

        // check if event exists
        if(!(event in this.observers)) {
            return this;
        }

        // iterate on each handlers and dispatch it!
        for(var i in this.observers[event]) {
            // get the function
            var fn = this.observers[event][i].fn;
                
            // get a copy of arguments
            var copy = [];

            // iterate on each arguments
            for(var k in args) {
                // copy it.
                copy[k] = args[k];
            }

            // set success callback
            copy.push(this.observers[event][i].s);
            // set fail callback
            copy.push(this.observers[event][i].f);

            // call it's up
            fn.apply(fn, copy);
        }

        // remove the event
        delete this.observers[event];

        return this;
    };

    var getHandlers = function(event, guid) {
        // set / list of handlers
        var handlers = [];

        // event exists in observers?
        if(!(event in e.observers)) {
            return handlers;
        }

        // valid array of handlers?
        if(toString.call(e.observers[event]) !== '[object Array]') {
            return handlers;
        }

        // iterate on each handlers
        for(var i in e.observers[event]) {
            // get the handler
            var fn = e.observers[event][i];
            // get the guid
            var id = fn.fn._guid;

            // valid guid?
            if(typeof id !== 'undefined' && id === guid) {
                handlers[i] = fn;
            }
        }

        return handlers;
    };

    var createFnUid = function(fn) {
        // if uuid is not yet set
        if(typeof fn._guid === 'undefined') {
            // define the object property
            Object.defineProperty(fn, '_guid', {
                // set the uuid value
                value       : e.guid++,
                // not enumerable
                enumerable  : false,
                // not writable
                writable    : false
            });
        }

        return fn;
    }

    // register AMD module
    if(typeof define === 'function' && define.amd) {
        define('Dispatcher', [], function() {
            return Dispatcher;
        });
    }
    
    // expose this object globally
    if(typeof window.Dispatcher === 'undefined') {
        window.Dispatcher = Dispatcher;
    }
})();