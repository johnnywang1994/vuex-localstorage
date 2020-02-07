# Vuex-LocalStore

A Vuex Plugin, help dealing with Vuex data & Web LocalStorage. Since LocalStorage could not automatically interact with some Vue APIs, such as `computed`, Vuex `getters`, or `v-model`.


## Install

### First Step

```cmd
$ npm i @johnnywang/vuex-localstorage
or
$ yarn install @johnnywang/vuex-localstorage
```

```javascript
/* main.js */
import Vue from 'vue'
import App from './App.vue'
// Vuex store instance
import store from './store'
// import LocalStore
import LocalStore from '@johnnywang/vuex-localstorage'

// register
LocalStore.register(store);

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
```

> Remember to register LocalStore module before new Vue using your `store` instance.

By registering LocalStore, it will create a Vuex module named `LocalStore`, it can be accessed by `this.$store.LocalStore` which we dont recommend to do.

### Second Step

Initiate the LocalStore module by calling `initLocalStorage` in Vuex, this only has to be called once in your App's entrypoint.

```javascript
/* App.vue */
import { mapActions } from 'vuex'

export default {
  name: 'App',
  methods: {
    ...mapActions('LocalStore', ['initLocalStorage']),
  },
  created() {
    this.initLocalStorage();
  }
}
```

This method checks user's localStorage, then inject the data into your Vuex.


## Usage

### Access

After registering, the `LocalStore` module has been inject into whole Vue instance globally by name `$ls` by default, which can also set as `stateKey` in Options.

```html
<!-- Hello.vue -->
<template>
  <div>{{ $ls }}</div>
</template>

<script>
export default {
  name: 'Hello'
}
</script>
```

In another Vuex module action, we can access it in `rootState.LocalStore.$ls`.

### Programmically change

Globally wherever you want, even in another Vuex module's action, you can use `editLocalStore` method. It receives an object with `key` & `value`, which will change data in Vuex & refresh localStorage automatically.

```javascript
/* Game.js */
// Another Vuex module

const actions = {
  someHandler({ dispatch }) {
    dispatch('editLocalStore', {
      key: 'name',
      value: 'Kevin Yan',
    }, { root: true });
  }
};
```

```javascript
/* Hello.vue */
import { mapActions } from 'vuex';

export default {
  name: 'Hello',
  methods: {
    ...mapActions(['editLocalStore']),
  },
  mounted() {
    this.editLocalStore({
      key: 'name',
      value: 'Gogo brother',
    });
  }
};
```

### Data Binding

Use `bindLocalStore` method, we can bind LocalStore data into components's `computed`, then use in `v-model`

```html
<!-- Hello.vue -->
<template>
  <input type="checkbox" v-model="show" />
</template>

<script>
import { bindLocalStore } from '@johnnywang/vuex-localstorage';

export default {
  name: 'Hello',
  computed: {
    show: bindLocalStore('show'),
  }
};
</script>
```

This just help you bind the `getter/setter` of computed with `data` & `editLocalStore`.

> Be aware that, you don't need to import `editLocalStore` when using `bindLocalStore`, even though you still can do it with other uses.


## State / Options

**state**

  - type: {Object}
  - default: `{}`

By default, state is empty. You can add some default value to localStore in `state`.

```javascript
import store from './store';
import LocalStore from '@johnnywang/vuex-localstorage';

// register
LocalStore.register(store, {
  state: {
    name: 'Johnny',
    age: 100,
    show: false
  }
});
```

**getters**

  - type: {Object}
  - default: `{}`

Getters to be set in Vuex module.

**stateKey**

  - type: {String}
  - default: `$ls`

The global access key to module state.


**userKey**

  - type: {String}
  - default: `store`

real key for Web LocalStorage where stores the data from Vuex.


**encode**

  - type: {Boolean}
  - default: `false`

Encode data stores in Web LocalStorage.


## Expired Handling

set `expire` key into `state` as following:

```javascript
LocalStore.register(store, {
  state: {
    name: 'Johnny',
    age: 100,
    show: false,
    expire: '2020-03-01' // String will put into new Date()
  }
});
```

if the user's localstorage data had contain `expire` key, then if expire date is over now, the data will be injected into Vuex, if the data is outdated, it will be overwriten by Vuex's setting default.


## Warning

This plugin is for small use case, and should not be used for storing any sensitive data, we do not responsed for the consequences.


## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2020-present, Johnny Wang