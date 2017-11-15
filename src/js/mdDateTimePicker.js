/**
* @package md-date-time-picker
* @version [2.2.0]
* @author Puranjay Jain <puranjay.jain@st.niituniversity.in>
* @license MIT
* @website https://puranjayjain.github.io/md-date-time-picker
*/

/**
* import necessary components
*/
import moment from 'moment'

class mdDateTimePicker {
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
  constructor ({
    type,
    init = moment(),
    past = moment().subtract(1, 'years'),
    future = moment().add(21, 'years'),
    mode = false,
    orientation = 'LANDSCAPE',
    timebutton = 'time',
    calendarbutton = 'calendar',
    now = 'now',
    ok = 'ok',
    cancel = 'cancel',
    colon = true,
    autoClose = false,
    inner24 = false
  }) {
    this._type = type
    this._init = init
    this._past = past
    this._future = future
    this._mode = mode
    this._orientation = orientation
    this._calendarbutton = calendarbutton
    this._timebutton = timebutton
    this._now = now
    this._ok = ok
    this._cancel = cancel
    this._colon = colon
    this._autoClose = autoClose
    this._inner24 = inner24
    this._listeners = {}

    /**
    * [dialog selected classes have the same structure as dialog but one level down]
    * @type {Object}
    * All declarations starting with _ are considered @private
    * e.g
    * sDialog = {
    *   picker: 'some-picker-selected'
    * }
    */
    this._sDialog = {}

    this._sDialog.tDate = this._init.clone()
    this._sDialog.sDate = this._init.clone()

    // attach the dialog if not present
    if (typeof document !== 'undefined' && !document.getElementById(`mddtp-picker`)) {
      this._buildDialog()
    }

    const sDialogEls = [
      'viewHolder', 'years', 'header', 'timebutton', 'calendarbutton', 'now', 'cancel', 'ok', 'left', 'right', 'previous', 'current', 'next', 'header_header', 'subtitle', 'title', 'titleDay', 'titleMonth', 'AM', 'PM', 'hneedle', 'mneedle', 'hourView', 'minuteView', 'hour', 'minute', 'fakeNeedle', 'circularHolder', 'circle', 'dotSpan'
    ]
    let i = sDialogEls.length
    while (i--) {
      this._sDialog[sDialogEls[i]] = document.getElementById(`mddtp__${sDialogEls[i]}`)
    }

    this._buildDateDialog(this._sDialog.sDate)
    this._buildTimeDialog(this._sDialog.sDate)
  }

  on (type, fn) {
    this._listeners[type] = this._listeners[type] || []
    this._listeners[type].push(fn)    
  }

  fire (type, data) {
    if (this._listeners[type]) {
      this._listeners[type].forEach((fn) => {
        fn(data)
      })
    }
  }

  /**
  * [time to get or set the current picker's moment]
  *
  * @method time
  *
  */
  get time () {
    return this._init
  }

  set time (m) {
    if (m) {
      this._init = m
    }
  }

  /**
  * [hide hide the dialog]
  *
  * @method hide
  *
  */
  hide () {
    this._selectDialog()
    this._hideDialog()
  }

  /**
  * [show show the dialog]
  *
  * @method show
  *
  */
  show () {
    this._selectDialog()
    this._showDialog()
  }

  /**
  * [isOpen check if current Picker is open]
  *
  * @method isOpen
  *
  */
  isOpen () {
    this._selectDialog()

    return !!mdDateTimePicker.dialog.state
  }

  /**
  * [isCloses check if current Picker is closed]
  *
  * @method isClosed
  *
  */
  isClosed () {
    this._selectDialog()

    return !mdDateTimePicker.dialog.state
  }

  /**
  * [toggle toggle the dialog's between the visible and invisible state]
  *
  * @method toggle
  *
  */
  toggle () {
    this._selectDialog()
    // work according to the current state of the dialog
    if (mdDateTimePicker.dialog.state) {
      this.hide()
    } else {
      this.show()
    }
  }

  /**
  * [toggle toggle the dialog's between the visible and invisible state]
  *
  * @method toggle
  *
  */
  toggleType () {
    this._type = this._type == 'date'? 'time': 'date'

    if (this._type == 'date') {
      mdDateTimePicker.dialog.view = false
      this._switchToDateView(this._sDialog.title, this)
    }
    else {    
      this._switchToTimeView(this)
    }

    this._selectDialog()

    this._sDialog.picker.classList.remove('mddtp-picker--date')
    this._sDialog.picker.classList.remove('mddtp-picker--time')
    this._sDialog.picker.classList.add('mddtp-picker--'+this._type)
  }

  /**
  * [dialog getter and setter for _dialog value]
  *
  * @method dialog
  *
  * @return {_dialog} [static or prototype value for the _dialog of the component]
  */
  static get dialog () {
    return mdDateTimePicker._dialog
  }

  // noinspection JSAnnotator
  static set dialog (value) {
    mdDateTimePicker._dialog = value
  }

  _selectDialog () {
    // now do what you normally would do
    this._sDialog.picker = document.getElementById(`mddtp-picker`)
  }

