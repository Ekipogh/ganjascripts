// ==UserScript==
// @name         GanjaMoney
// @namespace    https://github.com/Ekipogh/ganjascripts
// @version      1.5
// @description  displays profit
// @author       Ekipogh
// @match        https://www.gwars.io/me.php
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// ==/UserScript==

function skills() {
    // Define skill configuration
    const skillConfig = [
        { key: 'level', storageKey: 'level' },
        { key: 'eco', storageKey: 'eco' },
        { key: 'prod', storageKey: 'prod' },
        { key: 'pistols', storageKey: 'pistol' },
        { key: 'grenades', storageKey: 'grenades' },
        { key: 'auto', storageKey: 'auto' },
        { key: 'machine', storageKey: 'machine' },
        { key: 'shot', storageKey: 'shotgun' },
        { key: 'sniper', storageKey: 'sniper' }
    ];
    
    const spans = $("#paramsdiv").find("span").not(".font8pt");
    
    // Process all skills in a loop
    skillConfig.forEach((skill, index) => {
        const currentValue = parseFloat(spans[index].textContent);
        const storageKey = skill.storageKey;
        
        // Initialize localStorage if null
        if (localStorage[storageKey] == null) {
            localStorage[storageKey] = currentValue;
        }
        
        // Calculate difference and round to 2 decimal places
        const storedValue = parseFloat(localStorage[storageKey]);
        const diff = Math.round((currentValue - storedValue) * 100) / 100;
        
        // Create and append the difference link
        const $parent = $(spans[index]).parent();
        const resetLink = `<a href="#" style="color: red; font-size: 8px" onclick="localStorage.removeItem('${storageKey}')">${diff}</a>`;
        $parent.append(` ${resetLink}`);
    });
}

$(document).ready(function () {
    // Money tracking with more efficient logic
    const moneyNow = parseFloat($("#cdiv").text().replace(/,/g, "")) || 0;
    const money = parseFloat(localStorage.getItem("money")) || moneyNow;
    const moneyLast = parseFloat(localStorage.getItem("moneyLast")) || moneyNow;
    
    // Initialize money baseline if not set
    if (!localStorage.getItem("money")) {
        localStorage.setItem("money", moneyNow);
    }
    
    // Calculate income and total difference
    let income = parseFloat(localStorage.getItem("income")) || 0;
    if (moneyLast !== moneyNow) {
        income = moneyNow - moneyLast;
        localStorage.setItem("income", income);
    }
    
    const totalDiff = moneyNow - money;
    
    // Update display using more efficient DOM manipulation
    const center = $("center")[2];
    const profitLink = `<a title="Предыдущий заработок = ${income} $" onclick="localStorage.removeItem('money')" style="color: red; font-size: 8px">&nbsp;&nbsp;&nbsp;${totalDiff} $ </a>`;
    $(center).append(profitLink);
    
    localStorage.setItem("moneyLast", moneyNow);
    skills();
});
