var bp = {
	init: function(){
		bp.checkColors();
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
		app.dialog.confirm(text,doAfter());
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
	},
	checkColors: function(){
		if(bp.storage.get("theme") == null){
			bp.setLayoutTheme("light");
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
	}
}