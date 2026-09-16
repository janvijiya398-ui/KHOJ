/* =========================
   KHOJ FRONTEND
========================= */


/* EVENTS */

let events = [

  {
    id: 1,
    title: "HackIgnite 2025",
    category: "Hackathon",
    organizer: "GDSC IGDTUW",
    date: "18 Oct 2025",
    location: "SAC, IGDTUW Campus",
    mode: "📍 Offline",
    deadline: "Registration open",
    prize: "🏆 ₹1,50,000",
    tags: ["AI/ML","Web Dev","Open Source"],
    university: true
  },

  {
    id: 2,
    title: "Anveshan'25 – Research Symposium",
    category: "Research",
    organizer: "Research Cell, IGDTUW",
    date: "5 Nov 2025",
    location: "Main Auditorium, IGDTUW",
    mode: "🔀 Hybrid",
    deadline: "Registration open",
    prize: "",
    tags: ["Research","Academic","Publication"],
    university: true
  },

  {
    id: 3,
    title: "CodeSprint – CP Contest",
    category: "Competition",
    organizer: "CodeChef Chapter, IGDTUW",
    date: "5 Oct 2025",
    location: "Online",
    mode: "💻 Online",
    deadline: "Registration open",
    prize: "🏆 Exciting Prizes",
    tags: ["DSA","Competitive Programming"],
    university: true
  },

  {
    id: 4,
    title: "Generative AI for Beginners",
    category: "Workshop",
    organizer: "AI Society, IGDTUW",
    date: "12 Oct 2025",
    location: "Seminar Hall 2, IGDTUW",
    mode: "📍 Offline",
    deadline: "Registration open",
    prize: "",
    tags: ["AI","Python","Beginner"],
    university: true
  },

  {
    id: 5,
    title: "National Innovation Challenge",
    category: "Competition",
    organizer: "Innovation Council",
    date: "20 Nov 2025",
    location: "Delhi",
    mode: "🌐 Online",
    deadline: "Registration open",
    prize: "🏆 ₹2,00,000",
    tags: ["Innovation","Technology"],
    university: false
  },

  {
    id: 6,
    title: "AI Research Seminar",
    category: "Seminar",
    organizer: "Tech Research Network",
    date: "28 Nov 2025",
    location: "Online",
    mode: "💻 Online",
    deadline: "Registration open",
    prize: "",
    tags: ["AI","Research"],
    university: false
  },

  {
    id: 7,
    title: "Campus Cultural Fest",
    category: "Fest",
    organizer: "Student Council",
    date: "10 Dec 2025",
    location: "University Grounds",
    mode: "📍 Offline",
    deadline: "Registration open",
    prize: "",
    tags: ["Culture","Music","Dance"],
    university: true
  },

  {
    id: 8,
    title: "Tech Internship Drive",
    category: "Internship",
    organizer: "Career Development Cell",
    date: "15 Dec 2025",
    location: "Placement Cell",
    mode: "📍 Offline",
    deadline: "Apply before deadline",
    prize: "",
    tags: ["Career","Internship","Jobs"],
    university: true
  }

];

/* BACKEND API */

const API_URL = "https://khoj-jii2.onrender.com";

async function loadEventsFromAPI() {
  try {
    const response = await fetch(`${API_URL}/events`);

    if (!response.ok) {
      throw new Error("Failed to load events");
    }

    const data = await response.json();

    const backendEvents = data.events || [];

    if (backendEvents.length > 0) {
      events = backendEvents.map(event => ({
        id: event.id,
        title: event.title || "Untitled Event",
        category: event.category || "Other",
        organizer: event.organizer || "Unknown Organizer",
        date: event.event_date || "Date not available",
        location: event.venue || "Online",
        mode: event.mode || "Not specified",
        deadline: event.registration_deadline || "Registration open",
        prize: event.fee ? `💰 Fee: ₹${event.fee}` : "",
        tags: event.event_type ? [event.event_type] : [],
        university: event.event_type === "University Event"
      }));

      renderEvents();
      renderUniversity();
      renderExternal();
    }

    console.log("Events loaded from backend");

  } catch (error) {
    console.log("Backend not connected. Demo events shown.");
  }
}
/* STATE */

let selectedCategory = "All";
let searchText = "";

let savedEvents =
  JSON.parse(localStorage.getItem("khojSaved") || "[]");

let soundEnabled = true;

let audioContext = null;


/* SOUND */

