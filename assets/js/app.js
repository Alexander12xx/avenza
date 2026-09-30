(function(){
"use strict";

var $  = function(s,c){ return (c||document).querySelector(s); };
var $$ = function(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); };
var WA = window.WA, MAIL = window.MAIL, IMG = window.IMG, VID = window.VID;
var DESTINATIONS = window.DESTINATIONS, PACKAGES = window.PACKAGES, VIDEOS = window.VIDEOS;
var GALLERY = window.GALLERY, TESTIMONIALS = window.TESTIMONIALS, FAQS = window.FAQS;
var OPTS = window.OPTS;

var fsRegistry = [];
var fieldValue = {};
var lbIndex = 0, vmIndex = 0;
var openModals = [];

function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){
  return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }

function toast(msg, kind){
  var host = $("#toasts"); if(!host) return;
  var t = document.createElement("div");
  t.className = "toast" + (kind ? " "+kind : "");
  t.innerHTML = '<i class="fa-solid ' + (kind==="ok"?"fa-circle-check":kind==="warn"?"fa-triangle-exclamation":"fa-circle-info") + '"></i><span>' + esc(msg) + "</span>";
  host.appendChild(t);
  setTimeout(function(){ t.style.transition="opacity .35s,transform .35s"; t.style.opacity="0"; t.style.transform="translateY(10px)";
    setTimeout(function(){ t.remove(); }, 400); }, 4200);
}

/* ---------- FLEX SELECT ---------- */
function buildFlexSelect(host){
  var field  = host.getAttribute("data-field") || host.getAttribute("data-name");
  var ph     = host.getAttribute("data-placeholder") || "Select or type your own";
  var opts   = OPTS[field] || [];
  var id     = "fs-" + field + "-" + fsRegistry.length;
  var req    = host.hasAttribute("required");

  host.innerHTML =
    '<button type="button" class="fs-trigger" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="' + id + '-lbl">' +
      '<span class="val ph" id="' + id + '-lbl">' + esc(ph) + "</span><i class=\"fa-solid fa-chevron-down\"></i>" +
    "</button>" +
    '<div class="fs-panel" role="dialog" aria-label="' + esc(ph) + '">' +
      '<input type="text" class="fs-search" placeholder="Type to search, or write your own..." aria-label="Search options">' +
      '<div class="fs-options" role="listbox"></div>' +
      '<div class="fs-foot">' +
        '<button type="button" class="fs-toggle"><i class="fa-solid fa-pen"></i> Something else? Write it here</button>' +
        '<input type="text" class="fs-free" placeholder="Type your own answer...">' +
      "</div>" +
    "</div>" +
    '<input type="hidden" class="fs-val" value="">';

  var trigger = $(".fs-trigger", host), panel = $(".fs-panel", host),
      search = $(".fs-search", host), list = $(".fs-options", host),
      toggle = $(".fs-toggle", host), free = $(".fs-free", host),
      hidden = $(".fs-val", host), val = $(".val", host);

  function optionsHTML(filter){
    filter = (filter||"").toLowerCase().trim();
    var out = "", shown = 0, i;
    for(i=0;i<opts.length;i++){
      var o = opts[i];
      if(filter && o.toLowerCase().indexOf(filter) === -1) continue;
      shown++;
      out += '<button type="button" class="fs-option" role="option" data-value="' + esc(o) + '"><i class="fa-solid fa-check"></i><span>' + esc(o) + "</span></button>";
    }
    if(filter && shown === 0){
      out = '<div class="fs-empty">No match. Press <b>Enter</b> to use <b>' + esc(filter) + "</b></div>";
    }
    return out;
  }
  function render(filter){
    list.innerHTML = optionsHTML(filter);
    var sel = hidden.value;
    $$(".fs-option", list).forEach(function(b){
      b.classList.toggle("sel", b.getAttribute("data-value") === sel);
    });
  }
  function setValue(v, silent){
    hidden.value = v;
    val.textContent = v || ph;
    val.classList.toggle("ph", !v);
    fieldValue[field] = v;
    if(!silent) close();
    var err = document.querySelector('.errmsg[data-for="' + field + '"]');
    if(err && v) err.classList.remove("show");
  }
  function open(){
    closeAllFs();
    host.classList.add("open");
    trigger.setAttribute("aria-expanded","true");
    render(search.value);
    search.value = "";
    setTimeout(function(){ try{ search.focus(); }catch(e){} }, 30);
    positionUp();
  }
  function close(){
    host.classList.remove("open");
    trigger.setAttribute("aria-expanded","false");
    free.classList.remove("show");
    toggle.innerHTML = '<i class="fa-solid fa-pen"></i> Something else? Write it here';
  }
  function positionUp(){
    var r = trigger.getBoundingClientRect();
    if(r.bottom > window.innerHeight - 200 && r.top > 300) panel.style.top = "auto";
  }

  trigger.addEventListener("click", function(e){
    e.stopPropagation();
    host.classList.contains("open") ? close() : open();
  });
  search.addEventListener("input", function(){ render(search.value); });
  search.addEventListener("keydown", function(e){
    if(e.key === "Enter"){
      e.preventDefault();
      var v = search.value.trim();
      if(v){ setValue(v); }
      else {
        var first = $(".fs-option", list);
        if(first) setValue(first.getAttribute("data-value"));
      }
    }
  });
  list.addEventListener("click", function(e){
    var b = e.target.closest(".fs-option"); if(!b) return;
    setValue(b.getAttribute("data-value"));
  });
  toggle.addEventListener("click", function(){
    var on = free.classList.toggle("show");
    toggle.innerHTML = on ? '<i class="fa-solid fa-xmark"></i> Cancel custom answer' : '<i class="fa-solid fa-pen"></i> Something else? Write it here';
    if(on) setTimeout(function(){ free.focus(); }, 30);
  });
  free.addEventListener("input", function(){ if(free.value.trim()) setValue(free.value.trim(), true); });
  free.addEventListener("keydown", function(e){ if(e.key==="Enter"){ e.preventDefault(); setValue(free.value.trim()); } });
  host.addEventListener("click", function(e){ e.stopPropagation(); });

  var api = { host:host, field:field, get:function(){ return hidden.value; }, set:setValue, isOpen:function(){ return host.classList.contains("open"); }, close:close };
  fsRegistry.push(api);
  fieldValue[field] = "";
  if(req) host.setAttribute("data-required","1");
  return api;
}
function closeAllFs(){ fsRegistry.forEach(function(f){ if(f.isOpen()) f.close(); }); }

