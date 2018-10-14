var date = new Date();
var punch = {
	version: "1.0.1",
	name: "punch",
	punches: [],
	activePunch: undefined,
	init: undefined,
	properties: [],
	propNames: [],
	ptype: "building",
	newPunchDate: undefined,
	newPunchTime: undefined,
	punchOutDate: undefined,
	punchOutTime: undefined,
	activeProperty: undefined,
	propertyAutocomplete: undefined,
	buildingAutocomplete: undefined,
	unitAutocomplete: undefined,
	commentAutocomplete: undefined,
	activeBuildings: [],
	activeUnits: [],
	comments: [],
	getProperty: function(id){
		for(var x = 0; x < bp.punch.properties.length; x++){
			if(bp.punch.properties[x].id == id)
				return bp.punch.properties[x];
		}
		return undefined;
	},
	getPunch: function(id){
		for(var x = 0; x < bp.punch.punches.length; x++){
			if(bp.punch.punches[x].id == id)
				return bp.punch.punches[x];
		}
		return undefined;
	},
	punchInit: function(){
		if(bp.punch.init == undefined){
			bp.punch.propNames = [];
			app.request.get(bp.phpLoc+"getProperties",function(data){
				data = JSON.parse(data);
				
				if(data.status == "good"){
					//console.log(data.properties);
					bp.punch.properties = data.properties;
					bp.punch.comments = data.comments;
					for(var i = 0; i < bp.punch.properties.length; i++){
						bp.punch.properties[i].buildings = JSON.parse(bp.punch.properties[i].buildings);
						bp.punch.properties[i].units = JSON.parse(bp.punch.properties[i].units);
						bp.punch.propNames.push("("+bp.punch.properties[i].id+") "+bp.punch.properties[i].name);
					}
					
					bp.punch.update();
					bp.punch.init = false;
					bp.punch.punchInit();
				}else{
					bp.crashToHome("505: PROP-NF");
				}
			});
			
			//console.log("pulling db");
		}
		if(bp.punch.init == false){
			if(bp.punch.propertyAutocomplete !== undefined){
				bp.punch.propertyAutocomplete.destroy();
				bp.punch.buildingAutocomplete.destroy();
				bp.punch.unitAutocomplete.destroy();
				bp.punch.commentAutocomplete.destroy();
				
			}
			
			$(".ptype").hide();
			$(".ptype-"+bp.punch.ptype).show();
			bp.punch.init = true;
			

			bp.punch.propertyAutocomplete = app.autocomplete.create({
				inputEl: '#punch-prop-autocomplete',
				openIn: 'dropdown',
				source: function (query, render) {
					var results = [];
					// Find matched items
					for (var i = 0; i < bp.punch.propNames.length; i++) {
						if (bp.punch.propNames[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(bp.punch.propNames[i]);
					}
					// Render items by passing array with result items
					render(results);
				},
				on:{
					autocompleteClosed: function(){
						var p = $('#punch-prop-autocomplete').val();
						p = p.substring(1,p.length-1);
						var pid = parseInt(p.split(")")[0]);
						bp.punch.activeProperty = bp.punch.getProperty(pid);
						//console.log(bp.punch.activeProperty);
						bp.punch.activeBuildings = [];
						bp.punch.activeUnits = [];
						bp.punch.activeBuildings = bp.punch.activeProperty.buildings;
						bp.punch.activeUnits = bp.punch.activeProperty.units;
						//console.log(bp.punch.activeBuildings);
					}
				}
			});
			
			bp.punch.buildingAutocomplete = app.autocomplete.create({
				inputEl: '#punch-building-autocomplete',
				openIn: 'dropdown',
				source: function (query, render) {
					var results = [];
					// Find matched items
					for (var i = 0; i < bp.punch.activeBuildings.length; i++) {
						if (bp.punch.activeBuildings[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(bp.punch.activeBuildings[i]);
					}
					// Render items by passing array with result items
					render(results);
				},
				on:{
					autocompleteClosed: function(){
						
					}
				}
			});
			
			bp.punch.unitAutocomplete = app.autocomplete.create({
				inputEl: '#punch-unit-autocomplete',
				openIn: 'dropdown',
				source: function (query, render) {
					var results = [];
					// Find matched items
					for (var i = 0; i < bp.punch.activeUnits.length; i++) {
						if (bp.punch.activeUnits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(bp.punch.activeUnits[i]);
					}
					// Render items by passing array with result items
					render(results);
				},
				on:{
					autocompleteClosed: function(){
						
					}
				}
			});
			
			bp.punch.commentAutocomplete = app.autocomplete.create({
				inputEl: '#punch-other-autocomplete',
				openIn: 'dropdown',
				source: function (query, render) {
					var results = [];
					// Find matched items
					for (var i = 0; i < bp.punch.comments.length; i++) {
						if (bp.punch.comments[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(bp.punch.comments[i]);
					}
					// Render items by passing array with result items
					render(results);
				},
				on:{
					autocompleteClosed: function(){
						
					}
				}
			});
			
			
			
			bp.punch.newPunchDate = app.calendar.create({
				  inputEl: '#punch-date-autocomplete',
				  dateFormat: 'mm-dd-yyyy',
				  openIn: 'popover',
				  header: true,
				  footer: false,
				  value: [date]
				});
			bp.punch.newPunchTime = app.picker.create({
				  inputEl: '#punch-time-autocomplete',
				    rotateEffect: true,
				    openIn: 'popover',
				    value: [
				    	"12",
				    	"59",
				    	"PM"
				    ],
				    renderToolbar: function () {
				        return '<div class="toolbar">' +
				          '<div class="toolbar-inner">' +
				            '<div class="left">' +
				              '' +
				            '</div>' +
				            '<div class="right">' +
				              '<a href="#" class="link popover-close" onclick="">Select Time</a>' +
				            '</div>' +
				          '</div>' +
				        '</div>';
				      },
				    formatValue: function (values, displayValues) {
				        return values[0]+":"+values[1]+" "+values[2];
				      },
				    cols: [
				      {
				        textAlign: 'left',
				        values: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' ')
				      },
				      {
				          values: ('00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59').split(' ')
				    	  //values: ('00 05 10 15 20 25 30 35 40 45 50 55').split(' ')
				      },
				      {
				         values: ('AM PM').split(' ')
				      },
			    ]
			});
			
			bp.punch.punchOutDate = app.calendar.create({
				  inputEl: '#punch-out-date-autocomplete',
				  dateFormat: 'mm-dd-yyyy',
				  openIn: 'popover',
				  header: true,
				  footer: false,
				  value: [date]
				});
			bp.punch.punchOutTime = app.picker.create({
				  inputEl: '#punch-out-time-autocomplete',
				    rotateEffect: true,
				    openIn: 'popover',
				    value: [
				    	"12",
				    	"59",
				    	"PM"
				    ],
				    renderToolbar: function () {
				        return '<div class="toolbar">' +
				          '<div class="toolbar-inner">' +
				            '<div class="left">' +
				              '' +
				            '</div>' +
				            '<div class="right">' +
				              '<a href="#" class="link popover-close" onclick="">Select Time</a>' +
				            '</div>' +
				          '</div>' +
				        '</div>';
				      },
				    formatValue: function (values, displayValues) {
				        return values[0]+":"+values[1]+" "+values[2];
				      },
				    cols: [
				      {
				        textAlign: 'left',
				        values: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' ')
				      },
				      {
				          values: ('00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59').split(' ')
				    	  //values: ('00 05 10 15 20 25 30 35 40 45 50 55').split(' ')
				      },
				      {
				         values: ('AM PM').split(' ')
				      },
			    ]
			});
			
		}
	},
	changePType: function(pt,btn){
		bp.punch.ptype = pt;
		$(".ptype").hide();
		$(".ptype-"+bp.punch.ptype).show();
		$(".ptb").removeClass("button-active");
		$(".ptb-"+pt).addClass("button-active");
	},
	getPunches: function(){
		bp.punch.punches = [];
		bp.load();
		app.request.get(bp.phpLoc+"getPunches&id="+bp.user.id,function(data){
			data = JSON.parse(data);			
			if(data.status == "good"){
				
				bp.punch.punches = data.punches;
				bp.punch.update();
			}else{
				bp.punch.update();
			}
			
		});
	},
	update: function(){
		bp.stopLoad();
		bp.punch.activePunch = undefined;
		$(".table-contents").html("");
		var contents = "";
		for(var i = 0; i < bp.punch.punches.length; i++){
			contents += "<tr>";
			contents += "<td class='label-cell'>"+bp.punch.getProperty(bp.punch.punches[i].property).name+"</td>";
			contents += "<td class='label-cell tablet-only'>"+bp.punch.punches[i].inDate+"</td>";
			contents += "<td class='label-cell'>"+bp.punch.punches[i].inTime+"</td>";
			contents += "<td class='label-cell'>"+bp.punch.punches[i].outTime+"</td>";
			contents += "<td class='label-cell tablet-only'>"+bp.punch.punches[i].hours+"</td>";
			var btn = '<a href="#" class="link" onClick="bp.punch.aboutPunch('+bp.punch.punches[i].id+')"><i class="icon f7-icons">info_fill</i></a>';
			contents += "<td class='label-cell'>"+btn+"</td>";
			contents += "<tr>";
			
			if(bp.punch.punches[i].open == "yes"){
				bp.punch.activePunch = bp.punch.punches[i];
				//console.log(bp.punch.activePunch);
			}
		}
		$(".table-contents").html(contents);
		if(bp.punch.activePunch == undefined || bp.punch.punches.length < 1){
			$(".active-punch-start").html("");
			$(".active-punch-end").html("");
			$(".no-active-punch").html('No active punch found!<div class="row"><div class="col"></div><button class="col button button-fill" onclick="bp.punch.newPunch()">Punch In</button><div class="col"></div></div>');
		}
		else{
			var prop = bp.punch.getProperty(bp.punch.activePunch.property);
			$(".active-punch-start").html(prop.name+"<br>"+bp.punch.activePunch.inDate+"<br>"+bp.punch.activePunch.inTime);
			$(".active-punch-end").html('<button class="button button-fill" onclick="bp.punch.newPunch()">Punch Out</button>');
			$(".no-active-punch").html('');
		}
	},
	newPunch: function(){
		if(bp.punch.activePunch == undefined){
			app.sheet.open(".new-punch-sheet");
			date = new Date();
			var adjustedHour = date.getHours();
			var amPM = "AM";
			if(date.getHours() >= 12){
				if(date.getHours() > 12)
					adjustedHour = date.getHours()-12;
				amPM = "PM"
			}
			var minutes = date.getMinutes();
			if(minutes < 10){
				minutes = "0"+minutes;
			}

			bp.punch.newPunchTime.value = [adjustedHour,minutes,amPM];
			$("#punch-time-autocomplete").val(adjustedHour+":"+minutes+" "+amPM);
			
			$("#new-punch-submit").off("click").on("click",function(){
				if(bp.punch.activeProperty !== undefined){
					//app.request.get(bp.phpLoc+"getPunches&id="+bp.user.id,function(data){
					var user = bp.user.id;
					var property = bp.punch.activeProperty.id;
					var building = $("#punch-building-autocomplete").val();
					var unit = $("#punch-unit-autocomplete").val();
					var comment = $("#punch-other-autocomplete").val();
					var date = $("#punch-date-autocomplete").val();
					var time = $("#punch-time-autocomplete").val();
					if(building.length < 1)
						building = "N/A";
					if(unit.length < 1)
						unit = "N/A";
					if(comment.length < 1){
						bp.toast("Specific job is required!");
					}
					else{
						bp.load();
						app.request.get(bp.phpLoc+"newPunch&user="+user+"&property="+property+"&building="+building+"&unit="+unit+"&date="+date+"&time="+time+"&comment="+comment,function(data){
							//console.log(data);
							bp.stopLoad();
							if(data == "GOOD"){
								app.sheet.close(".new-punch-sheet");
								bp.toast("Punched in!");
								bp.punch.getPunches();
							}
							else if(data == "INVALID"){
								bp.toast("You new punch overlaps an old one!");
							}else{
								bp.toast("Unable to punch in. Please try later!");
							}
						});
					}
				}else{
					bp.toast("Property is required!");
				}
			});
		}
		else{
			bp.punch.punchOut();
		}
	},
	punchOut: function(){
		app.sheet.open(".punch-out-sheet");
		date = new Date();
		var adjustedHour = date.getHours();
		var amPM = "AM";
		if(date.getHours() >= 12){
			if(date.getHours() > 12)
				adjustedHour = date.getHours()-12;
			amPM = "PM"
		}
		var minutes = date.getMinutes();
		if(minutes < 10){
			minutes = "0"+minutes;
		}

		bp.punch.punchOutTime.value = [adjustedHour,minutes,amPM];
		$("#punch-out-time-autocomplete").val(adjustedHour+":"+minutes+" "+amPM);
		
		$("#punch-out-property").val(bp.punch.getProperty(bp.punch.activePunch.property).name);
		$("#punch-out-building").val(bp.punch.activePunch.building);
		$("#punch-out-unit").val(bp.punch.activePunch.unit);
		$("#punch-out-comment").val(bp.punch.activePunch.comment);
		
		
		
		$("#punch-out-submit").off("click").on("click",function(){
			var datel = $("#punch-out-date-autocomplete").val();
			var time = $("#punch-out-time-autocomplete").val();
			app.request.get(bp.phpLoc+"punchOut&id="+bp.punch.activePunch.id+"&date="+datel+"&time="+time,function(data){
				if(data == "GOOD"){
					app.sheet.close(".punch-out-sheet");
					bp.toast("Punched out!");
					bp.punch.getPunches();
				}else{
					bp.toast("Punch out date/time invalid!");
					console.log(data);
				}
			});
		});
	},
	aboutPunch: function(id){
		var p = bp.punch.getPunch(id);
		if(p == undefined){
			bp.toast("Error pulling punch info!");
		}
		else{
			app.sheet.open(".punch-info-sheet");
			$("#punch-info-property").val(bp.punch.getProperty(p.property).name);
			$("#punch-info-building").val(p.building);
			$("#punch-info-unit").val(p.unit);
			$("#punch-info-comment").val(p.comment);
			$("#punch-info-sdate").val(p.inDate);
			$("#punch-info-stime").val(p.inTime);
			$("#punch-info-edate").val(p.outDate);
			$("#punch-info-etime").val(p.outTime);
			$("#punch-info-hours").val(p.hours);
		}
	},
}