  /**
  * [_showDialog make the dialog visible with animation]
  *
  * @method _showDialog
  *
  */
  _showDialog () {
    const me = this
    const zoomIn = 'zoomIn'
    this._type = 'date'
    mdDateTimePicker.dialog.view = false
    this._switchToDateView(this._sDialog.title, this)
    mdDateTimePicker.dialog.state = true
    this._sDialog.picker.classList.remove('mddtp-picker--date')
    this._sDialog.picker.classList.remove('mddtp-picker--time')
    this._sDialog.picker.classList.add('mddtp-picker--'+this._type)
    this._sDialog.picker.classList.remove('mddtp-picker--inactive')
    this._sDialog.picker.classList.add(zoomIn)
    // if the dialog is forced into portrait mode
    if (this._orientation === 'PORTRAIT') {
      this._sDialog.picker.classList.add('mddtp-picker--portrait')
    }
    setTimeout(() => {
      me._sDialog.picker.classList.remove(zoomIn)
    }, 300)
  }

  /**
  * [_hideDialog make the dialog invisible with animation]
  *
  * @method _hideDialog
  *
  */
  _hideDialog () {
    const me = this

    mdDateTimePicker.dialog.state = false
    mdDateTimePicker.dialog.view = true
    this._sDialog.picker.classList.add('zoomOut')

    setTimeout(() => {
      me._sDialog.picker.classList.remove('zoomOut')
      me._sDialog.picker.classList.add('mddtp-picker--inactive')
    }, 300)
  }

  /**
  * [_buildDialog make the dialog elements and add them to the document]
  *
  * @method _buildDateDialog
  *
  */
  _buildDialog () {
    const type = this._type
    const docfrag = document.createDocumentFragment()
    // outer most container of the picker
    const container = document.createElement('div')
    // header container of the picker
    const header = document.createElement('div')
    const header_header = document.createElement('div')
    // body container of the picker
    const body = document.createElement('div')
    // action elements container
    const action = document.createElement('div')
    const cancel = document.createElement('button')
    const ok = document.createElement('button')
    // ... add properties to them
    container.id = `mddtp-picker`
    container.classList.add('mddtp-picker')
    container.classList.add('mddtp-picker--inactive')
    container.classList.add('animated')
    this._addId(header, 'header')
    this._addClass(header, 'header')
    // add header to container
    container.appendChild(header)

    this._addId(header_header, 'header_header')
    header.appendChild(header_header)

    this._addClass(body, 'body')
    body.appendChild(action)
    // add body to container
    container.appendChild(body)
    // add stuff to header and body according to dialog type

    function buildDate() {
      const title = document.createElement('div')
      const titleDay = document.createElement('div')
      const titleMonth = document.createElement('div')
      const viewHolder = document.createElement('div')
      const views = document.createElement('ul')
      const previous = document.createElement('li')
      const current = document.createElement('li')
      const next = document.createElement('li')
      const left = document.createElement('i')
      const right = document.createElement('i')
      const years = document.createElement('ul')
      // inside header
      // adding properties to them
      this._addId(title, 'title')
      this._addClass(title, 'title', ['mddtp-picker__color--active'])
      this._addClass(title, 'date-title')
      this._addId(titleDay, 'titleDay')
      this._addId(titleMonth, 'titleMonth')
      // add title stuff to it
      title.appendChild(titleMonth)
      title.appendChild(titleDay)
      // add them to header
      header.appendChild(title)
      // inside body
      // inside viewHolder
      this._addId(viewHolder, 'viewHolder')
      this._addClass(viewHolder, 'viewHolder', ['animated'])
      this._addClass(views, 'views')
      this._addId(previous, 'previous')
      previous.classList.add('mddtp-picker__view')
      this._addId(current, 'current')
      current.classList.add('mddtp-picker__view')
      this._addId(next, 'next')
      next.classList.add('mddtp-picker__view')
      // fill the views
      this._addView(previous)
      this._addView(current)
      this._addView(next)
      // add them
      viewHolder.appendChild(views)
      views.appendChild(previous)
      views.appendChild(current)
      views.appendChild(next)
      // inside body again
      this._addId(left, 'left')
      left.classList.add('ion')
      left.classList.add('ion-ios-arrow-left')
      this._addClass(left, 'left')

      this._addId(right, 'right')
      right.classList.add('ion')
      right.classList.add('ion-ios-arrow-right')
      this._addClass(right, 'right')

      this._addId(years, 'years')
      this._addClass(years, 'years', ['mddtp-picker__years--invisible', 'animated'])
      // add them to body
      body.appendChild(viewHolder)
      body.appendChild(left)
      body.appendChild(right)
      body.appendChild(years)
    }

    function buildTime() {    

      const title = document.createElement('div')
      const hour = document.createElement('span')
      const span = document.createElement('span')
      const minute = document.createElement('span')
      const subtitle = document.createElement('div')
      const AM = document.createElement('div')
      const PM = document.createElement('div')
      const circularHolder = document.createElement('div')
      const hneedle = document.createElement('div')
      const mneedle = document.createElement('div')
      const hline = document.createElement('span')
      const hcircle = document.createElement('span')
      const mline = document.createElement('span')
      const mcircle = document.createElement('span')
      const minuteView = document.createElement('div')
      // const fakeNeedle = document.createElement('div')
      const hourView = document.createElement('div')
      // add properties to them
      // inside header
      this._addId(title, 'title')
      this._addClass(title, 'title')
      this._addClass(title, 'time-title')
      this._addId(hour, 'hour')
      hour.classList.add('mddtp-picker__color--active')
      span.textContent = ':'
      this._addId(span, 'dotSpan')
      span.setAttribute('style', 'display: none')
      this._addId(minute, 'minute')
      this._addId(subtitle, 'subtitle')
      this._addClass(subtitle, 'subtitle')
      this._addClass(subtitle, 'time-subtitle')
      subtitle.setAttribute('style', 'display: none')
      this._addClass(AM, 'am_pm')
      this._addClass(PM, 'am_pm')
      this._addId(AM, 'AM')
      // AM.textContent = 'AM'
      // Change to 'AM' to Locale Meridiem
      AM.textContent = moment().localeData().meridiem(1, 1, true)
      this._addId(PM, 'PM')
      // PM.textContent = 'PM'
      // Change to 'PM' to Locale Meridiem
      PM.textContent = moment().localeData().meridiem(13, 1, true)
      // add them to title and subtitle
      title.appendChild(hour)
      title.appendChild(span)
      title.appendChild(minute)
      subtitle.appendChild(AM)
      subtitle.appendChild(PM)
      // add them to header
      header.appendChild(title)
      circularHolder.appendChild(subtitle)
      // inside body
      this._addId(circularHolder, 'circularHolder')
      this._addClass(circularHolder, 'circularHolder')
      this._addClass(circularHolder, 'circularHolder__hour')
      this._addId(hneedle, 'hneedle')
      this._addId(mneedle, 'mneedle')
      hneedle.classList.add('mddtp-picker__selection')
      mneedle.classList.add('mddtp-picker__selection')

      this._addClass(hline, 'line')
      this._addId(hcircle, 'circle')
      this._addClass(hcircle, 'circle')

      this._addClass(mline, 'line')
      this._addId(mcircle, 'circle')
      this._addClass(mcircle, 'circle')

      this._addId(minuteView, 'minuteView')
      minuteView.classList.add('mddtp-picker__circularView')
      minuteView.classList.add('mddtp-picker__circularView--hidden')
      // this._addId(fakeNeedle, 'fakeNeedle')
      // fakeNeedle.classList.add('mddtp-picker__circle--fake')
      this._addId(hourView, 'hourView')
      hourView.classList.add('mddtp-picker__circularView')

      // add them to hneedle
      hneedle.appendChild(hline)
      hneedle.appendChild(hcircle)

      // add them to mneedle
      mneedle.appendChild(mline)
      mneedle.appendChild(mcircle)

      // add them to circularHolder
      circularHolder.appendChild(hneedle)
      circularHolder.appendChild(mneedle)
      circularHolder.appendChild(minuteView)
      // circularHolder.appendChild(fakeNeedle)
      circularHolder.appendChild(hourView)
      // add them to body
      body.appendChild(circularHolder)
    }

    buildDate.call(this)
    buildTime.call(this)

    const now = document.createElement('button')
    const timebutton = document.createElement('button')
    const calendarbutton = document.createElement('button')

    this._addId(timebutton, 'timebutton')
    timebutton.classList.add('mddtp-button')
    action.appendChild(timebutton)

    this._addId(now, 'now')
    now.classList.add('mddtp-button')
    action.appendChild(now)

    this._addId(calendarbutton, 'calendarbutton')
    calendarbutton.classList.add('mddtp-button')
    action.appendChild(calendarbutton)

    action.classList.add('mddtp-picker__action')

    if (this._autoClose === true) {
      action.style.display = 'none'
    }

    this._addId(cancel, 'cancel')
    cancel.classList.add('mddtp-button')
    this._addId(ok, 'ok')
    ok.classList.add('mddtp-button')
    // add actions
    action.appendChild(cancel)
    action.appendChild(ok)
    // add actions to body
    body.appendChild(action)
    docfrag.appendChild(container)
    // add the container to the end of body
    document.getElementsByTagName('body').item(0).appendChild(docfrag)
  }

