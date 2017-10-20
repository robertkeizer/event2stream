const E2S	= require( "../" );
const assert	= require( "assert" );

describe( "Main", function( ){
	it( "Is a function", function( ){
		assert.ok( typeof( E2S ), "function" );
	} );

	it( "Fails if event emitter not passed in", function( ){
		assert.throws( function( ){
			const z = new E2S( );
		} );
	} );
} );
