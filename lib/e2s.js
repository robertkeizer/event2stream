const events	= require( "events" );
const stream	= require( "stream" );
const util	= require( "util" );
const Joi	= require( "joi" );

const ReadableStream = stream.Readable;

const E2S = function( config ){

	this._listeners = [ ];
	this._buffer	= [ ];
	
	ReadableStream.call( this, {
		objectMode: config.mode == "object" ? true : false
	} );

	const self = this;
	this._validateConfig( config, function( err, validConfig ){
		if( err ){
			throw new Error( "Invalid config specified" );
		}

		self._config		= validConfig;
		self._eventEmitter	= self._config.eventEmitter;

		self._setupEventListeners( );
		
	} );
};

E2S.prototype._validateConfig = function( config, cb){
	return Joi.validate( config, Joi.object( ).keys( {
		eventEmitter: Joi.any( ).required(),
		eventNames: Joi.array( ).items(
			Joi.string( )
		).unique( ).min(1).required( ),
		mode: Joi.string( ).valid( [ "object", "buffer", "string" ] ).default( "string" )
	} ), function( err, result ){
		if( !(config.eventEmitter instanceof( events.EventEmitter ) ) ){
			err = "eventEmitter isn't an instance of an event emitter";
		}
		if( err ){ return cb( err ); }
		return cb( null, result );
	} );
};


E2S.prototype._setupEventListeners = function( ){
	// Let's setup the listeners..
	const self = this;
	this._config.eventNames.forEach( function( eventName ){
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

	const _to_emit = this._buffer.splice( 0, 1 );
	if( this._config.mode == "string" || this._config.mode == "buffer" ){
		// Just the data; Whatever we have in the buffer..
		this.push( _to_emit[0].data );
	}else{
		// Object mode; Push the entire object.
		this.push( _to_emit[0] );
	}
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
