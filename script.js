let namesData = []
let currentLanguage = localStorage.getItem("language") || "az"
let currentTheme = localStorage.getItem("theme") || "light"
const favorites = JSON.parse(localStorage.getItem("favorites")) || []
const viewCounts = JSON.parse(localStorage.getItem("viewCounts")) || {}
const chartInstances = {}
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
    "updates-every-5-minutes": "5 dəqiqədə bir yenilənir",
    "name-card-views": "baxış",
    "remove-from-favorites": "Favoritdən çıxar",
    "add-to-favorites": "Favoritə əlavə et",
    "create-card": "📸 Kart Yarat",
    "card-generator-title": "📸 Kart Yaradıcısı",
    "select-theme": "Tema seçin:",
    "theme-classic": "Klassik",
    "theme-modern": "Modern",
    "theme-elegant": "Zərif",
    "theme-nature": "Təbiət",
    "theme-royal": "Kral",
    "theme-sunset": "Gün batımı",
    "theme-ocean": "Okean",
    "theme-galaxy": "Qalaktika",
    "download-card": "Kartı Yüklə",
    "share-card": "Paylaş",
    "suggest-q1": "🚻 Hansı cinsdə ad axtarırsınız?",
    "girl-name": "Qız adı",
    "boy-name": "Oğlan adı",
    "suggest-q2": "✨ Hansı xarakter xüsusiyyətini üstün tutursunuz?",
    "character-leader": "Lider",
    "character-friendly": "Dostcanlı",
    "character-creative": "Yaradıcı",
    "character-strong": "Güclü",
    "character-delicate": "Zərif",
    "character-wise": "Müdrik",
    "suggest-q3": "🌍 Hansı mənşələrə üstünlük verirsiniz?",
    "origin-azerbaijani": "Azərbaycan",
    "origin-turkish": "Türk",
    "origin-arabic": "Ərəb",
    "origin-persian": "Fars",
    "origin-none": "Heç biri",
    "suggest-q4": "🎯 Sizə uyğun ad tövsiyələri:",
    "no-suggest-results-p1": "Təəssüf ki, seçdiyiniz meyarlara uyğun ad tapılmadı.",
    "no-suggest-results-p2": "Başqa seçimlər etməyi sınayın.",
    "restart-quiz": "Yenidən başla",
    question: "Sual",
    "quiz-result-title": "Test nəticəsi",
    "share-result": "Nəticəni paylaş",
    "correct-answer": "Doğru cavab!✅",
    "wrong-answer": "Yanlış cavab!❌",
    "quiz-result-expert": "Əla! Siz Azərbaycan adları üzrə ekspertsiniz!🏆",
    "quiz-result-good": "Yaxşı! Azərbaycan adları haqqında yaxşı məlumatınız var 👍",
    "quiz-result-average": "Orta! Daha çox öyrənməyə ehtiyacınız var 📚",
    "quiz-result-poor": "Zəif! Azərbaycan adları haqqında daha çox oxuyun 📖",
    "quiz-share-text-prefix": "Azərbaycan Adları testində",
    "quiz-share-text-suffix": "% nəticə əldə etdim! 🇦🇿",
    "result-copied": "Nəticə kopyalandı!",
    "suggestion-sent": "Təklifiniz uğurla göndərildi! Admin tərəfindən nəzərdən keçiriləcək.",
    "favorite-removed": "Ad favoritlərdən silindi",
    "favorite-added": "Ad favoritlərə əlavə edildi",
    "confirm-clear-favorites": "Bütün favori adları silmək istədiyinizə əminsiniz?",
    "all-favorites-cleared": "Bütün favoritlər silindi",
    "card-not-found": "Kart tapılmadı",
    "card-download-error": "Kart yüklənmədi, xəta baş verdi",
    "card-shared": "Kart paylaşıldı! 📤",
    "card-info-copied": "Kart məlumatları kopyalandı! 📋",
    "share-not-possible": "Paylaşım mümkün olmadı",
    "name-info-copied": "Ad məlumatları kopyalandı!",
    "pronunciation-not-supported": "Tələffüz dəstəklənmir",
    "no-names-found": "Heç bir ad tapılmadı",
    "new-name-added": "yeni ad sayta əlavə edildi!",
    "name-removed": "adı saytdan silindi",
    "link-copied": "Link kopyalandı!",
    "gender-girl": "Qız",
    "gender-boy": "Oğlan",
    fact1: "Aysel adı 1960-cı illərdə çox məşhur idi",
    fact2: "Ən çox Bakı şəhərində Leyla adı qoyulur",
    fact3: "Ülvi adının kökü ərəbcə 'ulu' sözündən gəlir",
    fact4: "Rəşad adı son 10 ildə populyarlığını artırıb",
    fact5: "Gülnar adı əsasən Gəncə bölgəsində sevilir",
    fact6: "Elvin adı müasir Azərbaycan adlarından biridir",
    fact7: "Röya adı ədəbiyyatda çox istifadə olunur",
    fact8: "Tural adı qədim türk mənşəlidir",
    fact9: "Dilara adı son illər ən populyar qız adlarından biridir",
    fact10: "Məhəmməd adı dünyada ən çox istifadə olunan adlardandır",
    fact11: "Cavid adı əsasən ziyalı ailələrdə üstünlük verilir",
    fact12: "Günel adı müasir Azərbaycan adı olaraq tanınır",
    fact13: "Əli adı Azərbaycanda ən qədim adlardandır",
    fact14: "Fidan adı təbiət sevən ailələr tərəfindən seçilir",
    fact15: "Yusif adı həm Azərbaycanda, həm də digər müsəlman ölkələrində populyardır",
    fact16: "Şəhla adı klassik Azərbaycan ədəbiyyatında çox rast gələn addır",
    fact17: "Rəsul adı dini əhəmiyyəti olan adlardandır",
    fact18: "Könül adı Azərbaycan mədəniyyətində xüsusi yer tutur",
    fact19: "Ayla adı türk dilində 'ay hələsi' mənasını verir",
    fact20: "Elnur adı sovet dövründə çox populyar idi",
    fact21: "Nigar adı fars ədəbiyyatından gəlir",
    fact22: "Orxan adı Moğol imperatorunun adından götürülüb",
    fact23: "Səbinə adı Azərbaycan mənşəli nadir adlardandır",
    fact24: "Vüsal adı mistik mənaya malikdir",
    fact25: "Arzu adı həm qız, həm də oğlan adı kimi istifadə olunur",
    fact26: "Emil adı Avropa mənşəli olsa da Azərbaycanda populyardır",
    fact27: "Həsən adı İslam tarixində mühüm şəxsiyyətlə bağlıdır",
    fact28: "İlahə adı qədim dövrlərdə tanrıça mənasında işlənirdi",
    fact29: "Kərim adı Allahın 99 adından biridir",
    fact30: "Ləman adı ərəb dilində 'parlaqlıq' deməkdir",
    fact31: "Məryəm adı bütün səmavi dinlərdə müqəddəsdir",
    fact32: "Namiq adı Azərbaycan ədəbiyyatında məşhur şairə aiddir",
    fact33: "Osman adı Osmanlı imperatorunun adıdır",
    fact34: "Pəri adı fars mifologiyasından gəlir",
    fact35: "Qədir adı güc və qüdrət simvoludur",
    fact36: "Ruslan adı rus ədəbiyyatından məşhurdur",
    fact37: "Samir adı gecə söhbətləri mənasını verir",
    fact38: "Təranə adı musiqi ilə bağlı mənaya malikdir",
    fact39: "Ümid adı həmişə müsbət enerji daşıyır",
    fact40: "Vəfa adı sədaqət və etibarlılıq simvoludur",
    fact41: "Yaşar adı uzun ömür arzusunu ifadə edir",
    fact42: "Zəhra adı İslam tarixində Peyğəmbərin qızının adıdır",
    fact43: "Əmir adı rəhbərlik və hökmranlıq mənasını verir",
    fact44: "Şəhriyar adı şəhər hökmdarı deməkdir",
    fact45: "Bəxtiyar adı xoşbəxtlik və uğur gətirir",
    fact46: "Cahangir adı dünya fəthedicisi mənasındadır",
    fact47: "Dəyanət adı dindarlıq və əxlaqlılığı ifadə edir",
    fact48: "Fəxri adı qürur və şərəf mənasını daşıyır",
    fact49: "Gülbəniz adı gül kimi gözəl üz deməkdir",
    fact50: "Həbib adı sevimli və əziz insan mənasındadır",
    fact51: "İlkin adı ilk və ən əvvəl olan deməkdir",
    fact52: "Jalə adı təbiətin gözəlliyi ilə bağlıdır",
    fact53: "Kəmaləddin adı dinin mükəmməlliyi mənasındadır",
    fact54: "Ləyla adı gecənin gözəlliyi və sirli havası deməkdir",
    fact55: "Məhərrəm adı müqəddəs və toxunulmaz mənasındadır",
    fact56: "Nəsibə adı tale və qismət mənasını verir",
    fact57: "Oqtay adı ox kimi sürətli və dəqiq deməkdir",
    fact58: "Pərvanə adı işığa can atan kəpənək kimi sevgi simvoludur",
    fact59: "Qasım adı bölən və ədalətli olan mənasındadır",
    fact60: "Reyhan adı ətirli bitki və xoş qoxu deməkdir",
    fact61: "Sənan adı nizə ucu kimi kəskin zəka mənasındadır",
    fact62: "Tərlan adı qartal kimi güclü və azad deməkdir",
    fact63: "Ürfan adı dərin bilik və hikmət mənasını verir",
    fact64: "Vəcihə adı gözəl üzlü və cazibədar deməkdir",
    fact65: "Yasəmən adı ağ çiçək kimi saflıq simvoludur",
    fact66: "Zülalə adı təmiz və şəffaf su kimi saflıq deməkdir",
    fact67: "Azərbaycan adlarının 60%-i ərəb mənşəlidir",
    fact68: "Türk mənşəli adlar əsasən təbiət və güclə bağlıdır",
    fact69: "Fars mənşəli adlar çox vaxt poeziya və incəsənətlə əlaqəlidir",
    fact70: "Sovet dövründə rus adları da məcburi olaraq qoyulurdu",
    fact71: "Qız adlarında çiçək və təbiət adları daha çoxdur",
    fact72: "Oğlan adlarında güc və liderlik mənası daha çoxdur",
    fact73: "Bəzi adlar həm qız, həm də oğlan üçün istifadə olunur",
    fact74: "Adların mənası uşağın xarakterinə təsir edir deyilir",
    fact75: "Azərbaycanda ən uzun ad 'Məhəmmədhüseyn'dir",
    fact76: "Ən qısa adlar 'Su', 'Ay', 'El' kimi təkhecalıdır",
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
    "updates-every-5-minutes": "Updates every 5 minutes",
    "name-card-views": "views",
    "remove-from-favorites": "Remove from favorites",
    "add-to-favorites": "Add to favorites",
    "create-card": "📸 Create Card",
    "card-generator-title": "📸 Card Generator",
    "select-theme": "Select theme:",
    "theme-classic": "Classic",
    "theme-modern": "Modern",
    "theme-elegant": "Elegant",
    "theme-nature": "Nature",
    "theme-royal": "Royal",
    "theme-sunset": "Sunset",
    "theme-ocean": "Ocean",
    "theme-galaxy": "Galaxy",
    "download-card": "Download Card",
    "share-card": "Share",
    "suggest-q1": "🚻 What gender name are you looking for?",
    "girl-name": "Girl name",
    "boy-name": "Boy name",
    "suggest-q2": "✨ Which character trait do you prefer?",
    "character-leader": "Leader",
    "character-friendly": "Friendly",
    "character-creative": "Creative",
    "character-strong": "Strong",
    "character-delicate": "Delicate",
    "character-wise": "Wise",
    "suggest-q3": "🌍 Which origins do you prefer?",
    "origin-azerbaijani": "Azerbaijani",
    "origin-turkish": "Turkish",
    "origin-arabic": "Arabic",
    "origin-persian": "Persian",
    "origin-none": "None",
    "suggest-q4": "🎯 Name suggestions for you:",
    "no-suggest-results-p1": "Unfortunately, no names were found matching your criteria.",
    "no-suggest-results-p2": "Try making different selections.",
    "restart-quiz": "Restart",
    question: "Question",
    "quiz-result-title": "Quiz Result",
    "share-result": "Share Result",
    "correct-answer": "Correct answer!✅",
    "wrong-answer": "Wrong answer!❌",
    "quiz-result-expert": "Excellent! You are an expert in Azerbaijani names!🏆",
    "quiz-result-good": "Good! You have good knowledge about Azerbaijani names 👍",
    "quiz-result-average": "Average! You need to learn more 📚",
    "quiz-result-poor": "Poor! Read more about Azerbaijani names 📖",
    "quiz-share-text-prefix": "I scored",
    "quiz-share-text-suffix": "% in the Azerbaijani Names quiz! 🇦🇿",
    "result-copied": "Result copied!",
    "suggestion-sent": "Your suggestion has been sent successfully! It will be reviewed by admin.",
    "favorite-removed": "Name removed from favorites",
    "favorite-added": "Name added to favorites",
    "confirm-clear-favorites": "Are you sure you want to clear all favorite names?",
    "all-favorites-cleared": "All favorites cleared",
    "card-not-found": "Card not found",
    "card-download-error": "Card download failed, an error occurred",
    "card-shared": "Card shared! 📤",
    "card-info-copied": "Card information copied! 📋",
    "share-not-possible": "Sharing not possible",
    "name-info-copied": "Name information copied!",
    "pronunciation-not-supported": "Pronunciation not supported",
    "no-names-found": "No names found",
    "new-name-added": "new name added to the site!",
    "name-removed": "name removed from the site",
    "link-copied": "Link copied!",
    "gender-girl": "Girl",
    "gender-boy": "Boy",
    fact1: "The name Aysel was very popular in the 1960s",
    fact2: "The name Leyla is most commonly given in Baku city",
    fact3: "The origin of the name Ulvi comes from the Arabic word 'ulu' (exalted)",
    fact4: "The name Rashad has increased in popularity in the last 10 years",
    fact5: "The name Gulnar is mainly popular in the Ganja region",
    fact6: "Elvin is one of the modern Azerbaijani names",
    fact7: "The name Roya is widely used in literature",
    fact8: "The name Tural is of ancient Turkic origin",
    fact9: "Dilara is one of the most popular girl names in recent years",
    fact10: "Muhammad is one of the most commonly used names worldwide",
    fact11: "The name Javid is mainly preferred in intellectual families",
    fact12: "Gunel is recognized as a modern Azerbaijani name",
    fact13: "Ali is one of the oldest names in Azerbaijan",
    fact14: "The name Fidan is chosen by nature-loving families",
    fact15: "Yusif is popular in Azerbaijan and other Muslim countries",
    fact16: "Shahla is a frequently encountered name in classical Azerbaijani literature",
    fact17: "Rasul is a name with religious significance",
    fact18: "The name Konul holds a special place in Azerbaijani culture",
    fact19: "The name Ayla means 'halo of the moon' in Turkish",
    fact20: "Elnur was very popular during the Soviet era",
    fact21: "The name Nigar comes from Persian literature",
    fact22: "The name Orkhan is derived from the name of a Mongol emperor",
    fact23: "Sabina is a rare name of Azerbaijani origin",
    fact24: "Vusal has a mystical meaning",
    fact25: "Arzu is used as both a girl's and boy's name",
    fact26: "Although Emil is of European origin, it is popular in Azerbaijan",
    fact27: "Hasan is associated with important figures in Islamic history",
    fact28: "The name Ilaha was used in ancient times to mean goddess",
    fact29: "Karim is one of the 99 names of Allah",
    fact30: "Laman means 'brightness' in Arabic",
    fact31: "Maryam is sacred in all Abrahamic religions",
    fact32: "Namiq refers to a famous poet in Azerbaijani literature",
    fact33: "Osman is the name of an Ottoman emperor",
    fact34: "Peri comes from Persian mythology",
    fact35: "Gadir is a symbol of strength and power",
    fact36: "Ruslan is famous from Russian literature",
    fact37: "Samir means 'night conversations'",
    fact38: "Tarana has a meaning related to music",
    fact39: "Umid always carries positive energy",
    fact40: "Vafa is a symbol of loyalty and trustworthiness",
    fact41: "Yashar expresses the wish for a long life",
    fact42: "Zahra is the name of the Prophet's daughter in Islamic history",
    fact43: "Amir means leadership and sovereignty",
    fact44: "Shahriyar means 'ruler of the city'",
    fact45: "Bakhtiyar brings happiness and success",
    fact46: "Jahangir means 'conqueror of the world'",
    fact47: "Dayanat expresses religiosity and morality",
    fact48: "Fakhri carries the meaning of pride and honor",
    fact49: "Gulbaniz means 'face like a rose'",
    fact50: "Habib means a beloved and dear person",
    fact51: "Ilkin means 'first' and 'foremost'",
    fact52: "Jala is associated with the beauty of nature",
    fact53: "Kamaladdin means 'perfection of religion'",
    fact54: "Layla means the beauty and mysterious atmosphere of the night",
    fact55: "Muharram means 'sacred' and 'inviolable'",
    fact56: "Nasiba means 'fate' and 'destiny'",
    fact57: "Oktay means 'fast and accurate like an arrow'",
    fact58: "Parvana is a symbol of love, like a moth drawn to light",
    fact59: "Gasim means 'distributor' and 'just'",
    fact60: "Reyhan means 'fragrant plant' and 'pleasant scent'",
    fact61: "Sanana means 'sharp intellect' like a spearhead",
    fact62: "Tarlan means 'strong and free like an eagle'",
    fact63: "Irfan means 'deep knowledge' and 'wisdom'",
    fact64: "Vajiha means 'beautiful-faced' and 'attractive'",
    fact65: "Yasaman is a symbol of purity like a white flower",
    fact66: "Zulala means 'purity' like clear and transparent water",
    fact67: "60% of Azerbaijani names are of Arabic origin",
    fact68: "Turkic names are mainly associated with nature and strength",
    fact69: "Persian names are often related to poetry and art",
    fact70: "During the Soviet era, Russian names were also forcibly given",
    fact71: "Girl names more often include flower and nature names",
    fact72: "Boy names more often carry meanings of strength and leadership",
    fact73: "Some names are used for both girls and boys",
    fact74: "The meaning of names is said to influence a child's character",
    fact75: "The longest name in Azerbaijan is 'Muhammadhuseyn'",
    fact76: "The shortest names are single-syllable like 'Su', 'Ay', 'El'",
  },
}
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
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM yükləndi, app başladılır")
  initializeApp()
})
window.addEventListener("namesUpdated", (event) => {
  console.log("Names updated from admin panel")
  loadUpdatedNames()
})
window.addEventListener("nameRemoved", (event) => {
  console.log("Name removed from admin panel")
  const suggestionId = event.detail.suggestionId
  const mainNames = JSON.parse(localStorage.getItem("mainNamesData") || "[]")
  const removedName = mainNames.find(
    (name) => name.source === "admin_approved" && name.originalSuggestionId === suggestionId,
  )
  if (removedName) {
    namesData = namesData.filter((name) => name.id !== removedName.id)
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
    const searchInput = document.getElementById("searchInput")
    if (searchInput && searchInput.value.trim()) {
      handleSearch()
    }
    showToast(`"${removedName.name}" ${translations[currentLanguage]["name-removed"]}`, "info")
  }
})
window.addEventListener("storage", (e) => {
  if (e.key === "namesUpdated") {
    loadUpdatedNames()
  }
})
function loadUpdatedNames() {
  const updatedNames = JSON.parse(localStorage.getItem("mainNamesData") || "[]")
  if (updatedNames.length > 0) {
    const existingIds = namesData.map((n) => n.id)
    const newNames = updatedNames.filter((n) => !existingIds.includes(n.id))
    if (newNames.length > 0) {
      namesData.push(...newNames)
      console.log(`${newNames.length} yeni ad əlavə edildi`)
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
      }
      const searchInput = document.getElementById("searchInput")
      if (searchInput && searchInput.value.trim()) {
        handleSearch()
      }
      showToast(`${newNames.length} ${translations[currentLanguage]["new-name-added"]}`, "success")
    }
  }
}
function calculateTotalViews() {
  return Object.values(viewCounts).reduce((total, count) => total + count, 0)
}
let statsUpdateTimer = 300
let statsInterval
function startStatsTimer() {
  const timerElement = document.querySelector(".stats-timer")
  if (!timerElement) {
    const totalViewsEl = document.getElementById("totalViews")
    if (totalViewsEl && totalViewsEl.parentNode) {
      const timerHTML = `
      <div class="stats-timer">
        <i class="fas fa-clock timer-icon"></i>
        <span id="timerText">5:00</span>
      </div>
      <div class="stats-update-info" data-translate="updates-every-5-minutes">5 dəqiqədə bir yenilənir</div>
    `
      totalViewsEl.parentNode.insertAdjacentHTML("afterend", timerHTML)
    }
  }
  statsInterval = setInterval(() => {
    statsUpdateTimer--
    const minutes = Math.floor(statsUpdateTimer / 60)
    const seconds = statsUpdateTimer % 60
    const timerText = document.getElementById("timerText")
    if (timerText) {
      timerText.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`
    }
    if (statsUpdateTimer <= 0) {
      updateTotalViews()
      statsUpdateTimer = 300
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
function initializeApp() {
  console.log("App başladılır...")
  try {
    loadNamesFromJSON().then(() => {
      loadUpdatedNames()
      applyTheme()
      applyLanguage()
      setupEventListeners()
      displayDailyName()
      displayCelebrityBirthdays({})
      displayRandomFact()
      checkURLParameter()
      setTimeout(() => {
        console.log("Adlar göstərilir, toplam:", namesData.length)
        displayNames(namesData)
        const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]')
        if (allFilterBtn) {
          allFilterBtn.classList.add("active")
        }
      }, 500)
      setupAlphabetNavigation()
      displayPopularNames()
      updateFavoritesCount()
      updateTotalNamesCount()
      updateTotalViews()
      startStatsTimer()
      console.log("App uğurla başladıldı, toplam ad sayı:", namesData.length)
      setTimeout(() => {
        hideLoadingScreen()
      }, 1000)
    })
  } catch (error) {
    console.error("App başlatma xətası:", error)
    hideLoadingScreen()
  }
}
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
    showTestData()
    return namesData
  }
}
function showTestData() {
  console.log("Test məlumatları yüklənir...")
  namesData = [
    {
      id: 1,
      name: "Aysel",
      meaning: "Ay işığı, ay nuru",
      gender: "qız",
      origin: "türk",
      similar: ["Ayla", "Ayşən", "Aynur"],
      popularity: 85,
    },
    {
      id: 2,
      name: "Elvin",
      meaning: "Elin dostları, xalqın dostu",
      gender: "oğlan",
      origin: "azərbaycan",
      similar: ["Elçin", "Elşən", "Elnur"],
      popularity: 78,
    },
    {
      id: 3,
      name: "Leyla",
      meaning: "Gecə gözəlliyi",
      gender: "qız",
      origin: "ərəb",
      similar: ["Leylan", "Leyli", "Layla"],
      popularity: 92,
    },
    {
      id: 4,
      name: "Rəşad",
      meaning: "Doğru yol tapan",
      gender: "oğlan",
      origin: "ərəb",
      similar: ["Rəşid", "Rəsul", "Rəhim"],
      popularity: 76,
    },
    {
      id: 5,
      name: "Gülnar",
      meaning: "Nar çiçəyi",
      gender: "qız",
      origin: "fars",
      similar: ["Gülşən", "Gülnar", "Gülbəniz"],
      popularity: 68,
    },
  ]
  console.log("Test məlumatları yükləndi:", namesData.length, "ad")
}
function updateTotalNamesCount() {
  const totalNamesEl = document.getElementById("totalNames")
  if (totalNamesEl) {
    totalNamesEl.textContent = `${namesData.length}+`
  }
}
function setupEventListeners() {
  console.log("Event listeners qurulur...")
  try {
    const themeToggle = document.getElementById("themeToggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", toggleTheme)
    }
    const langToggle = document.getElementById("langToggle")
    if (langToggle) {
      langToggle.addEventListener("click", toggleLanguage)
    }
    const searchInput = document.getElementById("searchInput")
    if (searchInput) {
      searchInput.addEventListener("input", debounce(handleSearch, 300))
      searchInput.addEventListener("keyup", debounce(handleSearch, 300))
    }
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", handleFilter)
    })
    document.querySelectorAll(".nav-tab").forEach((tab) => {
      tab.addEventListener("click", handleTabChange)
    })
    const closeModalBtn = document.getElementById("closeModal")
    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", closeModal)
    }
    const modalOverlay = document.getElementById("modalOverlay")
    if (modalOverlay) {
      modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
          closeModal()
        }
      })
    }
    const originFilter = document.getElementById("originFilter")
    if (originFilter) {
      originFilter.addEventListener("change", handleSearch)
    }
    const sortSelect = document.getElementById("sortSelect")
    if (sortSelect) {
      sortSelect.addEventListener("change", handleSort)
    }
    setupScrollToTop()
    setupSearchClear()
    const favoritesToggle = document.getElementById("favoritesToggle")
    if (favoritesToggle) {
      favoritesToggle.addEventListener("click", toggleFavoritesTab)
    }
    const refreshFactBtn = document.getElementById("refreshFact")
    if (refreshFactBtn) {
      refreshFactBtn.addEventListener("click", () => {
        displayRandomFact()
      })
    }
    const addForm = document.getElementById("addForm")
    if (addForm) {
      addForm.addEventListener("submit", handleAddFormSubmit)
    }
    window.addEventListener("message", (event) => {
      if (event.data.type === "nameAdded") {
        const newName = event.data.name
        if (!namesData.find((n) => n.id === newName.id)) {
          namesData.push(newName)
          const currentTab = document.querySelector(".tab-pane.active")?.id || "home"
          if (currentTab === "home") {
            displayNames(namesData)
          }
          showToast(`"${newName.name}" ${translations[currentLanguage]["new-name-added"]}`, "success")
        }
      } else if (event.data.type === "nameRemoved") {
        const suggestionId = event.data.suggestionId
        const mainNames = JSON.parse(localStorage.getItem("mainNamesData") || "[]")
        const removedName = mainNames.find(
          (name) => name.source === "admin_approved" && name.originalSuggestionId === suggestionId,
        )
        if (removedName) {
          namesData = namesData.filter((name) => name.id !== removedName.id)
          const currentTab = document.querySelector(".tab-pane.active")?.id || "home"
          if (currentTab === "home") {
            displayNames(namesData)
          }
          showToast(`"${removedName.name}" ${translations[currentLanguage]["name-removed"]}`, "info")
        }
      }
    })
    setInterval(() => {
      const lastUpdate = localStorage.getItem("namesUpdated")
      const lastChecked = localStorage.getItem("lastUpdateCheck") || "0"
      if (lastUpdate && lastUpdate !== lastChecked) {
        localStorage.setItem("lastUpdateCheck", lastUpdate)
        loadUpdatedNames()
      }
    }, 2000)
    const clearFavoritesBtn = document.getElementById("clearFavorites")
    if (clearFavoritesBtn) {
      clearFavoritesBtn.addEventListener("click", clearFavorites)
    }
    console.log("Event listeners uğurla quruldu")
  } catch (error) {
    console.error("Event listeners xətası:", error)
  }
}
function handleAddFormSubmit(e) {
  e.preventDefault()
  const formData = {
    id: Date.now(),
    name: document.getElementById("newName").value,
    gender: document.getElementById("newGender").value,
    meaning: document.getElementById("newMeaning").value,
    origin: document.getElementById("newOrigin").value,
    similar: document.getElementById("newSimilar").value,
    submittedAt: new Date().toISOString(),
    status: "pending",
  }
  saveSuggestedName(formData)
  document.getElementById("addForm").reset()
  showToast(translations[currentLanguage]["suggestion-sent"], "success")
}
function saveSuggestedName(nameData) {
  const existingSuggestions = JSON.parse(localStorage.getItem("suggestedNames") || "[]")
  existingSuggestions.push(nameData)
  localStorage.setItem("suggestedNames", JSON.stringify(existingSuggestions))
}
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
  document.querySelectorAll("[data-translate]").forEach((element) => {
    const key = element.getAttribute("data-translate")
    if (translations[currentLanguage][key]) {
      element.textContent = translations[currentLanguage][key]
    }
  })
  document.querySelectorAll("[data-translate-placeholder]").forEach((element) => {
    const key = element.getAttribute("data-translate-placeholder")
    if (translations[currentLanguage][key]) {
      element.placeholder = translations[currentLanguage][key]
    }
  })
  // Translate select options for origins
  document.querySelectorAll("#originFilter option").forEach((option) => {
    const key = option.getAttribute("data-translate")
    if (key && translations[currentLanguage][key]) {
      option.textContent = translations[currentLanguage][key]
    }
  })
  document.querySelectorAll("#newOrigin option").forEach((option) => {
    const key = option.getAttribute("data-translate")
    if (key && translations[currentLanguage][key]) {
      option.textContent = translations[currentLanguage][key]
    }
  })
}
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
    <small>${today.toLocaleDateString(currentLanguage === "az" ? "az-AZ" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}</small>
  `
    dailyNameCard.addEventListener("click", () => showNameDetails(dailyName))
    dailyNameCard.classList.add("slide-in")
  }
}
function displayCelebrityBirthdays(celebrities) {
  const celebrityList = document.getElementById("celebrityList")
  if (!celebrityList) return
  const today = new Date()
  const todayKey = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
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
function displayRandomFact() {
  const factCard = document.getElementById("factCard")
  if (!factCard) return
  const facts = []
  for (let i = 1; i <= 76; i++) {
    // Assuming you have facts from fact1 to fact76
    const factKey = `fact${i}`
    if (translations[currentLanguage][factKey]) {
      facts.push(translations[currentLanguage][factKey])
    }
  }
  if (facts.length > 0) {
    const randomFact = facts[Math.floor(Math.random() * facts.length)]
    factCard.textContent = randomFact
    factCard.classList.add("fade-in")
  }
}
function displayNames(names) {
  const namesGrid = document.getElementById("namesGrid")
  if (!namesGrid) return
  if (names.length === 0) {
    namesGrid.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-secondary);">${translations[currentLanguage]["no-names-found"]}</div>`
    return
  }
  namesGrid.innerHTML = names.map((name) => createNameCard(name)).join("")
  const nameCards = namesGrid.querySelectorAll(".name-card")
  nameCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`
    card.classList.add("slide-in-up")
  })
}

function getTranslatedOrigin(originKey) {
  const originMap = {
    azərbaycan: "origin-azerbaijani",
    türk: "origin-turkish",
    ərəb: "origin-arabic",
    fars: "origin-persian",
  }
  const translationKey = originMap[originKey.toLowerCase()]
  return translationKey ? translations[currentLanguage][translationKey] : originKey
}

function getTranslatedGender(genderKey) {
  const genderMap = {
    qız: "gender-girl",
    oğlan: "gender-boy",
  }
  const translationKey = genderMap[genderKey.toLowerCase()]
  return translationKey ? translations[currentLanguage][translationKey] : genderKey
}

function createNameCard(name) {
  const isFavorite = favorites.includes(name.id)
  const views = viewCounts[name.id] || 0
  return `
  <div class="name-card interactive-element" onclick="showNameDetails(${JSON.stringify(name).replace(/"/g, "&quot;")})">
    <h3>${name.name}</h3>
    <p class="name-meaning">${name.meaning}</p>
    <div class="name-details">
      <span class="name-origin">${getTranslatedOrigin(name.origin)}</span>
      <span class="name-popularity">⭐ ${name.popularity}%</span>
    </div>
    <div class="similar-names">
      <h4>${translations[currentLanguage]["similar-names"]}</h4>
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
    ${views > 0 ? `<div class="view-count">${views} ${translations[currentLanguage]["name-card-views"]}</div>` : ""}
  </div>