function sound(type = "click") {

  if (!soundEnabled) return;

  try {

    if (!audioContext) {

      audioContext =
        new (window.AudioContext ||
             window.webkitAudioContext)();

    }

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    const now = audioContext.currentTime;

    if (type === "keyboard") {

      oscillator.frequency.value = 520;

      gain.gain.setValueAtTime(.025, now);

      gain.gain.exponentialRampToValueAtTime(
        .001,
        now + .05
      );

      oscillator.start();
      oscillator.stop(now + .05);

    }

    else if (type === "success") {

      oscillator.frequency.setValueAtTime(
        550,
        now
      );

      oscillator.frequency.exponentialRampToValueAtTime(
        900,
        now + .18
      );

      gain.gain.setValueAtTime(.07, now);

      gain.gain.exponentialRampToValueAtTime(
        .001,
        now + .25
      );

      oscillator.start();
      oscillator.stop(now + .25);

    }

    else {

      oscillator.frequency.setValueAtTime(
        600,
        now
      );

      oscillator.frequency.exponentialRampToValueAtTime(
        850,
        now + .08
      );

      gain.gain.setValueAtTime(.045, now);

      gain.gain.exponentialRampToValueAtTime(
        .001,
        now + .1
      );

      oscillator.start();
      oscillator.stop(now + .1);

    }

  } catch (error) {}

}


/* BUBBLES */

function createBubbles(event) {

  for (let i = 0; i < 5; i++) {

    const bubble =
      document.createElement("div");

    bubble.className = "bubble";

    bubble.style.left =
      event.clientX + "px";

    bubble.style.top =
      event.clientY + "px";

    bubble.style.setProperty(
      "--x",
      (Math.random() * 80 - 40) + "px"
    );

    bubble.style.setProperty(
      "--y",
      (Math.random() * -90 - 20) + "px"
    );

    document.body.appendChild(bubble);

    setTimeout(
      () => bubble.remove(),
      700
    );

  }

}


/* ALL BUTTON CLICKS */

document.addEventListener("click", function(event) {

  const button =
    event.target.closest("button");

  if (button) {

    sound("click");

    createBubbles(event);

  }

});


/* KEYBOARD SOUND */

let lastKeyboardSound = 0;

document.addEventListener("keydown", function(event) {

  if (
    event.target.tagName === "INPUT" ||
    event.target.tagName === "TEXTAREA"
  ) {

    const now = Date.now();

    if (now - lastKeyboardSound > 70) {

      sound("keyboard");

      lastKeyboardSound = now;

    }

  }

});


/* LOGIN */

document
  .getElementById("loginForm")
  .addEventListener("submit", function(event) {

    event.preventDefault();

    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value.trim();

    if (!email || !password) {

      showToast("Please enter your details.");

      return;

    }

    localStorage.setItem(
      "khojLoggedIn",
      "true"
    );

    document
      .getElementById("loginPage")
      .classList.add("hidden");

    document
      .getElementById("app")
      .classList.remove("hidden");

    sound("success");

    showToast("Welcome to KHOJ ✨");

  });


/* AUTO LOGIN */

if (
  localStorage.getItem("khojLoggedIn") === "true"
) {

  document
    .getElementById("loginPage")
    .classList.add("hidden");

  document
    .getElementById("app")
    .classList.remove("hidden");

}


/* PASSWORD */

document
  .getElementById("togglePassword")
  .addEventListener("click", function() {

    const password =
      document.getElementById("password");

    if (password.type === "password") {

      password.type = "text";

      this.textContent = "🙈";

    } else {

      password.type = "password";

      this.textContent = "👁";

    }

  });


/* LOGOUT */

document
  .getElementById("logoutBtn")
  .addEventListener("click", function() {

    localStorage.removeItem("khojLoggedIn");

    document
      .getElementById("app")
      .classList.add("hidden");

    document
      .getElementById("loginPage")
      .classList.remove("hidden");

    showToast("Signed out successfully 🚪");

  });


/* PROFILE */

document
  .getElementById("profileBtn")
  .addEventListener("click", function() {

    document
      .getElementById("profileMenu")
      .classList.toggle("show");

  });


/* SOUND BUTTON */

document
  .getElementById("soundBtn")
  .addEventListener("click", function() {

    soundEnabled = !soundEnabled;

    this.textContent =
      soundEnabled ? "🔊" : "🔇";

    showToast(
      soundEnabled
        ? "Sounds enabled 🔊"
        : "Sounds muted 🔇"
    );

  });


