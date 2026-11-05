const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const RU={
n1:"Услуги",n2:"Как мы работаем",n3:"Подбор дизайна",bo2:"Заказать",bi2:"Инфо",
h1:"Создаём сайты для вашего бизнеса",
hp:"Выберите тип сайта, посмотрите результат заранее и закажите в Telegram-боте. Остались вопросы — получите информацию там же.",
bo:"Заказать в боте",bi:"Узнать подробнее",
t1:"Сайты, удобные на телефоне",t2:"Сроки и стоимость согласуем заранее",t3:"Сначала показываем результат, потом передаём сайт",
oCard:"Сайт-визитка",oShop:"Интернет-магазин",oLand:"Лендинг",
sv1:"Услуги, цены и контакты на одной странице.",sv2:"Каталог товаров и корзина.",sv3:"Одна страница: предложение, преимущества и заявка.",
sv4t:"Поддержка",sv4:"Обновление и поддержка готовых сайтов.",
p1t:"Обсуждение",p1:"Вы описываете задачу в боте, мы её обсуждаем.",
p2t:"Согласование",p2:"Согласуем сроки и стоимость.",
p3t:"Передача",p3:"Показываем результат и только потом передаём сайт.",
bh:"Выберите дизайн",bp:"Это необязательно: ваш выбор автоматически передастся боту.",
lName:"Название вашего бизнеса",lType:"Тип сайта",lColor:"Цвет",lStyle:"Стиль",
oMin:"Минимализм",oMod:"Современный",oBold:"Яркий",lBg:"Фон",oLight:"Светлый",oDark:"Тёмный",
bd:"Заказать с этим дизайном",
ah:"О нас",
a1:"Qryptex Lab — студия, которая создаёт сайты и IT-решения для бизнеса. Скоро откроем курсы по веб-разработке: следите за новостями в Telegram-канале.",
fh:"Есть вопрос или хотите заказать?",
fp:"Всё происходит в Telegram-боте: он принимает заявку и рассказывает об услугах.",
chan:"Наш канал",
note:"Бот пока настраивается. Заказ через Telegram заработает совсем скоро."
};
const COL={mint:["#3ddc97","#06210f"],blue:["#2563eb","#fff"],orange:["#ea580c","#fff"],pink:["#db2777","#fff"],violet:["#7c3aed","#fff"]};
const PV={
card:{uz:["Bog‘lanish","Xizmatlar","Ishlarimiz","Aloqa"],ru:["Связаться","Услуги","Работы","Контакты"]},
shop:{uz:["Xarid qilish","Mahsulot 1","Mahsulot 2","Mahsulot 3"],ru:["Купить","Товар 1","Товар 2","Товар 3"]},
land:{uz:["Ariza qoldirish","Afzallik 1","Afzallik 2","Afzallik 3"],ru:["Оставить заявку","Преимущество 1","Преимущество 2","Преимущество 3"]}
};
const BOT="YOUR_BOT_USERNAME"; // botingizning username'i, @ belgisiz
const link=p=>`https://t.me/${BOT}?start=${p}`;
const TITLE=document.title;
let lang="uz";
const S={type:"card",style:"mod",bg:"light",color:"mint"};

$$("[data-t]").forEach(e=>e.dataset.uz=e.textContent);
$$(".go-order").forEach(a=>a.href=link("order"));
$$(".go-info").forEach(a=>a.href=link("info"));
Object.keys(COL).forEach(k=>{
  const b=document.createElement("button");
  b.style.background=COL[k][0];b.dataset.k=k;b.setAttribute("aria-label",k);
  b.onclick=()=>{S.color=k;render()};
  $("#sw").append(b);
});
$$(".seg").forEach(g=>g.onclick=e=>{
  const b=e.target.closest("button");
  if(b){S[g.dataset.g]=b.dataset.v;render()}
});
$("#name").oninput=render;
$("#bUz").onclick=()=>setLang("uz");
$("#bRu").onclick=()=>setLang("ru");

function render(){
  const p=PV[S.type][lang],pv=$("#pv"),c=COL[S.color];
  const name=$("#name").value.trim()||(lang==="ru"?"Ваш бизнес":"Sizning biznesingiz");
  pv.style.setProperty("--c",c[0]);pv.style.setProperty("--cb",c[1]);
  pv.dataset.type=S.type;pv.dataset.style=S.style;pv.dataset.bg=S.bg;
  $("#pvName").textContent=name;$("#pvTitle").textContent=name;$("#pvBtn").textContent=p[0];
  $$(".pv-cards div").forEach((d,i)=>d.textContent=p[i+1]);
  $$(".seg button").forEach(b=>{
    const on=S[b.parentNode.dataset.g]===b.dataset.v;
    b.classList.toggle("on",on);b.setAttribute("aria-pressed",on);
  });
  $$("#sw button").forEach(b=>b.classList.toggle("on",b.dataset.k===S.color));
  $("#botDesign").href=link(`order_${S.type}_${S.color}_${S.style}_${S.bg}`);
}

function setLang(l){
  lang=l;document.documentElement.lang=l;
  document.title=l==="ru"?"Qryptex Lab: сайты и IT-услуги, заказ в Telegram-боте":TITLE;
  $$("[data-t]").forEach(e=>e.textContent=l==="ru"?RU[e.dataset.t]:e.dataset.uz);
  $("#bUz").classList.toggle("on",l==="uz");
  $("#bRu").classList.toggle("on",l==="ru");
  try{localStorage.setItem("lang",l)}catch(e){}
  render();
}

let saved;try{saved=localStorage.getItem("lang")}catch(e){}
setLang(saved==="ru"?"ru":"uz");
