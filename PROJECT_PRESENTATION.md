% Kirana Stock Manager
% An Inventory & Waste Management Solution for Retail
% [Your Name]

# 1. Introduction

## Problem Statement
The unorganized retail sector (Kirana stores) faces major operational challenges:
- **Manual Bookkeeping**: High error rate and time-consuming.
- **Stockouts**: Losing customers due to unpredicted demand.
- **Wastage**: Perishable goods expiring unnoticed (financial loss).
- **No Data Insights**: Decisions based on intuition rather than data.

## Proposed Solution
**Kirana Stock Manager**: A comprehensive web application to:
1.  **Digitize Inventory**: Real-time tracking of Stock In/Out.
2.  **Automate Alerts**: Notify for Low Stock and Near-Expiry items.
3.  **Predict Demand**: Use ML to forecast future stock needs.
4.  **Minimise Waste**: Dynamic pricing to clear aging stock.

---

# 2. System Comparison

## Existing System (Manual)
- **Method**: Pen & Paper ledgers, memory-based.
- **Disadvantages**:
    - Prone to human error.
    - Time intensive daily reconciliation.
    - Reactive (solve problems *after* they happen).
    - No historical data analysis.

## Proposed System (Digital)
- **Method**: Cloud-based Web Application.
- **Advantages**:
    - **Proactive**: Alerts *before* problems occur.
    - **Accurate**: Automated calculations and tracking.
    - **Efficient**: Saves 80% management time.
    - **Intelligent**: Suggests *what* and *when* to buy.

---

# 3. Algorithm & Intelligence

## A. Demand Forecasting (Time Series)
*   **Goal**: Predict future sales to optimize stock levels.
*   **Algorithm**: **ARIMA / Facebook Prophet**.
*   **Process**:
    1.  Analyze historical daily sales data.
    2.  Identify seasonality (e.g., festival spikes).
    3.  Output recommended reorder quantities for next 30 days.

## B. Smart Waste Management (Dynamic Pricing)
*   **Goal**: Sell perishable items before they expire.
*   **Algorithm**: **Linear Decay Model**.
*   **Formula**: $P_{new} = P_{base} \times (1 - \frac{k}{DaysToExpiry})$
*   **Result**: Automatically suggested discounts (e.g., 20% off) as expiry approaches.

---

# 4. Technology Stack

## Frontend (Client-Side)
-   **Framework**: **Next.js 14** (React) for performance and SEO.
-   **Language**: **TypeScript** for robust, type-safe code.
-   **Styling**: **Tailwind CSS** for modern, responsive UI.
-   **Components**: **Shadcn/UI** for accessible design.

## Backend (Server-Side)
-   **Runtime**: **Node.js** (Server Actions).
-   **Security**: **NextAuth.js** for authentication.
-   **Database**: **PostgreSQL / MongoDB** via **Prisma ORM**.
-   **Analytics**: **Python** (FastAPI) for ML models.

---

# 5. Application Modules

## Core Features
1.  **Dashboard**: Real-time overview of business health (Stock Value, Sales).
2.  **Inventory Management**: "Stock In" (Purchase) and "Stock Out" (POS).
3.  **Alerts System**: Triggers for Low Stock & Expiring Batches.
4.  **Reports**: Downloadable P&L and Sales Reports.

## Future Scope
-   **Supplier Integration**: Auto-email purchase orders.
-   **Mobile App**: Native app for barcode scanning.
-   **AI Chatbot**: "How much milk did I sell last week?"

---

# 6. Conclusion

-   **Impact**: Transforms traditional shops into data-driven businesses.
-   **Efficiency**: Reduces manual workload and prevents financial losses.
-   **Scalability**: Built on modern tech stack ready for future expansion.
