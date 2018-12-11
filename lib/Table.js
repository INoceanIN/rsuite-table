'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _flatten2 = require('lodash/flatten');

var _flatten3 = _interopRequireDefault(_flatten2);

var _merge2 = require('lodash/merge');

var _merge3 = _interopRequireDefault(_merge2);

var _pick2 = require('lodash/pick');

var _pick3 = _interopRequireDefault(_pick2);

var _isUndefined2 = require('lodash/isUndefined');

var _isUndefined3 = _interopRequireDefault(_isUndefined2);

var _isEqual2 = require('lodash/isEqual');

var _isEqual3 = _interopRequireDefault(_isEqual2);

var _eq2 = require('lodash/eq');

var _eq3 = _interopRequireDefault(_eq2);

var _debounce2 = require('lodash/debounce');

var _debounce3 = _interopRequireDefault(_debounce2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _elementResizeEvent = require('element-resize-event');

var _elementResizeEvent2 = _interopRequireDefault(_elementResizeEvent);

var _domLib = require('dom-lib');

var _Row = require('./Row');

var _Row2 = _interopRequireDefault(_Row);

var _CellGroup = require('./CellGroup');

var _CellGroup2 = _interopRequireDefault(_CellGroup);

var _Scrollbar = require('./Scrollbar');

var _Scrollbar2 = _interopRequireDefault(_Scrollbar);

var _utils = require('./utils');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var ReactChildren = React.Children;
var CELL_PADDING_HEIGHT = 26;
var columnHandledProps = ['align', 'width', 'fixed', 'resizable', 'flexGrow', 'minWidth', 'colSpan'];

function findRowKeys(rows, rowKey, expanded) {
  var keys = [];
  rows.forEach(function (item) {
    if (item.children) {
      keys.push(item[rowKey]);
      keys = [].concat(_toConsumableArray(keys), _toConsumableArray(findRowKeys(item.children, rowKey)));
    } else if (expanded) {
      keys.push(item[rowKey]);
    }
  });
  return keys;
}

var Table = function (_React$Component) {
  _inherits(Table, _React$Component);

  function Table(props) {
    _classCallCheck(this, Table);

    var _this = _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).call(this, props));

    _initialiseProps.call(_this);

    var width = props.width,
        data = props.data,
        rowKey = props.rowKey,
        defaultExpandAllRows = props.defaultExpandAllRows,
        renderRowExpanded = props.renderRowExpanded,
        defaultExpandedRowKeys = props.defaultExpandedRowKeys,
        _props$children = props.children,
        children = _props$children === undefined ? [] : _props$children,
        isTree = props.isTree;

    var expandedRowKeys = defaultExpandAllRows ? findRowKeys(data, rowKey, (0, _isFunction3.default)(renderRowExpanded)) : defaultExpandedRowKeys || [];

    var shouldFixedColumn = Array.from(children).some(function (child) {
      return (0, _get3.default)(child, 'props.fixed');
    });

    if (isTree && !rowKey) {
      throw new Error('The `rowKey` is required when set isTree');
    }
    _this.state = {
      expandedRowKeys: expandedRowKeys,
      shouldFixedColumn: shouldFixedColumn,
      width: width || 0,
      columnWidth: 0,
      dataKey: 0,
      contentHeight: 0,
      contentWidth: 0,
      tableRowsMaxHeight: []
    };

    _this.scrollY = 0;
    _this.scrollX = 0;
    _this.wheelHandler = new _domLib.WheelHandler(function (deltaX, deltaY) {
      _this.handleWheel(deltaX, deltaY);
      _this.scrollbarX.onWheelScroll(deltaX);
      _this.scrollbarY.onWheelScroll(deltaY);
    }, _this.shouldHandleWheelX, _this.shouldHandleWheelY);
    return _this;
  }

  _createClass(Table, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.calculateTableWidth();
      this.calculateTableContextHeight();
      this.calculateRowMaxHeight();
      (0, _elementResizeEvent2.default)(this.table, (0, _debounce3.default)(this.calculateTableWidth, 400));
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(0, _eq3.default)(this.props, nextProps) || !(0, _isEqual3.default)(this.state, nextState);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      this.calculateTableContextHeight();
      this.calculateTableContentWidth(prevProps);
      this.calculateRowMaxHeight();
      this.updatePosition();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.table) {
        (0, _elementResizeEvent.unbind)(this.table);
      }
    }
  }, {
    key: 'getExpandedRowKeys',
    value: function getExpandedRowKeys() {
      var expandedRowKeys = this.props.expandedRowKeys;

      return (0, _isUndefined3.default)(expandedRowKeys) ? this.state.expandedRowKeys : expandedRowKeys;
    }
  }, {
    key: 'getScrollCellGroups',
    value: function getScrollCellGroups() {
      return this.table.querySelectorAll('.' + this.addPrefix('cell-group-scroll'));
    }
  }, {
    key: 'getFixedCellGroups',
    value: function getFixedCellGroups() {
      return this.table.querySelectorAll('.' + this.addPrefix('cell-group-fixed'));
    }

    /**
     * 获取表头高度
     */

  }, {
    key: 'getTableHeaderHeight',
    value: function getTableHeaderHeight() {
      var _props = this.props,
          headerHeight = _props.headerHeight,
          showHeader = _props.showHeader;

      return showHeader ? headerHeight : 0;
    }

    /**
     * 获取 Table 需要渲染的高度
     */

  }, {
    key: 'getTableHeight',
    value: function getTableHeight() {
      var contentHeight = this.state.contentHeight;
      var _props2 = this.props,
          minHeight = _props2.minHeight,
          height = _props2.height,
          autoHeight = _props2.autoHeight;

      var headerHeight = this.getTableHeaderHeight();
      return autoHeight ? Math.max(headerHeight + contentHeight, minHeight) : height;
    }
  }, {
    key: 'getCells',
    value: function getCells() {
      var _this2 = this;

      var left = 0; // Cell left margin
      var headerCells = []; // Table header cell
      var bodyCells = []; // Table body cell
      var columns = this.props.children;

      if (!columns) {
        return {
          headerCells: headerCells,
          bodyCells: bodyCells,
          allColumnsWidth: left
        };
      }

      var tableWidth = this.state.width;
      var _props3 = this.props,
          sortColumn = _props3.sortColumn,
          sortType = _props3.sortType,
          defaultSortType = _props3.defaultSortType,
          onSortColumn = _props3.onSortColumn,
          rowHeight = _props3.rowHeight,
          showHeader = _props3.showHeader;

      var headerHeight = this.getTableHeaderHeight();

      var _getTotalByColumns = (0, _utils.getTotalByColumns)(columns),
          totalFlexGrow = _getTotalByColumns.totalFlexGrow,
          totalWidth = _getTotalByColumns.totalWidth;

      ReactChildren.forEach(columns, function (column, index) {
        if (React.isValidElement(column)) {
          var columnChildren = column.props.children;
          var _column$props = column.props,
              _width = _column$props.width,
              resizable = _column$props.resizable,
              flexGrow = _column$props.flexGrow,
              minWidth = _column$props.minWidth,
              onResize = _column$props.onResize;


          if (resizable && flexGrow) {
            console.warn('Cannot set \'resizable\' and \'flexGrow\' together in <Column>, column index: ' + index);
          }

          if (columnChildren.length !== 2) {
            throw new Error('Component <HeaderCell> and <Cell> is required, column index: ' + index + ' ');
          }

          var nextWidth = _this2.state[columnChildren[1].props.dataKey + '_' + index + '_width'] || _width || 0;

          if (tableWidth && flexGrow && totalFlexGrow) {
            nextWidth = Math.max((tableWidth - totalWidth) / totalFlexGrow * flexGrow, minWidth || 60);
          }

          var cellProps = _extends({}, (0, _pick3.default)(column.props, columnHandledProps), {
            left: left,
            index: index,
            headerHeight: headerHeight,
            key: index,
            width: nextWidth,
            height: rowHeight,
            firstColumn: index === 0,
            lastColumn: index === columns.length - 1
          });

          if (showHeader && headerHeight) {
            var headerCellProps = {
              dataKey: columnChildren[1].props.dataKey,
              isHeaderCell: true,
              sortable: column.props.sortable,
              sortColumn: sortColumn,
              sortType: sortType,
              defaultSortType: defaultSortType,
              onSortColumn: onSortColumn,
              flexGrow: flexGrow
            };

            if (resizable) {
              (0, _merge3.default)(headerCellProps, {
                onResize: onResize,
                onColumnResizeEnd: _this2.handleColumnResizeEnd,
                onColumnResizeStart: _this2.handleColumnResizeStart,
                onColumnResizeMove: _this2.handleColumnResizeMove
              });
            }

            headerCells.push(React.cloneElement(columnChildren[0], _extends({}, cellProps, headerCellProps)));
          }

          bodyCells.push(React.cloneElement(columnChildren[1], cellProps));

          left += nextWidth;
        }
      });

      return {
        headerCells: headerCells,
        bodyCells: bodyCells,
        allColumnsWidth: left
      };
    }

    // 处理移动端 Touch 事件,  Start 的时候初始化 x,y


    // 处理移动端 Touch 事件, Move 的时候初始化，更新 scroll

  }, {
    key: 'updatePosition',
    value: function updatePosition() {
      /**
       * 当存在锁定列情况处理
       */
      if (this.state.shouldFixedColumn) {
        this.updatePositionByFixedCell();
      } else {
        var wheelStyle = {};
        var headerStyle = {};
        (0, _domLib.translateDOMPositionXY)(wheelStyle, this.scrollX, this.scrollY);
        (0, _domLib.translateDOMPositionXY)(headerStyle, this.scrollX, 0);

        this.wheelWrapper && (0, _domLib.addStyle)(this.wheelWrapper, wheelStyle);
        this.headerWrapper && (0, _domLib.addStyle)(this.headerWrapper, headerStyle);
      }
      if (this.tableHeader) {
        (0, _utils.toggleClass)(this.tableHeader, this.addPrefix('cell-group-shadow'), this.scrollY < 0);
      }
    }
  }, {
    key: 'updatePositionByFixedCell',
    value: function updatePositionByFixedCell() {
      var wheelGroupStyle = {};
      var wheelStyle = {};
      var scrollGroups = this.getScrollCellGroups();
      var fixedGroups = this.getFixedCellGroups();

      (0, _domLib.translateDOMPositionXY)(wheelGroupStyle, this.scrollX, 0);
      (0, _domLib.translateDOMPositionXY)(wheelStyle, 0, this.scrollY);

      Array.from(scrollGroups).forEach(function (group) {
        (0, _domLib.addStyle)(group, wheelGroupStyle);
      });
      if (this.wheelWrapper) {
        (0, _domLib.addStyle)(this.wheelWrapper, wheelStyle);
      }

      var shadowClassName = this.addPrefix('cell-group-shadow');
      var condition = this.scrollX < 0;

      Array.from(fixedGroups).forEach(function (group) {
        (0, _utils.toggleClass)(group, shadowClassName, condition);
      });
    }
  }, {
    key: 'calculateRowMaxHeight',
    value: function calculateRowMaxHeight() {
      var _this3 = this;

      var wordWrap = this.props.wordWrap;

      if (wordWrap) {
        var _tableRowsMaxHeight = [];
        this.tableRows.forEach(function (row) {
          var cells = row.querySelectorAll('.' + _this3.addPrefix('cell-wrap')) || [];
          var maxHeight = 0;
          Array.from(cells).forEach(function (cell) {
            var h = (0, _domLib.getHeight)(cell);
            maxHeight = Math.max(maxHeight, h);
          });
          _tableRowsMaxHeight.push(maxHeight);
        });
        this.setState({ tableRowsMaxHeight: _tableRowsMaxHeight });
      }
    }
  }, {
    key: 'calculateTableContentWidth',
    value: function calculateTableContentWidth(prevProps) {
      var table = this.table;
      var row = table.querySelector('.' + this.addPrefix('row'));
      var contentWidth = row ? (0, _domLib.getWidth)(row) : 0;

      this.setState({ contentWidth: contentWidth });
      // 这里 -10 是为了让滚动条不挡住内容部分
      this.minScrollX = -(contentWidth - this.state.width) - 10;

      /**
       * 1.判断 Table 内容区域是否宽度有变化
       * 2.判断 Table 列数是否发生变化
       *
       * 满足 1 和 2 则更新横向滚动条位置
       */
      if (this.state.contentWidth !== contentWidth && (0, _flatten3.default)(this.props.children).length !== (0, _flatten3.default)(prevProps.children).length) {
        this.scrollX = 0;
        this.scrollbarX && this.scrollbarX.resetScrollBarPosition();
      }
    }
  }, {
    key: 'calculateTableContextHeight',
    value: function calculateTableContextHeight() {
      var table = this.table;
      var rows = table.querySelectorAll('.' + this.addPrefix('row')) || [];
      var _props4 = this.props,
          height = _props4.height,
          autoHeight = _props4.autoHeight,
          rowHeight = _props4.rowHeight;

      var headerHeight = this.getTableHeaderHeight();
      var contentHeight = rows.length ? Array.from(rows).map(function (row) {
        return (0, _domLib.getHeight)(row) || rowHeight;
      }).reduce(function (x, y) {
        return x + y;
      }) : 0;

      var nextContentHeight = contentHeight - headerHeight;
      this.setState({
        contentHeight: nextContentHeight
      });

      if (!autoHeight) {
        // 这里 -10 是为了让滚动条不挡住内容部分
        this.minScrollY = -(contentHeight - height) - 10;
      }

      /**
       * 当 content height 更新后，更新纵向滚动条
       */
      if (this.state.contentHeight !== nextContentHeight) {
        this.scrollY = 0;
        this.scrollbarY && this.scrollbarY.resetScrollBarPosition();
      }
    }
  }, {
    key: 'shouldRenderExpandedRow',
    value: function shouldRenderExpandedRow(rowData) {
      var _props5 = this.props,
          rowKey = _props5.rowKey,
          renderRowExpanded = _props5.renderRowExpanded,
          isTree = _props5.isTree;

      var expandedRowKeys = this.getExpandedRowKeys() || [];
      return expandedRowKeys.some(function (key) {
        return key === rowData[rowKey];
      }) && (0, _isFunction3.default)(renderRowExpanded) && !isTree;
    }
  }, {
    key: 'renderRowData',
    value: function renderRowData(bodyCells, rowData, props, shouldRenderExpandedRow) {
      var _this4 = this;

      var _props6 = this.props,
          onRowClick = _props6.onRowClick,
          renderTreeToggle = _props6.renderTreeToggle,
          rowKey = _props6.rowKey,
          wordWrap = _props6.wordWrap,
          isTree = _props6.isTree;

      var hasChildren = isTree && rowData.children && Array.isArray(rowData.children);
      var nextRowKey = rowData[rowKey] || '_' + (Math.random() * 1e18).toString(36).slice(0, 5).toUpperCase() + '_' + props.index;

      var rowProps = {
        rowRef: this.bindTableRowsRef(props.index),
        key: props.index,
        width: props.rowWidth,
        height: props.rowHeight,
        top: props.top,
        onClick: function onClick() {
          onRowClick && onRowClick(rowData);
        }
      };

      var cells = bodyCells.map(function (cell) {
        return React.cloneElement(cell, {
          hasChildren: hasChildren,
          layer: props.layer,
          height: props.rowHeight,
          rowIndex: props.index,
          renderTreeToggle: renderTreeToggle,
          onTreeToggle: _this4.handleTreeToggle,
          rowKey: nextRowKey,
          rowData: rowData,
          wordWrap: wordWrap
        });
      });

      var row = this.renderRow(rowProps, cells, shouldRenderExpandedRow, rowData);

      // insert children
      if (hasChildren) {
        props.layer += 1;

        var _expandedRowKeys = this.getExpandedRowKeys() || [];
        var open = _expandedRowKeys.some(function (key) {
          return key === rowData[rowKey];
        });

        var childrenClasses = (0, _classnames2.default)(this.addPrefix('row-has-children'), _defineProperty({}, this.addPrefix('row-open'), open));

        return React.createElement(
          'div',
          { className: childrenClasses, key: props.index, 'data-layer': props.layer },
          row,
          React.createElement(
            'div',
            { className: this.addPrefix('row-children') },
            rowData.children.map(function (child, index) {
              return _this4.renderRowData(bodyCells, child, _extends({}, props, {
                index: index
              }));
            })
          )
        );
      }

      return row;
    }
  }, {
    key: 'renderRow',
    value: function renderRow(props, cells, shouldRenderExpandedRow, rowData) {
      var rowClassName = this.props.rowClassName;
      var shouldFixedColumn = this.state.shouldFixedColumn;


      if ((0, _isFunction3.default)(rowClassName)) {
        props.className = rowClassName(rowData);
      } else {
        props.className = rowClassName;
      }

      // IF there are fixed columns, add a fixed group
      if (shouldFixedColumn) {
        var fixedCells = cells.filter(function (cell) {
          return cell.props.fixed;
        });
        var otherCells = cells.filter(function (cell) {
          return !cell.props.fixed;
        });
        var fixedCellGroupWidth = 0;

        for (var i = 0; i < fixedCells.length; i += 1) {
          fixedCellGroupWidth += fixedCells[i].props.width;
        }

        return React.createElement(
          _Row2.default,
          props,
          React.createElement(
            _CellGroup2.default,
            {
              fixed: true,
              height: props.isHeaderRow ? props.headerHeight : props.height,
              width: fixedCellGroupWidth
            },
            (0, _utils.colSpanCells)(fixedCells)
          ),
          React.createElement(
            _CellGroup2.default,
            null,
            (0, _utils.colSpanCells)(otherCells)
          ),
          shouldRenderExpandedRow && this.renderRowExpanded(rowData)
        );
      }

      return React.createElement(
        _Row2.default,
        props,
        React.createElement(
          _CellGroup2.default,
          null,
          (0, _utils.colSpanCells)(cells)
        ),
        shouldRenderExpandedRow && this.renderRowExpanded(rowData)
      );
    }
  }, {
    key: 'renderRowExpanded',
    value: function renderRowExpanded(rowData) {
      var _props7 = this.props,
          renderRowExpanded = _props7.renderRowExpanded,
          rowExpandedHeight = _props7.rowExpandedHeight;

      var styles = {
        height: 200
      };

      if (typeof renderRowExpanded === 'function') {
        return React.createElement(
          'div',
          { className: this.addPrefix('row-expanded'), style: styles },
          renderRowExpanded(rowData)
        );
      }

      return null;
    }
  }, {
    key: 'renderMouseArea',
    value: function renderMouseArea() {
      var headerHeight = this.getTableHeaderHeight();
      var styles = { height: this.getTableHeight() };

      return React.createElement(
        'div',
        { ref: this.bindMouseAreaRef, className: this.addPrefix('mouse-area'), style: styles },
        React.createElement('span', {
          style: {
            height: headerHeight - 1
          }
        })
      );
    }
  }, {
    key: 'renderTableHeader',
    value: function renderTableHeader(headerCells, rowWidth) {
      var rowHeight = this.props.rowHeight;

      var headerHeight = this.getTableHeaderHeight();
      var rowProps = {
        rowRef: this.bindTableHeaderRef,
        width: rowWidth,
        height: rowHeight,
        headerHeight: headerHeight,
        isHeaderRow: true,
        top: 0
      };

      return React.createElement(
        'div',
        { className: this.addPrefix('header-row-wrapper'), ref: this.bindHeaderWrapperRef },
        this.renderRow(rowProps, headerCells)
      );
    }
  }, {
    key: 'renderTableBody',
    value: function renderTableBody(bodyCells, rowWidth) {
      var _this5 = this;

      var _props8 = this.props,
          rowHeight = _props8.rowHeight,
          rowExpandedHeight = _props8.rowExpandedHeight,
          data = _props8.data,
          isTree = _props8.isTree,
          setRowHeight = _props8.setRowHeight;

      var headerHeight = this.getTableHeaderHeight();
      var tableRowsMaxHeight = this.state.tableRowsMaxHeight;

      var height = this.getTableHeight();
      var bodyStyles = {
        top: isTree ? 0 : headerHeight,
        height: height - headerHeight
      };

      var top = 0; // Row position
      var rows = null;
      var bodyHeight = 0;
      if (data && data.length > 0) {
        rows = data.map(function (rowData, index) {
          var maxHeight = tableRowsMaxHeight[index];
          var nextRowHeight = maxHeight ? maxHeight + CELL_PADDING_HEIGHT : rowHeight;
          var shouldRenderExpandedRow = _this5.shouldRenderExpandedRow(rowData);

          if (shouldRenderExpandedRow) {
            nextRowHeight += rowExpandedHeight;
          }

          /**
           * 自定义行高
           */
          if (setRowHeight) {
            nextRowHeight = setRowHeight(rowData) || rowHeight;
          }

          bodyHeight += nextRowHeight;

          var rowProps = {
            index: index,
            top: top,
            rowWidth: rowWidth,
            layer: 0,
            rowHeight: nextRowHeight
          };

          !isTree && (top += nextRowHeight);

          return _this5.renderRowData(bodyCells, rowData, rowProps, shouldRenderExpandedRow);
        });
      }

      var wheelStyles = {
        position: 'absolute',
        height: bodyHeight,
        minHeight: height
      };

      return React.createElement(
        'div',
        {
          ref: this.bindBodyRef,
          className: this.addPrefix('body-row-wrapper'),
          style: bodyStyles,
          onTouchStart: this.handleTouchStart,
          onTouchMove: this.handleTouchMove,
          onWheel: this.wheelHandler.onWheel
        },
        React.createElement(
          'div',
          {
            style: wheelStyles,
            className: this.addPrefix('body-wheel-area'),
            ref: this.bindWheelWrapperRef
          },
          rows
        ),
        this.renderInfo(rows === null),
        this.renderScrollbar(),
        this.renderLoading()
      );
    }
  }, {
    key: 'renderInfo',
    value: function renderInfo(shouldShow) {
      if (!shouldShow) {
        return null;
      }

      var locale = this.props.locale;

      return React.createElement(
        'div',
        { className: this.addPrefix('body-info') },
        locale.emptyMessage
      );
    }
  }, {
    key: 'renderScrollbar',
    value: function renderScrollbar() {
      var _props9 = this.props,
          disabledScroll = _props9.disabledScroll,
          loading = _props9.loading;

      var headerHeight = this.getTableHeaderHeight();
      var _state = this.state,
          contentWidth = _state.contentWidth,
          contentHeight = _state.contentHeight;

      var height = this.getTableHeight();

      if (disabledScroll) {
        return null;
      }

      return React.createElement(
        'div',
        null,
        React.createElement(_Scrollbar2.default, {
          length: this.state.width,
          onScroll: this.handleScrollX,
          scrollLength: contentWidth,
          ref: this.bindScrollbarXRef
        }),
        React.createElement(_Scrollbar2.default, {
          vertical: true,
          length: height - headerHeight,
          scrollLength: contentHeight,
          onScroll: this.handleScrollY,
          ref: this.bindScrollbarYRef
        })
      );
    }

    /**
     *  show loading
     */

  }, {
    key: 'renderLoading',
    value: function renderLoading() {
      var _props10 = this.props,
          locale = _props10.locale,
          loading = _props10.loading,
          loadAnimation = _props10.loadAnimation;


      if (!loadAnimation && !loading) {
        return null;
      }

      return React.createElement(
        'div',
        { className: this.addPrefix('loader-wrapper') },
        React.createElement(
          'div',
          { className: this.addPrefix('loader') },
          React.createElement('i', { className: this.addPrefix('loader-icon') }),
          React.createElement(
            'span',
            { className: this.addPrefix('loader-text') },
            locale.loading
          )
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _classNames2;

      var _props11 = this.props,
          children = _props11.children,
          className = _props11.className,
          _props11$width = _props11.width,
          width = _props11$width === undefined ? 0 : _props11$width,
          style = _props11.style,
          rowHeight = _props11.rowHeight,
          isTree = _props11.isTree,
          hover = _props11.hover,
          bordered = _props11.bordered,
          cellBordered = _props11.cellBordered,
          wordWrap = _props11.wordWrap,
          classPrefix = _props11.classPrefix,
          loading = _props11.loading,
          showHeader = _props11.showHeader,
          rest = _objectWithoutProperties(_props11, ['children', 'className', 'width', 'style', 'rowHeight', 'isTree', 'hover', 'bordered', 'cellBordered', 'wordWrap', 'classPrefix', 'loading', 'showHeader']);

      var isColumnResizing = this.state.isColumnResizing;

      var _getCells = this.getCells(),
          headerCells = _getCells.headerCells,
          bodyCells = _getCells.bodyCells,
          allColumnsWidth = _getCells.allColumnsWidth;

      var rowWidth = allColumnsWidth > width ? allColumnsWidth : width;
      var clesses = (0, _classnames2.default)(classPrefix, className, (_classNames2 = {}, _defineProperty(_classNames2, this.addPrefix('word-wrap'), wordWrap), _defineProperty(_classNames2, this.addPrefix('treetable'), isTree), _defineProperty(_classNames2, this.addPrefix('bordered'), bordered), _defineProperty(_classNames2, this.addPrefix('cell-bordered'), cellBordered), _defineProperty(_classNames2, this.addPrefix('column-resizing'), isColumnResizing), _defineProperty(_classNames2, this.addPrefix('hover'), hover), _defineProperty(_classNames2, this.addPrefix('loading'), loading), _classNames2));

      var styles = _extends({
        width: width || 'auto',
        height: this.getTableHeight()
      }, style);

      var unhandled = (0, _utils.getUnhandledProps)(Table, rest);

      return React.createElement(
        'div',
        _extends({}, unhandled, { className: clesses, style: styles, ref: this.bindTableRef }),
        showHeader && this.renderTableHeader(headerCells, rowWidth),
        children && this.renderTableBody(bodyCells, rowWidth),
        showHeader && this.renderMouseArea()
      );
    }
  }]);

  return Table;
}(React.Component);

