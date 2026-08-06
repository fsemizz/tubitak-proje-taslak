import type { GameInfo } from '../types/game';

export const GAMES_LIST: GameInfo[] = [
  {
    id: 'algorithm-sorting',
    title: 'Algoritma Sıralama',
    shortDescription: 'Günlük hayat adımlarını doğru sıraya dizerek olayların mantığını keşfet!',
    description: 'Bilgisayarsız kodlamanın en temel adımı algoritma kurmaktır. Karışık verilen kartları doğru kronolojik sıraya koyarak adımları tamamla.',
    outcomes: [
      'Adım adım düşünme becerisi kazanır.',
      'Neden-sonuç ilişkisi kurabilir.',
      'Sıralama ve kronolojik düzen mantığını kavrar.',
    ],
    iconName: 'ListOrdered',
    color: 'from-purple-500 to-indigo-600',
    badge: 'Temel Kodlama',
    recommendedGrade: 'Anasınıfı & 1. Sınıf',
    totalLevels: 5,
  },
  {
    id: 'pattern-completion',
    title: 'Örüntü Tamamlama',
    shortDescription: 'Tekrar eden dizileri incele, kuralı bul ve eksik sembolü tamamla!',
    description: 'Kodlamada döngülerin ve dizilerin temeli örüntülerdir. Verilen şekil, renk ve sembol dizisindeki düzeni fark et ve eksik parçayı seç.',
    outcomes: [
      'Örüntü ve kural tanıma yeteneğini geliştirir.',
      'Görsel algı ve odaklanma süresini artırır.',
      'Döngü mantığına hazırlık yapar.',
    ],
    iconName: 'Shapes',
    color: 'from-pink-500 to-rose-600',
    badge: 'Mantık & Diziler',
    recommendedGrade: 'Anasınıfı & 1. Sınıf',
    totalLevels: 5,
  },
  {
    id: 'debug-detective',
    title: 'Hata Dedektifi (Debug)',
    shortDescription: 'Yanlış yazılmış algoritmadaki hatayı bul ve doğru adımla değiştir!',
    description: 'Yazılımcıların en çok yaptığı iş hataları ayıklamaktır (debugging). Hazırlanmış tarif veya plandaki hatayı tespit et ve düzelt.',
    outcomes: [
      'Eleştirel düşünme ve kontrol etme bilinci kazanır.',
      'Hataları tespit edip düzeltme (debugging) yapabilir.',
      'Problem çözme özgüvenini artırır.',
    ],
    iconName: 'Bug',
    color: 'from-amber-500 to-orange-600',
    badge: 'Hata Ayıklama',
    recommendedGrade: '1. ve 2. Sınıf',
    totalLevels: 5,
  },
  {
    id: 'loop-builder',
    title: 'Döngü Ustası',
    shortDescription: 'Tekrar eden adımları döngü kutularına topla, kodunu kısalt!',
    description: 'Sürekli tekrar eden komutları yazmak yerine "Döngü" kullanırız. Örneğin 4 defa "İleri" gitmek yerine "4x İleri" bloğunu seç.',
    outcomes: [
      'Tekrar eden durumları fark eder.',
      'Kod optimizasyonu ve döngü (loop) kavramını öğrenir.',
      'Verimli kod yazma alışkanlığı kazanır.',
    ],
    iconName: 'Repeat',
    color: 'from-emerald-500 to-teal-600',
    badge: 'Döngü Mantığı',
    recommendedGrade: '1. ve 2. Sınıf',
    totalLevels: 5,
  },
  {
    id: 'condition-quest',
    title: 'Koşul Macerası',
    shortDescription: 'Eğer hava yağmurluysa şemsiye al! Karar bloklarını doğru eşleştir!',
    description: 'Bilgisayarlar koşullara göre karar verir. "Eğer ... ise ... yap, Değilse ... yap" mantığını eğlenceli durumlarla çöz.',
    outcomes: [
      'Mantıksal çıkarım ve koşullu düşünme (If-Else) sağlar.',
      'Seçenekleri değerlendirme ve karar verme becerisini güçlendirir.',
      'Algoritmik dallanma yapısını anlar.',
    ],
    iconName: 'GitFork',
    color: 'from-blue-500 to-cyan-600',
    badge: 'Koşullu Kodlama',
    recommendedGrade: '1. ve 2. Sınıf',
    totalLevels: 5,
  },
];

