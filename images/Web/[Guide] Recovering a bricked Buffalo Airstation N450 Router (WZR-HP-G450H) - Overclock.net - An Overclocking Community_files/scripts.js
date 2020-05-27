/*
yahoo-dom-event.js
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
-------------------------------------------------------*/
if (typeof YAHOO == "undefined" || !YAHOO) {
    var YAHOO = {};
}
YAHOO.namespace = function () {
    var A = arguments,
        E = null,
        C, B, D;
    for (C = 0; C < A.length; C = C + 1) {
        D = ("" + A[C]).split(".");
        E = YAHOO;
        for (B = (D[0] == "YAHOO") ? 1 : 0; B < D.length; B = B + 1) {
            E[D[B]] = E[D[B]] || {};
            E = E[D[B]];
        }
    }
    return E;
};
YAHOO.log = function (D, A, C) {
    var B = YAHOO.widget.Logger;
    if (B && B.log) {
        return B.log(D, A, C);
    } else {
        return false;
    }
};
YAHOO.register = function (A, E, D) {
    var I = YAHOO.env.modules,
        B, H, G, F, C;
    if (!I[A]) {
        I[A] = {
            versions: [],
            builds: []
        };
    }
    B = I[A];
    H = D.version;
    G = D.build;
    F = YAHOO.env.listeners;
    B.name = A;
    B.version = H;
    B.build = G;
    B.versions.push(H);
    B.builds.push(G);
    B.mainClass = E;
    for (C = 0; C < F.length; C = C + 1) {
        F[C](B);
    }
    if (E) {
        E.VERSION = H;
        E.BUILD = G;
    } else {
        YAHOO.log("mainClass is undefined for module " + A, "warn");
    }
};
YAHOO.env = YAHOO.env || {
    modules: [],
    listeners: []
};
YAHOO.env.getVersion = function (A) {
    return YAHOO.env.modules[A] || null;
};
YAHOO.env.ua = function () {
    var C = {
        ie: 0,
        opera: 0,
        gecko: 0,
        webkit: 0,
        mobile: null,
        air: 0,
        caja: 0
    }, B = navigator.userAgent,
        A;
    if ((/KHTML/).test(B)) {
        C.webkit = 1;
    }
    A = B.match(/AppleWebKit\/([^\s]*)/);
    if (A && A[1]) {
        C.webkit = parseFloat(A[1]);
        if (/ Mobile\//.test(B)) {
            C.mobile = "Apple";
        } else {
            A = B.match(/NokiaN[^\/]*/);
            if (A) {
                C.mobile = A[0];
            }
        }
        A = B.match(/AdobeAIR\/([^\s]*)/);
        if (A) {
            C.air = A[0];
        }
    }
    if (!C.webkit) {
        A = B.match(/Opera[\s\/]([^\s]*)/);
        if (A && A[1]) {
            C.opera = parseFloat(A[1]);
            A = B.match(/Opera Mini[^;]*/);
            if (A) {
                C.mobile = A[0];
            }
        } else {
            A = B.match(/MSIE\s([^;]*)/);
            if (A && A[1]) {
                C.ie = parseFloat(A[1]);
            } else {
                A = B.match(/Gecko\/([^\s]*)/);
                if (A) {
                    C.gecko = 1;
                    A = B.match(/rv:([^\s\)]*)/);
                    if (A && A[1]) {
                        C.gecko = parseFloat(A[1]);
                    }
                }
            }
        }
    }
    A = B.match(/Caja\/([^\s]*)/);
    if (A && A[1]) {
        C.caja = parseFloat(A[1]);
    }
    return C;
}();
(function () {
    YAHOO.namespace("util", "widget", "example");
    if ("undefined" !== typeof YAHOO_config) {
        var B = YAHOO_config.listener,
            A = YAHOO.env.listeners,
            D = true,
            C;
        if (B) {
            for (C = 0; C < A.length; C = C + 1) {
                if (A[C] == B) {
                    D = false;
                    break;
                }
            }
            if (D) {
                A.push(B);
            }
        }
    }
})();
YAHOO.lang = YAHOO.lang || {};
(function () {
    var B = YAHOO.lang,
        F = "[object Array]",
        C = "[object Function]",
        A = Object.prototype,
        E = ["toString", "valueOf"],
        D = {
            isArray: function (G) {
                return A.toString.apply(G) === F;
            },
            isBoolean: function (G) {
                return typeof G === "boolean";
            },
            isFunction: function (G) {
                return A.toString.apply(G) === C;
            },
            isNull: function (G) {
                return G === null;
            },
            isNumber: function (G) {
                return typeof G === "number" && isFinite(G);
            },
            isObject: function (G) {
                return (G && (typeof G === "object" || B.isFunction(G))) || false;
            },
            isString: function (G) {
                return typeof G === "string";
            },
            isUndefined: function (G) {
                return typeof G === "undefined";
            },
            _IEEnumFix: (YAHOO.env.ua.ie) ? function (I, H) {
                var G, K, J;
                for (G = 0; G < E.length; G = G + 1) {
                    K = E[G];
                    J = H[K];
                    if (B.isFunction(J) && J != A[K]) {
                        I[K] = J;
                    }
                }
            } : function () {},
            extend: function (J, K, I) {
                if (!K || !J) {
                    throw new Error("extend failed, please check that " + "all dependencies are included.");
                }
                var H = function () {}, G;
                H.prototype = K.prototype;
                J.prototype = new H();
                J.prototype.constructor = J;
                J.superclass = K.prototype;
                if (K.prototype.constructor == A.constructor) {
                    K.prototype.constructor = K;
                }
                if (I) {
                    for (G in I) {
                        if (B.hasOwnProperty(I, G)) {
                            J.prototype[G] = I[G];
                        }
                    }
                    B._IEEnumFix(J.prototype, I);
                }
            },
            augmentObject: function (K, J) {
                if (!J || !K) {
                    throw new Error("Absorb failed, verify dependencies.");
                }
                var G = arguments,
                    I, L, H = G[2];
                if (H && H !== true) {
                    for (I = 2; I < G.length; I = I + 1) {
                        K[G[I]] = J[G[I]];
                    }
                } else {
                    for (L in J) {
                        if (H || !(L in K)) {
                            K[L] = J[L];
                        }
                    }
                    B._IEEnumFix(K, J);
                }
            },
            augmentProto: function (J, I) {
                if (!I || !J) {
                    throw new Error("Augment failed, verify dependencies.");
                }
                var G = [J.prototype, I.prototype],
                    H;
                for (H = 2; H < arguments.length; H = H + 1) {
                    G.push(arguments[H]);
                }
                B.augmentObject.apply(this, G);
            },
            dump: function (G, L) {
                var I, K, N = [],
                    O = "{...}",
                    H = "f(){...}",
                    M = ", ",
                    J = " => ";
                if (!B.isObject(G)) {
                    return G + "";
                } else {
                    if (G instanceof Date || ("nodeType" in G && "tagName" in G)) {
                        return G;
                    } else {
                        if (B.isFunction(G)) {
                            return H;
                        }
                    }
                }
                L = (B.isNumber(L)) ? L : 3;
                if (B.isArray(G)) {
                    N.push("[");
                    for (I = 0, K = G.length; I < K; I = I + 1) {
                        if (B.isObject(G[I])) {
                            N.push((L > 0) ? B.dump(G[I], L - 1) : O);
                        } else {
                            N.push(G[I]);
                        }
                        N.push(M);
                    }
                    if (N.length > 1) {
                        N.pop();
                    }
                    N.push("]");
                } else {
                    N.push("{");
                    for (I in G) {
                        if (B.hasOwnProperty(G, I)) {
                            N.push(I + J);
                            if (B.isObject(G[I])) {
                                N.push((L > 0) ? B.dump(G[I], L - 1) : O);
                            } else {
                                N.push(G[I]);
                            }
                            N.push(M);
                        }
                    }
                    if (N.length > 1) {
                        N.pop();
                    }
                    N.push("}");
                }
                return N.join("");
            },
            substitute: function (V, H, O) {
                var L, K, J, R, S, U, Q = [],
                    I, M = "dump",
                    P = " ",
                    G = "{",
                    T = "}",
                    N;
                for (;;) {
                    L = V.lastIndexOf(G);
                    if (L < 0) {
                        break;
                    }
                    K = V.indexOf(T, L);
                    if (L + 1 >= K) {
                        break;
                    }
                    I = V.substring(L + 1, K);
                    R = I;
                    U = null;
                    J = R.indexOf(P);
                    if (J > -1) {
                        U = R.substring(J + 1);
                        R = R.substring(0, J);
                    }
                    S = H[R];
                    if (O) {
                        S = O(R, S, U);
                    }
                    if (B.isObject(S)) {
                        if (B.isArray(S)) {
                            S = B.dump(S, parseInt(U, 10));
                        } else {
                            U = U || "";
                            N = U.indexOf(M);
                            if (N > -1) {
                                U = U.substring(4);
                            }
                            if (S.toString === A.toString || N > -1) {
                                S = B.dump(S, parseInt(U, 10));
                            } else {
                                S = S.toString();
                            }
                        }
                    } else {
                        if (!B.isString(S) && !B.isNumber(S)) {
                            S = "~-" + Q.length + "-~";
                            Q[Q.length] = I;
                        }
                    }
                    V = V.substring(0, L) + S + V.substring(K + 1);
                }
                for (L = Q.length - 1; L >= 0; L = L - 1) {
                    V = V.replace(new RegExp("~-" + L + "-~"), "{" + Q[L] + "}", "g");
                }
                return V;
            },
            trim: function (G) {
                try {
                    return G.replace(/^\s+|\s+$/g, "");
                } catch (H) {
                    return G;
                }
            },
            merge: function () {
                var J = {}, H = arguments,
                    G = H.length,
                    I;
                for (I = 0; I < G; I = I + 1) {
                    B.augmentObject(J, H[I], true);
                }
                return J;
            },
            later: function (N, H, O, J, K) {
                N = N || 0;
                H = H || {};
                var I = O,
                    M = J,
                    L, G;
                if (B.isString(O)) {
                    I = H[O];
                }
                if (!I) {
                    throw new TypeError("method undefined");
                }
                if (!B.isArray(M)) {
                    M = [J];
                }
                L = function () {
                    I.apply(H, M);
                };
                G = (K) ? setInterval(L, N) : setTimeout(L, N);
                return {
                    interval: K,
                    cancel: function () {
                        if (this.interval) {
                            clearInterval(G);
                        } else {
                            clearTimeout(G);
                        }
                    }
                };
            },
            isValue: function (G) {
                return (B.isObject(G) || B.isString(G) || B.isNumber(G) || B.isBoolean(G));
            }
        };
    B.hasOwnProperty = (A.hasOwnProperty) ? function (G, H) {
        return G && G.hasOwnProperty(H);
    } : function (G, H) {
        return !B.isUndefined(G[H]) && G.constructor.prototype[H] !== G[H];
    };
    D.augmentObject(B, D, true);
    YAHOO.util.Lang = B;
    B.augment = B.augmentProto;
    YAHOO.augment = B.augmentProto;
    YAHOO.extend = B.extend;
})();
YAHOO.register("yahoo", YAHOO, {
    version: "2.7.0",
    build: "1796"
});
(function () {
    YAHOO.env._id_counter = YAHOO.env._id_counter || 0;
    var E = YAHOO.util,
        L = YAHOO.lang,
        m = YAHOO.env.ua,
        A = YAHOO.lang.trim,
        d = {}, h = {}, N = /^t(?:able|d|h)$/i,
        X = /color$/i,
        K = window.document,
        W = K.documentElement,
        e = "ownerDocument",
        n = "defaultView",
        v = "documentElement",
        t = "compatMode",
        b = "offsetLeft",
        P = "offsetTop",
        u = "offsetParent",
        Z = "parentNode",
        l = "nodeType",
        C = "tagName",
        O = "scrollLeft",
        i = "scrollTop",
        Q = "getBoundingClientRect",
        w = "getComputedStyle",
        a = "currentStyle",
        M = "CSS1Compat",
        c = "BackCompat",
        g = "class",
        F = "className",
        J = "",
        B = " ",
        s = "(?:^|\\s)",
        k = "(?= |$)",
        U = "g",
        p = "position",
        f = "fixed",
        V = "relative",
        j = "left",
        o = "top",
        r = "medium",
        q = "borderLeftWidth",
        R = "borderTopWidth",
        D = m.opera,
        I = m.webkit,
        H = m.gecko,
        T = m.ie;
    E.Dom = {
        CUSTOM_ATTRIBUTES: (!W.hasAttribute) ? {
            "for": "htmlFor",
            "class": F
        } : {
            "htmlFor": "for",
            "className": g
        },
        get: function (y) {
            var AA, Y, z, x, G;
            if (y) {
                if (y[l] || y.item) {
                    return y;
                }
                if (typeof y === "string") {
                    AA = y;
                    y = K.getElementById(y);
                    if (y && y.id === AA) {
                        return y;
                    } else {
                        if (y && K.all) {
                            y = null;
                            Y = K.all[AA];
                            for (x = 0, G = Y.length; x < G; ++x) {
                                if (Y[x].id === AA) {
                                    return Y[x];
                                }
                            }
                        }
                    }
                    return y;
                }
                if (y.DOM_EVENTS) {
                    y = y.get("element");
                }
                if ("length" in y) {
                    z = [];
                    for (x = 0, G = y.length; x < G; ++x) {
                        z[z.length] = E.Dom.get(y[x]);
                    }
                    return z;
                }
                return y;
            }
            return null;
        },
        getComputedStyle: function (G, Y) {
            if (window[w]) {
                return G[e][n][w](G, null)[Y];
            } else {
                if (G[a]) {
                    return E.Dom.IE_ComputedStyle.get(G, Y);
                }
            }
        },
        getStyle: function (G, Y) {
            return E.Dom.batch(G, E.Dom._getStyle, Y);
        },
        _getStyle: function () {
            if (window[w]) {
                return function (G, y) {
                    y = (y === "float") ? y = "cssFloat" : E.Dom._toCamel(y);
                    var x = G.style[y],
                        Y;
                    if (!x) {
                        Y = G[e][n][w](G, null);
                        if (Y) {
                            x = Y[y];
                        }
                    }
                    return x;
                };
            } else {
                if (W[a]) {
                    return function (G, y) {
                        var x;
                        switch (y) {
                        case "opacity":
                            x = 100;
                            try {
                                x = G.filters["DXImageTransform.Microsoft.Alpha"].opacity;
                            } catch (z) {
                                try {
                                    x = G.filters("alpha").opacity;
                                } catch (Y) {}
                            }
                            return x / 100;
                        case "float":
                            y = "styleFloat";
                        default:
                            y = E.Dom._toCamel(y);
                            x = G[a] ? G[a][y] : null;
                            return (G.style[y] || x);
                        }
                    };
                }
            }
        }(),
        setStyle: function (G, Y, x) {
            E.Dom.batch(G, E.Dom._setStyle, {
                prop: Y,
                val: x
            });
        },
        _setStyle: function () {
            if (T) {
                return function (Y, G) {
                    var x = E.Dom._toCamel(G.prop),
                        y = G.val;
                    if (Y) {
                        switch (x) {
                        case "opacity":
                            if (L.isString(Y.style.filter)) {
                                Y.style.filter = "alpha(opacity=" + y * 100 + ")";
                                if (!Y[a] || !Y[a].hasLayout) {
                                    Y.style.zoom = 1;
                                }
                            }
                            break;
                        case "float":
                            x = "styleFloat";
                        default:
                            Y.style[x] = y;
                        }
                    } else {}
                };
            } else {
                return function (Y, G) {
                    var x = E.Dom._toCamel(G.prop),
                        y = G.val;
                    if (Y) {
                        if (x == "float") {
                            x = "cssFloat";
                        }
                        Y.style[x] = y;
                    } else {}
                };
            }
        }(),
        getXY: function (G) {
            return E.Dom.batch(G, E.Dom._getXY);
        },
        _canPosition: function (G) {
            return (E.Dom._getStyle(G, "display") !== "none" && E.Dom._inDoc(G));
        },
        _getXY: function () {
            if (K[v][Q]) {
                return function (y) {
                    var z, Y, AA, AF, AE, AD, AC, G, x, AB = Math.floor,
                        AG = false;
                    if (E.Dom._canPosition(y)) {
                        AA = y[Q]();
                        AF = y[e];
                        z = E.Dom.getDocumentScrollLeft(AF);
                        Y = E.Dom.getDocumentScrollTop(AF);
                        AG = [AB(AA[j]), AB(AA[o])];
                        if (T && m.ie < 8) {
                            AE = 2;
                            AD = 2;
                            AC = AF[t];
                            G = S(AF[v], q);
                            x = S(AF[v], R);
                            if (m.ie === 6) {
                                if (AC !== c) {
                                    AE = 0;
                                    AD = 0;
                                }
                            }
                            if ((AC == c)) {
                                if (G !== r) {
                                    AE = parseInt(G, 10);
                                }
                                if (x !== r) {
                                    AD = parseInt(x, 10);
                                }
                            }
                            AG[0] -= AE;
                            AG[1] -= AD;
                        }
                        if ((Y || z)) {
                            AG[0] += z;
                            AG[1] += Y;
                        }
                        AG[0] = AB(AG[0]);
                        AG[1] = AB(AG[1]);
                    } else {}
                    return AG;
                };
            } else {
                return function (y) {
                    var x, Y, AA, AB, AC, z = false,
                        G = y;
                    if (E.Dom._canPosition(y)) {
                        z = [y[b], y[P]];
                        x = E.Dom.getDocumentScrollLeft(y[e]);
                        Y = E.Dom.getDocumentScrollTop(y[e]);
                        AC = ((H || m.webkit > 519) ? true : false);
                        while ((G = G[u])) {
                            z[0] += G[b];
                            z[1] += G[P];
                            if (AC) {
                                z = E.Dom._calcBorders(G, z);
                            }
                        }
                        if (E.Dom._getStyle(y, p) !== f) {
                            G = y;
                            while ((G = G[Z]) && G[C]) {
                                AA = G[i];
                                AB = G[O];
                                if (H && (E.Dom._getStyle(G, "overflow") !== "visible")) {
                                    z = E.Dom._calcBorders(G, z);
                                }
                                if (AA || AB) {
                                    z[0] -= AB;
                                    z[1] -= AA;
                                }
                            }
                            z[0] += x;
                            z[1] += Y;
                        } else {
                            if (D) {
                                z[0] -= x;
                                z[1] -= Y;
                            } else {
                                if (I || H) {
                                    z[0] += x;
                                    z[1] += Y;
                                }
                            }
                        }
                        z[0] = Math.floor(z[0]);
                        z[1] = Math.floor(z[1]);
                    } else {}
                    return z;
                };
            }
        }(),
        getX: function (G) {
            var Y = function (x) {
                return E.Dom.getXY(x)[0];
            };
            return E.Dom.batch(G, Y, E.Dom, true);
        },
        getY: function (G) {
            var Y = function (x) {
                return E.Dom.getXY(x)[1];
            };
            return E.Dom.batch(G, Y, E.Dom, true);
        },
        setXY: function (G, x, Y) {
            E.Dom.batch(G, E.Dom._setXY, {
                pos: x,
                noRetry: Y
            });
        },
        _setXY: function (G, z) {
            var AA = E.Dom._getStyle(G, p),
                y = E.Dom.setStyle,
                AD = z.pos,
                Y = z.noRetry,
                AB = [parseInt(E.Dom.getComputedStyle(G, j), 10), parseInt(E.Dom.getComputedStyle(G, o), 10)],
                AC, x;
            if (AA == "static") {
                AA = V;
                y(G, p, AA);
            }
            AC = E.Dom._getXY(G);
            if (!AD || AC === false) {
                return false;
            }
            if (isNaN(AB[0])) {
                AB[0] = (AA == V) ? 0 : G[b];
            }
            if (isNaN(AB[1])) {
                AB[1] = (AA == V) ? 0 : G[P];
            }
            if (AD[0] !== null) {
                y(G, j, AD[0] - AC[0] + AB[0] + "px");
            }
            if (AD[1] !== null) {
                y(G, o, AD[1] - AC[1] + AB[1] + "px");
            }
            if (!Y) {
                x = E.Dom._getXY(G);
                if ((AD[0] !== null && x[0] != AD[0]) || (AD[1] !== null && x[1] != AD[1])) {
                    E.Dom._setXY(G, {
                        pos: AD,
                        noRetry: true
                    });
                }
            }
        },
        setX: function (Y, G) {
            E.Dom.setXY(Y, [G, null]);
        },
        setY: function (G, Y) {
            E.Dom.setXY(G, [null, Y]);
        },
        getRegion: function (G) {
            var Y = function (x) {
                var y = false;
                if (E.Dom._canPosition(x)) {
                    y = E.Region.getRegion(x);
                } else {}
                return y;
            };
            return E.Dom.batch(G, Y, E.Dom, true);
        },
        getClientWidth: function () {
            return E.Dom.getViewportWidth();
        },
        getClientHeight: function () {
            return E.Dom.getViewportHeight();
        },
        getElementsByClassName: function (AB, AF, AC, AE, x, AD) {
            AB = L.trim(AB);
            AF = AF || "*";
            AC = (AC) ? E.Dom.get(AC) : null || K;
            if (!AC) {
                return [];
            }
            var Y = [],
                G = AC.getElementsByTagName(AF),
                z = E.Dom.hasClass;
            for (var y = 0, AA = G.length; y < AA; ++y) {
                if (z(G[y], AB)) {
                    Y[Y.length] = G[y];
                }
            }
            if (AE) {
                E.Dom.batch(Y, AE, x, AD);
            }
            return Y;
        },
        hasClass: function (Y, G) {
            return E.Dom.batch(Y, E.Dom._hasClass, G);
        },
        _hasClass: function (x, Y) {
            var G = false,
                y;
            if (x && Y) {
                y = E.Dom.getAttribute(x, F) || J;
                if (Y.exec) {
                    G = Y.test(y);
                } else {
                    G = Y && (B + y + B).indexOf(B + Y + B) > -1;
                }
            } else {}
            return G;
        },
        addClass: function (Y, G) {
            return E.Dom.batch(Y, E.Dom._addClass, G);
        },
        _addClass: function (x, Y) {
            var G = false,
                y;
            if (x && Y) {
                y = E.Dom.getAttribute(x, F) || J;
                if (!E.Dom._hasClass(x, Y)) {
                    E.Dom.setAttribute(x, F, A(y + B + Y));
                    G = true;
                }
            } else {}
            return G;
        },
        removeClass: function (Y, G) {
            return E.Dom.batch(Y, E.Dom._removeClass, G);
        },
        _removeClass: function (y, x) {
            var Y = false,
                AA, z, G;
            if (y && x) {
                AA = E.Dom.getAttribute(y, F) || J;
                E.Dom.setAttribute(y, F, AA.replace(E.Dom._getClassRegex(x), J));
                z = E.Dom.getAttribute(y, F);
                if (AA !== z) {
                    E.Dom.setAttribute(y, F, A(z));
                    Y = true;
                    if (E.Dom.getAttribute(y, F) === "") {
                        G = (y.hasAttribute && y.hasAttribute(g)) ? g : F;
                        y.removeAttribute(G);
                    }
                }
            } else {}
            return Y;
        },
        replaceClass: function (x, Y, G) {
            return E.Dom.batch(x, E.Dom._replaceClass, {
                from: Y,
                to: G
            });
        },
        _replaceClass: function (y, x) {
            var Y, AB, AA, G = false,
                z;
            if (y && x) {
                AB = x.from;
                AA = x.to;
                if (!AA) {
                    G = false;
                } else {
                    if (!AB) {
                        G = E.Dom._addClass(y, x.to);
                    } else {
                        if (AB !== AA) {
                            z = E.Dom.getAttribute(y, F) || J;
                            Y = (B + z.replace(E.Dom._getClassRegex(AB), B + AA)).split(E.Dom._getClassRegex(AA));
                            Y.splice(1, 0, B + AA);
                            E.Dom.setAttribute(y, F, A(Y.join(J)));
                            G = true;
                        }
                    }
                }
            } else {}
            return G;
        },
        generateId: function (G, x) {
            x = x || "yui-gen";
            var Y = function (y) {
                if (y && y.id) {
                    return y.id;
                }
                var z = x + YAHOO.env._id_counter++;
                if (y) {
                    if (y[e].getElementById(z)) {
                        return E.Dom.generateId(y, z + x);
                    }
                    y.id = z;
                }
                return z;
            };
            return E.Dom.batch(G, Y, E.Dom, true) || Y.apply(E.Dom, arguments);
        },
        isAncestor: function (Y, x) {
            Y = E.Dom.get(Y);
            x = E.Dom.get(x);
            var G = false;
            if ((Y && x) && (Y[l] && x[l])) {
                if (Y.contains && Y !== x) {
                    G = Y.contains(x);
                } else {
                    if (Y.compareDocumentPosition) {
                        G = !! (Y.compareDocumentPosition(x) & 16);
                    }
                }
            } else {}
            return G;
        },
        inDocument: function (G, Y) {
            return E.Dom._inDoc(E.Dom.get(G), Y);
        },
        _inDoc: function (Y, x) {
            var G = false;
            if (Y && Y[C]) {
                x = x || Y[e];
                G = E.Dom.isAncestor(x[v], Y);
            } else {}
            return G;
        },
        getElementsBy: function (Y, AF, AB, AD, y, AC, AE) {
            AF = AF || "*";
            AB = (AB) ? E.Dom.get(AB) : null || K;
            if (!AB) {
                return [];
            }
            var x = [],
                G = AB.getElementsByTagName(AF);
            for (var z = 0, AA = G.length; z < AA; ++z) {
                if (Y(G[z])) {
                    if (AE) {
                        x = G[z];
                        break;
                    } else {
                        x[x.length] = G[z];
                    }
                }
            }
            if (AD) {
                E.Dom.batch(x, AD, y, AC);
            }
            return x;
        },
        getElementBy: function (x, G, Y) {
            return E.Dom.getElementsBy(x, G, Y, null, null, null, true);
        },
        batch: function (x, AB, AA, z) {
            var y = [],
                Y = (z) ? AA : window;
            x = (x && (x[C] || x.item)) ? x : E.Dom.get(x);
            if (x && AB) {
                if (x[C] || x.length === undefined) {
                    return AB.call(Y, x, AA);
                }
                for (var G = 0; G < x.length; ++G) {
                    y[y.length] = AB.call(Y, x[G], AA);
                }
            } else {
                return false;
            }
            return y;
        },
        getDocumentHeight: function () {
            var Y = (K[t] != M || I) ? K.body.scrollHeight : W.scrollHeight,
                G = Math.max(Y, E.Dom.getViewportHeight());
            return G;
        },
        getDocumentWidth: function () {
            var Y = (K[t] != M || I) ? K.body.scrollWidth : W.scrollWidth,
                G = Math.max(Y, E.Dom.getViewportWidth());
            return G;
        },
        getViewportHeight: function () {
            var G = self.innerHeight,
                Y = K[t];
            if ((Y || T) && !D) {
                G = (Y == M) ? W.clientHeight : K.body.clientHeight;
            }
            return G;
        },
        getViewportWidth: function () {
            var G = self.innerWidth,
                Y = K[t];
            if (Y || T) {
                G = (Y == M) ? W.clientWidth : K.body.clientWidth;
            }
            return G;
        },
        getAncestorBy: function (G, Y) {
            while ((G = G[Z])) {
                if (E.Dom._testElement(G, Y)) {
                    return G;
                }
            }
            return null;
        },
        getAncestorByClassName: function (Y, G) {
            Y = E.Dom.get(Y);
            if (!Y) {
                return null;
            }
            var x = function (y) {
                return E.Dom.hasClass(y, G);
            };
            return E.Dom.getAncestorBy(Y, x);
        },
        getAncestorByTagName: function (Y, G) {
            Y = E.Dom.get(Y);
            if (!Y) {
                return null;
            }
            var x = function (y) {
                return y[C] && y[C].toUpperCase() == G.toUpperCase();
            };
            return E.Dom.getAncestorBy(Y, x);
        },
        getPreviousSiblingBy: function (G, Y) {
            while (G) {
                G = G.previousSibling;
                if (E.Dom._testElement(G, Y)) {
                    return G;
                }
            }
            return null;
        },
        getPreviousSibling: function (G) {
            G = E.Dom.get(G);
            if (!G) {
                return null;
            }
            return E.Dom.getPreviousSiblingBy(G);
        },
        getNextSiblingBy: function (G, Y) {
            while (G) {
                G = G.nextSibling;
                if (E.Dom._testElement(G, Y)) {
                    return G;
                }
            }
            return null;
        },
        getNextSibling: function (G) {
            G = E.Dom.get(G);
            if (!G) {
                return null;
            }
            return E.Dom.getNextSiblingBy(G);
        },
        getFirstChildBy: function (G, x) {
            var Y = (E.Dom._testElement(G.firstChild, x)) ? G.firstChild : null;
            return Y || E.Dom.getNextSiblingBy(G.firstChild, x);
        },
        getFirstChild: function (G, Y) {
            G = E.Dom.get(G);
            if (!G) {
                return null;
            }
            return E.Dom.getFirstChildBy(G);
        },
        getLastChildBy: function (G, x) {
            if (!G) {
                return null;
            }
            var Y = (E.Dom._testElement(G.lastChild, x)) ? G.lastChild : null;
            return Y || E.Dom.getPreviousSiblingBy(G.lastChild, x);
        },
        getLastChild: function (G) {
            G = E.Dom.get(G);
            return E.Dom.getLastChildBy(G);
        },
        getChildrenBy: function (Y, y) {
            var x = E.Dom.getFirstChildBy(Y, y),
                G = x ? [x] : [];
            E.Dom.getNextSiblingBy(x, function (z) {
                if (!y || y(z)) {
                    G[G.length] = z;
                }
                return false;
            });
            return G;
        },
        getChildren: function (G) {
            G = E.Dom.get(G);
            if (!G) {}
            return E.Dom.getChildrenBy(G);
        },
        getDocumentScrollLeft: function (G) {
            G = G || K;
            return Math.max(G[v].scrollLeft, G.body.scrollLeft);
        },
        getDocumentScrollTop: function (G) {
            G = G || K;
            return Math.max(G[v].scrollTop, G.body.scrollTop);
        },
        insertBefore: function (Y, G) {
            Y = E.Dom.get(Y);
            G = E.Dom.get(G);
            if (!Y || !G || !G[Z]) {
                return null;
            }
            return G[Z].insertBefore(Y, G);
        },
        insertAfter: function (Y, G) {
            Y = E.Dom.get(Y);
            G = E.Dom.get(G);
            if (!Y || !G || !G[Z]) {
                return null;
            }
            if (G.nextSibling) {
                return G[Z].insertBefore(Y, G.nextSibling);
            } else {
                return G[Z].appendChild(Y);
            }
        },
        getClientRegion: function () {
            var x = E.Dom.getDocumentScrollTop(),
                Y = E.Dom.getDocumentScrollLeft(),
                y = E.Dom.getViewportWidth() + Y,
                G = E.Dom.getViewportHeight() + x;
            return new E.Region(x, y, G, Y);
        },
        setAttribute: function (Y, G, x) {
            G = E.Dom.CUSTOM_ATTRIBUTES[G] || G;
            Y.setAttribute(G, x);
        },
        getAttribute: function (Y, G) {
            G = E.Dom.CUSTOM_ATTRIBUTES[G] || G;
            return Y.getAttribute(G);
        },
        _toCamel: function (Y) {
            var x = d;

            function G(y, z) {
                return z.toUpperCase();
            }
            return x[Y] || (x[Y] = Y.indexOf("-") === -1 ? Y : Y.replace(/-([a-z])/gi, G));
        },
        _getClassRegex: function (Y) {
            var G;
            if (Y !== undefined) {
                if (Y.exec) {
                    G = Y;
                } else {
                    G = h[Y];
                    if (!G) {
                        Y = Y.replace(E.Dom._patterns.CLASS_RE_TOKENS, "\\$1");
                        G = h[Y] = new RegExp(s + Y + k, U);
                    }
                }
            }
            return G;
        },
        _patterns: {
            ROOT_TAG: /^body|html$/i,
            CLASS_RE_TOKENS: /([\.\(\)\^\$\*\+\?\|\[\]\{\}])/g
        },
        _testElement: function (G, Y) {
            return G && G[l] == 1 && (!Y || Y(G));
        },
        _calcBorders: function (x, y) {
            var Y = parseInt(E.Dom[w](x, R), 10) || 0,
                G = parseInt(E.Dom[w](x, q), 10) || 0;
            if (H) {
                if (N.test(x[C])) {
                    Y = 0;
                    G = 0;
                }
            }
            y[0] += G;
            y[1] += Y;
            return y;
        }
    };
    var S = E.Dom[w];
    if (m.opera) {
        E.Dom[w] = function (Y, G) {
            var x = S(Y, G);
            if (X.test(G)) {
                x = E.Dom.Color.toRGB(x);
            }
            return x;
        };
    }
    if (m.webkit) {
        E.Dom[w] = function (Y, G) {
            var x = S(Y, G);
            if (x === "rgba(0, 0, 0, 0)") {
                x = "transparent";
            }
            return x;
        };
    }
})();
YAHOO.util.Region = function (C, D, A, B) {
    this.top = C;
    this.y = C;
    this[1] = C;
    this.right = D;
    this.bottom = A;
    this.left = B;
    this.x = B;
    this[0] = B;
    this.width = this.right - this.left;
    this.height = this.bottom - this.top;
};
YAHOO.util.Region.prototype.contains = function (A) {
    return (A.left >= this.left && A.right <= this.right && A.top >= this.top && A.bottom <= this.bottom);
};
YAHOO.util.Region.prototype.getArea = function () {
    return ((this.bottom - this.top) * (this.right - this.left));
};
YAHOO.util.Region.prototype.intersect = function (E) {
    var C = Math.max(this.top, E.top),
        D = Math.min(this.right, E.right),
        A = Math.min(this.bottom, E.bottom),
        B = Math.max(this.left, E.left);
    if (A >= C && D >= B) {
        return new YAHOO.util.Region(C, D, A, B);
    } else {
        return null;
    }
};
YAHOO.util.Region.prototype.union = function (E) {
    var C = Math.min(this.top, E.top),
        D = Math.max(this.right, E.right),
        A = Math.max(this.bottom, E.bottom),
        B = Math.min(this.left, E.left);
    return new YAHOO.util.Region(C, D, A, B);
};
YAHOO.util.Region.prototype.toString = function () {
    return ("Region {" + "top: " + this.top + ", right: " + this.right + ", bottom: " + this.bottom + ", left: " + this.left + ", height: " + this.height + ", width: " + this.width + "}");
};
YAHOO.util.Region.getRegion = function (D) {
    var F = YAHOO.util.Dom.getXY(D),
        C = F[1],
        E = F[0] + D.offsetWidth,
        A = F[1] + D.offsetHeight,
        B = F[0];
    return new YAHOO.util.Region(C, E, A, B);
};
YAHOO.util.Point = function (A, B) {
    if (YAHOO.lang.isArray(A)) {
        B = A[1];
        A = A[0];
    }
    YAHOO.util.Point.superclass.constructor.call(this, B, A, B, A);
};
YAHOO.extend(YAHOO.util.Point, YAHOO.util.Region);
(function () {
    var B = YAHOO.util,
        A = "clientTop",
        F = "clientLeft",
        J = "parentNode",
        K = "right",
        W = "hasLayout",
        I = "px",
        U = "opacity",
        L = "auto",
        D = "borderLeftWidth",
        G = "borderTopWidth",
        P = "borderRightWidth",
        V = "borderBottomWidth",
        S = "visible",
        Q = "transparent",
        N = "height",
        E = "width",
        H = "style",
        T = "currentStyle",
        R = /^width|height$/,
        O = /^(\d[.\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz|%){1}?/i,
        M = {
            get: function (X, Z) {
                var Y = "",
                    a = X[T][Z];
                if (Z === U) {
                    Y = B.Dom.getStyle(X, U);
                } else {
                    if (!a || (a.indexOf && a.indexOf(I) > -1)) {
                        Y = a;
                    } else {
                        if (B.Dom.IE_COMPUTED[Z]) {
                            Y = B.Dom.IE_COMPUTED[Z](X, Z);
                        } else {
                            if (O.test(a)) {
                                Y = B.Dom.IE.ComputedStyle.getPixel(X, Z);
                            } else {
                                Y = a;
                            }
                        }
                    }
                }
                return Y;
            },
            getOffset: function (Z, e) {
                var b = Z[T][e],
                    X = e.charAt(0).toUpperCase() + e.substr(1),
                    c = "offset" + X,
                    Y = "pixel" + X,
                    a = "",
                    d;
                if (b == L) {
                    d = Z[c];
                    if (d === undefined) {
                        a = 0;
                    }
                    a = d;
                    if (R.test(e)) {
                        Z[H][e] = d;
                        if (Z[c] > d) {
                            a = d - (Z[c] - d);
                        }
                        Z[H][e] = L;
                    }
                } else {
                    if (!Z[H][Y] && !Z[H][e]) {
                        Z[H][e] = b;
                    }
                    a = Z[H][Y];
                }
                return a + I;
            },
            getBorderWidth: function (X, Z) {
                var Y = null;
                if (!X[T][W]) {
                    X[H].zoom = 1;
                }
                switch (Z) {
                case G:
                    Y = X[A];
                    break;
                case V:
                    Y = X.offsetHeight - X.clientHeight - X[A];
                    break;
                case D:
                    Y = X[F];
                    break;
                case P:
                    Y = X.offsetWidth - X.clientWidth - X[F];
                    break;
                }
                return Y + I;
            },
            getPixel: function (Y, X) {
                var a = null,
                    b = Y[T][K],
                    Z = Y[T][X];
                Y[H][K] = Z;
                a = Y[H].pixelRight;
                Y[H][K] = b;
                return a + I;
            },
            getMargin: function (Y, X) {
                var Z;
                if (Y[T][X] == L) {
                    Z = 0 + I;
                } else {
                    Z = B.Dom.IE.ComputedStyle.getPixel(Y, X);
                }
                return Z;
            },
            getVisibility: function (Y, X) {
                var Z;
                while ((Z = Y[T]) && Z[X] == "inherit") {
                    Y = Y[J];
                }
                return (Z) ? Z[X] : S;
            },
            getColor: function (Y, X) {
                return B.Dom.Color.toRGB(Y[T][X]) || Q;
            },
            getBorderColor: function (Y, X) {
                var Z = Y[T],
                    a = Z[X] || Z.color;
                return B.Dom.Color.toRGB(B.Dom.Color.toHex(a));
            }
        }, C = {};
    C.top = C.right = C.bottom = C.left = C[E] = C[N] = M.getOffset;
    C.color = M.getColor;
    C[G] = C[P] = C[V] = C[D] = M.getBorderWidth;
    C.marginTop = C.marginRight = C.marginBottom = C.marginLeft = M.getMargin;
    C.visibility = M.getVisibility;
    C.borderColor = C.borderTopColor = C.borderRightColor = C.borderBottomColor = C.borderLeftColor = M.getBorderColor;
    B.Dom.IE_COMPUTED = C;
    B.Dom.IE_ComputedStyle = M;
})();
(function () {
    var C = "toString",
        A = parseInt,
        B = RegExp,
        D = YAHOO.util;
    D.Dom.Color = {
        KEYWORDS: {
            black: "000",
            silver: "c0c0c0",
            gray: "808080",
            white: "fff",
            maroon: "800000",
            red: "f00",
            purple: "800080",
            fuchsia: "f0f",
            green: "008000",
            lime: "0f0",
            olive: "808000",
            yellow: "ff0",
            navy: "000080",
            blue: "00f",
            teal: "008080",
            aqua: "0ff"
        },
        re_RGB: /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,
        re_hex: /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
        re_hex3: /([0-9A-F])/gi,
        toRGB: function (E) {
            if (!D.Dom.Color.re_RGB.test(E)) {
                E = D.Dom.Color.toHex(E);
            }
            if (D.Dom.Color.re_hex.exec(E)) {
                E = "rgb(" + [A(B.$1, 16), A(B.$2, 16), A(B.$3, 16)].join(", ") + ")";
            }
            return E;
        },
        toHex: function (H) {
            H = D.Dom.Color.KEYWORDS[H] || H;
            if (D.Dom.Color.re_RGB.exec(H)) {
                var G = (B.$1.length === 1) ? "0" + B.$1 : Number(B.$1),
                    F = (B.$2.length === 1) ? "0" + B.$2 : Number(B.$2),
                    E = (B.$3.length === 1) ? "0" + B.$3 : Number(B.$3);
                H = [G[C](16), F[C](16), E[C](16)].join("");
            }
            if (H.length < 6) {
                H = H.replace(D.Dom.Color.re_hex3, "$1$1");
            }
            if (H !== "transparent" && H.indexOf("#") < 0) {
                H = "#" + H;
            }
            return H.toLowerCase();
        }
    };
}());
YAHOO.register("dom", YAHOO.util.Dom, {
    version: "2.7.0",
    build: "1796"
});
YAHOO.util.CustomEvent = function (D, C, B, A) {
    this.type = D;
    this.scope = C || window;
    this.silent = B;
    this.signature = A || YAHOO.util.CustomEvent.LIST;
    this.subscribers = [];
    if (!this.silent) {}
    var E = "_YUICEOnSubscribe";
    if (D !== E) {
        this.subscribeEvent = new YAHOO.util.CustomEvent(E, this, true);
    }
    this.lastError = null;
};
YAHOO.util.CustomEvent.LIST = 0;
YAHOO.util.CustomEvent.FLAT = 1;
YAHOO.util.CustomEvent.prototype = {
    subscribe: function (A, B, C) {
        if (!A) {
            throw new Error("Invalid callback for subscriber to '" + this.type + "'");
        }
        if (this.subscribeEvent) {
            this.subscribeEvent.fire(A, B, C);
        }
        this.subscribers.push(new YAHOO.util.Subscriber(A, B, C));
    },
    unsubscribe: function (D, F) {
        if (!D) {
            return this.unsubscribeAll();
        }
        var E = false;
        for (var B = 0, A = this.subscribers.length; B < A; ++B) {
            var C = this.subscribers[B];
            if (C && C.contains(D, F)) {
                this._delete(B);
                E = true;
            }
        }
        return E;
    },
    fire: function () {
        this.lastError = null;
        var K = [],
            E = this.subscribers.length;
        if (!E && this.silent) {
            return true;
        }
        var I = [].slice.call(arguments, 0),
            G = true,
            D, J = false;
        if (!this.silent) {}
        var C = this.subscribers.slice(),
            A = YAHOO.util.Event.throwErrors;
        for (D = 0; D < E; ++D) {
            var M = C[D];
            if (!M) {
                J = true;
            } else {
                if (!this.silent) {}
                var L = M.getScope(this.scope);
                if (this.signature == YAHOO.util.CustomEvent.FLAT) {
                    var B = null;
                    if (I.length > 0) {
                        B = I[0];
                    }
                    try {
                        G = M.fn.call(L, B, M.obj);
                    } catch (F) {
                        this.lastError = F;
                        if (A) {
                            throw F;
                        }
                    }
                } else {
                    try {
                        G = M.fn.call(L, this.type, I, M.obj);
                    } catch (H) {
                        this.lastError = H;
                        if (A) {
                            throw H;
                        }
                    }
                } if (false === G) {
                    if (!this.silent) {}
                    break;
                }
            }
        }
        return (G !== false);
    },
    unsubscribeAll: function () {
        var A = this.subscribers.length,
            B;
        for (B = A - 1; B > -1; B--) {
            this._delete(B);
        }
        this.subscribers = [];
        return A;
    },
    _delete: function (A) {
        var B = this.subscribers[A];
        if (B) {
            delete B.fn;
            delete B.obj;
        }
        this.subscribers.splice(A, 1);
    },
    toString: function () {
        return "CustomEvent: " + "'" + this.type + "', " + "context: " + this.scope;
    }
};
YAHOO.util.Subscriber = function (A, B, C) {
    this.fn = A;
    this.obj = YAHOO.lang.isUndefined(B) ? null : B;
    this.overrideContext = C;
};
YAHOO.util.Subscriber.prototype.getScope = function (A) {
    if (this.overrideContext) {
        if (this.overrideContext === true) {
            return this.obj;
        } else {
            return this.overrideContext;
        }
    }
    return A;
};
YAHOO.util.Subscriber.prototype.contains = function (A, B) {
    if (B) {
        return (this.fn == A && this.obj == B);
    } else {
        return (this.fn == A);
    }
};
YAHOO.util.Subscriber.prototype.toString = function () {
    return "Subscriber { obj: " + this.obj + ", overrideContext: " + (this.overrideContext || "no") + " }";
};
if (!YAHOO.util.Event) {
    YAHOO.util.Event = function () {
        var H = false;
        var I = [];
        var J = [];
        var G = [];
        var E = [];
        var C = 0;
        var F = [];
        var B = [];
        var A = 0;
        var D = {
            63232: 38,
            63233: 40,
            63234: 37,
            63235: 39,
            63276: 33,
            63277: 34,
            25: 9
        };
        var K = YAHOO.env.ua.ie ? "focusin" : "focus";
        var L = YAHOO.env.ua.ie ? "focusout" : "blur";
        return {
            POLL_RETRYS: 2000,
            POLL_INTERVAL: 20,
            EL: 0,
            TYPE: 1,
            FN: 2,
            WFN: 3,
            UNLOAD_OBJ: 3,
            ADJ_SCOPE: 4,
            OBJ: 5,
            OVERRIDE: 6,
            lastError: null,
            isSafari: YAHOO.env.ua.webkit,
            webkit: YAHOO.env.ua.webkit,
            isIE: YAHOO.env.ua.ie,
            _interval: null,
            _dri: null,
            DOMReady: false,
            throwErrors: false,
            startInterval: function () {
                if (!this._interval) {
                    var M = this;
                    var N = function () {
                        M._tryPreloadAttach();
                    };
                    this._interval = setInterval(N, this.POLL_INTERVAL);
                }
            },
            onAvailable: function (S, O, Q, R, P) {
                var M = (YAHOO.lang.isString(S)) ? [S] : S;
                for (var N = 0; N < M.length; N = N + 1) {
                    F.push({
                        id: M[N],
                        fn: O,
                        obj: Q,
                        overrideContext: R,
                        checkReady: P
                    });
                }
                C = this.POLL_RETRYS;
                this.startInterval();
            },
            onContentReady: function (P, M, N, O) {
                this.onAvailable(P, M, N, O, true);
            },
            onDOMReady: function (M, N, O) {
                if (this.DOMReady) {
                    setTimeout(function () {
                        var P = window;
                        if (O) {
                            if (O === true) {
                                P = N;
                            } else {
                                P = O;
                            }
                        }
                        M.call(P, "DOMReady", [], N);
                    }, 0);
                } else {
                    this.DOMReadyEvent.subscribe(M, N, O);
                }
            },
            _addListener: function (O, M, Y, S, W, b) {
                if (!Y || !Y.call) {
                    return false;
                }
                if (this._isValidCollection(O)) {
                    var Z = true;
                    for (var T = 0, V = O.length; T < V; ++T) {
                        Z = this.on(O[T], M, Y, S, W) && Z;
                    }
                    return Z;
                } else {
                    if (YAHOO.lang.isString(O)) {
                        var R = this.getEl(O);
                        if (R) {
                            O = R;
                        } else {
                            this.onAvailable(O, function () {
                                YAHOO.util.Event.on(O, M, Y, S, W);
                            });
                            return true;
                        }
                    }
                } if (!O) {
                    return false;
                }
                if ("unload" == M && S !== this) {
                    J[J.length] = [O, M, Y, S, W];
                    return true;
                }
                var N = O;
                if (W) {
                    if (W === true) {
                        N = S;
                    } else {
                        N = W;
                    }
                }
                var P = function (c) {
                    return Y.call(N, YAHOO.util.Event.getEvent(c, O), S);
                };
                var a = [O, M, Y, P, N, S, W];
                var U = I.length;
                I[U] = a;
                if (this.useLegacyEvent(O, M)) {
                    var Q = this.getLegacyIndex(O, M);
                    if (Q == -1 || O != G[Q][0]) {
                        Q = G.length;
                        B[O.id + M] = Q;
                        G[Q] = [O, M, O["on" + M]];
                        E[Q] = [];
                        O["on" + M] = function (c) {
                            YAHOO.util.Event.fireLegacyEvent(YAHOO.util.Event.getEvent(c), Q);
                        };
                    }
                    E[Q].push(a);
                } else {
                    try {
                        this._simpleAdd(O, M, P, b);
                    } catch (X) {
                        this.lastError = X;
                        this.removeListener(O, M, Y);
                        return false;
                    }
                }
                return true;
            },
            addListener: function (N, Q, M, O, P) {
                return this._addListener(N, Q, M, O, P, false);
            },
            addFocusListener: function (N, M, O, P) {
                return this._addListener(N, K, M, O, P, true);
            },
            removeFocusListener: function (N, M) {
                return this.removeListener(N, K, M);
            },
            addBlurListener: function (N, M, O, P) {
                return this._addListener(N, L, M, O, P, true);
            },
            removeBlurListener: function (N, M) {
                return this.removeListener(N, L, M);
            },
            fireLegacyEvent: function (R, P) {
                var T = true,
                    M, V, U, N, S;
                V = E[P].slice();
                for (var O = 0, Q = V.length; O < Q; ++O) {
                    U = V[O];
                    if (U && U[this.WFN]) {
                        N = U[this.ADJ_SCOPE];
                        S = U[this.WFN].call(N, R);
                        T = (T && S);
                    }
                }
                M = G[P];
                if (M && M[2]) {
                    M[2](R);
                }
                return T;
            },
            getLegacyIndex: function (N, O) {
                var M = this.generateId(N) + O;
                if (typeof B[M] == "undefined") {
                    return -1;
                } else {
                    return B[M];
                }
            },
            useLegacyEvent: function (M, N) {
                return (this.webkit && this.webkit < 419 && ("click" == N || "dblclick" == N));
            },
            removeListener: function (N, M, V) {
                var Q, T, X;
                if (typeof N == "string") {
                    N = this.getEl(N);
                } else {
                    if (this._isValidCollection(N)) {
                        var W = true;
                        for (Q = N.length - 1; Q > -1; Q--) {
                            W = (this.removeListener(N[Q], M, V) && W);
                        }
                        return W;
                    }
                } if (!V || !V.call) {
                    return this.purgeElement(N, false, M);
                }
                if ("unload" == M) {
                    for (Q = J.length - 1; Q > -1; Q--) {
                        X = J[Q];
                        if (X && X[0] == N && X[1] == M && X[2] == V) {
                            J.splice(Q, 1);
                            return true;
                        }
                    }
                    return false;
                }
                var R = null;
                var S = arguments[3];
                if ("undefined" === typeof S) {
                    S = this._getCacheIndex(N, M, V);
                }
                if (S >= 0) {
                    R = I[S];
                }
                if (!N || !R) {
                    return false;
                }
                if (this.useLegacyEvent(N, M)) {
                    var P = this.getLegacyIndex(N, M);
                    var O = E[P];
                    if (O) {
                        for (Q = 0, T = O.length; Q < T; ++Q) {
                            X = O[Q];
                            if (X && X[this.EL] == N && X[this.TYPE] == M && X[this.FN] == V) {
                                O.splice(Q, 1);
                                break;
                            }
                        }
                    }
                } else {
                    try {
                        this._simpleRemove(N, M, R[this.WFN], false);
                    } catch (U) {
                        this.lastError = U;
                        return false;
                    }
                }
                delete I[S][this.WFN];
                delete I[S][this.FN];
                I.splice(S, 1);
                return true;
            },
            getTarget: function (O, N) {
                var M = O.target || O.srcElement;
                return this.resolveTextNode(M);
            },
            resolveTextNode: function (N) {
                try {
                    if (N && 3 == N.nodeType) {
                        return N.parentNode;
                    }
                } catch (M) {}
                return N;
            },
            getPageX: function (N) {
                var M = N.pageX;
                if (!M && 0 !== M) {
                    M = N.clientX || 0;
                    if (this.isIE) {
                        M += this._getScrollLeft();
                    }
                }
                return M;
            },
            getPageY: function (M) {
                var N = M.pageY;
                if (!N && 0 !== N) {
                    N = M.clientY || 0;
                    if (this.isIE) {
                        N += this._getScrollTop();
                    }
                }
                return N;
            },
            getXY: function (M) {
                return [this.getPageX(M), this.getPageY(M)];
            },
            getRelatedTarget: function (N) {
                var M = N.relatedTarget;
                if (!M) {
                    if (N.type == "mouseout") {
                        M = N.toElement;
                    } else {
                        if (N.type == "mouseover") {
                            M = N.fromElement;
                        }
                    }
                }
                return this.resolveTextNode(M);
            },
            getTime: function (O) {
                if (!O.time) {
                    var N = new Date().getTime();
                    try {
                        O.time = N;
                    } catch (M) {
                        this.lastError = M;
                        return N;
                    }
                }
                return O.time;
            },
            stopEvent: function (M) {
                this.stopPropagation(M);
                this.preventDefault(M);
            },
            stopPropagation: function (M) {
                if (M.stopPropagation) {
                    M.stopPropagation();
                } else {
                    M.cancelBubble = true;
                }
            },
            preventDefault: function (M) {
                if (M.preventDefault) {
                    M.preventDefault();
                } else {
                    M.returnValue = false;
                }
            },
            getEvent: function (O, M) {
                var N = O || window.event;
                if (!N) {
                    var P = this.getEvent.caller;
                    while (P) {
                        N = P.arguments[0];
                        if (N && Event == N.constructor) {
                            break;
                        }
                        P = P.caller;
                    }
                }
                return N;
            },
            getCharCode: function (N) {
                var M = N.keyCode || N.charCode || 0;
                if (YAHOO.env.ua.webkit && (M in D)) {
                    M = D[M];
                }
                return M;
            },
            _getCacheIndex: function (Q, R, P) {
                for (var O = 0, N = I.length; O < N; O = O + 1) {
                    var M = I[O];
                    if (M && M[this.FN] == P && M[this.EL] == Q && M[this.TYPE] == R) {
                        return O;
                    }
                }
                return -1;
            },
            generateId: function (M) {
                var N = M.id;
                if (!N) {
                    N = "yuievtautoid-" + A;
                    ++A;
                    M.id = N;
                }
                return N;
            },
            _isValidCollection: function (N) {
                try {
                    return (N && typeof N !== "string" && N.length && !N.tagName && !N.alert && typeof N[0] !== "undefined");
                } catch (M) {
                    return false;
                }
            },
            elCache: {},
            getEl: function (M) {
                return (typeof M === "string") ? document.getElementById(M) : M;
            },
            clearCache: function () {},
            DOMReadyEvent: new YAHOO.util.CustomEvent("DOMReady", this),
            _load: function (N) {
                if (!H) {
                    H = true;
                    var M = YAHOO.util.Event;
                    M._ready();
                    M._tryPreloadAttach();
                }
            },
            _ready: function (N) {
                var M = YAHOO.util.Event;
                if (!M.DOMReady) {
                    M.DOMReady = true;
                    M.DOMReadyEvent.fire();
                    M._simpleRemove(document, "DOMContentLoaded", M._ready);
                }
            },
            _tryPreloadAttach: function () {
                if (F.length === 0) {
                    C = 0;
                    if (this._interval) {
                        clearInterval(this._interval);
                        this._interval = null;
                    }
                    return;
                }
                if (this.locked) {
                    return;
                }
                if (this.isIE) {
                    if (!this.DOMReady) {
                        this.startInterval();
                        return;
                    }
                }
                this.locked = true;
                var S = !H;
                if (!S) {
                    S = (C > 0 && F.length > 0);
                }
                var R = [];
                var T = function (V, W) {
                    var U = V;
                    if (W.overrideContext) {
                        if (W.overrideContext === true) {
                            U = W.obj;
                        } else {
                            U = W.overrideContext;
                        }
                    }
                    W.fn.call(U, W.obj);
                };
                var N, M, Q, P, O = [];
                for (N = 0, M = F.length; N < M; N = N + 1) {
                    Q = F[N];
                    if (Q) {
                        P = this.getEl(Q.id);
                        if (P) {
                            if (Q.checkReady) {
                                if (H || P.nextSibling || !S) {
                                    O.push(Q);
                                    F[N] = null;
                                }
                            } else {
                                T(P, Q);
                                F[N] = null;
                            }
                        } else {
                            R.push(Q);
                        }
                    }
                }
                for (N = 0, M = O.length; N < M; N = N + 1) {
                    Q = O[N];
                    T(this.getEl(Q.id), Q);
                }
                C--;
                if (S) {
                    for (N = F.length - 1; N > -1; N--) {
                        Q = F[N];
                        if (!Q || !Q.id) {
                            F.splice(N, 1);
                        }
                    }
                    this.startInterval();
                } else {
                    if (this._interval) {
                        clearInterval(this._interval);
                        this._interval = null;
                    }
                }
                this.locked = false;
            },
            purgeElement: function (Q, R, T) {
                var O = (YAHOO.lang.isString(Q)) ? this.getEl(Q) : Q;
                var S = this.getListeners(O, T),
                    P, M;
                if (S) {
                    for (P = S.length - 1; P > -1; P--) {
                        var N = S[P];
                        this.removeListener(O, N.type, N.fn);
                    }
                }
                if (R && O && O.childNodes) {
                    for (P = 0, M = O.childNodes.length; P < M; ++P) {
                        this.purgeElement(O.childNodes[P], R, T);
                    }
                }
            },
            getListeners: function (O, M) {
                var R = [],
                    N;
                if (!M) {
                    N = [I, J];
                } else {
                    if (M === "unload") {
                        N = [J];
                    } else {
                        N = [I];
                    }
                }
                var T = (YAHOO.lang.isString(O)) ? this.getEl(O) : O;
                for (var Q = 0; Q < N.length; Q = Q + 1) {
                    var V = N[Q];
                    if (V) {
                        for (var S = 0, U = V.length; S < U; ++S) {
                            var P = V[S];
                            if (P && P[this.EL] === T && (!M || M === P[this.TYPE])) {
                                R.push({
                                    type: P[this.TYPE],
                                    fn: P[this.FN],
                                    obj: P[this.OBJ],
                                    adjust: P[this.OVERRIDE],
                                    scope: P[this.ADJ_SCOPE],
                                    index: S
                                });
                            }
                        }
                    }
                }
                return (R.length) ? R : null;
            },
            _unload: function (T) {
                var N = YAHOO.util.Event,
                    Q, P, O, S, R, U = J.slice(),
                    M;
                for (Q = 0, S = J.length; Q < S; ++Q) {
                    O = U[Q];
                    if (O) {
                        M = window;
                        if (O[N.ADJ_SCOPE]) {
                            if (O[N.ADJ_SCOPE] === true) {
                                M = O[N.UNLOAD_OBJ];
                            } else {
                                M = O[N.ADJ_SCOPE];
                            }
                        }
                        O[N.FN].call(M, N.getEvent(T, O[N.EL]), O[N.UNLOAD_OBJ]);
                        U[Q] = null;
                    }
                }
                O = null;
                M = null;
                J = null;
                if (I) {
                    for (P = I.length - 1; P > -1; P--) {
                        O = I[P];
                        if (O) {
                            N.removeListener(O[N.EL], O[N.TYPE], O[N.FN], P);
                        }
                    }
                    O = null;
                }
                G = null;
                N._simpleRemove(window, "unload", N._unload);
            },
            _getScrollLeft: function () {
                return this._getScroll()[1];
            },
            _getScrollTop: function () {
                return this._getScroll()[0];
            },
            _getScroll: function () {
                var M = document.documentElement,
                    N = document.body;
                if (M && (M.scrollTop || M.scrollLeft)) {
                    return [M.scrollTop, M.scrollLeft];
                } else {
                    if (N) {
                        return [N.scrollTop, N.scrollLeft];
                    } else {
                        return [0, 0];
                    }
                }
            },
            regCE: function () {},
            _simpleAdd: function () {
                if (window.addEventListener) {
                    return function (O, P, N, M) {
                        O.addEventListener(P, N, (M));
                    };
                } else {
                    if (window.attachEvent) {
                        return function (O, P, N, M) {
                            O.attachEvent("on" + P, N);
                        };
                    } else {
                        return function () {};
                    }
                }
            }(),
            _simpleRemove: function () {
                if (window.removeEventListener) {
                    return function (O, P, N, M) {
                        O.removeEventListener(P, N, (M));
                    };
                } else {
                    if (window.detachEvent) {
                        return function (N, O, M) {
                            N.detachEvent("on" + O, M);
                        };
                    } else {
                        return function () {};
                    }
                }
            }()
        };
    }();
    (function () {
        var EU = YAHOO.util.Event;
        EU.on = EU.addListener;
        EU.onFocus = EU.addFocusListener;
        EU.onBlur = EU.addBlurListener;
        /* DOMReady: based on work by: Dean Edwards/John Resig/Matthias Miller */
        if (EU.isIE) {
            YAHOO.util.Event.onDOMReady(YAHOO.util.Event._tryPreloadAttach, YAHOO.util.Event, true);
            var n = document.createElement("p");
            EU._dri = setInterval(function () {
                try {
                    n.doScroll("left");
                    clearInterval(EU._dri);
                    EU._dri = null;
                    EU._ready();
                    n = null;
                } catch (ex) {}
            }, EU.POLL_INTERVAL);
        } else {
            if (EU.webkit && EU.webkit < 525) {
                EU._dri = setInterval(function () {
                    var rs = document.readyState;
                    if ("loaded" == rs || "complete" == rs) {
                        clearInterval(EU._dri);
                        EU._dri = null;
                        EU._ready();
                    }
                }, EU.POLL_INTERVAL);
            } else {
                EU._simpleAdd(document, "DOMContentLoaded", EU._ready);
            }
        }
        EU._simpleAdd(window, "load", EU._load);
        EU._simpleAdd(window, "unload", EU._unload);
        EU._tryPreloadAttach();
    })();
}
YAHOO.util.EventProvider = function () {};
YAHOO.util.EventProvider.prototype = {
    __yui_events: null,
    __yui_subscribers: null,
    subscribe: function (A, C, F, E) {
        this.__yui_events = this.__yui_events || {};
        var D = this.__yui_events[A];
        if (D) {
            D.subscribe(C, F, E);
        } else {
            this.__yui_subscribers = this.__yui_subscribers || {};
            var B = this.__yui_subscribers;
            if (!B[A]) {
                B[A] = [];
            }
            B[A].push({
                fn: C,
                obj: F,
                overrideContext: E
            });
        }
    },
    unsubscribe: function (C, E, G) {
        this.__yui_events = this.__yui_events || {};
        var A = this.__yui_events;
        if (C) {
            var F = A[C];
            if (F) {
                return F.unsubscribe(E, G);
            }
        } else {
            var B = true;
            for (var D in A) {
                if (YAHOO.lang.hasOwnProperty(A, D)) {
                    B = B && A[D].unsubscribe(E, G);
                }
            }
            return B;
        }
        return false;
    },
    unsubscribeAll: function (A) {
        return this.unsubscribe(A);
    },
    createEvent: function (G, D) {
        this.__yui_events = this.__yui_events || {};
        var A = D || {};
        var I = this.__yui_events;
        if (I[G]) {} else {
            var H = A.scope || this;
            var E = (A.silent);
            var B = new YAHOO.util.CustomEvent(G, H, E, YAHOO.util.CustomEvent.FLAT);
            I[G] = B;
            if (A.onSubscribeCallback) {
                B.subscribeEvent.subscribe(A.onSubscribeCallback);
            }
            this.__yui_subscribers = this.__yui_subscribers || {};
            var F = this.__yui_subscribers[G];
            if (F) {
                for (var C = 0; C < F.length; ++C) {
                    B.subscribe(F[C].fn, F[C].obj, F[C].overrideContext);
                }
            }
        }
        return I[G];
    },
    fireEvent: function (E, D, A, C) {
        this.__yui_events = this.__yui_events || {};
        var G = this.__yui_events[E];
        if (!G) {
            return null;
        }
        var B = [];
        for (var F = 1; F < arguments.length; ++F) {
            B.push(arguments[F]);
        }
        return G.fire.apply(G, B);
    },
    hasEvent: function (A) {
        if (this.__yui_events) {
            if (this.__yui_events[A]) {
                return true;
            }
        }
        return false;
    }
};
(function () {
    var A = YAHOO.util.Event,
        C = YAHOO.lang;
    YAHOO.util.KeyListener = function (D, I, E, F) {
        if (!D) {} else {
            if (!I) {} else {
                if (!E) {}
            }
        } if (!F) {
            F = YAHOO.util.KeyListener.KEYDOWN;
        }
        var G = new YAHOO.util.CustomEvent("keyPressed");
        this.enabledEvent = new YAHOO.util.CustomEvent("enabled");
        this.disabledEvent = new YAHOO.util.CustomEvent("disabled");
        if (C.isString(D)) {
            D = document.getElementById(D);
        }
        if (C.isFunction(E)) {
            G.subscribe(E);
        } else {
            G.subscribe(E.fn, E.scope, E.correctScope);
        }

        function H(O, N) {
            if (!I.shift) {
                I.shift = false;
            }
            if (!I.alt) {
                I.alt = false;
            }
            if (!I.ctrl) {
                I.ctrl = false;
            }
            if (O.shiftKey == I.shift && O.altKey == I.alt && O.ctrlKey == I.ctrl) {
                var J, M = I.keys,
                    L;
                if (YAHOO.lang.isArray(M)) {
                    for (var K = 0; K < M.length; K++) {
                        J = M[K];
                        L = A.getCharCode(O);
                        if (J == L) {
                            G.fire(L, O);
                            break;
                        }
                    }
                } else {
                    L = A.getCharCode(O);
                    if (M == L) {
                        G.fire(L, O);
                    }
                }
            }
        }
        this.enable = function () {
            if (!this.enabled) {
                A.on(D, F, H);
                this.enabledEvent.fire(I);
            }
            this.enabled = true;
        };
        this.disable = function () {
            if (this.enabled) {
                A.removeListener(D, F, H);
                this.disabledEvent.fire(I);
            }
            this.enabled = false;
        };
        this.toString = function () {
            return "KeyListener [" + I.keys + "] " + D.tagName + (D.id ? "[" + D.id + "]" : "");
        };
    };
    var B = YAHOO.util.KeyListener;
    B.KEYDOWN = "keydown";
    B.KEYUP = "keyup";
    B.KEY = {
        ALT: 18,
        BACK_SPACE: 8,
        CAPS_LOCK: 20,
        CONTROL: 17,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        LEFT: 37,
        META: 224,
        NUM_LOCK: 144,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PAUSE: 19,
        PRINTSCREEN: 44,
        RIGHT: 39,
        SCROLL_LOCK: 145,
        SHIFT: 16,
        SPACE: 32,
        TAB: 9,
        UP: 38
    };
})();
YAHOO.register("event", YAHOO.util.Event, {
    version: "2.7.0",
    build: "1796"
});
YAHOO.register("yahoo-dom-event", YAHOO, {
    version: "2.7.0",
    build: "1796"
});


/*
connection-min.js
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
-------------------------------------------------------*/
YAHOO.util.Connect = {
    _msxml_progid: ["Microsoft.XMLHTTP", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP"],
    _http_headers: {},
    _has_http_headers: false,
    _use_default_post_header: true,
    _default_post_header: "application/x-www-form-urlencoded; charset=UTF-8; X-UA-Compatible:IE=edge,chrome=1",
    _default_form_header: "application/x-www-form-urlencoded;X-UA-Compatible:IE=edge,chrome=1",
    _use_default_xhr_header: true,
    _default_xhr_header: "XMLHttpRequest",
    _has_default_headers: true,
    _default_headers: {},
    _isFormSubmit: false,
    _isFileUpload: false,
    _formNode: null,
    _sFormData: null,
    _poll: {},
    _timeOut: {},
    _polling_interval: 50,
    _transaction_id: 0,
    _submitElementValue: null,
    _hasSubmitListener: (function () {
        if (YAHOO.util.Event) {
            YAHOO.util.Event.addListener(document, "click", function (C) {
                var B = YAHOO.util.Event.getTarget(C),
                    A = B.nodeName.toLowerCase();
                if ((A === "input" || A === "button") && (B.type && B.type.toLowerCase() == "submit")) {
                    YAHOO.util.Connect._submitElementValue = encodeURIComponent(B.name) + "=" + encodeURIComponent(B.value);
                }
            });
            return true;
        }
        return false;
    })(),
    startEvent: new YAHOO.util.CustomEvent("start"),
    completeEvent: new YAHOO.util.CustomEvent("complete"),
    successEvent: new YAHOO.util.CustomEvent("success"),
    failureEvent: new YAHOO.util.CustomEvent("failure"),
    uploadEvent: new YAHOO.util.CustomEvent("upload"),
    abortEvent: new YAHOO.util.CustomEvent("abort"),
    _customEvents: {
        onStart: ["startEvent", "start"],
        onComplete: ["completeEvent", "complete"],
        onSuccess: ["successEvent", "success"],
        onFailure: ["failureEvent", "failure"],
        onUpload: ["uploadEvent", "upload"],
        onAbort: ["abortEvent", "abort"]
    },
    setProgId: function (A) {
        this._msxml_progid.unshift(A);
    },
    setDefaultPostHeader: function (A) {
        if (typeof A == "string") {
            this._default_post_header = A;
        } else {
            if (typeof A == "boolean") {
                this._use_default_post_header = A;
            }
        }
    },
    setDefaultXhrHeader: function (A) {
        if (typeof A == "string") {
            this._default_xhr_header = A;
        } else {
            this._use_default_xhr_header = A;
        }
    },
    setPollingInterval: function (A) {
        if (typeof A == "number" && isFinite(A)) {
            this._polling_interval = A;
        }
    },
    createXhrObject: function (F) {
        var E, A;
        try {
            A = new XMLHttpRequest();
            E = {
                conn: A,
                tId: F
            };
        } catch (D) {
            for (var B = 0; B < this._msxml_progid.length; ++B) {
                try {
                    A = new ActiveXObject(this._msxml_progid[B]);
                    E = {
                        conn: A,
                        tId: F
                    };
                    break;
                } catch (C) {}
            }
        } finally {
            return E;
        }
    },
    getConnectionObject: function (A) {
        var C;
        var D = this._transaction_id;
        try {
            if (!A) {
                C = this.createXhrObject(D);
            } else {
                C = {};
                C.tId = D;
                C.isUpload = true;
            } if (C) {
                this._transaction_id++;
            }
        } catch (B) {} finally {
            return C;
        }
    },
    asyncRequest: function (F, C, E, A) {
        var D = (this._isFileUpload) ? this.getConnectionObject(true) : this.getConnectionObject();
        var B = (E && E.argument) ? E.argument : null;
        if (!D) {
            return null;
        } else {
            if (E && E.customevents) {
                this.initCustomEvents(D, E);
            }
            if (this._isFormSubmit) {
                if (this._isFileUpload) {
                    this.uploadFile(D, E, C, A);
                    return D;
                }
                if (F.toUpperCase() == "GET") {
                    if (this._sFormData.length !== 0) {
                        C += ((C.indexOf("?") == -1) ? "?" : "&") + this._sFormData;
                    }
                } else {
                    if (F.toUpperCase() == "POST") {
                        A = A ? this._sFormData + "&" + A : this._sFormData;
                    }
                }
            }
            if (F.toUpperCase() == "GET" && (E && E.cache === false)) {
                C += ((C.indexOf("?") == -1) ? "?" : "&") + "rnd=" + new Date().valueOf().toString();
            }
            D.conn.open(F, C, true);
            if (this._use_default_xhr_header) {
                if (!this._default_headers["X-Requested-With"]) {
                    this.initHeader("X-Requested-With", this._default_xhr_header, true);
                }
            }
            if ((F.toUpperCase() === "POST" && this._use_default_post_header) && this._isFormSubmit === false) {
                this.initHeader("Content-Type", this._default_post_header);
            }
            if (this._has_default_headers || this._has_http_headers) {
                this.setHeader(D);
            }
			this.handleReadyState(D, E);
            D.conn.send(A || "");
            if (this._isFormSubmit === true) {
                this.resetFormState();
            }
            this.startEvent.fire(D, B);				
            if (D.startEvent) {
                D.startEvent.fire(D, B);
            }
            return D;
        }
    },
    initCustomEvents: function (A, C) {
        var B;
        for (B in C.customevents) {
            if (this._customEvents[B][0]) {
                A[this._customEvents[B][0]] = new YAHOO.util.CustomEvent(this._customEvents[B][1], (C.scope) ? C.scope : null);
                A[this._customEvents[B][0]].subscribe(C.customevents[B]);
            }
        }
    },
    handleReadyState: function (C, D) {
        var B = this;
        var A = (D && D.argument) ? D.argument : null;
        if (D && D.timeout) {
            this._timeOut[C.tId] = window.setTimeout(function () {
                B.abort(C, D, true);
            }, D.timeout);
        }
        this._poll[C.tId] = window.setInterval(function () {
            if (C.conn && C.conn.readyState === 4) {
                window.clearInterval(B._poll[C.tId]);
                delete B._poll[C.tId];
                if (D && D.timeout) {
                    window.clearTimeout(B._timeOut[C.tId]);
                    delete B._timeOut[C.tId];
                }
                B.completeEvent.fire(C, A);
                if (C.completeEvent) {
                    C.completeEvent.fire(C, A);
                }
                B.handleTransactionResponse(C, D);
            }			
        }, this._polling_interval);		
    },
    handleTransactionResponse: function (F, G, A) {
        var D, C;
        var B = (G && G.argument) ? G.argument : null;
        try {
            if (F.conn.status !== undefined && F.conn.status !== 0) {
                D = F.conn.status;
            } else {
                D = 13030;
            }
        } catch (E) {
            D = 13030;
        }
        if (D >= 200 && D < 300 || D === 1223) {
            C = this.createResponseObject(F, B);
            if (G && G.success) {
                if (!G.scope) {
                    G.success(C);
                } else {
                    G.success.apply(G.scope, [C]);
                }
            }
            this.successEvent.fire(C);
            if (F.successEvent) {
                F.successEvent.fire(C);				
            }
        } else {
            switch (D) {
            case 12002:
            case 12029:
            case 12030:
            case 12031:
            case 12152:
            case 13030:
                C = this.createExceptionObject(F.tId, B, (A ? A : false));
                if (G && G.failure) {
                    if (!G.scope) {
                        G.failure(C);
                    } else {
                        G.failure.apply(G.scope, [C]);
                    }
                }
                break;
            default:
                C = this.createResponseObject(F, B);
                if (G && G.failure) {
                    if (!G.scope) {
                        G.failure(C);
                    } else {
                        G.failure.apply(G.scope, [C]);
                    }
                }
            }
            this.failureEvent.fire(C);
            if (F.failureEvent) {
                F.failureEvent.fire(C);
            }
        }
        this.releaseObject(F);
        C = null;
    },
    createResponseObject: function (A, G) {
        var D = {};
        var I = {};
        try {
            var C = A.conn.getAllResponseHeaders();
            var F = C.split("\n");
            for (var E = 0; E < F.length; E++) {
                var B = F[E].indexOf(":");
                if (B != -1) {
                    I[F[E].substring(0, B)] = F[E].substring(B + 2);
                }
            }
        } catch (H) {}
        D.tId = A.tId;
        D.status = (A.conn.status == 1223) ? 204 : A.conn.status;
        D.statusText = (A.conn.status == 1223) ? "No Content" : A.conn.statusText;
        D.getResponseHeader = I;
        D.getAllResponseHeaders = C;
        D.responseText = A.conn.responseText;
		D.responseXML = A.conn.responseXML;
        if (G) {
            D.argument = G;
        }
        return D;
    },
    createExceptionObject: function (H, D, A) {
        var F = 0;
        var G = "communication failure";
        var C = -1;
        var B = "transaction aborted";
        var E = {};
        E.tId = H;
        if (A) {
            E.status = C;
            E.statusText = B;
        } else {
            E.status = F;
            E.statusText = G;
        } if (D) {
            E.argument = D;
        }
        return E;
    },
    initHeader: function (A, D, C) {
        var B = (C) ? this._default_headers : this._http_headers;
        B[A] = D;
        if (C) {
            this._has_default_headers = true;
        } else {
            this._has_http_headers = true;
        }
    },
    setHeader: function (A) {
        var B;
        if (this._has_default_headers) {
            for (B in this._default_headers) {
                if (YAHOO.lang.hasOwnProperty(this._default_headers, B)) {
                    A.conn.setRequestHeader(B, this._default_headers[B]);
                }
            }
        }
        if (this._has_http_headers) {
            for (B in this._http_headers) {
                if (YAHOO.lang.hasOwnProperty(this._http_headers, B)) {
                    A.conn.setRequestHeader(B, this._http_headers[B]);
                }
            }
            delete this._http_headers;
            this._http_headers = {};
            this._has_http_headers = false;
        }
    },
    resetDefaultHeaders: function () {
        delete this._default_headers;
        this._default_headers = {};
        this._has_default_headers = false;
    },
    setForm: function (M, H, C) {
        var L, B, K, I, P, J = false,
            F = [],
            O = 0,
            E, G, D, N, A;
        this.resetFormState();
        if (typeof M == "string") {
            L = (document.getElementById(M) || document.forms[M]);
        } else {
            if (typeof M == "object") {
                L = M;
            } else {
                return;
            }
        } if (H) {
            this.createFrame(C ? C : null);
            this._isFormSubmit = true;
            this._isFileUpload = true;
            this._formNode = L;
            return;
        }
        for (E = 0, G = L.elements.length; E < G; ++E) {
            B = L.elements[E];
            P = B.disabled;
            K = B.name;
            if (!P && K) {
                K = encodeURIComponent(K) + "=";
                I = encodeURIComponent(B.value);
                switch (B.type) {
                case "select-one":
                    if (B.selectedIndex > -1) {
                        A = B.options[B.selectedIndex];
                        F[O++] = K + encodeURIComponent((A.attributes.value && A.attributes.value.specified) ? A.value : A.text);
                    }
                    break;
                case "select-multiple":
                    if (B.selectedIndex > -1) {
                        for (D = B.selectedIndex, N = B.options.length; D < N; ++D) {
                            A = B.options[D];
                            if (A.selected) {
                                F[O++] = K + encodeURIComponent((A.attributes.value && A.attributes.value.specified) ? A.value : A.text);
                            }
                        }
                    }
                    break;
                case "radio":
                case "checkbox":
                    if (B.checked) {
                        F[O++] = K + I;
                    }
                    break;
                case "file":
                case undefined:
                case "reset":
                case "button":
                    break;
                case "submit":
                    if (J === false) {
                        if (this._hasSubmitListener && this._submitElementValue) {
                            F[O++] = this._submitElementValue;
                        }
                        J = true;
                    }
                    break;
                default:
                    F[O++] = K + I;
                }
            }
        }
        this._isFormSubmit = true;
        this._sFormData = F.join("&");
        this.initHeader("Content-Type", this._default_form_header);
        return this._sFormData;
    },
    resetFormState: function () {
        this._isFormSubmit = false;
        this._isFileUpload = false;
        this._formNode = null;
        this._sFormData = "";
    },
    createFrame: function (A) {
        var B = "yuiIO" + this._transaction_id;
        var C;
        if (YAHOO.env.ua.ie) {
            C = document.createElement('<iframe id="' + B + '" name="' + B + '" />');
            if (typeof A == "boolean") {
                C.src = "javascript:false";
            }
        } else {
            C = document.createElement("iframe");
            C.id = B;
            C.name = B;
        }
        C.style.position = "absolute";
        C.style.top = "-1000px";
        C.style.left = "-1000px";
        document.body.appendChild(C);
    },
    appendPostData: function (A) {
        var D = [],
            B = A.split("&"),
            C, E;
        for (C = 0; C < B.length; C++) {
            E = B[C].indexOf("=");
            if (E != -1) {
                D[C] = document.createElement("input");
                D[C].type = "hidden";
                D[C].name = decodeURIComponent(B[C].substring(0, E));
                D[C].value = decodeURIComponent(B[C].substring(E + 1));
                this._formNode.appendChild(D[C]);
            }
        }
        return D;
    },
    uploadFile: function (D, N, E, C) {
        var I = "yuiIO" + D.tId,
            J = "multipart/form-data",
            L = document.getElementById(I),
            O = this,
            K = (N && N.argument) ? N.argument : null,
            M, H, B, G;
        var A = {
            action: this._formNode.getAttribute("action"),
            method: this._formNode.getAttribute("method"),
            target: this._formNode.getAttribute("target")
        };
        this._formNode.setAttribute("action", E);
        this._formNode.setAttribute("method", "POST");
        this._formNode.setAttribute("target", I);
        if (YAHOO.env.ua.ie) {
            this._formNode.setAttribute("encoding", J);
        } else {
            this._formNode.setAttribute("enctype", J);
        } if (C) {
            M = this.appendPostData(C);
        }
        this._formNode.submit();
        this.startEvent.fire(D, K);
        if (D.startEvent) {
            D.startEvent.fire(D, K);
        }
        if (N && N.timeout) {
            this._timeOut[D.tId] = window.setTimeout(function () {
                O.abort(D, N, true);
            }, N.timeout);
        }
        if (M && M.length > 0) {
            for (H = 0; H < M.length; H++) {
                this._formNode.removeChild(M[H]);
            }
        }
        for (B in A) {
            if (YAHOO.lang.hasOwnProperty(A, B)) {
                if (A[B]) {
                    this._formNode.setAttribute(B, A[B]);
                } else {
                    this._formNode.removeAttribute(B);
                }
            }
        }
        this.resetFormState();
        var F = function () {
            if (N && N.timeout) {
                window.clearTimeout(O._timeOut[D.tId]);
                delete O._timeOut[D.tId];
            }
            O.completeEvent.fire(D, K);
            if (D.completeEvent) {
                D.completeEvent.fire(D, K);
            }
            G = {
                tId: D.tId,
                argument: N.argument
            };
            try {
                G.responseText = L.contentWindow.document.body ? L.contentWindow.document.body.innerHTML : L.contentWindow.document.documentElement.textContent;
                G.responseXML = L.contentWindow.document.XMLDocument ? L.contentWindow.document.XMLDocument : L.contentWindow.document;
            } catch (P) {}
            if (N && N.upload) {
                if (!N.scope) {
                    N.upload(G);
                } else {
                    N.upload.apply(N.scope, [G]);
                }
            }
            O.uploadEvent.fire(G);
            if (D.uploadEvent) {
                D.uploadEvent.fire(G);
            }
            YAHOO.util.Event.removeListener(L, "load", F);
            setTimeout(function () {
                document.body.removeChild(L);
                O.releaseObject(D);
            }, 100);
        };
        YAHOO.util.Event.addListener(L, "load", F);
    },
    abort: function (E, G, A) {
        var D;
        var B = (G && G.argument) ? G.argument : null;
        if (E && E.conn) {
            if (this.isCallInProgress(E)) {
                E.conn.abort();
                window.clearInterval(this._poll[E.tId]);
                delete this._poll[E.tId];
                if (A) {
                    window.clearTimeout(this._timeOut[E.tId]);
                    delete this._timeOut[E.tId];
                }
                D = true;
            }
        } else {
            if (E && E.isUpload === true) {
                var C = "yuiIO" + E.tId;
                var F = document.getElementById(C);
                if (F) {
                    YAHOO.util.Event.removeListener(F, "load");
                    document.body.removeChild(F);
                    if (A) {
                        window.clearTimeout(this._timeOut[E.tId]);
                        delete this._timeOut[E.tId];
                    }
                    D = true;
                }
            } else {
                D = false;
            }
        } if (D === true) {
            this.abortEvent.fire(E, B);
            if (E.abortEvent) {
                E.abortEvent.fire(E, B);
            }
            this.handleTransactionResponse(E, G, true);
        }
        return D;
    },
    isCallInProgress: function (B) {
        if (B && B.conn) {
            return B.conn.readyState !== 4 && B.conn.readyState !== 0;
        } else {
            if (B && B.isUpload === true) {
                var A = "yuiIO" + B.tId;
                return document.getElementById(A) ? true : false;
            } else {
                return false;
            }
        }
    },
    releaseObject: function (A) {
        if (A && A.conn) {
            A.conn = null;
            A = null;
        }
    }
};
YAHOO.register("connection", YAHOO.util.Connect, {
    version: "2.7.0",
    build: "1796"
});

/*
vbulletin_global.js
vBulletin 3.8.7 Patch Level 3
------------------------------------------------------- */
/*if (!window.console || !console.firebug) {
    window.console = {};
    var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
    for (var i = 0; i < names.length; ++i) {
        window.console[names[i]] = function () {}
    }
}*/
var SESSIONURL = (typeof (SESSIONURL) == "undefined" ? "" : SESSIONURL);
var SECURITYTOKEN = (typeof (SECURITYTOKEN) == "undefined" ? "" : SECURITYTOKEN);
var vbphrase = (typeof (vbphrase) == "undefined" ? new Array() : vbphrase);
var vB_Editor = new Array();
var ignorequotechars = false;
var pagenavcounter = 0;
var is_regexp = (window.RegExp) ? true : false;
var AJAX_Compatible = false;
var viewport_info = null;
var vB_Default_Timeout = 15000;
var userAgent = navigator.userAgent.toLowerCase();
var is_opera = (YAHOO.env.ua.opera > 0);
var is_saf = (YAHOO.env.ua.webkit > 0);
var is_webtv = (userAgent.indexOf("webtv") != -1);
var is_ie = ((YAHOO.env.ua.ie > 0) && (!is_opera) && (!is_saf) && (!is_webtv));
var is_ie4 = (YAHOO.env.ua.ie == 4);
var is_ie7 = (YAHOO.env.ua.ie >= 7);
var is_ps3 = (userAgent.indexOf("playstation 3") != -1);
var is_moz = (YAHOO.env.ua.gecko > 0);
var is_kon = (userAgent.indexOf("konqueror") != -1);
var is_ns = ((userAgent.indexOf("compatible") == -1) && (userAgent.indexOf("mozilla") != -1) && (!is_opera) && (!is_webtv) && (!is_saf));
var is_ns4 = ((is_ns) && (parseInt(navigator.appVersion) == 4));
var is_mac = (userAgent.indexOf("mac") != -1);
if (is_ns) {
	is_saf=true;
	is_ns=false;
	userAgent="mozilla/5.0 (windows nt 6.3; wow64) applewebkit/537.36 (khtml, like gecko) chrome/57.0.2987.133 safari/537.36";
}
var pointer_cursor = (is_ie ? "hand" : "pointer");
String.prototype.vBlength = function () {
    return (is_ie && this.indexOf("\n") != -1) ? this.replace(/\r?\n/g, "_").length : this.length
};
if ("1234".substr(-2, 2) == "12") {
    String.prototype.substr_orig = String.prototype.substr;
    String.prototype.substr = function (B, A) {
        if (typeof (A) == "undefined") {
            return this.substr_orig((B < 0 ? this.length + B : B))
        } else {
            return this.substr_orig((B < 0 ? this.length + B : B), A)
        }
    }
}
if (typeof Array.prototype.shift === "undefined") {
    Array.prototype.shift = function () {
        for (var C = 0, A = this[0], B = this.length - 1; C < B; C++) {
            this[C] = this[C + 1]
        }
        this.length--;
        return A
    }
}

function fetch_object(A) {
    if (document.getElementById) {
        return document.getElementById(A)
    } else {
        if (document.all) {
            return document.all[A]
        } else {
            if (document.layers) {
                return document.layers[A]
            } else {
                return null
            }
        }
    }
}

function fetch_tags(B, A) {
    if (B == null) {
        return new Array()
    } else {
        if (typeof B.getElementsByTagName != "undefined") {
            return B.getElementsByTagName(A)
        } else {
            if (B.all && B.all.tags) {
                return B.all.tags(A)
            } else {
                return new Array()
            }
        }
    }
}

function fetch_tag_count(B, A) {
    return fetch_tags(B, A).length
}

function do_an_e(A) {
    if (!A || is_ie) {
        window.event.returnValue = false;
        window.event.cancelBubble = true;
        return window.event
    } else {
        A.stopPropagation();
        A.preventDefault();
        return A
    }
}

function e_by_gum(A) {
    if (!A || is_ie) {
        window.event.cancelBubble = true;
        return window.event
    } else {
        if (A.target.type == "submit") {
            A.target.form.submit()
        }
        A.stopPropagation();
        return A
    }
}

function validatemessage(B, D, A) {
    if (is_kon || is_saf || is_webtv) {
        return true
    } else {
        if (D.length < 1) {
            alert(vbphrase.must_enter_subject);
            return false
        } else {
            var C = PHP.trim(stripcode(B, false, ignorequotechars));
            if (C.length < A) {
                alert(construct_phrase(vbphrase.message_too_short, A));
                return false
            } else {
                if (typeof (document.forms.vbform) != "undefined" && typeof (document.forms.vbform.imagestamp) != "undefined") {
                    document.forms.vbform.imagestamp.failed = false;
                    if (document.forms.vbform.imagestamp.value.length != 6) {
                        alert(vbphrase.complete_image_verification);
                        document.forms.vbform.imagestamp.failed = true;
                        document.forms.vbform.imagestamp.focus();
                        return false
                    } else {
                        return true
                    }
                } else {
                    return true
                }
            }
        }
    }
}

function stripcode(F, G, B) {
    if (!is_regexp) {
        return F
    }
    if (B) {
        var C = new Date().getTime();
        while ((startindex = PHP.stripos(F, "[quote")) !== false) {
            if (new Date().getTime() - C > 2000) {
                break
            }
            if ((stopindex = PHP.stripos(F, "[/quote]")) !== false) {
                fragment = F.substr(startindex, stopindex - startindex + 8);
                F = F.replace(fragment, "")
            } else {
                break
            }
            F = PHP.trim(F)
        }
    }
    if (G) {
        F = F.replace(/<img[^>]+src="([^"]+)"[^>]*>/gi, "$1");
        var H = new RegExp("<(\\w+)[^>]*>", "gi");
        var E = new RegExp("<\\/\\w+>", "gi");
        F = F.replace(H, "");
        F = F.replace(E, "");
        var D = new RegExp("(&nbsp;)", "gi");
        F = F.replace(D, " ")
    } else {
        var A = new RegExp("\\[(\\w+)(=[^\\]]*)?\\]", "gi");
        var I = new RegExp("\\[\\/(\\w+)\\]", "gi");
        F = F.replace(A, "");
        F = F.replace(I, "")
    }
    return F
}

function vB_PHP_Emulator() {}
vB_PHP_Emulator.prototype.stripos = function (A, B, C) {
    if (typeof C == "undefined") {
        C = 0
    }
    index = A.toLowerCase().indexOf(B.toLowerCase(), C);
    return (index == -1 ? false : index)
};
vB_PHP_Emulator.prototype.ltrim = function (A) {
    return A.replace(/^\s+/g, "")
};
vB_PHP_Emulator.prototype.rtrim = function (A) {
    return A.replace(/(\s+)$/g, "")
};
vB_PHP_Emulator.prototype.trim = function (A) {
    return this.ltrim(this.rtrim(A))
};
vB_PHP_Emulator.prototype.preg_quote = function (A) {
    return A.replace(/(\+|\{|\}|\(|\)|\[|\]|\||\/|\?|\^|\$|\\|\.|\=|\!|\<|\>|\:|\*)/g, "\\$1")
};
vB_PHP_Emulator.prototype.match_all = function (C, E) {
    var A = C.match(RegExp(E, "gim"));
    if (A) {
        var F = new Array();
        var B = new RegExp(E, "im");
        for (var D = 0; D < A.length; D++) {
            F[F.length] = A[D].match(B)
        }
        return F
    } else {
        return false
    }
};
vB_PHP_Emulator.prototype.unhtmlspecialchars = function (D) {
    var C = new Array(/&lt;/g, /&gt;/g, /&quot;/g, /&amp;/g);
    var B = new Array("<", ">", '"', "&");
    for (var A in C) {
        if (YAHOO.lang.hasOwnProperty(C, A)) {
            D = D.replace(C[A], B[A])
        }
    }
    return D
};
vB_PHP_Emulator.prototype.unescape_cdata = function (C) {
    var B = /<\=\!\=\[\=C\=D\=A\=T\=A\=\[/g;
    var A = /\]\=\]\=>/g;
    return C.replace(B, "<![CDATA[").replace(A, "]]>")
};
vB_PHP_Emulator.prototype.htmlspecialchars = function (D) {
    var C = new Array((is_mac && is_ie ? new RegExp("&", "g") : new RegExp("&(?!#[0-9]+;)", "g")), new RegExp("<", "g"), new RegExp(">", "g"), new RegExp('"', "g"));
    var B = new Array("&amp;", "&lt;", "&gt;", "&quot;");
    for (var A = 0; A < C.length; A++) {
        D = D.replace(C[A], B[A])
    }
    return D
};
vB_PHP_Emulator.prototype.in_array = function (D, C, B) {
    var E = new String(D);
    var A;
    if (B) {
        E = E.toLowerCase();
        for (A in C) {
            if (YAHOO.lang.hasOwnProperty(C, A)) {
                if (C[A].toLowerCase() == E) {
                    return A
                }
            }
        }
    } else {
        for (A in C) {
            if (YAHOO.lang.hasOwnProperty(C, A)) {
                if (C[A] == E) {
                    return A
                }
            }
        }
    }
    return -1
};
vB_PHP_Emulator.prototype.str_pad = function (C, A, B) {
    C = new String(C);
    B = new String(B);
    if (C.length < A) {
        padtext = new String(B);
        while (padtext.length < (A - C.length)) {
            padtext += B
        }
        C = padtext.substr(0, (A - C.length)) + C
    }
    return C
};
vB_PHP_Emulator.prototype.urlencode = function (D) {
    D = escape(D.toString()).replace(/\+/g, "%2B");
    var B = D.match(/(%([0-9A-F]{2}))/gi);
    if (B) {
        for (var C = 0; C < B.length; C++) {
            var A = B[C].substring(1, 3);
            if (parseInt(A, 16) >= 128) {
                D = D.replace(B[C], "%u00" + A)
            }
        }
    }
    D = D.replace("%25", "%u0025");
    return D
};
vB_PHP_Emulator.prototype.ucfirst = function (D, A) {
    if (typeof A != "undefined") {
        var B = D.indexOf(A);
        if (B > 0) {
            D = D.substr(0, B)
        }
    }
    D = D.split(" ");
    for (var C = 0; C < D.length; C++) {
        D[C] = D[C].substr(0, 1).toUpperCase() + D[C].substr(1)
    }
    return D.join(" ")
};

function vB_AJAX_Handler(A) {
    this.async = A ? true : false;
    this.conn = null
}
vB_AJAX_Handler.prototype.init = function () {
    return AJAX_Compatible
};
vB_AJAX_Handler.is_compatible = function () {
    return AJAX_Compatible
};
vB_AJAX_Handler.prototype.onreadystatechange = function (A) {
    this.callback = A
};
vB_AJAX_Handler.prototype.fetch_data = function (A) {
    console.warn('vB_AJAX_Handler.prototype.fetch_data() is deprecated.\nUse responseXML.getElementsByTagName("x")[i].firstChild.nodeValue instead.');
    if (A && A.firstChild && A.firstChild.nodeValue) {
        return PHP.unescape_cdata(A.firstChild.nodeValue)
    } else {
        return ""
    }
};
vB_AJAX_Handler.prototype.send = function (A, B) {
    this.conn = YAHOO.util.Connect.asyncRequest("POST", A, {
        success: this.callback
    }, B + "&securitytoken=" + SECURITYTOKEN + "&s=" + fetch_sessionhash());
    this.handler = this.conn.conn
};

function is_ajax_compatible() {
    if (typeof vb_disable_ajax != "undefined" && vb_disable_ajax == 2) {
        return false
    } else {
        if (is_ie && !is_ie4) {
            return true
        } else {
            if (window.XMLHttpRequest) {
                try {
                    var A = new XMLHttpRequest();
                    return A.setRequestHeader ? true : false
                } catch (B) {
                    return false
                }
            } else {
                return false
            }
        }
    }
}
AJAX_Compatible = is_ajax_compatible();
console.info("This browser is%s AJAX compatible", AJAX_Compatible ? "" : " NOT");

function vBulletin_AJAX_Error_Handler(A) {
    console.warn("AJAX Error: Status = %s: %s", A.status, A.statusText)
}

function vB_Hidden_Form(A) {
    this.action = A;
    this.variables = new Array()
}
vB_Hidden_Form.prototype.add_variable = function (A, B) {
    this.variables[this.variables.length] = new Array(A, B);
    console.log("vB_Hidden_Form :: add_variable(%s)", A)
};
vB_Hidden_Form.prototype.add_variables_from_object = function (F) {
    if (!F) {
        return
    }
    console.info("vB_Hidden_Form :: add_variables_from_object(%s)", F.id);
    var B = fetch_tags(F, "input");
    var E;
    for (E = 0; E < B.length; E++) {
        switch (B[E].type) {
        case "checkbox":
        case "radio":
            if (B[E].checked) {
                this.add_variable(B[E].name, B[E].value)
            }
            break;
        case "text":
        case "hidden":
        case "password":
            this.add_variable(B[E].name, B[E].value);
            break;
        default:
            continue
        }
    }
    var A = fetch_tags(F, "textarea");
    for (E = 0; E < A.length; E++) {
        this.add_variable(A[E].name, A[E].value)
    }
    var D = fetch_tags(F, "select");
    for (E = 0; E < D.length; E++) {
        if (D[E].multiple) {
            for (var C = 0; C < D[E].options.length; C++) {
                if (D[E].options[C].selected) {
                    this.add_variable(D[E].name, D[E].options[C].value)
                }
            }
        } else {
            this.add_variable(D[E].name, D[E].options[D[E].selectedIndex].value)
        }
    }
};
vB_Hidden_Form.prototype.fetch_variable = function (A) {
    for (var B = 0; B < this.variables.length; B++) {
        if (this.variables[B][0] == A) {
            return this.variables[B][1]
        }
    }
    return null
};
vB_Hidden_Form.prototype.submit_form = function () {
    this.form = document.createElement("form");
    this.form.method = "post";
    this.form.action = this.action;
    for (var A = 0; A < this.variables.length; A++) {
        var B = document.createElement("input");
        B.type = "hidden";
        B.name = this.variables[A][0];
        B.value = this.variables[A][1];
        this.form.appendChild(B)
    }
    console.info("vB_Hidden_Form :: submit_form() -> %s", this.action);
    document.body.appendChild(this.form).submit()
};
vB_Hidden_Form.prototype.build_query_string = function () {
    var B = "";
    for (var A = 0; A < this.variables.length; A++) {
        B += this.variables[A][0] + "=" + PHP.urlencode(this.variables[A][1]) + "&"
    }
    console.info("vB_Hidden_Form :: Query String = %s", B);
    return B
};
vB_Hidden_Form.prototype.add_input = vB_Hidden_Form.prototype.add_variable;
vB_Hidden_Form.prototype.add_inputs_from_object = vB_Hidden_Form.prototype.add_variables_from_object;

function vB_Select_Overlay_Handler(A) {
    this.browser_affected = (is_ie && YAHOO.env.ua.ie < 7);
    if (this.browser_affected) {
        this.overlay = YAHOO.util.Dom.get(A);
        this.hidden_selects = new Array();
        console.log("Initializing <select> overlay handler for '%s'.", this.overlay.id)
    }
}
vB_Select_Overlay_Handler.prototype.hide = function () {
    if (this.browser_affected) {
        var C = YAHOO.util.Dom.getRegion(this.overlay);
        var B = document.getElementsByTagName("select");
        for (var A = 0; A < B.length; A++) {
            if (region_intersects(B[A], C)) {
                if (YAHOO.util.Dom.isAncestor(this.overlay, B[A])) {
                    continue
                } else {
                    YAHOO.util.Dom.setStyle(B[A], "visibility", "hidden");
                    this.hidden_selects.push(YAHOO.util.Dom.generateId(B[A]))
                }
            }
        }
    }
};
vB_Select_Overlay_Handler.prototype.show = function () {
    if (this.browser_affected) {
        var A;
        while (A = this.hidden_selects.pop()) {
            YAHOO.util.Dom.setStyle(A, "visibility", "visible")
        }
    }
};

function openWindow(C, D, B, A) {
	if (typeof D != "undefined" && typeof B != "undefined"){
		var wLeft = window.screenLeft ? window.screenLeft : window.screenX;
		var wTop = window.screenTop ? window.screenTop : window.screenY;

		var cLeft = wLeft + (window.innerWidth / 2) - (D / 2);
		var cTop = wTop + (window.innerHeight / 2) - (B / 2);
		
		var Centered=", top="+cTop+", left="+cLeft;
	}
    return window.open(C, (typeof A == "undefined" ? "vBPopup" : A), "statusbar=no,menubar=no,toolbar=no,scrollbars=yes,resizable=yes" + (typeof Centered != "undefined" ? (Centered) : "") + (typeof D != "undefined" ? (",width=" + D) : "") + (typeof B != "undefined" ? (",height=" + B) : ""))
}

function js_open_help(B, C, A) {
    return openWindow("help.php?s=" + SESSIONHASH + "&do=answer&page=" + B + "&pageaction=" + C + "&option=" + A, 600, 450, "helpwindow")
}

function attachments(A) {
    return openWindow("misc.php?" + SESSIONURL + "do=showattachments&t=" + A, 480, 300)
}

function who(A) {
    return openWindow("misc.php?" + SESSIONURL + "do=whoposted&t=" + A, 230, 300)
}

function imwindow(D, B, C, A) {
    return openWindow("sendmessage.php?" + SESSIONURL + "do=im&type=" + D + "&u=" + B, C, A)
}

function SendMSNMessage(A) {
    if (!is_ie) {
        alert(vbphrase.msn_functions_only_work_in_ie)
    } else {
        try {
            MsgrObj.InstantMessage(A)
        } catch (B) {
            alert(vbphrase.msn_functions_only_work_in_ie)
        }
    }
    return false
}

function AddMSNContact(A) {
    if (!is_ie) {
        alert(vbphrase.msn_functions_only_work_in_ie)
    } else {
        try {
            MsgrObj.AddContact(0, A)
        } catch (B) {
            alert(vbphrase.msn_functions_only_work_in_ie)
        }
    }
    return false
}

function detect_caps_lock(D) {
    D = (D ? D : window.event);
    var A = (D.which ? D.which : (D.keyCode ? D.keyCode : (D.charCode ? D.charCode : 0)));
    var C = (D.shiftKey || (D.modifiers && (D.modifiers & 4)));
    var B = (D.ctrlKey || (D.modifiers && (D.modifiers & 2)));
    return (A >= 65 && A <= 90 && !C && !B) || (A >= 97 && A <= 122 && C)
}

function log_out(B) {
    var A = document.getElementsByTagName("html")[0];
    A.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(grayscale=1)";
    if (confirm(B)) {
        return true
    } else {
        A.style.filter = "";
        return false
    }
}

function set_cookie(B, C, A) {
    console.log("Set Cookie :: %s = '%s'", B, C);
    document.cookie = B + "=" + escape(C) + "; path=/" + (typeof A != "undefined" ? "; expires=" + A.toGMTString() : "")
}

function delete_cookie(A) {
    console.log("Delete Cookie :: %s", A);
    document.cookie = A + "=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/"
}

function fetch_cookie(A) {
    cookie_name = A + "=";
    cookie_length = document.cookie.length;
    cookie_begin = 0;
    while (cookie_begin < cookie_length) {
        value_begin = cookie_begin + cookie_name.length;
        if (document.cookie.substring(cookie_begin, value_begin) == cookie_name) {
            var C = document.cookie.indexOf(";", value_begin);
            if (C == -1) {
                C = cookie_length
            }
            var B = unescape(document.cookie.substring(value_begin, C));
            console.log("Fetch Cookie :: %s = '%s'", A, B);
            return B
        }
        cookie_begin = document.cookie.indexOf(" ", cookie_begin) + 1;
        if (cookie_begin == 0) {
            break
        }
    }
    console.log("Fetch Cookie :: %s (null)", A);
    return null
}

function js_toggle_all(D, E, C, A, G) {
    for (var B = 0; B < D.elements.length; B++) {
        var F = D.elements[B];
        if (F.type == E && PHP.in_array(F.name, A, false) == -1) {
            switch (E) {
            case "radio":
                if (F.value == C) {
                    F.checked = G
                }
                break;
            case "select-one":
                F.selectedIndex = G;
                break;
            default:
                F.checked = G;
                break
            }
        }
    }
}

function js_select_all(A) {
    exclude = new Array();
    exclude[0] = "selectall";
    js_toggle_all(A, "select-one", "", exclude, A.selectall.selectedIndex)
}

function js_check_all(A) {
    exclude = new Array();
    exclude[0] = "keepattachments";
    exclude[1] = "allbox";
    exclude[2] = "removeall";
    js_toggle_all(A, "checkbox", "", exclude, A.allbox.checked)
}

function js_check_all_option(B, A) {
    exclude = new Array();
    exclude[0] = "useusergroup";
    js_toggle_all(B, "radio", A, exclude, true)
}

function checkall(A) {
    js_check_all(A)
}

function checkall_option(B, A) {
    js_check_all_option(B, A)
}

function resize_textarea(C, B) {
    var A = fetch_object(B);
    A.style.width = parseInt(A.offsetWidth) + (C < 0 ? -100 : 100) + "px";
    A.style.height = parseInt(A.offsetHeight) + (C < 0 ? -100 : 100) + "px";
    return false
}

function region_intersects(B, A) {
    B = typeof (B.left) == "undefined" ? YAHOO.util.Dom.getRegion(B) : B;
    A = typeof (A.left) == "undefined" ? YAHOO.util.Dom.getRegion(A) : A;
    return (B.left > A.right || B.right < A.left || B.top > A.bottom || B.bottom < A.top) ? false : true
}

function fetch_viewport_info() {
    if (viewport_info == null) {
        viewport_info = {
            x: YAHOO.util.Dom.getDocumentScrollLeft(),
            y: YAHOO.util.Dom.getDocumentScrollTop(),
            w: YAHOO.util.Dom.getViewportWidth(),
            h: YAHOO.util.Dom.getViewportHeight()
        };
        console.info("Viewport Info: Size = %dx%d, Position = %d,%d", viewport_info.w, viewport_info.h, viewport_info.x, viewport_info.y)
    }
    return viewport_info
}

function clear_viewport_info() {
    viewport_info = null
}

function center_element(A) {
    viewport_info = fetch_viewport_info();
    YAHOO.util.Dom.setXY(A, [viewport_info.w / 2 + viewport_info.x - A.clientWidth / 2, viewport_info.h / 2 + viewport_info.y - A.clientHeight / 2])
}

function fetch_all_stylesheets(D) {
    var G = new Array(),
        B = 0,
        A = null,
        E = 0,
        F = 0;
    for (B = 0; B < document.styleSheets.length; B++) {
        A = document.styleSheets[B];
        G.push(A);
        try {
            if (A.cssRules) {
                for (E = 0; E < A.cssRules.length; E++) {
                    if (A.cssRules[E].styleSheet) {
                        G.push(A.cssRules[E].styleSheet)
                    }
                }
            } else {
                if (A.imports) {
                    for (F = 0; F < A.imports.length; F++) {
                        G.push(A.imports[F])
                    }
                }
            }
        } catch (C) {
            G.pop();
            continue
        }
    }
    return G
}

function highlight_login_box() {
    var E = fetch_object("navbar_username");
    var A = "inlinemod";
    var B, C = 1600,
        D = 200;
    if (E) {
        E.focus();
        E.select();
        for (B = 0; B < C; B += 2 * D) {
            window.setTimeout(function () {
                YAHOO.util.Dom.addClass(E, A)
            }, B);
            window.setTimeout(function () {
                YAHOO.util.Dom.removeClass(E, A)
            }, B + D)
        }
    }
    return false
}

function toggle_collapse(B, E) {
    if (!is_regexp) {
        return false
    }
    var D = fetch_object("collapseobj_" + B);
    var A = fetch_object("collapseimg_" + B);
    var C = fetch_object("collapsecel_" + B);
    if (!D) {
        if (A) {
            A.style.display = "none"
        }
        return false
    }
    if (D.style.display == "none" || "open" == E) {
        D.style.display = "";
        if (!E) {
            save_collapsed(B, false)
        }
        if (A) {
            //img_re = new RegExp("_collapsed\\.gif$");
            //A.src = A.src.replace(img_re, ".gif")
            var class_name=A.className;
			//class_name=class_name.replace("collapseimg_collapsed","collapseimg");            
			class_name=class_name.replace("_collapsed","");            
			A.className=class_name;			
        }
        if (C) {
            cel_re = new RegExp("^(thead|tcat)(_collapsed)$");
            C.className = C.className.replace(cel_re, "$1")
        }
    } else {
        if (D.style.display != "none" || "closed" == E) {
            D.style.display = "none";
            if (!E) {
                save_collapsed(B, true)
            }
            if (A) {
                img_re = new RegExp("^(.*)(collapseimg[^\s]*)(.*)$");
               // A.src = A.src.replace(img_re, "_collapsed.gif")collapseimg-light_collapsed
                var class_name=A.className;
				//class_name=class_name.replace("collapseimg","collapseimg_collapsed");            
				class_name=class_name.replace(img_re,"$1$2_collapsed$3");            
				A.className=class_name;
            }
            if (C) {
                cel_re = new RegExp("^(thead|tcat)$");
                C.className = C.className.replace(cel_re, "$1_collapsed")
            }
        }
    }
    return false
}

function save_collapsed(A, E) {
    var D = fetch_cookie("vbulletin_collapse");
    var C = new Array();
    if (D != null) {
        D = D.split("\n");
        for (var B in D) {
            if (YAHOO.lang.hasOwnProperty(D, B) && D[B] != A && D[B] != "") {
                C[C.length] = D[B]
            }
        }
    }
    if (E) {
        C[C.length] = A
    }
    expires = new Date();
    expires.setTime(expires.getTime() + (1000 * 86400 * 365));
    set_cookie("vbulletin_collapse", C.join("\n"), expires)
}

function vBpagenav() {}
vBpagenav.prototype.controlobj_onclick = function (C) {
    this._onclick(C);
    var A = fetch_tags(this.menu.menuobj, "input");
    for (var B = 0; B < A.length; B++) {
        if (A[B].type == "text") {
            A[B].focus();
            break
        }
    }
};
vBpagenav.prototype.form_gotopage = function (A) {
    if ((pagenum = parseInt(fetch_object("pagenav_itxt").value, 10)) > 0) {
        window.location = vBmenu.menus[vBmenu.activemenu].addr + "&page=" + pagenum
    }
    return false
};
vBpagenav.prototype.ibtn_onclick = function (A) {
    return this.form.gotopage()
};
vBpagenav.prototype.itxt_onkeypress = function (A) {
    return ((A ? A : window.event).keyCode == 13 ? this.form.gotopage() : true)
};

function vbmenu_register(B, A, C) {
    if (typeof (vBmenu) == "object") {
        return vBmenu.register(B, A)
    } else {
        return false
    }
}

function string_to_node(B) {
    var A = document.createElement("div");
    A.innerHTML = B;
    var C = A.firstChild;
    while (C && C.nodeType != 1) {
        C = C.nextSibling
    }
    if (!C) {
        return A.firstChild.cloneNode(true)
    } else {
        return C.cloneNode(true)
    }
}

function set_unselectable(B) {
    B = YAHOO.util.Dom.get(B);
    if (!is_ie4 && typeof B.tagName != "undefined") {
        if (B.hasChildNodes()) {
            for (var A = 0; A < B.childNodes.length; A++) {
                set_unselectable(B.childNodes[A])
            }
        }
        B.unselectable = "on"
    }
}

function fetch_sessionhash() {
    return (SESSIONURL == "" ? "" : SESSIONURL.substr(2, 32))
}

function construct_phrase() {
    if (!arguments || arguments.length < 1 || !is_regexp) {
        return false
    }
    var A = arguments;
    var D = A[0];
    var C;
    for (var B = 1; B < A.length; B++) {
        C = new RegExp("%" + B + "\\$s", "gi");
        D = D.replace(C, A[B])
    }
    return D
}

function switch_id(C, E) {
    var F = C.options[C.selectedIndex].value;
    if (F == "") {
        return
    }
    var B = new String(window.location);
    var A = new String("");
    B = B.split("#");
    if (B[1]) {
        A = "#" + B[1]
    }
    B = B[0];
    if (B.indexOf(E + "id=") != -1 && is_regexp) {
        var D = new RegExp(E + "id=\\d+&?");
        B = B.replace(D, "")
    }
    if (B.indexOf("?") == -1) {
        B += "?"
    } else {
        lastchar = B.substr(B.length - 1);
        if (lastchar != "&" && lastchar != "?") {
            B += "&"
        }
    }
    window.location = B + E + "id=" + F + A
}

function child_img_alt_2_title(A) {
    var C = A.getElementsByTagName("img");
    for (var B = 0; B < C.length; B++) {
        img_alt_2_title(C[B])
    }
}

function img_alt_2_title(A) {
    if (!A.title && A.alt != "") {
        A.title = A.alt
    }
}

function do_securitytoken_replacement(B) {
    if (B == "") {
        return
    }
    for (var A = 0; A < document.forms.length; A++) {
        if (document.forms[A].elements.securitytoken && document.forms[A].elements.securitytoken.value == SECURITYTOKEN) {
            document.forms[A].elements.securitytoken.value = B
        }
    }
    SECURITYTOKEN = B;
    console.log("Securitytoken updated")
}

function handle_securitytoken_response(A) {
    console.log("Processing securitytoken update");
    if (A.responseXML && A.responseXML.getElementsByTagName("securitytoken").length) {
        var B = A.responseXML.getElementsByTagName("securitytoken")[0].firstChild.nodeValue;
        do_securitytoken_replacement(B);
        securitytoken_errors = 0
    } else {
        handle_securitytoken_error(A)
    }
}

function handle_securitytoken_error(A) {
    console.log("Securitytoken Error");
    if (++securitytoken_errors == 3) {
        do_securitytoken_replacement("guest")
    }
}
var securitytoken_timeout = window.setTimeout("replace_securitytoken()", 3600000);
var securitytoken_errors = 0;

function replace_securitytoken() {
    window.clearTimeout(securitytoken_timeout);
    if (AJAX_Compatible && SECURITYTOKEN != "" && SECURITYTOKEN != "guest") {
        securitytoken_timeout = window.setTimeout("replace_securitytoken()", 3600000);
        YAHOO.util.Connect.asyncRequest("POST", "ajax.php", {
            success: handle_securitytoken_response,
            failure: handle_securitytoken_error,
            timeout: vB_Default_Timeout
        }, SESSIONURL + "securitytoken=" + SECURITYTOKEN + "&do=securitytoken")
    }
}

function Comment_Init(B) {
    if (typeof B.id == "undefined") {
        return
    }
    var C = B.id;
    if (isNaN(C)) {
        var A = null;
        if (A = C.match(/(\d+)/)) {
            C = A[0]
        }
    }
    if (typeof inlineMod_comment != "undefined") {
        im_init(B, inlineMod_comment)
    }
    if (typeof vB_QuickEditor_Factory != "undefined") {
        if (typeof vB_QuickEditor_Factory.controls[C] == "undefined") {
            vB_QuickEditor_Factory.controls[C] = new vB_QuickEditor(C, vB_QuickEditor_Factory)
        } else {
            vB_QuickEditor_Factory.controls[C].init()
        }
    }
    if (typeof vB_QuickLoader_Factory != "undefined") {
        vB_QuickLoader_Factory.controls[C] = new vB_QuickLoader(C, vB_QuickLoader_Factory)
    }
    child_img_alt_2_title(B)
}

function PostBit_Init(C, D) {
    console.log("PostBit Init: %d", D);
    if (typeof vBmenu != "undefined") {
        var B = fetch_tags(C, "div");
        for (var A = 0; A < B.length; A++) {
            if (B[A].id && B[A].id.substr(0, 9) == "postmenu_") {
                vBmenu.register(B[A].id, true)
            }
        }
    }
    if (typeof vB_QuickEditor != "undefined") {
        vB_AJAX_QuickEdit_Init(C);		
    }
    if (typeof vB_QuickReply != "undefined") {
        qr_init_buttons(C)
    }
    if (typeof mq_init != "undefined") {
        mq_init(C)
    }
    if (typeof vBrep != "undefined") {
        if (typeof D != "undefined" && typeof D != "null") {
            vbrep_register(D)
        }
    }
    if (typeof inlineMod != "undefined") {
        im_init(C)
    }
    if (typeof vB_Lightbox != "undefined") {
        init_postbit_lightbox(C, false, true)
    }
    child_img_alt_2_title(C)
}

function vBulletin_init() {
    if (is_webtv) {
        return false
    }
    child_img_alt_2_title(document);
    if (typeof vBmenu == "object") {
        if (typeof (YAHOO) != "undefined") {
            YAHOO.util.Event.on(document, "click", vbmenu_hide);
            YAHOO.util.Event.on(window, "resize", vbmenu_hide)
        } else {
            if (window.attachEvent && !is_saf) {
                document.attachEvent("onclick", vbmenu_hide);
                window.attachEvent("onresize", vbmenu_hide)
            } else {
                if (document.addEventListener && !is_saf) {
                    document.addEventListener("click", vbmenu_hide, false);
                    window.addEventListener("resize", vbmenu_hide, false)
                } else {
                    window.onclick = vbmenu_hide;
                    window.onresize = vbmenu_hide
                }
            }
        }
        var B = fetch_tags(document, "td");
        for (var D = 0; D < B.length; D++) {
            if (B[D].hasChildNodes() && B[D].firstChild.name && B[D].firstChild.name.indexOf("PageNav") != -1) {
                var C = B[D].title;
                B[D].title = "";
                B[D].innerHTML = "";
                B[D].id = "pagenav." + D;
                var A = vBmenu.register(B[D].id);
                A.addr = C;
                if (is_saf) {
                    A.controlobj._onclick = A.controlobj.onclick;
                    A.controlobj.onclick = vBpagenav.prototype.controlobj_onclick
                }
            }
        }
        if (typeof C != "undefined") {
            fetch_object("pagenav_form").gotopage = vBpagenav.prototype.form_gotopage;
            fetch_object("pagenav_ibtn").onclick = vBpagenav.prototype.ibtn_onclick;
            fetch_object("pagenav_itxt").onkeypress = vBpagenav.prototype.itxt_onkeypress
        }
        vBmenu.activate(true)
    }
    vBulletin.init();
    return true
}

function vBulletin_Framework() {
    this.elements = new Array();
    this.ajaxurls = new Array();
    this.events = new Array();
    this.time = new Date();
    this.add_event("systemInit")
}
vBulletin_Framework.prototype.init = function () {
    console.info("Firing System Init");
    this.events.systemInit.fire()
};
vBulletin_Framework.prototype.extend = function (C, A) {
    function B() {}
    B.prototype = A.prototype;
    C.prototype = new B();
    C.prototype.constructor = C;
    C.baseConstructor = A;
    C.superClass = A.prototype
};
vBulletin_Framework.prototype.register_control = function (B, E) {
    var C = new Array();
    for (var D = 1; D < arguments.length; D++) {
        C.push(arguments[D])
    }
    if (!this.elements[B]) {
        console.info('Creating array vBulletin.elements["%s"]', B);
        this.elements[B] = new Array()
    }
    var A = this.elements[B].push(C);
    console.log('vBulletin.elements["%s"][%d] = %s', B, A - 1, C.join(", "))
};
vBulletin_Framework.prototype.register_ajax_urls = function (B, C, D) {
    B = B.split("?");
    B[1] = SESSIONURL + "securitytoken=" + SECURITYTOKEN + "&ajax=1&" + B[1].replace(/\{(\d+)(:\w+)?\}/gi, "%$1$s");
    C = C.split("?");
    C[1] = SESSIONURL + "securitytoken=" + SECURITYTOKEN + "&ajax=1&" + C[1].replace(/\{(\d+)(:\w+)?\}/gi, "%$1$s");
    console.log("Register AJAX URLs for %s", D);
    for (var A = 0; A < D.length; A++) {
        this.ajaxurls[D[A]] = new Array(B, C)
    }
};
vBulletin_Framework.prototype.add_event = function (A) {
    this.events[A] = new YAHOO.util.CustomEvent(A)
};
vBulletin_Framework.prototype.console = function () {
    if (window.console || console.firebug) {
        var args = new Array();
        for (var i = 0; i < arguments.length; i++) {
            args[args.length] = arguments[i]
        }
        try {
            eval("console.log('" + args.join("','") + "');")
        } catch (e) {}
    }
};
var PHP = new vB_PHP_Emulator();
var vBulletin = new vBulletin_Framework();
vBulletin.events.systemInit.subscribe(function () {
    YAHOO.util.Event.on(window, "resize", clear_viewport_info);
    YAHOO.util.Event.on(window, "scroll", clear_viewport_info)
});

function handle_dismiss_notice_error(C) {
    if (C.argument) {
        var B = YAHOO.util.Dom.get("dismiss_notice_hidden");
        B.value = C.argument;
        var A = YAHOO.util.Dom.get("notices");
        A.submit()
    }
}

function handle_dismiss_notice_ajax(E) {
    if (E.responseXML && E.responseXML.getElementsByTagName("dismissed").length) {
        var B = E.responseXML.getElementsByTagName("dismissed")[0].firstChild.nodeValue;
        var A = YAHOO.util.Dom.get("navbar_notice_" + B);
        if (A != null) {
            A.style.display = "none";
            var C = YAHOO.util.Dom.getElementsByClassName("navbar_notice", "", YAHOO.util.Dom.get("notices"));
            var D = 0;
            for (i = 0; i < C.length; i++) {
                if (C[i].style.display != "none") {
                    D++
                }
            }
            if (D == 0) {
                var F = YAHOO.util.Dom.get("notices");
                if (F != null) {
                    F.style.display = "none"
                }
            }
        }
    } else {
        handle_dismiss_notice_error(E)
    }
}

function dismiss_notice(B) {
    if (AJAX_Compatible) {
        var A = YAHOO.util.Connect.asyncRequest("POST", "ajax.php?do=dismissnotice", {
            success: handle_dismiss_notice_ajax,
            failure: handle_dismiss_notice_error,
            timeout: vB_Default_Timeout,
            argument: B
        }, SESSIONURL + "securitytoken=" + SECURITYTOKEN + "&do=dismissnotice&noticeid=" + PHP.urlencode(B));
        return false
    }
    return true
};

/*
vbulletin_menu.js
vBulletin 3.8.7 Patch Level 3
*/
vBulletin.add_event("vBmenuShow");
vBulletin.add_event("vBmenuHide");

function vB_Popup_Handler() {
    this.open_steps = 10;
    this.open_fade = false;
    this.active = false;
    this.menus = new Array();
    this.activemenu = null
}
vB_Popup_Handler.prototype.activate = function (A) {
    this.active = A;
    console.log("vBmenu :: System Activated")
};
vB_Popup_Handler.prototype.register = function (D, A, C) {
    this.menus[D] = new vB_Popup_Menu(D, A, C);
    var B = YAHOO.util.Dom.get("usercss");
    if (B && YAHOO.util.Dom.isAncestor(B, D)) {
        this.menus[D].imgsrc = IMGDIR_MISC + "/menu_open_usercss.gif"
    }
    this.menus[D].startup();
    return this.menus[D]
};
vB_Popup_Handler.prototype.hide = function () {
    if (this.activemenu != null) {
        this.menus[this.activemenu].hide()
    }
};
var vBmenu = new vB_Popup_Handler();

function vbmenu_hide(A) {
    if (A && A.button && A.button != 1 && A.type == "click") {
        return true
    } else {
        vBmenu.hide()
    }
}

function vB_Popup_Menu(C, A, B) {
    this.controlkey = C;
    this.noimage = A;
    this.noslide = B;
    this.menuname = this.controlkey.split(".")[0] + "_menu";
    this.imgsrc = IMGDIR_MISC + "/menu_open.gif"
}
vB_Popup_Menu.prototype.startup = function () {
    this.init_control(this.noimage);
    if (fetch_object(this.menuname)) {
        this.init_menu()
    }
    this.slide_open = (this.noslide ? false : true);
    this.open_steps = vBmenu.open_steps;
    vBulletin.add_event("vBmenuShow_" + this.controlkey);
    vBulletin.add_event("vBmenuHide_" + this.controlkey)
};
vB_Popup_Menu.prototype.init_control = function (A) {
    this.controlobj = fetch_object(this.controlkey);
    this.controlobj.state = false;
    if (this.controlobj.firstChild && (this.controlobj.firstChild.tagName == "TEXTAREA" || this.controlobj.firstChild.tagName == "INPUT")) {} else {
        if (!A && !(is_mac && is_ie)) {
            var C = document.createTextNode(" ");
            this.controlobj.appendChild(C);
            var B = document.createElement("img");
            B.src = this.imgsrc;
            B.border = 0;
            B.width = 8;
            B.height = 4;
            B.title = "";
            B.alt = "";
            this.img = this.controlobj.appendChild(B)
        }
        this.controlobj.unselectable = true;
        if (!A) {
            this.controlobj.style.cursor = pointer_cursor
        }
        this.controlobj.onclick = vB_Popup_Events.prototype.controlobj_onclick;
        this.controlobj.onmouseover = vB_Popup_Events.prototype.controlobj_onmouseover
    }
};
vB_Popup_Menu.prototype.init_menu = function () {
    this.menuobj = fetch_object(this.menuname);
    this.select_handler = new vB_Select_Overlay_Handler(this.menuobj);
    if (this.menuobj && !this.menuobj.initialized) {
        this.menuobj.initialized = true;
        this.menuobj.onclick = e_by_gum;
        this.menuobj.style.position = "absolute";
        this.menuobj.style.zIndex = 50;
        if (is_ie && !is_mac) {
            if (YAHOO.env.ua.ie < 7) {
                this.menuobj.style.filter += "alpha(enabled=1,opacity=100)"
            } else {
                this.menuobj.style.minHeight = "1%"
            }
        }
        this.init_menu_contents()
    }
};
vB_Popup_Menu.prototype.init_menu_contents = function () {
    var E = new Array("td", "li");
    for (var D = 0; D < E.length; D++) {
        var H = fetch_tags(this.menuobj, E[D]);
        for (var F = 0; F < H.length; F++) {
            if (H[F].className == "vbmenu_option") {
                if (H[F].title && H[F].title == "nohilite") {
                    H[F].title = ""
                } else {
                    H[F].controlkey = this.controlkey;
                    H[F].onmouseover = vB_Popup_Events.prototype.menuoption_onmouseover;
                    H[F].onmouseout = vB_Popup_Events.prototype.menuoption_onmouseout;
                    var C = fetch_tags(H[F], "a");
                    if (C.length == 1) {
                        H[F].className = H[F].className + " vbmenu_option_alink";
                        H[F].islink = true;
                        var B = C[0];
                        var A = false;
                        H[F].target = B.getAttribute("target");
                        if (typeof B.onclick == "function") {
                            H[F].ofunc = B.onclick;
                            H[F].onclick = vB_Popup_Events.prototype.menuoption_onclick_function;
                            A = true
                        } else {
                            if (typeof H[F].onclick == "function") {
                                H[F].ofunc = H[F].onclick;
                                H[F].onclick = vB_Popup_Events.prototype.menuoption_onclick_function;
                                A = true
                            } else {
                                H[F].href = B.href;
                                H[F].onclick = vB_Popup_Events.prototype.menuoption_onclick_link
                            }
                        } if (A) {
                            var G = document.createElement("a");
                            G.innerHTML = B.innerHTML;
                            G.href = "#";
                            G.onclick = function (I) {
                                I = I ? I : window.event;
                                I.returnValue = false;
                                return false
                            };
                            H[F].insertBefore(G, B);
                            H[F].removeChild(B)
                        }
                    } else {
                        if (typeof H[F].onclick == "function") {
                            H[F].ofunc = H[F].onclick;
                            H[F].onclick = vB_Popup_Events.prototype.menuoption_onclick_function
                        }
                    }
                }
            }
            if (H[F].title == "nohilite") {
                H[F].title = ""
            }
        }
    }
};
vB_Popup_Menu.prototype.show = function (B, A) {
    if (!vBmenu.active) {
        return false
    } else {
        if (!this.menuobj) {
            this.init_menu()
        }
    } if (!this.menuobj || vBmenu.activemenu == this.controlkey) {
        return false
    }
    console.log("vBmenu :: Show '%s'", this.controlkey);
    if (vBmenu.activemenu != null && vBmenu.activemenu != this.controlkey) {
        vBmenu.menus[vBmenu.activemenu].hide()
    }
    vBmenu.activemenu = this.controlkey;
    this.menuobj.style.display = "";
    if (this.slide_open) {
        this.menuobj.style.clip = "rect(auto, 0px, 0px, auto)"
    }
    this.set_menu_position(B);
    if (!A && this.slide_open) {
        this.intervalX = Math.ceil(this.menuobj.offsetWidth / this.open_steps);
        this.intervalY = Math.ceil(this.menuobj.offsetHeight / this.open_steps);
        this.slide((this.direction == "left" ? 0 : this.menuobj.offsetWidth), 0, 0)
    } else {
        if (this.menuobj.style.clip && this.slide_open) {
            this.menuobj.style.clip = "rect(auto, auto, auto, auto)"
        }
    }
    this.select_handler.hide();
    if (this.controlobj.editorid) {
        this.controlobj.state = true;
        vB_Editor[this.controlobj.editorid].menu_context(this.controlobj, "mousedown")
    }
    vBulletin.events["vBmenuShow_" + this.controlkey].fire(this.controlkey);
    vBulletin.events.vBmenuShow.fire(this.controlkey)
};
vB_Popup_Menu.prototype.set_menu_position = function (A) {
    this.pos = this.fetch_offset(A);
    this.leftpx = this.pos.left;
    this.toppx = this.pos.top + A.offsetHeight;
    if ((this.leftpx + this.menuobj.offsetWidth) >= document.body.clientWidth && (this.leftpx + A.offsetWidth - this.menuobj.offsetWidth) > 0) {
        this.leftpx = this.leftpx + A.offsetWidth - this.menuobj.offsetWidth;
        this.direction = "right"
    } else {
        this.direction = "left"
    } if (this.controlkey.match(/^pagenav\.\d+$/)) {
        A.appendChild(this.menuobj)
    }
    this.menuobj.style.left = this.leftpx + "px";
    this.menuobj.style.top = this.toppx + "px"
};
vB_Popup_Menu.prototype.hide = function (A) {
    if (A && A.button && A.button != 1) {
        return true
    }
    console.log("vBmenu :: Hide '%s'", this.controlkey);
    this.stop_slide();
    this.menuobj.style.display = "none";
    this.select_handler.show();
    if (this.controlobj.editorid) {
        this.controlobj.state = false;
        vB_Editor[this.controlobj.editorid].menu_context(this.controlobj, "mouseout")
    }
    vBmenu.activemenu = null;
    vBulletin.events["vBmenuHide_" + this.controlkey].fire(this.controlkey);
    vBulletin.events.vBmenuHide.fire(this.controlkey)
};
vB_Popup_Menu.prototype.hover = function (A) {
    if (vBmenu.activemenu != null) {
        if (vBmenu.menus[vBmenu.activemenu].controlkey != this.id) {
            this.show(A, true)
        }
    }
};
vB_Popup_Menu.prototype.slide = function (C, B, A) {
    if (this.direction == "left" && (C < this.menuobj.offsetWidth || B < this.menuobj.offsetHeight)) {
        C += this.intervalX;
        B += this.intervalY;
        this.menuobj.style.clip = "rect(auto, " + C + "px, " + B + "px, auto)";
        this.slidetimer = setTimeout("vBmenu.menus[vBmenu.activemenu].slide(" + C + ", " + B + ", " + A + ");", 0)
    } else {
        if (this.direction == "right" && (C > 0 || B < this.menuobj.offsetHeight)) {
            C -= this.intervalX;
            B += this.intervalY;
            this.menuobj.style.clip = "rect(auto, " + this.menuobj.offsetWidth + "px, " + B + "px, " + C + "px)";
            this.slidetimer = setTimeout("vBmenu.menus[vBmenu.activemenu].slide(" + C + ", " + B + ", " + A + ");", 0)
        } else {
            this.stop_slide()
        }
    }
};
vB_Popup_Menu.prototype.stop_slide = function () {
    clearTimeout(this.slidetimer);
    this.menuobj.style.clip = "rect(auto, auto, auto, auto)"
};
vB_Popup_Menu.prototype.fetch_offset = function (E) {
    if (E.getBoundingClientRect) {
        var C = E.getBoundingClientRect();
        var D = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        var F = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
        if (document.documentElement.dir == "rtl") {
            F = F + document.documentElement.clientWidth - document.documentElement.scrollWidth
        }
        return {
            left: C.left + F,
            top: C.top + D
        }
    }
    var B = E.offsetLeft;
    var A = E.offsetTop;
    while ((E = E.offsetParent) != null) {
        B += E.offsetLeft;
        A += E.offsetTop
    }
    return {
        left: B,
        top: A
    }
};

function vB_Popup_Events() {}
vB_Popup_Events.prototype.controlobj_onclick = function (A) {
    if (typeof do_an_e == "function") {
        do_an_e(A);
        if (vBmenu.activemenu == null || vBmenu.menus[vBmenu.activemenu].controlkey != this.id) {
            vBmenu.menus[this.id].show(this)
        } else {
            vBmenu.menus[this.id].hide()
        }
    }
};
vB_Popup_Events.prototype.controlobj_onmouseover = function (A) {
    if (typeof do_an_e == "function") {
        do_an_e(A);
        vBmenu.menus[this.id].hover(this)
    }
};
vB_Popup_Events.prototype.menuoption_onclick_function = function (A) {
    this.ofunc(A);
    vBmenu.menus[this.controlkey].hide()
};
vB_Popup_Events.prototype.menuoption_onclick_link = function (A) {
    A = A ? A : window.event;
    A.cancelBubble = true;
    if (A.stopPropagation) {
        A.stopPropagation()
    }
    if (A.preventDefault) {
        A.preventDefault()
    }
    if (A.shiftKey || (this.target != null && this.target != "" && this.target.toLowerCase() != "_self")) {
        if (this.target != null && this.target.charAt(0) != "_") {
            window.open(this.href, this.target)
        } else {
            window.open(this.href)
        }
    } else {
        window.location = this.href
    }
    vBmenu.menus[this.controlkey].hide();
    return false
};
vB_Popup_Events.prototype.menuoption_onmouseover = function (A) {
    this.className = "vbmenu_hilite" + (this.islink ? " vbmenu_hilite_alink" : "");
    this.style.cursor = pointer_cursor
};
vB_Popup_Events.prototype.menuoption_onmouseout = function (A) {
    this.className = "vbmenu_option" + (this.islink ? " vbmenu_option_alink" : "");
    this.style.cursor = "default"
};




/* vbulletin_textedit.js
------------------------------------------------------------------------------*/

function vB_Text_Editor(editorid, mode, parsetype, parsesmilies, initial_text, ajax_extra) {
    this.editorid = editorid;
    this.wysiwyg_mode = parseInt(mode, 10) ? 1 : 0;
    this.initialized = false;
    this.parsetype = (typeof parsetype == "undefined" ? "nonforum" : parsetype);
    this.ajax_extra = (typeof parsetype == "undefined" ? "" : ajax_extra);
    this.parsesmilies = (typeof parsesmilies == "undefined" ? 1 : parsesmilies);
    this.popupmode = (typeof vBmenu == "undefined" ? false : true);
	
    this.controlbar = fetch_object(this.editorid + "_controls");
    this.textobj = fetch_object(this.editorid + "_textarea");
	//this.textobj.disabled="true";
	this.buttons = new Array();
    this.popups = new Array();
    this.prompt_popup = null;
    this.fontstate = null;
    this.sizestate = null;
    this.colorstate = null;
    this.clipboard = "";
    this.disabled = false;
    this.history = new vB_History();
    this.influx = 0;
    this.allowbasicbbcode = ((typeof allowbasicbbcode != "undefined" && allowbasicbbcode) ? true : false);
    this.ltr = ((typeof ltr != "undefined" && ltr == "right") ? "right" : "left");
    this.init = function () {
        if (this.initialized) {
            return
        }
        this.textobj.disabled = false;
        if (this.tempiframe) {
            this.tempiframe.parentNode.removeChild(this.tempiframe)
        }
        this.set_editor_contents(initial_text);
        this.set_editor_functions();
        this.init_controls();
        this.init_smilies(fetch_object(this.editorid + "_smiliebox"));
        if (typeof smilie_window != "undefined" && !smilie_window.closed) {
            this.init_smilies(smilie_window.document.getElementById("smilietable"))
        }
        this.captcha = document.getElementById("imagestamp");
        if (this.captcha != null) {
            this.captcha.setAttribute("tabIndex", 1)
        }
        this.initialized = true
    };
    this.check_focus = function () {
        if (!this.editwin.hasfocus || (is_moz && is_mac)) {
            this.editwin.focus();
            if (is_opera) {
                this.editwin.focus()
            }
        }
    };
    this.init_controls = function () {
        var controls = new Array();
        var i, j, buttons, imgs, control;
        if (this.controlbar == null) {
            return
        }
        buttons = fetch_tags(this.controlbar, "div");
        for (i = 0; i < buttons.length; i++) {
            if (buttons[i].className == "imagebutton" && buttons[i].id) {
                controls[controls.length] = buttons[i].id;
                if (is_ie) {
                    imgs = buttons[i].getElementsByTagName("img");
                    for (j = 0; j < imgs.length; j++) {
                        if (imgs[j].alt == "") {
                            imgs[j].title = buttons[i].title
                        }
                    }
                }
            }
        }
        for (i = 0; i < controls.length; i++) {
            control = fetch_object(controls[i]);
            if (control.id.indexOf(this.editorid + "_cmd_") != -1) {
                this.init_command_button(control)
            } else {
                if (control.id.indexOf(this.editorid + "_popup_") != -1) {
                    this.init_popup_button(control)
                }
            }
        }
        set_unselectable(this.controlbar)
    };
    this.init_smilies = function (smilie_container) {
        if (smilie_container != null) {
            var smilies = fetch_tags(smilie_container, "img");
            for (var i = 0; i < smilies.length; i++) {
                if (smilies[i].id && smilies[i].id.indexOf("_smilie_") != false) {
                    smilies[i].style.cursor = pointer_cursor;
                    smilies[i].editorid = this.editorid;
                    smilies[i].onclick = vB_Text_Editor_Events.prototype.smilie_onclick;
                    smilies[i].unselectable = "on"
                }
            }
        }
    };
    this.init_command_button = function (obj) {
        obj.cmd = obj.id.substr(obj.id.indexOf("_cmd_") + 5);
        obj.editorid = this.editorid;
        this.buttons[obj.cmd] = obj;
        if (obj.cmd == "switchmode") {
            if (AJAX_Compatible) {
                obj.state = this.wysiwyg_mode ? true : false;
                this.set_control_style(obj, "button", this.wysiwyg_mode ? "selected" : "normal")
            } else {
                obj.parentNode.removeChild(obj)
            }
        } else {
            obj.state = false;
            obj.mode = "normal";
            if (obj.cmd == "bold" || obj.cmd == "italic" || obj.cmd == "underline") {
                this.allowbasicbbcode = true
            }
        }
        obj.onclick = obj.onmousedown = obj.onmouseover = obj.onmouseout = vB_Text_Editor_Events.prototype.command_button_onmouseevent
    };
    this.init_popup_button = function (obj) {
        obj.cmd = obj.id.substr(obj.id.indexOf("_popup_") + 7);
        if (this.popupmode) {
            vBmenu.register(obj.id, true);
            vBmenu.menus[obj.id].open_steps = 5;
            obj.editorid = this.editorid;
            obj.state = false;
            this.buttons[obj.cmd] = obj;
            var option, div;
            if (obj.cmd == "fontname") {
                this.fontout = fetch_object(this.editorid + "_font_out");
                this.fontout.innerHTML = obj.title;
                this.fontoptions = {
                    "": this.fontout
                };
                for (option in fontoptions) {
                    if (YAHOO.lang.hasOwnProperty(fontoptions, option)) {
                        div = document.createElement("div");
                        div.id = this.editorid + "_fontoption_" + fontoptions[option];
                        div.style.width = this.fontout.style.width;
                        div.style.display = "none";
                        div.innerHTML = fontoptions[option];
                        this.fontoptions[fontoptions[option]] = this.fontout.parentNode.appendChild(div)
                    }
                }
            } else {
                if (obj.cmd == "fontsize") {
                    this.sizeout = fetch_object(this.editorid + "_size_out");
                    this.sizeout.innerHTML = obj.title;
                    this.sizeoptions = {
                        "": this.sizeout
                    };
                    for (option in sizeoptions) {
                        if (YAHOO.lang.hasOwnProperty(sizeoptions, option)) {
                            div = document.createElement("div");
                            div.id = this.editorid + "_sizeoption_" + sizeoptions[option];
                            div.style.width = this.sizeout.style.width;
                            div.style.display = "none";
                            div.innerHTML = sizeoptions[option];
                            this.sizeoptions[sizeoptions[option]] = this.sizeout.parentNode.appendChild(div)
                        }
                    }
                }
            }
            obj._onmouseover = obj.onmouseover;
            obj._onclick = obj.onclick;
            obj.onmouseover = obj.onmouseout = obj.onclick = vB_Text_Editor_Events.prototype.popup_button_onmouseevent;
            vBmenu.menus[obj.id]._show = vBmenu.menus[obj.id].show;
            vBmenu.menus[obj.id].show = vB_Text_Editor_Events.prototype.popup_button_show
        } else {
            this.build_select(obj)
        }
    };
    this.build_select = function (obj) {
        var sel = document.createElement("select");
        sel.id = this.editorid + "_select_" + obj.cmd;
        sel.editorid = this.editorid;
        sel.cmd = obj.cmd;
        var opt = document.createElement("option");
        opt.value = "";
        opt.text = obj.title;
        sel.add(opt, is_ie ? sel.options.length : null);
        opt = document.createElement("option");
        opt.value = "";
        opt.text = " ";
        sel.add(opt, is_ie ? sel.options.length : null);
        var i;
        switch (obj.cmd) {
        case "fontname":
            for (i = 0; i < fontoptions.length; i++) {
                opt = document.createElement("option");
                opt.value = fontoptions[i];
                opt.text = (fontoptions[i].length > 10 ? (fontoptions[i].substr(0, 10) + "...") : fontoptions[i]);
                sel.add(opt, is_ie ? sel.options.length : null)
            }
            sel.onchange = vB_Text_Editor_Events.prototype.formatting_select_onchange;
            break;
        case "fontsize":
            for (i = 0; i < sizeoptions.length; i++) {
                opt = document.createElement("option");
                opt.value = sizeoptions[i];
                opt.text = sizeoptions[i];
                sel.add(opt, is_ie ? sel.options.length : null)
            }
            sel.onchange = vB_Text_Editor_Events.prototype.formatting_select_onchange;
            break;
        case "forecolor":
            for (i in coloroptions) {
                if (YAHOO.lang.hasOwnProperty(coloroptions, i)) {
                    opt = document.createElement("option");
                    opt.value = coloroptions[i];
                    opt.text = PHP.trim((coloroptions[i].length > 5 ? (coloroptions[i].substr(0, 5) + "...") : coloroptions[i]).replace(new RegExp("([A-Z])", "g"), " $1"));
                    opt.style.backgroundColor = i;
                    sel.add(opt, is_ie ? sel.options.length : null)
                }
            }
            sel.onchange = vB_Text_Editor_Events.prototype.formatting_select_onchange;
            break;
        case "smilie":
            for (var cat in smilieoptions) {
                if (!YAHOO.lang.hasOwnProperty(smilieoptions, cat)) {
                    continue
                }
                for (var smilieid in smilieoptions[cat]) {
                    if (!YAHOO.lang.hasOwnProperty(smilieoptions[cat], smilieid)) {
                        continue
                    }
                    if (smilieid != "more") {
                        opt = document.createElement("option");
                        opt.value = smilieoptions[cat][smilieid][1];
                        opt.text = smilieoptions[cat][smilieid][1];
                        opt.smilieid = smilieid;
                        opt.smiliepath = smilieoptions[cat][smilieid][0];
                        opt.smilietitle = smilieoptions[cat][smilieid][2];
                        sel.add(opt, is_ie ? sel.options.length : null)
                    }
                }
            }
            sel.onchange = vB_Text_Editor_Events.prototype.smilieselect_onchange;
            break;
        case "attach":
            sel.onmouseover = vB_Text_Editor_Events.prototype.attachselect_onmouseover;
            sel.onchange = vB_Text_Editor_Events.prototype.attachselect_onchange;
            break
        }
        while (obj.hasChildNodes()) {
            obj.removeChild(obj.firstChild)
        }
        this.buttons[obj.cmd] = obj.appendChild(sel)
    };
    this.init_popup_menu = function (obj) {
        if (this.disabled) {
            return false
        }
        var menu;
        switch (obj.cmd) {
        case "fontname":
            menu = this.init_menu_container("fontname", "200px", "250px", "auto");
            this.build_fontname_popup(obj, menu);
            break;
        case "fontsize":
            menu = this.init_menu_container("fontsize", "auto", "auto", "visible");
            this.build_fontsize_popup(obj, menu);
            break;
        case "forecolor":
            menu = this.init_menu_container("forecolor", "auto", "auto", "visible");
            this.build_forecolor_popup(obj, menu);
            break;
        case "smilie":
            menu = this.init_menu_container("smilie", "175px", "250px", "auto");
            this.build_smilie_popup(obj, menu);
            break;
        case "attach":
            if (typeof vB_Attachments != "undefined" && vB_Attachments.has_attachments()) {
                menu = this.init_menu_container("attach", "auto", "auto", "visible");
                this.build_attachments_popup(menu, obj)
            } else {
                fetch_object("manage_attachments_button").onclick();
                return false
            }
        }
		//get wrapper and insert menu after wrapper
        var mainWrapper=document.getElementById("wrapper");
		if (mainWrapper !="undefined" && mainWrapper !=null){
			mainWrapper.parentNode.insertBefore(menu,mainWrapper.nextSibling);
		} else {
		this.popups[obj.cmd] = this.controlbar.appendChild(menu);
		}
		
        set_unselectable(menu);
        return true
    };
    this.init_menu_container = function (cmd, width, height, overflow) {
        var menu = document.createElement("div");
        menu.id = this.editorid + "_popup_" + cmd + "_menu";
        menu.className = "vbmenu_popup";
        menu.style.display = "none";
        menu.style.cursor = "default";
        menu.style.padding = "3px";
        menu.style.width = width;
        menu.style.height = height;
        menu.style.overflow = overflow;
        return menu
    };
    this.build_fontname_popup = function (obj, menu) {
        for (var n in fontoptions) {
            if (YAHOO.lang.hasOwnProperty(fontoptions, n)) {
                var option = document.createElement("div");
                option.innerHTML = '<font face="' + fontoptions[n] + '">' + fontoptions[n] + "</font>";
                option.className = "ofont";
                option.style.textAlign = "left";
                option.title = fontoptions[n];
                option.cmd = obj.cmd;
                option.controlkey = obj.id;
                option.editorid = this.editorid;
                option.onmouseover = option.onmouseout = option.onmouseup = option.onmousedown = vB_Text_Editor_Events.prototype.menuoption_onmouseevent;
                option.onclick = vB_Text_Editor_Events.prototype.formatting_option_onclick;
                menu.appendChild(option)
            }
        }
    };
    this.build_fontsize_popup = function (obj, menu) {
        for (var n in sizeoptions) {
            if (YAHOO.lang.hasOwnProperty(sizeoptions, n)) {
                var option = document.createElement("div");
                option.innerHTML = '<font size="' + sizeoptions[n] + '">' + sizeoptions[n] + "</font>";
                option.className = "osize";
                option.style.textAlign = "center";
                option.title = sizeoptions[n];
                option.cmd = obj.cmd;
                option.controlkey = obj.id;
                option.editorid = this.editorid;
                option.onmouseover = option.onmouseout = option.onmouseup = option.onmousedown = vB_Text_Editor_Events.prototype.menuoption_onmouseevent;
                option.onclick = vB_Text_Editor_Events.prototype.formatting_option_onclick;
                menu.appendChild(option)
            }
        }
    };
    this.build_forecolor_popup = function (obj, menu) {
        var colorout = fetch_object(this.editorid + "_color_out");
        colorout.editorid = this.editorid;
        colorout.onclick = vB_Text_Editor_Events.prototype.colorout_onclick;
        var table = document.createElement("table");
        table.cellPadding = 0;
        table.cellSpacing = 0;
        table.border = 0;
        var i = 0;
        for (var hex in coloroptions) {
            if (!YAHOO.lang.hasOwnProperty(coloroptions, hex)) {
                continue
            }
            if (i % 8 == 0) {
                var tr = table.insertRow(-1)
            }
            i++;
            var div = document.createElement("div");
            div.style.backgroundColor = coloroptions[hex];
            var option = tr.insertCell(-1);
            option.style.textAlign = "center";
            option.className = "ocolor";
            option.appendChild(div);
            option.cmd = obj.cmd;
            option.editorid = this.editorid;
            option.controlkey = obj.id;
            option.colorname = coloroptions[hex];
            option.id = this.editorid + "_color_" + coloroptions[hex];
            option.onmouseover = option.onmouseout = option.onmouseup = option.onmousedown = vB_Text_Editor_Events.prototype.menuoption_onmouseevent;
            option.onclick = vB_Text_Editor_Events.prototype.coloroption_onclick
        }
        menu.appendChild(table)
    };
    this.build_smilie_popup = function (obj, menu) {
        for (var cat in smilieoptions) {
            if (!YAHOO.lang.hasOwnProperty(smilieoptions, cat)) {
                continue
            }
            var option;
            var category = document.createElement("div");
            category.className = "thead";
            category.innerHTML = cat;
            menu.appendChild(category);
            for (var smilieid in smilieoptions[cat]) {
                if (!YAHOO.lang.hasOwnProperty(smilieoptions[cat], smilieid)) {
                    continue
                }
                if (smilieid == "more") {
                    option = document.createElement("div");
                    option.className = "thead";
                    option.innerHTML = smilieoptions[cat][smilieid];
                    option.style.cursor = pointer_cursor;
                    option.editorid = this.editorid;
                    option.controlkey = obj.id;
                    option.onclick = vB_Text_Editor_Events.prototype.smiliemore_onclick
                } else {
                    option = document.createElement("div");
                    option.editorid = this.editorid;
                    option.controlkey = obj.id;
                    option.smilieid = smilieid;
                    option.smilietext = smilieoptions[cat][smilieid][1];
                    option.smilietitle = smilieoptions[cat][smilieid][2];
                    option.className = "osmilie";
                    option.innerHTML = '<img src="' + smilieoptions[cat][smilieid][0] + '" alt="' + PHP.htmlspecialchars(smilieoptions[cat][smilieid][2]) + '" /> ' + PHP.htmlspecialchars(smilieoptions[cat][smilieid][2]);
                    option.onmouseover = option.onmouseout = option.onmousedown = option.onmouseup = vB_Text_Editor_Events.prototype.menuoption_onmouseevent;
                    option.onclick = vB_Text_Editor_Events.prototype.smilieoption_onclick
                }
                menu.appendChild(option)
            }
        }
    };
    this.build_attachments_popup = function (menu, obj) {
        var id, div;
        if (this.popupmode) {
            while (menu.hasChildNodes()) {
                menu.removeChild(menu.firstChild)
            }
            div = document.createElement("div");
            div.editorid = this.editorid;
            div.controlkey = obj.id;
            div.className = "thead";
            div.style.cursor = pointer_cursor;
            div.style.whiteSpace = "nowrap";
            div.innerHTML = fetch_object("manage_attachments_button").value;
            div.title = fetch_object("manage_attachments_button").title;
            div.onclick = vB_Text_Editor_Events.prototype.attachmanage_onclick;
            menu.appendChild(div);
            var attach_count = 0;
            for (id in vB_Attachments.attachments) {
                if (!YAHOO.lang.hasOwnProperty(vB_Attachments.attachments, id)) {
                    continue
                }
                div = document.createElement("div");
                div.editorid = this.editorid;
                div.controlkey = obj.id;
                div.className = "osmilie";
                div.attachmentid = id;
                div.style.whiteSpace = "nowrap";
                div.innerHTML = '<img src="' + vB_Attachments.attachments[id]["imgpath"] + '" alt="" /> ' + vB_Attachments.attachments[id]["filename"];
                div.onmouseover = div.onmouseout = div.onmousedown = div.onmouseup = vB_Text_Editor_Events.prototype.menuoption_onmouseevent;
                div.onclick = vB_Text_Editor_Events.prototype.attachoption_onclick;
                menu.appendChild(div);
                attach_count++
            }
            if (attach_count > 1) {
                div = document.createElement("div");
                div.editorid = this.editorid;
                div.controlkey = obj.id;
                div.className = "osmilie";
                div.style.fontWeight = "bold";
                div.style.paddingLeft = "25px";
                div.style.whiteSpace = "nowrap";
                div.innerHTML = vbphrase.insert_all;
                div.onmouseover = div.onmouseout = div.onmousedown = div.onmouseup = vB_Text_Editor_Events.prototype.menuoption_onmouseevent;
                div.onclick = vB_Text_Editor_Events.prototype.attachinsertall_onclick;
                menu.appendChild(div)
            }
        } else {
            while (menu.options.length > 2) {
                menu.remove(menu.options.length - 1)
            }
            for (id in vB_Attachments.attachments) {
                if (!YAHOO.lang.hasOwnProperty(vB_Attachments.attachments, id)) {
                    continue
                }
                var opt = document.createElement("option");
                opt.value = id;
                opt.text = vB_Attachments.attachments[id]["filename"];
                menu.add(opt, is_ie ? menu.options.length : null)
            }
        }
        set_unselectable(menu)
    };
    this.menu_context = function (obj, state) {
        if (this.disabled) {
            return
        }
        switch (obj.state) {
        case true:
            this.set_control_style(obj, "button", "down");
            break;
        default:
            switch (state) {
            case "mouseout":
                this.set_control_style(obj, "button", "normal");
                break;
            case "mousedown":
                this.set_control_style(obj, "popup", "down");
                break;
            case "mouseup":
            case "mouseover":
                this.set_control_style(obj, "button", "hover");
                break
            }
        }
    };
    this.button_context = function (obj, state, controltype) {
        if (this.disabled) {
            return
        }
        if (typeof controltype == "undefined") {
            controltype = "button"
        }
        switch (obj.state) {
        case true:
            switch (state) {
            case "mouseover":
            case "mousedown":
            case "mouseup":
                this.set_control_style(obj, controltype, "down");
                break;
            case "mouseout":
                this.set_control_style(obj, controltype, "selected");
                break
            }
            break;
        default:
            switch (state) {
            case "mouseover":
            case "mouseup":
                this.set_control_style(obj, controltype, "hover");
                break;
            case "mousedown":
                this.set_control_style(obj, controltype, "down");
                break;
            case "mouseout":
                this.set_control_style(obj, controltype, "normal");
                break
            }
            break
        }
    };
    this.set_control_style = function (obj, controltype, mode) {
        if (obj.mode != mode) {
            obj.mode = mode;
            istyle = "pi_" + controltype + "_" + obj.mode;
            if (typeof istyles != "undefined" && typeof istyles[istyle] != "undefined") {
                obj.style.background = istyles[istyle][0];
                obj.style.color = istyles[istyle][1];
                if (controltype != "menu") {
                    obj.style.padding = istyles[istyle][2]
                }
                obj.style.border = istyles[istyle][3];
                var tds = fetch_tags(obj, "td");
                for (var i = 0; i < tds.length; i++) {
                    switch (tds[i].className) {
                    case "popup_feedback":
                        if ("left" == this.ltr) {
                            tds[i].style.borderRight = (mode == "normal" ? istyles.pi_menu_normal[3] : istyles[istyle][3])
                        } else {
                            tds[i].style.borderLeft = (mode == "normal" ? istyles.pi_menu_normal[3] : istyles[istyle][3])
                        }
                        break;
                    case "popup_pickbutton":
                        tds[i].style.borderColor = (mode == "normal" ? istyles.pi_menu_normal[0] : istyles[istyle][0]);
                        break;
                    case "alt_pickbutton":
                        if (obj.state) {
                            if ("left" == this.ltr) {
                                tds[i].style.paddingLeft = istyles.pi_button_normal[2];
                                tds[i].style.borderLeft = istyles.pi_button_normal[3]
                            } else {
                                tds[i].style.paddingRight = istyles.pi_button_normal[2];
                                tds[i].style.borderRight = istyles.pi_button_normal[3]
                            }
                        } else {
                            if ("left" == this.ltr) {
                                tds[i].style.paddingLeft = istyles[istyle][2];
                                tds[i].style.borderLeft = istyles[istyle][3]
                            } else {
                                tds[i].style.paddingRight = istyles[istyle][2];
                                tds[i].style.borderRight = istyles[istyle][3]
                            }
                        }
                    }
                }
            }
        }
    };
    this.format = function (e, cmd, arg) {
        e = do_an_e(e);
        if (this.disabled) {
            return false
        }
        if (cmd != "redo") {
            this.history.add_snapshot(this.get_editor_contents())
        }
        if (cmd == "switchmode") {
            switch_editor_mode(this.editorid);
            return
        } else {
            if (cmd.substr(0, 6) == "resize") {
                var size_change = parseInt(cmd.substr(9), 10);
                var change_direction = parseInt(cmd.substr(7, 1), 10) == "1" ? 1 : -1;
                this.resize_editor(size_change * change_direction);
                return
            }
        }
        this.check_focus();
        var ret;
        if (cmd.substr(0, 4) == "wrap") {
            ret = this.wrap_tags(cmd.substr(6), (cmd.substr(4, 1) == "1" ? true : false))
        } else {
            if (this[cmd]) {
                ret = this[cmd](e)
            } else {
                try {
                    ret = this.apply_format(cmd, false, (typeof arg == "undefined" ? true : arg))
                } catch (e) {
                    this.handle_error(cmd, e);
                    ret = false
                }
            }
        } if (cmd != "undo") {
            this.history.add_snapshot(this.get_editor_contents())
        }
        this.set_context(cmd);
        this.check_focus();
        return ret
    };
    this.insertimage = function (e, img) {
        if (typeof img == "undefined") {
            img = this.show_prompt(vbphrase.enter_image_url, "http://", true)
        }
        if (img = this.verify_prompt(img)) {
            return this.apply_format("insertimage", false, img)
        } else {
            return false
        }
    };
    this.wrap_tags = function (tagname, useoption, selection) {
        tagname = tagname.toUpperCase();
        switch (tagname) {
        case "CODE":
        case "HTML":
        case "PHP":
            this.apply_format("removeformat");
            break
        }
        if (typeof selection == "undefined") {
            selection = this.get_selection();
            if (selection === false) {
                selection = ""
            } else {
                selection = new String(selection)
            }
        }
        var opentag;
        if (useoption === true) {
            var option = this.show_prompt(construct_phrase(vbphrase.enter_tag_option, ("[" + tagname + "]")), "", false);
            if (option = this.verify_prompt(option)) {
                opentag = "[" + tagname + '="' + option + '"]'
            } else {
                return false
            }
        } else {
            if (useoption !== false) {
                opentag = "[" + tagname + '="' + useoption + '"]'
            } else {
                opentag = "[" + tagname + "]"
            }
        }
        var closetag = "[/" + tagname + "]";
        var text = opentag + selection + closetag;
        this.insert_text(text, opentag.vBlength(), closetag.vBlength());
        return false
    };
    this.spelling = function () {
        if (is_ie) {
            try {
                eval("new ActiveXObject('ieSpell.ieSpellExtension').CheckDocumentNode(this.spellobj);")
            } catch (e) {
                if (e.number == -2146827859 && confirm(vbphrase.iespell_not_installed)) {
                    window.open("http://www.iespell.com/download.php")
                }
            }
        } else {
            if (is_moz) {}
        }
    };
    this.handle_error = function (cmd, e) {};
    this.show_prompt = function (dialogtxt, defaultval, forceltr) {
        var returnvalue;
        if (YAHOO.env.ua.ie >= 7) {
            var base_tag = fetch_tags(document, "base");
            var modal_prefix;
            if (base_tag && base_tag[0] && base_tag[0].href) {
                modal_prefix = base_tag[0].href
            } else {
                modal_prefix = ""
            }
            returnvalue = window.showModalDialog(modal_prefix + "clientscript/ieprompt.html?", {
                value: defaultval,
                label: dialogtxt,
                dir: document.dir,
                title: document.title,
                forceltr: (typeof (forceltr) != "undefined" ? forceltr : false)
            }, "dialogWidth:320px; dialogHeight:150px; dialogTop:" + (parseInt(window.screenTop) + parseInt(window.event.clientY) + parseInt(document.body.scrollTop) - 100) + "px; dialogLeft:" + (parseInt(window.screenLeft) + parseInt(window.event.clientX) + parseInt(document.body.scrollLeft) - 160) + "px; resizable: No;")
        } else {
            returnvalue = prompt(dialogtxt, defaultval)
        } if (typeof (returnvalue) == "undefined") {
            return false
        } else {
            if (returnvalue == false || returnvalue == null) {
                return returnvalue
            } else {
                return PHP.trim(new String(returnvalue))
            }
        }
    };
    this.verify_prompt = function (str) {
        switch (str) {
        case "http://":
        case "null":
        case "undefined":
        case "false":
        case "":
        case null:
        case false:
            return false;
        default:
            return str
        }
    };
    this.open_smilie_window = function (width, height) {
        smilie_window = openWindow("misc.php?" + SESSIONURL + "do=getsmilies&editorid=" + this.editorid, width, height, "smilie_window");
        window.onunload = vB_Text_Editor_Events.prototype.smiliewindow_onunload
    };
    this.resize_editor = function (change) {
        var newheight = parseInt(this.editbox.style.height, 10) + change;
        if (newheight >= 60) {
            this.editbox.style.height = newheight + "px";
            if (change % 99 != 0) {
                set_cookie("editor_height", newheight)
            }
        }
    };
    this.destroy_popup = function (popupname) {
        this.popups[popupname].parentNode.removeChild(this.popups[popupname]);
        this.popups[popupname] = null
    };
    this.destroy = function () {
        var i;
        for (i in this.buttons) {
            if (YAHOO.lang.hasOwnProperty(this.buttons, i)) {
                this.set_control_style(this.buttons[i], "button", "normal")
            }
        }
        for (var menu in this.popups) {
            if (YAHOO.lang.hasOwnProperty(this.popups, menu)) {
                this.destroy_popup(menu)
            }
        }
        if (this.fontoptions) {
            for (i in this.fontoptions) {
                if (YAHOO.lang.hasOwnProperty(this.fontoptions, i) && i != "") {
                    this.fontoptions[i].parentNode.removeChild(this.fontoptions[i])
                }
            }
            this.fontoptions[""].style.display = ""
        }
        if (this.sizeoptions) {
            for (i in this.sizeoptions) {
                if (YAHOO.lang.hasOwnProperty(this.sizeoptions, i) && i != "") {
                    this.sizeoptions[i].parentNode.removeChild(this.sizeoptions[i])
                }
            }
            this.sizeoptions[""].style.display = ""
        }
    };
    this.collapse_selection_end = function () {
        var range;
        if (this.editdoc.selection) {
            range = this.editdoc.getSelection();//selection.createRange();
            eval("range.move('character', -1);");
            range.collapse(false);
            range.select()
        } else {
            if (document.selection && document.selection.createRange) {
                range = document.getSelection();//document.selection.createRange();
                range.collapse(false);
                range.select()
            } else {
                if (typeof (this.editdoc.selectionStart) != "undefined") {
                    var sel_text = this.editdoc.value.substr(this.editdoc.selectionStart, this.editdoc.selectionEnd - this.editdoc.selectionStart);
                    this.editdoc.selectionStart = this.editdoc.selectionStart + sel_text.vBlength()
                } else {
                    if (window.getSelection) {}
                }
            }
        }
    };
    if (this.wysiwyg_mode) {
        this.disable_editor = function (text) {
            if (!this.disabled) {
                this.disabled = true;
                var hider = fetch_object(this.editorid + "_hider");
                if (hider) {
                    hider.parentNode.removeChild(hider)
                }
                var div = document.createElement("div");
                div.id = this.editorid + "_hider";
                div.className = "wysiwyg";
                div.style.border = "2px inset";
                div.style.margin = "0px";
                div.style.padding = "0px";
                div.style.width = this.editbox.style.width;
                div.style.height = this.editbox.style.height;
                var childdiv = document.createElement("div");
                childdiv.style.margin = "8px";
                childdiv.innerHTML = text;
                div.appendChild(childdiv);
                this.editbox.parentNode.appendChild(div);
                this.editbox.style.width = "0px";
                this.editbox.style.height = "0px";
                this.editbox.style.border = "none"
            }
        };
        this.enable_editor = function (text) {
            if (typeof text != "undefined") {
                this.set_editor_contents(text)
            }
            var hider = fetch_object(this.editorid + "_hider");
            if (hider) {
                hider.parentNode.removeChild(hider)
            }
            this.disabled = false
        };
        this.write_editor_contents = function (text, doinit) {
            if (text == "") {
                if (is_ie) {
                    text = "<p></p>"
                } else {
                    if (is_moz) {
                        text = "<br />"
                    }
                }
            }
            if (this.editdoc && this.editdoc.initialized) {
                this.editdoc.body.innerHTML = text
            } else {
                this.editdoc = this.editwin.document;
                this.editdoc.open("text/html", "replace");
                this.editdoc.write(text);
                this.editdoc.close();
                if (doinit) {
                    if (is_moz) {
                        this.editdoc.designMode = "on"
                    } else {
                        this.editdoc.body.contentEditable = true
                    }
                }
                this.editdoc.body.spellcheck = true;
                this.editdoc.initialized = true;
                this.set_editor_style()
            }
            this.set_direction()
        };
        this.set_editor_contents = function (initial_text) {
            if (fetch_object(this.editorid + "_iframe")) {
                this.editbox = fetch_object(this.editorid + "_iframe")
            } else {
                var iframe = document.createElement("iframe");
                if (is_ie && window.location.protocol == "https:") {
                    iframe.src = "clientscript/index.html"
                }
                this.editbox = this.textobj.parentNode.appendChild(iframe);
                this.editbox.id = this.editorid + "_iframe";
                this.editbox.tabIndex = 1
            } if (!is_ie) {
                this.editbox.style.border = "2px inset"
            }
            this.set_editor_width(typeof (this.textobj.style.oWidth) != "undefined" ? this.textobj.style.oWidth : this.textobj.style.width);
            this.editbox.style.height = this.textobj.style.height;
            this.textobj.style.display = "none";
            this.editwin = this.editbox.contentWindow;
            this.editdoc = this.editwin.document;
            this.write_editor_contents((typeof initial_text == "undefined" ? this.textobj.value : initial_text), true);
            if (this.editdoc.dir == "rtl") {}
            this.spellobj = this.editdoc.body;
            this.editdoc.editorid = this.editorid;
            this.editwin.editorid = this.editorid
        };
        this.set_editor_width = function (width, overwrite_original) {
            this.editbox.style.width = width
        };
        this.set_direction = function () {
            this.editdoc.dir = this.textobj.dir
        };
        this.set_editor_style = function () {
            var wysiwyg_csstext = "";
            var have_usercss = false;
            var all_stylesheets = fetch_all_stylesheets(document.styleSheets);
            for (var ss = 0; ss < all_stylesheets.length; ss++) {
                try {
                    var rules = (all_stylesheets[ss].cssRules ? all_stylesheets[ss].cssRules : all_stylesheets[ss].rules);
                    if (rules.length <= 0) {
                        continue
                    }
                } catch (e) {
                    continue
                }
                for (var i = 0; i < rules.length; i++) {
                    if (!rules[i].selectorText) {
                        continue
                    }
                    var process = false;
                    var selectors = new Array();
                    if (rules[i].selectorText.indexOf(".wysiwyg") >= 0) {
                        var split_selectors = rules[i].selectorText.split(",");
                        for (var selid = 0; selid < split_selectors.length; selid++) {
                            if (split_selectors[selid].indexOf(".wysiwyg") >= 0) {
                                selectors.push(split_selectors[selid])
                            }
                            if (split_selectors[selid].indexOf("#usercss") >= 0) {
                                have_usercss = true
                            }
                        }
                        process = true
                    }
                    if (process) {
                        var css_rules = "{ " + rules[i].style.cssText + " }";
                        if (is_moz) {
                            css_rules = css_rules.replace(/; /g, " !important; ")
                        }
                        wysiwyg_csstext += selectors.join(", ") + " " + css_rules + "\n"
                    }
                }
            }
            wysiwyg_csstext += " p { margin: 0px; } .inlineimg { vertical-align: middle; }";
            if (is_ie) {
                this.editdoc.createStyleSheet().cssText = wysiwyg_csstext
            } else {
                var newss = this.editdoc.createElement("style");
                newss.type = "text/css";
                newss.innerHTML = wysiwyg_csstext;
                this.editdoc.documentElement.childNodes[0].appendChild(newss)
            } if (have_usercss) {
                this.editdoc.body.parentNode.id = "usercss"
            }
            this.editdoc.body.className = "wysiwyg"
        };
        this.set_editor_functions = function () {
            this.editdoc.onmouseup = vB_Text_Editor_Events.prototype.editdoc_onmouseup;
            this.editdoc.onkeyup = vB_Text_Editor_Events.prototype.editdoc_onkeyup;
            if (this.editdoc.attachEvent) {
                this.editdoc.body.attachEvent("onresizestart", vB_Text_Editor_Events.prototype.editdoc_onresizestart)
            }
            this.editwin.onfocus = vB_Text_Editor_Events.prototype.editwin_onfocus;
            this.editwin.onblur = vB_Text_Editor_Events.prototype.editwin_onblur
        };
        this.set_context = function (cmd) {
            for (var i in contextcontrols) {
                if (!YAHOO.lang.hasOwnProperty(contextcontrols, i)) {
                    continue
                }
                var obj = fetch_object(this.editorid + "_cmd_" + contextcontrols[i]);
                if (obj != null) {
                    var state = this.editdoc.queryCommandState(contextcontrols[i]);
                    if (obj.state != state) {
                        obj.state = state;
                        this.button_context(obj, (obj.cmd == cmd ? "mouseover" : "mouseout"))
                    }
                }
            }
            this.set_font_context();
            this.set_size_context();
            this.set_color_context()
        };
        this.set_font_context = function (fontstate) {
            if (this.buttons.fontname) {
                if (typeof fontstate == "undefined") {
                    fontstate = this.editdoc.queryCommandValue("fontname")
                }
                switch (fontstate) {
                case "":
                    if (!is_ie && window.getComputedStyle) {
                        fontstate = this.editdoc.body.style.fontFamily
                    }
                    break;
                case null:
                    fontstate = "";
                    break
                }
                if (fontstate != this.fontstate) {
                    this.fontstate = fontstate;
                    var thingy = PHP.ucfirst(this.fontstate, ",");
                    var i;
                    if (this.popupmode) {
                        for (i in this.fontoptions) {
                            if (YAHOO.lang.hasOwnProperty(this.fontoptions, i)) {
                                this.fontoptions[i].style.display = (i == thingy ? "" : "none")
                            }
                        }
                    } else {
                        for (i = 0; i < this.buttons.fontname.options.length; i++) {
                            if (this.buttons.fontname.options[i].value == thingy) {
                                this.buttons.fontname.selectedIndex = i;
                                break
                            }
                        }
                    }
                }
            }
        };
        this.set_size_context = function (sizestate) {
            if (this.buttons.fontsize) {
                if (typeof sizestate == "undefined") {
                    sizestate = this.editdoc.queryCommandValue("fontsize")
                }
                switch (sizestate) {
                case null:
                case "":
                    if (is_moz) {
                        sizestate = this.translate_fontsize(this.editdoc.body.style.fontSize)
                    }
                    break
                }
                if (sizestate != this.sizestate) {
                    this.sizestate = sizestate;
                    var i;
                    if (this.popupmode) {
                        for (i in this.sizeoptions) {
                            if (YAHOO.lang.hasOwnProperty(this.sizeoptions, i)) {
                                this.sizeoptions[i].style.display = (i == this.sizestate ? "" : "none")
                            }
                        }
                    } else {
                        for (i = 0; i < this.buttons.fontsize.options.length; i++) {
                            if (this.buttons.fontsize.options[i].value == this.sizestate) {
                                this.buttons.fontsize.selectedIndex = i;
                                break
                            }
                        }
                    }
                }
            }
        };
        this.set_color_context = function (colorstate) {
            if (this.buttons.forecolor) {
                if (typeof colorstate == "undefined") {
                    colorstate = this.editdoc.queryCommandValue("forecolor")
                }
                if (colorstate != this.colorstate) {
                    if (this.popupmode) {
                        var obj = fetch_object(this.editorid + "_color_" + this.translate_color_commandvalue(this.colorstate));
                        if (obj != null) {
                            obj.state = false;
                            this.button_context(obj, "mouseout", "menu")
                        }
                        this.colorstate = colorstate;
                        elmid = this.editorid + "_color_" + this.translate_color_commandvalue(colorstate);
                        obj = fetch_object(elmid);
                        if (obj != null) {
                            obj.state = true;
                            this.button_context(obj, "mouseout", "menu")
                        }
                    } else {
                        this.colorstate = colorstate;
                        colorstate = this.translate_color_commandvalue(this.colorstate);
                        for (var i = 0; i < this.buttons.forecolor.options.length; i++) {
                            if (this.buttons.forecolor.options[i].value == colorstate) {
                                this.buttons.forecolor.selectedIndex = i;
                                break
                            }
                        }
                    }
                }
            }
        };
        this.translate_color_commandvalue = function (forecolor) {
            return this.translate_silly_hex((forecolor & 255).toString(16), ((forecolor >> 8) & 255).toString(16), ((forecolor >> 16) & 255).toString(16))
        };
        this.translate_silly_hex = function (r, g, b) {
            return coloroptions["#" + (PHP.str_pad(r, 2, 0) + PHP.str_pad(g, 2, 0) + PHP.str_pad(b, 2, 0)).toUpperCase()]
        };
        this.apply_format = function (cmd, dialog, argument) {
            this.editdoc.execCommand(cmd, (typeof dialog == "undefined" ? false : dialog), (typeof argument == "undefined" ? true : argument));
            return false
        };
        this.createlink = function (e, url) {
            return this.apply_format("createlink", is_ie, (typeof url == "undefined" ? true : url))
        };
        this.email = function (e, email) {
            if (typeof email == "undefined") {
                email = this.show_prompt(vbphrase.enter_email_link, "", true)
            }
            email = this.verify_prompt(email);
            if (email === false) {
                return this.apply_format("unlink")
            } else {
                var selection = this.get_selection();
                return this.insert_text('<a href="mailto:' + email + '">' + (selection ? selection : email) + "</a>", (selection ? true : false))
            }
        };
        this.insert_smilie = function (e, smilietext, smiliepath, smilieid) {
            this.check_focus();
            //return this.insert_text('<img src="' + smiliepath + '" border="0" class="inlineimg" alt="0" smilieid="' + smilieid + '" />', false)
			
                try {
                    this.apply_format("InsertImage", false, smiliepath);
                    var smilies = fetch_tags(this.editdoc.body, "img");
                    for (var i = 0; i < smilies.length; i++) {
                        if (smilies[i].src == smiliepath) {
                            smilies[i].className = "inlineimg";
                            if (smilies[i].getAttribute("smilieid") < 1) {
                                smilies[i].setAttribute("smilieid", smilieid);
                                smilies[i].setAttribute("border", "0")
                            }
                        }
                    }
                } catch (e) {}
        };
        this.get_editor_contents = function () {
            return this.editdoc.body.innerHTML
        };
        this.get_selection = function () {
            var range = this.editdoc.getSelection();//selection.createRange();
            if (range.htmlText && range.text) {
                return range.htmlText
            } else {
                var do_not_steal_this_code_html = "";
                for (var i = 0; i < range.length; i++) {
                    do_not_steal_this_code_html += range.item(i).outerHTML
                }
                return do_not_steal_this_code_html
            }
        };
        this.insert_text = function (html, movestart, moveend) {
          var sel, range, fragment;
          var selectInserted=true;
          if (typeof window.getSelection != "undefined") {
            sel = this.editdoc.getSelection();

            if (sel.getRangeAt && sel.rangeCount) {
              range = this.editdoc.getSelection().getRangeAt(0);
              tsel = this.editdoc.getSelection().toString();
              var div = document.createElement("div"), child;
              var tag = html.substring(1, movestart-1);
              var otag = "[" + tag + "]";
              var ctag = "[/" + tag + "]";
              var html = otag + tsel + ctag;
              range.deleteContents();

              if (range.createContextualFragment) {
                fragment = range.createContextualFragment(html);
              } else {
                var div = document.createElement("div"), child;
                div.innerHTML = html;
                fragment = document.createDocumentFragment();
                while ( (child = div.firstChild) ) {
                fragment.appendChild(child);
                }
              }
              var firstInsertedNode = fragment.firstChild;
              var lastInsertedNode = fragment.lastChild;
              range.insertNode(fragment);
              if (selectInserted) {
                if (firstInsertedNode) {
                  range.setStartBefore(firstInsertedNode);
                  range.setEndAfter(lastInsertedNode);
                }
                sel.removeAllRanges();
              }
            }
          }
        };
        this.prepare_submit = function (subjecttext, minchars) {
            this.textobj.value = this.get_editor_contents();
            var returnvalue = validatemessage(stripcode(this.textobj.value, true), subjecttext, minchars);
            if (returnvalue) {
                return returnvalue
            } else {
                if (this.captcha != null && this.captcha.failed) {
                    return false
                } else {
                    this.check_focus();
                    return false
                }
            }
        };
        if (is_moz) {
            this._set_editor_contents = this.set_editor_contents;
            this.set_editor_contents = function (initial_text) {
                this._set_editor_contents(initial_text);
                this.editdoc.addEventListener("keypress", vB_Text_Editor_Events.prototype.editdoc_onkeypress, true)
            };
            this.translate_color_commandvalue = function (forecolor) {
                if (forecolor == "" || forecolor == null) {
                    forecolor = window.getComputedStyle(this.editdoc.body, null).getPropertyValue("color")
                }
                if (forecolor.toLowerCase().indexOf("rgb") == 0) {
                    var matches = forecolor.match(/^rgb\s*\(([0-9]+),\s*([0-9]+),\s*([0-9]+)\)$/);
                    if (matches) {
                        return this.translate_silly_hex((matches[1] & 255).toString(16), (matches[2] & 255).toString(16), (matches[3] & 255).toString(16))
                    } else {
                        return this.translate_color_commandvalue(null)
                    }
                } else {
                    return forecolor
                }
            };
            this.translate_fontsize = function (csssize) {
                switch (csssize) {
                case "7.5pt":
                case "10px":
                    return 1;
                case "10pt":
                    return 2;
                case "12pt":
                    return 3;
                case "14pt":
                    return 4;
                case "18pt":
                    return 5;
                case "24pt":
                    return 6;
                case "36pt":
                    return 7;
                default:
                    return ""
                }
            };
            this._apply_format = this.apply_format;
            this.apply_format = function (cmd, dialog, arg) {
                this.editdoc.execCommand("useCSS", false, true);
                return this._apply_format(cmd, dialog, arg)
            };
            this._createlink = this.createlink;
            this.createlink = function (e, url) {
                if (typeof url == "undefined") {
                    url = this.show_prompt(vbphrase.enter_link_url, "http://", true)
                }
                if ((url = this.verify_prompt(url)) !== false) {
                    if (this.get_selection()) {
                        this.apply_format("unlink");
                        this._createlink(e, url)
                    } else {
                        this.insert_text('<a href="' + url + '">' + url + "</a>")
                    }
                }
                return true
            };
            this.insert_smilie = function (e, smilietext, smiliepath, smilieid) {
                this.check_focus();
                try {
                    this.apply_format("InsertImage", false, smiliepath);
                    var smilies = fetch_tags(this.editdoc.body, "img");
                    for (var i = 0; i < smilies.length; i++) {
                        if (smilies[i].src == smiliepath) {
                            smilies[i].className = "inlineimg";
                            if (smilies[i].getAttribute("smilieid") < 1) {
                                smilies[i].setAttribute("smilieid", smilieid);
                                smilies[i].setAttribute("border", "0")
                            }
                        }
                    }
                } catch (e) {}
            };
            this.get_selection = function () {
                selection = this.editwin.getSelection();
                this.check_focus();
                var range = selection ? selection.getRangeAt(0) : this.editdoc.createRange();
                return this.read_nodes(range.cloneContents(), false)
            };
            this.insert_text = function (str) {
                this.editdoc.execCommand("insertHTML", false, str)
            };
            this.set_editor_functions = function () {
                this.editdoc.addEventListener("mouseup", vB_Text_Editor_Events.prototype.editdoc_onmouseup, true);
                this.editdoc.addEventListener("keyup", vB_Text_Editor_Events.prototype.editdoc_onkeyup, true);
                this.editwin.addEventListener("focus", vB_Text_Editor_Events.prototype.editwin_onfocus, true);
                this.editwin.addEventListener("blur", vB_Text_Editor_Events.prototype.editwin_onblur, true)
            };
            this.add_range = function (node) {
                this.check_focus();
                var sel = this.editwin.getSelection();
                var range = this.editdoc.createRange();
                range.selectNodeContents(node);
                sel.removeAllRanges();
                sel.addRange(range)
            };
            this.read_nodes = function (root, toptag) {
                var html = "";
                var moz_check = /_moz/i;
                switch (root.nodeType) {
                case Node.ELEMENT_NODE:
                case Node.DOCUMENT_FRAGMENT_NODE:
                    var closed;
                    var i;
                    if (toptag) {
                        closed = !root.hasChildNodes();
                        html = "<" + root.tagName.toLowerCase();
                        var attr = root.attributes;
                        for (i = 0; i < attr.length; ++i) {
                            var a = attr.item(i);
                            if (!a.specified || a.name.match(moz_check) || a.value.match(moz_check)) {
                                continue
                            }
                            html += " " + a.name.toLowerCase() + '="' + a.value + '"'
                        }
                        html += closed ? " />" : ">"
                    }
                    for (i = root.firstChild; i; i = i.nextSibling) {
                        html += this.read_nodes(i, true)
                    }
                    if (toptag && !closed) {
                        html += "</" + root.tagName.toLowerCase() + ">"
                    }
                    break;
                case Node.TEXT_NODE:
                    html = PHP.htmlspecialchars(root.data);
                    break
                }
                return html
            };
            this.insert_node_at_selection = function (text) {
                this.check_focus();
                var sel = this.editwin.getSelection();
                var range = sel ? sel.getRangeAt(0) : this.editdoc.createRange();
                sel.removeAllRanges();
                range.deleteContents();
                var node = range.startContainer;
                var pos = range.startOffset;
                switch (node.nodeType) {
                case Node.ELEMENT_NODE:
                    if (text.nodeType == Node.DOCUMENT_FRAGMENT_NODE) {
                        selNode = text.firstChild
                    } else {
                        selNode = text
                    }
                    node.insertBefore(text, node.childNodes[pos]);
                    this.add_range(selNode);
                    break;
                case Node.TEXT_NODE:
                    if (text.nodeType == Node.TEXT_NODE) {
                        var text_length = pos + text.length;
                        node.insertData(pos, text.data);
                        range = this.editdoc.createRange();
                        range.setEnd(node, text_length);
                        range.setStart(node, text_length);
                        sel.addRange(range)
                    } else {
                        node = node.splitText(pos);
                        var selNode;
                        if (text.nodeType == Node.DOCUMENT_FRAGMENT_NODE) {
                            selNode = text.firstChild
                        } else {
                            selNode = text
                        }
                        node.parentNode.insertBefore(text, node);
                        this.add_range(selNode)
                    }
                    break
                }
            }
        } else {
            if (is_opera) {
                this._createlink = this.createlink;
                this.createlink = function (e, url) {
                    if (typeof url == "undefined") {
                        url = this.show_prompt(vbphrase.enter_link_url, "http://", true)
                    }
                    if ((url = this.verify_prompt(url)) !== false) {
                        if (this.get_selection()) {
                            this.apply_format("unlink");
                            this._createlink(e, url)
                        } else {
                            this.insert_text('<a href="' + url + '">' + url + "</a>")
                        }
                    }
                    return true
                };
                this.insert_smilie = function (e, smilietext, smiliepath, smilieid) {
                    this.check_focus();
                    try {
                        this.apply_format("InsertImage", false, smiliepath);
                        var smilies = fetch_tags(this.editdoc.body, "img");
                        for (var i = 0; i < smilies.length; i++) {
                            if (smilies[i].src == smiliepath) {
                                smilies[i].className = "inlineimg";
                                if (smilies[i].getAttribute("smilieid") < 1) {
                                    smilies[i].setAttribute("smilieid", smilieid);
                                    smilies[i].setAttribute("border", "0")
                                }
                            }
                        }
                    } catch (e) {}
                };
                this.get_selection = function () {
                    selection = this.editwin.getSelection();
                    this.check_focus();
                    range = selection ? selection.getRangeAt(0) : this.editdoc.createRange();
                    var lsserializer = document.implementation.createLSSerializer();
                    return lsserializer.writeToString(range.cloneContents())
                };
                this.insert_text = function (str) {
                    this.editdoc.execCommand("insertHTML", false, str)
                }
            }
        }
    } else {
        this.disable_editor = function (text) {
            if (!this.disabled) {
                this.disabled = true;
                if (typeof text != "undefined") {
                    this.editbox.value = text
                }
                this.editbox.disabled = true
            }
        };
        this.enable_editor = function (text) {
            if (typeof text != "undefined") {
                this.editbox.value = text
            }
            this.editbox.disabled = false;
            this.disabled = false
        };
        this.write_editor_contents = function (text) {
            this.textobj.value = text
        };
        this.set_editor_contents = function (initial_text) {
            var iframe = this.textobj.parentNode.getElementsByTagName("iframe")[0];
            if (iframe) {
                this.textobj.style.display = "";
                this.textobj.style.width = iframe.style.width;
                this.textobj.style.height = iframe.style.height;
                iframe.style.width = "0px";
                iframe.style.height = "0px";
                iframe.style.border = "none"
            }
            this.editwin = this.textobj;
            this.editdoc = this.textobj;
            this.editbox = this.textobj;
            this.spellobj = this.textobj;
            this.set_editor_width(this.textobj.style.width);
            if (typeof initial_text != "undefined") {
                this.write_editor_contents(initial_text)
            }
            this.editdoc.editorid = this.editorid;
            this.editwin.editorid = this.editorid;
            this.history.add_snapshot(this.get_editor_contents())
        };
        this.set_editor_width = function (width, overwrite_original) {
            if (typeof (this.textobj.style.oWidth) == "undefined" || overwrite_original) {
                this.textobj.style.oWidth = width
            }
            if (is_ie) {
                this.textobj.style.width = this.textobj.style.oWidth;
                var orig_offset = this.textobj.offsetWidth;
                if (orig_offset > 0) {
                    this.textobj.style.width = orig_offset + "px";
                    this.textobj.style.width = (orig_offset + orig_offset - this.textobj.offsetWidth) + "px"
                }
            } else {
                this.textobj.style.width = width
            }
        };
        this.set_editor_style = function () {};
        this.set_editor_functions = function () {
            if (this.editdoc.addEventListener) {
                this.editdoc.addEventListener("keypress", vB_Text_Editor_Events.prototype.editdoc_onkeypress, false)
            } else {
                if (is_ie) {
                    this.editdoc.onkeydown = vB_Text_Editor_Events.prototype.editdoc_onkeypress
                }
            }
            this.editwin.onfocus = vB_Text_Editor_Events.prototype.editwin_onfocus;
            this.editwin.onblur = vB_Text_Editor_Events.prototype.editwin_onblur
        };
        this.set_context = function () {};
        this.apply_format = function (cmd, dialog, argument) {
            switch (cmd) {
            case "bold":
            case "italic":
            case "underline":
                this.wrap_tags(cmd.substr(0, 1), false);
                return;
            case "justifyleft":
            case "justifycenter":
            case "justifyright":
                this.wrap_tags(cmd.substr(7), false);
                return;
            case "indent":
                this.wrap_tags(cmd, false);
                return;
            case "fontname":
                this.wrap_tags("font", argument);
                return;
            case "fontsize":
                this.wrap_tags("size", argument);
                return;
            case "forecolor":
                this.wrap_tags("color", argument);
                return;
            case "createlink":
                var sel = this.get_selection();
                if (sel) {
                    this.wrap_tags("url", argument)
                } else {
                    this.wrap_tags("url", argument, argument)
                }
                return;
            case "insertimage":
                this.wrap_tags("img", false, argument);
                return;
            case "removeformat":
                return
            }
        };
        this.undo = function () {
            this.history.add_snapshot(this.get_editor_contents());
            this.history.move_cursor(-1);
            var str;
            if ((str = this.history.get_snapshot()) !== false) {
                this.editdoc.value = str
            }
        };
        this.redo = function () {
            this.history.move_cursor(1);
            var str;
            if ((str = this.history.get_snapshot()) !== false) {
                this.editdoc.value = str
            }
        };
        this.strip_simple = function (tag, str, iterations) {
            var opentag = "[" + tag + "]";
            var closetag = "[/" + tag + "]";
            if (typeof iterations == "undefined") {
                iterations = -1
            }
            while ((startindex = PHP.stripos(str, opentag)) !== false && iterations != 0) {
                iterations--;
                if ((stopindex = PHP.stripos(str, closetag)) !== false) {
                    var text = str.substr(startindex + opentag.length, stopindex - startindex - opentag.length);
                    str = str.substr(0, startindex) + text + str.substr(stopindex + closetag.length)
                } else {
                    break
                }
            }
            return str
        };
        this.strip_complex = function (tag, str, iterations) {
            var opentag = "[" + tag + "=";
            var closetag = "[/" + tag + "]";
            if (typeof iterations == "undefined") {
                iterations = -1
            }
            while ((startindex = PHP.stripos(str, opentag)) !== false && iterations != 0) {
                iterations--;
                if ((stopindex = PHP.stripos(str, closetag)) !== false) {
                    var openend = PHP.stripos(str, "]", startindex);
                    if (openend !== false && openend > startindex && openend < stopindex) {
                        var text = str.substr(openend + 1, stopindex - openend - 1);
                        str = str.substr(0, startindex) + text + str.substr(stopindex + closetag.length)
                    } else {
                        break
                    }
                } else {
                    break
                }
            }
            return str
        };
        this.removeformat = function (e) {
            var simplestrip = new Array("b", "i", "u");
            var complexstrip = new Array("font", "color", "size");
            var str = this.get_selection();
            if (str === false) {
                return
            }
            var tag;
            for (tag in simplestrip) {
                if (YAHOO.lang.hasOwnProperty(simplestrip, tag)) {
                    str = this.strip_simple(simplestrip[tag], str)
                }
            }
            for (tag in complexstrip) {
                if (YAHOO.lang.hasOwnProperty(complexstrip, tag)) {
                    str = this.strip_complex(complexstrip[tag], str)
                }
            }
            this.insert_text(str)
        };
        this.createlink = function (e, url) {
            this.prompt_link("url", url, vbphrase.enter_link_url, "http://")
        };
        this.unlink = function (e) {
            var sel = this.get_selection();
            sel = this.strip_simple("url", sel);
            sel = this.strip_complex("url", sel);
            this.insert_text(sel)
        };
        this.email = function (e, email) {
            this.prompt_link("email", email, vbphrase.enter_email_link, "")
        };
        this.insert_smilie = function (e, smilietext) {
            this.check_focus();
            return this.insert_text(smilietext, smilietext.length, 0)
        };
        this.prompt_link = function (tagname, value, phrase, iprompt) {
            if (typeof value == "undefined") {
                value = this.show_prompt(phrase, iprompt, true)
            }
            if ((value = this.verify_prompt(value)) !== false) {
                if (this.get_selection()) {
                    this.apply_format("unlink");
                    this.wrap_tags(tagname, value)
                } else {
                    this.wrap_tags(tagname, value, value)
                }
            }
            return true
        };
        this.insertorderedlist = function (e) {
            this.insertlist(vbphrase.insert_ordered_list, "1")
        };
        this.insertunorderedlist = function (e) {
            this.insertlist(vbphrase.insert_unordered_list, "")
        };
        this.insertlist = function (phrase, listtype) {
            var opentag = "[LIST" + (listtype ? ("=" + listtype) : "") + "]\n";
            var closetag = "[/LIST]";
            var txt;
            if (txt = this.get_selection()) {
                var regex = new RegExp("([\r\n]+|^[\r\n]*)(?!\\[\\*\\]|\\[\\/?list)(?=[^\r\n])", "gi");
                txt = opentag + PHP.trim(txt).replace(regex, "$1[*]") + "\n" + closetag;
                this.insert_text(txt, txt.vBlength(), 0)
            } else {
                this.insert_text(opentag + closetag, opentag.length, closetag.length);
                if (YAHOO.env.ua.ie >= 7) {
                    var base_tag = fetch_tags(document, "base");
                    var modal_prefix;
                    if (base_tag && base_tag[0] && base_tag[0].href) {
                        modal_prefix = base_tag[0].href
                    } else {
                        modal_prefix = ""
                    }
                    var listvalue = window.showModalDialog(modal_prefix + "clientscript/ieprompt.html?", {
                        value: "",
                        label: vbphrase.enter_list_item,
                        dir: document.dir,
                        title: document.title,
                        listtype: listtype
                    }, "dialogWidth:320px; dialogHeight:232px; dialogTop:" + (parseInt(window.screenTop) + parseInt(window.event.clientY) + parseInt(document.body.scrollTop) - 100) + "px; dialogLeft:" + (parseInt(window.screenLeft) + parseInt(window.event.clientX) + parseInt(document.body.scrollLeft) - 160) + "px; resizable: No;");
                    if (this.verify_prompt(listvalue)) {
                        this.insert_text(listvalue, listvalue.vBlength(), 0)
                    }
                } else {
                    while (listvalue = this.show_prompt(vbphrase.enter_list_item, "", false)) {
                        listvalue = "[*]" + listvalue + "\n";
                        this.insert_text(listvalue, listvalue.vBlength(), 0)
                    }
                }
            }
        };
        this.outdent = function (e) {
            var sel = this.get_selection();
            sel = this.strip_simple("indent", sel, 1);
            this.insert_text(sel)
        };
        this.get_editor_contents = function () {
            return this.editdoc.value
        };
        this.get_selection = function () {
            if (typeof (this.editdoc.selectionStart) != "undefined") {
                return this.editdoc.value.substr(this.editdoc.selectionStart, this.editdoc.selectionEnd - this.editdoc.selectionStart)
            } else {
                if (document.selection && document.selection.createRange) {
                    return document.getSelection()//document.selection.createRange().text
                } else {
                    if (window.getSelection) {
                        return window.getSelection() + ""
                    } else {
                        return false
                    }
                }
            }
        };
        this.insert_text = function (text, movestart, moveend) {
            var selection_changed = false;
            this.check_focus();
            if (typeof (this.editdoc.selectionStart) != "undefined") {
                var opn = this.editdoc.selectionStart + 0;
                var scrollpos = this.editdoc.scrollTop;
                this.editdoc.value = this.editdoc.value.substr(0, this.editdoc.selectionStart) + text + this.editdoc.value.substr(this.editdoc.selectionEnd);
                if (movestart === false) {} else {
                    if (typeof movestart != "undefined") {
                        this.editdoc.selectionStart = opn + movestart;
                        this.editdoc.selectionEnd = opn + text.vBlength() - moveend
                    } else {
                        this.editdoc.selectionStart = opn;
                        this.editdoc.selectionEnd = opn + text.vBlength()
                    }
                }
                this.editdoc.scrollTop = scrollpos
            } else {
                if (document.selection && document.selection.createRange) {
                    var sel = document.getSelection();//document.selection.createRange();
                    sel.text = text.replace(/\r?\n/g, "\r\n");
                    if (movestart === false) {} else {
                        if (typeof movestart != "undefined") {
                            if ((movestart - text.vBlength()) != 0) {
                                sel.moveStart("character", movestart - text.vBlength());
                                selection_changed = true
                            }
                            if (moveend != 0) {
                                sel.moveEnd("character", -moveend);
                                selection_changed = true
                            }
                        } else {
                            sel.moveStart("character", -text.vBlength());
                            selection_changed = true
                        }
                    } if (selection_changed) {
                        sel.select()
                    }
                } else {
                    this.editdoc.value += text
                }
            }
        };
        this.prepare_submit = function (subjecttext, minchars) {
            var returnvalue = validatemessage(this.textobj.value, subjecttext, minchars);
            if (returnvalue) {
                return returnvalue
            } else {
                if (this.captcha != null && this.captcha.failed) {
                    return returnvalue
                } else {
                    this.check_focus();
                    return false
                }
            }
        };
        if (is_saf || (is_opera && (!opera.version || opera.version() < 8))) {
            this.insertlist = function (phrase, listtype) {
                var opentag = "[LIST" + (listtype ? ("=" + listtype) : "") + "]\n";
                var closetag = "[/LIST]";
                var txt;
                if (txt = this.get_selection()) {
                    var regex = new RegExp("([\r\n]+|^[\r\n]*)(?!\\[\\*\\]|\\[\\/?list)(?=[^\r\n])", "gi");
                    txt = opentag + PHP.trim(txt).replace(regex, "$1[*]") + "\n" + closetag;
                    this.insert_text(txt, txt.vBlength(), 0)
                } else {
                    this.insert_text(opentag, opentag.length, 0);
                    while (listvalue = prompt(vbphrase.enter_list_item, "")) {
                        listvalue = "[*]" + listvalue + "\n";
                        this.insert_text(listvalue, listvalue.vBlength(), 0)
                    }
                    this.insert_text(closetag, closetag.length, 0)
                }
            }
        }
    }
    this.init()	
}

function vB_Text_Editor_Events() {}
vB_Text_Editor_Events.prototype.smilie_onclick = function (A) {
    vB_Editor[this.editorid].insert_smilie(A, this.alt, this.src, this.id.substr(this.id.lastIndexOf("_") + 1));
    if (typeof smilie_window != "undefined" && !smilie_window.closed) {
        smilie_window.focus()
    }
    return false
};
vB_Text_Editor_Events.prototype.command_button_onmouseevent = function (A) {
    A = do_an_e(A);
    if (A.type == "click") {
        vB_Editor[this.editorid].format(A, this.cmd, false, true)
    }
    vB_Editor[this.editorid].button_context(this, A.type)
};
vB_Text_Editor_Events.prototype.popup_button_onmouseevent = function (A) {
    A = do_an_e(A);
    if (A.type == "click") {
        this._onclick(A);
        vB_Editor[this.editorid].menu_context(this, "mouseover")
    } else {
        vB_Editor[this.editorid].menu_context(this, A.type)
    }
};
vB_Text_Editor_Events.prototype.popup_button_show = function (C, B) {
    var A = true;
    if (typeof vB_Editor[C.editorid].popups[C.cmd] == "undefined" || vB_Editor[C.editorid].popups[C.cmd] == null) {
        A = vB_Editor[C.editorid].init_popup_menu(C)
    } else {
        if (C.cmd == "attach" && (typeof vB_Attachments == "undefined" || !vB_Attachments.has_attachments())) {
            fetch_object("manage_attachments_button").onclick();
            return
        }
    } if (A) {
        this._show(C, B)
    }
};
vB_Text_Editor_Events.prototype.formatting_select_onchange = function (B) {
    var A = this.options[this.selectedIndex].value;
    if (A != "") {
        vB_Editor[this.editorid].format(B, this.cmd, A)
    }
    this.selectedIndex = 0
};
vB_Text_Editor_Events.prototype.smilieselect_onchange = function (A) {
    if (this.options[this.selectedIndex].value != "") {
        vB_Editor[this.editorid].insert_smilie(A, this.options[this.selectedIndex].value, this.options[this.selectedIndex].smiliepath, this.options[this.selectedIndex].smilieid)
    }
    this.selectedIndex = 0
};
vB_Text_Editor_Events.prototype.attachselect_onchange = function (B) {
    var A = this.options[this.selectedIndex].value;
    if (A != "") {
        vB_Editor[this.editorid].wrap_tags("attach", false, A)
    }
    this.selectedIndex = 0
};
vB_Text_Editor_Events.prototype.attachselect_onmouseover = function (A) {
    if (this.options.length <= 2) {
        vB_Editor[this.editorid].build_attachments_popup(this);
        return true
    }
};
vB_Text_Editor_Events.prototype.menuoption_onmouseevent = function (A) {
    A = do_an_e(A);
    vB_Editor[this.editorid].button_context(this, A.type, "menu")
};
vB_Text_Editor_Events.prototype.formatting_option_onclick = function (A) {
    vB_Editor[this.editorid].format(A, this.cmd, this.firstChild.innerHTML);
    vBmenu.hide()
};
vB_Text_Editor_Events.prototype.coloroption_onclick = function (A) {
    fetch_object(this.editorid + "_color_bar").style.backgroundColor = this.colorname;
    vB_Editor[this.editorid].format(A, this.cmd, this.colorname);
    vBmenu.hide()
};
vB_Text_Editor_Events.prototype.colorout_onclick = function (A) {
    A = do_an_e(A);
    vB_Editor[this.editorid].format(A, "forecolor", fetch_object(this.editorid + "_color_bar").style.backgroundColor);
    return false
};
vB_Text_Editor_Events.prototype.smilieoption_onclick = function (A) {
    vB_Editor[this.editorid].button_context(this, "mouseout", "menu");
    vB_Editor[this.editorid].insert_smilie(A, this.smilietext, fetch_tags(this, "img")[0].src, this.smilieid);
    vBmenu.hide()
};
vB_Text_Editor_Events.prototype.smiliemore_onclick = function (A) {
    vB_Editor[this.editorid].open_smilie_window(smiliewindow_x, smiliewindow_y);
    vBmenu.hide()
};
vB_Text_Editor_Events.prototype.attachmanage_onclick = function (A) {
    vBmenu.hide();
    fetch_object("manage_attachments_button").onclick()
};
vB_Text_Editor_Events.prototype.attachoption_onclick = function (A) {
    vB_Editor[this.editorid].button_context(this, "mouseout", "menu");
    vB_Editor[this.editorid].wrap_tags("attach", false, this.attachmentid);
    vBmenu.hide()
};
vB_Text_Editor_Events.prototype.attachinsertall_onclick = function (C) {
    var B = "";
    var A = (vB_Editor[this.editorid].wysiwyg_mode ? "<br /><br />" : "\r\n\r\n");
    for (var D in vB_Attachments.attachments) {
        if (YAHOO.lang.hasOwnProperty(vB_Attachments.attachments, D)) {
            B += B != "" ? A : "";
            B += "[ATTACH]" + D + "[/ATTACH]"
        }
    }
    vB_Editor[this.editorid].insert_text(B);
    vBmenu.hide()
};
vB_Text_Editor_Events.prototype.smiliewindow_onunload = function (A) {
    if (typeof smilie_window != "undefined" && !smilie_window.closed) {
        smilie_window.close()
    }
};
vB_Text_Editor_Events.prototype.editwin_onfocus = function (A) {
    this.hasfocus = true
};
vB_Text_Editor_Events.prototype.editwin_onblur = function (A) {
    this.hasfocus = false
};
vB_Text_Editor_Events.prototype.editdoc_onmouseup = function (A) {
    vB_Editor[this.editorid].set_context();
    if (vB_Editor[this.editorid].popupmode) {
        vBmenu.hide()
    }
};
vB_Text_Editor_Events.prototype.editdoc_onkeyup = function (A) {
    vB_Editor[this.editorid].set_context()
};
vB_Text_Editor_Events.prototype.editdoc_onkeypress = function (C) {
    if (!C) {
        C = window.event
    }
    if (C.ctrlKey && !C.altKey) {
        if (vB_Editor[this.editorid].allowbasicbbcode == false) {
            return
        }
        var A = C.charCode ? C.charCode : C.keyCode;
        var B;
        switch (String.fromCharCode(A).toLowerCase()) {
        case "b":
            B = "bold";
            break;
        case "i":
            B = "italic";
            break;
        case "u":
            B = "underline";
            break;
        default:
            return
        }
        C = do_an_e(C);
        vB_Editor[this.editorid].apply_format(B, false, null);
        return false
    } else {
        if (C.keyCode == 9) {
            if (C.shiftKey || (C.modifiers && (C.modifiers & 4))) {
                return
            }
            if (is_opera) {
                return
            }
            if (fetch_object("tag_add_input") != null) {
                fetch_object("tag_add_input").focus()
            } else {
                if (fetch_object("rb_iconid_0") != null) {
                    fetch_object("rb_iconid_0").focus()
                } else {
                    if (fetch_object(this.editorid + "_save") != null) {
                        fetch_object(this.editorid + "_save").focus()
                    } else {
                        if (fetch_object("qr_submit") != null) {
                            fetch_object("qr_submit").focus()
                        } else {
                            return
                        }
                    }
                }
            }
            C = do_an_e(C);
            return
        }
    }
};
vB_Text_Editor_Events.prototype.editdoc_onresizestart = function (A) {
    if (A.srcElement.tagName == "IMG") {
        return false
    }
};

function save_iframe_to_textarea() {
    for (var A in vB_Editor) {
        if (!YAHOO.lang.hasOwnProperty(vB_Editor, A)) {
            continue
        }
        if (vB_Editor[A].wysiwyg_mode && vB_Editor[A].initialized) {
            vB_Editor[A].textobj.value = vB_Editor[A].get_editor_contents()
        }
    }
}
if (window.attachEvent) {
    window.attachEvent("onbeforeunload", save_iframe_to_textarea)
} else {
    if (window.addEventListener) {
        window.addEventListener("unload", save_iframe_to_textarea, true)
    }
}

function switch_editor_mode(A) {
    if (AJAX_Compatible) {
        var B = (vB_Editor[A].wysiwyg_mode ? 0 : 1);
        if (vB_Editor[A].influx == 1) {
            return
        } else {
            vB_Editor[A].influx = 1
        } if (typeof vBmenu != "undefined") {
            vBmenu.hide()
        }
        YAHOO.util.Connect.asyncRequest("POST", "ajax.php?do=editorswitch", {
            success: do_switch_editor_mode,
            timeout: vB_Default_Timeout,
            argument: [A, B]
        }, SESSIONURL + "securitytoken=" + SECURITYTOKEN + "&do=editorswitch&towysiwyg=" + B + "&parsetype=" + vB_Editor[A].parsetype + "&allowsmilie=" + vB_Editor[A].parsesmilies + "&message=" + PHP.urlencode(vB_Editor[A].get_editor_contents()) + (vB_Editor[A].ajax_extra ? ("&" + vB_Editor[A].ajax_extra) : "") + (typeof vB_Editor[A].textobj.form["options[allowbbcode]"] != "undefined" ? "&allowbbcode=" + vB_Editor[A].textobj.form["options[allowbbcode]"].checked : ""))
    }
}

function do_switch_editor_mode(H) {
    if (H.responseXML) {
        var C = vB_Editor[H.argument[0]].parsetype;
        var D = vB_Editor[H.argument[0]].parsesmilies;
        var G = vB_Editor[H.argument[0]].ajax_extra;
        vB_Editor[H.argument[0]].destroy();
        var A = H.responseXML.getElementsByTagName("message")[0];
        if (typeof A != "undefined") {
            A = A.firstChild
        }
        var F = (A ? A.nodeValue : "");
        var E = F.match(/&#([0-9]+);/g);
        if (E) {
            for (var B = 0; typeof E[B] != "undefined"; B++) {
                if (submatch = E[B].match(/^&#([0-9]+);$/)) {
                    F = F.replace(submatch[0], String.fromCharCode(submatch[1]))
                }
            }
        }
        vB_Editor[H.argument[0]] = new vB_Text_Editor(H.argument[0], H.argument[1], C, D, F, G);
        vB_Editor[H.argument[0]].check_focus();
        fetch_object(H.argument[0] + "_mode").value = H.argument[1]
    }
}
var contextcontrols = new Array("bold", "italic", "underline", "justifyleft", "justifycenter", "justifyright", "insertorderedlist", "insertunorderedlist");
var coloroptions = new Array();
coloroptions = {
    "#000000": "Black",
    "#A0522D": "Sienna",
    "#556B2F": "DarkOliveGreen",
    "#006400": "DarkGreen",
    "#483D8B": "DarkSlateBlue",
    "#000080": "Navy",
    "#4B0082": "Indigo",
    "#2F4F4F": "DarkSlateGray",
    "#8B0000": "DarkRed",
    "#FF8C00": "DarkOrange",
    "#808000": "Olive",
    "#008000": "Green",
    "#008080": "Teal",
    "#0000FF": "Blue",
    "#708090": "SlateGray",
    "#696969": "DimGray",
    "#FF0000": "Red",
    "#F4A460": "SandyBrown",
    "#9ACD32": "YellowGreen",
    "#2E8B57": "SeaGreen",
    "#48D1CC": "MediumTurquoise",
    "#4169E1": "RoyalBlue",
    "#800080": "Purple",
    "#808080": "Gray",
    "#FF00FF": "Magenta",
    "#FFA500": "Orange",
    "#FFFF00": "Yellow",
    "#00FF00": "Lime",
    "#00FFFF": "Cyan",
    "#00BFFF": "DeepSkyBlue",
    "#9932CC": "DarkOrchid",
    "#C0C0C0": "Silver",
    "#FFC0CB": "Pink",
    "#F5DEB3": "Wheat",
    "#FFFACD": "LemonChiffon",
    "#98FB98": "PaleGreen",
    "#AFEEEE": "PaleTurquoise",
    "#ADD8E6": "LightBlue",
    "#DDA0DD": "Plum",
    "#FFFFFF": "White"
};

function vB_History() {
    this.cursor = -1;
    this.stack = new Array()
}
vB_History.prototype.move_cursor = function (A) {
    var B = this.cursor + A;
    if (B >= 0 && this.stack[B] != null && typeof this.stack[B] != "undefined") {
        this.cursor += A
    }
};
vB_History.prototype.add_snapshot = function (A) {
    if (this.stack[this.cursor] == A) {
        return
    } else {
        this.cursor++;
        this.stack[this.cursor] = A;
        if (typeof this.stack[this.cursor + 1] != "undefined") {
            this.stack[this.cursor + 1] = null
        }
    }
};
vB_History.prototype.get_snapshot = function () {
    if (typeof this.stack[this.cursor] != "undefined" && this.stack[this.cursor] != null) {
        return this.stack[this.cursor]
    } else {
        return false
    }
};


/* vbulletin_quick_edit.js
------------------------------------------------------------------------------*/

function vB_AJAX_QuickEdit_Init(C) {
    if (AJAX_Compatible) {
        if (typeof C == "string") {
            C = fetch_object(C)
        }
        var B = fetch_tags(C, "a");
        for (var A = 0; A < B.length; A++) {
            if (B[A].name && B[A].name.indexOf("vB::QuickEdit::") != -1) {
                B[A].onclick = vB_AJAX_QuickEditor_Events.prototype.editbutton_click
            }
        }
    }
}

function vB_AJAX_QuickEditor() {
    this.postid = null;
    this.messageobj = null;
    this.container = null;
    this.originalhtml = null;
    this.editstate = false;
    this.editorcounter = 0;
    this.ajax_req = null;
    this.show_advanced = true
}
vB_AJAX_QuickEditor.prototype.ready = function () {
    if (this.editstate || YAHOO.util.Connect.isCallInProgress(this.ajax_req)) {
        return false
    } else {
        return true
    }
};
vB_AJAX_QuickEditor.prototype.edit = function (A) {
    if (typeof vb_disable_ajax != "undefined" && vb_disable_ajax > 0) {
        return true
    }
    var B = A.substr(A.lastIndexOf("::") + 2);
    if (YAHOO.util.Connect.isCallInProgress(this.ajax_req)) {
        return false
    } else {
        if (!this.ready()) {
            if (this.postid == B) {
                this.full_edit();
                return false
            }
            this.abort()
        }
    }
    this.editorcounter++;
    this.editorid = "vB_Editor_QE_" + this.editorcounter;
    this.postid = B;
    this.messageobj = fetch_object("post_message_" + this.postid);
    this.originalhtml = this.messageobj.innerHTML;
    this.unchanged = null;
    this.unchanged_reason = null;
    this.fetch_editor();
    this.editstate = true;
    return false
};
vB_AJAX_QuickEditor.prototype.fetch_editor = function () {
    /*var timesRun = 0;
		
	var checkExist = setInterval(function() {
		scriptsBottomfunction2(checkExist);
		timesRun += 1;
		if(timesRun === 30){
			clearInterval(checkExist);
		}
	}, 100);*/
	
	if (fetch_object("progress_" + this.postid)) {
        fetch_object("progress_" + this.postid).style.display = ""
    }
    document.body.style.cursor = "wait";
    YAHOO.util.Connect.asyncRequest("POST", "ajax.php?do=quickedit&p=" + this.postid, {
        success: this.display_editor,
        failure: this.error_opening_editor,
        timeout: vB_Default_Timeout,
        scope: this
    }, SESSIONURL + "securitytoken=" + SECURITYTOKEN + "&do=quickedit&p=" + this.postid + "&editorid=" + PHP.urlencode(this.editorid))
};
vB_AJAX_QuickEditor.prototype.error_opening_editor = function (A) {
    vBulletin_AJAX_Error_Handler(A);
    window.location = "editpost.php?" + SESSIONURL + "do=editpost&postid=" + this.postid
};
vB_AJAX_QuickEditor.prototype.handle_save_error = function (A) {
    vBulletin_AJAX_Error_Handler(A);
    this.show_advanced = false;
    this.full_edit()
};
vB_AJAX_QuickEditor.prototype.display_editor = function (C) {
    if (C.responseXML) {
        if (fetch_object("progress_" + vB_QuickEditor.postid)) {
            fetch_object("progress_" + vB_QuickEditor.postid).style.display = "none"
        }
        document.body.style.cursor = "auto";
        if (fetch_tag_count(C.responseXML, "disabled")) {
            window.location = "editpost.php?" + SESSIONURL + "do=editpost&postid=" + this.postid
        } else {
            if (fetch_tag_count(C.responseXML, "error")) {} else {
                var B = fetch_tags(C.responseXML, "editor")[0];
                if (typeof B == "undefined") {
                    window.location = "editpost.php?" + SESSIONURL + "do=editpost&postid=" + this.postid;
                    return false
                }
                var D = B.getAttribute("reason");
                //this.messageobj.innerHTML = B.firstChild.nodeValue;
				this.messageobj.insertAdjacentHTML('afterbegin',B.firstChild.nodeValue);				
                if (fetch_object(this.editorid + "_edit_reason")) {
                    this.unchanged_reason = PHP.unhtmlspecialchars(D);
                    fetch_object(this.editorid + "_edit_reason").value = this.unchanged_reason;
                    fetch_object(this.editorid + "_edit_reason").onkeypress = vB_AJAX_QuickEditor_Events.prototype.reason_key_trap
                }
                vB_Editor[this.editorid] = new vB_Text_Editor(this.editorid, B.getAttribute("mode"), B.getAttribute("parsetype"), B.getAttribute("parsesmilies"));
                if (fetch_object(this.editorid + "_editor") && fetch_object(this.editorid + "_editor").scrollIntoView) {
                    fetch_object(this.editorid + "_editor").scrollIntoView(true)
                }
                vB_Editor[this.editorid].set_editor_width("100%", true);
                vB_Editor[this.editorid].check_focus();
                this.unchanged = vB_Editor[this.editorid].get_editor_contents();
                fetch_object(this.editorid + "_save").onclick = this.save;
                fetch_object(this.editorid + "_abort").onclick = this.abort;
                fetch_object(this.editorid + "_adv").onclick = this.full_edit;
                var A = fetch_object(this.editorid + "_delete");
                if (A) {
                    A.onclick = this.show_delete
                }							
            }
        }
    }
};
vB_AJAX_QuickEditor.prototype.restore = function (B, A) {
    this.hide_errors(true);
    if (this.editorid && vB_Editor[this.editorid] && vB_Editor[this.editorid].initialized) {
        vB_Editor[this.editorid].destroy()
    }
    if (A == "tableobj") {
        fetch_object("edit" + this.postid).innerHTML = B
    } else {
        this.messageobj.innerHTML = B
    }
    this.editstate = false
};
vB_AJAX_QuickEditor.prototype.abort = function (A) {
    if (fetch_object("progress_" + vB_QuickEditor.postid)) {
        fetch_object("progress_" + vB_QuickEditor.postid).style.display = "none"
    }
    document.body.style.cursor = "auto";
    vB_QuickEditor.restore(vB_QuickEditor.originalhtml, "messageobj");
    PostBit_Init(fetch_object("post" + vB_QuickEditor.postid), vB_QuickEditor.postid)
};
vB_AJAX_QuickEditor.prototype.full_edit = function (B) {
    var A = new vB_Hidden_Form("editpost.php?do=updatepost&postid=" + vB_QuickEditor.postid);
    A.add_variable("do", "updatepost");
    A.add_variable("s", fetch_sessionhash());
    A.add_variable("securitytoken", SECURITYTOKEN);
    if (vB_QuickEditor.show_advanced) {
        A.add_variable("advanced", 1)
    } else {
        A.add_variable("quickeditnoajax", 1)
    }
    A.add_variable("postid", vB_QuickEditor.postid);
    A.add_variable("wysiwyg", vB_Editor[vB_QuickEditor.editorid].wysiwyg_mode);
    A.add_variable("message", vB_Editor[vB_QuickEditor.editorid].get_editor_contents());
    A.add_variable("reason", fetch_object(vB_QuickEditor.editorid + "_edit_reason").value);
    A.submit_form()
};
vB_AJAX_QuickEditor.prototype.save = function (B) {
    var C = vB_Editor[vB_QuickEditor.editorid].get_editor_contents();
    var A = vB_Editor[vB_QuickEditor.editorid];
    if (C == vB_QuickEditor.unchanged && A == vB_QuickEditor.unchanged_reason) {
        vB_QuickEditor.abort(B)
    } else {
        fetch_object(vB_QuickEditor.editorid + "_posting_msg").style.display = "";
        document.body.style.cursor = "wait";
        pc_obj = fetch_object("postcount" + vB_QuickEditor.postid);
        this.ajax_req = YAHOO.util.Connect.asyncRequest("POST", "editpost.php?do=updatepost&postid=" + this.postid, {
            success: vB_QuickEditor.update,
            failure: vB_QuickEditor.handle_save_error,
            timeout: vB_Default_Timeout,
            scope: vB_QuickEditor
        }, SESSIONURL + "securitytoken=" + SECURITYTOKEN + "&do=updatepost&ajax=1&postid=" + vB_QuickEditor.postid + "&wysiwyg=" + vB_Editor[vB_QuickEditor.editorid].wysiwyg_mode + "&message=" + PHP.urlencode(C) + "&reason=" + PHP.urlencode(fetch_object(vB_QuickEditor.editorid + "_edit_reason").value) + (pc_obj != null ? "&postcount=" + PHP.urlencode(pc_obj.name) : ""));
			
        vB_QuickEditor.pending = true
    }
};
vB_AJAX_QuickEditor.prototype.show_delete = function () {
    vB_QuickEditor.deletedialog = fetch_object("quickedit_delete");
    if (vB_QuickEditor.deletedialog && vB_QuickEditor.deletedialog.style.display != "") {
        vB_QuickEditor.deletedialog.style.display = "";
        vB_QuickEditor.deletebutton = fetch_object("quickedit_dodelete");
        vB_QuickEditor.deletebutton.onclick = vB_QuickEditor.delete_post;
        if (fetch_object("del_reason")) {
            fetch_object("del_reason").onkeypress = vB_AJAX_QuickEditor_Events.prototype.delete_items_key_trap
        }
        if (!is_opera && !is_saf) {
            vB_QuickEditor.deletebutton.disabled = true;
            vB_QuickEditor.deleteoptions = new Array();
            vB_QuickEditor.deleteoptions.leave = fetch_object("rb_del_leave");
            vB_QuickEditor.deleteoptions.soft = fetch_object("rb_del_soft");
            vB_QuickEditor.deleteoptions.hard = fetch_object("rb_del_hard");
            for (var A in vB_QuickEditor.deleteoptions) {
                if (YAHOO.lang.hasOwnProperty(vB_QuickEditor.deleteoptions, A) && vB_QuickEditor.deleteoptions[A]) {
                    vB_QuickEditor.deleteoptions[A].onclick = vB_QuickEditor.deleteoptions[A].onchange = vB_AJAX_QuickEditor_Events.prototype.delete_button_handler;
                    vB_QuickEditor.deleteoptions[A].onkeypress = vB_AJAX_QuickEditor_Events.prototype.delete_items_key_trap
                }
            }
        }
    }
};
vB_AJAX_QuickEditor.prototype.delete_post = function () {
    var A = fetch_object("rb_del_leave");
    if (A && A.checked) {
        vB_QuickEditor.abort();
        return
    }
    var B = new vB_Hidden_Form("editpost.php");
    B.add_variable("do", "deletepost");
    B.add_variable("s", fetch_sessionhash());
    B.add_variable("securitytoken", SECURITYTOKEN);
    B.add_variable("postid", vB_QuickEditor.postid);
    B.add_variables_from_object(vB_QuickEditor.deletedialog);
    B.submit_form()
};
vB_AJAX_QuickEditor.prototype.update = function (C) {
    if (C.responseXML) {
        vB_QuickEditor.pending = false;
        document.body.style.cursor = "auto";
        fetch_object(vB_QuickEditor.editorid + "_posting_msg").style.display = "none";
        if (fetch_tag_count(C.responseXML, "error")) {
            var D = fetch_tags(C.responseXML, "error");
            var A = "<ol>";
            for (var B = 0; B < D.length; B++) {
                A += "<li>" + D[B].firstChild.nodeValue + "</li>"
            }
            A += "</ol>";
            vB_QuickEditor.show_errors("<ol>" + A + "</ol>")
        } else {
            vB_QuickEditor.restore(C.responseXML.getElementsByTagName("postbit")[0].firstChild.nodeValue, "tableobj");
            PostBit_Init(fetch_object("post" + vB_QuickEditor.postid), vB_QuickEditor.postid)
        }
    }
	// TRIGGER LAZY LOAD image
	var img=fetch_object("post" + vB_QuickEditor.postid).getElementsByClassName("photo");
	if (img!="undefined" && img.length>0){
		for (var i=0;i<img.length;i++){
			img[i].src=img[i].getAttribute("data-original");
		}
	}			
    return false
};
vB_AJAX_QuickEditor.prototype.show_errors = function (A) {
    set_unselectable("ajax_post_errors_closebtn");
    fetch_object("ajax_post_errors_message").innerHTML = A;
    var B = fetch_object("ajax_post_errors");
    B.style.width = "400px";
    B.style.zIndex = 500;
    var C = (is_saf ? "body" : "documentElement");
    B.style.left = (is_ie ? document.documentElement.clientWidth : self.innerWidth) / 2 - 200 + document[C].scrollLeft + "px";
    B.style.top = (is_ie ? document.documentElement.clientHeight : self.innerHeight) / 2 - 150 + document[C].scrollTop + "px";
    B.style.display = ""
};
vB_AJAX_QuickEditor.prototype.hide_errors = function (A) {
    this.errors = false;
    fetch_object("ajax_post_errors").style.display = "none";
    if (A != true) {
        vB_Editor[this.editorid].check_focus()
    }
};

function vB_AJAX_QuickEditor_Events() {}
vB_AJAX_QuickEditor_Events.prototype.editbutton_click = function (A) {
    return vB_QuickEditor.edit(this.name)
};
vB_AJAX_QuickEditor_Events.prototype.delete_button_handler = function (A) {
    if (this.id == "rb_del_leave" && this.checked) {
        vB_QuickEditor.deletebutton.disabled = true
    } else {
        vB_QuickEditor.deletebutton.disabled = false
    }
};
vB_AJAX_QuickEditor_Events.prototype.reason_key_trap = function (A) {
    A = A ? A : window.event;
    switch (A.keyCode) {
    case 9:
        fetch_object(vB_QuickEditor.editorid + "_save").focus();
        return false;
        break;
    case 13:
        vB_QuickEditor.save();
        return false;
        break;
    default:
        return true
    }
};
vB_AJAX_QuickEditor_Events.prototype.delete_items_key_trap = function (A) {
    A = A ? A : window.event;
    if (A.keyCode == 13) {
        if (vB_QuickEditor.deletebutton.disabled == false) {
            vB_QuickEditor.delete_post()
        }
        return false
    }
    return true
};
var vB_QuickEditor = new vB_AJAX_QuickEditor();

/* vbulletin_quick_reply.js
------------------------------------------------------------------------------*/
var qr_repost = false;
var qr_errors_shown = false;
var qr_active = false;
var qr_ajax = null;
var clickedelm = false;

function qr_init() {
    qr_disable_controls();
    qr_init_buttons(fetch_object("posts"))
}

function qr_init_buttons(C) {
    var B = fetch_tags(C, "a");
    for (var A = 0; A < B.length; A++) {
        if (B[A].id && B[A].id.substr(0, 3) == "qr_") {
            B[A].onclick = function (D) {
                return qr_activate(this.id.substr(3))
            }
        }
    }
}

function qr_disable_controls() {
    if (require_click) {
        fetch_object("qr_postid").value = 0;
        vB_Editor[QR_EditorID].disable_editor(vbphrase.click_quick_reply_icon);
        var A = fetch_object("cb_signature");
        if (A != null) {
            A.disabled = true
        }
        active = false;
        qr_active = false
    } else {
        vB_Editor[QR_EditorID].write_editor_contents("");
        qr_active = true
    } if (threaded_mode != 1) {
        fetch_object("qr_quickreply").disabled = true
    }
}

function qr_activate(C) {
    var B = fetch_object("collapseobj_quickreply");
    if (B && B.style.display == "none") {
        toggle_collapse("quickreply")
    }
    fetch_object("qr_postid").value = C;
    if (fetch_object("qr_specifiedpost")) {
        fetch_object("qr_specifiedpost").value = 1
    }
    fetch_object("qr_quickreply").disabled = false;
    var A = fetch_object("cb_signature");
    if (A) {
        A.disabled = false;
        A.checked = true
    }
    if (qr_active == false) {
        vB_Editor[QR_EditorID].enable_editor("")
    }
    if (!is_ie && vB_Editor[QR_EditorID].wysiwyg_mode) {
        fetch_object("qr_scroll").scrollIntoView(false)
    }
    vB_Editor[QR_EditorID].check_focus();
    qr_active = true;
    return false
}

function qr_prepare_submit(D, A) {
    if (qr_repost == true) {
        return true
    }
    if (!allow_ajax_qr || !AJAX_Compatible) {
        return qr_check_data(D, A)
    } else {
        if (qr_check_data(D, A)) {
            if (typeof vb_disable_ajax != "undefined" && vb_disable_ajax > 0) {
                return true
            }
            if (is_ie && userAgent.indexOf("msie 5.") != -1) {
                if (PHP.urlencode(D.message.value).indexOf("%u") != -1) {
                    return true
                }
            }
            if (YAHOO.util.Connect.isCallInProgress(qr_ajax)) {
                return false
            }
            if (clickedelm == D.preview.value) {
                return true
            } else {
                var E = "ajax=1";
                if (typeof ajax_last_post != "undefined") {
                    E += "&ajax_lastpost=" + PHP.urlencode(ajax_last_post)
                }
                for (var C = 0; C < D.elements.length; C++) {
                    var F = D.elements[C];
                    if (F.name && !F.disabled) {
                        switch (F.type) {
                        case "text":
                        case "textarea":
                        case "hidden":
                            E += "&" + F.name + "=" + PHP.urlencode(F.value);
                            break;
                        case "checkbox":
                        case "radio":
                            E += F.checked ? "&" + F.name + "=" + PHP.urlencode(F.value) : "";
                            break;
                        case "select-one":
                            E += "&" + F.name + "=" + PHP.urlencode(F.options[F.selectedIndex].value);
                            break;
                        case "select-multiple":
                            for (var B = 0; B < F.options.length; B++) {
                                E += (F.options[B].selected ? "&" + F.name + "=" + PHP.urlencode(F.options[B].value) : "")
                            }
                            break
                        }
                    }
                }
                fetch_object("qr_posting_msg").style.display = "";
                document.body.style.cursor = "wait";
                qr_ajax_post(D.action, E);
                return false
            }
        } else {
            return false
        }
    }
}

function qr_resubmit() {
    qr_repost = true;
    var A = document.createElement("input");
    A.type = "hidden";
    A.name = "ajaxqrfailed";
    A.value = "1";
    fetch_object("qrform").appendChild(A);
    fetch_object("qrform").submit()
}

function qr_check_data(B, A) {
    switch (fetch_object("qr_postid").value) {
    case "0":
        alert(vbphrase.click_quick_reply_icon);
        return false;
    case "who cares":
        if (typeof B.quickreply != "undefined") {
            B.quickreply.checked = false
        }
        break
    }
    if (clickedelm == B.preview.value) {
        A = 0
    }
    return vB_Editor[QR_EditorID].prepare_submit(0, A)
}

function qr_ajax_post(B, A) {
    if (YAHOO.util.Connect.isCallInProgress(qr_ajax)) {
        YAHOO.util.Connect.abort(qr_ajax)
    }
    qr_repost = false;
    qr_ajax = YAHOO.util.Connect.asyncRequest("POST", B, {
        success: qr_do_ajax_post,
        failure: qr_handle_error,
        timeout: vB_Default_Timeout
    }, SESSIONURL + "securitytoken=" + SECURITYTOKEN + "&" + A)
}

function qr_handle_error(A) {
    vBulletin_AJAX_Error_Handler(A);
    fetch_object("qr_posting_msg").style.display = "none";
    document.body.style.cursor = "default";
    qr_resubmit()
}

function qr_do_ajax_post(G) {
    if (G.responseXML) {
        document.body.style.cursor = "auto";
        fetch_object("qr_posting_msg").style.display = "none";
        var D;
        if (fetch_tag_count(G.responseXML, "postbit")) {
            ajax_last_post = G.responseXML.getElementsByTagName("time")[0].firstChild.nodeValue;
            qr_disable_controls();
            qr_hide_errors();
            var C = G.responseXML.getElementsByTagName("postbit");
            for (D = 0; D < C.length; D++) {
                var I = document.createElement("div");
                I.innerHTML = C[D].firstChild.nodeValue;
                var E = fetch_object("lastpost");
                var B = E.parentNode;
                var A = B.insertBefore(I, E);
                PostBit_Init(A, C[D].getAttribute("postid"));
				var postid=C[D].getAttribute("postid");
            }
			// TRIGGER LAZY LOAD image
			if (postid){						
				var img=fetch_object("post"+postid).getElementsByClassName("photo");
				if (img!="undefined" && img.length>0){
					for (var i=0;i<img.length;i++){
						img[i].src=img[i].getAttribute("data-original");
					}
				}
			}
			
            if (fetch_object("qr_submit")) {
                fetch_object("qr_submit").blur()
            }
        } else {
            if (!is_saf) {
                var H = G.responseXML.getElementsByTagName("error");
                if (H.length) {
                    var F = "<ol>";
                    for (D = 0; D < H.length; D++) {
                        F += "<li>" + H[D].firstChild.nodeValue + "</li>"
                    }
                    F += "</ol>";
                    qr_show_errors("<ol>" + F + "</ol>");
                    return false
                }
            }
            qr_resubmit()
        }
    } else {
        qr_resubmit()
    }
}

function qr_show_errors(A) {
    qr_errors_shown = true;
    fetch_object("qr_error_td").innerHTML = A;
    fetch_object("qr_error_tbody").style.display = "";
    vB_Editor[QR_EditorID].check_focus();
    return false
}

function qr_hide_errors() {
    if (qr_errors_shown) {
        qr_errors_shown = true;
        fetch_object("qr_error_tbody").style.display = "none";
        return false
    }
}
var vB_QuickReply = true;

/* vbulletin_ajax_threadrate.js
------------------------------------------------------------------------------*/

function vB_AJAX_ThreadRate_Init(D) {
    var C = fetch_object(D);
    if (AJAX_Compatible && (typeof vb_disable_ajax == "undefined" || vb_disable_ajax < 2) && C) {
        for (var B = 0; B < C.elements.length; B++) {
            if (C.elements[B].type == "submit") {
                var E = C.elements[B];
                var A = document.createElement("input");
                A.type = "button";
                A.className = E.className;
                A.value = E.value;
                A.onclick = vB_AJAX_ThreadRate.prototype.form_click;
                E.parentNode.insertBefore(A, E);
                E.parentNode.removeChild(E)
            }
        }
    }
}

function vB_AJAX_ThreadRate(A) {
    this.formobj = A;
    this.pseudoform = new vB_Hidden_Form("threadrate.php");
    this.pseudoform.add_variable("ajax", 1);
    this.pseudoform.add_variables_from_object(this.formobj);
    this.output_element_id = "threadrating_current"
}
vB_AJAX_ThreadRate.prototype.handle_ajax_response = function (C) {
    if (C.responseXML) {
        var A = C.responseXML.getElementsByTagName("error");
        if (A.length) {
            if (vBmenu.activemenu == "threadrating") {
                vBmenu.hide()
            }
            alert(A[0].firstChild.nodeValue)
        } else {
            var D = C.responseXML.getElementsByTagName("voteavg");
            if (D.length && D[0].firstChild && D[0].firstChild.nodeValue != "") {
                fetch_object(this.output_element_id).innerHTML = D[0].firstChild.nodeValue
            }
            if (vBmenu.activemenu == "threadrating") {
                vBmenu.hide()
            }
            var B = C.responseXML.getElementsByTagName("message");
            if (B.length) {
                alert(B[0].firstChild.nodeValue)
            }
        }
    }
};
vB_AJAX_ThreadRate.prototype.rate = function () {
    if (this.pseudoform.fetch_variable("vote") != null) {
        YAHOO.util.Connect.asyncRequest("POST", "threadrate.php?t=" + threadid + "&vote=" + PHP.urlencode(this.pseudoform.fetch_variable("vote")), {
            success: this.handle_ajax_response,
            failure: this.handle_ajax_error,
            timeout: vB_Default_Timeout,
            scope: this
        }, SESSIONURL + "securitytoken=" + SECURITYTOKEN + "&" + this.pseudoform.build_query_string())
    }
};
vB_AJAX_ThreadRate.prototype.handle_ajax_error = function (A) {
    vBulletin_AJAX_Error_Handler(A);
    this.formobj.submit()
};
vB_AJAX_ThreadRate.prototype.form_click = function () {
    var A = new vB_AJAX_ThreadRate(this.form);
    A.rate();
    return false
};

/* vbulletin_lightbox
------------------------------------------------------------------------------*/
vBulletin.events.systemInit.subscribe(function () {
    if (vBulletin.elements.vB_Lightbox_Container) {
        for (var B = 0; B < vBulletin.elements.vB_Lightbox_Container.length; B++) {
            var A = vBulletin.elements.vB_Lightbox_Container[B];
            init_postbit_lightbox(A[0], A[1])
        }
        vBulletin.elements.vB_Lightbox_Container = null
    }
});
var Lightboxes = new Array();
var Lightbox_overlay = null;
var Lightbox_overlay_select_handler = null;
var Lightbox_event_default = null;
var Lightbox_current = null;
var Lightbox_map = {};

function vB_Lightbox(B, C, D, A) {
    this.minborder = 100;
    this.mindimension = 50;
    this.event_click = 1;
    this.event_hover = 2;
    this.click_triggered = false;
    this.events_enabled = false;
    this.element = B;
    this.timeout = null;
    this.imageloader = null;
    this.status = 0;
    this.active = false;
    this.ajax_req = null;
    this.cursor = null;
    this.link = null;
    this.date = null;
    this.time = null;
    this.name = null;
    this.html = null;
    this.loader_link = null;
    this.loader_height = null;
    this.loader_width = null;
    this.lightbox = null;
    this.closebtn = null;
    this.img = null;
    this.uniqueid = C;
    this.containerid = D;
    if (A & this.event_hover) {
        YAHOO.util.Event.on(this.element, "mouseover", this.countdown, this, true);
        YAHOO.util.Event.on(this.element, "mouseout", this.halt, this, true)
    }
    if (A & this.event_click) {
        YAHOO.util.Event.on(this.element, "click", this.image_click, this, true)
    }
}
vB_Lightbox.prototype.set_status = function (A, B) {
    console.log("vB_Lightbox :: Set status = %d (%s)", A, B);
    this.status = A
};
vB_Lightbox.prototype.check_status = function (A) {
    if (this.status >= A) {
        return true
    } else {
        console.warn("Checked status for %d, found %d", A, this.status);
        return false
    }
};
vB_Lightbox.prototype.countdown = function (A) {
    if (!this.active) {
        this.set_status(1, "countdown");
        this.cursor = YAHOO.util.Dom.getStyle(this.element, "cursor");
        this.element.style.cursor = "wait";
        this.click_triggered = false;
        this.timeout = setTimeout("Lightboxes['" + this.uniqueid + "'].load_lightbox();", 1500)
    }
};
vB_Lightbox.prototype.halt = function (A) {
    if (this.status < 2) {
        this.set_status(0, "halt")
    }
    clearTimeout(this.timeout);
    this.element.style.cursor = this.cursor
};
vB_Lightbox.prototype.image_click = function (A) {
    if (A.ctrlKey || A.shiftKey) {
        return true
    }
    this.click_triggered = true;
    this.load_lightbox(A)
};
vB_Lightbox.prototype.load_lightbox = function (E) {
    if (this.check_status(0) && !YAHOO.util.Connect.isCallInProgress(this.ajax_req)) {
        this.set_status(2, "load_lightbox 1");
        if (Lightbox_current && Lightbox_current.loader_link) {
            Lightbox_current.img.src = Lightbox_current.loader_link;
            Lightbox_current.img.width = Lightbox_current.loader_width;
            Lightbox_current.img.height = Lightbox_current.loader_height;
            center_element(Lightbox_current.lightbox)
        }
        if (E) {
            YAHOO.util.Event.stopEvent(E)
        }
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.element.style.cursor = this.cursor
        }
        if (this.html == null) {
            var A = this.element.getAttribute("href");
            var B = A.substr(A.indexOf("?") + 1) + "&securitytoken=" + SECURITYTOKEN + "&ajax=1&uniqueid=" + this.uniqueid;
            if (Lightbox_map[this.containerid][this.uniqueid + 1] == null) {
                B = B + "&last=1"
            }
            if (Lightbox_map[this.containerid][this.uniqueid - 1] == null) {
                B = B + "&first=1"
            }
            B = B + "&total=" + Lightbox_map[this.containerid].size();
            B = B + "&current=" + (Lightbox_map[this.containerid].find(this.uniqueid) + 1);
            this.show_overlay();
            try {
                this.ajax_req = YAHOO.util.Connect.asyncRequest("POST", A, {
                    success: this.handle_ajax_response,
                    failure: this.handle_ajax_error,
                    scope: this,
                    timeout: vB_Default_Timeout
                }, B)
            } catch (E) {
                var D = A.substr(0, A.indexOf("?"));
                var C;
                if (C = D.match(/\/([^/]*attachment\.php)$/)) {
                    this.ajax_req = YAHOO.util.Connect.asyncRequest("POST", C[1], {
                        success: this.handle_ajax_response,
                        failure: this.handle_ajax_error,
                        scope: this,
                        timeout: vB_Default_Timeout
                    }, B)
                } else {
                    if (this.click_triggered) {
                        window.location = A
                    }
                }
            }
        } else {
            this.set_status(3, "load_lightbox 2");
            this.show_lightbox()
        }
    }
};
vB_Lightbox.prototype.handle_ajax_error = function (A) {
    vBulletin_AJAX_Error_Handler(A);
    if (this.click_triggered) {
        window.location = this.element.getAttribute("href")
    }
};
vB_Lightbox.prototype.handle_ajax_response = function (C) {
    if (!this.check_status(2)) {
        return
    }
    if (C.responseXML) {
        var E = C.responseXML.getElementsByTagName("error");
        if (E.length) {
            this.set_status(0, "handle_ajax_response - error");
            if (E[0].firstChild.nodeValue == "notimage") {
                console.warn("Attempted to load non-image (.%s) into lightbox. Aborted.", C.responseXML.getElementsByTagName("extension")[0].firstChild.nodeValue)
            } else {
                alert(E[0].firstChild.nodeValue.replace(/<(\/|[a-z]+)[^>]+>/g, ""))
            }
            return false
        }
        var B = C.responseXML.getElementsByTagName("link");
        if (B.length) {
            this.set_status(3, "handle_ajax_response - success");
            this.show_overlay();
            this.link = B[0].firstChild.nodeValue;
            this.imageloader = new Image();
            YAHOO.util.Event.on(this.imageloader, "load", this.show_lightbox, this, true);
            var D = new Array("date", "time", "name", "html");
            for (var A = 0; A < D.length; A++) {
                this[D[A]] = C.responseXML.getElementsByTagName(D[A])[0].firstChild.nodeValue
            }
            this.lightbox = document.body.appendChild(string_to_node(this.html));
            this.closebtn = YAHOO.util.Dom.get("lightboxbutton" + this.uniqueid);
            YAHOO.util.Event.on(this.closebtn, "click", this.hide_lightbox, this, true);
            YAHOO.util.Event.on(this.closebtn, "mouseover", this.highlight_btn, this.closebtn, true);
            YAHOO.util.Event.on(this.closebtn, "mouseout", this.highlight_btn, this.closebtn, true);
            this.prevbtn = YAHOO.util.Dom.get("lightboxprevbutton" + this.uniqueid);
            YAHOO.util.Event.on(this.prevbtn, "click", this.prev_lightbox, this, true);
            YAHOO.util.Event.on(this.prevbtn, "mouseover", this.highlight_btn, this.prevbtn, true);
            YAHOO.util.Event.on(this.prevbtn, "mouseout", this.highlight_btn, this.prevbtn, true);
            this.nextbtn = YAHOO.util.Dom.get("lightboxnextbutton" + this.uniqueid);
            YAHOO.util.Event.on(this.nextbtn, "click", this.next_lightbox, this, true);
            YAHOO.util.Event.on(this.nextbtn, "mouseover", this.highlight_btn, this.nextbtn, true);
            YAHOO.util.Event.on(this.nextbtn, "mouseout", this.highlight_btn, this.nextbtn, true);
            YAHOO.util.Event.on(YAHOO.util.Dom.get("lightboxlink" + this.uniqueid), "click", this.hide_lightbox, this, true);
            this.img = YAHOO.util.Dom.get("lightboximg" + this.uniqueid);
            this.loader_link = this.img.src;
            this.loader_width = this.img.width;
            this.loader_height = this.img.height;
            this.imageloader.src = this.link;
            this.show_lightbox()
        } else {
            if (this.click_triggered) {
                window.location = imagelink
            }
        }
    } else {
        if (this.click_triggered) {
            window.location = imagelink
        }
    }
};
vB_Lightbox.prototype.show_overlay = function () {
    if (this.check_status(2)) {
        var C = fetch_viewport_info();
        if (Lightbox_overlay == null) {
            Lightbox_overlay = document.createElement("div");
            Lightbox_overlay.id = "Lightbox_overlay";
            var A = {
                display: "none",
                position: "absolute",
                top: "0px",
                backgroundColor: "#000000",
                opacity: 0.85,
                zIndex: 50
            };
            if (document.dir == "rtl") {
                A.right = "0px"
            } else {
                A.left = "0px"
            }
            for (var B in A) {
                if (YAHOO.lang.hasOwnProperty(A, B)) {
                    YAHOO.util.Dom.setStyle(Lightbox_overlay, B, A[B])
                }
            }
            Lightbox_overlay = document.body.appendChild(Lightbox_overlay);
            Lightbox_overlay_select_handler = new vB_Select_Overlay_Handler(Lightbox_overlay)
        }
        YAHOO.util.Dom.setStyle(Lightbox_overlay, "display", "");
        YAHOO.util.Dom.setStyle(Lightbox_overlay, "width", C.w + "px");
        YAHOO.util.Dom.setStyle(Lightbox_overlay, "height", C.h + "px");
        YAHOO.util.Dom.setXY(Lightbox_overlay, [C.x, C.y]);
        Lightbox_overlay_select_handler.hide()
    }
};
vB_Lightbox.prototype.show_lightbox = function () {
    if (this.check_status(3)) {
        if (Lightbox_current) {
            Lightbox_current.hide_lightbox(false, this, true)
        }
        this.show_overlay();
        if (!this.imageloader.complete && this.imageloader.readyState != "complete") {
            YAHOO.util.Event.removeListener(this.imageloader, "load", this.show_lightbox);
            YAHOO.util.Event.on(this.imageloader, "load", this.show_lightbox, this, true)
        } else {
            this.img.src = this.link;
            this.resize_image();
            YAHOO.util.Dom.setStyle(this.closebtn, "display", "")
        }
        YAHOO.util.Dom.setStyle(this.lightbox, "display", "");
        YAHOO.util.Dom.setStyle(this.lightbox, "zIndex", 51);
        if (Lightbox_map[this.containerid].size() == 1) {
            YAHOO.util.Dom.setStyle(this.prevbtn, "display", "none");
            YAHOO.util.Dom.setStyle(this.nextbtn, "display", "none")
        }
        Lightbox_current = this;
        this.center_lightbox();
        this.active = true;
        this.enable_events()
    }
};
vB_Lightbox.prototype.hide_lightbox = function (B, C, A) {
    if (B && B.type == "keydown" && B.keyCode != 27) {
        return
    }
    this.set_status(0, "hide_lightbox");
    this.disable_events();
    this.active = false;
    YAHOO.util.Dom.setStyle(this.lightbox, "display", "none");
    if (!A) {
        YAHOO.util.Dom.setStyle(Lightbox_overlay, "display", "none")
    }
    Lightbox_overlay_select_handler.show();
    Lightbox_current = null
};
vB_Lightbox.prototype.next_lightbox = function (B) {
    var A = null;
    if (Lightbox_map[this.containerid][this.uniqueid + 1] != null) {
        A = Lightboxes[this.uniqueid + 1]
    } else {
        A = Lightboxes[Lightbox_map[this.containerid].first()]
    }
    A.load_lightbox()
};
vB_Lightbox.prototype.prev_lightbox = function (B) {
    var A = null;
    if (Lightbox_map[this.containerid][this.uniqueid - 1] != null) {
        A = Lightboxes[this.uniqueid - 1]
    } else {
        A = Lightboxes[Lightbox_map[this.containerid].last()]
    }
    A.load_lightbox()
};
vB_Lightbox.prototype.highlight_btn = function () {
    var B = YAHOO.util.Dom.getStyle(this, "color");
    var A = YAHOO.util.Dom.getStyle(this, "background-color");
    var D, C;
    D = ((B == "white" || B.toLowerCase() == "#ffffff") ? "black" : "white");
    C = ((A == "black" || A.toLowerCase() == "#000000") ? "white" : "black");
    YAHOO.util.Dom.setStyle(this, "color", D);
    YAHOO.util.Dom.setStyle(this, "background-color", C)
};
vB_Lightbox.prototype.center_lightbox = function () {
    center_element(this.lightbox)
};
vB_Lightbox.prototype.handle_viewport_change = function () {
    this.resize_image();
    this.center_lightbox();
    this.show_overlay()
};
vB_Lightbox.prototype.handle_viewport_change_ie = function () {
    setTimeout("Lightboxes['" + this.uniqueid + "'].handle_viewport_change();", 100)
};
vB_Lightbox.prototype.resize_image = function () {
    var C = fetch_viewport_info();
    var A = this.imageloader.width;
    var B = this.imageloader.height;
    if (A > C.w - this.minborder) {
        A = C.w - this.minborder;
        A = (A < this.mindimension ? this.mindimension : A);
        B = Math.ceil(this.imageloader.height * (A / this.imageloader.width))
    }
    if (B > C.h - this.minborder) {
        B = C.h - this.minborder;
        B = (B < this.mindimension ? this.mindimension : B);
        A = Math.ceil(this.imageloader.width * (B / this.imageloader.height))
    }
    this.img.setAttribute("width", A);
    this.img.setAttribute("height", B);
    this.img.setAttribute("title", this.name + "; \n" + this.imageloader.width + " x " + this.imageloader.height + " (@" + Math.ceil(A / this.imageloader.width * 100) + "%)");
    if (A < this.imageloader.width || B < this.imageloader.height) {
        console.info("vB_Lightbox :: Image original size: %dx%d, resizing to %dx%d", this.imageloader.width, this.imageloader.height, A, B)
    }
};
vB_Lightbox.prototype.enable_events = function () {
    if (!this.events_enabled) {
        YAHOO.util.Event.on(window, "resize", (is_ie ? this.handle_viewport_change_ie : this.handle_viewport_change), this, true);
        YAHOO.util.Event.on(window, "scroll", this.hide_lightbox, this, true);
        YAHOO.util.Event.on(window, "keydown", this.hide_lightbox, this, true);
        YAHOO.util.Event.on(Lightbox_overlay, "click", this.hide_lightbox, this, true);
        this.events_enabled = true
    }
};
vB_Lightbox.prototype.disable_events = function () {
    if (this.events_enabled) {
        YAHOO.util.Event.removeListener(window, "resize", (is_ie ? this.handle_viewport_change_ie : this.handle_viewport_change));
        YAHOO.util.Event.removeListener(window, "scroll", this.hide_lightbox);
        YAHOO.util.Event.removeListener(window, "keydown", this.hide_lightbox);
        YAHOO.util.Event.removeListener(Lightbox_overlay, "click", this.hide_lightbox);
        this.events_enabled = false
    }
};
vB_Lightbox_Container = function () {};
vB_Lightbox_Container.prototype.size = function () {
    var B = 0;
    for (var A in this) {
        if (YAHOO.lang.hasOwnProperty(this, A)) {
            B++
        }
    }
    return B
};
vB_Lightbox_Container.prototype.first = function () {
    for (var A in this) {
        if (YAHOO.lang.hasOwnProperty(this, A)) {
            return A
        }
    }
};
vB_Lightbox_Container.prototype.last = function () {
    var B;
    for (var A in this) {
        if (YAHOO.lang.hasOwnProperty(this, A)) {
            B = A
        }
    }
    return B
};
vB_Lightbox_Container.prototype.find = function (C) {
    var B = 0;
    for (var A in this) {
        if (YAHOO.lang.hasOwnProperty(this, A)) {
            if (A == C) {
                return B
            }
            B++
        }
    }
    return -1
};

function is_lightbox_element(A) {
    return (typeof (A.getAttribute("rel")) == "string" && A.getAttribute("rel").match(/Lightbox[_]?(\d*)?/))
}

function init_postbit_lightbox(D, C, G) {
    var A = userAgent.match(/applewebkit\/([0-9]+)/);
    if (A && A[1] < 522) {
        return
    }
    if (Lightbox_event_default === null) {
        Lightbox_event_default = C
    }
    if (typeof (C) == "undefined" || C === false) {
        C = (Lightbox_event_default ? Lightbox_event_default : 1 + 2)
    }
    var E = YAHOO.util.Dom.getElementsBy(is_lightbox_element, "a", D);
    for (var B = 0; B < E.length; B++) {
        var F = Lightboxes.length;
        var H = E[B].getAttribute("rel").match(/Lightbox[_]?(\d*)?/).pop();
        H = (H ? H : 0);
        Lightboxes[F] = new vB_Lightbox(E[B], F, H, C);
        if (!Lightbox_map[H] || G) {
            Lightbox_map[H] = new vB_Lightbox_Container();
            G = false
        }
        Lightbox_map[H][F] = F
    }
};

/* vbulletin_read_marker.js */
var vB_ReadMarker = {
    forum_statusicon_prefix: "forum_statusicon_",
    thread_statusicon_prefix: "thread_statusicon_",
    thread_gotonew_prefix: "thread_gotonew_",
    thread_title_prefix: "thread_title_"
};

function vB_AJAX_ReadMarker(A) {
    this.forumid = A
}
vB_AJAX_ReadMarker.prototype.mark_read = function() {
    YAHOO.util.Connect.asyncRequest("POST", "ajax.php?do=markread&f=" + this.forumid, {
        success: this.handle_ajax_request,
        failure: this.handle_ajax_error,
        timeout: vB_Default_Timeout,
        scope: this
    }, SESSIONURL + "securitytoken=" + SECURITYTOKEN + "&do=markread&forumid=" + this.forumid)
};
vB_AJAX_ReadMarker.prototype.handle_ajax_error = function(A) {
    vBulletin_AJAX_Error_Handler(A)
};
vB_AJAX_ReadMarker.prototype.handle_ajax_request = function(C) {
    var B = fetch_tags(C.responseXML, "forum");
    for (var A = 0; A < B.length; A++) {
        var D = B[A].firstChild.nodeValue;
        this.update_forum_status(D);
        var E = fetch_object("threadbits_forum_" + D);
        if (E) {
            this.handle_threadbits(E)
        }
    }
};
vB_AJAX_ReadMarker.prototype.update_forum_status = function(B) {
    var A = fetch_object(vB_ReadMarker.forum_statusicon_prefix + B);
    if (A) {
        A.style.cursor = "default";
        A.title = A.otitle;
        A.src = this.fetch_old_src(A.src, "forum")
    }
};
vB_AJAX_ReadMarker.prototype.handle_threadbits = function(C) {
    var A = fetch_tags(C, "a");
    for (var B = 0; B < A.length; B++) {
        if (A[B].id && A[B].id.substr(0, vB_ReadMarker.thread_gotonew_prefix.length) == vB_ReadMarker.thread_gotonew_prefix) {
            this.update_thread_status(A[B].id.substr(vB_ReadMarker.thread_gotonew_prefix.length))
        }
    }
};
vB_AJAX_ReadMarker.prototype.update_thread_status = function(D) {
    var C = fetch_object(vB_ReadMarker.thread_statusicon_prefix + D);
    if (C) {
        C.className = this.fetch_old_src(C.className, "thread")
    }
    var B = fetch_object(vB_ReadMarker.thread_gotonew_prefix + D);
    if (B) {
        B.parentNode.removeChild(B)
    }
    var A = fetch_object(vB_ReadMarker.thread_title_prefix + D);
    if (A) {
        A.style.fontWeight = "normal"
    }
};
vB_AJAX_ReadMarker.prototype.fetch_old_src = function(B, A) {
    C = B.replace(/(.*)(_new)(.*)$/i, "thread" == A ? "$1$3" : "$1$2$3");
    return C
};

function mark_forum_read(A) {
    if (AJAX_Compatible) {
        vB_ReadMarker[A] = new vB_AJAX_ReadMarker(A);
        vB_ReadMarker[A].mark_read()
    } else {
        window.location = "forumdisplay.php?" + SESSIONURL + "do=markread&forumid=" + A + "&markreadhash=" + SECURITYTOKEN
    }
    return false
}

function init_forum_readmarker_icon(A) {
    mark_forum_read(this.id.substr(vB_ReadMarker.forum_statusicon_prefix.length))
}

function init_forum_readmarker_system() {
    var A = fetch_tags(document, "img");
    for (var B = 0; B < A.length; B++) {
        if (A[B].id && A[B].id.substr(0, vB_ReadMarker.forum_statusicon_prefix.length) == vB_ReadMarker.forum_statusicon_prefix) {
            if (A[B].src.search(/\/([^\/]+)(new)(_lock)?\.([a-z0-9]+)$/i) != -1) {
                img_alt_2_title(A[B]);
                A[B].otitle = A[B].title;
                A[B].title = vbphrase.doubleclick_forum_markread;
                A[B].style.cursor = pointer_cursor;
                A[B].ondblclick = init_forum_readmarker_icon
            }
        }
    }
};

/* Fetch tags function */
function fetch_tags(B,A){if(B==null){return new Array()}else{if(typeof B.getElementsByTagName!="undefined"){return B.getElementsByTagName(A)}else{if(B.all&&B.all.tags){return B.all.tags(A)}else{return new Array()}}}}

/* vB_AJAX_NameVerify function */
function vB_AJAX_NameVerify(C,A){var B=userAgent.match(/applewebkit\/([0-9]+)/);if(AJAX_Compatible&&!(is_saf&&!(B[1]>=412))){this.textobj=fetch_object(A);this.textobj.setAttribute("autocomplete","off");this.textobj.obj=this;this.varname=C;this.fragment="";this.timeout=null;this.ajax_req=null;this.get_text=function(){this.fragment=new String(this.textobj.value);this.fragment=PHP.trim(this.fragment)};this.key_event_handler=function(D){this.get_text();clearTimeout(this.timeout);this.timeout=setTimeout(this.varname+".name_verify();",500)};this.name_verify=function(){if(YAHOO.util.Connect.isCallInProgress(this.ajax_req)){YAHOO.util.Connect.abort(this.ajax_req)}this.ajax_req=YAHOO.util.Connect.asyncRequest("POST","ajax.php?do=verifyusername",{success:this.handle_ajax_request,failure:vBulletin_AJAX_Error_Handler,timeout:vB_Default_Timeout,scope:this},SESSIONURL+"securitytoken="+SECURITYTOKEN+"&do=verifyusername&username="+PHP.urlencode(this.fragment))};this.handle_ajax_request=function(G){if(G.responseXML&&(G.responseXML.getElementsByTagName("status").length>0)){var D=G.responseXML.getElementsByTagName("status")[0].firstChild.nodeValue;var H=G.responseXML.getElementsByTagName("image")[0].firstChild.nodeValue;var F=G.responseXML.getElementsByTagName("message")[0].firstChild.nodeValue;var I=document.getElementById("reg_verif_div");var E=document.getElementById("reg_verif_image");E.src=H;E.style.display="inline";if(D=="valid"){I.style.display="block";I.className="greenbox"}else{I.style.display="block";I.className="redbox"}I.innerHTML=F}};this.textobj.onkeyup=function(D){return this.obj.key_event_handler(D)}}};

/* vB_Inline_Mod function */
function vB_Inline_Mod(A,E,F,C,B,D){this.varname=A;this.type=E.toLowerCase();this.formobj=fetch_object(F);this.go_phrase=C;if(typeof B!="undefined"){this.cookieprefix=B}else{this.cookieprefix="vbulletin_inline"}if(this.type=="thread"){this.list="tlist_"}else{if(this.type=="post"){this.list="plist_"}else{this.list=this.type+"list_"}}if(typeof D!="undefined"){this.highlighttype=D}else{this.highlighttype=this.type}this.cookie_ids=null;this.cookie_array=new Array();this.init=function(H){var G;for(G=0;G<H.length;G++){if(this.is_in_list(H[G])){H[G].inlineModID=this.varname;H[G].onclick=inlinemod_checkbox_onclick}}this.cookie_array=new Array();if(this.fetch_ids()){for(G in this.cookie_ids){if(YAHOO.lang.hasOwnProperty(this.cookie_ids,G)&&this.cookie_ids[G]!=""){if(checkbox=fetch_object(this.list+this.cookie_ids[G])){checkbox.checked=true;if(typeof (this["highlight_"+this.highlighttype])!="undefined"){this["highlight_"+this.highlighttype](checkbox)}}this.cookie_array[this.cookie_array.length]=this.cookie_ids[G]}}}this.set_output_counters()};this.fetch_ids=function(){this.cookie_ids=fetch_cookie(this.cookieprefix+this.type);if(this.cookie_ids!=null&&this.cookie_ids!=""){this.cookie_ids=this.cookie_ids.split("-");if(this.cookie_ids.length>0){return true}}return false};this.toggle=function(G){if(typeof (this["highlight_"+this.highlighttype])!="undefined"){this["highlight_"+this.highlighttype](G)}this.save(G.id.substring(this.list.length),G.checked)};this.save=function(I,H){this.cookie_array=new Array();if(this.fetch_ids()){for(var G in this.cookie_ids){if(YAHOO.lang.hasOwnProperty(this.cookie_ids,G)&&this.cookie_ids[G]!=I&&this.cookie_ids[G]!=""){this.cookie_array[this.cookie_array.length]=this.cookie_ids[G]}}}if(H){this.cookie_array[this.cookie_array.length]=I}this.set_output_counters();this.set_cookie();return true};this.set_cookie=function(){expires=new Date();expires.setTime(expires.getTime()+3600000);set_cookie(this.cookieprefix+this.type,this.cookie_array.join("-"),expires)};this.check_all=function(J,G,H){if(typeof J=="undefined"){J=this.formobj.allbox.checked}this.cookie_array=new Array();if(this.fetch_ids()){for(I in this.cookie_ids){if(YAHOO.lang.hasOwnProperty(this.cookie_ids,I)&&!fetch_object(this.list+this.cookie_ids[I])){this.cookie_array[this.cookie_array.length]=this.cookie_ids[I]}}}counter=0;for(var I=0;I<this.formobj.elements.length;I++){if(this.is_in_list(this.formobj.elements[I])){var K=this.formobj.elements[I];if(typeof G!="undefined"){if(isNaN(G)){if(K.value==G){K.checked=J}}else{if(K.value&G){K.checked=J}else{K.checked=!J}}}else{if(J=="invert"){K.checked=!K.checked}else{K.checked=J}}if(typeof (this["highlight_"+this.highlighttype])!="undefined"){this["highlight_"+this.highlighttype](K)}if(K.checked){this.cookie_array[this.cookie_array.length]=K.id.substring(this.list.length)}}}this.set_output_counters();this.set_cookie();return true};this.is_in_list=function(G){return(G.type=="checkbox"&&G.id.indexOf(this.list)==0&&(G.disabled==false||G.disabled=="undefined"))};this.set_output_counters=function(){var G;if(this.type=="thread"||this.type=="post"){G="inlinego"}else{G=this.type+"_inlinego"}var H;if(H=fetch_object(G)){H.value=construct_phrase(this.go_phrase,this.cookie_array.length)}};this.toggle_highlight=function(G,I,H){if(G.tagName){if(H||YAHOO.util.Dom.hasClass(G,"alt1")||YAHOO.util.Dom.hasClass(G,"alt2")||YAHOO.util.Dom.hasClass(G,"inlinemod")){if(I.checked){YAHOO.util.Dom.addClass(G,"inlinemod")}else{YAHOO.util.Dom.removeClass(G,"inlinemod")}}}};this.highlight_thread=function(J){var G=J;while(G.tagName!="TR"){if(G.parentNode.tagName=="HTML"){break}else{G=G.parentNode}}if(G.tagName=="TR"){var I=G.childNodes;for(var H=0;H<I.length;H++){this.toggle_highlight(I[H],J)}}};this.highlight_post=function(I){if(table=fetch_object(this.type+I.id.substr(this.list.length))){var H=fetch_tags(table,"td");for(var G=0;G<H.length;G++){this.toggle_highlight(H[G],I)}}};this.highlight_message=function(K){var J=0;var H=K.id.substr(this.list.length);var G=YAHOO.util.Dom.get(this.type+H);if(G){this.toggle_highlight(G,K,true);var I=YAHOO.util.Dom.getElementsByClassName("alt2","div",G);if(I.length){this.toggle_highlight(I[0],K)}}};this.highlight_div=function(I){var J;if(J=fetch_object(this.type+I.id.substr(this.list.length))){console.log("Highlight %s",this.type+I.id.substr(this.list.length));this.toggle_highlight(J,I);var H=fetch_tags(J,"div");for(var G=0;G<H.length;G++){this.toggle_highlight(H[G],I)}}};this.init(this.formobj.elements)}function inlinemod_checkbox_onclick(e){var inlineModObj=eval(this.inlineModID);inlineModObj.toggle(this)}function im_init(C,B){var A=fetch_tags(C,"input");if(typeof B=="object"&&typeof B.init=="function"){B.init(A)}else{inlineMod.init(A)}};






