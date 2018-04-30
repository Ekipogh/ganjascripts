// ==UserScript==
// @name         'Chivs
// @namespace    http://ekipogh.ru
// @version      0.1
// @description  displays selected achievs
// @author       You
// @match        http://www.ganjawars.ru/me.php
// @grant        none
// ==/UserScript==
function getPage(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function getChiv(pageText) {
    var chivDesc = localStorage.getItem('chiv');
    if (chivDesc === null || chivDesc === "")
        chivDesc = "Убить 200 Z-lands.";
    var indexOfChiv = pageText.indexOf(chivDesc);
    var tdText = "";
    //FOUND
    if(indexOfChiv >= 0){
        var indexOfOpenedTd = pageText.lastIndexOf("<td", indexOfChiv);
        var indexOfClosedTd = pageText.indexOf("<\/td>",indexOfChiv);
        tdText = pageText.substring(indexOfOpenedTd,indexOfClosedTd + 5);
    }
    //var re = new RegExp("(<td bgcolor=#ffffff>.+?" + chivDesc + ".+?<\/td>)");
    //var td = pageText.match(re)[0];
    var tableBottom = document.getElementsByTagName("table")[7];
    var rows = tableBottom.rows.length;
    var row = tableBottom.insertRow(rows);
    var cell = row.insertCell(0);
    cell.innerHTML = "<center><a onclick = \"localStorage.setItem('chiv',window.prompt('Описание достижения'));\">" + tdText + "</a></center>";
}

getPage('http://www.ganjawars.ru/info.ach.php?id=681768', getChiv);