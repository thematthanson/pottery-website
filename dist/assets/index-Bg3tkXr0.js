(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const s of t.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function o(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function i(e){if(e.ep)return;e.ep=!0;const t=o(e);fetch(e.href,t)}})();window.onload=function(){emailjs.init(void 0),console.log("EmailJS initialized")};let d=[];window.openModal=g;window.closeModal=b;document.addEventListener("DOMContentLoaded",async()=>{try{throw new Error("Google Sheets API Key or Spreadsheet ID is not defined.")}catch(r){console.error("Error initializing data:",r)}});async function y(r,n,o){try{const i=`https://sheets.googleapis.com/v4/spreadsheets/${n}/values/${o}?key=${r}`,e=await fetch(i);if(!e.ok)throw new Error(`HTTP error! Status: ${e.status}`);const t=await e.json();return console.log("Fetched data:",t),t.values||[]}catch(i){throw console.error("Error fetching data:",i),i}}function h(r){const n=document.getElementById("pottery-grid");if(!n){console.error("Pottery grid element not found");return}n.innerHTML="",r.forEach(([o,i,e,t,s,u,l])=>{const a=(l==null?void 0:l.toLowerCase())==="taken",c=document.createElement("div");c.className=`card ${a?"taken":""}`,c.innerHTML=`
            <figure>
                <img src="${i}" alt="Pottery ${o}" 
                     class="w-full h-48 object-cover ${a?"grayscale":""}"
                     onerror="this.onerror=null; this.src='/pottery-website/assets/images/fallback-image.jpg';">
            </figure>
            <div class="p-4">
                <h2 class="text-xl font-semibold mb-2">Pottery ${o}</h2>
                <p class="text-gray-600 mb-2">${u||"No description available"}</p>
                <p class="text-gray-600 mb-4">Size: ${e||0} x ${t||0} x ${s||0}</p>
                <button class="btn btn-primary w-full" 
                        ${a?"disabled":""}
                        onclick="openModal('${o}')">
                    ${a?"Taken":"Select"}
                </button>
            </div>
        `,n.appendChild(c)})}function g(r){console.log("Opening modal for pottery:",r);const n=document.getElementById("pottery-modal"),o=n.querySelector("form"),i=o.querySelector('input[name="pottery_id"]'),e=o.querySelector('button[type="submit"]');if(!n||!o||!i){console.error("Modal, form, or pottery ID input not found");return}o.reset(),i.value=r;const t=d.find(s=>s[0]===r);if(t){const[s,u,l,a,c,p]=t,f=`${l} x ${a} x ${c}`;o.querySelectorAll('input[name="pottery_details"], input[name="pottery_size"]').forEach(m=>m.remove()),o.insertAdjacentHTML("beforeend",`
            <input type="hidden" name="pottery_details" value="${p||"No description available"}">
            <input type="hidden" name="pottery_size" value="${f}">
        `)}e.disabled=!1,e.textContent="Submit Order",n.showModal()}function b(){const r=document.getElementById("pottery-modal");r&&r.close()}
