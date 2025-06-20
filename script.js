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

// Form submission logic (update this later for Power Automate)
document.getElementById("multiStepForm").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("✅ Form submitted successfully (demo mode)");
});
