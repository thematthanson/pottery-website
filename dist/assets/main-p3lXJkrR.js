(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function o(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerPolicy&&(n.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?n.credentials="include":e.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(e){if(e.ep)return;e.ep=!0;const n=o(e);fetch(e.href,n)}})();window.onload=function(){emailjs.init(void 0),console.log("EmailJS initialized")};let a=[];document.addEventListener("DOMContentLoaded",async()=>{try{throw new Error("Google Sheets API Key or Spreadsheet ID is not defined.")}catch(r){console.error("Error initializing data:",r)}});async function g(r,t,o){try{const s=`https://sheets.googleapis.com/v4/spreadsheets/${t}/values/${o}?key=${r}`,e=await fetch(s);if(!e.ok)throw new Error(`HTTP error! Status: ${e.status}`);const n=await e.json();return!n.values||!Array.isArray(n.values)?(console.error("Invalid data format:",n),[]):n.values}catch(s){throw console.error("Error fetching data:",s),s}}function m(r){const t=document.getElementById("pottery-grid");if(!t){console.error("Pottery grid element not found");return}t.innerHTML="",r.forEach(([o,s,e,n,i,d,c,f,y,b])=>{const l=(c==null?void 0:c.toLowerCase())==="taken",u=document.createElement("div");u.className=`card ${l?"taken":""}`,u.innerHTML=`
            <figure>
                <img 
                    src="${s}" 
                    alt="Piece ${o}" 
                    class="w-full h-auto object-cover rounded-[15px] ${l?"grayscale":""}"
                    ${l?"":`onmouseover="this.src='${y}'" onmouseout="this.src='${s}'"`}
                    onerror="this.onerror=null; this.src='/pottery-website/assets/images/fallback-image.jpg';">
            </figure>
            <div class="p-4">
                <h2 class="text-xl font-semibold mb-2">Piece ${o}</h2>
                <p class="text-gray-600 mb-2">${d||"No description available"}</p>
                <p class="text-gray-600 mb-4">Size: ${e||0} x ${n||0} x ${i||0}</p>
                <button class="btn btn-primary w-full" 
                        ${l?"disabled":""}
                        onclick="openModal('${o}')">
                    ${l?"Taken":"Select"}
                </button>
            </div>
        `,t.appendChild(u)})}function h(r){const t=document.getElementById("pottery-modal");if(!t){console.error("Modal element not found");return}const o=t.querySelector("form"),s=o.querySelector('input[name="pottery_id"]');if(!o||!s){console.error("Form or pottery ID input not found in modal");return}o.reset(),s.value=r;const e=a.find(f=>f[0]===r);if(!e){console.error("Pottery item not found for ID:",r);return}const[n,i,,,,,,,,d]=e,c=document.getElementById("modal-images");c&&(c.innerHTML=`
            <div class="flex flex-col items-center">
                <img src="${i}" alt="Side view" class="modal-image rounded-[15px]">
                <p class="text-sm text-gray-600 mt-2">Side view</p>
            </div>
            <div class="flex flex-col items-center">
                <img src="${d}" alt="Top view" class="modal-image rounded-[15px]">
                <p class="text-sm text-gray-600 mt-2">Top view</p>
            </div>
        `),t.showModal()}function p(){const r=document.getElementById("pottery-modal");r&&r.close()}async function w(r){const t="https://script.google.com/macros/s/AKfycbyu7-JtFoLfNPEFhfHumz50V4YZoY-N0WYrx-IRGacqz82bt8bU-JnbjhxW1G89JhPd/exec";try{if(!(await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({potteryId:r})})).ok)throw new Error("Failed to update Google Sheets");console.log("Google Sheet updated successfully")}catch(o){throw console.error("Error updating Google Sheets:",o),o}}function v(r){const t=a.findIndex(o=>o[0]===r);t!==-1?(a[t][6]="taken",m(a)):console.error("Pottery ID not found in local data")}document.getElementById("order-form").addEventListener("submit",async function(r){r.preventDefault();const t=new FormData(this).get("pottery_id");try{await w(t),v(t),alert(`Thank you for ordering Piece ${t}!`),p()}catch(o){console.error("Error during order submission:",o),alert("Failed to submit the order. Please try again.")}});window.openModal=h;window.closeModal=p;
