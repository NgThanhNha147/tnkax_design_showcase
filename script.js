const state={products:[],categories:[],active:"Tất cả"};
const sections=document.querySelector("#category-sections"),filters=document.querySelector("#filters"),empty=document.querySelector("#empty");
const escapeHtml=value=>String(value??"").replace(/[&<>"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
const config=window.TNKAX_SUPABASE||{};
const configured=config.url&&!config.url.startsWith("YOUR_")&&config.anonKey&&!config.anonKey.startsWith("YOUR_");
const db=configured?window.supabase.createClient(config.url,config.anonKey):null;
const loaderStarted=Date.now();let windowReady=document.readyState==="complete",dataReady=false,loaderHidden=false;
function finishLoading(force=false){if(loaderHidden||(!force&&(!windowReady||!dataReady)))return;loaderHidden=true;const wait=Math.max(0,1200-(Date.now()-loaderStarted));setTimeout(()=>{document.querySelector("#page-loader")?.classList.add("is-hidden");document.body.classList.remove("page-loading")},wait)}
window.addEventListener("load",()=>{windowReady=true;finishLoading()},{once:true});setTimeout(()=>finishLoading(true),5000);
async function load(){if(!db){sections.innerHTML='<div class="empty">Website chưa được kết nối Supabase. Hãy cập nhật <code>supabase-config.js</code>.</div>';return}try{const[categoryResult,productResult]=await Promise.all([db.from("categories").select("*").order("sort_order"),db.from("products").select("*,categories(name)").order("created_at",{ascending:false})]);if(categoryResult.error)throw categoryResult.error;if(productResult.error)throw productResult.error;state.categories=categoryResult.data;state.products=productResult.data.map(item=>({id:item.id,title:item.title,category:item.categories?.name||"Khác",description:item.description,image:item.image_url,views:item.views||0,sortOrder:item.sort_order||0,createdAt:item.created_at})).sort((a,b)=>(a.sortOrder||999999)-(b.sortOrder||999999)||b.createdAt.localeCompare(a.createdAt));render()}catch(error){sections.innerHTML=`<div class="empty">${escapeHtml(error.message)}</div>`}}
function render(){renderFilters();renderSections()}function renderFilters(){filters.innerHTML=["Tất cả",...state.categories.map(item=>item.name)].map(name=>`<button class="${state.active===name?"active":""}" data-category="${escapeHtml(name)}">${escapeHtml(name)}</button>`).join("")}function card(item){return `<article class="product-card"><button class="thumb" data-id="${item.id}"><img src="${escapeHtml(item.image)}" alt="Mẫu thiết kế ${escapeHtml(item.category)}" loading="lazy"></button><div class="product-meta"><span>◉ ${Number(item.views).toLocaleString("vi-VN")}</span></div></article>`}
function renderSections(){const names=state.active==="Tất cả"?state.categories.map(item=>item.name):[state.active];sections.innerHTML="";let total=0;names.forEach((name,index)=>{const category=state.categories.find(item=>item.name===name),items=state.products.filter(item=>item.category===name);if(!items.length)return;total+=items.length;const heading=category?.header_image_url?`<div class="category-custom-header"><img src="${escapeHtml(category.header_image_url)}" alt="${escapeHtml(name)}"></div>`:`<div class="category-ribbon"><span>${String(index+1).padStart(2,"0")}</span><h3>${escapeHtml(name)}</h3><i>♡</i></div>`;const action=items.length>8?'<div class="grid-action"><button class="section-toggle" aria-label="Xem tất cả"><img src="assets/XEMTATCA.png" alt="Xem tất cả"></button></div>':"";const section=document.createElement("section");section.className="category-block";section.dataset.expanded="false";section.innerHTML=`${heading}<div class="products-grid">${items.map((item,i)=>`<div class="product-slot ${i>=8?"extra":""}">${card(item)}</div>`).join("")}${action}</div>`;sections.appendChild(section)});empty.hidden=total>0}
filters.addEventListener("click",event=>{const button=event.target.closest("[data-category]");if(!button)return;state.active=button.dataset.category;render();document.querySelector("#portfolio").scrollIntoView({behavior:"smooth"})});document.querySelectorAll("[data-jump]").forEach(link=>link.addEventListener("click",()=>{state.active=link.dataset.jump;render()}));
sections.addEventListener("click",event=>{const toggle=event.target.closest(".section-toggle");if(toggle){const section=toggle.closest(".category-block"),expanded=section.dataset.expanded==="true";section.dataset.expanded=String(!expanded);toggle.classList.toggle("is-collapse",!expanded);toggle.innerHTML=expanded?'<img src="assets/XEMTATCA.png" alt="Xem tất cả">':'<img src="assets/THUGON.png" alt="Thu gọn">';if(expanded)section.scrollIntoView({behavior:"smooth",block:"start"});return}const button=event.target.closest("[data-id]");if(!button)return;const item=state.products.find(product=>product.id===button.dataset.id);if(!item)return;document.querySelector("#modal-image").src=item.image;document.querySelector("#modal-title").textContent=item.title;document.querySelector("#modal-category").textContent=item.category;document.querySelector("#modal-description").textContent=item.description||"Liên hệ để đặt thiết kế theo phong cách mẫu này.";document.querySelector("#modal").classList.add("open");document.body.classList.add("locked");db.rpc("increment_product_views",{product_id:item.id}).then(()=>{})});document.addEventListener("click",event=>{if(event.target.closest("[data-close]")){document.querySelector("#modal").classList.remove("open");document.body.classList.remove("locked")}});document.addEventListener("keydown",event=>{if(event.key==="Escape"){document.querySelector("#modal").classList.remove("open");document.body.classList.remove("locked")}});load().finally(()=>{dataReady=true;finishLoading()});

const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer=window.matchMedia("(pointer: fine)").matches;
const progressBar=document.querySelector("#scroll-progress");
const cursorGlow=document.querySelector("#cursor-glow");
const adobeBackground=document.querySelector(".adobe-background");

function updateScrollEffects(){
  const max=document.documentElement.scrollHeight-window.innerHeight;
  const progress=max>0?window.scrollY/max:0;
  if(progressBar)progressBar.style.transform=`scaleX(${progress})`;
  document.documentElement.style.setProperty("--scroll-shift",`${Math.min(window.scrollY*.035,34)}px`);
}
window.addEventListener("scroll",updateScrollEffects,{passive:true});
updateScrollEffects();

const revealObserver="IntersectionObserver" in window?new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-revealed");revealObserver.unobserve(entry.target)}});
},{threshold:.08,rootMargin:"0px 0px -30px"}):null;
function observeReveals(root=document){
  root.querySelectorAll(".banner-image,.pricing,.category-block,.footer-brand,.footer-contacts").forEach(element=>{
    if(element.dataset.revealReady)return;
    element.dataset.revealReady="true";
    element.classList.add("reveal-item");
    if(revealObserver)revealObserver.observe(element);else element.classList.add("is-revealed");
  });
}
observeReveals();
new MutationObserver(mutations=>mutations.forEach(mutation=>mutation.addedNodes.forEach(node=>{
  if(node.nodeType===1){if(node.matches?.(".category-block")){node.classList.add("reveal-item");revealObserver?.observe(node)}observeReveals(node)}
}))).observe(sections,{childList:true,subtree:true});