  _setHourActive () {
    this._sDialog.hneedle.classList.add('mddtp-picker__active')
    this._sDialog.mneedle.classList.remove('mddtp-picker__active')
  }

  _setMinuteActive () {
    this._sDialog.hneedle.classList.remove('mddtp-picker__active')
    this._sDialog.mneedle.classList.add('mddtp-picker__active')
  }

  /**
  * [_buildTimeDialog to initiate the date picker dialog usage e.g initDateDialog(moment())]
  * @param  {moment} m [date for today or current]
  */
  _buildTimeDialog (m) {
    const hour = this._sDialog.hour
    const minute = this._sDialog.minute
    const subtitle = this._sDialog.subtitle
    const dotSpan = this._sDialog.dotSpan

    // switch according to 12 hour or 24 hour mode
    // this._mode = true: 24
    // this._mode = false: 12
    if (this._mode) {
      // CHANGED exception case for 24 => 0 issue #57
      let text = parseInt(m.format('H'), 10)
      if (text === 0) {
        text = '00'
      }
      this._fillText(hour, text)
      // add the configurable colon in this mode issue #56
      if (this._colon) {
        dotSpan.removeAttribute('style')
      }
    } else {
      this._fillText(hour, m.format('h'))
      // this._sDialog[m.format('A')].classList.add('mddtp-picker__color--active')
      // Using isPM function for Find PM
      if (m._locale.isPM(m.format('A'))) {
        this._sDialog.PM.classList.add('mddtp-picker__color--active')
      } else {
        this._sDialog.AM.classList.add('mddtp-picker__color--active')
      }
      subtitle.removeAttribute('style')
      dotSpan.removeAttribute('style')
    }
    this._fillText(minute, m.format('mm'))
    this._buildHourView()
    this._buildMinuteView()
    this._attachEventHandlers()
    this._changeM()
    this._addClockEvent()
    this._setButtonText()
    this._setHourActive()
  }

