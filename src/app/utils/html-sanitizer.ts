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
 *
 * In environments without a DOM (server-side rendering, web workers) the input is
 * returned fully escaped instead of formatted.
 */
export interface HtmlSanitizerRules {
  allowedTags: readonly string[];
  /** Classes allowed per tag, e.g. `{ span: ['Italic'] }`. Any other class is removed. */
  allowedClasses?: Readonly<Record<string, readonly string[]>>;
}

const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
  'meta', 'param', 'source', 'track', 'wbr',
]);

/**
 * Names that may be written into the output. The WHATWG tokenizer accepts
 * `<`, `"`, `'` and `&` inside tag and attribute names (as parse errors), so
 * anything not matching these patterns must never be emitted raw: a raw `<`
 * would re-open tag context when the output is re-parsed.
 */
const SAFE_TAG_NAME = /^[a-z][a-z0-9-]*$/;
const SAFE_ATTRIBUTE_NAME = /^[a-zA-Z_:][-a-zA-Z0-9_:.]*$/;

/**
 * Nesting limit for the serializer. `DOMParser` builds arbitrarily deep trees
 * without recursing, but serializing them recursively would overflow the stack,
 * so deeper subtrees are flattened to escaped text.
 */
const MAX_DEPTH = 200;

/** Sanitizes an HTML fragment, keeping allowed tags and escaping everything else. */
export function sanitizeHtml(value: string, rules: HtmlSanitizerRules): string {
  if (!value) {
    return value;
  }

  // SSR/web workers: environments without a DOM have no DOMParser. Degrade to
  // fully escaped text instead of crashing.
  if (typeof DOMParser === 'undefined') {
    return escapeText(value);
  }

  const document = new DOMParser().parseFromString(value, 'text/html');
  const allowedTags = new Set(rules.allowedTags);
  // Elements like <title> or <template> at the start of the input are parsed
  // into <head>; serialize it as well so their content is not silently lost.
  return serializeChildren(document.head, allowedTags, rules.allowedClasses, 0)
    + serializeChildren(document.body, allowedTags, rules.allowedClasses, 0);
}

function serializeChildren(
  node: Node,
  allowedTags: Set<string>,
  allowedClasses: Readonly<Record<string, readonly string[]>> | undefined,
  depth: number,
): string {
  let html = '';
  node.childNodes.forEach(child => {
    html += serializeNode(child, allowedTags, allowedClasses, depth);
  });
  return html;
}

function serializeNode(
  node: Node,
  allowedTags: Set<string>,
  allowedClasses: Readonly<Record<string, readonly string[]>> | undefined,
  depth: number,
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

  // Guard against stack exhaustion through pathological nesting; the content
  // stays visible as plain escaped text.
  if (depth >= MAX_DEPTH) {
    return escapeText(element.textContent ?? '');
  }

  // Template content lives in a separate document fragment (childNodes is
  // always empty); serialize that instead so nothing is silently lost.
  const children = serializeChildren(
    (element as HTMLTemplateElement).content ?? element,
    allowedTags,
    allowedClasses,
    depth + 1,
  );

  if (allowedTags.has(tag) && SAFE_TAG_NAME.test(tag)) {
    const attributes = serializeClassAttribute(element, tag, allowedClasses);
    return VOID_ELEMENTS.has(tag)
      ? `<${tag}${attributes}>`
      : `<${tag}${attributes}>${children}</${tag}>`;
  }

  // Not allowed: show the tag as text instead of discarding it, but still
  // process its children so allowed markup inside it keeps working.
  // The tag is assembled from already escaped parts; running `escapeText` over
  // it as a whole would escape the `&` of an attribute value a second time.
  // The tag name itself is escaped because the tokenizer may leave a raw `<`
  // inside it, which would re-open tag context when the output is re-parsed.
  const open = `&lt;${escapeText(tag)}${serializeAttributes(element)}&gt;`;
  return VOID_ELEMENTS.has(tag) ? open : `${open}${children}&lt;/${escapeText(tag)}&gt;`;
}

function serializeClassAttribute(
  element: Element,
  tag: string,
  allowedClasses: Readonly<Record<string, readonly string[]>> | undefined,
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
 * Renders the attributes of a disallowed tag for display as text. Values are
 * escaped because the result is pasted into the output string verbatim. Names
 * are limited to `SAFE_ATTRIBUTE_NAME` because the tokenizer accepts `<`, `"`
 * and `&` inside attribute names, and a raw `<` could change the parsing
 * context of the re-parsed output.
 */
function serializeAttributes(element: Element): string {
  let attributes = '';
  for (const attribute of Array.from(element.attributes)) {
    if (!SAFE_ATTRIBUTE_NAME.test(attribute.name)) {
      continue;
    }
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
