 /*
	Katrina Ezis
	CSE 154 AF
	Homework 9 (Baby Names) 
	December 4, 2014
	Baby names utilizes ajax to fetch data in
	text, HTML, XML, and JSON formats. It utilizes
	this data and the user's selected name
	to show a page with the meaning/origin of the 
	name, the name's popularity since 1900 in graph
	form, and a list of celebrities with that same name.

	This is the Javascript code that 
	runs ajax and puts the names into
	the dropbox, the meaning, the popularity graph,
	and the list of celebrities into the rest of the
	page.
*/

 (function() {

 	"use strict";

 	// My module variables.
 	var URL = "https://webster.cs.washington.edu/cse154/babynames.php?type=";
 	var ERROR = false;

 	window.onload = function() {
 		open();

 		var search = document.getElementById("search");
 		search.onclick = nameSearch;
 	};

 	// Sends the ajax request for the list of names.
 	function open() {
 		var fullUrl = URL + "list";
 		ajaxRequest(fullUrl, dropNames);
 	}

 	// Takes list of names and puts it into a dropbox select
 	// menu. Checks for 404 errors, if an error occurs it
 	// displays an error message.
 	function dropNames() {
 		checkError(this);
 		if (ERROR) {
 			document.getElementById("loadingnames").style.display = "none";
 		} else {
	 		var names = this.responseText.split("\n");
	 		for(var i = 0; i < names.length; i++) {
	 			var option = document.createElement("option");
	 			option.innerHTML = names[i];
	 			option.value = names[i];
	 			document.getElementById("allnames").appendChild(option);
	 		}
	 		document.getElementById("allnames").removeAttribute("disabled");
	 		document.getElementById("loadingnames").style.display = "none";
	 	}
 	}

 	// When the user clicks the search button, this 
 	// will search for that name and display its data.
 	function nameSearch() {
 		var name = document.getElementById("allnames").value.toLowerCase();
 		var gender = null;
 		if (document.getElementById("genderf").checked) {
 			gender = "f";
 		} else {
 			gender = "m";
 		}
 		// If given a value other than the (choose a name) option
 		// it will call all the functions to show the data.
 		if (name != "") {
 			document.getElementById("resultsarea").style.display = "block";
 			meaning(name);
 			rank(name, gender);
 			celebss(name, gender);
	 	}
 	}

 	// Calls the ajax for the name's meaning. Displays
 	// the loading sign and title until the data is displayed.
 	function meaning(name) {
 		document.getElementById("meaning").innerHTML = "";
 		document.getElementById("loadingmeaning").style.display = "block";
 		var fullUrl = URL + "meaning&name=" + name;
 		ajaxRequest(fullUrl, meanings);
		
 	}

 	// Checks for an error and if one is found, displays 
 	// an error message. Otherwise it will grab the data
 	// for the name's meaning and display that ish.
 	function meanings(){
 		checkError(this);
 		if (ERROR) {
 			document.getElementById("loadingmeanings").style.display = "none";
 		} else {
	 		var meaningText = this.responseText;
	 		var meaningSpace = document.getElementById("meaning");
	 		meaningSpace.innerHTML = meaningText;
	 		document.getElementById("loadingmeaning").style.display = "none";
	 	}
 	}

 	// Displays the resultarea and load gif while making
 	// an ajax request.
 	function rank(name, gender) {
 		document.getElementById("loadinggraph").style.display = "block";
 		document.getElementById("graph").innerHTML = "";
 		document.getElementById("norankdata").style.display = "none";
 		var fullUrl = URL + "rank&name=" + name + "&gender=" + gender;
 		ajaxRequest(fullUrl, rankings);
 	}

 	// Checks for an error, if it is a 404 error displays
 	// that error message, if it is a 410 error displays
 	// the div that contains that ish.
 	// Otherwise it will create a graphical representation
 	// of the data.
 	function rankings() {
 		checkError(this);
 		if (ERROR) {
 			document.getElementById("loadinggraph").style.display = "none";
 		} else if (this.status == 410) {
 			document.getElementById("norankdata").style.display = "";
 		} else {
 			var ranking = this.responseXML.querySelectorAll("rank");
 			var graph = document.getElementById("graph");
 			graph.innerHTML = "";
 			var row1 = document.createElement("tr");
 			var row2 = document.createElement("tr");
 			graph.appendChild(row1);
 			graph.appendChild(row2);

 			// Takes the two rows and displays the graphs
 			// with the numbers.
 			for(var i = 0; i < ranking.length; i++) {
 				var header = document.createElement("th");
 				header.innerHTML = ranking[i].getAttribute("year");
 				row1.appendChild(header);

 				var element = document.createElement("td");

 				var div = document.createElement("div");
 				element.appendChild(div);
 				var rankText = ranking[i].textContent;
 				div.innerHTML = rankText;
 				var height = 0;

 				if (rankText != 0) {
 					height = parseInt((1000 - rankText) / 4);
 				} 

 				row2.appendChild(element);
 				if (rankText < 11 && rankText > 0) {
 					div.style.color = "red";
 				}
 				div.style.height = height + "px";
 				div.classList.add("graph");
 			}
 		}
 		document.getElementById("loadinggraph").style.display = "none";
 	}

 	// Displays the loadarea and search gif while making
 	// an ajax request.
 	function celebss(name, gender) {
 		document.getElementById("loadingcelebs").style.display = "block";
 		document.getElementById("celebs").innerHTML = "";
 		var fullUrl = URL + "=celebs&name=" + name + "&gender=" + gender;
 		ajaxRequest(fullUrl, showCelebs);
 	}

 	// Checks for an error, and if one is found displays the error message.
 	// Otherwise displays the names of celebrities that have the same first
 	// name of the name searched in a list.
 	function showCelebs() {
 		checkError(this);
 		if (ERROR) {
 			document.getElementById("loadingcelebs").style.display = "none";
 		} else {
	 		var celebrity = JSON.parse(this.responseText);
	 		for (var i = 0; i < celebrity.actors.length; i++) {
	 			var li = document.createElement("li");
	 			li.innerHTML = celebrity.actors[i].firstName + " " + 
	 							celebrity.actors[i].lastName + " (" +
	 							celebrity.actors[i].filmCount + ")";
				document.getElementById("celebs").appendChild(li);
	 		}
	 		document.getElementById("loadingcelebs").style.display = "none";
 		}
 	}

 	// Checks for an 404 error. If an error is found
 	// it will display a very specific error message.
 	function checkError(check){
 		if (check.status == 404) {
 			ERROR = true;
 			var error = document.getElementById("errors");
 			error.innerHTML = "Was unable to process request. Please reload page and try again.";
 		}
 	}

 	// Function to create an ajax request when
 	// given the url and the function.
 	function ajaxRequest(fullUrl, callBack) {
 		var ajax = new XMLHttpRequest();
 		ajax.onload = callBack;
		ajax.open("GET", fullUrl, true);
		ajax.send();
 	}

 }) ();