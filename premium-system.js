// Premium System Configuration
const premiumPlans = {
  free: {
    name: "Pulsuz",
    price: 0,
    duration: "həmişə",
    features: {
      basicSearch: true,
      viewNames: 50, // gündə limit
      favorites: 10, // limit
      dailyName: true,
      basicQuiz: true,
      ads: true,
    },
  },

  premium: {
    name: "Premium",
    price: 4.99,
    duration: "aylıq",
    features: {
      unlimitedSearch: true,
      unlimitedViews: true,
      unlimitedFavorites: true,
      advancedAnalytics: true,
      nameHistory: true,
      personalizedRecommendations: true,
      offlineMode: true,
      noAds: true,
      prioritySupport: true,
      exportData: true,
      customThemes: true,
      nameCompatibility: true,
      detailedReports: true,
    },
  },

  expert: {
    name: "Ekspert",
    price: 9.99,
    duration: "aylıq",
    features: {
      // Premium-dəki hər şey + əlavələr
      aiNameGenerator: true,
      personalConsultation: true,
      exclusiveContent: true,
      earlyAccess: true,
      customCertificates: true,
      nameNumerology: true,
      culturalAnalysis: true,
      trendPredictions: true,
      apiAccess: true,
      whiteLabel: true,
    },
  },
}

// Premium Feature Manager
class PremiumManager {
  constructor() {
    this.currentPlan = this.getUserPlan()
    this.usageStats = this.loadUsageStats()
  }

  getUserPlan() {
    return JSON.parse(localStorage.getItem("userPlan")) || premiumPlans.free
  }

  hasFeature(featureName) {
    return this.currentPlan.features[featureName] === true
  }

  checkLimit(action) {
    const today = new Date().toDateString()

    if (!this.usageStats[today]) {
      this.usageStats[today] = {}
    }

    const todayUsage = this.usageStats[today]

    switch (action) {
      case "viewName":
        if (this.hasFeature("unlimitedViews")) return true
        const viewLimit = this.currentPlan.features.viewNames || 0
        return (todayUsage.views || 0) < viewLimit

      case "addFavorite":
        if (this.hasFeature("unlimitedFavorites")) return true
        const favoriteLimit = this.currentPlan.features.favorites || 0
        const currentFavorites = JSON.parse(localStorage.getItem("favorites") || "[]")
        return currentFavorites.length < favoriteLimit

      default:
        return true
    }
  }

  incrementUsage(action) {
    const today = new Date().toDateString()
    if (!this.usageStats[today]) {
      this.usageStats[today] = {}
    }

    this.usageStats[today][action] = (this.usageStats[today][action] || 0) + 1
    this.saveUsageStats()
  }

  saveUsageStats() {
    localStorage.setItem("usageStats", JSON.stringify(this.usageStats))
  }

  loadUsageStats() {
    return JSON.parse(localStorage.getItem("usageStats") || "{}")
  }

  upgradeToPremium(planName) {
    const plan = premiumPlans[planName]
    if (plan) {
      localStorage.setItem("userPlan", JSON.stringify(plan))
      this.currentPlan = plan
      this.showUpgradeSuccess(planName)
    }
  }

  showUpgradeSuccess(planName) {
    showToast(`${planName} planına uğurla yüksəldiniz! 🎉`, "success")
    this.refreshPremiumUI()
  }

  refreshPremiumUI() {
    // UI-ni yenilə
    this.updatePremiumBadges()
    this.updateFeatureAccess()
    this.hideAds()
  }

  updatePremiumBadges() {
    const premiumBadges = document.querySelectorAll(".premium-badge")
    premiumBadges.forEach((badge) => {
      if (this.currentPlan.name !== "Pulsuz") {
        badge.style.display = "inline-block"
        badge.textContent = this.currentPlan.name
      } else {
        badge.style.display = "none"
      }
    })
  }

  updateFeatureAccess() {
    // Premium funksiyaları göstər/gizlət
    document.querySelectorAll("[data-premium-feature]").forEach((element) => {
      const feature = element.dataset.premiumFeature
      if (this.hasFeature(feature)) {
        element.classList.remove("premium-locked")
      } else {
        element.classList.add("premium-locked")
      }
    })
  }

  hideAds() {
    if (this.hasFeature("noAds")) {
      document.querySelectorAll(".ad-banner").forEach((ad) => {
        ad.style.display = "none"
      })
    }
  }

  showPremiumModal(featureName) {
    const modal = document.getElementById("premiumModal")
    const featureTitle = document.getElementById("premiumFeatureTitle")
    const featureDescription = document.getElementById("premiumFeatureDescription")

    const featureInfo = this.getPremiumFeatureInfo(featureName)
    featureTitle.textContent = featureInfo.title
    featureDescription.textContent = featureInfo.description

    modal.classList.add("show")
  }

  getPremiumFeatureInfo(featureName) {
    const features = {
      advancedAnalytics: {
        title: "Təkmil Analitika",
        description: "Adların detallı statistikası, trend analizi və şəxsi hesabatlar",
      },
      nameHistory: {
        title: "Ad Tarixi",
        description: "Adların tarixi inkişafı və mədəni konteksti",
      },
      aiNameGenerator: {
        title: "AI Ad Generatoru",
        description: "Süni intellekt ilə şəxsiləşdirilmiş ad tövsiyələri",
      },
      nameCompatibility: {
        title: "Ad Uyğunluğu",
        description: "Numeroloji və astroloji uyğunluq analizi",
      },
      customCertificates: {
        title: "Şəxsi Sertifikatlar",
        description: "Gözəl dizaynlı ad sertifikatları və wallpaper-lər",
      },
    }

    return (
      features[featureName] || {
        title: "Premium Xüsusiyyət",
        description: "Bu funksiya premium istifadəçilər üçün nəzərdə tutulub",
      }
    )
  }
}

