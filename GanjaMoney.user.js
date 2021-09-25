// ==UserScript==
// @name         GanjaMoney
// @namespace    https://github.com/Ekipogh/ganjascripts
// @version      1.5
// @description  displays profit
// @author       Ekipogh
// @match        https://www.gwars.ru/me.php
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// ==/UserScript==

function skills() {
    // current levels
    var spans = $("#paramsdiv").find("span").not(".font8pt");
    var levelNow = spans[0].textContent;
    var ecoNow = spans[1].textContent;
    var prodNow = spans[2].textContent;
    var pistolsNow = spans[3].textContent;
    var grenadesNow = spans[4].textContent;
    var autoNow = spans[5].textContent;
    var machineNow = spans[6].textContent;
    var shotNow = spans[7].textContent;
    var sniperNow = spans[8].textContent;
    // populate localStorage
    if (localStorage["level"] == null) {
        localStorage["level"] = levelNow;
    }
    if (localStorage["eco"] == null) {
        localStorage["eco"] = ecoNow;
    }
    if (localStorage["prod"] == null) {
        localStorage["prod"] = prodNow;
    }
    if (localStorage["pistol"] == null) {
        localStorage["pistol"] = pistolsNow;
    }
    if (localStorage["grenades"] == null) {
        localStorage["grenades"] = grenadesNow;
    }
    if (localStorage["auto"] == null) {
        localStorage["auto"] = autoNow;
    }
    if (localStorage["machine"] == null) {
        localStorage["machine"] = machineNow;
    }
    if (localStorage["shotgun"] == null) {
        localStorage["shotgun"] = shotNow;
    }
    if (localStorage["sniper"] == null) {
        localStorage["sniper"] = sniperNow;
    }
    var level = localStorage["level"];
    var eco = localStorage["eco"];
    var prod = localStorage["prod"];
    var pistol = localStorage["pistol"];
    var grenades = localStorage["grenades"];
    var auto = localStorage["auto"];
    var machine = localStorage["machine"];
    var shotgun = localStorage["shotgun"];
    var sniper = localStorage["sniper"];
    var levelDiff = levelNow - level;
    var ecoDiff = ecoNow - eco;
    var prodDiff = prodNow - prod;
    var pistolDiff = pistolsNow - pistol;
    var grenadesDiff = grenadesNow - grenades;
    var autoDiff = autoNow - auto;
    var machineDiff = machineNow - machine;
    var shotgunDiff = shotNow - shotgun;
    var sniperDiff = sniperNow - sniper;
    levelDiff = Math.round(levelDiff * 100) / 100;
    ecoDiff = Math.round(ecoDiff * 100) / 100;
    prodDiff = Math.round(prodDiff * 100) / 100;
    pistolDiff = Math.round(pistolDiff * 100) / 100;
    grenadesDiff = Math.round(grenadesDiff * 100) / 100;
    autoDiff = Math.round(autoDiff * 100) / 100;
    machineDiff = Math.round(machineDiff * 100) / 100;
    shotgunDiff = Math.round(shotgunDiff * 100) / 100;
    sniperDiff = Math.round(sniperDiff * 100) / 100;
    $(spans[0]).parent().html($(spans[0]).parent().html() + " <a href=\"#\" style=\"color: red; font-size: 8px\" onclick = \"localStorage.removeItem('level')\">" + levelDiff + "</a>");
    $(spans[1]).parent().html($(spans[1]).parent().html() + " <a href=\"#\" style=\"color: red; font-size: 8px\" onclick = \"localStorage.removeItem('eco')\">" + ecoDiff + "</a>");
    $(spans[2]).parent().html($(spans[2]).parent().html() + " <a href=\"#\" style=\"color: red; font-size: 8px\" onclick = \"localStorage.removeItem('prod')\">" + prodDiff + "</a>");
    $(spans[3]).parent().html($(spans[3]).parent().html() + " <a href=\"#\" style=\"color: red; font-size: 8px\" onclick = \"localStorage.removeItem('pistol')\">" + pistolDiff + "</a>");
    $(spans[4]).parent().html($(spans[4]).parent().html() + " <a href=\"#\" style=\"color: red; font-size: 8px\" onclick = \"localStorage.removeItem('grenades')\">" + grenadesDiff + "</a>");
    $(spans[5]).parent().html($(spans[5]).parent().html() + " <a href=\"#\" style=\"color: red; font-size: 8px\" onclick = \"localStorage.removeItem('auto')\">" + autoDiff + "</a>");
    $(spans[6]).parent().html($(spans[6]).parent().html() + " <a href=\"#\" style=\"color: red; font-size: 8px\" onclick = \"localStorage.removeItem('machine')\">" + machineDiff + "</a>");
    $(spans[7]).parent().html($(spans[7]).parent().html() + " <a href=\"#\" style=\"color: red; font-size: 8px\" onclick = \"localStorage.removeItem('shotgun')\">" + shotgunDiff + "</a>");
    $(spans[8]).parent().html($(spans[8]).parent().html() + " <a href=\"#\" style=\"color: red; font-size: 8px\" onclick = \"localStorage.removeItem('sniper')\">" + sniperDiff + "</a>");
}

$(document).ready(function () {
    var moneyNow = $("#cdiv").text().replace(/\,/g, "");
    if (localStorage["money"] == null) {
        localStorage.setItem("money", moneyNow);
    }
    var money = localStorage["money"];
    var moneyLast = localStorage["moneyLast"];
    var incomeStored = localStorage.income;
    var income = 0;
    var diff = 0;
    if (moneyLast != moneyNow) {
        income = moneyNow - moneyLast;
        localStorage.income = income;
    }
    else {
        income = incomeStored;
        if (income == undefined) {
            income = 0;
        }
    }
    diff = moneyNow - money;
    var center = $("center")[2];
    $(center).html($(center).html() + "<a title = \"Предыдущий заработок = " + income + " $\" onclick = \"localStorage.removeItem('money')\" style=\"color: red; font-size: 8px\">&nbsp;&nbsp;&nbsp;" + diff + " $ </a>");
    localStorage.setItem("moneyLast", moneyNow);
    skills();
});
