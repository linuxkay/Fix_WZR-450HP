var injected = false;
var nrpPasswdCheck=false,
		nrpUsernameCheck=false,
		nrpBirthdayCheck=false,
		nrpParentEmailCheck=false,
		nrpEmailCheck=false;
var nrpSocialLogin=false;
var runNameVerif=true;
var nrpTextScripts=[];
var nrpSourceScripts=[];
var TopifyMobileUrl=false;
var AutoFillTimeout;

function setPopupVertically(){
	var container = document.getElementById("NewRegistrationPopup");
	var inner= document.getElementById("NewRegistrationContainer");
	var inHeight=inner.offsetHeight;
	container.style.height=(window.innerHeight);
	container.style.width=window.innerWidth;
	var conHeight=container.offsetHeight;
	if (conHeight-inHeight>0) inner.style.marginTop=((conHeight-inHeight)/2)+"px";
	else inner.style.marginTop="0px";
}

if (typeof AJAX_Compatible=="undefined" || AJAX_Compatible==false){
	var AJAX_Compatible=true;
}

if (typeof BBURL=="undefined"){
	var BBURL='';
}

if (typeof SESSIONURL=="undefined"){
	var SESSIONURL='';
}

if (typeof SECURITYTOKEN=="undefined"){
	var SECURITYTOKEN = "guest";
}

if (typeof registerFile=="undefined"){
	var registerFile='register.php';
}

var nrpNewRegistrationPopup=document.getElementById("NewRegistrationPopup");
if (typeof nrpNewRegistrationPopup != 'undefined' && nrpNewRegistrationPopup!=null){
	injected=true;
}

if (typeof vBSecurity=="undefined" || vBSecurity==''){
	var vBSecurity = {
		imageBasePath : '/dbtech/vbsecurity_pro/images/',
		rules : { passwordLength : {phrase : 'Must be at least 8 characters', params : {passwordLength : 8 }},containsLowerCase : {phrase : 'Must contain lower-case characters'},containsNumbers : {phrase : 'Must contain numbers'},containsSymbols : {phrase : 'Must contain symbols'} },
		vbversion : 3 // DO NOT CHANGE THIS OR YOU WILL BREAK EVERYTHING!
	};
}
var VSvBSecurity=vBSecurity;

//check if run nameverify
if (typeof userAgent=='undefined'){
	var userAgent = navigator.userAgent.toLowerCase();
	var is_opera = (YAHOO.env.ua.opera > 0);
	var is_saf = (YAHOO.env.ua.webkit > 0);
	var is_webtv = (userAgent.indexOf("webtv") != -1);
	var is_ie = ((YAHOO.env.ua.ie > 0) && (!is_opera) && (!is_saf) && (!is_webtv));
	var is_ie4 = (YAHOO.env.ua.ie == 4);
	var is_ie7 = (YAHOO.env.ua.ie >= 7);
	var is_ie6 = (YAHOO.env.ua.ie == 6);
	var is_ps3 = (userAgent.indexOf("playstation 3") != -1);
	var is_moz = (YAHOO.env.ua.gecko > 0);
	var is_kon = (userAgent.indexOf("konqueror") != -1);
	var is_ns = ((userAgent.indexOf("compatible") == -1) && (userAgent.indexOf("mozilla") != -1) && (!is_opera) && (!is_webtv) && (!is_saf));
	var is_ns4 = ((is_ns) && (parseInt(navigator.appVersion) == 4));
	var is_mac = (userAgent.indexOf("mac") != -1);
	var pointer_cursor = (is_ie ? "hand" : "pointer");
	//runNameVerif=false;
}

/* Social login handler */
function $_GET(q,s) {
	s = (s) ? s : window.location.search;
	var match = s.match('[?&]' + q + '=([^&]+)');
	return match ? match[1] : null;
}
var currentPath=window.location.pathname;