// Initialize Premium Manager
const premiumManager = new PremiumManager()

// Premium Feature Implementations
const premiumFeatures = {
  // Təkmil Analitika
  showAdvancedAnalytics(nameId) {
    if (!premiumManager.hasFeature("advancedAnalytics")) {
      premiumManager.showPremiumModal("advancedAnalytics")
      return
    }

    const analytics = this.generateAdvancedAnalytics(nameId)
    this.displayAnalytics(analytics)
  },

  generateAdvancedAnalytics(nameId) {
    const name = namesData.find((n) => n.id === nameId)
    return {
      popularityTrend: this.generatePopularityTrend(name),
      regionalData: this.generateRegionalData(name),
      ageGroupPreference: this.generateAgeGroupData(name),
      seasonalTrends: this.generateSeasonalData(name),
      culturalSignificance: this.generateCulturalData(name),
    }
  },

  // AI Ad Generator
  generateAINames(preferences) {
    if (!premiumManager.hasFeature("aiNameGenerator")) {
      premiumManager.showPremiumModal("aiNameGenerator")
      return
    }

    const aiSuggestions = this.processAIGeneration(preferences)
    this.displayAISuggestions(aiSuggestions)
  },

  processAIGeneration(preferences) {
    // AI algoritmi simulyasiyası
    const suggestions = []
    const baseNames = namesData.filter(
      (name) =>
        name.gender === preferences.gender && (preferences.origin === "any" || name.origin === preferences.origin),
    )

    // Kombinasiya yaradırıq
    for (let i = 0; i < 5; i++) {
      const baseName = baseNames[Math.floor(Math.random() * baseNames.length)]
      const variation = this.createNameVariation(baseName, preferences)
      suggestions.push(variation)
    }

    return suggestions
  },

  // Ad Uyğunluğu
  calculateCompatibility(name1, name2) {
    if (!premiumManager.hasFeature("nameCompatibility")) {
      premiumManager.showPremiumModal("nameCompatibility")
      return
    }

    const compatibility = {
      numerological: this.calculateNumerology(name1, name2),
      phonetic: this.calculatePhoneticHarmony(name1, name2),
      cultural: this.calculateCulturalCompatibility(name1, name2),
      overall: 0,
    }

    compatibility.overall = Math.round(
      (compatibility.numerological + compatibility.phonetic + compatibility.cultural) / 3,
    )

    this.displayCompatibility(compatibility)
    return compatibility
  },

  // Şəxsi Sertifikatlar
  generateCertificate(nameData, template = "classic") {
    if (!premiumManager.hasFeature("customCertificates")) {
      premiumManager.showPremiumModal("customCertificates")
      return
    }

    const certificate = this.createCertificateCanvas(nameData, template)
    this.downloadCertificate(certificate, nameData.name)
  },

  createCertificateCanvas(nameData, template) {
    const canvas = document.createElement("canvas")
    canvas.width = 800
    canvas.height = 600
    const ctx = canvas.getContext("2d")

    // Arxa fon
    const gradient = ctx.createLinearGradient(0, 0, 800, 600)
    gradient.addColorStop(0, "#6366f1")
    gradient.addColorStop(1, "#06b6d4")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 800, 600)

    // Mətn əlavə et
    ctx.fillStyle = "white"
    ctx.font = "bold 48px Inter"
    ctx.textAlign = "center"
    ctx.fillText(nameData.name, 400, 200)

    ctx.font = "24px Inter"
    ctx.fillText(nameData.meaning, 400, 250)

    ctx.font = "18px Inter"
    ctx.fillText(`Mənşə: ${nameData.origin}`, 400, 300)

    return canvas
  },

  // Offline Mode
  enableOfflineMode() {
    if (!premiumManager.hasFeature("offlineMode")) {
      premiumManager.showPremiumModal("offlineMode")
      return
    }

    // Service Worker qeydiyyatı
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(() => {
        showToast("Offline rejim aktivləşdirildi! 📱", "success")
      })
    }
  },

  // Data Export
  exportUserData() {
    if (!premiumManager.hasFeature("exportData")) {
      premiumManager.showPremiumModal("exportData")
      return
    }

    const userData = {
      favorites: JSON.parse(localStorage.getItem("favorites") || "[]"),
      viewHistory: JSON.parse(localStorage.getItem("viewCounts") || "{}"),
      preferences: JSON.parse(localStorage.getItem("userPreferences") || "{}"),
      exportDate: new Date().toISOString(),
    }

    this.downloadJSON(userData, "azerbaycan-adlari-data.json")
  },

  downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  },
}

// Usage Tracking
function trackFeatureUsage(featureName) {
  if (!premiumManager.checkLimit(featureName)) {
    premiumManager.showPremiumModal(featureName)
    return false
  }

  premiumManager.incrementUsage(featureName)
  return true
}

// Export for global use
window.premiumManager = premiumManager
window.premiumFeatures = premiumFeatures

// Assume showToast and namesData are defined elsewhere (e.g., imported or declared)
// For example:
// import { showToast } from './utils'; // If showToast is in a separate module
// const namesData = [...]; // If namesData is a global variable
