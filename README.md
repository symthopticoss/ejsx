<img src="https://i.imgur.com/NHgDeBY.png" alt="EJSX logo">

# EJSX

EJSX is a powerful extension of EJS (Embedded JavaScript) templating engine that adds modern features like components, layouts, middleware, and hooks. It's designed to make server-side rendering more maintainable and developer-friendly while maintaining the simplicity and flexibility of EJS.

## Features

- 🧩 **Component System** - Create reusable UI components with props
- 📐 **Layouts** - Template inheritance with flexible slot system
- 🎨 **Style Management** - Bundled CSS with scoped styles
- 📜 **Script Management** - Organized client-side JavaScript
- 🔄 **Middleware System** - Transform props and content
- 🪝 **Lifecycle Hooks** - Pre and post-render hooks
- 🔥 **Hot Reloading** - Development mode with automatic updates
- 💾 **Template Caching** - Optimized performance for production

## Installation

```bash
npm install @symthoptic/ejsx
```

## Quick Start

```javascript
import ejsx from 'ejsx';
import express from 'express';

const app = express();

// Register a component
ejsx.registerComponent('Button', {
  render: ({ text, type = 'primary' }) => `
    <button class="btn btn-${type}">
      ${text}
    </button>
  `,
  validate: (props) => {
    if (!props.text) return 'Button text is required';
    return true;
  }
});

// Register a layout
ejsx.layouts.set('main', (slots) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>${slots.title || 'EJSX App'}</title>
      <style>${slots.styles || ''}</style>
    </head>
    <body>
      ${slots.content || ''}
      <script>${slots.scripts || ''}</script>
    </body>
  </html>
`);

// Use in your Express app
app.engine('ejs', ejsx.renderFile);
app.set('view engine', 'ejs');
```

Create a view (`views/index.ejs`):

```ejs
<% slots.title = 'Welcome' %>

<% slots.content = `
  <div class="container">
    <h1>Welcome to EJSX</h1>
    ${await renderComponent('Button', { 
      text: 'Get Started',
      type: 'primary'
    })}
  </div>
` %>

<%- await renderLayout('main', slots) %>
```

## Component System

### Registering Components

```javascript
ejsx.registerComponent('Card', {
  render: ({ title, content }) => `
    <div class="card">
      <h2>${title}</h2>
      <div>${content}</div>
    </div>
  `,
  styles: `
    .card {
      border: 1px solid #ddd;
      padding: 1rem;
      margin: 1rem 0;
    }
  `,
  scripts: `
    console.log('Card component loaded');
  `,
  middleware: [
    async (props) => ({
      ...props,
      title: props.title.toUpperCase()
    })
  ]
});
```

### Using Components

```ejs
<%- await renderComponent('Card', {
  title: 'Hello World',
  content: 'This is a card component'
}) %>
```

## Layouts and Slots

### Defining a Layout

```javascript
ejsx.layouts.set('dashboard', (slots) => `
  <div class="dashboard">
    <nav>${slots.nav || ''}</nav>
    <aside>${slots.sidebar || ''}</aside>
    <main>${slots.content || ''}</main>
  </div>
`);
```

### Using Layouts

```ejs
<% slots.nav = await renderComponent('Navbar', { user }) %>
<% slots.sidebar = await renderComponent('Sidebar', { menu }) %>
<% slots.content = `
  <h1>Dashboard</h1>
  ${await renderComponent('Stats', { data })}
` %>

<%- await renderLayout('dashboard', slots) %>
```

## Middleware

```javascript
// Add middleware to transform props
ejsx.use('Button', async (props) => ({
  ...props,
  text: `👉 ${props.text}`
}));
```

## Hooks

```javascript
// Add a pre-render hook
ejsx.addHook('beforeRender', async (data) => ({
  ...data,
  user: await fetchUser(data.userId)
}));
```

## Development Mode

```javascript
// Enable hot reloading in development
if (process.env.NODE_ENV === 'development') {
  ejsx.watchComponents('./components');
}
```



## License

This project is licensed under the SOSSL License - see the [LICENSE](LICENSE) file for details.


