import {
  ArrowLeft, ArrowRight, Bookmark, Check, ChevronDown, ChevronRight,
  HeartPulse, Info, LockKeyhole, MapPin, RotateCcw, ShieldCheck, Trash2,
} from 'lucide-react';

const icons = {
  back: ArrowLeft,
  forward: ArrowRight,
  bookmark: Bookmark,
  check: Check,
  expand: ChevronDown,
  next: ChevronRight,
  heart: HeartPulse,
  info: Info,
  lock: LockKeyhole,
  location: MapPin,
  reset: RotateCcw,
  shield: ShieldCheck,
  delete: Trash2,
} as const;

type IconName = keyof typeof icons;

export function Icon({name,size=20,className}:{name:IconName;size?:16|20|24|32|48;className?:string}) {
  const Shape=icons[name];
  return <Shape size={size} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false"/>;
}
