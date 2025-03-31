// Validar data
const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
};

// Validar nome de domínio
const isValidDomainName = (domain) => {
    // Regex mais flexível que aceita subdomínios e diferentes TLDs
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9](\.[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])*\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
};

// Validar dados do domínio
const validateDomainData = (data) => {
    const errors = [];
    const { name, registrar_id, expiry_date, expiration_date } = data;
    const expiryDate = expiry_date || expiration_date;

    // Validar nome do domínio
    if (!name) {
        errors.push('Nome do domínio é obrigatório');
    } else if (!isValidDomainName(name)) {
        errors.push('Nome do domínio inválido. Use o formato: exemplo.com.br ou sub.exemplo.com');
    }

    // Validar registrador
    if (!registrar_id) {
        errors.push('ID do registrador é obrigatório');
    } else if (isNaN(registrar_id)) {
        errors.push('ID do registrador deve ser um número');
    }

    // Validar data de expiração
    if (!expiryDate) {
        errors.push('Data de expiração é obrigatória');
    } else if (!isValidDate(expiryDate)) {
        errors.push('Data de expiração inválida');
    } else {
        const expDate = new Date(expiryDate);
        const today = new Date();
        if (expDate < today) {
            errors.push('Data de expiração não pode ser no passado');
        }
    }

    return errors;
};

module.exports = {
    isValidDate,
    isValidDomainName,
    validateDomainData
}; 