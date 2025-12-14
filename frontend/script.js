// ============================================
// Vehicle Service Management - Frontend Logic
// ============================================

// API Base URL
const API_URL = 'https://vehicleservicemanagementsystem-production.up.railway.app/api';



// Global Variables
let isEditMode = false;
let currentEditId = null;

// DOM Elements
const serviceForm = document.getElementById('serviceForm');
const serviceTableBody = document.getElementById('serviceTableBody');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const showAllBtn = document.getElementById('showAllBtn');
const messageContainer = document.getElementById('messageContainer');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const cancelBtn = document.getElementById('cancelBtn');
const noDataMessage = document.getElementById('noDataMessage');

// ============================================
// Initialize App
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadAllServices();
    setupEventListeners();
});

// ============================================
// Event Listeners
// ============================================
function setupEventListeners() {
    // Form submission
    serviceForm.addEventListener('submit', handleFormSubmit);
    
    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Show all records
    showAllBtn.addEventListener('click', loadAllServices);
    
    // Cancel edit mode
    cancelBtn.addEventListener('click', resetForm);
}

// ============================================
// Form Submit Handler
// ============================================
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        vehicle_no: document.getElementById('vehicle_no').value.trim(),
        owner_name: document.getElementById('owner_name').value.trim(),
        service_type: document.getElementById('service_type').value,
        service_date: document.getElementById('service_date').value,
        next_service_date: document.getElementById('next_service_date').value || null,
        cost: document.getElementById('cost').value || null,
        remarks: document.getElementById('remarks').value.trim() || null
    };
    
    // Validation
    if (!validateForm(formData)) {
        return;
    }
    
    try {
        if (isEditMode) {
            // Update existing service
            await updateService(currentEditId, formData);
        } else {
            // Add new service
            await addService(formData);
        }
    } catch (error) {
        showMessage('error', 'Operation failed. Please try again.');
        console.error('Error:', error);
    }
}

// ============================================
// Validation Function
// ============================================
function validateForm(data) {
    // Check required fields
    if (!data.vehicle_no || !data.owner_name || !data.service_type || !data.service_date) {
        showMessage('error', 'Please fill all required fields');
        return false;
    }
    
    // Validate cost if provided
    if (data.cost && (isNaN(data.cost) || parseFloat(data.cost) < 0)) {
        showMessage('error', 'Please enter a valid cost');
        return false;
    }
    
    // Validate dates
    if (data.next_service_date && data.next_service_date < data.service_date) {
        showMessage('error', 'Next service date cannot be before service date');
        return false;
    }
    
    return true;
}

// ============================================
// API Functions
// ============================================

// Add New Service
async function addService(data) {
    try {
        const response = await fetch(`${API_URL}/services`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('success', 'Service added successfully!');
            resetForm();
            loadAllServices();
        } else {
            showMessage('error', result.message || 'Failed to add service');
        }
    } catch (error) {
        showMessage('error', 'Network error. Please check your connection.');
        console.error('Add service error:', error);
    }
}

// Load All Services
async function loadAllServices() {
    try {
        const response = await fetch(`${API_URL}/services`);
        const result = await response.json();
        
        if (result.success) {
            displayServices(result.data);
        } else {
            showMessage('error', 'Failed to load services');
        }
    } catch (error) {
        showMessage('error', 'Failed to load services. Please check your connection.');
        console.error('Load services error:', error);
    }
}

// Search Service by Vehicle Number
async function handleSearch() {
    const vehicleNo = searchInput.value.trim();
    
    if (!vehicleNo) {
        showMessage('error', 'Please enter a vehicle number to search');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/services/search/${encodeURIComponent(vehicleNo)}`);
        const result = await response.json();
        
        if (result.success) {
            displayServices(result.data);
            if (result.data.length === 0) {
                showMessage('error', 'No services found for this vehicle number');
            }
        } else {
            showMessage('error', 'Search failed');
        }
    } catch (error) {
        showMessage('error', 'Search failed. Please try again.');
        console.error('Search error:', error);
    }
}

// Update Service
async function updateService(id, data) {
    try {
        const response = await fetch(`${API_URL}/services/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('success', 'Service updated successfully!');
            resetForm();
            loadAllServices();
        } else {
            showMessage('error', result.message || 'Failed to update service');
        }
    } catch (error) {
        showMessage('error', 'Update failed. Please try again.');
        console.error('Update service error:', error);
    }
}

// Delete Service
async function deleteService(id) {
    if (!confirm('Are you sure you want to delete this service record?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/services/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('success', 'Service deleted successfully!');
            loadAllServices();
        } else {
            showMessage('error', result.message || 'Failed to delete service');
        }
    } catch (error) {
        showMessage('error', 'Delete failed. Please try again.');
        console.error('Delete service error:', error);
    }
}

// ============================================
// Display Functions
// ============================================
function displayServices(services) {
    // Clear existing table
    serviceTableBody.innerHTML = '';
    
    // Check if no services
    if (services.length === 0) {
        noDataMessage.style.display = 'block';
        return;
    }
    
    noDataMessage.style.display = 'none';
    
    // Populate table
    services.forEach(service => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${service.service_id}</td>
            <td><strong>${service.vehicle_no}</strong></td>
            <td>${service.owner_name}</td>
            <td>${service.service_type}</td>
            <td>${formatDate(service.service_date)}</td>
            <td>${service.next_service_date ? formatDate(service.next_service_date) : '-'}</td>
            <td>${service.cost ? '₹' + parseFloat(service.cost).toFixed(2) : '-'}</td>
            <td>${service.remarks || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="editService(${service.service_id})">Edit</button>
                    <button class="btn btn-delete" onclick="deleteService(${service.service_id})">Delete</button>
                </div>
            </td>
        `;
        
        serviceTableBody.appendChild(row);
    });
}

// ============================================
// Edit Function
// ============================================
async function editService(id) {
    // Find the service in the current table
    const services = await fetchServiceById(id);
    
    if (!services) {
        showMessage('error', 'Service not found');
        return;
    }
    
    // Populate form with service data
    document.getElementById('vehicle_no').value = services.vehicle_no;
    document.getElementById('owner_name').value = services.owner_name;
    document.getElementById('service_type').value = services.service_type;
    document.getElementById('service_date').value = services.service_date;
    document.getElementById('next_service_date').value = services.next_service_date || '';
    document.getElementById('cost').value = services.cost || '';
    document.getElementById('remarks').value = services.remarks || '';
    
    // Switch to edit mode
    isEditMode = true;
    currentEditId = id;
    btnText.textContent = 'Update Service';
    cancelBtn.style.display = 'inline-block';
    
    // Scroll to form
    serviceForm.scrollIntoView({ behavior: 'smooth' });
}

// Fetch single service (helper function)
async function fetchServiceById(id) {
    try {
        const response = await fetch(`${API_URL}/services`);
        const result = await response.json();
        
        if (result.success) {
            return result.data.find(service => service.service_id === id);
        }
    } catch (error) {
        console.error('Fetch service error:', error);
    }
    return null;
}

// ============================================
// Utility Functions
// ============================================

// Reset Form
function resetForm() {
    serviceForm.reset();
    isEditMode = false;
    currentEditId = null;
    btnText.textContent = 'Add Service';
    cancelBtn.style.display = 'none';
}

// Format Date
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Show Message
function showMessage(type, message) {
    // Clear previous messages
    messageContainer.innerHTML = '';
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    messageContainer.appendChild(messageDiv);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// Make functions globally accessible for inline onclick handlers
window.editService = editService;
window.deleteService = deleteService;