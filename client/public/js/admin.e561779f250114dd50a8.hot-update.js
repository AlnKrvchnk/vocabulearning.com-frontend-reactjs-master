/*! For license information please see admin.e561779f250114dd50a8.hot-update.js.LICENSE.txt */
"use strict";self.webpackHotUpdateclient("admin",{"./src/admin/components/subtitles/SubtitlesTable.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{eval('__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "default": () => (/* binding */ SubtitlesTable)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");\n/* harmony import */ var _config_API__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../config/API */ "./src/config/API.js");\n/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../functions */ "./src/functions.js");\n/* harmony import */ var _global_components_layout_Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../global-components/layout/Button */ "./src/global-components/layout/Button.js");\nfunction _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }\nfunction _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called"); } return self; }\nfunction _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\n\n\n\n\nvar SubtitlesTable = /*#__PURE__*/function (_React$Component) {\n  _inherits(SubtitlesTable, _React$Component);\n  var _super = _createSuper(SubtitlesTable);\n  function SubtitlesTable(props) {\n    var _this;\n    _classCallCheck(this, SubtitlesTable);\n    _this = _super.call(this, props);\n    _this.state = {\n      from_slice: props.from_slice || 0,\n      to_slice: props.to_slice || 1,\n      default_slice_value: 10,\n      hasEdited: {}\n    };\n    _this.paginate = _this.paginate.bind(_assertThisInitialized(_this));\n    _this.onCreateWordHandler = _this.onCreateWordHandler.bind(_assertThisInitialized(_this));\n    return _this;\n  }\n  _createClass(SubtitlesTable, [{\n    key: "paginate",\n    value: function paginate(from_slice) {\n      var to_slice = from_slice + 1;\n      this.state.to_slice = to_slice;\n      this.state.from_slice = from_slice;\n      this.setState(function () {\n        return {\n          from_slice: from_slice,\n          to_slice: to_slice\n        };\n      });\n    }\n  }, {\n    key: "getActiveTranslate",\n    value: function getActiveTranslate(item, itemIndex) {\n      if (this.props.listTranslates.length) {\n        var translates = this.props.listTranslates,\n          trItem = translates[itemIndex];\n        if (trItem) {\n          return trItem ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("b", null, trItem.text), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("input", {\n            type: "text",\n            value: trItem.timecode.start_time\n          }), " - ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("input", {\n            type: "text",\n            value: trItem.timecode.end_time\n          }))) : \'\';\n        }\n      }\n      return \'\';\n    }\n  }, {\n    key: "getFieldsItem",\n    value: function getFieldsItem(fieldId) {\n      var _this2 = this;\n      var valid_fields = [\'start_text\', \'end_text\', \'start_time\', \'end_time\'];\n      var data = {};\n      valid_fields.forEach(function (item) {\n        data[item] = document.getElementById(_this2.genName(fieldId, item)).value;\n      });\n      return data;\n    }\n  }, {\n    key: "saveFields",\n    value: function saveFields(_ref) {\n      var id = _ref.id,\n        word_id = _ref.word_id;\n      var data = this.getFieldsItem(id);\n      data[\'word_id\'] = this.state.hasEdited[id] ? this.state.hasEdited[id] : word_id;\n      data[\'action\'] = \'PUT\';\n      data[\'id\'] = id;\n      axios__WEBPACK_IMPORTED_MODULE_0__["default"].put(_config_API__WEBPACK_IMPORTED_MODULE_2__["default"].host + \'/api/subtitles\', data, {\n        headers: {\n          \'Authorization\': (0,_functions__WEBPACK_IMPORTED_MODULE_3__.getCurrentUserToken)()\n        }\n      }).then(function (response) {\n        var msg = response.data;\n        return (0,_functions__WEBPACK_IMPORTED_MODULE_3__.Toast)(msg.error_message, msg.success ? \'green\' : \'red\');\n      });\n    }\n  }, {\n    key: "onCreateWordHandler",\n    value: function onCreateWordHandler(_ref2) {\n      var _this3 = this;\n      var id = _ref2.id;\n      var fields = this.getFieldsItem(id);\n      this.props.onCreateWord(fields[\'start_text\'].split(\' \')[0], fields[\'start_text\'], fields[\'end_text\'], function (data) {\n        if (data.insertId) {\n          (0,_functions__WEBPACK_IMPORTED_MODULE_3__.Toast)(\'Успешно добавлено в курс!\');\n          _this3.setState(function (prevState) {\n            return {\n              hasEdited: _objectSpread(_objectSpread({}, prevState.hasEdited), {}, _defineProperty({}, id, data.insertId))\n            };\n          }, function () {\n            _this3.saveFields({\n              id: id,\n              word_id: data.insertId\n            });\n          });\n        }\n      });\n    }\n  }, {\n    key: "genName",\n    value: function genName(_id, _name) {\n      return "subtitle[".concat(_id, "][").concat(_name, "]");\n    }\n  }, {\n    key: "render",\n    value: function render() {\n      var _this4 = this;\n      var _this$props = this.props,\n        list = _this$props.list,\n        listTranslates = _this$props.listTranslates,\n        _this$props$isApiData = _this$props.isApiData,\n        isApiData = _this$props$isApiData === void 0 ? false : _this$props$isApiData;\n      var _this$state = this.state,\n        from_slice = _this$state.from_slice,\n        to_slice = _this$state.to_slice,\n        default_slice_value = _this$state.default_slice_value,\n        hasEdited = _this$state.hasEdited;\n\n      // pagination\n      var COUNT_SYMB_PAG = Math.floor(list.length / default_slice_value);\n      var showPagination = function showPagination() {\n        var alls = [];\n        var to_slice_val = to_slice + default_slice_value / 2,\n          minus_val = to_slice_val - COUNT_SYMB_PAG - 1;\n        minus_val = minus_val < 0 ? 0 : minus_val;\n        to_slice_val -= minus_val > 0 ? minus_val : 0;\n        var _loop = function _loop(i) {\n          if (i < 0) return "continue";\n          alls.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("a", {\n            href: "",\n            key: i,\n            className: "pagination__item ".concat(_this4.state.from_slice == i ? \'pagination__item--active\' : \'\'),\n            onClick: function onClick(e) {\n              e.preventDefault();\n              _this4.paginate(i);\n            }\n          }, i + 1));\n        };\n        for (var i = from_slice - minus_val; i < to_slice_val; i++) {\n          var _ret = _loop(i);\n          if (_ret === "continue") continue;\n        }\n        return alls;\n      };\n      var slice_data = list.slice(from_slice * default_slice_value, to_slice * default_slice_value);\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {\n        className: "SubtitlesTable"\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("form", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("table", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("thead", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("th", {\n        width: "30"\n      }, "#"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("th", null, "\\u0422\\u0430\\u0439\\u043C\\u0438\\u043D\\u0433 \\u0438 \\u0444\\u0440\\u0430\\u0437\\u0430"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("th", null, "\\u041F\\u0435\\u0440\\u0435\\u0432\\u043E\\u0434"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("th", null, "\\u0414\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u044F"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("tbody", null, list.length ? slice_data.map(function (item, i) {\n        var n_start_text = _this4.genName(item.id, \'start_text\'),\n          n_start_time = _this4.genName(item.id, \'start_time\'),\n          n_end_text = _this4.genName(item.id, \'end_text\'),\n          n_end_time = _this4.genName(item.id, \'end_time\');\n        if (isApiData) {\n          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("tr", {\n            "data-id": item.id,\n            key: i\n          }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("td", {\n            width: "30"\n          }, i + 1), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("input", {\n            type: "text",\n            id: n_start_text,\n            name: n_start_text,\n            defaultValue: item.start_text\n          }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("input", {\n            type: "text",\n            id: n_start_time,\n            name: n_start_time,\n            defaultValue: item.start_time\n          }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("input", {\n            type: "text",\n            id: n_end_text,\n            name: n_end_text,\n            defaultValue: item.end_text\n          }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", null, "- ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("input", {\n            type: "text",\n            id: n_end_time,\n            name: n_end_time,\n            defaultValue: item.end_time\n          }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("td", null, item.word_id || hasEdited[item.id] ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_global_components_layout_Button__WEBPACK_IMPORTED_MODULE_4__["default"], {\n            title: \'Редактировать в курсе\',\n            onChange: function onChange() {\n              self.loadWord(item.word_id ? item.word_id : hasEdited[item.id]);\n            },\n            color: \'green\'\n          }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_global_components_layout_Button__WEBPACK_IMPORTED_MODULE_4__["default"], {\n            title: \'Добавить в курс\',\n            onChange: function onChange() {\n              _this4.onCreateWordHandler(item);\n            }\n          }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_global_components_layout_Button__WEBPACK_IMPORTED_MODULE_4__["default"], {\n            title: \'Сохранить поля\',\n            onChange: function onChange() {\n              return _this4.saveFields(item);\n            }\n          })));\n        } else {\n          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("tr", {\n            key: i\n          }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("td", {\n            width: "30"\n          }, item.index), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("input", {\n            type: "text",\n            value: item.text\n          }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("input", {\n            type: "text",\n            value: item.timecode.start_time\n          }), " - ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("input", {\n            type: "text",\n            value: item.timecode.end_time\n          }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("td", null, _this4.getActiveTranslate(item, i)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("td", null));\n        }\n      }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("tr", null)))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {\n        className: "lemma__pagination__block lemma__phrases__pagination__block"\n      }, list.length >= default_slice_value ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {\n        className: "fingman__phrases__pagination"\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("a", {\n        href: "",\n        onClick: function onClick(e) {\n          e.preventDefault();\n          _this4.paginate(from_slice - 1 < 0 ? 0 : from_slice - 1);\n        },\n        className: "pagination__item pagination__prev"\n      }, "<"), showPagination(), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("a", {\n        href: "",\n        onClick: function onClick(e) {\n          e.preventDefault();\n          _this4.paginate(from_slice + 1 > COUNT_SYMB_PAG ? from_slice : from_slice + 1);\n        },\n        className: "pagination__item pagination__next"\n      }, ">")) : \'\'));\n    }\n  }]);\n  return SubtitlesTable;\n}(react__WEBPACK_IMPORTED_MODULE_1__.Component);\n\n\n//# sourceURL=webpack://client/./src/admin/components/subtitles/SubtitlesTable.js?')}},(function(e){e.h=()=>"22f7deb453345321c8a8"}));