`
}
function showNameDetails(name) {
  console.log("Modal açılır:", name.name)
  viewCounts[name.id] = (viewCounts[name.id] || 0) + 1
  localStorage.setItem("viewCounts", JSON.stringify(viewCounts))
  updateTotalViews()
  const modalOverlay = document.getElementById("modalOverlay")
  const modalBody = document.getElementById("modalBody")
  if (!modalOverlay || !modalBody) return
  const isFavorite = favorites.includes(name.id)
  modalBody.innerHTML = `
  <div class="name-details-modal">
    <div class="name-header">
      <h2>${name.name}</h2>
      <button class="pronunciation-btn" onclick="pronounceName('${name.name}')" title="${translations[currentLanguage]["listen"]}">
        <i class="fas fa-volume-up"></i>
        <span>${translations[currentLanguage]["pronunciation"]}</span>
      </button>
    </div>
    
    <div class="detail-section">
      <h3>${translations[currentLanguage]["meaning"]}</h3>
      <p>${name.meaning}</p>
    </div>
    
    <div class="detail-section">
      <h3>${translations[currentLanguage]["origin"]}</h3>
      <p>${getTranslatedOrigin(name.origin)}</p>
    </div>
    
    <div class="detail-section">
      <h3>${translations[currentLanguage]["popularity"]}</h3>
      <p>⭐ ${name.popularity}%</p>
    </div>

    <div class="detail-section">
      <h3>${translations[currentLanguage]["similar-names"]}</h3>
      <div class="similar-list">
        ${name.similar.map((similar) => `<span class="similar-name" onclick="searchByName('${similar}'); closeModal();">${similar}</span>`).join("")}
      </div>
    </div>
    
    <div class="name-actions">
      <button class="action-btn favorite-btn ${isFavorite ? "active" : ""}" onclick="toggleFavorite(${name.id})">
        <i class="fas fa-heart"></i> ${isFavorite ? translations[currentLanguage]["remove-from-favorites"] : translations[currentLanguage]["add-to-favorites"]}
      </button>
      <button class="action-btn card-generator-btn" onclick="openCardGenerator('${name.name}', '${name.meaning}', '${name.gender}', '${name.origin}')">
        <i class="fas fa-image"></i> ${translations[currentLanguage]["create-card"]}
      </button>
    </div>
  </div>