function initFlexSelects(){ $$(".fs").forEach(buildFlexSelect); }
function fsByField(f){ for(var i=0;i<fsRegistry.length;i++){ if(fsRegistry[i].field === f) return fsRegistry[i]; } return null; }

/* ---------- MODALS ---------- */
function openModal(id){
  var m = document.getElementById(id); if(!m) return;
  if(openModals.indexOf(id) === -1) openModals.push(id);
  m.classList.add("open");
  document.body.classList.add("no-scroll");
  var f = m.querySelector("input,textarea,button");
  setTimeout(function(){ try{ f && f.focus({preventScroll:true}); }catch(e){} }, 60);
}
function closeModal(id){
  var m = document.getElementById(id); if(!m) return;
  m.classList.remove("open");
  openModals = openModals.filter(function(x){ return x !== id; });
  if(!openModals.length) document.body.classList.remove("no-scroll");
  if(id === "videoModal"){ var v = $("#vmVideo"); if(v){ v.pause(); v.removeAttribute("src"); v.load(); } }
}
function closeAllModals(){ openModals.slice().forEach(closeModal); }

/* ---------- HERO SLIDER ---------- */
function initHero(){
  var slides = $$(".hero-slide"), dots = $("#dots"), no = $("#slideNo"), cur = 0, timer;
  slides.forEach(function(s,i){
    var b = document.createElement("button");
    b.type = "button"; b.className = "dot" + (i===0?" active":""); b.setAttribute("aria-label","Go to slide " + (i+1));
    b.addEventListener("click", function(){ go(i); restart(); });
    dots.appendChild(b);
  });
  var dotEls = $$(".dot", dots);
  function go(n){
    cur = (n + slides.length) % slides.length;
    slides.forEach(function(s,i){ s.classList.toggle("active", i===cur); });
    dotEls.forEach(function(d,i){ d.classList.toggle("active", i===cur); });
    no.textContent = String(cur+1).padStart(2,"0");
  }
  function restart(){ clearInterval(timer); timer = setInterval(function(){ go(cur+1); }, 6500); }
  $("#heroNext").addEventListener("click", function(){ go(cur+1); restart(); });
  $("#heroPrev").addEventListener("click", function(){ go(cur-1); restart(); });
  var hero = $(".hero");
  hero.addEventListener("mouseenter", function(){ clearInterval(timer); });
  hero.addEventListener("mouseleave", restart);
  var sx = null;
  hero.addEventListener("touchstart", function(e){ sx = e.touches[0].clientX; }, {passive:true});
  hero.addEventListener("touchend", function(e){
    if(sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    if(Math.abs(dx) > 45){ dx < 0 ? go(cur+1) : go(cur-1); restart(); }
    sx = null;
  });
  restart();
}

/* ---------- RENDER: DESTINATIONS ---------- */
function renderDest(filter){
  var grid = $("#destGrid");
  var list = DESTINATIONS.filter(function(d){ return filter === "all" || d.cat === filter; });
  if(!list.length){ grid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-map-location-dot"></i>No destinations in this group yet.</div>'; return; }
  grid.innerHTML = list.map(function(d){
    return '<button type="button" class="dest-card' + (d.wide?" wide":"") + (d.tall?" tall":"") + '" data-dest="' + esc(d.id) + '">' +
      '<img src="' + IMG + esc(d.img) + '" alt="' + esc(d.name + ", " + d.country) + '" loading="lazy" data-fb="' + esc(d.name) + '">' +
      '<div class="dest-info"><small>' + esc(d.country) + "</small><h3>" + esc(d.name) + "</h3><p>" + esc(d.lead) + "</p>" +
      '<span class="go">Explore <i class="fa-solid fa-arrow-right"></i></span></div></button>';
  }).join("");
}

/* ---------- RENDER: PACKAGES ---------- */
function renderPkg(filter, searchTerm){
  var grid = $("#pkgGrid"), q = (searchTerm||"").toLowerCase().trim();
  var list = PACKAGES.filter(function(p){
    var okF = filter === "all" || p.cat === filter || (filter === "City & Culture" && p.cat === "City & Culture");
    var okQ = !q || (p.title + " " + p.cat + " " + p.place + " " + p.blurb + " " + p.flag).toLowerCase().indexOf(q) !== -1;
    return okF && okQ;
  });
  $("#pkgCount").textContent = q
    ? list.length + " tour" + (list.length===1?"":"s") + ' matching "' + q + '".'
    : "Showing " + list.length + " of " + PACKAGES.length + " sample tours. Every one can be adjusted to your dates, pace and budget.";
  if(!list.length){
    grid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-magnifying-glass"></i><b>No exact match.</b><br>We plan plenty of custom trips - tell us what you had in mind.' +
      '<div class="mt20"><button type="button" class="btn btn-dark" data-open="booking">Ask us to build it</button></div></div>';
    return;
  }
  grid.innerHTML = list.map(function(p){
    return '<article class="package">' +
      '<div class="package-img">' +
        '<img src="' + IMG + esc(p.img) + '" alt="' + esc(p.title) + '" loading="lazy" data-fb="' + esc(p.title) + '">' +
        '<span class="package-tag">' + esc(p.cat) + "</span>" +
        '<span class="package-flag">' + esc(p.flag) + "</span>" +
        '<div class="package-badge"><span>' + esc(p.place) + "</span><span><i class=\"fa-solid fa-star\"></i> 4.9</span></div>" +
      "</div>" +
      '<div class="package-body">' +
        "<h3>" + esc(p.title) + "</h3><p>" + esc(p.blurb) + "</p>" +
        '<div class="package-meta"><span><i class="fa-regular fa-clock"></i>' + esc(p.days) + "</span>" +
        '<span><i class="fa-solid fa-location-dot"></i>' + esc(p.place) + "</span>" +
        '<span class="stars"><i class="fa-solid fa-star"></i> 4.9</span></div>' +
        '<div class="price-row"><div class="price"><small>From per person</small><strong>US$' + p.from.toLocaleString("en-US") + "</strong><em>" + esc(p.kes) + "</em></div>" +
        '<div class="price" style="text-align:right"><small>Trip length</small><strong style="font-size:15px">' + esc(p.days) + "</strong></div></div>" +
        '<div class="package-actions">' +
          '<button type="button" class="btn btn-dark btn-sm" data-pkg="' + esc(p.id) + '">View details</button>' +
          '<button type="button" class="btn btn-outline-dark btn-sm" data-enquire="' + esc(p.id) + '">Enquire</button>' +
        "</div>" +
      "</div></article>";
  }).join("");
}

/* ---------- RENDER: VIDEOS ---------- */
function renderVideos(){
  $("#videoGrid").innerHTML = VIDEOS.map(function(v,i){
    return '<button type="button" class="vcard" data-vid="' + i + '">' +
      '<img src="' + IMG + esc(v.poster) + '" alt="' + esc(v.title) + '" loading="lazy" data-fb="Video">' +
      '<span class="vdur">' + esc(v.dur) + "</span>" +
      '<span class="vplay"><i class="fa-solid fa-play"></i></span>' +
      '<span class="vbody"><span>' + esc(v.place) + "</span><b>" + esc(v.title) + "</b></span></button>";
  }).join("");
}

/* ---------- RENDER: GALLERY ---------- */
function renderGallery(filter){
  var grid = $("#galGrid");
  var list = GALLERY.filter(function(g){ return filter === "all" || g.cat === filter; });
  grid.innerHTML = list.map(function(g){
    return '<button type="button" class="gitem' + (g.big?" big":"") + (g.wide?" wide":"") + '" data-gal="' + esc(g.img) + '">' +
      '<img src="' + IMG + esc(g.img) + '" alt="' + esc(g.title) + '" loading="lazy" data-fb="' + esc(g.place) + '">' +
      '<span class="gzoom"><i class="fa-solid fa-expand"></i></span>' +
      '<span class="gcap"><span>' + esc(g.place) + "</span><b>" + esc(g.title) + "</b></span></button>";
  }).join("");
  if(!list.length) grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="fa-solid fa-images"></i>Nothing in this album yet.</div>';
}

/* ---------- RENDER: FAQ ---------- */
function renderFaq(){
  $("#faqList").innerHTML = FAQS.map(function(f,i){
    return '<div class="faq-item">' +
      '<button type="button" class="faq-q" aria-expanded="false">' + esc(f.q) + '<i class="fa-solid fa-chevron-down"></i></button>' +
      '<div class="faq-a" style="max-height:0"><p>' + esc(f.a) + "</p></div></div>";
  }).join("");
}

/* ---------- DETAIL MODALS ---------- */
function showDestination(id){
  var d = null;
  DESTINATIONS.forEach(function(x){ if(x.id === id) d = x; });
  if(!d) return;
  $("#infoContent").innerHTML =
    '<div class="modal-hero"><img src="' + IMG + esc(d.img) + '" alt="' + esc(d.name) + '" data-fb="' + esc(d.name) + '">' +
      '<div class="mh-bd"><div><p>' + esc(d.country) + "</p><h3>" + esc(d.name) + "</h3></div></div></div>" +
    '<div class="modal-body">' +
      '<p class="m-sub">' + esc(d.lead) + "</p>" +
      '<div class="info-grid">' +
        "<div><small>Best time to visit</small><b>" + esc(d.best) + "</b></div>" +
        "<div><small>Recommended stay</small><b>" + esc(d.ideal) + "</b></div>" +
        "<div><small>From per person</small><b>" + esc(d.from) + "</b></div>" +
        "<div><small>Region</small><b>" + esc(d.country) + "</b></div>" +
      "</div>" +
      '<h4 class="m-title" style="font-size:20px;margin:24px 0 8px">Why travellers go</h4>' +
      '<ul class="hl-list">' + d.high.map(function(h){ return "<li><i class=\"fa-solid fa-check\"></i><span>" + esc(h) + "</span></li>"; }).join("") + "</ul>" +
      '<div class="modal-foot">' +
        '<button type="button" class="btn btn-dark" data-open="booking" data-close-modal data-preset-dest="' + esc(d.name) + '">Plan this trip <i class="fa-solid fa-arrow-right"></i></button>' +
        '<button type="button" class="btn btn-wa" data-wa="' + esc("Hi Avenza Tours, I would like to plan a trip to " + d.name + ".") + '"><i class="fa-brands fa-whatsapp"></i> Ask on WhatsApp</button>' +
        '<button type="button" class="btn btn-outline-dark" data-close-modal>Keep browsing</button>' +
      "</div>" +
    "</div>";
  openModal("infoModal");
}

function showPackage(id){
  var p = null;
  PACKAGES.forEach(function(x){ if(x.id === id) p = x; });
  if(!p) return;
  var days = p.itin.map(function(d){ return '<li><div><b>' + esc(d[0]) + "</b>" + esc(d[1]) + "</div></li>"; }).join("");
  $("#infoContent").innerHTML =
    '<div class="modal-hero"><img src="' + IMG + esc(p.img) + '" alt="' + esc(p.title) + '" data-fb="' + esc(p.title) + '">' +
      '<div class="mh-bd"><div><p>' + esc(p.flag) + " - " + esc(p.days) + "</p><h3>" + esc(p.title) + "</h3></div></div></div>" +
    '<div class="modal-body">' +
      '<p class="m-sub">' + esc(p.blurb) + "</p>" +
      '<div class="info-grid">' +
        "<div><small>Duration</small><b>" + esc(p.days) + "</b></div>" +
        "<div><small>Style</small><b>" + esc(p.cat) + "</b></div>" +
        "<div><small>From per person</small><b>US$" + p.from.toLocaleString("en-US") + "</b></div>" +
        "<div><small>Shillings</small><b>" + esc(p.kes) + "</b></div>" +
      "</div>" +
      '<h4 class="m-title" style="font-size:20px;margin:24px 0 8px">What is included</h4>' +
      '<ul class="hl-list">' + p.incl.map(function(h){ return "<li><i class=\"fa-solid fa-check\"></i><span>" + esc(h) + "</span></li>"; }).join("") + "</ul>" +
      '<h4 class="m-title" style="font-size:20px;margin:26px 0 8px">Sample day-by-day</h4>' +
      '<ul class="day-list">' + days + "</ul>" +
      '<p class="form-note mt20">This is a sample itinerary. Dates, lodge standard, vehicle type, meals and activities can all be adjusted - many travellers extend or shorten it.</p>' +
      '<div class="modal-foot">' +
        '<button type="button" class="btn btn-dark" data-open="booking" data-close-modal data-preset-pkg="' + esc(p.id) + '">Request this tour <i class="fa-solid fa-arrow-right"></i></button>' +
        '<button type="button" class="btn btn-wa" data-wa="' + esc("Hi Avenza Tours, I am interested in the " + p.title + " tour.") + '"><i class="fa-brands fa-whatsapp"></i> Ask on WhatsApp</button>' +
        '<button type="button" class="btn btn-outline-dark" data-close-modal>Keep browsing</button>' +
      "</div>" +
    "</div>";
  openModal("infoModal");
}

/* ---------- VIDEO MODAL ---------- */
function showVideo(i){
  if(i < 0 || i >= VIDEOS.length) return;
  vmIndex = i;
  var v = VIDEOS[i], el = $("#vmVideo");
  el.src = VID + v.src;
  el.poster = IMG + v.poster;
  $("#vmTitle").textContent = v.title;
  $("#vmEnquire").setAttribute("data-preset-video", v.title);
  openModal("videoModal");
  var p = el.play();
  if(p && p.catch) p.catch(function(){ toast("Press the play control to start the clip.","warn"); });
}
$("#vmNext") && $("#vmNext").addEventListener("click", function(){ showVideo((vmIndex+1) % VIDEOS.length); });
$("#vmMute") && $("#vmMute").addEventListener("click", function(){
  var el = $("#vmVideo"); el.muted = !el.muted;
  this.innerHTML = '<i class="fa-solid ' + (el.muted ? "fa-volume-xmark" : "fa-volume-high") + '"></i>';
});

/* ---------- LIGHTBOX ---------- */
function showLightbox(src){
  var list = GALLERY.filter(function(g){ return filterActive(g); });
  lbIndex = list.map(function(g){ return g.img; }).indexOf(src);
  if(lbIndex < 0) lbIndex = 0;
  stepLightbox(0);
  openModal("lightbox");
}
var galFilter = "all";
function filterActive(g){ return galFilter === "all" || g.cat === galFilter; }
function stepLightbox(d){
  var list = GALLERY.filter(filterActive);
  if(!list.length) return;
  lbIndex = (lbIndex + d + list.length) % list.length;
  var g = list[lbIndex];
  $("#lbImg").src = IMG + g.img;
  $("#lbImg").alt = g.title;
  $("#lbCap").innerHTML = "<b>" + esc(g.title) + "</b><span>" + esc(g.place) + " - " + esc(g.cat) + " - " + (lbIndex+1) + " of " + list.length + "</span>";
}

/* ---------- HERO VIDEO ---------- */
function initHeroVideo(){
  var v = $("#heroVideo"), frame = $("#heroVideoFrame"), btn = $("#heroPlay");
  if(!v) return;
  btn.addEventListener("click", function(){
    if(v.paused){
      v.muted = false;
      var p = v.play();
      if(p && p.catch) p.catch(function(){
        v.muted = true;
        var p2 = v.play();
        if(p2 && p2.catch) p2.catch(function(){ toast("Your browser blocked playback. Open the clip from the library below.","warn"); });
      });
    } else { v.pause(); }
  });
  v.addEventListener("play",  function(){ frame.classList.add("playing"); btn.innerHTML = '<i class="fa-solid fa-pause"></i>'; });
  v.addEventListener("pause", function(){ frame.classList.remove("playing"); btn.innerHTML = '<i class="fa-solid fa-play"></i>'; });
  v.addEventListener("error", function(){
    frame.classList.remove("playing");
    toast("That clip could not be loaded. Try another from the library.","warn");
    showVideo(0);
  });
}

/* ---------- REVEAL + COUNTERS ---------- */
function initObservers(){
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold:.12, rootMargin:"0px 0px -40px 0px" });
  $$(".reveal").forEach(function(el){ io.observe(el); });

  var co = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      var el = e.target, target = +el.getAttribute("data-target"), t0 = null;
      function tick(ts){
        if(!t0) t0 = ts;
        var p = Math.min((ts - t0) / 1500, 1);
        el.textContent = Math.floor(target * (1 - Math.pow(1-p,3))).toLocaleString("en-US") + (p===1 ? "+" : "");
        if(p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      co.unobserve(el);
    });
  }, { threshold:.5 });
  $$(".counter").forEach(function(el){ co.observe(el); });
}

