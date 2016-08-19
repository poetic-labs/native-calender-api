const P = require('bluebird');
const moment = require('moment');

class NativeCalendar {
  setup(titlePrefix, errorPrefix) {
    if (window.plugins && window.plugins.calendar) {
      this.calendar = window.plugins.calendar;
    } else {
      console.warn('this package is dependant on the calendar plugin please call setup After it has loaded');
    }
    this.errorPrefix = errorPrefix;
    this.titlePrefix = titlePrefix;
    this.errors = '';
  }

  clearErrors() {
    this.errors = '';
  }

  validDate(date) {
    if (Object.prototype.toString.call(date) === "[object Date]") {
      if (isNaN(d.getTime())) {
        return false;
      }
      else {
        return true;
      }
    }
    return false;
  }

  isValid(event) {
    let valid = true;
    ['location', 'title', 'notes'].forEach((prop) => {
      if (!event[prop]) {
        this.errors += `${this.errorPrefix} ${prop} was not valid.\n`
        valid = false;
      }
      if (typeof(event[prop]) !== 'string') {
        valid = false;
        this.errors += `${this.errorPrefix} ${prop} was not of type string.\n`
      }
    });

    ['startDate', 'endDate'].forEach((prop) => {
      if (!event[prop]) {
        valid = false;
        this.errors += `${this.errorPrefix} ${prop} was not truthy.\n`
      } else if(!this.validDate(event[prop])) {
        valid = false;
        this.errors += `${this.errorPrefix} ${prop} was not a valid date.\n`
      }
    });

    return valid;
  }

  getErrorsAsReject() {
    return new P((resolve, reject) => {
      return reject(new Error(this.errors));
    });
  }

  newEvent(event) {
    if (!this.isValid(event)) { return this.getErrorsAsReject(); }

    return this.asyncCreateEvent(event).then(() => {
      return P.resolve();
    });
  }

  deleteEvent(event) {
    if (!this.isValid(event)) { return this.getErrorsAsReject(); }

    return this.asyncDeleteEvent(job).then(() => {
      return P.resolve();
    });
  }

  convertFindEventToDeleteEvent(
    {
      title = '',
      notes = '',
      location = '',
      startDate = moment().toDate(),
      endDate = moment().toDate(),
    }
  ) {
    return {
      title,
      notes,
      location,
      startDate: this.convertFindDateToJavaScriptDate(startDate),
      endDate: this.convertFindDateToJavaScriptDate(endDate),
    }
  }

  convertFindDateToJavaScriptDate(date) {
    return moment(date, 'YYYY-MM-DD HH:mm:ss').toDate();
  }

  getDefaultBlankObject() {
    return {
      title: '',
      notes: '',
      location: '',
      startDate: moment().toDate(),
      endDate: moment().toDate(),
    };
  }

  asyncCreateEvent(event) {
    if (!this.isValid(event)) { return this.getErrorsAsReject(); }

    return new P((resolve, reject) => {
      const { title, location, notes, startDate, endDate } = event;
      this.calendar.createEvent(title, location, notes, startDate, endDate, resolve, reject);
    });
  }

  asyncCreateEventWithOptions(event, options) {
    if (!this.isValid(event)) { return this.getErrorsAsReject(); }

    return new P((resolve, reject) => {
      const { title, location, notes, startDate, endDate } = event;
      this.calendar.createEventWithOptions(title, location, notes, startDate, endDate, options, resolve, reject);
    });
  }

  asyncCreateEventInteractively(event) {
    if (!this.isValid(event)) { return this.getErrorsAsReject(); }

    return new P((resolve, reject) => {
      const { title, location, notes, startDate, endDate } = event;
      this.calendar.createEventInteractively(title, location, notes, startDate, endDate, resolve, reject);
    });
  }

  asyncCreateEventInteractivelyWithOptions(event, options) {
    if (!this.isValid(event)) { return this.getErrorsAsReject(); }

    return new P((resolve, reject) => {
      const { title, location, notes, startDate, endDate } = event;
      this.calendar.createEventInteractivelyWithOptions(title, location, notes, startDate, endDate, options, resolve, reject);
    });
  }

  asyncFindEvent(event) {
    if (!this.isValid(event)) { return this.getErrorsAsReject(); }

    return new P((resolve, reject) => {
      const { title, location, notes, startDate, endDate } = event;
      this.calendar.findEvent(title, location, notes, startDate, endDate, resolve, reject);
    });
  }

  asyncDeleteEventById(id) {
    return this.asyncFindEventWithOptions(this.getDefaultBlankObject(), { id }).then((events) => {
      const event = this.convertFindEventToDeleteEvent(events[0]);
      if (!this.isValid(event)) { return this.getErrorsAsReject(); }

      return this.asyncDeleteEvent(event);
    });
  }

  asyncFindEventWithOptions(event, options) {
    return new P((resolve, reject) => {
      const { title, location, notes, startDate, endDate } = event;
      this.calendar.findEventWithOptions(title, location, notes, startDate, endDate, options, resolve, reject);
    });
  }

  asyncDeleteEvent(event) {
    return new P((resolve, reject) => {
      const { title, location, notes, startDate, endDate } = event;
      this.calendar.deleteEvent(title, location, notes, startDate, endDate, resolve, reject);
    });
  }

  asyncListCalendars() {
    return new P((resolve, reject) => {
      this.calendar.listCalendars(resolve, reject);
    });
  }

  asyncDeleteEventFromNamedCalendar(event, calendarName) {
    if (!this.isValid(event)) { return this.getErrorsAsReject(); }

    return new P((resolve, reject) => {
      const { title, location, notes, startDate, endDate } = event;
      this.calendar.deleteEventFromNamedCalendar(title, location, notes, startDate, endDate, calendarName, resolve, reject);
    });
  }
}

module.exports = new NativeCalendar();
