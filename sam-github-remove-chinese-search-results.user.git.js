// ==UserScript==
// @name         GitHub 去除中文搜索污染
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隐藏GitHub某些项目，政见不同不是污染中文搜索的理由，关键词拉满就是无耻
// @license      GPL-3.0 License
// @author       samuelyoo
// @match        https://github.com/search?*
// @downloadURL 
// @updateURL 
// ==/UserScript==
//TODO 增加云端下发功能
const blackListedUsers = [
    "haoxuesen", "zhaohmng", "zaohmeing", "haoxuesen", "zhaohmng-outlook-com", "Thestrangercamus", "shengxinjing",
    "cirosantilli", "Dimples1337", "codin-stuffs", "cheezcharmer", "zaohmeing", "zhaohmng-outlook-com",
    "codin-stuffs", "gege-circle",
];
const blackListedProjectNames = ["china-dictatorship", "chinese-dictatorship","PCL2",
                               ];
const blackListedProjectNameKeyWords = "dictatorship"
window.onload = function () {
    // 在页面完全加载之后执行的代码
    Check();
};
const observer = new MutationObserver(function (mutationsList, observer) {
    // 在 DOM 变化后执行的代码
    Check();
});
// 配置 MutationObserver 监听的选项
const config = {
    childList: true,
    subtree: true
};
// 开始监听 DOM 变化
observer.observe(document.body, config);


function Check() {
    var titleList = document.querySelectorAll(".fIqerb") //搜索所有标题
    //console.log(titleList)
    for (var i = 0; i < titleList.length; i++) {
        var oneTitle = titleList[i]
        if (oneTitle.getAttribute("href").indexOf("/") == 0) {


            var userWithProject = oneTitle.querySelector(".search-match").innerText
            var user = userWithProject.split("/")[0]
            var project = userWithProject.split("/")[1]

            if (blackListedUsers.includes(user) || blackListedProjectNames.includes(project) || project.indexOf(
                    blackListedProjectNameKeyWords) != -1) {
                var card = oneTitle.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                card.parentNode.removeChild(card)
                console.log("已经移除" + userWithProject)
                Check()
            }
        }
    }
}