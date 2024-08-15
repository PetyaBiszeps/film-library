(function () {
    'use strict';

    class AbstractView {
        constructor() {
            this.app = document.getElementById('root');
        }

        setTitle(title) {
            document.title = title;
        }

        render() {

        }

        destroy() {

        }
    }

    class DivComponent {
        constructor() {
            this.el = document.createElement('div');
        }

        render() {
            return this.el;
        }
    }

    class Header extends DivComponent {
        constructor(appState) {
            super();
            this.appState = appState;
        }

        render() {
            this.el.innerHTML = '';
            this.el.classList.add('header');
            this.el.innerHTML = `
            <div>
                <img src="./static/movie-logo.svg" alt="logo" id="main-logo"/>
            </div>
            <div class="menu">
                <a href="#" class="menu__item">
                    <img src="./static/search.svg" alt="search-icon" />
                    Search
                </a>
                <a href="#favourites" class="menu__item">
                    <img src="./static/favorites.svg" alt="favourites-icon" />
                    Favourites
                    <div class="menu__counter">
                        ${this.appState.favourites.length}
                    </div>
                </a>
            </div>
        `;
            return this.el;
        }
    }

    class Search extends DivComponent {
        constructor(state) {
            super();
            this.state = state;
        }

        search() {
            const value = this.el.querySelector('input').value;
            this.state.searchQuery = value;
        }

        render() {
            this.el.classList.add('search');
            this.el.innerHTML = `
            <div class="search__wrapper">
                <input type="text" placeholder="Find movie by name, writer or actor(s)..." class="search__input" value="${this.state.searchQuery ? this.state.searchQuery : ''}"/>
                <img src="./static/search.svg" alt="search-icon">
            </div>
            <button aria-label="search"><img src="./static/search-white.svg" alt="search-icon"></button>
        `;
            this.el.querySelector('button').addEventListener('click', this.search.bind(this));
            this.el.querySelector('input').addEventListener('keydown', (event) => {
                if (event.code === 'Enter') {
                    this.search();
                }
            });
            return this.el;
        }
    }

    const PATH_SEPARATOR = '.';
    const TARGET = Symbol('target');
    const UNSUBSCRIBE = Symbol('unsubscribe');

    function isBuiltinWithMutableMethods(value) {
    	return value instanceof Date
    		|| value instanceof Set
    		|| value instanceof Map
    		|| value instanceof WeakSet
    		|| value instanceof WeakMap
    		|| ArrayBuffer.isView(value);
    }

    function isBuiltinWithoutMutableMethods(value) {
    	return (typeof value === 'object' ? value === null : typeof value !== 'function') || value instanceof RegExp;
    }

    var isArray = Array.isArray;

    function isSymbol(value) {
    	return typeof value === 'symbol';
    }

    const path = {
    	after(path, subPath) {
    		if (isArray(path)) {
    			return path.slice(subPath.length);
    		}

    		if (subPath === '') {
    			return path;
    		}

    		return path.slice(subPath.length + 1);
    	},
    	concat(path, key) {
    		if (isArray(path)) {
    			path = [...path];

    			if (key) {
    				path.push(key);
    			}

    			return path;
    		}

    		if (key && key.toString !== undefined) {
    			if (path !== '') {
    				path += PATH_SEPARATOR;
    			}

    			if (isSymbol(key)) {
    				return path + key.toString();
    			}

    			return path + key;
    		}

    		return path;
    	},
    	initial(path) {
    		if (isArray(path)) {
    			return path.slice(0, -1);
    		}

    		if (path === '') {
    			return path;
    		}

    		const index = path.lastIndexOf(PATH_SEPARATOR);

    		if (index === -1) {
    			return '';
    		}

    		return path.slice(0, index);
    	},
    	last(path) {
    		if (isArray(path)) {
    			return path.at(-1) ?? '';
    		}

    		if (path === '') {
    			return path;
    		}

    		const index = path.lastIndexOf(PATH_SEPARATOR);

    		if (index === -1) {
    			return path;
    		}

    		return path.slice(index + 1);
    	},
    	walk(path, callback) {
    		if (isArray(path)) {
    			for (const key of path) {
    				callback(key);
    			}
    		} else if (path !== '') {
    			let position = 0;
    			let index = path.indexOf(PATH_SEPARATOR);

    			if (index === -1) {
    				callback(path);
    			} else {
    				while (position < path.length) {
    					if (index === -1) {
    						index = path.length;
    					}

    					callback(path.slice(position, index));

    					position = index + 1;
    					index = path.indexOf(PATH_SEPARATOR, position);
    				}
    			}
    		}
    	},
    	get(object, path) {
    		this.walk(path, key => {
    			if (object) {
    				object = object[key];
    			}
    		});

    		return object;
    	},
    	isSubPath(path, subPath) {
    		if (isArray(path)) {
    			if (path.length < subPath.length) {
    				return false;
    			}

    			// eslint-disable-next-line unicorn/no-for-loop
    			for (let i = 0; i < subPath.length; i++) {
    				if (path[i] !== subPath[i]) {
    					return false;
    				}
    			}

    			return true;
    		}

    		if (path.length < subPath.length) {
    			return false;
    		}

    		if (path === subPath) {
    			return true;
    		}

    		if (path.startsWith(subPath)) {
    			return path[subPath.length] === PATH_SEPARATOR;
    		}

    		return false;
    	},
    	isRootPath(path) {
    		if (isArray(path)) {
    			return path.length === 0;
    		}

    		return path === '';
    	},
    };

    function isIterator(value) {
    	return typeof value === 'object' && typeof value.next === 'function';
    }

    // eslint-disable-next-line max-params
    function wrapIterator(iterator, target, thisArgument, applyPath, prepareValue) {
    	const originalNext = iterator.next;

    	if (target.name === 'entries') {
    		iterator.next = function () {
    			const result = originalNext.call(this);

    			if (result.done === false) {
    				result.value[0] = prepareValue(
    					result.value[0],
    					target,
    					result.value[0],
    					applyPath,
    				);
    				result.value[1] = prepareValue(
    					result.value[1],
    					target,
    					result.value[0],
    					applyPath,
    				);
    			}

    			return result;
    		};
    	} else if (target.name === 'values') {
    		const keyIterator = thisArgument[TARGET].keys();

    		iterator.next = function () {
    			const result = originalNext.call(this);

    			if (result.done === false) {
    				result.value = prepareValue(
    					result.value,
    					target,
    					keyIterator.next().value,
    					applyPath,
    				);
    			}

    			return result;
    		};
    	} else {
    		iterator.next = function () {
    			const result = originalNext.call(this);

    			if (result.done === false) {
    				result.value = prepareValue(
    					result.value,
    					target,
    					result.value,
    					applyPath,
    				);
    			}

    			return result;
    		};
    	}

    	return iterator;
    }

    function ignoreProperty(cache, options, property) {
    	return cache.isUnsubscribed
    		|| (options.ignoreSymbols && isSymbol(property))
    		|| (options.ignoreUnderscores && property.charAt(0) === '_')
    		|| ('ignoreKeys' in options && options.ignoreKeys.includes(property));
    }

    /**
    @class Cache
    @private
    */
    class Cache {
    	constructor(equals) {
    		this._equals = equals;
    		this._proxyCache = new WeakMap();
    		this._pathCache = new WeakMap();
    		this.isUnsubscribed = false;
    	}

    	_getDescriptorCache() {
    		if (this._descriptorCache === undefined) {
    			this._descriptorCache = new WeakMap();
    		}

    		return this._descriptorCache;
    	}

    	_getProperties(target) {
    		const descriptorCache = this._getDescriptorCache();
    		let properties = descriptorCache.get(target);

    		if (properties === undefined) {
    			properties = {};
    			descriptorCache.set(target, properties);
    		}

    		return properties;
    	}

    	_getOwnPropertyDescriptor(target, property) {
    		if (this.isUnsubscribed) {
    			return Reflect.getOwnPropertyDescriptor(target, property);
    		}

    		const properties = this._getProperties(target);
    		let descriptor = properties[property];

    		if (descriptor === undefined) {
    			descriptor = Reflect.getOwnPropertyDescriptor(target, property);
    			properties[property] = descriptor;
    		}

    		return descriptor;
    	}

    	getProxy(target, path, handler, proxyTarget) {
    		if (this.isUnsubscribed) {
    			return target;
    		}

    		const reflectTarget = target[proxyTarget];
    		const source = reflectTarget ?? target;

    		this._pathCache.set(source, path);

    		let proxy = this._proxyCache.get(source);

    		if (proxy === undefined) {
    			proxy = reflectTarget === undefined
    				? new Proxy(target, handler)
    				: target;

    			this._proxyCache.set(source, proxy);
    		}

    		return proxy;
    	}

    	getPath(target) {
    		return this.isUnsubscribed ? undefined : this._pathCache.get(target);
    	}

    	isDetached(target, object) {
    		return !Object.is(target, path.get(object, this.getPath(target)));
    	}

    	defineProperty(target, property, descriptor) {
    		if (!Reflect.defineProperty(target, property, descriptor)) {
    			return false;
    		}

    		if (!this.isUnsubscribed) {
    			this._getProperties(target)[property] = descriptor;
    		}

    		return true;
    	}

    	setProperty(target, property, value, receiver, previous) { // eslint-disable-line max-params
    		if (!this._equals(previous, value) || !(property in target)) {
    			const descriptor = this._getOwnPropertyDescriptor(target, property);

    			if (descriptor !== undefined && 'set' in descriptor) {
    				return Reflect.set(target, property, value, receiver);
    			}

    			return Reflect.set(target, property, value);
    		}

    		return true;
    	}

    	deleteProperty(target, property, previous) {
    		if (Reflect.deleteProperty(target, property)) {
    			if (!this.isUnsubscribed) {
    				const properties = this._getDescriptorCache().get(target);

    				if (properties) {
    					delete properties[property];
    					this._pathCache.delete(previous);
    				}
    			}

    			return true;
    		}

    		return false;
    	}

    	isSameDescriptor(a, target, property) {
    		const b = this._getOwnPropertyDescriptor(target, property);

    		return a !== undefined
    			&& b !== undefined
    			&& Object.is(a.value, b.value)
    			&& (a.writable || false) === (b.writable || false)
    			&& (a.enumerable || false) === (b.enumerable || false)
    			&& (a.configurable || false) === (b.configurable || false)
    			&& a.get === b.get
    			&& a.set === b.set;
    	}

    	isGetInvariant(target, property) {
    		const descriptor = this._getOwnPropertyDescriptor(target, property);

    		return descriptor !== undefined
    			&& descriptor.configurable !== true
    			&& descriptor.writable !== true;
    	}

    	unsubscribe() {
    		this._descriptorCache = null;
    		this._pathCache = null;
    		this._proxyCache = null;
    		this.isUnsubscribed = true;
    	}
    }

    function isObject(value) {
    	return toString.call(value) === '[object Object]';
    }

    function isDiffCertain() {
    	return true;
    }

    function isDiffArrays(clone, value) {
    	return clone.length !== value.length || clone.some((item, index) => value[index] !== item);
    }

    const IMMUTABLE_OBJECT_METHODS = new Set([
    	'hasOwnProperty',
    	'isPrototypeOf',
    	'propertyIsEnumerable',
    	'toLocaleString',
    	'toString',
    	'valueOf',
    ]);

    const IMMUTABLE_ARRAY_METHODS = new Set([
    	'concat',
    	'includes',
    	'indexOf',
    	'join',
    	'keys',
    	'lastIndexOf',
    ]);

    const MUTABLE_ARRAY_METHODS = {
    	push: isDiffCertain,
    	pop: isDiffCertain,
    	shift: isDiffCertain,
    	unshift: isDiffCertain,
    	copyWithin: isDiffArrays,
    	reverse: isDiffArrays,
    	sort: isDiffArrays,
    	splice: isDiffArrays,
    	flat: isDiffArrays,
    	fill: isDiffArrays,
    };

    const HANDLED_ARRAY_METHODS = new Set([
    	...IMMUTABLE_OBJECT_METHODS,
    	...IMMUTABLE_ARRAY_METHODS,
    	...Object.keys(MUTABLE_ARRAY_METHODS),
    ]);

    function isDiffSets(clone, value) {
    	if (clone.size !== value.size) {
    		return true;
    	}

    	for (const element of clone) {
    		if (!value.has(element)) {
    			return true;
    		}
    	}

    	return false;
    }

    const COLLECTION_ITERATOR_METHODS = [
    	'keys',
    	'values',
    	'entries',
    ];

    const IMMUTABLE_SET_METHODS = new Set([
    	'has',
    	'toString',
    ]);

    const MUTABLE_SET_METHODS = {
    	add: isDiffSets,
    	clear: isDiffSets,
    	delete: isDiffSets,
    	forEach: isDiffSets,
    };

    const HANDLED_SET_METHODS = new Set([
    	...IMMUTABLE_SET_METHODS,
    	...Object.keys(MUTABLE_SET_METHODS),
    	...COLLECTION_ITERATOR_METHODS,
    ]);

    function isDiffMaps(clone, value) {
    	if (clone.size !== value.size) {
    		return true;
    	}

    	let bValue;
    	for (const [key, aValue] of clone) {
    		bValue = value.get(key);

    		if (bValue !== aValue || (bValue === undefined && !value.has(key))) {
    			return true;
    		}
    	}

    	return false;
    }

    const IMMUTABLE_MAP_METHODS = new Set([...IMMUTABLE_SET_METHODS, 'get']);

    const MUTABLE_MAP_METHODS = {
    	set: isDiffMaps,
    	clear: isDiffMaps,
    	delete: isDiffMaps,
    	forEach: isDiffMaps,
    };

    const HANDLED_MAP_METHODS = new Set([
    	...IMMUTABLE_MAP_METHODS,
    	...Object.keys(MUTABLE_MAP_METHODS),
    	...COLLECTION_ITERATOR_METHODS,
    ]);

    class CloneObject {
    	constructor(value, path, argumentsList, hasOnValidate) {
    		this._path = path;
    		this._isChanged = false;
    		this._clonedCache = new Set();
    		this._hasOnValidate = hasOnValidate;
    		this._changes = hasOnValidate ? [] : null;

    		this.clone = path === undefined ? value : this._shallowClone(value);
    	}

    	static isHandledMethod(name) {
    		return IMMUTABLE_OBJECT_METHODS.has(name);
    	}

    	_shallowClone(value) {
    		let clone = value;

    		if (isObject(value)) {
    			clone = {...value};
    		} else if (isArray(value) || ArrayBuffer.isView(value)) {
    			clone = [...value];
    		} else if (value instanceof Date) {
    			clone = new Date(value);
    		} else if (value instanceof Set) {
    			clone = new Set([...value].map(item => this._shallowClone(item)));
    		} else if (value instanceof Map) {
    			clone = new Map();

    			for (const [key, item] of value.entries()) {
    				clone.set(key, this._shallowClone(item));
    			}
    		}

    		this._clonedCache.add(clone);

    		return clone;
    	}

    	preferredThisArg(isHandledMethod, name, thisArgument, thisProxyTarget) {
    		if (isHandledMethod) {
    			if (isArray(thisProxyTarget)) {
    				this._onIsChanged = MUTABLE_ARRAY_METHODS[name];
    			} else if (thisProxyTarget instanceof Set) {
    				this._onIsChanged = MUTABLE_SET_METHODS[name];
    			} else if (thisProxyTarget instanceof Map) {
    				this._onIsChanged = MUTABLE_MAP_METHODS[name];
    			}

    			return thisProxyTarget;
    		}

    		return thisArgument;
    	}

    	update(fullPath, property, value) {
    		const changePath = path.after(fullPath, this._path);

    		if (property !== 'length') {
    			let object = this.clone;

    			path.walk(changePath, key => {
    				if (object?.[key]) {
    					if (!this._clonedCache.has(object[key])) {
    						object[key] = this._shallowClone(object[key]);
    					}

    					object = object[key];
    				}
    			});

    			if (this._hasOnValidate) {
    				this._changes.push({
    					path: changePath,
    					property,
    					previous: value,
    				});
    			}

    			if (object?.[property]) {
    				object[property] = value;
    			}
    		}

    		this._isChanged = true;
    	}

    	undo(object) {
    		let change;

    		for (let index = this._changes.length - 1; index !== -1; index--) {
    			change = this._changes[index];

    			path.get(object, change.path)[change.property] = change.previous;
    		}
    	}

    	isChanged(value) {
    		return this._onIsChanged === undefined
    			? this._isChanged
    			: this._onIsChanged(this.clone, value);
    	}

    	isPathApplicable(changePath) {
    		return path.isRootPath(this._path) || path.isSubPath(changePath, this._path);
    	}
    }

    class CloneArray extends CloneObject {
    	static isHandledMethod(name) {
    		return HANDLED_ARRAY_METHODS.has(name);
    	}
    }

    class CloneDate extends CloneObject {
    	undo(object) {
    		object.setTime(this.clone.getTime());
    	}

    	isChanged(value, equals) {
    		return !equals(this.clone.valueOf(), value.valueOf());
    	}
    }

    class CloneSet extends CloneObject {
    	static isHandledMethod(name) {
    		return HANDLED_SET_METHODS.has(name);
    	}

    	undo(object) {
    		for (const value of this.clone) {
    			object.add(value);
    		}

    		for (const value of object) {
    			if (!this.clone.has(value)) {
    				object.delete(value);
    			}
    		}
    	}
    }

    class CloneMap extends CloneObject {
    	static isHandledMethod(name) {
    		return HANDLED_MAP_METHODS.has(name);
    	}

    	undo(object) {
    		for (const [key, value] of this.clone.entries()) {
    			object.set(key, value);
    		}

    		for (const key of object.keys()) {
    			if (!this.clone.has(key)) {
    				object.delete(key);
    			}
    		}
    	}
    }

    class CloneWeakSet extends CloneObject {
    	constructor(value, path, argumentsList, hasOnValidate) {
    		super(undefined, path, argumentsList, hasOnValidate);

    		this._argument1 = argumentsList[0];
    		this._weakValue = value.has(this._argument1);
    	}

    	isChanged(value) {
    		return this._weakValue !== value.has(this._argument1);
    	}

    	undo(object) {
    		if (this._weakValue && !object.has(this._argument1)) {
    			object.add(this._argument1);
    		} else {
    			object.delete(this._argument1);
    		}
    	}
    }

    class CloneWeakMap extends CloneObject {
    	constructor(value, path, argumentsList, hasOnValidate) {
    		super(undefined, path, argumentsList, hasOnValidate);

    		this._weakKey = argumentsList[0];
    		this._weakHas = value.has(this._weakKey);
    		this._weakValue = value.get(this._weakKey);
    	}

    	isChanged(value) {
    		return this._weakValue !== value.get(this._weakKey);
    	}

    	undo(object) {
    		const weakHas = object.has(this._weakKey);

    		if (this._weakHas && !weakHas) {
    			object.set(this._weakKey, this._weakValue);
    		} else if (!this._weakHas && weakHas) {
    			object.delete(this._weakKey);
    		} else if (this._weakValue !== object.get(this._weakKey)) {
    			object.set(this._weakKey, this._weakValue);
    		}
    	}
    }

    class SmartClone {
    	constructor(hasOnValidate) {
    		this._stack = [];
    		this._hasOnValidate = hasOnValidate;
    	}

    	static isHandledType(value) {
    		return isObject(value)
    			|| isArray(value)
    			|| isBuiltinWithMutableMethods(value);
    	}

    	static isHandledMethod(target, name) {
    		if (isObject(target)) {
    			return CloneObject.isHandledMethod(name);
    		}

    		if (isArray(target)) {
    			return CloneArray.isHandledMethod(name);
    		}

    		if (target instanceof Set) {
    			return CloneSet.isHandledMethod(name);
    		}

    		if (target instanceof Map) {
    			return CloneMap.isHandledMethod(name);
    		}

    		return isBuiltinWithMutableMethods(target);
    	}

    	get isCloning() {
    		return this._stack.length > 0;
    	}

    	start(value, path, argumentsList) {
    		let CloneClass = CloneObject;

    		if (isArray(value)) {
    			CloneClass = CloneArray;
    		} else if (value instanceof Date) {
    			CloneClass = CloneDate;
    		} else if (value instanceof Set) {
    			CloneClass = CloneSet;
    		} else if (value instanceof Map) {
    			CloneClass = CloneMap;
    		} else if (value instanceof WeakSet) {
    			CloneClass = CloneWeakSet;
    		} else if (value instanceof WeakMap) {
    			CloneClass = CloneWeakMap;
    		}

    		this._stack.push(new CloneClass(value, path, argumentsList, this._hasOnValidate));
    	}

    	update(fullPath, property, value) {
    		this._stack.at(-1).update(fullPath, property, value);
    	}

    	preferredThisArg(target, thisArgument, thisProxyTarget) {
    		const {name} = target;
    		const isHandledMethod = SmartClone.isHandledMethod(thisProxyTarget, name);

    		return this._stack.at(-1)
    			.preferredThisArg(isHandledMethod, name, thisArgument, thisProxyTarget);
    	}

    	isChanged(isMutable, value, equals) {
    		return this._stack.at(-1).isChanged(isMutable, value, equals);
    	}

    	isPartOfClone(changePath) {
    		return this._stack.at(-1).isPathApplicable(changePath);
    	}

    	undo(object) {
    		if (this._previousClone !== undefined) {
    			this._previousClone.undo(object);
    		}
    	}

    	stop() {
    		this._previousClone = this._stack.pop();

    		return this._previousClone.clone;
    	}
    }

    /* eslint-disable unicorn/prefer-spread */

    const defaultOptions = {
    	equals: Object.is,
    	isShallow: false,
    	pathAsArray: false,
    	ignoreSymbols: false,
    	ignoreUnderscores: false,
    	ignoreDetached: false,
    	details: false,
    };

    const onChange = (object, onChange, options = {}) => {
    	options = {
    		...defaultOptions,
    		...options,
    	};

    	const proxyTarget = Symbol('ProxyTarget');
    	const {equals, isShallow, ignoreDetached, details} = options;
    	const cache = new Cache(equals);
    	const hasOnValidate = typeof options.onValidate === 'function';
    	const smartClone = new SmartClone(hasOnValidate);

    	// eslint-disable-next-line max-params
    	const validate = (target, property, value, previous, applyData) => !hasOnValidate
    		|| smartClone.isCloning
    		|| options.onValidate(path.concat(cache.getPath(target), property), value, previous, applyData) === true;

    	const handleChangeOnTarget = (target, property, value, previous) => {
    		if (
    			!ignoreProperty(cache, options, property)
    			&& !(ignoreDetached && cache.isDetached(target, object))
    		) {
    			handleChange(cache.getPath(target), property, value, previous);
    		}
    	};

    	// eslint-disable-next-line max-params
    	const handleChange = (changePath, property, value, previous, applyData) => {
    		if (smartClone.isCloning && smartClone.isPartOfClone(changePath)) {
    			smartClone.update(changePath, property, previous);
    		} else {
    			onChange(path.concat(changePath, property), value, previous, applyData);
    		}
    	};

    	const getProxyTarget = value => value
    		? (value[proxyTarget] ?? value)
    		: value;

    	const prepareValue = (value, target, property, basePath) => {
    		if (
    			isBuiltinWithoutMutableMethods(value)
    			|| property === 'constructor'
    			|| (isShallow && !SmartClone.isHandledMethod(target, property))
    			|| ignoreProperty(cache, options, property)
    			|| cache.isGetInvariant(target, property)
    			|| (ignoreDetached && cache.isDetached(target, object))
    		) {
    			return value;
    		}

    		if (basePath === undefined) {
    			basePath = cache.getPath(target);
    		}

    		/*
      		Check for circular references.

      		If the value already has a corresponding path/proxy,
    		and if the path corresponds to one of the parents,
    		then we are on a circular case, where the child is pointing to their parent.
    		In this case we return the proxy object with the shortest path.
      		*/
    		const childPath = path.concat(basePath, property);
    		const existingPath = cache.getPath(value);

    		if (existingPath && isSameObjectTree(childPath, existingPath)) {
    			// We are on the same object tree but deeper, so we use the parent path.
    			return cache.getProxy(value, existingPath, handler, proxyTarget);
    		}

    		return cache.getProxy(value, childPath, handler, proxyTarget);
    	};

    	/*
    	Returns true if `childPath` is a subpath of `existingPath`
    	(if childPath starts with existingPath). Otherwise, it returns false.

     	It also returns false if the 2 paths are identical.

     	For example:
    	- childPath    = group.layers.0.parent.layers.0.value
    	- existingPath = group.layers.0.parent
    	*/
    	const isSameObjectTree = (childPath, existingPath) => {
    		if (isSymbol(childPath) || childPath.length <= existingPath.length) {
    			return false;
    		}

    		if (isArray(existingPath) && existingPath.length === 0) {
    			return false;
    		}

    		const childParts = isArray(childPath) ? childPath : childPath.split(PATH_SEPARATOR);
    		const existingParts = isArray(existingPath) ? existingPath : existingPath.split(PATH_SEPARATOR);

    		if (childParts.length <= existingParts.length) {
    			return false;
    		}

    		return !(existingParts.some((part, index) => part !== childParts[index]));
    	};

    	const handler = {
    		get(target, property, receiver) {
    			if (isSymbol(property)) {
    				if (property === proxyTarget || property === TARGET) {
    					return target;
    				}

    				if (
    					property === UNSUBSCRIBE
    					&& !cache.isUnsubscribed
    					&& cache.getPath(target).length === 0
    				) {
    					cache.unsubscribe();
    					return target;
    				}
    			}

    			const value = isBuiltinWithMutableMethods(target)
    				? Reflect.get(target, property)
    				: Reflect.get(target, property, receiver);

    			return prepareValue(value, target, property);
    		},

    		set(target, property, value, receiver) {
    			value = getProxyTarget(value);

    			const reflectTarget = target[proxyTarget] ?? target;
    			const previous = reflectTarget[property];

    			if (equals(previous, value) && property in target) {
    				return true;
    			}

    			const isValid = validate(target, property, value, previous);

    			if (
    				isValid
    				&& cache.setProperty(reflectTarget, property, value, receiver, previous)
    			) {
    				handleChangeOnTarget(target, property, target[property], previous);

    				return true;
    			}

    			return !isValid;
    		},

    		defineProperty(target, property, descriptor) {
    			if (!cache.isSameDescriptor(descriptor, target, property)) {
    				const previous = target[property];

    				if (
    					validate(target, property, descriptor.value, previous)
    					&& cache.defineProperty(target, property, descriptor, previous)
    				) {
    					handleChangeOnTarget(target, property, descriptor.value, previous);
    				}
    			}

    			return true;
    		},

    		deleteProperty(target, property) {
    			if (!Reflect.has(target, property)) {
    				return true;
    			}

    			const previous = Reflect.get(target, property);
    			const isValid = validate(target, property, undefined, previous);

    			if (
    				isValid
    				&& cache.deleteProperty(target, property, previous)
    			) {
    				handleChangeOnTarget(target, property, undefined, previous);

    				return true;
    			}

    			return !isValid;
    		},

    		apply(target, thisArg, argumentsList) {
    			const thisProxyTarget = thisArg[proxyTarget] ?? thisArg;

    			if (cache.isUnsubscribed) {
    				return Reflect.apply(target, thisProxyTarget, argumentsList);
    			}

    			if (
    				(details === false
    					|| (details !== true && !details.includes(target.name)))
    				&& SmartClone.isHandledType(thisProxyTarget)
    			) {
    				let applyPath = path.initial(cache.getPath(target));
    				const isHandledMethod = SmartClone.isHandledMethod(thisProxyTarget, target.name);

    				smartClone.start(thisProxyTarget, applyPath, argumentsList);

    				let result = Reflect.apply(
    					target,
    					smartClone.preferredThisArg(target, thisArg, thisProxyTarget),
    					isHandledMethod
    						? argumentsList.map(argument => getProxyTarget(argument))
    						: argumentsList,
    				);

    				const isChanged = smartClone.isChanged(thisProxyTarget, equals);
    				const previous = smartClone.stop();

    				if (SmartClone.isHandledType(result) && isHandledMethod) {
    					if (thisArg instanceof Map && target.name === 'get') {
    						applyPath = path.concat(applyPath, argumentsList[0]);
    					}

    					result = cache.getProxy(result, applyPath, handler);
    				}

    				if (isChanged) {
    					const applyData = {
    						name: target.name,
    						args: argumentsList,
    						result,
    					};
    					const changePath = smartClone.isCloning
    						? path.initial(applyPath)
    						: applyPath;
    					const property = smartClone.isCloning
    						? path.last(applyPath)
    						: '';

    					if (validate(path.get(object, changePath), property, thisProxyTarget, previous, applyData)) {
    						handleChange(changePath, property, thisProxyTarget, previous, applyData);
    					} else {
    						smartClone.undo(thisProxyTarget);
    					}
    				}

    				if (
    					(thisArg instanceof Map || thisArg instanceof Set)
    					&& isIterator(result)
    				) {
    					return wrapIterator(result, target, thisArg, applyPath, prepareValue);
    				}

    				return result;
    			}

    			return Reflect.apply(target, thisArg, argumentsList);
    		},
    	};

    	const proxy = cache.getProxy(object, options.pathAsArray ? [] : '', handler);
    	onChange = onChange.bind(proxy);

    	if (hasOnValidate) {
    		options.onValidate = options.onValidate.bind(proxy);
    	}

    	return proxy;
    };

    onChange.target = proxy => proxy?.[TARGET] ?? proxy;
    onChange.unsubscribe = proxy => proxy?.[UNSUBSCRIBE] ?? proxy;

    class Card extends DivComponent {
        constructor(appState, cardState) {
            super();
            this.appState = appState;
            this.cardState = cardState;
        }

        #addToFavourites() {
            this.appState.favourites.push(this.cardState);
        }

        #deleteFromFavourites() {
            this.appState.favourites = this.appState.favourites.filter(f => f.imdbID !== this.cardState.imdbID);
        }

        render() {
            this.el.classList.add('card');
            const existInFavourites = this.appState.favourites.find(f => f.imdbID === this.cardState.imdbID);
            this.el.innerHTML = `<div class="card__image">
                                <img src="${this.cardState.Poster !== 'N/A' ? this.cardState.Poster : 'path/to/default/poster.jpg'}" alt="${this.cardState.Title} Poster">
                            </div>
                            <div class="card__info">
                                <div class="card__type">Type: ${this.cardState.Type}</div>
                                <div class="card__title">Title: ${this.cardState.Title}</div>
                                <div class="card__year">Year: ${this.cardState.Year}</div>
                                <button class="button__add ${existInFavourites ? 'button__active' : ''}">
                                    ${existInFavourites ? '<img src="./static/favorite-black.svg" alt="fb"/>' : '<img src="./static/favorite-white.svg" alt="fw"/>'}
                                </button>
                            </div>`;
            if (existInFavourites) {
                this.el
                    .querySelector('button')
                    .addEventListener('click', this.#deleteFromFavourites.bind(this));
            } else {
                this.el
                    .querySelector('button')
                    .addEventListener('click', this.#addToFavourites.bind(this));
            }
            console.log(existInFavourites);
            return this.el;
        }
    }

    class CardList extends DivComponent {
        constructor(appState, parentState) {
            super();
            this.appState = appState;
            this.parentState = parentState;
        }

        render() {
            if (this.parentState.loading) {
                this.el.innerHTML = `<div class="card_list__loader">Loading...</div>`;
                return this.el;
            }

            const cardGrid = document.createElement('div');
            cardGrid.classList.add('card_grid');
            this.el.append(cardGrid);

            for (const card of this.parentState.list) {
                cardGrid.append(new Card(this.appState, card).render());
            }
            return this.el;
        }
    }

    class mainView extends AbstractView {
        state = {
            list: [],
            totalResults: 0,
            loading: false,
            searchQuery: undefined,
            currentPage: 1,
            totalPages: 0,
            resultsPerPage: 12,
        };

        constructor(appState) {
            super();
            this.appState = appState;
            this.appState = onChange(this.appState, this.appStateHook.bind(this));
            this.state = onChange(this.state, this.stateHook.bind(this));
            this.setTitle('Movie Library');
        }

        destroy() {
            onChange.unsubscribe(this.appState);
            onChange.unsubscribe(this.state);
        }

        appStateHook(path) {
            if (path === 'favourites') {
                this.render();
            }
        }

        async stateHook(path) {
            if (path === 'searchQuery' || path === 'currentPage') {
                this.state.loading = true;
                const data = await this.loadList(this.state.searchQuery, this.state.currentPage);
                this.state.loading = false;
                this.state.totalResults = data.totalResults;
                this.state.totalPages = Math.ceil(data.totalResults / this.state.resultsPerPage);
                this.state.list = data["Search"];
            }
            if (path === 'list' || path === 'loading') {
                this.render();
            }
        }

        async loadList(name, page) {
            const res = await fetch(`https://www.omdbapi.com/?s=${name}&page=${page}&apikey=98d8bb42`);
            const data = await res.json();

            (page - 1) * this.state.resultsPerPage;
            let finalResults = data.Search || [];

            if (this.state.resultsPerPage > 10) {
                const additionalRequests = Math.ceil((this.state.resultsPerPage - 10) / 10);
                for (let i = 1; i <= additionalRequests; i++) {
                    const additionalPage = page + i;
                    const additionalRes = await fetch(`https://www.omdbapi.com/?s=${name}&page=${additionalPage}&apikey=98d8bb42`);
                    const additionalData = await additionalRes.json();
                    finalResults = finalResults.concat(additionalData.Search || []);
                }
            }

            return {
                totalResults: data.totalResults,
                Search: finalResults.slice(0, this.state.resultsPerPage)
            };
        }

        render() {
            const main = document.createElement('div');
            main.innerHTML = `<h1>Found movies - ${this.state.totalResults}</h1>`;
            main.append(new Search(this.state).render());
            main.append(new CardList(this.appState, this.state).render());
            this.app.innerHTML = '';
            this.app.append(main);
            this.renderHeader();
            this.renderPagination();
        }

        renderHeader() {
            const header = new Header(this.appState).render();
            this.app.prepend(header);
        }

        renderPagination() {
            const pagination = document.createElement('div');
            pagination.classList.add('pagination');

            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous';
            prevButton.disabled = this.state.currentPage === 1;
            prevButton.onclick = () => {
                if (this.state.currentPage > 1) {
                    this.state.currentPage -= 1;
                }
            };

            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.disabled = this.state.currentPage === this.state.totalPages;
            nextButton.onclick = () => {
                if (this.state.currentPage < this.state.totalPages) {
                    this.state.currentPage += 1;
                }
            };

            pagination.append(prevButton, nextButton);
            this.app.append(pagination);
        }
    }

    class FavouritesView extends AbstractView {

        constructor(appState) {
            super();
            this.appState = appState;
            this.appState = onChange(this.appState, this.appStateHook.bind(this));
            this.setTitle('My films');
        }

        destroy() {
            onChange.unsubscribe(this.appState);
        }

        appStateHook(path) {
            if (path === 'favourites') {
                this.render();
            }
        }

        render() {
            const main = document.createElement('div');
            main.innerHTML = `<h1>My favourite movies - ${this.appState.favourites.length}</h1>`;
            main.append(new CardList(this.appState, {list: this.appState.favourites}).render());
            this.app.innerHTML = '';
            this.app.append(main);
            this.renderHeader();
        }

        renderHeader() {
            const header = new Header(this.appState).render();
            this.app.prepend(header);
        }
    }

    class app {
        routes = [
            {path: "", view: mainView},
            {path: "#favourites", view: FavouritesView}
        ];

        appState = {
            favourites: []
        };

        constructor() {
            window.addEventListener('hashchange', this.route.bind(this));
            this.route();
        }

        route() {
            if (this.currentView) {
                this.currentView.destroy();
            }
            const view = this.routes.find(r => r.path === location.hash).view;
            this.currentView = new view(this.appState);
            this.currentView.render();
        }
    }

    new app();

})();