if (currentPath.indexOf(registerFile) >=0)
{
	//on register page
	//check if came back from social with no errors
	var socialError = $_GET('error_code');
	var socialDo = $_GET('do');
	var autoDisplayReg=$_GET('autodisplayreg');
	//check if came from Topify
	TopifyMobileUrl=$_GET('mobileurl');

	if (!socialError && socialDo=='social'){
		nrpSocialLogin=true;
		//evokeRegistrationPopup(null);
		//display popup
		document.getElementById("NewRegistrationPopup").style.display="block";
		document.getElementsByTagName("BODY")[0].style.overflowY="hidden";
		document.getElementById("nrpStepBack").style.display="none";

		//add Plan hidden field
		var chosenPlan = readCookie('NrpChosenPlan');
		if (chosenPlan!=""){
			var popupForm=document.getElementById("NewRegistrationPopup").getElementsByTagName("form")[0];
			if (popupForm && popupForm!=null){
				var chosenPlanValues=chosenPlan.split(",");
				var hiddenPlan = document.createElement("input");
				hiddenPlan.type = "hidden";
				hiddenPlan.id = chosenPlanValues[0];
				hiddenPlan.name = chosenPlanValues[1];
				hiddenPlan.value = chosenPlanValues[2];
				popupForm.appendChild(hiddenPlan);
			}
		}

	} else if (autoDisplayReg=="true") {
		//if redirected from Home/Active Topics/... pages without 'forum' in path
		setTimeout(function(){evokeRegistrationPopup(null);}, 500);
	}
}

