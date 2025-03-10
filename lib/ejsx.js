import ejs from 'ejs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

class EJSX {
  constructor() {
    this.components = new Map();
    this.layouts = new Map();
    this.middleware = new Map();
    this.styles = new Map();
    this.scripts = new Map();
    this.hooks = new Map();
    
    // Default hooks
    this.hooks.set('beforeRender', []);
    this.hooks.set('afterRender', []);
  }

  // Core rendering methods
  async renderComponent(name, props = {}) {
    const component = this.components.get(name);
    if (!component) {
      throw new Error(`Component ${name} not found`);
    }
    return component(props);
  }

  async renderLayout(name, slots = {}) {
    const layout = this.layouts.get(name);
    if (!layout) {
      throw new Error(`Layout ${name} not found`);
    }
    return layout(slots);
  }

  // Component lifecycle hooks
  addHook(name, fn) {
    if (!this.hooks.has(name)) {
      this.hooks.set(name, []);
    }
    this.hooks.get(name).push(fn);
  }

  async runHooks(name, data) {
    const hooks = this.hooks.get(name) || [];
    for (const hook of hooks) {
      data = await hook(data);
    }
    return data;
  }

  // Style management
  addStyle(name, css) {
    this.styles.set(name, css);
  }

  // Script management
  addScript(name, js) {
    this.scripts.set(name, js);
  }

  // Middleware system
  use(name, middleware) {
    if (!this.middleware.has(name)) {
      this.middleware.set(name, []);
    }
    this.middleware.get(name).push(middleware);
  }

  async applyMiddleware(name, data) {
    const middlewareStack = this.middleware.get(name) || [];
    let result = data;
    
    for (const middleware of middlewareStack) {
      result = await middleware(result);
    }
    
    return result;
  }

  // Enhanced component registration with validation and lifecycle
  registerComponent(name, config) {
    const {
      render,
      validate,
      styles,
      scripts,
      middleware = []
    } = config;

    if (styles) this.addStyle(name, styles);
    if (scripts) this.addScript(name, scripts);

    middleware.forEach(m => this.use(name, m));

    this.components.set(name, async (props = {}) => {
      // Validate props if validation function provided
      if (validate) {
        const validationResult = validate(props);
        if (validationResult !== true) {
          throw new Error(`Invalid props for component ${name}: ${validationResult}`);
        }
      }

      // Apply middleware
      const processedProps = await this.applyMiddleware(name, props);

      // Render the component
      return render(processedProps);
    });
  }

  // Component inheritance system
  extendComponent(baseName, name, extendConfig) {
    const baseComponent = this.components.get(baseName);
    if (!baseComponent) {
      throw new Error(`Base component ${baseName} not found`);
    }

    this.registerComponent(name, {
      ...extendConfig,
      render: async (props) => {
        const baseOutput = await baseComponent(props);
        return extendConfig.render(baseOutput, props);
      }
    });
  }

  // Asset bundling
  getBundledStyles() {
    return Array.from(this.styles.values()).join('\n');
  }

  getBundledScripts() {
    return Array.from(this.scripts.values()).join('\n');
  }

  // SSR optimization
  async renderToString(name, props = {}) {
    const component = this.components.get(name);
    if (!component) {
      throw new Error(`Component ${name} not found`);
    }

    const html = await component(props);
    const styles = this.getBundledStyles();
    const scripts = this.getBundledScripts();

    return {
      html,
      styles,
      scripts
    };
  }

  // Template caching
  #templateCache = new Map();

  async render(template, data = {}, opts = {}) {
    try {
      // Run pre-render hooks
      data = await this.runHooks('beforeRender', data);

      // Add our render functions to the data context
      const enhancedData = {
        ...data,
        renderComponent: (name, props) => this.renderComponent(name, props),
        renderLayout: (name, slots) => this.renderLayout(name, slots),
        slots: {},
        styles: this.getBundledStyles(),
        scripts: this.getBundledScripts()
      };

      let compiledTemplate;
      const cacheKey = typeof template === 'string' ? template : template.toString();
      
      if (opts.cache && this.#templateCache.has(cacheKey)) {
        compiledTemplate = this.#templateCache.get(cacheKey);
      } else {
        compiledTemplate = ejs.compile(template, { ...opts, async: true });
        if (opts.cache) {
          this.#templateCache.set(cacheKey, compiledTemplate);
        }
      }

      const result = await compiledTemplate(enhancedData);
      
      // Run post-render hooks
      return this.runHooks('afterRender', result);
    } catch (error) {
      console.error('Render error:', error);
      throw error;
    }
  }

  async renderFile(filename, data, opts = {}) {
    const fs = require('fs').promises;
    const template = await fs.readFile(filename, 'utf8');
    return this.render(template, data, { ...opts, filename });
  }

  // Hot reloading support for development
  watchComponents(dir) {
    if (process.env.NODE_ENV === 'development') {
      const chokidar = require('chokidar');
      chokidar.watch(dir).on('change', async (path) => {
        delete require.cache[require.resolve(path)];
        // Reload component
        const component = require(path);
        this.registerComponent(component.name, component.config);
      });
    }
  }
}

export default new EJSX();
