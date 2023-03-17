// ==UserScript==
// @name         ganjaterminal
// @namespace    https://github.com/Ekipogh/ganjascripts
// @version      0.3
// @description  quick buy in terminal
// @author       Ekipogh
// @match        https://www.gwars.io/objects-terminal.php*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require https://unpkg.com/axios/dist/axios.min.js
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

// creating a form
let tables = $("table");
let table = tables[tables.length - 1];
let form = document.createElement("form");
let select = $("#resoursesselect").clone();
select.attr("id", "qb_resource");
let input = document.createElement("input");
$(input).attr("id", "qb_amount");
$(input).attr("value", "1");
let button = document.createElement("button");
$(button).append("Quick buy");
$(button).attr("type", "submit");
select.appendTo(form);
form.append(input);
form.append(button);
$(form).insertAfter(table);
$(form).attr("action", "#");
$(form).attr("id", "quick_buy");
$("#quick_buy").submit(function () {
    let $form = $(this);

    // get the full price
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    if (id == null) {
        console.log("Can't get the terminal ID!");
        return false;
    }
    let trade_url = "trade-terminal.php?object_id=" + id;
    let object_url = "objects-terminal.php?id=" + id;
    //data from form
    let resource_id = $("#qb_resource").val();
    let amount = $("#qb_amount").val();
    axios.post(trade_url + "&resource=" + resource_id).then(function (response) {
        let price = 0;
        let doit = 0;
        let data = response.data;
        const regex_price = /<b>\$(\d+)<\/b>/gm;
        const regex_doit = /id='but(\d+)'/gm;
        let ep = regex_price.exec(data);
        let ed = regex_doit.exec(data);
        if (ep != null && ed != null) {
            price = ep[1];
            doit = ed[1];
            let sum = price * amount;
            console.log(sum);
            //add money to terminal
            axios.post(object_url + "&money=1&money_in=" + sum);
            //buy resourses
            let buy_url = trade_url + "&optype=1&amount=" + amount + "&resource=" + resource_id + "&doit=" + doit;
            console.log(buy_url);
            axios.post(buy_url).then(function () {
                console.log("Bought " + resource_id + " for " + sum + " bucks");
                document.location.reload();
            });
        }
    });
    return false;
});
