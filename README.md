# event2stream

[![Travis CI](https://travis-ci.org/robertkeizer/event2stream.svg?branch=master)](https://travis-ci.org/robertkeizer/event2stream)

A module that transforms an [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) into a [ReadableStream](https://nodejs.org/api/stream.html#stream_readable_streams).

## Examples

**Example**: Sample event to stream conversion. Demonstrates the `pause()` and `resume()` functionality.
```js
const events = require( "events" );
const event2stream = require( "event2stream" );

const myEventEmitter = new events.EventEmitter( );
const eventStream = new event2stream( {
	eventEmitter: myEventEmitter,
	eventNames: [ "hey" ]
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
