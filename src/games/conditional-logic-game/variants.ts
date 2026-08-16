import type { ConditionalBranch } from '@/types/game';

interface ConditionalVariant {
  scenario: string;
  branches: ConditionalBranch[];
  correctBranchId: string;
}

const b = (id: string, label: string, description: string): ConditionalBranch => ({ id, label, description });

const VARIANTS: Record<string, ConditionalVariant[]> = {
  'cond-1': [
    {
      scenario: 'Eğer dışarıda yağmur yağıyorsa, ne yapmalısın?',
      branches: [
        b('b1', 'Şemsiye al', 'Yağmurdan korunmak için şemsiye alırsın.'),
        b('b2', 'Güneş gözlüğü tak', 'Güneşli günlerde işe yarar, ama şimdi değil.'),
      ],
      correctBranchId: 'b1',
    },
    {
      scenario: 'Dışarı çok soğuk. Ne yapmalısın?',
      branches: [
        b('b1', 'Mont giy', 'Soğuktan korunmak için mont giyersin.'),
        b('b2', 'Mayo giy', 'Bu soğuk havada hiç uygun değil.'),
      ],
      correctBranchId: 'b1',
    },
  ],
  'cond-2': [
    {
      scenario: 'Trafik ışığı kırmızı yandı. Ne yapmalısın?',
      branches: [
        b('b1', 'Dur ve bekle', 'Kırmızı ışıkta durmak gerekir.'),
        b('b2', 'Hızla yürü', 'Bu güvenli değil.'),
        b('b3', 'Koşarak geç', 'Bu çok tehlikeli.'),
      ],
      correctBranchId: 'b1',
    },
    {
      scenario: 'Zil çaldı ve ders bitti. Ne yapmalısın?',
      branches: [
        b('b1', 'Sırana otur ve bekle', 'Zil çalınca öğretmen izin verene kadar beklenir.'),
        b('b2', 'Hemen koşarak dışarı çık', 'Bu güvenli ve kurallara uygun değil.'),
        b('b3', 'Bağırarak sınıftan çık', 'Bu hiç uygun bir davranış değil.'),
      ],
      correctBranchId: 'b1',
    },
  ],
  'cond-3': [
    {
      scenario: 'Robotun tam önünde bir duvar var. Robot ne yapmalı?',
      branches: [
        b('b1', 'Dur', 'Duvar olduğu için robot ilerleyemez, durmalı.'),
        b('b2', 'İlerle', 'Bu robotu duvara çarptırır.'),
        b('b3', 'Geri geri git', 'Kural sadece "dur" ya da "ilerle" diyor, geri gitmeyi söylemiyor.'),
      ],
      correctBranchId: 'b1',
    },
    {
      scenario: 'Robotun kuralı: "Eğer yol açıksa ilerle, değilse dur." Robotun önünde açık yol var. Robot ne yapmalı?',
      branches: [
        b('b1', 'İlerle', 'Yol açık olduğu için robot ilerlemeli.'),
        b('b2', 'Dur', 'Yol açıkken durmak kurala uymaz.'),
        b('b3', 'Geri dön', 'Kuralda geri dönme diye bir seçenek yok.'),
      ],
      correctBranchId: 'b1',
    },
  ],
  'cond-4': [
    {
      scenario: 'Hava çok sıcak ve çok susadın. Ne yapmalısın?',
      branches: [
        b('b1', 'Su iç', 'Sıcak ve susamış olduğun için su içmelisin.'),
        b('b2', 'Kalın kazak giy', 'Bu sıcak havada mantıklı değil.'),
        b('b3', 'Uyumaya git', 'Susuzluğunu gidermez.'),
        b('b4', 'Sıcak çay iç', 'Sıcak havada susuzluğu gidermek için en iyi seçim değil.'),
      ],
      correctBranchId: 'b1',
    },
    {
      scenario: 'Çok yorgunsun ve gözlerin kapanıyor. Saat de gece 10. Ne yapmalısın?',
      branches: [
        b('b1', 'Uyumaya hazırlan', 'Yorgun ve saat geç olduğu için uyku vakti gelmiş.'),
        b('b2', 'Dışarı koşmaya çık', 'Bu, yorgunluğu daha da artırır.'),
        b('b3', 'Kahvaltı yap', 'Kahvaltı vakti değil, gece oldu.'),
        b('b4', 'Müzik açıp dans et', 'Bu uyku vaktinde uygun değil.'),
      ],
      correctBranchId: 'b1',
    },
  ],
  'cond-5': [
    {
      scenario: 'Saat akşam oldu, hava karardı ve çok yorgunsun. Şimdi ne yapmalısın?',
      branches: [
        b('b1', 'Uyumaya hazırlan', 'Akşam oldu ve yorgunsun, uyku vakti geldi.'),
        b('b2', 'Dışarı oyuna çık', 'Hava karanlık, dışarı çıkmak için uygun değil.'),
        b('b3', 'Öğle yemeği ye', 'Öğle yemeği vakti çoktan geçti.'),
      ],
      correctBranchId: 'b1',
    },
    {
      scenario: 'Sabah oldu, güneş doğdu ve dinlenmiş hissediyorsun. Şimdi ne yapmalısın?',
      branches: [
        b('b1', 'Uyanıp güne başla', 'Sabah oldu ve dinlenmişsin, güne başlama vakti.'),
        b('b2', 'Pijamalarını giyip yatağa gir', 'Sabah olduğu için bu doğru değil.'),
        b('b3', 'Işıkları kapatıp uyu', 'Gündüz vakti uyumak için uygun değil.'),
      ],
      correctBranchId: 'b1',
    },
  ],
  'cond-6': [
    {
      scenario: 'Hava çok soğuk ve arkadaşlarınla karda oynamaya gideceksin. Ne giymelisin?',
      branches: [
        b('b1', 'Kalın mont, bere ve eldiven giy', 'Hava soğuk VE karda oynayacaksın — kural tam olarak bunu söylüyor.'),
        b('b2', 'İnce tişört giy', 'Bu kural sadece hava soğuk değilken geçerli.'),
        b('b3', 'Mayo giy', 'Karda oynamak için hiç uygun değil.'),
        b('b4', 'Hiçbir şey giyme', 'Soğukta dışarı çıkmak için güvenli değil.'),
      ],
      correctBranchId: 'b1',
    },
    {
      scenario: 'Hava çok sıcak ve havuza gireceksin. Ne giymelisin?',
      branches: [
        b('b1', 'Mayo ve terlik giy', 'Hava sıcak VE havuza gireceksin — kural tam olarak bunu söylüyor.'),
        b('b2', 'Kalın mont giy', 'Bu kural sadece hava soğukken geçerli.'),
        b('b3', 'Atkı ve bere tak', 'Sıcak havada ve havuzda hiç uygun değil.'),
        b('b4', 'Yağmurluk giy', 'Yağmur yağmıyor, bu uygun değil.'),
      ],
      correctBranchId: 'b1',
    },
  ],
};

export function pickConditionalVariant(levelId: string): ConditionalVariant {
  const options = VARIANTS[levelId];
  if (!options || options.length === 0) {
    throw new Error(`No conditional-logic variants defined for level "${levelId}"`);
  }
  return options[Math.floor(Math.random() * options.length)];
}
