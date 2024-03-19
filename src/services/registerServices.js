
export function checkPassword(password){
    // La contraseña debe tener al menos 8 caracteres y una mayúscula
    
    const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);

}

export function checkUsername(name){
    const nameCleared = name.toLowerCase().trim();

	if (nameCleared.length > 0 && nameCleared.length < 20) {
		return nameCleared;
	} else {
		return false;
	}
}

export function checkEmail(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}