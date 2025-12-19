// ==UserScript==
// @name         CERN GitLab Add link to the MR Generator
// @namespace    https://github.com/kevin-kessler
// @version      0.0.1
// @description  Add a button to open the MR Generator from GitLab merge request pages
// @author       7PH (https://github.com/7PH)
// @match        https://gitlab.cern.ch/epc/*/-/merge_requests/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cern.ch
// @grant        none
// @homepage     https://github.com/kevin-kessler/cern-userscripts
// @homepageURL  https://github.com/kevin-kessler/cern-userscripts
// @source       https://github.com/kevin-kessler/cern-userscripts
// @supportURL   https://github.com/kevin-kessler/cern-userscripts/issues
// @updateURL    https://github.com/kevin-kessler/cern-userscripts/raw/refs/heads/master/src/gitlab.cern.ch/gitlab-mr-generator-button.user.js
// @downloadURL  https://github.com/kevin-kessler/cern-userscripts/raw/refs/heads/master/src/gitlab.cern.ch/gitlab-mr-generator-button.user.js
// ==/UserScript==

(function() {
    'use strict';

    const MR_GENERATOR_URL = 'https://ccs-public-html.app.cern.ch/assets/mr-generator/';
    const GITLAB_BUTTON_CLASSES = 'gl-button btn-confirm';

    const SELECTORS = {
        header: '.detail-page-header',
        branchLinks: '.ref-container',
    };

    const SELECTOR_POLLING_DELAY_MS = 100;

    async function sleepFor(durationMs) {
        return new Promise(resolve => setTimeout(resolve, durationMs));
    }

    async function waitForSelector(selector, onlyOne) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
            await sleepFor(SELECTOR_POLLING_DELAY_MS);
            return waitForSelector(selector, onlyOne);
        }
        if (onlyOne) {
            return Array.from(elements)[0];
        } else {
            return Array.from(elements);
        }
    }

    function getRepoName() {
        return document.location.href.match(/cern.ch\/(.+)\/-\/merge_requests/)[1];
    }

    function getMergeRequestId() {
        return document.location.href.match(/\/(\d+)/)[1];
    }

    function getTargetBranch() {
        return document.querySelectorAll(SELECTORS.branchLinks)[1].title;
    }

    async function main() {
        const header = await waitForSelector(SELECTORS.header, true);

        const button = document.createElement('button');
        button.className = GITLAB_BUTTON_CLASSES;
        button.innerText = 'MR Generator';
        button.addEventListener('click', () => {
            window.open(`${MR_GENERATOR_URL}#${getRepoName()}:${getMergeRequestId()}:${getTargetBranch()}`);
        });

        const div = document.createElement('div');
        div.appendChild(button);
        header.appendChild(div);
    }

    main();
})();