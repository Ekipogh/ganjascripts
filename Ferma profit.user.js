// ==UserScript==
// @name         Ferma profit
// @namespace    https://github.com/Ekipogh/ganjascripts
// @version      0.7
// @description  Displays profit and harvested production experience on ferma!
// @author       Ekipogh
// @match        https://www.gwars.io/ferma.php*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const storageKey = 'ferma_money_stored';
    const experienceKey = 'ferma_experience_gained';

    function start() {
        const panel = document.getElementById('main_ferma_window');
        if (!panel) return;

        const countedMessages = new WeakMap();
        const experiencePattern = /(?:\+\s*(\d+(?:[.,]\d+)?)\s*производственного\s+опыта|Получено\s+(\d+(?:[.,]\d+)?)\s+ед\.\s*опыта)/gi;

        function countExperience() {
            const stored = Number(localStorage.getItem(experienceKey));
            let total = Number.isFinite(stored) && stored >= 0 ? stored : 0;
            // Use the smallest containing element so nested markup (including bold
            // amounts) is read once. New AJAX response nodes are new harvests,
            // even when consecutive harvests award exactly the same amount.
            const messages = Array.from(panel.querySelectorAll('*')).filter((element) => {
                if (element.closest('#ferma-profit, #ferma-experience, script, style')) return false;
                const matches = (node) => {
                    experiencePattern.lastIndex = 0;
                    return experiencePattern.test(node.textContent);
                };
                return matches(element) && !Array.from(element.children).some(matches);
            });
            for (const message of messages) {
                const text = message.textContent;
                if (countedMessages.get(message) === text) continue;
                countedMessages.set(message, text);
                experiencePattern.lastIndex = 0;
                for (const match of text.matchAll(experiencePattern)) {
                    total += Number((match[1] || match[2]).replace(',', '.'));
                }
            }
            total = Math.round(total * 1e8) / 1e8;
            localStorage.setItem(experienceKey, String(total));
            return total;
        }

        const observer = new MutationObserver(updateProfit);
        const observe = () => observer.observe(panel, { childList: true, subtree: true, characterData: true });

        function updateProfit() {
            const experience = countExperience();
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
            let experienceLink = panel.querySelector('#ferma-experience');
            if (!experienceLink) {
                experienceLink = document.createElement('a');
                experienceLink.id = 'ferma-experience';
                experienceLink.href = '#';
                experienceLink.title = 'Click to reset harvested production experience';
                experienceLink.style.cssText = 'display:inline-block;font-size:12px;margin-left:8px;cursor:pointer;color:#176b2c;';
                experienceLink.addEventListener('click', (event) => {
                    event.preventDefault();
                    localStorage.setItem(experienceKey, '0');
                    updateProfit();
                });
                balance.parentElement.appendChild(experienceLink);
            }
            experienceLink.textContent = `Production XP: +${experience.toLocaleString('en-US', { maximumFractionDigits: 8 })}`;
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
