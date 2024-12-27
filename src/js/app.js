let potteryData = [];

// Attach functions to the global scope
window.openModal = openModal;
window.closeModal = closeModal;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
        const spreadsheetId = import.meta.env.VITE_GOOGLE_SHEETS_ID;

        if (!apiKey || !spreadsheetId) {
            throw new Error('Google Sheets API Key or Spreadsheet ID is not defined.');
        }

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

    form.reset();
    potteryIdInput.value = potteryId;

    const pottery = potteryData.find(item => item[0] === potteryId);
    if (pottery) {
        const [id, imageUrl, length, width, height, description] = pottery;
        const size = `${length} x ${width} x ${height}`;

        form.querySelectorAll('input[name="pottery_details"], input[name="pottery_size"]').forEach(el => el.remove());

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