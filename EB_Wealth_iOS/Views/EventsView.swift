import SwiftUI

public struct EventsView: View {
    public var onBack: () -> Void
    @State private var registeredEvents: Set<Int> = [1]

    public init(onBack: @escaping () -> Void = {}) {
        self.onBack = onBack
    }

    private let events = [
        (id: 1, title: "UK Tax-Year-End Wealth Masterclass 2024/25", date: "Thursday, 24 Oct • 18:30 GMT", host: "EB Wealth Institutional Desk", desc: "Comprehensive walkthrough on how to maximize your £20,000 ISA, £3,000 CGT exemption, and SIPP relief."),
        (id: 2, title: "Global ETF Asset Allocation & Rebalancing", date: "Tuesday, 29 Oct • 19:00 GMT", host: "Senior Portfolio Strategist", desc: "Deep dive into market-cap weighting vs equal weighting with live institutional Q&A.")
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
                        Text("Live Investor Events")
                            .font(.system(size: 16, weight: .heavy))
                            .foregroundColor(.white)
                        Text("Institutional workshops & webinars")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "94A3B8"))
                    }
                    Spacer()
                }

                ForEach(events, id: \.id) { e in
                    VStack(alignment: .leading, spacing: 8) {
                        Text(e.date)
                            .font(.system(size: 11, weight: .black))
                            .foregroundColor(Color(hex: "FBBF24"))
                        Text(e.title)
                            .font(.system(size: 16, weight: .black))
                            .foregroundColor(.white)
                        Text("Presented by \(e.host)")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "94A3B8"))
                        Text(e.desc)
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "CBD5E1"))
                            .lineSpacing(3)

                        Button(action: {
                            if registeredEvents.contains(e.id) { registeredEvents.remove(e.id) }
                            else { registeredEvents.insert(e.id) }
                        }) {
                            Text(registeredEvents.contains(e.id) ? "✓ Registered" : "Register for Webinar")
                                .font(.system(size: 12, weight: .heavy))
                                .foregroundColor(registeredEvents.contains(e.id) ? Color(hex: "10B981") : Color(hex: "040B14"))
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 10)
                                .background(registeredEvents.contains(e.id) ? Color(hex: "10B981").opacity(0.15) : Color(hex: "00F0FF"))
                                .cornerRadius(10)
                                .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "00F0FF"), lineWidth: 1))
                        }
                        .padding(.top, 4)
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
