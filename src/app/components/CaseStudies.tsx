import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ImageLightbox } from './ImageLightbox';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Annotation {
  x: number;       // % from left of image
  y: number;       // % from top of image
  label: string;
  dir?: 'left' | 'right';
}

interface Slide {
  src?: string;
  pdfSrc?: string;  // PDF rendered inline via embed; opens full doc in lightbox
  panelTitle?: string;
  projectViewTitle?: string;
  alt: string;
  caption?: string;
  description?: string;
  panelDescription?: string;
  skills?: string[];
  highlightMetrics?: string[];
  ctaUrl?: string;
  ctaLabel?: string;
  assets?: Array<{
    id: string;
    label: string;
    type: 'image' | 'pdf' | 'code' | 'video';
    src?: string;
    videoSrc?: string;
    compareSrc?: string;
    pdfSrc?: string;
    code?: string;
    codeLanguage?: string;
    videoOverlayTitle?: string;
    videoOverlayBody?: string;
    description?: string;
    implementationHighlights?: string[];
    skills?: string[];
    compareLabel?: string;
    primaryLabel?: string;
    overlayCompare?: boolean;
    overlayWidthPct?: number;
    overlayRightPct?: number;
    overlayBottomPct?: number;
    centerInFrame?: boolean;
    ctaUrl?: string;
    ctaLabel?: string;
    alt?: string;
    compareAlt?: string;
    annotations?: Annotation[];
    compareAnnotations?: Annotation[];
    darkAnnotations?: boolean;
    restricted?: boolean;
    restrictedMessage?: string;
    requestAccessEmailSubject?: string;
  }>;
  detailSections?: Array<{
    title: string;
    items: string[];
  }>;
  isHero?: boolean;
  darkAnnotations?: boolean; // use dark text for light-background images
  annotations?: Annotation[];
}

export interface Project {
  id: string;
  number: string;
  client: string;
  clientUrl?: string;
  title: string;
  role: string;
  year: string;
  description: string;
  tech: string[];
  showProjectTabs?: boolean;
  slides: Slide[];
}

import schoolinkHero from '../../imports/schoolink_wireframe_overview.png';
import miqRoadshowPdf from '../../imports/MIQ_Roadshow_LP_V2_compressed.pdf';
import upcraftStrategyCorp from '../../imports/Screenshot_2026-06-16_at_3.25.42_PM.png';
import upcraftDatasite from '../../imports/data_site_assets.png';
import expediaCareers from '../../imports/Screenshot_2026-06-17_at_9.49.33_AM.png';
import drumChannelDesignSystem from '../../imports/drumchannel_design_system.png';
import schoolinkWelcome from '../../imports/Welcome_screen.png';
import schoolinkCreate from '../../imports/Create_New_Referral.png';
import schoolinkReferrals from '../../imports/School_User_Referrals.png';
import schoolinkDetails from '../../imports/Referral_Details.png';
import schoolinkReports from '../../imports/Reports.png';
import schoolinkFileSharing from '../../imports/file_sharing.png';
import carPartPlanetDashboard from '../../imports/car_part_planet_dashboard.png';
import carPartPlanetRawData from '../../imports/car_part_planet_raw_data.png';
import carPartPlanetClusterMakes from '../../imports/car_part_planet_cluster_makes.png';
import carPartPlanetClusterGeo from '../../imports/car_part_planet_cluster_geo.png';
import qlearningDataCleaningNotebook from '../../imports/qlearning_data_cleaning_notebook.png';
import qlearningStateSpaceNotebook from '../../imports/qlearning_state_space_notebook.png';
import qlearningRewardFunction from '../../imports/qlearning_reward_function.png';
import qlearningTrainingProcess from '../../imports/qlearning_training_process.png';
import qlearningBusinessMetrics from '../../imports/qlearning_business_metrics.png';
import qlearningHourlyStaffingPlot from '../../imports/qlearning_hourly_staffing_plot.png';
import qlearningPartsPerStaffPlot from '../../imports/qlearning_parts_per_staff_plot.png';
import qlearningTrainingProgressPlot from '../../imports/qlearning_training_progress_plot.png';
import drumchannelBusinessAnalysisSheet from '../../imports/drumchannel_business_analysis_sheet.png';
import drumchannelLearndashDashboard from '../../imports/drumchannel_learndash_dashboard.png';
import drumchannelLookerScatter from '../../imports/drumchannel_looker_scatter.png';
import drumchannelDashboardRedesign from '../../imports/drumchannel_dashboard_redesign.png';
import drumchannelAcademyPageDesign from '../../imports/drumchannel_academy_page_design.png';
import drumchannelRolandEmailMobile from '../../imports/drumchannel_roland_email_mobile.png';
import drumchannelRolandEmailDesktop from '../../imports/drumchannel_roland_email_desktop.png';
import drumchannelInstructorBookingFlow from '../../imports/drumchannel_instructor_booking_flow.png';
import vseInformationArchitecture from '../../imports/vse_information_architecture.png';
import vseWireframeResearch from '../../imports/vse_wireframe_research.png';
import vseCoreAudiencePanel from '../../imports/vse_core_audience_panel.png';
import drumchannelLightThemeStyleGuide from '../../imports/drumchannel_light_theme_style_guide.png';
import vseLoginAccountWireframes from '../../imports/vse_login_account_wireframes.png';
import vseLogoRebrand from '../../imports/vse_logo_rebrand.png';
import vseLargeComponentLibrary from '../../imports/vse_large_component_library.png';
import vseStyleguide from '../../imports/vse_styleguide.png';
import vseLandingPageV6 from '../../imports/vse_landing_page_v6.png';
import vseLandingPageV7 from '../../imports/vse_landing_page_v7.png';
import vseMarketingPagesFull from '../../imports/vse_marketing_pages_full.png';
import vseMarketingPagesOverlay from '../../imports/vse_marketing_pages_overlay.png';
import agavosDesignAssetsOverview from '../../imports/agavos_design_assets_overview.png';
import frbTmtsUserPrerequisites from '../../imports/frb_tmts_user_prerequisites.png';
import frbApiSubscriptionFlows from '../../imports/frb_api_subscription_flows.png';
import imforzaNipitHomepage from '../../imports/imforza_nipit_homepage.png';
import imforzaNipitInnerPagesIa from '../../imports/imforza_nipit_inner_pages_ia.png';
import imforzaNipitMobileDesignAssets from '../../imports/imforza_nipit_mobile_design_assets.png';
import antarestechDunningWireframe from '../../imports/antarestech_dunning_wireframe.png';

