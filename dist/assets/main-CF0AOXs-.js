(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function t(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(e){if(e.ep)return;e.ep=!0;const r=t(e);fetch(e.href,r)}})();window.onload=function(){emailjs.init(void 0),console.log("EmailJS initialized")};let d=[];document.addEventListener("DOMContentLoaded",async()=>{try{throw new Error("Google Sheets API Key or Spreadsheet ID is not defined.")}catch(n){console.error("Error initializing data:",n)}});async function y(n,s,t){try{const o=`https://sheets.googleapis.com/v4/spreadsheets/${s}/values/${t}?key=${n}`,e=await fetch(o);if(!e.ok)throw new Error(`HTTP error! Status: ${e.status}`);const r=await e.json();return console.log("Fetched data:",r),!r.values||!Array.isArray(r.values)?(console.error("Data is not in the expected format:",r),[]):r.values}catch(o){throw console.error("Error fetching data:",o),o}}function g(n){const s=document.getElementById("pottery-grid");if(!s){console.error("Pottery grid element not found");return}s.innerHTML="",n.forEach(([t,o,e,r,i,u,a,f,m,b],p)=>{if(!t||!o){console.warn("Skipping invalid pottery item:",{id:t,imageUrl:o});return}console.log(`Rendering item ${p+1}:`,{id:t,imageUrl:o,gifUrl:m});const c=(a==null?void 0:a.toLowerCase())==="taken",l=document.createElement("div");l.className=`card ${c?"taken":""}`,l.style.width="fit-content",l.innerHTML=`
            <figure style="width: 100%;">
                <img 
                    src="${o}" 
                    alt="Pottery ${t}" 
                    class="object-cover w-full h-48 rounded-[15px] ${c?"grayscale":""}"
                    ${c?`onmouseover="this.src='/pottery-website/assets/images/soldout.webp'"`:`onmouseover="this.src='${m}'"`}
                    onmouseout="this.src='${o}'"
                    onerror="this.onerror=null; this.src='/pottery-website/assets/images/fallback-image.jpg';">
            </figure>
            <div class="p-4">
                <h2 class="text-xl font-semibold mb-2">Pottery ${t}</h2>
                <p class="text-gray-600 mb-2">${u||"No description available"}</p>
                <p class="text-gray-600 mb-4">Size: ${e||0} x ${r||0} x ${i||0}</p>
                <button class="btn btn-primary w-full" 
                        ${c?"disabled":""}
                        onclick="window.openModal('${t}')">
                    ${c?"Taken":"Select"}
                </button>
            </div>
        `,s.appendChild(l)})}function h(n){console.log("Opening modal for pottery:",n);const s=document.getElementById("pottery-modal");if(!s){console.error("Modal element not found");return}const t=s.querySelector("form"),o=t.querySelector('input[name="pottery_id"]');if(!t||!o){console.error("Form or pottery ID input not found in modal");return}t.reset(),o.value=n;const e=d.find(f=>f[0]===n);if(!e){console.error("Pottery item not found for ID:",n);return}const[r,i,,,,,,,,u]=e,a=document.getElementById("modal-images");a&&(a.innerHTML=`
            <img src="${i}" alt="Pottery Image 1" class="w-1/2 h-48 object-cover rounded-[15px]">
            <img src="${u}" alt="Pottery Image 2" class="w-1/2 h-48 object-cover rounded-[15px]">
        `),s.showModal()}async function w(n){const s="https://script.google.com/macros/s/AKfycbxQDAvOoUE_eGI69UPPd74jZJEQOkMsx5DNf_wq0YzhhKlVrjKVSk7knIQ6ZlH8LKyi/exec";try{console.log("Updating sheet for pottery:",n),await fetch(s,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({potteryId:n})}),console.log("Google Sheet update successful")}catch(t){throw console.error("Error updating Google Sheet:",t),t}}document.getElementById("order-form").addEventListener("submit",async function(n){n.preventDefault(),console.log("Starting form submission...");const t=new FormData(this).get("pottery_id"),o=this.querySelector('button[type="submit"]');o.disabled=!0,o.textContent="Submitting...";try{if(!t)throw new Error("Pottery ID not found in form");await w(t),console.log("Sheet updated successfully"),alert("Order submitted successfully! Please check your email for confirmation.")}catch(e){console.error("Error processing order:",e),alert(`Failed to submit order: ${e.message}`)}finally{o.disabled=!1,o.textContent="Submit Order"}});window.openModal=h;