// Seviye Verileri
export const GAME_LEVELS = {
  'algorithm-sorting': [
    {
      levelNumber: 1,
      title: 'Diş Fırçalama Algoritması',
      instructions: 'Diş fırçalama adımlarını ilk adımdan son adıma doğru sıraya koy.',
      hint: 'Fırçalamadan önce diş macununu fırçaya sürmelisin!',
      config: {
        targetOrder: [
          { id: 'step-1', text: 'Diş fırçası ve macunu al', emoji: '🪥', correctPosition: 1 },
          { id: 'step-2', text: 'Macunu fırçaya sür', emoji: '🧴', correctPosition: 2 },
          { id: 'step-3', text: 'Dişlerini dairesel hareketlerle fırçala', emoji: '😁', correctPosition: 3 },
          { id: 'step-4', text: 'Ağzını suyla çalkala', emoji: '🚰', correctPosition: 4 },
        ],
      },
    },
    {
      levelNumber: 2,
      title: 'Okula Hazırlanma',
      instructions: 'Sabah kalkıp okula gitme adımlarını sıraya diz.',
      hint: 'Ayakkabı giymeden önce çorap giymelisin.',
      config: {
        targetOrder: [
          { id: 'step-1', text: 'Yataktan kalk ve yüzünü yıka', emoji: '⏰', correctPosition: 1 },
          { id: 'step-2', text: 'Okul kıyafetlerini ve çorabını giy', emoji: '👕', correctPosition: 2 },
          { id: 'step-3', text: 'Kahvaltını yap', emoji: '🍳', correctPosition: 3 },
          { id: 'step-4', text: 'Çantana ders kitaplarını koy', emoji: '🎒', correctPosition: 4 },
          { id: 'step-5', text: 'Ayakkabılarını giyip yola çık', emoji: '👟', correctPosition: 5 },
        ],
      },
    },
    {
      levelNumber: 3,
      title: 'Tohum Ekme & Çiçek Büyütme',
      instructions: 'Bir saksıya çiçek ekip büyütme algoritmasını oluştur.',
      hint: 'Tohumu toprağa koyduktan sonra can suyu vermelisin.',
      config: {
        targetOrder: [
          { id: 'step-1', text: 'Saksıya toprak koy', emoji: '🪴', correctPosition: 1 },
          { id: 'step-2', text: 'Toprağa tohumu yerleştir', emoji: '🌱', correctPosition: 2 },
          { id: 'step-3', text: 'Tohumun üzerine can suyu dök', emoji: '💧', correctPosition: 3 },
          { id: 'step-4', text: 'Saksıyı güneş alan yere koy', emoji: '☀️', correctPosition: 4 },
          { id: 'step-5', text: 'Çiçeğin açmasını bekle', emoji: '🌸', correctPosition: 5 },
        ],
      },
    },
    {
      levelNumber: 4,
      title: 'Lezzetli Sandviç Yapımı',
      instructions: 'Kendi sandviçini hazırlama adımlarını sırala.',
      hint: 'Ekmeği dilimlemeden arasına malzeme koyamazsın!',
      config: {
        targetOrder: [
          { id: 'step-1', text: 'Ekmek dilimlerini tabağa koy', emoji: '🍞', correctPosition: 1 },
          { id: 'step-2', text: 'Peynir ve domates dilimlerini ekle', emoji: '🧀', correctPosition: 2 },
          { id: 'step-3', text: 'Diğer ekmek dilimini üzerine kapat', emoji: '🥪', correctPosition: 3 },
          { id: 'step-4', text: 'Sandviçi afiyetle ye!', emoji: '😋', correctPosition: 4 },
        ],
      },
    },
    {
      levelNumber: 5,
      title: 'Resim Çizme ve Boyama',
      instructions: 'Harika bir resim çalışması algoritmasını tamamla.',
      hint: 'Resmi çizmeden önce boyamaya başlayamazsın.',
      config: {
        targetOrder: [
          { id: 'step-1', text: 'Boş bir kâğıt ve kurşun kalem al', emoji: '📄', correctPosition: 1 },
          { id: 'step-2', text: 'Kurşun kalemle taslak resmi çiz', emoji: '✏️', correctPosition: 2 },
          { id: 'step-3', text: 'Boya kalemleriyle içini renklendir', emoji: '🎨', correctPosition: 3 },
          { id: 'step-4', text: 'Resmini panoya as', emoji: '🖼️', correctPosition: 4 },
        ],
      },
    },
  ],

  'pattern-completion': [
    {
      levelNumber: 1,
      title: 'Renkli Balon Örüntüsü',
      instructions: 'Dizideki renk tekrarına bak ve soru işareti (?) yerine gelecek balonu seç.',
      hint: 'Kırmızı - Mavi - Kırmızı - Mavi... Sırada ne var?',
      config: {
        sequence: [
          { type: 'image', value: '🔴', label: 'Kırmızı' },
          { type: 'image', value: '🔵', label: 'Mavi' },
          { type: 'image', value: '🔴', label: 'Kırmızı' },
          { type: 'image', value: '🔵', label: 'Mavi' },
          { type: 'target', value: '?', label: 'Eksik Parça' },
        ],
        options: [
          { id: 'opt-1', value: '🔴', label: 'Kırmızı', isCorrect: true },
          { id: 'opt-2', value: '🔵', label: 'Mavi', isCorrect: false },
          { id: 'opt-3', value: '🟡', label: 'Sarı', isCorrect: false },
        ],
      },
    },
    {
      levelNumber: 2,
      title: 'Geometrik Şekil Dizisi',
      instructions: 'Şekillerin diziliş kuralını çöz ve eksik olanı bul.',
      hint: 'Kare - Üçgen - Daire - Kare - Üçgen - ?',
      config: {
        sequence: [
          { type: 'image', value: '🟥', label: 'Kare' },
          { type: 'image', value: '🔺', label: 'Üçgen' },
          { type: 'image', value: '🟡', label: 'Daire' },
          { type: 'image', value: '🟥', label: 'Kare' },
          { type: 'image', value: '🔺', label: 'Üçgen' },
          { type: 'target', value: '?', label: 'Eksik' },
        ],
        options: [
          { id: 'opt-1', value: '🟥', label: 'Kare', isCorrect: false },
          { id: 'opt-2', value: '🟡', label: 'Daire', isCorrect: true },
          { id: 'opt-3', value: '⭐', label: 'Yıldız', isCorrect: false },
        ],
      },
    },
    {
      levelNumber: 3,
      title: 'Meyve Sepeti Örüntüsü',
      instructions: 'İkili meyve dizisindeki kuralı bul.',
      hint: 'Elma - Elma - Muz - Elma - Elma - ?',
      config: {
        sequence: [
          { type: 'image', value: '🍎', label: 'Elma' },
          { type: 'image', value: '🍎', label: 'Elma' },
          { type: 'image', value: '🍌', label: 'Muz' },
          { type: 'image', value: '🍎', label: 'Elma' },
          { type: 'image', value: '🍎', label: 'Elma' },
          { type: 'target', value: '?', label: 'Eksik' },
        ],
        options: [
          { id: 'opt-1', value: '🍎', label: 'Elma', isCorrect: false },
          { id: 'opt-2', value: '🍌', label: 'Muz', isCorrect: true },
          { id: 'opt-3', value: '🍇', label: 'Üzüm', isCorrect: false },
        ],
      },
    },
    {
      levelNumber: 4,
      title: 'Gece ve Gündüz Örüntüsü',
      instructions: 'Görsellerin tekrarlanma mantığına göre boşluğu doldur.',
      hint: 'Güneş - Bulut - Yıldız - Güneş - Bulut - ?',
      config: {
        sequence: [
          { type: 'image', value: '☀️', label: 'Güneş' },
          { type: 'image', value: '☁️', label: 'Bulut' },
          { type: 'image', value: '⭐', label: 'Yıldız' },
          { type: 'image', value: '☀️', label: 'Güneş' },
          { type: 'image', value: '☁️', label: 'Bulut' },
          { type: 'target', value: '?', label: 'Eksik' },
        ],
        options: [
          { id: 'opt-1', value: '⭐', label: 'Yıldız', isCorrect: true },
          { id: 'opt-2', value: '🌧️', label: 'Yağmur', isCorrect: false },
          { id: 'opt-3', value: '☀️', label: 'Güneş', isCorrect: false },
        ],
      },
    },
    {
      levelNumber: 5,
      title: 'Hayvan Dostlar Dizisi',
      instructions: 'Karmaşık ikili hayvan dizisini incele.',
      hint: 'Kedi - Köpek - Köpek - Kedi - Köpek - ?',
      config: {
        sequence: [
          { type: 'image', value: '🐱', label: 'Kedi' },
          { type: 'image', value: '🐶', label: 'Köpek' },
          { type: 'image', value: '🐶', label: 'Köpek' },
          { type: 'image', value: '🐱', label: 'Kedi' },
          { type: 'image', value: '🐶', label: 'Köpek' },
          { type: 'target', value: '?', label: 'Eksik' },
        ],
        options: [
          { id: 'opt-1', value: '🐱', label: 'Kedi', isCorrect: false },
          { id: 'opt-2', value: '🐶', label: 'Köpek', isCorrect: true },
          { id: 'opt-3', value: '🐰', label: 'Tavşan', isCorrect: false },
        ],
      },
    },
  ],

  'debug-detective': [
    {
      levelNumber: 1,
      title: 'Yanlış Çorap Hatalı Adımı',
      instructions: 'Ayakkabı giyme algoritmasında mantıksız/hatalı adımı bul.',
      hint: 'Çorabı ayakkabının ÜSTÜNE giyemeyiz!',
      config: {
        steps: [
          { id: 's1', text: '1. Çorapları ayağına giy', isBuggy: false, emoji: '🧦' },
          { id: 's2', text: '2. Ayakkabıları giy', isBuggy: false, emoji: '👟' },
          { id: 's3', text: '3. Ayakkabının üstüne tekrar çorap giy', isBuggy: true, emoji: '❌' },
          { id: 's4', text: '4. Bağcıkları bağla', isBuggy: false, emoji: '🎀' },
        ],
        correctionOptions: [
          'Ayakkabının üstüne çorap giyilmez, bu adımı kaldır!',
          'Çorapları hiç giyme!',
        ],
      },
    },
    {
      levelNumber: 2,
      title: 'Islak Elle Elektrik Açma Hatalı Adımı',
      instructions: 'Odayı aydınlatma algoritmasındaki güvenlik hatasını bul.',
      hint: 'Ellerimiz ıslakken elektrik düğmesine dokunmamalıyız!',
      config: {
        steps: [
          { id: 's1', text: '1. Karanlık odaya gir', isBuggy: false, emoji: '🚪' },
          { id: 's2', text: '2. Islak ellerinle hemen lambayı aç', isBuggy: true, emoji: '💦' },
          { id: 's3', text: '3. Çalışma masasına otur', isBuggy: false, emoji: '🪑' },
        ],
        correctionOptions: [
          'Önce ellerini kurula, sonra lambayı aç!',
          'Karanlıkta otur!',
        ],
      },
    },
    {
      levelNumber: 3,
      title: 'Tavşan Yolu Hatalı Yönü',
      instructions: 'Tavşanın havuca ulaşması için yazılan koda bak. Hatalı komut hangisi?',
      hint: 'Tavşan sağa gitmeliydi ama SOLA dönmüş!',
      config: {
        steps: [
          { id: 's1', text: '1. İleri Yürü (2 adım)', isBuggy: false, emoji: '⬆️' },
          { id: 's2', text: '2. Sola Dön', isBuggy: true, emoji: '⬅️' },
          { id: 's3', text: '3. İleri Yürü ve Havucu Al', isBuggy: false, emoji: '🥕' },
        ],
        correctionOptions: [
          'Sola dön yerine Sağa dön olmalı!',
          'Geriye yürü olmalı!',
        ],
      },
    },
    {
      levelNumber: 4,
      title: 'Kek Tarifinde Hata',
      instructions: 'Kek pişirme algoritmasındaki sıralama hatasını bul.',
      hint: 'Keki fırına koymadan önce harcı kalıba dökmelisin!',
      config: {
        steps: [
          { id: 's1', text: '1. Un, şeker ve yumurtayı karıştır', isBuggy: false, emoji: '🥣' },
          { id: 's2', text: '2. Boş fırını 20 dakika çalıştır', isBuggy: false, emoji: '🔥' },
          { id: 's3', text: '3. Keki pişirdikten sonra harcı kek kalıbına dök', isBuggy: true, emoji: '🥧' },
        ],
        correctionOptions: [
          'Harcı önce kalıba döküp sonra fırına koymalısın!',
          'Yumurtaları kabuğuyla koy!',
        ],
      },
    },
    {
      levelNumber: 5,
      title: 'Karakter Rotası Hata Ayıklama',
      instructions: 'Robottan engelden kaçması isteniyor. Hatalı komutu bul.',
      hint: 'Duvara çarpmamak için durması gerekiyordu!',
      config: {
        steps: [
          { id: 's1', text: '1. İleri yürü', isBuggy: false, emoji: '🤖' },
          { id: 's2', text: '2. Önünde duvar varken hızla ileri koş', isBuggy: true, emoji: '🧱' },
          { id: 's3', text: '3. Hedefe ulaş', isBuggy: false, emoji: '🎯' },
        ],
        correctionOptions: [
          'Duvar varken dur ve yönünü değiştir!',
          'Zıpla ve duvara vur!',
        ],
      },
    },
  ],

  'loop-builder': [
    {
      levelNumber: 1,
      title: 'İleri Yürüme Döngüsü',
      instructions: '4 kez "İleri Yürü" komutu vermek yerine Döngü Bloğunu kullan!',
      hint: 'Aynı şeyi 4 defa tekrarlamak yerine 4x Döngü seçilir.',
      config: {
        repeatedAction: { emoji: '⬆️', text: 'İleri Yürü' },
        repeatCount: 4,
        options: [
          { id: 'l1', count: 2, label: '2x İleri Yürü', isCorrect: false },
          { id: 'l2', count: 4, label: '4x İleri Yürü', isCorrect: true },
          { id: 'l3', count: 6, label: '6x İleri Yürü', isCorrect: false },
        ],
      },
    },
    {
      levelNumber: 2,
      title: 'Yıldız Toplama Döngüsü',
      instructions: 'Tavşan 3 kere zıplayıp yıldız topluyor. Doğru döngü hangisi?',
      hint: 'Zıplama hareketinin 3 kere tekrar ettiğine dikkat et.',
      config: {
        repeatedAction: { emoji: '⭐', text: 'Zıpla ve Yıldız Al' },
        repeatCount: 3,
        options: [
          { id: 'l1', count: 3, label: '3x Zıpla & Yıldız Al', isCorrect: true },
          { id: 'l2', count: 5, label: '5x Zıpla & Yıldız Al', isCorrect: false },
          { id: 'l3', count: 1, label: '1x Zıpla', isCorrect: false },
        ],
      },
    },
    {
      levelNumber: 3,
      title: 'Dans Eden Robot',
      instructions: 'Robot 5 defa alkış yapıyor. Bunu döngü ile ifade et.',
      hint: '5 tekrar sayısı olan seçeneğe tıkla.',
      config: {
        repeatedAction: { emoji: '👏', text: 'Alkış Yap' },
        repeatCount: 5,
        options: [
          { id: 'l1', count: 4, label: '4x Alkış', isCorrect: false },
          { id: 'l2', count: 5, label: '5x Alkış', isCorrect: true },
          { id: 'l3', count: 2, label: '2x Alkış', isCorrect: false },
        ],
      },
    },
    {
      levelNumber: 4,
      title: 'Çiçek Sulama Döngüsü',
      instructions: 'Bahçıvan 6 çiçeğe su veriyor. Döngü sayısını ayarla.',
      hint: 'Sütundaki 6 çiçeğin hepsi sulanmalı.',
      config: {
        repeatedAction: { emoji: '💧', text: 'Çiçeği Sula' },
        repeatCount: 6,
        options: [
          { id: 'l1', count: 6, label: '6x Çiçeği Sula', isCorrect: true },
          { id: 'l2', count: 3, label: '3x Çiçeği Sula', isCorrect: false },
          { id: 'l3', count: 8, label: '8x Çiçeği Sula', isCorrect: false },
        ],
      },
    },
    {
      levelNumber: 5,
      title: 'Kare Çizme Döngüsü',
      instructions: 'Bir kare çizmek için 4 kez (İleri Yürü + Sağa Dön) yapılır. Doğru döngü bloğu nedir?',
      hint: 'Karenin 4 eşit kenarı ve 4 köşesi vardır.',
      config: {
        repeatedAction: { emoji: '🔄', text: 'İleri Yürü ve Sağa Dön' },
        repeatCount: 4,
        options: [
          { id: 'l1', count: 4, label: '4x (İleri + Sağa Dön)', isCorrect: true },
          { id: 'l2', count: 3, label: '3x (İleri + Sağa Dön)', isCorrect: false },
          { id: 'l3', count: 2, label: '2x (İleri + Sağa Dön)', isCorrect: false },
        ],
      },
    },
  ],

  'condition-quest': [
    {
      levelNumber: 1,
      title: 'Yağmurlu Hava Koşulu',
      instructions: 'Eğer dışarıda hava yağmurluysa ne almalısın?',
      hint: 'Isılanmamak için koruyucu bir eşya seç.',
      config: {
        conditionText: 'EĞER hava yağmurlu ise:',
        options: [
          { id: 'c1', emoji: '☂️', text: 'Şemsiye al', isCorrect: true },
          { id: 'c2', emoji: '🕶️', text: 'Güneş gözlüğü tak', isCorrect: false },
          { id: 'c3', emoji: '🩴', text: 'Plaj terliği giy', isCorrect: false },
        ],
      },
    },
    {
      levelNumber: 2,
      title: 'Trafik Işığı Koşulu',
      instructions: 'Eğer yayalar için kırmızı ışık yanıyorsa ne yapmalısın?',
      hint: 'Kırmızı ışık dur demektir!',
      config: {
        conditionText: 'EĞER ışık kırmızı yanıyorsa:',
        options: [
          { id: 'c1', emoji: '🛑', text: 'Kaldırımda bekle (Dur)', isCorrect: true },
          { id: 'c2', emoji: '🏃', text: 'Yola koş', isCorrect: false },
          { id: 'c3', emoji: '🚲', text: 'Bisikletle karşıya geç', isCorrect: false },
        ],
      },
    },
    {
      levelNumber: 3,
      title: 'Acıkınca Ne Yapılır?',
      instructions: 'Eğer karnın acıktıysa algoritma hangi adıma geçmeli?',
      hint: 'Vücudumuzun enerjiye ihtiyacı var.',
      config: {
        conditionText: 'EĞER karnın acıktı ise:',
        options: [
          { id: 'c1', emoji: '🍎', text: 'Sağlıklı bir yemek ye', isCorrect: true },
          { id: 'c2', emoji: '😴', text: 'Hemen uyu', isCorrect: false },
          { id: 'c3', emoji: '📺', text: 'Televizyon izle', isCorrect: false },
        ],
      },
    },
    {
      levelNumber: 4,
      title: 'Soğuk Hava Kıyafeti',
      instructions: 'Eğer dışarısı çok soğuk ve karlı ise ne giymelisin?',
      hint: 'Üşümemek için kalın giysiler seç.',
      config: {
        conditionText: 'EĞER hava karlı ve soğuk ise:',
        options: [
          { id: 'c1', emoji: '🧥', text: 'Mont, atkı ve bere giy', isCorrect: true },
          { id: 'c2', emoji: '🎽', text: 'Şort ve tişört giy', isCorrect: false },
          { id: 'c3', emoji: '🩱', text: 'Mayo giy', isCorrect: false },
        ],
      },
    },
    {
      levelNumber: 5,
      title: 'Ödev Bitti mi?',
      instructions: 'Eğer okul ödevlerini bitirdiysen (If-Else mantığı):',
      hint: 'Ödev bittiyse oyun oynayabilirsin, bitmediyse ödeve devam etmelisin.',
      config: {
        conditionText: 'EĞER ödevlerin bittiyse:',
        options: [
          { id: 'c1', emoji: '🎮', text: 'Arkadaşlarınla oyun oyna', isCorrect: true },
          { id: 'c2', emoji: '📝', text: 'Defteri yırt', isCorrect: false },
          { id: 'c3', emoji: '🎒', text: 'Çantayı çöpe at', isCorrect: false },
        ],
      },
    },
  ],
};
