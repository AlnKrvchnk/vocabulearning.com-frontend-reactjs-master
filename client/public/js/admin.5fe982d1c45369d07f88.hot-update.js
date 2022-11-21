webpackHotUpdate("admin",{

/***/ "./src/admin/routes/actions/components/IndexAction/CreateCourseModal.js":
/*!******************************************************************************!*\
  !*** ./src/admin/routes/actions/components/IndexAction/CreateCourseModal.js ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return CreateCourseModal; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _global_components_layout_Input__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../global-components/layout/Input */ \"./src/global-components/layout/Input.js\");\n/* harmony import */ var _global_components_layout_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../global-components/layout/Button */ \"./src/global-components/layout/Button.js\");\n/* harmony import */ var _global_components_layout_Inputs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../global-components/layout/Inputs */ \"./src/global-components/layout/Inputs.js\");\n/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../functions */ \"./src/functions.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! axios */ \"./node_modules/axios/index.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _config_API__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../config/API */ \"./src/config/API.js\");\n/* harmony import */ var materialize_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! materialize-css */ \"./node_modules/materialize-css/dist/js/materialize.js\");\n/* harmony import */ var materialize_css__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(materialize_css__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var cyrillic_to_translit_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! cyrillic-to-translit-js */ \"./node_modules/cyrillic-to-translit-js/CyrillicToTranslit.js\");\n/* harmony import */ var cyrillic_to_translit_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(cyrillic_to_translit_js__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var _components_CreateCourseModal_DefaultAudios__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/CreateCourseModal/DefaultAudios */ \"./src/admin/routes/actions/components/IndexAction/components/CreateCourseModal/DefaultAudios.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n\n\n\n\n\n\n\n\n\n\n\nvar CreateCourseModal =\n/*#__PURE__*/\nfunction (_React$Component) {\n  _inherits(CreateCourseModal, _React$Component);\n\n  function CreateCourseModal(props) {\n    var _this;\n\n    _classCallCheck(this, CreateCourseModal);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(CreateCourseModal).call(this, props));\n    _this.state = {\n      formCleared: false,\n      uriValue: '',\n      defaultInputValue: '',\n      sound_template_active: true\n    };\n    _this.parseInputs = _this.parseInputs.bind(_assertThisInitialized(_this));\n    _this.parseTitle = _this.parseTitle.bind(_assertThisInitialized(_this));\n    _this.changeSoundTemplate = _this.changeSoundTemplate.bind(_assertThisInitialized(_this));\n    _this.changeURI = _this.changeURI.bind(_assertThisInitialized(_this));\n    return _this;\n  }\n\n  _createClass(CreateCourseModal, [{\n    key: \"changeSoundTemplate\",\n    value: function changeSoundTemplate() {\n      this.setState(function (prevState) {\n        return {\n          sound_template_active: !prevState.sound_template_active\n        };\n      });\n    }\n  }, {\n    key: \"parseInputs\",\n    value: function parseInputs(form) {\n      var _this2 = this;\n\n      var formData = new FormData(form);\n      var TOKEN = Object(_functions__WEBPACK_IMPORTED_MODULE_4__[\"getCurrentUserToken\"])();\n      axios__WEBPACK_IMPORTED_MODULE_5___default.a.post(\"\".concat(_config_API__WEBPACK_IMPORTED_MODULE_6__[\"default\"].host, \"/admin/modules\"), formData, {\n        headers: {\n          'Content-Type': 'multipart/form-data',\n          'Authorization': TOKEN\n        }\n      }).then(function (response) {\n        if (response.data.success) {\n          _this2.setState({\n            formCleared: false,\n            uriValue: '',\n            defaultInputValue: ' '\n          });\n\n          _this2.myForm.reset();\n\n          window.modals['modal-create-module'].close();\n          materialize_css__WEBPACK_IMPORTED_MODULE_7___default.a.toast({\n            html: \"\\u041A\\u0443\\u0440\\u0441 \\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u043E \\u0441\\u043E\\u0437\\u0434\\u0430\\u043D!\",\n            classes: 'green'\n          }); // обновляем модули на главном экшене\n\n          _this2.props.triggerEvent();\n\n          setTimeout(function () {\n            // Редиректим на страницу редактирования\n            location.href = '/admin/courses/' + response.data.data.course_id;\n          }, 1500);\n        } else {\n          materialize_css__WEBPACK_IMPORTED_MODULE_7___default.a.toast({\n            html: response.data.error_message,\n            classes: 'red'\n          });\n        }\n      });\n    }\n  }, {\n    key: \"changeURI\",\n    value: function changeURI() {\n      var new_uri = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';\n      this.setState(function () {\n        return {\n          uriValue: new_uri\n        };\n      });\n    }\n  }, {\n    key: \"parseTitle\",\n    value: function parseTitle(value) {\n      var translistValue = cyrillic_to_translit_js__WEBPACK_IMPORTED_MODULE_8___default()().transform(value, '-').toLowerCase();\n      this.changeURI(translistValue);\n    }\n  }, {\n    key: \"componentDidMount\",\n    value: function componentDidMount() {\n      Object(_functions__WEBPACK_IMPORTED_MODULE_4__[\"updateSelects\"])();\n    }\n  }, {\n    key: \"render\",\n    value: function render() {\n      var _this3 = this;\n\n      var _this$state = this.state,\n          defaultInputValue = _this$state.defaultInputValue,\n          uriValue = _this$state.uriValue;\n      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"modal-content\",\n        id: 'createCourseModal'\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"form\", {\n        ref: function ref(el) {\n          return _this3.myForm = el;\n        },\n        onSubmit: function onSubmit(e) {\n          e.preventDefault();\n\n          _this3.parseInputs(e.target);\n        }\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"modal__row modal__row--between\"\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"modal__row__left\"\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_global_components_layout_Input__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n        val: defaultInputValue,\n        onChange: this.parseTitle,\n        isRequire: true,\n        name: 'name',\n        label: 'Название курса'\n      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"modal__row__right\"\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_global_components_layout_Input__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n        val: defaultInputValue,\n        isRequire: true,\n        name: 'description',\n        label: 'Описание курса'\n      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"modal__row modal__row--between\"\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"modal__row__left\"\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_global_components_layout_Input__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n        val: defaultInputValue,\n        validReg: /[0-9]+/g,\n        isRequire: true,\n        name: 'price',\n        label: 'Стоимость курса (рублей)'\n      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"modal__row__right\"\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_global_components_layout_Input__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n        val: defaultInputValue,\n        isRequire: true,\n        name: 'author',\n        label: 'Автор'\n      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"modal__row mb-3\"\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"label\", null, \"\\u0410\\u0434\\u0440\\u0435\\u0441 \\u043A\\u0443\\u0440\\u0441\\u0430 (\\u0443\\u043D\\u0438\\u043A\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439. \\u043D\\u0435 \\u0434\\u043E\\u043B\\u0436\\u0435\\u043D \\u0441\\u043E\\u0432\\u043F\\u0430\\u0434\\u0430\\u0442\\u044C \\u0441 \\u0434\\u0440\\u0443\\u0433\\u0438\\u043C \\u043A\\u0443\\u0440\\u0441\\u043E\\u043C)\")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"input\", {\n        value: uriValue,\n        onInput: function onInput(e) {\n          return _this3.changeURI(e.target.value);\n        },\n        required: true,\n        name: 'url'\n      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"modal__row modal__row--between\"\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"modal__row__left\"\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"label\", null, \"\\u041A\\u0430\\u0442\\u0435\\u0433\\u043E\\u0440\\u0438\\u044F \\u043A\\u0443\\u0440\\u0441\\u0430\")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_global_components_layout_Inputs__WEBPACK_IMPORTED_MODULE_3__[\"Select\"], {\n        col: 6,\n        name: 'category_name',\n        isRequire: true,\n        title: '',\n        items: _config_API__WEBPACK_IMPORTED_MODULE_6__[\"default\"].categories_courses\n      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"modal__row__right\"\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"label\", null, \"\\u042F\\u0437\\u044B\\u043A\\u0438 \\u043A\\u0443\\u0440\\u0441\\u0430\")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_global_components_layout_Inputs__WEBPACK_IMPORTED_MODULE_3__[\"Select\"], {\n        col: 6,\n        name: 'langueges',\n        title: '',\n        items: window.defaultLangueges\n      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"label\", null, \"\\u041E\\u043F\\u0443\\u0431\\u043B\\u0438\\u043A\\u043E\\u0432\\u0430\\u043D\")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_global_components_layout_Inputs__WEBPACK_IMPORTED_MODULE_3__[\"Select\"], {\n        col: 6,\n        name: 'is_public',\n        title: '',\n        items: [{\n          value: '1',\n          title: 'Да'\n        }, {\n          value: '0',\n          title: 'Нет'\n        }]\n      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"hr\", {\n        className: \"fingman__divider\"\n      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"modal__row modal__row--triple mt-4 mb-5\"\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"modal__col\"\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"label\", null, \"\\u0418\\u0437\\u043E\\u0431\\u0440\\u0430\\u0436\\u0435\\u043D\\u0438\\u0435 \\u043A\\u0443\\u0440\\u0441\\u0430\")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_global_components_layout_Inputs__WEBPACK_IMPORTED_MODULE_3__[\"File\"], {\n        val: '',\n        name: 'preview',\n        type: 'image'\n      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"modal__col\"\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"label\", null, this.state.sound_template_active ? 'Прослушайте шаблонный звук' : 'Загрузите свой звук верного / неверного ввода')), this.state.sound_template_active ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_CreateCourseModal_DefaultAudios__WEBPACK_IMPORTED_MODULE_9__[\"default\"], null) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_global_components_layout_Inputs__WEBPACK_IMPORTED_MODULE_3__[\"File\"], {\n        validExts: /(\\.mp3|\\.wav)/g,\n        title: 'Верный ввод',\n        type: 'audio',\n        name: 'def_audio_success'\n      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_global_components_layout_Inputs__WEBPACK_IMPORTED_MODULE_3__[\"File\"], {\n        validExts: /(\\.mp3|\\.wav)/g,\n        title: 'Неверный ввод',\n        type: 'audio',\n        name: 'def_audio_wrong'\n      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"modal__col\"\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"fingman_left_panel_checkboxes_wrapper\"\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"fingman_left_panel_checkbox_item\"\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", null, \"\\u0418\\u0441\\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u044C \\u0448\\u0430\\u0431\\u043B\\u043E\\u043D\\u043D\\u043E\\u0435 \\u0430\\u0443\\u0434\\u0438\\u043E\"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"input\", {\n        type: \"checkbox\",\n        defaultChecked: true,\n        id: \"is_template\",\n        name: \"is_template\",\n        onChange: this.changeSoundTemplate,\n        className: \"checkbox_public\"\n      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"label\", {\n        htmlFor: \"is_template\"\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", null)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", {\n        className: \"mt-2\"\n      }, \"\\u041E\\u0442\\u043A\\u043B\\u044E\\u0447\\u0438\\u0442\\u0435 \\u0447\\u0435\\u043A\\u0431\\u043E\\u043A\\u0441, \\u0435\\u0441\\u043B\\u0438 \\u0432\\u044B \\u0445\\u043E\\u0442\\u0438\\u0442\\u0435 \\u0438\\u0441\\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u044C \\u0441\\u0432\\u043E\\u0438 \\u0432\\u0430\\u0440\\u0438\\u0430\\u043D\\u0442\\u044B \\u0448\\u0430\\u0431\\u043B\\u043E\\u043D\\u043D\\u044B\\u0445 \\u0430\\u0443\\u0434\\u0438\\u043E\"))))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"modal__row mt-5 mb-5\"\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", null)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"hr\", {\n        className: \"fingman__divider mt-5 mb-5\"\n      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"modal__row modal__row--start\"\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_global_components_layout_Button__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n        color: 'blue',\n        customClass: 'shadow--none modal--submit',\n        submit: true,\n        title: 'Создать курс'\n      })))));\n    }\n  }]);\n\n  return CreateCourseModal;\n}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);\n\n\n\n//# sourceURL=webpack:///./src/admin/routes/actions/components/IndexAction/CreateCourseModal.js?");

