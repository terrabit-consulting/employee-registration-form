let currentStep = 0;
const sections = document.querySelectorAll(".form-section");
const progress = document.getElementById("progress");

function showSection(index) {
  sections.forEach((section, i) => {
    section.classList.toggle("active", i === index);
  });
  progress.style.width = ((index + 1) / sections.length) * 100 + "%";
}

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

function prevSection() {
  if (currentStep > 0) {
    currentStep--;
    showSection(currentStep);
  }
}

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

function addEmployment() {
  const block = document.querySelector(".employment-block").cloneNode(true);
  block.querySelectorAll("input").forEach(i => i.value = "");
  document.getElementById("employmentSection").appendChild(block);
}
function addCertification() {
  const block = document.querySelector(".cert-block").cloneNode(true);
  block.querySelectorAll("input").forEach(i => i.value = "");
  document.getElementById("certSection").appendChild(block);
}
function addEducation() {
  const block = document.querySelector(".edu-block").cloneNode(true);
  block.querySelectorAll("input").forEach(i => i.value = "");
  document.getElementById("eduSection").appendChild(block);
}
function addFamily() {
  const block = document.querySelector(".family-block").cloneNode(true);
  block.querySelectorAll("input").forEach(i => i.value = "");
  document.getElementById("familySection").appendChild(block);
}

document.addEventListener("DOMContentLoaded", () => showSection(0));

// ✅ Final Submit & Send to Power Automate
document.getElementById("multiStepForm").addEventListener("submit", function(e) {
  e.preventDefault();

  // Extract repeatable sections
  const extractGroup = (selector, fields) =>
    Array.from(document.querySelectorAll(selector)).map(group => {
      const entry = {};
      fields.forEach(field => {
        const input = group.querySelector(`[name="${field}[]"]`);
        entry[field] = input ? input.value : "";
      });
      return entry;
    });

  const formData = {
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
    positionOther: document.querySelector('[name="positionOther"]').value,
    joiningDate: document.querySelector('[name="joiningDate"]').value,
    emergencyName: document.querySelector('[name="emergencyName"]').value,
    emergencyRelation: document.querySelector('[name="emergencyRelation"]').value,
    emergencyPhone: document.querySelector('[name="emergencyPhone"]').value,
    emergencyAddress: document.querySelector('[name="emergencyAddress"]').value,
    emergencyLocation: document.querySelector('[name="emergencyLocation"]').value,
    employeeID: document.querySelector('[name="employeeID"]').value,
    department: document.querySelector('[name="department"]').value,
    manager: document.querySelector('[name="manager"]').value,

    employment: extractGroup(".employment-block", ["company", "from", "to", "jobTitle", "salary", "refName", "refPhone"]),
    certifications: extractGroup(".cert-block", ["certTitle", "certIssuer", "certDate", "certNumber"]),
    education: extractGroup(".edu-block", ["eduSchool", "eduDegree", "eduStream", "eduYear", "eduGPA"]),
    family: extractGroup(".family-block", ["familyName", "familyRelation", "familyDOB", "familyPassport", "familyOccupation"])
  };

  // 🔗 Replace below with your actual Power Automate HTTP POST URL
  const flowUrl = "https://default801bb2d2c6584e6787728a97c96f3e.e2.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/7003fbb3a2f8436789a6895468c71bf1/triggers/manual/paths/invoke/?api-version=1&tenantId=tId&environmentName=Default-801bb2d2-c658-4e67-8772-8a97c96f3ee2&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=gSF_hOIn6LCfJXa9tfr5z8WrhbH05fq4nay_GBH7LBc";

  fetch(flowUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  })
  .then(res => {
    if (res.ok) {
      alert("✅ Form submitted successfully!");
    } else {
      alert("❌ Submission failed. Please try again.");
    }
  })
  .catch(err => {
    console.error("Error:", err);
    alert("⚠️ Submission error: " + err.message);
  });
});
