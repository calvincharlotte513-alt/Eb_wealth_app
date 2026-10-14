import SwiftUI

public struct ProfileView: View {
    @Binding public var profile: UserProfile
    @EnvironmentObject private var firebaseService: FirebaseService
    @State private var isSyncing: Bool = false
    @State private var syncMessage: String? = nil
    @State private var showSignOutConfirm: Bool = false

    public init(profile: Binding<UserProfile>) {
        self._profile = profile
    }

    public var body: some View {
        ScrollView {
            VStack(spacing: 16) {

                // Client Identity Card
                HStack(spacing: 14) {
                    ZStack {
                        Circle()
                            .fill(LinearGradient(
                                colors: [Color(hex: "00F0FF").opacity(0.25), Color(hex: "0284C7").opacity(0.15)],
                                startPoint: .topLeading, endPoint: .bottomTrailing))
                            .frame(width: 60, height: 60)
                        Text(String(profile.firstName.prefix(1)).uppercased())
                            .font(.system(size: 24, weight: .black))
                            .foregroundColor(Color(hex: "00F0FF"))
                    }
                    VStack(alignment: .leading, spacing: 3) {
                        Text(profile.firstName.isEmpty ? "Investor" : profile.firstName)
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.white)
                        Text(profile.email)
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "94A3B8"))
                        HStack(spacing: 6) {
                            Text("🇬🇧 United Kingdom")
                                .font(.system(size: 11))
                                .foregroundColor(Color(hex: "38BDF8"))
                            if profile.isPro {
                                Text("PRO")
                                    .font(.system(size: 9, weight: .black))
                                    .foregroundColor(Color(hex: "040B14"))
                                    .padding(.horizontal, 6).padding(.vertical, 2)
                                    .background(Color(hex: "FBBF24"))
                                    .cornerRadius(4)
                            }
                        }
                    }
                    Spacer()
                    // XP Badge
                    VStack(spacing: 2) {
                        Text("\(profile.xp)")
                            .font(.system(size: 20, weight: .black))
                            .foregroundColor(Color(hex: "FBBF24"))
                        Text("XP")
                            .font(.system(size: 9, weight: .bold))
                            .foregroundColor(Color(hex: "94A3B8"))
                    }
                }
                .padding(18)
                .background(Color(hex: "0A1628").opacity(0.85))
                .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(hex: "00F0FF").opacity(0.25), lineWidth: 1))
                .cornerRadius(16)

                // Profile Details
                VStack(spacing: 0) {
                    profileRow(icon: "target", label: "Primary Goal", value: profile.primaryGoal)
                    Divider().background(Color(hex: "1E293B"))
                    profileRow(icon: "chart.bar.fill", label: "Experience Level", value: profile.experienceLevel)
                    Divider().background(Color(hex: "1E293B"))
                    profileRow(icon: "clock.fill", label: "Time Horizon", value: profile.timeHorizon)
                    Divider().background(Color(hex: "1E293B"))
                    profileRow(icon: "shield.lefthalf.filled", label: "Risk Profile", value: profile.riskProfile)
                    Divider().background(Color(hex: "1E293B"))
                    profileRow(icon: "flame.fill", label: "Day Streak", value: "\(profile.streakDays) days")
                }
                .background(Color(hex: "0A1628").opacity(0.75))
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color(hex: "1E293B"), lineWidth: 1))
                .cornerRadius(14)

                // Firebase Cloud Vault Card
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Label("FIREBASE CLOUD VAULT", systemImage: "icloud.fill")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(Color(hex: "00F0FF"))
                        Spacer()
                        // Sync indicator
                        Circle()
                            .fill(firebaseService.isConnected ? Color(hex: "34D399") : Color(hex: "F43F5E"))
                            .frame(width: 8, height: 8)
                        Text(firebaseService.isConnected ? "Connected" : "Offline")
                            .font(.system(size: 10, weight: .semibold))
                            .foregroundColor(firebaseService.isConnected ? Color(hex: "34D399") : Color(hex: "F43F5E"))
                    }

                    Text("Project: \(AppConfig.projectId)")
                        .font(.system(size: 10))
                        .foregroundColor(Color(hex: "475569"))

                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Last Synced")
                                .font(.system(size: 10))
                                .foregroundColor(Color(hex: "64748B"))
                            Text(firebaseService.lastSyncTimestamp)
                                .font(.system(size: 12, weight: .medium))
                                .foregroundColor(Color(hex: "34D399"))
                        }
                        Spacer()
                        Button(action: syncNow) {
                            if isSyncing {
                                ProgressView()
                                    .progressViewStyle(CircularProgressViewStyle(tint: Color(hex: "040B14")))
                                    .frame(width: 80, height: 32)
                                    .background(Color(hex: "00F0FF"))
                                    .cornerRadius(8)
                            } else {
                                Text("Sync Now")
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(Color(hex: "040B14"))
                                    .padding(.horizontal, 14).padding(.vertical, 7)
                                    .background(Color(hex: "00F0FF"))
                                    .cornerRadius(8)
                            }
                        }
                        .disabled(isSyncing)
                    }

                    if let msg = syncMessage {
                        Text(msg)
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "34D399"))
                            .transition(.opacity)
                    }
                }
                .padding(16)
                .background(Color(hex: "0A1628").opacity(0.8))
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color(hex: "00F0FF").opacity(0.2), lineWidth: 1))
                .cornerRadius(14)

                // Sign Out Button
                Button(action: { showSignOutConfirm = true }) {
                    HStack {
                        Image(systemName: "rectangle.portrait.and.arrow.right")
                        Text("Sign Out & Lock Vault")
                    }
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Color(hex: "F43F5E"))
                    .frame(maxWidth: .infinity)
                    .frame(height: 48)
                    .background(Color(hex: "E11D48").opacity(0.12))
                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: "E11D48").opacity(0.3), lineWidth: 1))
                    .cornerRadius(12)
                }
                .alert("Sign Out", isPresented: $showSignOutConfirm) {
                    Button("Cancel", role: .cancel) {}
                    Button("Sign Out", role: .destructive) { signOut() }
                } message: {
                    Text("Are you sure you want to sign out of your EB Wealth vault?")
                }
            }
            .padding(16)
        }
    }

    // MARK: - Sub-views

    private func profileRow(icon: String, label: String, value: String) -> some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "00F0FF"))
                .frame(width: 20)
            Text(label)
                .font(.system(size: 13))
                .foregroundColor(Color(hex: "94A3B8"))
            Spacer()
            Text(value)
                .font(.system(size: 13, weight: .semibold))
                .foregroundColor(.white)
                .lineLimit(1)
        }
        .padding(.horizontal, 16).padding(.vertical, 12)
    }

    // MARK: - Actions

    private func syncNow() {
        isSyncing = true
        syncMessage = nil

        // First push local profile, then pull fresh data
        firebaseService.syncProfile(profile) { ok in
            if ok {
                firebaseService.fetchProfile { fetched in
                    isSyncing = false
                    if let fetched = fetched {
                        profile.xp = fetched.xp
                        profile.streakDays = fetched.streakDays
                        profile.isPro = fetched.isPro
                    }
                    withAnimation { syncMessage = "✓ Synced successfully at \(firebaseService.lastSyncTimestamp)" }
                    DispatchQueue.main.asyncAfter(deadline: .now() + 4) {
                        withAnimation { syncMessage = nil }
                    }
                }
            } else {
                isSyncing = false
                withAnimation { syncMessage = "⚠ Sync failed. Check your connection." }
            }
        }
    }

    private func signOut() {
        firebaseService.signOut()
        profile = UserProfile()  // Reset to empty profile → triggers AuthView
    }
}
