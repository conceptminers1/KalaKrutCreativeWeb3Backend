
# Project Structure

This document outlines the directory and file structure of the project, providing a brief description of each and its status.

## Root Directory

| File/Directory | Description | Status |
| :--- | :--- | :--- |
| `App.tsx` | Main application component. | In Use |
| `README.md` | Project README file. | In Use |
| `cloudbuild.yaml`| Google Cloud Build configuration file | In Use |
| `eslint.config.cjs`| ESLint configuration | In Use |
| `firebase.yaml`| Firebase configuration file | In Use |
| `hardhat.config.cjs`| Hardhat configuration for Ethereum development. | In Use |
| `index.html` | Main HTML file. | In Use |
| `package.json` | Project dependencies and scripts. | In Use |
| `server.js` | Main server file. | In Use |
| `tailwind.config.js` | Tailwind CSS configuration. | In Use |
| `tsconfig.json` | TypeScript configuration. | In Use |
| `vite.config.ts` | Vite configuration. | In Use |
| `public` | Static assets. | Not In Use (can be removed) |
| `cache` | Solidity cache. | In Use |
| `contracts` | Solidity smart contracts. | In Use |
| `documents` | Various project documents. | Not In Use (can be removed) |
| `functions` | Firebase functions. | In Use |
| `scripts` | Deployment and data generation scripts. | In Use |
| `server` | Server-side code. | In Use |
| `test` | Test files. | In Use |
| `src` | Main source code directory. | In Use |
| `artifacts`| Hardhat artifacts. | In Use |
| `pages`| API pages. | In Use |

## `src` Directory

| File/Directory | Description | Status |
| :--- | :--- | :--- |
| `App.tsx` | Main application component. | In Use |
| `config.ts` | Configuration file. | In Use |
| `global.d.ts` | Global TypeScript declarations. | In Use |
| `index.css` | Main CSS file. | In Use |
| `index.tsx` | Main entry point for the React application. | In Use |
| `mockData.ts` | Mock data for testing and development. | In Use |
| `types.ts` | TypeScript types. | In Use |
| `abis` | ABI files for smart contracts. | In Use |
| `configs` | Role configurations. | In Use |
| `components` | React components. | In Use |
| `contexts` | React contexts. | In Use |
| `data` | Data files. | In Use |
| `hooks` | React hooks. | In Use |
| `lib` | Utility functions. | In Use |
| `services` | Services for interacting with APIs and other external resources. | In Use |
| `types` | TypeScript types. | In Use |
| `pages` | React pages. | In Use |

### `src/components` Directory

