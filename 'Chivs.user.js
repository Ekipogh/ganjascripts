// ==UserScript==
// @name         'Chivs
// @namespace    https://github.com/Ekipogh/ganjascripts
// @version      0.3
// @description  Displays achivements on character's page
// @author       Ekipogh
// @match        https://www.gwars.io/me.php*
// @grant        none
// ==/UserScript==
function getPage(theUrl, callback) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function getChiv(pageText) {
    let chivDesc = localStorage.getItem('chiv');
    if (chivDesc === null || chivDesc === "")
        chivDesc = "Убить 200 Z-lands.";
    let indexOfChiv = pageText.indexOf(chivDesc);
    let tdText = "";
    //FOUND
    if (indexOfChiv >= 0) {
        let indexOfOpenedTd = pageText.lastIndexOf("<td", indexOfChiv);
        let indexOfClosedTd = pageText.indexOf("<\/td>", indexOfChiv);
        tdText = pageText.substring(indexOfOpenedTd, indexOfClosedTd + 5);
    }
    //let re = new RegExp("(<td bgcolor=#ffffff>.+?" + chivDesc + ".+?<\/td>)");
    //let td = pageText.match(re)[0];
    let tableBottom = document.getElementsByTagName("table")[7];
    let rows = tableBottom.rows.length;
    let row = tableBottom.insertRow(rows);
    let cell = row.insertCell(0);
    cell.innerHTML = `<center><a onclick = "localStorage.setItem('chiv',window.prompt('Описание достижения'));">${tdText}</a></center>`;
}

getPage('https://www.gwars.ru/info.ach.php?id=681768', getChiv);