export interface ValidationResult {
  isValid: boolean;
  error?: string;
  isSecuredPlatform?: boolean;
  platformGuidance?: string;
}

export function validateUrl(url: string): ValidationResult {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();

    // Check for secured platforms
    if (domain.includes('linkedin.com') || 
        domain.includes('facebook.com') ||
        domain.includes('instagram.com')) {
      return {
        isValid: true,
        isSecuredPlatform: true,
        platformGuidance: `This appears to be a ${domain.includes('linkedin.com') ? 'LinkedIn' : 
                          domain.includes('facebook.com') ? 'Facebook' : 
                          'Instagram'} URL. Due to privacy settings, we cannot directly access the content.

To analyze this profile:
1. Save the page as PDF:
   • Open the profile
   • Use browser's print function (Ctrl/Cmd + P)
   • Save as PDF
2. Upload the PDF here
3. Or copy the content into a document and upload it

This ensures accurate analysis while respecting privacy settings.`
      };
    }

    return { isValid: true };
  } catch {
    return {
      isValid: false,
      error: 'Please enter a valid URL'
    };
  }
}