/* ---------- TESTIMONIALS ---------- */
function initTestimonials(){
  var t = 0, timer;
  var txt = $("#testiText"), per = $("#testiPerson"), dots = $("#testiDots");
  TESTIMONIALS.forEach(function(_,i){
    var b = document.createElement("button");
    b.type = "button"; b.setAttribute("aria-label","Testimonial " + (i+1));
    b.addEventListener("click", function(){ show(i); restart(); });
    dots.appendChild(b);
  });
  function show(i){
    t = (i + TESTIMONIALS.length) % TESTIMONIALS.length;
    txt.style.opacity = "0"; txt.style.transform = "translateY(10px)";
    setTimeout(function(){
      txt.textContent = "\u201C" + TESTIMONIALS[t].q + "\u201D";
      per.innerHTML = "<b>" + esc(TESTIMONIALS[t].n) + "</b>" + esc(TESTIMONIALS[t].r);
      txt.style.opacity = "1"; txt.style.transform = "none";
    }, 220);
    $$("button", dots).forEach(function(d,i){ d.classList.toggle("on", i===t); });
  }
  function restart(){ clearInterval(timer); timer = setInterval(function(){ show(t+1); }, 7000); }
  $("#testiPrev").addEventListener("click", function(){ show(t-1); restart(); });
  $("#testiNext").addEventListener("click", function(){ show(t+1); restart(); });
  var wrap = $(".testi-wrap");
  wrap.addEventListener("mouseenter", function(){ clearInterval(timer); });
  wrap.addEventListener("mouseleave", restart);
  show(0); restart();
}

