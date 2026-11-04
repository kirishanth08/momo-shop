/**
 * CHOPSTICKS — Momos & Chinese Street Food Stall
 * Core JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  initMobileNav();

  // 2. Sticky Header Elevation
  initStickyHeader();

  // 3. Scroll Reveal Animations
  initScrollReveal();

  // 4. Menu Category Filtering & Live Search (if on menu page)
  initMenuFilters();

  // 5. FAQ Accordion (if on contact page)
  initFAQAccordion();

  // 6. Contact & Order Enquiry Form Handling
  initOrderForm();

  // 7. Interactive Steamed vs Fried Duel (Home Page)
  initDuelInteractions();

  // 8. Auto set minimum date/time for pickup
  initDateTimeDefaults();

  // 9. Dark/Light Mode Toggle
  initThemeToggle();

  // 10. RTL / LTR Toggle
  initRtlToggle();

  // 11. Home 2 Playful Arena & Momo Roulette
  initPlayfulArena();

  // 12. Cart & Checkout System
  initCartSystem();
});

/* --------------------------------------------------------------------------
   1. Mobile Navigation
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const mobileMenu = document.getElementById('mobileNavMenu');

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      mobileMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    } else {
      mobileMenu.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
  });

  // Close when clicking outside or clicking any link
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      mobileMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  const links = mobileMenu.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   2. Sticky Header Elevation
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   3. Scroll Reveal Animations
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if observer not supported
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}

/* --------------------------------------------------------------------------
   4. Menu Category Filtering & Live Search
   -------------------------------------------------------------------------- */
