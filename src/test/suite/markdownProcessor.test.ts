import * as assert from 'assert';
import { MarkdownProcessor } from '../../markdownProcessor';

suite('MarkdownProcessor Test Suite', () => {
    const processor = new MarkdownProcessor();

    test('should remove headers', () => {
        const input = '# Header 1\n## Header 2';
        const expected = 'Header 1\n\nHeader 2';
        assert.strictEqual(processor.stripMarkdown(input), expected);
    });

    test('should remove bold and italic', () => {
        const input = '**bold** *italic* __bold__ _italic_';
        const expected = 'bold italic bold italic';
        assert.strictEqual(processor.stripMarkdown(input), expected);
    });

    test('should remove links but keep text', () => {
        const input = '[link text](http://example.com)';
        const expected = 'link text';
        assert.strictEqual(processor.stripMarkdown(input), expected);
    });

    test('should remove images but keep alt text', () => {
        const input = '![alt text](image.png)';
        const expected = 'alt text';
        assert.strictEqual(processor.stripMarkdown(input), expected);
    });

    test('should handle code blocks', () => {
        const input = '```javascript\nconsole.log("hello");\n```';
        const expected = 'console.log("hello");';
        assert.strictEqual(processor.stripMarkdown(input), expected);
    });
});
