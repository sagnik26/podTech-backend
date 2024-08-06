const getById = (id) => {
    return document.getElementById(id);
}

const password = getById("password");
const confirmPassword = getById("confirm-password");
const form = getById("form");
const container = getById("container");
const loader = getById("loader");
const submit = getById("submit");
const error = getById("error");
const success = getById("success");

error.style.display = "none";
success.style.display = "none";
container.style.display = 'none';

let token, userId;
const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

const displayError = (errorMessage) => {
    success.style.display = "none";
    error.innerText = errorMessage;
    error.style.display = "block";
}

const displaySuccess = (successMessage) => {
    error.style.display = "none";
    success.innerText = successMessage;
    success.style.display = "block";
}
const handleSubmit = async (evt) => {
    evt.preventDefault();
    // validate
    if(!password.value.trim()) {
        // render error
        return displayError("password is missing");
    }

    if(!passRegex.test(password.value)) {
        // render error
        return displayError("password is too simple, use alpha numeric with special characters!");
    }

    if(password.value !== confirmPassword.value) {
        // render error
        return displayError("password do not match!");
    }

    submit.disabled = true;
    submit.innerText = "Please wait..."

    // Submit
    const res = await fetch("http://localhost:3000/auth/update-password", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify({
            token, 
            userId,
            password: password.value
        })
    });

    submit.disabled = false;
    submit.innerText = "Reset Password"

    if(!res.ok) {
        const { error } = await res.json();
        return displayError(error);
    }

    displaySuccess("Your password is reset successfully!");

    // resetting form
    password.value = "";
    confirmPassword.value = "";
}

window.addEventListener("DOMContentLoaded", async () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchparams, prop) => {
            return searchparams.get(prop);
        }
    });

    token = params.token;
    userId = params.userId;

    console.log("Tk, UId", JSON.stringify({
        token, userId 
    }));

    const res = await fetch("http://localhost:3000/auth/verify-pass-reset-token", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify({
            token, userId 
        })
    });

    if(!res.ok) {
        const { error } = await res.json();
        console.log("ER", error);
        loader.innerText = error;
        return;
    }

    loader.style.display = 'none';
    container.style.display = 'block';
});

form.addEventListener("submit", handleSubmit);
