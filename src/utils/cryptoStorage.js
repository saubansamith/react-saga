import CryptoJS from 'crypto-js';

// Hardcoded secret key for demo purposes
const SECRET_KEY = 'MEDFLOW_SECRET_KEY_2026';

/**
 * Encrypts a JavaScript object to an AES ciphertext string.
 */
export const encryptData = (data) => {
    try {
        const jsonString = JSON.stringify(data);
        const ciphertext = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
        console.groupCollapsed('🔒 AES Encryption');
        console.log('Original Data:', data);
        console.log('Encrypted Ciphertext:', ciphertext);
        console.groupEnd();
        return ciphertext;
    } catch (error) {
        console.error('Encryption failed:', error);
        return null;
    }
};

/**
 * Decrypts an AES ciphertext string back to a JavaScript object.
 */
export const decryptData = (ciphertext) => {
    try {
        if (!ciphertext) return null;
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedString) {
            throw new Error("Decryption returned empty string (possibly wrong key)");
        }

        const data = JSON.parse(decryptedString);
        console.groupCollapsed('🔓 AES Decryption');
        console.log('Encrypted Ciphertext:', ciphertext);
        console.log('Decrypted Data:', data);
        console.groupEnd();
        return data;
    } catch (error) {
        console.error('Decryption failed:', error);
        return null;
    }
};

/**
 * Encrypts data and saves it to localStorage.
 */
export const saveToLocalStorage = (key, data) => {
    console.groupCollapsed(`💾 Saving to LocalStorage: [${key}]`);
    const encrypted = encryptData(data);
    if (encrypted) {
        localStorage.setItem(key, encrypted);
        console.log(`Successfully saved encrypted data under key: ${key}`);
    } else {
        console.warn(`Failed to save data for key: ${key}`);
    }
    console.groupEnd();
};

/**
 * Loads data from localStorage and decrypts it.
 */
export const loadFromLocalStorage = (key) => {
    console.groupCollapsed(`📂 Loading from LocalStorage: [${key}]`);
    const encrypted = localStorage.getItem(key);
    if (!encrypted) {
        console.log(`No data found for key: ${key}`);
        console.groupEnd();
        return null;
    }
    const decrypted = decryptData(encrypted);
    console.log(`Successfully loaded and decrypted data for key: ${key}`);
    console.groupEnd();
    return decrypted;
};

/**
 * Removes data from localStorage.
 */
export const removeFromLocalStorage = (key) => {
    console.log(`🗑️ Removing from LocalStorage: [${key}]`);
    localStorage.removeItem(key);
};
