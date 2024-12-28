(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function t(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerPolicy&&(n.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?n.credentials="include":e.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(e){if(e.ep)return;e.ep=!0;const n=t(e);fetch(e.href,n)}})();window.onload=function(){emailjs.init(void 0),console.log("EmailJS initialized")};let i=[];document.addEventListener("DOMContentLoaded",async()=>{try{throw new Error("Google Sheets API Key or Spreadsheet ID is not defined.")}catch(r){console.error("Error initializing data:",r)}});async function g(r,o,t){try{const s=`https://sheets.googleapis.com/v4/spreadsheets/${o}/values/${t}?key=${r}`,e=await fetch(s);if(!e.ok)throw new Error(`HTTP error! Status: ${e.status}`);const n=await e.json();return!n.values||!Array.isArray(n.values)?(console.error("Invalid data format:",n),[]):n.values}catch(s){throw console.error("Error fetching data:",s),s}}function m(r){const o=document.getElementById("pottery-grid");if(!o){console.error("Pottery grid element not found");return}o.innerHTML="",r.forEach(([t,s,e,n,a,d,c,f,y,$])=>{const l=(c==null?void 0:c.toLowerCase())==="taken",u=document.createElement("div");u.className=`card ${l?"taken":""}`,u.innerHTML=`
            <figure>
                <img 
                    src="${s}" 
                    alt="Piece ${t}" 
                    class="w-full h-auto object-cover rounded-[15px] ${l?"grayscale":""}"
                    ${l?"":`onmouseover="this.src='${y}'" onmouseout="this.src='${s}'"`}
                    onerror="this.onerror=null; this.src='/pottery-website/assets/images/fallback-image.jpg';">
            </figure>
            <div class="p-4">
                <h2 class="text-xl font-semibold mb-2">Piece ${t}</h2>
                <p class="text-gray-600 mb-2">${d||"No description available"}</p>
                <p class="text-gray-600 mb-4">Size: ${e||0} x ${n||0} x ${a||0}</p>
                <button class="btn btn-primary w-full" 
                        ${l?"disabled":""}
                        onclick="openModal('${t}')">
                    ${l?"Taken":"Select"}
                </button>
            </div>
        `,o.appendChild(u)})}function h(r){const o=document.getElementById("pottery-modal");if(!o){console.error("Modal element not found");return}const t=o.querySelector("form"),s=t.querySelector('input[name="pottery_id"]');if(!t||!s){console.error("Form or pottery ID input not found in modal");return}t.reset(),s.value=r;const e=i.find(f=>f[0]===r);if(!e){console.error("Pottery item not found for ID:",r);return}const[n,a,,,,,,,,d]=e,c=document.getElementById("modal-images");c&&(c.innerHTML=`
            <div class="flex flex-col items-center">
                <img src="${a}" alt="Side view" class="modal-image rounded-[15px]">
                <p class="text-sm text-gray-600 mt-2">Side view</p>
            </div>
            <div class="flex flex-col items-center">
                <img src="${d}" alt="Top view" class="modal-image rounded-[15px]">
                <p class="text-sm text-gray-600 mt-2">Top view</p>
            </div>
        `),o.showModal()}function p(){const r=document.getElementById("pottery-modal");r&&r.close()}async function w(r){const o="https://script.google.com/macros/s/AKfycbzVXB7OAziErZfOtF1_R9nhNTrk4osUnP2uruikuUB8Ck-0ndYu9rWJ0Wuo4n-00z-b/exec";try{const t=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({potteryId:r})});if(!t.ok){const e=await t.text();throw new Error(`Failed to update Google Sheets: ${t.status} - ${e}`)}const s=await t.json();if(!s.success)throw new Error(`Google Sheets error: ${s.error}`);console.log("Google Sheet updated successfully:",s.message)}catch(t){throw console.error("Error updating Google Sheets:",t.message),t}}function v(r){const o=i.findIndex(t=>t[0]===r);o!==-1?(i[o][6]="taken",m(i)):console.error("Pottery ID not found in local data")}document.getElementById("order-form").addEventListener("submit",async function(r){r.preventDefault();const o=new FormData(this).get("pottery_id");try{await w(o),v(o),alert(`Thank you for ordering Piece ${o}!`),p()}catch(t){console.error("Error during order submission:",t),alert("Failed to submit the order. Please try again.")}});window.openModal=h;window.closeModal=p;
