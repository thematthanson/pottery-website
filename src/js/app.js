// Define API URL globally
const apiUrl = 'https://script.google.com/macros/s/AKfycbwRrP7dfNH59F5O8EV-_jS99WSxhpjb9tYmwF2wx9o6ZNp6ntX18w1Fx-dhe_9lhEam/exec';

// Import EmailJS
import emailjs from '@emailjs/browser';

// Initialize EmailJS
emailjs.init({
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
});

// Global pottery data
let potteryData = [];

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
        const spreadsheetId = import.meta.env.VITE_GOOGLE_SHEETS_ID;

        if (!apiKey || !spreadsheetId) {
            throw new Error('Google Sheets API Key or Spreadsheet ID is not defined.');
        }

        const range = 'Pots!H2:Q';
        potteryData = await fetchPotteryData(apiKey, spreadsheetId, range);
        console.log('Fetched pottery data:', potteryData);

        renderPotteryItems(potteryData);
    } catch (error) {
        console.error('Error initializing data:', error);
    }
});

// Fetch pottery data
async function fetchPotteryData(apiKey, spreadsheetId, range) {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.values || !Array.isArray(data.values)) {
            console.error('Invalid data format:', data);
            return [];
        }

        return data.values;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// Render pottery cards
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
        card.className = `card ${isTaken ? 'taken' : ''} bg-[#FFFBF5]`;

        card.innerHTML = `
            <figure>
                <img 
                    src="${imageUrl}" 
                    alt="Piece ${id}" 
                    class="w-full h-auto object-cover rounded-[15px] ${isTaken ? 'grayscale' : ''}"
                    ${isTaken ? '' : `onmouseover="this.src='${gifUrl}'" onmouseout="this.src='${imageUrl}'"`}
                    onerror="this.onerror=null; this.src='${import.meta.env.BASE_URL}assets/images/fallback-image.jpg';">
            </figure>
            <div class="p-4">
                <h2 class="text-xl font-semibold mb-2">Piece ${id}</h2>
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

// Open modal
function openModal(potteryId) {
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
            <div class="flex flex-col items-center">
                <div class="image-container">
                    <img src="${imageUrl}" alt="Side view" class="modal-image">
                </div>
                <p class="text-sm text-gray-600 mt-2">Side view</p>
            </div>
            <div class="flex flex-col items-center">
                <div class="image-container">
                    <img src="${topImageUrl}" alt="Top view" class="modal-image">
                </div>
                <p class="text-sm text-gray-600 mt-2">Top view</p>
            </div>
        `;
    }

    modal.showModal();
}

// Close modal
function closeModal() {
    const modal = document.getElementById('pottery-modal');
    if (modal) modal.close();
}

// Update pottery status in Google Sheets
async function updateGoogleSheet(potteryId, userName) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ potteryId, userName }), // Send both potteryId and userName
        });

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error);
        }
        console.log('Google Sheet updated successfully:', result.message);
    } catch (error) {
        console.error('Error updating Google Sheets:', error);
        throw new Error('Failed to update Google Sheets');
    }
}

// Mark pottery as taken locally
function markPotteryAsTaken(potteryId) {
    const potteryIndex = potteryData.findIndex(item => item[0] === potteryId);
    if (potteryIndex !== -1) {
        potteryData[potteryIndex][6] = 'taken';
        renderPotteryItems(potteryData);
    } else {
        console.error('Pottery ID not found in local data');
    }
}

// Handle form submission
document.getElementById('order-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = this;
    const submitButton = form.querySelector('button[type="submit"]');
    const normalText = submitButton.querySelector('.normal-text');
    const loadingText = submitButton.querySelector('.loading-text');
    const formData = new FormData(form);
    const potteryId = formData.get('pottery_id');
    const userName = formData.get('user_name'); // Capture the user's name

    try {
        // Update UI to loading state
        submitButton.disabled = true;
        normalText.classList.add('hidden');
        loadingText.classList.remove('hidden');

        // Update Google Sheet
        await updateGoogleSheet(potteryId, userName);

        // Update local state and UI
        markPotteryAsTaken(potteryId);

        // Show success message
        alert(`Thank you for ordering Piece ${potteryId}!`);

        // Close modal
        closeModal();
    } catch (error) {
        console.error('Order submission error:', error);
        alert(`Failed to submit the order: ${error.message}`);
    } finally {
        // Reset UI state
        submitButton.disabled = false;
        normalText.classList.remove('hidden');
        loadingText.classList.add('hidden');
    }
});

// Make modal functions globally accessible
window.openModal = openModal;
window.closeModal = closeModal;