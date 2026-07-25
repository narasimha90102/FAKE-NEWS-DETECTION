import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";

const form = document.getElementById("register-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    const confirm = document.getElementById("reg-confirm").value;

    if (password !== confirm) {
        alert("Passwords do not match");
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);

        alert("Registration Successful");

        window.location.href = "login.html";

    } catch (error) {
        alert(error.message);
    }
});