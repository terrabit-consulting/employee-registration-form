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
  for (const field of requiredFields) {
    if (field.offsetParent === null) continue;
    if (field.type === 'checkbox' || field.type === 'radio') {
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
  const homeAddr = document.querySelector('[name="homeCountryAddress"]');
  const yearsHome = document.querySelector('[name="yearsOfStayHome"]');

  if (addr) addr.required = isMalaysia;
  if (years) years.required = isMalaysia;
  if (homeAddr) homeAddr.required = true;
  if (yearsHome) yearsHome.required = true;

  if (!isMalaysia) {
    if (addr) addr.value = '';
    if (years) years.value = '';
  }
}

function toggleCitizenshipFields() {
  const citizenship = document.getElementById('citizenship').value;
  const citizenshipOtherDiv = document.getElementById('citizenshipOtherDiv');
  const icNumber = document.getElementById('icNumber');
  const primaryPassport = document.getElementById('primaryPassport');
  const icFields = [
    document.querySelector('[name="icPlaceOfIssue"]'),
    document.querySelector('[name="icDateOfIssue"]'),
    document.querySelector('[name="icDateOfExpiry"]')
  ];
  const passportFields = [
    document.querySelector('[name="passportPlaceOfIssue"]'),
    document.querySelector('[name="passportDateOfIssue"]'),
    document.querySelector('[name="passportDateOfExpiry"]')
  ];

  if (citizenship === 'Other') {
    if (citizenshipOtherDiv) citizenshipOtherDiv.style.display = 'block';
  } else {
    if (citizenshipOtherDiv) citizenshipOtherDiv.style.display = 'none';
    const input = citizenshipOtherDiv.querySelector('input');
    if (input) input.value = '';
  }

  if (citizenship === 'Malaysian') {
    if (icNumber) icNumber.required = true;
    icFields.forEach(f => f && (f.required = true));
    if (primaryPassport) primaryPassport.required = false;
    passportFields.forEach(f => f && (f.required = false));
  } else {
    if (icNumber) icNumber.required = false;
    icFields.forEach(f => {
      if (f) {
        f.required = false;
        f.value = '';
      }
    });
    if (primaryPassport) primaryPassport.required = true;
    passportFields.forEach(f => f && (f.required = true));
  }
}

function toggleMaritalFields() {
  const maritalStatus = document.querySelector('[name="maritalStatus"]').value;
  let marriageDateField = document.getElementById('marriageDate');
  let kidsCountField = document.getElementById('numberOfKids');

  if (!marriageDateField) {
    marriageDateField = document.createElement('input');
    marriageDateField.type = 'date';
    marriageDateField.name = 'marriageDate';
    marriageDateField.id = 'marriageDate';
    marriageDateField.required = true;
    const label = document.createElement('label');
    label.innerText = 'Date of Marriage *';
    const target = document.querySelector('[name="maritalStatus"]').parentNode;
    target.appendChild(label);
    target.appendChild(marriageDateField);
  }

  if (!kidsCountField) {
    kidsCountField = document.createElement('input');
    kidsCountField.type = 'number';
    kidsCountField.name = 'numberOfKids';
    kidsCountField.id = 'numberOfKids';
    kidsCountField.min = '0';
    kidsCountField.required = true;
    const label = document.createElement('label');
    label.innerText = 'Number of Kids *';
    marriageDateField.parentNode.appendChild(label);
    marriageDateField.parentNode.appendChild(kidsCountField);
  }

  if (maritalStatus === 'Married') {
    marriageDateField.style.display = 'block';
    kidsCountField.style.display = 'block';
    marriageDateField.required = true;
    kidsCountField.required = true;
  } else {
    marriageDateField.style.display = 'none';
    kidsCountField.style.display = 'none';
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
  clone.querySelectorAll('input, textarea').forEach(input => (input.value = ''));
  container.appendChild(clone);
}

function addEducation() {
  const container = document.getElementById('eduSection');
  const firstBlock = container.querySelector('.edu-block');
  if (!firstBlock) return;
  const clone = firstBlock.cloneNode(true);
  clone.querySelectorAll('input, select').forEach(input => {
    input.value = '';
    if (input.tagName === 'SELECT') input.selectedIndex = 0;
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
  clone.querySelectorAll('input').forEach(input => (input.value = ''));
  container.appendChild(clone);
}

function validateForm() {
  toggleMalaysiaFields();
  toggleCitizenshipFields();
  toggleMaritalFields();
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
  toggleMaritalFields();

  const maritalStatus = document.querySelector('[name="maritalStatus"]');
  if (maritalStatus) maritalStatus.addEventListener('change', toggleMaritalFields);

  const currentlyInMalaysia = document.getElementById('currentlyInMalaysia');
  if (currentlyInMalaysia) currentlyInMalaysia.addEventListener('change', toggleMalaysiaFields);

  const citizenship = document.getElementById('citizenship');
  if (citizenship) citizenship.addEventListener('change', toggleCitizenshipFields);
});
