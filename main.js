/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./config.js":
/*!*******************!*\
  !*** ./config.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const config = {
  githubToken: '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',
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (config);


/***/ }),

/***/ "./node_modules/@octokit/auth-token/dist-web/index.js":
/*!************************************************************!*\
  !*** ./node_modules/@octokit/auth-token/dist-web/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createTokenAuth": () => (/* binding */ createTokenAuth)
/* harmony export */ });
async function auth(token) {
    const tokenType = token.split(/\./).length === 3
        ? "app"
        : /^v\d+\./.test(token)
            ? "installation"
            : "oauth";
    return {
        type: "token",
        token: token,
        tokenType
    };
}

/**
 * Prefix token for usage in the Authorization header
 *
 * @param token OAuth token or JSON Web Token
 */
function withAuthorizationPrefix(token) {
    if (token.split(/\./).length === 3) {
        return `bearer ${token}`;
    }
    return `token ${token}`;
}

async function hook(token, request, route, parameters) {
    const endpoint = request.endpoint.merge(route, parameters);
    endpoint.headers.authorization = withAuthorizationPrefix(token);
    return request(endpoint);
}

const createTokenAuth = function createTokenAuth(token) {
    if (!token) {
        throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
    }
    if (typeof token !== "string") {
        throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
    }
    token = token.replace(/^(token|bearer) +/i, "");
    return Object.assign(auth.bind(null, token), {
        hook: hook.bind(null, token)
    });
};


//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/@octokit/core/dist-web/index.js":
/*!******************************************************!*\
  !*** ./node_modules/@octokit/core/dist-web/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Octokit": () => (/* binding */ Octokit)
/* harmony export */ });
/* harmony import */ var universal_user_agent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! universal-user-agent */ "./node_modules/universal-user-agent/dist-web/index.js");
/* harmony import */ var before_after_hook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! before-after-hook */ "./node_modules/before-after-hook/index.js");
/* harmony import */ var before_after_hook__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(before_after_hook__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _octokit_request__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @octokit/request */ "./node_modules/@octokit/request/dist-web/index.js");
/* harmony import */ var _octokit_graphql__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @octokit/graphql */ "./node_modules/@octokit/graphql/dist-web/index.js");
/* harmony import */ var _octokit_auth_token__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @octokit/auth-token */ "./node_modules/@octokit/auth-token/dist-web/index.js");






const VERSION = "3.4.0";

class Octokit {
    constructor(options = {}) {
        const hook = new before_after_hook__WEBPACK_IMPORTED_MODULE_0__.Collection();
        const requestDefaults = {
            baseUrl: _octokit_request__WEBPACK_IMPORTED_MODULE_1__.request.endpoint.DEFAULTS.baseUrl,
            headers: {},
            request: Object.assign({}, options.request, {
                // @ts-ignore internal usage only, no need to type
                hook: hook.bind(null, "request"),
            }),
            mediaType: {
                previews: [],
                format: "",
            },
        };
        // prepend default user agent with `options.userAgent` if set
        requestDefaults.headers["user-agent"] = [
            options.userAgent,
            `octokit-core.js/${VERSION} ${(0,universal_user_agent__WEBPACK_IMPORTED_MODULE_2__.getUserAgent)()}`,
        ]
            .filter(Boolean)
            .join(" ");
        if (options.baseUrl) {
            requestDefaults.baseUrl = options.baseUrl;
        }
        if (options.previews) {
            requestDefaults.mediaType.previews = options.previews;
        }
        if (options.timeZone) {
            requestDefaults.headers["time-zone"] = options.timeZone;
        }
        this.request = _octokit_request__WEBPACK_IMPORTED_MODULE_1__.request.defaults(requestDefaults);
        this.graphql = (0,_octokit_graphql__WEBPACK_IMPORTED_MODULE_3__.withCustomRequest)(this.request).defaults(requestDefaults);
        this.log = Object.assign({
            debug: () => { },
            info: () => { },
            warn: console.warn.bind(console),
            error: console.error.bind(console),
        }, options.log);
        this.hook = hook;
        // (1) If neither `options.authStrategy` nor `options.auth` are set, the `octokit` instance
        //     is unauthenticated. The `this.auth()` method is a no-op and no request hook is registered.
        // (2) If only `options.auth` is set, use the default token authentication strategy.
        // (3) If `options.authStrategy` is set then use it and pass in `options.auth`. Always pass own request as many strategies accept a custom request instance.
        // TODO: type `options.auth` based on `options.authStrategy`.
        if (!options.authStrategy) {
            if (!options.auth) {
                // (1)
                this.auth = async () => ({
                    type: "unauthenticated",
                });
            }
            else {
                // (2)
                const auth = (0,_octokit_auth_token__WEBPACK_IMPORTED_MODULE_4__.createTokenAuth)(options.auth);
                // @ts-ignore  ¯\_(ツ)_/¯
                hook.wrap("request", auth.hook);
                this.auth = auth;
            }
        }
        else {
            const { authStrategy, ...otherOptions } = options;
            const auth = authStrategy(Object.assign({
                request: this.request,
                log: this.log,
                // we pass the current octokit instance as well as its constructor options
                // to allow for authentication strategies that return a new octokit instance
                // that shares the same internal state as the current one. The original
                // requirement for this was the "event-octokit" authentication strategy
                // of https://github.com/probot/octokit-auth-probot.
                octokit: this,
                octokitOptions: otherOptions,
            }, options.auth));
            // @ts-ignore  ¯\_(ツ)_/¯
            hook.wrap("request", auth.hook);
            this.auth = auth;
        }
        // apply plugins
        // https://stackoverflow.com/a/16345172
        const classConstructor = this.constructor;
        classConstructor.plugins.forEach((plugin) => {
            Object.assign(this, plugin(this, options));
        });
    }
    static defaults(defaults) {
        const OctokitWithDefaults = class extends this {
            constructor(...args) {
                const options = args[0] || {};
                if (typeof defaults === "function") {
                    super(defaults(options));
                    return;
                }
                super(Object.assign({}, defaults, options, options.userAgent && defaults.userAgent
                    ? {
                        userAgent: `${options.userAgent} ${defaults.userAgent}`,
                    }
                    : null));
            }
        };
        return OctokitWithDefaults;
    }
    /**
     * Attach a plugin (or many) to your Octokit instance.
     *
     * @example
     * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
     */
    static plugin(...newPlugins) {
        var _a;
        const currentPlugins = this.plugins;
        const NewOctokit = (_a = class extends this {
            },
            _a.plugins = currentPlugins.concat(newPlugins.filter((plugin) => !currentPlugins.includes(plugin))),
            _a);
        return NewOctokit;
    }
}
Octokit.VERSION = VERSION;
Octokit.plugins = [];


//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/@octokit/endpoint/dist-web/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@octokit/endpoint/dist-web/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "endpoint": () => (/* binding */ endpoint)
/* harmony export */ });
/* harmony import */ var is_plain_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! is-plain-object */ "./node_modules/@octokit/endpoint/node_modules/is-plain-object/dist/is-plain-object.mjs");
/* harmony import */ var universal_user_agent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! universal-user-agent */ "./node_modules/universal-user-agent/dist-web/index.js");



function lowercaseKeys(object) {
    if (!object) {
        return {};
    }
    return Object.keys(object).reduce((newObj, key) => {
        newObj[key.toLowerCase()] = object[key];
        return newObj;
    }, {});
}

function mergeDeep(defaults, options) {
    const result = Object.assign({}, defaults);
    Object.keys(options).forEach((key) => {
        if ((0,is_plain_object__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(options[key])) {
            if (!(key in defaults))
                Object.assign(result, { [key]: options[key] });
            else
                result[key] = mergeDeep(defaults[key], options[key]);
        }
        else {
            Object.assign(result, { [key]: options[key] });
        }
    });
    return result;
}

function removeUndefinedProperties(obj) {
    for (const key in obj) {
        if (obj[key] === undefined) {
            delete obj[key];
        }
    }
    return obj;
}

function merge(defaults, route, options) {
    if (typeof route === "string") {
        let [method, url] = route.split(" ");
        options = Object.assign(url ? { method, url } : { url: method }, options);
    }
    else {
        options = Object.assign({}, route);
    }
    // lowercase header names before merging with defaults to avoid duplicates
    options.headers = lowercaseKeys(options.headers);
    // remove properties with undefined values before merging
    removeUndefinedProperties(options);
    removeUndefinedProperties(options.headers);
    const mergedOptions = mergeDeep(defaults || {}, options);
    // mediaType.previews arrays are merged, instead of overwritten
    if (defaults && defaults.mediaType.previews.length) {
        mergedOptions.mediaType.previews = defaults.mediaType.previews
            .filter((preview) => !mergedOptions.mediaType.previews.includes(preview))
            .concat(mergedOptions.mediaType.previews);
    }
    mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map((preview) => preview.replace(/-preview/, ""));
    return mergedOptions;
}

function addQueryParameters(url, parameters) {
    const separator = /\?/.test(url) ? "&" : "?";
    const names = Object.keys(parameters);
    if (names.length === 0) {
        return url;
    }
    return (url +
        separator +
        names
            .map((name) => {
            if (name === "q") {
                return ("q=" + parameters.q.split("+").map(encodeURIComponent).join("+"));
            }
            return `${name}=${encodeURIComponent(parameters[name])}`;
        })
            .join("&"));
}

const urlVariableRegex = /\{[^}]+\}/g;
function removeNonChars(variableName) {
    return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}
function extractUrlVariableNames(url) {
    const matches = url.match(urlVariableRegex);
    if (!matches) {
        return [];
    }
    return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}

function omit(object, keysToOmit) {
    return Object.keys(object)
        .filter((option) => !keysToOmit.includes(option))
        .reduce((obj, key) => {
        obj[key] = object[key];
        return obj;
    }, {});
}

// Based on https://github.com/bramstein/url-template, licensed under BSD
// TODO: create separate package.
//
// Copyright (c) 2012-2014, Bram Stein
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//  1. Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//  3. The name of the author may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
/* istanbul ignore file */
function encodeReserved(str) {
    return str
        .split(/(%[0-9A-Fa-f]{2})/g)
        .map(function (part) {
        if (!/%[0-9A-Fa-f]/.test(part)) {
            part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
        }
        return part;
    })
        .join("");
}
function encodeUnreserved(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
}
function encodeValue(operator, value, key) {
    value =
        operator === "+" || operator === "#"
            ? encodeReserved(value)
            : encodeUnreserved(value);
    if (key) {
        return encodeUnreserved(key) + "=" + value;
    }
    else {
        return value;
    }
}
function isDefined(value) {
    return value !== undefined && value !== null;
}
function isKeyOperator(operator) {
    return operator === ";" || operator === "&" || operator === "?";
}
function getValues(context, operator, key, modifier) {
    var value = context[key], result = [];
    if (isDefined(value) && value !== "") {
        if (typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean") {
            value = value.toString();
            if (modifier && modifier !== "*") {
                value = value.substring(0, parseInt(modifier, 10));
            }
            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
        }
        else {
            if (modifier === "*") {
                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
                    });
                }
                else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            result.push(encodeValue(operator, value[k], k));
                        }
                    });
                }
            }
            else {
                const tmp = [];
                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        tmp.push(encodeValue(operator, value));
                    });
                }
                else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            tmp.push(encodeUnreserved(k));
                            tmp.push(encodeValue(operator, value[k].toString()));
                        }
                    });
                }
                if (isKeyOperator(operator)) {
                    result.push(encodeUnreserved(key) + "=" + tmp.join(","));
                }
                else if (tmp.length !== 0) {
                    result.push(tmp.join(","));
                }
            }
        }
    }
    else {
        if (operator === ";") {
            if (isDefined(value)) {
                result.push(encodeUnreserved(key));
            }
        }
        else if (value === "" && (operator === "&" || operator === "?")) {
            result.push(encodeUnreserved(key) + "=");
        }
        else if (value === "") {
            result.push("");
        }
    }
    return result;
}
function parseUrl(template) {
    return {
        expand: expand.bind(null, template),
    };
}
function expand(template, context) {
    var operators = ["+", "#", ".", "/", ";", "?", "&"];
    return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
        if (expression) {
            let operator = "";
            const values = [];
            if (operators.indexOf(expression.charAt(0)) !== -1) {
                operator = expression.charAt(0);
                expression = expression.substr(1);
            }
            expression.split(/,/g).forEach(function (variable) {
                var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
                values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
            });
            if (operator && operator !== "+") {
                var separator = ",";
                if (operator === "?") {
                    separator = "&";
                }
                else if (operator !== "#") {
                    separator = operator;
                }
                return (values.length !== 0 ? operator : "") + values.join(separator);
            }
            else {
                return values.join(",");
            }
        }
        else {
            return encodeReserved(literal);
        }
    });
}

