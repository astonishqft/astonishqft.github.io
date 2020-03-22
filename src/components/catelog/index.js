import React from 'react';
import styles from './index.less';

class Catelog extends React.Component {
  scrollToAnchor = (anchorName) => {
    if (anchorName) {
      let anchorElement = document.getElementById(anchorName);
      if (anchorElement) { anchorElement.scrollIntoView(); }
    }
  }

  render() {
    const { data = []} = this.props;
    return (
      <ul className={styles.catelog}>
        {data.map((item, index) => <li onClick={() => this.scrollToAnchor(item.id)} className={styles[`level-${item.level}`]} key={`title-${index}`}><a>{item.id}</a></li>)}
      </ul>
    );
  }
}

export default Catelog;