/* EVENT CARD */

function eventCard(event) {

  const isSaved =
    savedEvents.includes(event.id);

  return `

    <article class="event-card">

      <div class="event-top">

        <span class="event-category">
          ${event.category}
        </span>

        <button
          class="save-btn ${isSaved ? "saved" : ""}"
          onclick="toggleSave(${event.id})"
        >
          ${isSaved ? "💜" : "♡"}
        </button>

      </div>

      <h3>${event.title}</h3>

      <div class="event-info">

        🏛️ ${event.organizer}<br>

        📅 ${event.date}<br>

        📍 ${event.location}<br>

        ${event.mode}<br>

        ⏰ ${event.deadline}

      </div>

      <div class="tags">

        ${event.tags
          .map(tag =>
            `<span class="tag">${tag}</span>`
          )
          .join("")}

      </div>

      ${
        event.prize
        ?
        `<div class="prize">
          ${event.prize}
        </div>`
        :
        ""
      }

      <button
        class="details-btn"
        onclick="showDetails(${event.id})"
      >
        View Details →
      </button>

    </article>

  `;

}


/* RENDER HOME */

function renderEvents() {

  const grid =
    document.getElementById("eventsGrid");

  const filtered =
    events.filter(event => {

      const categoryMatch =
        selectedCategory === "All" ||
        event.category === selectedCategory;

      const searchable =
        (
          event.title +
          event.organizer +
          event.category +
          event.tags.join(" ")
        ).toLowerCase();

      const searchMatch =
        searchable.includes(
          searchText.toLowerCase()
        );

      return categoryMatch && searchMatch;

    });


  if (!filtered.length) {

    grid.innerHTML = `

      <div class="empty">

        <div class="empty-icon">🔍</div>

        <h2>No events found</h2>

        <p>Try another category or search.</p>

      </div>

    `;

    return;

  }


  grid.innerHTML =
    filtered.map(eventCard).join("");

}


/* SAVE */

function toggleSave(id) {

  if (savedEvents.includes(id)) {

    savedEvents =
      savedEvents.filter(
        eventId => eventId !== id
      );

    showToast("Removed from saved 💫");

  } else {

    savedEvents.push(id);

    sound("success");

    showToast("Event saved 💜");

  }

  localStorage.setItem(
    "khojSaved",
    JSON.stringify(savedEvents)
  );

  renderEvents();

  renderSaved();

}


/* DETAILS */

function showDetails(id) {

  const event =
    events.find(item => item.id === id);

  if (!event) return;

  showToast(
    `${event.title} • ${event.date}`
  );

}


/* SEARCH */

document
  .getElementById("searchInput")
  .addEventListener("input", function() {

    searchText = this.value;

    renderEvents();

  });


/* CATEGORY FILTERS */

document
  .querySelectorAll(".category")
  .forEach(button => {

    button.addEventListener("click", function() {

      document
        .querySelectorAll(".category")
        .forEach(btn =>
          btn.classList.remove("active")
        );

      this.classList.add("active");

      selectedCategory =
        this.dataset.category;

      renderEvents();

    });

  });


/* NAVIGATION */

document
  .querySelectorAll(".nav-btn")
  .forEach(button => {

    button.addEventListener("click", function() {

      const page =
        this.dataset.page;

      document
        .querySelectorAll(".nav-btn")
        .forEach(btn =>
          btn.classList.remove("active")
        );

      this.classList.add("active");

      document
        .querySelectorAll(".page")
        .forEach(section =>
          section.classList.remove("active-page")
        );

      const target =
        document.getElementById(page);

      if (target) {

        target.classList.add("active-page");

      }

      if (page === "saved") {
        renderSaved();
      }

      if (page === "university") {
        renderUniversity();
      }

      if (page === "external") {
        renderExternal();
      }

      window.scrollTo(0,0);

    });

  });


/* SAVED */

function renderSaved() {

  const grid =
    document.getElementById("savedGrid");

  const list =
    events.filter(event =>
      savedEvents.includes(event.id)
    );


  if (!list.length) {

    grid.innerHTML = `

      <div class="empty">

        <div class="empty-icon">💜</div>

        <h2>No saved events yet</h2>

        <p>
          Tap ♡ on an event to save it.
        </p>

      </div>

    `;

    return;

  }


  grid.innerHTML =
    list.map(eventCard).join("");

}


/* UNIVERSITY */

