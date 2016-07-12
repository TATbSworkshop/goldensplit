var config = require( "./config.json" ),
		express = require( "express" ),
		path = require( "path" ),
		url = require( "url" ),
		scheduleParser = require( path.join( __dirname, config[ "schedule-parser" ].module ) );

var routes = require(  path.join( __dirname, config[ "content-folder" ], config[ "routes" ].options ) );

function getTitleBySuffix( suffix ) {
	return config[ "site-name" ] + " | " + suffix;
};

function getDescriptionBySuffix( suffix ) {
	return config[ "site-name" ] + ". " + suffix + ".";
};

function createRoutePageData( routePath, route ) {
	var pageData = route[ "page-data" ] = {};
	
	pageData[ "title" ] = getTitleBySuffix( route[ "title-suffix" ] );
	
	if ( route[ "description-suffix" ] ) {
		pageData[ "description" ] = getDescriptionBySuffix( route[ "description-suffix" ] );
	}
	
	if ( route[ "use-parser" ] ) {
		pageData[ "use-parser" ] = scheduleParser[ route[ "use-parser" ] ];
	}
	else if ( route[ "content-file" ] ) {
		pageData[ "content" ] = require(
			path.join( __dirname, config[ "content-folder" ], route[ "content-file" ] )
		);
	}
	else if ( route[ "subroutes" ] ) {
		var subroutes = route[ "subroutes" ],
				content = pageData[ "content" ] = {};
		
		for ( var subroiteID in subroutes ) {
			var subroute = subroutes[ subroiteID ];
			
			content[ subroute[ "submenu-item-name" ] ] = routePath + subroiteID;
		}
	}
};

var menu = {};
for ( var routeID in routes.items ) {
	var route = routes.items[ routeID ];

	createRoutePageData( routeID, route );
	if ( route.subroutes ) {
		var subroutes = route.subroutes;
		
		for ( var subrouteID in subroutes ) {
			createRoutePageData( subrouteID, subroutes[ subrouteID ] );
		}
	}
	
	if ( route[ "menu-item-name" ] ) {
		menu[ route[ "menu-item-name" ] ] = routeID;
	}
}

var mainPage = routes.items[ routes[ "main-page" ] ];

var error404Page = routes.items[ routes[ "not-found-error-page" ] ];
delete routes.items[ routes[ "not-found-error-page" ] ];

function searchRoute( url ) {
	if ( url === "/" )
		return mainPage;

	var urlParts = url.split( "/" ),
			route = routes.items[ "/" + urlParts[ 1 ] ];
	
	if ( route )
		if ( urlParts.length == 2 )
			return route;
		else if ( urlParts.length == 3 ) {
			return route.subroutes && route.subroutes[ "/" + urlParts[ 2 ] ];
		}
	
	return undefined;
}
	
var router = express.Router();

router.use( function( requery, response, next ) {
	var pathname = url.parse( requery.url ).pathname,
			route = searchRoute( pathname );
	
	if ( route ) {
		var pageData = route[ "page-data" ];
		
		response.render( route[ "pug-pattern" ], {
			"title": pageData.title,
			"description": pageData.description,
			"menu": menu,
			"selectedMenuItemName": route[ "menu-item-name" ],
			"content": pageData[ "use-parser" ] && pageData[ "use-parser" ]() || pageData[ "content" ]
		} );
	}
	else {
		response.render( error404Page[ "pug-pattern" ], {
			"title": error404Page.title,
			"menu": menu,
			"pathname": pathname
		} );
	}
} );

module.exports = router;