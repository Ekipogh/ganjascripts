// ==UserScript==
// @name         Syndicate profit
// @namespace    http://tampermonkey.net/
// @version      0.1
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
    function createInterface(){
        var table = document.createElement("table");
        table.setAttribute("align", "center");
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

        };

        cell2.appendChild(button);
        cell0.appendChild(label_from);
        cell0.appendChild(date_picker_start);
        cell1.appendChild(label_to);
        cell1.appendChild(date_picker_end);
        var footer = document.getElementsByClassName("clearfooter")[0];
        footer.parentNode.insertBefore(table, footer);
/*
    let text = "";
    var maximum_pages = 20;
    var current_page = 0;
    var running = true;

    function setText(text_to_set){
        text = text + text_to_set;
    }

    function proccessText(text){
        var date_start = document.getElementById("date_picker_start").valueAsDate;
        var date_end = document.getElementById("date_picker_end").valueAsDate;
        var date_string_start = date_start.getDate() + "." + ("00" + (date_start.getMonth() + 1)).slice(-2) + "." + (date_start.getFullYear() - 2000);
        var date_string_end = date_end.getDate() + "." + ("00" + (date_end.getMonth() + 1)).slice(-2) + "." + (date_end.getFullYear() - 2000);
        var regex_date = /\d\d\.\d\d\.\d\d/g;
        var m = text.match(regex_date);
        if(m != null){
            for (var i = 0; i < m.length;i++){
                if(m[i] <= date_string_start && m[i] > date_string_end){
                    setText(text);
                }
                else running = false;
            }
        }
        else
            running = false;
    }
    function getDataPage(page, func){
        console.log(current_page+" "+running);
        if(running){
            getPage(page, func);
        }
    }

    function colect_data(id){
        var timer_multiplier;
        while(running){
            setTimeout(getDataPage, 1000, "http://www.ganjawars.ru/object-pts-log.php?id="+object_id +"&page_id="+current_page++, proccessText);
        }
    }

    function createInterface(){
        var table = document.createElement("table");
        table.setAttribute("align", "center");
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

        button.onclick = function(){
            function parseProfit(){
                var result = {};

                var date_start = new Date(date_picker_start.valueAsDate);
                var date_end = new Date(date_picker_end.valueAsDate);
                for(; date_start > date_end; date_start.setDate(date_start.getDate() - 1)){
                    var data = text.split("\n");
                    var date_string = date_start.getDate() + "." + ("00" + (date_start.getMonth() + 1)).slice(-2) + "." + (date_start.getFullYear() - 2000);
                    var syn_reg = /Синдикату\s#(\d+)\s/g;
                    var pts_reg = /\s(\d+\.?\d+?)\sPTS/g;
                    var money_reg = /\s(\d+)\sГб/g;
                    for(var i = 0; i < data.length; i++){
                        var line = data[i];
                        if(line.indexOf(date_string) >= 0){
                            var m_s = syn_reg.exec(line);
                            if(m_s != null){
                                if(result[m_s[1]] == undefined){
                                    result[m_s[1]] = {};
                                    result[m_s[1]].pts = 0.0;
                                    result[m_s[1]].money = 0;
                                }
                                var m_p = pts_reg.exec(line);
                                if(m_p != null){
                                    result[m_s[1]].pts += parseFloat(m_p[1]);
                                }
                                var m_m = money_reg.exec(line);
                                if(m_m != null){
                                    result[m_s[1]].money += parseFloat(m_m[1]);
                                }
                            }
                        }
                    }
                }
                return result;
            }

            function clear_table(){
                var rows = table.rows.length;
                for(var i = rows - 1; i > 1; i--){
                    table.deleteRow(i);
                }
            }

            clear_table();
            var res = parseProfit();
            var i = 2;
            for(var property in res){
                var row = table.insertRow(i);
                var cell0 = row.insertCell(0);
                var cell1 = row.insertCell(1);
                var cell2 = row.insertCell(2);
                cell0.innerHTML = "<a href=\"http://www.ganjawars.ru/syndicate.php?id=" + property + "\">#" + property + "</a>";
                cell1.innerHTML = res[property].pts;
                cell2.innerHTML = res[property].money + "$";
                i++;
            }
        };
        cell2.appendChild(button);
        cell0.appendChild(label_from);
        cell0.appendChild(date_picker_start);
        cell1.appendChild(label_to);
        cell1.appendChild(date_picker_end);
        var footer = document.getElementsByClassName("clearfooter")[0];
        footer.parentNode.insertBefore(table, footer);
    }

    var url = document.location.href;
    var object_id = url.substring(url.indexOf("=") + 1);
    createInterface();
    setTimeout(colect_data, 2000, object_id); */
})();