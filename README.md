# WEBAPP

# Health Check API

This is a simple **Health Check API** that allows monitoring the health of an application instance. The application is built using **Node.js**, **Express**, and **Sequelize** ORM, and it connects to a **MySQL** database.

---

## **Features**
- `/healthz` endpoint for health monitoring.
- Returns appropriate HTTP status codes (`200 OK`, `400 Bad Request`, `503 Service Unavailable`, etc.).
- Auto-creates the database schema using Sequelize.

---

## **Prerequisites**
Make sure the following are installed:
1. **Node.js** (version ≥ 18.x)
2. **MySQL** (version ≥ 5.7 or 8.x)
3. **npm** (Node Package Manager)

---

## **Environment Variables**
Create a `.env` file in the root of the project with the following configuration:
```plaintext
DATABASE_URL=mysql://<username>:<password>@<host>:<port>/<database>
PORT= add port no
```
---

## **Instructions to Clone the Repository**
```
git clone <repository_url>
cd <repository_folder>
```
---

## **Steps to run app**
1.npm install
2. Start server - npm start

## **Steps to test the api
1. Open the terminal 
2. run the commands 
   2.1 curl -X GET http://localhost:8080/api/healthz (gives 200 Ok)
   2.2 Stop the mysql server and run $ curl -vvvv http://localhost:8080/healthz  (gives 503 bad request )
   2.3 curl -vvvv -XPUT http://localhost:8080/healthz ( gives 405 bad request)
   2.4 curl -X GET -H "Content-Type: application/json" -d '{"":""}' http://localhost:8080/api/healthz (gives 400 bad request) 
