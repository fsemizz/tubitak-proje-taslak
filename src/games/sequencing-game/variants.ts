import type { SequenceItem } from '@/types/game';

interface SequencingVariant {
  items: SequenceItem[];
  correctOrder: string[];
}

const it = (id: string, label: string): SequenceItem => ({ id, label });
const order = (items: SequenceItem[]): string[] => items.map((i) => i.id);

const VARIANTS: Record<string, SequencingVariant[]> = {
  'seq-1': [
    (() => {
      const items = [it('a', 'Ellerini yıka'), it('b', 'Diş fırçasına macun sür'), it('c', 'Dişlerini fırçala'), it('d', 'Ağzını suyla çalkala'), it('e', 'Fırçanı yıka ve yerine koy')];
      return { items, correctOrder: order(items) };
    })(),
    (() => {
      const items = [it('a', 'Ellerini yıka'), it('b', 'Fırçanı suyla ıslat'), it('c', 'Fırçaya macun sür'), it('d', 'Dişlerini fırçala'), it('e', 'Ağzını çalkala ve fırçanı yıka')];
      return { items, correctOrder: order(items) };
    })(),
  ],
  'seq-2': [
    (() => {
      const items = [it('a', 'Uyan ve yatağını topla'), it('b', 'Kahvaltı yap'), it('c', 'Kıyafetlerini giy'), it('d', 'Ayakkabılarını giy'), it('e', 'Çantanı hazırla'), it('f', 'Evden çık')];
      return { items, correctOrder: order(items) };
    })(),
    (() => {
      const items = [it('a', 'Uyan ve gerinme yap'), it('b', 'Yüzünü ve ellerini yıka'), it('c', 'Kahvaltını et'), it('d', 'Okul kıyafetlerini giy'), it('e', 'Saçını tara'), it('f', 'Çantanı al ve kapıdan çık')];
      return { items, correctOrder: order(items) };
    })(),
  ],
  'seq-3': [
    (() => {
      const items = [it('a', 'Ellerini yıka'), it('b', 'İki dilim ekmek al'), it('c', 'Ekmeklere tereyağı sür'), it('d', 'Peynir ve domates yerleştir'), it('e', 'Ekmekleri üst üste kapat'), it('f', 'Sandviçi ikiye kes'), it('g', 'Tabağa koy ve servis yap')];
      return { items, correctOrder: order(items) };
    })(),
    (() => {
      const items = [it('a', 'Ellerini yıka'), it('b', 'İki dilim ekmek al'), it('c', 'Ekmeklere margarin sür'), it('d', 'Jambon ve peynir yerleştir'), it('e', 'Bir marul yaprağı ekle'), it('f', 'Ekmekleri kapat ve hafifçe bastır'), it('g', 'Tabağa koy ve afiyetle ye')];
      return { items, correctOrder: order(items) };
    })(),
  ],
  'seq-4': [
    (() => {
      const items = [it('a', 'Saksıyı seç'), it('b', 'Saksıya toprak koy'), it('c', 'Toprağa küçük bir çukur aç'), it('d', 'Tohumu çukura bırak'), it('e', 'Üzerini toprakla kapat'), it('f', 'Su ver'), it('g', 'Güneşli bir yere koy'), it('h', 'Her gün kontrol edip bekle')];
      return { items, correctOrder: order(items) };
    })(),
    (() => {
      const items = [it('a', 'Şeffaf bir bardak al'), it('b', 'Bardağın içine pamuk koy'), it('c', 'Pamuğu suyla nemlendir'), it('d', 'Fasulye tohumunu pamuğun üstüne koy'), it('e', 'Bardağı pencere kenarına koy'), it('f', 'Her gün biraz su ekle'), it('g', 'Filizlenmesini bekle'), it('h', 'Büyüyen fasulyeyi gözlemle')];
      return { items, correctOrder: order(items) };
    })(),
  ],
  'seq-5': [
    (() => {
      const items = [it('a', '3 adım ileri git'), it('b', 'Sağa dön'), it('c', '2 adım ileri git'), it('d', 'Sola dön'), it('e', '1 adım ileri git'), it('f', 'Sağa dön'), it('g', '2 adım ileri git'), it('h', 'Hedefe ulaştın, dur')];
      return { items, correctOrder: order(items) };
    })(),
    (() => {
      const items = [it('a', '2 adım ileri git'), it('b', 'Sola dön'), it('c', '3 adım ileri git'), it('d', 'Sağa dön'), it('e', '1 adım ileri git'), it('f', 'Sağa dön'), it('g', '2 adım ileri git'), it('h', 'Hedefe ulaştın, dur')];
      return { items, correctOrder: order(items) };
    })(),
  ],
  'seq-6': [
    (() => {
      const items = [
        it('a', 'Davetiyeleri hazırla'), it('b', 'Davetiyeleri dağıt'), it('c', 'Salonu süsle'), it('d', 'Balonları şişir'),
        it('e', 'Pastayı fırından çıkar'), it('f', 'Pastayı süsle'), it('g', 'Masayı kur'), it('h', 'İkramları masaya diz'),
        it('i', 'Müzik çal'), it('j', 'Misafirleri karşıla'), it('k', 'Oyunları başlat'), it('l', 'Pastayı kesip mumları üfle'),
      ];
      return { items, correctOrder: order(items) };
    })(),
    (() => {
      const items = [
        it('a', 'Doğum günü davetiyesini oku'), it('b', 'Arkadaşına bir hediye seç'), it('c', 'Hediyeyi süslü kağıda sar'), it('d', 'Güzel kıyafetlerini giy'),
        it('e', 'Saçını tara'), it('f', 'Ailenle yola çık'), it('g', 'Kapıyı çal ve içeri gir'), it('h', 'Doğum günü çocuğuna hediyeni ver'),
        it('i', 'Oyunlara katıl'), it('j', 'Pasta kesilirken şarkı söyle'), it('k', 'Bir dilim pasta ye'), it('l', 'Ailene teşekkür edip eve dön'),
      ];
      return { items, correctOrder: order(items) };
    })(),
  ],
};

export function pickSequencingVariant(levelId: string): SequencingVariant {
  const options = VARIANTS[levelId];
  if (!options || options.length === 0) {
    throw new Error(`No sequencing-game variants defined for level "${levelId}"`);
  }
  return options[Math.floor(Math.random() * options.length)];
}
