let currentStep = 0;
const sections = document.querySelectorAll(".form-section");
const progress = document.getElementById("progress");

// Show a specific section by index and update progress bar
function showSection(index) {
  sections.forEach((section, i) => {
    section.classList.toggle("active", i === index);
  });
  if (progress) {
    progress.style.width = ((index + 1) / sections.length) * 100 + "%";
  }
}

// Move to next section after validating current section fields and custom validations
function nextSection() {
  const fields = sections[currentStep].querySelectorAll("input, select, textarea");
  for (const field of fields) {
    // Skip hidden or disabled fields
    if (field.offsetParent === null || field.disabled) continue;
    if (!field.checkValidity()) {
      field.reportValidity();
      return;
    }
  }
  // Run custom validations for conditional required fields
  if (!customValidationForStep(currentStep)) return;

  if (currentStep < sections.length - 1) {
    currentStep++;
    showSection(currentStep);
  }
}

// Move to previous section
function prevSection() {
  if (currentStep > 0) {
    currentStep--;
    showSection(currentStep);
  }
}

// Show or hide "Other" input based on dropdown value
function toggleOtherField(select, divId) {
  const div = document.getElementById(divId);
  const input = div?.querySelector("input");
  if (select.value === "Other") {
    div.style.display = "block";
    input?.setAttribute("required", "required");
  } else {
    div.style.display = "none";
    input?.removeAttribute("required");
    if (input) input.value = "";
  }
}

// Add repeatable section blocks cloning
function addEmployment() {
  const block = document.querySelector(".employment-block").cloneNode(true);
  block.querySelectorAll("input, textarea").forEach(input => input.value = "");
  document.getElementById("employmentSection").appendChild(block);
}

function addCertification() {
  const block = document.querySelector(".cert-block").cloneNode(true);
  block.querySelectorAll("input").forEach(input => input.value = "");
  document.getElementById("certSection").appendChild(block);
}

function addEducation() {
  const block = document.querySelector(".edu-block").cloneNode(true);
  block.querySelectorAll("input, select").forEach(input => {
    if(input.tagName.toLowerCase() === "select") {
      input.selectedIndex = 0;
    } else {
      input.value = "";
    }
  });
  document.getElementById("eduSection").appendChild(block);
}

function addFamily() {
  const block = document.querySelector(".family-block").cloneNode(true);
  block.querySelectorAll("input, select").forEach(input => {
    if(input.tagName.toLowerCase() === "select") {
      input.selectedIndex = 0;
    } else {
      input.value = "";
    }
  });
  // Hide spouse fields and remove required on cloned block
  const spouseFieldsDiv = block.querySelector(".spouseFields");
  if (spouseFieldsDiv) {
    spouseFieldsDiv.style.display = "none";
    const marriageDateInput = spouseFieldsDiv.querySelector('input[name="marriageDate"]');
    const numberOfKidsInput = spouseFieldsDiv.querySelector('input[name="numberOfKids"]');
    marriageDateInput.removeAttribute("required");
    numberOfKidsInput.removeAttribute("required");
  }
  document.getElementById("familySection").appendChild(block);
}

