var bp = {
	phpLoc: "https://bano.tech/bp/bp.app.alpha.php?function=",
	loggedIn: false,
	user: undefined,
	numpadInline: undefined,
	init: function(){
		 bp.numpadInline = app.keypad.create({
			inputEl: '#demo-numpad-inline',
			containerEl: '#numpad-inline-container',
			toolbar: false,
			valueMaxLength: 5,
			dotButton: false,
			formatValue: function (value) {
			  value = value.toString();
			  return ('*****').substring(0, value.length) + ('_____').substring(0, 5 - value.length);
			},
			on: {
			  change(keypad, value) {
				value = value.toString();
				if (value.length === 5) {
				  bp.tryPin(value);
				}
			  }
			}
		  });
		bp.checkColors();
		
		if(bp.storage.get("user") !== null && bp.storage.get("locked") == null){
			bp.user = JSON.parse(bp.storage.get("user"));
			bp.loggedIn = true;
			bp.update();
		}else if(bp.storage.get("user") !== null && bp.storage.get("locked") !== null){
			bp.user = JSON.parse(bp.storage.get("user"));
			//bp.verifyPin();
		}
	},
	load: function(delay){
		app.dialog.preloader();
		if(delay !== undefined){
			setTimeout(function(){
				bp.stopLoad();
			},delay);
		}
	},
	stopLoad: function(){
		app.dialog.close();
	},
	tryEmailLogin: function(){
		bp.load();
		app.request.get(bp.phpLoc+"emailLogin&email="+$("#bp-login-email").val()+"&password="+$("#bp-login-password").val(),function(data){
			data = JSON.parse(data);
			bp.stopLoad();
			if(data.status == "good"){
				app.sheet.close(".login-sheet");
				bp.toast("Welcome back, "+data.fName);
				bp.user = data;
				bp.loggedIn = true;
				bp.storage.set("user",JSON.stringify(bp.user));
				bp.update();
			}else{
				bp.toast("Login is invalid!");
			}
		});
	},
	login: function(){
		if(bp.storage.get("user") != null){
			bp.verifyPin();
		}else{
			app.sheet.open(".login-sheet");
			$("#bp-login-email").val("");
			$("#bp-login-password").val("");
		}
	},
	logout: function(){
		app.dialog.create({
			title: "BP Logout",
			text: "Do you want to lock the app  or completely logout?",
			buttons: [
				{
					text: "Lock (Require Pin)",
					onClick: function(){
						bp.lockApp();
					},
				},
				{
					text: "Logout (Require email/password)",
					onClick: function(){
						bp.loggedIn = false;
						bp.user = undefined;
						bp.storage.del("user");
						bp.update();
					},
				},
				{
					text: "Cancel",
				}
			],
			verticalButtons: true,
		}).open();;
	},
	hardLogout: function(){
		bp.confirm("This deletes all stored user data on the app including themes, user information, and unsaved changes. This cannot be undone. Continue?",function(){
			window.localStorage.clear();
			location.reload();
		});
	},
	verifyPin: function(){
		$("#demo-numpad-inline").val("_____");
		bp.numpadInline.value = "";
		app.sheet.open(".pin-sheet");
		//bp.navigate("/enterPin/");
		//app.keypad.destroy("#demo-numpad-inline");
		
		
	},
	tryPin: function(value){
		if(value == bp.user.pin){
			app.sheet.close(".pin-sheet");
			bp.loggedIn = true;
			bp.storage.del("locked");
			bp.toast("User verified!");
			bp.update();
		}
		else{
			bp.popup("That pin was incorrect!");
			$("#demo-numpad-inline").val("_____");
			bp.numpadInline.value = "";
		}
	},
	lockApp: function(){
		bp.toast("App locked. Please verify pin.");
		bp.loggedIn = false;
		bp.update();
		bp.storage.set("locked","true");
	},
	addSheet: false,
	update: function(){
		$(".bp-email-login").on("click",function(){
			bp.tryEmailLogin();
		});

		if(bp.loggedIn){
			$(".logged-out").hide();
			$(".logged-in").show();
			$(".bp-fName").html(bp.user.fName);
			$(".bp-lName").html(bp.user.lName);
		}else{
			$(".logged-out").show();
			$(".logged-in").hide();
			$(".bp-fName").html("");
			$(".bp-lName").html("");
		}
	},
	toast: function(text,type,buttonAction){
		if(type == "timed" || type == undefined){
			var toastBottom = app.toast.create({
			  text: text,
			  closeTimeout: 2000,
			}).open();
		}
	},
	popup: function(text){
		app.dialog.alert(text);
	},
	confirm: function(text,doAfter){
		app.dialog.confirm(text,doAfter);
	},
	getUrlParam: function(param) { 
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === param) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	},
	navigate: function(page){
		mainView.router.navigate(page);
	},
	crashToHome: function(error){
		mainView.router.navigate("/");
		setTimeout(function(){
			homeError = true;
			$(".error-report").html("Status: ERR: "+error);
		},200);
	},
	setLayoutTheme: function(color){
		if(color == "dark"){
			$("body").removeClass("theme-light");
			$("body").addClass("theme-dark");
		}else{
			$("body").removeClass("theme-dark");
			$("body").addClass("theme-light");
		}
		bp.storage.set("theme",color);
	},
	setColorTheme: function(color){
		var currentColorClass = app.root[0].className.match(/color-theme-([a-z]*)/);
        if (currentColorClass) app.root.removeClass(currentColorClass[0])
          app.root.addClass('color-theme-' + color);
		bp.storage.set("color-theme",color);
		
	},
	storage: {
		get: function(item){
			return window.localStorage.getItem(item);
		},
		set: function(item,value){
			window.localStorage.setItem(item,value);
		},
		del: function(item){
			window.localStorage.removeItem(item);
		}
	},
	checkColors: function(){
		if(bp.storage.get("theme") == null){
			bp.setLayoutTheme("dark");
		}
		else{
			bp.setLayoutTheme(bp.storage.get("theme"));
		}
		if(bp.storage.get("color-theme") == null){
			bp.setColorTheme("blue");
		}
		else{
			bp.setColorTheme(bp.storage.get("color-theme"));
		}
	},
	setOsTheme: function(os){
		bp.storage.set("os-theme",os);
		bp.confirm("This requires a restart. Restart now?",function(){
			location.reload();
		});
	},
	addSubsystem: function(name,sys){
		//bp = {bp,sys};
		var obj3 = {};
		for (var attrname in bp) { obj3[attrname] = bp[attrname];}
		obj3[sys.name] = sys;
		
		bp = obj3;
		console.log("Successfully added subsystem: "+name);
	}
}