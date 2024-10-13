---

# Project Setup Guide

Welcome to the project! This guide will help you set up the necessary tools and dependencies to get the project running on your local machine. Follow the instructions carefully to ensure everything is properly configured.

## Prerequisites

Ensure you have the following tools installed on your system:

- **Node.js**
- **PostgreSQL** and **pgAdmin**
- **Apache Kafka**

## 1. Apache Kafka Setup

### Step 1: Download and Install Kafka

Follow this [guide](https://www.geeksforgeeks.org/how-to-install-and-run-apache-kafka-on-windows/) to download and install Apache Kafka on your system.

1. Download Kafka from the provided link.
2. Set up Kafka by following the step-by-step instructions.
3. Make sure Zookeeper is up and running, then start Kafka.

### Step 2: Verify Kafka Installation

After setting up Kafka, run the following command to ensure Kafka is running:

```bash
kafka-server-start.bat config/server.properties
```

---

## 2. Node.js Setup

### Step 1: Download and Install Node.js

Download Node.js from the official website [here](https://nodejs.org/en) and install it on your system.

To verify the installation, run:

```bash
node -v
npm -v
```

You should see the version of Node.js and npm installed.

---

## 3. PostgreSQL and pgAdmin Setup

### Step 1: Download and Install PostgreSQL

Download PostgreSQL from [this link](https://www.postgresql.org/ftp/pgadmin/pgadmin4/v8.12/windows/) and follow the installation process. During setup, make sure to **create a custom password** for the `postgres` user.

### Step 2: Download and Install pgAdmin

Download pgAdmin from [here](https://www.pgadmin.org/download/) to manage your PostgreSQL database with a graphical interface.

---

## 4. Project Dependencies

After installing Node.js, you can install the required project dependencies by running the following commands in your project directory:

### Step 1: Install Required Packages

```bash
npm install express pg kafka-node websocket body-parser dotenv
npm install sequelize pg pg-hstore
npm install --save-dev sequelize-cli
```

These packages are required for:

- **Express**: Web server framework.
- **pg**: PostgreSQL client for Node.js.
- **kafka-node**: Kafka client for Node.js.
- **websocket**: WebSocket support.
- **body-parser**: Parse incoming request bodies.
- **dotenv**: Load environment variables from `.env`.
- **sequelize**: ORM for SQL databases.
- **pg-hstore**: PostgreSQL-specific datatype for Sequelize.
- **sequelize-cli**: Command line tool for Sequelize.

---

## 5. Environment Variables

Create a `.env` file in the root of your project and add the following environment variables:

```bash
DB_USER=<your_postgres_user>
DB_PASSWORD=<your_postgres_password>
DB_HOST=localhost
DB_PORT=5432
DB_NAME=<your_database_name>
KAFKA_HOST=localhost:9092
```

Make sure to replace placeholders with your actual values.

---

## 6. Running the Application

Once you have set up everything, you can run the application using:

```bash
npm start
```

Make sure Kafka, PostgreSQL, and your environment variables are properly configured.

---

## 7. Additional Notes

- Make sure all the services (Kafka, PostgreSQL) are running before starting the Node.js application.
- For any issues with PostgreSQL, use **pgAdmin** to manage databases.

---

Feel free to reach out if you encounter any issues during setup. Happy coding!

---
