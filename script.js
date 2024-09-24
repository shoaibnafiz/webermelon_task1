function showStep(step) {
    document.querySelectorAll('.step').forEach((el) => el.classList.remove('active'));
    document.getElementById(step).classList.add('active');
}

let userId = null;

function generateOTP() {
    const email = document.getElementById('email').value;
    const emailError = document.getElementById('email-error');

    if (validateEmail(email)) {
        fetch('generateOTP.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('step-1').style.display = 'none';
                    document.getElementById('step-2').style.display = 'block';
                } else {
                    alert(data.message);
                }
            });

        showStep('step-2');
    } else {
        emailError.textContent = 'Please enter a valid email address.';
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function verifyOTP() {
    const email = document.getElementById('email').value;
    const otp = document.getElementById('otp').value;
    const otpError = document.getElementById('otp-error');

    fetch('verifyOTP.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('step-2').style.display = 'none';
                if (data.isNewUser) {
                    document.getElementById('step-3').style.display = 'block';
                    showStep('step-3');
                } else {
                    document.getElementById('step-4').style.display = 'block';
                    userId = data.user_id;
                    fillEventRegistration(data.registeredUser);
                    showStep('step-4');
                }
            } else {
                // alert(data.message);
                otpError.textContent = data.message;
            }
        });
}

function registerUser() {
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirm_password = document.getElementById('confirm_password').value;
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm_password-error');


    usernameError.textContent = '';
    passwordError.textContent = '';
    confirmPasswordError.textContent = '';

    if (!username) {
        usernameError.textContent = 'Username is required.';
        return;
    }
    if (password.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters long.';
        return;
    }
    if (password !== confirm_password) {
        confirmPasswordError.textContent = 'Passwords do not match.';
        return;
    }

    // if (password !== confirm_password) {
    //     alert('Passwords do not match');
    //     return;
    // }

    fetch('registerUser.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                userId = data.user_id;
                document.getElementById('step-3').style.display = 'none';
                document.getElementById('step-4').style.display = 'block';
            } else {
                alert(data.message);
            }
        });

    showStep('step-4');
}

function registerEvent() {
    const eventRegistrationData = {
        user_id: userId,
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        phone_number: document.getElementById('phone_number').value,
        event_date: document.getElementById('event_date').value,
        pricing_plan: document.getElementById('pricing_plan').value
    };
    const firstNameError = document.getElementById('first_name-error');
    const lastNameError = document.getElementById('last_name-error');
    const phoneNumberError = document.getElementById('phone_number-error');
    const eventDateError = document.getElementById('event_date-error');
    const pricingPlanError = document.getElementById('pricing_plan-error');

    firstNameError.textContent = '';
    lastNameError.textContent = '';
    phoneNumberError.textContent = '';
    eventDateError.textContent = '';
    pricingPlanError.textContent = '';

    if (!eventRegistrationData?.first_name) {
        firstNameError.textContent = 'First name is required.';
        return;
    }
    if (!eventRegistrationData?.last_name) {
        lastNameError.textContent = 'Last name is required.';
        return;
    }
    if (!eventRegistrationData?.phone_number) {
        phoneNumberError.textContent = 'Phone number is required.';
        return;
    }
    if (!eventRegistrationData?.event_date) {
        eventDateError.textContent = 'Event date is required.';
        return;
    }
    if (!eventRegistrationData?.pricing_plan) {
        pricingPlanError.textContent = 'Pricing plan is required.';
        return;
    }

    fetch('registerEvent.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventRegistrationData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Event registered successfully');
            } else {
                alert(data.message);
            }
        });
}

function fillEventRegistration(registeredUser) {
    document.getElementById('first_name').value = registeredUser.first_name;
    document.getElementById('last_name').value = registeredUser.last_name;
    document.getElementById('phone_number').value = registeredUser.phone_number;
}

function resendOTP() {
    generateOTP();
}
