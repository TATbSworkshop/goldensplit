$( document ).ready( function () {
	var dayBreak = null;
	
	moment.locale( "ru" );
	
	$( "tbody .start-time" ).each( function () {

		runTimestamp = moment( $( this ).html() );
		runTime = new moment( runTimestamp );
		
		if ( dayBreak != runTime.date() ) {
				dayBreak = runTime.date();
				
				$( this ).parent().before( '<tr class="day-split" >' +
					'<td colspan="20">'
					+ runTime.format( "D MMMM, dddd" ) + "</td></tr>" );
		}

		$( this ).html( runTime.format( "LT" ) );
	} );
	
	var str = $( "p:first" ).text();
	$( "p:first" ).html( str + " (UTC" + moment().format( "Z" ) + ")." );
} );