/* ---------- QUICK SEARCH ---------- */
function initQuickSearch(){
  var form = $("#quickSearch");
  form.addEventListener("submit", function(e){
    e.preventDefault();
    var dest = (fsByField("destination") && fsByField("destination").get()) || "";
    var style = (fsByField("style") && fsByField("style").get()) || "";
    var month = (fsByField("month") && fsByField("month").get()) || "";
    var trav  = (fsByField("travellers") && fsByField("travellers").get()) || "";

    var chips = $$("#pkgFilter .chip");
    chips.forEach(function(c){ c.classList.remove("on"); });
    var match = null;
    PACKAGES.forEach(function(p){
      var hay = (p.title + " " + p.place + " " + p.cat + " " + p.flag).toLowerCase();
      if(style && p.cat.toLowerCase() === style.toLowerCase()) { match = match || p.cat; }
      if(dest && hay.indexOf(dest.toLowerCase()) !== -1) { match = match || p.cat; }
    });
    if(match){ $$("#pkgFilter .chip").forEach(function(c){ if(c.getAttribute("data-f") === match) c.classList.add("on"); }); renderPkg(match, ""); }
    else { renderPkg("all", dest || ""); }

    document.getElementById("packages").scrollIntoView({ behavior:"smooth", block:"start" });
    var bits = [];
    if(dest) bits.push("destination: " + dest);
    if(style) bits.push("style: " + style);
    if(month) bits.push("month: " + month);
    if(trav) bits.push("travellers: " + trav);
    setTimeout(function(){
      toast(bits.length ? "Showing tours for your search - " + bits.join(" | ") : "Showing all sample tours.", "ok");
      if(dest || style){ var m = fsByField("mdestination"); if(m && !m.get()) m.set(dest); }
    }, 500);
  });
}

