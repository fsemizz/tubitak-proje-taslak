import {
  Bed,
  ShowerHead,
  Utensils,
  DoorOpen,
  Droplets,
  WashingMachine,
  Archive,
  Refrigerator,
  LampDesk,
  Book,
  Backpack,
  Shirt,
  Apple,
  Box,
  type LucideIcon,
} from 'lucide-react';

export const OBJECT_ICON_MAP: Record<string, LucideIcon> = {
  bed: Bed,
  'shower-head': ShowerHead,
  utensils: Utensils,
  'door-open': DoorOpen,
  droplets: Droplets,
  'washing-machine': WashingMachine,
  archive: Archive,
  refrigerator: Refrigerator,
  'lamp-desk': LampDesk,
  book: Book,
  backpack: Backpack,
  shirt: Shirt,
  apple: Apple,
  box: Box,
};

export function getObjectIcon(key: string): LucideIcon {
  return OBJECT_ICON_MAP[key] ?? Archive;
}