  _buildHourView () {
    const hourView = this._sDialog.hourView
    const hneedle = this._sDialog.hneedle
    const rotate = 'mddtp-picker__cell--rotate-'
    const rotate24 = 'mddtp-picker__cell--rotate24'
    const cell = 'mddtp-picker__cell'
    const docfrag = document.createDocumentFragment()
    // let hourNow
    if (this._mode) {
      const degreeStep = (this._inner24 === true) ? 10 : 5
      // hourNow = parseInt(this._sDialog.tDate.format('H'), 10)
      for (let i = 1, j = degreeStep; i <= 24; i++, j += degreeStep) {
        const div = document.createElement('div')
        const span = document.createElement('span')
        div.classList.add(cell)
        // CHANGED exception case for 24 => 0 issue #57
        if (i === 24) {
          span.textContent = '00'
        } else {
          span.textContent = i
        }

        let position = j
        if (this._inner24 === true && i > 12) {
          position -= 120
          div.classList.add(rotate24)
        }

        div.classList.add(rotate + position)
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
        div.appendChild(span)
        docfrag.appendChild(div)
      }
    } else {
      // hourNow = parseInt(this._sDialog.tDate.format('h'), 10)
      for (let i = 1, j = 10; i <= 12; i++, j += 10) {
        const div = document.createElement('div')
        const span = document.createElement('span')
        div.classList.add(cell)
        span.textContent = i
        div.classList.add(rotate + j)
        // if (hourNow === i) {
        //   div.id = hour
        //   div.classList.add(selected)
        //   hneedle.classList.add(rotate + j)
        // }
        div.appendChild(span)
        docfrag.appendChild(div)
      }
    }
    // empty the hours
    while (hourView.lastChild) {
      hourView.removeChild(hourView.lastChild)
    }
    // set inner html accordingly
    hourView.appendChild(docfrag)
  }

