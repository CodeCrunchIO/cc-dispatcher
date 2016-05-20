;(function() {
    'use strict';

    var Events = function() {
        // Shorthand initialization
        if(!(this instanceof Events)) {
            // return the instance
            return new Events();
        }

        return this;
    }, e = Events.prototype;

    // Object uuid
    e.guid          = 1;
    // List of observers
    e.observers     = {};
    // Noop function
    e.noop          = function() {};

    e.on = function() {
        // get the arguments
        var args = Array.prototype.slice.apply(arguments);

        // get the event name
        var event = args.shift();
        // get the event handler
        var fn    = args.shift(); 
        // get the success handler
        var s     = args.shift();
        // get the fail handler
        var f     = args.shift();

        // check if event handler is set
        fn = typeof fn === 'function' ? fn : this.noop;

        // valid event name?
        if(!event || typeof event !== 'string') {
            return this;
        }

        // create a uid for the fn signature
        fn = createFnUid(fn);

        // get the function uuid
        var guid = fn._guid;

        // if event does not exists
        if(!(event in this.observers)) {
            // set the event
            this.observers[event] = {};
        }

        // set the event observer
        this.observers[event][guid] = {
            fn : fn,
            s  : typeof s !== 'undefined' ? s : e.noop,
            f  : typeof f !== 'undefined' ? f : e.noop
        };

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
            // does guid exists?
            if(!(fn._guid in this.observers[event])) {
                return this;
            }

            // delete the given handler
            delete this.observers[event][fn._guid];

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
        define('Events', [], function() {
            return Events;
        });
    }
    
    // expose this object globally
    if(typeof window.Events === 'undefined') {
        window.Events = Events;
    }
})();