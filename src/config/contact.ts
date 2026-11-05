// Public browser identifiers; secret CAPTCHA keys belong only in EmailJS.
export const contactConfig = {
  serviceId: import.meta.env?.VITE_EMAILJS_SERVICE_ID || 'service_bm27su1',
  templateId: import.meta.env?.VITE_EMAILJS_TEMPLATE_ID || 'template_vztxwjf',
  publicKey: import.meta.env?.VITE_EMAILJS_PUBLIC_KEY || 'iDwtQACg1CcdRsVuV',
  captchaSiteKey: import.meta.env?.VITE_RECAPTCHA_SITE_KEY?.trim() || '6LcmsBEuAAAAAKns9a8IVqFSofMe7BxdHDl-2sML',
};