function createCookie(name,value,days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days*24*60*60*1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

//Verify user email
function nrp_AJAX_EmailVerify(C, A) {
	/*if (typeof userAgent == 'undefined' || userAgent==null){
	 var userAgent=navigator.userAgent;
	 }
	 if (typeof is_saf == 'undefined' || is_saf==null){
	 var is_saf=true;
	 }
	 var B = userAgent.match(/applewebkit\/([0-9]+)/i);
	 */
	if (AJAX_Compatible /*&& !(is_saf && !(B[1] >= 412))*/) {
		if (typeof fetch_object == 'undefined' || fetch_object==null){
			var rpup=document.getElementById("NewRegistrationPopup");
			this.textobj=rpup.querySelector('[name="email"]');				
		} else {
			this.textobj = fetch_object(A);
		}
		
		this.textobj.obj = this;
		this.varname = C;
		this.fragment = "";
		this.timeout = null;
		this.ajax_req = null;
		this.get_text = function() {
			this.fragment = new String(this.textobj.value);
			this.fragment = this.fragment.replace(/^\s+/g, "");
			this.fragment = encodeURIComponent(this.fragment);
		};
		this.email_verify = function() {
			if (this.ajax_req) this.ajax_req.abort();
			this.ajax_req = new XMLHttpRequest();
			this.ajax_req.onreadystatechange = function(){
				if(this.readyState == 4 && this.status == 200){
					handle_email_ajax_request(this);
				}
			}
			this.ajax_req.open('POST', BBURL + "/ajax.php?do=vsRegistrationEmailCheck&email="+this.fragment);
			this.ajax_req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			this.ajax_req.send();			
		};
		this.get_text();
		this.email_verify();
		function handle_email_ajax_request(G) {
			if (G.responseText) {
				var response = G.responseText;
				response=response.replace(/(\r\n\t|\n|\r\t)/gm,"");
				var I = document.getElementById("nrpEmailError");
				if (response == "true") {
					nrpEmailCheck=true;
					document.getElementById("nrpEmailError").style.display="none";
				} else {
					I.style.display = "block";
					I.className="redbox";
					I.innerHTML = response;
					nrpEmailCheck=false;
				}
			}
		}
		;
	}	
};


//VB PHP.urlencode
function nrpUrlencode(D) {
    D = escape(D.toString()).replace(/\+/g, "%2B");
    var B = D.match(/(%([0-9A-F]{2}))/gi);
    if (B) {
        for (var C = 0; C < B.length; C++) {
            var A = B[C].substring(1, 3);
            if (parseInt(A, 16) >= 128) {
                D = D.replace(B[C], "%u00" + A)
            }
        }
    }
    D = D.replace("%25", "%u0025");
    return D
};

//Verify user name
function vB_AJAX_NameVerify(C, A) {
	var B = userAgent.match(/applewebkit\/([0-9]+)/);
	var rp=0;
	if (AJAX_Compatible && !(is_saf && !(B[1] >= 412))) {
		if (typeof document.getElementById("NewRegistrationPopup")!='undefined' && document.getElementById("NewRegistrationPopup")!=null){
			var rpup=document.getElementById("NewRegistrationPopup");
			this.textobj=rpup.getElementsByClassName("bginput")[0];
			rp=1;
		} else {
			this.textobj = fetch_object(A);
		}
		this.textobj.setAttribute("autocomplete", "off");
		this.textobj.obj = this;
		this.varname = C;
		this.fragment = "";
		this.timeout = null;
		this.ajax_req = null;
		this.get_text = function() {
			this.fragment = new String(this.textobj.value);
			this.fragment = this.fragment.replace(/^\s+/g, "")
		};
		this.key_event_handler = function(D) {
			this.get_text();
			clearTimeout(this.timeout);
			this.timeout = setTimeout(this.varname + ".name_verify();", 500)
		};
		this.name_verify = function() {
			if (this.ajax_req) this.ajax_req.abort();
			this.ajax_req = new XMLHttpRequest();
			this.ajax_req.onreadystatechange = function(){
				if(this.readyState == 4 && this.status == 200){
					handle_username_ajax_request(this);
				}
			}
			this.ajax_req.open('POST', BBURL + "/ajax.php?do=verifyusername");
			this.ajax_req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			this.ajax_req.send(SESSIONURL + "securitytoken=" + SECURITYTOKEN + "&do=verifyusername&username=" + nrpUrlencode(this.fragment));
		};
		function handle_username_ajax_request(G) {
			if (G.responseXML && (G.responseXML.getElementsByTagName("status").length > 0)) {
				var D = G.responseXML.getElementsByTagName("status")[0].firstChild.nodeValue;
				var H = G.responseXML.getElementsByTagName("image")[0].firstChild.nodeValue;
				var F = G.responseXML.getElementsByTagName("message")[0].firstChild.nodeValue;
				if (rp) {
					var I = rpup.getElementsByClassName("nrp-inputwrapper")[0].getElementsByTagName('div')[1];
				} else {
					var I = document.getElementById("reg_verif_div");
				}
				var E = document.getElementById("reg_verif_image");
				E.src = H;
				E.style.display = "inline";
				if (D == "valid") {
					I.style.display = "block";
					I.className = "greenbox"
				} else {
					I.style.display = "block";
					I.className = "redbox"
				}
				I.innerHTML = F
			}
		};
		this.textobj.onkeyup = function(D) {
			return this.obj.key_event_handler(D)
		}
	}
};

//Make password visible/hidden
function switchPasswdVisibility(event){
	event.preventDefault();
	var className=event.target.className;
	if (className=="off"){
		document.getElementById("password").type = 'text';
		event.target.className="";
	} else {		
		document.getElementById("password").type = 'password';
		event.target.className="off";
	}
}

function attachPasswordRules(nrpPasswdField){
	// vbSecurity plugin
	//var vBSecurity={};
	VSvBSecurity.passwordCheck = {};
	VSvBSecurity.passwordCheck.passwordLength = function(params) {
		return this.length >= params.passwordLength;
	};
	VSvBSecurity.passwordCheck.containsLowerCase = function() {
		return this.match(/[a-z]+/);
	};
	VSvBSecurity.passwordCheck.containsUpperCase = function() {
		return this.match(/[A-Z]+/);
	};
	VSvBSecurity.passwordCheck.containsNumbers = function() {
		return this.match(/[0-9]+/);
	};
	VSvBSecurity.passwordCheck.containsSymbols = function() {
		return this.match(/\W+/);
	};
	VSvBSecurity.runTest = function(event) {
		var self = event.target,
				pwd = self.value;
		nrpPasswdCheck=true;
		for (var i in VSvBSecurity.rules) {
			if (typeof VSvBSecurity.passwordCheck[i] != 'function') {
				continue;
			}
			var res = VSvBSecurity.passwordCheck[i].call(pwd, VSvBSecurity.rules[i].params);
			if (!res) {
				nrpPasswdCheck = false;
			}
			var nrpPwdRuleDiv=self.parentNode.querySelectorAll('span[name="password_' + i + '"]')[0];
			nrpPwdRuleDiv.className=(res ? 'nrp-OK' : 'nrp-notOK');
		}
	};
	// End vbSecurity
	
	//Check if password rules were added already
	var pRulesObj=document.getElementById("passwordrules");
	if (typeof pRulesObj == 'undefined' || pRulesObj==null){
		//attach rules divs
		var nrpPasswordRules = document.createElement("div");
		nrpPasswordRules.id="passwordrules";
		nrpPasswdField.parentNode.insertBefore(nrpPasswordRules, nrpPasswdField.nextSibling);
	}

	var nrpNewPasswdField=document.getElementById("newpassword");
	if (typeof nrpNewPasswdField != 'undefined' && nrpNewPasswdField!=null){
		nrpNewPasswdField.parentNode.insertBefore(nrpPasswordRules, nrpNewPasswdField.nextSibling);
	}

	for (var i in VSvBSecurity.rules) {
		var nrpPwdRuleDiv=document.createElement("div");
		nrpPwdRuleDiv.setAttribute("name", "password_" + i);
		nrpPwdRuleDiv.innerHTML=VSvBSecurity.rules[i].phrase;
		var nrpPwdRuleSpan=document.createElement("span");
		nrpPwdRuleSpan.className="nrp-notOK";
		nrpPwdRuleSpan.setAttribute("name", "password_" + i);
		nrpPwdRuleDiv.appendChild(nrpPwdRuleSpan);
		nrpPasswordRules.appendChild(nrpPwdRuleDiv);
		if (typeof nrpNewPasswdField != 'undefined' && nrpNewPasswdField!=null){
			nrpNewPasswdField.appendChild(nrpPwdRuleDiv);
		}
	}

	nrpPasswdField.addEventListener("change", VSvBSecurity.runTest);
	nrpPasswdField.addEventListener("input", VSvBSecurity.runTest);
	//nrpPasswdField.oninput();
	if (typeof nrpNewPasswdField != 'undefined' && nrpNewPasswdField!=null){
		nrpNewPasswdField.addEventListener("keyup", VSvBSecurity.runTest(nrpNewPasswdField));
		nrpNewPasswdField.addEventListener("input", VSvBSecurity.runTest(nrpNewPasswdField));
		//nrpNewPasswdField.oninput();
	}
}

//Check for user profile page
//if password field is found attach password rules
var profilePasswordChange=document.getElementsByName("newpassword");
if (typeof profilePasswordChange != 'undefined' && profilePasswordChange[0]!=null){
	attachPasswordRules(profilePasswordChange[0]);
}

/* show parent email box based on birthday */
function nrpValidateBirthday() {
	var age = getAge();
	if (age === false) {
		document.getElementById('parent-email').style.display = 'none';
	} else {
		if (age <= 13) {
			document.getElementById('parent-email').style.display = 'block';
			nrpParentEmailCheck = false;
		} else {
			document.getElementById('parent-email').style.display = 'none';
			document.getElementById('nrpParentEmail').value = "";
			document.getElementById("nrpParentEmailError").style.display="none";
			nrpParentEmailCheck = true;
		}
	}
}

function getAge() {
	// get birthday elements
	var monthElement = document.getElementById("month");
	var dayElement   = document.getElementById("day");
	var yearElement  = document.getElementById("year");

	// get birthday values
	var month = monthElement.options[monthElement.selectedIndex].value;
	var day   = dayElement.options[dayElement.selectedIndex].value;
	var year  = yearElement.options[yearElement.selectedIndex].value;

	if (!month || !day || !year) {
		return false;
	}

	// calculate age
	var today           = new Date();
	var birthDate       = new Date(year, month - 1, day, 0, 0, 0, 0);
	var age 			= today.getFullYear() - birthDate.getFullYear();
	var m 				= today.getMonth() - birthDate.getMonth();

	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}

	return age;
}

