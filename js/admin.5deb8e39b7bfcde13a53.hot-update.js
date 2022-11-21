/*! For license information please see admin.5deb8e39b7bfcde13a53.hot-update.js.LICENSE.txt */
"use strict";self.webpackHotUpdateclient("admin",{"./src/users/pages/SingleCourse/components/LessonWords.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{eval('__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "default": () => (/* binding */ LessonWords)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");\n\nfunction LessonWords(props) {\n  function changeStudyHeading(studyNumber) {\n    switch (studyNumber) {\n      case 1:\n        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {\n          className: "Tsds-english_study_heading"\n        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "\\u0443\\u043A", props.textTranslateWord));\n      case 2:\n        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {\n          className: "Tsds-english_study_heading"\n        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {\n          className: "Tsds-english_study_img",\n          onClick: function onClick() {\n            return props.playSound();\n          }\n        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("img", {\n          src: "/img/icons/icon_input_phrase.svg"\n        })));\n      case 3:\n        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {\n          className: "Tsds-english_study_heading"\n        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {\n          className: "Tsds-english_study_img",\n          onClick: function onClick() {\n            return props.playSound(null, true);\n          }\n        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("img", {\n          src: "/img/icons/icon_input_phrase.svg"\n        })));\n      default:\n        return \'\';\n    }\n  }\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {\n    className: "Tsds-english__lesson__words study--".concat(props.studyType)\n  }, changeStudyHeading(props.studyType), props.children);\n}\n\n//# sourceURL=webpack://client/./src/users/pages/SingleCourse/components/LessonWords.js?')}},(function(_){_.h=()=>"094c72bccfe9403a5e99"}));