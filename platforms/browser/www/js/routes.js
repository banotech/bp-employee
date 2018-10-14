var routes = [
	// Index page
	{
	path: '/',
	url: './index.html',
	name: 'home',
	},

	// Components
	{
		path: '/profile/',
		url: './pages/profile.html',
		name: "profile",
	},
	{
		path: '/about/',
		url: './pages/about.html',
		name: "about",
	},
	{
		path: '/settings/', 
		url: './pages/settings.html',
		name: "settings",
	},
	{
		path: '/punch/', 
		url: './pages/punch.html',
		name: "punch",
		on: {
			pageInit: function() {
				//bp.lockApp();
				//bp.verifyPin();
				//console.log(bp.punch);
				bp.punch.init = undefined;
				bp.punch.punchInit();
				bp.punch.getPunches();
			},
		}
	},

	// Default route (404 page). MUST BE THE LAST
	{
		path: '(.*)',
		url: './index.html',
		on: {
			pageInit: function(){
				homeError = true;
				$(".error-report").html("Status: ERR: 404-PNF");
			}
		},
	},
];
