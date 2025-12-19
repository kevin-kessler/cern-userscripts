// ==UserScript==
// @name         Auto-collapse GitLab threads on resolve
// @match        https://gitlab.com/*/merge_requests/*
// @match        https://gitlab.cern.ch/*/merge_requests/*
// @namespace    https://github.com/kevin-kessler
// @version      2025-02-19
// @description  Automatically collapses GitLab threads when resolved.
// @author       7PH (https://github.com/7PH)
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cern.ch
// @grant        none
// @homepage     https://github.com/kevin-kessler
// @homepageURL  https://github.com/kevin-kessler
// @source       https://github.com/kevin-kessler/userscript-gitlab-auto-collapse-threads
// @supportURL   https://github.com/kevin-kessler/userscript-gitlab-auto-collapse-threads/issues
// ==/UserScript==

/*
 * Related issue: https://gitlab.com/gitlab-org/gitlab/-/issues/357827
 */

(function () {
    'use strict';

    const RESOLVE_BTN_SELECTOR = '[data-testid="resolve-discussion-button"]';
    const COLLAPSE_BTN_SELECTOR = '[data-testid="collapse-replies-button"]';
    const DISCUSSION_CONTAINER_CLASS = '.discussion';
    const UNRESOLVE_TEXT = 'Unresolve thread';

    function handleThreadResolution(resolveBtn, discussionContainer, observer) {
        if (resolveBtn.textContent.trim() !== UNRESOLVE_TEXT) {
            return;
        }

        const collapseBtn = discussionContainer.querySelector(COLLAPSE_BTN_SELECTOR);
        if (!collapseBtn) {
            return; // Collapse button not yet available, wait for further mutations
        }

        observer.disconnect();

        console.log('✅ Thread resolved! Collapsing...');
        collapseBtn.click();
    }

    function main(event) {
        const resolveBtn = event.target.closest(RESOLVE_BTN_SELECTOR);
        if (!resolveBtn) {
            return;
        }

        const discussionContainer = resolveBtn.closest(DISCUSSION_CONTAINER_CLASS);
        if (!discussionContainer) {
            console.warn('Could not find discussion container');
            return;
        }

        console.log('🟢 Resolve thread button clicked, waiting for resolution...');

        const observer = new MutationObserver(() => handleThreadResolution(resolveBtn, discussionContainer, observer));
        observer.observe(resolveBtn, { childList: true, subtree: true });
    }

    document.addEventListener('click', main);
})();