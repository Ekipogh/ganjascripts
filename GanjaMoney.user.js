// ==UserScript==
// @name         GanjaMoney
// @namespace    https://github.com/Ekipogh/ganjascripts
// @version      1.7.1
// @description  displays profit
// @author       Ekipogh
// @match        https://www.gwars.io/me.php
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// ==/UserScript==

function readNumber(value) {
    if (value == null || String(value).trim() === '') return NaN;
    return Number(String(value).replace(/[,\s]/g, ''));
}

function baseline(storageKey, currentValue) {
    const storedValue = readNumber(localStorage.getItem(storageKey));
    if (Number.isFinite(storedValue)) return storedValue;
    localStorage.setItem(storageKey, currentValue);
    return currentValue;
}

function skills() {
    // Define skill configuration
    const skillConfig = [
        { chart: 'rid=0', storageKey: 'level' },
        { chart: 'rid=1', storageKey: 'eco' },
        { chart: 'rid=2', storageKey: 'prod' },
        { chart: 'rid=21', storageKey: 'qlevel' },
        { chart: 'cid=3616832250', storageKey: 'pistol' },
        { chart: 'cid=1070787262', storageKey: 'grenades' },
        { chart: 'cid=1710008866', storageKey: 'auto' },
        { chart: 'cid=2601856255', storageKey: 'machine' },
        { chart: 'cid=1561324422', storageKey: 'shotgun' },
        { chart: 'cid=2823568380', storageKey: 'sniper' }
    ];

    const spans = Array.from(document.querySelectorAll('#paramsdiv span[onclick]'));

    // Process all skills in a loop
    skillConfig.forEach((skill) => {
        const span = spans.find((element) =>
            new RegExp(`[?&]${skill.chart}(?=[&"'])`).test(element.getAttribute('onclick')));
        if (!span) return;
        const currentValue = readNumber(span.textContent);
        if (!Number.isFinite(currentValue)) return;
        const storageKey = skill.storageKey;

        // Calculate difference and round to 2 decimal places
        const storedValue = baseline(storageKey, currentValue);
        const diff = Math.round((currentValue - storedValue) * 100) / 100;

        // Create and append the difference link
        const $parent = $(span).parent();
        const resetLink = `<a href="#" style="color: red; font-size: 8px" onclick="localStorage.removeItem('${storageKey}')">${diff}</a>`;
        $parent.append(` ${resetLink}`);
    });
}

$(document).ready(function () {
    // Money tracking with more efficient logic
    skills();
    const $balance = $("#cdiv");
    const moneyNow = readNumber($balance.text());
    if (!Number.isFinite(moneyNow)) return;
    const money = baseline("money", moneyNow);
    const moneyLast = baseline("moneyLast", moneyNow);

    // Calculate income and total difference
    let income = readNumber(localStorage.getItem("income"));
    if (!Number.isFinite(income)) income = 0;
    if (moneyLast !== moneyNow) {
        income = moneyNow - moneyLast;
        localStorage.setItem("income", income);
    }

    const totalDiff = moneyNow - money;

    // Keep the profit badge prominent beside the balance.
    const profitColor = totalDiff < 0 ? '#a32020' : totalDiff > 0 ? '#176b2c' : '#465546';
    const profitBackground = totalDiff < 0 ? '#ffe5e5' : totalDiff > 0 ? '#d5f5dc' : '#edf3ed';
    const profitAmount = `${totalDiff > 0 ? '+' : ''}${totalDiff.toLocaleString('en-US')} $`;
    const profitLink = `<a href="#" title="Предыдущий заработок = ${income.toLocaleString('en-US')} $. Нажмите, чтобы сбросить отсчёт прибыли." onclick="localStorage.removeItem('money'); return false;" style="display:inline-block; vertical-align:middle; margin:3px 0 3px 8px; padding:5px 9px; border:1px solid ${profitColor}; border-radius:4px; background:${profitBackground}; color:${profitColor}; font-size:12px; line-height:1.2; font-weight:bold; text-decoration:none; white-space:nowrap; cursor:pointer;">Прибыль: ${profitAmount}</a>`;
    $balance.closest("a").after(profitLink);

    localStorage.setItem("moneyLast", moneyNow);
});
