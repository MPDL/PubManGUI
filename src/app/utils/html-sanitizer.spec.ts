import { sanitizeHtml } from './html-sanitizer';

const TITLE_RULES = { allowedTags: ['sub', 'sup', 'b', 'i'] };
const CITATION_RULES = {
  allowedTags: ['sub', 'sup', 'span', 'b', 'i', 'localized'],
  allowedClasses: { span: ['Italic', 'DisplayDateStatus'] },
};

/** Parses sanitizer output the way a consumer ([innerHTML]) would. */
function reparse(html: string): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = html;
  return host;
}

describe('sanitizeHtml', () => {
  describe('benign markup', () => {
    it('keeps allowed tags and escapes text', () => {
      expect(sanitizeHtml('<b>bold <i>and</i></b> & more', TITLE_RULES))
        .toBe('<b>bold <i>and</i></b> &amp; more');
    });

    it('shows disallowed tags as text but keeps their children', () => {
      expect(sanitizeHtml('<gene>DISC1</gene> expression', TITLE_RULES))
        .toBe('&lt;gene&gt;DISC1&lt;/gene&gt; expression');
    });

    it('keeps only allowlisted classes', () => {
      expect(sanitizeHtml('<span class="Italic junk">x</span>', CITATION_RULES))
        .toBe('<span class="Italic">x</span>');
    });

    it('drops the class attribute entirely when no class survives', () => {
      expect(sanitizeHtml('<span class="junk">x</span>', CITATION_RULES))
        .toBe('<span>x</span>');
    });

    it('emits void elements without a closing tag', () => {
      expect(sanitizeHtml('a<br>b', { allowedTags: ['br'] })).toBe('a<br>b');
    });

    it('drops all attributes except the allowlisted class', () => {
      expect(sanitizeHtml('<b style="color:red" onclick="alert(1)">x</b>', TITLE_RULES))
        .toBe('<b>x</b>');
    });

    it('drops comments', () => {
      expect(sanitizeHtml('a<!-- hidden -->b', TITLE_RULES)).toBe('ab');
    });

    it('escapes text so entities are not decoded twice', () => {
      expect(sanitizeHtml('&lt;b&gt;not bold&lt;/b&gt;', TITLE_RULES))
        .toBe('&lt;b&gt;not bold&lt;/b&gt;');
    });
  });

  describe('raw-text and head-parsed content stays visible', () => {
    for (const tag of ['script', 'style', 'textarea', 'option']) {
      it(`shows <${tag}> and its content as escaped text`, () => {
        expect(sanitizeHtml(`x<${tag}>payload</${tag}>y`, TITLE_RULES))
          .toBe(`x&lt;${tag}&gt;payload&lt;/${tag}&gt;y`);
      });
    }

    it('recovers <title> content that the parser routes into <head>', () => {
      expect(sanitizeHtml('<title>world</title> hello', TITLE_RULES))
        .toBe('&lt;title&gt;world&lt;/title&gt; hello');
    });

    it('recovers <template> content from the template fragment', () => {
      expect(sanitizeHtml('x<template><b>hidden</b></template>after', TITLE_RULES))
        .toBe('x&lt;template&gt;<b>hidden</b>&lt;/template&gt;after');
    });

    it('recovers a leading <template> from <head>', () => {
      expect(sanitizeHtml('<template><b>hidden</b></template>after', TITLE_RULES))
        .toBe('&lt;template&gt;<b>hidden</b>&lt;/template&gt;after');
    });

    it('serializes <head> content before <body> content', () => {
      expect(sanitizeHtml('<style>b{}</style>a', TITLE_RULES))
        .toBe('&lt;style&gt;b{}&lt;/style&gt;a');
    });
  });

  describe('parser differentials (mXSS)', () => {
    it('escapes a tag name containing a raw "<" so no element can materialize', () => {
      // The tokenizer accepts "<" inside tag names (as a parse error), so
      // element.tagName can be "a<img". The tag name must never be emitted raw.
      const output = sanitizeHtml(
        '<a<img src=x onerror=x";alert(1);//><b>bold</b></a<img>',
        TITLE_RULES,
      );

      expect(output).toBe(
        '&lt;a&lt;img src=&quot;x&quot; onerror=&quot;x&quot;;alert(1);//&quot;&gt;'
        + '<b>bold</b>&lt;/a&lt;img&gt;',
      );
      // What a consumer would render: markup may only contain the allowed <b>.
      const host = reparse(output);
      expect(host.querySelectorAll('img').length).toBe(0);
      expect(host.querySelectorAll('b').length).toBe(1);
      expect(host.textContent).toContain('bold');
    });

    it('omits attribute names that could change the parsing context', () => {
      // "<" and quotes are legal inside attribute names per the tokenizer.
      const output = sanitizeHtml('<div a<b="c" d"e=f>x</div>', TITLE_RULES);

      expect(output).toBe('&lt;div&gt;x&lt;/div&gt;');
      expect(reparse(output).querySelectorAll('*').length).toBe(0);
    });

    it('escapes attribute values of disallowed tags exactly once', () => {
      expect(sanitizeHtml('<gene name="5 &amp; &lt; 6">x</gene>', TITLE_RULES))
        .toBe('&lt;gene name=&quot;5 &amp; &lt; 6&quot;&gt;x&lt;/gene&gt;');
    });
  });

  describe('pathological nesting', () => {
    it('does not overflow the stack on deeply nested input', () => {
      const depth = 5000;
      const evil = '<i>'.repeat(depth) + 'x';

      let output: string;
      expect(() => { output = sanitizeHtml(evil, TITLE_RULES); }).not.toThrow();

      // The first MAX_DEPTH levels serialize as markup, the rest is flattened.
      expect(output!).toContain('<i>');
      expect(output!).toContain('x');
      expect(output!.length).toBeLessThan(depth * 2 * '</i>'.length);
    });
  });

  describe('SSR fallback (no DOMParser)', () => {
    const windowWithDomParser = window as unknown as { DOMParser?: unknown };

    afterEach(() => {
      windowWithDomParser.DOMParser = DOMParser;
    });

    it('returns fully escaped text when DOMParser is unavailable', () => {
      windowWithDomParser.DOMParser = undefined;

      expect(sanitizeHtml('<b>bold</b> & more', TITLE_RULES))
        .toBe('&lt;b&gt;bold&lt;/b&gt; &amp; more');
    });
  });
});