function renderUniversity() {

  document
    .getElementById("universityGrid")
    .innerHTML =
      events
        .filter(event => event.university)
        .map(eventCard)
        .join("");

}


/* EXTERNAL */

function renderExternal() {

  document
    .getElementById("externalGrid")
    .innerHTML =
      events
        .filter(event => !event.university)
        .map(eventCard)
        .join("");

}


/* SUBMIT */

document
  .getElementById("submitEvent")
  .addEventListener("click", async function() {

    const title =
      document.getElementById("eventTitle").value.trim();

    const organizer =
      document.getElementById("eventOrganizer").value.trim();

    const eventDate =
      document.getElementById("eventDate").value;

    const location =
      document.getElementById("eventLocation").value.trim();

    const category =
      document.getElementById("eventCategory").value;

    const description =
      document.getElementById("eventDescription").value.trim();

    if (!title || !organizer || !eventDate || !location || !description) {
      showToast("Please fill all event details.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/add-event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title,
          organizer: organizer,
          event_date: eventDate,
          venue: location,
          category: category,
          description: description,
          event_type: "University Event",
          mode: "Offline",
          status: "pending"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      sound("success");

      showToast("Event submitted for approval 🚀");

      document.getElementById("eventTitle").value = "";
      document.getElementById("eventOrganizer").value = "";
      document.getElementById("eventDate").value = "";
      document.getElementById("eventLocation").value = "";
      document.getElementById("eventDescription").value = "";

    } catch (error) {
      console.error("Submit Error:", error);
      showToast("Could not submit event.");
    }

  });


/* TOAST */

let toastTimeout;

function showToast(message) {

  const toast =
    document.getElementById("toast");

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout =
    setTimeout(() => {

      toast.classList.remove("show");

    }, 2200);

}


/* INITIAL LOAD */

renderEvents();
loadEventsFromAPI();
/* ADMIN DASHBOARD */

async function loadPendingEvents() {

  const adminEvents =
    document.getElementById("adminEvents");

  if (!adminEvents) return;

  adminEvents.innerHTML =
    "<p>Loading pending events...</p>";

  try {

    const response =
      await fetch(`${API_URL}/pending-events`);

    const data =
      await response.json();

    const pendingEvents =
      data.pending_events || [];

    if (!pendingEvents.length) {

      adminEvents.innerHTML = `
        <div class="admin-box">
          <span>✅</span>
          <div>
            <b>No pending events</b>
            <p>All submitted events have been reviewed.</p>
          </div>
        </div>
      `;

      return;
    }

    adminEvents.innerHTML =
      pendingEvents.map(event => `

        <div class="admin-box">

          <div>
            <h3>${event.title}</h3>

            <p>
              🏛️ ${event.organizer}<br>
              📅 ${event.event_date || "Date not available"}<br>
              📍 ${event.venue || "Online"}<br>
              🛠️ ${event.category || "Other"}
            </p>

            <p>${event.description || ""}</p>

            <button
              onclick="approveEvent(${event.id})">
              🟢 Approve
            </button>

            <button
              onclick="rejectEvent(${event.id})">
              🔴 Reject
            </button>
          </div>

        </div>

      `).join("");

  } catch (error) {

    console.error("Admin Error:", error);

    adminEvents.innerHTML =
      "<p>Could not load pending events.</p>";

  }

}


/* APPROVE EVENT */

async function approveEvent(id) {

  try {

    const response =
      await fetch(`${API_URL}/approve-event/${id}`, {
        method: "PATCH"
      });

    if (!response.ok) {
      throw new Error("Approval failed");
    }

    showToast("Event approved successfully ✅");

    await loadPendingEvents();
    await loadEventsFromAPI();

  } catch (error) {

    console.error(error);

    showToast("Could not approve event.");

  }

}


/* REJECT EVENT */

async function rejectEvent(id) {

  try {

    const response =
      await fetch(`${API_URL}/reject-event/${id}`, {
        method: "PATCH"
      });

    if (!response.ok) {
      throw new Error("Rejection failed");
    }

    showToast("Event rejected ❌");

    await loadPendingEvents();

  } catch (error) {

    console.error(error);

    showToast("Could not reject event.");

  }

}


/* LOAD ADMIN WHEN ADMIN PAGE OPENS */

document
  .querySelectorAll(".nav-btn")
  .forEach(button => {

    button.addEventListener("click", function() {

      if (this.dataset.page === "admin") {
        loadPendingEvents();
      }

    });

  });