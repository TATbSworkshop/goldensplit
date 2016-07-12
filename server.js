var config = require( "./config.json" ),
		express = require( "express" ),
		path = require( "path" );

var server = express();

if ( config[ "template-engine" ] ) {
	server.set( "views", path.join( __dirname, config[ "template-engine" ].folder ) );
	server.set( "view engine", config[ "template-engine" ].type );
}

if ( config[ "favicon" ] ) {
	var favicon = require( "serve-favicon" );
	
	server.use( favicon( path.join( config[ "favicon" ].folder, config[ "favicon" ].file ) ) );
}

if ( config[ "logger" ] ) {
	var logger = require( config[ "logger" ].type );
	
	server.use( logger( config[ "logger" ].options ) );
}

if ( config[ "css-processor" ] ) {
	if ( config[ "css-processor" ].type === "stylus" ) {
		var stylus = require( "stylus" ),
				nib = require( "nib" );
			
		server.use( stylus.middleware( {
			"src": path.join( __dirname, config[ "css-processor" ].folder ),
			"compile": function compile( str, path ) {
				return stylus( str ).set( "filename", path ).use( nib() );
			}
		} ) );
	}
}

if ( config[ "body-parser" ] ) {
	var bodyParser = require( "body-parser" );
	
	server.use( bodyParser.json() );
	server.use( bodyParser.urlencoded( config[ "body-parser" ].options ) );
}

if ( config[ "cookie-parser" ] ) {
	var cookieParser = require( "cookie-parser" );
	
	server.use( cookieParser() );
}

if ( config[ "use-static" ] ) {
	server.use( express.static( path.join( __dirname, config[ "use-static" ].folder ) ) );
}

if ( config[ "schedule-parser" ] ) {
	var scheduleParser = require( path.join( __dirname, config[ "schedule-parser" ].module ) );
	
	scheduleParser.init( config[ "schedule-parser" ].url, function() {
		if ( config[ "routes" ] ) {
			var routes = require( path.join( __dirname, config[ "routes" ].module ) );
			
			server.use( "/", routes );
		}
		
		// start server
		server.listen( config.port, function () {
			console.log( "Server " + config[ "site-name" ]+ " listening on port " + config.port + '!' );
		} );
	} );
}

