// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: swimmer;
const h=5
const w = new ListWidget()
w.backgroundColor=new Color("#222222")

// cal scraper
let tdy = new Date()
let fourDaysAgo = new Date()
let fortnightFromNow = new Date()
fourDaysAgo.setDate(tdy.getDate()-4)
fourDaysAgo.setHours(0,0,0,0)
fortnightFromNow.setDate(tdy.getDate()+14)
cal = await Calendar.forEvents("http://www.CALENDARLINK")
var allevents = await CalendarEvent.between(fourDaysAgo, fortnightFromNow, cal)
var events = allevents.filter(function(el)
{
  return el.title.substr(0,4) === "Swim" || 
         el.title.substr(0,4) === "Bike" ||
         el.title.substr(0,3) === "Run"
});


// data wrangler
var stotplan = 0
var stotcom = 0
var btotplan = 0
var btotcom = 0
var rtotplan = 0
var rtotcom = 0
var stotplan2 = 0
var btotplan2 = 0
var rtotplan2 = 0
var sixDaysAgo = new Date
var fiveDaysAgo = new Date
sixDaysAgo.setDate(tdy.getDate()-6)
sixDaysAgo = formatDate(sixDaysAgo)
fiveDaysAgo.setDate(tdy.getDate()-5)
fiveDaysAgo = formatDate(fiveDaysAgo)
let newArray = new Array
var i
  for (i = 0; i < events.length; i++) {
date = new Date (events[i].startDate)
dateformatted = formatDate(date)
truncnotes = events[i].notes.split("\n",)
let planned = new String (truncnotes.filter(function(el)
{
return el.substr(0,16) === "Distance Planned"
}))
let plannednumbers = Number (planned.match(/\d+\.\d/))  
if (plannednumbers === 0)
 plannednumbers = Number (planned.match(/\d+/))  ;

let completed = new String (truncnotes.filter(function(el)
{
return el.substr(0,15) === "Actual Distance"
}))
let completednumbers = Number (completed.match(/\d+\.\d/))  
if (completednumbers === 0)
 completednumbers = Number (completed.match(/\d+/))  ;
let workouttypestring = new String (truncnotes.filter(function(el)
{
return el.substr(0,12) === "Workout type"
}))
let workouttype = workouttypestring.substring(14,)

newArray.push({dte:dateformatted, type:workouttype, pln:plannednumbers, cmp:completednumbers})
  }

// call events for day - 6 
const fileManager = FileManager.iCloud()
const dataPath =  fileManager.documentsDirectory() + "/trainingpeaks.json"
let dataContent
if (fileManager.fileExists(dataPath)) {
fileManager.downloadFileFromiCloud(dataPath)
dataContent = fileManager.readString(dataPath)
dataContent = JSON.parse(dataContent)}
var i
for (i = 0; i < dataContent.length; i++)
{
 if (dataContent[i].dte == sixDaysAgo || dataContent[i].dte == fiveDaysAgo){
 newArray.unshift({dte:dataContent[i].dte, type:dataContent[i].type, pln:dataContent[i].pln, cmp:dataContent[i].cmp})
}
}
const myJSON = JSON.stringify(newArray)
fileManager.writeString(fileManager.documentsDirectory() + "/trainingpeaks.json", myJSON)




// Make widget
w.addImage(getCalendarImage())
w.presentLarge()

Script.setWidget(w)
Script.complete()

function formatDate(d) {
    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}