`
  modalOverlay.classList.add("show")
  document.body.style.overflow = "hidden"
  const modal = modalOverlay.querySelector(".modal")
  modal.classList.add("modal-slide-in")
}
function openCardGenerator(name, meaning, gender, origin) {
  const cardModal = document.createElement("div")
  cardModal.className = "modal-overlay card-generator-modal"
  cardModal.id = "cardGeneratorModal"
  cardModal.innerHTML = `
  <div class="modal card-generator-modal-content" style="max-width: 900px;">
    <div class="modal-header">
      <h3>${translations[currentLanguage]["card-generator-title"]}</h3>
      <button class="modal-close" onclick="closeCardGenerator()">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="modal-body">
      <div class="card-generator-container">
        <div class="theme-selector">
          <h4>${translations[currentLanguage]["select-theme"]}</h4>
          <div class="theme-options" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin-bottom: 30px;">
            <button class="theme-btn modern-theme-btn active" data-theme="classic" onclick="selectTheme('classic')">
              <div class="theme-icon">🎨</div>
              <span>${translations[currentLanguage]["theme-classic"]}</span>
            </button>
            <button class="theme-btn modern-theme-btn" data-theme="modern" onclick="selectTheme('modern')">
              <div class="theme-icon">🚀</div>
              <span>${translations[currentLanguage]["theme-modern"]}</span>
            </button>
            <button class="theme-btn modern-theme-btn" data-theme="elegant" onclick="selectTheme('elegant')">
              <div class="theme-icon">💎</div>
              <span>${translations[currentLanguage]["theme-elegant"]}</span>
            </button>
            <button class="theme-btn modern-theme-btn" data-theme="nature" onclick="selectTheme('nature')">
              <div class="theme-icon">🌿</div>
              <span>${translations[currentLanguage]["theme-nature"]}</span>
            </button>
            <button class="theme-btn modern-theme-btn" data-theme="royal" onclick="selectTheme('royal')">
              <div class="theme-icon">👑</div>
              <span>${translations[currentLanguage]["theme-royal"]}</span>
            </button>
            <button class="theme-btn modern-theme-btn" data-theme="sunset" onclick="selectTheme('sunset')">
              <div class="theme-icon">🌅</div>
              <span>${translations[currentLanguage]["theme-sunset"]}</span>
            </button>
            <button class="theme-btn modern-theme-btn" data-theme="ocean" onclick="selectTheme('ocean')">
              <div class="theme-icon">🌊</div>
              <span>${translations[currentLanguage]["theme-ocean"]}</span>
            </button>
            <button class="theme-btn modern-theme-btn" data-theme="galaxy" onclick="selectTheme('galaxy')">
              <div class="theme-icon">🌌</div>
              <span>${translations[currentLanguage]["theme-galaxy"]}</span>
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
            <span>${translations[currentLanguage]["download-card"]}</span>
          </button>
          <button class="modern-share-btn" onclick="shareCard()">
            <i class="fas fa-share-alt"></i>
            <span>${translations[currentLanguage]["share-card"]}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
