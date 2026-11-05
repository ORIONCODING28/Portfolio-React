# Engineering rules — Giuseppe Cairone

- Preserve the approved UI and scope; separate presentation, application/domain logic and infrastructure. Prefer simple solutions and strict contracts; no unjustified any.
- WCAG2.1AA: visible high-contrast focus-visible, minimum44x44px interactive targets, contrast4.5:1 body and3:1 large text/key controls.
- Target LCP<2.5s, INP<200ms and CLS<0.1, without claiming measured results without evidence. Run animation outside React render updates; clean up listeners, timers, WebGL resources and textures.
- Never expose private API keys, passwords or tokens in frontend bundles. Validate input, encode output contextually, authorize external links with rel=noopener noreferrer and use SRI for external CDN dependencies.
- Preserve third-party asset credits and licenses. Do not publish private internship/company projects or real customer data.
