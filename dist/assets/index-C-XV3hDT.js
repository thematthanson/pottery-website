(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function t(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(e){if(e.ep)return;e.ep=!0;const o=t(e);fetch(e.href,o)}})();window.onload=function(){emailjs.init(void 0),console.log("EmailJS initialized")};let a=[];document.addEventListener("DOMContentLoaded",async()=>{try{throw new Error("Google Sheets API Key or Spreadsheet ID is not defined.")}catch(r){console.error("Error initializing data:",r)}});async function g(r,n,t){try{const s=`https://sheets.googleapis.com/v4/spreadsheets/${n}/values/${t}?key=${r}`,e=await fetch(s);if(!e.ok)throw new Error(`HTTP error! Status: ${e.status}`);const o=await e.json();console.log("Fetched data:",o);const i=["id","imageUrl","length","width","height","description","status","price","gifUrl","topImageUrl"];return o.values.map(d=>{const l={};return i.forEach((u,f)=>{l[u]=d[f]||""}),l})}catch(s){throw console.error("Error fetching data:",s),s}}function p(r){const n=document.getElementById("pottery-grid");if(!n){console.error("Pottery grid element not found");return}n.innerHTML="",r.forEach((t,s)=>{console.log(`Rendering pot ${s+1}:`,t);const{id:e,imageUrl:o,length:i,width:d,height:l,description:u,status:f,gifUrl:h}=t,c=f.toLowerCase()==="taken",m=document.createElement("div");m.className=`card ${c?"taken":""}`,m.innerHTML=`
            <figure>
                <img 
                    src="${o}" 
                    alt="Pottery ${e}" 
                    class="w-full h-48 object-cover ${c?"grayscale":""}"
                    ${c?"":`onmouseover="this.src='${h}'" onmouseout="this.src='${o}'"`}
                    onerror="this.onerror=null; this.src='/pottery-website/assets/images/fallback-image.jpg';">
            </figure>
            <div class="p-4">
                <h2 class="text-xl font-semibold mb-2">Pottery ${e}</h2>
                <p class="text-gray-600 mb-2">${u||"No description available"}</p>
                <p class="text-gray-600 mb-4">Size: ${i||0} x ${d||0} x ${l||0}</p>
                <button class="btn btn-primary w-full" 
                        ${c?"disabled":""}
                        onclick="window.openModal('${e}')">
                    ${c?"Taken":"Select"}
                </button>
            </div>
        `,n.appendChild(m)})}function y(){const r=document.getElementById("pottery-modal");r&&r.close()}async function w(r){const n="https://script.google.com/macros/s/AKfycbxQDAvOoUE_eGI69UPPd74jZJEQOkMsx5DNf_wq0YzhhKlVrjKVSk7knIQ6ZlH8LKyi/exec";try{console.log("Updating sheet for pottery:",r);const t=await fetch(n,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({potteryId:r})});return console.log("Google Sheet Response:",t),{success:!0}}catch(t){throw console.error("Error updating Google Sheet:",t),t}}document.getElementById("order-form").addEventListener("submit",async function(r){r.preventDefault(),console.log("Starting form submission...");const t=new FormData(this).get("pottery_id"),s=this.querySelector('button[type="submit"]');s.disabled=!0,s.textContent="Submitting...";try{if(!t)throw new Error("Pottery ID not found in form");await w(t),console.log("Sheet updated successfully");const e=await emailjs.sendForm(void 0,void 0,this,void 0);console.log("Admin email sent successfully:",e);const o=await emailjs.sendForm(void 0,void 0,this,void 0);console.log("Customer email sent successfully:",o),await b(t),y(),alert("Order submitted successfully! Please check your email for confirmation.")}catch(e){console.error("Error processing order:",e),alert(`Failed to submit order: ${e.message}`)}finally{s.disabled=!1,s.textContent="Submit Order"}});async function b(r){const n=a.findIndex(t=>t.id===r);n!==-1?(a[n].status="taken",p(a)):console.error("Pottery item not found")}