function initMenuFilters() {
  const filterButtons = document.querySelectorAll('.filter-pill-btn');
  const searchInput = document.getElementById('menuSearchInput');
  const dishCards = document.querySelectorAll('.menu-dish-item');
  const categorySections = document.querySelectorAll('.category-section-block');

  if (!filterButtons.length && !searchInput) return;

  let currentCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visibleCount = 0;

    dishCards.forEach(card => {
      const cardCat = card.getAttribute('data-category') || '';
      const cardTitle = (card.querySelector('.food-card-title')?.textContent || '').toLowerCase();
      const cardDesc = (card.querySelector('.food-card-desc')?.textContent || '').toLowerCase();
      const cardDiet = (card.getAttribute('data-diet') || '').toLowerCase();

      const matchesCat = (currentCategory === 'all' || cardCat === currentCategory);
      const matchesSearch = !searchQuery || 
        cardTitle.includes(searchQuery) || 
        cardDesc.includes(searchQuery) || 
        cardDiet.includes(searchQuery);

      if (matchesCat && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Handle empty section visibility
    categorySections.forEach(sec => {
      const secCat = sec.getAttribute('data-category-section');
      const cardsInSec = sec.querySelectorAll('.menu-dish-item');
      let anyVisible = false;

      cardsInSec.forEach(c => {
        if (c.style.display !== 'none') anyVisible = true;
      });

      if (currentCategory === 'all') {
        sec.style.display = anyVisible ? '' : 'none';
      } else {
        sec.style.display = (secCat === currentCategory && anyVisible) ? '' : 'none';
      }
    });

    // Display 'no results' feedback if 0
    let noResultsMsg = document.getElementById('noResultsMsg');
    if (!noResultsMsg && visibleCount === 0) {
      const container = document.querySelector('.menu-items-container') || document.querySelector('#menuCatalog');
      if (container) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'noResultsMsg';
        noResultsMsg.className = 'text-center py-5';
        noResultsMsg.innerHTML = `
          <div style="font-size: 3rem; margin-bottom: 1rem;">🥟🔍</div>
          <h3 style="font-size: 1.4rem; color: var(--color-primary-dark); margin-bottom: 0.5rem;">No dishes match your craving</h3>
          <p style="color: var(--color-text-muted);">Try searching for momos, noodles, spicy dips, or pick a different category above.</p>
        `;
        container.appendChild(noResultsMsg);
      }
    } else if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter') || 'all';
      applyFilters();

      // If user clicks a specific category, smooth scroll slightly if needed
      if (currentCategory !== 'all') {
        const targetSec = document.querySelector(`[data-category-section="${currentCategory}"]`);
        if (targetSec) {
          const headerOffset = 140;
          const elementPosition = targetSec.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
}

/* --------------------------------------------------------------------------
   5. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const headerBtn = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    if (!headerBtn || !body) return;

    headerBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others for clean single-view accordion
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBody = otherItem.querySelector('.faq-body');
          if (otherBody) otherBody.style.maxHeight = null;
        }
      });

      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        body.style.maxHeight = null;
      }
    });
  });

  // Open first FAQ by default
  if (faqItems[0]) {
    const firstBody = faqItems[0].querySelector('.faq-body');
    faqItems[0].classList.add('active');
    if (firstBody) firstBody.style.maxHeight = firstBody.scrollHeight + 'px';
  }
}

/* --------------------------------------------------------------------------
   6. Contact & Order Enquiry Form
   -------------------------------------------------------------------------- */
function initOrderForm() {
  const form = document.getElementById('orderEnquiryForm');
  const modal = document.getElementById('orderSuccessModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalSummary = document.getElementById('modalOrderSummary');

  if (!form) return;

  const nameInput = document.getElementById('custName');
  const phoneInput = document.getElementById('custPhone');
  const nameError = document.getElementById('custNameError');
  const phoneError = document.getElementById('custPhoneError');

  // Strict live validation: Character field accepts only letters and spaces/characters, no digits
  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      const sanitized = e.target.value.replace(/[0-9]/g, '');
      if (sanitized !== e.target.value) {
        e.target.value = sanitized;
        if (nameError) nameError.style.display = 'block';
      } else if (nameError) {
        nameError.style.display = 'none';
      }
    });
  }

  // Strict live validation: Number field accepts only digits 0-9, up to 10 digits
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      const sanitized = e.target.value.replace(/\D/g, '').slice(0, 10);
      if (sanitized !== e.target.value) {
        e.target.value = sanitized;
        if (phoneError) phoneError.style.display = 'block';
      } else if (phoneError) {
        phoneError.style.display = 'none';
      }
    });
  }

  if (!modal) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput?.value.trim() || '';
    const phone = phoneInput?.value.trim() || '';

    // Validate characters-only for name
    const nameRegex = /^[A-Za-z\s.'-]+$/;
    if (!name || !nameRegex.test(name)) {
      if (nameError) {
        nameError.textContent = 'Please enter letters and characters only (no numbers allowed).';
        nameError.style.display = 'block';
      }
      nameInput?.focus();
      return;
    } else if (nameError) {
      nameError.style.display = 'none';
    }

    // Validate digits-only for phone (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
      if (phoneError) {
        phoneError.textContent = 'Please enter exactly 10 digits (numbers only).';
        phoneError.style.display = 'block';
      }
      phoneInput?.focus();
      return;
    } else if (phoneError) {
      phoneError.style.display = 'none';
    }

    // Check overall HTML5 form validity
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const orderType = document.getElementById('orderType')?.value;
    const pickupTime = document.getElementById('pickupDateTime')?.value;
    const dishes = document.getElementById('dishesSelected')?.value.trim();
    const spice = document.getElementById('spiceLevel')?.value;
    const instructions = document.getElementById('specialInstructions')?.value.trim();

    // Generate random order reference
    const orderId = 'CHP-' + Math.floor(100000 + Math.random() * 900000);

    // Format pickup date
    let formattedDate = pickupTime ? new Date(pickupTime).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }) : 'As soon as possible (10-15 mins)';

    if (modalSummary) {
      modalSummary.innerHTML = `
        <div style="background: var(--color-cream-bg); border-radius: var(--radius-sm); padding: 1rem; margin-bottom: 1.25rem; text-align: left; font-size: 0.9rem;">
          <p style="margin-bottom: 0.35rem;"><strong>Order Ref:</strong> <span style="color: var(--color-chilli-accent); font-weight: 800;">${orderId}</span></p>
          <p style="margin-bottom: 0.35rem;"><strong>Customer:</strong> ${name} (${phone})</p>
          <p style="margin-bottom: 0.35rem;"><strong>Type:</strong> ${orderType}</p>
          <p style="margin-bottom: 0.35rem;"><strong>Pickup Time:</strong> ${formattedDate}</p>
          <p style="margin-bottom: 0.35rem;"><strong>Dishes:</strong> ${dishes}</p>
          <p style="margin-bottom: 0;"><strong>Spice Preference:</strong> ${spice}</p>
          ${instructions ? `<p style="margin-top: 0.35rem; margin-bottom: 0;"><strong>Notes:</strong> ${instructions}</p>` : ''}
        </div>
        <p style="font-size: 0.85rem; color: var(--color-stone-muted);">Our stall counter has received your slip. You can collect your hot packaging fresh at the counter!</p>
      `;
    }

    // Show Modal
    modal.classList.add('open');

    // Reset Form
    form.reset();
  });

  const closeModal = () => {
    modal.classList.remove('open');
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   7. Steamed vs Fried Duel Interactions
   -------------------------------------------------------------------------- */
function initDuelInteractions() {
  const steamedCard = document.getElementById('duelSteamedCard');
  const friedCard = document.getElementById('duelFriedCard');

  if (!steamedCard || !friedCard) return;

  steamedCard.addEventListener('mouseenter', () => {
    steamedCard.style.borderColor = 'var(--color-primary-dark)';
  });
  steamedCard.addEventListener('mouseleave', () => {
    steamedCard.style.borderColor = 'rgba(168, 164, 146, 0.35)';
  });

  friedCard.addEventListener('mouseenter', () => {
    friedCard.style.borderColor = 'var(--color-chilli-accent)';
  });
  friedCard.addEventListener('mouseleave', () => {
    friedCard.style.borderColor = 'rgba(236, 91, 56, 0.3)';
  });
}

/* --------------------------------------------------------------------------
   8. Pickup Time Default Setter
   -------------------------------------------------------------------------- */
function initDateTimeDefaults() {
  const pickupInput = document.getElementById('pickupDateTime');
  if (!pickupInput) return;

  const now = new Date();
  // Add 15 mins
  now.setMinutes(now.getMinutes() + 15);
  // Format for datetime-local (YYYY-MM-DDTHH:mm)
  const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  pickupInput.min = localIso;
  pickupInput.value = localIso;
}

/* --------------------------------------------------------------------------
   9. Quick Select Helper (from any page to pre-select item in enquiry form)
   -------------------------------------------------------------------------- */
window.quickEnquireItem = function(dishName) {
  // If we are already on contact.html
  const dishesInput = document.getElementById('dishesSelected');
  if (dishesInput) {
    dishesInput.value = dishName;
    const formSection = document.getElementById('orderFormSection');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
    const nameInput = document.getElementById('custName');
    if (nameInput) nameInput.focus();
  } else {
    // Navigate to contact.html with query param
    window.location.href = `contact.html?dish=${encodeURIComponent(dishName)}#orderFormSection`;
  }
};

// Check URL params on load to auto-fill dish if redirected
(function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const dishParam = params.get('dish');
  if (dishParam) {
    const dishesInput = document.getElementById('dishesSelected');
    if (dishesInput) {
      dishesInput.value = decodeURIComponent(dishParam);
    }
  }
})();



