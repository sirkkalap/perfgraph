express = require "express"
http    = require "http"
path    = require "path"
samples = require "./server/samples"
pull    = require "./server/pull"

app     = express()

app.configure ->
  app.set "port", process.env.PORT or 3000
  app.set "host", process.env.IP or "0.0.0.0"
  app.use express.favicon()
  app.use express.logger("dev")
  app.use express.bodyParser() # Parse post-request body
  app.use express.methodOverride() # http://stackoverflow.com/questions/8378338/what-does-connect-js-methodoverride-do
  app.use app.router
  app.use express.static(path.join(__dirname, "public"))

  # Catch-all rule to handle reloads with client-side routing
  app.use (req, res) -> res.sendfile path.join(__dirname, "public/index.html")

app.configure "development", ->
  app.use express.errorHandler()

app.get "/response-time-trend/:testCaseId", ({params: {testCaseId}}, res) ->
  samples.responseTimeTrendInBuckets(testCaseId)
    .then((trend) -> res.send trend)
    .done()

app.get "/error-trend/:testCase", ({params: {testCaseId}}, res) ->
  samples.errorTrend(testCaseId)
    .then((trend) -> res.send trend)
    .done()

app.get "/reports/:testCaseId/:build.json", ({params: {testCaseId, build}}, res) ->
  samples.report(testCaseId, build)
    .then((report) -> res.send report)
    .done()

app.get "/process-builds", (req, res) ->
  pull.processTestResults()
    .then((status) -> res.send 200)
    .done()

http.createServer(app).listen app.get("port"), app.get("host"), ->
  console.log "Express server listening on port #{app.get("port")}"

# Fetch new results from Jenkins periodically
setInterval (() -> pull.processTestResults().done()), 5 * 60000
