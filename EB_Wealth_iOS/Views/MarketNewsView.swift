import SwiftUI

public struct MarketNewsView: View {
    public var onBack: () -> Void

    public init(onBack: @escaping () -> Void = {}) {
        self.onBack = onBack
    }

    private let news = [
        (title: "Bank of England Holds Base Rate at 5.00% Amid Steady Inflation", source: "LSE Market Wire", time: "1 hour ago", snippet: "Monetary Policy Committee signals measured approach to future interest rate adjustments, bolstering gilt yields."),
        (title: "FTSE 100 Gains 0.4% as Healthcare and Defense Giants Rally", source: "Financial Intelligence", time: "3 hours ago", snippet: "AstraZeneca and BAE Systems lead benchmark index upward amidst positive clinical trial data releases."),
        (title: "HMRC Reminds High Earners of Pension Tapering Rules Ahead of Autumn Budget", source: "UK Tax Review", time: "1 day ago", snippet: "Financial planners urge strategic utilization of SIPP carry-forward allowances prior to potential fiscal policy amendments.")
    ]

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
                        Text("Market Intelligence News")
                            .font(.system(size: 16, weight: .heavy))
                            .foregroundColor(.white)
                        Text("London Stock Exchange & UK Fiscal Updates")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "94A3B8"))
                    }
                    Spacer()
                }

                ForEach(news, id: \.title) { n in
                    VStack(alignment: .leading, spacing: 6) {
                        HStack {
                            Text(n.source)
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(Color(hex: "00F0FF"))
                            Spacer()
                            Text(n.time)
                                .font(.system(size: 11))
                                .foregroundColor(Color(hex: "94A3B8"))
                        }
                        Text(n.title)
                            .font(.system(size: 15, weight: .black))
                            .foregroundColor(.white)
                        Text(n.snippet)
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "CBD5E1"))
                            .lineSpacing(3)
                    }
                    .padding(18)
                    .background(Color(hex: "071322").opacity(0.85))
                    .cornerRadius(18)
                    .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color(hex: "00F0FF").opacity(0.25), lineWidth: 1))
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .padding(.bottom, 24)
        }
    }
}
