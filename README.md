# Task Api Demo

>  A ES6 CRUD api
## Build Setup
```sh
# Run develop environment
$ git clone https://github.com/riclara/tasks.git # or clone your own fork
$ cd tasks
$ npm install
$ npm run dev
```
Your app should now be running on [localhost:8000](http://localhost:8000/).

## Tests
```sh
# Run Tests
$ npm test
```

## Api Examples

## User

### Get token
```sh
curl -X POST \
  http://localhost:8000/login \
  -H 'Content-Type: application/json' \
  -d '{

	"email": "test@email.com",
	"password": "test123"

}'
```

### Create User
```sh 
curl -X POST \
  http://localhost:8000/user \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1Ni...' \
  -H 'Content-Type: application/json' \
  -d '{
	"firstName": "Juan",
	"lastName": "Lara",
	"email": "juan@gmail.com",
	"password": "test123",
	"role": "staff"
}'
```

### Update User
```sh
curl -X PUT \
  http://localhost:8000/user/2 \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsIn...' \
  -H 'Content-Type: application/json' \
  -d '{
	"firstName": "Juan1"
}'
```

### Get User
```sh
curl -X GET \
  http://localhost:8000/user/1 \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cC...' \
  -H 'Content-Type: application/json'
```

### Delete User
```sh
curl -X DELETE \
  http://localhost:8000/user/2 \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsI...' \
  -H 'Content-Type: application/json'
```

## Task

### Create Task
```sh 
curl -X POST \
  http://localhost:8000/task \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1Ni...' \
  -H 'Content-Type: application/json' \
  -d '{
	"user_id": 1,
	"description": "some desc admint task",
	"closed": false
}'
```

### Update Task
```sh
curl -X PUT \
  http://localhost:8000/task/1 \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsIn...' \
  -H 'Content-Type: application/json' \
  -d '{
	"closed": true
}'
```

### Get Task
```sh
curl -X GET \
  http://localhost:8000/task/1 \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cC...' \
  -H 'Content-Type: application/json'
```

### Delete Task
```sh
curl -X DELETE \
  http://localhost:8000/task/1 \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsI...' \
  -H 'Content-Type: application/json'
```
