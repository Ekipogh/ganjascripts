// ==UserScript==
// @name         Ferma profit
// @namespace    https://github.com/Ekipogh/ganjascripts
// @version      0.5
// @description  Displays profit on ferma!
// @author       Ekipogh
// @match        https://www.gwars.io/ferma.php*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const storageKey = 'ferma_money_stored';

    function start() {
        const panel = document.getElementById('main_ferma_window');
        if (!panel) return;

        const observer = new MutationObserver(updateProfit);
        const observe = () => observer.observe(panel, { childList: true, subtree: true, characterData: true });

        function updateProfit() {
            // The farm account is the bold amount following <a name=pf>.
            const label = panel.querySelector('a[name="pf"]');
            const balance = label && label.nextElementSibling;
            if (!balance || balance.tagName !== 'B') return;
            const amount = balance.textContent.trim().replace(/^\$\s*/, '').replace(/[,\s]/g, '');
            if (!/^\d+(?:\.\d+)?$/.test(amount)) return;
            const money = Number(amount);
            if (!Number.isFinite(money)) return;

            const stored = localStorage.getItem(storageKey);
            let baseline = stored === null || stored.trim() === '' ? NaN : Number(stored);
            if (!Number.isFinite(baseline)) {
                baseline = money;
                localStorage.setItem(storageKey, money);
            }
            const profit = money - baseline;

            // Avoid observing our own display changes, and preserve the account controls.
            observer.disconnect();
            let link = panel.querySelector('#ferma-profit');
            if (!link) {
                link = document.createElement('a');
                link.id = 'ferma-profit';
                link.href = '#';
                link.title = 'Click to reset the profit baseline';
                link.style.cssText = 'display:inline-block;font-size:12px;margin-left:8px;cursor:pointer;';
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    localStorage.removeItem(storageKey);
                    updateProfit();
                });
                balance.parentElement.appendChild(link);
            }
            link.textContent = `Profit: ${profit > 0 ? '+' : ''}${profit.toLocaleString('en-US')} $`;
            link.style.color = profit < 0 ? '#a32020' : profit > 0 ? '#176b2c' : '#465546';
            observe();
        }

        updateProfit();
        observe();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }
})();
