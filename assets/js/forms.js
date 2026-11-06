/**
 * SteelCraft - Interactive Forms & Validation Engine
 * Handles Contact Form, Project Technical Enquiry, File Upload Drag-Drop,
 * Authentication Forms (Login/Register), and Developer API Hooks.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. FILE ATTACHMENT DRAG & DROP FOR PROJECT ENQUIRY
     ========================================================================== */
  const dropZone = document.querySelector('.file-upload-box');
  const fileInput = document.getElementById('projectFiles');
  const fileDisplay = document.getElementById('file-upload-info');

  if (dropZone && fileInput) {
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
      }, false);
    });

    dropZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      fileInput.files = files;
      updateFileDisplay(files);
    });

    fileInput.addEventListener('change', () => {
      updateFileDisplay(fileInput.files);
    });

    function updateFileDisplay(files) {
      if (!fileDisplay) return;
      if (files.length > 0) {
        const names = Array.from(files).map(f => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)} MB)`).join(', ');
        fileDisplay.innerHTML = `<span class="text-success"><i class="fa-solid fa-file-circle-check me-2"></i>Attached: <strong>${names}</strong></span>`;
      } else {
        fileDisplay.innerHTML = `<span class="text-muted">PDF, DWG, DXF, STP, ZIP up to 25MB</span>`;
      }
    }
  }

  /* ==========================================================================
     2. PROJECT ENQUIRY FORM VALIDATION & SUBMISSION
     ========================================================================== */
  const projectEnquiryForm = document.getElementById('projectEnquiryForm');
  if (projectEnquiryForm) {
    projectEnquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!projectEnquiryForm.checkValidity()) {
        e.stopPropagation();
        projectEnquiryForm.classList.add('was-validated');
        return;
      }

      const submitBtn = projectEnquiryForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Processing Enquiry...';

      // Gather form data
      const formData = new FormData(projectEnquiryForm);
      const data = Object.fromEntries(formData.entries());

      /* 
       * DEVELOPER API INTEGRATION NOTE:
       * Replace this simulation timeout with your backend endpoint, e.g.:
       * fetch('/api/v1/enquiries', { method: 'POST', body: formData })
       *   .then(res => res.json())
       *   .then(...)
       */
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        const alertBox = document.getElementById('projectFormAlert');
        if (alertBox) {
          alertBox.className = 'form-alert success d-block';
          alertBox.innerHTML = `
            <div class="d-flex align-items-center gap-3">
              <i class="fa-solid fa-circle-check fa-2x text-success"></i>
              <div>
                <strong>Enquiry Received Successfully!</strong>
                <p class="mb-0 small">Thank you, <b>${data.fullName || 'Valued Client'}</b>. Our chief structural engineering team will review your specifications for <b>${data.serviceRequired || 'Structural Works'}</b> and contact you at <b>${data.email}</b> within 24 business hours.</p>
              </div>
            </div>
          `;
        }
        projectEnquiryForm.reset();
        projectEnquiryForm.classList.remove('was-validated');
        if (fileDisplay) {
          fileDisplay.innerHTML = `<span class="text-muted">PDF, DWG, DXF, STP, ZIP up to 25MB</span>`;
        }
      }, 1200);
    });
  }

  /* ==========================================================================
     3. CONTACT ENQUIRY FORM VALIDATION
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        e.stopPropagation();
        contactForm.classList.add('was-validated');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Sending Message...';

      const emailVal = contactForm.querySelector('input[type="email"]')?.value;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        const alertBox = document.getElementById('contactFormAlert');
        if (alertBox) {
          alertBox.className = 'form-alert success d-block';
          alertBox.innerHTML = `
            <div class="d-flex align-items-center gap-3">
              <i class="fa-solid fa-circle-check fa-2x text-success"></i>
              <div>
                <strong>Message Dispatched!</strong>
                <p class="mb-0 small">Thank you for reaching out. We have sent an automated confirmation to <b>${emailVal}</b>.</p>
              </div>
            </div>
          `;
        }
        contactForm.reset();
        contactForm.classList.remove('was-validated');
      }, 1000);
    });
  }

  /* ==========================================================================
     4. LOGIN FORM & PASSWORD VISIBILITY
     ========================================================================== */
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!loginForm.checkValidity()) {
        e.stopPropagation();
        loginForm.classList.add('was-validated');
        return;
      }

      const alertBox = document.getElementById('loginAlert');
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Authenticating...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Sign In to Portal <i class="fa-solid fa-arrow-right ms-2"></i>';
        if (alertBox) {
          alertBox.className = 'form-alert success d-block';
          alertBox.innerHTML = '<i class="fa-solid fa-circle-check me-2"></i>Authentication successful. Redirecting to client dashboard...';
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1500);
        }
      }, 1000);
    });
  }

  /* ==========================================================================
     5. REGISTER FORM & PASSWORD STRENGTH
     ========================================================================== */
  const registerForm = document.getElementById('registerForm');
  const regPassword = document.getElementById('regPassword');
  const regConfirm = document.getElementById('regConfirmPassword');
  const strengthMeter = document.getElementById('passwordStrength');

  if (regPassword && strengthMeter) {
    regPassword.addEventListener('input', () => {
      const val = regPassword.value;
      let strength = 0;
      if (val.length >= 8) strength++;
      if (/[A-Z]/.test(val)) strength++;
      if (/[0-9]/.test(val)) strength++;
      if (/[^A-Za-z0-9]/.test(val)) strength++;

      const strengthTexts = ['Weak', 'Moderate', 'Strong', 'Very Strong'];
      const strengthColors = ['#EF4444', '#F59E0B', '#10B981', '#059669'];

      if (val.length === 0) {
        strengthMeter.innerHTML = '';
      } else {
        const text = strengthTexts[strength - 1] || 'Weak';
        const color = strengthColors[strength - 1] || '#EF4444';
        strengthMeter.innerHTML = `<small style="color:${color}; font-weight:600;"><i class="fa-solid fa-shield-halved me-1"></i>Password Strength: ${text}</small>`;
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (regPassword && regConfirm && regPassword.value !== regConfirm.value) {
        regConfirm.setCustomValidity('Passwords do not match');
      } else if (regConfirm) {
        regConfirm.setCustomValidity('');
      }

      if (!registerForm.checkValidity()) {
        e.stopPropagation();
        registerForm.classList.add('was-validated');
        return;
      }

      const submitBtn = registerForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Creating Account...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Register Account <i class="fa-solid fa-arrow-right ms-2"></i>';
        const alertBox = document.getElementById('registerAlert');
        if (alertBox) {
          alertBox.className = 'form-alert success d-block';
          alertBox.innerHTML = '<i class="fa-solid fa-circle-check me-2"></i>Account successfully registered! Please check your email for the verification link.';
          registerForm.reset();
          registerForm.classList.remove('was-validated');
        }
      }, 1200);
    });
  }

  /* Password Toggle Visibility */
  document.querySelectorAll('.toggle-password-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
        } else {
          input.type = 'password';
          btn.innerHTML = '<i class="fa-solid fa-eye"></i>';
        }
      }
    });
  });

  /* ==========================================================================
     6. NEWSLETTER SUBSCRIPTION FORMS
     ========================================================================== */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const feedback = form.querySelector('.newsletter-feedback');
      if (input && input.checkValidity() && input.value.trim() !== '') {
        if (feedback) {
          feedback.innerHTML = '<span class="text-success small"><i class="fa-solid fa-check me-1"></i>Thank you! Subscribed to engineering bulletins.</span>';
        }
        input.value = '';
      } else if (feedback) {
        feedback.innerHTML = '<span class="text-danger small"><i class="fa-solid fa-circle-exclamation me-1"></i>Please enter a valid email.</span>';
      }
    });
  });

  /* ==========================================================================
     7. BLOG REAL-TIME SEARCH & FILTER
     ========================================================================== */
  const blogSearchInput = document.getElementById('blogSearchInput');
  const blogCards = document.querySelectorAll('.blog-article-item');
  if (blogSearchInput && blogCards.length > 0) {
    blogSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      blogCards.forEach(card => {
        const title = card.querySelector('.blog-card-title')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.blog-card-desc')?.textContent.toLowerCase() || '';
        if (title.includes(query) || desc.includes(query)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }


  /* ==========================================================================
     8. REAL-TIME INPUT ENFORCEMENT (NAME: NO NUMBERS, PHONE: NO ALPHABETS)
     ========================================================================== */
  // A. Name inputs: Block and strip numbers (0-9)
  const nameInputs = document.querySelectorAll(
    '#cName, #fullName, #regFullName, input[name="fullName"], input[name="cName"], input[id*="Name" i], input[placeholder*="Name" i]'
  );

  nameInputs.forEach(input => {
    // Intercept keystroke
    input.addEventListener('keydown', (e) => {
      // Allow control keys (backspace, tab, delete, enter, arrows, copy/paste shortcuts)
      if (e.ctrlKey || e.altKey || e.metaKey || e.key.length > 1) return;
      // Block numbers 0-9
      if (/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    });

    // Strip numbers on input (handles paste, drag-and-drop, autofill)
    input.addEventListener('input', function () {
      if (/[0-9]/.test(this.value)) {
        this.value = this.value.replace(/[0-9]/g, '');
      }
    });
  });

  // B. Phone Number inputs: Block and strip alphabetic characters (a-z, A-Z)
  const phoneInputs = document.querySelectorAll(
    'input[type="tel"], #phoneNumber, #regPhone, input[name="phoneNumber"], input[id*="phone" i], input[placeholder*="555" i]'
  );

  phoneInputs.forEach(input => {
    // Intercept keystroke
    input.addEventListener('keydown', (e) => {
      // Allow control keys (backspace, tab, delete, enter, arrows, copy/paste shortcuts)
      if (e.ctrlKey || e.altKey || e.metaKey || e.key.length > 1) return;
      // Block alphabets a-z, A-Z
      if (/[a-zA-Z]/.test(e.key)) {
        e.preventDefault();
      }
    });

    // Strip letters on input (handles paste, drag-and-drop, autofill)
    input.addEventListener('input', function () {
      if (/[a-zA-Z]/.test(this.value)) {
        this.value = this.value.replace(/[a-zA-Z]/g, '');
      }
    });
  });

});
