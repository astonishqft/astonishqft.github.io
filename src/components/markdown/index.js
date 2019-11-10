import ReactMarkdown from 'react-markdown';
import CodeBlock from '@/components/markdown/codeBlock';
import HeadingBlock from '@/components/markdown/headingBlock';

export default (props) => {
  const { dataSource } = props;
  return (
    <ReactMarkdown
      escapeHtml={false}
      renderers={{
        code: CodeBlock,
        heading: HeadingBlock
      }}
      source={dataSource}
      // source={item.body.match(/<p>(.*?)<\/p>/)[0]}
    />
  )
}
