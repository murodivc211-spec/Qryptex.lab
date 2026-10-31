/* ===== НАСТРОЙКИ ===== */
var BOT_USERNAME = "Qryptex_bot";      // имя бота без @
var CHANNEL_USERNAME = "Qryptex_lab";  // имя канала без @
/* ===================== */

var TYPES = [["visitka", "Сайт-визитка"], ["magazin", "Интернет-магазин"], ["lending", "Лендинг"]];
var COLORS = [["green", "#00e5a0", "Зелёный"], ["blue", "#3b82f6", "Синий"], ["violet", "#8b5cf6", "Фиолетовый"], ["orange", "#f97316", "Оранжевый"], ["rose", "#f43f5e", "Розовый"], ["yellow", "#eab308", "Жёлтый"]];
var STYLES = [["strict", "Строгий"], ["soft", "Мягкий"], ["bold", "Яркий"]];
var THEMES = [["dark", "Тёмный"], ["light", "Светлый"]];
var S = { type: "visitka", color: "green", style: "strict", theme: "dark", name: "" };

function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] }) }
function colorHex(k) { for (var i = 0; i < COLORS.length; i++)if (COLORS[i][0] === k) return COLORS[i][1] }
function label(list, k) { for (var i = 0; i < list.length; i++)if (list[i][0] === k) return list[i][list[i].length - 1] }

function makeOpts(id, list, key, isColor) {
    var box = document.getElementById(id);
    list.forEach(function (it) {
        var b = document.createElement("button");
        b.type = "button";
        if (isColor) { b.className = "sw"; b.style.background = it[1]; b.setAttribute("aria-label", it[2]); b.title = it[2] }
        else { b.className = "opt"; b.textContent = it[1] }
        b.setAttribute("aria-pressed", S[key] === it[0]);
        b.onclick = function () { S[key] = it[0]; render() };
        b.dataset.v = it[0];
        box.appendChild(b);
    });
}
function syncOpts(id, key) {
    document.querySelectorAll("#" + id + " button").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.v === S[key]) });
}

function render() {
    var dark = S.theme === "dark", a = colorHex(S.color);
    var pv = document.getElementById("pv");
    pv.dataset.s = S.style;
    var v = { "--a": a, "--pbg": dark ? "#10151c" : "#fafaf7", "--pfg": dark ? "#eef2f6" : "#171a1f", "--pmut": dark ? "#93a0ae" : "#5b6572", "--pln": dark ? "#222b37" : "#dfe3e8", "--pcard": dark ? "#18202a" : "#eef0ee", "--pon": (S.color === "yellow" || S.color === "green" || S.color === "orange") ? "#111" : "#fff" };
    for (var k in v) pv.style.setProperty(k, v[k]);
    var nm = esc(S.name || "Ваш бизнес"), body = "";
    if (S.type === "visitka") {
        body = '<h3>Коротко о нас</h3><p>Чем мы занимаемся, наши услуги и контакты на одной странице.</p><span class="pb">Позвонить</span><div class="row"><span class="chip">Услуги</span><span class="chip">О компании</span><span class="chip">Контакты</span></div>';
    } else if (S.type === "magazin") {
        var t = ''; for (var i = 1; i <= 4; i++)t += '<div class="tile"><i></i>Товар ' + i + '<br><s>00 000 сум</s></div>';
        body = '<h3>Каталог</h3><p>Покупатели выбирают товары и оформляют заказ.</p><div class="grid">' + t + '</div>';
    } else {
        body = '<h3>Главное предложение для ваших клиентов</h3><p>Одна страница, одна цель: получить заявку.</p><span class="pb">Оставить заявку</span><div class="row"><span class="chip">Быстро</span><span class="chip">Удобно</span><span class="chip">Выгодно</span></div>';
    }
    pv.innerHTML = '<nav><b>' + nm + '</b><span>Меню</span></nav>' + body;
    syncOpts("o-type", "type"); syncOpts("o-color", "color"); syncOpts("o-style", "style"); syncOpts("o-theme", "theme");
    var sumText = "Ваш выбор: " + label(TYPES, S.type) + ", цвет: " + label(COLORS, S.color).toLowerCase() + ", стиль: " + label(STYLES, S.style).toLowerCase() + ", фон: " + label(THEMES, S.theme).toLowerCase() + ".";
    document.getElementById("sum").textContent = sumText;
    document.getElementById("sum2").textContent = sumText;
}

makeOpts("o-type", TYPES, "type");
makeOpts("o-color", COLORS, "color", true);
makeOpts("o-style", STYLES, "style");
makeOpts("o-theme", THEMES, "theme");
document.getElementById("nm").addEventListener("input", function (e) { S.name = e.target.value.trim(); render() });

document.querySelectorAll(".go").forEach(function (btn) {
    btn.onclick = function () {
        var toast = document.getElementById("toast");
        if (!BOT_USERNAME) { toast.classList.add("on"); toast.scrollIntoView({ block: "center" }); return }
        var code = [S.type, S.color, S.style, S.theme].join("-");   // например: visitka-green-strict-dark
        window.open("https://t.me/" + BOT_USERNAME + "?start=" + encodeURIComponent(code), "_blank", "noopener");
    };
});

var chBtn = document.getElementById("chan-btn");
if (CHANNEL_USERNAME) { chBtn.href = "https://t.me/" + CHANNEL_USERNAME } else { chBtn.style.display = "none" }

render();