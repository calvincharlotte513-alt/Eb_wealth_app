import SwiftUI

public struct ETFOverlapView: View {
    public var onBack: () -> Void

    public init(onBack: @escaping () -> Void = {}) {
        self.onBack = onBack
    }

    public var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Header
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
                        Text("ETF Overlap Checker")
                            .font(.system(size: 16, weight: .heavy))
                            .foregroundColor(.white)
                        Text("Analyze duplicate fund stock weights")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "94A3B8"))
                    }
                    Spacer()
                }

                // Overlap Metric Card
                VStack(spacing: 8) {
                    Text("ESTIMATED WEIGHT OVERLAP")
                        .font(.system(size: 11, weight: .black))
                        .foregroundColor(Color(hex: "FBBF24"))
                    Text("64.2%")
                        .font(.system(size: 42, weight: .black))
                        .foregroundColor(Color(hex: "00F0FF"))
                    Text("Between Vanguard FTSE All-World & Vanguard S&P 500")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "94A3B8"))
                }
                .padding(22)
                .frame(maxWidth: .infinity)
                .background(Color(hex: "071322").opacity(0.85))
                .cornerRadius(18)
                .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color(hex: "00F0FF").opacity(0.4), lineWidth: 1))

                // Duplicate Holdings
                VStack(alignment: .leading, spacing: 10) {
                    Text("TOP DUPLICATE HOLDINGS")
                        .font(.system(size: 12, weight: .black))
                        .foregroundColor(.white)

                    overlapRow("Microsoft Corporation (MSFT)", weight: "6.8% Combined")
                    overlapRow("Apple Inc. (AAPL)", weight: "6.2% Combined")
                    overlapRow("NVIDIA Corporation (NVDA)", weight: "5.9% Combined")
                    overlapRow("Amazon.com Inc. (AMZN)", weight: "3.8% Combined")
                }
                .padding(18)
                .background(Color(hex: "071322").opacity(0.85))
                .cornerRadius(18)
                .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color(hex: "00F0FF").opacity(0.25), lineWidth: 1))
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .padding(.bottom, 24)
        }
    }

    private func overlapRow(_ name: String, weight: String) -> some View {
        HStack {
            Text(name).font(.system(size: 12)).foregroundColor(.white)
            Spacer()
            Text(weight).font(.system(size: 12, weight: .bold)).foregroundColor(Color(hex: "00F0FF"))
        }
        .padding(.vertical, 4)
    }
}
