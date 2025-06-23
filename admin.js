// Admin Panel JavaScript

// Admin credentials (in real app, this would be server-side)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
}

// Admin state
let isAdminLoggedIn = false
let currentSection = "suggestions"

// Initialize admin panel
document.addEventListener("DOMContentLoaded", () => {
  initializeAdmin()
})

function initializeAdmin() {
  setupAdminEventListeners()
  checkAdminLogin()
  loadAdminData()
}

function setupAdminEventListeners() {
  // Login form
  const loginForm = document.getElementById("adminLoginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", handleAdminLogin)
  }

  // Navigation buttons
  document.querySelectorAll(".admin-nav-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const section = e.target.closest(".admin-nav-btn").dataset.section
      switchAdminSection(section)
    })
  })

  // Edit form
  const editForm = document.getElementById("editNameForm")
  if (editForm) {
    editForm.addEventListener("submit", handleEditSubmit)
  }
}

function handleAdminLogin(e) {
  e.preventDefault()

  const username = document.getElementById("adminUsername").value
  const password = document.getElementById("adminPassword").value
  const errorEl = document.getElementById("adminLoginError")

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    isAdminLoggedIn = true
    localStorage.setItem("adminLoggedIn", "true")
    showAdminPanel()
    errorEl.style.display = "none"
  } else {
    errorEl.style.display = "block"
    setTimeout(() => {
      errorEl.style.display = "none"
    }, 3000)
  }
}

function checkAdminLogin() {
  const savedLogin = localStorage.getItem("adminLoggedIn")
  if (savedLogin === "true") {
    isAdminLoggedIn = true
    showAdminPanel()
  }
}

function showAdminPanel() {
  document.getElementById("adminLoginModal").style.display = "none"
  document.getElementById("adminPanel").style.display = "block"
  loadAdminData()
}

function adminLogout() {
  isAdminLoggedIn = false
  localStorage.removeItem("adminLoggedIn")
  document.getElementById("adminLoginModal").style.display = "flex"
  document.getElementById("adminPanel").style.display = "none"
}

function switchAdminSection(section) {
  currentSection = section

  // Update navigation
  document.querySelectorAll(".admin-nav-btn").forEach((btn) => {
    btn.classList.remove("active")
  })
  document.querySelector(`[data-section="${section}"]`).classList.add("active")

  // Update content
  document.querySelectorAll(".admin-section").forEach((sec) => {
    sec.classList.remove("active")
  })
  document.getElementById(section).classList.add("active")

  // Load section data
  loadSectionData(section)
}

function loadAdminData() {
  loadSectionData(currentSection)
  updateStatistics()
}

function loadSectionData(section) {
  switch (section) {
    case "suggestions":
      loadSuggestions()
      break
    case "approved":
      loadApprovedNames()
      break
    case "rejected":
      loadRejectedNames()
      break
    case "statistics":
      updateStatistics()
      break
  }
}

// Confirmation modal functions
function showConfirmationModal(message, onConfirm) {
  const modal = document.getElementById("confirmationModal")
  const messageEl = document.getElementById("confirmationMessage")
  const confirmBtn = document.getElementById("confirmButton")

  messageEl.textContent = message
  modal.classList.add("show")
  document.body.style.overflow = "hidden"

  // Remove previous event listeners
  const newConfirmBtn = confirmBtn.cloneNode(true)
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn)

  // Add new event listener
  newConfirmBtn.addEventListener("click", () => {
    onConfirm()
    closeConfirmationModal()
  })
}

function closeConfirmationModal() {
  const modal = document.getElementById("confirmationModal")
  modal.classList.remove("show")
  document.body.style.overflow = "auto"
}

// Updated reject function - hətta təsdiqlənmiş adları da rədd edə bilsin
function rejectSuggestion(id) {
  const suggestion = getSuggestedNames().find((s) => s.id === id)
  if (!suggestion) return

  showConfirmationModal(`"${suggestion.name}" adını rədd etmək istədiyinizə əminsiniz?`, () => {
    // Əgər ad əvvəlcədən təsdiqlənmişsə, onu ana səhifədən də sil
    if (suggestion.status === "approved") {
      removeFromMainNames(suggestion.id)
    }

    // Remove from suggestions completely
    removeSuggestion(id)
    showAdminToast("Ad rədd edildi və siyahıdan silindi")
    loadSuggestions()
    updateStatistics()
  })
}

