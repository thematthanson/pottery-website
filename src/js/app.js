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
        const range = 'Pots!H2:Q'; // Ensure this matches your Google Sheet layout
        potteryData = await fetchPotteryData(apiKey, spreadsheetId, range);
        console.log('Fetched pottery data:', potteryData);

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

        if (!data.values || !Array.isArray(data.values)) {
            console.error('Data is not in the expected format:', data);
            return [];
        }

        return data.values;
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

    potteryData.forEach(([id, imageUrl, length, width, height, description, status, price, gifUrl, topImageUrl]) => {
        const isTaken = status?.toLowerCase() === 'taken';

        const card = document.createElement('div');
        card.className = `card ${isTaken ? 'taken' : ''}`;

        card.innerHTML = `
            <figure>
                <img 
                    src="${imageUrl}" 
                    alt="Pottery ${id}" 
                    class="w-full h-auto object-cover rounded-[15px] ${isTaken ? 'grayscale' : ''}"
                    ${isTaken ? '' : `onmouseover="this.src='${gifUrl}'" onmouseout="this.src='${imageUrl}'"`}
                    onerror="this.onerror=null; this.src='${import.meta.env.BASE_URL}assets/images/fallback-image.jpg';">
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

// Open modal to select a pottery item
function openModal(potteryId) {
    console.log('Opening modal for pottery:', potteryId);

    const modal = document.getElementById('pottery-modal');
    if (!modal) {
        console.error('Modal element not found');
        return;
    }

    const form = modal.querySelector('form');
    const potteryIdInput = form.querySelector('input[name="pottery_id"]');
    if (!form || !potteryIdInput) {
        console.error('Form or pottery ID input not found in modal');
        return;
    }

    form.reset();
    potteryIdInput.value = potteryId;

    const pottery = potteryData.find(item => item[0] === potteryId);
    if (!pottery) {
        console.error('Pottery item not found for ID:', potteryId);
        return;
    }

    const [id, imageUrl, , , , , , , , topImageUrl] = pottery;

    const imageContainer = document.getElementById('modal-images');
    if (imageContainer) {
        imageContainer.innerHTML = `
            <img src="${imageUrl}" alt="Pottery Image 1" class="w-1/2 h-48 object-cover rounded-[15px]">
            <img src="${topImageUrl}" alt="Pottery Image 2" class="w-1/2 h-48 object-cover rounded-[15px]">
        `;
    }

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

        await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ potteryId }),
        });

        console.log('Google Sheet update successful');
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

// Make `openModal` function globally accessible
window.openModal = openModal;