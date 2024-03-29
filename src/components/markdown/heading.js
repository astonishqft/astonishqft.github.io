import React from "react";

const elements = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6"
};

function Heading({ level, index, children, ...props }) {
  const eleProps = { ...props, className: `heading heading-${level}`, 'data-level': index }
  return React.createElement(elements[level] || elements.h1, eleProps, children);
}

// Heading.defaultProps = {
//   type: "h1",
// };

export default Heading;