/* ---------- SUBMIT ---------- */
function buildMessage(d){
  var L = [];
  L.push("Hello Avenza Tours & Travel, I would like to plan a trip.");
  L.push("");
  if(d.name)  L.push("*Name:* " + d.name);
  if(d.email) L.push("*Email:* " + d.email);
  if(d.phone) L.push("*Phone/WhatsApp:* " + d.phone);
  L.push("*Destination:* " + (d.destination || "Not yet decided"));
  L.push("*Trip type:* " + (d.tripType || "Not specified"));
  L.push("*Preferred month:* " + (d.month || "Flexible"));
  L.push("*Trip length:* " + (d.duration || "Flexible"));
  L.push("*Travellers:* " + (d.travellers || "1"));
  L.push("*Budget per person:* " + (d.budget || "Please advise"));
  L.push("*Accommodation:* " + (d.stay || "No preference"));
  if(d.airport)  L.push("*Departure:* " + d.airport);
  if(d.country)  L.push("*Country of residence:* " + d.country);
  if(d.source)   L.push("*Heard about us via:* " + d.source);
  if(d.video)    L.push("*Interested in clip:* " + d.video);
  if(d.notes)    L.push("*Details:* " + d.notes);
  L.push("");
  L.push("Sent from the Avenza Tours website.");
  return L.join("\n");
}
function deliver(d, mode, statusEl, msgEl, after){
  var text = encodeURIComponent(buildMessage(d));
  var subject = encodeURIComponent("Travel enquiry - " + (d.name || "Website visitor"));
  var opened = 0;
  if(mode === "WhatsApp" || mode === "Both"){ window.open("https://wa.me/" + WA + "?text=" + text, "_blank"); opened++; }
  if(mode === "Email"    || mode === "Both"){ window.open("mailto:" + MAIL + "?subject=" + subject + "&body=" + text, "_blank"); opened++; }
  if(mode === "Call me"){ window.location.href = "tel:" + WA; }
  var done = function(){
    if(statusEl){
      statusEl.classList.remove("err");
      statusEl.classList.add("show");
      msgEl.textContent = "Thank you" + (d.name ? ", " + d.name.split(" ")[0] : "") + "! Your enquiry is ready to send" +
        (opened ? " - finish sending in the new tab that just opened." : ". We will call you shortly.") +
        " A copy of the details is below so nothing is lost.";
    }
    toast("Enquiry prepared successfully.", "ok");
    if(after) after();
    setTimeout(function(){ if(statusEl) statusEl.classList.remove("show"); }, 12000);
  };
  setTimeout(done, 350);
}

