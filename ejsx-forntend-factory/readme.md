# The Templating Engine for Modern JavaScript Ecosystem
EJSX combines the simplicity of EJS with the power of modern JS features. Build scalable and maintainable templates with ease.


### EJS Core
**Basic Syntax**
EJS provides several tags for different purposes:
```
<%= value %>           // Outputs HTML escaped value
<%- value %>           // Outputs unescaped raw value
<% code %>             // Executes JavaScript code
<%# comment %>         // Comments (not included in output)
<%_ code %>            // Removes preceding whitespace
<% code _%>            // Removes following whitespace
<%- include(...) %>    // Includes template
```

**Includes**
```
<!-- Include another EJS file -->
<%- include('header') %>
<%- include('user/profile', {user: user}) %>
```

**Value Output**
```
<!-- HTML escaped output -->
<h1><%= title %></h1>
<p><%= user.bio %></p>

<!-- Raw output (unescaped) -->
<div><%- htmlContent %></div>
```

**Control Flow**
```
<!-- Conditionals -->
<% if (user) { %>
  <h2><%= user.name %></h2>
<% } else { %>
  <h2>Anonymous User</h2>
<% } %>

<!-- Loops -->
<ul>
  <% users.forEach(function(user) { %>
    <li><%= user.name %></li>
  <% }); %>
</ul>
```

**Custom Delimiters**
```
// Change default delimiters
ejs.delimiter = '?';  // Changes <%= to <?=
ejs.openDelimiter = '[';
ejs.closeDelimiter = ']';

// Example usage
[?= user.name ?]
```

**Caching**
```
// Enable template caching
ejs.cache = true;

// Custom cache handling
ejs.cache = LRU(100); // Using LRU cache

// Disable cache in development
ejs.cache = process.env.NODE_ENV === 'production';
```

### API Reference
```
// Core rendering
ejsx.render(template, data, options)
ejsx.renderFile(filename, data, options)
ejsx.renderToString(name, props)

// Component management
ejsx.registerComponent(name, config)
ejsx.extendComponent(baseName, name, config)
ejsx.components.get(name)
ejsx.components.delete(name)

// Layout management
ejsx.layouts.set(name, layoutFn)
ejsx.layouts.get(name)
ejsx.layouts.delete(name)
```