if(!reducedMotion){
  const petalField=document.querySelector("#petal-field");
  const petalCount=window.innerWidth<620?18:34;
  for(let index=0;index<petalCount;index+=1){
    const petal=document.createElement("i");
    petal.className=`falling-petal petal-${index%4}`;
    petal.style.setProperty("--petal-left",`${Math.random()*100}vw`);
    petal.style.setProperty("--petal-size",`${8+Math.random()*12}px`);
    petal.style.setProperty("--petal-duration",`${8+Math.random()*10}s`);
    petal.style.setProperty("--petal-delay",`${Math.random()*-18}s`);
    petal.style.setProperty("--petal-drift",`${-90+Math.random()*180}px`);
    petal.style.setProperty("--petal-spin",`${240+Math.random()*520}deg`);
    petalField?.appendChild(petal);
  }
}

let lastSparkle=0;
if(finePointer&&!reducedMotion){
  window.addEventListener("pointermove",event=>{
    cursorGlow?.style.setProperty("--cursor-x",`${event.clientX}px`);
    cursorGlow?.style.setProperty("--cursor-y",`${event.clientY}px`);
    if(adobeBackground){
      const x=(event.clientX/window.innerWidth-.5)*-12;
      const y=(event.clientY/window.innerHeight-.5)*-12;
      adobeBackground.style.translate=`${x}px ${y}px`;
    }
    const card=event.target.closest?.(".product-card");
    if(card){
      const rect=card.getBoundingClientRect();
      const rotateY=((event.clientX-rect.left)/rect.width-.5)*8;
      const rotateX=((event.clientY-rect.top)/rect.height-.5)*-8;
      card.style.setProperty("--tilt-x",`${rotateX}deg`);
      card.style.setProperty("--tilt-y",`${rotateY}deg`);
    }
    if(Date.now()-lastSparkle>75){
      lastSparkle=Date.now();
      const sparkle=document.createElement("span");
      sparkle.className="cursor-sparkle";
      sparkle.textContent=Math.random()>.45?"✦":"♡";
      sparkle.style.left=`${event.clientX}px`;
      sparkle.style.top=`${event.clientY}px`;
      document.body.appendChild(sparkle);
      sparkle.addEventListener("animationend",()=>sparkle.remove(),{once:true});
    }
  },{passive:true});
  document.addEventListener("pointerout",event=>{
    const card=event.target.closest?.(".product-card");
    if(card&&!card.contains(event.relatedTarget)){card.style.removeProperty("--tilt-x");card.style.removeProperty("--tilt-y")}
  });
}
