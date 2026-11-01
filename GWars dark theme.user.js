// ==UserScript==
// @name         GWars dark theme
// @namespace    https://github.com/Ekipogh/ganjascripts
// @version      1.0.4
// @description  Charcoal and green dark theme for GWars, with a remembered menu toggle
// @author       Ekipogh
// @match        *://gwars.io/*
// @match        *://www.gwars.io/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
    'use strict';

    const attribute = 'data-gw-dark';
    const storageKey = 'gw-dark-theme-enabled';
    const scope = `html[${attribute}="on"]`;
    let enabled = GM_getValue(storageKey, true) !== false;
    const rules = [];
    function rule(selectors, declarations) {
        rules.push(selectors.split(',').map(selector => `${scope} ${selector.trim()}`).join(',') + `{${declarations}}`);
    }

    // Match declaration boundaries so color rules never match background-color.
    // Both authored HTML and browser-serialized inline styles occur on GWars.
    function inlineSelectors(property, value) {
        return ['', ' ', '  ', '\\9 ', '\\a '].flatMap(before => ['', ' '].flatMap(after => {
            const declaration = `${property}:${after}${value}`;
            const prefix = `;${before}${declaration}`;
            // Require a value boundary: #000 must not match #000099.
            return [
                `[style="${declaration}" i]`,
                `[style^="${declaration};" i]`,
                `[style^="${declaration} " i]`,
                `[style$="${prefix}" i]`,
                `[style*="${prefix};" i]`,
                `[style*="${prefix} " i]`
            ];
        })).join(',');
    }
    function colorRules(property, values, target) {
        for (const value of values.split(' ')) {
            const variants = [value];
            if (/^#[0-9a-f]{6}$/i.test(value)) {
                const channels = value.slice(1).match(/../g).map(part => parseInt(part, 16));
                variants.push(`rgb(${channels.join(', ')})`, `rgb(${channels.join(',')})`);
            }
            for (const variant of variants) {
                // These selectors are joined directly: rgb() values contain commas.
                const selectors = inlineSelectors(property, variant);
                const outputProperty = property === 'background' ? 'background-color' : property;
                rules.push(`${scope} :is(${selectors}){${outputProperty}:${target} !important;}`);
            }
            if (property === 'background-color') {
                rule(`[bgcolor="${value}" i]`, `background-color:${target} !important;`);
            } else if (property === 'color') {
                rule(`font[color="${value}" i]`, `color:${target} !important;`);
                // Battle logs also use legacy hexadecimal font colors without '#'.
                if (/^#[0-9a-f]{6}$/i.test(value)) {
                    rule(`font[color="${value.slice(1)}" i]`, `color:${target} !important;`);
                }
            }
        }
    }

    rules.push(`${scope}{color-scheme:dark;--gwd-page:#171b1a;--gwd-panel:#222927;--gwd-header:#303d35;--gwd-hover:#354b3c;--gwd-text:#dee7e0;--gwd-muted:#bdcac1;--gwd-link:#a0dcb1;--gwd-border:#617568;--gwd-red:#ff9b9b;--gwd-blue:#9dbfff;--gwd-purple:#d5afff;--gwd-green:#9cdda8;background:var(--gwd-page) !important;}`);
    rule('body', 'background:var(--gwd-page) !important;color:var(--gwd-text) !important;');
    rule('td,th,.txt,.h,.home_td_off', 'color:var(--gwd-text) !important;');
    rule('a,a.nul', 'color:var(--gwd-link) !important;');
    rule('a:hover,a.nul:hover', 'color:#c4f5d0 !important;');
    rule('a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,[tabindex]:focus-visible', 'outline:2px solid #a0dcb1 !important;outline-offset:2px;');

    const panelColors = '#ffffff #fff white #f9fff9 #f5fff5 #f0fff0 #e9ffe9 #e0ffe0 #e0eee0 #d0f5d0 #f0f0f0 #e0e0e0 #d0d5d0 #d0f3d0';
    const headerColors = '#d0eed0 #a0dda0 #c4e1c4 #bdefbd #bae6da #b9efb9 #b3dbb3';
    // Forum mouse handlers change bgcolor directly; map both stripes and hover
    // colors so those updates stay dark without rewriting the site's attributes.
    for (const [values, target] of [[panelColors, 'var(--gwd-panel)'], [headerColors, 'var(--gwd-header)'], ['#e0ebe0', '#28312d'], ['#e8f8e8', 'var(--gwd-hover)'], ['#eed0d0 #fff0f0 #ffe0e0 #f6dccf', '#452d2d'], ['#f0f0ff', '#29354b']]) {
        colorRules('background-color', values, target);
        // Shorthands need their color replaced too, but leave background images intact.
        colorRules('background', values, target);
    }
    rule('.greenbg,.greendarkbg,.greenbg_red,.greenbg_pda_header,.home_td_hl,.battletags,.greenbg_div,.greenbg_block', 'background:var(--gwd-header) !important;color:var(--gwd-text) !important;');
    rule('.simplewhitebg,.whitebg_block,.greengraybg,.greengreenbg,.greenlightbg,.greenbrightbg,.greenwhitebg,.bodygreenbg,.graybg,.graygraybg,.graygreenbg,.graylightbg,.greengraybg_div,.greengreenbg_div,.greenlightbg_div,.greengraybg_block,.greengreenbg_block,.greenlightbg_block,.greenbrightbg_block,.greenfreshbg_block,.greenfresh2bg_block,.home_td_off,.floatingtitle,.quotediv,.warlog_turn1,.chattime', 'background:var(--gwd-panel) !important;');
    rule('.warlog_turn2', 'background:var(--gwd-header) !important;');
    rule('.redbg,.redlightbg,.errorbg', 'background:#452d2d !important;');
    rule('.bluelightbg', 'background:#29354b !important;');
    rule('.wb,.wbm,.wbmap,.bordersaround,.bordersupdown,.withborders,.withallborders,.quotediv,.floatingtitle', 'border-color:var(--gwd-border) !important;');
    rule('.gw-footer__col2,.gray696,.green88font,.warlog_loosersline', 'color:var(--gwd-muted) !important;');
    rule('.panelfloat,.panelfloat_light,.panelfloat_thick', 'box-shadow:0 5px 18px #0009 !important;');
    rule('#pipfader,#pdanavyfader,.select_fader_cl', 'background:rgba(0,0,0,.65) !important;');
    // Only remove known decorative strips; logo and map images stay untouched.
    rule('.begunok,.begunok > span', 'background-image:none !important;background-color:var(--gwd-page) !important;');

    // The link selector also covers item thumbnails in downloaded page copies.
    const itemImages = 'img[src*="/img/items/"],a[href*="item.php?"] img';
    rule(itemImages, 'filter:brightness(0.8) sepia(0.15) !important;');
    rule(itemImages.split(',').map(selector => `${selector}:hover`).join(','), 'filter:none !important;');

    rule('input:not([type="image"]),select,textarea,button,.mainbutton,.codebutton,.maketurnbutton_gray,a.graybutton,a.greenbutton,a.greenlightbutton,a.greengreenbutton,a.greendarkbutton,a.greenbutton_nohover,a.graybutton_nohover,a.graybutton_nh,a.greenbutton_nh,a.greenlightbutton_nh,.battle_target_selector_link', 'background:var(--gwd-header) !important;color:var(--gwd-text) !important;border-color:var(--gwd-border) !important;text-shadow:none !important;');
    rule('button:hover,.mainbutton:hover,.codebutton:hover,a.graybutton:hover,a.greenbutton:hover,a.greenlightbutton:hover,a.greengreenbutton:hover,a.greendarkbutton:hover,a.graybutton_nh:hover,a.greenbutton_nh:hover,a.greenlightbutton_nh:hover,.battle_target_selector_link:hover,a.whitehover:hover', 'background:var(--gwd-hover) !important;');
    rule('input:disabled,button:disabled,select:disabled,textarea:disabled,input.disabled', 'color:var(--gwd-muted) !important;');
    rule('input::placeholder,textarea::placeholder', 'color:var(--gwd-muted) !important;opacity:1;');
    rule('.customscroll,.thin_scrollbar', 'scrollbar-color:var(--gwd-border) var(--gwd-panel);');
    rule('.customscroll::-webkit-scrollbar-track,.thin_scrollbar::-webkit-scrollbar', 'background:var(--gwd-panel) !important;');
    rule('.customscroll::-webkit-scrollbar-thumb,.thin_scrollbar::-webkit-scrollbar-thumb', 'background:var(--gwd-border) !important;');

    const textGroups = [
        ['#003300 #004400 #006600 #007700 #000000 #000 black', 'var(--gwd-text)', '.green33font,.green66font,.item_reg,.item_art'],
        ['#990000 #aa0000 #cc0000 #ff0000 #880000 #660000 #330000 #a32020 red', 'var(--gwd-red)', '.r,.txtr,.redheader,.redfont,.dangerfont,.redlightfont,.redbrightfont,.item_pa,.greenbg_red,.warlog_enterbattle,.warlog_damage,.warlog_winnersline,.warlog_drawmsg'],
        ['#000099 #0000cc #0000ff #0000aa #0000dd blue', 'var(--gwd-blue)', '.b,.bluefont,.bluebrightfont,.warlog_deathline,.warlog_maklaud,.warlog_drawmsgblue'],
        ['#660066 #4400aa #5238ce #615669 purple', 'var(--gwd-purple)', '.blue2font,.qlevel,.item_qreg,.item_qart'],
        ['#009900 #008000 #176b2c green', 'var(--gwd-green)', '.g,.greenfont'],
        ['#669966 #809980 #8ba98b #aaaaaa #666666 #656c63 #465546 gray grey', 'var(--gwd-muted)', '.gray696']
    ];
    for (const [values, target, classes] of textGroups) {
        rule(classes, `color:${target} !important;`);
        colorRules('color', values, target);
    }

    // Battle team/weapon headings keep their red, blue and green distinctions.
    rule('.redhead[bgcolor="#990000" i]', 'background:#452d2d !important;');
    rule('.redhead[bgcolor="#000099" i],.redhead[bgcolor="#0000aa" i]', 'background:#29354b !important;');
    rule('.redhead[bgcolor="#006600" i],.redhead[bgcolor="#003300" i]', 'background:#294431 !important;');
    rule('.redhead', 'color:var(--gwd-text) !important;');

    // Forum search results and custom checkbox use page-specific backgrounds.
    rule('#fsearch_page .rtbl,#fsearch_box .ftglbox', 'background:var(--gwd-panel) !important;border-color:var(--gwd-border) !important;');
    rule('#fsearch_box .ftglbox:after', 'background:var(--gwd-muted) !important;');
    rule('#fsearch_box .ftgl:checked + .ftglbox', 'background:var(--gwd-hover) !important;');
    rule('#fsearch_box .ftgl:checked + .ftglbox:after', 'background:var(--gwd-green) !important;');
    rule('#fsearch_page .fprev b', 'background:var(--gwd-header) !important;color:var(--gwd-green) !important;');

    // Operations define their own stylesheet, including panels loaded after navigation.
    rule('table.opbar', 'background:var(--gwd-page) !important;border-color:var(--gwd-border) !important;');
    rule('table.opbar td.opbarskill,table.opbar td.opst,.ophead,.opmhead,.opcardhead,.opclass.opalt', 'background:var(--gwd-header) !important;');
    rule('.opcard,.opempty,.opsearch,.oparch,.opclass,.opmodal,.opalarm,.opstory,.opfact,.opcatalogclosed,.optabs a,.optabs span', 'background:var(--gwd-panel) !important;');
    rule('.opcataloglocked', 'background:var(--gwd-page) !important;');
    rule('.optabs a.opon', 'background:var(--gwd-header) !important;color:var(--gwd-text) !important;');
    rule('.optabs a:not(.oplocked):hover', 'background:var(--gwd-hover) !important;');
    rule('.ophead,.opcard,.opsearch,.opalarm,.opstory,.opgains,.opclasses,.opclass,.opcataloglocked', 'border-color:var(--gwd-border) !important;');
    rule('.ophead,.opbad,.op .opstar.opstaron', 'color:var(--gwd-red) !important;');
    rule('.opok,.op .opmk.opmkon', 'color:var(--gwd-green) !important;');
    rule('table.opbar .opsm,.opsm,.opfl,.opmeta,.opheadnum,.opempty,.opbadge,.opcheck,.opmhead .opmx,.opgl,.opcataloghint,.opresourcewait,.opcatalogclosed,.opcatalogclosedstate,.opunknown,.opclasslocked,.optabs span,.optabs a.oplocked,.op .opstar,.op .opmk', 'color:var(--gwd-muted) !important;');
    rule('.opb', 'background:var(--gwd-header) !important;color:var(--gwd-link) !important;');
    rule('.opb:hover', 'background:var(--gwd-hover) !important;');
    rule('.opb.oppri', 'background:#294431 !important;color:var(--gwd-text) !important;');
    rule('.opb.oppri:hover', 'background:var(--gwd-hover) !important;');
    rule('.opb[disabled],.opb[disabled]:hover,.opb.opoff,.opb.opoff:hover', 'background:var(--gwd-panel) !important;color:var(--gwd-muted) !important;');
    rule('.opfader', 'background:rgba(0,0,0,.65) !important;');
    rule('.opmodal', 'box-shadow:0 5px 18px #0009 !important;');
    rule('.opdots span', 'background:var(--gwd-green) !important;');
    rule('.opclistcard', 'border-color:var(--gwd-border) !important;');
    rule('.opclistdesc,.opclistexp,.opclistempty', 'color:var(--gwd-muted) !important;');

    // Override the injected GanjaMoney styles regardless of installation order.
    rule('.gm-character .gm-meter', 'background:linear-gradient(to right,var(--gm-fill) var(--gm-value),transparent var(--gm-value)),var(--gwd-panel) !important;box-shadow:inset 0 0 0 1px var(--gwd-border) !important;');
    rule('.gm-character #mehp', '--gm-fill:#294431;');
    rule('.gm-character #meap', '--gm-fill:#29443f;');
    rule('.gm-character .gm-profit[data-sign="positive"],#ferma-experience', 'color:var(--gwd-green) !important;');
    rule('.gm-character .gm-profit[data-sign="negative"]', 'color:var(--gwd-red) !important;');
    // The page background must take precedence over its legacy inline palette.
    rule('body,body[style]', 'background:var(--gwd-page) !important;color:var(--gwd-text) !important;');

    function apply() {
        if (enabled) document.documentElement.setAttribute(attribute, 'on');
        else document.documentElement.removeAttribute(attribute);
    }
    function start() {
        apply();
        const style = document.createElement('style');
        style.id = 'gw-dark-theme-style';
        style.textContent = rules.join('\n');
        (document.head || document.documentElement).appendChild(style);
    }
    if (document.documentElement) start();
    else {
        const observer = new MutationObserver(() => {
            if (!document.documentElement) return;
            observer.disconnect();
            start();
        });
        observer.observe(document, { childList: true });
    }
    GM_registerMenuCommand('Toggle GWars dark theme (dark / original)', () => {
        enabled = !enabled;
        GM_setValue(storageKey, enabled);
        if (document.documentElement) apply();
    });
})();

