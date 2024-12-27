// At the top of app.js
let potteryData = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch API key and Spreadsheet ID from environment variables
        const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
        const spreadsheetId = import.meta.env.VITE_GOOGLE_SHEETS_ID;

        if (!apiKey || !spreadsheetId) {
            throw new Error('Google Sheets API Key or Spreadsheet ID is not defined.');
        }

        // Define range and fetch data
        const range = 'Pots!H2:Q';
        potteryData = await fetchPotteryData(apiKey, spreadsheetId, range);
        console.log('Initial pottery data:', potteryData);

        // Render fetched data
        renderPotteryItems(potteryData);
    } catch (error) {
        console.error('Error initializing data:', error);
    }
});

// Fetch pottery data from Google Sheets
async function fetchPotteryData(apiKey, spreadsheetId, range) {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched data:', data);
        return data.values || [];
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// Render pottery items in the grid
function renderPotteryItems(potteryData) {
    const potteryGrid = document.getElementById('pottery-grid');
    if (!potteryGrid) {
        console.error('Pottery grid element not found');
        return;
    }

    potteryGrid.innerHTML = '';

    potteryData.forEach(([id, imageUrl, length, width, height, description, status, gifUrl, topImageUrl], index) => {
        console.log(`Rendering pot ${index + 1}:`, { id, imageUrl, gifUrl, description });

        const isTaken = status?.toLowerCase() === 'taken';

        const card = document.createElement('div');
        card.className = `card ${isTaken ? 'taken' : ''}`;

        card.innerHTML = `
            <figure>
                <img 
                    src="${imageUrl}" 
                    alt="Pottery ${id}" 
                    class="w-full h-48 object-cover ${isTaken ? 'grayscale' : ''}"
                    ${isTaken ? '' : `onmouseover="this.src='${gifUrl}'" onmouseout="this.src='${imageUrl}'"`}
                    onerror="this.onerror=null; this.src='${import.meta.env.BASE_URL}assets/images/fallback-image.jpg';">
            </figure>
            <div class="p-4">
                <h2 class="text-xl font-semibold mb-2">Pottery ${id}</h2>
                <p class="text-gray-600 mb-2">${description || 'No description available'}</p>
                <p class="text-gray-600 mb-4">Size: ${length || 0} x ${width || 0} x ${height || 0}</p>
                <button class="btn btn-primary w-full" 
                        ${isTaken ? 'disabled' : ''}
                        onclick="window.openModal('${id}')">
                    ${isTaken ? 'Taken' : 'Select'}
                </button>
            </div>
        `;

        potteryGrid.appendChild(card);
    });
}

// Open modal to select a pottery item
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

    // Reset and populate the form
    form.reset();
    potteryIdInput.value = potteryId;

    // Add pottery details and images
    const pottery = potteryData.find(item => item[0] === potteryId);
    if (pottery) {
        const [id, imageUrl, length, width, height, description, status, gifUrl, topImageUrl] = pottery;
        const size = `${length} x ${width} x ${height}`;

        // Populate images in the modal
        const imageContainer = document.getElementById('modal-images');
        imageContainer.innerHTML = `
            <img src="${imageUrl}" alt="Pottery Image 1" class="w-1/2 h-48 object-cover">
            <img src="${topImageUrl}" alt="Pottery Image 2" class="w-1/2 h-48 object-cover">
        `;

        // Add hidden fields for details
        form.querySelectorAll('input[name="pottery_details"], input[name="pottery_size"]')
            .forEach(el => el.remove());

        form.insertAdjacentHTML('beforeend', `
            <input type="hidden" name="pottery_details" value="${description || 'No description available'}">
            <input type="hidden" name="pottery_size" value="${size}">
        `);
    }

    submitButton.disabled = false;
    submitButton.textContent = 'Submit Order';
    modal.showModal();
}

// Close the modal
function closeModal() {
    const modal = document.getElementById('pottery-modal');
    if (modal) {
        modal.close();
    }
}

// Update the Google Sheet to mark pottery as taken
async function updateGoogleSheet(potteryId) {
    const url = 'https://script.google.com/macros/s/AKfycbxQDAvOoUE_eGI69UPPd74jZJEQOkMsx5DNf_wq0YzhhKlVrjKVSk7knIQ6ZlH8LKyi/exec';
    try {
        console.log('Updating sheet for pottery:', potteryId);

        const response = await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ potteryId }),
        });

        console.log('Google Sheet Response:', response);
        return { success: true };
    } catch (error) {
        console.error('Error updating Google Sheet:', error);
        throw error;
    }
}

// Handle order form submission
document.getElementById('order-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    console.log('Starting form submission...');

    const formData = new FormData(this);
    const potteryId = formData.get('pottery_id');

    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
        if (!potteryId) {
            throw new Error('Pottery ID not found in form');
        }

        await updateGoogleSheet(potteryId);
        console.log('Sheet updated successfully');

        const adminEmailResult = await emailjs.sendForm(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID,
            this,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
        console.log('Admin email sent successfully:', adminEmailResult);

        const customerEmailResult = await emailjs.sendForm(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID,
            this,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
        console.log('Customer email sent successfully:', customerEmailResult);

        await markPotAsTaken(potteryId);
        closeModal();
        alert('Order submitted successfully! Please check your email for confirmation.');
    } catch (error) {
        console.error('Error processing order:', error);
        alert(`Failed to submit order: ${error.message}`);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Order';
    }
});

// Mark pottery as taken in the local data
async function markPotAsTaken(potteryId) {
    const index = potteryData.findIndex(item => item[0] === potteryId);
    if (index !== -1) {
        potteryData[index][6] = 'taken';
        renderPotteryItems(potteryData);
    } else {
        console.error('Pottery item not found');
    }
}