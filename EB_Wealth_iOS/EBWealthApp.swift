import SwiftUI

public enum MainTab: Hashable {
    case home
    case market
    case learn
    case portfolio
    case profile
}

@main
public struct EBWealthApp: App {
    @StateObject private var firebaseService = FirebaseService.shared
    @State private var userProfile = UserProfile(
        firstName: "Johnkennedy",
        email: "johnkennedy3313@gmail.com",
        isLoggedIn: true,
        isPro: false,
        xp: 350,
        streakDays: 4
    )
    @State private var currentTab: MainTab = .home
    @State private var showUpgradeSheet: Bool = false
    @State private var showCommunitySheet: Bool = false

    public init() {}

    public var body: some Scene {
        WindowGroup {
            ZStack {
                // Luxury cosmic wallpaper matching screenshot
                Image("img_cosmic_bg")
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .edgesIgnoringSafeArea(.all)

                // High-contrast atmospheric dark gradient overlay
                LinearGradient(
                    colors: [
                        Color(hex: "040B14").opacity(0.72),
                        Color(hex: "06101E").opacity(0.82),
                        Color(hex: "040A12").opacity(0.92)
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
                .edgesIgnoringSafeArea(.all)

                VStack(spacing: 0) {
                    // Top Bar exactly matching Screenshot
                    HStack(spacing: 10) {
                        // Left Logo
                        Button(action: { currentTab = .home }) {
                            HStack(spacing: 8) {
                                ZStack {
                                    RoundedRectangle(cornerRadius: 8)
                                        .fill(LinearGradient(
                                            colors: [Color(hex: "00F0FF"), Color(hex: "0284C7")],
                                            startPoint: .topLeading, endPoint: .bottomTrailing
                                        ))
                                        .frame(width: 34, height: 34)
                                    Text("EB")
                                        .font(.system(size: 15, weight: .black))
                                        .foregroundColor(.white)
                                }

                                VStack(alignment: .leading, spacing: 1) {
                                    HStack(spacing: 4) {
                                        Text("EB")
                                            .font(.system(size: 17, weight: .black))
                                            .foregroundColor(Color(hex: "00F0FF"))
                                        Text("Wealth")
                                            .font(.system(size: 17, weight: .black))
                                            .foregroundColor(Color(hex: "FBBF24"))
                                    }
                                    Text("Investment Education Platform")
                                        .font(.system(size: 10))
                                        .foregroundColor(Color(hex: "94A3B8"))
                                }
                            }
                        }
                        .buttonStyle(PlainButtonStyle())

                        Spacer()

                        // Right: Upgrade Pill Button
                        Button(action: { showUpgradeSheet = true }) {
                            HStack(spacing: 4) {
                                Image(systemName: "star.fill")
                                    .font(.system(size: 11))
                                    .foregroundColor(Color(hex: "D97706"))
                                Text("Upgrade")
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(Color(hex: "B45309"))
                            }
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(Color(hex: "FFFDF0"))
                            .cornerRadius(20)
                            .overlay(RoundedRectangle(cornerRadius: 20).stroke(Color(hex: "FDE68A"), lineWidth: 1))
                            .shadow(color: Color(hex: "FBBF24").opacity(0.2), radius: 4, x: 0, y: 2)
                        }

                        // Right: Avatar Circle Button
                        Button(action: { currentTab = .profile }) {
                            ZStack {
                                Circle()
                                    .fill(LinearGradient(
                                        colors: [Color(hex: "00BCD4"), Color(hex: "0284C7")],
                                        startPoint: .topLeading, endPoint: .bottomTrailing
                                    ))
                                    .frame(width: 36, height: 36)
                                    .overlay(Circle().stroke(Color(hex: "00F0FF"), lineWidth: 1.5))
                                Text(String(userProfile.firstName.prefix(1)).uppercased())
                                    .font(.system(size: 15, weight: .black))
                                    .foregroundColor(.white)
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 10)
                    .background(Color(hex: "040B14").opacity(0.95))
                    .overlay(
                        Rectangle().frame(height: 1).foregroundColor(Color(hex: "00F0FF").opacity(0.15)),
                        alignment: .bottom
                    )

                    // Active Tab Screen
                    ZStack {
                        switch currentTab {
                        case .home:
                            DashboardView(
                                profile: $userProfile,
                                onSelectTab: { tab in currentTab = tab },
                                onOpenCommunity: { showCommunitySheet = true }
                            )
                            .environmentObject(firebaseService)

                        case .market:
                            ResearchView(onBack: { currentTab = .home })
                                .environmentObject(firebaseService)

                        case .learn:
                            AcademyView(profile: $userProfile)
                                .environmentObject(firebaseService)

                        case .portfolio:
                            PortfolioView()
                                .environmentObject(firebaseService)

                        case .profile:
                            ProfileView(profile: $userProfile)
                                .environmentObject(firebaseService)
                        }
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)

                    // Floating Cyber Frosted-Glass Bottom Dock
                    HStack(spacing: 0) {
                        navDockItem(tab: .home, title: "Home", systemImage: "house.fill")
                        navDockItem(tab: .market, title: "Market", systemImage: "chart.line.uptrend.xyaxis")
                        navDockItem(tab: .learn, title: "Learn", systemImage: "square.stack.3d.up.fill")
                        navDockItem(tab: .portfolio, title: "Portfolio", systemImage: "chart.pie.fill")
                    }
                    .frame(maxWidth: .infinity)
                    .frame(height: 64)
                    .background(Color(hex: "071322").opacity(0.92))
                    .cornerRadius(32)
                    .overlay(
                        RoundedRectangle(cornerRadius: 32)
                            .stroke(
                                LinearGradient(
                                    colors: [Color(hex: "00F0FF"), Color(hex: "38BDF8"), Color(hex: "00F0FF")],
                                    startPoint: .leading, endPoint: .trailing
                                ),
                                lineWidth: 1.5
                            )
                    )
                    .shadow(color: Color(hex: "00F0FF").opacity(0.35), radius: 16, x: 0, y: 4)
                    .padding(.horizontal, 20)
                    .padding(.bottom, 12)
                }
            }
            .sheet(isPresented: $showUpgradeSheet) {
                UpgradeProSheet(isPro: $userProfile.isPro)
            }
            .sheet(isPresented: $showCommunitySheet) {
                CommunityView(profile: $userProfile)
                    .environmentObject(firebaseService)
            }
        }
    }

    @ViewBuilder
    private func navDockItem(tab: MainTab, title: String, systemImage: String) -> some View {
        let isSelected = currentTab == tab
        Button(action: { currentTab = tab }) {
            VStack(spacing: 3) {
                ZStack {
                    if isSelected {
                        RoundedRectangle(cornerRadius: 10)
                            .fill(Color(hex: "00F0FF").opacity(0.2))
                            .frame(width: 34, height: 30)
                    }
                    Image(systemName: systemImage)
                        .font(.system(size: 19))
                        .foregroundColor(isSelected ? Color(hex: "00F0FF") : Color(hex: "94A3B8"))
                }
                Text(title)
                    .font(.system(size: 11, weight: isSelected ? .heavy : .medium))
                    .foregroundColor(isSelected ? .white : Color(hex: "64748B"))
            }
            .frame(maxWidth: .infinity)
        }
    }
}

// MARK: - Color Hex Extension
extension Color {
    init(hex: String) {
        let scanner = Scanner(string: hex)
        var rgbValue: UInt64 = 0
        scanner.scanHexInt64(&rgbValue)
        let r = Double((rgbValue & 0xFF0000) >> 16) / 255.0
        let g = Double((rgbValue & 0x00FF00) >> 8) / 255.0
        let b = Double(rgbValue & 0x0000FF) / 255.0
        self.init(red: r, green: g, blue: b)
    }
}

// MARK: - Upgrade Pro Sheet
struct UpgradeProSheet: View {
    @Binding var isPro: Bool
    @Environment(\.presentationMode) var presentationMode

    var body: some View {
        ZStack {
            Color(hex: "071322").edgesIgnoringSafeArea(.all)
            VStack(spacing: 20) {
                HStack {
                    Image(systemName: "star.fill").foregroundColor(Color(hex: "FBBF24")).font(.title2)
                    Text("EB Wealth Pro Tier").font(.system(size: 20, weight: .black)).foregroundColor(.white)
                    Spacer()
                    Button(action: { presentationMode.wrappedValue.dismiss() }) {
                        Image(systemName: "xmark.circle.fill").foregroundColor(Color(hex: "94A3B8")).font(.title2)
                    }
                }
                .padding(.top, 24)

                Text("Unlock institutional UK wealth intelligence, real-time London Stock Exchange Level 2 quotes, unlimited AI portfolio rebalancing, and verified priority community status.")
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "CBD5E1"))
                    .lineSpacing(4)

                VStack(alignment: .leading, spacing: 10) {
                    Text("PRO INCLUDES:").font(.system(size: 11, weight: .black)).foregroundColor(Color(hex: "00F0FF"))
                    proFeatureRow("UK Stocks & Shares ISA Tax Optimization Engine")
                    proFeatureRow("Real-time LSE Live Quotes & Health Scorecards")
                    proFeatureRow("Full 6-Level Wealth Academy & Certification")
                    proFeatureRow("Direct Cloud Firestore Vault Encryption")
                }
                .padding()
                .background(Color(hex: "00F0FF").opacity(0.08))
                .cornerRadius(12)
                .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: "00F0FF"), lineWidth: 1))

                Spacer()

                Button(action: {
                    isPro = true
                    presentationMode.wrappedValue.dismiss()
                }) {
                    Text("Upgrade Now — £14.99 / month")
                        .font(.system(size: 14, weight: .heavy))
                        .foregroundColor(Color(hex: "040B14"))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(Color(hex: "FBBF24"))
                        .cornerRadius(12)
                }
                .padding(.bottom, 24)
            }
            .padding(.horizontal, 20)
        }
    }

    private func proFeatureRow(_ text: String) -> some View {
        HStack(spacing: 8) {
            Image(systemName: "checkmark.circle.fill").foregroundColor(Color(hex: "10B981")).font(.system(size: 13))
            Text(text).font(.system(size: 12, weight: .semibold)).foregroundColor(.white)
        }
    }
}