  _buildMinuteView () {
    const minuteView = this._sDialog.minuteView
    let minuteNow = parseInt(this._sDialog.tDate.format('m'), 10)
    // const mneedle = this._sDialog.mneedle
    // const sMinute = 'mddtp-minute__selected'
    // const selected = 'mddtp-picker__cell--selected'
    const rotate = 'mddtp-picker__cell--rotate-'
    const cell = 'mddtp-picker__cell'
    const docfrag = document.createDocumentFragment()
    for (let i = 5, j = 10; i <= 60; i += 5, j += 10) {
      const div = document.createElement('div')
      const span = document.createElement('span')
      div.classList.add(cell)
      if (i === 60) {
        span.textContent = this._numWithZero(0)
      } else {
        span.textContent = this._numWithZero(i)
      }
      if (minuteNow === 0) {
        minuteNow = 60
      }
      div.classList.add(rotate + j)
      // (minuteNow === 1 && i === 60) for corner case highlight 00 at 01
      // if ((minuteNow === i) || (minuteNow - 1 === i) || (minuteNow + 1 === i) || (minuteNow === 1 && i === 60)) {
      //   div.id = sMinute
      //   div.classList.add(selected)
      // }
      div.appendChild(span)
      docfrag.appendChild(div)
    }
    // empty the hours
    while (minuteView.lastChild) {
      minuteView.removeChild(minuteView.lastChild)
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
    minuteView.appendChild(docfrag)
  }

  /**
  * [initDateDialog to initiate the date picker dialog usage e.g initDateDialog(moment())]
  * @param  {moment} m [date for today or current]
  */
  _buildDateDialog (m) {
    this._updateHeader(m)
    this._buildYear()
    this._buildViewHolder()
    this._attachEventHandlers()
    this._changeMonth()
    // this._switchToView(this._sDialog.title)
    this._setButtonText()
  }

  _buildViewHolder () {
    let m = this._sDialog.tDate
    const current = this._sDialog.current
    const previous = this._sDialog.previous
    const next = this._sDialog.next
    const past = this._past
    const future = this._future
    if (m.isBefore(past, 'month')) {
      m = past.clone()
    }
    if (m.isAfter(future, 'month')) {
      m = future.clone()
    }
    this._sDialog.tDate = m
    this._buildMonth(current, m)
    this._buildMonth(next, moment(this._getMonth(m, 1)))
    this._buildMonth(previous, moment(this._getMonth(m, -1)))
    this._toMoveMonth()
  }

  _buildMonth (view, m) {
    const displayMonth = m.format('MMMM YYYY')
    // get the .mddtp-picker__month element using innerDivs[0]
    const innerDivs = view.getElementsByTagName('div')
    this._fillText(innerDivs[0], displayMonth)

    innerDivs[0].onclick = this._switchToYearView.bind(this)

    const docfrag = document.createDocumentFragment()
    // get the .mddtp-picker__tr element using innerDivs[3]
    const tr = innerDivs[3]
    const firstDayOfMonth = moment.weekdays(true).indexOf(moment.weekdays(false, moment(m).date(1).day()))
    /*
    * @netTrek - first day of month dependented from moment.locale
    */
    let today = -1
    let selected = -1
    const lastDayOfMonth = parseInt(moment(m).endOf('month').format('D'), 10) + firstDayOfMonth - 1
    let past = firstDayOfMonth
    const cellClass = 'mddtp-picker__cell'
    let future = lastDayOfMonth
    if (moment().isSame(m, 'month')) {
      today = parseInt(moment().format('D'), 10)
      today += firstDayOfMonth - 1
    }
    if (this._past.isSame(m, 'month')) {
      past = parseInt(this._past.format('D'), 10)
      past += firstDayOfMonth - 1
    }
    if (this._future.isSame(m, 'month')) {
      future = parseInt(this._future.format('D'), 10)
      future += firstDayOfMonth - 1
    }
    if (this._sDialog.sDate.isSame(m, 'month')) {
      selected = parseInt(moment(this._sDialog.sDate).format('D'), 10)
      selected += firstDayOfMonth - 1
    }
    for (let i = 0; i < 42; i++) {
      // create cell
      const cell = document.createElement('span')
      const currentDay = i - firstDayOfMonth + 1
      if ((i >= firstDayOfMonth) && (i <= lastDayOfMonth)) {
        if (i > future || i < past) {
          cell.classList.add(`${cellClass}--disabled`)
        } else {
          cell.classList.add(cellClass)
        }
        this._fillText(cell, currentDay)
      }
      if (today === i) {
        cell.classList.add(`${cellClass}--today`)
        this.todaycell = cell
      }
      if (selected === i) {
        cell.classList.add(`${cellClass}--selected`)
        cell.id = 'mddtp-date__selected'
      }
      docfrag.appendChild(cell)
    }
    // empty the tr
    while (tr.lastChild) {
      tr.removeChild(tr.lastChild)
    }
    // set inner html accordingly
    tr.appendChild(docfrag)
    this._addCellClickEvent(tr, this)
  }

  /**
  * [_buildYear Adds year elements]
  *
  * @method _buildYear
  *
  * @return {type}  [description]
  */
  _buildYear () {
    const years = this._sDialog.years
    const currentYear = this._sDialog.tDate.year()
    const docfrag = document.createDocumentFragment()
    const past = this._past.year()
    const future = this._future.year()
    for (let year = past; year <= future; year++) {
      const li = document.createElement('li')
      li.textContent = year
      li.dataset.year = year
      if (year === currentYear) {
        li.id = 'mddtp-date__currentYear'
        li.classList.add('mddtp-picker__li--current')
      }
      docfrag.appendChild(li)
    }
    // empty the years ul
    while (years.lastChild) {
      years.removeChild(years.lastChild)
    }
    // set inner html accordingly
    years.appendChild(docfrag)
    // attach event handler to the ul to get the benefit of event delegation
    this._changeYear(years)
  }

  _updateHeader (m) {
    this._fillText(this._sDialog.header_header, m.format('dddd hh:mm a'))
    this._fillText(this._sDialog.subtitle, m.year())
    this._fillText(this._sDialog.titleDay, m.format('D'))
    this._fillText(this._sDialog.titleMonth, m.format('MMM'))
  }

  _removeRotation(needle) {
    needle.classList.forEach((el) => {
      if (el.indexOf('rotate') !== -1) {
        needle.classList.remove(el)
      }
    })
  }

  /**
   * Points the needle to the correct hour or minute
   */
  _pointNeedle (me, needle) {
    let spoke
    let value

    const circularHolder = this._sDialog.circularHolder

    if (!needle) {
      needle = mdDateTimePicker.dialog.view ? me._sDialog.hneedle: me._sDialog.mneedle
    }

    me._removeRotation(needle)
    
    // minute mode
    if (needle == me._sDialog.mneedle) {
      spoke = 60
      value = me._sDialog.sDate.format('m')
    } else {
      // hour mode
      if (me._mode) {
        spoke = 24
        value = parseInt(me._sDialog.sDate.format('H'), 10)
          // CHANGED exception for 24 => 0 issue #58
        if (value === 0) {
          value = 24
        }
      } else {
        spoke = 12
        value = me._sDialog.sDate.format('h')
      }
    }

    const rotationClass = me._calcRotation(spoke, parseInt(value, 10))
    if (rotationClass) {
      needle.classList.add(rotationClass)
    }
  }

  _switchToHourView () {
    const hourView = this._sDialog.hourView
    const minuteView = this._sDialog.minuteView
    const hour = this._sDialog.hour
    const minute = this._sDialog.minute
    const activeClass = 'mddtp-picker__color--active'
    const hidden = 'mddtp-picker__circularView--hidden'

    // toggle view classes
    hourView.classList.remove(hidden)
    minuteView.classList.remove(hidden)
    minuteView.classList.add(hidden)

    hour.classList.remove(activeClass)
    hour.classList.add(activeClass)
    minute.classList.remove(activeClass)

    mdDateTimePicker.dialog.view = true
    this._setHourActive()
  }

  _switchToMinuteView () {
    const hourView = this._sDialog.hourView
    const minuteView = this._sDialog.minuteView
    const hour = this._sDialog.hour
    const minute = this._sDialog.minute
    const activeClass = 'mddtp-picker__color--active'
    const hidden = 'mddtp-picker__circularView--hidden'

    // toggle view classes
    hourView.classList.remove(hidden)
    hourView.classList.add(hidden)
    minuteView.classList.remove(hidden)

    hour.classList.remove(activeClass)
    minute.classList.remove(activeClass)
    minute.classList.add(activeClass)

    mdDateTimePicker.dialog.view = false
    this._setMinuteActive()
  }

  /**
  * [_switchToTimeView the actual switchToDateView function so that it can be called by other elements as well]
  *
  * @method _switchToTimeView
  *
  * @param  {type}          me [context]
  *
  */
  _switchToTimeView (me) {
    me._switchToHourView()
    me._pointNeedle(me, me._sDialog.hneedle)
    me._pointNeedle(me, me._sDialog.mneedle)
    me._updateHeader(me._sDialog.sDate)
  }


  _switchToYearView () {
    const selectedYear = document.getElementById('mddtp-date__currentYear')
    const years = this._sDialog.years
    const viewHolder = this._sDialog.viewHolder

    if (selectedYear) {
      selectedYear.id = ''
      selectedYear.classList.remove('mddtp-picker__li--current')
    }

    const currentYear = years.querySelector('[data-year="'+this._sDialog.tDate.year()+'"]')

    if (currentYear) {
      currentYear.id = 'mddtp-date__currentYear'
      currentYear.classList.add('mddtp-picker__li--current')
    }

    mdDateTimePicker.dialog.view = true
    viewHolder.classList.add('zoomOut')
    years.classList.remove('mddtp-picker__years--invisible')
    years.classList.add('zoomIn')
    // scroll into the view
    currentYear && currentYear.scrollIntoViewIfNeeded && currentYear.scrollIntoViewIfNeeded()
  }

  /**
  * [_switchToDateView the actual switchToDateView function so that it can be called by other elements as well]
  *
  * @method _switchToDateView
  *
  * @param  {type} el [element to attach event to]
  * @param  {type} me [context]
  *
  */
  _switchToDateView (el, me) {
    el.setAttribute('disabled', '')
    const viewHolder = me._sDialog.viewHolder
    const years = me._sDialog.years
    const subtitle = me._sDialog.subtitle

    mdDateTimePicker.dialog.view = false

    years.classList.add('zoomOut')
    viewHolder.classList.remove('zoomOut')
    viewHolder.classList.add('zoomIn')

    setTimeout(() => {
      years.classList.remove('zoomIn', 'zoomOut')
      years.classList.add('mddtp-picker__years--invisible')
      viewHolder.classList.remove('zoomIn')
    }, 300)


    setTimeout(() => {
      el.removeAttribute('disabled')
    }, 300)
  }

  _addClockEvent () {
    const me = this
    const hourView = this._sDialog.hourView
    const minuteView = this._sDialog.minuteView
    
    // const sClass = 'mddtp-picker__cell--selected'
    hourView.onclick = function (e) {
      // const sHour = 'mddtp-hour__selected'
      // const selectedHour = document.getElementById(sHour)
      let setHour = 0
      let switchToMinute = false

      if (e.target && e.target.nodeName === 'SPAN') {
        if (me._mode) {
          setHour = parseInt(e.target.textContent, 10)
        } else if (me._sDialog.sDate.format('A') === 'AM') {
          setHour = parseInt(e.target.textContent, 10)
        } else {
          setHour = parseInt(e.target.textContent, 10) + 12
        }

        if (me._sDialog.sDate.hour() === setHour) {
          switchToMinute = true
        }

        me._sDialog.sDate.hour(setHour)
        me._sDialog.tDate.hour(setHour)
        // set the display hour
        me._sDialog.hour.textContent = e.target.textContent
        // switch the view
        me._pointNeedle(me)
        me._updateHeader(me._sDialog.sDate)

        if (switchToMinute) {
          me._switchToMinuteView()  
        }
      }
    }

    minuteView.onclick = function (e) {
      // const sMinute = 'mddtp-minute__selected'
      // const selectedMinute = document.getElementById(sMinute)
      let setMinute = 0
      if (e.target && e.target.nodeName === 'SPAN') {
        setMinute = e.target.textContent
        me._sDialog.sDate.minute(setMinute)
        me._sDialog.tDate.minute(setMinute)

        // set the display minute
        me._sDialog.minute.textContent = setMinute
        me._pointNeedle(me)
        me._updateHeader(me._sDialog.sDate)

        if (me._autoClose === true) {
          me._sDialog.ok.onclick()
        }
      }
    }
  }

  _cellClicked (e, currentDate) {
    if (e.target && e.target.nodeName === 'SPAN' && e.target.classList.contains('mddtp-picker__cell')) {
      const day = e.target.textContent
      currentDate = currentDate || this._sDialog.tDate.date(day)

      // if we are in date view, we need to change the selected cell
      if (this._type === 'date') {
        let el = document.getElementById('mddtp-date__selected')
        if (el) {
          el.id = ''
          el.classList.remove('mddtp-picker__cell--selected')
        }

        e.target.classList.add('mddtp-picker__cell--selected')
        e.target.id = 'mddtp-date__selected'
      }

      // update temp date object with the date selected
      this._sDialog.sDate = currentDate.clone()
      this._updateHeader(this._sDialog.sDate)

      if (this._autoClose === true) {
        this._sDialog.ok.onclick()
      }
    }
  }

  _addCellClickEvent (el, me) {
    el.onclick = this._cellClicked.bind(me)
  }

  _toMoveMonth () {
    const m = this._sDialog.tDate
    const left = this._sDialog.left
    const right = this._sDialog.right
    const past = this._past
    const future = this._future

    left.removeAttribute('disabled')
    right.removeAttribute('disabled')
    left.classList.remove('mddtp-button--disabled')
    right.classList.remove('mddtp-button--disabled')

    if (m.isSame(past, 'month')) {
      left.setAttribute('disabled', '')
      left.classList.add('mddtp-button--disabled')
    }
    if (m.isSame(future, 'month')) {
      right.setAttribute('disabled', '')
      right.classList.add('mddtp-button--disabled')
    }
  }

  _changeMonth () {
    const me = this
    const left = this._sDialog.left
    const right = this._sDialog.right
    const mLeftClass = 'mddtp-picker__view--left'
    const mRightClass = 'mddtp-picker__view--right'
    const pause = 'mddtp-picker__view--pause'

    left.onclick = function () {
      moveStep(mRightClass, me._sDialog.previous)
    }

    right.onclick = function () {
      moveStep(mLeftClass, me._sDialog.next)
    }

    function moveStep (aClass, to) {
      /**
      * [stepBack to know if the to step is going back or not]
      *
      * @type {Boolean}
      */
      if (me.movingStep) {
        return
      }

      me.movingStep = true
      let stepBack = false
      let next = me._sDialog.next
      let current = me._sDialog.current
      let previous = me._sDialog.previous
      left.setAttribute('disabled', '')
      right.setAttribute('disabled', '')
      current.classList.add(aClass)
      previous.classList.add(aClass)
      next.classList.add(aClass)
      const clone = to.cloneNode(true)
      let del
      if (to === next) {
        del = previous
        current.parentNode.appendChild(clone)
        next.id = current.id
        current.id = previous.id
        previous = current
        current = next
        next = clone
      } else {
        stepBack = true
        del = next
        previous.id = current.id
        current.id = next.id
        next = current
        current = previous
      }
      setTimeout(() => {
        if (to === previous) {
          current.parentNode.insertBefore(clone, current)
          previous = clone
        }
        // update real values to match these values
        me._sDialog.next = next
        me._sDialog.current = current
        me._sDialog.previous = previous
        current.classList.add(pause)
        next.classList.add(pause)
        previous.classList.add(pause)
        current.classList.remove(aClass)
        next.classList.remove(aClass)
        previous.classList.remove(aClass)
        del.parentNode.removeChild(del)
      }, 300)
      // REVIEW replace below code with requestAnimationFrame
      setTimeout(() => {
        current.classList.remove(pause)
        next.classList.remove(pause)
        previous.classList.remove(pause)
        if (stepBack) {
          me._sDialog.tDate = me._getMonth(me._sDialog.tDate, -1)
        } else {
          me._sDialog.tDate = me._getMonth(me._sDialog.tDate, 1)
        }
        me._buildViewHolder()
      }, 350)
      setTimeout(() => {
        if (!(left.classList.contains('mddtp-button--disabled'))) {
          left.removeAttribute('disabled')
        }
        if (!(right.classList.contains('mddtp-button--disabled'))) {
          right.removeAttribute('disabled')
        }

        me.movingStep = false
      }, 400)
    }
  }

  /**
  * [_changeYear the on click event handler for year]
  *
  * @method _changeYear
  *
  * @param  {type}    el [description]
  *
  */
  _changeYear (el) {
    const me = this
    el.onclick = function (e) {
      if (e.target && e.target.nodeName === 'LI') {
        const selected = document.getElementById('mddtp-date__currentYear')
        // clear previous selected
        selected.id = ''
        selected.classList.remove('mddtp-picker__li--current')
        // add the properties to the newer one
        e.target.id = 'mddtp-date__currentYear'
        e.target.classList.add('mddtp-picker__li--current')
        // switch view
        me._switchToDateView(el, me)
        // set the tdate to it
        me._sDialog.tDate.year(parseInt(e.target.textContent, 10))
        // update the dialog
        me._buildViewHolder()
      }
    }
  }

  /**
  * [_changeM switch between am and pm modes]
  *
  * @method _changeM
  *
  * @return {type} [description]
  */
  _changeM () {
    const me = this
    const AM = this._sDialog.AM
    const PM = this._sDialog.PM

    function toggle() {
      let m = 'AM'
      if (me._sDialog.sDate._locale.isPM(me._sDialog.sDate.format('A'))) {
        m = 'PM'
      }
      if (m === 'AM') {
        me._sDialog.sDate.add(12, 'h')
      }
      else {
        me._sDialog.sDate.subtract(12, 'h')
      }

      AM.classList.toggle('mddtp-picker__color--active')
      PM.classList.toggle('mddtp-picker__color--active')
      me._updateHeader(me._sDialog.sDate)
    }

    AM.onclick = PM.onclick = toggle
  }

  /**
  * [_attachEventHandlers attach event handlers for actions to the date or time picker dialog]
  *
  * @method _attachEventHandlers
  *
  */
  _attachEventHandlers () {
    const me = this
    const timebutton = this._sDialog.timebutton
    const calendarbutton = this._sDialog.calendarbutton
    const now = this._sDialog.now
    const ok = this._sDialog.ok
    const cancel = this._sDialog.cancel
    const onCancel = new CustomEvent('onCancel')
    const onOk = new CustomEvent('onOk')

    if (timebutton) {
      timebutton.onclick = me.toggleType.bind(me)
    }

    if (calendarbutton) {
      calendarbutton.onclick = me.toggleType.bind(me)
    }

    if (now)
    now.onclick = function (e) {
      now.blur()

      // remove the already selected 
      let el = document.getElementById('mddtp-date__selected')

      if (el) {
        el.id = ''
        el.classList.remove('mddtp-picker__cell--selected')
      }

      let m = moment()
      me._sDialog.tDate = me._sDialog.sDate.clone()
      me._sDialog.tDate.day(m.day())
      me._sDialog.tDate.month(m.month())
      me._sDialog.tDate.year(m.year())
      me._buildViewHolder()
      me._cellClicked({target: me.todaycell}, me._sDialog.tDate)
    }

    cancel.onclick = function () {
      me.toggle()
      me.fire('cancel')
    }

    ok.onclick = function () {
      me._init = me._sDialog.sDate
      me.toggle()
      me.fire('ok', me._sDialog.sDate.toDate())
    }
  }

  /**
  * [_setButtonText Set the ok and cancel button text]
  * @method _setButtonText
  */
  _setButtonText () {
    if (this._sDialog.now) this._sDialog.now.textContent = this._now
    if (this._sDialog.timebutton) this._sDialog.timebutton.textContent = this._timebutton
    if (this._sDialog.calendarbutton) this._sDialog.calendarbutton.textContent = this._calendarbutton
    this._sDialog.cancel.textContent = this._cancel
    this._sDialog.ok.textContent = this._ok
  }

  /**
  * [_getMonth get the next or previous month]
  *
  * @method _getMonth
  *
  * @param  {type}  moment [description]
  * @param  {type}  count  [pass -ve values for past months and positive ones for future values]
  *
  * @return {moment}  [returns the relative moment]
  */
  _getMonth (moment, count) {
    let m
    m = moment.clone()
    if (count > 0) {
      return m.add(Math.abs(count), 'M')
    }
    return m.subtract(Math.abs(count), 'M')
  }

  /**
  * [_nearestDivisor gets the nearest number which is divisible by a number]
  *
  * @method _nearestDivisor
  *
  * @param  {int}        number  [number to check]
  * @param  {int}        divided [number to be divided by]
  *
  * @return {int}        [returns -1 if not found]
  */
  _nearestDivisor (number, divided) {
    if (number % divided === 0) {
      return number
    } else if ((number - 1) % divided === 0) {
      return number - 1
    } else if ((number + 1) % divided === 0) {
      return number + 1
    }
    return -1
  }

  /**
  * [_numWithZero returns string number (n) with a prefixed 0 if 0 <= n <= 9]
  *
  * @method _numWithZero
  *
  * @param  {int}     n [description]
  *
  * @return {String}     [description]
  */
  _numWithZero (n) {
    return n > 9 ? `${n}` : `0${n}`
  }

  /**
  * [_fillText fills element with text]
  *
  * @method _fillText
  *
  * @param  {type}  el   [description]
  * @param  {type}  text [description]
  *
  * @return {type}  [description]
  */
  _fillText (el, text) {
    if (el.firstChild) {
      el.firstChild.nodeValue = text
    } else {
      el.appendChild(document.createTextNode(text))
    }
  }

  /**
  * [_addId add id to picker element]
  *
  * @method _addId
  *
  * @param  {type} el [description]
  * @param  {string} id [the id]
  */
  _addId (el, id) {
    el.id = `mddtp__${id}`
  }

  /**
  * [_addClass add the default class to picker element]
  *
  * @method _addClass
  *
  * @param  {type}  el    [description]
  * @param  {type}  class [description]
  * @param  {type}  more [description]
  */
  _addClass (el, aClass, more) {
    el.classList.add(`mddtp-picker__${aClass}`)
    let i = 0
    if (more) {
      i = more.length
      more.reverse()
    }
    while (i--) {
      el.classList.add(more[i])
    }
  }

  /**
  * [_addView add view]
  *
  * @method _addView
  *
  * @param  {type} view [description]
  */
  _addView (view) {
    const month = document.createElement('div')
    const grid = document.createElement('div')
    const th = document.createElement('div')
    const tr = document.createElement('div')
    /**
    * @netTrek - weekday dependented from moment.locale
    */

    const weekDays = moment.weekdaysMin(true).reverse()

    let week = 7
    while (week--) {
      const span = document.createElement('span')
      span.textContent = weekDays[week]
      th.appendChild(span)
    }
    // add properties to them
    this._addClass(month, 'month')
    this._addClass(grid, 'grid')
    this._addClass(th, 'th')
    this._addClass(tr, 'tr')
    // add them to the view
    view.appendChild(month)
    view.appendChild(grid)
    grid.appendChild(th)
    grid.appendChild(tr)
  }

  /**
  * [_calcRotation calculate rotated angle and return the appropriate class for it]
  *
  * @method _calcRotation
  *
  * @param  {int}      spoke [spoke is the spoke count = [12,24,60]]
  *
  * @param  {int}      value [value for the spoke]
  *
  * @return {String}      [appropriate class]
  */
  _calcRotation (spoke, value) {
    // set clocks top and right side value
    if (spoke === 12) {
      value *= 10
    } else if (spoke === 24) {
      value *= 5
    } else {
      value *= 2
    }
    // special case for 00 => 60
    if (spoke === 60 && value === 0) {
      value = 120
    }
    return `mddtp-picker__cell--rotate-${value}`
  }
}

mdDateTimePicker._dialog = {
  view: true,
  state: false
}

export default mdDateTimePicker
