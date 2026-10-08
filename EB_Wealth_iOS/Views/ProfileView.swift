import SwiftUI

public struct ProfileView: View {
    @Binding public var profile: UserProfile
    @ObservedObject private var firebaseService = FirebaseService.shared
    @State private var isSyncing: Bool = false
    
    public init(profile: Binding<UserProfile>) {
        self._profile = profile
    }
    
    public var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Client Card
                HStack(spacing: 14) {
                    Circle()
                        .fill(Color(hex: "00F0FF").opacity(0.2))
                        .frame(width: 50, height: 50)
                        .overlay(
                            Text(String(profile.firstName.prefix(1)))
                                .font(.system(size: 20, weight: .bold))
                                .foregroundColor(Color(hex: "00F0FF"))
                        )
                    
                    VStack(alignment: .leading, spacing: 3) {
                        Text(profile.firstName.isEmpty ? "Investor" : profile.firstName)
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.white)
                        Text(profile.email)
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "94A3B8"))
                        Text("United Kingdom • GBP Base")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "38BDF8"))
                    }
                    Spacer()
                }
                .padding(18)
                .background(Color(hex: "0A1628").opacity(0.85))
                .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(hex: "00F0FF").opacity(0.25), lineWidth: 1))
                .cornerRadius(16)
                
                // Cloud Sync Card
                VStack(alignment: .leading, spacing: 10) {
                    HStack {
                        Label("FIREBASE CLOUD VAULT", systemImage: "icloud.fill")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(Color(hex: "00F0FF"))
                        Spacer()
                        Button(action: syncNow) {
                            if isSyncing {
                                ProgressView()
                                    .progressViewStyle(CircularProgressViewStyle(tint: Color(hex: "040B14")))
                                    .frame(width: 70, height: 28)
                                    .background(Color(hex: "00F0FF"))
                                    .cornerRadius(6)
                            } else {
                                Text("Sync Now")
                                    .font(.system(size: 11, weight: .bold))
                                    .foregroundColor(Color(hex: "040B14"))
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 5)
                                    .background(Color(hex: "00F0FF"))
                                    .cornerRadius(6)
                            }
                        }
                    }
                    
                    Text("Database: \(firebaseService.databaseId)")
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "94A3B8"))
                    
                    Text("Last Synced: \(firebaseService.lastSyncTimestamp)")
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(Color(hex: "34D399"))
                }
                .padding(16)
                .background(Color(hex: "0A1628").opacity(0.8))
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color(hex: "00F0FF").opacity(0.2), lineWidth: 1))
                .cornerRadius(14)
                
                // Sign Out
                Button(action: { profile.isLoggedIn = false }) {
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
            }
            .padding(16)
        }
    }
    
    private func syncNow() {
        isSyncing = true
        firebaseService.syncProfile(profile) { _ in
            isSyncing = false
        }
    }
}
