// Wait for the DOM to fully load before executing scripts
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ CSE Motors script loaded successfully!');

  /* ****************************
   * Mobile Navigation Toggle
   **************************** */
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', () => {
          navMenu.classList.toggle('active');
      });
  } else {
      console.warn('⚠️ Navigation elements not found.');
  }

  /* ****************************
   * Smooth Scrolling for Anchor Links
   **************************** */
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

  if (smoothScrollLinks.length > 0) {
      smoothScrollLinks.forEach((link) => {
          link.addEventListener('click', (event) => {
              event.preventDefault();
              const targetId = link.getAttribute('href').substring(1);
              const targetElement = document.getElementById(targetId);

              if (targetElement) {
                  window.scrollTo({
                      top: targetElement.offsetTop - 50, // Adjust for fixed header
                      behavior: 'smooth',
                  });
              } else {
                  console.warn(`⚠️ Target element #${targetId} not found.`);
              }
          });
      });
  }

  /* ****************************
   * Additional Features Placeholder
   **************************** */
  console.log('📌 Additional interactivity can be added here.');
});
