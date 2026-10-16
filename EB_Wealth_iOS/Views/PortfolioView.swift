import SwiftUI

public struct PortfolioView: View {
    public var onNavigateToOverlap: () -> Void
    @EnvironmentObject private var firebaseService: FirebaseService
    @State private var holdings: [Holding] = []
    @State private var showAddModal: Bool = false

    public init(onNavigateToOverlap: @escaping () -> Void = {}) {
        self.onNavigateToOverlap = onNavigateToOverlap
    }

    private var totalVal: Double {
        holdings.reduce(0) { $0 + $1.currentValue }
    }

    private var totalCost: Double {
        holdings.reduce(0) { $0 + $1.totalCost }
    }

    private var totalReturn: Double {
        totalVal - totalCost
    }

    private var returnPct: Double {
        guard totalCost > 0 else { return 0.0 }
        return (totalReturn / totalCost) * 100
    }

    public var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                // LSE Live Feed Bar (Screenshot 4)
                HStack {
                    HStack(spacing: 6) {
                        Circle().fill(Color(hex: "10B981")).frame(width: 6, height: 6)
                        Text("LSE LIVE FEED")
                            .font(.system(size: 10, weight: .black))
                            .foregroundColor(Color(hex: "10B981"))
                    }
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(Color(hex: "10B981").opacity(0.12))
                    .cornerRadius(6)
                    .overlay(RoundedRectangle(cornerRadius: 6).stroke(Color(hex: "10B981").opacity(0.4), lineWidth: 1))

                    Text("Today, 14:33")
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "94A3B8"))

                    Spacer()

                    Button(action: {}) {
                        Text("🔄 Refresh Quotes")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(Color(hex: "00F0FF"))
                    }
                }

                // TOTAL PORTFOLIO VALUATION Card (Screenshot 4)
                VStack(alignment: .leading, spacing: 6) {
                    Text("TOTAL PORTFOLIO VALUATION")
                        .font(.system(size: 11, weight: .black))
                        .foregroundColor(Color(hex: "FBBF24"))
                        .tracking(0.8)

                    Text("£\(String(format: "%.2f", totalVal))")
                        .font(.system(size: 34, weight: .heavy))
                        .foregroundColor(.white)
                        .padding(.vertical, 2)

                    HStack {
                        Text("Total Cost Basis: £\(String(format: "%.2f", totalCost))")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "94A3B8"))
                        Spacer()
                        Text("Unrealized Return: +£\(String(format: "%.2f", totalReturn)) (\(String(format: "%.1f", returnPct))%)")
                            .font(.system(size: 12, weight: .heavy))
                            .foregroundColor(Color(hex: "10B981"))
                    }
                }
                .padding(18)
                .background(Color(hex: "071322").opacity(0.85))
                .cornerRadius(18)
                .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color(hex: "00F0FF").opacity(0.35), lineWidth: 1))

                // Account & Geographic Allocation Card (Screenshot 4)
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Text("Account & Geographic Allocation")
                            .font(.system(size: 13, weight: .heavy))
                            .foregroundColor(.white)
                        Spacer()
                        Button(action: onNavigateToOverlap) {
                            Text("Rebalance Tool →")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(Color(hex: "00F0FF"))
                        }
                    }

                    Text("By UK Tax Vehicle:")
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "94A3B8"))

                    VStack(spacing: 8) {
                        allocationBar(label: "Stocks & Shares ISA", pct: "80%", width: 0.8, color: Color(hex: "00F0FF"))
                        allocationBar(label: "General Investment Account (GIA)", pct: "20%", width: 0.2, color: Color(hex: "FBBF24"))
                    }

                    Text("By Geographic Exposure:")
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "94A3B8"))
                        .padding(.top, 4)

                    VStack(spacing: 8) {
                        allocationBar(label: "Global All-World (VWRP)", pct: "60%", width: 0.6, color: Color(hex: "38BDF8"))
                        allocationBar(label: "US S&P 500 (VUAG)", pct: "40%", width: 0.4, color: Color(hex: "10B981"))
                    }
                }
                .padding(18)
                .background(Color(hex: "071322").opacity(0.85))
                .cornerRadius(18)
                .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color(hex: "00F0FF").opacity(0.25), lineWidth: 1))

                // Holdings Header with (+) Button
                HStack {
                    Text("Holdings (\(holdings.count))")
                        .font(.system(size: 16, weight: .black))
                        .foregroundColor(.white)
                    Spacer()
                    Button(action: { showAddModal = true }) {
                        HStack(spacing: 4) {
                            Image(systemName: "plus")
                            Text("Add")
                        }
                        .font(.system(size: 12, weight: .black))
                        .foregroundColor(Color(hex: "040B14"))
                        .padding(.horizontal, 14)
                        .padding(.vertical, 6)
                        .background(Color(hex: "00F0FF"))
                        .cornerRadius(20)
                    }
                }
                .padding(.top, 4)

                if holdings.isEmpty {
                    VStack(spacing: 12) {
                        Text("No holdings in portfolio yet.")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "94A3B8"))

                        Button(action: {
                            holdings = [
                                Holding(id: "h1", ticker: "VWRP", name: "Vanguard FTSE All-World UCITS ETF", shares: 45, avgBuyPrice: 104.20, currentPrice: 112.40, allocationCategory: "Global", currency: "GBP"),
                                Holding(id: "h2", ticker: "VUAG", name: "Vanguard S&P 500 UCITS ETF", shares: 25, avgBuyPrice: 79.10, currentPrice: 85.25, allocationCategory: "US Equities", currency: "GBP")
                            ]
                        }) {
                            Text("Load Sample Holdings (VWRP + VUAG)")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(Color(hex: "00F0FF"))
                                .padding(.horizontal, 16)
                                .padding(.vertical, 8)
                                .background(Color(hex: "00F0FF").opacity(0.15))
                                .cornerRadius(10)
                                .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "00F0FF"), lineWidth: 1))
                        }
                    }
                    .padding(24)
                    .frame(maxWidth: .infinity)
                    .background(Color(hex: "071322").opacity(0.85))
                    .cornerRadius(16)
                } else {
                    ForEach(holdings, id: \.id) { h in
                        HStack {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(h.ticker)
                                    .font(.system(size: 16, weight: .black))
                                    .foregroundColor(.white)
                                Text("\(h.name) • \(String(format: "%.0f", h.shares)) Shares")
                                    .font(.system(size: 11))
                                    .foregroundColor(Color(hex: "94A3B8"))
                            }
                            Spacer()
                            VStack(alignment: .trailing, spacing: 2) {
                                Text("£\(String(format: "%.2f", h.currentValue))")
                                    .font(.system(size: 15, weight: .heavy))
                                    .foregroundColor(.white)
                                Text("+£\(String(format: "%.2f", h.profit))")
                                    .font(.system(size: 11, weight: .bold))
                                    .foregroundColor(Color(hex: "10B981"))
                            }
                        }
                        .padding(14)
                        .background(Color(hex: "071322").opacity(0.85))
                        .cornerRadius(14)
                        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color(hex: "00F0FF").opacity(0.2), lineWidth: 1))
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .padding(.bottom, 24)
        }
    }

    private func allocationBar(label: String, pct: String, width: CGFloat, color: Color) -> some View {
        VStack(spacing: 4) {
            HStack {
                Text(label).font(.system(size: 11)).foregroundColor(.white)
                Spacer()
                Text(pct).font(.system(size: 11, weight: .bold)).foregroundColor(color)
            }
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 3).fill(Color.white.opacity(0.1)).frame(height: 5)
                    RoundedRectangle(cornerRadius: 3).fill(color).frame(width: geo.size.width * width, height: 5)
                }
            }
            .frame(height: 5)
        }
    }
}
