/*! For license information please see admin.a1b4991ce5f59134e6d7.hot-update.js.LICENSE.txt */
"use strict";self.webpackHotUpdateclient("admin",{"./src/users/pages/SingleCourse/components/LessonFastWatch.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{eval('__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "default": () => (/* binding */ LessonFastWatch)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");\n/* harmony import */ var _global_components_layout_Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../global-components/layout/Button */ "./src/global-components/layout/Button.js");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");\n/* harmony import */ var _config_API__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../config/API */ "./src/config/API.js");\n/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../functions */ "./src/functions.js");\n/* harmony import */ var nouislider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! nouislider */ "./node_modules/nouislider/dist/nouislider.js");\n/* harmony import */ var nouislider__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(nouislider__WEBPACK_IMPORTED_MODULE_5__);\nfunction _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }\nfunction _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called"); } return self; }\nfunction _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\n\n\n\n\n\n// import {} from \'../../../../../node_modules/nouislider/distribute/nouislider.min.css\'\nvar LessonFastWatch = /*#__PURE__*/function (_React$Component) {\n  _inherits(LessonFastWatch, _React$Component);\n  var _super = _createSuper(LessonFastWatch);\n  function LessonFastWatch(props) {\n    var _this;\n    _classCallCheck(this, LessonFastWatch);\n    _this = _super.call(this, props);\n    _this.state = {\n      isModalOpen: false,\n      showTranslate: true,\n      defaultSpeed: 1200,\n      defaultTimeout: 500,\n      activeWordIndex: 0,\n      translateBlockClass: \'\',\n      sliderInterval: null,\n      sliderTimeoutFunction: null,\n      words: [],\n      defaultDiapazone: null,\n      settings: {\n        btnTitle: \'Скрыть настройки\',\n        hiddenClass: \'hidden\'\n      }\n    };\n    _this.checkModalSettings = _this.checkModalSettings.bind(_assertThisInitialized(_this));\n    _this.destroyModal = _this.destroyModal.bind(_assertThisInitialized(_this));\n    _this.getActiveWord = _this.getActiveWord.bind(_assertThisInitialized(_this));\n    _this.destroySlider = _this.destroySlider.bind(_assertThisInitialized(_this));\n    _this.getSettings = _this.getSettings.bind(_assertThisInitialized(_this));\n    return _this;\n  }\n  _createClass(LessonFastWatch, [{\n    key: "componentDidMount",\n    value: function componentDidMount() {\n      var _this2 = this;\n      var TOKEN = (0,_functions__WEBPACK_IMPORTED_MODULE_4__.getCurrentUserToken)();\n      if (TOKEN && window.userData) {\n        axios__WEBPACK_IMPORTED_MODULE_2__["default"].get(_config_API__WEBPACK_IMPORTED_MODULE_3__["default"].host + \'/api/user/statistic\', {\n          headers: {\n            \'Authorization\': TOKEN\n          }\n        }).then(function (response) {\n          var currentCourse = response.data.data[_this2.props.id];\n          var words = currentCourse.words;\n          var validWords = words.filter(function (word) {\n            return word.word.repeat_invalid > 0 || word.word.repeat_valid > 0;\n          });\n          validWords = validWords.map(function (item) {\n            return {\n              word: item.word.word,\n              translate: item.word.explanation_word\n            };\n          });\n          if (validWords.length > 0) {\n            var slider = document.getElementById(\'fast-watch-diapazon\');\n            var diap = {\n              \'min\': 0,\n              \'max\': validWords.length - 1\n            };\n            nouislider__WEBPACK_IMPORTED_MODULE_5___default().create(slider, {\n              start: [0, 100],\n              connect: true,\n              step: 1,\n              orientation: \'horizontal\',\n              // \'horizontal\' or \'vertical\'\n              range: diap\n            });\n            slider.noUiSlider.on(\'change\', function (data) {\n              var min = parseInt(data[0]),\n                max = parseInt(data[1]);\n              _this2.setState(function () {\n                return {\n                  words: validWords\n                };\n              });\n              var wordsOnFilter = _this2.state.words;\n              var wordsFiltering = [];\n              for (var i = min; i <= max; i++) {\n                wordsFiltering.push(wordsOnFilter[i]);\n              }\n              var activeIndex = _this2.state.activeWordIndex;\n              if (wordsFiltering.length <= 0) {\n                wordsFiltering = wordsOnFilter;\n              } else {\n                activeIndex = 0;\n                _this2.state.activeWordIndex = activeIndex;\n              }\n              _this2.setState(function () {\n                return {\n                  defaultDiapazone: {\n                    \'min\': min,\n                    \'max\': max\n                  },\n                  words: wordsFiltering,\n                  activeWordIndex: activeIndex\n                };\n              });\n            });\n            _this2.setState(function () {\n              return {\n                words: validWords,\n                defaultDiapazone: diap\n              };\n            });\n          }\n        });\n      }\n      document.addEventListener(\'keyup\', function (e) {\n        if (e.keyCode == 27) _this2.destroyModal(\'CLOSE\');\n        _this2.destroySlider(\'STOP\');\n      });\n    }\n  }, {\n    key: "destroySlider",\n    value: function destroySlider(value) {\n      var _this3 = this;\n      if (this.state.sliderInterval !== null) {\n        clearInterval(this.state.sliderInterval);\n      }\n      switch (value) {\n        case \'STOP\':\n          this.setState(function () {\n            return {\n              sliderInterval: null,\n              sliderTimeoutFunction: null\n            };\n          });\n          break;\n        case \'START\':\n          var currentInterval = setInterval(function () {\n            _this3.setState(function () {\n              return {\n                translateBlockClass: \'hidden\',\n                sliderTimeoutFunction: null\n              };\n            });\n            if (_this3.state.activeWordIndex == _this3.state.words.length - 1) {\n              _this3.state.activeWordIndex = 0;\n            } else {\n              _this3.state.activeWordIndex++;\n            }\n            _this3.setState({\n              activeWordIndex: _this3.state.activeWordIndex\n            });\n            var dTimeout = setTimeout(function () {\n              _this3.setState(function () {\n                return {\n                  translateBlockClass: \'\'\n                };\n              });\n            }, _this3.state.defaultTimeout);\n            _this3.setState(function () {\n              return {\n                sliderTimeoutFunction: dTimeout\n              };\n            });\n          }, this.state.defaultSpeed);\n          this.setState(function () {\n            return {\n              sliderInterval: currentInterval\n            };\n          });\n          break;\n      }\n    }\n  }, {\n    key: "destroyModal",\n    value: function destroyModal(value) {\n      switch (value) {\n        case \'CLOSE\':\n          this.setState(function () {\n            return {\n              isModalOpen: false\n            };\n          });\n          break;\n        case \'OPEN\':\n          this.setState(function () {\n            return {\n              isModalOpen: true\n            };\n          });\n          break;\n      }\n    }\n  }, {\n    key: "checkModalSettings",\n    value: function checkModalSettings() {\n      if (this.state.isModalOpen) {\n        return \'\';\n      }\n      return \'hidden\';\n    }\n  }, {\n    key: "getActiveWord",\n    value: function getActiveWord() {\n      var currentWord = this.state.words[this.state.activeWordIndex];\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", {\n        className: "lesson-fastwatch__word"\n      }, currentWord.word), this.state.showTranslate && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("i", {\n        className: this.state.translateBlockClass\n      }, currentWord.translate), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", {\n        className: "lesson-fastwatch__word"\n      }, "Translate")));\n    }\n  }, {\n    key: "handleTypeStudiesClick",\n    value: function handleTypeStudiesClick() {\n      var topMenu = document.querySelector(\'.top_menu_open\');\n      var topMenuOverlay = document.querySelector(\'.top_menu_overlay_open\');\n      topMenu.classList.contains(\'top_menu_open_active\') ? topMenu.classList.remove(\'top_menu_open_active\') : null;\n      topMenuOverlay.classList.contains(\'top_menu_overlay_open\') ? topMenuOverlay.classList.remove(\'top_menu_overlay_open\') : null;\n    }\n  }, {\n    key: "getSettings",\n    value: function getSettings() {\n      var _this4 = this;\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", {\n        className: this.state.settings.hiddenClass\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("label", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("input", {\n        defaultChecked: this.state.showTranslate,\n        type: "checkbox",\n        onChange: function onChange(e) {\n          _this4.setState(function (prevState) {\n            return {\n              showTranslate: !prevState.showTranslate\n            };\n          });\n          _this4.destroySlider(\'START\');\n        }\n      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null, "\\u041F\\u043E\\u043A\\u0430\\u0437\\u044B\\u0432\\u0430\\u0442\\u044C \\u043F\\u0435\\u0440\\u0435\\u0432\\u043E\\u0434"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", {\n        className: "range-field ".concat(this.state.settings.hiddenClass)\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null, "\\u0421\\u043A\\u043E\\u0440\\u043E\\u0441\\u0442\\u044C \\u043F\\u0435\\u0440\\u0435\\u043A\\u043B\\u044E\\u0447\\u0435\\u043D\\u0438\\u044F (", this.state.defaultSpeed / 1000, " \\u0441\\u0435\\u043A.)"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("input", {\n        type: "range",\n        onChange: function onChange(e) {\n          var df = e.currentTarget.value;\n          _this4.setState(function () {\n            return {\n              defaultSpeed: +df\n            };\n          });\n          _this4.destroySlider(\'START\');\n        },\n        defaultValue: this.state.defaultSpeed,\n        min: "200",\n        max: "2000"\n      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {\n        className: "lesson-fastwatch__range ".concat(this.state.settings.hiddenClass)\n      }, "\\u0414\\u0438\\u0430\\u043F\\u0430\\u0437\\u043E\\u043D \\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\\u0445 \\u0441\\u043B\\u043E\\u0432 (", this.state.defaultDiapazone ? this.state.defaultDiapazone[\'min\'] + \' - \' + this.state.defaultDiapazone[\'max\'] : \'\', ")", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {\n        id: "fast-watch-diapazon"\n      })));\n    }\n  }, {\n    key: "render",\n    value: function render() {\n      var _this5 = this;\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {\n        className: \'lesson-fastwatch \' + this.checkModalSettings()\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {\n        className: "container"\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "\\u0420\\u0435\\u0436\\u0438\\u043C \\u0443\\u0441\\u043A\\u043E\\u0440\\u0438\\u0442\\u0435\\u043B\\u044F"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {\n        className: "row"\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("form", {\n        action: "",\n        className: "col m6 s12"\n      }, this.getSettings(), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_global_components_layout_Button__WEBPACK_IMPORTED_MODULE_1__["default"], {\n        title: this.state.settings.btnTitle,\n        onChange: function onChange() {\n          if (_this5.state.settings.hiddenClass != \'\') {\n            _this5.setState(function () {\n              return {\n                settings: {\n                  hiddenClass: \'\',\n                  btnTitle: \'Скрыть настройки\'\n                }\n              };\n            });\n          } else {\n            _this5.setState(function () {\n              return {\n                settings: {\n                  hiddenClass: \'hide\',\n                  btnTitle: \'Показать настройки\'\n                }\n              };\n            });\n          }\n        }\n      })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {\n        className: "row lesson-fastwatch__slider"\n      }, this.state.words.length > 0 ? this.getActiveWord() : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "\\u0412\\u044B \\u043F\\u0435\\u0440\\u0432\\u044B\\u0439 \\u0440\\u0430\\u0437 \\u043D\\u0430 \\u043A\\u0443\\u0440\\u0441\\u0435. \\u0421\\u043B\\u043E\\u0432 \\u0434\\u043B\\u044F \\u0437\\u0430\\u043F\\u043E\\u043C\\u0438\\u043D\\u0430\\u043D\\u0438\\u044F \\u043D\\u0435\\u0442")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {\n        className: "lesson-fastwatch__close",\n        onClick: function onClick() {\n          _this5.destroyModal(\'CLOSE\');\n          _this5.destroySlider(\'STOP\');\n        }\n      }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("li", {\n        className: "lesson-fastwatch__btn"\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {\n        href: "#",\n        onClick: function onClick(e) {\n          e.preventDefault();\n          _this5.destroySlider(\'START\');\n          _this5.destroyModal(\'OPEN\');\n        }\n      }, "\\u0423\\u0441\\u043A\\u043E\\u0440\\u0438\\u0442\\u0435\\u043B\\u044C")));\n    }\n  }]);\n  return LessonFastWatch;\n}(react__WEBPACK_IMPORTED_MODULE_0__.Component);\n\n\n//# sourceURL=webpack://client/./src/users/pages/SingleCourse/components/LessonFastWatch.js?')}},(function(e){e.h=()=>"5ee584ef6de5cd88126c"}));