export function getCookies() {
    return document.cookie.split(";").reduce((acc, cookie) => {
      const [name, value] = cookie.split("=").map((c) => c.trim());
      if (name && value) {
        acc[name] = decodeURIComponent(value);
      }
      return acc;
    }, {});
  }
  
  export function getToken() {
    const cookies = getCookies();
    const authData = cookies.authData ? JSON.parse(decodeURIComponent(cookies.authData)) : null;
    return authData ? authData.token : null;
  }
  
  export function deleteCookie(name) {
    if (name) {
      document.cookie = `${name}=; Max-Age=-99999999; path=/;`;
    }
  }
  
  export function deleteAllCookies() {
    const cookies = getCookies();
    Object.keys(cookies).forEach((cookieName) => deleteCookie(cookieName));
  }
  
  export function getUserId() {
    const cookies = getCookies();
    const authData = cookies.authData ? JSON.parse(decodeURIComponent(cookies.authData)) : null;
    return authData ? authData.userId : null;
  }
  
  export function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + expires + "; path=/";
  }
  
  export function deleteToken() {
    localStorage.removeItem('token');
  }
  