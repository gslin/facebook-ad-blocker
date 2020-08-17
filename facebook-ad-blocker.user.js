// ==UserScript==
// @name         Facebook ad blocker
// @namespace    https://wiki.gslin.org/wiki/FacebookAdBlocker
// @version      0.20200817.0
// @description  Remove all ad from Facebook
// @author       Gea-Suan Lin <gslin@gslin.org>
// @match        https://www.facebook.com/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    let observer = new MutationObserver(() => {
        document.querySelectorAll('div[data-pagelet^="FeedUnit_"], div[id^="hyperfeed_story_id_"], div[role="article"]').forEach(div => {
            // aria-label="Sponsored"
            div.querySelectorAll('div[aria-label="Sponsored"]').forEach(span => {
                console.info('Remove a Facebook ad element by aria-label="Sponsored".');
                div.remove();
                return;
            });

            // <span>Sponsored
            div.querySelectorAll('span').forEach(span => {
                if (span.innerText.startsWith('Sponsored')) {
                    console.info('Remove a Facebook ad element by starting with "Sponsored".');
                    div.remove();
                    return;
                }
            });

            div.querySelectorAll('b[style="display: none;"]').forEach(b => {
                let span = b.closest('span');
                if (span.innerText.startsWith('Sponsored')) {
                    console.info('Remove a Facebook ad element by detecting obfuscation elements.');
                    div.remove();
                    return;
                }
            });

            div.querySelectorAll('a > span > span > span').forEach(span => {
                let span_style = window.getComputedStyle(span);
                if ('absolute' === span_style.getPropertyValue('position') && '0' !== span_style.getPropertyValue('top') && 1 === span.innerHTML.length) {
                    console.info('Remove a Facebook ad element by detecting css obfuscation elements.');
                    div.remove();
                    return;
                }
            });
        });
    });

    observer.observe(document.documentElement, {
        attributes: false,
        childList: true,
        subtree: true,
    });
})();
