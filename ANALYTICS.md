# Vercel Analytics Event Dictionary

This document tracks custom Vercel Analytics events used in the portfolio.

## Event Naming

- Event names use lowercase snake case.
- Payload fields are lightweight primitives (`string`, `number`, `boolean`).
- `projectId` is included on case study events when available.

## Global Events

### `scroll_depth`

Fires once per page view at each milestone.

Payload:

- `percent`: `25 | 50 | 75 | 100`
- `page`: `portfolio_home`

Source:

- `src/app/App.tsx`

### `engagement_time`

Fires once when the page is hidden/unloaded after meaningful engagement.

Payload:

- `seconds`: total engaged seconds (minimum 10s before sending)
- `reason`: `hidden | pagehide | beforeunload | unmount`
- `page`: `portfolio_home`

Source:

- `src/app/App.tsx`

## Sidebar Events

### `sidebar_case_study_click`

Fires when a sidebar case study link is clicked.

Payload:

- `nodeId`: selected sidebar node key (or `null`)
- `label`: displayed link label
- `href`: target hash link

Source:

- `src/app/components/InfoPanel.tsx`

## Case Study Events

### `case_study_view`

Fires when the active slide/asset changes.

Payload:

- `projectId`
- `slideIndex`: 1-based active slide index
- `assetId`
- `assetType`

### `case_study_client_link_click`

Fires when a case study client external link is clicked.

Payload:

- `projectId`
- `client`
- `url`

### `case_study_asset_tab_click`

Fires when an asset tab is clicked.

Payload:

- `projectId`
- `assetId`
- `assetType`
- `tabIndex`: 1-based tab index

### `case_study_project_view_click`

Fires when a project view tab is clicked.

Payload:

- `projectId`
- `slideIndex`: 1-based slide index
- `viewLabel`

### `case_study_slide_thumb_click`

Fires when a slide thumbnail is clicked.

Payload:

- `projectId`
- `slideIndex`: 1-based slide index
- `viewLabel`

### `case_study_prev_click`

Fires when previous navigation arrow is clicked.

Payload:

- `projectId`
- `fromSlide`: 1-based slide index before movement

### `case_study_next_click`

Fires when next navigation arrow is clicked.

Payload:

- `projectId`
- `fromSlide`: 1-based slide index before movement

### `case_study_technical_impl_open`

Fires when the technical implementation modal is opened.

Payload:

- `projectId`
- `assetId`
- `assetType`

### `case_study_cta_click`

Fires when a case study CTA link is clicked.

Payload:

- `projectId`
- `assetId`
- `assetType`
- `ctaLabel`
- `ctaUrl`

Source for all case study events:

- `src/app/components/CaseStudies.tsx`

## Suggested Derived Metrics (Vercel)

- **Deep scroll sessions:** sessions with `scroll_depth.percent >= 50`
- **Case study engagement:** sessions with any `case_study_*` event
- **CTA intent rate:** `case_study_cta_click / case_study_view`
- **Sidebar-to-work rate:** `sidebar_case_study_click / total sessions`
- **Estimated engaged sessions:** sessions with `engagement_time.seconds >= 30` OR any case study interaction
