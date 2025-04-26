# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

# Wearable Device Variables Report

This report details the variables used in the wearable device system, categorized by their purpose, handling, source, and display within the application. The variables are managed across Firebase Realtime Database, Firestore, and local state, with data sourced from user interactions, wearable hardware, and derived calculations.

## 1. Session Control Variables

These variables manage real-time control of the wearable device and are stored in Firebase Realtime Database under `users/<user-uid>/session`.

### isActive (Session Status Flag)

- **Handled**: Stored in Firebase Realtime Database at `users/<user-uid>/session/isActive` as a boolean (`true` for active, `false` for stopped).
- **Calculated/Updated**:
  - Set to `true` when the user presses "Start Session" in `SessionControlScreen` via the `startSession` function.
  - Set to `false` when the user presses "Stop Session" or "Emergency Stop" via the `stopSession` function.
  - Listened to in `SessionControlScreen` using `onValue` to sync UI state (`sessionActive`) with the database.
- **Source**: User interaction in `SessionControlScreen.tsx`.
- **Displayed**:
  - Shown in `SessionControlScreen.tsx` as text ("Session in Progress" or "New Session") and a status indicator dot (green for active, warning color for inactive).
  - Indirectly affects button states (disables "Start Session" if device not connected, shows "Emergency Stop" when active).

### vibrationLevel (Vibration Intensity)

- **Handled**: Stored in Firebase Realtime Database at `users/<user-uid>/session/vibrationLevel` as a number (0 to 100).
- **Calculated/Updated**:
  - Updated via user interaction with a slider in `SessionControlScreen` through the `updateVibrationIntensity` function, which writes to Firebase.
  - Listened to in `SessionControlScreen` using `onValue` to sync UI state (`vibrationIntensity`) with the database.
  - Initialized to 50 by default during user data setup in `LoginScreen.tsx`.
- **Source**: User input via slider in `SessionControlScreen.tsx`.
- **Displayed**:
  - Shown in `SessionControlScreen.tsx` as the slider position and a numeric value (implicitly via slider).
  - Labels "Low", "Medium", "High" below the slider Freedom provides context.

## 2. Device Feedback Variables

These variables are updated by the wearable device (e.g., Arduino-based hardware) and stored in Firebase Realtime Database under `users/<user-uid>/device`.

### temperature

- **Handled**: Stored in Firebase Realtime Database at `users/<user-uid>/device/temperature` as a number (assumed in Celsius).
- **Calculated/Updated**:
  - Updated by the wearable device writing to Firebase (not handled in app code; expected from hardware).
  - Listened to in `SessionControlScreen` using `onValue` to update UI state (`temperatureLevel` for current value, `temperatureData` for history array).
  - `temperatureData` maintains the last 30 readings for graphing.
- **Source**: Wearable device via Firebase Realtime Database.
- **Displayed**:
  - Shown in `SessionControlScreen.tsx` as a current value (e.g., "Current: X°C") and in a line chart (`TemperatureGraph` component) showing historical values.

### isConnected (Device Connection Status Flag)

- **Handled**: Stored in Firebase Realtime Database at `users/<user-uid>/device/isConnected` as a boolean (`true` for connected, `false` for disconnected).
- **Calculated/Updated**:
  - Updated by the wearable device writing to Firebase (not handled in app code; expected from hardware).
  - Listened to in `SessionControlScreen` using `onValue` to update UI state (`deviceConnected` via `useDeviceStore`).
- **Source**: Wearable device via Firebase Realtime Database.
- **Displayed**:
  - Shown in `SessionControlScreen.tsx` as text ("Connected" or "Disconnected") with color coding (green for connected, red for disconnected) in the "Device Information" card.
  - Indirectly affects UI by disabling "Start Session" and slider controls when disconnected.

## 3. Session Duration Variable

This variable tracks the duration of an active session, used for real-time display and historical storage.

### sessionDuration

