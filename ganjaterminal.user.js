// ==UserScript==
// @name         ganjaterminal
// @namespace    https://github.com/Ekipogh/ganjascripts
// @version      0.1
// @description  quick buy in terminal
// @author       Ekipogh
// @match        http://www.ganjawars.ru/objects-terminal.php?id=*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';


function ganjaterminal(){
    var table = document.getElementsByTagName("table")[3];
    var rows = table.rows.length; 
    var row = table.insertRow(rows);
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var select = document.getElementsByTagName("select")[0];
    var newSelect = select.cloneNode(true);
    newSelect.setAttribute("name","resSel");
    cell0.innerHTML = "Быстрая покупка";
    cell1.appendChild(newSelect);
    cell2.setAttribute("colspan", 2);
    cell2.innerHTML = "<input type=\"text\" name=\"qamount\" value=\"1\">";
    cell3.innerHTML = "<input type=\"button\" name=\"quickbuy\" value=\"Купить\" onclick=\"buttonBuy()\">";

    var my_awesome_script = document.createElement('script');

    my_awesome_script.innerText = " \
var id; \
var resource; \
var amount; \
function getPage(theUrl, callback) \
{ \
var xmlHttp = new XMLHttpRequest(); \
xmlHttp.onreadystatechange = function() {  \
if (xmlHttp.readyState == 4 && xmlHttp.status == 200) \
callback(xmlHttp.responseText); \
}; \
xmlHttp.open(\"GET\", theUrl, true); \
xmlHttp.send(null); \
} \
function buy(pageText){ \
var reprice = /<b>\\$(\\d+)<\\/b>/;  \
var price = reprice.exec(pageText); \
if(price!=null){ \
price = price[1]; \
var redoit = /name=doit value=(\\d+)>/; \
var doit = redoit.exec(pageText)[1]; \
console.log(\"Цена за еденицу \" + price); \
var fullPrice = parseInt(amount) * parseFloat(price); \
console.log(\"Полная цена \" + fullPrice); \
getPage(\"http://www.ganjawars.ru/objects-terminal.php?id=\"+id+\"&money=1&money_in=\"+(amount*price)+\"&money_out=0\",function(){}); \
getPage(\"http://www.ganjawars.ru/trade-terminal.php?doit=\"+doit+\"&resource=\"+resource+\"&optype=1&object_id=\"+id+\"&amount=\"+amount,function(){}) \
} \
} \
function buttonBuy(){ \
var select = document.getElementsByName(\"resSel\")[0]; \
resource = select.options[select.selectedIndex].value; \
amount = document.getElementsByName(\"qamount\")[0].value; \
id = document.location.href.substr(document.location.href.indexOf(\"=\")+1); \
getPage(\"http://www.ganjawars.ru/trade-terminal.php?object_id=\" + id + \"&resource=\" + resource + \"&optype=1\",buy); \
document.location.reload(); \
}";

    document.head.appendChild(my_awesome_script);
}



ganjaterminal();