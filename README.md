# 🚀 Web3 Authentication & Credential Issuance

This project implements a **secure Web3 authentication flow** using **MetaMask** , Verifiable Credentials (VC), and **JWT-based authorization**. It includes **role-based access control**, an **admin panel**, and **secure API protection**. The backend and frontend are fully **Dockerized**.

---

## 🛠️ Tech Stack

### **Frontend:**

- **React.js** (UI Framework)
- **Axios** (HTTP Client)
- **TypeScript** (Type Safety)
- **ethers.js** (MetaMask Authentication)
- **SWR** (Fetching)
- **react-router-dom** (Routing)
- **TailwindCSS** (Styleing)

### **Backend:**

- **Node.js & Express.js** (Server)
- **MongoDB** (Database)
- **jsonwebtoken (JWT)** (Auth)
- **dotenv** (Environment Variables)
- **ethers.js** (MetaMask Authentication)
- **cors** (Origins policy)
- **mongoose** (DB Connection)
- **cookie-parser** (Get cookies)
- **Docker** (Containerization)

---

## 🔒 **Authentication Flow**

1️⃣ User logs in via **MetaMask**  
2️⃣ The backend verifies the **Ethereum signature**  
3️⃣ A **JWT access token** is issued (expires in **10 seconds**)  
4️⃣ The refresh token is stored in **httpOnly secure cookies** witch is used to generate new acc token after it's expired
5️⃣ The backend **issues a Verifiable Credential (VC) and JWT middleware** for access rights  
6️⃣ The user can view their **VC details** on the frontend. In this case name and meail
7️⃣ API and frontend pages are protected **based on the user's VC role and additional data**

---

##✅ 🐳 **Dockerization & Deployment**

- Backend Deployed on Render and Frontend deployed on Netlify : https://web3-assignment.netlify.app