Table.defaultProps = {
  classPrefix: (0, _utils.defaultClassPrefix)('table'),
  data: [],
  height: 200,
  rowHeight: 46,
  headerHeight: 40,
  minHeight: 0,
  rowExpandedHeight: 100,
  hover: true,
  showHeader: true,
  rowKey: 'key',
  locale: {
    emptyMessage: 'No data found',
    loading: 'Loading...'
  }
};
Table.handledProps = ['autoHeight', 'bodyRef', 'bordered', 'cellBordered', 'children', 'className', 'classPrefix', 'data', 'defaultExpandAllRows', 'defaultExpandedRowKeys', 'defaultSortType', 'disabledScroll', 'expandedRowKeys', 'headerHeight', 'height', 'hover', 'isTree', 'loadAnimation', 'loading', 'locale', 'minHeight', 'onExpandChange', 'onRowClick', 'onScroll', 'onSortColumn', 'onTouchMove', 'onTouchStart', 'renderRowExpanded', 'renderTreeToggle', 'rowClassName', 'rowExpandedHeight', 'rowHeight', 'rowKey', 'setRowHeight', 'showHeader', 'sortColumn', 'sortType', 'style', 'width', 'wordWrap'];
Table.propTypes = {
  width: _propTypes2.default.number,
  data: _propTypes2.default.arrayOf(_propTypes2.default.object).isRequired,
  height: _propTypes2.default.number.isRequired,
  autoHeight: _propTypes2.default.bool,
  minHeight: _propTypes2.default.number.isRequired,
  rowHeight: _propTypes2.default.number.isRequired,
  headerHeight: _propTypes2.default.number.isRequired,
  setRowHeight: _propTypes2.default.func,
  rowKey: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]).isRequired,
  isTree: _propTypes2.default.bool,
  defaultExpandAllRows: _propTypes2.default.bool,
  defaultExpandedRowKeys: _propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number])),
  expandedRowKeys: _propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number])),
  renderTreeToggle: _propTypes2.default.func,
  renderRowExpanded: _propTypes2.default.func,
  rowExpandedHeight: _propTypes2.default.number,
  locale: _propTypes2.default.object.isRequired,
  style: _propTypes2.default.object,
  sortColumn: _propTypes2.default.string,
  sortType: _propTypes2.default.oneOf(['desc', 'asc']),
  defaultSortType: _propTypes2.default.oneOf(['desc', 'asc']),
  disabledScroll: _propTypes2.default.bool,
  hover: _propTypes2.default.bool.isRequired,
  loading: _propTypes2.default.bool,
  className: _propTypes2.default.string,
  classPrefix: _propTypes2.default.string,
  children: function children() {
    return (typeof (React.ChildrenArray == null ? {} : React.ChildrenArray) === 'function' ? _propTypes2.default.instanceOf(React.ChildrenArray == null ? {} : React.ChildrenArray) : _propTypes2.default.any).apply(this, arguments);
  },
  bordered: _propTypes2.default.bool,
  cellBordered: _propTypes2.default.bool,
  wordWrap: _propTypes2.default.bool,
  onRowClick: _propTypes2.default.func,
  onScroll: _propTypes2.default.func,
  onSortColumn: _propTypes2.default.func,
  onExpandChange: _propTypes2.default.func,
  onTouchStart: _propTypes2.default.func,
  // for tests
  onTouchMove: _propTypes2.default.func,
  // for tests
  bodyRef: function bodyRef() {
    return (typeof (React.ElementRef == null ? {} : React.ElementRef) === 'function' ? _propTypes2.default.instanceOf(React.ElementRef == null ? {} : React.ElementRef) : _propTypes2.default.any).apply(this, arguments);
  },
  loadAnimation: _propTypes2.default.bool,
  showHeader: _propTypes2.default.bool,
  rowClassName: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func])
};

