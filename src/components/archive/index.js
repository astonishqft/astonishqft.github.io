import React from 'react';
import { Collapse, List, Tag } from 'antd';
import styles from './index.less';

const { Panel } = Collapse;

class Archive extends React.Component {
  render() {
    const { timeLine = {}, tags={}, handleTagChange = () => {} } = this.props;
    return (
      <div className={styles.root}>
        <div className={styles.timeLine}>
          <div className={styles.title}>时间轴</div>
          <div>
            <Collapse accordion>
              {
                Object.keys(timeLine).map(time => {
                  return (
                    <Panel header={`${time}(${timeLine[time].total})`} key={time}>
                      <List
                        header={null}
                        footer={null}
                        bordered={null}
                        dataSource={timeLine[time].item}
                        renderItem={title => (
                          <List.Item key={title.id}>
                            <a href={`${window.location.href}${title.number}`}>{title.title}</a>
                          </List.Item>
                        )}
                      />
                    </Panel>
                  )
                })
              }
            </Collapse>
          </div>
        </div>

        <div className={styles.label}>
          <div className={styles.title}>
            标签
          </div>
          <div className={styles.labels}>
            {tags && Object.keys(tags).map(tag => {
              return (
                <Tag
                  key={tag}
                  onClick={() => handleTagChange(tag)}
                  style={{ background: `#${tags[tag].color}`, color: '#fff' }}
                >{`${tags[tag].name}(${tags[tag].total})`}</Tag>)
            }
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Archive;
