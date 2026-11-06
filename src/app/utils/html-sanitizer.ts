/**
 * Allowlist serializer for HTML fragments from PubMan metadata (titles, abstracts,
 * citations). Replaces the `sanitize-html` package, which brought its own HTML
 * parser (plus postcss) into the browser bundle.
 *
 * The browser's parser does the tokenizing; this module only decides what is written
 * back out:
 *  - tags in `allowedTags` are emitted as real markup,
 *  - all other tags are escaped and therefore stay visible as text
 *    (e.g. a title containing "<gene>" is shown literally instead of being dropped),
 *  - only classes listed in `allowedClasses` survive.
 *
 * Angular's built-in sanitizer still runs on the resulting `[innerHTML]` binding,
 * so this is a formatting helper, not the security boundary.
 */
export interface HtmlSanitizerRules {
  allowedTags: readonly string[];
  /** Classes allowed per tag, e.g. `{ span: ['Italic'] }`. Any other class is removed. */
  allowedClasses?: Readonly<Record<string, readonly string[]>>;
}

/** Tags whose content was dropped entirely by `sanitize-html`; keep that behaviour. */
const NON_TEXT_TAGS = new Set(['script', 'style', 'textarea', 'option']);

const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
  'meta', 'param', 'source', 'track', 'wbr',
]);

/** Sanitizes an HTML fragment, keeping allowed tags and escaping everything else. */
export function sanitizeHtml(value: string, rules: HtmlSanitizerRules): string {
  if (!value) {
    return value;
  }

  const body = new DOMParser().parseFromString(value, 'text/html').body;
  const allowedTags = new Set(rules.allowedTags);
  return serializeChildren(body, allowedTags, rules.allowedClasses);
}

function serializeChildren(
  node: Node,
  allowedTags: Set<string>,
  allowedClasses?: Readonly<Record<string, readonly string[]>>,
): string {
  let html = '';
  node.childNodes.forEach(child => {
    html += serializeNode(child, allowedTags, allowedClasses);
  });
  return html;
}

function serializeNode(
  node: Node,
  allowedTags: Set<string>,
  allowedClasses?: Readonly<Record<string, readonly string[]>>,
): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return escapeText(node.nodeValue ?? '');
  }

  // Comments, CDATA, processing instructions: drop them.
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  const element = node as Element;
  const tag = element.tagName.toLowerCase();

  if (NON_TEXT_TAGS.has(tag)) {
    return '';
  }

  const children = serializeChildren(element, allowedTags, allowedClasses);

  if (allowedTags.has(tag)) {
    const attributes = serializeClassAttribute(element, tag, allowedClasses);
    return VOID_ELEMENTS.has(tag)
      ? `<${tag}${attributes}>`
      : `<${tag}${attributes}>${children}</${tag}>`;
  }

  // Not allowed: show the tag as text instead of discarding it, but still
  // process its children so allowed markup inside it keeps working.
  // The tag is assembled from already escaped parts; running `escapeText` over
  // it as a whole would escape the `&` of an attribute value a second time.
  const open = `&lt;${tag}${serializeAttributes(element)}&gt;`;
  return VOID_ELEMENTS.has(tag) ? open : `${open}${children}&lt;/${tag}&gt;`;
}

function serializeClassAttribute(
  element: Element,
  tag: string,
  allowedClasses?: Readonly<Record<string, readonly string[]>>,
): string {
  const allowed = allowedClasses?.[tag];
  if (!allowed) {
    return '';
  }

  const kept = (element.getAttribute('class') ?? '')
    .split(/\s+/)
    .filter(className => allowed.includes(className));

  return kept.length > 0 ? ` class="${escapeAttribute(kept.join(' '))}"` : '';
}

/**
 * Renders the attributes of a disallowed tag for display as text. Everything is
 * escaped here because the result is pasted into the output string verbatim.
 * Attribute names cannot contain `&`, `<`, `>`, `"` or whitespace, so they are
 * emitted as they are.
 */
function serializeAttributes(element: Element): string {
  let attributes = '';
  for (const attribute of Array.from(element.attributes)) {
    attributes += ` ${attribute.name}=&quot;${escapeAttribute(attribute.value)}&quot;`;
  }
  return attributes;
}

function escapeText(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttribute(text: string): string {
  return escapeText(text).replace(/"/g, '&quot;');
}
