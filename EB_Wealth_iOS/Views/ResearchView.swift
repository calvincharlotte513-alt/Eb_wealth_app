import SwiftUI

public struct ResearchView: View {
    public var onBack: () -> Void
    public var onSelectAsset: (String) -> Void
    @State private var searchQuery: String = ""

    public init(onBack: @escaping () -> Void = {}, onSelectAsset: @escaping (String) -> Void = { _ in }) {
        self.onBack = onBack
        self.onSelectAsset = onSelectAsset
    }

    private let analyzedAssets = [
        (
            ticker: "VWRP",
            name: "Vanguard FTSE All-World UCITS ETF",
            type: "ETF",
            exchange: "London Stock Exchange (LSE)",
            price: "£112.40",
            change: "+0.42%",
            pe: "19.8x",
            yield: "1.8% (Accumulated)",
            cap: "£18.4 Billion",
            sector: "Globally Diversified"
        ),
        (
            ticker: "VUAG",
            name: "Vanguard S&P 500 UCITS ETF",
            type: "ETF",
            exchange: "London Stock Exchange (LSE)",
            price: "£85.25",
            change: "+0.38%",
            pe: "24.2x",
            yield: "1.4% (Accumulated)",
            cap: "£32.1 Billion",
            sector: "US Large Cap"
        ),
        (
            ticker: "AZN",
            name: "AstraZeneca PLC",
            type: "Stock",
            exchange: "London Stock Exchange (LSE)",
            price: "£104.50",
            change: "+1.12%",
            pe: "32.4x",
            yield: "2.3% (Semi-Annual)",
            cap: "£162.0 Billion",
            sector: "Pharmaceuticals"
        ),
        (
            ticker: "EQGB",
            name: "Invesco EQQQ Nasdaq 100",
            type: "ETF",
            exchange: "London Stock Exchange (LSE)",
            price: "£34.10",
            change: "+0.65%",
            pe: "28.1x",
            yield: "0.6% (Accumulated)",
            cap: "£4.8 Billion",
            sector: "Technology & Growth"
        )
    ]

    private var filteredAssets: [(ticker: String, name: String, type: String, exchange: String, price: String, change: String, pe: String, yield: String, cap: String, sector: String)] {
        if searchQuery.isEmpty { return analyzedAssets }
        return analyzedAssets.filter {
            $0.ticker.localizedCaseInsensitiveContains(searchQuery) ||
            $0.name.localizedCaseInsensitiveContains(searchQuery)
        }
    }

    public var body: some View {
        ScrollView {
            VStack(spacing: 14) {
                // Header Row with Back Button (Screenshot 3)
                HStack(spacing: 12) {
                    Button(action: onBack) {
                        Image(systemName: "arrow.left")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(Color(hex: "00F0FF"))
                            .frame(width: 36, height: 36)
                            .background(Color(hex: "00F0FF").opacity(0.1))
                            .clipShape(Circle())
                            .overlay(Circle().stroke(Color(hex: "00F0FF").opacity(0.3), lineWidth: 1))
                    }

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Market Intelligence & Research")
                            .font(.system(size: 16, weight: .heavy))
                            .foregroundColor(.white)
                        Text("London Stock Exchange (LSE) & Global ETFs")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "94A3B8"))
                    }
                    Spacer()
                }

                // Glowing Search Input Bar
                HStack {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "00F0FF"))
                    TextField("Search by ticker or fund (e.g. VWRP, VUAG, AZN)...", text: $searchQuery)
                        .font(.system(size: 13))
                        .foregroundColor(.white)
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(Color(hex: "00F0FF").opacity(0.08))
                .cornerRadius(28)
                .overlay(RoundedRectangle(cornerRadius: 28).stroke(Color(hex: "00F0FF").opacity(0.5), lineWidth: 1))

                // Stats Subtitle
                HStack {
                    Text("Displaying \(filteredAssets.count) Analyzed Assets")
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "94A3B8"))
                    Spacer()
                    Text("FCA Compliant Metrics")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(Color(hex: "FBBF24"))
                }
                .padding(.horizontal, 4)

                // Asset Cards matching Screenshot 3
                ForEach(filteredAssets, id: \.ticker) { asset in
                    VStack(spacing: 12) {
                        HStack(alignment: .top) {
                            VStack(alignment: .leading, spacing: 4) {
                                HStack(spacing: 6) {
                                    Text(asset.type)
                                        .font(.system(size: 10, weight: .bold))
                                        .foregroundColor(Color(hex: "00F0FF"))
                                        .padding(.horizontal, 8)
                                        .padding(.vertical, 2)
                                        .background(Color(hex: "00F0FF").opacity(0.15))
                                        .cornerRadius(6)
                                        .overlay(RoundedRectangle(cornerRadius: 6).stroke(Color(hex: "00F0FF").opacity(0.4), lineWidth: 1))
                                    Text(asset.exchange)
                                        .font(.system(size: 11))
                                        .foregroundColor(Color(hex: "94A3B8"))
                                }
                                Text(asset.ticker)
                                    .font(.system(size: 20, weight: .black))
                                    .foregroundColor(.white)
                                Text(asset.name)
                                    .font(.system(size: 12))
                                    .foregroundColor(Color(hex: "CBD5E1"))
                            }
                            Spacer()
                            VStack(alignment: .trailing, spacing: 2) {
                                Text(asset.price)
                                    .font(.system(size: 18, weight: .black))
                                    .foregroundColor(.white)
                                Text(asset.change)
                                    .font(.system(size: 12, weight: .heavy))
                                    .foregroundColor(Color(hex: "10B981"))
                            }
                        }

                        // 4-metric grid
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                            metricItem(label: "P/E Ratio", value: asset.pe, color: .white)
                            metricItem(label: "Dividend Yield", value: asset.yield, color: Color(hex: "10B981"))
                            metricItem(label: "Market Cap", value: asset.cap, color: Color(hex: "38BDF8"))
                            metricItem(label: "Sector", value: asset.sector, color: Color(hex: "FBBF24"))
                        }
                        .padding(12)
                        .background(Color.black.opacity(0.25))
                        .cornerRadius(12)

                        // EB Health Scorecard
                        HStack {
                            HStack(spacing: 6) {
                                Image(systemName: "checkmark.shield.fill")
                                    .foregroundColor(Color(hex: "10B981"))
                                    .font(.system(size: 13))
                                Text("EB Health Scorecard")
                                    .font(.system(size: 11, weight: .bold))
                                    .foregroundColor(Color(hex: "10B981"))
                            }
                            Spacer()
                            Text("View Factsheet →")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(Color(hex: "00F0FF"))
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(Color(hex: "10B981").opacity(0.1))
                        .cornerRadius(10)
                        .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "10B981").opacity(0.3), lineWidth: 1))
                    }
                    .padding(16)
                    .background(Color(hex: "071322").opacity(0.88))
                    .cornerRadius(18)
                    .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color(hex: "00F0FF").opacity(0.28), lineWidth: 1))
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .padding(.bottom, 24)
        }
    }

    private func metricItem(label: String, value: String, color: Color) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(label).font(.system(size: 10, weight: .semibold)).foregroundColor(Color(hex: "94A3B8"))
            Text(value).font(.system(size: 13, weight: .black)).foregroundColor(color)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}
