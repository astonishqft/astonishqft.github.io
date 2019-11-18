import ReactMarkdown from 'react-markdown';
import CodeBlock from '@/components/markdown/codeBlock';
// import HeadingBlock from '@/components/markdown/headingBlock';
import 'github-markdown-css';
import './index.less';

export default (props) => {
  const { dataSource } = props;
  return (
    <ReactMarkdown
      escapeHtml={false}
      renderers={{
        code: CodeBlock,
        // heading: HeadingBlock
      }}
      className="markdown-body"
      source={dataSource}
    />
  )
}
