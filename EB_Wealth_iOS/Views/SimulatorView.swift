import SwiftUI

public struct SimulatorView: View {
    public var onBack: () -> Void
    @State private var initial: Double = 5000
    @State private var monthly: Double = 500
    @State private var years: Double = 20
    @State private var rate: Double = 8.5

    public init(onBack: @escaping () -> Void = {}) {
        self.onBack = onBack
    }

    private var futureValue: Double {
        let r = rate / 100.0
        let months = years * 12.0
        let monthlyRate = r / 12.0
        let fvInitial = initial * pow(1.0 + monthlyRate, months)
        let fvMonthly = monthlyRate > 0 ? monthly * ((pow(1.0 + monthlyRate, months) - 1.0) / monthlyRate) : monthly * months
        return fvInitial + fvMonthly
    }

    private var totalInvested: Double {
        initial + (monthly * years * 12.0)
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
                        Text("Compound Growth Simulator")
                            .font(.system(size: 16, weight: .heavy))
                            .foregroundColor(.white)
                        Text("Forecast multi-decade wealth trajectory")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "94A3B8"))
                    }
                    Spacer()
                }

                // Projected Wealth Result Card
                VStack(spacing: 6) {
                    Text("PROJECTED PORTFOLIO WEALTH")
                        .font(.system(size: 11, weight: .black))
                        .foregroundColor(Color(hex: "FBBF24"))
                    Text("£\(String(format: "%.0f", futureValue))")
                        .font(.system(size: 36, weight: .black))
                        .foregroundColor(Color(hex: "00F0FF"))
                    HStack(spacing: 16) {
                        Text("Total Invested: £\(String(format: "%.0f", totalInvested))")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "94A3B8"))
                        Text("Growth: +£\(String(format: "%.0f", futureValue - totalInvested))")
                            .font(.system(size: 11, weight: .heavy))
                            .foregroundColor(Color(hex: "10B981"))
                    }
                }
                .padding(20)
                .frame(maxWidth: .infinity)
                .background(Color(hex: "071322").opacity(0.85))
                .cornerRadius(18)
                .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color(hex: "FBBF24").opacity(0.4), lineWidth: 1))

                // Interactive Sliders
                VStack(spacing: 14) {
                    sliderRow(label: "Initial Lump Sum", value: "£\(Int(initial))", range: 0...50000, step: 500, val: $initial)
                    sliderRow(label: "Monthly Contribution", value: "£\(Int(monthly))/mo", range: 50...2500, step: 50, val: $monthly)
                    sliderRow(label: "Time Horizon", value: "\(Int(years)) Years", range: 5...40, step: 1, val: $years)
                    sliderRow(label: "Estimated Return Rate", value: "\(String(format: "%.1f", rate))%", range: 3...15, step: 0.5, val: $rate)
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

    private func sliderRow(label: String, value: String, range: ClosedRange<Double>, step: Double, val: Binding<Double>) -> some View {
        VStack(spacing: 4) {
            HStack {
                Text(label).font(.system(size: 12)).foregroundColor(.white)
                Spacer()
                Text(value).font(.system(size: 12, weight: .heavy)).foregroundColor(Color(hex: "00F0FF"))
            }
            Slider(value: val, in: range, step: step)
                .accentColor(Color(hex: "00F0FF"))
        }
    }
}
