

export function validateEmailAndGetError (text: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let emailError: string = '';

    if (!emailRegex.test(text)) {
      emailError = 'ingresa un correo válido';
    }

    return emailError;
};