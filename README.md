[![Travis CI](https://travis-ci.org/robertkeizer/event2stream.svg?branch=master)](https://travis-ci.org/robertkeizer/event2stream)

# event2stream

## Overview

A module that transforms an [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) into a [ReadableStream](https://nodejs.org/api/stream.html#stream_readable_streams). Internally to the module this is accomplished by keeping a buffer in memory. Future releases will include the ability to use other forms of buffering.

The module was created to satify an easy way to test other modules that consume readable streams. Rather than requiring the use of `fs.createReadStream` or similar, this module allows for any a custom readable stream to be implemented easily.

## Examples

**Example**: Convert `log` events into a stream and connect the stream to stdout.
```js
const events = require( "events" );
const event2stream = require( "event2stream" );

const myEventEmitter = new events.EventEmitter( );
const eventStream = new event2stream( {
	eventEmitter: myEventEmitter,
	eventNames: [ "log" ]
} );

eventStream.pipe( process.stdout );

myEventEmitter.emit( "log", "This is a log message." );
myEventEmitter.emit( "log", "Another log message" );

setTimeout( function( ){
	eventStream.die();
}, 1500 );
```

**Example**: Sample event to stream conversion using an object stream. Demonstrates the `pause()` and `resume()` functionality.
```js
const events = require( "events" );
const event2stream = require( "event2stream" );

const myEventEmitter = new events.EventEmitter( );
const eventStream = new event2stream( {
	eventEmitter: myEventEmitter,
	eventNames: [ "hey" ],
	mode: "object"
} );

eventStream.pause( );

eventStream.on( "data", function( data ){
	console.log( data ); // { "eventName": "hey", "data": { "This": "is", data: 1 }

	eventStream.die( );
} );

myEventEmitter.emit( "hey", { "This": "is", data: 1 } );

setTimeout( function( ){
	eventStream.resume();
}, 1000 );
```
