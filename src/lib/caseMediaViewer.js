export function adjacentImageId(items, activeId, direction) {
  const images = items.filter(item => item.type === 'image');
  if (!images.length) return null;
  const index = images.findIndex(item => item.id === activeId);
  if (index < 0) return images[0].id;
  return images[(index + (direction < 0 ? -1 : 1) + images.length) % images.length].id;
}
