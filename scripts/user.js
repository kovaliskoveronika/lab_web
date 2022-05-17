import * as cookie from './cookie.mjs'

const nickname = document.querySelector('#nickname');
const name = document.querySelector('#name');
const surname = document.querySelector('#surname');
const email = document.querySelector('#email');
const authToken = cookie.getAuthToken();

const user = JSON.parse(cookie.getCookie('user'));
nickname.value = user.nickname;
name.value = user.name;
surname.value = user.surname;
email.value = user.email;


document.querySelector('.submit-btn').onclick = function (event) {
    event.preventDefault();

    if (!validate()) {
        return;
    }

    const nicknameValue = nickname.value;
    const nameValue = name.value;
    const surnameValue = surname.value;
    const emailValue = email.value;

    const data = {
        nickname: nicknameValue,
        name: nameValue,
        surname: surnameValue,
        email: emailValue
    }

    fetch('http://127.0.0.1:5000/user/update', {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + authToken
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.status === 200) {
            cookie.setCookie('user', JSON.stringify(data), 60);
            window.location.replace('user.html');
            return response.json();
        }
        throw response.status;
    }).catch((error) => {
        console.log(error);
        if (error === 403) {
            alert('Try again');
        }
    });
}

document.querySelector('.logout-btn').onclick = function (event) {
    event.preventDefault();
    const data = {}

    fetch('http://127.0.0.1:5000/user/logout', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.status === 200) {
            cookie.clearCookie('access_token');
            cookie.clearCookie('user');
            window.location.replace('login.html');
            return response.json();
        }
        throw response.status;
    }).catch((error) => {
        if (error === 403) {
            alert('Try again');
        }
    });

}

function validate() {
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    let status = true

    if (!validateEmail(email.value)) {
        email.value = '';
        email.placeholder = 'Email is already used';
        status = false;
    }

    if (nickname.value === '') {
        nickname.placeholder = 'Incorrect nickname';
        status = false;
    }

    if (name.value === '') {
        name.placeholder = 'Write your name';
        status = false;
    }

    if (surname.value === '') {
        surname.placeholder = 'Write your surname';
        status = false;
    }

    return status;
}
