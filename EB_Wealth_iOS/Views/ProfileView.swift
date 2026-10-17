import SwiftUI

public struct ProfileView: View {
    @Binding public var profile: UserProfile
    public var onNavigate: (AppScreen) -> Void
    @EnvironmentObject private var firebaseService: FirebaseService
    @State private var showUpgradeSheet: Bool = false

    public init(profile: Binding<UserProfile>, onNavigate: @escaping (AppScreen) -> Void = { _ in }) {
        self._profile = profile
        self.onNavigate = onNavigate
    }

    public var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Card 1: Verified Wealth Client Card (Screenshot 1)
                VStack(spacing: 14) {
                    HStack {
                        HStack(spacing: 6) {
                            Image(systemName: "checkmark.shield.fill")
                                .foregroundColor(Color(hex: "10B981"))
                                .font(.system(size: 13))
                            Text("VERIFIED WEALTH CLIENT")
                                .font(.system(size: 11, weight: .black))
                                .foregroundColor(Color(hex: "34D399"))
                                .tracking(0.4)
                        }
                        .padding(.horizontal, 10)
                        .padding(.vertical, 5)
                        .background(Color(hex: "10B981").opacity(0.15))
                        .cornerRadius(8)
                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color(hex: "10B981").opacity(0.5), lineWidth: 1))

                        Spacer()

