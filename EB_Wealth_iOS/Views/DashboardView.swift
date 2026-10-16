import SwiftUI

public struct DashboardView: View {
    @Binding public var profile: UserProfile
    public var onSelectTab: (MainTab) -> Void
    public var onOpenCommunity: () -> Void
    @EnvironmentObject private var firebaseService: FirebaseService

    public init(
        profile: Binding<UserProfile>,
        onSelectTab: @escaping (MainTab) -> Void = { _ in },
        onOpenCommunity: @escaping () -> Void = {}
    ) {
        self._profile = profile
        self.onSelectTab = onSelectTab
        self.onOpenCommunity = onOpenCommunity
    }

    private let sampleAssets = [
        (ticker: "VWRP", name: "Vanguard FTSE All-World", type: "ETF", change: "+0.42%", price: "£112.40"),
        (ticker: "VUAG", name: "Vanguard S&P 500", type: "ETF", change: "+0.38%", price: "£85.25"),
        (ticker: "AZN", name: "AstraZeneca PLC", type: "Stock", change: "+1.12%", price: "£104.50"),
        (ticker: "EQGB", name: "Invesco EQQQ Nasdaq", type: "ETF", change: "+0.65%", price: "£34.10"),
        (ticker: "ISF", name: "iShares Core FTSE 100", type: "ETF", change: "+0.15%", price: "£8.22")
    ]

    public var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                // EB Wealth Big Center Title (Screenshot 2)
                VStack(spacing: 2) {
                    HStack(spacing: 6) {
                        Text("EB")
                            .font(.system(size: 32, weight: .black))
                            .foregroundColor(Color(hex: "00F0FF"))
                        Text("Wealth")
                            .font(.system(size: 32, weight: .black))
                            .foregroundColor(Color(hex: "FBBF24"))
                    }
                    Text("Investment Education Platform")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(Color(hex: "CBD5E1"))
                }
                .padding(.top, 8)

                // Glowing Cosmic Search Bar
                Button(action: { onSelectTab(.market) }) {
                    HStack {
                        Text("Search UK stocks, ETFs, lessons...")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "94A3B8"))
                        Spacer()
                        ZStack {
                            Circle()
                                .fill(Color(hex: "00F0FF").opacity(0.2))
                                .frame(width: 32, height: 32)
                            Image(systemName: "magnifyingglass")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(Color(hex: "00F0FF"))
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(Color(hex: "00F0FF").opacity(0.08))
                    .cornerRadius(28)
                    .overlay(RoundedRectangle(cornerRadius: 28).stroke(Color(hex: "00F0FF").opacity(0.5), lineWidth: 1))
                    .shadow(color: Color(hex: "00F0FF").opacity(0.15), radius: 8, x: 0, y: 0)
                }
                .buttonStyle(PlainButtonStyle())

                // 2x2 Quick Action Cards Grid (Screenshot 2)
                LazyVGrid(columns: [GridItem(.flexible(), spacing: 12), GridItem(.flexible(), spacing: 12)], spacing: 12) {
                    // Card 1: Market Galaxy
                    quickCard(
                        title: "Market Galaxy",
                        subtitle: "LSE & Global Movers",
                        icon: "chart.line.uptrend.xyaxis",
                        iconColor: Color(hex: "00F0FF"),
                        boxBg: Color(hex: "00F0FF").opacity(0.15),
                        boxBorder: Color(hex: "00F0FF").opacity(0.5)
                    ) { onSelectTab(.market) }

                    // Card 2: Learning Nexus
                    quickCard(
                        title: "Learning Nexus",
                        subtitle: "6-Level Academy",
                        icon: "square.stack.3d.up.fill",
                        iconColor: Color(hex: "38BDF8"),
                        boxBg: Color(hex: "0284C7").opacity(0.2),
                        boxBorder: Color(hex: "0284C7").opacity(0.6)
                    ) { onSelectTab(.learn) }

                    // Card 3: Portfolio Constellation
                    quickCard(
                        title: "Portfolio Constellation",
                        subtitle: "Holdings & Rebalance",
                        icon: "chart.pie.fill",
                        iconColor: Color(hex: "FBBF24"),
                        boxBg: Color(hex: "FBBF24").opacity(0.18),
                        boxBorder: Color(hex: "FBBF24").opacity(0.6)
                    ) { onSelectTab(.portfolio) }

                    // Card 4: Community Forum
                    quickCard(
                        title: "Community Forum",
                        subtitle: "Discussions & Events",
                        icon: "bubble.left.and.bubble.right.fill",
                        iconColor: Color(hex: "2DD4BF"),
                        boxBg: Color(hex: "14B8A6").opacity(0.2),
                        boxBorder: Color(hex: "14B8A6").opacity(0.6)
                    ) { onOpenCommunity() }
                }

                // Featured Market Assets Header
                VStack(alignment: .leading, spacing: 2) {
                    Text("FEATURED MARKET ASSETS")
                        .font(.system(size: 11, weight: .black))
                        .foregroundColor(Color(hex: "FBBF24"))
                        .tracking(0.8)
                    Text("Live UK & Global Movers")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "94A3B8"))
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.top, 4)

                // Horizontal Carousel Cards
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(sampleAssets, id: \.ticker) { asset in
                            Button(action: { onSelectTab(.market) }) {
                                VStack(alignment: .leading, spacing: 6) {
                                    HStack {
                                        Text(asset.type)
                                            .font(.system(size: 10, weight: .bold))
                                            .foregroundColor(Color(hex: "475569"))
                                            .padding(.horizontal, 7)
                                            .padding(.vertical, 2)
                                            .background(Color(hex: "EEF2F6"))
                                            .cornerRadius(6)
                                        Spacer()
                                        Text(asset.change)
                                            .font(.system(size: 12, weight: .black))
                                            .foregroundColor(Color(hex: "10B981"))
                                    }
                                    Text(asset.ticker)
                                        .font(.system(size: 16, weight: .black))
                                        .foregroundColor(Color(hex: "0F172A"))
                                    Text(asset.price)
                                        .font(.system(size: 13, weight: .bold))
                                        .foregroundColor(Color(hex: "334155"))
                                }
                                .padding(14)
                                .frame(width: 175)
                                .background(Color.white)
                                .cornerRadius(16)
                                .shadow(color: Color.black.opacity(0.25), radius: 8, x: 0, y: 4)
                            }
                            .buttonStyle(PlainButtonStyle())
                        }
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .padding(.bottom, 24)
        }
    }

    private func quickCard(
        title: String,
        subtitle: String,
        icon: String,
        iconColor: Color,
        boxBg: Color,
        boxBorder: Color,
        action: @escaping () -> Void
    ) -> some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: 10) {
                ZStack {
                    RoundedRectangle(cornerRadius: 10)
                        .fill(boxBg)
                        .frame(width: 38, height: 38)
                        .overlay(RoundedRectangle(cornerRadius: 10).stroke(boxBorder, lineWidth: 1))
                    Image(systemName: icon)
                        .font(.system(size: 18))
                        .foregroundColor(iconColor)
                }

                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.system(size: 14, weight: .heavy))
                        .foregroundColor(.white)
                    Text(subtitle)
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "94A3B8"))
                }
            }
            .padding(14)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color(hex: "071322").opacity(0.85))
            .cornerRadius(16)
            .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(hex: "00F0FF").opacity(0.22), lineWidth: 1))
        }
        .buttonStyle(PlainButtonStyle())
    }
}
