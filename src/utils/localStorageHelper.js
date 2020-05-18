const USERNAME = 'username';
const TOKEN = 'token';
const USERID = 'userID';

export function setUsername(username) {
    localStorage.setItem(USERNAME, username);
}

export function setUserToken(token) {
    localStorage.setItem(TOKEN, token);
}

export function setUserID(userID) {
    localStorage.setItem(USERID, userID);
}

export function getUsername() {
    return localStorage.getItem(USERNAME)
}

export function getUserToken() {
    return localStorage.getItem(TOKEN)
}

export function getUserID() {
    return localStorage.getItem(USERID)
}

export function clearLocalStorageItem() {
    localStorage.removeItem(USERNAME);
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USERID);
}