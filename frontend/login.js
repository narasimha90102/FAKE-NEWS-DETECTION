import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";

const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    alert("Login Successful");

    window.location.href = "index.html";

  } catch (error) {
    alert(error.message);
  }
});