/* Popup function */
function evokeRegistrationPopup(event){
	if (event) event.preventDefault();
	if (!injected){
		window.addEventListener('resize', setPopupVertically, true);
		var xhr = new XMLHttpRequest();
		var bdy = document.getElementsByTagName("body")[0];
		xhr.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200){
				document.body.insertAdjacentHTML('beforeend',xhr.responseText);
				injected = true;

				if (TopifyMobileUrl && TopifyMobileUrl.length>0) document.getElementById("NewRegistrationPopup").className='cameFromTopify';

				if (!nrpSocialLogin) {
					nprDisplayRegStep(1);
					//prepopulate fields if cookie exists
					var formDataCookie=readCookie("tempSaveFormData");
					if (formDataCookie && formDataCookie!=null){
						var formFields=formDataCookie.split("&");
						for (var i=0;i<formFields.length;i++){
							var kv=formFields[i].split("=");
							var el=document.getElementsByName(decodeURIComponent(kv[0]));
							if (typeof el[0] != 'undefined' && el[0]!=null){
								el[0].value=decodeURIComponent(kv[1]);
							}
						}
					}
				}
				else {
					document.getElementById("NewRegistrationPopup").style.display="block";
					document.getElementsByTagName("BODY")[0].style.overflowY="hidden";
					document.getElementById("nrpStepBack").style.display="none";
				}

				var nrpPasswdField=document.getElementById("password");
				if (typeof nrpPasswdField != 'undefined' && nrpPasswdField!=null){
					attachPasswordRules(nrpPasswdField);
				}

				var nrpEmail=document.getElementById("nrpEmail");
				if (typeof nrpEmail != 'undefined' && nrpEmail!=null){
					nrpEmail.addEventListener("input", nrpVerifyEmail);
					nrpEmail.addEventListener("change", nrpVerifyEmail);
					var el={target:nrpEmail};
					if (nrpEmail.value!="") nrpVerifyEmail(el);
				}

				var nrpParentEmail=document.getElementById("nrpParentEmail");
				if (typeof nrpParentEmail != 'undefined' && nrpParentEmail!=null){
					nrpParentEmail.addEventListener("input", nrpVerifyParentEmail);
					nrpParentEmail.addEventListener("change", nrpVerifyParentEmail);
					var el={target:nrpParentEmail};
					if (nrpParentEmail.value!="") nrpVerifyParentEmail(el);
				}

				var mainRegContainer=document.getElementById('NewRegistrationContainer');
				var scrArr=document.getElementById('NewRegistrationPopup').getElementsByTagName('script');
				var scriptCounter=0;


				function nrpLoadScript(path) {
					scriptCounter++;
					var done = false;
					var scr = document.createElement('script');
					scr.onload = handleLoad;
					scr.onreadystatechange = handleReadyStateChange;
					scr.onerror = handleError;
					scr.src = path;
					document.body.appendChild(scr);
					function handleLoad() {
						if (!done) {
							done = true;
							//callback(path, "ok");
							insertScriptsOnPage();
						}
					}
					function handleReadyStateChange() {
						var state;

						if (!done) {
							state = scr.readyState;
							if (state === "complete") {
								handleLoad();
							}
						}
					}
					function handleError() {
						if (!done) {
							done = true;
							//callback(path, "error");
						}
					}
				}


				for (var n = 0; n < scrArr.length; n++) {
					if (scrArr[n].innerHTML!="" && scrArr[n].innerHTML!=null){
						var txt=scrArr[n].innerHTML.replace(/\t+/g, "");
						if(txt.indexOf('googleapis.com/ajax/libs/jquery')>=0){
							//add jQuery library
							if (typeof(jQuery) == "undefined") {
								var insertScript = document.createElement('script');
								insertScript.type = "text/javascript";
								insertScript.src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js";
								document.head.appendChild(insertScript);
							}
						} else if (!runNameVerif && txt.indexOf('NameVerify')>=0){
							//skip
						} else {
							var insertScript = document.createElement('script');
							insertScript.type = "text/javascript";
							insertScript.text=txt;
							nrpTextScripts.push(insertScript);//document.body.appendChild(insertScript);
						}
					} else if (scrArr[n].src!="" && scrArr[n].src!=null){
						if (runNameVerif==false && scrArr[n].src.indexOf('nameverif')>=0){
							//skip
						} else {
							//var insertScript = document.createElement('script');
							//insertScript.setAttribute('src',scrArr[n].src);
							//document.body.appendChild(insertScript);
							nrpSourceScripts.push(scrArr[n].src);
						}
					}
				}

				function insertScriptsOnPage(){
					if (scriptCounter<nrpSourceScripts.length && nrpSourceScripts[scriptCounter]!=""){
						nrpLoadScript(nrpSourceScripts[scriptCounter]);
					}
				}

				function loadTheRestScripts(){
					for (var n = 0; n < nrpTextScripts.length; n++) {
						document.body.appendChild(nrpTextScripts[n]);
					}
				}

				insertScriptsOnPage();

				var nrpCheckAllScriptsLoadedChecked=0
				var nrpCheckAllScriptsLoaded = setInterval(CheckAllScriptsLoaded, 300);

				function CheckAllScriptsLoaded(){
					nrpCheckAllScriptsLoadedChecked++;
					if (scriptCounter>=nrpSourceScripts.length || nrpCheckAllScriptsLoadedChecked>20){
						clearInterval(nrpCheckAllScriptsLoaded);
						loadTheRestScripts();
					}
				}

				//if username is not empty -> run validation

				var nrpInputField=document.getElementById("NewRegistrationPopup").getElementsByClassName("bginput")[0];
				if (typeof nrpInputField != 'undefined' && nrpInputField!=null && nrpInputField.value!=""){
					setTimeout(function(){
						var e = document.createEvent('HTMLEvents');
						e.initEvent('keyup', false, true);
						nrpInputField.dispatchEvent(e);
					}, 500);
				}
				if (typeof nrpInputField != 'undefined' && nrpInputField!=null){
					//attach autofill checker
					AutoFillTimeout = setInterval(function() {
						if (nrpInputField.value!="") {
							var e = document.createEvent('HTMLEvents');
							e.initEvent('keyup', false, true);
							nrpInputField.dispatchEvent(e);
							clearInterval(AutoFillTimeout);
						}
					}, 200);
				}
			}
		}

		//xhr.open('GET',forumHome.concat('?vsRegistration=true'+(nrpSocialLogin?'&do=social':'')));
		//xhr.open('GET',(window.location.href.replace(window.location.hash,'')).concat((window.location.search!=""?"&":"?")+'vsRegistration=true'+(nrpSocialLogin?'&do=social':'')+window.location.hash));
		xhr.open('GET', BBURL + '/ajax.php?do=vsRegistration' + (nrpSocialLogin ? '&do=social' : '') + (TopifyMobileUrl ? '&mobileurl=' + TopifyMobileUrl : '') + window.location.hash);
		xhr.send();
	} else {
		nprDisplayRegStep(nrpRegistrationStep);

	}
	return false;
}
var nrpRegistrationStep;
var nrpQuery =  window.location.hash.substring(1);
var nrpVars = nrpQuery.match(/registrationstep\=([0-9]+)/gi);

