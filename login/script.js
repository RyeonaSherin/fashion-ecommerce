function showModal(e, type) {
  e.preventDefault(); // Prevent form from submitting

  const modalBody = document.getElementById("popupModalBody");
  const modalTitle = document.getElementById("popupModalLabel");

  if (type === "login") {
    modalTitle.innerText = "Login Successful";
    modalBody.innerText = "You have successfully logged in.";
  } else if (type === "signup") {
    modalTitle.innerText = "Sign Up Successful";
    modalBody.innerText = "Your account has been created.";
  }

  const popupModal = new bootstrap.Modal(document.getElementById('popupModal'));
  popupModal.show();
}

function showSignup() {
  document.querySelector('.auth-container').classList.add('active');
}

function showLogin() {
  document.querySelector('.auth-container').classList.remove('active');
}