- **Handled**: Stored locally in `SessionControlScreen` state as a number (in seconds); not persisted in Realtime Database but saved to Firestore upon session completion.
- **Calculated/Updated**:
  - Incremented every second using a timer (`setInterval`) in `SessionControlScreen` when a session starts (`startSession` function).
  - Reset to 0 when a session stops and the user acknowledges the completion alert (`stopSession` function).
  - Saved to Firestore as part of session history (`sessions` collection) when a session ends.
- **Source**: Local timer in `SessionControlScreen.tsx`.
- **Displayed**:
  - Shown in `SessionControlScreen.tsx` as a formatted time string (e.g., "00:00") in the "Duration" section during an active session.

## 4. Historical Session Data Variables

These variables are stored in Firestore under the `sessions` collection after a session completes, used for progress tracking and history display.

### duration (Historical Session Duration)

- **Handled**: Stored in Firestore at `sessions/<sessionId>/duration` as a number (in seconds).
- **Calculated/Updated**:
  - Derived from `sessionDuration` in `SessionControlScreen` when a session stops (`stopSession` function) and saved to Firestore.
  - Fetched from Firestore in `DashboardScreen` (last 5 sessions) and `ProgressTrackingScreen` (all sessions for a user).
- **Source**: Local `sessionDuration` state saved to Firestore via `SessionControlScreen.tsx`.
- **Displayed**:
  - Shown in `DashboardScreen.tsx` and `ProgressTrackingScreen.tsx` within `SessionHistoryItem` components as formatted time (e.g., "00:00").

### vibrationIntensity (Historical Vibration Intensity)

- **Handled**: Stored in Firestore at `sessions/<sessionId>/vibrationIntensity` as a number (0 to 100).
- **Calculated/Updated**:
  - Derived from `vibrationIntensity` state in `SessionControlScreen` when a session stops (`stopSession` function) and saved to Firestore.
  - Fetched from Firestore in `DashboardScreen` and `ProgressTrackingScreen`.
- **Source**: Local `vibrationIntensity` state saved to Firestore via `SessionControlScreen.tsx`.
- **Displayed**:
  - Shown in `ProgressTrackingScreen.tsx` within `SessionHistoryItem` components (detailed view) as a percentage (e.g., "50%").

### averageTemperature (Historical Average Temperature)

- **Handled**: Stored in Firestore at `sessions/<sessionId>/averageTemperature` as a number (in Celsius).
- **Calculated/Updated**:
  - Derived from `temperatureLevel` state in `SessionControlScreen` when a session stops (`stopSession` function) and saved to Firestore (assumes current temperature as average for simplicity).
  - Fetched from Firestore in `DashboardScreen` and `ProgressTrackingScreen`.
- **Source**: Local `temperatureLevel` state saved to Firestore via `SessionControlScreen.tsx`.
- **Displayed**:
  - Shown in `ProgressTrackingScreen.tsx` within `SessionHistoryItem` components (detailed view) as a temperature value (e.g., "37°C").

### timestamp (Session Timestamp)

- **Handled**: Stored in Firestore at `sessions/<sessionId>/timestamp` as a Firestore Timestamp object.
- **Calculated/Updated**:
  - Set to the server timestamp (`serverTimestamp()`) when a session stops (`stopSession` function) and saved to Firestore.
  - Fetched from Firestore in `DashboardScreen` and `ProgressTrackingScreen`.
- **Source**: Server timestamp via Firestore in `SessionControlScreen.tsx`.
- **Displayed**:
  - Shown in `DashboardScreen.tsx` and `ProgressTrackingScreen.tsx` within `SessionHistoryItem` components as a formatted date (e.g., "MMM d, yyyy h:mm a").

## 5. Progress Metrics Variables

These variables are calculated dynamically for analytics and visualizations based on historical session data from Firestore. They are not stored persistently.

### bloodFlow (Progress Metric)

- **Handled**: Calculated dynamically in `DashboardScreen` and `ProgressTrackingScreen` as a number (0 to 100, percentage-like for display).
- **Calculated/Updated**:
  - Formula: `Math.min(100, Math.round(avgVibrationIntensity * 0.8))`, where `avgVibrationIntensity` is the average of `vibrationIntensity` from relevant sessions (last 7 days for weekly, last 30 days for monthly).
  - Calculated in `fetchWeeklyProgress` (Dashboard) and `calculateProgressMetrics` (ProgressTracking) functions.