function validEmail(v){ return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()); }

function initMainForm(){
  var form = $("#bookingForm"); if(!form) return;
  var status = $("#formStatus"), msg = $("#formStatusMsg");
  function fail(id, on){ var el = $("#"+id); if(el) el.classList.toggle("err", !!on); var e = document.querySelector('.errmsg[data-for="'+id+'"]'); if(e) e.classList.toggle("show", !!on); }
  form.addEventListener("submit", function(e){
    e.preventDefault();
    var name = $("#fName").value.trim(), email = $("#fEmail").value.trim(), phone = $("#fPhone").value.trim();
    var dest = (fsByField("destination")||{}).get ? fsByField("destination").get() : "";
    var ok = true;
    if(!name){ fail("fName", true); ok = false; } else fail("fName", false);
    if(!validEmail(email)){ fail("fEmail", true); ok = false; } else fail("fEmail", false);
    if(phone.replace(/\D/g,"").length < 7){ fail("fPhone", true); ok = false; } else fail("fPhone", false);
    if(!dest){ var ed = document.querySelector('.errmsg[data-for="destination"]'); if(ed) ed.classList.add("show"); ok = false; }
    if(!ok){ status.classList.add("err"); status.classList.add("show"); msg.textContent = "Please complete the highlighted fields, then send again."; return; }
    status.classList.remove("err");
    var mode = ($('input[name="reply"]:checked')||{}).value || "WhatsApp";
    deliver({
      name:name, email:email, phone:phone, destination:dest,
      tripType:gv("tripType"), month:gv("month"), duration:gv("duration"), travellers:gv("travellers"),
      budget:gv("budget"), stay:gv("stay"), airport:gv("airport"), country:gv("country"),
      notes:$("#fNotes").value.trim()
    }, mode, status, msg, function(){ form.reset(); clearForm(); });
  });
  ["fName","fEmail","fPhone"].forEach(function(id){
    var el = $("#"+id);
    el.addEventListener("input", function(){ if(el.classList.contains("err")) fail(id, false); });
  });
}
function gv(f){ var x = fsByField(f); return x ? x.get() : ""; }
function clearForm(){ fsRegistry.forEach(function(f){ f.set("", true); }); }

