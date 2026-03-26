# **Kirana Stock Manager - Project Documentation**

## **1. Introduction**
### **1.1 Overview**
The **Kirana Stock Manager** is a modern, data-driven web application tailored for the unique challenges of Indian Kirana stores (small neighborhood grocery shops). In an era of increasing retail competition, effective inventory management is crucial for profitability. This project aims to digitize manual bookkeeping processes, providing store owners with real-time insights into their stock levels, sales trends, and potential wastage risks. By leveraging advanced web technologies and intelligent algorithms, the system empowers small business owners to make informed decisions, minimize losses, and enhance customer satisfaction.

### **1.2 Motivation**
Traditional Kirana stores often struggle with operational inefficiencies due to manual record-keeping. The lack of visibility into stock expiration dates leads to significant food waste, while inaccurate inventory counts result in stockouts during high-demand periods. This project seeks to bridge the technological gap for small retailers, offering a user-friendly solution that automates routine tasks and provides actionable intelligence.

---

## **2. Existing System**
### **2.1 Description**
Currently, most Kirana stores rely on manual methods for inventory management. This typically involves:
*   **Physical Ledgers:** Writing down purchases and sales in paper notebooks or registers.
*   **Memory-Based Tracking:** Store owners relying on their memory to assess stock levels and reorder items.
*   **Ad-hoc Checks:** Physically inspecting shelves to identify low stock or expired items.
*   **Manual Calculations:** Computing profits, losses, and reorder quantities using basic calculators or mental arithmetic.

### **2.2 Disadvantages**
The existing manual system suffers from several critical drawbacks:
1.  **High Error Rate:** Manual data entry is prone to human errors, leading to discrepancies between recorded and actual stock.
2.  **Time-Consuming:** Daily reconciliation of sales and purchases consumes valuable time that could be spent on customer service.
3.  **Lack of Real-Time Visibility:** Owners cannot instantly check stock levels or sales performance without physically auditing the store.
4.  **Stockouts:** Essential items often run out unexpectedly due to improved demand forecasting, resulting in lost sales and customer dissatisfaction.
5.  **Wastage of Perishables:** Without automated expiry tracking, perishable goods (milk, bread, vegetables) often expire on the shelf, leading to direct financial loss.
6.  **Capital Blockage:** Inaccurate demand prediction leads to overstocking of slow-moving items, tying up working capital unnecessarily.
7.  **No Data Analytics:** The absence of historical data analysis prevents owners from identifying seasonal trends or optimizing pricing strategies.

---

## **3. Proposed System**
### **3.1 Description**
The proposed **Kirana Stock Manager** is a comprehensive, cloud-based web application that automates the entire inventory lifecycle. It provides a centralized dashboard for managing products, tracking stock movements (in/out), and monitoring business health. The system integrates predictive analytics to forecast demand and intelligent alerts to prevent stockouts and spoilage.

### **3.2 Advantages**
The proposed system offers significant improvements over traditional methods:
1.  **Real-Time Tracking:** Instant updates on stock levels after every "Stock In" or "Stock Out" transaction.
2.  **Automated Alerts:** proactively notifies the owner when items fall below a defined threshold (Low Stock) or approach their expiry date.
3.  **Data-Driven Decisions:** Provides actionable insights based on historical sales data, helping owners stock the right products at the right time.
4.  **Waste Reduction:** "First Expiry, First Out" (FEFO) logic and markdown suggestions help clear near-expiry stock, minimizing financial loss.
5.  **Efficiency:** Reduces manual bookkeeping time by 80%, allowing owners to focus on growing their business.
6.  **Accessibility:** As a web application, it can be accessed from any device (laptop, tablet, mobile), enabling remote monitoring.
7.  **Scalability:** The architecture supports adding multiple stores or expanding the product catalog without performance degradation.

---

## **4. System Analysis and Design**
### **4.1 Functional Requirements**
*   **User Authentication:** Secure login for store owners and staff.
*   **Product Management:** Add, edit, delete, and categorize products (e.g., Grains, Dairy, Snacks).
*   **Inventory Control:** Record stock intake (purchases) and stock outflow (sales).
*   **Dashboard:** Visual summary of total stock value, low stock items, and daily sales performance.
*   **Reporting:** Generate daily, weekly, and monthly sales reports.
*   **Search & Filter:** Quickly locate products by name, category, or barcode.

### **4.2 Non-Functional Requirements**
*   **Performance:** The system should load the dashboard in under 2 seconds.
*   **Reliability:** 99.9% uptime to ensure business continuity.
*   **Security:** Data encryption for user credentials and sensitive business information.
*   **Usability:** Intuitive interface designed for users with minimal technical expertise.
*   **Responsiveness:** seamless experience across desktop and mobile devices.

---

## **5. Technology Stack**
The project utilizes a robust and modern **Full Stack** architecture to ensure performance, maintainability, and scalability.

### **5.1 Frontend (Client-Side)**
*   **Framework:** **Next.js 14+ (App Router)** - A React framework that enables server-side rendering (SSR) and static site generation (SSG) for fast page loads and SEO optimization.
*   **Language:** **TypeScript** - Adds static typing to JavaScript, reducing runtime errors and improving code quality.
*   **Styling:** **Tailwind CSS** - A utility-first CSS framework for rapid UI development and consistent design.
*   **Component Library:** **Shadcn/UI & Radix UI** - Provides accessible, unstyled components that can be customized to match the "Premium Light Mode" aesthetic.
*   **Icons:** **Lucide React** - A lightweight and consistent icon set.
*   **State Management:** **React Context API / Zustand** - Efficiently manages global state (current user, cart, theme).

