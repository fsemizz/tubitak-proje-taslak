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
      const items = [it('a', 'Ellerini yıka'), it('b', 'Süt bardağını al'), it('c', 'Bardağa süt koy'), it('d', 'Ekmeğini al'), it('e', 'Otur ve kahvaltını et')];
      return { items, correctOrder: order(items) };
    })(),
  ],
  'seq-2': [
    (() => {
      const items = [it('a', 'Uyan ve yatağını topla'), it('b', 'Kahvaltı yap'), it('c', 'Kıyafetlerini giy'), it('d', 'Ayakkabılarını giy'), it('e', 'Çantanı hazırla'), it('f', 'Evden çık')];
      return { items, correctOrder: order(items) };
    })(),
    (() => {
      const items = [it('a', 'Pijamalarını giy'), it('b', 'Dişlerini fırçala'), it('c', 'Biraz kitap oku'), it('d', 'Işığı kapat'), it('e', 'Battaniyeni ört'), it('f', 'Uyu')];
      return { items, correctOrder: order(items) };
    })(),
  ],
  'seq-3': [
    (() => {
      const items = [it('a', 'Ellerini yıka'), it('b', 'İki dilim ekmek al'), it('c', 'Ekmeklere tereyağı sür'), it('d', 'Peynir ve domates yerleştir'), it('e', 'Ekmekleri üst üste kapat'), it('f', 'Sandviçi ikiye kes'), it('g', 'Tabağa koy ve servis yap')];
      return { items, correctOrder: order(items) };
    })(),
    (() => {
      const items = [it('a', 'Ellerini yıka'), it('b', 'Marulu yıka'), it('c', 'Domatesi doğra'), it('d', 'Salatalığı doğra'), it('e', 'Hepsini kaseye koy'), it('f', 'Zeytinyağı ekle'), it('g', 'Karıştır ve servis yap')];
      return { items, correctOrder: order(items) };
    })(),
  ],
  'seq-4': [
    (() => {
      const items = [it('a', 'Saksıyı seç'), it('b', 'Saksıya toprak koy'), it('c', 'Toprağa küçük bir çukur aç'), it('d', 'Tohumu çukura bırak'), it('e', 'Üzerini toprakla kapat'), it('f', 'Su ver'), it('g', 'Güneşli bir yere koy'), it('h', 'Her gün kontrol edip bekle')];
      return { items, correctOrder: order(items) };
    })(),
    (() => {
      const items = [it('a', 'Bir kağıt al'), it('b', 'Kağıdı ortadan katla'), it('c', 'Üst köşeleri katla'), it('d', 'Kenarları içe katla'), it('e', 'Kanatları katla'), it('f', 'Ucunu düzelt'), it('g', 'Fırlatmaya hazırlan'), it('h', 'Uçağı fırlat')];
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
        it('a', 'Sırt çantanı hazırla'), it('b', 'Su matarasını doldur'), it('c', 'Öğle yemeğini paketle'), it('d', 'Şapkanı al'),
        it('e', 'Güneş kremi sür'), it('f', 'Rahat ayakkabı giy'), it('g', 'Fotoğraf makinesini al'), it('h', 'Otobüse bin'),
        it('i', 'Sırana otur'), it('j', 'Rehberi dinle'), it('k', 'Notlar al'), it('l', 'Eve dönünce gezini anlat'),
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
