# Poll Application Setup Guide

Welcome to the **Poll Application** project! This guide will help you set up the project on your local machine, covering dependencies, database configuration, Apache Kafka setup, and process management using PM2.

## Prerequisites

Ensure that you have the following tools installed:

- **Node.js** (v20.15.1 or later)
- **PostgreSQL** with **pgAdmin**
- **Apache Kafka** with **Zookeeper**
- **PM2** (for process management)

---

## 1. Apache Kafka with Zookeeper Setup

### Step 1: Download and Install Kafka

To install Apache Kafka, follow this [guide](https://www.geeksforgeeks.org/how-to-install-and-run-apache-kafka-on-windows/). Kafka requires Zookeeper to manage broker configurations and ensure fault tolerance.

1. Download Kafka from the link above.
2. Extract Kafka to a directory on your machine.
3. Follow the guide's instructions to set up Kafka.

### Step 2: Start Zookeeper

Start Zookeeper using:

```bash
zookeeper-server-start.bat config/zookeeper.properties
```

### Step 3: Start Kafka Broker

Once Zookeeper is running, start Kafka:

```bash
kafka-server-start.bat config/server.properties
```

### Step 4: Verify Kafka and Zookeeper

Make sure both Kafka and Zookeeper are running properly by checking their logs.

---

## 2. Node.js Setup

### Step 1: Install Node.js (v20.15.1)

Download Node.js from [here](https://nodejs.org/en) and ensure you are using version **20.15.1** or later. To verify the installation, run:

```bash
node -v
npm -v
```

### Step 2: Install Dependencies

Navigate to the project directory and run:

```bash
npm install
```

This will install all necessary packages, including:

- **express**
- **pg** (PostgreSQL client)
- **kafka-node** (Kafka client)
- **sequelize** (ORM for SQL databases)
- **pg-hstore**
- **dotenv** (environment variables)
- **body-parser**
- **pm2** (process management)

---

## 3. PostgreSQL and pgAdmin Setup

### Step 1: Install PostgreSQL

Download PostgreSQL from [here](https://www.postgresql.org/download/) and install it on your machine. Create a strong password for the `postgres` user.

### Step 2: Install pgAdmin

Download **pgAdmin** from [here](https://www.pgadmin.org/download/) to manage your PostgreSQL databases.

### Step 3: Create a Database

Create a new database using **pgAdmin** or the PostgreSQL CLI:

```sql
CREATE DATABASE polling;
```

---

## 4. Configure Environment Variables

Create a `.env` file in the root of your project and add the following environment variables:

```bash
DATABASE_URL=postgresql://root:root@localhost/polling
KAFKA_HOST=localhost:9092
DB_USERNAME=postgres
DB_PASSWORD=root
DB_DATABASE=polling
DB_HOST=127.0.0.1
DB_DIALECT=postgres
```

---

## 5. Database Configuration

In your `config/config.json`, update the development configuration to match the `.env` variables:

```json
{
  "development": {
    "username": "postgres",
    "password": "root",
    "database": "polling",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

Make sure that the `development` section matches your `.env` file settings.

---

## 6. Running Migrations and Seeders

### Step 1: Run Migrations

To set up your database schema, run:

```bash
npx sequelize-cli db:migrate
```

### Step 2: Run Seeders

To populate the database with initial data, run:

```bash
npx sequelize-cli db:seed:all
```

---

## 7. Running the Application with PM2

### Step 1: Install PM2

Install **PM2** globally for process management:

```bash
npm install -g pm2
```

### Step 2: Start the Application

Start the application using PM2:

```bash
pm2 start npm --name "poll-application" -- start
```

PM2 will keep the application running in the background, ensuring that it survives restarts.

### Step 3: Manage PM2 Processes

Here are some useful PM2 commands:

- **List running processes**: `pm2 list`
- **Stop a process**: `pm2 stop poll-application`
- **Restart a process**: `pm2 restart poll-application`
- **View logs**: `pm2 logs`

---

## 8. API Endpoints

### 1. Create a Poll

**POST** `/polls/create`

Example request body:

```json
{
    "title": "Favorite Country?",
    "options": [
        "India",
        "UK",
        "US",
        "UAE"
    ]
}
```

This endpoint allows you to create a poll with a title and a list of options.

### 2. Cast a Vote

**POST** `/polls/:id/vote`

Example request body:

```json
{
    "email": "user@example.com",
    "option_id": 48
}
```

This endpoint allows users to vote on a specific poll by providing their email and the option they are voting for.

### 3. Get Poll Results

**GET** `/polls/:id/results`

This endpoint returns the results of a specific poll, displaying the number of votes for each option.

### 4. Get Leaderboard

**GET** `/polls/leaderboard`

This endpoint retrieves a leaderboard of polls based on the total number of votes.

---

## 9. Starting Kafka Producer and Consumer

Make sure both Kafka producer and consumer services are running to send and process poll updates.

- **Start Kafka Producer**: Ensure the producer is running to send messages.
- **Start Kafka Consumer**: The consumer should be running to process incoming poll results.

---

## 10. Accessing the Application

Once everything is set up:

1. Start Zookeeper and Kafka.
2. Ensure PostgreSQL is running and the database is configured.
3. Start the Node.js app using PM2.

You can then access the application at `http://localhost:3000`.

---

## 11. Troubleshooting

- **Kafka Issues**: Ensure that Zookeeper is running before starting Kafka.
- **Database Connection Errors**: Double-check your PostgreSQL credentials and `.env` file configuration.
- **PM2 Issues**: Restart PM2 if necessary using `pm2 kill` followed by `pm2 start`.

---

Feel free to reach out if you encounter any issues during the setup process. Happy coding!

---
