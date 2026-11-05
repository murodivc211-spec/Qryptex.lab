const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const RU={
h1:"Посмотрите, каким будет ваш сайт",
hp:"Выберите тип сайта, цвет и стиль, и макет сразу покажет результат. Заказать можно в конце, в нашем Telegram-боте.",
cta:"Подобрать дизайн",
bh:"Как будет выглядеть ваш сайт",
bp:"Меняйте настройки: макет обновляется сразу.",
lName:"Название вашего бизнеса",lType:"Тип сайта",
oCard:"Сайт-визитка",oShop:"Интернет-магазин",oLand:"Лендинг",
lColor:"Цвет",lStyle:"Стиль",oMin:"Минимализм",oMod:"Современный",oBold:"Яркий",
lBg:"Фон",oLight:"Светлый",oDark:"Тёмный",
toOrder:"Нравится? Перейти к заказу",
ah:"О нас",
a1:"Qryptex Lab — студия, которая создаёт сайты и IT-решения для бизнеса: сайты-визитки, интернет-магазины, лендинги, а также поддержку и обновление готовых сайтов.",
a2:"Мы делаем сайты, которые удобно открываются на телефоне и помогают получать клиентов. Работаем понятно: сначала обсуждаем задачу, затем согласуем сроки и стоимость, показываем результат и только потом передаём сайт.",
a3:"Скоро мы откроем курсы по веб-разработке. Следите за новостями в нашем Telegram-канале.",
oh:"Заказать сайт",
op:"На сайте заказ не оформляется, всё происходит в нашем Telegram-боте. Бот принимает заявку, рассказывает об услугах и получает ваш выбор дизайна.",
s1:"Нажмите «Заказать в боте»: бот откроется, а ваш выбор дизайна передастся ему автоматически.",
s2:"Расскажите о своей задаче в боте и оставьте заявку.",
s3:"Мы свяжемся с вами, согласуем сроки и стоимость и начнём работу.",
bot:"Заказать в боте",chan:"Наш канал",
note:"Бот пока настраивается. Заказ через Telegram заработает совсем скоро."
};
const COL={mint:["#3ddc97","#06210f"],blue:["#2563eb","#fff"],orange:["#ea580c","#fff"],pink:["#db2777","#fff"],violet:["#7c3aed","#fff"]};
const PV={
card:{uz:["Xizmatlar, narxlar va aloqa bir sahifada","Bog‘lanish","Xizmatlar","Ishlarimiz","Aloqa"],ru:["Услуги, цены и контакты на одной странице","Связаться","Услуги","Работы","Контакты"]},
shop:{uz:["Mahsulotlar katalogi va savatcha","Xarid qilish","Mahsulot 1","Mahsulot 2","Mahsulot 3"],ru:["Каталог товаров и корзина","Купить","Товар 1","Товар 2","Товар 3"]},
land:{uz:["Bitta sahifa: taklif, afzalliklar va ariza","Ariza qoldirish","Afzallik 1","Afzallik 2","Afzallik 3"],ru:["Одна страница: предложение, преимущества и заявка","Оставить заявку","Преимущество 1","Преимущество 2","Преимущество 3"]}
};
const BOT="YOUR_BOT_USERNAME"; // botingizning username'i, @ belgisiz
const TITLE=document.title;
let lang="uz",color="mint";

$$("[data-t]").forEach(e=>e.dataset.uz=e.textContent);
Object.keys(COL).forEach(k=>{
  const b=document.createElement("button");
  b.style.background=COL[k][0];b.dataset.k=k;b.setAttribute("aria-label",k);
  b.onclick=()=>{color=k;render()};
  $("#sw").append(b);
});
["type","style","bg"].forEach(id=>$("#"+id).onchange=render);
$("#name").oninput=render;
$("#bUz").onclick=()=>setLang("uz");
$("#bRu").onclick=()=>setLang("ru");

function render(){
  const s={type:$("#type").value,style:$("#style").value,bg:$("#bg").value};
  const p=PV[s.type][lang],pv=$("#pv"),c=COL[color];
  const name=$("#name").value.trim()||(lang==="ru"?"Ваш бизнес":"Sizning biznesingiz");
  pv.style.setProperty("--c",c[0]);pv.style.setProperty("--cb",c[1]);
  pv.dataset.type=s.type;pv.dataset.style=s.style;pv.dataset.bg=s.bg;
  $("#pvName").textContent=name;$("#pvTitle").textContent=name;
  $("#pvSub").textContent=p[0];$("#pvBtn").textContent=p[1];
  $$(".pv-cards div").forEach((d,i)=>d.textContent=p[i+2]);
  $$("#sw button").forEach(b=>b.classList.toggle("on",b.dataset.k===color));
  $("#botBtn").href=`https://t.me/${BOT}?start=${s.type}_${color}_${s.style}_${s.bg}`;
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
