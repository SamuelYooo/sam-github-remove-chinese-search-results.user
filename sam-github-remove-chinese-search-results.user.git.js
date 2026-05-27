// ==UserScript==
// @name         GitHub 去除中文搜索污染
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  隐藏 GitHub 搜索里的低质关键词污染结果
// @license      GPL-3.0-only
// @author       samuelyoo
// @github       https://github.com/SamuelYooo/sam-github-remove-chinese-search-results.user
// @match        https://github.com/search?*
// @icon         data:image/png;base64,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
// @downloadURL  https://raw.githubusercontent.com/SamuelYooo/sam-github-remove-chinese-search-results.user/refs/heads/main/sam-github-remove-chinese-search-results.user.git.js
// @updateURL    https://raw.githubusercontent.com/SamuelYooo/sam-github-remove-chinese-search-results.user/refs/heads/main/sam-github-remove-chinese-search-results.user.git.js
// ==/UserScript==

(function () {
    "use strict";

    const blockedUsers = new Set([
        "haoxuesen",
        "zhaohmng",
        "zaohmeing",
        "zhaohmng-outlook-com",
        "thestrangercamus",
        "shengxinjing",
        "cirosantilli",
        "dimples1337",
        "codin-stuffs",
        "cheezcharmer",
        "gege-circle",
    ]);

    const blockedProjectNames = new Set([
        "china-dictatorship",
        "chinese-dictatorship",
        "pcl2",
    ]);

    const blockedProjectKeywords = [
        "dictator",
        "dictatorship",
    ];

    const directBlockedTextPhrases = [
        "血腥暴力",
        "血肉模糊",
        "残肢断臂",
        "斩首视频",
        "处决视频",
        "虐杀视频",
        "尸体图片",
        "恐怖袭击视频",
        "反华言论",
        "辱华言论",
        "辱华内容",
        "分裂中国",
        "颠覆国家政权",
        "反动宣传",
        "中国崩溃论",
        "推翻中国政府",
        "中共中央政策研究室",
        "中央政策研究室",
        "死抓这中共情报与决策大权",
        "中共情报与决策大权",
        "任仕途关键的首任岳父",
        "聚众谋士的间谍情报汇总研究",
        "特务机关和策划制定决策重要机构",
        "不忘初心牢记使命主题教育工作小组组长",
    ];

    const scoredBlockedTextPhrases = [
        { phrase: "王沪宁", score: 1 },
        { phrase: "任仕途关键", score: 2 },
        { phrase: "首任岳父", score: 3 },
        { phrase: "家属有情报工作背景", score: 3 },
        { phrase: "情报工作背景", score: 3 },
        { phrase: "重大决策和危机难题", score: 2 },
        { phrase: "三朝都无法摆脱", score: 2 },
        { phrase: "决策大权", score: 2 },
        { phrase: "中共情报", score: 3 },
        { phrase: "聚众谋士", score: 2 },
        { phrase: "间谍情报汇总研究", score: 3 },
        { phrase: "特务机关", score: 3 },
        { phrase: "策划制定决策重要机构", score: 3 },
        { phrase: "把持的舆论", score: 2 },
        { phrase: "不忘初心牢记使命", score: 2 },
        { phrase: "血腥", score: 2 },
        { phrase: "虐杀", score: 3 },
        { phrase: "斩首", score: 3 },
        { phrase: "处决", score: 2 },
        { phrase: "尸体", score: 2 },
        { phrase: "残肢", score: 3 },
        { phrase: "断臂", score: 3 },
        { phrase: "反华", score: 3 },
        { phrase: "辱华", score: 3 },
        { phrase: "反动", score: 2 },
        { phrase: "颠覆", score: 2 },
        { phrase: "分裂中国", score: 3 },
        { phrase: "推翻中国", score: 3 },
        { phrase: "中国崩溃", score: 3 },
        { phrase: "政治谣言", score: 3 },
        { phrase: "反共宣传", score: 3 },
    ];

    const blockedTextScoreThreshold = 4;
    // Optional local extension:
    // localStorage.setItem("samGithubSearchCleanerRules", JSON.stringify({ textPhrases: ["..."] }));
    const customRuleStorageKey = "samGithubSearchCleanerRules";
    const customRules = readCustomRules();
    const customBlockedUsers = new Set(asStringList(customRules.users).map(normalizeName));
    const customBlockedProjectNames = new Set(asStringList(customRules.projectNames).map(normalizeName));
    const customBlockedProjectKeywords = asStringList(customRules.projectKeywords);
    const customDirectBlockedTextPhrases = asStringList(customRules.textPhrases);

    const ignoredPathOwners = new Set([
        "about",
        "account",
        "apps",
        "codespaces",
        "collections",
        "customer-stories",
        "dashboard",
        "events",
        "explore",
        "features",
        "login",
        "marketplace",
        "notifications",
        "orgs",
        "pricing",
        "pulls",
        "search",
        "settings",
        "sponsors",
        "topics",
        "trending",
    ]);

    function normalizeAscii(value) {
        return String(value || "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "");
    }

    function normalizeName(value) {
        return String(value || "").trim().toLowerCase();
    }

    function asStringList(value) {
        if (!Array.isArray(value)) {
            return [];
        }

        return value
            .map((item) => String(item || "").trim())
            .filter(Boolean);
    }

    function readCustomRules() {
        try {
            const storage = typeof window !== "undefined" ? window.localStorage : null;
            const rawRules = storage?.getItem(customRuleStorageKey);

            if (!rawRules) {
                return {};
            }

            const parsedRules = JSON.parse(rawRules);

            if (!parsedRules || typeof parsedRules !== "object" || Array.isArray(parsedRules)) {
                return {};
            }

            return parsedRules;
        } catch (_) {
            return {};
        }
    }

    function normalizeText(value) {
        return String(value || "")
            .replace(/[\s，。、“”‘’；：！？,.!?:;()[\]{}<>《》\-_/\\|"'`~@#$%^&*+=]+/g, "");
    }

    function levenshteinDistance(left, right) {
        const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
        const current = Array.from({ length: right.length + 1 }, () => 0);

        for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
            current[0] = leftIndex;

            for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
                const cost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
                current[rightIndex] = Math.min(
                    current[rightIndex - 1] + 1,
                    previous[rightIndex] + 1,
                    previous[rightIndex - 1] + cost,
                );
            }

            for (let index = 0; index < previous.length; index += 1) {
                previous[index] = current[index];
            }
        }

        return previous[right.length];
    }

    function containsFuzzyKeyword(value, keyword, maxDistance) {
        const normalizedValue = normalizeAscii(value);
        const normalizedKeyword = normalizeAscii(keyword);

        if (!normalizedValue || normalizedValue.length < normalizedKeyword.length - maxDistance) {
            return false;
        }

        if (normalizedValue.includes(normalizedKeyword)) {
            return true;
        }

        const minLength = Math.max(1, normalizedKeyword.length - maxDistance);
        const maxLength = normalizedKeyword.length + maxDistance;

        for (let length = minLength; length <= maxLength; length += 1) {
            for (let start = 0; start <= normalizedValue.length - length; start += 1) {
                const fragment = normalizedValue.slice(start, start + length);

                if (levenshteinDistance(fragment, normalizedKeyword) <= maxDistance) {
                    return true;
                }
            }
        }

        return false;
    }

    function parseRepository(repository) {
        const parts = String(repository || "").trim().split("/");

        if (parts.length < 2 || !parts[0] || !parts[1]) {
            return null;
        }

        return {
            owner: normalizeName(parts[0]),
            project: normalizeName(parts[1]),
        };
    }

    function getRepositoryFromHref(href) {
        if (!href) {
            return null;
        }

        let url;

        try {
            url = new URL(href, "https://github.com");
        } catch (_) {
            return null;
        }

        if (url.hostname !== "github.com") {
            return null;
        }

        const parts = url.pathname.split("/").filter(Boolean);

        if (parts.length < 2 || ignoredPathOwners.has(parts[0].toLowerCase())) {
            return null;
        }

        return `${parts[0]}/${parts[1]}`;
    }

    function hasBlockedProjectKeyword(project) {
        return [...blockedProjectKeywords, ...customBlockedProjectKeywords]
            .some((keyword) => containsFuzzyKeyword(project, keyword, 3));
    }

    function textIncludesPhrase(text, phrase) {
        return normalizeText(text).includes(normalizeText(phrase));
    }

    function getBlockedTextScore(text) {
        return scoredBlockedTextPhrases.reduce((score, rule) => {
            if (textIncludesPhrase(text, rule.phrase)) {
                return score + rule.score;
            }

            return score;
        }, 0);
    }

    function hasBlockedTextPhrase(text) {
        return (
            [...directBlockedTextPhrases, ...customDirectBlockedTextPhrases]
                .some((phrase) => textIncludesPhrase(text, phrase))
            || getBlockedTextScore(text) >= blockedTextScoreThreshold
        );
    }

    function matchesBlockedResult(repository, resultText) {
        const parsed = parseRepository(repository);

        if (!parsed) {
            return false;
        }

        return (
            blockedUsers.has(parsed.owner)
            || customBlockedUsers.has(parsed.owner)
            || blockedProjectNames.has(parsed.project)
            || customBlockedProjectNames.has(parsed.project)
            || hasBlockedProjectKeyword(parsed.project)
            || hasBlockedTextPhrase(resultText)
        );
    }

    function findRepositoryLinks(root) {
        return Array.from(root.querySelectorAll("a[href]"))
            .map((link) => ({
                link,
                repository: getRepositoryFromHref(link.getAttribute("href")),
            }))
            .filter((item) => item.repository);
    }

    function findSearchResultCards() {
        const cards = new Set();
        const resultContainers = document.querySelectorAll(
            "[data-testid='results-list'], [data-testid='search-results'], .repo-list",
        );

        for (const container of resultContainers) {
            for (const child of container.children) {
                if (findRepositoryLinks(child).length > 0) {
                    cards.add(child);
                }
            }
        }

        for (const { link } of findRepositoryLinks(document)) {
            const card = link.closest(
                "[data-testid='results-list'] > div, [data-testid='search-results'] > div, .Box-row, .repo-list-item, article, li",
            );

            if (card) {
                cards.add(card);
            }
        }

        return Array.from(cards);
    }

    function removeCard(card, repository) {
        card.remove();
        console.log(`已经移除 ${repository}`);
    }

    function cleanSearchResults() {
        const removed = [];

        for (const card of findSearchResultCards()) {
            const resultText = card.textContent || "";
            const match = findRepositoryLinks(card).find(({ repository }) => (
                matchesBlockedResult(repository, resultText)
            ));

            if (match) {
                removeCard(card, match.repository);
                removed.push(match.repository);
            }
        }

        return removed;
    }

    function installCleaner() {
        cleanSearchResults();

        if (!document.body || typeof MutationObserver === "undefined") {
            return;
        }

        const observer = new MutationObserver(() => {
            cleanSearchResults();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    if (typeof window !== "undefined") {
        Object.defineProperty(window, "__githubSearchResultCleanerTest", {
            configurable: true,
            value: {
                customRuleStorageKey,
                getBlockedTextScore,
                getRepositoryFromHref,
                matchesBlockedResult,
            },
        });
    }

    if (document.readyState === "loading" && window.addEventListener) {
        window.addEventListener("DOMContentLoaded", installCleaner, { once: true });
    } else {
        installCleaner();
    }
}());
