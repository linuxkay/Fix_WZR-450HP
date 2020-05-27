
// source before using minifier of http://jscompress.com/
var xml_url = null;
var v_xml_url = null;
var active_player = null;
jwplayer.key="RQ0vRMzETcisW23xd5gVfyRp6p5v3k3AS+4i3w==";

function callPlayer(xml_url,landing,container, p_width, p_height, _autoplay, _cust){
    landing = landing.trim();
	var _landing = landing;
	var advertising_client = 'vast';
	var _thumbnail = "/favicon.ico";

	//******************* Remember the gallery, no continer there ***************
	if ( !container ){
		container = "galleryPlayer";
	}
    
	// ******************* parameter passed to the Ad Unit tag *********************
	var timestamp = new Date().getTime();
	var referrer_url = document.referrer;

	//********************Just One Player does autoplay IF all active************
	if ( _autoplay && _autoplay < 1){
		_autoplay = false;
	}
	else{
		_autoplay = true;
		//keep tracking of active one
		if ( active_player == null ){
			active_player = container;
		}
		else{
			//only one auto play in each page
			_autoplay = false;
		}
	}


	// *********************Watch and thumbnails URL for YouTube****************
	var isYouTube = false;

	if (landing.indexOf(".vsv") == landing.length - 4){
		pureFileName = landing.replace(".vsv","");
	} else if ( landing.length == 11 ) {
		isYouTube = true;
	}

	if ( isYouTube ){
		_thumbnail = "http://img.youtube.com/vi/" + landing + "/hqdefault.jpg"
		_landing = "http://www.youtube.com/watch?v=" + landing;
	}


	// dimensions settings (based on each site design)
	// ***********************************************
	if ( !p_width ){
		p_width = '474';
	}
	if ( !p_height ){
		p_height = '383';
	}

	// setting custom params for tag
	var cust = "";
	if ( _cust && _cust.length > 0 ){
		cust = _cust.replace(/=/g, "%3D");
		cust = cust.replace(/,/g, "%2C");
		cust = cust.replace(/&/g, "%26");
		cust = "&cust_params=" + cust;
	}

	// in new pre-roll no xml_url is passed, but we need to check for older cases
	//***************************************************************************
	if ( !xml_url ){
		xml_url = "http://pubads.g.doubleclick.net/gampad/ads?sz=300x250&iu=%2F1030735%2FOverclock_net_300x250_Pre-Roll&ciu_szs=&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url="+referrer_url+"&correlator="+timestamp+cust;
		advertising_client = 'googima';
	} else {
		xml_url = xml_url + "";
		if (xml_url.toLowerCase().indexOf("/gallery/preroll") > 0 || xml_url.indexOf("scripts/player/preroll_tracking.php") > 0 ){
			xml_url = xml_url + "&calledfrom="+document.URL;
		} else {
			//just know it is an external vast and you have to change the advertising.client
			// which actually by default is vast
		}
	}

	jwplayer(container).setup({
		file: _landing,
		image: _thumbnail,
		skin: "http://www.overclock.net/videoplayer/modieus.xml",
		autostart: _autoplay,
		flashplayer: "http://www.overclock.net/videoplayer/jwplayer.flash.swf",
		html5player: "http://www.overclock.net/videoplayer/jwplayer.html5.js",
		primary: "flash",
		stretching: "fill",
		width: p_width,
		height: p_height,
		//aspectratio: "16:9",
		logo: {
			file: "/favicon.ico",
			link: "overclock.net"	
		},
		advertising: {
			client: advertising_client,
			tag: xml_url
		}
	});
}