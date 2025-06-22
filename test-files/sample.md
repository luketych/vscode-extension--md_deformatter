# What is FeathersJS?

**FeathersJS** is a minimalist, real-time framework for building RESTful and socket-based APIs.

## Benefits

- Lightweight
- **Real-time**
- Easy to integrate with any frontend

### Code Example

Here's a simple example:

```javascript
const feathers = require('@feathersjs/feathers');
const app = feathers();

app.use('messages', {
  async find() {
    return [{ text: 'Hello world' }];
  }
});
```

You can also use *inline code* like `app.listen(3030)` to start the server.

> Note: This is a blockquote about FeathersJS being awesome!

[Learn more about FeathersJS](https://feathersjs.com)

![FeathersJS Logo](https://feathersjs.com/logo.png)

---

That's all for now!