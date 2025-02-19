# WEBAPP

# Health Check API
testing take 55

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

## **Install dependencies** 
   Install the required Node.js modules by running:
   bash
   npm i

--- 
## **Start the application**  
   Start the application by running the following command:
   bash
   npm start

---

## **Test the `healthz` API**  
   Use the following **CURL** commands to test the API:

   - **Valid request returning 200 OK**  
     ```bash
     curl -vvvv http://localhost:8080/healthz
     ```
     Expected response: **200 OK**

   - **Unsupported HTTP method returning 405**  
     ```bash
     curl -vvvv -XPUT http://localhost:8080/healthz
     ```
     Expected response: **405 Method Not Allowed**

   - **Invalid request body returning 400**  
     ```bash
     curl -vvvv -X GET -d '{}' -H "Content-Type: application/json" http://localhost:8080/healthz
     ```
     Expected response: *400 Bad Request*

   - **Database connection failure returning 503**
     If the database connection is not established, the endpoint will return:
     *503 Service Unavailable*
    
---
## **Automating Application Setup with Shell Script**
   - **Create a Droplet (VM)**
      1. Login to DigitalOcean → Go to Droplets → Click Create Droplet.
      2. Choose Ubuntu 24.04 LTS as the OS.
      3. Select a Basic Plan (Recommended: 2GB RAM, 1 vCPU).
      4. Choose a Region close to you.
      5. Enable SSH Authentication (if you have an SSH key added).
      6. Click Create Droplet.
    
   - **Connect to the VM**
     ```bash
     ssh root@your_droplet_ip
     ```
     
   - **Upload setup.sh to Ubuntu**
     ```bash
     scp -i ~/.ssh/DigitalOcean setup.sh root@your_droplet_ip:/root/
     ```

   - **Give Execution Permission to setup.sh**
     ```bash
     chmod +x setup.sh
     ```
   - **Upload & Extract app.zip**
     On local machine run:
      ```bash
     scp -i ~/.ssh/DigitalOcean root@your_droplet_ip:/temp/
     ```
   - **Run setup.sh**
     ```bash
     ./setup.sh
     ```
   - **To run the application**
     1. do npm i
     2. run npm start
     3. And follow the curl commands mentioned above
     4. Also change the localhost api and db name if changed in mysql
     
 - **To run test cases on local run command**
      ```bash
      npm install --save-dev jest supertest
      ```      
