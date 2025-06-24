// script.js

let currentSection = 0;
const sections = document.querySelectorAll('.form-section');

function showSection(index) {
  sections.forEach((section, i) => {
    section.classList.toggle('active', i === index);
  });
  updateProgressBar(index);
}

// Update progress bar width
function updateProgressBar(index) {
  const progress = document.getElementById('progress');
  const percent = ((index + 1) / sections.length) * 100;
  progress.style.width = percent + '%';
}

function nextSection() {
  if (!validateSection(currentSection)) return;
  if (currentSection < sections.length - 1) {
    currentSection++;
    showSection(currentSection);
  }
}

function prevSection() {
  if (currentSection > 0) {
    currentSection--;
    showSection(currentSection);
  }
}

// Validate all required fields in current section
function validateSection(index) {
  const section = sections[index];
  const requiredFields = section.querySelectorAll('[required]');
  for (const field of requiredFields) {
    // For input/select/textarea fields
    if (field.offsetParent === null) continue; // skip hidden fields

    if (field.type === 'checkbox' || field.type === 'radio') {
      // If it's a checkbox or radio, check if any in group checked
      const groupName = field.name;
      const groupFields = section.querySelectorAll(`[name="${groupName}"]`);
      let checked = false;
      groupFields.forEach(gf => {
        if (gf.checked) checked = true;
      });
      if (!checked) {
        alert('Please select a required option.');
        field.focus();
        return false;
      }
    } else if (!field.value.trim()) {
      alert('Please fill all required fields.');
      field.focus();
      return false;
    }
  }
  return true;
}

// Toggle display of "Other" text fields based on dropdown value
function toggleOtherField(selectElement, targetDivId) {
  const div = document.getElementById(targetDivId);
  if (!div) return;
  if (selectElement.value === 'Other') {
    div.style.display = 'block';
    // Make the input inside required
    const input = div.querySelector('input');
    if (input) input.required = true;
  } else {
    div.style.display = 'none';
    const input = div.querySelector('input');
    if (input) {
      input.required = false;
      input.value = '';
    }
  }
}

// Toggle fields related to Malaysia residency
function toggleMalaysiaFields() {
  const isMalaysia = document.getElementById('currentlyInMalaysia').value === 'Yes';
  const addr = document.getElementById('completeAddressMalaysia');
  const years = document.getElementById('yearsOfStayMalaysia');

  if (addr) addr.required = isMalaysia;
  if (years) years.required = isMalaysia;

  if (!isMalaysia) {
    if (addr) addr.value = '';
    if (years) years.value = '';
  }
}

// Toggle citizenship-related fields
function toggleCitizenshipFields() {
  const citizenship = document.getElementById('citizenship').value;
  const citizenshipOtherDiv = document.getElementById('citizenshipOtherDiv');
  const icNumber = document.getElementById('icNumber');
  const primaryPassport = document.getElementById('primaryPassport');

  if (citizenship === 'Other') {
    if (citizenshipOtherDiv) citizenshipOtherDiv.style.display = 'block';
    if (icNumber) icNumber.required = false;
    if (primaryPassport) primaryPassport.required = true;
  } else {
    if (citizenshipOtherDiv) citizenshipOtherDiv.style.display = 'none';
    if (icNumber) icNumber.required = citizenship === 'Malaysian';
    if (primaryPassport) primaryPassport.required = citizenship !== 'Malaysian';
    if (citizenshipOtherDiv) {
      const input = citizenshipOtherDiv.querySelector('input');
      if (input) input.value = '';
    }
  }
}

// Add more Employment entries
function addEmployment() {
  const container = document.getElementById('employmentSection');
  const firstBlock = container.querySelector('.employment-block');
  if (!firstBlock) return;

  const clone = firstBlock.cloneNode(true);
  // Clear inputs in clone
  clone.querySelectorAll('input').forEach(input => (input.value = ''));
  container.appendChild(clone);
}

// Add more Education entries
function addEducation() {
  const container = document.getElementById('eduSection');
  const firstBlock = container.querySelector('.edu-block');
  if (!firstBlock) return;

  const clone = firstBlock.cloneNode(true);
  clone.querySelectorAll('input').forEach(input => (input.value = ''));
  container.appendChild(clone);
}

// Add more Family entries
function addFamily() {
  const container = document.getElementById('familySection');
  const firstBlock = container.querySelector('.family-block');
  if (!firstBlock) return;

  const clone = firstBlock.cloneNode(true);
  clone.querySelectorAll('input, select').forEach(el => {
    el.value = '';
    if (el.tagName === 'SELECT') el.selectedIndex = 0;
  });
  container.appendChild(clone);
}

// Add more Certification entries
function addCertification() {
  const container = document.getElementById('certSection');
  const firstBlock = container.querySelector('.cert-block');
  if (!firstBlock) return;

  const clone = firstBlock.cloneNode(true);
  clone.querySelectorAll('input').forEach(input => (input.value = ''));
  container.appendChild(clone);
}

// Final form validation before submission
function validateForm() {
  toggleMalaysiaFields();
  toggleCitizenshipFields();

  for (let i = 0; i < sections.length; i++) {
    if (!validateSection(i)) {
      currentSection = i;
      showSection(currentSection);
      return false;
    }
  }

  alert('Form submitted successfully!');
  return true;
}

// On page load, initialize form
document.addEventListener('DOMContentLoaded', () => {
  showSection(currentSection);
  toggleMalaysiaFields();
  toggleCitizenshipFields();
});
