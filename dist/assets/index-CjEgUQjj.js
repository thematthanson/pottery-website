(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function t(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(e){if(e.ep)return;e.ep=!0;const r=t(e);fetch(e.href,r)}})();window.onload=function(){emailjs.init(void 0),console.log("EmailJS initialized")};let a=[];document.addEventListener("DOMContentLoaded",async()=>{try{throw new Error("Google Sheets API Key or Spreadsheet ID is not defined.")}catch(o){console.error("Error initializing data:",o)}});async function $(o,n,t){try{const s=`https://sheets.googleapis.com/v4/spreadsheets/${n}/values/${t}?key=${o}`,e=await fetch(s);if(!e.ok)throw new Error(`HTTP error! Status: ${e.status}`);const r=await e.json();return console.log("Fetched data:",r),r.values||[]}catch(s){throw console.error("Error fetching data:",s),s}}function y(o){const n=document.getElementById("pottery-grid");if(!n){console.error("Pottery grid element not found");return}n.innerHTML="",o.forEach(([t,s,e,r,i,u,l,m,f,p])=>{const c=(l==null?void 0:l.toLowerCase())==="taken",d=document.createElement("div");d.className=`card ${c?"taken":""}`,d.innerHTML=`
            <figure>
                <img 
                    src="${s}" 
                    alt="Pottery ${t}" 
                    class="w-full h-48 object-cover rounded-[30px] ${c?"grayscale":""}"
                    ${c?"":`onmouseover="this.src='${f}'" onmouseout="this.src='${s}'"`}
                    onerror="this.onerror=null; this.src='/pottery-website/assets/images/fallback-image.jpg';">
            </figure>
            <div class="p-4">
                <h2 class="text-xl font-semibold mb-2">Pottery ${t}</h2>
                <p class="text-gray-600 mb-2">${u||"No description available"}</p>
                <p class="text-gray-600 mb-4">Size: ${e||0} x ${r||0} x ${i||0}</p>
                <p class="text-gray-600 mb-4">Price: $${m||"N/A"}</p>
                <button class="btn btn-primary w-full" 
                        ${c?"disabled":""}
                        onclick="openModal('${t}')">
                    ${c?"Taken":"Select"}
                </button>
            </div>
        `,n.appendChild(d)})}function v(o){console.log("Opening modal for pottery:",o);const n=document.getElementById("pottery-modal"),t=n.querySelector("form"),s=t.querySelector('input[name="pottery_id"]'),e=t.querySelector('button[type="submit"]');if(!n||!t||!s){console.error("Modal, form, or pottery ID input not found");return}t.reset(),s.value=o;const r=a.find(i=>i[0]===o);if(r){const[i,u,l,m,f,p,c,d,P,g]=r,h=`${l||0} x ${m||0} x ${f||0}`,b=document.getElementById("modal-images");b.innerHTML=`
            <img src="${u}" alt="Pottery Image" class="w-1/2 h-48 object-cover rounded-[30px]">
            <img src="${g}" alt="Top Image" class="w-1/2 h-48 object-cover rounded-[30px]">
        `,t.querySelectorAll('input[name="pottery_details"], input[name="pottery_size"]').forEach(w=>w.remove()),t.insertAdjacentHTML("beforeend",`
            <input type="hidden" name="pottery_details" value="${p||"No description available"}">
            <input type="hidden" name="pottery_size" value="${h}">
            <input type="hidden" name="pottery_price" value="${d||"N/A"}">
        `)}e.disabled=!1,e.textContent="Submit Order",n.showModal()}function E(){const o=document.getElementById("pottery-modal");o&&o.close()}async function S(o){const n="https://script.google.com/macros/s/AKfycbxQDAvOoUE_eGI69UPPd74jZJEQOkMsx5DNf_wq0YzhhKlVrjKVSk7knIQ6ZlH8LKyi/exec";try{console.log("Updating sheet for pottery:",o),await fetch(n,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({potteryId:o})}),console.log("Google Sheet updated successfully.")}catch(t){throw console.error("Error updating Google Sheet:",t),t}}document.getElementById("order-form").addEventListener("submit",async function(o){o.preventDefault(),console.log("Starting form submission...");const t=new FormData(this).get("pottery_id"),s=this.querySelector('button[type="submit"]');s.disabled=!0,s.textContent="Submitting...";try{if(!t)throw new Error("Pottery ID not found in form");await S(t),console.log("Sheet updated successfully");const e=await emailjs.sendForm(void 0,void 0,this,void 0);console.log("Admin email sent successfully:",e);const r=await emailjs.sendForm(void 0,void 0,this,void 0);console.log("Customer email sent successfully:",r),await I(t),E(),alert("Order submitted successfully! Please check your email for confirmation.")}catch(e){console.error("Error processing order:",e),alert(`Failed to submit order: ${e.message}`)}finally{s.disabled=!1,s.textContent="Submit Order"}});async function I(o){const n=a.findIndex(t=>t[0]===o);n!==-1?(a[n][6]="taken",y(a)):console.error("Pottery item not found")}window.openModal=v;
