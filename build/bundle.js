
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    // Adapted from https://github.com/then/is-promise/blob/master/index.js
    // Distributed under MIT License https://github.com/then/is-promise/blob/master/LICENSE
    function is_promise(value) {
        return !!value && (typeof value === 'object' || typeof value === 'function') && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    /**
     * List of attributes that should always be set through the attr method,
     * because updating them through the property setter doesn't work reliably.
     * In the example of `width`/`height`, the problem is that the setter only
     * accepts numeric values, but the attribute can also be set to a string like `50%`.
     * If this list becomes too big, rethink this approach.
     */
    const always_set_through_set_attribute = ['width', 'height'];
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set && always_set_through_set_attribute.indexOf(key) === -1) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    /**
     * Associates an arbitrary `context` object with the current component and the specified `key`
     * and returns that object. The context is then available to children of the component
     * (including slotted content) with `getContext`.
     *
     * Like lifecycle functions, this must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-setcontext
     */
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    /**
     * Retrieves the context that belongs to the closest parent component with the specified `key`.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-getcontext
     */
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        const options = { direction: 'in' };
        let config = fn(node, params, options);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config(options);
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        const options = { direction: 'out' };
        let config = fn(node, params, options);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config(options);
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init$1(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop$1,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop$1;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const LOCATION = {};
    const ROUTER = {};
    const HISTORY = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const PARAM = /^:(.+)/;
    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Split up the URI into segments delimited by `/`
     * Strip starting/ending `/`
     * @param {string} uri
     * @return {string[]}
     */
    const segmentize = (uri) => uri.replace(/(^\/+|\/+$)/g, "").split("/");
    /**
     * Strip `str` of potential start and end `/`
     * @param {string} string
     * @return {string}
     */
    const stripSlashes = (string) => string.replace(/(^\/+|\/+$)/g, "");
    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    const rankRoute = (route, index) => {
        const score = route.default
            ? 0
            : segmentize(route.path).reduce((score, segment) => {
                  score += SEGMENT_POINTS;

                  if (segment === "") {
                      score += ROOT_POINTS;
                  } else if (PARAM.test(segment)) {
                      score += DYNAMIC_POINTS;
                  } else if (segment[0] === "*") {
                      score -= SEGMENT_POINTS + SPLAT_PENALTY;
                  } else {
                      score += STATIC_POINTS;
                  }

                  return score;
              }, 0);

        return { route, score, index };
    };
    /**
     * Give a score to all routes and sort them on that
     * If two routes have the exact same score, we go by index instead
     * @param {object[]} routes
     * @return {object[]}
     */
    const rankRoutes = (routes) =>
        routes
            .map(rankRoute)
            .sort((a, b) =>
                a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
            );
    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    const pick = (routes, uri) => {
        let match;
        let default_;

        const [uriPathname] = uri.split("?");
        const uriSegments = segmentize(uriPathname);
        const isRootUri = uriSegments[0] === "";
        const ranked = rankRoutes(routes);

        for (let i = 0, l = ranked.length; i < l; i++) {
            const route = ranked[i].route;
            let missed = false;

            if (route.default) {
                default_ = {
                    route,
                    params: {},
                    uri,
                };
                continue;
            }

            const routeSegments = segmentize(route.path);
            const params = {};
            const max = Math.max(uriSegments.length, routeSegments.length);
            let index = 0;

            for (; index < max; index++) {
                const routeSegment = routeSegments[index];
                const uriSegment = uriSegments[index];

                if (routeSegment && routeSegment[0] === "*") {
                    // Hit a splat, just grab the rest, and return a match
                    // uri:   /files/documents/work
                    // route: /files/* or /files/*splatname
                    const splatName =
                        routeSegment === "*" ? "*" : routeSegment.slice(1);

                    params[splatName] = uriSegments
                        .slice(index)
                        .map(decodeURIComponent)
                        .join("/");
                    break;
                }

                if (typeof uriSegment === "undefined") {
                    // URI is shorter than the route, no match
                    // uri:   /users
                    // route: /users/:userId
                    missed = true;
                    break;
                }

                const dynamicMatch = PARAM.exec(routeSegment);

                if (dynamicMatch && !isRootUri) {
                    const value = decodeURIComponent(uriSegment);
                    params[dynamicMatch[1]] = value;
                } else if (routeSegment !== uriSegment) {
                    // Current segments don't match, not dynamic, not splat, so no match
                    // uri:   /users/123/settings
                    // route: /users/:id/profile
                    missed = true;
                    break;
                }
            }

            if (!missed) {
                match = {
                    route,
                    params,
                    uri: "/" + uriSegments.slice(0, index).join("/"),
                };
                break;
            }
        }

        return match || default_ || null;
    };
    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    const addQuery = (pathname, query) => pathname + (query ? `?${query}` : "");
    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    const resolve$1 = (to, base) => {
        // /foo/bar, /baz/qux => /foo/bar
        if (to.startsWith("/")) return to;

        const [toPathname, toQuery] = to.split("?");
        const [basePathname] = base.split("?");
        const toSegments = segmentize(toPathname);
        const baseSegments = segmentize(basePathname);

        // ?a=b, /users?b=c => /users?a=b
        if (toSegments[0] === "") return addQuery(basePathname, toQuery);

        // profile, /users/789 => /users/789/profile

        if (!toSegments[0].startsWith(".")) {
            const pathname = baseSegments.concat(toSegments).join("/");
            return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
        }

        // ./       , /users/123 => /users/123
        // ../      , /users/123 => /users
        // ../..    , /users/123 => /
        // ../../one, /a/b/c/d   => /a/b/one
        // .././one , /a/b/c/d   => /a/b/c/one
        const allSegments = baseSegments.concat(toSegments);
        const segments = [];

        allSegments.forEach((segment) => {
            if (segment === "..") segments.pop();
            else if (segment !== ".") segments.push(segment);
        });

        return addQuery("/" + segments.join("/"), toQuery);
    };
    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    const combinePaths = (basepath, path) =>
        `${stripSlashes(
        path === "/"
            ? basepath
            : `${stripSlashes(basepath)}/${stripSlashes(path)}`
    )}/`;
    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    const shouldNavigate = (event) =>
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

    const canUseDOM = () =>
        typeof window !== "undefined" &&
        "document" in window &&
        "location" in window;

    /* node_modules\svelte-routing\src\Link.svelte generated by Svelte v3.59.2 */
    const file$j = "node_modules\\svelte-routing\\src\\Link.svelte";
    const get_default_slot_changes$2 = dirty => ({ active: dirty & /*ariaCurrent*/ 4 });
    const get_default_slot_context$2 = ctx => ({ active: !!/*ariaCurrent*/ ctx[2] });

    function create_fragment$k(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], get_default_slot_context$2);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1],
    		/*$$restProps*/ ctx[6]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$j, 41, 0, 1414);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, ariaCurrent*/ 65540)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[16],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[16])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[16], dirty, get_default_slot_changes$2),
    						get_default_slot_context$2
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let ariaCurrent;
    	const omit_props_names = ["to","replace","state","getProps","preserveScroll"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	let { preserveScroll = false } = $$props;
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(14, $location = value));
    	const { base } = getContext(ROUTER);
    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(15, $base = value));
    	const { navigate } = getContext(HISTORY);
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	const onClick = event => {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, {
    				state,
    				replace: shouldReplace,
    				preserveScroll
    			});
    		}
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('preserveScroll' in $$new_props) $$invalidate(11, preserveScroll = $$new_props.preserveScroll);
    		if ('$$scope' in $$new_props) $$invalidate(16, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		getContext,
    		HISTORY,
    		LOCATION,
    		ROUTER,
    		resolve: resolve$1,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		preserveScroll,
    		location,
    		base,
    		navigate,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		ariaCurrent,
    		$location,
    		$base
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('to' in $$props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('preserveScroll' in $$props) $$invalidate(11, preserveScroll = $$new_props.preserveScroll);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(12, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('isCurrent' in $$props) $$invalidate(13, isCurrent = $$new_props.isCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 32896) {
    			$$invalidate(0, href = resolve$1(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 16385) {
    			$$invalidate(12, isPartiallyCurrent = $location.pathname.startsWith(href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 16385) {
    			$$invalidate(13, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 8192) {
    			$$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		$$invalidate(1, props = getProps({
    			location: $location,
    			href,
    			isPartiallyCurrent,
    			isCurrent,
    			existingProps: $$restProps
    		}));
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		location,
    		base,
    		onClick,
    		$$restProps,
    		to,
    		replace,
    		state,
    		getProps,
    		preserveScroll,
    		isPartiallyCurrent,
    		isCurrent,
    		$location,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$1(this, options, instance$k, create_fragment$k, safe_not_equal, {
    			to: 7,
    			replace: 8,
    			state: 9,
    			getProps: 10,
    			preserveScroll: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get preserveScroll() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set preserveScroll(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Route.svelte generated by Svelte v3.59.2 */
    const get_default_slot_changes$1 = dirty => ({ params: dirty & /*routeParams*/ 4 });
    const get_default_slot_context$1 = ctx => ({ params: /*routeParams*/ ctx[2] });

    // (42:0) {#if $activeRoute && $activeRoute.route === route}
    function create_if_block$c(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$4, create_else_block$8];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(42:0) {#if $activeRoute && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (51:4) {:else}
    function create_else_block$8(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, routeParams*/ 132)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(51:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (43:4) {#if component}
    function create_if_block_1$4(ctx) {
    	let await_block_anchor;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 12,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*component*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*component*/ 1 && promise !== (promise = /*component*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(43:4) {#if component}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>     import { getContext, onDestroy }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop$1,
    		m: noop$1,
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: noop$1
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>     import { getContext, onDestroy }",
    		ctx
    	});

    	return block;
    }

    // (44:49)              <svelte:component                 this={resolvedComponent?.default || resolvedComponent}
    function create_then_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*routeParams*/ ctx[2], /*routeProps*/ ctx[3]];
    	var switch_value = /*resolvedComponent*/ ctx[12]?.default || /*resolvedComponent*/ ctx[12];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*routeParams, routeProps*/ 12)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (dirty & /*component*/ 1 && switch_value !== (switch_value = /*resolvedComponent*/ ctx[12]?.default || /*resolvedComponent*/ ctx[12])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(44:49)              <svelte:component                 this={resolvedComponent?.default || resolvedComponent}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>     import { getContext, onDestroy }
    function create_pending_block(ctx) {
    	const block = {
    		c: noop$1,
    		m: noop$1,
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: noop$1
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(1:0) <script>     import { getContext, onDestroy }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[5] && create_if_block$c(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$c(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	let routeParams = {};
    	let routeProps = {};
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	registerRoute(route);

    	onDestroy(() => {
    		unregisterRoute(route);
    	});

    	$$self.$$set = $$new_props => {
    		$$invalidate(11, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('path' in $$new_props) $$invalidate(6, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		canUseDOM,
    		path,
    		component,
    		routeParams,
    		routeProps,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		route,
    		$activeRoute
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(11, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(6, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('routeParams' in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ('routeProps' in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($activeRoute && $activeRoute.route === route) {
    			$$invalidate(2, routeParams = $activeRoute.params);
    			const { component: c, path, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);

    			if (c) {
    				if (c.toString().startsWith("class ")) $$invalidate(0, component = c); else $$invalidate(0, component = c());
    			}

    			canUseDOM() && !$activeRoute.preserveScroll && window?.scrollTo(0, 0);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		activeRoute,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$j, create_fragment$j, safe_not_equal, { path: 6, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier} [start]
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop$1) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let started = false;
            const values = [];
            let pending = 0;
            let cleanup = noop$1;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop$1;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (started) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            started = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
                // We need to set this to false because callbacks can still happen despite having unsubscribed:
                // Callbacks might already be placed in the queue which doesn't know it should no longer
                // invoke this derived store.
                started = false;
            };
        });
    }

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const getLocation = (source) => {
        return {
            ...source.location,
            state: source.history.state,
            key: (source.history.state && source.history.state.key) || "initial",
        };
    };
    const createHistory = (source) => {
        const listeners = [];
        let location = getLocation(source);

        return {
            get location() {
                return location;
            },

            listen(listener) {
                listeners.push(listener);

                const popstateListener = () => {
                    location = getLocation(source);
                    listener({ location, action: "POP" });
                };

                source.addEventListener("popstate", popstateListener);

                return () => {
                    source.removeEventListener("popstate", popstateListener);
                    const index = listeners.indexOf(listener);
                    listeners.splice(index, 1);
                };
            },

            navigate(to, { state, replace = false, preserveScroll = false, blurActiveElement = true } = {}) {
                state = { ...state, key: Date.now() + "" };
                // try...catch iOS Safari limits to 100 pushState calls
                try {
                    if (replace) source.history.replaceState(state, "", to);
                    else source.history.pushState(state, "", to);
                } catch (e) {
                    source.location[replace ? "replace" : "assign"](to);
                }
                location = getLocation(source);
                listeners.forEach((listener) =>
                    listener({ location, action: "PUSH", preserveScroll })
                );
                if(blurActiveElement) document.activeElement.blur();
            },
        };
    };
    // Stores history entries in memory for testing or other platforms like Native
    const createMemorySource = (initialPathname = "/") => {
        let index = 0;
        const stack = [{ pathname: initialPathname, search: "" }];
        const states = [];

        return {
            get location() {
                return stack[index];
            },
            addEventListener(name, fn) {},
            removeEventListener(name, fn) {},
            history: {
                get entries() {
                    return stack;
                },
                get index() {
                    return index;
                },
                get state() {
                    return states[index];
                },
                pushState(state, _, uri) {
                    const [pathname, search = ""] = uri.split("?");
                    index++;
                    stack.push({ pathname, search });
                    states.push(state);
                },
                replaceState(state, _, uri) {
                    const [pathname, search = ""] = uri.split("?");
                    stack[index] = { pathname, search };
                    states[index] = state;
                },
            },
        };
    };
    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const globalHistory = createHistory(
        canUseDOM() ? window : createMemorySource()
    );
    const { navigate } = globalHistory;

    /* node_modules\svelte-routing\src\Router.svelte generated by Svelte v3.59.2 */

    const { Object: Object_1$1 } = globals;
    const file$i = "node_modules\\svelte-routing\\src\\Router.svelte";

    const get_default_slot_changes_1 = dirty => ({
    	route: dirty & /*$activeRoute*/ 4,
    	location: dirty & /*$location*/ 2
    });

    const get_default_slot_context_1 = ctx => ({
    	route: /*$activeRoute*/ ctx[2] && /*$activeRoute*/ ctx[2].uri,
    	location: /*$location*/ ctx[1]
    });

    const get_default_slot_changes = dirty => ({
    	route: dirty & /*$activeRoute*/ 4,
    	location: dirty & /*$location*/ 2
    });

    const get_default_slot_context = ctx => ({
    	route: /*$activeRoute*/ ctx[2] && /*$activeRoute*/ ctx[2].uri,
    	location: /*$location*/ ctx[1]
    });

    // (143:0) {:else}
    function create_else_block$7(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], get_default_slot_context_1);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $activeRoute, $location*/ 16390)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, get_default_slot_changes_1),
    						get_default_slot_context_1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(143:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (134:0) {#if viewtransition}
    function create_if_block$b(ctx) {
    	let previous_key = /*$location*/ ctx[1].pathname;
    	let key_block_anchor;
    	let current;
    	let key_block = create_key_block$3(ctx);

    	const block = {
    		c: function create() {
    			key_block.c();
    			key_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			key_block.m(target, anchor);
    			insert_dev(target, key_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$location*/ 2 && safe_not_equal(previous_key, previous_key = /*$location*/ ctx[1].pathname)) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop$1);
    				check_outros();
    				key_block = create_key_block$3(ctx);
    				key_block.c();
    				transition_in(key_block, 1);
    				key_block.m(key_block_anchor.parentNode, key_block_anchor);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(key_block_anchor);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(134:0) {#if viewtransition}",
    		ctx
    	});

    	return block;
    }

    // (135:4) {#key $location.pathname}
    function create_key_block$3(ctx) {
    	let div;
    	let div_intro;
    	let div_outro;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], get_default_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			add_location(div, file$i, 135, 8, 4659);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $activeRoute, $location*/ 16390)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!current) return;
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, /*viewtransitionFn*/ ctx[3], {});
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, /*viewtransitionFn*/ ctx[3], {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block$3.name,
    		type: "key",
    		source: "(135:4) {#key $location.pathname}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$b, create_else_block$7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*viewtransition*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $base;
    	let $activeRoute;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	let { viewtransition = null } = $$props;
    	let { history = globalHistory } = $$props;

    	const viewtransitionFn = (node, _, direction) => {
    		const vt = viewtransition(direction);
    		if (typeof vt?.fn === "function") return vt.fn(node, vt); else return vt;
    	};

    	setContext(HISTORY, history);
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(12, $routes = value));
    	const activeRoute = writable(null);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(2, $activeRoute = value));
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : history.location);

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(1, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(13, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (!activeRoute) return base;

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	const registerRoute = route => {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) return;

    			const matchingRoute = pick([route], $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => [...rs, route]);
    		}
    	};

    	const unregisterRoute = route => {
    		routes.update(rs => rs.filter(r => r !== route));
    	};

    	let preserveScroll = false;

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = history.listen(event => {
    				$$invalidate(11, preserveScroll = event.preserveScroll || false);
    				location.set(event.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ['basepath', 'url', 'viewtransition', 'history'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(8, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(9, url = $$props.url);
    		if ('viewtransition' in $$props) $$invalidate(0, viewtransition = $$props.viewtransition);
    		if ('history' in $$props) $$invalidate(10, history = $$props.history);
    		if ('$$scope' in $$props) $$invalidate(14, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onMount,
    		setContext,
    		derived,
    		writable,
    		HISTORY,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		combinePaths,
    		pick,
    		basepath,
    		url,
    		viewtransition,
    		history,
    		viewtransitionFn,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		preserveScroll,
    		$location,
    		$routes,
    		$base,
    		$activeRoute
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(8, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(9, url = $$props.url);
    		if ('viewtransition' in $$props) $$invalidate(0, viewtransition = $$props.viewtransition);
    		if ('history' in $$props) $$invalidate(10, history = $$props.history);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    		if ('preserveScroll' in $$props) $$invalidate(11, preserveScroll = $$props.preserveScroll);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 8192) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;
    				routes.update(rs => rs.map(r => Object.assign(r, { path: combinePaths(basepath, r._path) })));
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location, preserveScroll*/ 6146) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch ? { ...bestMatch, preserveScroll } : bestMatch);
    			}
    		}
    	};

    	return [
    		viewtransition,
    		$location,
    		$activeRoute,
    		viewtransitionFn,
    		routes,
    		activeRoute,
    		location,
    		base,
    		basepath,
    		url,
    		history,
    		preserveScroll,
    		$routes,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$1(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			basepath: 8,
    			url: 9,
    			viewtransition: 0,
    			history: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewtransition() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewtransition(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get history() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\Home.svelte generated by Svelte v3.59.2 */

    const file$h = "src\\routes\\Home.svelte";

    function create_fragment$h(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let h10;
    	let t2;
    	let h11;

    	const block = {
    		c: function create() {
    			img = element("img");
    			t0 = space();
    			h10 = element("h1");
    			h10.textContent = "Under Construction";
    			t2 = space();
    			h11 = element("h1");
    			h11.textContent = "工事中";
    			if (!src_url_equal(img.src, img_src_value = "../image/placeholder.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Placeholder");
    			add_location(img, file$h, 4, 0, 25);
    			add_location(h10, file$h, 5, 0, 82);
    			add_location(h11, file$h, 6, 0, 111);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h10, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, h11, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h10);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(h11);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src\components\ButtonLink.svelte generated by Svelte v3.59.2 */

    const file$g = "src\\components\\ButtonLink.svelte";

    // (19:4) {#if logo !== ""}
    function create_if_block$a(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*logo*/ ctx[4])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1o9eyxq");
    			add_location(img, file$g, 18, 21, 520);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*logo*/ 16 && !src_url_equal(img.src, img_src_value = /*logo*/ ctx[4])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(19:4) {#if logo !== \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div;
    	let t0;
    	let a;
    	let t1;
    	let mounted;
    	let dispose;
    	let if_block = /*logo*/ ctx[4] !== "" && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			a = element("a");
    			t1 = text(/*text*/ ctx[3]);
    			attr_dev(a, "href", /*href*/ ctx[2]);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-1o9eyxq");
    			add_location(a, file$g, 19, 4, 555);
    			attr_dev(div, "class", "button svelte-1o9eyxq");

    			set_style(div, "background-image", "linear-gradient(" + (/*isActive*/ ctx[5]
    			? /*color2*/ ctx[1]
    			: /*color1*/ ctx[0]) + ", " + (/*isActive*/ ctx[5]
    			? /*color1*/ ctx[0]
    			: /*color2*/ ctx[1]) + ")");

    			add_location(div, file$g, 11, 0, 228);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t0);
    			append_dev(div, a);
    			append_dev(a, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mousedown", /*mousedown_handler*/ ctx[6], false, false, false, false),
    					listen_dev(div, "mouseup", /*mouseup_handler*/ ctx[7], false, false, false, false),
    					listen_dev(div, "mouseleave", /*mouseleave_handler*/ ctx[8], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*logo*/ ctx[4] !== "") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$a(ctx);
    					if_block.c();
    					if_block.m(div, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*text*/ 8) set_data_dev(t1, /*text*/ ctx[3]);

    			if (dirty & /*href*/ 4) {
    				attr_dev(a, "href", /*href*/ ctx[2]);
    			}

    			if (dirty & /*isActive, color2, color1*/ 35) {
    				set_style(div, "background-image", "linear-gradient(" + (/*isActive*/ ctx[5]
    				? /*color2*/ ctx[1]
    				: /*color1*/ ctx[0]) + ", " + (/*isActive*/ ctx[5]
    				? /*color1*/ ctx[0]
    				: /*color2*/ ctx[1]) + ")");
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ButtonLink', slots, []);
    	let { color1 = "rgb(255, 133, 62)" } = $$props;
    	let { color2 = "rgb(255, 102, 42)" } = $$props;
    	let { href = "#" } = $$props;
    	let { text = "" } = $$props;
    	let { logo = "" } = $$props;
    	let isActive = false;
    	const writable_props = ['color1', 'color2', 'href', 'text', 'logo'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ButtonLink> was created with unknown prop '${key}'`);
    	});

    	const mousedown_handler = () => $$invalidate(5, isActive = true);
    	const mouseup_handler = () => $$invalidate(5, isActive = false);
    	const mouseleave_handler = () => $$invalidate(5, isActive = false);

    	$$self.$$set = $$props => {
    		if ('color1' in $$props) $$invalidate(0, color1 = $$props.color1);
    		if ('color2' in $$props) $$invalidate(1, color2 = $$props.color2);
    		if ('href' in $$props) $$invalidate(2, href = $$props.href);
    		if ('text' in $$props) $$invalidate(3, text = $$props.text);
    		if ('logo' in $$props) $$invalidate(4, logo = $$props.logo);
    	};

    	$$self.$capture_state = () => ({
    		color1,
    		color2,
    		href,
    		text,
    		logo,
    		isActive
    	});

    	$$self.$inject_state = $$props => {
    		if ('color1' in $$props) $$invalidate(0, color1 = $$props.color1);
    		if ('color2' in $$props) $$invalidate(1, color2 = $$props.color2);
    		if ('href' in $$props) $$invalidate(2, href = $$props.href);
    		if ('text' in $$props) $$invalidate(3, text = $$props.text);
    		if ('logo' in $$props) $$invalidate(4, logo = $$props.logo);
    		if ('isActive' in $$props) $$invalidate(5, isActive = $$props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		color1,
    		color2,
    		href,
    		text,
    		logo,
    		isActive,
    		mousedown_handler,
    		mouseup_handler,
    		mouseleave_handler
    	];
    }

    class ButtonLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$1(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			color1: 0,
    			color2: 1,
    			href: 2,
    			text: 3,
    			logo: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ButtonLink",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get color1() {
    		throw new Error("<ButtonLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color1(value) {
    		throw new Error("<ButtonLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color2() {
    		throw new Error("<ButtonLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color2(value) {
    		throw new Error("<ButtonLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<ButtonLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<ButtonLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<ButtonLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<ButtonLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get logo() {
    		throw new Error("<ButtonLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set logo(value) {
    		throw new Error("<ButtonLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\Download.svelte generated by Svelte v3.59.2 */
    const file$f = "src\\routes\\Download.svelte";

    // (53:46) {:else}
    function create_else_block_3(ctx) {
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text("Current Version: ");
    			t1 = text(/*download_version*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*download_version*/ 2) set_data_dev(t1, /*download_version*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(53:46) {:else}",
    		ctx
    	});

    	return block;
    }

    // (53:4) {#if Fetching}
    function create_if_block_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Current Version: Fetching...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(53:4) {#if Fetching}",
    		ctx
    	});

    	return block;
    }

    // (75:4) {:else}
    function create_else_block_2(ctx) {
    	let buttonlink0;
    	let t0;
    	let buttonlink1;
    	let t1;
    	let buttonlink2;
    	let current;

    	buttonlink0 = new ButtonLink({
    			props: {
    				href: /*download_exe*/ ctx[4],
    				text: "Download (.exe)",
    				logo: "image/windows.png"
    			},
    			$$inline: true
    		});

    	buttonlink1 = new ButtonLink({
    			props: {
    				href: /*download_deb*/ ctx[3],
    				text: "Download (.deb)",
    				logo: "image/linux.png"
    			},
    			$$inline: true
    		});

    	buttonlink2 = new ButtonLink({
    			props: {
    				href: /*download_app*/ ctx[2],
    				text: "Download (.AppImage)",
    				logo: "image/linux.png"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(buttonlink0.$$.fragment);
    			t0 = space();
    			create_component(buttonlink1.$$.fragment);
    			t1 = space();
    			create_component(buttonlink2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(buttonlink0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(buttonlink1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(buttonlink2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const buttonlink0_changes = {};
    			if (dirty & /*download_exe*/ 16) buttonlink0_changes.href = /*download_exe*/ ctx[4];
    			buttonlink0.$set(buttonlink0_changes);
    			const buttonlink1_changes = {};
    			if (dirty & /*download_deb*/ 8) buttonlink1_changes.href = /*download_deb*/ ctx[3];
    			buttonlink1.$set(buttonlink1_changes);
    			const buttonlink2_changes = {};
    			if (dirty & /*download_app*/ 4) buttonlink2_changes.href = /*download_app*/ ctx[2];
    			buttonlink2.$set(buttonlink2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttonlink0.$$.fragment, local);
    			transition_in(buttonlink1.$$.fragment, local);
    			transition_in(buttonlink2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buttonlink0.$$.fragment, local);
    			transition_out(buttonlink1.$$.fragment, local);
    			transition_out(buttonlink2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(buttonlink0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(buttonlink1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(buttonlink2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(75:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (56:4) {#if Fetching === true}
    function create_if_block_2(ctx) {
    	let buttonlink0;
    	let t0;
    	let buttonlink1;
    	let t1;
    	let buttonlink2;
    	let current;

    	buttonlink0 = new ButtonLink({
    			props: {
    				text: "Fetching...",
    				color1: "rgb(80, 80, 80)",
    				color2: "rgb(60, 60, 60)",
    				logo: "image/windows.png"
    			},
    			$$inline: true
    		});

    	buttonlink1 = new ButtonLink({
    			props: {
    				text: "Fetching...",
    				color1: "rgb(80, 80, 80)",
    				color2: "rgb(60, 60, 60)",
    				logo: "image/linux.png"
    			},
    			$$inline: true
    		});

    	buttonlink2 = new ButtonLink({
    			props: {
    				text: "Fetching...",
    				color1: "rgb(80, 80, 80)",
    				color2: "rgb(60, 60, 60)",
    				logo: "image/linux.png"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(buttonlink0.$$.fragment);
    			t0 = space();
    			create_component(buttonlink1.$$.fragment);
    			t1 = space();
    			create_component(buttonlink2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(buttonlink0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(buttonlink1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(buttonlink2, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttonlink0.$$.fragment, local);
    			transition_in(buttonlink1.$$.fragment, local);
    			transition_in(buttonlink2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buttonlink0.$$.fragment, local);
    			transition_out(buttonlink1.$$.fragment, local);
    			transition_out(buttonlink2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(buttonlink0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(buttonlink1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(buttonlink2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(56:4) {#if Fetching === true}",
    		ctx
    	});

    	return block;
    }

    // (99:46) {:else}
    function create_else_block_1$2(ctx) {
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text("Current Version: ");
    			t1 = text(/*game_version*/ ctx[5]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*game_version*/ 32) set_data_dev(t1, /*game_version*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$2.name,
    		type: "else",
    		source: "(99:46) {:else}",
    		ctx
    	});

    	return block;
    }

    // (99:4) {#if Fetching}
    function create_if_block_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Current Version: Fetching...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(99:4) {#if Fetching}",
    		ctx
    	});

    	return block;
    }

    // (114:4) {:else}
    function create_else_block$6(ctx) {
    	let buttonlink0;
    	let t;
    	let buttonlink1;
    	let current;

    	buttonlink0 = new ButtonLink({
    			props: {
    				href: /*game_win*/ ctx[6],
    				text: "Download (Windows x64)",
    				logo: "image/windows.png"
    			},
    			$$inline: true
    		});

    	buttonlink1 = new ButtonLink({
    			props: {
    				href: /*game_linux*/ ctx[7],
    				text: "Download (Linux x64)",
    				logo: "image/linux.png"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(buttonlink0.$$.fragment);
    			t = space();
    			create_component(buttonlink1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(buttonlink0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(buttonlink1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const buttonlink0_changes = {};
    			if (dirty & /*game_win*/ 64) buttonlink0_changes.href = /*game_win*/ ctx[6];
    			buttonlink0.$set(buttonlink0_changes);
    			const buttonlink1_changes = {};
    			if (dirty & /*game_linux*/ 128) buttonlink1_changes.href = /*game_linux*/ ctx[7];
    			buttonlink1.$set(buttonlink1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttonlink0.$$.fragment, local);
    			transition_in(buttonlink1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buttonlink0.$$.fragment, local);
    			transition_out(buttonlink1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(buttonlink0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(buttonlink1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(114:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (101:4) {#if Fetching === true}
    function create_if_block$9(ctx) {
    	let buttonlink0;
    	let t;
    	let buttonlink1;
    	let current;

    	buttonlink0 = new ButtonLink({
    			props: {
    				text: "Fetching...",
    				color1: "rgb(80, 80, 80)",
    				color2: "rgb(60, 60, 60)",
    				logo: "image/windows.png"
    			},
    			$$inline: true
    		});

    	buttonlink1 = new ButtonLink({
    			props: {
    				text: "Fetching...",
    				color1: "rgb(80, 80, 80)",
    				color2: "rgb(60, 60, 60)",
    				logo: "image/linux.png"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(buttonlink0.$$.fragment);
    			t = space();
    			create_component(buttonlink1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(buttonlink0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(buttonlink1, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttonlink0.$$.fragment, local);
    			transition_in(buttonlink1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buttonlink0.$$.fragment, local);
    			transition_out(buttonlink1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(buttonlink0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(buttonlink1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(101:4) {#if Fetching === true}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let separator0;
    	let t4;
    	let h20;
    	let t6;
    	let p1;
    	let t8;
    	let h30;
    	let t9;
    	let div0;
    	let current_block_type_index;
    	let if_block1;
    	let t10;
    	let separator1;
    	let t11;
    	let h21;
    	let t13;
    	let p2;
    	let t15;
    	let p3;
    	let i;
    	let t17;
    	let h31;
    	let t18;
    	let div1;
    	let current_block_type_index_1;
    	let if_block3;
    	let t19;
    	let separator2;
    	let t20;
    	let h22;
    	let t22;
    	let p4;
    	let t24;
    	let div2;
    	let buttonlink0;
    	let t25;
    	let buttonlink1;
    	let current;

    	function select_block_type(ctx, dirty) {
    		if (/*Fetching*/ ctx[0]) return create_if_block_3;
    		return create_else_block_3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	const if_block_creators = [create_if_block_2, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*Fetching*/ ctx[0] === true) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	function select_block_type_2(ctx, dirty) {
    		if (/*Fetching*/ ctx[0]) return create_if_block_1$3;
    		return create_else_block_1$2;
    	}

    	let current_block_type_1 = select_block_type_2(ctx);
    	let if_block2 = current_block_type_1(ctx);
    	const if_block_creators_1 = [create_if_block$9, create_else_block$6];
    	const if_blocks_1 = [];

    	function select_block_type_3(ctx, dirty) {
    		if (/*Fetching*/ ctx[0] === true) return 0;
    		return 1;
    	}

    	current_block_type_index_1 = select_block_type_3(ctx);
    	if_block3 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);

    	buttonlink0 = new ButtonLink({
    			props: {
    				href: "https://github.com/0auBSQ/OpenTaiko",
    				text: "Main Repository",
    				color1: "rgb(53, 157, 255)",
    				color2: "rgb(42, 117, 255)"
    			},
    			$$inline: true
    		});

    	buttonlink1 = new ButtonLink({
    			props: {
    				href: "https://github.com/OpenTaiko",
    				text: "GitHub Organization",
    				color1: "rgb(53, 157, 255)",
    				color2: "rgb(42, 117, 255)"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Download";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "OpenTaiko is available for Windows, and is also available for Linux under experimental builds.";
    			t3 = space();
    			separator0 = element("separator");
    			t4 = space();
    			h20 = element("h2");
    			h20.textContent = "OpenTaiko Hub";
    			t6 = space();
    			p1 = element("p");
    			p1.textContent = "Installer & updater for the base game, songs, skins, characters, and more.";
    			t8 = space();
    			h30 = element("h3");
    			if_block0.c();
    			t9 = space();
    			div0 = element("div");
    			if_block1.c();
    			t10 = space();
    			separator1 = element("separator");
    			t11 = space();
    			h21 = element("h2");
    			h21.textContent = "Standalone";
    			t13 = space();
    			p2 = element("p");
    			p2.textContent = "If you prefer to not use the installer, you can download OpenTaiko by itself here.";
    			t15 = space();
    			p3 = element("p");
    			i = element("i");
    			i.textContent = "This download does not come with any skins. You must download a skin separately, or else the game will not launch.";
    			t17 = space();
    			h31 = element("h3");
    			if_block2.c();
    			t18 = space();
    			div1 = element("div");
    			if_block3.c();
    			t19 = space();
    			separator2 = element("separator");
    			t20 = space();
    			h22 = element("h2");
    			h22.textContent = "Source Code & Assets";
    			t22 = space();
    			p4 = element("p");
    			p4.textContent = "Open-source repositories used for OpenTaiko. The main project is licensed under the MIT License, but other assets may have differing licenses. Please refer to each project's README for further details.";
    			t24 = space();
    			div2 = element("div");
    			create_component(buttonlink0.$$.fragment);
    			t25 = space();
    			create_component(buttonlink1.$$.fragment);
    			add_location(h1, file$f, 45, 0, 1832);
    			add_location(p0, file$f, 46, 0, 1851);
    			add_location(separator0, file$f, 48, 0, 1956);
    			add_location(h20, file$f, 50, 0, 1972);
    			add_location(p1, file$f, 51, 0, 1996);
    			add_location(h30, file$f, 52, 0, 2079);
    			attr_dev(div0, "class", "buttons svelte-1woiggu");
    			add_location(div0, file$f, 54, 0, 2181);
    			add_location(separator1, file$f, 93, 0, 3221);
    			add_location(h21, file$f, 95, 0, 3237);
    			add_location(p2, file$f, 96, 0, 3258);
    			add_location(i, file$f, 97, 3, 3352);
    			add_location(p3, file$f, 97, 0, 3349);
    			add_location(h31, file$f, 98, 0, 3479);
    			attr_dev(div1, "class", "buttons svelte-1woiggu");
    			add_location(div1, file$f, 99, 0, 3575);
    			add_location(separator2, file$f, 127, 0, 4301);
    			add_location(h22, file$f, 129, 0, 4317);
    			add_location(p4, file$f, 130, 0, 4348);
    			attr_dev(div2, "class", "buttons svelte-1woiggu");
    			add_location(div2, file$f, 132, 0, 4560);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, separator0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, h20, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, h30, anchor);
    			if_block0.m(h30, null);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, div0, anchor);
    			if_blocks[current_block_type_index].m(div0, null);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, separator1, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, h21, anchor);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, p2, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, p3, anchor);
    			append_dev(p3, i);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, h31, anchor);
    			if_block2.m(h31, null);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, div1, anchor);
    			if_blocks_1[current_block_type_index_1].m(div1, null);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, separator2, anchor);
    			insert_dev(target, t20, anchor);
    			insert_dev(target, h22, anchor);
    			insert_dev(target, t22, anchor);
    			insert_dev(target, p4, anchor);
    			insert_dev(target, t24, anchor);
    			insert_dev(target, div2, anchor);
    			mount_component(buttonlink0, div2, null);
    			append_dev(div2, t25);
    			mount_component(buttonlink1, div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(h30, null);
    				}
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div0, null);
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_2(ctx)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if_block2.d(1);
    				if_block2 = current_block_type_1(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(h31, null);
    				}
    			}

    			let previous_block_index_1 = current_block_type_index_1;
    			current_block_type_index_1 = select_block_type_3(ctx);

    			if (current_block_type_index_1 === previous_block_index_1) {
    				if_blocks_1[current_block_type_index_1].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
    					if_blocks_1[previous_block_index_1] = null;
    				});

    				check_outros();
    				if_block3 = if_blocks_1[current_block_type_index_1];

    				if (!if_block3) {
    					if_block3 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    					if_block3.c();
    				} else {
    					if_block3.p(ctx, dirty);
    				}

    				transition_in(if_block3, 1);
    				if_block3.m(div1, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			transition_in(if_block3);
    			transition_in(buttonlink0.$$.fragment, local);
    			transition_in(buttonlink1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			transition_out(if_block3);
    			transition_out(buttonlink0.$$.fragment, local);
    			transition_out(buttonlink1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(separator0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(h20);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(h30);
    			if_block0.d();
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(div0);
    			if_blocks[current_block_type_index].d();
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(separator1);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(h21);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(h31);
    			if_block2.d();
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(div1);
    			if_blocks_1[current_block_type_index_1].d();
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(separator2);
    			if (detaching) detach_dev(t20);
    			if (detaching) detach_dev(h22);
    			if (detaching) detach_dev(t22);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t24);
    			if (detaching) detach_dev(div2);
    			destroy_component(buttonlink0);
    			destroy_component(buttonlink1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Download', slots, []);
    	let Fetching = true;
    	let download_version = "";
    	let download_app = "#";
    	let download_deb = "#";
    	let download_exe = "#";
    	let DownloadsInfo = {};
    	let game_version = "";
    	let game_win = "#";
    	let game_linux = "#";
    	let GamesInfo = {};

    	const FetchDownloads = async () => {
    		$$invalidate(0, Fetching = true);
    		let download_text = await fetch("https://api.github.com/repos/OpenTaiko/OpenTaiko-Hub/releases/latest");
    		let download_text_value = (await download_text.text()).valueOf();
    		DownloadsInfo = JSON.parse(download_text_value);
    		$$invalidate(1, download_version = DownloadsInfo["tag_name"]);
    		$$invalidate(2, download_app = DownloadsInfo["assets"].find(asset => asset["browser_download_url"].endsWith(".AppImage"))["browser_download_url"]);
    		$$invalidate(3, download_deb = DownloadsInfo["assets"].find(asset => asset["browser_download_url"].endsWith(".deb"))["browser_download_url"]);
    		$$invalidate(4, download_exe = DownloadsInfo["assets"].find(asset => asset["browser_download_url"].endsWith(".exe"))["browser_download_url"]);
    		let game_text = await fetch("https://api.github.com/repos/0auBSQ/OpenTaiko/releases/latest");
    		let game_text_value = (await game_text.text()).valueOf();
    		GamesInfo = JSON.parse(game_text_value);
    		$$invalidate(5, game_version = GamesInfo["tag_name"]);
    		$$invalidate(6, game_win = GamesInfo["assets"].find(asset => asset["browser_download_url"].endsWith("Win.x64.zip"))["browser_download_url"]);
    		$$invalidate(7, game_linux = GamesInfo["assets"].find(asset => asset["browser_download_url"].endsWith("Linux.x64.zip"))["browser_download_url"]);
    		$$invalidate(0, Fetching = false);
    	};

    	onMount(async () => {
    		await FetchDownloads();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Download> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		ButtonLink,
    		Fetching,
    		download_version,
    		download_app,
    		download_deb,
    		download_exe,
    		DownloadsInfo,
    		game_version,
    		game_win,
    		game_linux,
    		GamesInfo,
    		FetchDownloads
    	});

    	$$self.$inject_state = $$props => {
    		if ('Fetching' in $$props) $$invalidate(0, Fetching = $$props.Fetching);
    		if ('download_version' in $$props) $$invalidate(1, download_version = $$props.download_version);
    		if ('download_app' in $$props) $$invalidate(2, download_app = $$props.download_app);
    		if ('download_deb' in $$props) $$invalidate(3, download_deb = $$props.download_deb);
    		if ('download_exe' in $$props) $$invalidate(4, download_exe = $$props.download_exe);
    		if ('DownloadsInfo' in $$props) DownloadsInfo = $$props.DownloadsInfo;
    		if ('game_version' in $$props) $$invalidate(5, game_version = $$props.game_version);
    		if ('game_win' in $$props) $$invalidate(6, game_win = $$props.game_win);
    		if ('game_linux' in $$props) $$invalidate(7, game_linux = $$props.game_linux);
    		if ('GamesInfo' in $$props) GamesInfo = $$props.GamesInfo;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		Fetching,
    		download_version,
    		download_app,
    		download_deb,
    		download_exe,
    		game_version,
    		game_win,
    		game_linux
    	];
    }

    class Download extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Download",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\components\Button.svelte generated by Svelte v3.59.2 */

    const file$e = "src\\components\\Button.svelte";

    function create_fragment$e(ctx) {
    	let div;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*text*/ ctx[3]);
    			attr_dev(div, "class", "button svelte-lxm1pr");

    			set_style(div, "background-image", "linear-gradient(" + (/*isActive*/ ctx[5]
    			? /*color2*/ ctx[1]
    			: /*color1*/ ctx[0]) + ", " + (/*isActive*/ ctx[5]
    			? /*color1*/ ctx[0]
    			: /*color2*/ ctx[1]) + ")");

    			set_style(div, "color", /*textColor*/ ctx[4]);
    			add_location(div, file$e, 12, 0, 299);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						div,
    						"click",
    						function () {
    							if (is_function(/*OnClick*/ ctx[2])) /*OnClick*/ ctx[2].apply(this, arguments);
    						},
    						false,
    						false,
    						false,
    						false
    					),
    					listen_dev(div, "mousedown", /*mousedown_handler*/ ctx[6], false, false, false, false),
    					listen_dev(div, "mouseup", /*mouseup_handler*/ ctx[7], false, false, false, false),
    					listen_dev(div, "mouseleave", /*mouseleave_handler*/ ctx[8], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (dirty & /*text*/ 8) set_data_dev(t, /*text*/ ctx[3]);

    			if (dirty & /*isActive, color2, color1*/ 35) {
    				set_style(div, "background-image", "linear-gradient(" + (/*isActive*/ ctx[5]
    				? /*color2*/ ctx[1]
    				: /*color1*/ ctx[0]) + ", " + (/*isActive*/ ctx[5]
    				? /*color1*/ ctx[0]
    				: /*color2*/ ctx[1]) + ")");
    			}

    			if (dirty & /*textColor*/ 16) {
    				set_style(div, "color", /*textColor*/ ctx[4]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, []);
    	let { color1 = "rgb(255, 133, 62)" } = $$props;
    	let { color2 = "rgb(255, 102, 42)" } = $$props;

    	let { OnClick = () => {
    		
    	} } = $$props;

    	let { text = "" } = $$props;
    	let { textColor = "" } = $$props;
    	let isActive = false;
    	const writable_props = ['color1', 'color2', 'OnClick', 'text', 'textColor'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	const mousedown_handler = () => $$invalidate(5, isActive = true);
    	const mouseup_handler = () => $$invalidate(5, isActive = false);
    	const mouseleave_handler = () => $$invalidate(5, isActive = false);

    	$$self.$$set = $$props => {
    		if ('color1' in $$props) $$invalidate(0, color1 = $$props.color1);
    		if ('color2' in $$props) $$invalidate(1, color2 = $$props.color2);
    		if ('OnClick' in $$props) $$invalidate(2, OnClick = $$props.OnClick);
    		if ('text' in $$props) $$invalidate(3, text = $$props.text);
    		if ('textColor' in $$props) $$invalidate(4, textColor = $$props.textColor);
    	};

    	$$self.$capture_state = () => ({
    		color1,
    		color2,
    		OnClick,
    		text,
    		textColor,
    		isActive
    	});

    	$$self.$inject_state = $$props => {
    		if ('color1' in $$props) $$invalidate(0, color1 = $$props.color1);
    		if ('color2' in $$props) $$invalidate(1, color2 = $$props.color2);
    		if ('OnClick' in $$props) $$invalidate(2, OnClick = $$props.OnClick);
    		if ('text' in $$props) $$invalidate(3, text = $$props.text);
    		if ('textColor' in $$props) $$invalidate(4, textColor = $$props.textColor);
    		if ('isActive' in $$props) $$invalidate(5, isActive = $$props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		color1,
    		color2,
    		OnClick,
    		text,
    		textColor,
    		isActive,
    		mousedown_handler,
    		mouseup_handler,
    		mouseleave_handler
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$1(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			color1: 0,
    			color2: 1,
    			OnClick: 2,
    			text: 3,
    			textColor: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get color1() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color1(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color2() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color2(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get OnClick() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set OnClick(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get textColor() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set textColor(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\CoolNumber.svelte generated by Svelte v3.59.2 */

    const file$d = "src\\components\\CoolNumber.svelte";

    // (40:4) {#if showPlus}
    function create_if_block$8(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "+";
    			attr_dev(span, "class", "plus svelte-lfkc09");
    			add_location(span, file$d, 40, 6, 1453);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(40:4) {#if showPlus}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div;
    	let span;
    	let t0;
    	let t1;
    	let if_block = /*showPlus*/ ctx[2] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text(/*intPart*/ ctx[1]);
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(span, "class", "number svelte-lfkc09");
    			set_style(span, "--color", /*color*/ ctx[0]);
    			add_location(span, file$d, 38, 4, 1363);
    			attr_dev(div, "class", "number-container svelte-lfkc09");
    			add_location(div, file$d, 37, 2, 1327);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(div, t1);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 1) {
    				set_style(span, "--color", /*color*/ ctx[0]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CoolNumber', slots, []);
    	let { number = 10.5 } = $$props;
    	let { color = 'red' } = $$props;
    	let intPart = Math.floor(number);
    	let showPlus = number >= 10 && number - intPart >= 0.5;
    	const writable_props = ['number', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CoolNumber> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('number' in $$props) $$invalidate(3, number = $$props.number);
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ number, color, intPart, showPlus });

    	$$self.$inject_state = $$props => {
    		if ('number' in $$props) $$invalidate(3, number = $$props.number);
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('intPart' in $$props) $$invalidate(1, intPart = $$props.intPart);
    		if ('showPlus' in $$props) $$invalidate(2, showPlus = $$props.showPlus);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, intPart, showPlus, number];
    }

    class CoolNumber extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$d, create_fragment$d, safe_not_equal, { number: 3, color: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CoolNumber",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get number() {
    		throw new Error("<CoolNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set number(value) {
    		throw new Error("<CoolNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<CoolNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<CoolNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\DifficultyBlock.svelte generated by Svelte v3.59.2 */
    const file$c = "src\\components\\DifficultyBlock.svelte";

    function create_fragment$c(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t;
    	let coolnumber;
    	let current;

    	coolnumber = new CoolNumber({
    			props: {
    				number: /*Level*/ ctx[1],
    				color: /*DifficultyColors*/ ctx[2][/*Difficulty*/ ctx[0]]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = space();
    			create_component(coolnumber.$$.fragment);
    			if (!src_url_equal(img.src, img_src_value = "/image/difficulty/" + /*Difficulty*/ ctx[0] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*Difficulty*/ ctx[0]);
    			add_location(img, file$c, 10, 4, 279);
    			attr_dev(div, "class", "difficulty_block svelte-16rpe79");
    			add_location(div, file$c, 9, 0, 243);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);
    			mount_component(coolnumber, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*Difficulty*/ 1 && !src_url_equal(img.src, img_src_value = "/image/difficulty/" + /*Difficulty*/ ctx[0] + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*Difficulty*/ 1) {
    				attr_dev(img, "alt", /*Difficulty*/ ctx[0]);
    			}

    			const coolnumber_changes = {};
    			if (dirty & /*Level*/ 2) coolnumber_changes.number = /*Level*/ ctx[1];
    			if (dirty & /*Difficulty*/ 1) coolnumber_changes.color = /*DifficultyColors*/ ctx[2][/*Difficulty*/ ctx[0]];
    			coolnumber.$set(coolnumber_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(coolnumber.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(coolnumber.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(coolnumber);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DifficultyBlock', slots, []);
    	let { Difficulty = -1 } = $$props;
    	let { Level } = $$props;
    	const DifficultyColors = ["aqua", "lime", "orange", "red", "violet", "#FF8C00", "#00008B"];

    	$$self.$$.on_mount.push(function () {
    		if (Level === undefined && !('Level' in $$props || $$self.$$.bound[$$self.$$.props['Level']])) {
    			console.warn("<DifficultyBlock> was created without expected prop 'Level'");
    		}
    	});

    	const writable_props = ['Difficulty', 'Level'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DifficultyBlock> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('Difficulty' in $$props) $$invalidate(0, Difficulty = $$props.Difficulty);
    		if ('Level' in $$props) $$invalidate(1, Level = $$props.Level);
    	};

    	$$self.$capture_state = () => ({
    		CoolNumber,
    		Difficulty,
    		Level,
    		DifficultyColors
    	});

    	$$self.$inject_state = $$props => {
    		if ('Difficulty' in $$props) $$invalidate(0, Difficulty = $$props.Difficulty);
    		if ('Level' in $$props) $$invalidate(1, Level = $$props.Level);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [Difficulty, Level, DifficultyColors];
    }

    class DifficultyBlock extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$c, create_fragment$c, safe_not_equal, { Difficulty: 0, Level: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DifficultyBlock",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get Difficulty() {
    		throw new Error("<DifficultyBlock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Difficulty(value) {
    		throw new Error("<DifficultyBlock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Level() {
    		throw new Error("<DifficultyBlock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Level(value) {
    		throw new Error("<DifficultyBlock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\AudioPlayer.svelte generated by Svelte v3.59.2 */

    const { isNaN: isNaN_1 } = globals;
    const file$b = "src\\components\\AudioPlayer.svelte";

    function create_fragment$b(ctx) {
    	let div9;
    	let audio;
    	let audio_src_value;
    	let audio_updating = false;
    	let audio_animationframe;
    	let audio_is_paused = true;
    	let t0;
    	let button;
    	let button_aria_label_value;
    	let t1;
    	let div4;
    	let div0;
    	let strong;
    	let t2;
    	let t3;
    	let br;
    	let small;
    	let t4;
    	let t5;
    	let div3;
    	let span0;
    	let t6_value = format(/*time*/ ctx[3]) + "";
    	let t6;
    	let t7;
    	let div2;
    	let div1;
    	let t8;
    	let span1;

    	let t9_value = (/*duration*/ ctx[4]
    	? format(/*duration*/ ctx[4])
    	: '--:--') + "";

    	let t9;
    	let t10;
    	let div8;
    	let div5;
    	let div5_aria_label_value;
    	let t11;
    	let div7;
    	let div6;
    	let mounted;
    	let dispose;

    	function audio_timeupdate_handler() {
    		cancelAnimationFrame(audio_animationframe);

    		if (!audio.paused) {
    			audio_animationframe = raf(audio_timeupdate_handler);
    			audio_updating = true;
    		}

    		/*audio_timeupdate_handler*/ ctx[7].call(audio);
    	}

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			audio = element("audio");
    			t0 = space();
    			button = element("button");
    			t1 = space();
    			div4 = element("div");
    			div0 = element("div");
    			strong = element("strong");
    			t2 = text(/*Title*/ ctx[0]);
    			t3 = space();
    			br = element("br");
    			small = element("small");
    			t4 = text(/*Subtitle*/ ctx[1]);
    			t5 = space();
    			div3 = element("div");
    			span0 = element("span");
    			t6 = text(t6_value);
    			t7 = space();
    			div2 = element("div");
    			div1 = element("div");
    			t8 = space();
    			span1 = element("span");
    			t9 = text(t9_value);
    			t10 = space();
    			div8 = element("div");
    			div5 = element("div");
    			t11 = space();
    			div7 = element("div");
    			div6 = element("div");
    			if (!src_url_equal(audio.src, audio_src_value = /*AudioLink*/ ctx[2])) attr_dev(audio, "src", audio_src_value);
    			attr_dev(audio, "preload", "none");
    			if (/*duration*/ ctx[4] === void 0) add_render_callback(() => /*audio_durationchange_handler*/ ctx[8].call(audio));
    			add_location(audio, file$b, 21, 1, 426);
    			attr_dev(button, "class", "play svelte-tnkcyi");
    			attr_dev(button, "aria-label", button_aria_label_value = /*paused*/ ctx[5] ? 'play' : 'pause');
    			add_location(button, file$b, 33, 1, 602);
    			add_location(strong, file$b, 41, 3, 774);
    			add_location(br, file$b, 42, 3, 803);
    			add_location(small, file$b, 42, 8, 808);
    			attr_dev(div0, "class", "description svelte-tnkcyi");
    			add_location(div0, file$b, 40, 2, 744);
    			attr_dev(span0, "class", "svelte-tnkcyi");
    			add_location(span0, file$b, 46, 3, 872);
    			attr_dev(div1, "class", "progress svelte-tnkcyi");
    			set_style(div1, "--progress", /*time*/ ctx[3] / /*duration*/ ctx[4] + "%");
    			add_location(div1, file$b, 73, 4, 1461);
    			attr_dev(div2, "class", "slider svelte-tnkcyi");
    			add_location(div2, file$b, 47, 3, 904);
    			attr_dev(span1, "class", "svelte-tnkcyi");
    			add_location(span1, file$b, 75, 3, 1544);
    			attr_dev(div3, "class", "time svelte-tnkcyi");
    			add_location(div3, file$b, 45, 2, 849);
    			attr_dev(div4, "class", "info svelte-tnkcyi");
    			add_location(div4, file$b, 39, 1, 722);
    			attr_dev(div5, "class", "volume-icon svelte-tnkcyi");
    			attr_dev(div5, "aria-label", div5_aria_label_value = /*volume*/ ctx[6] === 0 ? 'muted' : 'unmuted');
    			add_location(div5, file$b, 81, 2, 1646);
    			attr_dev(div6, "class", "progress svelte-tnkcyi");
    			set_style(div6, "--progress", /*volume*/ ctx[6] * 100 + "%");
    			add_location(div6, file$b, 108, 3, 2294);
    			attr_dev(div7, "class", "volume-slider svelte-tnkcyi");
    			add_location(div7, file$b, 82, 2, 1729);
    			attr_dev(div8, "class", "volume svelte-tnkcyi");
    			add_location(div8, file$b, 80, 1, 1622);
    			attr_dev(div9, "class", "player svelte-tnkcyi");
    			toggle_class(div9, "paused", /*paused*/ ctx[5]);
    			add_location(div9, file$b, 20, 0, 390);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, audio);

    			if (!isNaN_1(/*volume*/ ctx[6])) {
    				audio.volume = /*volume*/ ctx[6];
    			}

    			append_dev(div9, t0);
    			append_dev(div9, button);
    			append_dev(div9, t1);
    			append_dev(div9, div4);
    			append_dev(div4, div0);
    			append_dev(div0, strong);
    			append_dev(strong, t2);
    			append_dev(div0, t3);
    			append_dev(div0, br);
    			append_dev(div0, small);
    			append_dev(small, t4);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			append_dev(div3, span0);
    			append_dev(span0, t6);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div3, t8);
    			append_dev(div3, span1);
    			append_dev(span1, t9);
    			append_dev(div9, t10);
    			append_dev(div9, div8);
    			append_dev(div8, div5);
    			append_dev(div8, t11);
    			append_dev(div8, div7);
    			append_dev(div7, div6);

    			if (!mounted) {
    				dispose = [
    					listen_dev(audio, "timeupdate", audio_timeupdate_handler),
    					listen_dev(audio, "durationchange", /*audio_durationchange_handler*/ ctx[8]),
    					listen_dev(audio, "play", /*audio_play_pause_handler*/ ctx[9]),
    					listen_dev(audio, "pause", /*audio_play_pause_handler*/ ctx[9]),
    					listen_dev(audio, "volumechange", /*audio_volumechange_handler*/ ctx[10]),
    					listen_dev(audio, "ended", /*ended_handler*/ ctx[11], false, false, false, false),
    					listen_dev(button, "click", /*click_handler*/ ctx[12], false, false, false, false),
    					listen_dev(div2, "pointerdown", /*pointerdown_handler*/ ctx[13], false, false, false, false),
    					listen_dev(div7, "pointerdown", /*pointerdown_handler_1*/ ctx[14], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*AudioLink*/ 4 && !src_url_equal(audio.src, audio_src_value = /*AudioLink*/ ctx[2])) {
    				attr_dev(audio, "src", audio_src_value);
    			}

    			if (!audio_updating && dirty & /*time*/ 8 && !isNaN_1(/*time*/ ctx[3])) {
    				audio.currentTime = /*time*/ ctx[3];
    			}

    			audio_updating = false;

    			if (dirty & /*paused*/ 32 && audio_is_paused !== (audio_is_paused = /*paused*/ ctx[5])) {
    				audio[audio_is_paused ? "pause" : "play"]();
    			}

    			if (dirty & /*volume*/ 64 && !isNaN_1(/*volume*/ ctx[6])) {
    				audio.volume = /*volume*/ ctx[6];
    			}

    			if (dirty & /*paused*/ 32 && button_aria_label_value !== (button_aria_label_value = /*paused*/ ctx[5] ? 'play' : 'pause')) {
    				attr_dev(button, "aria-label", button_aria_label_value);
    			}

    			if (dirty & /*Title*/ 1) set_data_dev(t2, /*Title*/ ctx[0]);
    			if (dirty & /*Subtitle*/ 2) set_data_dev(t4, /*Subtitle*/ ctx[1]);
    			if (dirty & /*time*/ 8 && t6_value !== (t6_value = format(/*time*/ ctx[3]) + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*time, duration*/ 24) {
    				set_style(div1, "--progress", /*time*/ ctx[3] / /*duration*/ ctx[4] + "%");
    			}

    			if (dirty & /*duration*/ 16 && t9_value !== (t9_value = (/*duration*/ ctx[4]
    			? format(/*duration*/ ctx[4])
    			: '--:--') + "")) set_data_dev(t9, t9_value);

    			if (dirty & /*volume*/ 64 && div5_aria_label_value !== (div5_aria_label_value = /*volume*/ ctx[6] === 0 ? 'muted' : 'unmuted')) {
    				attr_dev(div5, "aria-label", div5_aria_label_value);
    			}

    			if (dirty & /*volume*/ 64) {
    				set_style(div6, "--progress", /*volume*/ ctx[6] * 100 + "%");
    			}

    			if (dirty & /*paused*/ 32) {
    				toggle_class(div9, "paused", /*paused*/ ctx[5]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function format(time) {
    	if (isNaN(time)) return '...';
    	const minutes = Math.floor(time / 60);
    	const seconds = Math.floor(time % 60);
    	return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AudioPlayer', slots, []);
    	let { Title } = $$props;
    	let { Subtitle } = $$props;
    	let { AudioLink } = $$props;
    	let time = 0;
    	let duration = 0;
    	let paused = true;
    	let volume = 1;

    	$$self.$$.on_mount.push(function () {
    		if (Title === undefined && !('Title' in $$props || $$self.$$.bound[$$self.$$.props['Title']])) {
    			console.warn("<AudioPlayer> was created without expected prop 'Title'");
    		}

    		if (Subtitle === undefined && !('Subtitle' in $$props || $$self.$$.bound[$$self.$$.props['Subtitle']])) {
    			console.warn("<AudioPlayer> was created without expected prop 'Subtitle'");
    		}

    		if (AudioLink === undefined && !('AudioLink' in $$props || $$self.$$.bound[$$self.$$.props['AudioLink']])) {
    			console.warn("<AudioPlayer> was created without expected prop 'AudioLink'");
    		}
    	});

    	const writable_props = ['Title', 'Subtitle', 'AudioLink'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AudioPlayer> was created with unknown prop '${key}'`);
    	});

    	function audio_timeupdate_handler() {
    		time = this.currentTime;
    		$$invalidate(3, time);
    	}

    	function audio_durationchange_handler() {
    		duration = this.duration;
    		$$invalidate(4, duration);
    	}

    	function audio_play_pause_handler() {
    		paused = this.paused;
    		$$invalidate(5, paused);
    	}

    	function audio_volumechange_handler() {
    		volume = this.volume;
    		$$invalidate(6, volume);
    	}

    	const ended_handler = () => {
    		$$invalidate(3, time = 0);
    	};

    	const click_handler = () => $$invalidate(5, paused = !paused);

    	const pointerdown_handler = e => {
    		const div = e.currentTarget;

    		function seek(e) {
    			const { left, width } = div.getBoundingClientRect();
    			let p = (e.clientX - left) / width;
    			if (p < 0) p = 0;
    			if (p > 1) p = 1;
    			$$invalidate(3, time = p * duration);
    		}

    		seek(e);
    		window.addEventListener('pointermove', seek);

    		window.addEventListener(
    			'pointerup',
    			() => {
    				window.removeEventListener('pointermove', seek);
    			},
    			{ once: true }
    		);
    	};

    	const pointerdown_handler_1 = e => {
    		const div = e.currentTarget;

    		function adjustVolume(e) {
    			const { left, width } = div.getBoundingClientRect();
    			let p = (e.clientX - left) / width;
    			if (p < 0) p = 0;
    			if (p > 1) p = 1;
    			$$invalidate(6, volume = p);
    		}

    		adjustVolume(e);
    		window.addEventListener('pointermove', adjustVolume);

    		window.addEventListener(
    			'pointerup',
    			() => {
    				window.removeEventListener('pointermove', adjustVolume);
    			},
    			{ once: true }
    		);
    	};

    	$$self.$$set = $$props => {
    		if ('Title' in $$props) $$invalidate(0, Title = $$props.Title);
    		if ('Subtitle' in $$props) $$invalidate(1, Subtitle = $$props.Subtitle);
    		if ('AudioLink' in $$props) $$invalidate(2, AudioLink = $$props.AudioLink);
    	};

    	$$self.$capture_state = () => ({
    		Title,
    		Subtitle,
    		AudioLink,
    		time,
    		duration,
    		paused,
    		volume,
    		format
    	});

    	$$self.$inject_state = $$props => {
    		if ('Title' in $$props) $$invalidate(0, Title = $$props.Title);
    		if ('Subtitle' in $$props) $$invalidate(1, Subtitle = $$props.Subtitle);
    		if ('AudioLink' in $$props) $$invalidate(2, AudioLink = $$props.AudioLink);
    		if ('time' in $$props) $$invalidate(3, time = $$props.time);
    		if ('duration' in $$props) $$invalidate(4, duration = $$props.duration);
    		if ('paused' in $$props) $$invalidate(5, paused = $$props.paused);
    		if ('volume' in $$props) $$invalidate(6, volume = $$props.volume);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		Title,
    		Subtitle,
    		AudioLink,
    		time,
    		duration,
    		paused,
    		volume,
    		audio_timeupdate_handler,
    		audio_durationchange_handler,
    		audio_play_pause_handler,
    		audio_volumechange_handler,
    		ended_handler,
    		click_handler,
    		pointerdown_handler,
    		pointerdown_handler_1
    	];
    }

    class AudioPlayer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$b, create_fragment$b, safe_not_equal, { Title: 0, Subtitle: 1, AudioLink: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AudioPlayer",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get Title() {
    		throw new Error("<AudioPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Title(value) {
    		throw new Error("<AudioPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Subtitle() {
    		throw new Error("<AudioPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Subtitle(value) {
    		throw new Error("<AudioPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get AudioLink() {
    		throw new Error("<AudioPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set AudioLink(value) {
    		throw new Error("<AudioPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\SongBar.svelte generated by Svelte v3.59.2 */
    const file$a = "src\\components\\SongBar.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[15] = i;
    	return child_ctx;
    }

    // (30:4) {#if Rank !== undefined}
    function create_if_block_1$2(ctx) {
    	let div;
    	let span0;
    	let t0;
    	let t1;
    	let t2;
    	let span1;
    	let t4;
    	let span2;
    	let t5;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span0 = element("span");
    			t0 = text("#");
    			t1 = text(/*Rank*/ ctx[0]);
    			t2 = space();
    			span1 = element("span");
    			span1.textContent = "Max List Points:";
    			t4 = space();
    			span2 = element("span");
    			t5 = text(/*MaxListPoints*/ ctx[5]);
    			attr_dev(span0, "class", "song_bar_rank_nb svelte-t7bu72");
    			add_location(span0, file$a, 31, 8, 1035);
    			add_location(span1, file$a, 32, 8, 1090);
    			add_location(span2, file$a, 33, 8, 1129);
    			attr_dev(div, "class", "song_bar_rank svelte-t7bu72");
    			add_location(div, file$a, 30, 4, 998);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span0);
    			append_dev(span0, t0);
    			append_dev(span0, t1);
    			append_dev(div, t2);
    			append_dev(div, span1);
    			append_dev(div, t4);
    			append_dev(div, span2);
    			append_dev(span2, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Rank*/ 1) set_data_dev(t1, /*Rank*/ ctx[0]);
    			if (dirty & /*MaxListPoints*/ 32) set_data_dev(t5, /*MaxListPoints*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(30:4) {#if Rank !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (51:8) {#if diff >= 0}
    function create_if_block$7(ctx) {
    	let difficultyblock;
    	let current;

    	difficultyblock = new DifficultyBlock({
    			props: {
    				Level: /*diff*/ ctx[13],
    				Difficulty: /*i*/ ctx[15]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(difficultyblock.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(difficultyblock, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const difficultyblock_changes = {};
    			if (dirty & /*Difficulties*/ 8) difficultyblock_changes.Level = /*diff*/ ctx[13];
    			difficultyblock.$set(difficultyblock_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(difficultyblock.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(difficultyblock.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(difficultyblock, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(51:8) {#if diff >= 0}",
    		ctx
    	});

    	return block;
    }

    // (50:4) {#each Difficulties as diff, i}
    function create_each_block$5(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*diff*/ ctx[13] >= 0 && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*diff*/ ctx[13] >= 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*Difficulties*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(50:4) {#each Difficulties as diff, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div2;
    	let t0;
    	let div0;
    	let audioplayer;
    	let t1;
    	let div1;
    	let t2;
    	let div2_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*Rank*/ ctx[0] !== undefined && create_if_block_1$2(ctx);

    	audioplayer = new AudioPlayer({
    			props: {
    				Title: /*Title*/ ctx[1],
    				Subtitle: /*Subtitle*/ ctx[2],
    				AudioLink: /*AudioLink*/ ctx[8]
    			},
    			$$inline: true
    		});

    	let each_value = /*Difficulties*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			div0 = element("div");
    			create_component(audioplayer.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "song_bar_main_info svelte-t7bu72");
    			add_location(div0, file$a, 37, 4, 1192);
    			attr_dev(div1, "class", "song_bar_push svelte-t7bu72");
    			add_location(div1, file$a, 45, 4, 1391);

    			attr_dev(div2, "class", div2_class_value = "" + (/*Genre*/ ctx[4] + " song_bar " + (/*UniqueId*/ ctx[6] !== undefined
    			? "song_bar_clickable"
    			: "") + " svelte-t7bu72"));

    			add_location(div2, file$a, 28, 0, 851);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			if (if_block) if_block.m(div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, div0);
    			mount_component(audioplayer, div0, null);
    			/*div0_binding*/ ctx[11](div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div2, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div2, null);
    				}
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", /*MoveToSongInfo*/ ctx[9], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*Rank*/ ctx[0] !== undefined) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					if_block.m(div2, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const audioplayer_changes = {};
    			if (dirty & /*Title*/ 2) audioplayer_changes.Title = /*Title*/ ctx[1];
    			if (dirty & /*Subtitle*/ 4) audioplayer_changes.Subtitle = /*Subtitle*/ ctx[2];
    			if (dirty & /*AudioLink*/ 256) audioplayer_changes.AudioLink = /*AudioLink*/ ctx[8];
    			audioplayer.$set(audioplayer_changes);

    			if (dirty & /*Difficulties*/ 8) {
    				each_value = /*Difficulties*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div2, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*Genre, UniqueId*/ 80 && div2_class_value !== (div2_class_value = "" + (/*Genre*/ ctx[4] + " song_bar " + (/*UniqueId*/ ctx[6] !== undefined
    			? "song_bar_clickable"
    			: "") + " svelte-t7bu72"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(audioplayer.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(audioplayer.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    			destroy_component(audioplayer);
    			/*div0_binding*/ ctx[11](null);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let AudioLink;
    	let SongDetailsUrl;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SongBar', slots, []);
    	let { Rank } = $$props;
    	let { Title } = $$props;
    	let { Subtitle } = $$props;
    	let { Difficulties = [-1, -1, -1, -1, -1, -1, -1] } = $$props;
    	let { AudioFilePath } = $$props;
    	let { Genre } = $$props;
    	let { MaxListPoints } = $$props;
    	let { UniqueId } = $$props;
    	let boxEl = null;

    	const MoveToSongInfo = e => {
    		if (UniqueId === undefined) return;
    		if (!e.target.closest('.song_bar_main_info')) window.open(SongDetailsUrl, '_blank');
    	};

    	$$self.$$.on_mount.push(function () {
    		if (Rank === undefined && !('Rank' in $$props || $$self.$$.bound[$$self.$$.props['Rank']])) {
    			console.warn("<SongBar> was created without expected prop 'Rank'");
    		}

    		if (Title === undefined && !('Title' in $$props || $$self.$$.bound[$$self.$$.props['Title']])) {
    			console.warn("<SongBar> was created without expected prop 'Title'");
    		}

    		if (Subtitle === undefined && !('Subtitle' in $$props || $$self.$$.bound[$$self.$$.props['Subtitle']])) {
    			console.warn("<SongBar> was created without expected prop 'Subtitle'");
    		}

    		if (AudioFilePath === undefined && !('AudioFilePath' in $$props || $$self.$$.bound[$$self.$$.props['AudioFilePath']])) {
    			console.warn("<SongBar> was created without expected prop 'AudioFilePath'");
    		}

    		if (Genre === undefined && !('Genre' in $$props || $$self.$$.bound[$$self.$$.props['Genre']])) {
    			console.warn("<SongBar> was created without expected prop 'Genre'");
    		}

    		if (MaxListPoints === undefined && !('MaxListPoints' in $$props || $$self.$$.bound[$$self.$$.props['MaxListPoints']])) {
    			console.warn("<SongBar> was created without expected prop 'MaxListPoints'");
    		}

    		if (UniqueId === undefined && !('UniqueId' in $$props || $$self.$$.bound[$$self.$$.props['UniqueId']])) {
    			console.warn("<SongBar> was created without expected prop 'UniqueId'");
    		}
    	});

    	const writable_props = [
    		'Rank',
    		'Title',
    		'Subtitle',
    		'Difficulties',
    		'AudioFilePath',
    		'Genre',
    		'MaxListPoints',
    		'UniqueId'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SongBar> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			boxEl = $$value;
    			$$invalidate(7, boxEl);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('Rank' in $$props) $$invalidate(0, Rank = $$props.Rank);
    		if ('Title' in $$props) $$invalidate(1, Title = $$props.Title);
    		if ('Subtitle' in $$props) $$invalidate(2, Subtitle = $$props.Subtitle);
    		if ('Difficulties' in $$props) $$invalidate(3, Difficulties = $$props.Difficulties);
    		if ('AudioFilePath' in $$props) $$invalidate(10, AudioFilePath = $$props.AudioFilePath);
    		if ('Genre' in $$props) $$invalidate(4, Genre = $$props.Genre);
    		if ('MaxListPoints' in $$props) $$invalidate(5, MaxListPoints = $$props.MaxListPoints);
    		if ('UniqueId' in $$props) $$invalidate(6, UniqueId = $$props.UniqueId);
    	};

    	$$self.$capture_state = () => ({
    		navigate,
    		DifficultyBlock,
    		AudioPlayer,
    		Rank,
    		Title,
    		Subtitle,
    		Difficulties,
    		AudioFilePath,
    		Genre,
    		MaxListPoints,
    		UniqueId,
    		boxEl,
    		MoveToSongInfo,
    		SongDetailsUrl,
    		AudioLink
    	});

    	$$self.$inject_state = $$props => {
    		if ('Rank' in $$props) $$invalidate(0, Rank = $$props.Rank);
    		if ('Title' in $$props) $$invalidate(1, Title = $$props.Title);
    		if ('Subtitle' in $$props) $$invalidate(2, Subtitle = $$props.Subtitle);
    		if ('Difficulties' in $$props) $$invalidate(3, Difficulties = $$props.Difficulties);
    		if ('AudioFilePath' in $$props) $$invalidate(10, AudioFilePath = $$props.AudioFilePath);
    		if ('Genre' in $$props) $$invalidate(4, Genre = $$props.Genre);
    		if ('MaxListPoints' in $$props) $$invalidate(5, MaxListPoints = $$props.MaxListPoints);
    		if ('UniqueId' in $$props) $$invalidate(6, UniqueId = $$props.UniqueId);
    		if ('boxEl' in $$props) $$invalidate(7, boxEl = $$props.boxEl);
    		if ('SongDetailsUrl' in $$props) SongDetailsUrl = $$props.SongDetailsUrl;
    		if ('AudioLink' in $$props) $$invalidate(8, AudioLink = $$props.AudioLink);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*AudioFilePath*/ 1024) {
    			$$invalidate(8, AudioLink = `https://github.com/OpenTaiko/OpenTaiko-Soundtrack/raw/refs/heads/main/${AudioFilePath}`);
    		}

    		if ($$self.$$.dirty & /*UniqueId*/ 64) {
    			SongDetailsUrl = `/songinfo/${UniqueId}`;
    		}
    	};

    	return [
    		Rank,
    		Title,
    		Subtitle,
    		Difficulties,
    		Genre,
    		MaxListPoints,
    		UniqueId,
    		boxEl,
    		AudioLink,
    		MoveToSongInfo,
    		AudioFilePath,
    		div0_binding
    	];
    }

    class SongBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$1(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			Rank: 0,
    			Title: 1,
    			Subtitle: 2,
    			Difficulties: 3,
    			AudioFilePath: 10,
    			Genre: 4,
    			MaxListPoints: 5,
    			UniqueId: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SongBar",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get Rank() {
    		throw new Error("<SongBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Rank(value) {
    		throw new Error("<SongBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Title() {
    		throw new Error("<SongBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Title(value) {
    		throw new Error("<SongBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Subtitle() {
    		throw new Error("<SongBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Subtitle(value) {
    		throw new Error("<SongBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Difficulties() {
    		throw new Error("<SongBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Difficulties(value) {
    		throw new Error("<SongBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get AudioFilePath() {
    		throw new Error("<SongBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set AudioFilePath(value) {
    		throw new Error("<SongBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Genre() {
    		throw new Error("<SongBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Genre(value) {
    		throw new Error("<SongBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get MaxListPoints() {
    		throw new Error("<SongBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set MaxListPoints(value) {
    		throw new Error("<SongBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get UniqueId() {
    		throw new Error("<SongBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set UniqueId(value) {
    		throw new Error("<SongBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\Songlist.svelte generated by Svelte v3.59.2 */
    const file$9 = "src\\routes\\Songlist.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (138:4) {#each AvailableGenres as GBox}
    function create_each_block_1$2(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				color1: /*GBox*/ ctx[10].color1,
    				color2: /*GBox*/ ctx[10].color2,
    				textColor: /*GBox*/ ctx[10].textColor,
    				text: /*GBox*/ ctx[10].text,
    				OnClick: /*GBox*/ ctx[10].OnClick
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(138:4) {#each AvailableGenres as GBox}",
    		ctx
    	});

    	return block;
    }

    // (152:4) {:else}
    function create_else_block$5(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*SongCards*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*SongCards*/ 2) {
    				each_value = /*SongCards*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(152:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (149:4) {#if Fetching === true}
    function create_if_block$6(ctx) {
    	let h1;
    	let t1;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Fetching Songs... Please wait.";
    			t1 = space();
    			img = element("img");
    			set_style(h1, "text-align", "center");
    			set_style(h1, "color", "white");
    			add_location(h1, file$9, 149, 8, 4643);
    			if (!src_url_equal(img.src, img_src_value = "image/loading.gif")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Loading");
    			set_style(img, "display", "block");
    			set_style(img, "margin-left", "auto");
    			set_style(img, "margin-right", "auto");
    			add_location(img, file$9, 150, 8, 4733);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, img, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(149:4) {#if Fetching === true}",
    		ctx
    	});

    	return block;
    }

    // (154:12) {#key Card.AudioFilePath}
    function create_key_block$2(ctx) {
    	let songbar;
    	let current;

    	songbar = new SongBar({
    			props: {
    				Title: /*Card*/ ctx[7].Title,
    				Subtitle: /*Card*/ ctx[7].Subtitle,
    				Difficulties: /*Card*/ ctx[7].Difficulties,
    				AudioFilePath: /*Card*/ ctx[7].AudioFilePath,
    				Genre: /*Card*/ ctx[7].Genre,
    				UniqueId: /*Card*/ ctx[7].UniqueId
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(songbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(songbar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const songbar_changes = {};
    			if (dirty & /*SongCards*/ 2) songbar_changes.Title = /*Card*/ ctx[7].Title;
    			if (dirty & /*SongCards*/ 2) songbar_changes.Subtitle = /*Card*/ ctx[7].Subtitle;
    			if (dirty & /*SongCards*/ 2) songbar_changes.Difficulties = /*Card*/ ctx[7].Difficulties;
    			if (dirty & /*SongCards*/ 2) songbar_changes.AudioFilePath = /*Card*/ ctx[7].AudioFilePath;
    			if (dirty & /*SongCards*/ 2) songbar_changes.Genre = /*Card*/ ctx[7].Genre;
    			if (dirty & /*SongCards*/ 2) songbar_changes.UniqueId = /*Card*/ ctx[7].UniqueId;
    			songbar.$set(songbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(songbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(songbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(songbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block$2.name,
    		type: "key",
    		source: "(154:12) {#key Card.AudioFilePath}",
    		ctx
    	});

    	return block;
    }

    // (153:8) {#each SongCards as Card}
    function create_each_block$4(ctx) {
    	let previous_key = /*Card*/ ctx[7].AudioFilePath;
    	let key_block_anchor;
    	let current;
    	let key_block = create_key_block$2(ctx);

    	const block = {
    		c: function create() {
    			key_block.c();
    			key_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			key_block.m(target, anchor);
    			insert_dev(target, key_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*SongCards*/ 2 && safe_not_equal(previous_key, previous_key = /*Card*/ ctx[7].AudioFilePath)) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop$1);
    				check_outros();
    				key_block = create_key_block$2(ctx);
    				key_block.c();
    				transition_in(key_block, 1);
    				key_block.m(key_block_anchor.parentNode, key_block_anchor);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(key_block_anchor);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(153:8) {#each SongCards as Card}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div0;
    	let t0;
    	let h1;
    	let t2;
    	let div1;
    	let t3;
    	let div2;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let each_value_1 = /*AvailableGenres*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const if_block_creators = [create_if_block$6, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*Fetching*/ ctx[0] === true) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Song List";
    			t2 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			div2 = element("div");
    			if_block.c();
    			attr_dev(div0, "class", "bg_optk svelte-jfmyyy");
    			add_location(div0, file$9, 134, 0, 4234);
    			set_style(h1, "color", "white");
    			add_location(h1, file$9, 135, 0, 4263);
    			attr_dev(div1, "class", "buttons svelte-jfmyyy");
    			add_location(div1, file$9, 136, 0, 4304);
    			attr_dev(div2, "id", "songs");
    			attr_dev(div2, "class", "svelte-jfmyyy");
    			add_location(div2, file$9, 147, 0, 4588);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div1, null);
    				}
    			}

    			insert_dev(target, t3, anchor);
    			insert_dev(target, div2, anchor);
    			if_blocks[current_block_type_index].m(div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*AvailableGenres*/ 4) {
    				each_value_1 = /*AvailableGenres*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div2, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div2);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let SongCards;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Songlist', slots, []);

    	const AvailableGenres = [
    		{
    			color1: "#ff8f53",
    			color2: "#f76b20",
    			textColor: "black",
    			text: "OpenTaiko Chapter I",
    			OnClick: () => FilterSongs("ch1", "01 OpenTaiko Chapter I")
    		},
    		{
    			color1: "#575fff",
    			color2: "#474ed6",
    			textColor: "white",
    			text: "OpenTaiko Chapter II",
    			OnClick: () => FilterSongs("ch2", "02 OpenTaiko Chapter II")
    		},
    		{
    			color1: "#6effe7",
    			color2: "#48f7da",
    			textColor: "black",
    			text: "OpenTaiko Chapter III",
    			OnClick: () => FilterSongs("ch3", "03 OpenTaiko Chapter III")
    		},
    		{
    			color1: "#f3ff87",
    			color2: "#e5f748",
    			textColor: "black",
    			text: "OpenTaiko Chapter IV",
    			OnClick: () => FilterSongs("ch4", "04 OpenTaiko Chapter IV")
    		},
    		{
    			color1: "#ff87ab",
    			color2: "#f74848",
    			textColor: "black",
    			text: "OpenTaiko Chapter V",
    			OnClick: () => FilterSongs("ch5", "05 OpenTaiko Chapter V")
    		},
    		{
    			color1: "#700b0b",
    			color2: "#520808",
    			textColor: "white",
    			text: "Deceiver's Defiances",
    			OnClick: () => FilterSongs("deceiver", "C10 Deceiver's Defiances")
    		},
    		{
    			color1: "#ffffff",
    			color2: "#bebebe",
    			textColor: "black",
    			text: "Dashy's Secrets",
    			OnClick: () => FilterSongs("dashy", "C12 Dashy's Secrets")
    		},
    		{
    			color1: "#0c3803",
    			color2: "#092d02",
    			textColor: "white",
    			text: "Rainy Memories",
    			OnClick: () => FilterSongs("rainy", "E01 Rainy Memories")
    		},
    		{
    			color1: "#cccccc",
    			color2: "#999999",
    			textColor: "black",
    			text: "OpenTaiko Headquarters",
    			OnClick: () => FilterSongs("hq", "E02 OpenTaiko Headquarters")
    		},
    		{
    			color1: "black",
    			color2: "black",
    			textColor: "white",
    			text: "???",
    			OnClick: () => window.location.replace('secret')
    		}
    	];

    	let Fetching = false;
    	let SongsInfo = {};

    	const GetSongsByGenre = genre => {
    		return SongsInfo.filter(song => song["tjaGenreFolder"] === genre);
    	};

    	const FetchSongs = async () => {
    		$$invalidate(0, Fetching = true);
    		let songs_text = await fetch("https://raw.githubusercontent.com/OpenTaiko/OpenTaiko-Soundtrack/refs/heads/main/soundtrack_info.json");
    		let text = (await songs_text.text()).valueOf();
    		SongsInfo = JSON.parse(text);
    		$$invalidate(0, Fetching = false);
    	};

    	const FilterSongs = async (genre, fil) => {
    		$$invalidate(1, SongCards = []);

    		GetSongsByGenre(fil).forEach(song => {
    			const SInfo = {
    				Genre: genre,
    				Title: song["chartTitle"],
    				Subtitle: song["chartSubtitle"],
    				AudioFilePath: song['chartAudioFilePath'],
    				Difficulties: [
    					song["chartDifficulties"]["Easy"] ?? -1,
    					song["chartDifficulties"]["Normal"] ?? -1,
    					song["chartDifficulties"]["Hard"] ?? -1,
    					song["chartDifficulties"]["Oni"] ?? -1,
    					song["chartDifficulties"]["Edit"] ?? -1,
    					song["chartDifficulties"]["Tower"] ?? -1,
    					song["chartDifficulties"]["Dan"] ?? -1
    				],
    				UniqueId: song["uniqueId"]
    			};

    			SongCards.push(SInfo);
    		});
    	}; //console.log(SongCards);

    	onMount(async () => {
    		await FetchSongs();

    		//console.log(SongsInfo);
    		FilterSongs("ch5", "05 OpenTaiko Chapter V");
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Songlist> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Button,
    		SongBar,
    		AvailableGenres,
    		Fetching,
    		SongsInfo,
    		GetSongsByGenre,
    		FetchSongs,
    		FilterSongs,
    		SongCards
    	});

    	$$self.$inject_state = $$props => {
    		if ('Fetching' in $$props) $$invalidate(0, Fetching = $$props.Fetching);
    		if ('SongsInfo' in $$props) SongsInfo = $$props.SongsInfo;
    		if ('SongCards' in $$props) $$invalidate(1, SongCards = $$props.SongCards);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(1, SongCards = []);
    	return [Fetching, SongCards, AvailableGenres];
    }

    class Songlist extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Songlist",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\components\TabArea.svelte generated by Svelte v3.59.2 */

    const file$8 = "src\\components\\TabArea.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (9:2) {#each items as item}
    function create_each_block_1$1(ctx) {
    	let li;
    	let span;
    	let t0_value = /*item*/ ctx[3].label + "";
    	let t0;
    	let t1;
    	let li_class_value;
    	let li_style_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(span, "class", "svelte-1f7step");
    			add_location(span, file$8, 11, 10, 362);

    			attr_dev(li, "class", li_class_value = "" + (null_to_empty(/*activeTabValue*/ ctx[0] === /*item*/ ctx[3].value
    			? 'active'
    			: '') + " svelte-1f7step"));

    			attr_dev(li, "style", li_style_value = /*activeTabValue*/ ctx[0] === /*item*/ ctx[3].value
    			? `background-color:${/*item*/ ctx[3].color}`
    			: '');

    			add_location(li, file$8, 9, 6, 204);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, span);
    			append_dev(span, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = listen_dev(
    					span,
    					"click",
    					function () {
    						if (is_function(/*handleClick*/ ctx[2](/*item*/ ctx[3].value))) /*handleClick*/ ctx[2](/*item*/ ctx[3].value).apply(this, arguments);
    					},
    					false,
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*items*/ 2 && t0_value !== (t0_value = /*item*/ ctx[3].label + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*activeTabValue, items*/ 3 && li_class_value !== (li_class_value = "" + (null_to_empty(/*activeTabValue*/ ctx[0] === /*item*/ ctx[3].value
    			? 'active'
    			: '') + " svelte-1f7step"))) {
    				attr_dev(li, "class", li_class_value);
    			}

    			if (dirty & /*activeTabValue, items*/ 3 && li_style_value !== (li_style_value = /*activeTabValue*/ ctx[0] === /*item*/ ctx[3].value
    			? `background-color:${/*item*/ ctx[3].color}`
    			: '')) {
    				attr_dev(li, "style", li_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(9:2) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    // (17:6) {#if activeTabValue == item.value}
    function create_if_block$5(ctx) {
    	let div;
    	let switch_instance;
    	let t;
    	let current;
    	const switch_instance_spread_levels = [/*item*/ ctx[3].props];
    	var switch_value = /*item*/ ctx[3].component;

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "box svelte-1f7step");
    			add_location(div, file$8, 17, 6, 530);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (switch_instance) mount_component(switch_instance, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*items*/ 2)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*item*/ ctx[3].props)])
    			: {};

    			if (dirty & /*items*/ 2 && switch_value !== (switch_value = /*item*/ ctx[3].component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, t);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(17:6) {#if activeTabValue == item.value}",
    		ctx
    	});

    	return block;
    }

    // (16:2) {#each items as item}
    function create_each_block$3(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*activeTabValue*/ ctx[0] == /*item*/ ctx[3].value && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*activeTabValue*/ ctx[0] == /*item*/ ctx[3].value) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*activeTabValue, items*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(16:2) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let ul;
    	let t;
    	let each1_anchor;
    	let current;
    	let each_value_1 = /*items*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let each_value = /*items*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each1_anchor = empty();
    			attr_dev(ul, "class", "svelte-1f7step");
    			add_location(ul, file$8, 7, 2, 167);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(ul, null);
    				}
    			}

    			insert_dev(target, t, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*activeTabValue, items, handleClick*/ 7) {
    				each_value_1 = /*items*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*items, activeTabValue*/ 3) {
    				each_value = /*items*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each1_anchor.parentNode, each1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TabArea', slots, []);
    	let { items = [] } = $$props;
    	let { activeTabValue = 1 } = $$props;
    	const handleClick = tabValue => () => $$invalidate(0, activeTabValue = tabValue);
    	const writable_props = ['items', 'activeTabValue'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TabArea> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    		if ('activeTabValue' in $$props) $$invalidate(0, activeTabValue = $$props.activeTabValue);
    	};

    	$$self.$capture_state = () => ({ items, activeTabValue, handleClick });

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    		if ('activeTabValue' in $$props) $$invalidate(0, activeTabValue = $$props.activeTabValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [activeTabValue, items, handleClick];
    }

    class TabArea extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$8, create_fragment$8, safe_not_equal, { items: 1, activeTabValue: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabArea",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get items() {
    		throw new Error("<TabArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<TabArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeTabValue() {
    		throw new Error("<TabArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeTabValue(value) {
    		throw new Error("<TabArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var global$1 = (typeof global !== "undefined" ? global :
      typeof self !== "undefined" ? self :
      typeof window !== "undefined" ? window : {});

    // shim for using process in browser
    // based off https://github.com/defunctzombie/node-process/blob/master/browser.js

    function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
    }
    function defaultClearTimeout () {
        throw new Error('clearTimeout has not been defined');
    }
    var cachedSetTimeout = defaultSetTimout;
    var cachedClearTimeout = defaultClearTimeout;
    if (typeof global$1.setTimeout === 'function') {
        cachedSetTimeout = setTimeout;
    }
    if (typeof global$1.clearTimeout === 'function') {
        cachedClearTimeout = clearTimeout;
    }

    function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
            //normal enviroments in sane situations
            return setTimeout(fun, 0);
        }
        // if setTimeout wasn't available but was latter defined
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
            cachedSetTimeout = setTimeout;
            return setTimeout(fun, 0);
        }
        try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedSetTimeout(fun, 0);
        } catch(e){
            try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                return cachedSetTimeout.call(null, fun, 0);
            } catch(e){
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                return cachedSetTimeout.call(this, fun, 0);
            }
        }


    }
    function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
            //normal enviroments in sane situations
            return clearTimeout(marker);
        }
        // if clearTimeout wasn't available but was latter defined
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
            cachedClearTimeout = clearTimeout;
            return clearTimeout(marker);
        }
        try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedClearTimeout(marker);
        } catch (e){
            try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                return cachedClearTimeout.call(null, marker);
            } catch (e){
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                return cachedClearTimeout.call(this, marker);
            }
        }



    }
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;

    function cleanUpNextTick() {
        if (!draining || !currentQueue) {
            return;
        }
        draining = false;
        if (currentQueue.length) {
            queue = currentQueue.concat(queue);
        } else {
            queueIndex = -1;
        }
        if (queue.length) {
            drainQueue();
        }
    }

    function drainQueue() {
        if (draining) {
            return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;

        var len = queue.length;
        while(len) {
            currentQueue = queue;
            queue = [];
            while (++queueIndex < len) {
                if (currentQueue) {
                    currentQueue[queueIndex].run();
                }
            }
            queueIndex = -1;
            len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
    }
    function nextTick(fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
            }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
            runTimeout(drainQueue);
        }
    }
    // v8 likes predictible objects
    function Item(fun, array) {
        this.fun = fun;
        this.array = array;
    }
    Item.prototype.run = function () {
        this.fun.apply(null, this.array);
    };
    var title = 'browser';
    var platform = 'browser';
    var browser = true;
    var env = {};
    var argv = [];
    var version = ''; // empty string to avoid regexp issues
    var versions = {};
    var release = {};
    var config = {};

    function noop() {}

    var on = noop;
    var addListener = noop;
    var once = noop;
    var off = noop;
    var removeListener = noop;
    var removeAllListeners = noop;
    var emit = noop;

    function binding(name) {
        throw new Error('process.binding is not supported');
    }

    function cwd () { return '/' }
    function chdir (dir) {
        throw new Error('process.chdir is not supported');
    }function umask() { return 0; }

    // from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
    var performance$1 = global$1.performance || {};
    var performanceNow =
      performance$1.now        ||
      performance$1.mozNow     ||
      performance$1.msNow      ||
      performance$1.oNow       ||
      performance$1.webkitNow  ||
      function(){ return (new Date()).getTime() };

    // generate timestamp or delta
    // see http://nodejs.org/api/process.html#process_process_hrtime
    function hrtime(previousTimestamp){
      var clocktime = performanceNow.call(performance$1)*1e-3;
      var seconds = Math.floor(clocktime);
      var nanoseconds = Math.floor((clocktime%1)*1e9);
      if (previousTimestamp) {
        seconds = seconds - previousTimestamp[0];
        nanoseconds = nanoseconds - previousTimestamp[1];
        if (nanoseconds<0) {
          seconds--;
          nanoseconds += 1e9;
        }
      }
      return [seconds,nanoseconds]
    }

    var startTime = new Date();
    function uptime() {
      var currentTime = new Date();
      var dif = currentTime - startTime;
      return dif / 1000;
    }

    var browser$1 = {
      nextTick: nextTick,
      title: title,
      browser: browser,
      env: env,
      argv: argv,
      version: version,
      versions: versions,
      on: on,
      addListener: addListener,
      once: once,
      off: off,
      removeListener: removeListener,
      removeAllListeners: removeAllListeners,
      emit: emit,
      binding: binding,
      cwd: cwd,
      chdir: chdir,
      umask: umask,
      hrtime: hrtime,
      platform: platform,
      release: release,
      config: config,
      uptime: uptime
    };

    var __dirname = '/Users/raphael/Documents/GitHub/opentaiko.github.io';

    var lookup = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
    var inited = false;
    function init () {
      inited = true;
      var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      for (var i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i];
        revLookup[code.charCodeAt(i)] = i;
      }

      revLookup['-'.charCodeAt(0)] = 62;
      revLookup['_'.charCodeAt(0)] = 63;
    }

    function toByteArray (b64) {
      if (!inited) {
        init();
      }
      var i, j, l, tmp, placeHolders, arr;
      var len = b64.length;

      if (len % 4 > 0) {
        throw new Error('Invalid string. Length must be a multiple of 4')
      }

      // the number of equal signs (place holders)
      // if there are two placeholders, than the two characters before it
      // represent one byte
      // if there is only one, then the three characters before it represent 2 bytes
      // this is just a cheap hack to not do indexOf twice
      placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

      // base64 is 4/3 + up to two characters of the original data
      arr = new Arr(len * 3 / 4 - placeHolders);

      // if there are placeholders, only get up to the last complete 4 chars
      l = placeHolders > 0 ? len - 4 : len;

      var L = 0;

      for (i = 0, j = 0; i < l; i += 4, j += 3) {
        tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
        arr[L++] = (tmp >> 16) & 0xFF;
        arr[L++] = (tmp >> 8) & 0xFF;
        arr[L++] = tmp & 0xFF;
      }

      if (placeHolders === 2) {
        tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
        arr[L++] = tmp & 0xFF;
      } else if (placeHolders === 1) {
        tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
        arr[L++] = (tmp >> 8) & 0xFF;
        arr[L++] = tmp & 0xFF;
      }

      return arr
    }

    function tripletToBase64 (num) {
      return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
    }

    function encodeChunk (uint8, start, end) {
      var tmp;
      var output = [];
      for (var i = start; i < end; i += 3) {
        tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
        output.push(tripletToBase64(tmp));
      }
      return output.join('')
    }

    function fromByteArray (uint8) {
      if (!inited) {
        init();
      }
      var tmp;
      var len = uint8.length;
      var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
      var output = '';
      var parts = [];
      var maxChunkLength = 16383; // must be multiple of 3

      // go through the array every three bytes, we'll deal with trailing stuff later
      for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
        parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
      }

      // pad the end with zeros, but make sure to not forget the extra bytes
      if (extraBytes === 1) {
        tmp = uint8[len - 1];
        output += lookup[tmp >> 2];
        output += lookup[(tmp << 4) & 0x3F];
        output += '==';
      } else if (extraBytes === 2) {
        tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
        output += lookup[tmp >> 10];
        output += lookup[(tmp >> 4) & 0x3F];
        output += lookup[(tmp << 2) & 0x3F];
        output += '=';
      }

      parts.push(output);

      return parts.join('')
    }

    function read (buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? (nBytes - 1) : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];

      i += d;

      e = s & ((1 << (-nBits)) - 1);
      s >>= (-nBits);
      nBits += eLen;
      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

      m = e & ((1 << (-nBits)) - 1);
      e >>= (-nBits);
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : ((s ? -1 : 1) * Infinity)
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
    }

    function write (buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
      var i = isLE ? 0 : (nBytes - 1);
      var d = isLE ? 1 : -1;
      var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

      value = Math.abs(value);

      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }

        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }

      for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

      e = (e << mLen) | m;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

      buffer[offset + i - d] |= s * 128;
    }

    var toString = {}.toString;

    var isArray = Array.isArray || function (arr) {
      return toString.call(arr) == '[object Array]';
    };

    /*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
     * @license  MIT
     */
    /* eslint-disable no-proto */


    var INSPECT_MAX_BYTES = 50;

    /**
     * If `Buffer.TYPED_ARRAY_SUPPORT`:
     *   === true    Use Uint8Array implementation (fastest)
     *   === false   Use Object implementation (most compatible, even IE6)
     *
     * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
     * Opera 11.6+, iOS 4.2+.
     *
     * Due to various browser bugs, sometimes the Object implementation will be used even
     * when the browser supports typed arrays.
     *
     * Note:
     *
     *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
     *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
     *
     *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
     *
     *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
     *     incorrect length in some situations.

     * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
     * get the Object implementation, which is slower but behaves correctly.
     */
    Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
      ? global$1.TYPED_ARRAY_SUPPORT
      : true;

    /*
     * Export kMaxLength after typed array support is determined.
     */
    kMaxLength();

    function kMaxLength () {
      return Buffer.TYPED_ARRAY_SUPPORT
        ? 0x7fffffff
        : 0x3fffffff
    }

    function createBuffer (that, length) {
      if (kMaxLength() < length) {
        throw new RangeError('Invalid typed array length')
      }
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        // Return an augmented `Uint8Array` instance, for best performance
        that = new Uint8Array(length);
        that.__proto__ = Buffer.prototype;
      } else {
        // Fallback: Return an object instance of the Buffer class
        if (that === null) {
          that = new Buffer(length);
        }
        that.length = length;
      }

      return that
    }

    /**
     * The Buffer constructor returns instances of `Uint8Array` that have their
     * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
     * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
     * and the `Uint8Array` methods. Square bracket notation works as expected -- it
     * returns a single octet.
     *
     * The `Uint8Array` prototype remains unmodified.
     */

    function Buffer (arg, encodingOrOffset, length) {
      if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
        return new Buffer(arg, encodingOrOffset, length)
      }

      // Common case.
      if (typeof arg === 'number') {
        if (typeof encodingOrOffset === 'string') {
          throw new Error(
            'If encoding is specified then the first argument must be a string'
          )
        }
        return allocUnsafe(this, arg)
      }
      return from(this, arg, encodingOrOffset, length)
    }

    Buffer.poolSize = 8192; // not used by this implementation

    // TODO: Legacy, not needed anymore. Remove in next major version.
    Buffer._augment = function (arr) {
      arr.__proto__ = Buffer.prototype;
      return arr
    };

    function from (that, value, encodingOrOffset, length) {
      if (typeof value === 'number') {
        throw new TypeError('"value" argument must not be a number')
      }

      if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
        return fromArrayBuffer(that, value, encodingOrOffset, length)
      }

      if (typeof value === 'string') {
        return fromString(that, value, encodingOrOffset)
      }

      return fromObject(that, value)
    }

    /**
     * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
     * if value is a number.
     * Buffer.from(str[, encoding])
     * Buffer.from(array)
     * Buffer.from(buffer)
     * Buffer.from(arrayBuffer[, byteOffset[, length]])
     **/
    Buffer.from = function (value, encodingOrOffset, length) {
      return from(null, value, encodingOrOffset, length)
    };

    if (Buffer.TYPED_ARRAY_SUPPORT) {
      Buffer.prototype.__proto__ = Uint8Array.prototype;
      Buffer.__proto__ = Uint8Array;
      if (typeof Symbol !== 'undefined' && Symbol.species &&
          Buffer[Symbol.species] === Buffer) ;
    }

    function assertSize (size) {
      if (typeof size !== 'number') {
        throw new TypeError('"size" argument must be a number')
      } else if (size < 0) {
        throw new RangeError('"size" argument must not be negative')
      }
    }

    function alloc (that, size, fill, encoding) {
      assertSize(size);
      if (size <= 0) {
        return createBuffer(that, size)
      }
      if (fill !== undefined) {
        // Only pay attention to encoding if it's a string. This
        // prevents accidentally sending in a number that would
        // be interpretted as a start offset.
        return typeof encoding === 'string'
          ? createBuffer(that, size).fill(fill, encoding)
          : createBuffer(that, size).fill(fill)
      }
      return createBuffer(that, size)
    }

    /**
     * Creates a new filled Buffer instance.
     * alloc(size[, fill[, encoding]])
     **/
    Buffer.alloc = function (size, fill, encoding) {
      return alloc(null, size, fill, encoding)
    };

    function allocUnsafe (that, size) {
      assertSize(size);
      that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
      if (!Buffer.TYPED_ARRAY_SUPPORT) {
        for (var i = 0; i < size; ++i) {
          that[i] = 0;
        }
      }
      return that
    }

    /**
     * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
     * */
    Buffer.allocUnsafe = function (size) {
      return allocUnsafe(null, size)
    };
    /**
     * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
     */
    Buffer.allocUnsafeSlow = function (size) {
      return allocUnsafe(null, size)
    };

    function fromString (that, string, encoding) {
      if (typeof encoding !== 'string' || encoding === '') {
        encoding = 'utf8';
      }

      if (!Buffer.isEncoding(encoding)) {
        throw new TypeError('"encoding" must be a valid string encoding')
      }

      var length = byteLength(string, encoding) | 0;
      that = createBuffer(that, length);

      var actual = that.write(string, encoding);

      if (actual !== length) {
        // Writing a hex string, for example, that contains invalid characters will
        // cause everything after the first invalid character to be ignored. (e.g.
        // 'abxxcd' will be treated as 'ab')
        that = that.slice(0, actual);
      }

      return that
    }

    function fromArrayLike (that, array) {
      var length = array.length < 0 ? 0 : checked(array.length) | 0;
      that = createBuffer(that, length);
      for (var i = 0; i < length; i += 1) {
        that[i] = array[i] & 255;
      }
      return that
    }

    function fromArrayBuffer (that, array, byteOffset, length) {
      array.byteLength; // this throws if `array` is not a valid ArrayBuffer

      if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('\'offset\' is out of bounds')
      }

      if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('\'length\' is out of bounds')
      }

      if (byteOffset === undefined && length === undefined) {
        array = new Uint8Array(array);
      } else if (length === undefined) {
        array = new Uint8Array(array, byteOffset);
      } else {
        array = new Uint8Array(array, byteOffset, length);
      }

      if (Buffer.TYPED_ARRAY_SUPPORT) {
        // Return an augmented `Uint8Array` instance, for best performance
        that = array;
        that.__proto__ = Buffer.prototype;
      } else {
        // Fallback: Return an object instance of the Buffer class
        that = fromArrayLike(that, array);
      }
      return that
    }

    function fromObject (that, obj) {
      if (internalIsBuffer(obj)) {
        var len = checked(obj.length) | 0;
        that = createBuffer(that, len);

        if (that.length === 0) {
          return that
        }

        obj.copy(that, 0, 0, len);
        return that
      }

      if (obj) {
        if ((typeof ArrayBuffer !== 'undefined' &&
            obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
          if (typeof obj.length !== 'number' || isnan(obj.length)) {
            return createBuffer(that, 0)
          }
          return fromArrayLike(that, obj)
        }

        if (obj.type === 'Buffer' && isArray(obj.data)) {
          return fromArrayLike(that, obj.data)
        }
      }

      throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
    }

    function checked (length) {
      // Note: cannot use `length < kMaxLength()` here because that fails when
      // length is NaN (which is otherwise coerced to zero.)
      if (length >= kMaxLength()) {
        throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                             'size: 0x' + kMaxLength().toString(16) + ' bytes')
      }
      return length | 0
    }
    Buffer.isBuffer = isBuffer;
    function internalIsBuffer (b) {
      return !!(b != null && b._isBuffer)
    }

    Buffer.compare = function compare (a, b) {
      if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
        throw new TypeError('Arguments must be Buffers')
      }

      if (a === b) return 0

      var x = a.length;
      var y = b.length;

      for (var i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break
        }
      }

      if (x < y) return -1
      if (y < x) return 1
      return 0
    };

    Buffer.isEncoding = function isEncoding (encoding) {
      switch (String(encoding).toLowerCase()) {
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'latin1':
        case 'binary':
        case 'base64':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return true
        default:
          return false
      }
    };

    Buffer.concat = function concat (list, length) {
      if (!isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers')
      }

      if (list.length === 0) {
        return Buffer.alloc(0)
      }

      var i;
      if (length === undefined) {
        length = 0;
        for (i = 0; i < list.length; ++i) {
          length += list[i].length;
        }
      }

      var buffer = Buffer.allocUnsafe(length);
      var pos = 0;
      for (i = 0; i < list.length; ++i) {
        var buf = list[i];
        if (!internalIsBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers')
        }
        buf.copy(buffer, pos);
        pos += buf.length;
      }
      return buffer
    };

    function byteLength (string, encoding) {
      if (internalIsBuffer(string)) {
        return string.length
      }
      if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
          (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
        return string.byteLength
      }
      if (typeof string !== 'string') {
        string = '' + string;
      }

      var len = string.length;
      if (len === 0) return 0

      // Use a for loop to avoid recursion
      var loweredCase = false;
      for (;;) {
        switch (encoding) {
          case 'ascii':
          case 'latin1':
          case 'binary':
            return len
          case 'utf8':
          case 'utf-8':
          case undefined:
            return utf8ToBytes(string).length
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return len * 2
          case 'hex':
            return len >>> 1
          case 'base64':
            return base64ToBytes(string).length
          default:
            if (loweredCase) return utf8ToBytes(string).length // assume utf8
            encoding = ('' + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer.byteLength = byteLength;

    function slowToString (encoding, start, end) {
      var loweredCase = false;

      // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
      // property of a typed array.

      // This behaves neither like String nor Uint8Array in that we set start/end
      // to their upper/lower bounds if the value passed is out of range.
      // undefined is handled specially as per ECMA-262 6th Edition,
      // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
      if (start === undefined || start < 0) {
        start = 0;
      }
      // Return early if start > this.length. Done here to prevent potential uint32
      // coercion fail below.
      if (start > this.length) {
        return ''
      }

      if (end === undefined || end > this.length) {
        end = this.length;
      }

      if (end <= 0) {
        return ''
      }

      // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
      end >>>= 0;
      start >>>= 0;

      if (end <= start) {
        return ''
      }

      if (!encoding) encoding = 'utf8';

      while (true) {
        switch (encoding) {
          case 'hex':
            return hexSlice(this, start, end)

          case 'utf8':
          case 'utf-8':
            return utf8Slice(this, start, end)

          case 'ascii':
            return asciiSlice(this, start, end)

          case 'latin1':
          case 'binary':
            return latin1Slice(this, start, end)

          case 'base64':
            return base64Slice(this, start, end)

          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return utf16leSlice(this, start, end)

          default:
            if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
            encoding = (encoding + '').toLowerCase();
            loweredCase = true;
        }
      }
    }

    // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
    // Buffer instances.
    Buffer.prototype._isBuffer = true;

    function swap (b, n, m) {
      var i = b[n];
      b[n] = b[m];
      b[m] = i;
    }

    Buffer.prototype.swap16 = function swap16 () {
      var len = this.length;
      if (len % 2 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 16-bits')
      }
      for (var i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
      }
      return this
    };

    Buffer.prototype.swap32 = function swap32 () {
      var len = this.length;
      if (len % 4 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 32-bits')
      }
      for (var i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
      }
      return this
    };

    Buffer.prototype.swap64 = function swap64 () {
      var len = this.length;
      if (len % 8 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 64-bits')
      }
      for (var i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
      }
      return this
    };

    Buffer.prototype.toString = function toString () {
      var length = this.length | 0;
      if (length === 0) return ''
      if (arguments.length === 0) return utf8Slice(this, 0, length)
      return slowToString.apply(this, arguments)
    };

    Buffer.prototype.equals = function equals (b) {
      if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
      if (this === b) return true
      return Buffer.compare(this, b) === 0
    };

    Buffer.prototype.inspect = function inspect () {
      var str = '';
      var max = INSPECT_MAX_BYTES;
      if (this.length > 0) {
        str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
        if (this.length > max) str += ' ... ';
      }
      return '<Buffer ' + str + '>'
    };

    Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
      if (!internalIsBuffer(target)) {
        throw new TypeError('Argument must be a Buffer')
      }

      if (start === undefined) {
        start = 0;
      }
      if (end === undefined) {
        end = target ? target.length : 0;
      }
      if (thisStart === undefined) {
        thisStart = 0;
      }
      if (thisEnd === undefined) {
        thisEnd = this.length;
      }

      if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError('out of range index')
      }

      if (thisStart >= thisEnd && start >= end) {
        return 0
      }
      if (thisStart >= thisEnd) {
        return -1
      }
      if (start >= end) {
        return 1
      }

      start >>>= 0;
      end >>>= 0;
      thisStart >>>= 0;
      thisEnd >>>= 0;

      if (this === target) return 0

      var x = thisEnd - thisStart;
      var y = end - start;
      var len = Math.min(x, y);

      var thisCopy = this.slice(thisStart, thisEnd);
      var targetCopy = target.slice(start, end);

      for (var i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break
        }
      }

      if (x < y) return -1
      if (y < x) return 1
      return 0
    };

    // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
    // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
    //
    // Arguments:
    // - buffer - a Buffer to search
    // - val - a string, Buffer, or number
    // - byteOffset - an index into `buffer`; will be clamped to an int32
    // - encoding - an optional encoding, relevant is val is a string
    // - dir - true for indexOf, false for lastIndexOf
    function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
      // Empty buffer means no match
      if (buffer.length === 0) return -1

      // Normalize byteOffset
      if (typeof byteOffset === 'string') {
        encoding = byteOffset;
        byteOffset = 0;
      } else if (byteOffset > 0x7fffffff) {
        byteOffset = 0x7fffffff;
      } else if (byteOffset < -0x80000000) {
        byteOffset = -0x80000000;
      }
      byteOffset = +byteOffset;  // Coerce to Number.
      if (isNaN(byteOffset)) {
        // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
        byteOffset = dir ? 0 : (buffer.length - 1);
      }

      // Normalize byteOffset: negative offsets start from the end of the buffer
      if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
      if (byteOffset >= buffer.length) {
        if (dir) return -1
        else byteOffset = buffer.length - 1;
      } else if (byteOffset < 0) {
        if (dir) byteOffset = 0;
        else return -1
      }

      // Normalize val
      if (typeof val === 'string') {
        val = Buffer.from(val, encoding);
      }

      // Finally, search either indexOf (if dir is true) or lastIndexOf
      if (internalIsBuffer(val)) {
        // Special case: looking for empty string/buffer always fails
        if (val.length === 0) {
          return -1
        }
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
      } else if (typeof val === 'number') {
        val = val & 0xFF; // Search for a byte value [0-255]
        if (Buffer.TYPED_ARRAY_SUPPORT &&
            typeof Uint8Array.prototype.indexOf === 'function') {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
          } else {
            return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
          }
        }
        return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
      }

      throw new TypeError('val must be string, number or Buffer')
    }

    function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
      var indexSize = 1;
      var arrLength = arr.length;
      var valLength = val.length;

      if (encoding !== undefined) {
        encoding = String(encoding).toLowerCase();
        if (encoding === 'ucs2' || encoding === 'ucs-2' ||
            encoding === 'utf16le' || encoding === 'utf-16le') {
          if (arr.length < 2 || val.length < 2) {
            return -1
          }
          indexSize = 2;
          arrLength /= 2;
          valLength /= 2;
          byteOffset /= 2;
        }
      }

      function read (buf, i) {
        if (indexSize === 1) {
          return buf[i]
        } else {
          return buf.readUInt16BE(i * indexSize)
        }
      }

      var i;
      if (dir) {
        var foundIndex = -1;
        for (i = byteOffset; i < arrLength; i++) {
          if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1) foundIndex = i;
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
          } else {
            if (foundIndex !== -1) i -= i - foundIndex;
            foundIndex = -1;
          }
        }
      } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
        for (i = byteOffset; i >= 0; i--) {
          var found = true;
          for (var j = 0; j < valLength; j++) {
            if (read(arr, i + j) !== read(val, j)) {
              found = false;
              break
            }
          }
          if (found) return i
        }
      }

      return -1
    }

    Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1
    };

    Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
    };

    Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
    };

    function hexWrite (buf, string, offset, length) {
      offset = Number(offset) || 0;
      var remaining = buf.length - offset;
      if (!length) {
        length = remaining;
      } else {
        length = Number(length);
        if (length > remaining) {
          length = remaining;
        }
      }

      // must be an even number of digits
      var strLen = string.length;
      if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

      if (length > strLen / 2) {
        length = strLen / 2;
      }
      for (var i = 0; i < length; ++i) {
        var parsed = parseInt(string.substr(i * 2, 2), 16);
        if (isNaN(parsed)) return i
        buf[offset + i] = parsed;
      }
      return i
    }

    function utf8Write (buf, string, offset, length) {
      return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
    }

    function asciiWrite (buf, string, offset, length) {
      return blitBuffer(asciiToBytes(string), buf, offset, length)
    }

    function latin1Write (buf, string, offset, length) {
      return asciiWrite(buf, string, offset, length)
    }

    function base64Write (buf, string, offset, length) {
      return blitBuffer(base64ToBytes(string), buf, offset, length)
    }

    function ucs2Write (buf, string, offset, length) {
      return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
    }

    Buffer.prototype.write = function write (string, offset, length, encoding) {
      // Buffer#write(string)
      if (offset === undefined) {
        encoding = 'utf8';
        length = this.length;
        offset = 0;
      // Buffer#write(string, encoding)
      } else if (length === undefined && typeof offset === 'string') {
        encoding = offset;
        length = this.length;
        offset = 0;
      // Buffer#write(string, offset[, length][, encoding])
      } else if (isFinite(offset)) {
        offset = offset | 0;
        if (isFinite(length)) {
          length = length | 0;
          if (encoding === undefined) encoding = 'utf8';
        } else {
          encoding = length;
          length = undefined;
        }
      // legacy write(string, encoding, offset, length) - remove in v0.13
      } else {
        throw new Error(
          'Buffer.write(string, encoding, offset[, length]) is no longer supported'
        )
      }

      var remaining = this.length - offset;
      if (length === undefined || length > remaining) length = remaining;

      if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
        throw new RangeError('Attempt to write outside buffer bounds')
      }

      if (!encoding) encoding = 'utf8';

      var loweredCase = false;
      for (;;) {
        switch (encoding) {
          case 'hex':
            return hexWrite(this, string, offset, length)

          case 'utf8':
          case 'utf-8':
            return utf8Write(this, string, offset, length)

          case 'ascii':
            return asciiWrite(this, string, offset, length)

          case 'latin1':
          case 'binary':
            return latin1Write(this, string, offset, length)

          case 'base64':
            // Warning: maxLength not taken into account in base64Write
            return base64Write(this, string, offset, length)

          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return ucs2Write(this, string, offset, length)

          default:
            if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
            encoding = ('' + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    };

    Buffer.prototype.toJSON = function toJSON () {
      return {
        type: 'Buffer',
        data: Array.prototype.slice.call(this._arr || this, 0)
      }
    };

    function base64Slice (buf, start, end) {
      if (start === 0 && end === buf.length) {
        return fromByteArray(buf)
      } else {
        return fromByteArray(buf.slice(start, end))
      }
    }

    function utf8Slice (buf, start, end) {
      end = Math.min(buf.length, end);
      var res = [];

      var i = start;
      while (i < end) {
        var firstByte = buf[i];
        var codePoint = null;
        var bytesPerSequence = (firstByte > 0xEF) ? 4
          : (firstByte > 0xDF) ? 3
          : (firstByte > 0xBF) ? 2
          : 1;

        if (i + bytesPerSequence <= end) {
          var secondByte, thirdByte, fourthByte, tempCodePoint;

          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 0x80) {
                codePoint = firstByte;
              }
              break
            case 2:
              secondByte = buf[i + 1];
              if ((secondByte & 0xC0) === 0x80) {
                tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
                if (tempCodePoint > 0x7F) {
                  codePoint = tempCodePoint;
                }
              }
              break
            case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
                if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                  codePoint = tempCodePoint;
                }
              }
              break
            case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
              if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
                if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                  codePoint = tempCodePoint;
                }
              }
          }
        }

        if (codePoint === null) {
          // we did not generate a valid codePoint so insert a
          // replacement char (U+FFFD) and advance only 1 byte
          codePoint = 0xFFFD;
          bytesPerSequence = 1;
        } else if (codePoint > 0xFFFF) {
          // encode to utf16 (surrogate pair dance)
          codePoint -= 0x10000;
          res.push(codePoint >>> 10 & 0x3FF | 0xD800);
          codePoint = 0xDC00 | codePoint & 0x3FF;
        }

        res.push(codePoint);
        i += bytesPerSequence;
      }

      return decodeCodePointsArray(res)
    }

    // Based on http://stackoverflow.com/a/22747272/680742, the browser with
    // the lowest limit is Chrome, with 0x10000 args.
    // We go 1 magnitude less, for safety
    var MAX_ARGUMENTS_LENGTH = 0x1000;

    function decodeCodePointsArray (codePoints) {
      var len = codePoints.length;
      if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
      }

      // Decode in chunks to avoid "call stack size exceeded".
      var res = '';
      var i = 0;
      while (i < len) {
        res += String.fromCharCode.apply(
          String,
          codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
        );
      }
      return res
    }

    function asciiSlice (buf, start, end) {
      var ret = '';
      end = Math.min(buf.length, end);

      for (var i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 0x7F);
      }
      return ret
    }

    function latin1Slice (buf, start, end) {
      var ret = '';
      end = Math.min(buf.length, end);

      for (var i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i]);
      }
      return ret
    }

    function hexSlice (buf, start, end) {
      var len = buf.length;

      if (!start || start < 0) start = 0;
      if (!end || end < 0 || end > len) end = len;

      var out = '';
      for (var i = start; i < end; ++i) {
        out += toHex(buf[i]);
      }
      return out
    }

    function utf16leSlice (buf, start, end) {
      var bytes = buf.slice(start, end);
      var res = '';
      for (var i = 0; i < bytes.length; i += 2) {
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
      }
      return res
    }

    Buffer.prototype.slice = function slice (start, end) {
      var len = this.length;
      start = ~~start;
      end = end === undefined ? len : ~~end;

      if (start < 0) {
        start += len;
        if (start < 0) start = 0;
      } else if (start > len) {
        start = len;
      }

      if (end < 0) {
        end += len;
        if (end < 0) end = 0;
      } else if (end > len) {
        end = len;
      }

      if (end < start) end = start;

      var newBuf;
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        newBuf = this.subarray(start, end);
        newBuf.__proto__ = Buffer.prototype;
      } else {
        var sliceLen = end - start;
        newBuf = new Buffer(sliceLen, undefined);
        for (var i = 0; i < sliceLen; ++i) {
          newBuf[i] = this[i + start];
        }
      }

      return newBuf
    };

    /*
     * Need to make sure that buffer isn't trying to write out of bounds.
     */
    function checkOffset (offset, ext, length) {
      if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
      if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
    }

    Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
      offset = offset | 0;
      byteLength = byteLength | 0;
      if (!noAssert) checkOffset(offset, byteLength, this.length);

      var val = this[offset];
      var mul = 1;
      var i = 0;
      while (++i < byteLength && (mul *= 0x100)) {
        val += this[offset + i] * mul;
      }

      return val
    };

    Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
      offset = offset | 0;
      byteLength = byteLength | 0;
      if (!noAssert) {
        checkOffset(offset, byteLength, this.length);
      }

      var val = this[offset + --byteLength];
      var mul = 1;
      while (byteLength > 0 && (mul *= 0x100)) {
        val += this[offset + --byteLength] * mul;
      }

      return val
    };

    Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 1, this.length);
      return this[offset]
    };

    Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] | (this[offset + 1] << 8)
    };

    Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 2, this.length);
      return (this[offset] << 8) | this[offset + 1]
    };

    Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length);

      return ((this[offset]) |
          (this[offset + 1] << 8) |
          (this[offset + 2] << 16)) +
          (this[offset + 3] * 0x1000000)
    };

    Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length);

      return (this[offset] * 0x1000000) +
        ((this[offset + 1] << 16) |
        (this[offset + 2] << 8) |
        this[offset + 3])
    };

    Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
      offset = offset | 0;
      byteLength = byteLength | 0;
      if (!noAssert) checkOffset(offset, byteLength, this.length);

      var val = this[offset];
      var mul = 1;
      var i = 0;
      while (++i < byteLength && (mul *= 0x100)) {
        val += this[offset + i] * mul;
      }
      mul *= 0x80;

      if (val >= mul) val -= Math.pow(2, 8 * byteLength);

      return val
    };

    Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
      offset = offset | 0;
      byteLength = byteLength | 0;
      if (!noAssert) checkOffset(offset, byteLength, this.length);

      var i = byteLength;
      var mul = 1;
      var val = this[offset + --i];
      while (i > 0 && (mul *= 0x100)) {
        val += this[offset + --i] * mul;
      }
      mul *= 0x80;

      if (val >= mul) val -= Math.pow(2, 8 * byteLength);

      return val
    };

    Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 1, this.length);
      if (!(this[offset] & 0x80)) return (this[offset])
      return ((0xff - this[offset] + 1) * -1)
    };

    Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 2, this.length);
      var val = this[offset] | (this[offset + 1] << 8);
      return (val & 0x8000) ? val | 0xFFFF0000 : val
    };

    Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 2, this.length);
      var val = this[offset + 1] | (this[offset] << 8);
      return (val & 0x8000) ? val | 0xFFFF0000 : val
    };

    Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length);

      return (this[offset]) |
        (this[offset + 1] << 8) |
        (this[offset + 2] << 16) |
        (this[offset + 3] << 24)
    };

    Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length);

      return (this[offset] << 24) |
        (this[offset + 1] << 16) |
        (this[offset + 2] << 8) |
        (this[offset + 3])
    };

    Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length);
      return read(this, offset, true, 23, 4)
    };

    Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length);
      return read(this, offset, false, 23, 4)
    };

    Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 8, this.length);
      return read(this, offset, true, 52, 8)
    };

    Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 8, this.length);
      return read(this, offset, false, 52, 8)
    };

    function checkInt (buf, value, offset, ext, max, min) {
      if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
      if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
      if (offset + ext > buf.length) throw new RangeError('Index out of range')
    }

    Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
      value = +value;
      offset = offset | 0;
      byteLength = byteLength | 0;
      if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength) - 1;
        checkInt(this, value, offset, byteLength, maxBytes, 0);
      }

      var mul = 1;
      var i = 0;
      this[offset] = value & 0xFF;
      while (++i < byteLength && (mul *= 0x100)) {
        this[offset + i] = (value / mul) & 0xFF;
      }

      return offset + byteLength
    };

    Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
      value = +value;
      offset = offset | 0;
      byteLength = byteLength | 0;
      if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength) - 1;
        checkInt(this, value, offset, byteLength, maxBytes, 0);
      }

      var i = byteLength - 1;
      var mul = 1;
      this[offset + i] = value & 0xFF;
      while (--i >= 0 && (mul *= 0x100)) {
        this[offset + i] = (value / mul) & 0xFF;
      }

      return offset + byteLength
    };

    Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
      if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
      this[offset] = (value & 0xff);
      return offset + 1
    };

    function objectWriteUInt16 (buf, value, offset, littleEndian) {
      if (value < 0) value = 0xffff + value + 1;
      for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
        buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
          (littleEndian ? i : 1 - i) * 8;
      }
    }

    Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value & 0xff);
        this[offset + 1] = (value >>> 8);
      } else {
        objectWriteUInt16(this, value, offset, true);
      }
      return offset + 2
    };

    Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value >>> 8);
        this[offset + 1] = (value & 0xff);
      } else {
        objectWriteUInt16(this, value, offset, false);
      }
      return offset + 2
    };

    function objectWriteUInt32 (buf, value, offset, littleEndian) {
      if (value < 0) value = 0xffffffff + value + 1;
      for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
        buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
      }
    }

    Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset + 3] = (value >>> 24);
        this[offset + 2] = (value >>> 16);
        this[offset + 1] = (value >>> 8);
        this[offset] = (value & 0xff);
      } else {
        objectWriteUInt32(this, value, offset, true);
      }
      return offset + 4
    };

    Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value >>> 24);
        this[offset + 1] = (value >>> 16);
        this[offset + 2] = (value >>> 8);
        this[offset + 3] = (value & 0xff);
      } else {
        objectWriteUInt32(this, value, offset, false);
      }
      return offset + 4
    };

    Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength - 1);

        checkInt(this, value, offset, byteLength, limit - 1, -limit);
      }

      var i = 0;
      var mul = 1;
      var sub = 0;
      this[offset] = value & 0xFF;
      while (++i < byteLength && (mul *= 0x100)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
      }

      return offset + byteLength
    };

    Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength - 1);

        checkInt(this, value, offset, byteLength, limit - 1, -limit);
      }

      var i = byteLength - 1;
      var mul = 1;
      var sub = 0;
      this[offset + i] = value & 0xFF;
      while (--i >= 0 && (mul *= 0x100)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
      }

      return offset + byteLength
    };

    Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
      if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
      if (value < 0) value = 0xff + value + 1;
      this[offset] = (value & 0xff);
      return offset + 1
    };

    Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value & 0xff);
        this[offset + 1] = (value >>> 8);
      } else {
        objectWriteUInt16(this, value, offset, true);
      }
      return offset + 2
    };

    Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value >>> 8);
        this[offset + 1] = (value & 0xff);
      } else {
        objectWriteUInt16(this, value, offset, false);
      }
      return offset + 2
    };

    Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value & 0xff);
        this[offset + 1] = (value >>> 8);
        this[offset + 2] = (value >>> 16);
        this[offset + 3] = (value >>> 24);
      } else {
        objectWriteUInt32(this, value, offset, true);
      }
      return offset + 4
    };

    Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
      if (value < 0) value = 0xffffffff + value + 1;
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value >>> 24);
        this[offset + 1] = (value >>> 16);
        this[offset + 2] = (value >>> 8);
        this[offset + 3] = (value & 0xff);
      } else {
        objectWriteUInt32(this, value, offset, false);
      }
      return offset + 4
    };

    function checkIEEE754 (buf, value, offset, ext, max, min) {
      if (offset + ext > buf.length) throw new RangeError('Index out of range')
      if (offset < 0) throw new RangeError('Index out of range')
    }

    function writeFloat (buf, value, offset, littleEndian, noAssert) {
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 4);
      }
      write(buf, value, offset, littleEndian, 23, 4);
      return offset + 4
    }

    Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert)
    };

    Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert)
    };

    function writeDouble (buf, value, offset, littleEndian, noAssert) {
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 8);
      }
      write(buf, value, offset, littleEndian, 52, 8);
      return offset + 8
    }

    Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert)
    };

    Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert)
    };

    // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
    Buffer.prototype.copy = function copy (target, targetStart, start, end) {
      if (!start) start = 0;
      if (!end && end !== 0) end = this.length;
      if (targetStart >= target.length) targetStart = target.length;
      if (!targetStart) targetStart = 0;
      if (end > 0 && end < start) end = start;

      // Copy 0 bytes; we're done
      if (end === start) return 0
      if (target.length === 0 || this.length === 0) return 0

      // Fatal error conditions
      if (targetStart < 0) {
        throw new RangeError('targetStart out of bounds')
      }
      if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
      if (end < 0) throw new RangeError('sourceEnd out of bounds')

      // Are we oob?
      if (end > this.length) end = this.length;
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
      }

      var len = end - start;
      var i;

      if (this === target && start < targetStart && targetStart < end) {
        // descending copy from end
        for (i = len - 1; i >= 0; --i) {
          target[i + targetStart] = this[i + start];
        }
      } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
        // ascending copy from start
        for (i = 0; i < len; ++i) {
          target[i + targetStart] = this[i + start];
        }
      } else {
        Uint8Array.prototype.set.call(
          target,
          this.subarray(start, start + len),
          targetStart
        );
      }

      return len
    };

    // Usage:
    //    buffer.fill(number[, offset[, end]])
    //    buffer.fill(buffer[, offset[, end]])
    //    buffer.fill(string[, offset[, end]][, encoding])
    Buffer.prototype.fill = function fill (val, start, end, encoding) {
      // Handle string cases:
      if (typeof val === 'string') {
        if (typeof start === 'string') {
          encoding = start;
          start = 0;
          end = this.length;
        } else if (typeof end === 'string') {
          encoding = end;
          end = this.length;
        }
        if (val.length === 1) {
          var code = val.charCodeAt(0);
          if (code < 256) {
            val = code;
          }
        }
        if (encoding !== undefined && typeof encoding !== 'string') {
          throw new TypeError('encoding must be a string')
        }
        if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
          throw new TypeError('Unknown encoding: ' + encoding)
        }
      } else if (typeof val === 'number') {
        val = val & 255;
      }

      // Invalid ranges are not set to a default, so can range check early.
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError('Out of range index')
      }

      if (end <= start) {
        return this
      }

      start = start >>> 0;
      end = end === undefined ? this.length : end >>> 0;

      if (!val) val = 0;

      var i;
      if (typeof val === 'number') {
        for (i = start; i < end; ++i) {
          this[i] = val;
        }
      } else {
        var bytes = internalIsBuffer(val)
          ? val
          : utf8ToBytes(new Buffer(val, encoding).toString());
        var len = bytes.length;
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes[i % len];
        }
      }

      return this
    };

    // HELPER FUNCTIONS
    // ================

    var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

    function base64clean (str) {
      // Node strips out invalid characters like \n and \t from the string, base64-js does not
      str = stringtrim(str).replace(INVALID_BASE64_RE, '');
      // Node converts strings with length < 2 to ''
      if (str.length < 2) return ''
      // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
      while (str.length % 4 !== 0) {
        str = str + '=';
      }
      return str
    }

    function stringtrim (str) {
      if (str.trim) return str.trim()
      return str.replace(/^\s+|\s+$/g, '')
    }

    function toHex (n) {
      if (n < 16) return '0' + n.toString(16)
      return n.toString(16)
    }

    function utf8ToBytes (string, units) {
      units = units || Infinity;
      var codePoint;
      var length = string.length;
      var leadSurrogate = null;
      var bytes = [];

      for (var i = 0; i < length; ++i) {
        codePoint = string.charCodeAt(i);

        // is surrogate component
        if (codePoint > 0xD7FF && codePoint < 0xE000) {
          // last char was a lead
          if (!leadSurrogate) {
            // no lead yet
            if (codePoint > 0xDBFF) {
              // unexpected trail
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
              continue
            } else if (i + 1 === length) {
              // unpaired lead
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
              continue
            }

            // valid lead
            leadSurrogate = codePoint;

            continue
          }

          // 2 leads in a row
          if (codePoint < 0xDC00) {
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
            leadSurrogate = codePoint;
            continue
          }

          // valid surrogate pair
          codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
        } else if (leadSurrogate) {
          // valid bmp char, but last char was a lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        }

        leadSurrogate = null;

        // encode utf8
        if (codePoint < 0x80) {
          if ((units -= 1) < 0) break
          bytes.push(codePoint);
        } else if (codePoint < 0x800) {
          if ((units -= 2) < 0) break
          bytes.push(
            codePoint >> 0x6 | 0xC0,
            codePoint & 0x3F | 0x80
          );
        } else if (codePoint < 0x10000) {
          if ((units -= 3) < 0) break
          bytes.push(
            codePoint >> 0xC | 0xE0,
            codePoint >> 0x6 & 0x3F | 0x80,
            codePoint & 0x3F | 0x80
          );
        } else if (codePoint < 0x110000) {
          if ((units -= 4) < 0) break
          bytes.push(
            codePoint >> 0x12 | 0xF0,
            codePoint >> 0xC & 0x3F | 0x80,
            codePoint >> 0x6 & 0x3F | 0x80,
            codePoint & 0x3F | 0x80
          );
        } else {
          throw new Error('Invalid code point')
        }
      }

      return bytes
    }

    function asciiToBytes (str) {
      var byteArray = [];
      for (var i = 0; i < str.length; ++i) {
        // Node's code seems to be doing this and not & 0x7F..
        byteArray.push(str.charCodeAt(i) & 0xFF);
      }
      return byteArray
    }

    function utf16leToBytes (str, units) {
      var c, hi, lo;
      var byteArray = [];
      for (var i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0) break

        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
      }

      return byteArray
    }


    function base64ToBytes (str) {
      return toByteArray(base64clean(str))
    }

    function blitBuffer (src, dst, offset, length) {
      for (var i = 0; i < length; ++i) {
        if ((i + offset >= dst.length) || (i >= src.length)) break
        dst[i + offset] = src[i];
      }
      return i
    }

    function isnan (val) {
      return val !== val // eslint-disable-line no-self-compare
    }


    // the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
    // The _isBuffer check is for Safari 5-7 support, because it's missing
    // Object.prototype.constructor. Remove this eventually
    function isBuffer(obj) {
      return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
    }

    function isFastBuffer (obj) {
      return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
    }

    // For Node v0.10 support. Remove this eventually.
    function isSlowBuffer (obj) {
      return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
    }

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function getAugmentedNamespace(n) {
      if (n.__esModule) return n;
      var f = n.default;
    	if (typeof f == "function") {
    		var a = function a () {
    			if (this instanceof a) {
    				var args = [null];
    				args.push.apply(args, arguments);
    				var Ctor = Function.bind.apply(f, args);
    				return new Ctor();
    			}
    			return f.apply(this, arguments);
    		};
    		a.prototype = f.prototype;
      } else a = {};
      Object.defineProperty(a, '__esModule', {value: true});
    	Object.keys(n).forEach(function (k) {
    		var d = Object.getOwnPropertyDescriptor(n, k);
    		Object.defineProperty(a, k, d.get ? d : {
    			enumerable: true,
    			get: function () {
    				return n[k];
    			}
    		});
    	});
    	return a;
    }

    var sqlWasm = {exports: {}};

    var _polyfillNode_fs = {};

    var _polyfillNode_fs$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        default: _polyfillNode_fs
    });

    var require$$0 = /*@__PURE__*/getAugmentedNamespace(_polyfillNode_fs$1);

    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    // resolves . and .. elements in a path array with directory names there
    // must be no slashes, empty elements, or device names (c:\) in the array
    // (so also no leading and trailing slashes - it does not distinguish
    // relative and absolute paths)
    function normalizeArray(parts, allowAboveRoot) {
      // if the path tries to go above the root, `up` ends up > 0
      var up = 0;
      for (var i = parts.length - 1; i >= 0; i--) {
        var last = parts[i];
        if (last === '.') {
          parts.splice(i, 1);
        } else if (last === '..') {
          parts.splice(i, 1);
          up++;
        } else if (up) {
          parts.splice(i, 1);
          up--;
        }
      }

      // if the path is allowed to go above the root, restore leading ..s
      if (allowAboveRoot) {
        for (; up--; up) {
          parts.unshift('..');
        }
      }

      return parts;
    }

    // Split a filename into [root, dir, basename, ext], unix version
    // 'root' is just a slash, or nothing.
    var splitPathRe =
        /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    var splitPath = function(filename) {
      return splitPathRe.exec(filename).slice(1);
    };

    // path.resolve([from ...], to)
    // posix version
    function resolve() {
      var resolvedPath = '',
          resolvedAbsolute = false;

      for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        var path = (i >= 0) ? arguments[i] : '/';

        // Skip empty and invalid entries
        if (typeof path !== 'string') {
          throw new TypeError('Arguments to path.resolve must be strings');
        } else if (!path) {
          continue;
        }

        resolvedPath = path + '/' + resolvedPath;
        resolvedAbsolute = path.charAt(0) === '/';
      }

      // At this point the path should be resolved to a full absolute path, but
      // handle relative paths to be safe (might happen when process.cwd() fails)

      // Normalize the path
      resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
        return !!p;
      }), !resolvedAbsolute).join('/');

      return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
    }
    // path.normalize(path)
    // posix version
    function normalize(path) {
      var isPathAbsolute = isAbsolute(path),
          trailingSlash = substr(path, -1) === '/';

      // Normalize the path
      path = normalizeArray(filter(path.split('/'), function(p) {
        return !!p;
      }), !isPathAbsolute).join('/');

      if (!path && !isPathAbsolute) {
        path = '.';
      }
      if (path && trailingSlash) {
        path += '/';
      }

      return (isPathAbsolute ? '/' : '') + path;
    }
    // posix version
    function isAbsolute(path) {
      return path.charAt(0) === '/';
    }

    // posix version
    function join() {
      var paths = Array.prototype.slice.call(arguments, 0);
      return normalize(filter(paths, function(p, index) {
        if (typeof p !== 'string') {
          throw new TypeError('Arguments to path.join must be strings');
        }
        return p;
      }).join('/'));
    }


    // path.relative(from, to)
    // posix version
    function relative(from, to) {
      from = resolve(from).substr(1);
      to = resolve(to).substr(1);

      function trim(arr) {
        var start = 0;
        for (; start < arr.length; start++) {
          if (arr[start] !== '') break;
        }

        var end = arr.length - 1;
        for (; end >= 0; end--) {
          if (arr[end] !== '') break;
        }

        if (start > end) return [];
        return arr.slice(start, end - start + 1);
      }

      var fromParts = trim(from.split('/'));
      var toParts = trim(to.split('/'));

      var length = Math.min(fromParts.length, toParts.length);
      var samePartsLength = length;
      for (var i = 0; i < length; i++) {
        if (fromParts[i] !== toParts[i]) {
          samePartsLength = i;
          break;
        }
      }

      var outputParts = [];
      for (var i = samePartsLength; i < fromParts.length; i++) {
        outputParts.push('..');
      }

      outputParts = outputParts.concat(toParts.slice(samePartsLength));

      return outputParts.join('/');
    }

    var sep = '/';
    var delimiter = ':';

    function dirname(path) {
      var result = splitPath(path),
          root = result[0],
          dir = result[1];

      if (!root && !dir) {
        // No dirname whatsoever
        return '.';
      }

      if (dir) {
        // It has a dirname, strip trailing slash
        dir = dir.substr(0, dir.length - 1);
      }

      return root + dir;
    }

    function basename(path, ext) {
      var f = splitPath(path)[2];
      // TODO: make this comparison case-insensitive on windows?
      if (ext && f.substr(-1 * ext.length) === ext) {
        f = f.substr(0, f.length - ext.length);
      }
      return f;
    }


    function extname(path) {
      return splitPath(path)[3];
    }
    var _polyfillNode_path = {
      extname: extname,
      basename: basename,
      dirname: dirname,
      sep: sep,
      delimiter: delimiter,
      relative: relative,
      join: join,
      isAbsolute: isAbsolute,
      normalize: normalize,
      resolve: resolve
    };
    function filter (xs, f) {
        if (xs.filter) return xs.filter(f);
        var res = [];
        for (var i = 0; i < xs.length; i++) {
            if (f(xs[i], i, xs)) res.push(xs[i]);
        }
        return res;
    }

    // String.prototype.substr - negative index don't work in IE8
    var substr = 'ab'.substr(-1) === 'b' ?
        function (str, start, len) { return str.substr(start, len) } :
        function (str, start, len) {
            if (start < 0) start = str.length + start;
            return str.substr(start, len);
        }
    ;

    var _polyfillNode_path$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        basename: basename,
        default: _polyfillNode_path,
        delimiter: delimiter,
        dirname: dirname,
        extname: extname,
        isAbsolute: isAbsolute,
        join: join,
        normalize: normalize,
        relative: relative,
        resolve: resolve,
        sep: sep
    });

    var require$$1 = /*@__PURE__*/getAugmentedNamespace(_polyfillNode_path$1);

    var _polyfillNode_crypto = {};

    var _polyfillNode_crypto$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        default: _polyfillNode_crypto
    });

    var require$$2 = /*@__PURE__*/getAugmentedNamespace(_polyfillNode_crypto$1);

    (function (module, exports) {
    	// We are modularizing this manually because the current modularize setting in Emscripten has some issues:
    	// https://github.com/kripken/emscripten/issues/5820
    	// In addition, When you use emcc's modularization, it still expects to export a global object called `Module`,
    	// which is able to be used/called before the WASM is loaded.
    	// The modularization below exports a promise that loads and resolves to the actual sql.js module.
    	// That way, this module can't be used before the WASM is finished loading.

    	// We are going to define a function that a user will call to start loading initializing our Sql.js library
    	// However, that function might be called multiple times, and on subsequent calls, we don't actually want it to instantiate a new instance of the Module
    	// Instead, we want to return the previously loaded module

    	// TODO: Make this not declare a global if used in the browser
    	var initSqlJsPromise = undefined;

    	var initSqlJs = function (moduleConfig) {

    	    if (initSqlJsPromise){
    	      return initSqlJsPromise;
    	    }
    	    // If we're here, we've never called this function before
    	    initSqlJsPromise = new Promise(function (resolveModule, reject) {

    	        // We are modularizing this manually because the current modularize setting in Emscripten has some issues:
    	        // https://github.com/kripken/emscripten/issues/5820

    	        // The way to affect the loading of emcc compiled modules is to create a variable called `Module` and add
    	        // properties to it, like `preRun`, `postRun`, etc
    	        // We are using that to get notified when the WASM has finished loading.
    	        // Only then will we return our promise

    	        // If they passed in a moduleConfig object, use that
    	        // Otherwise, initialize Module to the empty object
    	        var Module = typeof moduleConfig !== 'undefined' ? moduleConfig : {};

    	        // EMCC only allows for a single onAbort function (not an array of functions)
    	        // So if the user defined their own onAbort function, we remember it and call it
    	        var originalOnAbortFunction = Module['onAbort'];
    	        Module['onAbort'] = function (errorThatCausedAbort) {
    	            reject(new Error(errorThatCausedAbort));
    	            if (originalOnAbortFunction){
    	              originalOnAbortFunction(errorThatCausedAbort);
    	            }
    	        };

    	        Module['postRun'] = Module['postRun'] || [];
    	        Module['postRun'].push(function () {
    	            // When Emscripted calls postRun, this promise resolves with the built Module
    	            resolveModule(Module);
    	        });

    	        // There is a section of code in the emcc-generated code below that looks like this:
    	        // (Note that this is lowercase `module`)
    	        // if (typeof module !== 'undefined') {
    	        //     module['exports'] = Module;
    	        // }
    	        // When that runs, it's going to overwrite our own modularization export efforts in shell-post.js!
    	        // The only way to tell emcc not to emit it is to pass the MODULARIZE=1 or MODULARIZE_INSTANCE=1 flags,
    	        // but that carries with it additional unnecessary baggage/bugs we don't want either.
    	        // So, we have three options:
    	        // 1) We undefine `module`
    	        // 2) We remember what `module['exports']` was at the beginning of this function and we restore it later
    	        // 3) We write a script to remove those lines of code as part of the Make process.
    	        //
    	        // Since those are the only lines of code that care about module, we will undefine it. It's the most straightforward
    	        // of the options, and has the side effect of reducing emcc's efforts to modify the module if its output were to change in the future.
    	        // That's a nice side effect since we're handling the modularization efforts ourselves
    	        module = undefined;

    	        // The emcc-generated code and shell-post.js code goes below,
    	        // meaning that all of it runs inside of this promise. If anything throws an exception, our promise will abort
    	var f;f||=typeof Module != 'undefined' ? Module : {};var aa="object"==typeof window,ba="function"==typeof importScripts,ca="object"==typeof browser$1&&"object"==typeof browser$1.versions&&"string"==typeof browser$1.versions.node;	f.onRuntimeInitialized=function(){function a(g,l){switch(typeof l){case "boolean":fc(g,l?1:0);break;case "number":gc(g,l);break;case "string":hc(g,l,-1,-1);break;case "object":if(null===l)ib(g);else if(null!=l.length){var n=da(l,ea);ic(g,n,l.length,-1);fa(n);}else xa(g,"Wrong API use : tried to return a value of an unknown type ("+l+").",-1);break;default:ib(g);}}function b(g,l){for(var n=[],t=0;t<g;t+=1){var w=m(l+4*t,"i32"),A=jc(w);if(1===A||2===A)w=kc(w);else if(3===A)w=lc(w);else if(4===A){A=w;
    	w=mc(A);A=nc(A);for(var N=new Uint8Array(w),M=0;M<w;M+=1)N[M]=p[A+M];w=N;}else w=null;n.push(w);}return n}function c(g,l){this.Ka=g;this.db=l;this.Ia=1;this.eb=[];}function d(g,l){this.db=l;l=ha(g)+1;this.Xa=ia(l);if(null===this.Xa)throw Error("Unable to allocate memory for the SQL string");q(g,u,this.Xa,l);this.cb=this.Xa;this.Ta=this.hb=null;}function e(g){this.filename="dbfile_"+(4294967295*Math.random()>>>0);if(null!=g){var l=this.filename,n="/",t=l;n&&(n="string"==typeof n?n:ja(n),t=l?x(n+"/"+l):
    	n);l=ka(!0,!0);t=la(t,(void 0!==l?l:438)&4095|32768,0);if(g){if("string"==typeof g){n=Array(g.length);for(var w=0,A=g.length;w<A;++w)n[w]=g.charCodeAt(w);g=n;}ma(t,l|146);n=na(t,577);oa(n,g,0,g.length,0);pa(n);ma(t,l);}}this.handleError(r(this.filename,h));this.db=m(h,"i32");lb(this.db);this.Ya={};this.Ma={};}var h=y(4),k=f.cwrap,r=k("sqlite3_open","number",["string","number"]),z=k("sqlite3_close_v2","number",["number"]),v=k("sqlite3_exec","number",["number","string","number","number","number"]),E=k("sqlite3_changes",
    	"number",["number"]),H=k("sqlite3_prepare_v2","number",["number","string","number","number","number"]),mb=k("sqlite3_sql","string",["number"]),oc=k("sqlite3_normalized_sql","string",["number"]),nb=k("sqlite3_prepare_v2","number",["number","number","number","number","number"]),pc=k("sqlite3_bind_text","number",["number","number","number","number","number"]),ob=k("sqlite3_bind_blob","number",["number","number","number","number","number"]),qc=k("sqlite3_bind_double","number",["number","number","number"]),
    	rc=k("sqlite3_bind_int","number",["number","number","number"]),sc=k("sqlite3_bind_parameter_index","number",["number","string"]),tc=k("sqlite3_step","number",["number"]),uc=k("sqlite3_errmsg","string",["number"]),vc=k("sqlite3_column_count","number",["number"]),wc=k("sqlite3_data_count","number",["number"]),xc=k("sqlite3_column_double","number",["number","number"]),pb=k("sqlite3_column_text","string",["number","number"]),yc=k("sqlite3_column_blob","number",["number","number"]),zc=k("sqlite3_column_bytes",
    	"number",["number","number"]),Ac=k("sqlite3_column_type","number",["number","number"]),Bc=k("sqlite3_column_name","string",["number","number"]),Cc=k("sqlite3_reset","number",["number"]),Dc=k("sqlite3_clear_bindings","number",["number"]),Ec=k("sqlite3_finalize","number",["number"]),qb=k("sqlite3_create_function_v2","number","number string number number number number number number number".split(" ")),jc=k("sqlite3_value_type","number",["number"]),mc=k("sqlite3_value_bytes","number",["number"]),lc=k("sqlite3_value_text",
    	"string",["number"]),nc=k("sqlite3_value_blob","number",["number"]),kc=k("sqlite3_value_double","number",["number"]),gc=k("sqlite3_result_double","",["number","number"]),ib=k("sqlite3_result_null","",["number"]),hc=k("sqlite3_result_text","",["number","string","number","number"]),ic=k("sqlite3_result_blob","",["number","number","number","number"]),fc=k("sqlite3_result_int","",["number","number"]),xa=k("sqlite3_result_error","",["number","string","number"]),rb=k("sqlite3_aggregate_context","number",
    	["number","number"]),lb=k("RegisterExtensionFunctions","number",["number"]);c.prototype.bind=function(g){if(!this.Ka)throw "Statement closed";this.reset();return Array.isArray(g)?this.vb(g):null!=g&&"object"===typeof g?this.wb(g):!0};c.prototype.step=function(){if(!this.Ka)throw "Statement closed";this.Ia=1;var g=tc(this.Ka);switch(g){case 100:return !0;case 101:return !1;default:throw this.db.handleError(g);}};c.prototype.qb=function(g){null==g&&(g=this.Ia,this.Ia+=1);return xc(this.Ka,g)};c.prototype.zb=
    	function(g){null==g&&(g=this.Ia,this.Ia+=1);g=pb(this.Ka,g);if("function"!==typeof BigInt)throw Error("BigInt is not supported");return BigInt(g)};c.prototype.Ab=function(g){null==g&&(g=this.Ia,this.Ia+=1);return pb(this.Ka,g)};c.prototype.getBlob=function(g){null==g&&(g=this.Ia,this.Ia+=1);var l=zc(this.Ka,g);g=yc(this.Ka,g);for(var n=new Uint8Array(l),t=0;t<l;t+=1)n[t]=p[g+t];return n};c.prototype.get=function(g,l){l=l||{};null!=g&&this.bind(g)&&this.step();g=[];for(var n=wc(this.Ka),t=0;t<n;t+=
    	1)switch(Ac(this.Ka,t)){case 1:var w=l.useBigInt?this.zb(t):this.qb(t);g.push(w);break;case 2:g.push(this.qb(t));break;case 3:g.push(this.Ab(t));break;case 4:g.push(this.getBlob(t));break;default:g.push(null);}return g};c.prototype.getColumnNames=function(){for(var g=[],l=vc(this.Ka),n=0;n<l;n+=1)g.push(Bc(this.Ka,n));return g};c.prototype.getAsObject=function(g,l){g=this.get(g,l);l=this.getColumnNames();for(var n={},t=0;t<l.length;t+=1)n[l[t]]=g[t];return n};c.prototype.getSQL=function(){return mb(this.Ka)};
    	c.prototype.getNormalizedSQL=function(){return oc(this.Ka)};c.prototype.run=function(g){null!=g&&this.bind(g);this.step();return this.reset()};c.prototype.mb=function(g,l){null==l&&(l=this.Ia,this.Ia+=1);g=qa(g);var n=da(g,ea);this.eb.push(n);this.db.handleError(pc(this.Ka,l,n,g.length-1,0));};c.prototype.ub=function(g,l){null==l&&(l=this.Ia,this.Ia+=1);var n=da(g,ea);this.eb.push(n);this.db.handleError(ob(this.Ka,l,n,g.length,0));};c.prototype.lb=function(g,l){null==l&&(l=this.Ia,this.Ia+=1);this.db.handleError((g===
    	(g|0)?rc:qc)(this.Ka,l,g));};c.prototype.xb=function(g){null==g&&(g=this.Ia,this.Ia+=1);ob(this.Ka,g,0,0,0);};c.prototype.nb=function(g,l){null==l&&(l=this.Ia,this.Ia+=1);switch(typeof g){case "string":this.mb(g,l);return;case "number":this.lb(g,l);return;case "bigint":this.mb(g.toString(),l);return;case "boolean":this.lb(g+0,l);return;case "object":if(null===g){this.xb(l);return}if(null!=g.length){this.ub(g,l);return}}throw "Wrong API use : tried to bind a value of an unknown type ("+g+").";};c.prototype.wb=
    	function(g){var l=this;Object.keys(g).forEach(function(n){var t=sc(l.Ka,n);0!==t&&l.nb(g[n],t);});return !0};c.prototype.vb=function(g){for(var l=0;l<g.length;l+=1)this.nb(g[l],l+1);return !0};c.prototype.reset=function(){this.freemem();return 0===Dc(this.Ka)&&0===Cc(this.Ka)};c.prototype.freemem=function(){for(var g;void 0!==(g=this.eb.pop());)fa(g);};c.prototype.free=function(){this.freemem();var g=0===Ec(this.Ka);delete this.db.Ya[this.Ka];this.Ka=0;return g};d.prototype.next=function(){if(null===
    	this.Xa)return {done:!0};null!==this.Ta&&(this.Ta.free(),this.Ta=null);if(!this.db.db)throw this.fb(),Error("Database closed");var g=ra(),l=y(4);sa(h);sa(l);try{this.db.handleError(nb(this.db.db,this.cb,-1,h,l));this.cb=m(l,"i32");var n=m(h,"i32");if(0===n)return this.fb(),{done:!0};this.Ta=new c(n,this.db);this.db.Ya[n]=this.Ta;return {value:this.Ta,done:!1}}catch(t){throw this.hb=ta(this.cb),this.fb(),t;}finally{ua(g);}};d.prototype.fb=function(){fa(this.Xa);this.Xa=null;};d.prototype.getRemainingSQL=
    	function(){return null!==this.hb?this.hb:ta(this.cb)};"function"===typeof Symbol&&"symbol"===typeof Symbol.iterator&&(d.prototype[Symbol.iterator]=function(){return this});e.prototype.run=function(g,l){if(!this.db)throw "Database closed";if(l){g=this.prepare(g,l);try{g.step();}finally{g.free();}}else this.handleError(v(this.db,g,0,0,h));return this};e.prototype.exec=function(g,l,n){if(!this.db)throw "Database closed";var t=ra(),w=null;try{var A=va(g),N=y(4);for(g=[];0!==m(A,"i8");){sa(h);sa(N);this.handleError(nb(this.db,
    	A,-1,h,N));var M=m(h,"i32");A=m(N,"i32");if(0!==M){var K=null;w=new c(M,this);for(null!=l&&w.bind(l);w.step();)null===K&&(K={columns:w.getColumnNames(),values:[]},g.push(K)),K.values.push(w.get(null,n));w.free();}}return g}catch(O){throw w&&w.free(),O;}finally{ua(t);}};e.prototype.each=function(g,l,n,t,w){"function"===typeof l&&(t=n,n=l,l=void 0);g=this.prepare(g,l);try{for(;g.step();)n(g.getAsObject(null,w));}finally{g.free();}if("function"===typeof t)return t()};e.prototype.prepare=function(g,l){sa(h);
    	this.handleError(H(this.db,g,-1,h,0));g=m(h,"i32");if(0===g)throw "Nothing to prepare";var n=new c(g,this);null!=l&&n.bind(l);return this.Ya[g]=n};e.prototype.iterateStatements=function(g){return new d(g,this)};e.prototype["export"]=function(){Object.values(this.Ya).forEach(function(l){l.free();});Object.values(this.Ma).forEach(wa);this.Ma={};this.handleError(z(this.db));var g=ya(this.filename);this.handleError(r(this.filename,h));this.db=m(h,"i32");lb(this.db);return g};e.prototype.close=function(){null!==
    	this.db&&(Object.values(this.Ya).forEach(function(g){g.free();}),Object.values(this.Ma).forEach(wa),this.Ma={},this.handleError(z(this.db)),za("/"+this.filename),this.db=null);};e.prototype.handleError=function(g){if(0===g)return null;g=uc(this.db);throw Error(g);};e.prototype.getRowsModified=function(){return E(this.db)};e.prototype.create_function=function(g,l){Object.prototype.hasOwnProperty.call(this.Ma,g)&&(wa(this.Ma[g]),delete this.Ma[g]);var n=Aa(function(t,w,A){w=b(w,A);try{var N=l.apply(null,
    	w);}catch(M){xa(t,M,-1);return}a(t,N);},"viii");this.Ma[g]=n;this.handleError(qb(this.db,g,l.length,1,0,n,0,0,0));return this};e.prototype.create_aggregate=function(g,l){var n=l.init||function(){return null},t=l.finalize||function(K){return K},w=l.step;if(!w)throw "An aggregate function must have a step function in "+g;var A={};Object.hasOwnProperty.call(this.Ma,g)&&(wa(this.Ma[g]),delete this.Ma[g]);l=g+"__finalize";Object.hasOwnProperty.call(this.Ma,l)&&(wa(this.Ma[l]),delete this.Ma[l]);var N=Aa(function(K,
    	O,Ra){var Y=rb(K,1);Object.hasOwnProperty.call(A,Y)||(A[Y]=n());O=b(O,Ra);O=[A[Y]].concat(O);try{A[Y]=w.apply(null,O);}catch(Gc){delete A[Y],xa(K,Gc,-1);}},"viii"),M=Aa(function(K){var O=rb(K,1);try{var Ra=t(A[O]);}catch(Y){delete A[O];xa(K,Y,-1);return}a(K,Ra);delete A[O];},"vi");this.Ma[g]=N;this.Ma[l]=M;this.handleError(qb(this.db,g,w.length-1,1,0,0,N,M,0));return this};f.Database=e;};var Ba=Object.assign({},f),Ca="./this.program",B="",Da,Ea;
    	if(ca){var fs=require$$0,Fa=require$$1;B=__dirname+"/";Ea=a=>{a=Ga(a)?new URL(a):Fa.normalize(a);return fs.readFileSync(a)};Da=a=>{a=Ga(a)?new URL(a):Fa.normalize(a);return new Promise((b,c)=>{fs.readFile(a,void 0,(d,e)=>{d?c(d):b(e.buffer);});})};!f.thisProgram&&1<browser$1.argv.length&&(Ca=browser$1.argv[1].replace(/\\/g,"/"));browser$1.argv.slice(2);(module.exports=f);}else if(aa||ba)ba?B=self.location.href:"undefined"!=typeof document&&document.currentScript&&(B=document.currentScript.src),
    	B=B.startsWith("blob:")?"":B.substr(0,B.replace(/[?#].*/,"").lastIndexOf("/")+1),ba&&(Ea=a=>{var b=new XMLHttpRequest;b.open("GET",a,!1);b.responseType="arraybuffer";b.send(null);return new Uint8Array(b.response)}),Da=a=>Ga(a)?new Promise((b,c)=>{var d=new XMLHttpRequest;d.open("GET",a,!0);d.responseType="arraybuffer";d.onload=()=>{(200==d.status||0==d.status&&d.response)&&c(d.response);b(d.status);};d.onerror=b;d.send(null);}):fetch(a,{credentials:"same-origin"}).then(b=>b.ok?b.arrayBuffer():Promise.reject(Error(b.status+
    	" : "+b.url)));var Ha=f.print||console.log.bind(console),C=f.printErr||console.error.bind(console);Object.assign(f,Ba);Ba=null;f.thisProgram&&(Ca=f.thisProgram);var Ia;f.wasmBinary&&(Ia=f.wasmBinary);var Ja,Ka=!1,p,u,La,D,F,Ma,Na;
    	function Oa(){var a=Ja.buffer;f.HEAP8=p=new Int8Array(a);f.HEAP16=La=new Int16Array(a);f.HEAPU8=u=new Uint8Array(a);f.HEAPU16=new Uint16Array(a);f.HEAP32=D=new Int32Array(a);f.HEAPU32=F=new Uint32Array(a);f.HEAPF32=Ma=new Float32Array(a);f.HEAPF64=Na=new Float64Array(a);}var Pa=[],Qa=[],Sa=[];function Ta(){var a=f.preRun.shift();Pa.unshift(a);}var Ua=0,Wa=null;
    	function G(a){f.onAbort?.(a);a="Aborted("+a+")";C(a);Ka=!0;throw new WebAssembly.RuntimeError(a+". Build with -sASSERTIONS for more info.");}var Xa=a=>a.startsWith("data:application/octet-stream;base64,"),Ga=a=>a.startsWith("file://"),Ya;function Za(a){if(a==Ya&&Ia)return new Uint8Array(Ia);if(Ea)return Ea(a);throw "both async and sync fetching of the wasm failed";}function $a(a){return Ia?Promise.resolve().then(()=>Za(a)):Da(a).then(b=>new Uint8Array(b),()=>Za(a))}
    	function ab(a,b,c){return $a(a).then(d=>WebAssembly.instantiate(d,b)).then(c,d=>{C(`failed to asynchronously prepare wasm: ${d}`);G(d);})}function bb(a,b){var c=Ya;Ia||"function"!=typeof WebAssembly.instantiateStreaming||Xa(c)||Ga(c)||ca||"function"!=typeof fetch?ab(c,a,b):fetch(c,{credentials:"same-origin"}).then(d=>WebAssembly.instantiateStreaming(d,a).then(b,function(e){C(`wasm streaming compile failed: ${e}`);C("falling back to ArrayBuffer instantiation");return ab(c,a,b)}));}
    	var I,J,cb=a=>{for(;0<a.length;)a.shift()(f);};function m(a,b="i8"){b.endsWith("*")&&(b="*");switch(b){case "i1":return p[a];case "i8":return p[a];case "i16":return La[a>>1];case "i32":return D[a>>2];case "i64":G("to do getValue(i64) use WASM_BIGINT");case "float":return Ma[a>>2];case "double":return Na[a>>3];case "*":return F[a>>2];default:G(`invalid type for getValue: ${b}`);}}
    	function sa(a){var b="i32";b.endsWith("*")&&(b="*");switch(b){case "i1":p[a]=0;break;case "i8":p[a]=0;break;case "i16":La[a>>1]=0;break;case "i32":D[a>>2]=0;break;case "i64":G("to do setValue(i64) use WASM_BIGINT");case "float":Ma[a>>2]=0;break;case "double":Na[a>>3]=0;break;case "*":F[a>>2]=0;break;default:G(`invalid type for setValue: ${b}`);}}
    	var db="undefined"!=typeof TextDecoder?new TextDecoder:void 0,L=(a,b,c)=>{var d=b+c;for(c=b;a[c]&&!(c>=d);)++c;if(16<c-b&&a.buffer&&db)return db.decode(a.subarray(b,c));for(d="";b<c;){var e=a[b++];if(e&128){var h=a[b++]&63;if(192==(e&224))d+=String.fromCharCode((e&31)<<6|h);else {var k=a[b++]&63;e=224==(e&240)?(e&15)<<12|h<<6|k:(e&7)<<18|h<<12|k<<6|a[b++]&63;65536>e?d+=String.fromCharCode(e):(e-=65536,d+=String.fromCharCode(55296|e>>10,56320|e&1023));}}else d+=String.fromCharCode(e);}return d},ta=(a,
    	b)=>a?L(u,a,b):"",eb=(a,b)=>{for(var c=0,d=a.length-1;0<=d;d--){var e=a[d];"."===e?a.splice(d,1):".."===e?(a.splice(d,1),c++):c&&(a.splice(d,1),c--);}if(b)for(;c;c--)a.unshift("..");return a},x=a=>{var b="/"===a.charAt(0),c="/"===a.substr(-1);(a=eb(a.split("/").filter(d=>!!d),!b).join("/"))||b||(a=".");a&&c&&(a+="/");return (b?"/":"")+a},fb=a=>{var b=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);a=b[0];b=b[1];if(!a&&!b)return ".";b&&=b.substr(0,b.length-1);return a+
    	b},gb=a=>{if("/"===a)return "/";a=x(a);a=a.replace(/\/$/,"");var b=a.lastIndexOf("/");return -1===b?a:a.substr(b+1)},hb=()=>{if("object"==typeof crypto&&"function"==typeof crypto.getRandomValues)return c=>crypto.getRandomValues(c);if(ca)try{var a=require$$2;if(a.randomFillSync)return c=>a.randomFillSync(c);var b=a.randomBytes;return c=>(c.set(b(c.byteLength)),c)}catch(c){}G("initRandomDevice");},jb=a=>(jb=hb())(a),kb=(...a)=>{for(var b="",c=!1,d=a.length-1;-1<=d&&!c;d--){c=0<=d?a[d]:"/";if("string"!=
    	typeof c)throw new TypeError("Arguments to path.resolve must be strings");if(!c)return "";b=c+"/"+b;c="/"===c.charAt(0);}b=eb(b.split("/").filter(e=>!!e),!c).join("/");return (c?"/":"")+b||"."},sb=[],ha=a=>{for(var b=0,c=0;c<a.length;++c){var d=a.charCodeAt(c);127>=d?b++:2047>=d?b+=2:55296<=d&&57343>=d?(b+=4,++c):b+=3;}return b},q=(a,b,c,d)=>{if(!(0<d))return 0;var e=c;d=c+d-1;for(var h=0;h<a.length;++h){var k=a.charCodeAt(h);if(55296<=k&&57343>=k){var r=a.charCodeAt(++h);k=65536+((k&1023)<<10)|r&1023;}if(127>=
    	k){if(c>=d)break;b[c++]=k;}else {if(2047>=k){if(c+1>=d)break;b[c++]=192|k>>6;}else {if(65535>=k){if(c+2>=d)break;b[c++]=224|k>>12;}else {if(c+3>=d)break;b[c++]=240|k>>18;b[c++]=128|k>>12&63;}b[c++]=128|k>>6&63;}b[c++]=128|k&63;}}b[c]=0;return c-e};function qa(a,b){var c=Array(ha(a)+1);a=q(a,c,0,c.length);b&&(c.length=a);return c}var tb=[];function ub(a,b){tb[a]={input:[],output:[],Wa:b};vb(a,wb);}
    	var wb={open(a){var b=tb[a.node.rdev];if(!b)throw new P(43);a.tty=b;a.seekable=!1;},close(a){a.tty.Wa.fsync(a.tty);},fsync(a){a.tty.Wa.fsync(a.tty);},read(a,b,c,d){if(!a.tty||!a.tty.Wa.rb)throw new P(60);for(var e=0,h=0;h<d;h++){try{var k=a.tty.Wa.rb(a.tty);}catch(r){throw new P(29);}if(void 0===k&&0===e)throw new P(6);if(null===k||void 0===k)break;e++;b[c+h]=k;}e&&(a.node.timestamp=Date.now());return e},write(a,b,c,d){if(!a.tty||!a.tty.Wa.ib)throw new P(60);try{for(var e=0;e<d;e++)a.tty.Wa.ib(a.tty,b[c+
    	e]);}catch(h){throw new P(29);}d&&(a.node.timestamp=Date.now());return e}},xb={rb(){a:{if(!sb.length){var a=null;if(ca){var b=Buffer.alloc(256),c=0,d=browser$1.stdin.fd;try{c=fs.readSync(d,b,0,256);}catch(e){if(e.toString().includes("EOF"))c=0;else throw e;}0<c&&(a=b.slice(0,c).toString("utf-8"));}else "undefined"!=typeof window&&"function"==typeof window.prompt&&(a=window.prompt("Input: "),null!==a&&(a+="\n"));if(!a){a=null;break a}sb=qa(a,!0);}a=sb.shift();}return a},ib(a,b){null===b||10===b?(Ha(L(a.output,
    	0)),a.output=[]):0!=b&&a.output.push(b);},fsync(a){a.output&&0<a.output.length&&(Ha(L(a.output,0)),a.output=[]);},Lb(){return {Gb:25856,Ib:5,Fb:191,Hb:35387,Eb:[3,28,127,21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},Mb(){return 0},Nb(){return [24,80]}},yb={ib(a,b){null===b||10===b?(C(L(a.output,0)),a.output=[]):0!=b&&a.output.push(b);},fsync(a){a.output&&0<a.output.length&&(C(L(a.output,0)),a.output=[]);}};
    	function zb(a,b){var c=a.Ha?a.Ha.length:0;c>=b||(b=Math.max(b,c*(1048576>c?2:1.125)>>>0),0!=c&&(b=Math.max(b,256)),c=a.Ha,a.Ha=new Uint8Array(b),0<a.La&&a.Ha.set(c.subarray(0,a.La),0));}
    	var Q={Pa:null,Qa(){return Q.createNode(null,"/",16895,0)},createNode(a,b,c,d){if(24576===(c&61440)||4096===(c&61440))throw new P(63);Q.Pa||(Q.Pa={dir:{node:{Oa:Q.Fa.Oa,Na:Q.Fa.Na,lookup:Q.Fa.lookup,$a:Q.Fa.$a,rename:Q.Fa.rename,unlink:Q.Fa.unlink,rmdir:Q.Fa.rmdir,readdir:Q.Fa.readdir,symlink:Q.Fa.symlink},stream:{Sa:Q.Ga.Sa}},file:{node:{Oa:Q.Fa.Oa,Na:Q.Fa.Na},stream:{Sa:Q.Ga.Sa,read:Q.Ga.read,write:Q.Ga.write,kb:Q.Ga.kb,ab:Q.Ga.ab,bb:Q.Ga.bb}},link:{node:{Oa:Q.Fa.Oa,Na:Q.Fa.Na,readlink:Q.Fa.readlink},
    	stream:{}},ob:{node:{Oa:Q.Fa.Oa,Na:Q.Fa.Na},stream:Ab}});c=Bb(a,b,c,d);R(c.mode)?(c.Fa=Q.Pa.dir.node,c.Ga=Q.Pa.dir.stream,c.Ha={}):32768===(c.mode&61440)?(c.Fa=Q.Pa.file.node,c.Ga=Q.Pa.file.stream,c.La=0,c.Ha=null):40960===(c.mode&61440)?(c.Fa=Q.Pa.link.node,c.Ga=Q.Pa.link.stream):8192===(c.mode&61440)&&(c.Fa=Q.Pa.ob.node,c.Ga=Q.Pa.ob.stream);c.timestamp=Date.now();a&&(a.Ha[b]=c,a.timestamp=c.timestamp);return c},Kb(a){return a.Ha?a.Ha.subarray?a.Ha.subarray(0,a.La):new Uint8Array(a.Ha):new Uint8Array(0)},
    	Fa:{Oa(a){var b={};b.dev=8192===(a.mode&61440)?a.id:1;b.ino=a.id;b.mode=a.mode;b.nlink=1;b.uid=0;b.gid=0;b.rdev=a.rdev;R(a.mode)?b.size=4096:32768===(a.mode&61440)?b.size=a.La:40960===(a.mode&61440)?b.size=a.link.length:b.size=0;b.atime=new Date(a.timestamp);b.mtime=new Date(a.timestamp);b.ctime=new Date(a.timestamp);b.yb=4096;b.blocks=Math.ceil(b.size/b.yb);return b},Na(a,b){void 0!==b.mode&&(a.mode=b.mode);void 0!==b.timestamp&&(a.timestamp=b.timestamp);if(void 0!==b.size&&(b=b.size,a.La!=b))if(0==
    	b)a.Ha=null,a.La=0;else {var c=a.Ha;a.Ha=new Uint8Array(b);c&&a.Ha.set(c.subarray(0,Math.min(b,a.La)));a.La=b;}},lookup(){throw Cb[44];},$a(a,b,c,d){return Q.createNode(a,b,c,d)},rename(a,b,c){if(R(a.mode)){try{var d=Db(b,c);}catch(h){}if(d)for(var e in d.Ha)throw new P(55);}delete a.parent.Ha[a.name];a.parent.timestamp=Date.now();a.name=c;b.Ha[c]=a;b.timestamp=a.parent.timestamp;},unlink(a,b){delete a.Ha[b];a.timestamp=Date.now();},rmdir(a,b){var c=Db(a,b),d;for(d in c.Ha)throw new P(55);delete a.Ha[b];
    	a.timestamp=Date.now();},readdir(a){var b=[".",".."],c;for(c of Object.keys(a.Ha))b.push(c);return b},symlink(a,b,c){a=Q.createNode(a,b,41471,0);a.link=c;return a},readlink(a){if(40960!==(a.mode&61440))throw new P(28);return a.link}},Ga:{read(a,b,c,d,e){var h=a.node.Ha;if(e>=a.node.La)return 0;a=Math.min(a.node.La-e,d);if(8<a&&h.subarray)b.set(h.subarray(e,e+a),c);else for(d=0;d<a;d++)b[c+d]=h[e+d];return a},write(a,b,c,d,e,h){b.buffer===p.buffer&&(h=!1);if(!d)return 0;a=a.node;a.timestamp=Date.now();
    	if(b.subarray&&(!a.Ha||a.Ha.subarray)){if(h)return a.Ha=b.subarray(c,c+d),a.La=d;if(0===a.La&&0===e)return a.Ha=b.slice(c,c+d),a.La=d;if(e+d<=a.La)return a.Ha.set(b.subarray(c,c+d),e),d}zb(a,e+d);if(a.Ha.subarray&&b.subarray)a.Ha.set(b.subarray(c,c+d),e);else for(h=0;h<d;h++)a.Ha[e+h]=b[c+h];a.La=Math.max(a.La,e+d);return d},Sa(a,b,c){1===c?b+=a.position:2===c&&32768===(a.node.mode&61440)&&(b+=a.node.La);if(0>b)throw new P(28);return b},kb(a,b,c){zb(a.node,b+c);a.node.La=Math.max(a.node.La,b+c);},
    	ab(a,b,c,d,e){if(32768!==(a.node.mode&61440))throw new P(43);a=a.node.Ha;if(e&2||a.buffer!==p.buffer){if(0<c||c+b<a.length)a.subarray?a=a.subarray(c,c+b):a=Array.prototype.slice.call(a,c,c+b);c=!0;b=65536*Math.ceil(b/65536);(e=Eb(65536,b))?(u.fill(0,e,e+b),b=e):b=0;if(!b)throw new P(48);p.set(a,b);}else c=!1,b=a.byteOffset;return {Cb:b,tb:c}},bb(a,b,c,d){Q.Ga.write(a,b,0,d,c,!1);return 0}}},ka=(a,b)=>{var c=0;a&&(c|=365);b&&(c|=146);return c},Fb=null,Gb={},Hb=[],Ib=1,S=null,Jb=!0,P=class{constructor(a){this.name=
    	"ErrnoError";this.Ja=a;}},Cb={},Kb=class{constructor(){this.Za={};this.node=null;}get flags(){return this.Za.flags}set flags(a){this.Za.flags=a;}get position(){return this.Za.position}set position(a){this.Za.position=a;}},Lb=class{constructor(a,b,c,d){a||=this;this.parent=a;this.Qa=a.Qa;this.Ua=null;this.id=Ib++;this.name=b;this.mode=c;this.Fa={};this.Ga={};this.rdev=d;}get read(){return 365===(this.mode&365)}set read(a){a?this.mode|=365:this.mode&=-366;}get write(){return 146===(this.mode&146)}set write(a){a?
    	this.mode|=146:this.mode&=-147;}};function T(a,b={}){a=kb(a);if(!a)return {path:"",node:null};b=Object.assign({pb:!0,jb:0},b);if(8<b.jb)throw new P(32);a=a.split("/").filter(k=>!!k);for(var c=Fb,d="/",e=0;e<a.length;e++){var h=e===a.length-1;if(h&&b.parent)break;c=Db(c,a[e]);d=x(d+"/"+a[e]);c.Ua&&(!h||h&&b.pb)&&(c=c.Ua.root);if(!h||b.Ra)for(h=0;40960===(c.mode&61440);)if(c=Mb(d),d=kb(fb(d),c),c=T(d,{jb:b.jb+1}).node,40<h++)throw new P(32);}return {path:d,node:c}}
    	function ja(a){for(var b;;){if(a===a.parent)return a=a.Qa.sb,b?"/"!==a[a.length-1]?`${a}/${b}`:a+b:a;b=b?`${a.name}/${b}`:a.name;a=a.parent;}}function Nb(a,b){for(var c=0,d=0;d<b.length;d++)c=(c<<5)-c+b.charCodeAt(d)|0;return (a+c>>>0)%S.length}function Ob(a){var b=Nb(a.parent.id,a.name);if(S[b]===a)S[b]=a.Va;else for(b=S[b];b;){if(b.Va===a){b.Va=a.Va;break}b=b.Va;}}
    	function Db(a,b){var c=R(a.mode)?(c=Pb(a,"x"))?c:a.Fa.lookup?0:2:54;if(c)throw new P(c);for(c=S[Nb(a.id,b)];c;c=c.Va){var d=c.name;if(c.parent.id===a.id&&d===b)return c}return a.Fa.lookup(a,b)}function Bb(a,b,c,d){a=new Lb(a,b,c,d);b=Nb(a.parent.id,a.name);a.Va=S[b];return S[b]=a}function R(a){return 16384===(a&61440)}function Qb(a){var b=["r","w","rw"][a&3];a&512&&(b+="w");return b}
    	function Pb(a,b){if(Jb)return 0;if(!b.includes("r")||a.mode&292){if(b.includes("w")&&!(a.mode&146)||b.includes("x")&&!(a.mode&73))return 2}else return 2;return 0}function Rb(a,b){try{return Db(a,b),20}catch(c){}return Pb(a,"wx")}function Sb(a,b,c){try{var d=Db(a,b);}catch(e){return e.Ja}if(a=Pb(a,"wx"))return a;if(c){if(!R(d.mode))return 54;if(d===d.parent||"/"===ja(d))return 10}else if(R(d.mode))return 31;return 0}function U(a){a=Hb[a];if(!a)throw new P(8);return a}
    	function Tb(a,b=-1){a=Object.assign(new Kb,a);if(-1==b)a:{for(b=0;4096>=b;b++)if(!Hb[b])break a;throw new P(33);}a.fd=b;return Hb[b]=a}function Ub(a,b=-1){a=Tb(a,b);a.Ga?.Jb?.(a);return a}var Ab={open(a){a.Ga=Gb[a.node.rdev].Ga;a.Ga.open?.(a);},Sa(){throw new P(70);}};function vb(a,b){Gb[a]={Ga:b};}
    	function Vb(a,b){var c="/"===b;if(c&&Fb)throw new P(10);if(!c&&b){var d=T(b,{pb:!1});b=d.path;d=d.node;if(d.Ua)throw new P(10);if(!R(d.mode))throw new P(54);}b={type:a,Ob:{},sb:b,Bb:[]};a=a.Qa(b);a.Qa=b;b.root=a;c?Fb=a:d&&(d.Ua=b,d.Qa&&d.Qa.Bb.push(b));}function la(a,b,c){var d=T(a,{parent:!0}).node;a=gb(a);if(!a||"."===a||".."===a)throw new P(28);var e=Rb(d,a);if(e)throw new P(e);if(!d.Fa.$a)throw new P(63);return d.Fa.$a(d,a,b,c)}function V(a,b){return la(a,(void 0!==b?b:511)&1023|16384,0)}
    	function Wb(a,b,c){"undefined"==typeof c&&(c=b,b=438);la(a,b|8192,c);}function Xb(a,b){if(!kb(a))throw new P(44);var c=T(b,{parent:!0}).node;if(!c)throw new P(44);b=gb(b);var d=Rb(c,b);if(d)throw new P(d);if(!c.Fa.symlink)throw new P(63);c.Fa.symlink(c,b,a);}function Yb(a){var b=T(a,{parent:!0}).node;a=gb(a);var c=Db(b,a),d=Sb(b,a,!0);if(d)throw new P(d);if(!b.Fa.rmdir)throw new P(63);if(c.Ua)throw new P(10);b.Fa.rmdir(b,a);Ob(c);}
    	function za(a){var b=T(a,{parent:!0}).node;if(!b)throw new P(44);a=gb(a);var c=Db(b,a),d=Sb(b,a,!1);if(d)throw new P(d);if(!b.Fa.unlink)throw new P(63);if(c.Ua)throw new P(10);b.Fa.unlink(b,a);Ob(c);}function Mb(a){a=T(a).node;if(!a)throw new P(44);if(!a.Fa.readlink)throw new P(28);return kb(ja(a.parent),a.Fa.readlink(a))}function Zb(a,b){a=T(a,{Ra:!b}).node;if(!a)throw new P(44);if(!a.Fa.Oa)throw new P(63);return a.Fa.Oa(a)}function $b(a){return Zb(a,!0)}
    	function ma(a,b){a="string"==typeof a?T(a,{Ra:!0}).node:a;if(!a.Fa.Na)throw new P(63);a.Fa.Na(a,{mode:b&4095|a.mode&-4096,timestamp:Date.now()});}function ac(a,b){if(0>b)throw new P(28);a="string"==typeof a?T(a,{Ra:!0}).node:a;if(!a.Fa.Na)throw new P(63);if(R(a.mode))throw new P(31);if(32768!==(a.mode&61440))throw new P(28);var c=Pb(a,"w");if(c)throw new P(c);a.Fa.Na(a,{size:b,timestamp:Date.now()});}
    	function na(a,b,c){if(""===a)throw new P(44);if("string"==typeof b){var d={r:0,"r+":2,w:577,"w+":578,a:1089,"a+":1090}[b];if("undefined"==typeof d)throw Error(`Unknown file open mode: ${b}`);b=d;}c=b&64?("undefined"==typeof c?438:c)&4095|32768:0;if("object"==typeof a)var e=a;else {a=x(a);try{e=T(a,{Ra:!(b&131072)}).node;}catch(h){}}d=!1;if(b&64)if(e){if(b&128)throw new P(20);}else e=la(a,c,0),d=!0;if(!e)throw new P(44);8192===(e.mode&61440)&&(b&=-513);if(b&65536&&!R(e.mode))throw new P(54);if(!d&&(c=
    	e?40960===(e.mode&61440)?32:R(e.mode)&&("r"!==Qb(b)||b&512)?31:Pb(e,Qb(b)):44))throw new P(c);b&512&&!d&&ac(e,0);b&=-131713;e=Tb({node:e,path:ja(e),flags:b,seekable:!0,position:0,Ga:e.Ga,Db:[],error:!1});e.Ga.open&&e.Ga.open(e);!f.logReadFiles||b&1||(bc||={},a in bc||(bc[a]=1));return e}function pa(a){if(null===a.fd)throw new P(8);a.gb&&(a.gb=null);try{a.Ga.close&&a.Ga.close(a);}catch(b){throw b;}finally{Hb[a.fd]=null;}a.fd=null;}
    	function cc(a,b,c){if(null===a.fd)throw new P(8);if(!a.seekable||!a.Ga.Sa)throw new P(70);if(0!=c&&1!=c&&2!=c)throw new P(28);a.position=a.Ga.Sa(a,b,c);a.Db=[];}function dc(a,b,c,d,e){if(0>d||0>e)throw new P(28);if(null===a.fd)throw new P(8);if(1===(a.flags&2097155))throw new P(8);if(R(a.node.mode))throw new P(31);if(!a.Ga.read)throw new P(28);var h="undefined"!=typeof e;if(!h)e=a.position;else if(!a.seekable)throw new P(70);b=a.Ga.read(a,b,c,d,e);h||(a.position+=b);return b}
    	function oa(a,b,c,d,e){if(0>d||0>e)throw new P(28);if(null===a.fd)throw new P(8);if(0===(a.flags&2097155))throw new P(8);if(R(a.node.mode))throw new P(31);if(!a.Ga.write)throw new P(28);a.seekable&&a.flags&1024&&cc(a,0,2);var h="undefined"!=typeof e;if(!h)e=a.position;else if(!a.seekable)throw new P(70);b=a.Ga.write(a,b,c,d,e,void 0);h||(a.position+=b);return b}
    	function ya(a){var c;var d=na(a,d||0);a=Zb(a).size;var e=new Uint8Array(a);dc(d,e,0,a,0);(c=e);pa(d);return c}var ec;
    	function Fc(a,b,c){a=x("/dev/"+a);var d=ka(!!b,!!c);Hc||=64;var e=Hc++<<8|0;vb(e,{open(h){h.seekable=!1;},close(){c?.buffer?.length&&c(10);},read(h,k,r,z){for(var v=0,E=0;E<z;E++){try{var H=b();}catch(mb){throw new P(29);}if(void 0===H&&0===v)throw new P(6);if(null===H||void 0===H)break;v++;k[r+E]=H;}v&&(h.node.timestamp=Date.now());return v},write(h,k,r,z){for(var v=0;v<z;v++)try{c(k[r+v]);}catch(E){throw new P(29);}z&&(h.node.timestamp=Date.now());return v}});Wb(a,d,e);}var Hc,W={},bc;
    	function Ic(a,b,c){if("/"===b.charAt(0))return b;a=-100===a?"/":U(a).path;if(0==b.length){if(!c)throw new P(44);return a}return x(a+"/"+b)}
    	function Jc(a,b,c){a=a(b);D[c>>2]=a.dev;D[c+4>>2]=a.mode;F[c+8>>2]=a.nlink;D[c+12>>2]=a.uid;D[c+16>>2]=a.gid;D[c+20>>2]=a.rdev;J=[a.size>>>0,(I=a.size,1<=+Math.abs(I)?0<I?+Math.floor(I/4294967296)>>>0:~~+Math.ceil((I-+(~~I>>>0))/4294967296)>>>0:0)];D[c+24>>2]=J[0];D[c+28>>2]=J[1];D[c+32>>2]=4096;D[c+36>>2]=a.blocks;b=a.atime.getTime();var d=a.mtime.getTime(),e=a.ctime.getTime();J=[Math.floor(b/1E3)>>>0,(I=Math.floor(b/1E3),1<=+Math.abs(I)?0<I?+Math.floor(I/4294967296)>>>0:~~+Math.ceil((I-+(~~I>>>
    	0))/4294967296)>>>0:0)];D[c+40>>2]=J[0];D[c+44>>2]=J[1];F[c+48>>2]=b%1E3*1E3;J=[Math.floor(d/1E3)>>>0,(I=Math.floor(d/1E3),1<=+Math.abs(I)?0<I?+Math.floor(I/4294967296)>>>0:~~+Math.ceil((I-+(~~I>>>0))/4294967296)>>>0:0)];D[c+56>>2]=J[0];D[c+60>>2]=J[1];F[c+64>>2]=d%1E3*1E3;J=[Math.floor(e/1E3)>>>0,(I=Math.floor(e/1E3),1<=+Math.abs(I)?0<I?+Math.floor(I/4294967296)>>>0:~~+Math.ceil((I-+(~~I>>>0))/4294967296)>>>0:0)];D[c+72>>2]=J[0];D[c+76>>2]=J[1];F[c+80>>2]=e%1E3*1E3;J=[a.ino>>>0,(I=a.ino,1<=+Math.abs(I)?
    	0<I?+Math.floor(I/4294967296)>>>0:~~+Math.ceil((I-+(~~I>>>0))/4294967296)>>>0:0)];D[c+88>>2]=J[0];D[c+92>>2]=J[1];return 0}var Kc=void 0;function Lc(){var a=D[+Kc>>2];Kc+=4;return a}
    	var Mc=(a,b)=>b+2097152>>>0<4194305-!!a?(a>>>0)+4294967296*b:NaN,Nc=[0,31,60,91,121,152,182,213,244,274,305,335],Oc=[0,31,59,90,120,151,181,212,243,273,304,334],Pc={},Rc=()=>{if(!Qc){var a={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"==typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:Ca||"./this.program"},b;for(b in Pc)void 0===Pc[b]?delete a[b]:a[b]=Pc[b];var c=[];for(b in a)c.push(`${b}=${a[b]}`);Qc=c;}return Qc},
    	Qc,va=a=>{var b=ha(a)+1,c=y(b);q(a,u,c,b);return c},Sc=(a,b,c,d)=>{var e={string:v=>{var E=0;null!==v&&void 0!==v&&0!==v&&(E=va(v));return E},array:v=>{var E=y(v.length);p.set(v,E);return E}};a=f["_"+a];var h=[],k=0;if(d)for(var r=0;r<d.length;r++){var z=e[c[r]];z?(0===k&&(k=ra()),h[r]=z(d[r])):h[r]=d[r];}c=a(...h);return c=function(v){0!==k&&ua(k);return "string"===b?v?L(u,v):"":"boolean"===b?!!v:v}(c)},ea=0,da=(a,b)=>{b=1==b?y(a.length):ia(a.length);a.subarray||a.slice||(a=new Uint8Array(a));u.set(a,
    	b);return b},Tc,Uc=[],X,wa=a=>{Tc.delete(X.get(a));X.set(a,null);Uc.push(a);},Aa=(a,b)=>{if(!Tc){Tc=new WeakMap;var c=X.length;if(Tc)for(var d=0;d<0+c;d++){var e=X.get(d);e&&Tc.set(e,d);}}if(c=Tc.get(a)||0)return c;if(Uc.length)c=Uc.pop();else {try{X.grow(1);}catch(r){if(!(r instanceof RangeError))throw r;throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";}c=X.length-1;}try{X.set(c,a);}catch(r){if(!(r instanceof TypeError))throw r;if("function"==typeof WebAssembly.Function){d=WebAssembly.Function;
    	e={i:"i32",j:"i64",f:"f32",d:"f64",e:"externref",p:"i32"};for(var h={parameters:[],results:"v"==b[0]?[]:[e[b[0]]]},k=1;k<b.length;++k)h.parameters.push(e[b[k]]);b=new d(h,a);}else {d=[1];e=b.slice(0,1);b=b.slice(1);h={i:127,p:127,j:126,f:125,d:124,e:111};d.push(96);k=b.length;128>k?d.push(k):d.push(k%128|128,k>>7);for(k=0;k<b.length;++k)d.push(h[b[k]]);"v"==e?d.push(0):d.push(1,h[e]);b=[0,97,115,109,1,0,0,0,1];e=d.length;128>e?b.push(e):b.push(e%128|128,e>>7);b.push(...d);b.push(2,7,1,1,101,1,102,0,
    	0,7,5,1,1,102,0,0);b=new WebAssembly.Module(new Uint8Array(b));b=(new WebAssembly.Instance(b,{e:{f:a}})).exports.f;}X.set(c,b);}Tc.set(a,c);return c};[44].forEach(a=>{Cb[a]=new P(a);Cb[a].stack="<generic error, no stack>";});S=Array(4096);Vb(Q,"/");V("/tmp");V("/home");V("/home/web_user");
    	(function(){V("/dev");vb(259,{read:()=>0,write:(d,e,h,k)=>k});Wb("/dev/null",259);ub(1280,xb);ub(1536,yb);Wb("/dev/tty",1280);Wb("/dev/tty1",1536);var a=new Uint8Array(1024),b=0,c=()=>{0===b&&(b=jb(a).byteLength);return a[--b]};Fc("random",c);Fc("urandom",c);V("/dev/shm");V("/dev/shm/tmp");})();
    	(function(){V("/proc");var a=V("/proc/self");V("/proc/self/fd");Vb({Qa(){var b=Bb(a,"fd",16895,73);b.Fa={lookup(c,d){var e=U(+d);c={parent:null,Qa:{sb:"fake"},Fa:{readlink:()=>e.path}};return c.parent=c}};return b}},"/proc/self/fd");})();
    	var Vc={a:(a,b,c,d)=>{G(`Assertion failed: ${a?L(u,a):""}, at: `+[b?b?L(u,b):"":"unknown filename",c,d?d?L(u,d):"":"unknown function"]);},h:function(a,b){try{return a=a?L(u,a):"",ma(a,b),0}catch(c){if("undefined"==typeof W||"ErrnoError"!==c.name)throw c;return -c.Ja}},H:function(a,b,c){try{b=b?L(u,b):"";b=Ic(a,b);if(c&-8)return -28;var d=T(b,{Ra:!0}).node;if(!d)return -44;a="";c&4&&(a+="r");c&2&&(a+="w");c&1&&(a+="x");return a&&Pb(d,a)?-2:0}catch(e){if("undefined"==typeof W||"ErrnoError"!==e.name)throw e;
    	return -e.Ja}},i:function(a,b){try{var c=U(a);ma(c.node,b);return 0}catch(d){if("undefined"==typeof W||"ErrnoError"!==d.name)throw d;return -d.Ja}},g:function(a){try{var b=U(a).node;var c="string"==typeof b?T(b,{Ra:!0}).node:b;if(!c.Fa.Na)throw new P(63);c.Fa.Na(c,{timestamp:Date.now()});return 0}catch(d){if("undefined"==typeof W||"ErrnoError"!==d.name)throw d;return -d.Ja}},b:function(a,b,c){Kc=c;try{var d=U(a);switch(b){case 0:var e=Lc();if(0>e)break;for(;Hb[e];)e++;return Ub(d,e).fd;case 1:case 2:return 0;
    	case 3:return d.flags;case 4:return e=Lc(),d.flags|=e,0;case 12:return e=Lc(),La[e+0>>1]=2,0;case 13:case 14:return 0}return -28}catch(h){if("undefined"==typeof W||"ErrnoError"!==h.name)throw h;return -h.Ja}},f:function(a,b){try{var c=U(a);return Jc(Zb,c.path,b)}catch(d){if("undefined"==typeof W||"ErrnoError"!==d.name)throw d;return -d.Ja}},n:function(a,b,c){b=Mc(b,c);try{if(isNaN(b))return 61;var d=U(a);if(0===(d.flags&2097155))throw new P(28);ac(d.node,b);return 0}catch(e){if("undefined"==typeof W||
    	"ErrnoError"!==e.name)throw e;return -e.Ja}},C:function(a,b){try{if(0===b)return -28;var c=ha("/")+1;if(b<c)return -68;q("/",u,a,b);return c}catch(d){if("undefined"==typeof W||"ErrnoError"!==d.name)throw d;return -d.Ja}},F:function(a,b){try{return a=a?L(u,a):"",Jc($b,a,b)}catch(c){if("undefined"==typeof W||"ErrnoError"!==c.name)throw c;return -c.Ja}},z:function(a,b,c){try{return b=b?L(u,b):"",b=Ic(a,b),b=x(b),"/"===b[b.length-1]&&(b=b.substr(0,b.length-1)),V(b,c),0}catch(d){if("undefined"==typeof W||"ErrnoError"!==
    	d.name)throw d;return -d.Ja}},E:function(a,b,c,d){try{b=b?L(u,b):"";var e=d&256;b=Ic(a,b,d&4096);return Jc(e?$b:Zb,b,c)}catch(h){if("undefined"==typeof W||"ErrnoError"!==h.name)throw h;return -h.Ja}},x:function(a,b,c,d){Kc=d;try{b=b?L(u,b):"";b=Ic(a,b);var e=d?Lc():0;return na(b,c,e).fd}catch(h){if("undefined"==typeof W||"ErrnoError"!==h.name)throw h;return -h.Ja}},v:function(a,b,c,d){try{b=b?L(u,b):"";b=Ic(a,b);if(0>=d)return -28;var e=Mb(b),h=Math.min(d,ha(e)),k=p[c+h];q(e,u,c,d+1);p[c+h]=k;return h}catch(r){if("undefined"==
    	typeof W||"ErrnoError"!==r.name)throw r;return -r.Ja}},u:function(a){try{return a=a?L(u,a):"",Yb(a),0}catch(b){if("undefined"==typeof W||"ErrnoError"!==b.name)throw b;return -b.Ja}},G:function(a,b){try{return a=a?L(u,a):"",Jc(Zb,a,b)}catch(c){if("undefined"==typeof W||"ErrnoError"!==c.name)throw c;return -c.Ja}},r:function(a,b,c){try{return b=b?L(u,b):"",b=Ic(a,b),0===c?za(b):512===c?Yb(b):G("Invalid flags passed to unlinkat"),0}catch(d){if("undefined"==typeof W||"ErrnoError"!==d.name)throw d;return -d.Ja}},
    	q:function(a,b,c){try{b=b?L(u,b):"";b=Ic(a,b,!0);if(c){var d=F[c>>2]+4294967296*D[c+4>>2],e=D[c+8>>2];h=1E3*d+e/1E6;c+=16;d=F[c>>2]+4294967296*D[c+4>>2];e=D[c+8>>2];k=1E3*d+e/1E6;}else var h=Date.now(),k=h;a=h;var r=T(b,{Ra:!0}).node;r.Fa.Na(r,{timestamp:Math.max(a,k)});return 0}catch(z){if("undefined"==typeof W||"ErrnoError"!==z.name)throw z;return -z.Ja}},l:function(a,b,c){a=new Date(1E3*Mc(a,b));D[c>>2]=a.getSeconds();D[c+4>>2]=a.getMinutes();D[c+8>>2]=a.getHours();D[c+12>>2]=a.getDate();D[c+16>>
    	2]=a.getMonth();D[c+20>>2]=a.getFullYear()-1900;D[c+24>>2]=a.getDay();b=a.getFullYear();D[c+28>>2]=(0!==b%4||0===b%100&&0!==b%400?Oc:Nc)[a.getMonth()]+a.getDate()-1|0;D[c+36>>2]=-(60*a.getTimezoneOffset());b=(new Date(a.getFullYear(),6,1)).getTimezoneOffset();var d=(new Date(a.getFullYear(),0,1)).getTimezoneOffset();D[c+32>>2]=(b!=d&&a.getTimezoneOffset()==Math.min(d,b))|0;},j:function(a,b,c,d,e,h,k,r){e=Mc(e,h);try{if(isNaN(e))return 61;var z=U(d);if(0!==(b&2)&&0===(c&2)&&2!==(z.flags&2097155))throw new P(2);
    	if(1===(z.flags&2097155))throw new P(2);if(!z.Ga.ab)throw new P(43);var v=z.Ga.ab(z,a,e,b,c);var E=v.Cb;D[k>>2]=v.tb;F[r>>2]=E;return 0}catch(H){if("undefined"==typeof W||"ErrnoError"!==H.name)throw H;return -H.Ja}},k:function(a,b,c,d,e,h,k){h=Mc(h,k);try{var r=U(e);if(c&2){if(32768!==(r.node.mode&61440))throw new P(43);if(!(d&2)){var z=u.slice(a,a+b);r.Ga.bb&&r.Ga.bb(r,z,h,b,d);}}}catch(v){if("undefined"==typeof W||"ErrnoError"!==v.name)throw v;return -v.Ja}},y:(a,b,c,d)=>{var e=(new Date).getFullYear(),
    	h=(new Date(e,0,1)).getTimezoneOffset();e=(new Date(e,6,1)).getTimezoneOffset();F[a>>2]=60*Math.max(h,e);D[b>>2]=Number(h!=e);b=k=>{var r=Math.abs(k);return `UTC${0<=k?"-":"+"}${String(Math.floor(r/60)).padStart(2,"0")}${String(r%60).padStart(2,"0")}`};a=b(h);b=b(e);e<h?(q(a,u,c,17),q(b,u,d,17)):(q(a,u,d,17),q(b,u,c,17));},d:()=>Date.now(),s:()=>2147483648,c:()=>performance.now(),o:a=>{var b=u.length;a>>>=0;if(2147483648<a)return !1;for(var c=1;4>=c;c*=2){var d=b*(1+.2/c);d=Math.min(d,a+100663296);var e=
    	Math;d=Math.max(a,d);a:{e=(e.min.call(e,2147483648,d+(65536-d%65536)%65536)-Ja.buffer.byteLength+65535)/65536;try{Ja.grow(e);Oa();var h=1;break a}catch(k){}h=void 0;}if(h)return !0}return !1},A:(a,b)=>{var c=0;Rc().forEach((d,e)=>{var h=b+c;e=F[a+4*e>>2]=h;for(h=0;h<d.length;++h)p[e++]=d.charCodeAt(h);p[e]=0;c+=d.length+1;});return 0},B:(a,b)=>{var c=Rc();F[a>>2]=c.length;var d=0;c.forEach(e=>d+=e.length+1);F[b>>2]=d;return 0},e:function(a){try{var b=U(a);pa(b);return 0}catch(c){if("undefined"==typeof W||
    	"ErrnoError"!==c.name)throw c;return c.Ja}},p:function(a,b){try{var c=U(a);p[b]=c.tty?2:R(c.mode)?3:40960===(c.mode&61440)?7:4;La[b+2>>1]=0;J=[0,(I=0,1<=+Math.abs(I)?0<I?+Math.floor(I/4294967296)>>>0:~~+Math.ceil((I-+(~~I>>>0))/4294967296)>>>0:0)];D[b+8>>2]=J[0];D[b+12>>2]=J[1];J=[0,(I=0,1<=+Math.abs(I)?0<I?+Math.floor(I/4294967296)>>>0:~~+Math.ceil((I-+(~~I>>>0))/4294967296)>>>0:0)];D[b+16>>2]=J[0];D[b+20>>2]=J[1];return 0}catch(d){if("undefined"==typeof W||"ErrnoError"!==d.name)throw d;return d.Ja}},
    	w:function(a,b,c,d){try{a:{var e=U(a);a=b;for(var h,k=b=0;k<c;k++){var r=F[a>>2],z=F[a+4>>2];a+=8;var v=dc(e,p,r,z,h);if(0>v){var E=-1;break a}b+=v;if(v<z)break;"undefined"!=typeof h&&(h+=v);}E=b;}F[d>>2]=E;return 0}catch(H){if("undefined"==typeof W||"ErrnoError"!==H.name)throw H;return H.Ja}},m:function(a,b,c,d,e){b=Mc(b,c);try{if(isNaN(b))return 61;var h=U(a);cc(h,b,d);J=[h.position>>>0,(I=h.position,1<=+Math.abs(I)?0<I?+Math.floor(I/4294967296)>>>0:~~+Math.ceil((I-+(~~I>>>0))/4294967296)>>>0:0)];
    	D[e>>2]=J[0];D[e+4>>2]=J[1];h.gb&&0===b&&0===d&&(h.gb=null);return 0}catch(k){if("undefined"==typeof W||"ErrnoError"!==k.name)throw k;return k.Ja}},D:function(a){try{var b=U(a);return b.Ga?.fsync?b.Ga.fsync(b):0}catch(c){if("undefined"==typeof W||"ErrnoError"!==c.name)throw c;return c.Ja}},t:function(a,b,c,d){try{a:{var e=U(a);a=b;for(var h,k=b=0;k<c;k++){var r=F[a>>2],z=F[a+4>>2];a+=8;var v=oa(e,p,r,z,h);if(0>v){var E=-1;break a}b+=v;"undefined"!=typeof h&&(h+=v);}E=b;}F[d>>2]=E;return 0}catch(H){if("undefined"==
    	typeof W||"ErrnoError"!==H.name)throw H;return H.Ja}}},Z=function(){function a(c){Z=c.exports;Ja=Z.I;Oa();X=Z.K;Qa.unshift(Z.J);Ua--;f.monitorRunDependencies?.(Ua);0==Ua&&(Wa&&(c=Wa,Wa=null,c()));return Z}var b={a:Vc};Ua++;f.monitorRunDependencies?.(Ua);if(f.instantiateWasm)try{return f.instantiateWasm(b,a)}catch(c){return C(`Module.instantiateWasm callback failed with error: ${c}`),!1}Ya||=Xa("sql-wasm.wasm")?"sql-wasm.wasm":f.locateFile?f.locateFile("sql-wasm.wasm",
    	B):B+"sql-wasm.wasm";bb(b,function(c){a(c.instance);});return {}}();f._sqlite3_free=a=>(f._sqlite3_free=Z.L)(a);f._sqlite3_value_text=a=>(f._sqlite3_value_text=Z.M)(a);f._sqlite3_prepare_v2=(a,b,c,d,e)=>(f._sqlite3_prepare_v2=Z.N)(a,b,c,d,e);f._sqlite3_step=a=>(f._sqlite3_step=Z.O)(a);f._sqlite3_reset=a=>(f._sqlite3_reset=Z.P)(a);f._sqlite3_exec=(a,b,c,d,e)=>(f._sqlite3_exec=Z.Q)(a,b,c,d,e);f._sqlite3_finalize=a=>(f._sqlite3_finalize=Z.R)(a);
    	f._sqlite3_column_name=(a,b)=>(f._sqlite3_column_name=Z.S)(a,b);f._sqlite3_column_text=(a,b)=>(f._sqlite3_column_text=Z.T)(a,b);f._sqlite3_column_type=(a,b)=>(f._sqlite3_column_type=Z.U)(a,b);f._sqlite3_errmsg=a=>(f._sqlite3_errmsg=Z.V)(a);f._sqlite3_clear_bindings=a=>(f._sqlite3_clear_bindings=Z.W)(a);f._sqlite3_value_blob=a=>(f._sqlite3_value_blob=Z.X)(a);f._sqlite3_value_bytes=a=>(f._sqlite3_value_bytes=Z.Y)(a);f._sqlite3_value_double=a=>(f._sqlite3_value_double=Z.Z)(a);
    	f._sqlite3_value_int=a=>(f._sqlite3_value_int=Z._)(a);f._sqlite3_value_type=a=>(f._sqlite3_value_type=Z.$)(a);f._sqlite3_result_blob=(a,b,c,d)=>(f._sqlite3_result_blob=Z.aa)(a,b,c,d);f._sqlite3_result_double=(a,b)=>(f._sqlite3_result_double=Z.ba)(a,b);f._sqlite3_result_error=(a,b,c)=>(f._sqlite3_result_error=Z.ca)(a,b,c);f._sqlite3_result_int=(a,b)=>(f._sqlite3_result_int=Z.da)(a,b);f._sqlite3_result_int64=(a,b,c)=>(f._sqlite3_result_int64=Z.ea)(a,b,c);
    	f._sqlite3_result_null=a=>(f._sqlite3_result_null=Z.fa)(a);f._sqlite3_result_text=(a,b,c,d)=>(f._sqlite3_result_text=Z.ga)(a,b,c,d);f._sqlite3_aggregate_context=(a,b)=>(f._sqlite3_aggregate_context=Z.ha)(a,b);f._sqlite3_column_count=a=>(f._sqlite3_column_count=Z.ia)(a);f._sqlite3_data_count=a=>(f._sqlite3_data_count=Z.ja)(a);f._sqlite3_column_blob=(a,b)=>(f._sqlite3_column_blob=Z.ka)(a,b);f._sqlite3_column_bytes=(a,b)=>(f._sqlite3_column_bytes=Z.la)(a,b);
    	f._sqlite3_column_double=(a,b)=>(f._sqlite3_column_double=Z.ma)(a,b);f._sqlite3_bind_blob=(a,b,c,d,e)=>(f._sqlite3_bind_blob=Z.na)(a,b,c,d,e);f._sqlite3_bind_double=(a,b,c)=>(f._sqlite3_bind_double=Z.oa)(a,b,c);f._sqlite3_bind_int=(a,b,c)=>(f._sqlite3_bind_int=Z.pa)(a,b,c);f._sqlite3_bind_text=(a,b,c,d,e)=>(f._sqlite3_bind_text=Z.qa)(a,b,c,d,e);f._sqlite3_bind_parameter_index=(a,b)=>(f._sqlite3_bind_parameter_index=Z.ra)(a,b);f._sqlite3_sql=a=>(f._sqlite3_sql=Z.sa)(a);
    	f._sqlite3_normalized_sql=a=>(f._sqlite3_normalized_sql=Z.ta)(a);f._sqlite3_changes=a=>(f._sqlite3_changes=Z.ua)(a);f._sqlite3_close_v2=a=>(f._sqlite3_close_v2=Z.va)(a);f._sqlite3_create_function_v2=(a,b,c,d,e,h,k,r,z)=>(f._sqlite3_create_function_v2=Z.wa)(a,b,c,d,e,h,k,r,z);f._sqlite3_open=(a,b)=>(f._sqlite3_open=Z.xa)(a,b);var ia=f._malloc=a=>(ia=f._malloc=Z.ya)(a),fa=f._free=a=>(fa=f._free=Z.za)(a);f._RegisterExtensionFunctions=a=>(f._RegisterExtensionFunctions=Z.Aa)(a);
    	var Eb=(a,b)=>(Eb=Z.Ba)(a,b),ua=a=>(ua=Z.Ca)(a),y=a=>(y=Z.Da)(a),ra=()=>(ra=Z.Ea)();f.stackSave=()=>ra();f.stackRestore=a=>ua(a);f.stackAlloc=a=>y(a);f.cwrap=(a,b,c,d)=>{var e=!c||c.every(h=>"number"===h||"boolean"===h);return "string"!==b&&e&&!d?f["_"+a]:(...h)=>Sc(a,b,c,h)};f.addFunction=Aa;f.removeFunction=wa;f.UTF8ToString=ta;f.ALLOC_NORMAL=ea;f.allocate=da;f.allocateUTF8OnStack=va;var Wc;Wa=function Xc(){Wc||Yc();Wc||(Wa=Xc);};
    	function Yc(){function a(){if(!Wc&&(Wc=!0,f.calledRun=!0,!Ka)){f.noFSInit||ec||(ec=!0,f.stdin=f.stdin,f.stdout=f.stdout,f.stderr=f.stderr,f.stdin?Fc("stdin",f.stdin):Xb("/dev/tty","/dev/stdin"),f.stdout?Fc("stdout",null,f.stdout):Xb("/dev/tty","/dev/stdout"),f.stderr?Fc("stderr",null,f.stderr):Xb("/dev/tty1","/dev/stderr"),na("/dev/stdin",0),na("/dev/stdout",1),na("/dev/stderr",1));Jb=!1;cb(Qa);f.onRuntimeInitialized?.();if(f.postRun)for("function"==typeof f.postRun&&(f.postRun=[f.postRun]);f.postRun.length;){var b=
    	f.postRun.shift();Sa.unshift(b);}cb(Sa);}}if(!(0<Ua)){if(f.preRun)for("function"==typeof f.preRun&&(f.preRun=[f.preRun]);f.preRun.length;)Ta();cb(Pa);0<Ua||(f.setStatus?(f.setStatus("Running..."),setTimeout(function(){setTimeout(function(){f.setStatus("");},1);a();},1)):a());}}if(f.preInit)for("function"==typeof f.preInit&&(f.preInit=[f.preInit]);0<f.preInit.length;)f.preInit.pop()();Yc();


    	        // The shell-pre.js and emcc-generated code goes above
    	        return Module;
    	    }); // The end of the promise being returned

    	  return initSqlJsPromise;
    	}; // The end of our initSqlJs function

    	// This bit below is copied almost exactly from what you get when you use the MODULARIZE=1 flag with emcc
    	// However, we don't want to use the emcc modularization. See shell-pre.js
    	{
    	    module.exports = initSqlJs;
    	    // This will allow the module to be used in ES6 or CommonJS
    	    module.exports.default = initSqlJs;
    	} 
    } (sqlWasm));

    var sqlWasmExports = sqlWasm.exports;
    var initSqlJs = /*@__PURE__*/getDefaultExportFromCjs(sqlWasmExports);

    /* src\components\ScoresTable.svelte generated by Svelte v3.59.2 */

    const { console: console_1$4 } = globals;
    const file$7 = "src\\components\\ScoresTable.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (160:12) {:else}
    function create_else_block_1$1(ctx) {
    	let td;
    	let t_value = /*BestScore*/ ctx[15].Score + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "svelte-myzg2r");
    			add_location(td, file$7, 160, 16, 4676);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*BestScores*/ 2 && t_value !== (t_value = /*BestScore*/ ctx[15].Score + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(160:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (154:12) {#if BestScores.Image !== ""}
    function create_if_block_1$1(ctx) {
    	let td;
    	let t_value = /*BestScore*/ ctx[15].Score + "";
    	let t;
    	let mounted;
    	let dispose;

    	function mouseenter_handler() {
    		return /*mouseenter_handler*/ ctx[7](/*BestScore*/ ctx[15]);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "svelte-myzg2r");
    			add_location(td, file$7, 154, 16, 4424);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);

    			if (!mounted) {
    				dispose = [
    					listen_dev(td, "mouseenter", mouseenter_handler, false, false, false, false),
    					listen_dev(td, "mouseleave", /*hidePreview*/ ctx[3], false, false, false, false),
    					listen_dev(td, "mousemove", /*movePreview*/ ctx[4], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*BestScores*/ 2 && t_value !== (t_value = /*BestScore*/ ctx[15].Score + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(154:12) {#if BestScores.Image !== \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (176:16) {:else}
    function create_else_block$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("X");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(176:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (170:16) {#if BestScore.Video !== ""}
    function create_if_block$4(ctx) {
    	let a;
    	let svg;
    	let path;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M17 10.5V7c0-1.1-.9-2-2-2H5C3.9 5 3 5.9 3 7v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-3.5l4 4v-11l-4 4z");
    			add_location(path, file$7, 172, 28, 5257);
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "black");
    			add_location(svg, file$7, 171, 24, 5166);
    			attr_dev(a, "href", a_href_value = /*BestScore*/ ctx[15].Video);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$7, 170, 20, 5072);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, svg);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*BestScores*/ 2 && a_href_value !== (a_href_value = /*BestScore*/ ctx[15].Video)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(170:16) {#if BestScore.Video !== \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (150:4) {#each BestScores as BestScore}
    function create_each_block$2(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*BestScore*/ ctx[15].Player + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*BestScore*/ ctx[15].Status + "";
    	let t2;
    	let td1_class_value;
    	let t3;
    	let t4;
    	let td2;
    	let t5_value = /*BestScore*/ ctx[15].Grade + "";
    	let t5;
    	let td2_class_value;
    	let t6;
    	let td3;
    	let t7_value = /*BestScore*/ ctx[15].Good + "";
    	let t7;
    	let t8;
    	let td4;
    	let t9_value = /*BestScore*/ ctx[15].Ok + "";
    	let t9;
    	let t10;
    	let td5;
    	let t11_value = /*BestScore*/ ctx[15].Bad + "";
    	let t11;
    	let t12;
    	let td6;
    	let t13_value = /*BestScore*/ ctx[15].Accuracy + "";
    	let t13;
    	let t14;
    	let td7;
    	let t15_value = /*BestScore*/ ctx[15].LP + "";
    	let t15;
    	let t16;
    	let td8;
    	let t17;

    	function select_block_type(ctx, dirty) {
    		if (/*BestScores*/ ctx[1].Image !== "") return create_if_block_1$1;
    		return create_else_block_1$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*BestScore*/ ctx[15].Video !== "") return create_if_block$4;
    		return create_else_block$4;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block1 = current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			if_block0.c();
    			t4 = space();
    			td2 = element("td");
    			t5 = text(t5_value);
    			t6 = space();
    			td3 = element("td");
    			t7 = text(t7_value);
    			t8 = space();
    			td4 = element("td");
    			t9 = text(t9_value);
    			t10 = space();
    			td5 = element("td");
    			t11 = text(t11_value);
    			t12 = space();
    			td6 = element("td");
    			t13 = text(t13_value);
    			t14 = space();
    			td7 = element("td");
    			t15 = text(t15_value);
    			t16 = space();
    			td8 = element("td");
    			if_block1.c();
    			t17 = space();
    			attr_dev(td0, "class", "svelte-myzg2r");
    			add_location(td0, file$7, 151, 12, 4243);
    			attr_dev(td1, "class", td1_class_value = "status" + /*BestScore*/ ctx[15].Status.replace(/\s/g, "") + " svelte-myzg2r");
    			add_location(td1, file$7, 152, 12, 4284);
    			attr_dev(td2, "class", td2_class_value = "grade" + /*BestScore*/ ctx[15].Grade + " svelte-myzg2r");
    			add_location(td2, file$7, 162, 12, 4735);
    			attr_dev(td3, "class", "svelte-myzg2r");
    			add_location(td3, file$7, 163, 12, 4806);
    			attr_dev(td4, "class", "svelte-myzg2r");
    			add_location(td4, file$7, 164, 12, 4845);
    			attr_dev(td5, "class", "svelte-myzg2r");
    			add_location(td5, file$7, 165, 12, 4882);
    			attr_dev(td6, "class", "svelte-myzg2r");
    			add_location(td6, file$7, 166, 12, 4920);
    			attr_dev(td7, "class", "svelte-myzg2r");
    			add_location(td7, file$7, 167, 12, 4963);
    			attr_dev(td8, "class", "svelte-myzg2r");
    			add_location(td8, file$7, 168, 12, 5000);
    			attr_dev(tr, "class", "svelte-myzg2r");
    			add_location(tr, file$7, 150, 8, 4225);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			if_block0.m(tr, null);
    			append_dev(tr, t4);
    			append_dev(tr, td2);
    			append_dev(td2, t5);
    			append_dev(tr, t6);
    			append_dev(tr, td3);
    			append_dev(td3, t7);
    			append_dev(tr, t8);
    			append_dev(tr, td4);
    			append_dev(td4, t9);
    			append_dev(tr, t10);
    			append_dev(tr, td5);
    			append_dev(td5, t11);
    			append_dev(tr, t12);
    			append_dev(tr, td6);
    			append_dev(td6, t13);
    			append_dev(tr, t14);
    			append_dev(tr, td7);
    			append_dev(td7, t15);
    			append_dev(tr, t16);
    			append_dev(tr, td8);
    			if_block1.m(td8, null);
    			append_dev(tr, t17);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*BestScores*/ 2 && t0_value !== (t0_value = /*BestScore*/ ctx[15].Player + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*BestScores*/ 2 && t2_value !== (t2_value = /*BestScore*/ ctx[15].Status + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*BestScores*/ 2 && td1_class_value !== (td1_class_value = "status" + /*BestScore*/ ctx[15].Status.replace(/\s/g, "") + " svelte-myzg2r")) {
    				attr_dev(td1, "class", td1_class_value);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(tr, t4);
    				}
    			}

    			if (dirty & /*BestScores*/ 2 && t5_value !== (t5_value = /*BestScore*/ ctx[15].Grade + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*BestScores*/ 2 && td2_class_value !== (td2_class_value = "grade" + /*BestScore*/ ctx[15].Grade + " svelte-myzg2r")) {
    				attr_dev(td2, "class", td2_class_value);
    			}

    			if (dirty & /*BestScores*/ 2 && t7_value !== (t7_value = /*BestScore*/ ctx[15].Good + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*BestScores*/ 2 && t9_value !== (t9_value = /*BestScore*/ ctx[15].Ok + "")) set_data_dev(t9, t9_value);
    			if (dirty & /*BestScores*/ 2 && t11_value !== (t11_value = /*BestScore*/ ctx[15].Bad + "")) set_data_dev(t11, t11_value);
    			if (dirty & /*BestScores*/ 2 && t13_value !== (t13_value = /*BestScore*/ ctx[15].Accuracy + "")) set_data_dev(t13, t13_value);
    			if (dirty & /*BestScores*/ 2 && t15_value !== (t15_value = /*BestScore*/ ctx[15].LP + "")) set_data_dev(t15, t15_value);

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(td8, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if_block0.d();
    			if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(150:4) {#each BestScores as BestScore}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let table;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let th6;
    	let t13;
    	let th7;
    	let t15;
    	let th8;
    	let t17;
    	let th9;
    	let t19;
    	let t20;
    	let img;
    	let each_value = /*BestScores*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Player";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Status";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Score";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Grade";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Good";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Ok";
    			t11 = space();
    			th6 = element("th");
    			th6.textContent = "Bad";
    			t13 = space();
    			th7 = element("th");
    			th7.textContent = "Accuracy";
    			t15 = space();
    			th8 = element("th");
    			th8.textContent = "List Points";
    			t17 = space();
    			th9 = element("th");
    			th9.textContent = "Video";
    			t19 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t20 = space();
    			img = element("img");
    			attr_dev(th0, "class", "svelte-myzg2r");
    			add_location(th0, file$7, 138, 8, 3932);
    			attr_dev(th1, "class", "svelte-myzg2r");
    			add_location(th1, file$7, 139, 8, 3957);
    			attr_dev(th2, "class", "svelte-myzg2r");
    			add_location(th2, file$7, 140, 8, 3982);
    			attr_dev(th3, "class", "svelte-myzg2r");
    			add_location(th3, file$7, 141, 8, 4006);
    			attr_dev(th4, "class", "svelte-myzg2r");
    			add_location(th4, file$7, 142, 8, 4030);
    			attr_dev(th5, "class", "svelte-myzg2r");
    			add_location(th5, file$7, 143, 8, 4053);
    			attr_dev(th6, "class", "svelte-myzg2r");
    			add_location(th6, file$7, 144, 8, 4074);
    			attr_dev(th7, "class", "svelte-myzg2r");
    			add_location(th7, file$7, 145, 8, 4096);
    			attr_dev(th8, "class", "svelte-myzg2r");
    			add_location(th8, file$7, 146, 8, 4123);
    			attr_dev(th9, "class", "svelte-myzg2r");
    			add_location(th9, file$7, 147, 8, 4153);
    			attr_dev(tr, "class", "svelte-myzg2r");
    			add_location(tr, file$7, 137, 4, 3918);
    			attr_dev(table, "id", "scores");
    			attr_dev(table, "class", "svelte-myzg2r");
    			add_location(table, file$7, 136, 0, 3893);
    			attr_dev(img, "class", "preview-image svelte-myzg2r");
    			add_location(img, file$7, 183, 0, 5552);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(tr, t7);
    			append_dev(tr, th4);
    			append_dev(tr, t9);
    			append_dev(tr, th5);
    			append_dev(tr, t11);
    			append_dev(tr, th6);
    			append_dev(tr, t13);
    			append_dev(tr, th7);
    			append_dev(tr, t15);
    			append_dev(tr, th8);
    			append_dev(tr, t17);
    			append_dev(tr, th9);
    			append_dev(table, t19);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(table, null);
    				}
    			}

    			insert_dev(target, t20, anchor);
    			insert_dev(target, img, anchor);
    			/*img_binding*/ ctx[8](img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*BestScores, showPreview, hidePreview, movePreview*/ 30) {
    				each_value = /*BestScores*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t20);
    			if (detaching) detach_dev(img);
    			/*img_binding*/ ctx[8](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ScoresTable', slots, []);
    	let { SongCard } = $$props;
    	let { Difficulty } = $$props;
    	let db;
    	let rows = [];

    	const loadDatabase = async () => {
    		const sqlPromise = await initSqlJs({ locateFile: file => `/sql-wasm.wasm` });
    		console.log(sqlPromise.locateFile());
    		const dataPromise = fetch("/hof.db3").then(res => res.arrayBuffer());
    		const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
    		console.log(buf);
    		console.log(SQL);
    		const db = new SQL.Database(new Uint8Array(buf));
    		const result = db.exec(`SELECT * FROM scores WHERE entryId='${SongCard.UniqueId}' AND difficulty=${Difficulty} ORDER BY score DESC`);
    		rows = result[0] ? result[0].values : [];
    		console.log(rows);
    	};

    	let previewImg;

    	const showPreview = src => {
    		$$invalidate(0, previewImg.src = src, previewImg);
    		$$invalidate(0, previewImg.style.display = 'block', previewImg);
    	};

    	const hidePreview = () => {
    		$$invalidate(0, previewImg.style.display = 'none', previewImg);
    	};

    	const movePreview = event => {
    		$$invalidate(0, previewImg.style.left = `${event.pageX}px`, previewImg);
    		$$invalidate(0, previewImg.style.top = `${event.pageY - 94}px`, previewImg);
    	};

    	let BestScores = [];

    	const ComputeMaxListPoints = rank => {
    		let base = 1000;
    		let decreaseRatio = 0.95;
    		return parseInt(base * Math.pow(decreaseRatio, rank - 1));
    	};

    	const ScoreToListPointsRatio = score => {
    		let _ratio = 1;
    		_ratio = _ratio * Math.pow(score.Accuracy, 6);

    		switch (score.Status) {
    			case "Full Combo":
    				{
    					_ratio *= 0.9;
    					break;
    				}
    			case "Clear":
    				{
    					_ratio *= 0.7;
    					break;
    				}
    			case "Failed":
    			default:
    				{
    					_ratio = 0;
    					break;
    				}
    		}

    		return _ratio;
    	};

    	const FetchBestScores = async () => {
    		$$invalidate(1, BestScores = []);
    		let _sample = {};

    		rows.forEach(score => {
    			_sample = {
    				Player: score[3],
    				Status: score[4],
    				Score: score[5],
    				Grade: score[6],
    				Good: score[7],
    				Ok: score[8],
    				Bad: score[9],
    				Video: score[10],
    				Image: score[11]
    			};

    			_sample.Accuracy = (_sample.Good + _sample.Ok * 0.5) / (_sample.Good + _sample.Ok + _sample.Bad);
    			_sample.LP = parseInt(ScoreToListPointsRatio(_sample) * ComputeMaxListPoints(SongCard.Rank[Difficulty]));
    			_sample.Accuracy = (100 * _sample.Accuracy).toFixed(2);
    			BestScores.push(_sample);
    		});

    		if (rows.length === 0) {
    			_sample = {
    				Player: "Komi is testing stuff",
    				Status: "Clear",
    				Score: 923000,
    				Grade: "A",
    				Good: 910,
    				Ok: 102,
    				Bad: 12,
    				Video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    				Image: "https://i.imgur.com/a5BmHTT.png"
    			};

    			_sample.Accuracy = (_sample.Good + _sample.Ok * 0.5) / (_sample.Good + _sample.Ok + _sample.Bad);
    			_sample.LP = parseInt(ScoreToListPointsRatio(_sample) * ComputeMaxListPoints(SongCard.Rank[Difficulty]));
    			_sample.Accuracy = (100 * _sample.Accuracy).toFixed(2);
    			BestScores.push(_sample);
    		}
    	};

    	onMount(async () => {
    		await loadDatabase();
    		await FetchBestScores();
    		console.log(BestScores);
    	});

    	$$self.$$.on_mount.push(function () {
    		if (SongCard === undefined && !('SongCard' in $$props || $$self.$$.bound[$$self.$$.props['SongCard']])) {
    			console_1$4.warn("<ScoresTable> was created without expected prop 'SongCard'");
    		}

    		if (Difficulty === undefined && !('Difficulty' in $$props || $$self.$$.bound[$$self.$$.props['Difficulty']])) {
    			console_1$4.warn("<ScoresTable> was created without expected prop 'Difficulty'");
    		}
    	});

    	const writable_props = ['SongCard', 'Difficulty'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<ScoresTable> was created with unknown prop '${key}'`);
    	});

    	const mouseenter_handler = BestScore => showPreview(BestScore.Image);

    	function img_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			previewImg = $$value;
    			$$invalidate(0, previewImg);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('SongCard' in $$props) $$invalidate(5, SongCard = $$props.SongCard);
    		if ('Difficulty' in $$props) $$invalidate(6, Difficulty = $$props.Difficulty);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		SongCard,
    		Difficulty,
    		initSqlJs,
    		db,
    		rows,
    		loadDatabase,
    		previewImg,
    		showPreview,
    		hidePreview,
    		movePreview,
    		BestScores,
    		ComputeMaxListPoints,
    		ScoreToListPointsRatio,
    		FetchBestScores
    	});

    	$$self.$inject_state = $$props => {
    		if ('SongCard' in $$props) $$invalidate(5, SongCard = $$props.SongCard);
    		if ('Difficulty' in $$props) $$invalidate(6, Difficulty = $$props.Difficulty);
    		if ('db' in $$props) db = $$props.db;
    		if ('rows' in $$props) rows = $$props.rows;
    		if ('previewImg' in $$props) $$invalidate(0, previewImg = $$props.previewImg);
    		if ('BestScores' in $$props) $$invalidate(1, BestScores = $$props.BestScores);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		previewImg,
    		BestScores,
    		showPreview,
    		hidePreview,
    		movePreview,
    		SongCard,
    		Difficulty,
    		mouseenter_handler,
    		img_binding
    	];
    }

    class ScoresTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$7, create_fragment$7, safe_not_equal, { SongCard: 5, Difficulty: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ScoresTable",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get SongCard() {
    		throw new Error("<ScoresTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set SongCard(value) {
    		throw new Error("<ScoresTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Difficulty() {
    		throw new Error("<ScoresTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Difficulty(value) {
    		throw new Error("<ScoresTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\DiffTab.svelte generated by Svelte v3.59.2 */
    const file$6 = "src\\components\\DiffTab.svelte";

    // (32:0) {:else}
    function create_else_block$3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Hall of Fame: Unranked";
    			add_location(div, file$6, 32, 4, 758);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(32:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (21:0) {#if SongCard.Rank[Difficulty] >= 0}
    function create_if_block$3(ctx) {
    	let div0;
    	let t0;
    	let t1_value = /*SongCard*/ ctx[0].Rank[/*Difficulty*/ ctx[1]] + "";
    	let t1;
    	let t2;
    	let div1;
    	let t3;
    	let t4_value = /*ComputeMaxListPoints*/ ctx[2](/*SongCard*/ ctx[0].Rank[/*Difficulty*/ ctx[1]]) + "";
    	let t4;
    	let t5;
    	let scorestable;
    	let current;

    	scorestable = new ScoresTable({
    			props: {
    				SongCard: /*SongCard*/ ctx[0],
    				Difficulty: /*Difficulty*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text("Hall of Fame: #");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			t3 = text("Max List Points: ");
    			t4 = text(t4_value);
    			t5 = space();
    			create_component(scorestable.$$.fragment);
    			add_location(div0, file$6, 21, 4, 487);
    			add_location(div1, file$6, 24, 4, 562);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t3);
    			append_dev(div1, t4);
    			insert_dev(target, t5, anchor);
    			mount_component(scorestable, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*SongCard, Difficulty*/ 3) && t1_value !== (t1_value = /*SongCard*/ ctx[0].Rank[/*Difficulty*/ ctx[1]] + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*SongCard, Difficulty*/ 3) && t4_value !== (t4_value = /*ComputeMaxListPoints*/ ctx[2](/*SongCard*/ ctx[0].Rank[/*Difficulty*/ ctx[1]]) + "")) set_data_dev(t4, t4_value);
    			const scorestable_changes = {};
    			if (dirty & /*SongCard*/ 1) scorestable_changes.SongCard = /*SongCard*/ ctx[0];
    			if (dirty & /*Difficulty*/ 2) scorestable_changes.Difficulty = /*Difficulty*/ ctx[1];
    			scorestable.$set(scorestable_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scorestable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scorestable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t5);
    			destroy_component(scorestable, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(21:0) {#if SongCard.Rank[Difficulty] >= 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let t0;
    	let t1_value = /*SongCard*/ ctx[0].Charters[/*Difficulty*/ ctx[1]] + "";
    	let t1;
    	let t2;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*SongCard*/ ctx[0].Rank[/*Difficulty*/ ctx[1]] >= 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("Charter: ");
    			t1 = text(t1_value);
    			t2 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			add_location(div, file$6, 16, 0, 386);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			insert_dev(target, t2, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*SongCard, Difficulty*/ 3) && t1_value !== (t1_value = /*SongCard*/ ctx[0].Charters[/*Difficulty*/ ctx[1]] + "")) set_data_dev(t1, t1_value);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t2);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DiffTab', slots, []);
    	let { SongCard } = $$props;
    	let { Difficulty } = $$props;

    	const ComputeMaxListPoints = rank => {
    		if (SongCard.Rank[Difficulty] < 0) return 0;
    		let base = 1000;
    		let decreaseRatio = 0.95;
    		return parseInt(base * Math.pow(decreaseRatio, rank - 1));
    	};

    	$$self.$$.on_mount.push(function () {
    		if (SongCard === undefined && !('SongCard' in $$props || $$self.$$.bound[$$self.$$.props['SongCard']])) {
    			console.warn("<DiffTab> was created without expected prop 'SongCard'");
    		}

    		if (Difficulty === undefined && !('Difficulty' in $$props || $$self.$$.bound[$$self.$$.props['Difficulty']])) {
    			console.warn("<DiffTab> was created without expected prop 'Difficulty'");
    		}
    	});

    	const writable_props = ['SongCard', 'Difficulty'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DiffTab> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('SongCard' in $$props) $$invalidate(0, SongCard = $$props.SongCard);
    		if ('Difficulty' in $$props) $$invalidate(1, Difficulty = $$props.Difficulty);
    	};

    	$$self.$capture_state = () => ({
    		ScoresTable,
    		SongCard,
    		Difficulty,
    		ComputeMaxListPoints
    	});

    	$$self.$inject_state = $$props => {
    		if ('SongCard' in $$props) $$invalidate(0, SongCard = $$props.SongCard);
    		if ('Difficulty' in $$props) $$invalidate(1, Difficulty = $$props.Difficulty);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [SongCard, Difficulty, ComputeMaxListPoints];
    }

    class DiffTab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$6, create_fragment$6, safe_not_equal, { SongCard: 0, Difficulty: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DiffTab",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get SongCard() {
    		throw new Error("<DiffTab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set SongCard(value) {
    		throw new Error("<DiffTab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Difficulty() {
    		throw new Error("<DiffTab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Difficulty(value) {
    		throw new Error("<DiffTab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\Songinfo.svelte generated by Svelte v3.59.2 */

    const { console: console_1$3 } = globals;
    const file$5 = "src\\routes\\Songinfo.svelte";

    // (201:4) {:else}
    function create_else_block$2(ctx) {
    	let previous_key = /*SongCard*/ ctx[0].AudioFilePath;
    	let key_block_anchor;
    	let current;
    	let key_block = create_key_block$1(ctx);

    	const block = {
    		c: function create() {
    			key_block.c();
    			key_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			key_block.m(target, anchor);
    			insert_dev(target, key_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*SongCard*/ 1 && safe_not_equal(previous_key, previous_key = /*SongCard*/ ctx[0].AudioFilePath)) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop$1);
    				check_outros();
    				key_block = create_key_block$1(ctx);
    				key_block.c();
    				transition_in(key_block, 1);
    				key_block.m(key_block_anchor.parentNode, key_block_anchor);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(key_block_anchor);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(201:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (198:4) {#if Fetching === true}
    function create_if_block$2(ctx) {
    	let h1;
    	let t1;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Fetching Songs... Please wait.";
    			t1 = space();
    			img = element("img");
    			set_style(h1, "text-align", "center");
    			set_style(h1, "color", "white");
    			add_location(h1, file$5, 198, 8, 6481);
    			if (!src_url_equal(img.src, img_src_value = "image/loading.gif")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Loading");
    			set_style(img, "display", "block");
    			set_style(img, "margin-left", "auto");
    			set_style(img, "margin-right", "auto");
    			add_location(img, file$5, 199, 8, 6571);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, img, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(198:4) {#if Fetching === true}",
    		ctx
    	});

    	return block;
    }

    // (202:8) {#key SongCard.AudioFilePath}
    function create_key_block$1(ctx) {
    	let songbar;
    	let t;
    	let tabarea;
    	let current;

    	songbar = new SongBar({
    			props: {
    				Title: /*SongCard*/ ctx[0].Title,
    				Subtitle: /*SongCard*/ ctx[0].Subtitle,
    				Difficulties: /*SongCard*/ ctx[0].Difficulties,
    				AudioFilePath: /*SongCard*/ ctx[0].AudioFilePath,
    				Genre: /*SongCard*/ ctx[0].Genre
    			},
    			$$inline: true
    		});

    	tabarea = new TabArea({
    			props: { items: /*tabs*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(songbar.$$.fragment);
    			t = space();
    			create_component(tabarea.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(songbar, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(tabarea, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const songbar_changes = {};
    			if (dirty & /*SongCard*/ 1) songbar_changes.Title = /*SongCard*/ ctx[0].Title;
    			if (dirty & /*SongCard*/ 1) songbar_changes.Subtitle = /*SongCard*/ ctx[0].Subtitle;
    			if (dirty & /*SongCard*/ 1) songbar_changes.Difficulties = /*SongCard*/ ctx[0].Difficulties;
    			if (dirty & /*SongCard*/ 1) songbar_changes.AudioFilePath = /*SongCard*/ ctx[0].AudioFilePath;
    			if (dirty & /*SongCard*/ 1) songbar_changes.Genre = /*SongCard*/ ctx[0].Genre;
    			songbar.$set(songbar_changes);
    			const tabarea_changes = {};
    			if (dirty & /*tabs*/ 4) tabarea_changes.items = /*tabs*/ ctx[2];
    			tabarea.$set(tabarea_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(songbar.$$.fragment, local);
    			transition_in(tabarea.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(songbar.$$.fragment, local);
    			transition_out(tabarea.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(songbar, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(tabarea, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block$1.name,
    		type: "key",
    		source: "(202:8) {#key SongCard.AudioFilePath}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div0;
    	let t0;
    	let h1;
    	let t2;
    	let div1;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*Fetching*/ ctx[1] === true) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Song Info";
    			t2 = space();
    			div1 = element("div");
    			if_block.c();
    			attr_dev(div0, "class", "bg_optk svelte-7saw0m");
    			add_location(div0, file$5, 192, 0, 6352);
    			set_style(h1, "color", "white");
    			add_location(h1, file$5, 194, 0, 6383);
    			attr_dev(div1, "id", "songs");
    			attr_dev(div1, "class", "svelte-7saw0m");
    			add_location(div1, file$5, 196, 0, 6426);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			if_blocks[current_block_type_index].m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let SongCard;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Songinfo', slots, []);
    	let { UniqueId } = $$props;
    	let db;
    	let rows = [];

    	const loadDatabase = async () => {
    		const sqlPromise = await initSqlJs({ locateFile: file => `/sql-wasm.wasm` });
    		const dataPromise = fetch("/hof.db3").then(res => res.arrayBuffer());
    		const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
    		const db = new SQL.Database(new Uint8Array(buf));
    		const result = db.exec("SELECT * FROM entries ORDER BY internalDifficultyIndex DESC");
    		rows = result[0] ? result[0].values : [];
    	};

    	const GenreToCSS = genre => {
    		switch (genre) {
    			case '01 OpenTaiko Chapter I':
    				return 'ch1';
    			case '02 OpenTaiko Chapter II':
    				return 'ch2';
    			case '03 OpenTaiko Chapter III':
    				return 'ch3';
    			case '04 OpenTaiko Chapter IV':
    				return 'ch4';
    			case '05 OpenTaiko Chapter V':
    				return 'ch5';
    			case "C10 Deceiver's Defiances":
    				return 'deceiver';
    			case "C12 Dashy's Secrets":
    				return 'dashy';
    			case "E01 Rainy Memories":
    				return 'rainy';
    			case "E02 OpenTaiko Headquarters":
    				return 'hq';
    			case "C01 Project Outfox Serenity":
    				return 'outfox';
    			case "C02 Touhou Arrangements":
    				return 'touhou';
    			case "C03 OpenTaiko Karting":
    				return 'kart';
    		}
    	};

    	let Fetching = false;
    	let SongsInfo = {};

    	const GetSongsByGenre = genre => {
    		return SongsInfo.filter(song => song["tjaGenreFolder"] === genre);
    	};

    	const GetSongByUniqueId = uid => {
    		return SongsInfo.filter(song => song["uniqueId"] === uid)?.[0] ?? null;
    	};

    	const FetchSongs = async () => {
    		$$invalidate(1, Fetching = true);
    		let songs_text = await fetch("https://raw.githubusercontent.com/OpenTaiko/OpenTaiko-Soundtrack/refs/heads/main/soundtrack_info.json");
    		let text = (await songs_text.text()).valueOf();
    		SongsInfo = JSON.parse(text);
    		$$invalidate(1, Fetching = false);
    	};

    	const ComputeMaxListPoints = rank => {
    		let base = 1000;
    		let decreaseRatio = 0.95;
    		return parseInt(base * Math.pow(decreaseRatio, rank - 1));
    	};

    	const GetSongInfo = async () => {
    		$$invalidate(0, SongCard = {});
    		const song = GetSongByUniqueId(UniqueId);
    		let SInfo = {};

    		if (song !== null) {
    			SInfo = {
    				Rank: [
    					song["chartHoFRanks"]?.["Easy"] ?? -1,
    					song["chartHoFRanks"]?.["Normal"] ?? -1,
    					song["chartHoFRanks"]?.["Hard"] ?? -1,
    					song["chartHoFRanks"]?.["Oni"] ?? -1,
    					song["chartHoFRanks"]?.["Edit"] ?? -1,
    					-1,
    					-1
    				],
    				UniqueId,
    				Genre: GenreToCSS(song['tjaGenreFolder']),
    				Title: song["chartTitle"],
    				Subtitle: song["chartSubtitle"],
    				AudioFilePath: song['chartAudioFilePath'],
    				Difficulties: [
    					song["chartDifficulties"]["Easy"] ?? -1,
    					song["chartDifficulties"]["Normal"] ?? -1,
    					song["chartDifficulties"]["Hard"] ?? -1,
    					song["chartDifficulties"]["Oni"] ?? -1,
    					song["chartDifficulties"]["Edit"] ?? -1,
    					song["chartDifficulties"]["Tower"] ?? -1,
    					song["chartDifficulties"]["Dan"] ?? -1
    				],
    				Charters: [
    					song["chartMakers"]["Easy"] ?? "",
    					song["chartMakers"]["Normal"] ?? "",
    					song["chartMakers"]["Hard"] ?? "",
    					song["chartMakers"]["Oni"] ?? "",
    					song["chartMakers"]["Edit"] ?? "",
    					song["chartMakers"]["Tower"] ?? "",
    					song["chartMakers"]["Dan"] ?? ""
    				]
    			};
    		} else {
    			SInfo = {
    				Rank: [-1, -1, -1, -1, -1, -1, -1],
    				UniqueId,
    				Genre: 'hq',
    				Title: `Not Found`,
    				Subtitle: "",
    				AudioFilePath: "",
    				Difficulties: [-1, -1, -1, -1, -1, -1, -1],
    				Charters: ["", "", "", "", "", "", ""]
    			};
    		}

    		$$invalidate(0, SongCard = SInfo);
    	};

    	onMount(async () => {
    		await FetchSongs();
    		await loadDatabase();
    		GetSongInfo();
    		console.log(rows);
    	});

    	const GetTabs = () => {
    		let _ret = [];
    		const _diff = ["Easy", "Normal", "Hard", "Extreme", "Extra"];
    		const _colors = ["#98fafa", "#98fabe", "#f7fa98", "#fa98a1", "#d198fa"];

    		_diff.forEach((diffName, idx) => {
    			if (SongCard.Difficulties !== undefined && SongCard.Difficulties[idx] >= 0) {
    				const _tab = {
    					label: diffName,
    					value: idx + 1,
    					component: DiffTab,
    					color: _colors[idx],
    					props: { SongCard, Difficulty: idx }
    				};

    				_ret.push(_tab);
    			}
    		});

    		return _ret;
    	};

    	let tabs = [];

    	$$self.$$.on_mount.push(function () {
    		if (UniqueId === undefined && !('UniqueId' in $$props || $$self.$$.bound[$$self.$$.props['UniqueId']])) {
    			console_1$3.warn("<Songinfo> was created without expected prop 'UniqueId'");
    		}
    	});

    	const writable_props = ['UniqueId'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Songinfo> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('UniqueId' in $$props) $$invalidate(3, UniqueId = $$props.UniqueId);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		SongBar,
    		TabArea,
    		DiffTab,
    		initSqlJs,
    		UniqueId,
    		db,
    		rows,
    		loadDatabase,
    		GenreToCSS,
    		Fetching,
    		SongsInfo,
    		GetSongsByGenre,
    		GetSongByUniqueId,
    		FetchSongs,
    		ComputeMaxListPoints,
    		GetSongInfo,
    		GetTabs,
    		tabs,
    		SongCard
    	});

    	$$self.$inject_state = $$props => {
    		if ('UniqueId' in $$props) $$invalidate(3, UniqueId = $$props.UniqueId);
    		if ('db' in $$props) db = $$props.db;
    		if ('rows' in $$props) rows = $$props.rows;
    		if ('Fetching' in $$props) $$invalidate(1, Fetching = $$props.Fetching);
    		if ('SongsInfo' in $$props) SongsInfo = $$props.SongsInfo;
    		if ('tabs' in $$props) $$invalidate(2, tabs = $$props.tabs);
    		if ('SongCard' in $$props) $$invalidate(0, SongCard = $$props.SongCard);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*SongCard*/ 1) {
    			if (SongCard) $$invalidate(2, tabs = GetTabs());
    		}
    	};

    	$$invalidate(0, SongCard = {});
    	return [SongCard, Fetching, tabs, UniqueId];
    }

    class Songinfo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$5, create_fragment$5, safe_not_equal, { UniqueId: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Songinfo",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get UniqueId() {
    		throw new Error("<Songinfo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set UniqueId(value) {
    		throw new Error("<Songinfo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\Secret.svelte generated by Svelte v3.59.2 */

    const { console: console_1$2 } = globals;
    const file$4 = "src\\routes\\Secret.svelte";

    function create_fragment$4(ctx) {
    	let div2;
    	let div1;
    	let form;
    	let input;
    	let t0;
    	let div0;
    	let button;
    	let t1;
    	let script;
    	let current;

    	button = new Button({
    			props: {
    				color1: 'white',
    				color2: 'white',
    				textColor: 'black',
    				text: '???',
    				OnClick: /*fetchSecret*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			form = element("form");
    			input = element("input");
    			t0 = space();
    			div0 = element("div");
    			create_component(button.$$.fragment);
    			t1 = space();
    			script = element("script");
    			script.textContent = "const setColor = () => {\n        document.getElementById(\"secret\").style.backgroundColor = \"white\"\n    }\n\n    const getSecret = async () => {\n        const secret = document.getElementById(\"secret\").value;\n        if (secret === \"\" || !secret) return;\n\n        const secret_value = btoa(secret).replaceAll(\"+\", \"-\").replaceAll(\"/\", \"_\").replaceAll(\"=\", \"\");\n\n        const url = \"https://opentaiko.neocities.org/\" + secret_value + \".zip\"\n        const response = await fetch(url, { method: \"HEAD\" });\n\n        if (response.ok) {\n            console.log(\"Secret found!\");\n            document.getElementById(\"secret\").style.backgroundColor = \"rgb(150,255,150)\";\n            setTimeout(setColor, 2000);\n            return url;\n        }\n        else {\n            console.log(\"Secret not found. Created '\" + secret_value + \"' from '\" + secret + \"'.\");\n            document.getElementById(\"secret\").style.backgroundColor = \"rgb(255,150,150)\";\n            setTimeout(setColor, 2000);\n            return;\n        }\n    }\n\n    const fetchSecret = async () => {\n        const url = await getSecret();\n\n        if (url) {\n            const downloadurl = document.createElement(\"a\");\n            downloadurl.href = url;\n            downloadurl.target = \"_blank\";\n            downloadurl.click();\n        }\n    }";
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "secret");
    			attr_dev(input, "name", "secret");
    			add_location(input, file$4, 45, 12, 1510);
    			attr_dev(form, "onsubmit", "event.preventDefault(); fetchSecret();");
    			add_location(form, file$4, 44, 8, 1441);
    			set_style(div0, "width", "fit-content");
    			set_style(div0, "margin", "auto");
    			add_location(div0, file$4, 47, 8, 1580);
    			attr_dev(div1, "class", "collection svelte-1l8zixn");
    			add_location(div1, file$4, 43, 4, 1408);
    			add_location(script, file$4, 57, 4, 1859);
    			attr_dev(div2, "class", "content svelte-1l8zixn");
    			add_location(div2, file$4, 42, 0, 1382);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, form);
    			append_dev(form, input);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			mount_component(button, div0, null);
    			append_dev(div2, t1);
    			append_dev(div2, script);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Secret', slots, []);

    	const setColor = () => {
    		document.getElementById("secret").style.backgroundColor = "white";
    	};

    	const getSecret = async () => {
    		const secret = document.getElementById("secret").value;
    		if (secret === "" || !secret) return;
    		const secret_value = btoa(secret).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
    		const url = "https://opentaiko.neocities.org/" + secret_value + ".zip";
    		const response = await fetch(url, { method: "HEAD" });

    		if (response.ok) {
    			console.log("Secret found!");
    			document.getElementById("secret").style.backgroundColor = "rgb(150,255,150)";
    			setTimeout(setColor, 2000);
    			return url;
    		} else {
    			console.log("Secret not found. Created '" + secret_value + "' from '" + secret + "'.");
    			document.getElementById("secret").style.backgroundColor = "rgb(255,150,150)";
    			setTimeout(setColor, 2000);
    			return;
    		}
    	};

    	const fetchSecret = async () => {
    		const url = await getSecret();

    		if (url) {
    			const downloadurl = document.createElement("a");
    			downloadurl.href = url;
    			downloadurl.target = "_blank";
    			downloadurl.click();
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Secret> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Button, setColor, getSecret, fetchSecret });
    	return [fetchSecret];
    }

    class Secret extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Secret",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\routes\HoF.svelte generated by Svelte v3.59.2 */

    const { console: console_1$1 } = globals;
    const file$3 = "src\\routes\\HoF.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    // (197:4) {:else}
    function create_else_block$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*SongCards*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*SongCards*/ 2) {
    				each_value = /*SongCards*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(197:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (194:4) {#if Fetching === true}
    function create_if_block$1(ctx) {
    	let h1;
    	let t1;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Fetching Songs... Please wait.";
    			t1 = space();
    			img = element("img");
    			set_style(h1, "text-align", "center");
    			set_style(h1, "color", "white");
    			add_location(h1, file$3, 194, 8, 6268);
    			if (!src_url_equal(img.src, img_src_value = "image/loading.gif")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Loading");
    			set_style(img, "display", "block");
    			set_style(img, "margin-left", "auto");
    			set_style(img, "margin-right", "auto");
    			add_location(img, file$3, 195, 8, 6358);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, img, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(194:4) {#if Fetching === true}",
    		ctx
    	});

    	return block;
    }

    // (199:12) {#key Card.AudioFilePath}
    function create_key_block(ctx) {
    	let songbar;
    	let current;

    	songbar = new SongBar({
    			props: {
    				Rank: /*Card*/ ctx[16].Rank,
    				Title: /*Card*/ ctx[16].Title,
    				Subtitle: /*Card*/ ctx[16].Subtitle,
    				Difficulties: /*Card*/ ctx[16].Difficulties,
    				AudioFilePath: /*Card*/ ctx[16].AudioFilePath,
    				Genre: /*Card*/ ctx[16].Genre,
    				MaxListPoints: /*Card*/ ctx[16].MaxListPoints,
    				UniqueId: /*Card*/ ctx[16].UniqueId
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(songbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(songbar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const songbar_changes = {};
    			if (dirty & /*SongCards*/ 2) songbar_changes.Rank = /*Card*/ ctx[16].Rank;
    			if (dirty & /*SongCards*/ 2) songbar_changes.Title = /*Card*/ ctx[16].Title;
    			if (dirty & /*SongCards*/ 2) songbar_changes.Subtitle = /*Card*/ ctx[16].Subtitle;
    			if (dirty & /*SongCards*/ 2) songbar_changes.Difficulties = /*Card*/ ctx[16].Difficulties;
    			if (dirty & /*SongCards*/ 2) songbar_changes.AudioFilePath = /*Card*/ ctx[16].AudioFilePath;
    			if (dirty & /*SongCards*/ 2) songbar_changes.Genre = /*Card*/ ctx[16].Genre;
    			if (dirty & /*SongCards*/ 2) songbar_changes.MaxListPoints = /*Card*/ ctx[16].MaxListPoints;
    			if (dirty & /*SongCards*/ 2) songbar_changes.UniqueId = /*Card*/ ctx[16].UniqueId;
    			songbar.$set(songbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(songbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(songbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(songbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(199:12) {#key Card.AudioFilePath}",
    		ctx
    	});

    	return block;
    }

    // (198:8) {#each SongCards as Card}
    function create_each_block$1(ctx) {
    	let previous_key = /*Card*/ ctx[16].AudioFilePath;
    	let key_block_anchor;
    	let current;
    	let key_block = create_key_block(ctx);

    	const block = {
    		c: function create() {
    			key_block.c();
    			key_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			key_block.m(target, anchor);
    			insert_dev(target, key_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*SongCards*/ 2 && safe_not_equal(previous_key, previous_key = /*Card*/ ctx[16].AudioFilePath)) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop$1);
    				check_outros();
    				key_block = create_key_block(ctx);
    				key_block.c();
    				transition_in(key_block, 1);
    				key_block.m(key_block_anchor.parentNode, key_block_anchor);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(key_block_anchor);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(198:8) {#each SongCards as Card}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div0;
    	let t0;
    	let h1;
    	let t2;
    	let div1;
    	let button0;
    	let t3;
    	let button1;
    	let t4;
    	let div2;
    	let current_block_type_index;
    	let if_block;
    	let current;

    	button0 = new Button({
    			props: {
    				color1: "#6effe7",
    				color2: "#48f7da",
    				textColor: "black",
    				text: "Download as json",
    				OnClick: /*func*/ ctx[4]
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				color1: "#f3ff6e",
    				color2: "#f7e848",
    				textColor: "black",
    				text: "Leaderboards",
    				OnClick: /*func_1*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*Fetching*/ ctx[0] === true) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Hall of Fame";
    			t2 = space();
    			div1 = element("div");
    			create_component(button0.$$.fragment);
    			t3 = space();
    			create_component(button1.$$.fragment);
    			t4 = space();
    			div2 = element("div");
    			if_block.c();
    			attr_dev(div0, "class", "bg_optk svelte-7saw0m");
    			add_location(div0, file$3, 172, 0, 5755);
    			set_style(h1, "color", "white");
    			add_location(h1, file$3, 173, 0, 5784);
    			attr_dev(div1, "class", "buttons svelte-7saw0m");
    			add_location(div1, file$3, 175, 0, 5830);
    			attr_dev(div2, "id", "songs");
    			attr_dev(div2, "class", "svelte-7saw0m");
    			add_location(div2, file$3, 192, 0, 6213);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(button0, div1, null);
    			append_dev(div1, t3);
    			mount_component(button1, div1, null);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div2, anchor);
    			if_blocks[current_block_type_index].m(div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div2, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			destroy_component(button0);
    			destroy_component(button1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div2);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let SongCards;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HoF', slots, []);
    	let db;
    	let rows = [];

    	const loadDatabase = async () => {
    		const sqlPromise = await initSqlJs({ locateFile: file => `/sql-wasm.wasm` });
    		console.log(sqlPromise.locateFile());
    		const dataPromise = fetch("/hof.db3").then(res => res.arrayBuffer());
    		const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
    		console.log(buf);
    		console.log(SQL);
    		const db = new SQL.Database(new Uint8Array(buf));
    		const result = db.exec("SELECT * FROM entries ORDER BY internalDifficultyIndex DESC");
    		rows = result[0] ? result[0].values : [];
    	};

    	const GenreToCSS = genre => {
    		switch (genre) {
    			case '01 OpenTaiko Chapter I':
    				return 'ch1';
    			case '02 OpenTaiko Chapter II':
    				return 'ch2';
    			case '03 OpenTaiko Chapter III':
    				return 'ch3';
    			case '04 OpenTaiko Chapter IV':
    				return 'ch4';
    			case '05 OpenTaiko Chapter V':
    				return 'ch5';
    			case "C10 Deceiver's Defiances":
    				return 'deceiver';
    			case "C12 Dashy's Secrets":
    				return 'dashy';
    			case "E01 Rainy Memories":
    				return 'rainy';
    			case "E02 OpenTaiko Headquarters":
    				return 'hq';
    			case "C01 Project Outfox Serenity":
    				return 'outfox';
    			case "C02 Touhou Arrangements":
    				return 'touhou';
    			case "C03 OpenTaiko Karting":
    				return 'kart';
    		}
    	};

    	let Fetching = false;
    	let SongsInfo = {};

    	const GetSongsByGenre = genre => {
    		return SongsInfo.filter(song => song["tjaGenreFolder"] === genre);
    	};

    	const GetSongByUniqueId = uid => {
    		return SongsInfo.filter(song => song["uniqueId"] === uid)?.[0] ?? null;
    	};

    	const FetchSongs = async () => {
    		$$invalidate(0, Fetching = true);
    		let songs_text = await fetch("https://raw.githubusercontent.com/OpenTaiko/OpenTaiko-Soundtrack/refs/heads/main/soundtrack_info.json");
    		let text = (await songs_text.text()).valueOf();
    		SongsInfo = JSON.parse(text);
    		$$invalidate(0, Fetching = false);
    	};

    	const ComputeMaxListPoints = rank => {
    		let base = 1000;
    		let decreaseRatio = 0.95;
    		return parseInt(base * Math.pow(decreaseRatio, rank - 1));
    	};

    	const GetSongsByRank = async () => {
    		$$invalidate(1, SongCards = []);

    		rows.forEach((row, idx) => {
    			const song = GetSongByUniqueId(row[1]);
    			let SInfo = {};
    			const rank = idx + 1;

    			if (song !== null) {
    				SInfo = {
    					Rank: rank,
    					UniqueId: row[1],
    					Genre: GenreToCSS(song['tjaGenreFolder']),
    					Title: song["chartTitle"],
    					Subtitle: song["chartSubtitle"],
    					AudioFilePath: song['chartAudioFilePath'],
    					Difficulties: [
    						row[2] === 0 ? song["chartDifficulties"]["Easy"] : -1,
    						row[2] === 1 ? song["chartDifficulties"]["Normal"] : -1,
    						row[2] === 2 ? song["chartDifficulties"]["Hard"] : -1,
    						row[2] === 3 ? song["chartDifficulties"]["Oni"] : -1,
    						row[2] === 4 ? song["chartDifficulties"]["Edit"] : -1,
    						-1,
    						-1
    					],
    					MaxListPoints: ComputeMaxListPoints(rank)
    				};
    			} else {
    				SInfo = {
    					Rank: rank,
    					UniqueId: row[1],
    					Genre: 'hq',
    					Title: `#${idx + 1}. Not Found`,
    					Subtitle: "",
    					AudioFilePath: "",
    					Difficulties: [-1, -1, -1, -1, -1, -1, -1],
    					MaxListPoints: ComputeMaxListPoints(rank)
    				};
    			}

    			console.log(SInfo);
    			SongCards.push(SInfo);
    		});
    	};

    	onMount(async () => {
    		await FetchSongs();
    		await loadDatabase();
    		GetSongsByRank();
    		console.log(rows);
    	});

    	const DownloadAsJson = () => {
    		let _ret = {};

    		SongCards.forEach(card => {
    			let _cardObj = _ret?.[card.UniqueId] ?? {};
    			if (card.Difficulties[3] >= 0) _cardObj["Oni"] = card.Rank;
    			if (card.Difficulties[4] >= 0) _cardObj["Edit"] = card.Rank;
    			_ret[card.UniqueId] = _cardObj;
    		});

    		let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(_ret));
    		let downloadAnchorNode = document.createElement('a');
    		downloadAnchorNode.setAttribute("href", dataStr);
    		downloadAnchorNode.setAttribute("download", "hof.json");
    		document.body.appendChild(downloadAnchorNode);
    		downloadAnchorNode.click();
    		downloadAnchorNode.remove();
    	};

    	const MoveToLeaderboards = e => {
    		navigate("/leaderboards");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<HoF> was created with unknown prop '${key}'`);
    	});

    	const func = () => DownloadAsJson();
    	const func_1 = () => MoveToLeaderboards();

    	$$self.$capture_state = () => ({
    		onMount,
    		navigate,
    		SongBar,
    		Button,
    		initSqlJs,
    		db,
    		rows,
    		loadDatabase,
    		GenreToCSS,
    		Fetching,
    		SongsInfo,
    		GetSongsByGenre,
    		GetSongByUniqueId,
    		FetchSongs,
    		ComputeMaxListPoints,
    		GetSongsByRank,
    		DownloadAsJson,
    		MoveToLeaderboards,
    		SongCards
    	});

    	$$self.$inject_state = $$props => {
    		if ('db' in $$props) db = $$props.db;
    		if ('rows' in $$props) rows = $$props.rows;
    		if ('Fetching' in $$props) $$invalidate(0, Fetching = $$props.Fetching);
    		if ('SongsInfo' in $$props) SongsInfo = $$props.SongsInfo;
    		if ('SongCards' in $$props) $$invalidate(1, SongCards = $$props.SongCards);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(1, SongCards = []);
    	return [Fetching, SongCards, DownloadAsJson, MoveToLeaderboards, func, func_1];
    }

    class HoF extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HoF",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\routes\Leaderboards.svelte generated by Svelte v3.59.2 */

    const { Object: Object_1, console: console_1 } = globals;
    const file$2 = "src\\routes\\Leaderboards.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	child_ctx[26] = i;
    	return child_ctx;
    }

    // (215:8) {#each TopPlayers as TopPlayer, idx}
    function create_each_block_1(ctx) {
    	let tr;
    	let td0;
    	let t0;
    	let t1_value = /*idx*/ ctx[26] + 1 + "";
    	let t1;
    	let t2;
    	let td1;
    	let t3_value = /*TopPlayer*/ ctx[24].Player + "";
    	let t3;
    	let t4;
    	let td2;
    	let t5_value = /*TopPlayer*/ ctx[24].LP + "";
    	let t5;
    	let t6;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text("#");
    			t1 = text(t1_value);
    			t2 = space();
    			td1 = element("td");
    			t3 = text(t3_value);
    			t4 = space();
    			td2 = element("td");
    			t5 = text(t5_value);
    			t6 = space();
    			set_style(td0, "font-weight", "bold");
    			attr_dev(td0, "class", "top" + (/*idx*/ ctx[26] + 1) + " svelte-uo548d");
    			add_location(td0, file$2, 216, 16, 6383);
    			attr_dev(td1, "class", "svelte-uo548d");
    			add_location(td1, file$2, 217, 16, 6462);
    			attr_dev(td2, "class", "svelte-uo548d");
    			add_location(td2, file$2, 218, 16, 6507);
    			attr_dev(tr, "class", "svelte-uo548d");
    			add_location(tr, file$2, 215, 12, 6361);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(td0, t1);
    			append_dev(tr, t2);
    			append_dev(tr, td1);
    			append_dev(td1, t3);
    			append_dev(tr, t4);
    			append_dev(tr, td2);
    			append_dev(td2, t5);
    			append_dev(tr, t6);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*TopPlayers*/ 4 && t3_value !== (t3_value = /*TopPlayer*/ ctx[24].Player + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*TopPlayers*/ 4 && t5_value !== (t5_value = /*TopPlayer*/ ctx[24].LP + "")) set_data_dev(t5, t5_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(215:8) {#each TopPlayers as TopPlayer, idx}",
    		ctx
    	});

    	return block;
    }

    // (232:4) {:else}
    function create_else_block(ctx) {
    	let table;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let th6;
    	let t13;
    	let th7;
    	let t15;
    	let th8;
    	let t17;
    	let th9;
    	let t19;
    	let each_value = /*BestScores*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Song";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Difficulty";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Level";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Player";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Status";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Score";
    			t11 = space();
    			th6 = element("th");
    			th6.textContent = "Grade";
    			t13 = space();
    			th7 = element("th");
    			th7.textContent = "Accuracy";
    			t15 = space();
    			th8 = element("th");
    			th8.textContent = "List Points";
    			t17 = space();
    			th9 = element("th");
    			th9.textContent = "Video";
    			t19 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(th0, "class", "svelte-uo548d");
    			add_location(th0, file$2, 234, 16, 6965);
    			attr_dev(th1, "class", "svelte-uo548d");
    			add_location(th1, file$2, 235, 16, 6996);
    			attr_dev(th2, "class", "svelte-uo548d");
    			add_location(th2, file$2, 236, 16, 7033);
    			attr_dev(th3, "class", "svelte-uo548d");
    			add_location(th3, file$2, 237, 16, 7065);
    			attr_dev(th4, "class", "svelte-uo548d");
    			add_location(th4, file$2, 238, 16, 7098);
    			attr_dev(th5, "class", "svelte-uo548d");
    			add_location(th5, file$2, 239, 16, 7131);
    			attr_dev(th6, "class", "svelte-uo548d");
    			add_location(th6, file$2, 240, 16, 7163);
    			attr_dev(th7, "class", "svelte-uo548d");
    			add_location(th7, file$2, 241, 16, 7195);
    			attr_dev(th8, "class", "svelte-uo548d");
    			add_location(th8, file$2, 242, 16, 7230);
    			attr_dev(th9, "class", "svelte-uo548d");
    			add_location(th9, file$2, 243, 16, 7268);
    			attr_dev(tr, "class", "svelte-uo548d");
    			add_location(tr, file$2, 233, 12, 6943);
    			attr_dev(table, "id", "scores");
    			attr_dev(table, "class", "svelte-uo548d");
    			add_location(table, file$2, 232, 8, 6910);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(tr, t7);
    			append_dev(tr, th4);
    			append_dev(tr, t9);
    			append_dev(tr, th5);
    			append_dev(tr, t11);
    			append_dev(tr, th6);
    			append_dev(tr, t13);
    			append_dev(tr, th7);
    			append_dev(tr, t15);
    			append_dev(tr, th8);
    			append_dev(tr, t17);
    			append_dev(tr, th9);
    			append_dev(table, t19);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(table, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*BestScores, Math, SongDetailsUrl, MoveToSongInfo*/ 26) {
    				each_value = /*BestScores*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(232:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (229:4) {#if Fetching === true}
    function create_if_block(ctx) {
    	let h1;
    	let t1;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Fetching Songs... Please wait.";
    			t1 = space();
    			img = element("img");
    			set_style(h1, "text-align", "center");
    			set_style(h1, "color", "white");
    			add_location(h1, file$2, 229, 8, 6694);
    			if (!src_url_equal(img.src, img_src_value = "image/loading.gif")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Loading");
    			set_style(img, "display", "block");
    			set_style(img, "margin-left", "auto");
    			set_style(img, "margin-right", "auto");
    			add_location(img, file$2, 230, 8, 6784);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, img, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(229:4) {#if Fetching === true}",
    		ctx
    	});

    	return block;
    }

    // (264:24) {:else}
    function create_else_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("X");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(264:24) {:else}",
    		ctx
    	});

    	return block;
    }

    // (258:24) {#if BestScore.Video !== ""}
    function create_if_block_1(ctx) {
    	let a;
    	let svg;
    	let path;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M17 10.5V7c0-1.1-.9-2-2-2H5C3.9 5 3 5.9 3 7v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-3.5l4 4v-11l-4 4z");
    			add_location(path, file$2, 260, 36, 8499);
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "black");
    			add_location(svg, file$2, 259, 32, 8400);
    			attr_dev(a, "href", a_href_value = /*BestScore*/ ctx[21].Video);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$2, 258, 28, 8298);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, svg);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*BestScores*/ 8 && a_href_value !== (a_href_value = /*BestScore*/ ctx[21].Video)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(258:24) {#if BestScore.Video !== \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (246:12) {#each BestScores as BestScore}
    function create_each_block(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*BestScore*/ ctx[21].SongTitle + "";
    	let t0;
    	let td0_title_value;
    	let t1;
    	let td1;
    	let t2_value = /*BestScore*/ ctx[21].SongDifficulty + "";
    	let t2;
    	let td1_class_value;
    	let t3;
    	let td2;
    	let t4;
    	let t5_value = Math.floor(/*BestScore*/ ctx[21].SongLevel) + "";
    	let t5;
    	let t6_value = (/*BestScore*/ ctx[21].SongLevel % 1 >= 0.5 ? '+' : '') + "";
    	let t6;
    	let t7;
    	let td3;
    	let t8_value = /*BestScore*/ ctx[21].Player + "";
    	let t8;
    	let t9;
    	let td4;
    	let t10_value = /*BestScore*/ ctx[21].Status + "";
    	let t10;
    	let td4_class_value;
    	let t11;
    	let td5;
    	let t12_value = /*BestScore*/ ctx[21].Score + "";
    	let t12;
    	let td5_title_value;
    	let t13;
    	let td6;
    	let t14_value = /*BestScore*/ ctx[21].Grade + "";
    	let t14;
    	let td6_class_value;
    	let t15;
    	let td7;
    	let t16_value = /*BestScore*/ ctx[21].Accuracy + "";
    	let t16;
    	let t17;
    	let td8;
    	let t18_value = /*BestScore*/ ctx[21].LP + "";
    	let t18;
    	let t19;
    	let td9;
    	let t20;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[6](/*BestScore*/ ctx[21], ...args);
    	}

    	function select_block_type_1(ctx, dirty) {
    		if (/*BestScore*/ ctx[21].Video !== "") return create_if_block_1;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text("★");
    			t5 = text(t5_value);
    			t6 = text(t6_value);
    			t7 = space();
    			td3 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td4 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			td5 = element("td");
    			t12 = text(t12_value);
    			t13 = space();
    			td6 = element("td");
    			t14 = text(t14_value);
    			t15 = space();
    			td7 = element("td");
    			t16 = text(t16_value);
    			t17 = space();
    			td8 = element("td");
    			t18 = text(t18_value);
    			t19 = space();
    			td9 = element("td");
    			if_block.c();
    			t20 = space();
    			attr_dev(td0, "class", "pointer svelte-uo548d");
    			attr_dev(td0, "title", td0_title_value = /*SongDetailsUrl*/ ctx[1](/*BestScore*/ ctx[21].SongUid));
    			add_location(td0, file$2, 247, 20, 7390);
    			attr_dev(td1, "class", td1_class_value = "difficulty" + /*BestScore*/ ctx[21].SongDifficulty + " svelte-uo548d");
    			add_location(td1, file$2, 248, 20, 7555);
    			attr_dev(td2, "class", "svelte-uo548d");
    			add_location(td2, file$2, 249, 20, 7657);
    			attr_dev(td3, "class", "svelte-uo548d");
    			add_location(td3, file$2, 250, 20, 7765);
    			attr_dev(td4, "class", td4_class_value = "status" + /*BestScore*/ ctx[21].Status.replace(/\s/g, "") + " svelte-uo548d");
    			add_location(td4, file$2, 251, 20, 7814);
    			attr_dev(td5, "title", td5_title_value = "" + (/*BestScore*/ ctx[21].Good + "/" + /*BestScore*/ ctx[21].Ok + "/" + /*BestScore*/ ctx[21].Bad));
    			attr_dev(td5, "class", "pointer svelte-uo548d");
    			add_location(td5, file$2, 252, 20, 7915);
    			attr_dev(td6, "class", td6_class_value = "grade" + /*BestScore*/ ctx[21].Grade + " svelte-uo548d");
    			add_location(td6, file$2, 253, 20, 8035);
    			attr_dev(td7, "class", "svelte-uo548d");
    			add_location(td7, file$2, 254, 20, 8114);
    			attr_dev(td8, "class", "svelte-uo548d");
    			add_location(td8, file$2, 255, 20, 8165);
    			attr_dev(td9, "class", "svelte-uo548d");
    			add_location(td9, file$2, 256, 20, 8210);
    			attr_dev(tr, "class", "svelte-uo548d");
    			add_location(tr, file$2, 246, 16, 7364);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(td2, t5);
    			append_dev(td2, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td3);
    			append_dev(td3, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td4);
    			append_dev(td4, t10);
    			append_dev(tr, t11);
    			append_dev(tr, td5);
    			append_dev(td5, t12);
    			append_dev(tr, t13);
    			append_dev(tr, td6);
    			append_dev(td6, t14);
    			append_dev(tr, t15);
    			append_dev(tr, td7);
    			append_dev(td7, t16);
    			append_dev(tr, t17);
    			append_dev(tr, td8);
    			append_dev(td8, t18);
    			append_dev(tr, t19);
    			append_dev(tr, td9);
    			if_block.m(td9, null);
    			append_dev(tr, t20);

    			if (!mounted) {
    				dispose = listen_dev(td0, "click", click_handler, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*BestScores*/ 8 && t0_value !== (t0_value = /*BestScore*/ ctx[21].SongTitle + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*SongDetailsUrl, BestScores*/ 10 && td0_title_value !== (td0_title_value = /*SongDetailsUrl*/ ctx[1](/*BestScore*/ ctx[21].SongUid))) {
    				attr_dev(td0, "title", td0_title_value);
    			}

    			if (dirty & /*BestScores*/ 8 && t2_value !== (t2_value = /*BestScore*/ ctx[21].SongDifficulty + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*BestScores*/ 8 && td1_class_value !== (td1_class_value = "difficulty" + /*BestScore*/ ctx[21].SongDifficulty + " svelte-uo548d")) {
    				attr_dev(td1, "class", td1_class_value);
    			}

    			if (dirty & /*BestScores*/ 8 && t5_value !== (t5_value = Math.floor(/*BestScore*/ ctx[21].SongLevel) + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*BestScores*/ 8 && t6_value !== (t6_value = (/*BestScore*/ ctx[21].SongLevel % 1 >= 0.5 ? '+' : '') + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*BestScores*/ 8 && t8_value !== (t8_value = /*BestScore*/ ctx[21].Player + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*BestScores*/ 8 && t10_value !== (t10_value = /*BestScore*/ ctx[21].Status + "")) set_data_dev(t10, t10_value);

    			if (dirty & /*BestScores*/ 8 && td4_class_value !== (td4_class_value = "status" + /*BestScore*/ ctx[21].Status.replace(/\s/g, "") + " svelte-uo548d")) {
    				attr_dev(td4, "class", td4_class_value);
    			}

    			if (dirty & /*BestScores*/ 8 && t12_value !== (t12_value = /*BestScore*/ ctx[21].Score + "")) set_data_dev(t12, t12_value);

    			if (dirty & /*BestScores*/ 8 && td5_title_value !== (td5_title_value = "" + (/*BestScore*/ ctx[21].Good + "/" + /*BestScore*/ ctx[21].Ok + "/" + /*BestScore*/ ctx[21].Bad))) {
    				attr_dev(td5, "title", td5_title_value);
    			}

    			if (dirty & /*BestScores*/ 8 && t14_value !== (t14_value = /*BestScore*/ ctx[21].Grade + "")) set_data_dev(t14, t14_value);

    			if (dirty & /*BestScores*/ 8 && td6_class_value !== (td6_class_value = "grade" + /*BestScore*/ ctx[21].Grade + " svelte-uo548d")) {
    				attr_dev(td6, "class", td6_class_value);
    			}

    			if (dirty & /*BestScores*/ 8 && t16_value !== (t16_value = /*BestScore*/ ctx[21].Accuracy + "")) set_data_dev(t16, t16_value);
    			if (dirty & /*BestScores*/ 8 && t18_value !== (t18_value = /*BestScore*/ ctx[21].LP + "")) set_data_dev(t18, t18_value);

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(td9, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(246:12) {#each BestScores as BestScore}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div0;
    	let t0;
    	let h1;
    	let t2;
    	let h20;
    	let t4;
    	let div1;
    	let table;
    	let tr;
    	let th0;
    	let t6;
    	let th1;
    	let t8;
    	let th2;
    	let t10;
    	let t11;
    	let h21;
    	let t13;
    	let div2;
    	let each_value_1 = /*TopPlayers*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	function select_block_type(ctx, dirty) {
    		if (/*Fetching*/ ctx[0] === true) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Leaderboards";
    			t2 = space();
    			h20 = element("h2");
    			h20.textContent = "Top Players";
    			t4 = space();
    			div1 = element("div");
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Rank";
    			t6 = space();
    			th1 = element("th");
    			th1.textContent = "Player";
    			t8 = space();
    			th2 = element("th");
    			th2.textContent = "List Points";
    			t10 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t11 = space();
    			h21 = element("h2");
    			h21.textContent = "Best Scores";
    			t13 = space();
    			div2 = element("div");
    			if_block.c();
    			attr_dev(div0, "class", "bg_optk svelte-uo548d");
    			add_location(div0, file$2, 201, 0, 6013);
    			set_style(h1, "color", "white");
    			add_location(h1, file$2, 203, 0, 6044);
    			set_style(h20, "color", "white");
    			add_location(h20, file$2, 205, 0, 6090);
    			attr_dev(th0, "class", "svelte-uo548d");
    			add_location(th0, file$2, 210, 12, 6210);
    			attr_dev(th1, "class", "svelte-uo548d");
    			add_location(th1, file$2, 211, 12, 6237);
    			attr_dev(th2, "class", "svelte-uo548d");
    			add_location(th2, file$2, 212, 12, 6266);
    			attr_dev(tr, "class", "svelte-uo548d");
    			add_location(tr, file$2, 209, 8, 6192);
    			attr_dev(table, "id", "scores");
    			attr_dev(table, "class", "svelte-uo548d");
    			add_location(table, file$2, 208, 4, 6163);
    			attr_dev(div1, "id", "top_players");
    			attr_dev(div1, "class", "svelte-uo548d");
    			add_location(div1, file$2, 207, 0, 6135);
    			set_style(h21, "color", "white");
    			add_location(h21, file$2, 225, 0, 6594);
    			attr_dev(div2, "id", "songs");
    			attr_dev(div2, "class", "svelte-uo548d");
    			add_location(div2, file$2, 227, 0, 6639);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, h20, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, table);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t6);
    			append_dev(tr, th1);
    			append_dev(tr, t8);
    			append_dev(tr, th2);
    			append_dev(table, t10);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(table, null);
    				}
    			}

    			insert_dev(target, t11, anchor);
    			insert_dev(target, h21, anchor);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, div2, anchor);
    			if_block.m(div2, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*TopPlayers*/ 4) {
    				each_value_1 = /*TopPlayers*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div2, null);
    				}
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(h20);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(h21);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(div2);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let SongDict;
    	let BestScores;
    	let TopPlayers;
    	let SongDetailsUrl;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Leaderboards', slots, []);
    	let { UniqueId } = $$props;
    	let db;
    	let rows = [];
    	let entries = [];
    	let scores = [];

    	const loadDatabase = async () => {
    		const sqlPromise = await initSqlJs({ locateFile: file => `/sql-wasm.wasm` });
    		const dataPromise = fetch("/hof.db3").then(res => res.arrayBuffer());
    		const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
    		const db = new SQL.Database(new Uint8Array(buf));
    		const result_e = db.exec("SELECT * FROM entries ORDER BY internalDifficultyIndex DESC");
    		entries = result_e[0] ? result_e[0].values : [];
    		const result_s = db.exec(`SELECT * FROM scores`);
    		scores = result_s[0] ? result_s[0].values : [];
    	};

    	let Fetching = false;
    	let SongsInfo = {};

    	const GetSongByUniqueId = uid => {
    		return SongsInfo.filter(song => song["uniqueId"] === uid)?.[0] ?? null;
    	};

    	const FetchSongs = async () => {
    		$$invalidate(0, Fetching = true);
    		let songs_text = await fetch("https://raw.githubusercontent.com/OpenTaiko/OpenTaiko-Soundtrack/refs/heads/main/soundtrack_info.json");
    		let text = (await songs_text.text()).valueOf();
    		SongsInfo = JSON.parse(text);
    		$$invalidate(0, Fetching = false);
    	};

    	const ComputeMaxListPoints = rank => {
    		let base = 1000;
    		let decreaseRatio = 0.95;
    		return parseInt(base * Math.pow(decreaseRatio, rank - 1));
    	};

    	const ScoreToListPointsRatio = score => {
    		let _ratio = 1;
    		_ratio = _ratio * Math.pow(score.Accuracy, 6);

    		switch (score.Status) {
    			case "Full Combo":
    				{
    					_ratio *= 0.9;
    					break;
    				}
    			case "Clear":
    				{
    					_ratio *= 0.7;
    					break;
    				}
    			case "Failed":
    			default:
    				{
    					_ratio = 0;
    					break;
    				}
    		}

    		return _ratio;
    	};

    	const GetSongInfo = () => {
    		SongDict = {};

    		entries.forEach((row, idx) => {
    			const uid = row[1];
    			const difficulty = row[2];
    			const rank = idx + 1;
    			const song = GetSongByUniqueId(uid);
    			let SInfo = {};

    			if (song !== null) {
    				const _arr = ["Easy", "Normal", "Hard", "Oni", "Edit", "", ""];

    				SInfo = {
    					Rank: rank,
    					UniqueId: row[1],
    					Title: song["chartTitle"],
    					Subtitle: song["chartSubtitle"],
    					Level: song["chartDifficulties"]?.[_arr[difficulty]] ?? -1,
    					MaxListPoints: ComputeMaxListPoints(rank)
    				};
    			} else {
    				SInfo = {
    					Rank: rank,
    					UniqueId: row[1],
    					Title: `#${idx + 1}. Not Found`,
    					Subtitle: "",
    					Level: -1,
    					MaxListPoints: ComputeMaxListPoints(rank)
    				};
    			}

    			if (SongDict[uid] === undefined) SongDict[uid] = {};
    			SongDict[uid][difficulty] = SInfo;
    		});

    		console.log(SongDict);
    	};

    	const ProcessBestScores = () => {
    		$$invalidate(3, BestScores = []);

    		scores.forEach(score => {
    			const _songInfo = SongDict?.[score[1]]?.[score[2]] ?? {};

    			let _sample = {
    				Rank: _songInfo?.Rank ?? -1,
    				SongTitle: _songInfo?.Title ?? "[Not Found]",
    				SongUid: _songInfo?.UniqueId ?? "[Not Found]",
    				SongLevel: _songInfo?.Level ?? -1,
    				SongDifficulty: ["EZ", "NM", "HD", "EX", "EXEX"]?.[score[2]] ?? "EX",
    				Player: score[3],
    				Status: score[4],
    				Score: score[5],
    				Grade: score[6],
    				Good: score[7],
    				Ok: score[8],
    				Bad: score[9],
    				Video: score[10],
    				Image: score[11]
    			};

    			_sample.Accuracy = (_sample.Good + _sample.Ok * 0.5) / (_sample.Good + _sample.Ok + _sample.Bad);
    			_sample.LP = parseInt(ScoreToListPointsRatio(_sample) * ComputeMaxListPoints(_sample.Rank));
    			_sample.Accuracy = (100 * _sample.Accuracy).toFixed(2);
    			BestScores.push(_sample);
    		});

    		BestScores.sort((a, b) => b.LP - a.LP);
    		console.log(BestScores);
    	};

    	const ProcessTopPlayers = () => {
    		$$invalidate(2, TopPlayers = []);
    		let _tmpDict = {};

    		BestScores.forEach(score => {
    			if (_tmpDict[score.Player] === undefined) {
    				_tmpDict[score.Player] = { Player: score.Player, LP: score.LP };
    			} else {
    				_tmpDict[score.Player].LP += score.LP;
    			}
    		});

    		$$invalidate(2, TopPlayers = Object.values(_tmpDict).sort((a, b) => b.LP - a.LP));
    		console.log(TopPlayers);
    	};

    	onMount(async () => {
    		await FetchSongs();
    		await loadDatabase();
    		GetSongInfo();
    		ProcessBestScores();
    		ProcessTopPlayers();
    	});

    	const MoveToSongInfo = (e, uid) => {
    		if (uid === undefined) return;
    		window.open(SongDetailsUrl(uid), '_blank');
    	};

    	$$self.$$.on_mount.push(function () {
    		if (UniqueId === undefined && !('UniqueId' in $$props || $$self.$$.bound[$$self.$$.props['UniqueId']])) {
    			console_1.warn("<Leaderboards> was created without expected prop 'UniqueId'");
    		}
    	});

    	const writable_props = ['UniqueId'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Leaderboards> was created with unknown prop '${key}'`);
    	});

    	const click_handler = (BestScore, e) => MoveToSongInfo(e, BestScore.SongUid);

    	$$self.$$set = $$props => {
    		if ('UniqueId' in $$props) $$invalidate(5, UniqueId = $$props.UniqueId);
    	};

    	$$self.$capture_state = () => ({
    		navigate,
    		onMount,
    		SongBar,
    		TabArea,
    		DiffTab,
    		initSqlJs,
    		UniqueId,
    		db,
    		rows,
    		entries,
    		scores,
    		loadDatabase,
    		Fetching,
    		SongsInfo,
    		GetSongByUniqueId,
    		FetchSongs,
    		ComputeMaxListPoints,
    		ScoreToListPointsRatio,
    		GetSongInfo,
    		ProcessBestScores,
    		ProcessTopPlayers,
    		MoveToSongInfo,
    		SongDetailsUrl,
    		TopPlayers,
    		BestScores,
    		SongDict
    	});

    	$$self.$inject_state = $$props => {
    		if ('UniqueId' in $$props) $$invalidate(5, UniqueId = $$props.UniqueId);
    		if ('db' in $$props) db = $$props.db;
    		if ('rows' in $$props) rows = $$props.rows;
    		if ('entries' in $$props) entries = $$props.entries;
    		if ('scores' in $$props) scores = $$props.scores;
    		if ('Fetching' in $$props) $$invalidate(0, Fetching = $$props.Fetching);
    		if ('SongsInfo' in $$props) SongsInfo = $$props.SongsInfo;
    		if ('SongDetailsUrl' in $$props) $$invalidate(1, SongDetailsUrl = $$props.SongDetailsUrl);
    		if ('TopPlayers' in $$props) $$invalidate(2, TopPlayers = $$props.TopPlayers);
    		if ('BestScores' in $$props) $$invalidate(3, BestScores = $$props.BestScores);
    		if ('SongDict' in $$props) SongDict = $$props.SongDict;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	SongDict = {};
    	$$invalidate(3, BestScores = []);
    	$$invalidate(2, TopPlayers = []);
    	$$invalidate(1, SongDetailsUrl = UniqueId => `/songinfo/${UniqueId}`);

    	return [
    		Fetching,
    		SongDetailsUrl,
    		TopPlayers,
    		BestScores,
    		MoveToSongInfo,
    		UniqueId,
    		click_handler
    	];
    }

    class Leaderboards extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$2, create_fragment$2, safe_not_equal, { UniqueId: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Leaderboards",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get UniqueId() {
    		throw new Error("<Leaderboards>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set UniqueId(value) {
    		throw new Error("<Leaderboards>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Footer.svelte generated by Svelte v3.59.2 */

    const file$1 = "src\\components\\Footer.svelte";

    function create_fragment$1(ctx) {
    	let footer;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let a1;
    	let img1;
    	let img1_src_value;
    	let t1;
    	let a2;
    	let img2;
    	let img2_src_value;
    	let t2;
    	let a3;
    	let img3;
    	let img3_src_value;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			a0 = element("a");
    			img0 = element("img");
    			t0 = space();
    			a1 = element("a");
    			img1 = element("img");
    			t1 = space();
    			a2 = element("a");
    			img2 = element("img");
    			t2 = space();
    			a3 = element("a");
    			img3 = element("img");
    			if (!src_url_equal(img0.src, img0_src_value = "/image/github.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Github");
    			attr_dev(img0, "class", "svelte-1jhlcbi");
    			add_location(img0, file$1, 5, 59, 94);
    			attr_dev(a0, "href", "https://github.com/OpenTaiko");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$1, 5, 4, 39);
    			if (!src_url_equal(img1.src, img1_src_value = "/image/twitter.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Twitter");
    			attr_dev(img1, "class", "svelte-1jhlcbi");
    			add_location(img1, file$1, 6, 54, 198);
    			attr_dev(a1, "href", "https://x.com/OpenTaiko");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$1, 6, 4, 148);
    			if (!src_url_equal(img2.src, img2_src_value = "/image/bluesky.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Bluesky");
    			attr_dev(img2, "class", "svelte-1jhlcbi");
    			add_location(img2, file$1, 7, 77, 327);
    			attr_dev(a2, "href", "https://bsky.app/profile/opentaiko.bsky.social");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$1, 7, 4, 254);
    			if (!src_url_equal(img3.src, img3_src_value = "/image/discord.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Discord");
    			attr_dev(img3, "class", "svelte-1jhlcbi");
    			add_location(img3, file$1, 8, 60, 439);
    			attr_dev(a3, "href", "https://discord.gg/aA8scTvZ6B");
    			attr_dev(a3, "target", "_blank");
    			add_location(a3, file$1, 8, 4, 383);
    			attr_dev(footer, "class", "svelte-1jhlcbi");
    			add_location(footer, file$1, 4, 0, 25);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, a0);
    			append_dev(a0, img0);
    			append_dev(footer, t0);
    			append_dev(footer, a1);
    			append_dev(a1, img1);
    			append_dev(footer, t1);
    			append_dev(footer, a2);
    			append_dev(a2, img2);
    			append_dev(footer, t2);
    			append_dev(footer, a3);
    			append_dev(a3, img3);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.59.2 */
    const file = "src\\App.svelte";

    // (18:6) <Link to="/">
    function create_default_slot_11(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(18:6) <Link to=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (19:6) <Link to="/download">
    function create_default_slot_10(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Download");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(19:6) <Link to=\\\"/download\\\">",
    		ctx
    	});

    	return block;
    }

    // (20:6) <Link to="/songlist">
    function create_default_slot_9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Songlist");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(20:6) <Link to=\\\"/songlist\\\">",
    		ctx
    	});

    	return block;
    }

    // (21:6) <Link to="/hof">
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Hall of Fame");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(21:6) <Link to=\\\"/hof\\\">",
    		ctx
    	});

    	return block;
    }

    // (25:2) <Route path="/">
    function create_default_slot_7(ctx) {
    	let home;
    	let current;
    	home = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(25:2) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (28:2) <Route path="/download">
    function create_default_slot_6(ctx) {
    	let download;
    	let current;
    	download = new Download({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(download.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(download, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(download.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(download.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(download, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(28:2) <Route path=\\\"/download\\\">",
    		ctx
    	});

    	return block;
    }

    // (31:2) <Route path="/songlist">
    function create_default_slot_5(ctx) {
    	let songlist;
    	let current;
    	songlist = new Songlist({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(songlist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(songlist, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(songlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(songlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(songlist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(31:2) <Route path=\\\"/songlist\\\">",
    		ctx
    	});

    	return block;
    }

    // (34:2) <Route path="/secret">
    function create_default_slot_4(ctx) {
    	let secret;
    	let current;
    	secret = new Secret({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(secret.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(secret, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(secret.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(secret.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(secret, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(34:2) <Route path=\\\"/secret\\\">",
    		ctx
    	});

    	return block;
    }

    // (37:2) <Route path="/hof">
    function create_default_slot_3(ctx) {
    	let hof;
    	let current;
    	hof = new HoF({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(hof.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(hof, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hof.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hof.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(hof, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(37:2) <Route path=\\\"/hof\\\">",
    		ctx
    	});

    	return block;
    }

    // (40:2) <Route path="/leaderboards">
    function create_default_slot_2(ctx) {
    	let leaderboards;
    	let current;
    	leaderboards = new Leaderboards({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(leaderboards.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(leaderboards, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(leaderboards.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(leaderboards.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(leaderboards, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(40:2) <Route path=\\\"/leaderboards\\\">",
    		ctx
    	});

    	return block;
    }

    // (43:2) <Route path="/songinfo/:UniqueId" let:params>
    function create_default_slot_1(ctx) {
    	let songinfo;
    	let current;

    	songinfo = new Songinfo({
    			props: { UniqueId: /*params*/ ctx[1].UniqueId },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(songinfo.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(songinfo, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const songinfo_changes = {};
    			if (dirty & /*params*/ 2) songinfo_changes.UniqueId = /*params*/ ctx[1].UniqueId;
    			songinfo.$set(songinfo_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(songinfo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(songinfo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(songinfo, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(43:2) <Route path=\\\"/songinfo/:UniqueId\\\" let:params>",
    		ctx
    	});

    	return block;
    }

    // (16:0) <Router {url}>
    function create_default_slot(ctx) {
    	let header;
    	let h30;
    	let link0;
    	let t0;
    	let h31;
    	let link1;
    	let t1;
    	let h32;
    	let link2;
    	let t2;
    	let h33;
    	let link3;
    	let t3;
    	let h34;
    	let a;
    	let t5;
    	let div;
    	let route0;
    	let t6;
    	let route1;
    	let t7;
    	let route2;
    	let t8;
    	let route3;
    	let t9;
    	let route4;
    	let t10;
    	let route5;
    	let t11;
    	let route6;
    	let t12;
    	let footer;
    	let current;

    	link0 = new Link({
    			props: {
    				to: "/",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				to: "/download",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link({
    			props: {
    				to: "/songlist",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3 = new Link({
    			props: {
    				to: "/hof",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route0 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "/download",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: "/songlist",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route({
    			props: {
    				path: "/secret",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route4 = new Route({
    			props: {
    				path: "/hof",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route5 = new Route({
    			props: {
    				path: "/leaderboards",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route6 = new Route({
    			props: {
    				path: "/songinfo/:UniqueId",
    				$$slots: {
    					default: [
    						create_default_slot_1,
    						({ params }) => ({ 1: params }),
    						({ params }) => params ? 2 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			header = element("header");
    			h30 = element("h3");
    			create_component(link0.$$.fragment);
    			t0 = space();
    			h31 = element("h3");
    			create_component(link1.$$.fragment);
    			t1 = space();
    			h32 = element("h3");
    			create_component(link2.$$.fragment);
    			t2 = space();
    			h33 = element("h3");
    			create_component(link3.$$.fragment);
    			t3 = space();
    			h34 = element("h3");
    			a = element("a");
    			a.textContent = "Wiki";
    			t5 = space();
    			div = element("div");
    			create_component(route0.$$.fragment);
    			t6 = space();
    			create_component(route1.$$.fragment);
    			t7 = space();
    			create_component(route2.$$.fragment);
    			t8 = space();
    			create_component(route3.$$.fragment);
    			t9 = space();
    			create_component(route4.$$.fragment);
    			t10 = space();
    			create_component(route5.$$.fragment);
    			t11 = space();
    			create_component(route6.$$.fragment);
    			t12 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(h30, "class", "svelte-1ixpmii");
    			add_location(h30, file, 17, 2, 512);
    			attr_dev(h31, "class", "svelte-1ixpmii");
    			add_location(h31, file, 18, 2, 548);
    			attr_dev(h32, "class", "svelte-1ixpmii");
    			add_location(h32, file, 19, 2, 596);
    			attr_dev(h33, "class", "svelte-1ixpmii");
    			add_location(h33, file, 20, 2, 644);
    			attr_dev(a, "href", "https://opentaiko.wiki.gg");
    			attr_dev(a, "target", "_blank");
    			add_location(a, file, 21, 6, 695);
    			attr_dev(h34, "class", "svelte-1ixpmii");
    			add_location(h34, file, 21, 2, 691);
    			attr_dev(header, "class", "svelte-1ixpmii");
    			add_location(header, file, 16, 1, 501);
    			attr_dev(div, "class", "content svelte-1ixpmii");
    			add_location(div, file, 23, 1, 773);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h30);
    			mount_component(link0, h30, null);
    			append_dev(header, t0);
    			append_dev(header, h31);
    			mount_component(link1, h31, null);
    			append_dev(header, t1);
    			append_dev(header, h32);
    			mount_component(link2, h32, null);
    			append_dev(header, t2);
    			append_dev(header, h33);
    			mount_component(link3, h33, null);
    			append_dev(header, t3);
    			append_dev(header, h34);
    			append_dev(h34, a);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(route0, div, null);
    			append_dev(div, t6);
    			mount_component(route1, div, null);
    			append_dev(div, t7);
    			mount_component(route2, div, null);
    			append_dev(div, t8);
    			mount_component(route3, div, null);
    			append_dev(div, t9);
    			mount_component(route4, div, null);
    			append_dev(div, t10);
    			mount_component(route5, div, null);
    			append_dev(div, t11);
    			mount_component(route6, div, null);
    			insert_dev(target, t12, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    			const link3_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link3_changes.$$scope = { dirty, ctx };
    			}

    			link3.$set(link3_changes);
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    			const route5_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route5_changes.$$scope = { dirty, ctx };
    			}

    			route5.$set(route5_changes);
    			const route6_changes = {};

    			if (dirty & /*$$scope, params*/ 6) {
    				route6_changes.$$scope = { dirty, ctx };
    			}

    			route6.$set(route6_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(link3.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			transition_in(route5.$$.fragment, local);
    			transition_in(route6.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(link3.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			transition_out(route5.$$.fragment, local);
    			transition_out(route6.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    			destroy_component(link3);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    			destroy_component(route4);
    			destroy_component(route5);
    			destroy_component(route6);
    			if (detaching) detach_dev(t12);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(16:0) <Router {url}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				url: /*url*/ ctx[0],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};
    			if (dirty & /*url*/ 1) router_changes.url = /*url*/ ctx[0];

    			if (dirty & /*$$scope*/ 4) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { url = "" } = $$props;
    	const writable_props = ['url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    	};

    	$$self.$capture_state = () => ({
    		Router,
    		Link,
    		Route,
    		Home,
    		Download,
    		Songlist,
    		Songinfo,
    		Secret,
    		HoF,
    		Leaderboards,
    		Footer,
    		url
    	});

    	$$self.$inject_state = $$props => {
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [url];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance, create_fragment, safe_not_equal, { url: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get url() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
