
function validateUsername(username) {
  if (typeof username !== 'string') {
    return "Error: username must be a string";
  }
  if (username.length < 5 || username.length > 15) {
    return "Error: username length must be between 5 and 15 characters";
  }
  return null;
}

function validateEmail(email) {
  if (typeof email !== 'string') {
    return "Error: email must be a string";
  }
  if (!email.includes('@') || email.indexOf('.') < email.indexOf('@')) {
    return "Error: email must contain '@' and a dot '.' after it";
  }
  return null;
}

function validateAge(age) {
  if (typeof age !== 'number' || !Number.isInteger(age)) {
    return "Error: age must be an integer number";
  }
  if (age < 18 || age > 120) {
    return "Error: age must be between 18 and 120";
  }
  return null;
}

function validateAgreement(isAgreed) {
  if (typeof isAgreed !== 'boolean') {
    return "Error: agreement must be boolean";
  }
  if (!isAgreed) {
    return "Error: agreement must be true";
  }
  return null;
}

function validatePhone(phone) {
  if (typeof phone === 'undefined') {
    return null;
  }
  if (typeof phone !== 'string') {
    return "Error: phone must be a string or undefined";
  }
  if (!phone.startsWith('+7') || phone.length !== 12) {
    return "Error: phone must start with '+7' and be 12 characters long";
  }
  return null;
}
