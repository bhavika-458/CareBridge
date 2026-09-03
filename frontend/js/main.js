/**
 * CareBridge Application Scripts
 * Simple, accessible daily-care assistant for caregivers and non-medical staff.
 * "Normal should be simple. Problems should reveal detail."
 */

// =============================================================================
// Application State (Ready for Spring Boot API integration)
// =============================================================================
const CareBridgeState = {
  currentView: 'landing',
  
  patient: {
    id: 'SC1024',
    name: 'Eleanor Miller',
    room: '204',
    avatar: 'EM',
    age: 78,
    condition: 'Mild Memory Loss (Stage 4)'
  },

  todayCare: {
    status: 'normal', // 'normal' or 'concern-reported'
    mood: 'Good',
    meals: 'Normal',
    hydration: 'Good',
    nextAppointment: '18 September'
  },

  medicines: [
    {
      id: 'morning',
      name: 'Memantine (Namenda) 10mg',
      time: '8:00 AM',
      instruction: 'Taken with breakfast',
      done: true
    },
    {
      id: 'afternoon',
      name: 'Blood Pressure (Lisinopril) 20mg',
      time: '12:30 PM',
      instruction: 'Taken with water',
      done: true
    },
    {
      id: 'evening',
      name: 'Donepezil (Aricept) 10mg',
      time: '8:00 PM',
      instruction: 'Take with light evening snack',
      done: false
    }
  ],

  concerns: [
    {
      id: 'c1',
      types: ['Change in mood'],
      note: 'Eleanor was slightly quiet before dusk. Warm lighting and soothing music helped her relax within 10 minutes.',
      timestamp: 'Yesterday • 4:45 PM',
      status: 'Reviewed by Staff'
    }
  ]
};

// =============================================================================
// Initialization
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initPatientLookup();
  initMedicineToggles();
  initConcernReporting();
  initResourceGuides();
  initHeaderEffects();
  renderConcernsList();
  updateMedicineSummaryUI();
});

