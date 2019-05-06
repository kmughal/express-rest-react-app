# Introduction

This is a simple applicaiton which is created using:

- Front end ( React )
- Back end ( Express )
- GraphQl is plugged in

Mongo db is used as data store. 

# SSL
In order to get private key 

`
  openssl req -nodes -new -x509 -keyout server.key -out server.cert
  
`

## Event loop

It is very important to understand the event loop in node js. I am going to write a fake program which and try to model an event loop.


```javascript
// node myFile.js
const pendingTimers = [];
const pendingOsOperations = [];
const pendingLongRunningOperations = [];


function shouldContinue() {
  // 1. Any pending setTimeout,setIntervals, setIntermediate
  // 2. Any pending oS tasks such as Remote resource request / network ops etc
  // 3. Any long running operations such as fs modules

  return pendingTimers.length ||
  pendingOsOperations.length ||
  pendingLongRunningOperations.length;
}

//1, Ready contents of myFile.js
// Node scan timers , intervals , os operations and long running operations and add them into their respective arrays 
myFile.readyContents();

//2. Entire body executes in one tick
while(shouldContinue()) {
 // 1. Node looks into pendingTimers and if completed then calls relevant call backs
 //2. Node looks into pendingOsTasks and pendingLongRunningTasks if completed then calls the relevant callbacks.

 //3. Node will pause, Continue when
 // a. when new pendingOSTask is done
 //b. when new pendingLongRunningTask is done
 //c. when a timer is about to complete

 //4. look for pendingTimers, call any setImmediate
 //5. handle any 'close' events. 
}


// terminal
```

```javascript 
process.env.UV_THREADPOOL_SIZE 
```
Node js tries to run code in async where it is possible but some operations are executed sync. such as all fs operations other than file watcher runs sync. above variable is an indication for libuv's threadpool to size threads 