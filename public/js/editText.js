$(function() {
    showEdits();
    $('#editBtn').change(toggleEditMode);
});

function toggleEditMode() {
  var editableElems = $(".editable");
  if ($(this).is(":checked")) {
    editableElems.attr("contenteditable", "true").attr("oninput", "saveEdits(this)");
    toastr.warning("Edit mode enabled!");
    console.log("Edit Mode enabled!");
  }
  else {
    editableElems.removeAttr("contenteditable", "true").removeAttr("oninput", "saveEdits(this)");
    toastr.warning("Edit mode disabled.");
    console.log("Edit Mode disabled!");
  }
}

function saveEdits(element) {
  var contents = element.innerHTML.replace(/&nbsp;/gi,'').replace(/&amp;/gi,'&');

  var newObj = {};
  var edits = readCookie("text_replace");

  // cookie already exists, convert it to a javascript object so we can add to it
  if (edits) {
    var editObj = replacePlus(edits);
    editObj = decodeURIComponent(editObj);
    editObj = decodeURLRecursively(editObj);
    editObj = JSON.parse(editObj);

    currentEdits = editObj.domain;
    currentEdits[element.id] = contents;
    newObj.domain = currentEdits;
  } else { // cookie doesn't exist, create new edit object
    var newEdits = {};
    newEdits[element.id] = contents;
    newObj.domain = newEdits;
  }
  createCookie("text_replace", encodeURIComponent(JSON.stringify(newObj)), 14); // text edits last 2 weeks
}

function showEdits() {
  var editsCookie = readCookie("text_replace");
  if (editsCookie) {
    // collect editable html elements
    var domain = window.location.hostname;
    var editables = $(".editable");
    editables = [].slice.call(editables); //create a real array of editable DOM elements

    var editObj = parseCookieIntoObject(editsCookie);
    var edits = editObj.domain;
    editables.forEach(function(element,index) {
      if (edits[element.id] != null ) {
        element.innerHTML = edits[element.id];
      }
    });
  }
}


/****** Quirksmode's Create, Read, and Erase cookie functions *******/
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

function deleteEdits() {
    document.cookie =  'text_replace=;Path=/;Expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    location.reload();
}

function replacePlus(str) {
  return str.replace(/\+/g, " ");
}

function decodeURLRecursively(url) {
  if(ValidURL(url)) {
    return decodeURLRecursively(decodeURIComponent(url));
  }
  return url;
}

function ValidURL(str) {
  var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!regex .test(str)) {
    return false;
  } else {
    return true;
  }
}

function parseCookieIntoObject(cookie) {
  var obj = replacePlus(cookie);
  obj = decodeURIComponent(obj);
  obj = decodeURLRecursively(obj);
  obj = JSON.parse(obj);
  return obj;
}