`
  document.body.appendChild(cardModal)
  cardModal.classList.add("show")
  window.currentCardData = { name, meaning, gender, origin }
  generateCardPreview("classic")
}
function selectTheme(theme) {
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.classList.remove("active")
  })
  const selectedBtn = document.querySelector(`[data-theme="${theme}"]`)
  if (selectedBtn) {
    selectedBtn.classList.add("active")
  }
  generateCardPreview(theme)
}
function generateCardPreview(theme) {
  const { name, meaning, gender, origin } = window.currentCardData
  const preview = document.getElementById("nameCardPreview")
  window.selectedTheme = theme
  const genderText = getTranslatedGender(gender)
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
    royal: { background: "linear-gradient(135deg,#8e44ad 0%,#3498db 100%)", textColor: "#fff", accentColor: "#f1c40f" },
    sunset: {
      background: "linear-gradient(135deg,#ff7e5f 0%,#feb47b 100%)",
      textColor: "#2c3e50",
      accentColor: "#e74c3c",
    },
    ocean: { background: "linear-gradient(135deg,#2980b9 0%,#6dd5fa 100%)", textColor: "#fff", accentColor: "#1abc9c" },
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
      <span style="background:rgba(255,255,255,.2);padding:6px 14px;border-radius:20px">${getTranslatedOrigin(origin)}</span>
    </div>
    <small style="position:absolute;bottom:15px;right:20px;opacity:.6;font-size:.8rem;">🇦🇿 azerbaycanadlari.az</small>
  </div>
`
}
async function downloadCard() {
  const card = document.getElementById("generatedCard")
  if (!card) {
    showToast(translations[currentLanguage]["card-not-found"], "error")
    return
  }
  try {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = 800
    canvas.height = 600
    const { name, meaning, gender, origin } = window.currentCardData
    const genderText = getTranslatedGender(gender)
    const selectedTheme = window.selectedTheme || "classic"
    const themes = {
      classic: { start: "#667eea", end: "#764ba2", accent: "#ffd700", text: "#fff" },
      modern: { start: "#00c6ff", end: "#0072ff", accent: "#ff6b6b", text: "#fff" },
      elegant: { start: "#2c3e50", end: "#4ca1af", accent: "#e74c3c", text: "#ecf0f1" },
      nature: { start: "#56ab2f", end: "#a8e063", accent: "#ff6b6b", text: "#1b3815" },
      royal: { start: "#8e44ad", end: "#3498db", accent: "#f1c40f", text: "#fff" },
      sunset: { start: "#ff7e5f", end: "#feb47b", accent: "#e74c3c", text: "#2c3e50" },
      ocean: { start: "#2980b9", end: "#6dd5fa", accent: "#1abc9c", text: "#fff" },
      galaxy: { start: "#0f2027", end: "#203a43", accent: "#9b59b6", text: "#ecf0f1" },
    }
    const theme = themes[selectedTheme]
    const gradient = ctx.createLinearGradient(0, 0, 800, 600)
    gradient.addColorStop(0, theme.start)
    gradient.addColorStop(1, theme.end)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 800, 600)
    ctx.fillStyle = theme.accent
    ctx.font = "bold 72px Arial"
    ctx.textAlign = "center"
    ctx.fillText(name, 400, 200)
    ctx.fillStyle = theme.text
    ctx.font = "italic 32px Arial"
    ctx.fillText(`"${meaning}"`, 400, 260)
    ctx.font = "24px Arial"
    ctx.fillText(`${genderText} • ${getTranslatedOrigin(origin)}`, 400, 320)
    ctx.font = "18px Arial"
    ctx.fillStyle = "rgba(255,255,255,0.6)"
    ctx.textAlign = "right"
    ctx.fillText("🇦🇿 azerbaycanadlari.az", 760, 560)
    canvas.toBlob((blob) => {
      const link = document.createElement("a")
      link.download = `${name}-${selectedTheme}-kart.png`
      link.href = URL.createObjectURL(blob)
      link.click()
      URL.revokeObjectURL(link.href)
      showToast(translations[currentLanguage]["card-download-error"], "success")
    })
  } catch (error) {
    console.error("Kart yükləmə xətası:", error)
    showToast(translations[currentLanguage]["card-download-error"], "error")
  }
}
async function shareCard() {
  const { name, meaning, gender, origin } = window.currentCardData
  const genderText = getTranslatedGender(gender)
  const shareText = `${name} - ${meaning}\n${genderText} • ${getTranslatedOrigin(origin)}\n\n🇦🇿 azerbaycanadlari.az`
  const shareUrl = `${window.location.origin}?name=${encodeURIComponent(name)}`
  try {
    if (navigator.share) {
      await navigator.share({
        title: `${name} - ${translations[currentLanguage]["site-title"]}`,
        text: shareText,
        url: shareUrl,
      })
      showToast(translations[currentLanguage]["card-shared"], "success")
    } else {
      await navigator.clipboard.writeText(shareText + "\n" + shareUrl)
      showToast(translations[currentLanguage]["card-info-copied"], "success")
    }
  } catch (error) {
    console.error("Paylaşım xətası:", error)
    try {
      await navigator.clipboard.writeText(shareText + "\n" + shareUrl)
      showToast(translations[currentLanguage]["name-info-copied"], "info")
    } catch (e) {
      showToast(translations[currentLanguage]["share-not-possible"], "error")
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
function debounce(func, delay) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), delay)
  }
}
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
function filterByLetter(letter) {
  console.log("Hərf filtri:", letter)
  document.querySelectorAll(".alphabet-btn").forEach((btn) => btn.classList.remove("active"))
  const clickedBtn = Array.from(document.querySelectorAll(".alphabet-btn")).find((btn) => btn.textContent === letter)
  if (clickedBtn) {
    clickedBtn.classList.add("active")
  }
  const filteredNames = namesData.filter((name) => name.name.toUpperCase().startsWith(letter.toUpperCase()))
  console.log("Filtrlənmiş adlar:", filteredNames.length)
  const alphabetNames = document.getElementById("alphabetNames")
  if (alphabetNames) {
    alphabetNames.innerHTML = filteredNames.map((name) => createNameCard(name)).join("")
  }
}
function handleSearch() {
  console.log("Axtarış işləyir...")
  const searchInput = document.getElementById("searchInput")
  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : ""
  const genderRadios = document.querySelectorAll('input[name="gender"]')
  let genderFilter = "all"
  genderRadios.forEach((radio) => {
    if (radio.checked) {
      genderFilter = radio.value
    }
  })
  const originFilter = document.getElementById("originFilter")
  const originValue = originFilter ? originFilter.value : "all"
  let filteredNames = [...namesData]
  if (searchTerm) {
    filteredNames = filteredNames.filter(
      (name) => name.name.toLowerCase().includes(searchTerm) || name.meaning.toLowerCase().includes(searchTerm),
    )
  }
  if (genderFilter !== "all") {
    filteredNames = filteredNames.filter((name) => name.gender === genderFilter)
  }
  if (originValue !== "all") {
    filteredNames = filteredNames.filter((name) => name.origin === originValue)
  }
  console.log("Filtrlənmiş nəticələr:", filteredNames.length)
  displayNames(filteredNames)
}
function handleFilter(e) {
  console.log("Filter düyməsi basıldı:", e.target.textContent)
  document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"))
  e.target.classList.add("active")
  const filterValue = e.target.getAttribute("data-filter")
  console.log("Filter dəyəri:", filterValue)
  let filteredNames = [...namesData]
  if (filterValue !== "all") {
    filteredNames = filteredNames.filter((name) => name.gender === filterValue)
  }
  console.log("Filtrlənmiş adlar:", filteredNames.length)
  displayNames(filteredNames)
}
function handleTabChange(e) {
  console.log("Tab dəyişdirilir:", e.target.textContent)
  document.querySelectorAll(".nav-tab").forEach((tab) => tab.classList.remove("active"))
  document.querySelectorAll(".tab-pane").forEach((pane) => pane.classList.remove("active"))
  e.target.classList.add("active")
  const tabId = e.target.getAttribute("data-tab")
  const tabPane = document.getElementById(tabId)
  if (tabPane) {
    tabPane.classList.add("active")
  }
  if (tabId === "home") {
    displayNames(namesData)
  } else if (tabId === "alphabet") {
    const activeAlphabetBtn = document.querySelector(".alphabet-btn.active")
    if (activeAlphabetBtn) {
      filterByLetter(activeAlphabetBtn.textContent)
    } else {
      displayNames(namesData)
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
  }
}
function handleSort() {
  const sortBy = document.getElementById("sortSelect").value
  const sortedNames = [...namesData]
  if (sortBy === "name") {
    sortedNames.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy === "popularity") {
    sortedNames.sort((a, b) => b.popularity - a.popularity)
  } else if (sortBy === "views") {
    sortedNames.sort((a, b) => (viewCounts[b.id] || 0) - (viewCounts[a.id] || 0))
  }
  displayNames(sortedNames)
}
function displayPopularNames() {
  console.log("Populyar adlar göstərilir...")
  const popularNames = document.getElementById("popularNames")
  if (!popularNames) {
    console.log("popularNames elementi tapılmadı")
    return
  }
  const sortedNames = [...namesData].sort((a, b) => {
    const aViews = viewCounts[a.id] || 0
    const bViews = viewCounts[b.id] || 0
    if (aViews === bViews) {
      return b.popularity - a.popularity
    }
    return bViews - aViews
  })
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
function toggleFavorite(nameId) {
  if (!trackFeatureUsage("addFavorite")) {
    return
  }
  const index = favorites.indexOf(nameId)
  if (index > -1) {
    favorites.splice(index, 1)
    showToast(translations[currentLanguage]["favorite-removed"], "info")
  } else {
    favorites.push(nameId)
    showToast(translations[currentLanguage]["favorite-added"], "success")
    createHeartAnimation()
  }
  localStorage.setItem("favorites", JSON.stringify(favorites))
  updateFavoritesCount()
  const btn = event.target.closest(".favorite-btn")
  if (btn) {
    btn.classList.toggle("active")
  }
}
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
function clearFavorites() {
  if (confirm(translations[currentLanguage]["confirm-clear-favorites"])) {
    favorites.length = 0
    localStorage.setItem("favorites", JSON.stringify(favorites))
    updateFavoritesCount()
    displayFavorites()
    showToast(translations[currentLanguage]["all-favorites-cleared"], "info")
  }
}
function toggleFavoritesTab() {
  document.querySelectorAll(".nav-tab").forEach((tab) => tab.classList.remove("active"))
  document.querySelectorAll(".tab-pane").forEach((pane) => pane.classList.remove("active"))
  document.querySelector('[data-tab="favorites"]').classList.add("active")
  document.getElementById("favorites").classList.add("active")
  displayFavorites()
}
function searchByName(name) {
  const searchInput = document.getElementById("searchInput")
  if (searchInput) {
    searchInput.value = name
    handleSearch()
  }
}
function shareNameURL(name) {
  const url = `${window.location.origin}?name=${encodeURIComponent(name)}`
  if (navigator.share) {
    navigator.share({
      title: `${name} - ${translations[currentLanguage]["site-title"]}`,
      text: `${name} ${translations[currentLanguage]["meaning"]}`,
      url: url,
    })
  } else {
    navigator.clipboard.writeText(url).then(() => {
      showToast(translations[currentLanguage]["link-copied"], "success")
    })
  }
}
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
    showToast(translations[currentLanguage]["pronunciation-not-supported"], "error")
  }
}
function setupSuggestTab() {
  const suggestForm = document.getElementById("suggestForm")
  if (!suggestForm) return
  console.log("Tövsiyə sistemi qurulur...")
  suggestForm.innerHTML = `
  <div class="suggest-wizard">
    <div class="wizard-step active" id="step1">
      <h3>${translations[currentLanguage]["suggest-q1"]}</h3>
      <div class="gender-options">
        <button class="wizard-btn" onclick="selectGender('qız')">
          <i class="fas fa-female"></i>
          <span>${translations[currentLanguage]["girl-name"]}</span>
        </button>
        <button class="wizard-btn" onclick="selectGender('oğlan')">
          <i class="fas fa-male"></i>
          <span>${translations[currentLanguage]["boy-name"]}</span>
        </button>
      </div>
    </div>

    <div class="wizard-step" id="step2">
      <h3>${translations[currentLanguage]["suggest-q2"]}</h3>
      <div class="character-options">
        <button class="wizard-btn" onclick="selectCharacter('lider')">
          <i class="fas fa-crown"></i>
          <span>${translations[currentLanguage]["character-leader"]}</span>
        </button>
        <button class="wizard-btn" onclick="selectCharacter('dostcanlı')">
          <i class="fas fa-heart"></i>
          <span>${translations[currentLanguage]["character-friendly"]}</span>
        </button>
        <button class="wizard-btn" onclick="selectCharacter('yaradıcı')">
          <i class="fas fa-palette"></i>
          <span>${translations[currentLanguage]["character-creative"]}</span>
        </button>
        <button class="wizard-btn" onclick="selectCharacter('güclü')">
          <i class="fas fa-fist-raised"></i>
          <span>${translations[currentLanguage]["character-strong"]}</span>
        </button>
        <button class="wizard-btn" onclick="selectCharacter('zərif')">
          <i class="fas fa-feather"></i>
          <span>${translations[currentLanguage]["character-delicate"]}</span>
        </button>
        <button class="wizard-btn" onclick="selectCharacter('müdrik')">
          <i class="fas fa-brain"></i>
          <span>${translations[currentLanguage]["character-wise"]}</span>
        </button>
      </div>
    </div>

    <div class="wizard-step" id="step3">
      <h3>${translations[currentLanguage]["suggest-q3"]}</h3>
      <div class="origin-options">
        <button class="wizard-btn" onclick="selectOrigin('azərbaycan')">
          <i class="fas fa-flag"></i>
          <span>${translations[currentLanguage]["origin-azerbaijani"]}</span>
        </button>
        <button class="wizard-btn" onclick="selectOrigin('türk')">
          <i class="fas fa-star-and-crescent"></i>
          <span>${translations[currentLanguage]["origin-turkish"]}</span>
        </button>
        <button class="wizard-btn" onclick="selectOrigin('ərəb')">
          <i class="fas fa-mosque"></i>
          <span>${translations[currentLanguage]["origin-arabic"]}</span>
        </button>
        <button class="wizard-btn" onclick="selectOrigin('fars')">
          <i class="fas fa-gem"></i>
          <span>${translations[currentLanguage]["origin-persian"]}</span>
        </button>
        <button class="wizard-btn" onclick="selectOrigin('heç biri')">
          <i class="fas fa-globe"></i>
          <span>${translations[currentLanguage]["origin-none"]}</span>
        </button>
      </div>
    </div>

    <div class="wizard-step" id="step4">
      <h3>${translations[currentLanguage]["suggest-q4"]}</h3>
      <div id="suggestedResults"></div>
      <button class="wizard-btn restart-btn" onclick="restartWizard()">
        <i class="fas fa-redo"></i>
        <span>${translations[currentLanguage]["restart-quiz"]}</span>
      </button>
    </div>
  </div>
`
}
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
  if (wizardData.gender) {
    filteredNames = filteredNames.filter((name) => name.gender === wizardData.gender)
  }
  if (wizardData.origin && wizardData.origin !== "heç biri") {
    filteredNames = filteredNames.filter((name) => name.origin === wizardData.origin)
  }
  if (wizardData.character) {
    const characterKeywords = {
      lider: ["hökmdar", "xan", "əmir", "şah", "böyük", "uca", "leader", "ruler", "emir", "shah", "great", "exalted"],
      dostcanlı: ["dost", "sevimli", "məhəbbət", "könül", "ürək", "friendly", "beloved", "love", "heart"],
      yaradıcı: ["sənət", "gözəl", "nəğmə", "şair", "yaradıcı", "art", "beautiful", "song", "poet", "creative"],
      güclü: ["güclü", "qəhrəman", "igid", "döyüşçü", "qüdrətli", "strong", "hero", "brave", "warrior", "powerful"],
      zərif: ["zərif", "nazik", "gül", "çiçək", "gözəl", "delicate", "thin", "rose", "flower", "beautiful"],
      müdrik: ["bilik", "hikmət", "müdrik", "ağıllı", "elm", "knowledge", "wisdom", "wise", "intelligent", "science"],
    }
    const keywords = characterKeywords[wizardData.character] || []
    if (keywords.length > 0) {
      filteredNames = filteredNames.filter((name) =>
        keywords.some((keyword) => name.meaning.toLowerCase().includes(keyword.toLowerCase())),
      )
    }
  }
  const suggestions = filteredNames.sort(() => 0.5 - Math.random()).slice(0, 6)
  const resultsContainer = document.getElementById("suggestedResults")
  if (suggestions.length > 0) {
    resultsContainer.innerHTML = `
    <div class="suggested-names-grid">
      ${suggestions
        .map(
          (
            name,
          ) => `<div class="suggested-name-card" onclick="showNameDetails(${JSON.stringify(name).replace(/"/g, "&quot;")})">
          <h4>${name.name}</h4>
          <p>${name.meaning}</p>
          <div class="name-details">
            <span>${getTranslatedGender(name.gender)}</span>
            <span>${getTranslatedOrigin(name.origin)}</span>
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
      <p>${translations[currentLanguage]["no-suggest-results-p1"]}</p>
      <p>${translations[currentLanguage]["no-suggest-results-p2"]}</p>
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
      <h4>${translations[currentLanguage]["question"]} ${currentQuestion + 1}/5</h4>
      <h3>"${name.name}" ${translations[currentLanguage]["meaning"]}?</h3>
      <div class="quiz-options">
        ${allAnswers
          .map(
            (answer) => `
          <button class="quiz-option" onclick="selectAnswer('${answer}','${name.meaning}')">${answer}</button>
        `,
          )
          .join("")}
      </div>
      <div class="quiz-progress">
        <div class="quiz-progress-bar" style="width:${((currentQuestion + 1) / randomNames.length) * 100}%"></div>
      </div>
    </div>
  `
  }

  window.selectAnswer = (selected, correct) => {
    if (selected === correct) {
      score++
      showToast(translations[currentLanguage]["correct-answer"], "success")
    } else {
      showToast(translations[currentLanguage]["wrong-answer"], "error")
    }

    currentQuestion++
    setTimeout(showQuestion, 1000)
  }

  function showQuizResult() {
    const percentage = Math.round((score / randomNames.length) * 100)
    let message = ""

    if (percentage >= 80) {
      message = translations[currentLanguage]["quiz-result-expert"]
    } else if (percentage >= 60) {
      message = translations[currentLanguage]["quiz-result-good"]
    } else if (percentage >= 40) {
      message = translations[currentLanguage]["quiz-result-average"]
    } else {
      message = translations[currentLanguage]["quiz-result-poor"]
    }

    quizContainer.innerHTML = `
    <div class="quiz-result">
      <h3>${translations[currentLanguage]["quiz-result-title"]}</h3>
      <div class="quiz-score">${score}/${randomNames.length}</div>
      <div class="quiz-percentage">${percentage}%</div>
      <p>${message}</p>
      <div class="quiz-actions">
        <button class="submit-btn" onclick="setupQuiz()">
          <i class="fas fa-redo"></i> ${translations[currentLanguage]["restart-quiz"]}
        </button>
        <button class="submit-btn" onclick="shareQuizResult(${percentage})">
          <i class="fas fa-share"></i> ${translations[currentLanguage]["share-result"]}
        </button>
      </div>
    </div>
  `
  }

  showQuestion()
}

// Share Quiz Result
function shareQuizResult(percentage) {
  const text = `${translations[currentLanguage]["quiz-share-text-prefix"]} ${percentage}${translations[currentLanguage]["quiz-share-text-suffix"]}`

  if (navigator.share) {
    navigator.share({
      title: `${translations[currentLanguage]["site-title"]} ${translations[currentLanguage]["quiz-result-title"]}`,
      text: text,
      url: window.location.href,
    })
  } else {
    navigator.clipboard.writeText(text + " " + window.location.href).then(() => {
      showToast(translations[currentLanguage]["result-copied"], "success")
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
      showToast(translations[currentLanguage]["suggestion-sent"], "success")
    })
  }
}

// URL parametrini yoxla və adı aç
function checkURLParameter() {
  const urlParams = new URLSearchParams(window.location.search)
  const nameParam = urlParams.get("name")
  if (nameParam) {
    const foundName = namesData.find((name) => name.name.toLowerCase() === nameParam.toLowerCase())
    if (foundName) {
      setTimeout(() => {
        showNameDetails(foundName)
      }, 1000)
    }
  }
}
