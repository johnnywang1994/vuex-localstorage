import Vue from 'vue';
import { mapState, mapActions } from 'vuex';

// Global Settings
let enableEncoded = false;
let VuexKey = '$ls';
let WebKey = 'store';

// Mutation Key
const REFRESH_LOCALSTORE = 'REFRESH_LOCALSTORE';

const EDIT_LOCALSTORE = 'EDIT_LOCALSTORE';

// Actions
const actions = {
  initLocalStorage({ commit, dispatch, state }) {
    let oldStore = localStorage.getItem(WebKey);
    if (oldStore !== null) {
      try {
        oldStore = JSON.parse(oldStore);
      } catch {
        oldStore = JSON.parse(atob(oldStore));
      }
      commit(REFRESH_LOCALSTORE, {
        ...state[VuexKey],
        ...(
          oldStore.expire
            ? Date.now() < oldStore.expire && oldStore
            : oldStore
        ),
      });
    }
    dispatch('refreshLocalStorage');
  },

  refreshLocalStorage({ state }) {
    const targetState = JSON.stringify(state[VuexKey]);
    localStorage.setItem(
      WebKey,
      enableEncoded ? btoa(targetState) : targetState,
    );
  },

  editLocalStore: {
    root: true,
    handler({ commit, dispatch }, payload) {
      commit(EDIT_LOCALSTORE, payload);
      // update localStorage
      dispatch('refreshLocalStorage');
    },
  },
};

// Mutations
const mutations = {
  [REFRESH_LOCALSTORE](state, storage) {
    state[VuexKey] = storage;
  },
  [EDIT_LOCALSTORE](state, payload) {
    const { key, value } = payload;
    state[VuexKey][key] = value;
  },
};

// Export
export default {
  register(store, options = {}) {
    const {
      stateKey,
      userKey,
      encode,
      state,
      getters
    } = options;
    stateKey && (VuexKey = stateKey);
    userKey && (WebKey = userKey);
    encode && (enableEncoded = encode);
    const ModuleOptions = {
      namespaced: true,
      state: {
        [VuexKey]: state || {}
      },
      getters: getters || {},
      actions,
      mutations,
    };
    // Global accessible(for method bindLocalStore)
    // User wont have to import anything by themselves
    Vue.mixin({
      computed: {
        ...mapState('LocalStore', [VuexKey])
      },
      methods: {
        ...mapActions({'_editLocalStore': 'editLocalStore'})
      }
    });
    // register as Vuex module
    store.registerModule('LocalStore', ModuleOptions);
  }
};

/* Event APIs */
export const bindLocalStore = (key) => {
  return {
    get() {
      return this[VuexKey][key];
    },
    set(value) {
      this._editLocalStore({
        key,
        value
      });
    }
  }
};
