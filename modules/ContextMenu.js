'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _globalEventListener = require('./globalEventListener');

var _globalEventListener2 = _interopRequireDefault(_globalEventListener);

var _actions = require('./actions');

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ContextMenu = function (_Component) {
    _inherits(ContextMenu, _Component);

    function ContextMenu(props) {
        _classCallCheck(this, ContextMenu);

        var _this = _possibleConstructorReturn(this, (ContextMenu.__proto__ || Object.getPrototypeOf(ContextMenu)).call(this, props));

        _this.registerHandlers = function () {
            // eslint-disable-line react/sort-comp
            document.addEventListener('mousedown', _this.handleOutsideClick);
            document.addEventListener('ontouchstart', _this.handleOutsideClick);
            document.addEventListener('scroll', _this.handleHide);
            document.addEventListener('contextmenu', _this.handleHide);
            document.addEventListener('keyup', _this.handleEscape);
            window.addEventListener('resize', _this.handleHide);
        };

        _this.unregisterHandlers = function () {
            document.removeEventListener('mousedown', _this.handleOutsideClick);
            document.removeEventListener('ontouchstart', _this.handleOutsideClick);
            document.removeEventListener('scroll', _this.handleHide);
            document.removeEventListener('contextmenu', _this.handleHide);
            document.removeEventListener('keyup', _this.handleEscape);
            window.removeEventListener('resize', _this.handleHide);
        };

        _this.handleShow = function (e) {
            if (e.detail.id !== _this.props.id || _this.state.isVisible) return;

            var _e$detail$position = e.detail.position,
                x = _e$detail$position.x,
                y = _e$detail$position.y;


            _this.setState({ isVisible: true, x: x, y: y });
            _this.registerHandlers();
            (0, _helpers.callIfExists)(_this.props.onShow, e);
        };

        _this.handleHide = function (e) {
            if (_this.state.isVisible && (!e.detail || !e.detail.id || e.detail.id === _this.props.id)) {
                _this.unregisterHandlers();
                _this.setState({ isVisible: false });
                (0, _helpers.callIfExists)(_this.props.onHide, e);
            }
        };

        _this.handleEscape = function (e) {
            if (e.keyCode === 27) {
                (0, _actions.hideMenu)();
            }
        };

        _this.handleOutsideClick = function (e) {
            if (!_this.menu.contains(e.target)) (0, _actions.hideMenu)();
        };

        _this.handleMouseLeave = function (event) {
            event.preventDefault();

            (0, _helpers.callIfExists)(_this.props.onMouseLeave, event, (0, _objectAssign2.default)({}, _this.props.data, _helpers.store.data), _helpers.store.target);

            if (_this.props.hideOnLeave) (0, _actions.hideMenu)();
        };

        _this.getMenuPosition = function () {
            var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var _window = window,
                innerWidth = _window.innerWidth,
                innerHeight = _window.innerHeight;

            var rect = _this.menu.getBoundingClientRect();
            var menuStyles = {
                top: y,
                left: x
            };

            if (y + rect.height > innerHeight) {
                menuStyles.top -= rect.height;
            }

            if (x + rect.width > innerWidth) {
                menuStyles.left -= rect.width;
            }

            if (menuStyles.top < 0) {
                menuStyles.top = rect.height < innerHeight ? (innerHeight - rect.height) / 2 : 0;
            }

            if (menuStyles.left < 0) {
                menuStyles.left = rect.width < innerWidth ? (innerWidth - rect.width) / 2 : 0;
            }

            return menuStyles;
        };

        _this.menuRef = function (c) {
            _this.menu = c;
        };

        _this.state = {
            x: 0,
            y: 0,
            isVisible: false
        };
        return _this;
    }

    _createClass(ContextMenu, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.listenId = _globalEventListener2.default.register(this.handleShow, this.handleHide);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            var _this2 = this;

            if (this.state.isVisible) {
                var wrapper = window.requestAnimationFrame || setTimeout;

                wrapper(function () {
                    var _state = _this2.state,
                        x = _state.x,
                        y = _state.y;

                    var _getMenuPosition = _this2.getMenuPosition(x, y),
                        top = _getMenuPosition.top,
                        left = _getMenuPosition.left;

                    wrapper(function () {
                        _this2.menu.style.top = top + 'px';
                        _this2.menu.style.left = left + 'px';
                        _this2.menu.style.opacity = 1;
                        _this2.menu.style.pointerEvents = 'auto';
                    });
                });
            } else {
                this.menu.style.opacity = 0;
                this.menu.style.pointerEvents = 'none';
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.listenId) {
                _globalEventListener2.default.unregister(this.listenId);
            }

            this.unregisterHandlers();
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                children = _props.children,
                className = _props.className;
            var isVisible = this.state.isVisible;

            var style = { position: 'fixed', opacity: 0, pointerEvents: 'none' };
            var menuClassnames = (0, _classnames2.default)(_helpers.cssClasses.menu, className, _defineProperty({}, _helpers.cssClasses.menuVisible, isVisible));

            return _react2.default.createElement(
                'nav',
                {
                    role: 'menu', tabIndex: '-1', ref: this.menuRef, style: style, className: menuClassnames,
                    onContextMenu: this.handleHide, onMouseLeave: this.handleMouseLeave },
                children
            );
        }
    }]);

    return ContextMenu;
}(_react.Component);

ContextMenu.propTypes = {
    id: _propTypes2.default.string.isRequired,
    children: _propTypes2.default.node.isRequired,
    data: _propTypes2.default.object,
    className: _propTypes2.default.string,
    hideOnLeave: _propTypes2.default.bool,
    onHide: _propTypes2.default.func,
    onMouseLeave: _propTypes2.default.func,
    onShow: _propTypes2.default.func
};
ContextMenu.defaultProps = {
    className: '',
    data: {},
    hideOnLeave: false,
    onHide: function onHide() {
        return null;
    },
    onMouseLeave: function onMouseLeave() {
        return null;
    },
    onShow: function onShow() {
        return null;
    }
};
exports.default = ContextMenu;