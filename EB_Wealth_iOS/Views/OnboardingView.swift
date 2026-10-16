import SwiftUI

public struct OnboardingView: View {
    public var onBack: () -> Void
    @State private var timeHorizon: String = "10+ Years"
    @State private var riskProfile: String = "Balanced Growth"

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
                        Text("Investor Suitability Mandate")
                            .font(.system(size: 16, weight: .heavy))
                            .foregroundColor(.white)
                        Text("FCA-mandated risk profiling assessment")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "94A3B8"))
                    }
                    Spacer()
                }

                VStack(alignment: .leading, spacing: 12) {
                    Text("1. Investment Time Horizon")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(.white)

                    optionButton(title: "10+ Years (Long-Term Compounding)", isSelected: timeHorizon == "10+ Years") {
                        timeHorizon = "10+ Years"
                    }
                    optionButton(title: "5-10 Years (Balanced Growth)", isSelected: timeHorizon == "5-10 Years") {
                        timeHorizon = "5-10 Years"
                    }
                    optionButton(title: "Under 5 Years (Capital Preservation)", isSelected: timeHorizon == "Under 5 Years") {
                        timeHorizon = "Under 5 Years"
                    }
                }
                .padding(18)
                .background(Color(hex: "071322").opacity(0.85))
                .cornerRadius(18)
                .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color(hex: "00F0FF").opacity(0.25), lineWidth: 1))

                VStack(alignment: .leading, spacing: 12) {
                    Text("2. Risk Tolerance Profile")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(.white)

                    optionButton(title: "Balanced Growth (Global ETFs & Index Funds)", isSelected: riskProfile == "Balanced Growth") {
                        riskProfile = "Balanced Growth"
                    }
                    optionButton(title: "Aggressive Expansion (Tech & Growth)", isSelected: riskProfile == "Aggressive") {
                        riskProfile = "Aggressive"
                    }
                    optionButton(title: "Conservative (Cash Equivalents & Gilts)", isSelected: riskProfile == "Conservative") {
                        riskProfile = "Conservative"
                    }
                }
                .padding(18)
                .background(Color(hex: "071322").opacity(0.85))
                .cornerRadius(18)
                .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color(hex: "00F0FF").opacity(0.25), lineWidth: 1))

                Button(action: onBack) {
                    Text("Save Updated Mandate")
                        .font(.system(size: 13, weight: .heavy))
                        .foregroundColor(Color(hex: "040B14"))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(Color(hex: "FBBF24"))
                        .cornerRadius(12)
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .padding(.bottom, 24)
        }
    }

    private func optionButton(title: String, isSelected: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack {
                Text(title).font(.system(size: 12)).foregroundColor(.white)
                Spacer()
                Image(systemName: isSelected ? "largecircle.fill.circle" : "circle")
                    .foregroundColor(isSelected ? Color(hex: "00F0FF") : Color(hex: "64748B"))
            }
            .padding(12)
            .background(Color.white.opacity(0.04))
            .cornerRadius(10)
            .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "00F0FF").opacity(isSelected ? 0.6 : 0.2), lineWidth: 1))
        }
    }
}
