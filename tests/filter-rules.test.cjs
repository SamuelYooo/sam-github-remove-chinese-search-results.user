const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const scriptPath = join(__dirname, "..", "sam-github-remove-chinese-search-results.user.git.js");

function createLocalStorage(initialValues = {}) {
    const values = new Map(Object.entries(initialValues));

    return {
        getItem(key) {
            return values.has(key) ? values.get(key) : null;
        },
        setItem(key, value) {
            values.set(key, String(value));
        },
    };
}

function loadCleanerApi(customRules) {
    const localStorageValues = customRules
        ? { samGithubSearchCleanerRules: JSON.stringify(customRules) }
        : {};
    const sandbox = {
        console: { log() {} },
        document: {
            body: {},
            readyState: "complete",
            querySelectorAll() {
                return [];
            },
        },
        MutationObserver: class {
            observe() {}
        },
        window: {
            localStorage: createLocalStorage(localStorageValues),
        },
    };

    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(readFileSync(scriptPath, "utf8"), sandbox);
    return sandbox.window.__githubSearchResultCleanerTest;
}

test("blocks screenshot search-result patterns", () => {
    const api = loadCleanerApi();
    assert.equal(typeof api?.matchesBlockedResult, "function");

    const blockedCases = [
        {
            repository: "cirosantilli/china-dictatroship-7",
            text: "任仕途关键的首任岳父及家属就有情报工作背景。",
        },
        {
            repository: "mRFWq7LwNPZjaVv5v6eo/cihna-dictattorship-8",
            text: "中央政策研究室重要到王沪宁入常后为了死抓这中共情报与决策大权。",
        },
        {
            repository: "panbinibn/OpenPacketFix",
            text: "中共中央政策研究室是王为其野心已经经营几十年，聚众谋士的间谍情报汇总研究的特务机关。",
        },
        {
            repository: "b0LBwZ7r5HOeh6CBMuQIhVu3-s-random-fork/PCL2",
            text: "后各重大决策和危机难题都摆在中共中央政策研究室王沪宁桌面上。",
        },
        {
            repository: "zpc1314521/PCL2",
            text: "普通搜索结果卡片",
        },
    ];

    for (const item of blockedCases) {
        assert.equal(
            api.matchesBlockedResult(item.repository, item.text),
            true,
            `${item.repository} should be blocked`,
        );
    }
});

test("blocks foreseeable political spam when multiple high-signal phrases appear", () => {
    const api = loadCleanerApi();
    assert.equal(typeof api?.matchesBlockedResult, "function");

    assert.equal(
        api.matchesBlockedResult(
            "ordinary/example-project",
            "相关内容称王沪宁本人及家属有情报工作背景，"
                + "三朝都无法摆脱，重大决策和危机难题都摆在其桌面上。",
        ),
        true,
    );
});

test("blocks graphic violence and gore search-result text", () => {
    const api = loadCleanerApi();
    assert.equal(typeof api?.matchesBlockedResult, "function");

    const blockedCases = [
        "项目描述包含血腥暴力、虐杀视频和尸体图片等内容。",
        "仓库 README 宣称提供斩首视频和处决视频合集。",
        "示例页面展示血肉模糊的残肢断臂画面。",
    ];

    for (const text of blockedCases) {
        assert.equal(api.matchesBlockedResult("ordinary/example-project", text), true, text);
    }
});

test("blocks anti-China and reactionary political combinations", () => {
    const api = loadCleanerApi();
    assert.equal(typeof api?.matchesBlockedResult, "function");

    const blockedCases = [
        "该仓库持续发布反华言论和辱华内容。",
        "项目介绍包含分裂中国、颠覆国家政权等反动宣传。",
        "README 标榜中国崩溃论并鼓吹推翻中国政府。",
    ];

    for (const text of blockedCases) {
        assert.equal(api.matchesBlockedResult("ordinary/example-project", text), true, text);
    }
});

test("keeps unrelated search results visible", () => {
    const api = loadCleanerApi();
    assert.equal(typeof api?.matchesBlockedResult, "function");

    assert.equal(
        api.matchesBlockedResult("vuejs/core", "The Progressive JavaScript Framework."),
        false,
    );

    assert.equal(
        api.matchesBlockedResult("notes/public-research", "王沪宁相关公开资料整理。"),
        false,
    );

    assert.equal(
        api.matchesBlockedResult("news/archive", "政治新闻资料归档和公开事件时间线。"),
        false,
    );

    assert.equal(
        api.matchesBlockedResult("security/incident-notes", "安全研究中提到暴力破解这个技术术语。"),
        false,
    );
});

test("supports local custom filter rules", () => {
    const api = loadCleanerApi({
        textPhrases: ["自定义污染短语"],
        projectNames: ["custom-toxic-repo"],
        users: ["custom-toxic-owner"],
        projectKeywords: ["toxicfork"],
    });

    assert.equal(api.matchesBlockedResult("normal/repo", "这里包含自定义污染短语。"), true);
    assert.equal(api.matchesBlockedResult("normal/custom-toxic-repo", "normal text"), true);
    assert.equal(api.matchesBlockedResult("custom-toxic-owner/repo", "normal text"), true);
    assert.equal(api.matchesBlockedResult("normal/my-toxicfork-copy", "normal text"), true);
});
