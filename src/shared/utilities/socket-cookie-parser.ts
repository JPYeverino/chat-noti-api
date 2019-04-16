export function cookieParser(unparsedCookie) {
  let cookieObj = {};

  unparsedCookie.split(';').forEach(element => {
    let cookieKV = element.trim().split('=');

    cookieObj[cookieKV[0]] = cookieKV[1];

  });

  return cookieObj;
}