# TKS.bd Premium E-commerce Blueprint

## 1. Core Feature: Pre-order & Harvest Cycle Management
- **Pre-order Button:** "Pre-order Now" instead of "Buy Now" for seasonal products.
- **Expected Shipping Date:** Prospective dates shown on products (e.g., "Shipping starts from June 1st week").
- **Inventory Locking:** Stock limits for pre-orders.
- **Automated Notifications:** SMS alerts for harvesting and dispatch.

## 2. Advanced Split Shipping Logic
- **Dynamic Cart Splitting:** Orders with multiple products (e.g., different mango varieties) split into separate "Packages" based on harvest dates.
- **Separate Delivery Charges:** Calculated per package/shipment.
- **Order Dashboard Tracking:** Users see status per package (e.g., Package 1: Shipped, Package 2: Waiting for Harvest).

## 3. Technical Strategy
- **Database Schema:** Includes `is_preorder`, `harvest_date`, `unit_weight`, and district-based shipping rates.
- **Integrations:** Steadfast/Sundarban Courier APIs and a Universal SMS Gateway wrapper.

## 4. UI/UX Design (Premium Look)
- **Palette:** Forest Green (#2D5A27), Mango Orange (#FFB300), Off-White (#F9F9F9).
- **Typography:** Inter or Poppins (Clean Sans-serif).
- **Home Page:** Hero video/high-quality imagery, "Harvesting Soon" badges, and trust signals (Direct from Rajshahi, Chemical Free).
- **Checkout:** Progress bar, gift options with custom messages.

## 5. Admin & Management
- Roles for Super Admin (Analytics), Staff (Order/Courier management), Inventory Manager, and Customer Support.

## 6. Order Tracking (Vertical Timeline)
- Visual timeline showing stages: Order Placed -> Harvesting -> Handed over to Courier -> Reached Hub -> Out for Delivery.

## 7. Compliance
- Trade License/TIN in footer.
- Clear Return Policy (24-hour window for damaged goods).
- Pre-order terms.