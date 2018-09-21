// Dom7
var $ = Dom7;

var version = "102";

// Theme
var theme = "ios";
if(bp.storage.get("os-theme") != null) 
	theme = bp.storage.get("os-theme");

var backPress = 0;
var homeError = false;
// Init App
var app = new Framework7({
  id: 'tech.bano.bpe',
  root: '#app',
  name: "Barrett Plumbing Employee",
  panel: {
	swipe:"left",
  },
  theme: theme,
  
  routes: routes,
  vi: {
    placementId: 'pltd4o7ibb9rc653x14',
  },
  statusbar: {
    iosOverlaysWebView: true,
  },
  pushState : true,
  on: {
	pageInit: function(page){
		$(".app-version").html(version);
		backPress = 0;
		if(page.name == "home"){
			if(!homeError)
				$(".error-report").html("Status: OK");
		}else{
			homeError = false;
		}
	},
	dialog: {
		title: "Barrett Plumbing",
	}
  },
 // iosDynamicNavbar: true, 
});

var mainView = app.views.create('.view-main');
mainView.iosDynamicNavbar = false;

function onBackKeyDown() {
	//alert(mainView.history.length);
	if(mainView.history.length > 1){
		mainView.router.back();
		backPress = 0;
	}
	else{
		backPress++;
		if(backPress == 2){
			navigator.app.exitApp();
		}
		else{
			bp.toast("Press back again to close app");
		}
	}
}

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	//mainView.router.navigate("/");
	app.navbar.show();
	document.addEventListener("backbutton", onBackKeyDown, false);
	bp.init();
}