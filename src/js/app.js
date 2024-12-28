// Define API URL globally
const apiUrl = 'https://script.google.com/macros/s/AKfycbxJlyW8nblHwZu-T7wIqxrVvnnwnM1OKi9ISxo--sf820OWfy7FI5-Gofk2uYyAXPgJ/exec';

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
        <img src="${imageUrl}" alt="Side view" class="modal-image rounded-[15px]">
        <p class="text-sm text-gray-600 mt-2">Side view</p>
      </div>
      <div class="flex flex-col items-center">
        <img src="${topImageUrl}" alt="Top view" class="modal-image rounded-[15px]">
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
async function updateGoogleSheet(potteryId) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ potteryId }),
    });

    return { success: true };
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
document.getElementById('order-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const form = this;
  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);
  const potteryId = formData.get('pottery_id');

  try {
    // Disable submit button while processing
    if (submitButton) submitButton.disabled = true;

    // Find pottery details
    const pottery = potteryData.find(item => item[0] === potteryId);
    if (!pottery) throw new Error('Pottery not found');

    // Prepare template params
    const templateParams = {
      to_email: formData.get('user_email'),
      to_name: formData.get('user_name'),
      shipping_address: formData.get('user_address'),
      pottery_id: potteryId,
      pottery_description: pottery[5] || 'No description available',
      pottery_dimensions: `${pottery[2] || 0} x ${pottery[3] || 0} x ${pottery[4] || 0}`
    };
    console.log('Email template params:', templateParams);

    // Send email to customer
const customerEmailResponse = await emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID,
    templateParams,
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY  // Add public key here
).catch(error => {
    console.error('Customer EmailJS error:', error);
    throw error;
});

// Send email to admin
const adminEmailResponse = await emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID,
    templateParams,
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY  // Add public key here
).catch(error => {
    console.error('Admin EmailJS error:', error);
    throw error;
});

    console.log('Admin email response:', adminEmailResponse);

    // Check both responses
    if (customerEmailResponse.status !== 200 || adminEmailResponse.status !== 200) {
      throw new Error('Failed to send one or more emails');
    }

    // Update Google Sheet
    await updateGoogleSheet(potteryId);

    // Update local state and UI
    markPotteryAsTaken(potteryId);
    
    // Show success message
    alert(`Thank you for ordering Piece ${potteryId}! A confirmation email has been sent to ${formData.get('user_email')}`);
    
    // Close modal
    closeModal();
  } catch (error) {
    console.error('Error during order submission:', error);
    alert('Failed to submit the order. Please try again.');
  } finally {
    // Re-enable submit button
    if (submitButton) submitButton.disabled = false;
  }
});

// Make modal functions globally accessible
window.openModal = openModal;
window.closeModal = closeModal;