function getCalendarImage() {
  const width = 200
  const colWidth = width / 7.0



  const context = new DrawContext()
  context.size = new Size(350, (colWidth + 6) * 11)
  context.opaque = false
  context.respectScreenScale = true
  const letterdateoffset = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
  const typeoffset = ["Swim", "Bike", "Run"]

  var i
  for (i = 0; i < 3; i++) {
    drawWeek(context, i + 1, colWidth, function(col, context, x, y, width, height) {        
  var curr = new Date
  if (curr.getDay() == 0) {
      var dateOfFirstDayOfThisWeek = new Date(curr.setDate(curr.getDate() - curr.getDay() - 6))
}
 else {
  var dateOfFirstDayOfThisWeek = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1))
}
      var day = new Date(dateOfFirstDayOfThisWeek.setDate(dateOfFirstDayOfThisWeek.getDate() + col))
      
      const dataKey = formatDate(day);
      let PlanForDay = new Number
      let ComplForDay = new Number
      const textvardate = letterdateoffset[col]    
      var j
      for (j=0; j < newArray.length; j++) {
        if (newArray[j].type == typeoffset[i] && newArray[j].dte == dataKey){
      PlanForDay += newArray[j].pln
      ComplForDay += newArray[j].cmp;
      }
      }

      var ComplColour
      if (PlanForDay > 0 && i===0){
        stotplan += Number(PlanForDay)
      }
      if (ComplForDay > 0 && i===0){
        stotcom += Number(ComplForDay)
      }
      if (PlanForDay > 0 && i===1){
        btotplan += Number(PlanForDay)
      }
      if (ComplForDay > 0 && i===1){
        btotcom += Number(ComplForDay)
      }
      if (PlanForDay > 0 && i===2){
        rtotplan += Number(PlanForDay)
      }
      if (ComplForDay > 0 && i===2){
        rtotcom += Number(ComplForDay)
      }
      if (ComplForDay >= 0.8 * PlanForDay && ComplForDay <= PlanForDay * 1.2 && PlanForDay > 0)
        var ComplColour = "#008000"
        else if (ComplForDay >= 0.5 * PlanForDay && ComplForDay < PlanForDay * 0.8 && ComplForDay > 0)
        var ComplColour = "#ffd700"
        else if (ComplForDay >= 1.2 * PlanForDay && ComplForDay < PlanForDay * 1.5 && ComplForDay > 0)
        var ComplColour = "#ffd700"
        else if (ComplForDay < 0.5 * PlanForDay && ComplForDay > 0 || ComplForDay > PlanForDay * 1.5 && PlanForDay > 0)
        var ComplColour = "#ffa500"
        else if (PlanForDay > 0 && day < tdy)
        var ComplColour = "#FF0000"
        else if (PlanForDay === 0 && ComplForDay > 0)
        var ComplColour = "#696969"
        else {
        var ComplColour = "#000000"
        }

        // planned
      if (PlanForDay > 0 && day >= tdy && ComplForDay === 0) {
        context.setFillColor(new Color("#0198E1"))
        let path = new Path()
        path.addRoundedRect(new Rect(x + 2, y + height - 1, width - 4, 2), 2, 2)
        context.addPath(path)
        context.fillPath()
      }
      
      
      // ellipse
      path = new Path()
        context.setFillColor(new Color(ComplColour))
        path.addEllipse(new Rect(x + 2, y, width - 4, height - 4))

     context.addPath(path)
      context.fillPath()
      
      let font = Font.lightSystemFont(12)
      if (day.getDate() === (new Date).getDate()) {
        font = Font.boldSystemFont(12)
      }
      
      // black
      context.setFillColor(new Color("#000000"))
      path = new Path()
      path.addEllipse(new Rect(x + 4, y + 2, width - 8, height - 8))
      context.addPath(path)
      context.fillPath()
      
      // TEXT
      context.setFont(font)
      context.setTextAlignedCenter()
      context.setTextColor(new Color("#ffffff"))
      if (i === 0) {
      ComplForDay = Number (ComplForDay) / 1000
      PlanForDay = Number (PlanForDay) /1000
    }
      if (ComplForDay > 10)
      {
      ComplForDay = Math.round(ComplForDay)  
      context.drawTextInRect(ComplForDay + "", new Rect(x, y + 5, width, height - 5))
      }
      else if (ComplForDay > 0)
      {
      context.drawTextInRect(ComplForDay + "", new Rect(x, y + 5, width, height - 5))
      }
      else if (PlanForDay > 0)
      {
      font = Font.italicSystemFont(12)
      context.setFont(font)
      context.drawTextInRect(PlanForDay + "", new Rect(x, y + 5, width, height - 5))}
      else 
      {
      context.drawTextInRect(textvardate + "", new Rect(x, y + 5, width, height - 5))}
      font = Font.lightSystemFont(12)
      context.setFont(font)
      }
    )
  }
  
  drawswimlegend(context, 240, colWidth + 6, colWidth)
  drawbikelegend(context, 240, colWidth * 2 + 12, colWidth)
  drawrunlegend(context, 240, colWidth * 3 + 18, colWidth)
  
  font2 = Font.boldSystemFont(15)
  context.setFont(font2)
  context.setTextColor(new Color("#E964A1"))
  context.drawTextInRect("TrainingPeaks - next week", new Rect(0, colWidth * 5 + 6, 250, colWidth))
  context.setTextColor(new Color("#8CD1E8"))
  context.drawTextInRect("TrainingPeaks - this week", new Rect(0, 6, 250, colWidth))

  for (i = 0; i < 3; i++) {
    drawWeek2(context, i + 5, colWidth, function(col, context, x, y, width, height) {        
      var curr = new Date
      curr.setDate(tdy.getDate()+7)
      if(curr.getDay() == 0){
      var dateOfFirstDayOfThisWeek = new Date(curr.setDate(curr.getDate() - curr.getDay() - 6))
}
else {
  var dateOfFirstDayOfThisWeek = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1))
}
      var day = new Date(dateOfFirstDayOfThisWeek.setDate(dateOfFirstDayOfThisWeek.getDate() + col))
      
      const dataKey = formatDate(day);
      let PlanForDay = new Number
      const textvardate = letterdateoffset[col]    
      var j
      for (j=0; j < newArray.length; j++) {
        if (newArray[j].type == typeoffset[i] && newArray[j].dte == dataKey){
      PlanForDay = newArray[j].pln
      }
      }

      var ComplColour
      if (PlanForDay > 0 && i===0){
        stotplan2 += Number(PlanForDay)
      }
      if (PlanForDay > 0 && i===1){
        btotplan2 += Number(PlanForDay)
      }
      if (PlanForDay > 0 && i===2){
        rtotplan2 += Number(PlanForDay)
      }

        var ComplColour = "#000000"

        // planned
      if (PlanForDay > 0) {
        context.setFillColor(new Color("#0198E1"))
        let path = new Path()
        path.addRoundedRect(new Rect(x + 2, y + height - 1, width - 4, 2), 2, 2)
        context.addPath(path)
        context.fillPath()
      }
      
      
      // elipse
      path = new Path()
      context.setFillColor(new Color(ComplColour))
      path.addEllipse(new Rect(x + 3, y + 1, width - 6, height - 6))
      context.addPath(path)
      context.fillPath()
      
      let font = Font.lightSystemFont(12)
      
      // black
      context.setFillColor(new Color("#000000"))
      path = new Path()
      path.addEllipse(new Rect(x + 4, y + 2, width - 8, height - 8))
      context.addPath(path)
      context.fillPath()
      
      // TEXT
      context.setFont(font)
      context.setTextAlignedCenter()
      context.setTextColor(new Color("#ffffff"))
      if (i === 0) {
      PlanForDay = Number (PlanForDay) /1000
    }
      if (PlanForDay > 0)
      {
      font = Font.italicSystemFont(12)
      context.setFont(font)
      context.drawTextInRect(PlanForDay + "", new Rect(x, y + 5, width, height - 5))}
      else 
      {
      context.drawTextInRect(textvardate + "", new Rect(x, y + 5, width, height - 5))}
      font = Font.lightSystemFont(12)
      context.setFont(font)
      }
    )
  }

  drawswimlegend2(context, 240, colWidth * 5 + 36, colWidth)
  drawbikelegend2(context, 240, colWidth * 6 + 42, colWidth)
  drawrunlegend2(context, 240, colWidth * 7 + 48, colWidth)