// Updated approve function to add to main site
function approveSuggestion(id) {
  const suggestion = getSuggestedNames().find((s) => s.id === id)
  if (!suggestion) return

  showConfirmationModal(`"${suggestion.name}" adını təsdiqləmək və sayta əlavə etmək istədiyinizə əminsiniz?`, () => {
    // Update status first
    updateSuggestionStatus(id, "approved")

    // Add to main names data
    addToMainNames(suggestion)

    showAdminToast(`"${suggestion.name}" adı təsdiqləndi və sayta əlavə edildi`)

    // Refresh views
    loadSuggestions()
    updateStatistics()

    // Log for debugging
    console.log("Ad təsdiqləndi:", suggestion.name)
    console.log("Cari main names:", JSON.parse(localStorage.getItem("mainNamesData") || "[]"))
  })
}

// Remove suggestion completely
function removeSuggestion(id) {
  const suggestions = getSuggestedNames()
  const filteredSuggestions = suggestions.filter((s) => s.id !== id)
  saveSuggestedNames(filteredSuggestions)
}

// YENİ FUNKSIYA: Ana səhifədən adı sil
function removeFromMainNames(suggestionId) {
  const mainNames = JSON.parse(localStorage.getItem("mainNamesData") || "[]")

  // Find and remove the name that was added from this suggestion
  const updatedMainNames = mainNames.filter(
    (name) => !(name.source === "admin_approved" && name.originalSuggestionId === suggestionId),
  )

  // Save updated main names
  localStorage.setItem("mainNamesData", JSON.stringify(updatedMainNames))

  // Force trigger update
  localStorage.setItem("namesUpdated", Date.now().toString())

  // Dispatch event for immediate update
  window.dispatchEvent(
    new CustomEvent("nameRemoved", {
      detail: { suggestionId: suggestionId },
    }),
  )

  console.log("Ad ana səhifədən silindi:", suggestionId)
}

// Updated addToMainNames function - suggestion ID-ni də saxla
function addToMainNames(suggestion) {
  // Get current main names data
  const mainNames = JSON.parse(localStorage.getItem("mainNamesData") || "[]")

  // Find the highest ID to generate new unique ID
  const maxId = Math.max(...mainNames.map((n) => n.id), 1000) // Start from 1000 to avoid conflicts

  // Create new name object for main site
  const newName = {
    id: maxId + 1,
    name: suggestion.name,
    meaning: suggestion.meaning,
    gender: suggestion.gender,
    origin: suggestion.origin,
    similar: Array.isArray(suggestion.similar)
      ? suggestion.similar
      : suggestion.similar
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
    popularity: suggestion.popularity || 70,
    viewCount: 0,
    addedDate: new Date().toISOString(),
    source: "admin_approved",
    originalSuggestionId: suggestion.id, // YENİ: Orijinal suggestion ID-ni saxla
  }

  // Add to main names
  mainNames.push(newName)

  // Save updated main names
  localStorage.setItem("mainNamesData", JSON.stringify(mainNames))

  // Force trigger update
  localStorage.setItem("namesUpdated", Date.now().toString())

  // Dispatch custom event for immediate update
  window.dispatchEvent(
    new CustomEvent("namesUpdated", {
      detail: { names: mainNames, newName: newName },
    }),
  )

  // Also try to update if main window is available
  if (window.opener && !window.opener.closed) {
    window.opener.postMessage(
      {
        type: "nameAdded",
        name: newName,
      },
      "*",
    )
  }

  console.log("Added to main names:", newName)
}

// Get current main names (this would be synced with main site)
function getCurrentMainNames() {
  // This should return the current names from the main site
  // For now, we'll return an empty array and let the main site handle it
  return []
}

// Update main site names
function updateMainSiteNames(newNames) {
  // Signal to main site that names have been updated
  localStorage.setItem("namesUpdated", Date.now().toString())

  // If main site is open in another tab, it can listen for this change
  window.dispatchEvent(
    new CustomEvent("namesUpdated", {
      detail: { names: newNames },
    }),
  )
}

