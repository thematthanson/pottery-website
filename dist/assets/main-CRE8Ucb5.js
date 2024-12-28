(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}})();window.onload=function(){emailjs.init(void 0),console.log("EmailJS initialized")};let l=[];document.addEventListener("DOMContentLoaded",async()=>{try{throw new Error("Google Sheets API Key or Spreadsheet ID is not defined.")}catch(r){console.error("Error initializing data:",r)}});async function y(r,o,n){try{const s=`https://sheets.googleapis.com/v4/spreadsheets/${o}/values/${n}?key=${r}`,e=await fetch(s);if(!e.ok)throw new Error(`HTTP error! Status: ${e.status}`);const t=await e.json();return console.log("Fetched data:",t),!t.values||!Array.isArray(t.values)?(console.error("Invalid data format:",t),[]):t.values}catch(s){throw console.error("Error fetching data:",s),s}}function g(r){const o=document.getElementById("pottery-grid");if(!o){console.error("Pottery grid element not found");return}o.innerHTML="",r.forEach(([n,s,e,t,i,d,a,m,p,w])=>{const c=(a==null?void 0:a.toLowerCase())==="taken",u=document.createElement("div");u.className=`card ${c?"taken":""}`,u.innerHTML=`
            <figure>
                <img 
                    src="${s}" 
                    alt="Piece ${n}" 
                    class="w-full h-auto object-cover rounded-[15px] ${c?"grayscale":""}"
                    ${c?"":`onmouseover="this.src='${p}'" onmouseout="this.src='${s}'"`}
                    onerror="this.onerror=null; this.src='/pottery-website/assets/images/fallback-image.jpg';">
            </figure>
            <div class="p-4">
                <h2 class="text-xl font-semibold mb-2">Piece ${n}</h2>
                <p class="text-gray-600 mb-2">${d||"No description available"}</p>
                <p class="text-gray-600 mb-4">Size: ${e||0} x ${t||0} x ${i||0}</p>
                <button class="btn btn-primary w-full" 
                        ${c?"disabled":""}
                        onclick="openModal('${n}')">
                    ${c?"Taken":"Select"}
                </button>
            </div>
        `,o.appendChild(u)})}function h(r){const o=document.getElementById("pottery-modal");if(!o){console.error("Modal element not found");return}const n=o.querySelector("form"),s=n.querySelector('input[name="pottery_id"]');if(!n||!s){console.error("Form or pottery ID input not found in modal");return}n.reset(),s.value=r;const e=l.find(m=>m[0]===r);if(!e){console.error("Pottery item not found for ID:",r);return}const[t,i,,,,,,,,d]=e,a=document.getElementById("modal-images");a&&(a.innerHTML=`
            <div class="flex flex-col items-center">
                <img src="${i}" alt="Side view" class="modal-image rounded-[15px]">
                <p class="text-sm text-gray-600 mt-2">Side view</p>
            </div>
            <div class="flex flex-col items-center">
                <img src="${d}" alt="Top view" class="modal-image rounded-[15px]">
                <p class="text-sm text-gray-600 mt-2">Top view</p>
            </div>
        `),o.showModal()}function f(){const r=document.getElementById("pottery-modal");r&&r.close()}document.getElementById("order-form").addEventListener("submit",async function(r){r.preventDefault();const o=new FormData(this).get("pottery_id");console.log(`Order submitted for pottery ID: ${o}`),await new Promise(n=>setTimeout(n,1e3)),alert(`Thank you for ordering Piece ${o}!`),f()});window.openModal=h;window.closeModal=f;
