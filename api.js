// API Service for Azerbaijan Names Platform
class AzerbaijanNamesAPI {
  constructor(namesData, viewCounts, favorites) {
    this.baseURL = window.location.origin
    this.version = "v1"
    this.endpoints = {
      names: "/api/v1/names",
      search: "/api/v1/search",
      popular: "/api/v1/popular",
      random: "/api/v1/random",
      statistics: "/api/v1/statistics",
      origins: "/api/v1/origins",
      genders: "/api/v1/genders",
    }
    this.namesData = namesData
    this.viewCounts = viewCounts
    this.favorites = favorites
  }

  // Get all names with optional filters
  async getNames(filters = {}) {
    try {
      const params = new URLSearchParams(filters)
      const response = await fetch(`${this.baseURL}${this.endpoints.names}?${params}`)
      return await response.json()
    } catch (error) {
      console.error("API Error:", error)
      return this.getMockNames(filters)
    }
  }

  // Search names by query
  async searchNames(query, filters = {}) {
    try {
      const params = new URLSearchParams({ q: query, ...filters })
      const response = await fetch(`${this.baseURL}${this.endpoints.search}?${params}`)
      return await response.json()
    } catch (error) {
      console.error("API Error:", error)
      return this.getMockSearchResults(query, filters)
    }
  }

  // Get popular names
  async getPopularNames(limit = 10) {
    try {
      const response = await fetch(`${this.baseURL}${this.endpoints.popular}?limit=${limit}`)
      return await response.json()
    } catch (error) {
      console.error("API Error:", error)
      return this.getMockPopularNames(limit)
    }
  }

  // Get random name
  async getRandomName(gender = null) {
    try {
      const params = gender ? `?gender=${gender}` : ""
      const response = await fetch(`${this.baseURL}${this.endpoints.random}${params}`)
      return await response.json()
    } catch (error) {
      console.error("API Error:", error)
      return this.getMockRandomName(gender)
    }
  }

  // Get statistics
  async getStatistics() {
    try {
      const response = await fetch(`${this.baseURL}${this.endpoints.statistics}`)
      return await response.json()
    } catch (error) {
      console.error("API Error:", error)
      return this.getMockStatistics()
    }
  }

  // Get name details with history and regional data
  async getNameDetails(nameId) {
    try {
      const response = await fetch(`${this.baseURL}${this.endpoints.names}/${nameId}`)
      return await response.json()
    } catch (error) {
      console.error("API Error:", error)
      return this.getMockNameDetails(nameId)
    }
  }

  // Get origins
  async getOrigins() {
    try {
      const response = await fetch(`${this.baseURL}${this.endpoints.origins}`)
      return await response.json()
    } catch (error) {
      console.error("API Error:", error)
      return this.getMockOrigins()
    }
  }

  // Mock data methods (fallback when API is not available)
  getMockNames(filters = {}) {
    let names = [...this.namesData]

    if (filters.gender) {
      names = names.filter((name) => name.gender === filters.gender)
    }

    if (filters.origin) {
      names = names.filter((name) => name.origin === filters.origin)
    }

    if (filters.limit) {
      names = names.slice(0, Number.parseInt(filters.limit))
    }

    return {
      success: true,
      data: names,
      total: names.length,
      page: Number.parseInt(filters.page) || 1,
      limit: Number.parseInt(filters.limit) || 50,
    }
  }

  getMockSearchResults(query, filters = {}) {
    const results = this.namesData.filter(
      (name) =>
        name.name.toLowerCase().includes(query.toLowerCase()) ||
        name.meaning.toLowerCase().includes(query.toLowerCase()),
    )

    return {
      success: true,
      data: results,
      query: query,
      total: results.length,
    }
  }

  getMockPopularNames(limit) {
    const popular = Object.entries(this.viewCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([id, count]) => {
        const name = this.namesData.find((n) => n.id == id)
        return { ...name, viewCount: count }
      })
      .filter((name) => name)

    return {
      success: true,
      data: popular,
      limit: limit,
    }
  }

  getMockRandomName(gender) {
    let filteredNames = this.namesData
    if (gender) {
      filteredNames = this.namesData.filter((name) => name.gender === gender)
    }

    const randomName = filteredNames[Math.floor(Math.random() * filteredNames.length)]

    return {
      success: true,
      data: randomName,
    }
  }

  getMockStatistics() {
    const totalNames = this.namesData.length
    const genderStats = {
      qız: this.namesData.filter((n) => n.gender === "qız").length,
      oğlan: this.namesData.filter((n) => n.gender === "oğlan").length,
    }

    const originStats = {}
    this.namesData.forEach((name) => {
      originStats[name.origin] = (originStats[name.origin] || 0) + 1
    })

    const totalViews = Object.values(this.viewCounts).reduce((sum, count) => sum + count, 0)

    return {
      success: true,
      data: {
        totalNames,
        genderStats,
        originStats,
        totalViews,
        totalFavorites: this.favorites.length,
      },
    }
  }

