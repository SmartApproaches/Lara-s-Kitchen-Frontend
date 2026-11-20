# Lara's Kitchen dashboard: the "who delivers" pop-up and ads

What the dashboard (Lara-s-Kitchen-Frontend) needs from the backend's new features:

1. **The "order ready" pop-up** (kitchen): when a delivery order is ready, the kitchen picks who delivers it: Lara's own rider, or a SmartEatX rider.
2. **Ads** (super admin): adverts for the app's home screen carousel, made and followed from the dashboard.

The mobile app's side (checkout price, tracking a SmartEatX delivery, the ads carousel) is in [mobile-guide.md](mobile-guide.md).

## The basics

| | Staging | Production |
|---|---|---|
| API | `https://staging-api.smartapproaches.online` | `https://prod-api.laraskitchen.org` |
| API docs (Swagger) | `https://staging-api.smartapproaches.online/api-docs` | not public |

- Every call is signed in with `Authorization: Bearer <access token>`, except the guest routes.
- Every answer comes in the usual envelope: `{ "status": true, "message": "…", "data": … }`. The examples below show only `data`.
- Money is in pounds (`12.99`). Times are ISO 8601 in UTC (`2026-12-01T09:00:00.000Z`).
- An error answers with an HTTP status and a `message` that is ready to show to people.

---

## 1. The "order ready" pop-up: who delivers

When the kitchen marks a **delivery** order ready, it now chooses who takes it:

- **Our rider** (`internal`, the default): Lara's own riders, exactly as today.
- **SmartEatX rider** (`external`): the backend books a SmartEatX rider through the SmartEatX Delivery API. SmartEatX then moves the order on (picked up, on its way, delivered) and the customer gets the same notifications as today.

Collection and dine-in orders don't get the pop-up: mark them ready as today.

### The call

```
PATCH /kitchen/orders/{orderId}/update-order-status
{ "status": "ready", "delivery_provider": "external" }
```

`delivery_provider` is `"internal"` or `"external"`. Leave it out and it's `"internal"`. It's ignored for other statuses and order types.

**Answers:**

- `internal`: `data` is `{ "delivery_provider": "internal" }`.
- `external`: the booking, with the pickup code the kitchen gives the rider:

```json
{
  "delivery_provider": "external",
  "external_delivery": {
    "provider": "external",
    "reference": "SED-191126-00042",
    "status": "searching",
    "courier": null,
    "tracking_url": "https://track-delivery.smarteatx.com/…",
    "pickup_code": "6093",
    "price_cap": 475,
    "price_final": null,
    "reason": null,
    "updated_at": "2026-11-19T12:00:03.000Z"
  }
}
```

`price_cap` and `price_final` are in **pence**, as SmartEatX charges them.

**Errors.** The order is marked ready first, so after any of these it stays ready. The kitchen can try SmartEatX again (it never books twice) or send it with Lara's rider:

| Status | `message` (shown as is) | When |
|---|---|---|
| 400 | `SmartEatX couldn't book a rider: …` | SmartEatX refused, for example an address outside its area |
| 503 | `SmartEatX couldn't book a rider: …` | SmartEatX can't be reached right now, or isn't set up on this server yet |
| 400 | `Set the restaurant's phone number in app settings before booking SmartEatX riders.` | No restaurant phone in app settings |
| 400 | `Order … has no UK phone number for the rider to call.` / `… has no delivery address on its map.` | The customer's details aren't enough to book |

On staging, SmartEatX answers 503 until its sandbox keys are set on the server. Lara's riders work regardless.

### Changing your mind, and cancelling

- **SmartEatX to our rider:** mark it ready again with `"internal"`. The backend calls the SmartEatX booking off first.
- **Cancelling the order** (`"status": "cancelled"`) also calls the SmartEatX rider off.
- **Once the SmartEatX rider has collected it,** neither works. The answer is `400 "SmartEatX's rider has already collected this order, so it can't be called off."`
- **The cashier screen** can no longer change a SmartEatX delivery's status. It answers `400`, because SmartEatX moves it on.

