// ==UserScript==
// @name         GanjaMoney
// @namespace    https://github.com/Ekipogh/ganjascripts
// @version      1.1
// @description  displays profit
// @author       Ekipogh
// @match        http://www.gwars.ru/me.php
// @grant        none
// ==/UserScript==


(function() {
    var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
    if(root.document.location.href.indexOf("www.gwars.ru/me")>=0){
        var cdiv = root.document.getElementById("cdiv");
        var moneyStr = cdiv.innerHTML;
        var money = moneyStr.replace(/\,/g,"");
        var moneyStore = localStorage.getItem("money");

        var lastMoney = localStorage.getItem("moneyLast");
        var income = 0;
        if(lastMoney!=money){
            income = money - lastMoney;
            localStorage.setItem('lastIncome',income);
            localStorage.setItem('moneyLast',money);
        }
        else{
            income = localStorage.getItem('lastIncome');
            if(isNaN(income))
            {
                localStorage.setItem('lastIncome',0);
                income = 0;
            }
        }
        if(moneyStore !== null){
            var diff = money - moneyStore;
            var center = root.document.getElementsByTagName("center")[2];
            center.innerHTML+="<a title = \"Предыдущий заработок = "+income+" $\" onclick = \"localStorage.removeItem('money'); localStorage.setItem('moneyTime', new Date())\" style=\"color: red; font-size: 8px; position: absolute; margin: 2px 0 0 0;\">&nbsp;&nbsp;&nbsp;"+diff+" $ </a>";
        }
        else{
            localStorage.setItem("money",money);
        }
    }
})();