- **Source**: Derived from Firestore session data (`vibrationIntensity`).
- **Displayed**:
  - Shown in `DashboardScreen.tsx` and `ProgressTrackingScreen.tsx` (weekly tab) as a bar in `ProgressChart`.
  - Shown in `ProgressTrackingScreen.tsx` (monthly tab) as a line in `MonthlyProgressChart`.

### painReduction (Progress Metric)

- **Handled**: Calculated dynamically in `DashboardScreen` and `ProgressTrackingScreen` as a number (0 to 100, percentage-like for display).
- **Calculated/Updated**:
  - Formula: `Math.min(100, Math.round(numberOfSessions * 10))`, where `numberOfSessions` is the count of relevant sessions (last 7 days for weekly, last 30 days for monthly).
  - Calculated in `fetchWeeklyProgress` (Dashboard) and `calculateProgressMetrics` (ProgressTracking) functions.
- **Source**: Derived from Firestore session data (count of sessions).
- **Displayed**:
  - Shown in `DashboardScreen.tsx` and `ProgressTrackingScreen.tsx` (weekly tab) as a bar in `ProgressChart`.
  - Shown in `ProgressTrackingScreen.tsx` (monthly tab) as a line in `MonthlyProgressChart`.
  - Shown in `ProgressTrackingScreen.tsx` (weekly stats) as a percentage value.

### sessionDuration (Progress Metric for Chart Display)

- **Handled**: Calculated dynamically in `DashboardScreen` and `ProgressTrackingScreen` as a number (0 to 100, percentage-like for display).
- **Calculated/Updated**:
  - Formula: `Math.min(100, Math.round(totalDuration / 60))`, where `totalDuration` is the sum of `duration` from relevant sessions (last 7 days for weekly, last 30 days for monthly), converted from seconds to minutes.
  - Calculated in `fetchWeeklyProgress` (Dashboard) and `calculateProgressMetrics` (ProgressTracking) functions.
- **Source**: Derived from Firestore session data (`duration`).
- **Displayed**:
  - Shown in `DashboardScreen.tsx` and `ProgressTrackingScreen.tsx` (weekly tab) as a bar in `ProgressChart`.

### totalSessions (Stats Metric)

- **Handled**: Calculated dynamically in `ProgressTrackingScreen` as a number (count of sessions).
- **Calculated/Updated**:
  - Count of sessions within the time frame (last 7 days for weekly, last 30 days for monthly).
  - Calculated in `calculateProgressMetrics` function.
- **Source**: Derived from Firestore session data (count of sessions).
- **Displayed**:
  - Shown in `ProgressTrackingScreen.tsx` (weekly and monthly tabs) as a numeric value in the stats card ("Sessions").

### totalTime (Stats Metric)

- **Handled**: Calculated dynamically in `ProgressTrackingScreen` as a number (total minutes).
- **Calculated/Updated**:
  - Sum of `duration` from relevant sessions (last 7 days for weekly, last 30 days for monthly), converted from seconds to minutes.
  - Calculated in `calculateProgressMetrics` function.
- **Source**: Derived from Firestore session data (`duration`).
- **Displayed**:
  - Shown in `ProgressTrackingScreen.tsx` (weekly and monthly tabs) as a numeric value in the stats card ("Total Time" in minutes).

### improvement (Stats Metric for Monthly)

- **Handled**: Calculated dynamically in `ProgressTrackingScreen` as a number (0 to 100, percentage-like for display).
- **Calculated/Updated**:
  - Formula: `Math.min(100, Math.round(avgVibrationIntensity * 0.65))`, where `avgVibrationIntensity` is the average of `vibrationIntensity` from sessions in the last 30 days.
  - Calculated in `calculateProgressMetrics` function.
- **Source**: Derived from Firestore session data (`vibrationIntensity`).
- **Displayed**:
  - Shown in `ProgressTrackingScreen.tsx` (monthly tab) as a percentage value in the stats card ("Improvement").
