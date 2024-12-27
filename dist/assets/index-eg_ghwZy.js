(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function t(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(e){if(e.ep)return;e.ep=!0;const r=t(e);fetch(e.href,r)}})();window.onload=function(){emailjs.init(void 0),console.log("EmailJS initialized")};let a=[];document.addEventListener("DOMContentLoaded",async()=>{try{throw new Error("Google Sheets API Key or Spreadsheet ID is not defined.")}catch(o){console.error("Error initializing data:",o)}});async function w(o,n,t){try{const s=`https://sheets.googleapis.com/v4/spreadsheets/${n}/values/${t}?key=${o}`,e=await fetch(s);if(!e.ok)throw new Error(`HTTP error! Status: ${e.status}`);const r=await e.json();return console.log("Fetched data:",r),r.values||[]}catch(s){throw console.error("Error fetching data:",s),s}}function y(o){const n=document.getElementById("pottery-grid");if(!n){console.error("Pottery grid element not found");return}n.innerHTML="",o.forEach(([t,s,e,r,i,d,l,u,p],f)=>{console.log(`Rendering pot ${f+1}:`,{id:t,imageUrl:s,gifUrl:u,description:d});const c=(l==null?void 0:l.toLowerCase())==="taken",m=document.createElement("div");m.className=`card ${c?"taken":""}`,m.innerHTML=`
            <figure>
                <img 
                    src="${s}" 
                    alt="Pottery ${t}" 
                    class="w-full h-48 object-cover ${c?"grayscale":""}" 
                    ${c?"":`onmouseover="this.src='${u}'" onmouseout="this.src='${s}'"`}
                    onerror="this.onerror=null; this.src='/pottery-website/assets/images/fallback-image.jpg';">
            </figure>
            <div class="p-4">
                <h2 class="text-xl font-semibold mb-2">Pottery ${t}</h2>
                <p class="text-gray-600 mb-2">${d||"No description available"}</p>
                <p class="text-gray-600 mb-4">Size: ${e||0} x ${r||0} x ${i||0}</p>
                <button class="btn btn-primary w-full" 
                        ${c?"disabled":""}
                        onclick="window.openModal('${t}')">
                    ${c?"Taken":"Select"}
                </button>
            </div>
        `,n.appendChild(m)})}window.openModal=function(o){console.log("Opening modal for pottery:",o);const n=document.getElementById("pottery-modal"),t=n.querySelector("form"),s=t.querySelector('input[name="pottery_id"]'),e=document.getElementById("modal-images");if(!n||!t||!s||!e){console.error("Modal or required elements not found");return}t.reset(),s.value=o;const r=a.find(i=>i[0]===o);if(r){const[i,d,l,u,p,f,c,m,g]=r;e.innerHTML=`
            <img src="${d}" alt="Pottery Image 1" class="w-1/2 h-48 object-cover">
            <img src="${g}" alt="Pottery Image 2" class="w-1/2 h-48 object-cover">
        `,t.querySelectorAll('input[name="pottery_details"], input[name="pottery_size"]').forEach(h=>h.remove()),t.insertAdjacentHTML("beforeend",`
            <input type="hidden" name="pottery_details" value="${f||"No description available"}">
            <input type="hidden" name="pottery_size" value="${l} x ${u} x ${p}">
        `)}n.showModal()};window.closeModal=function(){const o=document.getElementById("pottery-modal");o&&o.close()};async function b(o){const n="https://script.google.com/macros/s/AKfycbxQDAvOoUE_eGI69UPPd74jZJEQOkMsx5DNf_wq0YzhhKlVrjKVSk7knIQ6ZlH8LKyi/exec";try{console.log("Updating sheet for pottery:",o);const t=await fetch(n,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({potteryId:o})});return console.log("Google Sheet Response:",t),{success:!0}}catch(t){throw console.error("Error updating Google Sheet:",t),t}}document.getElementById("order-form").addEventListener("submit",async function(o){o.preventDefault(),console.log("Starting form submission...");const t=new FormData(this).get("pottery_id"),s=this.querySelector('button[type="submit"]');s.disabled=!0,s.textContent="Submitting...";try{if(!t)throw new Error("Pottery ID not found in form");await b(t),console.log("Sheet updated successfully");const e=await emailjs.sendForm(void 0,void 0,this,void 0);console.log("Admin email sent successfully:",e);const r=await emailjs.sendForm(void 0,void 0,this,void 0);console.log("Customer email sent successfully:",r),await $(t),closeModal(),alert("Order submitted successfully! Please check your email for confirmation.")}catch(e){console.error("Error processing order:",e),alert(`Failed to submit order: ${e.message}`)}finally{s.disabled=!1,s.textContent="Submit Order"}});async function $(o){const n=a.findIndex(t=>t[0]===o);n!==-1?(a[n][6]="taken",y(a)):console.error("Pottery item not found")}window.openModal=openModal;
