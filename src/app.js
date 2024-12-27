// At the top of app.js
let potteryData = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const apiKey = 'AIzaSyAUJpkOxa9WhkMJ08RUF0brMzz1b2VVJiM';
        const spreadsheetId = '11Z6kV9s-XKGsUcNxrrBm8oT9HMbUiaqnHoJbHdjxkUQ';
        const range = 'Pots!H2:O';
        potteryData = await fetchPotteryData(apiKey, spreadsheetId, range);
        console.log('Initial pottery data:', potteryData);
        renderPotteryItems(potteryData);
    } catch (error) {
        console.error('Error initializing data:', error);
    }
});

async function fetchPotteryData(apiKey, spreadsheetId, range) {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        return data.values || [];
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

function renderPotteryItems(potteryData) {
    const potteryGrid = document.getElementById('pottery-grid');
    if (!potteryGrid) {
        console.error('Pottery grid element not found');
        return;
    }
    
    potteryGrid.innerHTML = '';

    potteryData.forEach(([id, imageUrl, length, width, height, description, status]) => {
        const isTaken = status?.toLowerCase() === 'taken';

        const card = document.createElement('div');
        card.className = `card ${isTaken ? 'taken' : ''}`;

        card.innerHTML = `
            <figure>
                <img src="${imageUrl}" alt="Pottery ${id}" 
                     class="w-full h-48 object-cover ${isTaken ? 'grayscale' : ''}"
                     onerror="this.src='../image/fallback-image.jpg'">
            </figure>
            <div class="p-4">
                <h2 class="text-xl font-semibold mb-2">Pottery ${id}</h2>
                <p class="text-gray-600 mb-2">${description || 'No description available'}</p>
                <p class="text-gray-600 mb-4">Size: ${length || 0} x ${width || 0} x ${height || 0}</p>
                <button class="btn btn-primary w-full" 
                        ${isTaken ? 'disabled' : ''}
                        onclick="openModal('${id}')">
                    ${isTaken ? 'Taken' : 'Select'}
                </button>
            </div>
        `;

        potteryGrid.appendChild(card);
    });
}

function openModal(potteryId) {
    console.log('Opening modal for pottery:', potteryId);
    
    const modal = document.getElementById('pottery-modal');
    const form = modal.querySelector('form');
    const potteryIdInput = form.querySelector('input[name="pottery_id"]');
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (!modal || !form || !potteryIdInput) {
        console.error('Modal, form, or pottery ID input not found');
        return;
    }

    // Reset form before adding new values
    form.reset();

    // Set pottery ID
    potteryIdInput.value = potteryId;
    console.log('Pottery ID set to:', potteryIdInput.value);

    // Find and set pottery details
    const pottery = potteryData.find(item => item[0] === potteryId);
    if (pottery) {
        const [id, imageUrl, length, width, height, description] = pottery;
        const size = `${length} x ${width} x ${height}`;

        // Remove any existing hidden fields first
        form.querySelectorAll('input[name="pottery_details"], input[name="pottery_size"]')
            .forEach(el => el.remove());

        // Add hidden fields for pottery details
        form.insertAdjacentHTML('beforeend', `
            <input type="hidden" name="pottery_details" value="${description || 'No description available'}">
            <input type="hidden" name="pottery_size" value="${size}">
        `);
    }

    submitButton.disabled = false;
    submitButton.textContent = 'Submit Order';
    modal.showModal();
}

function closeModal() {
    const modal = document.getElementById('pottery-modal');
    if (modal) {
        modal.close();
    }
}

async function updateGoogleSheet(potteryId) {
    const url = 'https://script.google.com/macros/s/AKfycbxjKiW3A3TuVk9JGIk3EKmzWDTU-HQMILKOvzC5vSq0Fz5t3ZWjI6QMBndxcv9i02Mi/exec';
    
    try {
        console.log('Updating sheet for pottery:', potteryId);
        
        const response = await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                potteryId: potteryId
            })
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating Google Sheet:', error);
        throw error;
    }
}

document.getElementById('order-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log('Starting form submission...');

    // Debug logging for form data
    const formData = new FormData(this);
    const debugData = {};
    for (let [key, value] of formData.entries()) {
        debugData[key] = value;
    }
    console.log('Form data being sent:', debugData);
    
    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    
    try {
        const potteryId = formData.get('pottery_id');
        if (!potteryId) {
            throw new Error('Pottery ID not found in form');
        }
        
        await updateGoogleSheet(potteryId);
        console.log('Sheet updated successfully');

       // Log form data before admin email
    console.log('Data being sent to admin email:');
    const adminFormData = new FormData(this);
    for (let [key, value] of adminFormData.entries()) {
        console.log(`${key}: ${value}`);
    }

    // Send admin notification
    const adminEmailResult = await emailjs.sendForm(
        'service_upmdb3d', 
        'template_uz2a3sn', 
        this, 
        'vW49wpkhQr_SdPxoQ'
    );
    console.log('Admin email sent successfully:', adminEmailResult);

    // Log form data before customer email
    console.log('Data being sent to customer email:');
    const customerFormData = new FormData(this);
    for (let [key, value] of customerFormData.entries()) {
        console.log(`${key}: ${value}`);
    }

    // Send customer confirmation
    const customerEmailResult = await emailjs.sendForm(
        'service_upmdb3d', 
        'template_nmghb6b', 
        this,
        'vW49wpkhQr_SdPxoQ'
    );
    console.log('Customer confirmation sent successfully:', customerEmailResult);

        // Update local UI
        await markPotAsTaken(potteryId);
        
        closeModal();
        alert('Order submitted successfully! Please check your email for confirmation.');
    } catch (error) {
        console.error('Failed to process order:', error);
        console.error('Error details:', error);
        alert(`Failed to submit order: ${error.message}`);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Order';
    }
});

async function markPotAsTaken(potteryId) {
    console.log('Marking pottery as taken:', potteryId);
    const index = potteryData.findIndex(item => item[0] === potteryId);
    if (index !== -1) {
        potteryData[index][6] = 'taken';
        renderPotteryItems(potteryData);
    } else {
        console.error('Pottery item not found');
    }
}