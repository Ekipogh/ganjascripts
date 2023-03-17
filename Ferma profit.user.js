// ==UserScript==
// @name         Ferma profit
// @namespace    https://github.com/Ekipogh/ganjascripts
// @version      0.4
// @description  Displays profit on ferma!
// @author       Ekipogh
// @match        https://www.gwars.io/ferma.php*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// ==/UserScript==

$(document).ready(function () {
    let money_saved = localStorage.ferma_money_stored;
    let divs = document.getElementsByTagName("div");
    for (let i = 0; i < divs.length; i++) {
        let div = divs[i];
        if (div !== undefined && div.childNodes.length > 2) {
            if (div.childNodes[0].innerText !== undefined) {
                if (div.childNodes[0].innerHTML.indexOf("Счет:") >= 0 && div.getAttribute("align") === "right") {
                    let text = div.childNodes[2].innerText;
                    let money = Number(text.replace(/[^0-9.-]+/g, ""));
                    console.log(text + " " + money);
                    let profit = 0;
                    if (money_saved === undefined) {
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