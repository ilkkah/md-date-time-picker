(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'moment'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('moment'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.moment);
    global.mdDateTimePicker = mod.exports;
  }
})(this, function (exports, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _moment2 = _interopRequireDefault(_moment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0, descriptor; i < props.length; i++) {
        descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1;
        descriptor.configurable = !0;
        if ("value" in descriptor) descriptor.writable = !0;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var mdDateTimePicker = function () {
    /**
    * [constructor of the mdDateTimePicker]
    *
    * @method constructor
    *
    * @param  {String}   type = 'date' or 'time                           [type of dialog]
    * @param  {moment}   init                                             [initial value for the dialog date or time, defaults to today] [@default = today]
    * @param  {moment}   past                                             [the past moment till which the calendar shall render] [@default = exactly 21 Years ago from init]
    * @param  {moment}   future                                           [the future moment till which the calendar shall render] [@default = init]
    * @param  {Boolean}  mode                                             [this value tells whether the time dialog will have the 24 hour mode (true) or 12 hour mode (false)] [@default = false]
    * @param  {String}   orientation = 'LANDSCAPE' or 'PORTRAIT'          [force the orientation of the picker @default = 'LANDSCAPE']
    * @param  {String}  ok = 'ok'                                         [ok button's text]
    * @param  {String}  cancel = 'cancel'                                 [cancel button's text]
    * @param  {Boolean} colon = true                                      [add an option to enable quote in 24 hour mode]
    * @param  {Boolean} autoClose = false                                 [close dialog on date/time selection]
    * @param  {Boolean} inner24 = false                                   [if 24-hour mode and (true), the PM hours shows in an inner dial]
    *
    * @return {Object}                                                    [mdDateTimePicker]
    */
    function mdDateTimePicker(_ref) {
      var type = _ref.type,
          _ref$init = _ref.init,
          init = _ref$init === undefined ? (0, _moment2.default)() : _ref$init,
          _ref$past = _ref.past,
          past = _ref$past === undefined ? (0, _moment2.default)().subtract(1, 'years') : _ref$past,
          _ref$future = _ref.future,
          future = _ref$future === undefined ? (0, _moment2.default)().add(21, 'years') : _ref$future,
          _ref$mode = _ref.mode,
          mode = _ref$mode === undefined ? !1 : _ref$mode,
          _ref$orientation = _ref.orientation,
          orientation = _ref$orientation === undefined ? 'LANDSCAPE' : _ref$orientation,
          _ref$timebutton = _ref.timebutton,
          timebutton = _ref$timebutton === undefined ? 'time' : _ref$timebutton,
          _ref$calendarbutton = _ref.calendarbutton,
          calendarbutton = _ref$calendarbutton === undefined ? 'calendar' : _ref$calendarbutton,
          _ref$now = _ref.now,
          now = _ref$now === undefined ? 'now' : _ref$now,
          _ref$ok = _ref.ok,
          ok = _ref$ok === undefined ? 'ok' : _ref$ok,
          _ref$cancel = _ref.cancel,
          cancel = _ref$cancel === undefined ? 'cancel' : _ref$cancel,
          _ref$colon = _ref.colon,
          colon = _ref$colon === undefined ? !0 : _ref$colon,
          _ref$autoClose = _ref.autoClose,
          autoClose = _ref$autoClose === undefined ? !1 : _ref$autoClose,
          _ref$inner = _ref.inner24,
          inner24 = _ref$inner === undefined ? !1 : _ref$inner;

      _classCallCheck(this, mdDateTimePicker);

      this._type = type;
      this._init = init;
      this._past = past;
      this._future = future;
      this._mode = mode;
      this._orientation = orientation;
      this._calendarbutton = calendarbutton;
      this._timebutton = timebutton;
      this._now = now;
      this._ok = ok;
      this._cancel = cancel;
      this._colon = colon;
      this._autoClose = autoClose;
      this._inner24 = inner24;
      this._listeners = {};

      /**
      * [dialog selected classes have the same structure as dialog but one level down]
      * @type {Object}
      * All declarations starting with _ are considered @private
      * e.g
      * sDialog = {
      *   picker: 'some-picker-selected'
      * }
      */
      this._sDialog = {};

      this._sDialog.tDate = this._init.clone();
      this._sDialog.sDate = this._init.clone();

      // attach the dialog if not present
      if (typeof document !== 'undefined' && !document.getElementById('mddtp-picker')) {
        this._buildDialog();
      }

      var sDialogEls = ['viewHolder', 'years', 'header', 'timebutton', 'calendarbutton', 'now', 'cancel', 'ok', 'left', 'right', 'previous', 'current', 'next', 'header_header', 'subtitle', 'title', 'titleDay', 'titleMonth', 'AM', 'PM', 'hneedle', 'mneedle', 'hourView', 'minuteView', 'hour', 'minute', 'fakeNeedle', 'circularHolder', 'circle', 'dotSpan'],
          i = sDialogEls.length;

      while (i--) {
        this._sDialog[sDialogEls[i]] = document.getElementById('mddtp__' + sDialogEls[i]);
      }

      this._buildDateDialog(this._sDialog.sDate);
      this._buildTimeDialog(this._sDialog.sDate);
    }

    _createClass(mdDateTimePicker, [{
      key: 'on',
      value: function on(type, fn) {
        this._listeners[type] = this._listeners[type] || [];
        this._listeners[type].push(fn);
      }
    }, {
      key: 'fire',
      value: function fire(type, data) {
        if (this._listeners[type]) {
          this._listeners[type].forEach(function (fn) {
            fn(data);
          });
        }
      }
    }, {
      key: 'hide',
      value: function hide() {
        this._selectDialog();
        this._hideDialog();
      }
    }, {
      key: 'show',
      value: function show() {
        this._selectDialog();
        this._showDialog();
      }
    }, {
      key: 'isOpen',
      value: function isOpen() {
        this._selectDialog();

        return !!mdDateTimePicker.dialog.state;
      }
    }, {
      key: 'isClosed',
      value: function isClosed() {
        this._selectDialog();

        return !mdDateTimePicker.dialog.state;
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        this._selectDialog();
        // work according to the current state of the dialog
        if (mdDateTimePicker.dialog.state) {
          this.hide();
        } else {
          this.show();
        }
      }
    }, {
      key: 'toggleType',
      value: function toggleType() {
        this._type = this._type == 'date' ? 'time' : 'date';

        if (this._type == 'date') {
          mdDateTimePicker.dialog.view = !1;
          this._switchToDateView(this._sDialog.title, this);
        } else {
          this._switchToTimeView(this);
        }

        this._selectDialog();

        this._sDialog.picker.classList.remove('mddtp-picker--date');
        this._sDialog.picker.classList.remove('mddtp-picker--time');
        this._sDialog.picker.classList.add('mddtp-picker--' + this._type);
      }
    }, {
      key: '_selectDialog',
      value: function _selectDialog() {
        // now do what you normally would do
        this._sDialog.picker = document.getElementById('mddtp-picker');
      }
    }, {
      key: '_showDialog',
      value: function _showDialog() {
        var me = this,
            zoomIn = 'zoomIn';

        this._type = 'date';
        mdDateTimePicker.dialog.view = !1;
        this._switchToDateView(this._sDialog.title, this);
        mdDateTimePicker.dialog.state = !0;
        this._sDialog.picker.classList.remove('mddtp-picker--date');
        this._sDialog.picker.classList.remove('mddtp-picker--time');
        this._sDialog.picker.classList.add('mddtp-picker--' + this._type);
        this._sDialog.picker.classList.remove('mddtp-picker--inactive');
        this._sDialog.picker.classList.add(zoomIn);
        // if the dialog is forced into portrait mode
        if (this._orientation === 'PORTRAIT') {
          this._sDialog.picker.classList.add('mddtp-picker--portrait');
        }
        setTimeout(function () {
          me._sDialog.picker.classList.remove(zoomIn);
        }, 300);
      }
    }, {
      key: '_hideDialog',
      value: function _hideDialog() {
        var me = this;

        mdDateTimePicker.dialog.state = !1;
        mdDateTimePicker.dialog.view = !0;
        this._sDialog.picker.classList.add('zoomOut');

        setTimeout(function () {
          me._sDialog.picker.classList.remove('zoomOut');
          me._sDialog.picker.classList.add('mddtp-picker--inactive');
        }, 300);
      }
    }, {
      key: '_buildDialog',
      value: function _buildDialog() {
        var type = this._type,
            docfrag = document.createDocumentFragment(),
            container = document.createElement('div'),
            header = document.createElement('div'),
            header_header = document.createElement('div'),
            body = document.createElement('div'),
            action = document.createElement('div'),
            cancel = document.createElement('button'),
            ok = document.createElement('button');
        // outer most container of the picker

        // header container of the picker

        // body container of the picker

        // action elements container

        // ... add properties to them
        container.id = 'mddtp-picker';
        container.classList.add('mddtp-picker');
        container.classList.add('mddtp-picker--inactive');
        container.classList.add('animated');
        this._addId(header, 'header');
        this._addClass(header, 'header');
        // add header to container
        container.appendChild(header);

        this._addId(header_header, 'header_header');
        header.appendChild(header_header);

        this._addClass(body, 'body');
        body.appendChild(action);
        // add body to container
        container.appendChild(body);
        // add stuff to header and body according to dialog type

        function buildDate() {
          var title = document.createElement('div'),
              titleDay = document.createElement('div'),
              titleMonth = document.createElement('div'),
              viewHolder = document.createElement('div'),
              views = document.createElement('ul'),
              previous = document.createElement('li'),
              current = document.createElement('li'),
              next = document.createElement('li'),
              left = document.createElement('i'),
              right = document.createElement('i'),
              years = document.createElement('ul');

          // inside header
          // adding properties to them
          this._addId(title, 'title');
          this._addClass(title, 'title', ['mddtp-picker__color--active']);
          this._addClass(title, 'date-title');
          this._addId(titleDay, 'titleDay');
          this._addId(titleMonth, 'titleMonth');
          // add title stuff to it
          title.appendChild(titleMonth);
          title.appendChild(titleDay);
          // add them to header
          header.appendChild(title);
          // inside body
          // inside viewHolder
          this._addId(viewHolder, 'viewHolder');
          this._addClass(viewHolder, 'viewHolder', ['animated']);
          this._addClass(views, 'views');
          this._addId(previous, 'previous');
          previous.classList.add('mddtp-picker__view');
          this._addId(current, 'current');
          current.classList.add('mddtp-picker__view');
          this._addId(next, 'next');
          next.classList.add('mddtp-picker__view');
          // fill the views
          this._addView(previous);
          this._addView(current);
          this._addView(next);
          // add them
          viewHolder.appendChild(views);
          views.appendChild(previous);
          views.appendChild(current);
          views.appendChild(next);
          // inside body again
          this._addId(left, 'left');
          left.classList.add('ion');
          left.classList.add('ion-ios-arrow-left');
          this._addClass(left, 'left');

          this._addId(right, 'right');
          right.classList.add('ion');
          right.classList.add('ion-ios-arrow-right');
          this._addClass(right, 'right');

          this._addId(years, 'years');
          this._addClass(years, 'years', ['mddtp-picker__years--invisible', 'animated']);
          // add them to body
          body.appendChild(viewHolder);
          body.appendChild(left);
          body.appendChild(right);
          body.appendChild(years);
        }

        function buildTime() {

          var title = document.createElement('div'),
              hour = document.createElement('span'),
              span = document.createElement('span'),
              minute = document.createElement('span'),
              subtitle = document.createElement('div'),
              AM = document.createElement('div'),
              PM = document.createElement('div'),
              circularHolder = document.createElement('div'),
              hneedle = document.createElement('div'),
              mneedle = document.createElement('div'),
              hline = document.createElement('span'),
              hcircle = document.createElement('span'),
              mline = document.createElement('span'),
              mcircle = document.createElement('span'),
              minuteView = document.createElement('div'),
              hourView = document.createElement('div');
          // const fakeNeedle = document.createElement('div')

          // add properties to them
          // inside header
          this._addId(title, 'title');
          this._addClass(title, 'title');
          this._addClass(title, 'time-title');
          this._addId(hour, 'hour');
          hour.classList.add('mddtp-picker__color--active');
          span.textContent = ':';
          this._addId(span, 'dotSpan');
          span.setAttribute('style', 'display: none');
          this._addId(minute, 'minute');
          this._addId(subtitle, 'subtitle');
          this._addClass(subtitle, 'subtitle');
          this._addClass(subtitle, 'time-subtitle');
          subtitle.setAttribute('style', 'display: none');
          this._addClass(AM, 'am_pm');
          this._addClass(PM, 'am_pm');
          this._addId(AM, 'AM');
          // AM.textContent = 'AM'
          // Change to 'AM' to Locale Meridiem
          AM.textContent = (0, _moment2.default)().localeData().meridiem(1, 1, !0);
          this._addId(PM, 'PM');
          // PM.textContent = 'PM'
          // Change to 'PM' to Locale Meridiem
          PM.textContent = (0, _moment2.default)().localeData().meridiem(13, 1, !0);
          // add them to title and subtitle
          title.appendChild(hour);
          title.appendChild(span);
          title.appendChild(minute);
          subtitle.appendChild(AM);
          subtitle.appendChild(PM);
          // add them to header
          header.appendChild(title);
          circularHolder.appendChild(subtitle);
          // inside body
          this._addId(circularHolder, 'circularHolder');
          this._addClass(circularHolder, 'circularHolder');
          this._addClass(circularHolder, 'circularHolder__hour');
          this._addId(hneedle, 'hneedle');
          this._addId(mneedle, 'mneedle');
          hneedle.classList.add('mddtp-picker__selection');
          mneedle.classList.add('mddtp-picker__selection');

          this._addClass(hline, 'line');
          this._addId(hcircle, 'circle');
          this._addClass(hcircle, 'circle');

          this._addClass(mline, 'line');
          this._addId(mcircle, 'circle');
          this._addClass(mcircle, 'circle');

          this._addId(minuteView, 'minuteView');
          minuteView.classList.add('mddtp-picker__circularView');
          minuteView.classList.add('mddtp-picker__circularView--hidden');
          // this._addId(fakeNeedle, 'fakeNeedle')
          // fakeNeedle.classList.add('mddtp-picker__circle--fake')
          this._addId(hourView, 'hourView');
          hourView.classList.add('mddtp-picker__circularView');

          // add them to hneedle
          hneedle.appendChild(hline);
          hneedle.appendChild(hcircle);

          // add them to mneedle
          mneedle.appendChild(mline);
          mneedle.appendChild(mcircle);

          // add them to circularHolder
          circularHolder.appendChild(hneedle);
          circularHolder.appendChild(mneedle);
          circularHolder.appendChild(minuteView);
          // circularHolder.appendChild(fakeNeedle)
          circularHolder.appendChild(hourView);
          // add them to body
          body.appendChild(circularHolder);
        }

        buildDate.call(this);
        buildTime.call(this);

        var now = document.createElement('button'),
            timebutton = document.createElement('button'),
            calendarbutton = document.createElement('button');


        this._addId(timebutton, 'timebutton');
        timebutton.classList.add('mddtp-button');
        action.appendChild(timebutton);

        this._addId(now, 'now');
        now.classList.add('mddtp-button');
        action.appendChild(now);

        this._addId(calendarbutton, 'calendarbutton');
        calendarbutton.classList.add('mddtp-button');
        action.appendChild(calendarbutton);

        action.classList.add('mddtp-picker__action');

        if (this._autoClose === !0) {
          action.style.display = 'none';
        }

        this._addId(cancel, 'cancel');
        cancel.classList.add('mddtp-button');
        this._addId(ok, 'ok');
        ok.classList.add('mddtp-button');
        // add actions
        action.appendChild(cancel);
        action.appendChild(ok);
        // add actions to body
        body.appendChild(action);
        docfrag.appendChild(container);
        // add the container to the end of body
        document.getElementsByTagName('body').item(0).appendChild(docfrag);
      }
    }, {
      key: '_setHourActive',
      value: function _setHourActive() {
        this._sDialog.hneedle.classList.add('mddtp-picker__active');
        this._sDialog.mneedle.classList.remove('mddtp-picker__active');
      }
    }, {
      key: '_setMinuteActive',
      value: function _setMinuteActive() {
        this._sDialog.hneedle.classList.remove('mddtp-picker__active');
        this._sDialog.mneedle.classList.add('mddtp-picker__active');
      }
    }, {
      key: '_buildTimeDialog',
      value: function _buildTimeDialog(m) {
        var hour = this._sDialog.hour,
            minute = this._sDialog.minute,
            subtitle = this._sDialog.subtitle,
            dotSpan = this._sDialog.dotSpan;


        // switch according to 12 hour or 24 hour mode
        // this._mode = true: 24
        // this._mode = false: 12
        if (this._mode) {
          // CHANGED exception case for 24 => 0 issue #57
          var text = parseInt(m.format('H'), 10);
          if (text === 0) {
            text = '00';
          }
          this._fillText(hour, text);
          // add the configurable colon in this mode issue #56
          if (this._colon) {
            dotSpan.removeAttribute('style');
          }
        } else {
          this._fillText(hour, m.format('h'));
          // this._sDialog[m.format('A')].classList.add('mddtp-picker__color--active')
          // Using isPM function for Find PM
          if (m._locale.isPM(m.format('A'))) {
            this._sDialog.PM.classList.add('mddtp-picker__color--active');
          } else {
            this._sDialog.AM.classList.add('mddtp-picker__color--active');
          }
          subtitle.removeAttribute('style');
          dotSpan.removeAttribute('style');
        }
        this._fillText(minute, m.format('mm'));
        this._buildHourView();
        this._buildMinuteView();
        this._attachEventHandlers();
        this._changeM();
        this._addClockEvent();
        this._setButtonText();
        this._setHourActive();
      }
    }, {
      key: '_buildHourView',
      value: function _buildHourView() {
        var hourView = this._sDialog.hourView,
            hneedle = this._sDialog.hneedle,
            rotate = 'mddtp-picker__cell--rotate-',
            rotate24 = 'mddtp-picker__cell--rotate24',
            cell = 'mddtp-picker__cell',
            docfrag = document.createDocumentFragment();

        // let hourNow
        if (this._mode) {
          var degreeStep = this._inner24 === !0 ? 10 : 5;
          // hourNow = parseInt(this._sDialog.tDate.format('H'), 10)
          for (var _i = 1, j = degreeStep; _i <= 24; _i++, j += degreeStep) {
            var div = document.createElement('div'),
                span = document.createElement('span');

            div.classList.add(cell);
            // CHANGED exception case for 24 => 0 issue #57
            if (_i === 24) {
              span.textContent = '00';
            } else {
              span.textContent = _i;
            }

            var position = j;
            if (this._inner24 === !0 && _i > 12) {
              position -= 120;
              div.classList.add(rotate24);
            }

            div.classList.add(rotate + position);
            /*
            if (hourNow === i) {
              div.id = hour
              div.classList.add(selected)
              hneedle.classList.add(rotate + position)
            }
            // CHANGED exception case for 24 => 0 issue #58
            if (i === 24 && hourNow === 0) {
              div.id = hour
              div.classList.add(selected)
              hneedle.classList.add(rotate + position)
            }
            */
            div.appendChild(span);
            docfrag.appendChild(div);
          }
        } else {
          // hourNow = parseInt(this._sDialog.tDate.format('h'), 10)
          for (var _i2 = 1, _j = 10; _i2 <= 12; _i2++, _j += 10) {
            var _div = document.createElement('div'),
                _span = document.createElement('span');

            _div.classList.add(cell);
            _span.textContent = _i2;
            _div.classList.add(rotate + _j);
            // if (hourNow === i) {
            //   div.id = hour
            //   div.classList.add(selected)
            //   hneedle.classList.add(rotate + j)
            // }
            _div.appendChild(_span);
            docfrag.appendChild(_div);
          }
        }
        // empty the hours
        while (hourView.lastChild) {
          hourView.removeChild(hourView.lastChild);
        }
        // set inner html accordingly
        hourView.appendChild(docfrag);
      }
    }, {
      key: '_buildMinuteView',
      value: function _buildMinuteView() {
        var minuteView = this._sDialog.minuteView,
            minuteNow = parseInt(this._sDialog.tDate.format('m'), 10),
            rotate = 'mddtp-picker__cell--rotate-',
            cell = 'mddtp-picker__cell',
            docfrag = document.createDocumentFragment();
        // const mneedle = this._sDialog.mneedle
        // const sMinute = 'mddtp-minute__selected'
        // const selected = 'mddtp-picker__cell--selected'

        for (var _i3 = 5, j = 10; _i3 <= 60; _i3 += 5, j += 10) {
          var div = document.createElement('div'),
              span = document.createElement('span');

          div.classList.add(cell);
          if (_i3 === 60) {
            span.textContent = this._numWithZero(0);
          } else {
            span.textContent = this._numWithZero(_i3);
          }
          if (minuteNow === 0) {
            minuteNow = 60;
          }
          div.classList.add(rotate + j);
          // (minuteNow === 1 && i === 60) for corner case highlight 00 at 01
          // if ((minuteNow === i) || (minuteNow - 1 === i) || (minuteNow + 1 === i) || (minuteNow === 1 && i === 60)) {
          //   div.id = sMinute
          //   div.classList.add(selected)
          // }
          div.appendChild(span);
          docfrag.appendChild(div);
        }
        // empty the hours
        while (minuteView.lastChild) {
          minuteView.removeChild(minuteView.lastChild);
        }

        /*
        var spoke, value;
         spoke = 60
        value = parseInt(this._sDialog.tDate.format('m'), 10)
        const rotationClass = this._calcRotation(spoke, parseInt(value, 10))
        if (rotationClass) {
          mneedle.classList.add(rotationClass)
        }
        */

        // set inner html accordingly
        minuteView.appendChild(docfrag);
      }
    }, {
      key: '_buildDateDialog',
      value: function _buildDateDialog(m) {
        this._updateHeader(m);
        this._buildYear();
        this._buildViewHolder();
        this._attachEventHandlers();
        this._changeMonth();
        // this._switchToView(this._sDialog.title)
        this._setButtonText();
      }
    }, {
      key: '_buildViewHolder',
      value: function _buildViewHolder() {
        var m = this._sDialog.tDate,
            current = this._sDialog.current,
            previous = this._sDialog.previous,
            next = this._sDialog.next,
            past = this._past,
            future = this._future;

        if (m.isBefore(past, 'month')) {
          m = past.clone();
        }
        if (m.isAfter(future, 'month')) {
          m = future.clone();
        }
        this._sDialog.tDate = m;
        this._buildMonth(current, m);
        this._buildMonth(next, (0, _moment2.default)(this._getMonth(m, 1)));
        this._buildMonth(previous, (0, _moment2.default)(this._getMonth(m, -1)));
        this._toMoveMonth();
      }
    }, {
      key: '_buildMonth',
      value: function _buildMonth(view, m) {
        var displayMonth = m.format('MMMM YYYY'),
            innerDivs = view.getElementsByTagName('div');
        // get the .mddtp-picker__month element using innerDivs[0]

        this._fillText(innerDivs[0], displayMonth);

        innerDivs[0].onclick = this._switchToYearView.bind(this);

        var docfrag = document.createDocumentFragment(),
            tr = innerDivs[3],
            firstDayOfMonth = _moment2.default.weekdays(!0).indexOf(_moment2.default.weekdays(!1, (0, _moment2.default)(m).date(1).day())),
            today = -1,
            selected = -1,
            lastDayOfMonth = parseInt((0, _moment2.default)(m).endOf('month').format('D'), 10) + firstDayOfMonth - 1,
            past = firstDayOfMonth,
            cellClass = 'mddtp-picker__cell',
            future = lastDayOfMonth;
        // get the .mddtp-picker__tr element using innerDivs[3]

        /*
        * @netTrek - first day of month dependented from moment.locale
        */

        if ((0, _moment2.default)().isSame(m, 'month')) {
          today = parseInt((0, _moment2.default)().format('D'), 10);
          today += firstDayOfMonth - 1;
        }
        if (this._past.isSame(m, 'month')) {
          past = parseInt(this._past.format('D'), 10);
          past += firstDayOfMonth - 1;
        }
        if (this._future.isSame(m, 'month')) {
          future = parseInt(this._future.format('D'), 10);
          future += firstDayOfMonth - 1;
        }
        if (this._sDialog.sDate.isSame(m, 'month')) {
          selected = parseInt((0, _moment2.default)(this._sDialog.sDate).format('D'), 10);
          selected += firstDayOfMonth - 1;
        }
        for (var _i4 = 0; _i4 < 42; _i4++) {
          // create cell
          var cell = document.createElement('span'),
              currentDay = _i4 - firstDayOfMonth + 1;

          if (_i4 >= firstDayOfMonth && _i4 <= lastDayOfMonth) {
            if (_i4 > future || _i4 < past) {
              cell.classList.add(cellClass + '--disabled');
            } else {
              cell.classList.add(cellClass);
            }
            this._fillText(cell, currentDay);
          }
          if (today === _i4) {
            cell.classList.add(cellClass + '--today');
            this.todaycell = cell;
          }
          if (selected === _i4) {
            cell.classList.add(cellClass + '--selected');
            cell.id = 'mddtp-date__selected';
          }
          docfrag.appendChild(cell);
        }
        // empty the tr
        while (tr.lastChild) {
          tr.removeChild(tr.lastChild);
        }
        // set inner html accordingly
        tr.appendChild(docfrag);
        this._addCellClickEvent(tr, this);
      }
    }, {
      key: '_buildYear',
      value: function _buildYear() {
        var years = this._sDialog.years,
            currentYear = this._sDialog.tDate.year(),
            docfrag = document.createDocumentFragment(),
            past = this._past.year(),
            future = this._future.year();

        for (var year = past; year <= future; year++) {
          var li = document.createElement('li');
          li.textContent = year;
          li.dataset.year = year;
          if (year === currentYear) {
            li.id = 'mddtp-date__currentYear';
            li.classList.add('mddtp-picker__li--current');
          }
          docfrag.appendChild(li);
        }
        // empty the years ul
        while (years.lastChild) {
          years.removeChild(years.lastChild);
        }
        // set inner html accordingly
        years.appendChild(docfrag);
        // attach event handler to the ul to get the benefit of event delegation
        this._changeYear(years);
      }
    }, {
      key: '_updateHeader',
      value: function _updateHeader(m) {
        this._fillText(this._sDialog.header_header, m.format('dddd hh:mm a'));
        this._fillText(this._sDialog.subtitle, m.year());
        this._fillText(this._sDialog.titleDay, m.format('D'));
        this._fillText(this._sDialog.titleMonth, m.format('MMM'));
      }
    }, {
      key: '_removeRotation',
      value: function _removeRotation(needle) {
        needle.classList.forEach(function (el) {
          if (el.indexOf('rotate') !== -1) {
            needle.classList.remove(el);
          }
        });
      }
    }, {
      key: '_pointNeedle',
      value: function _pointNeedle(me, needle) {
        var spoke = void 0,
            value = void 0,
            circularHolder = this._sDialog.circularHolder;


        if (!needle) {
          needle = mdDateTimePicker.dialog.view ? me._sDialog.hneedle : me._sDialog.mneedle;
        }

        me._removeRotation(needle);

        // minute mode
        if (needle == me._sDialog.mneedle) {
          spoke = 60;
          value = me._sDialog.sDate.format('m');
        } else {
          // hour mode
          if (me._mode) {
            spoke = 24;
            value = parseInt(me._sDialog.sDate.format('H'), 10);
            // CHANGED exception for 24 => 0 issue #58
            if (value === 0) {
              value = 24;
            }
          } else {
            spoke = 12;
            value = me._sDialog.sDate.format('h');
          }
        }

        var rotationClass = me._calcRotation(spoke, parseInt(value, 10));
        if (rotationClass) {
          needle.classList.add(rotationClass);
        }
      }
    }, {
      key: '_switchToHourView',
      value: function _switchToHourView() {
        var hourView = this._sDialog.hourView,
            minuteView = this._sDialog.minuteView,
            hour = this._sDialog.hour,
            minute = this._sDialog.minute,
            activeClass = 'mddtp-picker__color--active',
            hidden = 'mddtp-picker__circularView--hidden';


        // toggle view classes
        hourView.classList.remove(hidden);
        minuteView.classList.remove(hidden);
        minuteView.classList.add(hidden);

        hour.classList.remove(activeClass);
        hour.classList.add(activeClass);
        minute.classList.remove(activeClass);

        mdDateTimePicker.dialog.view = !0;
        this._setHourActive();
      }
    }, {
      key: '_switchToMinuteView',
      value: function _switchToMinuteView() {
        var hourView = this._sDialog.hourView,
            minuteView = this._sDialog.minuteView,
            hour = this._sDialog.hour,
            minute = this._sDialog.minute,
            activeClass = 'mddtp-picker__color--active',
            hidden = 'mddtp-picker__circularView--hidden';


        // toggle view classes
        hourView.classList.remove(hidden);
        hourView.classList.add(hidden);
        minuteView.classList.remove(hidden);

        hour.classList.remove(activeClass);
        minute.classList.remove(activeClass);
        minute.classList.add(activeClass);

        mdDateTimePicker.dialog.view = !1;
        this._setMinuteActive();
      }
    }, {
      key: '_switchToTimeView',
      value: function _switchToTimeView(me) {
        me._switchToHourView();
        me._pointNeedle(me, me._sDialog.hneedle);
        me._pointNeedle(me, me._sDialog.mneedle);
        me._updateHeader(me._sDialog.sDate);
      }
    }, {
      key: '_switchToYearView',
      value: function _switchToYearView() {
        var selectedYear = document.getElementById('mddtp-date__currentYear'),
            years = this._sDialog.years,
            viewHolder = this._sDialog.viewHolder;


        if (selectedYear) {
          selectedYear.id = '';
          selectedYear.classList.remove('mddtp-picker__li--current');
        }

        var currentYear = years.querySelector('[data-year="' + this._sDialog.tDate.year() + '"]');

        if (currentYear) {
          currentYear.id = 'mddtp-date__currentYear';
          currentYear.classList.add('mddtp-picker__li--current');
        }

        mdDateTimePicker.dialog.view = !0;
        viewHolder.classList.add('zoomOut');
        years.classList.remove('mddtp-picker__years--invisible');
        years.classList.add('zoomIn');
        // scroll into the view
        currentYear && currentYear.scrollIntoViewIfNeeded && currentYear.scrollIntoViewIfNeeded();
      }
    }, {
      key: '_switchToDateView',
      value: function _switchToDateView(el, me) {
        el.setAttribute('disabled', '');
        var viewHolder = me._sDialog.viewHolder,
            years = me._sDialog.years,
            subtitle = me._sDialog.subtitle;


        mdDateTimePicker.dialog.view = !1;

        years.classList.add('zoomOut');
        viewHolder.classList.remove('zoomOut');
        viewHolder.classList.add('zoomIn');

        setTimeout(function () {
          years.classList.remove('zoomIn', 'zoomOut');
          years.classList.add('mddtp-picker__years--invisible');
          viewHolder.classList.remove('zoomIn');
        }, 300);

        setTimeout(function () {
          el.removeAttribute('disabled');
        }, 300);
      }
    }, {
      key: '_addClockEvent',
      value: function _addClockEvent() {
        var me = this,
            hourView = this._sDialog.hourView,
            minuteView = this._sDialog.minuteView;


        // const sClass = 'mddtp-picker__cell--selected'
        hourView.onclick = function (e) {
          // const sHour = 'mddtp-hour__selected'
          // const selectedHour = document.getElementById(sHour)
          var setHour = 0,
              switchToMinute = !1;


          if (e.target && e.target.nodeName === 'SPAN') {
            if (me._mode) {
              setHour = parseInt(e.target.textContent, 10);
            } else if (me._sDialog.sDate.format('A') === 'AM') {
              setHour = parseInt(e.target.textContent, 10);
            } else {
              setHour = parseInt(e.target.textContent, 10) + 12;
            }

            if (me._sDialog.sDate.hour() === setHour) {
              switchToMinute = !0;
            }

            me._sDialog.sDate.hour(setHour);
            me._sDialog.tDate.hour(setHour);
            // set the display hour
            me._sDialog.hour.textContent = e.target.textContent;
            // switch the view
            me._pointNeedle(me);
            me._updateHeader(me._sDialog.sDate);

            if (switchToMinute) {
              me._switchToMinuteView();
            }
          }
        };

        minuteView.onclick = function (e) {
          // const sMinute = 'mddtp-minute__selected'
          // const selectedMinute = document.getElementById(sMinute)
          var setMinute = 0;
          if (e.target && e.target.nodeName === 'SPAN') {
            setMinute = e.target.textContent;
            me._sDialog.sDate.minute(setMinute);
            me._sDialog.tDate.minute(setMinute);

            // set the display minute
            me._sDialog.minute.textContent = setMinute;
            me._pointNeedle(me);
            me._updateHeader(me._sDialog.sDate);

            if (me._autoClose === !0) {
              me._sDialog.ok.onclick();
            }
          }
        };
      }
    }, {
      key: '_cellClicked',
      value: function _cellClicked(e, currentDate) {
        if (e.target && e.target.nodeName === 'SPAN' && e.target.classList.contains('mddtp-picker__cell')) {
          var day = e.target.textContent;
          currentDate = currentDate || this._sDialog.tDate.date(day);

          // if we are in date view, we need to change the selected cell
          if (this._type === 'date') {
            var el = document.getElementById('mddtp-date__selected');
            if (el) {
              el.id = '';
              el.classList.remove('mddtp-picker__cell--selected');
            }

            e.target.classList.add('mddtp-picker__cell--selected');
            e.target.id = 'mddtp-date__selected';
          }

          // update temp date object with the date selected
          this._sDialog.sDate = currentDate.clone();
          this._updateHeader(this._sDialog.sDate);

          if (this._autoClose === !0) {
            this._sDialog.ok.onclick();
          }
        }
      }
    }, {
      key: '_addCellClickEvent',
      value: function _addCellClickEvent(el, me) {
        el.onclick = this._cellClicked.bind(me);
      }
    }, {
      key: '_toMoveMonth',
      value: function _toMoveMonth() {
        var m = this._sDialog.tDate,
            left = this._sDialog.left,
            right = this._sDialog.right,
            past = this._past,
            future = this._future;


        left.removeAttribute('disabled');
        right.removeAttribute('disabled');
        left.classList.remove('mddtp-button--disabled');
        right.classList.remove('mddtp-button--disabled');

        if (m.isSame(past, 'month')) {
          left.setAttribute('disabled', '');
          left.classList.add('mddtp-button--disabled');
        }
        if (m.isSame(future, 'month')) {
          right.setAttribute('disabled', '');
          right.classList.add('mddtp-button--disabled');
        }
      }
    }, {
      key: '_changeMonth',
      value: function _changeMonth() {
        var me = this,
            left = this._sDialog.left,
            right = this._sDialog.right,
            mLeftClass = 'mddtp-picker__view--left',
            mRightClass = 'mddtp-picker__view--right',
            pause = 'mddtp-picker__view--pause';


        left.onclick = function () {
          moveStep(mRightClass, me._sDialog.previous);
        };

        right.onclick = function () {
          moveStep(mLeftClass, me._sDialog.next);
        };

        function moveStep(aClass, to) {
          /**
          * [stepBack to know if the to step is going back or not]
          *
          * @type {Boolean}
          */
          if (me.movingStep) {
            return;
          }

          me.movingStep = !0;
          var stepBack = !1,
              next = me._sDialog.next,
              current = me._sDialog.current,
              previous = me._sDialog.previous;

          left.setAttribute('disabled', '');
          right.setAttribute('disabled', '');
          current.classList.add(aClass);
          previous.classList.add(aClass);
          next.classList.add(aClass);
          var clone = to.cloneNode(!0),
              del = void 0;

          if (to === next) {
            del = previous;
            current.parentNode.appendChild(clone);
            next.id = current.id;
            current.id = previous.id;
            previous = current;
            current = next;
            next = clone;
          } else {
            stepBack = !0;
            del = next;
            previous.id = current.id;
            current.id = next.id;
            next = current;
            current = previous;
          }
          setTimeout(function () {
            if (to === previous) {
              current.parentNode.insertBefore(clone, current);
              previous = clone;
            }
            // update real values to match these values
            me._sDialog.next = next;
            me._sDialog.current = current;
            me._sDialog.previous = previous;
            current.classList.add(pause);
            next.classList.add(pause);
            previous.classList.add(pause);
            current.classList.remove(aClass);
            next.classList.remove(aClass);
            previous.classList.remove(aClass);
            del.parentNode.removeChild(del);
          }, 300);
          // REVIEW replace below code with requestAnimationFrame
          setTimeout(function () {
            current.classList.remove(pause);
            next.classList.remove(pause);
            previous.classList.remove(pause);
            if (stepBack) {
              me._sDialog.tDate = me._getMonth(me._sDialog.tDate, -1);
            } else {
              me._sDialog.tDate = me._getMonth(me._sDialog.tDate, 1);
            }
            me._buildViewHolder();
          }, 350);
          setTimeout(function () {
            if (!left.classList.contains('mddtp-button--disabled')) {
              left.removeAttribute('disabled');
            }
            if (!right.classList.contains('mddtp-button--disabled')) {
              right.removeAttribute('disabled');
            }

            me.movingStep = !1;
          }, 400);
        }
      }
    }, {
      key: '_changeYear',
      value: function _changeYear(el) {
        var me = this;
        el.onclick = function (e) {
          if (e.target && e.target.nodeName === 'LI') {
            var selected = document.getElementById('mddtp-date__currentYear');
            // clear previous selected
            selected.id = '';
            selected.classList.remove('mddtp-picker__li--current');
            // add the properties to the newer one
            e.target.id = 'mddtp-date__currentYear';
            e.target.classList.add('mddtp-picker__li--current');
            // switch view
            me._switchToDateView(el, me);
            // set the tdate to it
            me._sDialog.tDate.year(parseInt(e.target.textContent, 10));
            // update the dialog
            me._buildViewHolder();
          }
        };
      }
    }, {
      key: '_changeM',
      value: function _changeM() {
        var me = this,
            AM = this._sDialog.AM,
            PM = this._sDialog.PM;


        function toggle() {
          var m = 'AM';
          if (me._sDialog.sDate._locale.isPM(me._sDialog.sDate.format('A'))) {
            m = 'PM';
          }
          if (m === 'AM') {
            me._sDialog.sDate.add(12, 'h');
          } else {
            me._sDialog.sDate.subtract(12, 'h');
          }

          AM.classList.toggle('mddtp-picker__color--active');
          PM.classList.toggle('mddtp-picker__color--active');
          me._updateHeader(me._sDialog.sDate);
        }

        AM.onclick = PM.onclick = toggle;
      }
    }, {
      key: '_attachEventHandlers',
      value: function _attachEventHandlers() {
        var me = this,
            timebutton = this._sDialog.timebutton,
            calendarbutton = this._sDialog.calendarbutton,
            now = this._sDialog.now,
            ok = this._sDialog.ok,
            cancel = this._sDialog.cancel,
            onCancel = new CustomEvent('onCancel'),
            onOk = new CustomEvent('onOk');


        if (timebutton) {
          timebutton.onclick = me.toggleType.bind(me);
        }

        if (calendarbutton) {
          calendarbutton.onclick = me.toggleType.bind(me);
        }

        if (now) now.onclick = function (e) {
          now.blur();

          // remove the already selected 
          var el = document.getElementById('mddtp-date__selected');

          if (el) {
            el.id = '';
            el.classList.remove('mddtp-picker__cell--selected');
          }

          var m = (0, _moment2.default)();
          me._sDialog.tDate = me._sDialog.sDate.clone();
          me._sDialog.tDate.day(m.day());
          me._sDialog.tDate.month(m.month());
          me._sDialog.tDate.year(m.year());
          me._buildViewHolder();
          me._cellClicked({ target: me.todaycell }, me._sDialog.tDate);
        };

        cancel.onclick = function () {
          me.toggle();
          me.fire('cancel');
        };

        ok.onclick = function () {
          me._init = me._sDialog.sDate;
          me.toggle();
          me.fire('ok', me._sDialog.sDate.toDate());
        };
      }
    }, {
      key: '_setButtonText',
      value: function _setButtonText() {
        if (this._sDialog.now) this._sDialog.now.textContent = this._now;
        if (this._sDialog.timebutton) this._sDialog.timebutton.textContent = this._timebutton;
        if (this._sDialog.calendarbutton) this._sDialog.calendarbutton.textContent = this._calendarbutton;
        this._sDialog.cancel.textContent = this._cancel;
        this._sDialog.ok.textContent = this._ok;
      }
    }, {
      key: '_getMonth',
      value: function _getMonth(moment, count) {
        var m = void 0;
        m = moment.clone();
        if (count > 0) {
          return m.add(Math.abs(count), 'M');
        }
        return m.subtract(Math.abs(count), 'M');
      }
    }, {
      key: '_nearestDivisor',
      value: function _nearestDivisor(number, divided) {
        if (number % divided === 0) {
          return number;
        } else if ((number - 1) % divided === 0) {
          return number - 1;
        } else if ((number + 1) % divided === 0) {
          return number + 1;
        }
        return -1;
      }
    }, {
      key: '_numWithZero',
      value: function _numWithZero(n) {
        return n > 9 ? '' + n : '0' + n;
      }
    }, {
      key: '_fillText',
      value: function _fillText(el, text) {
        if (el.firstChild) {
          el.firstChild.nodeValue = text;
        } else {
          el.appendChild(document.createTextNode(text));
        }
      }
    }, {
      key: '_addId',
      value: function _addId(el, id) {
        el.id = 'mddtp__' + id;
      }
    }, {
      key: '_addClass',
      value: function _addClass(el, aClass, more) {
        el.classList.add('mddtp-picker__' + aClass);
        var i = 0;
        if (more) {
          i = more.length;
          more.reverse();
        }
        while (i--) {
          el.classList.add(more[i]);
        }
      }
    }, {
      key: '_addView',
      value: function _addView(view) {
        var month = document.createElement('div'),
            grid = document.createElement('div'),
            th = document.createElement('div'),
            tr = document.createElement('div'),
            weekDays = _moment2.default.weekdaysMin(!0).reverse(),
            week = 7;
        /**
        * @netTrek - weekday dependented from moment.locale
        */

        while (week--) {
          var span = document.createElement('span');
          span.textContent = weekDays[week];
          th.appendChild(span);
        }
        // add properties to them
        this._addClass(month, 'month');
        this._addClass(grid, 'grid');
        this._addClass(th, 'th');
        this._addClass(tr, 'tr');
        // add them to the view
        view.appendChild(month);
        view.appendChild(grid);
        grid.appendChild(th);
        grid.appendChild(tr);
      }
    }, {
      key: '_calcRotation',
      value: function _calcRotation(spoke, value) {
        // set clocks top and right side value
        if (spoke === 12) {
          value *= 10;
        } else if (spoke === 24) {
          value *= 5;
        } else {
          value *= 2;
        }
        // special case for 00 => 60
        if (spoke === 60 && value === 0) {
          value = 120;
        }
        return 'mddtp-picker__cell--rotate-' + value;
      }
    }, {
      key: 'time',
      get: function get() {
        return this._init;
      },
      set: function set(m) {
        if (m) {
          this._init = m;
        }
      }
    }], [{
      key: 'dialog',
      get: function get() {
        return mdDateTimePicker._dialog;
      },
      set: function set(value) {
        mdDateTimePicker._dialog = value;
      }
    }]);

    return mdDateTimePicker;
  }();

  mdDateTimePicker._dialog = {
    view: !0,
    state: !1
  };

  exports.default = mdDateTimePicker;
});