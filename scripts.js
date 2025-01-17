const scriptURL = "https://script.google.com/macros/s/AKfycbyPBaaywpPbprHdL3Ms9rRZ7nc1-dLYvzTaArTiBKNC6ikDjzjl1frtSz2dIvU71hcK/exec";
const form = document.forms['contact-form'];
const submitButton = document.querySelector('button[type="submit"]');

form.addEventListener('submit', e => {
  e.preventDefault();
  
  // Disable the button to prevent double-click
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  fetch(scriptURL, { method: 'POST', body: new FormData(form) })
    .then(response => {
      alert("Thank you! Form is submitted");
      window.location.reload();
    })
    .catch(error => {
      console.error('Error!', error.message);
      submitButton.disabled = false;  // Re-enable on error
      submitButton.textContent = "Submit";
    });
});



function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const menuBtn = document.querySelector('.menu-btn');

    // Toggle active class for sidebar and overlay
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');

    // Toggle active class for menu button
    menuBtn.classList.toggle('active');
}