if (nrpVars!=null && nrpVars.length>0){
	var ntpTmp=nrpVars[0].split("=");
	nrpRegistrationStep=ntpTmp[1];
}
if (typeof nrpRegistrationStep === 'undefined' || nrpRegistrationStep<1) nrpRegistrationStep=1;
//nprDisplayRegStep(nrpRegistrationStep);


function appendHtml(el, str) {
	var div = document.createElement('div');
	div.innerHTML = str;
	while (div.children.length > 0) {
		el.appendChild(div.children[0]);
	}
}

function nrpVerifyEmail(event){
	var nrpEF=event.target;
	if (nrpEF.value!=""){
		if (!validateEmail(nrpEF.value)){
			document.getElementById("nrpEmailError").style.display="block";
			document.getElementById("nrpEmailError").className="redbox";
			document.getElementById("nrpEmailError").innerHTML="You entered an invalid email address.";
			nrpEmailCheck=false;
		} else {
			nrp_AJAX_EmailVerify('regemail_verif', 'nrpEmail');		
		}
	}
}

function nrpVerifyParentEmail(event) {
	var parentEmail = event.target;
	if (!validateEmail(parentEmail.value)) {
		document.getElementById("nrpParentEmailError").style.display="block";
		document.getElementById("nrpParentEmailError").className="redbox";
		document.getElementById("nrpParentEmailError").innerHTML="Please enter a valid parent email";
		nrpParentEmailCheck = false;
	} else {
		document.getElementById("nrpParentEmailError").style.display="none";
		nrpParentEmailCheck = true;
	}
}

