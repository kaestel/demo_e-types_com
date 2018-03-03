
/*seg_mobile_include.js*/

/*u.js*/
if(!u || !Util) {
	var u, Util = u = new function() {};
	u.version = 0.8;
	u.bug = function() {};
	u.nodeId = function() {};
	u.stats = new function() {this.pageView = function(){};this.event = function(){};this.customVar = function(){};}
}


/*u-dom.js*/
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


/*u-init.js*/
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


/*u-string-desktop_light.js*/
if(String.prototype.trim == undefined) {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, "");
	};
}
if(String.prototype.substr == undefined || "ABC".substr(-1,1) == "A") {
	String.prototype.substr = function(start_index, length) {
		start_index = start_index < 0 ? this.length + start_index : start_index;
		start_index = start_index < 0 ? 0 : start_index;
		length = length ? start_index + length : this.length;
		return this.substring(start_index, length);
	};
}


/*u-array-desktop_light.js*/
if(!Array.prototype.unshift || new Array(1,2).unshift(0) != 3) {
	Array.prototype.unshift = function(a) {
		var b;
		this.reverse();
		b = this.push(a);
		this.reverse();
		return b
	};
}
if(!Array.prototype.shift) {
	Array.prototype.shift = function() {
		for(var i = 0, b = this[0], l = this.length-1; i < l; i++ ) {
			this[i] = this[i+1];
		}
		this.length--;
		return b;
	};
}
if(!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (obj, start) {
		for(var i = (start || 0); i < this.length; i++) {
			if(this[i] == obj) {
				return i;
			}
		}
		return -1;
	}
}


/*u-debug.js*/
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
			if(!document.getElementById("#debug_id_"+corner)) {
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
			u.ae(document.getElementById("#debug_id_"+corner), "div", ({"style":"color: " + color})).innerHTML = message ? message.replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/&lt;br&gt;/g, "<br>") : "Util.bug with no message?";
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


/*i-page.js*/
Util.Objects["page"] = new function() {
	this.init = function(page) {
		page.hN = document.getElementById("header"); 
		page.cN = document.getElementById("content");  
		page.nN = document.getElementById("navigation");  
		page.nN.ul = page.nN.getElementsByTagName("ul")[0];
		page.fN = document.getElementById("footer");  
		page.hN.service = page.hN.getElementsByTagName("li");
		var i, node;
		for (i = 0; node = page.hN.service[i]; i) {
			if (!node.className.match(/keynav/)) {
				page.nN.ul.insertBefore(node, page.nN.ul.firstChild)
			}
			else {
				i++;
			}
		}
	}
}
window.onload = u.init;


/*i-front.js*/
Util.Objects["front"] = new function() {
	this.init = function(scene) {
		scene.nodes = scene.getElementsByTagName("li");
		var i, node;
		for(i = 0; node = scene.nodes[i]; i++) {
			if (node.className.match(/news/)) {
				node._info = node.getElementsByTagName("dl")[0];
				if (node._info) {
					node._info.unit = node._info.getElementsByTagName("dd")[0];
					node._info.unit.innerHTML += "&nbsp;&nbsp;/&nbsp;";
					node.insertBefore(node._info, node.firstChild);
				}
				node.img = document.createElement("img");
				node.img.src = "/images/"+u.cv(node, "item_id")+"/landscape/" + node.offsetWidth + "x."+u.cv(node, "i_la");
				node.insertBefore(node.img, node.firstChild);
			}
		}
	}
}


/*i-article.js*/
Util.Objects["article"] = new function() {
	this.init = function(scene) {
		var node = scene.getElementsByTagName("div")[0];
		node.img = document.createElement("img");
		node.img.src = "/images/"+u.cv(node, "item_id")+"/landscape/" + node.offsetWidth + "x."+u.cv(node, "i_la");
		node.insertBefore(node.img, node.firstChild);
		node.unit = node.getElementsByTagName("dd")[0];
		node.unit.innerHTML += "&nbsp;&nbsp;/&nbsp;&nbsp;";
		node.client = node.getElementsByTagName("dd")[1];
		node.client.innerHTML += "&nbsp;&nbsp;/&nbsp;&nbsp;";
	}
}


/*i-news.js*/
Util.Objects["news"] = new function() {
	this.init = function(scene) {
		scene.nodes = scene.getElementsByTagName("li");
		var i, node;
		for(i = 0; node = scene.nodes[i]; i++) {
			if (node.className.match(/item/)) {
				node._info = node.getElementsByTagName("dl")[0];
				if (node._info) {
					node._info.unit = node._info.getElementsByTagName("dd")[0];
					node._info.unit.innerHTML += "&nbsp;&nbsp;/&nbsp;&nbsp;";
					node.insertBefore(node._info, node.firstChild);
				}
				node.img = document.createElement("img");
				node.img.src = "/images/"+u.cv(node, "item_id")+"/landscape/" + node.offsetWidth + "x."+u.cv(node, "i_la");
				node.insertBefore(node.img, node.firstChild);
			}
		}
	}
}

