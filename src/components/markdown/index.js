import ReactMarkdown from 'react-markdown';
import CodeBlock from '@/components/markdown/codeBlock';
import HeadingBlock from '@/components/markdown/headingBlock';
import 'github-markdown-css';
import './index.less';

export default (props) => {
  const { dataSource } = props;
  return (
    <ReactMarkdown
      escapeHtml={false}
      renderers={{
        code: CodeBlock,
        heading: HeadingBlock,
        // heading : (text, level) => `<h${level} id="${text}" data-level="${level}" class="heading heading-${level}">${text}</h${level}>`,
        // link : (href, title, text) => `<a target="_blank" href="${href}" title="${title}">${text}</a>`,
      //  image: (href, title, text) => `<a target="_blank" href="${href}" title="${title}"><image src="${href}" /></a>`
      }}
      className="markdown-body"
      source={dataSource}
    />
  )
}