export const projects: Project[] = [
  {
    id: 'upcraft',
    number: '01',
    client: 'Upcraft.io',
    clientUrl: 'https://upcraft.io',
    title: 'Design & Development',
    role: 'Senior Web Developer',
    year: '2026',
    description:
      'Design and development work for Upcraft.io — building and maintaining WordPress-based web experiences, integrating enterprise platforms including Salesforce, GA4, and Marketo marketing automation systems. Delivered AEO and SEO optimizations to improve search visibility and content discoverability.',
    tech: ['WordPress', 'Marketo', 'Salesforce', 'GA4', 'SEO', 'AEO', 'JavaScript', 'CSS'],
    slides: [
      {
        src: upcraftStrategyCorp,
        alt: 'MIQ Roadshow landing page — StrategyCorp',
        caption: 'MIQ Roadshow — StrategyCorp',
        isHero: true,
        description: 'Landing page developed in WordPress using Elementor for client StrategyCorp. The page promotes the MIQ Roadshow — a 10-city, two-week event series — featuring a city event grid, speaker profiles, and a lead capture registration form. Focused on layout composition, visual hierarchy, and conversion-optimised design.',
        annotations: [
          { x: 12, y: 8,  label: 'Hero & CTA',             dir: 'right' },
          { x: 60, y: 28, label: 'Event value proposition', dir: 'left'  },
          { x: 50, y: 48, label: '10-city event grid',      dir: 'left'  },
          { x: 20, y: 72, label: 'Speaker profiles',        dir: 'right' },
          { x: 50, y: 90, label: 'Lead capture form',       dir: 'left'  },
        ],
      },
      {
        src: upcraftDatasite,
        alt: 'Datasite email templates — desktop and mobile',
        caption: 'Email Templates — Datasite',
        description: 'Designed responsive email templates for Datasite across desktop and mobile breakpoints. Work included layout composition, brand-aligned typography, image placement, and CTA hierarchy — ensuring consistent rendering across devices and email clients.',
        annotations: [
          { x: 2,  y: 10, label: 'Desktop layout',       dir: 'right' },
          { x: 98, y: 10, label: 'Mobile layout',         dir: 'left'  },
          { x: 2,  y: 50, label: 'Content & CTA blocks',  dir: 'right' },
          { x: 98, y: 55, label: 'Responsive stack',      dir: 'left'  },
        ],
      },
    ],
  },
  {
    id: 'expediaparts',
    number: '02',
    client: 'ExpediaParts',
    clientUrl: 'https://www.expediaparts.com',
    title: 'Frontend Architecture',
    role: 'Design Engineer',
    year: '2026',
    description:
      'Built and maintained a production-facing frontend architecture for ExpediaParts focused on reliability, scalability, and fast operator workflows. The platform combines modern Next.js app patterns, robust state management, secure auth boundaries, and integrations across telephony, payments, and data services.',
    tech: ['Next.js (App Router)', 'React', 'TypeScript', 'Tailwind CSS', 'TanStack Query', 'Zustand', 'Twilio Voice SDK', 'Stripe', 'Supabase', 'Vercel'],
    slides: [
      {
        panelTitle: 'ExpediaParts Frontend Architecture',
        src: expediaCareers,
        alt: 'ExpediaParts careers page design',
        caption: 'Full-Stack Frontend Architecture',
        isHero: true,
        panelDescription:
          'Full-stack frontend architecture case study for ExpediaParts, covering Next.js App Router patterns, BFF API proxy routes, secure session handling, and real-time operational UX. Designed to support both customer-facing experiences and internal workflows at production scale.',
        description:
          'Engineered a Next.js + TypeScript frontend with a BFF layer (`src/app/api/**/route.ts`) to centralize backend orchestration and auth boundaries. Implemented scalable server/client state patterns with TanStack Query and Zustand, integrated Twilio Voice/Stripe/Supabase, and supported reliable release workflows with Vercel deploy scripting and smoke checks.',
        skills: ['Next.js (App Router)', 'React', 'TypeScript', 'Tailwind CSS', 'TanStack Query', 'Zustand', 'Twilio Voice SDK', 'Stripe', 'Supabase', 'Vercel'],
        highlightMetrics: [
          'Architecture: Next.js App Router + BFF',
          'State: React Query + Zustand',
          'Auth: httpOnly Cookie Sessions',
          'Realtime UX: Polling + Invalidation',
          'Ops: Deploy Scripts + Smoke Tests',
        ],
        assets: [
          {
            id: 'secure-bff-login-flow',
            label: 'Secure BFF Login Flow',
            type: 'code',
            codeLanguage: 'typescript',
            restricted: true,
            restrictedMessage:
              'This architecture snippet includes production auth and session patterns for a live client system. Public view is restricted; detailed review is available on request.',
            requestAccessEmailSubject: 'Request access: ExpediaParts Secure BFF Login Flow',
            description:
              'Implemented a Backend-for-Frontend login endpoint that forwards request metadata to the API, sets auth tokens as httpOnly cookies, and returns only sanitized user profile data to the client. This keeps token handling off the browser runtime while preserving UX.',
            code: `const forwardedFor = request.headers.get('x-forwarded-for');
const realIp = request.headers.get('x-real-ip');
const clientIp =
  forwardedFor?.split(',')[0]?.trim() ||
  realIp?.trim() ||
  undefined;
const userAgent = request.headers.get('user-agent') ?? undefined;

const response = await fetch(\`\${API_URL}/auth/login\`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email,
    password,
    rememberMe: Boolean(rememberMe),
    ipAddress: clientIp,
    userAgent,
    source: 'storefront',
  }),
});

if (!response.ok) {
  const errorData = await response.json().catch(() => ({}));
  return NextResponse.json(
    { error: errorData.message || 'Invalid credentials' },
    { status: response.status }
  );
}

const data = await response.json();

// Set HTTP-only cookies for tokens (longer-lived when "remember me" is set)
const cookieStore = await cookies();
setAuthCookies(cookieStore, data.session, Boolean(rememberMe));

// Return user data (without tokens - they're in cookies)
return NextResponse.json({
  user: {
    id: data.user.id,
    email: data.user.email,
    firstName: data.user.firstName,
    lastName: data.user.lastName,
    phone: data.user.phone,
    role: data.user.role,
    department: data.user.department ?? null,
    portalPermissions: data.user.portalPermissions ?? null,
    mustChangePassword: Boolean(data.user.mustChangePassword),
    preferences: data.user.preferences,
  },
});`,
          },
          {
            id: 'global-react-query-auth-recovery',
            label: 'Global React Query Auth Recovery',
            type: 'code',
            codeLanguage: 'typescript',
            restricted: true,
            restrictedMessage:
              'This asset documents internal auth recovery and error-handling architecture for a production storefront. Public display is restricted to protect implementation detail.',
            requestAccessEmailSubject: 'Request access: ExpediaParts Global React Query Auth Recovery',
            description:
              'Built a centralized React Query error handling for auth failures: detect auth errors, dedupe refresh attempts per request key, trigger token refresh, and fall back to logout + redirect when refresh fails. This reduced repeated auth logic across individual hooks. Skills demonstrated: React Query, Error Handling, Session Management, Frontend Architecture.',
            code: `function QueryClientProviderWithErrorHandling({ children }: { children: ReactNode }) {
  const logout = useAuthStore((state) => state.logout);
  const failedRequestsRef = useRef<Set<string>>(new Set());

  const handleAuthError = useCallback(async (error: Error, queryKey?: readonly unknown[]) => {
    // Only handle 401 errors
    if (!(error instanceof AuthError)) {
      return;
    }

    // Create a unique key for this request to prevent infinite loops
    const requestKey = queryKey ? JSON.stringify(queryKey) : 'mutation';

    // If we've already tried to refresh for this request, don't try again
    if (failedRequestsRef.current.has(requestKey)) {
      return;
    }

    failedRequestsRef.current.add(requestKey);

    // Attempt to refresh the token
    const refreshed = await attemptTokenRefresh();

    if (!refreshed) {
      // Refresh failed - logout and redirect to login
      await logout();

      // Only redirect if we're in the browser and not already on login page
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith('/login')) {
          window.location.href = \`/login?returnUrl=\${encodeURIComponent(currentPath)}\`;
        }
      }
    } else {
      // Clear the failed request so it can be retried
      failedRequestsRef.current.delete(requestKey);
    }
  }, [logout]);

  const [queryClient] = useState(() => new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        handleAuthError(error, query.queryKey);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        handleAuthError(error);
      },
    }),
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          // Don't retry on auth errors
          if (error instanceof AuthError) {
            return false;
          }
          return failureCount < 3;
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
      },
      mutations: {
        retry: false,
      },
    },
  }));
}`,
          },
          {
            id: 'production-deployment-automation',
            label: 'Production Deployment Automation',
            type: 'code',
            codeLanguage: 'shell',
            restricted: true,
            restrictedMessage:
              'This release automation script includes production deployment workflow details for a live client system and is shared only by request.',
            requestAccessEmailSubject: 'Request access: ExpediaParts Production Deployment Automation',
            description:
              'I automated production deployment to Vercel with a scripted release flow and conditional post-deploy smoke validation. This demonstrates ownership beyond feature coding into release reliability and operational quality. Skills demonstrated: Vercel, Release Engineering, Bash Automation, Production Workflows.',
            code: `#!/usr/bin/env bash
# Deploy storefront to Vercel production, then run production smoke (unless skipped).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACK_ROOT="$(cd "$ROOT/../expedia-parts-back" && pwd)"
cd "$ROOT"

echo "Building and deploying expedia-parts-front to Vercel production..."
vercel deploy --prod --yes --force

echo ""
echo "Production aliases:"
echo "  https://expedia-parts-front-xi.vercel.app"
echo "  https://expedia-parts-front-expedia-solutions.vercel.app"

if [ "\${SKIP_POST_DEPLOY_SMOKE:-}" = "1" ]; then
  echo ""
  echo "SKIP_POST_DEPLOY_SMOKE=1 — skipping post-deploy smoke"
  exit 0
fi

echo ""
echo "Post-deploy smoke (API + storefront on Vercel aliases)..."
if [ -f "$BACK_ROOT/package.json" ]; then
  (cd "$BACK_ROOT" && npm run smoke:prod)
else
  npm run smoke:prod
fi`,
          },
          {
            id: 'architecture-overview',
            label: 'Careers Page Design',
            type: 'image',
            src: expediaCareers,
            alt: 'ExpediaParts careers page design overview',
            description:
              'Designed and implemented the careers experience using the established ExpediaParts visual language, preserving original typography hierarchy, spacing rhythm, and brand tone while translating the design system into reusable production components.',
            annotations: [
              { x: 2,  y: 8,  label: 'Hero & brand identity',           dir: 'right' },
              { x: 98, y: 30, label: 'Why work with us — feature grid',  dir: 'left'  },
              { x: 2,  y: 52, label: 'Open positions grid',              dir: 'right' },
              { x: 98, y: 70, label: 'Life at ExpediaParts',             dir: 'left'  },
              { x: 2,  y: 85, label: 'FAQ & CTA section',                dir: 'right' },
            ],
          },
        ],
        annotations: [
          { x: 2,  y: 8,  label: 'Hero & brand identity',           dir: 'right' },
          { x: 98, y: 30, label: 'Why work with us — feature grid',  dir: 'left'  },
          { x: 2,  y: 52, label: 'Open positions grid',              dir: 'right' },
          { x: 98, y: 70, label: 'Life at ExpediaParts',             dir: 'left'  },
          { x: 2,  y: 85, label: 'FAQ & CTA section',                dir: 'right' },
        ],
      },
    ],
  },
  {
    id: 'ucsd-ml-analytics',
    number: '03',
    client: 'ExpediaParts · UC San Diego Project',
    clientUrl: 'https://www.expediaparts.com',
    title: 'Vehicle Transmission Sales Segmentation',
    role: 'Machine Learning Analyst',
    year: '2026',
    description:
      'Client-facing analytics project for ExpediaParts completed through UC San Diego to identify high-demand transmission categories and priority regions for marketing and inventory planning. Built using CRISP-DM and K-Means clustering to translate sales data into actionable operating decisions.',
    tech: ['Python', 'Pandas', 'NumPy', 'scikit-learn', 'K-Means Clustering', 'Q-Learning', 'Reinforcement Learning', 'Matplotlib', 'Pyplot', 'CRISP-DM', 'Octoparse', 'Google Sheets', 'Jupyter Notebook'],
    showProjectTabs: true,
    slides: [
      {
        src: carPartPlanetDashboard,
        alt: 'Parts demand inventory analysis case study',
        caption: 'Case Study 1 · Parts Demand & Inventory Analysis',
        isHero: true,
        skills: ['Python', 'Pandas', 'NumPy', 'scikit-learn', 'K-Means Clustering', 'CRISP-DM', 'Octoparse', 'Google Sheets', 'Jupyter Notebook'],
        description:
          'Applied CRISP-DM and K-Means clustering to 2019–2026 transmission order data to determine which vehicle categories sell most and where regional demand is concentrated. The analysis supports more targeted ad spend, smarter purchasing priorities, and region-specific stocking strategy.',
        highlightMetrics: [
          'Data Window: 2019-2026',
          'Model: K-Means (k=4)',
          'Method: CRISP-DM',
          'Top Demand States: CA · TX · FL',
        ],
        ctaUrl: 'https://docs.google.com/document/d/1IuqUPP-rgM7KuLdjhGlrgyWtVfI9aK7W6lMTPHQEfPQ/edit?usp=sharing',
        ctaLabel: 'View Full Report',
        assets: [
          {
            id: 'raw-data',
            label: 'Raw Data Sheet',
            type: 'image',
            src: carPartPlanetRawData,
            restricted: true,
            restrictedMessage:
              'This source worksheet references client operating data. The public view is intentionally blurred; access can be shared during interview or approved review contexts.',
            requestAccessEmailSubject: 'Request access: ExpediaParts ML Raw Data Sheet',
            alt: 'Raw transmission order data worksheet',
            annotations: [
              {
                x: 16,
                y: 9,
                dir: 'right',
                label: 'Dashboard: A centralized sheet for high-level "Sales & Order" visualizations.',
              },
              {
                x: 60,
                y: 18,
                dir: 'left',
                label: 'Calc_Data: An intermediate processing sheet used to generate pivot-style summaries of orders by date, vehicle make, and location.',
              },
              {
                x: 22,
                y: 64,
                dir: 'right',
                label: 'Product Order Reports (2019-2026): The primary ledger containing detailed transaction and technical part data.',
              },
              {
                x: 78,
                y: 62,
                dir: 'left',
                label: 'Sales Reports: Focused on the operational lifecycle of an order, including salesperson tracking and vendor status.',
              },
            ],
          },
          {
            id: 'dashboard',
            label: 'Visualization Dashboard',
            type: 'image',
            src: carPartPlanetDashboard,
            restricted: true,
            restrictedMessage:
              'This dashboard reflects client demand and order-pattern data from the ML engagement. Public view is restricted to protect business-sensitive information.',
            requestAccessEmailSubject: 'Request access: ExpediaParts ML Visualization Dashboard',
            alt: 'Sales and order dashboard visualizations',
          },
          {
            id: 'kmeans-code',
            label: 'K-Means Code',
            type: 'code',
            codeLanguage: 'python',
            description:
              'Implemented K-Means clustering to segment transmission sales patterns and identify which vehicle categories and regions show the strongest demand. Prepared the modeling dataset with one-hot encoded features, standard scaling, and NaN imputation so each variable contributed consistently to cluster formation.',
            code: `from sklearn.cluster import KMeans
from sklearn.impute import SimpleImputer

kmeans = KMeans(n_clusters=4, random_state=42)

# Impute NaN values in X_scaled before applying KMeans
# Use mean strategy for scaled data
imputer = SimpleImputer(strategy='mean')
X_scaled_imputed = imputer.fit_transform(X_scaled)

df['Cluster'] = kmeans.fit_predict(X_scaled_imputed)`,
          },
          {
            id: 'cluster-makes',
            label: 'Cluster Output · Vehicle Makes',
            type: 'image',
            src: carPartPlanetClusterMakes,
            restricted: true,
            restrictedMessage:
              'This clustering output includes client-specific demand segmentation and is available only on request.',
            requestAccessEmailSubject: 'Request access: ExpediaParts ML Cluster Output (Vehicle Makes)',
            alt: 'Cluster output table by vehicle make',
            description:
              'This output shows make distribution by cluster, where Cluster 0 captures high-volume mainstream transmission demand (for example Ford, Chevrolet, and Dodge), while Cluster 3 reflects lower-frequency niche makes. It helps separate core stocking priorities from long-tail inventory patterns.',
          },
          {
            id: 'cluster-geo',
            label: 'Cluster Output · Regional Demand',
            type: 'image',
            src: carPartPlanetClusterGeo,
            restricted: true,
            restrictedMessage:
              'This regional demand cluster output reflects client market distribution data and is intentionally restricted in the public portfolio.',
            requestAccessEmailSubject: 'Request access: ExpediaParts ML Cluster Output (Regional Demand)',
            alt: 'Cluster output table by city and state',
            description:
              'This grouped city/state output highlights where high-volume Cluster 0 demand concentrates geographically, making it easier to prioritize regional purchasing and market targeting. It provides a practical map for location-specific inventory and ad planning decisions.',
          },
        ],
      },
      {
        alt: 'Sales forecasting and resource optimization case study',
        panelTitle: 'Dynamic Staffing Allocations',
        projectViewTitle: 'Project 2: Dynamic Staffing Allocation using Q-Learning',
        caption: 'Dynamic Staffing Allocation',
        panelDescription:
          'Q-Learning analysis for ExpediaParts that recommends optimal staffing by hour, day, shop, call type, and part type to maximize net business outcomes. The model balances revenue capture, understaffing risk, labor cost, and sales-efficiency bonuses, and highlights strongest performance windows (especially midday and early-week periods) for practical staffing decisions.',
        skills: ['Python', 'Pandas', 'NumPy', 'scikit-learn', 'Q-Learning', 'Reinforcement Learning', 'Matplotlib', 'Pyplot', 'CRISP-DM', 'Google Sheets', 'Jupyter Notebook'],
        description:
          'Developed a Q-Learning staffing model for ExpediaParts to shift from fixed schedules to dynamic hourly allocation by shop category and call type. The policy identifies peak revenue windows and recommends staffing levels that improve revenue capture while controlling labor cost.',
        ctaUrl: 'https://docs.google.com/document/d/1G9kWSqipsLo_B4yDNHKzEB63tlqnXv7YCz_NEBzNQH8/edit?usp=sharing',
        ctaLabel: 'View Full Report',
        assets: [
          {
            id: 'data-cleaning-notebook',
            label: 'Data Cleaning',
            type: 'image',
            src: qlearningDataCleaningNotebook,
            restricted: true,
            restrictedMessage:
              'Notebook views in this section are tied to client call/sales data preparation and are blurred publicly for confidentiality.',
            requestAccessEmailSubject: 'Request access: ExpediaParts Q-Learning Data Cleaning Notebook',
            alt: 'Jupyter notebook step for inspecting and cleaning call sales data',
            description:
              'Notebook snapshot from the data-preparation phase showing schema inspection and core cleaning steps, including revenue normalization and datetime conversion used before reinforcement-learning training.',
          },
          {
            id: 'rl-state-space',
            label: 'RL State Features',
            type: 'image',
            src: qlearningStateSpaceNotebook,
            restricted: true,
            restrictedMessage:
              'This reinforcement-learning state model is derived from client operational data and is available by request only.',
            requestAccessEmailSubject: 'Request access: ExpediaParts Q-Learning State Features',
            alt: 'Jupyter notebook view used to define reinforcement learning state features',
            description:
              'State space is defined from historical records using Hour, Day of Week, Shop, Call Type, and Part Type. This feature set gives the Q-Learning agent enough operational context to recommend staffing levels per time window and sales scenario.',
          },
          {
            id: 'rl-reward-function',
            label: 'Reward Function',
            type: 'image',
            src: qlearningRewardFunction,
            alt: 'Q-learning reward function notebook step',
            description:
              'This reward function was developed for the Q-learning model to align staffing decisions with business goals: maximizing captured revenue, avoiding understaffing, managing labor cost, and rewarding high sales efficiency.',
          },
          {
            id: 'rl-training-process',
            label: 'Training Process',
            type: 'image',
            src: qlearningTrainingProcess,
            alt: 'Q-learning training loop notebook step',
            description:
              'This training loop runs Q-learning for 100 episodes using epsilon-greedy exploration. Alpha (0.1) controls how quickly new information updates the Q-table, gamma (0.9) weights future rewards, epsilon (0.2) sets the exploration rate, and episodes define how many full learning passes the agent performs.',
          },
          {
            id: 'business-metrics',
            label: 'Business Metrics',
            type: 'image',
            src: qlearningBusinessMetrics,
            restricted: true,
            restrictedMessage:
              'This business metrics artifact includes client-sensitive performance outputs and is intentionally gated behind request.',
            requestAccessEmailSubject: 'Request access: ExpediaParts Q-Learning Business Metrics',
            alt: 'Business metrics calculations from recommended staffing outputs',
            description:
              'These metrics translate model recommendations into operational impact by quantifying staff capacity, productivity per staff member, expected labor cost, and estimated net revenue. Together they make it easier to validate whether recommended staffing levels are financially efficient and where adjustments can increase profitability.',
          },
          {
            id: 'hourly-staffing-plot',
            label: 'Hourly Staffing Plot',
            type: 'image',
            src: qlearningHourlyStaffingPlot,
            alt: 'Recommended staffing by hour chart',
            description:
              'This visualization translates the Q-learning policy into an hourly staffing curve so teams can see exactly where coverage should increase or decrease throughout the day. Paired with the plotting code, it provides a transparent, reproducible view of recommendation logic and potential staffing impact.',
            codeLanguage: 'python',
            code: `import matplotlib.pyplot as plt

plt.figure(figsize=(12,6))

plt.plot(
    hourly_staffing['Hour'],
    hourly_staffing['Recommended Staff'],
    marker='o'
)

plt.xlabel('Hour of Day')
plt.ylabel('Average Recommended Staff')
plt.title('Recommended Staffing by Hour')

plt.grid(True)

plt.show()`,
          },
          {
            id: 'parts-per-staff-plot',
            label: 'Parts Per Staff Plot',
            type: 'image',
            src: qlearningPartsPerStaffPlot,
            alt: 'Average parts per staff by hour chart',
            description:
              'This productivity chart shows how many parts each recommended staff member handles by hour and compares it with the 20-parts target line. It helps evaluate whether staffing recommendations are creating efficient coverage or if specific time windows need optimization to improve per-staff output.',
            codeLanguage: 'python',
            code: `plt.figure(figsize=(12,6))

plt.plot(
    hourly_productivity['Hour'],
    hourly_productivity['Avg_Parts_Per_Staff'],
    marker='o'
)

plt.axhline(
    y=20,
    linestyle='--',
    label='20 Parts Per Staff Target'
)

plt.xlabel('Hour of Day')
plt.ylabel('Average Parts Per Staff')
plt.title('Parts Per Staff by Hour')

plt.legend()

plt.grid(True)

plt.show()`,
          },
          {
            id: 'training-progress-plot',
            label: 'Training Progress Plot',
            type: 'image',
            src: qlearningTrainingProgressPlot,
            alt: 'Q-learning training progress across episodes',
            description:
              'This curve shows total reward by episode and helps validate that the Q-learning agent is learning a stable staffing policy over time. The early steep increase followed by a flatter trajectory indicates the model is converging toward stronger long-term reward decisions.',
            codeLanguage: 'python',
            code: `plt.figure(figsize=(12,6))

plt.plot(episode_rewards)

plt.xlabel('Episode')
plt.ylabel('Total Reward')

plt.title(
    'Q-Learning Training Progress (100 Episodes)'
)

plt.grid(True)

plt.show()`,
          },
        ],
        highlightMetrics: [
          'Data Window: 2020-2023',
          'Records: 23,270 call rows',
          'Method: Q-Learning RL',
          'Training: 100 episodes',
          'Action Space: 1-10 staff',
          'Peak Window: 11 AM-3 PM (Mon-Tue)',
        ],
      },
    ],
  },
  {
    id: 'schoolink',
    number: '04',
    client: 'Meadowlark Engineering',
    clientUrl: 'https://meadowlarkengineering.com',
    title: 'SchooLink',
    role: 'UX Designer',
    year: '2025',
    description:
      'Initial concept design for a referral management system enabling teachers to connect students with third-party special needs resources. Designed the full end-to-end flow from teacher onboarding through referral creation, status tracking, provider directory, and district admin controls.',
    tech: ['Figma', 'UX Design', 'Wireframing', 'User Flows'],
    slides: [
      {
        src: schoolinkHero,
        alt: 'SchooLink full wireframe flow overview',
        caption: 'Complete user flow overview',
        isHero: true,
        description:
          'High-level wireframe map showing the end-to-end SchooLink journey: onboarding, referral creation, status tracking, analytics, and district administration workflows.',
        annotations: [
          { x: 2,  y: 44, label: 'Teacher onboarding',         dir: 'right' },
          { x: 98, y: 10, label: 'Referral creation flow',      dir: 'left'  },
          { x: 2,  y: 30, label: 'Student navigation',          dir: 'right' },
          { x: 98, y: 52, label: 'Reports & file submissions',  dir: 'left'  },
          { x: 2,  y: 72, label: 'Provider directory',          dir: 'right' },
          { x: 2,  y: 87, label: 'Admin & role management',     dir: 'right' },
        ],
      },
      {
        src: schoolinkWelcome,
        alt: 'Welcome & feature overview screen',
        caption: 'Welcome & Onboarding',
        description: 'Role-based entry point listing all three priority feature sets. Demo accounts cover four distinct user roles — School User, BHS User, Provider User, and System Admin — each surfacing a tailored view of the platform.',
        annotations: [
          { x: 2, y: 22, label: 'Priority feature overview', dir: 'right' },
          { x: 2, y: 62, label: 'Role-based demo accounts',  dir: 'right' },
          { x: 2, y: 88, label: 'Role-based entry point',    dir: 'right' },
        ],
      },
      {
        src: schoolinkCreate,
        alt: 'Create new referral form',
        caption: 'Create New Referral',
        description: 'A structured multi-section form capturing school and provider matching, full student demographics, IEP status, consent documentation, guardian contact, and referral reason taxonomy — with document attachment and save-as-draft support.',
        annotations: [
          { x: 2,  y:  6, label: 'SMHS & TRC provider matching', dir: 'right' },
          { x: 98, y: 33, label: 'Student info & IEP capture',   dir: 'left'  },
          { x: 2,  y: 52, label: 'Consent documentation',        dir: 'right' },
          { x: 98, y: 72, label: 'Referral reason taxonomy',     dir: 'left'  },
          { x: 2,  y: 87, label: 'Authorization file upload',    dir: 'right' },
        ],
      },
      {
        src: schoolinkReferrals,
        alt: 'School user referrals list',
        caption: 'Referral Management',
        description: 'The teacher-facing referral dashboard with multi-axis filtering by status, urgency level, and fiscal year. Each row shows assigned resource, open/close dates, disposition notes, and a colour-coded status badge at a glance.',
        annotations: [
          { x: 98, y:  6, label: 'Quick referral creation',    dir: 'left'  },
          { x: 2,  y: 14, label: 'Multi-filter search bar',    dir: 'right' },
          { x: 98, y: 38, label: 'Assigned provider column',   dir: 'left'  },
          { x: 98, y: 55, label: 'Colour-coded status badges', dir: 'left'  },
        ],
      },
      {
        src: schoolinkDetails,
        alt: 'Referral details view',
        caption: 'Referral Details',
        description: 'The full referral record for a single student, showing urgency level, a 5-stage workflow tracker (Submitted → Under Review → Approved → In Treatment → Completed), and tabbed sections for Details, Consent, Files, and an immutable Audit Log.',
        annotations: [
          { x: 2,  y: 10, label: 'Status & urgency badges',    dir: 'right' },
          { x: 98, y: 30, label: '5-stage referral workflow',  dir: 'left'  },
          { x: 2,  y: 47, label: 'Details / Consent / Files',  dir: 'right' },
          { x: 98, y: 68, label: 'Student & guardian snapshot', dir: 'left'  },
        ],
      },
      {
        src: schoolinkReports,
        alt: 'Reports & analytics dashboard',
        caption: 'Reports & Analytics',
        description: 'Custom report generation with drill-down filtering by report type, date range, school, and status. Live KPI cards surface Total Referrals, Approval Rate, and Average Processing Time, with one-click CSV export for district-level reporting.',
        annotations: [
          { x: 2,  y: 27, label: 'Custom report filters',       dir: 'right' },
          { x: 98, y: 37, label: 'Generate report',             dir: 'left'  },
          { x: 2,  y: 45, label: 'Export to CSV',               dir: 'right' },
          { x: 98, y: 62, label: 'Real-time KPI summary cards', dir: 'left'  },
        ],
      },
      {
        src: schoolinkFileSharing,
        alt: 'File sharing screen',
        caption: 'File Sharing',
        description: 'A cross-organisation document library where staff can share IEPs, authorisation forms, training modules, and compliance guides. Files are tagged by category and permission level, with submitter attribution, date, and direct download access.',
        annotations: [
          { x: 2,  y:  8, label: 'Category & permission filters', dir: 'right' },
          { x: 98, y: 27, label: 'Tagged document entries',        dir: 'left'  },
          { x: 2,  y: 50, label: 'Submitter & date attribution',   dir: 'right' },
          { x: 98, y: 38, label: 'Direct download',                dir: 'left'  },
        ],
      },
    ],
  },
  {
    id: 'drumchannel',
    number: '05',
    client: 'Drum Channel',
    clientUrl: 'https://www.drumchannel.com',
    title: 'Drum Channel',
    role: 'Design Engineer',
    year: '2023–2025',
    description:
      'Drum Channel is the digital education initiative of DW Drums — one of the world\'s leading drum manufacturers. As Design Engineer, I led a full platform re-architecture in WordPress and PHP, decoupling the e-commerce marketing site from a monolithic internal system that had accumulated significant performance debt. Implemented a componentised front-end architecture and a design system tailored to a younger demographic — improving page load performance, maintainability, and brand cohesion across the platform.',
    tech: ['WordPress', 'PHP', 'UI Design', 'Design Systems', 'Figma', 'GA4', 'Looker Studio'],
    slides: [
      {
        src: drumChannelDesignSystem,
        alt: 'Drum Channel design system overview',
        caption: 'Design System',
        isHero: true,
        darkAnnotations: true,
        description:
          'Full design system developed to support the Drum Channel platform redesign. Covers component libraries, page templates, navigation patterns, product card layouts, and multi-device screen designs — all aligned to a bold red and black brand direction targeting a younger audience.',
        skills: [
          'WordPress Theme Architecture',
          'PHP (Custom Component Development)',
          'WordPress Template Hierarchy',
          'JavaScript (ES6+)',
          'SCSS/CSS',
          'UX Research Synthesis',
          'Information Architecture',
          'Design System Implementation',
        ],
        annotations: [
          { x: 2,  y: 12, label: 'Navigation & header components', dir: 'right' },
          { x: 98, y: 20, label: 'Hero & feature templates',       dir: 'left'  },
          { x: 2,  y: 45, label: 'Product & media components',     dir: 'right' },
          { x: 98, y: 55, label: 'Page layout patterns',           dir: 'left'  },
          { x: 2,  y: 82, label: 'Mobile screen designs',          dir: 'right' },
        ],
        assets: [
          {
            id: 'design-system',
            label: 'Design System',
            type: 'image',
            src: drumChannelDesignSystem,
            alt: 'Drum Channel design system overview',
            darkAnnotations: true,
            annotations: [
              { x: 2,  y: 12, label: 'Navigation & header components', dir: 'right' },
              { x: 98, y: 20, label: 'Hero & feature templates',       dir: 'left'  },
              { x: 2,  y: 45, label: 'Product & media components',     dir: 'right' },
              { x: 98, y: 55, label: 'Page layout patterns',           dir: 'left'  },
              { x: 2,  y: 82, label: 'Mobile screen designs',          dir: 'right' },
            ],
          },
          {
            id: 'dashboard-redesign',
            label: 'Dashboard Redesign',
            type: 'image',
            src: drumchannelDashboardRedesign,
            alt: 'Drum Channel member dashboard redesign',
            description:
              'Led end-to-end dashboard re-architecture from UX discovery through production implementation. Synthesized customer feedback into task-flow and information-architecture updates, then implemented the redesigned experience with modular custom PHP components (reusable layout blocks, card modules, and navigation primitives) to reduce template duplication, improve maintainability, and accelerate iteration velocity for new feature releases.',
            skills: [
              'WordPress MU Plugin Development',
              'Shortcode-Based Modular Components',
              'Frontend Dashboard Architecture',
              'JavaScript DOM Orchestration',
              'MemberPress Role/Membership UX',
              'Personalized UI via `user_meta`',
              'LearnDash Progress + Completion Views',
              'Multi-Source CPT + Taxonomy Aggregation',
              'AJAX Workflow Endpoints',
              'Messaging/Notification Flow Integration',
              'Data Modeling (`post_meta` + `user_meta`)',
              '`WP_Query` + Transient Performance Tuning',
              'Responsive Desktop/Mobile Dashboard UX',
              'Runtime Resilience + Fallback Handling',
            ],
            implementationHighlights: [
              'Built a modular WordPress dashboard system using MU plugins + shortcodes with independently deployable components for carousel, progress, recent views, feature discovery, and role-specific tabs.',
              'Implemented role and membership-aware UX/routing via MemberPress checks (ROT vs standard users), dynamic tab behavior, and personalized destination pages.',
              'Engineered a content aggregation pipeline across custom post types (`sfwd-courses`, `dcplayalong`, `premiumplayalongs`, `masterclasspost`, `challengepost`, `episodes`, `weeklydrop`) using taxonomy and ACF-driven inclusion rules.',
              'Applied query/render performance tuning with transient-based HTML/query caching, reduced query overhead (`fields: ids`, `no_found_rows`), cache priming (`update_object_term_cache`, `update_meta_cache`, `_prime_post_caches`), and per-course transients for expensive lesson/topic counts.',
              'Developed adaptive first-time vs returning-user experiences using `dashboard_login_count` and `dashboard_first_login` user meta to reorder modules and switch messaging (`Get Started` vs `Featured`).',
              'Built robust client-side tab orchestration with dynamic DOM injection, custom icon replacement, and navigation overrides via `data-tab_id` contracts, including fallback handling for delayed/AJAX nodes with `MutationObserver` and timed retries.',
              'Implemented cross-device dashboard variants (desktop/mobile-specific shortcode render paths), including modal onboarding flows, touch handlers, and responsive layout swaps.',
              'Integrated LearnDash deeply for progress and enrollment workflows: topic-to-lesson-to-course resolution, automatic required-course enrollment, and per-user completion/progress metrics surfaced in dashboard cards.',
              'Implemented UX state persistence with `localStorage` (e.g., collapsed/expanded lesson panel state) and synchronized behavior across desktop and mobile dashboard instances.',
            ],
            annotations: [
              { x: 7,  y: 20, label: 'Role-based left navigation IA',          dir: 'right' },
              { x: 32, y: 10, label: 'Featured content module (reusable block)', dir: 'right' },
              { x: 50, y: 26, label: 'Mentor CTA and support component',         dir: 'left'  },
              { x: 54, y: 43, label: 'Progress and lesson card system',          dir: 'left'  },
              { x: 36, y: 67, label: 'Explore widgets built as PHP components',  dir: 'right' },
            ],
          },
          {
            id: 'academy-page-design',
            label: 'Academy Page Design',
            type: 'image',
            src: drumchannelAcademyPageDesign,
            alt: 'Drum Channel academy page design with course discovery patterns',
            description:
              'Designed and developed the Academy page to make catalog exploration easier across courses, lessons, and masterclasses. The experience organizes content by category and instructor search patterns (informed in part by Codecademy-style discovery models), reducing a known user pain point around finding relevant content. The page architecture was also structured to strengthen SEO and AEO by improving crawlable content organization, topical hierarchy, and discoverability pathways.',
            skills: [
              'WordPress MU Plugins + Shortcodes',
              'PHP (Backend Logic + Data Shaping)',
              'JavaScript + jQuery (AJAX UI)',
              'WordPress AJAX (`wp_ajax` / `wp_ajax_nopriv`)',
              'Advanced `WP_Query` + `tax_query`',
              'Taxonomy Modeling (Teacher / Difficulty / Topic)',
              'Normalized Search + Query-Time Matching',
              'Caching (Transients + Invalidation Versioning)',
              'User State Persistence (`user_meta`)',
              'Pagination + Dynamic Content Loading',
              'Performance Optimization (Metadata + Query Overhead)',
              'LearnDash Integration (Progress + Metadata)',
              'Responsive UI Engineering (Mobile Filter Drawers)',
              'WordPress Admin Tooling + Settings',
            ],
            implementationHighlights: [
              'Architected a custom Academy discovery experience in WordPress using shortcode-driven rendering plus AJAX-backed filtering, pagination, and dynamic result replacement.',
              'Implemented multi-criteria filtering across custom taxonomies (difficulty, instructor, topics) and content types, with server-side query composition (`WP_Query`/`tax_query`) and business-rule overrides.',
              'Built a search pipeline that normalizes text and matches across titles and instructor taxonomy terms, then merges with filtered result sets for precise content discovery.',
              'Designed a cache strategy combining filter-state HTML caching and transient-based metadata caches to reduce expensive term/meta lookups and improve page responsiveness.',
              'Added cache invalidation/versioning controls (publish hooks + cache-version bumps) and admin tooling for operational maintenance.',
              'Implemented personalized state persistence by storing per-user search/filter parameters in user meta, including admin reset/introspection utilities for support workflows.',
              'Separated user-specific progress rendering from cacheable page HTML via batched AJAX progress hydration, enabling performant pages without sacrificing personalized LearnDash progress.',
              'Delivered responsive filter UX (drawer, clear/reset, pagination, loading states, back-button recovery) with robust client-side state management.',
            ],
            ctaUrl: 'https://hello.drumchannel.com/academy/',
            ctaLabel: 'View Live Academy Page',
            annotations: [
              { x: 48, y: 9,  label: 'Hero + value proposition entry point', dir: 'left'  },
              { x: 16, y: 43, label: 'Category and filter-based discovery',   dir: 'right' },
              { x: 55, y: 43, label: 'Instructor-led course browse grid',     dir: 'left'  },
              { x: 38, y: 78, label: 'Structured sections improve SEO/AEO',   dir: 'right' },
            ],
          },
          {
            id: 'roland-cloud-drip-campaign',
            label: 'Roland Cloud Drip Campaign',
            type: 'image',
            src: drumchannelRolandEmailMobile,
            compareSrc: drumchannelRolandEmailDesktop,
            alt: 'Roland Cloud partnership drip campaign mobile email design',
            compareAlt: 'Roland Cloud partnership drip campaign desktop email design',
            primaryLabel: 'Mobile',
            compareLabel: 'Desktop',
            description:
              'Designed and developed a 5-week Mailchimp drip campaign for the Roland Cloud partnership, delivering coordinated mobile and desktop experiences. Built the supporting WordPress experience with custom components and Gutenberg content structures to keep campaign messaging, landing paths, and discovery modules consistent across email and on-site touchpoints.',
            annotations: [
              { x: 48, y: 14, label: 'Week 1 hero narrative',             dir: 'right' },
              { x: 46, y: 32, label: 'Drip content module stack',          dir: 'right' },
              { x: 48, y: 52, label: 'CTA cadence in mobile flow',         dir: 'right' },
              { x: 48, y: 72, label: 'Offer + trust blocks',               dir: 'right' },
              { x: 48, y: 88, label: 'Footer conversion touchpoint',       dir: 'right' },
            ],
            compareAnnotations: [
              { x: 34, y: 16, label: 'Desktop hero + visual hierarchy',    dir: 'right' },
              { x: 46, y: 36, label: 'Content blocks for weekly drops',     dir: 'right' },
              { x: 62, y: 55, label: 'Feature/education sectioning',        dir: 'left'  },
              { x: 48, y: 74, label: 'Pricing + offer conversion area',     dir: 'right' },
              { x: 52, y: 90, label: 'Final action + footer continuity',    dir: 'left'  },
            ],
          },
          {
            id: 'instructor-booking-flow',
            label: 'Instructor Booking Flow',
            type: 'image',
            src: drumchannelInstructorBookingFlow,
            alt: 'Drum Channel instructor booking flow state exploration',
            darkAnnotations: true,
            centerInFrame: true,
            description:
              'Designed the full booking flow state for Drum Channel instructors to begin implementing live 1:1 remote lessons with students. This work maps the end-to-end experience from discovery and scheduling through checkout and confirmation, giving engineering a complete UI-state system to move the feature into production.',
            annotations: [
              { x: 6,  y: 20, label: 'Entry state + lesson discovery',         dir: 'right' },
              { x: 34, y: 14, label: 'Step-by-step booking progression',        dir: 'right' },
              { x: 58, y: 14, label: 'Billing and payment capture states',      dir: 'left'  },
              { x: 80, y: 22, label: 'Instructor profile + selection states',   dir: 'left'  },
              { x: 93, y: 18, label: 'Confirmation and post-booking outcomes',  dir: 'left'  },
            ],
          },
          {
            id: 'light-theme-style-guide',
            label: 'Light Theme Style Guide',
            type: 'image',
            src: drumchannelLightThemeStyleGuide,
            alt: 'Drum Channel light theme internal product style guide exploration',
            centerInFrame: true,
            darkAnnotations: true,
            ctaUrl: 'https://www.figma.com/design/JY7qrbNdychx8W7SLcwZWl/Light-Style-Guide?node-id=1-1056&t=1VQfeN7cHjTRZKYV-1',
            ctaLabel: 'View Light Style Guide',
            description:
              'Created as a design exploration for the team to evaluate a transition toward a light theme internal product experience. This style guide maps key UI foundations including color roles, component treatments, typography hierarchy, and layout patterns to support implementation planning.',
            annotations: [
              { x: 18, y: 18, label: 'Color roles + palette tokens',      dir: 'right' },
              { x: 36, y: 34, label: 'Component states + controls',       dir: 'right' },
              { x: 58, y: 50, label: 'Form and input treatment system',   dir: 'left'  },
              { x: 75, y: 66, label: 'Card/layout pattern exploration',   dir: 'left'  },
              { x: 86, y: 82, label: 'Internal product UI direction',     dir: 'left'  },
            ],
          },
          {
            id: 'business-analysis-data',
            label: 'Business Analysis Data',
            type: 'image',
            src: drumchannelBusinessAnalysisSheet,
            alt: 'Drum Channel source business analysis sheet',
            description:
              'Raw engagement and membership metrics workbook used for business analysis across page-level traffic and visit duration trends. I structured this source data and ported the key outputs into Google Looker for clearer executive-facing visualizations and reporting.',
            annotations: [
              { x: 14, y: 6,  label: 'Monthly source metrics',            dir: 'right' },
              { x: 34, y: 6,  label: 'Page views and sessions',           dir: 'right' },
              { x: 48, y: 6,  label: 'Average visit duration signals',    dir: 'right' },
              { x: 12, y: 98, label: 'Tabs feeding Looker dashboards',    dir: 'right' },
            ],
          },
          {
            id: 'learndash-business-dashboard',
            label: 'LearnDash Business Dashboard',
            type: 'image',
            src: drumchannelLearndashDashboard,
            alt: 'LearnDash analytics dashboard for Drum Channel',
            description:
              'Business analysis dashboard built from LearnDash platform data to support product and content direction decisions. I used SQL queries in phpMyAdmin to compile and normalize the source metrics, then surfaced enrollment, completion, engagement, and time-to-complete insights for strategic planning.',
            annotations: [
              { x: 8,  y: 16, label: 'Course KPI summary',              dir: 'right' },
              { x: 52, y: 28, label: 'Enrollment and completion trends', dir: 'left'  },
              { x: 64, y: 58, label: 'Engagement depth metrics',         dir: 'left'  },
              { x: 36, y: 86, label: 'Course-level decision table',      dir: 'right' },
            ],
          },
          {
            id: 'looker-course-visuals',
            label: 'Looker Studio Visuals',
            type: 'image',
            src: drumchannelLookerScatter,
            alt: 'Looker Studio scatter and bubble chart for LearnDash course activity',
            description:
              'Google Looker Studio visualization used to compare course completion rate against average days to complete, with bubble size indicating relative course popularity. This view helps quickly identify high-demand courses with low completion efficiency, spotlight long-duration outliers, and prioritize content/product interventions based on both engagement and success outcomes.',
            annotations: [
              { x: 18, y: 78, label: 'X-axis: avg days to complete',      dir: 'right' },
              { x: 4,  y: 52, label: 'Y-axis: completion rate (%)',       dir: 'right' },
              { x: 26, y: 34, label: 'Bubble size = course popularity',   dir: 'right' },
              { x: 73, y: 41, label: 'Long-duration completion outliers', dir: 'left'  },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'visual-studio-engineer',
    number: '06',
    client: 'Visual Sound Engineer',
    title: 'Visual Sound Engineer',
    role: 'Designer',
    year: '2026',
    description:
      'Design-led client engagement focused on UX/UI exploration and visual system direction. Delivered interface concepts, interaction patterns, and layout specifications to support implementation handoff.',
    tech: ['UX Design', 'UI Design', 'Product Design', 'Prototyping', 'Design Systems'],
    slides: [
      {
        src: vseInformationArchitecture,
        alt: 'Visual Studio Engineer high-level information architecture map',
        caption: 'High-Level Information Architecture',
        isHero: true,
        description:
          'High-level information architecture outlining marketing pathways for product features and core business information. This deliverable defines page-group hierarchy, audience-specific routes, and top-level navigation structure to support clearer discovery and future UX/UI execution.',
        annotations: [
          { x: 30, y: 14, label: 'Homepage navigation hub',        dir: 'right' },
          { x: 19, y: 31, label: 'Audience-specific paths',        dir: 'right' },
          { x: 40, y: 46, label: 'Product feature marketing',      dir: 'right' },
          { x: 56, y: 61, label: 'Business + trust information',   dir: 'left'  },
          { x: 78, y: 77, label: 'Support/contact conversion',     dir: 'left'  },
        ],
        assets: [
          {
            id: 'vse-hi-level-ia',
            label: 'Hi-level Information Architecture',
            type: 'image',
            src: vseInformationArchitecture,
            centerInFrame: true,
            alt: 'Visual Studio Engineer high-level information architecture map',
            description:
              'High-level information architecture outlining marketing pathways for product features and core business information. This deliverable defines page-group hierarchy, audience-specific routes, and top-level navigation structure to support clearer discovery and future UX/UI execution.',
            annotations: [
              { x: 30, y: 14, label: 'Homepage navigation hub',        dir: 'right' },
              { x: 19, y: 31, label: 'Audience-specific paths',        dir: 'right' },
              { x: 40, y: 46, label: 'Product feature marketing',      dir: 'right' },
              { x: 56, y: 61, label: 'Business + trust information',   dir: 'left'  },
              { x: 78, y: 77, label: 'Support/contact conversion',     dir: 'left'  },
            ],
          },
          {
            id: 'vse-persona-driven-wireframe',
            label: 'Persona-Driven Wireframe',
            type: 'image',
            src: vseWireframeResearch,
            compareSrc: vseCoreAudiencePanel,
            alt: 'VSE multi-page wireframe based on user persona research',
            compareAlt: 'VSE core audience research panel',
            primaryLabel: 'Wireframe',
            compareLabel: 'Core Audience Research',
            ctaUrl: 'https://www.figma.com/board/0xL4qQ4NQg9GNg8SULwp3L/VSE-Wireframe-V3--Copy-?node-id=0-1&t=2vlkAmeoUtxsB5H1-1',
            ctaLabel: 'View Wireframe Board',
            description:
              'Wireframe screen set built from user persona and core audience research. This phase translated research insights into page structure, section hierarchy, and messaging priorities so product-feature marketing and business information would map directly to the needs of target users.',
            annotations: [
              { x: 18, y: 18, label: 'Homepage framework',          dir: 'right' },
              { x: 35, y: 34, label: 'Business/engineer journey',   dir: 'right' },
              { x: 56, y: 50, label: 'Support IA',                  dir: 'left'  },
              { x: 72, y: 66, label: 'Plans/pricing conversion',    dir: 'left'  },
              { x: 86, y: 82, label: 'About + trust structure',     dir: 'left'  },
            ],
          },
          {
            id: 'vse-login-account-wireframes',
            label: 'Login + Account Portal Wireframes',
            type: 'image',
            src: vseLoginAccountWireframes,
            alt: 'VSE login flow and account portal wireframes',
            centerInFrame: true,
            description:
              'Designed end-to-end authentication and account-management wireframes covering login entry states, sign-in, password reset, and the authenticated account portal experience. This work established the UX flow, screen hierarchy, and functional touchpoints required for implementation, reducing ambiguity for engineering handoff and helping ensure a secure, intuitive self-service experience for users after onboarding.',
            annotations: [
              { x: 13, y: 27, label: 'Login entry state',               dir: 'right' },
              { x: 37, y: 27, label: 'Sign-in form behavior',            dir: 'right' },
              { x: 66, y: 27, label: 'Password reset path',              dir: 'left'  },
              { x: 18, y: 66, label: 'Authenticated account portal',     dir: 'right' },
              { x: 36, y: 58, label: 'Flow connection to account state', dir: 'right' },
            ],
          },
          {
            id: 'vse-logo-rebrand',
            label: 'Logo Rebrand',
            type: 'image',
            src: vseLogoRebrand,
            alt: 'Visual Sound Engineer logo rebrand exploration',
            centerInFrame: true,
            description:
              'Logo rebrand exploration developed from theme requirements specified by marketing, including updated color roles, typography direction, and hero lockup variants for consistent brand presentation.',
          },
          {
            id: 'vse-style-guide',
            label: 'Style Guide',
            type: 'image',
            src: vseStyleguide,
            alt: 'Visual Sound Engineer UI style guide',
            centerInFrame: true,
            description:
              'Comprehensive UI style guide for VSE defining color tokens, typography scale, iconography patterns, and grid standards, designed to meet the requirement for a clean and modern visual direction. This systemized foundation improved visual consistency and gave engineering/design a shared reference for scalable implementation.',
          },
          {
            id: 'vse-large-component-library',
            label: 'Large Component Library',
            type: 'image',
            src: vseLargeComponentLibrary,
            alt: 'Visual Sound Engineer large component library and light state patterns',
            centerInFrame: true,
            darkAnnotations: true,
            description:
              'Large component library exploration documenting reusable UI blocks, light-state variants, and layout modules for marketing and product surfaces. Built to accelerate design-to-dev handoff and reduce one-off component creation across the VSE experience.',
            skills: [
              'Figma Component System Design',
              'Reusable Components in Figma',
              'Variant-Driven Component Modeling',
              'Design Token Application',
              'Scalable UI Pattern Libraries',
            ],
            annotations: [
              { x: 20, y: 20, label: 'Reusable hero/module patterns',      dir: 'right' },
              { x: 45, y: 36, label: 'Variant states across components',    dir: 'right' },
              { x: 63, y: 52, label: 'Card and content block library',      dir: 'left'  },
              { x: 78, y: 68, label: 'Flow-ready UI sections',              dir: 'left'  },
              { x: 84, y: 84, label: 'Consistent reusable foundations',     dir: 'left'  },
            ],
          },
          {
            id: 'vse-final-landing-pages',
            label: 'Finalized Landing Pages',
            type: 'image',
            src: vseLandingPageV6,
            compareSrc: vseLandingPageV7,
            alt: 'VSE finalized landing page v6',
            compareAlt: 'VSE finalized landing page v7',
            primaryLabel: 'Final Landing V6',
            compareLabel: 'Final Landing V7',
            description:
              'Two finalized landing page directions prepared for handoff, shown side-by-side to compare structure, messaging rhythm, and conversion hierarchy across major sections.',
            annotations: [
              { x: 36, y: 12, label: 'Hero + core value proposition',      dir: 'right' },
              { x: 54, y: 30, label: 'Product explanation block',           dir: 'left'  },
              { x: 40, y: 50, label: 'Audience segment pathways',           dir: 'right' },
              { x: 56, y: 70, label: 'Mission + trust content',             dir: 'left'  },
              { x: 50, y: 90, label: 'Primary conversion footer CTA',       dir: 'right' },
            ],
            compareAnnotations: [
              { x: 34, y: 12, label: 'Refined hero hierarchy',              dir: 'right' },
              { x: 52, y: 30, label: 'Updated feature storytelling',         dir: 'left'  },
              { x: 38, y: 50, label: 'Segment-focused content flow',         dir: 'right' },
              { x: 54, y: 70, label: 'Mission + social proof continuity',    dir: 'left'  },
              { x: 48, y: 90, label: 'Final conversion call-to-action',      dir: 'right' },
            ],
          },
          {
            id: 'vse-full-marketing-designs',
            label: 'Full Marketing Designs',
            type: 'image',
            src: vseMarketingPagesFull,
            compareSrc: vseMarketingPagesOverlay,
            overlayCompare: true,
            overlayWidthPct: 18,
            overlayRightPct: 4,
            overlayBottomPct: 7,
            alt: 'VSE full marketing inner page design system',
            compareAlt: 'VSE focused learning center marketing page variation',
            primaryLabel: 'Full Marketing Page Set',
            compareLabel: 'Learning Center Focus',
            ctaUrl: 'https://www.figma.com/design/OjA1rlL8toUwZI1dUtfX2G/Site-Design--Copy-?node-id=0-1&t=YdXBouU9SicfFNLK-1',
            ctaLabel: 'View Design File',
            description:
              'Includes all major marketing inner pages (support, pricing, about, learning center, and pages geared to the two primary audiences: venues and sound engineers) with finalized copy and production-ready page structure.',
            annotations: [
              { x: 12, y: 18, label: 'Support/contact page cluster',       dir: 'right' },
              { x: 34, y: 18, label: 'Audience-specific inner pages',       dir: 'right' },
              { x: 56, y: 18, label: 'Pricing page variants',               dir: 'left'  },
              { x: 82, y: 18, label: 'About page storytelling sequence',    dir: 'left'  },
              { x: 26, y: 56, label: 'Venue + sound engineer pathways',     dir: 'right' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'agavos-group',
    number: '07',
    client: 'Agavos Group',
    title: 'Agavos Group',
    role: 'Web Designer',
    year: '2026',
    description:
      'Website redesign for a boutique recruiting company focused on the solar engineering market and job search coaching. The project centered on clarifying service positioning, improving candidate/employer pathways, and modernizing the visual experience to support lead generation and trust.',
    tech: ['Web Design', 'UX Strategy', 'Information Architecture', 'Brand Positioning', 'Conversion-Focused Layouts'],
    slides: [
      {
        src: agavosDesignAssetsOverview,
        alt: 'Agavos Group website redesign design assets overview',
        caption: 'Website Redesign',
        isHero: true,
        description:
          'Redesign concept for Agavos Group focused on audience-specific messaging, clear service navigation, and streamlined conversion flows for recruiting inquiries and coaching engagement.',
        annotations: [
          { x: 9,  y: 14, label: 'Homepage narrative direction',        dir: 'right' },
          { x: 34, y: 24, label: 'Career Growth School variants',       dir: 'right' },
          { x: 56, y: 34, label: 'Recruiting + pricing page system',    dir: 'left'  },
          { x: 82, y: 20, label: 'About page trust content',            dir: 'left'  },
          { x: 26, y: 60, label: 'Venue/sound engineer audience path',  dir: 'right' },
        ],
        assets: [
          {
            id: 'agavos-full-design-assets',
            label: 'Full Design Assets',
            type: 'image',
            src: agavosDesignAssetsOverview,
            alt: 'Agavos Group website redesign design assets overview',
            ctaUrl: 'https://www.figma.com/design/s8LmAMafzXRmT8WaPOOkZn/Agavos-Hero?node-id=0-1&t=ZOEaPrpC0c46xAvI-1',
            ctaLabel: 'View Design File',
            description:
              'Consolidated design-asset view of the Agavos redesign, covering homepage, Career Growth School variants, recruiting, pricing, about, and audience-specific pages with finalized structure and copy direction.',
            annotations: [
              { x: 9,  y: 14, label: 'Homepage narrative direction',        dir: 'right' },
              { x: 34, y: 24, label: 'Career Growth School variants',       dir: 'right' },
              { x: 56, y: 34, label: 'Recruiting + pricing page system',    dir: 'left'  },
              { x: 82, y: 20, label: 'About page trust content',            dir: 'left'  },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'first-republic-bank',
    number: '08',
    client: 'First Republic Bank',
    title: 'First Republic Bank',
    role: 'Design Engineer',
    year: '2026',
    description:
      'Case study covering TMTS (Treasury Management Tracking Services) user flows and prototypes for internal escrow-management tools. Note: First Republic Bank was acquired by JPMorgan Chase. Scope combined UX design with production-oriented Angular implementation and API workflow integration via Postman.',
    tech: ['Angular', 'TypeScript', 'Postman', 'API Integration', 'UX Prototyping', 'User Flow Design', 'Treasury Management', 'Escrow Operations'],
    slides: [
      {
        panelTitle: 'TMTS · User Flows + Prototypes',
        alt: 'First Republic Bank TMTS case study preview',
        caption: 'TMTS Internal Escrow Tools',
        isHero: true,
        panelDescription:
          'User-flow and prototype work for Treasury Management Tracking Services (TMTS), designed for internal escrow operations. Each asset in this case study includes the Angular development work required to operationalize the design.',
        description:
          'Showcases end-to-end workflow mapping and prototype direction for TMTS internal tools, including how the interface transitions into Angular components, state handling, and API-connected behaviors required for escrow-management use cases.',
        skills: ['Angular', 'TypeScript', 'RxJS', 'Component Architecture', 'REST API Integration', 'Postman', 'Interaction Design', 'Internal Tooling UX'],
        assets: [
          {
            id: 'tmts-flows-and-prototypes',
            label: 'TMTS Flows + Prototypes',
            type: 'image',
            src: frbTmtsUserPrerequisites,
            centerInFrame: true,
            restricted: true,
            restrictedMessage:
              'This internal banking workflow artifact is blurred publicly. Access is available for active interview processes and client-approved review requests.',
            requestAccessEmailSubject: 'Request access: First Republic Bank TMTS Flows + Prototypes',
            alt: 'TMTS user prerequisite screens and setup flow',
            description:
              'First asset in the TMTS case study showing user prerequisites and setup states required before users can proceed through treasury tracking workflows. Implementation planning maps these prerequisite interactions to Angular component flows, state transitions, and API-driven validation checks tested through Postman.',
            annotations: [
              { x: 18, y: 22, label: 'Prerequisite entry screen',      dir: 'right' },
              { x: 44, y: 22, label: 'Required data pre-check states', dir: 'right' },
              { x: 70, y: 22, label: 'Validation/error handling path', dir: 'left'  },
              { x: 40, y: 58, label: 'Ready-state confirmation view',  dir: 'right' },
            ],
            implementationHighlights: [
              'Translate each flow into Angular feature modules with reusable, typed components for internal escrow workflows.',
              'Define route guards, role-aware navigation, and state transitions for treasury operations across multi-step tasks.',
              'Implement reactive forms with validation/error states aligned to prototype behavior and operational constraints.',
              'Wire REST endpoints through Angular services with typed models, loading/error states, and resilient retry handling.',
              'Use Postman collections to verify contract assumptions, edge cases, and payload mappings before UI integration.',
            ],
          },
          {
            id: 'tmts-api-subscription-flows',
            label: 'TMTS API Subscription Flows',
            type: 'image',
            src: frbApiSubscriptionFlows,
            centerInFrame: true,
            restricted: true,
            restrictedMessage:
              'This asset includes sensitive internal API enrollment and rejection-state flows. Public view is intentionally blurred; full review is available upon request.',
            requestAccessEmailSubject: 'Request access: First Republic Bank TMTS API Subscription Flows',
            alt: 'TMTS API subscription flows and modal states',
            description:
              'Detailed TMTS interaction sequence for API subscription management. This version was fully prototyped in Figma before implementation, then translated into Angular workflows for enrollment, modal actions, and historical audit visibility inside the payments API portal.',
            annotations: [
              { x: 12, y: 22, label: '1) Preboarding screen for enrollment date', dir: 'right' },
              { x: 33, y: 22, label: '2) Pending API request landing page',        dir: 'right' },
              { x: 56, y: 22, label: '3) Add API subs modal + accept/edit/reject', dir: 'left'  },
              { x: 82, y: 22, label: '4) Edit modal state',                         dir: 'left'  },
              { x: 12, y: 60, label: '5) Reject modal state',                       dir: 'right' },
              { x: 56, y: 60, label: '6) Potential API rejection history flow',     dir: 'left'  },
              { x: 82, y: 60, label: '7) Alternate rejection-history path',         dir: 'left'  },
            ],
            implementationHighlights: [
              'Implement modal-driven state transitions in Angular with typed action models for Add/Edit/Reject outcomes.',
              'Drive pending/enrolled/rejected states from API status fields and map them to conditional UI states in component templates.',
              'Use reactive form patterns for enrollment and edit paths, including validation and controlled submit/disable states.',
              'Wire API service calls and error/success handling through Angular services; validate payload/response contracts in Postman.',
              'Persist and render rejection history timelines with table/detail patterns for internal audit and operator follow-up.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'imforza',
    number: '09',
    client: 'imFORZA',
    clientUrl: 'https://www.imforza.com',
    title: 'imFORZA Marketing Agency',
    role: 'Design Engineer',
    year: '2026',
    description:
      'Case study for imFORZA, a growth-focused marketing agency serving SMBs. Work centered on website/marketing experience design, service-page clarity, and conversion-oriented UX patterns to support lead generation and long-term engagement.',
    tech: ['Web Design', 'UX Strategy', 'Conversion Optimization', 'Information Architecture', 'Marketing Systems', 'WordPress'],
    showProjectTabs: true,
    slides: [
      {
        panelTitle: 'Nipit',
        projectViewTitle: 'Project 1: NIPIT',
        alt: 'imFORZA NIPIT project preview',
        caption: 'NIPIT',
        isHero: true,
        panelDescription:
          'Design and development project for NIPIT featuring Figma-based UI direction and WordPress implementation for production use.',
        description:
          'NIPIT project work spanning UX/UI design in Figma and implementation in WordPress. Focused on modular page architecture, conversion-first content hierarchy, and responsive behavior across marketing flows.',
        skills: ['Figma', 'WordPress', 'Responsive Web Design', 'Content Architecture', 'Conversion UX'],
        assets: [
          {
            id: 'nipit-assets',
            label: 'NIPIT Assets',
            type: 'image',
            src: imforzaNipitHomepage,
            alt: 'NIPIT homepage design',
            description:
              'Homepage design for NIPIT focused on parent-facing service clarity, trust cues, and conversion-focused section flow.',
            annotations: [
              { x: 28, y: 12, label: 'Hero with primary CTA focus',       dir: 'right' },
              { x: 24, y: 34, label: 'Service/value proposition section',  dir: 'right' },
              { x: 30, y: 54, label: 'Feature and benefit storytelling',   dir: 'right' },
              { x: 32, y: 72, label: 'Social proof and testimonials',      dir: 'right' },
              { x: 28, y: 90, label: 'Footer conversion touchpoint',       dir: 'right' },
            ],
            implementationHighlights: [
              'Built reusable WordPress sections/components from Figma specifications for scalable page composition.',
              'Implemented responsive templates and structured content blocks aligned to conversion and lead-capture paths.',
              'Mapped design states to maintainable WordPress editing patterns for efficient marketing-team updates.',
            ],
          },
          {
            id: 'nipit-inner-pages-ia',
            label: 'Inner Pages + IA',
            type: 'image',
            src: imforzaNipitInnerPagesIa,
            alt: 'NIPIT inner page ecosystem and information architecture overview',
            ctaUrl: 'https://www.figma.com/design/tNu4piXItePo7Fgvp6S1nD/Homepage?node-id=440-11&t=aYGbNMqsDChCvbGa-1',
            ctaLabel: 'View Design File',
            description:
              'Inner-page asset overview documenting the old site baseline and the re-organization of product information through updated information architecture. This view maps page relationships, content grouping, and navigation structure to support clearer discovery and conversion flow.',
            annotations: [
              { x: 8,  y: 16, label: 'Homepage and legacy baseline',      dir: 'right' },
              { x: 34, y: 16, label: 'Core product information grouping',  dir: 'right' },
              { x: 58, y: 16, label: 'Support/reviews and utility pages',  dir: 'left'  },
              { x: 84, y: 16, label: 'Policy, legal, and edge pages',      dir: 'left'  },
              { x: 16, y: 70, label: 'IA-driven inner page structure',     dir: 'right' },
            ],
            implementationHighlights: [
              'Implemented IA updates in WordPress templates to align navigation and category relationships with redesigned content hierarchy.',
              'Built reusable page sections for product details, support content, and trust-building modules to reduce duplicated layout logic.',
              'Mapped legacy URLs/content to updated structures to preserve discoverability while improving page clarity and conversion flow.',
            ],
          },
          {
            id: 'nipit-mobile-design-assets',
            label: 'Mobile Design Assets',
            type: 'image',
            src: imforzaNipitMobileDesignAssets,
            alt: 'NIPIT mobile design asset overview',
            centerInFrame: true,
            ctaUrl: 'https://nipit.com',
            ctaLabel: 'View Live Website',
            description:
              'Mobile design asset overview for NIPIT covering responsive page composition, mobile-first content hierarchy, and conversion-focused touchpoint placement across key commerce and informational screens.',
            implementationHighlights: [
              'Implemented responsive WordPress templates optimized for mobile content flow and touch-friendly CTA placement.',
              'Mapped desktop components to mobile variants while preserving hierarchy, readability, and conversion intent.',
              'Validated mobile breakpoints and section behavior to maintain consistent UX across product, support, and checkout pathways.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'antarestech',
    number: '10',
    client: 'AntaresTech',
    clientUrl: 'https://www.antarestech.com',
    title: 'Auto-Tune Subscription Model',
    role: 'Design Engineer',
    year: '2023',
    description:
      'Case study for AntaresTech, creator of Auto-Tune. Built a brand-aligned wireframing system in Figma to map the new subscription model across marketing pages and customer-account flows, then partnered with engineering to implement rollout-ready updates in WordPress/PHP and Vue/Vuex.',
    tech: ['Figma', 'WordPress', 'PHP', 'Custom Components', 'Divi Builder', 'Vue', 'Vuex', 'Subscription UX'],
    slides: [
      {
        panelTitle: 'Auto-Tune',
        projectViewTitle: 'Subscription Model Rollout',
        src: antarestechDunningWireframe,
        alt: 'AntaresTech Auto-Tune subscription flow wireframe board',
        caption: 'Brand-Aligned Wireframes for Subscription Rollout',
        isHero: true,
        panelDescription:
          'Antares Audio Technologies is the company behind Auto-Tune, one of the most recognized vocal production products in music software. This work captures my role in planning and shipping subscription-model updates across global marketing and account experiences: I created a brand-aligned Figma wireframe system, mapped rollout states for Vocodist and Slice, coordinated handoffs across design/stakeholders/marketing, and supported implementation across WordPress/PHP/Divi marketing surfaces and Vue/Vuex customer-portal flows.',
        description:
          'This system-level wireframe board organized lifecycle screens (marketing entry, plan selection, subscription state transitions, confirmations, and account recovery paths) so teams could sequence implementation without ambiguity. It provided one shared artifact for content strategy, UX logic, and engineering scope.',
        skills: ['Figma', 'Design Systems', 'WordPress', 'PHP', 'Divi Builder', 'Vue', 'Vuex', 'Cross-Functional Delivery'],
        highlightMetrics: [
          'Single source of truth for rollout scope',
          'Marketing + account portal flow alignment',
          'Brand-aligned custom wireframe toolkit',
          'Implementation-ready engineering handoff',
        ],
        assets: [
          {
            id: 'autotune-subscription-wireframe-board',
            label: 'Subscription Wireframe Board',
            type: 'image',
            src: antarestechDunningWireframe,
            alt: 'Auto-Tune subscription model wireframes across marketing and account portal',
            centerInFrame: true,
            description:
              'Comprehensive wireframe map covering the Auto-Tune subscription-model migration, including marketing page entry points, pricing and plan pathways, account-portal updates, payment-state messaging, and dunning recovery touchpoints.',
            annotations: [
              { x: 7, y: 19, label: 'Marketing entry + product value framing', dir: 'right' },
              { x: 24, y: 34, label: 'Plan selection and pricing state patterns', dir: 'right' },
              { x: 43, y: 28, label: 'My Account subscription status states', dir: 'left' },
              { x: 61, y: 30, label: 'Card-expiry + failed-payment recovery path', dir: 'left' },
              { x: 89, y: 34, label: 'Portal variants for plan change/cancel flows', dir: 'left' },
              { x: 44, y: 68, label: 'Mobile portal parity and responsive account UX', dir: 'right' },
            ],
            implementationHighlights: [
              'Modeled subscription state in Vuex with a normalized store (`account`, `subscription`, `billing`, `invoices`, `dunning`) so each portal route consumed one consistent source of truth.',
              'Implemented Vue route guards and async bootstrap actions to fetch account/subscription context before rendering protected billing and plan-management views.',
              'Built reusable Vue components for plan cards, renewal notices, delinquency banners, and payment-method modals with shared prop contracts and event-driven updates.',
              'Added Vuex actions/mutations for upgrade, downgrade, cancellation, reactivation, payment retry, and card update flows; each action mapped directly to API outcomes and UX states defined in the wireframes.',
              'Introduced optimistic UI patterns with rollback handling for plan-change interactions to keep account UX responsive while preserving data integrity.',
              'Created derived Vuex selectors/getters for entitlement-driven UI, enabling marketing-to-portal continuity (feature messaging, locked/unlocked states, and renewal prompts).',
              'Implemented idempotent API integration patterns for billing mutations to prevent duplicate subscription transitions during retries or network instability.',
              'Instrumented event tracking at critical subscription lifecycle points (plan view, checkout intent, failure recovery, successful update) to support funnel and retention analysis.',
              'Delivered marketing-page updates in WordPress using PHP custom components and Divi Builder modules so subscription messaging, pricing blocks, and CTAs stayed consistent with the portal logic.',
              'Mapped wireframe sections to reusable CMS component templates, allowing marketing teams to update launch content without breaking the technical subscription flow architecture.',
            ],
          },
          {
            id: 'autotune-global-marketing-rollout-video',
            label: 'Vocodist + Slice Marketing Rollout Demo',
            type: 'video',
            videoSrc: '/antarestech_marketing_rollout.mp4',
            alt: 'Screen recording of AntaresTech global e-commerce marketing rollout work',
            description:
              'Screen-recorded walkthrough of production marketing work for AntaresTech\'s global e-commerce subscription rollout. This demo shows how Vocodist and Slice launch updates were implemented across campaign and product-marketing pages, how subscription-state messaging was structured through the user journey, and how the new subscription modal was integrated to connect marketing touchpoints with account behavior.',
            videoOverlayTitle: 'Auto-Tune Subscription Marketing Rollout',
            videoOverlayBody:
              'Video demonstrates the live rollout framework for Vocodist and Slice, including launch messaging, conversion-state updates, and the added subscription modal. I led cross-functional handoffs with designers, stakeholders, and marketing teams to align implementation and release execution.',
            implementationHighlights: [
              'Implemented and QAed subscription-related marketing experiences for high-volume global traffic and campaign surfaces.',
              'Delivered WordPress/PHP/Divi updates that aligned product messaging, pricing context, and conversion paths for Vocodist and Slice launches.',
              'Coordinated delivery handoffs across design, stakeholder, and marketing teams to keep implementation, content, and launch readiness synchronized.',
              'Validated subscription modal behavior and downstream account-flow implications so marketing touchpoints matched portal-state expectations.',
            ],
            skills: ['WordPress', 'PHP', 'Divi Builder', 'Vue', 'Vuex', 'Stakeholder Communication', 'Global E-Commerce'],
          },
        ],
        detailSections: [
          {
            title: 'Marketing Implementation',
            items: [
              'WordPress + PHP custom components for pricing and plan-messaging blocks',
              'Divi Builder module extensions for reusable launch and subscription sections',
              'Shared content schema so marketing copy and CTA states matched portal behavior',
            ],
          },
          {
            title: 'Portal Implementation',
            items: [
              'Vue + Vuex state model for plan lifecycle, billing health, and dunning recovery',
              'Componentized account views for upgrade/downgrade/cancel/reactivate pathways',
              'API-driven subscription transitions with validation, rollback, and status feedback',
            ],
          },
        ],
      },
    ],
  },
];

// ─── Annotation overlay ───────────────────────────────────────────────────────

function AnnotationDot({ x, y, label, dir = 'right', index, dark = false }: Annotation & { index: number; dark?: boolean }) {
  const isRight = dir === 'right';
  const LINE_W = 92;
  const lineColor  = dark ? '#1a1a2e' : '#F9D976';
  const labelColor = dark ? 'rgba(10,10,30,0.92)' : 'rgba(254,245,236,0.9)';
  const labelBg = dark ? 'rgba(254,245,236,0.9)' : 'rgba(5,14,96,0.92)';

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 + index * 0.15, duration: 0.4 }}
    >
      {/* Outer pulse ring */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 14, height: 14, transform: 'translate(-50%, -50%)', border: `1px solid ${lineColor}`, opacity: 0.4 }}
        animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.4 }}
      />
      {/* Dot */}
      <div
        className="absolute rounded-full"
        style={{ width: 6, height: 6, transform: 'translate(-50%, -50%)', backgroundColor: lineColor, boxShadow: `0 0 8px ${lineColor}80` }}
      />
      {/* Connector line */}
      <div
        className="absolute"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          width: LINE_W,
          height: 1,
          background: lineColor,
          opacity: 0.75,
          ...(isRight ? { left: 8 } : { right: 8 }),
        }}
      />
      {/* Text label */}
      <div
        className="absolute uppercase"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          ...(isRight ? { left: LINE_W + 16 } : { right: LINE_W + 16 }),
          fontFamily: '"Josefin Sans", sans-serif',
          fontSize: '8px',
          letterSpacing: '0.18em',
          fontWeight: 200,
          color: labelColor,
          background: labelBg,
          border: `1px solid ${dark ? 'rgba(10,10,30,0.18)' : 'rgba(254,245,236,0.22)'}`,
          padding: '4px 6px',
          maxWidth: '160px',
          lineHeight: 1.35,
          whiteSpace: 'normal',
          textWrap: 'balance',
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

// ─── Single case study card ───────────────────────────────────────────────────

function CaseStudyCard({ project }: { project: Project }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeAsset, setActiveAsset] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageOverride, setLightboxImageOverride] = useState<{ src: string; alt: string; annotations?: Annotation[] } | null>(null);
  const [technicalModalOpen, setTechnicalModalOpen] = useState(false);
  const slide = project.slides[activeSlide];
  const displayedPanelDescription = slide.panelDescription ?? project.description;
  const isHero = slide.isHero ?? activeSlide === 0;
  const canPortal = typeof document !== 'undefined';
  const showProjectTabs = Boolean(project.showProjectTabs) && project.slides.length > 1;
  const slideAssets: NonNullable<Slide['assets']> = slide.assets?.length
    ? slide.assets
    : [{
        id: 'default',
        label: slide.caption ?? 'Asset',
        type: (slide.pdfSrc ? 'pdf' : 'image') as 'pdf' | 'image',
        src: slide.src,
        pdfSrc: slide.pdfSrc,
        code: undefined,
        codeLanguage: undefined,
        alt: slide.alt,
        annotations: slide.annotations,
        darkAnnotations: slide.darkAnnotations,
        restricted: undefined,
        restrictedMessage: undefined,
        requestAccessEmailSubject: undefined,
      }];
  const resolvedAssetIndex = Math.min(activeAsset, Math.max(slideAssets.length - 1, 0));
  const currentAsset = slideAssets[resolvedAssetIndex];
  const displayedSkills = currentAsset.skills ?? slide.skills ?? project.tech;
  const displayedDescription = currentAsset.description ?? slide.description;
  const lightboxImageSrc = lightboxImageOverride?.src ?? currentAsset.src;
  const lightboxImageAlt = lightboxImageOverride?.alt ?? currentAsset.alt ?? slide.alt;
  const lightboxImageAnnotations = lightboxImageOverride?.annotations ?? currentAsset.annotations;
  const displayedCtaUrl = currentAsset.ctaUrl ?? slide.ctaUrl;
  const displayedCtaLabel = currentAsset.ctaLabel ?? slide.ctaLabel ?? 'View Documentation';

  const prev = useCallback(() =>
    setActiveSlide(i => (i - 1 + project.slides.length) % project.slides.length), [project.slides.length]);
  const next = useCallback(() =>
    setActiveSlide(i => (i + 1) % project.slides.length), [project.slides.length]);

  useEffect(() => {
    setActiveAsset(0);
    setTechnicalModalOpen(false);
    setLightboxImageOverride(null);
  }, [project.id, activeSlide]);

  useEffect(() => {
    if (!technicalModalOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setTechnicalModalOpen(false);
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [technicalModalOpen]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 min-h-0 max-w-7xl mx-auto w-full px-8 md:px-16 py-4 flex flex-col">

        {/* Client + title row */}
        <div className="flex items-center justify-between mb-5 shrink-0">
          <div className="flex items-center gap-4">
            {project.clientUrl ? (
              <a
                href={project.clientUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FEF5EC]/55 text-[10px] uppercase transition-colors duration-200 hover:text-[#F9D976]/80 group flex items-center gap-1.5"
                style={{ fontFamily: '"Josefin Sans", sans-serif', letterSpacing: '0.3em', fontWeight: 200, cursor: 'none' }}
              >
                {project.client}
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="opacity-40 group-hover:opacity-80 transition-opacity">
                  <path d="M 1,7 L 7,1 M 3,1 L 7,1 L 7,5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            ) : (
              <span
                className="text-[#FEF5EC]/55 text-[10px] uppercase"
                style={{ fontFamily: '"Josefin Sans", sans-serif', letterSpacing: '0.3em', fontWeight: 200 }}
              >
                {project.client}
              </span>
            )}
          </div>
          <span
            className="text-[#FEF5EC]/30 text-[10px] uppercase hidden"
            style={{ fontFamily: '"Josefin Sans", sans-serif', letterSpacing: '0.3em', fontWeight: 200 }}
          >
            {project.role} · {project.year}
          </span>
        </div>

        {/* Two-column layout: fills remaining height */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-start flex-1 min-h-0 overflow-hidden">

          {/* Left — project meta */}
          <div className="lg:w-[26%] shrink-0 flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: '100%' }}>
            <h3
              className="text-[#FEF5EC] uppercase"
              style={{
                fontFamily: '"Poiret One", sans-serif',
                fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)',
                lineHeight: 1.1,
                letterSpacing: '0.08em',
                WebkitTextStroke: '0.5px #FEF5EC',
              }}
            >
              {slide.panelTitle ?? project.title}
            </h3>

            <div className="h-px bg-[#FEF5EC]/12" />

            <p
              className="text-[#FEF5EC]/50 leading-relaxed"
              style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', letterSpacing: '0.02em' }}
            >
              {displayedPanelDescription}
            </p>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2 mt-1">
              {displayedSkills.map(t => (
                <span
                  key={t}
                  className="px-2.5 py-1 border border-[#FEF5EC]/15 text-[#FEF5EC]/55 uppercase"
                  style={{ fontFamily: '"Josefin Sans", sans-serif', fontSize: '8px', letterSpacing: '0.25em', fontWeight: 200 }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Asset tabs within a single project (images / pdfs / code snippets) */}
            {slideAssets.length > 1 && (
              <div className="mt-3">
                <div
                  className="text-[#FEF5EC]/30 text-[9px] uppercase mb-2"
                  style={{ fontFamily: '"Josefin Sans", sans-serif', letterSpacing: '0.28em', fontWeight: 200 }}
                >
                  Project Assets
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {slideAssets.map((asset, i) => (
                    <button
                      key={asset.id}
                      onClick={() => setActiveAsset(i)}
                      className="px-2 py-1 rounded-sm border transition-colors duration-200"
                      style={{
                        cursor: 'none',
                        borderColor: i === resolvedAssetIndex ? 'rgba(249,217,118,0.45)' : 'rgba(254,245,236,0.16)',
                        color: i === resolvedAssetIndex ? 'rgba(249,217,118,0.9)' : 'rgba(254,245,236,0.52)',
                        background: i === resolvedAssetIndex ? 'rgba(249,217,118,0.12)' : 'rgba(254,245,236,0.03)',
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '0.66rem',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {asset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Project tabs (Case Study 3) / slide thumbnails (other projects) */}
            {project.slides.length > 1 && showProjectTabs && (
              <div className="mt-4">
                <div
                  className="text-[#FEF5EC]/30 text-[9px] uppercase mb-3"
                  style={{ fontFamily: '"Josefin Sans", sans-serif', letterSpacing: '0.3em', fontWeight: 200 }}
                >
                  Project Views
                </div>
                <div
                  className="inline-flex rounded-sm border border-[#FEF5EC]/12 p-1 gap-1"
                  style={{ background: 'rgba(254,245,236,0.02)' }}
                >
                  {project.slides.map((s, i) => (
                    <button
                      key={`tab-${i}`}
                      onClick={() => setActiveSlide(i)}
                      className="px-2.5 py-1.5 rounded-sm transition-colors duration-200 text-left"
                      style={{
                        cursor: 'none',
                        background: i === activeSlide ? 'rgba(249,217,118,0.14)' : 'transparent',
                        border: i === activeSlide ? '1px solid rgba(249,217,118,0.45)' : '1px solid transparent',
                      }}
                    >
                      <div
                        className="uppercase"
                        style={{
                          fontFamily: '"Inter", sans-serif',
                          fontSize: '8px',
                          letterSpacing: '0.2em',
                          color: i === activeSlide ? 'rgba(249,217,118,0.92)' : 'rgba(254,245,236,0.45)',
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div
                        className="mt-0.5"
                        style={{
                          fontFamily: '"Inter", sans-serif',
                          fontSize: '0.7rem',
                          lineHeight: 1.25,
                          color: i === activeSlide ? 'rgba(254,245,236,0.9)' : 'rgba(254,245,236,0.58)',
                        }}
                      >
                        {s.projectViewTitle ?? s.caption ?? `Project ${i + 1}`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {project.slides.length > 1 && !showProjectTabs && (
              <div className="mt-4">
                <div
                  className="text-[#FEF5EC]/30 text-[9px] uppercase mb-3"
                  style={{ fontFamily: '"Josefin Sans", sans-serif', letterSpacing: '0.3em', fontWeight: 200 }}
                >
                  {activeSlide === 0 ? 'Flow overview' : project.slides[activeSlide].caption ?? `Screen ${activeSlide}`}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {project.slides.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      className="relative overflow-hidden rounded-sm border transition-all duration-200"
                      style={{
                        cursor: 'none',
                        width: 48,
                        height: 32,
                        borderColor: i === activeSlide ? '#F9D976' : 'rgba(254,245,236,0.12)',
                        boxShadow: i === activeSlide ? '0 0 8px rgba(249,217,118,0.3)' : 'none',
                      }}
                    >
                      {s.src ? (
                        <ImageWithFallback src={s.src} alt={s.alt} className="w-full h-full object-contain object-top" />
                      ) : s.pdfSrc ? (
                        <div
                          className="w-full h-full flex flex-col items-center justify-center gap-0.5"
                          style={{ background: 'rgba(254,245,236,0.04)' }}
                        >
                          <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                            <path d="M 1,1 L 8,1 L 11,4 L 11,13 L 1,13 Z" stroke="rgba(254,245,236,0.35)" strokeWidth="0.8" fill="none"/>
                            <path d="M 8,1 L 8,4 L 11,4" stroke="rgba(254,245,236,0.35)" strokeWidth="0.8"/>
                            <line x1="3" y1="7" x2="9" y2="7" stroke="rgba(249,217,118,0.4)" strokeWidth="0.7"/>
                            <line x1="3" y1="9" x2="7" y2="9" stroke="rgba(249,217,118,0.3)" strokeWidth="0.7"/>
                          </svg>
                          <span style={{ fontSize: 6, color: 'rgba(254,245,236,0.25)', fontFamily: '"Inter", sans-serif', letterSpacing: '0.1em' }}>PDF</span>
                        </div>
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: 'rgba(254,245,236,0.04)' }}
                        >
                          <span style={{ fontSize: 8, color: 'rgba(254,245,236,0.3)', fontFamily: '"Inter", sans-serif' }}>
                            {i + 1}
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — main image with annotations + carousel nav */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Image area — explicit height so flex chain doesn't collapse it */}
            <div
              className="relative w-full"
              style={{ height: '52vh' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  className="absolute inset-0 rounded-sm overflow-hidden flex items-start justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{ background: 'rgba(254,245,236,0.02)', border: '1px solid rgba(254,245,236,0.1)' }}
                >
                  {currentAsset.type === 'pdf' && currentAsset.pdfSrc ? (
                    /* PDF slide — embed renders first page inline, expand opens full doc */
                    <>
                      <embed
                        src={`${currentAsset.pdfSrc}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                        type="application/pdf"
                        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                        title={currentAsset.alt ?? slide.alt}
                      />
                      <button
                        onClick={() => {
                          setLightboxImageOverride(null);
                          setLightboxOpen(true);
                        }}
                        style={{ cursor: 'none' }}
                        className="absolute inset-0 w-full h-full flex items-end justify-end p-3 group"
                      >
                        <motion.div
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          style={{ background: 'rgba(5,14,96,0.8)', border: '1px solid rgba(254,245,236,0.15)', backdropFilter: 'blur(6px)' }}
                        >
                          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <path d="M 7,1 L 10,1 L 10,4" stroke="#FEF5EC" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
                            <path d="M 10,1 L 6,5" stroke="#FEF5EC" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
                            <path d="M 4,10 L 1,10 L 1,7" stroke="#FEF5EC" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
                            <path d="M 1,10 L 5,6" stroke="#FEF5EC" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
                          </svg>
                          <span style={{ fontFamily: '"Josefin Sans", sans-serif', fontSize: '8px', letterSpacing: '0.25em', color: 'rgba(254,245,236,0.65)', fontWeight: 200 }}>
                            VIEW PDF
                          </span>
                        </motion.div>
                      </button>
                    </>
                  ) : currentAsset.type === 'image' && currentAsset.src ? (
                    currentAsset.code ? (
                      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-3 p-3">
                        <div
                          className="relative rounded-sm overflow-hidden border border-[#FEF5EC]/10 flex items-center justify-center min-h-0"
                          style={{ background: 'rgba(254,245,236,0.02)' }}
                        >
                          <img
                            src={currentAsset.src}
                            alt={currentAsset.alt ?? slide.alt}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              width: 'auto',
                              height: 'auto',
                              display: 'block',
                            }}
                          />
                          <button
                            onClick={() => {
                              setLightboxImageOverride(null);
                              setLightboxOpen(true);
                            }}
                            style={{ cursor: 'none' }}
                            className="absolute inset-0 w-full h-full flex items-end justify-end p-3 group"
                          >
                            <motion.div
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              style={{ background: 'rgba(5,14,96,0.8)', border: '1px solid rgba(254,245,236,0.15)', backdropFilter: 'blur(6px)' }}
                            >
                              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                <path d="M 7,1 L 10,1 L 10,4" stroke="#FEF5EC" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
                                <path d="M 10,1 L 6,5" stroke="#FEF5EC" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
                                <path d="M 4,10 L 1,10 L 1,7" stroke="#FEF5EC" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
                                <path d="M 1,10 L 5,6" stroke="#FEF5EC" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
                              </svg>
                              <span style={{ fontFamily: '"Josefin Sans", sans-serif', fontSize: '8px', letterSpacing: '0.25em', color: 'rgba(254,245,236,0.65)', fontWeight: 200 }}>
                                EXPAND
                              </span>
                            </motion.div>
                          </button>
                        </div>
                        <div
                          className="rounded-sm border border-[#FEF5EC]/10 overflow-auto p-4 min-h-0"
                          style={{ background: 'rgba(3,6,40,0.65)' }}
                        >
                          <pre
                            className="whitespace-pre-wrap"
                            style={{
                              margin: 0,
                              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                              fontSize: '0.72rem',
                              lineHeight: 1.5,
                              color: 'rgba(254,245,236,0.82)',
                            }}
                          >
                            {currentAsset.code}
                          </pre>
                        </div>
                      </div>
                    ) : currentAsset.compareSrc ? (
                      currentAsset.overlayCompare ? (
                        <div className="w-full h-full p-3">
                          <div
                            className="relative rounded-sm overflow-hidden border border-[#FEF5EC]/10 w-full h-full"
                            style={{ background: 'rgba(254,245,236,0.02)' }}
                          >
                            <div
                              className="absolute top-0 left-0 right-0 z-10 px-2.5 py-1.5 border-b border-[#FEF5EC]/10 flex items-center justify-between gap-2"
                              style={{ background: 'rgba(5,14,96,0.45)', backdropFilter: 'blur(4px)' }}
                            >
                              <span
                                className="text-[#FEF5EC]/55 uppercase"
                                style={{ fontFamily: '"Josefin Sans", sans-serif', fontSize: '8px', letterSpacing: '0.2em', fontWeight: 200 }}
                              >
                                {currentAsset.primaryLabel ?? 'Primary'}
                              </span>
                              <button
                                onClick={() => {
                                  setLightboxImageOverride({
                                    src: currentAsset.src!,
                                    alt: currentAsset.alt ?? slide.alt,
                                    annotations: currentAsset.annotations,
                                  });
                                  setLightboxOpen(true);
                                }}
                                className="uppercase text-[#F9D976]/85 hover:text-[#F9D976] transition-colors"
                                style={{ fontFamily: '"Josefin Sans", sans-serif', fontSize: '7px', letterSpacing: '0.18em', fontWeight: 200, cursor: 'none' }}
                              >
                                View Full Size
                              </button>
                            </div>

                            <div className="w-full h-full flex items-start justify-center overflow-auto p-2 pt-8">
                              <div className="relative">
                                <img
                                  src={currentAsset.src}
                                  alt={currentAsset.alt ?? slide.alt}
                                  style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    width: 'auto',
                                    height: 'auto',
                                    display: 'block',
                                  }}
                                />
                                {currentAsset.annotations?.length ? (
                                  <div className="absolute inset-0 pointer-events-none">
                                    {currentAsset.annotations.map((a, i) => (
                                      <AnnotationDot key={`${currentAsset.id}-overlay-main-${i}`} {...a} index={i} dark={currentAsset.darkAnnotations} />
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                            </div>

                            <div
                              className="absolute rounded-sm border border-[#FEF5EC]/14 overflow-hidden"
                              style={{
                                width: `${currentAsset.overlayWidthPct ?? 20}%`,
                                right: `${currentAsset.overlayRightPct ?? 3}%`,
                                bottom: `${currentAsset.overlayBottomPct ?? 6}%`,
                                background: 'rgba(5,14,96,0.9)',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
                              }}
                            >
                              <div className="px-2 py-1 border-b border-[#FEF5EC]/12 flex items-center justify-between gap-2">
                                <span
                                  className="text-[#FEF5EC]/55 uppercase"
                                  style={{ fontFamily: '"Josefin Sans", sans-serif', fontSize: '7px', letterSpacing: '0.16em', fontWeight: 200 }}
                                >
                                  {currentAsset.compareLabel ?? 'Secondary'}
                                </span>
                                <button
                                  onClick={() => {
                                    setLightboxImageOverride({
                                      src: currentAsset.compareSrc!,
                                      alt: currentAsset.compareAlt ?? currentAsset.alt ?? slide.alt,
                                      annotations: currentAsset.compareAnnotations,
                                    });
                                    setLightboxOpen(true);
                                  }}
                                  className="uppercase text-[#F9D976]/85 hover:text-[#F9D976] transition-colors"
                                  style={{ fontFamily: '"Josefin Sans", sans-serif', fontSize: '6px', letterSpacing: '0.14em', fontWeight: 200, cursor: 'none' }}
                                >
                                  Open
                                </button>
                              </div>
                              <div className="p-1.5">
                                <img
                                  src={currentAsset.compareSrc}
                                  alt={currentAsset.compareAlt ?? currentAsset.alt ?? slide.alt}
                                  style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block',
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-3 p-3">
                        <div
                          className="relative rounded-sm overflow-hidden border border-[#FEF5EC]/10 flex flex-col min-h-0"
                          style={{ background: 'rgba(254,245,236,0.02)' }}
                        >
                          <div
                            className="px-2.5 py-1.5 border-b border-[#FEF5EC]/10 flex items-center justify-between gap-2"
                          >
                            <span className="text-[#FEF5EC]/45 uppercase"
                              style={{ fontFamily: '"Josefin Sans", sans-serif', fontSize: '8px', letterSpacing: '0.2em', fontWeight: 200 }}>
                              {currentAsset.primaryLabel ?? 'Primary'}
                            </span>
                            <button
                              onClick={() => {
                                setLightboxImageOverride({
                                  src: currentAsset.src!,
                                  alt: currentAsset.alt ?? slide.alt,
                                  annotations: currentAsset.annotations,
                                });
                                setLightboxOpen(true);
                              }}
                              className="uppercase text-[#F9D976]/85 hover:text-[#F9D976] transition-colors"
                              style={{ fontFamily: '"Josefin Sans", sans-serif', fontSize: '7px', letterSpacing: '0.18em', fontWeight: 200, cursor: 'none' }}
                            >
                              View Full Size
                            </button>
                          </div>
                          <div className="flex-1 min-h-0 flex items-start justify-center overflow-auto p-2">
                            <div className="relative">
                              <img
                                src={currentAsset.src}
                                alt={currentAsset.alt ?? slide.alt}
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  width: 'auto',
                                  height: 'auto',
                                  display: 'block',
                                }}
                              />
                              {currentAsset.annotations?.length ? (
                                <div className="absolute inset-0 pointer-events-none">
                                  {currentAsset.annotations.map((a, i) => (
                                    <AnnotationDot key={`${currentAsset.id}-wireframe-${i}`} {...a} index={i} dark={currentAsset.darkAnnotations} />
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div
                          className="relative rounded-sm overflow-hidden border border-[#FEF5EC]/10 flex flex-col min-h-0"
                          style={{ background: 'rgba(254,245,236,0.02)' }}
                        >
                          <div
                            className="px-2.5 py-1.5 border-b border-[#FEF5EC]/10 flex items-center justify-between gap-2"
                          >
                            <span className="text-[#FEF5EC]/45 uppercase"
                              style={{ fontFamily: '"Josefin Sans", sans-serif', fontSize: '8px', letterSpacing: '0.2em', fontWeight: 200 }}>
                              {currentAsset.compareLabel ?? 'Secondary'}
                            </span>
                            <button
                              onClick={() => {
                                setLightboxImageOverride({
                                  src: currentAsset.compareSrc!,
                                  alt: currentAsset.compareAlt ?? currentAsset.alt ?? slide.alt,
                                });
                                setLightboxOpen(true);
                              }}
                              className="uppercase text-[#F9D976]/85 hover:text-[#F9D976] transition-colors"
                              style={{ fontFamily: '"Josefin Sans", sans-serif', fontSize: '7px', letterSpacing: '0.18em', fontWeight: 200, cursor: 'none' }}
                            >
                              View Full Size
                            </button>
                          </div>
                          <div className="flex-1 min-h-0 flex items-start justify-center overflow-auto p-2">
                            <div className="relative">
                              <img
                                src={currentAsset.compareSrc}
                                alt={currentAsset.compareAlt ?? currentAsset.alt ?? slide.alt}
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  width: 'auto',
                                  height: 'auto',
                                  display: 'block',
                                }}
                              />
                              {currentAsset.compareAnnotations?.length ? (
                                <div className="absolute inset-0 pointer-events-none">
                                  {currentAsset.compareAnnotations.map((a, i) => (
                                    <AnnotationDot key={`${currentAsset.id}-compare-${i}`} {...a} index={i} dark={currentAsset.darkAnnotations} />
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <>
                        <div className={`w-full h-full flex ${currentAsset.centerInFrame ? 'items-center' : 'items-start'} justify-center overflow-hidden`}>
                          <div className="relative">
                            <img
                              src={currentAsset.src}
                              alt={currentAsset.alt ?? slide.alt}
                              style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                width: 'auto',
                                height: 'auto',
                                display: 'block',
                              }}
                            />

                            {/* Annotation callouts: anchored to the actual rendered image bounds */}
                            {isHero && currentAsset.annotations?.length && (
                              <div className="absolute inset-0 pointer-events-none">
                                {currentAsset.annotations.map((a, i) => (
                                  <AnnotationDot key={`${currentAsset.id}-${i}`} {...a} index={i} dark={currentAsset.darkAnnotations} />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Expand hint overlay */}
                        <button
                          onClick={() => {
                            setLightboxImageOverride(null);
                            setLightboxOpen(true);
                          }}
                          style={{ cursor: 'none' }}
                          className="absolute inset-0 w-full h-full flex items-end justify-end p-3 group"
                        >
                          <motion.div
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            style={{ background: 'rgba(5,14,96,0.8)', border: '1px solid rgba(254,245,236,0.15)', backdropFilter: 'blur(6px)' }}
                          >
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                              <path d="M 7,1 L 10,1 L 10,4" stroke="#FEF5EC" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
                              <path d="M 10,1 L 6,5" stroke="#FEF5EC" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
                              <path d="M 4,10 L 1,10 L 1,7" stroke="#FEF5EC" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
                              <path d="M 1,10 L 5,6" stroke="#FEF5EC" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
                            </svg>
                            <span style={{ fontFamily: '"Josefin Sans", sans-serif', fontSize: '8px', letterSpacing: '0.25em', color: 'rgba(254,245,236,0.65)', fontWeight: 200 }}>
                              EXPAND
                            </span>
                          </motion.div>
                        </button>
                      </>
                    )
                  ) : currentAsset.type === 'video' && currentAsset.videoSrc ? (
                    <div className="w-full h-full p-3">
                      <div
                        className="relative rounded-sm overflow-hidden border border-[#FEF5EC]/10 w-full h-full"
                        style={{ background: 'rgba(3,6,40,0.65)' }}
                      >
                        <video
                          src={currentAsset.videoSrc}
                          controls
                          preload="metadata"
                          playsInline
                          className="w-full h-full object-contain"
                        />

                        {(currentAsset.videoOverlayTitle || currentAsset.videoOverlayBody) ? (
                          <div className="absolute inset-x-0 top-0 p-3 md:p-4 pointer-events-none">
                            <div
                              className="max-w-2xl border border-[#F9D976]/28 rounded-sm px-3 py-2"
                              style={{ background: 'rgba(5,14,96,0.68)', backdropFilter: 'blur(4px)' }}
                            >
                              {currentAsset.videoOverlayTitle ? (
                                <div
                                  className="uppercase text-[#F9D976]/92 mb-1"
                                  style={{ fontFamily: '"Josefin Sans", sans-serif', fontSize: '9px', letterSpacing: '0.2em', fontWeight: 300 }}
                                >
                                  {currentAsset.videoOverlayTitle}
                                </div>
                              ) : null}
                              {currentAsset.videoOverlayBody ? (
                                <p
                                  className="text-[#FEF5EC]/80 leading-relaxed"
                                  style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.72rem', letterSpacing: '0.01em', margin: 0 }}
                                >
                                  {currentAsset.videoOverlayBody}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : currentAsset.type === 'code' && currentAsset.code ? (
                    <div
                      className="w-full h-full overflow-auto p-4"
                      style={{ background: 'rgba(3,6,40,0.65)' }}
                    >
                      <pre
                        className="whitespace-pre-wrap"
                        style={{
                          margin: 0,
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                          fontSize: '0.72rem',
                          lineHeight: 1.5,
                          color: 'rgba(254,245,236,0.82)',
                        }}
                      >
                        {currentAsset.code}
                      </pre>
                    </div>
                  ) : (
                    /* Placeholder when no image is uploaded yet */
                    <div
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                      style={{ background: 'rgba(254,245,236,0.03)' }}
                    >
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="1" y="1" width="30" height="30" rx="1" stroke="rgba(254,245,236,0.2)" strokeWidth="0.8"/>
                        <line x1="1" y1="1" x2="31" y2="31" stroke="rgba(254,245,236,0.08)" strokeWidth="0.6"/>
                        <line x1="31" y1="1" x2="1" y2="31" stroke="rgba(254,245,236,0.08)" strokeWidth="0.6"/>
                      </svg>
                      <span
                        className="uppercase text-[#FEF5EC]/25"
                        style={{ fontFamily: '"Josefin Sans", sans-serif', fontSize: '9px', letterSpacing: '0.3em', fontWeight: 200 }}
                      >
                        {slide.caption ?? 'Image coming soon'}
                      </span>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

              {/* Prev / Next arrows (hidden for tabbed case study) */}
              {project.slides.length > 1 && !showProjectTabs && (
                <>
                  <button
                    onClick={prev}
                    style={{ cursor: 'none' }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center transition-opacity duration-200 opacity-40 hover:opacity-90"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M 10,2 L 4,8 L 10,14" stroke="#FEF5EC" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    onClick={next}
                    style={{ cursor: 'none' }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center transition-opacity duration-200 opacity-40 hover:opacity-90"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M 6,2 L 12,8 L 6,14" stroke="#FEF5EC" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </>
              )}

              {/* Slide counter */}
              {project.slides.length > 1 && (
                <div
                  className="absolute bottom-3 right-4 text-[#FEF5EC]/35 uppercase"
                  style={{ fontFamily: '"Josefin Sans", sans-serif', fontSize: '9px', letterSpacing: '0.25em', fontWeight: 200 }}
                >
                  {String(activeSlide + 1).padStart(2, '0')} / {String(project.slides.length).padStart(2, '0')}
                </div>
              )}
            </div>

            {/* Caption + description */}
            <div className="mt-3 flex flex-col gap-3">
              {slide.highlightMetrics?.length ? (
                <div className="flex flex-wrap gap-2">
                  {slide.highlightMetrics.map((metric) => (
                    <span
                      key={metric}
                      className="px-2.5 py-1 rounded-sm border border-[#F9D976]/25 text-[#F9D976]/82"
                      style={{
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '0.66rem',
                        letterSpacing: '0.08em',
                        background: 'rgba(249,217,118,0.08)',
                      }}
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              ) : null}

              {slide.caption && (
                <div
                  className="text-[#FEF5EC]/35 uppercase"
                  style={{ fontFamily: '"Josefin Sans", sans-serif', fontSize: '9px', letterSpacing: '0.25em', fontWeight: 200 }}
                >
                  {isHero && currentAsset.type === 'image'
                    ? '↑ Hover to expand · scroll to zoom · drag to pan'
                    : slide.caption}
                </div>
              )}
              {displayedDescription && (
                <p
                  className="text-[#FEF5EC]/50 leading-relaxed"
                  style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.78rem', letterSpacing: '0.01em' }}
                >
                  {displayedDescription}
                </p>
              )}

              {currentAsset.implementationHighlights?.length ? (
                <button
                  onClick={() => setTechnicalModalOpen(true)}
                  className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-sm border border-[#F9D976]/28 text-[#F9D976]/88 transition-colors duration-200 hover:bg-[#F9D976]/10 hover:text-[#F9D976]"
                  style={{
                    fontFamily: '"Josefin Sans", sans-serif',
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                    fontWeight: 300,
                    cursor: 'none',
                  }}
                >
                  Technical Implementation
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                    <path d="M 1,8 L 8,1 M 3,1 L 8,1 L 8,6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : null}

              {displayedCtaUrl && (
                <a
                  href={displayedCtaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-sm border border-[#F9D976]/35 text-[#F9D976]/90 transition-colors duration-200 hover:bg-[#F9D976]/10 hover:text-[#F9D976]"
                  style={{
                    fontFamily: '"Josefin Sans", sans-serif',
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                    fontWeight: 300,
                    cursor: 'none',
                  }}
                >
                  {displayedCtaLabel}
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                    <path d="M 1,8 L 8,1 M 3,1 L 8,1 L 8,6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              )}

              {slide.detailSections?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                  {slide.detailSections.map((section) => (
                    <div
                      key={section.title}
                      className="rounded-sm border border-[#FEF5EC]/12 p-2.5"
                      style={{ background: 'rgba(254,245,236,0.02)' }}
                    >
                      <div
                        className="text-[#F9D976]/70 uppercase mb-1.5"
                        style={{ fontFamily: '"Josefin Sans", sans-serif', fontSize: '8px', letterSpacing: '0.22em', fontWeight: 200 }}
                      >
                        {section.title}
                      </div>
                      <ul className="space-y-1">
                        {section.items.map((item) => (
                          <li
                            key={item}
                            className="text-[#FEF5EC]/50 leading-relaxed"
                            style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.72rem', letterSpacing: '0.01em' }}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox is portaled to body so transformed parent doesn't clip fixed overlays */}
      {canPortal && lightboxOpen && currentAsset.type === 'pdf' && Boolean(currentAsset.pdfSrc) ? createPortal(
        /* PDF lightbox — full scrollable document in an iframe */
        <div
          className="fixed inset-0 z-[200] flex flex-col"
          style={{ background: 'rgba(3,6,40,0.97)' }}
          onClick={() => {
            setLightboxOpen(false);
            setLightboxImageOverride(null);
          }}
        >
          <div className="flex items-center justify-between px-8 py-4 shrink-0" onClick={e => e.stopPropagation()}>
            <span style={{ fontFamily: '"Josefin Sans", sans-serif', fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(254,245,236,0.4)', fontWeight: 200 }}>
              {slide.caption?.toUpperCase()} · CLICK OUTSIDE TO CLOSE
            </span>
            <button onClick={() => {
              setLightboxOpen(false);
              setLightboxImageOverride(null);
            }} style={{ cursor: 'none', color: 'rgba(254,245,236,0.4)' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div className="flex-1 px-8 pb-8 min-h-0" onClick={e => e.stopPropagation()}>
            <iframe
              src={currentAsset.pdfSrc}
              title={currentAsset.alt ?? slide.alt}
              style={{ width: '100%', height: '100%', border: 'none', borderRadius: '2px' }}
            />
          </div>
        </div>,
        document.body
      ) : null}

      {canPortal && lightboxOpen && currentAsset.type === 'image' && Boolean(lightboxImageSrc) ? createPortal(
        <ImageLightbox
          src={lightboxImageSrc!}
          alt={lightboxImageAlt}
          annotations={lightboxImageAnnotations}
          onClose={() => {
            setLightboxOpen(false);
            setLightboxImageOverride(null);
          }}
        />,
        document.body
      ) : null}

      {canPortal && technicalModalOpen && Boolean(currentAsset.implementationHighlights?.length) ? createPortal(
        <div
          className="fixed inset-0 z-[210] flex items-center justify-center px-4 md:px-8"
          style={{ background: 'rgba(3,6,40,0.92)' }}
          onClick={() => setTechnicalModalOpen(false)}
        >
          <div
            className="w-full max-w-4xl border border-[#FEF5EC]/14 rounded-sm overflow-hidden"
            style={{ background: 'rgba(5,14,96,0.96)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-[#FEF5EC]/12">
              <div
                className="uppercase"
                style={{
                  fontFamily: '"Josefin Sans", sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.24em',
                  fontWeight: 200,
                  color: 'rgba(249,217,118,0.85)',
                }}
              >
                Technical Implementation
              </div>
              <button onClick={() => setTechnicalModalOpen(false)} style={{ cursor: 'none', color: 'rgba(254,245,236,0.5)' }} aria-label="Close technical implementation modal">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="max-h-[68vh] overflow-y-auto px-4 md:px-6 py-4">
              <ul className="space-y-2">
                {currentAsset.implementationHighlights?.map((item) => (
                  <li
                    key={item}
                    className="text-[#FEF5EC]/70 leading-relaxed"
                    style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.78rem', letterSpacing: '0.01em' }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>,
        document.body
      ) : null}

    </div>
  );
}

// ─── Horizontal scroll section wrapper ───────────────────────────────────────
// Tall wrapper drives a sticky horizontal track — same pattern as About section.

export function CaseStudies() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const targetProgressRef = useRef(0);

  useEffect(() => {
    const jumpToHashProject = (behavior: ScrollBehavior = 'smooth') => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash;
      if (!hash.startsWith('#case-study-')) return;

      const targetId = decodeURIComponent(hash.replace('#case-study-', ''));
      const targetIndex = projects.findIndex((p) => p.id === targetId);
      if (targetIndex < 0) return;

      const section = document.getElementById('case-studies');
      if (!section) return;

      const targetTop = section.offsetTop + targetIndex * window.innerHeight;
      window.scrollTo({ top: targetTop, behavior });
      targetProgressRef.current = targetIndex / Math.max(projects.length - 1, 1);
      setProgress(targetProgressRef.current);
    };

    const handleHashChange = () => jumpToHashProject('smooth');
    window.addEventListener('hashchange', handleHashChange);

    // Support opening directly from a shared hash URL.
    window.setTimeout(() => jumpToHashProject('auto'), 0);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const scrollable = height - window.innerHeight;
      const p = scrollable > 0 ? Math.max(0, Math.min(1, -top / scrollable)) : 0;
      targetProgressRef.current = p;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let rafId = 0;

    const tick = () => {
      setProgress(prev => {
        const target = targetProgressRef.current;
        const next = prev + (target - prev) * 0.14;
        return Math.abs(target - next) < 0.0005 ? target : next;
      });
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const activeIndex = Math.min(
    projects.length - 1,
    Math.floor(progress * projects.length)
  );

  return (
    <section id="case-studies">
      {/*
        Each project gets 100vh of scroll travel.
        The final project holds the sticky for an extra 100vh so it's readable.
      */}
      <div
        ref={wrapperRef}
        style={{ height: `${projects.length * 100}vh` }}
      >
        {/* Sticky viewport — stays pinned while user scrolls through */}
        <div
          className="sticky top-0 w-full overflow-hidden"
          style={{ height: '100vh', background: '#050e60' }}
        >
          {/* Horizontal track */}
          <div
            className="flex h-full will-change-transform"
            style={{
              width: `${projects.length * 100}vw`,
              transform: `translateX(-${progress * (projects.length - 1) * 100}vw)`,
            }}
          >
            {projects.map((project, idx) => {
              const distFromCenter = Math.abs(progress * (projects.length - 1) - idx);
              const slideOpacity = Math.max(0, 1 - distFromCenter * 2);
              return (
                <div
                  key={project.id}
                  className="flex-shrink-0 w-screen h-full flex flex-col"
                  style={{ opacity: slideOpacity }}
                >
                  {/* Top meta bar */}
                  <div className="flex items-center justify-between px-8 md:px-16 pt-8 pb-0 shrink-0">
                    <div className="flex items-center gap-4">
                      <span
                        className="text-[#FEF5EC]/50 text-[10px] uppercase"
                        style={{ fontFamily: '"Inter", sans-serif', letterSpacing: '0.4em' }}
                      >
                        {project.number}
                      </span>
                      <div className="h-px w-8 bg-[#FEF5EC]/15" />
                      <span
                        className="text-[#FEF5EC]/40 text-[10px] uppercase"
                        style={{ fontFamily: '"Josefin Sans", sans-serif', letterSpacing: '0.3em', fontWeight: 200 }}
                      >
                        Selected Work
                      </span>
                    </div>
                    <span
                      className="text-[#FEF5EC]/30 text-[10px] uppercase"
                      style={{ fontFamily: '"Josefin Sans", sans-serif', letterSpacing: '0.3em', fontWeight: 200 }}
                    >
                      {project.role} · {project.year}
                    </span>
                  </div>

                  {/* Section heading */}
                  <div className="px-8 md:px-16 mt-3 shrink-0">
                    <h2
                      className="text-[#FEF5EC] uppercase"
                      style={{
                        fontFamily: '"Poiret One", sans-serif',
                        fontSize: 'clamp(2rem, 4.8vw, 4.2rem)',
                        lineHeight: 1.05,
                        letterSpacing: '0.1em',
                        WebkitTextStroke: '0.6px #FEF5EC',
                      }}
                    >
                      Case Studies
                    </h2>
                  </div>

                  {/* Top rule */}
                  <div className="mx-8 md:mx-16 mt-3 h-px bg-[#FEF5EC]/12 shrink-0" />

                  {/* Card content — fills remaining height */}
                  <div className="flex-1 min-h-0">
                    <CaseStudyCard project={project} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination dots */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2.5 pointer-events-none z-50">
            {projects.map((_, idx) => (
              <div
                key={idx}
                className="rounded-full transition-all duration-500"
                style={{
                  height: '4px',
                  width: idx === activeIndex ? '24px' : '4px',
                  backgroundColor: idx === activeIndex ? '#F9D976' : 'rgba(249,217,118,0.2)',
                }}
              />
            ))}
          </div>

          {/* Scroll hint */}
          <div
            className="absolute top-8 right-8 pointer-events-none transition-opacity duration-300"
            style={{ opacity: progress > 0.9 ? 0 : 0.4 }}
          >
            <span
              className="text-[#FEF5EC]/50 text-[10px] tracking-widest uppercase"
              style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 200 }}
            >
              Scroll to browse
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
