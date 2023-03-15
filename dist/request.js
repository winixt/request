class wt {
  constructor() {
    this.middlewares = [];
  }
  use(t) {
    return this.middlewares.push(t), this;
  }
  compose() {
    return (t, r) => {
      let n = -1;
      const o = (a) => {
        if (a <= n)
          return Promise.reject(new Error("next() called multiple times"));
        n = a;
        let i = this.middlewares[a];
        if (n === this.middlewares.length && (i = r), !i)
          return Promise.resolve();
        try {
          return Promise.resolve(i(t, o.bind(null, a + 1)));
        } catch (s) {
          return Promise.reject(s);
        }
      };
      return o(0);
    };
  }
}
const jt = async (e, t) => {
  e.config.method ? e.config.method = e.config.method.toUpperCase() : e.config.method = "POST", await t();
};
var Ot = typeof global == "object" && global && global.Object === Object && global;
const Ve = Ot;
var St = typeof self == "object" && self && self.Object === Object && self, At = Ve || St || Function("return this")();
const g = At;
var Pt = g.Symbol;
const p = Pt;
var We = Object.prototype, Ct = We.hasOwnProperty, Et = We.toString, E = p ? p.toStringTag : void 0;
function It(e) {
  var t = Ct.call(e, E), r = e[E];
  try {
    e[E] = void 0;
    var n = !0;
  } catch {
  }
  var o = Et.call(e);
  return n && (t ? e[E] = r : delete e[E]), o;
}
var Mt = Object.prototype, Dt = Mt.toString;
function Ft(e) {
  return Dt.call(e);
}
var Rt = "[object Null]", Ut = "[object Undefined]", me = p ? p.toStringTag : void 0;
function b(e) {
  return e == null ? e === void 0 ? Ut : Rt : me && me in Object(e) ? It(e) : Ft(e);
}
function m(e) {
  return e != null && typeof e == "object";
}
var qt = "[object Symbol]";
function ee(e) {
  return typeof e == "symbol" || m(e) && b(e) == qt;
}
function Ye(e, t) {
  for (var r = -1, n = e == null ? 0 : e.length, o = Array(n); ++r < n; )
    o[r] = t(e[r], r, e);
  return o;
}
var Nt = Array.isArray;
const T = Nt;
var Lt = 1 / 0, Te = p ? p.prototype : void 0, _e = Te ? Te.toString : void 0;
function Je(e) {
  if (typeof e == "string")
    return e;
  if (T(e))
    return Ye(e, Je) + "";
  if (ee(e))
    return _e ? _e.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -Lt ? "-0" : t;
}
function R(e) {
  var t = typeof e;
  return e != null && (t == "object" || t == "function");
}
function Bt(e) {
  return e;
}
var Ht = "[object AsyncFunction]", Gt = "[object Function]", zt = "[object GeneratorFunction]", Kt = "[object Proxy]";
function G(e) {
  if (!R(e))
    return !1;
  var t = b(e);
  return t == Gt || t == zt || t == Ht || t == Kt;
}
var kt = g["__core-js_shared__"];
const k = kt;
var $e = function() {
  var e = /[^.]+$/.exec(k && k.keys && k.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
}();
function Vt(e) {
  return !!$e && $e in e;
}
var Wt = Function.prototype, Yt = Wt.toString;
function O(e) {
  if (e != null) {
    try {
      return Yt.call(e);
    } catch {
    }
    try {
      return e + "";
    } catch {
    }
  }
  return "";
}
var Jt = /[\\^$.*+?()[\]{}|]/g, Qt = /^\[object .+?Constructor\]$/, Xt = Function.prototype, Zt = Object.prototype, xt = Xt.toString, er = Zt.hasOwnProperty, tr = RegExp(
  "^" + xt.call(er).replace(Jt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function rr(e) {
  if (!R(e) || Vt(e))
    return !1;
  var t = G(e) ? tr : Qt;
  return t.test(O(e));
}
function nr(e, t) {
  return e == null ? void 0 : e[t];
}
function S(e, t) {
  var r = nr(e, t);
  return rr(r) ? r : void 0;
}
var or = S(g, "WeakMap");
const Y = or;
var ve = Object.create, ar = function() {
  function e() {
  }
  return function(t) {
    if (!R(t))
      return {};
    if (ve)
      return ve(t);
    e.prototype = t;
    var r = new e();
    return e.prototype = void 0, r;
  };
}();
const ir = ar;
function sr(e, t, r) {
  switch (r.length) {
    case 0:
      return e.call(t);
    case 1:
      return e.call(t, r[0]);
    case 2:
      return e.call(t, r[0], r[1]);
    case 3:
      return e.call(t, r[0], r[1], r[2]);
  }
  return e.apply(t, r);
}
function cr(e, t) {
  var r = -1, n = e.length;
  for (t || (t = Array(n)); ++r < n; )
    t[r] = e[r];
  return t;
}
var ur = 800, fr = 16, lr = Date.now;
function pr(e) {
  var t = 0, r = 0;
  return function() {
    var n = lr(), o = fr - (n - r);
    if (r = n, o > 0) {
      if (++t >= ur)
        return arguments[0];
    } else
      t = 0;
    return e.apply(void 0, arguments);
  };
}
function gr(e) {
  return function() {
    return e;
  };
}
var hr = function() {
  try {
    var e = S(Object, "defineProperty");
    return e({}, "", {}), e;
  } catch {
  }
}();
const L = hr;
var yr = L ? function(e, t) {
  return L(e, "toString", {
    configurable: !0,
    enumerable: !1,
    value: gr(t),
    writable: !0
  });
} : Bt;
const dr = yr;
var br = pr(dr);
const mr = br;
function Tr(e, t) {
  for (var r = -1, n = e == null ? 0 : e.length; ++r < n && t(e[r], r, e) !== !1; )
    ;
  return e;
}
var _r = 9007199254740991, $r = /^(?:0|[1-9]\d*)$/;
function vr(e, t) {
  var r = typeof e;
  return t = t ?? _r, !!t && (r == "number" || r != "symbol" && $r.test(e)) && e > -1 && e % 1 == 0 && e < t;
}
function Qe(e, t, r) {
  t == "__proto__" && L ? L(e, t, {
    configurable: !0,
    enumerable: !0,
    value: r,
    writable: !0
  }) : e[t] = r;
}
function Xe(e, t) {
  return e === t || e !== e && t !== t;
}
var wr = Object.prototype, jr = wr.hasOwnProperty;
function Ze(e, t, r) {
  var n = e[t];
  (!(jr.call(e, t) && Xe(n, r)) || r === void 0 && !(t in e)) && Qe(e, t, r);
}
function U(e, t, r, n) {
  var o = !r;
  r || (r = {});
  for (var a = -1, i = t.length; ++a < i; ) {
    var s = t[a], f = n ? n(r[s], e[s], s, r, e) : void 0;
    f === void 0 && (f = e[s]), o ? Qe(r, s, f) : Ze(r, s, f);
  }
  return r;
}
var we = Math.max;
function Or(e, t, r) {
  return t = we(t === void 0 ? e.length - 1 : t, 0), function() {
    for (var n = arguments, o = -1, a = we(n.length - t, 0), i = Array(a); ++o < a; )
      i[o] = n[t + o];
    o = -1;
    for (var s = Array(t + 1); ++o < t; )
      s[o] = n[o];
    return s[t] = r(i), sr(e, this, s);
  };
}
var Sr = 9007199254740991;
function xe(e) {
  return typeof e == "number" && e > -1 && e % 1 == 0 && e <= Sr;
}
function et(e) {
  return e != null && xe(e.length) && !G(e);
}
var Ar = Object.prototype;
function te(e) {
  var t = e && e.constructor, r = typeof t == "function" && t.prototype || Ar;
  return e === r;
}
function Pr(e, t) {
  for (var r = -1, n = Array(e); ++r < e; )
    n[r] = t(r);
  return n;
}
var Cr = "[object Arguments]";
function je(e) {
  return m(e) && b(e) == Cr;
}
var tt = Object.prototype, Er = tt.hasOwnProperty, Ir = tt.propertyIsEnumerable, Mr = je(function() {
  return arguments;
}()) ? je : function(e) {
  return m(e) && Er.call(e, "callee") && !Ir.call(e, "callee");
};
const rt = Mr;
function Dr() {
  return !1;
}
var nt = typeof exports == "object" && exports && !exports.nodeType && exports, Oe = nt && typeof module == "object" && module && !module.nodeType && module, Fr = Oe && Oe.exports === nt, Se = Fr ? g.Buffer : void 0, Rr = Se ? Se.isBuffer : void 0, Ur = Rr || Dr;
const ot = Ur;
var qr = "[object Arguments]", Nr = "[object Array]", Lr = "[object Boolean]", Br = "[object Date]", Hr = "[object Error]", Gr = "[object Function]", zr = "[object Map]", Kr = "[object Number]", kr = "[object Object]", Vr = "[object RegExp]", Wr = "[object Set]", Yr = "[object String]", Jr = "[object WeakMap]", Qr = "[object ArrayBuffer]", Xr = "[object DataView]", Zr = "[object Float32Array]", xr = "[object Float64Array]", en = "[object Int8Array]", tn = "[object Int16Array]", rn = "[object Int32Array]", nn = "[object Uint8Array]", on = "[object Uint8ClampedArray]", an = "[object Uint16Array]", sn = "[object Uint32Array]", u = {};
u[Zr] = u[xr] = u[en] = u[tn] = u[rn] = u[nn] = u[on] = u[an] = u[sn] = !0;
u[qr] = u[Nr] = u[Qr] = u[Lr] = u[Xr] = u[Br] = u[Hr] = u[Gr] = u[zr] = u[Kr] = u[kr] = u[Vr] = u[Wr] = u[Yr] = u[Jr] = !1;
function cn(e) {
  return m(e) && xe(e.length) && !!u[b(e)];
}
function re(e) {
  return function(t) {
    return e(t);
  };
}
var at = typeof exports == "object" && exports && !exports.nodeType && exports, I = at && typeof module == "object" && module && !module.nodeType && module, un = I && I.exports === at, V = un && Ve.process, fn = function() {
  try {
    var e = I && I.require && I.require("util").types;
    return e || V && V.binding && V.binding("util");
  } catch {
  }
}();
const P = fn;
var Ae = P && P.isTypedArray, ln = Ae ? re(Ae) : cn;
const pn = ln;
var gn = Object.prototype, hn = gn.hasOwnProperty;
function it(e, t) {
  var r = T(e), n = !r && rt(e), o = !r && !n && ot(e), a = !r && !n && !o && pn(e), i = r || n || o || a, s = i ? Pr(e.length, String) : [], f = s.length;
  for (var l in e)
    (t || hn.call(e, l)) && !(i && // Safari 9 has enumerable `arguments.length` in strict mode.
    (l == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    o && (l == "offset" || l == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    a && (l == "buffer" || l == "byteLength" || l == "byteOffset") || // Skip index properties.
    vr(l, f))) && s.push(l);
  return s;
}
function st(e, t) {
  return function(r) {
    return e(t(r));
  };
}
var yn = st(Object.keys, Object);
const dn = yn;
var bn = Object.prototype, mn = bn.hasOwnProperty;
function Tn(e) {
  if (!te(e))
    return dn(e);
  var t = [];
  for (var r in Object(e))
    mn.call(e, r) && r != "constructor" && t.push(r);
  return t;
}
function ne(e) {
  return et(e) ? it(e) : Tn(e);
}
function _n(e) {
  var t = [];
  if (e != null)
    for (var r in Object(e))
      t.push(r);
  return t;
}
var $n = Object.prototype, vn = $n.hasOwnProperty;
function wn(e) {
  if (!R(e))
    return _n(e);
  var t = te(e), r = [];
  for (var n in e)
    n == "constructor" && (t || !vn.call(e, n)) || r.push(n);
  return r;
}
function oe(e) {
  return et(e) ? it(e, !0) : wn(e);
}
var jn = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, On = /^\w*$/;
function Sn(e, t) {
  if (T(e))
    return !1;
  var r = typeof e;
  return r == "number" || r == "symbol" || r == "boolean" || e == null || ee(e) ? !0 : On.test(e) || !jn.test(e) || t != null && e in Object(t);
}
var An = S(Object, "create");
const M = An;
function Pn() {
  this.__data__ = M ? M(null) : {}, this.size = 0;
}
function Cn(e) {
  var t = this.has(e) && delete this.__data__[e];
  return this.size -= t ? 1 : 0, t;
}
var En = "__lodash_hash_undefined__", In = Object.prototype, Mn = In.hasOwnProperty;
function Dn(e) {
  var t = this.__data__;
  if (M) {
    var r = t[e];
    return r === En ? void 0 : r;
  }
  return Mn.call(t, e) ? t[e] : void 0;
}
var Fn = Object.prototype, Rn = Fn.hasOwnProperty;
function Un(e) {
  var t = this.__data__;
  return M ? t[e] !== void 0 : Rn.call(t, e);
}
var qn = "__lodash_hash_undefined__";
function Nn(e, t) {
  var r = this.__data__;
  return this.size += this.has(e) ? 0 : 1, r[e] = M && t === void 0 ? qn : t, this;
}
function j(e) {
  var t = -1, r = e == null ? 0 : e.length;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
j.prototype.clear = Pn;
j.prototype.delete = Cn;
j.prototype.get = Dn;
j.prototype.has = Un;
j.prototype.set = Nn;
function Ln() {
  this.__data__ = [], this.size = 0;
}
function z(e, t) {
  for (var r = e.length; r--; )
    if (Xe(e[r][0], t))
      return r;
  return -1;
}
var Bn = Array.prototype, Hn = Bn.splice;
function Gn(e) {
  var t = this.__data__, r = z(t, e);
  if (r < 0)
    return !1;
  var n = t.length - 1;
  return r == n ? t.pop() : Hn.call(t, r, 1), --this.size, !0;
}
function zn(e) {
  var t = this.__data__, r = z(t, e);
  return r < 0 ? void 0 : t[r][1];
}
function Kn(e) {
  return z(this.__data__, e) > -1;
}
function kn(e, t) {
  var r = this.__data__, n = z(r, e);
  return n < 0 ? (++this.size, r.push([e, t])) : r[n][1] = t, this;
}
function h(e) {
  var t = -1, r = e == null ? 0 : e.length;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
h.prototype.clear = Ln;
h.prototype.delete = Gn;
h.prototype.get = zn;
h.prototype.has = Kn;
h.prototype.set = kn;
var Vn = S(g, "Map");
const D = Vn;
function Wn() {
  this.size = 0, this.__data__ = {
    hash: new j(),
    map: new (D || h)(),
    string: new j()
  };
}
function Yn(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
function K(e, t) {
  var r = e.__data__;
  return Yn(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
}
function Jn(e) {
  var t = K(this, e).delete(e);
  return this.size -= t ? 1 : 0, t;
}
function Qn(e) {
  return K(this, e).get(e);
}
function Xn(e) {
  return K(this, e).has(e);
}
function Zn(e, t) {
  var r = K(this, e), n = r.size;
  return r.set(e, t), this.size += r.size == n ? 0 : 1, this;
}
function _(e) {
  var t = -1, r = e == null ? 0 : e.length;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
_.prototype.clear = Wn;
_.prototype.delete = Jn;
_.prototype.get = Qn;
_.prototype.has = Xn;
_.prototype.set = Zn;
var xn = "Expected a function";
function ae(e, t) {
  if (typeof e != "function" || t != null && typeof t != "function")
    throw new TypeError(xn);
  var r = function() {
    var n = arguments, o = t ? t.apply(this, n) : n[0], a = r.cache;
    if (a.has(o))
      return a.get(o);
    var i = e.apply(this, n);
    return r.cache = a.set(o, i) || a, i;
  };
  return r.cache = new (ae.Cache || _)(), r;
}
ae.Cache = _;
var eo = 500;
function to(e) {
  var t = ae(e, function(n) {
    return r.size === eo && r.clear(), n;
  }), r = t.cache;
  return t;
}
var ro = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, no = /\\(\\)?/g, oo = to(function(e) {
  var t = [];
  return e.charCodeAt(0) === 46 && t.push(""), e.replace(ro, function(r, n, o, a) {
    t.push(o ? a.replace(no, "$1") : n || r);
  }), t;
});
const ao = oo;
function io(e) {
  return e == null ? "" : Je(e);
}
function ie(e, t) {
  return T(e) ? e : Sn(e, t) ? [e] : ao(io(e));
}
var so = 1 / 0;
function ct(e) {
  if (typeof e == "string" || ee(e))
    return e;
  var t = e + "";
  return t == "0" && 1 / e == -so ? "-0" : t;
}
function co(e, t) {
  t = ie(t, e);
  for (var r = 0, n = t.length; e != null && r < n; )
    e = e[ct(t[r++])];
  return r && r == n ? e : void 0;
}
function se(e, t) {
  for (var r = -1, n = t.length, o = e.length; ++r < n; )
    e[o + r] = t[r];
  return e;
}
var Pe = p ? p.isConcatSpreadable : void 0;
function uo(e) {
  return T(e) || rt(e) || !!(Pe && e && e[Pe]);
}
function ut(e, t, r, n, o) {
  var a = -1, i = e.length;
  for (r || (r = uo), o || (o = []); ++a < i; ) {
    var s = e[a];
    t > 0 && r(s) ? t > 1 ? ut(s, t - 1, r, n, o) : se(o, s) : n || (o[o.length] = s);
  }
  return o;
}
function fo(e) {
  var t = e == null ? 0 : e.length;
  return t ? ut(e, 1) : [];
}
function lo(e) {
  return mr(Or(e, void 0, fo), e + "");
}
var po = st(Object.getPrototypeOf, Object);
const ce = po;
var go = "[object Object]", ho = Function.prototype, yo = Object.prototype, ft = ho.toString, bo = yo.hasOwnProperty, mo = ft.call(Object);
function d(e) {
  if (!m(e) || b(e) != go)
    return !1;
  var t = ce(e);
  if (t === null)
    return !0;
  var r = bo.call(t, "constructor") && t.constructor;
  return typeof r == "function" && r instanceof r && ft.call(r) == mo;
}
function To(e, t, r) {
  var n = -1, o = e.length;
  t < 0 && (t = -t > o ? 0 : o + t), r = r > o ? o : r, r < 0 && (r += o), o = t > r ? 0 : r - t >>> 0, t >>>= 0;
  for (var a = Array(o); ++n < o; )
    a[n] = e[n + t];
  return a;
}
function _o() {
  this.__data__ = new h(), this.size = 0;
}
function $o(e) {
  var t = this.__data__, r = t.delete(e);
  return this.size = t.size, r;
}
function vo(e) {
  return this.__data__.get(e);
}
function wo(e) {
  return this.__data__.has(e);
}
var jo = 200;
function Oo(e, t) {
  var r = this.__data__;
  if (r instanceof h) {
    var n = r.__data__;
    if (!D || n.length < jo - 1)
      return n.push([e, t]), this.size = ++r.size, this;
    r = this.__data__ = new _(n);
  }
  return r.set(e, t), this.size = r.size, this;
}
function C(e) {
  var t = this.__data__ = new h(e);
  this.size = t.size;
}
C.prototype.clear = _o;
C.prototype.delete = $o;
C.prototype.get = vo;
C.prototype.has = wo;
C.prototype.set = Oo;
function So(e, t) {
  return e && U(t, ne(t), e);
}
function Ao(e, t) {
  return e && U(t, oe(t), e);
}
var lt = typeof exports == "object" && exports && !exports.nodeType && exports, Ce = lt && typeof module == "object" && module && !module.nodeType && module, Po = Ce && Ce.exports === lt, Ee = Po ? g.Buffer : void 0, Ie = Ee ? Ee.allocUnsafe : void 0;
function Co(e, t) {
  if (t)
    return e.slice();
  var r = e.length, n = Ie ? Ie(r) : new e.constructor(r);
  return e.copy(n), n;
}
function Eo(e, t) {
  for (var r = -1, n = e == null ? 0 : e.length, o = 0, a = []; ++r < n; ) {
    var i = e[r];
    t(i, r, e) && (a[o++] = i);
  }
  return a;
}
function pt() {
  return [];
}
var Io = Object.prototype, Mo = Io.propertyIsEnumerable, Me = Object.getOwnPropertySymbols, Do = Me ? function(e) {
  return e == null ? [] : (e = Object(e), Eo(Me(e), function(t) {
    return Mo.call(e, t);
  }));
} : pt;
const ue = Do;
function Fo(e, t) {
  return U(e, ue(e), t);
}
var Ro = Object.getOwnPropertySymbols, Uo = Ro ? function(e) {
  for (var t = []; e; )
    se(t, ue(e)), e = ce(e);
  return t;
} : pt;
const gt = Uo;
function qo(e, t) {
  return U(e, gt(e), t);
}
function ht(e, t, r) {
  var n = t(e);
  return T(e) ? n : se(n, r(e));
}
function No(e) {
  return ht(e, ne, ue);
}
function yt(e) {
  return ht(e, oe, gt);
}
var Lo = S(g, "DataView");
const J = Lo;
var Bo = S(g, "Promise");
const Q = Bo;
var Ho = S(g, "Set");
const X = Ho;
var De = "[object Map]", Go = "[object Object]", Fe = "[object Promise]", Re = "[object Set]", Ue = "[object WeakMap]", qe = "[object DataView]", zo = O(J), Ko = O(D), ko = O(Q), Vo = O(X), Wo = O(Y), v = b;
(J && v(new J(new ArrayBuffer(1))) != qe || D && v(new D()) != De || Q && v(Q.resolve()) != Fe || X && v(new X()) != Re || Y && v(new Y()) != Ue) && (v = function(e) {
  var t = b(e), r = t == Go ? e.constructor : void 0, n = r ? O(r) : "";
  if (n)
    switch (n) {
      case zo:
        return qe;
      case Ko:
        return De;
      case ko:
        return Fe;
      case Vo:
        return Re;
      case Wo:
        return Ue;
    }
  return t;
});
const fe = v;
var Yo = Object.prototype, Jo = Yo.hasOwnProperty;
function Qo(e) {
  var t = e.length, r = new e.constructor(t);
  return t && typeof e[0] == "string" && Jo.call(e, "index") && (r.index = e.index, r.input = e.input), r;
}
var Xo = g.Uint8Array;
const Ne = Xo;
function le(e) {
  var t = new e.constructor(e.byteLength);
  return new Ne(t).set(new Ne(e)), t;
}
function Zo(e, t) {
  var r = t ? le(e.buffer) : e.buffer;
  return new e.constructor(r, e.byteOffset, e.byteLength);
}
var xo = /\w*$/;
function ea(e) {
  var t = new e.constructor(e.source, xo.exec(e));
  return t.lastIndex = e.lastIndex, t;
}
var Le = p ? p.prototype : void 0, Be = Le ? Le.valueOf : void 0;
function ta(e) {
  return Be ? Object(Be.call(e)) : {};
}
function ra(e, t) {
  var r = t ? le(e.buffer) : e.buffer;
  return new e.constructor(r, e.byteOffset, e.length);
}
var na = "[object Boolean]", oa = "[object Date]", aa = "[object Map]", ia = "[object Number]", sa = "[object RegExp]", ca = "[object Set]", ua = "[object String]", fa = "[object Symbol]", la = "[object ArrayBuffer]", pa = "[object DataView]", ga = "[object Float32Array]", ha = "[object Float64Array]", ya = "[object Int8Array]", da = "[object Int16Array]", ba = "[object Int32Array]", ma = "[object Uint8Array]", Ta = "[object Uint8ClampedArray]", _a = "[object Uint16Array]", $a = "[object Uint32Array]";
function va(e, t, r) {
  var n = e.constructor;
  switch (t) {
    case la:
      return le(e);
    case na:
    case oa:
      return new n(+e);
    case pa:
      return Zo(e, r);
    case ga:
    case ha:
    case ya:
    case da:
    case ba:
    case ma:
    case Ta:
    case _a:
    case $a:
      return ra(e, r);
    case aa:
      return new n();
    case ia:
    case ua:
      return new n(e);
    case sa:
      return ea(e);
    case ca:
      return new n();
    case fa:
      return ta(e);
  }
}
function wa(e) {
  return typeof e.constructor == "function" && !te(e) ? ir(ce(e)) : {};
}
var ja = "[object Map]";
function Oa(e) {
  return m(e) && fe(e) == ja;
}
var He = P && P.isMap, Sa = He ? re(He) : Oa;
const Aa = Sa;
var Pa = "[object Set]";
function Ca(e) {
  return m(e) && fe(e) == Pa;
}
var Ge = P && P.isSet, Ea = Ge ? re(Ge) : Ca;
const Ia = Ea;
var Ma = 1, Da = 2, Fa = 4, dt = "[object Arguments]", Ra = "[object Array]", Ua = "[object Boolean]", qa = "[object Date]", Na = "[object Error]", bt = "[object Function]", La = "[object GeneratorFunction]", Ba = "[object Map]", Ha = "[object Number]", mt = "[object Object]", Ga = "[object RegExp]", za = "[object Set]", Ka = "[object String]", ka = "[object Symbol]", Va = "[object WeakMap]", Wa = "[object ArrayBuffer]", Ya = "[object DataView]", Ja = "[object Float32Array]", Qa = "[object Float64Array]", Xa = "[object Int8Array]", Za = "[object Int16Array]", xa = "[object Int32Array]", ei = "[object Uint8Array]", ti = "[object Uint8ClampedArray]", ri = "[object Uint16Array]", ni = "[object Uint32Array]", c = {};
c[dt] = c[Ra] = c[Wa] = c[Ya] = c[Ua] = c[qa] = c[Ja] = c[Qa] = c[Xa] = c[Za] = c[xa] = c[Ba] = c[Ha] = c[mt] = c[Ga] = c[za] = c[Ka] = c[ka] = c[ei] = c[ti] = c[ri] = c[ni] = !0;
c[Na] = c[bt] = c[Va] = !1;
function N(e, t, r, n, o, a) {
  var i, s = t & Ma, f = t & Da, l = t & Fa;
  if (r && (i = o ? r(e, n, o, a) : r(e)), i !== void 0)
    return i;
  if (!R(e))
    return e;
  var he = T(e);
  if (he) {
    if (i = Qo(e), !s)
      return cr(e, i);
  } else {
    var A = fe(e), ye = A == bt || A == La;
    if (ot(e))
      return Co(e, s);
    if (A == mt || A == dt || ye && !o) {
      if (i = f || ye ? {} : wa(e), !s)
        return f ? qo(e, Ao(i, e)) : Fo(e, So(i, e));
    } else {
      if (!c[A])
        return o ? e : {};
      i = va(e, A, s);
    }
  }
  a || (a = new C());
  var de = a.get(e);
  if (de)
    return de;
  a.set(e, i), Ia(e) ? e.forEach(function(y) {
    i.add(N(y, t, r, y, e, a));
  }) : Aa(e) && e.forEach(function(y, $) {
    i.set($, N(y, t, r, $, e, a));
  });
  var vt = l ? f ? yt : No : f ? oe : ne, be = he ? void 0 : vt(e);
  return Tr(be || e, function(y, $) {
    be && ($ = y, y = e[$]), Ze(i, $, N(y, t, r, $, e, a));
  }), i;
}
function oi(e) {
  var t = e == null ? 0 : e.length;
  return t ? e[t - 1] : void 0;
}
var ai = "[object String]";
function ii(e) {
  return typeof e == "string" || !T(e) && m(e) && b(e) == ai;
}
function si(e, t) {
  return t.length < 2 ? e : co(e, To(t, 0, -1));
}
function ci(e, t) {
  return t = ie(t, e), e = si(e, t), e == null || delete e[ct(oi(t))];
}
function ui(e) {
  return d(e) ? void 0 : e;
}
var fi = 1, li = 2, pi = 4, gi = lo(function(e, t) {
  var r = {};
  if (e == null)
    return r;
  var n = !1;
  t = Ye(t, function(a) {
    return a = ie(a, e), n || (n = a.length > 1), a;
  }), U(e, yt(e), r), n && (r = N(r, fi | li | pi, ui));
  for (var o = t.length; o--; )
    ci(r, t[o]);
  return r;
});
const hi = gi;
function pe(e) {
  return Object.prototype.toString.call(e) === "[object URLSearchParams]";
}
function ge(e) {
  return e = e.toUpperCase(), {
    GET: {
      request_body: !1
    },
    POST: {
      request_body: !0
    },
    PUT: {
      request_body: !0
    },
    DELETE: {
      request_body: !0
    },
    HEAD: {
      request_body: !1
    },
    OPTIONS: {
      request_body: !1
    },
    PATCH: {
      request_body: !0
    }
  }[e].request_body;
}
function Tt(e) {
  d(e) && Object.entries(e).forEach(([t, r]) => {
    typeof r == "string" ? e[t] = r.trim() : d(r) && Tt(r);
  });
}
const yi = async (e, t) => {
  ge(e.config.method) && Tt(e.params), await t();
}, di = (e) => pe(e) ? e.toString() : typeof e == "string" ? e : d(e) ? JSON.stringify(e) : "";
async function bi(e, t) {
  if (!e.params)
    e.key = `${e.url}${e.config.method}`;
  else {
    const r = di(e.params);
    r && (e.key = `${e.url}${r}${e.config.method}`);
  }
  await t();
}
const W = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map();
function mi(e) {
  if (Z.get(e.key))
    return new Promise((r) => {
      const n = B.get(e.key) || [];
      B.set(e.key, n.concat(r));
    });
  Z.set(e.key, !0);
}
function Ti(e) {
  const t = B.get(e.key);
  t && t.length > 0 && t.forEach((r) => {
    e.error ? r({
      error: e.error
    }) : r({
      response: e.response
    });
  }), B.delete(e.key), Z.delete(e.key);
}
const _i = async (e, t) => {
  if (e.key)
    if (e.config.mergeRequest) {
      const r = await mi(e);
      if (r) {
        Object.keys(r).forEach((n) => {
          e[n] = r[n];
        });
        return;
      }
    } else {
      if (W.get(e.key) && !e.config.mergeRequest) {
        e.error = {
          type: "REPEAT",
          msg: "重复请求",
          config: e.config
        };
        return;
      }
      W.set(e.key, !0);
    }
  await t(), e.key && (e.config.mergeRequest ? Ti(e) : W.delete(e.key));
}, _t = "__REQUEST_CACHE:", F = {
  ram: "ram",
  session: "sessionStorage",
  local: "localStorage"
}, x = /* @__PURE__ */ new Map(), $t = 1e3 * 60 * 3;
function q(e, t = "ram") {
  return t !== F.ram ? `${_t}${e}` : e;
}
function ze(e) {
  return d(e) || ii(e) || Array.isArray(e) || pe(e);
}
function $i({ key: e, cacheType: t = "ram", data: r, cacheTime: n = $t }) {
  const o = q(e, t), a = {
    cacheType: t,
    data: r,
    cacheTime: n,
    expire: Date.now() + n
  };
  if (t !== F.ram) {
    const i = window[F[t]];
    try {
      i.setItem(o, JSON.stringify(a));
    } catch {
      for (const f in i)
        f.startsWith(_t) && Object.prototype.hasOwnProperty.call(i, f) && i.removeItem(f);
    }
  } else
    x.set(o, a);
}
function Ke({ expire: e, cacheTime: t }) {
  return !(!t || e >= Date.now());
}
function vi({ key: e, cacheType: t = "ram" }) {
  const r = q(e, t);
  if (t !== F.ram) {
    const n = window[F[t]], o = n.getItem(r) || null;
    try {
      const a = JSON.parse(o);
      return a && !Ke(a) ? a.data : (n.removeItem(r), null);
    } catch {
      return n.removeItem(r), null;
    }
  } else {
    const n = x.get(r);
    return n && !Ke(n) ? n.data : (x.delete(r), null);
  }
}
const H = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map();
function wi(e, t) {
  const r = q(e.key, t.cacheType);
  if (H.get(r))
    return new Promise((o) => {
      const a = w.get(r) || [];
      w.set(r, a.concat(o));
    });
  H.set(r, !0);
}
function ji(e, t) {
  const r = q(e.key, t.cacheType), n = w.get(r);
  n && n.length > 0 && n.forEach((o) => {
    o({
      response: e.response
    });
  }), w.delete(r), H.delete(r);
}
function Oi(e, t) {
  const r = q(e.key, t.cacheType), n = w.get(r);
  n && n.length > 0 ? (n.shift()(), w.set(r, n)) : (w.delete(r), H.delete(r));
}
function Si(e) {
  return e.config.cacheData ? e.key ? !0 : (console.warn(`request: ${e.url} 请求参数无法序列化，无法缓存，请移除相关配置`), !1) : !1;
}
function Ai(e) {
  return typeof e.config.cacheData == "object" ? e.config.cacheData : {
    cacheType: "ram",
    cacheTime: $t
  };
}
const Pi = async (e, t) => {
  if (Si(e)) {
    const r = Ai(e), n = vi({ key: e.key, cacheType: r.cacheType });
    if (n) {
      e.response = n;
      return;
    }
    const o = await wi(e, r);
    if (o) {
      Object.keys(o).forEach((a) => {
        e[a] = o[a];
      });
      return;
    }
    await t(), ze(e.response) || console.warn(`request: ${e.url} 响应数据无法序列化，无法缓存，请移除相关配置`), !e.error && e.response && ze(e.response) ? (ji(e, r), $i({
      key: e.key,
      data: e.response,
      ...r
    })) : Oi(e, r);
  } else
    await t();
}, Ci = (e) => new Promise((t, r) => {
  setTimeout(() => {
    r({
      type: "TIMEOUT",
      msg: "请求超时"
    });
  }, e);
}), Ei = (e) => {
  if (!ge(e.config.method) && d(e.params)) {
    if (pe(e.params))
      return `${e.url}?${e.params.toString()}`;
    if (d(e.params))
      return `${e.url}?${new URLSearchParams(e.params).toString()}`;
  }
  return e.url;
}, Ii = (e) => {
  if (ge(e.config.method)) {
    const t = new Headers(e.config.headers);
    let r = e.params;
    if (G(e.config.transformParams) && (r = e.config.transformParams(e.params)), d(r)) {
      if (t.get("Content-Type") === "application/x-www-form-urlencoded") {
        const n = new FormData();
        return Object.keys(r).forEach((o) => {
          n.append(o, r[o]);
        }), n;
      }
      return JSON.stringify(r);
    }
    return r;
  }
}, ke = (e) => {
  const t = {};
  return e.forEach((r, n) => {
    t[n] = r;
  }), t;
}, Mi = (e) => fetch(Ei(e), {
  ...hi(e.config, ["baseURL", "timeout", "transformParams", "transformData", "responseType"]),
  body: Ii(e)
}).then((t) => {
  if (t.ok) {
    const r = t.headers.get("content-type");
    let n;
    return /application\/json/i.test(r) || e.config.responseType === "json" ? n = t.json() : /text|xml/.test(r) || e.config.responseType === "text" ? n = t.text() : e.config.responseType === "arrayBuffer" ? n = t.arrayBuffer() : e.config.responseType === "formData" ? n = t.formData() : (e.config.responseType, n = t.blob()), G(e.config.transformData) && (n = e.config.transformData(n)), {
      status: t.status,
      data: n,
      headers: ke(t.headers)
    };
  }
  return Promise.reject({
    config: e.config,
    response: {
      status: t.status,
      headers: ke(t.headers)
    }
  });
});
async function Di(e, t) {
  await Promise.race([Ci(e.config.timeout), Mi(e)]).then((r) => {
    e.response = r;
  }).catch((r) => {
    e.error = r;
  }), await t();
}
function Fi(e) {
  const t = {
    timeout: 1e4,
    credentials: "include",
    ...e
  }, n = new wt().use(jt).use(yi).use(bi).use(Pi).use(_i).use(Di).compose();
  return (o, a, i) => n({
    url: o,
    params: a,
    config: {
      ...t,
      ...i
    }
  });
}
export {
  Fi as createRequest
};