function initModalForm(){
  var form = $("#modalForm"); if(!form) return;
  var status = $("#modalStatus"), msg = $("#modalStatusMsg");
  form.addEventListener("submit", function(e){
    e.preventDefault();
    var name = $("#mName").value.trim(), email = $("#mEmail").value.trim(), phone = $("#mPhone").value.trim();
    var dest = gv("mdestination");
    var ok = true;
    if(!name) ok = false;
    if(!validEmail(email)) ok = false;
    if(phone.replace(/\D/g,"").length < 7) ok = false;
    if(!dest) ok = false;
    if(!ok){
      status.classList.add("err","show");
      msg.textContent = "Please fill in your name, a valid email, a phone number and a destination. You can type your own destination if it is not in the list.";
      return;
    }
    status.classList.remove("err");
    var mode = ($('input[name="msend"]:checked')||{}).value || "WhatsApp";
    deliver({
      name:name, email:email, phone:phone, destination:dest,
      tripType:gv("mtripType"), month:gv("mmonth"), duration:gv("mduration"), travellers:gv("mtravellers"),
      budget:gv("mbudget"), stay:gv("mstay"), airport:gv("mairport"), source:gv("msource"),
      notes:$("#mNotes").value.trim()
    }, mode, status, msg, function(){ form.reset(); clearForm(); setTimeout(function(){ closeModal("bookingModal"); }, 1600); });
  });
}

function initNews(){
  var f = $("#newsForm"); if(!f) return;
  f.addEventListener("submit", function(e){
    e.preventDefault();
    var v = $("#newsEmail").value.trim();
    if(!validEmail(v)){ toast("Please enter a valid email address.","warn"); $("#newsEmail").classList.add("err"); return; }
    $("#newsEmail").classList.remove("err");
    window.open("mailto:" + MAIL + "?subject=" + encodeURIComponent("Travel deals signup") +
      "&body=" + encodeURIComponent("Please add " + v + " to the Avenza Tours travel deals list."), "_blank");
    $("#newsEmail").value = "";
    toast("Thanks! We will confirm your subscription by email.","ok");
  });
}

/* ---------- OPEN BOOKING ---------- */
var PRESET_PKG = {};
function openBooking(opts){
  opts = opts || {};
  var hero = $("#bmHeroImg"), kicker = $("#bmKicker"), title = $("#bmTitle");
  if(opts.img){ hero.src = IMG + opts.img; hero.setAttribute("data-fb", opts.title || "Avenza"); }
  kicker.textContent = opts.kicker || "Enquiry";
  title.textContent = opts.title || "Tell us about your trip";
  if(opts.destination){ var d = fsByField("mdestination"); if(d) d.set(opts.destination); }
  if(opts.tripType){ var t = fsByField("mtripType"); if(t && !t.get()) t.set(opts.tripType); }
  openModal("bookingModal");
}

