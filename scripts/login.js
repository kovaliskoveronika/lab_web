import * as cookie from './cookie.mjs'

document.querySelector('.login-btn').onclick = function (event) {
    event.preventDefault();

    const user = {
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value
    }

    fetch('http://127.0.0.1:5000/user/login', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(user)
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        }
        throw response.status;
    }).then(data => {
        cookie.setCookie('access_token', data['access_token'], 60);
        cookie.setCookie('user', JSON.stringify(data['user']), 60);
        window.location.replace('user.html');
    }).catch((error) => {
        if (error === 403) {
            alert("Wrong password or user with this email doesn't exist");
        }
    });
}