                        Text("REF: EB-8849-GB")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(Color(hex: "94A3B8"))
                    }

                    // Avatar & User Info
                    HStack(spacing: 14) {
                        ZStack {
                            Circle()
                                .fill(LinearGradient(
                                    colors: [Color(hex: "00BCD4"), Color(hex: "0284C7")],
                                    startPoint: .topLeading, endPoint: .bottomTrailing
                                ))
                                .frame(width: 64, height: 64)
                                .overlay(Circle().stroke(Color(hex: "00F0FF"), lineWidth: 2))
                                .shadow(color: Color(hex: "00F0FF").opacity(0.4), radius: 10, x: 0, y: 0)

                            Text(String(profile.firstName.prefix(1)).uppercased())
                                .font(.system(size: 26, weight: .black))
                                .foregroundColor(.white)
                        }

                        VStack(alignment: .leading, spacing: 3) {
                            Text(profile.firstName.isEmpty ? "Johnkennedy" : profile.firstName)
                                .font(.system(size: 22, weight: .black))
                                .foregroundColor(.white)
                            Text(profile.email.isEmpty ? "johnkennedy3313@gmail.com" : profile.email)
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "94A3B8"))
                            Text("United Kingdom • GBP Base")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(Color(hex: "00F0FF"))
                                .padding(.top, 2)
                        }
                        Spacer()
                    }

                    Divider().background(Color.white.opacity(0.08))

                    // Tier Status Row
                    HStack(alignment: .center) {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("TIER STATUS")
                                .font(.system(size: 10, weight: .black))
                                .foregroundColor(Color(hex: "94A3B8"))
                                .tracking(0.5)
                            Text(profile.isPro ? "Pro Wealth Member" : "Standard Investor")
                                .font(.system(size: 15, weight: .black))
                                .foregroundColor(.white)
                        }

                        Spacer()

                        Button(action: { showUpgradeSheet = true }) {
                            Text("Upgrade to Pro")
                                .font(.system(size: 12, weight: .black))
                                .foregroundColor(Color(hex: "040B14"))
                                .padding(.horizontal, 16)
                                .padding(.vertical, 8)
                                .background(Color(hex: "FBBF24"))
                                .cornerRadius(12)
                                .shadow(color: Color(hex: "FBBF24").opacity(0.35), radius: 6, x: 0, y: 2)
                        }
                    }
                }
                .padding(18)
                .background(Color(hex: "071322").opacity(0.85))
                .cornerRadius(18)
                .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color(hex: "00F0FF").opacity(0.4), lineWidth: 1))

                // Card 2: Tax Year 2024/2025 Allowances (Screenshot 1)
                VStack(spacing: 12) {
                    HStack {
                        Text("TAX YEAR 2024/2025 ALLOWANCES")
                            .font(.system(size: 11, weight: .black))
                            .foregroundColor(Color(hex: "FBBF24"))
                            .tracking(0.8)
                        Spacer()
                        Text("HMRC Regulated")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "94A3B8"))
                    }

                    HStack {
                        Text("Stocks & Shares ISA Limit")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(.white)
                        Spacer()
                        Text("£8,450 / £20,000")
                            .font(.system(size: 13, weight: .black))
                            .foregroundColor(Color(hex: "00F0FF"))
                    }

                    // Dual-tone progress bar with cyan end dot
                    GeometryReader { geo in
                        ZStack(alignment: .leading) {
                            RoundedRectangle(cornerRadius: 3)
                                .fill(Color.white.opacity(0.1))
                                .frame(height: 6)

                            RoundedRectangle(cornerRadius: 3)
                                .fill(Color(hex: "00F0FF"))
                                .frame(width: geo.size.width * 0.4225, height: 6)

                            Circle()
                                .fill(Color(hex: "00F0FF"))
                                .frame(width: 12, height: 12)
                                .shadow(color: Color(hex: "00F0FF"), radius: 4)
                                .offset(x: geo.size.width * 0.4225 - 6)
                        }
                    }
                    .frame(height: 12)

                    Text("£11,550 tax-free allowance remaining until April 5")
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "94A3B8"))
                        .frame(maxWidth: .infinity, alignment: .leading)

                    Divider().background(Color.white.opacity(0.08)).padding(.vertical, 4)

                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Capital Gains Allowance")
                                .font(.system(size: 11))
                                .foregroundColor(Color(hex: "94A3B8"))
                            Text("£3,000.00 Limit")
                                .font(.system(size: 14, weight: .black))
                                .foregroundColor(.white)
                        }
                        Spacer()
                        VStack(alignment: .trailing, spacing: 2) {
                            Text("Dividend Allowance")
                                .font(.system(size: 11))
                                .foregroundColor(Color(hex: "94A3B8"))
                            Text("£500.00 Tax-Free")
                                .font(.system(size: 14, weight: .black))
                                .foregroundColor(.white)
                        }
                    }
                }
                .padding(18)
                .background(Color(hex: "071322").opacity(0.85))
                .cornerRadius(18)
                .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color(hex: "00F0FF").opacity(0.25), lineWidth: 1))

                // Card 3: Investor Suitability Mandate (Screenshot 1)
                Button(action: { onNavigate(.onboarding) }) {
                    HStack {
                        Text("INVESTOR SUITABILITY MANDATE")
                            .font(.system(size: 12, weight: .black))
                            .foregroundColor(Color(hex: "00F0FF"))
                            .tracking(0.5)
                        Spacer()
                        Text("Recalibrate →")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(Color(hex: "00F0FF"))
                    }
                    .padding(18)
                    .background(Color(hex: "071322").opacity(0.85))
                    .cornerRadius(18)
                    .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color(hex: "00F0FF").opacity(0.25), lineWidth: 1))
                }
                .buttonStyle(PlainButtonStyle())

                // Admin Console Access
                Button(action: { onNavigate(.admin) }) {
                    HStack {
                        Text("👑")
                            .font(.system(size: 16))
                        VStack(alignment: .leading, spacing: 2) {
                            Text("EB WEALTH ADMIN CONSOLE")
                                .font(.system(size: 12, weight: .black))
                                .foregroundColor(Color(hex: "FBBF24"))
                                .tracking(0.5)
                            Text("Executive Platform & Revenue Summary")
                                .font(.system(size: 10))
                                .foregroundColor(Color(hex: "94A3B8"))
                        }
                        Spacer()
                        Text("Open →")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(Color(hex: "FBBF24"))
                    }
                    .padding(14)
                    .background(Color(hex: "071322").opacity(0.85))
                    .cornerRadius(14)
                    .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color(hex: "FBBF24").opacity(0.35), lineWidth: 1))
                }
                .buttonStyle(PlainButtonStyle())

                // Quick Tools Grid
                LazyVGrid(columns: [GridItem(.flexible(), spacing: 10), GridItem(.flexible(), spacing: 10)], spacing: 10) {
                    toolButton(title: "📈 Growth Simulator", subtitle: "Forecast Compounding") { onNavigate(.simulator) }
                    toolButton(title: "🔍 ETF Overlap Tool", subtitle: "Analyze Fund Overlap") { onNavigate(.etfOverlap) }
                    toolButton(title: "📅 Upcoming Events", subtitle: "Live Masterclasses") { onNavigate(.events) }
                    toolButton(title: "📰 LSE Market News", subtitle: "Financial Bulletins") { onNavigate(.news) }
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .padding(.bottom, 24)
        }
        .sheet(isPresented: $showUpgradeSheet) {
            UpgradeProSheet(isPro: $profile.isPro)
        }
    }

    private func toolButton(title: String, subtitle: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(.white)
                Text(subtitle)
                    .font(.system(size: 10))
                    .foregroundColor(Color(hex: "94A3B8"))
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(12)
            .background(Color(hex: "071322").opacity(0.85))
            .cornerRadius(12)
            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: "00F0FF").opacity(0.2), lineWidth: 1))
        }
        .buttonStyle(PlainButtonStyle())
    }
}
