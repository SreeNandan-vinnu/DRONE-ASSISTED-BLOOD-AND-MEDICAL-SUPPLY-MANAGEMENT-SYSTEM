# TODO: Update Frontend JS to Use Backend APIs

## 1. Update hospital.js ✅
- Replace `getOrders()` with async fetch('/api/orders')
- Update `renderOrders()` to fetch data on load and render tables
- Modify `submitOrder()` to POST to /api/orders, then fetch and re-render
- Remove `saveOrders()` and localStorage usage
- Show empty placeholders when no orders (e.g., "No orders found")

## 2. Update admin.js ✅
- Implement fetch('/api/users') for getting users
- Update `addUser()` to POST to /api/users and refresh table
- Update `editUser()` and `deleteUser()` to use PUT/DELETE and refresh
- Add user table rendering on load
- Show empty placeholders for no users

## 3. Update drone.js ✅
- Fetch drones from '/api/drones' for monitoring and assignment
- Update `monitorDrone()` and `assignMission()` to use real data
- Use PUT to update drone status
- Show placeholders if no drones

## 4. Update distribution.js ✅
- Fetch orders from '/api/orders' for approval/rejection
- Update `approveOrder()` and `rejectOrder()` to PUT status and refresh
- Show empty placeholders for no pending orders

## 5. Update main.js ✅
- Replace localStorage in login/signup with fetch('/api/users/login') and '/api/users/register'
- Store auth token or user data from response

## 6. Test Integration ✅
- Run backend and frontend
- Verify empty states show placeholders
- Test form submissions update tables immediately
