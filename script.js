let currentStep = 0;
const sections = document.querySelectorAll(".form-section");
const progress = document.getElementById("progress");

// Show a specific section by index and update progress bar
function showSection(index) {
  sections.forEach((section, i) => {
    section.classList.toggle("active", i === index);
  });
  progress.style.width = ((index + 1) / sections.length) * 100 + "%";
}

// Move to next section after validating current section fields
function nextSection() {
  const fields = sections[currentStep].querySelectorAll("input, select, textarea");
  for (const field of fields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      return;
    }
  }
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

// Clone repeatable section blocks
function addEmployment() {
  const block = document.querySelector(".employment-block").cloneNode(true);
  block.querySelectorAll("input").forEach(input => input.value = "");
  document.getElementById("employmentSection").appendChild(block);
}

function addCertification() {
  const block = document.querySelector(".cert-block").cloneNode(true);
  block.querySelectorAll("input").forEach(input => input.value = "");
  document.getElementById("certSection").appendChild(block);
}

function addEducation() {
  const block = document.querySelector(".edu-block").cloneNode(true);
  block.querySelectorAll("input").forEach(input => input.value = "");
  document.getElementById("eduSection").appendChild(block);
}

function addFamily() {
  const block = document.querySelector(".family-block").cloneNode(true);
  block.querySelectorAll("input").forEach(input => input.value = "");
  document.getElementById("familySection").appendChild(block);
}

// Initialize first section on load
document.addEventListener("DOMContentLoaded", () => showSection(0));

// Collect data and submit or update to Power Automate
function submitOrUpdateForm(isUpdate = false) {
  const submitBtn = document.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = isUpdate ? "Updated..." : "Submitted...";

  const extractGroup = (selector, fields) =>
    Array.from(document.querySelectorAll(selector)).map(group => {
      const entry = {};
      fields.forEach(field => {
        const input = group.querySelector(`[name="${field}[]"]`);
        entry[field] = input ? input.value : "";
      });
      return entry;
    });

  const personalData = {
    fullName: document.querySelector('[name="fullName"]').value,
    dob: document.querySelector('[name="dob"]').value,
    age: parseInt(document.querySelector('[name="age"]').value),
    gender: document.querySelector('[name="gender"]').value,
    maritalStatus: document.querySelector('[name="maritalStatus"]').value,
    maritalOther: document.querySelector('[name="maritalOther"]').value,
    citizenship: document.querySelector('[name="citizenship"]').value,
    citizenshipOther: document.querySelector('[name="citizenshipOther"]').value,
    email: document.querySelector('[name="email"]').value,
    mobile: document.querySelector('[name="mobile"]').value,
    passport: document.querySelector('[name="passport"]').value,
    ic: document.querySelector('[name="ic"]').value,
    address: document.querySelector('[name="address"]').value,
    bank: document.querySelector('[name="bank"]').value,
    bankOther: document.querySelector('[name="bankOther"]').value,
    bankAccount: document.querySelector('[name="bankAccount"]').value,
    taxNumber: document.querySelector('[name="taxNumber"]').value,
    positionApplied: document.querySelector('[name="positionApplied"]').value,
    positionOther: document.querySelector('[name="positionOther"]')?.value || "",
    joiningDate: document.querySelector('[name="joiningDate"]').value,
  };

  const emergencyContact = {
    name: document.querySelector('[name="emergencyName"]').value,
    relation: document.querySelector('[name="emergencyRelation"]').value,
    phone: document.querySelector('[name="emergencyPhone"]').value,
    address: document.querySelector('[name="emergencyAddress"]').value,
    location: document.querySelector('[name="emergencyLocation"]').value,
  };

  const officeUse = {
    employeeID: document.querySelector('[name="employeeID"]').value,
    department: document.querySelector('[name="department"]').value,
    manager: document.querySelector('[name="manager"]').value,
  };

  const employment = extractGroup(".employment-block", ["company", "from", "to", "jobTitle", "salary", "refName", "refPhone"]);
  const certifications = extractGroup(".cert-block", ["certTitle", "certIssuer", "certDate", "certNumber"]);
  const education = extractGroup(".edu-block", ["eduSchool", "eduDegree", "eduStream", "eduYear", "eduGPA"]);
  const family = extractGroup(".family-block", ["familyName", "familyRelation", "familyDOB", "familyPassport", "familyOccupation"]);

  const formData = {
    personalData,
    emergencyContact,
    officeUse,
    employment,
    certifications,
    education,
    family,
    mode: isUpdate ? "update" : "create"
  };

  const flowUrl = "https://your-flow-url-here"; // Replace with your Power Automate URL

  fetch(flowUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  })
    .then(res => {
      if (res.ok) {
        alert(`✅ Form ${isUpdate ? "updated" : "submitted"} successfully!`);
      } else {
        alert(`❌ ${isUpdate ? "Update" : "Submission"} failed. Please try again.`);
        submitBtn.disabled = false;
        submitBtn.textContent = isUpdate ? "Update" : "Submit";
      }
    })
    .catch(err => {
      console.error("⚠️ Submission error:", err);
      alert("⚠️ Submission error: " + err.message);
      submitBtn.disabled = false;
      submitBtn.textContent = isUpdate ? "Update" : "Submit";
    });
}

document.getElementById("multiStepForm").addEventListener("submit", function (e) {
  e.preventDefault();
  submitOrUpdateForm(false); // false means "create" mode
});

// Optional: Call this function with true to perform an update
// submitOrUpdateForm(true);
