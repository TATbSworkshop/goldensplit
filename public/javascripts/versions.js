var $content = $( "#content" ),
		$support = $( "#support" ),
		$scrollToTopArrow = $('#scroll-to-top-arrow');

// set height section
var newHeight = $( window ).height() - $support.height();

if ( $content.height() < newHeight )
	$content.css( "min-height", newHeight );

// scroll to top section
var scrollTop = parseInt( $support.css( "min-height" ) );
function scrollTopArrowUpdate() {
	if( $( document ).scrollTop() > scrollTop ) {
		$scrollToTopArrow.fadeIn( 300 );
	}
	else {
		$scrollToTopArrow.fadeOut( 300 );
	}
}

scrollTopArrowUpdate();
$( document ).scroll( scrollTopArrowUpdate );

function scrollToTop() {
	$( "html, body" ).animate( { scrollTop: 0 } , 500 );
};
$scrollToTopArrow.click( function() {
	scrollToTop();
} );

// set vk widget section
function getHexRGBColor( color ) {
	color = color.replace( /\s/g, "" );
	
	var aRGB = color.match( /^rgb\((\d{1,3}[%]?),(\d{1,3}[%]?),(\d{1,3}[%]?)\)$/i );
	
	if( aRGB ) {
		color = '';
		for ( var i = 1;  i <= 3; i++ )
			color += Math.round( ( aRGB[ i ][ aRGB[ i ].length - 1 ] == "%" ? 2.55 : 1 ) * parseInt( aRGB[ i ] ) ).toString( 16 ).replace( /^(.)$/, "0$1" );
	}
	else
		color = color.replace( /^#?([\da-f])([\da-f])([\da-f])$/i, "$1$1$2$2$3$3" );
	
	return color;
}

if ( window.VK ) {
	VK.Widgets.Group( "vk_groups", {
		mode: 2,
		width: $content.width(),
		height: $content.height(),
		color2: getHexRGBColor( $support.css( "color" ) ),
		color3: getHexRGBColor( $support.css( "background-color" ) )
	}, 86768123 );
}

// set twitch section
function setTwitchHeight() {
	var $controlPanel = $( "#control-panel" ),
			$twitch = $( "#twitch" ),
			$twitchChat = $( "#twitch-chat" );
	
	if ( $( window ).width() <= 768 ) {
		var newHeight = $twitch.width() * 9 / 16 >> 0;
		$twitch.height( newHeight );
		var controlPanelYSize = $controlPanel.height() +
			parseInt( $controlPanel.css( "margin-top" ) ) +
			parseInt( $controlPanel.css( "margin-bottom" ) );
		$twitchChat.height( $content.height() - controlPanelYSize - 2 - newHeight );
		$twitchChat.css( "top", controlPanelYSize + 2 + newHeight );
	}
	else {
		var newHeight = $content.height() - $controlPanel.height() -
			parseInt( $controlPanel.css( "margin-top" ) ) - 
			parseInt( $controlPanel.css( "margin-bottom" ) ) - 2; //?
		
		$twitch.height( newHeight );
		$twitchChat.height( newHeight );
		$twitchChat.css( "top", 37 );
	}
};

// theater mode section
var closeTheaterMode,
		goTheaterMode;
if ( $( "twitch" ) ) {
	setTwitchHeight();
	
	var lastHeight = $content.height();
	
	closeTheaterMode = function() {
		$content.removeClass( "theater-mode" );
		$content.height( lastHeight );
		
		setTwitchHeight();
	};
	
	goTheaterMode = function() {
		$content.addClass( "theater-mode" );
		$content.height( $( window ).height() );
		
		setTwitchHeight();
	}
}

$( "#open-mobile-menu-button" ).click( function() {
	if ( $( "header" ).hasClass( "menu-opened" ) ) {
		$( "header" ).removeClass( "menu-opened" );
	}
	else {
		$( "header" ).addClass( "menu-opened" );
	}
} );

$( window ).resize( function() {
	var newHeight = $( window ).height() - $support.height();

	if ( $content.height() < newHeight )
		$content.css( "min-height", newHeight );
		
	setTwitchHeight();
} );
