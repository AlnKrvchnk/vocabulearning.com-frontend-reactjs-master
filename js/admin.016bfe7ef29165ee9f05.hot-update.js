/*! For license information please see admin.016bfe7ef29165ee9f05.hot-update.js.LICENSE.txt */
"use strict";self.webpackHotUpdateclient("admin",{"./src/global-components/layout/SelectSearch.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{eval('__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "default": () => (/* binding */ SelectSearch)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v1.js");\n/* harmony import */ var _SelectSearch_index_less__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SelectSearch/index.less */ "./src/global-components/layout/SelectSearch/index.less");\nfunction _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }\nfunction _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called"); } return self; }\nfunction _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\n\n\nvar SelectSearch = /*#__PURE__*/function (_React$Component) {\n  _inherits(SelectSearch, _React$Component);\n  var _super = _createSuper(SelectSearch);\n  function SelectSearch(props) {\n    var _this;\n    _classCallCheck(this, SelectSearch);\n    _this = _super.call(this, props);\n    _this.state = {\n      inputVisible: false,\n      id_name: (0,uuid__WEBPACK_IMPORTED_MODULE_2__["default"])(),\n      arr_data: [],\n      stateValue: \'\'\n    };\n    _this.toggleInputSearch = _this.toggleInputSearch.bind(_assertThisInitialized(_this));\n    _this.searchDataSelect = _this.searchDataSelect.bind(_assertThisInitialized(_this));\n    _this.changeSelectValue = _this.changeSelectValue.bind(_assertThisInitialized(_this));\n    return _this;\n  }\n  _createClass(SelectSearch, [{\n    key: "idRootElem",\n    get: function get() {\n      return \'ssearch-\' + this.state.id_name;\n    }\n  }, {\n    key: "idSelectElem",\n    get: function get() {\n      return \'sselect-\' + this.state.id_name;\n    }\n  }, {\n    key: "changeSelectValue",\n    value: function changeSelectValue(_ref) {\n      var title = _ref.title,\n        value = _ref.value;\n      this.setState(function () {\n        return {\n          stateValue: value\n        };\n      });\n      this.toggleInputSearch();\n    }\n  }, {\n    key: "searchDataSelect",\n    value: function searchDataSelect() {\n      var search_data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : \'\';\n      var toggleVisible = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;\n      var arr_data = [];\n      var data = $(\'#\' + this.idSelectElem).find(\'option:not(:disabled)\').each(function () {\n        var t = this;\n        arr_data.push({\n          title: t.innerText,\n          value: t.value\n        });\n      });\n      this.setState(function () {\n        return {\n          arr_data: arr_data,\n          stateValue: search_data\n        };\n      });\n      if (toggleVisible) {\n        this.toggleInputSearch(null, true);\n      }\n    }\n  }, {\n    key: "toggleInputSearch",\n    value: function toggleInputSearch() {\n      var stateValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;\n      var inputVisibleValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;\n      if (stateValue) return this.setState(function () {\n        return {\n          stateValue: stateValue\n        };\n      });\n      this.setState(function (prevState) {\n        return {\n          inputVisible: inputVisibleValue && !prevState.inputVisible\n        };\n      });\n    }\n  }, {\n    key: "render",\n    value: function render() {\n      var _this2 = this;\n      var _this$props = this.props,\n        _onChange = _this$props.onChange,\n        name = _this$props.name,\n        _this$props$onMapItem = _this$props.onMapItems,\n        onMapItems = _this$props$onMapItem === void 0 ? null : _this$props$onMapItem,\n        _this$props$dataOnMap = _this$props.dataOnMap,\n        dataOnMap = _this$props$dataOnMap === void 0 ? [] : _this$props$dataOnMap,\n        _this$props$placehold = _this$props.placeholder,\n        placeholder = _this$props$placehold === void 0 ? \'\' : _this$props$placehold,\n        _this$props$value = _this$props.value,\n        value = _this$props$value === void 0 ? \'\' : _this$props$value,\n        _this$props$required = _this$props.required,\n        required = _this$props$required === void 0 ? 0 : _this$props$required;\n      var _this$state = this.state,\n        inputVisible = _this$state.inputVisible,\n        id_name = _this$state.id_name,\n        arr_data = _this$state.arr_data,\n        _this$state$stateValu = _this$state.stateValue,\n        stateValue = _this$state$stateValu === void 0 ? \'\' : _this$state$stateValu;\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {\n        id: this.idRootElem,\n        onBlur: function onBlur(e) {\n          if (!$(e.relatedTarget).hasClass(\'select-search__link\')) _this2.toggleInputSearch();\n        },\n        className: "Tsds-english__select select-search"\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("input", {\n        defaultValue: stateValue,\n        name: id_name,\n        onClick: function onClick() {\n          return _this2.searchDataSelect(\'\', true);\n        },\n        placeholder: placeholder,\n        onInput: function onInput(e) {\n          var etv = e.target.value;\n          _this2.searchDataSelect(etv, false);\n        },\n        className: "select-search__input",\n        id: id_name\n      }), inputVisible && arr_data.length ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {\n        className: "select-search__data"\n      }, arr_data.map(function (item, i) {\n        // Если элемент поиска не найден в массиве - ничего не выводим\n        if (stateValue.length >= 1 && item.title.toUpperCase().match(eval(\'/\' + stateValue.toUpperCase() + \'/g\')) == null) return \'\';\n        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {\n          className: "select-search__link",\n          href: \'#\',\n          key: i,\n          onClick: function onClick() {\n            return _this2.changeSelectValue(item);\n          }\n        }, item.title);\n      })) : \'\', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("select", {\n        id: this.idSelectElem,\n        required: !!required,\n        onChange: function onChange() {\n          _onChange ? _onChange : \'\';\n        },\n        name: name,\n        className: "browser-default",\n        defaultValue: value,\n        value: stateValue\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("option", {\n        selected: true,\n        hidden: true,\n        disabled: true\n      }, placeholder), onMapItems && dataOnMap ? dataOnMap.map(function (item, i) {\n        return onMapItems(item, i);\n      }) : \'\'));\n    }\n  }]);\n  return SelectSearch;\n}(react__WEBPACK_IMPORTED_MODULE_0__.Component);\n\n\n//# sourceURL=webpack://client/./src/global-components/layout/SelectSearch.js?')}},(function(e){e.h=()=>"24afae916d58999caad4"}));