function parse(options) {
    // https://fetch.spec.whatwg.org/#methods
    let method = options.method.toUpperCase();
    // replace :varname with {varname} to make it RFC 6570 compatible
    let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
    let headers = Object.assign({}, options.headers);
    let body;
    let parameters = omit(options, [
        "method",
        "baseUrl",
        "url",
        "headers",
        "request",
        "mediaType",
    ]);
    // extract variable names from URL to calculate remaining variables later
    const urlVariableNames = extractUrlVariableNames(url);
    url = parseUrl(url).expand(parameters);
    if (!/^http/.test(url)) {
        url = options.baseUrl + url;
    }
    const omittedParameters = Object.keys(options)
        .filter((option) => urlVariableNames.includes(option))
        .concat("baseUrl");
    const remainingParameters = omit(parameters, omittedParameters);
    const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);
    if (!isBinaryRequest) {
        if (options.mediaType.format) {
            // e.g. application/vnd.github.v3+json => application/vnd.github.v3.raw
            headers.accept = headers.accept
                .split(/,/)
                .map((preview) => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`))
                .join(",");
        }
        if (options.mediaType.previews.length) {
            const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
            headers.accept = previewsFromAcceptHeader
                .concat(options.mediaType.previews)
                .map((preview) => {
                const format = options.mediaType.format
                    ? `.${options.mediaType.format}`
                    : "+json";
                return `application/vnd.github.${preview}-preview${format}`;
            })
                .join(",");
        }
    }
    // for GET/HEAD requests, set URL query parameters from remaining parameters
    // for PATCH/POST/PUT/DELETE requests, set request body from remaining parameters
    if (["GET", "HEAD"].includes(method)) {
        url = addQueryParameters(url, remainingParameters);
    }
    else {
        if ("data" in remainingParameters) {
            body = remainingParameters.data;
        }
        else {
            if (Object.keys(remainingParameters).length) {
                body = remainingParameters;
            }
            else {
                headers["content-length"] = 0;
            }
        }
    }
    // default content-type for JSON if body is set
    if (!headers["content-type"] && typeof body !== "undefined") {
        headers["content-type"] = "application/json; charset=utf-8";
    }
    // GitHub expects 'content-length: 0' header for PUT/PATCH requests without body.
    // fetch does not allow to set `content-length` header, but we can set body to an empty string
    if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
        body = "";
    }
    // Only return body/request keys if present
    return Object.assign({ method, url, headers }, typeof body !== "undefined" ? { body } : null, options.request ? { request: options.request } : null);
}

function endpointWithDefaults(defaults, route, options) {
    return parse(merge(defaults, route, options));
}

function withDefaults(oldDefaults, newDefaults) {
    const DEFAULTS = merge(oldDefaults, newDefaults);
    const endpoint = endpointWithDefaults.bind(null, DEFAULTS);
    return Object.assign(endpoint, {
        DEFAULTS,
        defaults: withDefaults.bind(null, DEFAULTS),
        merge: merge.bind(null, DEFAULTS),
        parse,
    });
}

const VERSION = "6.0.11";

const userAgent = `octokit-endpoint.js/${VERSION} ${(0,universal_user_agent__WEBPACK_IMPORTED_MODULE_1__.getUserAgent)()}`;
// DEFAULTS has all properties set that EndpointOptions has, except url.
// So we use RequestParameters and add method as additional required property.
const DEFAULTS = {
    method: "GET",
    baseUrl: "https://api.github.com",
    headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
    },
    mediaType: {
        format: "",
        previews: [],
    },
};

const endpoint = withDefaults(null, DEFAULTS);


//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/@octokit/endpoint/node_modules/is-plain-object/dist/is-plain-object.mjs":
/*!**********************************************************************************************!*\
  !*** ./node_modules/@octokit/endpoint/node_modules/is-plain-object/dist/is-plain-object.mjs ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isPlainObject": () => (/* binding */ isPlainObject)
/* harmony export */ });
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}




/***/ }),

/***/ "./node_modules/@octokit/graphql/dist-web/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/@octokit/graphql/dist-web/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "graphql": () => (/* binding */ graphql$1),
/* harmony export */   "withCustomRequest": () => (/* binding */ withCustomRequest)
/* harmony export */ });
/* harmony import */ var _octokit_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @octokit/request */ "./node_modules/@octokit/request/dist-web/index.js");
/* harmony import */ var universal_user_agent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! universal-user-agent */ "./node_modules/universal-user-agent/dist-web/index.js");



const VERSION = "4.6.1";

class GraphqlError extends Error {
    constructor(request, response) {
        const message = response.data.errors[0].message;
        super(message);
        Object.assign(this, response.data);
        Object.assign(this, { headers: response.headers });
        this.name = "GraphqlError";
        this.request = request;
        // Maintains proper stack trace (only available on V8)
        /* istanbul ignore next */
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

const NON_VARIABLE_OPTIONS = [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "query",
    "mediaType",
];
const FORBIDDEN_VARIABLE_OPTIONS = ["query", "method", "url"];
const GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
function graphql(request, query, options) {
    if (options) {
        if (typeof query === "string" && "query" in options) {
            return Promise.reject(new Error(`[@octokit/graphql] "query" cannot be used as variable name`));
        }
        for (const key in options) {
            if (!FORBIDDEN_VARIABLE_OPTIONS.includes(key))
                continue;
            return Promise.reject(new Error(`[@octokit/graphql] "${key}" cannot be used as variable name`));
        }
    }
    const parsedOptions = typeof query === "string" ? Object.assign({ query }, options) : query;
    const requestOptions = Object.keys(parsedOptions).reduce((result, key) => {
        if (NON_VARIABLE_OPTIONS.includes(key)) {
            result[key] = parsedOptions[key];
            return result;
        }
        if (!result.variables) {
            result.variables = {};
        }
        result.variables[key] = parsedOptions[key];
        return result;
    }, {});
    // workaround for GitHub Enterprise baseUrl set with /api/v3 suffix
    // https://github.com/octokit/auth-app.js/issues/111#issuecomment-657610451
    const baseUrl = parsedOptions.baseUrl || request.endpoint.DEFAULTS.baseUrl;
    if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
        requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
    }
    return request(requestOptions).then((response) => {
        if (response.data.errors) {
            const headers = {};
            for (const key of Object.keys(response.headers)) {
                headers[key] = response.headers[key];
            }
            throw new GraphqlError(requestOptions, {
                headers,
                data: response.data,
            });
        }
        return response.data.data;
    });
}

function withDefaults(request$1, newDefaults) {
    const newRequest = request$1.defaults(newDefaults);
    const newApi = (query, options) => {
        return graphql(newRequest, query, options);
    };
    return Object.assign(newApi, {
        defaults: withDefaults.bind(null, newRequest),
        endpoint: _octokit_request__WEBPACK_IMPORTED_MODULE_0__.request.endpoint,
    });
}

const graphql$1 = withDefaults(_octokit_request__WEBPACK_IMPORTED_MODULE_0__.request, {
    headers: {
        "user-agent": `octokit-graphql.js/${VERSION} ${(0,universal_user_agent__WEBPACK_IMPORTED_MODULE_1__.getUserAgent)()}`,
    },
    method: "POST",
    url: "/graphql",
});
function withCustomRequest(customRequest) {
    return withDefaults(customRequest, {
        method: "POST",
        url: "/graphql",
    });
}


//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/@octokit/request-error/dist-web/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/@octokit/request-error/dist-web/index.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RequestError": () => (/* binding */ RequestError)
/* harmony export */ });
/* harmony import */ var deprecation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! deprecation */ "./node_modules/deprecation/dist-web/index.js");
/* harmony import */ var once__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! once */ "./node_modules/once/once.js");
/* harmony import */ var once__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(once__WEBPACK_IMPORTED_MODULE_0__);



const logOnce = once__WEBPACK_IMPORTED_MODULE_0___default()((deprecation) => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */
class RequestError extends Error {
    constructor(message, statusCode, options) {
        super(message);
        // Maintains proper stack trace (only available on V8)
        /* istanbul ignore next */
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
        this.name = "HttpError";
        this.status = statusCode;
        Object.defineProperty(this, "code", {
            get() {
                logOnce(new deprecation__WEBPACK_IMPORTED_MODULE_1__.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
                return statusCode;
            },
        });
        this.headers = options.headers || {};
        // redact request credentials without mutating original request options
        const requestCopy = Object.assign({}, options.request);
        if (options.request.headers.authorization) {
            requestCopy.headers = Object.assign({}, options.request.headers, {
                authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]"),
            });
        }
        requestCopy.url = requestCopy.url
            // client_id & client_secret can be passed as URL query parameters to increase rate limit
            // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
            .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]")
            // OAuth tokens can be passed as URL query parameters, although it is not recommended
            // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
            .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
        this.request = requestCopy;
    }
}


//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/@octokit/request/dist-web/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/@octokit/request/dist-web/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "request": () => (/* binding */ request)
/* harmony export */ });
/* harmony import */ var _octokit_endpoint__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @octokit/endpoint */ "./node_modules/@octokit/endpoint/dist-web/index.js");
/* harmony import */ var universal_user_agent__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! universal-user-agent */ "./node_modules/universal-user-agent/dist-web/index.js");
/* harmony import */ var is_plain_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! is-plain-object */ "./node_modules/@octokit/request/node_modules/is-plain-object/dist/is-plain-object.mjs");
/* harmony import */ var node_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node-fetch */ "./node_modules/node-fetch/browser.js");
/* harmony import */ var node_fetch__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_fetch__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _octokit_request_error__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @octokit/request-error */ "./node_modules/@octokit/request-error/dist-web/index.js");






const VERSION = "5.4.15";

function getBufferResponse(response) {
    return response.arrayBuffer();
}

function fetchWrapper(requestOptions) {
    if ((0,is_plain_object__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(requestOptions.body) ||
        Array.isArray(requestOptions.body)) {
        requestOptions.body = JSON.stringify(requestOptions.body);
    }
    let headers = {};
    let status;
    let url;
    const fetch = (requestOptions.request && requestOptions.request.fetch) || (node_fetch__WEBPACK_IMPORTED_MODULE_1___default());
    return fetch(requestOptions.url, Object.assign({
        method: requestOptions.method,
        body: requestOptions.body,
        headers: requestOptions.headers,
        redirect: requestOptions.redirect,
    }, 
    // `requestOptions.request.agent` type is incompatible
    // see https://github.com/octokit/types.ts/pull/264
    requestOptions.request))
        .then((response) => {
        url = response.url;
        status = response.status;
        for (const keyAndValue of response.headers) {
            headers[keyAndValue[0]] = keyAndValue[1];
        }
        if (status === 204 || status === 205) {
            return;
        }
        // GitHub API returns 200 for HEAD requests
        if (requestOptions.method === "HEAD") {
            if (status < 400) {
                return;
            }
            throw new _octokit_request_error__WEBPACK_IMPORTED_MODULE_2__.RequestError(response.statusText, status, {
                headers,
                request: requestOptions,
            });
        }
        if (status === 304) {
            throw new _octokit_request_error__WEBPACK_IMPORTED_MODULE_2__.RequestError("Not modified", status, {
                headers,
                request: requestOptions,
            });
        }
        if (status >= 400) {
            return response
                .text()
                .then((message) => {
                const error = new _octokit_request_error__WEBPACK_IMPORTED_MODULE_2__.RequestError(message, status, {
                    headers,
                    request: requestOptions,
                });
                try {
                    let responseBody = JSON.parse(error.message);
                    Object.assign(error, responseBody);
                    let errors = responseBody.errors;
                    // Assumption `errors` would always be in Array format
                    error.message =
                        error.message + ": " + errors.map(JSON.stringify).join(", ");
                }
                catch (e) {
                    // ignore, see octokit/rest.js#684
                }
                throw error;
            });
        }
        const contentType = response.headers.get("content-type");
        if (/application\/json/.test(contentType)) {
            return response.json();
        }
        if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
            return response.text();
        }
        return getBufferResponse(response);
    })
        .then((data) => {
        return {
            status,
            url,
            headers,
            data,
        };
    })
        .catch((error) => {
        if (error instanceof _octokit_request_error__WEBPACK_IMPORTED_MODULE_2__.RequestError) {
            throw error;
        }
        throw new _octokit_request_error__WEBPACK_IMPORTED_MODULE_2__.RequestError(error.message, 500, {
            headers,
            request: requestOptions,
        });
    });
}

function withDefaults(oldEndpoint, newDefaults) {
    const endpoint = oldEndpoint.defaults(newDefaults);
    const newApi = function (route, parameters) {
        const endpointOptions = endpoint.merge(route, parameters);
        if (!endpointOptions.request || !endpointOptions.request.hook) {
            return fetchWrapper(endpoint.parse(endpointOptions));
        }
        const request = (route, parameters) => {
            return fetchWrapper(endpoint.parse(endpoint.merge(route, parameters)));
        };
        Object.assign(request, {
            endpoint,
            defaults: withDefaults.bind(null, endpoint),
        });
        return endpointOptions.request.hook(request, endpointOptions);
    };
    return Object.assign(newApi, {
        endpoint,
        defaults: withDefaults.bind(null, endpoint),
    });
}

const request = withDefaults(_octokit_endpoint__WEBPACK_IMPORTED_MODULE_3__.endpoint, {
    headers: {
        "user-agent": `octokit-request.js/${VERSION} ${(0,universal_user_agent__WEBPACK_IMPORTED_MODULE_4__.getUserAgent)()}`,
    },
});


//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/@octokit/request/node_modules/is-plain-object/dist/is-plain-object.mjs":
/*!*********************************************************************************************!*\
  !*** ./node_modules/@octokit/request/node_modules/is-plain-object/dist/is-plain-object.mjs ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isPlainObject": () => (/* binding */ isPlainObject)
/* harmony export */ });
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}




/***/ }),

/***/ "./node_modules/before-after-hook/index.js":
/*!*************************************************!*\
  !*** ./node_modules/before-after-hook/index.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var register = __webpack_require__(/*! ./lib/register */ "./node_modules/before-after-hook/lib/register.js")
var addHook = __webpack_require__(/*! ./lib/add */ "./node_modules/before-after-hook/lib/add.js")
var removeHook = __webpack_require__(/*! ./lib/remove */ "./node_modules/before-after-hook/lib/remove.js")

// bind with array of arguments: https://stackoverflow.com/a/21792913
var bind = Function.bind
var bindable = bind.bind(bind)

function bindApi (hook, state, name) {
  var removeHookRef = bindable(removeHook, null).apply(null, name ? [state, name] : [state])
  hook.api = { remove: removeHookRef }
  hook.remove = removeHookRef

  ;['before', 'error', 'after', 'wrap'].forEach(function (kind) {
    var args = name ? [state, kind, name] : [state, kind]
    hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args)
  })
}

function HookSingular () {
  var singularHookName = 'h'
  var singularHookState = {
    registry: {}
  }
  var singularHook = register.bind(null, singularHookState, singularHookName)
  bindApi(singularHook, singularHookState, singularHookName)
  return singularHook
}

function HookCollection () {
  var state = {
    registry: {}
  }

  var hook = register.bind(null, state)
  bindApi(hook, state)

  return hook
}

var collectionHookDeprecationMessageDisplayed = false
function Hook () {
  if (!collectionHookDeprecationMessageDisplayed) {
    console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4')
    collectionHookDeprecationMessageDisplayed = true
  }
  return HookCollection()
}

Hook.Singular = HookSingular.bind()
Hook.Collection = HookCollection.bind()

module.exports = Hook
// expose constructors as a named property for TypeScript
module.exports.Hook = Hook
module.exports.Singular = Hook.Singular
module.exports.Collection = Hook.Collection


/***/ }),

/***/ "./node_modules/before-after-hook/lib/add.js":
/*!***************************************************!*\
  !*** ./node_modules/before-after-hook/lib/add.js ***!
  \***************************************************/
/***/ ((module) => {

module.exports = addHook;

function addHook(state, kind, name, hook) {
  var orig = hook;
  if (!state.registry[name]) {
    state.registry[name] = [];
  }

  if (kind === "before") {
    hook = function (method, options) {
      return Promise.resolve()
        .then(orig.bind(null, options))
        .then(method.bind(null, options));
    };
  }

  if (kind === "after") {
    hook = function (method, options) {
      var result;
      return Promise.resolve()
        .then(method.bind(null, options))
        .then(function (result_) {
          result = result_;
          return orig(result, options);
        })
        .then(function () {
          return result;
        });
    };
  }

  if (kind === "error") {
    hook = function (method, options) {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch(function (error) {
          return orig(error, options);
        });
    };
  }

  state.registry[name].push({
    hook: hook,
    orig: orig,
  });
}


/***/ }),

/***/ "./node_modules/before-after-hook/lib/register.js":
/*!********************************************************!*\
  !*** ./node_modules/before-after-hook/lib/register.js ***!
  \********************************************************/
/***/ ((module) => {

module.exports = register;

function register(state, name, method, options) {
  if (typeof method !== "function") {
    throw new Error("method for before hook must be a function");
  }

  if (!options) {
    options = {};
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce(function (callback, name) {
      return register.bind(null, state, name, callback, options);
    }, method)();
  }

  return Promise.resolve().then(function () {
    if (!state.registry[name]) {
      return method(options);
    }

    return state.registry[name].reduce(function (method, registered) {
      return registered.hook.bind(null, method, options);
    }, method)();
  });
}


/***/ }),

/***/ "./node_modules/before-after-hook/lib/remove.js":
/*!******************************************************!*\
  !*** ./node_modules/before-after-hook/lib/remove.js ***!
  \******************************************************/
/***/ ((module) => {

module.exports = removeHook;

function removeHook(state, name, method) {
  if (!state.registry[name]) {
    return;
  }

  var index = state.registry[name]
    .map(function (registered) {
      return registered.orig;
    })
    .indexOf(method);

  if (index === -1) {
    return;
  }

  state.registry[name].splice(index, 1);
}


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/style.css":
/*!********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/style.css ***!
  \********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: 'Roboto', sans-serif;\n}\n\nh1 {\n  font-size: 2.3rem;\n  font-weight: 700;\n}\n\n.container {\n  width: 90%;\n  margin: 0 auto;\n}\n\n.row {\n  display: flex;\n}\n\n.row-between {\n  justify-content: space-between;\n}\n\n.userlist-section {\n}\n\n.userlist-section__header {\n  padding: 1.3em 0;\n}\n\n.userlist-section__nav {\n}\n\n.userlist-section__search-tab {\n}\n\n.tab {\n  padding-bottom: 0.4em;\n  width: 100%;\n  font-size: 1.5rem;\n  text-transform: uppercase;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.tab--active {\n  border-bottom: 5px solid #1980fa;\n}\n\n.userlist-section__search-bar {\n  border-top: 1px solid black;\n  border-bottom: 1px solid black;\n\n  justify-content: space-between;\n  align-items: center;\n}\n\n.userlist-section__search-input {\n  border: none;\n  padding: 0.5em 0;\n  font-size: 1.5rem;\n  width: 75%;\n}\n\n.userlist-section__search-btn {\n  border: none;\n  background: none;\n}\n\n.userlist-section__search-icon {\n  /* background: green; */\n}\n\n/************* \nmain\n**************/\n\n.users {\n}\n\n.users__row {\n}\n\n.users__row-title {\n  color: #0f0f0f;\n}\n\n.user {\n  border-bottom: 1px solid black;\n  padding: 0.3em 0;\n\n  justify-content: space-between;\n  align-items: center;\n}\n\n.user__img {\n  border-radius: 100px;\n  height: 60px;\n  width: 60px;\n}\n\n.user__name {\n  font-size: 1.25rem;\n  color: green;\n}\n\n.user__favorite {\n  background: none;\n  border: none;\n  outline: none;\n}\n\n.star-icon {\n  fill: #fff;\n  stroke-width: 1;\n  stroke: #000;\n}\n\n.star-icon--active {\n  fill: #1980fa;\n}\n", "",{"version":3,"sources":["webpack://./src/styles/style.css"],"names":[],"mappings":"AAAA;EACE,SAAS;EACT,UAAU;EACV,sBAAsB;AACxB;;AAEA;EACE,iCAAiC;AACnC;;AAEA;EACE,iBAAiB;EACjB,gBAAgB;AAClB;;AAEA;EACE,UAAU;EACV,cAAc;AAChB;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,8BAA8B;AAChC;;AAEA;AACA;;AAEA;EACE,gBAAgB;AAClB;;AAEA;AACA;;AAEA;AACA;;AAEA;EACE,qBAAqB;EACrB,WAAW;EACX,iBAAiB;EACjB,yBAAyB;EACzB,aAAa;EACb,uBAAuB;EACvB,mBAAmB;AACrB;;AAEA;EACE,gCAAgC;AAClC;;AAEA;EACE,2BAA2B;EAC3B,8BAA8B;;EAE9B,8BAA8B;EAC9B,mBAAmB;AACrB;;AAEA;EACE,YAAY;EACZ,gBAAgB;EAChB,iBAAiB;EACjB,UAAU;AACZ;;AAEA;EACE,YAAY;EACZ,gBAAgB;AAClB;;AAEA;EACE,uBAAuB;AACzB;;AAEA;;cAEc;;AAEd;AACA;;AAEA;AACA;;AAEA;EACE,cAAc;AAChB;;AAEA;EACE,8BAA8B;EAC9B,gBAAgB;;EAEhB,8BAA8B;EAC9B,mBAAmB;AACrB;;AAEA;EACE,oBAAoB;EACpB,YAAY;EACZ,WAAW;AACb;;AAEA;EACE,kBAAkB;EAClB,YAAY;AACd;;AAEA;EACE,gBAAgB;EAChB,YAAY;EACZ,aAAa;AACf;;AAEA;EACE,UAAU;EACV,eAAe;EACf,YAAY;AACd;;AAEA;EACE,aAAa;AACf","sourcesContent":["* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: 'Roboto', sans-serif;\n}\n\nh1 {\n  font-size: 2.3rem;\n  font-weight: 700;\n}\n\n.container {\n  width: 90%;\n  margin: 0 auto;\n}\n\n.row {\n  display: flex;\n}\n\n.row-between {\n  justify-content: space-between;\n}\n\n.userlist-section {\n}\n\n.userlist-section__header {\n  padding: 1.3em 0;\n}\n\n.userlist-section__nav {\n}\n\n.userlist-section__search-tab {\n}\n\n.tab {\n  padding-bottom: 0.4em;\n  width: 100%;\n  font-size: 1.5rem;\n  text-transform: uppercase;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.tab--active {\n  border-bottom: 5px solid #1980fa;\n}\n\n.userlist-section__search-bar {\n  border-top: 1px solid black;\n  border-bottom: 1px solid black;\n\n  justify-content: space-between;\n  align-items: center;\n}\n\n.userlist-section__search-input {\n  border: none;\n  padding: 0.5em 0;\n  font-size: 1.5rem;\n  width: 75%;\n}\n\n.userlist-section__search-btn {\n  border: none;\n  background: none;\n}\n\n.userlist-section__search-icon {\n  /* background: green; */\n}\n\n/************* \nmain\n**************/\n\n.users {\n}\n\n.users__row {\n}\n\n.users__row-title {\n  color: #0f0f0f;\n}\n\n.user {\n  border-bottom: 1px solid black;\n  padding: 0.3em 0;\n\n  justify-content: space-between;\n  align-items: center;\n}\n\n.user__img {\n  border-radius: 100px;\n  height: 60px;\n  width: 60px;\n}\n\n.user__name {\n  font-size: 1.25rem;\n  color: green;\n}\n\n.user__favorite {\n  background: none;\n  border: none;\n  outline: none;\n}\n\n.star-icon {\n  fill: #fff;\n  stroke-width: 1;\n  stroke: #000;\n}\n\n.star-icon--active {\n  fill: #1980fa;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js":
/*!************************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/cssWithMappingToString.js ***!
  \************************************************************************/
/***/ ((module) => {

"use strict";


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (typeof btoa === "function") {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/deprecation/dist-web/index.js":
/*!****************************************************!*\
  !*** ./node_modules/deprecation/dist-web/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Deprecation": () => (/* binding */ Deprecation)
/* harmony export */ });
class Deprecation extends Error {
  constructor(message) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'Deprecation';
  }

}




/***/ }),

/***/ "./node_modules/node-fetch/browser.js":
/*!********************************************!*\
  !*** ./node_modules/node-fetch/browser.js ***!
  \********************************************/
/***/ ((module, exports) => {

"use strict";


// ref: https://github.com/tc39/proposal-global
var getGlobal = function () {
	// the only reliable means to get the global object is
	// `Function('return this')()`
	// However, this causes CSP violations in Chrome apps.
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }
	throw new Error('unable to locate global object');
}

var global = getGlobal();

module.exports = exports = global.fetch;

// Needed for TypeScript and Webpack.
if (global.fetch) {
	exports.default = global.fetch.bind(global);
}

exports.Headers = global.Headers;
exports.Request = global.Request;
exports.Response = global.Response;

/***/ }),

/***/ "./node_modules/once/once.js":
/*!***********************************!*\
  !*** ./node_modules/once/once.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wrappy = __webpack_require__(/*! wrappy */ "./node_modules/wrappy/wrappy.js")
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ "./src/styles/style.css":
/*!******************************!*\
  !*** ./src/styles/style.css ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/style.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/universal-user-agent/dist-web/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/universal-user-agent/dist-web/index.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getUserAgent": () => (/* binding */ getUserAgent)
/* harmony export */ });
function getUserAgent() {
    if (typeof navigator === "object" && "userAgent" in navigator) {
        return navigator.userAgent;
    }
    if (typeof process === "object" && "version" in process) {
        return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
    }
    return "<environment undetectable>";
}


//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/wrappy/wrappy.js":
/*!***************************************!*\
  !*** ./node_modules/wrappy/wrappy.js ***!
  \***************************************/
/***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ "./src/components/Favorite.js":
/*!************************************!*\
  !*** ./src/components/Favorite.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_sortUserByAlphabet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/sortUserByAlphabet */ "./src/helpers/sortUserByAlphabet.js");


function LocalStorage() {
  const storeUserData = (userData) => {
    localStorage.setItem('users', JSON.stringify(userData));
  };

  const getUserData = () => {
    const favoriteUsers = JSON.parse(localStorage.getItem('users'));

    if (favoriteUsers === null) {
      console.log(null);
      return [];
    }

    return (0,_helpers_sortUserByAlphabet__WEBPACK_IMPORTED_MODULE_0__.default)(favoriteUsers);
  };

  const removeUser = (userName) => {
    const newUserData = getUserData().filter((user) => user.login !== userName);
    storeUserData(newUserData);
  };

  const addUser = (userData) => {
    const newUserData = [...getUserData(), userData];
    storeUserData(newUserData);
  };

  return {
    removeUser,
    addUser,
    getUserData,
  };
}

const Favorites = LocalStorage();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Favorites);


/***/ }),

/***/ "./src/components/addHeader.js":
/*!*************************************!*\
  !*** ./src/components/addHeader.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_cretateFragment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/cretateFragment */ "./src/helpers/cretateFragment.js");
/* harmony import */ var _Favorite__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Favorite */ "./src/components/Favorite.js");



function addHeader() {
  const userListSection = document.querySelector('.userlist-section');

  const UI = (0,_helpers_cretateFragment__WEBPACK_IMPORTED_MODULE_0__.default)(`
    <header class="userlist-section__header container">
      <h1 class="userlist-section__title">Github Stars</h1>
      <button class="logStorage">log users in favorite</button>
      <button class="clearStorage">clear favorite storage</button>
    </header>
  `);

  UI.querySelector('.logStorage').addEventListener('click', () => {
    console.log(_Favorite__WEBPACK_IMPORTED_MODULE_1__.default.getUserData());
  });
  UI.querySelector('.clearStorage').addEventListener('click', () => {
    localStorage.clear();
  });

  return userListSection.appendChild(UI);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (addHeader);


/***/ }),

/***/ "./src/components/addMain.js":
/*!***********************************!*\
  !*** ./src/components/addMain.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createUsersRow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createUsersRow */ "./src/components/createUsersRow.js");


let newCurrentSearchResult;
let newOnFavoriteHandler;

function addMain(currentSearchResult, onFavoriteHandler) {
  const userListSection = document.querySelector('.userlist-section');

  const users = document.createElement('main');
  users.className = 'users';

  if (currentSearchResult !== null) {
    const userGroups = groupByFirstLetter(currentSearchResult);
    for (const firstLetter in userGroups) {
      const usersRow = (0,_createUsersRow__WEBPACK_IMPORTED_MODULE_0__.default)(
        userGroups[firstLetter],
        onFavoriteHandler
      );
      users.appendChild(usersRow);
    }
  }

  // DEVELOPMENT
  newCurrentSearchResult = currentSearchResult;
  newOnFavoriteHandler = onFavoriteHandler;

  return userListSection.appendChild(users);
}

if (false) {}

function groupByFirstLetter(objectArray) {
  return objectArray.reduce((acc, obj) => {
    // obj.name의 첫번째 글자가 키로 존재하는지 확인
    const firstLetter = obj.login[0].toLowerCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }

    acc[firstLetter].push(obj);
    return acc;
  }, {});
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (addMain);


/***/ }),

/***/ "./src/components/addNav.js":
/*!**********************************!*\
  !*** ./src/components/addNav.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createSearchTab__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createSearchTab */ "./src/components/createSearchTab.js");
/* harmony import */ var _createSearchBar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./createSearchBar */ "./src/components/createSearchBar.js");



let newSearchInputValue;
let newOnSearchChangeHandler;
let newOnSearchHandler;
let newTab;
let newOnTabChange;

function addNav(
  tab,
  onTabChange,
  searchInputValue,
  onSearchChangeHandler,
  onSearchHandler
) {
  const userListSection = document.querySelector('.userlist-section');

  const nav = document.createElement('nav');
  nav.className = 'userlist-section__nav';

  nav.appendChild((0,_createSearchTab__WEBPACK_IMPORTED_MODULE_0__.default)(tab, onTabChange));
  nav.appendChild(
    (0,_createSearchBar__WEBPACK_IMPORTED_MODULE_1__.default)(searchInputValue, onSearchChangeHandler, onSearchHandler)
  );

  newTab = tab;
  newOnTabChange = onTabChange;
  newSearchInputValue = searchInputValue;
  newOnSearchChangeHandler = onSearchChangeHandler;
  newOnSearchHandler = onSearchHandler;

  return userListSection.appendChild(nav);
}

if (false) {}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (addNav);


/***/ }),

/***/ "./src/components/app.js":
/*!*******************************!*\
  !*** ./src/components/app.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _addHeader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./addHeader */ "./src/components/addHeader.js");
/* harmony import */ var _addNav__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./addNav */ "./src/components/addNav.js");
/* harmony import */ var _addMain__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./addMain */ "./src/components/addMain.js");
/* harmony import */ var _styles_style_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/style.css */ "./src/styles/style.css");
/* harmony import */ var _clearPage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./clearPage */ "./src/components/clearPage.js");
/* harmony import */ var _Favorite__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Favorite */ "./src/components/Favorite.js");
/* harmony import */ var _helpers_getUserList__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../helpers/getUserList */ "./src/helpers/getUserList.js");








function App() {
  let state = {
    searchInput: '',
    currentTab: 'api',
    favorites: _Favorite__WEBPACK_IMPORTED_MODULE_5__.default.getUserData(),
    userSearchResults: null,
  };

  function setState(newState, shouldRender = true) {
    state = {
      ...newState,
    };

    if (shouldRender) {
      console.log(state);
      return render(state);
    }
  }

  function onSearchChangeHandler(e) {
    setState(
      {
        ...state,
        searchInput: e.target.value,
      },
      false
    );
  }

  function onTabChange(e) {
    if (e.target.classList.contains('tab-local')) {
      return setState({
        ...state,
        currentTab: 'local',
        userSearchResults: null,
        searchInput: '',
      });
    }

    return setState({
      ...state,
      currentTab: 'api',
      searchInput: '',
      userSearchResults: null,
    });
  }

  async function onSearchHandler(e) {
    e.preventDefault();
    const { currentTab, searchInput, favorites } = state;

    if (state.currentTab === 'api') {
      const userToSearch = searchInput;
      const newUserList = await (0,_helpers_getUserList__WEBPACK_IMPORTED_MODULE_6__.default)(userToSearch, favorites);

      return setState({
        ...state,
        userSearchResults: newUserList,
      });
    }

    if (currentTab === 'local') {
      const userToSearch = searchInput;
      const newSearchList = favorites.filter((user) => {
        const lowerUserToSearch = userToSearch.toLowerCase();
        const lowerUserName = user.login.toLowerCase();
        if (lowerUserName.includes(lowerUserToSearch)) {
          return user;
        }
      });

      return setState({
        ...state,
        userSearchResults: newSearchList,
      });
    }
  }

  function onFavoriteHandler(userInfo) {
    const newSearchResult = state.userSearchResults.map((user) => {
      return {
        login: user.login,
        avatar_url: user.avatar_url,
        is_favorite: user.is_favorite,
      };
    });

    const userFound = newSearchResult.find((user) => {
      return user.login === userInfo.login;
    });

    if (userFound.is_favorite) {
      _Favorite__WEBPACK_IMPORTED_MODULE_5__.default.removeUser(userFound.login);
      userFound.is_favorite = !userFound.is_favorite;
    } else {
      userFound.is_favorite = !userFound.is_favorite;
      _Favorite__WEBPACK_IMPORTED_MODULE_5__.default.addUser(userFound);
    }

    if (state.currentTab === 'local') {
      const indexToRemove = newSearchResult.findIndex((user) => {
        return user.login === userFound.login;
      });
      newSearchResult.splice(indexToRemove, 1);
    }

    setState({
      ...state,
      userSearchResults: newSearchResult,
      favorites: _Favorite__WEBPACK_IMPORTED_MODULE_5__.default.getUserData(),
    });
  }

  const render = () => {
    const { currentTab, searchInput, userSearchResults } = state;

    (0,_clearPage__WEBPACK_IMPORTED_MODULE_4__.default)();
    (0,_addHeader__WEBPACK_IMPORTED_MODULE_0__.default)();
    (0,_addNav__WEBPACK_IMPORTED_MODULE_1__.default)(
      currentTab,
      onTabChange,
      searchInput,
      onSearchChangeHandler,
      onSearchHandler
    );
    (0,_addMain__WEBPACK_IMPORTED_MODULE_2__.default)(userSearchResults, onFavoriteHandler);
  };

  return { render };
}

const myApp = App();

// if (module.hot) {
//   module.hot.accept('./addHeader.js', function () {
//     const userlistSection = document.querySelector('.userlist-section');
//     const oldHeader = document.querySelector('.userlist-section__header');
//     const newHeader = addHeader();

//     console.log('what');
//     userlistSection.replaceChild(newHeader, oldHeader);
//   });
// }

if (false) {}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (myApp);


/***/ }),

/***/ "./src/components/clearPage.js":
/*!*************************************!*\
  !*** ./src/components/clearPage.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function clearPage() {
  const userListSection = document.querySelector('.userlist-section');
  while (userListSection.firstChild) {
    userListSection.removeChild(userListSection.firstChild);
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (clearPage);


/***/ }),

/***/ "./src/components/createSearchBar.js":
/*!*******************************************!*\
  !*** ./src/components/createSearchBar.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_cretateFragment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/cretateFragment */ "./src/helpers/cretateFragment.js");


function createSearchBar(
  searchInputValue,
  onSearchChangeHandler,
  onSearchHandler
) {
  const UI = (0,_helpers_cretateFragment__WEBPACK_IMPORTED_MODULE_0__.default)(`
    <div class="userlist-section__search-bar">
      <form class="container row row-between">
        <input class="userlist-section__search-input" type=text"
        placeholder="검색어를 입력하세요" pattern="^[a-zA-Z0-9-]*$" required>
        <button class="userlist-section__search-btn">
          <svg class="userlist-section__search-icon"
            xmlns="http://www.w3.org/2000/svg"
            height="48px"
            viewBox="0 0 24 24"
            width="48px"
            fill="#000000"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path
              d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            />
          </svg>
        </button>
      </form>
    </div>
  `);

  const searchInput = UI.querySelector('.userlist-section__search-input');
  searchInput.value = searchInputValue;
  searchInput.addEventListener('change', (e) => {
    onSearchChangeHandler(e);
  });

  const searchBtn = UI.querySelector('.userlist-section__search-btn');
  searchBtn.addEventListener('click', (e) => {
    if (searchInput.validity.valueMissing) {
      return searchInput.setCustomValidity('값을 입력하여 주세요.');
    }

    if (searchInput.validity.patternMismatch) {
      return searchInput.setCustomValidity(
        '깃허브 유저는 영문, 숫자, 하이픈(-) 조합으로 이루어져 있습니다.'
      );
    }

    onSearchHandler(e);
  });

  return UI;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createSearchBar);


/***/ }),

/***/ "./src/components/createSearchTab.js":
/*!*******************************************!*\
  !*** ./src/components/createSearchTab.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_cretateFragment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/cretateFragment */ "./src/helpers/cretateFragment.js");


function createSearchTab(tab, onTabChange) {
  let UI;

  if (tab === 'api') {
    const tabAPI = `
      <div class="userlist-section__search-tab row">
        <div class="tab-api tab tab--active">api</div>
        <div class="tab-local tab">로컬</div>
      </div>
    `;

    UI = (0,_helpers_cretateFragment__WEBPACK_IMPORTED_MODULE_0__.default)(tabAPI);
  }

  if (tab === 'local') {
    const localAPI = `
      <div class="userlist-section__search-tab row">
        <div class="tab-api tab">api</div>
        <div class="tab-local tab tab--active">로컬</div>
      </div>
    `;

    UI = (0,_helpers_cretateFragment__WEBPACK_IMPORTED_MODULE_0__.default)(localAPI);
  }
  const searchTab = UI.querySelector('.userlist-section__search-tab');
  searchTab.addEventListener('click', onTabChange);

  return UI;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createSearchTab);


/***/ }),

/***/ "./src/components/createUser.js":
/*!**************************************!*\
  !*** ./src/components/createUser.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function createUser(userInfo, onFavoriteHandler) {
  const { avatar_url, login, is_favorite } = userInfo;
  const userUI = document.createRange().createContextualFragment(`
    <div class="user row">
      <img class="user__img" src="${avatar_url}" />
      <span class="user__name">${login}</span>
      <button class="user__favorite">
        ${is_favorite ? starIconActive : starIcon}
      </button>
    </div>
  `);

  userUI //
    .querySelector('.user')
    .addEventListener('click', () => onFavoriteHandler(userInfo));

  return userUI;
}

const starIcon = `
  <svg
    class="star-icon"
    xmlns="http://www.w3.org/2000/svg"
    enable-background="new 0 0 24 24"
    height="24px"
    viewBox="0 0 24 24"
    width="24px"
    fill="#000000"
  >
    <g>
      <path d="M0,0h24v24H0V0z" fill="none" />
      <path d="M0,0h24v24H0V0z" fill="none" />
    </g>
    <g>
      <path d="M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z" />
    </g>
  </svg>
`;

const starIconActive = `
    <svg
      class="star-icon star-icon--active"
      xmlns="http://www.w3.org/2000/svg"
      enable-background="new 0 0 24 24"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#000000"
    >
      <g>
        <path d="M0,0h24v24H0V0z" fill="none" />
        <path d="M0,0h24v24H0V0z" fill="none" />
      </g>
      <g>
        <path d="M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z" />
      </g>
    </svg>
  `;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createUser);


/***/ }),

/***/ "./src/components/createUsersRow.js":
/*!******************************************!*\
  !*** ./src/components/createUsersRow.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createUser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createUser */ "./src/components/createUser.js");


function createUsersRow(userGroup, onFavoriteHandler) {
  const usersRow = document.createElement('div');
  usersRow.className = 'users__row';

  const usersRowTitle = document.createElement('span');
  usersRowTitle.className = 'users__row-title';
  usersRowTitle.textContent = userGroup[0].login[0].toLowerCase();

  usersRow.appendChild(usersRowTitle);

  userGroup.forEach((userInfo) => {
    const userUI = (0,_createUser__WEBPACK_IMPORTED_MODULE_0__.default)(userInfo, onFavoriteHandler);
    usersRow.appendChild(userUI);
  });

  return usersRow;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createUsersRow);


/***/ }),

/***/ "./src/helpers/cretateFragment.js":
/*!****************************************!*\
  !*** ./src/helpers/cretateFragment.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function createFragment(elementHTML) {
  return document.createRange().createContextualFragment(elementHTML);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createFragment);


/***/ }),

/***/ "./src/helpers/getUserList.js":
/*!************************************!*\
  !*** ./src/helpers/getUserList.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _octokit_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @octokit/core */ "./node_modules/@octokit/core/dist-web/index.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config */ "./config.js");
/* harmony import */ var _sortUserByAlphabet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sortUserByAlphabet */ "./src/helpers/sortUserByAlphabet.js");




const octokit = new _octokit_core__WEBPACK_IMPORTED_MODULE_2__.Octokit({
  auth: _config__WEBPACK_IMPORTED_MODULE_0__.default.githubToken,
});

async function getUserList(name, favorites) {
  const searchResponse = await octokit.request('GET /search/users', {
    q: `${name} in:login type:user`,
    per_page: 100,
    page: 1,
  });

  console.log(searchResponse);

  const userList = makeNewUserList(searchResponse, favorites);

  return (0,_sortUserByAlphabet__WEBPACK_IMPORTED_MODULE_1__.default)(userList);
}

function makeNewUserList(response, favorites) {
  const userList = response.data.items;

  const newUserList = userList.map((userInfo) => {
    const { login, avatar_url } = userInfo;
    const is_favorite = doesExistInFavorites(login, favorites);

    return { login, avatar_url, is_favorite };
  });

  return newUserList;
}

function doesExistInFavorites(userName, favorites) {
  if (favorites === null) {
    return false;
  }

  const result = favorites.find((userInfo) => userInfo.login === userName);

  return result ? true : false;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getUserList);


/***/ }),

/***/ "./src/helpers/sortUserByAlphabet.js":
/*!*******************************************!*\
  !*** ./src/helpers/sortUserByAlphabet.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function sortUserByAlphabet(userList) {
  if (userList === null) {
    return userList;
  }

  const newUserList = [...userList];
  newUserList.sort((a, b) => {
    return a.login.localeCompare(b.login);
  });

  return newUserList;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sortUserByAlphabet);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/app */ "./src/components/app.js");


_components_app__WEBPACK_IMPORTED_MODULE_0__.default.render();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vY29uZmlnLmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9ub2RlX21vZHVsZXMvQG9jdG9raXQvYXV0aC10b2tlbi9kaXN0LXdlYi9pbmRleC5qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vbm9kZV9tb2R1bGVzL0BvY3Rva2l0L2NvcmUvZGlzdC13ZWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbW9tLXNpdHRlci8uL25vZGVfbW9kdWxlcy9Ab2N0b2tpdC9lbmRwb2ludC9kaXN0LXdlYi9pbmRleC5qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vbm9kZV9tb2R1bGVzL0BvY3Rva2l0L2VuZHBvaW50L25vZGVfbW9kdWxlcy9pcy1wbGFpbi1vYmplY3QvZGlzdC9pcy1wbGFpbi1vYmplY3QubWpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9ub2RlX21vZHVsZXMvQG9jdG9raXQvZ3JhcGhxbC9kaXN0LXdlYi9pbmRleC5qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vbm9kZV9tb2R1bGVzL0BvY3Rva2l0L3JlcXVlc3QtZXJyb3IvZGlzdC13ZWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbW9tLXNpdHRlci8uL25vZGVfbW9kdWxlcy9Ab2N0b2tpdC9yZXF1ZXN0L2Rpc3Qtd2ViL2luZGV4LmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9ub2RlX21vZHVsZXMvQG9jdG9raXQvcmVxdWVzdC9ub2RlX21vZHVsZXMvaXMtcGxhaW4tb2JqZWN0L2Rpc3QvaXMtcGxhaW4tb2JqZWN0Lm1qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vbm9kZV9tb2R1bGVzL2JlZm9yZS1hZnRlci1ob29rL2luZGV4LmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9ub2RlX21vZHVsZXMvYmVmb3JlLWFmdGVyLWhvb2svbGliL2FkZC5qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vbm9kZV9tb2R1bGVzL2JlZm9yZS1hZnRlci1ob29rL2xpYi9yZWdpc3Rlci5qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vbm9kZV9tb2R1bGVzL2JlZm9yZS1hZnRlci1ob29rL2xpYi9yZW1vdmUuanMiLCJ3ZWJwYWNrOi8vbW9tLXNpdHRlci8uL3NyYy9zdHlsZXMvc3R5bGUuY3NzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvY3NzV2l0aE1hcHBpbmdUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vbm9kZV9tb2R1bGVzL2RlcHJlY2F0aW9uL2Rpc3Qtd2ViL2luZGV4LmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9ub2RlX21vZHVsZXMvbm9kZS1mZXRjaC9icm93c2VyLmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9ub2RlX21vZHVsZXMvb25jZS9vbmNlLmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9zcmMvc3R5bGVzL3N0eWxlLmNzcz9mZjk0Iiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vbW9tLXNpdHRlci8uL25vZGVfbW9kdWxlcy91bml2ZXJzYWwtdXNlci1hZ2VudC9kaXN0LXdlYi9pbmRleC5qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vbm9kZV9tb2R1bGVzL3dyYXBweS93cmFwcHkuanMiLCJ3ZWJwYWNrOi8vbW9tLXNpdHRlci8uL3NyYy9jb21wb25lbnRzL0Zhdm9yaXRlLmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9zcmMvY29tcG9uZW50cy9hZGRIZWFkZXIuanMiLCJ3ZWJwYWNrOi8vbW9tLXNpdHRlci8uL3NyYy9jb21wb25lbnRzL2FkZE1haW4uanMiLCJ3ZWJwYWNrOi8vbW9tLXNpdHRlci8uL3NyYy9jb21wb25lbnRzL2FkZE5hdi5qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vc3JjL2NvbXBvbmVudHMvYXBwLmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9zcmMvY29tcG9uZW50cy9jbGVhclBhZ2UuanMiLCJ3ZWJwYWNrOi8vbW9tLXNpdHRlci8uL3NyYy9jb21wb25lbnRzL2NyZWF0ZVNlYXJjaEJhci5qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vc3JjL2NvbXBvbmVudHMvY3JlYXRlU2VhcmNoVGFiLmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9zcmMvY29tcG9uZW50cy9jcmVhdGVVc2VyLmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9zcmMvY29tcG9uZW50cy9jcmVhdGVVc2Vyc1Jvdy5qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vc3JjL2hlbHBlcnMvY3JldGF0ZUZyYWdtZW50LmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9zcmMvaGVscGVycy9nZXRVc2VyTGlzdC5qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vc3JjL2hlbHBlcnMvc29ydFVzZXJCeUFscGhhYmV0LmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbW9tLXNpdHRlci93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9tb20tc2l0dGVyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbW9tLXNpdHRlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOltd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O0FDcEI5QjtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsY0FBYyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSlU7QUFDTjtBQUNvQjs7QUFFdEQsb0JBQW9CLGtEQUFPO0FBQzNCLFFBQVEsd0RBQWtCO0FBQzFCLENBQUM7O0FBRUQ7QUFDQTtBQUNBLFVBQVUsS0FBSztBQUNmO0FBQ0E7QUFDQSxHQUFHOztBQUVIOztBQUVBOztBQUVBLFNBQVMsNERBQWtCO0FBQzNCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxXQUFXLG9CQUFvQjtBQUMvQjs7QUFFQSxZQUFZO0FBQ1osR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsaUVBQWUsV0FBVyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDN0MzQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUEsaUVBQWUsa0JBQWtCLEVBQUM7Ozs7Ozs7VUNibEM7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGdDQUFnQyxZQUFZO1dBQzVDO1dBQ0EsRTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7Ozs7QUNOcUM7O0FBRXJDLDJEQUFZIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBjb25maWcgPSB7XG4gIGdpdGh1YlRva2VuOiAnZ2hwX3VZTTlsbDdVelFYQ1k2MDVQaFFoVDZIWG1UTnhNMTRCSFBEUicsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25maWc7XG4iLCJhc3luYyBmdW5jdGlvbiBhdXRoKHRva2VuKSB7XG4gICAgY29uc3QgdG9rZW5UeXBlID0gdG9rZW4uc3BsaXQoL1xcLi8pLmxlbmd0aCA9PT0gM1xuICAgICAgICA/IFwiYXBwXCJcbiAgICAgICAgOiAvXnZcXGQrXFwuLy50ZXN0KHRva2VuKVxuICAgICAgICAgICAgPyBcImluc3RhbGxhdGlvblwiXG4gICAgICAgICAgICA6IFwib2F1dGhcIjtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBcInRva2VuXCIsXG4gICAgICAgIHRva2VuOiB0b2tlbixcbiAgICAgICAgdG9rZW5UeXBlXG4gICAgfTtcbn1cblxuLyoqXG4gKiBQcmVmaXggdG9rZW4gZm9yIHVzYWdlIGluIHRoZSBBdXRob3JpemF0aW9uIGhlYWRlclxuICpcbiAqIEBwYXJhbSB0b2tlbiBPQXV0aCB0b2tlbiBvciBKU09OIFdlYiBUb2tlblxuICovXG5mdW5jdGlvbiB3aXRoQXV0aG9yaXphdGlvblByZWZpeCh0b2tlbikge1xuICAgIGlmICh0b2tlbi5zcGxpdCgvXFwuLykubGVuZ3RoID09PSAzKSB7XG4gICAgICAgIHJldHVybiBgYmVhcmVyICR7dG9rZW59YDtcbiAgICB9XG4gICAgcmV0dXJuIGB0b2tlbiAke3Rva2VufWA7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGhvb2sodG9rZW4sIHJlcXVlc3QsIHJvdXRlLCBwYXJhbWV0ZXJzKSB7XG4gICAgY29uc3QgZW5kcG9pbnQgPSByZXF1ZXN0LmVuZHBvaW50Lm1lcmdlKHJvdXRlLCBwYXJhbWV0ZXJzKTtcbiAgICBlbmRwb2ludC5oZWFkZXJzLmF1dGhvcml6YXRpb24gPSB3aXRoQXV0aG9yaXphdGlvblByZWZpeCh0b2tlbik7XG4gICAgcmV0dXJuIHJlcXVlc3QoZW5kcG9pbnQpO1xufVxuXG5jb25zdCBjcmVhdGVUb2tlbkF1dGggPSBmdW5jdGlvbiBjcmVhdGVUb2tlbkF1dGgodG9rZW4pIHtcbiAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIltAb2N0b2tpdC9hdXRoLXRva2VuXSBObyB0b2tlbiBwYXNzZWQgdG8gY3JlYXRlVG9rZW5BdXRoXCIpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRva2VuICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIltAb2N0b2tpdC9hdXRoLXRva2VuXSBUb2tlbiBwYXNzZWQgdG8gY3JlYXRlVG9rZW5BdXRoIGlzIG5vdCBhIHN0cmluZ1wiKTtcbiAgICB9XG4gICAgdG9rZW4gPSB0b2tlbi5yZXBsYWNlKC9eKHRva2VufGJlYXJlcikgKy9pLCBcIlwiKTtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihhdXRoLmJpbmQobnVsbCwgdG9rZW4pLCB7XG4gICAgICAgIGhvb2s6IGhvb2suYmluZChudWxsLCB0b2tlbilcbiAgICB9KTtcbn07XG5cbmV4cG9ydCB7IGNyZWF0ZVRva2VuQXV0aCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwXG4iLCJpbXBvcnQgeyBnZXRVc2VyQWdlbnQgfSBmcm9tICd1bml2ZXJzYWwtdXNlci1hZ2VudCc7XG5pbXBvcnQgeyBDb2xsZWN0aW9uIH0gZnJvbSAnYmVmb3JlLWFmdGVyLWhvb2snO1xuaW1wb3J0IHsgcmVxdWVzdCB9IGZyb20gJ0BvY3Rva2l0L3JlcXVlc3QnO1xuaW1wb3J0IHsgd2l0aEN1c3RvbVJlcXVlc3QgfSBmcm9tICdAb2N0b2tpdC9ncmFwaHFsJztcbmltcG9ydCB7IGNyZWF0ZVRva2VuQXV0aCB9IGZyb20gJ0BvY3Rva2l0L2F1dGgtdG9rZW4nO1xuXG5jb25zdCBWRVJTSU9OID0gXCIzLjQuMFwiO1xuXG5jbGFzcyBPY3Rva2l0IHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgICAgY29uc3QgaG9vayA9IG5ldyBDb2xsZWN0aW9uKCk7XG4gICAgICAgIGNvbnN0IHJlcXVlc3REZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIGJhc2VVcmw6IHJlcXVlc3QuZW5kcG9pbnQuREVGQVVMVFMuYmFzZVVybCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgICAgICAgcmVxdWVzdDogT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucy5yZXF1ZXN0LCB7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSBpbnRlcm5hbCB1c2FnZSBvbmx5LCBubyBuZWVkIHRvIHR5cGVcbiAgICAgICAgICAgICAgICBob29rOiBob29rLmJpbmQobnVsbCwgXCJyZXF1ZXN0XCIpLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBtZWRpYVR5cGU6IHtcbiAgICAgICAgICAgICAgICBwcmV2aWV3czogW10sXG4gICAgICAgICAgICAgICAgZm9ybWF0OiBcIlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgLy8gcHJlcGVuZCBkZWZhdWx0IHVzZXIgYWdlbnQgd2l0aCBgb3B0aW9ucy51c2VyQWdlbnRgIGlmIHNldFxuICAgICAgICByZXF1ZXN0RGVmYXVsdHMuaGVhZGVyc1tcInVzZXItYWdlbnRcIl0gPSBbXG4gICAgICAgICAgICBvcHRpb25zLnVzZXJBZ2VudCxcbiAgICAgICAgICAgIGBvY3Rva2l0LWNvcmUuanMvJHtWRVJTSU9OfSAke2dldFVzZXJBZ2VudCgpfWAsXG4gICAgICAgIF1cbiAgICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAgICAgICAgIC5qb2luKFwiIFwiKTtcbiAgICAgICAgaWYgKG9wdGlvbnMuYmFzZVVybCkge1xuICAgICAgICAgICAgcmVxdWVzdERlZmF1bHRzLmJhc2VVcmwgPSBvcHRpb25zLmJhc2VVcmw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMucHJldmlld3MpIHtcbiAgICAgICAgICAgIHJlcXVlc3REZWZhdWx0cy5tZWRpYVR5cGUucHJldmlld3MgPSBvcHRpb25zLnByZXZpZXdzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLnRpbWVab25lKSB7XG4gICAgICAgICAgICByZXF1ZXN0RGVmYXVsdHMuaGVhZGVyc1tcInRpbWUtem9uZVwiXSA9IG9wdGlvbnMudGltZVpvbmU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdC5kZWZhdWx0cyhyZXF1ZXN0RGVmYXVsdHMpO1xuICAgICAgICB0aGlzLmdyYXBocWwgPSB3aXRoQ3VzdG9tUmVxdWVzdCh0aGlzLnJlcXVlc3QpLmRlZmF1bHRzKHJlcXVlc3REZWZhdWx0cyk7XG4gICAgICAgIHRoaXMubG9nID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICBkZWJ1ZzogKCkgPT4geyB9LFxuICAgICAgICAgICAgaW5mbzogKCkgPT4geyB9LFxuICAgICAgICAgICAgd2FybjogY29uc29sZS53YXJuLmJpbmQoY29uc29sZSksXG4gICAgICAgICAgICBlcnJvcjogY29uc29sZS5lcnJvci5iaW5kKGNvbnNvbGUpLFxuICAgICAgICB9LCBvcHRpb25zLmxvZyk7XG4gICAgICAgIHRoaXMuaG9vayA9IGhvb2s7XG4gICAgICAgIC8vICgxKSBJZiBuZWl0aGVyIGBvcHRpb25zLmF1dGhTdHJhdGVneWAgbm9yIGBvcHRpb25zLmF1dGhgIGFyZSBzZXQsIHRoZSBgb2N0b2tpdGAgaW5zdGFuY2VcbiAgICAgICAgLy8gICAgIGlzIHVuYXV0aGVudGljYXRlZC4gVGhlIGB0aGlzLmF1dGgoKWAgbWV0aG9kIGlzIGEgbm8tb3AgYW5kIG5vIHJlcXVlc3QgaG9vayBpcyByZWdpc3RlcmVkLlxuICAgICAgICAvLyAoMikgSWYgb25seSBgb3B0aW9ucy5hdXRoYCBpcyBzZXQsIHVzZSB0aGUgZGVmYXVsdCB0b2tlbiBhdXRoZW50aWNhdGlvbiBzdHJhdGVneS5cbiAgICAgICAgLy8gKDMpIElmIGBvcHRpb25zLmF1dGhTdHJhdGVneWAgaXMgc2V0IHRoZW4gdXNlIGl0IGFuZCBwYXNzIGluIGBvcHRpb25zLmF1dGhgLiBBbHdheXMgcGFzcyBvd24gcmVxdWVzdCBhcyBtYW55IHN0cmF0ZWdpZXMgYWNjZXB0IGEgY3VzdG9tIHJlcXVlc3QgaW5zdGFuY2UuXG4gICAgICAgIC8vIFRPRE86IHR5cGUgYG9wdGlvbnMuYXV0aGAgYmFzZWQgb24gYG9wdGlvbnMuYXV0aFN0cmF0ZWd5YC5cbiAgICAgICAgaWYgKCFvcHRpb25zLmF1dGhTdHJhdGVneSkge1xuICAgICAgICAgICAgaWYgKCFvcHRpb25zLmF1dGgpIHtcbiAgICAgICAgICAgICAgICAvLyAoMSlcbiAgICAgICAgICAgICAgICB0aGlzLmF1dGggPSBhc3luYyAoKSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInVuYXV0aGVudGljYXRlZFwiLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gKDIpXG4gICAgICAgICAgICAgICAgY29uc3QgYXV0aCA9IGNyZWF0ZVRva2VuQXV0aChvcHRpb25zLmF1dGgpO1xuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmUgIMKvXFxfKOODhClfL8KvXG4gICAgICAgICAgICAgICAgaG9vay53cmFwKFwicmVxdWVzdFwiLCBhdXRoLmhvb2spO1xuICAgICAgICAgICAgICAgIHRoaXMuYXV0aCA9IGF1dGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB7IGF1dGhTdHJhdGVneSwgLi4ub3RoZXJPcHRpb25zIH0gPSBvcHRpb25zO1xuICAgICAgICAgICAgY29uc3QgYXV0aCA9IGF1dGhTdHJhdGVneShPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgICAgICByZXF1ZXN0OiB0aGlzLnJlcXVlc3QsXG4gICAgICAgICAgICAgICAgbG9nOiB0aGlzLmxvZyxcbiAgICAgICAgICAgICAgICAvLyB3ZSBwYXNzIHRoZSBjdXJyZW50IG9jdG9raXQgaW5zdGFuY2UgYXMgd2VsbCBhcyBpdHMgY29uc3RydWN0b3Igb3B0aW9uc1xuICAgICAgICAgICAgICAgIC8vIHRvIGFsbG93IGZvciBhdXRoZW50aWNhdGlvbiBzdHJhdGVnaWVzIHRoYXQgcmV0dXJuIGEgbmV3IG9jdG9raXQgaW5zdGFuY2VcbiAgICAgICAgICAgICAgICAvLyB0aGF0IHNoYXJlcyB0aGUgc2FtZSBpbnRlcm5hbCBzdGF0ZSBhcyB0aGUgY3VycmVudCBvbmUuIFRoZSBvcmlnaW5hbFxuICAgICAgICAgICAgICAgIC8vIHJlcXVpcmVtZW50IGZvciB0aGlzIHdhcyB0aGUgXCJldmVudC1vY3Rva2l0XCIgYXV0aGVudGljYXRpb24gc3RyYXRlZ3lcbiAgICAgICAgICAgICAgICAvLyBvZiBodHRwczovL2dpdGh1Yi5jb20vcHJvYm90L29jdG9raXQtYXV0aC1wcm9ib3QuXG4gICAgICAgICAgICAgICAgb2N0b2tpdDogdGhpcyxcbiAgICAgICAgICAgICAgICBvY3Rva2l0T3B0aW9uczogb3RoZXJPcHRpb25zLFxuICAgICAgICAgICAgfSwgb3B0aW9ucy5hdXRoKSk7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlICDCr1xcXyjjg4QpXy/Cr1xuICAgICAgICAgICAgaG9vay53cmFwKFwicmVxdWVzdFwiLCBhdXRoLmhvb2spO1xuICAgICAgICAgICAgdGhpcy5hdXRoID0gYXV0aDtcbiAgICAgICAgfVxuICAgICAgICAvLyBhcHBseSBwbHVnaW5zXG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNjM0NTE3MlxuICAgICAgICBjb25zdCBjbGFzc0NvbnN0cnVjdG9yID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgY2xhc3NDb25zdHJ1Y3Rvci5wbHVnaW5zLmZvckVhY2goKHBsdWdpbikgPT4ge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBwbHVnaW4odGhpcywgb3B0aW9ucykpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgc3RhdGljIGRlZmF1bHRzKGRlZmF1bHRzKSB7XG4gICAgICAgIGNvbnN0IE9jdG9raXRXaXRoRGVmYXVsdHMgPSBjbGFzcyBleHRlbmRzIHRoaXMge1xuICAgICAgICAgICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSBhcmdzWzBdIHx8IHt9O1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZGVmYXVsdHMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBzdXBlcihkZWZhdWx0cyhvcHRpb25zKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3VwZXIoT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMsIG9wdGlvbnMudXNlckFnZW50ICYmIGRlZmF1bHRzLnVzZXJBZ2VudFxuICAgICAgICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJBZ2VudDogYCR7b3B0aW9ucy51c2VyQWdlbnR9ICR7ZGVmYXVsdHMudXNlckFnZW50fWAsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgOiBudWxsKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBPY3Rva2l0V2l0aERlZmF1bHRzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBdHRhY2ggYSBwbHVnaW4gKG9yIG1hbnkpIHRvIHlvdXIgT2N0b2tpdCBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogY29uc3QgQVBJID0gT2N0b2tpdC5wbHVnaW4ocGx1Z2luMSwgcGx1Z2luMiwgcGx1Z2luMywgLi4uKVxuICAgICAqL1xuICAgIHN0YXRpYyBwbHVnaW4oLi4ubmV3UGx1Z2lucykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRQbHVnaW5zID0gdGhpcy5wbHVnaW5zO1xuICAgICAgICBjb25zdCBOZXdPY3Rva2l0ID0gKF9hID0gY2xhc3MgZXh0ZW5kcyB0aGlzIHtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfYS5wbHVnaW5zID0gY3VycmVudFBsdWdpbnMuY29uY2F0KG5ld1BsdWdpbnMuZmlsdGVyKChwbHVnaW4pID0+ICFjdXJyZW50UGx1Z2lucy5pbmNsdWRlcyhwbHVnaW4pKSksXG4gICAgICAgICAgICBfYSk7XG4gICAgICAgIHJldHVybiBOZXdPY3Rva2l0O1xuICAgIH1cbn1cbk9jdG9raXQuVkVSU0lPTiA9IFZFUlNJT047XG5PY3Rva2l0LnBsdWdpbnMgPSBbXTtcblxuZXhwb3J0IHsgT2N0b2tpdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwXG4iLCJpbXBvcnQgeyBpc1BsYWluT2JqZWN0IH0gZnJvbSAnaXMtcGxhaW4tb2JqZWN0JztcbmltcG9ydCB7IGdldFVzZXJBZ2VudCB9IGZyb20gJ3VuaXZlcnNhbC11c2VyLWFnZW50JztcblxuZnVuY3Rpb24gbG93ZXJjYXNlS2V5cyhvYmplY3QpIHtcbiAgICBpZiAoIW9iamVjdCkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmplY3QpLnJlZHVjZSgobmV3T2JqLCBrZXkpID0+IHtcbiAgICAgICAgbmV3T2JqW2tleS50b0xvd2VyQ2FzZSgpXSA9IG9iamVjdFtrZXldO1xuICAgICAgICByZXR1cm4gbmV3T2JqO1xuICAgIH0sIHt9KTtcbn1cblxuZnVuY3Rpb24gbWVyZ2VEZWVwKGRlZmF1bHRzLCBvcHRpb25zKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMpO1xuICAgIE9iamVjdC5rZXlzKG9wdGlvbnMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBpZiAoaXNQbGFpbk9iamVjdChvcHRpb25zW2tleV0pKSB7XG4gICAgICAgICAgICBpZiAoIShrZXkgaW4gZGVmYXVsdHMpKVxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ocmVzdWx0LCB7IFtrZXldOiBvcHRpb25zW2tleV0gfSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZURlZXAoZGVmYXVsdHNba2V5XSwgb3B0aW9uc1trZXldKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ocmVzdWx0LCB7IFtrZXldOiBvcHRpb25zW2tleV0gfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiByZW1vdmVVbmRlZmluZWRQcm9wZXJ0aWVzKG9iaikge1xuICAgIGZvciAoY29uc3Qga2V5IGluIG9iaikge1xuICAgICAgICBpZiAob2JqW2tleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG59XG5cbmZ1bmN0aW9uIG1lcmdlKGRlZmF1bHRzLCByb3V0ZSwgb3B0aW9ucykge1xuICAgIGlmICh0eXBlb2Ygcm91dGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgbGV0IFttZXRob2QsIHVybF0gPSByb3V0ZS5zcGxpdChcIiBcIik7XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHVybCA/IHsgbWV0aG9kLCB1cmwgfSA6IHsgdXJsOiBtZXRob2QgfSwgb3B0aW9ucyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgcm91dGUpO1xuICAgIH1cbiAgICAvLyBsb3dlcmNhc2UgaGVhZGVyIG5hbWVzIGJlZm9yZSBtZXJnaW5nIHdpdGggZGVmYXVsdHMgdG8gYXZvaWQgZHVwbGljYXRlc1xuICAgIG9wdGlvbnMuaGVhZGVycyA9IGxvd2VyY2FzZUtleXMob3B0aW9ucy5oZWFkZXJzKTtcbiAgICAvLyByZW1vdmUgcHJvcGVydGllcyB3aXRoIHVuZGVmaW5lZCB2YWx1ZXMgYmVmb3JlIG1lcmdpbmdcbiAgICByZW1vdmVVbmRlZmluZWRQcm9wZXJ0aWVzKG9wdGlvbnMpO1xuICAgIHJlbW92ZVVuZGVmaW5lZFByb3BlcnRpZXMob3B0aW9ucy5oZWFkZXJzKTtcbiAgICBjb25zdCBtZXJnZWRPcHRpb25zID0gbWVyZ2VEZWVwKGRlZmF1bHRzIHx8IHt9LCBvcHRpb25zKTtcbiAgICAvLyBtZWRpYVR5cGUucHJldmlld3MgYXJyYXlzIGFyZSBtZXJnZWQsIGluc3RlYWQgb2Ygb3ZlcndyaXR0ZW5cbiAgICBpZiAoZGVmYXVsdHMgJiYgZGVmYXVsdHMubWVkaWFUeXBlLnByZXZpZXdzLmxlbmd0aCkge1xuICAgICAgICBtZXJnZWRPcHRpb25zLm1lZGlhVHlwZS5wcmV2aWV3cyA9IGRlZmF1bHRzLm1lZGlhVHlwZS5wcmV2aWV3c1xuICAgICAgICAgICAgLmZpbHRlcigocHJldmlldykgPT4gIW1lcmdlZE9wdGlvbnMubWVkaWFUeXBlLnByZXZpZXdzLmluY2x1ZGVzKHByZXZpZXcpKVxuICAgICAgICAgICAgLmNvbmNhdChtZXJnZWRPcHRpb25zLm1lZGlhVHlwZS5wcmV2aWV3cyk7XG4gICAgfVxuICAgIG1lcmdlZE9wdGlvbnMubWVkaWFUeXBlLnByZXZpZXdzID0gbWVyZ2VkT3B0aW9ucy5tZWRpYVR5cGUucHJldmlld3MubWFwKChwcmV2aWV3KSA9PiBwcmV2aWV3LnJlcGxhY2UoLy1wcmV2aWV3LywgXCJcIikpO1xuICAgIHJldHVybiBtZXJnZWRPcHRpb25zO1xufVxuXG5mdW5jdGlvbiBhZGRRdWVyeVBhcmFtZXRlcnModXJsLCBwYXJhbWV0ZXJzKSB7XG4gICAgY29uc3Qgc2VwYXJhdG9yID0gL1xcPy8udGVzdCh1cmwpID8gXCImXCIgOiBcIj9cIjtcbiAgICBjb25zdCBuYW1lcyA9IE9iamVjdC5rZXlzKHBhcmFtZXRlcnMpO1xuICAgIGlmIChuYW1lcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG4gICAgcmV0dXJuICh1cmwgK1xuICAgICAgICBzZXBhcmF0b3IgK1xuICAgICAgICBuYW1lc1xuICAgICAgICAgICAgLm1hcCgobmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKG5hbWUgPT09IFwicVwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcInE9XCIgKyBwYXJhbWV0ZXJzLnEuc3BsaXQoXCIrXCIpLm1hcChlbmNvZGVVUklDb21wb25lbnQpLmpvaW4oXCIrXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBgJHtuYW1lfT0ke2VuY29kZVVSSUNvbXBvbmVudChwYXJhbWV0ZXJzW25hbWVdKX1gO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmpvaW4oXCImXCIpKTtcbn1cblxuY29uc3QgdXJsVmFyaWFibGVSZWdleCA9IC9cXHtbXn1dK1xcfS9nO1xuZnVuY3Rpb24gcmVtb3ZlTm9uQ2hhcnModmFyaWFibGVOYW1lKSB7XG4gICAgcmV0dXJuIHZhcmlhYmxlTmFtZS5yZXBsYWNlKC9eXFxXK3xcXFcrJC9nLCBcIlwiKS5zcGxpdCgvLC8pO1xufVxuZnVuY3Rpb24gZXh0cmFjdFVybFZhcmlhYmxlTmFtZXModXJsKSB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IHVybC5tYXRjaCh1cmxWYXJpYWJsZVJlZ2V4KTtcbiAgICBpZiAoIW1hdGNoZXMpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICByZXR1cm4gbWF0Y2hlcy5tYXAocmVtb3ZlTm9uQ2hhcnMpLnJlZHVjZSgoYSwgYikgPT4gYS5jb25jYXQoYiksIFtdKTtcbn1cblxuZnVuY3Rpb24gb21pdChvYmplY3QsIGtleXNUb09taXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqZWN0KVxuICAgICAgICAuZmlsdGVyKChvcHRpb24pID0+ICFrZXlzVG9PbWl0LmluY2x1ZGVzKG9wdGlvbikpXG4gICAgICAgIC5yZWR1Y2UoKG9iaiwga2V5KSA9PiB7XG4gICAgICAgIG9ialtrZXldID0gb2JqZWN0W2tleV07XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfSwge30pO1xufVxuXG4vLyBCYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vYnJhbXN0ZWluL3VybC10ZW1wbGF0ZSwgbGljZW5zZWQgdW5kZXIgQlNEXG4vLyBUT0RPOiBjcmVhdGUgc2VwYXJhdGUgcGFja2FnZS5cbi8vXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTItMjAxNCwgQnJhbSBTdGVpblxuLy8gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuLy8gbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zXG4vLyBhcmUgbWV0OlxuLy8gIDEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0XG4vLyAgICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuLy8gIDIuIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0XG4vLyAgICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZVxuLy8gICAgIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4vLyAgMy4gVGhlIG5hbWUgb2YgdGhlIGF1dGhvciBtYXkgbm90IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzXG4vLyAgICAgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXG4vLyBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBBVVRIT1IgXCJBUyBJU1wiIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEXG4vLyBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk9cbi8vIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgT1dORVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCxcbi8vIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLFxuLy8gQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSxcbi8vIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUllcbi8vIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HXG4vLyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsXG4vLyBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuLyogaXN0YW5idWwgaWdub3JlIGZpbGUgKi9cbmZ1bmN0aW9uIGVuY29kZVJlc2VydmVkKHN0cikge1xuICAgIHJldHVybiBzdHJcbiAgICAgICAgLnNwbGl0KC8oJVswLTlBLUZhLWZdezJ9KS9nKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChwYXJ0KSB7XG4gICAgICAgIGlmICghLyVbMC05QS1GYS1mXS8udGVzdChwYXJ0KSkge1xuICAgICAgICAgICAgcGFydCA9IGVuY29kZVVSSShwYXJ0KS5yZXBsYWNlKC8lNUIvZywgXCJbXCIpLnJlcGxhY2UoLyU1RC9nLCBcIl1cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcnQ7XG4gICAgfSlcbiAgICAgICAgLmpvaW4oXCJcIik7XG59XG5mdW5jdGlvbiBlbmNvZGVVbnJlc2VydmVkKHN0cikge1xuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyKS5yZXBsYWNlKC9bIScoKSpdL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIHJldHVybiBcIiVcIiArIGMuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGVuY29kZVZhbHVlKG9wZXJhdG9yLCB2YWx1ZSwga2V5KSB7XG4gICAgdmFsdWUgPVxuICAgICAgICBvcGVyYXRvciA9PT0gXCIrXCIgfHwgb3BlcmF0b3IgPT09IFwiI1wiXG4gICAgICAgICAgICA/IGVuY29kZVJlc2VydmVkKHZhbHVlKVxuICAgICAgICAgICAgOiBlbmNvZGVVbnJlc2VydmVkKHZhbHVlKTtcbiAgICBpZiAoa2V5KSB7XG4gICAgICAgIHJldHVybiBlbmNvZGVVbnJlc2VydmVkKGtleSkgKyBcIj1cIiArIHZhbHVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGlzRGVmaW5lZCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsO1xufVxuZnVuY3Rpb24gaXNLZXlPcGVyYXRvcihvcGVyYXRvcikge1xuICAgIHJldHVybiBvcGVyYXRvciA9PT0gXCI7XCIgfHwgb3BlcmF0b3IgPT09IFwiJlwiIHx8IG9wZXJhdG9yID09PSBcIj9cIjtcbn1cbmZ1bmN0aW9uIGdldFZhbHVlcyhjb250ZXh0LCBvcGVyYXRvciwga2V5LCBtb2RpZmllcikge1xuICAgIHZhciB2YWx1ZSA9IGNvbnRleHRba2V5XSwgcmVzdWx0ID0gW107XG4gICAgaWYgKGlzRGVmaW5lZCh2YWx1ZSkgJiYgdmFsdWUgIT09IFwiXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiB8fFxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiIHx8XG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBpZiAobW9kaWZpZXIgJiYgbW9kaWZpZXIgIT09IFwiKlwiKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgcGFyc2VJbnQobW9kaWZpZXIsIDEwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHQucHVzaChlbmNvZGVWYWx1ZShvcGVyYXRvciwgdmFsdWUsIGlzS2V5T3BlcmF0b3Iob3BlcmF0b3IpID8ga2V5IDogXCJcIikpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKG1vZGlmaWVyID09PSBcIipcIikge1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5maWx0ZXIoaXNEZWZpbmVkKS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goZW5jb2RlVmFsdWUob3BlcmF0b3IsIHZhbHVlLCBpc0tleU9wZXJhdG9yKG9wZXJhdG9yKSA/IGtleSA6IFwiXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzRGVmaW5lZCh2YWx1ZVtrXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChlbmNvZGVWYWx1ZShvcGVyYXRvciwgdmFsdWVba10sIGspKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG1wID0gW107XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLmZpbHRlcihpc0RlZmluZWQpLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0bXAucHVzaChlbmNvZGVWYWx1ZShvcGVyYXRvciwgdmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzRGVmaW5lZCh2YWx1ZVtrXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bXAucHVzaChlbmNvZGVVbnJlc2VydmVkKGspKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bXAucHVzaChlbmNvZGVWYWx1ZShvcGVyYXRvciwgdmFsdWVba10udG9TdHJpbmcoKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGlzS2V5T3BlcmF0b3Iob3BlcmF0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGVuY29kZVVucmVzZXJ2ZWQoa2V5KSArIFwiPVwiICsgdG1wLmpvaW4oXCIsXCIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodG1wLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0bXAuam9pbihcIixcIikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKG9wZXJhdG9yID09PSBcIjtcIikge1xuICAgICAgICAgICAgaWYgKGlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChlbmNvZGVVbnJlc2VydmVkKGtleSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHZhbHVlID09PSBcIlwiICYmIChvcGVyYXRvciA9PT0gXCImXCIgfHwgb3BlcmF0b3IgPT09IFwiP1wiKSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goZW5jb2RlVW5yZXNlcnZlZChrZXkpICsgXCI9XCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHZhbHVlID09PSBcIlwiKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChcIlwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gcGFyc2VVcmwodGVtcGxhdGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBleHBhbmQ6IGV4cGFuZC5iaW5kKG51bGwsIHRlbXBsYXRlKSxcbiAgICB9O1xufVxuZnVuY3Rpb24gZXhwYW5kKHRlbXBsYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG9wZXJhdG9ycyA9IFtcIitcIiwgXCIjXCIsIFwiLlwiLCBcIi9cIiwgXCI7XCIsIFwiP1wiLCBcIiZcIl07XG4gICAgcmV0dXJuIHRlbXBsYXRlLnJlcGxhY2UoL1xceyhbXlxce1xcfV0rKVxcfXwoW15cXHtcXH1dKykvZywgZnVuY3Rpb24gKF8sIGV4cHJlc3Npb24sIGxpdGVyYWwpIHtcbiAgICAgICAgaWYgKGV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgIGxldCBvcGVyYXRvciA9IFwiXCI7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBbXTtcbiAgICAgICAgICAgIGlmIChvcGVyYXRvcnMuaW5kZXhPZihleHByZXNzaW9uLmNoYXJBdCgwKSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgb3BlcmF0b3IgPSBleHByZXNzaW9uLmNoYXJBdCgwKTtcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gZXhwcmVzc2lvbi5zdWJzdHIoMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBleHByZXNzaW9uLnNwbGl0KC8sL2cpLmZvckVhY2goZnVuY3Rpb24gKHZhcmlhYmxlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRtcCA9IC8oW146XFwqXSopKD86OihcXGQrKXwoXFwqKSk/Ly5leGVjKHZhcmlhYmxlKTtcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaChnZXRWYWx1ZXMoY29udGV4dCwgb3BlcmF0b3IsIHRtcFsxXSwgdG1wWzJdIHx8IHRtcFszXSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAob3BlcmF0b3IgJiYgb3BlcmF0b3IgIT09IFwiK1wiKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlcGFyYXRvciA9IFwiLFwiO1xuICAgICAgICAgICAgICAgIGlmIChvcGVyYXRvciA9PT0gXCI/XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VwYXJhdG9yID0gXCImXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG9wZXJhdG9yICE9PSBcIiNcIikge1xuICAgICAgICAgICAgICAgICAgICBzZXBhcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuICh2YWx1ZXMubGVuZ3RoICE9PSAwID8gb3BlcmF0b3IgOiBcIlwiKSArIHZhbHVlcy5qb2luKHNlcGFyYXRvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzLmpvaW4oXCIsXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGVuY29kZVJlc2VydmVkKGxpdGVyYWwpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlKG9wdGlvbnMpIHtcbiAgICAvLyBodHRwczovL2ZldGNoLnNwZWMud2hhdHdnLm9yZy8jbWV0aG9kc1xuICAgIGxldCBtZXRob2QgPSBvcHRpb25zLm1ldGhvZC50b1VwcGVyQ2FzZSgpO1xuICAgIC8vIHJlcGxhY2UgOnZhcm5hbWUgd2l0aCB7dmFybmFtZX0gdG8gbWFrZSBpdCBSRkMgNjU3MCBjb21wYXRpYmxlXG4gICAgbGV0IHVybCA9IChvcHRpb25zLnVybCB8fCBcIi9cIikucmVwbGFjZSgvOihbYS16XVxcdyspL2csIFwieyQxfVwiKTtcbiAgICBsZXQgaGVhZGVycyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMuaGVhZGVycyk7XG4gICAgbGV0IGJvZHk7XG4gICAgbGV0IHBhcmFtZXRlcnMgPSBvbWl0KG9wdGlvbnMsIFtcbiAgICAgICAgXCJtZXRob2RcIixcbiAgICAgICAgXCJiYXNlVXJsXCIsXG4gICAgICAgIFwidXJsXCIsXG4gICAgICAgIFwiaGVhZGVyc1wiLFxuICAgICAgICBcInJlcXVlc3RcIixcbiAgICAgICAgXCJtZWRpYVR5cGVcIixcbiAgICBdKTtcbiAgICAvLyBleHRyYWN0IHZhcmlhYmxlIG5hbWVzIGZyb20gVVJMIHRvIGNhbGN1bGF0ZSByZW1haW5pbmcgdmFyaWFibGVzIGxhdGVyXG4gICAgY29uc3QgdXJsVmFyaWFibGVOYW1lcyA9IGV4dHJhY3RVcmxWYXJpYWJsZU5hbWVzKHVybCk7XG4gICAgdXJsID0gcGFyc2VVcmwodXJsKS5leHBhbmQocGFyYW1ldGVycyk7XG4gICAgaWYgKCEvXmh0dHAvLnRlc3QodXJsKSkge1xuICAgICAgICB1cmwgPSBvcHRpb25zLmJhc2VVcmwgKyB1cmw7XG4gICAgfVxuICAgIGNvbnN0IG9taXR0ZWRQYXJhbWV0ZXJzID0gT2JqZWN0LmtleXMob3B0aW9ucylcbiAgICAgICAgLmZpbHRlcigob3B0aW9uKSA9PiB1cmxWYXJpYWJsZU5hbWVzLmluY2x1ZGVzKG9wdGlvbikpXG4gICAgICAgIC5jb25jYXQoXCJiYXNlVXJsXCIpO1xuICAgIGNvbnN0IHJlbWFpbmluZ1BhcmFtZXRlcnMgPSBvbWl0KHBhcmFtZXRlcnMsIG9taXR0ZWRQYXJhbWV0ZXJzKTtcbiAgICBjb25zdCBpc0JpbmFyeVJlcXVlc3QgPSAvYXBwbGljYXRpb25cXC9vY3RldC1zdHJlYW0vaS50ZXN0KGhlYWRlcnMuYWNjZXB0KTtcbiAgICBpZiAoIWlzQmluYXJ5UmVxdWVzdCkge1xuICAgICAgICBpZiAob3B0aW9ucy5tZWRpYVR5cGUuZm9ybWF0KSB7XG4gICAgICAgICAgICAvLyBlLmcuIGFwcGxpY2F0aW9uL3ZuZC5naXRodWIudjMranNvbiA9PiBhcHBsaWNhdGlvbi92bmQuZ2l0aHViLnYzLnJhd1xuICAgICAgICAgICAgaGVhZGVycy5hY2NlcHQgPSBoZWFkZXJzLmFjY2VwdFxuICAgICAgICAgICAgICAgIC5zcGxpdCgvLC8pXG4gICAgICAgICAgICAgICAgLm1hcCgocHJldmlldykgPT4gcHJldmlldy5yZXBsYWNlKC9hcHBsaWNhdGlvblxcL3ZuZChcXC5cXHcrKShcXC52Myk/KFxcLlxcdyspPyhcXCtqc29uKT8kLywgYGFwcGxpY2F0aW9uL3ZuZCQxJDIuJHtvcHRpb25zLm1lZGlhVHlwZS5mb3JtYXR9YCkpXG4gICAgICAgICAgICAgICAgLmpvaW4oXCIsXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLm1lZGlhVHlwZS5wcmV2aWV3cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IHByZXZpZXdzRnJvbUFjY2VwdEhlYWRlciA9IGhlYWRlcnMuYWNjZXB0Lm1hdGNoKC9bXFx3LV0rKD89LXByZXZpZXcpL2cpIHx8IFtdO1xuICAgICAgICAgICAgaGVhZGVycy5hY2NlcHQgPSBwcmV2aWV3c0Zyb21BY2NlcHRIZWFkZXJcbiAgICAgICAgICAgICAgICAuY29uY2F0KG9wdGlvbnMubWVkaWFUeXBlLnByZXZpZXdzKVxuICAgICAgICAgICAgICAgIC5tYXAoKHByZXZpZXcpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmb3JtYXQgPSBvcHRpb25zLm1lZGlhVHlwZS5mb3JtYXRcbiAgICAgICAgICAgICAgICAgICAgPyBgLiR7b3B0aW9ucy5tZWRpYVR5cGUuZm9ybWF0fWBcbiAgICAgICAgICAgICAgICAgICAgOiBcIitqc29uXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGBhcHBsaWNhdGlvbi92bmQuZ2l0aHViLiR7cHJldmlld30tcHJldmlldyR7Zm9ybWF0fWA7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5qb2luKFwiLFwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBmb3IgR0VUL0hFQUQgcmVxdWVzdHMsIHNldCBVUkwgcXVlcnkgcGFyYW1ldGVycyBmcm9tIHJlbWFpbmluZyBwYXJhbWV0ZXJzXG4gICAgLy8gZm9yIFBBVENIL1BPU1QvUFVUL0RFTEVURSByZXF1ZXN0cywgc2V0IHJlcXVlc3QgYm9keSBmcm9tIHJlbWFpbmluZyBwYXJhbWV0ZXJzXG4gICAgaWYgKFtcIkdFVFwiLCBcIkhFQURcIl0uaW5jbHVkZXMobWV0aG9kKSkge1xuICAgICAgICB1cmwgPSBhZGRRdWVyeVBhcmFtZXRlcnModXJsLCByZW1haW5pbmdQYXJhbWV0ZXJzKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChcImRhdGFcIiBpbiByZW1haW5pbmdQYXJhbWV0ZXJzKSB7XG4gICAgICAgICAgICBib2R5ID0gcmVtYWluaW5nUGFyYW1ldGVycy5kYXRhO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKHJlbWFpbmluZ1BhcmFtZXRlcnMpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGJvZHkgPSByZW1haW5pbmdQYXJhbWV0ZXJzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaGVhZGVyc1tcImNvbnRlbnQtbGVuZ3RoXCJdID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBkZWZhdWx0IGNvbnRlbnQtdHlwZSBmb3IgSlNPTiBpZiBib2R5IGlzIHNldFxuICAgIGlmICghaGVhZGVyc1tcImNvbnRlbnQtdHlwZVwiXSAmJiB0eXBlb2YgYm9keSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBoZWFkZXJzW1wiY29udGVudC10eXBlXCJdID0gXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCI7XG4gICAgfVxuICAgIC8vIEdpdEh1YiBleHBlY3RzICdjb250ZW50LWxlbmd0aDogMCcgaGVhZGVyIGZvciBQVVQvUEFUQ0ggcmVxdWVzdHMgd2l0aG91dCBib2R5LlxuICAgIC8vIGZldGNoIGRvZXMgbm90IGFsbG93IHRvIHNldCBgY29udGVudC1sZW5ndGhgIGhlYWRlciwgYnV0IHdlIGNhbiBzZXQgYm9keSB0byBhbiBlbXB0eSBzdHJpbmdcbiAgICBpZiAoW1wiUEFUQ0hcIiwgXCJQVVRcIl0uaW5jbHVkZXMobWV0aG9kKSAmJiB0eXBlb2YgYm9keSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBib2R5ID0gXCJcIjtcbiAgICB9XG4gICAgLy8gT25seSByZXR1cm4gYm9keS9yZXF1ZXN0IGtleXMgaWYgcHJlc2VudFxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHsgbWV0aG9kLCB1cmwsIGhlYWRlcnMgfSwgdHlwZW9mIGJvZHkgIT09IFwidW5kZWZpbmVkXCIgPyB7IGJvZHkgfSA6IG51bGwsIG9wdGlvbnMucmVxdWVzdCA/IHsgcmVxdWVzdDogb3B0aW9ucy5yZXF1ZXN0IH0gOiBudWxsKTtcbn1cblxuZnVuY3Rpb24gZW5kcG9pbnRXaXRoRGVmYXVsdHMoZGVmYXVsdHMsIHJvdXRlLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHBhcnNlKG1lcmdlKGRlZmF1bHRzLCByb3V0ZSwgb3B0aW9ucykpO1xufVxuXG5mdW5jdGlvbiB3aXRoRGVmYXVsdHMob2xkRGVmYXVsdHMsIG5ld0RlZmF1bHRzKSB7XG4gICAgY29uc3QgREVGQVVMVFMgPSBtZXJnZShvbGREZWZhdWx0cywgbmV3RGVmYXVsdHMpO1xuICAgIGNvbnN0IGVuZHBvaW50ID0gZW5kcG9pbnRXaXRoRGVmYXVsdHMuYmluZChudWxsLCBERUZBVUxUUyk7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oZW5kcG9pbnQsIHtcbiAgICAgICAgREVGQVVMVFMsXG4gICAgICAgIGRlZmF1bHRzOiB3aXRoRGVmYXVsdHMuYmluZChudWxsLCBERUZBVUxUUyksXG4gICAgICAgIG1lcmdlOiBtZXJnZS5iaW5kKG51bGwsIERFRkFVTFRTKSxcbiAgICAgICAgcGFyc2UsXG4gICAgfSk7XG59XG5cbmNvbnN0IFZFUlNJT04gPSBcIjYuMC4xMVwiO1xuXG5jb25zdCB1c2VyQWdlbnQgPSBgb2N0b2tpdC1lbmRwb2ludC5qcy8ke1ZFUlNJT059ICR7Z2V0VXNlckFnZW50KCl9YDtcbi8vIERFRkFVTFRTIGhhcyBhbGwgcHJvcGVydGllcyBzZXQgdGhhdCBFbmRwb2ludE9wdGlvbnMgaGFzLCBleGNlcHQgdXJsLlxuLy8gU28gd2UgdXNlIFJlcXVlc3RQYXJhbWV0ZXJzIGFuZCBhZGQgbWV0aG9kIGFzIGFkZGl0aW9uYWwgcmVxdWlyZWQgcHJvcGVydHkuXG5jb25zdCBERUZBVUxUUyA9IHtcbiAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgYmFzZVVybDogXCJodHRwczovL2FwaS5naXRodWIuY29tXCIsXG4gICAgaGVhZGVyczoge1xuICAgICAgICBhY2NlcHQ6IFwiYXBwbGljYXRpb24vdm5kLmdpdGh1Yi52Mytqc29uXCIsXG4gICAgICAgIFwidXNlci1hZ2VudFwiOiB1c2VyQWdlbnQsXG4gICAgfSxcbiAgICBtZWRpYVR5cGU6IHtcbiAgICAgICAgZm9ybWF0OiBcIlwiLFxuICAgICAgICBwcmV2aWV3czogW10sXG4gICAgfSxcbn07XG5cbmNvbnN0IGVuZHBvaW50ID0gd2l0aERlZmF1bHRzKG51bGwsIERFRkFVTFRTKTtcblxuZXhwb3J0IHsgZW5kcG9pbnQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcFxuIiwiLyohXG4gKiBpcy1wbGFpbi1vYmplY3QgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2lzLXBsYWluLW9iamVjdD5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNywgSm9uIFNjaGxpbmtlcnQuXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxuZnVuY3Rpb24gaXNPYmplY3Qobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pID09PSAnW29iamVjdCBPYmplY3RdJztcbn1cblxuZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvKSB7XG4gIHZhciBjdG9yLHByb3Q7XG5cbiAgaWYgKGlzT2JqZWN0KG8pID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIElmIGhhcyBtb2RpZmllZCBjb25zdHJ1Y3RvclxuICBjdG9yID0gby5jb25zdHJ1Y3RvcjtcbiAgaWYgKGN0b3IgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHRydWU7XG5cbiAgLy8gSWYgaGFzIG1vZGlmaWVkIHByb3RvdHlwZVxuICBwcm90ID0gY3Rvci5wcm90b3R5cGU7XG4gIGlmIChpc09iamVjdChwcm90KSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcblxuICAvLyBJZiBjb25zdHJ1Y3RvciBkb2VzIG5vdCBoYXZlIGFuIE9iamVjdC1zcGVjaWZpYyBtZXRob2RcbiAgaWYgKHByb3QuaGFzT3duUHJvcGVydHkoJ2lzUHJvdG90eXBlT2YnKSA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBNb3N0IGxpa2VseSBhIHBsYWluIE9iamVjdFxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IHsgaXNQbGFpbk9iamVjdCB9O1xuIiwiaW1wb3J0IHsgcmVxdWVzdCB9IGZyb20gJ0BvY3Rva2l0L3JlcXVlc3QnO1xuaW1wb3J0IHsgZ2V0VXNlckFnZW50IH0gZnJvbSAndW5pdmVyc2FsLXVzZXItYWdlbnQnO1xuXG5jb25zdCBWRVJTSU9OID0gXCI0LjYuMVwiO1xuXG5jbGFzcyBHcmFwaHFsRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IocmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IHJlc3BvbnNlLmRhdGEuZXJyb3JzWzBdLm1lc3NhZ2U7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHsgaGVhZGVyczogcmVzcG9uc2UuaGVhZGVycyB9KTtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJHcmFwaHFsRXJyb3JcIjtcbiAgICAgICAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgICAgICAgLy8gTWFpbnRhaW5zIHByb3BlciBzdGFjayB0cmFjZSAob25seSBhdmFpbGFibGUgb24gVjgpXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xuICAgICAgICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3Rvcik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IE5PTl9WQVJJQUJMRV9PUFRJT05TID0gW1xuICAgIFwibWV0aG9kXCIsXG4gICAgXCJiYXNlVXJsXCIsXG4gICAgXCJ1cmxcIixcbiAgICBcImhlYWRlcnNcIixcbiAgICBcInJlcXVlc3RcIixcbiAgICBcInF1ZXJ5XCIsXG4gICAgXCJtZWRpYVR5cGVcIixcbl07XG5jb25zdCBGT1JCSURERU5fVkFSSUFCTEVfT1BUSU9OUyA9IFtcInF1ZXJ5XCIsIFwibWV0aG9kXCIsIFwidXJsXCJdO1xuY29uc3QgR0hFU19WM19TVUZGSVhfUkVHRVggPSAvXFwvYXBpXFwvdjNcXC8/JC87XG5mdW5jdGlvbiBncmFwaHFsKHJlcXVlc3QsIHF1ZXJ5LCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBxdWVyeSA9PT0gXCJzdHJpbmdcIiAmJiBcInF1ZXJ5XCIgaW4gb3B0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihgW0BvY3Rva2l0L2dyYXBocWxdIFwicXVlcnlcIiBjYW5ub3QgYmUgdXNlZCBhcyB2YXJpYWJsZSBuYW1lYCkpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmICghRk9SQklEREVOX1ZBUklBQkxFX09QVElPTlMuaW5jbHVkZXMoa2V5KSlcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoYFtAb2N0b2tpdC9ncmFwaHFsXSBcIiR7a2V5fVwiIGNhbm5vdCBiZSB1c2VkIGFzIHZhcmlhYmxlIG5hbWVgKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcGFyc2VkT3B0aW9ucyA9IHR5cGVvZiBxdWVyeSA9PT0gXCJzdHJpbmdcIiA/IE9iamVjdC5hc3NpZ24oeyBxdWVyeSB9LCBvcHRpb25zKSA6IHF1ZXJ5O1xuICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zID0gT2JqZWN0LmtleXMocGFyc2VkT3B0aW9ucykucmVkdWNlKChyZXN1bHQsIGtleSkgPT4ge1xuICAgICAgICBpZiAoTk9OX1ZBUklBQkxFX09QVElPTlMuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBwYXJzZWRPcHRpb25zW2tleV07XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIGlmICghcmVzdWx0LnZhcmlhYmxlcykge1xuICAgICAgICAgICAgcmVzdWx0LnZhcmlhYmxlcyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdC52YXJpYWJsZXNba2V5XSA9IHBhcnNlZE9wdGlvbnNba2V5XTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LCB7fSk7XG4gICAgLy8gd29ya2Fyb3VuZCBmb3IgR2l0SHViIEVudGVycHJpc2UgYmFzZVVybCBzZXQgd2l0aCAvYXBpL3YzIHN1ZmZpeFxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9vY3Rva2l0L2F1dGgtYXBwLmpzL2lzc3Vlcy8xMTEjaXNzdWVjb21tZW50LTY1NzYxMDQ1MVxuICAgIGNvbnN0IGJhc2VVcmwgPSBwYXJzZWRPcHRpb25zLmJhc2VVcmwgfHwgcmVxdWVzdC5lbmRwb2ludC5ERUZBVUxUUy5iYXNlVXJsO1xuICAgIGlmIChHSEVTX1YzX1NVRkZJWF9SRUdFWC50ZXN0KGJhc2VVcmwpKSB7XG4gICAgICAgIHJlcXVlc3RPcHRpb25zLnVybCA9IGJhc2VVcmwucmVwbGFjZShHSEVTX1YzX1NVRkZJWF9SRUdFWCwgXCIvYXBpL2dyYXBocWxcIik7XG4gICAgfVxuICAgIHJldHVybiByZXF1ZXN0KHJlcXVlc3RPcHRpb25zKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS5lcnJvcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlcnMgPSB7fTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHJlc3BvbnNlLmhlYWRlcnMpKSB7XG4gICAgICAgICAgICAgICAgaGVhZGVyc1trZXldID0gcmVzcG9uc2UuaGVhZGVyc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgbmV3IEdyYXBocWxFcnJvcihyZXF1ZXN0T3B0aW9ucywge1xuICAgICAgICAgICAgICAgIGhlYWRlcnMsXG4gICAgICAgICAgICAgICAgZGF0YTogcmVzcG9uc2UuZGF0YSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhLmRhdGE7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHdpdGhEZWZhdWx0cyhyZXF1ZXN0JDEsIG5ld0RlZmF1bHRzKSB7XG4gICAgY29uc3QgbmV3UmVxdWVzdCA9IHJlcXVlc3QkMS5kZWZhdWx0cyhuZXdEZWZhdWx0cyk7XG4gICAgY29uc3QgbmV3QXBpID0gKHF1ZXJ5LCBvcHRpb25zKSA9PiB7XG4gICAgICAgIHJldHVybiBncmFwaHFsKG5ld1JlcXVlc3QsIHF1ZXJ5LCBvcHRpb25zKTtcbiAgICB9O1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKG5ld0FwaSwge1xuICAgICAgICBkZWZhdWx0czogd2l0aERlZmF1bHRzLmJpbmQobnVsbCwgbmV3UmVxdWVzdCksXG4gICAgICAgIGVuZHBvaW50OiByZXF1ZXN0LmVuZHBvaW50LFxuICAgIH0pO1xufVxuXG5jb25zdCBncmFwaHFsJDEgPSB3aXRoRGVmYXVsdHMocmVxdWVzdCwge1xuICAgIGhlYWRlcnM6IHtcbiAgICAgICAgXCJ1c2VyLWFnZW50XCI6IGBvY3Rva2l0LWdyYXBocWwuanMvJHtWRVJTSU9OfSAke2dldFVzZXJBZ2VudCgpfWAsXG4gICAgfSxcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIHVybDogXCIvZ3JhcGhxbFwiLFxufSk7XG5mdW5jdGlvbiB3aXRoQ3VzdG9tUmVxdWVzdChjdXN0b21SZXF1ZXN0KSB7XG4gICAgcmV0dXJuIHdpdGhEZWZhdWx0cyhjdXN0b21SZXF1ZXN0LCB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIHVybDogXCIvZ3JhcGhxbFwiLFxuICAgIH0pO1xufVxuXG5leHBvcnQgeyBncmFwaHFsJDEgYXMgZ3JhcGhxbCwgd2l0aEN1c3RvbVJlcXVlc3QgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcFxuIiwiaW1wb3J0IHsgRGVwcmVjYXRpb24gfSBmcm9tICdkZXByZWNhdGlvbic7XG5pbXBvcnQgb25jZSBmcm9tICdvbmNlJztcblxuY29uc3QgbG9nT25jZSA9IG9uY2UoKGRlcHJlY2F0aW9uKSA9PiBjb25zb2xlLndhcm4oZGVwcmVjYXRpb24pKTtcbi8qKlxuICogRXJyb3Igd2l0aCBleHRyYSBwcm9wZXJ0aWVzIHRvIGhlbHAgd2l0aCBkZWJ1Z2dpbmdcbiAqL1xuY2xhc3MgUmVxdWVzdEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIHN0YXR1c0NvZGUsIG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIC8vIE1haW50YWlucyBwcm9wZXIgc3RhY2sgdHJhY2UgKG9ubHkgYXZhaWxhYmxlIG9uIFY4KVxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICAgICAgICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubmFtZSA9IFwiSHR0cEVycm9yXCI7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzQ29kZTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwiY29kZVwiLCB7XG4gICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgICAgbG9nT25jZShuZXcgRGVwcmVjYXRpb24oXCJbQG9jdG9raXQvcmVxdWVzdC1lcnJvcl0gYGVycm9yLmNvZGVgIGlzIGRlcHJlY2F0ZWQsIHVzZSBgZXJyb3Iuc3RhdHVzYC5cIikpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0dXNDb2RlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaGVhZGVycyA9IG9wdGlvbnMuaGVhZGVycyB8fCB7fTtcbiAgICAgICAgLy8gcmVkYWN0IHJlcXVlc3QgY3JlZGVudGlhbHMgd2l0aG91dCBtdXRhdGluZyBvcmlnaW5hbCByZXF1ZXN0IG9wdGlvbnNcbiAgICAgICAgY29uc3QgcmVxdWVzdENvcHkgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLnJlcXVlc3QpO1xuICAgICAgICBpZiAob3B0aW9ucy5yZXF1ZXN0LmhlYWRlcnMuYXV0aG9yaXphdGlvbikge1xuICAgICAgICAgICAgcmVxdWVzdENvcHkuaGVhZGVycyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMucmVxdWVzdC5oZWFkZXJzLCB7XG4gICAgICAgICAgICAgICAgYXV0aG9yaXphdGlvbjogb3B0aW9ucy5yZXF1ZXN0LmhlYWRlcnMuYXV0aG9yaXphdGlvbi5yZXBsYWNlKC8gLiokLywgXCIgW1JFREFDVEVEXVwiKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RDb3B5LnVybCA9IHJlcXVlc3RDb3B5LnVybFxuICAgICAgICAgICAgLy8gY2xpZW50X2lkICYgY2xpZW50X3NlY3JldCBjYW4gYmUgcGFzc2VkIGFzIFVSTCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGluY3JlYXNlIHJhdGUgbGltaXRcbiAgICAgICAgICAgIC8vIHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzLyNpbmNyZWFzaW5nLXRoZS11bmF1dGhlbnRpY2F0ZWQtcmF0ZS1saW1pdC1mb3Itb2F1dGgtYXBwbGljYXRpb25zXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxiY2xpZW50X3NlY3JldD1cXHcrL2csIFwiY2xpZW50X3NlY3JldD1bUkVEQUNURURdXCIpXG4gICAgICAgICAgICAvLyBPQXV0aCB0b2tlbnMgY2FuIGJlIHBhc3NlZCBhcyBVUkwgcXVlcnkgcGFyYW1ldGVycywgYWx0aG91Z2ggaXQgaXMgbm90IHJlY29tbWVuZGVkXG4gICAgICAgICAgICAvLyBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My8jb2F1dGgyLXRva2VuLXNlbnQtaW4tYS1oZWFkZXJcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXGJhY2Nlc3NfdG9rZW49XFx3Ky9nLCBcImFjY2Vzc190b2tlbj1bUkVEQUNURURdXCIpO1xuICAgICAgICB0aGlzLnJlcXVlc3QgPSByZXF1ZXN0Q29weTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IFJlcXVlc3RFcnJvciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwXG4iLCJpbXBvcnQgeyBlbmRwb2ludCB9IGZyb20gJ0BvY3Rva2l0L2VuZHBvaW50JztcbmltcG9ydCB7IGdldFVzZXJBZ2VudCB9IGZyb20gJ3VuaXZlcnNhbC11c2VyLWFnZW50JztcbmltcG9ydCB7IGlzUGxhaW5PYmplY3QgfSBmcm9tICdpcy1wbGFpbi1vYmplY3QnO1xuaW1wb3J0IG5vZGVGZXRjaCBmcm9tICdub2RlLWZldGNoJztcbmltcG9ydCB7IFJlcXVlc3RFcnJvciB9IGZyb20gJ0BvY3Rva2l0L3JlcXVlc3QtZXJyb3InO1xuXG5jb25zdCBWRVJTSU9OID0gXCI1LjQuMTVcIjtcblxuZnVuY3Rpb24gZ2V0QnVmZmVyUmVzcG9uc2UocmVzcG9uc2UpIHtcbiAgICByZXR1cm4gcmVzcG9uc2UuYXJyYXlCdWZmZXIoKTtcbn1cblxuZnVuY3Rpb24gZmV0Y2hXcmFwcGVyKHJlcXVlc3RPcHRpb25zKSB7XG4gICAgaWYgKGlzUGxhaW5PYmplY3QocmVxdWVzdE9wdGlvbnMuYm9keSkgfHxcbiAgICAgICAgQXJyYXkuaXNBcnJheShyZXF1ZXN0T3B0aW9ucy5ib2R5KSkge1xuICAgICAgICByZXF1ZXN0T3B0aW9ucy5ib2R5ID0gSlNPTi5zdHJpbmdpZnkocmVxdWVzdE9wdGlvbnMuYm9keSk7XG4gICAgfVxuICAgIGxldCBoZWFkZXJzID0ge307XG4gICAgbGV0IHN0YXR1cztcbiAgICBsZXQgdXJsO1xuICAgIGNvbnN0IGZldGNoID0gKHJlcXVlc3RPcHRpb25zLnJlcXVlc3QgJiYgcmVxdWVzdE9wdGlvbnMucmVxdWVzdC5mZXRjaCkgfHwgbm9kZUZldGNoO1xuICAgIHJldHVybiBmZXRjaChyZXF1ZXN0T3B0aW9ucy51cmwsIE9iamVjdC5hc3NpZ24oe1xuICAgICAgICBtZXRob2Q6IHJlcXVlc3RPcHRpb25zLm1ldGhvZCxcbiAgICAgICAgYm9keTogcmVxdWVzdE9wdGlvbnMuYm9keSxcbiAgICAgICAgaGVhZGVyczogcmVxdWVzdE9wdGlvbnMuaGVhZGVycyxcbiAgICAgICAgcmVkaXJlY3Q6IHJlcXVlc3RPcHRpb25zLnJlZGlyZWN0LFxuICAgIH0sIFxuICAgIC8vIGByZXF1ZXN0T3B0aW9ucy5yZXF1ZXN0LmFnZW50YCB0eXBlIGlzIGluY29tcGF0aWJsZVxuICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vb2N0b2tpdC90eXBlcy50cy9wdWxsLzI2NFxuICAgIHJlcXVlc3RPcHRpb25zLnJlcXVlc3QpKVxuICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgdXJsID0gcmVzcG9uc2UudXJsO1xuICAgICAgICBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XG4gICAgICAgIGZvciAoY29uc3Qga2V5QW5kVmFsdWUgb2YgcmVzcG9uc2UuaGVhZGVycykge1xuICAgICAgICAgICAgaGVhZGVyc1trZXlBbmRWYWx1ZVswXV0gPSBrZXlBbmRWYWx1ZVsxXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhdHVzID09PSAyMDQgfHwgc3RhdHVzID09PSAyMDUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBHaXRIdWIgQVBJIHJldHVybnMgMjAwIGZvciBIRUFEIHJlcXVlc3RzXG4gICAgICAgIGlmIChyZXF1ZXN0T3B0aW9ucy5tZXRob2QgPT09IFwiSEVBRFwiKSB7XG4gICAgICAgICAgICBpZiAoc3RhdHVzIDwgNDAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgbmV3IFJlcXVlc3RFcnJvcihyZXNwb25zZS5zdGF0dXNUZXh0LCBzdGF0dXMsIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzLFxuICAgICAgICAgICAgICAgIHJlcXVlc3Q6IHJlcXVlc3RPcHRpb25zLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMzA0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVxdWVzdEVycm9yKFwiTm90IG1vZGlmaWVkXCIsIHN0YXR1cywge1xuICAgICAgICAgICAgICAgIGhlYWRlcnMsXG4gICAgICAgICAgICAgICAgcmVxdWVzdDogcmVxdWVzdE9wdGlvbnMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhdHVzID49IDQwMCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICAgICAgICAgICAgLnRleHQoKVxuICAgICAgICAgICAgICAgIC50aGVuKChtZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgUmVxdWVzdEVycm9yKG1lc3NhZ2UsIHN0YXR1cywge1xuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzLFxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0OiByZXF1ZXN0T3B0aW9ucyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2VCb2R5ID0gSlNPTi5wYXJzZShlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihlcnJvciwgcmVzcG9uc2VCb2R5KTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVycm9ycyA9IHJlc3BvbnNlQm9keS5lcnJvcnM7XG4gICAgICAgICAgICAgICAgICAgIC8vIEFzc3VtcHRpb24gYGVycm9yc2Agd291bGQgYWx3YXlzIGJlIGluIEFycmF5IGZvcm1hdFxuICAgICAgICAgICAgICAgICAgICBlcnJvci5tZXNzYWdlID1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yLm1lc3NhZ2UgKyBcIjogXCIgKyBlcnJvcnMubWFwKEpTT04uc3RyaW5naWZ5KS5qb2luKFwiLCBcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlnbm9yZSwgc2VlIG9jdG9raXQvcmVzdC5qcyM2ODRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb250ZW50VHlwZSA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpO1xuICAgICAgICBpZiAoL2FwcGxpY2F0aW9uXFwvanNvbi8udGVzdChjb250ZW50VHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjb250ZW50VHlwZSB8fCAvXnRleHRcXC98Y2hhcnNldD11dGYtOCQvLnRlc3QoY29udGVudFR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnZXRCdWZmZXJSZXNwb25zZShyZXNwb25zZSk7XG4gICAgfSlcbiAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1cyxcbiAgICAgICAgICAgIHVybCxcbiAgICAgICAgICAgIGhlYWRlcnMsXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICB9O1xuICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgUmVxdWVzdEVycm9yKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgUmVxdWVzdEVycm9yKGVycm9yLm1lc3NhZ2UsIDUwMCwge1xuICAgICAgICAgICAgaGVhZGVycyxcbiAgICAgICAgICAgIHJlcXVlc3Q6IHJlcXVlc3RPcHRpb25zLFxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gd2l0aERlZmF1bHRzKG9sZEVuZHBvaW50LCBuZXdEZWZhdWx0cykge1xuICAgIGNvbnN0IGVuZHBvaW50ID0gb2xkRW5kcG9pbnQuZGVmYXVsdHMobmV3RGVmYXVsdHMpO1xuICAgIGNvbnN0IG5ld0FwaSA9IGZ1bmN0aW9uIChyb3V0ZSwgcGFyYW1ldGVycykge1xuICAgICAgICBjb25zdCBlbmRwb2ludE9wdGlvbnMgPSBlbmRwb2ludC5tZXJnZShyb3V0ZSwgcGFyYW1ldGVycyk7XG4gICAgICAgIGlmICghZW5kcG9pbnRPcHRpb25zLnJlcXVlc3QgfHwgIWVuZHBvaW50T3B0aW9ucy5yZXF1ZXN0Lmhvb2spIHtcbiAgICAgICAgICAgIHJldHVybiBmZXRjaFdyYXBwZXIoZW5kcG9pbnQucGFyc2UoZW5kcG9pbnRPcHRpb25zKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVxdWVzdCA9IChyb3V0ZSwgcGFyYW1ldGVycykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGZldGNoV3JhcHBlcihlbmRwb2ludC5wYXJzZShlbmRwb2ludC5tZXJnZShyb3V0ZSwgcGFyYW1ldGVycykpKTtcbiAgICAgICAgfTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyZXF1ZXN0LCB7XG4gICAgICAgICAgICBlbmRwb2ludCxcbiAgICAgICAgICAgIGRlZmF1bHRzOiB3aXRoRGVmYXVsdHMuYmluZChudWxsLCBlbmRwb2ludCksXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZW5kcG9pbnRPcHRpb25zLnJlcXVlc3QuaG9vayhyZXF1ZXN0LCBlbmRwb2ludE9wdGlvbnMpO1xuICAgIH07XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24obmV3QXBpLCB7XG4gICAgICAgIGVuZHBvaW50LFxuICAgICAgICBkZWZhdWx0czogd2l0aERlZmF1bHRzLmJpbmQobnVsbCwgZW5kcG9pbnQpLFxuICAgIH0pO1xufVxuXG5jb25zdCByZXF1ZXN0ID0gd2l0aERlZmF1bHRzKGVuZHBvaW50LCB7XG4gICAgaGVhZGVyczoge1xuICAgICAgICBcInVzZXItYWdlbnRcIjogYG9jdG9raXQtcmVxdWVzdC5qcy8ke1ZFUlNJT059ICR7Z2V0VXNlckFnZW50KCl9YCxcbiAgICB9LFxufSk7XG5cbmV4cG9ydCB7IHJlcXVlc3QgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcFxuIiwiLyohXG4gKiBpcy1wbGFpbi1vYmplY3QgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2lzLXBsYWluLW9iamVjdD5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNywgSm9uIFNjaGxpbmtlcnQuXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxuZnVuY3Rpb24gaXNPYmplY3Qobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pID09PSAnW29iamVjdCBPYmplY3RdJztcbn1cblxuZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvKSB7XG4gIHZhciBjdG9yLHByb3Q7XG5cbiAgaWYgKGlzT2JqZWN0KG8pID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIElmIGhhcyBtb2RpZmllZCBjb25zdHJ1Y3RvclxuICBjdG9yID0gby5jb25zdHJ1Y3RvcjtcbiAgaWYgKGN0b3IgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHRydWU7XG5cbiAgLy8gSWYgaGFzIG1vZGlmaWVkIHByb3RvdHlwZVxuICBwcm90ID0gY3Rvci5wcm90b3R5cGU7XG4gIGlmIChpc09iamVjdChwcm90KSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcblxuICAvLyBJZiBjb25zdHJ1Y3RvciBkb2VzIG5vdCBoYXZlIGFuIE9iamVjdC1zcGVjaWZpYyBtZXRob2RcbiAgaWYgKHByb3QuaGFzT3duUHJvcGVydHkoJ2lzUHJvdG90eXBlT2YnKSA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBNb3N0IGxpa2VseSBhIHBsYWluIE9iamVjdFxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IHsgaXNQbGFpbk9iamVjdCB9O1xuIiwidmFyIHJlZ2lzdGVyID0gcmVxdWlyZSgnLi9saWIvcmVnaXN0ZXInKVxudmFyIGFkZEhvb2sgPSByZXF1aXJlKCcuL2xpYi9hZGQnKVxudmFyIHJlbW92ZUhvb2sgPSByZXF1aXJlKCcuL2xpYi9yZW1vdmUnKVxuXG4vLyBiaW5kIHdpdGggYXJyYXkgb2YgYXJndW1lbnRzOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjE3OTI5MTNcbnZhciBiaW5kID0gRnVuY3Rpb24uYmluZFxudmFyIGJpbmRhYmxlID0gYmluZC5iaW5kKGJpbmQpXG5cbmZ1bmN0aW9uIGJpbmRBcGkgKGhvb2ssIHN0YXRlLCBuYW1lKSB7XG4gIHZhciByZW1vdmVIb29rUmVmID0gYmluZGFibGUocmVtb3ZlSG9vaywgbnVsbCkuYXBwbHkobnVsbCwgbmFtZSA/IFtzdGF0ZSwgbmFtZV0gOiBbc3RhdGVdKVxuICBob29rLmFwaSA9IHsgcmVtb3ZlOiByZW1vdmVIb29rUmVmIH1cbiAgaG9vay5yZW1vdmUgPSByZW1vdmVIb29rUmVmXG5cbiAgO1snYmVmb3JlJywgJ2Vycm9yJywgJ2FmdGVyJywgJ3dyYXAnXS5mb3JFYWNoKGZ1bmN0aW9uIChraW5kKSB7XG4gICAgdmFyIGFyZ3MgPSBuYW1lID8gW3N0YXRlLCBraW5kLCBuYW1lXSA6IFtzdGF0ZSwga2luZF1cbiAgICBob29rW2tpbmRdID0gaG9vay5hcGlba2luZF0gPSBiaW5kYWJsZShhZGRIb29rLCBudWxsKS5hcHBseShudWxsLCBhcmdzKVxuICB9KVxufVxuXG5mdW5jdGlvbiBIb29rU2luZ3VsYXIgKCkge1xuICB2YXIgc2luZ3VsYXJIb29rTmFtZSA9ICdoJ1xuICB2YXIgc2luZ3VsYXJIb29rU3RhdGUgPSB7XG4gICAgcmVnaXN0cnk6IHt9XG4gIH1cbiAgdmFyIHNpbmd1bGFySG9vayA9IHJlZ2lzdGVyLmJpbmQobnVsbCwgc2luZ3VsYXJIb29rU3RhdGUsIHNpbmd1bGFySG9va05hbWUpXG4gIGJpbmRBcGkoc2luZ3VsYXJIb29rLCBzaW5ndWxhckhvb2tTdGF0ZSwgc2luZ3VsYXJIb29rTmFtZSlcbiAgcmV0dXJuIHNpbmd1bGFySG9va1xufVxuXG5mdW5jdGlvbiBIb29rQ29sbGVjdGlvbiAoKSB7XG4gIHZhciBzdGF0ZSA9IHtcbiAgICByZWdpc3RyeToge31cbiAgfVxuXG4gIHZhciBob29rID0gcmVnaXN0ZXIuYmluZChudWxsLCBzdGF0ZSlcbiAgYmluZEFwaShob29rLCBzdGF0ZSlcblxuICByZXR1cm4gaG9va1xufVxuXG52YXIgY29sbGVjdGlvbkhvb2tEZXByZWNhdGlvbk1lc3NhZ2VEaXNwbGF5ZWQgPSBmYWxzZVxuZnVuY3Rpb24gSG9vayAoKSB7XG4gIGlmICghY29sbGVjdGlvbkhvb2tEZXByZWNhdGlvbk1lc3NhZ2VEaXNwbGF5ZWQpIHtcbiAgICBjb25zb2xlLndhcm4oJ1tiZWZvcmUtYWZ0ZXItaG9va106IFwiSG9vaygpXCIgcmVwdXJwb3Npbmcgd2FybmluZywgdXNlIFwiSG9vay5Db2xsZWN0aW9uKClcIi4gUmVhZCBtb3JlOiBodHRwczovL2dpdC5pby91cGdyYWRlLWJlZm9yZS1hZnRlci1ob29rLXRvLTEuNCcpXG4gICAgY29sbGVjdGlvbkhvb2tEZXByZWNhdGlvbk1lc3NhZ2VEaXNwbGF5ZWQgPSB0cnVlXG4gIH1cbiAgcmV0dXJuIEhvb2tDb2xsZWN0aW9uKClcbn1cblxuSG9vay5TaW5ndWxhciA9IEhvb2tTaW5ndWxhci5iaW5kKClcbkhvb2suQ29sbGVjdGlvbiA9IEhvb2tDb2xsZWN0aW9uLmJpbmQoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEhvb2tcbi8vIGV4cG9zZSBjb25zdHJ1Y3RvcnMgYXMgYSBuYW1lZCBwcm9wZXJ0eSBmb3IgVHlwZVNjcmlwdFxubW9kdWxlLmV4cG9ydHMuSG9vayA9IEhvb2tcbm1vZHVsZS5leHBvcnRzLlNpbmd1bGFyID0gSG9vay5TaW5ndWxhclxubW9kdWxlLmV4cG9ydHMuQ29sbGVjdGlvbiA9IEhvb2suQ29sbGVjdGlvblxuIiwibW9kdWxlLmV4cG9ydHMgPSBhZGRIb29rO1xuXG5mdW5jdGlvbiBhZGRIb29rKHN0YXRlLCBraW5kLCBuYW1lLCBob29rKSB7XG4gIHZhciBvcmlnID0gaG9vaztcbiAgaWYgKCFzdGF0ZS5yZWdpc3RyeVtuYW1lXSkge1xuICAgIHN0YXRlLnJlZ2lzdHJ5W25hbWVdID0gW107XG4gIH1cblxuICBpZiAoa2luZCA9PT0gXCJiZWZvcmVcIikge1xuICAgIGhvb2sgPSBmdW5jdGlvbiAobWV0aG9kLCBvcHRpb25zKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgLnRoZW4ob3JpZy5iaW5kKG51bGwsIG9wdGlvbnMpKVxuICAgICAgICAudGhlbihtZXRob2QuYmluZChudWxsLCBvcHRpb25zKSk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChraW5kID09PSBcImFmdGVyXCIpIHtcbiAgICBob29rID0gZnVuY3Rpb24gKG1ldGhvZCwgb3B0aW9ucykge1xuICAgICAgdmFyIHJlc3VsdDtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgICAudGhlbihtZXRob2QuYmluZChudWxsLCBvcHRpb25zKSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3VsdF8pIHtcbiAgICAgICAgICByZXN1bHQgPSByZXN1bHRfO1xuICAgICAgICAgIHJldHVybiBvcmlnKHJlc3VsdCwgb3B0aW9ucyk7XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKGtpbmQgPT09IFwiZXJyb3JcIikge1xuICAgIGhvb2sgPSBmdW5jdGlvbiAobWV0aG9kLCBvcHRpb25zKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgLnRoZW4obWV0aG9kLmJpbmQobnVsbCwgb3B0aW9ucykpXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gb3JpZyhlcnJvciwgb3B0aW9ucyk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gIH1cblxuICBzdGF0ZS5yZWdpc3RyeVtuYW1lXS5wdXNoKHtcbiAgICBob29rOiBob29rLFxuICAgIG9yaWc6IG9yaWcsXG4gIH0pO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZWdpc3RlcjtcblxuZnVuY3Rpb24gcmVnaXN0ZXIoc3RhdGUsIG5hbWUsIG1ldGhvZCwgb3B0aW9ucykge1xuICBpZiAodHlwZW9mIG1ldGhvZCAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwibWV0aG9kIGZvciBiZWZvcmUgaG9vayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheShuYW1lKSkge1xuICAgIHJldHVybiBuYW1lLnJldmVyc2UoKS5yZWR1Y2UoZnVuY3Rpb24gKGNhbGxiYWNrLCBuYW1lKSB7XG4gICAgICByZXR1cm4gcmVnaXN0ZXIuYmluZChudWxsLCBzdGF0ZSwgbmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuICAgIH0sIG1ldGhvZCkoKTtcbiAgfVxuXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXN0YXRlLnJlZ2lzdHJ5W25hbWVdKSB7XG4gICAgICByZXR1cm4gbWV0aG9kKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0ZS5yZWdpc3RyeVtuYW1lXS5yZWR1Y2UoZnVuY3Rpb24gKG1ldGhvZCwgcmVnaXN0ZXJlZCkge1xuICAgICAgcmV0dXJuIHJlZ2lzdGVyZWQuaG9vay5iaW5kKG51bGwsIG1ldGhvZCwgb3B0aW9ucyk7XG4gICAgfSwgbWV0aG9kKSgpO1xuICB9KTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVtb3ZlSG9vaztcblxuZnVuY3Rpb24gcmVtb3ZlSG9vayhzdGF0ZSwgbmFtZSwgbWV0aG9kKSB7XG4gIGlmICghc3RhdGUucmVnaXN0cnlbbmFtZV0pIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgaW5kZXggPSBzdGF0ZS5yZWdpc3RyeVtuYW1lXVxuICAgIC5tYXAoZnVuY3Rpb24gKHJlZ2lzdGVyZWQpIHtcbiAgICAgIHJldHVybiByZWdpc3RlcmVkLm9yaWc7XG4gICAgfSlcbiAgICAuaW5kZXhPZihtZXRob2QpO1xuXG4gIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzdGF0ZS5yZWdpc3RyeVtuYW1lXS5zcGxpY2UoaW5kZXgsIDEpO1xufVxuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9jc3NXaXRoTWFwcGluZ1RvU3RyaW5nLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCIqIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG5cXG5ib2R5IHtcXG4gIGZvbnQtZmFtaWx5OiAnUm9ib3RvJywgc2Fucy1zZXJpZjtcXG59XFxuXFxuaDEge1xcbiAgZm9udC1zaXplOiAyLjNyZW07XFxuICBmb250LXdlaWdodDogNzAwO1xcbn1cXG5cXG4uY29udGFpbmVyIHtcXG4gIHdpZHRoOiA5MCU7XFxuICBtYXJnaW46IDAgYXV0bztcXG59XFxuXFxuLnJvdyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbn1cXG5cXG4ucm93LWJldHdlZW4ge1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcbn1cXG5cXG4udXNlcmxpc3Qtc2VjdGlvbiB7XFxufVxcblxcbi51c2VybGlzdC1zZWN0aW9uX19oZWFkZXIge1xcbiAgcGFkZGluZzogMS4zZW0gMDtcXG59XFxuXFxuLnVzZXJsaXN0LXNlY3Rpb25fX25hdiB7XFxufVxcblxcbi51c2VybGlzdC1zZWN0aW9uX19zZWFyY2gtdGFiIHtcXG59XFxuXFxuLnRhYiB7XFxuICBwYWRkaW5nLWJvdHRvbTogMC40ZW07XFxuICB3aWR0aDogMTAwJTtcXG4gIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi50YWItLWFjdGl2ZSB7XFxuICBib3JkZXItYm90dG9tOiA1cHggc29saWQgIzE5ODBmYTtcXG59XFxuXFxuLnVzZXJsaXN0LXNlY3Rpb25fX3NlYXJjaC1iYXIge1xcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkIGJsYWNrO1xcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIGJsYWNrO1xcblxcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuLnVzZXJsaXN0LXNlY3Rpb25fX3NlYXJjaC1pbnB1dCB7XFxuICBib3JkZXI6IG5vbmU7XFxuICBwYWRkaW5nOiAwLjVlbSAwO1xcbiAgZm9udC1zaXplOiAxLjVyZW07XFxuICB3aWR0aDogNzUlO1xcbn1cXG5cXG4udXNlcmxpc3Qtc2VjdGlvbl9fc2VhcmNoLWJ0biB7XFxuICBib3JkZXI6IG5vbmU7XFxuICBiYWNrZ3JvdW5kOiBub25lO1xcbn1cXG5cXG4udXNlcmxpc3Qtc2VjdGlvbl9fc2VhcmNoLWljb24ge1xcbiAgLyogYmFja2dyb3VuZDogZ3JlZW47ICovXFxufVxcblxcbi8qKioqKioqKioqKioqIFxcbm1haW5cXG4qKioqKioqKioqKioqKi9cXG5cXG4udXNlcnMge1xcbn1cXG5cXG4udXNlcnNfX3JvdyB7XFxufVxcblxcbi51c2Vyc19fcm93LXRpdGxlIHtcXG4gIGNvbG9yOiAjMGYwZjBmO1xcbn1cXG5cXG4udXNlciB7XFxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgYmxhY2s7XFxuICBwYWRkaW5nOiAwLjNlbSAwO1xcblxcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuLnVzZXJfX2ltZyB7XFxuICBib3JkZXItcmFkaXVzOiAxMDBweDtcXG4gIGhlaWdodDogNjBweDtcXG4gIHdpZHRoOiA2MHB4O1xcbn1cXG5cXG4udXNlcl9fbmFtZSB7XFxuICBmb250LXNpemU6IDEuMjVyZW07XFxuICBjb2xvcjogZ3JlZW47XFxufVxcblxcbi51c2VyX19mYXZvcml0ZSB7XFxuICBiYWNrZ3JvdW5kOiBub25lO1xcbiAgYm9yZGVyOiBub25lO1xcbiAgb3V0bGluZTogbm9uZTtcXG59XFxuXFxuLnN0YXItaWNvbiB7XFxuICBmaWxsOiAjZmZmO1xcbiAgc3Ryb2tlLXdpZHRoOiAxO1xcbiAgc3Ryb2tlOiAjMDAwO1xcbn1cXG5cXG4uc3Rhci1pY29uLS1hY3RpdmUge1xcbiAgZmlsbDogIzE5ODBmYTtcXG59XFxuXCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlcy9zdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSxTQUFTO0VBQ1QsVUFBVTtFQUNWLHNCQUFzQjtBQUN4Qjs7QUFFQTtFQUNFLGlDQUFpQztBQUNuQzs7QUFFQTtFQUNFLGlCQUFpQjtFQUNqQixnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSxVQUFVO0VBQ1YsY0FBYztBQUNoQjs7QUFFQTtFQUNFLGFBQWE7QUFDZjs7QUFFQTtFQUNFLDhCQUE4QjtBQUNoQzs7QUFFQTtBQUNBOztBQUVBO0VBQ0UsZ0JBQWdCO0FBQ2xCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtFQUNFLHFCQUFxQjtFQUNyQixXQUFXO0VBQ1gsaUJBQWlCO0VBQ2pCLHlCQUF5QjtFQUN6QixhQUFhO0VBQ2IsdUJBQXVCO0VBQ3ZCLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLGdDQUFnQztBQUNsQzs7QUFFQTtFQUNFLDJCQUEyQjtFQUMzQiw4QkFBOEI7O0VBRTlCLDhCQUE4QjtFQUM5QixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxZQUFZO0VBQ1osZ0JBQWdCO0VBQ2hCLGlCQUFpQjtFQUNqQixVQUFVO0FBQ1o7O0FBRUE7RUFDRSxZQUFZO0VBQ1osZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsdUJBQXVCO0FBQ3pCOztBQUVBOztjQUVjOztBQUVkO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtFQUNFLGNBQWM7QUFDaEI7O0FBRUE7RUFDRSw4QkFBOEI7RUFDOUIsZ0JBQWdCOztFQUVoQiw4QkFBOEI7RUFDOUIsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLFlBQVk7RUFDWixXQUFXO0FBQ2I7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsWUFBWTtBQUNkOztBQUVBO0VBQ0UsZ0JBQWdCO0VBQ2hCLFlBQVk7RUFDWixhQUFhO0FBQ2Y7O0FBRUE7RUFDRSxVQUFVO0VBQ1YsZUFBZTtFQUNmLFlBQVk7QUFDZDs7QUFFQTtFQUNFLGFBQWE7QUFDZlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIqIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG5cXG5ib2R5IHtcXG4gIGZvbnQtZmFtaWx5OiAnUm9ib3RvJywgc2Fucy1zZXJpZjtcXG59XFxuXFxuaDEge1xcbiAgZm9udC1zaXplOiAyLjNyZW07XFxuICBmb250LXdlaWdodDogNzAwO1xcbn1cXG5cXG4uY29udGFpbmVyIHtcXG4gIHdpZHRoOiA5MCU7XFxuICBtYXJnaW46IDAgYXV0bztcXG59XFxuXFxuLnJvdyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbn1cXG5cXG4ucm93LWJldHdlZW4ge1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcbn1cXG5cXG4udXNlcmxpc3Qtc2VjdGlvbiB7XFxufVxcblxcbi51c2VybGlzdC1zZWN0aW9uX19oZWFkZXIge1xcbiAgcGFkZGluZzogMS4zZW0gMDtcXG59XFxuXFxuLnVzZXJsaXN0LXNlY3Rpb25fX25hdiB7XFxufVxcblxcbi51c2VybGlzdC1zZWN0aW9uX19zZWFyY2gtdGFiIHtcXG59XFxuXFxuLnRhYiB7XFxuICBwYWRkaW5nLWJvdHRvbTogMC40ZW07XFxuICB3aWR0aDogMTAwJTtcXG4gIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi50YWItLWFjdGl2ZSB7XFxuICBib3JkZXItYm90dG9tOiA1cHggc29saWQgIzE5ODBmYTtcXG59XFxuXFxuLnVzZXJsaXN0LXNlY3Rpb25fX3NlYXJjaC1iYXIge1xcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkIGJsYWNrO1xcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIGJsYWNrO1xcblxcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuLnVzZXJsaXN0LXNlY3Rpb25fX3NlYXJjaC1pbnB1dCB7XFxuICBib3JkZXI6IG5vbmU7XFxuICBwYWRkaW5nOiAwLjVlbSAwO1xcbiAgZm9udC1zaXplOiAxLjVyZW07XFxuICB3aWR0aDogNzUlO1xcbn1cXG5cXG4udXNlcmxpc3Qtc2VjdGlvbl9fc2VhcmNoLWJ0biB7XFxuICBib3JkZXI6IG5vbmU7XFxuICBiYWNrZ3JvdW5kOiBub25lO1xcbn1cXG5cXG4udXNlcmxpc3Qtc2VjdGlvbl9fc2VhcmNoLWljb24ge1xcbiAgLyogYmFja2dyb3VuZDogZ3JlZW47ICovXFxufVxcblxcbi8qKioqKioqKioqKioqIFxcbm1haW5cXG4qKioqKioqKioqKioqKi9cXG5cXG4udXNlcnMge1xcbn1cXG5cXG4udXNlcnNfX3JvdyB7XFxufVxcblxcbi51c2Vyc19fcm93LXRpdGxlIHtcXG4gIGNvbG9yOiAjMGYwZjBmO1xcbn1cXG5cXG4udXNlciB7XFxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgYmxhY2s7XFxuICBwYWRkaW5nOiAwLjNlbSAwO1xcblxcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuLnVzZXJfX2ltZyB7XFxuICBib3JkZXItcmFkaXVzOiAxMDBweDtcXG4gIGhlaWdodDogNjBweDtcXG4gIHdpZHRoOiA2MHB4O1xcbn1cXG5cXG4udXNlcl9fbmFtZSB7XFxuICBmb250LXNpemU6IDEuMjVyZW07XFxuICBjb2xvcjogZ3JlZW47XFxufVxcblxcbi51c2VyX19mYXZvcml0ZSB7XFxuICBiYWNrZ3JvdW5kOiBub25lO1xcbiAgYm9yZGVyOiBub25lO1xcbiAgb3V0bGluZTogbm9uZTtcXG59XFxuXFxuLnN0YXItaWNvbiB7XFxuICBmaWxsOiAjZmZmO1xcbiAgc3Ryb2tlLXdpZHRoOiAxO1xcbiAgc3Ryb2tlOiAjMDAwO1xcbn1cXG5cXG4uc3Rhci1pY29uLS1hY3RpdmUge1xcbiAgZmlsbDogIzE5ODBmYTtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107IC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblxuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG5cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIHJldHVybiBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoY29udGVudCwgXCJ9XCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9OyAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuXG5cbiAgbGlzdC5pID0gZnVuY3Rpb24gKG1vZHVsZXMsIG1lZGlhUXVlcnksIGRlZHVwZSkge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XG4gICAgfVxuXG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblxuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLWRlc3RydWN0dXJpbmdcbiAgICAgICAgdmFyIGlkID0gdGhpc1tpXVswXTtcblxuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBtb2R1bGVzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfaV0pO1xuXG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnRpbnVlXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAobWVkaWFRdWVyeSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWFRdWVyeTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzJdID0gXCJcIi5jb25jYXQobWVkaWFRdWVyeSwgXCIgYW5kIFwiKS5jb25jYXQoaXRlbVsyXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF9zbGljZWRUb0FycmF5KGFyciwgaSkgeyByZXR1cm4gX2FycmF5V2l0aEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgfHwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFyciwgaSkgfHwgX25vbkl0ZXJhYmxlUmVzdCgpOyB9XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7IH1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikgeyBpZiAoIW8pIHJldHVybjsgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpOyBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lOyBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTsgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB9XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7IGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoOyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcInVuZGVmaW5lZFwiIHx8ICEoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChhcnIpKSkgcmV0dXJuOyB2YXIgX2FyciA9IFtdOyB2YXIgX24gPSB0cnVlOyB2YXIgX2QgPSBmYWxzZTsgdmFyIF9lID0gdW5kZWZpbmVkOyB0cnkgeyBmb3IgKHZhciBfaSA9IGFycltTeW1ib2wuaXRlcmF0b3JdKCksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7IF9hcnIucHVzaChfcy52YWx1ZSk7IGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhazsgfSB9IGNhdGNoIChlcnIpIHsgX2QgPSB0cnVlOyBfZSA9IGVycjsgfSBmaW5hbGx5IHsgdHJ5IHsgaWYgKCFfbiAmJiBfaVtcInJldHVyblwiXSAhPSBudWxsKSBfaVtcInJldHVyblwiXSgpOyB9IGZpbmFsbHkgeyBpZiAoX2QpIHRocm93IF9lOyB9IH0gcmV0dXJuIF9hcnI7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gYXJyOyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKSB7XG4gIHZhciBfaXRlbSA9IF9zbGljZWRUb0FycmF5KGl0ZW0sIDQpLFxuICAgICAgY29udGVudCA9IF9pdGVtWzFdLFxuICAgICAgY3NzTWFwcGluZyA9IF9pdGVtWzNdO1xuXG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICB2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgcmV0dXJuIFwiLyojIHNvdXJjZVVSTD1cIi5jb25jYXQoY3NzTWFwcGluZy5zb3VyY2VSb290IHx8IFwiXCIpLmNvbmNhdChzb3VyY2UsIFwiICovXCIpO1xuICAgIH0pO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cblxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsImNsYXNzIERlcHJlY2F0aW9uIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7IC8vIE1haW50YWlucyBwcm9wZXIgc3RhY2sgdHJhY2UgKG9ubHkgYXZhaWxhYmxlIG9uIFY4KVxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblxuICAgIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xuICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3Rvcik7XG4gICAgfVxuXG4gICAgdGhpcy5uYW1lID0gJ0RlcHJlY2F0aW9uJztcbiAgfVxuXG59XG5cbmV4cG9ydCB7IERlcHJlY2F0aW9uIH07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLy8gcmVmOiBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1nbG9iYWxcbnZhciBnZXRHbG9iYWwgPSBmdW5jdGlvbiAoKSB7XG5cdC8vIHRoZSBvbmx5IHJlbGlhYmxlIG1lYW5zIHRvIGdldCB0aGUgZ2xvYmFsIG9iamVjdCBpc1xuXHQvLyBgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKWBcblx0Ly8gSG93ZXZlciwgdGhpcyBjYXVzZXMgQ1NQIHZpb2xhdGlvbnMgaW4gQ2hyb21lIGFwcHMuXG5cdGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuIHNlbGY7IH1cblx0aWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7IHJldHVybiB3aW5kb3c7IH1cblx0aWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7IHJldHVybiBnbG9iYWw7IH1cblx0dGhyb3cgbmV3IEVycm9yKCd1bmFibGUgdG8gbG9jYXRlIGdsb2JhbCBvYmplY3QnKTtcbn1cblxudmFyIGdsb2JhbCA9IGdldEdsb2JhbCgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBnbG9iYWwuZmV0Y2g7XG5cbi8vIE5lZWRlZCBmb3IgVHlwZVNjcmlwdCBhbmQgV2VicGFjay5cbmlmIChnbG9iYWwuZmV0Y2gpIHtcblx0ZXhwb3J0cy5kZWZhdWx0ID0gZ2xvYmFsLmZldGNoLmJpbmQoZ2xvYmFsKTtcbn1cblxuZXhwb3J0cy5IZWFkZXJzID0gZ2xvYmFsLkhlYWRlcnM7XG5leHBvcnRzLlJlcXVlc3QgPSBnbG9iYWwuUmVxdWVzdDtcbmV4cG9ydHMuUmVzcG9uc2UgPSBnbG9iYWwuUmVzcG9uc2U7IiwidmFyIHdyYXBweSA9IHJlcXVpcmUoJ3dyYXBweScpXG5tb2R1bGUuZXhwb3J0cyA9IHdyYXBweShvbmNlKVxubW9kdWxlLmV4cG9ydHMuc3RyaWN0ID0gd3JhcHB5KG9uY2VTdHJpY3QpXG5cbm9uY2UucHJvdG8gPSBvbmNlKGZ1bmN0aW9uICgpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZ1bmN0aW9uLnByb3RvdHlwZSwgJ29uY2UnLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBvbmNlKHRoaXMpXG4gICAgfSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSlcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRnVuY3Rpb24ucHJvdG90eXBlLCAnb25jZVN0cmljdCcsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG9uY2VTdHJpY3QodGhpcylcbiAgICB9LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KVxufSlcblxuZnVuY3Rpb24gb25jZSAoZm4pIHtcbiAgdmFyIGYgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGYuY2FsbGVkKSByZXR1cm4gZi52YWx1ZVxuICAgIGYuY2FsbGVkID0gdHJ1ZVxuICAgIHJldHVybiBmLnZhbHVlID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICB9XG4gIGYuY2FsbGVkID0gZmFsc2VcbiAgcmV0dXJuIGZcbn1cblxuZnVuY3Rpb24gb25jZVN0cmljdCAoZm4pIHtcbiAgdmFyIGYgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGYuY2FsbGVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGYub25jZUVycm9yKVxuICAgIGYuY2FsbGVkID0gdHJ1ZVxuICAgIHJldHVybiBmLnZhbHVlID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICB9XG4gIHZhciBuYW1lID0gZm4ubmFtZSB8fCAnRnVuY3Rpb24gd3JhcHBlZCB3aXRoIGBvbmNlYCdcbiAgZi5vbmNlRXJyb3IgPSBuYW1lICsgXCIgc2hvdWxkbid0IGJlIGNhbGxlZCBtb3JlIHRoYW4gb25jZVwiXG4gIGYuY2FsbGVkID0gZmFsc2VcbiAgcmV0dXJuIGZcbn1cbiIsImltcG9ydCBhcGkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgICAgICAgIGltcG9ydCBjb250ZW50IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuaW5zZXJ0ID0gXCJoZWFkXCI7XG5vcHRpb25zLnNpbmdsZXRvbiA9IGZhbHNlO1xuXG52YXIgdXBkYXRlID0gYXBpKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0IGRlZmF1bHQgY29udGVudC5sb2NhbHMgfHwge307IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpc09sZElFID0gZnVuY3Rpb24gaXNPbGRJRSgpIHtcbiAgdmFyIG1lbW87XG4gIHJldHVybiBmdW5jdGlvbiBtZW1vcml6ZSgpIHtcbiAgICBpZiAodHlwZW9mIG1lbW8gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAvLyBUZXN0IGZvciBJRSA8PSA5IGFzIHByb3Bvc2VkIGJ5IEJyb3dzZXJoYWNrc1xuICAgICAgLy8gQHNlZSBodHRwOi8vYnJvd3NlcmhhY2tzLmNvbS8jaGFjay1lNzFkODY5MmY2NTMzNDE3M2ZlZTcxNWMyMjJjYjgwNVxuICAgICAgLy8gVGVzdHMgZm9yIGV4aXN0ZW5jZSBvZiBzdGFuZGFyZCBnbG9iYWxzIGlzIHRvIGFsbG93IHN0eWxlLWxvYWRlclxuICAgICAgLy8gdG8gb3BlcmF0ZSBjb3JyZWN0bHkgaW50byBub24tc3RhbmRhcmQgZW52aXJvbm1lbnRzXG4gICAgICAvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyL2lzc3Vlcy8xNzdcbiAgICAgIG1lbW8gPSBCb29sZWFuKHdpbmRvdyAmJiBkb2N1bWVudCAmJiBkb2N1bWVudC5hbGwgJiYgIXdpbmRvdy5hdG9iKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVtbztcbiAgfTtcbn0oKTtcblxudmFyIGdldFRhcmdldCA9IGZ1bmN0aW9uIGdldFRhcmdldCgpIHtcbiAgdmFyIG1lbW8gPSB7fTtcbiAgcmV0dXJuIGZ1bmN0aW9uIG1lbW9yaXplKHRhcmdldCkge1xuICAgIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpOyAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuXG4gICAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVtb1t0YXJnZXRdO1xuICB9O1xufSgpO1xuXG52YXIgc3R5bGVzSW5Eb20gPSBbXTtcblxuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRvbS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRvbVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdXG4gICAgfTtcblxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRG9tW2luZGV4XS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRvbVtpbmRleF0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZXNJbkRvbS5wdXNoKHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogYWRkU3R5bGUob2JqLCBvcHRpb25zKSxcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuXG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cblxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgdmFyIGF0dHJpYnV0ZXMgPSBvcHRpb25zLmF0dHJpYnV0ZXMgfHwge307XG5cbiAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVzLm5vbmNlID09PSAndW5kZWZpbmVkJykge1xuICAgIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gJ3VuZGVmaW5lZCcgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG5cbiAgICBpZiAobm9uY2UpIHtcbiAgICAgIGF0dHJpYnV0ZXMubm9uY2UgPSBub25jZTtcbiAgICB9XG4gIH1cblxuICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyaWJ1dGVzW2tleV0pO1xuICB9KTtcblxuICBpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgb3B0aW9ucy5pbnNlcnQoc3R5bGUpO1xuICB9IGVsc2Uge1xuICAgIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQob3B0aW9ucy5pbnNlcnQgfHwgJ2hlYWQnKTtcblxuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICAgIH1cblxuICAgIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIH1cblxuICByZXR1cm4gc3R5bGU7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlLnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdHlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlKTtcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5cbnZhciByZXBsYWNlVGV4dCA9IGZ1bmN0aW9uIHJlcGxhY2VUZXh0KCkge1xuICB2YXIgdGV4dFN0b3JlID0gW107XG4gIHJldHVybiBmdW5jdGlvbiByZXBsYWNlKGluZGV4LCByZXBsYWNlbWVudCkge1xuICAgIHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcbiAgICByZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcbiAgfTtcbn0oKTtcblxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyhzdHlsZSwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XG4gIHZhciBjc3MgPSByZW1vdmUgPyAnJyA6IG9iai5tZWRpYSA/IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIikuY29uY2F0KG9iai5jc3MsIFwifVwiKSA6IG9iai5jc3M7IC8vIEZvciBvbGQgSUVcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG5cbiAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XG4gICAgdmFyIGNoaWxkTm9kZXMgPSBzdHlsZS5jaGlsZE5vZGVzO1xuXG4gICAgaWYgKGNoaWxkTm9kZXNbaW5kZXhdKSB7XG4gICAgICBzdHlsZS5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICBzdHlsZS5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZS5hcHBlbmRDaGlsZChjc3NOb2RlKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyhzdHlsZSwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBvYmouY3NzO1xuICB2YXIgbWVkaWEgPSBvYmoubWVkaWE7XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG4gIGlmIChtZWRpYSkge1xuICAgIHN0eWxlLnNldEF0dHJpYnV0ZSgnbWVkaWEnLCBtZWRpYSk7XG4gIH0gZWxzZSB7XG4gICAgc3R5bGUucmVtb3ZlQXR0cmlidXRlKCdtZWRpYScpO1xuICB9XG5cbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfSAvLyBGb3Igb2xkIElFXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuXG5cbiAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlLnJlbW92ZUNoaWxkKHN0eWxlLmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbnZhciBzaW5nbGV0b24gPSBudWxsO1xudmFyIHNpbmdsZXRvbkNvdW50ZXIgPSAwO1xuXG5mdW5jdGlvbiBhZGRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIHN0eWxlO1xuICB2YXIgdXBkYXRlO1xuICB2YXIgcmVtb3ZlO1xuXG4gIGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xuICAgIHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xuICAgIHN0eWxlID0gc2luZ2xldG9uIHx8IChzaW5nbGV0b24gPSBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xuICAgIHVwZGF0ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgZmFsc2UpO1xuICAgIHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgdHJ1ZSk7XG4gIH0gZWxzZSB7XG4gICAgc3R5bGUgPSBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gICAgdXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlLCBvcHRpb25zKTtcblxuICAgIHJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG4gICAgfTtcbiAgfVxuXG4gIHVwZGF0ZShvYmopO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICByZW1vdmUoKTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307IC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxuICAvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXG5cbiAgaWYgKCFvcHRpb25zLnNpbmdsZXRvbiAmJiB0eXBlb2Ygb3B0aW9ucy5zaW5nbGV0b24gIT09ICdib29sZWFuJykge1xuICAgIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xuICB9XG5cbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuXG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChuZXdMaXN0KSAhPT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5Eb21baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG5cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuXG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG5cbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG5cbiAgICAgIGlmIChzdHlsZXNJbkRvbVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5Eb21bX2luZGV4XS51cGRhdGVyKCk7XG5cbiAgICAgICAgc3R5bGVzSW5Eb20uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJmdW5jdGlvbiBnZXRVc2VyQWdlbnQoKSB7XG4gICAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgPT09IFwib2JqZWN0XCIgJiYgXCJ1c2VyQWdlbnRcIiBpbiBuYXZpZ2F0b3IpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gXCJvYmplY3RcIiAmJiBcInZlcnNpb25cIiBpbiBwcm9jZXNzKSB7XG4gICAgICAgIHJldHVybiBgTm9kZS5qcy8ke3Byb2Nlc3MudmVyc2lvbi5zdWJzdHIoMSl9ICgke3Byb2Nlc3MucGxhdGZvcm19OyAke3Byb2Nlc3MuYXJjaH0pYDtcbiAgICB9XG4gICAgcmV0dXJuIFwiPGVudmlyb25tZW50IHVuZGV0ZWN0YWJsZT5cIjtcbn1cblxuZXhwb3J0IHsgZ2V0VXNlckFnZW50IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXBcbiIsIi8vIFJldHVybnMgYSB3cmFwcGVyIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHdyYXBwZWQgY2FsbGJhY2tcbi8vIFRoZSB3cmFwcGVyIGZ1bmN0aW9uIHNob3VsZCBkbyBzb21lIHN0dWZmLCBhbmQgcmV0dXJuIGFcbi8vIHByZXN1bWFibHkgZGlmZmVyZW50IGNhbGxiYWNrIGZ1bmN0aW9uLlxuLy8gVGhpcyBtYWtlcyBzdXJlIHRoYXQgb3duIHByb3BlcnRpZXMgYXJlIHJldGFpbmVkLCBzbyB0aGF0XG4vLyBkZWNvcmF0aW9ucyBhbmQgc3VjaCBhcmUgbm90IGxvc3QgYWxvbmcgdGhlIHdheS5cbm1vZHVsZS5leHBvcnRzID0gd3JhcHB5XG5mdW5jdGlvbiB3cmFwcHkgKGZuLCBjYikge1xuICBpZiAoZm4gJiYgY2IpIHJldHVybiB3cmFwcHkoZm4pKGNiKVxuXG4gIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbmVlZCB3cmFwcGVyIGZ1bmN0aW9uJylcblxuICBPYmplY3Qua2V5cyhmbikuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgIHdyYXBwZXJba10gPSBmbltrXVxuICB9KVxuXG4gIHJldHVybiB3cmFwcGVyXG5cbiAgZnVuY3Rpb24gd3JhcHBlcigpIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXVxuICAgIH1cbiAgICB2YXIgcmV0ID0gZm4uYXBwbHkodGhpcywgYXJncylcbiAgICB2YXIgY2IgPSBhcmdzW2FyZ3MubGVuZ3RoLTFdXG4gICAgaWYgKHR5cGVvZiByZXQgPT09ICdmdW5jdGlvbicgJiYgcmV0ICE9PSBjYikge1xuICAgICAgT2JqZWN0LmtleXMoY2IpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgcmV0W2tdID0gY2Jba11cbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiByZXRcbiAgfVxufVxuIiwiaW1wb3J0IHNvcnRVc2VyQnlBbHBoYWJldCBmcm9tICcuLi9oZWxwZXJzL3NvcnRVc2VyQnlBbHBoYWJldCc7XG5cbmZ1bmN0aW9uIExvY2FsU3RvcmFnZSgpIHtcbiAgY29uc3Qgc3RvcmVVc2VyRGF0YSA9ICh1c2VyRGF0YSkgPT4ge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VycycsIEpTT04uc3RyaW5naWZ5KHVzZXJEYXRhKSk7XG4gIH07XG5cbiAgY29uc3QgZ2V0VXNlckRhdGEgPSAoKSA9PiB7XG4gICAgY29uc3QgZmF2b3JpdGVVc2VycyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXJzJykpO1xuXG4gICAgaWYgKGZhdm9yaXRlVXNlcnMgPT09IG51bGwpIHtcbiAgICAgIGNvbnNvbGUubG9nKG51bGwpO1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHJldHVybiBzb3J0VXNlckJ5QWxwaGFiZXQoZmF2b3JpdGVVc2Vycyk7XG4gIH07XG5cbiAgY29uc3QgcmVtb3ZlVXNlciA9ICh1c2VyTmFtZSkgPT4ge1xuICAgIGNvbnN0IG5ld1VzZXJEYXRhID0gZ2V0VXNlckRhdGEoKS5maWx0ZXIoKHVzZXIpID0+IHVzZXIubG9naW4gIT09IHVzZXJOYW1lKTtcbiAgICBzdG9yZVVzZXJEYXRhKG5ld1VzZXJEYXRhKTtcbiAgfTtcblxuICBjb25zdCBhZGRVc2VyID0gKHVzZXJEYXRhKSA9PiB7XG4gICAgY29uc3QgbmV3VXNlckRhdGEgPSBbLi4uZ2V0VXNlckRhdGEoKSwgdXNlckRhdGFdO1xuICAgIHN0b3JlVXNlckRhdGEobmV3VXNlckRhdGEpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcmVtb3ZlVXNlcixcbiAgICBhZGRVc2VyLFxuICAgIGdldFVzZXJEYXRhLFxuICB9O1xufVxuXG5jb25zdCBGYXZvcml0ZXMgPSBMb2NhbFN0b3JhZ2UoKTtcblxuZXhwb3J0IGRlZmF1bHQgRmF2b3JpdGVzO1xuIiwiaW1wb3J0IGNyZWF0ZUZyYWdtZW50IGZyb20gJy4uL2hlbHBlcnMvY3JldGF0ZUZyYWdtZW50JztcbmltcG9ydCBGYXZvcml0ZXMgZnJvbSAnLi9GYXZvcml0ZSc7XG5cbmZ1bmN0aW9uIGFkZEhlYWRlcigpIHtcbiAgY29uc3QgdXNlckxpc3RTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVzZXJsaXN0LXNlY3Rpb24nKTtcblxuICBjb25zdCBVSSA9IGNyZWF0ZUZyYWdtZW50KGBcbiAgICA8aGVhZGVyIGNsYXNzPVwidXNlcmxpc3Qtc2VjdGlvbl9faGVhZGVyIGNvbnRhaW5lclwiPlxuICAgICAgPGgxIGNsYXNzPVwidXNlcmxpc3Qtc2VjdGlvbl9fdGl0bGVcIj5HaXRodWIgU3RhcnM8L2gxPlxuICAgICAgPGJ1dHRvbiBjbGFzcz1cImxvZ1N0b3JhZ2VcIj5sb2cgdXNlcnMgaW4gZmF2b3JpdGU8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gY2xhc3M9XCJjbGVhclN0b3JhZ2VcIj5jbGVhciBmYXZvcml0ZSBzdG9yYWdlPC9idXR0b24+XG4gICAgPC9oZWFkZXI+XG4gIGApO1xuXG4gIFVJLnF1ZXJ5U2VsZWN0b3IoJy5sb2dTdG9yYWdlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coRmF2b3JpdGVzLmdldFVzZXJEYXRhKCkpO1xuICB9KTtcbiAgVUkucXVlcnlTZWxlY3RvcignLmNsZWFyU3RvcmFnZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICB9KTtcblxuICByZXR1cm4gdXNlckxpc3RTZWN0aW9uLmFwcGVuZENoaWxkKFVJKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYWRkSGVhZGVyO1xuIiwiaW1wb3J0IGNyZWF0ZVVzZXJzUm93IGZyb20gJy4vY3JlYXRlVXNlcnNSb3cnO1xuXG5sZXQgbmV3Q3VycmVudFNlYXJjaFJlc3VsdDtcbmxldCBuZXdPbkZhdm9yaXRlSGFuZGxlcjtcblxuZnVuY3Rpb24gYWRkTWFpbihjdXJyZW50U2VhcmNoUmVzdWx0LCBvbkZhdm9yaXRlSGFuZGxlcikge1xuICBjb25zdCB1c2VyTGlzdFNlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudXNlcmxpc3Qtc2VjdGlvbicpO1xuXG4gIGNvbnN0IHVzZXJzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbWFpbicpO1xuICB1c2Vycy5jbGFzc05hbWUgPSAndXNlcnMnO1xuXG4gIGlmIChjdXJyZW50U2VhcmNoUmVzdWx0ICE9PSBudWxsKSB7XG4gICAgY29uc3QgdXNlckdyb3VwcyA9IGdyb3VwQnlGaXJzdExldHRlcihjdXJyZW50U2VhcmNoUmVzdWx0KTtcbiAgICBmb3IgKGNvbnN0IGZpcnN0TGV0dGVyIGluIHVzZXJHcm91cHMpIHtcbiAgICAgIGNvbnN0IHVzZXJzUm93ID0gY3JlYXRlVXNlcnNSb3coXG4gICAgICAgIHVzZXJHcm91cHNbZmlyc3RMZXR0ZXJdLFxuICAgICAgICBvbkZhdm9yaXRlSGFuZGxlclxuICAgICAgKTtcbiAgICAgIHVzZXJzLmFwcGVuZENoaWxkKHVzZXJzUm93KTtcbiAgICB9XG4gIH1cblxuICAvLyBERVZFTE9QTUVOVFxuICBuZXdDdXJyZW50U2VhcmNoUmVzdWx0ID0gY3VycmVudFNlYXJjaFJlc3VsdDtcbiAgbmV3T25GYXZvcml0ZUhhbmRsZXIgPSBvbkZhdm9yaXRlSGFuZGxlcjtcblxuICByZXR1cm4gdXNlckxpc3RTZWN0aW9uLmFwcGVuZENoaWxkKHVzZXJzKTtcbn1cblxuaWYgKG1vZHVsZS5ob3QpIHtcbiAgbW9kdWxlLmhvdC5hY2NlcHQoJy4vY3JlYXRlVXNlci5qcycsIGZ1bmN0aW9uICgpIHt9KTtcbn1cblxuZnVuY3Rpb24gZ3JvdXBCeUZpcnN0TGV0dGVyKG9iamVjdEFycmF5KSB7XG4gIHJldHVybiBvYmplY3RBcnJheS5yZWR1Y2UoKGFjYywgb2JqKSA9PiB7XG4gICAgLy8gb2JqLm5hbWXsnZgg7LKr67KI7Ke4IOq4gOyekOqwgCDtgqTroZwg7KG07J6s7ZWY64qU7KeAIO2ZleyduFxuICAgIGNvbnN0IGZpcnN0TGV0dGVyID0gb2JqLmxvZ2luWzBdLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKCFhY2NbZmlyc3RMZXR0ZXJdKSB7XG4gICAgICBhY2NbZmlyc3RMZXR0ZXJdID0gW107XG4gICAgfVxuXG4gICAgYWNjW2ZpcnN0TGV0dGVyXS5wdXNoKG9iaik7XG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhZGRNYWluO1xuIiwiaW1wb3J0IGNyZWF0ZVNlYXJjaFRhYiBmcm9tICcuL2NyZWF0ZVNlYXJjaFRhYic7XG5pbXBvcnQgY3JlYXRlU2VhcmNoQmFyIGZyb20gJy4vY3JlYXRlU2VhcmNoQmFyJztcblxubGV0IG5ld1NlYXJjaElucHV0VmFsdWU7XG5sZXQgbmV3T25TZWFyY2hDaGFuZ2VIYW5kbGVyO1xubGV0IG5ld09uU2VhcmNoSGFuZGxlcjtcbmxldCBuZXdUYWI7XG5sZXQgbmV3T25UYWJDaGFuZ2U7XG5cbmZ1bmN0aW9uIGFkZE5hdihcbiAgdGFiLFxuICBvblRhYkNoYW5nZSxcbiAgc2VhcmNoSW5wdXRWYWx1ZSxcbiAgb25TZWFyY2hDaGFuZ2VIYW5kbGVyLFxuICBvblNlYXJjaEhhbmRsZXJcbikge1xuICBjb25zdCB1c2VyTGlzdFNlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudXNlcmxpc3Qtc2VjdGlvbicpO1xuXG4gIGNvbnN0IG5hdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ25hdicpO1xuICBuYXYuY2xhc3NOYW1lID0gJ3VzZXJsaXN0LXNlY3Rpb25fX25hdic7XG5cbiAgbmF2LmFwcGVuZENoaWxkKGNyZWF0ZVNlYXJjaFRhYih0YWIsIG9uVGFiQ2hhbmdlKSk7XG4gIG5hdi5hcHBlbmRDaGlsZChcbiAgICBjcmVhdGVTZWFyY2hCYXIoc2VhcmNoSW5wdXRWYWx1ZSwgb25TZWFyY2hDaGFuZ2VIYW5kbGVyLCBvblNlYXJjaEhhbmRsZXIpXG4gICk7XG5cbiAgbmV3VGFiID0gdGFiO1xuICBuZXdPblRhYkNoYW5nZSA9IG9uVGFiQ2hhbmdlO1xuICBuZXdTZWFyY2hJbnB1dFZhbHVlID0gc2VhcmNoSW5wdXRWYWx1ZTtcbiAgbmV3T25TZWFyY2hDaGFuZ2VIYW5kbGVyID0gb25TZWFyY2hDaGFuZ2VIYW5kbGVyO1xuICBuZXdPblNlYXJjaEhhbmRsZXIgPSBvblNlYXJjaEhhbmRsZXI7XG5cbiAgcmV0dXJuIHVzZXJMaXN0U2VjdGlvbi5hcHBlbmRDaGlsZChuYXYpO1xufVxuXG5pZiAobW9kdWxlLmhvdCkge1xuICBtb2R1bGUuaG90LmFjY2VwdCgnLi9jcmVhdGVTZWFyY2hUYWIuanMnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVzZXJsaXN0LXNlY3Rpb25fX25hdicpO1xuXG4gICAgY29uc3Qgb2xkU2VhcmNoVGFiID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICcudXNlcmxpc3Qtc2VjdGlvbl9fc2VhcmNoLXRhYidcbiAgICApO1xuICAgIGNvbnN0IG5ld1NlYXJjaFRhYiA9IGNyZWF0ZVNlYXJjaFRhYihuZXdUYWIsIG5ld09uVGFiQ2hhbmdlKTtcblxuICAgIG5hdi5yZXBsYWNlQ2hpbGQobmV3U2VhcmNoVGFiLCBvbGRTZWFyY2hUYWIpO1xuICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcbiAgfSk7XG5cbiAgbW9kdWxlLmhvdC5hY2NlcHQoJy4vY3JlYXRlU2VhcmNoQmFyLmpzJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51c2VybGlzdC1zZWN0aW9uX19uYXYnKTtcblxuICAgIGNvbnN0IG9sZFNlYXJjaEJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAnLnVzZXJsaXN0LXNlY3Rpb25fX3NlYXJjaC1iYXInXG4gICAgKTtcbiAgICBjb25zdCBuZXdTZWFyY2hCYXIgPSBjcmVhdGVTZWFyY2hCYXIoXG4gICAgICBuZXdTZWFyY2hJbnB1dFZhbHVlLFxuICAgICAgbmV3T25TZWFyY2hDaGFuZ2VIYW5kbGVyLFxuICAgICAgbmV3T25TZWFyY2hIYW5kbGVyXG4gICAgKTtcblxuICAgIG5hdi5yZXBsYWNlQ2hpbGQobmV3U2VhcmNoQmFyLCBvbGRTZWFyY2hCYXIpO1xuICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFkZE5hdjtcbiIsImltcG9ydCBhZGRIZWFkZXIgZnJvbSAnLi9hZGRIZWFkZXInO1xuaW1wb3J0IGFkZE5hdiBmcm9tICcuL2FkZE5hdic7XG5pbXBvcnQgYWRkTWFpbiBmcm9tICcuL2FkZE1haW4nO1xuaW1wb3J0ICcuLi9zdHlsZXMvc3R5bGUuY3NzJztcbmltcG9ydCBjbGVhclBhZ2UgZnJvbSAnLi9jbGVhclBhZ2UnO1xuaW1wb3J0IEZhdm9yaXRlcyBmcm9tICcuL0Zhdm9yaXRlJztcbmltcG9ydCBnZXRVc2VyTGlzdCBmcm9tICcuLi9oZWxwZXJzL2dldFVzZXJMaXN0JztcblxuZnVuY3Rpb24gQXBwKCkge1xuICBsZXQgc3RhdGUgPSB7XG4gICAgc2VhcmNoSW5wdXQ6ICcnLFxuICAgIGN1cnJlbnRUYWI6ICdhcGknLFxuICAgIGZhdm9yaXRlczogRmF2b3JpdGVzLmdldFVzZXJEYXRhKCksXG4gICAgdXNlclNlYXJjaFJlc3VsdHM6IG51bGwsXG4gIH07XG5cbiAgZnVuY3Rpb24gc2V0U3RhdGUobmV3U3RhdGUsIHNob3VsZFJlbmRlciA9IHRydWUpIHtcbiAgICBzdGF0ZSA9IHtcbiAgICAgIC4uLm5ld1N0YXRlLFxuICAgIH07XG5cbiAgICBpZiAoc2hvdWxkUmVuZGVyKSB7XG4gICAgICBjb25zb2xlLmxvZyhzdGF0ZSk7XG4gICAgICByZXR1cm4gcmVuZGVyKHN0YXRlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvblNlYXJjaENoYW5nZUhhbmRsZXIoZSkge1xuICAgIHNldFN0YXRlKFxuICAgICAge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgc2VhcmNoSW5wdXQ6IGUudGFyZ2V0LnZhbHVlLFxuICAgICAgfSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uVGFiQ2hhbmdlKGUpIHtcbiAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd0YWItbG9jYWwnKSkge1xuICAgICAgcmV0dXJuIHNldFN0YXRlKHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGN1cnJlbnRUYWI6ICdsb2NhbCcsXG4gICAgICAgIHVzZXJTZWFyY2hSZXN1bHRzOiBudWxsLFxuICAgICAgICBzZWFyY2hJbnB1dDogJycsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2V0U3RhdGUoe1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBjdXJyZW50VGFiOiAnYXBpJyxcbiAgICAgIHNlYXJjaElucHV0OiAnJyxcbiAgICAgIHVzZXJTZWFyY2hSZXN1bHRzOiBudWxsLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gb25TZWFyY2hIYW5kbGVyKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgeyBjdXJyZW50VGFiLCBzZWFyY2hJbnB1dCwgZmF2b3JpdGVzIH0gPSBzdGF0ZTtcblxuICAgIGlmIChzdGF0ZS5jdXJyZW50VGFiID09PSAnYXBpJykge1xuICAgICAgY29uc3QgdXNlclRvU2VhcmNoID0gc2VhcmNoSW5wdXQ7XG4gICAgICBjb25zdCBuZXdVc2VyTGlzdCA9IGF3YWl0IGdldFVzZXJMaXN0KHVzZXJUb1NlYXJjaCwgZmF2b3JpdGVzKTtcblxuICAgICAgcmV0dXJuIHNldFN0YXRlKHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIHVzZXJTZWFyY2hSZXN1bHRzOiBuZXdVc2VyTGlzdCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChjdXJyZW50VGFiID09PSAnbG9jYWwnKSB7XG4gICAgICBjb25zdCB1c2VyVG9TZWFyY2ggPSBzZWFyY2hJbnB1dDtcbiAgICAgIGNvbnN0IG5ld1NlYXJjaExpc3QgPSBmYXZvcml0ZXMuZmlsdGVyKCh1c2VyKSA9PiB7XG4gICAgICAgIGNvbnN0IGxvd2VyVXNlclRvU2VhcmNoID0gdXNlclRvU2VhcmNoLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGxvd2VyVXNlck5hbWUgPSB1c2VyLmxvZ2luLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChsb3dlclVzZXJOYW1lLmluY2x1ZGVzKGxvd2VyVXNlclRvU2VhcmNoKSkge1xuICAgICAgICAgIHJldHVybiB1c2VyO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHNldFN0YXRlKHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIHVzZXJTZWFyY2hSZXN1bHRzOiBuZXdTZWFyY2hMaXN0LFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25GYXZvcml0ZUhhbmRsZXIodXNlckluZm8pIHtcbiAgICBjb25zdCBuZXdTZWFyY2hSZXN1bHQgPSBzdGF0ZS51c2VyU2VhcmNoUmVzdWx0cy5tYXAoKHVzZXIpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxvZ2luOiB1c2VyLmxvZ2luLFxuICAgICAgICBhdmF0YXJfdXJsOiB1c2VyLmF2YXRhcl91cmwsXG4gICAgICAgIGlzX2Zhdm9yaXRlOiB1c2VyLmlzX2Zhdm9yaXRlLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHVzZXJGb3VuZCA9IG5ld1NlYXJjaFJlc3VsdC5maW5kKCh1c2VyKSA9PiB7XG4gICAgICByZXR1cm4gdXNlci5sb2dpbiA9PT0gdXNlckluZm8ubG9naW47XG4gICAgfSk7XG5cbiAgICBpZiAodXNlckZvdW5kLmlzX2Zhdm9yaXRlKSB7XG4gICAgICBGYXZvcml0ZXMucmVtb3ZlVXNlcih1c2VyRm91bmQubG9naW4pO1xuICAgICAgdXNlckZvdW5kLmlzX2Zhdm9yaXRlID0gIXVzZXJGb3VuZC5pc19mYXZvcml0ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlckZvdW5kLmlzX2Zhdm9yaXRlID0gIXVzZXJGb3VuZC5pc19mYXZvcml0ZTtcbiAgICAgIEZhdm9yaXRlcy5hZGRVc2VyKHVzZXJGb3VuZCk7XG4gICAgfVxuXG4gICAgaWYgKHN0YXRlLmN1cnJlbnRUYWIgPT09ICdsb2NhbCcpIHtcbiAgICAgIGNvbnN0IGluZGV4VG9SZW1vdmUgPSBuZXdTZWFyY2hSZXN1bHQuZmluZEluZGV4KCh1c2VyKSA9PiB7XG4gICAgICAgIHJldHVybiB1c2VyLmxvZ2luID09PSB1c2VyRm91bmQubG9naW47XG4gICAgICB9KTtcbiAgICAgIG5ld1NlYXJjaFJlc3VsdC5zcGxpY2UoaW5kZXhUb1JlbW92ZSwgMSk7XG4gICAgfVxuXG4gICAgc2V0U3RhdGUoe1xuICAgICAgLi4uc3RhdGUsXG4gICAgICB1c2VyU2VhcmNoUmVzdWx0czogbmV3U2VhcmNoUmVzdWx0LFxuICAgICAgZmF2b3JpdGVzOiBGYXZvcml0ZXMuZ2V0VXNlckRhdGEoKSxcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IHJlbmRlciA9ICgpID0+IHtcbiAgICBjb25zdCB7IGN1cnJlbnRUYWIsIHNlYXJjaElucHV0LCB1c2VyU2VhcmNoUmVzdWx0cyB9ID0gc3RhdGU7XG5cbiAgICBjbGVhclBhZ2UoKTtcbiAgICBhZGRIZWFkZXIoKTtcbiAgICBhZGROYXYoXG4gICAgICBjdXJyZW50VGFiLFxuICAgICAgb25UYWJDaGFuZ2UsXG4gICAgICBzZWFyY2hJbnB1dCxcbiAgICAgIG9uU2VhcmNoQ2hhbmdlSGFuZGxlcixcbiAgICAgIG9uU2VhcmNoSGFuZGxlclxuICAgICk7XG4gICAgYWRkTWFpbih1c2VyU2VhcmNoUmVzdWx0cywgb25GYXZvcml0ZUhhbmRsZXIpO1xuICB9O1xuXG4gIHJldHVybiB7IHJlbmRlciB9O1xufVxuXG5jb25zdCBteUFwcCA9IEFwcCgpO1xuXG4vLyBpZiAobW9kdWxlLmhvdCkge1xuLy8gICBtb2R1bGUuaG90LmFjY2VwdCgnLi9hZGRIZWFkZXIuanMnLCBmdW5jdGlvbiAoKSB7XG4vLyAgICAgY29uc3QgdXNlcmxpc3RTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVzZXJsaXN0LXNlY3Rpb24nKTtcbi8vICAgICBjb25zdCBvbGRIZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudXNlcmxpc3Qtc2VjdGlvbl9faGVhZGVyJyk7XG4vLyAgICAgY29uc3QgbmV3SGVhZGVyID0gYWRkSGVhZGVyKCk7XG5cbi8vICAgICBjb25zb2xlLmxvZygnd2hhdCcpO1xuLy8gICAgIHVzZXJsaXN0U2VjdGlvbi5yZXBsYWNlQ2hpbGQobmV3SGVhZGVyLCBvbGRIZWFkZXIpO1xuLy8gICB9KTtcbi8vIH1cblxuaWYgKG1vZHVsZS5ob3QpIHtcbiAgbW9kdWxlLmhvdC5hY2NlcHQoJy4vYWRkTmF2LmpzJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKCdBREROQVY6IGNoYW5nZWQnKTtcbiAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG4gIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBteUFwcDtcbiIsImZ1bmN0aW9uIGNsZWFyUGFnZSgpIHtcbiAgY29uc3QgdXNlckxpc3RTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVzZXJsaXN0LXNlY3Rpb24nKTtcbiAgd2hpbGUgKHVzZXJMaXN0U2VjdGlvbi5maXJzdENoaWxkKSB7XG4gICAgdXNlckxpc3RTZWN0aW9uLnJlbW92ZUNoaWxkKHVzZXJMaXN0U2VjdGlvbi5maXJzdENoaWxkKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGVhclBhZ2U7XG4iLCJpbXBvcnQgY3JlYXRlRnJhZ21lbnQgZnJvbSAnLi4vaGVscGVycy9jcmV0YXRlRnJhZ21lbnQnO1xuXG5mdW5jdGlvbiBjcmVhdGVTZWFyY2hCYXIoXG4gIHNlYXJjaElucHV0VmFsdWUsXG4gIG9uU2VhcmNoQ2hhbmdlSGFuZGxlcixcbiAgb25TZWFyY2hIYW5kbGVyXG4pIHtcbiAgY29uc3QgVUkgPSBjcmVhdGVGcmFnbWVudChgXG4gICAgPGRpdiBjbGFzcz1cInVzZXJsaXN0LXNlY3Rpb25fX3NlYXJjaC1iYXJcIj5cbiAgICAgIDxmb3JtIGNsYXNzPVwiY29udGFpbmVyIHJvdyByb3ctYmV0d2VlblwiPlxuICAgICAgICA8aW5wdXQgY2xhc3M9XCJ1c2VybGlzdC1zZWN0aW9uX19zZWFyY2gtaW5wdXRcIiB0eXBlPXRleHRcIlxuICAgICAgICBwbGFjZWhvbGRlcj1cIuqygOyDieyWtOulvCDsnoXroKXtlZjshLjsmpRcIiBwYXR0ZXJuPVwiXlthLXpBLVowLTktXSokXCIgcmVxdWlyZWQ+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJ1c2VybGlzdC1zZWN0aW9uX19zZWFyY2gtYnRuXCI+XG4gICAgICAgICAgPHN2ZyBjbGFzcz1cInVzZXJsaXN0LXNlY3Rpb25fX3NlYXJjaC1pY29uXCJcbiAgICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICAgICAgaGVpZ2h0PVwiNDhweFwiXG4gICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICAgICAgICAgIHdpZHRoPVwiNDhweFwiXG4gICAgICAgICAgICBmaWxsPVwiIzAwMDAwMFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0wIDBoMjR2MjRIMFYwelwiIGZpbGw9XCJub25lXCIgLz5cbiAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgIGQ9XCJNMTUuNSAxNGgtLjc5bC0uMjgtLjI3QzE1LjQxIDEyLjU5IDE2IDExLjExIDE2IDkuNSAxNiA1LjkxIDEzLjA5IDMgOS41IDNTMyA1LjkxIDMgOS41IDUuOTEgMTYgOS41IDE2YzEuNjEgMCAzLjA5LS41OSA0LjIzLTEuNTdsLjI3LjI4di43OWw1IDQuOTlMMjAuNDkgMTlsLTQuOTktNXptLTYgMEM3LjAxIDE0IDUgMTEuOTkgNSA5LjVTNy4wMSA1IDkuNSA1IDE0IDcuMDEgMTQgOS41IDExLjk5IDE0IDkuNSAxNHpcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Zvcm0+XG4gICAgPC9kaXY+XG4gIGApO1xuXG4gIGNvbnN0IHNlYXJjaElucHV0ID0gVUkucXVlcnlTZWxlY3RvcignLnVzZXJsaXN0LXNlY3Rpb25fX3NlYXJjaC1pbnB1dCcpO1xuICBzZWFyY2hJbnB1dC52YWx1ZSA9IHNlYXJjaElucHV0VmFsdWU7XG4gIHNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgb25TZWFyY2hDaGFuZ2VIYW5kbGVyKGUpO1xuICB9KTtcblxuICBjb25zdCBzZWFyY2hCdG4gPSBVSS5xdWVyeVNlbGVjdG9yKCcudXNlcmxpc3Qtc2VjdGlvbl9fc2VhcmNoLWJ0bicpO1xuICBzZWFyY2hCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGlmIChzZWFyY2hJbnB1dC52YWxpZGl0eS52YWx1ZU1pc3NpbmcpIHtcbiAgICAgIHJldHVybiBzZWFyY2hJbnB1dC5zZXRDdXN0b21WYWxpZGl0eSgn6rCS7J2EIOyeheugpe2VmOyXrCDso7zshLjsmpQuJyk7XG4gICAgfVxuXG4gICAgaWYgKHNlYXJjaElucHV0LnZhbGlkaXR5LnBhdHRlcm5NaXNtYXRjaCkge1xuICAgICAgcmV0dXJuIHNlYXJjaElucHV0LnNldEN1c3RvbVZhbGlkaXR5KFxuICAgICAgICAn6rmD7ZeI67iMIOycoOyggOuKlCDsmIHrrLgsIOyIq+yekCwg7ZWY7J207ZSIKC0pIOyhsO2VqeycvOuhnCDsnbTro6jslrTsoLgg7J6I7Iq164uI64ukLidcbiAgICAgICk7XG4gICAgfVxuXG4gICAgb25TZWFyY2hIYW5kbGVyKGUpO1xuICB9KTtcblxuICByZXR1cm4gVUk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVNlYXJjaEJhcjtcbiIsImltcG9ydCBjcmVhdGVGcmFnbWVudCBmcm9tICcuLi9oZWxwZXJzL2NyZXRhdGVGcmFnbWVudCc7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlYXJjaFRhYih0YWIsIG9uVGFiQ2hhbmdlKSB7XG4gIGxldCBVSTtcblxuICBpZiAodGFiID09PSAnYXBpJykge1xuICAgIGNvbnN0IHRhYkFQSSA9IGBcbiAgICAgIDxkaXYgY2xhc3M9XCJ1c2VybGlzdC1zZWN0aW9uX19zZWFyY2gtdGFiIHJvd1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwidGFiLWFwaSB0YWIgdGFiLS1hY3RpdmVcIj5hcGk8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInRhYi1sb2NhbCB0YWJcIj7roZzsu6w8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGA7XG5cbiAgICBVSSA9IGNyZWF0ZUZyYWdtZW50KHRhYkFQSSk7XG4gIH1cblxuICBpZiAodGFiID09PSAnbG9jYWwnKSB7XG4gICAgY29uc3QgbG9jYWxBUEkgPSBgXG4gICAgICA8ZGl2IGNsYXNzPVwidXNlcmxpc3Qtc2VjdGlvbl9fc2VhcmNoLXRhYiByb3dcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInRhYi1hcGkgdGFiXCI+YXBpPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0YWItbG9jYWwgdGFiIHRhYi0tYWN0aXZlXCI+66Gc7LusPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgO1xuXG4gICAgVUkgPSBjcmVhdGVGcmFnbWVudChsb2NhbEFQSSk7XG4gIH1cbiAgY29uc3Qgc2VhcmNoVGFiID0gVUkucXVlcnlTZWxlY3RvcignLnVzZXJsaXN0LXNlY3Rpb25fX3NlYXJjaC10YWInKTtcbiAgc2VhcmNoVGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25UYWJDaGFuZ2UpO1xuXG4gIHJldHVybiBVSTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlU2VhcmNoVGFiO1xuIiwiZnVuY3Rpb24gY3JlYXRlVXNlcih1c2VySW5mbywgb25GYXZvcml0ZUhhbmRsZXIpIHtcbiAgY29uc3QgeyBhdmF0YXJfdXJsLCBsb2dpbiwgaXNfZmF2b3JpdGUgfSA9IHVzZXJJbmZvO1xuICBjb25zdCB1c2VyVUkgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChgXG4gICAgPGRpdiBjbGFzcz1cInVzZXIgcm93XCI+XG4gICAgICA8aW1nIGNsYXNzPVwidXNlcl9faW1nXCIgc3JjPVwiJHthdmF0YXJfdXJsfVwiIC8+XG4gICAgICA8c3BhbiBjbGFzcz1cInVzZXJfX25hbWVcIj4ke2xvZ2lufTwvc3Bhbj5cbiAgICAgIDxidXR0b24gY2xhc3M9XCJ1c2VyX19mYXZvcml0ZVwiPlxuICAgICAgICAke2lzX2Zhdm9yaXRlID8gc3Rhckljb25BY3RpdmUgOiBzdGFySWNvbn1cbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICBgKTtcblxuICB1c2VyVUkgLy9cbiAgICAucXVlcnlTZWxlY3RvcignLnVzZXInKVxuICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IG9uRmF2b3JpdGVIYW5kbGVyKHVzZXJJbmZvKSk7XG5cbiAgcmV0dXJuIHVzZXJVSTtcbn1cblxuY29uc3Qgc3Rhckljb24gPSBgXG4gIDxzdmdcbiAgICBjbGFzcz1cInN0YXItaWNvblwiXG4gICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgZW5hYmxlLWJhY2tncm91bmQ9XCJuZXcgMCAwIDI0IDI0XCJcbiAgICBoZWlnaHQ9XCIyNHB4XCJcbiAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICB3aWR0aD1cIjI0cHhcIlxuICAgIGZpbGw9XCIjMDAwMDAwXCJcbiAgPlxuICAgIDxnPlxuICAgICAgPHBhdGggZD1cIk0wLDBoMjR2MjRIMFYwelwiIGZpbGw9XCJub25lXCIgLz5cbiAgICAgIDxwYXRoIGQ9XCJNMCwwaDI0djI0SDBWMHpcIiBmaWxsPVwibm9uZVwiIC8+XG4gICAgPC9nPlxuICAgIDxnPlxuICAgICAgPHBhdGggZD1cIk0xMiwxNy4yN0wxOC4xOCwyMWwtMS42NC03LjAzTDIyLDkuMjRsLTcuMTktMC42MUwxMiwyTDkuMTksOC42M0wyLDkuMjRsNS40Niw0LjczTDUuODIsMjFMMTIsMTcuMjd6XCIgLz5cbiAgICA8L2c+XG4gIDwvc3ZnPlxuYDtcblxuY29uc3Qgc3Rhckljb25BY3RpdmUgPSBgXG4gICAgPHN2Z1xuICAgICAgY2xhc3M9XCJzdGFyLWljb24gc3Rhci1pY29uLS1hY3RpdmVcIlxuICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgICBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgMjQgMjRcIlxuICAgICAgaGVpZ2h0PVwiMjRweFwiXG4gICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICAgIHdpZHRoPVwiMjRweFwiXG4gICAgICBmaWxsPVwiIzAwMDAwMFwiXG4gICAgPlxuICAgICAgPGc+XG4gICAgICAgIDxwYXRoIGQ9XCJNMCwwaDI0djI0SDBWMHpcIiBmaWxsPVwibm9uZVwiIC8+XG4gICAgICAgIDxwYXRoIGQ9XCJNMCwwaDI0djI0SDBWMHpcIiBmaWxsPVwibm9uZVwiIC8+XG4gICAgICA8L2c+XG4gICAgICA8Zz5cbiAgICAgICAgPHBhdGggZD1cIk0xMiwxNy4yN0wxOC4xOCwyMWwtMS42NC03LjAzTDIyLDkuMjRsLTcuMTktMC42MUwxMiwyTDkuMTksOC42M0wyLDkuMjRsNS40Niw0LjczTDUuODIsMjFMMTIsMTcuMjd6XCIgLz5cbiAgICAgIDwvZz5cbiAgICA8L3N2Zz5cbiAgYDtcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlVXNlcjtcbiIsImltcG9ydCBjcmVhdGVVc2VyIGZyb20gJy4vY3JlYXRlVXNlcic7XG5cbmZ1bmN0aW9uIGNyZWF0ZVVzZXJzUm93KHVzZXJHcm91cCwgb25GYXZvcml0ZUhhbmRsZXIpIHtcbiAgY29uc3QgdXNlcnNSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdXNlcnNSb3cuY2xhc3NOYW1lID0gJ3VzZXJzX19yb3cnO1xuXG4gIGNvbnN0IHVzZXJzUm93VGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIHVzZXJzUm93VGl0bGUuY2xhc3NOYW1lID0gJ3VzZXJzX19yb3ctdGl0bGUnO1xuICB1c2Vyc1Jvd1RpdGxlLnRleHRDb250ZW50ID0gdXNlckdyb3VwWzBdLmxvZ2luWzBdLnRvTG93ZXJDYXNlKCk7XG5cbiAgdXNlcnNSb3cuYXBwZW5kQ2hpbGQodXNlcnNSb3dUaXRsZSk7XG5cbiAgdXNlckdyb3VwLmZvckVhY2goKHVzZXJJbmZvKSA9PiB7XG4gICAgY29uc3QgdXNlclVJID0gY3JlYXRlVXNlcih1c2VySW5mbywgb25GYXZvcml0ZUhhbmRsZXIpO1xuICAgIHVzZXJzUm93LmFwcGVuZENoaWxkKHVzZXJVSSk7XG4gIH0pO1xuXG4gIHJldHVybiB1c2Vyc1Jvdztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlVXNlcnNSb3c7XG4iLCJmdW5jdGlvbiBjcmVhdGVGcmFnbWVudChlbGVtZW50SFRNTCkge1xuICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoZWxlbWVudEhUTUwpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGcmFnbWVudDtcbiIsImltcG9ydCB7IE9jdG9raXQgfSBmcm9tICdAb2N0b2tpdC9jb3JlJztcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vLi4vY29uZmlnJztcbmltcG9ydCBzb3J0VXNlckJ5QWxwaGFiZXQgZnJvbSAnLi9zb3J0VXNlckJ5QWxwaGFiZXQnO1xuXG5jb25zdCBvY3Rva2l0ID0gbmV3IE9jdG9raXQoe1xuICBhdXRoOiBjb25maWcuZ2l0aHViVG9rZW4sXG59KTtcblxuYXN5bmMgZnVuY3Rpb24gZ2V0VXNlckxpc3QobmFtZSwgZmF2b3JpdGVzKSB7XG4gIGNvbnN0IHNlYXJjaFJlc3BvbnNlID0gYXdhaXQgb2N0b2tpdC5yZXF1ZXN0KCdHRVQgL3NlYXJjaC91c2VycycsIHtcbiAgICBxOiBgJHtuYW1lfSBpbjpsb2dpbiB0eXBlOnVzZXJgLFxuICAgIHBlcl9wYWdlOiAxMDAsXG4gICAgcGFnZTogMSxcbiAgfSk7XG5cbiAgY29uc29sZS5sb2coc2VhcmNoUmVzcG9uc2UpO1xuXG4gIGNvbnN0IHVzZXJMaXN0ID0gbWFrZU5ld1VzZXJMaXN0KHNlYXJjaFJlc3BvbnNlLCBmYXZvcml0ZXMpO1xuXG4gIHJldHVybiBzb3J0VXNlckJ5QWxwaGFiZXQodXNlckxpc3QpO1xufVxuXG5mdW5jdGlvbiBtYWtlTmV3VXNlckxpc3QocmVzcG9uc2UsIGZhdm9yaXRlcykge1xuICBjb25zdCB1c2VyTGlzdCA9IHJlc3BvbnNlLmRhdGEuaXRlbXM7XG5cbiAgY29uc3QgbmV3VXNlckxpc3QgPSB1c2VyTGlzdC5tYXAoKHVzZXJJbmZvKSA9PiB7XG4gICAgY29uc3QgeyBsb2dpbiwgYXZhdGFyX3VybCB9ID0gdXNlckluZm87XG4gICAgY29uc3QgaXNfZmF2b3JpdGUgPSBkb2VzRXhpc3RJbkZhdm9yaXRlcyhsb2dpbiwgZmF2b3JpdGVzKTtcblxuICAgIHJldHVybiB7IGxvZ2luLCBhdmF0YXJfdXJsLCBpc19mYXZvcml0ZSB9O1xuICB9KTtcblxuICByZXR1cm4gbmV3VXNlckxpc3Q7XG59XG5cbmZ1bmN0aW9uIGRvZXNFeGlzdEluRmF2b3JpdGVzKHVzZXJOYW1lLCBmYXZvcml0ZXMpIHtcbiAgaWYgKGZhdm9yaXRlcyA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHJlc3VsdCA9IGZhdm9yaXRlcy5maW5kKCh1c2VySW5mbykgPT4gdXNlckluZm8ubG9naW4gPT09IHVzZXJOYW1lKTtcblxuICByZXR1cm4gcmVzdWx0ID8gdHJ1ZSA6IGZhbHNlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRVc2VyTGlzdDtcbiIsImZ1bmN0aW9uIHNvcnRVc2VyQnlBbHBoYWJldCh1c2VyTGlzdCkge1xuICBpZiAodXNlckxpc3QgPT09IG51bGwpIHtcbiAgICByZXR1cm4gdXNlckxpc3Q7XG4gIH1cblxuICBjb25zdCBuZXdVc2VyTGlzdCA9IFsuLi51c2VyTGlzdF07XG4gIG5ld1VzZXJMaXN0LnNvcnQoKGEsIGIpID0+IHtcbiAgICByZXR1cm4gYS5sb2dpbi5sb2NhbGVDb21wYXJlKGIubG9naW4pO1xuICB9KTtcblxuICByZXR1cm4gbmV3VXNlckxpc3Q7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNvcnRVc2VyQnlBbHBoYWJldDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgbXlBcHAgZnJvbSAnLi9jb21wb25lbnRzL2FwcCc7XG5cbm15QXBwLnJlbmRlcigpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==