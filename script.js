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
  document.getElementById("familySection").appendChild(block);
}

// Initialize first section on load
document.addEventListener("DOMContentLoaded", () => showSection(0));

// Helper to extract multiple entries from a repeated block
const extractGroup = (selector, fields) =>
  Array.from(document.querySelectorAll(selector)).map(group => {
    const entry = {};
    fields.forEach(field => {
      // For inputs with [] names, query accordingly
      let input = group.querySelector(`[name="${field}[]"]`);
      if (!input) {
        // fallback for singular names in blocks (like marriageDate, numberOfKids in family-block)
        input = group.querySelector(`[name="${field}"]`);
      }
      entry[field] = input ? input.value : "";
    });
    return entry;
  });

// Collect data and submit to Power Automate
document.getElementById("multiStepForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Personal Particulars
  const personalData = {
    fullName: document.querySelector('[name="fullName"]').value,
    currentlyInMalaysia: document.querySelector('[name="currentlyInMalaysia"]').value,
    age: document.querySelector('[name="age"]').value ? parseInt(document.querySelector('[name="age"]').value) : null,
    dob: document.querySelector('[name="dob"]').value,
    stateOfBirth: document.querySelector('[name="stateOfBirth"]').value,
    maritalStatus: document.querySelector('[name="maritalStatus"]').value,
    maritalOther: document.querySelector('[name="maritalOther"]').value,
    gender: document.querySelector('[name="gender"]').value,
    citizenship: document.querySelector('[name="citizenship"]').value,
    citizenshipOther: document.querySelector('[name="citizenshipOther"]').value,
    race: document.querySelector('[name="race"]').value,
    religion: document.querySelector('[name="religion"]').value,
    primaryPassport: document.querySelector('[name="primaryPassport"]').value,
    passportPlaceOfIssue: document.querySelector('[name="passportPlaceOfIssue"]').value,
    passportDateOfIssue: document.querySelector('[name="passportDateOfIssue"]').value,
    passportDateOfExpiry: document.querySelector('[name="passportDateOfExpiry"]').value,
    icNumber: document.querySelector('[name="icNumber"]').value,
    homeCountryAddress: document.querySelector('[name="homeCountryAddress"]').value,
    yearsOfStayHome: document.querySelector('[name="yearsOfStayHome"]').value ? parseInt(document.querySelector('[name="yearsOfStayHome"]').value) : null,
    completeAddressMalaysia: document.querySelector('[name="completeAddressMalaysia"]').value,
    yearsOfStayMalaysia: document.querySelector('[name="yearsOfStayMalaysia"]').value ? parseInt(document.querySelector('[name="yearsOfStayMalaysia"]').value) : null,
    expectedJoiningDate: document.querySelector('[name="expectedJoiningDate"]').value,
    visaCollectionCentre: document.querySelector('[name="visaCollectionCentre"]').value,
    mothersMaidenName: document.querySelector('[name="mothersMaidenName"]').value,
    email: document.querySelector('[name="email"]').value,
    durationStayFrom: document.querySelector('[name="durationStayFrom"]').value,
    durationStayTo: document.querySelector('[name="durationStayTo"]').value,
    telHome: document.querySelector('[name="telHome"]').value,
    whatsappNo: document.querySelector('[name="whatsappNo"]').value,
    mobile: document.querySelector('[name="mobile"]').value,
    linkedInId: document.querySelector('[name="linkedInId"]').value,
    facebook: document.querySelector('[name="facebook"]').value,
    bank: document.querySelector('[name="bank"]').value,
    bankOther: document.querySelector('[name="bankOther"]').value,
    bankAccount: document.querySelector('[name="bankAccount"]').value,
    taxNumber: document.querySelector('[name="taxNumber"]').value,
    positionApplied: document.querySelector('[name="positionApplied"]').value,
    positionOther: document.querySelector('[name="positionOther"]')?.value || "",
    joiningDate: document.querySelector('[name="joiningDate"]').value,
  };

  // Emergency Contact
  const emergencyContact = {
    name: document.querySelector('[name="emergencyName"]').value,
    relation: document.querySelector('[name="emergencyRelation"]').value,
    phone: document.querySelector('[name="emergencyPhone"]').value,
    address: document.querySelector('[name="emergencyAddress"]').value,
    location: document.querySelector('[name="emergencyLocation"]').value,
  };

  // Office Use Only
  const officeUse = {
    costCenterCode: document.querySelector('[name="costCenterCode"]').value,
    costCenterName: document.querySelector('[name="costCenterName"]').value,
    actualJoiningDate: document.querySelector('[name="actualJoiningDate"]').value,
    category: document.querySelector('[name="category"]').value,
    department: document.querySelector('[name="department"]').value,
    project: document.querySelector('[name="project"]').value,
    positionAppliedOffice: document.querySelector('[name="positionApplied"]').value,
    officeUseDate: document.querySelector('[name="officeUseDate"]').value,
  };

  // Employment History - extended fields
  const employment = extractGroup(".employment-block", [
    "company", "from", "to", "employeeId", "contactNumber",
    "jobTitle", "officeAddress", "refName", "refPhone",
    "refPosition", "refEmail", "reasonForLeaving", "lastSalary"
  ]);

  // Certifications
  const certifications = extractGroup(".cert-block", [
    "certInstitution", "certCompletionDate", "certCourseTitle", "certNumber"
  ]);

  // Education
  const education = extractGroup(".edu-block", [
    "eduSchool", "eduInstitute", "eduYear", "eduGraduated", "eduDegree", "eduGPA", "eduStream"
  ]);

  // Family
  // Note: marriageDate and numberOfKids are singular fields, not arrays
  const familyBlocks = document.querySelectorAll(".family-block");
  const family = [];
  familyBlocks.forEach(block => {
    family.push({
      marriageDate: block.querySelector('[name="marriageDate"]')?.value || "",
      numberOfKids: block.querySelector('[name="numberOfKids"]')?.value || "",
      familyName: block.querySelector('[name="familyName[]"]')?.value || "",
      familyRelation: block.querySelector('[name="familyRelation[]"]')?.value || "",
      familyPassport: block.querySelector('[name="familyPassport[]"]')?.value || "",
      familyDOB: block.querySelector('[name="familyDOB[]"]')?.value || "",
      familyOccupation: block.querySelector('[name="familyOccupation[]"]')?.value || "",
    });
  });

  // Final JSON payload
  const formData = {
    personalData,
    emergencyContact,
    officeUse,
    employment,
    certifications,
    education,
    family
  };

  console.log("✅ Submitted JSON to Power Automate:", JSON.stringify(formData, null, 2));

  // Replace with your actual Power Automate flow endpoint
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
      console.error("⚠️ Submission error:", err);
      alert("⚠️ Submission error: " + err.message);
    });
});
