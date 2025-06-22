import * as MarkdownIt from 'markdown-it';

export class MarkdownProcessor {
    private md: MarkdownIt;

    constructor() {
        this.md = new MarkdownIt({
            html: false,
            breaks: true,
            linkify: false
        });
    }

    stripMarkdown(content: string): string {
        const tokens = this.md.parse(content, {});
        return this.renderPlainText(tokens);
    }

    private renderPlainText(tokens: any[]): string {
        let result = '';

        for (const token of tokens) {
            if (token.type === 'inline' && token.children) {
                result += this.renderInlineTokens(token.children);
            } else if (token.type === 'text') {
                result += token.content;
            } else if (token.type === 'paragraph_open') {
                // Add nothing, handled by paragraph_close
            } else if (token.type === 'paragraph_close') {
                result += '\n\n';
            } else if (token.type === 'heading_open') {
                // Add nothing, the content will follow
            } else if (token.type === 'heading_close') {
                result += '\n\n';
            } else if (token.type === 'bullet_list_open' || token.type === 'ordered_list_open') {
                // Lists handled by list items
            } else if (token.type === 'bullet_list_open' || token.type === 'ordered_list_open') {
                // Lists handled by list items
            } else if (token.type === 'list_item_open') {
                if (token.info) {
                    result += `${token.info}. `;
                } else {
                    result += '- ';
                }
            } else if (token.type === 'list_item_close') {
                result += '\n';
            } else if (token.type === 'code_block') {
                result += token.content + '\n\n';
            } else if (token.type === 'fence') {
                result += token.content + '\n\n';
            } else if (token.type === 'hr') {
                // Skip horizontal rules
            } else if (token.type === 'blockquote_open' || token.type === 'blockquote_close') {
                // Handle blockquotes
            }
        }

        return result.trim();
    }

    private renderInlineTokens(tokens: any[]): string {
        let result = '';

        for (const token of tokens) {
            if (token.type === 'text') {
                result += token.content;
            } else if (token.type === 'code_inline') {
                result += token.content;
            } else if (token.type === 'link_open' || token.type === 'link_close') {
                // Skip link markup
            } else if (token.type === 'image') {
                result += token.content;
            } else if (token.type === 'strong_open' || token.type === 'strong_close' ||
                       token.type === 'em_open' || token.type === 'em_close') {
                // Skip emphasis markup
            } else if (token.children) {
                result += this.renderInlineTokens(token.children);
            }
        }

        return result;
    }
}