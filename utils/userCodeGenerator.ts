// Utility functions for generating unique user codes

export function generateUserCode(firstName: string, lastName: string, email: string): string {
  // Create a base from first name + last name
  const nameBase = (firstName + lastName).toLowerCase().replace(/[^a-z]/g, '');
  
  // Create a hash from email for uniqueness
  const emailHash = hashString(email);
  
  // Generate a short unique suffix
  const timestamp = Date.now().toString().slice(-6);
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  // Combine everything for a unique code
  const baseCode = nameBase.slice(0, 8) + emailHash.slice(0, 3) + timestamp.slice(-3) + randomNum.slice(-2);
  
  return baseCode.toLowerCase();
}

export function generateShortCode(): string {
  // Generate a short random code for users without full names
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const timestamp = Date.now().toString().slice(-4);
  let result = '';
  
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result + timestamp;
}

export function generateProfessionalCode(specialization: string, institution: string): string {
  // For professional accounts, create more professional-looking codes
  const specCode = specialization.toLowerCase().replace(/[^a-z]/g, '').slice(0, 4);
  const instCode = institution.toLowerCase().replace(/[^a-z]/g, '').slice(0, 4);
  const uniqueNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  
  return `${specCode}${instCode}${uniqueNum}`.slice(0, 12);
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

export function isCodeUnique(code: string, existingCodes: string[]): boolean {
  return !existingCodes.includes(code);
}

export function generateUniqueUserCode(userData: any, existingCodes: string[] = []): string {
  let code: string;
  let attempts = 0;
  const maxAttempts = 10;
  
  do {
    if (userData.accountType === 'professional' && userData.specialization && userData.institution) {
      code = generateProfessionalCode(userData.specialization, userData.institution);
    } else if (userData.firstName && userData.lastName) {
      code = generateUserCode(userData.firstName, userData.lastName, userData.email);
    } else {
      code = generateShortCode();
    }
    
    // Add random suffix if code exists
    if (!isCodeUnique(code, existingCodes) && attempts < maxAttempts) {
      code += Math.floor(Math.random() * 99).toString().padStart(2, '0');
    }
    
    attempts++;
  } while (!isCodeUnique(code, existingCodes) && attempts < maxAttempts);
  
  return code;
}