### Building it in the dashboard

The kitchen marks orders ready in three places. Each one should open the pop-up for delivery orders:

- `src/pages/kitchen/_pages/dashboard/Dashboard.jsx` (`handleMarkAsReady`)
- `src/pages/kitchen/_pages/orders/Orders.jsx` (`handleUpdateStatus(order.id, "ready")`)
- `src/pages/kitchen/_pages/specialOrders/index.jsx` (`handleMarkAsReady`)

1. **Pass the choice through** the mutation in `src/redux/slices/kitchen/kitchenDashboardApiSlice.js`:

   ```js
   updateOrderStatus: builder.mutation({
     query: ({ orderId, status, delivery_provider }) => ({
       url: `/kitchen/orders/${orderId}/update-order-status`,
       method: "PATCH",
       body: { status, ...(delivery_provider && { delivery_provider }) },
     }),
     invalidatesTags: ["KitchenDashboard"],
   }),
   ```

2. **The pop-up:** title "Who's delivering order #…?", with two large choices:
   - "Our rider". Selected by default; Lara's riders get the order as today.
   - "SmartEatX rider". The customer paid £`order.delivery_fee` for delivery.

   Then a "Mark as ready" button, disabled while sending. Collection and dine-in orders skip the pop-up.

3. **After SmartEatX is booked,** show the pickup code big and clear in a toast or the order card: "SmartEatX rider booked. Pickup code **6093**: the rider will ask for it." Print it on the kitchen ticket too, if you print one.

4. **On an error,** keep the pop-up open with the `message`. Offer "Try again" (SmartEatX) and "Use our rider" (sends `"internal"`).

5. **The kitchen lists show the SmartEatX delivery.** `GET /kitchen/orders/orders-to-prepare` and `GET /kitchen/orders/special-orders` carry `external_delivery` (the shape above) on each SmartEatX order, and `delivery_provider` on every order. On those order cards, show:
   - a "SmartEatX" badge;
   - the **pickup code**;
   - the rider's name once `courier` is set;
   - a status chip from `external_delivery.status`:

   | `status` | Chip |
   |---|---|
   | `pending`, `scheduled`, `searching` | Finding a rider |
   | `assigned` | Rider on the way · `courier.name` |
   | `at_pickup` | Rider is here |
   | `picked_up`, `in_transit`, `at_dropoff` | On its way to the customer |
   | `delivered` | Delivered |
   | `cancelled`, `failed`, `returned` | The status, with `reason` |

   Refresh the ready list about every 30 seconds so the chip and rider name follow.

SmartEatX orders never appear in Lara's riders' "ready to deliver" list, so Lara's riders can't accept them by mistake.

---

## 2. Ads

Adverts are made here for clients, each with a picture, words, a link and dates. The app shows the live ones in a carousel on its home screen. Every showing (impression) and tap (click) in the app is counted, for the metrics and the chart below.

### The routes (super admin)

| Route | What |
|---|---|
| `POST /admin/adverts` | Create (multipart form, picture in `image`) |
| `GET /admin/adverts?page=&search=&status=` | List, newest first, 12 to a page |
| `GET /admin/adverts/stats` | `{ ongoing, completed, cancelled }` |
| `GET /admin/adverts/{id}` | One advert; an active one has `days_left` |
| `PATCH /admin/adverts/{id}` | Change (multipart; a picture in `image` replaces the old one) |
| `POST /admin/adverts/{id}/duplicate` | A copy, titled "… (Copy)", its counts at 0 |
| `PATCH /admin/adverts/{id}/stop` | Stop an active advert |
| `PATCH /admin/adverts/{id}/resume` | Resume a stopped or paused advert |
| `DELETE /admin/adverts/{id}` | Delete |
| `GET /admin/adverts/{id}/metrics` | `{ impressions, clicks, ctr }` (`ctr` is a percentage, `33.33`) |
| `GET /admin/adverts/{id}/metrics/chart?period=7d\|30d\|12m` | `[{ date, impressions, clicks }]`, per day (`2026-11-19`) or month (`2026-11`), oldest first, empty ones at 0 |

