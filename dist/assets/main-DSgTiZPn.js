(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}})();window.onload=function(){emailjs.init({publicKey:void 0}),console.log("EmailJS initialized")};const g="https://script.google.com/macros/s/AKfycbxJlyW8nblHwZu-T7wIqxrVvnnwnM1OKi9ISxo--sf820OWfy7FI5-Gofk2uYyAXPgJ/exec";let l=[];document.addEventListener("DOMContentLoaded",async()=>{try{throw new Error("Google Sheets API Key or Spreadsheet ID is not defined.")}catch(r){console.error("Error initializing data:",r)}});async function h(r,o,n){try{const s=`https://sheets.googleapis.com/v4/spreadsheets/${o}/values/${n}?key=${r}`,e=await fetch(s);if(!e.ok)throw new Error(`HTTP error! Status: ${e.status}`);const t=await e.json();return!t.values||!Array.isArray(t.values)?(console.error("Invalid data format:",t),[]):t.values}catch(s){throw console.error("Error fetching data:",s),s}}function f(r){const o=document.getElementById("pottery-grid");if(!o){console.error("Pottery grid element not found");return}o.innerHTML="",r.forEach(([n,s,e,t,i,d,c,a,y,$])=>{const u=(c==null?void 0:c.toLowerCase())==="taken",m=document.createElement("div");m.className=`card ${u?"taken":""} bg-[#FFFBF5]`,m.innerHTML=`
      <figure>
        <img 
          src="${s}" 
          alt="Piece ${n}" 
          class="w-full h-auto object-cover rounded-[15px] ${u?"grayscale":""}"
          ${u?"":`onmouseover="this.src='${y}'" onmouseout="this.src='${s}'"`}
          onerror="this.onerror=null; this.src='/pottery-website/assets/images/fallback-image.jpg';">
      </figure>
      <div class="p-4">
        <h2 class="text-xl font-semibold mb-2">Piece ${n}</h2>
        <p class="text-gray-600 mb-2">${d||"No description available"}</p>
        <p class="text-gray-600 mb-4">Size: ${e||0} x ${t||0} x ${i||0}</p>
        <button class="btn btn-primary w-full" 
                ${u?"disabled":""}
                onclick="openModal('${n}')">
          ${u?"Taken":"Select"}
        </button>
      </div>
    `,o.appendChild(m)})}function w(r){const o=document.getElementById("pottery-modal");if(!o){console.error("Modal element not found");return}const n=o.querySelector("form"),s=n.querySelector('input[name="pottery_id"]');if(!n||!s){console.error("Form or pottery ID input not found in modal");return}n.reset(),s.value=r;const e=l.find(a=>a[0]===r);if(!e){console.error("Pottery item not found for ID:",r);return}const[t,i,,,,,,,,d]=e,c=document.getElementById("modal-images");c&&(c.innerHTML=`
      <div class="flex flex-col items-center">
        <img src="${i}" alt="Side view" class="modal-image rounded-[15px]">
        <p class="text-sm text-gray-600 mt-2">Side view</p>
      </div>
      <div class="flex flex-col items-center">
        <img src="${d}" alt="Top view" class="modal-image rounded-[15px]">
        <p class="text-sm text-gray-600 mt-2">Top view</p>
      </div>
    `),o.showModal()}function p(){const r=document.getElementById("pottery-modal");r&&r.close()}async function b(r){try{const o=await fetch(g,{method:"POST",mode:"no-cors",cache:"no-cache",headers:{"Content-Type":"application/json"},body:JSON.stringify({potteryId:r})});return{success:!0}}catch(o){throw console.error("Error updating Google Sheets:",o),new Error("Failed to update Google Sheets")}}function v(r){const o=l.findIndex(n=>n[0]===r);o!==-1?(l[o][6]="taken",f(l)):console.error("Pottery ID not found in local data")}document.getElementById("order-form").addEventListener("submit",async function(r){r.preventDefault();const o=this,n=o.querySelector('button[type="submit"]'),s=new FormData(o),e=s.get("pottery_id");try{n&&(n.disabled=!0);const t=l.find(a=>a[0]===e);if(!t)throw new Error("Pottery not found");const i={to_email:s.get("user_email"),to_name:s.get("user_name"),shipping_address:s.get("user_address"),pottery_id:e,pottery_description:t[5]||"No description available",pottery_dimensions:`${t[2]||0} x ${t[3]||0} x ${t[4]||0}`};console.log("Email template params:",i);const d=await emailjs.send(void 0,void 0,i,void 0).catch(a=>{throw console.error("Customer EmailJS error:",a),a}),c=await emailjs.send(void 0,void 0,i,void 0).catch(a=>{throw console.error("Admin EmailJS error:",a),a});if(console.log("Admin email response:",c),d.status!==200||c.status!==200)throw new Error("Failed to send one or more emails");await b(e),v(e),alert(`Thank you for ordering Piece ${e}! A confirmation email has been sent to ${s.get("user_email")}`),p()}catch(t){console.error("Error during order submission:",t),alert("Failed to submit the order. Please try again.")}finally{n&&(n.disabled=!1)}});window.openModal=w;window.closeModal=p;
