const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const ObjectID = require('bson').ObjectID;

require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(bodyParser.urlencoded({ extended: false }))


let userData = [
  {
    "username": "lionel", "_id": "6352c68e79f94b6452b5d95d"
  },
  { "username": "iniesta", "_id": "6352c68e79f94b6452b5d95e" }

]
let exerciseData = [
  { "_id": "6352c68e79f94b6452b5d95d", "username": "lionel", "date": "Sun Aug 20 2016", "duration": 15, "description": "correr" },
  { "_id": "6352c68e79f94b6452b5d95d", "username": "lionel", "date": "Sun Aug 20 2017", "duration": 15, "description": "nadar" },
  { "_id": "6352c68e79f94b6452b5d95d", "username": "lionel", "date": "Sun Aug 20 2018", "duration": 15, "description": "dormir" },
  { "_id": "6352c68e79f94b6452b5d95e", "username": "iniesta", "date": "Sun Aug 20 2016", "duration": 15, "description": "correr" }
]
const isUserNameInData = (userName) => {
  return userData.find(user => user.username == userName) !== undefined
}
const isIdInUserData = (id) => {
  return userData.find(user => user._id == id) !== undefined
}
const getUserNamefromId = (id) => {
  return userData.find(user => user._id == id).username
}
const getExercisesFromId = (id) => {
  return exerciseData.filter(item => item._id == id)
}
app.post('/api/users', (req, res) => {
  const userName = req.body.username
  console.log("No estaa");
  const object = {
    username: userName,
    _id: new ObjectID().toString()
  }
  userData.push(object)
  console.log(userData);
  res.send(object)
}
)

app.post('/api/users/:_id/exercises', (req, res) => {
  const id = req.params._id
  console.log(id);
  console.log(getUserNamefromId(id));
  if (isIdInUserData(req.params._id)) {
    const object = {
      _id: id,
      username: getUserNamefromId(id),
      date: new Date(req.body.date).toDateString(),
      duration: +req.body.duration,
      description: req.body.description,
    }
    exerciseData.push(object)
    console.log(object);
    res.send(object)
  }
})

app.get('/api/users/:_id/logs', (req, res) => {

  const limit = req.query.limit
  const forQuery = req.query.for
  const toQuery = req.query.to

  const id = req.params._id
  const exercises = getExercisesFromId(id)
  let logs = []
  exercises.map(item => {
    logs.push({
      description: item.description,
      duration: item.duration,
      date: item.date
    })
  })

  if (forQuery !== undefined) {
    const forDate = new Date(forQuery)
    logs = logs.filter(item => new Date(item.date) > forDate)
  }
  if (toQuery !== undefined) {
    const toDate = new Date(toQuery)
    logs = logs.filter(item => new Date(item.date) > toDate)
  }

  if (limit == !undefined && limit < logs.length) {
    logs = logs.slice(0, limit)
  }
  const object = {
    userName: getUserNamefromId(id),
    count: logs.length,
    _id: id,
    log: logs
  }
  console.log(req.query);

  res.send(object)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
