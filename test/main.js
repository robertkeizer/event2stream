const E2S	= require( "../" );
const assert	= require( "assert" );
const events	= require( "events" );

describe( "Main", function( ){
	it( "Is a function", function( ){
		assert.ok( typeof( E2S ), "function" );
	} );

	it( "Fails if event emitter not passed in", function( ){
		assert.throws( function( ){
			const z = new E2S( );
		} );
	} );

	it( "Fails if no event names are specified", function( ){
		const _ee = new events.EventEmitter( );
		assert.throws( function( ){
			const z = new E2S( _ee );
		} );
	} );

	it( "Emits data, and can be paused.", function( cb ){
		const _ee = new events.EventEmitter( );
		const _e2s = new E2S( { eventEmitter: _ee, eventNames: [ "hey" ] } );
		_e2s.pause();
		_e2s.on( "data", function( chunk ){
			_e2s.die( cb );
		} );
		setTimeout( function( ){
			_e2s.resume();
		}, 1000 );

		_ee.emit( "hey", { "This": "is", data: 1 } );
	} );
} );