context.drawTextInRect("🏊🏼‍♂️ ", new Rect(0, colWidth + 12, colWidth, colWidth))
context.drawTextInRect("🚴‍♂️ ", new Rect(0, colWidth * 2 + 18, colWidth, colWidth))
context.drawTextInRect("🏃‍♂️ ", new Rect(0, colWidth * 3 + 24, colWidth, colWidth))
context.drawTextInRect("🏊🏼‍♂️ ", new Rect(0, colWidth * 5 + 36, colWidth, colWidth))
context.drawTextInRect("🚴‍♂️ ", new Rect(0, colWidth * 6 + 42, colWidth, colWidth))
context.drawTextInRect("🏃‍♂️ ", new Rect(0, colWidth * 7 + 48, colWidth, colWidth))

function getWeeksDiff(startDate, endDate) {
  const msInWeek = 1000 * 60 * 60 * 24 * 7;
  const msInDays = 1000 * 60 * 60 * 24
  const weeks = Math.floor(Math.abs(endDate - startDate) / msInWeek);
  if (weeks > 2){
  return weeks + " weeks"
  }
  else
  {
  const days = Math.floor(Math.abs(endDate - startDate) / msInDays)
  return days + " days"
  }
}



  const dataPathRaces =  fileManager.documentsDirectory() + "/trainingpeaks_races.json"
  let dataContentRaces
  if (fileManager.fileExists(dataPathRaces)) {
  fileManager.downloadFileFromiCloud(dataPathRaces)
  dataContentRaces = fileManager.readString(dataPathRaces)
  dataContentRaces = JSON.parse(dataContentRaces)}


