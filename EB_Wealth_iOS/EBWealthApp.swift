import SwiftUI

@main
public struct EBWealthApp: App {
    @StateObject private var firebaseService = FirebaseService.shared
    @State private var userProfile = UserProfile()

    public init() {}

    public var body: some Scene {
        WindowGroup {
            ZStack {
                // Luxury cosmic wallpaper
                Image("img_cosmic_bg")
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .edgesIgnoringSafeArea(.all)

                // Dark atmospheric overlay
                LinearGradient(
                    colors: [Color(hex: "040B14").opacity(0.55), Color(hex: "06101E").opacity(0.65), Color(hex: "040A12").opacity(0.75)],
                    startPoint: .top,
                    endPoint: .bottom
                )
                .edgesIgnoringSafeArea(.all)

                if !userProfile.isLoggedIn {
                    AuthView(profile: $userProfile)
                        .environmentObject(firebaseService)
                } else {
                    TabView {
                        DashboardView(profile: $userProfile)
                            .environmentObject(firebaseService)
                            .tabItem { Label("Dashboard", systemImage: "chart.pie.fill") }

                        PortfolioView()
                            .environmentObject(firebaseService)
                            .tabItem { Label("Portfolio", systemImage: "briefcase.fill") }

                        AcademyView(profile: $userProfile)
                            .environmentObject(firebaseService)
                            .tabItem { Label("Academy", systemImage: "graduationcap.fill") }

                        AICoachView()
                            .environmentObject(firebaseService)
                            .tabItem { Label("AI Coach", systemImage: "cpu.fill") }

                        CommunityView(profile: $userProfile)
                            .environmentObject(firebaseService)
                            .tabItem { Label("Community", systemImage: "bubble.left.and.bubble.right.fill") }

                        ProfileView(profile: $userProfile)
                            .environmentObject(firebaseService)
                            .tabItem { Label("Vault", systemImage: "person.crop.circle.fill") }
                    }
                    .accentColor(Color(hex: "00F0FF"))
                }
            }
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
