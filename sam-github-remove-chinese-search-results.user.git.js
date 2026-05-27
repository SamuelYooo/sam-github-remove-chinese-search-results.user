// ==UserScript==
// @name         GitHub 去除中文搜索污染
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  隐藏 GitHub 搜索里的低质关键词污染结果
// @license      GPL-3.0 License
// @author       samuelyoo
// @github       https://github.com/SamuelYooo/sam-github-remove-chinese-search-results.user
// @match        https://github.com/search?*
// @downloadURL
// @updateURL
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
