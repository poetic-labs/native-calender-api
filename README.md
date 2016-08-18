#Native Calendar
A promise wrapper for [Cordova Calendar Plugin](https://github.com/EddyVerbruggen/Calendar-PhoneGap-Plugin)

Overall goal is to add an easier workflow to the calendar plugin and add some
error checking that doesn't exist in the current plugin.

#Install
```
npm install --save native-calendar-api
```

#Example use:

The original api was callbacks and you couldn't call an operation before the last
operation had finished.  This made handling a large array of events difficult
to manage. Using this api you can now do something like:

```
import CalendarApi from 'native-calendar-api';
import YourLogger from 'some-lib';

CalendarApi.setup('MyApp-', 'Custom Error Prefix:');

function sampleCreateFromArray(events) {
  return events.reduce((curr, next) => {
    return curr.then(() => {
      return CalendarApi.newEvent(next);
    });
  }, P.resolve());
}

sampleCreateFromArray(eventArray)
  .then(() => {
    // execute some cleanup of the events after they have been added
  })
  .catch((err) => {
    YourLogger.log(err);
  });
```

#Class NativeCalendar

##Properties
 - calendar: a reference to the native plugin
 - errors: a collection of errors from the last execution

##Methods

###setup(titlePrefix, errorPrefix) (should be called after plugin is loaded)
 - args:
   titlePrefix - A title prefix specific to your application for searching and
   deleting only events you own. ex 'MyApp-'
   errorPrefix - An error prefix for logging errors giving you a simple search
   string to find all errors in the calendar from your logs.

Initiates the calendar and error properties.
Will console.warn if window.plugin.calendar doesn't exist

###clearErrors()

Resets the error object.  This should be called after the errors have been
consumed.

###validDate(date)
 - args
   date: expected to be a JavaScript date object

 - returns:
   true or false

###isValid(event)
Used internally but can be called direction to valide your event objects

 - args
   event: expected to be a valid event object with the properties
     title: String
     location: String
     notes: String
     startDate: Date
     endDate: Date

 - returns:
   true or false

When this method is called it will return true if all fields are valid on the
event object.  If false is returned it will append the errors to the errors
property.  When used internally the promise will be rejected with the error
messages.

###newEvent(event)
 - args
   event: a valid event object

 - returns:
   promise

In the case that the event is invalid this will be rejected and return an error
object with all the errors.  You can then log this output to your production
logger such as:

```
import CalendarApi from 'native-calendar-api';
import YourLogger from 'some-lib';

CalendarApi.setup('MyApp-', 'Custom Error Prefix:');

const invalidEvent = {};
CalendarApi.newEvent(invalidEvent).catch((err) => {
  YourLogger.log(err);
});
```

###deleteEvent(event)
 - args
   event: a valid event object

 - returns:
   promise

In the case that the event is invalid this will be rejected and return an error
object with all the errors.  You can then log this output to your production
logger such as:

```
import CalendarApi from 'native-calendar-api';
import YourLogger from 'some-lib';

CalendarApi.setup('MyApp-', 'Custom Error Prefix:');

const invalidEvent = {};
CalendarApi.deleteEvent(invalidEvent).catch((err) => {
  YourLogger.log(err);
});
```

###convertFindEventToDeleteEvent()
Meant for internal use but can be used to convert an object returned from a find
in the NativeCalendar to a valid event for deletion.  This is an issue due to
the fact that the plugin returns a string rather than a date object. Be careful
using this as it will always return a valid object meaning if you pass it
nothing you will get a valid Event back initiated to now with a duration of 0

###convertFindDateToJavaScriptDate(date)
Converts a date string returned by the plugin into a valid JavaScript date.
 - args:
   a date string returned by native calendar find method
 - returns:
   a JavaScript Date object

###getDefaultBlankObject()
 - returns:
   an object with all required Event Properties

###asyncCreateEvent(event)
 - args
   event object
 - returns
   a promise with the same error pattern mentioned above

###asyncCreateEventWithOptions(event, options)
 - args
   event object
   options: optional options object explained in cordova plugin docs
 - returns
   a promise with the same error pattern mentioned above

###asyncCreateEventInteractively(event)
 - args
   event object
 - returns
   a promise with the same error pattern mentioned above

###asyncCreateEventInteractivelyWithOptions(event, options)
 - args
   event object
   options: optional options object explained in cordova plugin docs
 - returns
   a promise with the same error pattern mentioned above

###asyncFindEvent(event)
 - args
   event object
 - returns
   a promise with the find result or the same error pattern mentioned above

###asyncDeleteEventById(id)
 - args
   id: the ID of the event to delete
 - returns
   a promise with the same error pattern mentioned above

###asyncFindEventWithOptions(event, options)
 - args
   event object
   options: optional options object explained in cordova plugin docs
 - returns
   a promise with the same error pattern mentioned above

###asyncDeleteEvent(event)
 - args
   event object
 - returns
   a promise with the same error pattern mentioned above

###asyncListCalendars()
 - returns
   a promise with the results or erors

###asyncDeleteEventFromNamedCalendar(event, calendarName)
 - args
   event object
   calendarName: a string of the calendar's name
 - returns
   a promise with the same error pattern mentioned above
