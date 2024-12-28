(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function r(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(t){if(t.ep)return;t.ep=!0;const n=r(t);fetch(t.href,n)}})();window.onload=function(){emailjs.init(void 0),console.log("EmailJS initialized")};let i=[];document.addEventListener("DOMContentLoaded",async()=>{try{const r="https://script.google.com/macros/s/AKfycbyJXvIAfEZOZLElapLS-QpUAalqqNmshnPBVnyMbYQLRt0gBQYqMtH1lBKn2hrdkrAP/exec";throw new Error("Google Sheets API Key or Spreadsheet ID is not defined.")}catch(o){console.error("Error initializing data:",o)}});async function g(o,e,r){try{const s=`https://sheets.googleapis.com/v4/spreadsheets/${e}/values/${r}?key=${o}`,t=await fetch(s);if(!t.ok)throw new Error(`HTTP error! Status: ${t.status}`);const n=await t.json();return!n.values||!Array.isArray(n.values)?(console.error("Invalid data format:",n),[]):n.values}catch(s){throw console.error("Error fetching data:",s),s}}function m(o){const e=document.getElementById("pottery-grid");if(!e){console.error("Pottery grid element not found");return}e.innerHTML="",o.forEach(([r,s,t,n,a,d,c,f,y,$])=>{const l=(c==null?void 0:c.toLowerCase())==="taken",u=document.createElement("div");u.className=`card ${l?"taken":""}`,u.innerHTML=`
            <figure>
                <img 
                    src="${s}" 
                    alt="Piece ${r}" 
                    class="w-full h-auto object-cover rounded-[15px] ${l?"grayscale":""}"
                    ${l?"":`onmouseover="this.src='${y}'" onmouseout="this.src='${s}'"`}
                    onerror="this.onerror=null; this.src='/pottery-website/assets/images/fallback-image.jpg';">
            </figure>
            <div class="p-4">
                <h2 class="text-xl font-semibold mb-2">Piece ${r}</h2>
                <p class="text-gray-600 mb-2">${d||"No description available"}</p>
                <p class="text-gray-600 mb-4">Size: ${t||0} x ${n||0} x ${a||0}</p>
                <button class="btn btn-primary w-full" 
                        ${l?"disabled":""}
                        onclick="openModal('${r}')">
                    ${l?"Taken":"Select"}
                </button>
            </div>
        `,e.appendChild(u)})}function h(o){const e=document.getElementById("pottery-modal");if(!e){console.error("Modal element not found");return}const r=e.querySelector("form"),s=r.querySelector('input[name="pottery_id"]');if(!r||!s){console.error("Form or pottery ID input not found in modal");return}r.reset(),s.value=o;const t=i.find(f=>f[0]===o);if(!t){console.error("Pottery item not found for ID:",o);return}const[n,a,,,,,,,,d]=t,c=document.getElementById("modal-images");c&&(c.innerHTML=`
            <div class="flex flex-col items-center">
                <img src="${a}" alt="Side view" class="modal-image rounded-[15px]">
                <p class="text-sm text-gray-600 mt-2">Side view</p>
            </div>
            <div class="flex flex-col items-center">
                <img src="${d}" alt="Top view" class="modal-image rounded-[15px]">
                <p class="text-sm text-gray-600 mt-2">Top view</p>
            </div>
        `),e.showModal()}function p(){const o=document.getElementById("pottery-modal");o&&o.close()}async function w(o){try{const e=await fetch(apiUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({potteryId:o})});if(!e.ok)throw new Error(`Failed to update Google Sheets. Status: ${e.status}`);const r=await e.json();if(!r.success)throw new Error(`Google Sheets error: ${r.error}`);console.log("Google Sheet updated successfully:",r.message)}catch(e){throw console.error("Error updating Google Sheets:",e.message),e}}function v(o){const e=i.findIndex(r=>r[0]===o);e!==-1?(i[e][6]="taken",m(i)):console.error("Pottery ID not found in local data")}document.getElementById("order-form").addEventListener("submit",async function(o){o.preventDefault();const e=new FormData(this).get("pottery_id");try{await w(e),v(e),alert(`Thank you for ordering Piece ${e}!`),p()}catch(r){console.error("Error during order submission:",r),alert("Failed to submit the order. Please try again.")}});window.openModal=h;window.closeModal=p;
