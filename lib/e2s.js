const events	= require( "events" );
const stream	= require( "stream" );
const util	= require( "util" );

const ReadableStream = stream.Readable;

const E2S = function( ee, eventNames ){

	this._listeners = [ ];

	this._buffer = [ ];

	if( !(ee instanceof events.EventEmitter) ){
		throw new Error( "Event Emitter instance not passed in as first argument to constructor" );
	}else{
		this._eventEmitter = ee;
	}

	if( typeof( eventNames ) == "string" ){
		this._eventNames = [ eventNames ];
	}else if( Array.isArray( eventNames ) ){
		this._eventNames = eventNames;
	}else{
		// Invalid type that got handed in.
		throw new Error( "Constructor takes either a string or an array of strings as its second argument." );
	}

	// We are a readable stream, so let's go ahead and call
	// the constructor of the readable stream class.
	ReadableStream.call( this, { objectMode: true } );

	// Let's setup the listeners..
	const self = this;
	this._eventNames.forEach( function( eventName ){
		self._listeners[eventName] = function( comingIn ){
			self._handleIncoming( eventName, comingIn );
		};

		self._eventEmitter.on( eventName, self._listeners[eventName] );
	} );
};

util.inherits( E2S, ReadableStream );

E2S.prototype._read = function( bytes ){
	if( !this._buffer.length ){
		return;
	}

	this.push( this._buffer.splice( 0, 1 ) );
};

E2S.prototype._handleIncoming = function( eventName, data ){
	this._buffer.push( { name: eventName, data: data } );
};

E2S.prototype.die = function( cb ){
	const self = this;
	this._listeners.forEach( function( _eventName ){
		self._eventEmitter.removeListener( _eventName, self._listeners[_eventName] );
	} );

	// Let's stop the readable stream
	this.emit( "end" );
	this.emit( "close" );

	if( cb && typeof( cb ) == "function" ){
		cb();
	}
};

module.exports = E2S;
