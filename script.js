// script.js

let currentSection = 0;
const sections = document.querySelectorAll('.form-section');

function showSection(index) {
  sections.forEach((section, i) => {
    section.classList.toggle('active', i === index);
  });
  updateProgressBar(index);
}

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

function validateSection(index) {
  const section = sections[index];
  const requiredFields = section.querySelectorAll('[required]');
  let isValid = true;

  for (const field of requiredFields) {
    if (field.offsetParent === null) continue;
    const fieldValue = (field.type === 'checkbox' || field.type === 'radio')
      ? field.checked
      : field.value.trim();

    if (!fieldValue) {
      if (!field.classList.contains('error-highlight')) {
        field.classList.add('error-highlight');
      }
      const label = field.previousElementSibling?.textContent?.trim() || field.name;
      alert(`Please fill the "${label}" field.`);
      field.focus();
      isValid = false;
      break;
    } else {
      field.classList.remove('error-highlight');
    }
  }
  return isValid;
}

function toggleOtherField(selectElement, targetDivId) {
  const div = document.getElementById(targetDivId);
  if (!div) return;
  const input = div.querySelector('input');

  if (selectElement.value === 'Other') {
    div.style.display = 'block';
    if (input) input.required = true;
  } else {
    div.style.display = 'none';
    if (input) {
      input.required = false;
      input.value = '';
    }
  }
}

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

function toggleCitizenshipFields() {
  const citizenship = document.getElementById('citizenship').value;
  const citizenshipOtherDiv = document.getElementById('citizenshipOtherDiv');
  const icNumber = document.getElementById('icNumber');
  const icPlace = document.querySelector('[name="icPlaceOfIssue"]');
  const icIssue = document.querySelector('[name="icDateOfIssue"]');
  const icExpiry = document.querySelector('[name="icDateOfExpiry"]');
  const primaryPassport = document.getElementById('primaryPassport');
  const passportPlace = document.querySelector('[name="passportPlaceOfIssue"]');
  const passportIssue = document.querySelector('[name="passportDateOfIssue"]');
  const passportExpiry = document.querySelector('[name="passportDateOfExpiry"]');

  if (citizenship === 'Other') {
    if (citizenshipOtherDiv) citizenshipOtherDiv.style.display = 'block';
    if (primaryPassport) primaryPassport.required = true;
    if (passportPlace) passportPlace.required = true;
    if (passportIssue) passportIssue.required = true;
    if (passportExpiry) passportExpiry.required = true;

    if (icNumber) icNumber.required = false;
    if (icPlace) icPlace.required = false;
    if (icIssue) icIssue.required = false;
    if (icExpiry) icExpiry.required = false;
  } else {
    if (citizenshipOtherDiv) citizenshipOtherDiv.style.display = 'none';
    const input = citizenshipOtherDiv?.querySelector('input');
    if (input) input.value = '';

    if (citizenship === 'Malaysian') {
      if (icNumber) icNumber.required = true;
      if (icPlace) icPlace.required = true;
      if (icIssue) icIssue.required = true;
      if (icExpiry) icExpiry.required = true;

      if (primaryPassport) primaryPassport.required = false;
      if (passportPlace) passportPlace.required = false;
      if (passportIssue) passportIssue.required = false;
      if (passportExpiry) passportExpiry.required = false;
    } else {
      // Singaporean case or else
      if (primaryPassport) primaryPassport.required = true;
      if (passportPlace) passportPlace.required = true;
      if (passportIssue) passportIssue.required = true;
      if (passportExpiry) passportExpiry.required = true;
    }
  }
}

function toggleMarriedFields(selectElem) {
  const marriedDiv = document.getElementById('marriedFields');
  const marriageDateField = document.getElementById('marriageDate');
  const kidsCountField = document.getElementById('numberOfKids');

  if (selectElem.value === 'Married') {
    marriedDiv.style.display = 'block';
    marriageDateField.required = true;
    kidsCountField.required = true;
  } else {
    marriedDiv.style.display = 'none';
    marriageDateField.required = false;
    kidsCountField.required = false;
    marriageDateField.value = '';
    kidsCountField.value = '';
  }
}


function addEmployment() {
  const container = document.getElementById('employmentSection');
  const firstBlock = container.querySelector('.employment-block');
  if (!firstBlock) return;
  const clone = firstBlock.cloneNode(true);
  clone.querySelectorAll('input, textarea').forEach(input => input.value = '');
  container.appendChild(clone);
}

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

function addCertification() {
  const container = document.getElementById('certSection');
  const firstBlock = container.querySelector('.cert-block');
  if (!firstBlock) return;
  const clone = firstBlock.cloneNode(true);
  clone.querySelectorAll('input').forEach(input => input.value = '');
  container.appendChild(clone);
}

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

document.addEventListener('DOMContentLoaded', () => {
  showSection(currentSection);
  toggleMalaysiaFields();
  toggleCitizenshipFields();
});
