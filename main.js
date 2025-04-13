const navLinks = document.getElementById("nav-links");
const menuBtn = document.getElementById("menu-btn");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute(
    "class",
    isOpen ? "ri-close-line" : "ri-menu-3-line"
  );
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-3-line");
});

const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

// header container
ScrollReveal().reveal(".header__content h1", {
  ...scrollRevealOption,
});

ScrollReveal().reveal(".header__content .section__description", {
  ...scrollRevealOption,
  delay: 500,
});

ScrollReveal().reveal(".header__content .header__btn", {
  ...scrollRevealOption,
  delay: 1000,
});

// about container
ScrollReveal().reveal(".about__content .section__header", {
  ...scrollRevealOption,
});

ScrollReveal().reveal(".about__content .section__description", {
  ...scrollRevealOption,
  delay: 500,
});

ScrollReveal().reveal(".about__content .about__btn", {
  ...scrollRevealOption,
  delay: 1000,
});

// service container
ScrollReveal().reveal(".service__card", {
  ...scrollRevealOption,
  interval: 500,
});

// portfolio container
ScrollReveal().reveal(".portfolio__card", {
  duration: 1000,
  interval: 500,
});


  // Select all progress bar inner elements
  const skillProgressBars = document.querySelectorAll('.skill-bar-progress');

  // Function to animate the skill bars
  function animateSkills() {
      skillProgressBars.forEach(bar => {
          // Get the target skill level from the data attribute
          const skillLevel = parseInt(bar.dataset.skill);
          let currentWidth = 0; // Start width at 0

          // Use setInterval to increment the width
          const interval = setInterval(() => {
              currentWidth += 1; // Increment width by 1%
              // Update the bar's width style
              bar.style.width = `${currentWidth}%`;
              // Update the text content inside the bar
              bar.querySelector('.progress-text').textContent = `${currentWidth}%`;

              // Stop the interval when the target width is reached
              if (currentWidth >= skillLevel) {
                  clearInterval(interval);
              }
          }, 10); // Animation speed: interval duration in milliseconds
      });
  }

  // Add an event listener to trigger the animation when the window loads
  window.addEventListener('load', animateSkills);



  // contact form ..........................................

 // Keep the window.addEventListener('DOMContentLoaded', ...) and the
// animation code at the bottom of your file.
// Just replace the OLD handleSubmit function with this NEW one:

async function handleSubmit(event) {
  event.preventDefault(); // Prevent default browser submission
  const form = event.target;
  const formData = new FormData(form);
  const statusDiv = document.getElementById('form-status');
  const submitButton = form.querySelector('.submit-btn');

  // --- 1. Clear previous status and set loading state ---
  statusDiv.innerHTML = '';
  statusDiv.className = ''; // Reset class
  statusDiv.style.opacity = '0'; // Start hidden
  // Clear any previous hide timer
  if (statusDiv.hideTimeout) {
      clearTimeout(statusDiv.hideTimeout);
  }

  const originalButtonText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = 'Sending...';

  let message = '';       // To hold the status message text
  let messageType = '';   // To hold 'success' or 'error'

  try {
      // --- 2. Attempt to send data to Web3Forms endpoint (from form action) ---
      const response = await fetch(form.action, {
          method: form.method,
          body: formData,
          headers: {
              'Accept': 'application/json' // Request JSON response
          }
      });

      // --- 3. Handle the response from Web3Forms ---
      const data = await response.json(); // Get JSON response

      if (data.success) { // Web3Forms uses a 'success' boolean field
          // --- SUCCESS ---
          message = data.message || "Form submitted successfully!"; // Use message from Web3Forms
          messageType = 'success';
          form.reset(); // Clear the form fields on success
      } else {
          // --- SERVER-SIDE ERROR (Reported by Web3Forms) ---
          console.error('Web3Forms Error Data:', data);
          messageType = 'error';
          message = data.message || "Oops! There was a problem submitting the form."; // Use error message from Web3Forms
          // Note: If Web3Forms provides more detailed errors (e.g., in an 'errors' object),
          // you could add more specific parsing here if needed.
      }
  } catch (error) {
      // --- NETWORK ERROR or Fetch/JSON parsing failed ---
      console.error('Fetch/JSON Error:', error);
      // Check if it's likely a CORS issue due to missing/incorrect access key locally
      if (error instanceof TypeError && error.message.includes('fetch')) {
           message = "Submission failed. Please ensure the Access Key is correct and you're testing on a live server (not just local file). Check console for details.";
      } else {
           message = "Oops! A network error occurred or the response could not be processed. Please check your connection and try again.";
      }
      messageType = 'error';
  } finally {
      // --- 4. Update Status Area and Restore Button (Always runs) ---
      if (message && messageType) {
          statusDiv.innerHTML = message;
          statusDiv.className = messageType; // Add 'success' or 'error' class
          statusDiv.style.opacity = '1';     // Make the status message visible

          // --- Optional: Automatically hide the message after a delay ---
          statusDiv.hideTimeout = setTimeout(() => {
              statusDiv.style.opacity = '0';
              setTimeout(() => {
                   // Only clear if the message hasn't changed
                   if (statusDiv.innerHTML === message) {
                      statusDiv.innerHTML = '';
                      statusDiv.className = '';
                   }
              }, 500); // Match CSS transition duration
          }, 6000); // Message visible for 6 seconds
      }

      // --- Restore Button ---
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
  }
}

// --- Make sure the rest of your original script is still here: ---
// (The part that starts with window.addEventListener('DOMContentLoaded'...)
// (The part that gets the form and adds the event listener: form.addEventListener('submit', handleSubmit);)
// (The part that adds the slideInFromLeft animation keyframes and applies it)