// Updated loadSuggestions to only show pending suggestions
function loadSuggestions() {
  const allSuggestions = getSuggestedNames()
  const pendingSuggestions = allSuggestions.filter((s) => !s.status || s.status === "pending")
  const grid = document.getElementById("suggestionsGrid")

  if (pendingSuggestions.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i class="fas fa-inbox"></i>
        <h3>Hələ təklif edilmiş ad yoxdur</h3>
        <p>İstifadəçilər ad təklif etdikdə burada görünəcək</p>
      </div>
    `
  } else {
    grid.innerHTML = pendingSuggestions.map((suggestion) => createSuggestionCard(suggestion)).join("")
  }

  // Update suggestion count
  document.getElementById("suggestionCount").textContent = pendingSuggestions.length
}

function createSuggestionCard(suggestion) {
  const genderIcon = suggestion.gender === "qız" ? "👧" : "👦"
  const statusClass = suggestion.status || "pending"
  const statusText = getStatusText(statusClass)

  return `
    <div class="suggestion-card ${statusClass}">
      <div class="suggestion-header">
        <h3 class="suggestion-name">${suggestion.name} ${genderIcon}</h3>
        <span class="suggestion-status ${statusClass}">${statusText}</span>
      </div>
      
      <div class="suggestion-details">
        <div class="suggestion-detail">
          <strong>Cinsi:</strong>
          <span>${suggestion.gender === "qız" ? "Qız" : "Oğlan"}</span>
        </div>
        <div class="suggestion-detail">
          <strong>Mənşəyi:</strong>
          <span>${suggestion.origin}</span>
        </div>
        <div class="suggestion-meaning">${suggestion.meaning}</div>
        ${
          suggestion.similar
            ? `
          <div class="suggestion-detail">
            <strong>Oxşar:</strong>
            <span>${suggestion.similar}</span>
          </div>
        `
            : ""
        }
      </div>
      
      <div class="suggestion-meta">
        <span>Təklif tarixi: ${formatDate(suggestion.submittedAt)}</span>
        <span>ID: #${suggestion.id}</span>
      </div>
      
      <div class="suggestion-actions">
        <button class="admin-btn secondary" onclick="editSuggestion(${suggestion.id})">
          <i class="fas fa-edit"></i> Düzənlə
        </button>
        <button class="admin-btn success" onclick="approveSuggestion(${suggestion.id})">
          <i class="fas fa-check"></i> Təsdiqlə
        </button>
        <button class="admin-btn danger" onclick="rejectSuggestion(${suggestion.id})">
          <i class="fas fa-times"></i> Rədd et
        </button>
      </div>
    </div>
  `
}

function getStatusText(status) {
  switch (status) {
    case "pending":
      return "Gözləyir"
    case "approved":
      return "Təsdiqləndi"
    case "rejected":
      return "Rədd edildi"
    default:
      return "Gözləyir"
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("az-AZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function editSuggestion(id) {
  const suggestion = getSuggestedNames().find((s) => s.id === id)
  if (!suggestion) return

  // Fill edit form
  document.getElementById("editNameId").value = suggestion.id
  document.getElementById("editName").value = suggestion.name
  document.getElementById("editGender").value = suggestion.gender
  document.getElementById("editMeaning").value = suggestion.meaning
  document.getElementById("editOrigin").value = suggestion.origin
  document.getElementById("editPopularity").value = suggestion.popularity || 70
  document.getElementById("editSimilar").value = suggestion.similar || ""

  // Show modal
  document.getElementById("editNameModal").classList.add("show")
  document.body.style.overflow = "hidden"
}

function closeEditModal() {
  document.getElementById("editNameModal").classList.remove("show")
  document.body.style.overflow = "auto"
}

function handleEditSubmit(e) {
  e.preventDefault()

  const id = Number.parseInt(document.getElementById("editNameId").value)
  const updatedSuggestion = {
    id: id,
    name: document.getElementById("editName").value,
    gender: document.getElementById("editGender").value,
    meaning: document.getElementById("editMeaning").value,
    origin: document.getElementById("editOrigin").value,
    popularity: Number.parseInt(document.getElementById("editPopularity").value),
    similar: document
      .getElementById("editSimilar")
      .value.split(",")
      .map((s) => s.trim())
      .filter((s) => s),
    submittedAt: new Date().toISOString(),
    status: "pending",
  }

  updateSuggestion(id, updatedSuggestion)
  closeEditModal()
  showAdminToast("Ad uğurla düzənləndi")
  loadSuggestions()
}

function loadApprovedNames() {
  const approved = getSuggestedNames().filter((s) => s.status === "approved")
  const grid = document.getElementById("approvedGrid")

  if (approved.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i class="fas fa-check-circle"></i>
        <h3>Hələ təsdiqlənmiş ad yoxdur</h3>
        <p>Təsdiqlənmiş adlar burada görünəcək</p>
      </div>
    `
  } else {
    grid.innerHTML = approved.map((suggestion) => createSuggestionCard(suggestion)).join("")
  }
}

