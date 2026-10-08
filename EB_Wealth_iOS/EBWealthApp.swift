import SwiftUI

@main
public struct EBWealthApp: App {
    @StateObject private var firebaseService = FirebaseService.shared
    @State private var userProfile = UserProfile()
    
    public init() {}
    
    public var body: some Scene {
        WindowGroup {
            ZStack {
                // Luxury Midnight & Gold EB Wealth Wallpaper
                Image("img_cosmic_bg")
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .edgesIgnoringSafeArea(.all)
                
                // Dark Atmospheric Contrast Overlay
                Color(hex: "040B14").opacity(0.65)
                    .edgesIgnoringSafeArea(.all)
                
                if !userProfile.isLoggedIn {
                    AuthView(profile: $userProfile)
                } else {
                    TabView {
                        DashboardView(profile: $userProfile)
                            .tabItem {
                                Label("Dashboard", systemImage: "chart.pie.fill")
                            }
                        
                        PortfolioView()
                            .tabItem {
                                Label("Portfolio", systemImage: "briefcase.fill")
                            }
                        
                        AcademyView()
                            .tabItem {
                                Label("Academy", systemImage: "graduationcap.fill")
                            }
                        
                        AICoachView()
                            .tabItem {
                                Label("AI Coach", systemImage: "cpu.fill")
                            }
                        
                        CommunityView()
                            .tabItem {
                                Label("Community", systemImage: "bubble.left.and.bubble.right.fill")
                            }
                        
                        ProfileView(profile: $userProfile)
                            .tabItem {
                                Label("Vault", systemImage: "person.crop.circle.fill")
                            }
                    }
                    .accentColor(Color(hex: "00F0FF"))
                }
            }
        }
    }
}

// Color Hex Extension
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
