export function validateEmailAndGetError(text) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let emailError = "";

  if (!emailRegex.test(text)) {
    emailError = "ingresa un correo válido";
  }

  return emailError;
}