function loadRejectedNames() {
  const rejected = getSuggestedNames().filter((s) => s.status === "rejected")
  const grid = document.getElementById("rejectedGrid")

  if (rejected.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i class="fas fa-times-circle"></i>
        <h3>Hələ rədd edilmiş ad yoxdur</h3>
        <p>Rədd edilmiş adlar burada görünəcək</p>
      </div>
    `
  } else {
    grid.innerHTML = rejected.map((suggestion) => createSuggestionCard(suggestion)).join("")
  }
}

// Updated statistics to reflect actual counts
function updateStatistics() {
  const suggestions = getSuggestedNames()
  const pending = suggestions.filter((s) => !s.status || s.status === "pending").length
  const approved = suggestions.filter((s) => s.status === "approved").length
  const totalRejected = suggestions.length - pending - approved // Rejected ones are removed, so calculate from difference

  document.getElementById("totalSuggestions").textContent = pending
  document.getElementById("totalApproved").textContent = approved
  document.getElementById("totalRejected").textContent = totalRejected
  document.getElementById("suggestionCount").textContent = pending
}

function refreshSuggestions() {
  loadSuggestions()
  showAdminToast("Məlumatlar yeniləndi")
}

function showAdminToast(message) {
  const toast = document.getElementById("adminToast")
  const messageEl = document.getElementById("adminToastMessage")

  messageEl.textContent = message
  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
  }, 3000)
}

// Data management functions
function getSuggestedNames() {
  return JSON.parse(localStorage.getItem("suggestedNames") || "[]")
}

function saveSuggestedNames(suggestions) {
  localStorage.setItem("suggestedNames", JSON.stringify(suggestions))
}

function updateSuggestion(id, updatedSuggestion) {
  const suggestions = getSuggestedNames()
  const index = suggestions.findIndex((s) => s.id === id)
  if (index !== -1) {
    suggestions[index] = updatedSuggestion
    saveSuggestedNames(suggestions)
  }
}

function updateSuggestionStatus(id, status) {
  const suggestions = getSuggestedNames()
  const suggestion = suggestions.find((s) => s.id === id)
  if (suggestion) {
    suggestion.status = status
    suggestion.reviewedAt = new Date().toISOString()
    saveSuggestedNames(suggestions)
  }
}

// Add some demo data for testing
function addDemoSuggestions() {
  const demoSuggestions = [
    {
      id: 1,
      name: "Əliyə",
      gender: "qız",
      meaning: "Uca, yüksək məqamlı",
      origin: "ərəb",
      similar: "Əli, Əliyar, Əminə",
      submittedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      status: "pending",
    },
    {
      id: 2,
      name: "Turan",
      gender: "oğlan",
      meaning: "Vətən, yurd",
      origin: "türk",
      similar: "Tural, Turxan, Turgut",
      submittedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      status: "pending",
    },
    {
      id: 3,
      name: "Səma",
      gender: "qız",
      meaning: "Göy, səma",
      origin: "ərəb",
      similar: "Səmirə, Səkinə, Səadət",
      submittedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      status: "approved",
    },
  ]

  const existing = getSuggestedNames()
  if (existing.length === 0) {
    saveSuggestedNames(demoSuggestions)
  }
}

// Initialize demo data
addDemoSuggestions()
