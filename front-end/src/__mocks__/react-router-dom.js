const React = require('react');

module.exports = {
  // <MemoryRouter> just renders its children
  MemoryRouter({ children }) {
    return React.createElement(React.Fragment, null, children);
  },

  // useNavigate returns a no-op function by default
  useNavigate() {
    return () => {};
  },

  // useLocation returns an empty state by default
  useLocation() {
    return { state: {} };
  },

  // Link renders a simple <a> tag
  Link({ to, children }) {
    return React.createElement('a', { href: to }, children);
  },
};