**An advert** (`GET /admin/adverts/{id}`):

```json
{
  "id": "172b3f6f-eb5c-486d-8236-997a28d750f7",
  "title": "Fresh sourdough every morning",
  "description": "Baked in Hendon, delivered warm.",
  "link_url": "https://example.com/bakery",
  "call_to_action_text": "Order now",
  "image_url": "https://res.cloudinary.com/…/sourdough.jpg",
  "image_public_id": "…",
  "client_name": "Leyton Bakes",
  "client_email": "hello@example.com",
  "start_date": "2026-12-01T09:00:00.000Z",
  "end_date": "2026-12-31T23:59:59.000Z",
  "post_now": false,
  "status": "active",
  "impressions": 1240,
  "clicks": 87,
  "days_left": 12,
  "created_at": "2026-11-19T12:00:00.000Z",
  "updated_at": "2026-11-19T12:00:00.000Z"
}
```

**Rules:**
- **The statuses:**
  - `active` runs between its dates.
  - `stopped` is the dashboard's "cancelled".
  - `paused` can be resumed (no route sets it today; it's kept for the future).
  - `completed` is set automatically within 5 minutes of `end_date`.
- **The form:**
  - The picture is required when creating: jpg, png, gif or webp, up to 25 MB.
  - `end_date` must be after `start_date`.
  - `link_url` must be a full URL, and `client_email` an email.
- **Deleting** takes the advert off the dashboard and the app.
- **A copy** uses the same picture until one of them gets a new one.

### Building it

Put it under **Business Suite → Ads**: add a card in `pages/admin/_pages/business-suite`, and the routes `admin/business-suite/ads`, `…/ads/new`, `…/ads/:id` and `…/ads/:id/edit`. Add an `adsApiSlice.js` in `src/redux/slices/super-admin`, with an `"Ads"` tag that every change invalidates.

**List page:**
- **Three stat cards** from `/stats`: Ongoing, Completed, Cancelled.
- **Filter tabs:** All, Active, Paused, Stopped, Completed. Each one sets `status`.
- **A search box** (`search`, matching the title or the client).
- **A table:** picture, title, client, dates, a state label, impressions and clicks.
- **Pagination** from `current_page` and `last_page`.
- **"New ad"** opens the form.
- **The state label** (as on the SmartEatX dashboard):
  - `completed` → "Completed";
  - `stopped` or `paused` → "Ad stopped";
  - start in the future → "Scheduled";
  - otherwise "N days left".

**Form (new and edit):**
- **Fields:** a picture picker with a preview (required on new), title, description, link, button text, client name and client email.
- **A "Post now" switch,** on by default for a new ad. While it's on, the start is now and the start field is greyed out. Otherwise there's a start date-time.
- **An end date-time.**
- **Check before sending:** the end is after the start, the link is a URL, the email is an email.
- **Send a `FormData`:**

  ```js
  const body = new FormData();
  const start = form.postNow ? new Date() : form.start;
  Object.entries({
    title, description, link_url, call_to_action_text, client_name, client_email,
    start_date: start.toISOString(), end_date: form.end.toISOString(), post_now: String(form.postNow),
  }).forEach(([key, value]) => value != null && body.append(key, value));
  if (form.image) body.append("image", form.image);
  // POST /admin/adverts, or PATCH /admin/adverts/:id with only what changed
  ```

**Detail page:**
- **The advert as the app shows it:** the picture, title, description and button.
- **Its client, dates and state label.**
- **Metric cards** (`/metrics`): Impressions, Clicks, and Click-through rate as `ctr`%.
- **A line chart** of impressions and clicks (`/metrics/chart`), with 7 days, 30 days and 12 months toggles.
- **Actions:**
  - Edit;
  - Duplicate (opens the copy);
  - Stop, when active;
  - Resume, when stopped or paused;
  - Delete, after a confirmation.

  Show each action's `message` on failure.
