const http = require("http");
const fs = require("fs");
const mime = require("mime");
const dir = "public/";
const port = 3000;

let tasks = [];

const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  }
});

const handleGet = function (request, response) {
  const filename = dir + (request.url === "/" ? "index.html" : request.url.slice(1));

  sendFile(response, filename);
};

const handlePost = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const taskData = JSON.parse(dataString);

    if (taskData.type === "add") {
      addTask(taskData);
    } else if (taskData.type === "delete") {
      deleteTask(taskData.id);
    }

    response.writeHead(200, "OK", { "Content-Type": "application/json" });
    response.end(JSON.stringify(tasks));
  });
};

function addTask(taskData) {
  const deadline = calculateDeadline(taskData.creationDate, taskData.priority);
  taskData.deadline = deadline;
  tasks.push(taskData);
}

function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
}

function calculateDeadline(creationDate, priority) {
  // Example of calculating deadline
  const date = new Date(creationDate);
  date.setDate(date.getDate() + (priority === "High" ? 5 : 10));
  return date.toISOString().split('T')[0];
}

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    if (err === null) {
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
    } else {
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

server.listen(process.env.PORT || port);