// Custom validation logic for conditional fields per step
function customValidationForStep(step) {
  if (step === 0) { // Personal Particulars step
    // If Currently in Malaysia = Yes, Complete Address Malaysia & Years of Stay Malaysia required
    const currentlyInMalaysia = document.querySelector('[name="currentlyInMalaysia"]').value;
    const completeAddressMalaysia = document.querySelector('[name="completeAddressMalaysia"]');
    const yearsOfStayMalaysia = document.querySelector('[name="yearsOfStayMalaysia"]');
    if (currentlyInMalaysia === "Yes") {
      if (!completeAddressMalaysia.value.trim()) {
        alert("Complete Address in Malaysia is required.");
        completeAddressMalaysia.focus();
        return false;
      }
      if (!yearsOfStayMalaysia.value.trim()) {
        alert("No. of Years of Stay (Malaysia) is required.");
        yearsOfStayMalaysia.focus();
        return false;
      }
    }

    // Citizenship logic: if Malaysian => IC Number required, else Primary Passport required
    const citizenship = document.querySelector('[name="citizenship"]').value.toLowerCase();
    const icNumber = document.querySelector('[name="icNumber"]');
    const primaryPassport = document.querySelector('[name="primaryPassport"]');

    if (citizenship === "malaysian") {
      if (!icNumber.value.trim()) {
        alert("IC Number is required for Malaysian citizens.");
        icNumber.focus();
        return false;
      }
    } else {
      if (!primaryPassport.value.trim()) {
        alert("Primary Passport is required for non-Malaysian citizens.");
        primaryPassport.focus();
        return false;
      }
    }
  }
  if (step === 6) { // Family Members step (index 6)
    const familyBlocks = document.querySelectorAll(".family-block");
    for (const block of familyBlocks) {
      const relSelect = block.querySelector('[name="familyRelation[]"]');
      if (relSelect && relSelect.value === "Spouse") {
        const marriageDate = block.querySelector('input[name="marriageDate"]');
        const numberOfKids = block.querySelector('input[name="numberOfKids"]');
        if (!marriageDate || !marriageDate.value.trim()) {
          alert("Marriage Date is required when Relationship is Spouse.");
          marriageDate?.focus();
          return false;
        }
        if (!numberOfKids || !numberOfKids.value.trim()) {
          alert("Number Of Kids is required when Relationship is Spouse.");
          numberOfKids?.focus();
          return false;
        }
      }
    }
  }
  return true;
}

// Show/hide Marriage Date & Number of Kids based on Relationship select change
function toggleSpouseFields(select) {
  const familyBlock = select.closest(".family-block");
  if (!familyBlock) return;

  const spouseFieldsDiv = familyBlock.querySelector(".spouseFields");
  if (!spouseFieldsDiv) return;

  if (select.value === "Spouse") {
    spouseFieldsDiv.style.display = "block";
    spouseFieldsDiv.querySelector('input[name="marriageDate"]').setAttribute("required", "required");
    spouseFieldsDiv.querySelector('input[name="numberOfKids"]').setAttribute("required", "required");
  } else {
    spouseFieldsDiv.style.display = "none";
    const marriageDateInput = spouseFieldsDiv.querySelector('input[name="marriageDate"]');
    const numberOfKidsInput = spouseFieldsDiv.querySelector('input[name="numberOfKids"]');
    marriageDateInput.removeAttribute("required");
    marriageDateInput.value = "";
    numberOfKidsInput.removeAttribute("required");
    numberOfKidsInput.value = "";
  }
}

// Initialize form and event listeners
document.addEventListener("DOMContentLoaded", () => {
  showSection(0);

  // Progress bar might be optional, so check existence before usage
  if (progress) {
    progress.style.width = ((currentStep + 1) / sections.length) * 100 + "%";
  }

  document.querySelector('[name="currentlyInMalaysia"]').addEventListener("change", () => {
    // No need to toggle required attr dynamically since validation handles it
  });

  document.querySelector('[name="citizenship"]').addEventListener("change", () => {
    // No need to toggle required attr dynamically since validation handles it
  });

  // Delegate familyRelation changes to show/hide spouse fields
  document.getElementById("familySection").addEventListener("change", (e) => {
    if (e.target.name === "familyRelation[]") {
      toggleSpouseFields(e.target);
    }
  });

  document.getElementById("multiStepForm").addEventListener("submit", function(e) {
    // Validate all steps before submission
    e.preventDefault();

    for(let i = 0; i < sections.length; i++) {
      if (!validateSection(i)) {
        currentStep = i;
        showSection(currentStep);
        return;
      }
      if (!customValidationForStep(i)) {
        currentStep = i;
        showSection(currentStep);
        return;
      }
    }

    // Collect and submit data here or just alert success for now
    alert("Form submitted successfully!");

    // You can add your data collection and submission logic here

    // Optionally submit:
    // this.submit();
  });
});

// Validate individual section using HTML5 constraint validation API
function validateSection(index) {
  const section = sections[index];
  const requiredFields = section.querySelectorAll("input[required], select[required], textarea[required]");
  for (const field of requiredFields) {
    // Skip hidden or disabled fields
    if (field.offsetParent === null || field.disabled) continue;
    if (!field.checkValidity()) {
      field.reportValidity();
      return false;
    }
  }
  return true;
}
