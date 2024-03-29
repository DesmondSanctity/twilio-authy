import { BehaviorSubject } from "rxjs";
import getConfig from "next/config";
import Router from "next/router";

import { fetchWrapper } from "helpers";
import { alertService } from "./alert.service";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;
const storedData =
  typeof window !== "undefined" && JSON.parse(localStorage.getItem("appData"));
const userSubject = new BehaviorSubject(
  storedData || { auth: false, user: null }
);

export const userService = {
  user: userSubject.asObservable(),
  get userValue() {
    return userSubject.value;
  },
  login,
  logout,
  register,
  getAll,
  getById,
  update,
  delete: _delete,
};

async function login(username, password) {
  const user = await fetchWrapper.post(`${baseUrl}/users/authenticate`, {
    username,
    password,
  });

  // publish user to subscribers and store in local storage to stay logged in between page refreshes
  const data = {
    user: user,
    auth: false,
  };
  userSubject.next(data);
  localStorage.setItem("appData", JSON.stringify(data));
}

function logout() {
  alertService.clear();
  // remove user from local storage, publish null to user subscribers and redirect to login page
  const appData = JSON.parse(localStorage.getItem("appData"));
  // Set user to null
  appData.user = null;
  // Set auth to false
  appData.auth = false;
  // Save updated appData
  localStorage.setItem("appData", JSON.stringify(appData));

  userSubject.next(appData);
  Router.push("/account/login");
}

async function register(user) {
  await fetchWrapper.post(`${baseUrl}/users/register`, user);
}

async function getAll() {
  return await fetchWrapper.get(`${baseUrl}/users`);
}

async function getById(id) {
  return await fetchWrapper.get(`${baseUrl}/users/${id}`);
}

async function update(id, params) {
  await fetchWrapper.put(`${baseUrl}/users/${id}`, params);

  // Get appData from localStorage
  const appData = JSON.parse(localStorage.getItem("appData"));

  // update stored user if the logged in user updated their own record
  if (id === appData.user.id) {
    // Update user data in appData
    const updatedUser = { ...appData.user, ...params };
    appData.user = updatedUser;
    // Save updated appData object to localStorage
    localStorage.setItem("appData", JSON.stringify(appData));

    // publish updated user to subscribers
    userSubject.next(updatedUser);
  }
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(id) {
  await fetchWrapper.delete(`${baseUrl}/users/${id}`);

  // auto logout if the logged in user deleted their own record
  if (id === userSubject.value.id) {
    logout();
  }
}