### **5.2 Backend (Server-Side)**
*   **Runtime:** **Node.js** - Provides a scalable, event-driven environment for server-side logic.
*   **API Framework:** **Next.js API Routes / Server Actions** - Allows seamless integration of backend logic within the Next.js application, eliminating the need for a separate backend server.
*   **Authentication:** **NextAuth.js (Auth.js)** - Handles secure authentication flows (OAuth, Credentials) and session management.
*   **Validation:** **Zod** - A schema declaration and validation library to ensure data integrity at the API level.

### **5.3 Database**
*   **Database:** **PostgreSQL** or **MongoDB** -
    *   *PostgreSQL (Relational):* Ideal for structured data like transactions, user roles, and product relationships.
    *   *MongoDB (NoSQL):* Flexible schema suitable for products with varying attributes.
*   **ORM (Object-Relational Mapping):** **Prisma** - Ensures type-safe database access and simplifies complex queries.

### **5.4 Machine Learning & Analytics (Future Scope)**
*   **Language:** **Python** - The standard language for data science and ML.
*   **Framework:** **FastAPI / Flask** - Lightweight frameworks to serve ML models as microservices.
*   **Libraries:** **Scikit-learn, Pandas, NumPy** - For data processing and implementing forecasting algorithms.

---

## **6. Algorithms & Intelligence**
### **6.1 Demand Forecasting (Future Prediction)**
To optimize inventory levels, the system incorporates predictive analytics using **Time Series Analysis**.

#### **Algorithm Overview: ARIMA / Prophet**
*   **ARIMA (AutoRegressive Integrated Moving Average):** A statistical model that uses past values to predict future trends. It is effective for capturing standard sales patterns.
*   **Facebook Prophet:** Designed for handling seasonality (e.g., usage spikes during festivals) and missing data points, making it robust for retail scenarios.

#### **Prediction Workflow:**
1.  **Data Collection:** Aggregate daily sales data ($S_t$) for each product $P$.
2.  **Preprocessing:** Handle missing values and normalize data to account for store closures or stockouts.
3.  **Trend Component ($T_t$):** Isolate the long-term direction of sales (increasing/decreasing).
4.  **Seasonal Component ($S_t$):** Identify recurring patterns (e.g., higher milk sales on weekends).
5.  **Output:** Forecasted demand ($D_{future}$) for day $t+1$ to $t+30$.
6.  **Action:** Generate a "Recommended Order Quantity" ($Q_{order} = D_{future} - CurrentStock$).

### **6.2 Smart Waste Management (Dynamic Markdown)**
To mitigate losses from perishable goods, the system employs a **Dynamic Pricing Algorithm**.

#### **Algorithm Overview: Linear Decay Model**
This algorithm calculates the optimal discount price to incentivize sales before a product expires. It aims to maximize revenue recovery rather than total loss.

#### **Mathematical Model:**
Let:
*   $P_{base}$ = Original Selling Price
*   $D_{expiry}$ = Days remaining until expiry
*   $D_{threshold}$ = Threshold days to start discounting (e.g., 3 days)
*   $k$ = Decay constant (aggressive for highly perishable items like milk, moderate for bread)

**If** $D_{expiry} \le D_{threshold}$:
$$ P_{new} = P_{base} \times \left( 1 - \frac{k}{D_{expiry} + 1} \right) $$

**Logic:**
1.  The discount increases as the expiry date approaches.
2.  On the final day ($D_{expiry} = 0$), the price is minimal to ensure clearance.
3.  **Example:** A bread packet ($P_{base} = ₹40$, $k=0.5$).
    *   3 days left: $P_{new} \approx ₹35$ (12% off).
    *   1 day left: $P_{new} \approx ₹20$ (50% off).

---

## **7. Implementation Details**
### **7.1 Database Schema (Proposed)**
*   **Users:** `id`, `name`, `email`, `role` (Owner/Staff), `password_hash`.
*   **Products:** `id`, `name`, `category`, `barcode`, `mrp`, `cost_price`, `stock_quantity`, `unit` (kg/lit/pcs), `reorder_level`.
*   **Batches:** `id`, `product_id`, `expiry_date`, `quantity`, `purchase_date`.
*   **Transactions:** `id`, `type` (IN/OUT), `product_id`, `quantity`, `total_amount`, `timestamp`, `user_id`.

### **7.2 Dashboard Layout**
*   **Header:** Navigation, User Profile, Notifications.
*   **Overview Cards:**
    *   *Total Stock Value:* (Sum of `stock_quantity` * `cost_price`).
    *   *Low Stock Alerts:* Count of products where `stock_quantity` < `reorder_level`.
    *   *Expiring Soon:* Count of batches where `expiry_date` < (Today + 7 days).
*   **Main Chart:** Weekly Sales vs. Purchases (Bar Chart).
*   **Recent Activity:** List of last 5 transactions.

---

## **8. Conclusion and Future Scope**
The **Kirana Stock Manager** addresses the critical need for digitalization in the unorganized retail sector. By replacing manual guesswork with data-driven precision, it protects store owners from preventable losses and positions them for growth.

**Future Enhancements:**
*   **Supplier Integration:** Automatically generate purchase orders and email them to suppliers.
*   **Customer Loyalty:** Track customer phone numbers and offer loyalty points for repeat purchases.
*   **Mobile App:** Develop a native mobile application using React Native for barcode scanning via camera.
*   **AI Chatbot:** An LLM-powered assistant to answer queries like "How much rice did we sell last Diwali?"

---

## **9. References**
1.  Next.js Documentation: [https://nextjs.org/docs](https://nextjs.org/docs)
2.  Tailwind CSS Documentation: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
3.  "Forecasting: Principles and Practice" by Rob J Hyndman and George Athanasopoulos.
4.  Prisma ORM Guide: [https://www.prisma.io/docs](https://www.prisma.io/docs)
