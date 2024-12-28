(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function o(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=o(e);fetch(e.href,t)}})();window.onload=function(){emailjs.init(void 0),console.log("EmailJS initialized")};let l=[];document.addEventListener("DOMContentLoaded",async()=>{try{throw new Error("Google Sheets API Key or Spreadsheet ID is not defined.")}catch(n){console.error("Error initializing data:",n)}});async function p(n,s,o){try{const r=`https://sheets.googleapis.com/v4/spreadsheets/${s}/values/${o}?key=${n}`,e=await fetch(r);if(!e.ok)throw new Error(`HTTP error! Status: ${e.status}`);const t=await e.json();return console.log("Fetched data:",t),!t.values||!Array.isArray(t.values)?(console.error("Data is not in the expected format:",t),[]):t.values}catch(r){throw console.error("Error fetching data:",r),r}}function y(n){const s=document.getElementById("pottery-grid");if(!s){console.error("Pottery grid element not found");return}s.innerHTML="",n.forEach(([o,r,e,t,i,d,a,f,m,b])=>{const c=(a==null?void 0:a.toLowerCase())==="taken",u=document.createElement("div");u.className=`card ${c?"taken":""}`,u.innerHTML=`
            <figure>
                <img 
                    src="${r}" 
                    alt="Pottery ${o}" 
                    class="w-full h-auto object-cover rounded-[15px] ${c?"grayscale":""}"
                    ${c?"":`onmouseover="this.src='${m}'" onmouseout="this.src='${r}'"`}
                    onerror="this.onerror=null; this.src='/pottery-website/assets/images/fallback-image.jpg';">
            </figure>
            <div class="p-4">
                <h2 class="text-xl font-semibold mb-2">Pottery ${o}</h2>
                <p class="text-gray-600 mb-2">${d||"No description available"}</p>
                <p class="text-gray-600 mb-4">Size: ${e||0} x ${t||0} x ${i||0}</p>
                <button class="btn btn-primary w-full" 
                        ${c?"disabled":""}
                        onclick="openModal('${o}')">
                    ${c?"Taken":"Select"}
                </button>
            </div>
        `,s.appendChild(u)})}function g(n){console.log("Opening modal for pottery:",n);const s=document.getElementById("pottery-modal");if(!s){console.error("Modal element not found");return}const o=s.querySelector("form"),r=o.querySelector('input[name="pottery_id"]');if(!o||!r){console.error("Form or pottery ID input not found in modal");return}o.reset(),r.value=n;const e=l.find(f=>f[0]===n);if(!e){console.error("Pottery item not found for ID:",n);return}const[t,i,,,,,,,,d]=e,a=document.getElementById("modal-images");a&&(a.innerHTML=`
            <img src="${i}" alt="Pottery Image 1" class="w-1/2 h-48 object-cover rounded-[15px]">
            <img src="${d}" alt="Pottery Image 2" class="w-1/2 h-48 object-cover rounded-[15px]">
        `),s.showModal()}async function h(n){const s="https://script.google.com/macros/s/AKfycbxQDAvOoUE_eGI69UPPd74jZJEQOkMsx5DNf_wq0YzhhKlVrjKVSk7knIQ6ZlH8LKyi/exec";try{console.log("Updating sheet for pottery:",n),await fetch(s,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({potteryId:n})}),console.log("Google Sheet update successful")}catch(o){throw console.error("Error updating Google Sheet:",o),o}}document.getElementById("order-form").addEventListener("submit",async function(n){n.preventDefault(),console.log("Starting form submission...");const o=new FormData(this).get("pottery_id"),r=this.querySelector('button[type="submit"]');r.disabled=!0,r.textContent="Submitting...";try{if(!o)throw new Error("Pottery ID not found in form");await h(o),console.log("Sheet updated successfully"),alert("Order submitted successfully! Please check your email for confirmation.")}catch(e){console.error("Error processing order:",e),alert(`Failed to submit order: ${e.message}`)}finally{r.disabled=!1,r.textContent="Submit Order"}});window.openModal=g;
