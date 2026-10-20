// ==UserScript==
// @name         GanjaMoney
// @namespace    https://github.com/Ekipogh/ganjascripts
// @version      1.8.1
// @description  Character dashboard with live HP/AP bars and profit tracking
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

        // Find parent tr element to append the reset link
        const $parent = $(span).closest('tr');
        const resetLink = `<td><a href="#" style="color: red; font-size: 8px" onclick="localStorage.removeItem('${storageKey}')">${diff}</a></td>`;
        $parent.append(` ${resetLink}`);
    });
}

function characterPanel() {
    const hp = document.getElementById('mehp');
    const ap = document.getElementById('meap');
    const firstRow = hp?.closest('.mestate');
    const secondRow = document.getElementById('cdiv')?.closest('.mestate');
    if (!firstRow || !secondRow || !ap || firstRow.parentElement !== secondRow.parentElement) return;
    if (firstRow.parentElement.classList.contains('gm-character')) return;

    if (!document.getElementById('gm-character-style')) {
        const style = document.createElement('style');
        style.id = 'gm-character-style';
        style.textContent = `
            .gm-character { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:5px; margin-top:5px; }
            .gm-character > .mestate { display:contents; }
            .gm-character #menav { display:none; }
            .gm-character .mestate > a {
                box-sizing:border-box; display:block; margin:0; padding:7px 9px;
                min-width:0; white-space:normal; overflow-wrap:anywhere; text-align:left;
            }
            .gm-character .gm-meter {
                background:linear-gradient(to right,var(--gm-fill) var(--gm-value),transparent var(--gm-value)),#d0f3d0;
                box-shadow:inset 0 0 0 1px #b5dcb5;
            }
            .gm-character #mehp { --gm-fill:#a7dba7; }
            .gm-character #meap { --gm-fill:#b0d8cf; }
            .gm-character .gm-meter.meoff { opacity:1; }
            .gm-character .gm-profit { grid-column:1 / -1; font-weight:normal; }
            .gm-character .gm-profit[data-sign="negative"] { color:#a32020; }
            .gm-character .gm-profit[data-sign="positive"] { color:#176b2c; }
        `;
        document.head.append(style);
    }

    const panel = document.createElement('div');
    panel.className = 'gm-character';
    firstRow.before(panel);
    panel.append(firstRow, secondRow);

    [hp, ap].forEach((link) => {
        const counter = link.querySelector(link === hp ? '#hpdiv' : '#apdiv');
        const maximum = link.textContent.match(/\/\s*([\d,]+)\s*(?:HP|AP)/i);
        if (!counter || !maximum) return;
        const max = readNumber(maximum[1]);
        if (!(max > 0)) return;
        link.classList.add('gm-meter');
        const update = () => {
            const current = readNumber(counter.textContent);
            if (!Number.isFinite(current)) return;
            link.style.setProperty('--gm-value', `${Math.max(0, Math.min(100, current / max * 100))}%`);
        };
        update();
        // Keep the original counters and timers intact so the game's updates still work.
        new MutationObserver(update).observe(counter, { childList: true, characterData: true, subtree: true });
    });
}

$(document).ready(function () {
    // Money tracking with more efficient logic
    skills();
    characterPanel();
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
    const incomeString = `${income > 0 ? '+' : ''}${income.toLocaleString('en-US')} $`;

    const totalDiff = moneyNow - money;

    const profitAmount = `${totalDiff > 0 ? '+' : ''}${totalDiff.toLocaleString('en-US')} $`;
    const profitLink = document.createElement('a');
    profitLink.href = '#';
    profitLink.className = 'greengreenbg_block whitehover nul gm-profit';
    profitLink.dataset.sign = totalDiff < 0 ? 'negative' : totalDiff > 0 ? 'positive' : 'zero';
    profitLink.innerHTML = `Прибыль: ${profitAmount} (${incomeString})`;
    profitLink.title = `Предыдущий заработок = ${incomeString}. Нажмите, чтобы сбросить отсчёт прибыли.`;
    profitLink.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.removeItem('money');
    });
    $balance.closest("a").after(profitLink);

    localStorage.setItem("moneyLast", moneyNow);
});
