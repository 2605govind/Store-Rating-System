
export const InputDataValidate = (name, email, address, password) => {
    if (!name || name.length < 2 || name.length > 60) {
        return { valid: false, message: "Name must be between 2 and 60 characters" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return { valid: false, message: "Invalid email format" };
    }

    if (!address || address.length > 400) {
        return { valid: false, message: "Address must be less than 400 characters" };
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!password || !passwordRegex.test(password)) {
        return {
            valid: false,
            message: "Password must be 8-16 chars, include at least 1 uppercase letter and 1 special character"
        };
    }

    return { valid: true }; 
};




export const InputStoreDataValidate = (name, email, address) => {
    if (!name || name.length < 2 || name.length > 60) {
        return { valid: false, message: "Name must be between 2 and 60 characters" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return { valid: false, message: "Invalid email format" };
    }

    if (!address || address.length > 400) {
        return { valid: false, message: "Address must be less than 400 characters" };
    }

    return { valid: true }; 
};