/* ---------- GLOBAL WIRING ---------- */
function initGlobal(){
  document.addEventListener("click", function(e){
    var t = e.target;

    var chip = t.closest && t.closest(".chip");
    if(chip){
      var group = chip.parentElement.id;
      var val = chip.getAttribute("data-f");
      if(group === "destFilter"){
        $$("#destFilter .chip").forEach(function(c){ c.classList.remove("on"); });
        chip.classList.add("on"); renderDest(val); return;
      }
      if(group === "pkgFilter"){
        $$("#pkgFilter .chip").forEach(function(c){ c.classList.remove("on"); });
        chip.classList.add("on"); renderPkg(val, ""); return;
      }
      if(group === "galFilter"){
        $$("#galFilter .chip").forEach(function(c){ c.classList.remove("on"); });
        chip.classList.add("on"); galFilter = val; renderGallery(val); return;
      }
      return;
    }
    var dot = t.closest && t.closest(".dot");
    if(dot) return;

    var dc = t.closest && t.closest("[data-dest]");
    if(dc){ showDestination(dc.getAttribute("data-dest")); return; }

    var pk = t.closest && t.closest("[data-pkg]");
    if(pk){ showPackage(pk.getAttribute("data-pkg")); return; }

    var en = t.closest && t.closest("[data-enquire]");
    if(en){
      var pid = en.getAttribute("data-enquire"), pd = null;
      PACKAGES.forEach(function(x){ if(x.id === pid) pd = x; });
      if(pd) openBooking({ img:pd.img, kicker:pd.flag + " - " + pd.days, title:"Request: " + pd.title, destination:pd.place, tripType:pd.cat });
      return;
    }

    var vd = t.closest && t.closest("[data-vid]");
    if(vd){ showVideo(+vd.getAttribute("data-vid")); return; }

    var gl = t.closest && t.closest("[data-gal]");
    if(gl){ showLightbox(gl.getAttribute("data-gal")); return; }

    var wa = t.closest && t.closest("[data-wa]");
    if(wa){ window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(wa.getAttribute("data-wa")), "_blank"); return; }

    var op = t.closest && t.closest("[data-open]");
    if(op){
      var kind = op.getAttribute("data-open");
      if(kind === "booking"){
        var preset = op.getAttribute("data-preset");
        var pp = op.getAttribute("data-preset-pkg");
        var pdest = op.getAttribute("data-preset-dest");
        if(pp && PRESET_PKG[pp]){
          var pkg = PRESET_PKG[pp];
          openBooking({ img:pkg.img, kicker:pkg.flag + " - " + pkg.days, title:"Request: " + pkg.title, destination:pkg.place, tripType:pkg.cat });
        } else if(pdest){
          var d2 = null; DESTINATIONS.forEach(function(x){ if(x.name === pdest) d2 = x; });
          openBooking({ img:(d2||{}).img || "hero-mara.jpg", kicker:(d2||{}).country || "Destination",
                         title:"Plan: " + pdest, destination:pdest, tripType:"Safari" });
        } else {
          openBooking({ tripType:preset || "" });
        }
      }
      if(op.hasAttribute("data-close-modal")) closeModal("infoModal");
      return;
    }

    if(t.closest && t.closest("[data-close]")){
      var m = t.closest(".modal");
      if(m) closeModal(m.id); else closeDrawer();
      return;
    }
    if(t.closest && t.closest(".fs")) return;
    closeAllFs();
  });

  $$(".modal").forEach(function(m){
    m.addEventListener("mousedown", function(e){ if(e.target === m) closeModal(m.id); });
  });

  document.addEventListener("keydown", function(e){
    if(e.key === "Escape"){
      if(openModals.length){ closeModal(openModals[openModals.length-1]); return; }
      if($("#drawer").classList.contains("open")) closeDrawer();
      closeAllFs();
    }
    if(openModals.indexOf("lightbox") !== -1){
      if(e.key === "ArrowRight"){ stepLightbox(1); e.preventDefault(); }
      if(e.key === "ArrowLeft"){ stepLightbox(-1); e.preventDefault(); }
    }
    if(openModals.indexOf("videoModal") !== -1 && (e.key === "ArrowRight" || e.key === "ArrowLeft")){
      showVideo((vmIndex + (e.key === "ArrowRight" ? 1 : VIDEOS.length-1)) % VIDEOS.length); e.preventDefault();
    }
  });

  $("#lbPrev").addEventListener("click", function(){ stepLightbox(-1); });
  $("#lbNext").addEventListener("click", function(){ stepLightbox(1); });

  $$(".radio-row input[type=radio]").forEach(function(r){
    syncRadio(r);
    r.addEventListener("change", function(){ syncRadio(r); });
  });
  function syncRadio(r){
    var lbl = r.closest("label");
    $$("input[name=" + r.name + "]").forEach(function(o){ var L = o.closest("label"); if(L) L.classList.toggle("on", o.checked); });
  }

  $("#playAll").addEventListener("click", function(){ showVideo((vmIndex+1) % VIDEOS.length); });
  $("#heroWatch").addEventListener("click", function(){ showVideo(0); });

  var footer = $("#footShare");
  if(footer) footer.addEventListener("click", function(){
    if(navigator.share){ navigator.share({ title:"Avenza Tours & Travel", url:location.href }).catch(function(){}); }
    else if(navigator.clipboard){ navigator.clipboard.writeText(location.href).then(function(){ toast("Website link copied to your clipboard.","ok"); }); }
    else toast("Copy this page address from your browser to share it.");
  });

  document.addEventListener("error", function(e){
    var el = e.target;
    if(el && el.tagName === "IMG" && !el.dataset.fbDone){
      el.dataset.fbDone = "1";
      el.classList.add("img-fallback");
      el.style.objectFit = "cover";
    }
  }, true);
}

/* ---------- NAV / DRAWER / SCROLL ---------- */
function openDrawer(){ $("#drawer").classList.add("open"); document.body.classList.add("no-scroll"); $("#menuBtn").setAttribute("aria-expanded","true"); }
function closeDrawer(){ $("#drawer").classList.remove("open"); if(!openModals.length) document.body.classList.remove("no-scroll"); $("#menuBtn").setAttribute("aria-expanded","false"); }

function initNav(){
  var nav = $("#navbar"), top = $("#toTop"), last = 0;
  function onScroll(){
    var y = window.scrollY;
    nav.classList.toggle("scrolled", y > 40);
    top.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive:true });
  onScroll();
  top.addEventListener("click", function(){ window.scrollTo({ top:0, behavior:"smooth" }); });
  $("#menuBtn").addEventListener("click", function(){
    $("#drawer").classList.contains("open") ? closeDrawer() : openDrawer();
  });
  $$("[data-close-nav]").forEach(function(a){ a.addEventListener("click", closeDrawer); });
  $$(".drawer-nav a").forEach(function(a){ a.addEventListener("click", closeDrawer); });

  var links = $$(".nav-links a");
  var secs = links.map(function(a){ return document.querySelector(a.getAttribute("href")); }).filter(Boolean);
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      links.forEach(function(a){ a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id); });
    });
  }, { rootMargin:"-45% 0px -50% 0px" });
  secs.forEach(function(s){ io.observe(s); });
}

/* ---------- BOOT ---------- */
function boot(){
  PRESET_PKG = {}; PACKAGES.forEach(function(p){ PRESET_PKG[p.id] = p; });

  initFlexSelects();
  renderDest("all");
  renderPkg("all", "");
  renderVideos();
  renderGallery("all");
  renderFaq();

  initHero();
  initHeroVideo();
  initObservers();
  initTestimonials();
  initQuickSearch();
  initMainForm();
  initModalForm();
  initNews();
  initGlobal();
  initNav();

  document.getElementById("year").textContent = new Date().getFullYear();

  var pl = $("#preloader");
  function hidePl(){ if(pl) pl.classList.add("done"); }
  if(pl){ setTimeout(hidePl, 550); window.addEventListener("load", function(){ setTimeout(hidePl, 300); }); }
  setTimeout(hidePl, 3000);
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
})();