// =============================================================================
// Navigation & View Controller
// =============================================================================
function initNavigation() {
  // Brand link -> Landing Home
  const brandLink = document.getElementById('nav-brand-link');
  if (brandLink) {
    brandLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('landing');
    });
  }

  // Landing CTAs -> Patient Lookup
  const getStartedBtns = [
    document.getElementById('header-get-started-btn'),
    document.getElementById('hero-get-started-btn'),
    document.getElementById('features-get-started-btn'),
    document.getElementById('nav-login-btn'),
    document.getElementById('footer-link-lookup')
  ];

  getStartedBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', () => switchView('lookup'));
    }
  });

  // Demo Eleanor Shortcuts -> Direct Dashboard
  const demoShortcuts = [
    document.getElementById('hero-demo-btn'),
    document.getElementById('preview-open-dash-btn'),
    document.getElementById('footer-link-demo')
  ];

  demoShortcuts.forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', () => {
        loadDemoPatient();
        switchView('dashboard');
      });
    }
  });

  // App Nav Tabs (Dashboard, Today's Care, Concerns, Appointments)
  const appTabs = document.querySelectorAll('.app-nav-tab[data-tab]');
  appTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const tabTarget = tab.getAttribute('data-tab');
      if (tabTarget === 'today-care') {
        switchView('dashboard');
      } else {
        switchView(tabTarget);
      }
    });
  });

  // More Dropdown Trigger
  const moreTrigger = document.getElementById('more-menu-trigger');
  const moreMenu = document.getElementById('more-dropdown-menu');

  if (moreTrigger && moreMenu) {
    moreTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = moreTrigger.getAttribute('aria-expanded') === 'true';
      moreTrigger.setAttribute('aria-expanded', String(!isExpanded));
      moreMenu.classList.toggle('show');
    });

    // Dropdown Items
    const dropdownItems = moreMenu.querySelectorAll('.dropdown-item');
    dropdownItems.forEach((item) => {
      item.addEventListener('click', () => {
        const targetView = item.getAttribute('data-tab');
        moreMenu.classList.remove('show');
        moreTrigger.setAttribute('aria-expanded', 'false');
        switchView(targetView);
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!moreTrigger.contains(e.target) && !moreMenu.contains(e.target)) {
        moreMenu.classList.remove('show');
        moreTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Switch Patient & Exit App Buttons
  const btnSwitchPatient = document.getElementById('btn-switch-patient');
  const btnChangePatientDash = document.getElementById('btn-change-patient-dash');
  const btnExitApp = document.getElementById('btn-exit-app');
  const btnLookupBackHome = document.getElementById('btn-lookup-back-home');

  if (btnSwitchPatient) btnSwitchPatient.addEventListener('click', () => switchView('lookup'));
  if (btnChangePatientDash) btnChangePatientDash.addEventListener('click', () => switchView('lookup'));
  if (btnExitApp) btnExitApp.addEventListener('click', () => switchView('landing'));
  if (btnLookupBackHome) btnLookupBackHome.addEventListener('click', () => switchView('landing'));
}

/**
 * Switches the active screen view and synchronizes top navigation headers.
 */
function switchView(viewName) {
  CareBridgeState.currentView = viewName;

  // 1. Hide all page views
  const allViews = document.querySelectorAll('.page-view');
  allViews.forEach((view) => {
    view.style.display = 'none';
    view.classList.remove('active');
  });

  // Map view name to element ID
  let targetElementId = 'view-landing';
  if (viewName === 'lookup') targetElementId = 'view-lookup';
  else if (viewName === 'dashboard' || viewName === 'today-care') targetElementId = 'view-dashboard';
  else if (viewName === 'concerns') targetElementId = 'view-concerns';
  else if (viewName === 'appointments') targetElementId = 'view-appointments';
  else if (viewName === 'documents') targetElementId = 'view-documents';
  else if (viewName === 'history') targetElementId = 'view-history';
  else if (viewName === 'resources') targetElementId = 'view-resources';
  else if (viewName === 'profile' || viewName === 'settings') targetElementId = 'view-settings';

  const targetViewElem = document.getElementById(targetElementId);
  if (targetViewElem) {
    targetViewElem.style.display = 'block';
    targetViewElem.classList.add('active');
  }

  // 2. Adjust Header context (Landing vs App Nav)
  const isInsideApp = viewName !== 'landing' && viewName !== 'lookup';
  const landingNav = document.getElementById('landing-nav');
  const appNav = document.getElementById('app-nav');
  const landingCtaWrap = document.getElementById('landing-cta-wrap');
  const activePatientBadge = document.getElementById('active-patient-badge');
  const btnExitApp = document.getElementById('btn-exit-app');

  if (isInsideApp) {
    if (landingNav) landingNav.style.display = 'none';
    if (appNav) appNav.style.display = 'block';
    if (landingCtaWrap) landingCtaWrap.style.display = 'none';
    if (activePatientBadge) activePatientBadge.style.display = 'flex';
    if (btnExitApp) btnExitApp.style.display = 'inline-flex';

    // Update active tab highlight
    const appTabs = document.querySelectorAll('.app-nav-tab');
    appTabs.forEach((tab) => {
      const tabTarget = tab.getAttribute('data-tab');
      if (tabTarget === viewName || (viewName === 'dashboard' && tabTarget === 'dashboard')) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  } else {
    if (landingNav) landingNav.style.display = 'block';
    if (appNav) appNav.style.display = 'none';
    if (landingCtaWrap) landingCtaWrap.style.display = 'block';
    if (activePatientBadge) activePatientBadge.style.display = 'none';
    if (btnExitApp) btnExitApp.style.display = 'none';
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =============================================================================
// Patient Lookup & Demo Setup
// =============================================================================
function initPatientLookup() {
  const form = document.getElementById('patient-lookup-form');
  const demoCard = document.getElementById('demo-patient-card');

  if (demoCard) {
    demoCard.addEventListener('click', () => {
      loadDemoPatient();
      switchView('dashboard');
    });

    demoCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        loadDemoPatient();
        switchView('dashboard');
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const patientId = document.getElementById('lookup-patient-id').value.trim() || 'SC1024';
      const patientName = document.getElementById('lookup-name').value.trim() || 'Eleanor Miller';
      const patientRoom = document.getElementById('lookup-room').value.trim() || '204';

      CareBridgeState.patient = {
        id: patientId,
        name: patientName,
        room: patientRoom,
        avatar: getInitials(patientName)
      };

      updatePatientDisplay();
      switchView('dashboard');
    });
  }
}

function loadDemoPatient() {
  CareBridgeState.patient = {
    id: 'SC1024',
    name: 'Eleanor Miller',
    room: '204',
    avatar: 'EM'
  };
  updatePatientDisplay();
}

function getInitials(name) {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function updatePatientDisplay() {
  const { name, room, id, avatar } = CareBridgeState.patient;

  // Header patient badge
  const navName = document.getElementById('nav-patient-name');
  const navRoom = document.getElementById('nav-patient-room');
  const navInitials = document.getElementById('nav-patient-initials');

  if (navName) navName.textContent = name;
  if (navRoom) navRoom.textContent = `Room ${room} • ${id}`;
  if (navInitials) navInitials.textContent = avatar;

  // Dashboard greeting
  const dashName = document.getElementById('dash-patient-name');
  const dashMeta = document.getElementById('dash-patient-meta');

  if (dashName) dashName.textContent = name;
  if (dashMeta) dashMeta.textContent = `Room ${room} • ${id}`;
}

// =============================================================================
// Today's Medicines Tracker
// =============================================================================
function initMedicineToggles() {
  const toggleBtn = document.getElementById('btn-toggle-evening-med');
  const eveningItem = document.getElementById('med-item-evening');
  const eveningBadge = document.getElementById('evening-badge');

  if (!toggleBtn || !eveningItem || !eveningBadge) return;

  toggleBtn.addEventListener('click', () => {
    const eveningMed = CareBridgeState.medicines.find(m => m.id === 'evening');
    if (!eveningMed) return;

    eveningMed.done = !eveningMed.done;

    const checkIcon = toggleBtn.querySelector('.check-icon');
    const dueCircle = toggleBtn.querySelector('.due-circle');

    if (eveningMed.done) {
      eveningItem.classList.add('completed');
      toggleBtn.classList.add('completed');
      if (checkIcon) checkIcon.style.display = 'inline-block';
      if (dueCircle) dueCircle.style.display = 'none';

      eveningBadge.className = 'badge badge-mint';
      eveningBadge.textContent = '✓ Done at ' + getCurrentTimeString();
    } else {
      eveningItem.classList.remove('completed');
      toggleBtn.classList.remove('completed');
      if (checkIcon) checkIcon.style.display = 'none';
      if (dueCircle) dueCircle.style.display = 'inline-block';

      eveningBadge.className = 'badge badge-amber';
      eveningBadge.textContent = '○ Due at 8:00 PM';
    }

    updateMedicineSummaryUI();
  });
}

function updateMedicineSummaryUI() {
  const total = CareBridgeState.medicines.length;
  const completed = CareBridgeState.medicines.filter(m => m.done).length;

  const countBadge = document.getElementById('med-count-badge');
  const countText = document.getElementById('med-count-text');
  const dueSub = document.getElementById('med-next-due-sub');

  if (completed === total) {
    if (countBadge) {
      countBadge.className = 'badge badge-mint';
      countBadge.textContent = `${completed} / ${total} complete`;
    }
    if (countText) countText.textContent = `${completed} / ${total} complete`;
    if (dueSub) dueSub.textContent = 'All scheduled doses completed for today';
  } else {
    if (countBadge) {
      countBadge.className = 'badge badge-amber';
      countBadge.textContent = `${completed} of ${total} complete`;
    }
    if (countText) countText.textContent = `${completed} / ${total} complete`;
    if (dueSub) dueSub.textContent = 'Next due: Donepezil at 8:00 PM';
  }
}

function getCurrentTimeString() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

// =============================================================================
// Concern Reporting & Escalation Flow
// =============================================================================
function initConcernReporting() {
  const modal = document.getElementById('concern-modal');
  const openBtn = document.getElementById('btn-open-concern-modal');
  const openTabBtn = document.getElementById('btn-new-concern-tab');
  const closeBtn = document.getElementById('btn-close-concern-modal');
  const cancelBtn = document.getElementById('btn-cancel-concern');
  const form = document.getElementById('concern-report-form');
  const toast = document.getElementById('concern-toast');
  const toastClose = document.getElementById('btn-close-toast');

  const openModal = () => {
    if (modal) {
      modal.style.display = 'flex';
      // Reset form
      if (form) form.reset();
    }
  };

  const closeModal = () => {
    if (modal) modal.style.display = 'none';
  };

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (openTabBtn) openTabBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  // Close modal when clicking outside card
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Toast close button
  if (toastClose && toast) {
    toastClose.addEventListener('click', () => {
      toast.style.display = 'none';
    });
  }

  // Form Submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const checkedOptions = Array.from(form.querySelectorAll('input[name="concernType"]:checked'))
        .map(input => input.value);

      if (checkedOptions.length === 0) {
        checkedOptions.push('General observation');
      }

      const noteText = document.getElementById('concern-note-input').value.trim();

      const newConcern = {
        id: 'c' + Date.now(),
        types: checkedOptions,
        note: noteText || 'Caregiver noted observation for care team review.',
        timestamp: 'Today • ' + getCurrentTimeString(),
        status: 'Under Staff Review'
      };

      CareBridgeState.concerns.unshift(newConcern);

      closeModal();
      renderConcernsList();
      showConcernToast();
      updateDashboardStatusWithConcern(checkedOptions[0]);
    });
  }
}

function showConcernToast() {
  const toast = document.getElementById('concern-toast');
  if (!toast) return;

  toast.style.display = 'flex';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 6000);
}

function renderConcernsList() {
  const container = document.getElementById('concerns-log-container');
  const badgeCounter = document.getElementById('concerns-nav-badge');

  if (badgeCounter) {
    if (CareBridgeState.concerns.length > 0) {
      badgeCounter.style.display = 'inline-block';
      badgeCounter.textContent = CareBridgeState.concerns.length;
    } else {
      badgeCounter.style.display = 'none';
    }
  }

  if (!container) return;

  if (CareBridgeState.concerns.length === 0) {
    container.innerHTML = `
      <div style="background-color: var(--color-card-white); padding: 32px; text-align: center; border-radius: var(--radius-lg); border: 1px solid var(--color-border-warm);">
        <p style="font-size: 1.1rem; color: var(--color-text-navy);">No active concerns logged.</p>
        <p style="font-size: 0.9rem; color: var(--color-text-navy-muted); margin-top: 4px;">Everything is running normally.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = CareBridgeState.concerns.map(concern => `
    <div class="concern-item-card">
      <div class="concern-item-header">
        <div class="concern-types-chips">
          ${concern.types.map(t => `<span class="concern-chip">${escapeHtml(t)}</span>`).join('')}
        </div>
        <span class="concern-time">${escapeHtml(concern.timestamp)}</span>
      </div>
      <div class="concern-note-text">${escapeHtml(concern.note)}</div>
      <div class="concern-footer-row">
        <span>Logged for Eleanor Miller (Room 204)</span>
        <span class="badge badge-amber">${escapeHtml(concern.status)}</span>
      </div>
    </div>
  `).join('');
}

function updateDashboardStatusWithConcern(primaryConcern) {
  const statusHeadline = document.getElementById('status-main-headline');
  const statusSubline = document.getElementById('status-main-subline');
  const statusCard = document.getElementById('dash-status-card');

  if (statusHeadline && statusSubline && statusCard) {
    statusHeadline.textContent = `Observation noted: ${primaryConcern}`;
    statusSubline.textContent = 'Concern recorded and queued for care staff review. Routine monitoring active.';
    statusCard.className = 'daily-status-hero-card';
    statusCard.style.borderColor = 'var(--color-warm-amber)';
    statusCard.style.backgroundColor = 'var(--color-amber-light)';
    
    const iconCircle = document.getElementById('status-icon-symbol');
    if (iconCircle) {
      iconCircle.style.backgroundColor = 'var(--color-warm-amber)';
      iconCircle.textContent = '!';
    }
  }
}

// =============================================================================
// Educational Guides & Resource Previews
// =============================================================================
const ResourceGuides = {
  routine: {
    title: "Dementia Daily Routine & Calming Cues",
    content: `
      <h3 style="color: var(--color-primary-teal); margin-bottom: 12px;">Daily Routine Best Practices</h3>
      <p style="margin-bottom: 14px;">Maintaining a calm, consistent daily rhythm provides a sense of security for adults experiencing memory challenges.</p>
      <ul style="list-style: disc; margin-left: 20px; display: flex; flex-direction: column; gap: 8px; font-size: 0.95rem; color: var(--color-text-navy);">
        <li><strong>Morning Sunlight:</strong> Open window curtains upon waking to reinforce natural circadian rhythm.</li>
        <li><strong>Step-by-step Dressing:</strong> Lay out clothes in the order they will be put on to avoid decision overwhelm.</li>
        <li><strong>Consistent Meal Times:</strong> Serve breakfast, lunch, and dinner around identical times daily.</li>
        <li><strong>Tactile Comfort:</strong> Keep familiar photo albums or a soft blanket nearby during quiet hours.</li>
      </ul>
    `
  },
  sundowning: {
    title: "Understanding Sundowning & Dusk Agitation",
    content: `
      <h3 style="color: var(--color-warm-amber); margin-bottom: 12px;">Managing Late-Afternoon Changes</h3>
      <p style="margin-bottom: 14px;">Sundowning refers to feelings of restlessness or confusion that often begin in late afternoon as natural light fades.</p>
      <ul style="list-style: disc; margin-left: 20px; display: flex; flex-direction: column; gap: 8px; font-size: 0.95rem; color: var(--color-text-navy);">
        <li><strong>Turn on warm indoor lighting at 4:30 PM:</strong> Eliminate shadows before dusk settles outside.</li>
        <li><strong>Minimize ambient noise:</strong> Lower TV volume, close noisy appliances, and play gentle acoustic music.</li>
        <li><strong>Offer a soothing warm beverage:</strong> Chamomile tea or warm milk can create a comforting transition.</li>
        <li><strong>Reassure with short, calm words:</strong> "You are safe here at home, and I am right by your side."</li>
      </ul>
    `
  },
  respite: {
    title: "Family Caregiver Respite & Self-Care",
    content: `
      <h3 style="color: var(--color-accent-coral); margin-bottom: 12px;">Protecting Your Own Well-being</h3>
      <p style="margin-bottom: 14px;">Caring for a loved one is a marathon. Taking mindful breaks is essential to providing compassionate care.</p>
      <ul style="list-style: disc; margin-left: 20px; display: flex; flex-direction: column; gap: 8px; font-size: 0.95rem; color: var(--color-text-navy);">
        <li><strong>Share Specific Tasks:</strong> Ask family members for exact help (e.g., "Can you cover Friday 2 PM - 5 PM?").</li>
        <li><strong>Micro-Breaks Matter:</strong> Even a 10-minute walk outside or quiet breathing resets your nervous system.</li>
        <li><strong>Connect with Support Groups:</strong> You don't have to carry the emotional journey in isolation.</li>
      </ul>
    `
  },
  'doctor-prep': {
    title: "Doctor Visit Preparation Checklist",
    content: `
      <h3 style="color: var(--color-primary-teal); margin-bottom: 12px;">Getting the Most from Neurologist Appointments</h3>
      <p style="margin-bottom: 14px;">Doctor appointments are short. Being organized beforehand ensures critical questions get answered.</p>
      <ul style="list-style: disc; margin-left: 20px; display: flex; flex-direction: column; gap: 8px; font-size: 0.95rem; color: var(--color-text-navy);">
        <li><strong>Bring Printed Medication List:</strong> Include dosages and times taken.</li>
        <li><strong>Note Behavioral Observations:</strong> Share any specific times of agitation or sleep disruptions.</li>
        <li><strong>Ask About Side Effects:</strong> Review appetite, dizziness, or medication adjustments.</li>
      </ul>
    `
  }
};

function initResourceGuides() {
  const modal = document.getElementById('resource-modal');
  const closeBtn = document.getElementById('btn-close-resource-modal');
  const closeActionBtn = document.getElementById('btn-close-resource-action');
  const contentContainer = document.getElementById('resource-modal-content');
  const modalTitle = document.getElementById('modal-resource-title');
  const guideBtns = document.querySelectorAll('.btn-view-resource');

  const closeModal = () => {
    if (modal) modal.style.display = 'none';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeActionBtn) closeActionBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  guideBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const guideKey = btn.getAttribute('data-guide');
      const guide = ResourceGuides[guideKey];
      if (guide && modal && contentContainer && modalTitle) {
        modalTitle.textContent = guide.title;
        contentContainer.innerHTML = guide.content;
        modal.style.display = 'flex';
      }
    });
  });
}

// =============================================================================
// Header & Visual Helpers
// =============================================================================
function initHeaderEffects() {
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 15) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // Mobile menu drawer toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const primaryNavMenu = document.getElementById('primary-nav-menu');

  if (mobileToggle && primaryNavMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = primaryNavMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
