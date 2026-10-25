// A decorative period replaces an existing period, never a question mark.
export function revealText(value, decorate = false) {
  const text = String(value ?? '');
  const dot = decorate && !/[?!…]$/.test(text.trimEnd());
  return { text: dot ? text.trimEnd().replace(/\.+$/, '') : text, dot };
}
