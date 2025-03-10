# EJSX Extension
### Component System
```
// Basic component
ejsx.registerComponent('Button', {
  validate: (props) => {
    if (!props.text) return 'text is required';
    return true;
  },
  render: (props) => `
    <button class="btn ${props.className || ''}">${props.text}</button>
  `
});
```

### Using Components
```
<!-- Basic usage -->
<%- await renderComponent('Button', { text: 'Click me' }) %>

<!-- With additional props -->
<%- await renderComponent('UserCard', {
  name: user.name,
  role: user.role,
  className: 'featured'
}) %>
```
### Layout System
```
// Basic layout
ejsx.layouts.set('main', (slots) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>${slots.title || 'Default Title'}</title>
      ${slots.head || ''}
    </head>
    <body>
      <header>${slots.header || ''}</header>
      <main>${slots.content || ''}</main>
      <footer>${slots.footer || ''}</footer>
    </body>
  </html>
`);
```
