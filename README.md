Dispatcher (Event Handler and Dispatcher in Javascript)
====

<a name="install"></a>
## Install

**1. Development**
```html
<script type="text/javascript" src="dispatcher.js"></script>
```

**2. Production**
```html
<script type="text/javascript" src="dispatcher.min.js"></script>
```

====

<a name="basic"></a>
## Basic Usage

Basically the default javascript doesn't have a simple way on listening / handling custom events, it doesn't have a way to bind or put custom parameters for custom usage, Luckily the dispatcher class provides this functionality with custom success and fail handler for async process. Below will show on how simple it is to handle custom events using dispatcher object.

**Figure 1. Initialization**
```js
var dispatcher = Dispatcher();
```

**Figure 2. Listening to Events**
```js
dispatcher.on('test-event', function([params...], success, fail) {
    console.log('Some Test Event');
})
```

**Figure 3. Listening to Events with Success and Fail Handler**
```js
dispatcher.on('test-event', function([params...], success, fail){
    setTimeout(function() {
        // call success callback
        success(1, 2, 3);
    }, 1000);
    
    setTimeout(function() {
        // call the fail callback
        fail(1, 2, 3);
    }, 2000);
},
function([params...]) {
    // ... do some stuff
},
function([params...]) {
    // ... do some stuff
});
```

**Figure 4. Removing Event Handler**

***Remove specific handler by passing handler function:***
```js
var handler = function() {};

dispatcher.on('test', handler);

// remove the given handler based on the original
// handler function signature...
dispatcher.off('test', handler);
```

***Removing all handlers for the given event:***
```js
dispatcher.off('test');
```

>**NOTE** Passing the original handler function is required when removing specific handler from the given event, the dispatcher will look for it's matching guid from the list of event handlers given the event name.

**Figure 5. Dispatching Events**
```js
dispatcher.dispatch('test', [params...]);
```

**Figure 6. Putting it all together**
```js
var load = function() {
    console.log('Load Handler');
};

dispatcher
.on('load', load)
.on('request', function(url, success, fail) {
    var request = Request();

    request.get(url)
    .success(function(response) {
        success(response);
    })
    .fail(function(response) {
        fail(response);
    });
},
// success callback
function(response) {
    console.log('Success Response: ' + response);
},
// fail callback
function(response) {
    console.log('Fail Response: ' + response);
})
.on('event-not-useful', function() {
})
.on('event-not-useful', function() {
});

// remove event
dispatcher.off('event-not-useful');

// remove load event by handler
dispatcher.off('load', load);

// dispatch request event
dispatcher.dispatch('request', '/some-url');
```

##That's It! :)