context.drawTextInRect("🏁 " + dataContentRaces[0].race, new Rect(0, colWidth * 7.5 + 72, 200, colWidth))
context.drawTextInRect("🗓 " + getWeeksDiff(new Date(dataContentRaces[0].dte), new Date()), new Rect(0, colWidth * 8.5 + 62, 200, colWidth))
context.drawTextInRect("🏁 " + dataContentRaces[1].race, new Rect(0, colWidth * 9 + 72, 200, colWidth))
context.drawTextInRect("🗓 " + getWeeksDiff(new Date(dataContentRaces[1].dte), new Date()), new Rect(0, colWidth * 10 + 62, 200, colWidth)) 
context.drawTextInRect("🏁 " + dataContentRaces[2].race, new Rect(125, colWidth * 7.5 + 72, 200, colWidth))
context.drawTextInRect("🗓 " + getWeeksDiff(new Date(dataContentRaces[2].dte), new Date()), new Rect(125, colWidth * 8.5 + 62, 200, colWidth))
context.drawTextInRect("🏁 " + dataContentRaces[3].race, new Rect(125, colWidth * 9 + 72, 200, colWidth))
context.drawTextInRect("🗓 " + getWeeksDiff(new Date(dataContentRaces[3].dte), new Date()), new Rect(125, colWidth * 10 + 62, 200, colWidth)) 
context.drawTextInRect("🏁 " + dataContentRaces[4].race, new Rect(250, colWidth * 7.5 + 72, 200, colWidth))
context.drawTextInRect("🗓 " + getWeeksDiff(new Date(dataContentRaces[4].dte), new Date()), new Rect(250, colWidth * 8.5 + 62, 200, colWidth))
context.drawTextInRect("🏁 " + dataContentRaces[5].race, new Rect(250, colWidth * 9 + 72, 200, colWidth))
context.drawTextInRect("🗓 " + getWeeksDiff(new Date(dataContentRaces[5].dte), new Date()), new Rect(250, colWidth * 10 + 62, 200, colWidth)) 

  return context.getImage()
}

function drawWeek(context, week, colWidth, callback) {  
  var i
  for (i = 0; i < 7; i++) {
    const x = colWidth * i + 20
    const y = (colWidth + 6) * week
    const width = colWidth
    const height = colWidth
    
    // gray
    context.setFillColor(new Color("#48484b"))
    
    callback(i, context, x, y, width, height)
  }
}

function drawWeek2(context, week, colWidth, callback) {  
  var i
  for (i = 0; i < 7; i++) {
    const x = colWidth * i + 20
    const y = (colWidth + 6) * week
    const width = colWidth
    const height = colWidth
    
    // gray
    context.setFillColor(new Color("#48484b"))
    
    callback(i, context, x, y, width, height)
  }
}

function drawswimlegend(context, x, y, colWidth) {  
  stotcom = Math.round(stotcom)
  context.setFillColor(new Color("#dc7474"))
  context.setTextAlignedLeft()
  context.setTextColor(new Color("#ffffff"))
  context.drawTextInRect("p:" + stotplan + "m c:" + stotcom + "m", new Rect(x, y + 4, 250, colWidth))
}

function drawbikelegend(context, x, y, colWidth) {  
  btotcom = btotcom.toFixed(1)
  context.setFillColor(new Color("#dc7474"))
  context.setTextAlignedLeft()
  context.setTextColor(new Color("#ffffff"))
  context.drawTextInRect("p:" + btotplan + "km c:" + btotcom + "km", new Rect(x, y + 4, 150, colWidth))
}
function drawrunlegend(context, x, y, colWidth) {  
  rtotcom = rtotcom.toFixed(1)
  context.setFillColor(new Color("#dc7474"))
  context.setTextAlignedLeft()
  context.setTextColor(new Color("#ffffff"))
  context.drawTextInRect("p:" + rtotplan + "km c:" + rtotcom + "km", new Rect(x, y + 4, 150, colWidth))
}

function drawswimlegend2(context, x, y, colWidth) {  
  context.setFillColor(new Color("#dc7474"))
  context.setTextAlignedLeft()
  context.setTextColor(new Color("#ffffff"))
  context.drawTextInRect("p:" + stotplan2 + "m", new Rect(x, y + 4, 250, colWidth))
}

function drawbikelegend2(context, x, y, colWidth) {  
  context.setFillColor(new Color("#dc7474"))
  context.setTextAlignedLeft()
  context.setTextColor(new Color("#ffffff"))
  context.drawTextInRect("p:" + btotplan2 + "km", new Rect(x, y + 4, 150, colWidth))
}
function drawrunlegend2(context, x, y, colWidth) {  
  context.setFillColor(new Color("#dc7474"))
  context.setTextAlignedLeft()
  context.setTextColor(new Color("#ffffff"))
  context.drawTextInRect("p:" + rtotplan2 + "km", new Rect(x, y + 4, 150, colWidth))
}

console.log(tdy)
console.log(fourDaysAgo)
console.log(formatDate(fourDaysAgo))
console.log(fiveDaysAgo)
console.log(sixDaysAgo)
