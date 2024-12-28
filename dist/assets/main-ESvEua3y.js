(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function r(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerPolicy&&(n.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?n.credentials="include":e.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(e){if(e.ep)return;e.ep=!0;const n=r(e);fetch(e.href,n)}})();window.onload=function(){emailjs.init(void 0),console.log("EmailJS initialized")};const g="https://script.google.com/macros/s/AKfycbxJlyW8nblHwZu-T7wIqxrVvnnwnM1OKi9ISxo--sf820OWfy7FI5-Gofk2uYyAXPgJ/exec";let a=[];document.addEventListener("DOMContentLoaded",async()=>{try{throw new Error("Google Sheets API Key or Spreadsheet ID is not defined.")}catch(o){console.error("Error initializing data:",o)}});async function h(o,t,r){try{const s=`https://sheets.googleapis.com/v4/spreadsheets/${t}/values/${r}?key=${o}`,e=await fetch(s);if(!e.ok)throw new Error(`HTTP error! Status: ${e.status}`);const n=await e.json();return!n.values||!Array.isArray(n.values)?(console.error("Invalid data format:",n),[]):n.values}catch(s){throw console.error("Error fetching data:",s),s}}function m(o){const t=document.getElementById("pottery-grid");if(!t){console.error("Pottery grid element not found");return}t.innerHTML="",o.forEach(([r,s,e,n,i,d,c,f,y,I])=>{const l=(c==null?void 0:c.toLowerCase())==="taken",u=document.createElement("div");u.className=`card ${l?"taken":""}`,u.innerHTML=`
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
        <p class="text-gray-600 mb-4">Size: ${e||0} x ${n||0} x ${i||0}</p>
        <button class="btn btn-primary w-full" 
                ${l?"disabled":""}
                onclick="openModal('${r}')">
          ${l?"Taken":"Select"}
        </button>
      </div>
    `,t.appendChild(u)})}function w(o){const t=document.getElementById("pottery-modal");if(!t){console.error("Modal element not found");return}const r=t.querySelector("form"),s=r.querySelector('input[name="pottery_id"]');if(!r||!s){console.error("Form or pottery ID input not found in modal");return}r.reset(),s.value=o;const e=a.find(f=>f[0]===o);if(!e){console.error("Pottery item not found for ID:",o);return}const[n,i,,,,,,,,d]=e,c=document.getElementById("modal-images");c&&(c.innerHTML=`
      <div class="flex flex-col items-center">
        <img src="${i}" alt="Side view" class="modal-image rounded-[15px]">
        <p class="text-sm text-gray-600 mt-2">Side view</p>
      </div>
      <div class="flex flex-col items-center">
        <img src="${d}" alt="Top view" class="modal-image rounded-[15px]">
        <p class="text-sm text-gray-600 mt-2">Top view</p>
      </div>
    `),t.showModal()}function p(){const o=document.getElementById("pottery-modal");o&&o.close()}async function b(o){try{const t=await fetch(g,{method:"POST",mode:"no-cors",cache:"no-cache",headers:{"Content-Type":"application/json"},body:JSON.stringify({potteryId:o})});return{success:!0}}catch(t){throw console.error("Error updating Google Sheets:",t),new Error("Failed to update Google Sheets")}}function v(o){const t=a.findIndex(r=>r[0]===o);t!==-1?(a[t][6]="taken",m(a)):console.error("Pottery ID not found in local data")}document.getElementById("order-form").addEventListener("submit",async function(o){o.preventDefault();const t=this,r=t.querySelector('button[type="submit"]'),s=new FormData(t).get("pottery_id");try{r&&(r.disabled=!0),await b(s),v(s),alert(`Thank you for ordering Piece ${s}!`),p()}catch(e){console.error("Error during order submission:",e),alert("Failed to submit the order. Please try again.")}finally{r&&(r.disabled=!1)}});window.openModal=w;window.closeModal=p;
