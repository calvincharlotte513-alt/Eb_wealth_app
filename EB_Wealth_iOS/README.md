# EB Wealth — iOS Native (SwiftUI)

This directory contains the complete native iOS project for **EB Wealth**.

## Architecture & Features
- **SwiftUI + Combine** modern reactive iOS codebase
- **Dark Luxury Theme**: Custom midnight-blue & gold fintech interface
- **Firebase Firestore Integration**: Configured with project `com-aistudio-ebwealth-kq-f6b41` and database `ai-studio-android-ebwealth-8a97b416-8f81-404d-8d7f-be206ae221d3`
- **Sign In with Apple** & Client Vault Registration/Login
- **Community Forum**: Category dropdown with all 10 investing categories
- **Portfolio Tracker**: Asset allocation, valuation metrics, and ETF overlap analysis
- **Investor Academy**: Structured UK wealth-building lessons and XP tracking
- **AI Wealth Coach**: Interactive UK investing assistant

## How to Build & Install on iPhone

### Option A: Open directly in Xcode (macOS)
1. Double-click `EB_Wealth.xcodeproj` to open the project in Xcode.
2. In the project settings, select your **Signing & Capabilities** tab and choose your Apple Developer Team (free Apple ID or paid account).
3. Connect your iPhone via USB.
4. Select your iPhone from the destination device menu at the top.
5. Press **Run (Cmd + R)**.
6. Xcode will compile the Swift source files into native ARM64 Mach-O binaries, sign with your profile, and install directly onto your iPhone.

### Option B: Export Signed `.ipa` via Xcode Archive
1. In Xcode, set the run destination to **Any iOS Device (arm64)**.
2. Go to **Product > Archive**.
3. Once the Organizer window opens, click **Distribute App**.
4. Choose **Ad Hoc** or **Development** (or App Store Connect).
5. Click **Export** to generate the signed `EB_Wealth.ipa` binary file.
6. Drag the generated `.ipa` into **Sideloadly** or **AltStore** to install on any device.