function validateEmail(email) {
	if (email!=""){
		var re = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?/;
		return re.test(email);
	} else {
		return 1;
	}
}
function nrpShowPrivileges(event){
	event.preventDefault();
	document.getElementById("nrpPrivilegesPopup").style.display="block";
	return false;
}
function nrpShowForumRules(event){
	event.preventDefault();
	document.getElementById("nrpForumRulesPopup").style.display="block";
	document.getElementById("vs_forum_rules").style.display="block";
	return false;
}
function nrpClosePopup(event,popupId){
	event.preventDefault();
	document.getElementById(popupId).style.display="none";
	return false;
}
function nrpStepBack(event){
	event.preventDefault();
	nrpGoToStep(event,nrpRegistrationStep-1,null);
	return false;
}

function nrpGoToStep(event, stepNumber, currentEl)
{
	if (event!=null) event.preventDefault();
	var nrpErrors=0;
	if (stepNumber=='2' && currentEl!=null){
		// set radio button
		var chosenPlanCheckBox=currentEl.parentElement.querySelector(".nrp-radiomembership");
		chosenPlanCheckBox.checked = true;
		//save cookies
		createCookie(cookiePrefix + 'membershiplevel', chosenPlanCheckBox.value, 1);
		createCookie('NrpChosenPlan',''+chosenPlanCheckBox.id+','+chosenPlanCheckBox.name+','+chosenPlanCheckBox.value+'',1);		
	}
	if (stepNumber=='3'){
		if (!nrpSocialLogin){
			// Check email by triggering change event
			if ("createEvent" in document) {
				var evt = document.createEvent("HTMLEvents");
				evt.initEvent("change", false, true);
				document.getElementById("nrpEmail").dispatchEvent(evt);
			}
			else
				document.getElementById("nrpEmail").fireEvent("onchange");
			
			var vsVerificationStandard=document.getElementById("vs_verification_standard_method");

			//create solvemedia wrapper
			var solvemediaWrapper = document.createElement('div');
			solvemediaWrapper.id="solvemediaWrapper";
			if (typeof vsVerificationStandard != 'undefined' && vsVerificationStandard!=null){
				vsVerificationStandard.appendChild(solvemediaWrapper);
			} else {
				document.getElementById('nrpRegistrationStep3').querySelector(".nrp-shadowbox").appendChild(solvemediaWrapper);
			}
			if (typeof ACPuzzle != 'undefined'){
				ACPuzzle.create(adcopyPubkey, 'solvemediaWrapper', {multi: true});
			}

		}

	}

	/*if (!nrpErrors){*/
	window.location.hash = 'registrationstep='+stepNumber;
	nrpRegistrationStep=stepNumber;
	nprDisplayRegStep(stepNumber);
	/*}*/
	return false;
}

