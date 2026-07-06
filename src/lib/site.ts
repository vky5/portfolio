export const EMAIL = "vky05@proton.me";
export const GITHUB_URL = "https://github.com/vky5";
export const LINKEDIN_URL = "https://www.linkedin.com/in/vky5/";

/** Scroll to a homepage section, from any page. */
export function goToSection(id: string) {
  if (window.location.pathname === "/") {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  } else {
    window.location.href = `/#${id}`;
  }
}
