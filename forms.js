/**
 * Forms Handling for DIC Humanities Club
 * Handles contact forms, membership registration, and form validation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all forms
    initContactForm();
    initMembershipForm();
    initNewsletterForm();
    initFormValidations();
});

/**
 * Contact Form Handler
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm(this)) return;
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Collect form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Simulate API call (replace with actual endpoint)
            await simulateAPICall('/api/contact', data);
            
            // Show success message
            showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
            this.reset();
            
        } catch (error) {
            console.error('Contact form error:', error);
            showToast('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

/**
 * Membership Registration Form Handler
 */
function initMembershipForm() {
    const membershipForm = document.getElementById('membershipForm');
    if (!membershipForm) return;

    // Student ID validation
    const studentIdInput = membershipForm.querySelector('[name="student_id"]');
    if (studentIdInput) {
        studentIdInput.addEventListener('input', function(e) {
            const value = e.target.value;
            if (value && !/^[A-Z0-9]+$/.test(value)) {
                this.setCustomValidity('Please enter a valid student ID (letters and numbers only)');
            } else {
                this.setCustomValidity('');
            }
        });
    }

    // Department selection
    const departmentSelect = membershipForm.querySelector('[name="department"]');
    if (departmentSelect) {
        departmentSelect.addEventListener('change', function(e) {
            const otherDept = membershipForm.querySelector('#otherDepartment');
            if (otherDept) {
                otherDept.style.display = e.target.value === 'other' ? 'block' : 'none';
                if (e.target.value !== 'other') {
                    otherDept.value = '';
                }
            }
        });
    }

    // Form submission
    membershipForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm(this)) return;
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            
            // Collect form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Combine department fields if "other" is selected
            if (data.department === 'other' && data.other_department) {
                data.department = data.other_department;
                delete data.other_department;
            }
            
            // Simulate API call (replace with actual endpoint)
            await simulateAPICall('/api/membership', data);
            
            // Show success message
            showToast('Membership application submitted successfully! We\'ll contact you soon.', 'success');
            this.reset();
            
            // Show confirmation modal
            showMembershipConfirmation(data);
            
        } catch (error) {
            console.error('Membership form error:', error);
            showToast('Failed to submit application. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

/**
 * Newsletter Subscription Form Handler
 */
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('[name="email"]');
        if (!emailInput || !validateEmail(emailInput.value)) {
            showToast('Please enter a valid email address.', 'warning');
            emailInput.focus();
            return;
        }
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            
            // Simulate API call
            await simulateAPICall('/api/newsletter', { email: emailInput.value });
            
            // Show success message
            showToast('Successfully subscribed to newsletter!', 'success');
            this.reset();
            
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            showToast('Subscription failed. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

/**
 * Initialize form validations
 */
function initFormValidations() {
    // Real-time validation for all forms
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('input', function(e) {
            const input = e.target;
            if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA' || input.tagName === 'SELECT') {
                validateField(input);
            }
        });
        
        form.addEventListener('blur', function(e) {
            const input = e.target;
            if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA' || input.tagName === 'SELECT') {
                validateField(input, true);
            }
        }, true);
    });
}

/**
 * Validate a single form field
 */
function validateField(input, showError = false) {
    const errorElement = input.parentElement.querySelector('.error-message');
    
    // Clear previous error
    if (errorElement) {
        errorElement.remove();
    }
    
    // Remove error styling
    input.classList.remove('error');
    
    // Check if field is required and empty
    if (input.hasAttribute('required') && !input.value.trim()) {
        if (showError) {
            showFieldError(input, 'This field is required');
        }
        return false;
    }
    
    // Email validation
    if (input.type === 'email' && input.value.trim()) {
        if (!validateEmail(input.value)) {
            if (showError) {
                showFieldError(input, 'Please enter a valid email address');
            }
            return false;
        }
    }
    
    // Phone number validation
    if (input.type === 'tel' && input.value.trim()) {
        if (!validatePhone(input.value)) {
            if (showError) {
                showFieldError(input, 'Please enter a valid phone number');
            }
            return false;
        }
    }
    
    // URL validation
    if (input.type === 'url' && input.value.trim()) {
        if (!validateURL(input.value)) {
            if (showError) {
                showFieldError(input, 'Please enter a valid URL');
            }
            return false;
        }
    }
    
    // Custom validation based on pattern
    if (input.hasAttribute('pattern') && input.value.trim()) {
        const pattern = new RegExp(input.getAttribute('pattern'));
        if (!pattern.test(input.value)) {
            if (showError) {
                const title = input.getAttribute('title') || 'Please match the requested format';
                showFieldError(input, title);
            }
            return false;
        }
    }
    
    return true;
}

/**
 * Validate entire form
 */
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        if (!validateField(input, true)) {
            isValid = false;
        }
    });
    
    // Check if all required fields are filled
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Show error message for a field
 */
function showFieldError(input, message) {
    // Remove existing error
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error styling
    input.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #dc2626;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    `;
    
    // Insert after input
    input.parentElement.appendChild(errorElement);
    
    // Focus on first error
    if (!document.querySelector('.error:focus')) {
        input.focus();
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(toast => toast.remove());
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close">&times;</button>
    `;
    
    // Style the toast
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getToastColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add close button event
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
    
    document.body.appendChild(toast);
}

/**
 * Show membership confirmation modal
 */
function showMembershipConfirmation(data) {
    const modal = document.createElement('div');
    modal.className = 'confirmation-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Application Submitted Successfully!</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="confirmation-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <p>Thank you for applying to join the DIC Humanities Club!</p>
                <div class="application-details">
                    <h4>Application Details:</h4>
                    <p><strong>Name:</strong> ${data.name}</p>
                    <p><strong>Student ID:</strong> ${data.student_id}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Department:</strong> ${data.department}</p>
                </div>
                <div class="next-steps">
                    <h4>What's Next?</h4>
                    <ul>
                        <li>You'll receive a confirmation email within 24 hours</li>
                        <li>Our team will review your application</li>
                        <li>You'll be invited for an orientation session</li>
                        <li>Follow our social media for updates</li>
                    </ul>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" id="closeModal">Close</button>
            </div>
        </div>
    `;
    
    // Style the modal
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        animation: scaleIn 0.3s ease;
    `;
    
    // Add close events
    const closeBtn = modal.querySelector('.modal-close');
    const closeModalBtn = modal.querySelector('#closeModal');
    
    const closeModal = () => {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    document.body.appendChild(modal);
}

/**
 * Utility Functions
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[0-9\s\-\(\)]+$/;
    return re.test(phone);
}

function validateURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function getToastIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getToastColor(type) {
    const colors = {
        success: '#10b981',
        error: '#dc2626',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || '#3b82f6';
}

async function simulateAPICall(endpoint, data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate random success (90% success rate for demo)
    if (Math.random() < 0.9) {
        return { success: true, message: 'Form submitted successfully' };
    } else {
        throw new Error('Network error. Please try again.');
    }
}

// Export for use in other modules
window.formHandlers = {
    validateForm,
    validateEmail,
    validatePhone,
    showToast
};