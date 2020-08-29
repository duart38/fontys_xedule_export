function load() {
    if (window["entities"] === undefined ||
        window["entities"].Store._initialized === false) {
        setTimeout(function () { return load(); }, 5000);
    }
    else {
        if(window["entities"].Store == undefined || window["entities"].Store._instances == undefined) setTimeout(function () { return load(); }, 5000);
        else{
            console.log(pushInCalendar(constructEvents()));
        }
    }
}
load();
function generateIcalDate(date) {
    var dateobj = date;
    // [ISO.8601.2004]  -> https://www.geeksforgeeks.org/javascript-date-toisostring-method/
    let isoSTR = dateobj.toISOString(); // 2020-08-28T16:09:17.911Z  (.<num>Z = milisecs)
    let extracted_isoDate = isoSTR.split("T")[0].replace(/-/g, "");
    let extracted_isoTime = isoSTR
      .split("T")[1]
      .replace(/:/g, "")
      .replace(/\.\d*/g, "");
    //19980118T230000 -> 1998-01-18 (yyyy-mm-dd)
    return `${extracted_isoDate}T${extracted_isoTime}`;
}
function constructEvents() {
    var events = []; // this will be populated with the events
    Object.keys(window["entities"].Store._instances.schedule).forEach(function (v) {
        window["entities"].Store._instances.schedule[v].apps.forEach((value) => {
            let icalEvent = `BEGIN:VEVENT
UID:${value.id}
SEQUENCE:0
DTSTAMP:${generateIcalDate(new Date(value.iStart))}
DTSTART:${generateIcalDate(new Date(value.iStart))}
DTEND:${generateIcalDate(new Date(value.iEnd))}
LOCATION:${
                value.attention !== "ONLINE"
                    ? "Fontys Venlo Tegelseweg 255\\, 5912 BG Venlo\\, Netherlands"
                    : "ONLINE"
                }
SUMMARY:${value.name} -> ${value.summary}
CREATED:${generateIcalDate(window["entities"].Store._instances.schedule[v].publicationDate)}
LAST-MODIFIED:${generateIcalDate(new Date())}
END:VEVENT`;
            events.push(icalEvent);
        });
    });
    return events;
}
function pushInCalendar(evs) {
    return `VERSION:2.0
PRODID:-//duartsnel//hackedcal//EN
BEGIN:VCALENDAR
${evs.join("\n")}
END:VCALENDAR`;
}