// Global Variables
let namesData = []
let currentLanguage = localStorage.getItem("language") || "az"
let currentTheme = localStorage.getItem("theme") || "light"
const favorites = JSON.parse(localStorage.getItem("favorites")) || []
const viewCounts = JSON.parse(localStorage.getItem("viewCounts")) || {}
const chartInstances = {}

// Translations
const translations = {
  az: {
    "site-title": "Azərbaycan Adları",
    "site-subtitle": "Mənalar və Mənşələr",
    "hero-title": "Azərbaycan adlarının gözəl dünyasını kəşf edin",
    "hero-description": "Minlərlə ad, onların mənaları və mənşələri haqqında ətraflı məlumat",
    "stat-names": "Adlar",
    "stat-origins": "Mənşə",
    "stat-views": "Baxış",
    "daily-name-title": "Günün Adı",
    "search-placeholder": "Ad axtar...",
    "filter-all": "Hamısı",
    "filter-girl": "Qız",
    "filter-boy": "Oğlan",
    "origin-all": "Bütün mənşələr",
    "tab-home": "Ana Səhifə",
    "tab-alphabet": "Əlifba",
    "tab-popular": "Populyar",
    "tab-favorites": "Favoritlər",
    "tab-suggest": "Tövsiyə",
    "tab-quiz": "Test",
    "tab-add": "Əlavə Et",
    "celebrity-title": "Bu gün ad günü olan məşhurlar",
    "facts-title": "Ad haqqında bilmədiklərin",
    "names-title": "Bütün Adlar",
    "sort-name": "Ada görə",
    "sort-popularity": "Populyarlığa görə",
    "sort-views": "Baxışa görə",
    "load-more": "Daha çox göstər",
    "popular-title": "Ən Çox Baxılan Adlar",
    "favorites-title": "Favori Adlarım",
    "clear-favorites": "Hamısını sil",
    "empty-favorites-title": "Hələ favori adınız yoxdur",
    "empty-favorites-text": "Bəyəndiyiniz adları ❤️ düyməsinə basaraq əlavə edin",
    "suggest-title": "Mənə Ad Tövsiyə Et",
    "quiz-title": "Ad Testi",
    "add-title": "Yeni Ad Təklif Et",
    "form-name": "Ad:",
    "form-meaning": "Mənası:",
    "form-gender": "Cinsi:",
    "form-origin": "Mənşəyi:",
    "form-similar": "Oxşar adlar (vergüllə ayırın):",
    "form-select": "Seçin",
    "form-girl": "Qız",
    "form-boy": "Oğlan",
    "form-submit": "Göndər",
    "success-title": "Uğurlu!",
    "success-message": "Əməliyyat uğurla tamamlandı",
    "similar-names": "Oxşar adlar:",
    meaning: "Mənası:",
    origin: "Mənşəyi:",
    popularity: "Populyarlıq:",
    views: "baxış",
    pronunciation: "Tələffüz",
    listen: "Dinlə",
    history: "Tarix",
    regions: "Bölgələr",
    "popularity-chart": "Populyarlıq Qrafiki",
    "region-map": "Bölgə Xəritəsi",
  },
  en: {
    "site-title": "Azerbaijani Names",
    "site-subtitle": "Meanings and Origins",
    "hero-title": "Discover the beautiful world of Azerbaijani names",
    "hero-description": "Thousands of names with detailed information about their meanings and origins",
    "stat-names": "Names",
    "stat-origins": "Origins",
    "stat-views": "Views",
    "daily-name-title": "Name of the Day",
    "search-placeholder": "Search names...",
    "filter-all": "All",
    "filter-girl": "Girl",
    "filter-boy": "Boy",
    "origin-all": "All origins",
    "tab-home": "Home",
    "tab-alphabet": "Alphabet",
    "tab-popular": "Popular",
    "tab-favorites": "Favorites",
    "tab-suggest": "Suggest",
    "tab-quiz": "Quiz",
    "tab-add": "Add Name",
    "celebrity-title": "Celebrity birthdays today",
    "facts-title": "Fun facts about names",
    "names-title": "All Names",
    "sort-name": "By name",
    "sort-popularity": "By popularity",
    "sort-views": "By views",
    "load-more": "Load more",
    "popular-title": "Most Viewed Names",
    "favorites-title": "My Favorite Names",
    "clear-favorites": "Clear all",
    "empty-favorites-title": "You don't have any favorite names yet",
    "empty-favorites-text": "Add names you like by clicking the ❤️ button",
    "suggest-title": "Suggest a Name for Me",
    "quiz-title": "Name Quiz",
    "add-title": "Suggest New Name",
    "form-name": "Name:",
    "form-meaning": "Meaning:",
    "form-gender": "Gender:",
    "form-origin": "Origin:",
    "form-similar": "Similar names (comma separated):",
    "form-select": "Select",
    "form-girl": "Girl",
    "form-boy": "Boy",
    "form-submit": "Submit",
    "success-title": "Success!",
    "success-message": "Operation completed successfully",
    "similar-names": "Similar names:",
    meaning: "Meaning:",
    origin: "Origin:",
    popularity: "Popularity:",
    views: "views",
    pronunciation: "Pronunciation",
    listen: "Listen",
    history: "History",
    regions: "Regions",
    "popularity-chart": "Popularity Chart",
    "region-map": "Region Map",
  },
}

// Show loading screen
function showLoadingScreen() {
  console.log("Loading screen göstərilir")
  const loadingScreen = document.getElementById("loadingScreen")
  if (loadingScreen) {
    loadingScreen.classList.remove("hidden")
  }
}

function hideLoadingScreen() {
  console.log("Loading screen gizlədilir")
  const loadingScreen = document.getElementById("loadingScreen")
  if (loadingScreen) {
    loadingScreen.classList.add("hidden")
    setTimeout(() => {
      loadingScreen.style.display = "none"
    }, 500)
  }
}

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM yükləndi, app başladılır")
  initializeApp()
})

// Listen for names updates from admin panel
window.addEventListener("namesUpdated", (event) => {
  console.log("Names updated from admin panel")
  loadUpdatedNames()
})

// Listen for name removal from admin panel
window.addEventListener("nameRemoved", (event) => {
  console.log("Name removed from admin panel")
  const suggestionId = event.detail.suggestionId

  // Remove from main names array
  const mainNames = JSON.parse(localStorage.getItem("mainNamesData") || "[]")
  const removedName = mainNames.find(
    (name) => name.source === "admin_approved" && name.originalSuggestionId === suggestionId,
  )

  if (removedName) {
    // Remove from namesData array
    namesData = namesData.filter((name) => name.id !== removedName.id)

    // Refresh current view
    const currentTab = document.querySelector(".tab-pane.active")?.id || "home"
    if (currentTab === "home") {
      displayNames(namesData)
    } else if (currentTab === "alphabet") {
      const activeAlphabetBtn = document.querySelector(".alphabet-btn.active")
      if (activeAlphabetBtn) {
        filterByLetter(activeAlphabetBtn.textContent)
      }
    } else if (currentTab === "popular") {
      displayPopularNames()
    } else if (currentTab === "favorites") {
      displayFavorites()
    }

    // Update search results if there's an active search
    const searchInput = document.getElementById("searchInput")
    if (searchInput && searchInput.value.trim()) {
      handleSearch()
    }

    showToast(`"${removedName.name}" adı saytdan silindi`, "info")
  }
})

// Check for names updates on page load
window.addEventListener("storage", (e) => {
  if (e.key === "namesUpdated") {
    loadUpdatedNames()
  }
})

// loadUpdatedNames funksiyasını düzəlt
function loadUpdatedNames() {
  const updatedNames = JSON.parse(localStorage.getItem("mainNamesData") || "[]")

  if (updatedNames.length > 0) {
    // Merge with existing names, avoiding duplicates
    const existingIds = namesData.map((n) => n.id)
    const newNames = updatedNames.filter((n) => !existingIds.includes(n.id))

    if (newNames.length > 0) {
      // Add new names to the main array
      namesData.push(...newNames)
      console.log(`${newNames.length} yeni ad əlavə edildi`)

      // Force refresh the current view
      const currentTab = document.querySelector(".tab-pane.active")?.id || "home"

      if (currentTab === "home") {
        displayNames(namesData)
      } else if (currentTab === "alphabet") {
        // Refresh alphabet view if active
        const activeAlphabetBtn = document.querySelector(".alphabet-btn.active")
        if (activeAlphabetBtn) {
          filterByLetter(activeAlphabetBtn.textContent)
        }
      } else if (currentTab === "popular") {
        displayPopularNames()
      }

      // Update search results if there's an active search
      const searchInput = document.getElementById("searchInput")
      if (searchInput && searchInput.value.trim()) {
        handleSearch()
      }

      // Show notification
      showToast(`${newNames.length} yeni ad sayta əlavə edildi!`, "success")
    }
  }
}

// Baxış sayını hesabla və yenilə
function calculateTotalViews() {
  return Object.values(viewCounts).reduce((total, count) => total + count, 0)
}

// Stats yeniləmə sistemi
let statsUpdateTimer = 300 // 5 dəqiqə = 300 saniyə
let statsInterval

function startStatsTimer() {
  const timerElement = document.querySelector(".stats-timer")

  if (!timerElement) {
    // Timer elementini yarat
    const totalViewsEl = document.getElementById("totalViews")
    if (totalViewsEl && totalViewsEl.parentNode) {
      const timerHTML = `
        <div class="stats-timer">
          <i class="fas fa-clock timer-icon"></i>
          <span id="timerText">5:00</span>
        </div>
        <div class="stats-update-info">5 dəqiqədə bir yenilənir</div>
      `
      totalViewsEl.parentNode.insertAdjacentHTML("afterend", timerHTML)
    }
  }

  // Timer başlat
  statsInterval = setInterval(() => {
    statsUpdateTimer--

    const minutes = Math.floor(statsUpdateTimer / 60)
    const seconds = statsUpdateTimer % 60
    const timerText = document.getElementById("timerText")

    if (timerText) {
      timerText.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`
    }

    if (statsUpdateTimer <= 0) {
      // Stats yenilə
      updateTotalViews()
      statsUpdateTimer = 300 // Reset timer
    }
  }, 1000)
}

function updateTotalViews() {
  const totalViews = calculateTotalViews()
  const totalViewsEl = document.getElementById("totalViews")
  if (totalViewsEl) {
    totalViewsEl.textContent = totalViews
  }
}

// Initialize App funksiyasında da düzəliş et
function initializeApp() {
  console.log("App başladılır...")

  try {
    // Load names from JSON file
    loadNamesFromJSON().then(() => {
      // Load any approved names from admin AFTER JSON loads
      loadUpdatedNames()

      // Apply saved theme and language
      applyTheme()
      applyLanguage()

      // Initialize components
      setupEventListeners()
      displayDailyName()
      displayCelebrityBirthdays({})
      displayRandomFact([])

      // URL parametrini yoxla
      checkURLParameter()

      // DÜZƏLDILDI: Avtomatik olaraq bütün adları göstər
      setTimeout(() => {
        console.log("Adlar göstərilir, toplam:", namesData.length)
        displayNames(namesData)
        // "Hamısı" düyməsini aktiv et
        const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]')
        if (allFilterBtn) {
          allFilterBtn.classList.add("active")
        }
      }, 500)

      setupAlphabetNavigation()
      displayPopularNames()
      updateFavoritesCount()
      updateTotalNamesCount()

      // Stats sistemini başlat
      updateTotalViews()
      startStatsTimer()

      console.log("App uğurla başladıldı, toplam ad sayı:", namesData.length)

      // Hide loading screen
      setTimeout(() => {
        hideLoadingScreen()
      }, 1000)
    })
  } catch (error) {
    console.error("App başlatma xətası:", error)
    hideLoadingScreen()
  }
}

// Load names from JSON file
async function loadNamesFromJSON() {
  try {
    console.log("JSON yüklənir...")
    const response = await fetch("names.json")
    const data = await response.json()
    namesData = data.names || []
    console.log("JSON-dan yüklənən adlar:", namesData.length)
    return namesData
  } catch (error) {
    console.error("JSON yükləmə xətası:", error)
    // Fallback to test data if JSON fails
    showTestData()
    return namesData
  }
}

// Test məlumatları - fallback üçün
function showTestData() {
  console.log("Test məlumatları yüklənir...")

  namesData = [
{
  "names": [
    {
      "id": 1,
      "name": "Aysel",
      "name_en": "Aysel",
      "meaning": "Ay işığı; Ay nuru; Gecənin gözəlliyi",
      "meaning_en": "Moonlight; Moon glow; Beauty of the night",
      "gender": "qız",
      "origin": "türk",
      "similar": ["Ayla", "Ayşən", "Aynur"],
      "popularity": 85,
      "viewCount": 0
    },
    {
      "id": 2,
      "name": "Elvin",
      "name_en": "Elvin",
      "meaning": "Elin dostları; Xalqın dostu; Cəsur",
      "meaning_en": "Friends of the people; Brave",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Elçin", "Elşən", "Elnur"],
      "popularity": 78,
      "viewCount": 0
    },
    {
      "id": 3,
      "name": "Leyla",
      "name_en": "Leyla",
      "meaning": "Gecə; Qaranlıq gözəllik; Sirli",
      "meaning_en": "Night; Dark beauty; Mysterious",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Ləman", "Lalə", "Lətifə"],
      "popularity": 92,
      "viewCount": 0
    },
    {
      "id": 4,
      "name": "Rəşad",
      "name_en": "Rashad",
      "meaning": "Doğru yol; Hidayət; Ağıllı",
      "meaning_en": "Right path; Guidance; Wise",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Rəsul", "Rəhim", "Rəfiq"],
      "popularity": 65,
      "viewCount": 0
    },
    {
      "id": 5,
      "name": "Gülnar",
      "name_en": "Gulnar",
      "meaning": "Nar çiçəyi; Qırmızı gül; Gözəl",
      "meaning_en": "Pomegranate flower; Red rose; Beautiful",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Gülşən", "Gülər", "Gülnaz"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 6,
      "name": "Tural",
      "name_en": "Tural",
      "meaning": "Canlı; Həyat dolu; Güclü",
      "meaning_en": "Alive; Full of life; Strong",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Turan", "Turgut", "Turxan"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 7,
      "name": "Səbinə",
      "name_en": "Sabina",
      "meaning": "Səhər küləyi; Təmiz; Saf",
      "meaning_en": "Morning breeze; Pure; Clean",
      "gender": "qız",
      "origin": "azərbaycan",
      "similar": ["Səidə", "Səkinə", "Səmirə"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 8,
      "name": "Orxan",
      "name_en": "Orkhan",
      "meaning": "Böyük xan; Hökmdar; Lider",
      "meaning_en": "Great khan; Ruler; Leader",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Oqtay", "Oruc", "Osman"],
      "popularity": 80,
      "viewCount": 0
    },
    {
      "id": 9,
      "name": "Nigar",
      "name_en": "Nigar",
      "meaning": "Sevimli; Gözəl; Bəzək",
      "meaning_en": "Beloved; Beautiful; Ornament",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Nərgiz", "Nəzrin", "Nərmin"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 10,
      "name": "Kərim",
      "name_en": "Karim",
      "meaning": "Səxavətli; Mərhəmətli; Cömərd",
      "meaning_en": "Generous; Merciful; Charitable",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Kamil", "Kamal", "Kənan"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 11,
      "name": "Ayla",
      "name_en": "Ayla",
      "meaning": "Ay hələsi; Ay işığı; Parlaq",
      "meaning_en": "Moon sister; Moonlight; Bright",
      "gender": "qız",
      "origin": "türk",
      "similar": ["Aysel", "Aynur", "Ayşən"],
      "popularity": 88,
      "viewCount": 0
    },
    {
      "id": 12,
      "name": "Elnur",
      "name_en": "Elnur",
      "meaning": "Xalqın nuru; İşıqlı; Parlaq",
      "meaning_en": "Light of the people; Bright; Shining",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Elvin", "Elçin", "Elşən"],
      "popularity": 82,
      "viewCount": 0
    },
    {
      "id": 13,
      "name": "Ləman",
      "name_en": "Leman",
      "meaning": "Parlaqlıq; İşıq; Zərif",
      "meaning_en": "Brightness; Light; Graceful",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Leyla", "Lalə", "Lətifə"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 14,
      "name": "Vüsal",
      "name_en": "Vusal",
      "meaning": "Qovuşma; Birləşmə; Çatma",
      "meaning_en": "Union; Merging; Reaching",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Vəli", "Vaqif", "Vasif"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 15,
      "name": "Röya",
      "name_en": "Roya",
      "meaning": "Yuxu; Arzu; Xəyal",
      "meaning_en": "Dream; Wish; Fantasy",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Reyhan", "Rəna", "Rəvanə"],
      "popularity": 90,
      "viewCount": 0
    },
    {
      "id": 16,
      "name": "Samir",
      "name_en": "Samir",
      "meaning": "Söhbət yoldaşı; Danışan; Dost",
      "meaning_en": "Companion in conversation; Speaker; Friend",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Səmər", "Sənan", "Səbuhi"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 17,
      "name": "Ülviyyə",
      "name_en": "Ulviye",
      "meaning": "Uca; Yüksək; Dəyərli",
      "meaning_en": "Noble; High; Valuable",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Ülkər", "Ümidə", "Ürfanə"],
      "popularity": 67,
      "viewCount": 0
    },
    {
      "id": 18,
      "name": "Ülvi",
      "name_en": "Ulvi",
      "meaning": "Uca; Yüksək məqamlı; Əzəmətli",
      "meaning_en": "Sublime; High-ranking; Majestic",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ülkər", "Ümid", "Ürfan"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 19,
      "name": "Arzu",
      "name_en": "Arzu",
      "meaning": "İstək; Arzu; Mehribanlik",
      "meaning_en": "Desire; Wish; Kindness",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Arzum", "Arifa", "Aida"],
      "popularity": 85,
      "viewCount": 0
    },
    {
      "id": 20,
      "name": "Cavid",
      "name_en": "Javid",
      "meaning": "Əbədi; Sonsuz; Daimi",
      "meaning_en": "Eternal; Infinite; Permanent",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Cavad", "Cahid", "Camal"],
      "popularity": 79,
      "viewCount": 0
    },
    {
      "id": 21,
      "name": "Dilara",
      "name_en": "Dilara",
      "meaning": "Ürəyin sevincidir; Sevgili; Gözəl",
      "meaning_en": "Joy of the heart; Beloved; Beautiful",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Dilbər", "Dilan", "Dilarə"],
      "popularity": 88,
      "viewCount": 0
    },
    {
      "id": 22,
      "name": "Emil",
      "name_en": "Emil",
      "meaning": "Çalışqan; Səbatkar; Qüvvətli",
      "meaning_en": "Diligent; Persistent; Strong",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Emin", "Əmir", "Eldar"],
      "popularity": 83,
      "viewCount": 0
    },
    {
      "id": 23,
      "name": "Fidan",
      "name_en": "Fidan",
      "meaning": "Gənc ağac; Körpə; Yeni",
      "meaning_en": "Young tree; Sapling; New",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Firəngiz", "Feridə", "Fəridə"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 24,
      "name": "Günel",
      "name_en": "Gunel",
      "meaning": "Günəş kimi parlaq; İşıqlı; Gözəl",
      "meaning_en": "Bright as the sun; Luminous; Beautiful",
      "gender": "qız",
      "origin": "azərbaycan",
      "similar": ["Günay", "Gülər", "Gülnaz"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 25,
      "name": "Həsən",
      "name_en": "Hasan",
      "meaning": "Gözəl; Yaxşı; Məhsul",
      "meaning_en": "Beautiful; Good; Productive",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Hüseyn", "Həmid", "Həkim"],
      "popularity": 81,
      "viewCount": 0
    },
    {
      "id": 26,
      "name": "İlahə",
      "name_en": "Ilaha",
      "meaning": "Tanrıça; Müqəddəs; Gözəl",
      "meaning_en": "Goddess; Sacred; Beautiful",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["İlhamə", "İradə", "İsmət"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 27,
      "name": "Kəmalə",
      "name_en": "Kemal",
      "meaning": "Kamil; Mükəmməl; Tam",
      "meaning_en": "Perfect; Complete; Whole",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Kamil", "Kənan", "Kərim"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 28,
      "name": "Ləti",
      "name_en": "Lati",
      "meaning": "Mehribanlik; Zəriflik; Yumşaq",
      "meaning_en": "Kindness; Delicacy; Softness",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Lətifə", "Ləman", "Lalə"],
      "popularity": 65,
      "viewCount": 0
    },
    {
      "id": 29,
      "name": "Məhəmməd",
      "name_en": "Muhammad",
      "meaning": "Təriflənən; Həmdolunan; Uca",
      "meaning_en": "Praised; Commended; Exalted",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Məhəmməd", "Məhəbbət", "Məlik"],
      "popularity": 90,
      "viewCount": 0
    },
    {
      "id": 30,
      "name": "Nəzrin",
      "name_en": "Nazrin",
      "meaning": "Zərif; Nazik; Gözəl",
      "meaning_en": "Delicate; Thin; Beautiful",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Nərgiz", "Nərmin", "Nigar"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 31,
      "name": "Osman",
      "name_en": "Osman",
      "meaning": "Güclü; Qəhrəman; İgid",
      "meaning_en": "Strong; Hero; Brave",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Orxan", "Oqtay", "Oruc"],
      "popularity": 82,
      "viewCount": 0
    },
    {
      "id": 32,
      "name": "Pəri",
      "name_en": "Peri",
      "meaning": "Mələk; Gözəl; Uçan",
      "meaning_en": "Angel; Beautiful; Flying",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Pərvanə", "Pərvin", "Pənah"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 33,
      "name": "Rəhim",
      "name_en": "Rahim",
      "meaning": "Mərhəmətli; Şəfqətli; Cömərd",
      "meaning_en": "Merciful; Compassionate; Generous",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Rəşad", "Rəsul", "Rəfiq"],
      "popularity": 78,
      "viewCount": 0
    },
    {
      "id": 34,
      "name": "Səadət",
      "name_en": "Saeedat",
      "meaning": "Xoşbəxtlik; Səadət; Uğur",
      "meaning_en": "Happiness; Bliss; Success",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Səbinə", "Səidə", "Səkinə"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 35,
      "name": "Təranə",
      "name_en": "Təranə",
      "meaning": "Mahnı; Nəğmə; Musiqi",
      "meaning_en": "Song; Melody; Music",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Turalə", "Təhminə", "Tərlan"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 36,
      "name": "Ümid",
      "name_en": "Umid",
      "meaning": "Ümid; Ümidvarlıq; Gələcək",
      "meaning_en": "Hope; Optimism; Future",
      "gender : "oğlan",
      "origin": "ərəb",
      "similar": ["Ülvi", "Ürfan", "Üzeyir"],
      "popularity": 84,
      "viewCount": 0
    },
    {
      "id": 37,
      "name": "Vəfa",
      "name_en": "Vafa",
      "meaning": "Sədaqət; Vəfadarlıq; Etibar",
      "meaning_en": "Loyalty; Faithfulness; Trust",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Vəsilə", "Vəcihə", "Vəliyyə"],
      "popularity": 66,
      "viewCount": 0
    },
    {
      "id": 38,
      "name": "Yusif",
      "name_en": "Yusif",
      "meaning": "Allah artırsın; Çoxaltsın; Gözəl",
      "meaning_en": "May Allah increase; Multiply; Beautiful",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Yaqub", "Yaşar", "Yasəmən"],
      "popularity": 86,
      "viewCount": 0
    },
    {
      "id": 39,
      "name": "Zəhra",
      "name_en": "Zahra",
      "meaning": "Parlaq; İşıqlı; Gözəl",
      "meaning_en": "Bright; Luminous; Beautiful",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Zərifə", "Zəminə", "Zülalə"],
      "popularity": 80,
      "viewCount": 0
    },
    {
      "id": 40,
      "name": "Əli",
      "name_en": "Ali",
      "meaning": "Yüksək; Uca; Əzəmətli",
      "meaning_en": "High; Exalted; Majestic",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Əliyar", "Əmir", "Əkbər"],
      "popularity": 87,
      "viewCount": 0
    },
    {
      "id": 41,
      "name": "Şəhla",
      "name_en": "Shahla",
      "meaning": "Göz gözəlliyi; Qara göz; Cazibədar",
      "meaning_en": "Beauty of the eye; Dark eye; Charming",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Şəbnəm", "Şəfəq", "Şəkər"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 42,
      "name": "Namiq",
      "name_en": "Namiq",
      "meaning": "Məktub yazan; Yazıçı; Şair",
      "meaning_en": "Letter writer; Author; Poet",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Nəsir", "Nəbi", "Nəzim"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 43,
      "name": "Əsmə",
      "name_en": "Asma",
      "meaning": "Uca; Yüksək; Dəyərli",
      "meaning_en": "Exalted; High; Valuable",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Əfsanə", "Əzizə", "Əminə"],
      "popularity": 67,
      "viewCount": 0
    },
    {
      "id": 44,
      "name": "Ruslan",
      "name_en": "Ruslan",
      "meaning": "Şir kimi; Güclü; Qəhrəman",
      "meaning_en": "Like a lion; Strong; Hero",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Rüstəm", "Rafiq", "Ramil"],
      "popularity": 81,
      "viewCount": 0
    },
    {
      "id": 45,
      "name": "Məryəm",
      "name_en": "Maryam",
      "meaning": "Müqəddəs; Pakizə; Təmiz",
      "meaning_en": "Sacred; Pure; Clean",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Mələk", "Mehriban", "Məlahət"],
      "popularity": 89,
      "viewCount": 0
    },
    {
      "id": 46,
      "name": "İbrahim",
      "name_en": "Ibrahim",
      "meaning": "Çoxsaylı xalqın atası; Ulu; Hörmətli",
      "meaning_en": "Father of many nations; Great; Respected",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["İsmayıl", "İlyas", "İdris"],
      "popularity": 83,
      "viewCount": 0
    },
    {
      "id": 47,
      "name": "Könül",
      "name_en": "Konul",
      "meaning": "Ürək; Qəlb; Duyğu",
      "meaning_en": "Heart; Soul; Feeling",
      "gender": "qız",
      "origin": "azərbaycan",
      "similar": ["Könül", "Kəndə", "Kəmalə"],
      "popularity": 78,
      "viewCount": 0
    },
    {
      "id": 48,
      "name": "Rəsul",
      "name_en": "Rasul",
      "meaning": "Elçi; Peyğəmbər; Xəbərçi",
      "meaning_en": "Messenger; Prophet; Bearer of news",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Rəhim", "Rəşad", "Rəfiq"],
      "popularity": 79,
      "viewCount": 0
    },
    {
      "id": 49,
      "name": "Gülüstan",
      "name_en": "Gulustan",
      "meaning": "Gül bağı; Gözəl yer; Cənnət",
      "meaning_en": "Rose garden; Beautiful place; Paradise",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Gülnar", "Gülşən", "Gülər"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 50,
      "name": "Ceyhun",
      "name_en": "Jeyhun",
      "meaning": "Dünya çayı; Böyük çay; Bərəkətli",
      "meaning_en": "World river; Great river; Fertile",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Cəlal", "Cəmil", "Cəfər"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 51,
      "name": "Aydan",
      "name_en": "Aydan",
      "meaning": "Aydan gələn; Ay kimi gözəl; Parlaq",
      "meaning_en": "Coming from the moon; Beautiful as the moon; Bright",
      "gender": "qız",
      "origin": "türk",
      "similar": ["Aysel", "Ayla", "Aynur"],
      "popularity": 82,
      "viewCount": 0
    },
    {
      "id": 52,
      "name": "Fərid",
      "name_en": "Farid",
      "meaning": "Yeganə; Tək; Bənzərsiz",
      "meaning_en": "Unique; Single; Unparalleled",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Fərhad", "Fəxri", "Fəzil"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 53,
      "name": "İradə",
      "name_en": "Irada",
      "meaning": "İradə; İstək; Qətiyyət",
      "meaning_en": "Will; Desire; Determination",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["İlahə", "İlhamə", "İsmət"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 54,
      "name": "Mübariz",
      "name_en": "Mubariz",
      "meaning": "Döyüşçü; Qəhrəman; İgid",
      "meaning_en": "Warrior; Hero; Brave",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Müslüm", "Müşfiq", "Mütəllim"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 55,
      "name": "Aynur",
      "name_en": "Aynur",
      "meaning": "Ay nuru; Ay işığı; Parlaq",
      "meaning_en": "Moonlight; Moon glow; Bright",
      "gender": "qız",
      "origin": "türk",
      "similar": ["Aysel", "Ayla", "Aydan"],
      "popularity": 85,
      "viewCount": 0
    },
    {
      "id": 56,
      "name": "Əlixan",
      "name_en": "Alikhan",
      "meaning": "Əlinin xanı; Güclü; Lider",
      "meaning_en": "Khan of Ali; Strong; Leader",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Əli", "Əliyar", "Əmir"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 57,
      "name": "Təhminə",
      "name_en": "Tahmina",
      "meaning": "Güclü; Qəhrəman; İgid",
      "meaning_en": "Strong; Heroic; Brave",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Təranə", "Tərlan", "Turalə"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 58,
      "name": "Niyaz",
      "name_en": "Niyaz",
      "meaning": "Yalvarış; Dua; İstək",
      "meaning_en": "Plea; Prayer; Desire",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Nicat", "Nəsir", "Nəzim"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 59,
      "name": "Şəbnəm",
      "name_en": "Shabnam",
      "meaning": "Gecə çiyi; Sərin; Təravətli",
      "meaning_en": "Night dew; Cool; Fresh",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Şəhla", "Şəfəq", "Şəkər"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 60,
      "name": "Rəfiq",
      "name_en": "Rafiq",
      "meaning": "Yoldaş; Dost; Sirdaş",
      "meaning_en": "Companion; Friend; Confidant",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Rəhim", "Rəşad", "Rəsul"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 61,
      "name": "Lalə",
      "name_en": "Lala",
      "meaning": "Çiçək adı; Qırmızı; Gözəl",
      "meaning_en": "Flower name; Red; Beautiful",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Ləman", "Leyla", "Lətifə"],
      "popularity": 79,
      "viewCount": 0
    },
    {
      "id": 62,
      "name": "Bəxtiyar",
      "name_en": "Bakhtiyar",
      "meaning": "Xoşbəxt; Bəxtli; Uğurlu",
      "meaning_en": "Happy; Fortunate; Successful",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Bəhram", "Bəhlul", "Bəşir"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 63,
      "name": "Gülər",
      "name_en": "Guler",
      "meaning": "Gülən; Şən; Sevimli",
      "meaning_en": "Smiling; Cheerful; Lovely",
      "gender": "qız",
      "origin": "azərbaycan",
      "similar": ["Gülnar", "Günel", "Gülşən"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 64,
      "name": "Kamil",
      "name_en": "Kamil",
      "meaning": "Mükəmməl; Tam; Bitkin",
      "meaning_en": "Perfect; Complete; Mature",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Kərim", "Kənan", "Kəmalə"],
      "popularity": 78,
      "viewCount": 0
    },
    {
      "id": 65,
      "name": "Nərgiz",
      "name_en": "Nargiz",
      "meaning": "Çiçək adı; Gözəl; Ətirli",
      "meaning_en": "Flower name; Beautiful; Fragrant",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Nəzrin", "Nigar", "Nərmin"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 66,
      "name": "Turan",
      "name_en": "Turan",
      "meaning": "Vətən; Yurd; Torpaq",
      "meaning_en": "Homeland; Land; Soil",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Tural", "Turgut", "Turxan"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 67,
      "name": "Səmirə",
      "name_en": "Samira",
      "meaning": "Söhbət edən; Danışan; Dost",
      "meaning_en": "Conversationalist; Speaker; Friend",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Səbinə", "Səidə", "Səkinə"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 68,
      "name": "Elçin",
      "name_en": "Elchin",
      "meaning": "Xalqın elçisi; Nümayəndə; Səfir",
      "meaning_en": "Envoy of the people; Representative; Ambassador",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Elvin", "Elnur", "Elşən"],
      "popularity": 80,
      "viewCount": 0
    },
    {
      "id": 69,
      "name": "Rəvanə",
      "name_en": "Ravana",
      "meaning": "Gedən; Yola çıxan; Səyyah",
      "meaning_en": "Going; Departing; Traveler",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Röya", "Reyhan", "Rəna"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 70,
      "name": "Vasif",
      "name_en": "Vasif",
      "meaning": "Tərifçi; Həmdedici; Öyən",
      "meaning_en": "Praiser; Commender; Extoller",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Vüsal", "Vəli", "Vaqif"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 71,
      "name": "Ülkər",
      "name_en": "Ulkar",
      "meaning": "Ulduz qrupu; Parlaq; Gözəl",
      "meaning_en": "Star cluster; Bright; Beautiful",
      "gender": "qız",
      "origin": "türk",
      "similar": ["Ülviyyə", "Ümidə", "Ürfanə"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 72,
      "name": "Yaşar",
      "name_en": "Yashar",
      "meaning": "Yaşayan; Həyat sürən; Ömürlü",
      "meaning_en": "Living; Enduring; Long-lived",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Yusif", "Yaqub", "Yasəmən"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 73,
      "name": "Zəminə",
      "name_en": "Zamina",
      "meaning": "Yer; Torpaq; Əsas",
      "meaning_en": "Earth; Soil; Foundation",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Zəhra", "Zərifə", "Zülalə"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 74,
      "name": "Əkbər",
      "name_en": "Akbar",
      "meaning": "Ən böyük; Uca; Əzəmətli",
      "meaning_en": "Greatest; Exalted; Majestic",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Əli", "Əliyar", "Əmir"],
      "popularity": 82,
      "viewCount": 0
    },
    {
      "id": 75,
      "name": "Şəfəq",
      "name_en": "Shafaq",
      "meaning": "Şəfəq vaxtı; Səhər; Qızartı",
      "meaning_en": "Dawn; Morning; Blush",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Şəhla", "Şəbnəm", "Şəkər"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 76,
      "name": "Nəbi",
      "name_en": "Nabi",
      "meaning": "Peyğəmbər; Elçi; Xəbərçi",
      "meaning_en": "Prophet; Messenger; Bearer of news",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Namiq", "Nəsir", "Nəzim"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 77,
      "name": "Əfsanə",
      "name_en": "Afshana",
      "meaning": "Nağıl; Hekayə; Rəvayət",
      "meaning_en": "Tale; Story; Legend",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Əsmə", "Əzizə", "Əminə"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 78,
      "name": "Rafiq",
      "name_en": "Rafiq",
      "meaning": "Yoldaş; Dost; Sirdaş",
      "meaning_en": "Companion; Friend; Confidant",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ruslan", "Rüstəm", "Ramil"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 79,
      "name": "Mələk",
      "name_en": "Malak",
      "meaning": "Mələk; Gözəl; Uçan",
      "meaning_en": "Angel; Beautiful; Flying",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Məryəm", "Mehriban", "Məlahət"],
      "popularity": 84,
      "viewCount": 0
    },
    {
      "id": 80,
      "name": "İsmayıl",
      "name_en": "Ismail",
      "meaning": "Allah eşidər; Dinləyən; Qəbul edən",
      "meaning_en": "God hears; Listener; Acceptor",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["İbrahim", "İlyas", "İdris"],
      "popularity": 79,
      "viewCount": 0
    },
    {
      "id": 81,
      "name": "Kəndə",
      "name_en": "Kanda",
      "meaning": "Şəkər; Şirin; Dadlı",
      "meaning_en": "Sugar; Sweet; Tasty",
      "gender": "qız",
      "origin": "azərbaycan",
      "similar": ["Könül", "Kəmalə", "Kərim"],
      "popularity": 65,
      "viewCount": 0
    },
    {
      "id": 82,
      "name": "Cəlal",
      "name_en": "Jalal",
      "meaning": "Böyüklük; Əzəmət; Şan",
      "meaning_en": "Greatness; Majesty; Glory",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ceyhun", "Cəmil", "Cəfər"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 83,
      "name": "Firəngiz",
      "name_en": "Firangiz",
      "meaning": "Fərəng qızı; Avropalı; Gözəl",
      "meaning_en": "Daughter of Frank; European; Beautiful",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Fidan", "Feridə", "Fəridə"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 84,
      "name": "Fərhad",
      "name_en": "Farhad",
      "meaning": "Xoşbəxt; Sevimli; Şirin",
      "meaning_en": "Happy; Beloved; Sweet",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Fərid", "Fəxri", "Fəzil"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 85,
      "name": "Günay",
      "name_en": "Gunay",
      "meaning": "Günəş; İşıq; Parlaq",
      "meaning_en": "Sun; Light; Bright",
      "gender": "qız",
      "origin": "azərbaycan",
      "similar": ["Günel", "Gülər", "Gülnaz"],
      "popularity": 81,
      "viewCount": 0
    },
    {
      "id": 86,
      "name": "Hüseyn",
      "name_en": "Hussein",
      "meaning": "Gözəl; Yaxşı; Xeyirli",
      "meaning_en": "Beautiful; Good; Beneficial",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Həsən", "Həmid", "Həkim"],
      "popularity": 85,
      "viewCount": 0
    },
    {
      "id": 87,
      "name": "İlhamə",
      "name_en": "Ilhama",
      "meaning": "İlham verən; Ruhlandıran; Təşviq edən",
      "meaning_en": "Inspiring; Encouraging; Motivating",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["İlahə", "İradə", "İsmət"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 88,
      "name": "Kənan",
      "name_en": "Kanan",
      "meaning": "Qədim ölkə adı; Müqəddəs; Uca",
      "meaning_en": "Ancient country name; Sacred; Exalted",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Kərim", "Kamil", "Kəmalə"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 89,
      "name": "Lətifə",
      "name_en": "Latifa",
      "meaning": "Zərif; Nazik; Yumşaq",
      "meaning_en": "Graceful; Delicate; Soft",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Ləti", "Ləman", "Lalə"],
      "popularity": 67,
      "viewCount": 0
    },
    {
      "id": 90,
      "name": "Məhəbbət",
      "name_en": "Mahabbat",
      "meaning": "Sevgi; Məhəbbət; Eşq",
      "meaning_en": "Love; Affection; Passion",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Məhəmməd", "Məlik", "Məryəm"],
      "popularity": 78,
      "viewCount": 0
    },
    {
      "id": 91,
      "name": "Nəsir",
      "name_en": "Nasir",
      "meaning": "Köməkçi; Yardımçı; Dəstək",
      "meaning_en": "Helper; Assistant; Support",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Namiq", "Nəbi", "Nəzim"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 92,
      "name": "Oqtay",
      "name_en": "Oktay",
      "meaning": "Ox kimi sürətli; Cəld; Çevik",
      "meaning_en": "Fast as an arrow; Agile; Flexible",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Orxan", "Osman", "Oruc"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 93,
      "name": "Pərvanə",
      "name_en": "Parvana",
      "meaning": "Kəpənək; Gözəl; Uçan",
      "meaning_en": "Butterfly; Beautiful; Flying",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Pəri", "Pərvin", "Pənah"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 94,
      "name": "Qədir",
      "name_en": "Qadir",
      "meaning": "Qüdrətli; Güclü; Əzəmətli",
      "meaning_en": "Powerful; Strong; Majestic",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Qasım", "Qəhrəman", "Qurban"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 95,
      "name": "Səidə",
      "name_en": "Saida",
      "meaning": "Xoşbəxt; Səadətli; Uğurlu",
      "meaning_en": "Happy; Blissful; Successful",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Səbinə", "Səkinə", "Səmirə"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 96,
      "name": "Tərlan",
      "name_en": "Tarlan",
      "meaning": "Qartal; Güclü; Uçan",
      "meaning_en": "Eagle; Strong; Flying",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Təranə", "Təhminə", "Turalə"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 97,
      "name": "Ürfan",
      "name_en": "Irfan",
      "meaning": "Bilik; Mərifət; Ağıl",
      "meaning_en": "Knowledge; Wisdom; Intellect",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ülvi", "Ümid", "Üzeyir"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 98,
      "name": "Vəsilə",
      "name_en": "Vasile",
      "meaning": "Vasitə; Yol; Əlaqə",
      "meaning_en": "Means; Way; Connection",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Vəfa", "Vəcihə", "Vəliyyə"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 99,
      "name": "Yaqub",
      "name_en": "Yaqub",
      "meaning": "Peyğəmbər adı; Müqəddəs; Uca",
      "meaning_en": "Prophet's name; Sacred; Exalted",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Yusif", "Yaşar", "Yasəmən"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 100,
      "name": "Zərifə",
      "name_en": "Zarifa",
      "meaning": "Zərif; Nazik; Gözəl",
      "meaning_en": "Graceful; Delicate; Beautiful",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Zəhra", "Zəminə", "Zülalə"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 101,
      "name": "Əliyar",
      "name_en": "Aliyar",
      "meaning": "Əlinin dostu; Yaxın; Sirdaş",
      "meaning_en": "Friend of Ali; Close; Confidant",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Əli", "Əlixan", "Əmir"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 102,
      "name": "Şəkər",
      "name_en": "Shakar",
      "meaning": "Şəkər; Şirin; Dadlı",
      "meaning_en": "Sugar; Sweet; Delicious",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Şəhla", "Şəbnəm", "Şəfəq"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 103,
      "name": "Nəzim",
      "name_en": "Nazim",
      "meaning": "Şair; Nazim; Yazıçı",
      "meaning_en": "Poet; Organizer; Writer",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Namiq", "Nəbi", "Nəsir"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 104,
      "name": "Əminə",
      "name_en": "Amina",
      "meaning": "Etibarlı; Güvənli; Sadiq",
      "meaning_en": "Trustworthy; Reliable; Loyal",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Əsmə", "Əfsanə", "Əzizə"],
      "popularity": 81,
      "viewCount": 0
    },
    {
      "id": 105,
      "name": "Rüstəm",
      "name_en": "Rustam",
      "meaning": "Qəhrəman; İgid; Güclü",
      "meaning_en": "Hero; Brave; Strong",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Ruslan", "Rafiq", "Ramil"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 106,
      "name": "Mehriban",
      "name_en": "Mehriban",
      "meaning": "Mərhəmətli; Sevimli; Yaxşı",
      "meaning_en": "Kind; Beloved; Good",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Məryəm", "Mələk", "Məlahət"],
      "popularity": 83,
      "viewCount": 0
    },
    {
      "id": 107,
      "name": "İlyas",
      "name_en": "Ilyas",
      "meaning": "Peyğəmbər adı; Müqəddəs; Uca",
      "meaning_en": "Prophet's name; Sacred; Exalted",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["İbrahim", "İsmayıl", "İdris"],
      "popularity": 78,
      "viewCount": 0
    },
    {
      "id": 108,
      "name": "Turalə",
      "name_en": "Turala",
      "meaning": "Tural kimi; Güclü; İgid",
      "meaning_en": "Like Tural; Strong; Brave",
      "gender": "qız",
      "origin": "türk",
      "similar": ["Təranə", "Təhminə", "Tərlan"],
      "popularity": 67,
      "viewCount": 0
    },
    {
      "id": 109,
      "name": "Cəmil",
      "name_en": "Jamil",
      "meaning": "Gözəl; Yaraşıqlı; Şirin",
      "meaning_en": "Beautiful; Handsome; Sweet",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ceyhun", "Cəlal", "Cəfər"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 110,
      "name": "Feridə",
      "name_en": "Farida",
      "meaning": "Yeganə; Tək; Bənzərsiz",
      "meaning_en": "Unique; Single; Unparalleled",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Fidan", "Firəngiz", "Fəridə"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 111,
      "name": "Fəxri",
      "name_en": "Fakhri",
      "meaning": "Fəxr edən; Qürurlu; Şərəfli",
      "meaning_en": "Proud; Honorable; Glorious",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Fərid", "Fərhad", "Fəzil"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 112,
      "name": "Gülnaz",
      "name_en": "Gulnaz",
      "meaning": "Gül kimi nazik; Zərif; Gözəl",
      "meaning_en": "Delicate as a rose; Graceful; Beautiful",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Gülnar", "Günel", "Gülər"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 113,
      "name": "Həmid",
      "name_en": "Hamid",
      "meaning": "Həmd edən; Tərifləyən; Öyən",
      "meaning_en": "Praiser; Commender; Extoller",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Həsən", "Hüseyn", "Həkim"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 114,
      "name": "İsmət",
      "name_en": "Ismat",
      "meaning": "Pakizə; Təmiz; Günahsız",
      "meaning_en": "Pure; Clean; Innocent",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["İlahə", "İlhamə", "İradə"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 115,
      "name": "Məlik",
      "name_en": "Malik",
      "meaning": "Padşah; Hökmdar; Rəhbər",
      "meaning_en": "King; Ruler; Leader",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Məhəmməd", "Məhəbbət", "Məryəm"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 116,
      "name": "Nərmin",
      "name_en": "Narmin",
      "meaning": "Nazik; Zərif; Yumşaq",
      "meaning_en": "Delicate; Graceful; Soft",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Nərgiz", "Nəzrin", "Nigar"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 117,
      "name": "Oruc",
      "name_en": "Oruj",
      "meaning": "Oruc tutan; Dindar; Səbirli",
      "meaning_en": "Fasting; Pious; Patient",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Orxan", "Osman", "Oqtay"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 118,
      "name": "Pərvin",
      "name_en": "Parvin",
      "meaning": "Ulduz qrupu; Parlaq; Gözəl",
      "meaning_en": "Star cluster; Bright; Beautiful",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Pəri", "Pərvanə", "Pənah"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 119,
      "name": "Qasım",
      "name_en": "Qasim",
      "meaning": "Bölən; Paylayan; Ədalətli",
      "meaning_en": "Divider; Distributer; Just",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Qədir", "Qəhrəman", "Qurban"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 120,
      "name": "Səkinə",
      "name_en": "Sakina",
      "meaning": "Sakit; Dinc; Rahat",
      "meaning_en": "Calm; Peaceful; Comfortable",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Səbinə", "Səidə", "Səmirə"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 121,
      "name": "Turgut",
      "name_en": "Turgut",
      "meaning": "Ayağa qalxan; Dirçələn; Güclü",
      "meaning_en": "Rising; Reviving; Strong",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Tural", "Turan", "Turxan"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 122,
      "name": "Ümidə",
      "name_en": "Umida",
      "meaning": "Ümidli; Gələcəyə baxan; Sevimli",
      "meaning_en": "Hopeful; Looking to the future; Lovely",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Ülviyyə", "Ülkər", "Ürfanə"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 123,
      "name": "Vaqif",
      "name_en": "Vagif",
      "meaning": "Bilən; Xəbərdar; Ağıllı",
      "meaning_en": "Knowing; Aware; Intelligent",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Vüsal", "Vəli", "Vasif"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 124,
      "name": "Yasəmən",
      "name_en": "Yasaman",
      "meaning": "Çiçək adı; Ətirli; Gözəl",
      "meaning_en": "Flower name; Fragrant; Beautiful",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Yusif", "Yaşar", "Yaqub"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 125,
      "name": "Zülalə",
      "name_en": "Zulala",
      "meaning": "Şəffaf su; Təmiz; Saf",
      "meaning_en": "Transparent water; Clean; Pure",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Zəhra", "Zərifə", "Zəminə"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 126,
      "name": "Əmir",
      "name_en": "Amir",
      "meaning": "Hökmdar; Əmir; Rəhbər",
      "meaning_en": "Ruler; Prince; Leader",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Əli", "Əliyar", "Əkbər"],
      "popularity": 79,
      "viewCount": 0
    },
    {
      "id": 127,
      "name": "Şəhriyar",
      "name_en": "Shahriyar",
      "meaning": "Şəhər hökmdarı; Güclü; Lider",
      "meaning_en": "Ruler of the city; Strong; Leader",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Şəhla", "Şəbnəm", "Şəfəq"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 128,
      "name": "Nicat",
      "name_en": "Nijat",
      "meaning": "Qurtuluş; Xilas; Azadlıq",
      "meaning_en": "Salvation; Deliverance; Freedom",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Niyaz", "Nəsir", "Nəzim"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 129,
      "name": "Əzizə",
      "name_en": "Aziza",
      "meaning": "Əziz; Sevimli; Dəyərli",
      "meaning_en": "Dear; Beloved; Valuable",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Əsmə", "Əfsanə", "Əminə"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 130,
      "name": "Ramil",
      "name_en": "Ramil",
      "meaning": "Atıcı; Nişançı; Dəqiq",
      "meaning_en": "Archer; Marksman; Precise",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ruslan", "Rüstəm", "Rafiq"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 131,
      "name": "Məlahət",
      "name_en": "Malahat",
      "meaning": "Gözəllik; Zəriflik; Cazibə",
      "meaning_en": "Beauty; Grace; Charm",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Məryəm", "Mələk", "Mehriban"],
      "popularity": 78,
      "viewCount": 0
    },
    {
      "id": 132,
      "name": "İdris",
      "name_en": "Idris",
      "meaning": "Peyğəmbər adı; Müdrik; Ağıllı",
      "meaning_en": "Prophet's name; Wise; Intelligent",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["İbrahim", "İsmayıl", "İlyas"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 133,
      "name": "Gülşən",
      "name_en": "Gulshan",
      "meaning": "Gül bağçası; Gözəl yer; Cənnət",
      "meaning_en": "Rose garden; Beautiful place; Paradise",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Gülnar", "Günel", "Gülər"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 134,
      "name": "Cəfər",
      "name_en": "Jafar",
      "meaning": "Çay; Bərəkət; Bolluq",
      "meaning_en": "River; Blessing; Abundance",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ceyhun", "Cəlal", "Cəmil"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 135,
      "name": "Fəridə",
      "name_en": "Farida",
      "meaning": "Yeganə; Tək; Bənzərsiz",
      "meaning_en": "Unique; Single; Unparalleled",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Fidan", "Firəngiz", "Feridə"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 136,
      "name": "Fəzil",
      "name_en": "Fazil",
      "meaning": "Fəzilətli; Üstün; Yüksək",
      "meaning_en": "Virtuous; Superior; High",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Fərid", "Fərhad", "Fəxri"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 137,
      "name": "Həkim",
      "name_en": "Hakim",
      "meaning": "Həkim; Müdrik; Ağıllı",
      "meaning_en": "Doctor; Wise; Intelligent",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Həsən", "Hüseyn", "Həmid"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 138,
      "name": "Ürfanə",
      "name_en": "Irfana",
      "meaning": "Bilikli; Mərifətli; Ağıllı",
      "meaning_en": "Knowledgeable; Virtuous; Intelligent",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Ülviyyə", "Ülkər", "Ümidə"],
      "popularity": 67,
      "viewCount": 0
    },
    {
      "id": 139,
      "name": "Pənah",
      "name_en": "Panah",
      "meaning": "Sığınacaq; Qoruyucu; Himayədar",
      "meaning_en": "Shelter; Protector; Patron",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Pəri", "Pərvanə", "Pərvin"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 140,
      "name": "Qəhrəman",
      "name_en": "Qahraman",
      "meaning": "Qəhrəman; İgid; Cəsur",
      "meaning_en": "Hero; Brave; Courageous",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Qədir", "Qasım", "Qurban"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 141,
      "name": "Turxan",
      "name_en": "Turkhan",
      "meaning": "Türk xanı; Güclü; Lider",
      "meaning_en": "Turk Khan; Strong; Leader",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Tural", "Turan", "Turgut"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 142,
      "name": "Vəli",
      "name_en": "Vali",
      "meaning": "Dost; Yaxın; Himayədar",
      "meaning_en": "Friend; Close; Patron",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Vüsal", "Vaqif", "Vasif"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 143,
      "name": "Üzeyir",
      "name_en": "Uzeyir",
      "meaning": "Köməkçi; Yardımçı; Dəstək",
      "meaning_en": "Helper; Assistant; Support",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ülvi", "Ümid", "Ürfan"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 144,
      "name": "Vəcihə",
      "name_en": "Vajiha",
      "meaning": "Üzü gözəl; Cazibədar; Şirin",
      "meaning_en": "Beautiful-faced; Charming; Sweet",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Vəfa", "Vəsilə", "Vəliyyə"],
      "popularity": 66,
      "viewCount": 0
    },
    {
      "id": 145,
      "name": "Qurban",
      "name_en": "Qurban",
      "meaning": "Qurban; Fədakarlıq; Sədaqət",
      "meaning_en": "Sacrifice; Devotion; Loyalty",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Qədir", "Qasım", "Qəhrəman"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 146,
      "name": "Vəliyyə",
      "name_en": "Valiyya",
      "meaning": "Dost; Yaxın; Himayədar",
      "meaning_en": "Friend; Close; Patron",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Vəfa", "Vəsilə", "Vəcihə"],
      "popularity": 65,
      "viewCount": 0
    },
    {
      "id": 147,
      "name": "Rəna",
      "name_en": "Rana",
      "meaning": "Rəngli; Gözəl; Cazibədar",
      "meaning_en": "Colorful; Beautiful; Charming",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Röya", "Reyhan", "Rəvanə"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 148,
      "name": "Reyhan",
      "name_en": "Reyhan",
      "meaning": "Ətirli ot; Xoş qoxu; Gözəl",
      "meaning_en": "Fragrant herb; Pleasant scent; Beautiful",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Röya", "Rəna", "Rəvanə"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 149,
      "name": "Səmər",
      "name_en": "Samar",
      "meaning": "Meyvə; Bəhrə; Nəticə",
      "meaning_en": "Fruit; Benefit; Result",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Samir", "Sənan", "Səbuhi"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 150,
      "name": "Sənan",
      "name_en": "Sanar",
      "meaning": "Nizə ucu; Kəskin; Ağıllı",
      "meaning_en": "Spearhead; Sharp; Intelligent",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Samir", "Səmər", "Səbuhi"],
      "popularity": 67,
      "viewCount": 0
    },
    {
      "id": 151,
      "name": "Səbuhi",
      "name_en": "Sabuh",
      "meaning": "Səhərə aid; Təzə; Yeni",
      "meaning_en": "Related to morning; Fresh; New",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Samir", "Səmər", "Sənan"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 152,
      "name": "Bəhram",
      "name_en": "Bahram",
      "meaning": "Mars planeti; Güclü; Qüvvətli",
      "meaning_en": "Planet Mars; Strong; Powerful",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Bəxtiyar", "Bəhlul", "Bəşir"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 153,
      "name": "Bəhlul",
      "name_en": "Bahlul",
      "meaning": "Şən; Xoşhəl; Gülərüz",
      "meaning_en": "Cheerful; Happy; Smiling",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Bəxtiyar", "Bəhram", "Bəşir"],
      "popularity": 66,
      "viewCount": 0
    },
    {
      "id": 154,
      "name": "Bəşir",
      "name_en": "Bashir",
      "meaning": "Müjdəçi; Xəbərçi; Sevimli",
      "meaning_en": "Bearer of good news; Messenger; Beloved",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Bəxtiyar", "Bəhram", "Bəhlul"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 155,
      "name": "Cahid",
      "name_en": "Jahid",
      "meaning": "Çalışan; Səy göstərən; Fəal",
      "meaning_en": "Striving; Diligent; Active",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Cavid", "Cavad", "Camal"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 156,
      "name": "Cavad",
      "name_en": "Javad",
      "meaning": "Səxavətli; Mərhəmətli; Cömərd",
      "meaning_en": "Generous; Merciful; Charitable",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Cavid", "Cahid", "Camal"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 157,
      "name": "Camal",
      "name_en": "Jamal",
      "meaning": "Gözəllik; Yaraşıqlı; Şirin",
      "meaning_en": "Beauty; Handsome; Sweet",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Cavid", "Cavad", "Cahid"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 158,
      "name": "Dilbər",
      "name_en": "Dilbar",
      "meaning": "Ürək alan; Gözəl; Sevimli",
      "meaning_en": "Heart-stealer; Beautiful; Beloved",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Dilara", "Dilan", "Dilarə"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 159,
      "name": "Dilan",
      "name_en": "Dilan",
      "meaning": "Ürək; Qəlb; Duyğu",
      "meaning_en": "Heart; Soul; Emotion",
      "gender": "qız",
      "origin": "kürd",
      "similar": ["Dilara", "Dilbər", "Dilarə"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 160,
      "name": "Dilarə",
      "name_en": "Dilara",
      "meaning": "Ürək bəzəyi; Gözəl; Sevimli",
      "meaning_en": "Adornment of the heart; Beautiful; Beloved",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Dilara", "Dilbər", "Dilan"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 161,
      "name": "Emin",
      "name_en": "Emin",
      "meaning": "Etibarlı; Güvənli; Sadiq",
      "meaning_en": "Trustworthy; Reliable; Loyal",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Emil", "Əmir", "Eldar"],
      "popularity": 78,
      "viewCount": 0
    },
    {
      "id": 162,
      "name": "Eldar",
      "name_en": "Eldar",
      "meaning": "Elin hökmdarı; Güclü; Lider",
      "meaning_en": "Ruler of the people; Strong; Leader",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Emil", "Emin", "Əmir"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 163,
      "name": "Elşən",
      "name_en": "Elshan",
      "meaning": "Xalqın şənliyi; Sevincli; Gülərüz",
      "meaning_en": "Joy of the people; Cheerful; Smiling",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Elvin", "Elnur", "Elçin"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 164,
      "name": "Arifa",
      "name_en": "Arifa",
      "meaning": "Bilən; Tanıyan; Ağıllı",
      "meaning_en": "Knowing; Recognizing; Intelligent",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Arzu", "Arzum", "Aida"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 165,
      "name": "Arzum",
      "name_en": "Arzum",
      "meaning": "Mənim arzum; İstək; Xəyal",
      "meaning_en": "My wish; Desire; Dream",
      "gender": "qız",
      "origin": "türk",
      "similar": ["Arzu", "Arifa", "Aida"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 166,
      "name": "Aida",
      "name_en": "Aida",
      "meaning": "Qayıdan; Geri dönən; Sevimli",
      "meaning_en": "Returning; Coming back; Beloved",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Arzu", "Arzum", "Arifa"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 167,
      "name": "Kamal",
      "name_en": "Kamal",
      "meaning": "Mükəmməllik; Tamlıq; Bitkinlik",
      "meaning_en": "Perfection; Completeness; Maturity",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Kamil", "Kərim", "Kənan"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 168,
      "name": "Müslüm",
      "name_en": "Muslim",
      "meaning": "Müsəlman; Dindar; İnanclı",
      "meaning_en": "Muslim; Pious; Believing",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Mübariz", "Müşfiq", "Mütəllim"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 169,
      "name": "Müşfiq",
      "name_en": "Mushfiq",
      "meaning": "Şəfqətli; Mərhəmətli; Sevimli",
      "meaning_en": "Compassionate; Merciful; Beloved",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Mübariz", "Müslüm", "Mütəllim"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 170,
      "name": "Mütəllim",
      "name_en": "Mutallim",
      "meaning": "Öyrənən; Tələbə; Ağıllı",
      "meaning_en": "Learner; Student; Intelligent",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Mübariz", "Müslüm", "Müşfiq"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 171,
      "name": "Ayşən",
      "name_en": "Ayshan",
      "meaning": "Ay kimi parlaq; Gözəl; İşıqlı",
      "meaning_en": "Bright as the moon; Beautiful; Luminous",
      "gender": "qız",
      "origin": "türk",
      "similar": ["Aysel", "Ayla", "Aynur"],
      "popularity": 79,
      "viewCount": 0
    },
    {
      "id": 172,
      "name": "Bəyəm",
      "name_en": "Bayem",
      "meaning": "Xanım; Hörmətli; Sevimli",
      "meaning_en": "Lady; Respected; Beloved",
      "gender": "qız",
      "origin": "azərbaycan",
      "similar": ["Bənövşə", "Bəsti", "Bəhruz"],
      "popularity": 65,
      "viewCount": 0
    },
    {
      "id": 173,
      "name": "Bənövşə",
      "name_en": "Banovsha",
      "meaning": "Çiçək adı; Gözəl; Ətirli",
      "meaning_en": "Flower name; Beautiful; Fragrant",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Bəyəm", "Bəsti", "Bəhruz"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 174,
      "name": "Bəsti",
      "name_en": "Basti",
      "meaning": "Bağlı; Sadiq; Etibarlı",
      "meaning_en": "Bound; Loyal; Reliable",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Bəyəm", "Bənövşə", "Bəhruz"],
      "popularity": 64,
      "viewCount": 0
    },
    {
      "id": 175,
      "name": "Bəhruz",
      "name_en": "Behruz",
      "meaning": "Xoşbəxt gün; Uğurlu; Sevincli",
      "meaning_en": "Happy day; Successful; Joyful",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Bəyəm", "Bənövşə", "Bəsti"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 176,
      "name": "Cahan",
      "name_en": "Jahan",
      "meaning": "Dünya; Kainat; Aləm",
      "meaning_en": "World; Universe; Realm",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Cahangir", "Cahandar", "Cahanşah"],
      "popularity": 67,
      "viewCount": 0
    },
    {
      "id": 177,
      "name": "Cahangir",
      "name_en": "Jahangir",
      "meaning": "Dünyanı alan; Fatih; Güclü",
      "meaning_en": "Conqueror of the world; Victorious; Strong",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Cahan", "Cahandar", "Cahanşah"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 178,
      "name": "Cahandar",
      "name_en": "Jahandar",
      "meaning": "Dünya sahibi; Güclü; Qüdrətli",
      "meaning_en": "Owner of the world; Strong; Powerful",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Cahan", "Cahangir", "Cahanşah"],
      "popularity": 66,
      "viewCount": 0
    },
    {
      "id": 179,
      "name": "Cahanşah",
      "name_en": "Jahanshah",
      "meaning": "Dünya şahı; Güclü; Lider",
      "meaning_en": "King of the world; Strong; Leader",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Cahan", "Cahangir", "Cahandar"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 180,
      "name": "Dəyanət",
      "name_en": "Dayanat",
      "meaning": "Dindarlıq; İman; Sədaqət",
      "meaning_en": "Piety; Faith; Loyalty",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Dəmət", "Dərya", "Dəstə"],
      "popularity": 67,
      "viewCount": 0
    },
    {
      "id": 181,
      "name": "Dəmət",
      "name_en": "Damat",
      "meaning": "Dəstə; Buket; Gözəl",
      "meaning_en": "Bunch; Bouquet; Beautiful",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Dəyanət", "Dərya", "Dəstə"],
      "popularity": 63,
      "viewCount": 0
    },
    {
      "id": 182,
      "name": "Dərya",
      "name_en": "Darya",
      "meaning": "Dəniz; Okean; Böyük",
      "meaning_en": "Sea; Ocean; Great",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Dəyanət", "Dəmət", "Dəstə"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 183,
      "name": "Dəstə",
      "name_en": "Dasta",
      "meaning": "Dəstə; Qrup; Toplu",
      "meaning_en": "Bunch; Group; Collection",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Dəyanət", "Dəmət", "Dərya"],
      "popularity": 62,
      "viewCount": 0
    },
    {
      "id": 184,
      "name": "Ədalət",
      "name_en": "Adalat",
      "meaning": "Ədalət; Haqq; Düzlük",
      "meaning_en": "Justice; Right; Fairness",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Əhməd", "Əsgər", "Əziz"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 185,
      "name": "Əhməd",
      "name_en": "Ahmad",
      "meaning": "Həmd olunan; Təriflənən; Uca",
      "meaning_en": "Praised; Commended; Exalted",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ədalət", "Əsgər", "Əziz"],
      "popularity": 82,
      "viewCount": 0
    },
    {
      "id": 186,
      "name": "Əsgər",
      "name_en": "Asgar",
      "meaning": "Əsgər; Döyüşçü; Qoruyucu",
      "meaning_en": "Soldier; Warrior; Protector",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ədalət", "Əhməd", "Əziz"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 187,
      "name": "Əziz",
      "name_en": "Aziz",
      "meaning": "Əziz; Sevimli; Dəyərli",
      "meaning_en": "Dear; Beloved; Valuable",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ədalət", "Əhməd", "Əsgər"],
      "popularity": 78,
      "viewCount": 0
    },
    {
      "id": 188,
      "name": "Fəxriyyə",
      "name_en": "Fakhriyya",
      "meaning": "Fəxr edən; Qürurlu; Şərəfli",
      "meaning_en": "Proud; Honorable; Glorious",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Fəzilə", "Fərəh", "Fərda"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 189,
      "name": "Fəzilə",
      "name_en": "Fazila",
      "meaning": "Fəzilətli; Üstün; Yüksək",
      "meaning_en": "Virtuous; Superior; High",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Fəxriyyə", "Fərəh", "Fərda"],
      "popularity": 67,
      "viewCount": 0
    },
    {
      "id": 190,
      "name": "Fərəh",
      "name_en": "Farah",
      "meaning": "Sevinc; Şadlıq; Xoşbəxtlik",
      "meaning_en": "Joy; Gladness; Happiness",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Fəxriyyə", "Fəzilə", "Fərda"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 191,
      "name": "Fərda",
      "name_en": "Farda",
      "meaning": "Sabah; Gələcək; Ümid",
      "meaning_en": "Tomorrow; Future; Hope",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Fəxriyyə", "Fəzilə", "Fərəh"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 192,
      "name": "Gülbəniz",
      "name_en": "Gulbaniz",
      "meaning": "Gül üzlü; Gözəl; Şirin",
      "meaning_en": "Rose-faced; Beautiful; Sweet",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Gülbahar", "Gülçin", "Güldan"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 193,
      "name": "Gülbahar",
      "name_en": "Gulbahar",
      "meaning": "Gül baharı; Gözəl; Təravətli",
      "meaning_en": "Spring of roses; Beautiful; Fresh",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Gülbəniz", "Gülçin", "Güldan"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 194,
      "name": "Gülçin",
      "name_en": "Gulchin",
      "meaning": "Gül toplayan; Seçilmiş; Gözəl",
      "meaning_en": "Rose picker; Chosen; Beautiful",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Gülbəniz", "Gülbahar", "Güldan"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 195,
      "name": "Güldan",
      "name_en": "Guldan",
      "meaning": "Gül qabı; Gözəl; Bəzək",
      "meaning_en": "Rose vase; Beautiful; Ornament",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Gülbəniz", "Gülbahar", "Gülçin"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 196,
      "name": "Həbib",
      "name_en": "Habib",
      "meaning": "Sevimli; Əziz; Yaxın",
      "meaning_en": "Beloved; Dear; Close",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Həbibə", "Həcər", "Hədi"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 197,
      "name": "Həbibə",
      "name_en": "Habiba",
      "meaning": "Sevimli; Əziz; Yaxın",
      "meaning_en": "Beloved; Dear; Close",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Həbib", "Həcər", "Hədi"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 198,
      "name": "Həcər",
      "name_en": "Hajar",
      "meaning": "Daş; Güclü; Möhkəm",
      "meaning_en": "Stone; Strong; Firm",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Həbib", "Həbibə", "Hədi"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 199,
      "name": "Hədi",
      "name_en": "Hadi",
      "meaning": "Hidayət edən; Yol göstərən; Ağıllı",
      "meaning_en": "Guiding; Showing the way; Intelligent",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Həbib", "Həbibə", "Həcər"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 200,
      "name": "İlkin",
      "name_en": "Ilkin",
      "meaning": "İlk; Əvvəl; Başlanğıc",
      "meaning_en": "First; Initial; Beginning",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["İlqar", "İlham", "İlyas"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 201,
      "name": "İlqar",
      "name_en": "Ilgar",
      "meaning": "Elin qəhrəmanı; Güclü; İgid",
      "meaning_en": "Hero of the people; Strong; Brave",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["İlkin", "İlham", "İlyas"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 202,
      "name": "İlham",
      "name_en": "Ilham",
      "meaning": "İlham; Ruh; Təşviq",
      "meaning_en": "Inspiration; Spirit; Encouragement",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["İlkin", "İlqar", "İlyas"],
      "popularity": 79,
      "viewCount": 0
    },
    {
      "id": 203,
      "name": "Jalə",
      "name_en": "Jala",
      "meaning": "Şeh; Təravət; Gözəllik",
      "meaning_en": "Dew; Freshness; Beauty",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Jahan", "Jamil", "Jəmilə"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 204,
      "name": "Jahan",
      "name_en": "Jahan",
      "meaning": "Dünya; Kainat; Aləm",
      "meaning_en": "World; Universe; Realm",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Jalə", "Jamil", "Jəmilə"],
      "popularity": 66,
      "viewCount": 0
    },
    {
      "id": 205,
      "name": "Jamil",
      "name_en": "Jamil",
      "meaning": "Gözəl; Yaraşıqlı; Şirin",
      "meaning_en": "Beautiful; Handsome; Sweet",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Jalə", "Jahan", "Jəmilə"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 206,
      "name": "Jəmilə",
      "name_en": "Jamila",
      "meaning": "Gözəl; Yaraşıqlı; Şirin",
      "meaning_en": "Beautiful; Handsome; Sweet",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Jalə", "Jahan", "Jamil"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 207,
      "name": "Kəmaləddin",
      "name_en": "Kamaladdin",
      "meaning": "Dinin kamillığı; Mükəmməl; Uca",
      "meaning_en": "Perfection of religion; Perfect; Exalted",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Kərim", "Kamil", "Kənan"],
      "popularity": 67,
      "viewCount": 0
    },
    {
      "id": 208,
      "name": "Ləyla",
      "name_en": "Layla",
      "meaning": "Gecə; Qaranlıq; Sirli",
      "meaning_en": "Night; Darkness; Mysterious",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Leyla", "Ləman", "Lalə"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 209,
      "name": "Məhərrəm",
      "name_en": "Muharram",
      "meaning": "Müqəddəs; Toxunulmaz; Uca",
      "meaning_en": "Sacred; Inviolable; Exalted",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Məhəmməd", "Məlik", "Məhəbbət"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 210,
      "name": "Nəsibə",
      "name_en": "Nasiba",
      "meaning": "Nəsib; Qismət; Tale",
      "meaning_en": "Destiny; Fate; Fortune",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Nəzakət", "Nəfisə", "Nəcibə"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 211,
      "name": "Eldəniz",
      "name_en": "Eldeniz",
      "meaning": "Elin dənizi; Genişlik, bolluq; Güc, qüdrət",
      "meaning_en": "Sea of the people; Vastness, abundance; Power, might",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Elvin", "Elnur", "Elçin"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 212,
      "name": "Hüsnü",
      "name_en": "Husnu",
      "meaning": "Gözəl, yaraşıqlı; Xoş, yaxşı; Əxlaqlı, fəzilətli",
      "meaning_en": "Beautiful, handsome; Pleasant, good; Moral, virtuous",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Həsən", "Hüseyn", "Həmid"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 213,
      "name": "Sevil",
      "name_en": "Sevil",
      "meaning": "Sevilən, məhəbbətli; Xoşbəxt, şən; Ürəyəyatan, cazibədar",
      "meaning_en": "Beloved, affectionate; Happy, cheerful; Appealing, charming",
      "gender": "qız",
      "origin": "azərbaycan",
      "similar": ["Səbinə", "Səidə", "Səmirə"],
      "popularity": 80,
      "viewCount": 0
    },
    {
      "id": 214,
      "name": "Aynurə",
      "name_en": "Aynura",
      "meaning": "Ay nuru, ay işığı; Parlaq, işıqlı; Gözəl, zərif",
      "meaning_en": "Moonlight, moon glow; Bright, luminous; Beautiful, delicate",
      "gender": "qız",
      "origin": "türk",
      "similar": ["Aynur", "Aysel", "Ayla"],
      "popularity": 78,
      "viewCount": 0
    },
    {
      "id": 215,
      "name": "Fəridə",
      "name_en": "Farida",
      "meaning": "Yeganə, tək; Bənzərsiz, nadir; Qiymətli, dəyərli",
      "meaning_en": "Unique, single; Unparalleled, rare; Precious, valuable",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Fidan", "Firəngiz", "Feridə"],
      "popularity": 85,
      "viewCount": 0
    },
    {
      "id": 216,
      "name": "Nərmin",
      "name_en": "Narmin",
      "meaning": "Nazik, zərif; Yumşaq, incə; Gözəl, xoş",
      "meaning_en": "Delicate, graceful; Soft, tender; Beautiful, pleasant",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Nərgiz", "Nəzrin", "Nigar"],
      "popularity": 79,
      "viewCount": 0
    },
    {
      "id": 217,
      "name": "Rəna",
      "name_en": "Rana",
      "meaning": "Rəngli, parlaq; Gözəl, cazibədar; Şən, sevincli",
      "meaning_en": "Colorful, bright; Beautiful, charming; Cheerful, joyful",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Röya", "Reyhan", "Rəvanə"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 218,
      "name": "Səbinə",
      "name_en": "Sabina",
      "meaning": "Səhər küləyi; Təmiz, saf; Zərif, incə",
      "meaning_en": "Morning breeze; Pure, clean; Delicate, tender",
      "gender": "qız",
      "origin": "azərbaycan",
      "similar": ["Səidə", "Səkinə", "Səmirə"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 219,
      "name": "Təranə",
      "name_en": "Tarana",
      "meaning": "Mahnı, nəğmə; Musiqi, avaz; Şirin, xoş",
      "meaning_en": "Song, melody; Music, tune; Sweet, pleasant",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Turalə", "Təhminə", "Tərlan"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 220,
      "name": "Ülviyyə",
      "name_en": "Ulviyya",
      "meaning": "Uca, yüksək; Dəyərli, əzəmətli; Müqəddəs, pak",
      "meaning_en": "Exalted, high; Valuable, majestic; Sacred, pure",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Ülkər", "Ümidə", "Ürfanə"],
      "popularity": 67,
      "viewCount": 0
    },
    {
      "id": 221,
      "name": "Zəhra",
      "name_en": "Zahra",
      "meaning": "Parlaq, işıqlı; Gözəl, nurani; Çiçək açan",
      "meaning_en": "Bright, luminous; Beautiful, radiant; Blooming",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Zərifə", "Zəminə", "Zülalə"],
      "popularity": 80,
      "viewCount": 0
    },
    {
      "id": 222,
      "name": "Əfsanə",
      "name_en": "Afshana",
      "meaning": "Nağıl, hekayə; Rəvayət, əfsanə; Gözəl, sirli",
      "meaning_en": "Tale, story; Legend, myth; Beautiful, mysterious",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Əsmə", "Əzizə", "Əminə"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 223,
      "name": "Məlahət",
      "name_en": "Malahat",
      "meaning": "Gözəllik, zəriflik; Cazibə, şirinlik; Xoşagələn, incə",
      "meaning_en": "Beauty, grace; Charm, sweetness; Pleasant, delicate",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Məryəm", "Mələk", "Mehriban"],
      "popularity": 78,
      "viewCount": 0
    },
    {
      "id": 224,
      "name": "Şəbnəm",
      "name_en": "Shabnam",
      "meaning": "Gecə çiyi; Sərin, təravətli; Saf, təmiz",
      "meaning_en": "Night dew; Cool, fresh; Pure, clean",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Şəhla", "Şəfəq", "Şəkər"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 225,
      "name": "Ağabəy",
      "name_en": "Agabey",
      "meaning": "Böyük bəy, hörmətli ağa; Lider, rəhbər; Nüfuzlu, hörmətli",
      "meaning_en": "Great bey, respected master; Leader, chief; Influential, respected",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Əli", "Əmir", "Əkbər"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 226,
      "name": "Cəmil",
      "name_en": "Jamil",
      "meaning": "Gözəl, yaraşıqlı; Şirin, xoş; Cazibədar, sevimli",
      "meaning_en": "Beautiful, handsome; Sweet, pleasant; Charming, beloved",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Cavid", "Cavad", "Camal"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 227,
      "name": "Fərhad",
      "name_en": "Farhad",
      "meaning": "Xoşbəxt, sevincli; Şirin, məhəbbətli; Qəhrəman, igid",
      "meaning_en": "Happy, joyful; Sweet, loving; Heroic, brave",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Fərid", "Fəxri", "Fəzil"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 228,
      "name": "İlqar",
      "name_en": "Ilgar",
      "meaning": "Elin qəhrəmanı; Güclü, igid; Sözündə duran",
      "meaning_en": "Hero of the people; Strong, brave; Keeping one's word",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["İlkin", "İlham", "İlyas"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 229,
      "name": "Kamran",
      "name_en": "Kamran",
      "meaning": "Uğurlu, bəxtiyar; Xoşbəxt, sevincli; Məqsədinə çatan",
      "meaning_en": "Successful, fortunate; Happy, joyful; Achieving one's goal",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Kamil", "Kərim", "Kənan"],
      "popularity": 78,
      "viewCount": 0
    },
    {
      "id": 230,
      "name": "Namiq",
      "name_en": "Namiq",
      "meaning": "Məktub yazan; Yazıçı, şair; Danışan, natiq",
      "meaning_en": "Letter writer; Author, poet; Speaker, orator",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Nəsir", "Nəbi", "Nəzim"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 231,
      "name": "Rəşid",
      "name_en": "Rashid",
      "meaning": "Doğru yol tapan; Ağıllı, müdrik; Hidayət edən",
      "meaning_en": "One who finds the right path; Intelligent, wise; Guiding",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Rəşad", "Rəsul", "Rəfiq"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 232,
      "name": "Teymur",
      "name_en": "Teymur",
      "meaning": "Dəmir kimi möhkəm; Güclü, dözümlü; Qəhrəman, igid",
      "meaning_en": "Strong as iron; Powerful, resilient; Heroic, brave",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Tural", "Turan", "Turxan"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 233,
      "name": "Vüqar",
      "name_en": "Vugar",
      "meaning": "Qürur, əzəmət; Hörmət, ləyaqət; Uca, yüksək",
      "meaning_en": "Pride, majesty; Respect, dignity; Exalted, high",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Vüsal", "Vəli", "Vaqif"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 234,
      "name": "Zaur",
      "name_en": "Zaur",
      "meaning": "Ziyarət edən; Gəzən, səyyah; Açıq, səmimi",
      "meaning_en": "Visitor; Wanderer, traveler; Open, sincere",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Zahid", "Zəfər", "Zakir"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 235,
      "name": "Ənvər",
      "name_en": "Anvar",
      "meaning": "Çox nurlu, çox işıqlı; Parlaq, gözəl; Aydın, aydınlıq",
      "meaning_en": "Very radiant, very luminous; Bright, beautiful; Clear, clarity",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Əli", "Əmir", "Əkbər"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 236,
      "name": "Şahin",
      "name_en": "Shahin",
      "meaning": "Şahin quşu; Cəsur, igid; Sürətli, cəld",
      "meaning_en": "Falcon bird; Brave, valiant; Fast, agile",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Şəhriyar", "Şəmsi", "Şamil"],
      "popularity": 81,
      "viewCount": 0
    },
    {
      "id": 237,
      "name": "Cavidan",
      "name_en": "Javidan",
      "meaning": "Əbədi, sonsuz; Daimi, ölməz; Uzunömürlü",
      "meaning_en": "Eternal, endless; Permanent, immortal; Long-lived",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Cavid", "Cavad", "Camal"],
      "popularity": 79,
      "viewCount": 0
    },
    {
      "id": 238,
      "name": "Elşad",
      "name_en": "Elshad",
      "meaning": "Elin şadlığı, xalqın sevinci; Şən, xoşbəxt; Sevincli, bəxtiyar",
      "meaning_en": "Joy of the people, happiness of the nation; Cheerful, happy; Joyful, fortunate",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Elvin", "Elnur", "Elçin"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 239,
      "name": "Fidanə",
      "name_en": "Fidana",
      "meaning": "Gənc ağac, fidan; Körpə, cavan; Təzə, yeni",
      "meaning_en": "Young tree, sapling; Infant, young; Fresh, new",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Fidan", "Firəngiz", "Feridə"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 240,
      "name": "Gülzar",
      "name_en": "Gulzar",
      "meaning": "Gül bağı, gülistan; Gözəl yer, cənnət; Çiçəkli, bəzəkli",
      "meaning_en": "Rose garden, flower garden; Beautiful place, paradise; Flowery, adorned",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Gülnar", "Gülşən", "Gülər"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 241,
      "name": "Həcər",
      "name_en": "Hajar",
      "meaning": "Daş, möhkəm; Güclü, dözümlü; Səbirli, dözümlü",
      "meaning_en": "Stone, firm; Strong, resilient; Patient, enduring",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Həbibə", "Hədi", "Həlimə"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 242,
      "name": "İlhamə",
      "name_en": "Ilhama",
      "meaning": "İlham verən; Ruhlandıran, təşviq edən; Yaradıcı, istedadlı",
      "meaning_en": "Inspiring; Encouraging, motivating; Creative, talented",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["İlahə", "İradə", "İsmət"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 243,
      "name": "Könül",
      "name_en": "Konul",
      "meaning": "Ürək, qəlb; Duyğu, hiss; Məhəbbət, sevgi",
      "meaning_en": "Heart, soul; Feeling, emotion; Affection, love",
      "gender": "qız",
      "origin": "azərbaycan",
      "similar": ["Kəmalə", "Kəndə", "Kərimə"],
      "popularity": 78,
      "viewCount": 0
    },
    {
      "id": 244,
      "name": "Lalə",
      "name_en": "Lala",
      "meaning": "Çiçək adı; Qırmızı, gözəl; Zərif, incə",
      "meaning_en": "Flower name; Red, beautiful; Delicate, tender",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Ləman", "Leyla", "Lətifə"],
      "popularity": 79,
      "viewCount": 0
    },
    {
      "id": 245,
      "name": "Mədinə",
      "name_en": "Madina",
      "meaning": "Şəhər; Müqəddəs, pak; Dinc, sakit",
      "meaning_en": "City; Sacred, pure; Peaceful, calm",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Məryəm", "Mələk", "Mehriban"],
      "popularity": 82,
      "viewCount": 0
    },
    {
      "id": 246,
      "name": "Nərgiz",
      "name_en": "Nargiz",
      "meaning": "Çiçək adı; Gözəl, ətirli; Zərif, incə",
      "meaning_en": "Flower name; Beautiful, fragrant; Delicate, tender",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Nəzrin", "Nigar", "Nərmin"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 247,
      "name": "Pərvanə",
      "name_en": "Parvana",
      "meaning": "Kəpənək; İşığa can atan; Sevimli, zərif",
      "meaning_en": "Butterfly; Yearning for light; Beloved, delicate",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Pəri", "Pərvin", "Pənah"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 248,
      "name": "Röya",
      "name_en": "Roya",
      "meaning": "Yuxu, arzu; Xəyal, fantaziya; Gözəl, sirli",
      "meaning_en": "Dream, wish; Imagination, fantasy; Beautiful, mysterious",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Reyhan", "Rəna", "Rəvanə"],
      "popularity": 90,
      "viewCount": 0
    },
    {
      "id": 249,
      "name": "Səadət",
      "name_en": "Saadat",
      "meaning": "Xoşbəxtlik, səadət; Uğur, müvəffəqiyyət; Bəxtiyarlıq",
      "meaning_en": "Happiness, bliss; Success, achievement; Fortune",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Səbinə", "Səidə", "Səkinə"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 250,
      "name": "Təhminə",
      "name_en": "Tahmina",
      "meaning": "Güclü, qəhrəman; İgid, cəsur; Möhkəm, dözümlü",
      "meaning_en": "Strong, heroic; Brave, courageous; Firm, resilient",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Təranə", "Tərlan", "Turalə"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 251,
      "name": "Ülkər",
      "name_en": "Ulkar",
      "meaning": "Ulduz qrupu; Parlaq, işıqlı; Gözəl, zərif",
      "meaning_en": "Star cluster; Bright, luminous; Beautiful, delicate",
      "gender": "qız",
      "origin": "türk",
      "similar": ["Ülviyyə", "Ümidə", "Ürfanə"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 252,
      "name": "Vəfa",
      "name_en": "Vafa",
      "meaning": "Sədaqət, vəfadarlıq; Etibar, güvən; Düzgünlük, dürüstlük",
      "meaning_en": "Loyalty, faithfulness; Trust, reliance; Correctness, honesty",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Vəsilə", "Vəcihə", "Vəliyyə"],
      "popularity": 66,
      "viewCount": 0
    },
    {
      "id": 253,
      "name": "Yasəmən",
      "name_en": "Yasaman",
      "meaning": "Çiçək adı; Ətirli, xoş qoxulu; Saf, təmiz",
      "meaning_en": "Flower name; Fragrant, pleasant-smelling; Pure, clean",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Yusif", "Yaşar", "Yaqub"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 254,
      "name": "Zümrüd",
      "name_en": "Zumrud",
      "meaning": "Qiymətli daş; Gözəl, parlaq; Nadir, bənzərsiz",
      "meaning_en": "Precious stone; Beautiful, bright; Rare, unique",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Zəhra", "Zərifə", "Zülalə"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 255,
      "name": "Əminə",
      "name_en": "Amina",
      "meaning": "Etibarlı, güvənli; Sadiq, vəfalı; Dürüst, doğru",
      "meaning_en": "Trustworthy, reliable; Loyal, faithful; Honest, true",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Əsmə", "Əzizə", "Əfsanə"],
      "popularity": 81,
      "viewCount": 0
    },
    {
      "id": 256,
      "name": "Şəhla",
      "name_en": "Shahla",
      "meaning": "Göz gözəlliyi; Qara gözlü; Cazibədar, şirin",
      "meaning_en": "Beauty of the eye; Dark-eyed; Charming, sweet",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Şəbnəm", "Şəfəq", "Şəkər"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 257,
      "name": "Bəhruz",
      "name_en": "Behruz",
      "meaning": "Xoşbəxt gün; Uğurlu, bəxtiyar; Sevincli, şən",
      "meaning_en": "Happy day; Successful, fortunate; Joyful, cheerful",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Bəxtiyar", "Bəhlul", "Bəşir"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 258,
      "name": "Ceyhun",
      "name_en": "Jeyhun",
      "meaning": "Dünya çayı; Böyük çay; Bərəkətli, bolluq",
      "meaning_en": "World river; Great river; Fertile, abundant",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Cəlal", "Cəmil", "Cəfər"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 259,
      "name": "Dadaş",
      "name_en": "Dadash",
      "meaning": "Böyük qardaş; Dost, yoldaş; Hörmətli, sevimli",
      "meaning_en": "Big brother; Friend, companion; Respected, beloved",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Əli", "Əmir", "Əkbər"],
      "popularity": 65,
      "viewCount": 0
    },
    {
      "id": 260,
      "name": "Eldar",
      "name_en": "Eldar",
      "meaning": "Elin hökmdarı; Lider, rəhbər; Güclü, qüdrətli",
      "meaning_en": "Ruler of the people; Leader, chief; Strong, powerful",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Elvin", "Elnur", "Elçin"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 261,
      "name": "Fəxrəddin",
      "name_en": "Fakhreddin",
      "meaning": "Dinin fəxri; Şərəfli, hörmətli; Müqəddəs, uca",
      "meaning_en": "Pride of religion; Honorable, respected; Sacred, exalted",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Fəxri", "Fəzil", "Fərid"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 262,
      "name": "Gündüz",
      "name_en": "Gunduz",
      "meaning": "Günəş, işıq; Aydınlıq, parlaqlıq; Xoşbəxt, sevincli",
      "meaning_en": "Sun, light; Brightness, radiance; Happy, joyful",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Günay", "Günel", "Gülər"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 263,
      "name": "Həmid",
      "name_en": "Hamid",
      "meaning": "Həmd edən, tərifləyən; Şükür edən; Mərhəmətli, şəfqətli",
      "meaning_en": "Praiser, commender; Grateful; Merciful, compassionate",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Həsən", "Hüseyn", "Həkim"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 264,
      "name": "İlkin",
      "name_en": "Ilkin",
      "meaning": "İlk, əvvəl; Başlanğıc, təməl; Öncül, lider",
      "meaning_en": "First, initial; Beginning, foundation; Pioneer, leader",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["İlqar", "İlham", "İlyas"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 265,
      "name": "Kənan",
      "name_en": "Kanan",
      "meaning": "Qədim ölkə adı; Müqəddəs, uca; Bərəkətli, zəngin",
      "meaning_en": "Ancient country name; Sacred, exalted; Fertile, rich",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Kərim", "Kamil", "Kamal"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 266,
      "name": "Lətif",
      "name_en": "Latif",
      "meaning": "Zərif, nazik; Yumşaq, incə; Xoş, lütfkar",
      "meaning_en": "Graceful, delicate; Soft, tender; Pleasant, kind",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ləti", "Ləman", "Lalə"],
      "popularity": 65,
      "viewCount": 0
    },
    {
      "id": 267,
      "name": "Məmməd",
      "name_en": "Mammad",
      "meaning": "Təriflənən, həmd olunan; Uca, böyük; Müqəddəs, xeyirli",
      "meaning_en": "Praised, commended; Exalted, great; Sacred, beneficial",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Məhəmməd", "Məlik", "Məhərrəm"],
      "popularity": 90,
      "viewCount": 0
    },
    {
      "id": 268,
      "name": "Nəbi",
      "name_en": "Nabi",
      "meaning": "Peyğəmbər, elçi; Xəbərçi, müjdəçi; Müqəddəs, uca",
      "meaning_en": "Prophet, messenger; Bearer of news, harbinger; Sacred, exalted",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Namiq", "Nəsir", "Nəzim"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 269,
      "name": "Oruc",
      "name_en": "Oruj",
      "meaning": "Oruc tutan; Dindar, inanclı; Səbirli, dözümlü",
      "meaning_en": "Fasting; Pious, believing; Patient, resilient",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Orxan", "Osman", "Oqtay"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 270,
      "name": "Pənah",
      "name_en": "Panah",
      "meaning": "Sığınacaq, qoruyucu; Himayədar, dəstək; Xilaskar, nicat",
      "meaning_en": "Shelter, protector; Patron, support; Savior, salvation",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Pəri", "Pərvanə", "Pərvin"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 271,
      "name": "Qədir",
      "name_en": "Qadir",
      "meaning": "Qüdrətli, güclü; Əzəmətli, uca; Dəyərli, qiymətli",
      "meaning_en": "Powerful, strong; Majestic, exalted; Valuable, precious",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Qasım", "Qəhrəman", "Qurban"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 272,
      "name": "Ramil",
      "name_en": "Ramil",
      "meaning": "Atıcı, nişançı; Dəqiq, hədəfə vuran; Cəsur, igid",
      "meaning_en": "Archer, marksman; Accurate, hitting the target; Brave, valiant",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ruslan", "Rüstəm", "Rafiq"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 273,
      "name": "Sənan",
      "name_en": "Sanar",
      "meaning": "Nizə ucu; Kəskin, iti; Ağıllı, zəkalı",
      "meaning_en": "Spearhead; Sharp, keen; Intelligent, clever",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Samir", "Səmər", "Səbuhi"],
      "popularity": 67,
      "viewCount": 0
    },
    {
      "id": 274,
      "name": "Tərlan",
      "name_en": "Tarlan",
      "meaning": "Qartal; Güclü, cəsur; Azad, sərbəst",
      "meaning_en": "Eagle; Strong, brave; Free, independent",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Tural", "Turan", "Turxan"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 275,
      "name": "Ümid",
      "name_en": "Umid",
      "meaning": "Ümid, arzu; Gələcək, perspektiv; Müsbət, nikbin",
      "meaning_en": "Hope, wish; Future, perspective; Positive, optimistic",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ülvi", "Ürfan", "Üzeyir"],
      "popularity": 84,
      "viewCount": 0
    },
    {
      "id": 276,
      "name": "Vaqif",
      "name_en": "Vagif",
      "meaning": "Bilən, xəbərdar; Ağıllı, müdrik; Anlayan, dərk edən",
      "meaning_en": "Knowing, aware; Intelligent, wise; Understanding, comprehending",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Vüsal", "Vəli", "Vasif"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 277,
      "name": "Yaşar",
      "name_en": "Yashar",
      "meaning": "Yaşayan, həyat sürən; Uzunömürlü; Canlı, dinamik",
      "meaning_en": "Living, enduring life; Long-lived; Lively, dynamic",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Yusif", "Yaqub", "Yasəmən"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 278,
      "name": "Zahid",
      "name_en": "Zahid",
      "meaning": "Dindar, təqvalı; Zəhmətkeş, çalışqan; Səbirli, dözümlü",
      "meaning_en": "Pious, devout; Hardworking, diligent; Patient, resilient",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Zaur", "Zəfər", "Zakir"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 279,
      "name": "Ədalət",
      "name_en": "Adalat",
      "meaning": "Ədalət, haqq; Düzgünlük, dürüstlük; Haqqsevər",
      "meaning_en": "Justice, right; Correctness, honesty; Lover of justice",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Əhməd", "Əsgər", "Əziz"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 280,
      "name": "Şəhriyar",
      "name_en": "Shahriyar",
      "meaning": "Şəhər hökmdarı; Böyük, əzəmətli; Lider, başçı",
      "meaning_en": "Ruler of the city; Great, majestic; Leader, chief",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Şahin", "Şamil", "Şəmsi"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 281,
      "name": "Cahan",
      "name_en": "Jahan",
      "meaning": "Dünya, kainat; Aləm, genişlik; Böyük, əhatəli",
      "meaning_en": "World, universe; Realm, vastness; Great, comprehensive",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Cahangir", "Cahandar", "Cahanşah"],
      "popularity": 67,
      "viewCount": 0
    },
    {
      "id": 282,
      "name": "Dərya",
      "name_en": "Darya",
      "meaning": "Dəniz, okean; Böyük, geniş; Bolluq, zənginlik",
      "meaning_en": "Sea, ocean; Great, vast; Abundance, richness",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Dəyanət", "Dəmət", "Dəstə"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 283,
      "name": "Fərəh",
      "name_en": "Farah",
      "meaning": "Sevinc, şadlıq; Xoşbəxtlik, bəxtiyarlıq; Şən, gülərüz",
      "meaning_en": "Joy, gladness; Happiness, fortune; Cheerful, smiling",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Fəxriyyə", "Fəzilə", "Fərda"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 284,
      "name": "Gülbəniz",
      "name_en": "Gulbaniz",
      "meaning": "Gül üzlü; Gözəl, şirin; Zərif, incə",
      "meaning_en": "Rose-faced; Beautiful, sweet; Delicate, tender",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Gülbahar", "Gülçin", "Güldan"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 285,
      "name": "Həbibə",
      "name_en": "Habiba",
      "meaning": "Sevimli, əziz; Yaxın, dost; Məhəbbətli",
      "meaning_en": "Beloved, dear; Close, friend; Affectionate",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Həbib", "Həcər", "Hədi"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 286,
      "name": "Jalə",
      "name_en": "Jala",
      "meaning": "Şeh, çiy; Təravət, təzəlik; Gözəllik, zəriflik",
      "meaning_en": "Dew, moisture; Freshness, newness; Beauty, grace",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Jahan", "Jamil", "Jəmilə"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 287,
      "name": "Kəmalə",
      "name_en": "Kamala",
      "meaning": "Kamil, mükəmməl; Tam, bitkin; Fəzilətli, əxlaqlı",
      "meaning_en": "Perfect, complete; Whole, mature; Virtuous, moral",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Kamil", "Kənan", "Kərim"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 288,
      "name": "Ləman",
      "name_en": "Leman",
      "meaning": "Parlaqlıq, işıq; Zərif, incə; Gözəl, cazibədar",
      "meaning_en": "Brightness, light; Graceful, delicate; Beautiful, charming",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Leyla", "Lalə", "Lətifə"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 289,
      "name": "Məryəm",
      "name_en": "Maryam",
      "meaning": "Müqəddəs, pakizə; Təmiz, saf; Dindar, inanclı",
      "meaning_en": "Sacred, pure; Clean, chaste; Pious, believing",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Mələk", "Mehriban", "Məlahət"],
      "popularity": 89,
      "viewCount": 0
    },
    {
      "id": 290,
      "name": "Nəzakət",
      "name_en": "Nazakat",
      "meaning": "Nəzakət, incəlik; Zəriflik, lütfkarlıq; Xoşrəftar",
      "meaning_en": "Politeness, delicacy; Grace, kindness; Well-mannered",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Nərgiz", "Nəzrin", "Nərmin"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 291,
      "name": "Pərvin",
      "name_en": "Parvin",
      "meaning": "Ulduz qrupu; Parlaq, işıqlı; Gözəl, zərif",
      "meaning_en": "Star cluster; Bright, luminous; Beautiful, delicate",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Pəri", "Pərvanə", "Pənah"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 292,
      "name": "Qəmər",
      "name_en": "Qamar",
      "meaning": "Ay; Parlaq, işıqlı; Gözəl, nurani",
      "meaning_en": "Moon; Bright, luminous; Beautiful, radiant",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Qəmzə", "Qönçə", "Qumral"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 293,
      "name": "Səkinə",
      "name_en": "Sakina",
      "meaning": "Sakit, dinc; Rahat, hüzurlu; Mülayim, xoş",
      "meaning_en": "Calm, peaceful; Comfortable, serene; Gentle, pleasant",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Səbinə", "Səidə", "Səmirə"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 294,
      "name": "Tünzalə",
      "name_en": "Tunzala",
      "meaning": "Tunc kimi; Möhkəm, dözümlü; Gözəl, parlaq",
      "meaning_en": "Like bronze; Strong, resilient; Beautiful, bright",
      "gender": "qız",
      "origin": "azərbaycan",
      "similar": ["Təranə", "Təhminə", "Turalə"],
      "popularity": 65,
      "viewCount": 0
    },
    {
      "id": 295,
      "name": "Vəsilə",
      "name_en": "Vasile",
      "meaning": "Vasitə, yol; Əlaqə, rabitə; Səbəb, bəhanə",
      "meaning_en": "Means, way; Connection, link; Reason, pretext",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Vəfa", "Vəcihə", "Vəliyyə"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 296,
      "name": "Zərifə",
      "name_en": "Zarifa",
      "meaning": "Zərif, nazik; Gözəl, incə; Xoş, lütfkar",
      "meaning_en": "Graceful, delicate; Beautiful, tender; Pleasant, kind",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Zəhra", "Zəminə", "Zülalə"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 297,
      "name": "Əzizə",
      "name_en": "Aziza",
      "meaning": "Əziz, sevimli; Dəyərli, qiymətli; Hörmətli, nüfuzlu",
      "meaning_en": "Dear, beloved; Valuable, precious; Respected, influential",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Əsmə", "Əfsanə", "Əminə"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 298,
      "name": "Şəfəq",
      "name_en": "Shafaq",
      "meaning": "Şəfəq vaxtı, səhər; Qızartı, işıq; Təzə, yeni",
      "meaning_en": "Dawn, morning; Blush, light; Fresh, new",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Şəhla", "Şəbnəm", "Şəkər"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 299,
      "name": "Bəxtiyar",
      "name_en": "Bakhtiyar",
      "meaning": "Xoşbəxt, bəxtli; Uğurlu, müvəffəqiyyətli; Sevincli, şən",
      "meaning_en": "Happy, fortunate; Successful, prosperous; Joyful, cheerful",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Bəhram", "Bəhlul", "Bəşir"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 300,
      "name": "Cəlal",
      "name_en": "Jalal",
      "meaning": "Böyüklük, əzəmət; Şan, şöhrət; Hörmət, ləyaqət",
      "meaning_en": "Greatness, majesty; Glory, fame; Respect, dignity",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ceyhun", "Cəmil", "Cəfər"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 301,
      "name": "Dəmir",
      "name_en": "Damir",
      "meaning": "Dəmir; Möhkəm, güclü; Dözümlü, səbirli",
      "meaning_en": "Iron; Firm, strong; Resilient, patient",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Teymur", "Polad", "Dəmirçi"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 302,
      "name": "Elxan",
      "name_en": "Elkhan",
      "meaning": "Elin xanı, xalqın hökmdarı; Lider, başçı; Güclü, qüdrətli",
      "meaning_en": "Khan of the people, ruler of the nation; Leader, chief; Strong, powerful",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Elvin", "Elnur", "Elçin"],
      "popularity": 78,
      "viewCount": 0
    },
    {
      "id": 303,
      "name": "Fikrət",
      "name_en": "Fikrat",
      "meaning": "Fikir, düşüncə; Ağıllı, müdrik; Dərrakəli, zəkalı",
      "meaning_en": "Thought, idea; Intelligent, wise; Perceptive, clever",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Fərid", "Fəxri", "Fəzil"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 304,
      "name": "Həsrət",
      "name_en": "Hasrat",
      "meaning": "Həsrət, intizar; Arzu, istək; Sevimli, əziz",
      "meaning_en": "Longing, yearning; Desire, wish; Beloved, dear",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Həmid", "Həkim", "Hüseyn"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 305,
      "name": "Kərim",
      "name_en": "Karim",
      "meaning": "Səxavətli, cömərd; Mərhəmətli, şəfqətli; Dəyərli, qiymətli",
      "meaning_en": "Generous, charitable; Merciful, compassionate; Valuable, precious",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Kamil", "Kamal", "Kənan"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 306,
      "name": "Nərminə",
      "name_en": "Narmina",
      "meaning": "Nazik, zərif; Yumşaq, incə; Gözəl, xoş",
      "meaning_en": "Delicate, graceful; Soft, tender; Beautiful, pleasant",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Nərmin", "Nərgiz", "Nigar"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 307,
      "name": "Rəvan",
      "name_en": "Ravan",
      "meaning": "Axan, gedən; Səyyah, gəzən; Ruhən azad",
      "meaning_en": "Flowing, going; Traveler, wanderer; Spiritually free",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Rəşad", "Rəsul", "Rəfiq"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 308,
      "name": "Ayan",
      "name_en": "Ayan",
      "meaning": "Aydın, parlaq; Gələcək, ümid; İşıqlı, nurani",
      "meaning_en": "Clear, bright; Future, hope; Luminous, radiant",
      "gender": "qız",
      "origin": "türk",
      "similar": ["Aysel", "Ayla", "Aynur"],
      "popularity": 88,
      "viewCount": 0
    },
    {
      "id": 309,
      "name": "Cəmilə",
      "name_en": "Jamila",
      "meaning": "Gözəl, yaraşıqlı; Şirin, xoş; Cazibədar, sevimli",
      "meaning_en": "Beautiful, handsome; Sweet, pleasant; Charming, beloved",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Cəmil", "Dilbər", "Ləman"],
      "popularity": 85,
      "viewCount": 0
    },
    {
      "id": 310,
      "name": "Dəniz",
      "name_en": "Deniz",
      "meaning": "Dəniz; Genişlik, bolluq; Azadlıq, sərbəstlik",
      "meaning_en": "Sea; Vastness, abundance; Freedom, liberty",
      "gender": "qız",
      "origin": "türk",
      "similar": ["Dərya", "Su", "Sahil"],
      "popularity": 90,
      "viewCount": 0
    },
    {
      "id": 311,
      "name": "Elnarə",
      "name_en": "Elnara",
      "meaning": "Elin nuru, xalqın işığı; Parlaq, aydın; Gözəl, nurani",
      "meaning_en": "Light of the people, illumination of the nation; Bright, clear; Beautiful, radiant",
      "gender": "qız",
      "origin": "azərbaycan",
      "similar": ["Elnur", "Elşən", "Elçin"],
      "popularity": 87,
      "viewCount": 0
    },
    {
      "id": 312,
      "name": "Fatimə",
      "name_en": "Fatima",
      "meaning": "Ayıran, kəsən; Pakizə, təmiz; Dindar, müqəddəs",
      "meaning_en": "One who weans, cuts off; Pure, clean; Pious, sacred",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Zəhra", "Məryəm", "Xədicə"],
      "popularity": 95,
      "viewCount": 0
    },
    {
      "id": 313,
      "name": "Günay",
      "name_en": "Gunay",
      "meaning": "Günəş və ay; İşıqlı, parlaq; Gözəl, nurani",
      "meaning_en": "Sun and moon; Luminous, bright; Beautiful, radiant",
      "gender": "qız",
      "origin": "türk",
      "similar": ["Günel", "Aynur", "Ayşən"],
      "popularity": 92,
      "viewCount": 0
    },
    {
      "id": 314,
      "name": "Xədicə",
      "name_en": "Khadija",
      "meaning": "Vaxtından əvvəl doğulan; Hörmətli, dəyərli; Dindar, müqəddəs",
      "meaning_en": "Born prematurely; Respected, valuable; Pious, sacred",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Fatimə", "Zəhra", "Aişə"],
      "popularity": 89,
      "viewCount": 0
    },
    {
      "id": 315,
      "name": "İnarə",
      "name_en": "Inara",
      "meaning": "Nar çiçəyi; Gözəl, zərif; Parlaq, işıqlı",
      "meaning_en": "Pomegranate flower; Beautiful, delicate; Bright, luminous",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Gülnar", "Lalə", "Nərgiz"],
      "popularity": 80,
      "viewCount": 0
    },
    {
      "id": 316,
      "name": "Kəmalə",
      "name_en": "Kamala",
      "meaning": "Kamil, mükəmməl; Tam, bitkin; Fəzilətli, əxlaqlı",
      "meaning_en": "Perfect, complete; Whole, mature; Virtuous, moral",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Kamil", "Kamal", "Kənan"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 317,
      "name": "Ləman",
      "name_en": "Leman",
      "meaning": "Parlaqlıq, işıq; Zərif, incə; Gözəl, cazibədar",
      "meaning_en": "Brightness, light; Graceful, delicate; Beautiful, charming",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Leyla", "Lalə", "Lətifə"],
      "popularity": 82,
      "viewCount": 0
    },
    {
      "id": 318,
      "name": "Nərmin",
      "name_en": "Narmin",
      "meaning": "Nazik, zərif; Yumşaq, incə; Gözəl, xoş",
      "meaning_en": "Delicate, graceful; Soft, tender; Beautiful, pleasant",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Nərgiz", "Nəzrin", "Nigar"],
      "popularity": 84,
      "viewCount": 0
    },
    {
      "id": 319,
      "name": "Səbinə",
      "name_en": "Sabina",
      "meaning": "Səhər küləyi; Təmiz, saf; Zərif, incə",
      "meaning_en": "Morning breeze; Pure, clean; Delicate, tender",
      "gender": "qız",
      "origin": "azərbaycan",
      "similar": ["Səidə", "Səkinə", "Səmirə"],
      "popularity": 81,
      "viewCount": 0
    },
    {
      "id": 320,
      "name": "Tünzalə",
      "name_en": "Tunzala",
      "meaning": "Tunc kimi; Möhkəm, dözümlü; Gözəl, parlaq",
      "meaning_en": "Like bronze; Strong, resilient; Beautiful, bright",
      "gender": "qız",
      "origin": "azərbaycan",
      "similar": ["Təranə", "Təhminə", "Turalə"],
      "popularity": 78,
      "viewCount": 0
    },
    {
      "id": 321,
      "name": "Ülviyyə",
      "name_en": "Ulviyya",
      "meaning": "Uca, yüksək; Dəyərli, əzəmətli; Müqəddəs, pak",
      "meaning_en": "Exalted, high; Valuable, majestic; Sacred, pure",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Ülkər", "Ümidə", "Ürfanə"],
      "popularity": 79,
      "viewCount": 0
    },
    {
      "id": 322,
      "name": "Zərifə",
      "name_en": "Zarifa",
      "meaning": "Zərif, nazik; Gözəl, incə; Xoş, lütfkar",
      "meaning_en": "Graceful, delicate; Beautiful, tender; Pleasant, kind",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Zəhra", "Zəminə", "Zülalə"],
      "popularity": 80,
      "viewCount": 0
    },
    {
      "id": 323,
      "name": "Aytən",
      "name_en": "Ayten",
      "meaning": "Ay kimi parlaq; Gözəl, nurani; İşıqlı, aydın",
      "meaning_en": "Bright as the moon; Beautiful, radiant; Luminous, clear",
      "gender": "qız",
      "origin": "türk",
      "similar": ["Aysel", "Ayla", "Aynur"],
      "popularity": 86,
      "viewCount": 0
    },
    {
      "id": 324,
      "name": "Bahar",
      "name_en": "Bahar",
      "meaning": "Bahar fəsli; Təravət, təzəlik; Gözəllik, çiçəklənmə",
      "meaning_en": "Spring season; Freshness, newness; Beauty, blooming",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Gülbahar", "Bənövşə", "Lalə"],
      "popularity": 83,
      "viewCount": 0
    },
    {
      "id": 325,
      "name": "Ceyran",
      "name_en": "Jeyran",
      "meaning": "Ceyran; Zərif, incə; Gözəl, cəld",
      "meaning_en": "Gazelle; Graceful, delicate; Beautiful, agile",
      "gender": "qız",
      "origin": "türk",
      "similar": ["Maral", "Qəzəl", "Ceyhun"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 326,
      "name": "Dürdanə",
      "name_en": "Durdanə",
      "meaning": "Qiymətli inci; Dəyərli, nadir; Gözəl, parlaq",
      "meaning_en": "Precious pearl; Valuable, rare; Beautiful, bright",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Zümrüd", "Lalə", "Nərgiz"],
      "popularity": 79,
      "viewCount": 0
    },
    {
      "id": 327,
      "name": "Elza",
      "name_en": "Elza",
      "meaning": "Allahın andı; Nəcib, əsilzadə; Dəyərli, qiymətli",
      "meaning_en": "Oath of God; Noble, aristocratic; Valuable, precious",
      "gender": "qız",
      "origin": "alman",
      "similar": ["Elmira", "Elvira", "Elanur"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 328,
      "name": "Fidanə",
      "name_en": "Fidana",
      "meaning": "Gənc ağac, fidan; Körpə, cavan; Təzə, yeni",
      "meaning_en": "Young tree, sapling; Infant, young; Fresh, new",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Fidan", "Firəngiz", "Feridə"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 329,
      "name": "Gülçin",
      "name_en": "Gulchin",
      "meaning": "Gül toplayan; Seçilmiş, xüsusi; Gözəl, zərif",
      "meaning_en": "Rose picker; Chosen, special; Beautiful, delicate",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Gülnar", "Gülzar", "Gülər"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 330,
      "name": "Həlimə",
      "name_en": "Halima",
      "meaning": "Səbirli, dözümlü; Mülayim, xoşxasiyyət; Mərhəmətli, şəfqətli",
      "meaning_en": "Patient, resilient; Gentle, good-natured; Merciful, compassionate",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Həbibə", "Həcər", "Səkinə"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 331,
      "name": "İlahə",
      "name_en": "Ilaha",
      "meaning": "Tanrıça; Müqəddəs, ilahi; Gözəl, nurani",
      "meaning_en": "Goddess; Sacred, divine; Beautiful, radiant",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["İlhamə", "İradə", "İsmət"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 332,
      "name": "Kəmalə",
      "name_en": "Kamala",
      "meaning": "Kamil, mükəmməl; Tam, bitkin; Fəzilətli, əxlaqlı",
      "meaning_en": "Perfect, complete; Whole, mature; Virtuous, moral",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Kamil", "Kamal", "Kənan"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 333,
      "name": "Lətafət",
      "name_en": "Latafat",
      "meaning": "Zəriflik, incəlik; Gözəllik, cazibə; Xoşluq, lütfkarlıq",
      "meaning_en": "Grace, delicacy; Beauty, charm; Pleasantness, kindness",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Lətifə", "Ləman", "Lalə"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 334,
      "name": "Mətanət",
      "name_en": "Matanat",
      "meaning": "Dözümlülük, səbir; Möhkəmlik, qətiyyət; İradə, güc",
      "meaning_en": "Resilience, patience; Firmness, determination; Willpower, strength",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Səbirə", "İradə", "Dəyanət"],
      "popularity": 78,
      "viewCount": 0
    },
    {
      "id": 335,
      "name": "Nigar",
      "name_en": "Nigar",
      "meaning": "Sevimli, gözəl; Bəzək, zinət; Şirin, cazibədar",
      "meaning_en": "Beloved, beautiful; Ornament, adornment; Sweet, charming",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Nərgiz", "Nəzrin", "Nərmin"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 336,
      "name": "Pərişan",
      "name_en": "Parishan",
      "meaning": "Dağınıq, pərişan; Gözəl, cazibədar; Sirli, qeyri-adi",
      "meaning_en": "Disheveled, distressed; Beautiful, charming; Mysterious, unusual",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Pəri", "Pərvanə", "Pərvin"],
      "popularity": 65,
      "viewCount": 0
    },
    {
      "id": 337,
      "name": "Qönçə",
      "name_en": "Qoncha",
      "meaning": "Qönçə, tumurcuq; Gənc, təzə; Gözəl, zərif",
      "meaning_en": "Bud, sprout; Young, fresh; Beautiful, delicate",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Lalə", "Nərgiz", "Gül"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 338,
      "name": "Rəfiqə",
      "name_en": "Rafiqa",
      "meaning": "Yoldaş, dost; Sirdaş, sirr bilən; Yardımçı, dəstək",
      "meaning_en": "Companion, friend; Confidante, secret-keeper; Helper, support",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Rəfiq", "Səmirə", "Səidə"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 339,
      "name": "Səmayə",
      "name_en": "Samaya",
      "meaning": "Səma, göy; Uca, yüksək; İşıqlı, parlaq",
      "meaning_en": "Sky, heaven; Exalted, high; Luminous, bright",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Aynur", "Ülviyyə", "Zəhra"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 340,
      "name": "Təbriz",
      "name_en": "Tabriz",
      "meaning": "Təbriz şəhəri; Tarixi, qədim; Zəngin, bərəkətli",
      "meaning_en": "City of Tabriz; Historical, ancient; Rich, fertile",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Bakı", "Gəncə", "Şuşa"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 341,
      "name": "Ulduz",
      "name_en": "Ulduz",
      "meaning": "Ulduz; Parlaq, işıqlı; Gözəl, cazibədar",
      "meaning_en": "Star; Bright, luminous; Beautiful, charming",
      "gender": "qız",
      "origin": "türk",
      "similar": ["Ülkər", "Ay", "Günəş"],
      "popularity": 85,
      "viewCount": 0
    },
    {
      "id": 342,
      "name": "Vüsalə",
      "name_en": "Vusala",
      "meaning": "Qovuşma, birləşmə; Çatma, nailiyyət; Xoşbəxtlik, sevinc",
      "meaning_en": "Union, merging; Reaching, achievement; Happiness, joy",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Vüsal", "Vəfa", "Səadət"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 343,
      "name": "Yeganə",
      "name_en": "Yegana",
      "meaning": "Yeganə, tək; Bənzərsiz, nadir; Xüsusi, dəyərli",
      "meaning_en": "Unique, single; Unparalleled, rare; Special, valuable",
      "gender": "qız",
      "origin": "fars",
      "similar": ["Fəridə", "Nadirə", "Tək"],
      "popularity": 80,
      "viewCount": 0
    },
    {
      "id": 344,
      "name": "Zeynəb",
      "name_en": "Zaynab",
      "meaning": "Atasının zinəti; Gözəl, bəzəkli; Dəyərli, qiymətli",
      "meaning_en": "Father's adornment; Beautiful, adorned; Valuable, precious",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Zəhra", "Məryəm", "Fatimə"],
      "popularity": 93,
      "viewCount": 0
    },
    {
      "id": 345,
      "name": "Əsmər",
      "name_en": "Asmar",
      "meaning": "Qaraşın, tünd dərili; Gözəl, cazibədar; Şirin, xoş",
      "meaning_en": "Dark-skinned, dark-complexioned; Beautiful, charming; Sweet, pleasant",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Əsmə", "Nigar", "Şəhla"],
      "popularity": 82,
      "viewCount": 0
    },
    {
      "id": 346,
      "name": "Şəms",
      "name_en": "Shams",
      "meaning": "Günəş; Parlaq, işıqlı; Nurani, gözəl",
      "meaning_en": "Sun; Bright, luminous; Radiant, beautiful",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Günay", "Ay", "Ulduz"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 347,
      "name": "Ağacəfər",
      "name_en": "Agajafar",
      "meaning": "Böyük Cəfər; Hörmətli, nüfuzlu; Lider, başçı",
      "meaning_en": "Great Jafar; Respected, influential; Leader, chief",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Cəfər", "Ağabəy", "Əli"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 348,
      "name": "Bəhram",
      "name_en": "Bahram",
      "meaning": "Mars planeti; Güclü, qüvvətli; Qəhrəman, igid",
      "meaning_en": "Planet Mars; Strong, powerful; Heroic, brave",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Bəxtiyar", "Rüstəm", "Teymur"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 349,
      "name": "Cəsur",
      "name_en": "Jasur",
      "meaning": "Cəsur, igid; Qəhrəman, qoçaq; Qorxmaz, ürəkli",
      "meaning_en": "Brave, valiant; Heroic, courageous; Fearless, bold",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["İgid", "Qəhrəman", "Mübariz"],
      "popularity": 78,
      "viewCount": 0
    },
    {
      "id": 350,
      "name": "Davud",
      "name_en": "Davud",
      "meaning": "Sevimli, əziz; Peyğəmbər adı; Dindar, müqəddəs",
      "meaning_en": "Beloved, dear; Prophet's name; Pious, sacred",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Yusif", "İbrahim", "Musa"],
      "popularity": 85,
      "viewCount": 0
    },
    {
      "id": 351,
      "name": "Emin",
      "name_en": "Emin",
      "meaning": "Etibarlı, güvənli; Sadiq, vəfalı; Dürüst, doğru",
      "meaning_en": "Trustworthy, reliable; Loyal, faithful; Honest, true",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Emil", "Əmir", "Eldar"],
      "popularity": 88,
      "viewCount": 0
    },
    {
      "id": 352,
      "name": "Fərman",
      "name_en": "Farman",
      "meaning": "Əmr, hökm; Qərar, sərəncam; Güclü, qüdrətli",
      "meaning_en": "Order, decree; Decision, directive; Strong, powerful",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Hökmdar", "Sultan", "Əmir"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 353,
      "name": "Həbib",
      "name_en": "Habib",
      "meaning": "Sevimli, əziz; Yaxın, dost; Məhəbbətli",
      "meaning_en": "Beloved, dear; Close, friend; Affectionate",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Həmid", "Həkim", "Hüseyn"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 354,
      "name": "İlqar",
      "name_en": "Ilgar",
      "meaning": "Elin qəhrəmanı; Güclü, igid; Sözündə duran",
      "meaning_en": "Hero of the people; Strong, brave; Keeping one's word",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["İlkin", "İlham", "İlyas"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 355,
      "name": "Kamal",
      "name_en": "Kamal",
      "meaning": "Mükəmməllik, tamlıq; Bitkinlik, yetkinlik; Fəzilət, əxlaq",
      "meaning_en": "Perfection, completeness; Maturity, ripeness; Virtue, morality",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Kamil", "Kərim", "Kənan"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 356,
      "name": "Lətif",
      "name_en": "Latif",
      "meaning": "Zərif, nazik; Yumşaq, incə; Xoş, lütfkar",
      "meaning_en": "Graceful, delicate; Soft, tender; Pleasant, kind",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ləti", "Ləman", "Lalə"],
      "popularity": 65,
      "viewCount": 0
    },
    {
      "id": 357,
      "name": "Məmməd",
      "name_en": "Mammad",
      "meaning": "Təriflənən, həmd olunan; Uca, böyük; Müqəddəs, xeyirli",
      "meaning_en": "Praised, commended; Exalted, great; Sacred, beneficial",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Məhəmməd", "Məlik", "Məhərrəm"],
      "popularity": 90,
      "viewCount": 0
    },
    {
      "id": 358,
      "name": "Nəsir",
      "name_en": "Nasir",
      "meaning": "Köməkçi, yardımçı; Dəstək, himayədar; Qalib, zəfər çalan",
      "meaning_en": "Helper, assistant; Support, patron; Victorious, triumphant",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Namiq", "Nəbi", "Nəzim"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 359,
      "name": "Oqtay",
      "name_en": "Oktay",
      "meaning": "Ox kimi sürətli; Cəld, çevik; Ağıllı, zəkalı",
      "meaning_en": "Fast as an arrow; Agile, flexible; Intelligent, clever",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Orxan", "Osman", "Oruc"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 360,
      "name": "Pərviz",
      "name_en": "Parviz",
      "meaning": "Uğurlu, bəxtiyar; Xoşbəxt, sevincli; Qalib, zəfər çalan",
      "meaning_en": "Successful, fortunate; Happy, joyful; Victorious, triumphant",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Pənah", "Pərvin", "Bəxtiyar"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 361,
      "name": "Qasım",
      "name_en": "Qasim",
      "meaning": "Bölən, paylayan; Ədalətli, haqqsevər; Cömərd, səxavətli",
      "meaning_en": "Divider, distributor; Just, fair-minded; Generous, charitable",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Qədir", "Qəhrəman", "Qurban"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 362,
      "name": "Rəşad",
      "name_en": "Rashad",
      "meaning": "Doğru yol tapan; Hidayət edən; Ağıllı, müdrik",
      "meaning_en": "One who finds the right path; Guiding; Intelligent, wise",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Rəsul", "Rəhim", "Rəfiq"],
      "popularity": 80,
      "viewCount": 0
    },
    {
      "id": 363,
      "name": "Samir",
      "name_en": "Samir",
      "meaning": "Söhbət yoldaşı; Danışan, natiq; Dost, sirdaş",
      "meaning_en": "Companion in conversation; Speaker, orator; Friend, confidant",
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 364,
      "name": "Tural",
      "name_en": "Tural",
      "meaning": "Canlı, həyat dolu; Güclü, dözümlü; İgid, cəsur",
      "meaning_en": "Lively, full of life; Strong, resilient; Brave, courageous",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Turan", "Turgut", "Turxan"],
      "popularity": 85,
      "viewCount": 0
    },
    {
      "id": 365,
      "name": "Ürfan",
      "name_en": "Irfan",
      "meaning": "Bilik, mərifət; Ağıl, dərrakə; Hikmət, müdriklik",
      "meaning_en": "Knowledge, wisdom; Intellect, understanding; Wisdom, sagacity",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ülvi", "Ümid", "Üzeyir"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 366,
      "name": "Vüqar",
      "name_en": "Vugar",
      "meaning": "Qürur, əzəmət; Hörmət, ləyaqət; Uca, yüksək",
      "meaning_en": "Pride, majesty; Respect, dignity; Exalted, high",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Vüsal", "Vəli", "Vaqif"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 367,
      "name": "Yaqub",
      "name_en": "Yaqub",
      "meaning": "Peyğəmbər adı; Müqəddəs, uca; Dindar, inanclı",
      "meaning_en": "Prophet's name; Sacred, exalted; Pious, believing",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Yusif", "Yaşar", "Davud"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 368,
      "name": "Zəfər",
      "name_en": "Zafar",
      "meaning": "Zəfər, qələbə; Uğur, müvəffəqiyyət; Qalib, qalibiyyətli",
      "meaning_en": "Victory, triumph; Success, achievement; Victorious, triumphant",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Zahid", "Zaur", "Zakir"],
      "popularity": 79,
      "viewCount": 0
    },
    {
      "id": 369,
      "name": "Əli",
      "name_en": "Ali",
      "meaning": "Yüksək, uca; Əzəmətli, böyük; Şərəfli, hörmətli",
      "meaning_en": "High, exalted; Majestic, great; Honorable, respected",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Əliyar", "Əmir", "Əkbər"],
      "popularity": 95,
      "viewCount": 0
    },
    {
      "id": 370,
      "name": "Şamil",
      "name_en": "Shamil",
      "meaning": "Hər şeyi əhatə edən; Tam, mükəmməl; Kapsamlı, geniş",
      "meaning_en": "Encompassing everything; Complete, perfect; Comprehensive, broad",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Şahin", "Şəhriyar", "Şəmsi"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 371,
      "name": "Araz",
      "name_en": "Araz",
      "meaning": "Çay adı; Geniş, axar; Güclü, qüvvətli",
      "meaning_en": "River name; Wide, flowing; Strong, powerful",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Kür", "Dəniz", "Çay"],
      "popularity": 82,
      "viewCount": 0
    },
    {
      "id": 372,
      "name": "Bəxtiyar",
      "name_en": "Bakhtiyar",
      "meaning": "Xoşbəxt, bəxtli; Uğurlu, müvəffəqiyyətli; Sevincli, şən",
      "meaning_en": "Happy, fortunate; Successful, prosperous; Joyful, cheerful",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Bəhram", "Bəhlul", "Bəşir"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 373,
      "name": "Cəfər",
      "name_en": "Jafar",
      "meaning": "Çay; Bərəkət, bolluq; Xeyir, fayda",
      "meaning_en": "River; Blessing, abundance; Good, benefit",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ceyhun", "Cəlal", "Cəmil"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 374,
      "name": "Dəyanət",
      "name_en": "Dayanat",
      "meaning": "Dindarlıq, iman; Sədaqət, vəfadarlıq; Əxlaq, fəzilət",
      "meaning_en": "Piety, faith; Loyalty, faithfulness; Morality, virtue",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Zahid", "Təqva", "İman"],
      "popularity": 67,
      "viewCount": 0
    },
    {
      "id": 375,
      "name": "Elçin",
      "name_en": "Elchin",
      "meaning": "Xalqın elçisi; Nümayəndə, səfir; Xalqın sevimli oğlu",
      "meaning_en": "Envoy of the people; Representative, ambassador; Beloved son of the people",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Elvin", "Elnur", "Elşən"],
      "popularity": 80,
      "viewCount": 0
    },
    {
      "id": 376,
      "name": "Fərid",
      "name_en": "Farid",
      "meaning": "Yeganə, tək; Bənzərsiz, nadir; Qiymətli, dəyərli",
      "meaning_en": "Unique, single; Unparalleled, rare; Precious, valuable",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Fərhad", "Fəxri", "Fəzil"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 377,
      "name": "Hüseyn",
      "name_en": "Hussein",
      "meaning": "Gözəl, yaraşıqlı; Yaxşı, xeyirli; Müqəddəs, pak",
      "meaning_en": "Beautiful, handsome; Good, beneficial; Sacred, pure",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Həsən", "Həmid", "Həkim"],
      "popularity": 90,
      "viewCount": 0
    },
    {
      "id": 378,
      "name": "İbrahim",
      "name_en": "Ibrahim",
      "meaning": "Çoxsaylı xalqın atası; Ulu, hörmətli; Peyğəmbər adı",
      "meaning_en": "Father of many nations; Great, respected; Prophet's name",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["İsmayıl", "İlyas", "İdris"],
      "popularity": 83,
      "viewCount": 0
    },
    {
      "id": 379,
      "name": "Kərim",
      "name_en": "Karim",
      "meaning": "Səxavətli, cömərd; Mərhəmətli, şəfqətli; Dəyərli, qiymətli",
      "meaning_en": "Generous, charitable; Merciful, compassionate; Valuable, precious",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Kamil", "Kamal", "Kənan"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 380,
      "name": "Mübariz",
      "name_en": "Mubariz",
      "meaning": "Döyüşçü, qəhrəman; İgid, cəsur; Mübarizə aparan",
      "meaning_en": "Warrior, hero; Brave, courageous; One who struggles",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Müslüm", "Müşfiq", "Mütəllim"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 381,
      "name": "Namiq",
      "name_en": "Namiq",
      "meaning": "Məktub yazan; Yazıçı, şair; Danışan, natiq",
      "meaning_en": "Letter writer; Author, poet; Speaker, orator",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Nəsir", "Nəbi", "Nəzim"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 382,
      "name": "Orxan",
      "name_en": "Orkhan",
      "meaning": "Böyük xan, hökmdar; Lider, başçı; Güclü, qüdrətli",
      "meaning_en": "Great khan, ruler; Leader, chief; Strong, powerful",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Oqtay", "Osman", "Oruc"],
      "popularity": 80,
      "viewCount": 0
    },
    {
      "id": 383,
      "name": "Qəhrəman",
      "name_en": "Qahraman",
      "meaning": "Qəhrəman, igid; Cəsur, qoçaq; Qorxmaz, ürəkli",
      "meaning_en": "Hero, brave; Courageous, valiant; Fearless, bold",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Qədir", "Qasım", "Qurban"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 384,
      "name": "Rəsul",
      "name_en": "Rasul",
      "meaning": "Elçi, peyğəmbər; Xəbərçi, müjdəçi; Dindar, müqəddəs",
      "meaning_en": "Messenger, prophet; Bearer of news, harbinger; Pious, sacred",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Rəhim", "Rəşad", "Rəfiq"],
      "popularity": 79,
      "viewCount": 0
    },
    {
      "id": 385,
      "name": "Ruslan",
      "name_en": "Ruslan",
      "meaning": "Şir kimi; Güclü, qüvvətli; Qəhrəman, igid",
      "meaning_en": "Like a lion; Strong, powerful; Heroic, brave",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Rüstəm", "Rafiq", "Ramil"],
      "popularity": 81,
      "viewCount": 0
    },
    {
      "id": 386,
      "name": "Turan",
      "name_en": "Turan",
      "meaning": "Vətən, yurd; Torpaq, diyar; Güclü, qüdrətli",
      "meaning_en": "Homeland, country; Land, region; Strong, powerful",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Tural", "Turgut", "Turxan"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 387,
      "name": "Üzeyir",
      "name_en": "Uzeyir",
      "meaning": "Köməkçi, yardımçı; Dəstək, himayədar; Xeyirxah, yaxşı",
      "meaning_en": "Helper, assistant; Support, patron; Benevolent, good",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ülvi", "Ümid", "Ürfan"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 388,
      "name": "Vəli",
      "name_en": "Vali",
      "meaning": "Dost, yaxın; Himayədar, qoruyucu; Müqəddəs, uca",
      "meaning_en": "Friend, close; Patron, protector; Sacred, exalted",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Vüsal", "Vaqif", "Vasif"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 389,
      "name": "Xəyal",
      "name_en": "Khayal",
      "meaning": "Xəyal, arzu; Yuxu, fantaziya; Gözəl, sirli",
      "meaning_en": "Dream, wish; Sleep, fantasy; Beautiful, mysterious",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Röya", "Arzu", "Ümid"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 390,
      "name": "Yusif",
      "name_en": "Yusif",
      "meaning": "Allah artırsın; Çoxaltsın, bərəkətli; Gözəl, yaraşıqlı",
      "meaning_en": "May Allah increase; Multiply, blessed; Beautiful, handsome",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Yaqub", "Yaşar", "Davud"],
      "popularity": 86,
      "viewCount": 0
    },
    {
      "id": 391,
      "name": "Zakir",
      "name_en": "Zakir",
      "meaning": "Zikr edən, anan; Xatırlayan, yad edən; Dindar, təqvalı",
      "meaning_en": "One who remembers, mentions; Recalling, commemorating; Pious, devout",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Zahid", "Zaur", "Zəfər"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 392,
      "name": "Əkbər",
      "name_en": "Akbar",
      "meaning": "Ən böyük, uca; Əzəmətli, qüdrətli; Şərəfli, hörmətli",
      "meaning_en": "Greatest, exalted; Majestic, powerful; Honorable, respected",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Əli", "Əmir", "Əliyar"],
      "popularity": 82,
      "viewCount": 0
    },
    {
      "id": 393,
      "name": "Şəmsi",
      "name_en": "Shamsi",
      "meaning": "Günəşə aid; Parlaq, işıqlı; Nurani, gözəl",
      "meaning_en": "Related to the sun; Bright, luminous; Radiant, beautiful",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Şəms", "Günay", "Ay"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 394,
      "name": "Adil",
      "name_en": "Adil",
      "meaning": "Ədalətli, haqqsevər; Düzgün, dürüst; Ədalətli hökmdar",
      "meaning_en": "Just, fair-minded; Correct, honest; Just ruler",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ədalət", "Haqq", "Düzgün"],
      "popularity": 85,
      "viewCount": 0
    },
    {
      "id": 395,
      "name": "Cəlaləddin",
      "name_en": "Jalaladdin",
      "meaning": "Dinin əzəməti; Böyük, uca; Şərəfli, hörmətli",
      "meaning_en": "Majesty of religion; Great, exalted; Honorable, respected",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Cəlal", "Kəmaləddin", "Nəcməddin"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 396,
      "name": "Elmar",
      "name_en": "Elmar",
      "meaning": "Elin maralı; Xalqın sevimli oğlu; Gözəl, yaraşıqlı",
      "meaning_en": "Deer of the people; Beloved son of the nation; Beautiful, handsome",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Elvin", "Elnur", "Elçin"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 397,
      "name": "Fəxrəddin",
      "name_en": "Fakhreddin",
      "meaning": "Dinin fəxri; Şərəfli, hörmətli; Müqəddəs, uca",
      "meaning_en": "Pride of religion; Honorable, respected; Sacred, exalted",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Fəxri", "Fəzil", "Fərid"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 398,
      "name": "Həkim",
      "name_en": "Hakim",
      "meaning": "Həkim; Müdrik, ağıllı; Bilikli, dərrakəli",
      "meaning_en": "Doctor; Wise, intelligent; Knowledgeable, perceptive",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Həsən", "Hüseyn", "Həmid"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 399,
      "name": "İlham",
      "name_en": "Ilham",
      "meaning": "İlham, ruh; Təşviq, həvəs; Yaradıcılıq, istedad",
      "meaning_en": "Inspiration, spirit; Encouragement, enthusiasm; Creativity, talent",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["İlkin", "İlqar", "İlyas"],
      "popularity": 79,
      "viewCount": 0
    },
    {
      "id": 400,
      "name": "Kənan",
      "name_en": "Kanan",
      "meaning": "Qədim ölkə adı; Müqəddəs, uca; Bərəkətli, zəngin",
      "meaning_en": "Ancient country name; Sacred, exalted; Fertile, rich",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Kərim", "Kamil", "Kamal"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 401,
      "name": "Məlik",
      "name_en": "Malik",
      "meaning": "Padşah, hökmdar; Rəhbər, başçı; Güclü, qüdrətli",
      "meaning_en": "King, ruler; Leader, chief; Strong, powerful",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Məhəmməd", "Məhərrəm", "Sultan"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 402,
      "name": "Nəzim",
      "name_en": "Nazim",
      "meaning": "Şair, nazim; Yazıçı, ədib; Nizamlı, qaydalı",
      "meaning_en": "Poet, organizer; Writer, author; Orderly, disciplined",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Namiq", "Nəsir", "Nəbi"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 403,
      "name": "Rəhim",
      "name_en": "Rahim",
      "meaning": "Mərhəmətli, şəfqətli; Cömərd, səxavətli; Bağışlayan, əfv edən",
      "meaning_en": "Merciful, compassionate; Generous, charitable; Forgiving, pardoning",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Rəşad", "Rəsul", "Rəfiq"],
      "popularity": 78,
      "viewCount": 0
    },
    {
      "id": 404,
      "name": "Səbuhi",
      "name_en": "Sabuh",
      "meaning": "Səhərə aid; Təzə, yeni; Gözəl, parlaq",
      "meaning_en": "Related to morning; Fresh, new; Beautiful, bright",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Samir", "Səmər", "Sənan"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 405,
      "name": "Teymur",
      "name_en": "Teymur",
      "meaning": "Dəmir kimi möhkəm; Güclü, dözümlü; Qəhrəman, igid",
      "meaning_en": "Strong as iron; Powerful, resilient; Heroic, brave",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Dəmir", "Polad", "Rüstəm"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 406,
      "name": "Vaqif",
      "name_en": "Vagif",
      "meaning": "Bilən, xəbərdar; Ağıllı, müdrik; Anlayan, dərk edən",
      "meaning_en": "Knowing, aware; Intelligent, wise; Understanding, comprehending",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Vüsal", "Vəli", "Vasif"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 407,
      "name": "Zaur",
      "name_en": "Zaur",
      "meaning": "Ziyarət edən; Gəzən, səyyah; Açıq, səmimi",
      "meaning_en": "Visitor; Wanderer, traveler; Open, sincere",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Zahid", "Zəfər", "Zakir"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 408,
      "name": "Ənvər",
      "name_en": "Anvar",
      "meaning": "Çox nurlu, çox işıqlı; Parlaq, gözəl; Aydın, aydınlıq",
      "meaning_en": "Very radiant, very luminous; Bright, beautiful; Clear, clarity",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Əli", "Əmir", "Əkbər"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 409,
      "name": "Şahin",
      "name_en": "Shahin",
      "meaning": "Şahin quşu; Cəsur, igid; Sürətli, cəld",
      "meaning_en": "Falcon bird; Brave, valiant; Fast, agile",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Şəhriyar", "Şəmsi", "Şamil"],
      "popularity": 81,
      "viewCount": 0
    },
    {
      "id": 410,
      "name": "Arif",
      "name_en": "Arif",
      "meaning": "Bilikli, dərrakəli; Ağıllı, müdrik; Tanıyan, bilən",
      "meaning_en": "Knowledgeable, perceptive; Intelligent, wise; Recognizing, knowing",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Arifa", "Ürfan", "Həkim"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 411,
      "name": "Bəşir",
      "name_en": "Bashir",
      "meaning": "Müjdəçi, xəbərçi; Sevimli, xoş; Xeyirxah, yaxşı",
      "meaning_en": "Bearer of good news, messenger; Beloved, pleasant; Benevolent, good",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Bəxtiyar", "Bəhram", "Bəhlul"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 412,
      "name": "Cahid",
      "name_en": "Jahid",
      "meaning": "Çalışan, səy göstərən; Fəal, enerjili; Zəhmətkeş",
      "meaning_en": "Striving, diligent; Active, energetic; Hardworking",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Cavid", "Cavad", "Camal"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 413,
      "name": "Dadaş",
      "name_en": "Dadash",
      "meaning": "Böyük qardaş; Dost, yoldaş; Hörmətli, sevimli",
      "meaning_en": "Big brother; Friend, companion; Respected, beloved",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Əli", "Əmir", "Əkbər"],
      "popularity": 65,
      "viewCount": 0
    },
    {
      "id": 414,
      "name": "Elşad",
      "name_en": "Elshad",
      "meaning": "Elin şadlığı, xalqın sevinci; Şən, xoşbəxt; Sevincli, bəxtiyar",
      "meaning_en": "Joy of the people, happiness of the nation; Cheerful, happy; Joyful, fortunate",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Elvin", "Elnur", "Elçin"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 415,
      "name": "Fəzil",
      "name_en": "Fazil",
      "meaning": "Fəzilətli, üstün; Yüksək, uca; Əxlaqlı, dürüst",
      "meaning_en": "Virtuous, superior; High, exalted; Moral, honest",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Fərid", "Fərhad", "Fəxri"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 416,
      "name": "Həsrət",
      "name_en": "Hasrat",
      "meaning": "Həsrət, intizar; Arzu, istək; Sevimli, əziz",
      "meaning_en": "Longing, yearning; Desire, wish; Beloved, dear",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ümid", "Xəyal", "Arzu"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 417,
      "name": "İlyas",
      "name_en": "Ilyas",
      "meaning": "Peyğəmbər adı; Müqəddəs, uca; Dindar, inanclı",
      "meaning_en": "Prophet's name; Sacred, exalted; Pious, believing",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["İbrahim", "İsmayıl", "İdris"],
      "popularity": 78,
      "viewCount": 0
    },
    {
      "id": 418,
      "name": "Məhərrəm",
      "name_en": "Muharram",
      "meaning": "Müqəddəs, toxunulmaz; Uca, böyük; Hörmətli, dəyərli",
      "meaning_en": "Sacred, inviolable; Exalted, great; Respected, valuable",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Məhəmməd", "Məlik", "Məhəbbət"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 419,
      "name": "Nicat",
      "name_en": "Nijat",
      "meaning": "Qurtuluş, xilas; Azadlıq, azad olma; Uğur, müvəffəqiyyət",
      "meaning_en": "Salvation, deliverance; Freedom, liberation; Success, achievement",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Niyaz", "Nəsir", "Nəzim"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 420,
      "name": "Qurban",
      "name_en": "Qurban",
      "meaning": "Qurban; Fədakarlıq, sədaqət; Allah yolunda fəda",
      "meaning_en": "Sacrifice; Devotion, loyalty; Sacrifice in the way of Allah",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Qədir", "Qasım", "Qəhrəman"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 421,
      "name": "Rəvan",
      "name_en": "Ravan",
      "meaning": "Axan, gedən; Səyyah, gəzən; Ruhən azad",
      "meaning_en": "Flowing, going; Traveler, wanderer; Spiritually free",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Rəşad", "Rəsul", "Rəfiq"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 422,
      "name": "Səmər",
      "name_en": "Samar",
      "meaning": "Meyvə, bəhrə; Nəticə, fayda; Uğur, müvəffəqiyyət",
      "meaning_en": "Fruit, benefit; Result, advantage; Success, achievement",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Samir", "Sənan", "Səbuhi"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 423,
      "name": "Turxan",
      "name_en": "Turkhan",
      "meaning": "Türk xanı; Güclü, qüdrətli; Lider, başçı",
      "meaning_en": "Turk Khan; Strong, powerful; Leader, chief",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Tural", "Turan", "Turgut"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 424,
      "name": "Vasif",
      "name_en": "Vasif",
      "meaning": "Tərifçi, həmdedici; Öyən, mədh edən; Təsvir edən",
      "meaning_en": "Praiser, commender; Extoller, eulogizer; Describer",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Vüsal", "Vəli", "Vaqif"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 425,
      "name": "Zahid",
      "name_en": "Zahid",
      "meaning": "Dindar, təqvalı; Zəhmətkeş, çalışqan; Səbirli, dözümlü",
      "meaning_en": "Pious, devout; Hardworking, diligent; Patient, resilient",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Zaur", "Zəfər", "Zakir"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 426,
      "name": "Əliyar",
      "name_en": "Aliyar",
      "meaning": "Əlinin dostu; Yaxın, sirdaş; Sadiq, vəfalı",
      "meaning_en": "Friend of Ali; Close, confidant; Loyal, faithful",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Əli", "Əmir", "Əkbər"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 427,
      "name": "Şəhriyar",
      "name_en": "Shahriyar",
      "meaning": "Şəhər hökmdarı; Böyük, əzəmətli; Lider, başçı",
      "meaning_en": "Ruler of the city; Great, majestic; Leader, chief",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Şahin", "Şamil", "Şəmsi"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 428,
      "name": "Ağamir",
      "name_en": "Agamir",
      "meaning": "Böyük əmir; Hörmətli, nüfuzlu; Lider, başçı",
      "meaning_en": "Great emir; Respected, influential; Leader, chief",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Əmir", "Ağabəy", "Əli"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 429,
      "name": "Bəhlul",
      "name_en": "Bahlul",
      "meaning": "Şən, xoşhəl; Gülərüz, sevincli; Ağıllı, müdrik",
      "meaning_en": "Cheerful, joyful; Smiling, happy; Intelligent, wise",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Bəxtiyar", "Bəhram", "Bəşir"],
      "popularity": 66,
      "viewCount": 0
    },
    {
      "id": 430,
      "name": "Cavad",
      "name_en": "Javad",
      "meaning": "Səxavətli, cömərd; Əliaçıq, xeyirxah; Dəyərli, qiymətli",
      "meaning_en": "Generous, charitable; Open-handed, benevolent; Valuable, precious",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Cavid", "Cahid", "Camal"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 431,
      "name": "Dəmirçi",
      "name_en": "Damirchi",
      "meaning": "Dəmirçi; Güclü, möhkəm; Zəhmətkeş, çalışqan",
      "meaning_en": "Blacksmith; Strong, firm; Hardworking, diligent",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Dəmir", "Polad", "Teymur"],
      "popularity": 65,
      "viewCount": 0
    },
    {
      "id": 432,
      "name": "Elnur",
      "name_en": "Elnur",
      "meaning": "Xalqın nuru, elin işığı; Parlaq, aydın; Gözəl, nurani",
      "meaning_en": "Light of the people, illumination of the nation; Bright, clear; Beautiful, radiant",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Elvin", "Elçin", "Elşən"],
      "popularity": 82,
      "viewCount": 0
    },
    {
      "id": 433,
      "name": "Fəxri",
      "name_en": "Fakhri",
      "meaning": "Fəxr edən, qürurlu; Şərəfli, hörmətli; Dəyərli, qiymətli",
      "meaning_en": "Proud, honorable; Glorious, respected; Valuable, precious",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Fərid", "Fərhad", "Fəzil"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 434,
      "name": "Həmdulla",
      "name_en": "Hamdullah",
      "meaning": "Allaha həmd edən; Şükür edən; Dindar, təqvalı",
      "meaning_en": "One who praises Allah; Grateful; Pious, devout",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Həmid", "Abdulla", "Allahverdi"],
      "popularity": 67,
      "viewCount": 0
    },
    {
      "id": 435,
      "name": "İdris",
      "name_en": "Idris",
      "meaning": "Peyğəmbər adı; Müdrik, ağıllı; Bilikli, dərrakəli",
      "meaning_en": "Prophet's name; Wise, intelligent; Knowledgeable, perceptive",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["İbrahim", "İsmayıl", "İlyas"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 436,
      "name": "Kamil",
      "name_en": "Kamil",
      "meaning": "Mükəmməl, tam; Bitkin, yetkin; Fəzilətli, əxlaqlı",
      "meaning_en": "Perfect, complete; Mature, ripe; Virtuous, moral",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Kərim", "Kamal", "Kənan"],
      "popularity": 78,
      "viewCount": 0
    },
    {
      "id": 437,
      "name": "Müslüm",
      "name_en": "Muslim",
      "meaning": "Müsəlman; Dindar, inanclı; Təqvalı, saleh",
      "meaning_en": "Muslim; Pious, believing; Devout, righteous",
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 438,
      "name": "Nəbi",
      "name_en": "Nabi",
      "meaning": "Peyğəmbər, elçi; Xəbərçi, müjdəçi; Müqəddəs, uca",
      "meaning_en": "Prophet, messenger; Bearer of news, harbinger; Sacred, exalted",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Namiq", "Nəsir", "Nəzim"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 439,
      "name": "Oruc",
      "name_en": "Oruj",
      "meaning": "Oruc tutan; Dindar, inanclı; Səbirli, dözümlü",
      "meaning_en": "Fasting; Pious, believing; Patient, resilient",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Orxan", "Osman", "Oqtay"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 440,
      "name": "Polad",
      "name_en": "Polad",
      "meaning": "Polad; Möhkəm, güclü; Dözümlü, səbirli",
      "meaning_en": "Steel; Firm, strong; Resilient, patient",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Dəmir", "Teymur", "Rüstəm"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 441,
      "name": "Qədirli",
      "name_en": "Qadirli",
      "meaning": "Qüdrətli, güclü; Dəyərli, qiymətli; Hörmətli, nüfuzlu",
      "meaning_en": "Powerful, strong; Valuable, precious; Respected, influential",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Qədir", "Qasım", "Qəhrəman"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 442,
      "name": "Rüstəm",
      "name_en": "Rustam",
      "meaning": "Qəhrəman, igid; Güclü, qüvvətli; Qoçaq, cəsur",
      "meaning_en": "Hero, brave; Strong, powerful; Valiant, courageous",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Ruslan", "Rafiq", "Ramil"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 443,
      "name": "Sənan",
      "name_en": "Sanar",
      "meaning": "Nizə ucu; Kəskin, iti; Ağıllı, zəkalı",
      "meaning_en": "Spearhead; Sharp, keen; Intelligent, clever",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Samir", "Səmər", "Səbuhi"],
      "popularity": 67,
      "viewCount": 0
    },
    {
      "id": 444,
      "name": "Turgut",
      "name_en": "Turgut",
      "meaning": "Ayağa qalxan, dirçələn; Güclü, qüvvətli; İgid, cəsur",
      "meaning_en": "Rising, reviving; Strong, powerful; Brave, courageous",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Tural", "Turan", "Turxan"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 445,
      "name": "Vüsal",
      "name_en": "Vusal",
      "meaning": "Qovuşma, birləşmə; Çatma, nailiyyət; Xoşbəxtlik, sevinc",
      "meaning_en": "Union, merging; Reaching, achievement; Happiness, joy",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Vəli", "Vaqif", "Vasif"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 446,
      "name": "Yaşar",
      "name_en": "Yashar",
      "meaning": "Yaşayan, həyat sürən; Uzunömürlü; Canlı, dinamik",
      "meaning_en": "Living, enduring life; Long-lived; Lively, dynamic",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Yusif", "Yaqub", "Yasəmən"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 447,
      "name": "Zakir",
      "name_en": "Zakir",
      "meaning": "Zikr edən, anan; Xatırlayan, yad edən; Dindar, təqvalı",
      "meaning_en": "One who remembers, mentions; Recalling, commemorating; Pious, devout",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Zahid", "Zaur", "Zəfər"],
      "popularity": 69,
      "viewCount": 0
    },
    {
      "id": 448,
      "name": "Əmir",
      "name_en": "Amir",
      "meaning": "Hökmdar, əmir; Rəhbər, başçı; Güclü, qüdrətli",
      "meaning_en": "Ruler, prince; Leader, chief; Strong, powerful",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Əli", "Əliyar", "Əkbər"],
      "popularity": 79,
      "viewCount": 0
    },
    {
      "id": 449,
      "name": "Şəmsəddin",
      "name_en": "Shamsaddin",
      "meaning": "Dinin günəşi; Parlaq, işıqlı; Müqəddəs, uca",
      "meaning_en": "Sun of religion; Bright, luminous; Sacred, exalted",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Şəmsi", "Nəcməddin", "Cəlaləddin"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 450,
      "name": "Aydın",
      "name_en": "Aydin",
      "meaning": "Aydın, parlaq; İşıqlı, nurani; Açıq, səmimi",
      "meaning_en": "Clear, bright; Luminous, radiant; Open, sincere",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Ayan", "Elnur", "Günay"],
      "popularity": 88,
      "viewCount": 0
    },
    {
      "id": 451,
      "name": "Bəhruz",
      "name_en": "Behruz",
      "meaning": "Xoşbəxt gün; Uğurlu, bəxtiyar; Sevincli, şən",
      "meaning_en": "Happy day; Successful, fortunate; Joyful, cheerful",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Bəxtiyar", "Bəhlul", "Bəşir"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 452,
      "name": "Cavidan",
      "name_en": "Javidan",
      "meaning": "Əbədi, sonsuz; Daimi, ölməz; Uzunömürlü",
      "meaning_en": "Eternal, endless; Permanent, immortal; Long-lived",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Cavid", "Cavad", "Camal"],
      "popularity": 79,
      "viewCount": 0
    },
    {
      "id": 453,
      "name": "Dəmir",
      "name_en": "Damir",
      "meaning": "Dəmir; Möhkəm, güclü; Dözümlü, səbirli",
      "meaning_en": "Iron; Firm, strong; Resilient, patient",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Teymur", "Polad", "Dəmirçi"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 454,
      "name": "Elxan",
      "name_en": "Elkhan",
      "meaning": "Elin xanı, xalqın hökmdarı; Lider, başçı; Güclü, qüdrətli",
      "meaning_en": "Khan of the people, ruler of the nation; Leader, chief; Strong, powerful",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Elvin", "Elnur", "Elçin"],
      "popularity": 78,
      "viewCount": 0
    },
    {
      "id": 455,
      "name": "Fikrət",
      "name_en": "Fikrat",
      "meaning": "Fikir, düşüncə; Ağıllı, müdrik; Dərrakəli, zəkalı",
      "meaning_en": "Thought, idea; Intelligent, wise; Perceptive, clever",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Fərid", "Fəxri", "Fəzil"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 456,
      "name": "Gündüz",
      "name_en": "Gunduz",
      "meaning": "Günəş, işıq; Aydınlıq, parlaqlıq; Xoşbəxt, sevincli",
      "meaning_en": "Sun, light; Brightness, radiance; Happy, joyful",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Günay", "Günel", "Ay"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 457,
      "name": "Həmid",
      "name_en": "Hamid",
      "meaning": "Həmd edən, tərifləyən; Şükür edən; Mərhəmətli, şəfqətli",
      "meaning_en": "Praiser, commender; Grateful; Merciful, compassionate",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Həsən", "Hüseyn", "Həkim"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 458,
      "name": "İlkin",
      "name_en": "Ilkin",
      "meaning": "İlk, əvvəl; Başlanğıc, təməl; Öncül, lider",
      "meaning_en": "First, initial; Beginning, foundation; Pioneer, leader",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["İlqar", "İlham", "İlyas"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 459,
      "name": "Kəmaləddin",
      "name_en": "Kamaladdin",
      "meaning": "Dinin kamillığı; Mükəmməl, uca; Fəzilətli, əxlaqlı",
      "meaning_en": "Perfection of religion; Perfect, exalted; Virtuous, moral",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Kərim", "Kamil", "Kənan"],
      "popularity": 67,
      "viewCount": 0
    },
    {
      "id": 460,
      "name": "Ləman",
      "name_en": "Leman",
      "meaning": "Parlaqlıq, işıq; Zərif, incə; Gözəl, cazibədar",
      "meaning_en": "Brightness, light; Graceful, delicate; Beautiful, charming",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Leyla", "Lalə", "Lətifə"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 461,
      "name": "Məhəmməd",
      "name_en": "Muhammad",
      "meaning": "Təriflənən, həmd olunan; Uca, böyük; Müqəddəs, xeyirli",
      "meaning_en": "Praised, commended; Exalted, great; Sacred, beneficial",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Məmməd", "Məlik", "Məhərrəm"],
      "popularity": 90,
      "viewCount": 0
    },
    {
      "id": 462,
      "name": "Nəsibə",
      "name_en": "Nasiba",
      "meaning": "Nəsib, qismət; Tale, bəxt; Uğur, müvəffəqiyyət",
      "meaning_en": "Destiny, fate; Fortune, luck; Success, achievement",
      "gender": "qız",
      "origin": "ərəb",
      "similar": ["Nəzakət", "Nəfisə", "Nəcibə"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 463,
      "name": "Pənah",
      "name_en": "Panah",
      "meaning": "Sığınacaq, qoruyucu; Himayədar, dəstək; Xilaskar, nicat",
      "meaning_en": "Shelter, protector; Patron, support; Savior, salvation",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Pəri", "Pərvanə", "Pərvin"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 464,
      "name": "Qədir",
      "name_en": "Qadir",
      "meaning": "Qüdrətli, güclü; Əzəmətli, uca; Dəyərli, qiymətli",
      "meaning_en": "Powerful, strong; Majestic, exalted; Valuable, precious",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Qasım", "Qəhrəman", "Qurban"],
      "popularity": 71,
      "viewCount": 0
    },
    {
      "id": 465,
      "name": "Ramil",
      "name_en": "Ramil",
      "meaning": "Atıcı, nişançı; Dəqiq, hədəfə vuran; Cəsur, igid",
      "meaning_en": "Archer, marksman; Accurate, hitting the target; Brave, valiant",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ruslan", "Rüstəm", "Rafiq"],
      "popularity": 73,
      "viewCount": 0
    },
    {
      "id": 466,
      "name": "Sənan",
      "name_en": "Sanar",
      "meaning": "Nizə ucu; Kəskin, iti; Ağıllı, zəkalı",
      "meaning_en": "Spearhead; Sharp, keen; Intelligent, clever",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Samir", "Səmər", "Səbuhi"],
      "popularity": 67,
      "viewCount": 0
    },
    {
      "id": 467,
      "name": "Tərlan",
      "name_en": "Tarlan",
      "meaning": "Qartal; Güclü, cəsur; Azad, sərbəst",
      "meaning_en": "Eagle; Strong, brave; Free, independent",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Tural", "Turan", "Turxan"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 468,
      "name": "Ümid",
      "name_en": "Umid",
      "meaning": "Ümid, arzu; Gələcək, perspektiv; Müsbət, nikbin",
      "meaning_en": "Hope, wish; Future, perspective; Positive, optimistic",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ülvi", "Ürfan", "Üzeyir"],
      "popularity": 84,
      "viewCount": 0
    },
    {
      "id": 469,
      "name": "Vaqif",
      "name_en": "Vagif",
      "meaning": "Bilən, xəbərdar; Ağıllı, müdrik; Anlayan, dərk edən",
      "meaning_en": "Knowing, aware; Intelligent, wise; Understanding, comprehending",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Vüsal", "Vəli", "Vasif"],
      "popularity": 74,
      "viewCount": 0
    },
    {
      "id": 470,
      "name": "Zahid",
      "name_en": "Zahid",
      "meaning": "Dindar, təqvalı; Zəhmətkeş, çalışqan; Səbirli, dözümlü",
      "meaning_en": "Pious, devout; Hardworking, diligent; Patient, resilient",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Zaur", "Zəfər", "Zakir"],
      "popularity": 68,
      "viewCount": 0
    },
    {
      "id": 471,
      "name": "Ədalət",
      "name_en": "Adalat",
      "meaning": "Ədalət, haqq; Düzgünlük, dürüstlük; Haqqsevər",
      "meaning_en": "Justice, right; Correctness, honesty; Lover of justice",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Əhməd", "Əsgər", "Əziz"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 472,
      "name": "Şəhriyar",
      "name_en": "Shahriyar",
      "meaning": "Şəhər hökmdarı; Böyük, əzəmətli; Lider, başçı",
      "meaning_en": "Ruler of the city; Great, majestic; Leader, chief",
      "gender": "oğlan",
      "origin": "fars",
      "similar": ["Şahin", "Şamil", "Şəmsi"],
      "popularity": 75,
      "viewCount": 0
    },
    {
      "id": 473,
      "name": "Ağabəy",
      "name_en": "Agabey",
      "meaning": "Böyük bəy, hörmətli ağa; Lider, rəhbər; Nüfuzlu, hörmətli",
      "meaning_en": "Great bey, respected master; Leader, chief; Influential, respected",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Əli", "Əmir", "Əkbər"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 474,
      "name": "Cəlal",
      "name_en": "Jalal",
      "meaning": "Böyüklük, əzəmət; Şan, şöhrət; Hörmət, ləyaqət",
      "meaning_en": "Greatness, majesty; Glory, fame; Respect, dignity",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Ceyhun", "Cəmil", "Cəfər"],
      "popularity": 77,
      "viewCount": 0
    },
    {
      "id": 475,
      "name": "Dadaş",
      "name_en": "Dadash",
      "meaning": "Böyük qardaş; Dost, yoldaş; Hörmətli, sevimli",
      "meaning_en": "Big brother; Friend, companion; Respected, beloved",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Əli", "Əmir", "Əkbər"],
      "popularity": 65,
      "viewCount": 0
    },
    {
      "id": 476,
      "name": "Elmar",
      "name_en": "Elmar",
      "meaning": "Elin maralı; Xalqın sevimli oğlu; Gözəl, yaraşıqlı",
      "meaning_en": "Deer of the people; Beloved son of the nation; Beautiful, handsome",
      "gender": "oğlan",
      "origin": "azərbaycan",
      "similar": ["Elvin", "Elnur", "Elçin"],
      "popularity": 76,
      "viewCount": 0
    },
    {
      "id": 477,
      "name": "Fəxrəddin",
      "name_en": "Fakhreddin",
      "meaning": "Dinin fəxri; Şərəfli, hörmətli; Müqəddəs, uca",
      "meaning_en": "Pride of religion; Honorable, respected; Sacred, exalted",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Fəxri", "Fəzil", "Fərid"],
      "popularity": 70,
      "viewCount": 0
    },
    {
      "id": 478,
      "name": "Gündüz",
      "name_en": "Gunduz",
      "meaning": "Günəş, işıq; Aydınlıq, parlaqlıq; Xoşbəxt, sevincli",
      "meaning_en": "Sun, light; Brightness, radiance; Happy, joyful",
      "gender": "oğlan",
      "origin": "türk",
      "similar": ["Günay", "Günel", "Ay"],
      "popularity": 72,
      "viewCount": 0
    },
    {
      "id": 479,
      "name": "Həmid",
      "name_en": "Hamid",
      "meaning": "Həmd edən, tərifləyən; Şükür edən; Mərhəmətli, şəfqətli",
      "meaning_en": "Praiser, commender; Grateful; Merciful, compassionate",
      "gender": "oğlan",
      "origin": "ərəb",
      "similar": ["Həsən", "Hüseyn", "Həkim"],
      "popularity": 73,
      "viewCount": 0
    },
  {
    "id": 480,
    "name": "İlkin",
    "name_en": "Ilkin",
    "meaning": "İlk, əvvəl; Başlanğıc, təməl; Öncül, lider",
    "meaning_en": "First, initial; Beginning, foundation; Pioneer, leader",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["İlqar", "İlham", "İlyas"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 481,
    "name": "Kəmaləddin",
    "name_en": "Kemaleddin",
    "meaning": "Dinin kamillığı; Mükəmməl, uca; Fəzilətli, əxlaqlı",
    "meaning_en": "Perfection of religion; Perfect, sublime; Virtuous, moral",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Kərim", "Kamil", "Kənan"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 482,
    "name": "Lətif",
    "name_en": "Latif",
    "meaning": "Zərif, nazik; Yumşaq, incə; Xoş, lütfkar",
    "meaning_en": "Delicate, thin; Soft, gentle; Pleasant, gracious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ləti", "Ləman", "Lalə"],
    "popularity": 65,
    "viewCount": 0
  },
  {
    "id": 483,
    "name": "Məmməd",
    "name_en": "Mammad",
    "meaning": "Təriflənən, həmd olunan; Uca, böyük; Müqəddəs, xeyirli",
    "meaning_en": "Praised, glorified; Sublime, great; Sacred, beneficial",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Məhəmməd", "Məlik", "Məhərrəm"],
    "popularity": 90,
    "viewCount": 0
  },
  {
    "id": 484,
    "name": "Nəsib",
    "name_en": "Nasib",
    "meaning": "Nəsib, qismət; Tale, bəxt; Uğur, müvəffəqiyyət",
    "meaning_en": "Destiny, fate; Fortune, luck; Success, achievement",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Niyaz", "Nəsir", "Nəzim"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 485,
    "name": "Oqtay",
    "name_en": "Ogtay",
    "meaning": "Ox kimi sürətli; Cəld, çevik; Ağıllı, zəkalı",
    "meaning_en": "Fast as an arrow; Agile, nimble; Intelligent, clever",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Orxan", "Osman", "Oruc"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 486,
    "name": "Pərviz",
    "name_en": "Parviz",
    "meaning": "Uğurlu, bəxtiyar; Xoşbəxt, sevincli; Qalib, zəfər çalan",
    "meaning_en": "Successful, fortunate; Happy, joyful; Victorious, triumphant",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Pənah", "Pərvin", "Bəxtiyar"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 487,
    "name": "Qasım",
    "name_en": "Gasim",
    "meaning": "Bölən, paylayan; Ədalətli, haqqsevər; Cömərd, səxavətli",
    "meaning_en": "Divider, distributor; Just, righteous; Generous, benevolent",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Qədir", "Qəhrəman", "Qurban"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 488,
    "name": "Rəşad",
    "name_en": "Rashad",
    "meaning": "Doğru yol tapan; Hidayət edən; Ağıllı, müdrik",
    "meaning_en": "One who finds the right path; Guiding; Intelligent, wise",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Rəsul", "Rəhim", "Rəfiq"],
    "popularity": 80,
    "viewCount": 0
  },
  {
    "id": 489,
    "name": "Samir",
    "name_en": "Samir",
    "meaning": "Söhbət yoldaşı; Danışan, natiq; Dost, sirdaş",
    "meaning_en": "Conversation companion; Speaker, orator; Friend, confidant",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Səmər", "Sənan", "Səbuhi"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 490,
    "name": "Tural",
    "name_en": "Tural",
    "meaning": "Canlı, həyat dolu; Güclü, dözümlü; İgid, cəsur",
    "meaning_en": "Lively, full of life; Strong, resilient; Brave, courageous",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Turan", "Turgut", "Turxan"],
    "popularity": 85,
    "viewCount": 0
  },
  {
    "id": 491,
    "name": "Ürfan",
    "name_en": "Urphan",
    "meaning": "Bilik, mərifət; Ağıl, dərrakə; Hikmət, müdriklik",
    "meaning_en": "Knowledge, wisdom; Intellect, understanding; Wisdom, sagacity",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ülvi", "Ümid", "Üzeyir"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 492,
    "name": "Vüqar",
    "name_en": "Vugar",
    "meaning": "Qürur, əzəmət; Hörmət, ləyaqət; Uca, yüksək",
    "meaning_en": "Pride, grandeur; Respect, dignity; Lofty, high",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Vüsal", "Vəli", "Vaqif"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 493,
    "name": "Yaqub",
    "name_en": "Yagub",
    "meaning": "Peyğəmbər adı; Müqəddəs, uca; Dindar, inanclı",
    "meaning_en": "Prophet's name; Sacred, sublime; Religious, faithful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Yusif", "Yaşar", "Davud"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 494,
    "name": "Zəfər",
    "name_en": "Zafar",
    "meaning": "Zəfər, qələbə; Uğur, müvəffəqiyyət; Qalib, qalibiyyətli",
    "meaning_en": "Victory, triumph; Success, achievement; Victorious, winning",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zahid", "Zaur", "Zakir"],
    "popularity": 79,
    "viewCount": 0
  },
  {
    "id": 495,
    "name": "Əli",
    "name_en": "Ali",
    "meaning": "Yüksək, uca; Əzəmətli, böyük; Şərəfli, hörmətli",
    "meaning_en": "High, sublime; Grand, great; Honorable, respected",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əliyar", "Əmir", "Əkbər"],
    "popularity": 95,
    "viewCount": 0
  },
  {
    "id": 496,
    "name": "Şamil",
    "name_en": "Shamil",
    "meaning": "Hər şeyi əhatə edən; Tam, mükəmməl; Kapsamlı, geniş",
    "meaning_en": "All-encompassing; Complete, perfect; Comprehensive, broad",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Şahin", "Şəhriyar", "Şəmsi"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 497,
    "name": "Araz",
    "name_en": "Araz",
    "meaning": "Çay adı; Geniş, axar; Güclü, qüvvətli",
    "meaning_en": "River name; Wide, flowing; Strong, powerful",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Kür", "Dəniz", "Çay"],
    "popularity": 82,
    "viewCount": 0
  },
  {
    "id": 498,
    "name": "Bəxtiyar",
    "name_en": "Bakhtiyar",
    "meaning": "Xoşbəxt, bəxtli; Uğurlu, müvəffəqiyyətli; Sevincli, şən",
    "meaning_en": "Happy, fortunate; Successful, prosperous; Joyful, cheerful",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Bəhram", "Bəhlul", "Bəşir"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 499,
    "name": "Cəfər",
    "name_en": "Jafar",
    "meaning": "Çay; Bərəkət, bolluq; Xeyir, fayda",
    "meaning_en": "River; Abundance, plenty; Good, benefit",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ceyhun", "Cəlal", "Cəmil"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 500,
    "name": "Dəyanət",
    "name_en": "Dayanat",
    "meaning": "Dindarlıq, iman; Sədaqət, vəfadarlıq; Əxlaq, fəzilət",
    "meaning_en": "Piety, faith; Loyalty, fidelity; Morality, virtue",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zahid", "Təqva", "İman"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 501,
    "name": "Elçin",
    "name_en": "Elchin",
    "meaning": "Xalqın elçisi; Nümayəndə, səfir; Xalqın sevimli oğlu",
    "meaning_en": "Envoy of the people; Representative, ambassador; Beloved son of the people",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elnur", "Elşən"],
    "popularity": 80,
    "viewCount": 0
  },
  {
    "id": 502,
    "name": "Fərid",
    "name_en": "Farid",
    "meaning": "Yeganə, tək; Bənzərsiz, nadir; Qiymətli, dəyərli",
    "meaning_en": "Unique, sole; Unparalleled, rare; Valuable, precious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fərhad", "Fəxri", "Fəzil"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 503,
    "name": "Hüseyn",
    "name_en": "Huseyn",
    "meaning": "Gözəl, yaraşıqlı; Yaxşı, xeyirli; Müqəddəs, pak",
    "meaning_en": "Beautiful, handsome; Good, beneficial; Sacred, pure",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Həsən", "Həmid", "Həkim"],
    "popularity": 90,
    "viewCount": 0
  },
  {
    "id": 504,
    "name": "İbrahim",
    "name_en": "Ibrahim",
    "meaning": "Çoxsaylı xalqın atası; Ulu, hörmətli; Peyğəmbər adı",
    "meaning_en": "Father of a multitude; Great, respected; Prophet's name",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["İsmayıl", "İlyas", "İdris"],
    "popularity": 83,
    "viewCount": 0
  },
  {
    "id": 505,
    "name": "Kərim",
    "name_en": "Karim",
    "meaning": "Səxavətli, cömərd; Mərhəmətli, şəfqətli; Dəyərli, qiymətli",
    "meaning_en": "Generous, benevolent; Merciful, compassionate; Valuable, precious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Kamil", "Kamal", "Kənan"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 506,
    "name": "Mübariz",
    "name_en": "Mubariz",
    "meaning": "Döyüşçü, qəhrəman; İgid, cəsur; Mübarizə aparan",
    "meaning_en": "Warrior, hero; Brave, courageous; One who struggles",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Müslüm", "Müşfiq", "Mütəllim"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 507,
    "name": "Namiq",
    "name_en": "Namiq",
    "meaning": "Məktub yazan; Yazıçı, şair; Danışan, natiq",
    "meaning_en": "Letter writer; Writer, poet; Speaker, orator",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Nəsir", "Nəbi", "Nəzim"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 508,
    "name": "Aişə",
    "name_en": "Aisha",
    "meaning": "Yaşayan, həyat dolu; Sağlam, canlı; Xoşbəxt, sevincli",
    "meaning_en": "Living, full of life; Healthy, vibrant; Happy, joyful",
    "gender": "qız",
    "origin": "ərəb",
    "similar": ["Fatimə", "Zeynəb", "Məryəm"],
    "popularity": 90,
    "viewCount": 0
  },
  {
    "id": 509,
    "name": "Banu",
    "name_en": "Banu",
    "meaning": "Xanım, hökmdar; Nəcib, əsilzadə; Gözəl, zərif",
    "meaning_en": "Lady, ruler; Noble, aristocratic; Beautiful, delicate",
    "gender": "qız",
    "origin": "fars",
    "similar": ["Bəyəm", "Şahbanu", "Sultan"],
    "popularity": 80,
    "viewCount": 0
  },
  {
    "id": 510,
    "name": "Cənnət",
    "name_en": "Jannat",
    "meaning": "Cənnət, behişt; Gözəl yer, xoşbəxtlik; Müqəddəs, pak",
    "meaning_en": "Paradise, heaven; Beautiful place, happiness; Sacred, pure",
    "gender": "qız",
    "origin": "ərəb",
    "similar": ["Gülüstan", "Firdovs", "Huri"],
    "popularity": 85,
    "viewCount": 0
  },
  {
    "id": 511,
    "name": "Dilarə",
    "name_en": "Dilara",
    "meaning": "Ürək bəzəyi; Gözəl, sevimli; Ürəyəyatan, cazibədar",
    "meaning_en": "Adornment of the heart; Beautiful, beloved; Appealing, charming",
    "gender": "qız",
    "origin": "fars",
    "similar": ["Dilbər", "Dilan", "Dilşad"],
    "popularity": 88,
    "viewCount": 0
  },
  {
    "id": 512,
    "name": "Elmira",
    "name_en": "Elmira",
    "meaning": "Əmir qızı; Nəcib, əsilzadə; Hörmətli, dəyərli",
    "meaning_en": "Emir's daughter; Noble, aristocratic; Respected, valuable",
    "gender": "qız",
    "origin": "ərəb",
    "similar": ["Elza", "Elvira", "Elnarə"],
    "popularity": 78,
    "viewCount": 0
  },
  {
    "id": 513,
    "name": "Fərəh",
    "name_en": "Farah",
    "meaning": "Sevinc, şadlıq; Xoşbəxtlik, bəxtiyarlıq; Şən, gülərüz",
    "meaning_en": "Joy, happiness; Bliss, fortune; Cheerful, smiling",
    "gender": "qız",
    "origin": "ərəb",
    "similar": ["Fəxriyyə", "Fəzilə", "Fərda"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 514,
    "name": "Gülər",
    "name_en": "Guler",
    "meaning": "Gülən, şən; Sevincli, xoşbəxt; Gülərüz, mehriban",
    "meaning_en": "Smiling, cheerful; Joyful, happy; Friendly, kind",
    "gender": "qız",
    "origin": "azərbaycan",
    "similar": ["Gülnar", "Günel", "Gülnaz"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 515,
    "name": "Həcər",
    "name_en": "Hajar",
    "meaning": "Daş, möhkəm; Güclü, dözümlü; Səbirli, dözümlü",
    "meaning_en": "Stone, firm; Strong, resilient; Patient, enduring",
    "gender": "qız",
    "origin": "ərəb",
    "similar": ["Həbibə", "Hədi", "Həlimə"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 516,
    "name": "İradə",
    "name_en": "Irada",
    "meaning": "İradə, istək; Qətiyyət, əzm; Güc, qüvvət",
    "meaning_en": "Will, desire; Determination, resolve; Strength, power",
    "gender": "qız",
    "origin": "ərəb",
    "similar": ["Mətanət", "Dəyanət", "Səbirə"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 517,
    "name": "Kərimə",
    "name_en": "Karima",
    "meaning": "Səxavətli, cömərd; Mərhəmətli, şəfqətli; Dəyərli, qiymətli",
    "meaning_en": "Generous, benevolent; Merciful, compassionate; Valuable, precious",
    "gender": "qız",
    "origin": "ərəb",
    "similar": ["Kəmalə", "Könül", "Nəcibə"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 518,
    "name": "Laləzar",
    "name_en": "Lalazar",
    "meaning": "Lalə bağı; Gözəl yer, çiçəkli; Bəzəkli, zinətli",
    "meaning_en": "Tulip garden; Beautiful place, flowery; Decorated, adorned",
    "gender": "qız",
    "origin": "fars",
    "similar": ["Lalə", "Gülzar", "Gülüstan"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 519,
    "name": "Məleykə",
    "name_en": "Maleyka",
    "meaning": "Mələk; Gözəl, zərif; Pak, təmiz",
    "meaning_en": "Angel; Beautiful, delicate; Pure, clean",
    "gender": "qız",
    "origin": "ərəb",
    "similar": ["Mələk", "Məryəm", "Fatimə"],
    "popularity": 86,
    "viewCount": 0
  },
  {
    "id": 520,
    "name": "Nərminə",
    "name_en": "Narmina",
    "meaning": "Nazik, zərif; Yumşaq, incə; Gözəl, xoş",
    "meaning_en": "Thin, delicate; Soft, gentle; Beautiful, pleasant",
    "gender": "qız",
    "origin": "fars",
    "similar": ["Nərmin", "Nərgiz", "Nigar"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 521,
    "name": "Pərvinə",
    "name_en": "Parvina",
    "meaning": "Ulduz qrupu; Parlaq, işıqlı; Gözəl, zərif",
    "meaning_en": "Star cluster; Bright, luminous; Beautiful, delicate",
    "gender": "qız",
    "origin": "fars",
    "similar": ["Pərvin", "Ülkər", "Ulduz"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 522,
    "name": "Qəmzə",
    "name_en": "Gamza",
    "meaning": "Göz işarəsi; Cazibə, şirinlik; Gözəl, cəlbedici",
    "meaning_en": "Wink; Charm, sweetness; Beautiful, attractive",
    "gender": "qız",
    "origin": "ərəb",
    "similar": ["Qəmər", "Nigar", "Şəhla"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 523,
    "name": "Rəna",
    "name_en": "Rana",
    "meaning": "Rəngli, parlaq; Gözəl, cazibədar; Şən, sevincli",
    "meaning_en": "Colorful, bright; Beautiful, charming; Cheerful, joyful",
    "gender": "qız",
    "origin": "fars",
    "similar": ["Röya", "Reyhan", "Rəvanə"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 524,
    "name": "Səidə",
    "name_en": "Saida",
    "meaning": "Xoşbəxt, səadətli; Uğurlu, müvəffəqiyyətli; Bəxtiyar",
    "meaning_en": "Happy, blissful; Successful, prosperous; Fortunate",
    "gender": "qız",
    "origin": "ərəb",
    "similar": ["Səbinə", "Səkinə", "Səmirə"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 525,
    "name": "Təranə",
    "name_en": "Tarana",
    "meaning": "Mahnı, nəğmə; Musiqi, avaz; Şirin, xoş",
    "meaning_en": "Song, melody; Music, tune; Sweet, pleasant",
    "gender": "qız",
    "origin": "fars",
    "similar": ["Turalə", "Təhminə", "Tərlan"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 526,
    "name": "Ümidə",
    "name_en": "Umida",
    "meaning": "Ümidli, gələcəyə baxan; Sevimli, xoş; Nikbin, müsbət",
    "meaning_en": "Hopeful, looking to the future; Beloved, pleasant; Optimistic, positive",
    "gender": "qız",
    "origin": "ərəb",
    "similar": ["Ülviyyə", "Ülkər", "Ürfanə"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 527,
    "name": "Vəcihə",
    "name_en": "Vajiha",
    "meaning": "Üzü gözəl, cazibədar; Şirin, xoş; Hörmətli, dəyərli",
    "meaning_en": "Beautiful-faced, charming; Sweet, pleasant; Respected, valuable",
    "gender": "qız",
    "origin": "ərəb",
    "similar": ["Vəfa", "Vəsilə", "Vəliyyə"],
    "popularity": 66,
    "viewCount": 0
  },
  {
    "id": 528,
    "name": "Xumar",
    "name_en": "Khumar",
    "meaning": "Xumar, məst; Gözəl, cazibədar; Şirin, xoş",
    "meaning_en": "Drowsy, intoxicated; Beautiful, charming; Sweet, pleasant",
    "gender": "qız",
    "origin": "fars",
    "similar": ["Nigar", "Şəhla", "Məlahət"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 529,
    "name": "Zəminə",
    "name_en": "Zamina",
    "meaning": "Yer, torpaq; Əsas, təməl; Bərəkətli, zəngin",
    "meaning_en": "Place, land; Basis, foundation; Fertile, rich",
    "gender": "qız",
    "origin": "ərəb",
    "similar": ["Zəhra", "Zərifə", "Zülalə"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 530,
    "name": "Əfsanə",
    "name_en": "Afsana",
    "meaning": "Nağıl, hekayə; Rəvayət, əfsanə; Gözəl, sirli",
    "meaning_en": "Tale, story; Legend, myth; Beautiful, mysterious",
    "gender": "qız",
    "origin": "fars",
    "similar": ["Əsmə", "Əzizə", "Əminə"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 531,
    "name": "Şəbnəm",
    "name_en": "Shabnam",
    "meaning": "Gecə çiyi; Sərin, təravətli; Saf, təmiz",
    "meaning_en": "Night dew; Cool, refreshing; Pure, clean",
    "gender": "qız",
    "origin": "fars",
    "similar": ["Şəhla", "Şəfəq", "Şəkər"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 532,
    "name": "Ağalar",
    "name_en": "Aghalar",
    "meaning": "Ağalar, bəylər; Hörmətli, nüfuzlu; Lider, başçı",
    "meaning_en": "Lords, beys; Respected, influential; Leader, chief",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Ağabəy", "Əli", "Əmir"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 533,
    "name": "Bəhruz",
    "name_en": "Behruz",
    "meaning": "Xoşbəxt gün; Uğurlu, bəxtiyar; Sevincli, şən",
    "meaning_en": "Happy day; Successful, fortunate; Joyful, cheerful",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Bəxtiyar", "Bəhlul", "Bəşir"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 534,
    "name": "Cəmil",
    "name_en": "Jamil",
    "meaning": "Gözəl, yaraşıqlı; Şirin, xoş; Cazibədar, sevimli",
    "meaning_en": "Beautiful, handsome; Sweet, pleasant; Charming, beloved",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Cavid", "Cavad", "Camal"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 535,
    "name": "Dəmir",
    "name_en": "Damir",
    "meaning": "Dəmir; Möhkəm, güclü; Dözümlü, səbirli",
    "meaning_en": "Iron; Firm, strong; Resilient, patient",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Teymur", "Polad", "Dəmirçi"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 536,
    "name": "Elxan",
    "name_en": "Elkhan",
    "meaning": "Elin xanı, xalqın hökmdarı; Lider, başçı; Güclü, qüdrətli",
    "meaning_en": "Khan of the people, ruler of the nation; Leader, chief; Strong, powerful",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elnur", "Elçin"],
    "popularity": 78,
    "viewCount": 0
  },
  {
    "id": 537,
    "name": "Fikrət",
    "name_en": "Fikrat",
    "meaning": "Fikir, düşüncə; Ağıllı, müdrik; Dərrakəli, zəkalı",
    "meaning_en": "Thought, idea; Intelligent, wise; Perceptive, clever",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fərid", "Fəxri", "Fəzil"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 538,
    "name": "Gündüz",
    "name_en": "Gunduz",
    "meaning": "Günəş, işıq; Aydınlıq, parlaqlıq; Xoşbəxt, sevincli",
    "meaning_en": "Sun, light; Brightness, radiance; Happy, joyful",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Günay", "Günel", "Ay"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 539,
    "name": "Həmid",
    "name_en": "Hamid",
    "meaning": "Həmd edən, tərifləyən; Şükür edən; Mərhəmətli, şəfqətli",
    "meaning_en": "One who praises, glorifies; Grateful; Merciful, compassionate",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Həsən", "Hüseyn", "Həkim"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 540,
    "name": "Ramin",
    "name_en": "Ramin",
    "meaning": "Uşaq, Övlad, Oğul",
    "meaning_en": "Child, Offspring, Son",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Ramil", "Ramiz", "İlyas"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 541,
    "name": "Kəmaləddin",
    "name_en": "Kemaleddin",
    "meaning": "Dinin kamillığı; Mükəmməl, uca; Fəzilətli, əxlaqlı",
    "meaning_en": "Perfection of religion; Perfect, sublime; Virtuous, moral",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Kərim", "Kamil", "Kənan"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 542,
    "name": "Lətif",
    "name_en": "Latif",
    "meaning": "Zərif, nazik; Yumşaq, incə; Xoş, lütfkar",
    "meaning_en": "Delicate, thin; Soft, gentle; Pleasant, gracious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ləti", "Ləman", "Lalə"],
    "popularity": 65,
    "viewCount": 0
  },
  {
    "id": 543,
    "name": "Məmməd",
    "name_en": "Mammad",
    "meaning": "Təriflənən, həmd olunan; Uca, böyük; Müqəddəs, xeyirli",
    "meaning_en": "Praised, glorified; Sublime, great; Sacred, beneficial",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Məhəmməd", "Məlik", "Məhərrəm"],
    "popularity": 90,
    "viewCount": 0
  },
  {
    "id": 544,
    "name": "Nəsib",
    "name_en": "Nasib",
    "meaning": "Nəsib, qismət; Tale, bəxt; Uğur, müvəffəqiyyət",
    "meaning_en": "Destiny, fate; Fortune, luck; Success, achievement",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Niyaz", "Nəsir", "Nəzim"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 545,
    "name": "Oqtay",
    "name_en": "Ogtay",
    "meaning": "Ox kimi sürətli; Cəld, çevik; Ağıllı, zəkalı",
    "meaning_en": "Fast as an arrow; Agile, nimble; Intelligent, clever",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Orxan", "Osman", "Oruc"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 546,
    "name": "Pərviz",
    "name_en": "Parviz",
    "meaning": "Uğurlu, bəxtiyar; Xoşbəxt, sevincli; Qalib, zəfər çalan",
    "meaning_en": "Successful, fortunate; Happy, joyful; Victorious, triumphant",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Pənah", "Pərvin", "Bəxtiyar"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 547,
    "name": "Qasım",
    "name_en": "Gasim",
    "meaning": "Bölən, paylayan; Ədalətli, haqqsevər; Cömərd, səxavətli",
    "meaning_en": "Divider, distributor; Just, righteous; Generous, benevolent",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Qədir", "Qəhrəman", "Qurban"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 548,
    "name": "Rəşad",
    "name_en": "Rashad",
    "meaning": "Doğru yol tapan; Hidayət edən; Ağıllı, müdrik",
    "meaning_en": "One who finds the right path; Guiding; Intelligent, wise",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Rəsul", "Rəhim", "Rəfiq"],
    "popularity": 80,
    "viewCount": 0
  },
  {
    "id": 549,
    "name": "Samir",
    "name_en": "Samir",
    "meaning": "Söhbət yoldaşı; Danışan, natiq; Dost, sirdaş",
    "meaning_en": "Conversation companion; Speaker, orator; Friend, confidant",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Səmər", "Sənan", "Səbuhi"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 550,
    "name": "Tural",
    "name_en": "Tural",
    "meaning": "Canlı, həyat dolu; Güclü, dözümlü; İgid, cəsur",
    "meaning_en": "Lively, full of life; Strong, resilient; Brave, courageous",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Turan", "Turgut", "Turxan"],
    "popularity": 85,
    "viewCount": 0
  },
  {
    "id": 551,
    "name": "Ürfan",
    "name_en": "Urphan",
    "meaning": "Bilik, mərifət; Ağıl, dərrakə; Hikmət, müdriklik",
    "meaning_en": "Knowledge, wisdom; Intellect, understanding; Wisdom, sagacity",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ülvi", "Ümid", "Üzeyir"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 552,
    "name": "Vüqar",
    "name_en": "Vugar",
    "meaning": "Qürur, əzəmət; Hörmət, ləyaqət; Uca, yüksək",
    "meaning_en": "Pride, grandeur; Respect, dignity; Lofty, high",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Vüsal", "Vəli", "Vaqif"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 553,
    "name": "Yaqub",
    "name_en": "Yagub",
    "meaning": "Peyğəmbər adı; Müqəddəs, uca; Dindar, inanclı",
    "meaning_en": "Prophet's name; Sacred, sublime; Religious, faithful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Yusif", "Yaşar", "Davud"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 554,
    "name": "Zəfər",
    "name_en": "Zafar",
    "meaning": "Zəfər, qələbə; Uğur, müvəffəqiyyət; Qalib, qalibiyyətli",
    "meaning_en": "Victory, triumph; Success, achievement; Victorious, winning",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zahid", "Zaur", "Zakir"],
    "popularity": 79,
    "viewCount": 0
  },
  {
    "id": 555,
    "name": "Əli",
    "name_en": "Ali",
    "meaning": "Yüksək, uca; Əzəmətli, böyük; Şərəfli, hörmətli",
    "meaning_en": "High, sublime; Grand, great; Honorable, respected",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əliyar", "Əmir", "Əkbər"],
    "popularity": 95,
    "viewCount": 0
  },
  {
    "id": 556,
    "name": "Şamil",
    "name_en": "Shamil",
    "meaning": "Hər şeyi əhatə edən; Tam, mükəmməl; Kapsamlı, geniş",
    "meaning_en": "All-encompassing; Complete, perfect; Comprehensive, broad",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Şahin", "Şəhriyar", "Şəmsi"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 557,
    "name": "Araz",
    "name_en": "Araz",
    "meaning": "Çay adı; Geniş, axar; Güclü, qüvvətli",
    "meaning_en": "River name; Wide, flowing; Strong, powerful",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Kür", "Dəniz", "Çay"],
    "popularity": 82,
    "viewCount": 0
  },
  {
    "id": 558,
    "name": "Bəxtiyar",
    "name_en": "Bakhtiyar",
    "meaning": "Xoşbəxt, bəxtli; Uğurlu, müvəffəqiyyətli; Sevincli, şən",
    "meaning_en": "Happy, fortunate; Successful, prosperous; Joyful, cheerful",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Bəhram", "Bəhlul", "Bəşir"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 559,
    "name": "Cəfər",
    "name_en": "Jafar",
    "meaning": "Çay; Bərəkət, bolluq; Xeyir, fayda",
    "meaning_en": "River; Abundance, plenty; Good, benefit",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ceyhun", "Cəlal", "Cəmil"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 560,
    "name": "Dəyanət",
    "name_en": "Dayanat",
    "meaning": "Dindarlıq, iman; Sədaqət, vəfadarlıq; Əxlaq, fəzilət",
    "meaning_en": "Piety, faith; Loyalty, fidelity; Morality, virtue",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zahid", "Təqva", "İman"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 561,
    "name": "Elçin",
    "name_en": "Elchin",
    "meaning": "Xalqın elçisi; Nümayəndə, səfir; Xalqın sevimli oğlu",
    "meaning_en": "Envoy of the people; Representative, ambassador; Beloved son of the people",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elnur", "Elşən"],
    "popularity": 80,
    "viewCount": 0
  },
  {
    "id": 562,
    "name": "Fərid",
    "name_en": "Farid",
    "meaning": "Yeganə, tək; Bənzərsiz, nadir; Qiymətli, dəyərli",
    "meaning_en": "Unique, sole; Unparalleled, rare; Valuable, precious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fərhad", "Fəxri", "Fəzil"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 563,
    "name": "Hüseyn",
    "name_en": "Huseyn",
    "meaning": "Gözəl, yaraşıqlı; Yaxşı, xeyirli; Müqəddəs, pak",
    "meaning_en": "Beautiful, handsome; Good, beneficial; Sacred, pure",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Həsən", "Həmid", "Həkim"],
    "popularity": 90,
    "viewCount": 0
  },
  {
    "id": 564,
    "name": "İbrahim",
    "name_en": "Ibrahim",
    "meaning": "Çoxsaylı xalqın atası; Ulu, hörmətli; Peyğəmbər adı",
    "meaning_en": "Father of a multitude; Great, respected; Prophet's name",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["İsmayıl", "İlyas", "İdris"],
    "popularity": 83,
    "viewCount": 0
  },
  {
    "id": 565,
    "name": "Kərim",
    "name_en": "Karim",
    "meaning": "Səxavətli, cömərd; Mərhəmətli, şəfqətli; Dəyərli, qiymətli",
    "meaning_en": "Generous, benevolent; Merciful, compassionate; Valuable, precious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Kamil", "Kamal", "Kənan"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 566,
    "name": "Mübariz",
    "name_en": "Mubariz",
    "meaning": "Döyüşçü, qəhrəman; İgid, cəsur; Mübarizə aparan",
    "meaning_en": "Warrior, hero; Brave, courageous; One who struggles",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Müslüm", "Müşfiq", "Mütəllim"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 567,
    "name": "Namiq",
    "name_en": "Namiq",
    "meaning": "Məktub yazan; Yazıçı, şair; Danışan, natiq",
    "meaning_en": "Letter writer; Writer, poet; Speaker, orator",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Nəsir", "Nəbi", "Nəzim"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 568,
    "name": "Orxan",
    "name_en": "Orkhan",
    "meaning": "Böyük xan, hökmdar; Lider, başçı; Güclü, qüdrətli",
    "meaning_en": "Great khan, ruler; Leader, chief; Strong, powerful",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Oqtay", "Osman", "Oruc"],
    "popularity": 80,
    "viewCount": 0
  },
  {
    "id": 569,
    "name": "Qəhrəman",
    "name_en": "Gahraman",
    "meaning": "Qəhrəman, igid; Cəsur, qoçaq; Qorxmaz, ürəkli",
    "meaning_en": "Hero, brave; Courageous, valiant; Fearless, hearty",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Qədir", "Qasım", "Qurban"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 570,
    "name": "Rəsul",
    "name_en": "Rasul",
    "meaning": "Elçi, peyğəmbər; Xəbərçi, müjdəçi; Dindar, müqəddəs",
    "meaning_en": "Messenger, prophet; Bearer of news, harbinger; Religious, sacred",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Rəhim", "Rəşad", "Rəfiq"],
    "popularity": 79,
    "viewCount": 0
  },
  {
    "id": 571,
    "name": "Ruslan",
    "name_en": "Ruslan",
    "meaning": "Şir kimi; Güclü, qüvvətli; Qəhrəman, igid",
    "meaning_en": "Like a lion; Strong, powerful; Hero, brave",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Rüstəm", "Rafiq", "Ramil"],
    "popularity": 81,
    "viewCount": 0
  },
  {
    "id": 572,
    "name": "Turan",
    "name_en": "Turan",
    "meaning": "Vətən, yurd; Torpaq, diyar; Güclü, qüdrətli",
    "meaning_en": "Homeland, country; Land, region; Strong, powerful",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Tural", "Turgut", "Turxan"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 573,
    "name": "Üzeyir",
    "name_en": "Uzeyir",
    "meaning": "Köməkçi, yardımçı; Dəstək, himayədar; Xeyirxah, yaxşı",
    "meaning_en": "Helper, assistant; Support, patron; Benevolent, good",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ülvi", "Ümid", "Ürfan"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 574,
    "name": "Vəli",
    "name_en": "Vali",
    "meaning": "Dost, yaxın; Himayədar, qoruyucu; Müqəddəs, uca",
    "meaning_en": "Friend, close; Patron, protector; Sacred, sublime",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Vüsal", "Vaqif", "Vasif"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 575,
    "name": "Xəyal",
    "name_en": "Khayal",
    "meaning": "Xəyal, arzu; Yuxu, fantaziya; Gözəl, sirli",
    "meaning_en": "Dream, wish; Sleep, fantasy; Beautiful, mysterious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Röya", "Arzu", "Ümid"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 576,
    "name": "Yusif",
    "name_en": "Yusif",
    "meaning": "Allah artırsın; Çoxaltsın, bərəkətli; Gözəl, yaraşıqlı",
    "meaning_en": "May Allah increase; Multiply, blessed; Beautiful, handsome",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Yaqub", "Yaşar", "Davud"],
    "popularity": 86,
    "viewCount": 0
  },
  {
    "id": 577,
    "name": "Zakir",
    "name_en": "Zakir",
    "meaning": "Zikr edən, anan; Xatırlayan, yad edən; Dindar, təqvalı",
    "meaning_en": "One who remembers, mentions; Recaller, commemorator; Religious, pious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zahid", "Zaur", "Zəfər"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 578,
    "name": "Əkbər",
    "name_en": "Akbar",
    "meaning": "Ən böyük, uca; Əzəmətli, qüdrətli; Şərəfli, hörmətli",
    "meaning_en": "The greatest, sublime; Grand, powerful; Honorable, respected",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əli", "Əmir", "Əliyar"],
    "popularity": 82,
    "viewCount": 0
  },
  {
    "id": 579,
    "name": "Şəmsi",
    "name_en": "Shamsi",
    "meaning": "Günəşə aid; Parlaq, işıqlı; Nurani, gözəl",
    "meaning_en": "Related to the sun; Bright, luminous; Radiant, beautiful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Şəms", "Günay", "Ay"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 580,
    "name": "Adil",
    "name_en": "Adil",
    "meaning": "Ədalətli, haqqsevər; Düzgün, dürüst; Ədalətli hökmdar",
    "meaning_en": "Just, righteous; Correct, honest; Just ruler",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ədalət", "Haqq", "Düzgün"],
    "popularity": 85,
    "viewCount": 0
  },
  {
    "id": 581,
    "name": "Cəlaləddin",
    "name_en": "Jalaladdin",
    "meaning": "Dinin əzəməti; Böyük, uca; Şərəfli, hörmətli",
    "meaning_en": "Grandeur of religion; Great, sublime; Honorable, respected",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Cəlal", "Kəmaləddin", "Nəcməddin"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 582,
    "name": "Elmar",
    "name_en": "Elmar",
    "meaning": "Elin maralı; Xalqın sevimli oğlu; Gözəl, yaraşıqlı",
    "meaning_en": "Charm of the people; Beloved son of the nation; Beautiful, handsome",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elnur", "Elçin"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 583,
    "name": "Fəxrəddin",
    "name_en": "Fakhreddin",
    "meaning": "Dinin fəxri; Şərəfli, hörmətli; Müqəddəs, uca",
    "meaning_en": "Pride of religion; Honorable, respected; Sacred, sublime",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fəxri", "Fəzil", "Fərid"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 584,
    "name": "Həkim",
    "name_en": "Hakim",
    "meaning": "Həkim; Müdrik, ağıllı; Bilikli, dərrakəli",
    "meaning_en": "Doctor; Wise, intelligent; Knowledgeable, perceptive",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Həsən", "Hüseyn", "Həmid"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 585,
    "name": "İlham",
    "name_en": "Ilham",
    "meaning": "İlham, ruh; Təşviq, həvəs; Yaradıcılıq, istedad",
    "meaning_en": "Inspiration, spirit; Encouragement, enthusiasm; Creativity, talent",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["İlkin", "İlqar", "İlyas"],
    "popularity": 79,
    "viewCount": 0
  },
  {
    "id": 586,
    "name": "Kənan",
    "name_en": "Kenan",
    "meaning": "Qədim ölkə adı; Müqəddəs, uca; Bərəkətli, zəngin",
    "meaning_en": "Ancient country name; Sacred, sublime; Fertile, rich",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Kərim", "Kamil", "Kamal"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 587,
    "name": "Məlik",
    "name_en": "Malik",
    "meaning": "Padşah, hökmdar; Rəhbər, başçı; Güclü, qüdrətli",
    "meaning_en": "King, ruler; Leader, chief; Strong, powerful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Məhəmməd", "Məhərrəm", "Sultan"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 588,
    "name": "Nəzim",
    "name_en": "Nazim",
    "meaning": "Şair, nazim; Yazıçı, ədib; Nizamlı, qaydalı",
    "meaning_en": "Poet, composer; Writer, author; Orderly, disciplined",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Namiq", "Nəsir", "Nəbi"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 589,
    "name": "Rəhim",
    "name_en": "Rahim",
    "meaning": "Mərhəmətli, şəfqətli; Cömərd, səxavətli; Bağışlayan, əfv edən",
    "meaning_en": "Merciful, compassionate; Generous, benevolent; Forgiving, pardoning",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Rəşad", "Rəsul", "Rəfiq"],
    "popularity": 78,
    "viewCount": 0
  },
  {
    "id": 590,
    "name": "Səbuhi",
    "name_en": "Sabuh",
    "meaning": "Səhərə aid; Təzə, yeni; Gözəl, parlaq",
    "meaning_en": "Related to dawn; Fresh, new; Beautiful, bright",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Samir", "Səmər", "Sənan"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 591,
    "name": "Teymur",
    "name_en": "Teymur",
    "meaning": "Dəmir kimi möhkəm; Güclü, dözümlü; Qəhrəman, igid",
    "meaning_en": "Strong as iron; Powerful, resilient; Hero, brave",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Dəmir", "Polad", "Rüstəm"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 592,
    "name": "Vaqif",
    "name_en": "Vagif",
    "meaning": "Bilən, xəbərdar; Ağıllı, müdrik; Anlayan, dərk edən",
    "meaning_en": "Knowing, aware; Intelligent, wise; Understanding, perceiving",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Vüsal", "Vəli", "Vasif"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 593,
    "name": "Zaur",
    "name_en": "Zaur",
    "meaning": "Ziyarət edən; Gəzən, səyyah; Açıq, səmimi",
    "meaning_en": "Visitor; Wanderer, traveler; Open, sincere",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zahid", "Zəfər", "Zakir"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 594,
    "name": "Ənvər",
    "name_en": "Anvar",
    "meaning": "Çox nurlu, çox işıqlı; Parlaq, gözəl; Aydın, aydınlıq",
    "meaning_en": "Very luminous, very bright; Radiant, beautiful; Clear, clarity",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əli", "Əmir", "Əkbər"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 595,
    "name": "Şahin",
    "name_en": "Shahin",
    "meaning": "Şahin quşu; Cəsur, igid; Sürətli, cəld",
    "meaning_en": "Falcon bird; Brave, valiant; Fast, agile",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Şəhriyar", "Şəmsi", "Şamil"],
    "popularity": 81,
    "viewCount": 0
  },
  {
    "id": 596,
    "name": "Arif",
    "name_en": "Arif",
    "meaning": "Bilikli, dərrakəli; Ağıllı, müdrik; Tanıyan, bilən",
    "meaning_en": "Knowledgeable, perceptive; Intelligent, wise; One who knows, recognizes",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Arifa", "Ürfan", "Həkim"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 597,
    "name": "Bəşir",
    "name_en": "Bashir",
    "meaning": "Müjdəçi, xəbərçi; Sevimli, xoş; Xeyirxah, yaxşı",
    "meaning_en": "Bearer of good news, harbinger; Beloved, pleasant; Benevolent, good",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Bəxtiyar", "Bəhram", "Bəhlul"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 598,
    "name": "Cahid",
    "name_en": "Jahid",
    "meaning": "Çalışan, səy göstərən; Fəal, enerjili; Zəhmətkeş",
    "meaning_en": "Striving, endeavoring; Active, energetic; Hardworking",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Cavid", "Cavad", "Camal"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 599,
    "name": "Dadaş",
    "name_en": "Dadash",
    "meaning": "Böyük qardaş; Dost, yoldaş; Hörmətli, sevimli",
    "meaning_en": "Big brother; Friend, companion; Respected, beloved",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Əli", "Əmir", "Əkbər"],
    "popularity": 65,
    "viewCount": 0
  },
  {
    "id": 600,
    "name": "Elşad",
    "name_en": "Elshad",
    "meaning": "Elin şadlığı, xalqın sevinci; Şən, xoşbəxt; Sevincli, bəxtiyar",
    "meaning_en": "Joy of the people, happiness of the nation; Cheerful, happy; Joyful, fortunate",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elnur", "Elçin"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 601,
    "name": "Fəzil",
    "name_en": "Fazil",
    "meaning": "Fəzilətli, üstün; Yüksək, uca; Əxlaqlı, dürüst",
    "meaning_en": "Virtuous, superior; High, sublime; Moral, honest",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fərid", "Fərhad", "Fəxri"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 602,
    "name": "Həsrət",
    "name_en": "Hasrat",
    "meaning": "Həsrət, intizar; Arzu, istək; Sevimli, əziz",
    "meaning_en": "Longing, yearning; Desire, wish; Beloved, dear",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ümid", "Xəyal", "Arzu"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 603,
    "name": "İlyas",
    "name_en": "Ilyas",
    "meaning": "Peyğəmbər adı; Müqəddəs, uca; Dindar, inanclı",
    "meaning_en": "Prophet's name; Sacred, sublime; Religious, faithful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["İbrahim", "İsmayıl", "İdris"],
    "popularity": 78,
    "viewCount": 0
  },
  {
    "id": 604,
    "name": "Məhərrəm",
    "name_en": "Muharram",
    "meaning": "Müqəddəs, toxunulmaz; Uca, böyük; Hörmətli, dəyərli",
    "meaning_en": "Sacred, inviolable; Sublime, great; Respected, valuable",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Məhəmməd", "Məlik", "Məhəbbət"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 605,
    "name": "Nicat",
    "name_en": "Nijat",
    "meaning": "Qurtuluş, xilas; Azadlıq, azad olma; Uğur, müvəffəqiyyət",
    "meaning_en": "Salvation, deliverance; Freedom, liberation; Success, achievement",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Niyaz", "Nəsir", "Nəzim"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 606,
    "name": "Qurban",
    "name_en": "Gurban",
    "meaning": "Qurban; Fədakarlıq, sədaqət; Allah yolunda fəda",
    "meaning_en": "Sacrifice; Devotion, loyalty; Sacrifice in the way of Allah",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Qədir", "Qasım", "Qəhrəman"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 607,
    "name": "Rəvan",
    "name_en": "Ravan",
    "meaning": "Axan, gedən; Səyyah, gəzən; Ruhən azad",
    "meaning_en": "Flowing, going; Traveler, wanderer; Spiritually free",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Rəşad", "Rəsul", "Rəfiq"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 608,
    "name": "Səmər",
    "name_en": "Samar",
    "meaning": "Meyvə, bəhrə; Nəticə, fayda; Uğur, müvəffəqiyyət",
    "meaning_en": "Fruit, yield; Result, benefit; Success, achievement",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Samir", "Sənan", "Səbuhi"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 609,
    "name": "Turxan",
    "name_en": "Turkhan",
    "meaning": "Türk xanı; Güclü, qüdrətli; Lider, başçı",
    "meaning_en": "Turkic khan; Strong, powerful; Leader, chief",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Tural", "Turan", "Turgut"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 610,
    "name": "Vasif",
    "name_en": "Vasif",
    "meaning": "Tərifçi, həmdedici; Öyən, mədh edən; Təsvir edən",
    "meaning_en": "Praiser, glorifier; Extoller, eulogizer; Describer",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Vüsal", "Vəli", "Vaqif"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 611,
    "name": "Zahid",
    "name_en": "Zahid",
    "meaning": "Dindar, təqvalı; Zəhmətkeş, çalışqan; Səbirli, dözümlü",
    "meaning_en": "Religious, pious; Hardworking, diligent; Patient, enduring",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zaur", "Zəfər", "Zakir"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 612,
    "name": "Əliyar",
    "name_en": "Aliyar",
    "meaning": "Əlinin dostu; Yaxın, sirdaş; Sadiq, vəfalı",
    "meaning_en": "Friend of Ali; Close, confidant; Loyal, faithful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əli", "Əmir", "Əkbər"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 613,
    "name": "Şəhriyar",
    "name_en": "Shahriyar",
    "meaning": "Şəhər hökmdarı; Böyük, əzəmətli; Lider, başçı",
    "meaning_en": "Ruler of the city; Great, grand; Leader, chief",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Şahin", "Şamil", "Şəmsi"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 614,
    "name": "Ağamir",
    "name_en": "Aghamir",
    "meaning": "Böyük əmir; Hörmətli, nüfuzlu; Lider, başçı",
    "meaning_en": "Great emir; Respected, influential; Leader, chief",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əmir", "Ağabəy", "Əli"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 615,
    "name": "Bəhlul",
    "name_en": "Bahlul",
    "meaning": "Şən, xoşhəl; Gülərüz, sevincli; Ağıllı, müdrik",
    "meaning_en": "Cheerful, happy; Smiling, joyful; Intelligent, wise",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Bəxtiyar", "Bəhram", "Bəşir"],
    "popularity": 66,
    "viewCount": 0
  },
  {
    "id": 616,
    "name": "Cavad",
    "name_en": "Javad",
    "meaning": "Səxavətli, cömərd; Əliaçıq, xeyirxah; Dəyərli, qiymətli",
    "meaning_en": "Generous, benevolent; Open-handed, kind; Valuable, precious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Cavid", "Cahid", "Camal"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 617,
    "name": "Dəmirçi",
    "name_en": "Damirchi",
    "meaning": "Dəmirçi; Güclü, möhkəm; Zəhmətkeş, çalışqan",
    "meaning_en": "Blacksmith; Strong, firm; Hardworking, diligent",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Dəmir", "Polad", "Teymur"],
    "popularity": 65,
    "viewCount": 0
  },
  {
    "id": 618,
    "name": "Elnur",
    "name_en": "Elnur",
    "meaning": "Xalqın nuru, elin işığı; Parlaq, aydın; Gözəl, nurani",
    "meaning_en": "Light of the people, illumination of the nation; Bright, clear; Beautiful, radiant",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elçin", "Elşən"],
    "popularity": 82,
    "viewCount": 0
  },
  {
    "id": 619,
    "name": "Fəxri",
    "name_en": "Fakhri",
    "meaning": "Fəxr edən, qürurlu; Şərəfli, hörmətli; Dəyərli, qiymətli",
    "meaning_en": "Proud, honorable; Glorious, respected; Valuable, precious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fərid", "Fərhad", "Fəzil"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 620,
    "name": "Həmdulla",
    "name_en": "Hamdullah",
    "meaning": "Allaha həmd edən; Şükür edən; Dindar, təqvalı",
    "meaning_en": "One who praises Allah; Grateful; Religious, pious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Həmid", "Abdulla", "Allahverdi"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 621,
    "name": "İdris",
    "name_en": "Idris",
    "meaning": "Peyğəmbər adı; Müdrik, ağıllı; Bilikli, dərrakəli",
    "meaning_en": "Prophet's name; Wise, intelligent; Knowledgeable, perceptive",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["İbrahim", "İsmayıl", "İlyas"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 622,
    "name": "Kamil",
    "name_en": "Kamil",
    "meaning": "Mükəmməl, tam; Bitkin, yetkin; Fəzilətli, əxlaqlı",
    "meaning_en": "Perfect, complete; Mature, accomplished; Virtuous, moral",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Kərim", "Kamal", "Kənan"],
    "popularity": 78,
    "viewCount": 0
  },
  {
    "id": 623,
    "name": "Müslüm",
    "name_en": "Muslim",
    "meaning": "Müsəlman; Dindar, inanclı; Təqvalı, saleh",
    "meaning_en": "Muslim; Religious, faithful; Pious, righteous",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Mübariz", "Müşfiq", "Mütəllim"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 624,
    "name": "Nəbi",
    "name_en": "Nabi",
    "meaning": "Peyğəmbər, elçi; Xəbərçi, müjdəçi; Müqəddəs, uca",
    "meaning_en": "Prophet, messenger; Bearer of news, harbinger; Sacred, sublime",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Namiq", "Nəsir", "Nəzim"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 625,
    "name": "Oruc",
    "name_en": "Oruj",
    "meaning": "Oruc tutan; Dindar, inanclı; Səbirli, dözümlü",
    "meaning_en": "One who fasts; Religious, faithful; Patient, enduring",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Orxan", "Osman", "Oqtay"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 626,
    "name": "Polad",
    "name_en": "Polad",
    "meaning": "Polad; Möhkəm, güclü; Dözümlü, səbirli",
    "meaning_en": "Steel; Firm, strong; Resilient, patient",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Dəmir", "Teymur", "Rüstəm"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 627,
    "name": "Qədirli",
    "name_en": "Gadirli",
    "meaning": "Qüdrətli, güclü; Dəyərli, qiymətli; Hörmətli, nüfuzlu",
    "meaning_en": "Powerful, strong; Valuable, precious; Respected, influential",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Qədir", "Qasım", "Qəhrəman"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 628,
    "name": "Rüstəm",
    "name_en": "Rustam",
    "meaning": "Qəhrəman, igid; Güclü, qüvvətli; Qoçaq, cəsur",
    "meaning_en": "Hero, brave; Strong, powerful; Valiant, courageous",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Ruslan", "Rafiq", "Ramil"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 629,
    "name": "Sənan",
    "name_en": "Sanan",
    "meaning": "Nizə ucu; Kəskin, iti; Ağıllı, zəkalı",
    "meaning_en": "Spearhead; Sharp, keen; Intelligent, clever",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Samir", "Səmər", "Səbuhi"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 630,
    "name": "Turgut",
    "name_en": "Turgut",
    "meaning": "Ayağa qalxan, dirçələn; Güclü, qüvvətli; İgid, cəsur",
    "meaning_en": "One who rises, revives; Strong, powerful; Brave, courageous",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Tural", "Turan", "Turxan"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 631,
    "name": "Vüsal",
    "name_en": "Vusal",
    "meaning": "Qovuşma, birləşmə; Çatma, nailiyyət; Xoşbəxtlik, sevinc",
    "meaning_en": "Reunion, union; Attainment, achievement; Happiness, joy",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Vəli", "Vaqif", "Vasif"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 632,
    "name": "Yaşar",
    "name_en": "Yashar",
    "meaning": "Yaşayan, həyat sürən; Uzunömürlü; Canlı, dinamik",
    "meaning_en": "Living, enduring life; Long-lived; Lively, dynamic",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Yusif", "Yaqub", "Yasəmən"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 633,
    "name": "Zakir",
    "name_en": "Zakir",
    "meaning": "Zikr edən, anan; Xatırlayan, yad edən; Dindar, təqvalı",
    "meaning_en": "One who remembers, mentions; Recaller, commemorator; Religious, pious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zahid", "Zaur", "Zəfər"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 634,
    "name": "Əmir",
    "name_en": "Amir",
    "meaning": "Hökmdar, əmir; Rəhbər, başçı; Güclü, qüdrətli",
    "meaning_en": "Ruler, emir; Leader, chief; Strong, powerful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əli", "Əliyar", "Əkbər"],
    "popularity": 79,
    "viewCount": 0
  },
  {
    "id": 635,
    "name": "Şəmsəddin",
    "name_en": "Shamsaddin",
    "meaning": "Dinin günəşi; Parlaq, işıqlı; Müqəddəs, uca",
    "meaning_en": "Sun of religion; Bright, luminous; Sacred, sublime",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Şəmsi", "Nəcməddin", "Cəlaləddin"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 636,
    "name": "Aydın",
    "name_en": "Aydin",
    "meaning": "Aydın, parlaq; İşıqlı, nurani; Açıq, səmimi",
    "meaning_en": "Clear, bright; Luminous, radiant; Open, sincere",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Ayan", "Elnur", "Günay"],
    "popularity": 88,
    "viewCount": 0
  },
  {
    "id": 637,
    "name": "Bəhruz",
    "name_en": "Behruz",
    "meaning": "Xoşbəxt gün; Uğurlu, bəxtiyar; Sevincli, şən",
    "meaning_en": "Happy day; Successful, fortunate; Joyful, cheerful",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Bəxtiyar", "Bəhlul", "Bəşir"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 638,
    "name": "Cavidan",
    "name_en": "Javidan",
    "meaning": "Əbədi, sonsuz; Daimi, ölməz; Uzunömürlü",
    "meaning_en": "Eternal, endless; Permanent, immortal; Long-lived",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Cavid", "Cavad", "Camal"],
    "popularity": 79,
    "viewCount": 0
  },
  {
    "id": 639,
    "name": "Dəmir",
    "name_en": "Damir",
    "meaning": "Dəmir; Möhkəm, güclü; Dözümlü, səbirli",
    "meaning_en": "Iron; Firm, strong; Resilient, patient",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Teymur", "Polad", "Dəmirçi"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 640,
    "name": "Elxan",
    "name_en": "Elkhan",
    "meaning": "Elin xanı, xalqın hökmdarı; Lider, başçı; Güclü, qüdrətli",
    "meaning_en": "Khan of the people, ruler of the nation; Leader, chief; Strong, powerful",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elnur", "Elçin"],
    "popularity": 78,
    "viewCount": 0
  },
  {
    "id": 641,
    "name": "Fikrət",
    "name_en": "Fikrat",
    "meaning": "Fikir, düşüncə; Ağıllı, müdrik; Dərrakəli, zəkalı",
    "meaning_en": "Thought, idea; Intelligent, wise; Perceptive, clever",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fərid", "Fəxri", "Fəzil"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 642,
    "name": "Gündüz",
    "name_en": "Gunduz",
    "meaning": "Günəş, işıq; Aydınlıq, parlaqlıq; Xoşbəxt, sevincli",
    "meaning_en": "Sun, light; Brightness, radiance; Happy, joyful",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Günay", "Günel", "Ay"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 643,
    "name": "Həmid",
    "name_en": "Hamid",
    "meaning": "Həmd edən, tərifləyən; Şükür edən; Mərhəmətli, şəfqətli",
    "meaning_en": "One who praises, glorifies; Grateful; Merciful, compassionate",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Həsən", "Hüseyn", "Həkim"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 644,
    "name": "İlkin",
    "name_en": "Ilkin",
    "meaning": "İlk, əvvəl; Başlanğıc, təməl; Öncül, lider",
    "meaning_en": "First, initial; Beginning, foundation; Pioneer, leader",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["İlqar", "İlham", "İlyas"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 645,
    "name": "Kəmaləddin",
    "name_en": "Kemaleddin",
    "meaning": "Dinin kamillığı; Mükəmməl, uca; Fəzilətli, əxlaqlı",
    "meaning_en": "Perfection of religion; Perfect, sublime; Virtuous, moral",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Kərim", "Kamil", "Kənan"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 646,
    "name": "Ləman",
    "name_en": "Laman",
    "meaning": "Parlaqlıq, işıq; Zərif, incə; Gözəl, cazibədar",
    "meaning_en": "Brightness, light; Delicate, subtle; Beautiful, charming",
    "gender": "qız",
    "origin": "ərəb",
    "similar": ["Leyla", "Lalə", "Lətifə"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 647,
    "name": "Məhəmməd",
    "name_en": "Muhammad",
    "meaning": "Təriflənən, həmd olunan; Uca, böyük; Müqəddəs, xeyirli",
    "meaning_en": "Praised, glorified; Sublime, great; Sacred, beneficial",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Məmməd", "Məlik", "Məhərrəm"],
    "popularity": 90,
    "viewCount": 0
  },
  {
    "id": 648,
    "name": "Nəsibə",
    "name_en": "Nasiba",
    "meaning": "Nəsib, qismət; Tale, bəxt; Uğur, müvəffəqiyyət",
    "meaning_en": "Destiny, fate; Fortune, luck; Success, achievement",
    "gender": "qız",
    "origin": "ərəb",
    "similar": ["Nəzakət", "Nəfisə", "Nəcibə"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 649,
    "name": "Pənah",
    "name_en": "Panah",
    "meaning": "Sığınacaq, qoruyucu; Himayədar, dəstək; Xilaskar, nicat",
    "meaning_en": "Shelter, protector; Patron, support; Savior, salvation",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Pəri", "Pərvanə", "Pərvin"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 650,
    "name": "Qədir",
    "name_en": "Gadir",
    "meaning": "Qüdrətli, güclü; Əzəmətli, uca; Dəyərli, qiymətli",
    "meaning_en": "Powerful, strong; Grand, sublime; Valuable, precious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Qasım", "Qəhrəman", "Qurban"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 651,
    "name": "Ramil",
    "name_en": "Ramil",
    "meaning": "Atıcı, nişançı; Dəqiq, hədəfə vuran; Cəsur, igid",
    "meaning_en": "Archer, marksman; Accurate, hitting the target; Brave, valiant",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ruslan", "Rüstəm", "Rafiq"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 652,
    "name": "Sənan",
    "name_en": "Sanan",
    "meaning": "Nizə ucu; Kəskin, iti; Ağıllı, zəkalı",
    "meaning_en": "Spearhead; Sharp, keen; Intelligent, clever",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Samir", "Səmər", "Səbuhi"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 653,
    "name": "Tərlan",
    "name_en": "Tarlan",
    "meaning": "Qartal; Güclü, cəsur; Azad, sərbəst",
    "meaning_en": "Eagle; Strong, courageous; Free, independent",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Tural", "Turan", "Turxan"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 654,
    "name": "Ümid",
    "name_en": "Umid",
    "meaning": "Ümid, arzu; Gələcək, perspektiv; Müsbət, nikbin",
    "meaning_en": "Hope, wish; Future, prospect; Positive, optimistic",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ülvi", "Ürfan", "Üzeyir"],
    "popularity": 84,
    "viewCount": 0
  },
  {
    "id": 655,
    "name": "Vaqif",
    "name_en": "Vagif",
    "meaning": "Bilən, xəbərdar; Ağıllı, müdrik; Anlayan, dərk edən",
    "meaning_en": "Knowing, aware; Intelligent, wise; Understanding, perceiving",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Vüsal", "Vəli", "Vasif"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 656,
    "name": "Zahid",
    "name_en": "Zahid",
    "meaning": "Dindar, təqvalı; Zəhmətkeş, çalışqan; Səbirli, dözümlü",
    "meaning_en": "Religious, pious; Hardworking, diligent; Patient, enduring",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zaur", "Zəfər", "Zakir"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 657,
    "name": "Ədalət",
    "name_en": "Adalat",
    "meaning": "Ədalət, haqq; Düzgünlük, dürüstlük; Haqqsevər",
    "meaning_en": "Justice, right; Correctness, honesty; Lover of justice",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əhməd", "Əsgər", "Əziz"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 658,
    "name": "Şəhriyar",
    "name_en": "Shahriyar",
    "meaning": "Şəhər hökmdarı; Böyük, əzəmətli; Lider, başçı",
    "meaning_en": "Ruler of the city; Great, grand; Leader, chief",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Şahin", "Şamil", "Şəmsi"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 659,
    "name": "Ağabəy",
    "name_en": "Aghabey",
    "meaning": "Böyük bəy, hörmətli ağa; Lider, rəhbər; Nüfuzlu, hörmətli",
    "meaning_en": "Great bey, respected master; Leader, chief; Influential, respected",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Əli", "Əmir", "Əkbər"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 660,
    "name": "Cəlal",
    "name_en": "Jalal",
    "meaning": "Böyüklük, əzəmət; Şan, şöhrət; Hörmət, ləyaqət",
    "meaning_en": "Greatness, grandeur; Glory, fame; Respect, dignity",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ceyhun", "Cəmil", "Cəfər"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 661,
    "name": "Dadaş",
    "name_en": "Dadash",
    "meaning": "Böyük qardaş; Dost, yoldaş; Hörmətli, sevimli",
    "meaning_en": "Big brother; Friend, companion; Respected, beloved",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Əli", "Əmir", "Əkbər"],
    "popularity": 65,
    "viewCount": 0
  },
  {
    "id": 662,
    "name": "Elmar",
    "name_en": "Elmar",
    "meaning": "Elin maralı; Xalqın sevimli oğlu; Gözəl, yaraşıqlı",
    "meaning_en": "Charm of the people; Beloved son of the nation; Beautiful, handsome",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elnur", "Elçin"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 663,
    "name": "Fəxrəddin",
    "name_en": "Fakhreddin",
    "meaning": "Dinin fəxri; Şərəfli, hörmətli; Müqəddəs, uca",
    "meaning_en": "Pride of religion; Honorable, respected; Sacred, sublime",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fəxri", "Fəzil", "Fərid"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 664,
    "name": "Gündüz",
    "name_en": "Gunduz",
    "meaning": "Günəş, işıq; Aydınlıq, parlaqlıq; Xoşbəxt, sevincli",
    "meaning_en": "Sun, light; Brightness, radiance; Happy, joyful",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Günay", "Günel", "Ay"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 665,
    "name": "Həmid",
    "name_en": "Hamid",
    "meaning": "Həmd edən, tərifləyən; Şükür edən; Mərhəmətli, şəfqətli",
    "meaning_en": "One who praises, glorifies; Grateful; Merciful, compassionate",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Həsən", "Hüseyn", "Həkim"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 666,
    "name": "İlkin",
    "name_en": "Ilkin",
    "meaning": "İlk, əvvəl; Başlanğıc, təməl; Öncül, lider",
    "meaning_en": "First, initial; Beginning, foundation; Pioneer, leader",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["İlqar", "İlham", "İlyas"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 667,
    "name": "Kəmaləddin",
    "name_en": "Kemaleddin",
    "meaning": "Dinin kamillığı; Mükəmməl, uca; Fəzilətli, əxlaqlı",
    "meaning_en": "Perfection of religion; Perfect, sublime; Virtuous, moral",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Kərim", "Kamil", "Kənan"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 668,
    "name": "Lətif",
    "name_en": "Latif",
    "meaning": "Zərif, nazik; Yumşaq, incə; Xoş, lütfkar",
    "meaning_en": "Delicate, thin; Soft, gentle; Pleasant, gracious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ləti", "Ləman", "Lalə"],
    "popularity": 65,
    "viewCount": 0
  },
  {
    "id": 669,
    "name": "Məmməd",
    "name_en": "Mammad",
    "meaning": "Təriflənən, həmd olunan; Uca, böyük; Müqəddəs, xeyirli",
    "meaning_en": "Praised, glorified; Sublime, great; Sacred, beneficial",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Məhəmməd", "Məlik", "Məhərrəm"],
    "popularity": 90,
    "viewCount": 0
  },
  {
    "id": 670,
    "name": "Nəsib",
    "name_en": "Nasib",
    "meaning": "Nəsib, qismət; Tale, bəxt; Uğur, müvəffəqiyyət",
    "meaning_en": "Destiny, fate; Fortune, luck; Success, achievement",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Niyaz", "Nəsir", "Nəzim"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 671,
    "name": "Oqtay",
    "name_en": "Ogtay",
    "meaning": "Ox kimi sürətli; Cəld, çevik; Ağıllı, zəkalı",
    "meaning_en": "Fast as an arrow; Agile, nimble; Intelligent, clever",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Orxan", "Osman", "Oruc"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 672,
    "name": "Pərviz",
    "name_en": "Parviz",
    "meaning": "Uğurlu, bəxtiyar; Xoşbəxt, sevincli; Qalib, zəfər çalan",
    "meaning_en": "Successful, fortunate; Happy, joyful; Victorious, triumphant",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Pənah", "Pərvin", "Bəxtiyar"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 673,
    "name": "Qasım",
    "name_en": "Gasim",
    "meaning": "Bölən, paylayan; Ədalətli, haqqsevər; Cömərd, səxavətli",
    "meaning_en": "Divider, distributor; Just, righteous; Generous, benevolent",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Qədir", "Qəhrəman", "Qurban"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 674,
    "name": "Rəşad",
    "name_en": "Rashad",
    "meaning": "Doğru yol tapan; Hidayət edən; Ağıllı, müdrik",
    "meaning_en": "One who finds the right path; Guiding; Intelligent, wise",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Rəsul", "Rəhim", "Rəfiq"],
    "popularity": 80,
    "viewCount": 0
  },
  {
    "id": 675,
    "name": "Samir",
    "name_en": "Samir",
    "meaning": "Söhbət yoldaşı; Danışan, natiq; Dost, sirdaş",
    "meaning_en": "Conversation companion; Speaker, orator; Friend, confidant",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Səmər", "Sənan", "Səbuhi"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 676,
    "name": "Tural",
    "name_en": "Tural",
    "meaning": "Canlı, həyat dolu; Güclü, dözümlü; İgid, cəsur",
    "meaning_en": "Lively, full of life; Strong, resilient; Brave, courageous",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Turan", "Turgut", "Turxan"],
    "popularity": 85,
    "viewCount": 0
  },
  {
    "id": 677,
    "name": "Ürfan",
    "name_en": "Urphan",
    "meaning": "Bilik, mərifət; Ağıl, dərrakə; Hikmət, müdriklik",
    "meaning_en": "Knowledge, wisdom; Intellect, understanding; Wisdom, sagacity",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ülvi", "Ümid", "Üzeyir"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 678,
    "name": "Vüqar",
    "name_en": "Vugar",
    "meaning": "Qürur, əzəmət; Hörmət, ləyaqət; Uca, yüksək",
    "meaning_en": "Pride, grandeur; Respect, dignity; Lofty, high",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Vüsal", "Vəli", "Vaqif"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 679,
    "name": "Yaqub",
    "name_en": "Yagub",
    "meaning": "Peyğəmbər adı; Müqəddəs, uca; Dindar, inanclı",
    "meaning_en": "Prophet's name; Sacred, sublime; Religious, faithful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Yusif", "Yaşar", "Davud"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 680,
    "name": "Zəfər",
    "name_en": "Zafar",
    "meaning": "Zəfər, qələbə; Uğur, müvəffəqiyyət; Qalib, qalibiyyətli",
    "meaning_en": "Victory, triumph; Success, achievement; Victorious, winning",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zahid", "Zaur", "Zakir"],
    "popularity": 79,
    "viewCount": 0
  },
  {
    "id": 681,
    "name": "Əli",
    "name_en": "Ali",
    "meaning": "Yüksək, uca; Əzəmətli, böyük; Şərəfli, hörmətli",
    "meaning_en": "High, sublime; Grand, great; Honorable, respected",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əliyar", "Əmir", "Əkbər"],
    "popularity": 95,
    "viewCount": 0
  },
  {
    "id": 682,
    "name": "Şamil",
    "name_en": "Shamil",
    "meaning": "Hər şeyi əhatə edən; Tam, mükəmməl; Kapsamlı, geniş",
    "meaning_en": "All-encompassing; Complete, perfect; Comprehensive, broad",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Şahin", "Şəhriyar", "Şəmsi"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 683,
    "name": "Araz",
    "name_en": "Araz",
    "meaning": "Çay adı; Geniş, axar; Güclü, qüvvətli",
    "meaning_en": "River name; Wide, flowing; Strong, powerful",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Kür", "Dəniz", "Çay"],
    "popularity": 82,
    "viewCount": 0
  },
  {
    "id": 684,
    "name": "Bəxtiyar",
    "name_en": "Bakhtiyar",
    "meaning": "Xoşbəxt, bəxtli; Uğurlu, müvəffəqiyyətli; Sevincli, şən",
    "meaning_en": "Happy, fortunate; Successful, prosperous; Joyful, cheerful",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Bəhram", "Bəhlul", "Bəşir"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 685,
    "name": "Cəfər",
    "name_en": "Jafar",
    "meaning": "Çay; Bərəkət, bolluq; Xeyir, fayda",
    "meaning_en": "River; Abundance, plenty; Good, benefit",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ceyhun", "Cəlal", "Cəmil"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 686,
    "name": "Dəyanət",
    "name_en": "Dayanat",
    "meaning": "Dindarlıq, iman; Sədaqət, vəfadarlıq; Əxlaq, fəzilət",
    "meaning_en": "Piety, faith; Loyalty, fidelity; Morality, virtue",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zahid", "Təqva", "İman"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 687,
    "name": "Elçin",
    "name_en": "Elchin",
    "meaning": "Xalqın elçisi; Nümayəndə, səfir; Xalqın sevimli oğlu",
    "meaning_en": "Envoy of the people; Representative, ambassador; Beloved son of the people",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elnur", "Elşən"],
    "popularity": 80,
    "viewCount": 0
  },
  {
    "id": 688,
    "name": "Fərid",
    "name_en": "Farid",
    "meaning": "Yeganə, tək; Bənzərsiz, nadir; Qiymətli, dəyərli",
    "meaning_en": "Unique, sole; Unparalleled, rare; Valuable, precious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fərhad", "Fəxri", "Fəzil"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 689,
    "name": "Hüseyn",
    "name_en": "Huseyn",
    "meaning": "Gözəl, yaraşıqlı; Yaxşı, xeyirli; Müqəddəs, pak",
    "meaning_en": "Beautiful, handsome; Good, beneficial; Sacred, pure",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Həsən", "Həmid", "Həkim"],
    "popularity": 90,
    "viewCount": 0
  },
  {
    "id": 690,
    "name": "İbrahim",
    "name_en": "Ibrahim",
    "meaning": "Çoxsaylı xalqın atası; Ulu, hörmətli; Peyğəmbər adı",
    "meaning_en": "Father of a multitude; Great, respected; Prophet's name",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["İsmayıl", "İlyas", "İdris"],
    "popularity": 83,
    "viewCount": 0
  },
  {
    "id": 691,
    "name": "Kərim",
    "name_en": "Karim",
    "meaning": "Səxavətli, cömərd; Mərhəmətli, şəfqətli; Dəyərli, qiymətli",
    "meaning_en": "Generous, benevolent; Merciful, compassionate; Valuable, precious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Kamil", "Kamal", "Kənan"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 692,
    "name": "Mübariz",
    "name_en": "Mubariz",
    "meaning": "Döyüşçü, qəhrəman; İgid, cəsur; Mübarizə aparan",
    "meaning_en": "Warrior, hero; Brave, courageous; One who struggles",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Müslüm", "Müşfiq", "Mütəllim"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 693,
    "name": "Namiq",
    "name_en": "Namiq",
    "meaning": "Məktub yazan; Yazıçı, şair; Danışan, natiq",
    "meaning_en": "Letter writer; Writer, poet; Speaker, orator",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Nəsir", "Nəbi", "Nəzim"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 694,
    "name": "Orxan",
    "name_en": "Orkhan",
    "meaning": "Böyük xan, hökmdar; Lider, başçı; Güclü, qüdrətli",
    "meaning_en": "Great khan, ruler; Leader, chief; Strong, powerful",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Oqtay", "Osman", "Oruc"],
    "popularity": 80,
    "viewCount": 0
  },
  {
    "id": 695,
    "name": "Qəhrəman",
    "name_en": "Gahraman",
    "meaning": "Qəhrəman, igid; Cəsur, qoçaq; Qorxmaz, ürəkli",
    "meaning_en": "Hero, brave; Courageous, valiant; Fearless, hearty",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Qədir", "Qasım", "Qurban"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 696,
    "name": "Rəsul",
    "name_en": "Rasul",
    "meaning": "Elçi, peyğəmbər; Xəbərçi, müjdəçi; Dindar, müqəddəs",
    "meaning_en": "Messenger, prophet; Bearer of news, harbinger; Religious, sacred",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Rəhim", "Rəşad", "Rəfiq"],
    "popularity": 79,
    "viewCount": 0
  },
  {
    "id": 697,
    "name": "Ruslan",
    "name_en": "Ruslan",
    "meaning": "Şir kimi; Güclü, qüvvətli; Qəhrəman, igid",
    "meaning_en": "Like a lion; Strong, powerful; Hero, brave",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Rüstəm", "Rafiq", "Ramil"],
    "popularity": 81,
    "viewCount": 0
  },
  {
    "id": 698,
    "name": "Turan",
    "name_en": "Turan",
    "meaning": "Vətən, yurd; Torpaq, diyar; Güclü, qüdrətli",
    "meaning_en": "Homeland, country; Land, region; Strong, powerful",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Tural", "Turgut", "Turxan"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 699,
    "name": "Üzeyir",
    "name_en": "Uzeyir",
    "meaning": "Köməkçi, yardımçı; Dəstək, himayədar; Xeyirxah, yaxşı",
    "meaning_en": "Helper, assistant; Support, patron; Benevolent, good",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ülvi", "Ümid", "Ürfan"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 700,
    "name": "Vəli",
    "name_en": "Vali",
    "meaning": "Dost, yaxın; Himayədar, qoruyucu; Müqəddəs, uca",
    "meaning_en": "Friend, close; Patron, protector; Sacred, sublime",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Vüsal", "Vaqif", "Vasif"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 701,
    "name": "Xəyal",
    "name_en": "Khayal",
    "meaning": "Xəyal, arzu; Yuxu, fantaziya; Gözəl, sirli",
    "meaning_en": "Dream, wish; Sleep, fantasy; Beautiful, mysterious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Röya", "Arzu", "Ümid"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 702,
    "name": "Yusif",
    "name_en": "Yusif",
    "meaning": "Allah artırsın; Çoxaltsın, bərəkətli; Gözəl, yaraşıqlı",
    "meaning_en": "May Allah increase; Multiply, blessed; Beautiful, handsome",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Yaqub", "Yaşar", "Davud"],
    "popularity": 86,
    "viewCount": 0
  },
  {
    "id": 703,
    "name": "Zakir",
    "name_en": "Zakir",
    "meaning": "Zikr edən, anan; Xatırlayan, yad edən; Dindar, təqvalı",
    "meaning_en": "One who remembers, mentions; Recaller, commemorator; Religious, pious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zahid", "Zaur", "Zəfər"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 704,
    "name": "Əkbər",
    "name_en": "Akbar",
    "meaning": "Ən böyük, uca; Əzəmətli, qüdrətli; Şərəfli, hörmətli",
    "meaning_en": "The greatest, sublime; Grand, powerful; Honorable, respected",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əli", "Əmir", "Əliyar"],
    "popularity": 82,
    "viewCount": 0
  },
  {
    "id": 705,
    "name": "Şəmsi",
    "name_en": "Shamsi",
    "meaning": "Günəşə aid; Parlaq, işıqlı; Nurani, gözəl",
    "meaning_en": "Related to the sun; Bright, luminous; Radiant, beautiful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Şəms", "Günay", "Ay"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 706,
    "name": "Adil",
    "name_en": "Adil",
    "meaning": "Ədalətli, haqqsevər; Düzgün, dürüst; Ədalətli hökmdar",
    "meaning_en": "Just, righteous; Correct, honest; Just ruler",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ədalət", "Haqq", "Düzgün"],
    "popularity": 85,
    "viewCount": 0
  },
  {
    "id": 707,
    "name": "Cəlaləddin",
    "name_en": "Jalaladdin",
    "meaning": "Dinin əzəməti; Böyük, uca; Şərəfli, hörmətli",
    "meaning_en": "Grandeur of religion; Great, sublime; Honorable, respected",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Cəlal", "Kəmaləddin", "Nəcməddin"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 708,
    "name": "Elmar",
    "name_en": "Elmar",
    "meaning": "Elin maralı; Xalqın sevimli oğlu; Gözəl, yaraşıqlı",
    "meaning_en": "Charm of the people; Beloved son of the nation; Beautiful, handsome",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elnur", "Elçin"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 709,
    "name": "Fəxrəddin",
    "name_en": "Fakhreddin",
    "meaning": "Dinin fəxri; Şərəfli, hörmətli; Müqəddəs, uca",
    "meaning_en": "Pride of religion; Honorable, respected; Sacred, sublime",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fəxri", "Fəzil", "Fərid"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 710,
    "name": "Həkim",
    "name_en": "Hakim",
    "meaning": "Həkim; Müdrik, ağıllı; Bilikli, dərrakəli",
    "meaning_en": "Doctor; Wise, intelligent; Knowledgeable, perceptive",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Həsən", "Hüseyn", "Həmid"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 711,
    "name": "İlham",
    "name_en": "Ilham",
    "meaning": "İlham, ruh; Təşviq, həvəs; Yaradıcılıq, istedad",
    "meaning_en": "Inspiration, spirit; Encouragement, enthusiasm; Creativity, talent",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["İlkin", "İlqar", "İlyas"],
    "popularity": 79,
    "viewCount": 0
  },
  {
    "id": 712,
    "name": "Kənan",
    "name_en": "Kenan",
    "meaning": "Qədim ölkə adı; Müqəddəs, uca; Bərəkətli, zəngin",
    "meaning_en": "Ancient country name; Sacred, sublime; Fertile, rich",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Kərim", "Kamil", "Kamal"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 713,
    "name": "Məlik",
    "name_en": "Malik",
    "meaning": "Padşah, hökmdar; Rəhbər, başçı; Güclü, qüdrətli",
    "meaning_en": "King, ruler; Leader, chief; Strong, powerful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Məhəmməd", "Məhərrəm", "Sultan"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 714,
    "name": "Nəzim",
    "name_en": "Nazim",
    "meaning": "Şair, nazim; Yazıçı, ədib; Nizamlı, qaydalı",
    "meaning_en": "Poet, composer; Writer, author; Orderly, disciplined",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Namiq", "Nəsir", "Nəbi"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 715,
    "name": "Rəhim",
    "name_en": "Rahim",
    "meaning": "Mərhəmətli, şəfqətli; Cömərd, səxavətli; Bağışlayan, əfv edən",
    "meaning_en": "Merciful, compassionate; Generous, benevolent; Forgiving, pardoning",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Rəşad", "Rəsul", "Rəfiq"],
    "popularity": 78,
    "viewCount": 0
  },
  {
    "id": 716,
    "name": "Səbuhi",
    "name_en": "Sabuh",
    "meaning": "Səhərə aid; Təzə, yeni; Gözəl, parlaq",
    "meaning_en": "Related to dawn; Fresh, new; Beautiful, bright",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Samir", "Səmər", "Sənan"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 717,
    "name": "Teymur",
    "name_en": "Teymur",
    "meaning": "Dəmir kimi möhkəm; Güclü, dözümlü; Qəhrəman, igid",
    "meaning_en": "Strong as iron; Powerful, resilient; Hero, brave",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Dəmir", "Polad", "Rüstəm"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 718,
    "name": "Vaqif",
    "name_en": "Vagif",
    "meaning": "Bilən, xəbərdar; Ağıllı, müdrik; Anlayan, dərk edən",
    "meaning_en": "Knowing, aware; Intelligent, wise; Understanding, perceiving",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Vüsal", "Vəli", "Vasif"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 719,
    "name": "Zaur",
    "name_en": "Zaur",
    "meaning": "Ziyarət edən; Gəzən, səyyah; Açıq, səmimi",
    "meaning_en": "Visitor; Wanderer, traveler; Open, sincere",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zahid", "Zəfər", "Zakir"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 720,
    "name": "Ənvər",
    "name_en": "Anvar",
    "meaning": "Çox nurlu, çox işıqlı; Parlaq, gözəl; Aydın, aydınlıq",
    "meaning_en": "Very luminous, very bright; Radiant, beautiful; Clear, clarity",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əli", "Əmir", "Əkbər"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 721,
    "name": "Şahin",
    "name_en": "Shahin",
    "meaning": "Şahin quşu; Cəsur, igid; Sürətli, cəld",
    "meaning_en": "Falcon bird; Brave, valiant; Fast, agile",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Şəhriyar", "Şəmsi", "Şamil"],
    "popularity": 81,
    "viewCount": 0
  },
  {
    "id": 722,
    "name": "Arif",
    "name_en": "Arif",
    "meaning": "Bilikli, dərrakəli; Ağıllı, müdrik; Tanıyan, bilən",
    "meaning_en": "Knowledgeable, perceptive; Intelligent, wise; One who knows, recognizes",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Arifa", "Ürfan", "Həkim"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 723,
    "name": "Bəşir",
    "name_en": "Bashir",
    "meaning": "Müjdəçi, xəbərçi; Sevimli, xoş; Xeyirxah, yaxşı",
    "meaning_en": "Bearer of good news, harbinger; Beloved, pleasant; Benevolent, good",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Bəxtiyar", "Bəhram", "Bəhlul"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 724,
    "name": "Cahid",
    "name_en": "Jahid",
    "meaning": "Çalışan, səy göstərən; Fəal, enerjili; Zəhmətkeş",
    "meaning_en": "Striving, endeavoring; Active, energetic; Hardworking",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Cavid", "Cavad", "Camal"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 725,
    "name": "Dadaş",
    "name_en": "Dadash",
    "meaning": "Böyük qardaş; Dost, yoldaş; Hörmətli, sevimli",
    "meaning_en": "Big brother; Friend, companion; Respected, beloved",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Əli", "Əmir", "Əkbər"],
    "popularity": 65,
    "viewCount": 0
  },
  {
    "id": 726,
    "name": "Elşad",
    "name_en": "Elshad",
    "meaning": "Elin şadlığı, xalqın sevinci; Şən, xoşbəxt; Sevincli, bəxtiyar",
    "meaning_en": "Joy of the people, happiness of the nation; Cheerful, happy; Joyful, fortunate",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elnur", "Elçin"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 727,
    "name": "Fəzil",
    "name_en": "Fazil",
    "meaning": "Fəzilətli, üstün; Yüksək, uca; Əxlaqlı, dürüst",
    "meaning_en": "Virtuous, superior; High, sublime; Moral, honest",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fərid", "Fərhad", "Fəxri"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 728,
    "name": "Həsrət",
    "name_en": "Hasrat",
    "meaning": "Həsrət, intizar; Arzu, istək; Sevimli, əziz",
    "meaning_en": "Longing, yearning; Desire, wish; Beloved, dear",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ümid", "Xəyal", "Arzu"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 729,
    "name": "İlyas",
    "name_en": "Ilyas",
    "meaning": "Peyğəmbər adı; Müqəddəs, uca; Dindar, inanclı",
    "meaning_en": "Prophet's name; Sacred, sublime; Religious, faithful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["İbrahim", "İsmayıl", "İdris"],
    "popularity": 78,
    "viewCount": 0
  },
  {
    "id": 730,
    "name": "Məhərrəm",
    "name_en": "Muharram",
    "meaning": "Müqəddəs, toxunulmaz; Uca, böyük; Hörmətli, dəyərli",
    "meaning_en": "Sacred, inviolable; Sublime, great; Respected, valuable",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Məhəmməd", "Məlik", "Məhəbbət"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 731,
    "name": "Nicat",
    "name_en": "Nijat",
    "meaning": "Qurtuluş, xilas; Azadlıq, azad olma; Uğur, müvəffəqiyyət",
    "meaning_en": "Salvation, deliverance; Freedom, liberation; Success, achievement",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Niyaz", "Nəsir", "Nəzim"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 732,
    "name": "Qurban",
    "name_en": "Gurban",
    "meaning": "Qurban; Fədakarlıq, sədaqət; Allah yolunda fəda",
    "meaning_en": "Sacrifice; Devotion, loyalty; Sacrifice in the way of Allah",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Qədir", "Qasım", "Qəhrəman"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 733,
    "name": "Rəvan",
    "name_en": "Ravan",
    "meaning": "Axan, gedən; Səyyah, gəzən; Ruhən azad",
    "meaning_en": "Flowing, going; Traveler, wanderer; Spiritually free",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Rəşad", "Rəsul", "Rəfiq"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 734,
    "name": "Səmər",
    "name_en": "Samar",
    "meaning": "Meyvə, bəhrə; Nəticə, fayda; Uğur, müvəffəqiyyət",
    "meaning_en": "Fruit, yield; Result, benefit; Success, achievement",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Samir", "Sənan", "Səbuhi"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 735,
    "name": "Turxan",
    "name_en": "Turkhan",
    "meaning": "Türk xanı; Güclü, qüdrətli; Lider, başçı",
    "meaning_en": "Turkic khan; Strong, powerful; Leader, chief",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Tural", "Turan", "Turgut"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 736,
    "name": "Vasif",
    "name_en": "Vasif",
    "meaning": "Tərifçi, həmdedici; Öyən, mədh edən; Təsvir edən",
    "meaning_en": "Praiser, glorifier; Extoller, eulogizer; Describer",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Vüsal", "Vəli", "Vaqif"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 737,
    "name": "Zahid",
    "name_en": "Zahid",
    "meaning": "Dindar, təqvalı; Zəhmətkeş, çalışqan; Səbirli, dözümlü",
    "meaning_en": "Religious, pious; Hardworking, diligent; Patient, enduring",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zaur", "Zəfər", "Zakir"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 738,
    "name": "Əliyar",
    "name_en": "Aliyar",
    "meaning": "Əlinin dostu; Yaxın, sirdaş; Sadiq, vəfalı",
    "meaning_en": "Friend of Ali; Close, confidant; Loyal, faithful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əli", "Əmir", "Əkbər"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 739,
    "name": "Şəhriyar",
    "name_en": "Shahriyar",
    "meaning": "Şəhər hökmdarı; Böyük, əzəmətli; Lider, başçı",
    "meaning_en": "Ruler of the city; Great, grand; Leader, chief",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Şahin", "Şamil", "Şəmsi"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 740,
    "name": "Ağamir",
    "name_en": "Aghamir",
    "meaning": "Böyük əmir; Hörmətli, nüfuzlu; Lider, başçı",
    "meaning_en": "Great emir; Respected, influential; Leader, chief",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əmir", "Ağabəy", "Əli"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 741,
    "name": "Bəhlul",
    "name_en": "Bahlul",
    "meaning": "Şən, xoşhəl; Gülərüz, sevincli; Ağıllı, müdrik",
    "meaning_en": "Cheerful, happy; Smiling, joyful; Intelligent, wise",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Bəxtiyar", "Bəhram", "Bəşir"],
    "popularity": 66,
    "viewCount": 0
  },
  {
    "id": 742,
    "name": "Cavad",
    "name_en": "Javad",
    "meaning": "Səxavətli, cömərd; Əliaçıq, xeyirxah; Dəyərli, qiymətli",
    "meaning_en": "Generous, benevolent; Open-handed, kind; Valuable, precious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Cavid", "Cahid", "Camal"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 743,
    "name": "Dəmirçi",
    "name_en": "Damirchi",
    "meaning": "Dəmirçi; Güclü, möhkəm; Zəhmətkeş, çalışqan",
    "meaning_en": "Blacksmith; Strong, firm; Hardworking, diligent",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Dəmir", "Polad", "Teymur"],
    "popularity": 65,
    "viewCount": 0
  },
  {
    "id": 744,
    "name": "Elnur",
    "name_en": "Elnur",
    "meaning": "Xalqın nuru, elin işığı; Parlaq, aydın; Gözəl, nurani",
    "meaning_en": "Light of the people, illumination of the nation; Bright, clear; Beautiful, radiant",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elçin", "Elşən"],
    "popularity": 82,
    "viewCount": 0
  },
  {
    "id": 745,
    "name": "Fəxri",
    "name_en": "Fakhri",
    "meaning": "Fəxr edən, qürurlu; Şərəfli, hörmətli; Dəyərli, qiymətli",
    "meaning_en": "Proud, honorable; Glorious, respected; Valuable, precious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fərid", "Fərhad", "Fəzil"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 746,
    "name": "Həmdulla",
    "name_en": "Hamdullah",
    "meaning": "Allaha həmd edən; Şükür edən; Dindar, təqvalı",
    "meaning_en": "One who praises Allah; Grateful; Religious, pious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Həmid", "Abdulla", "Allahverdi"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 747,
    "name": "İdris",
    "name_en": "Idris",
    "meaning": "Peyğəmbər adı; Müdrik, ağıllı; Bilikli, dərrakəli",
    "meaning_en": "Prophet's name; Wise, intelligent; Knowledgeable, perceptive",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["İbrahim", "İsmayıl", "İlyas"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 748,
    "name": "Kamil",
    "name_en": "Kamil",
    "meaning": "Mükəmməl, tam; Bitkin, yetkin; Fəzilətli, əxlaqlı",
    "meaning_en": "Perfect, complete; Mature, accomplished; Virtuous, moral",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Kərim", "Kamal", "Kənan"],
    "popularity": 78,
    "viewCount": 0
  },
  {
    "id": 749,
    "name": "Müslüm",
    "name_en": "Muslim",
    "meaning": "Müsəlman; Dindar, inanclı; Təqvalı, saleh",
    "meaning_en": "Muslim; Religious, faithful; Pious, righteous",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Mübariz", "Müşfiq", "Mütəllim"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 750,
    "name": "Nəbi",
    "name_en": "Nabi",
    "meaning": "Peyğəmbər, elçi; Xəbərçi, müjdəçi; Müqəddəs, uca",
    "meaning_en": "Prophet, messenger; Bearer of news, harbinger; Sacred, sublime",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Namiq", "Nəsir", "Nəzim"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 751,
    "name": "Oruc",
    "name_en": "Oruj",
    "meaning": "Oruc tutan; Dindar, inanclı; Səbirli, dözümlü",
    "meaning_en": "One who fasts; Religious, faithful; Patient, enduring",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Orxan", "Osman", "Oqtay"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 752,
    "name": "Polad",
    "name_en": "Polad",
    "meaning": "Polad; Möhkəm, güclü; Dözümlü, səbirli",
    "meaning_en": "Steel; Firm, strong; Resilient, patient",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Dəmir", "Teymur", "Rüstəm"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 753,
    "name": "Qədirli",
    "name_en": "Gadirli",
    "meaning": "Qüdrətli, güclü; Dəyərli, qiymətli; Hörmətli, nüfuzlu",
    "meaning_en": "Powerful, strong; Valuable, precious; Respected, influential",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Qədir", "Qasım", "Qəhrəman"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 754,
    "name": "Rüstəm",
    "name_en": "Rustam",
    "meaning": "Qəhrəman, igid; Güclü, qüvvətli; Qoçaq, cəsur",
    "meaning_en": "Hero, brave; Strong, powerful; Valiant, courageous",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Ruslan", "Rafiq", "Ramil"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 755,
    "name": "Sənan",
    "name_en": "Sanan",
    "meaning": "Nizə ucu; Kəskin, iti; Ağıllı, zəkalı",
    "meaning_en": "Spearhead; Sharp, keen; Intelligent, clever",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Samir", "Səmər", "Səbuhi"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 756,
    "name": "Turgut",
    "name_en": "Turgut",
    "meaning": "Ayağa qalxan, dirçələn; Güclü, qüvvətli; İgid, cəsur",
    "meaning_en": "One who rises, revives; Strong, powerful; Brave, courageous",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Tural", "Turan", "Turxan"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 757,
    "name": "Vüsal",
    "name_en": "Vusal",
    "meaning": "Qovuşma, birləşmə; Çatma, nailiyyət; Xoşbəxtlik, sevinc",
    "meaning_en": "Reunion, union; Attainment, achievement; Happiness, joy",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Vəli", "Vaqif", "Vasif"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 758,
    "name": "Yaşar",
    "name_en": "Yashar",
    "meaning": "Yaşayan, həyat sürən; Uzunömürlü; Canlı, dinamik",
    "meaning_en": "Living, enduring life; Long-lived; Lively, dynamic",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Yusif", "Yaqub", "Yasəmən"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 759,
    "name": "Zakir",
    "name_en": "Zakir",
    "meaning": "Zikr edən, anan; Xatırlayan, yad edən; Dindar, təqvalı",
    "meaning_en": "One who remembers, mentions; Recaller, commemorator; Religious, pious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zahid", "Zaur", "Zəfər"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 760,
    "name": "Əmir",
    "name_en": "Amir",
    "meaning": "Hökmdar, əmir; Rəhbər, başçı; Güclü, qüdrətli",
    "meaning_en": "Ruler, emir; Leader, chief; Strong, powerful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əli", "Əliyar", "Əkbər"],
    "popularity": 79,
    "viewCount": 0
  },
  {
    "id": 761,
    "name": "Şəmsəddin",
    "name_en": "Shamsaddin",
    "meaning": "Dinin günəşi; Parlaq, işıqlı; Müqəddəs, uca",
    "meaning_en": "Sun of religion; Bright, luminous; Sacred, sublime",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Şəmsi", "Nəcməddin", "Cəlaləddin"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 762,
    "name": "Aydın",
    "name_en": "Aydin",
    "meaning": "Aydın, parlaq; İşıqlı, nurani; Açıq, səmimi",
    "meaning_en": "Clear, bright; Luminous, radiant; Open, sincere",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Ayan", "Elnur", "Günay"],
    "popularity": 88,
    "viewCount": 0
  },
  {
    "id": 763,
    "name": "Bəhruz",
    "name_en": "Behruz",
    "meaning": "Xoşbəxt gün; Uğurlu, bəxtiyar; Sevincli, şən",
    "meaning_en": "Happy day; Successful, fortunate; Joyful, cheerful",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Bəxtiyar", "Bəhlul", "Bəşir"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 764,
    "name": "Cavidan",
    "name_en": "Javidan",
    "meaning": "Əbədi, sonsuz; Daimi, ölməz; Uzunömürlü",
    "meaning_en": "Eternal, endless; Permanent, immortal; Long-lived",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Cavid", "Cavad", "Camal"],
    "popularity": 79,
    "viewCount": 0
  },
  {
    "id": 765,
    "name": "Dəmir",
    "name_en": "Damir",
    "meaning": "Dəmir; Möhkəm, güclü; Dözümlü, səbirli",
    "meaning_en": "Iron; Firm, strong; Resilient, patient",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Teymur", "Polad", "Dəmirçi"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 766,
    "name": "Elxan",
    "name_en": "Elkhan",
    "meaning": "Elin xanı, xalqın hökmdarı; Lider, başçı; Güclü, qüdrətli",
    "meaning_en": "Khan of the people, ruler of the nation; Leader, chief; Strong, powerful",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elnur", "Elçin"],
    "popularity": 78,
    "viewCount": 0
  },
  {
    "id": 767,
    "name": "Fikrət",
    "name_en": "Fikrat",
    "meaning": "Fikir, düşüncə; Ağıllı, müdrik; Dərrakəli, zəkalı",
    "meaning_en": "Thought, idea; Intelligent, wise; Perceptive, clever",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fərid", "Fəxri", "Fəzil"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 768,
    "name": "Gündüz",
    "name_en": "Gunduz",
    "meaning": "Günəş, işıq; Aydınlıq, parlaqlıq; Xoşbəxt, sevincli",
    "meaning_en": "Sun, light; Brightness, radiance; Happy, joyful",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Günay", "Günel", "Ay"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 769,
    "name": "Həmid",
    "name_en": "Hamid",
    "meaning": "Həmd edən, tərifləyən; Şükür edən; Mərhəmətli, şəfqətli",
    "meaning_en": "One who praises, glorifies; Grateful; Merciful, compassionate",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Həsən", "Hüseyn", "Həkim"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 770,
    "name": "İlkin",
    "name_en": "Ilkin",
    "meaning": "İlk, əvvəl; Başlanğıc, təməl; Öncül, lider",
    "meaning_en": "First, initial; Beginning, foundation; Pioneer, leader",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["İlqar", "İlham", "İlyas"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 771,
    "name": "Kəmaləddin",
    "name_en": "Kemaleddin",
    "meaning": "Dinin kamillığı; Mükəmməl, uca; Fəzilətli, əxlaqlı",
    "meaning_en": "Perfection of religion; Perfect, sublime; Virtuous, moral",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Kərim", "Kamil", "Kənan"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 772,
    "name": "Ləman",
    "name_en": "Laman",
    "meaning": "Parlaqlıq, işıq; Zərif, incə; Gözəl, cazibədar",
    "meaning_en": "Brightness, light; Delicate, subtle; Beautiful, charming",
    "gender": "qız",
    "origin": "ərəb",
    "similar": ["Leyla", "Lalə", "Lətifə"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 773,
    "name": "Məhəmməd",
    "name_en": "Muhammad",
    "meaning": "Təriflənən, həmd olunan; Uca, böyük; Müqəddəs, xeyirli",
    "meaning_en": "Praised, glorified; Sublime, great; Sacred, beneficial",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Məmməd", "Məlik", "Məhərrəm"],
    "popularity": 90,
    "viewCount": 0
  },
  {
    "id": 774,
    "name": "Nəsibə",
    "name_en": "Nasiba",
    "meaning": "Nəsib, qismət; Tale, bəxt; Uğur, müvəffəqiyyət",
    "meaning_en": "Destiny, fate; Fortune, luck; Success, achievement",
    "gender": "qız",
    "origin": "ərəb",
    "similar": ["Nəzakət", "Nəfisə", "Nəcibə"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 775,
    "name": "Pənah",
    "name_en": "Panah",
    "meaning": "Sığınacaq, qoruyucu; Himayədar, dəstək; Xilaskar, nicat",
    "meaning_en": "Shelter, protector; Patron, support; Savior, salvation",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Pəri", "Pərvanə", "Pərvin"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 776,
    "name": "Qədir",
    "name_en": "Gadir",
    "meaning": "Qüdrətli, güclü; Əzəmətli, uca; Dəyərli, qiymətli",
    "meaning_en": "Powerful, strong; Grand, sublime; Valuable, precious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Qasım", "Qəhrəman", "Qurban"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 777,
    "name": "Ramil",
    "name_en": "Ramil",
    "meaning": "Atıcı, nişançı; Dəqiq, hədəfə vuran; Cəsur, igid",
    "meaning_en": "Archer, marksman; Accurate, hitting the target; Brave, valiant",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ruslan", "Rüstəm", "Rafiq"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 778,
    "name": "Sənan",
    "name_en": "Sanan",
    "meaning": "Nizə ucu; Kəskin, iti; Ağıllı, zəkalı",
    "meaning_en": "Spearhead; Sharp, keen; Intelligent, clever",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Samir", "Səmər", "Səbuhi"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 779,
    "name": "Tərlan",
    "name_en": "Tarlan",
    "meaning": "Qartal; Güclü, cəsur; Azad, sərbəst",
    "meaning_en": "Eagle; Strong, courageous; Free, independent",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Tural", "Turan", "Turxan"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 780,
    "name": "Ümid",
    "name_en": "Umid",
    "meaning": "Ümid, arzu; Gələcək, perspektiv; Müsbət, nikbin",
    "meaning_en": "Hope, wish; Future, prospect; Positive, optimistic",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ülvi", "Ürfan", "Üzeyir"],
    "popularity": 84,
    "viewCount": 0
  },
  {
    "id": 781,
    "name": "Vaqif",
    "name_en": "Vagif",
    "meaning": "Bilən, xəbərdar; Ağıllı, müdrik; Anlayan, dərk edən",
    "meaning_en": "Knowing, aware; Intelligent, wise; Understanding, perceiving",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Vüsal", "Vəli", "Vasif"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 782,
    "name": "Zahid",
    "name_en": "Zahid",
    "meaning": "Dindar, təqvalı; Zəhmətkeş, çalışqan; Səbirli, dözümlü",
    "meaning_en": "Religious, pious; Hardworking, diligent; Patient, enduring",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zaur", "Zəfər", "Zakir"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 783,
    "name": "Ədalət",
    "name_en": "Adalat",
    "meaning": "Ədalət, haqq; Düzgünlük, dürüstlük; Haqqsevər",
    "meaning_en": "Justice, right; Correctness, honesty; Lover of justice",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əhməd", "Əsgər", "Əziz"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 784,
    "name": "Şəhriyar",
    "name_en": "Shahriyar",
    "meaning": "Şəhər hökmdarı; Böyük, əzəmətli; Lider, başçı",
    "meaning_en": "Ruler of the city; Great, grand; Leader, chief",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Şahin", "Şamil", "Şəmsi"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 785,
    "name": "Ağabəy",
    "name_en": "Aghabey",
    "meaning": "Böyük bəy, hörmətli ağa; Lider, rəhbər; Nüfuzlu, hörmətli",
    "meaning_en": "Great bey, respected master; Leader, chief; Influential, respected",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Əli", "Əmir", "Əkbər"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 786,
    "name": "Cəlal",
    "name_en": "Jalal",
    "meaning": "Böyüklük, əzəmət; Şan, şöhrət; Hörmət, ləyaqət",
    "meaning_en": "Greatness, grandeur; Glory, fame; Respect, dignity",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ceyhun", "Cəmil", "Cəfər"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 787,
    "name": "Dadaş",
    "name_en": "Dadash",
    "meaning": "Böyük qardaş; Dost, yoldaş; Hörmətli, sevimli",
    "meaning_en": "Big brother; Friend, companion; Respected, beloved",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Əli", "Əmir", "Əkbər"],
    "popularity": 65,
    "viewCount": 0
  },
  {
    "id": 788,
    "name": "Elmar",
    "name_en": "Elmar",
    "meaning": "Elin maralı; Xalqın sevimli oğlu; Gözəl, yaraşıqlı",
    "meaning_en": "Charm of the people; Beloved son of the nation; Beautiful, handsome",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elnur", "Elçin"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 789,
    "name": "Fəxrəddin",
    "name_en": "Fakhreddin",
    "meaning": "Dinin fəxri; Şərəfli, hörmətli; Müqəddəs, uca",
    "meaning_en": "Pride of religion; Honorable, respected; Sacred, sublime",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fəxri", "Fəzil", "Fərid"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 790,
    "name": "Gündüz",
    "name_en": "Gunduz",
    "meaning": "Günəş, işıq; Aydınlıq, parlaqlıq; Xoşbəxt, sevincli",
    "meaning_en": "Sun, light; Brightness, radiance; Happy, joyful",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Günay", "Günel", "Ay"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 791,
    "name": "Həmid",
    "name_en": "Hamid",
    "meaning": "Həmd edən, tərifləyən; Şükür edən; Mərhəmətli, şəfqətli",
    "meaning_en": "One who praises, glorifies; Grateful; Merciful, compassionate",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Həsən", "Hüseyn", "Həkim"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 792,
    "name": "İlkin",
    "name_en": "Ilkin",
    "meaning": "İlk, əvvəl; Başlanğıc, təməl; Öncül, lider",
    "meaning_en": "First, initial; Beginning, foundation; Pioneer, leader",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["İlqar", "İlham", "İlyas"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 793,
    "name": "Kəmaləddin",
    "name_en": "Kemaleddin",
    "meaning": "Dinin kamillığı; Mükəmməl, uca; Fəzilətli, əxlaqlı",
    "meaning_en": "Perfection of religion; Perfect, sublime; Virtuous, moral",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Kərim", "Kamil", "Kənan"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 794,
    "name": "Lətif",
    "name_en": "Latif",
    "meaning": "Zərif, nazik; Yumşaq, incə; Xoş, lütfkar",
    "meaning_en": "Delicate, thin; Soft, gentle; Pleasant, gracious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ləti", "Ləman", "Lalə"],
    "popularity": 65,
    "viewCount": 0
  },
  {
    "id": 795,
    "name": "Məmməd",
    "name_en": "Mammad",
    "meaning": "Təriflənən, həmd olunan; Uca, böyük; Müqəddəs, xeyirli",
    "meaning_en": "Praised, glorified; Sublime, great; Sacred, beneficial",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Məhəmməd", "Məlik", "Məhərrəm"],
    "popularity": 90,
    "viewCount": 0
  },
  {
    "id": 796,
    "name": "Nəsib",
    "name_en": "Nasib",
    "meaning": "Nəsib, qismət; Tale, bəxt; Uğur, müvəffəqiyyət",
    "meaning_en": "Destiny, fate; Fortune, luck; Success, achievement",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Niyaz", "Nəsir", "Nəzim"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 797,
    "name": "Oqtay",
    "name_en": "Ogtay",
    "meaning": "Ox kimi sürətli; Cəld, çevik; Ağıllı, zəkalı",
    "meaning_en": "Fast as an arrow; Agile, nimble; Intelligent, clever",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Orxan", "Osman", "Oruc"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 798,
    "name": "Pərviz",
    "name_en": "Parviz",
    "meaning": "Uğurlu, bəxtiyar; Xoşbəxt, sevincli; Qalib, zəfər çalan",
    "meaning_en": "Successful, fortunate; Happy, joyful; Victorious, triumphant",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Pənah", "Pərvin", "Bəxtiyar"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 799,
    "name": "Qasım",
    "name_en": "Gasim",
    "meaning": "Bölən, paylayan; Ədalətli, haqqsevər; Cömərd, səxavətli",
    "meaning_en": "Divider, distributor; Just, righteous; Generous, benevolent",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Qədir", "Qəhrəman", "Qurban"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 800,
    "name": "Rəşad",
    "name_en": "Rashad",
    "meaning": "Doğru yol tapan; Hidayət edən; Ağıllı, müdrik",
    "meaning_en": "One who finds the right path; Guiding; Intelligent, wise",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Rəsul", "Rəhim", "Rəfiq"],
    "popularity": 80,
    "viewCount": 0
  },
  {
    "id": 801,
    "name": "Samir",
    "name_en": "Samir",
    "meaning": "Söhbət yoldaşı; Danışan, natiq; Dost, sirdaş",
    "meaning_en": "Conversation companion; Speaker, orator; Friend, confidant",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Səmər", "Sənan", "Səbuhi"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 802,
    "name": "Tural",
    "name_en": "Tural",
    "meaning": "Canlı, həyat dolu; Güclü, dözümlü; İgid, cəsur",
    "meaning_en": "Lively, full of life; Strong, resilient; Brave, courageous",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Turan", "Turgut", "Turxan"],
    "popularity": 85,
    "viewCount": 0
  },
  {
    "id": 803,
    "name": "Ürfan",
    "name_en": "Urphan",
    "meaning": "Bilik, mərifət; Ağıl, dərrakə; Hikmət, müdriklik",
    "meaning_en": "Knowledge, wisdom; Intellect, understanding; Wisdom, sagacity",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ülvi", "Ümid", "Üzeyir"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 804,
    "name": "Vüqar",
    "name_en": "Vugar",
    "meaning": "Qürur, əzəmət; Hörmət, ləyaqət; Uca, yüksək",
    "meaning_en": "Pride, grandeur; Respect, dignity; Lofty, high",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Vüsal", "Vəli", "Vaqif"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 805,
    "name": "Yaqub",
    "name_en": "Yagub",
    "meaning": "Peyğəmbər adı; Müqəddəs, uca; Dindar, inanclı",
    "meaning_en": "Prophet's name; Sacred, sublime; Religious, faithful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Yusif", "Yaşar", "Davud"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 806,
    "name": "Zəfər",
    "name_en": "Zafar",
    "meaning": "Zəfər, qələbə; Uğur, müvəffəqiyyət; Qalib, qalibiyyətli",
    "meaning_en": "Victory, triumph; Success, achievement; Victorious, winning",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zahid", "Zaur", "Zakir"],
    "popularity": 79,
    "viewCount": 0
  },
  {
    "id": 807,
    "name": "Əli",
    "name_en": "Ali",
    "meaning": "Yüksək, uca; Əzəmətli, böyük; Şərəfli, hörmətli",
    "meaning_en": "High, sublime; Grand, great; Honorable, respected",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əliyar", "Əmir", "Əkbər"],
    "popularity": 95,
    "viewCount": 0
  },
  {
    "id": 808,
    "name": "Şamil",
    "name_en": "Shamil",
    "meaning": "Hər şeyi əhatə edən; Tam, mükəmməl; Kapsamlı, geniş",
    "meaning_en": "All-encompassing; Complete, perfect; Comprehensive, broad",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Şahin", "Şəhriyar", "Şəmsi"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 809,
    "name": "Araz",
    "name_en": "Araz",
    "meaning": "Çay adı; Geniş, axar; Güclü, qüvvətli",
    "meaning_en": "River name; Wide, flowing; Strong, powerful",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Kür", "Dəniz", "Çay"],
    "popularity": 82,
    "viewCount": 0
  },
  {
    "id": 810,
    "name": "Bəxtiyar",
    "name_en": "Bakhtiyar",
    "meaning": "Xoşbəxt, bəxtli; Uğurlu, müvəffəqiyyətli; Sevincli, şən",
    "meaning_en": "Happy, fortunate; Successful, prosperous; Joyful, cheerful",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Bəhram", "Bəhlul", "Bəşir"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 811,
    "name": "Cəfər",
    "name_en": "Jafar",
    "meaning": "Çay; Bərəkət, bolluq; Xeyir, fayda",
    "meaning_en": "River; Abundance, plenty; Good, benefit",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ceyhun", "Cəlal", "Cəmil"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 812,
    "name": "Dəyanət",
    "name_en": "Dayanat",
    "meaning": "Dindarlıq, iman; Sədaqət, vəfadarlıq; Əxlaq, fəzilət",
    "meaning_en": "Piety, faith; Loyalty, fidelity; Morality, virtue",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zahid", "Təqva", "İman"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 813,
    "name": "Elçin",
    "name_en": "Elchin",
    "meaning": "Xalqın elçisi; Nümayəndə, səfir; Xalqın sevimli oğlu",
    "meaning_en": "Envoy of the people; Representative, ambassador; Beloved son of the people",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elnur", "Elşən"],
    "popularity": 80,
    "viewCount": 0
  },
  {
    "id": 814,
    "name": "Fərid",
    "name_en": "Farid",
    "meaning": "Yeganə, tək; Bənzərsiz, nadir; Qiymətli, dəyərli",
    "meaning_en": "Unique, sole; Unparalleled, rare; Valuable, precious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fərhad", "Fəxri", "Fəzil"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 815,
    "name": "Hüseyn",
    "name_en": "Huseyn",
    "meaning": "Gözəl, yaraşıqlı; Yaxşı, xeyirli; Müqəddəs, pak",
    "meaning_en": "Beautiful, handsome; Good, beneficial; Sacred, pure",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Həsən", "Həmid", "Həkim"],
    "popularity": 90,
    "viewCount": 0
  },
  {
    "id": 816,
    "name": "İbrahim",
    "name_en": "Ibrahim",
    "meaning": "Çoxsaylı xalqın atası; Ulu, hörmətli; Peyğəmbər adı",
    "meaning_en": "Father of a multitude; Great, respected; Prophet's name",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["İsmayıl", "İlyas", "İdris"],
    "popularity": 83,
    "viewCount": 0
  },
  {
    "id": 817,
    "name": "Kərim",
    "name_en": "Karim",
    "meaning": "Səxavətli, cömərd; Mərhəmətli, şəfqətli; Dəyərli, qiymətli",
    "meaning_en": "Generous, benevolent; Merciful, compassionate; Valuable, precious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Kamil", "Kamal", "Kənan"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 818,
    "name": "Mübariz",
    "name_en": "Mubariz",
    "meaning": "Döyüşçü, qəhrəman; İgid, cəsur; Mübarizə aparan",
    "meaning_en": "Warrior, hero; Brave, courageous; One who struggles",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Müslüm", "Müşfiq", "Mütəllim"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 819,
    "name": "Namiq",
    "name_en": "Namiq",
    "meaning": "Məktub yazan; Yazıçı, şair; Danışan, natiq",
    "meaning_en": "Letter writer; Writer, poet; Speaker, orator",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Nəsir", "Nəbi", "Nəzim"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 820,
    "name": "Orxan",
    "name_en": "Orkhan",
    "meaning": "Böyük xan, hökmdar; Lider, başçı; Güclü, qüdrətli",
    "meaning_en": "Great khan, ruler; Leader, chief; Strong, powerful",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Oqtay", "Osman", "Oruc"],
    "popularity": 80,
    "viewCount": 0
  },
  {
    "id": 821,
    "name": "Qəhrəman",
    "name_en": "Gahraman",
    "meaning": "Qəhrəman, igid; Cəsur, qoçaq; Qorxmaz, ürəkli",
    "meaning_en": "Hero, brave; Courageous, valiant; Fearless, hearty",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Qədir", "Qasım", "Qurban"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 822,
    "name": "Rəsul",
    "name_en": "Rasul",
    "meaning": "Elçi, peyğəmbər; Xəbərçi, müjdəçi; Dindar, müqəddəs",
    "meaning_en": "Messenger, prophet; Bearer of news, harbinger; Religious, sacred",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Rəhim", "Rəşad", "Rəfiq"],
    "popularity": 79,
    "viewCount": 0
  },
  {
    "id": 823,
    "name": "Ruslan",
    "name_en": "Ruslan",
    "meaning": "Şir kimi; Güclü, qüvvətli; Qəhrəman, igid",
    "meaning_en": "Like a lion; Strong, powerful; Hero, brave",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Rüstəm", "Rafiq", "Ramil"],
    "popularity": 81,
    "viewCount": 0
  },
  {
    "id": 824,
    "name": "Turan",
    "name_en": "Turan",
    "meaning": "Vətən, yurd; Torpaq, diyar; Güclü, qüdrətli",
    "meaning_en": "Homeland, country; Land, region; Strong, powerful",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Tural", "Turgut", "Turxan"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 825,
    "name": "Üzeyir",
    "name_en": "Uzeyir",
    "meaning": "Köməkçi, yardımçı; Dəstək, himayədar; Xeyirxah, yaxşı",
    "meaning_en": "Helper, assistant; Support, patron; Benevolent, good",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ülvi", "Ümid", "Ürfan"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 826,
    "name": "Vəli",
    "name_en": "Vali",
    "meaning": "Dost, yaxın; Himayədar, qoruyucu; Müqəddəs, uca",
    "meaning_en": "Friend, close; Patron, protector; Sacred, sublime",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Vüsal", "Vaqif", "Vasif"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 827,
    "name": "Xəyal",
    "name_en": "Khayal",
    "meaning": "Xəyal, arzu; Yuxu, fantaziya; Gözəl, sirli",
    "meaning_en": "Dream, wish; Sleep, fantasy; Beautiful, mysterious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Röya", "Arzu", "Ümid"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 828,
    "name": "Yusif",
    "name_en": "Yusif",
    "meaning": "Allah artırsın; Çoxaltsın, bərəkətli; Gözəl, yaraşıqlı",
    "meaning_en": "May Allah increase; Multiply, blessed; Beautiful, handsome",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Yaqub", "Yaşar", "Davud"],
    "popularity": 86,
    "viewCount": 0
  },
  {
    "id": 829,
    "name": "Zakir",
    "name_en": "Zakir",
    "meaning": "Zikr edən, anan; Xatırlayan, yad edən; Dindar, təqvalı",
    "meaning_en": "One who remembers, mentions; Recaller, commemorator; Religious, pious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zahid", "Zaur", "Zəfər"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 830,
    "name": "Əkbər",
    "name_en": "Akbar",
    "meaning": "Ən böyük, uca; Əzəmətli, qüdrətli; Şərəfli, hörmətli",
    "meaning_en": "The greatest, sublime; Grand, powerful; Honorable, respected",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əli", "Əmir", "Əliyar"],
    "popularity": 82,
    "viewCount": 0
  },
  {
    "id": 831,
    "name": "Şəmsi",
    "name_en": "Shamsi",
    "meaning": "Günəşə aid; Parlaq, işıqlı; Nurani, gözəl",
    "meaning_en": "Related to the sun; Bright, luminous; Radiant, beautiful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Şəms", "Günay", "Ay"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 832,
    "name": "Adil",
    "name_en": "Adil",
    "meaning": "Ədalətli, haqqsevər; Düzgün, dürüst; Ədalətli hökmdar",
    "meaning_en": "Just, righteous; Correct, honest; Just ruler",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ədalət", "Haqq", "Düzgün"],
    "popularity": 85,
    "viewCount": 0
  },
  {
    "id": 833,
    "name": "Cəlaləddin",
    "name_en": "Jalaladdin",
    "meaning": "Dinin əzəməti; Böyük, uca; Şərəfli, hörmətli",
    "meaning_en": "Grandeur of religion; Great, sublime; Honorable, respected",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Cəlal", "Kəmaləddin", "Nəcməddin"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 834,
    "name": "Elmar",
    "name_en": "Elmar",
    "meaning": "Elin maralı; Xalqın sevimli oğlu; Gözəl, yaraşıqlı",
    "meaning_en": "Charm of the people; Beloved son of the nation; Beautiful, handsome",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elnur", "Elçin"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 835,
    "name": "Fəxrəddin",
    "name_en": "Fakhreddin",
    "meaning": "Dinin fəxri; Şərəfli, hörmətli; Müqəddəs, uca",
    "meaning_en": "Pride of religion; Honorable, respected; Sacred, sublime",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fəxri", "Fəzil", "Fərid"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 836,
    "name": "Həkim",
    "name_en": "Hakim",
    "meaning": "Həkim; Müdrik, ağıllı; Bilikli, dərrakəli",
    "meaning_en": "Doctor; Wise, intelligent; Knowledgeable, perceptive",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Həsən", "Hüseyn", "Həmid"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 837,
    "name": "İlham",
    "name_en": "Ilham",
    "meaning": "İlham, ruh; Təşviq, həvəs; Yaradıcılıq, istedad",
    "meaning_en": "Inspiration, spirit; Encouragement, enthusiasm; Creativity, talent",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["İlkin", "İlqar", "İlyas"],
    "popularity": 79,
    "viewCount": 0
  },
  {
    "id": 838,
    "name": "Kənan",
    "name_en": "Kenan",
    "meaning": "Qədim ölkə adı; Müqəddəs, uca; Bərəkətli, zəngin",
    "meaning_en": "Ancient country name; Sacred, sublime; Fertile, rich",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Kərim", "Kamil", "Kamal"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 839,
    "name": "Məlik",
    "name_en": "Malik",
    "meaning": "Padşah, hökmdar; Rəhbər, başçı; Güclü, qüdrətli",
    "meaning_en": "King, ruler; Leader, chief; Strong, powerful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Məhəmməd", "Məhərrəm", "Sultan"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 840,
    "name": "Nəzim",
    "name_en": "Nazim",
    "meaning": "Şair, nazim; Yazıçı, ədib; Nizamlı, qaydalı",
    "meaning_en": "Poet, composer; Writer, author; Orderly, disciplined",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Namiq", "Nəsir", "Nəbi"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 841,
    "name": "Rəhim",
    "name_en": "Rahim",
    "meaning": "Mərhəmətli, şəfqətli; Cömərd, səxavətli; Bağışlayan, əfv edən",
    "meaning_en": "Merciful, compassionate; Generous, benevolent; Forgiving, pardoning",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Rəşad", "Rəsul", "Rəfiq"],
    "popularity": 78,
    "viewCount": 0
  },
  {
    "id": 842,
    "name": "Səbuhi",
    "name_en": "Sabuh",
    "meaning": "Səhərə aid; Təzə, yeni; Gözəl, parlaq",
    "meaning_en": "Related to dawn; Fresh, new; Beautiful, bright",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Samir", "Səmər", "Sənan"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 843,
    "name": "Teymur",
    "name_en": "Teymur",
    "meaning": "Dəmir kimi möhkəm; Güclü, dözümlü; Qəhrəman, igid",
    "meaning_en": "Strong as iron; Powerful, resilient; Hero, brave",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Dəmir", "Polad", "Rüstəm"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 844,
    "name": "Vaqif",
    "name_en": "Vagif",
    "meaning": "Bilən, xəbərdar; Ağıllı, müdrik; Anlayan, dərk edən",
    "meaning_en": "Knowing, aware; Intelligent, wise; Understanding, perceiving",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Vüsal", "Vəli", "Vasif"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 845,
    "name": "Zaur",
    "name_en": "Zaur",
    "meaning": "Ziyarət edən; Gəzən, səyyah; Açıq, səmimi",
    "meaning_en": "Visitor; Wanderer, traveler; Open, sincere",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zahid", "Zəfər", "Zakir"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 846,
    "name": "Ənvər",
    "name_en": "Anvar",
    "meaning": "Çox nurlu, çox işıqlı; Parlaq, gözəl; Aydın, aydınlıq",
    "meaning_en": "Very luminous, very bright; Radiant, beautiful; Clear, clarity",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əli", "Əmir", "Əkbər"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 847,
    "name": "Şahin",
    "name_en": "Shahin",
    "meaning": "Şahin quşu; Cəsur, igid; Sürətli, cəld",
    "meaning_en": "Falcon bird; Brave, valiant; Fast, agile",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Şəhriyar", "Şəmsi", "Şamil"],
    "popularity": 81,
    "viewCount": 0
  },
  {
    "id": 848,
    "name": "Arif",
    "name_en": "Arif",
    "meaning": "Bilikli, dərrakəli; Ağıllı, müdrik; Tanıyan, bilən",
    "meaning_en": "Knowledgeable, perceptive; Intelligent, wise; One who knows, recognizes",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Arifa", "Ürfan", "Həkim"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 849,
    "name": "Bəşir",
    "name_en": "Bashir",
    "meaning": "Müjdəçi, xəbərçi; Sevimli, xoş; Xeyirxah, yaxşı",
    "meaning_en": "Bearer of good news, harbinger; Beloved, pleasant; Benevolent, good",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Bəxtiyar", "Bəhram", "Bəhlul"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 850,
    "name": "Cahid",
    "name_en": "Jahid",
    "meaning": "Çalışan, səy göstərən; Fəal, enerjili; Zəhmətkeş",
    "meaning_en": "Striving, endeavoring; Active, energetic; Hardworking",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Cavid", "Cavad", "Camal"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 851,
    "name": "Dadaş",
    "name_en": "Dadash",
    "meaning": "Böyük qardaş; Dost, yoldaş; Hörmətli, sevimli",
    "meaning_en": "Big brother; Friend, companion; Respected, beloved",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Əli", "Əmir", "Əkbər"],
    "popularity": 65,
    "viewCount": 0
  },
  {
    "id": 852,
    "name": "Elşad",
    "name_en": "Elshad",
    "meaning": "Elin şadlığı, xalqın sevinci; Şən, xoşbəxt; Sevincli, bəxtiyar",
    "meaning_en": "Joy of the people, happiness of the nation; Cheerful, happy; Joyful, fortunate",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elnur", "Elçin"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 853,
    "name": "Fəzil",
    "name_en": "Fazil",
    "meaning": "Fəzilətli, üstün; Yüksək, uca; Əxlaqlı, dürüst",
    "meaning_en": "Virtuous, superior; High, sublime; Moral, honest",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fərid", "Fərhad", "Fəxri"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 854,
    "name": "Həsrət",
    "name_en": "Hasrat",
    "meaning": "Həsrət, intizar; Arzu, istək; Sevimli, əziz",
    "meaning_en": "Longing, yearning; Desire, wish; Beloved, dear",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ümid", "Xəyal", "Arzu"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 855,
    "name": "İlyas",
    "name_en": "Ilyas",
    "meaning": "Peyğəmbər adı; Müqəddəs, uca; Dindar, inanclı",
    "meaning_en": "Prophet's name; Sacred, sublime; Religious, faithful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["İbrahim", "İsmayıl", "İdris"],
    "popularity": 78,
    "viewCount": 0
  },
  {
    "id": 856,
    "name": "Məhərrəm",
    "name_en": "Muharram",
    "meaning": "Müqəddəs, toxunulmaz; Uca, böyük; Hörmətli, dəyərli",
    "meaning_en": "Sacred, inviolable; Sublime, great; Respected, valuable",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Məhəmməd", "Məlik", "Məhəbbət"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 857,
    "name": "Nicat",
    "name_en": "Nijat",
    "meaning": "Qurtuluş, xilas; Azadlıq, azad olma; Uğur, müvəffəqiyyət",
    "meaning_en": "Salvation, deliverance; Freedom, liberation; Success, achievement",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Niyaz", "Nəsir", "Nəzim"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 858,
    "name": "Qurban",
    "name_en": "Gurban",
    "meaning": "Qurban; Fədakarlıq, sədaqət; Allah yolunda fəda",
    "meaning_en": "Sacrifice; Devotion, loyalty; Sacrifice in the way of Allah",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Qədir", "Qasım", "Qəhrəman"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 859,
    "name": "Rəvan",
    "name_en": "Ravan",
    "meaning": "Axan, gedən; Səyyah, gəzən; Ruhən azad",
    "meaning_en": "Flowing, going; Traveler, wanderer; Spiritually free",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Rəşad", "Rəsul", "Rəfiq"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 860,
    "name": "Səmər",
    "name_en": "Samar",
    "meaning": "Meyvə, bəhrə; Nəticə, fayda; Uğur, müvəffəqiyyət",
    "meaning_en": "Fruit, yield; Result, benefit; Success, achievement",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Samir", "Sənan", "Səbuhi"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 861,
    "name": "Turxan",
    "name_en": "Turkhan",
    "meaning": "Türk xanı; Güclü, qüdrətli; Lider, başçı",
    "meaning_en": "Turkic khan; Strong, powerful; Leader, chief",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Tural", "Turan", "Turgut"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 862,
    "name": "Vasif",
    "name_en": "Vasif",
    "meaning": "Tərifçi, həmdedici; Öyən, mədh edən; Təsvir edən",
    "meaning_en": "Praiser, glorifier; Extoller, eulogizer; Describer",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Vüsal", "Vəli", "Vaqif"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 863,
    "name": "Zahid",
    "name_en": "Zahid",
    "meaning": "Dindar, təqvalı; Zəhmətkeş, çalışqan; Səbirli, dözümlü",
    "meaning_en": "Religious, pious; Hardworking, diligent; Patient, enduring",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zaur", "Zəfər", "Zakir"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 864,
    "name": "Əliyar",
    "name_en": "Aliyar",
    "meaning": "Əlinin dostu; Yaxın, sirdaş; Sadiq, vəfalı",
    "meaning_en": "Friend of Ali; Close, confidant; Loyal, faithful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əli", "Əmir", "Əkbər"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 865,
    "name": "Şəhriyar",
    "name_en": "Shahriyar",
    "meaning": "Şəhər hökmdarı; Böyük, əzəmətli; Lider, başçı",
    "meaning_en": "Ruler of the city; Great, grand; Leader, chief",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Şahin", "Şamil", "Şəmsi"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 866,
    "name": "Ağamir",
    "name_en": "Aghamir",
    "meaning": "Böyük əmir; Hörmətli, nüfuzlu; Lider, başçı",
    "meaning_en": "Great emir; Respected, influential; Leader, chief",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əmir", "Ağabəy", "Əli"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 867,
    "name": "Bəhlul",
    "name_en": "Bahlul",
    "meaning": "Şən, xoşhəl; Gülərüz, sevincli; Ağıllı, müdrik",
    "meaning_en": "Cheerful, happy; Smiling, joyful; Intelligent, wise",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Bəxtiyar", "Bəhram", "Bəşir"],
    "popularity": 66,
    "viewCount": 0
  },
  {
    "id": 868,
    "name": "Cavad",
    "name_en": "Javad",
    "meaning": "Səxavətli, cömərd; Əliaçıq, xeyirxah; Dəyərli, qiymətli",
    "meaning_en": "Generous, benevolent; Open-handed, kind; Valuable, precious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Cavid", "Cahid", "Camal"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 869,
    "name": "Dəmirçi",
    "name_en": "Damirchi",
    "meaning": "Dəmirçi; Güclü, möhkəm; Zəhmətkeş, çalışqan",
    "meaning_en": "Blacksmith; Strong, firm; Hardworking, diligent",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Dəmir", "Polad", "Teymur"],
    "popularity": 65,
    "viewCount": 0
  },
  {
    "id": 870,
    "name": "Elnur",
    "name_en": "Elnur",
    "meaning": "Xalqın nuru, elin işığı; Parlaq, aydın; Gözəl, nurani",
    "meaning_en": "Light of the people, illumination of the nation; Bright, clear; Beautiful, radiant",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elçin", "Elşən"],
    "popularity": 82,
    "viewCount": 0
  },
  {
    "id": 871,
    "name": "Fəxri",
    "name_en": "Fakhri",
    "meaning": "Fəxr edən, qürurlu; Şərəfli, hörmətli; Dəyərli, qiymətli",
    "meaning_en": "Proud, honorable; Glorious, respected; Valuable, precious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fərid", "Fərhad", "Fəzil"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 872,
    "name": "Həmdulla",
    "name_en": "Hamdullah",
    "meaning": "Allaha həmd edən; Şükür edən; Dindar, təqvalı",
    "meaning_en": "One who praises Allah; Grateful; Religious, pious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Həmid", "Abdulla", "Allahverdi"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 873,
    "name": "İdris",
    "name_en": "Idris",
    "meaning": "Peyğəmbər adı; Müdrik, ağıllı; Bilikli, dərrakəli",
    "meaning_en": "Prophet's name; Wise, intelligent; Knowledgeable, perceptive",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["İbrahim", "İsmayıl", "İlyas"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 874,
    "name": "Kamil",
    "name_en": "Kamil",
    "meaning": "Mükəmməl, tam; Bitkin, yetkin; Fəzilətli, əxlaqlı",
    "meaning_en": "Perfect, complete; Mature, accomplished; Virtuous, moral",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Kərim", "Kamal", "Kənan"],
    "popularity": 78,
    "viewCount": 0
  },
  {
    "id": 875,
    "name": "Müslüm",
    "name_en": "Muslim",
    "meaning": "Müsəlman; Dindar, inanclı; Təqvalı, saleh",
    "meaning_en": "Muslim; Religious, faithful; Pious, righteous",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Mübariz", "Müşfiq", "Mütəllim"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 876,
    "name": "Nəbi",
    "name_en": "Nabi",
    "meaning": "Peyğəmbər, elçi; Xəbərçi, müjdəçi; Müqəddəs, uca",
    "meaning_en": "Prophet, messenger; Bearer of news, harbinger; Sacred, sublime",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Namiq", "Nəsir", "Nəzim"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 877,
    "name": "Oruc",
    "name_en": "Oruj",
    "meaning": "Oruc tutan; Dindar, inanclı; Səbirli, dözümlü",
    "meaning_en": "One who fasts; Religious, faithful; Patient, enduring",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Orxan", "Osman", "Oqtay"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 878,
    "name": "Polad",
    "name_en": "Polad",
    "meaning": "Polad; Möhkəm, güclü; Dözümlü, səbirli",
    "meaning_en": "Steel; Firm, strong; Resilient, patient",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Dəmir", "Teymur", "Rüstəm"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 879,
    "name": "Qədirli",
    "name_en": "Gadirli",
    "meaning": "Qüdrətli, güclü; Dəyərli, qiymətli; Hörmətli, nüfuzlu",
    "meaning_en": "Powerful, strong; Valuable, precious; Respected, influential",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Qədir", "Qasım", "Qəhrəman"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 880,
    "name": "Rüstəm",
    "name_en": "Rustam",
    "meaning": "Qəhrəman, igid; Güclü, qüvvətli; Qoçaq, cəsur",
    "meaning_en": "Hero, brave; Strong, powerful; Valiant, courageous",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Ruslan", "Rafiq", "Ramil"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 881,
    "name": "Sənan",
    "name_en": "Sanan",
    "meaning": "Nizə ucu; Kəskin, iti; Ağıllı, zəkalı",
    "meaning_en": "Spearhead; Sharp, keen; Intelligent, clever",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Samir", "Səmər", "Səbuhi"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 882,
    "name": "Turgut",
    "name_en": "Turgut",
    "meaning": "Ayağa qalxan, dirçələn; Güclü, qüvvətli; İgid, cəsur",
    "meaning_en": "One who rises, revives; Strong, powerful; Brave, courageous",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Tural", "Turan", "Turxan"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 883,
    "name": "Vüsal",
    "name_en": "Vusal",
    "meaning": "Qovuşma, birləşmə; Çatma, nailiyyət; Xoşbəxtlik, sevinc",
    "meaning_en": "Reunion, union; Attainment, achievement; Happiness, joy",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Vəli", "Vaqif", "Vasif"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 884,
    "name": "Yaşar",
    "name_en": "Yashar",
    "meaning": "Yaşayan, həyat sürən; Uzunömürlü; Canlı, dinamik",
    "meaning_en": "Living, enduring life; Long-lived; Lively, dynamic",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Yusif", "Yaqub", "Yasəmən"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 885,
    "name": "Zakir",
    "name_en": "Zakir",
    "meaning": "Zikr edən, anan; Xatırlayan, yad edən; Dindar, təqvalı",
    "meaning_en": "One who remembers, mentions; Recaller, commemorator; Religious, pious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zahid", "Zaur", "Zəfər"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 886,
    "name": "Əmir",
    "name_en": "Amir",
    "meaning": "Hökmdar, əmir; Rəhbər, başçı; Güclü, qüdrətli",
    "meaning_en": "Ruler, emir; Leader, chief; Strong, powerful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əli", "Əliyar", "Əkbər"],
    "popularity": 79,
    "viewCount": 0
  },
  {
    "id": 887,
    "name": "Şəmsəddin",
    "name_en": "Shamsaddin",
    "meaning": "Dinin günəşi; Parlaq, işıqlı; Müqəddəs, uca",
    "meaning_en": "Sun of religion; Bright, luminous; Sacred, sublime",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Şəmsi", "Nəcməddin", "Cəlaləddin"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 888,
    "name": "Aydın",
    "name_en": "Aydin",
    "meaning": "Aydın, parlaq; İşıqlı, nurani; Açıq, səmimi",
    "meaning_en": "Clear, bright; Luminous, radiant; Open, sincere",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Ayan", "Elnur", "Günay"],
    "popularity": 88,
    "viewCount": 0
  },
  {
    "id": 889,
    "name": "Bəhruz",
    "name_en": "Behruz",
    "meaning": "Xoşbəxt gün; Uğurlu, bəxtiyar; Sevincli, şən",
    "meaning_en": "Happy day; Successful, fortunate; Joyful, cheerful",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Bəxtiyar", "Bəhlul", "Bəşir"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 890,
    "name": "Cavidan",
    "name_en": "Javidan",
    "meaning": "Əbədi, sonsuz; Daimi, ölməz; Uzunömürlü",
    "meaning_en": "Eternal, endless; Permanent, immortal; Long-lived",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Cavid", "Cavad", "Camal"],
    "popularity": 79,
    "viewCount": 0
  },
  {
    "id": 891,
    "name": "Dəmir",
    "name_en": "Damir",
    "meaning": "Dəmir; Möhkəm, güclü; Dözümlü, səbirli",
    "meaning_en": "Iron; Firm, strong; Resilient, patient",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Teymur", "Polad", "Dəmirçi"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 892,
    "name": "Elxan",
    "name_en": "Elkhan",
    "meaning": "Elin xanı, xalqın hökmdarı; Lider, başçı; Güclü, qüdrətli",
    "meaning_en": "Khan of the people, ruler of the nation; Leader, chief; Strong, powerful",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elnur", "Elçin"],
    "popularity": 78,
    "viewCount": 0
  },
  {
    "id": 893,
    "name": "Fikrət",
    "name_en": "Fikrat",
    "meaning": "Fikir, düşüncə; Ağıllı, müdrik; Dərrakəli, zəkalı",
    "meaning_en": "Thought, idea; Intelligent, wise; Perceptive, clever",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fərid", "Fəxri", "Fəzil"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 894,
    "name": "Gündüz",
    "name_en": "Gunduz",
    "meaning": "Günəş, işıq; Aydınlıq, parlaqlıq; Xoşbəxt, sevincli",
    "meaning_en": "Sun, light; Brightness, radiance; Happy, joyful",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Günay", "Günel", "Ay"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 895,
    "name": "Həmid",
    "name_en": "Hamid",
    "meaning": "Həmd edən, tərifləyən; Şükür edən; Mərhəmətli, şəfqətli",
    "meaning_en": "One who praises, glorifies; Grateful; Merciful, compassionate",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Həsən", "Hüseyn", "Həkim"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 896,
    "name": "İlkin",
    "name_en": "Ilkin",
    "meaning": "İlk, əvvəl; Başlanğıc, təməl; Öncül, lider",
    "meaning_en": "First, initial; Beginning, foundation; Pioneer, leader",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["İlqar", "İlham", "İlyas"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 897,
    "name": "Kəmaləddin",
    "name_en": "Kemaleddin",
    "meaning": "Dinin kamillığı; Mükəmməl, uca; Fəzilətli, əxlaqlı",
    "meaning_en": "Perfection of religion; Perfect, sublime; Virtuous, moral",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Kərim", "Kamil", "Kənan"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 898,
    "name": "Ləman",
    "name_en": "Laman",
    "meaning": "Parlaqlıq, işıq; Zərif, incə; Gözəl, cazibədar",
    "meaning_en": "Brightness, light; Delicate, subtle; Beautiful, charming",
    "gender": "qız",
    "origin": "ərəb",
    "similar": ["Leyla", "Lalə", "Lətifə"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 899,
    "name": "Məhəmməd",
    "name_en": "Muhammad",
    "meaning": "Təriflənən, həmd olunan; Uca, böyük; Müqəddəs, xeyirli",
    "meaning_en": "Praised, glorified; Sublime, great; Sacred, beneficial",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Məmməd", "Məlik", "Məhərrəm"],
    "popularity": 90,
    "viewCount": 0
  },
  {
    "id": 900,
    "name": "Nəsibə",
    "name_en": "Nasiba",
    "meaning": "Nəsib, qismət; Tale, bəxt; Uğur, müvəffə əqiyyət",
    "meaning_en": "Destiny, fate; Fortune, luck; Success, achievement",
    "gender": "qız",
    "origin": "ərəb",
    "similar": ["Nəzakət", "Nəfisə", "Nəcibə"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 901,
    "name": "Pənah",
    "name_en": "Panah",
    "meaning": "Sığınacaq, qoruyucu; Himayədar, dəstək; Xilaskar, nicat",
    "meaning_en": "Shelter, protector; Patron, support; Savior, salvation",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Pəri", "Pərvanə", "Pərvin"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 902,
    "name": "Qədir",
    "name_en": "Gadir",
    "meaning": "Qüdrətli, güclü; Əzəmətli, uca; Dəyərli, qiymətli",
    "meaning_en": "Powerful, strong; Grand, sublime; Valuable, precious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Qasım", "Qəhrəman", "Qurban"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 903,
    "name": "Ramil",
    "name_en": "Ramil",
    "meaning": "Atıcı, nişançı; Dəqiq, hədəfə vuran; Cəsur, igid",
    "meaning_en": "Archer, marksman; Accurate, hitting the target; Brave, valiant",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ruslan", "Rüstəm", "Rafiq"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 904,
    "name": "Sənan",
    "name_en": "Sanan",
    "meaning": "Nizə ucu; Kəskin, iti; Ağıllı, zəkalı",
    "meaning_en": "Spearhead; Sharp, keen; Intelligent, clever",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Samir", "Səmər", "Səbuhi"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 905,
    "name": "Tərlan",
    "name_en": "Tarlan",
    "meaning": "Qartal; Güclü, cəsur; Azad, sərbəst",
    "meaning_en": "Eagle; Strong, courageous; Free, independent",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Tural", "Turan", "Turxan"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 906,
    "name": "Ümid",
    "name_en": "Umid",
    "meaning": "Ümid, arzu; Gələcək, perspektiv; Müsbət, nikbin",
    "meaning_en": "Hope, wish; Future, prospect; Positive, optimistic",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ülvi", "Ürfan", "Üzeyir"],
    "popularity": 84,
    "viewCount": 0
  },
  {
    "id": 907,
    "name": "Vaqif",
    "name_en": "Vagif",
    "meaning": "Bilən, xəbərdar; Ağıllı, müdrik; Anlayan, dərk edən",
    "meaning_en": "Knowing, aware; Intelligent, wise; Understanding, perceiving",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Vüsal", "Vəli", "Vasif"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 908,
    "name": "Zahid",
    "name_en": "Zahid",
    "meaning": "Dindar, təqvalı; Zəhmətkeş, çalışqan; Səbirli, dözümlü",
    "meaning_en": "Religious, pious; Hardworking, diligent; Patient, enduring",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zaur", "Zəfər", "Zakir"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 909,
    "name": "Ədalət",
    "name_en": "Adalat",
    "meaning": "Ədalət, haqq; Düzgünlük, dürüstlük; Haqqsevər",
    "meaning_en": "Justice, right; Correctness, honesty; Lover of justice",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əhməd", "Əsgər", "Əziz"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 910,
    "name": "Şəhriyar",
    "name_en": "Shahriyar",
    "meaning": "Şəhər hökmdarı; Böyük, əzəmətli; Lider, başçı",
    "meaning_en": "Ruler of the city; Great, grand; Leader, chief",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Şahin", "Şamil", "Şəmsi"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 911,
    "name": "Ağabəy",
    "name_en": "Aghabey",
    "meaning": "Böyük bəy, hörmətli ağa; Lider, rəhbər; Nüfuzlu, hörmətli",
    "meaning_en": "Great bey, respected master; Leader, chief; Influential, respected",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Əli", "Əmir", "Əkbər"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 912,
    "name": "Cəlal",
    "name_en": "Jalal",
    "meaning": "Böyüklük, əzəmət; Şan, şöhrət; Hörmət, ləyaqət",
    "meaning_en": "Greatness, grandeur; Glory, fame; Respect, dignity",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ceyhun", "Cəmil", "Cəfər"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 913,
    "name": "Dadaş",
    "name_en": "Dadash",
    "meaning": "Böyük qardaş; Dost, yoldaş; Hörmətli, sevimli",
    "meaning_en": "Big brother; Friend, companion; Respected, beloved",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Əli", "Əmir", "Əkbər"],
    "popularity": 65,
    "viewCount": 0
  },
  {
    "id": 914,
    "name": "Elmar",
    "name_en": "Elmar",
    "meaning": "Elin maralı; Xalqın sevimli oğlu; Gözəl, yaraşıqlı",
    "meaning_en": "Charm of the people; Beloved son of the nation; Beautiful, handsome",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elnur", "Elçin"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 915,
    "name": "Fəxrəddin",
    "name_en": "Fakhreddin",
    "meaning": "Dinin fəxri; Şərəfli, hörmətli; Müqəddəs, uca",
    "meaning_en": "Pride of religion; Honorable, respected; Sacred, sublime",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fəxri", "Fəzil", "Fərid"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 916,
    "name": "Gündüz",
    "name_en": "Gunduz",
    "meaning": "Günəş, işıq; Aydınlıq, parlaqlıq; Xoşbəxt, sevincli",
    "meaning_en": "Sun, light; Brightness, radiance; Happy, joyful",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Günay", "Günel", "Ay"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 917,
    "name": "Həmid",
    "name_en": "Hamid",
    "meaning": "Həmd edən, tərifləyən; Şükür edən; Mərhəmətli, şəfqətli",
    "meaning_en": "One who praises, glorifies; Grateful; Merciful, compassionate",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Həsən", "Hüseyn", "Həkim"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 918,
    "name": "İlkin",
    "name_en": "Ilkin",
    "meaning": "İlk, əvvəl; Başlanğıc, təməl; Öncül, lider",
    "meaning_en": "First, initial; Beginning, foundation; Pioneer, leader",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["İlqar", "İlham", "İlyas"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 919,
    "name": "Kəmaləddin",
    "name_en": "Kemaleddin",
    "meaning": "Dinin kamillığı; Mükəmməl, uca; Fəzilətli, əxlaqlı",
    "meaning_en": "Perfection of religion; Perfect, sublime; Virtuous, moral",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Kərim", "Kamil", "Kənan"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 920,
    "name": "Lətif",
    "name_en": "Latif",
    "meaning": "Zərif, nazik; Yumşaq, incə; Xoş, lütfkar",
    "meaning_en": "Delicate, thin; Soft, gentle; Pleasant, gracious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ləti", "Ləman", "Lalə"],
    "popularity": 65,
    "viewCount": 0
  },
  {
    "id": 921,
    "name": "Məmməd",
    "name_en": "Mammad",
    "meaning": "Təriflənən, həmd olunan; Uca, böyük; Müqəddəs, xeyirli",
    "meaning_en": "Praised, glorified; Sublime, great; Sacred, beneficial",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Məhəmməd", "Məlik", "Məhərrəm"],
    "popularity": 90,
    "viewCount": 0
  },
  {
    "id": 922,
    "name": "Nəsib",
    "name_en": "Nasib",
    "meaning": "Nəsib, qismət; Tale, bəxt; Uğur, müvəffəqiyyət",
    "meaning_en": "Destiny, fate; Fortune, luck; Success, achievement",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Niyaz", "Nəsir", "Nəzim"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 923,
    "name": "Oqtay",
    "name_en": "Ogtay",
    "meaning": "Ox kimi sürətli; Cəld, çevik; Ağıllı, zəkalı",
    "meaning_en": "Fast as an arrow; Agile, nimble; Intelligent, clever",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Orxan", "Osman", "Oruc"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 924,
    "name": "Pərviz",
    "name_en": "Parviz",
    "meaning": "Uğurlu, bəxtiyar; Xoşbəxt, sevincli; Qalib, zəfər çalan",
    "meaning_en": "Successful, fortunate; Happy, joyful; Victorious, triumphant",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Pənah", "Pərvin", "Bəxtiyar"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 925,
    "name": "Qasım",
    "name_en": "Gasim",
    "meaning": "Bölən, paylayan; Ədalətli, haqqsevər; Cömərd, səxavətli",
    "meaning_en": "Divider, distributor; Just, righteous; Generous, benevolent",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Qədir", "Qəhrəman", "Qurban"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 926,
    "name": "Rəşad",
    "name_en": "Rashad",
    "meaning": "Doğru yol tapan; Hidayət edən; Ağıllı, müdrik",
    "meaning_en": "One who finds the right path; Guiding; Intelligent, wise",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Rəsul", "Rəhim", "Rəfiq"],
    "popularity": 80,
    "viewCount": 0
  },
  {
    "id": 927,
    "name": "Samir",
    "name_en": "Samir",
    "meaning": "Söhbət yoldaşı; Danışan, natiq; Dost, sirdaş",
    "meaning_en": "Conversation companion; Speaker, orator; Friend, confidant",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Səmər", "Sənan", "Səbuhi"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 928,
    "name": "Tural",
    "name_en": "Tural",
    "meaning": "Canlı, həyat dolu; Güclü, dözümlü; İgid, cəsur",
    "meaning_en": "Lively, full of life; Strong, resilient; Brave, courageous",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Turan", "Turgut", "Turxan"],
    "popularity": 85,
    "viewCount": 0
  },
  {
    "id": 929,
    "name": "Ürfan",
    "name_en": "Urphan",
    "meaning": "Bilik, mərifət; Ağıl, dərrakə; Hikmət, müdriklik",
    "meaning_en": "Knowledge, wisdom; Intellect, understanding; Wisdom, sagacity",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ülvi", "Ümid", "Üzeyir"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 930,
    "name": "Vüqar",
    "name_en": "Vugar",
    "meaning": "Qürur, əzəmət; Hörmət, ləyaqət; Uca, yüksək",
    "meaning_en": "Pride, grandeur; Respect, dignity; Lofty, high",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Vüsal", "Vəli", "Vaqif"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 931,
    "name": "Yaqub",
    "name_en": "Yagub",
    "meaning": "Peyğəmbər adı; Müqəddəs, uca; Dindar, inanclı",
    "meaning_en": "Prophet's name; Sacred, sublime; Religious, faithful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Yusif", "Yaşar", "Davud"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 932,
    "name": "Zəfər",
    "name_en": "Zafar",
    "meaning": "Zəfər, qələbə; Uğur, müvəffəqiyyət; Qalib, qalibiyyətli",
    "meaning_en": "Victory, triumph; Success, achievement; Victorious, winning",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zahid", "Zaur", "Zakir"],
    "popularity": 79,
    "viewCount": 0
  },
  {
    "id": 933,
    "name": "Əli",
    "name_en": "Ali",
    "meaning": "Yüksək, uca; Əzəmətli, böyük; Şərəfli, hörmətli",
    "meaning_en": "High, sublime; Grand, great; Honorable, respected",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əliyar", "Əmir", "Əkbər"],
    "popularity": 95,
    "viewCount": 0
  },
  {
    "id": 934,
    "name": "Şamil",
    "name_en": "Shamil",
    "meaning": "Hər şeyi əhatə edən; Tam, mükəmməl; Kapsamlı, geniş",
    "meaning_en": "All-encompassing; Complete, perfect; Comprehensive, broad",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Şahin", "Şəhriyar", "Şəmsi"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 935,
    "name": "Araz",
    "name_en": "Araz",
    "meaning": "Çay adı; Geniş, axar; Güclü, qüvvətli",
    "meaning_en": "River name; Wide, flowing; Strong, powerful",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Kür", "Dəniz", "Çay"],
    "popularity": 82,
    "viewCount": 0
  },
  {
    "id": 936,
    "name": "Bəxtiyar",
    "name_en": "Bakhtiyar",
    "meaning": "Xoşbəxt, bəxtli; Uğurlu, müvəffəqiyyətli; Sevincli, şən",
    "meaning_en": "Happy, fortunate; Successful, prosperous; Joyful, cheerful",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Bəhram", "Bəhlul", "Bəşir"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 937,
    "name": "Cəfər",
    "name_en": "Jafar",
    "meaning": "Çay; Bərəkət, bolluq; Xeyir, fayda",
    "meaning_en": "River; Abundance, plenty; Good, benefit",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ceyhun", "Cəlal", "Cəmil"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 938,
    "name": "Dəyanət",
    "name_en": "Dayanat",
    "meaning": "Dindarlıq, iman; Sədaqət, vəfadarlıq; Əxlaq, fəzilət",
    "meaning_en": "Piety, faith; Loyalty, fidelity; Morality, virtue",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zahid", "Təqva", "İman"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 939,
    "name": "Elçin",
    "name_en": "Elchin",
    "meaning": "Xalqın elçisi; Nümayəndə, səfir; Xalqın sevimli oğlu",
    "meaning_en": "Envoy of the people; Representative, ambassador; Beloved son of the people",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elnur", "Elşən"],
    "popularity": 80,
    "viewCount": 0
  },
  {
    "id": 940,
    "name": "Fərid",
    "name_en": "Farid",
    "meaning": "Yeganə, tək; Bənzərsiz, nadir; Qiymətli, dəyərli",
    "meaning_en": "Unique, sole; Unparalleled, rare; Valuable, precious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fərhad", "Fəxri", "Fəzil"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 941,
    "name": "Hüseyn",
    "name_en": "Huseyn",
    "meaning": "Gözəl, yaraşıqlı; Yaxşı, xeyirli; Müqəddəs, pak",
    "meaning_en": "Beautiful, handsome; Good, beneficial; Sacred, pure",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Həsən", "Həmid", "Həkim"],
    "popularity": 90,
    "viewCount": 0
  },
  {
    "id": 942,
    "name": "İbrahim",
    "name_en": "Ibrahim",
    "meaning": "Çoxsaylı xalqın atası; Ulu, hörmətli; Peyğəmbər adı",
    "meaning_en": "Father of a multitude; Great, respected; Prophet's name",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["İsmayıl", "İlyas", "İdris"],
    "popularity": 83,
    "viewCount": 0
  },
  {
    "id": 943,
    "name": "Kərim",
    "name_en": "Karim",
    "meaning": "Səxavətli, cömərd; Mərhəmətli, şəfqətli; Dəyərli, qiymətli",
    "meaning_en": "Generous, benevolent; Merciful, compassionate; Valuable, precious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Kamil", "Kamal", "Kənan"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 944,
    "name": "Mübariz",
    "name_en": "Mubariz",
    "meaning": "Döyüşçü, qəhrəman; İgid, cəsur; Mübarizə aparan",
    "meaning_en": "Warrior, hero; Brave, courageous; One who struggles",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Müslüm", "Müşfiq", "Mütəllim"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 945,
    "name": "Namiq",
    "name_en": "Namiq",
    "meaning": "Məktub yazan; Yazıçı, şair; Danışan, natiq",
    "meaning_en": "Letter writer; Writer, poet; Speaker, orator",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Nəsir", "Nəbi", "Nəzim"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 946,
    "name": "Orxan",
    "name_en": "Orkhan",
    "meaning": "Böyük xan, hökmdar; Lider, başçı; Güclü, qüdrətli",
    "meaning_en": "Great khan, ruler; Leader, chief; Strong, powerful",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Oqtay", "Osman", "Oruc"],
    "popularity": 80,
    "viewCount": 0
  },
  {
    "id": 947,
    "name": "Qəhrəman",
    "name_en": "Gahraman",
    "meaning": "Qəhrəman, igid; Cəsur, qoçaq; Qorxmaz, ürəkli",
    "meaning_en": "Hero, brave; Courageous, valiant; Fearless, hearty",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Qədir", "Qasım", "Qurban"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 948,
    "name": "Rəsul",
    "name_en": "Rasul",
    "meaning": "Elçi, peyğəmbər; Xəbərçi, müjdəçi; Dindar, müqəddəs",
    "meaning_en": "Messenger, prophet; Bearer of news, harbinger; Religious, sacred",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Rəhim", "Rəşad", "Rəfiq"],
    "popularity": 79,
    "viewCount": 0
  },
  {
    "id": 949,
    "name": "Ruslan",
    "name_en": "Ruslan",
    "meaning": "Şir kimi; Güclü, qüvvətli; Qəhrəman, igid",
    "meaning_en": "Like a lion; Strong, powerful; Hero, brave",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Rüstəm", "Rafiq", "Ramil"],
    "popularity": 81,
    "viewCount": 0
  },
  {
    "id": 950,
    "name": "Turan",
    "name_en": "Turan",
    "meaning": "Vətən, yurd; Torpaq, diyar; Güclü, qüdrətli",
    "meaning_en": "Homeland, country; Land, region; Strong, powerful",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Tural", "Turgut", "Turxan"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 951,
    "name": "Üzeyir",
    "name_en": "Uzeyir",
    "meaning": "Köməkçi, yardımçı; Dəstək, himayədar; Xeyirxah, yaxşı",
    "meaning_en": "Helper, assistant; Support, patron; Benevolent, good",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ülvi", "Ümid", "Ürfan"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 952,
    "name": "Vəli",
    "name_en": "Vali",
    "meaning": "Dost, yaxın; Himayədar, qoruyucu; Müqəddəs, uca",
    "meaning_en": "Friend, close; Patron, protector; Sacred, sublime",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Vüsal", "Vaqif", "Vasif"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 953,
    "name": "Xəyal",
    "name_en": "Khayal",
    "meaning": "Xəyal, arzu; Yuxu, fantaziya; Gözəl, sirli",
    "meaning_en": "Dream, wish; Sleep, fantasy; Beautiful, mysterious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Röya", "Arzu", "Ümid"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 954,
    "name": "Yusif",
    "name_en": "Yusif",
    "meaning": "Allah artırsın; Çoxaltsın, bərəkətli; Gözəl, yaraşıqlı",
    "meaning_en": "May Allah increase; Multiply, blessed; Beautiful, handsome",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Yaqub", "Yaşar", "Davud"],
    "popularity": 86,
    "viewCount": 0
  },
  {
    "id": 955,
    "name": "Zakir",
    "name_en": "Zakir",
    "meaning": "Zikr edən, anan; Xatırlayan, yad edən; Dindar, təqvalı",
    "meaning_en": "One who remembers, mentions; Recaller, commemorator; Religious, pious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zahid", "Zaur", "Zəfər"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 956,
    "name": "Əkbər",
    "name_en": "Akbar",
    "meaning": "Ən böyük, uca; Əzəmətli, qüdrətli; Şərəfli, hörmətli",
    "meaning_en": "The greatest, sublime; Grand, powerful; Honorable, respected",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əli", "Əmir", "Əliyar"],
    "popularity": 82,
    "viewCount": 0
  },
  {
    "id": 957,
    "name": "Şəmsi",
    "name_en": "Shamsi",
    "meaning": "Günəşə aid; Parlaq, işıqlı; Nurani, gözəl",
    "meaning_en": "Related to the sun; Bright, luminous; Radiant, beautiful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Şəms", "Günay", "Ay"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 958,
    "name": "Adil",
    "name_en": "Adil",
    "meaning": "Ədalətli, haqqsevər; Düzgün, dürüst; Ədalətli hökmdar",
    "meaning_en": "Just, righteous; Correct, honest; Just ruler",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ədalət", "Haqq", "Düzgün"],
    "popularity": 85,
    "viewCount": 0
  },
  {
    "id": 959,
    "name": "Cəlaləddin",
    "name_en": "Jalaladdin",
    "meaning": "Dinin əzəməti; Böyük, uca; Şərəfli, hörmətli",
    "meaning_en": "Grandeur of religion; Great, sublime; Honorable, respected",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Cəlal", "Kəmaləddin", "Nəcməddin"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 960,
    "name": "Elmar",
    "name_en": "Elmar",
    "meaning": "Elin maralı; Xalqın sevimli oğlu; Gözəl, yaraşıqlı",
    "meaning_en": "Charm of the people; Beloved son of the nation; Beautiful, handsome",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elnur", "Elçin"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 961,
    "name": "Fəxrəddin",
    "name_en": "Fakhreddin",
    "meaning": "Dinin fəxri; Şərəfli, hörmətli; Müqəddəs, uca",
    "meaning_en": "Pride of religion; Honorable, respected; Sacred, sublime",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fəxri", "Fəzil", "Fərid"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 962,
    "name": "Həkim",
    "name_en": "Hakim",
    "meaning": "Həkim; Müdrik, ağıllı; Bilikli, dərrakəli",
    "meaning_en": "Doctor; Wise, intelligent; Knowledgeable, perceptive",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Həsən", "Hüseyn", "Həmid"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 963,
    "name": "İlham",
    "name_en": "Ilham",
    "meaning": "İlham, ruh; Təşviq, həvəs; Yaradıcılıq, istedad",
    "meaning_en": "Inspiration, spirit; Encouragement, enthusiasm; Creativity, talent",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["İlkin", "İlqar", "İlyas"],
    "popularity": 79,
    "viewCount": 0
  },
  {
    "id": 964,
    "name": "Kənan",
    "name_en": "Kenan",
    "meaning": "Qədim ölkə adı; Müqəddəs, uca; Bərəkətli, zəngin",
    "meaning_en": "Ancient country name; Sacred, sublime; Fertile, rich",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Kərim", "Kamil", "Kamal"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 965,
    "name": "Məlik",
    "name_en": "Malik",
    "meaning": "Padşah, hökmdar; Rəhbər, başçı; Güclü, qüdrətli",
    "meaning_en": "King, ruler; Leader, chief; Strong, powerful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Məhəmməd", "Məhərrəm", "Sultan"],
    "popularity": 76,
    "viewCount": 0
  },
  {
    "id": 966,
    "name": "Nəzim",
    "name_en": "Nazim",
    "meaning": "Şair, nazim; Yazıçı, ədib; Nizamlı, qaydalı",
    "meaning_en": "Poet, composer; Writer, author; Orderly, disciplined",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Namiq", "Nəsir", "Nəbi"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 967,
    "name": "Rəhim",
    "name_en": "Rahim",
    "meaning": "Mərhəmətli, şəfqətli; Cömərd, səxavətli; Bağışlayan, əfv edən",
    "meaning_en": "Merciful, compassionate; Generous, benevolent; Forgiving, pardoning",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Rəşad", "Rəsul", "Rəfiq"],
    "popularity": 78,
    "viewCount": 0
  },
  {
    "id": 968,
    "name": "Səbuhi",
    "name_en": "Sabuh",
    "meaning": "Səhərə aid; Təzə, yeni; Gözəl, parlaq",
    "meaning_en": "Related to dawn; Fresh, new; Beautiful, bright",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Samir", "Səmər", "Sənan"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 969,
    "name": "Teymur",
    "name_en": "Teymur",
    "meaning": "Dəmir kimi möhkəm; Güclü, dözümlü; Qəhrəman, igid",
    "meaning_en": "Strong as iron; Powerful, resilient; Hero, brave",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Dəmir", "Polad", "Rüstəm"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 970,
    "name": "Vaqif",
    "name_en": "Vagif",
    "meaning": "Bilən, xəbərdar; Ağıllı, müdrik; Anlayan, dərk edən",
    "meaning_en": "Knowing, aware; Intelligent, wise; Understanding, perceiving",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Vüsal", "Vəli", "Vasif"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 971,
    "name": "Zaur",
    "name_en": "Zaur",
    "meaning": "Ziyarət edən; Gəzən, səyyah; Açıq, səmimi",
    "meaning_en": "Visitor; Wanderer, traveler; Open, sincere",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zahid", "Zəfər", "Zakir"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 972,
    "name": "Ənvər",
    "name_en": "Anvar",
    "meaning": "Çox nurlu, çox işıqlı; Parlaq, gözəl; Aydın, aydınlıq",
    "meaning_en": "Very luminous, very bright; Radiant, beautiful; Clear, clarity",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əli", "Əmir", "Əkbər"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 973,
    "name": "Şahin",
    "name_en": "Shahin",
    "meaning": "Şahin quşu; Cəsur, igid; Sürətli, cəld",
    "meaning_en": "Falcon bird; Brave, valiant; Fast, agile",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Şəhriyar", "Şəmsi", "Şamil"],
    "popularity": 81,
    "viewCount": 0
  },
  {
    "id": 974,
    "name": "Arif",
    "name_en": "Arif",
    "meaning": "Bilikli, dərrakəli; Ağıllı, müdrik; Tanıyan, bilən",
    "meaning_en": "Knowledgeable, perceptive; Intelligent, wise; One who knows, recognizes",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Arifa", "Ürfan", "Həkim"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 975,
    "name": "Bəşir",
    "name_en": "Bashir",
    "meaning": "Müjdəçi, xəbərçi; Sevimli, xoş; Xeyirxah, yaxşı",
    "meaning_en": "Bearer of good news, harbinger; Beloved, pleasant; Benevolent, good",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Bəxtiyar", "Bəhram", "Bəhlul"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 976,
    "name": "Cahid",
    "name_en": "Jahid",
    "meaning": "Çalışan, səy göstərən; Fəal, enerjili; Zəhmətkeş",
    "meaning_en": "Striving, endeavoring; Active, energetic; Hardworking",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Cavid", "Cavad", "Camal"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 977,
    "name": "Dadaş",
    "name_en": "Dadash",
    "meaning": "Böyük qardaş; Dost, yoldaş; Hörmətli, sevimli",
    "meaning_en": "Big brother; Friend, companion; Respected, beloved",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Əli", "Əmir", "Əkbər"],
    "popularity": 65,
    "viewCount": 0
  },
  {
    "id": 978,
    "name": "Elşad",
    "name_en": "Elshad",
    "meaning": "Elin şadlığı, xalqın sevinci; Şən, xoşbəxt; Sevincli, bəxtiyar",
    "meaning_en": "Joy of the people, happiness of the nation; Cheerful, happy; Joyful, fortunate",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elnur", "Elçin"],
    "popularity": 77,
    "viewCount": 0
  },
  {
    "id": 979,
    "name": "Fəzil",
    "name_en": "Fazil",
    "meaning": "Fəzilətli, üstün; Yüksək, uca; Əxlaqlı, dürüst",
    "meaning_en": "Virtuous, superior; High, sublime; Moral, honest",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fərid", "Fərhad", "Fəxri"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 980,
    "name": "Həsrət",
    "name_en": "Hasrat",
    "meaning": "Həsrət, intizar; Arzu, istək; Sevimli, əziz",
    "meaning_en": "Longing, yearning; Desire, wish; Beloved, dear",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Ümid", "Xəyal", "Arzu"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 981,
    "name": "İlyas",
    "name_en": "Ilyas",
    "meaning": "Peyğəmbər adı; Müqəddəs, uca; Dindar, inanclı",
    "meaning_en": "Prophet's name; Sacred, sublime; Religious, faithful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["İbrahim", "İsmayıl", "İdris"],
    "popularity": 78,
    "viewCount": 0
  },
  {
    "id": 982,
    "name": "Məhərrəm",
    "name_en": "Muharram",
    "meaning": "Müqəddəs, toxunulmaz; Uca, böyük; Hörmətli, dəyərli",
    "meaning_en": "Sacred, inviolable; Sublime, great; Respected, valuable",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Məhəmməd", "Məlik", "Məhəbbət"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 983,
    "name": "Nicat",
    "name_en": "Nijat",
    "meaning": "Qurtuluş, xilas; Azadlıq, azad olma; Uğur, müvəffəqiyyət",
    "meaning_en": "Salvation, deliverance; Freedom, liberation; Success, achievement",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Niyaz", "Nəsir", "Nəzim"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 984,
    "name": "Qurban",
    "name_en": "Gurban",
    "meaning": "Qurban; Fədakarlıq, sədaqət; Allah yolunda fəda",
    "meaning_en": "Sacrifice; Devotion, loyalty; Sacrifice in the way of Allah",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Qədir", "Qasım", "Qəhrəman"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 985,
    "name": "Rəvan",
    "name_en": "Ravan",
    "meaning": "Axan, gedən; Səyyah, gəzən; Ruhən azad",
    "meaning_en": "Flowing, going; Traveler, wanderer; Spiritually free",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Rəşad", "Rəsul", "Rəfiq"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 986,
    "name": "Səmər",
    "name_en": "Samar",
    "meaning": "Meyvə, bəhrə; Nəticə, fayda; Uğur, müvəffəqiyyət",
    "meaning_en": "Fruit, yield; Result, benefit; Success, achievement",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Samir", "Sənan", "Səbuhi"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 987,
    "name": "Turxan",
    "name_en": "Turkhan",
    "meaning": "Türk xanı; Güclü, qüdrətli; Lider, başçı",
    "meaning_en": "Turkic khan; Strong, powerful; Leader, chief",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Tural", "Turan", "Turgut"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 988,
    "name": "Vasif",
    "name_en": "Vasif",
    "meaning": "Tərifçi, həmdedici; Öyən, mədh edən; Təsvir edən",
    "meaning_en": "Praiser, glorifier; Extoller, eulogizer; Describer",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Vüsal", "Vəli", "Vaqif"],
    "popularity": 74,
    "viewCount": 0
  },
  {
    "id": 989,
    "name": "Zahid",
    "name_en": "Zahid",
    "meaning": "Dindar, təqvalı; Zəhmətkeş, çalışqan; Səbirli, dözümlü",
    "meaning_en": "Religious, pious; Hardworking, diligent; Patient, enduring",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Zaur", "Zəfər", "Zakir"],
    "popularity": 68,
    "viewCount": 0
  },
  {
    "id": 990,
    "name": "Əliyar",
    "name_en": "Aliyar",
    "meaning": "Əlinin dostu; Yaxın, sirdaş; Sadiq, vəfalı",
    "meaning_en": "Friend of Ali; Close, confidant; Loyal, faithful",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əli", "Əmir", "Əkbər"],
    "popularity": 73,
    "viewCount": 0
  },
  {
    "id": 991,
    "name": "Şəhriyar",
    "name_en": "Shahriyar",
    "meaning": "Şəhər hökmdarı; Böyük, əzəmətli; Lider, başçı",
    "meaning_en": "Ruler of the city; Great, grand; Leader, chief",
    "gender": "oğlan",
    "origin": "fars",
    "similar": ["Şahin", "Şamil", "Şəmsi"],
    "popularity": 75,
    "viewCount": 0
  },
  {
    "id": 992,
    "name": "Ağamir",
    "name_en": "Aghamir",
    "meaning": "Böyük əmir; Hörmətli, nüfuzlu; Lider, başçı",
    "meaning_en": "Great emir; Respected, influential; Leader, chief",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Əmir", "Ağabəy", "Əli"],
    "popularity": 69,
    "viewCount": 0
  },
  {
    "id": 993,
    "name": "Bəhlul",
    "name_en": "Bahlul",
    "meaning": "Şən, xoşhəl; Gülərüz, sevincli; Ağıllı, müdrik",
    "meaning_en": "Cheerful, happy; Smiling, joyful; Intelligent, wise",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Bəxtiyar", "Bəhram", "Bəşir"],
    "popularity": 66,
    "viewCount": 0
  },
  {
    "id": 994,
    "name": "Cavad",
    "name_en": "Javad",
    "meaning": "Səxavətli, cömərd; Əliaçıq, xeyirxah; Dəyərli, qiymətli",
    "meaning_en": "Generous, benevolent; Open-handed, kind; Valuable, precious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Cavid", "Cahid", "Camal"],
    "popularity": 72,
    "viewCount": 0
  },
  {
    "id": 995,
    "name": "Dəmirçi",
    "name_en": "Damirchi",
    "meaning": "Dəmirçi; Güclü, möhkəm; Zəhmətkeş, çalışqan",
    "meaning_en": "Blacksmith; Strong, firm; Hardworking, diligent",
    "gender": "oğlan",
    "origin": "türk",
    "similar": ["Dəmir", "Polad", "Teymur"],
    "popularity": 65,
    "viewCount": 0
  },
  {
    "id": 996,
    "name": "Elnur",
    "name_en": "Elnur",
    "meaning": "Xalqın nuru, elin işığı; Parlaq, aydın; Gözəl, nurani",
    "meaning_en": "Light of the people, illumination of the nation; Bright, clear; Beautiful, radiant",
    "gender": "oğlan",
    "origin": "azərbaycan",
    "similar": ["Elvin", "Elçin", "Elşən"],
    "popularity": 82,
    "viewCount": 0
  },
  {
    "id": 997,
    "name": "Fəxri",
    "name_en": "Fakhri",
    "meaning": "Fəxr edən, qürurlu; Şərəfli, hörmətli; Dəyərli, qiymətli",
    "meaning_en": "Proud, honorable; Glorious, respected; Valuable, precious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Fərid", "Fərhad", "Fəzil"],
    "popularity": 70,
    "viewCount": 0
  },
  {
    "id": 998,
    "name": "Həmdulla",
    "name_en": "Hamdullah",
    "meaning": "Allaha həmd edən; Şükür edən; Dindar, təqvalı",
    "meaning_en": "One who praises Allah; Grateful; Religious, pious",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Həmid", "Abdulla", "Allahverdi"],
    "popularity": 67,
    "viewCount": 0
  },
  {
    "id": 999,
    "name": "İdris",
    "name_en": "Idris",
    "meaning": "Peyğəmbər adı; Müdrik, ağıllı; Bilikli, dərrakəli",
    "meaning_en": "Prophet's name; Wise, intelligent; Knowledgeable, perceptive",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["İbrahim", "İsmayıl", "İlyas"],
    "popularity": 71,
    "viewCount": 0
  },
  {
    "id": 1000,
    "name": "Kamil",
    "name_en": "Kamil",
    "meaning": "Mükəmməl, tam; Bitkin, yetkin; Fəzilətli, əxlaqlı",
    "meaning_en": "Perfect, complete; Mature, accomplished; Virtuous, moral",
    "gender": "oğlan",
    "origin": "ərəb",
    "similar": ["Kərim", "Kamal", "Kənan"],
    "popularity": 78,
    "viewCount": 0
  }
  
  ]

  console.log("Test məlumatları yükləndi:", namesData.length, "ad")
}

// Update total names count in hero section
function updateTotalNamesCount() {
  const totalNamesEl = document.getElementById("totalNames")
  if (totalNamesEl) {
    totalNamesEl.textContent = `${namesData.length}+`
  }
}

// Event Listeners
function setupEventListeners() {
  console.log("Event listeners qurulur...")

  try {
    // Theme toggle
    const themeToggle = document.getElementById("themeToggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", toggleTheme)
    }

    // Language toggle
    const langToggle = document.getElementById("langToggle")
    if (langToggle) {
      langToggle.addEventListener("click", toggleLanguage)
    }

    // Search - DÜZƏLDİLDİ
    const searchInput = document.getElementById("searchInput")
    if (searchInput) {
      searchInput.addEventListener("input", debounce(handleSearch, 300))
      searchInput.addEventListener("keyup", debounce(handleSearch, 300))
    }

    // Filter buttons - DÜZƏLDİLDİ
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", handleFilter)
    })

    // Tab navigation - DÜZƏLDİLDİ
    document.querySelectorAll(".nav-tab").forEach((tab) => {
      tab.addEventListener("click", handleTabChange)
    })

    // Modal close button
    const closeModalBtn = document.getElementById("closeModal")
    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", closeModal)
    }

    // Modal overlay click
    const modalOverlay = document.getElementById("modalOverlay")
    if (modalOverlay) {
      modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
          closeModal()
        }
      })
    }

    // Origin filter - DÜZƏLDİLDİ
    const originFilter = document.getElementById("originFilter")
    if (originFilter) {
      originFilter.addEventListener("change", handleSearch)
    }

    // Sort select
    const sortSelect = document.getElementById("sortSelect")
    if (sortSelect) {
      sortSelect.addEventListener("change", handleSort)
    }

    setupScrollToTop()
    setupSearchClear()

    // Favorites toggle button
    const favoritesToggle = document.getElementById("favoritesToggle")
    if (favoritesToggle) {
      favoritesToggle.addEventListener("click", toggleFavoritesTab)
    }

    // Refresh fact button
    const refreshFactBtn = document.getElementById("refreshFact")
    if (refreshFactBtn) {
      refreshFactBtn.addEventListener("click", () => {
        displayRandomFact([])
      })
    }

    // Add form submission
    const addForm = document.getElementById("addForm")
    if (addForm) {
      addForm.addEventListener("submit", handleAddFormSubmit)
    }

    // Listen for messages from admin panel
    window.addEventListener("message", (event) => {
      if (event.data.type === "nameAdded") {
        // Add the new name immediately
        const newName = event.data.name
        if (!namesData.find((n) => n.id === newName.id)) {
          namesData.push(newName)

          // Refresh current view
          const currentTab = document.querySelector(".tab-pane.active")?.id || "home"
          if (currentTab === "home") {
            displayNames(namesData)
          }

          showToast(`"${newName.name}" adı sayta əlavə edildi!`, "success")
        }
      } else if (event.data.type === "nameRemoved") {
        // Remove the name immediately
        const suggestionId = event.data.suggestionId
        const mainNames = JSON.parse(localStorage.getItem("mainNamesData") || "[]")
        const removedName = mainNames.find(
          (name) => name.source === "admin_approved" && name.originalSuggestionId === suggestionId,
        )

        if (removedName) {
          namesData = namesData.filter((name) => name.id !== removedName.id)

          // Refresh current view
          const currentTab = document.querySelector(".tab-pane.active")?.id || "home"
          if (currentTab === "home") {
            displayNames(namesData)
          }

          showToast(`"${removedName.name}" adı saytdan silindi`, "info")
        }
      }
    })

    // Periodic check for updates (fallback)
    setInterval(() => {
      const lastUpdate = localStorage.getItem("namesUpdated")
      const lastChecked = localStorage.getItem("lastUpdateCheck") || "0"

      if (lastUpdate && lastUpdate !== lastChecked) {
        localStorage.setItem("lastUpdateCheck", lastUpdate)
        loadUpdatedNames()
      }
    }, 2000) // Check every 2 seconds

    // Clear favorites button
    const clearFavoritesBtn = document.getElementById("clearFavorites")
    if (clearFavoritesBtn) {
      clearFavoritesBtn.addEventListener("click", clearFavorites)
    }

    console.log("Event listeners uğurla quruldu")
  } catch (error) {
    console.error("Event listeners xətası:", error)
  }
}

// YENİ FUNKSIYA: Add form submission handler
function handleAddFormSubmit(e) {
  e.preventDefault()

  const formData = {
    id: Date.now(), // Unique ID
    name: document.getElementById("newName").value,
    gender: document.getElementById("newGender").value,
    meaning: document.getElementById("newMeaning").value,
    origin: document.getElementById("newOrigin").value,
    similar: document.getElementById("newSimilar").value,
    submittedAt: new Date().toISOString(),
    status: "pending",
  }

  // Save to suggested names
  saveSuggestedName(formData)

  // Reset form
  document.getElementById("addForm").reset()

  // Show success message
  showToast("Təklifiniz uğurla göndərildi! Admin tərəfindən nəzərdən keçiriləcək.", "success")
}

// YENİ FUNKSIYA: Save suggested name
function saveSuggestedName(nameData) {
  const existingSuggestions = JSON.parse(localStorage.getItem("suggestedNames") || "[]")
  existingSuggestions.push(nameData)
  localStorage.setItem("suggestedNames", JSON.stringify(existingSuggestions))
}

// Scroll to top functionality
function setupScrollToTop() {
  const scrollBtn = document.getElementById("scrollToTop")
  if (!scrollBtn) return

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add("show")
    } else {
      scrollBtn.classList.remove("show")
    }
  })

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  })
}

// Search clear functionality
function setupSearchClear() {
  const searchInput = document.getElementById("searchInput")
  const searchClear = document.getElementById("searchClear")

  if (!searchInput || !searchClear) return

  searchInput.addEventListener("input", (e) => {
    if (e.target.value.length > 0) {
      searchClear.style.display = "block"
    } else {
      searchClear.style.display = "none"
    }
  })

  searchClear.addEventListener("click", () => {
    searchInput.value = ""
    searchClear.style.display = "none"
    handleSearch()
  })
}

// Toast notification system
function showToast(message, type = "success") {
  const toast = document.getElementById("successToast")
  const messageEl = document.getElementById("toastMessage")

  if (toast && messageEl) {
    messageEl.textContent = message
    toast.classList.add("show")

    setTimeout(() => {
      toast.classList.remove("show")
    }, 4000)
  }
}

function hideToast() {
  const toast = document.getElementById("successToast")
  if (toast) {
    toast.classList.remove("show")
  }
}

// Favorites count update
function updateFavoritesCount() {
  const count = favorites.length
  const countEl = document.getElementById("favoritesCount")

  if (countEl) {
    countEl.textContent = count
    if (count > 0) {
      countEl.classList.add("show")
    } else {
      countEl.classList.remove("show")
    }
  }
}

// Theme Management
function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light"
  localStorage.setItem("theme", currentTheme)
  applyTheme()
}

function applyTheme() {
  document.documentElement.setAttribute("data-theme", currentTheme)
  const themeIcon = document.querySelector("#themeToggle i")
  if (themeIcon) {
    themeIcon.className = currentTheme === "light" ? "fas fa-moon" : "fas fa-sun"
  }
}

// Language Management
function toggleLanguage() {
  currentLanguage = currentLanguage === "az" ? "en" : "az"
  localStorage.setItem("language", currentLanguage)
  applyLanguage()
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage
  const langText = document.getElementById("langToggle")?.querySelector(".lang-text")
  if (langText) {
    langText.textContent = currentLanguage === "az" ? "EN" : "AZ"
  }

  // Update all translatable elements
  document.querySelectorAll("[data-translate]").forEach((element) => {
    const key = element.getAttribute("data-translate")
    if (translations[currentLanguage][key]) {
      element.textContent = translations[currentLanguage][key]
    }
  })

  // Update placeholders
  document.querySelectorAll("[data-translate-placeholder]").forEach((element) => {
    const key = element.getAttribute("data-translate-placeholder")
    if (translations[currentLanguage][key]) {
      element.placeholder = translations[currentLanguage][key]
    }
  })
}

// Daily Name
function displayDailyName() {
  if (namesData.length === 0) return

  const today = new Date()
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000)
  const dailyName = namesData[dayOfYear % namesData.length]

  const dailyNameCard = document.getElementById("dailyNameCard")
  if (dailyNameCard && dailyName) {
    dailyNameCard.innerHTML = `
      <h3>${dailyName.name}</h3>
      <p>${dailyName.meaning}</p>
      <small>${today.toLocaleDateString("az-AZ", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}</small>
    `
    dailyNameCard.addEventListener("click", () => showNameDetails(dailyName))

    // Add animation
    dailyNameCard.classList.add("slide-in")
  }
}

// Celebrity Birthdays - düzəldilmiş
function displayCelebrityBirthdays(celebrities) {
  const celebrityList = document.getElementById("celebrityList")
  if (!celebrityList) return

  const today = new Date()
  const todayKey = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  // Demo məlumatları əlavə edək
  const demoData = {
    celebrities: {
      "01-01": [
        { name: "Müslüm Maqomayev", profession: "Müğənni", country: "Azərbaycan" },
        { name: "Rəşid Behbudov", profession: "Müğənni", country: "Azərbaycan" },
      ],
      "01-02": [
        { name: "Polad Bülbüloğlu", profession: "Müğənni", country: "Azərbaycan" },
        { name: "Arif Babayev", profession: "Aktyor", country: "Azərbaycan" },
      ],
    },
  }

  // Bugünkü tarixi yoxla
  const todayCelebrities = demoData.celebrities[todayKey] || []

  if (todayCelebrities.length > 0) {
    celebrityList.innerHTML = todayCelebrities
      .map(
        (celeb) => `
        <div class="celebrity-name" onclick="searchByName('${celeb.name}')">
          ${celeb.name} - ${celeb.profession}
        </div>
      `,
      )
      .join("")
  } else {
    // Əgər bu gün heç kim yoxdursa, random məşhurlar göstər
    const randomCelebs = [
      { name: "Nizami Gəncəvi", profession: "Şair", country: "Azərbaycan" },
      { name: "Üzeyir Hacıbəyli", profession: "Bəstəkar", country: "Azərbaycan" },
      { name: "Natəvan", profession: "Şairə", country: "Azərbaycan" },
    ]

    celebrityList.innerHTML = randomCelebs
      .map(
        (celeb) => `
        <div class="celebrity-name" onclick="searchByName('${celeb.name}')">
          ${celeb.name} - ${celeb.profession}
        </div>
      `,
      )
      .join("")
  }
}

// Random Facts - düzəldilmiş
function displayRandomFact(facts) {
  const factCard = document.getElementById("factCard")
  if (!factCard) return

  fetch("names.json")
    .then((response) => response.json())
    .then((data) => {
      const facts = data.facts || []
      if (facts.length > 0) {
        const randomFact = facts[Math.floor(Math.random() * facts.length)]
        factCard.textContent = randomFact
        factCard.classList.add("fade-in")
      }
    })
    .catch(() => {
      factCard.textContent = "Ad haqqında maraqlı faktlar yüklənir..."
    })
}

// Display Names with animations
function displayNames(names) {
  const namesGrid = document.getElementById("namesGrid")
  if (!namesGrid) return

  if (names.length === 0) {
    namesGrid.innerHTML =
      '<div style="text-align: center; padding: 2rem; color: var(--text-secondary);">Heç bir ad tapılmadı</div>'
    return
  }

  namesGrid.innerHTML = names.map((name) => createNameCard(name)).join("")

  // Add staggered animation
  const nameCards = namesGrid.querySelectorAll(".name-card")
  nameCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`
    card.classList.add("slide-in-up")
  })
}

function createNameCard(name) {
  const isFavorite = favorites.includes(name.id)
  const views = viewCounts[name.id] || 0

  return `
    <div class="name-card interactive-element" onclick="showNameDetails(${JSON.stringify(name).replace(/"/g, "&quot;")})">
      <h3>${name.name}</h3>
      <p class="name-meaning">${name.meaning}</p>
      <div class="name-details">
        <span class="name-origin">${name.origin}</span>
        <span class="name-popularity">⭐ ${name.popularity}%</span>
      </div>
      <div class="similar-names">
        <h4>Oxşar adlar:</h4>
        <div class="similar-list">
          ${name.similar.map((similar) => `<span class="similar-name" onclick="event.stopPropagation(); searchByName('${similar}')">${similar}</span>`).join("")}
        </div>
      </div>
      <div class="name-actions">
        <button class="action-btn favorite-btn ${isFavorite ? "active" : ""}" onclick="event.stopPropagation(); toggleFavorite(${name.id})">
          <i class="fas fa-heart"></i>
        </button>
        <button class="action-btn" onclick="event.stopPropagation(); shareNameURL('${name.name}')">
          <i class="fas fa-link"></i>
        </button>
      </div>
      ${views > 0 ? `<div class="view-count">${views} baxış</div>` : ""}
    </div>
  `
}

// Name Details Modal - view count artırma düzəldilmiş
function showNameDetails(name) {
  console.log("Modal açılır:", name.name)

  // Increment view count
  viewCounts[name.id] = (viewCounts[name.id] || 0) + 1
  localStorage.setItem("viewCounts", JSON.stringify(viewCounts))

  // Stats yenilə
  updateTotalViews()

  const modalOverlay = document.getElementById("modalOverlay")
  const modalBody = document.getElementById("modalBody")

  if (!modalOverlay || !modalBody) return

  const isFavorite = favorites.includes(name.id)

  modalBody.innerHTML = `
    <div class="name-details-modal">
      <div class="name-header">
        <h2>${name.name}</h2>
        <button class="pronunciation-btn" onclick="pronounceName('${name.name}')" title="Dinlə">
          <i class="fas fa-volume-up"></i>
          <span>Tələffüz</span>
        </button>
      </div>
      
      <div class="detail-section">
        <h3>Mənası:</h3>
        <p>${name.meaning}</p>
      </div>
      
      <div class="detail-section">
        <h3>Mənşəyi:</h3>
        <p>${name.origin}</p>
      </div>
      
      <div class="detail-section">
        <h3>Populyarlıq:</h3>
        <p>⭐ ${name.popularity}%</p>
      </div>

      <div class="detail-section">
        <h3>Oxşar adlar:</h3>
        <div class="similar-list">
          ${name.similar.map((similar) => `<span class="similar-name" onclick="searchByName('${similar}'); closeModal();">${similar}</span>`).join("")}
        </div>
      </div>
      
      <div class="name-actions">
        <button class="action-btn favorite-btn ${isFavorite ? "active" : ""}" onclick="toggleFavorite(${name.id})">
          <i class="fas fa-heart"></i> ${isFavorite ? "Favoritdən çıxar" : "Favoritə əlavə et"}
        </button>
        <button class="action-btn card-generator-btn" onclick="openCardGenerator('${name.name}', '${name.meaning}', '${name.gender}', '${name.origin}')">
          <i class="fas fa-image"></i> 📸 Kart Yarat
        </button>
      </div>
    </div>
  `

  modalOverlay.classList.add("show")
  document.body.style.overflow = "hidden"

  // Add modal animation
  const modal = modalOverlay.querySelector(".modal")
  modal.classList.add("modal-slide-in")
}

// Card Generator Functions - DÜZƏLDİLDİ
function openCardGenerator(name, meaning, gender, origin) {
  const cardModal = document.createElement("div")
  cardModal.className = "modal-overlay card-generator-modal"
  cardModal.id = "cardGeneratorModal"

  cardModal.innerHTML = `
    <div class="modal card-generator-modal-content" style="max-width: 900px;">
      <div class="modal-header">
        <h3>📸 Kart Yaradıcısı</h3>
        <button class="modal-close" onclick="closeCardGenerator()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <div class="card-generator-container">
          <div class="theme-selector">
            <h4>Tema seçin:</h4>
            <div class="theme-options" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin-bottom: 30px;">
              <button class="theme-btn modern-theme-btn active" data-theme="classic" onclick="selectTheme('classic')">
                <div class="theme-icon">🎨</div>
                <span>Klassik</span>
              </button>
              <button class="theme-btn modern-theme-btn" data-theme="modern" onclick="selectTheme('modern')">
                <div class="theme-icon">🚀</div>
                <span>Modern</span>
              </button>
              <button class="theme-btn modern-theme-btn" data-theme="elegant" onclick="selectTheme('elegant')">
                <div class="theme-icon">💎</div>
                <span>Zərif</span>
              </button>
              <button class="theme-btn modern-theme-btn" data-theme="nature" onclick="selectTheme('nature')">
                <div class="theme-icon">🌿</div>
                <span>Təbiət</span>
              </button>
              <button class="theme-btn modern-theme-btn" data-theme="royal" onclick="selectTheme('royal')">
                <div class="theme-icon">👑</div>
                <span>Kral</span>
              </button>
              <button class="theme-btn modern-theme-btn" data-theme="sunset" onclick="selectTheme('sunset')">
                <div class="theme-icon">🌅</div>
                <span>Gün batımı</span>
              </button>
              <button class="theme-btn modern-theme-btn" data-theme="ocean" onclick="selectTheme('ocean')">
                <div class="theme-icon">🌊</div>
                <span>Okean</span>
              </button>
              <button class="theme-btn modern-theme-btn" data-theme="galaxy" onclick="selectTheme('galaxy')">
                <div class="theme-icon">🌌</div>
                <span>Qalaktika</span>
              </button>
            </div>
          </div>
          
          <div class="card-preview-container" style="text-align: center; margin-bottom: 30px;">
            <div class="name-card-preview" id="nameCardPreview">
              <!-- Card preview will be generated here -->
            </div>
          </div>
          
          <div class="card-actions" style="display: flex; gap: 15px; justify-content: center;">
            <button class="modern-download-btn" onclick="downloadCard()">
              <i class="fas fa-download"></i>
              <span>Kartı Yüklə</span>
            </button>
            <button class="modern-share-btn" onclick="shareCard()">
              <i class="fas fa-share-alt"></i>
              <span>Paylaş</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `

  document.body.appendChild(cardModal)
  cardModal.classList.add("show")

  // Store card data - EMOJİ SİLİNDİ
  window.currentCardData = { name, meaning, gender, origin }

  // Generate initial card with classic theme
  generateCardPreview("classic")
}

function selectTheme(theme) {
  // Update active theme button
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.classList.remove("active")
  })

  const selectedBtn = document.querySelector(`[data-theme="${theme}"]`)
  if (selectedBtn) {
    selectedBtn.classList.add("active")
  }

  // Generate new card preview
  generateCardPreview(theme)
}

function generateCardPreview(theme) {
  const { name, meaning, gender, origin } = window.currentCardData
  const preview = document.getElementById("nameCardPreview")

  // Store selected theme globally
  window.selectedTheme = theme

  // EMOJİ SİLİNDİ - sadəcə mətn
  const genderText = gender === "qız" ? "Qız" : "Oğlan"

  const themes = {
    classic: {
      background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
      textColor: "#fff",
      accentColor: "#ffd700",
    },
    modern: {
      background: "linear-gradient(135deg,#00c6ff 0%,#0072ff 100%)",
      textColor: "#fff",
      accentColor: "#ff6b6b",
    },
    elegant: {
      background: "linear-gradient(135deg,#2c3e50 0%,#4ca1af 100%)",
      textColor: "#ecf0f1",
      accentColor: "#e74c3c",
    },
    nature: {
      background: "linear-gradient(135deg,#56ab2f 0%,#a8e063 100%)",
      textColor: "#1b3815",
      accentColor: "#ff6b6b",
    },
    royal: {
      background: "linear-gradient(135deg,#8e44ad 0%,#3498db 100%)",
      textColor: "#fff",
      accentColor: "#f1c40f",
    },
    sunset: {
      background: "linear-gradient(135deg,#ff7e5f 0%,#feb47b 100%)",
      textColor: "#2c3e50",
      accentColor: "#e74c3c",
    },
    ocean: {
      background: "linear-gradient(135deg,#2980b9 0%,#6dd5fa 100%)",
      textColor: "#fff",
      accentColor: "#1abc9c",
    },
    galaxy: {
      background: "linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)",
      textColor: "#ecf0f1",
      accentColor: "#9b59b6",
    },
  }

  const th = themes[theme]

  preview.innerHTML = `
    <div id="generatedCard" style="
      background:${th.background};
      color:${th.textColor};
      width:400px;height:300px;padding:40px;border-radius:20px;
      display:flex;flex-direction:column;justify-content:center;align-items:center;
      text-align:center;box-shadow:0 20px 40px rgba(0,0,0,.3);position:relative;overflow:hidden;
      margin: 0 auto;
    ">
      <h1 style="font-size:3rem;font-weight:800;margin:0 0 12px;color:${th.accentColor};
                 text-shadow:2px 2px 4px rgba(0,0,0,.3)">${name}</h1>
      <p style="font-size:1.25rem;font-style:italic;margin:0 0 20px;opacity:.9;">"${meaning}"</p>
      <div style="display:flex;gap:14px;font-size:1rem;opacity:.85;">
        <span style="background:rgba(255,255,255,.2);padding:6px 14px;border-radius:20px">${genderText}</span>
        <span style="background:rgba(255,255,255,.2);padding:6px 14px;border-radius:20px">${origin}</span>
      </div>
      <small style="position:absolute;bottom:15px;right:20px;opacity:.6;font-size:.8rem;">🇦🇿 azerbaycanadlari.az</small>
    </div>
  `
}

// Download Card Function - DÜZƏLDİLDİ
async function downloadCard() {
  const card = document.getElementById("generatedCard")
  if (!card) {
    showToast("Kart tapılmadı", "error")
    return
  }

  try {
    // Canvas yaradırıq
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    canvas.width = 800 // Daha yüksək keyfiyyət
    canvas.height = 600

    // Kartın məlumatlarını alırıq
    const { name, meaning, gender, origin } = window.currentCardData
    const genderText = gender === "qız" ? "Qız" : "Oğlan"

    // Seçilən temanı al
    const selectedTheme = window.selectedTheme || "classic"

    const themes = {
      classic: { start: "#667eea", end: "#764ba2", accent: "#ffd700", text: "#fff" },
      modern: { start: "#00c6ff", end: "#0072ff", accent: "#ff6b6b", text: "#fff" },
      elegant: { start: "#2c3e50", end: "#4ca1af", accent: "#e74c3c", text: "#ecf0f1" },
      nature: { start: "#56ab2f", end: "#a8e063", accent: "#ff6b6b", text: "#1b3815" },
      royal: { start: "#8e44ad", end: "#3498db", accent: "#f1c40f", text: "#fff" },
      sunset: { start: "#ff7e5f", end: "#feb47b", accent: "#e74c3c", text: "#2c3e50" },
      ocean: { start: "#2980b9", end: "#6dd5fa", accent: "#1abc9c", text: "#fff" },
      galaxy: { start: "#0f2027", end: "#2c5364", accent: "#9b59b6", text: "#ecf0f1" },
    }

    const theme = themes[selectedTheme]

    // Arxa fon - seçilən tema ilə
    const gradient = ctx.createLinearGradient(0, 0, 800, 600)
    gradient.addColorStop(0, theme.start)
    gradient.addColorStop(1, theme.end)

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 800, 600)

    // Mətn yazırıq - tema rəngləri ilə
    ctx.fillStyle = theme.accent
    ctx.font = "bold 72px Arial"
    ctx.textAlign = "center"
    ctx.fillText(name, 400, 200)

    ctx.fillStyle = theme.text
    ctx.font = "italic 32px Arial"
    ctx.fillText(`"${meaning}"`, 400, 260)

    ctx.font = "24px Arial"
    ctx.fillText(`${genderText} • ${origin}`, 400, 320)

    ctx.font = "18px Arial"
    ctx.fillStyle = "rgba(255,255,255,0.6)"
    ctx.textAlign = "right"
    ctx.fillText("🇦🇿 azerbaycanadlari.az", 760, 560)

    // PNG olaraq yüklə
    canvas.toBlob((blob) => {
      const link = document.createElement("a")
      link.download = `${name}-${selectedTheme}-kart.png`
      link.href = URL.createObjectURL(blob)
      link.click()
      URL.revokeObjectURL(link.href)
      showToast("Kart uğurla yükləndi! 📥", "success")
    })
  } catch (error) {
    console.error("Kart yükləmə xətası:", error)
    showToast("Kart yüklənmədi, xəta baş verdi", "error")
  }
}

// Share Card Function - DÜZƏLDİLDİ
async function shareCard() {
  const { name, meaning, gender, origin } = window.currentCardData
  const genderText = gender === "qız" ? "Qız" : "Oğlan"

  const shareText = `${name} - ${meaning}\n${genderText} • ${origin}\n\n🇦🇿 azerbaycanadlari.az`
  const shareUrl = `${window.location.origin}?name=${encodeURIComponent(name)}`

  try {
    if (navigator.share) {
      await navigator.share({
        title: `${name} - Azərbaycan Adları`,
        text: shareText,
        url: shareUrl,
      })
      showToast("Kart paylaşıldı! 📤", "success")
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(shareText + "\n" + shareUrl)
      showToast("Kart məlumatları kopyalandı! 📋", "success")
    }
  } catch (error) {
    console.error("Paylaşım xətası:", error)
    // Final fallback: Just copy the name and meaning
    try {
      await navigator.clipboard.writeText(shareText)
      showToast("Ad məlumatları kopyalandı!", "info")
    } catch (e) {
      showToast("Paylaşım mümkün olmadı", "error")
    }
  }
}

function closeCardGenerator() {
  const cardModal = document.getElementById("cardGeneratorModal")
  if (cardModal) {
    cardModal.classList.remove("show")
    setTimeout(() => {
      document.body.removeChild(cardModal)
    }, 300)
  }
}

console.log("script.js yükləndi...")

// Utility function to debounce events
function debounce(func, delay) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), delay)
  }
}

// Alphabet Navigation - DÜZƏLDİLDİ
function setupAlphabetNavigation() {
  const alphabetNav = document.getElementById("alphabetNav")
  if (!alphabetNav) return

  const alphabet = "ABCÇDEƏFGĞHXIİJKQLMNOÖPRSŞTUÜVYZ"
  let alphabetHTML = ""

  for (const letter of alphabet) {
    alphabetHTML += `<button class="alphabet-btn" onclick="filterByLetter('${letter}')">${letter}</button>`
  }

  alphabetNav.innerHTML = alphabetHTML
}

// Filter by Alphabet - DÜZƏLDİLDİ
function filterByLetter(letter) {
  console.log("Hərf filtri:", letter)

  // Remove active class from other buttons
  document.querySelectorAll(".alphabet-btn").forEach((btn) => btn.classList.remove("active"))

  // Add active class to the clicked button
  const clickedBtn = Array.from(document.querySelectorAll(".alphabet-btn")).find((btn) => btn.textContent === letter)
  if (clickedBtn) {
    clickedBtn.classList.add("active")
  }

  const filteredNames = namesData.filter((name) => name.name.toUpperCase().startsWith(letter.toUpperCase()))

  console.log("Filtrlənmiş adlar:", filteredNames.length)

  // Display in alphabet results area
  const alphabetNames = document.getElementById("alphabetNames")
  if (alphabetNames) {
    alphabetNames.innerHTML = filteredNames.map((name) => createNameCard(name)).join("")
  }
}

// Handle Search - DÜZƏLDİLDİ
function handleSearch() {
  console.log("Axtarış işləyir...")

  const searchInput = document.getElementById("searchInput")
  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : ""

  // Gender filter
  const genderRadios = document.querySelectorAll('input[name="gender"]')
  let genderFilter = "all"
  genderRadios.forEach((radio) => {
    if (radio.checked) {
      genderFilter = radio.value
    }
  })

  // Origin filter
  const originFilter = document.getElementById("originFilter")
  const originValue = originFilter ? originFilter.value : "all"

  let filteredNames = [...namesData]

  // Search by name or meaning
  if (searchTerm) {
    filteredNames = filteredNames.filter(
      (name) => name.name.toLowerCase().includes(searchTerm) || name.meaning.toLowerCase().includes(searchTerm),
    )
  }

  // Filter by gender
  if (genderFilter !== "all") {
    filteredNames = filteredNames.filter((name) => name.gender === genderFilter)
  }

  // Filter by origin
  if (originValue !== "all") {
    filteredNames = filteredNames.filter((name) => name.origin === originValue)
  }

  console.log("Filtrlənmiş nəticələr:", filteredNames.length)
  displayNames(filteredNames)
}

// Handle Filter - DÜZƏLDİLDİ
function handleFilter(e) {
  console.log("Filter düyməsi basıldı:", e.target.textContent)

  // Remove active class from other buttons
  document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"))

  // Add active class to the clicked button
  e.target.classList.add("active")

  // Get filter value
  const filterValue = e.target.getAttribute("data-filter")
  console.log("Filter dəyəri:", filterValue)

  let filteredNames = [...namesData]

  // Filter by gender
  if (filterValue !== "all") {
    filteredNames = filteredNames.filter((name) => name.gender === filterValue)
  }

  console.log("Filtrlənmiş adlar:", filteredNames.length)
  displayNames(filteredNames)
}

// Handle Tab Change - DÜZƏLDİLDİ
function handleTabChange(e) {
  console.log("Tab dəyişdirilir:", e.target.textContent)

  // Remove active class from other tabs
  document.querySelectorAll(".nav-tab").forEach((tab) => tab.classList.remove("active"))
  document.querySelectorAll(".tab-pane").forEach((pane) => pane.classList.remove("active"))

  // Add active class to the clicked tab
  e.target.classList.add("active")

  // Show the corresponding tab content
  const tabId = e.target.getAttribute("data-tab")
  const tabPane = document.getElementById(tabId)
  if (tabPane) {
    tabPane.classList.add("active")
  }

  // Load content based on tab
  if (tabId === "home") {
    displayNames(namesData)
  } else if (tabId === "alphabet") {
    // Ensure alphabet view is refreshed
    const activeAlphabetBtn = document.querySelector(".alphabet-btn.active")
    if (activeAlphabetBtn) {
      filterByLetter(activeAlphabetBtn.textContent)
    } else {
      displayNames(namesData) // Show all names if no alphabet button is active
    }
  } else if (tabId === "popular") {
    displayPopularNames()
  } else if (tabId === "favorites") {
    displayFavorites()
  } else if (tabId === "suggest") {
    setupSuggestTab()
  } else if (tabId === "quiz") {
    setupQuizTab()
  } else if (tabId === "add") {
    // Handle add tab
  }
}

// Handle Sort
function handleSort() {
  const sortBy = document.getElementById("sortSelect").value

  const sortedNames = [...namesData] // Create a copy to avoid modifying the original array

  if (sortBy === "name") {
    sortedNames.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy === "popularity") {
    sortedNames.sort((a, b) => b.popularity - a.popularity)
  } else if (sortBy === "views") {
    sortedNames.sort((a, b) => (viewCounts[b.id] || 0) - (viewCounts[a.id] || 0))
  }

  displayNames(sortedNames)
}

// Display Popular Names - DÜZƏLDİLDİ
function displayPopularNames() {
  console.log("Populyar adlar göstərilir...")

  const popularNames = document.getElementById("popularNames")
  if (!popularNames) {
    console.log("popularNames elementi tapılmadı")
    return
  }

  // DÜZƏLDILDI: Əgər heç bir ad baxılmayıbsa, populyarlığa görə sırala
  const sortedNames = [...namesData].sort((a, b) => {
    const aViews = viewCounts[a.id] || 0
    const bViews = viewCounts[b.id] || 0

    // Əgər baxış sayları eyni və ya sıfırdırsa, populyarlığa görə sırala
    if (aViews === bViews) {
      return b.popularity - a.popularity
    }
    return bViews - aViews
  })

  // Take the top 12 names
  const topNames = sortedNames.slice(0, 12)

  popularNames.innerHTML = topNames
    .map(
      (name, index) => `
    <div class="popular-name-card" onclick="showNameDetails(${JSON.stringify(name).replace(/"/g, "&quot;")})">
      <div class="popular-rank">${index + 1}</div>
      <h4>${name.name}</h4>
      <p>${name.meaning}</p>
      <div class="popular-stats">
        <span>⭐ ${name.popularity}%</span>
        <span>👁 ${viewCounts[name.id] || 0}</span>
      </div>
    </div>
  `,
    )
    .join("")

  console.log("Populyar adlar göstərildi:", topNames.length)
}

// Toggle Favorite
function toggleFavorite(nameId) {
  if (!trackFeatureUsage("addFavorite")) {
    return
  }

  const index = favorites.indexOf(nameId)
  if (index > -1) {
    favorites.splice(index, 1)
    showToast("Ad favoritlərdən silindi", "info")
  } else {
    favorites.push(nameId)
    showToast("Ad favoritlərə əlavə edildi", "success")

    // Heart animation effect
    createHeartAnimation()
  }

  localStorage.setItem("favorites", JSON.stringify(favorites))
  updateFavoritesCount()

  // Update button state
  const btn = event.target.closest(".favorite-btn")
  if (btn) {
    btn.classList.toggle("active")
  }
}

// Heart animation
function createHeartAnimation() {
  const heart = document.createElement("div")
  heart.className = "heart-float"
  heart.textContent = "❤️"
  heart.style.position = "fixed"
  heart.style.left = event.clientX + "px"
  heart.style.top = event.clientY + "px"
  heart.style.zIndex = "10000"
  heart.style.pointerEvents = "none"

  document.body.appendChild(heart)

  setTimeout(() => {
    document.body.removeChild(heart)
  }, 1500)
}

// Display Favorites - düzəldilmiş
function displayFavorites() {
  console.log("Favoritlər göstərilir...")

  const favoritesGrid = document.getElementById("favoritesGrid")
  const emptyFavorites = document.getElementById("emptyFavorites")
  const clearBtn = document.getElementById("clearFavorites")

  if (!favoritesGrid) return

  if (favorites.length === 0) {
    emptyFavorites.style.display = "block"
    favoritesGrid.style.display = "none"
    clearBtn.style.display = "none"
  } else {
    emptyFavorites.style.display = "none"
    favoritesGrid.style.display = "grid"
    clearBtn.style.display = "flex"

    const favoriteNames = namesData.filter((name) => favorites.includes(name.id))
    favoritesGrid.innerHTML = favoriteNames.map((name) => createNameCard(name)).join("")
  }
}

// Clear Favorites
function clearFavorites() {
  if (confirm("Bütün favori adları silmək istədiyinizə əminsiniz?")) {
    favorites.length = 0
    localStorage.setItem("favorites", JSON.stringify(favorites))
    updateFavoritesCount()
    displayFavorites()
    showToast("Bütün favoritlər silindi", "info")
  }
}

// Toggle Favorites Tab
function toggleFavoritesTab() {
  // Switch to favorites tab
  document.querySelectorAll(".nav-tab").forEach((tab) => tab.classList.remove("active"))
  document.querySelectorAll(".tab-pane").forEach((pane) => pane.classList.remove("active"))

  document.querySelector('[data-tab="favorites"]').classList.add("active")
  document.getElementById("favorites").classList.add("active")

  displayFavorites()
}

// Search by Name
function searchByName(name) {
  const searchInput = document.getElementById("searchInput")
  if (searchInput) {
    searchInput.value = name
    handleSearch()
  }
}

// Share Name URL
function shareNameURL(name) {
  const url = `${window.location.origin}?name=${encodeURIComponent(name)}`

  if (navigator.share) {
    navigator.share({
      title: `${name} - Azərbaycan Adları`,
      text: `${name} adının mənasını öyrən`,
      url: url,
    })
  } else {
    navigator.clipboard.writeText(url).then(() => {
      showToast("Link kopyalandı!", "success")
    })
  }
}

// Pronounce Name
function pronounceName(name) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(name)
    utterance.lang = "az-AZ"
    utterance.rate = 0.8
    speechSynthesis.speak(utterance)

    const btn = event.target.closest(".pronunciation-btn")
    if (btn) {
      btn.classList.add("speaking")
      setTimeout(() => {
        btn.classList.remove("speaking")
      }, 2000)
    }
  } else {
    showToast("Tələffüz dəstəklənmir", "error")
  }
}

// Setup Suggest Tab - DÜZƏLDİLDİ
function setupSuggestTab() {
  const suggestForm = document.getElementById("suggestForm")
  if (!suggestForm) return

  console.log("Tövsiyə sistemi qurulur...")

  suggestForm.innerHTML = `
    <div class="suggest-wizard">
      <div class="wizard-step active" id="step1">
        <h3>🚻 Hansı cinsdə ad axtarırsınız?</h3>
        <div class="gender-options">
          <button class="wizard-btn" onclick="selectGender('qız')">
            <i class="fas fa-female"></i>
            <span>Qız adı</span>
          </button>
          <button class="wizard-btn" onclick="selectGender('oğlan')">
            <i class="fas fa-male"></i>
            <span>Oğlan adı</span>
          </button>
        </div>
      </div>

      <div class="wizard-step" id="step2">
        <h3>✨ Hansı xarakter xüsusiyyətini üstün tutursunuz?</h3>
        <div class="character-options">
          <button class="wizard-btn" onclick="selectCharacter('lider')">
            <i class="fas fa-crown"></i>
            <span>Lider</span>
          </button>
          <button class="wizard-btn" onclick="selectCharacter('dostcanlı')">
            <i class="fas fa-heart"></i>
            <span>Dostcanlı</span>
          </button>
          <button class="wizard-btn" onclick="selectCharacter('yaradıcı')">
            <i class="fas fa-palette"></i>
            <span>Yaradıcı</span>
          </button>
          <button class="wizard-btn" onclick="selectCharacter('güclü')">
            <i class="fas fa-fist-raised"></i>
            <span>Güclü</span>
          </button>
          <button class="wizard-btn" onclick="selectCharacter('zərif')">
            <i class="fas fa-feather"></i>
            <span>Zərif</span>
          </button>
          <button class="wizard-btn" onclick="selectCharacter('müdrik')">
            <i class="fas fa-brain"></i>
            <span>Müdrik</span>
          </button>
        </div>
      </div>

      <div class="wizard-step" id="step3">
        <h3>🌍 Hansı mənşələrə üstünlük verirsiniz?</h3>
        <div class="origin-options">
          <button class="wizard-btn" onclick="selectOrigin('azərbaycan')">
            <i class="fas fa-flag"></i>
            <span>Azərbaycan</span>
          </button>
          <button class="wizard-btn" onclick="selectOrigin('türk')">
            <i class="fas fa-star-and-crescent"></i>
            <span>Türk</span>
          </button>
          <button class="wizard-btn" onclick="selectOrigin('ərəb')">
            <i class="fas fa-mosque"></i>
            <span>Ərəb</span>
          </button>
          <button class="wizard-btn" onclick="selectOrigin('fars')">
            <i class="fas fa-gem"></i>
            <span>Fars</span>
          </button>
          <button class="wizard-btn" onclick="selectOrigin('heç biri')">
            <i class="fas fa-globe"></i>
            <span>Heç biri</span>
          </button>
        </div>
      </div>

      <div class="wizard-step" id="step4">
        <h3>🎯 Sizə uyğun ad tövsiyələri:</h3>
        <div id="suggestedResults"></div>
        <button class="wizard-btn restart-btn" onclick="restartWizard()">
          <i class="fas fa-redo"></i>
          <span>Yenidən başla</span>
        </button>
      </div>
    </div>
  `
}

// Wizard functions
let wizardData = {}

function selectGender(gender) {
  wizardData.gender = gender
  nextStep(2)
}

function selectCharacter(character) {
  wizardData.character = character
  nextStep(3)
}

function selectOrigin(origin) {
  wizardData.origin = origin
  generateSuggestions()
  nextStep(4)
}

function nextStep(stepNumber) {
  document.querySelectorAll(".wizard-step").forEach((step) => {
    step.classList.remove("active")
  })
  document.getElementById(`step${stepNumber}`).classList.add("active")
}

function generateSuggestions() {
  let filteredNames = [...namesData]

  // Gender filter
  if (wizardData.gender) {
    filteredNames = filteredNames.filter((name) => name.gender === wizardData.gender)
  }

  // Origin filter
  if (wizardData.origin && wizardData.origin !== "heç biri") {
    filteredNames = filteredNames.filter((name) => name.origin === wizardData.origin)
  }

  // Character-based filtering (based on name meanings)
  if (wizardData.character) {
    const characterKeywords = {
      lider: ["hökmdar", "xan", "əmir", "şah", "böyük", "uca"],
      dostcanlı: ["dost", "sevimli", "məhəbbət", "könül", "ürək"],
      yaradıcı: ["sənət", "gözəl", "nəğmə", "şair", "yaradıcı"],
      güclü: ["güclü", "qəhrəman", "igid", "döyüşçü", "qüdrətli"],
      zərif: ["zərif", "nazik", "gül", "çiçək", "gözəl"],
      müdrik: ["bilik", "hikmət", "müdrik", "ağıllı", "elm"],
    }

    const keywords = characterKeywords[wizardData.character] || []
    if (keywords.length > 0) {
      filteredNames = filteredNames.filter((name) =>
        keywords.some((keyword) => name.meaning.toLowerCase().includes(keyword.toLowerCase())),
      )
    }
  }

  // Get random 6 names from filtered results
  const suggestions = filteredNames.sort(() => 0.5 - Math.random()).slice(0, 6)

  const resultsContainer = document.getElementById("suggestedResults")
  if (suggestions.length > 0) {
    resultsContainer.innerHTML = `
      <div class="suggested-names-grid">
        ${suggestions
          .map(
            (name) => `
          <div class="suggested-name-card" onclick="showNameDetails(${JSON.stringify(name).replace(/"/g, "&quot;")})">
            <h4>${name.name}</h4>
            <p>${name.meaning}</p>
            <div class="name-details">
              <span>${name.gender === "qız" ? "Qız" : "Oğlan"}</span>
              <span>${name.origin}</span>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    `
  } else {
    resultsContainer.innerHTML = `
      <div class="no-results">
        <p>Təəssüf ki, seçdiyiniz meyarlara uyğun ad tapılmadı.</p>
        <p>Başqa seçimlər etməyi sınayın.</p>
      </div>
    `
  }
}

function restartWizard() {
  wizardData = {}
  setupSuggestTab()
}

// Setup Quiz Tab
function setupQuizTab() {
  setupQuiz()
}

// Setup Quiz
function setupQuiz() {
  const quizContainer = document.getElementById("quizContainer")
  if (!quizContainer) return

  const randomNames = namesData.sort(() => 0.5 - Math.random()).slice(0, 5)
  let currentQuestion = 0
  let score = 0

  function showQuestion() {
    if (currentQuestion >= randomNames.length) {
      showQuizResult()
      return
    }

    const name = randomNames[currentQuestion]
    const wrongAnswers = namesData
      .filter((n) => n.id !== name.id && n.gender === name.gender)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((n) => n.meaning)

    const allAnswers = [name.meaning, ...wrongAnswers].sort(() => 0.5 - Math.random())

    quizContainer.innerHTML = `
      <div class="quiz-question">
        <h4>Sual ${currentQuestion + 1}/5</h4>
        <h3>"${name.name}" adının mənası nədir?</h3>
        <div class="quiz-options">
          ${allAnswers
            .map(
              (answer) => `
            <button class="quiz-option" onclick="selectAnswer('${answer}', '${name.meaning}')">${answer}</button>
          `,
            )
            .join("")}
        </div>
        <div class="quiz-progress">
          <div class="quiz-progress-bar" style="width: ${((currentQuestion + 1) / randomNames.length) * 100}%"></div>
        </div>
      </div>
    `
  }

  window.selectAnswer = (selected, correct) => {
    if (selected === correct) {
      score++
      showToast("Doğru cavab! ✅", "success")
    } else {
      showToast("Yanlış cavab! ❌", "error")
    }

    currentQuestion++
    setTimeout(showQuestion, 1000)
  }

  function showQuizResult() {
    const percentage = Math.round((score / randomNames.length) * 100)
    let message = ""

    if (percentage >= 80) {
      message = "Əla! Siz Azərbaycan adları üzrə ekspertsiniz! 🏆"
    } else if (percentage >= 60) {
      message = "Yaxşı! Azərbaycan adları haqqında yaxşı məlumatınız var 👍"
    } else if (percentage >= 40) {
      message = "Orta! Daha çox öyrənməyə ehtiyacınız var 📚"
    } else {
      message = "Zəif! Azərbaycan adları haqqında daha çox oxuyun 📖"
    }

    quizContainer.innerHTML = `
      <div class="quiz-result">
        <h3>Test nəticəsi</h3>
        <div class="quiz-score">${score}/${randomNames.length}</div>
        <div class="quiz-percentage">${percentage}%</div>
        <p>${message}</p>
        <div class="quiz-actions">
          <button class="submit-btn" onclick="setupQuiz()">
            <i class="fas fa-redo"></i> Yenidən başla
          </button>
          <button class="submit-btn" onclick="shareQuizResult(${percentage})">
            <i class="fas fa-share"></i> Nəticəni paylaş
          </button>
        </div>
      </div>
    `
  }

  showQuestion()
}

// Share Quiz Result
function shareQuizResult(percentage) {
  const text = `Azərbaycan Adları testində ${percentage}% nəticə əldə etdim! 🇦🇿`

  if (navigator.share) {
    navigator.share({
      title: "Azərbaycan Adları Test Nəticəsi",
      text: text,
      url: window.location.href,
    })
  } else {
    navigator.clipboard.writeText(text + " " + window.location.href).then(() => {
      showToast("Nəticə kopyalandı!", "success")
    })
  }
}

// Close Modal
function closeModal() {
  const modalOverlay = document.getElementById("modalOverlay")
  if (modalOverlay) {
    modalOverlay.classList.remove("show")
    document.body.style.overflow = "auto"
  }
}

// Placeholder function for feature tracking
function trackFeatureUsage(featureName) {
  // In a real application, this function would track feature usage
  // For example, it could send data to Google Analytics or a custom analytics service
  console.log(`Feature used: ${featureName}`)
  return true // Return true to allow the feature to proceed
}

// Initialize suggest form
function setupSuggestForm() {
  // Get the suggest form element
  const suggestForm = document.getElementById("suggestForm")

  // If the suggest form element exists
  if (suggestForm) {
    // Add an event listener to the suggest form
    suggestForm.addEventListener("submit", (event) => {
      // Prevent the default form submission behavior
      event.preventDefault()

      // Get the form data
      const formData = new FormData(suggestForm)

      // Log the form data to the console
      console.log(formData)

      // Reset the form
      suggestForm.reset()

      // Show a success message
      showToast("Təklifiniz uğurla göndərildi! Admin tərəfindən nəzərdən keçiriləcək.", "success")
    })
  }
}

// URL parametrini yoxla və adı aç
function checkURLParameter() {
  const urlParams = new URLSearchParams(window.location.search)
  const nameParam = urlParams.get("name")

  if (nameParam) {
    // Adı tap və modal aç
    const foundName = namesData.find((name) => name.name.toLowerCase() === nameParam.toLowerCase())

    if (foundName) {
      setTimeout(() => {
        showNameDetails(foundName)
      }, 1000) // 1 saniyə gözlə ki, səhifə tam yüklənsin
    }
  }
}
