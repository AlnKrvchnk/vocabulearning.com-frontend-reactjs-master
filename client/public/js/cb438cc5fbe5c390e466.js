function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import RoutesList from '../../routes/config';
import SidebarItem from './sidebar-item';
import SidebarAccordion from "./SidebarAccordion/SidebarAccordion";
import AuthChecker from '../../../users/components/AuthChecker/AuthChecker';
import M from 'materialize-css';
import { closeSidebar, openSidebar } from "../../../functions";
var SidebarConfig = {
  // cls: 'Tsds__sidebar',
  cls: 'sidebar',
  material_icon: 'public',

  get itemClass() {
    return "".concat(this.cls, "__item sidebar-item");
  },

  get activeClass() {
    return "".concat(this.cls, "--active");
  }

};

var Sidebar =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Sidebar, _React$Component);

  function Sidebar(props) {
    var _this;

    _classCallCheck(this, Sidebar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Sidebar).call(this, props));
    _this.state = {
      activeClass: '',
      statisticRoutes: [],
      editRoutes: [],
      helpRoutes: []
    };
    _this.toggleActiveClass = _this.toggleActiveClass.bind(_assertThisInitialized(_this));
    _this.returnStatisticRoutes = _this.returnStatisticRoutes.bind(_assertThisInitialized(_this));
    _this.returnEditRoutes = _this.returnEditRoutes.bind(_assertThisInitialized(_this));
    _this.returnHelpRoutes = _this.returnHelpRoutes.bind(_assertThisInitialized(_this));
    _this.toggleSidebarNavigation = _this.toggleSidebarNavigation.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Sidebar, [{
    key: "toggleActiveClass",
    value: function toggleActiveClass() {
      if (!this.state.activeClass) {
        this.setState(function () {
          return {
            activeClass: SidebarConfig.activeClass
          };
        });
      } else {
        this.setState(function () {
          return {
            activeClass: ''
          };
        });
      }

      this.updateSelects();
    } // TODO - проверка на админа

  }, {
    key: "returnStatisticRoutes",
    value: function returnStatisticRoutes(routes) {
      var _this2 = this;

      for (var i = 0; i < routes.length; i++) {
        if (routes[i].category === 'statistic') {
          (function () {
            var route = routes[i];

            _this2.setState(function (prevState) {
              return {
                statisticRoutes: [].concat(_toConsumableArray(prevState.statisticRoutes), [route])
              };
            });
          })();
        }
      }
    }
  }, {
    key: "returnEditRoutes",
    value: function returnEditRoutes(routes) {
      var _this3 = this;

      for (var i = 0; i < routes.length; i++) {
        if (routes[i].category === 'editcourse') {
          (function () {
            var route = routes[i];

            _this3.setState(function (prevState) {
              return {
                editRoutes: [].concat(_toConsumableArray(prevState.editRoutes), [route])
              };
            });
          })();
        }
      }
    }
  }, {
    key: "returnHelpRoutes",
    value: function returnHelpRoutes(routes) {
      var _this4 = this;

      for (var i = 0; i < routes.length; i++) {
        if (routes[i].category === 'help') {
          (function () {
            var route = routes[i];

            _this4.setState(function (prevState) {
              return {
                helpRoutes: [].concat(_toConsumableArray(prevState.helpRoutes), [route])
              };
            });
          })();
        }
      }
    }
  }, {
    key: "updateSelects",
    value: function updateSelects() {
      setTimeout(function () {
        M.FormSelect.init(document.querySelectorAll('select'));
        window.modals = {};
        var modals = M.Modal.init(document.querySelectorAll('.modal'));
        modals.forEach(function (modal) {
          window.modals[modal.id] = modal;
        });
      });
    }
  }, {
    key: "toggleSidebarNavigation",
    value: function toggleSidebarNavigation(e) {
      var sidebar = document.querySelector('.sidebar');
      closeSidebar();
    }
  }, {
    key: "checkCourseRoute",
    value: function checkCourseRoute() {
      console.log("Location", location);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.returnStatisticRoutes(RoutesList);
      this.returnEditRoutes(RoutesList);
      this.returnHelpRoutes(RoutesList);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("aside", {
        className: "".concat(SidebarConfig.cls, " ").concat(this.state.activeClass)
      }, React.createElement("nav", {
        className: "navigation"
      }, React.createElement(AuthChecker, {
        token: this.props.token,
        isAdmin: true
      }), React.createElement("div", {
        className: SidebarConfig.itemClass
      }, React.createElement("ul", null, React.createElement("li", null, React.createElement(Link, {
        to: "/admin"
      }, React.createElement("span", {
        className: "nav-icon"
      }, React.createElement("img", {
        src: "/img/icons/icon-dashboard.svg",
        className: "sidebar_icon_img",
        alt: ""
      })), React.createElement("span", null, "\u0413\u043B\u0430\u0432\u043D\u0430\u044F"))), React.createElement("li", null, React.createElement("a", {
        href: "https://vocabulearning.com/"
      }, React.createElement("span", {
        className: "nav-icon"
      }, React.createElement("img", {
        src: "/img/icons/icon-deshacer.svg",
        className: "sidebar_icon_img"
      })), React.createElement("span", null, "\u041D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 \u043A\u0443\u0440\u0441\u043E\u0432"))), React.createElement("li", null, React.createElement(Link, {
        to: "/"
      }, React.createElement("span", {
        className: "nav-icon material-icons"
      }, "chat"), React.createElement("span", null, "\u0427\u0430\u0442 \u0441 \u0443\u0447\u0435\u043D\u0438\u043A\u0430\u043C\u0438"))), React.createElement("li", null, React.createElement(Link, {
        to: '#modal-create-module',
        className: 'modal-trigger fingman_color_item'
      }, React.createElement("span", {
        className: 'nav-icon material-icons'
      }, "add"), "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u0443\u0440\u0441")))), React.createElement(SidebarAccordion, {
        routes: this.state.statisticRoutes,
        main_title: 'Статистика',
        subItem: 'accordion_subitem_1',
        tabs: false
      }), React.createElement(SidebarAccordion, {
        routes: this.state.editRoutes,
        main_title: 'Редактирование курса',
        subItem: 'accordion_subitem_2',
        tabs: true
      }), React.createElement(SidebarAccordion, {
        routes: this.state.helpRoutes,
        main_title: 'Помощь',
        subItem: 'accordion_subitem_3',
        tabs: true
      })), React.createElement("div", {
        className: "sidebarToggler"
      }, React.createElement("a", {
        className: "sidebar__toggleArrow",
        href: "",
        onClick: function onClick(e) {
          e.preventDefault();
          var sidebar = document.querySelector(".sidebar");

          if (sidebar.classList.contains("sidebar_w100")) {
            console.log("Opening...");
            openSidebar();
          } else {
            console.log("Closing...");
            closeSidebar();
          }
        }
      }, React.createElement("i", {
        className: "material-icons"
      }, "chevron_left"))));
    }
  }]);

  return Sidebar;
}(React.Component);

export { Sidebar as default };