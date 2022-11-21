/*! For license information please see admin.b31b84eb8e26105ac2e7.hot-update.js.LICENSE.txt */
"use strict";self.webpackHotUpdateclient("admin",{"./src/users/components/Routes.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{eval('__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "Authorization": () => (/* binding */ Authorization),\n/* harmony export */   "Contacts": () => (/* binding */ Contacts),\n/* harmony export */   "Courses": () => (/* binding */ Courses),\n/* harmony export */   "Index": () => (/* binding */ Index),\n/* harmony export */   "LandingCourse": () => (/* binding */ LandingCourse),\n/* harmony export */   "Logout": () => (/* binding */ Logout),\n/* harmony export */   "PasswordReset": () => (/* binding */ PasswordReset),\n/* harmony export */   "Prices": () => (/* binding */ Prices),\n/* harmony export */   "Register": () => (/* binding */ Register),\n/* harmony export */   "SingleCourse": () => (/* binding */ SingleCourse)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");\n/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../functions */ "./src/functions.js");\n/* harmony import */ var _Routes_route_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Routes/route-actions */ "./src/users/components/Routes/route-actions.js");\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");\n\n\n\n\nfunction Index() {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Routes_route_actions__WEBPACK_IMPORTED_MODULE_2__.IndexAction, null);\n}\nfunction Register() {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Routes_route_actions__WEBPACK_IMPORTED_MODULE_2__.RegisterAction, null);\n}\nfunction Courses() {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Routes_route_actions__WEBPACK_IMPORTED_MODULE_2__.CoursesAction, null);\n}\nfunction Contacts() {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Routes_route_actions__WEBPACK_IMPORTED_MODULE_2__.ContactsAction, null);\n}\nfunction Prices() {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Routes_route_actions__WEBPACK_IMPORTED_MODULE_2__.PricesAction, null);\n}\nfunction Authorization() {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Routes_route_actions__WEBPACK_IMPORTED_MODULE_2__.AuthorizationAction, null);\n}\nfunction Logout() {\n  return (0,_functions__WEBPACK_IMPORTED_MODULE_1__.$doUser)(\'EXIT\', \'/auth\');\n}\nfunction SingleCourse(_ref) {\n  var match = _ref.match;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Routes_route_actions__WEBPACK_IMPORTED_MODULE_2__.SingleCourseAction, {\n    head_id: match.params.head_id,\n    url: match.params.url\n  });\n}\nfunction LandingCourse(_ref2) {\n  var match = _ref2.match;\n  var params = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_3__.useParams)();\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Routes_route_actions__WEBPACK_IMPORTED_MODULE_2__.LandingCourseAction, {\n    id: params.id\n  });\n}\nfunction PasswordReset(_ref3) {\n  var match = _ref3.match;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Routes_route_actions__WEBPACK_IMPORTED_MODULE_2__.PasswordResetAction, {\n    param: match.params.param,\n    data: match.params.data\n  });\n}\n\n//# sourceURL=webpack://client/./src/users/components/Routes.js?')}},(function(_){_.h=()=>"0f3c86a165e2e6068f82"}));