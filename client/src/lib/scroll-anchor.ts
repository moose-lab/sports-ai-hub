const STICKY_NAV_HEIGHT_PX = 60;
const BROADCAST_TICKER_HEIGHT_PX = 42;
const TODAY_BAR_HEIGHT_PX = 42;
const ANCHOR_BREATHING_ROOM_PX = 24;

export const STICKY_ANCHOR_OFFSET_PX =
  STICKY_NAV_HEIGHT_PX +
  BROADCAST_TICKER_HEIGHT_PX +
  TODAY_BAR_HEIGHT_PX +
  ANCHOR_BREATHING_ROOM_PX;

export function computeAnchorScrollTop({
  rectTop,
  scrollY,
  offset = STICKY_ANCHOR_OFFSET_PX,
}: {
  rectTop: number;
  scrollY: number;
  offset?: number;
}) {
  return Math.max(0, rectTop + scrollY - offset);
}

export function scrollAnchorIntoView(id: string, offset: number = STICKY_ANCHOR_OFFSET_PX) {
  const el = document.getElementById(id);
  if (!el) return;

  window.scrollTo({
    top: computeAnchorScrollTop({
      rectTop: el.getBoundingClientRect().top,
      scrollY: window.scrollY,
      offset,
    }),
    behavior: "smooth",
  });
}
