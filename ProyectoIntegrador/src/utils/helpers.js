// Funciones auxiliares y utilidades

// ========== VALIDACIONES DE FORMULARIOS ==========

// Validar email general
export function validateEmail(email) {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

// Validar email institucional específico
export function validateInstitutionalEmail(email) {
    if (!validateEmail(email)) return false;
    // Verificar que termine en @universidad.edu
    return email.toLowerCase().endsWith('@universidad.edu');
}

// Validar contraseña
export function validatePassword(password) {
    const errors = [];

    if (!password) {
        errors.push('La contraseña es obligatoria');
        return { isValid: false, errors };
    }

    if (password.length < 6) {
        errors.push('Mínimo 6 caracteres');
    }

    if (password.length > 128) {
        errors.push('Máximo 128 caracteres');
    }

    if (!/[a-zA-Z]/.test(password)) {
        errors.push('Debe contener al menos una letra');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Debe contener al menos un número');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Validar nombre completo
export function validateFullName(name) {
    const errors = [];

    if (!name || !name.trim()) {
        errors.push('El nombre es obligatorio');
        return { isValid: false, errors };
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
        errors.push('Mínimo 2 caracteres');
    }

    if (trimmedName.length > 100) {
        errors.push('Máximo 100 caracteres');
    }

    // Solo letras, espacios, acentos y algunos caracteres especiales
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/.test(trimmedName)) {
        errors.push('Solo se permiten letras y espacios');
    }

    // Verificar que tenga al menos nombre y apellido
    const words = trimmedName.split(' ').filter(word => word.length > 0);
    if (words.length < 2) {
        errors.push('Ingresa nombre y apellido completos');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Validar número de teléfono
export function validatePhone(phone) {
    const errors = [];

    // Si está vacío, es opcional, entonces es válido
    if (!phone || !phone.trim()) {
        return { isValid: true, errors: [] };
    }

    const cleanPhone = phone.replace(/[\s()-]/g, '');

    // Formato colombiano: +57 seguido de 9 o 10 dígitos
    if (!/^\+?57?[0-9]{9,10}$/.test(cleanPhone) && !/^[0-9]{7,10}$/.test(cleanPhone)) {
        errors.push('Formato de teléfono inválido');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Validar código de verificación
export function validateVerificationCode(code) {
    const errors = [];

    if (!code || !code.trim()) {
        errors.push('El código es obligatorio');
        return { isValid: false, errors };
    }

    if (!/^[0-9]{6}$/.test(code.trim())) {
        errors.push('El código debe tener 6 dígitos');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Validar mensaje de soporte
export function validateSupportMessage(message) {
    const errors = [];

    if (!message || !message.trim()) {
        errors.push('El mensaje es obligatorio');
        return { isValid: false, errors };
    }

    if (message.trim().length < 10) {
        errors.push('El mensaje debe tener al menos 10 caracteres');
    }

    if (message.trim().length > 1000) {
        errors.push('El mensaje no puede superar 1000 caracteres');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// ========== VALIDACIONES DE FORMULARIOS COMPLETOS ==========

// Validar formulario de login
export function validateLoginForm(email, password) {
    const errors = [];

    if (!email || !email.trim()) {
        errors.push('El correo electrónico es obligatorio');
    } else if (!validateEmail(email)) {
        errors.push('Formato de correo electrónico inválido');
    }

    if (!password || !password.trim()) {
        errors.push('La contraseña es obligatoria');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Validar formulario de registro
export function validateRegisterForm(userData) {
    const { name, email, password, confirmPassword, phone } = userData;
    const errors = [];

    // Validar nombre
    const nameValidation = validateFullName(name);
    if (!nameValidation.isValid) {
        errors.push(...nameValidation.errors.map(err => `Nombre: ${err}`));
    }

    // Validar email
    if (!email || !email.trim()) {
        errors.push('El correo electrónico es obligatorio');
    } else if (!validateInstitutionalEmail(email)) {
        errors.push('Debe usar un correo institucional (@universidad.edu)');
    }

    // Validar contraseña
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        errors.push(...passwordValidation.errors.map(err => `Contraseña: ${err}`));
    }

    // Validar confirmación de contraseña
    if (password !== confirmPassword) {
        errors.push('Las contraseñas no coinciden');
    }

    // Validar teléfono (opcional)
    if (phone) {
        const phoneValidation = validatePhone(phone);
        if (!phoneValidation.isValid) {
            errors.push(...phoneValidation.errors.map(err => `Teléfono: ${err}`));
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Validar formulario de perfil
export function validateProfileForm(profileData) {
    const { phone, recovery_email } = profileData;
    const errors = [];

    // Validar teléfono (opcional)
    if (phone && phone.trim()) {
        const phoneValidation = validatePhone(phone);
        if (!phoneValidation.isValid) {
            errors.push(...phoneValidation.errors.map(err => `Teléfono: ${err}`));
        }
    }

    // Validar correo de recuperación (opcional)
    if (recovery_email && recovery_email.trim()) {
        if (!validateEmail(recovery_email)) {
            errors.push('Formato de correo de recuperación inválido');
        }
        // No debe ser igual al correo institucional
        if (recovery_email.toLowerCase().endsWith('@universidad.edu')) {
            errors.push('El correo de recuperación debe ser personal (no institucional)');
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Validar cambio de contraseña
export function validatePasswordChangeForm(currentPassword, newPassword, confirmPassword) {
    const errors = [];

    if (!currentPassword || !currentPassword.trim()) {
        errors.push('La contraseña actual es obligatoria');
    }

    const newPasswordValidation = validatePassword(newPassword);
    if (!newPasswordValidation.isValid) {
        errors.push(...newPasswordValidation.errors.map(err => `Nueva contraseña: ${err}`));
    }

    if (newPassword !== confirmPassword) {
        errors.push('Las contraseñas nuevas no coinciden');
    }

    if (currentPassword === newPassword) {
        errors.push('La nueva contraseña debe ser diferente a la actual');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// ========== FUNCIONES AUXILIARES ==========

export const formatDate = (date) => {
    if (!date) return '';

    try {
        const d = new Date(date);
        return d.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return date;
    }
};

export const parseJSON = (json) => {
    try {
        return JSON.parse(json);
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return null;
    }
};

// Limpiar y formatear número de teléfono
export const formatPhoneNumber = (phone) => {
    if (!phone) return '';

    // Remover todo excepto números y +
    const cleaned = phone.replace(/[^0-9+]/g, '');

    // Si empieza con +57, formatear como +57 XXX XXX XXXX
    if (cleaned.startsWith('+57')) {
        const number = cleaned.substring(3);
        if (number.length >= 10) {
            return `+57 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6, 10)}`;
        }
    }

    return phone;
};

// Capitalizar nombre
export const capitalizeName = (name) => {
    if (!name) return '';

    return name
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// Generar mensaje de error amigable
export const formatErrorMessage = (errors) => {
    if (!errors || errors.length === 0) return '';

    if (errors.length === 1) {
        return errors[0];
    }

    return `Se encontraron ${errors.length} errores:\n• ${errors.join('\n• ')}`;
};