/* --------------------------------------------------------------------------
   10. Dark Mode / Light Mode Toggle
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleButtons = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('chopsticks_theme');

  // Check initial or saved theme
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = storedTheme || (prefersDark ? 'dark' : 'light');

  applyTheme(currentTheme);

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(activeTheme);
      localStorage.setItem('chopsticks_theme', activeTheme);
    });
  });

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      updateThemeIcons(true);
    } else {
      document.documentElement.removeAttribute('data-theme');
      updateThemeIcons(false);
    }
  }

  function updateThemeIcons(isDark) {
    toggleButtons.forEach(btn => {
      const sunIcon = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');
      const tooltip = btn.querySelector('.btn-tooltip-badge');

      if (sunIcon && moonIcon) {
        if (isDark) {
          sunIcon.style.display = 'block';
          moonIcon.style.display = 'none';
          if (tooltip) tooltip.textContent = 'Light Mode';
        } else {
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'block';
          if (tooltip) tooltip.textContent = 'Dark Mode';
        }
      }
    });
  }
}

/* --------------------------------------------------------------------------
   11. RTL / LTR Direction Toggle
   -------------------------------------------------------------------------- */
function initRtlToggle() {
  const rtlButtons = document.querySelectorAll('.rtl-toggle-btn');
  const storedDir = localStorage.getItem('chopsticks_dir') || 'ltr';

  applyDirection(storedDir);

  rtlButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(nextDir);
      localStorage.setItem('chopsticks_dir', nextDir);
    });
  });

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    rtlButtons.forEach(btn => {
      const label = btn.querySelector('.rtl-text-label');
      const tooltip = btn.querySelector('.btn-tooltip-badge');
      if (label) {
        label.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
      if (tooltip) {
        tooltip.textContent = dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   12. Home 2 Playful Arena & Momo Roulette
   -------------------------------------------------------------------------- */
function initPlayfulArena() {
  // A. Faction Switcher with Instant Real-Time Hero Feedback
  const steamBtn = document.getElementById('switchSteamFaction');
  const friedBtn = document.getElementById('switchFriedFaction');
  const steamShowcase = document.getElementById('steamShowcaseBlock');
  const friedShowcase = document.getElementById('friedShowcaseBlock');
  const heroCard = document.getElementById('arenaHeroCard');
  const heroBadge = document.getElementById('arenaHeroBadge');
  const heroTitle = document.getElementById('arenaHeroTitle');
  const heroDesc = document.getElementById('arenaHeroDesc');
  const heroScrollBtn = document.getElementById('arenaHeroScrollBtn');
  const steamScoreCard = document.querySelector('.battle-score-card.steam-score');
  const friedScoreCard = document.querySelector('.battle-score-card.fried-score');

  function setSteamedActive() {
    if (!steamBtn || !friedBtn) return;
    steamBtn.className = 'arena-switch-btn active-steam';
    friedBtn.className = 'arena-switch-btn';

    if (heroCard) {
      heroCard.className = 'arena-live-hero-card steamed-mode';
      if (heroBadge) heroBadge.innerHTML = '<span>🥟</span> Team Steamed Faction Active';
      if (heroTitle) heroTitle.textContent = 'Pure Himalayan Steamed Perfection';
      if (heroDesc) heroDesc.textContent = 'Hand-pinched translucent skins (0.6mm thin) cradling steaming ginger-infused meat or spiced cottage cheese with zero oil cooking.';
      if (heroScrollBtn) {
        heroScrollBtn.setAttribute('href', '#steamShowcaseBlock');
        heroScrollBtn.innerHTML = 'Explore Steamed Realm &darr;';
      }
    }

    if (steamShowcase) steamShowcase.style.display = 'block';
    if (friedShowcase) friedShowcase.style.display = 'none';

    if (steamScoreCard) {
      steamScoreCard.style.boxShadow = '0 8px 28px rgba(82, 70, 70, 0.2)';
      steamScoreCard.style.transform = 'scale(1.02)';
    }
    if (friedScoreCard) {
      friedScoreCard.style.boxShadow = '';
      friedScoreCard.style.transform = 'scale(1)';
    }
  }

  function setFriedActive() {
    if (!steamBtn || !friedBtn) return;
    friedBtn.className = 'arena-switch-btn active-fried';
    steamBtn.className = 'arena-switch-btn';

    if (heroCard) {
      heroCard.className = 'arena-live-hero-card fried-mode';
      if (heroBadge) heroBadge.innerHTML = '<span>🔥</span> Team Crispy Crunch Active';
      if (heroTitle) heroTitle.textContent = 'Audible Shattering Kurkure Crunch';
      if (heroDesc) heroDesc.textContent = 'Double-dusted in spiced cereal flakes, flash-fried to golden sizzle, or wok-flamed in spicy garlic schezwan syrup.';
      if (heroScrollBtn) {
        heroScrollBtn.setAttribute('href', '#friedShowcaseBlock');
        heroScrollBtn.innerHTML = 'Explore Crunch Carnival &darr;';
      }
    }

    if (steamShowcase) steamShowcase.style.display = 'none';
    if (friedShowcase) friedShowcase.style.display = 'block';

    if (friedScoreCard) {
      friedScoreCard.style.boxShadow = '0 8px 28px rgba(236, 91, 56, 0.35)';
      friedScoreCard.style.transform = 'scale(1.02)';
    }
    if (steamScoreCard) {
      steamScoreCard.style.boxShadow = '';
      steamScoreCard.style.transform = 'scale(1)';
    }
  }

  if (steamBtn && friedBtn) {
    steamBtn.addEventListener('click', setSteamedActive);
    friedBtn.addEventListener('click', setFriedActive);
  }

  // B. Vote Counters
  const voteSteamBtn = document.getElementById('voteSteamBtn');
  const voteFriedBtn = document.getElementById('voteFriedBtn');
  const steamCountEl = document.getElementById('steamVoteCount');
  const friedCountEl = document.getElementById('friedVoteCount');

  if (voteSteamBtn && steamCountEl) {
    voteSteamBtn.addEventListener('click', () => {
      let current = parseInt(steamCountEl.getAttribute('data-count') || '14290', 10);
      current += 1;
      steamCountEl.setAttribute('data-count', current);
      steamCountEl.textContent = current.toLocaleString();
      voteSteamBtn.innerHTML = '❤️ Voted Steamed!';
      voteSteamBtn.disabled = true;
    });
  }

  if (voteFriedBtn && friedCountEl) {
    voteFriedBtn.addEventListener('click', () => {
      let current = parseInt(friedCountEl.getAttribute('data-count') || '16840', 10);
      current += 1;
      friedCountEl.setAttribute('data-count', current);
      friedCountEl.textContent = current.toLocaleString();
      voteFriedBtn.innerHTML = '🔥 Voted Fried!';
      voteFriedBtn.disabled = true;
    });
  }

  // C. Momo Craving Roulette
  const spinRouletteBtn = document.getElementById('spinRouletteBtn');
  const rouletteResultBox = document.getElementById('rouletteResultBox');

  const momoPicks = [
    { name: "Classic Chicken Steamed Momo", style: "Steamed Pure", dip: "Ghost Pepper Chutney", desc: "Juicy chicken with ginger and scalding hot clear broth.", price: "₹120" },
    { name: "Kurkure Crunch Paneer Momo", style: "Fried Crunch", dip: "Sweet Garlic Sesame", desc: "Super crunchy cornflake crust with melting paneer core.", price: "₹150" },
    { name: "Pan-Fried Chicken Kothey", style: "Half-Seared", dip: "Smoked Chilli Crisp", desc: "Crispy dark seared underside and translucent top.", price: "₹150" },
    { name: "Corn & Cheese Steamed Momo", style: "Steamed Pure", dip: "Green Herb Broth", desc: "Gooey mozzarella with sweet corn pearls.", price: "₹130" },
    { name: "Schezwan Glazed Tossed Momo", style: "Wok-Fried Tossed", dip: "Extra Schezwan Sauce", desc: "Blistered dumplings wok-flamed in sticky Sichuan glaze.", price: "₹165" },
    { name: "Prawn & Asian Chive Steamed Momo", style: "Steamed Pure", dip: "Sweet Garlic Sesame", desc: "Tender coastal prawns with pungent aromatic chives.", price: "₹180" }
  ];

  if (spinRouletteBtn && rouletteResultBox) {
    spinRouletteBtn.addEventListener('click', () => {
      spinRouletteBtn.disabled = true;
      spinRouletteBtn.innerHTML = 'Spinning the Wok... 🥟🔄';

      let count = 0;
      const interval = setInterval(() => {
        const randomPick = momoPicks[Math.floor(Math.random() * momoPicks.length)];
        rouletteResultBox.innerHTML = `
          <h4 style="font-size: 1.25rem; color: var(--color-chilli-accent);">${randomPick.name}</h4>
          <p class="small text-muted mb-0">${randomPick.style} &bull; ${randomPick.price}</p>
        `;
        count++;
        if (count > 8) {
          clearInterval(interval);
          const finalPick = momoPicks[Math.floor(Math.random() * momoPicks.length)];
          rouletteResultBox.innerHTML = `
            <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🎉🥟</div>
            <span class="badge" style="background-color: var(--color-accent-soft); color: var(--color-chilli-accent); font-size: 0.85rem; padding: 0.35rem 0.8rem; border-radius: var(--radius-full); margin-bottom: 0.5rem; display: inline-block;">Your Craving Match</span>
            <h3 style="font-size: 1.4rem; color: var(--color-primary-dark); margin: 0.5rem 0 0.25rem 0;">${finalPick.name}</h3>
            <p style="color: var(--color-text-muted); font-size: 0.92rem; margin-bottom: 0.75rem;">${finalPick.desc}</p>
            <div style="font-size: 0.88rem; color: var(--color-primary-dark); font-weight: 700; margin-bottom: 1rem;">
              Recommended Dip: <span style="color: var(--color-chilli-accent);">${finalPick.dip}</span> &bull; ${finalPick.price}
            </div>
            <button type="button" class="btn-chopsticks btn-primary-chilli btn-sm-chop" onclick="quickEnquireItem('${finalPick.name}')">
              Quick Takeaway This! &rarr;
            </button>
          `;
          spinRouletteBtn.disabled = false;
          spinRouletteBtn.innerHTML = 'Spin Again 🎲';
        }
      }, 100);
    });
  }
}

/* --------------------------------------------------------------------------
   12. Cart & Checkout System
   -------------------------------------------------------------------------- */
const CART_STORAGE_KEY = 'chopsticks_cart';
let appliedPromo = null;

function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('Failed to save cart', e);
  }
  updateCartBadges();
}

function updateCartBadges() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const badges = document.querySelectorAll('.cart-badge-count');
  badges.forEach(b => {
    b.textContent = totalCount;
    b.classList.add('bump');
    setTimeout(() => b.classList.remove('bump'), 300);
  });
}

function showCartToast(itemName) {
  let toast = document.getElementById('globalCartToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalCartToast';
    toast.className = 'cart-toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div style="font-size: 1.5rem;">🥟</div>
    <div style="flex: 1;">
      <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 2px;">Added to Street Bag!</div>
      <div style="font-size: 0.85rem; color: #E6DFD6;">${itemName}</div>
    </div>
    <a href="cart.html" class="cart-toast-btn">View Cart &rarr;</a>
  `;

  toast.classList.add('show');
  if (window.cartToastTimeout) clearTimeout(window.cartToastTimeout);
  window.cartToastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

window.addToCart = function(name, price, portion, img, diet) {
  let cart = getCart();
  const numPrice = parseInt(price, 10) || 120;
  const itemPortion = portion || 'Standard';
  const itemImg = img || 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=500&q=80';
  const itemDiet = diet || 'veg';

  const existingIndex = cart.findIndex(i => i.name === name && i.portion === itemPortion);
  if (existingIndex > -1) {
    cart[existingIndex].qty += 1;
  } else {
    cart.push({
      id: 'dish_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      name: name,
      price: numPrice,
      portion: itemPortion,
      img: itemImg,
      diet: itemDiet,
      qty: 1
    });
  }

  saveCart(cart);
  showCartToast(name);

  // If currently on cart page, re-render
  if (document.getElementById('cartItemsContainer')) {
    renderCartPage();
  }
};

function initCartSystem() {
  updateCartBadges();

  // Click delegation for all Add-to-Cart buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-btn');
    if (btn) {
      e.preventDefault();
      const name = btn.dataset.name || 'Delicious Momo';
      const price = btn.dataset.price || '120';
      const portion = btn.dataset.portion || '6 pcs';
      const img = btn.dataset.img || '';
      const diet = btn.dataset.diet || 'veg';
      window.addToCart(name, price, portion, img, diet);
    }
  });

  // If on Cart Page
  if (document.getElementById('cartItemsContainer')) {
    initCartPageEvents();
    renderCartPage();
  }

  // If on Checkout Page
  if (document.getElementById('checkoutItemsSummary')) {
    initCheckoutPageEvents();
    renderCheckoutPage();
  }
}

/* Cart Page Logic */
function renderCartPage() {
  const cart = getCart();
  const emptyState = document.getElementById('cartEmptyState');
  const filledState = document.getElementById('cartFilledState');
  const itemsContainer = document.getElementById('cartItemsContainer');

  if (!itemsContainer) return;

  if (cart.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    if (filledState) filledState.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (filledState) filledState.style.display = 'grid';

  // Render items
  itemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item-row" data-id="${item.id}">
      <img src="${item.img}" alt="${item.name}" class="cart-item-thumb">
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.name}</h4>
        <div class="cart-item-meta">
          <span class="diet-badge ${item.diet}" title="${item.diet}"></span>
          <span>${item.portion}</span>
          <span>&bull;</span>
          <span>₹${item.price} each</span>
        </div>
      </div>
      <div class="cart-qty-ctrl">
        <button type="button" class="cart-qty-btn btn-qty-minus" data-id="${item.id}" aria-label="Decrease quantity">&minus;</button>
        <span class="cart-qty-val">${item.qty}</span>
        <button type="button" class="cart-qty-btn btn-qty-plus" data-id="${item.id}" aria-label="Increase quantity">&plus;</button>
      </div>
      <div class="cart-item-price-wrap">
        <div class="cart-item-subtotal">₹${item.price * item.qty}</div>
        <button type="button" class="cart-item-remove-btn" data-id="${item.id}" title="Remove item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    </div>
  `).join('');

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const packaging = subtotal >= 350 ? 0 : 15;
  let discount = 0;

  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discount = Math.round((subtotal * appliedPromo.value) / 100);
    } else if (appliedPromo.type === 'flat') {
      discount = appliedPromo.value;
    }
  }

  const grandTotal = Math.max(0, subtotal + packaging - discount);

  // Update summary elements
  const subtotalEl = document.getElementById('cartSubtotal');
  const packagingEl = document.getElementById('cartPackaging');
  const discountRow = document.getElementById('cartDiscountRow');
  const discountEl = document.getElementById('cartDiscount');
  const grandTotalEl = document.getElementById('cartGrandTotal');

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
  if (packagingEl) {
    packagingEl.textContent = packaging === 0 ? 'FREE' : `₹${packaging}`;
    packagingEl.style.color = packaging === 0 ? '#4CAF50' : 'inherit';
  }

  if (discountRow && discountEl) {
    if (discount > 0) {
      discountRow.style.display = 'flex';
      discountEl.textContent = `-₹${discount}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  if (grandTotalEl) grandTotalEl.textContent = `₹${grandTotal}`;
}

function initCartPageEvents() {
  const container = document.getElementById('cartItemsContainer');
  if (container) {
    container.addEventListener('click', (e) => {
      const minusBtn = e.target.closest('.btn-qty-minus');
      const plusBtn = e.target.closest('.btn-qty-plus');
      const removeBtn = e.target.closest('.cart-item-remove-btn');

      let cart = getCart();

      if (minusBtn) {
        const id = minusBtn.dataset.id;
        const item = cart.find(i => i.id === id);
        if (item) {
          item.qty -= 1;
          if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
          }
          saveCart(cart);
          renderCartPage();
        }
      } else if (plusBtn) {
        const id = plusBtn.dataset.id;
        const item = cart.find(i => i.id === id);
        if (item) {
          item.qty += 1;
          saveCart(cart);
          renderCartPage();
        }
      } else if (removeBtn) {
        const id = removeBtn.dataset.id;
        cart = cart.filter(i => i.id !== id);
        saveCart(cart);
        renderCartPage();
      }
    });
  }

  // Clear Cart Button
  const clearBtn = document.getElementById('clearCartBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your cart?')) {
        saveCart([]);
        appliedPromo = null;
        renderCartPage();
      }
    });
  }

  // Promo Code Form
  const promoForm = document.getElementById('cartPromoForm');
  const promoInput = document.getElementById('cartPromoInput');
  const promoMsg = document.getElementById('cartPromoMsg');

  if (promoForm && promoInput) {
    promoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = promoInput.value.trim().toUpperCase();
      if (code === 'STREET10') {
        appliedPromo = { code: 'STREET10', type: 'percent', value: 10 };
        if (promoMsg) {
          promoMsg.style.color = '#4CAF50';
          promoMsg.textContent = 'Coupon applied: 10% Street Discount!';
        }
        renderCartPage();
      } else if (code === 'MOMO50') {
        const subtotal = getCart().reduce((sum, item) => sum + (item.price * item.qty), 0);
        if (subtotal >= 200) {
          appliedPromo = { code: 'MOMO50', type: 'flat', value: 50 };
          if (promoMsg) {
            promoMsg.style.color = '#4CAF50';
            promoMsg.textContent = 'Coupon applied: ₹50 Momo Treat Discount!';
          }
          renderCartPage();
        } else {
          if (promoMsg) {
            promoMsg.style.color = '#EC5B38';
            promoMsg.textContent = 'Code MOMO50 requires min order of ₹200.';
          }
        }
      } else {
        if (promoMsg) {
          promoMsg.style.color = '#EC5B38';
          promoMsg.textContent = 'Invalid promo code. Try STREET10 or MOMO50!';
        }
      }
    });
  }
}

/* Checkout Page Logic */
function renderCheckoutPage() {
  const cart = getCart();
  const summaryBox = document.getElementById('checkoutItemsSummary');
  const grandTotalEl = document.getElementById('checkoutGrandTotal');
  const subtotalEl = document.getElementById('checkoutSubtotal');
  const packagingEl = document.getElementById('checkoutPackaging');
  const discountRow = document.getElementById('checkoutDiscountRow');
  const discountEl = document.getElementById('checkoutDiscount');

  if (!summaryBox) return;

  if (cart.length === 0) {
    summaryBox.innerHTML = `
      <div class="text-center py-4">
        <p class="text-muted">Your cart is empty. Please add items from our menu first!</p>
        <a href="menu.html" class="btn-chopsticks btn-primary-chilli btn-sm-chop">Browse Menu</a>
      </div>
    `;
    const submitBtn = document.getElementById('placeOrderBtn');
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  summaryBox.innerHTML = cart.map(item => `
    <div class="order-receipt-item">
      <div>
        <strong>${item.name}</strong> <span class="text-muted">× ${item.qty}</span>
        <div class="small text-muted">${item.portion}</div>
      </div>
      <div style="font-weight: 700;">₹${item.price * item.qty}</div>
    </div>
  `).join('');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const packaging = subtotal >= 350 ? 0 : 15;
  let discount = 0;

  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discount = Math.round((subtotal * appliedPromo.value) / 100);
    } else if (appliedPromo.type === 'flat') {
      discount = appliedPromo.value;
    }
  }

  const grandTotal = Math.max(0, subtotal + packaging - discount);

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
  if (packagingEl) packagingEl.textContent = packaging === 0 ? 'FREE' : `₹${packaging}`;
  if (discountRow && discountEl) {
    if (discount > 0) {
      discountRow.style.display = 'flex';
      discountEl.textContent = `-₹${discount}`;
    } else {
      discountRow.style.display = 'none';
    }
  }
  if (grandTotalEl) grandTotalEl.textContent = `₹${grandTotal}`;
}

function initCheckoutPageEvents() {
  const form = document.getElementById('checkoutOrderForm');
  const modal = document.getElementById('checkoutSuccessModal');
  const modalCloseBtn = document.getElementById('checkoutModalCloseBtn');

  if (!form) return;

  const orderNameInput = document.getElementById('orderCustName');
  const orderPhoneInput = document.getElementById('orderCustPhone');
  const orderNameErr = document.getElementById('orderCustNameError');
  const orderPhoneErr = document.getElementById('orderCustPhoneError');

  // Real-time letters-only validation
  if (orderNameInput) {
    orderNameInput.addEventListener('input', (e) => {
      const sanitized = e.target.value.replace(/[0-9]/g, '');
      if (sanitized !== e.target.value) {
        e.target.value = sanitized;
        if (orderNameErr) orderNameErr.style.display = 'block';
      } else if (orderNameErr) {
        orderNameErr.style.display = 'none';
      }
    });
  }

  // Real-time numbers-only validation (10 digits)
  if (orderPhoneInput) {
    orderPhoneInput.addEventListener('input', (e) => {
      const sanitized = e.target.value.replace(/\D/g, '').slice(0, 10);
      if (sanitized !== e.target.value) {
        e.target.value = sanitized;
        if (orderPhoneErr) orderPhoneErr.style.display = 'block';
      } else if (orderPhoneErr) {
        orderPhoneErr.style.display = 'none';
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = orderNameInput?.value.trim() || '';
    const phone = orderPhoneInput?.value.trim() || '';

    // Validate characters-only for name
    const nameRegex = /^[A-Za-z\s.'-]+$/;
    if (!name || !nameRegex.test(name)) {
      if (orderNameErr) {
        orderNameErr.textContent = 'Please enter letters and characters only (no numbers allowed).';
        orderNameErr.style.display = 'block';
      }
      orderNameInput?.focus();
      return;
    } else if (orderNameErr) {
      orderNameErr.style.display = 'none';
    }

    // Validate digits-only for phone (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
      if (orderPhoneErr) {
        orderPhoneErr.textContent = 'Please enter exactly 10 digits (numbers only).';
        orderPhoneErr.style.display = 'block';
      }
      orderPhoneInput?.focus();
      return;
    } else if (orderPhoneErr) {
      orderPhoneErr.style.display = 'none';
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const cart = getCart();
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const pickupType = document.querySelector('input[name="pickupType"]:checked')?.value || 'Takeaway Pickup';
    const pickupTime = document.getElementById('orderPickupTime').value || 'In 15 Minutes';
    const notes = document.getElementById('orderNotes')?.value.trim() || 'No special notes';
    const payment = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'Pay at Stall Counter (UPI / Cash)';

    const tokenNumber = 'CHP-' + Math.floor(1000 + Math.random() * 9000);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const packaging = subtotal >= 350 ? 0 : 15;
    let discount = 0;
    if (appliedPromo) {
      if (appliedPromo.type === 'percent') discount = Math.round((subtotal * appliedPromo.value) / 100);
      else if (appliedPromo.type === 'flat') discount = appliedPromo.value;
    }
    const total = Math.max(0, subtotal + packaging - discount);

    const itemsSummaryText = cart.map(i => `${i.name} (${i.portion}) x${i.qty} - ₹${i.price * i.qty}`).join('\n');

    const modalSummary = document.getElementById('checkoutModalSummary');
    if (modalSummary) {
      modalSummary.innerHTML = `
        <div style="background: rgba(236,91,56,0.1); border: 2px dashed #EC5B38; border-radius: 12px; padding: 1.25rem; text-align: center; margin: 1.25rem 0;">
          <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-stone-muted); font-weight: 700;">Counter Pickup Token</div>
          <div style="font-size: 2.2rem; font-weight: 800; color: var(--color-chilli-accent); font-family: var(--font-heading);">${tokenNumber}</div>
          <div style="font-size: 0.9rem; color: var(--color-primary-dark); font-weight: 600;">Show this number at Stall Kiosk #14</div>
        </div>

        <div style="text-align: left; font-size: 0.9rem; margin-bottom: 1.25rem; border-bottom: 1px solid var(--color-border-light); padding-bottom: 1rem;">
          <p style="margin-bottom: 0.35rem;"><strong>Customer:</strong> ${name} (${phone})</p>
          <p style="margin-bottom: 0.35rem;"><strong>Order Type:</strong> ${pickupType}</p>
          <p style="margin-bottom: 0.35rem;"><strong>Ready By:</strong> ${pickupTime}</p>
          <p style="margin-bottom: 0.35rem;"><strong>Payment:</strong> ${payment}</p>
          <p style="margin-bottom: 0.35rem;"><strong>Dishes:</strong><br>${cart.map(i => `&bull; ${i.name} (${i.portion}) × ${i.qty}`).join('<br>')}</p>
          <p style="margin-bottom: 0; font-size: 1.1rem; font-weight: 800; color: var(--color-chilli-accent); margin-top: 0.5rem;">Total Payable: ₹${total}</p>
        </div>

        <div class="d-flex flex-column gap-2">
          <a href="https://wa.me/919876543210?text=${encodeURIComponent('Hi Chopsticks, here is my takeaway order ' + tokenNumber + ':\n' + itemsSummaryText + '\nTotal: ₹' + total + '\nName: ' + name + '\nTime: ' + pickupTime)}" target="_blank" rel="noopener" class="btn-chopsticks btn-primary-chilli w-100">
            Send Slip to Stall on WhatsApp 📲
          </a>
          <button type="button" class="btn-chopsticks btn-outline-dark w-100" id="finishOrderBtn">
            Done &amp; Return to Home
          </button>
        </div>
      `;

      const finishBtn = document.getElementById('finishOrderBtn');
      if (finishBtn) {
        finishBtn.addEventListener('click', () => {
          modal.classList.remove('open');
          window.location.href = 'index.html';
        });
      }
    }

    if (modal) {
      modal.classList.add('open');
    }

    // Clear cart
    saveCart([]);
    appliedPromo = null;
    form.reset();
  });

  if (modalCloseBtn && modal) {
    modalCloseBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }
}

// --------------------------------------------------------------------------
// 15. Home Page Momo Collection Interactive Filter
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const homeFilterPills = document.querySelectorAll('#homeMomoFilterPills .filter-pill-btn');
  const homeDishCols = document.querySelectorAll('.home-dish-col');

  if (homeFilterPills.length > 0 && homeDishCols.length > 0) {
    homeFilterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        homeFilterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const targetCat = pill.getAttribute('data-home-cat') || 'all';

        homeDishCols.forEach(col => {
          const dishCat = col.getAttribute('data-cat');
          if (targetCat === 'all' || dishCat === targetCat) {
            col.style.display = 'block';
            col.style.opacity = '0';
            setTimeout(() => {
              col.style.opacity = '1';
              col.style.transition = 'opacity 0.25s ease';
            }, 30);
          } else {
            col.style.display = 'none';
          }
        });
      });
    });
  }
});


// --------------------------------------------------------------------------
// 16. Blog Page Category Interactive Filter
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const blogFilterPills = document.querySelectorAll('[data-blog-filter]');
  const blogPostWrappers = document.querySelectorAll('.blog-post-wrapper');

  if (blogFilterPills.length > 0 && blogPostWrappers.length > 0) {
    blogFilterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        blogFilterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const targetCat = pill.getAttribute('data-blog-filter') || 'all';

        blogPostWrappers.forEach(post => {
          const postCat = post.getAttribute('data-blog-cat') || '';
          if (targetCat === 'all' || postCat.includes(targetCat)) {
            post.style.display = '';
            post.style.opacity = '0';
            setTimeout(() => {
              post.style.opacity = '1';
              post.style.transition = 'opacity 0.25s ease';
            }, 30);
          } else {
            post.style.display = 'none';
          }
        });
      });
    });
  }
});