| File/Directory | Description | Status |
| :--- | :--- | :--- |
| `AdminContracts.tsx` | Admin component for managing contracts. | In Use |
| `AdminEmailTemplates.tsx`| Admin component for managing email templates. | In Use |
| `AdminLeads.tsx` | Admin component for managing leads. | In Use |
| `AdminReview.tsx` | Admin component for reviewing items. | In Use |
| `AdminSupport.tsx` | Admin component for handling support requests. | In Use |
| `AnalyticsDashboard.tsx`| Component for displaying analytics. | In Use |
| `Announcements.tsx` | Component for displaying announcements. | In Use |
| `ArtistForm.tsx` | Form for artists to join. | In Use |
| `ArtistProfile.tsx` | Component for displaying artist profiles. | In Use |
| `BookingHub.tsx` | Component for managing bookings. | In Use |
| `ChatOverlay.tsx` | Component for the chat overlay. | In Use |
| `ContractEditor.tsx` | Component for editing contracts. | In Use |
| `ContractFactory.tsx` | Component for creating contracts. | In Use |
| `ContractsDashboard.tsx`| Component for the contracts dashboard. | In Use |
| `CreativeStudio.tsx` | Component for the creative studio. | In Use |
| `DaoGovernance.tsx` | Component for DAO governance. | In Use |
| `Dashboard.tsx` | Main dashboard component. | In Use |
| `ErrorBoundary.tsx` | Error boundary component. | In Use |
| `Forum.tsx` | Component for the forum. | In Use |
| `HRDashboard.tsx` | Component for the HR dashboard. | In Use |
| `Home.tsx` | Home page component. | In Use |
| `JoinForm.tsx` | Form for users to join. | In Use |
| `JoinFormEditor.tsx`| Component for editing the join form. | In Use |
| `Layers.tsx` | Component for displaying layers. | In Use |
| `Layout.tsx` | Main layout component. | In Use |
| `Leaderboard.tsx` | Component for the leaderboard. | In Use |
| `LeadsAndAi.tsx` | Component for leads and AI. | In Use |
| `Marketplace.tsx` | Component for the marketplace. | In Use |
| `MembershipPlans.tsx` | Component for membership plans. | In Use |
| `MyNetwork.tsx` | Component for the user's network. | In Use |
| `OnboardingFilterPanel.tsx`| Component for the onboarding filter panel. | In Use |
| `OrganizerForm.tsx` | Form for organizers to join. | In Use |
| `PaymentGateway.tsx` | Component for the payment gateway. | In Use |
| `RevellerForm.tsx` | Form for revellers to join. | In Use |
| `Roster.tsx` | Component for the roster. | In Use |
| `SearchResults.tsx` | Component for displaying search results. | In Use |
| `ServiceContracts.tsx` | Component for service contracts. | In Use |
| `ServiceProviderForm.tsx`| Form for service providers to join. | In Use |
| `ServicesHub.tsx` | Component for the services hub. | In Use |
| `Sitemap.tsx` | Component for the sitemap. | In Use |
| `SponsorForm.tsx` | Form for sponsors to join. | In Use |
| `SupportWidget.tsx` | Component for the support widget. | In Use |
| `SystemDiagrams.tsx` | Component for system diagrams. | In Use |
| `TokenExchange.tsx` | Component for the token exchange. | In Use |
| `TreasuryDashboard.tsx`| Component for the treasury dashboard. | In Use |
| `UrgentBookingForm.tsx`| Form for urgent bookings. | In Use |
| `UserGuide.tsx` | Component for the user guide. | In Use |
| `UserNotifications.tsx`| Component for user notifications. | In Use |
| `VenueForm.tsx` | Form for venues to join. | In Use |
| `WalletHistory.tsx` | Component for the wallet history. | In Use |
| `WhitePaper.tsx` | Component for the white paper. | In Use |
| `ui` | UI components. | In Use |
| `tables` | Table components. | In Use |

### `src/pages` Directory

| File/Directory | Description | Status |
| :--- | :--- | :--- |
| `AdminPage.tsx` | Admin page. | In Use |
| `AdminSupportPage.tsx`| Admin support page. | In Use |
| `ArtistPage.tsx` | Artist page. | In Use |
| `ContractFactoryPage.tsx`| Contract factory page. | In Use |
| `DAOMemberPage.tsx` | DAO member page. | In Use |
| `DAOProposalPage.tsx` | DAO proposal page. | In Use |
| `DaoGovernorPage.tsx` | DAO governor page. | In Use |
| `DashboardPage.tsx` | Dashboard page. | In Use |
| `EventPage.tsx` | Event page. | In Use |
| `EventTicketPage.tsx` | Event ticket page. | In Use |
| `HRDPage.tsx` | HRD page. | In Use |
| `MarketplacePage.tsx` | Marketplace page. | In Use |
| `OnboardingPage.tsx` | Onboarding page. | In Use |
| `OrganizerPage.tsx` | Organizer page. | In Use |
| `ProposalPage.tsx` | Proposal page. | In Use |
| `RevellerPage.tsx` | Reveller page. | In Use |
| `RosterAnalyticsPage.tsx`| Roster analytics page. | In Use |
| `RosterBookingPage.tsx`| Roster booking page. | In Use |
| `RosterPage.tsx` | Roster page. | In Use |
| `ServiceProviderPage.tsx`| Service provider page. | In Use |
| `SponsorPage.tsx` | Sponsor page. | In Use |
| `SupportRequestsPage.tsx`| Support requests page. | In Use |
| `TablesPage.tsx` | Tables page. | In Use |
| `TreasuryPage.tsx` | Treasury page. | In Use |
| `VenuePage.tsx` | Venue page. | In Use |