function nrpShowError(errorMsg){
	var nrpErrorMessage=document.getElementById('nrpErrorMessage');
	if (typeof nrpRegistrationStep != 'undefined' && nrpErrorMessage!=null){
		var errorMsgDiv=nrpErrorMessage.querySelector(".nrp-errortext");
		errorMsgDiv.innerHTML=errorMsg;
		nrpErrorMessage.style.display="block";
	} else {
		nrpErrorMessage=document.createElement("div");
		nrpErrorMessage.id="nrpErrorMessage";
		nrpErrorMessage.className="nrp-popup";
		nrpErrorMessage.innerHTML='<div class="nrp-popuptitle nrp-errortitle">Error</div><div class="nrp-errortext">'+errorMsg+'</div>';
		var nrpErrorMessageClose=document.createElement("a");
		nrpErrorMessageClose.className="nrp-close nrp-right";
		nrpErrorMessageClose.innerHTML="OK";
		nrpErrorMessageClose.onclick=function(event){nrpClosePopup(event,'nrpErrorMessage')};
		nrpErrorMessage.appendChild(nrpErrorMessageClose);
		nrpErrorMessage.style.display="block";
		if (nrpSocialLogin){
			var NewRegistrationContainer=document.getElementById('nrpRegistrationSocial');
		} else {
			var NewRegistrationContainer=document.getElementById('nrpRegistrationStep3');
		}
		NewRegistrationContainer.appendChild(nrpErrorMessage);
	}
}

function nrpVerifyInput(event,currentStep){
	if (event!=null) event.preventDefault();
	if (nrpRegistrationStep==3){
		//check username
		var UserNameVerifDiv=document.getElementById('reg_verif_div');
		var nrpInputVal=document.getElementById("NewRegistrationPopup").getElementsByClassName("bginput")[0].value;
		if (typeof UserNameVerifDiv != 'undefined' && UserNameVerifDiv!=null){
			if (UserNameVerifDiv.className=="greenbox") nrpUsernameCheck=true;
			else if (UserNameVerifDiv.className=="redbox") nrpUsernameCheck=false;
			else if (nrpInputVal!="") nrpUsernameCheck=true;
			else nrpUsernameCheck=false;
		} else {
			if (nrpInputVal!="" && nrpInputVal!="User Name") nrpUsernameCheck=true;
			else nrpUsernameCheck=false;
		}
		if (!runNameVerif) nrpUsernameCheck=true;

		// check birthday
		var birthdayDiv = document.getElementById("birthday_option");

		// site has disabled birthday / COPPA check
		if (birthdayDiv === null) {
			nrpBirthdayCheck = true;
			nrpParentEmailCheck = true;
		}
		// site has enabled birthday / COPPA check
		else {
			var age = getAge();
			if (age === false) {
				nrpBirthdayCheck = false;
			} else {
				nrpBirthdayCheck = true;
			}
		}
		
		if (!nrpPasswdCheck || !nrpUsernameCheck || !nrpEmailCheck || !nrpBirthdayCheck || !nrpParentEmailCheck){
			nrpErrors=1;
			var errorMsg="";
			if (!nrpUsernameCheck) errorMsg+="Please enter a Username<br>";
			if (!nrpPasswdCheck) errorMsg+="Please correct your password<br>";
			if (!nrpEmailCheck) errorMsg+="Please correct your email address<br>";
			if (!nrpBirthdayCheck) errorMsg+="Please select your birthday<br>";
			if (!nrpParentEmailCheck && nrpBirthdayCheck) errorMsg+="Please add a valid Parent Email<br>";
			nrpShowError(errorMsg);
			return false;
		} else {
			return true;//nrpGoToStep(event,'3', null);
		}
	}

	/*if (typeof verify_passwords === "function") { 
	 if (verify_passwords(password)) nrpGoToStep(event,'3', null);
	 } */

	return false;
}

