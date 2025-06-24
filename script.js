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

// Highlight and alert missing required fields
function validateSection(index) {
  const section = sections[index];
  const requiredFields = section.querySelectorAll('[required]');
  let isValid = true;

  for (const field of requiredFields) {
    if (field.offsetParent === null) continue; // Skip hidden fields
    if (!field.value.trim()) {
      alert(`Please fill the "${field.previousElementSibling?.textContent?.trim() || field.name}" field.`);
      field.classList.add('error-highlight');
      field.focus();
      isValid = false;
      break;
    } else {
      field.classList.remove('error-highlight');
    }
  }

  return isValid;
}

// Real-time error border removal
document.addEventListener('input', function (e) {
  if (e.target.classList.contains('error-highlight') && e.target.value.trim() !== '') {
    e.target.classList.remove('error-highlight');
  }
});

// Toggle display of "Other" text fields based on dropdown value
function toggleOtherField(selectElement, targetDivId) {
  const div = document.getElementById(targetDivId);
  if (!div) return;
  if (selectElement.value === 'Other') {
    div.style.display = 'block';
    const input = div.querySelector('input');
    if (input) input.required = true;
  } else {
    div.style.display = 'none';
    const input = div.querySelector('input');
    if (input) {
      input.required = false;
      input.value = '';
      input.classList.remove('error-highlight');
    }
  }
}

// Toggle fields related to Malaysia residency
function toggleMalaysiaFields() {
  const isMalaysia = document.getElementById('currentlyInMalaysia').value === 'Yes';
  const addr = document.getElementById('completeAddressMalaysia');
  const years = document.getElementById('yearsOfStayMalaysia');
  const homeAddr = document.querySelector('[name="homeCountryAddress"]');
  const homeYears = document.querySelector('[name="yearsOfStayHome"]');

  if (addr) addr.required = isMalaysia;
  if (years) years.required = isMalaysia;
  if (homeAddr) homeAddr.required = isMalaysia;
  if (homeYears) homeYears.required = isMalaysia;

  if (!isMalaysia) {
    if (addr) addr.value = '';
    if (years) years.value = '';
    if (homeAddr) homeAddr.value = '';
    if (homeYears) homeYears.value = '';
  }
}

// Toggle citizenship-related fields
function toggleCitizenshipFields() {
  const citizenship = document.getElementById('citizenship').value;
  const citizenshipOtherDiv = document.getElementById('citizenshipOtherDiv');
  const icFields = ['icNumber', 'icPlaceOfIssue', 'icDateOfIssue', 'icDateOfExpiry'];
  const passportFields = ['primaryPassport', 'passportPlaceOfIssue', 'passportDateOfIssue', 'passportDateOfExpiry'];

  if (citizenshipOtherDiv) {
    citizenshipOtherDiv.style.display = (citizenship === 'Other') ? 'block' : 'none';
    const input = citizenshipOtherDiv.querySelector('input');
    if (input) {
      input.required = (citizenship === 'Other');
      if (citizenship !== 'Other') input.value = '';
    }
  }

  icFields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.required = citizenship === 'Malaysian';
      if (citizenship !== 'Malaysian') el.value = '';
    }
  });

  passportFields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.required = citizenship !== 'Malaysian';
      if (citizenship === 'Malaysian') el.value = '';
    }
  });
}

// Handle Marital Status for Spouse fields
function toggleMaritalStatusFields() {
  const maritalSelect = document.querySelector('select[name="maritalStatus"]');
  const container = maritalSelect.closest('.form-section');
  let spouseFields = document.getElementById('spouseFields');

  if (maritalSelect.value === 'Married') {
    if (!spouseFields) {
      spouseFields = document.createElement('div');
      spouseFields.id = 'spouseFields';
      spouseFields.classList.add('spouseFields');
      spouseFields.innerHTML = `
        <label>Date of Marriage *</label>
        <input type="date" name="marriageDate" required />
        <label>Number of Kids *</label>
        <input type="number" name="numberOfKids" required min="0" />
      `;
      container.insertBefore(spouseFields, container.querySelector('.button-row'));
    }
  } else {
    if (spouseFields) {
      spouseFields.remove();
    }
  }
}

// Add more Employment entries
function addEmployment() {
  const container = document.getElementById('employmentSection');
  const firstBlock = container.querySelector('.employment-block');
  if (!firstBlock) return;

  const clone = firstBlock.cloneNode(true);
  clone.querySelectorAll('input, textarea').forEach(input => (input.value = ''));
  container.appendChild(clone);
}

// Add more Education entries
function addEducation() {
  const container = document.getElementById('eduSection');
  const firstBlock = container.querySelector('.edu-block');
  if (!firstBlock) return;

  const clone = firstBlock.cloneNode(true);
  clone.querySelectorAll('input, select').forEach(el => {
    el.value = '';
    if (el.tagName === 'SELECT') el.selectedIndex = 0;
  });
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
  toggleMaritalStatusFields();

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

  const maritalSelect = document.querySelector('select[name="maritalStatus"]');
  if (maritalSelect) {
    maritalSelect.addEventListener('change', toggleMaritalStatusFields);
    toggleMaritalStatusFields(); // in case already selected
  }
});
