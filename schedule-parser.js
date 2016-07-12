var request = require( "request" ),
		cheerio = require( "cheerio" );
		
var ourPartOfScheduleSGDQ2016 = require( "./content/our-part-of-schedule-sgdq2016" );
		commentatorsAndNotes = require( "./content/commentators-and-notes" );

var ONE_HOUR = 3600000;
		
var schedule,
		scheduleUrl;

function updateSchedule( callback ) {
	request( { "url": scheduleUrl	},
		function( error, response, page ) {
			var $ = cheerio.load( page ),
					newSchedule = [],
					row;
			
			for ( var each in ourPartOfScheduleSGDQ2016 ) {
				newSchedule.push( ourPartOfScheduleSGDQ2016[ each ] );
			}
			
			$( "table#runTable tbody tr" ).each( function() {
				var tr = $( this ),
						children = $( this ).children();
				
				if ( !tr.hasClass( "second-row" ) ) {
					row = {
						"start-time": "",
						"length": "",
						"game": "",
						"category": "",
						"runners": "",
						"commentators": "",
						"setup-length": "",
						"note": ""
					};
					
					row[ "start-time" ]   =  $( children[ 0 ] ).text().trim();
					row[ "game" ]         =  $( children[ 1 ] ).text().trim();
					row[ "runners" ]      =  $( children[ 2 ] ).text().trim();
					row[ "setup-length" ] =  $( children[ 3 ] ).text().trim();
					
					if ( row[ "game" ] in commentatorsAndNotes ) {
						var gameInfo = commentatorsAndNotes[ row[ "game" ] ];
						row[ "commentators" ] =  gameInfo[ "commentators" ];
						row[ "note" ]         =  gameInfo[ "note" ];
					}
				}
				else {
					row[ "length" ]   =  $( children[ 0 ] ).text().trim();
					row[ "category" ] =  $( children[ 1 ] ).text().trim();
					
					newSchedule.push( row );
				}
			} );
			
			newSchedule.push( row );
			
			schedule = newSchedule;
			
			if ( typeof callback === "function" ) {
				callback();
			}
		}
	);
}

function organizeCiclycalUpdate() {
	var now = new Date,
			nextUpdateTime = ONE_HOUR - now.getMilliseconds() - now.getSeconds() * 1000 - now.getMinutes() * 60000;
	
	setTimeout( function() {
		updateSchedule();
		
		setInterval( updateSchedule, ONE_HOUR );
	}, nextUpdateTime );
}

function init( url, callback ) {
	scheduleUrl = url;
	
	updateSchedule( callback );
	
	organizeCiclycalUpdate();
};

function getSchedule() {
	return schedule;
};


module.exports = {
	"init": init,
	"getSchedule": getSchedule
};