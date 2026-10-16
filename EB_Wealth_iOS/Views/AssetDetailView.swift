import SwiftUI

public struct AssetDetailView: View {
    public let ticker: String
    public var onBack: () -> Void

    public init(ticker: String, onBack: @escaping () -> Void = {}) {
        self.ticker = ticker
        self.onBack = onBack
    }

    public var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Top Header with Back Button
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
                        Text("\(ticker) • London Stock Exchange")
                            .font(.system(size: 16, weight: .heavy))
                            .foregroundColor(.white)
                        Text("Institutional Factsheet & Analytics")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "94A3B8"))
                    }
                    Spacer()
                }

                // Price Card
                VStack(spacing: 10) {
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("CURRENT MARKET PRICE")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(Color(hex: "94A3B8"))
                            Text("£112.40")
                                .font(.system(size: 30, weight: .black))
                                .foregroundColor(.white)
                        }
                        Spacer()
                        Text("+0.42%")
                            .font(.system(size: 14, weight: .heavy))
                            .foregroundColor(Color(hex: "10B981"))
                            .padding(.horizontal, 10)
                            .padding(.vertical, 5)
                            .background(Color(hex: "10B981").opacity(0.15))
                            .cornerRadius(8)
                            .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color(hex: "10B981"), lineWidth: 1))
                    }
                }
                .padding(18)
                .background(Color(hex: "071322").opacity(0.85))
                .cornerRadius(18)
                .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color(hex: "00F0FF").opacity(0.4), lineWidth: 1))

                // Scorecard Card
                VStack(alignment: .leading, spacing: 12) {
                    Text("EB INSTITUTIONAL HEALTH SCORECARD")
                        .font(.system(size: 11, weight: .black))
                        .foregroundColor(Color(hex: "FBBF24"))
                        .tracking(0.8)

                    scorecardRow("Financial Strength", score: "9.4/10", width: 0.94, color: Color(hex: "00F0FF"))
                    scorecardRow("Valuation Multiples", score: "8.2/10", width: 0.82, color: Color(hex: "FBBF24"))
                    scorecardRow("Dividend Reliability", score: "9.8/10", width: 0.98, color: Color(hex: "10B981"))
                }
                .padding(18)
                .background(Color(hex: "071322").opacity(0.85))
                .cornerRadius(18)
                .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color(hex: "00F0FF").opacity(0.25), lineWidth: 1))

                // Thesis
                VStack(alignment: .leading, spacing: 8) {
                    Text("INVESTMENT THESIS")
                        .font(.system(size: 11, weight: .black))
                        .foregroundColor(Color(hex: "00F0FF"))
                    Text("Provides physical replication of global equities spanning 49 countries. Features automated accumulating dividend reinvestment and zero stamp duty within UK Stocks & Shares ISA wrappers.")
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "CBD5E1"))
                        .lineSpacing(4)
                }
                .padding(18)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color(hex: "071322").opacity(0.85))
                .cornerRadius(18)
                .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color(hex: "00F0FF").opacity(0.25), lineWidth: 1))
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .padding(.bottom, 24)
        }
    }

    private func scorecardRow(_ label: String, score: String, width: CGFloat, color: Color) -> some View {
        VStack(spacing: 4) {
            HStack {
                Text(label).font(.system(size: 12)).foregroundColor(.white)
                Spacer()
                Text(score).font(.system(size: 12, weight: .heavy)).foregroundColor(color)
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
