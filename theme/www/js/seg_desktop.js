
/*seg_desktop_include.js*/

/*seg_desktop.js*/
if(!u || !Util) {
	var u, Util = u = new function() {};
	u.version = 0.8;
	u.bug = function() {};
	u.nodeId = function() {};
	u.stats = new function() {this.pageView = function(){};this.event = function(){};this.customVar = function(){};}
}
Util.debugURL = function(url) {
	if(u.bug_force) {
		return true;
	}
	return document.domain.match(/.local$/);
}
Util.nodeId = function(node, include_path) {
		if(!include_path) {
			return node.id ? node.nodeName+"#"+node.id : (node.className ? node.nodeName+"."+node.className : (node.name ? node.nodeName + "["+node.name+"]" : node.nodeName));
		}
		else {
			if(node.parentNode && node.parentNode.nodeName != "HTML") {
				return u.nodeId(node.parentNode, include_path) + "->" + u.nodeId(node);
			}
			else {
				return u.nodeId(node);
			}
		}
	return "Unindentifiable node!";
}
Util.bug = function(message, corner, color) {
	if(u.debugURL()) {
		if(!u.bug_console_only) {
			var option, options = new Array([0, "auto", "auto", 0], [0, 0, "auto", "auto"], ["auto", 0, 0, "auto"], ["auto", "auto", 0, 0]);
			if(isNaN(corner)) {
				color = corner;
				corner = 0;
			}
			if(typeof(color) != "string") {
				color = "black";
			}
			option = options[corner];
			if(!u.qs("#debug_id_"+corner)) {
				var d_target = u.ae(document.body, "div", {"class":"debug_"+corner, "id":"debug_id_"+corner});
				d_target.style.position = u.bug_position ? u.bug_position : "absolute";
				d_target.style.zIndex = 16000;
				d_target.style.top = option[0];
				d_target.style.right = option[1];
				d_target.style.bottom = option[2];
				d_target.style.left = option[3];
				d_target.style.backgroundColor = u.bug_bg ? u.bug_bg : "#ffffff";
				d_target.style.color = "#000000";
				d_target.style.textAlign = "left";
				if(d_target.style.maxWidth) {
					d_target.style.maxWidth = u.bug_max_width ? u.bug_max_width+"px" : "auto";
				}
				d_target.style.padding = "3px";
			}
			if(typeof(message) != "string") {
				message = message.toString();
			}
			u.ae(u.qs("#debug_id_"+corner), "div", ({"style":"color: " + color})).innerHTML = message ? message.replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/&lt;br&gt;/g, "<br>") : "Util.bug with no message?";
		}
		if(typeof(console) == "object") {
			console.log(message);
		}
	}
}
Util.xInObject = function(object) {
	if(u.debugURL()) {
		var x, s = "--- start object ---<br>";
		for(x in object) {
			if(object[x] && typeof(object[x]) == "object" && typeof(object[x].nodeName) == "string") {
				s += x + "=" + object[x]+" -> " + u.nodeId(object[x], 1) + "<br>";
			}
			else if(object[x] && typeof(object[x]) == "function") {
				s += x + "=function<br>";
			}
			else {
				s += x + "=" + object[x]+"<br>";
			}
		}
		s += "--- end object ---"
		u.bug(s);
	}
}
Util.Animation = u.a = new function() {
	this.support3d = function() {
		if(this._support3d === undefined) {
			var node = document.createElement("div");
			try {
				var test = "translate3d(10px, 10px, 10px)";
				node.style[this.variant() + "Transform"] = test;
				if(node.style[this.variant() + "Transform"] == test) {
					this._support3d = true;
				}
				else {
					this._support3d = false;
				}
			}
			catch(exception) {
				this._support3d = false;
			}
		}
		return this._support3d;
	}
	this.variant = function() {
		if(this._variant === undefined) {
			if(document.body.style.webkitTransform != undefined) {
				this._variant = "webkit";
			}
			else if(document.body.style.MozTransform != undefined) {
				this._variant = "Moz";
			}
			else if(document.body.style.oTransform != undefined) {
				this._variant = "o";
			}
			else if(document.body.style.msTransform != undefined) {
				this._variant = "ms";
			}
			else {
				this._variant = "";
			}
		}
		return this._variant;
	}
	this.transition = function(node, transition) {
		try {		
			node.style[this.variant() + "Transition"] = transition;
			if(this.variant() == "Moz") {
				u.e.addEvent(node, "transitionend", this._transitioned);
			}
			else {
				u.e.addEvent(node, this.variant() + "TransitionEnd", this._transitioned);
			}
			var duration = transition.match(/[0-9.]+[ms]+/g);
			if(duration) {
				node.duration = duration[0].match("ms") ? parseFloat(duration[0]) : (parseFloat(duration[0]) * 1000);
			}
			else {
				node.duration = false;
				if(transition.match(/none/i)) {
					node.transitioned = null;
				}
			}
		}
		catch(exception) {
			u.bug("Exception ("+exception+") in u.a.transition(" + node + "), called from: "+arguments.callee.caller);
		}
	}
	this._transitioned = function(event) {
		if(event.target == this && typeof(this.transitioned) == "function") {
			this.transitioned(event);
		}
	}
	this.removeTransform = function(node) {
		node.style[this.variant() + "Transform"] = "none";
	}
	this.translate = function(node, x, y) {
		if(this.support3d()) {
			node.style[this.variant() + "Transform"] = "translate3d("+x+"px, "+y+"px, 0)";
		}
		else {
			node.style[this.variant() + "Transform"] = "translate("+x+"px, "+y+"px)";
		}
		node._x = x;
		node._y = y;
		node.offsetHeight;
	}
	this.rotate = function(node, deg) {
		node.style[this.variant() + "Transform"] = "rotate("+deg+"deg)";
		node._rotation = deg;
		node.offsetHeight;
	}
	this.scale = function(node, scale) {
		node.style[this.variant() + "Transform"] = "scale("+scale+")";
		node._scale = scale;
		node.offsetHeight;
	}
	this.setOpacity = function(node, opacity) {
		node.style.opacity = opacity;
		node._opacity = opacity;
		node.offsetHeight;
	}
	this.setWidth = function(node, width) {
		width = width.toString().match(/\%|auto|px/) ? width : (width + "px");
		node.style.width = width;
		node._width = width;
		node.offsetHeight;
	}
	this.setHeight = function(node, height) {
		height = height.toString().match(/\%|auto|px/) ? height : (height + "px");
		node.style.height = height;
		node._height = height;
		node.offsetHeight;
	}
	this.setBgPos = function(node, x, y) {
		x = x.toString().match(/\%|auto|px|center|top|left|bottom|right/) ? x : (x + "px");
		y = y.toString().match(/\%|auto|px|center|top|left|bottom|right/) ? y : (y + "px");
		node.style.backgroundPosition = x + " " + y;
		node._bg_x = x;
		node._bg_y = y;
		node.offsetHeight;
	}
	this.setBgColor = function(node, color) {
		node.style.backgroundColor = color;
		node._bg_color = color;
		node.offsetHeight;
	}
}
Util.saveCookie = function(name, value, options) {
	expiry = false;
	path = false;
	if(typeof(options) == "object") {
		var argument;
		for(argument in options) {
			switch(argument) {
				case "expiry"	: expiry	= (typeof(options[argument]) == "string" ? options[argument] : "Mon, 04-Apr-2020 05:00:00 GMT"); break;
				case "path"		: path		= options[argument]; break;
			}
		}
	}
	document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) +";" + (path ? "path="+path+";" : "") + (expiry ? "expires="+expiry+";" : "")
}
Util.getCookie = function(name) {
	var matches;
	return (matches = document.cookie.match(encodeURIComponent(name) + "=([^;]+)")) ? decodeURIComponent(matches[1]) : false;
}
Util.deleteCookie = function(name, options) {
	path = false;
	if(typeof(options) == "object") {
		var argument;
		for(argument in options) {
			switch(argument) {
				case "path"	: path	= options[argument]; break;
			}
		}
	}
	document.cookie = encodeURIComponent(name) + "=;" + (path ? "path="+path+";" : "") + "expires=Thu, 01-Jan-70 00:00:01 GMT";
}
Util.saveNodeCookie = function(node, name, value) {
	var ref = u.cookieReference(node);
	var mem = JSON.parse(u.getCookie("jes_mem"));
	if(!mem) {
		mem = {};
	}
	if(!mem[ref]) {
		mem[ref] = {};
	}
	mem[ref][name] = (value !== false && value !== undefined) ? value : "";
	u.saveCookie("jes_mem", JSON.stringify(mem), {"path":"/"});
}
Util.getNodeCookie = function(node, name) {
	var ref = u.cookieReference(node);
	var mem = JSON.parse(u.getCookie("jes_mem"));
	if(mem && mem[ref]) {
		if(name) {
			return mem[ref][name] ? mem[ref][name] : "";
		}
		else {
			return mem[ref];
		}
	}
	return false;
}
Util.deleteNodeCookie = function(node, name) {
	var ref = u.cookieReference(node);
	var mem = JSON.parse(u.getCookie("jes_mem"));
	if(mem && mem[ref]) {
		if(name) {
			delete mem[ref][name];
		}
		else {
			delete mem[ref];
		}
	}
	u.saveCookie("jes_mem", JSON.stringify(mem), {"path":"/"});
}
Util.cookieReference = function(node) {
	var ref;
	if(node.id) {
		ref = node.nodeName + "#" + node.id;
	}
	else {
		var id_node = node;
		while(!id_node.id) {
			id_node = id_node.parentNode;
		}
		if(id_node.id) {
			ref = id_node.nodeName + "#"+id_node.id + " " + (node.name ? (node.nodeName + "["+node.name+"]") : (node.className ? (node.nodeName+"."+node.className) : node.nodeName));
		}
	}
	return ref;
}
Util.date = function(format, timestamp, months) {
	var date = timestamp ? new Date(timestamp) : new Date();
	if(isNaN(date.getTime())) {
		if(!timestamp.match(/[A-Z]{3}\+[0-9]{4}/)) {
			if(timestamp.match(/ \+[0-9]{4}/)) {
				date = new Date(timestamp.replace(/ (\+[0-9]{4})/, " GMT$1"));
			}
		}
		if(isNaN(date.getTime())) {
			date = new Date();
		}
	}
	var tokens = /d|j|m|n|F|Y|G|H|i|s/g;
	var chars = new Object();
	chars.j = date.getDate();
	chars.d = (chars.j > 9 ? "" : "0") + chars.j;
	chars.n = date.getMonth()+1;
	chars.m = (chars.n > 9 ? "" : "0") + chars.n;
	chars.F = months ? months[date.getMonth()] : "";
	chars.Y = date.getFullYear();
	chars.G = date.getHours();
	chars.H = (chars.G > 9 ? "" : "0") + chars.G;
	var i = date.getMinutes();
	chars.i = (i > 9 ? "" : "0") + i;
	var s = date.getSeconds();
	chars.s = (s > 9 ? "" : "0") + s;
	return format.replace(tokens, function (_) {
		return _ in chars ? chars[_] : _.slice(1, _.length - 1);
	});
};
Util.querySelector = u.qs = function(query, scope) {
	scope = scope ? scope : document;
	return scope.querySelector(query);
}
Util.querySelectorAll = u.qsa = function(query, scope) {
	scope = scope ? scope : document;
	return scope.querySelectorAll(query);
}
Util.getElement = u.ge = function(identifier, scope) {
	var node, i, regexp;
	if(document.getElementById(identifier)) {
		return document.getElementById(identifier);
	}
	scope = scope ? scope : document;
	regexp = new RegExp("(^|\\s)" + identifier + "(\\s|$|\:)");
	for(i = 0; node = scope.getElementsByTagName("*")[i]; i++) {
		if(regexp.test(node.className)) {
			return node;
		}
	}
	return scope.getElementsByTagName(identifier).length ? scope.getElementsByTagName(identifier)[0] : false;
}
Util.getElements = u.ges = function(identifier, scope) {
	var node, i, regexp;
	var nodes = new Array();
	scope = scope ? scope : document;
	regexp = new RegExp("(^|\\s)" + identifier + "(\\s|$|\:)");
	for(i = 0; node = scope.getElementsByTagName("*")[i]; i++) {
		if(regexp.test(node.className)) {
			nodes.push(node);
		}
	}
	return nodes.length ? nodes : scope.getElementsByTagName(identifier);
}
Util.parentNode = u.pn = function(node, node_type) {
	if(node_type) {
		if(node.parentNode) {
			var parent = node.parentNode;
		}
		while(parent.nodeName.toLowerCase() != node_type.toLowerCase()) {
			if(parent.parentNode) {
				parent = parent.parentNode;
			}
			else {
				return false;
			}
		}
		return parent;
	}
	else {
		return node.parentNode;
	}
}
Util.previousSibling = u.ps = function(node, exclude) {
	node = node.previousSibling;
	while(node && (node.nodeType == 3 || node.nodeType == 8 || exclude && (u.hc(node, exclude) || node.nodeName.toLowerCase().match(exclude)))) {
		node = node.previousSibling;
	}
	return node;
}
Util.nextSibling = u.ns = function(node, exclude) {
	node = node.nextSibling;
	while(node && (node.nodeType == 3 || node.nodeType == 8 || exclude && (u.hc(node, exclude) || node.nodeName.toLowerCase().match(exclude)))) {
		node = node.nextSibling;
	}
	return node;
}
Util.childNodes = u.cn = function(node, exclude) {
	var i, child;
	var children = new Array();
	for(i = 0; child = node.childNodes[i]; i++) {
		if(child && child.nodeType != 3 && child.nodeType != 8 && (!exclude || (!u.hc(child, exclude) && !child.nodeName.toLowerCase().match(exclude) ))) {
			children.push(child);
		}
	}
	return children;
}
Util.appendElement = u.ae = function(parent, node_type, attributes) {
	try {
		var node = (typeof(node_type) == "object") ? node_type : document.createElement(node_type);
		node = parent.appendChild(node);
		if(attributes) {
			var attribute;
			for(attribute in attributes) {
				if(attribute == "html") {
					node.innerHTML = attributes[attribute]
				}
				else {
					node.setAttribute(attribute, attributes[attribute]);
				}
			}
		}
		return node;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.ae, called from: "+arguments.callee.caller.name);
		u.bug("node:" + u.nodeId(parent, 1));
		u.xInObject(attributes);
	}
	return false;
}
Util.insertElement = u.ie = function(parent, node_type, attributes) {
	try {
		var node = (typeof(node_type) == "object") ? node_type : document.createElement(node_type);
		node = parent.insertBefore(node, parent.firstChild);
		if(attributes) {
			var attribute;
			for(attribute in attributes) {
				if(attribute == "html") {
					node.innerHTML = attributes[attribute];
				}
				else {
					node.setAttribute(attribute, attributes[attribute]);
				}
			}
		}
		return node;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.ie, called from: "+arguments.callee.caller);
		u.bug("node:" + u.nodeId(parent, 1));
		u.xInObject(attributes);
	}
	return false;
}
Util.wrapElement = u.we = function(node, node_type, attributes) {
	try {
		var wrapper_node = node.parentNode.insertBefore(document.createElement(node_type), node);
		if(attributes) {
			var attribute;
			for(attribute in attributes) {
				wrapper_node.setAttribute(attribute, attributes[attribute]);
			}
		}	
		wrapper_node.appendChild(node);
		return wrapper_node;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.we, called from: "+arguments.callee.caller);
		u.bug("node:" + u.nodeId(node, 1));
		u.xInObject(attributes);
	}
	return false;
}
Util.textContent = u.text = function(node) {
	return node.textContent;
}
Util.clickableElement = u.ce = function(node) {
	var a = (node.nodeName.toLowerCase() == "a" ? node : u.qs("a", node));
	if(a) {
		u.ac(node, "link");
		if(a.getAttribute("href") !== null) {
			node.url = a.href;
			a.removeAttribute("href");
		}
	}
	if(typeof(u.e.click) == "function") {
		u.e.click(node);
	}
	return node;
}
u.link = u.ce;
Util.classVar = u.cv = function(node, var_name) {
	try {
		var regexp = new RegExp(var_name + ":[?=\\w/\\#~:.?+=?&%@!\\-]*");
		if(node.className.match(regexp)) {
			return node.className.match(regexp)[0].replace(var_name + ":", "");
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.cv, called from: "+arguments.callee.caller);
	}
	return false;
}
u.getIJ = u.cv;
Util.setClass = u.sc = function(node, classname) {
	try {
		var old_class = node.className;
		node.className = classname;
		node.offsetTop;
		return old_class;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.setClass, called from: "+arguments.callee.caller);
	}
	return false;
}
Util.hasClass = u.hc = function(node, classname) {
	try {
		if(classname) {
			var regexp = new RegExp("(^|\\s)(" + classname + ")(\\s|$)");
			if(regexp.test(node.className)) {
				return true;
			}
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.hasClass("+u.nodeId(node)+"), called from: "+arguments.callee.caller);
	}
	return false;
}
Util.addClass = u.ac = function(node, classname, dom_update) {
	try {
		if(classname) {
			var regexp = new RegExp("(^|\\s)" + classname + "(\\s|$)");
			if(!regexp.test(node.className)) {
				node.className += node.className ? " " + classname : classname;
				dom_update === false ? false : node.offsetTop;
			}
			return node.className;
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.addClass, called from: "+arguments.callee.caller);
	}
	return false;
}
Util.removeClass = u.rc = function(node, classname, dom_update) {
	try {
		if(classname) {
			var regexp = new RegExp("(\\b)" + classname + "(\\s|$)", "g");
			node.className = node.className.replace(regexp, " ").trim().replace(/[\s]{2}/g, " ");
			dom_update === false ? false : node.offsetTop;
			return node.className;
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.removeClass, called from: "+arguments.callee.caller);
	}
	return false;
}
Util.toggleClass = u.tc = function(node, classname, _classname, dom_update) {
	try {
		var regexp = new RegExp("(^|\\s)" + classname + "(\\s|$|\:)");
		if(regexp.test(node.className)) {
			u.rc(node, classname, false);
			if(_classname) {
				u.ac(node, _classname, false);
			}
		}
		else {
			u.ac(node, classname, false);
			if(_classname) {
				u.rc(node, _classname, false);
			}
		}
		dom_update === false ? false : node.offsetTop;
		return node.className;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.toggleClass, called from: "+arguments.callee.caller);
	}
	return false;
}
Util.applyStyle = u.as = function(node, property, value, dom_update) {
	try {
		node.style[property] = value;
		dom_update === false ? false : node.offsetTop;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.applyStyle("+u.nodeId(node)+", "+property+", "+value+") called from: "+arguments.callee.caller);
	}
}
Util.getComputedStyle = u.gcs = function(node, property) {
	node.offsetHeight;
	if(document.defaultView && document.defaultView.getComputedStyle) {
		return document.defaultView.getComputedStyle(node, null).getPropertyValue(property);
	}
	return false;
}
Util.hasFixedParent = u.hfp = function(node) {
	while(node.nodeName.toLowerCase() != "body") {
		if(u.gcs(node.parentNode, "position").match("fixed")) {
			return true;
		}
		node = node.parentNode;
	}
	return false;
}
Util.Events = u.e = new function() {
	this.event_pref = typeof(document.ontouchmove) == "undefined" ? "mouse" : "touch";
	this.kill = function(event) {
		if(event) {
			event.preventDefault();
			event.stopPropagation();
		}
	}
	this.addEvent = function(node, type, action) {
		try {
			node.addEventListener(type, action, false);
		}
		catch(exception) {
			alert("exception in addEvent:" + node + "," + type + ":" + exception);
		}
	}
	this.removeEvent = function(node, type, action) {
		try {
			node.removeEventListener(type, action, false);
		}
		catch(exception) {
			u.bug("exception in removeEvent:" + node + "," + type + ":" + exception);
		}
	}
	this.addStartEvent = this.addDownEvent = function(node, action) {
		u.e.addEvent(node, (this.event_pref == "touch" ? "touchstart" : "mousedown"), action);
	}
	this.removeStartEvent = this.removeDownEvent = function(node, action) {
		u.e.removeEvent(node, (this.event_pref == "touch" ? "touchstart" : "mousedown"), action);
	}
	this.addMoveEvent = function(node, action) {
		u.e.addEvent(node, (this.event_pref == "touch" ? "touchmove" : "mousemove"), action);
	}
	this.removeMoveEvent = function(node, action) {
		u.e.removeEvent(node, (this.event_pref == "touch" ? "touchmove" : "mousemove"), action);
	}
	this.addEndEvent = this.addUpEvent = function(node, action) {
		u.e.addEvent(node, (this.event_pref == "touch" ? "touchend" : "mouseup"), action);
		if(node.snapback && u.e.event_pref == "mouse") {
			u.e.addEvent(node, "mouseout", this._snapback);
		}
	}
	this.removeEndEvent = this.removeUpEvent = function(node, action) {
		u.e.removeEvent(node, (this.event_pref == "touch" ? "touchend" : "mouseup"), action);
		if(node.snapback && u.e.event_pref == "mouse") {
			u.e.removeEvent(node, "mouseout", this._snapback);
		}
	}
	this.resetClickEvents = function(node) {
		u.t.resetTimer(node.t_held);
		u.t.resetTimer(node.t_clicked);
		this.removeEvent(node, "mouseup", this._dblclicked);
		this.removeEvent(node, "touchend", this._dblclicked);
		this.removeEvent(node, "mousemove", this._clickCancel);
		this.removeEvent(node, "touchmove", this._clickCancel);
		this.removeEvent(node, "mousemove", this._move);
		this.removeEvent(node, "touchmove", this._move);
	}
	this.resetEvents = function(node) {
		this.resetClickEvents(node);
		if(typeof(this.resetDragEvents) == "function") {
			this.resetDragEvents(node);
		}
	}
	this.resetNestedEvents = function(node) {
		while(node && node.nodeName != "HTML") {
			this.resetEvents(node);
			node = node.parentNode;
		}
	}
	this._inputStart = function(event) {
		this.event_var = event;
		this.input_timestamp = event.timeStamp;
		this.start_event_x = u.eventX(event);
		this.start_event_y = u.eventY(event);
		this.current_xps = 0;
		this.current_yps = 0;
		this.swiped = false;
		if(this.e_click || this.e_dblclick || this.e_hold) {
			var node = this;
			while(node) {
				if(node.e_drag || node.e_swipe) {
					u.e.addMoveEvent(this, u.e._cancelClick);
					break;
				}
				else {
					node = node.parentNode;
				}
			}
			u.e.addMoveEvent(this, u.e._move);
			if(u.e.event_pref == "touch") {
				u.e.addMoveEvent(this, u.e._cancelClick);
			}
			u.e.addEndEvent(this, u.e._dblclicked);
			if(u.e.event_pref == "mouse") {
				u.e.addEvent(this, "mouseout", u.e._cancelClick);
			}
		}
		if(this.e_hold) {
			this.t_held = u.t.setTimer(this, u.e._held, 750);
		}
		if(this.e_drag || this.e_swipe) {
			u.e.addMoveEvent(this, u.e._pick);
			u.e.addEndEvent(this, u.e._drop);
		}
		if(this.e_scroll) {
			u.e.addMoveEvent(this, u.e._scrollStart);
			u.e.addEndEvent(this, u.e._scrollEnd);
		}
		if(typeof(this.inputStarted) == "function") {
			this.inputStarted(event);
		}
	}
	this._cancelClick = function(event) {
		u.e.resetClickEvents(this);
		if(typeof(this.clickCancelled) == "function") {
			this.clickCancelled(event);
		}
	}
	this._move = function(event) {
		if(typeof(this.moved) == "function") {
			this.moved(event);
		}
	}
	this.hold = function(node) {
		node.e_hold = true;
		u.e.addStartEvent(node, this._inputStart);
	}
	this._held = function(event) {
		u.stats.event(this, "held");
		u.e.resetNestedEvents(this);
		if(typeof(this.held) == "function") {
			this.held(event);
		}
	}
	this.click = this.tap = function(node) {
		node.e_click = true;
		u.e.addStartEvent(node, this._inputStart);
	}
	this._clicked = function(event) {
		u.stats.event(this, "clicked");
		u.e.resetNestedEvents(this);
		if(typeof(this.clicked) == "function") {
			this.clicked(event);
		}
	}
	this.dblclick = this.doubletap = function(node) {
		node.e_dblclick = true;
		u.e.addStartEvent(node, this._inputStart);
	}
	this._dblclicked = function(event) {
		if(u.t.valid(this.t_clicked) && event) {
			u.stats.event(this, "dblclicked");
			u.e.resetNestedEvents(this);
			if(typeof(this.dblclicked) == "function") {
				this.dblclicked(event);
			}
			return;
		}
		else if(!this.e_dblclick) {
			this._clicked = u.e._clicked;
			this._clicked(event);
		}
		else if(!event) {
			this._clicked = u.e._clicked;
			this._clicked(this.event_var);
		}
		else {
			u.e.resetNestedEvents(this);
			this.t_clicked = u.t.setTimer(this, u.e._dblclicked, 400);
		}
	}
}
u.e.addDOMReadyEvent = function(action) {
	if(document.readyState && document.addEventListener) {
		if((document.readyState == "interactive" && !u.browser("ie")) || document.readyState == "complete" || document.readyState == "loaded") {
			action();
		}
		else {
			var id = u.randomString();
			window["DOMReady_" + id] = action;
			eval('window["_DOMReady_' + id + '"] = function() {window["DOMReady_'+id+'"](); u.e.removeEvent(document, "DOMContentLoaded", window["_DOMReady_' + id + '"])}');
			u.e.addEvent(document, "DOMContentLoaded", window["_DOMReady_" + id]);
		}
	}
	else {
		u.e.addOnloadEvent(action);
	}
}
u.e.addOnloadEvent = function(action) {
	if(document.readyState && (document.readyState == "complete" || document.readyState == "loaded")) {
		action();
	}
	else {
		var id = u.randomString();
		window["Onload_" + id] = action;
		eval('window["_Onload_' + id + '"] = function() {window["Onload_'+id+'"](); u.e.removeEvent(window, "load", window["_Onload_' + id + '"])}');
		u.e.addEvent(window, "load", window["_Onload_" + id]);
	}
}
u.e.addResizeEvent = function(node, action) {
}
u.e.removeResizeEvent = function(node, action) {
}
u.e.addScrollEvent = function(node, action) {
}
u.e.removeScrollEvent = function(node, action) {
}
u.e.resetDragEvents = function(node) {
	this.removeEvent(node, "mousemove", this._pick);
	this.removeEvent(node, "touchmove", this._pick);
	this.removeEvent(node, "mousemove", this._drag);
	this.removeEvent(node, "touchmove", this._drag);
	this.removeEvent(node, "mouseup", this._drop);
	this.removeEvent(node, "touchend", this._drop);
	this.removeEvent(node, "mouseout", this._drop_mouse);
	this.removeEvent(node, "mousemove", this._scrollStart);
	this.removeEvent(node, "touchmove", this._scrollStart);
	this.removeEvent(node, "mousemove", this._scrolling);
	this.removeEvent(node, "touchmove", this._scrolling);
	this.removeEvent(node, "mouseup", this._scrollEnd);
	this.removeEvent(node, "touchend", this._scrollEnd);
}
u.e.overlap = function(node, boundaries, strict) {
	if(boundaries.constructor.toString().match("Array")) {
		var boundaries_start_x = Number(boundaries[0]);
		var boundaries_start_y = Number(boundaries[1]);
		var boundaries_end_x = Number(boundaries[2]);
		var boundaries_end_y = Number(boundaries[3]);
	}
	else if(boundaries.constructor.toString().match("HTML")) {
		var boundaries_start_x = u.absX(boundaries) - u.absX(node);
		var boundaries_start_y =  u.absY(boundaries) - u.absY(node);
		var boundaries_end_x = Number(boundaries_start_x + boundaries.offsetWidth);
		var boundaries_end_y = Number(boundaries_start_y + boundaries.offsetHeight);
	}
	var node_start_x = Number(node._x);
	var node_start_y = Number(node._y);
	var node_end_x = Number(node_start_x + node.offsetWidth);
	var node_end_y = Number(node_start_y + node.offsetHeight);
	if(strict) {
		if(node_start_x >= boundaries_start_x && node_start_y >= boundaries_start_y && node_end_x <= boundaries_end_x && node_end_y <= boundaries_end_y) {
			return true;
		}
		else {
			return false;
		}
	} 
	else if(node_end_x < boundaries_start_x || node_start_x > boundaries_end_x || node_end_y < boundaries_start_y || node_start_y > boundaries_end_y) {
		return false;
	}
	return true;
}
u.e.drag = function(node, boundaries, settings) {
	node.e_drag = true;
	if(node.childNodes.length < 2 && node.innerHTML.trim() == "") {
		node.innerHTML = "&nbsp;";
	}
	node.drag_strict = true;
	node.drag_elastica = 0;
	node.drag_dropout = true;
	node.show_bounds = false;
	node.callback_picked = "picked";
	node.callback_moved = "moved";
	node.callback_dropped = "dropped";
	if(typeof(settings) == "object") {
		var argument;
		for(argument in settings) {
			switch(argument) {
				case "strict"			: node.drag_strict			= settings[argument]; break;
				case "elastica"			: node.drag_elastica		= Number(settings[argument]); break;
				case "dropout"			: node.drag_dropout			= settings[argument]; break;
				case "show_bounds"		: node.show_bounds			= settings[argument]; break; 
				case "vertical_lock"	: node.vertical_lock		= settings[argument]; break;
				case "horizontal_lock"	: node.horizontal_lock		= settings[argument]; break;
				case "callback_picked"	: node.callback_picked		= settings[argument]; break;
				case "callback_moved"	: node.callback_moved		= settings[argument]; break;
				case "callback_dropped"	: node.callback_dropped		= settings[argument]; break;
			}
		}
	}
	if((boundaries.constructor && boundaries.constructor.toString().match("Array")) || (boundaries.scopeName && boundaries.scopeName != "HTML")) {
		node.start_drag_x = Number(boundaries[0]);
		node.start_drag_y = Number(boundaries[1]);
		node.end_drag_x = Number(boundaries[2]);
		node.end_drag_y = Number(boundaries[3]);
	}
	else if((boundaries.constructor && boundaries.constructor.toString().match("HTML")) || (boundaries.scopeName && boundaries.scopeName == "HTML")) {
		node.start_drag_x = u.absX(boundaries) - u.absX(node);
		node.start_drag_y = u.absY(boundaries) - u.absY(node);
		node.end_drag_x = node.start_drag_x + boundaries.offsetWidth;
		node.end_drag_y = node.start_drag_y + boundaries.offsetHeight;
	}
	if(node.show_bounds) {
		var debug_bounds = u.ae(document.body, "div", {"class":"debug_bounds"})
		debug_bounds.style.position = "absolute";
		debug_bounds.style.background = "red"
		debug_bounds.style.left = (u.absX(node) + node.start_drag_x - 1) + "px";
		debug_bounds.style.top = (u.absY(node) + node.start_drag_y - 1) + "px";
		debug_bounds.style.width = (node.end_drag_x - node.start_drag_x) + "px";
		debug_bounds.style.height = (node.end_drag_y - node.start_drag_y) + "px";
		debug_bounds.style.border = "1px solid white";
		debug_bounds.style.zIndex = 9999;
		debug_bounds.style.opacity = .5;
		if(document.readyState && document.readyState == "interactive") {
			debug_bounds.innerHTML = "WARNING - injected on DOMLoaded"; 
		}
		u.bug("node: "+u.nodeId(node)+" in (" + u.absX(node) + "," + u.absY(node) + "), (" + (u.absX(node)+node.offsetWidth) + "," + (u.absY(node)+node.offsetHeight) +")");
		u.bug("boundaries: (" + node.start_drag_x + "," + node.start_drag_y + "), (" + node.end_drag_x + ", " + node.end_drag_y + ")");
	}
	node._x = node._x ? node._x : 0;
	node._y = node._y ? node._y : 0;
	node.locked = ((node.end_drag_x - node.start_drag_x == node.offsetWidth) && (node.end_drag_y - node.start_drag_y == node.offsetHeight));
	node.only_vertical = (node.vertical_lock || (!node.locked && node.end_drag_x - node.start_drag_x == node.offsetWidth));
	node.only_horizontal = (node.horizontal_lock || (!node.locked && node.end_drag_y - node.start_drag_y == node.offsetHeight));
	u.e.addStartEvent(node, this._inputStart);
}
u.e._pick = function(event) {
	var init_speed_x = Math.abs(this.start_event_x - u.eventX(event));
	var init_speed_y = Math.abs(this.start_event_y - u.eventY(event));
	if((init_speed_x > init_speed_y && this.only_horizontal) || 
	   (init_speed_x < init_speed_y && this.only_vertical) ||
	   (!this.only_vertical && !this.only_horizontal)) {
		u.e.resetNestedEvents(this);
	    u.e.kill(event);
		this.move_timestamp = event.timeStamp;
		this.move_last_x = this._x;
		this.move_last_y = this._y;
		if(u.hasFixedParent(this)) {
			this.start_input_x = u.eventX(event) - this._x - u.scrollX(); 
			this.start_input_y = u.eventY(event) - this._y - u.scrollY();
		}
		else {
			this.start_input_x = u.eventX(event) - this._x; 
			this.start_input_y = u.eventY(event) - this._y;
		}
		this.current_xps = 0;
		this.current_yps = 0;
		u.a.transition(this, "none");
		u.e.addMoveEvent(this, u.e._drag);
		u.e.addEndEvent(this, u.e._drop);
		if(typeof(this[this.callback_picked]) == "function") {
			this[this.callback_picked](event);
		}
	}
	if(this.drag_dropout && u.e.event_pref == "mouse") {
		u.e.addEvent(this, "mouseout", u.e._drop_mouse);
	}
}
u.e._drag = function(event) {
	if(u.hasFixedParent(this)) {
		this.current_x = u.eventX(event) - this.start_input_x - u.scrollX();
		this.current_y = u.eventY(event) - this.start_input_y - u.scrollY();
	}
	else {
		this.current_x = u.eventX(event) - this.start_input_x;
		this.current_y = u.eventY(event) - this.start_input_y;
	}
	this.current_xps = Math.round(((this.current_x - this.move_last_x) / (event.timeStamp - this.move_timestamp)) * 1000);
	this.current_yps = Math.round(((this.current_y - this.move_last_y) / (event.timeStamp - this.move_timestamp)) * 1000);
	this.move_timestamp = event.timeStamp;
	this.move_last_x = this.current_x;
	this.move_last_y = this.current_y;
	if(!this.locked && this.only_vertical) {
		this._y = this.current_y;
	}
	else if(!this.locked && this.only_horizontal) {
		this._x = this.current_x;
	}
	else if(!this.locked) {
		this._x = this.current_x;
		this._y = this.current_y;
	}
	if(this.e_swipe) {
		if(this.current_xps && (Math.abs(this.current_xps) > Math.abs(this.current_yps) || this.only_horizontal)) {
			if(this.current_xps < 0) {
				this.swiped = "left";
			}
			else {
				this.swiped = "right";
			}
		}
		else if(this.current_yps && (Math.abs(this.current_xps) < Math.abs(this.current_yps) || this.only_vertical)) {
			if(this.current_yps < 0) {
				this.swiped = "up";
			}
			else {
				this.swiped = "down";
			}
		}
	}
	if(!this.locked) {
		if(u.e.overlap(this, [this.start_drag_x, this.start_drag_y, this.end_drag_x, this.end_drag_y], true)) {
			u.a.translate(this, this._x, this._y);
		}
		else if(this.drag_elastica) {
			this.swiped = false;
			this.current_xps = 0;
			this.current_yps = 0;
			var offset = false;
			if(!this.only_vertical && this._x < this.start_drag_x) {
				offset = this._x < this.start_drag_x - this.drag_elastica ? - this.drag_elastica : this._x - this.start_drag_x;
				this._x = this.start_drag_x;
				this.current_x = this._x + offset + (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else if(!this.only_vertical && this._x + this.offsetWidth > this.end_drag_x) {
				offset = this._x + this.offsetWidth > this.end_drag_x + this.drag_elastica ? this.drag_elastica : this._x + this.offsetWidth - this.end_drag_x;
				this._x = this.end_drag_x - this.offsetWidth;
				this.current_x = this._x + offset - (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else {
				this.current_x = this._x;
			}
			if(!this.only_horizontal && this._y < this.start_drag_y) {
				offset = this._y < this.start_drag_y - this.drag_elastica ? - this.drag_elastica : this._y - this.start_drag_y;
				this._y = this.start_drag_y;
				this.current_y = this._y + offset + (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else if(!this.horizontal && this._y + this.offsetHeight > this.end_drag_y) {
				offset = (this._y + this.offsetHeight > this.end_drag_y + this.drag_elastica) ? this.drag_elastica : (this._y + this.offsetHeight - this.end_drag_y);
				this._y = this.end_drag_y - this.offsetHeight;
				this.current_y = this._y + offset - (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else {
				this.current_y = this._y;
			}
			if(offset) {
				u.a.translate(this, this.current_x, this.current_y);
			}
		}
		else {
			this.swiped = false;
			this.current_xps = 0;
			this.current_yps = 0;
			if(this._x < this.start_drag_x) {
				this._x = this.start_drag_x;
			}
			else if(this._x + this.offsetWidth > this.end_drag_x) {
				this._x = this.end_drag_x - this.offsetWidth;
			}
			if(this._y < this.start_drag_y) {
				this._y = this.start_drag_y;
			}
			else if(this._y + this.offsetHeight > this.end_drag_y) { 
				this._y = this.end_drag_y - this.offsetHeight;
			}
			u.a.translate(this, this._x, this._y);
		}
	}
	if(typeof(this[this.callback_moved]) == "function") {
		this[this.callback_moved](event);
	}
}
u.e._drop = function(event) {
	u.e.resetEvents(this);
	if(this.e_swipe && this.swiped) {
		if(this.swiped == "left" && typeof(this.swipedLeft) == "function") {
			this.swipedLeft(event);
		}
		else if(this.swiped == "right" && typeof(this.swipedRight) == "function") {
			this.swipedRight(event);
		}
		else if(this.swiped == "down" && typeof(this.swipedDown) == "function") {
			this.swipedDown(event);
		}
		else if(this.swiped == "up" && typeof(this.swipedUp) == "function") {
			this.swipedUp(event);
		}
	}
	else if(!this.drag_strict && !this.locked) {
		this.current_x = Math.round(this._x + (this.current_xps/2));
		this.current_y = Math.round(this._y + (this.current_yps/2));
		if(this.only_vertical || this.current_x < this.start_drag_x) {
			this.current_x = this.start_drag_x;
		}
		else if(this.current_x + this.offsetWidth > this.end_drag_x) {
			this.current_x = this.end_drag_x - this.offsetWidth;
		}
		if(this.only_horizontal || this.current_y < this.start_drag_y) {
			this.current_y = this.start_drag_y;
		}
		else if(this.current_y + this.offsetHeight > this.end_drag_y) {
			this.current_y = this.end_drag_y - this.offsetHeight;
		}
		this.transitioned = function() {
			this.transitioned = null;
			u.a.transition(this, "none");
			if(typeof(this.projected) == "function") {
				this.projected(event);
			}
		}
		if(this.current_xps || this.current_yps) {
			u.a.transition(this, "all 1s cubic-bezier(0,0,0.25,1)");
		}
		else {
			u.a.transition(this, "all 0.2s cubic-bezier(0,0,0.25,1)");
		}
		u.a.translate(this, this.current_x, this.current_y);
	}
	if(typeof(this[this.callback_dropped]) == "function") {
		this[this.callback_dropped](event);
	}
}
u.e._drop_mouse = function(event) {
	if(event.target == this) {
		this._drop = u.e._drop;
		this._drop(event);
	}
}
u.e.swipe = function(node, boundaries, settings) {
	node.e_swipe = true;
	u.e.drag(node, boundaries, settings);
}
u.e.scroll = function(e) {
	e.e_scroll = true;
	e._x = e._x ? e._x : 0;
	e._y = e._y ? e._y : 0;
	u.e.addStartEvent(e, this._inputStart);
}
u.e._scrollStart = function(event) {
	u.e.resetNestedEvents(this);
	this.move_timestamp = new Date().getTime();
	this.current_xps = 0;
	this.current_yps = 0;
	this.start_input_x = u.eventX(event) - this._x;
	this.start_input_y = u.eventY(event) - this._y;
	u.a.transition(this, "none");
	if(typeof(this.picked) == "function") {
		this.picked(event);
	}
	u.e.addMoveEvent(this, u.e._scrolling);
	u.e.addEndEvent(this, u.e._scrollEnd);
}
u.e._scrolling = function(event) {
	this.new_move_timestamp = new Date().getTime();
	this.current_x = u.eventX(event) - this.start_input_x;
	this.current_y = u.eventY(event) - this.start_input_y;
	this.current_xps = Math.round(((this.current_x - this._x) / (this.new_move_timestamp - this.move_timestamp)) * 1000);
	this.current_yps = Math.round(((this.current_y - this._y) / (this.new_move_timestamp - this.move_timestamp)) * 1000);
	this.move_timestamp = this.new_move_timestamp;
	if(u.scrollY() > 0 && -(this.current_y) + u.scrollY() > 0) {
		u.e.kill(event);
		window.scrollTo(0, -(this.current_y) + u.scrollY());
	}
	if(typeof(this.moved) == "function") {
		this.moved(event);
	}
}
u.e._scrollEnd = function(event) {
	u.e.resetEvents(this);
	if(typeof(this.dropped) == "function") {
		this.dropped(event);
	}
}
u.e.beforeScroll = function(node) {
	node.e_beforescroll = true;
	u.e.addStartEvent(node, this._inputStartDrag);
}
u.e._inputStartDrag = function() {
	u.e.addMoveEvent(this, u.e._beforeScroll);
}
u.e._beforeScroll = function(event) {
	u.e.removeMoveEvent(this, u.e._beforeScroll);
	if(typeof(this.picked) == "function") {
		this.picked(event);
	}
}
Util.flashDetection = function(version) {
	var flash_version = false;
	var flash = false;
	if(navigator.plugins && navigator.plugins["Shockwave Flash"] && navigator.plugins["Shockwave Flash"].description && navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"]) {
		flash = true;
		var Pversion = navigator.plugins["Shockwave Flash"].description.match(/\b([\d]+)\b/);
		if(Pversion.length > 1 && !isNaN(Pversion[1])) {
			flash_version = Pversion[1];
		}
	}
	else if(window.ActiveXObject) {
		try {
			var AXflash, AXversion;
			AXflash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			if(AXflash) {
				flash = true;
				AXversion = AXflash.GetVariable("$version").match(/\b([\d]+)\b/);
				if(AXversion.length > 1 && !isNaN(AXversion[1])) {
					flash_version = AXversion[1];
				}
			}
		}
		catch(exception) {}
	}
	if(flash_version || (flash && !version)) {
		if(!version) {
			return true;
		}
		else {
			if(!isNaN(version)) {
				return flash_version == version;
			}
			else {
				return eval(flash_version + version);
			}
		}
	}
	else {
		return false;
	}
}
Util.flash = function(node, url, settings) {
	var width = "100%";
	var height = "100%";
	var background = "transparent";
	var id = "flash_" + new Date().getHours() + "_" + new Date().getMinutes() + "_" + new Date().getMilliseconds();
	var allowScriptAccess = "always";
	var menu = "false";
	var scale = "showall";
	var wmode = "transparent";
	if(typeof(settings) == "object") {
		var argument;
		for(argument in settings) {
			switch(argument) {
				case "id"					: id				= settings[argument]; break;
				case "width"				: width				= Number(settings[argument]); break;
				case "height"				: height			= Number(settings[argument]); break;
				case "background"			: background		= settings[argument]; break;
				case "allowScriptAccess"	: allowScriptAccess = settings[argument]; break;
				case "menu"					: menu				= settings[argument]; break;
				case "scale"				: scale				= settings[argument]; break;
				case "wmode"				: wmode				= settings[argument]; break;
			}
		}
	}
	html = '<object';
	html += ' id="'+id+'"';
	html += ' width="'+width+'"';
	html += ' height="'+height+'"';
	if(u.browser("explorer")) {
		html += ' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"';
	}
	else {
		html += ' type="application/x-shockwave-flash"';
		html += ' data="'+url+'"';
	}
	html += '>';
	html += '<param name="allowScriptAccess" value="'+allowScriptAccess+'" />';
	html += '<param name="movie" value="'+url+'" />';
	html += '<param name="quality" value="high" />';
	html += '<param name="bgcolor" value="'+background+'" />';
	html += '<param name="play" value="true" />';
	html += '<param name="wmode" value="'+wmode+'" />';
	html += '<param name="menu" value="'+menu+'" />';
	html += '<param name="scale" value="'+scale+'" />';
	html += '</object>';
	var temp_node = document.createElement("div");
	temp_node.innerHTML = html;
	node.insertBefore(temp_node.firstChild, node.firstChild);
	var flash_object = u.qs("#"+id, node);
	return flash_object;
}
Util.Form = u.f = new function() {
	this.customInit = {};
	this.customValidate = {};
	this.customSend = {};
	this.init = function(form, settings) {
		var i, j, field, action, input;
		form.form_send = "params";
		form.ignore_inputs = "ignoreinput";
		if(typeof(settings) == "object") {
			var argument;
			for(argument in settings) {
				switch(argument) {
					case "ignore_inputs"	: form.ignore_inputs	= settings[argument]; break;
					case "form_send"		: form.form_send		= settings[argument]; break;
				}
			}
		}
		form.onsubmit = function(event) {return false;}
		form.setAttribute("novalidate", "novalidate");
		form._submit = this._submit;
		form.fields = {};
		form.tab_order = [];
		form.actions = {};
		var fields = u.qsa(".field", form);
		for(i = 0; field = fields[i]; i++) {
			var abbr = u.qs("abbr", field);
			if(abbr) {
				abbr.parentNode.removeChild(abbr);
			}
			var error_message = field.getAttribute("data-error");
			if(error_message) {
				u.ae(field, "div", {"class":"error", "html":error_message})
			}
			field._indicator = u.ae(field, "div", {"class":"indicator"});
			field._label = u.qs("label", field);
			field._hint = u.qs(".hint", field);
			field._error = u.qs(".error", field);
			var not_initialized = true;
			var custom_init;
			for(custom_init in this.customInit) {
				if(field.className.match(custom_init)) {
					this.customInit[custom_init](field);
					not_initialized = false;
				}
			}
			if(not_initialized) {
				if(u.hc(field, "string|email|tel|number|integer|password")) {
					field._input = u.qs("input", field);
					field._input.field = field;
					this.formIndex(form, field._input);
				}
				else if(u.hc(field, "text")) {
					field._input = u.qs("textarea", field);
					field._input.field = field;
					this.formIndex(form, field._input);
				}
				else if(u.hc(field, "select")) {
					field._input = u.qs("select", field);
					field._input.field = field;
					this.formIndex(form, field._input);
				}
				else if(u.hc(field, "checkbox|boolean")) {
					field._input = u.qs("input[type=checkbox]", field);
					field._input.field = field;
					this.formIndex(form, field._input);
				}
				else if(u.hc(field, "radio|radio_buttons")) {
					field._input = u.qsa("input", field);
					for(j = 0; input = field._input[j]; j++) {
						input.field = field;
						this.formIndex(form, input);
					}
				}
				else if(u.hc(field, "date|datetime")) {
					field._input = u.qsa("select,input", field);
					for(j = 0; input = field._input[j]; j++) {
						input.field = field;
						this.formIndex(form, input);
					}
				}
				else if(u.hc(field, "tags")) {
					field._input = u.qs("input", field);
					field._input.field = field;
					this.formIndex(form, field._input);
				}
				else if(u.hc(field, "prices")) {
					field._input = u.qs("input", field);
					field._input.field = field;
					this.formIndex(form, field._input);
				}
				else if(u.hc(field, "files")) {
					field._input = u.qs("input", field);
					field._input.field = field;
					this.formIndex(form, field._input);
				}
			}
		}
		var hidden_fields = u.qsa("input[type=hidden]", form);
		for(i = 0; hidden_field = hidden_fields[i]; i++) {
			if(!form.fields[hidden_field.name]) {
				form.fields[hidden_field.name] = hidden_field;
				hidden_field.val = this._value;
			}
		}
		var actions = u.qsa(".actions li", form);
		for(i = 0; action = actions[i]; i++) {
			action._input = u.qs("input,a", action);
			if(action._input.type && action._input.type == "submit") {
				action._input.onclick = function(event) {
					u.e.kill(event ? event : window.event);
				}
			}
			u.ce(action._input);
			action._input.clicked = function(event) {
				u.e.kill(event);
				if(!u.hc(this, "disabled")) {
					if(this.type && this.type.match(/submit/i)) {
						this.form._submit_button = this;
						this.form._submit_input = false;
						this.form._submit(event, this);
					}
				}
			}
			this.buttonOnEnter(action._input);
			this.activateButton(action._input);
			var action_name = action._input.name ? action._input.name : action.className;
				form.actions[action_name] = action._input;
			if(typeof(u.k) == "object" && u.hc(action._input, "key:[a-z0-9]+")) {
				u.k.addKey(u.cv(action._input, "key"), action._input);
			}
		}
	}
	this._value = function(value) {
		if(value !== undefined) {
			this.value = value;
			u.f.validate(this);
		}
		return this.value;
	}
	this._value_radio = function(value) {
		if(value) {
			for(i = 0; option = this.form[this.name][i]; i++) {
				if(option.value == value) {
					option.checked = true;
					u.f.validate(this);
				}
			}
		}
		else {
			var i, option;
			for(i = 0; option = this.form[this.name][i]; i++) {
				if(option.checked) {
					return option.value;
				}
			}
		}
		return false;
	}
	this._value_checkbox = function(value) {
		if(value) {
			this.checked = true
			u.f.validate(this);
		}
		else {
			if(this.checked) {
				return this.value;
			}
		}
		return false;
	}
	this._value_select = function(value) {
		if(value !== undefined) {
			var i, option;
			for(i = 0; option = this.options[i]; i++) {
				if(option.value == value) {
					this.selectedIndex = i;
					u.f.validate(this);
					return i;
				}
			}
			return false;
		}
		else {
			return this.options[this.selectedIndex].value;
		}
	}
	this.inputOnEnter = function(node) {
		node.keyPressed = function(event) {
			if(this.nodeName.match(/input/i) && (event.keyCode == 40 || event.keyCode == 38)) {
				this._submit_disabled = true;
			}
			else if(this.nodeName.match(/input/i) && this._submit_disabled && (
				event.keyCode == 46 || 
				(event.keyCode == 39 && u.browser("firefox")) || 
				(event.keyCode == 37 && u.browser("firefox")) || 
				event.keyCode == 27 || 
				event.keyCode == 13 || 
				event.keyCode == 9 ||
				event.keyCode == 8
			)) {
				this._submit_disabled = false;
			}
			else if(event.keyCode == 13 && !this._submit_disabled) {
				u.e.kill(event);
				this.form.submitInput = this;
				this.form.submitButton = false;
				this.form._submit(event, this);
			}
		}
		u.e.addEvent(node, "keydown", node.keyPressed);
	}
	this.buttonOnEnter = function(node) {
		node.keyPressed = function(event) {
			if(event.keyCode == 13 && !u.hc(this, "disabled")) {
				u.e.kill(event);
				this.form.submit_input = false;
				this.form.submit_button = this;
				this.form._submit(event);
			}
		}
		u.e.addEvent(node, "keydown", node.keyPressed);
	}
	this.formIndex = function(form, iN) {
		iN.tab_index = form.tab_order.length;
		form.tab_order[iN.tab_index] = iN;
		if(iN.field && iN.name) {
			form.fields[iN.name] = iN;
			if(iN.nodeName.match(/input/i) && iN.type && iN.type.match(/text|email|tel|number|password|datetime|date/)) {
				iN.val = this._value;
				u.e.addEvent(iN, "keyup", this._updated);
				u.e.addEvent(iN, "change", this._changed);
				this.inputOnEnter(iN);
			}
			else if(iN.nodeName.match(/textarea/i)) {
				iN.val = this._value;
				u.e.addEvent(iN, "keyup", this._updated);
				u.e.addEvent(iN, "change", this._changed);
				if(u.hc(iN.field, "autoexpand")) {
					var current_height = parseInt(u.gcs(iN, "height"));
					u.bug(current_height + "," + iN.scrollHeight);
					var current_value = iN.val();
					iN.val("");
					u.bug(current_height + "," + iN.scrollHeight);
					u.as(iN, "overflow", "hidden");
					u.bug(current_height + "," + iN.scrollHeight);
					iN.autoexpand_offset = 0;
					if(parseInt(u.gcs(iN, "height")) != iN.scrollHeight) {
						iN.autoexpand_offset = iN.scrollHeight - parseInt(u.gcs(iN, "height"));
					}
					iN.val(current_value);
					iN.setHeight = function() {
						var textarea_height = parseInt(u.gcs(this, "height"));
						if(this.val()) {
							if(u.browser("webkit")) {
								if(this.scrollHeight - this.autoexpand_offset > textarea_height) {
									u.a.setHeight(this, this.scrollHeight);
								}
							}
							else if(u.browser("opera") || u.browser("explorer")) {
								if(this.scrollHeight > textarea_height) {
									u.a.setHeight(this, this.scrollHeight);
								}
							}
							else {
								u.a.setHeight(this, this.scrollHeight);
							}
						}
					}
					u.e.addEvent(iN, "keyup", iN.setHeight);
					iN.setHeight();
				}
			}
			else if(iN.nodeName.match(/select/i)) {
				iN.val = this._value_select;
				u.e.addEvent(iN, "change", this._updated);
				u.e.addEvent(iN, "keyup", this._updated);
				u.e.addEvent(iN, "change", this._changed);
			}
			else if(iN.type && iN.type.match(/checkbox/)) {
				iN.val = this._value_checkbox;
				if(u.browser("explorer", "<=8")) {
					iN.pre_state = iN.checked;
					iN._changed = u.f._changed;
					iN._updated = u.f._updated;
					iN._clicked = function(event) {
						if(this.checked != this.pre_state) {
							this._changed(window.event);
							this._updated(window.event);
						}
						this.pre_state = this.checked;
					}
					u.e.addEvent(iN, "click", iN._clicked);
				}
				else {
					u.e.addEvent(iN, "change", this._updated);
					u.e.addEvent(iN, "change", this._changed);
				}
				this.inputOnEnter(iN);
			}
			else if(iN.type && iN.type.match(/radio/)) {
				iN.val = this._value_radio;
				if(u.browser("explorer", "<=8")) {
					iN.pre_state = iN.checked;
					iN._changed = u.f._changed;
					iN._updated = u.f._updated;
					iN._clicked = function(event) {
						var i, input;
						if(this.checked != this.pre_state) {
							this._changed(window.event);
							this._updated(window.event);
						}
						for(i = 0; input = this.field._input[i]; i++) {
							input.pre_state = input.checked;
						}
					}
					u.e.addEvent(iN, "click", iN._clicked);
				}
				else {
					u.e.addEvent(iN, "change", this._updated);
					u.e.addEvent(iN, "change", this._changed);
				}
				this.inputOnEnter(iN);
			}
			else if(iN.type && iN.type.match(/file/)) {
				iN.val = function(value) {
					if(value !== undefined) {
						alert('adding values manually to input type="file" is not supported')
					}
					else {
						var i, file, files = [];
						for(i = 0; file = this.files[i]; i++) {
							files.push(file);
						}
						return files.join(",");
					}
				}
				u.e.addEvent(iN, "keyup", this._updated);
				u.e.addEvent(iN, "change", this._changed);
			}
			this.activateField(iN);
			this.validate(iN);
		}
	}
	this._changed = function(event) {
		this.used = true;
		if(typeof(this.changed) == "function") {
			this.changed(this);
		}
		if(typeof(this.form.changed) == "function") {
			this.form.changed(this);
		}
	}
	this._updated = function(event) {
		if(event.keyCode != 9 && event.keyCode != 13 && event.keyCode != 16 && event.keyCode != 17 && event.keyCode != 18) {
			if(this.used || u.hc(this.field, "error")) {
				u.f.validate(this);
			}
			if(typeof(this.updated) == "function") {
				this.updated(this);
			}
			if(typeof(this.form.updated) == "function") {
				this.form.updated(this);
			}
		}
	}
	this._validate = function() {
		u.f.validate(this);
	}
	this._submit = function(event, iN) {
		for(name in this.fields) {
			if(this.fields[name].field) {
				this.fields[name].used = true;
				u.f.validate(this.fields[name]);
			}
		}
		if(u.qs(".field.error", this)) {
			if(typeof(this.validationFailed) == "function") {
				this.validationFailed();
			}
		}
		else {
			if(typeof(this.submitted) == "function") {
				this.submitted(iN);
			}
			else {
				this.submit();
			}
		}
	}
	this._focus = function(event) {
		this.field.focused = true;
		u.ac(this.field, "focus");
		u.ac(this, "focus");
		if(typeof(this.focused) == "function") {
			this.focused();
		}
		if(typeof(this.form.focused) == "function") {
			this.form.focused(this);
		}
	}
	this._blur = function(event) {
		this.field.focused = false;
		u.rc(this.field, "focus");
		u.rc(this, "focus");
		this.used = true;
		if(typeof(this.blurred) == "function") {
			this.blurred();
		}
		if(typeof(this.form.blurred) == "function") {
			this.form.blurred(this);
		}
	}
	this._button_focus = function(event) {
		u.ac(this, "focus");
		if(typeof(this.focused) == "function") {
			this.focused();
		}
		if(typeof(this.form.focused) == "function") {
			this.form.focused(this);
		}
	}
	this._button_blur = function(event) {
		u.rc(this, "focus");
		if(typeof(this.blurred) == "function") {
			this.blurred();
		}
		if(typeof(this.form.blurred) == "function") {
			this.form.blurred(this);
		}
	}
	this._default_value_focus = function() {
		u.rc(this, "default");
		if(this.val() == this.default_value) {
			this.val("");
		}
	}
	this._default_value_blur = function() {
		if(this.val() == "") {
			u.ac(this, "default");
			this.val(this.default_value);
		}
	}
	this.activateField = function(iN) {
		u.e.addEvent(iN, "focus", this._focus);
		u.e.addEvent(iN, "blur", this._blur);
		u.e.addEvent(iN, "blur", this._validate);
		if(iN.form.labelstyle || u.hc(iN.form, "labelstyle:[a-z]+")) {
			iN.form.labelstyle = iN.form.labelstyle ? iN.form.labelstyle : u.cv(iN.form, "labelstyle");
			if(iN.form.labelstyle == "inject" && (!iN.type || !iN.type.match(/file|radio|checkbox/))) {
				iN.default_value = iN.field._label.innerHTML;
				u.e.addEvent(iN, "focus", this._default_value_focus);
				u.e.addEvent(iN, "blur", this._default_value_blur);
				if(iN.val() == "") {
					iN.val(iN.default_value);
					u.ac(iN, "default");
				}
			}
		}
	}
	this.activateButton = function(button) {
		u.e.addEvent(button, "focus", this._button_focus);
		u.e.addEvent(button, "blur", this._button_blur);
	}
 	this.isDefault = function(iN) {
		if(iN.default_value && iN.val() == iN.default_value) {
			return true;
		}
		return false;
	}
	this.fieldError = function(iN) {
		u.rc(iN, "correct");
		u.rc(iN.field, "correct");
		if(iN.used || !this.isDefault(iN) && iN.val()) {
			u.ac(iN, "error");
			u.ac(iN.field, "error");
			if(typeof(iN.validationFailed) == "function") {
				iN.validationFailed();
			}
		}
	}
	this.fieldCorrect = function(iN) {
		if(!this.isDefault(iN) && iN.val()) {
			u.ac(iN, "correct");
			u.ac(iN.field, "correct");
			u.rc(iN, "error");
			u.rc(iN.field, "error");
		}
		else {
			u.rc(iN, "correct");
			u.rc(iN.field, "correct");
			u.rc(iN, "error");
			u.rc(iN.field, "error");
		}
	}
	this.validate = function(iN) {
		var min, max, pattern;
		var not_validated = true;
		if(!u.hc(iN.field, "required") && (iN.val() == "" || this.isDefault(iN))) {
			this.fieldCorrect(iN);
			return true;
		}
		else if(u.hc(iN.field, "required") && (iN.val() == "" || this.isDefault(iN))) {
			this.fieldError(iN);
			return false;
		}
		var custom_validate;
		for(custom_validate in u.f.customValidate) {
			if(u.hc(iN.field, custom_validate)) {
				u.f.customValidate[custom_validate](iN);
				not_validated = false;
			}
		}
		if(not_validated) {
			if(u.hc(iN.field, "password")) {
				min = Number(u.cv(iN.field, "min"));
				max = Number(u.cv(iN.field, "max"));
				min = min ? min : 8;
				max = max ? max : 20;
				pattern = iN.getAttribute("pattern");
				if(
					iN.val().length >= min && 
					iN.val().length <= max && 
					(!pattern || iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "number")) {
				min = Number(u.cv(iN.field, "min"));
				max = Number(u.cv(iN.field, "max"));
				min = min ? min : 0;
				max = max ? max : 99999999999999999999999999999;
				pattern = iN.getAttribute("pattern");
				if(
					!isNaN(iN.val()) && 
					iN.val() >= min && 
					iN.val() <= max && 
					(!pattern || iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "integer")) {
				min = Number(u.cv(iN.field, "min"));
				max = Number(u.cv(iN.field, "max"));
				min = min ? min : 0;
				max = max ? max : 99999999999999999999999999999;
				pattern = iN.getAttribute("pattern");
				if(
					!isNaN(iN.val()) && 
					Math.round(iN.val()) == iN.val() && 
					iN.val() >= min && 
					iN.val() <= max && 
					(!pattern || iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "tel")) {
				pattern = iN.getAttribute("pattern");
				if(
					!pattern && iN.val().match(/^([\+0-9\-\.\s\(\)]){5,18}$/) ||
					(pattern && iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "email")) {
				if(
					!pattern && iN.val().match(/^([^<>\\\/%$])+\@([^<>\\\/%$])+\.([^<>\\\/%$]{2,20})$/) ||
					(pattern && iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "text")) {
				min = Number(u.cv(iN.field, "min"));
				max = Number(u.cv(iN.field, "max"));
				min = min ? min : 1;
				max = max ? max : 10000000;
				pattern = iN.getAttribute("pattern");
				if(
					iN.val().length >= min && 
					iN.val().length <= max && 
					(!pattern || iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "select")) {
				if(iN.val()) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "checkbox|boolean|radio|radio_buttons")) {
				if(iN.val()) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "string")) {
				min = Number(u.cv(iN.field, "min"));
				max = Number(u.cv(iN.field, "max"));
				min = min ? min : 1;
				max = max ? max : 255;
				pattern = iN.getAttribute("pattern");
				if(
					iN.val().length >= min &&
					iN.val().length <= max && 
					(!pattern || iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "date")) {
				pattern = iN.getAttribute("pattern");
				if(
					!pattern && iN.val().match(/^([\d]{4}[\-\/\ ]{1}[\d]{2}[\-\/\ ][\d]{2})$/) ||
					(pattern && iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "datetime")) {
				pattern = iN.getAttribute("pattern");
				if(
					!pattern && iN.val().match(/^([\d]{4}[\-\/\ ]{1}[\d]{2}[\-\/\ ][\d]{2} [\d]{2}[\-\/\ \:]{1}[\d]{2}[\-\/\ \:]{0,1}[\d]{0,2})$/) ||
					(pattern && iN.val().match(pattern))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "tags")) {
				if(
					!pattern && iN.val().match(/\:/) ||
					(pattern && iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "prices")) {
				if(
					!isNaN(iN.val())
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "files")) {
				if(
					1
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
		}
		if(u.hc(iN.field, "error")) {
			return false;
		}
		else {
			return true;
		}
	}
	this.getParams = function(form, settings) {
		var send_as = "params";
		var ignore_inputs = "ignoreinput";
		if(typeof(settings) == "object") {
			var argument;
			for(argument in settings) {
				switch(argument) {
					case "ignore_inputs"	: ignore_inputs		= settings[argument]; break;
					case "send_as"			: send_as			= settings[argument]; break;
				}
			}
		}
		var i, input, select, textarea, param;
			var params = new Object();
		if(form._submit_button && form._submit_button.name) {
			params[form._submit_button.name] = form._submit_button.value;
		}
		var inputs = u.qsa("input", form);
		var selects = u.qsa("select", form)
		var textareas = u.qsa("textarea", form)
		for(i = 0; input = inputs[i]; i++) {
			if(!u.hc(input, ignore_inputs)) {
				if((input.type == "checkbox" || input.type == "radio") && input.checked) {
					if(!this.isDefault(input)) {
						params[input.name] = input.value;
					}
				}
				else if(input.type == "file") {
					if(!this.isDefault(input)) {
						params[input.name] = input.value;
					}
				}
				else if(!input.type.match(/button|submit|reset|file|checkbox|radio/i)) {
					if(!this.isDefault(input)) {
						params[input.name] = input.value;
					}
				}
			}
		}
		for(i = 0; select = selects[i]; i++) {
			if(!u.hc(select, ignore_inputs)) {
				if(!this.isDefault(select)) {
					params[select.name] = select.options[select.selectedIndex].value;
				}
			}
		}
		for(i = 0; textarea = textareas[i]; i++) {
			if(!u.hc(textarea, ignore_inputs)) {
				if(!this.isDefault(textarea)) {
					params[textarea.name] = textarea.value;
				}
			}
		}
		if(send_as && typeof(this.customSend[send_as]) == "function") {
			return this.customSend[send_as](params, form);
		}
		else if(send_as == "json") {
			return u.f.convertNamesToJsonObject(params);
		}
		else if(send_as == "object") {
			return params;
		}
		else {
			var string = "";
			for(param in params) {
					string += (string ? "&" : "") + param + "=" + encodeURIComponent(params[param]);
			}
			return string;
		}
	}
}
u.f.convertNamesToJsonObject = function(params) {
 	var indexes, root, indexes_exsists, param;
	var object = new Object();
	for(param in params) {
	 	indexes_exsists = param.match(/\[/);
		if(indexes_exsists) {
			root = param.split("[")[0];
			indexes = param.replace(root, "");
			if(typeof(object[root]) == "undefined") {
				object[root] = new Object();
			}
			object[root] = this.recurseName(object[root], indexes, params[param]);
		}
		else {
			object[param] = params[param];
		}
	}
	return object;
}
u.f.recurseName = function(object, indexes, value) {
	var index = indexes.match(/\[([a-zA-Z0-9\-\_]+)\]/);
	var current_index = index[1];
	indexes = indexes.replace(index[0], "");
 	if(indexes.match(/\[/)) {
		if(object.length !== undefined) {
			var i;
			var added = false;
			for(i = 0; i < object.length; i++) {
				for(exsiting_index in object[i]) {
					if(exsiting_index == current_index) {
						object[i][exsiting_index] = this.recurseName(object[i][exsiting_index], indexes, value);
						added = true;
					}
				}
			}
			if(!added) {
				temp = new Object();
				temp[current_index] = new Object();
				temp[current_index] = this.recurseName(temp[current_index], indexes, value);
				object.push(temp);
			}
		}
		else if(typeof(object[current_index]) != "undefined") {
			object[current_index] = this.recurseName(object[current_index], indexes, value);
		}
		else {
			object[current_index] = new Object();
			object[current_index] = this.recurseName(object[current_index], indexes, value);
		}
	}
	else {
		object[current_index] = value;
	}
	return object;
}
Util.absoluteX = u.absX = function(node) {
	if(node.offsetParent) {
		return node.offsetLeft + u.absX(node.offsetParent);
	}
	return node.offsetLeft;
}
Util.absoluteY = u.absY = function(node) {
	if(node.offsetParent) {
		return node.offsetTop + u.absY(node.offsetParent);
	}
	return node.offsetTop;
}
Util.relativeX = u.relX = function(node) {
	if(u.gcs(node, "position").match(/absolute/) == null && node.offsetParent && u.gcs(node.offsetParent, "position").match(/relative|absolute|fixed/) == null) {
		return node.offsetLeft + u.relX(node.offsetParent);
	}
	return node.offsetLeft;
}
Util.relativeY = u.relY = function(node) {
	if(u.gcs(node, "position").match(/absolute/) == null && node.offsetParent && u.gcs(node.offsetParent, "position").match(/relative|absolute|fixed/) == null) {
		return node.offsetTop + u.relY(node.offsetParent);
	}
	return node.offsetTop;
}
Util.actualWidth = u.actualW = function(node) {
	return parseInt(u.gcs(node, "width"));
}
Util.actualHeight = u.actualH = function(node) {
	return parseInt(u.gcs(node, "height"));
}
Util.eventX = function(event){
	return (event.targetTouches ? event.targetTouches[0].pageX : event.pageX);
}
Util.eventY = function(event){
	return (event.targetTouches ? event.targetTouches[0].pageY : event.pageY);
}
Util.browserWidth = u.browserW = function() {
	return document.documentElement.clientWidth;
}
Util.browserHeight = u.browserH = function() {
	return document.documentElement.clientHeight;
}
Util.htmlWidth = u.htmlW = function() {
	return document.body.offsetWidth + parseInt(u.gcs(document.body, "margin-left")) + parseInt(u.gcs(document.body, "margin-right"));
}
Util.htmlHeight = u.htmlH = function() {
	return document.body.offsetHeight + parseInt(u.gcs(document.body, "margin-top")) + parseInt(u.gcs(document.body, "margin-bottom"));
}
Util.pageScrollX = u.scrollX = function() {
	return window.pageXOffset;
}
Util.pageScrollY = u.scrollY = function() {
	return window.pageYOffset;
}
Util.Hash = u.h = new function() {
	this.catchEvent = function(callback, node) {
		this.node = node;
		this.node.callback = callback;
		hashChanged = function(event) {
			u.h.node.callback();
		}
		if("onhashchange" in window && !u.browser("explorer", "<=7")) {
			window.onhashchange = hashChanged;
		}
		else {
			u.current_hash = window.location.hash;
			window.onhashchange = hashChanged;
			setInterval(
				function() {
					if(window.location.hash !== u.current_hash) {
						u.current_hash = window.location.hash;
						window.onhashchange();
					}
				}, 200
			);
		}
	}
	this.cleanHash = function(string, levels) {
		if(!levels) {
			return string.replace(location.protocol+"//"+document.domain, "");
		}
		else {
			var i, return_string = "";
			var hash = string.replace(location.protocol+"//"+document.domain, "").split("/");
			for(i = 1; i <= levels; i++) {
				return_string += "/" + hash[i];
			}
			return return_string;
		}
	}
	this.getCleanUrl = function(string, levels) {
		string = string.replace(location.protocol+"//"+document.domain, "").match(/[^#$]+/)[0];
		if(!levels) {
			return string;
		}
		else {
			var i, return_string = "";
			var hash = string.split("/");
			levels = levels > hash.length-1 ? hash.length-1 : levels;
			for(i = 1; i <= levels; i++) {
				return_string += "/" + hash[i];
			}
			return return_string;
		}
	}
	this.getCleanHash = function(string, levels) {
		string = string.replace("#", "");
		if(!levels) {
			return string;
		}
		else {
			var i, return_string = "";
			var hash = string.split("/");
			levels = levels > hash.length-1 ? hash.length-1 : levels;
			for(i = 1; i <= levels; i++) {
				return_string += "/" + hash[i];
			}
			return return_string;
		}
	}
}
Util.Objects = u.o = new Object();
Util.init = function(scope) {
	var i, node, nodes, object;
	scope = scope && scope.nodeName ? scope : document;
	nodes = u.ges("i\:([_a-zA-Z0-9])+");
	for(i = 0; node = nodes[i]; i++) {
		while((object = u.cv(node, "i"))) {
			u.rc(node, "i:"+object);
			if(object && typeof(u.o[object]) == "object") {
				u.o[object].init(node);
			}
		}
	}
}
Util.random = function(min, max) {
	return Math.round((Math.random() * (max - min)) + min);
}
Util.numToHex = function(num) {
	return num.toString(16);
}
Util.hexToNum = function(hex) {
	return parseInt(hex,16);
}
Util.round = function(number, decimals) {
	var round_number = number*Math.pow(10, decimals);
	return Math.round(round_number)/Math.pow(10, decimals);
}
Util.period = function(format, time) {
	var seconds = 0;
	if(typeof(time) == "object") {
		var argument;
		for(argument in time) {
			switch(argument) {
				case "seconds"		: seconds = time[argument]; break;
				case "milliseconds" : seconds = Number(time[argument])/1000; break;
				case "minutes"		: seconds = Number(time[argument])*60; break;
				case "hours"		: seconds = Number(time[argument])*60*60 ; break;
				case "days"			: seconds = Number(time[argument])*60*60*24; break;
				case "months"		: seconds = Number(time[argument])*60*60*24*(365/12); break;
				case "years"		: seconds = Number(time[argument])*60*60*24*365; break;
			}
		}
	}
	var tokens = /y|n|o|O|w|W|c|d|e|D|g|h|H|l|m|M|r|s|S|t|T|u|U/g;
	var chars = new Object();
	chars.y = 0; 
	chars.n = 0; 
	chars.o = (chars.n > 9 ? "" : "0") + chars.n; 
	chars.O = 0; 
	chars.w = 0; 
	chars.W = 0; 
	chars.c = 0; 
	chars.d = 0; 
	chars.e = 0; 
	chars.D = Math.floor(((seconds/60)/60)/24);
	chars.g = Math.floor((seconds/60)/60)%24;
	chars.h = (chars.g > 9 ? "" : "0") + chars.g;
	chars.H = Math.floor((seconds/60)/60);
	chars.l = Math.floor(seconds/60)%60;
	chars.m = (chars.l > 9 ? "" : "0") + chars.l;
	chars.M = Math.floor(seconds/60);
	chars.r = Math.floor(seconds)%60;
	chars.s = (chars.r > 9 ? "" : "0") + chars.r;
	chars.S = Math.floor(seconds);
	chars.t = Math.round((seconds%1)*10);
	chars.T = Math.round((seconds%1)*100);
	chars.T = (chars.T > 9 ? "": "0") + Math.round(chars.T);
	chars.u = Math.round((seconds%1)*1000);
	chars.u = (chars.u > 9 ? chars.u > 99 ? "" : "0" : "00") + Math.round(chars.u);
	chars.U = Math.round(seconds*1000);
	return format.replace(tokens, function (_) {
		return _ in chars ? chars[_] : _.slice(1, _.length - 1);
	});
};
Util.popup = function(url, settings) {
	var width = "330";
	var height = "150";
	var name = "popup" + new Date().getHours() + "_" + new Date().getMinutes() + "_" + new Date().getMilliseconds();
	var extra = "";
	if(typeof(settings) == "object") {
		var argument;
		for(argument in settings) {
			switch(argument) {
				case "name"		: name		= settings[argument]; break;
				case "width"	: width		= Number(settings[argument]); break;
				case "height"	: height	= Number(settings[argument]); break;
				case "extra"	: extra		= settings[argument]; break;
			}
		}
	}
	var p;
	p = "width=" + width + ",height=" + height;
	p += ",left=" + (screen.width-width)/2;
	p += ",top=" + ((screen.height-height)-20)/2;
	p += extra ? "," + extra : ",scrollbars";
	document[name] = window.open(url, name, p);
	return document[name];
}
Util.createRequestObject = u.createRequestObject = function() {
	return new XMLHttpRequest();
}
Util.Request = u.request = function(node, url, settings) {
	node.request_url = url;
	node.request_method = "GET";
	node.request_async = true;
	node.request_params = "";
	node.request_headers = false;
	node.response_callback = "response";
	if(typeof(settings) == "object") {
		var argument;
		for(argument in settings) {
			switch(argument) {
				case "method"		: node.request_method		= settings[argument]; break;
				case "params"		: node.request_params		= settings[argument]; break;
				case "async"		: node.request_async		= settings[argument]; break;
				case "headers"		: node.request_headers		= settings[argument]; break;
				case "callback"		: node.response_callback	= settings[argument]; break;
			}
		}
	}
	if(node.request_method.match(/GET|POST|PUT|PATCH/i)) {
		node.HTTPRequest = this.createRequestObject();
		node.HTTPRequest.node = node;
		if(node.request_async) {
			node.HTTPRequest.onreadystatechange = function() {
				if(this.readyState == 4) {
					u.validateResponse(this);
				}
			}
		}
		try {
			if(node.request_method.match(/GET/i)) {
				var params = u.JSONtoParams(node.request_params);
				node.request_url += params ? ((!node.request_url.match(/\?/g) ? "?" : "&") + params) : "";
				node.HTTPRequest.open(node.request_method, node.request_url, node.request_async);
				node.HTTPRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				var csfr_field = u.qs('meta[name="csrf-token"]');
				if(csfr_field && csfr_field.content) {
					node.HTTPRequest.setRequestHeader("X-CSRF-Token", csfr_field.content);
				}
				if(typeof(node.request_headers) == "object") {
					var header;
					for(header in node.request_headers) {
						node.HTTPRequest.setRequestHeader(header, node.request_headers[header]);
					}
				}
				node.HTTPRequest.send("");
			}
			else if(node.request_method.match(/POST|PUT|PATCH/i)) {
				var params;
				if(typeof(node.request_params) == "object" && !node.request_params.constructor.toString().match(/FormData/i)) {
					params = JSON.stringify(node.request_params);
				}
				else {
					params = node.request_params;
				}
				node.HTTPRequest.open(node.request_method, node.request_url, node.request_async);
				node.HTTPRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				var csfr_field = u.qs('meta[name="csrf-token"]');
				if(csfr_field && csfr_field.content) {
					node.HTTPRequest.setRequestHeader("X-CSRF-Token", csfr_field.content);
				}
				if(typeof(node.request_headers) == "object") {
					var header;
					for(header in node.request_headers) {
						node.HTTPRequest.setRequestHeader(header, node.request_headers[header]);
					}
				}
				node.HTTPRequest.send(params);
			}
		}
		catch(exception) {
			node.HTTPRequest.exception = exception;
			u.validateResponse(node.HTTPRequest);
			return;
		}
		if(!node.request_async) {
			u.validateResponse(node.HTTPRequest);
		}
	}
	else if(node.request_method.match(/SCRIPT/i)) {
		var key = u.randomString();
		document[key] = new Object();
		document[key].node = node;
		document[key].responder = function(response) {
			var response_object = new Object();
			response_object.node = this.node;
			response_object.responseText = response;
			u.validateResponse(response_object);
		}
		var params = u.JSONtoParams(node.request_params);
		node.request_url += params ? ((!node.request_url.match(/\?/g) ? "?" : "&") + params) : "";
		node.request_url += (!node.request_url.match(/\?/g) ? "?" : "&") + "callback=document."+key+".responder";
		u.ae(u.qs("head"), "script", ({"type":"text/javascript", "src":node.request_url}));
	}
}
Util.JSONtoParams = function(json) {
	if(typeof(json) == "object") {
		var params = "", param;
		for(param in json) {
			params += (params ? "&" : "") + param + "=" + json[param];
		}
		return params
	}
	var object = u.isStringJSON(json);
	if(object) {
		return u.JSONtoParams(object);
	}
	return json;
}
Util.isStringJSON = function(string) {
	if(string.trim().substr(0, 1).match(/[\{\[]/i) && string.trim().substr(-1, 1).match(/[\}\]]/i)) {
		try {
			var test = JSON.parse(string);
			if(typeof(test) == "object") {
				test.isJSON = true;
				return test;
			}
		}
		catch(exception) {}
	}
	return false;
}
Util.isStringHTML = function(string) {
	if(string.trim().substr(0, 1).match(/[\<]/i) && string.trim().substr(-1, 1).match(/[\>]/i)) {
		try {
			var test = document.createElement("div");
			test.innerHTML = string;
			if(test.childNodes.length) {
				var body_class = string.match(/<body class="([a-z0-9A-Z_: ]+)"/);
				test.body_class = body_class ? body_class[1] : "";
				var head_title = string.match(/<title>([^$]+)<\/title>/);
				test.head_title = head_title ? head_title[1] : "";
				test.isHTML = true;
				return test;
			}
		}
		catch(exception) {}
	}
	return false;
}
Util.evaluateResponseText = function(responseText) {
	var object;
	if(typeof(responseText) == "object") {
		responseText.isJSON = true;
		return responseText;
	}
	else {
		var response_string;
		if(responseText.trim().substr(0, 1).match(/[\"\']/i) && responseText.trim().substr(-1, 1).match(/[\"\']/i)) {
			response_string = responseText.trim().substr(1, responseText.trim().length-2);
		}
		else {
			response_string = responseText;
		}
		var json = u.isStringJSON(response_string);
		if(json) {
			return json;
		}
		var html = u.isStringHTML(response_string);
		if(html) {
			return html;
		}
		return responseText;
	}
}
Util.validateResponse = function(response){
	var object = false;
	if(response) {
		try {
			if(response.status && !response.status.toString().match(/403|404|500/)) {
				object = u.evaluateResponseText(response.responseText);
			}
			else if(response.responseText) {
				object = u.evaluateResponseText(response.responseText);
			}
		}
		catch(exception) {
			response.exception = exception;
		}
	}
	if(object) {
		if(typeof(response.node[response.node.response_callback]) == "function") {
			response.node[response.node.response_callback](object);
		}
	}
	else {
		if(typeof(response.node.ResponseError) == "function") {
			response.node.ResponseError(response);
		}
		if(typeof(response.node.responseError) == "function") {
			response.node.responseError(response);
		}
	}
}
Util.cutString = function(string, length) {
	var matches, match, i;
	if(string.length <= length) {
		return string;
	}
	else {
		length = length-3;
	}
	matches = string.match(/\&[\w\d]+\;/g);
	if(matches) {
		for(i = 0; match = matches[i]; i++){
			if(string.indexOf(match) < length){
				length += match.length-1;
			}
		}
	}
	return string.substring(0, length) + (string.length > length ? "..." : "");
}
Util.prefix = function(string, length, prefix) {
	string = string.toString();
	prefix = prefix ? prefix : "0";
	while(string.length < length) {
		string = prefix + string;
	}
	return string;
}
Util.randomString = function(length) {
	var key = "", i;
	length = length ? length : 8;
	var pattern = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
	for(i = 0; i < length; i++) {
		key += pattern[u.random(0,35)];
	}
	return key;
}
Util.uuid = function() {
	var chars = '0123456789abcdef'.split('');
	var uuid = [], rnd = Math.random, r, i;
	uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
	uuid[14] = '4';
	for(i = 0; i < 36; i++) {
		if(!uuid[i]) {
			r = 0 | rnd()*16;
			uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
		}
 	}
	return uuid.join('');
}
Util.stringOr = u.eitherOr = function(value, replacement) {
	if(value !== undefined && value !== null) {
		return value;
	}
	else {
		return replacement ? replacement : "";
	}	
}
Util.browser = function(model, version) {
	var current_version = false;
	if(model.match(/\bexplorer\b|\bie\b/i)) {
		if(window.ActiveXObject) {
			current_version = navigator.userAgent.match(/(MSIE )(\d+.\d)/i)[2];
		}
	}
	else if(model.match(/\bfirefox\b|\bgecko\b/i)) {
		if(window.navigator.mozIsLocallyAvailable) {
			current_version = navigator.userAgent.match(/(Firefox\/)(\d+\.\d+)/i)[2];
		}
	}
	else if(model.match(/\bwebkit\b/i)) {
		if(document.body.style.webkitTransform != undefined) {
			current_version = navigator.userAgent.match(/(AppleWebKit\/)(\d+.\d)/i)[2];
		}
	}
	else if(model.match(/\bchrome\b/i)) {
		if(window.chrome && document.body.style.webkitTransform != undefined) {
			current_version = navigator.userAgent.match(/(Chrome\/)(\d+)(.\d)/i)[2];
		}
	}
	else if(model.match(/\bsafari\b/i)) {
		if(!window.chrome && document.body.style.webkitTransform != undefined) {
			current_version = navigator.userAgent.match(/(Version\/)(\d+)(.\d)/i)[2];
		}
	}
	else if(model.match(/\bopera\b/i)) {
		if(window.opera) {
			if(navigator.userAgent.match(/Version\//)) {
				current_version = navigator.userAgent.match(/(Version\/)(\d+)(.\d)/i)[2];
			}
			else {
				current_version = navigator.userAgent.match(/(Opera\/)(\d+)(.\d)/i)[2];
			}
		}
	}
	if(current_version) {
		if(!version) {
			return current_version;
		}
		else {
			if(!isNaN(version)) {
				return current_version == version;
			}
			else {
				return eval(current_version + version);
			}
		}
	}
	else {
		return false;
	}
}
Util.segment = function(segment) {
	if(!u.current_segment) {
		var scripts = document.getElementsByTagName("script");
		var script, i, src;
		for(i = 0; script = scripts[i]; i++) {
			seg_src = script.src.match(/\/seg_([a-z_]+)/);
			if(seg_src) {
				u.current_segment = seg_src[1];
			}
		}
	}
	if(segment) {
		return segment == u.current_segment;
	}
	return u.current_segment;
}
Util.system = function(os, version) {
}
Util.support = function(property) {
	if(document.documentElement) {
		property = property.replace(/(-\w)/g, function(word){return word.replace(/-/, "").toUpperCase()});
		return property in document.documentElement.style;
	}
	return false;
}
Util.windows = function() {
	return (navigator.userAgent.indexOf("Windows") >= 0) ? true : false;
}
Util.osx = function() {
	return (navigator.userAgent.indexOf("OS X") >= 0) ? true : false;
}
Util.Timer = u.t = new function() {
	this._timers = new Array();
	this.setTimer = function(node, action, timeout) {
		var id = this._timers.length;
		this._timers[id] = {"_a":action, "_n":node, "_t":setTimeout("u.t._executeTimer("+id+")", timeout)};
		return id;
	}
	this.resetTimer = function(id) {
		if(this._timers[id]) {
			clearTimeout(this._timers[id]._t);
			this._timers[id] = false;
		}
	}
	this._executeTimer = function(id) {
		var node = this._timers[id]._n;
		node._timer_action = this._timers[id]._a;
		node._timer_action();
		node._timer_action = null;
		this._timers[id] = false;
	}
	this.setInterval = function(node, action, interval) {
		var id = this._timers.length;
		this._timers[id] = {"_a":action, "_n":node, "_i":setInterval("u.t._executeInterval("+id+")", interval)};
		return id;
	}
	this.resetInterval = function(id) {
		if(this._timers[id]) {
			clearInterval(this._timers[id]._i);
			this._timers[id] = false;
		}
	}
	this._executeInterval = function(id) {
		var node = this._timers[id]._n;
		node._interval_action = this._timers[id]._a;
		node._interval_action();
		node._timer_action = null;
	}
	this.valid = function(id) {
		return this._timers[id] ? true : false;
	}
	this.resetAllTimers = function() {
		var i, t;
		for(i = 0; i < this._timers.length; i++) {
			if(this._timers[i] && this._timers[i]._t) {
				this.resetTimer(i);
			}
		}
	}
	this.resetAllIntervals = function() {
		var i, t;
		for(i = 0; i < this._timers.length; i++) {
			if(this._timers[i] && this._timers[i]._i) {
				this.resetInterval(i);
			}
		}
	}
}
Util.getVar = function(param, url) {
	var string = url ? url.split("#")[0] : location.search;
	var regexp = new RegExp("[\&\?\b]{1}"+param+"\=([^\&\b]+)");
	var match = string.match(regexp);
	if(match && match.length > 1) {
		return match[1];
	}
	else {
		return "";
	}
}


/*beta-u-video.js*/
Util.videoPlayer = function(_options) {
	var player;
	// 
		player = document.createElement("div");
		u.ac(player, "videoplayer");
	player.ff_skip = 2;
	player.rw_skip = 2;
	player._default_playpause = false;
	player._default_zoom = false;
	player._default_volume = false;
	player._default_search = false;
	if(typeof(_options) == "object") {
		var argument;
		for(argument in _options) {
			switch(argument) {
				case "playpause"	: player._default_playpause		= _options[argument]; break;
			}
		}
	}
	player.flash = false;
	player.video = u.ae(player, "video");
	if(typeof(player.video.play) == "function") {
		player.load = function(src, _options) {
			player._controls_playpause = player._default_playpause;
			player._controls_zoom = player._default_zoom;
			player._controls_volume = player._default_volume;
			player._controls_search = player._default_search;
			if(typeof(_options) == "object") {
				var argument;
				for(argument in _options) {
					switch(argument) {
						case "playpause"	: player._controls_playpause	= _options[argument]; break;
					}
				}
			}
			this.setup();
			if(this.className.match("/playing/")) {
				this.stop();
			}
			if(src) {
				this.video.src = this.correctSource(src);
				this.video.load();
				this.video.controls = false;
			}
		}
		player.play = function(position) {
			if(this.video.currentTime && position !== undefined) {
				this.video.currentTime = position;
			}
			if(this.video.src) {
				this.video.play();
			}
		}
		player.loadAndPlay = function(src, _options) {
			var position = 0;
			if(typeof(_options) == "object") {
				var argument;
				for(argument in _options) {
					switch(argument) {
						case "position"		: position		= _options[argument]; break;
					}
				}
			}
			this.load(src, _options);
			this.play(position);
		}
		player.pause = function() {
			this.video.pause();
		}
		player.stop = function() {
			this.video.pause();
			if(this.video.currentTime) {
				this.video.currentTime = 0;
			}
		}
		player.ff = function() {
			if(this.video.src && this.video.currentTime && this.videoLoaded) {
				this.video.currentTime = (this.video.duration - this.video.currentTime >= this.ff_skip) ? (this.video.currentTime + this.ff_skip) : this.video.duration;
				this.video._timeupdate();
			}
		}
		player.rw = function() {
			if(this.video.src && this.video.currentTime && this.videoLoaded) {
				this.video.currentTime = (this.video.currentTime >= this.rw_skip) ? (this.video.currentTime - this.rw_skip) : 0;
				this.video._timeupdate();
			}
		}
		player.togglePlay = function() {
			if(this.className.match(/playing/g)) {
				this.pause();
			}
			else {
				this.play();
			}
		}
		player.setup = function() {
			if(u.qs("video", this)) {
				var video = this.removeChild(this.video);
				delete video;
			}
			this.video = u.ie(this, "video");
			this.video.player = this;
			this.setControls();
			this.currentTime = 0;
			this.duration = 0;
			this.videoLoaded = false;
			this.metaLoaded = false;
			this.video._loadstart = function(event) {
				u.ac(this.player, "loading");
				if(typeof(this.player.loading) == "function") {
					this.player.loading(event);
				}
			}
			u.e.addEvent(this.video, "loadstart", this._loadstart);
			this.video._canplaythrough = function(event) {
				u.rc(this.player, "loading");
				if(typeof(this.player.canplaythrough) == "function") {
					this.player.canplaythrough(event);
				}
			}
			u.e.addEvent(this.video, "canplaythrough", this.video._canplaythrough);
			this.video._playing = function(event) {
				u.rc(this.player, "loading|paused");
				u.ac(this.player, "playing");
				if(typeof(this.player.playing) == "function") {
					this.player.playing(event);
				}
			}
			u.e.addEvent(this.video, "playing", this.video._playing);
			this.video._paused = function(event) {
				u.rc(this.player, "playing|loading");
				u.ac(this.player, "paused");
				if(typeof(this.player.paused) == "function") {
					this.player.paused(event);
				}
			}
			u.e.addEvent(this.video, "pause", this.video._paused);
			this.video._stalled = function(event) {
				u.rc(this.player, "playing|paused");
				u.ac(this.player, "loading");
				if(typeof(this.player.stalled) == "function") {
					this.player.stalled(event);
				}
			}
			u.e.addEvent(this.video, "stalled", this.video._paused);
			this.video._ended = function(event) {
				u.rc(this.player, "playing|paused");
				if(typeof(this.player.ended) == "function") {
					this.player.ended(event);
				}
			}
			u.e.addEvent(this.video, "ended", this.video._ended);
			this.video._loadedmetadata = function(event) {
				this.player.duration = this.duration;
				this.player.currentTime = this.currentTime;
				this.player.metaLoaded = true;
				if(typeof(this.player.loadedmetadata) == "function") {
					this.player.loadedmetadata(event);
				}
			}
			u.e.addEvent(this.video, "loadedmetadata", this.video._loadedmetadata);
			this.video._loadeddata = function(event) {
				this.player.videoLoaded = true;
				if(typeof(this.player.loadeddata) == "function") {
					this.player.loadeddata(event);
				}
			}
			u.e.addEvent(this.video, "loadeddata", this.video._loadeddata);
			this.video._timeupdate = function(event) {
				this.player.currentTime = this.currentTime;
				if(typeof(this.player.timeupdate) == "function") {
					this.player.timeupdate(event);
				}
			}
			u.e.addEvent(this.video, "timeupdate", this.video._timeupdate);
		}
	}
	else if(typeof(u.videoPlayerFallback) == "function") {
		player.removeChild(player.video);
		player = u.videoPlayerFallback(player);
	}
	player.correctSource = function(src) {
		src = src.replace(/\?[^$]+/, "");
		src = src.replace(/\.m4v|\.mp4|\.webm|\.ogv|\.3gp|\.mov/, "");
		if(this.flash) {
			return src+".mp4";
		}
		else if(this.video.canPlayType("video/mp4")) {
			return src+".mp4";
		}
		else if(this.video.canPlayType("video/ogg")) {
			return src+".ogv";
		}
		else if(this.video.canPlayType("video/3gpp")) {
			return src+".3gp";
		}
		else {
			return src+".mov";
		}
	}
	player.setControls = function() {
		if(this.showControls) {
			u.e.removeEvent(this, "mousemove", this.showControls);
		}
		if(this._controls_playpause || this._controls_zoom || this._controls_volume || this._controls_search) {
			if(!this.controls) {
				this.controls = u.ae(this, "div", {"class":"controls"});
				this.hideControls = function() {
					this.t_controls = u.t.resetTimer(this.t_controls);
					u.a.transition(this.controls, "all 0.3s ease-out");
					u.a.setOpacity(this.controls, 0);
				}
				this.showControls = function() {
					if(this.t_controls) {
						this.t_controls = u.t.resetTimer(this.t_controls);
					}
					else {
						u.a.transition(this.controls, "all 0.5s ease-out");
						u.a.setOpacity(this.controls, 1);
					}
					this.t_controls = u.t.setTimer(this, this.hideControls, 1500);
				}
			}
			else {
				u.as(this.controls, "display", "block");
			}
			if(this._controls_playpause) {
				if(!this.controls.playpause) {
					this.controls.playpause = u.ae(this.controls, "a", {"class":"playpause"});
					this.controls.playpause.player = this;
					u.e.click(this.controls.playpause);
					this.controls.playpause.clicked = function(event) {
						this.player.togglePlay();
					}
				}
				else {
					u.as(this.controls.playpause, "display", "block");
				}
			}
			else if(this.controls.playpause) {
				u.as(this.controls.playpause, "display", "none");
			}
			if(this._controls_zoom && !this.controls.zoom) {}
			else if(this.controls.zoom) {}
			if(this._controls_volume && !this.controls.volume) {}
			else if(this.controls.volume) {}
			if(this._controls_search && !this.controls.search) {}
			else if(this.controls.search) {}
			u.e.addEvent(this, "mousemove", this.showControls);
		}
		else if(this.controls) {
			u.as(this.controls, "display", "none");
		}
	}
	return player;
}

/*beta-u-preloader.js*/
u.preloader = function(node, files, options) {
	var callback, callback_min_delay
	if(typeof(options) == "object") {
		var argument;
		for(argument in options) {
			switch(argument) {
				case "callback"				: callback				= options[argument]; break;
				case "callback_min_delay"	: callback_min_delay	= options[argument]; break;
			}
		}
	}
	if(!u._preloader_queue) {
		u._preloader_queue = document.createElement("div");
		u._preloader_processes = 0;
		if(u.e && u.e.event_pref == "touch") {
			u._preloader_max_processes = 1;
		}
		else {
			u._preloader_max_processes = 1;
		}
	}
	if(node && files) {
		var entry, file;
		var new_queue = u.ae(u._preloader_queue, "ul");
		new_queue._callback = callback;
		new_queue._node = node;
		new_queue._files = files;
		new_queue.nodes = new Array();
		new_queue._start_time = new Date().getTime();
		for(i = 0; file = files[i]; i++) {
			entry = u.ae(new_queue, "li", {"class":"waiting"});
			entry.i = i;
			entry._queue = new_queue
			entry._file = file;
		}
		u.ac(node, "waiting");
		if(typeof(node.waiting) == "function") {
			node.waiting();
		}
	}
	u.queueLoader();
	return u._preloader_queue;
}
u.queueLoader = function() {
	if(u.qs("li.waiting", u._preloader_queue)) {
		while(u._preloader_processes < u._preloader_max_processes) {
			var next = u.qs("li.waiting", u._preloader_queue);
			if(next) {
				if(u.hc(next._queue._node, "waiting")) {
					u.rc(next._queue._node, "waiting");
					u.ac(next._queue._node, "loading");
					if(typeof(next._queue._node.loading) == "function") {
						next._node._queue.loading();
					}
				}
				u._preloader_processes++;
				u.rc(next, "waiting");
				u.ac(next, "loading");
				next.loaded = function(event) {
					this._image = event.target;
					this._queue.nodes[this.i] = this;
					u.rc(this, "loading");
					u.ac(this, "loaded");
					u._preloader_processes--;
					if(!u.qs("li.waiting,li.loading", this._queue)) {
						u.rc(this._queue._node, "loading");
						if(typeof(this._queue._callback) == "function") {
							this._queue._node._callback = this._queue._callback;
							this._queue._node._callback(this._queue.nodes);
						}
						else if(typeof(this._queue._node.loaded) == "function") {
							this._queue._node.loaded(this._queue.nodes);
						}
					}
					u.queueLoader();
				}
				u.i.load(next, next._file);
			}
			else {
				break
			}
		}
	}
}


/*beta-u-navigation.js*/
u.navigation = function(page, options) {
	// 
	page._nav_path = page._nav_path ? page._nav_path : "/";
	page._nav_history = page._nav_history ? page._nav_history : [];
	page._navigate = function() {
		if(!location.hash || !location.hash.match(/^#\//)) {
			location.hash = "#/"
			return;
		}
		var url = u.h.getCleanHash(location.hash);
		page._nav_history.unshift(url);
		u.stats.pageView(url);
		if(!this._nav_path || this._nav_path != u.h.getCleanHash(location.hash, 1)) {
			if(this.cN && typeof(this.cN.navigate) == "function") {
				this.cN.navigate(url);
			}
		}
		else {
			if(this.cN.scene && this.cN.scene.parentNode && typeof(this.cN.scene.navigate) == "function") {
				this.cN.scene.navigate(url);
			}
			else if(this.cN && typeof(this.cN.navigate) == "function") {
				this.cN.navigate(url);
			}
		}
		this._nav_path = u.h.getCleanHash(location.hash, 1);
	}
	page.navigate = function(url, node) {
		this.hash_node = node ? node : false;
		location.hash = u.h.getCleanUrl(url);
	}
	if(location.hash.length && location.hash.match(/^#!/)) {
		location.hash = location.hash.replace(/!/, "");
	}
	if(location.hash.length < 2) {
		page.navigate(location.href, page);
		page._nav_path = u.h.getCleanUrl(location.href);
		u.init(page.cN);
	}
	else if(u.h.getCleanHash(location.hash) != u.h.getCleanUrl(location.href) && location.hash.match(/^#\//)) {
		page._nav_path = u.h.getCleanUrl(location.href);
		page._navigate();
	}
	else {
		u.init(page.cN);
	}
	page._initHash = function() {
		u.h.catchEvent(page._navigate, page);
	}
	u.t.setTimer(page, page._initHash, 100);
	page.historyBack = function() {
		if(this._nav_history.length > 1) {
			this._nav_history.shift();
			return this._nav_history.shift();
		}
		else {
			return "/";
		}
	}
}


/*beta-u-textscaler.js*/
u.textscaler = function(node, settings) {
	if(typeof(settings) != "object") {
		settings = {
			"*":{
				"unit":"rem",
				"min_size":1,
				"min_width":200,
				"max_size":40,
				"max_width":3000
			}
		};
	}
	node.text_key = u.randomString(8);
	u.ac(node, node.text_key);
	node.text_settings = JSON.parse(JSON.stringify(settings));
	node.scaleText = function() {
		var tag;
		for(tag in this.text_settings) {
			var settings = this.text_settings[tag];
			if(settings.min_width <= window._jes_text._width && settings.max_width >= window._jes_text._width) {
				var font_size = settings.min_size + (settings.size_factor * (window._jes_text._width - settings.min_width) / settings.width_factor);
				settings.css_rule.style.setProperty("font-size", font_size + settings.unit, "important");
			}
			else if(settings.max_width < window._jes_text._width) {
				settings.css_rule.style.setProperty("font-size", settings.max_size + settings.unit, "important");
			}
			else if(settings.min_width > window._jes_text._width) {
				settings.css_rule.style.setProperty("font-size", settings.min_size + settings.unit, "important");
			}
		}
	}
	node.cancelTextScaling = function() {
		u.e.removeEvent(window, "resize", window._jes_text.scale);
	}
	if(!window._jes_text) {
		var jes_text = {};
		jes_text.nodes = [];
		var style_tag = document.createElement("style");
		style_tag.setAttribute("media", "all")
		style_tag.setAttribute("type", "text/css")
		jes_text.style_tag = u.ae(document.head, style_tag);
		jes_text.style_tag.appendChild(document.createTextNode(""))
		window._jes_text = jes_text;
		window._jes_text._width = u.browserW();
		window._jes_text.scale = function() {
			window._jes_text._width = u.browserW();
			var i, node;
			for(i = 0; node = window._jes_text.nodes[i]; i++) {
				if(node.parentNode) { 
					node.scaleText();
				}
				else {
					window._jes_text.nodes.splice(window._jes_text.nodes.indexOf(node), 1);
					if(!window._jes_text.nodes.length) {
						u.e.removeEvent(window, "resize", window._jes_text.scale);
					}
				}
			}
		}
		u.e.addEvent(window, "resize", window._jes_text.scale);
		window._jes_text.precalculate = function() {
			var i, node, tag;
			for(i = 0; node = window._jes_text.nodes[i]; i++) {
				if(node.parentNode) { 
					var settings = node.text_settings;
					for(tag in settings) {
						settings[tag].width_factor = settings[tag].max_width-settings[tag].min_width;
						settings[tag].size_factor = settings[tag].max_size-settings[tag].min_size;
					}
				}
			}
		}
	}
	var tag;
	for(tag in node.text_settings) {
		selector = "."+node.text_key + ' ' + tag + ' ';
		node.css_rules_index = window._jes_text.style_tag.sheet.insertRule(selector+'{}', 0);
		node.text_settings[tag].css_rule = window._jes_text.style_tag.sheet.cssRules[0];
	}
	window._jes_text.nodes.push(node);
	window._jes_text.precalculate();
	node.scaleText();
}

/*beta-u-gridmaster.js*/
u.gridMaster = function(list, _options) {
	var gm = u.we(list, "div", {"class":"gridmaster"});
	gm.callback_node_prepare = "prepareNode";
	gm.callback_node_build = "buildNode";
	gm.callback_node_render = "renderNode";
	gm.callback_node_rendered = "nodeRendered";
	gm.callback_node_resize = "resize";
	gm.callback_built = "built";
	gm.callback_resized = "resized";
	gm.render_delay = 100;
	gm.loop_grid = true;
	gm.video_controls = false;
	gm.selector = "li.item";
	gm.grid = {
		"nodes":[
			{
				"width"			: 25,
				"proportion"	: 1.6
			}
		]	
	}
	if(typeof(_options) == "object") {
		var argument;
		for(argument in _options) {
			switch(argument) {
				case "callback_prepare"			: gm.callback_node_prepare			= _options[argument]; break;
				case "callback_build"			: gm.callback_node_build			= _options[argument]; break;
				case "callback_resize"			: gm.callback_node_resize			= _options[argument]; break;
				case "callback_rendered"		: gm.callback_node_rendered			= _options[argument]; break;
				case "callback_resized"			: gm.callback_resized				= _options[argument]; break;
				case "callback_built"			: gm.callback_built					= _options[argument]; break;
				case "selector"					: gm.selector						= _options[argument]; break;
				case "grid"						: gm.grid							= _options[argument]; break;
				case "loop_grid"				: gm.loop_grid						= _options[argument]; break;
				case "render_delay"				: gm.render_delay					= _options[argument]; break;
				case "video_controls"			: gm.video_controls					= _options[argument]; break;
			}
		}
	}
	gm.org_html = gm.innerHTML;
	gm.prepare = function(grid) {
		this.innerHTML = this.org_html;
		this.list = u.qs("ul", this);
		this.list.gridmaster = this;
		this.nodes = u.qsa(this.selector, this);
		if(grid) {
			this.grid = grid;
			this.grid.calc_base = this.grid.calc_base ? this.grid.calc_base/100 : null;
		}
		this.fixed_height = this.grid.nodes[0].height ? true : false;
		var i, j, k, node, grid_node, static_node;
		for(i = 0, j = 0, k = 0; grid_node = this.grid.nodes[i]; i++, k++) {
			if(this.nodes.length > j) {
				node = false;
				if(grid_node.inject) {
					static_node = document.createElement(grid_node.inject);
					if(this.nodes.length > j) {
						node = this.list.insertBefore(static_node, this.nodes[j]);
					}
					else {
						node = this.list.appendChild(static_node);
					}
				}
				else {
					node = this.nodes[j];
					j++;
				}
				if(node) {
					node.gm_prepare = u.eitherOr(grid_node.prepare, this.callback_node_prepare);
					node.gm_build = u.eitherOr(grid_node.build, this.callback_node_build);
					node.gm_resize = u.eitherOr(grid_node.resize, this.callback_node_resize);
					node.gm_render = u.eitherOr(grid_node.render, this.callback_node_render);
					node.gm_rendered = u.eitherOr(grid_node.rendered, this.callback_node_rendered);
					node.gm_grid_width = grid_node.width ? grid_node.width/100 : null;
					node.gm_grid_height = grid_node.height ? grid_node.height/100 : null;
					node.gm_grid_proportion = grid_node.proportion;
					node.gm_calc_base = u.eitherOr(this.grid.calc_base, u.eitherOr(node.gm_grid_width, node.gm_grid_height));
					u.bug(node.gm_calc_base + ", " + this.grid.calc_base + ", " + node.gm_grid_width + ", " + node.gm_grid_height);
					u.ac(node, "i"+(k+1), false);
					if(grid_node["class"]) {
						u.ac(node, grid_node["class"]);
					}
					node.gm_grid_node = grid_node;
					if(typeof(this[node.gm_prepare]) == "function") {
						this[node.gm_prepare](node);
					}
					if((node.gm_video_src || node.gm_image_src) && !node.gm_media_mask) {
						node.gm_media_mask = u.ae(node, "div", {"class":"media"});
					}
				}
				if(this.loop_grid && this.nodes.length > j && i+1 >= this.grid.nodes.length) {
					i = -1;
				}
			}
		}
	}
	gm.build = function() {
		this.render_time = new Date().getTime();
		this.combined_delay = 0;
		this.render_count = 0;
		this.nodes = u.qsa(this.selector, this.list);
		var i, node, j;
		for(i = 0, j = 0; node = this.nodes[i]; i++) {
			if((!this.scene || !this.scene.filterPanel || this.scene.filterPanel.filter(node))) {
				node.renderNode = function() {
					var current_time = new Date().getTime();
					if(current_time - this.gm.render_time < this.gm.render_delay) {
						this.gm.combined_delay += (this.gm.render_delay - (current_time - this.gm.render_time))+5;
						u.t.setTimer(this, this.renderNode, this.gm.combined_delay);
					}
					else {
						this.gm.render_count++;
						this.gm.render_time = new Date().getTime();
						this.gm.combined_delay -= this.gm.render_delay;
						this.gm.resized();
						this.transitioned = function() {
							u.a.transition(this, "none");
						}
						u.a.transition(this, "opacity 0.5s ease-in-out");
						u.a.setOpacity(this, 1);
						if(typeof(this.gm[this.gm_rendered]) == "function") {
							this.gm[this.gm_rendered](this);
						}
					}
				}
				node.gm_i = j;
				if(typeof(this[node.gm_build]) == "function") {
					this[node.gm_build](node);
				}
				this.resized();
				node.gm = this;
				if(node.gm_video_src) {
					node.gm_video = u.videoPlayer();
					u.ae(node.gm_media_mask, node.gm_video);
					node.gm_video.node = node;
					if(this.video_controls) {
						if(node.gm_image_src) {
							node.gm_image = u.ae(node.gm_media_mask, "img");
							node.loaded = function(queue) {
								this.loaded = null;
								this.gm_image.src = queue[0]._image.src;
								if(typeof(this[this.gm_render]) == "function") {
									this[this.gm_render]();
								}
							}
							u.preloader(node, [node.gm_image_src]);
						}
						node.gm_video.load(node.gm_video_src, {"playpause":true});
					}
					else {
						node.gm_video.ended = function() {
							this.play();
						}
						node.gm_video.loadAndPlay(node.gm_video_src, {"playpause":false});
						node.gm_video.canplaythrough = function() {
							if(typeof(this.node[this.node.gm_render]) == "function") {
								this.node[this.node.gm_render]();
							}
						}
					}
				}
				else if(node.gm_image_src) {
					node.gm_image = u.ae(node.gm_media_mask, "img");
					node.loaded = function(queue) {
						this.loaded = null;
						this.gm_image.src = queue[0]._image.src;
						if(typeof(this[this.gm_render]) == "function") {
							this[this.gm_render]();
						}
					}
					u.preloader(node, [node.gm_image_src]);
				}
				else {
					if(typeof(node[node.gm_render]) == "function") {
						node[node.gm_render]();
					}
				}
				j++;
			}
			else {
				node._hidden = true;
				u.as(node, "display", "none");
			}
		}
	}
	gm.resized = function() {
		if(this.list && this.nodes) {
			if(this.fixed_height) {
				var calc_height = this.offsetHeight;
			}
				var calc_width = this.offsetWidth;
				u.as(this.list, "width", calc_width + 10, false);
			for(i = 0; node = this.nodes[i]; i++) {
				if(!node._hidden && node.gm_grid_width && node.gm_grid_proportion) {
					if(typeof(this[node.gm_resize]) == "function") {
						this[node.gm_resize](node, calc_width);
					}
					else {
						u.as(node, "width", Math.ceil(node.gm_calc_base * calc_width) * (node.gm_grid_width/node.gm_calc_base) + "px", false);
						if(node.gm_media_mask) {
							u.as(node.gm_media_mask, "height", (Math.floor(node.gm_media_mask.offsetWidth / node.gm_grid_proportion)-1) + "px", false);
						}
						else {
							u.as(node, "height", (Math.floor(node.offsetWidth / node.gm_grid_proportion)) + "px", false);
						}
					}
	// 
	// 
				}
				else if(!node._hidden && node.gm_grid_height && node.gm_grid_proportion) {
					if(typeof(this[node.gm_resize]) == "function") {
						this[node.gm_resize](node, calc_height);
					}
					else {
						u.as(node, "height", Math.ceil(node.gm_calc_base * calc_height) * (node.gm_grid_height/node.gm_calc_base) + "px", false);
						if(node.gm_media_mask) {
							u.as(node.gm_media_mask, "width", (Math.floor(node.gm_media_mask.offsetHeight / node.gm_grid_proportion)) + "px", false);
						}
						else {
							u.as(node, "width", (Math.floor(node.offsetHeight / node.gm_grid_proportion)) + "px", false);
						}
					}
				}
			}
		}
		this.offsetHeight;
	}
	var key = u.randomString(8);
	u.ac(gm, key);
	eval('window["' + key + '"] = function() {var gm = u.qs(".'+key+'"); if(gm && gm.parentNode) {gm.resized();} else {u.e.removeEvent(document, "resize", window["' + key + '"])}}');
	u.e.addEvent(window, "resize", window[key]);
	return gm;
}

/*beta-u-scrollto.js*/
u.scrollTo = function(to, options) {
	var callback;
	var scrollIn = window;
	var offset_y = 0;
	var offset_x = 0;
	if(typeof(options) == "object") {
		var argument;
		for(argument in options) {
			switch(argument) {
				case "callback"				: callback				= options[argument]; break;
				case "scrollIn"				: scrollIn				= options[argument]; break;
				case "offset_y"				: offset_y				= options[argument]; break;
				case "offset_x"				: offset_x				= options[argument]; break;
			}
		}
	}
	scrollIn._scrollToHandler = function(event) {
		u.t.resetTimer(this._current_scroll_parent.t_scroll);
		this._current_scroll_parent.t_scroll = u.t.setTimer(this._current_scroll_parent, this._current_scroll_parent._scrollTo, 50);
	}
	scrollIn._to_y = u.absY(to);
	if(offset_y) {
		scrollIn._to_y = scrollIn._to_y - offset_y;
	}
	if(scrollIn._to_y > u.qs("#page").offsetHeight-u.browserH()) {
		scrollIn._to_y = u.qs("#page").offsetHeight-u.browserH();
	}
	if(scrollIn._to_y < 0) {
		scrollIn._to_y = 0;
	}
	scrollIn._scroll_direction = scrollIn._to_y - u.scrollY();
	scrollIn._scroll_to_y = false;
	scrollIn._current_scroll_parent = scrollIn;
	u.e.addEvent(scrollIn, "scroll", scrollIn._scrollToHandler);
	scrollIn._cancelScrollTo = function() {
		u.t.resetTimer(this.t_scroll);
		u.e.removeEvent(this, "scroll", this._scrollToHandler);
		this._scrollTo = null;
	}
	scrollIn._scrollTo = function(start) {
		if(start) {
		}
		if(this._scroll_to_y === false || u.scrollY() == this._scroll_to_y) {
			if(this._scroll_direction > 0 && (this._scroll_to_y === false || this._to_y > u.scrollY())) {
				this._scroll_to_y = Math.ceil(u.scrollY() + (this._to_y - u.scrollY())/4);
			}
			else if(this._scroll_direction < 0 && (this._scroll_to_y === false || this._to_y < u.scrollY())) {
				this._scroll_to_y = Math.floor(u.scrollY() - (u.scrollY() - this._to_y)/4);
			}
			else {
				this._cancelScrollTo();
				this.scrollTo(0, this._to_y);
				this._scroll_to_y = false;
				if(typeof(this.scrolledTo) == "function") {
					this.scrolledTo();
				}
				return;
			}
			this.scrollTo(0, this._scroll_to_y);
		}
		else {
			this._cancelScrollTo();
			window._scroll_to_y = false;
			if(typeof(this.scrolledToCancelled) == "function") {
				this.scrolledToCancelled();
			}
		}	
	}
	scrollIn._scrollTo(true);
}

/*beta-u-slideshow.js*/
u.slideshow = function(list, _options) {
	var i, node;
	var slideshow = u.wrapElement(list, "div", {"class":"slideshow"});
	slideshow._selector = "";
	slideshow._layout = "horizontal";
	slideshow._navigation = true;
	slideshow._index = false;
	slideshow._transition = "ease-out";
	slideshow._duration = 0.6; 
	slideshow._loading = "incremental";
	slideshow._callback_picked = "picked";
	slideshow._callback_moved = "moved";
	slideshow._callback_dropped = "dropped";
	if(typeof(_options) == "object") {
		var argument;
		for(argument in _options) {
			switch(argument) {
				case "selector"			: slideshow._selector			= _options[argument]; break;
				case "layout"			: slideshow._layout				= _options[argument]; break;
				case "navigation"		: slideshow._navigation			= _options[argument]; break;
				case "index"			: slideshow._index				= _options[argument]; break;
				case "transition"		: slideshow._transition			= _options[argument]; break;
				case "duration"			: slideshow._duration			= _options[argument]; break;
				case "callback_picked"	: slideshow._callback_picked	= settings[argument]; break;
				case "callback_moved"	: slideshow._callback_moved		= settings[argument]; break;
				case "callback_dropped"	: slideshow._callback_dropped	= settings[argument]; break;
			}
		}
	}
	slideshow.list = list;
	slideshow._width = slideshow.offsetWidth;
	slideshow._height = slideshow.offsetHeight;
	if(slideshow._navigation) {
		slideshow.bn_next = u.ae(slideshow, "div", {"class":"next"});
		slideshow.bn_next.slideshow = slideshow;
		u.e.click(slideshow.bn_next);
		slideshow.bn_next.clicked = function(event) {
			this.slideshow.selectNode(this.slideshow.selected_node._i+1);
		}
		slideshow.bn_prev = u.ae(slideshow, "div", {"class":"prev"});
		slideshow.bn_prev.slideshow = slideshow;
		u.e.click(slideshow.bn_prev);
		slideshow.bn_prev.clicked = function(event) {
			this.slideshow.selectNode(this.slideshow.selected_node._i-1);
		}
	}
	if(slideshow._navigation) {}
	slideshow.showLoading = function() {
		u.ac(this, "loading");
	}
	slideshow.loading = function() {
		if(!this.t_loading) {
			this.t_loading = u.t.setTimer(this, this.showLoading, 1000);
		}
	}
	slideshow._loaded = function() {
		u.t.resetTimer(this.t_loading);
		u.rc(this, "loading");
		if(typeof(this.loaded) == "function") {
			this.loaded();
		}
	}
	slideshow.prepare = function() {
		if(this.nodes.length > 1) {
			if(this._layout == "vertical") {
				u.e.swipe(this, this, {"vertical_lock":true, "callback_picked":"slideshow_picked", "callback_moved":"slideshow_moved", "callback_dropped":"slideshow_dropped"});
				this.swipedLeft = this.swipedRight = function(event) {
					this.swiped = false;
				}
				this.swipedUp = function(event) {
					if(this.selected_node._y < 0) {
						this.selectNode(this.selected_node._i+1);
					}
					else {
						this.swiped = false;
					}
				}
				this.swipedDown = function(event) {
					if(this.selected_node._y > 0) {
						this.selectNode(this.selected_node._i-1);
					}
					else {
						this.swiped = false;
					}
				}
			}
			else {
				u.e.swipe(this, this, {"horizontal_lock":true, "callback_picked":"slideshow_picked", "callback_moved":"slideshow_moved", "callback_dropped":"slideshow_dropped"});
				this.swipedDown = this.swipedUp = function(event) {
					this.swiped = false;
				}
				this.swipedLeft = function(event) {
					if(this.selected_node._x < 0) {
						this.selectNode(this.selected_node._i+1);
					}
					else {
						this.swiped = false;
					}
				}
				this.swipedRight = function(event) {
					if(this.selected_node._x > 0) {
						this.selectNode(this.selected_node._i-1);
					}
					else {
						this.swiped = false;
					}
				}
			}
			this.slideshow_picked = function(event) {
				this.prev_node = this.selected_node._i-1 < 0 ? this.nodes[this.nodes.length-1] : this.nodes[this.selected_node._i-1];
				this.next_node = this.selected_node._i+1 >= this.nodes.length ? this.nodes[0] : this.nodes[this.selected_node._i+1];
				this._unclearNode(this.prev_node, "picked prev");
				this._unclearNode(this.next_node, "picked next");
				u.a.transition(this.prev_node, "none");
				u.a.transition(this.selected_node, "none");
				u.a.transition(this.next_node, "none");
				if(this._layout == "vertical") {
					u.a.translate(this.prev_node, 0, -(this._height));
					u.a.translate(this.next_node, 0, (this._height));
				}
				else {
					u.a.translate(this.prev_node, -(this._width), 0);
					u.a.translate(this.next_node, (this._width), 0);
				}
				if(typeof(this[this._callback_picked]) == "function") {
					this[this._callback_picked](event);
				}
			}
			this.slideshow_moved = function(event) {
				if(this._layout == "vertical") {
					if(this.current_y > 0) {
						u.a.translate(this.prev_node, 0, (this.current_y-this._height));
					}
					else if(this.prev_node._y > -(this._height) && this._prev_node != this._next_node) {
						u.a.translate(this.prev_node, 0, -(this._height));
						this.slideshow._clearNode(this.prev_node, "moved out prev vertical");
					}
					u.a.translate(this.selected_node, 0, this.current_y);
					if(this.current_y < 0) {
						u.a.translate(this.next_node, 0, (this.current_y+this._height));
					}
					else if(this.next_node._y < (this._height) && this._prev_node != this._next_node) {
						u.a.translate(this.next_node, 0, (this._height));
						this.slideshow._clearNode(this.next_node, "moved out next vertical");
					}
				}
				else {
					if(this.current_x > 0) {
						u.a.translate(this.prev_node, (this.current_x-this._width), 0);
					}
					else if(this.prev_node._x > -(this._width) && this._prev_node != this._next_node) {
						u.a.translate(this.prev_node, -(this._width), 0);
						this.slideshow._clearNode(this.next_node, "moved out prev horizontal");
					}
					u.a.translate(this.selected_node, this.current_x, 0);
					if(this.current_x < 0) {
						u.a.translate(this.next_node, (this.current_x+this._width), 0);
					}
					else if(this.next_node._x < (this._width) && this._prev_node != this._next_node) {
						u.a.translate(this.next_node, (this._width), 0);
						this.slideshow._clearNode(this.next_node, "moved out next horizontal");
					}
				}
				if(typeof(this[this._callback_moved]) == "function") {
					this[this._callback_moved](event);
				}
			}
			this.slideshow_dropped = function(event) {
				if(this._layout == "vertical") {
					if(!this.swiped && this.selected_node._y != 0) {
						var duration = this._duration / (this._height / this.current_y);
						this.selected_node.transitioned = function() {
							u.bug("no swipe cleared (vertical)")
							u.a.transition(this, "none");
							this.slideshow._clearNode(this.slideshow.prev_node, "dropped vert retured prev");
							this.slideshow._clearNode(this.slideshow.next_node, "dropped vert retured next");
						}
						u.a.transition(this.prev_node, "all " + duration + "s " + this._transition);
						u.a.transition(this.selected_node, "all " + duration + "s " + this._transition);
						u.a.transition(this.next_node, "all " + duration + "s " + this._transition);
						u.a.translate(this.prev_node, 0, -(this._height));
						u.a.translate(this.selected_node, 0, 0);
						u.a.translate(this.next_node, 0, (this._height));
					}
				}
				else {
					if(!this.swiped && this.selected_node._x != 0) {
						this.selected_node.transitioned = function() {
							u.bug("no swipe cleared (horizontal)")
							u.a.transition(this, "none");
							this.slideshow._clearNode(this.slideshow.prev_node, "dropped hor retured prev");
							this.slideshow._clearNode(this.slideshow.next_node, "dropped hor retured next");
						}
						var duration = this._duration / (this._width / this.current_x);
						u.a.transition(this.prev_node, "all " + duration + "s " + this._transition);
						u.a.transition(this.selected_node, "all " + duration + "s " + this._transition);
						u.a.transition(this.next_node, "all " + duration + "s " + this._transition);
						u.a.translate(this.prev_node, -(this._width), 0);
						u.a.translate(this.selected_node, 0, 0);
						u.a.translate(this.next_node, (this._width), 0);
					}
				}
				if(typeof(this[this._callback_dropped]) == "function") {
					this[this._callback_dropped](event);
				}
			}
		}
		if(typeof(this.prepared) == "function") {
			this.prepared();
		}
	}
	slideshow.preload = function(start_with) {
		this.loading();
		if(!this.selected_node) {
			if(start_with) {
				start_with = start_with ? start_with : 0;
				if(this.nodes.length > start_with) {
					this._load_base = this.nodes[start_with];
				}
				else {
					this._load_base = this.nodes[0];
				}
			}
			else if(!this._load_base) {
				this._load_base = this.nodes[0];
			}
		}
		else {
			this._load_base = this.selected_node;
		}
		if(!u.hc(this._load_base, "ready")) {
			this.loadNode(this._load_base);
			return;
		}
		var next_1 = this.nodes.length > this._load_base._i+1 ? this.nodes[this._load_base._i+1] : this.nodes[0];
		if(next_1 && !u.hc(next_1, "ready")) {
			this.loadNode(next_1);
			return;
		}
		var prev_1 = this._load_base._i > 0 ? this.nodes[this._load_base._i-1] : this.nodes[this.nodes.length-1];
		if(prev_1 && !u.hc(prev_1, "ready")) {
			this.loadNode(prev_1);
			return;
		}
		if(next_1) {
			var next_2 = this.nodes.length > next_1._i+1 ? this.nodes[next_1._i+1] : this.nodes[0];
			if(next_2 && !u.hc(next_2, "ready")) {
				this.loadNode(next_2);
				return;
			}
		}
		if(prev_1) {
			var prev_2 = prev_1._i > 0 ? this.nodes[prev_1._i-1] : this.nodes[this.nodes.length-1];
			if(prev_2 && !u.hc(prev_2, "ready")) {
				this.loadNode(prev_2);
				return;
			}
		}
		this._loaded();
		if(typeof(this.preloaded) == "function") {
			this.preloaded();
		}
	}
	slideshow.build = function() {
		var i, node;
		for(i = 0; node = this.nodes[i]; i++) {
			node.slideshow = this;
			node._i = i;
			u.a.transition(node, "none");
			u.a.translate(node, 0, -node.offsetHeight);
			if(typeof(this.buildNode)) {
				this.buildNode(node);
			}
			else {
				this._buildNode(node);
			}
			this._clearNode(node, "initial");
		}
		if(typeof(this.built) == "function") {
			this.built();
		}
		else {
			this.preload();
		}
	}
	slideshow._buildNode = function(node) {
		if(!node.initialized) {
			node.initialized = true;
			var item_id = u.cv(node, "item_id");
			var variant = u.cv(node, "variant");
			if(item_id) {
				node.loaded = function(queue) {
					u.as(this, "backgroundImage", "url("+queue[0]._image.src+")");
					u.a.transition(this, "none");
					u.a.translate(this, -this.offsetWidth, 0);
					u.as(this, "display", "block");
					u.ac(this, "ready");
					this.slideshow._ready();
				}
				if(variant) {
					u.preloader(node, ["/images/"+itemd_id+"/"+variant+"/"+this._width+"x.jpg"]);
				}
				else {
					u.preloader(node, ["/images/"+itemd_id+"/"+this._width+"x.jpg"]);
				}
			}
			else {
				u.a.transition(node, "none");
				u.a.translate(node, -node.offsetWidth, 0);
				u.as(node, "display", "block");
				u.ac(node, "ready");
				this._ready();
			}
		}
		else {
			this._ready();
		}
	}
	slideshow._clearNode = function(node, comment) {
		node._hidden = true;
		u.as(node, "display", "none");
		u.a.transition(node, "none");
	}
	slideshow._unclearNode = function(node, comment) {
		node._hidden = false;
		u.as(node, "display", "block");
	}
	slideshow.selectNode = function(index, static_update) {
		if(!this.selected_node) {
			this.selected_node = this.nodes[index];
			this._unclearNode(this.selected_node, "hard start show");
			u.a.transition(this.selected_node, "none");
			u.a.setOpacity(this.selected_node, 0);
			u.a.translate(this.selected_node, 0, 0);
			u.a.transition(this.selected_node, "none");
			u.a.setOpacity(this.selected_node, 1);
			if(typeof(this.nodeEntered) == "function") {
				this.nodeEntered(this.selected_node);
			}
		}
		else {
			var org_node = this.selected_node;
			this.direction = (index - org_node._i) > 0 ? 1 : -1;
			if(index < 0) {
				index = this.nodes.length-1;
			}
			else if(index >= this.nodes.length) {
				index = 0;
			}
			this.selected_node = this.nodes[index];
			this._unclearNode(this.selected_node, "new selected node");
			if(static_update) {
				u.a.transition(org_node, "none");
				u.a.transition(this.selected_node, "none");
			}
			else if(this.swiped) {
				var duration;
				if(this._layout == "vertical") {
					if(this.current_yps) {
						duration = ((this._height / Math.abs(this.current_yps)) * this._duration);
						duration = duration > this._duration ? this._duration : duration;
					}
					else {
						duration = this._duration / (1 - Math.abs(this.current_y / this._height));
					}
				}
				else {
					if(this.current_xps) {
						duration = ((this._width / Math.abs(this.current_xps)) * this._duration);
						duration = duration > this._duration ? this._duration : duration;
					}
					else {
						duration = this._duration / (1 - Math.abs(this.current_x / this._width));
					}
				}
				duration = (duration > 1.5) ? 1.5 : ((duration < 0.2) ? 0.2 : duration);
				u.a.transition(org_node, "all " + duration + "s " + this._transition);
				u.a.transition(this.selected_node, "all " + duration + "s " + this._transition);
			}
			else {
				if(this._layout == "vertical") {
					u.a.transition(this.selected_node, "none");
					u.a.translate(this.selected_node, 0, this._height*this.direction);
				}
				else {
					u.a.transition(this.selected_node, "none");
					u.a.translate(this.selected_node, this._width*this.direction, 0);
				}
				u.a.transition(org_node, "all " + this._duration + "s " + this._transition);
				u.a.transition(this.selected_node, "all " + this._duration + "s " + this._transition);
			}
			if(!static_update) {
				this.selected_node.transitioned = function() {
					u.a.transition(this, "none");
					if(typeof(this.slideshow.nodeEntered) == "function") {
						this.slideshow.nodeEntered(this);
					}
				}
			}
			if(org_node != this.selected_node) {
				org_node.transitioned = function() {
					if(this.slideshow.prev_node && this.slideshow.prev_node != this.slideshow.selected_node) {
						this.slideshow._clearNode(slideshow.prev_node, "prev node cleared on regular transistion");
					}
					if(this.slideshow.next_node && this.slideshow.next_node != this.slideshow.selected_node) {
						this.slideshow._clearNode(slideshow.next_node, "prev node cleared on regular transistion");
					}
					this.slideshow._clearNode(this, "org node cleared");
					if(typeof(this.slideshow.nodeCleared) == "function") {
						this.slideshow.nodeCleared(this);
					}
				}
			}
			if(this._layout == "vertical") {
				u.a.translate(org_node, 0, -(this._height*this.direction));
				u.a.translate(this.selected_node, 0, 0);
			}
			else {
				u.a.translate(org_node, -(this._width*this.direction), 0);
				u.a.translate(this.selected_node, 0, 0);
			}
			if(static_update && org_node != this.selected_node) {
				org_node.transitioned();
			}
		}
		this.preload();
		if(typeof(this.nodeSelected) == "function") {
			this.nodeSelected(this.selected_node);
		}
	}
	slideshow.nodes = u.qsa("li"+slideshow._selector, slideshow.list);
	return slideshow;
}


/*u-request.js*/
Util.createRequestObject = u.createRequestObject = function() {
	return new XMLHttpRequest();
}
Util.Request = u.request = function(node, url, settings) {
	node.request_url = url;
	node.request_method = "GET";
	node.request_async = true;
	node.request_params = "";
	node.request_headers = false;
	node.response_callback = "response";
	if(typeof(settings) == "object") {
		var argument;
		for(argument in settings) {
			switch(argument) {
				case "method"		: node.request_method		= settings[argument]; break;
				case "params"		: node.request_params		= settings[argument]; break;
				case "async"		: node.request_async		= settings[argument]; break;
				case "headers"		: node.request_headers		= settings[argument]; break;
				case "callback"		: node.response_callback	= settings[argument]; break;
			}
		}
	}
	if(node.request_method.match(/GET|POST|PUT|PATCH/i)) {
		node.HTTPRequest = this.createRequestObject();
		node.HTTPRequest.node = node;
		if(node.request_async) {
			node.HTTPRequest.onreadystatechange = function() {
				if(this.readyState == 4) {
					u.validateResponse(this);
				}
			}
		}
		try {
			if(node.request_method.match(/GET/i)) {
				var params = u.JSONtoParams(node.request_params);
				node.request_url += params ? ((!node.request_url.match(/\?/g) ? "?" : "&") + params) : "";
				node.HTTPRequest.open(node.request_method, node.request_url, node.request_async);
				node.HTTPRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				var csfr_field = u.qs('meta[name="csrf-token"]');
				if(csfr_field && csfr_field.content) {
					node.HTTPRequest.setRequestHeader("X-CSRF-Token", csfr_field.content);
				}
				if(typeof(node.request_headers) == "object") {
					var header;
					for(header in node.request_headers) {
						node.HTTPRequest.setRequestHeader(header, node.request_headers[header]);
					}
				}
				node.HTTPRequest.send("");
			}
			else if(node.request_method.match(/POST|PUT|PATCH/i)) {
				var params;
				if(typeof(node.request_params) == "object" && !node.request_params.constructor.toString().match(/FormData/i)) {
					params = JSON.stringify(node.request_params);
				}
				else {
					params = node.request_params;
				}
				node.HTTPRequest.open(node.request_method, node.request_url, node.request_async);
				node.HTTPRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				var csfr_field = u.qs('meta[name="csrf-token"]');
				if(csfr_field && csfr_field.content) {
					node.HTTPRequest.setRequestHeader("X-CSRF-Token", csfr_field.content);
				}
				if(typeof(node.request_headers) == "object") {
					var header;
					for(header in node.request_headers) {
						node.HTTPRequest.setRequestHeader(header, node.request_headers[header]);
					}
				}
				node.HTTPRequest.send(params);
			}
		}
		catch(exception) {
			node.HTTPRequest.exception = exception;
			u.validateResponse(node.HTTPRequest);
			return;
		}
		if(!node.request_async) {
			u.validateResponse(node.HTTPRequest);
		}
	}
	else if(node.request_method.match(/SCRIPT/i)) {
		var key = u.randomString();
		document[key] = new Object();
		document[key].node = node;
		document[key].responder = function(response) {
			var response_object = new Object();
			response_object.node = this.node;
			response_object.responseText = response;
			u.validateResponse(response_object);
		}
		var params = u.JSONtoParams(node.request_params);
		node.request_url += params ? ((!node.request_url.match(/\?/g) ? "?" : "&") + params) : "";
		node.request_url += (!node.request_url.match(/\?/g) ? "?" : "&") + "callback=document."+key+".responder";
		u.ae(u.qs("head"), "script", ({"type":"text/javascript", "src":node.request_url}));
	}
}
Util.JSONtoParams = function(json) {
	if(typeof(json) == "object") {
		var params = "", param;
		for(param in json) {
			params += (params ? "&" : "") + param + "=" + json[param];
		}
		return params
	}
	var object = u.isStringJSON(json);
	if(object) {
		return u.JSONtoParams(object);
	}
	return json;
}
Util.isStringJSON = function(string) {
	if(string.trim().substr(0, 1).match(/[\{\[]/i) && string.trim().substr(-1, 1).match(/[\}\]]/i)) {
		try {
			var test = JSON.parse(string);
			if(typeof(test) == "object") {
				test.isJSON = true;
				return test;
			}
		}
		catch(exception) {}
	}
	return false;
}
Util.isStringHTML = function(string) {
	if(string.trim().substr(0, 1).match(/[\<]/i) && string.trim().substr(-1, 1).match(/[\>]/i)) {
		try {
			var test = document.createElement("div");
			test.innerHTML = string;
			if(test.childNodes.length) {
				var body_class = string.match(/<body class="([a-z0-9A-Z_: ]+)"/);
				test.body_class = body_class ? body_class[1] : "";
				var head_title = string.match(/<title>([^$]+)<\/title>/);
				test.head_title = head_title ? head_title[1] : "";
				test.isHTML = true;
				return test;
			}
		}
		catch(exception) {}
	}
	return false;
}
Util.evaluateResponseText = function(responseText) {
	var object;
	if(typeof(responseText) == "object") {
		responseText.isJSON = true;
		return responseText;
	}
	else {
		var response_string;
		if(responseText.trim().substr(0, 1).match(/[\"\']/i) && responseText.trim().substr(-1, 1).match(/[\"\']/i)) {
			response_string = responseText.trim().substr(1, responseText.trim().length-2);
		}
		else {
			response_string = responseText;
		}
		var json = u.isStringJSON(response_string);
		if(json) {
			return json;
		}
		var html = u.isStringHTML(response_string);
		if(html) {
			return html;
		}
		return responseText;
	}
}
Util.validateResponse = function(response){
	var object = false;
	if(response) {
		try {
			if(response.status && !response.status.toString().match(/403|404|500/)) {
				object = u.evaluateResponseText(response.responseText);
			}
			else if(response.responseText) {
				object = u.evaluateResponseText(response.responseText);
			}
		}
		catch(exception) {
			response.exception = exception;
		}
	}
	if(object) {
		if(typeof(response.node[response.node.response_callback]) == "function") {
			response.node[response.node.response_callback](object);
		}
		// 
	}
	else {
		if(typeof(response.node.ResponseError) == "function") {
			response.node.ResponseError(response);
		}
		if(typeof(response.node.responseError) == "function") {
			response.node.responseError(response);
		}
	}
}


/*u-image.js*/
Util.Image = u.i = new function() {
	this.load = function(node, src) {
		var image = new Image();
		image.node = node;
		u.ac(node, "loading");
	    u.e.addEvent(image, 'load', u.i._loaded);
		u.e.addEvent(image, 'error', u.i._error);
		image.src = src;
	}
	this._loaded = function(event) {
		u.rc(this.node, "loading");
		if(typeof(this.node.loaded) == "function") {
			this.node.loaded(event);
		}
	}
	this._error = function(event) {
		u.rc(this.node, "loading");
		u.ac(this.node, "error");
		if(typeof(this.node.loaded) == "function" && typeof(this.node.failed) != "function") {
			this.node.loaded(event);
		}
		else if(typeof(this.node.failed) == "function") {
			this.node.failed(event);
		}
	}
	this._progress = function(event) {
		u.bug("progress")
		if(typeof(this.node.progress) == "function") {
			this.node.progress(event);
		}
	}
	this._debug = function(event) {
		u.bug("event:" + event.type);
		u.xInObject(event);
	}
}


/*u-grids.js*/
var default_grid = {
	"nodes":[
		{
			"proportion"	: 1.6,
			"width"			: 50,
			"class"			: "bottom"
		}
	]
}
u.grids = [
	{
		"min":false,
		"max":1024,
		"max_image":1024,
		"combined":[
			"768-grid_combined-1.json",
			"768-grid_combined-2.json"
		],
		"news":[
			"768-grid_news-1.json"
		],
		"default":default_grid
	},
	{
		"min":1024,
		"max":1200,
		"max_image":1200,
		"combined":[
			"1024-grid_combined-1.json",
			"1024-grid_combined-2.json"
		],
		"news":[
			"1024-grid_news-1.json"
		],
		"default":default_grid
	},
	{
		"min":1200,
		"max":false,
		"max_image":1600,
		"combined":[
			"1600-grid_combined-1.json",
			"1600-grid_combined-2.json"
		],
		"news":[
			"1600-grid_news-1.json"
		],
		"default":default_grid
	}
	
];
u.textscalers = {
	"intro":{
		"h1":{
			"unit":"rem",
			"min_size":3,
			"min_width":800,
			"max_size":6,
			"max_width":1500
		}
	},
	"front":{
		"h1":{
			"unit":"rem",
			"min_size":5,
			"min_width":700,
			"max_size":9,
			"max_width":1600
		},
		" > h2":{
			"unit":"rem",
			"min_size":1.38,
			"min_width":700,
			"max_size":1.9,
			"max_width":1400
		}
	},
	"news":{
		"h1":{
			"unit":"rem",
			"min_size":6.2,
			"min_width":700,
			"max_size":10.8,
			"max_width":1600
		},
		" > h2":{
			"unit":"rem",
			"min_size":1.2,
			"min_width":700,
			"max_size":1.54,
			"max_width":1400
		}
	},
	"about":{
		"h1":{
			"unit":"rem",
			"min_size":6.2,
			"min_width":700,
			"max_size":10.8,
			"max_width":1600
		},
		".group h2":{
			"unit":"rem",
			"min_size":5.2,
			"min_width":700,
			"max_size":9.6,
			"max_width":1600
		},
		".about h2":{
			"unit":"rem",
			"min_size":2.6,
			"min_width":700,
			"max_size":3.7,
			"max_width":1400
		}
	},
	"contact":{
		"h1":{
			"unit":"rem",
			"min_size":6.2,
			"min_width":700,
			"max_size":10.8,
			"max_width":1600
		},
		" > h2":{
			"unit":"rem",
			"min_size":1.2,
			"min_width":700,
			"max_size":1.54,
			"max_width":1400
		}
	},
	"competences":{
		"h1":{
			"unit":"rem",
			"min_size":6.2,
			"min_width":700,
			"max_size":10.8,
			"max_width":1600
		},
		" > h2":{
			"unit":"rem",
			"min_size":1.8,
			"min_width":700,
			"max_size":3.3,
			"max_width":1400
		},
		"h3":{
			"unit":"rem",
			"min_size":1.3,
			"min_width":700,
			"max_size":1.8,
			"max_width":1400
		},
		"li p":{
			"unit":"rem",
			"min_size":1.3,
			"min_width":700,
			"max_size":1.8,
			"max_width":1400
		}
	},
	"aboutdaily":{
		"h1":{
			"unit":"rem",
			"min_size":6.2,
			"min_width":700,
			"max_size":10.8,
			"max_width":1600
		},
		" > h2":{
			"unit":"rem",
			"min_size":1.2,
			"min_width":700,
			"max_size":1.54,
			"max_width":1400
		},
		".synergy h3":{
			"unit":"rem",
			"min_size":2.8,
			"min_width":700,
			"max_size":3.4,
			"max_width":1400
		}
	},
	"services":{
		"h1":{
			"unit":"rem",
			"min_size":6.2,
			"min_width":700,
			"max_size":10.8,
			"max_width":1600
		},
		"h2":{
			"unit":"rem",
			"min_size":1.38,
			"min_width":700,
			"max_size":1.54,
			"max_width":1400
		},
		"h4":{
			"unit":"rem",
			"min_size":1.38,
			"min_width":700,
			"max_size":1.54,
			"max_width":1400
		}
	},
	"playtype":{
		"h1":{
			"unit":"rem",
			"min_size":6.2,
			"min_width":700,
			"max_size":10.8,
			"max_width":1600
		},
		"h2":{
			"unit":"rem",
			"min_size":2.5,
			"min_width":700,
			"max_size":3.1,
			"max_width":1400
		},
		".love p":{
			"unit":"rem",
			"min_size":1.1,
			"min_width":700,
			"max_size":1.7,
			"max_width":1400
		},
		".store p":{
			"unit":"rem",
			"min_size":1.1,
			"min_width":700,
			"max_size":1.7,
			"max_width":1400
		}
	},
	"projects":{
		"h1":{
			"unit":"rem",
			"min_size":6.2,
			"min_width":700,
			"max_size":10.8,
			"max_width":1600
		},
		" > h2":{
			"unit":"rem",
			"min_size":1.2,
			"min_width":700,
			"max_size":1.54,
			"max_width":1400
		}
	},
	"plain":{
		"h1":{
			"unit":"rem",
			"min_size":6.2,
			"min_width":700,
			"max_size":10.8,
			"max_width":1600
		},
		" > h2":{
			"unit":"rem",
			"min_size":1.38,
			"min_width":700,
			"max_size":1.9,
			"max_width":1400
		}
	}
}


/*i-page.js*/
u.bug_console_only = true;
Util.Objects["page"] = new function() {
	this.init = function(page) {
		if(u.hc(page, "i:page")) {
			page.hN = u.qs("#header");
			page.cN = u.qs("#content");
			page.nN = u.qs("#navigation");
			page.nN = u.ie(page.hN, page.nN);
			page.fN = u.qs("#footer");
			page.resized = function() {
				var calc_width = u.browserW();
				if(page.intro && typeof(page.intro.resized) == "function" && page.intro.parentNode) {
					page.intro.resized();
				}
				if(page.cN && page.cN.scene && typeof(page.cN.scene.resized) == "function") {
					page.cN.scene.resized();
				}
				if(u.hc(page.nN, "open") && page.hN.overlay) {
					u.a.setHeight(page.hN.overlay, u.browserH());
				}
				if(calc_width < 700) {
					u.ac(document.body, "static");
				}
				else {
					u.rc(document.body, "static");
				}
				if(calc_width < 500 && typeof(page.switchToMobile) == "function") {
					page.switchToMobile();
				}
				else if(calc_width > 500 && typeof(page.switchToMobileOutdated) == "function") {
					page.switchToMobileOutdated();
				}
			}
			page.switchToMobile = function() {
				this.switchToMobileSwitch = this.switchToMobile;
				this.switchToMobile = false;
				this.mobileSwitch = u.ae(document.body, "div", {"id":"mobile_switch"});
				u.a.setOpacity(this.mobileSwitch, 0);
				u.ae(this.mobileSwitch, "h1", {"html":"Hello curious"});
				u.ae(this.mobileSwitch, "p", {"html":"If you are looking for a mobile version of this site, using an actual mobile phone is a really good idea."});
				u.ae(this.mobileSwitch, "p", {"html":"We care about our endusers. They are the reason we build websites. We'd rather give them the best possible experience, than build something which showcases well in an internal meeting."});
				u.ae(this.mobileSwitch, "p", {"html":"If you want to know more about our method, feel free to give us a call, +45 3325 4500."});
				u.a.transition(this.mobileSwitch, "all 0.5s ease-in-out");
				u.a.setOpacity(this.mobileSwitch, 1);
				this.switchToMobileOutdated = function() {
					page.switchToMobile = page.switchToMobileSwitch;
					page.switchToMobileOutdated = false;
					this.mobileSwitch.transitioned = function() {
						u.a.transition(this, "none");
						this.parentNode.removeChild(this);
					}
					u.a.transition(this.mobileSwitch, "all 0.3s ease-in-out");
					u.a.setOpacity(this.mobileSwitch, 0);
				}
			}
			page.scrolled = function() {
				if(page.cN && page.cN.scene && typeof(page.cN.scene.scrolled) == "function") {
					page.cN.scene.scrolled();
				}
			}
			page.ready = function() {
				if(!this.intro) {
					this.cN.ready();
					page.hN.transitioned = function() {
						u.a.transition(this, "none");
					}
					u.a.transition(page.hN, "all 0.3s ease-in-out");
					u.a.setOpacity(page.hN, 1);
				}
				if(!u.hc(this, "ready")) {
					this.top_offset = parseInt(u.gcs(this, "margin-top"));
					u.addClass(this, "ready");
					u.a.transition(this, "none");
					u.a.setOpacity(this, 1);
					u.e.addEvent(window, "resize", page.resized);
					u.e.addEvent(window, "scroll", page.scrolled);
					this.resized();
					this.cN.scene = u.qs(".scene", this.cN);
					u.navigation(page);
					page.initNavigation();
				}
			}
			page.cN.ready = function() {
				if(!page.intro && u.hc(page, "ready") && u.hc(this, "ready") && u.hc(this.scene, "ready")) {
					var destroying = false;
					var scenes = u.qsa(".scene", this);
						for(i = 0; scene = scenes[i]; i++) {
							if(scene != this.scene){
								if(typeof(scene.destroy) == "function") {
									destroying = true;
									scene.destroy();
								}
								else {
								}
							}
						}
					if(!destroying && this.scene && !this.scene.built && typeof(this.scene.build) == "function") {
						window.scrollTo(0, 0);
						this.scene.built = true;
						this.scene.build();
					}
				}
			}
			page.cN.navigate = function(url) {
				this.response = function(response) {
					u.setClass(document.body, response.body_class);
					document.title = response.head_title;
					this.scene = u.qs(".scene", response);
					this.scene = u.ae(this, this.scene);
					u.init(this);
				}
				u.request(this, u.h.getCleanHash(url));
			}
			page.cN.cleanScenes = function() {
				while(u.qsa(".scene", this).length > 1) {
					var scene = u.qs(".scene", this);
					scene.parentNode.removeChild(scene);
				}
			}
			page.initNavigation = function() {
				page.hN.mover = function() {
					this.transitioned = function() {
						u.a.transition(this, "none");
					}
					u.a.transition(this, "all 0.2s linear");
					u.as(this, "backgroundColor", "rgba(255, 255, 255, 0.9)");
				}
				page.hN.mout = function() {
					this.transitioned = function() {
						u.a.transition(this, "none");
					}
					u.a.transition(this, "all 0.2s linear");
					u.as(this, "backgroundColor", "rgba(255, 255, 255, 0)");
				}
				if(u.e.event_pref == "mouse") {
					page.hN.onmouseover = page.hN.mover;
					page.hN.onmouseout = page.hN.mout; 
				}
				else {
					u.e.addStartEvent(page.hN, page.hN.mover);
					u.e.addEndEvent(page.hN, page.hN.mout);
				}
				page.hN.overlay = u.ae(page.hN, "div", {"class":"navigation_overlay"});
				u.e.click(page.hN.overlay);
				page.hN.overlay.clicked = function() {
					page.navController(page.hN.overlay._for);
				}
				var i, node;
				this.nav_nodes = u.qsa("li", this.hN);
				for(i = 0; node = this.nav_nodes[i]; i++) {
					node.submenu = u.qs(".submenu", node);
					u.ce(node);
						if(!u.hc(node.parentNode, "subjects")) {
							if(u.e.event_pref == "mouse") {
								node.onmouseover = function() {
									this.transitioned = function() {
										u.a.transition(this, "none");
									}
									u.a.transition(this, "all 0.2s linaer");
									if(u.hc(this, "etypes")) {
										u.as(this, "color", "rgba(24, 76, 27, 1)");
									}
									else if(u.hc(this, "daily")) {
										u.as(this, "color", "rgba(0, 32, 124, 1)");
									}
									else {
										u.as(this, "color", "rgba(0, 0, 0, 0.7)");
									}
								}
								node.onmouseout = function() {
									if(!u.hc(this, "open")) {
										this.transitioned = function() {
											u.a.transition(this, "none");
										}
										u.a.transition(this, "all 0.2s linaer");
										u.as(this, "color", "rgba(0, 0, 0, 0.4)");
									}
								}
							}
						}
						if(node.submenu) {
							node.submenu.nodes = u.qsa("li", node.submenu);
							if(u.e.event_pref == "mouse") {
								var j, sub;
								for(j = 0; sub = node.submenu.nodes[j]; j++) {
									sub.onmouseover = function() {
										this.transitioned = function() {
											u.a.transition(this, "none");
										}
										u.a.transition(this, "all 0.2s linaer");
										u.ac(this, "over");
									}
									sub.onmouseout = function() {
										this.transitioned = function() {
											u.a.transition(this, "none");
										}
										u.a.transition(this, "all 0.2s linaer");
										u.rc(this, "over");
									}
								}
							}
						}
						node.clicked = function(event) {
							u.e.kill(event);
							page.navController(this);
						}
				}
			}
			page.navController = function(node) {
				var i, node, subject;
				var open_node = u.qs(".open", this.nN);
				this.hN.overlay._for = false;
				if(!open_node && node.submenu) {
					this.hN.overlay._for = node;
					this.showNavOverlay();
				}
				else if(open_node && (!node.submenu || node == open_node)) {
					this.hN.overlay._for = false;
					this.hideNavSubmenu(open_node);
				}
 				else if(open_node && node != open_node && node.submenu) {
					this.hN.overlay._for = node;
					this.hideNavSubmenu(open_node);
				}
				if(!node.submenu) {
					page.navigate(node.url, page.nN);
				}
			}
			page.showNavOverlay = function() {
				u.ac(this.nN, "open");
				u.a.transition(this.hN.overlay, "none");
				u.a.setHeight(this.hN.overlay, u.browserH());
				this.hN.overlay.transitioned = function() {
					u.a.transition(this, "none");
					page.showNavSubmenu(this._for);
				}
				if(u.gcs(this.hN.overlay, "opacity") != 1) {
					u.a.transition(this.hN.overlay, "all 0.5s ease-in");
					u.a.setOpacity(this.hN.overlay, 1);
				}
				else {
					this.hN.overlay.transitioned();
				}
			}
			page.hideNavOverlay = function() {
				u.rc(page.nN, "open");
				page.hN.overlay.transitioned = function() {
					u.a.setHeight(this, 0);
				}
				if(u.gcs(page.hN.overlay, "opacity") != 0) {
					u.a.transition(this.hN.overlay, "all 0.5s ease-in");
					u.a.setOpacity(this.hN.overlay, 0);
				}
				else {
					this.hN.overlay.transitioned();
				}
			}
			page.showNavSubmenu = function(node) {
				u.ac(node, "open");
				u.a.transition(node.submenu, "none");
				u.a.setOpacity(node.submenu, 0);
				for(i = 0; subject = node.submenu.nodes[i]; i++) {
					u.a.transition(subject, "none");
					u.a.setOpacity(subject, 0);
				}
				u.as(node.submenu, "display", "block");
				node.submenu.transitioned = function(event) {
					u.a.transition(this, "none");
				}
				u.a.transition(node.submenu, "all 0.5s ease-in-out");
				u.a.setOpacity(node.submenu, 1);
				var i, sub, delay;
				for(i = 0; sub = node.submenu.nodes[i]; i++) {
					sub.transitioned = function() {
						u.a.transition(this, "none");
					}
					delay = 200*i;
					u.a.transition(sub, "all 0.3s ease-in-out "+delay+"ms");
					u.a.setOpacity(sub, 1);
				}
			}
			page.hideNavSubmenu = function(node) {
				u.rc(node, "open");
				node.onmouseout();
				node.submenu.transitioned = function(event) {
					u.a.transition(this, "none");
					u.as(this, "display", "none");
					if(page.hN.overlay._for) {
						page.showNavSubmenu(page.hN.overlay._for);
					}
					else {
						page.hideNavOverlay();
					}
				}
				if(u.gcs(node.submenu, "opacity") != 0) {
					u.a.transition(node.submenu, "all 0.3s ease-in-out");
					u.a.setOpacity(node.submenu, 0);
				}
				else {
					node.submenu.transitioned();
				}
			}
			page.cN.isUnderFold = function() {
				if(this.scene.gridmaster && this.scene.gridmaster.nodes) {
					var i, node, fold_detection;
					var browser_height = u.browserH();
					var scroll_y = u.scrollY();
					var scene_height = this.scene.offsetHeight;
					this.scene._fold_top = (browser_height * this.scene._fold_offset) + scroll_y;
					this.scene._fold_bottom = browser_height + scroll_y;
					this.scene._fold_height = this.scene._fold_bottom - this.scene._fold_top;
					for(i = 0; node = this.scene.gridmaster.nodes[i]; i++) {
						if(node._offset_below_fold || node.gm_video) {
							if(node._fold_detection < this.scene._fold_top || (node._row != undefined && node._row === 0)) {
								if(!node._above_fold) {
									node._above_fold = true;
									node._unfolding = false;
									node._below_fold = false;
									if(node.gm_video) {
										node.gm_video.play();
									}
									u.a.translate(node, 0, 0);
									u.a.removeTransform(node);
								}
							}
							else if(node._fold_detection > this.scene._fold_top && node._fold_detection < this.scene._fold_bottom) {
								if(!node._unfolding) {
									node._unfolding = true;
									node._above_fold = false;
									node._below_fold = false;
									if(node.gm_video) {
										node.gm_video.play();
									}
								}
								var unfold_progress = (node._fold_detection - this.scene._fold_top) / (this.scene._fold_height);
								var test = page.easeIn(unfold_progress)
								var unfold_padding = Math.round(node._offset_below_fold*test);
									if(unfold_padding != node._y) {
										u.a.translate(node, 0, unfold_padding);
									}
							}
							else if(node._fold_detection > this.scene._fold_bottom) {
								if((node._unfolding || node._above_fold) && !node._below_fold) {
									node._below_fold = true;
									node._unfolding = false;
									node._above_fold = false;
									if(node.gm_video) {
										node.gm_video.pause();
									}
									u.a.translate(node, 0, node._offset_below_fold);
								}
							}
						}
					}
				}
				page.offsetHeight;
			}
			page.easeOut = function(t) {
				return 1 - Math.pow(1 - t/1, 5);
			}
			page.easeIn = function(t) {
				return Math.pow(t/1, 4);
			}
			page.footerInTransition = function() {
				this.fN.transitioned = function() {
					u.a.transition(this, "none");
					u.as(this, "height", "auto");
				}
				u.a.transition(this.fN, "none");
				u.a.setOpacity(this.fN, 0);
			}
			page.initIntro = function() {
				page.intro = u.ae(document.body, "div", {"id":"intro"});
				u.ac(document.body, "intro");
				u.e.click(page.intro);
				page.intro.clicked = function() {
					u.t.resetTimer(page.intro.t_intro);
					this.transitioned = function() {
						this.parentNode.removeChild(this);
						u.t.resetTimer(this.t_close);
						page.intro = false;
						page.ready();
					}
					u.a.transition(this, "all 0.5s ease-in");
					u.a.setOpacity(this, 0);
				}
				page.intro.t_intro = u.t.setTimer(page.intro, page.intro.clicked, 4000);
				page.intro.transitioned = function() {
					u.a.transition(this, "none");
					var h1 = u.ae(this, "h1", {"html":"We are e-Types,<br>e-Types Daily and Playtype.<br><br>This is just the beginning."})
					h1.typedin = u.ae(this, "div", {"class":"typedin", "html":'Typed in Nationale Regular & DemiBold – available from <a target="_blank" href="http://playtype.com/font/nationale">Playtype</a>'});
					h1.transitioned = function() {
						u.a.transition(this.typedin, "all 0.5s ease-in");
						u.a.setOpacity(this.typedin, 1);
						u.a.transition(this, "none");
					}
					u.a.setOpacity(h1, 0);
					u.a.transition(h1, "all 0.5s ease-in");
					u.a.setOpacity(h1, 1);
				}
				var scale = u.textscalers["intro"];
				u.textscaler(page.intro, scale);
				u.a.transition(page.intro, "all 0.5s ease-in");
				u.a.setOpacity(page.intro, 1);
			}
			if(!location.hash) {
				page.initIntro();
			}
			page.ready();
		}
	}
}
function static_init() {
	u.o.page.init(u.qs("#page"));
}
u.e.addDOMReadyEvent(static_init);


/*i-about.js*/
Util.Objects["about"] = new function() {
	this.init = function(scene) {
		scene.resized = function() {
			var calc_width = u.browserW();
			calc_width = calc_width < 700 ? 700 : calc_width;
			var prop = (calc_width-700) / (1600-700);
			prop = prop > 1 ? 1 : prop;
			var padding_left = 30+Math.round((110-30)*prop);
			var deco1_width = Math.round((calc_width-30)*0.62);
			var deco2_width = Math.round((calc_width-30)*0.38);
			var deco3_width = Math.round((calc_width-30)*0.39);
			var deco4_width = Math.round((calc_width-30)*0.61);
			if(this.deco1) {
				u.as(this.deco1, "width", deco1_width+"px", false);
			}
			if(this.deco2) {
				u.as(this.deco2, "width", deco2_width+"px", false);
				u.as(this.deco2, "left", (deco1_width+30)+"px", false);
			}
			u.as(this._about, "paddingTop", Math.round(deco1_width/1.8)+"px", false);
			u.as(this._about, "paddingLeft", padding_left+"px", false);
			u.as(this._about, "width", 400+Math.round((700-400)*prop)+"px", false);
			var deco3_top = this._about.offsetTop + this._about.offsetHeight - (deco3_width*0.89);
			if(this.deco3) {
				u.as(this.deco3, "width", deco3_width+"px", false);
				u.as(this.deco3, "top", deco3_top+"px", false);
			}
			if(this.deco4 && this.deco3._img) {
				u.as(this.deco4, "width", deco4_width+"px", false);
				u.as(this.deco4, "top", deco3_top + this.deco3._img.offsetHeight+"px", false);
				u.as(this.deco4, "left", (deco3_width+15)+"px", false);
			}
			u.as(this._theway, "top", (Math.round(deco2_width/0.83)+115)+"px", false);
			u.as(this._theway, "left", (deco1_width+30)+"px", false);
			u.as(this._theway, "width", 250+Math.round((500-250)*prop)+"px", false);
			var group_top = (Math.round(deco3_width/0.92)+deco3_top);
			u.as(this._group, "paddingLeft", padding_left+"px", false);
			u.as(this._group, "top", group_top+"px", false);
			u.as(this._group, "width", 230+Math.round((350-230)*prop)+"px", false);
			u.as(this._hard, "width", deco3_width-padding_left+"px", false);
			u.as(this._soft, "width", deco3_width-padding_left+"px", false);
			u.as(this._companyinfo, "paddingLeft", padding_left+"px", false);
			if(this.deco4 && this.deco4._img) {
				if(this.deco4.offsetHeight + this.deco4.offsetTop > group_top + this._group.offsetHeight) {
					u.as(this._companyinfo, "top", this.deco4.offsetHeight + this.deco4.offsetTop +"px", false);
				}
				else {
					u.as(this._companyinfo, "top", (group_top + this._group.offsetHeight) +"px", false);
				}
			}
			else {
				u.as(this._companyinfo, "top", (group_top + this._group.offsetHeight) +"px", false);
			}
			u.a.setHeight(this, (this._companyinfo.offsetTop + this._companyinfo.offsetHeight) +"px", false);
			this.offsetHeight;
		}
		scene.scrolled = function() {
		}
		scene.ready = function(queue) {
			var scale = u.textscalers["about"];
			u.textscaler(this, scale);
			u.ac(this, "ready");
			u.ac(page.cN, "ready");
			page.cN.ready();
		}
		scene.build = function() {
			u.a.transition(this, "none");
			u.a.setOpacity(this, 1);
			if(!this.blocks) {
				this._about = u.qs(".about", this);
				this._theway = u.qs(".theway", this);
				this._group = u.qs(".group", this);
				this._companyinfo = u.qs("#companyinfo", this);
				this._hard = u.qs(".hard", this._companyinfo);
				this._soft = u.qs(".soft", this._companyinfo);
				this.blocks = u.qsa("h1,.scene .about h2,.scene .about p,.theway,.group,#companyinfo", this);
				this.resized();
				var i, node, node_y;
				var delay = 150;
				for(i = 0; node = this.blocks[i]; i++) {
					node.transitioned = function() {
						u.a.transition(this, "none");
					}
					u.a.transition(node, "opacity "+delay+"ms linear "+(i*delay)+"ms");
					u.a.setOpacity(node, 1);
				}
				this.deco1 = u.ae(this, "div", {"class":"deco deco1"});
				this.deco1.scene = this;
				this.deco1._img = u.ae(this.deco1, "img");
				this.deco1._src = "/img/desktop/about_1.jpg";
				u.ae(this.deco1, "p", {"html":"Kasper Sonne, Borderline (New Territory), 2013<br />Tracey Emin, Tattoo, 2001<br />David Shrigley, Untitled (How Are You Feeling?), 2006<br />"});
				this.deco2 = u.ae(this, "div", {"class":"deco deco2"});
				this.deco2.scene = this;
				this.deco2._img = u.ae(this.deco2, "img");
				this.deco2._src = "/img/desktop/about_2.jpg";
				this.deco3 = u.ae(this, "div", {"class":"deco deco3"});
				this.deco3.scene = this;
				this.deco3._img = u.ae(this.deco3, "img");
				this.deco3._src = "/img/desktop/about_3.jpg";
				this.deco4 = u.ae(this, "div", {"class":"deco deco4"});
				this.deco4.scene = this;
				this.deco4._img = u.ae(this.deco4, "img");
				this.deco4._src = "/img/desktop/about_4.jpg";
				u.ae(this.deco4, "p", {"html":"Vesterbrogade 80B, 1620, CPH V"});
				this.deco_i = 1;
				this.loadDeco = function(queue) {
					if(this.deco_i <= 4) {
						u.preloader(this["deco"+this.deco_i], [this["deco"+this.deco_i]._src], {"callback":this._decoReady});
						this.deco_i++;
					}
				}
				this._decoReady = function(queue) {
					this._img.src = queue[0]._image.src;
					this.scene.resized();
					this.transitioned = function() {
						u.a.transition(this, "none");
						this.scene.loadDeco();
					}
					u.a.transition(this, "opacity 0.5s ease-in");
					u.a.setOpacity(this, 1);
				}
				u.t.setTimer(this, this.loadDeco, 450);
			}
			this.resized();
			u.a.transition(page.fN, "none");
			u.a.setOpacity(page.fN, 1);
		}
		scene.decoOff = function(deco, delay) {
			u.a.transition(deco, "opacity 0.3s ease-in "+delay+"ms");
			u.a.setOpacity(deco, 0);
		}
		scene.destroy = function() {
			this.destroy = null;
			this.finalizeDestruction = function() {
				page.footerInTransition();
				this.parentNode.removeChild(this);
				page.cN.ready();
			}
			if(this.blocks) {
				var i, node, node_y, j = 0;
				var calc_height = u.browserH();
				var scroll_offset = u.scrollY();
				this.decoOff(this.deco1, 0);
				this.decoOff(this.deco2, 150);
				this.decoOff(this.deco3, 300);
				this.decoOff(this.deco4, 450);
				var delay = 150;
				for(i = 0; node = this.blocks[i]; i++) {
					node_y = u.absY(node);
					if(node_y + node.offsetHeight > scroll_offset && node_y < scroll_offset + calc_height) {
						j++;
						u.a.transition(node, "all "+delay+"ms linear "+((j*delay)+300)+"ms");
						u.a.setOpacity(node, 0);
					}
				}
				u.t.setTimer(this, this.finalizeDestruction, (j*delay) + 200);
			}
			else {
				this.finalizeDestruction();
			}
		}
		scene.ready();
	}
}

/*i-aboutdaily.js*/
Util.Objects["aboutdaily"] = new function() {
	this.init = function(scene) {
		scene.resized = function() {
			var calc_width = u.browserW();
			calc_width = calc_width < 700 ? 700 : calc_width;
			var prop = (calc_width-700) / (1600-700);
			prop = prop > 1 ? 1 : prop;
			var deco_width = Math.round((calc_width-45)*0.50);
			var column_width = 245+Math.round((400-305)*prop);
			var padding_left = deco_width-column_width-60;
			if(this.deco1) {
				u.as(this.deco1, "width", deco_width+"px", false);
				u.as(this.deco1._img, "height", Math.round(deco_width/1.62)+"px", false);
			}
			if(this.deco2) {
				u.as(this.deco2, "width", deco_width+"px", false);
			}
			if(this.deco3) {
				u.as(this.deco3, "width", deco_width+"px", false);
				u.as(this.deco3._img, "height", Math.round(deco_width/1.62)+"px", false);
			}
			if(this.deco4) {
				u.as(this.deco4, "width", deco_width+"px", false);
			}
			if(this._column_a) {
				u.as(this._column_a, "width", column_width+"px", false);
				u.as(this._column_a, "paddingLeft", padding_left+"px", false);
				u.as(this._column_b, "width", column_width+"px", false);
			}
			if(this._contact) {
				u.as(this._contact, "paddingLeft", padding_left+"px", false);
			}
			if(this._synergy) {
				u.as(this._synergy, "paddingLeft", padding_left+"px", false);
			}
			this.offsetHeight;
		}
		scene.scrolled = function() {
		}
		scene.ready = function(queue) {
			var scale = u.textscalers["aboutdaily"];
			u.textscaler(this, scale);
			var why = u.qs(".why", this);
			var what = u.qs(".what", this);
			var how = u.qs(".how", this);
			var who = u.qs(".who", this);
			this._column_a = u.we(why, "div", {"class":"column_a"});
			u.ae(this._column_a, what);
			this._column_b = u.we(how, "div", {"class":"column_b"});
			u.ae(this._column_b, who);
			u.ac(this, "ready");
			u.ac(page.cN, "ready");
			page.cN.ready();
		}
		scene.build = function() {
			u.a.transition(this, "none");
			u.a.setOpacity(this, 1);
			if(!this.blocks) {
				this._synergy = u.qs(".synergy", this);
				this._contact = u.qs(".contact", this);
				this.blocks = u.qsa("h1,h2,.why,.what,.how,.who,.contact,.synergy", this);
				var i, node, node_y;
				var delay = 150;
				for(i = 0; node = this.blocks[i]; i++) {
					node.transitioned = function() {
						u.a.transition(this, "none");
					}
					u.a.transition(node, "opacity "+delay+"ms linear "+(i*delay)+"ms");
					u.a.setOpacity(node, 1);
				}
				this.deco1 = u.ae(this, "div", {"class":"deco deco1"});
				this.insertBefore(this.deco1, this._column_a);
				this.deco1.scene = this;
				this.deco1._img = u.ae(this.deco1, "img");
				this.deco1._src = "/img/desktop/aboutdaily_1.jpg";
				this.deco2 = u.ae(this, "div", {"class":"deco deco2"});
				this.insertBefore(this.deco2, this._column_a);
				this.deco2.scene = this;
				this.deco2.videoplayer = u.videoPlayer();
				this.deco2.videoplayer.scene = this;
				u.ae(this.deco2, this.deco2.videoplayer);
				this.deco2._src = "/media/videos/hello_daily.mp4";
				this.deco3 = u.ae(this, "div", {"class":"deco deco3"});
				this.insertBefore(this.deco3, this._synergy);
				this.deco3.scene = this;
				this.deco3._img = u.ae(this.deco3, "img");
				this.deco3._src = "/img/desktop/aboutdaily_3.jpg";
				this.deco4 = u.ae(this, "div", {"class":"deco deco4"});
				this.insertBefore(this.deco4, this._synergy);
				this.deco4.scene = this;
				this.deco4._img = u.ae(this.deco4, "img");
				this.deco4._src = "/img/desktop/aboutdaily_4.png";
				this.deco_i = 1;
				this.loadDeco = function() {
					if(this.deco_i <= 4) {
						if(this["deco"+this.deco_i]._img) {
							u.preloader(this["deco"+this.deco_i], [this["deco"+this.deco_i]._src], {"callback":this._decoReady});
						}
						else {
							this["deco"+this.deco_i].videoplayer.ended = function() {
								this.play();
							}
							this["deco"+this.deco_i].videoplayer.canplaythrough = function() {
								this.scene.resized();
								this.parentNode.transitioned = function() {
									u.a.transition(this, "none");
									this.scene.loadDeco();
								}
								u.a.transition(this.parentNode, "opacity 0.5s linear 0.5s");
								u.a.setOpacity(this.parentNode, 1);
							}
							this["deco"+this.deco_i].videoplayer.loadAndPlay(this["deco"+this.deco_i]._src);
						}
						this.deco_i++;
					}
				}
				this._decoReady = function(queue) {
					this._img.src = queue[0]._image.src;
					this.scene.resized();
					this.transitioned = function() {
						u.a.transition(this, "none");
						this.scene.loadDeco();
					}
					u.a.transition(this, "opacity 0.5s ease-in");
					u.a.setOpacity(this, 1);
				}
				u.t.setTimer(this, this.loadDeco, 450);
			}
			this.resized();
			u.a.transition(page.fN, "none");
			u.a.setOpacity(page.fN, 1);
		}
		scene.destroy = function() {
			this.destroy = null;
			this.finalizeDestruction = function() {
				page.footerInTransition();
				this.parentNode.removeChild(this);
				page.cN.ready();
			}
			if(this.blocks) {
				u.a.transition(this.deco1, "all 0.2s linear");
				u.a.setOpacity(this.deco1, 0);
				u.a.transition(this.deco2, "all 0.2s linear");
				u.a.setOpacity(this.deco2, 0);
				u.a.transition(this.deco3, "all 0.2s linear");
				u.a.setOpacity(this.deco3, 0);
				u.a.transition(this.deco4, "all 0.2s linear");
				u.a.setOpacity(this.deco4, 0);
				var i, node, node_y, j = 0;
				var calc_height = u.browserH();
				var scroll_offset = u.scrollY();
				var delay = 150;
				for(i = 0; node = this.blocks[i]; i++) {
					node_y = u.absY(node);
					if(node_y + node.offsetHeight > scroll_offset && node_y < scroll_offset + calc_height) {
						j++;
						u.a.transition(node, "all "+delay+"ms linear "+(j*delay)+"ms");
						u.a.setOpacity(node, 0);
					}
				}
				u.t.setTimer(this, this.finalizeDestruction, (j*delay) + 200);
			}
			else {
				this.finalizeDestruction();
			}
		}
		scene.ready();
	}
}

/*i-contact.js*/
Util.Objects["contact"] = new function() {
	this.init = function(scene) {
		scene.resized = function() {
			this.offsetHeight;
		}
		scene.scrolled = function() {
		}
		scene.ready = function(queue) {
			var scale = u.textscalers["contact"];
			u.textscaler(this, scale);
			u.ac(this, "ready");
			u.ac(page.cN, "ready");
			page.cN.ready();
		}
		scene.build = function() {
			u.a.transition(this, "none");
			u.a.setOpacity(this, 1);
			if(!this.blocks) {
				this.blocks = u.qsa("h1,.vcard.company,.partners,.apply,.etypes,.daily,.group,.playtype,#companyinfo", this);
				var i, node, node_y;
				var delay = 150;
				for(i = 0; node = this.blocks[i]; i++) {
					node.transitioned = function() {
						u.a.transition(this, "none");
					}
					u.a.transition(node, "all "+delay+"ms linear "+(i*delay)+"ms");
					u.a.setOpacity(node, 1);
				}
				var group = u.qs(".actions .moregroup", this);
				u.ce(group);
				group.clicked = function() {
					u.scrollTo(u.qs("#companyinfo"), {"offset_y":50});
				}
			}
			this.resized();
			u.a.transition(page.fN, "none");
			u.a.setOpacity(page.fN, 1);
		}
		scene.destroy = function() {
			this.destroy = null;
			this.finalizeDestruction = function() {
				page.footerInTransition();
				this.parentNode.removeChild(this);
				page.cN.ready();
			}
			if(this.blocks) {
				var i, node, node_y, j = 0;
				var calc_height = u.browserH();
				var scroll_offset = u.scrollY();
				var delay = 150;
				for(i = 0; node = this.blocks[i]; i++) {
					node_y = u.absY(node);
					if(node_y + node.offsetHeight > scroll_offset && node_y < scroll_offset + calc_height) {
						j++;
						u.a.transition(node, "all "+delay+"ms linear "+(j*delay)+"ms");
						u.a.setOpacity(node, 0);
					}
				}
				u.t.setTimer(this, this.finalizeDestruction, (j*delay) + 200);
			}
			else {
				this.finalizeDestruction();
			}
		}
		scene.ready();
	}
}

/*i-competences.js*/
Util.Objects["competences"] = new function() {
	this.init = function(scene) {
		scene.resized = function() {
			var calc_width = u.browserW();
			calc_width = calc_width < 700 ? 700 : calc_width;
			var prop = (calc_width-700) / (1600-700);
			prop = prop > 1 ? 1 : prop;
			var deco1_width = 293+Math.round((520-293)*prop);
			var deco2_width = 294+Math.round((543-294)*prop);
			var deco3_width = Math.round((calc_width-30)*0.73);
			var deco4_width = Math.round((calc_width-30)*0.27);
			u.as(this._ul, "paddingLeft", 330+Math.round((600-330)*prop)+"px", false);
			u.as(this._ul, "width", 350+Math.round((530-350)*prop)+"px", false);
			if(this.deco1) {
				u.as(this.deco1, "width", deco1_width+"px", false);
			}
			u.as(this._theway, "top", (Math.round(deco1_width/0.73)+115)+"px", false);
			u.as(this._theway, "paddingLeft", 30+Math.round((105-30)*prop)+"px", false);
			u.as(this._theway, "width", 215+Math.round((300-215)*prop)+"px", false);
			if(this.deco2) {
				u.as(this.deco2, "width", deco2_width+"px", false);
				u.as(this.deco2, "height", deco2_width+"px", false);
			}
			var deco3_top = (u.absY(this._ul)+this._ul.offsetHeight);
			if(this.deco3) {
				u.as(this.deco3, "width", deco3_width+"px", false);
				u.as(this.deco3, "top", deco3_top+"px", false);
				u.as(this.deco3, "left", (deco4_width+15)+"px", false);
			}
			if(this.deco4 && this.deco3.videoplayer) {
				u.as(this.deco4, "width", deco4_width+"px", false);
				u.as(this.deco4, "top", deco3_top + (this.deco3.videoplayer.offsetHeight - this.deco4.offsetHeight) + "px", false);
				u.a.setHeight(this, (this.deco4.offsetTop + this.deco4.offsetHeight) +"px", false);
			}
			else {
				u.a.setHeight(this, (this._ul.offsetTop + this._ul.offsetHeight) +"px", false);
			}
			this.offsetHeight;
		}
		scene.scrolled = function() {
		}
		scene.ready = function(queue) {
			var scale = u.textscalers["competences"];
			u.textscaler(this, scale);
			u.ac(this, "ready");
			u.ac(page.cN, "ready");
			page.cN.ready();
		}
		scene.build = function() {
			u.a.transition(this, "none");
			u.a.setOpacity(this, 1);
			if(!this.blocks) {
				this._ul = u.qs("ul", this);
				this._theway = u.qs(".theway", this);
				this.blocks = u.qsa("h1,h2.main,li,.theway", this);
				this.resized();
				var i, node, node_y;
				var delay = 150;
				for(i = 0; node = this.blocks[i]; i++) {
					node.transitioned = function() {
						u.a.transition(this, "none");
					}
					u.a.transition(node, "all "+delay+"ms linear "+(i*delay)+"ms");
					u.a.setOpacity(node, 1);
				}
				this.deco1 = u.ae(this, "div", {"class":"deco deco1"});
				this.deco1.scene = this;
				this.deco1._img = u.ae(this.deco1, "img");
				this.deco1._src = "/img/desktop/competences_1.jpg";
				this.deco2 = u.ae(this, "div", {"class":"deco deco2"});
				this.deco2.scene = this;
				this.deco2.videoplayer = u.videoPlayer();
				this.deco2.videoplayer.scene = this;
				u.ae(this.deco2, this.deco2.videoplayer);
				this.deco2._src = "/media/videos/dot.mp4";
				this.deco3 = u.ae(this, "div", {"class":"deco deco3"});
				this.deco3.scene = this;
				this.deco3.videoplayer = u.videoPlayer();
				this.deco3.videoplayer.scene = this;
				u.ae(this.deco3, this.deco3.videoplayer);
				this.deco3._src = "/media/videos/screen.mp4";
				u.ae(this.deco3, "p", {"html":"Screensizes, Opensignal.com"});
				this.deco4 = u.ae(this, "div", {"class":"deco deco4"});
				this.deco4.scene = this;
				this.deco4._img = u.ae(this.deco4, "img");
				this.deco4._src = "/img/desktop/competences_3.jpg";
				u.ae(this.deco4, "p", {"html":"Mads Lynneryp, If you see something interesting... , 2007"});
				this.deco_i = 1;
				this.loadDeco = function() {
					if(this.deco_i <= 4) {
						if(this["deco"+this.deco_i]._img) {
							u.preloader(this["deco"+this.deco_i], [this["deco"+this.deco_i]._src], {"callback":this._decoReady});
						}
						else {
							this["deco"+this.deco_i].videoplayer.ended = function() {
								this.play();
							}
							this["deco"+this.deco_i].videoplayer.canplaythrough = function() {
								this.scene.resized();
								this.parentNode.transitioned = function() {
									u.a.transition(this, "none");
									this.scene.loadDeco();
								}
								u.a.transition(this.parentNode, "opacity 0.5s linear 0.5s");
								u.a.setOpacity(this.parentNode, 1);
							}
							this["deco"+this.deco_i].videoplayer.loadAndPlay(this["deco"+this.deco_i]._src);
						}
						this.deco_i++;
					}
				}
				this._decoReady = function(queue) {
					this._img.src = queue[0]._image.src;
					this.scene.resized();
					this.transitioned = function() {
						u.a.transition(this, "none");
						this.scene.loadDeco();
					}
					u.a.transition(this, "opacity 0.5s ease-in");
					u.a.setOpacity(this, 1);
				}
				u.t.setTimer(this, this.loadDeco, 450);
			}
			this.resized();
			u.a.transition(page.fN, "none");
			u.a.setOpacity(page.fN, 1);
		}
		scene.destroy = function() {
			this.destroy = null;
			this.finalizeDestruction = function() {
				page.footerInTransition();
				this.parentNode.removeChild(this);
				page.cN.ready();
			}
			if(this.blocks) {
				u.a.transition(this.deco1, "all 0.2s linear");
				u.a.setOpacity(this.deco1, 0);
				u.a.transition(this.deco2, "all 0.2s linear");
				u.a.setOpacity(this.deco2, 0);
				u.a.transition(this.deco3, "all 0.2s linear");
				u.a.setOpacity(this.deco3, 0);
				u.a.transition(this.deco4, "all 0.2s linear");
				u.a.setOpacity(this.deco4, 0);
				var i, node, node_y, j = 0;
				var calc_height = u.browserH();
				var scroll_offset = u.scrollY();
				var delay = 150;
				for(i = 0; node = this.blocks[i]; i++) {
					node_y = u.absY(node);
					if(node_y + node.offsetHeight > scroll_offset && node_y < scroll_offset + calc_height) {
						j++;
						u.a.transition(node, "all "+delay+"ms linear "+((j*delay)+200)+"ms");
						u.a.setOpacity(node, 0);
					}
				}
				u.t.setTimer(this, this.finalizeDestruction, (j*delay) + 200);
			}
			else {
				this.finalizeDestruction();
			}
		}
		scene.ready();
	}
}

/*i-services.js*/
Util.Objects["services"] = new function() {
	this.init = function(scene) {
		scene.resized = function() {
			var calc_width = u.browserW();
			calc_width = calc_width < 700 ? 700 : calc_width;
			var prop = (calc_width-700) / (1600-700);
			prop = prop > 1 ? 1 : prop;
			var focus_width = Math.round((calc_width-60)*0.70);
			var focus_area_width = 400+Math.round((520-400)*prop);
			var focus_padding_left = 30+Math.round((240-30)*prop);
			var service_padding_left = 30+Math.round((175-30)*prop);
			var service_width = Math.round((calc_width-60)*0.30) - service_padding_left;
			if(this._focus) {
				u.as(this._focus, "width", focus_width+"px", false);
				u.as(this._focus_h3, "paddingLeft", focus_padding_left+"px", false);
				u.as(this._magazines, "paddingLeft", focus_padding_left+"px", false);
				u.as(this._magazines, "width", focus_area_width+"px", false);
				u.as(this._corporate, "paddingLeft", focus_padding_left+"px", false);
				u.as(this._corporate, "width", focus_area_width+"px", false);
				u.as(this._designguides, "paddingLeft", focus_padding_left+"px", false);
				u.as(this._designguides, "width", focus_area_width+"px", false);
				u.as(this._reports, "paddingLeft", focus_padding_left+"px", false);
				u.as(this._reports, "width", focus_area_width+"px", false);
				u.as(this._campaigns, "paddingLeft", focus_padding_left+"px", false);
				u.as(this._campaigns, "width", focus_area_width+"px", false);
				u.as(this._service, "width", service_width+"px", false);
				u.as(this._service, "paddingLeft", service_padding_left+"px", false);
			}
			this.offsetHeight;
		}
		scene.scrolled = function() {
		}
		scene.ready = function(queue) {
			var scale = u.textscalers["services"];
			u.textscaler(this, scale);
			u.ac(this, "ready");
			u.ac(page.cN, "ready");
			page.cN.ready();
		}
		scene.build = function() {
			u.a.transition(this, "none");
			u.a.setOpacity(this, 1);
			if(!this.blocks) {
				this._focus = u.qs(".focus", this);
				this._focus_h3 = u.qs(".focus h3", this);
				this._service = u.qs(".servicelist", this);
				this._service_h3 = u.qs(".servicelist h3", this);
				this._magazines = u.qs(".magazines", this);
				this._corporate = u.qs(".corporate", this);
				this._designguides = u.qs(".designguides", this);
				this._reports = u.qs(".reports", this);
				this._campaigns = u.qs(".campaigns", this);
				this.blocks = u.qsa("h1,h2,h3,.magazines,.corporate,.designguides,.reports,.campaigns,li.type", this);
				var i, node, node_y;
				var delay = 150;
				for(i = 0; node = this.blocks[i]; i++) {
					node.transitioned = function() {
						u.a.transition(this, "none");
					}
					u.a.transition(node, "opacity "+delay+"ms linear "+(i*delay)+"ms");
					u.a.setOpacity(node, 1);
				}
				this.deco1 = u.ae(this, "div", {"class":"deco deco1"});
				this._focus.insertBefore(this.deco1, this._corporate);
				this.deco1.scene = this;
				this.deco1._img = u.ae(this.deco1, "img");
				this.deco1._src = "/img/desktop/services_1.jpg";
				this.deco2 = u.ae(this, "div", {"class":"deco deco2"});
				this._focus.insertBefore(this.deco2, this._designguides);
				this.deco2.scene = this;
				this.deco2.videoplayer = u.videoPlayer();
				this.deco2.videoplayer.scene = this;
				u.ae(this.deco2, this.deco2.videoplayer);
				// 
				this.deco2._src = "/media/videos/metro.mp4";
				this.deco3 = u.ae(this, "div", {"class":"deco deco3"});
				this._focus.insertBefore(this.deco3, this._reports);
				this.deco3.scene = this;
				this.deco3._img = u.ae(this.deco3, "img");
				this.deco3._src = "/img/desktop/services_3.jpg";
				this.deco4 = u.ae(this, "div", {"class":"deco deco4"});
				this._focus.insertBefore(this.deco4, this._campaigns);
				this.deco4.scene = this;
				this.deco4._img = u.ae(this.deco4, "img");
				this.deco4._src = "/img/desktop/services_4.jpg";
				this.deco5 = u.ae(this._focus, "div", {"class":"deco deco5"});
				this.deco5.scene = this;
				this.deco5._img = u.ae(this.deco5, "img");
				this.deco5._src = "/img/desktop/services_5.jpg";
				this.deco_i = 1;
				this.loadDeco = function() {
					if(this.deco_i <= 5) {
						if(this["deco"+this.deco_i]._img) {
							u.preloader(this["deco"+this.deco_i], [this["deco"+this.deco_i]._src], {"callback":this._decoReady});
						}
						else {
							this["deco"+this.deco_i].videoplayer.ended = function() {
								this.play();
							}
							this["deco"+this.deco_i].videoplayer.canplaythrough = function() {
								this.scene.resized();
								this.parentNode.transitioned = function() {
									u.a.transition(this, "none");
									this.scene.loadDeco();
								}
								u.a.transition(this.parentNode, "opacity 0.5s linear 0.5s");
								u.a.setOpacity(this.parentNode, 1);
							}
							this["deco"+this.deco_i].videoplayer.loadAndPlay(this["deco"+this.deco_i]._src);
						}
						this.deco_i++;
					}
				}
				this._decoReady = function(queue) {
					this._img.src = queue[0]._image.src;
					this.scene.resized();
					this.transitioned = function() {
						u.a.transition(this, "none");
						this.scene.loadDeco();
					}
					u.a.transition(this, "opacity 0.5s ease-in");
					u.a.setOpacity(this, 1);
				}
				u.t.setTimer(this, this.loadDeco, 450);
			}
			this.resized();
			u.a.transition(page.fN, "none");
			u.a.setOpacity(page.fN, 1);
		}
		scene.destroy = function() {
			this.destroy = null;
			this.finalizeDestruction = function() {
				page.footerInTransition();
				this.parentNode.removeChild(this);
				page.cN.ready();
			}
			if(this.blocks) {
				u.a.transition(this.deco1, "all 0.2s linear");
				u.a.setOpacity(this.deco1, 0);
				u.a.transition(this.deco2, "all 0.2s linear");
				u.a.setOpacity(this.deco2, 0);
				u.a.transition(this.deco3, "all 0.2s linear");
				u.a.setOpacity(this.deco3, 0);
				u.a.transition(this.deco4, "all 0.2s linear");
				u.a.setOpacity(this.deco4, 0);
				u.a.transition(this.deco5, "all 0.2s linear");
				u.a.setOpacity(this.deco5, 0);
				var i, node, node_y, j = 0;
				var calc_height = u.browserH();
				var scroll_offset = u.scrollY();
				var delay = 150;
				for(i = 0; node = this.blocks[i]; i++) {
					node_y = u.absY(node);
					if(node_y + node.offsetHeight > scroll_offset && node_y < scroll_offset + calc_height) {
						j++;
						u.a.transition(node, "all "+delay+"ms linear "+(j*delay)+"ms");
						u.a.setOpacity(node, 0);
					}
				}
				u.t.setTimer(this, this.finalizeDestruction, (j*delay) + 200);
			}
			else {
				this.finalizeDestruction();
			}
		}
		scene.ready();
	}
}

/*i-front.js*/
Util.Objects["front"] = new function() {
	this.init = function(scene) {
		scene._fold_offset = 0.5;
		scene.resized = function() {
			var width = u.browserW();
			if(this._range && ((this._range.min && width < this._range.min) || (this._range.max && width > this._range.max))) {
				this.reBuild();
			}
			if(this.gridmaster && this.gridmaster.nodes && this.gridmaster.nodes.length) {
				var i, node;
				for(i = 0; node = this.gridmaster.nodes[i]; i++) {
					if(node._bottom) {
						node._fold_detection = u.absY(node._heading);
					}
					else {
						node._fold_detection = u.absY(node);
					}
				}
				page.cN.isUnderFold();
			}
			this.offsetHeight;
		}
		scene.scrolled = function() {
			page.cN.isUnderFold();
		}
		scene.reBuild = function() {
			if(!this._rebuilding) {
				this._rebuilding = true;
				this.gridmaster.transitioned = function() {
					u.a.transition(this, "none");
					this.scene.build();
					this.scene._rebuilding = false;
				}
				this.list.scene = this;
				u.a.transition(this.gridmaster, "all 0.5s ease-in");
				u.a.setOpacity(this.gridmaster, 0);
			}
		}
		scene.ready = function() {
			var scale = u.textscalers["front"];
			u.textscaler(this, scale);
			this._gridtype = u.eitherOr(u.cv(this, "gridtype"), "default");
			this.list = u.qs(".news", this);
			this.gridmaster = u.gridMaster(this.list, {"selector":"li.news", "video_controls":true});
			this.gridmaster.scene = scene;
			this.gridmaster.prepareNode = function(node) {
				node._item_id = u.cv(node, "item_id");
				node._offset_below_fold = u.eitherOr(node.gm_grid_node.offset_below_fold, 0);
				node._proportion_name = node.gm_grid_proportion < 1 ? "portrait" : (node.gm_grid_proportion > 1 ? "landscape" : "square");
				node._image_margin = u.eitherOr(node.gm_grid_node.image_margin, 0);
				node._text_margin = u.eitherOr(node.gm_grid_node.text_margin, "0 15px");
				node._text_width = u.eitherOr(node.gm_grid_node.text_width, "auto");
				node._bottom = u.hc(node, "bottom") ? true : false;
				node._video_available = u.cv(node, "v_"+node._proportion_name.substring(0,2));
				node._image_available = u.cv(node, "i_"+node._proportion_name.substring(0,2));
				if(node._image_available) {
					node.gm_image_src = "/images/"+node._item_id+"/"+node._proportion_name+"/"+Math.ceil((node.gm_grid_width * this.scene._range.max_image) * 1.5)+"x."+node._image_available;
				}
				if(node._video_available) {
					node.gm_video_src = "/videos/"+node._item_id+"/video_"+node._proportion_name+"/"+Math.ceil(node.gm_grid_width * this.scene._range.max_image)+"x."+node._video_available;
				}
				if(node._bottom) {
					node._text_mask = u.ae(node, "div", {"class":"text"});
					node.gm_media_mask = u.ae(node, "div", {"class":"media"});
				}
				else {
					node.gm_media_mask = u.ae(node, "div", {"class":"media"});
					node._text_mask = u.ae(node, "div", {"class":"text"});
				}
				u.as(node.gm_media_mask, "margin", node._image_margin, false);
				u.as(node._text_mask, "margin", node._text_margin, false);
				u.as(node._text_mask, "width", node._text_width+"%", false);
				node._info = u.qs(".info", node);
				node._heading = u.qs("h2", node);
				node._article = u.qs(".article", node);
				u.ae(node._text_mask, node._info);
				u.ae(node._text_mask, node._heading);
				u.ae(node._text_mask, node._article);
				return node;
			}
			this.gridmaster.buildNode = function(node) {
				u.ce(node);
				if(node.url) {
					node.clicked = function() {
						if(this.url.match(/\/article\//)) {
							u.deleteCookie("news_scope");
						}
						page.navigate(this.url, this)
					}
				}
				var links = u.qsa("p a", node);
				if(links) {
					var i, link;
					for(i = 0; link = links[i]; i++) {
						u.ce(link);
						link.clicked = function(event) {
							u.e.kill(event);
							if(!this.target) {
								page.navigate(this.url, this);
							}
							else {
								window.open(this.url);
							}
						}
					}
				}
			}
			this.gridmaster.nodeRendered = function(node) {
				if(node.gm_video) {
					node.gm_video.ended = function() {
						this.play();
					}
				}
			}
			u.ac(this, "ready");
			u.ac(page.cN, "ready");
			page.cN.ready();
		}
		scene.build = function() {
			u.a.transition(this, "none");
			u.a.setOpacity(this, 1);
			var i, current_width = u.browserW();
			for(i in u.grids) {
				this._range = u.grids[i];
				if((!this._range.max || this._range.max >= current_width) && (!this._range.min || this._range.min <= current_width)) {
					break;
				}
			}
			this.response = function(response) {
				if(response && response.isJSON) {
					this.grid = response;
				}
				else {
					this.grid = this._range["default"];
				}
				this.gridmaster.prepare(this.grid);
				u.a.setOpacity(this.gridmaster, 1);
				this.resized();
				if(this._gridtype == "combined") {
					if(!this._h1) {
						this._h1 = u.qs("h1", this);
						this._h2 = u.qs("h2", this);
						this._h1.transitioned = function() {
							u.a.transition(this, "none");
						}
						u.a.transition(this._h1, "all 0.5s ease-in-out");
						u.a.setOpacity(this._h1, 1);
						this._h2.transitioned = function() {
							u.a.transition(this, "none");
						}
						u.a.transition(this._h2, "all 1.5s ease-in-out");
						u.a.setOpacity(this._h2, 1);
						this.deco = u.ae(this, "div", {"class":"deco"});
						this.decoReady = function(queue) {
							u.ae(this.deco, "img", {"src":queue[0]._image.src})
							u.a.transition(this.deco, "all 1s ease-in-out");
							u.a.setOpacity(this.deco, 1);
							this.gridmaster.build();
							this.resized();
						}
						u.preloader(scene, ["/img/desktop/front_coke.jpg"], {"callback":scene.decoReady});
					}
					else {
						scene.gridmaster.build();
						scene.resized();
					}
				}
				u.a.transition(page.fN, "none");
				u.a.setOpacity(page.fN, 1);
			}
			if(this._range[this._gridtype]) {
				var grid_file = this._range[this._gridtype][u.random(0, this._range[this._gridtype].length-1)];
				u.request(this, "/js/grids/"+grid_file);
			}
			else {
				this.response(false);
			}
		}
		scene.destroy = function() {
			this.destroy = null;
			this.finalizeDestruction = function() {
				page.footerInTransition();
				this.parentNode.removeChild(this);
				page.cN.ready();
			}
			if(this._h1) {
				u.a.transition(this.deco, "all 0.2s linear");
				u.a.setOpacity(this.deco, 0);
				u.a.transition(this._h1, "all 0.4s linear");
				u.a.setOpacity(this._h1, 0);
				u.a.transition(this._h2, "all 0.6s linear");
				u.a.setOpacity(this._h2, 0);
				var i, node, node_y, j = 0;
				var calc_height = u.browserH();
				var scroll_offset = u.scrollY();
				var delay = 150;
				for(i = 0; node = this.gridmaster.nodes[i]; i++) {
					node_y = u.absY(node);
					if(node_y + node.offsetHeight > scroll_offset && node_y < scroll_offset + calc_height) {
						j++;
						u.a.transition(node, "all "+delay+"ms linear "+(j*delay)+"ms");
						u.a.setOpacity(node, 0);
					}
				}
				u.t.setTimer(this, this.finalizeDestruction, (j*delay) + 200);
			}
			else {
				this.finalizeDestruction();
			}
		}
		scene.ready();
	}
}


/*i-news.js*/
Util.Objects["news"] = new function() {
	this.init = function(scene) {
		scene._fold_offset = 0.5;
		scene.resized = function() {
			var width = u.browserW();
			if(this._range && ((this._range.min && width < this._range.min) || (this._range.max && width > this._range.max))) {
				this.reBuild();
			}
			if(this.gridmaster && this.gridmaster.nodes && this.gridmaster.nodes.length) {
				var i, node;
				for(i = 0; node = this.gridmaster.nodes[i]; i++) {
					if(node._bottom) {
						node._fold_detection = u.absY(node._heading);
					}
					else {
						node._fold_detection = u.absY(node);
					}
				}
				page.cN.isUnderFold();
			}
			this.offsetHeight;
		}
		scene.scrolled = function() {
			page.cN.isUnderFold();
		}
		scene.ready = function(queue) {
			var default_filter = u.h.getCleanHash(location.hash, 2).toLowerCase();
			if(default_filter == "/journal/daily") {
				var mem = {"unit":"e-Types Daily"};
				u.saveCookie("news_filter", JSON.stringify(mem), {"path":"/"});
			}
			else if(default_filter == "/journal/e-types") {
				var mem = {"unit":"e-Types"};
				u.saveCookie("news_filter", JSON.stringify(mem), {"path":"/"});
			}
			var scale = u.textscalers["news"];
			u.textscaler(this, scale);
			this.list = u.qs("ul.news", this);
			this.gridmaster = u.gridMaster(this.list, {"video_controls":true});
			this.gridmaster.scene = scene;
			this.gridmaster.prepareNode = function(node) {
				node._item_id = u.cv(node, "item_id");
				node._offset_below_fold = u.random(0,1) ? u.random(100, 500) : 0;
				node._proportion_name = node.gm_grid_proportion < 1 ? "portrait" : (node.gm_grid_proportion > 1 ? "landscape" : "square");
				node._image_margin = u.eitherOr(node.gm_grid_node.image_margin, 0);
				node._text_margin = u.eitherOr(node.gm_grid_node.text_margin, "0");
				node._text_width = u.eitherOr(node.gm_grid_node.text_width, "auto");
				node._bottom = u.hc(node, "bottom") ? true : false;
				node._video_available = u.cv(node, "v_"+node._proportion_name.substring(0,2));
				node._image_available = u.cv(node, "i_"+node._proportion_name.substring(0,2));
				if(node._image_available) {
					node.gm_image_src = "/images/"+node._item_id+"/"+node._proportion_name+"/"+Math.ceil((node.gm_grid_width * this.scene._range.max_image) * 1.5)+"x."+node._image_available;
				}
				if(node._video_available) {
					node.gm_video_src = "/videos/"+node._item_id+"/video_"+node._proportion_name+"/"+Math.ceil((node.gm_grid_width * this.scene._range.max_image))+"x."+node._video_available;
				}
				if(node._bottom) {
					node._text_mask = u.ae(node, "div", {"class":"text"});
					node.gm_media_mask = u.ae(node, "div", {"class":"media"});
				}
				else {
					node.gm_media_mask = u.ae(node, "div", {"class":"media"});
					node._text_mask = u.ae(node, "div", {"class":"text"});
				}
				u.as(node.gm_media_mask, "margin", node._image_margin, false);
				u.as(node._text_mask, "margin", node._text_margin, false);
				u.as(node._text_mask, "width", node._text_width+"%", false);
				node._info = u.qs(".info", node);
				node._heading = u.qs("h2", node);
				node._article = u.qs(".article", node);
				u.ae(node._text_mask, node._info);
				u.ae(node._text_mask, node._heading);
				u.ae(node._text_mask, node._article);
				return node;
			}
			this.gridmaster.buildNode = function(node) {
				u.ce(node);
				if(node.url) {
					node.clicked = function() {
						page.navigate(this.url, this)
					}
				}
				var links = u.qsa("p a", node);
				if(links) {
					var i, link;
					for(i = 0; link = links[i]; i++) {
						u.ce(link);
						link.clicked = function(event) {
							u.e.kill(event);
							if(!this.target) {
								page.navigate(this.url, this);
							}
							else {
								window.open(this.url);
							}
						}
					}
				}
				node._row = Math.floor(node.gm_i/(1/node.gm_grid_width));
				if(this._grid_rows.length-1 < node._row) {
					this._grid_rows[node._row] = {};
					this._grid_rows[node._row].nodes = [];
					this._grid_rows[node._row].nodes.push(node);
				}
				else {
					this._grid_rows[node._row].nodes.push(node);
				}
			}
			this.gridmaster.nodeRendered = function(node) {
				if(node.gm_video) {
					node.gm_video.ended = function() {
						this.play();
					}
					if(node._above_fold) {
						node.gm_video.play();
					}
				}
			}
			this.initFilters();
			u.ac(this, "ready");
			u.ac(page.cN, "ready");
			page.cN.ready();
		}
		scene.reBuild = function() {
			if(!this._rebuilding) {
				this._rebuilding = true;
				this.gridmaster.transitioned = function() {
					u.a.transition(this, "none");
					this.scene.build();
					this.scene._rebuilding = false;
				}
				u.a.transition(this.gridmaster, "opacity 0.3s ease-in");
				u.a.setOpacity(this.gridmaster, 0);
			}
		}
		scene.build = function() {
			u.a.transition(this, "none");
			u.a.setOpacity(this, 1);
			var i, current_width = u.browserW();
			for(i in u.grids) {
				this._range = u.grids[i];
				if((!this._range.max || this._range.max >= current_width) && (!this._range.min || this._range.min <= current_width)) {
					break;
				}
			}
			this.response = function(response) {
				if(response && response.isJSON) {
					this.grid = response;
				}
				else {
					this.grid = this._range["default"];
				}
				this.gridmaster._grid_rows = [];
				this.gridmaster.prepare(this.grid);
				u.a.setOpacity(this.gridmaster, 1);
				this.resized();
				if(!this._h1) {
					this._h1 = u.qs("h1", this);
					this._h2 = u.qs("h2", this);
					this._filters = u.qs(".filters", this);
					this._h1.transitioned = function() {
						u.a.transition(this, "none");
					}
					u.a.transition(this._h1, "all 0.5s ease-in-out");
					u.a.setOpacity(this._h1, 1);
					this._h2.transitioned = function() {
						u.a.transition(this, "none");
					}
					u.a.transition(this._h2, "all 1.0s ease-in-out");
					u.a.setOpacity(this._h2, 1);
					this._filters.transitioned = function() {
						u.a.transition(this, "none");
					}
					u.a.transition(this._filters, "all 1.5s ease-in-out");
					u.a.setOpacity(this._filters, 1);
				}
				scene.gridmaster.build();
				var row, row_clear, node;
				for(i = 0; row = this.gridmaster._grid_rows[i]; i++) {
					row_clear = false;
					for(j = 0; node = row.nodes[j]; j++) {
						if((j == row.nodes.length-1 && !row_clear) || i == 0) {
							u.a.translate(node, 0, 0);
							node._offset_below_fold = 0;
						}
						else if(!node._offset_below_fold) {
							row_clear = true;
						}
					}
				}
				scene.resized();
				var mem = [];
				for(i = 0; node = this.gridmaster.nodes[i]; i++) {
					if(!node._hidden) {
//						mem.push(node._item_id);
						mem.push(u.cv(node, "url"));
					}
				}
				u.saveCookie("news_scope", JSON.stringify(mem), {"path":"/"});
				u.a.transition(page.fN, "none");
				u.a.setOpacity(page.fN, 1);
			}
			if(this._range["news"]) {
				var grid_file = this._range["news"][u.random(0, this._range["news"].length-1)];
				u.request(this, "/js/grids/"+grid_file);
			}
			else {
				this.response(false);
			}
		}
		scene.destroy = function() {
			this.destroy = null;
			this.finalizeDestruction = function() {
				page.footerInTransition();
				this.parentNode.removeChild(this);
				page.cN.ready();
			}
			if(this._h1) {
				u.a.transition(this._h1, "all 0.2s linear");
				u.a.setOpacity(this._h1, 0);
				u.a.transition(this._h2, "all 0.4s linear");
				u.a.setOpacity(this._h2, 0);
				u.a.transition(this._filters, "all 0.6s linear");
				u.a.setOpacity(this._filters, 0);
				var i, node, node_y, j = 0;
				var calc_height = u.browserH();
				var scroll_offset = u.scrollY();
				var delay = 150;
				for(i = 0; node = this.gridmaster.nodes[i]; i++) {
					node_y = u.absY(node);
					if(node_y + node.offsetHeight > scroll_offset && node_y < scroll_offset + calc_height) {
						j++;
						u.a.transition(node, "all "+delay+"ms linear "+(j*delay)+"ms");
						u.a.setOpacity(node, 0);
					}
				}
				u.t.setTimer(this, this.finalizeDestruction, (j*delay) + 200);
			}
			else {
				this.finalizeDestruction();
			}
		}
		scene.initFilters = function() {
			this.filterPanel = u.ae(this, "div", {"class":"filters"});
			this.filterPanel = this.insertBefore(this.filterPanel, this.gridmaster);
			this.filterPanel.filters = [];
			this.filterPanel.scene = this;
			this.nodes = u.qsa("li.item", this.gridmaster);
			this.contexts = {
				"category":{
					"header":"category", 
					"select_all":"All categories", 
					"count":0,
					"values":[]
				},
				"unit":{
					"header":"company",
					"select_all":"All", 
					"count":0, 
					"values":["e-Types", "e-Types Daily", "Playtype"]
				}
			};
			var i, node, j, tag, tags, context, value, filter, filter_values, filter_value;
			for(i = 0; node = this.nodes[i]; i++) {
				tags = u.qsa(".tags li.tag", node);
				for(j = 0; tag = tags[j]; j++) {
					context = u.qs(".context", tag).innerHTML;
					value = u.qs(".value", tag).innerHTML;
					if(this.contexts[context]) {
						if(this.contexts[context].values.indexOf(value) == -1) {
							this.contexts[context].values.push(value);
						}
						this.contexts[context].count++;
					}
				}
			}
			var mem = JSON.parse(u.getCookie("news_filter"));
			for(context in this.contexts) {
				if(this.contexts[context].values.length > 1) {
					filter = u.ae(this.filterPanel, "div", {"class":"filter"});
					this.filterPanel.filters.push(filter);
					filter.filterPanel = this.filterPanel;
					filter._name = this.contexts[context].header;
					filter.selectValue = function(node) {
						this.filterPanel.saveState(node._context, node._value);
						var i, value_node;
						for(i = 0; value_node = this._list.nodes[i]; i++) {
							u.rc(value_node, "selected");
						}
						this.set_new_header = function() {
							if(this._all == node) {
								this._header.new_title = this._name;
								this.filter_by = false;
							}
							else {
								this._header.new_title = node.innerHTML;
								this.filter_by = node._context+":"+node._value;
							}
							u.ac(node, "selected");
							this.filterPanel.contextClicked(this, true);
							this._header.org_width = parseInt(u.gcs(this._header, "width"));
							this._header.innerHTML = this._header.new_title;
							this._header.new_width = parseInt(u.gcs(this._header, "width"));
							this._header.new_filter_width = this._header.offsetWidth;
							u.a.transition(this._header, "none");
							u.a.setWidth(this._header, this._header.org_width);
							u.a.transition(this, "all 0.3s ease-in-out");
							u.a.setWidth(this, this._header.new_filter_width);
							this._header.transitioned = function() {
								u.a.transition(this, "none");
								u.a.transition(this.filter, "none");
								u.a.setWidth(this, "auto");
							}
							u.a.transition(this._header, "all 0.4s ease-in-out");
							u.a.setWidth(this._header, this._header.new_width);
							u.a.setOpacity(this._header, 1);
						}
						u.a.transition(this._header, "all 0.2s linear");
						u.a.setOpacity(this._header, 0);
						u.t.setTimer(this, this.set_new_header, 200);
					}
					if(mem[context]) {
						filter._header = u.ae(filter, "h3", {"html":mem[context]});
					}
					else {
						filter._header = u.ae(filter, "h3", {"html":filter._name});
					}
					filter._header.filter = filter;
					u.e.click(filter._header);
					filter._header.clicked = function() {
						this.filter.filterPanel.contextClicked(this.filter);
					}
					filter._list = u.ae(filter, "ul");
					filter._list.filter = filter;
					filter._list.nodes = [];
					if(mem[context]) {
						filter._all = u.ae(filter._list, "li", {"class":"all", "html":this.contexts[context].select_all});
					}
					else {
						filter._all = u.ae(filter._list, "li", {"class":"all selected", "html":this.contexts[context].select_all});
					}
					filter._all._context = context;
					filter._all.filter = filter;
					u.e.click(filter._all);
					filter._all.clicked = function() {
						if(!u.hc(this, "selected")) {
							this.filter.selectValue(this);
						}
					}
					filter._list.nodes.push(filter._all);
					filter._separator = u.ae(filter._list, "li", {"class":"separator", "html":""});
					filter._list.nodes.push(filter._separator);
					for(j = 0; value = this.contexts[context].values[j]; j++) {
						filter_value = u.ae(filter._list, "li", {"html":value});
						filter_value._context = context;
						filter_value._value = value;
						filter_value.filter = filter;
						filter_value._context = context;
						filter_value._value = value;
						u.e.click(filter_value)
						filter_value.clicked = function() {
							if(!u.hc(this, "disabled") && !u.hc(this, "selected")) {
								this.filter.selectValue(this);
							}
						}
						filter._list.nodes.push(filter_value);
						if(mem[context] && mem[context] == value) {
							u.ac(filter_value, "selected")
							filter.filter_by = context+":"+value;
						}
					}
					u.a.setWidth(filter._list, filter.offsetWidth);
					u.a.setWidth(filter, filter._header.offsetWidth);
					filter._list.org_height = filter._list.offsetHeight;
					u.a.setHeight(filter._list, 0);
				}
				this.filterPanel.base_height = parseInt(u.gcs(this.filterPanel, "height"));
				u.a.setHeight(this.filterPanel, this.filterPanel.base_height);
			}
			this.filterPanel.contextClicked = function(node, rebuild) {
				var open_node = u.qs(".open", this);
				this.rebuild = rebuild;
				if(node == open_node || (open_node && node != open_node)) {
					u.rc(open_node, "open");
					open_node._list.transitioned = function(event) {
						u.a.transition(this, "none");
						u.a.setHeight(this, 0);
						u.a.setOpacity(this, 1);
					}
					if(node == open_node) {
						this.transitioned = function() {
							if(this.rebuild) {
								this.scene.reBuild();
								this.rebuild = false;
							}
						}
						u.a.transition(this, "all 0.4s ease-in-out");
						u.a.setHeight(this, this.base_height);
					}
					u.a.transition(open_node._list, "all 0.2s ease-in-out");
					u.a.setOpacity(open_node._list, 0);
				}
				if(node != open_node) {
					u.ac(node, "open");
					this.updateFilters(node);
					u.a.transition(node._list, "none");
					for(i = 0; subject = node._list.nodes[i]; i++) {
						u.a.transition(subject, "none");
						u.a.setOpacity(subject, 0);
					}
					node._list.transitioned = function(event) {
						u.a.transition(this, "none");
						var i, node, delay;
						for(i = 0; node = this.nodes[i]; i++) {
							node.transitioned = function() {
								u.a.transition(this, "none");
							}
							delay = 200;
							u.a.transition(node, "all 0.3s ease-in-out "+delay+"ms");
							u.a.setOpacity(node, 1);
						}
					}
					u.a.transition(this, "all 0.4s ease-in-out");
					u.a.setHeight(this, this.base_height + node._list.org_height);
					u.a.transition(node._list, "all 0.3s ease-in-out");
					u.a.setHeight(node._list, node._list.org_height);
				}
			}
			this.filterPanel.filter = function(node) {
				var filter, filter_by;
				var current_filters = [];
				for(i = 0; filter = this.filters[i]; i++) {
					if(filter.filter_by) {
						current_filters.push(filter.filter_by);
					}
				}
				var i, j, tag, filter;
				var tags = u.qsa(".tags li.tag", node);
				var matched = true;
				for(i = 0; filter = current_filters[i]; i++) {
					matched = false;
					for(j = 0; tag = tags[j]; j++) {
						context = u.qs(".context", tag).innerHTML;
						value = u.qs(".value", tag).innerHTML;
						if(filter == context + ":" + value) {
							matched = true;
						}
					}
					if(!matched) {
						break;
					}
				}
				if(!matched) {
					return false;
				}
				else {
					return true;
				}
			}
			this.filterPanel.updateFilters = function(filter) {
				var filter_by_org = filter.filter_by;
				for(i = 0; filter_value = filter._list.nodes[i]; i++) {
					if(filter_value._value && !u.hc(filter_value, "selected")) {
						filter.filter_by = filter_value._context+":"+filter_value._value;
						matching_node = false;
						for(j = 0; node = this.scene.gridmaster.nodes[j]; j++) {
							if(this.filter(node)) {
								matching_node = true;
							}
						}
						if(!matching_node) {
							u.ac(filter_value, "disabled");
						}
						else {
							u.rc(filter_value, "disabled");
						}
					}
				}
				filter.filter_by = filter_by_org;
			}
			this.filterPanel.saveState = function(context, value) {
				var mem = JSON.parse(u.getCookie("news_filter"));
				if(!mem) {
					mem = {};
				}
				mem[context] = value ? value : "";
				u.saveCookie("news_filter", JSON.stringify(mem), {"path":"/"});
			}
		}
		scene.ready();
	}
}

/*i-article.js*/
Util.Objects["article"] = new function() {
	this.init = function(scene) {
		scene._transition = "ease-out";
		scene._duration = 0.6; 
		scene._factor = 1;
		scene.resized = function() {
			var calc_width = u.browserW();
			var factor, text_padding, image_padding;
			if(calc_width < 800) {
				factor = 0;
			}
			else if(calc_width > 1024) {
				factor = 1;
			}
			else {
				factor = 1-(1024-calc_width)/(1024-800);
			}
			if(factor != this.factor) {
				this._factor = factor;
				image_padding = Math.round((this._factor*15));
				text_padding = Math.round((this._factor*60));
				this._style_text_rule.style.setProperty("padding-left", text_padding+"px", "important");
				this._style_image_rule.style.setProperty("padding-left", image_padding+"px", "important");
				this._prev_offset = -(this.article.offsetWidth-(15+image_padding));
				this._next_offset = calc_width-(45+(image_padding*2));
				if(this._prev && this._prev._image_mask) {
					u.a.translate(this._prev._image_mask, this._prev_offset, 0);
				}
				if(this._next && this._next._image_mask) {
					u.a.translate(this._next._image_mask, this._next_offset, 0);
				}
			}
			this.setSceneHeight();
			this.offsetHeight;
		}
		scene.scrolled = function() {
		}
		scene.ready = function(queue) {
			this._style_tag = document.createElement("style");
			this._style_tag.setAttribute("media", "all")
			this._style_tag.setAttribute("type", "text/css")
			this._style_tag = u.ae(document.head, this._style_tag);
			this._style_tag.appendChild(document.createTextNode(""))
			this._style_selector = u.randomString(8);
			u.ac(this, this._style_selector);
			this._style_tag.sheet.insertRule("."+this._style_selector+' .text {}', 0);
			this._style_text_rule = this._style_tag.sheet.cssRules[0];
			this._style_tag.sheet.insertRule("."+this._style_selector+' .image {}', 0);
			this._style_image_rule = this._style_tag.sheet.cssRules[0];
			this._style_text_rule.style.setProperty("padding-left", "100px", "important");
			this._style_image_rule.style.setProperty("padding-left", "150px", "important");
			u.ac(this, "ready");
			u.ac(page.cN, "ready");
			page.cN.ready();
		}
		scene.setSceneHeight = function() {
			var new_height;
			var viewable_height = (u.browserH() - page.hN.offsetHeight - page.fN.offsetHeight);
			if(this.article.offsetHeight < viewable_height) {
				new_height = viewable_height;
			}
			else {
				new_height = this.article.offsetHeight;
			}
			this.transitioned = function() {
				u.a.transition(this, "none");
				u.a.transition(page.fN, "none");
				u.a.setOpacity(page.fN, 1);
			}
			if(parseInt(u.gcs(this, "height")) != new_height) {
				u.a.transition(this, "height 0.3s ease-in-out");
				u.a.setHeight(this, new_height+"px");
			}
			else {
				this.transitioned();
			}
		}
		scene.initArticle = function(node) {
			u.bug("init article")
			node._info = u.qs(".info", node);
			node._h1 = u.qs("h1", node);
			node._body = u.qs(".body", node);
			node.item_id = u.cv(node, "item_id");
			node.image_format = u.cv(node, "i_la");
			node._image_mask = u.ie(node, "div", {"class":"image"});
			node._image_mask.scene = this;
			node._image_mask.node = node;
			node._text_mask = u.ae(node, "div", {"class":"text"});
			u.ae(node._text_mask, node._info);
			u.ae(node._text_mask, node._h1);
			u.ae(node._text_mask, node._body);
			var p = u.qs("p", node._body);
			if(p.textContent.length > 750) {
				var new_p1 = u.ae(node._body, "p", {"class":"first"});
				var new_p2 = u.ae(node._body, "p", {"class":"second"});
				var breakpoint = Math.round(p.textContent.length*0.6);
				var cursor = 0;
				var reached_linebreak = false;
				var child, word;
				while(p.childNodes.length) {
					child = p.childNodes[0];
					if(cursor < breakpoint || !reached_linebreak) {
						if(child.nodeType == 3) {
							if(cursor+child.length < breakpoint) {
								new_p1.appendChild(child);
								cursor += child.length;
							}
							else {
								var p_height = new_p1.offsetHeight;
								var words = child.nodeValue.split(" ");
								while(words.length) {
									if(cursor+words[0].length < breakpoint) {
										cursor += words[0].length+1;
										word = new_p1.appendChild(document.createTextNode(words.shift()+" "));
										p_height = new_p1.offsetHeight;
									}
									else {
										new_word = words.shift()+" ";
										cursor += new_word.length;
										if(!reached_linebreak) {
											word = new_p1.appendChild(document.createTextNode(new_word));
											if(new_p1.offsetHeight > p_height) {
												reached_linebreak = true;
												new_p2.appendChild(word);
											}
										}
										else {
											word = new_p2.appendChild(document.createTextNode(new_word+" "));
										}
									}
								}
								p.removeChild(child);
							}
						}
						else {
							new_p1.appendChild(child);
							cursor += child.textContent.length;
						}
					}
					else {
						new_p2.appendChild(child);
					}
				}
				p.parentNode.removeChild(p);
			}
			var links = u.qsa("a", node);
			if(links) {
				var i, link;
				for(i = 0; link = links[i]; i++) {
					u.ce(link);
					link.clicked = function(event) {
						u.e.kill(event);
						if(!this.target) {
							page.navigate(this.url, this);
						}
						else {
							window.open(this.url);
						}
					}
				}
			}
			if(node == this.article) {
				this.buildArticle(node);
			}
		}
		scene.initArticleScope = function() {
			u.bug("article scope:" + this.article_scope);
//			this.current_index = this.article_scope.indexOf(this.article.item_id);
			this.current_index = this.article_scope.indexOf(u.cv(this.article, "url"));
			this.article_nodes = [];
			var i, article_node, new_article_node;
			for(i = 0; article_node = this.article_scope[i]; i++) {
				if(article_node != u.cv(this.article, "url")) {
//				if(article_node != this.article.item_id) {
					new_article_node = u.ae(this, "div", {"class":"item notloaded"});
					new_article_node.item_id = article_node;
					u.a.transition(new_article_node, "none");
					u.a.setOpacity(new_article_node, 0);
					u.as(new_article_node, "display", "none");
					this.article_nodes[i] = new_article_node;
				}
				else {
					this.article_nodes[i] = this.article;
				}
				this.article_nodes[i].scene = this;
			}
			this.loadPrev();
			this.loadNext();
			if(this.article_scope.length > 0) {
				this.keys = function(event) {
					event = event ? event : window.event;
					if(event.keyCode == 37) {
						u.e.kill(event);
						page.cN.scene.bn_prev.clicked();
					}
					else if(event.keyCode == 39) {
						u.e.kill(event);
						page.cN.scene.bn_next.clicked();
					}
				}
				u.e.addEvent(document.body, "keyup", this.keys)
				this.bn_next = u.ae(this, "div", {"class":"next"});
				this.bn_next.scene = this;
				this.bn_prev = u.ae(this, "div", {"class":"prev"});
				this.bn_prev.scene = this;
				u.e.click(this.bn_next);
				u.e.click(this.bn_prev);
				this.bn_next.clicked = function() {
					u.bug("this.scene.transitioning on next:" + this.scene.transitioning)
					if(!this.scene.transitioning) {
						this.scene.selectArticle(this.scene.current_index+1);
					}
				}
				this.bn_prev.clicked = function() {
					u.bug("this.scene.transitioning on prev:" + this.scene.transitioning)
					if(!this.scene.transitioning) {
						this.scene.selectArticle(this.scene.current_index-1);
					}
				}
				this.bn_prev.mover = function() {
					this.scene.peekOutLeft();
				}
				this.bn_prev.mout = function() {
					this.scene.noPeek();
				}
				this.bn_next.mover = function() {
					this.scene.peekOutRight();
				}
				this.bn_next.mout = function() {
					this.scene.noPeek();
				}
				if(u.e.event_pref == "mouse") {
					this.bn_prev.onmouseover = this.bn_prev.mover;
					this.bn_prev.onmouseout = this.bn_prev.mout; 
					this.bn_next.onmouseover = this.bn_next.mover;
					this.bn_next.onmouseout = this.bn_next.mout;
				}
				else {
					u.e.addStartEvent(this.bn_prev, this.bn_prev.mover);
					u.e.addEndEvent(this.bn_prev, this.bn_prev.mout);
					u.e.addStartEvent(this.bn_next, this.bn_next.mover);
					u.e.addEndEvent(this.bn_next, this.bn_next.mout);
				}
				this._swiper = u.ae(this, "div", {"class":"swiper"});
				this._swiper.scene = this;
				u.e.swipe(this._swiper, this._swiper, {"horizontal_lock":true});
				this._swiper.moved = function() {
					if(!this.scene.transitioning) {
						u.a.translate(this.scene.article._image_mask, this.current_x, 0);
						if(this.scene._prev && this.scene._prev._image_mask) {
							u.a.translate(this.scene._prev._image_mask, this.current_x + this.scene._prev_offset, 0);
						}
						if(this.scene._next && this.scene._next._image_mask) {
							u.a.translate(this.scene._next._image_mask, this.current_x + this.scene._next_offset, 0);
						}
					}
				}
				this._swiper.dropped = function() {
					if(!this.scene.transitioning) {
						if(!this.swiped && this.scene.article._image_mask._x != 0) {
							u.bug("dropped without swipe:" + this.swiped + "," + this.scene.article._image_mask._x);
							this.scene.transitioning = true;
							var duration = Math.abs(this.scene._duration / (u.browserW() / this.current_x));
							duration = (duration > 1.5) ? 1.5 : ((duration < 0.2) ? 0.2 : duration);
							this.scene.article._image_mask.transitioned = function() {
								u.bug("no swipe cleared")
								u.a.transition(this, "none");
								this.scene.transitioning = false
							}
							u.a.transition(this.scene.article._image_mask, "all " + duration + "s " + this.scene._transition);
							u.a.translate(this.scene.article._image_mask, 0, 0);
							if(this.scene._prev && this.scene._prev._image_mask) {
								this.scene._prev._image_mask.transitioned = function() {
									u.a.transition(this, "none");
								}
								u.a.transition(this.scene._prev._image_mask, "all " + duration + "s " + this.scene._transition);
								u.a.translate(this.scene._prev._image_mask, this.scene._prev_offset, 0);
							}
							if(this.scene._next && this.scene._next._image_mask) {
								this.scene._next._image_mask.transitioned = function() {
									u.a.transition(this, "none");
								}
								u.a.transition(this.scene._next._image_mask, "all " + duration + "s " + this.scene._transition);
								u.a.translate(this.scene._next._image_mask, this.scene._next_offset, 0);
							}
						}
					}
				}
				this._swiper.swipedDown = this._swiper.swipedUp = function(event) {
					this.swiped = false;
				}
				this._swiper.swipedLeft = function(event) {
					if(!this.scene.transitioning) {
						if(this.scene.article._image_mask._x < 0) {
							this.scene.selectArticle(this.scene.current_index+1);
						}
						else {
							this.swiped = false;
						}
					}
				}
				this._swiper.swipedRight = function(event) {
					if(!this.scene.transitioning) {
						if(this.scene.article._image_mask._x > 0) {
							this.scene.selectArticle(this.scene.current_index-1);
						}
						else {
							this.swiped = false;
						}
					}
				}
			}
		}
		scene.peekOutLeft = function() {
			u.bug("peak left: "+this.transitioning)
			if(!this.transitioning) {
				if(this._prev && this._prev._image_mask) {
					var time = 0.3;
					var trans = "ease-in-out";
					this.article._image_mask.transitioned = function() {
						u.a.transition(this, "none");
					}
					this._prev._image_mask.transitioned = function() {
						u.a.transition(this, "none");
					}
					u.a.transition(this._prev._image_mask, "all "+time+"s "+trans);
					u.a.transition(this.article._image_mask, "all "+time+"s "+trans);
					if(this._next && this._next._image_mask) {
						this._next._image_mask.transitioned = function() {
							u.a.transition(this, "none");
						}
						u.a.transition(this._next._image_mask, "all "+time+"s "+trans);
						u.a.translate(this._next._image_mask, this._next_offset+30, 0);
					}
					u.a.translate(this._prev._image_mask, this._prev_offset+30, 0);
					u.a.translate(this.article._image_mask, +30, 0);
				}
			}
		}
		scene.peekOutRight = function() {
			u.bug("peak right: "+this.transitioning);
			if(!this.transitioning) {
				if(this._next && this._next._image_mask) {
					var time = 0.3;
					var trans = "ease-in-out";
					this.article._image_mask.transitioned = function() {
						u.a.transition(this, "none");
					}
					this._next._image_mask.transitioned = function() {
						u.a.transition(this, "none");
					}
					u.a.transition(this.article._image_mask, "all "+time+"s "+trans);
					u.a.transition(this._next._image_mask, "all "+time+"s "+trans);
					if(this._prev && this._prev._image_mask) {
						u.a.transition(this._prev._image_mask, "all "+time+"s "+trans);
						u.a.translate(this._prev._image_mask, this._prev_offset-30, 0);
					}
					u.a.translate(this.article._image_mask, -30, 0);
					u.a.translate(this._next._image_mask, this._next_offset-30, 0);
				}
			}
		}
		scene.noPeek = function() {
			u.bug("no peak: "+this.transitioning);
			if(!this.transitioning) {
				var time = 0.5;
				var trans = "ease-in-out";
				this.article._image_mask.transitioned = function() {
					u.a.transition(this, "none");
				}
				if(this._prev && this._prev._image_mask) {
					this._prev._image_mask.transitioned = function() {
						u.a.transition(this, "none");
					}
					u.a.transition(this._prev._image_mask, "all "+time+"s "+trans);
					u.a.translate(this._prev._image_mask, this._prev_offset, 0);
				}
				u.a.transition(this.article._image_mask, "all "+time+"s "+trans);
				u.a.translate(this.article._image_mask, 0, 0);
				if(this._next && this._next._image_mask) {
					this._next._image_mask.transitioned = function() {
						u.a.transition(this, "none");
					}
					u.a.transition(this._next._image_mask, "all "+time+"s "+trans);
					u.a.translate(this._next._image_mask, this._next_offset, 0);
				}
			}
		}
		scene.selectArticle = function(index) {
			u.bug("select article:" + index + " -> " + u.cv(this.article_nodes[index], "url"))
			// console.log(this.article)
			// console.log(this.article_nodes[index]);
			var duration;
			var calc_width = u.browserW();
			this.direction = (index - this.current_index) > 0 ? 1 : -1;
			if(index < 0 || index >= this.article_nodes.length) {
				u.bug("return to status quo")
				this.transitioning = true;
				duration = (this._duration / (1 - Math.abs(this._swiper.current_x / calc_width)))/3;
				this.article._image_mask.transitioned = function() {
					u.bug("article snapped back")
					u.a.transition(this, "none");
					this.scene.transitioning = false;
				}
				if(this.article._image_mask._x != 0) {
					u.a.transition(this.article._image_mask, "all " + duration + "s " + this._transition);
					u.a.translate(this.article._image_mask, 0, 0);
					if(this._prev && this._prev._image_mask) {
						this._prev._image_mask.transitioned = function() {
							u.a.transition(this, "none");
						}
						u.a.transition(this._prev._image_mask, "all " + duration + "s " + this._transition);
						u.a.translate(this._prev._image_mask, this._prev_offset, 0);
					}
					if(this._next && this._next._image_mask) {
						this._next._image_mask.transitioned = function() {
							u.a.transition(this, "none");
						}
						u.a.transition(this._next._image_mask, "all " + duration + "s " + this._transition);
						u.a.translate(this._next._image_mask, this._next_offset, 0);
					}
				}
				else {
					this.article._image_mask.transitioned();
				}
				return;
			}
			this.current_index = index;
			this.transitioning = true;
			this.destroyArticle(this.article);
			if(this.swiped) {
				u.bug("swiped")
				if(this.current_xps) {
					duration = ((calc_width / Math.abs(this.current_xps)) * this._duration);
					duration = duration > this._duration ? this._duration : duration;
				}
				else {
					duration = this._duration / (1 - Math.abs(this.current_x / calc_width));
				}
				duration = (duration > 1.5) ? 1.5 : ((duration < 0.2) ? 0.2 : duration);
			}
			else {
				duration = this._duration;
			}
			var p_x, a_x, n_x;
			if(this.direction < 0) {
				u.bug("select prev node")
				p_x = 0;
				a_x = this._next_offset;
				n_x = calc_width+this._next_offset;
				this._prev.newArticle = function() {
					this.newArticle = null;
					if(this.scene._next) {
						if(this.scene._next._image_mask) {
							u.a.transition(this.scene._next._image_mask, "none");
						}
						u.as(this.scene._next, "display", "none");
						u.a.setOpacity(this.scene._next, 0);
					}
					u.a.transition(this.scene.article._image_mask, "none");
					u.a.transition(this, "none");
					this.scene.article = this.scene._prev;
					u.as(this.scene.article, "zIndex", 5);
					this.scene.buildArticle(this.scene.article);
					this.scene.loadPrev();
					this.scene.loadNext();
					this.scene.transitioning = false;
					if(typeof(this.articleEntered) == "function") {
						this.articleEntered(this.scene.article);
					}
				}
				if(typeof(this.articleSelected) == "function") {
					this.articleSelected(this._prev);
				}
			}
			else {
				u.bug("select next node")
				p_x = -(calc_width-this._prev_offset);
				a_x = this._prev_offset;
				n_x = 0;
				this._next.newArticle = function() {
					this.newArticle = null;
					if(this.scene._prev) {
						if(this.scene._prev._image_mask) {
							u.a.transition(this.scene._prev._image_mask, "none");
						}
						u.as(this.scene._prev, "display", "none");
						u.a.setOpacity(this.scene._prev, 0);
					}
					u.a.transition(this.scene.article._image_mask, "none");
					u.a.transition(this, "none");
					this.scene.article = this.scene._next;
					u.as(this.scene.article, "zIndex", 5);
					this.scene.buildArticle(this.scene.article);
					this.scene.loadNext();
					this.scene.loadPrev();
					this.scene.transitioning = false;
					if(typeof(this.articleEntered) == "function") {
						this.articleEntered(this.scene.article);
					}
				}
				if(typeof(this.articleSelected) == "function") {
					this.articleSelected(this._next);
				}
			}
			u.a.transition(this.article._image_mask, "all " + duration + "s " + this._transition);
			u.a.translate(this.article._image_mask, a_x, 0);
			if(this._prev && this._prev._image_mask) {
				this._prev._image_mask.transitioned = function() {
					u.a.transition(this, "none");
					if(typeof(this.node.newArticle) == "function") {
						this.node.newArticle();
					}
				}
				u.a.transition(this._prev._image_mask, "all " + duration + "s " + this._transition);
				u.a.translate(this._prev._image_mask, p_x, 0);
			}
			else if(this._prev && typeof(this._prev.newArticle) == "function"){
				u.t.setTimer(this._prev, this._prev.newArticle, (duration*1000) + 50);
			}
			if(this._next && this._next._image_mask) {
				this._next._image_mask.transitioned = function() {
					u.a.transition(this, "none");
					if(typeof(this.node.newArticle) == "function") {
						this.node.newArticle();
					}
				}
				u.a.transition(this._next._image_mask, "all " + duration + "s " + this._transition);
				u.a.translate(this._next._image_mask, n_x, 0);
			}
			else if(this._next && typeof(this._next.newArticle) == "function"){
				u.t.setTimer(this._next, this._next.newArticle, (duration*1000) + 50);
			}
		}
		scene.buildArticle = function(article) {
			u.bug("build article:" + u.nodeId(article));
			this.setSceneHeight();
			if(u.hc(article, "ready")) {
				article._info.transitioned = function() {
					u.a.transition(this, "none");
				}
				u.a.transition(article._info, "all 0.3s linear");
				u.a.setOpacity(article._info, 1);
				article._h1.transitioned = function() {
					u.a.transition(this, "none");
				}
				u.a.transition(article._h1, "all 0.3s linear 0.2s");
				u.a.setOpacity(article._h1, 1);
				article._body.transitioned = function() {
					u.a.transition(this, "none");
				}
				u.a.transition(article._body, "all 0.3s linear 0.4s");
				u.a.setOpacity(article._body, 1);
			}
		}
		scene.destroyArticle = function(article) {
			u.bug("destroy article: " + " -> " + u.cv(this.article, "url"))
			if(u.hc(article, "ready")) {
				article._info.transitioned = function() {
					u.a.transition(this, "none");
				}
				u.a.transition(article._info, "all 0.2s linear");
				u.a.setOpacity(article._info, 0);
				article._h1.transitioned = function() {
					u.a.transition(this, "none");
				}
				u.a.transition(article._h1, "all 0.2s linear 0.1s");
				u.a.setOpacity(article._h1, 0);
				article._body.transitioned = function() {
					u.a.transition(this, "none");
				}
				u.a.transition(article._body, "all 0.2s linear 0.2s");
				u.a.setOpacity(article._body, 0);
			}
		}
		scene.loadNext = function() {
			if(this.current_index < this.article_scope.length-1) {
				this._next = this.article_nodes[this.current_index+1];
				u.a.transition(this._next, "none");
				u.as(this._next, "zIndex", 4);
				u.as(this._next, "display", "block");
				if(u.hc(this._next, "notloaded")) {
					this._next.response = function(response) {
						var article = u.qs(".item", response);
						u.bug("next response:" + u.nodeId(article))
						this.className = article.className;
						this.innerHTML = article.innerHTML;
						this.scene.initArticle(this);
						this.scene.resized();
						this._image_mask.loaded = function(queue) {
							u.as(this, "backgroundImage", "url("+queue[0]._image.src+")");
							u.a.setOpacity(this, 1);
							this.node.transitioned = function() {
								u.a.transition(this, "none");
							}
							u.a.transition(this.node, "opacity 0.4s ease-in-out 0.4s");
							u.a.setOpacity(this.node, 1);
						}
						u.preloader(this._image_mask, ["/images/"+this.item_id+"/landscape/x440."+this.image_format]);
						u.ac(this, "ready");
					}
					u.request(this._next, "/article/"+this._next.item_id);
					u.bug("next requested:"+this._next.item_id)
				}
				else {
					this.resized();
					this._next.transitioned = function() {
						u.a.transition(this, "none");
					}
					u.a.transition(this._next, "all 0.4s linear");
					u.a.setOpacity(this._next, 1);
				}
			}
			else {
				this._next = false;
			}
		}
		scene.loadPrev = function() {
			if(this.current_index > 0) {
				this._prev = this.article_nodes[this.current_index-1];
				u.a.transition(this._prev, "none");
				u.as(this._prev, "zIndex", 4);
				u.as(this._prev, "display", "block");
				if(u.hc(this._prev, "notloaded")) {
					this._prev.response = function(response) {
						var article = u.qs(".item", response);
						u.bug("prev response:" + u.nodeId(article))
						this.className = article.className;
						this.innerHTML = article.innerHTML;
						this.scene.initArticle(this);
						this.scene.resized();
						this._image_mask.loaded = function(queue) {
							u.as(this, "backgroundImage", "url("+queue[0]._image.src+")");
							u.a.setOpacity(this, 1);
							this.node.transitioned = function() {
								u.a.transition(this, "none");
							}
							u.a.transition(this.node, "opacity 0.4s linear 0.4s");
							u.a.setOpacity(this.node, 1);
						}
						u.preloader(this._image_mask, ["/images/"+this.item_id+"/landscape/x440."+this.image_format]);
						u.ac(this, "ready");
					}
					u.request(this._prev, "/article/"+this._prev.item_id);
					u.bug("prev requested:" + this._prev.item_id)
				}
				else {
					this.resized();
					this._prev.transitioned = function() {
						u.a.transition(this, "none");
					}
					u.a.transition(this._prev, "all 0.4s linear");
					u.a.setOpacity(this._prev, 1);
				}
			}
			else {
				this._prev = false;
			}
		}
		scene.build = function() {
			u.a.transition(this, "none");
			u.a.setOpacity(this, 1);
			this.article = u.qs(".item", this);
			this.initArticle(this.article);
			u.as(this.article, "zIndex", 5);
			this.setSceneHeight();
			this.resized();
			this.article._info.transitioned = function() {
				u.a.transition(this, "none");
			}
			u.a.transition(this.article._info, "all 0.3s linear");
			u.a.setOpacity(this.article._info, 1);
			this.article._h1.transitioned = function() {
				u.a.transition(this, "none");
			}
			u.a.transition(this.article._h1, "all 0.3s linear 0.2s");
			u.a.setOpacity(this.article._h1, 1);
			this.article._body.transitioned = function() {
				u.a.transition(this, "none");
			}
			u.a.transition(this.article._body, "all 0.4s linear 0.4s");
			u.a.setOpacity(this.article._body, 1);
			this.article._image_mask.loaded = function(queue) {
				u.as(this, "backgroundImage", "url("+queue[0]._image.src+")");
				this.transitioned = function() {
					u.a.transition(this, "none");
					this.scene.article_scope = JSON.parse(u.getCookie("news_scope"));
					if(!this.scene.article_scope) {
						this.scene.article_scope = [];
						this.scene.complete_list_response = function(response) {
							var nodes = u.qsa("ul.news li.item", response);
							var i, node;
							for(i = 0; node = nodes[i]; i++) {
//								this.article_scope.push(u.cv(node, "item_id"));
								this.article_scope.push(u.cv(node, "url"));
							}
							this.initArticleScope();
						}
						u.request(this.scene, "/journal", {"callback":"complete_list_response"});
					}
					else {
						this.scene.initArticleScope();
					}
				}
				u.a.transition(this, "all 0.4s linear 0.4s");
				u.a.setOpacity(this, 1);
			}
			u.preloader(this.article._image_mask, ["/images/"+this.article.item_id+"/landscape/x440."+this.article.image_format]);
			u.ac(this.article, "ready");
		}
		scene.destroy = function() {
			this.destroy = null;
			u.e.removeEvent(document.body, "keyup", this.keys)
			var article = u.qs(".item", this);
			this.finalizeDestruction = function() {
				page.footerInTransition();
				this.parentNode.removeChild(this);
				page.cN.ready();
			}
			if(this.article._h1) {
				u.a.transition(this.article._image_mask, "all 0.2s linear");
				u.a.setOpacity(this.article._image_mask, 0);
				u.a.transition(this.article._info, "all 0.2s linear 0.1s");
				u.a.setOpacity(this.article._info, 0);
				u.a.transition(this.article._h1, "all 0.2s linear 0.2s");
				u.a.setOpacity(this.article._h1, 0);
				u.a.transition(this.article._body, "all 0.2s linear 0.3s");
				u.a.setOpacity(this.article._body, 0);
				if(this._prev) {
					u.a.transition(this._prev, "all 0.3s linear");
					u.a.setOpacity(this._prev, 0);
				}
				if(this._next) {
					u.a.transition(this._next, "all 0.3s linear");
					u.a.setOpacity(this._next, 0);
				}
				u.t.setTimer(this, this.finalizeDestruction, 600);
			}
			else {
				this.finalizeDestruction();
			}
		}
		scene.ready();
	}
}

/*i-playtype.js*/
Util.Objects["playtype"] = new function() {
	this.init = function(scene) {
		scene.resized = function() {
			var calc_width = u.browserW();
			calc_width = calc_width < 700 ? 700 : calc_width;
			var prop = (calc_width-700) / (1600-700);
			prop = prop > 1 ? 1 : prop;
			var actions_width = 250+Math.round((500-250)*prop);
			var padding_left = 30+Math.round((100-30)*prop);
			var deco1_width = Math.round((calc_width-actions_width-15));
			var deco1_height = (Math.round(deco1_width/1.8)+42);
			var deco2_width = Math.round((calc_width-15)*0.39);
			var deco3_width = Math.round((calc_width-15)*0.61);
			var deco3_height = deco3_width/1.48;
			var deco4_width = Math.round((calc_width-30)*0.57);
			var deco4_height = deco4_width/1.52;
			var deco5_width = Math.round((calc_width-30)*0.43);
			var deco6_width = Math.round((calc_width-15)*0.39);
			var deco6_height = deco6_width/0.77;
			var store_width = calc_width - (deco4_width + 75 + padding_left);
			u.as(this._ul, "width", actions_width+"px", false);
			if(this.deco1 && this.deco1._img && this.deco1._img.src) {
				u.as(this.deco1, "width", deco1_width+"px", false);
				deco1_height = this.deco1._img.offsetHeight+42;
				u.as(this._ul, "height", deco1_height-42+"px", false);
			}
			else {
				u.as(this._ul, "height", deco1_height+"px", false);
			}
			u.as(this._love, "top", (deco1_height + 145) + "px", false);
			u.as(this._love, "width", (deco3_width - 150) + "px", false);
			u.as(this._love, "left", deco2_width + "px", false);
			var love_top = this._love.offsetTop;
			var love_bottom = this._love.offsetHeight+love_top;
			if(this.deco2) {
				u.as(this.deco2, "width", deco2_width+"px", false);
				u.as(this.deco2, "top", this._love_h2.offsetHeight+love_top + "px", false);
			}
			if(this.deco3) {
				u.as(this.deco3, "width", deco3_width+"px", false);
				u.as(this.deco3, "top", love_bottom + "px", false);
				u.as(this.deco3, "left", deco2_width + "px", false);
			}
			u.as(this._store, "top", (deco3_height+love_bottom)+"px", false);
			u.as(this._store, "paddingLeft", padding_left+"px", false);
			u.as(this._store, "width", store_width+"px", false);
			var store_top = this._store.offsetTop;
			var deco4_top = this._store_h2.offsetHeight+store_top;
			var deco6_top = deco4_height + deco4_top;
			if(this.deco4) {
				u.as(this.deco4, "width", deco4_width+"px", false);
				u.as(this.deco4, "top", deco4_top + "px", false);
				u.as(this.deco4, "left", deco5_width + 30 + "px", false);
			}
			if(this.deco5) {
				u.as(this.deco5, "width", deco5_width+"px", false);
				u.as(this.deco5, "top", this._store.offsetHeight+store_top + "px", false);
			}
			if(this.deco6) {
				u.as(this.deco6, "width", deco6_width+"px", false);
				u.as(this.deco6, "top", deco6_top + 140 + "px", false);
			}
			u.a.setHeight(this, (deco6_top + deco6_height)+120 +"px", false);
			this.offsetHeight;
		}
		scene.scrolled = function() {
		}
		scene.ready = function(queue) {
			var scale = u.textscalers["playtype"];
			u.textscaler(this, scale);
			u.ac(this, "ready");
			u.ac(page.cN, "ready");
			page.cN.ready();
		}
		scene.build = function() {
			u.a.transition(this, "none");
			u.a.setOpacity(this, 1);
			if(!this.blocks) {
				var table, row;
				this._ul = u.qs("ul", this);
				var li_fonts = u.qs("li.fonts", this._ul)
				table = u.ae(li_fonts, "div", {"class":"table"});
				row = u.ae(table, "div", {"class":"row"});
				u.ae(row, u.qs("a", li_fonts));
				var li_products = u.qs("li.products", this._ul)
				table = u.ae(li_products, "div", {"class":"table"});
				row = u.ae(table, "div", {"class":"row"});
				u.ae(row, u.qs("a", li_products));
				u.ce(li_fonts);
				li_fonts.clicked = function() {
					window.open(this.url);
				}
				u.ce(li_products);
				li_products.clicked = function() {
					window.open(this.url);
				}
				this._love = u.qs(".love", this);
				this._love_h2 = u.qs(".love h2", this);
				this._store = u.qs(".store", this);
				this._store_h2 = u.qs(".store h2", this);
				this.blocks = u.qsa("h1,h2,p,li", this);
				this.resized();
				var i, node, node_y;
				var delay = 150;
				for(i = 0; node = this.blocks[i]; i++) {
					node.transitioned = function() {
						u.a.transition(this, "none");
					}
					u.a.transition(node, "all "+delay+"ms linear "+(i*delay)+"ms");
					u.a.setOpacity(node, 1);
				}
				this.deco1 = u.ae(this, "div", {"class":"deco deco1"});
				this.deco1.scene = this;
				this.deco1._img = u.ae(this.deco1, "img");
				this.deco1._src = "/img/desktop/playtype_1.jpg";
				this.deco2 = u.ae(this, "div", {"class":"deco deco2"});
				this.deco2.scene = this;
				this.deco2._img = u.ae(this.deco2, "img");
				this.deco2._src = "/img/desktop/playtype_2.jpg";
				this.deco3 = u.ae(this, "div", {"class":"deco deco3"});
				this.deco3.scene = this;
				this.deco3._img = u.ae(this.deco3, "img");
				this.deco3._src = "/img/desktop/playtype_3.jpg";
				this.deco4 = u.ae(this, "div", {"class":"deco deco4"});
				this.deco4.scene = this;
				this.deco4._img = u.ae(this.deco4, "img");
				this.deco4._src = "/img/desktop/playtype_4.jpg";
				this.deco5 = u.ae(this, "div", {"class":"deco deco5"});
				this.deco5.scene = this;
				this.deco5._img = u.ae(this.deco5, "img");
				this.deco5._src = "/img/desktop/playtype_5.jpg";
				this.deco6 = u.ae(this, "div", {"class":"deco deco6"});
				this.deco6.scene = this;
				this.deco6._img = u.ae(this.deco6, "img");
				this.deco6._src = "/img/desktop/playtype_6.jpg";
				this.deco_i = 1;
				this.loadDeco = function() {
					if(this.deco_i <= 6) {
						if(this["deco"+this.deco_i]._img) {
							u.preloader(this["deco"+this.deco_i], [this["deco"+this.deco_i]._src], {"callback":this._decoReady});
						}
						else {
							this["deco"+this.deco_i].videoplayer.ended = function() {
								this.play();
							}
							this["deco"+this.deco_i].videoplayer.canplaythrough = function() {
								this.scene.resized();
								this.parentNode.transitioned = function() {
									u.a.transition(this, "none");
									this.scene.loadDeco();
								}
								u.a.transition(this.parentNode, "opacity 0.5s linear 0.5s");
								u.a.setOpacity(this.parentNode, 1);
							}
							this["deco"+this.deco_i].videoplayer.loadAndPlay(this["deco"+this.deco_i]._src);
						}
						this.deco_i++;
					}
				}
				this._decoReady = function(queue) {
					this._img.src = queue[0]._image.src;
					this.scene.resized();
					this.transitioned = function() {
						u.a.transition(this, "none");
						this.scene.loadDeco();
					}
					u.a.transition(this, "opacity 0.5s ease-in");
					u.a.setOpacity(this, 1);
				}
				u.t.setTimer(this, this.loadDeco, 450);
			}
			this.resized();
			u.a.transition(page.fN, "none");
			u.a.setOpacity(page.fN, 1);
		}
		scene.destroy = function() {
			this.destroy = null;
			this.finalizeDestruction = function() {
				page.footerInTransition();
				this.parentNode.removeChild(this);
				page.cN.ready();
			}
			if(this.blocks) {
				u.a.transition(this.deco1, "all 0.2s linear");
				u.a.setOpacity(this.deco1, 0);
				u.a.transition(this.deco2, "all 0.2s linear");
				u.a.setOpacity(this.deco2, 0);
				u.a.transition(this.deco3, "all 0.2s linear");
				u.a.setOpacity(this.deco3, 0);
				u.a.transition(this.deco4, "all 0.2s linear");
				u.a.setOpacity(this.deco4, 0);
				u.a.transition(this.deco5, "all 0.2s linear");
				u.a.setOpacity(this.deco5, 0);
				u.a.transition(this.deco6, "all 0.2s linear");
				u.a.setOpacity(this.deco6, 0);
				var i, node, node_y, j = 0;
				var calc_height = u.browserH();
				var scroll_offset = u.scrollY();
				var delay = 150;
				for(i = 0; node = this.blocks[i]; i++) {
					node_y = u.absY(node);
					if(node_y + node.offsetHeight > scroll_offset && node_y < scroll_offset + calc_height) {
						j++;
						u.a.transition(node, "all "+delay+"ms linear "+(j*delay)+"ms");
						u.a.setOpacity(node, 0);
					}
				}
				u.t.setTimer(this, this.finalizeDestruction, (j*delay) + 200);
			}
			else {
				this.finalizeDestruction();
			}
		}
		scene.ready();
	}
}


/*i-scene.js*/
Util.Objects["scene"] = new function() {
	this.init = function(scene) {
		scene.resized = function() {
			var new_height;
			var viewable_height = (u.browserH() - page.hN.offsetHeight - page.fN.offsetHeight);
			var current_height = u.gcs(this, "height");
			if(parseInt(current_height) <= viewable_height) {
				new_height = viewable_height+"px";
			}
			else {
				new_height = "auto";
			}
			u.bug(current_height + ", " + viewable_height + ", " + new_height)
			if(current_height != new_height) {
				u.as(this, "height", new_height, false);
			}
			u.bug(u.gcs(this, "height"))
			this.offsetHeight;
		}
		scene.scrolled = function() {
		}
		scene.ready = function(queue) {
			var scale = u.textscalers["plain"];
			u.textscaler(this, scale);
			u.ac(this, "ready");
			u.ac(page.cN, "ready");
			page.cN.ready();
		}
		scene.build = function() {
			u.a.transition(this, "none");
			u.a.setOpacity(this, 1);
			this.resized();
			u.a.transition(page.fN, "none");
			u.a.setOpacity(page.fN, 1);
		}
		scene.destroy = function() {
			this.destroy = null;
			this.transitioned = function() {
				u.a.transition(this, "none");
				page.footerInTransition();
				this.parentNode.removeChild(this);
				page.cN.ready();
			}
			if(u.gcs(this, "opacity") == 0) {
				this.transitioned();
			}
			else {
				u.a.transition(this, "all 0.5s ease-in");
				u.a.setOpacity(this, 0);
			}
		}
		scene.ready();
	}
}