  getMockNameDetails(nameId) {
    const name = this.namesData.find((n) => n.id == nameId)
    if (!name) {
      return { success: false, error: "Name not found" }
    }

    // Generate historical data
    const historicalData = this.generateHistoricalData(name)
    const regionalData = this.generateRegionalData(name)

    return {
      success: true,
      data: {
        ...name,
        historicalPopularity: historicalData,
        regionalPopularity: regionalData,
        viewCount: this.viewCounts[nameId] || 0,
        isFavorite: this.favorites.includes(nameId),
      },
    }
  }

  getMockOrigins() {
    const origins = [...new Set(this.namesData.map((name) => name.origin))]
    return {
      success: true,
      data: origins.map((origin) => ({
        name: origin,
        count: this.namesData.filter((name) => name.origin === origin).length,
      })),
    }
  }

  // Generate realistic historical data
  generateHistoricalData(name) {
    const data = []
    const currentYear = new Date().getFullYear()

    for (let year = 1990; year <= currentYear; year += 5) {
      let popularity = name.popularity

      // Add realistic variations based on name characteristics
      if (name.origin === "azərbaycan") {
        popularity += Math.sin((year - 1990) / 10) * 15 + Math.random() * 10
      } else if (name.origin === "türk") {
        popularity += Math.cos((year - 1990) / 8) * 12 + Math.random() * 8
      } else {
        popularity += Math.sin((year - 1990) / 12) * 10 + Math.random() * 6
      }

      popularity = Math.max(20, Math.min(95, popularity))
      data.push({
        year: year,
        popularity: Math.round(popularity),
      })
    }

    return data
  }

  // Generate realistic regional data
  generateRegionalData(name) {
    const regions = ["Bakı", "Gəncə", "Sumqayıt", "Mingəçevir", "Şəki", "Quba", "Lənkəran", "Şamaxı"]

    return regions.map((region) => {
      let popularity = name.popularity

      // Add regional variations
      if (region === "Bakı") {
        popularity += Math.random() * 20 - 5
      } else if (name.origin === "azərbaycan" && ["Şəki", "Quba", "Şamaxı"].includes(region)) {
        popularity += Math.random() * 15
      } else {
        popularity += Math.random() * 25 - 10
      }

      return {
        region: region,
        popularity: Math.max(10, Math.min(90, Math.round(popularity))),
      }
    })
  }

  // API Documentation generator
  generateDocumentation() {
    return {
      title: "Azerbaijan Names API Documentation",
      version: this.version,
      baseURL: this.baseURL,
      endpoints: [
        {
          method: "GET",
          path: "/api/v1/names",
          description: "Get all names with optional filters",
          parameters: [
            { name: "gender", type: "string", description: "Filter by gender (qız/oğlan)" },
            { name: "origin", type: "string", description: "Filter by origin" },
            { name: "limit", type: "number", description: "Limit number of results" },
            { name: "page", type: "number", description: "Page number for pagination" },
          ],
          example: "/api/v1/names?gender=qız&origin=türk&limit=10",
        },
        {
          method: "GET",
          path: "/api/v1/search",
          description: "Search names by query",
          parameters: [
            { name: "q", type: "string", required: true, description: "Search query" },
            { name: "gender", type: "string", description: "Filter by gender" },
            { name: "origin", type: "string", description: "Filter by origin" },
          ],
          example: "/api/v1/search?q=aysel&gender=qız",
        },
        {
          method: "GET",
          path: "/api/v1/popular",
          description: "Get popular names",
          parameters: [{ name: "limit", type: "number", description: "Number of popular names to return" }],
          example: "/api/v1/popular?limit=5",
        },
        {
          method: "GET",
          path: "/api/v1/random",
          description: "Get a random name",
          parameters: [{ name: "gender", type: "string", description: "Filter by gender" }],
          example: "/api/v1/random?gender=oğlan",
        },
        {
          method: "GET",
          path: "/api/v1/names/{id}",
          description: "Get detailed information about a specific name",
          parameters: [{ name: "id", type: "number", required: true, description: "Name ID" }],
          example: "/api/v1/names/1",
        },
        {
          method: "GET",
          path: "/api/v1/statistics",
          description: "Get platform statistics",
          parameters: [],
          example: "/api/v1/statistics",
        },
      ],
      responseFormat: {
        success: true,
        data: "Response data",
        total: "Total number of items (for paginated responses)",
        page: "Current page number",
        limit: "Items per page",
      },
      errorFormat: {
        success: false,
        error: "Error message",
        code: "Error code",
      },
    }
  }
}

// Initialize API instance
const namesData = [] // Example data, should be imported or defined
const viewCounts = {} // Example data, should be imported or defined
const favorites = [] // Example data, should be imported or defined
const azerbaijanNamesAPI = new AzerbaijanNamesAPI(namesData, viewCounts, favorites)

// Make API available globally
window.AzerbaijanNamesAPI = AzerbaijanNamesAPI