function nrpValidateOnSubmit(event){
	event.preventDefault();	
	if (!nrpSocialLogin){
		if (nrpRegistrationStep==2) {
			nrpVerifyInput(null);
			return false;
		} else {
			var verifyBeforeSubmit=nrpVerifyInput(null);
			if (verifyBeforeSubmit){
				var nrpAgreed=document.getElementById('cb_rules_agree');
				if (typeof nrpAgreed != 'undefined' && nrpAgreed!=null){
					if (nrpAgreed.checked){
						//Save all form data in cookies
						var nrpFormData = [];
						var nrpForm = event.target;
						for ( var i = 0; i < nrpForm.elements.length; i++ ) {
							var e = nrpForm.elements[i];
							if (typeof e.name !== "undefined")
								if (e.name.indexOf('password')<0 && (e.type=="text" || e.type=="email")) nrpFormData.push(encodeURIComponent(e.name) + "=" + encodeURIComponent(e.value));
						}
						var queryString = nrpFormData.join("&");
						createCookie('tempSaveFormData',queryString,0.1);
						//do form submit
						event.target.submit();
						return true;
					} else {
						nrpShowError('Please agree with Forum Rules to be able to proceed with registration');
						return false;
					}
				} else return true;
			}
		}
	} else {
		//Check if agreed to forum rules
		var nrpAgreed=document.getElementById('cb_rules_agree');
		if (typeof nrpAgreed != 'undefined' && nrpAgreed!=null){
			if (nrpAgreed.checked){
				//do form submit
				event.target.submit();
				return true;
			} else {
				nrpShowError('Please agree with Forum Rules to be able to proceed with registration');
				return false;
			}
		} else return true;
	}
}

function nprDisplayRegStep(stepNumber){
	document.getElementById("NewRegistrationPopup").style.display="block";
	document.getElementsByTagName("BODY")[0].style.overflowY="hidden";
	if (stepNumber>1) document.getElementById("nrpStepBack").style.display="inline-block";
	else document.getElementById("nrpStepBack").style.display="none";
	var nrpStepContent=document.getElementById("nrpRegistrationStep"+stepNumber.toString());
	if (typeof nrpStepContent != 'undefined' && nrpStepContent!=null){
		//hide opened steps first
		var allSteps=document.getElementsByClassName("nrp-content");
		for (var i=0; i<allSteps.length; i++){
			allSteps[i].style.display="none";
		}
		nrpStepContent.style.display="block";
	}
	setPopupVertically();
}
function nrpCloseAll(event){
	event.preventDefault();
	nrpRemoveHash();
	document.getElementById("NewRegistrationPopup").style.display="none";
	document.getElementsByTagName("BODY")[0].style.overflowY="inherit";
	if (TopifyMobileUrl && TopifyMobileUrl.length>0) {
		if (typeof forumHome != 'undefined' && forumHome !=null) var hostURL=forumHome;
		else var hostURL=window.location.hostname;
		var redirectStr="/#/"+decodeURIComponent(TopifyMobileUrl);
		redirectStr=hostURL+redirectStr.replace(/\/\/+/g,"/");
		window.location.replace(redirectStr);
	}
	else return false;
}
function nrpRemoveHash () {
	var scrollV, scrollH, loc = window.location;
	if ("pushState" in history)
		history.pushState("", document.title, loc.origin + loc.pathname + loc.search);
	else {
		// Prevent scrolling by storing the page's current scroll offset
		scrollV = document.body.scrollTop;
		scrollH = document.body.scrollLeft;

		loc.hash = "";

		// Restore the scroll offset, should be flicker free
		document.body.scrollTop = scrollV;
		document.body.scrollLeft = scrollH;
	}
}
