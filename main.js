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
  // auth: config.githubToken,
  auth: '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',
});

async function getUserList(name, favorites) {
  const searchResponse = await octokit.request('GET /search/users', {
    q: `${name} in:login type:user`,
    per_page: 100,
    page: 1,
  });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vY29uZmlnLmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9ub2RlX21vZHVsZXMvQG9jdG9raXQvYXV0aC10b2tlbi9kaXN0LXdlYi9pbmRleC5qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vbm9kZV9tb2R1bGVzL0BvY3Rva2l0L2NvcmUvZGlzdC13ZWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbW9tLXNpdHRlci8uL25vZGVfbW9kdWxlcy9Ab2N0b2tpdC9lbmRwb2ludC9kaXN0LXdlYi9pbmRleC5qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vbm9kZV9tb2R1bGVzL0BvY3Rva2l0L2VuZHBvaW50L25vZGVfbW9kdWxlcy9pcy1wbGFpbi1vYmplY3QvZGlzdC9pcy1wbGFpbi1vYmplY3QubWpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9ub2RlX21vZHVsZXMvQG9jdG9raXQvZ3JhcGhxbC9kaXN0LXdlYi9pbmRleC5qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vbm9kZV9tb2R1bGVzL0BvY3Rva2l0L3JlcXVlc3QtZXJyb3IvZGlzdC13ZWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbW9tLXNpdHRlci8uL25vZGVfbW9kdWxlcy9Ab2N0b2tpdC9yZXF1ZXN0L2Rpc3Qtd2ViL2luZGV4LmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9ub2RlX21vZHVsZXMvQG9jdG9raXQvcmVxdWVzdC9ub2RlX21vZHVsZXMvaXMtcGxhaW4tb2JqZWN0L2Rpc3QvaXMtcGxhaW4tb2JqZWN0Lm1qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vbm9kZV9tb2R1bGVzL2JlZm9yZS1hZnRlci1ob29rL2luZGV4LmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9ub2RlX21vZHVsZXMvYmVmb3JlLWFmdGVyLWhvb2svbGliL2FkZC5qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vbm9kZV9tb2R1bGVzL2JlZm9yZS1hZnRlci1ob29rL2xpYi9yZWdpc3Rlci5qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vbm9kZV9tb2R1bGVzL2JlZm9yZS1hZnRlci1ob29rL2xpYi9yZW1vdmUuanMiLCJ3ZWJwYWNrOi8vbW9tLXNpdHRlci8uL3NyYy9zdHlsZXMvc3R5bGUuY3NzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvY3NzV2l0aE1hcHBpbmdUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vbm9kZV9tb2R1bGVzL2RlcHJlY2F0aW9uL2Rpc3Qtd2ViL2luZGV4LmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9ub2RlX21vZHVsZXMvbm9kZS1mZXRjaC9icm93c2VyLmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9ub2RlX21vZHVsZXMvb25jZS9vbmNlLmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9zcmMvc3R5bGVzL3N0eWxlLmNzcz9mZjk0Iiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vbW9tLXNpdHRlci8uL25vZGVfbW9kdWxlcy91bml2ZXJzYWwtdXNlci1hZ2VudC9kaXN0LXdlYi9pbmRleC5qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vbm9kZV9tb2R1bGVzL3dyYXBweS93cmFwcHkuanMiLCJ3ZWJwYWNrOi8vbW9tLXNpdHRlci8uL3NyYy9jb21wb25lbnRzL0Zhdm9yaXRlLmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9zcmMvY29tcG9uZW50cy9hZGRIZWFkZXIuanMiLCJ3ZWJwYWNrOi8vbW9tLXNpdHRlci8uL3NyYy9jb21wb25lbnRzL2FkZE1haW4uanMiLCJ3ZWJwYWNrOi8vbW9tLXNpdHRlci8uL3NyYy9jb21wb25lbnRzL2FkZE5hdi5qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vc3JjL2NvbXBvbmVudHMvYXBwLmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9zcmMvY29tcG9uZW50cy9jbGVhclBhZ2UuanMiLCJ3ZWJwYWNrOi8vbW9tLXNpdHRlci8uL3NyYy9jb21wb25lbnRzL2NyZWF0ZVNlYXJjaEJhci5qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vc3JjL2NvbXBvbmVudHMvY3JlYXRlU2VhcmNoVGFiLmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9zcmMvY29tcG9uZW50cy9jcmVhdGVVc2VyLmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9zcmMvY29tcG9uZW50cy9jcmVhdGVVc2Vyc1Jvdy5qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vc3JjL2hlbHBlcnMvY3JldGF0ZUZyYWdtZW50LmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9zcmMvaGVscGVycy9nZXRVc2VyTGlzdC5qcyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyLy4vc3JjL2hlbHBlcnMvc29ydFVzZXJCeUFscGhhYmV0LmpzIiwid2VicGFjazovL21vbS1zaXR0ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbW9tLXNpdHRlci93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9tb20tc2l0dGVyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9tb20tc2l0dGVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbW9tLXNpdHRlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL21vbS1zaXR0ZXIvLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOltd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O0FDcEI5QjtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsY0FBYyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSlU7QUFDTjtBQUNvQjs7QUFFdEQsb0JBQW9CLGtEQUFPO0FBQzNCO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxVQUFVLEtBQUs7QUFDZjtBQUNBO0FBQ0EsR0FBRzs7QUFFSDs7QUFFQSxTQUFTLDREQUFrQjtBQUMzQjs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsV0FBVyxvQkFBb0I7QUFDL0I7O0FBRUEsWUFBWTtBQUNaLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLGlFQUFlLFdBQVcsRUFBQzs7Ozs7Ozs7Ozs7Ozs7OztBQzVDM0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBLGlFQUFlLGtCQUFrQixFQUFDOzs7Ozs7O1VDYmxDO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxnQ0FBZ0MsWUFBWTtXQUM1QztXQUNBLEU7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7O0FDTnFDOztBQUVyQywyREFBWSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgY29uZmlnID0ge1xuICBnaXRodWJUb2tlbjogJ2docF91WU05bGw3VXpRWENZNjA1UGhRaFQ2SFhtVE54TTE0QkhQRFInLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29uZmlnO1xuIiwiYXN5bmMgZnVuY3Rpb24gYXV0aCh0b2tlbikge1xuICAgIGNvbnN0IHRva2VuVHlwZSA9IHRva2VuLnNwbGl0KC9cXC4vKS5sZW5ndGggPT09IDNcbiAgICAgICAgPyBcImFwcFwiXG4gICAgICAgIDogL152XFxkK1xcLi8udGVzdCh0b2tlbilcbiAgICAgICAgICAgID8gXCJpbnN0YWxsYXRpb25cIlxuICAgICAgICAgICAgOiBcIm9hdXRoXCI7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogXCJ0b2tlblwiLFxuICAgICAgICB0b2tlbjogdG9rZW4sXG4gICAgICAgIHRva2VuVHlwZVxuICAgIH07XG59XG5cbi8qKlxuICogUHJlZml4IHRva2VuIGZvciB1c2FnZSBpbiB0aGUgQXV0aG9yaXphdGlvbiBoZWFkZXJcbiAqXG4gKiBAcGFyYW0gdG9rZW4gT0F1dGggdG9rZW4gb3IgSlNPTiBXZWIgVG9rZW5cbiAqL1xuZnVuY3Rpb24gd2l0aEF1dGhvcml6YXRpb25QcmVmaXgodG9rZW4pIHtcbiAgICBpZiAodG9rZW4uc3BsaXQoL1xcLi8pLmxlbmd0aCA9PT0gMykge1xuICAgICAgICByZXR1cm4gYGJlYXJlciAke3Rva2VufWA7XG4gICAgfVxuICAgIHJldHVybiBgdG9rZW4gJHt0b2tlbn1gO1xufVxuXG5hc3luYyBmdW5jdGlvbiBob29rKHRva2VuLCByZXF1ZXN0LCByb3V0ZSwgcGFyYW1ldGVycykge1xuICAgIGNvbnN0IGVuZHBvaW50ID0gcmVxdWVzdC5lbmRwb2ludC5tZXJnZShyb3V0ZSwgcGFyYW1ldGVycyk7XG4gICAgZW5kcG9pbnQuaGVhZGVycy5hdXRob3JpemF0aW9uID0gd2l0aEF1dGhvcml6YXRpb25QcmVmaXgodG9rZW4pO1xuICAgIHJldHVybiByZXF1ZXN0KGVuZHBvaW50KTtcbn1cblxuY29uc3QgY3JlYXRlVG9rZW5BdXRoID0gZnVuY3Rpb24gY3JlYXRlVG9rZW5BdXRoKHRva2VuKSB7XG4gICAgaWYgKCF0b2tlbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJbQG9jdG9raXQvYXV0aC10b2tlbl0gTm8gdG9rZW4gcGFzc2VkIHRvIGNyZWF0ZVRva2VuQXV0aFwiKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0b2tlbiAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJbQG9jdG9raXQvYXV0aC10b2tlbl0gVG9rZW4gcGFzc2VkIHRvIGNyZWF0ZVRva2VuQXV0aCBpcyBub3QgYSBzdHJpbmdcIik7XG4gICAgfVxuICAgIHRva2VuID0gdG9rZW4ucmVwbGFjZSgvXih0b2tlbnxiZWFyZXIpICsvaSwgXCJcIik7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oYXV0aC5iaW5kKG51bGwsIHRva2VuKSwge1xuICAgICAgICBob29rOiBob29rLmJpbmQobnVsbCwgdG9rZW4pXG4gICAgfSk7XG59O1xuXG5leHBvcnQgeyBjcmVhdGVUb2tlbkF1dGggfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcFxuIiwiaW1wb3J0IHsgZ2V0VXNlckFnZW50IH0gZnJvbSAndW5pdmVyc2FsLXVzZXItYWdlbnQnO1xuaW1wb3J0IHsgQ29sbGVjdGlvbiB9IGZyb20gJ2JlZm9yZS1hZnRlci1ob29rJztcbmltcG9ydCB7IHJlcXVlc3QgfSBmcm9tICdAb2N0b2tpdC9yZXF1ZXN0JztcbmltcG9ydCB7IHdpdGhDdXN0b21SZXF1ZXN0IH0gZnJvbSAnQG9jdG9raXQvZ3JhcGhxbCc7XG5pbXBvcnQgeyBjcmVhdGVUb2tlbkF1dGggfSBmcm9tICdAb2N0b2tpdC9hdXRoLXRva2VuJztcblxuY29uc3QgVkVSU0lPTiA9IFwiMy40LjBcIjtcblxuY2xhc3MgT2N0b2tpdCB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGNvbnN0IGhvb2sgPSBuZXcgQ29sbGVjdGlvbigpO1xuICAgICAgICBjb25zdCByZXF1ZXN0RGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBiYXNlVXJsOiByZXF1ZXN0LmVuZHBvaW50LkRFRkFVTFRTLmJhc2VVcmwsXG4gICAgICAgICAgICBoZWFkZXJzOiB7fSxcbiAgICAgICAgICAgIHJlcXVlc3Q6IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMucmVxdWVzdCwge1xuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmUgaW50ZXJuYWwgdXNhZ2Ugb25seSwgbm8gbmVlZCB0byB0eXBlXG4gICAgICAgICAgICAgICAgaG9vazogaG9vay5iaW5kKG51bGwsIFwicmVxdWVzdFwiKSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgbWVkaWFUeXBlOiB7XG4gICAgICAgICAgICAgICAgcHJldmlld3M6IFtdLFxuICAgICAgICAgICAgICAgIGZvcm1hdDogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIC8vIHByZXBlbmQgZGVmYXVsdCB1c2VyIGFnZW50IHdpdGggYG9wdGlvbnMudXNlckFnZW50YCBpZiBzZXRcbiAgICAgICAgcmVxdWVzdERlZmF1bHRzLmhlYWRlcnNbXCJ1c2VyLWFnZW50XCJdID0gW1xuICAgICAgICAgICAgb3B0aW9ucy51c2VyQWdlbnQsXG4gICAgICAgICAgICBgb2N0b2tpdC1jb3JlLmpzLyR7VkVSU0lPTn0gJHtnZXRVc2VyQWdlbnQoKX1gLFxuICAgICAgICBdXG4gICAgICAgICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gICAgICAgICAgICAuam9pbihcIiBcIik7XG4gICAgICAgIGlmIChvcHRpb25zLmJhc2VVcmwpIHtcbiAgICAgICAgICAgIHJlcXVlc3REZWZhdWx0cy5iYXNlVXJsID0gb3B0aW9ucy5iYXNlVXJsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLnByZXZpZXdzKSB7XG4gICAgICAgICAgICByZXF1ZXN0RGVmYXVsdHMubWVkaWFUeXBlLnByZXZpZXdzID0gb3B0aW9ucy5wcmV2aWV3cztcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy50aW1lWm9uZSkge1xuICAgICAgICAgICAgcmVxdWVzdERlZmF1bHRzLmhlYWRlcnNbXCJ0aW1lLXpvbmVcIl0gPSBvcHRpb25zLnRpbWVab25lO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVxdWVzdCA9IHJlcXVlc3QuZGVmYXVsdHMocmVxdWVzdERlZmF1bHRzKTtcbiAgICAgICAgdGhpcy5ncmFwaHFsID0gd2l0aEN1c3RvbVJlcXVlc3QodGhpcy5yZXF1ZXN0KS5kZWZhdWx0cyhyZXF1ZXN0RGVmYXVsdHMpO1xuICAgICAgICB0aGlzLmxvZyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgICAgICAgZGVidWc6ICgpID0+IHsgfSxcbiAgICAgICAgICAgIGluZm86ICgpID0+IHsgfSxcbiAgICAgICAgICAgIHdhcm46IGNvbnNvbGUud2Fybi5iaW5kKGNvbnNvbGUpLFxuICAgICAgICAgICAgZXJyb3I6IGNvbnNvbGUuZXJyb3IuYmluZChjb25zb2xlKSxcbiAgICAgICAgfSwgb3B0aW9ucy5sb2cpO1xuICAgICAgICB0aGlzLmhvb2sgPSBob29rO1xuICAgICAgICAvLyAoMSkgSWYgbmVpdGhlciBgb3B0aW9ucy5hdXRoU3RyYXRlZ3lgIG5vciBgb3B0aW9ucy5hdXRoYCBhcmUgc2V0LCB0aGUgYG9jdG9raXRgIGluc3RhbmNlXG4gICAgICAgIC8vICAgICBpcyB1bmF1dGhlbnRpY2F0ZWQuIFRoZSBgdGhpcy5hdXRoKClgIG1ldGhvZCBpcyBhIG5vLW9wIGFuZCBubyByZXF1ZXN0IGhvb2sgaXMgcmVnaXN0ZXJlZC5cbiAgICAgICAgLy8gKDIpIElmIG9ubHkgYG9wdGlvbnMuYXV0aGAgaXMgc2V0LCB1c2UgdGhlIGRlZmF1bHQgdG9rZW4gYXV0aGVudGljYXRpb24gc3RyYXRlZ3kuXG4gICAgICAgIC8vICgzKSBJZiBgb3B0aW9ucy5hdXRoU3RyYXRlZ3lgIGlzIHNldCB0aGVuIHVzZSBpdCBhbmQgcGFzcyBpbiBgb3B0aW9ucy5hdXRoYC4gQWx3YXlzIHBhc3Mgb3duIHJlcXVlc3QgYXMgbWFueSBzdHJhdGVnaWVzIGFjY2VwdCBhIGN1c3RvbSByZXF1ZXN0IGluc3RhbmNlLlxuICAgICAgICAvLyBUT0RPOiB0eXBlIGBvcHRpb25zLmF1dGhgIGJhc2VkIG9uIGBvcHRpb25zLmF1dGhTdHJhdGVneWAuXG4gICAgICAgIGlmICghb3B0aW9ucy5hdXRoU3RyYXRlZ3kpIHtcbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5hdXRoKSB7XG4gICAgICAgICAgICAgICAgLy8gKDEpXG4gICAgICAgICAgICAgICAgdGhpcy5hdXRoID0gYXN5bmMgKCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ1bmF1dGhlbnRpY2F0ZWRcIixcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vICgyKVxuICAgICAgICAgICAgICAgIGNvbnN0IGF1dGggPSBjcmVhdGVUb2tlbkF1dGgob3B0aW9ucy5hdXRoKTtcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlICDCr1xcXyjjg4QpXy/Cr1xuICAgICAgICAgICAgICAgIGhvb2sud3JhcChcInJlcXVlc3RcIiwgYXV0aC5ob29rKTtcbiAgICAgICAgICAgICAgICB0aGlzLmF1dGggPSBhdXRoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgeyBhdXRoU3RyYXRlZ3ksIC4uLm90aGVyT3B0aW9ucyB9ID0gb3B0aW9ucztcbiAgICAgICAgICAgIGNvbnN0IGF1dGggPSBhdXRoU3RyYXRlZ3koT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICAgICAgcmVxdWVzdDogdGhpcy5yZXF1ZXN0LFxuICAgICAgICAgICAgICAgIGxvZzogdGhpcy5sb2csXG4gICAgICAgICAgICAgICAgLy8gd2UgcGFzcyB0aGUgY3VycmVudCBvY3Rva2l0IGluc3RhbmNlIGFzIHdlbGwgYXMgaXRzIGNvbnN0cnVjdG9yIG9wdGlvbnNcbiAgICAgICAgICAgICAgICAvLyB0byBhbGxvdyBmb3IgYXV0aGVudGljYXRpb24gc3RyYXRlZ2llcyB0aGF0IHJldHVybiBhIG5ldyBvY3Rva2l0IGluc3RhbmNlXG4gICAgICAgICAgICAgICAgLy8gdGhhdCBzaGFyZXMgdGhlIHNhbWUgaW50ZXJuYWwgc3RhdGUgYXMgdGhlIGN1cnJlbnQgb25lLiBUaGUgb3JpZ2luYWxcbiAgICAgICAgICAgICAgICAvLyByZXF1aXJlbWVudCBmb3IgdGhpcyB3YXMgdGhlIFwiZXZlbnQtb2N0b2tpdFwiIGF1dGhlbnRpY2F0aW9uIHN0cmF0ZWd5XG4gICAgICAgICAgICAgICAgLy8gb2YgaHR0cHM6Ly9naXRodWIuY29tL3Byb2JvdC9vY3Rva2l0LWF1dGgtcHJvYm90LlxuICAgICAgICAgICAgICAgIG9jdG9raXQ6IHRoaXMsXG4gICAgICAgICAgICAgICAgb2N0b2tpdE9wdGlvbnM6IG90aGVyT3B0aW9ucyxcbiAgICAgICAgICAgIH0sIG9wdGlvbnMuYXV0aCkpO1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSAgwq9cXF8o44OEKV8vwq9cbiAgICAgICAgICAgIGhvb2sud3JhcChcInJlcXVlc3RcIiwgYXV0aC5ob29rKTtcbiAgICAgICAgICAgIHRoaXMuYXV0aCA9IGF1dGg7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYXBwbHkgcGx1Z2luc1xuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTYzNDUxNzJcbiAgICAgICAgY29uc3QgY2xhc3NDb25zdHJ1Y3RvciA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgIGNsYXNzQ29uc3RydWN0b3IucGx1Z2lucy5mb3JFYWNoKChwbHVnaW4pID0+IHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgcGx1Z2luKHRoaXMsIG9wdGlvbnMpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHN0YXRpYyBkZWZhdWx0cyhkZWZhdWx0cykge1xuICAgICAgICBjb25zdCBPY3Rva2l0V2l0aERlZmF1bHRzID0gY2xhc3MgZXh0ZW5kcyB0aGlzIHtcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0gYXJnc1swXSB8fCB7fTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGRlZmF1bHRzID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIoZGVmYXVsdHMob3B0aW9ucykpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN1cGVyKE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zLCBvcHRpb25zLnVzZXJBZ2VudCAmJiBkZWZhdWx0cy51c2VyQWdlbnRcbiAgICAgICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyQWdlbnQ6IGAke29wdGlvbnMudXNlckFnZW50fSAke2RlZmF1bHRzLnVzZXJBZ2VudH1gLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDogbnVsbCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gT2N0b2tpdFdpdGhEZWZhdWx0cztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQXR0YWNoIGEgcGx1Z2luIChvciBtYW55KSB0byB5b3VyIE9jdG9raXQgaW5zdGFuY2UuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNvbnN0IEFQSSA9IE9jdG9raXQucGx1Z2luKHBsdWdpbjEsIHBsdWdpbjIsIHBsdWdpbjMsIC4uLilcbiAgICAgKi9cbiAgICBzdGF0aWMgcGx1Z2luKC4uLm5ld1BsdWdpbnMpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBjb25zdCBjdXJyZW50UGx1Z2lucyA9IHRoaXMucGx1Z2lucztcbiAgICAgICAgY29uc3QgTmV3T2N0b2tpdCA9IChfYSA9IGNsYXNzIGV4dGVuZHMgdGhpcyB7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgX2EucGx1Z2lucyA9IGN1cnJlbnRQbHVnaW5zLmNvbmNhdChuZXdQbHVnaW5zLmZpbHRlcigocGx1Z2luKSA9PiAhY3VycmVudFBsdWdpbnMuaW5jbHVkZXMocGx1Z2luKSkpLFxuICAgICAgICAgICAgX2EpO1xuICAgICAgICByZXR1cm4gTmV3T2N0b2tpdDtcbiAgICB9XG59XG5PY3Rva2l0LlZFUlNJT04gPSBWRVJTSU9OO1xuT2N0b2tpdC5wbHVnaW5zID0gW107XG5cbmV4cG9ydCB7IE9jdG9raXQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcFxuIiwiaW1wb3J0IHsgaXNQbGFpbk9iamVjdCB9IGZyb20gJ2lzLXBsYWluLW9iamVjdCc7XG5pbXBvcnQgeyBnZXRVc2VyQWdlbnQgfSBmcm9tICd1bml2ZXJzYWwtdXNlci1hZ2VudCc7XG5cbmZ1bmN0aW9uIGxvd2VyY2FzZUtleXMob2JqZWN0KSB7XG4gICAgaWYgKCFvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqZWN0KS5yZWR1Y2UoKG5ld09iaiwga2V5KSA9PiB7XG4gICAgICAgIG5ld09ialtrZXkudG9Mb3dlckNhc2UoKV0gPSBvYmplY3Rba2V5XTtcbiAgICAgICAgcmV0dXJuIG5ld09iajtcbiAgICB9LCB7fSk7XG59XG5cbmZ1bmN0aW9uIG1lcmdlRGVlcChkZWZhdWx0cywgb3B0aW9ucykge1xuICAgIGNvbnN0IHJlc3VsdCA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzKTtcbiAgICBPYmplY3Qua2V5cyhvcHRpb25zKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgaWYgKGlzUGxhaW5PYmplY3Qob3B0aW9uc1trZXldKSkge1xuICAgICAgICAgICAgaWYgKCEoa2V5IGluIGRlZmF1bHRzKSlcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHJlc3VsdCwgeyBba2V5XTogb3B0aW9uc1trZXldIH0pO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2VEZWVwKGRlZmF1bHRzW2tleV0sIG9wdGlvbnNba2V5XSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHJlc3VsdCwgeyBba2V5XTogb3B0aW9uc1trZXldIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlVW5kZWZpbmVkUHJvcGVydGllcyhvYmopIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvYmopIHtcbiAgICAgICAgaWYgKG9ialtrZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xufVxuXG5mdW5jdGlvbiBtZXJnZShkZWZhdWx0cywgcm91dGUsIG9wdGlvbnMpIHtcbiAgICBpZiAodHlwZW9mIHJvdXRlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGxldCBbbWV0aG9kLCB1cmxdID0gcm91dGUuc3BsaXQoXCIgXCIpO1xuICAgICAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih1cmwgPyB7IG1ldGhvZCwgdXJsIH0gOiB7IHVybDogbWV0aG9kIH0sIG9wdGlvbnMpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHJvdXRlKTtcbiAgICB9XG4gICAgLy8gbG93ZXJjYXNlIGhlYWRlciBuYW1lcyBiZWZvcmUgbWVyZ2luZyB3aXRoIGRlZmF1bHRzIHRvIGF2b2lkIGR1cGxpY2F0ZXNcbiAgICBvcHRpb25zLmhlYWRlcnMgPSBsb3dlcmNhc2VLZXlzKG9wdGlvbnMuaGVhZGVycyk7XG4gICAgLy8gcmVtb3ZlIHByb3BlcnRpZXMgd2l0aCB1bmRlZmluZWQgdmFsdWVzIGJlZm9yZSBtZXJnaW5nXG4gICAgcmVtb3ZlVW5kZWZpbmVkUHJvcGVydGllcyhvcHRpb25zKTtcbiAgICByZW1vdmVVbmRlZmluZWRQcm9wZXJ0aWVzKG9wdGlvbnMuaGVhZGVycyk7XG4gICAgY29uc3QgbWVyZ2VkT3B0aW9ucyA9IG1lcmdlRGVlcChkZWZhdWx0cyB8fCB7fSwgb3B0aW9ucyk7XG4gICAgLy8gbWVkaWFUeXBlLnByZXZpZXdzIGFycmF5cyBhcmUgbWVyZ2VkLCBpbnN0ZWFkIG9mIG92ZXJ3cml0dGVuXG4gICAgaWYgKGRlZmF1bHRzICYmIGRlZmF1bHRzLm1lZGlhVHlwZS5wcmV2aWV3cy5sZW5ndGgpIHtcbiAgICAgICAgbWVyZ2VkT3B0aW9ucy5tZWRpYVR5cGUucHJldmlld3MgPSBkZWZhdWx0cy5tZWRpYVR5cGUucHJldmlld3NcbiAgICAgICAgICAgIC5maWx0ZXIoKHByZXZpZXcpID0+ICFtZXJnZWRPcHRpb25zLm1lZGlhVHlwZS5wcmV2aWV3cy5pbmNsdWRlcyhwcmV2aWV3KSlcbiAgICAgICAgICAgIC5jb25jYXQobWVyZ2VkT3B0aW9ucy5tZWRpYVR5cGUucHJldmlld3MpO1xuICAgIH1cbiAgICBtZXJnZWRPcHRpb25zLm1lZGlhVHlwZS5wcmV2aWV3cyA9IG1lcmdlZE9wdGlvbnMubWVkaWFUeXBlLnByZXZpZXdzLm1hcCgocHJldmlldykgPT4gcHJldmlldy5yZXBsYWNlKC8tcHJldmlldy8sIFwiXCIpKTtcbiAgICByZXR1cm4gbWVyZ2VkT3B0aW9ucztcbn1cblxuZnVuY3Rpb24gYWRkUXVlcnlQYXJhbWV0ZXJzKHVybCwgcGFyYW1ldGVycykge1xuICAgIGNvbnN0IHNlcGFyYXRvciA9IC9cXD8vLnRlc3QodXJsKSA/IFwiJlwiIDogXCI/XCI7XG4gICAgY29uc3QgbmFtZXMgPSBPYmplY3Qua2V5cyhwYXJhbWV0ZXJzKTtcbiAgICBpZiAobmFtZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfVxuICAgIHJldHVybiAodXJsICtcbiAgICAgICAgc2VwYXJhdG9yICtcbiAgICAgICAgbmFtZXNcbiAgICAgICAgICAgIC5tYXAoKG5hbWUpID0+IHtcbiAgICAgICAgICAgIGlmIChuYW1lID09PSBcInFcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiAoXCJxPVwiICsgcGFyYW1ldGVycy5xLnNwbGl0KFwiK1wiKS5tYXAoZW5jb2RlVVJJQ29tcG9uZW50KS5qb2luKFwiK1wiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYCR7bmFtZX09JHtlbmNvZGVVUklDb21wb25lbnQocGFyYW1ldGVyc1tuYW1lXSl9YDtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5qb2luKFwiJlwiKSk7XG59XG5cbmNvbnN0IHVybFZhcmlhYmxlUmVnZXggPSAvXFx7W159XStcXH0vZztcbmZ1bmN0aW9uIHJlbW92ZU5vbkNoYXJzKHZhcmlhYmxlTmFtZSkge1xuICAgIHJldHVybiB2YXJpYWJsZU5hbWUucmVwbGFjZSgvXlxcVyt8XFxXKyQvZywgXCJcIikuc3BsaXQoLywvKTtcbn1cbmZ1bmN0aW9uIGV4dHJhY3RVcmxWYXJpYWJsZU5hbWVzKHVybCkge1xuICAgIGNvbnN0IG1hdGNoZXMgPSB1cmwubWF0Y2godXJsVmFyaWFibGVSZWdleCk7XG4gICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgcmV0dXJuIG1hdGNoZXMubWFwKHJlbW92ZU5vbkNoYXJzKS5yZWR1Y2UoKGEsIGIpID0+IGEuY29uY2F0KGIpLCBbXSk7XG59XG5cbmZ1bmN0aW9uIG9taXQob2JqZWN0LCBrZXlzVG9PbWl0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iamVjdClcbiAgICAgICAgLmZpbHRlcigob3B0aW9uKSA9PiAha2V5c1RvT21pdC5pbmNsdWRlcyhvcHRpb24pKVxuICAgICAgICAucmVkdWNlKChvYmosIGtleSkgPT4ge1xuICAgICAgICBvYmpba2V5XSA9IG9iamVjdFtrZXldO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH0sIHt9KTtcbn1cblxuLy8gQmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2JyYW1zdGVpbi91cmwtdGVtcGxhdGUsIGxpY2Vuc2VkIHVuZGVyIEJTRFxuLy8gVE9ETzogY3JlYXRlIHNlcGFyYXRlIHBhY2thZ2UuXG4vL1xuLy8gQ29weXJpZ2h0IChjKSAyMDEyLTIwMTQsIEJyYW0gU3RlaW5cbi8vIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcbi8vIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uc1xuLy8gYXJlIG1ldDpcbi8vICAxLiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxuLy8gICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbi8vICAyLiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodFxuLy8gICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGVcbi8vICAgICBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuLy8gIDMuIFRoZSBuYW1lIG9mIHRoZSBhdXRob3IgbWF5IG5vdCBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0c1xuLy8gICAgIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxuLy8gVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQVVUSE9SIFwiQVMgSVNcIiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRFxuLy8gV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PXG4vLyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIE9XTkVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsXG4vLyBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORyxcbi8vIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsXG4vLyBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTlkgVEhFT1JZXG4vLyBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlQgKElOQ0xVRElOR1xuLy8gTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLFxuLy8gRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbi8qIGlzdGFuYnVsIGlnbm9yZSBmaWxlICovXG5mdW5jdGlvbiBlbmNvZGVSZXNlcnZlZChzdHIpIHtcbiAgICByZXR1cm4gc3RyXG4gICAgICAgIC5zcGxpdCgvKCVbMC05QS1GYS1mXXsyfSkvZylcbiAgICAgICAgLm1hcChmdW5jdGlvbiAocGFydCkge1xuICAgICAgICBpZiAoIS8lWzAtOUEtRmEtZl0vLnRlc3QocGFydCkpIHtcbiAgICAgICAgICAgIHBhcnQgPSBlbmNvZGVVUkkocGFydCkucmVwbGFjZSgvJTVCL2csIFwiW1wiKS5yZXBsYWNlKC8lNUQvZywgXCJdXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXJ0O1xuICAgIH0pXG4gICAgICAgIC5qb2luKFwiXCIpO1xufVxuZnVuY3Rpb24gZW5jb2RlVW5yZXNlcnZlZChzdHIpIHtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cikucmVwbGFjZSgvWyEnKCkqXS9nLCBmdW5jdGlvbiAoYykge1xuICAgICAgICByZXR1cm4gXCIlXCIgKyBjLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBlbmNvZGVWYWx1ZShvcGVyYXRvciwgdmFsdWUsIGtleSkge1xuICAgIHZhbHVlID1cbiAgICAgICAgb3BlcmF0b3IgPT09IFwiK1wiIHx8IG9wZXJhdG9yID09PSBcIiNcIlxuICAgICAgICAgICAgPyBlbmNvZGVSZXNlcnZlZCh2YWx1ZSlcbiAgICAgICAgICAgIDogZW5jb2RlVW5yZXNlcnZlZCh2YWx1ZSk7XG4gICAgaWYgKGtleSkge1xuICAgICAgICByZXR1cm4gZW5jb2RlVW5yZXNlcnZlZChrZXkpICsgXCI9XCIgKyB2YWx1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG59XG5mdW5jdGlvbiBpc0RlZmluZWQodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbDtcbn1cbmZ1bmN0aW9uIGlzS2V5T3BlcmF0b3Iob3BlcmF0b3IpIHtcbiAgICByZXR1cm4gb3BlcmF0b3IgPT09IFwiO1wiIHx8IG9wZXJhdG9yID09PSBcIiZcIiB8fCBvcGVyYXRvciA9PT0gXCI/XCI7XG59XG5mdW5jdGlvbiBnZXRWYWx1ZXMoY29udGV4dCwgb3BlcmF0b3IsIGtleSwgbW9kaWZpZXIpIHtcbiAgICB2YXIgdmFsdWUgPSBjb250ZXh0W2tleV0sIHJlc3VsdCA9IFtdO1xuICAgIGlmIChpc0RlZmluZWQodmFsdWUpICYmIHZhbHVlICE9PSBcIlwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgfHxcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJudW1iZXJcIiB8fFxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgaWYgKG1vZGlmaWVyICYmIG1vZGlmaWVyICE9PSBcIipcIikge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuc3Vic3RyaW5nKDAsIHBhcnNlSW50KG1vZGlmaWVyLCAxMCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0LnB1c2goZW5jb2RlVmFsdWUob3BlcmF0b3IsIHZhbHVlLCBpc0tleU9wZXJhdG9yKG9wZXJhdG9yKSA/IGtleSA6IFwiXCIpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChtb2RpZmllciA9PT0gXCIqXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUuZmlsdGVyKGlzRGVmaW5lZCkuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGVuY29kZVZhbHVlKG9wZXJhdG9yLCB2YWx1ZSwgaXNLZXlPcGVyYXRvcihvcGVyYXRvcikgPyBrZXkgOiBcIlwiKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXModmFsdWUpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0RlZmluZWQodmFsdWVba10pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goZW5jb2RlVmFsdWUob3BlcmF0b3IsIHZhbHVlW2tdLCBrKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRtcCA9IFtdO1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5maWx0ZXIoaXNEZWZpbmVkKS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG1wLnB1c2goZW5jb2RlVmFsdWUob3BlcmF0b3IsIHZhbHVlKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXModmFsdWUpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0RlZmluZWQodmFsdWVba10pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG1wLnB1c2goZW5jb2RlVW5yZXNlcnZlZChrKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG1wLnB1c2goZW5jb2RlVmFsdWUob3BlcmF0b3IsIHZhbHVlW2tdLnRvU3RyaW5nKCkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpc0tleU9wZXJhdG9yKG9wZXJhdG9yKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChlbmNvZGVVbnJlc2VydmVkKGtleSkgKyBcIj1cIiArIHRtcC5qb2luKFwiLFwiKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRtcC5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godG1wLmpvaW4oXCIsXCIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChvcGVyYXRvciA9PT0gXCI7XCIpIHtcbiAgICAgICAgICAgIGlmIChpc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goZW5jb2RlVW5yZXNlcnZlZChrZXkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh2YWx1ZSA9PT0gXCJcIiAmJiAob3BlcmF0b3IgPT09IFwiJlwiIHx8IG9wZXJhdG9yID09PSBcIj9cIikpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGVuY29kZVVucmVzZXJ2ZWQoa2V5KSArIFwiPVwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh2YWx1ZSA9PT0gXCJcIikge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goXCJcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIHBhcnNlVXJsKHRlbXBsYXRlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZXhwYW5kOiBleHBhbmQuYmluZChudWxsLCB0ZW1wbGF0ZSksXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGV4cGFuZCh0ZW1wbGF0ZSwgY29udGV4dCkge1xuICAgIHZhciBvcGVyYXRvcnMgPSBbXCIrXCIsIFwiI1wiLCBcIi5cIiwgXCIvXCIsIFwiO1wiLCBcIj9cIiwgXCImXCJdO1xuICAgIHJldHVybiB0ZW1wbGF0ZS5yZXBsYWNlKC9cXHsoW15cXHtcXH1dKylcXH18KFteXFx7XFx9XSspL2csIGZ1bmN0aW9uIChfLCBleHByZXNzaW9uLCBsaXRlcmFsKSB7XG4gICAgICAgIGlmIChleHByZXNzaW9uKSB7XG4gICAgICAgICAgICBsZXQgb3BlcmF0b3IgPSBcIlwiO1xuICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gW107XG4gICAgICAgICAgICBpZiAob3BlcmF0b3JzLmluZGV4T2YoZXhwcmVzc2lvbi5jaGFyQXQoMCkpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIG9wZXJhdG9yID0gZXhwcmVzc2lvbi5jaGFyQXQoMCk7XG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24uc3Vic3RyKDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXhwcmVzc2lvbi5zcGxpdCgvLC9nKS5mb3JFYWNoKGZ1bmN0aW9uICh2YXJpYWJsZSkge1xuICAgICAgICAgICAgICAgIHZhciB0bXAgPSAvKFteOlxcKl0qKSg/OjooXFxkKyl8KFxcKikpPy8uZXhlYyh2YXJpYWJsZSk7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goZ2V0VmFsdWVzKGNvbnRleHQsIG9wZXJhdG9yLCB0bXBbMV0sIHRtcFsyXSB8fCB0bXBbM10pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKG9wZXJhdG9yICYmIG9wZXJhdG9yICE9PSBcIitcIikge1xuICAgICAgICAgICAgICAgIHZhciBzZXBhcmF0b3IgPSBcIixcIjtcbiAgICAgICAgICAgICAgICBpZiAob3BlcmF0b3IgPT09IFwiP1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcGFyYXRvciA9IFwiJlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChvcGVyYXRvciAhPT0gXCIjXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VwYXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAodmFsdWVzLmxlbmd0aCAhPT0gMCA/IG9wZXJhdG9yIDogXCJcIikgKyB2YWx1ZXMuam9pbihzZXBhcmF0b3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlcy5qb2luKFwiLFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBlbmNvZGVSZXNlcnZlZChsaXRlcmFsKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBwYXJzZShvcHRpb25zKSB7XG4gICAgLy8gaHR0cHM6Ly9mZXRjaC5zcGVjLndoYXR3Zy5vcmcvI21ldGhvZHNcbiAgICBsZXQgbWV0aG9kID0gb3B0aW9ucy5tZXRob2QudG9VcHBlckNhc2UoKTtcbiAgICAvLyByZXBsYWNlIDp2YXJuYW1lIHdpdGgge3Zhcm5hbWV9IHRvIG1ha2UgaXQgUkZDIDY1NzAgY29tcGF0aWJsZVxuICAgIGxldCB1cmwgPSAob3B0aW9ucy51cmwgfHwgXCIvXCIpLnJlcGxhY2UoLzooW2Etel1cXHcrKS9nLCBcInskMX1cIik7XG4gICAgbGV0IGhlYWRlcnMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLmhlYWRlcnMpO1xuICAgIGxldCBib2R5O1xuICAgIGxldCBwYXJhbWV0ZXJzID0gb21pdChvcHRpb25zLCBbXG4gICAgICAgIFwibWV0aG9kXCIsXG4gICAgICAgIFwiYmFzZVVybFwiLFxuICAgICAgICBcInVybFwiLFxuICAgICAgICBcImhlYWRlcnNcIixcbiAgICAgICAgXCJyZXF1ZXN0XCIsXG4gICAgICAgIFwibWVkaWFUeXBlXCIsXG4gICAgXSk7XG4gICAgLy8gZXh0cmFjdCB2YXJpYWJsZSBuYW1lcyBmcm9tIFVSTCB0byBjYWxjdWxhdGUgcmVtYWluaW5nIHZhcmlhYmxlcyBsYXRlclxuICAgIGNvbnN0IHVybFZhcmlhYmxlTmFtZXMgPSBleHRyYWN0VXJsVmFyaWFibGVOYW1lcyh1cmwpO1xuICAgIHVybCA9IHBhcnNlVXJsKHVybCkuZXhwYW5kKHBhcmFtZXRlcnMpO1xuICAgIGlmICghL15odHRwLy50ZXN0KHVybCkpIHtcbiAgICAgICAgdXJsID0gb3B0aW9ucy5iYXNlVXJsICsgdXJsO1xuICAgIH1cbiAgICBjb25zdCBvbWl0dGVkUGFyYW1ldGVycyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpXG4gICAgICAgIC5maWx0ZXIoKG9wdGlvbikgPT4gdXJsVmFyaWFibGVOYW1lcy5pbmNsdWRlcyhvcHRpb24pKVxuICAgICAgICAuY29uY2F0KFwiYmFzZVVybFwiKTtcbiAgICBjb25zdCByZW1haW5pbmdQYXJhbWV0ZXJzID0gb21pdChwYXJhbWV0ZXJzLCBvbWl0dGVkUGFyYW1ldGVycyk7XG4gICAgY29uc3QgaXNCaW5hcnlSZXF1ZXN0ID0gL2FwcGxpY2F0aW9uXFwvb2N0ZXQtc3RyZWFtL2kudGVzdChoZWFkZXJzLmFjY2VwdCk7XG4gICAgaWYgKCFpc0JpbmFyeVJlcXVlc3QpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMubWVkaWFUeXBlLmZvcm1hdCkge1xuICAgICAgICAgICAgLy8gZS5nLiBhcHBsaWNhdGlvbi92bmQuZ2l0aHViLnYzK2pzb24gPT4gYXBwbGljYXRpb24vdm5kLmdpdGh1Yi52My5yYXdcbiAgICAgICAgICAgIGhlYWRlcnMuYWNjZXB0ID0gaGVhZGVycy5hY2NlcHRcbiAgICAgICAgICAgICAgICAuc3BsaXQoLywvKVxuICAgICAgICAgICAgICAgIC5tYXAoKHByZXZpZXcpID0+IHByZXZpZXcucmVwbGFjZSgvYXBwbGljYXRpb25cXC92bmQoXFwuXFx3KykoXFwudjMpPyhcXC5cXHcrKT8oXFwranNvbik/JC8sIGBhcHBsaWNhdGlvbi92bmQkMSQyLiR7b3B0aW9ucy5tZWRpYVR5cGUuZm9ybWF0fWApKVxuICAgICAgICAgICAgICAgIC5qb2luKFwiLFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5tZWRpYVR5cGUucHJldmlld3MubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBwcmV2aWV3c0Zyb21BY2NlcHRIZWFkZXIgPSBoZWFkZXJzLmFjY2VwdC5tYXRjaCgvW1xcdy1dKyg/PS1wcmV2aWV3KS9nKSB8fCBbXTtcbiAgICAgICAgICAgIGhlYWRlcnMuYWNjZXB0ID0gcHJldmlld3NGcm9tQWNjZXB0SGVhZGVyXG4gICAgICAgICAgICAgICAgLmNvbmNhdChvcHRpb25zLm1lZGlhVHlwZS5wcmV2aWV3cylcbiAgICAgICAgICAgICAgICAubWFwKChwcmV2aWV3KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZm9ybWF0ID0gb3B0aW9ucy5tZWRpYVR5cGUuZm9ybWF0XG4gICAgICAgICAgICAgICAgICAgID8gYC4ke29wdGlvbnMubWVkaWFUeXBlLmZvcm1hdH1gXG4gICAgICAgICAgICAgICAgICAgIDogXCIranNvblwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBgYXBwbGljYXRpb24vdm5kLmdpdGh1Yi4ke3ByZXZpZXd9LXByZXZpZXcke2Zvcm1hdH1gO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuam9pbihcIixcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gZm9yIEdFVC9IRUFEIHJlcXVlc3RzLCBzZXQgVVJMIHF1ZXJ5IHBhcmFtZXRlcnMgZnJvbSByZW1haW5pbmcgcGFyYW1ldGVyc1xuICAgIC8vIGZvciBQQVRDSC9QT1NUL1BVVC9ERUxFVEUgcmVxdWVzdHMsIHNldCByZXF1ZXN0IGJvZHkgZnJvbSByZW1haW5pbmcgcGFyYW1ldGVyc1xuICAgIGlmIChbXCJHRVRcIiwgXCJIRUFEXCJdLmluY2x1ZGVzKG1ldGhvZCkpIHtcbiAgICAgICAgdXJsID0gYWRkUXVlcnlQYXJhbWV0ZXJzKHVybCwgcmVtYWluaW5nUGFyYW1ldGVycyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAoXCJkYXRhXCIgaW4gcmVtYWluaW5nUGFyYW1ldGVycykge1xuICAgICAgICAgICAgYm9keSA9IHJlbWFpbmluZ1BhcmFtZXRlcnMuZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhyZW1haW5pbmdQYXJhbWV0ZXJzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBib2R5ID0gcmVtYWluaW5nUGFyYW1ldGVycztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGhlYWRlcnNbXCJjb250ZW50LWxlbmd0aFwiXSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gZGVmYXVsdCBjb250ZW50LXR5cGUgZm9yIEpTT04gaWYgYm9keSBpcyBzZXRcbiAgICBpZiAoIWhlYWRlcnNbXCJjb250ZW50LXR5cGVcIl0gJiYgdHlwZW9mIGJvZHkgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaGVhZGVyc1tcImNvbnRlbnQtdHlwZVwiXSA9IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiO1xuICAgIH1cbiAgICAvLyBHaXRIdWIgZXhwZWN0cyAnY29udGVudC1sZW5ndGg6IDAnIGhlYWRlciBmb3IgUFVUL1BBVENIIHJlcXVlc3RzIHdpdGhvdXQgYm9keS5cbiAgICAvLyBmZXRjaCBkb2VzIG5vdCBhbGxvdyB0byBzZXQgYGNvbnRlbnQtbGVuZ3RoYCBoZWFkZXIsIGJ1dCB3ZSBjYW4gc2V0IGJvZHkgdG8gYW4gZW1wdHkgc3RyaW5nXG4gICAgaWYgKFtcIlBBVENIXCIsIFwiUFVUXCJdLmluY2x1ZGVzKG1ldGhvZCkgJiYgdHlwZW9mIGJvZHkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgYm9keSA9IFwiXCI7XG4gICAgfVxuICAgIC8vIE9ubHkgcmV0dXJuIGJvZHkvcmVxdWVzdCBrZXlzIGlmIHByZXNlbnRcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IG1ldGhvZCwgdXJsLCBoZWFkZXJzIH0sIHR5cGVvZiBib2R5ICE9PSBcInVuZGVmaW5lZFwiID8geyBib2R5IH0gOiBudWxsLCBvcHRpb25zLnJlcXVlc3QgPyB7IHJlcXVlc3Q6IG9wdGlvbnMucmVxdWVzdCB9IDogbnVsbCk7XG59XG5cbmZ1bmN0aW9uIGVuZHBvaW50V2l0aERlZmF1bHRzKGRlZmF1bHRzLCByb3V0ZSwgb3B0aW9ucykge1xuICAgIHJldHVybiBwYXJzZShtZXJnZShkZWZhdWx0cywgcm91dGUsIG9wdGlvbnMpKTtcbn1cblxuZnVuY3Rpb24gd2l0aERlZmF1bHRzKG9sZERlZmF1bHRzLCBuZXdEZWZhdWx0cykge1xuICAgIGNvbnN0IERFRkFVTFRTID0gbWVyZ2Uob2xkRGVmYXVsdHMsIG5ld0RlZmF1bHRzKTtcbiAgICBjb25zdCBlbmRwb2ludCA9IGVuZHBvaW50V2l0aERlZmF1bHRzLmJpbmQobnVsbCwgREVGQVVMVFMpO1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKGVuZHBvaW50LCB7XG4gICAgICAgIERFRkFVTFRTLFxuICAgICAgICBkZWZhdWx0czogd2l0aERlZmF1bHRzLmJpbmQobnVsbCwgREVGQVVMVFMpLFxuICAgICAgICBtZXJnZTogbWVyZ2UuYmluZChudWxsLCBERUZBVUxUUyksXG4gICAgICAgIHBhcnNlLFxuICAgIH0pO1xufVxuXG5jb25zdCBWRVJTSU9OID0gXCI2LjAuMTFcIjtcblxuY29uc3QgdXNlckFnZW50ID0gYG9jdG9raXQtZW5kcG9pbnQuanMvJHtWRVJTSU9OfSAke2dldFVzZXJBZ2VudCgpfWA7XG4vLyBERUZBVUxUUyBoYXMgYWxsIHByb3BlcnRpZXMgc2V0IHRoYXQgRW5kcG9pbnRPcHRpb25zIGhhcywgZXhjZXB0IHVybC5cbi8vIFNvIHdlIHVzZSBSZXF1ZXN0UGFyYW1ldGVycyBhbmQgYWRkIG1ldGhvZCBhcyBhZGRpdGlvbmFsIHJlcXVpcmVkIHByb3BlcnR5LlxuY29uc3QgREVGQVVMVFMgPSB7XG4gICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgIGJhc2VVcmw6IFwiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbVwiLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICAgYWNjZXB0OiBcImFwcGxpY2F0aW9uL3ZuZC5naXRodWIudjMranNvblwiLFxuICAgICAgICBcInVzZXItYWdlbnRcIjogdXNlckFnZW50LFxuICAgIH0sXG4gICAgbWVkaWFUeXBlOiB7XG4gICAgICAgIGZvcm1hdDogXCJcIixcbiAgICAgICAgcHJldmlld3M6IFtdLFxuICAgIH0sXG59O1xuXG5jb25zdCBlbmRwb2ludCA9IHdpdGhEZWZhdWx0cyhudWxsLCBERUZBVUxUUyk7XG5cbmV4cG9ydCB7IGVuZHBvaW50IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXBcbiIsIi8qIVxuICogaXMtcGxhaW4tb2JqZWN0IDxodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9pcy1wbGFpbi1vYmplY3Q+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTcsIEpvbiBTY2hsaW5rZXJ0LlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbmZ1bmN0aW9uIGlzT2JqZWN0KG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59XG5cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qobykge1xuICB2YXIgY3Rvcixwcm90O1xuXG4gIGlmIChpc09iamVjdChvKSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcblxuICAvLyBJZiBoYXMgbW9kaWZpZWQgY29uc3RydWN0b3JcbiAgY3RvciA9IG8uY29uc3RydWN0b3I7XG4gIGlmIChjdG9yID09PSB1bmRlZmluZWQpIHJldHVybiB0cnVlO1xuXG4gIC8vIElmIGhhcyBtb2RpZmllZCBwcm90b3R5cGVcbiAgcHJvdCA9IGN0b3IucHJvdG90eXBlO1xuICBpZiAoaXNPYmplY3QocHJvdCkgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG5cbiAgLy8gSWYgY29uc3RydWN0b3IgZG9lcyBub3QgaGF2ZSBhbiBPYmplY3Qtc3BlY2lmaWMgbWV0aG9kXG4gIGlmIChwcm90Lmhhc093blByb3BlcnR5KCdpc1Byb3RvdHlwZU9mJykgPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gTW9zdCBsaWtlbHkgYSBwbGFpbiBPYmplY3RcbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCB7IGlzUGxhaW5PYmplY3QgfTtcbiIsImltcG9ydCB7IHJlcXVlc3QgfSBmcm9tICdAb2N0b2tpdC9yZXF1ZXN0JztcbmltcG9ydCB7IGdldFVzZXJBZ2VudCB9IGZyb20gJ3VuaXZlcnNhbC11c2VyLWFnZW50JztcblxuY29uc3QgVkVSU0lPTiA9IFwiNC42LjFcIjtcblxuY2xhc3MgR3JhcGhxbEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSByZXNwb25zZS5kYXRhLmVycm9yc1swXS5tZXNzYWdlO1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCByZXNwb25zZS5kYXRhKTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7IGhlYWRlcnM6IHJlc3BvbnNlLmhlYWRlcnMgfSk7XG4gICAgICAgIHRoaXMubmFtZSA9IFwiR3JhcGhxbEVycm9yXCI7XG4gICAgICAgIHRoaXMucmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgICAgIC8vIE1haW50YWlucyBwcm9wZXIgc3RhY2sgdHJhY2UgKG9ubHkgYXZhaWxhYmxlIG9uIFY4KVxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICAgICAgICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCBOT05fVkFSSUFCTEVfT1BUSU9OUyA9IFtcbiAgICBcIm1ldGhvZFwiLFxuICAgIFwiYmFzZVVybFwiLFxuICAgIFwidXJsXCIsXG4gICAgXCJoZWFkZXJzXCIsXG4gICAgXCJyZXF1ZXN0XCIsXG4gICAgXCJxdWVyeVwiLFxuICAgIFwibWVkaWFUeXBlXCIsXG5dO1xuY29uc3QgRk9SQklEREVOX1ZBUklBQkxFX09QVElPTlMgPSBbXCJxdWVyeVwiLCBcIm1ldGhvZFwiLCBcInVybFwiXTtcbmNvbnN0IEdIRVNfVjNfU1VGRklYX1JFR0VYID0gL1xcL2FwaVxcL3YzXFwvPyQvO1xuZnVuY3Rpb24gZ3JhcGhxbChyZXF1ZXN0LCBxdWVyeSwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcXVlcnkgPT09IFwic3RyaW5nXCIgJiYgXCJxdWVyeVwiIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoYFtAb2N0b2tpdC9ncmFwaHFsXSBcInF1ZXJ5XCIgY2Fubm90IGJlIHVzZWQgYXMgdmFyaWFibGUgbmFtZWApKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAoIUZPUkJJRERFTl9WQVJJQUJMRV9PUFRJT05TLmluY2x1ZGVzKGtleSkpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKGBbQG9jdG9raXQvZ3JhcGhxbF0gXCIke2tleX1cIiBjYW5ub3QgYmUgdXNlZCBhcyB2YXJpYWJsZSBuYW1lYCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHBhcnNlZE9wdGlvbnMgPSB0eXBlb2YgcXVlcnkgPT09IFwic3RyaW5nXCIgPyBPYmplY3QuYXNzaWduKHsgcXVlcnkgfSwgb3B0aW9ucykgOiBxdWVyeTtcbiAgICBjb25zdCByZXF1ZXN0T3B0aW9ucyA9IE9iamVjdC5rZXlzKHBhcnNlZE9wdGlvbnMpLnJlZHVjZSgocmVzdWx0LCBrZXkpID0+IHtcbiAgICAgICAgaWYgKE5PTl9WQVJJQUJMRV9PUFRJT05TLmluY2x1ZGVzKGtleSkpIHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gcGFyc2VkT3B0aW9uc1trZXldO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJlc3VsdC52YXJpYWJsZXMpIHtcbiAgICAgICAgICAgIHJlc3VsdC52YXJpYWJsZXMgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQudmFyaWFibGVzW2tleV0gPSBwYXJzZWRPcHRpb25zW2tleV07XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSwge30pO1xuICAgIC8vIHdvcmthcm91bmQgZm9yIEdpdEh1YiBFbnRlcnByaXNlIGJhc2VVcmwgc2V0IHdpdGggL2FwaS92MyBzdWZmaXhcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vb2N0b2tpdC9hdXRoLWFwcC5qcy9pc3N1ZXMvMTExI2lzc3VlY29tbWVudC02NTc2MTA0NTFcbiAgICBjb25zdCBiYXNlVXJsID0gcGFyc2VkT3B0aW9ucy5iYXNlVXJsIHx8IHJlcXVlc3QuZW5kcG9pbnQuREVGQVVMVFMuYmFzZVVybDtcbiAgICBpZiAoR0hFU19WM19TVUZGSVhfUkVHRVgudGVzdChiYXNlVXJsKSkge1xuICAgICAgICByZXF1ZXN0T3B0aW9ucy51cmwgPSBiYXNlVXJsLnJlcGxhY2UoR0hFU19WM19TVUZGSVhfUkVHRVgsIFwiL2FwaS9ncmFwaHFsXCIpO1xuICAgIH1cbiAgICByZXR1cm4gcmVxdWVzdChyZXF1ZXN0T3B0aW9ucykudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEuZXJyb3JzKSB7XG4gICAgICAgICAgICBjb25zdCBoZWFkZXJzID0ge307XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhyZXNwb25zZS5oZWFkZXJzKSkge1xuICAgICAgICAgICAgICAgIGhlYWRlcnNba2V5XSA9IHJlc3BvbnNlLmhlYWRlcnNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IG5ldyBHcmFwaHFsRXJyb3IocmVxdWVzdE9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzLFxuICAgICAgICAgICAgICAgIGRhdGE6IHJlc3BvbnNlLmRhdGEsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5kYXRhO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiB3aXRoRGVmYXVsdHMocmVxdWVzdCQxLCBuZXdEZWZhdWx0cykge1xuICAgIGNvbnN0IG5ld1JlcXVlc3QgPSByZXF1ZXN0JDEuZGVmYXVsdHMobmV3RGVmYXVsdHMpO1xuICAgIGNvbnN0IG5ld0FwaSA9IChxdWVyeSwgb3B0aW9ucykgPT4ge1xuICAgICAgICByZXR1cm4gZ3JhcGhxbChuZXdSZXF1ZXN0LCBxdWVyeSwgb3B0aW9ucyk7XG4gICAgfTtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihuZXdBcGksIHtcbiAgICAgICAgZGVmYXVsdHM6IHdpdGhEZWZhdWx0cy5iaW5kKG51bGwsIG5ld1JlcXVlc3QpLFxuICAgICAgICBlbmRwb2ludDogcmVxdWVzdC5lbmRwb2ludCxcbiAgICB9KTtcbn1cblxuY29uc3QgZ3JhcGhxbCQxID0gd2l0aERlZmF1bHRzKHJlcXVlc3QsIHtcbiAgICBoZWFkZXJzOiB7XG4gICAgICAgIFwidXNlci1hZ2VudFwiOiBgb2N0b2tpdC1ncmFwaHFsLmpzLyR7VkVSU0lPTn0gJHtnZXRVc2VyQWdlbnQoKX1gLFxuICAgIH0sXG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICB1cmw6IFwiL2dyYXBocWxcIixcbn0pO1xuZnVuY3Rpb24gd2l0aEN1c3RvbVJlcXVlc3QoY3VzdG9tUmVxdWVzdCkge1xuICAgIHJldHVybiB3aXRoRGVmYXVsdHMoY3VzdG9tUmVxdWVzdCwge1xuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICB1cmw6IFwiL2dyYXBocWxcIixcbiAgICB9KTtcbn1cblxuZXhwb3J0IHsgZ3JhcGhxbCQxIGFzIGdyYXBocWwsIHdpdGhDdXN0b21SZXF1ZXN0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXBcbiIsImltcG9ydCB7IERlcHJlY2F0aW9uIH0gZnJvbSAnZGVwcmVjYXRpb24nO1xuaW1wb3J0IG9uY2UgZnJvbSAnb25jZSc7XG5cbmNvbnN0IGxvZ09uY2UgPSBvbmNlKChkZXByZWNhdGlvbikgPT4gY29uc29sZS53YXJuKGRlcHJlY2F0aW9uKSk7XG4vKipcbiAqIEVycm9yIHdpdGggZXh0cmEgcHJvcGVydGllcyB0byBoZWxwIHdpdGggZGVidWdnaW5nXG4gKi9cbmNsYXNzIFJlcXVlc3RFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBzdGF0dXNDb2RlLCBvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICAvLyBNYWludGFpbnMgcHJvcGVyIHN0YWNrIHRyYWNlIChvbmx5IGF2YWlsYWJsZSBvbiBWOClcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5hbWUgPSBcIkh0dHBFcnJvclwiO1xuICAgICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1c0NvZGU7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImNvZGVcIiwge1xuICAgICAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgICAgIGxvZ09uY2UobmV3IERlcHJlY2F0aW9uKFwiW0BvY3Rva2l0L3JlcXVlc3QtZXJyb3JdIGBlcnJvci5jb2RlYCBpcyBkZXByZWNhdGVkLCB1c2UgYGVycm9yLnN0YXR1c2AuXCIpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdHVzQ29kZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmhlYWRlcnMgPSBvcHRpb25zLmhlYWRlcnMgfHwge307XG4gICAgICAgIC8vIHJlZGFjdCByZXF1ZXN0IGNyZWRlbnRpYWxzIHdpdGhvdXQgbXV0YXRpbmcgb3JpZ2luYWwgcmVxdWVzdCBvcHRpb25zXG4gICAgICAgIGNvbnN0IHJlcXVlc3RDb3B5ID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucy5yZXF1ZXN0KTtcbiAgICAgICAgaWYgKG9wdGlvbnMucmVxdWVzdC5oZWFkZXJzLmF1dGhvcml6YXRpb24pIHtcbiAgICAgICAgICAgIHJlcXVlc3RDb3B5LmhlYWRlcnMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLnJlcXVlc3QuaGVhZGVycywge1xuICAgICAgICAgICAgICAgIGF1dGhvcml6YXRpb246IG9wdGlvbnMucmVxdWVzdC5oZWFkZXJzLmF1dGhvcml6YXRpb24ucmVwbGFjZSgvIC4qJC8sIFwiIFtSRURBQ1RFRF1cIiksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0Q29weS51cmwgPSByZXF1ZXN0Q29weS51cmxcbiAgICAgICAgICAgIC8vIGNsaWVudF9pZCAmIGNsaWVudF9zZWNyZXQgY2FuIGJlIHBhc3NlZCBhcyBVUkwgcXVlcnkgcGFyYW1ldGVycyB0byBpbmNyZWFzZSByYXRlIGxpbWl0XG4gICAgICAgICAgICAvLyBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My8jaW5jcmVhc2luZy10aGUtdW5hdXRoZW50aWNhdGVkLXJhdGUtbGltaXQtZm9yLW9hdXRoLWFwcGxpY2F0aW9uc1xuICAgICAgICAgICAgLnJlcGxhY2UoL1xcYmNsaWVudF9zZWNyZXQ9XFx3Ky9nLCBcImNsaWVudF9zZWNyZXQ9W1JFREFDVEVEXVwiKVxuICAgICAgICAgICAgLy8gT0F1dGggdG9rZW5zIGNhbiBiZSBwYXNzZWQgYXMgVVJMIHF1ZXJ5IHBhcmFtZXRlcnMsIGFsdGhvdWdoIGl0IGlzIG5vdCByZWNvbW1lbmRlZFxuICAgICAgICAgICAgLy8gc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvI29hdXRoMi10b2tlbi1zZW50LWluLWEtaGVhZGVyXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxiYWNjZXNzX3Rva2VuPVxcdysvZywgXCJhY2Nlc3NfdG9rZW49W1JFREFDVEVEXVwiKTtcbiAgICAgICAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdENvcHk7XG4gICAgfVxufVxuXG5leHBvcnQgeyBSZXF1ZXN0RXJyb3IgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcFxuIiwiaW1wb3J0IHsgZW5kcG9pbnQgfSBmcm9tICdAb2N0b2tpdC9lbmRwb2ludCc7XG5pbXBvcnQgeyBnZXRVc2VyQWdlbnQgfSBmcm9tICd1bml2ZXJzYWwtdXNlci1hZ2VudCc7XG5pbXBvcnQgeyBpc1BsYWluT2JqZWN0IH0gZnJvbSAnaXMtcGxhaW4tb2JqZWN0JztcbmltcG9ydCBub2RlRmV0Y2ggZnJvbSAnbm9kZS1mZXRjaCc7XG5pbXBvcnQgeyBSZXF1ZXN0RXJyb3IgfSBmcm9tICdAb2N0b2tpdC9yZXF1ZXN0LWVycm9yJztcblxuY29uc3QgVkVSU0lPTiA9IFwiNS40LjE1XCI7XG5cbmZ1bmN0aW9uIGdldEJ1ZmZlclJlc3BvbnNlKHJlc3BvbnNlKSB7XG4gICAgcmV0dXJuIHJlc3BvbnNlLmFycmF5QnVmZmVyKCk7XG59XG5cbmZ1bmN0aW9uIGZldGNoV3JhcHBlcihyZXF1ZXN0T3B0aW9ucykge1xuICAgIGlmIChpc1BsYWluT2JqZWN0KHJlcXVlc3RPcHRpb25zLmJvZHkpIHx8XG4gICAgICAgIEFycmF5LmlzQXJyYXkocmVxdWVzdE9wdGlvbnMuYm9keSkpIHtcbiAgICAgICAgcmVxdWVzdE9wdGlvbnMuYm9keSA9IEpTT04uc3RyaW5naWZ5KHJlcXVlc3RPcHRpb25zLmJvZHkpO1xuICAgIH1cbiAgICBsZXQgaGVhZGVycyA9IHt9O1xuICAgIGxldCBzdGF0dXM7XG4gICAgbGV0IHVybDtcbiAgICBjb25zdCBmZXRjaCA9IChyZXF1ZXN0T3B0aW9ucy5yZXF1ZXN0ICYmIHJlcXVlc3RPcHRpb25zLnJlcXVlc3QuZmV0Y2gpIHx8IG5vZGVGZXRjaDtcbiAgICByZXR1cm4gZmV0Y2gocmVxdWVzdE9wdGlvbnMudXJsLCBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgbWV0aG9kOiByZXF1ZXN0T3B0aW9ucy5tZXRob2QsXG4gICAgICAgIGJvZHk6IHJlcXVlc3RPcHRpb25zLmJvZHksXG4gICAgICAgIGhlYWRlcnM6IHJlcXVlc3RPcHRpb25zLmhlYWRlcnMsXG4gICAgICAgIHJlZGlyZWN0OiByZXF1ZXN0T3B0aW9ucy5yZWRpcmVjdCxcbiAgICB9LCBcbiAgICAvLyBgcmVxdWVzdE9wdGlvbnMucmVxdWVzdC5hZ2VudGAgdHlwZSBpcyBpbmNvbXBhdGlibGVcbiAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL29jdG9raXQvdHlwZXMudHMvcHVsbC8yNjRcbiAgICByZXF1ZXN0T3B0aW9ucy5yZXF1ZXN0KSlcbiAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIHVybCA9IHJlc3BvbnNlLnVybDtcbiAgICAgICAgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xuICAgICAgICBmb3IgKGNvbnN0IGtleUFuZFZhbHVlIG9mIHJlc3BvbnNlLmhlYWRlcnMpIHtcbiAgICAgICAgICAgIGhlYWRlcnNba2V5QW5kVmFsdWVbMF1dID0ga2V5QW5kVmFsdWVbMV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMjA0IHx8IHN0YXR1cyA9PT0gMjA1KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gR2l0SHViIEFQSSByZXR1cm5zIDIwMCBmb3IgSEVBRCByZXF1ZXN0c1xuICAgICAgICBpZiAocmVxdWVzdE9wdGlvbnMubWV0aG9kID09PSBcIkhFQURcIikge1xuICAgICAgICAgICAgaWYgKHN0YXR1cyA8IDQwMCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IG5ldyBSZXF1ZXN0RXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCwgc3RhdHVzLCB7XG4gICAgICAgICAgICAgICAgaGVhZGVycyxcbiAgICAgICAgICAgICAgICByZXF1ZXN0OiByZXF1ZXN0T3B0aW9ucyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGF0dXMgPT09IDMwNCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJlcXVlc3RFcnJvcihcIk5vdCBtb2RpZmllZFwiLCBzdGF0dXMsIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzLFxuICAgICAgICAgICAgICAgIHJlcXVlc3Q6IHJlcXVlc3RPcHRpb25zLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXR1cyA+PSA0MDApIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgICAgICAgICAgIC50ZXh0KClcbiAgICAgICAgICAgICAgICAudGhlbigobWVzc2FnZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yID0gbmV3IFJlcXVlc3RFcnJvcihtZXNzYWdlLCBzdGF0dXMsIHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdDogcmVxdWVzdE9wdGlvbnMsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlQm9keSA9IEpTT04ucGFyc2UoZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oZXJyb3IsIHJlc3BvbnNlQm9keSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBlcnJvcnMgPSByZXNwb25zZUJvZHkuZXJyb3JzO1xuICAgICAgICAgICAgICAgICAgICAvLyBBc3N1bXB0aW9uIGBlcnJvcnNgIHdvdWxkIGFsd2F5cyBiZSBpbiBBcnJheSBmb3JtYXRcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IubWVzc2FnZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvci5tZXNzYWdlICsgXCI6IFwiICsgZXJyb3JzLm1hcChKU09OLnN0cmluZ2lmeSkuam9pbihcIiwgXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZ25vcmUsIHNlZSBvY3Rva2l0L3Jlc3QuanMjNjg0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29udGVudFR5cGUgPSByZXNwb25zZS5oZWFkZXJzLmdldChcImNvbnRlbnQtdHlwZVwiKTtcbiAgICAgICAgaWYgKC9hcHBsaWNhdGlvblxcL2pzb24vLnRlc3QoY29udGVudFR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghY29udGVudFR5cGUgfHwgL150ZXh0XFwvfGNoYXJzZXQ9dXRmLTgkLy50ZXN0KGNvbnRlbnRUeXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ2V0QnVmZmVyUmVzcG9uc2UocmVzcG9uc2UpO1xuICAgIH0pXG4gICAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXMsXG4gICAgICAgICAgICB1cmwsXG4gICAgICAgICAgICBoZWFkZXJzLFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgfTtcbiAgICB9KVxuICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIFJlcXVlc3RFcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IFJlcXVlc3RFcnJvcihlcnJvci5tZXNzYWdlLCA1MDAsIHtcbiAgICAgICAgICAgIGhlYWRlcnMsXG4gICAgICAgICAgICByZXF1ZXN0OiByZXF1ZXN0T3B0aW9ucyxcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHdpdGhEZWZhdWx0cyhvbGRFbmRwb2ludCwgbmV3RGVmYXVsdHMpIHtcbiAgICBjb25zdCBlbmRwb2ludCA9IG9sZEVuZHBvaW50LmRlZmF1bHRzKG5ld0RlZmF1bHRzKTtcbiAgICBjb25zdCBuZXdBcGkgPSBmdW5jdGlvbiAocm91dGUsIHBhcmFtZXRlcnMpIHtcbiAgICAgICAgY29uc3QgZW5kcG9pbnRPcHRpb25zID0gZW5kcG9pbnQubWVyZ2Uocm91dGUsIHBhcmFtZXRlcnMpO1xuICAgICAgICBpZiAoIWVuZHBvaW50T3B0aW9ucy5yZXF1ZXN0IHx8ICFlbmRwb2ludE9wdGlvbnMucmVxdWVzdC5ob29rKSB7XG4gICAgICAgICAgICByZXR1cm4gZmV0Y2hXcmFwcGVyKGVuZHBvaW50LnBhcnNlKGVuZHBvaW50T3B0aW9ucykpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlcXVlc3QgPSAocm91dGUsIHBhcmFtZXRlcnMpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBmZXRjaFdyYXBwZXIoZW5kcG9pbnQucGFyc2UoZW5kcG9pbnQubWVyZ2Uocm91dGUsIHBhcmFtZXRlcnMpKSk7XG4gICAgICAgIH07XG4gICAgICAgIE9iamVjdC5hc3NpZ24ocmVxdWVzdCwge1xuICAgICAgICAgICAgZW5kcG9pbnQsXG4gICAgICAgICAgICBkZWZhdWx0czogd2l0aERlZmF1bHRzLmJpbmQobnVsbCwgZW5kcG9pbnQpLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGVuZHBvaW50T3B0aW9ucy5yZXF1ZXN0Lmhvb2socmVxdWVzdCwgZW5kcG9pbnRPcHRpb25zKTtcbiAgICB9O1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKG5ld0FwaSwge1xuICAgICAgICBlbmRwb2ludCxcbiAgICAgICAgZGVmYXVsdHM6IHdpdGhEZWZhdWx0cy5iaW5kKG51bGwsIGVuZHBvaW50KSxcbiAgICB9KTtcbn1cblxuY29uc3QgcmVxdWVzdCA9IHdpdGhEZWZhdWx0cyhlbmRwb2ludCwge1xuICAgIGhlYWRlcnM6IHtcbiAgICAgICAgXCJ1c2VyLWFnZW50XCI6IGBvY3Rva2l0LXJlcXVlc3QuanMvJHtWRVJTSU9OfSAke2dldFVzZXJBZ2VudCgpfWAsXG4gICAgfSxcbn0pO1xuXG5leHBvcnQgeyByZXF1ZXN0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXBcbiIsIi8qIVxuICogaXMtcGxhaW4tb2JqZWN0IDxodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9pcy1wbGFpbi1vYmplY3Q+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTcsIEpvbiBTY2hsaW5rZXJ0LlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbmZ1bmN0aW9uIGlzT2JqZWN0KG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59XG5cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qobykge1xuICB2YXIgY3Rvcixwcm90O1xuXG4gIGlmIChpc09iamVjdChvKSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcblxuICAvLyBJZiBoYXMgbW9kaWZpZWQgY29uc3RydWN0b3JcbiAgY3RvciA9IG8uY29uc3RydWN0b3I7XG4gIGlmIChjdG9yID09PSB1bmRlZmluZWQpIHJldHVybiB0cnVlO1xuXG4gIC8vIElmIGhhcyBtb2RpZmllZCBwcm90b3R5cGVcbiAgcHJvdCA9IGN0b3IucHJvdG90eXBlO1xuICBpZiAoaXNPYmplY3QocHJvdCkgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG5cbiAgLy8gSWYgY29uc3RydWN0b3IgZG9lcyBub3QgaGF2ZSBhbiBPYmplY3Qtc3BlY2lmaWMgbWV0aG9kXG4gIGlmIChwcm90Lmhhc093blByb3BlcnR5KCdpc1Byb3RvdHlwZU9mJykgPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gTW9zdCBsaWtlbHkgYSBwbGFpbiBPYmplY3RcbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCB7IGlzUGxhaW5PYmplY3QgfTtcbiIsInZhciByZWdpc3RlciA9IHJlcXVpcmUoJy4vbGliL3JlZ2lzdGVyJylcbnZhciBhZGRIb29rID0gcmVxdWlyZSgnLi9saWIvYWRkJylcbnZhciByZW1vdmVIb29rID0gcmVxdWlyZSgnLi9saWIvcmVtb3ZlJylcblxuLy8gYmluZCB3aXRoIGFycmF5IG9mIGFyZ3VtZW50czogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIxNzkyOTEzXG52YXIgYmluZCA9IEZ1bmN0aW9uLmJpbmRcbnZhciBiaW5kYWJsZSA9IGJpbmQuYmluZChiaW5kKVxuXG5mdW5jdGlvbiBiaW5kQXBpIChob29rLCBzdGF0ZSwgbmFtZSkge1xuICB2YXIgcmVtb3ZlSG9va1JlZiA9IGJpbmRhYmxlKHJlbW92ZUhvb2ssIG51bGwpLmFwcGx5KG51bGwsIG5hbWUgPyBbc3RhdGUsIG5hbWVdIDogW3N0YXRlXSlcbiAgaG9vay5hcGkgPSB7IHJlbW92ZTogcmVtb3ZlSG9va1JlZiB9XG4gIGhvb2sucmVtb3ZlID0gcmVtb3ZlSG9va1JlZlxuXG4gIDtbJ2JlZm9yZScsICdlcnJvcicsICdhZnRlcicsICd3cmFwJ10uZm9yRWFjaChmdW5jdGlvbiAoa2luZCkge1xuICAgIHZhciBhcmdzID0gbmFtZSA/IFtzdGF0ZSwga2luZCwgbmFtZV0gOiBbc3RhdGUsIGtpbmRdXG4gICAgaG9va1traW5kXSA9IGhvb2suYXBpW2tpbmRdID0gYmluZGFibGUoYWRkSG9vaywgbnVsbCkuYXBwbHkobnVsbCwgYXJncylcbiAgfSlcbn1cblxuZnVuY3Rpb24gSG9va1Npbmd1bGFyICgpIHtcbiAgdmFyIHNpbmd1bGFySG9va05hbWUgPSAnaCdcbiAgdmFyIHNpbmd1bGFySG9va1N0YXRlID0ge1xuICAgIHJlZ2lzdHJ5OiB7fVxuICB9XG4gIHZhciBzaW5ndWxhckhvb2sgPSByZWdpc3Rlci5iaW5kKG51bGwsIHNpbmd1bGFySG9va1N0YXRlLCBzaW5ndWxhckhvb2tOYW1lKVxuICBiaW5kQXBpKHNpbmd1bGFySG9vaywgc2luZ3VsYXJIb29rU3RhdGUsIHNpbmd1bGFySG9va05hbWUpXG4gIHJldHVybiBzaW5ndWxhckhvb2tcbn1cblxuZnVuY3Rpb24gSG9va0NvbGxlY3Rpb24gKCkge1xuICB2YXIgc3RhdGUgPSB7XG4gICAgcmVnaXN0cnk6IHt9XG4gIH1cblxuICB2YXIgaG9vayA9IHJlZ2lzdGVyLmJpbmQobnVsbCwgc3RhdGUpXG4gIGJpbmRBcGkoaG9vaywgc3RhdGUpXG5cbiAgcmV0dXJuIGhvb2tcbn1cblxudmFyIGNvbGxlY3Rpb25Ib29rRGVwcmVjYXRpb25NZXNzYWdlRGlzcGxheWVkID0gZmFsc2VcbmZ1bmN0aW9uIEhvb2sgKCkge1xuICBpZiAoIWNvbGxlY3Rpb25Ib29rRGVwcmVjYXRpb25NZXNzYWdlRGlzcGxheWVkKSB7XG4gICAgY29uc29sZS53YXJuKCdbYmVmb3JlLWFmdGVyLWhvb2tdOiBcIkhvb2soKVwiIHJlcHVycG9zaW5nIHdhcm5pbmcsIHVzZSBcIkhvb2suQ29sbGVjdGlvbigpXCIuIFJlYWQgbW9yZTogaHR0cHM6Ly9naXQuaW8vdXBncmFkZS1iZWZvcmUtYWZ0ZXItaG9vay10by0xLjQnKVxuICAgIGNvbGxlY3Rpb25Ib29rRGVwcmVjYXRpb25NZXNzYWdlRGlzcGxheWVkID0gdHJ1ZVxuICB9XG4gIHJldHVybiBIb29rQ29sbGVjdGlvbigpXG59XG5cbkhvb2suU2luZ3VsYXIgPSBIb29rU2luZ3VsYXIuYmluZCgpXG5Ib29rLkNvbGxlY3Rpb24gPSBIb29rQ29sbGVjdGlvbi5iaW5kKClcblxubW9kdWxlLmV4cG9ydHMgPSBIb29rXG4vLyBleHBvc2UgY29uc3RydWN0b3JzIGFzIGEgbmFtZWQgcHJvcGVydHkgZm9yIFR5cGVTY3JpcHRcbm1vZHVsZS5leHBvcnRzLkhvb2sgPSBIb29rXG5tb2R1bGUuZXhwb3J0cy5TaW5ndWxhciA9IEhvb2suU2luZ3VsYXJcbm1vZHVsZS5leHBvcnRzLkNvbGxlY3Rpb24gPSBIb29rLkNvbGxlY3Rpb25cbiIsIm1vZHVsZS5leHBvcnRzID0gYWRkSG9vaztcblxuZnVuY3Rpb24gYWRkSG9vayhzdGF0ZSwga2luZCwgbmFtZSwgaG9vaykge1xuICB2YXIgb3JpZyA9IGhvb2s7XG4gIGlmICghc3RhdGUucmVnaXN0cnlbbmFtZV0pIHtcbiAgICBzdGF0ZS5yZWdpc3RyeVtuYW1lXSA9IFtdO1xuICB9XG5cbiAgaWYgKGtpbmQgPT09IFwiYmVmb3JlXCIpIHtcbiAgICBob29rID0gZnVuY3Rpb24gKG1ldGhvZCwgb3B0aW9ucykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAgIC50aGVuKG9yaWcuYmluZChudWxsLCBvcHRpb25zKSlcbiAgICAgICAgLnRoZW4obWV0aG9kLmJpbmQobnVsbCwgb3B0aW9ucykpO1xuICAgIH07XG4gIH1cblxuICBpZiAoa2luZCA9PT0gXCJhZnRlclwiKSB7XG4gICAgaG9vayA9IGZ1bmN0aW9uIChtZXRob2QsIG9wdGlvbnMpIHtcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgLnRoZW4obWV0aG9kLmJpbmQobnVsbCwgb3B0aW9ucykpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXN1bHRfKSB7XG4gICAgICAgICAgcmVzdWx0ID0gcmVzdWx0XztcbiAgICAgICAgICByZXR1cm4gb3JpZyhyZXN1bHQsIG9wdGlvbnMpO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChraW5kID09PSBcImVycm9yXCIpIHtcbiAgICBob29rID0gZnVuY3Rpb24gKG1ldGhvZCwgb3B0aW9ucykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAgIC50aGVuKG1ldGhvZC5iaW5kKG51bGwsIG9wdGlvbnMpKVxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIG9yaWcoZXJyb3IsIG9wdGlvbnMpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICB9XG5cbiAgc3RhdGUucmVnaXN0cnlbbmFtZV0ucHVzaCh7XG4gICAgaG9vazogaG9vayxcbiAgICBvcmlnOiBvcmlnLFxuICB9KTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVnaXN0ZXI7XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKHN0YXRlLCBuYW1lLCBtZXRob2QsIG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBtZXRob2QgIT09IFwiZnVuY3Rpb25cIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIm1ldGhvZCBmb3IgYmVmb3JlIGhvb2sgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuICB9XG5cbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkobmFtZSkpIHtcbiAgICByZXR1cm4gbmFtZS5yZXZlcnNlKCkucmVkdWNlKGZ1bmN0aW9uIChjYWxsYmFjaywgbmFtZSkge1xuICAgICAgcmV0dXJuIHJlZ2lzdGVyLmJpbmQobnVsbCwgc3RhdGUsIG5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKTtcbiAgICB9LCBtZXRob2QpKCk7XG4gIH1cblxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFzdGF0ZS5yZWdpc3RyeVtuYW1lXSkge1xuICAgICAgcmV0dXJuIG1ldGhvZChvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGUucmVnaXN0cnlbbmFtZV0ucmVkdWNlKGZ1bmN0aW9uIChtZXRob2QsIHJlZ2lzdGVyZWQpIHtcbiAgICAgIHJldHVybiByZWdpc3RlcmVkLmhvb2suYmluZChudWxsLCBtZXRob2QsIG9wdGlvbnMpO1xuICAgIH0sIG1ldGhvZCkoKTtcbiAgfSk7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlbW92ZUhvb2s7XG5cbmZ1bmN0aW9uIHJlbW92ZUhvb2soc3RhdGUsIG5hbWUsIG1ldGhvZCkge1xuICBpZiAoIXN0YXRlLnJlZ2lzdHJ5W25hbWVdKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGluZGV4ID0gc3RhdGUucmVnaXN0cnlbbmFtZV1cbiAgICAubWFwKGZ1bmN0aW9uIChyZWdpc3RlcmVkKSB7XG4gICAgICByZXR1cm4gcmVnaXN0ZXJlZC5vcmlnO1xuICAgIH0pXG4gICAgLmluZGV4T2YobWV0aG9kKTtcblxuICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc3RhdGUucmVnaXN0cnlbbmFtZV0uc3BsaWNlKGluZGV4LCAxKTtcbn1cbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvY3NzV2l0aE1hcHBpbmdUb1N0cmluZy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiKiB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG59XFxuXFxuYm9keSB7XFxuICBmb250LWZhbWlseTogJ1JvYm90bycsIHNhbnMtc2VyaWY7XFxufVxcblxcbmgxIHtcXG4gIGZvbnQtc2l6ZTogMi4zcmVtO1xcbiAgZm9udC13ZWlnaHQ6IDcwMDtcXG59XFxuXFxuLmNvbnRhaW5lciB7XFxuICB3aWR0aDogOTAlO1xcbiAgbWFyZ2luOiAwIGF1dG87XFxufVxcblxcbi5yb3cge1xcbiAgZGlzcGxheTogZmxleDtcXG59XFxuXFxuLnJvdy1iZXR3ZWVuIHtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG59XFxuXFxuLnVzZXJsaXN0LXNlY3Rpb24ge1xcbn1cXG5cXG4udXNlcmxpc3Qtc2VjdGlvbl9faGVhZGVyIHtcXG4gIHBhZGRpbmc6IDEuM2VtIDA7XFxufVxcblxcbi51c2VybGlzdC1zZWN0aW9uX19uYXYge1xcbn1cXG5cXG4udXNlcmxpc3Qtc2VjdGlvbl9fc2VhcmNoLXRhYiB7XFxufVxcblxcbi50YWIge1xcbiAgcGFkZGluZy1ib3R0b206IDAuNGVtO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBmb250LXNpemU6IDEuNXJlbTtcXG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4udGFiLS1hY3RpdmUge1xcbiAgYm9yZGVyLWJvdHRvbTogNXB4IHNvbGlkICMxOTgwZmE7XFxufVxcblxcbi51c2VybGlzdC1zZWN0aW9uX19zZWFyY2gtYmFyIHtcXG4gIGJvcmRlci10b3A6IDFweCBzb2xpZCBibGFjaztcXG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCBibGFjaztcXG5cXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi51c2VybGlzdC1zZWN0aW9uX19zZWFyY2gtaW5wdXQge1xcbiAgYm9yZGVyOiBub25lO1xcbiAgcGFkZGluZzogMC41ZW0gMDtcXG4gIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgd2lkdGg6IDc1JTtcXG59XFxuXFxuLnVzZXJsaXN0LXNlY3Rpb25fX3NlYXJjaC1idG4ge1xcbiAgYm9yZGVyOiBub25lO1xcbiAgYmFja2dyb3VuZDogbm9uZTtcXG59XFxuXFxuLnVzZXJsaXN0LXNlY3Rpb25fX3NlYXJjaC1pY29uIHtcXG4gIC8qIGJhY2tncm91bmQ6IGdyZWVuOyAqL1xcbn1cXG5cXG4vKioqKioqKioqKioqKiBcXG5tYWluXFxuKioqKioqKioqKioqKiovXFxuXFxuLnVzZXJzIHtcXG59XFxuXFxuLnVzZXJzX19yb3cge1xcbn1cXG5cXG4udXNlcnNfX3Jvdy10aXRsZSB7XFxuICBjb2xvcjogIzBmMGYwZjtcXG59XFxuXFxuLnVzZXIge1xcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIGJsYWNrO1xcbiAgcGFkZGluZzogMC4zZW0gMDtcXG5cXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi51c2VyX19pbWcge1xcbiAgYm9yZGVyLXJhZGl1czogMTAwcHg7XFxuICBoZWlnaHQ6IDYwcHg7XFxuICB3aWR0aDogNjBweDtcXG59XFxuXFxuLnVzZXJfX25hbWUge1xcbiAgZm9udC1zaXplOiAxLjI1cmVtO1xcbiAgY29sb3I6IGdyZWVuO1xcbn1cXG5cXG4udXNlcl9fZmF2b3JpdGUge1xcbiAgYmFja2dyb3VuZDogbm9uZTtcXG4gIGJvcmRlcjogbm9uZTtcXG4gIG91dGxpbmU6IG5vbmU7XFxufVxcblxcbi5zdGFyLWljb24ge1xcbiAgZmlsbDogI2ZmZjtcXG4gIHN0cm9rZS13aWR0aDogMTtcXG4gIHN0cm9rZTogIzAwMDtcXG59XFxuXFxuLnN0YXItaWNvbi0tYWN0aXZlIHtcXG4gIGZpbGw6ICMxOTgwZmE7XFxufVxcblwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvc3R5bGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0UsU0FBUztFQUNULFVBQVU7RUFDVixzQkFBc0I7QUFDeEI7O0FBRUE7RUFDRSxpQ0FBaUM7QUFDbkM7O0FBRUE7RUFDRSxpQkFBaUI7RUFDakIsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsVUFBVTtFQUNWLGNBQWM7QUFDaEI7O0FBRUE7RUFDRSxhQUFhO0FBQ2Y7O0FBRUE7RUFDRSw4QkFBOEI7QUFDaEM7O0FBRUE7QUFDQTs7QUFFQTtFQUNFLGdCQUFnQjtBQUNsQjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7RUFDRSxxQkFBcUI7RUFDckIsV0FBVztFQUNYLGlCQUFpQjtFQUNqQix5QkFBeUI7RUFDekIsYUFBYTtFQUNiLHVCQUF1QjtFQUN2QixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxnQ0FBZ0M7QUFDbEM7O0FBRUE7RUFDRSwyQkFBMkI7RUFDM0IsOEJBQThCOztFQUU5Qiw4QkFBOEI7RUFDOUIsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsWUFBWTtFQUNaLGdCQUFnQjtFQUNoQixpQkFBaUI7RUFDakIsVUFBVTtBQUNaOztBQUVBO0VBQ0UsWUFBWTtFQUNaLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLHVCQUF1QjtBQUN6Qjs7QUFFQTs7Y0FFYzs7QUFFZDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7RUFDRSxjQUFjO0FBQ2hCOztBQUVBO0VBQ0UsOEJBQThCO0VBQzlCLGdCQUFnQjs7RUFFaEIsOEJBQThCO0VBQzlCLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLG9CQUFvQjtFQUNwQixZQUFZO0VBQ1osV0FBVztBQUNiOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLFlBQVk7QUFDZDs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixZQUFZO0VBQ1osYUFBYTtBQUNmOztBQUVBO0VBQ0UsVUFBVTtFQUNWLGVBQWU7RUFDZixZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxhQUFhO0FBQ2ZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiKiB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG59XFxuXFxuYm9keSB7XFxuICBmb250LWZhbWlseTogJ1JvYm90bycsIHNhbnMtc2VyaWY7XFxufVxcblxcbmgxIHtcXG4gIGZvbnQtc2l6ZTogMi4zcmVtO1xcbiAgZm9udC13ZWlnaHQ6IDcwMDtcXG59XFxuXFxuLmNvbnRhaW5lciB7XFxuICB3aWR0aDogOTAlO1xcbiAgbWFyZ2luOiAwIGF1dG87XFxufVxcblxcbi5yb3cge1xcbiAgZGlzcGxheTogZmxleDtcXG59XFxuXFxuLnJvdy1iZXR3ZWVuIHtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG59XFxuXFxuLnVzZXJsaXN0LXNlY3Rpb24ge1xcbn1cXG5cXG4udXNlcmxpc3Qtc2VjdGlvbl9faGVhZGVyIHtcXG4gIHBhZGRpbmc6IDEuM2VtIDA7XFxufVxcblxcbi51c2VybGlzdC1zZWN0aW9uX19uYXYge1xcbn1cXG5cXG4udXNlcmxpc3Qtc2VjdGlvbl9fc2VhcmNoLXRhYiB7XFxufVxcblxcbi50YWIge1xcbiAgcGFkZGluZy1ib3R0b206IDAuNGVtO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBmb250LXNpemU6IDEuNXJlbTtcXG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4udGFiLS1hY3RpdmUge1xcbiAgYm9yZGVyLWJvdHRvbTogNXB4IHNvbGlkICMxOTgwZmE7XFxufVxcblxcbi51c2VybGlzdC1zZWN0aW9uX19zZWFyY2gtYmFyIHtcXG4gIGJvcmRlci10b3A6IDFweCBzb2xpZCBibGFjaztcXG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCBibGFjaztcXG5cXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi51c2VybGlzdC1zZWN0aW9uX19zZWFyY2gtaW5wdXQge1xcbiAgYm9yZGVyOiBub25lO1xcbiAgcGFkZGluZzogMC41ZW0gMDtcXG4gIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgd2lkdGg6IDc1JTtcXG59XFxuXFxuLnVzZXJsaXN0LXNlY3Rpb25fX3NlYXJjaC1idG4ge1xcbiAgYm9yZGVyOiBub25lO1xcbiAgYmFja2dyb3VuZDogbm9uZTtcXG59XFxuXFxuLnVzZXJsaXN0LXNlY3Rpb25fX3NlYXJjaC1pY29uIHtcXG4gIC8qIGJhY2tncm91bmQ6IGdyZWVuOyAqL1xcbn1cXG5cXG4vKioqKioqKioqKioqKiBcXG5tYWluXFxuKioqKioqKioqKioqKiovXFxuXFxuLnVzZXJzIHtcXG59XFxuXFxuLnVzZXJzX19yb3cge1xcbn1cXG5cXG4udXNlcnNfX3Jvdy10aXRsZSB7XFxuICBjb2xvcjogIzBmMGYwZjtcXG59XFxuXFxuLnVzZXIge1xcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIGJsYWNrO1xcbiAgcGFkZGluZzogMC4zZW0gMDtcXG5cXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi51c2VyX19pbWcge1xcbiAgYm9yZGVyLXJhZGl1czogMTAwcHg7XFxuICBoZWlnaHQ6IDYwcHg7XFxuICB3aWR0aDogNjBweDtcXG59XFxuXFxuLnVzZXJfX25hbWUge1xcbiAgZm9udC1zaXplOiAxLjI1cmVtO1xcbiAgY29sb3I6IGdyZWVuO1xcbn1cXG5cXG4udXNlcl9fZmF2b3JpdGUge1xcbiAgYmFja2dyb3VuZDogbm9uZTtcXG4gIGJvcmRlcjogbm9uZTtcXG4gIG91dGxpbmU6IG5vbmU7XFxufVxcblxcbi5zdGFyLWljb24ge1xcbiAgZmlsbDogI2ZmZjtcXG4gIHN0cm9rZS13aWR0aDogMTtcXG4gIHN0cm9rZTogIzAwMDtcXG59XFxuXFxuLnN0YXItaWNvbi0tYWN0aXZlIHtcXG4gIGZpbGw6ICMxOTgwZmE7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdOyAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuXG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICByZXR1cm4gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGNvbnRlbnQsIFwifVwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTsgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcblxuXG4gIGxpc3QuaSA9IGZ1bmN0aW9uIChtb2R1bGVzLCBtZWRpYVF1ZXJ5LCBkZWR1cGUpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xuICAgIH1cblxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1kZXN0cnVjdHVyaW5nXG4gICAgICAgIHZhciBpZCA9IHRoaXNbaV1bMF07XG5cbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbW9kdWxlcy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2ldKTtcblxuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb250aW51ZVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1lZGlhUXVlcnkpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhUXVlcnk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsyXSA9IFwiXCIuY29uY2F0KG1lZGlhUXVlcnksIFwiIGFuZCBcIikuY29uY2F0KGl0ZW1bMl0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfc2xpY2VkVG9BcnJheShhcnIsIGkpIHsgcmV0dXJuIF9hcnJheVdpdGhIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHx8IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIsIGkpIHx8IF9ub25JdGVyYWJsZVJlc3QoKTsgfVxuXG5mdW5jdGlvbiBfbm9uSXRlcmFibGVSZXN0KCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9XG5cbmZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHsgaWYgKCFvKSByZXR1cm47IGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTsgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTsgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7IGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgfVxuXG5mdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikgeyBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgeyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoYXJyKSkpIHJldHVybjsgdmFyIF9hcnIgPSBbXTsgdmFyIF9uID0gdHJ1ZTsgdmFyIF9kID0gZmFsc2U7IHZhciBfZSA9IHVuZGVmaW5lZDsgdHJ5IHsgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkgeyBfYXJyLnB1c2goX3MudmFsdWUpOyBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7IH0gfSBjYXRjaCAoZXJyKSB7IF9kID0gdHJ1ZTsgX2UgPSBlcnI7IH0gZmluYWxseSB7IHRyeSB7IGlmICghX24gJiYgX2lbXCJyZXR1cm5cIl0gIT0gbnVsbCkgX2lbXCJyZXR1cm5cIl0oKTsgfSBmaW5hbGx5IHsgaWYgKF9kKSB0aHJvdyBfZTsgfSB9IHJldHVybiBfYXJyOyB9XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhIb2xlcyhhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIGFycjsgfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSkge1xuICB2YXIgX2l0ZW0gPSBfc2xpY2VkVG9BcnJheShpdGVtLCA0KSxcbiAgICAgIGNvbnRlbnQgPSBfaXRlbVsxXSxcbiAgICAgIGNzc01hcHBpbmcgPSBfaXRlbVszXTtcblxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgdmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgIHJldHVybiBcIi8qIyBzb3VyY2VVUkw9XCIuY29uY2F0KGNzc01hcHBpbmcuc291cmNlUm9vdCB8fCBcIlwiKS5jb25jYXQoc291cmNlLCBcIiAqL1wiKTtcbiAgICB9KTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG5cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJjbGFzcyBEZXByZWNhdGlvbiBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpOyAvLyBNYWludGFpbnMgcHJvcGVyIHN0YWNrIHRyYWNlIChvbmx5IGF2YWlsYWJsZSBvbiBWOClcblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cbiAgICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpO1xuICAgIH1cblxuICAgIHRoaXMubmFtZSA9ICdEZXByZWNhdGlvbic7XG4gIH1cblxufVxuXG5leHBvcnQgeyBEZXByZWNhdGlvbiB9O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIHJlZjogaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtZ2xvYmFsXG52YXIgZ2V0R2xvYmFsID0gZnVuY3Rpb24gKCkge1xuXHQvLyB0aGUgb25seSByZWxpYWJsZSBtZWFucyB0byBnZXQgdGhlIGdsb2JhbCBvYmplY3QgaXNcblx0Ly8gYEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKClgXG5cdC8vIEhvd2V2ZXIsIHRoaXMgY2F1c2VzIENTUCB2aW9sYXRpb25zIGluIENocm9tZSBhcHBzLlxuXHRpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7IHJldHVybiBzZWxmOyB9XG5cdGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgeyByZXR1cm4gd2luZG93OyB9XG5cdGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykgeyByZXR1cm4gZ2xvYmFsOyB9XG5cdHRocm93IG5ldyBFcnJvcigndW5hYmxlIHRvIGxvY2F0ZSBnbG9iYWwgb2JqZWN0Jyk7XG59XG5cbnZhciBnbG9iYWwgPSBnZXRHbG9iYWwoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZ2xvYmFsLmZldGNoO1xuXG4vLyBOZWVkZWQgZm9yIFR5cGVTY3JpcHQgYW5kIFdlYnBhY2suXG5pZiAoZ2xvYmFsLmZldGNoKSB7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IGdsb2JhbC5mZXRjaC5iaW5kKGdsb2JhbCk7XG59XG5cbmV4cG9ydHMuSGVhZGVycyA9IGdsb2JhbC5IZWFkZXJzO1xuZXhwb3J0cy5SZXF1ZXN0ID0gZ2xvYmFsLlJlcXVlc3Q7XG5leHBvcnRzLlJlc3BvbnNlID0gZ2xvYmFsLlJlc3BvbnNlOyIsInZhciB3cmFwcHkgPSByZXF1aXJlKCd3cmFwcHknKVxubW9kdWxlLmV4cG9ydHMgPSB3cmFwcHkob25jZSlcbm1vZHVsZS5leHBvcnRzLnN0cmljdCA9IHdyYXBweShvbmNlU3RyaWN0KVxuXG5vbmNlLnByb3RvID0gb25jZShmdW5jdGlvbiAoKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGdW5jdGlvbi5wcm90b3R5cGUsICdvbmNlJywge1xuICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gb25jZSh0aGlzKVxuICAgIH0sXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pXG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZ1bmN0aW9uLnByb3RvdHlwZSwgJ29uY2VTdHJpY3QnLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBvbmNlU3RyaWN0KHRoaXMpXG4gICAgfSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSlcbn0pXG5cbmZ1bmN0aW9uIG9uY2UgKGZuKSB7XG4gIHZhciBmID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChmLmNhbGxlZCkgcmV0dXJuIGYudmFsdWVcbiAgICBmLmNhbGxlZCA9IHRydWVcbiAgICByZXR1cm4gZi52YWx1ZSA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgfVxuICBmLmNhbGxlZCA9IGZhbHNlXG4gIHJldHVybiBmXG59XG5cbmZ1bmN0aW9uIG9uY2VTdHJpY3QgKGZuKSB7XG4gIHZhciBmID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChmLmNhbGxlZClcbiAgICAgIHRocm93IG5ldyBFcnJvcihmLm9uY2VFcnJvcilcbiAgICBmLmNhbGxlZCA9IHRydWVcbiAgICByZXR1cm4gZi52YWx1ZSA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgfVxuICB2YXIgbmFtZSA9IGZuLm5hbWUgfHwgJ0Z1bmN0aW9uIHdyYXBwZWQgd2l0aCBgb25jZWAnXG4gIGYub25jZUVycm9yID0gbmFtZSArIFwiIHNob3VsZG4ndCBiZSBjYWxsZWQgbW9yZSB0aGFuIG9uY2VcIlxuICBmLmNhbGxlZCA9IGZhbHNlXG4gIHJldHVybiBmXG59XG4iLCJpbXBvcnQgYXBpIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICAgICAgICBpbXBvcnQgY29udGVudCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLmluc2VydCA9IFwiaGVhZFwiO1xub3B0aW9ucy5zaW5nbGV0b24gPSBmYWxzZTtcblxudmFyIHVwZGF0ZSA9IGFwaShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCBkZWZhdWx0IGNvbnRlbnQubG9jYWxzIHx8IHt9OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgaXNPbGRJRSA9IGZ1bmN0aW9uIGlzT2xkSUUoKSB7XG4gIHZhciBtZW1vO1xuICByZXR1cm4gZnVuY3Rpb24gbWVtb3JpemUoKSB7XG4gICAgaWYgKHR5cGVvZiBtZW1vID09PSAndW5kZWZpbmVkJykge1xuICAgICAgLy8gVGVzdCBmb3IgSUUgPD0gOSBhcyBwcm9wb3NlZCBieSBCcm93c2VyaGFja3NcbiAgICAgIC8vIEBzZWUgaHR0cDovL2Jyb3dzZXJoYWNrcy5jb20vI2hhY2stZTcxZDg2OTJmNjUzMzQxNzNmZWU3MTVjMjIyY2I4MDVcbiAgICAgIC8vIFRlc3RzIGZvciBleGlzdGVuY2Ugb2Ygc3RhbmRhcmQgZ2xvYmFscyBpcyB0byBhbGxvdyBzdHlsZS1sb2FkZXJcbiAgICAgIC8vIHRvIG9wZXJhdGUgY29ycmVjdGx5IGludG8gbm9uLXN0YW5kYXJkIGVudmlyb25tZW50c1xuICAgICAgLy8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlci9pc3N1ZXMvMTc3XG4gICAgICBtZW1vID0gQm9vbGVhbih3aW5kb3cgJiYgZG9jdW1lbnQgJiYgZG9jdW1lbnQuYWxsICYmICF3aW5kb3cuYXRvYik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lbW87XG4gIH07XG59KCk7XG5cbnZhciBnZXRUYXJnZXQgPSBmdW5jdGlvbiBnZXRUYXJnZXQoKSB7XG4gIHZhciBtZW1vID0ge307XG4gIHJldHVybiBmdW5jdGlvbiBtZW1vcml6ZSh0YXJnZXQpIHtcbiAgICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTsgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblxuICAgICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbiAgfTtcbn0oKTtcblxudmFyIHN0eWxlc0luRG9tID0gW107XG5cbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5Eb20ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5Eb21baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXVxuICAgIH07XG5cbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRvbVtpbmRleF0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5Eb21baW5kZXhdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGVzSW5Eb20ucHVzaCh7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IGFkZFN0eWxlKG9iaiwgb3B0aW9ucyksXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cblxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIHZhciBhdHRyaWJ1dGVzID0gb3B0aW9ucy5hdHRyaWJ1dGVzIHx8IHt9O1xuXG4gIGlmICh0eXBlb2YgYXR0cmlidXRlcy5ub25jZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09ICd1bmRlZmluZWQnID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuXG4gICAgaWYgKG5vbmNlKSB7XG4gICAgICBhdHRyaWJ1dGVzLm5vbmNlID0gbm9uY2U7XG4gICAgfVxuICB9XG5cbiAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgc3R5bGUuc2V0QXR0cmlidXRlKGtleSwgYXR0cmlidXRlc1trZXldKTtcbiAgfSk7XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zLmluc2VydCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIG9wdGlvbnMuaW5zZXJ0KHN0eWxlKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KG9wdGlvbnMuaW5zZXJ0IHx8ICdoZWFkJyk7XG5cbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgICB9XG5cbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICB9XG5cbiAgcmV0dXJuIHN0eWxlO1xufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZS5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3R5bGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZSk7XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG52YXIgcmVwbGFjZVRleHQgPSBmdW5jdGlvbiByZXBsYWNlVGV4dCgpIHtcbiAgdmFyIHRleHRTdG9yZSA9IFtdO1xuICByZXR1cm4gZnVuY3Rpb24gcmVwbGFjZShpbmRleCwgcmVwbGFjZW1lbnQpIHtcbiAgICB0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG4gICAgcmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XG4gIH07XG59KCk7XG5cbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcoc3R5bGUsIGluZGV4LCByZW1vdmUsIG9iaikge1xuICB2YXIgY3NzID0gcmVtb3ZlID8gJycgOiBvYmoubWVkaWEgPyBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpLmNvbmNhdChvYmouY3NzLCBcIn1cIikgOiBvYmouY3NzOyAvLyBGb3Igb2xkIElFXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuICAgIHZhciBjaGlsZE5vZGVzID0gc3R5bGUuY2hpbGROb2RlcztcblxuICAgIGlmIChjaGlsZE5vZGVzW2luZGV4XSkge1xuICAgICAgc3R5bGUucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuICAgIH1cblxuICAgIGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgc3R5bGUuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGUuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGFwcGx5VG9UYWcoc3R5bGUsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gb2JqLmNzcztcbiAgdmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuICBpZiAobWVkaWEpIHtcbiAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ21lZGlhJywgbWVkaWEpO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLnJlbW92ZUF0dHJpYnV0ZSgnbWVkaWEnKTtcbiAgfVxuXG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH0gLy8gRm9yIG9sZCBJRVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cblxuXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZS5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZS5yZW1vdmVDaGlsZChzdHlsZS5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG52YXIgc2luZ2xldG9uID0gbnVsbDtcbnZhciBzaW5nbGV0b25Db3VudGVyID0gMDtcblxuZnVuY3Rpb24gYWRkU3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBzdHlsZTtcbiAgdmFyIHVwZGF0ZTtcbiAgdmFyIHJlbW92ZTtcblxuICBpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcbiAgICB2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcbiAgICBzdHlsZSA9IHNpbmdsZXRvbiB8fCAoc2luZ2xldG9uID0gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpKTtcbiAgICB1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIGZhbHNlKTtcbiAgICByZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIHRydWUpO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlID0gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICAgIHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZSwgb3B0aW9ucyk7XG5cbiAgICByZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuICAgIH07XG4gIH1cblxuICB1cGRhdGUob2JqKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB1cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVtb3ZlKCk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9OyAvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cbiAgLy8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxuXG4gIGlmICghb3B0aW9ucy5zaW5nbGV0b24gJiYgdHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uICE9PSAnYm9vbGVhbicpIHtcbiAgICBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcbiAgfVxuXG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcblxuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobmV3TGlzdCkgIT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRG9tW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuXG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcblxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuXG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuXG4gICAgICBpZiAoc3R5bGVzSW5Eb21bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRG9tW19pbmRleF0udXBkYXRlcigpO1xuXG4gICAgICAgIHN0eWxlc0luRG9tLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiZnVuY3Rpb24gZ2V0VXNlckFnZW50KCkge1xuICAgIGlmICh0eXBlb2YgbmF2aWdhdG9yID09PSBcIm9iamVjdFwiICYmIFwidXNlckFnZW50XCIgaW4gbmF2aWdhdG9yKSB7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50O1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgXCJ2ZXJzaW9uXCIgaW4gcHJvY2Vzcykge1xuICAgICAgICByZXR1cm4gYE5vZGUuanMvJHtwcm9jZXNzLnZlcnNpb24uc3Vic3RyKDEpfSAoJHtwcm9jZXNzLnBsYXRmb3JtfTsgJHtwcm9jZXNzLmFyY2h9KWA7XG4gICAgfVxuICAgIHJldHVybiBcIjxlbnZpcm9ubWVudCB1bmRldGVjdGFibGU+XCI7XG59XG5cbmV4cG9ydCB7IGdldFVzZXJBZ2VudCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwXG4iLCIvLyBSZXR1cm5zIGEgd3JhcHBlciBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSB3cmFwcGVkIGNhbGxiYWNrXG4vLyBUaGUgd3JhcHBlciBmdW5jdGlvbiBzaG91bGQgZG8gc29tZSBzdHVmZiwgYW5kIHJldHVybiBhXG4vLyBwcmVzdW1hYmx5IGRpZmZlcmVudCBjYWxsYmFjayBmdW5jdGlvbi5cbi8vIFRoaXMgbWFrZXMgc3VyZSB0aGF0IG93biBwcm9wZXJ0aWVzIGFyZSByZXRhaW5lZCwgc28gdGhhdFxuLy8gZGVjb3JhdGlvbnMgYW5kIHN1Y2ggYXJlIG5vdCBsb3N0IGFsb25nIHRoZSB3YXkuXG5tb2R1bGUuZXhwb3J0cyA9IHdyYXBweVxuZnVuY3Rpb24gd3JhcHB5IChmbiwgY2IpIHtcbiAgaWYgKGZuICYmIGNiKSByZXR1cm4gd3JhcHB5KGZuKShjYilcblxuICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ25lZWQgd3JhcHBlciBmdW5jdGlvbicpXG5cbiAgT2JqZWN0LmtleXMoZm4pLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICB3cmFwcGVyW2tdID0gZm5ba11cbiAgfSlcblxuICByZXR1cm4gd3JhcHBlclxuXG4gIGZ1bmN0aW9uIHdyYXBwZXIoKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV1cbiAgICB9XG4gICAgdmFyIHJldCA9IGZuLmFwcGx5KHRoaXMsIGFyZ3MpXG4gICAgdmFyIGNiID0gYXJnc1thcmdzLmxlbmd0aC0xXVxuICAgIGlmICh0eXBlb2YgcmV0ID09PSAnZnVuY3Rpb24nICYmIHJldCAhPT0gY2IpIHtcbiAgICAgIE9iamVjdC5rZXlzKGNiKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgIHJldFtrXSA9IGNiW2tdXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gcmV0XG4gIH1cbn1cbiIsImltcG9ydCBzb3J0VXNlckJ5QWxwaGFiZXQgZnJvbSAnLi4vaGVscGVycy9zb3J0VXNlckJ5QWxwaGFiZXQnO1xuXG5mdW5jdGlvbiBMb2NhbFN0b3JhZ2UoKSB7XG4gIGNvbnN0IHN0b3JlVXNlckRhdGEgPSAodXNlckRhdGEpID0+IHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlcnMnLCBKU09OLnN0cmluZ2lmeSh1c2VyRGF0YSkpO1xuICB9O1xuXG4gIGNvbnN0IGdldFVzZXJEYXRhID0gKCkgPT4ge1xuICAgIGNvbnN0IGZhdm9yaXRlVXNlcnMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VycycpKTtcblxuICAgIGlmIChmYXZvcml0ZVVzZXJzID09PSBudWxsKSB7XG4gICAgICBjb25zb2xlLmxvZyhudWxsKTtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICByZXR1cm4gc29ydFVzZXJCeUFscGhhYmV0KGZhdm9yaXRlVXNlcnMpO1xuICB9O1xuXG4gIGNvbnN0IHJlbW92ZVVzZXIgPSAodXNlck5hbWUpID0+IHtcbiAgICBjb25zdCBuZXdVc2VyRGF0YSA9IGdldFVzZXJEYXRhKCkuZmlsdGVyKCh1c2VyKSA9PiB1c2VyLmxvZ2luICE9PSB1c2VyTmFtZSk7XG4gICAgc3RvcmVVc2VyRGF0YShuZXdVc2VyRGF0YSk7XG4gIH07XG5cbiAgY29uc3QgYWRkVXNlciA9ICh1c2VyRGF0YSkgPT4ge1xuICAgIGNvbnN0IG5ld1VzZXJEYXRhID0gWy4uLmdldFVzZXJEYXRhKCksIHVzZXJEYXRhXTtcbiAgICBzdG9yZVVzZXJEYXRhKG5ld1VzZXJEYXRhKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHJlbW92ZVVzZXIsXG4gICAgYWRkVXNlcixcbiAgICBnZXRVc2VyRGF0YSxcbiAgfTtcbn1cblxuY29uc3QgRmF2b3JpdGVzID0gTG9jYWxTdG9yYWdlKCk7XG5cbmV4cG9ydCBkZWZhdWx0IEZhdm9yaXRlcztcbiIsImltcG9ydCBjcmVhdGVGcmFnbWVudCBmcm9tICcuLi9oZWxwZXJzL2NyZXRhdGVGcmFnbWVudCc7XG5pbXBvcnQgRmF2b3JpdGVzIGZyb20gJy4vRmF2b3JpdGUnO1xuXG5mdW5jdGlvbiBhZGRIZWFkZXIoKSB7XG4gIGNvbnN0IHVzZXJMaXN0U2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51c2VybGlzdC1zZWN0aW9uJyk7XG5cbiAgY29uc3QgVUkgPSBjcmVhdGVGcmFnbWVudChgXG4gICAgPGhlYWRlciBjbGFzcz1cInVzZXJsaXN0LXNlY3Rpb25fX2hlYWRlciBjb250YWluZXJcIj5cbiAgICAgIDxoMSBjbGFzcz1cInVzZXJsaXN0LXNlY3Rpb25fX3RpdGxlXCI+R2l0aHViIFN0YXJzPC9oMT5cbiAgICAgIDxidXR0b24gY2xhc3M9XCJsb2dTdG9yYWdlXCI+bG9nIHVzZXJzIGluIGZhdm9yaXRlPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGNsYXNzPVwiY2xlYXJTdG9yYWdlXCI+Y2xlYXIgZmF2b3JpdGUgc3RvcmFnZTwvYnV0dG9uPlxuICAgIDwvaGVhZGVyPlxuICBgKTtcblxuICBVSS5xdWVyeVNlbGVjdG9yKCcubG9nU3RvcmFnZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKEZhdm9yaXRlcy5nZXRVc2VyRGF0YSgpKTtcbiAgfSk7XG4gIFVJLnF1ZXJ5U2VsZWN0b3IoJy5jbGVhclN0b3JhZ2UnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHVzZXJMaXN0U2VjdGlvbi5hcHBlbmRDaGlsZChVSSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFkZEhlYWRlcjtcbiIsImltcG9ydCBjcmVhdGVVc2Vyc1JvdyBmcm9tICcuL2NyZWF0ZVVzZXJzUm93JztcblxubGV0IG5ld0N1cnJlbnRTZWFyY2hSZXN1bHQ7XG5sZXQgbmV3T25GYXZvcml0ZUhhbmRsZXI7XG5cbmZ1bmN0aW9uIGFkZE1haW4oY3VycmVudFNlYXJjaFJlc3VsdCwgb25GYXZvcml0ZUhhbmRsZXIpIHtcbiAgY29uc3QgdXNlckxpc3RTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVzZXJsaXN0LXNlY3Rpb24nKTtcblxuICBjb25zdCB1c2VycyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ21haW4nKTtcbiAgdXNlcnMuY2xhc3NOYW1lID0gJ3VzZXJzJztcblxuICBpZiAoY3VycmVudFNlYXJjaFJlc3VsdCAhPT0gbnVsbCkge1xuICAgIGNvbnN0IHVzZXJHcm91cHMgPSBncm91cEJ5Rmlyc3RMZXR0ZXIoY3VycmVudFNlYXJjaFJlc3VsdCk7XG4gICAgZm9yIChjb25zdCBmaXJzdExldHRlciBpbiB1c2VyR3JvdXBzKSB7XG4gICAgICBjb25zdCB1c2Vyc1JvdyA9IGNyZWF0ZVVzZXJzUm93KFxuICAgICAgICB1c2VyR3JvdXBzW2ZpcnN0TGV0dGVyXSxcbiAgICAgICAgb25GYXZvcml0ZUhhbmRsZXJcbiAgICAgICk7XG4gICAgICB1c2Vycy5hcHBlbmRDaGlsZCh1c2Vyc1Jvdyk7XG4gICAgfVxuICB9XG5cbiAgLy8gREVWRUxPUE1FTlRcbiAgbmV3Q3VycmVudFNlYXJjaFJlc3VsdCA9IGN1cnJlbnRTZWFyY2hSZXN1bHQ7XG4gIG5ld09uRmF2b3JpdGVIYW5kbGVyID0gb25GYXZvcml0ZUhhbmRsZXI7XG5cbiAgcmV0dXJuIHVzZXJMaXN0U2VjdGlvbi5hcHBlbmRDaGlsZCh1c2Vycyk7XG59XG5cbmlmIChtb2R1bGUuaG90KSB7XG4gIG1vZHVsZS5ob3QuYWNjZXB0KCcuL2NyZWF0ZVVzZXIuanMnLCBmdW5jdGlvbiAoKSB7fSk7XG59XG5cbmZ1bmN0aW9uIGdyb3VwQnlGaXJzdExldHRlcihvYmplY3RBcnJheSkge1xuICByZXR1cm4gb2JqZWN0QXJyYXkucmVkdWNlKChhY2MsIG9iaikgPT4ge1xuICAgIC8vIG9iai5uYW1l7J2YIOyyq+uyiOynuCDquIDsnpDqsIAg7YKk66GcIOyhtOyerO2VmOuKlOyngCDtmZXsnbhcbiAgICBjb25zdCBmaXJzdExldHRlciA9IG9iai5sb2dpblswXS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmICghYWNjW2ZpcnN0TGV0dGVyXSkge1xuICAgICAgYWNjW2ZpcnN0TGV0dGVyXSA9IFtdO1xuICAgIH1cblxuICAgIGFjY1tmaXJzdExldHRlcl0ucHVzaChvYmopO1xuICAgIHJldHVybiBhY2M7XG4gIH0sIHt9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYWRkTWFpbjtcbiIsImltcG9ydCBjcmVhdGVTZWFyY2hUYWIgZnJvbSAnLi9jcmVhdGVTZWFyY2hUYWInO1xuaW1wb3J0IGNyZWF0ZVNlYXJjaEJhciBmcm9tICcuL2NyZWF0ZVNlYXJjaEJhcic7XG5cbmxldCBuZXdTZWFyY2hJbnB1dFZhbHVlO1xubGV0IG5ld09uU2VhcmNoQ2hhbmdlSGFuZGxlcjtcbmxldCBuZXdPblNlYXJjaEhhbmRsZXI7XG5sZXQgbmV3VGFiO1xubGV0IG5ld09uVGFiQ2hhbmdlO1xuXG5mdW5jdGlvbiBhZGROYXYoXG4gIHRhYixcbiAgb25UYWJDaGFuZ2UsXG4gIHNlYXJjaElucHV0VmFsdWUsXG4gIG9uU2VhcmNoQ2hhbmdlSGFuZGxlcixcbiAgb25TZWFyY2hIYW5kbGVyXG4pIHtcbiAgY29uc3QgdXNlckxpc3RTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVzZXJsaXN0LXNlY3Rpb24nKTtcblxuICBjb25zdCBuYXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCduYXYnKTtcbiAgbmF2LmNsYXNzTmFtZSA9ICd1c2VybGlzdC1zZWN0aW9uX19uYXYnO1xuXG4gIG5hdi5hcHBlbmRDaGlsZChjcmVhdGVTZWFyY2hUYWIodGFiLCBvblRhYkNoYW5nZSkpO1xuICBuYXYuYXBwZW5kQ2hpbGQoXG4gICAgY3JlYXRlU2VhcmNoQmFyKHNlYXJjaElucHV0VmFsdWUsIG9uU2VhcmNoQ2hhbmdlSGFuZGxlciwgb25TZWFyY2hIYW5kbGVyKVxuICApO1xuXG4gIG5ld1RhYiA9IHRhYjtcbiAgbmV3T25UYWJDaGFuZ2UgPSBvblRhYkNoYW5nZTtcbiAgbmV3U2VhcmNoSW5wdXRWYWx1ZSA9IHNlYXJjaElucHV0VmFsdWU7XG4gIG5ld09uU2VhcmNoQ2hhbmdlSGFuZGxlciA9IG9uU2VhcmNoQ2hhbmdlSGFuZGxlcjtcbiAgbmV3T25TZWFyY2hIYW5kbGVyID0gb25TZWFyY2hIYW5kbGVyO1xuXG4gIHJldHVybiB1c2VyTGlzdFNlY3Rpb24uYXBwZW5kQ2hpbGQobmF2KTtcbn1cblxuaWYgKG1vZHVsZS5ob3QpIHtcbiAgbW9kdWxlLmhvdC5hY2NlcHQoJy4vY3JlYXRlU2VhcmNoVGFiLmpzJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51c2VybGlzdC1zZWN0aW9uX19uYXYnKTtcblxuICAgIGNvbnN0IG9sZFNlYXJjaFRhYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAnLnVzZXJsaXN0LXNlY3Rpb25fX3NlYXJjaC10YWInXG4gICAgKTtcbiAgICBjb25zdCBuZXdTZWFyY2hUYWIgPSBjcmVhdGVTZWFyY2hUYWIobmV3VGFiLCBuZXdPblRhYkNoYW5nZSk7XG5cbiAgICBuYXYucmVwbGFjZUNoaWxkKG5ld1NlYXJjaFRhYiwgb2xkU2VhcmNoVGFiKTtcbiAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG4gIH0pO1xuXG4gIG1vZHVsZS5ob3QuYWNjZXB0KCcuL2NyZWF0ZVNlYXJjaEJhci5qcycsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudXNlcmxpc3Qtc2VjdGlvbl9fbmF2Jyk7XG5cbiAgICBjb25zdCBvbGRTZWFyY2hCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgJy51c2VybGlzdC1zZWN0aW9uX19zZWFyY2gtYmFyJ1xuICAgICk7XG4gICAgY29uc3QgbmV3U2VhcmNoQmFyID0gY3JlYXRlU2VhcmNoQmFyKFxuICAgICAgbmV3U2VhcmNoSW5wdXRWYWx1ZSxcbiAgICAgIG5ld09uU2VhcmNoQ2hhbmdlSGFuZGxlcixcbiAgICAgIG5ld09uU2VhcmNoSGFuZGxlclxuICAgICk7XG5cbiAgICBuYXYucmVwbGFjZUNoaWxkKG5ld1NlYXJjaEJhciwgb2xkU2VhcmNoQmFyKTtcbiAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG4gIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhZGROYXY7XG4iLCJpbXBvcnQgYWRkSGVhZGVyIGZyb20gJy4vYWRkSGVhZGVyJztcbmltcG9ydCBhZGROYXYgZnJvbSAnLi9hZGROYXYnO1xuaW1wb3J0IGFkZE1haW4gZnJvbSAnLi9hZGRNYWluJztcbmltcG9ydCAnLi4vc3R5bGVzL3N0eWxlLmNzcyc7XG5pbXBvcnQgY2xlYXJQYWdlIGZyb20gJy4vY2xlYXJQYWdlJztcbmltcG9ydCBGYXZvcml0ZXMgZnJvbSAnLi9GYXZvcml0ZSc7XG5pbXBvcnQgZ2V0VXNlckxpc3QgZnJvbSAnLi4vaGVscGVycy9nZXRVc2VyTGlzdCc7XG5cbmZ1bmN0aW9uIEFwcCgpIHtcbiAgbGV0IHN0YXRlID0ge1xuICAgIHNlYXJjaElucHV0OiAnJyxcbiAgICBjdXJyZW50VGFiOiAnYXBpJyxcbiAgICBmYXZvcml0ZXM6IEZhdm9yaXRlcy5nZXRVc2VyRGF0YSgpLFxuICAgIHVzZXJTZWFyY2hSZXN1bHRzOiBudWxsLFxuICB9O1xuXG4gIGZ1bmN0aW9uIHNldFN0YXRlKG5ld1N0YXRlLCBzaG91bGRSZW5kZXIgPSB0cnVlKSB7XG4gICAgc3RhdGUgPSB7XG4gICAgICAuLi5uZXdTdGF0ZSxcbiAgICB9O1xuXG4gICAgaWYgKHNob3VsZFJlbmRlcikge1xuICAgICAgY29uc29sZS5sb2coc3RhdGUpO1xuICAgICAgcmV0dXJuIHJlbmRlcihzdGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25TZWFyY2hDaGFuZ2VIYW5kbGVyKGUpIHtcbiAgICBzZXRTdGF0ZShcbiAgICAgIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIHNlYXJjaElucHV0OiBlLnRhcmdldC52YWx1ZSxcbiAgICAgIH0sXG4gICAgICBmYWxzZVxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBvblRhYkNoYW5nZShlKSB7XG4gICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndGFiLWxvY2FsJykpIHtcbiAgICAgIHJldHVybiBzZXRTdGF0ZSh7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBjdXJyZW50VGFiOiAnbG9jYWwnLFxuICAgICAgICB1c2VyU2VhcmNoUmVzdWx0czogbnVsbCxcbiAgICAgICAgc2VhcmNoSW5wdXQ6ICcnLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNldFN0YXRlKHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgY3VycmVudFRhYjogJ2FwaScsXG4gICAgICBzZWFyY2hJbnB1dDogJycsXG4gICAgICB1c2VyU2VhcmNoUmVzdWx0czogbnVsbCxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIG9uU2VhcmNoSGFuZGxlcihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IHsgY3VycmVudFRhYiwgc2VhcmNoSW5wdXQsIGZhdm9yaXRlcyB9ID0gc3RhdGU7XG5cbiAgICBpZiAoc3RhdGUuY3VycmVudFRhYiA9PT0gJ2FwaScpIHtcbiAgICAgIGNvbnN0IHVzZXJUb1NlYXJjaCA9IHNlYXJjaElucHV0O1xuICAgICAgY29uc3QgbmV3VXNlckxpc3QgPSBhd2FpdCBnZXRVc2VyTGlzdCh1c2VyVG9TZWFyY2gsIGZhdm9yaXRlcyk7XG5cbiAgICAgIHJldHVybiBzZXRTdGF0ZSh7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICB1c2VyU2VhcmNoUmVzdWx0czogbmV3VXNlckxpc3QsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudFRhYiA9PT0gJ2xvY2FsJykge1xuICAgICAgY29uc3QgdXNlclRvU2VhcmNoID0gc2VhcmNoSW5wdXQ7XG4gICAgICBjb25zdCBuZXdTZWFyY2hMaXN0ID0gZmF2b3JpdGVzLmZpbHRlcigodXNlcikgPT4ge1xuICAgICAgICBjb25zdCBsb3dlclVzZXJUb1NlYXJjaCA9IHVzZXJUb1NlYXJjaC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBsb3dlclVzZXJOYW1lID0gdXNlci5sb2dpbi50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAobG93ZXJVc2VyTmFtZS5pbmNsdWRlcyhsb3dlclVzZXJUb1NlYXJjaCkpIHtcbiAgICAgICAgICByZXR1cm4gdXNlcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBzZXRTdGF0ZSh7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICB1c2VyU2VhcmNoUmVzdWx0czogbmV3U2VhcmNoTGlzdCxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uRmF2b3JpdGVIYW5kbGVyKHVzZXJJbmZvKSB7XG4gICAgY29uc3QgbmV3U2VhcmNoUmVzdWx0ID0gc3RhdGUudXNlclNlYXJjaFJlc3VsdHMubWFwKCh1c2VyKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBsb2dpbjogdXNlci5sb2dpbixcbiAgICAgICAgYXZhdGFyX3VybDogdXNlci5hdmF0YXJfdXJsLFxuICAgICAgICBpc19mYXZvcml0ZTogdXNlci5pc19mYXZvcml0ZSxcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICBjb25zdCB1c2VyRm91bmQgPSBuZXdTZWFyY2hSZXN1bHQuZmluZCgodXNlcikgPT4ge1xuICAgICAgcmV0dXJuIHVzZXIubG9naW4gPT09IHVzZXJJbmZvLmxvZ2luO1xuICAgIH0pO1xuXG4gICAgaWYgKHVzZXJGb3VuZC5pc19mYXZvcml0ZSkge1xuICAgICAgRmF2b3JpdGVzLnJlbW92ZVVzZXIodXNlckZvdW5kLmxvZ2luKTtcbiAgICAgIHVzZXJGb3VuZC5pc19mYXZvcml0ZSA9ICF1c2VyRm91bmQuaXNfZmF2b3JpdGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXJGb3VuZC5pc19mYXZvcml0ZSA9ICF1c2VyRm91bmQuaXNfZmF2b3JpdGU7XG4gICAgICBGYXZvcml0ZXMuYWRkVXNlcih1c2VyRm91bmQpO1xuICAgIH1cblxuICAgIGlmIChzdGF0ZS5jdXJyZW50VGFiID09PSAnbG9jYWwnKSB7XG4gICAgICBjb25zdCBpbmRleFRvUmVtb3ZlID0gbmV3U2VhcmNoUmVzdWx0LmZpbmRJbmRleCgodXNlcikgPT4ge1xuICAgICAgICByZXR1cm4gdXNlci5sb2dpbiA9PT0gdXNlckZvdW5kLmxvZ2luO1xuICAgICAgfSk7XG4gICAgICBuZXdTZWFyY2hSZXN1bHQuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xuICAgIH1cblxuICAgIHNldFN0YXRlKHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgdXNlclNlYXJjaFJlc3VsdHM6IG5ld1NlYXJjaFJlc3VsdCxcbiAgICAgIGZhdm9yaXRlczogRmF2b3JpdGVzLmdldFVzZXJEYXRhKCksXG4gICAgfSk7XG4gIH1cblxuICBjb25zdCByZW5kZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgeyBjdXJyZW50VGFiLCBzZWFyY2hJbnB1dCwgdXNlclNlYXJjaFJlc3VsdHMgfSA9IHN0YXRlO1xuXG4gICAgY2xlYXJQYWdlKCk7XG4gICAgYWRkSGVhZGVyKCk7XG4gICAgYWRkTmF2KFxuICAgICAgY3VycmVudFRhYixcbiAgICAgIG9uVGFiQ2hhbmdlLFxuICAgICAgc2VhcmNoSW5wdXQsXG4gICAgICBvblNlYXJjaENoYW5nZUhhbmRsZXIsXG4gICAgICBvblNlYXJjaEhhbmRsZXJcbiAgICApO1xuICAgIGFkZE1haW4odXNlclNlYXJjaFJlc3VsdHMsIG9uRmF2b3JpdGVIYW5kbGVyKTtcbiAgfTtcblxuICByZXR1cm4geyByZW5kZXIgfTtcbn1cblxuY29uc3QgbXlBcHAgPSBBcHAoKTtcblxuLy8gaWYgKG1vZHVsZS5ob3QpIHtcbi8vICAgbW9kdWxlLmhvdC5hY2NlcHQoJy4vYWRkSGVhZGVyLmpzJywgZnVuY3Rpb24gKCkge1xuLy8gICAgIGNvbnN0IHVzZXJsaXN0U2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51c2VybGlzdC1zZWN0aW9uJyk7XG4vLyAgICAgY29uc3Qgb2xkSGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVzZXJsaXN0LXNlY3Rpb25fX2hlYWRlcicpO1xuLy8gICAgIGNvbnN0IG5ld0hlYWRlciA9IGFkZEhlYWRlcigpO1xuXG4vLyAgICAgY29uc29sZS5sb2coJ3doYXQnKTtcbi8vICAgICB1c2VybGlzdFNlY3Rpb24ucmVwbGFjZUNoaWxkKG5ld0hlYWRlciwgb2xkSGVhZGVyKTtcbi8vICAgfSk7XG4vLyB9XG5cbmlmIChtb2R1bGUuaG90KSB7XG4gIG1vZHVsZS5ob3QuYWNjZXB0KCcuL2FkZE5hdi5qcycsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZygnQURETkFWOiBjaGFuZ2VkJyk7XG4gICAgY29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbXlBcHA7XG4iLCJmdW5jdGlvbiBjbGVhclBhZ2UoKSB7XG4gIGNvbnN0IHVzZXJMaXN0U2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51c2VybGlzdC1zZWN0aW9uJyk7XG4gIHdoaWxlICh1c2VyTGlzdFNlY3Rpb24uZmlyc3RDaGlsZCkge1xuICAgIHVzZXJMaXN0U2VjdGlvbi5yZW1vdmVDaGlsZCh1c2VyTGlzdFNlY3Rpb24uZmlyc3RDaGlsZCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xlYXJQYWdlO1xuIiwiaW1wb3J0IGNyZWF0ZUZyYWdtZW50IGZyb20gJy4uL2hlbHBlcnMvY3JldGF0ZUZyYWdtZW50JztcblxuZnVuY3Rpb24gY3JlYXRlU2VhcmNoQmFyKFxuICBzZWFyY2hJbnB1dFZhbHVlLFxuICBvblNlYXJjaENoYW5nZUhhbmRsZXIsXG4gIG9uU2VhcmNoSGFuZGxlclxuKSB7XG4gIGNvbnN0IFVJID0gY3JlYXRlRnJhZ21lbnQoYFxuICAgIDxkaXYgY2xhc3M9XCJ1c2VybGlzdC1zZWN0aW9uX19zZWFyY2gtYmFyXCI+XG4gICAgICA8Zm9ybSBjbGFzcz1cImNvbnRhaW5lciByb3cgcm93LWJldHdlZW5cIj5cbiAgICAgICAgPGlucHV0IGNsYXNzPVwidXNlcmxpc3Qtc2VjdGlvbl9fc2VhcmNoLWlucHV0XCIgdHlwZT10ZXh0XCJcbiAgICAgICAgcGxhY2Vob2xkZXI9XCLqsoDsg4nslrTrpbwg7J6F66Cl7ZWY7IS47JqUXCIgcGF0dGVybj1cIl5bYS16QS1aMC05LV0qJFwiIHJlcXVpcmVkPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwidXNlcmxpc3Qtc2VjdGlvbl9fc2VhcmNoLWJ0blwiPlxuICAgICAgICAgIDxzdmcgY2xhc3M9XCJ1c2VybGlzdC1zZWN0aW9uX19zZWFyY2gtaWNvblwiXG4gICAgICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgICAgICAgIGhlaWdodD1cIjQ4cHhcIlxuICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICAgICAgICB3aWR0aD1cIjQ4cHhcIlxuICAgICAgICAgICAgZmlsbD1cIiMwMDAwMDBcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNMCAwaDI0djI0SDBWMHpcIiBmaWxsPVwibm9uZVwiIC8+XG4gICAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgICBkPVwiTTE1LjUgMTRoLS43OWwtLjI4LS4yN0MxNS40MSAxMi41OSAxNiAxMS4xMSAxNiA5LjUgMTYgNS45MSAxMy4wOSAzIDkuNSAzUzMgNS45MSAzIDkuNSA1LjkxIDE2IDkuNSAxNmMxLjYxIDAgMy4wOS0uNTkgNC4yMy0xLjU3bC4yNy4yOHYuNzlsNSA0Ljk5TDIwLjQ5IDE5bC00Ljk5LTV6bS02IDBDNy4wMSAxNCA1IDExLjk5IDUgOS41UzcuMDEgNSA5LjUgNSAxNCA3LjAxIDE0IDkuNSAxMS45OSAxNCA5LjUgMTR6XCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9mb3JtPlxuICAgIDwvZGl2PlxuICBgKTtcblxuICBjb25zdCBzZWFyY2hJbnB1dCA9IFVJLnF1ZXJ5U2VsZWN0b3IoJy51c2VybGlzdC1zZWN0aW9uX19zZWFyY2gtaW5wdXQnKTtcbiAgc2VhcmNoSW5wdXQudmFsdWUgPSBzZWFyY2hJbnB1dFZhbHVlO1xuICBzZWFyY2hJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuICAgIG9uU2VhcmNoQ2hhbmdlSGFuZGxlcihlKTtcbiAgfSk7XG5cbiAgY29uc3Qgc2VhcmNoQnRuID0gVUkucXVlcnlTZWxlY3RvcignLnVzZXJsaXN0LXNlY3Rpb25fX3NlYXJjaC1idG4nKTtcbiAgc2VhcmNoQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBpZiAoc2VhcmNoSW5wdXQudmFsaWRpdHkudmFsdWVNaXNzaW5nKSB7XG4gICAgICByZXR1cm4gc2VhcmNoSW5wdXQuc2V0Q3VzdG9tVmFsaWRpdHkoJ+qwkuydhCDsnoXroKXtlZjsl6wg7KO87IS47JqULicpO1xuICAgIH1cblxuICAgIGlmIChzZWFyY2hJbnB1dC52YWxpZGl0eS5wYXR0ZXJuTWlzbWF0Y2gpIHtcbiAgICAgIHJldHVybiBzZWFyY2hJbnB1dC5zZXRDdXN0b21WYWxpZGl0eShcbiAgICAgICAgJ+q5g+2XiOu4jCDsnKDsoIDripQg7JiB66y4LCDsiKvsnpAsIO2VmOydtO2UiCgtKSDsobDtlansnLzroZwg7J2066Oo7Ja07KC4IOyeiOyKteuLiOuLpC4nXG4gICAgICApO1xuICAgIH1cblxuICAgIG9uU2VhcmNoSGFuZGxlcihlKTtcbiAgfSk7XG5cbiAgcmV0dXJuIFVJO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVTZWFyY2hCYXI7XG4iLCJpbXBvcnQgY3JlYXRlRnJhZ21lbnQgZnJvbSAnLi4vaGVscGVycy9jcmV0YXRlRnJhZ21lbnQnO1xuXG5mdW5jdGlvbiBjcmVhdGVTZWFyY2hUYWIodGFiLCBvblRhYkNoYW5nZSkge1xuICBsZXQgVUk7XG5cbiAgaWYgKHRhYiA9PT0gJ2FwaScpIHtcbiAgICBjb25zdCB0YWJBUEkgPSBgXG4gICAgICA8ZGl2IGNsYXNzPVwidXNlcmxpc3Qtc2VjdGlvbl9fc2VhcmNoLXRhYiByb3dcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInRhYi1hcGkgdGFiIHRhYi0tYWN0aXZlXCI+YXBpPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0YWItbG9jYWwgdGFiXCI+66Gc7LusPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgO1xuXG4gICAgVUkgPSBjcmVhdGVGcmFnbWVudCh0YWJBUEkpO1xuICB9XG5cbiAgaWYgKHRhYiA9PT0gJ2xvY2FsJykge1xuICAgIGNvbnN0IGxvY2FsQVBJID0gYFxuICAgICAgPGRpdiBjbGFzcz1cInVzZXJsaXN0LXNlY3Rpb25fX3NlYXJjaC10YWIgcm93XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0YWItYXBpIHRhYlwiPmFwaTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwidGFiLWxvY2FsIHRhYiB0YWItLWFjdGl2ZVwiPuuhnOy7rDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYDtcblxuICAgIFVJID0gY3JlYXRlRnJhZ21lbnQobG9jYWxBUEkpO1xuICB9XG4gIGNvbnN0IHNlYXJjaFRhYiA9IFVJLnF1ZXJ5U2VsZWN0b3IoJy51c2VybGlzdC1zZWN0aW9uX19zZWFyY2gtdGFiJyk7XG4gIHNlYXJjaFRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uVGFiQ2hhbmdlKTtcblxuICByZXR1cm4gVUk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVNlYXJjaFRhYjtcbiIsImZ1bmN0aW9uIGNyZWF0ZVVzZXIodXNlckluZm8sIG9uRmF2b3JpdGVIYW5kbGVyKSB7XG4gIGNvbnN0IHsgYXZhdGFyX3VybCwgbG9naW4sIGlzX2Zhdm9yaXRlIH0gPSB1c2VySW5mbztcbiAgY29uc3QgdXNlclVJID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoYFxuICAgIDxkaXYgY2xhc3M9XCJ1c2VyIHJvd1wiPlxuICAgICAgPGltZyBjbGFzcz1cInVzZXJfX2ltZ1wiIHNyYz1cIiR7YXZhdGFyX3VybH1cIiAvPlxuICAgICAgPHNwYW4gY2xhc3M9XCJ1c2VyX19uYW1lXCI+JHtsb2dpbn08L3NwYW4+XG4gICAgICA8YnV0dG9uIGNsYXNzPVwidXNlcl9fZmF2b3JpdGVcIj5cbiAgICAgICAgJHtpc19mYXZvcml0ZSA/IHN0YXJJY29uQWN0aXZlIDogc3Rhckljb259XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgYCk7XG5cbiAgdXNlclVJIC8vXG4gICAgLnF1ZXJ5U2VsZWN0b3IoJy51c2VyJylcbiAgICAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBvbkZhdm9yaXRlSGFuZGxlcih1c2VySW5mbykpO1xuXG4gIHJldHVybiB1c2VyVUk7XG59XG5cbmNvbnN0IHN0YXJJY29uID0gYFxuICA8c3ZnXG4gICAgY2xhc3M9XCJzdGFyLWljb25cIlxuICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgIGVuYWJsZS1iYWNrZ3JvdW5kPVwibmV3IDAgMCAyNCAyNFwiXG4gICAgaGVpZ2h0PVwiMjRweFwiXG4gICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgd2lkdGg9XCIyNHB4XCJcbiAgICBmaWxsPVwiIzAwMDAwMFwiXG4gID5cbiAgICA8Zz5cbiAgICAgIDxwYXRoIGQ9XCJNMCwwaDI0djI0SDBWMHpcIiBmaWxsPVwibm9uZVwiIC8+XG4gICAgICA8cGF0aCBkPVwiTTAsMGgyNHYyNEgwVjB6XCIgZmlsbD1cIm5vbmVcIiAvPlxuICAgIDwvZz5cbiAgICA8Zz5cbiAgICAgIDxwYXRoIGQ9XCJNMTIsMTcuMjdMMTguMTgsMjFsLTEuNjQtNy4wM0wyMiw5LjI0bC03LjE5LTAuNjFMMTIsMkw5LjE5LDguNjNMMiw5LjI0bDUuNDYsNC43M0w1LjgyLDIxTDEyLDE3LjI3elwiIC8+XG4gICAgPC9nPlxuICA8L3N2Zz5cbmA7XG5cbmNvbnN0IHN0YXJJY29uQWN0aXZlID0gYFxuICAgIDxzdmdcbiAgICAgIGNsYXNzPVwic3Rhci1pY29uIHN0YXItaWNvbi0tYWN0aXZlXCJcbiAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgZW5hYmxlLWJhY2tncm91bmQ9XCJuZXcgMCAwIDI0IDI0XCJcbiAgICAgIGhlaWdodD1cIjI0cHhcIlxuICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICB3aWR0aD1cIjI0cHhcIlxuICAgICAgZmlsbD1cIiMwMDAwMDBcIlxuICAgID5cbiAgICAgIDxnPlxuICAgICAgICA8cGF0aCBkPVwiTTAsMGgyNHYyNEgwVjB6XCIgZmlsbD1cIm5vbmVcIiAvPlxuICAgICAgICA8cGF0aCBkPVwiTTAsMGgyNHYyNEgwVjB6XCIgZmlsbD1cIm5vbmVcIiAvPlxuICAgICAgPC9nPlxuICAgICAgPGc+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTIsMTcuMjdMMTguMTgsMjFsLTEuNjQtNy4wM0wyMiw5LjI0bC03LjE5LTAuNjFMMTIsMkw5LjE5LDguNjNMMiw5LjI0bDUuNDYsNC43M0w1LjgyLDIxTDEyLDE3LjI3elwiIC8+XG4gICAgICA8L2c+XG4gICAgPC9zdmc+XG4gIGA7XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVVzZXI7XG4iLCJpbXBvcnQgY3JlYXRlVXNlciBmcm9tICcuL2NyZWF0ZVVzZXInO1xuXG5mdW5jdGlvbiBjcmVhdGVVc2Vyc1Jvdyh1c2VyR3JvdXAsIG9uRmF2b3JpdGVIYW5kbGVyKSB7XG4gIGNvbnN0IHVzZXJzUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHVzZXJzUm93LmNsYXNzTmFtZSA9ICd1c2Vyc19fcm93JztcblxuICBjb25zdCB1c2Vyc1Jvd1RpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICB1c2Vyc1Jvd1RpdGxlLmNsYXNzTmFtZSA9ICd1c2Vyc19fcm93LXRpdGxlJztcbiAgdXNlcnNSb3dUaXRsZS50ZXh0Q29udGVudCA9IHVzZXJHcm91cFswXS5sb2dpblswXS50b0xvd2VyQ2FzZSgpO1xuXG4gIHVzZXJzUm93LmFwcGVuZENoaWxkKHVzZXJzUm93VGl0bGUpO1xuXG4gIHVzZXJHcm91cC5mb3JFYWNoKCh1c2VySW5mbykgPT4ge1xuICAgIGNvbnN0IHVzZXJVSSA9IGNyZWF0ZVVzZXIodXNlckluZm8sIG9uRmF2b3JpdGVIYW5kbGVyKTtcbiAgICB1c2Vyc1Jvdy5hcHBlbmRDaGlsZCh1c2VyVUkpO1xuICB9KTtcblxuICByZXR1cm4gdXNlcnNSb3c7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVVzZXJzUm93O1xuIiwiZnVuY3Rpb24gY3JlYXRlRnJhZ21lbnQoZWxlbWVudEhUTUwpIHtcbiAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KGVsZW1lbnRIVE1MKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRnJhZ21lbnQ7XG4iLCJpbXBvcnQgeyBPY3Rva2l0IH0gZnJvbSAnQG9jdG9raXQvY29yZSc7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQgc29ydFVzZXJCeUFscGhhYmV0IGZyb20gJy4vc29ydFVzZXJCeUFscGhhYmV0JztcblxuY29uc3Qgb2N0b2tpdCA9IG5ldyBPY3Rva2l0KHtcbiAgLy8gYXV0aDogY29uZmlnLmdpdGh1YlRva2VuLFxuICBhdXRoOiAnZ2hwX3VZTTlsbDdVelFYQ1k2MDVQaFFoVDZIWG1UTnhNMTRCSFBEUicsXG59KTtcblxuYXN5bmMgZnVuY3Rpb24gZ2V0VXNlckxpc3QobmFtZSwgZmF2b3JpdGVzKSB7XG4gIGNvbnN0IHNlYXJjaFJlc3BvbnNlID0gYXdhaXQgb2N0b2tpdC5yZXF1ZXN0KCdHRVQgL3NlYXJjaC91c2VycycsIHtcbiAgICBxOiBgJHtuYW1lfSBpbjpsb2dpbiB0eXBlOnVzZXJgLFxuICAgIHBlcl9wYWdlOiAxMDAsXG4gICAgcGFnZTogMSxcbiAgfSk7XG5cbiAgY29uc3QgdXNlckxpc3QgPSBtYWtlTmV3VXNlckxpc3Qoc2VhcmNoUmVzcG9uc2UsIGZhdm9yaXRlcyk7XG5cbiAgcmV0dXJuIHNvcnRVc2VyQnlBbHBoYWJldCh1c2VyTGlzdCk7XG59XG5cbmZ1bmN0aW9uIG1ha2VOZXdVc2VyTGlzdChyZXNwb25zZSwgZmF2b3JpdGVzKSB7XG4gIGNvbnN0IHVzZXJMaXN0ID0gcmVzcG9uc2UuZGF0YS5pdGVtcztcblxuICBjb25zdCBuZXdVc2VyTGlzdCA9IHVzZXJMaXN0Lm1hcCgodXNlckluZm8pID0+IHtcbiAgICBjb25zdCB7IGxvZ2luLCBhdmF0YXJfdXJsIH0gPSB1c2VySW5mbztcbiAgICBjb25zdCBpc19mYXZvcml0ZSA9IGRvZXNFeGlzdEluRmF2b3JpdGVzKGxvZ2luLCBmYXZvcml0ZXMpO1xuXG4gICAgcmV0dXJuIHsgbG9naW4sIGF2YXRhcl91cmwsIGlzX2Zhdm9yaXRlIH07XG4gIH0pO1xuXG4gIHJldHVybiBuZXdVc2VyTGlzdDtcbn1cblxuZnVuY3Rpb24gZG9lc0V4aXN0SW5GYXZvcml0ZXModXNlck5hbWUsIGZhdm9yaXRlcykge1xuICBpZiAoZmF2b3JpdGVzID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgcmVzdWx0ID0gZmF2b3JpdGVzLmZpbmQoKHVzZXJJbmZvKSA9PiB1c2VySW5mby5sb2dpbiA9PT0gdXNlck5hbWUpO1xuXG4gIHJldHVybiByZXN1bHQgPyB0cnVlIDogZmFsc2U7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFVzZXJMaXN0O1xuIiwiZnVuY3Rpb24gc29ydFVzZXJCeUFscGhhYmV0KHVzZXJMaXN0KSB7XG4gIGlmICh1c2VyTGlzdCA9PT0gbnVsbCkge1xuICAgIHJldHVybiB1c2VyTGlzdDtcbiAgfVxuXG4gIGNvbnN0IG5ld1VzZXJMaXN0ID0gWy4uLnVzZXJMaXN0XTtcbiAgbmV3VXNlckxpc3Quc29ydCgoYSwgYikgPT4ge1xuICAgIHJldHVybiBhLmxvZ2luLmxvY2FsZUNvbXBhcmUoYi5sb2dpbik7XG4gIH0pO1xuXG4gIHJldHVybiBuZXdVc2VyTGlzdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc29ydFVzZXJCeUFscGhhYmV0O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBteUFwcCBmcm9tICcuL2NvbXBvbmVudHMvYXBwJztcblxubXlBcHAucmVuZGVyKCk7XG4iXSwic291cmNlUm9vdCI6IiJ9