/*! For license information please see admin.47588ee61973f5f5c189.hot-update.js.LICENSE.txt */
"use strict";self.webpackHotUpdateclient("admin",{"./src/index-admin.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{eval('__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");\n/* harmony import */ var materialize_css_dist_css_materialize_min_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! materialize-css/dist/css/materialize.min.css */ "./node_modules/materialize-css/dist/css/materialize.min.css");\n/* harmony import */ var _admin_assets_less_index_less__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./admin/assets/less/index.less */ "./src/admin/assets/less/index.less");\n/* harmony import */ var _global_components_EditorContent__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./global-components/EditorContent */ "./src/global-components/EditorContent.js");\n/* harmony import */ var _init_materialize__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./init-materialize */ "./src/init-materialize.js");\n/* harmony import */ var _admin_App__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./admin/App */ "./src/admin/App.js");\n/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./functions */ "./src/functions.js");\nfunction _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }\nfunction _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called"); } return self; }\nfunction _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\n\n\n\n\n\n\n\n\nvar App = /*#__PURE__*/function (_React$Component) {\n  _inherits(App, _React$Component);\n  var _super = _createSuper(App);\n  function App() {\n    var _this;\n    _classCallCheck(this, App);\n    _this = _super.call(this);\n    _this.state = {\n      app_loaded: false\n    };\n    return _this;\n  }\n  _createClass(App, [{\n    key: "componentDidMount",\n    value: function componentDidMount() {\n      var _this2 = this;\n      window.__e = _global_components_EditorContent__WEBPACK_IMPORTED_MODULE_4__["default"];\n      // получение пользователя и его роли\n      _functions__WEBPACK_IMPORTED_MODULE_7__.$API.getUser(function (data) {\n        var currentRole = 0;\n        if (data.success) {\n          currentRole = data.data.role;\n        }\n        window.__user_role = currentRole;\n        __e.loadAll(function () {\n          return _this2.setState(function () {\n            return {\n              app_loaded: true\n            };\n          });\n        });\n      });\n    }\n  }, {\n    key: "render",\n    value: function render() {\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_8__.BrowserRouter, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {\n        className: "Tsds__admin wrapper",\n        id: "root-application"\n      }, this.state.app_loaded ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_admin_App__WEBPACK_IMPORTED_MODULE_6__["default"], null) : \'\'));\n    }\n  }]);\n  return App;\n}(react__WEBPACK_IMPORTED_MODULE_0__.Component);\nreact_dom__WEBPACK_IMPORTED_MODULE_1__.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(App, null), document.getElementById(\'app\'));\n\n//# sourceURL=webpack://client/./src/index-admin.js?')}},(function(e){e.h=()=>"1124b93b03defa04aa94"}));