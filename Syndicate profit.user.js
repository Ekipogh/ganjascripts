// ==UserScript==
// @name         Syndicate profit
// @namespace    https://github.com/Ekipogh/ganjascripts
// @version      0.2.1
// @description  Displays profit for syndicates!
// @author       Ekipogh
// @match        http://www.ganjawars.ru/object.php*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function httpGet(theUrl)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
        xmlHttp.send( null );
        return xmlHttp.responseText;
    }

    //Display interface
    function create_interface(){
        var table = document.createElement("table");
        table.setAttribute("align", "center");
        table.id = "synd_profit";
        //Table top row
        var row = table.insertRow(0);
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);

        var button = document.createElement("button");
        var button_text = document.createTextNode("Доход синдикатов");
        var date_picker_start = document.createElement("input");
        var date_picker_end = document.createElement("input");
        var label_from = document.createElement("label");
        var label_to = document.createElement("label");
        label_from.innerText = "C: ";
        label_to.innerText = "По: ";

        date_picker_start.type = "date";
        date_picker_start.id = "date_picker_start";
        date_picker_end.type = "date";
        date_picker_end.id = "date_picker_end";

        var today = new Date();
        date_picker_start.valueAsDate = today;

        today.setDate(today.getDate() - 1);
        date_picker_end.valueAsDate = today;

        button.appendChild(button_text);

        var rowHeader = table.insertRow(1);
        rowHeader.style.backgroundColor = "#d0eed0";
        rowHeader.insertCell(0).innerHTML = "Синдикат";
        rowHeader.insertCell(1).innerHTML = "PTS";
        rowHeader.insertCell(2).innerHTML = "Деньги";

        //Button funtionality

        button.onclick = function(){
            var running = true;
            var page_id = 0;
            var result = {};

            var url = document.location.href;
            var object_id = url.substring(url.indexOf("=") + 1);
            //format date to string
            var date_start = date_picker_start.valueAsDate;
            var date_end = date_picker_end.valueAsDate;
            var date_string_start = date_start.getDate() + "." + ("00" + (date_start.getMonth() + 1)).slice(-2) + "." + (date_start.getFullYear() - 2000);
            var date_string_end = date_end.getDate() + "." + ("00" + (date_end.getMonth() + 1)).slice(-2) + "." + (date_end.getFullYear() - 2000);
            // functions
            function process_page(object_id, page_id){
                var page_url = "http://www.ganjawars.ru/object-pts-log.php?id="+object_id +"&page_id="+page_id;
                var text = httpGet(page_url);
                let m;
                // see if date on page are in range and parse it
                var reg = /(\d\d\.\d\d\.\d\d).+Синдикату\s#(\d+).+\s(\d+(\.\d+)?)\sPTS.+\s(\d+)\sГб/gm;
                // test for an empty page
                var isempty_match = text.match(reg);
                if (isempty_match == null){
                    // empty page
                    running = false;
                    return;
                }
                while ((m = reg.exec(text)) !== null) {
                    if (m.index === reg.lastIndex) {
                        reg.lastIndex++;
                    }
                    var date = m[1];
                    var synd = m[2];
                    var pts = m[3];
                    var money = m[5];
                    // check date
                    if(date <= date_string_start && date > date_string_end){
                        // date is fine collecting results
                        if(result[synd] == undefined){
                            result[synd] = {};
                            result[synd].pts = 0.0;
                            result[synd].money = 0;
                        }
                        result[synd].pts += parseFloat(pts);
                        result[synd].money += parseInt(money);
                    }
                    // out of range
                    else if(date < date_string_end){
                        running = false;
                    }
                }
            }

            function clear_table(){
                var table = document.getElementById("synd_profit");
                var rows = table.rows.length;
                for(var i = rows - 1; i > 1; i--){
                    table.deleteRow(i);
                }
            }

            function display(){
                // clear table from previous results
                clear_table();
                var i = 2;
                var table = document.getElementById("synd_profit");
                for(var property in result){
                    var row = table.insertRow(i);
                    var cell0 = row.insertCell(0);
                    var cell1 = row.insertCell(1);
                    var cell2 = row.insertCell(2);
                    cell0.innerHTML = "<a href=\"http://www.ganjawars.ru/syndicate.php?id=" + property + "\">#" + property + "</a>";
                    cell1.innerHTML = result[property].pts;
                    cell2.innerHTML = result[property].money + "$";
                    i++;
                }
            }

            // start downloading pages and processing them
            while(running){
                process_page(object_id, page_id);
                page_id++;
            }
            // displaying result
            display();
        };

        cell2.appendChild(button);
        cell0.appendChild(label_from);
        cell0.appendChild(date_picker_start);
        cell1.appendChild(label_to);
        cell1.appendChild(date_picker_end);
        var footer = document.getElementsByClassName("clearfooter")[0];
        if(footer !== undefined){
            footer.parentNode.insertBefore(table, footer);
        }
        else
        {
            document.body.appendChild(table);
        }
    }

    // Main
    create_interface();
})();