export function orderByIds<T extends { id: string }>(items: T[], ids: string[]) {
  const itemsById = new Map(items.map((item) => [item.id, item]));
  return ids.map((id) => itemsById.get(id)).filter((item): item is T => Boolean(item));
}
