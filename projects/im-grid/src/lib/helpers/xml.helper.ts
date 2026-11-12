const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Escapes XML and wraps tag names, attribute names and attribute values in spans
 * (`im-xml-tag`, `im-xml-attr`, `im-xml-value`) for light syntax colouring.
 */
export function highlightXml(xml: string): string {
  return escapeHtml(xml)
    .replace(/(&lt;\/?)([\w:.-]+)/g, '$1<span class="im-xml-tag">$2</span>')
    .replace(
      /([\w:.-]+)=(&quot;.*?&quot;)/g,
      '<span class="im-xml-attr">$1</span>=<span class="im-xml-value">$2</span>'
    );
}
