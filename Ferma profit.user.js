// ==UserScript==
// @name         Ferma profit
// @namespace    https://github.com/Ekipogh/ganjascripts
// @version      0.3
// @description  Displays profit on ferma!
// @author       Ekipogh
// @match        http://www.gwars.ru/ferma.php*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// ==/UserScript==

$(document).ready(function () {
    var money_saved = localStorage.ferma_money_stored;
    var divs = document.getElementsByTagName("div");
    for (var i = 0; i < divs.length; i++) {
        var div = divs[i];
        if (div != undefined && div.childNodes.length > 2) {
            if (div.childNodes[0].innerText != undefined) {
                if (div.childNodes[0].innerHTML.indexOf("Счет:") >= 0 && div.getAttribute("align") == "right") {
                    var text = div.childNodes[2].innerText;
                    var money = Number(text.replace(/[^0-9\.-]+/g, ""));
                    console.log(text + " " + money);
                    var profit = 0;
                    if (money_saved == undefined) {
                        localStorage.ferma_money_stored = money;
                    }
                    else {
                        profit = money - money_saved;
                    }
                    div.innerHTML += "<br/><br/><a onclick=\"localStorage.removeItem('ferma_money_stored')\" style=\"color: red; font-size: 8px; margin: 2px 0 0 0;\">" + profit + " $ </a>";
                }
            }
        }
    }
});