var _initialiseProps = function _initialiseProps() {
  var _this6 = this;

  this.handleColumnResizeEnd = function (columnWidth, cursorDelta, dataKey, index) {
    _this6.setState(_defineProperty({
      isColumnResizing: false
    }, dataKey + '_' + index + '_width', columnWidth));

    (0, _domLib.addStyle)(_this6.mouseArea, {
      display: 'none'
    });
  };

  this.handleColumnResizeStart = function (width, left, fixed) {
    _this6.setState({
      isColumnResizing: true
    });
    var mouseAreaLeft = width + left;
    var x = fixed ? mouseAreaLeft : mouseAreaLeft + (_this6.scrollX || 0);
    var styles = { display: 'block' };
    (0, _domLib.translateDOMPositionXY)(styles, x, 0);
    (0, _domLib.addStyle)(_this6.mouseArea, styles);
  };

  this.handleColumnResizeMove = function (width, left, fixed) {
    var mouseAreaLeft = width + left;
    var x = fixed ? mouseAreaLeft : mouseAreaLeft + (_this6.scrollX || 0);
    var styles = {};
    (0, _domLib.translateDOMPositionXY)(styles, x, 0);
    (0, _domLib.addStyle)(_this6.mouseArea, styles);
  };

  this.handleTreeToggle = function (rowKey, rowIndex, rowData) {
    var onExpandChange = _this6.props.onExpandChange;
    var expandedRowKeys = _this6.state.expandedRowKeys;


    var open = false;
    var nextExpandedRowKeys = [];
    expandedRowKeys.forEach(function (key) {
      if (key === rowKey) {
        open = true;
      } else {
        nextExpandedRowKeys.push(key);
      }
    });

    if (!open) {
      nextExpandedRowKeys.push(rowKey);
    }
    _this6.setState({
      expandedRowKeys: nextExpandedRowKeys
    });
    onExpandChange && onExpandChange(!open, rowData);
  };

  this.handleScrollX = function (delta) {
    _this6.handleWheel(delta, 0);
  };

  this.handleScrollY = function (delta) {
    _this6.handleWheel(0, delta);
  };

  this.handleWheel = function (deltaX, deltaY) {
    var onScroll = _this6.props.onScroll;

    if (!_this6.table) {
      return;
    }
    var nextScrollX = _this6.scrollX - deltaX;
    var nextScrollY = _this6.scrollY - deltaY;

    _this6.scrollY = Math.min(0, nextScrollY < _this6.minScrollY ? _this6.minScrollY : nextScrollY);
    _this6.scrollX = Math.min(0, nextScrollX < _this6.minScrollX ? _this6.minScrollX : nextScrollX);
    _this6.updatePosition();

    onScroll && onScroll(_this6.scrollX, _this6.scrollY);
  };

  this.handleTouchStart = function (event) {
    var onTouchStart = _this6.props.onTouchStart;

    var _ref = event.touches ? event.touches[0] : {},
        pageX = _ref.pageX,
        pageY = _ref.pageY;

    _this6.touchX = pageX;
    _this6.touchY = pageY;
    onTouchStart && onTouchStart(event);
  };

  this.handleTouchMove = function (event) {
    event.stopPropagation();
    event.preventDefault();

    var onTouchMove = _this6.props.onTouchMove;

    var _ref2 = event.touches ? event.touches[0] : {},
        nextPageX = _ref2.pageX,
        nextPageY = _ref2.pageY;

    var deltaX = _this6.touchX - nextPageX;
    var deltaY = _this6.touchY - nextPageY;
    _this6.handleWheel(deltaX, deltaY);
    _this6.scrollbarX.onWheelScroll(deltaX);
    _this6.scrollbarY.onWheelScroll(deltaY);
    _this6.touchX = nextPageX;
    _this6.touchY = nextPageY;

    onTouchMove && onTouchMove(event);
  };

  this.shouldHandleWheelX = function (delta) {
    var _props12 = _this6.props,
        disabledScroll = _props12.disabledScroll,
        loading = _props12.loading;
    var _state2 = _this6.state,
        contentWidth = _state2.contentWidth,
        width = _state2.width;

    if (delta === 0 || disabledScroll || loading) {
      return false;
    }

    if (width && contentWidth <= width) {
      return false;
    }

    return delta >= 0 && _this6.scrollX > _this6.minScrollX || delta < 0 && _this6.scrollX < 0;
  };

  this.shouldHandleWheelY = function (delta) {
    var _props13 = _this6.props,
        disabledScroll = _props13.disabledScroll,
        loading = _props13.loading;

    if (delta === 0 || disabledScroll || loading) {
      return false;
    }
    return delta >= 0 && _this6.scrollY > _this6.minScrollY || delta < 0 && _this6.scrollY < 0;
  };

  this.tableRows = [];
  this.mounted = false;
  this.scrollY = 0;
  this.scrollX = 0;

  this.addPrefix = function (name) {
    return (0, _utils.prefix)(_this6.props.classPrefix)(name);
  };

  this.calculateTableWidth = function () {
    var table = _this6.table;
    if (table) {
      _this6.scrollX = 0;
      _this6.scrollbarX && _this6.scrollbarX.resetScrollBarPosition();
      _this6.setState({
        width: (0, _domLib.getWidth)(table)
      });
    }
  };

  this.bindTableRowsRef = function (index) {
    return function (ref) {
      if (ref) {
        _this6.tableRows[index] = ref;
      }
    };
  };

  this.bindMouseAreaRef = function (ref) {
    _this6.mouseArea = ref;
  };

  this.bindTableHeaderRef = function (ref) {
    _this6.tableHeader = ref;
  };

  this.bindHeaderWrapperRef = function (ref) {
    _this6.headerWrapper = ref;
  };

  this.bindTableRef = function (ref) {
    _this6.table = ref;
  };

  this.bindWheelWrapperRef = function (ref) {
    var bodyRef = _this6.props.bodyRef;

    _this6.wheelWrapper = ref;
    bodyRef && bodyRef(ref);
  };

  this.bindBodyRef = function (ref) {
    _this6.tableBody = ref;
  };

  this.bindScrollbarXRef = function (ref) {
    _this6.scrollbarX = ref;
  };

  this.bindScrollbarYRef = function (ref) {
    _this6.scrollbarY = ref;
  };
};

exports.default = Table;