/***/ }),

/***/ "./src/admin/routes/actions/components/IndexAction/components/CreateCourseModal/DefaultAudios.js":
/*!*******************************************************************************************************!*\
  !*** ./src/admin/routes/actions/components/IndexAction/components/CreateCourseModal/DefaultAudios.js ***!
  \*******************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return DefaultAudios; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n\nfunction DefaultAudios() {\n  var def_success = 'https://vocabulearning.com/templates/success.mp3',\n      def_wrong = 'https://vocabulearning.com/templates/wrong.mp3';\n  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"article\", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"input\", {\n    type: \"hidden\",\n    name: \"def_audio_success\",\n    defaultValue: def_success\n  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"input\", {\n    type: \"hidden\",\n    name: \"def_audio_wrong\",\n    defaultValue: def_wrong\n  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", null, \"\\u0412\\u0435\\u0440\\u043D\\u044B\\u0439 \\u0432\\u0432\\u043E\\u0434\"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"audio\", {\n    className: \"recorder-audio__current\",\n    src: def_success,\n    controls: true\n  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", null, \"\\u041D\\u0435\\u0432\\u0435\\u0440\\u043D\\u044B\\u0439 \\u0432\\u0432\\u043E\\u0434\"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"audio\", {\n    className: \"recorder-audio__current\",\n    src: def_wrong,\n    controls: true\n  }));\n}\n\n//# sourceURL=webpack:///./src/admin/routes/actions/components/IndexAction/components/CreateCourseModal/DefaultAudios.js?");

/***/ })

})